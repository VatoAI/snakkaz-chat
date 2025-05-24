/**
 * Group Poll System Component for Snakkaz Chat
 * 
 * This component implements a polling/voting system for group chats,
 * allowing users to create polls, vote, and view results in real-time.
 */

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart, Check, ChevronDown, ChevronUp, X, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

// Poll option interface
interface PollOption {
  id: string;
  text: string;
  votes: number;
}

// Poll interface
interface Poll {
  id: string;
  groupId: string;
  createdBy: string;
  question: string;
  options: PollOption[];
  createdAt: string;
  expiresAt: string | null;
  isAnonymous: boolean;
  isMultiSelect: boolean;
  isActive: boolean;
}

// User vote interface
interface UserVote {
  userId: string;
  pollId: string;
  optionId: string;
  votedAt: string;
}

interface GroupPollSystemProps {
  groupId: string;
  currentUserId: string;
  isAdmin: boolean;
  canCreatePolls?: boolean;
}

export function GroupPollSystem({
  groupId,
  currentUserId,
  isAdmin,
  canCreatePolls = isAdmin // Default to isAdmin if not provided
}: GroupPollSystemProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [expiresIn, setExpiresIn] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [expandedPollId, setExpandedPollId] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, string[]>>({});
  const [isLoadingPolls, setIsLoadingPolls] = useState(true);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  
  const { toast } = useToast();

  // Fetch polls from database
  const fetchPolls = useCallback(async () => {
    try {
      setIsLoadingPolls(true);
      
      // Fetch polls
      const { data: pollsData, error: pollsError } = await supabase
        .from('group_polls')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });
        
      if (pollsError) throw pollsError;
      
      // Fetch votes made by current user
      const { data: votesData, error: votesError } = await supabase
        .from('poll_votes')
        .select('poll_id, option_id')
        .eq('user_id', currentUserId);
        
      if (votesError) throw votesError;
      
      // Convert votes to record for easy lookup
      const userVotesMap: Record<string, string[]> = {};
      votesData?.forEach(vote => {
        if (!userVotesMap[vote.poll_id]) {
          userVotesMap[vote.poll_id] = [];
        }
        userVotesMap[vote.poll_id].push(vote.option_id);
      });
      
      setUserVotes(userVotesMap);
      setPolls(pollsData || []);
    } catch (error) {
      console.error('Failed to fetch polls:', error);
      toast({
        title: "Failed to load polls",
        description: "Could not load poll data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPolls(false);
    }
  }, [groupId, currentUserId, toast]);
  
  // Load polls for this group
  useEffect(() => {
    fetchPolls();
    
    // Set up real-time subscription for poll updates
    const pollsSubscription = supabase
      .channel('group-polls')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'group_polls',
        filter: `group_id=eq.${groupId}`
      }, () => {
        fetchPolls();
      })
      .subscribe();
      
    const votesSubscription = supabase
      .channel('poll-votes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'poll_votes',
      }, () => {
        fetchPolls();
      })
      .subscribe();
      
    return () => {
      pollsSubscription.unsubscribe();
      votesSubscription.unsubscribe();
    };
  }, [groupId, fetchPolls]);

  // Add a new poll option input
  const addOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  // Remove a poll option input
  const removeOption = (index: number) => {
    const newOptions = [...pollOptions];
    newOptions.splice(index, 1);
    setPollOptions(newOptions);
  };

  // Update a poll option
  const updateOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  // Create a new poll
  const handleCreatePoll = async () => {
    if (!pollQuestion.trim()) {
      toast({
        title: "Missing Question",
        description: "Please provide a poll question.",
        variant: "destructive",
      });
      return;
    }
    
    // Filter out empty options and check if we have at least 2
    const validOptions = pollOptions.filter(opt => opt.trim() !== "");
    if (validOptions.length < 2) {
      toast({
        title: "Not Enough Options",
        description: "Please provide at least 2 options.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreatingPoll(true);
    
    try {
      // Calculate expiration date if set
      let expiresAt = null;
      if (expiresIn) {
        const hours = parseInt(expiresIn);
        expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
      }
      
      // Create poll options data
      const options = validOptions.map(text => ({
        id: crypto.randomUUID(),
        text,
        votes: 0
      }));
      
      // Insert the poll
      const { data, error } = await supabase
        .from('group_polls')
        .insert({
          group_id: groupId,
          created_by: currentUserId,
          question: pollQuestion,
          options,
          expires_at: expiresAt,
          is_anonymous: isAnonymous,
          is_multi_select: isMultiSelect,
          is_active: true
        })
        .select();
        
      if (error) throw error;
      
      // Notify users about the new poll
      const announcementType = isAnonymous ? 'anonymous' : 'standard';
      await supabase
        .from('group_messages')
        .insert({
          group_id: groupId,
          sender_id: currentUserId,
          content: `📊 **New Poll Created**: "${pollQuestion}"`,
          message_type: 'system',
          metadata: {
            type: 'poll_created',
            poll_id: data[0].id,
            anonymous: isAnonymous,
            multi_select: isMultiSelect
          }
        });
      
      // Reset form state
      setPollQuestion("");
      setPollOptions(["", ""]);
      setExpiresIn(null);
      setIsAnonymous(false);
      setIsMultiSelect(false);
      setShowCreateDialog(false);
      
      // Show success message
      toast({
        title: "Poll Created",
        description: "Your poll has been created successfully.",
      });
      
      // Refresh polls
      fetchPolls();
      
    } catch (error) {
      console.error('Failed to create poll:', error);
      toast({
        title: "Poll Creation Failed",
        description: "Could not create your poll. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPoll(false);
    }
  };

  // Toggle expanded view for a poll
  const toggleExpandPoll = (pollId: string) => {
    setExpandedPollId(expandedPollId === pollId ? null : pollId);
  };

  // Submit a vote for a poll option
  const submitVote = async (pollId: string, optionId: string, poll: Poll) => {
    if (isSubmittingVote) return;
    
    setIsSubmittingVote(true);
    
    try {
      // Check if user has already voted on this poll
      const existingVotes = userVotes[pollId] || [];
      
      if (!poll.isMultiSelect && existingVotes.length > 0) {
        // For single-select polls, delete existing vote if any
        await supabase
          .from('poll_votes')
          .delete()
          .eq('user_id', currentUserId)
          .eq('poll_id', pollId);
      } else if (poll.isMultiSelect && existingVotes.includes(optionId)) {
        // For multi-select, if voting for same option, remove the vote
        await supabase
          .from('poll_votes')
          .delete()
          .eq('user_id', currentUserId)
          .eq('poll_id', pollId)
          .eq('option_id', optionId);
          
        setIsSubmittingVote(false);
        return;
      }
      
      // Insert the new vote
      const { error } = await supabase
        .from('poll_votes')
        .insert({
          user_id: currentUserId,
          poll_id: pollId,
          option_id: optionId,
          voted_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      // Update local state for immediate feedback
      const newUserVotes = { ...userVotes };
      if (!newUserVotes[pollId]) {
        newUserVotes[pollId] = [];
      }
      if (!poll.isMultiSelect) {
        newUserVotes[pollId] = [optionId];
      } else {
        newUserVotes[pollId].push(optionId);
      }
      setUserVotes(newUserVotes);
      
      // Refresh polls
      fetchPolls();
      
    } catch (error) {
      console.error('Failed to submit vote:', error);
      toast({
        title: "Vote Failed",
        description: "Could not submit your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingVote(false);
    }
  };

  // Calculate percentages for poll options
  const calculatePercentage = (votes: number, poll: Poll) => {
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };
  
  // Check if a poll has expired
  const isPollExpired = (poll: Poll) => {
    if (!poll.expiresAt) return false;
    return new Date(poll.expiresAt) < new Date();
  };
  
  // Close a poll
  const closePoll = async (pollId: string) => {
    try {
      await supabase
        .from('group_polls')
        .update({ is_active: false })
        .eq('id', pollId);
        
      toast({
        title: "Poll Closed",
        description: "The poll has been closed successfully.",
      });
      
      // Refresh polls
      fetchPolls();
      
    } catch (error) {
      console.error('Failed to close poll:', error);
      toast({
        title: "Action Failed",
        description: "Could not close the poll. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format the time remaining for a poll
  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };

  return (
    <div className="space-y-4 py-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-cybergold-200 flex items-center">
          <BarChart className="mr-2 h-5 w-5 text-cybergold-400" />
          Group Polls
        </h3>
        
        {isAdmin && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-950/30"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Poll
              </Button>
            </DialogTrigger>
            
            <DialogContent className="bg-cyberdark-900 border-cybergold-500/30">
              <DialogHeader>
                <DialogTitle className="text-cybergold-200">Create a New Poll</DialogTitle>
                <DialogDescription className="text-cybergold-400">
                  Create a poll for group members to vote on
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="question" className="text-cybergold-200">Poll Question</Label>
                  <Input
                    id="question"
                    placeholder="What would you like to ask?"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    className="bg-cyberdark-950 border-cybergold-500/30 text-cybergold-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-cybergold-200">Options</Label>
                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="bg-cyberdark-950 border-cybergold-500/30 text-cybergold-200"
                      />
                      {index > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}
                          className="h-8 w-8 text-cybergold-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addOption}
                    className="text-cybergold-400 hover:text-cybergold-300"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expires" className="text-cybergold-200">Expires In (Optional)</Label>
                    <select
                      id="expires"
                      value={expiresIn || ""}
                      onChange={(e) => setExpiresIn(e.target.value || null)}
                      className="w-full h-9 px-3 py-1 rounded-md bg-cyberdark-950 border border-cybergold-500/30 text-cybergold-200"
                    >
                      <option value="">No Expiration</option>
                      <option value="1">1 Hour</option>
                      <option value="6">6 Hours</option>
                      <option value="24">24 Hours</option>
                      <option value="48">2 Days</option>
                      <option value="168">7 Days</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="anonymous" className="text-cybergold-200">Anonymous Voting</Label>
                      <p className="text-xs text-cybergold-500">Votes will be anonymous</p>
                    </div>
                    <Switch
                      id="anonymous"
                      checked={isAnonymous}
                      onCheckedChange={setIsAnonymous}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="multiselect" className="text-cybergold-200">Multiple Selections</Label>
                      <p className="text-xs text-cybergold-500">Allow voting for multiple options</p>
                    </div>
                    <Switch
                      id="multiselect"
                      checked={isMultiSelect}
                      onCheckedChange={setIsMultiSelect}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  disabled={isCreatingPoll}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePoll}
                  disabled={isCreatingPoll}
                  className="bg-cybergold-600 hover:bg-cybergold-700 text-cyberdark-950"
                >
                  {isCreatingPoll ? 'Creating...' : 'Create Poll'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {isLoadingPolls ? (
        <div className="text-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-36 bg-cyberdark-800 rounded-md mb-4"></div>
            <div className="h-4 w-48 bg-cyberdark-800 rounded-md"></div>
          </div>
        </div>
      ) : polls.length === 0 ? (
        <div className="text-center py-6 bg-cyberdark-900/50 rounded-lg">
          <BarChart className="h-10 w-10 text-cybergold-400/50 mx-auto mb-2" />
          <p className="text-cybergold-500">No polls have been created yet.</p>
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="mt-2 text-cybergold-400 hover:text-cybergold-300"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create First Poll
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {polls
            .sort((a, b) => {
              // Sort by active status first, then by creation date
              if (a.isActive && !b.isActive) return -1;
              if (!a.isActive && b.isActive) return 1;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .map(poll => {
              const isExpanded = expandedPollId === poll.id;
              const hasVoted = userVotes[poll.id]?.length > 0;
              const isExpired = isPollExpired(poll);
              const canVote = poll.isActive && !isExpired;
              const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
              
              return (
                <Card key={poll.id} className={`bg-cyberdark-800/50 border-${poll.isActive ? 'cybergold' : 'gray'}-500/30`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base text-cybergold-200">{poll.question}</CardTitle>
                        <CardDescription className="text-cybergold-500 text-xs">
                          Created {format(new Date(poll.createdAt), 'MMM d, yyyy')}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        {poll.expiresAt && poll.isActive && (
                          <Badge variant="outline" className="bg-cyberdark-900/70 border-cybergold-500/30 text-xs py-0 px-2">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimeRemaining(poll.expiresAt)}
                          </Badge>
                        )}
                        
                        {!poll.isActive && (
                          <Badge variant="outline" className="bg-cyberdark-900/70 border-gray-500/30 text-xs py-0 px-2 text-gray-400">
                            Closed
                          </Badge>
                        )}
                        
                        {poll.isAnonymous && (
                          <Badge variant="outline" className="bg-cyberdark-900/70 border-blue-500/30 text-xs py-0 px-2 text-blue-400">
                            Anonymous
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {poll.options.slice(0, isExpanded ? undefined : 3).map(option => {
                        const percentage = calculatePercentage(option.votes, poll);
                        const isOptionSelected = userVotes[poll.id]?.includes(option.id);
                        
                        return (
                          <div key={option.id} className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center">
                                <button
                                  className={`mr-2 h-5 w-5 rounded ${
                                    isOptionSelected 
                                      ? 'bg-cybergold-600 text-black flex items-center justify-center' 
                                      : 'border border-cybergold-500/50'
                                  } ${!canVote && 'opacity-70 cursor-not-allowed'}`}
                                  onClick={() => canVote && submitVote(poll.id, option.id, poll)}
                                  disabled={!canVote || isSubmittingVote}
                                >
                                  {isOptionSelected && <Check className="h-3 w-3" />}
                                </button>
                                <span className="text-white">{option.text}</span>
                              </div>
                              <span className="text-cybergold-400">{percentage}%</span>
                            </div>
                            
                            <div className="h-2 relative w-full overflow-hidden rounded-full bg-cyberdark-950">
                              <div
                                className="h-full bg-gradient-to-r from-cybergold-700/80 to-cybergold-500/80"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            
                            {(hasVoted || !poll.isActive || isExpired) && (
                              <div className="text-xs text-cybergold-500">
                                {option.votes} vote{option.votes !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      {!isExpanded && poll.options.length > 3 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpandPoll(poll.id)}
                          className="w-full text-xs text-cybergold-400 hover:text-cybergold-300"
                        >
                          Show {poll.options.length - 3} more options
                          <ChevronDown className="h-3 w-3 ml-2" />
                        </Button>
                      )}
                      
                      {isExpanded && poll.options.length > 3 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpandPoll(poll.id)}
                          className="w-full text-xs text-cybergold-400 hover:text-cybergold-300"
                        >
                          Show fewer options
                          <ChevronUp className="h-3 w-3 ml-2" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-1">
                    <div className="text-xs text-cybergold-500">
                      {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                    </div>
                    
                    {isAdmin && poll.isActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => closePoll(poll.id)}
                        className="text-xs h-7 text-gray-400 hover:text-gray-300"
                      >
                        Close Poll
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}
