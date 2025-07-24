// Enhanced Error Handler for SnakkaZ Login
// Legg til i ProfessionalLogin.tsx handleSubmit catch-block

const enhanceErrorMessage = (error) => {
  const message = error?.message || '';
  
  // User-friendly error mapping
  const errorMap = {
    'Invalid login': '❌ Ugyldig e-post eller passord',
    'Email not confirmed': '📧 Bekreft e-posten din før innlogging', 
    'network': '🌐 Nettverksfeil - sjekk tilkoblingen',
    'rate limit': '⏰ For mange forsøk - vent litt',
    'too many': '⏰ For mange forsøk - vent litt',
    'User not found': '❌ Bruker ikke funnet',
    'Signup not allowed': '🚫 Registrering er stengt',
    'Invalid email': '📧 Ugyldig e-postadresse'
  };

  // Find matching error
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  return message || 'Noe gikk galt - prøv igjen';
};

// Usage in catch block:
// setError(enhanceErrorMessage(err));
// setTimeout(() => setError(''), 5000); // Auto-clear after 5 seconds
