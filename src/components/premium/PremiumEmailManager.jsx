// PremiumEmailManager.jsx
// This component allows premium users to manage their snakkaz.com email accounts

import { useState, useEffect } from 'react';
import { Button, Input, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, MailIcon, ShieldIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

const PremiumEmailManager = () => {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userEmails, setUserEmails] = useState([]);
  const [newEmail, setNewEmail] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordChange, setPasswordChange] = useState({
    username: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && isPremium) {
      fetchUserEmails();
    }
  }, [user, isPremium]);

  const fetchUserEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/premium/emails', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUserEmails(data.emails || []);
      } else {
        toast({
          title: 'Error fetching emails',
          description: data.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching user emails:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your email accounts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateNewEmail = () => {
    const errors = {};
    
    if (!newEmail.username) {
      errors.username = 'Username is required';
    } else if (!/^[a-z0-9._-]+$/i.test(newEmail.username)) {
      errors.username = 'Username can only contain letters, numbers, periods, underscores, and hyphens';
    }
    
    if (!newEmail.password) {
      errors.password = 'Password is required';
    } else if (newEmail.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (newEmail.password !== newEmail.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const validatePasswordChange = () => {
    const errors = {};
    
    if (!passwordChange.username) {
      errors.changeUsername = 'Please select an email account';
    }
    
    if (!passwordChange.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordChange.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleCreateEmail = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateNewEmail();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    setLoading(true);
    
    try {
      const response = await fetch('/api/premium/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newEmail.username,
          password: newEmail.password,
          quota: 250, // Default quota in MB
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Success!',
          description: `Your email ${data.email} has been created`,
          variant: 'success',
        });
        
        // Reset form and refresh email list
        setNewEmail({
          username: '',
          password: '',
          confirmPassword: '',
        });
        fetchUserEmails();
      } else {
        toast({
          title: 'Error creating email',
          description: data.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating email:', error);
      toast({
        title: 'Error',
        description: 'Failed to create email account',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    const validationErrors = validatePasswordChange();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    setLoading(true);
    
    try {
      const response = await fetch(`/api/premium/emails/${passwordChange.username}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: passwordChange.newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Password Updated',
          description: 'Your email password has been changed successfully',
          variant: 'success',
        });
        
        // Reset form
        setPasswordChange({
          username: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast({
          title: 'Error changing password',
          description: data.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: 'Error',
        description: 'Failed to change email password',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmail = async (username) => {
    if (!confirm(`Are you sure you want to delete ${username}@snakkaz.com? This action cannot be undone.`)) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`/api/premium/emails/${username}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Email Deleted',
          description: `The email account ${username}@snakkaz.com has been deleted`,
          variant: 'success',
        });
        fetchUserEmails();
      } else {
        toast({
          title: 'Error deleting email',
          description: data.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting email:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete email account',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isPremium) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MailIcon className="h-5 w-5" />
            Premium Email Accounts
          </CardTitle>
          <CardDescription>
            Create and manage your own @snakkaz.com email addresses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="warning">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Premium Feature</AlertTitle>
            <AlertDescription>
              Email accounts are only available to premium Snakkaz members. 
              Upgrade your subscription to access this feature.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button variant="default" className="w-full">
            Upgrade to Premium
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MailIcon className="h-5 w-5" />
          Premium Email Accounts
        </CardTitle>
        <CardDescription>
          Create and manage your own @snakkaz.com email addresses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="myEmails" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="myEmails">My Emails</TabsTrigger>
            <TabsTrigger value="create">Create Email</TabsTrigger>
            <TabsTrigger value="manage">Manage Password</TabsTrigger>
          </TabsList>
          
          <TabsContent value="myEmails">
            {userEmails.length === 0 ? (
              <div className="text-center py-8">
                <MailIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No email accounts yet</h3>
                <p className="mt-1 text-gray-500">
                  Create your first @snakkaz.com email address
                </p>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {userEmails.map((email) => (
                  <div key={email.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{email.email_address}</p>
                      <p className="text-sm text-gray-500">Quota: {email.quota_mb} MB</p>
                    </div>
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setPasswordChange({
                            ...passwordChange,
                            username: email.email_username
                          });
                          document.querySelector('button[value="manage"]').click();
                        }}
                      >
                        Change Password
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteEmail(email.email_username)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">How to access your email</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Webmail:</strong> <a href="https://premium123.web-hosting.com:2096" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">premium123.web-hosting.com:2096</a></p>
                    <p><strong>SMTP Server:</strong> premium123.web-hosting.com</p>
                    <p><strong>SMTP Port:</strong> 465 (SSL/TLS) or 587 (STARTTLS)</p>
                    <p><strong>IMAP Server:</strong> premium123.web-hosting.com</p>
                    <p><strong>IMAP Port:</strong> 993 (SSL/TLS)</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="create">
            <form onSubmit={handleCreateEmail} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="username">Email Username</Label>
                <div className="flex">
                  <Input
                    id="username"
                    placeholder="username"
                    value={newEmail.username}
                    onChange={(e) => setNewEmail({ ...newEmail, username: e.target.value })}
                    className={errors.username ? 'border-red-500' : ''}
                  />
                  <span className="flex items-center px-3 bg-gray-100 border border-l-0 rounded-r-md">
                    @snakkaz.com
                  </span>
                </div>
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter a strong password"
                  value={newEmail.password}
                  onChange={(e) => setNewEmail({ ...newEmail, password: e.target.value })}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={newEmail.confirmPassword}
                  onChange={(e) => setNewEmail({ ...newEmail, confirmPassword: e.target.value })}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
              
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Email Quota</AlertTitle>
                <AlertDescription>
                  Your email account will have a standard quota of 250 MB.
                </AlertDescription>
              </Alert>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Email Account'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="manage">
            <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="emailSelect">Select Email Account</Label>
                <select
                  id="emailSelect"
                  value={passwordChange.username}
                  onChange={(e) => setPasswordChange({ ...passwordChange, username: e.target.value })}
                  className={`w-full p-2 border rounded-md ${errors.changeUsername ? 'border-red-500' : ''}`}
                >
                  <option value="">Select an email account</option>
                  {userEmails.map((email) => (
                    <option key={email.id} value={email.email_username}>
                      {email.email_address}
                    </option>
                  ))}
                </select>
                {errors.changeUsername && (
                  <p className="text-red-500 text-sm">{errors.changeUsername}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter a new password"
                  value={passwordChange.newPassword}
                  onChange={(e) => setPasswordChange({ ...passwordChange, newPassword: e.target.value })}
                  className={errors.newPassword ? 'border-red-500' : ''}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm">{errors.newPassword}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  value={passwordChange.confirmPassword}
                  onChange={(e) => setPasswordChange({ ...passwordChange, confirmPassword: e.target.value })}
                  className={errors.confirmNewPassword ? 'border-red-500' : ''}
                />
                {errors.confirmNewPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmNewPassword}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PremiumEmailManager;
