import { r as reactExports, j as jsxRuntimeExports, bb as ShieldCheck, aY as Smartphone, bz as KeyRound, aw as CircleAlert, bA as LogIn, aE as UserPlus, b0 as EyeOff, b1 as Eye, Q as Check$1, X, aI as Shield, b6 as Lock$1, aD as Users, aH as Info, aG as Mail$1, br as CircleX, bs as CircleCheckBig, bd as LoaderCircle, bB as useForm$1, aL as ArrowLeft } from "./vendor-react-core-Cd05VJ5Y.js";
import { u as useNavigate, L as Link, b as useSearchParams } from "./vendor-router-DRYHFKTT.js";
import { y as useToast, s as supabase, C as Card, f as CardHeader, g as CardTitle, h as CardDescription, i as CardContent, H as Tabs, J as TabsList, K as TabsTrigger, M as TabsContent, L as Label, I as Input$1, B as Button, Q as Alert, U as AlertDescription, G as CardFooter, W as Form$1, X as FormField$1, Y as FormItem$1, Z as FormLabel$1, _ as FormControl$1, $ as FormMessage$1 } from "./app-utils-CvwRV1zG.js";
import { S as Secret, T as TOTP, b as browser } from "./vendor-media-rJiPBk-1.js";
import { M as MathCaptcha$1 } from "./components-ui-CoK5VGD0.js";
import { t, o as objectType, s as stringType } from "./vendor-validation-4nkgCfOe.js";
const useAuth = () => {
  const [user, setUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  reactExports.useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error: error2 } = await supabase.auth.getSession();
        if (error2) {
          console.error("Error getting session:", error2);
          setError(error2.message);
        } else if (data == null ? void 0 : data.session) {
          setUser(data.session.user);
        }
      } catch (err) {
        console.error("Unexpected error during session check:", err);
        setError("Failed to retrieve authentication session");
      } finally {
        setLoading(false);
      }
    };
    getSession();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUser(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  const signUp2 = async (email, password, metadata) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: error2 } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      if (error2) {
        setError(error2.message);
        toast({
          variant: "destructive",
          title: "Registrering mislyktes",
          description: error2.message
        });
        return;
      }
      toast({
        title: "Registrering vellykket",
        description: "Sjekk e-posten din for bekreftelseslink."
      });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Det oppstod en feil under registreringen");
      toast({
        variant: "destructive",
        title: "Registrering mislyktes",
        description: err.message || "Det oppstod en feil under registreringen"
      });
    } finally {
      setLoading(false);
    }
  };
  const signIn = async (email, password) => {
    var _a, _b;
    try {
      setLoading(true);
      setError(null);
      const { data, error: error2 } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error2) {
        setError(error2.message);
        toast({
          variant: "destructive",
          title: "Pålogging mislyktes",
          description: error2.message
        });
        return { success: false, requiresTwoFactor: false };
      }
      const user2 = data.user;
      const totpEnabled = ((_a = user2 == null ? void 0 : user2.user_metadata) == null ? void 0 : _a.totp_enabled) || false;
      if (totpEnabled) {
        return {
          success: false,
          requiresTwoFactor: true,
          user: user2,
          totpSecret: (_b = user2.user_metadata) == null ? void 0 : _b.totp_secret
        };
      }
      setUser(data.user);
      toast({
        title: "Pålogging vellykket",
        description: "Du er nå logget inn."
      });
      navigate("/chat");
      return { success: true, requiresTwoFactor: false };
    } catch (err) {
      setError(err.message || "Det oppstod en feil under pålogging");
      toast({
        variant: "destructive",
        title: "Pålogging mislyktes",
        description: err.message || "Det oppstod en feil under pålogging"
      });
      return { success: false, requiresTwoFactor: false };
    } finally {
      setLoading(false);
    }
  };
  const completeTwoFactorAuth = async (user2) => {
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          two_factor_verified: true,
          two_factor_verified_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
      if (updateError) {
        setError(updateError.message);
        return { success: false, error: updateError.message };
      }
      setUser(user2);
      toast({
        title: "Pålogging vellykket",
        description: "Du er nå logget inn med to-faktor autentisering."
      });
      navigate("/chat");
      return { success: true };
    } catch (err) {
      setError(err.message || "Det oppstod en feil under 2FA pålogging");
      return { success: false, error: err.message };
    }
  };
  const signOut = async () => {
    try {
      setLoading(true);
      const { error: error2 } = await supabase.auth.signOut();
      if (error2) {
        setError(error2.message);
        return;
      }
      setUser(null);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Det oppstod en feil under utlogging");
    } finally {
      setLoading(false);
    }
  };
  return {
    user,
    session: user ? { user } : null,
    signIn,
    signUp: signUp2,
    signOut,
    completeTwoFactorAuth,
    loading,
    error
  };
};
const useTOTP = () => {
  const { user } = useAuth();
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const generateBackupCodes = reactExports.useCallback(() => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }, []);
  const setupTOTP = reactExports.useCallback(async () => {
    var _a;
    if (!user) throw new Error("Bruker ikke logget inn");
    const secret = Secret.fromHex(Array.from(
      { length: 32 },
      () => Math.floor(Math.random() * 16).toString(16)
    ).join(""));
    const totp = new TOTP({
      issuer: "Snakkaz Chat",
      label: user.email || "user",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret
    });
    const uri = totp.toString();
    const qrCodeUrl = await browser.toDataURL(uri);
    const backupCodes = generateBackupCodes();
    return {
      secret: secret.base32,
      qrCodeUrl,
      manualEntryKey: ((_a = secret.base32.match(/.{1,4}/g)) == null ? void 0 : _a.join(" ")) || secret.base32,
      backupCodes
    };
  }, [user, generateBackupCodes]);
  const verifyTOTP = reactExports.useCallback((token, secret) => {
    try {
      const totp = new TOTP({
        issuer: "Snakkaz Chat",
        label: "user",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: Secret.fromBase32(secret)
      });
      const cleanToken = token.replace(/\s/g, "");
      return totp.validate({ token: cleanToken, timestamp: Date.now(), window: 1 }) !== null;
    } catch (err) {
      console.error("TOTP verification error:", err);
      return false;
    }
  }, []);
  const enableTOTP = reactExports.useCallback(async (secret, token) => {
    if (!user) return { success: false, error: "Bruker ikke logget inn" };
    setLoading(true);
    setError(null);
    try {
      if (!verifyTOTP(token, secret)) {
        return { success: false, error: "Ugyldig verifiseringskode" };
      }
      const backupCodes = generateBackupCodes();
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          totp_secret: secret,
          totp_enabled: true,
          backup_codes: backupCodes,
          totp_enabled_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
      if (updateError) {
        return { success: false, error: updateError.message };
      }
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ukjent feil";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user, verifyTOTP, generateBackupCodes]);
  const disableTOTP = reactExports.useCallback(async () => {
    if (!user) return { success: false, error: "Bruker ikke logget inn" };
    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          totp_secret: null,
          totp_enabled: false,
          backup_codes: null,
          totp_enabled_at: null
        }
      });
      if (updateError) {
        return { success: false, error: updateError.message };
      }
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ukjent feil";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user]);
  const verifyBackupCode = reactExports.useCallback(async (code) => {
    var _a;
    if (!user) return { success: false, error: "Bruker ikke logget inn" };
    setLoading(true);
    setError(null);
    try {
      const { data: userData, error: fetchError } = await supabase.auth.getUser();
      if (fetchError || !userData.user) {
        return { success: false, error: "Kunne ikke hente brukerdata" };
      }
      const backupCodes = ((_a = userData.user.user_metadata) == null ? void 0 : _a.backup_codes) || [];
      const codeIndex = backupCodes.indexOf(code.toUpperCase());
      if (codeIndex === -1) {
        return { success: false, error: "Ugyldig backup-kode" };
      }
      const updatedCodes = backupCodes.filter((_, index) => index !== codeIndex);
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          backup_codes: updatedCodes
        }
      });
      if (updateError) {
        return { success: false, error: updateError.message };
      }
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ukjent feil";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user]);
  return {
    setupTOTP,
    verifyTOTP,
    enableTOTP,
    disableTOTP,
    generateBackupCodes,
    verifyBackupCode,
    loading,
    error
  };
};
const TOTPVerification = ({
  secret,
  onVerificationSuccess,
  onCancel,
  loading = false
}) => {
  const [verificationCode, setVerificationCode] = reactExports.useState("");
  const [backupCode, setBackupCode] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const [verifying, setVerifying] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("totp");
  const { verifyTOTP, verifyBackupCode } = useTOTP();
  const { user, completeTwoFactorAuth } = useAuth();
  const handleTOTPVerification = async () => {
    if (!secret) {
      setError("Sikkerhetsnøkkel mangler");
      return;
    }
    if (verificationCode.length !== 6) {
      setError("Verifiseringskoden må være 6 sifre");
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      const isValid = verifyTOTP(verificationCode, secret);
      if (isValid) {
        if (user) {
          const result = await completeTwoFactorAuth(user);
          if (result.success) {
            onVerificationSuccess();
          } else {
            setError(result.error || "Feil under verifisering av 2FA sesjon");
          }
        } else {
          setError("Brukersesjon mangler");
        }
      } else {
        setError("Ugyldig verifiseringskode. Prøv igjen.");
      }
    } catch (err) {
      setError("Feil under verifisering. Prøv igjen.");
    } finally {
      setVerifying(false);
    }
  };
  const handleBackupCodeVerification = async () => {
    if (backupCode.length !== 8) {
      setError("Backup-koden må være 8 tegn");
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      const result = await verifyBackupCode(backupCode);
      if (result.success) {
        if (user) {
          const authResult = await completeTwoFactorAuth(user);
          if (authResult.success) {
            onVerificationSuccess();
          } else {
            setError(authResult.error || "Feil under verifisering av 2FA sesjon");
          }
        } else {
          setError("Brukersesjon mangler");
        }
      } else {
        setError(result.error || "Ugyldig backup-kode");
      }
    } catch (err) {
      setError("Feil under verifisering. Prøv igjen.");
    } finally {
      setVerifying(false);
    }
  };
  const handleCodeChange = (value) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(numericValue);
    setError(null);
  };
  const handleBackupCodeChange = (value) => {
    const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
    setBackupCode(cleanValue);
    setError(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-12 h-12 bg-cybergold-500/20 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-6 w-6 text-cybergold-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xl", children: "To-faktor verifisering" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Skriv inn koden fra din autentiseringsapp eller bruk en backup-kode" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: (value) => setActiveTab(value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "totp", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4" }),
            "Autentiseringsapp"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "backup", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-4 w-4" }),
            "Backup-kode"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "totp", className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "verification-code", children: "6-sifret kode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input$1,
              {
                id: "verification-code",
                type: "text",
                inputMode: "numeric",
                value: verificationCode,
                onChange: (e) => handleCodeChange(e.target.value),
                placeholder: "000000",
                className: "text-center text-2xl tracking-widest font-mono",
                maxLength: 6,
                disabled: loading || verifying
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center", children: "Åpne din autentiseringsapp og skriv inn den 6-sifrede koden" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleTOTPVerification,
              disabled: loading || verifying || verificationCode.length !== 6,
              className: "w-full",
              children: verifying ? "Verifiserer..." : "Verifiser kode"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "backup", className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "backup-code", children: "Backup-kode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input$1,
              {
                id: "backup-code",
                type: "text",
                value: backupCode,
                onChange: (e) => handleBackupCodeChange(e.target.value),
                placeholder: "ABCD1234",
                className: "text-center text-lg tracking-wider font-mono",
                maxLength: 8,
                disabled: loading || verifying
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center", children: "Skriv inn en av dine 8-tegns backup-koder" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleBackupCodeVerification,
              disabled: loading || verifying || backupCode.length !== 8,
              className: "w-full",
              children: verifying ? "Verifiserer..." : "Bruk backup-kode"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Viktig:" }),
              " Backup-koder kan kun brukes én gang. Sørg for å generere nye koder når du går tom."
            ] })
          ] })
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: error })
      ] }),
      onCancel && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 pt-4 border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          onClick: onCancel,
          disabled: loading || verifying,
          className: "w-full",
          children: "Avbryt"
        }
      ) })
    ] })
  ] });
};
const EnhancedLoginForm = () => {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [showTwoFactor, setShowTwoFactor] = reactExports.useState(false);
  const [pendingUser, setPendingUser] = reactExports.useState(null);
  const [totpSecret, setTotpSecret] = reactExports.useState("");
  const [captchaToken, setCaptchaToken] = reactExports.useState(null);
  const [captchaValid, setCaptchaValid] = reactExports.useState(false);
  const [mode, setMode] = reactExports.useState("login");
  const [validationErrors, setValidationErrors] = reactExports.useState({});
  const [showPasswordRequirements, setShowPasswordRequirements] = reactExports.useState(false);
  const { signIn, signUp: signUp2, completeTwoFactorAuth, loading } = useAuth();
  const passwordRequirements = [
    { id: "length", label: "Minst 8 tegn", test: (pwd) => pwd.length >= 8 },
    { id: "uppercase", label: "Minst en stor bokstav", test: (pwd) => /[A-Z]/.test(pwd) },
    { id: "number", label: "Minst ett tall", test: (pwd) => /[0-9]/.test(pwd) }
  ];
  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = "E-post er påkrevd";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Ugyldig e-post format";
    }
    if (!password) {
      errors.password = "Passord er påkrevd";
    }
    if (mode === "register" && password !== confirmPassword) {
      errors.confirmPassword = "Passordene samsvarer ikke";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleEmailBlur = () => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationErrors((prev) => ({ ...prev, email: "Ugyldig e-post format" }));
    } else {
      setValidationErrors((prev) => ({ ...prev, email: "" }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    if (!captchaValid) {
      setError("Vennligst løs CAPTCHA-utfordringen");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        const result = await signIn(email, password);
        if (result == null ? void 0 : result.requiresTwoFactor) {
          setPendingUser(result.user);
          setTotpSecret(result.totpSecret || "");
          setShowTwoFactor(true);
        } else if (result && !result.success) {
          setError("Pålogging mislyktes. Sjekk e-post og passord.");
        }
      } else {
        await signUp2(email, password, { username: email.split("@")[0] });
      }
    } catch (err) {
      setError(`Det oppstod en feil under ${mode === "login" ? "pålogging" : "registrering"}`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleTwoFactorSuccess = async () => {
    if (pendingUser) {
      setIsLoading(true);
      try {
        const result = await completeTwoFactorAuth(pendingUser);
        if (result && !result.success) {
          setError(result.error || "Feil under 2FA pålogging");
        }
      } catch (err) {
        setError("Feil under 2FA pålogging");
      } finally {
        setIsLoading(false);
        setShowTwoFactor(false);
        setPendingUser(null);
        setTotpSecret("");
      }
    }
  };
  const handleTwoFactorCancel = () => {
    setShowTwoFactor(false);
    setPendingUser(null);
    setTotpSecret("");
    setError(null);
  };
  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError(null);
    setValidationErrors({});
  };
  if (showTwoFactor) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-md mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      TOTPVerification,
      {
        secret: totpSecret,
        onVerificationSuccess: handleTwoFactorSuccess,
        onCancel: handleTwoFactorCancel,
        loading: isLoading
      }
    ) });
  }
  const currentLoading = isLoading || loading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-16 h-16 bg-cybergold-500/20 rounded-full flex items-center justify-center mb-4", children: mode === "login" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-8 w-8 text-cybergold-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-8 w-8 text-cybergold-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl font-bold text-cybergold-300", children: mode === "login" ? "Logg inn" : "Registrer deg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-cyberdark-300", children: mode === "login" ? "Skriv inn dine påloggingsdetaljer" : "Opprett en ny konto" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "text-cybergold-300", children: "E-post" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input$1,
          {
            id: "email",
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            onBlur: handleEmailBlur,
            placeholder: "din@epost.no",
            className: "bg-cyberdark-800 border-cyberdark-700 text-cybergold-200",
            disabled: currentLoading
          }
        ),
        validationErrors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-400", children: validationErrors.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", className: "text-cybergold-300", children: "Passord" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input$1,
            {
              id: "password",
              type: showPassword ? "text" : "password",
              value: password,
              onChange: (e) => {
                setPassword(e.target.value);
                if (mode === "register") {
                  setShowPasswordRequirements(true);
                }
              },
              onFocus: () => mode === "register" && setShowPasswordRequirements(true),
              placeholder: "••••••••",
              className: "bg-cyberdark-800 border-cyberdark-700 text-cybergold-200 pr-10",
              disabled: currentLoading
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword(!showPassword),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-cybergold-500 hover:text-cybergold-400",
              disabled: currentLoading,
              children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
            }
          )
        ] }),
        validationErrors.password && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-400", children: validationErrors.password }),
        mode === "register" && showPasswordRequirements && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 p-3 bg-cyberdark-950 border border-cybergold-500/20 rounded-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-cybergold-300 font-medium mb-2", children: "Passordkrav:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: passwordRequirements.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center text-sm", children: [
            req.test(password) ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check$1, { className: "h-4 w-4 text-green-500 mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-red-500 mr-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: req.test(password) ? "text-green-500" : "text-cybergold-400", children: req.label })
          ] }, req.id)) })
        ] })
      ] }),
      mode === "register" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "confirmPassword", className: "text-cybergold-300", children: "Bekreft passord" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input$1,
          {
            id: "confirmPassword",
            type: showPassword ? "text" : "password",
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            placeholder: "••••••••",
            className: "bg-cyberdark-800 border-cyberdark-700 text-cybergold-200",
            disabled: currentLoading
          }
        ),
        validationErrors.confirmPassword && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-400", children: validationErrors.confirmPassword })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        MathCaptcha$1,
        {
          onVerificationChange: (valid, token) => {
            setCaptchaValid(valid);
            setCaptchaToken(token);
          }
        }
      ) }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", className: "bg-red-900/40 border-red-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: error })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          disabled: currentLoading,
          className: "w-full bg-cybergold-600 text-black hover:bg-cybergold-500",
          children: currentLoading ? mode === "login" ? "Logger inn..." : "Registrerer..." : mode === "login" ? "Logg inn" : "Registrer"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-sm text-cyberdark-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sikret med 2FA-støtte" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm", children: mode === "login" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-cyberdark-300", children: [
        "Har du ikke en konto?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: toggleMode,
            className: "text-cybergold-500 hover:text-cybergold-400 underline",
            children: "Registrer deg"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-cyberdark-300", children: [
        "Har du allerede en konto?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: toggleMode,
            className: "text-cybergold-500 hover:text-cybergold-400 underline",
            children: "Logg inn"
          }
        )
      ] }) })
    ] }) })
  ] });
};
const Login = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-cyberdark-950 via-cyberdark-900 to-cyberdark-950 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: "/logos/snakkaz-gold.svg",
        alt: "Snakkaz Logo",
        className: "h-16 w-auto",
        onError: (e) => {
          const target = e.target;
          target.src = "/logos/snakkaz-gold.png";
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EnhancedLoginForm, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "w-full bg-cyberdark-900/80 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardFooter, { className: "flex flex-col space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-full border-t border-cyberdark-700" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-cyberdark-950 px-2 text-cyberdark-300", children: "eller" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-500/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "mr-2 h-4 w-4" }),
        "Opprett ny konto"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/forgot-password", className: "text-cybergold-500 hover:text-cybergold-400 underline-offset-4 hover:underline", children: "Glemt passord?" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "w-full bg-cyberdark-800/80 border-cybergold-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-green-400 mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-green-300", children: "100% Sikker - Vi samler IKKE personlig informasjon" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-1 rounded bg-green-600/30 text-xs font-medium text-green-400", children: "✅ Verifisert" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock$1, { className: "h-4 w-4 text-blue-400 mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-blue-300", children: "End-to-end kryptering for alle meldinger" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-1 rounded bg-blue-600/30 text-xs font-medium text-blue-400", children: "🔒 Privat" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-purple-400 mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-purple-300", children: "Trust-system: Brukere blir verifisert over tid" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-1 rounded bg-purple-600/30 text-xs font-medium text-purple-400", children: "🏆 Community" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-cybergold-400 mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-cybergold-300", children: "Ny her? Les hvorfor Snakkaz er ditt beste valg" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/info",
            className: "px-3 py-1 rounded bg-cybergold-600/30 text-xs font-medium text-cybergold-400 hover:bg-cybergold-600/40 transition-colors",
            children: "Les mer"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$1, { className: "h-4 w-4 text-orange-400 mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-orange-300", children: "Få din egen @snakkaz.com e-post med Pro!" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/info#premium-email",
            className: "px-3 py-1 rounded bg-orange-600/30 text-xs font-medium text-orange-400 hover:bg-orange-600/40 transition-colors",
            children: "Les mer"
          }
        )
      ] })
    ] }) }) })
  ] }) });
};
const Login$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login
}, Symbol.toStringTag, { value: "Module" }));
const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = reactExports.useState("register");
  const [registeredUser, setRegisteredUser] = reactExports.useState(null);
  const { toast } = useToast();
  searchParams.get("ref");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [errorMessage, setErrorMessage] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [captchaToken, setCaptchaToken] = reactExports.useState(null);
  const [captchaValid, setCaptchaValid] = reactExports.useState(false);
  const [registrationSuccess, setRegistrationSuccess] = reactExports.useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false
    }
  });
  const onSubmit = async (values) => {
    setIsLoading(true);
    setErrorMessage(null);
    if (!captchaValid) {
      setErrorMessage("Vennligst løs CAPTCHA-utfordringen");
      setIsLoading(false);
      return;
    }
    try {
      localStorage.setItem("snakkaz_pending_email", values.email);
      await signUp(values.email, values.password, {
        username: values.username,
        full_name: ""
        // Kan fylles ut senere i profilen
      });
      setRegistrationSuccess(true);
      toast({
        title: "🎉 Velkommen til SnakkaZ Beta!",
        description: "Kontoen din er opprettet. Du blir omdirigert til chat..."
      });
      localStorage.setItem("snakkaz_beta_user", "true");
      setTimeout(() => {
        navigate("/beta-chat");
      }, 2e3);
      form.reset();
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Kunne ikke registrere konto. Prøv igjen senere.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-cyberdark-950 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: "/logos/snakkaz-gold.svg",
        alt: "Snakkaz Logo",
        className: "h-16 w-auto",
        onError: (e) => {
          const target = e.target;
          target.onerror = null;
          target.src = "/logos/snakkaz-gold.png";
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-cybergold-600/20 bg-cyberdark-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-center text-2xl font-bold text-cybergold-400", children: "Opprett konto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-center text-cybergold-600", children: "Registrer deg for å starte med Snakkaz" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        errorMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", className: "mb-4 bg-red-900/40 border-red-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: errorMessage })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "username",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-cybergold-300", children: "Brukernavn" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-3 h-4 w-4 text-cybergold-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      placeholder: "ditt_brukernavn",
                      className: "pl-10 bg-cyberdark-800 border-cyberdark-700 text-cybergold-200",
                      ...field
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-red-400" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "email",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-cybergold-300", children: "E-post" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-3 h-4 w-4 text-cybergold-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      placeholder: "din.epost@eksempel.no",
                      className: "pl-10 bg-cyberdark-800 border-cyberdark-700 text-cybergold-200",
                      ...field
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-red-400" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "password",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-cybergold-300", children: "Passord" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-3 h-4 w-4 text-cybergold-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: showPassword ? "text" : "password",
                      placeholder: "••••••••",
                      className: "pl-10 bg-cyberdark-800 border-cyberdark-700 text-cybergold-200",
                      ...field
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "absolute right-3 top-3 text-xs text-cybergold-500 hover:text-cybergold-400",
                      onClick: () => setShowPassword(!showPassword),
                      children: showPassword ? "Skjul" : "Vis"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-red-400" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "confirmPassword",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-cybergold-300", children: "Bekreft passord" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-3 h-4 w-4 text-cybergold-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: showPassword ? "text" : "password",
                      placeholder: "••••••••",
                      className: "pl-10 bg-cyberdark-800 border-cyberdark-700 text-cybergold-200",
                      ...field
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-red-400" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            MathCaptcha,
            {
              onVerificationChange: (valid, token) => {
                setCaptchaValid(valid);
                setCaptchaToken(token);
              }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "acceptTerms",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "flex flex-row items-start space-x-3 space-y-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Checkbox,
                  {
                    checked: field.value,
                    onCheckedChange: field.onChange,
                    className: "data-[state=checked]:bg-cybergold-600 data-[state=checked]:border-cybergold-600"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 leading-none", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { className: "text-cybergold-400", children: [
                    "Jeg godtar",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/terms", className: "text-cybergold-300 hover:underline underline-offset-4", children: "vilkårene" }),
                    " ",
                    "og",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: "text-cybergold-300 hover:underline underline-offset-4", children: "personvernerklæringen" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-red-400" })
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              className: "w-full bg-cybergold-600 text-black hover:bg-cybergold-500",
              disabled: isLoading,
              children: isLoading ? "Registrerer..." : "Registrer deg"
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardFooter, { className: "flex flex-col space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-sm text-cybergold-500", children: [
          "Har du allerede en konto?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-medium text-cybergold-400 hover:underline underline-offset-4", children: "Logg inn" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-cyberdark-800/80 border border-green-500/20 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-green-400 mr-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-green-300", children: "100% Sikker & Privat" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1 text-xs text-green-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 mr-1" }),
                "Vi samler IKKE personlig informasjon"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 mr-1" }),
                "End-to-end kryptering på alle meldinger"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 mr-1" }),
                "Fullt respekt for brukerens privatliv"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-cyberdark-800/80 border border-purple-500/20 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-purple-400 mr-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-purple-300", children: "Trust-system" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-purple-200", children: "Brukere får trust-ikoner (🆕 → ✅ → 🔷 → 🏆) basert på positiv oppførsel over tid." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-cyberdark-800/80 border border-cybergold-500/20 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-cybergold-400 mr-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-cybergold-300", children: "Hvorfor velge Snakkaz framfor andre apper?" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/info",
                className: "px-3 py-1 rounded bg-cybergold-600/30 text-xs font-medium text-cybergold-400 hover:bg-cybergold-600/40 transition-colors",
                children: "Se fordeler"
              }
            )
          ] }) })
        ] })
      ] })
    ] })
  ] }) });
};
const Register$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Register
}, Symbol.toStringTag, { value: "Module" }));
const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = reactExports.useState("loading");
  const [message, setMessage] = reactExports.useState("");
  const handleEmailConfirmation = async (token) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "signup"
      });
      if (error) {
        throw error;
      }
      if (data.user) {
        setStatus("success");
        setMessage("E-post bekreftet! Kontoen din er nå aktiv.");
        toast({
          title: "Velkommen til Snakkaz!",
          description: "E-posten din er bekreftet. Du vil bli videresendt til profilredigering."
        });
        localStorage.setItem("snakkaz_first_time_user", "true");
        setTimeout(() => {
          navigate("/login?verified=true");
        }, 2e3);
      }
    } catch (error) {
      console.error("Email confirmation error:", error);
      setStatus("error");
      setMessage("Kunne ikke bekrefte e-post. Lenken kan være utløpt eller ugyldig.");
    }
  };
  reactExports.useEffect(() => {
    const token = searchParams.get("token");
    const type = searchParams.get("type");
    if (token && type === "signup") {
      handleEmailConfirmation(token);
    } else if (!token) {
      setStatus("pending");
      setMessage("Sjekk e-posten din for bekreftelseslenke");
    }
  }, [searchParams, handleEmailConfirmation]);
  const resendConfirmation = async () => {
    const email = localStorage.getItem("snakkaz_pending_email");
    if (!email) {
      toast({
        variant: "destructive",
        title: "Ingen e-postadresse funnet",
        description: "Gå tilbake til registrering for å prøve igjen."
      });
      return;
    }
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email
      });
      if (error) throw error;
      toast({
        title: "Bekreftelse sendt på nytt",
        description: "Sjekk e-posten din for ny bekreftelseslenke."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Kunne ikke sende bekreftelse",
        description: "Prøv igjen senere eller kontakt support."
      });
    }
  };
  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-16 w-16 text-cybergold-400 animate-spin" });
      case "success":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-16 w-16 text-green-400" });
      case "error":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-16 w-16 text-red-400" });
      case "pending":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$1, { className: "h-16 w-16 text-cybergold-400" });
      default:
        return null;
    }
  };
  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      default:
        return "text-cybergold-400";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-cyberdark-950 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: "/logos/snakkaz-gold.svg",
        alt: "Snakkaz Logo",
        className: "h-16 w-auto",
        onError: (e) => {
          const target = e.target;
          target.onerror = null;
          target.src = "/logos/snakkaz-gold.png";
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-cybergold-600/20 bg-cyberdark-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4", children: getStatusIcon() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: `text-2xl font-bold ${getStatusColor()}`, children: [
          status === "loading" && "Bekrefter e-post...",
          status === "success" && "E-post bekreftet!",
          status === "error" && "Bekreftelsesfeil",
          status === "pending" && "Sjekk e-posten din"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-cybergold-600", children: message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-cyberdark-800/50 border border-cybergold-500/20 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-cybergold-400 font-medium mb-2", children: "Neste steg:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "space-y-2 text-sm text-cybergold-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "1. Åpne e-posten din" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "2. Finn e-posten fra Snakkaz" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "3. Klikk på bekreftelseslenken" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "4. Kom tilbake hit for å logge inn" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: resendConfirmation,
              variant: "outline",
              className: "w-full border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/10",
              children: "Send bekreftelse på nytt"
            }
          )
        ] }),
        status === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-green-900/30 border border-green-500/20 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-green-300", children: "Du vil automatisk bli videresendt til innlogging om noen sekunder." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => navigate("/login?verified=true"),
              className: "w-full bg-cybergold-600 text-black hover:bg-cybergold-500",
              children: "Gå til innlogging"
            }
          )
        ] }),
        status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-red-900/30 border border-red-500/20 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-300", children: "Bekreftelseslenken kan være utløpt eller allerede brukt." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: resendConfirmation,
                variant: "outline",
                className: "w-full border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/10",
                children: "Send ny bekreftelse"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "w-full text-cybergold-400 hover:bg-cybergold-600/10", children: "Tilbake til registrering" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "w-full text-cybergold-400 hover:bg-cybergold-600/10", children: "Har du allerede en konto? Logg inn" }) }) })
      ] })
    ] })
  ] }) });
};
const EmailConfirmation$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  EmailConfirmation,
  default: EmailConfirmation
}, Symbol.toStringTag, { value: "Module" }));
const formSchema$2 = objectType({
  email: stringType().email({
    message: "Vennligst oppgi en gyldig e-postadresse."
  })
});
const ForgotPassword = () => {
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [isSuccess, setIsSuccess] = reactExports.useState(false);
  const [captchaToken, setCaptchaToken] = reactExports.useState(null);
  const [captchaValid, setCaptchaValid] = reactExports.useState(false);
  const form = useForm$1({
    resolver: t(formSchema$2),
    defaultValues: {
      email: ""
    }
  });
  const onSubmit = async (values) => {
    setIsLoading(true);
    setErrorMessage(null);
    if (!captchaValid) {
      setErrorMessage("Vennligst løs CAPTCHA-utfordringen");
      setIsLoading(false);
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: window.location.origin + "/reset-password"
      });
      if (error) throw error;
      setIsSuccess(true);
      toast({
        title: "E-post sendt",
        description: "Sjekk e-posten din for instruksjoner om å tilbakestille passordet."
      });
    } catch (error) {
      console.error("Password reset error:", error);
      setErrorMessage(error.message || "Kunne ikke sende e-post for tilbakestilling av passord. Prøv igjen senere.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-cyberdark-950", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: "/logos/snakkaz-gold.svg",
        alt: "Snakkaz Logo",
        className: "h-16 w-auto",
        onError: (e) => {
          const target = e.target;
          target.onerror = null;
          target.src = "/logos/snakkaz-gold.png";
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-cybergold-600/20 bg-cyberdark-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-center text-2xl font-bold text-cybergold-400", children: "Glemt passord" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-center text-cybergold-600", children: "Skriv inn e-postadressen din for å tilbakestille passordet" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        errorMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", className: "mb-4 bg-red-900/40 border-red-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: errorMessage })
        ] }),
        isSuccess ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-900/20 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-6 w-6 text-green-500",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M5 13l4 4L19 7"
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-medium text-cybergold-300 mb-2", children: "E-post sendt" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-500 mb-4", children: "Sjekk innboksen din for instruksjoner om hvordan du tilbakestiller passordet ditt. Sjekk også søppelpost hvis du ikke finner e-posten." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => setIsSuccess(false),
              variant: "outline",
              className: "border-cybergold-600 text-cybergold-300 hover:bg-cyberdark-800",
              children: "Send på nytt"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Form$1, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField$1,
            {
              control: form.control,
              name: "email",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem$1, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel$1, { className: "text-cybergold-300", children: "E-post" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$1, { className: "absolute left-3 top-3 h-4 w-4 text-cybergold-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input$1,
                    {
                      placeholder: "din.epost@eksempel.no",
                      className: "pl-10 bg-cyberdark-800 border-cyberdark-700 text-cybergold-200",
                      ...field
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage$1, { className: "text-red-400" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            MathCaptcha$1,
            {
              onVerificationChange: (valid, token) => {
                setCaptchaValid(valid);
                setCaptchaToken(token);
              }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              className: "w-full bg-cybergold-600 text-black hover:bg-cybergold-500",
              disabled: isLoading,
              children: isLoading ? "Sender..." : "Send tilbakestillingslenke"
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "inline-flex items-center text-cybergold-500 hover:text-cybergold-400 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }),
            "Tilbake til innlogging"
          ]
        }
      ) })
    ] })
  ] }) });
};
const ForgotPassword$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ForgotPassword
}, Symbol.toStringTag, { value: "Module" }));
const formSchema$1 = objectType({
  password: stringType().min(8, {
    message: "Passord må være minst 8 tegn."
  }).regex(/[A-Z]/, {
    message: "Passord må inneholde minst én stor bokstav."
  }).regex(/[0-9]/, {
    message: "Passord må inneholde minst ett tall."
  }).regex(/[^a-zA-Z0-9]/, {
    message: "Passord må inneholde minst ett spesialtegn."
  }),
  confirmPassword: stringType()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passordene samsvarer ikke.",
  path: ["confirmPassword"]
});
const ResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [errorMessage, setErrorMessage] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [hasToken, setHasToken] = reactExports.useState(false);
  const form = useForm$1({
    resolver: t(formSchema$1),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });
  reactExports.useEffect(() => {
    const checkForToken = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error);
        setErrorMessage("Kunne ikke verifisere tilbakestillingsforespørselen. Token kan være utløpt eller ugyldig.");
        return;
      }
      if (data && data.session) {
        setHasToken(true);
      } else {
        const fragmentString = window.location.hash.substring(1);
        const fragment = new URLSearchParams(fragmentString);
        const accessToken = fragment.get("access_token");
        const refreshToken = fragment.get("refresh_token");
        if (accessToken) {
          try {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ""
            });
            setHasToken(true);
          } catch (error2) {
            console.error("Error setting session:", error2);
            setErrorMessage("Ugyldig eller utløpt tilbakestillingslenke. Be om en ny lenke.");
          }
        } else {
          setErrorMessage("Ingen gyldig tilbakestillingstoken funnet. Vennligst be om en ny tilbakestillingslenke.");
        }
      }
    };
    checkForToken();
  }, []);
  const onSubmit = async (values) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });
      if (error) throw error;
      toast({
        title: "Passord oppdatert",
        description: "Ditt passord har blitt oppdatert. Du kan nå logge inn med ditt nye passord."
      });
      setTimeout(() => {
        navigate("/");
      }, 2e3);
    } catch (error) {
      console.error("Password reset error:", error);
      setErrorMessage(error.message || "Kunne ikke oppdatere passord. Vennligst prøv igjen senere.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-cyberdark-950", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: "/logos/snakkaz-gold.svg",
        alt: "Snakkaz Logo",
        className: "h-16 w-auto",
        onError: (e) => {
          const target = e.target;
          target.onerror = null;
          target.src = "/logos/snakkaz-gold.png";
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-cybergold-600/20 bg-cyberdark-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-center text-2xl font-bold text-cybergold-400", children: "Tilbakestill passord" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-center text-cybergold-600", children: "Opprett et nytt passord for kontoen din" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        errorMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", className: "mb-4 bg-red-900/40 border-red-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: errorMessage })
        ] }),
        !hasToken ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-500 mb-6", children: "Venter på verifisering av tilbakestillingsforespørselen..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/forgot-password",
              className: "text-cybergold-400 hover:text-cybergold-300 underline underline-offset-4",
              children: "Be om en ny tilbakestillingslenke"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Form$1, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField$1,
            {
              control: form.control,
              name: "password",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem$1, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel$1, { className: "text-cybergold-300", children: "Nytt passord" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock$1, { className: "absolute left-3 top-3 h-4 w-4 text-cybergold-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input$1,
                    {
                      type: showPassword ? "text" : "password",
                      placeholder: "••••••••",
                      className: "pl-10 bg-cyberdark-800 border-cyberdark-700 text-cybergold-200",
                      ...field
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "absolute right-3 top-3 text-xs text-cybergold-500 hover:text-cybergold-400",
                      onClick: () => setShowPassword(!showPassword),
                      children: showPassword ? "Skjul" : "Vis"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage$1, { className: "text-red-400" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField$1,
            {
              control: form.control,
              name: "confirmPassword",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem$1, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel$1, { className: "text-cybergold-300", children: "Bekreft nytt passord" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock$1, { className: "absolute left-3 top-3 h-4 w-4 text-cybergold-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input$1,
                    {
                      type: showPassword ? "text" : "password",
                      placeholder: "••••••••",
                      className: "pl-10 bg-cyberdark-800 border-cyberdark-700 text-cybergold-200",
                      ...field
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage$1, { className: "text-red-400" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              className: "w-full bg-cybergold-600 text-black hover:bg-cybergold-500",
              disabled: isLoading,
              children: isLoading ? "Oppdaterer..." : "Oppdater passord"
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "inline-flex items-center text-cybergold-500 hover:text-cybergold-400 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }),
            "Tilbake til innlogging"
          ]
        }
      ) })
    ] })
  ] }) });
};
const ResetPassword$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ResetPassword
}, Symbol.toStringTag, { value: "Module" }));
export {
  EmailConfirmation$1 as E,
  ForgotPassword$1 as F,
  Login$1 as L,
  Register$1 as R,
  ResetPassword$1 as a
};
//# sourceMappingURL=pages-auth-0cjITn4e.js.map
