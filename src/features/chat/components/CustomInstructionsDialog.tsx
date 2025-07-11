import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Settings, Plus, Trash2, Edit3, Save, X } from 'lucide-react';

interface CustomInstruction {
  id: string;
  name: string;
  description: string;
  content: string;
  isActive: boolean;
  createdAt: Date;
}

interface CustomInstructionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInstructionSelect: (instruction: CustomInstruction) => void;
}

export const CustomInstructionsDialog: React.FC<CustomInstructionsDialogProps> = ({
  isOpen,
  onClose,
  onInstructionSelect
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [instructions, setInstructions] = useState<CustomInstruction[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    content: ''
  });

  // Load instructions from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem(`custom_instructions_${user?.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setInstructions(parsed);
      } catch (error) {
        console.error('Error parsing saved instructions:', error);
      }
    }
  }, [user?.id]);

  // Save instructions to localStorage whenever they change
  useEffect(() => {
    if (user?.id && instructions.length > 0) {
      localStorage.setItem(`custom_instructions_${user?.id}`, JSON.stringify(instructions));
    }
  }, [instructions, user?.id]);

  const handleAddInstruction = () => {
    const newInstruction: CustomInstruction = {
      id: Date.now().toString(),
      name: 'Ny instruksjon',
      description: 'Beskriv instruksjonen din her',
      content: '',
      isActive: false,
      createdAt: new Date()
    };
    setInstructions([...instructions, newInstruction]);
    setIsEditing(newInstruction.id);
    setEditForm({
      name: newInstruction.name,
      description: newInstruction.description,
      content: newInstruction.content
    });
  };

  const handleEditInstruction = (instruction: CustomInstruction) => {
    setIsEditing(instruction.id);
    setEditForm({
      name: instruction.name,
      description: instruction.description,
      content: instruction.content
    });
  };

  const handleSaveInstruction = () => {
    if (!isEditing) return;
    
    setInstructions(instructions.map(inst => 
      inst.id === isEditing 
        ? { ...inst, ...editForm }
        : inst
    ));
    setIsEditing(null);
    setEditForm({ name: '', description: '', content: '' });
    
    toast({
      title: "Instruksjon lagret",
      description: "Din tilpassede instruksjon er lagret",
    });
  };

  const handleDeleteInstruction = (id: string) => {
    setInstructions(instructions.filter(inst => inst.id !== id));
    if (isEditing === id) {
      setIsEditing(null);
      setEditForm({ name: '', description: '', content: '' });
    }
    
    toast({
      title: "Instruksjon slettet",
      description: "Instruksjonen er fjernet",
    });
  };

  const handleToggleActive = (id: string) => {
    setInstructions(instructions.map(inst => 
      inst.id === id 
        ? { ...inst, isActive: !inst.isActive }
        : inst
    ));
  };

  const handleUseInstruction = (instruction: CustomInstruction) => {
    onInstructionSelect(instruction);
    onClose();
    toast({
      title: "Instruksjon valgt",
      description: `Bruker instruksjon: ${instruction.name}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cyberdark-900 border-cybergold-500/40 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-cybergold-400 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Tilpassede instruksjoner
          </DialogTitle>
          <DialogDescription className="text-cybergold-600">
            Lag og administrer tilpassede instruksjoner for AI-samtaler
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-cybergold-400">
              Mine instruksjoner ({instructions.length})
            </h3>
            <Button
              onClick={handleAddInstruction}
              className="bg-cybergold-600 text-black hover:bg-cybergold-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ny instruksjon
            </Button>
          </div>

          {instructions.length === 0 ? (
            <Card className="bg-cyberdark-800 border-cybergold-500/30">
              <CardContent className="p-6 text-center">
                <Settings className="h-12 w-12 mx-auto mb-4 text-cybergold-400 opacity-50" />
                <p className="text-cybergold-600">
                  Du har ingen tilpassede instruksjoner ennå.
                </p>
                <p className="text-sm text-cybergold-700 mt-2">
                  Klikk "Ny instruksjon" for å komme i gang.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {instructions.map((instruction) => (
                <Card 
                  key={instruction.id}
                  className={`bg-cyberdark-800 border-cybergold-500/30 ${
                    instruction.isActive ? 'ring-2 ring-cybergold-500/50' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {isEditing === instruction.id ? (
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="bg-cyberdark-700 border-cybergold-500/40 text-cybergold-300 mb-2"
                            placeholder="Navn på instruksjon"
                          />
                        ) : (
                          <CardTitle className="text-cybergold-400 flex items-center gap-2">
                            {instruction.name}
                            {instruction.isActive && (
                              <Badge variant="outline" className="text-green-400 border-green-400">
                                Aktiv
                              </Badge>
                            )}
                          </CardTitle>
                        )}
                        
                        {isEditing === instruction.id ? (
                          <Input
                            value={editForm.description}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            className="bg-cyberdark-700 border-cybergold-500/40 text-cybergold-300"
                            placeholder="Beskrivelse"
                          />
                        ) : (
                          <p className="text-cybergold-600 text-sm">{instruction.description}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {isEditing === instruction.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={handleSaveInstruction}
                              className="bg-green-600 hover:bg-green-500"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setIsEditing(null)}
                              className="border-cybergold-500/40"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditInstruction(instruction)}
                              className="border-cybergold-500/40"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteInstruction(instruction.id)}
                              className="border-red-500/40 text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {isEditing === instruction.id ? (
                      <Textarea
                        value={editForm.content}
                        onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                        className="bg-cyberdark-700 border-cybergold-500/40 text-cybergold-300 min-h-[100px]"
                        placeholder="Skriv instruksjonen din her..."
                      />
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-cyberdark-700 p-3 rounded border border-cybergold-500/30">
                          <p className="text-cybergold-300 text-sm whitespace-pre-wrap">
                            {instruction.content || 'Ingen innhold ennå...'}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleActive(instruction.id)}
                            className={instruction.isActive 
                              ? "border-green-400 text-green-400 hover:bg-green-500/10"
                              : "border-cybergold-500/40"
                            }
                          >
                            {instruction.isActive ? 'Deaktiver' : 'Aktiver'}
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={() => handleUseInstruction(instruction)}
                            className="bg-cybergold-600 text-black hover:bg-cybergold-500"
                          >
                            Bruk instruksjon
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};