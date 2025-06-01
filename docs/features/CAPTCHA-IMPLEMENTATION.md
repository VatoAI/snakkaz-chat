# CAPTCHA Implementation for Snakkaz Chat

## Overview
To protect against automated attacks and bot spam, implement CAPTCHA verification on sensitive forms.

## Recommended Solutions

### 1. hCaptcha (Privacy-focused)
```javascript
// Install: npm install @hcaptcha/react-hcaptcha
import HCaptcha from '@hcaptcha/react-hcaptcha';

function LoginForm() {
  const [captchaToken, setCaptchaToken] = useState(null);
  
  return (
    <form>
      {/* Other form fields */}
      <HCaptcha
        sitekey="your-hcaptcha-site-key"
        onVerify={setCaptchaToken}
      />
      <button disabled={!captchaToken}>Submit</button>
    </form>
  );
}
```

### 2. Cloudflare Turnstile (Free)
```javascript
// Install: npm install @cloudflare/turnstile
import { Turnstile } from '@cloudflare/turnstile';

function RegistrationForm() {
  const [turnstileToken, setTurnstileToken] = useState(null);
  
  return (
    <form>
      {/* Other form fields */}
      <Turnstile
        siteKey="your-turnstile-site-key"
        onSuccess={setTurnstileToken}
      />
      <button disabled={!turnstileToken}>Register</button>
    </form>
  );
}
```

### 3. Custom Mathematical CAPTCHA
```javascript
function MathCaptcha() {
  const [num1] = useState(Math.floor(Math.random() * 10) + 1);
  const [num2] = useState(Math.floor(Math.random() * 10) + 1);
  const [userAnswer, setUserAnswer] = useState('');
  
  const isCorrect = parseInt(userAnswer) === (num1 + num2);
  
  return (
    <div>
      <label>Løs regnestykket: {num1} + {num2} = ?</label>
      <input
        type="number"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Svar"
      />
      {userAnswer && (
        <span style={{color: isCorrect ? 'green' : 'red'}}>
          {isCorrect ? '✓ Riktig' : '✗ Feil'}
        </span>
      )}
    </div>
  );
}
```

## Implementation Priority

1. **Login Form** - Prevent brute force attacks
2. **Registration Form** - Prevent fake account creation
3. **Password Reset** - Prevent enumeration attacks
4. **Contact Forms** - Prevent spam
5. **Premium Upgrade** - Prevent fraudulent transactions

## Backend Verification

Always verify CAPTCHA tokens on the server:

```javascript
// Express.js example
app.post('/api/login', async (req, res) => {
  const { email, password, captchaToken } = req.body;
  
  // Verify CAPTCHA first
  const captchaValid = await verifyCaptcha(captchaToken);
  if (!captchaValid) {
    return res.status(400).json({ error: 'CAPTCHA verification failed' });
  }
  
  // Proceed with login
  // ...
});
```

## Rate Limiting Enhancement

Combine CAPTCHA with rate limiting:

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/login', loginLimiter, async (req, res) => {
  // Handle login with CAPTCHA
});
```
