// PremiumEmailManager.tsx
// Component for managing premium email accounts

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertCircle, 
  Check, 
  Copy, 
  Mail, 
  Plus, 
  RefreshCw, 
  Trash2, 
  ExternalLink
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { passwordStrength } from 'check-password-strength'

// Types for email accounts
interface EmailAccount {
  id: string
  email_username: string
  email_address: string
  quota_mb: number
  created_at: string
}

export default function PremiumEmailManager() {
  const { user, isPremium } = useAuth()
  const { toast } = useToast()
  const [emails, setEmails] = useState<EmailAccount[]>([])
  const [isLoadingEmails, setIsLoadingEmails] = useState(false)
  const [newEmailUsername, setNewEmailUsername] = useState('')
  const [newEmailPassword, setNewEmailPassword] = useState('')
  const [newEmailQuota, setNewEmailQuota] = useState(250)
  const [passwordStrengthLevel, setPasswordStrengthLevel] = useState(0)
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreatingEmail, setIsCreatingEmail] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Password reset states
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [resetUsername, setResetUsername] = useState('')
  const [resetPassword, setResetPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false)
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null)
  const [resetPasswordStrength, setResetPasswordStrength] = useState(0)

  // Password strength indicator colors
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
  const strengthLabels = ['Svakt', 'Middels', 'Sterkt', 'Svært sterkt']

  // Fetch user's email accounts
  useEffect(() => {
    const fetchEmails = async () => {
      if (!user || !isPremium) return
      
      setIsLoadingEmails(true)
      setError(null)
      
      try {
        const response = await fetch('/api/premium/emails')
        const data = await response.json()
        
        if (data.success) {
          setEmails(data.emails || [])
        } else {
          setError(data.message || 'Failed to load email accounts')
        }
      } catch (err) {
        setError('Could not connect to server')
        console.error('Error fetching emails:', err)
      } finally {
        setIsLoadingEmails(false)
      }
    }

    fetchEmails()
  }, [user, isPremium])

  // Check password strength when password changes
  useEffect(() => {
    if (newEmailPassword) {
      const strength = passwordStrength(newEmailPassword)
      setPasswordStrengthLevel(strength.id)
    } else {
      setPasswordStrengthLevel(0)
    }
  }, [newEmailPassword])

  // Check reset password strength when it changes
  useEffect(() => {
    if (resetPassword) {
      const strength = passwordStrength(resetPassword)
      setResetPasswordStrength(strength.id)
    } else {
      setResetPasswordStrength(0)
    }
  }, [resetPassword])

  // Create new email account
  const handleCreateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordStrengthLevel < 1) {
      toast({
        title: "Svakt passord",
        description: "Vennligst velg et sterkere passord",
        variant: "destructive"
      })
      return
    }

    setIsCreatingEmail(true)
    setError(null)
    
    try {
      const response = await fetch('/api/premium/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: newEmailUsername,
          password: newEmailPassword,
          quota: newEmailQuota
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "E-post opprettet",
          description: `${data.email} har blitt opprettet`,
          variant: "default"
        })
        
        // Add new email to list
        setEmails(prev => [...prev, data.email])
        
        // Reset form
        setNewEmailUsername('')
        setNewEmailPassword('')
        setIsCreateDialogOpen(false)
      } else {
        setError(data.message || 'Kunne ikke opprette e-postkonto')
        toast({
          title: "Feil ved opprettelse",
          description: data.message || 'Kunne ikke opprette e-postkonto',
          variant: "destructive"
        })
      }
    } catch (err) {
      setError('Kunne ikke koble til serveren')
      console.error('Error creating email:', err)
    } finally {
      setIsCreatingEmail(false)
    }
  }

  // Delete email account
  const handleDeleteEmail = async (username: string) => {
    if (!confirm(`Er du sikker på at du vil slette ${username}@snakkaz.com?`)) {
      return
    }
    
    setIsDeleting(username)
    
    try {
      const response = await fetch(`/api/premium/emails/${username}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "E-post slettet",
          description: `${username}@snakkaz.com har blitt slettet`,
          variant: "default"
        })
        
        // Remove deleted email from list
        setEmails(prev => prev.filter(email => email.email_username !== username))
      } else {
        toast({
          title: "Feil ved sletting",
          description: data.message || 'Kunne ikke slette e-postkonto',
          variant: "destructive"
        })
      }
    } catch (err) {
      console.error('Error deleting email:', err)
      toast({
        title: "Feil ved sletting",
        description: 'Kunne ikke koble til serveren',
        variant: "destructive"
      })
    } finally {
      setIsDeleting(null)
    }
  }

  // Reset password for an email account
  const handleResetPassword = async (username: string) => {
    // Set up for password reset dialog
    setResetUsername(username)
    setResetPassword('')
    setResetPasswordError(null)
    setResetPasswordStrength(0)
    setIsResetPasswordDialogOpen(true)
  }
  
  // Submit password reset
  const handleSubmitPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (resetPasswordStrength < 1) {
      toast({
        title: "Svakt passord",
        description: "Vennligst velg et sterkere passord",
        variant: "destructive"
      })
      return
    }

    setIsChangingPassword(true)
    setResetPasswordError(null)
    
    try {
      const response = await fetch(`/api/premium/emails/${resetUsername}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: resetPassword
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Passord endret",
          description: `Passordet for ${resetUsername}@snakkaz.com har blitt endret`,
          variant: "default"
        })
        
        // Close dialog and reset form
        setIsResetPasswordDialogOpen(false)
        setResetPassword('')
      } else {
        setResetPasswordError(data.message || 'Kunne ikke endre passord')
        toast({
          title: "Feil ved passordendring",
          description: data.message || 'Kunne ikke endre passord',
          variant: "destructive"
        })
      }
    } catch (err) {
      setResetPasswordError('Kunne ikke koble til serveren')
      console.error('Error changing password:', err)
      toast({
        title: "Feil ved passordendring",
        description: 'Kunne ikke koble til serveren',
        variant: "destructive"
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Copy email address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Kopiert",
      description: `${text} kopiert til utklippstavlen`,
      variant: "default"
    })
  }

  // Combine loading states for user and emails
  const isLoading = isLoadingEmails || !user;

  // If user is not premium, show upgrade message
  if (!isPremium && !isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Premium E-post</CardTitle>
          <CardDescription>Oppgrader til Premium for å få din egen @snakkaz.com e-postadresse</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
            <Mail size={64} className="text-muted-foreground" />
            <h3 className="text-lg font-semibold">Få din egen @snakkaz.com e-postadresse</h3>
            <p className="text-muted-foreground">
              Med et premium-abonnement kan du opprette din egen e-postadresse og bruke den med hvilken som helst e-postklient.
            </p>
            <Button variant="default" size="lg">
              Oppgrader til Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <RefreshCw size={24} className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      {/* Password Reset Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Endre passord</DialogTitle>
            <DialogDescription>
              Endre passord for {resetUsername}@snakkaz.com
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPasswordReset}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reset-password" className="text-right">
                  Nytt passord
                </Label>
                <div className="col-span-3">
                  <div className="relative">
                    <Input
                      id="reset-password"
                      type={resetPasswordVisible ? "text" : "password"}
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      placeholder="********"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setResetPasswordVisible(!resetPasswordVisible)}
                    >
                      {resetPasswordVisible ? "Skjul" : "Vis"}
                    </button>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {[0, 1, 2, 3].map((level) => (
                      <div 
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          level <= resetPasswordStrength ? strengthColors[resetPasswordStrength] : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-right mt-1">
                    {resetPassword ? strengthLabels[resetPasswordStrength] : ""}
                  </div>
                </div>
              </div>
            </div>
            {resetPasswordError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Feil</AlertTitle>
                <AlertDescription>{resetPasswordError}</AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isChangingPassword || !resetPassword}
              >
                {isChangingPassword ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Endrer passord...
                  </>
                ) : (
                  "Endre passord"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Main Card */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Premium E-postadresser</CardTitle>
            <CardDescription>Administrer dine @snakkaz.com e-postadresser</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Ny e-postadresse
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Opprett ny e-postadresse</DialogTitle>
                <DialogDescription>
                  Lag en ny @snakkaz.com e-postadresse for din Premium-konto
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateEmail}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Brukernavn
                    </Label>
                    <div className="col-span-3 flex items-center">
                      <Input
                        id="username"
                        value={newEmailUsername}
                        onChange={(e) => setNewEmailUsername(e.target.value.toLowerCase())}
                        placeholder="brukernavn"
                        required
                        autoComplete="off"
                        pattern="[a-zA-Z0-9._-]+"
                        title="Kun bokstaver, tall, punktum, bindestrek og understrek er tillatt"
                      />
                      <span className="ml-2 text-muted-foreground">@snakkaz.com</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Passord
                    </Label>
                    <div className="col-span-3">
                      <div className="relative">
                        <Input
                          id="password"
                          type={newPasswordVisible ? "text" : "password"}
                          value={newEmailPassword}
                          onChange={(e) => setNewEmailPassword(e.target.value)}
                          placeholder="********"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                        >
                          {newPasswordVisible ? "Skjul" : "Vis"}
                        </button>
                      </div>
                      <div className="mt-2 flex gap-1">
                        {[0, 1, 2, 3].map((level) => (
                          <div 
                            key={level}
                            className={`h-1 flex-1 rounded ${
                              level <= passwordStrengthLevel ? strengthColors[passwordStrengthLevel] : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-right mt-1">
                        {newEmailPassword ? strengthLabels[passwordStrengthLevel] : ""}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quota" className="text-right">
                      Kvote
                    </Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Input
                        id="quota"
                        type="number"
                        value={newEmailQuota}
                        onChange={(e) => setNewEmailQuota(parseInt(e.target.value) || 250)}
                        min={100}
                        max={2000}
                      />
                      <span className="text-muted-foreground">MB</span>
                    </div>
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Feil</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={isCreatingEmail || !newEmailUsername || !newEmailPassword}
                  >
                    {isCreatingEmail ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Oppretter...
                      </>
                    ) : (
                      "Opprett e-postadresse"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoadingEmails ? (
            <div className="flex justify-center py-8">
              <RefreshCw size={24} className="animate-spin" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Feil</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : emails.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">Ingen e-postadresser</h3>
              <p className="text-muted-foreground">
                Du har ikke opprettet noen @snakkaz.com e-postadresser ennå.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {emails.map((email) => (
                <div key={email.id} className="rounded-lg border p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{email.email_address}</h4>
                        <button
                          onClick={() => copyToClipboard(email.email_address)}
                          className="text-muted-foreground hover:text-foreground"
                          title="Kopier e-postadresse"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(email.created_at).toLocaleDateString('nb-NO')} • {email.quota_mb} MB kvote
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetPassword(email.email_username)}
                      >
                        Nytt passord
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a 
                          href="https://webmail.snakkaz.com" 
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Mail className="mr-1 h-4 w-4" /> Webmail
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting === email.email_username}
                        onClick={() => handleDeleteEmail(email.email_username)}
                      >
                        {isDeleting === email.email_username ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>E-postinnstillinger</CardTitle>
          <CardDescription>
            Bruk disse innstillingene for å konfigurere din e-postklient
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Innkommende e-post (IMAP)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Server:</span>
                    <code className="font-mono">mail.snakkaz.com</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Port:</span>
                    <code className="font-mono">993</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sikkerhet:</span>
                    <code className="font-mono">SSL/TLS</code>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Utgående e-post (SMTP)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Server:</span>
                    <code className="font-mono">mail.snakkaz.com</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Port:</span>
                    <code className="font-mono">465</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sikkerhet:</span>
                    <code className="font-mono">SSL/TLS</code>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Webmail</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Du kan også få tilgang til din e-post gjennom webmail:
              </p>
              <Button variant="outline" asChild>
                <a 
                  href="https://webmail.snakkaz.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail className="mr-2 h-4 w-4" /> 
                  Åpne Webmail
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
