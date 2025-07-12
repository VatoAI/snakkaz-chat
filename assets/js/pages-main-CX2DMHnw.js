import { j as jsxRuntimeExports, aR as Sparkles, bE as Rocket, aI as Shield, bF as ArrowRight, aD as Users, ay as MessageCircle, b5 as Globe, b8 as Heart, a_ as Star, a$ as Zap, bh as Crown, r as reactExports, ba as Search, bC as Pin, aO as EllipsisVertical, bG as TrendingUp, be as Clock, bs as CircleCheckBig, aY as Smartphone, b6 as Lock, bd as LoaderCircle, aL as ArrowLeft, aE as UserPlus, bu as Camera, bH as SquarePen, aG as Mail$2, aM as Phone, aA as Settings$2, az as User, aB as LogOut, bi as Bell, bj as Palette, bI as Download, bJ as CircleHelp, aU as MessageSquare, af as ChevronRight, aF as Bot, bK as Terminal, bL as Server, bo as Code, aw as CircleAlert, bM as Play, aT as Copy, aZ as ExternalLink, aQ as Share2, Q as Check, bx as Trash2, bN as BellRing, b1 as Eye, aH as Info$2, bO as Sun, bc as Moon, bP as Monitor, bQ as Volume2, bR as Key, aJ as Plus, bk as Inbox, aV as Send, bl as Archive, bS as Reply, bT as Forward, b9 as Brain, bm as Database, aC as ChartColumn } from "./vendor-react-core-Cd05VJ5Y.js";
import { p as pwaManager, i as isMobile, c as cn, a as MobileBottomNav, b as MobileChatHeader, d as MobileBottomNavImproved, e as SmartMobileNav, U as UnifiedLayout, f as MobileLayout, A as AppHeader, g as UnifiedNavigation, h as FriendsSearchSection, E as EnhancedFriendRequestHandler, j as SubscriptionPage, k as EnhancedRegisterForm, l as EnhancedAvatarUpload, G as GroupInviteSystem, S as SnakkaZInviteSystem, C as CommunityEmailManager, m as EnhancedFriendsList } from "./components-ui-CoK5VGD0.js";
import { L as Link, u as useNavigate, O as Outlet, b as useSearchParams } from "./vendor-router-DRYHFKTT.js";
import { u as useAuth, B as Button, z as Badge, C as Card, f as CardHeader, g as CardTitle, i as CardContent, a0 as useGroups, y as useToast, L as Label, I as Input, T as Textarea, a1 as RadioGroup, a2 as RadioGroupItem, a3 as Select, a4 as SelectTrigger, a5 as SelectValue, a6 as SelectContent, a7 as SelectItem, c as useIsMobile, a8 as useFriends, H as Tabs, J as TabsList, K as TabsTrigger, M as TabsContent, h as CardDescription, A as Avatar, a as AvatarImage, b as AvatarFallback, N as Separator, S as Switch } from "./app-utils-CvwRV1zG.js";
import { m as memoryService } from "./app-services-Cf0jkxe3.js";
const Info = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-cyberdark-950 via-cyberdark-900 to-cyberdark-800 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 -z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-20 left-20 w-72 h-72 bg-cybergold-500/10 rounded-full blur-3xl animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-20 right-20 w-96 h-96 bg-cyberblue-500/10 rounded-full blur-3xl animate-pulse delay-1000" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-6 py-8 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-16 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass-dramatic p-12 rounded-3xl border border-cybergold-500/30 mb-8 backdrop-blur-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-cybergold-500/20 rounded-full border border-cybergold-500/50 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "text-cybergold-400", size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-300 text-sm font-medium", children: "BETA LANSERING" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "text-cybergold-400", size: 16 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cybergold-400 via-white to-cyberblue-400 bg-clip-text text-transparent leading-tight", children: "SnakkaZ Beta" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl md:text-3xl font-light mb-6 text-white/90 leading-relaxed", children: "Fremtidens chat er her" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-cybergold-200 max-w-3xl mx-auto leading-relaxed mb-8", children: "Opplev next-generation real-time chat med LiquidGlass design, banknivå sikkerhet og AI-drevne funksjoner. Bygget for deg som krever det beste." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center gap-4 text-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 liquid-glass-subtle rounded-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "text-cybergold-400", size: 20 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: "Real-time chat" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 liquid-glass-subtle rounded-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "text-cyberblue-400", size: 20 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: "End-to-end kryptering" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 liquid-glass-subtle rounded-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "text-purple-400", size: 20 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: "LiquidGlass UI" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-6 justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-16 px-12 text-xl liquid-glass-moderate bg-gradient-to-r from-cybergold-600 to-cybergold-500 hover:from-cybergold-500 hover:to-cybergold-400 text-black font-bold shadow-2xl shadow-cybergold-500/50 border border-cybergold-400/50 group rounded-2xl flex items-center justify-center cursor-pointer transition-all", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "mr-3 group-hover:animate-bounce", size: 24 }),
            "Bli med i Beta",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-3 group-hover:translate-x-1 transition-transform", size: 24 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-16 px-12 text-xl liquid-glass-subtle border border-cyberblue-500/70 text-cyberblue-300 hover:bg-cyberblue-900/30 hover:text-white rounded-2xl flex items-center justify-center cursor-pointer transition-all", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mr-3", size: 24 }),
            "Logg inn"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "/invite-demo",
              className: "h-16 px-12 text-xl liquid-glass-subtle border border-purple-500/70 text-purple-300 hover:bg-purple-900/30 hover:text-white rounded-2xl flex items-center justify-center cursor-pointer transition-all",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mr-3", size: 24 }),
                "Se Invitasjonssystem"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cybergold-400 via-white to-cyberblue-400 bg-clip-text text-transparent", children: "Hva er SnakkaZ Beta?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-cybergold-200 max-w-4xl mx-auto leading-relaxed", children: "Vi bygger fremtidens kommunikasjonsplattform. Beta-versjonen gir deg early access til revolusjonerende chat-teknologi." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-glass-moderate p-8 rounded-2xl border border-cybergold-500/30 hover:border-cybergold-400/50 transition-all duration-300 group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-cybergold-500 to-cybergold-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "text-black", size: 32 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-white mb-4", children: "Real-time Chat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-200 leading-relaxed", children: "Lynrask meldinger med null latency. Opplev samtaler som flyter naturlig med våre optimaliserte servere." })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-glass-moderate p-8 rounded-2xl border border-cyberblue-500/30 hover:border-cyberblue-400/50 transition-all duration-300 group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-cyberblue-500 to-cyberblue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "text-white", size: 32 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-white mb-4", children: "LiquidGlass Design" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberblue-200 leading-relaxed", children: "Revolusjonerende glassmorphism UI som tilpasser seg dine preferanser. Vakkert, moderne og intuitivt." })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-glass-moderate p-8 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "text-white", size: 32 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-white mb-4", children: "Banknivå Sikkerhet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-purple-200 leading-relaxed", children: "End-to-end kryptering, zero-knowledge arkitektur og åpen kildekode. Dine samtaler er 100% private." })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-glass-moderate p-8 rounded-2xl border border-green-500/30 hover:border-green-400/50 transition-all duration-300 group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "text-white", size: 32 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-white mb-4", children: "Smart Grupper" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-green-200 leading-relaxed", children: "Opprett og administrer grupper med avanserte tillatelser. Perfekt for team, venner og familie." })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-glass-moderate p-8 rounded-2xl border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "text-white", size: 32 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-white mb-4", children: "Cross-Platform" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-orange-200 leading-relaxed", children: "Fungerer perfekt på mobil, desktop og nettbrett. En enhetlig opplevelse overalt." })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-glass-moderate p-8 rounded-2xl border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "text-white", size: 32 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-white mb-4", children: "Community First" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-pink-200 leading-relaxed", children: "Bygget med og for community. Din tilbakemelding former fremtiden til SnakkaZ." })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass-dramatic p-12 rounded-3xl border border-cybergold-500/30 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-6 py-3 bg-cybergold-500/20 rounded-full border border-cybergold-500/50 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "text-cybergold-400", size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-300 text-lg font-medium", children: "BETA TESTING PROGRAM" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "text-cybergold-400", size: 20 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-bold mb-6 text-white", children: "Bli en del av fremtiden" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-cybergold-200 max-w-3xl mx-auto mb-8 leading-relaxed", children: "Som beta-tester får du early access til cutting-edge funksjoner, direkte innflytelse på utviklingen, og en unik mulighet til å forme fremtidens kommunikasjonsplattform." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass-subtle p-6 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "text-cybergold-400 mx-auto mb-4", size: 32 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-white mb-2", children: "Early Access" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-200 text-sm", children: "Først til å teste nye funksjoner" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass-subtle p-6 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "text-cyberblue-400 mx-auto mb-4", size: 32 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-white mb-2", children: "Direkte Feedback" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberblue-200 text-sm", children: "Din mening former produktet" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass-subtle p-6 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "text-purple-400 mx-auto mb-4", size: 32 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-white mb-2", children: "VIP Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-purple-200 text-sm", children: "Eksklusiv tilgang og fordeler" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-bold mb-6 bg-gradient-to-r from-cybergold-400 via-white to-cyberblue-400 bg-clip-text text-transparent", children: "Hvorfor SnakkaZ?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-cybergold-200 max-w-4xl mx-auto leading-relaxed", children: "Vi bygger ikke bare en chat-app, vi bygger fremtidens kommunikasjonsplattform" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass-moderate p-8 rounded-2xl border border-green-500/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-bold text-green-400 mb-4 flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "mr-3", size: 28 }),
              "Privacy First"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-green-200 leading-relaxed mb-4", children: "Zero-knowledge arkitektur betyder at selv vi ikke kan lese meldingene dine. End-to-end kryptering på alt." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-green-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Ingen datamining eller sporing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Open source sikkerhet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• GDPR og CCPA compliant" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass-moderate p-8 rounded-2xl border border-cyberblue-500/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-bold text-cyberblue-400 mb-4 flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "mr-3", size: 28 }),
              "Performance"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberblue-200 leading-relaxed mb-4", children: "Bygget med moderne teknologi for optimal hastighet og pålitelighet. Meldinger leveres på millisekunder." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-cyberblue-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Edge-optimaliserte servere" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 99.9% oppetid garanti" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Global CDN nettverk" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass-moderate p-8 rounded-2xl border border-purple-500/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-bold text-purple-400 mb-4 flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mr-3", size: 28 }),
              "Innovation"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-purple-200 leading-relaxed mb-4", children: "LiquidGlass design, AI-assistert kommunikasjon og funksjoner som ikke finnes andre steder." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-purple-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Revolusjonerende UI/UX" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• AI-drevne funksjoner" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Kontinuerlig innovasjon" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass-moderate p-8 rounded-2xl border border-orange-500/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-bold text-orange-400 mb-4 flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "mr-3", size: 28 }),
              "Community"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-orange-200 leading-relaxed mb-4", children: "Bygget av utviklere som bryr seg, for et community som verdsetter kvalitet og personvern." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-orange-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Community-drevet utvikling" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Transparent roadmap" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Direkte tilgang til utviklerne" })
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-glass-dramatic border-t border-cybergold-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl font-bold mb-4 bg-gradient-to-r from-cybergold-400 to-cyberblue-400 bg-clip-text text-transparent", children: "SnakkaZ Beta" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-200 text-lg", children: "Fremtidens kommunikasjon starter her" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "text-cybergold-400 mx-auto mb-3", size: 32 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-white mb-2", children: "100% Sikker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberdark-300 text-sm", children: "End-to-end kryptering på alt" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "text-cyberblue-400 mx-auto mb-3", size: 32 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-white mb-2", children: "Lynrask" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberdark-300 text-sm", children: "Millisekund responstid" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "text-pink-400 mx-auto mb-3", size: 32 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-white mb-2", children: "Community" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberdark-300 text-sm", children: "Bygget for og med brukerne" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center border-t border-cybergold-500/30 pt-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberdark-400 mb-2", children: "© 2025 SnakkaZ Beta. Alle rettigheter reservert." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberdark-500 text-sm", children: "End-to-end kryptering • Zero-knowledge arkitektur • Open source sikkerhet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center items-center gap-2 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "text-cybergold-400", size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-400 text-sm font-medium", children: "Bygget med LiquidGlass Design System" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "text-cybergold-400", size: 16 })
        ] })
      ] })
    ] }) }) }) })
  ] });
};
const Info$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Info,
  default: Info
}, Symbol.toStringTag, { value: "Module" }));
const PWADemo = () => {
  const [installStatus, setInstallStatus] = reactExports.useState(pwaManager.getInstallStatus());
  const [demoNotification, setDemoNotification] = reactExports.useState("");
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      setInstallStatus(pwaManager.getInstallStatus());
    }, 1e3);
    return () => clearInterval(interval);
  }, []);
  const testInstallation = async () => {
    const result = await pwaManager.installPWA();
    setDemoNotification(result ? "Installation startet!" : "Installation ikke tilgjengelig");
  };
  const testNotification = async () => {
    const result = await pwaManager.requestNotificationPermission();
    if (result) {
      await pwaManager.sendTestNotification();
      setDemoNotification("Test-notifikasjon sendt!");
    } else {
      setDemoNotification("Notifikasjoner ikke tillatt");
    }
  };
  const testOffline = () => {
    setDemoNotification("Slå av internett i DevTools → Network → Offline for å teste");
  };
  const testSharing = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "SnakkaZ Beta - PWA Demo",
          text: "Sjekk ut denne fantastiske PWA-demoen!",
          url: window.location.href
        });
        setDemoNotification("Deling vellykket!");
      } catch (error) {
        setDemoNotification("Deling avbrutt");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setDemoNotification("Link kopiert til clipboard!");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent", children: "📱 SnakkaZ PWA Demo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-gray-300", children: "Test alle mobile PWA-funksjoner her!" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-2", children: "📱 Device Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-lg ${isMobile() ? "text-green-400" : "text-blue-400"}`, children: isMobile() ? "Mobile" : "Desktop" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-2", children: "⚡ Install Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-lg ${installStatus.canInstall ? "text-green-400" : "text-yellow-400"}`, children: installStatus.canInstall ? "Ready to Install" : "Not Available" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-2", children: "🔔 Notifications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-lg ${installStatus.notificationPermission === "granted" ? "text-green-400" : installStatus.notificationPermission === "denied" ? "text-red-400" : "text-yellow-400"}`, children: installStatus.notificationPermission })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-2", children: "🌐 Network" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-lg ${installStatus.isOnline ? "text-green-400" : "text-red-400"}`, children: installStatus.isOnline ? "Online" : "Offline" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-3", children: "📱 App Installation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-blue-100", children: "Test PWA installation feature. Appen vil installeres som native app." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: testInstallation,
            disabled: !installStatus.canInstall,
            className: "bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors",
            children: installStatus.canInstall ? "Installer App" : "Installation Not Available"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-3", children: "🔔 Push Notifications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-green-100", children: "Test push notification system med lyd og vibrasjon." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: testNotification,
            className: "bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors",
            children: "Test Notifications"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-3", children: "📤 Native Sharing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-purple-100", children: "Test native sharing API eller clipboard fallback." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: testSharing,
            className: "bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors",
            children: "Test Sharing"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-3", children: "📡 Offline Mode" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-orange-100", children: "Test offline functionality med Service Worker caching." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: testOffline,
            className: "bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors",
            children: "Test Offline Mode"
          }
        )
      ] })
    ] }),
    demoNotification && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-yellow-500 text-black p-4 rounded-xl mb-6 text-center font-semibold", children: [
      demoNotification,
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setDemoNotification(""),
          className: "ml-4 text-black opacity-70 hover:opacity-100",
          children: "✕"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-xl p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-4", children: "🎯 Testing Instructions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-yellow-400 mb-2", children: "Mobile Testing:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-gray-300 space-y-1 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• F12 → Toggle Device Toolbar" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Select iPhone/Android" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Refresh page to see mobile features" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Install banners appear after 3 seconds" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-yellow-400 mb-2", children: "PWA Features:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-gray-300 space-y-1 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Service Worker: DevTools → Application" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Manifest: DevTools → Application → Manifest" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Network: Try Offline mode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Install: Look for + icon in address bar" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 bg-gray-800 rounded-xl p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-4", children: "⚡ Performance Metrics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-400", children: "< 2s" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-400", children: "First Load" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-400", children: "< 1s" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-400", children: "Cached Load" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-400", children: "95+" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-400", children: "PWA Score" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-yellow-400", children: "100%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-400", children: "Offline Ready" })
        ] })
      ] })
    ] })
  ] }) });
};
const PWADemo$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PWADemo,
  default: PWADemo
}, Symbol.toStringTag, { value: "Module" }));
const MobileTestPage = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen bg-cyberdark-950", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: cn(
      "pb-20",
      // Space for bottom navigation
      "min-h-screen p-4",
      "mobile-theme-dark"
    ), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-sm mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-safe", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-cybergold-400 mb-6", children: "📱 SnakkaZ Mobile Test" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-2", children: "🚀 Mobile Features" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-cyberdark-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✅ Bottom Navigation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✅ Touch-friendly UI" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✅ Safe Area Support" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✅ Responsive Design" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✅ Mobile Optimized" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-2", children: "📱 Navigation Test" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cyberdark-300 mb-4", children: "Test the bottom navigation tabs below. Each tab shows active state and proper highlighting." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cybergold-400", children: "📍 Current: Test page shows mobile features" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-2", children: "🎯 Touch Test" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-cybergold-500 text-cyberdark-900 py-3 px-4 rounded-lg font-medium mobile-touch-feedback min-h-[44px]", children: "Chat Demo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-cyberblue-500 text-white py-3 px-4 rounded-lg font-medium mobile-touch-feedback min-h-[44px]", children: "Friends" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-cybergreen-500 text-cyberdark-900 py-3 px-4 rounded-lg font-medium mobile-touch-feedback min-h-[44px]", children: "Groups" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-cyberred-500 text-white py-3 px-4 rounded-lg font-medium mobile-touch-feedback min-h-[44px]", children: "Profile" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-2", children: "📲 Mobile Tips" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-xs text-cyberdark-300 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Touch targets are 44px minimum ✓" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Safe areas respected for iPhone ✓" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Optimized for dark OLED displays ✓" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Touch feedback on interactions ✓" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Responsive to screen size ✓" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-cybergold-500/10 to-cyberblue-500/10 rounded-lg p-4 border border-cybergold-500/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-cybergold-400 mb-2", children: "🌟 Next Steps" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white", children: "Ready to implement full mobile chat interface with gestures, animations, and all modern mobile patterns! 🚀" })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileBottomNav, {})
  ] });
};
const MobileTestPage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MobileTestPage
}, Symbol.toStringTag, { value: "Module" }));
const ImprovedMobileTest = () => {
  const [activeTab, setActiveTab] = reactExports.useState("chats");
  const renderChatsList = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "💬 Chats Overview" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18, className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-cyberdark-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          placeholder: "Søk i chats...",
          className: "w-full bg-cyberdark-800 border border-cyberdark-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-cyberdark-400 focus:outline-none focus:ring-2 focus:ring-cybergold-500"
        }
      )
    ] }),
    [
      { name: "Team Norge", lastMsg: "Møte i morgen kl 10", time: "14:32", unread: 3, pinned: true },
      { name: "Lisa Hansen", lastMsg: "Takk for hjelpen! 🙏", time: "13:45", unread: 1, online: true },
      { name: "Utvikler Chat", lastMsg: "Ny versjon er klar", time: "12:15", unread: 0 },
      { name: "Familie", lastMsg: "Middag på søndag?", time: "11:30", unread: 5 }
    ].map((chat, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700 active:bg-cyberdark-700 transition-colors",
        onClick: () => alert(`Åpner chat med ${chat.name}`),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-cybergold-500 rounded-full flex items-center justify-center text-cyberdark-900 font-bold", children: chat.name.charAt(0) }),
            chat.online && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 w-4 h-4 bg-cybergreen-500 border-2 border-cyberdark-800 rounded-full" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-white truncate", children: chat.name }),
              chat.pinned && /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { size: 14, className: "text-cybergold-400" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cyberdark-300 truncate", children: chat.lastMsg })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cyberdark-400", children: chat.time }),
            chat.unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-cybergold-500 text-cyberdark-900 text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium", children: chat.unread })
          ] })
        ] })
      },
      index
    ))
  ] });
  const renderGroupsList = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "🏢 Grupper Overview" }),
    [
      { name: "SnakkaZ Utvikling", members: 12, activity: "Høy", category: "Arbeid" },
      { name: "Gaming Squad", members: 8, activity: "Medium", category: "Hobby" },
      { name: "Familie Chat", members: 6, activity: "Lav", category: "Familie" },
      { name: "Nabolaget", members: 25, activity: "Medium", category: "Lokalt" }
    ].map((group, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700 active:bg-cyberdark-700 transition-colors",
        onClick: () => alert(`Åpner gruppe: ${group.name}`),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-cyberblue-500 rounded-lg flex items-center justify-center text-white font-bold", children: "#" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-white", children: group.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 text-sm text-cyberdark-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                group.members,
                " medlemmer"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                group.activity,
                " aktivitet"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cybergold-400 bg-cybergold-500/10 px-2 py-1 rounded", children: group.category })
        ] })
      },
      index
    ))
  ] });
  const renderContactsList = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "👥 Kontakter Overview" }),
    [
      { name: "Anna Nordahl", status: "Online", mutual: 3 },
      { name: "Erik Johansen", status: "Sist sett 2t siden", mutual: 8 },
      { name: "Maria Silva", status: "Online", mutual: 1 },
      { name: "Thomas Berg", status: "Sist sett i går", mutual: 12 }
    ].map((contact, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700 active:bg-cyberdark-700 transition-colors",
        onClick: () => alert(`Kontakt: ${contact.name}`),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-cybergreen-500 rounded-full flex items-center justify-center text-cyberdark-900 font-bold", children: contact.name.split(" ").map((n) => n.charAt(0)).join("") }),
            contact.status === "Online" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 w-4 h-4 bg-cybergreen-500 border-2 border-cyberdark-800 rounded-full" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-white", children: contact.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cyberdark-300", children: contact.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cybergold-400", children: [
            contact.mutual,
            " felles"
          ] })
        ] })
      },
      index
    ))
  ] });
  const renderProfile = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "👤 Profil Overview" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-cybergold-500/20 to-cyberblue-500/20 rounded-lg p-6 border border-cybergold-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-cybergold-500 rounded-full flex items-center justify-center text-cyberdark-900 font-bold text-xl", children: "DU" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white", children: "Din Profil" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-400", children: "@dinbruker" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cyberdark-300", children: "Online nå" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800 rounded-lg p-3 text-center border border-cyberdark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cybergold-400 font-bold text-lg", children: "24" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Chats" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800 rounded-lg p-3 text-center border border-cyberdark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cyberblue-400 font-bold text-lg", children: "8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Grupper" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800 rounded-lg p-3 text-center border border-cyberdark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cybergreen-400 font-bold text-lg", children: "156" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Kontakter" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [
      { icon: "🔔", label: "Varsler", desc: "Administrer varsler og lyder" },
      { icon: "🔒", label: "Personvern", desc: "Sikkerhet og personvern" },
      { icon: "🎨", label: "Utseende", desc: "Tema og visning" },
      { icon: "💾", label: "Lagring", desc: "Data og sikkerhetskopi" },
      { icon: "❓", label: "Hjelp", desc: "Support og FAQ" }
    ].map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700 active:bg-cyberdark-700 transition-colors",
        onClick: () => alert(`Åpner: ${item.label}`),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: item.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-white", children: item.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cyberdark-300", children: item.desc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { size: 16, className: "text-cyberdark-400" })
        ] })
      },
      index
    )) })
  ] });
  const renderContent = () => {
    switch (activeTab) {
      case "chats":
        return renderChatsList();
      case "groups":
        return renderGroupsList();
      case "contacts":
        return renderContactsList();
      case "profile":
        return renderProfile();
      default:
        return renderChatsList();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen bg-cyberdark-950", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MobileChatHeader,
      {
        title: "SnakkaZ Mobile",
        subtitle: "Forbedret mobile interface",
        isOnline: true,
        isSecure: true,
        onCall: () => alert("📞 Call funksjon"),
        onVideoCall: () => alert("📹 Video call funksjon"),
        onOptions: () => alert("⚙️ Innstillinger")
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: cn(
      "pt-16 pb-24",
      // Header height + bottom nav height + extra space
      "min-h-screen px-4 py-4",
      "mobile-theme-dark"
    ), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-cybergold-500/10 border border-cybergold-500/30 rounded-lg p-3 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-cybergold-400 font-medium", children: "✅ Forbedret Mobile Interface - Ingen overlapping!" }) }),
      renderContent(),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white mb-3", children: "🧪 Interface Test" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm text-cyberdark-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "✅ Bottom nav høyde: 72px + safe area" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "✅ Content padding: 96px (header 64px + nav 72px + buffer)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "✅ Floating action button: Riktig posisjon" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "✅ Touch targets: 44px minimum" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "✅ Ingen innhold dekket av navigasjon" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 flex items-center justify-center text-cyberdark-400 text-sm", children: "Scroll ned for å teste at alt innhold er tilgjengelig" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileBottomNavImproved, {})
  ] });
};
const ImprovedMobileTest$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ImprovedMobileTest
}, Symbol.toStringTag, { value: "Module" }));
const FinalMobileTest = () => {
  const [isAdmin, setIsAdmin] = reactExports.useState(false);
  const renderDashboard = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-white mb-4", children: "📊 Dashboard" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-cybergold-500/20 to-cybergold-600/20 rounded-lg p-4 border border-cybergold-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 20, className: "text-cybergold-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-cybergold-400", children: "24" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Aktive Chats" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-cyberblue-500/20 to-cyberblue-600/20 rounded-lg p-4 border border-cyberblue-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 20, className: "text-cyberblue-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-cyberblue-400", children: "8" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Grupper" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-cybergreen-500/20 to-cybergreen-600/20 rounded-lg p-4 border border-cybergreen-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 20, className: "text-cybergreen-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-cybergreen-400", children: "156" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Venner Online" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-cyberred-500/20 to-cyberred-600/20 rounded-lg p-4 border border-cyberred-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 20, className: "text-cyberred-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-cyberred-400", children: "12" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Uleste" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-white mb-3", children: "📈 Siste Aktivitet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
        { action: "Ny melding", from: "Lisa Hansen", time: "2 min siden", type: "message" },
        { action: "Ble med i gruppe", from: "Team Norge", time: "15 min siden", type: "group" },
        { action: "Ny venn lagt til", from: "Erik Johansen", time: "1t siden", type: "friend" },
        { action: "AI Assistant brukt", from: "Kundeservice", time: "2t siden", type: "ai" }
      ].map((activity, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
          activity.type === "message" && "bg-cybergold-500 text-cyberdark-900",
          activity.type === "group" && "bg-cyberblue-500 text-white",
          activity.type === "friend" && "bg-cybergreen-500 text-cyberdark-900",
          activity.type === "ai" && "bg-cyberred-500 text-white"
        ), children: activity.from.charAt(0) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-white", children: activity.action }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-400", children: activity.from })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-400", children: activity.time })
      ] }, index)) })
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen bg-cyberdark-950", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MobileChatHeader,
      {
        title: "SnakkaZ Smart Navigation",
        subtitle: "Claude-inspirert struktur",
        isOnline: true,
        isSecure: true,
        onCall: () => alert("📞 Call funksjon"),
        onVideoCall: () => alert("📹 Video call funksjon"),
        onOptions: () => alert("⚙️ Innstillinger")
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: cn(
      "pt-16 pb-24",
      // Header + bottom nav space
      "min-h-screen px-4 py-4",
      "mobile-theme-dark"
    ), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-medium", children: "Admin Mode" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setIsAdmin(!isAdmin),
              className: cn(
                "relative w-12 h-6 rounded-full transition-colors duration-300",
                isAdmin ? "bg-cybergold-500" : "bg-cyberdark-600"
              ),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
                "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300",
                isAdmin && "transform translate-x-6"
              ) })
            }
          )
        ] }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-sm text-cybergold-400 flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Admin-only sektioner er nå synlige" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-cybergold-500/10 to-cyberblue-500/10 rounded-lg p-4 border border-cybergold-500/30 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-cybergold-400 mb-3", children: "🗂️ Smart Navigation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-white space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "✅ ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Bottom nav:" }),
            " 4 viktigste funksjoner"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "✅ ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Full meny:" }),
            " Alle seksjoner organisert logisk"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "✅ ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Admin toggle:" }),
            " Skjuler/viser admin-seksjoner"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "✅ ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Claude-inspirert:" }),
            " Logisk gruppering av features"
          ] })
        ] })
      ] }),
      renderDashboard(),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white mb-3", children: "📋 Navigation Structure" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cybergold-400 font-medium", children: "🏠 Hovedmeny" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cyberdark-300 ml-4", children: "• Dashboard (stats & aktivitet)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cyberblue-400 font-medium", children: "💬 Chat Hub" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cyberdark-300 ml-4", children: "• Chat (private meldinger)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cyberdark-300 ml-4", children: "• Grupper (team-chats)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cybergreen-400 font-medium", children: "👥 Sosialt" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cyberdark-300 ml-4", children: "• Venner (kontaktliste)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cyberdark-300 ml-4", children: "• Finn Venner (søk nye)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cyberred-400 font-medium", children: "🤖 Tjenester" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cyberdark-300 ml-4", children: "• AI Assistent (kundeservice)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cyberdark-300 ml-4", children: "• Mail (e-post system)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cyberdark-300 font-medium", children: "⚙️ Innstillinger" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cyberdark-300 ml-4", children: "• Profil • Innstillinger • Info" })
          ] }),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-400 font-medium", children: "🛡️ Admin (kun admin)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cyberdark-300 ml-4", children: "• Admin Panel • Memory (MCP)" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-white mb-2", children: "📱 Test Instructions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-cyberdark-300 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: '1. Klikk "Meny" i bottom navigation' }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "2. Utforsk de ulike seksjonene" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "3. Toggle admin mode for å se admin-seksjoner" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "4. Test quick action button (+ knapp)" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SmartMobileNav, { isAdmin, userRole: isAdmin ? "admin" : "user" })
  ] });
};
const FinalMobileTest$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: FinalMobileTest
}, Symbol.toStringTag, { value: "Module" }));
const CompleteMobileTest = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen bg-cyberdark-950", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MobileChatHeader,
      {
        title: "Mobile Test Chat",
        subtitle: "Testing mobile interface",
        isOnline: true,
        isSecure: true,
        onCall: () => alert("📞 Call button works!"),
        onVideoCall: () => alert("📹 Video call button works!"),
        onOptions: () => alert("⚙️ Options button works!")
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: cn(
      "pb-20 pt-16",
      // Space for both header and bottom navigation
      "min-h-screen p-4",
      "mobile-theme-dark"
    ), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm mx-auto space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900 rounded-lg p-4 border border-cybergold-500/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-cybergold-400 mb-3", children: "📱 SnakkaZ Mobile Interface" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-white space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "✅ Lokalt testing: http://localhost:5173" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "✅ Mobile components: Loaded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "✅ Touch targets: 44px minimum" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "✅ Safe areas: iPhone compatible" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-3", children: "🧭 Navigation Test" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cyberdark-300 mb-3", children: "Test the bottom navigation below. Each tab should show active state when clicked." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cybergold-400", children: "📍 Current: Complete mobile test with header + navigation" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-3", children: "👆 Touch Test" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => alert("💬 Chat button touched!"),
              className: "bg-cybergold-500 text-cyberdark-900 py-3 px-4 rounded-lg font-medium mobile-touch-feedback min-h-[44px] active:scale-95 transition-transform",
              children: "💬 Chat"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => alert("👥 Friends button touched!"),
              className: "bg-cyberblue-500 text-white py-3 px-4 rounded-lg font-medium mobile-touch-feedback min-h-[44px] active:scale-95 transition-transform",
              children: "👥 Friends"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => alert("🏢 Groups button touched!"),
              className: "bg-cybergreen-500 text-cyberdark-900 py-3 px-4 rounded-lg font-medium mobile-touch-feedback min-h-[44px] active:scale-95 transition-transform",
              children: "🏢 Groups"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => alert("⚙️ Profile button touched!"),
              className: "bg-cyberred-500 text-white py-3 px-4 rounded-lg font-medium mobile-touch-feedback min-h-[44px] active:scale-95 transition-transform",
              children: "⚙️ Profile"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-3", children: "📱 Header Test" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cyberdark-300 mb-3", children: "Test the mobile header buttons above:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-xs text-cyberdark-300 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "← Back button (top left)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "📞 Call button (top right)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "📹 Video call button (top right)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "⚙️ Options button (top right)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-cybergold-500/10 to-cyberblue-500/10 rounded-lg p-4 border border-cybergold-500/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-cybergold-400 mb-2", children: "📲 Device Simulation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-white space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "For best mobile testing:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "list-decimal list-inside text-xs text-cyberdark-300 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Open browser Developer Tools (F12)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Click device toggle icon (📱) or press Ctrl+Shift+M" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Select iPhone or Android device" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Test touch interactions and responsive design" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-3", children: "📐 Responsive Test" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cyberdark-300 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            "• Current width: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-400", children: "Mobile optimized" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            "• Layout: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-400", children: "Single column" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            "• Bottom nav: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-400", children: "Fixed position" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            "• Touch targets: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-400", children: "44px minimum" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-900/20 border border-green-500/30 rounded-lg p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-green-400 mb-2", children: "🎉 Mobile Interface Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-white", children: [
          "✅ Mobile interface is working locally!",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "✅ All components loaded successfully",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "✅ Ready for mobile device testing"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileBottomNav, {})
  ] });
};
const CompleteMobileTest$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CompleteMobileTest
}, Symbol.toStringTag, { value: "Module" }));
const LiquidGlassDemo = () => {
  const [activeCard, setActiveCard] = reactExports.useState(null);
  const subtleVariants = [
    {
      title: "Minimal Glass",
      description: "Svært subtil effekt for daglig bruk",
      classes: "liquid-glass-minimal liquid-card",
      intensity: "Minimal"
    },
    {
      title: "Subtle Glass",
      description: "Lett glassmorphism, ikke påtrengende",
      classes: "liquid-glass-subtle liquid-card",
      intensity: "Subtle"
    },
    {
      title: "Chat Variant",
      description: "Optimalisert for chat-komponenter",
      classes: "liquid-glass-chat liquid-card",
      intensity: "Chat"
    }
  ];
  const moderateVariants = [
    {
      title: "Moderate Glass",
      description: "Balansert effekt for de fleste brukere",
      classes: "liquid-glass-moderate liquid-card",
      intensity: "Moderate"
    },
    {
      title: "Primary Blue",
      description: "Moderate med blå tema",
      classes: "liquid-glass-moderate liquid-glass-primary liquid-card",
      intensity: "Moderate"
    },
    {
      title: "Brand Gold",
      description: "Moderate med gull tema",
      classes: "liquid-glass-moderate liquid-glass-gold liquid-card",
      intensity: "Moderate"
    }
  ];
  const dramaticVariants = [
    {
      title: "Dramatic Glass",
      description: "Perfekt for login/register sider",
      classes: "liquid-glass-dramatic liquid-card",
      intensity: "Dramatic"
    },
    {
      title: "Premium VIP",
      description: "Luksuriøs effekt med gull shimmer",
      classes: "liquid-glass-premium liquid-card",
      intensity: "Premium"
    },
    {
      title: "Full Effect",
      description: "Original liquid glass med alle effekter",
      classes: "liquid-glass liquid-card",
      intensity: "Full"
    }
  ];
  const specialEffects = [
    {
      title: "Bubble Effect",
      description: "Moderate + animerte bobler",
      classes: "liquid-glass-moderate liquid-bubbles liquid-card",
      intensity: "Special"
    },
    {
      title: "Wave Effect",
      description: "Subtle + strømende bølger",
      classes: "liquid-glass-subtle liquid-wave liquid-card",
      intensity: "Special"
    },
    {
      title: "Interactive",
      description: "Dramatic + interaktive effekter",
      classes: "liquid-glass-dramatic liquid-interactive liquid-card",
      intensity: "Special"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cyberdark-950 p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "liquid-text text-6xl font-bold mb-4", children: "LiquidGlass Demo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-400 text-xl max-w-3xl mx-auto", children: "Velg perfekt intensitetsnivå for din app! Fra subtile daglige effekter til dramatiske login-sider - alt optimalisert for SnakkaZ Chat." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 text-lg", children: "Velg intensitetsnivå som passer deg best 👇" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-cybergold-400 text-2xl font-bold mb-6 text-center", children: "😌 Subtile Varianter - For daglig bruk" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-grid max-w-5xl mx-auto", children: subtleVariants.map((card, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `${card.classes} cursor-pointer transition-all duration-300`,
          onClick: () => setActiveCard(activeCard === `subtle-${index}` ? null : `subtle-${index}`),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white text-xl font-semibold", children: card.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-cyberblue-500/20 text-cyberblue-300 px-2 py-1 rounded", children: card.intensity })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 mb-4", children: card.description }),
            activeCard === `subtle-${index}` && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-3 bg-cyberdark-800/50 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-cybergold-500 text-sm", children: [
              "✨ CSS: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-cyberblue-400", children: card.classes })
            ] }) })
          ]
        },
        `subtle-${index}`
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-cybergold-400 text-2xl font-bold mb-6 text-center", children: "⚖️ Moderate Varianter - Balansert for de fleste" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-grid max-w-5xl mx-auto", children: moderateVariants.map((card, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `${card.classes} cursor-pointer transition-all duration-300`,
          onClick: () => setActiveCard(activeCard === `moderate-${index}` ? null : `moderate-${index}`),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white text-xl font-semibold", children: card.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-cybergold-500/20 text-cybergold-300 px-2 py-1 rounded", children: card.intensity })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 mb-4", children: card.description }),
            activeCard === `moderate-${index}` && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-3 bg-cyberdark-800/50 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-cybergold-500 text-sm", children: [
              "✨ CSS: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-cyberblue-400", children: card.classes })
            ] }) })
          ]
        },
        `moderate-${index}`
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-cybergold-400 text-2xl font-bold mb-6 text-center", children: "🎭 Dramatiske Varianter - For spesielle sider (Login/Register)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-grid max-w-5xl mx-auto", children: dramaticVariants.map((card, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `${card.classes} cursor-pointer transition-all duration-300`,
          onClick: () => setActiveCard(activeCard === `dramatic-${index}` ? null : `dramatic-${index}`),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white text-xl font-semibold", children: card.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-cyberred-500/20 text-cyberred-300 px-2 py-1 rounded", children: card.intensity })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 mb-4", children: card.description }),
            activeCard === `dramatic-${index}` && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-3 bg-cyberdark-800/50 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-cybergold-500 text-sm", children: [
              "✨ CSS: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-cyberblue-400", children: card.classes })
            ] }) })
          ]
        },
        `dramatic-${index}`
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-cybergold-400 text-2xl font-bold mb-6 text-center", children: "✨ Spesialeffekter - Kombiner med andre varianter" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-grid max-w-5xl mx-auto", children: specialEffects.map((card, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `${card.classes} cursor-pointer transition-all duration-300`,
          onClick: () => setActiveCard(activeCard === `special-${index}` ? null : `special-${index}`),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white text-xl font-semibold", children: card.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded", children: card.intensity })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 mb-4", children: card.description }),
            activeCard === `special-${index}` && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-3 bg-cyberdark-800/50 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-cybergold-500 text-sm", children: [
              "✨ CSS: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-cyberblue-400", children: card.classes })
            ] }) })
          ]
        },
        `special-${index}`
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass liquid-panel max-w-4xl mx-auto mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "liquid-text text-4xl font-bold mb-6 text-center", children: "Liquid Text Effects" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "liquid-text text-2xl", children: "Flytende tekst med fargeanimasjon" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-lg", children: "Standard hvit tekst for sammenligning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "cyber-text text-xl", children: "SnakkaZ cyberpunk tekst-stil" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass liquid-panel max-w-4xl mx-auto mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-white text-3xl font-bold mb-6 text-center", children: "Loading Effects" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-glass liquid-loading h-16 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: "Liquid Loading Effect" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-glass liquid-card liquid-interactive", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: "Interactive Card - Hover Me!" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "liquid-text text-3xl font-bold mb-8 text-center", children: "Color Variants" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass liquid-glass-primary liquid-card text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-cyberblue-500 rounded-full mx-auto mb-4 opacity-70" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-cyberblue-300 text-xl font-semibold", children: "Primary Blue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white mt-2", children: "SnakkaZ blue theme" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass liquid-glass-gold liquid-card text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-cybergold-500 rounded-full mx-auto mb-4 opacity-70" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-cybergold-300 text-xl font-semibold", children: "Brand Gold" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white mt-2", children: "Premium gold accent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass liquid-glass-danger liquid-card text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-cyberred-500 rounded-full mx-auto mb-4 opacity-70" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-cyberred-300 text-xl font-semibold", children: "Alert Red" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white mt-2", children: "Error and warning states" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass-moderate liquid-card max-w-6xl mx-auto mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-cybergold-400 text-2xl font-semibold mb-6 text-center", children: "� Bruksanvisning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-white text-lg font-semibold mb-3", children: "🎯 Anbefalte bruksområder:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-cybergold-300 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Minimal/Subtle:" }),
              " Chat-paneler, daglige komponenter"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Moderate:" }),
              " Dashboards, hovedinnhold"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Dramatic:" }),
              " Login/register, landingssider"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Premium:" }),
              " VIP-funksjoner, betalte tjenester"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-white text-lg font-semibold mb-3", children: "💡 Tips for implementering:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-cybergold-300 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Gi brukere valg mellom intensitetsnivåer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Bruk subtile varianter som standard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              "• Kombiner med ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-cyberblue-400", children: "liquid-no-shimmer" }),
              " for mindre bevegelse"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Test på mobile enheter for beste opplevelse" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass-subtle liquid-card max-w-4xl mx-auto text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-cybergold-400 text-xl font-semibold mb-3", children: "🚀 Performance & Tilgjengelighet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white mb-4", children: "Alle liquid glass effekter er optimalisert for ytelse og respekterer brukerinnstillinger." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-cybergold-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "GPU-akselerert" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Bruker CSS transforms"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-cybergold-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Mobile-optimized" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Redusert kompleksitet på små skjermer"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-cybergold-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Accessibility-aware" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Respekterer prefers-reduced-motion"
        ] })
      ] })
    ] })
  ] });
};
const LiquidGlassDemo$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  LiquidGlassDemo
}, Symbol.toStringTag, { value: "Module" }));
const SnakkaZBetaLanding = () => {
  const { user } = useAuth();
  const features = [
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-6 h-6" }),
      title: "Sanntidschat",
      description: "Chat med venner og nye bekjentskaper i sanntid"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-6 h-6" }),
      title: "Grupper",
      description: "Opprett og bli med i grupper basert på interesser"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "w-6 h-6" }),
      title: "Mobiloptimalisert",
      description: "Perfekt opplevelse på alle enheter"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-6 h-6" }),
      title: "LiquidGlass UI",
      description: "Moderne glassmorphism design-system"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-6 h-6" }),
      title: "Sikker",
      description: "Kryptert kommunikasjon og databeskyttelse"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-6 h-6" }),
      title: "Rask",
      description: "Optimalisert for hastighet og ytelse"
    }
  ];
  const betaFeatures = [
    "🔥 Sanntids gruppechat",
    "📱 Responsiv mobile-first design",
    "✨ LiquidGlass moderate effekter",
    "👥 Bruker-tilstedeværelse (online/offline)",
    "🎨 SnakkaZ cyberpunk tema",
    "⚡ Optimalisert ytelse"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cyberdark-950 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/4 left-1/4 w-96 h-96 bg-cyberblue-500/10 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1/4 right-1/4 w-96 h-96 bg-cybergold-500/10 rounded-full blur-3xl" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-cybergold-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-6 h-6 text-cyberdark-950" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold liquid-text", children: "SnakkaZ" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-4", children: user ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/beta-chat", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "liquid-glass-moderate border-cybergold-500/30 text-cybergold-400 hover:text-white", children: [
          "Gå til Chat",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
        ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "text-cybergold-400 hover:text-white", children: "Logg inn" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "liquid-glass-moderate border-cybergold-500/30 text-cybergold-400 hover:text-white", children: "Registrer deg" }) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-cybergold-500/50 text-cybergold-400 mb-4", children: "🚀 BETA TESTING - NÅ TILGJENGELIG" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-5xl md:text-7xl font-bold mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "liquid-text", children: "Fremtidens" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: "Chat-plattform" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-cybergold-300 mb-8 max-w-2xl mx-auto", children: "Test vår nye beta-versjon med avansert gruppechat, mobiloptimalisering og et helt nytt LiquidGlass design-system." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4", children: user ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/beta-chat", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "liquid-glass-dramatic text-white text-lg px-8 py-3", children: [
          "Start Beta Testing",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5 ml-2" })
        ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "liquid-glass-dramatic text-white text-lg px-8 py-3", children: [
            "Bli med i Beta",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5 ml-2" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/liquid-glass-demo", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "lg", className: "border-cybergold-500/50 text-cybergold-400 hover:text-white text-lg px-8 py-3", children: "Se Design Demo" }) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl font-bold text-white mb-4", children: "Hva du kan teste i beta" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 text-lg", children: "Få tidlig tilgang til alle de nye funksjonene" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass-moderate p-6 rounded-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-xl font-semibold text-white mb-4 flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 text-green-400 mr-2" }),
              "Beta Funksjoner"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: betaFeatures.map((feature, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-cybergold-300 flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: feature.split(" ")[0] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: feature.substring(feature.indexOf(" ") + 1) })
            ] }, index)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass-moderate p-6 rounded-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xl font-semibold text-white mb-4", children: "💬 Test Scenario" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-cybergold-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "1. ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Registrer deg" }),
                " med din e-post"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "2. ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Utforsk chatrooms" }),
                " - Generell, Teknologi, Gaming, Musikk"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "3. ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Opprett grupper" }),
                " med venner og kolleger"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "4. ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Test på mobil" }),
                " - responsive design"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "5. ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Gi tilbakemelding" }),
                " på opplevelsen"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: features.map((feature, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "liquid-glass-subtle border-cybergold-500/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-cybergold-500/20 rounded-lg flex items-center justify-center text-cybergold-400 mb-2", children: feature.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-white", children: feature.title })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300", children: feature.description }) })
        ] }, index)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass-dramatic p-8 rounded-3xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl font-bold text-white mb-4", children: "Klar for å teste fremtiden?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 text-lg mb-6", children: "Bli med i beta-testingen og hjelp oss å bygge den beste chat-opplevelsen." }),
        user ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/beta-chat", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "liquid-glass-premium text-white text-xl px-12 py-4", children: [
          "Gå til Beta Chat",
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-6 h-6 ml-2" })
        ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "liquid-glass-premium text-white text-xl px-12 py-4", children: [
          "Registrer deg nå",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-6 h-6 ml-2" })
        ] }) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "py-8 px-6 border-t border-cybergold-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 mb-4 md:mb-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-cybergold-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-5 h-5 text-cyberdark-950" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-medium", children: "SnakkaZ Beta" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-6 text-cybergold-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/liquid-glass-demo", className: "hover:text-white transition-colors", children: "Design Demo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/info", className: "hover:text-white transition-colors", children: "Om oss" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-cybergold-500/50 text-cybergold-400", children: "v1.0.0-beta" })
        ] })
      ] }) })
    ] })
  ] });
};
const SnakkaZBetaLanding$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SnakkaZBetaLanding
}, Symbol.toStringTag, { value: "Module" }));
const CreateGroup = ({ onSuccess, onCancel }) => {
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [visibility, setVisibility] = reactExports.useState("private");
  const [securityLevel, setSecurityLevel] = reactExports.useState("standard");
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const { handleCreateGroup } = useGroups();
  const { toast } = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const newGroup = await handleCreateGroup(
        name.trim(),
        description.trim(),
        visibility,
        securityLevel
      );
      if (newGroup && onSuccess) {
        onSuccess(newGroup.id);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Kunne ikke opprette gruppe",
        description: "Det oppstod en feil ved opprettelse av gruppen. Vennligst prøv igjen.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const getSecurityLevelDescription = (level) => {
    switch (level) {
      case "low":
        return "Enkel kryptering. Best for uformelle grupper der ytelse er viktigere enn sikkerhet.";
      case "standard":
        return "Balansert kryptering for de fleste grupper. Anbefalt for vanlig bruk.";
      case "high":
        return "Avansert ende-til-ende kryptering. Ideell for sensitive samtaler og forretningsbruk.";
      case "maximum":
        return "Maksimal sikkerhet med militærgradert kryptering. Kan påvirke ytelsen.";
      default:
        return "";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Gruppenavn" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "name",
          placeholder: "Skriv inn et gruppenavn",
          value: name,
          onChange: (e) => setName(e.target.value),
          required: true,
          maxLength: 50,
          className: "dark:bg-cyberdark-800 dark:border-cybergold-500/30"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "Beskrivelse (valgfri)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          id: "description",
          placeholder: "Legg til en beskrivelse av gruppen",
          value: description,
          onChange: (e) => setDescription(e.target.value),
          maxLength: 200,
          className: "dark:bg-cyberdark-800 dark:border-cybergold-500/30 h-20"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Personvern" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        RadioGroup,
        {
          value: visibility,
          onValueChange: (val) => setVisibility(val),
          className: "space-y-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 rounded-md border dark:border-cybergold-500/30 p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { value: "private", id: "private" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "private", className: "flex items-center gap-2 font-normal cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 dark:text-cyberred-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block", children: "Privat" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs dark:text-gray-400 light:text-gray-600", children: "Kun inviterte personer kan bli med" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 rounded-md border dark:border-cybergold-500/30 p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { value: "public", id: "public" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "public", className: "flex items-center gap-2 font-normal cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 dark:text-cyberblue-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block", children: "Offentlig" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs dark:text-gray-400 light:text-gray-600", children: "Alle kan finne og delta i gruppen" })
                ] })
              ] })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "securityLevel", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 dark:text-cybergold-400" }),
        "Sikkerhetsnivå"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: securityLevel,
          onValueChange: (value) => setSecurityLevel(value),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full dark:bg-cyberdark-800 dark:border-cybergold-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Velg sikkerhetsnivå" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "dark:bg-cyberdark-800", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "low", children: "Lav" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "standard", children: "Standard" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "high", children: "Høy" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "maximum", children: "Maksimal" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs dark:text-gray-400 light:text-gray-500 mt-1", children: getSecurityLevelDescription(securityLevel) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-3", children: [
      onCancel && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Avbryt" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          disabled: isSubmitting || !name.trim(),
          className: "dark:bg-gradient-to-r dark:from-cyberblue-600 dark:to-cyberblue-800",
          children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Oppretter..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mr-2 h-4 w-4" }),
            "Opprett gruppe"
          ] })
        }
      )
    ] })
  ] });
};
const CreateGroupPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCreated, setIsCreated] = reactExports.useState(false);
  if (!user) {
    navigate("/login", { state: { returnUrl: "/create-group" } });
    return null;
  }
  const handleGroupCreated = (groupId) => {
    setIsCreated(true);
    setTimeout(() => {
      navigate(`/group-chat/${groupId}`);
    }, 1500);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-5xl mx-auto py-8 px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => navigate(-1),
          className: "mr-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }),
            " Tilbake"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold dark:text-cybergold-300", children: "Opprett ny gruppe" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "dark:text-cybergold-400 mb-4", children: "Opprett en gruppe for å starte samtaler med venner, familie eller kolleger. Du kan invitere medlemmer etter at gruppen er opprettet." }),
      isCreated ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-green-100 dark:bg-cybergreen-900/30 border border-green-200 dark:border-cybergreen-800/50 rounded-md mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-green-800 dark:text-cybergreen-400", children: "Gruppen er opprettet! Du blir omdirigert til gruppen..." }) }) : null
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CreateGroup, { onSuccess: handleGroupCreated })
  ] });
};
const CreateGroupPage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CreateGroupPage,
  default: CreateGroupPage
}, Symbol.toStringTag, { value: "Module" }));
const FriendsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const friends = [
    { name: "Lisa Hansen", status: "Online", lastSeen: "Nå", mutual: 3, avatar: "LH" },
    { name: "Erik Johansen", status: "Offline", lastSeen: "2t siden", mutual: 8, avatar: "EJ" },
    { name: "Maria Silva", status: "Online", lastSeen: "Nå", mutual: 1, avatar: "MS" },
    { name: "Thomas Berg", status: "Away", lastSeen: "30 min siden", mutual: 12, avatar: "TB" },
    { name: "Anna Nordahl", status: "Online", lastSeen: "Nå", mutual: 5, avatar: "AN" },
    { name: "John Smith", status: "Offline", lastSeen: "1 dag siden", mutual: 2, avatar: "JS" }
  ];
  const getStatusColor = (status) => {
    switch (status) {
      case "Online":
        return "bg-cybergreen-500";
      case "Away":
        return "bg-cybergold-500";
      case "Offline":
        return "bg-cyberdark-500";
      default:
        return "bg-cyberdark-500";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    UnifiedLayout,
    {
      title: "Venner",
      subtitle: "Dine kontakter og venner",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm mx-auto space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18, className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-cyberdark-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Søk etter venner...",
              className: "w-full bg-cyberdark-800 border border-cyberdark-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-cyberdark-400 focus:outline-none focus:ring-2 focus:ring-cybergold-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => navigate("/find-friends"),
              className: "bg-cybergold-500/10 border border-cybergold-500/30 rounded-lg p-3 flex items-center space-x-2 text-cybergold-400 active:bg-cybergold-500/20 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Finn Venner" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => navigate("/groups"),
              className: "bg-cyberblue-500/10 border border-cyberblue-500/30 rounded-lg p-3 flex items-center space-x-2 text-cyberblue-400 active:bg-cyberblue-500/20 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Grupper" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-cybergold-400", children: friends.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Totalt" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-cybergreen-400", children: friends.filter((f) => f.status === "Online").length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Online" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-cyberblue-400", children: friends.reduce((sum, f) => sum + f.mutual, 0) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Felles" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold text-white flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Mine Venner" })
          ] }),
          friends.map((friend, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700 active:bg-cyberdark-700 transition-colors",
              onClick: () => navigate(`/chat/${friend.name.toLowerCase().replace(" ", "-")}`),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-cybergold-500 rounded-full flex items-center justify-center text-cyberdark-900 font-bold", children: friend.avatar }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} border-2 border-cyberdark-800 rounded-full` })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-white truncate", children: friend.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: friend.status === "Online" ? "text-cybergreen-400" : friend.status === "Away" ? "text-cybergold-400" : "text-cyberdark-400", children: friend.status }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cyberdark-400", children: "•" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cyberdark-400", children: friend.lastSeen })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cybergold-400 bg-cybergold-500/10 px-2 py-1 rounded", children: [
                    friend.mutual,
                    " felles"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        navigate(`/chat/${friend.name.toLowerCase().replace(" ", "-")}`);
                      },
                      className: "p-2 text-cybergold-400 hover:bg-cybergold-500/10 rounded-lg transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 16 })
                    }
                  )
                ] })
              ] })
            },
            index
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-white mb-3", children: "🆕 Nylig lagt til" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: friends.slice(0, 2).map((friend, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-cybergreen-500 rounded-full flex items-center justify-center text-cyberdark-900 text-xs font-bold", children: friend.avatar }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-white", children: friend.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-400", children: "Lagt til i dag" })
            ] })
          ] }, index)) })
        ] })
      ] }) })
    }
  );
};
const FriendsPage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: FriendsPage
}, Symbol.toStringTag, { value: "Module" }));
const Layout = () => {
  const { user } = useAuth();
  useNavigate();
  const isMobile2 = useIsMobile();
  if (isMobile2 && user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cyberdark-950 flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppHeader,
      {
        variant: "default",
        context: "direct-message",
        title: "SnakkaZ",
        showNavigation: false,
        showLogo: true,
        showUserNav: !!user,
        showThemeToggle: true,
        showDownloadButton: true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          UnifiedNavigation,
          {
            variant: "horizontal",
            activeIndicator: true,
            compact: false
          }
        ) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-cyberdark-800 bg-cyberdark-900 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container text-center text-xs text-cyberdark-400", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " SnakkaZ — Sikker kommunikasjon"
    ] }) })
  ] });
};
const FindFriends = () => {
  const { user } = useAuth();
  const isMobile2 = useIsMobile();
  const navigate = useNavigate();
  const { friends, handleSendFriendRequest } = useFriends();
  const existingFriendIds = friends.map((friend) => friend.user_id);
  const content = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-cyberdark-950 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-6 max-w-6xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-cybergold-500/20 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-8 w-8 text-cybergold-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-cybergold-100", children: "Finn Venner" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberdark-300", children: "Søk etter nye venner og administrer forespørsler" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            className: "border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-500/10",
            onClick: () => navigate("/friends"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4 mr-2" }),
              "Mine Venner"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-gradient-to-r from-transparent via-cybergold-500/30 to-transparent" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900/50 border-cyberdark-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-cybergold-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-5 w-5" }),
            "Søk Etter Venner"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: (user == null ? void 0 : user.id) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            FriendsSearchSection,
            {
              currentUserId: user.id,
              onSendFriendRequest: handleSendFriendRequest,
              existingFriends: existingFriendIds
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberdark-400", children: "Du må være logget inn for å søke etter venner" }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900/50 border-cyberdark-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-cybergold-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-5 w-5" }),
            "Venneforespørsler"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: (user == null ? void 0 : user.id) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EnhancedFriendRequestHandler,
            {
              currentUserId: user.id,
              onRequestAccepted: (userId) => {
                console.log("Friend request accepted:", userId);
              },
              onRequestRejected: (userId) => {
                console.log("Friend request rejected:", userId);
              },
              onRequestCancelled: (userId) => {
                console.log("Friend request cancelled:", userId);
              }
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberdark-400", children: "Du må være logget inn for å se forespørsler" }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900/50 border-cyberdark-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-200", children: "Søketips" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 text-sm text-cyberdark-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-cybergold-500 rounded-full mt-2 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Søk etter eksakt brukernavn for beste resultater" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-cybergold-500 rounded-full mt-2 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Brukernavnet må være minst 3 tegn langt" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-cybergold-500 rounded-full mt-2 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Du kan ikke sende forespørsler til eksisterende venner" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900/50 border-cyberdark-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-200", children: "Personvern" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 text-sm text-cyberdark-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Kun brukernavn vises i søkeresultater" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Du kan alltid blokkere uønskede forespørsler" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Venneforespørsler kan trekkes tilbake" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900/50 border-cyberdark-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-200", children: "Hurtighandlinger" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "w-full bg-cybergold-500 hover:bg-cybergold-600 text-black",
                onClick: () => navigate("/friends"),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 mr-2" }),
                  "Se Mine Venner"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "w-full border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-500/10",
                onClick: () => navigate("/chat"),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4 mr-2" }),
                  "Start Chat"
                ]
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] }) });
  if (isMobile2) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileLayout, { children: content });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: content });
};
const FindFriends$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: FindFriends
}, Symbol.toStringTag, { value: "Module" }));
const ProfilePage = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const userStats = [
    { label: "Chats", value: "24", color: "text-cybergold-400" },
    { label: "Grupper", value: "8", color: "text-cyberblue-400" },
    { label: "Venner", value: "156", color: "text-cybergreen-400" }
  ];
  const settingsMenu = [
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 20 }),
      label: "Varsler",
      desc: "Administrer varsler og lyder",
      action: () => navigate("/settings/notifications")
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 20 }),
      label: "Personvern",
      desc: "Sikkerhet og personvern",
      action: () => navigate("/settings/privacy")
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 20 }),
      label: "Utseende",
      desc: "Tema og visning",
      action: () => navigate("/settings/appearance")
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 20 }),
      label: "Data & Lagring",
      desc: "Sikkerhetskopi og data",
      action: () => navigate("/settings/storage")
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleHelp, { size: 20 }),
      label: "Hjelp & Support",
      desc: "FAQ og kundeservice",
      action: () => navigate("/help")
    }
  ];
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    UnifiedLayout,
    {
      title: "Min Profil",
      subtitle: "Profil og innstillinger",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm mx-auto space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-cybergold-500/20 to-cyberblue-500/20 rounded-lg p-6 border border-cybergold-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-cybergold-500 rounded-full flex items-center justify-center text-cyberdark-900 font-bold text-2xl", children: ((_c = (_b = (_a = user == null ? void 0 : user.user_metadata) == null ? void 0 : _a.username) == null ? void 0 : _b.charAt(0)) == null ? void 0 : _c.toUpperCase()) || ((_e = (_d = user == null ? void 0 : user.email) == null ? void 0 : _d.charAt(0)) == null ? void 0 : _e.toUpperCase()) || "U" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "absolute -bottom-2 -right-2 bg-cybergold-500 p-2 rounded-full text-cyberdark-900 active:scale-90 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 14 }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-white", children: ((_f = user == null ? void 0 : user.user_metadata) == null ? void 0 : _f.username) || "Bruker" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setIsEditing(!isEditing),
                  className: "text-cybergold-400 p-1",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-cybergold-400 text-sm", children: [
              "@",
              ((_g = user == null ? void 0 : user.user_metadata) == null ? void 0 : _g.username) || "bruker"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-cybergreen-500 rounded-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cybergreen-400", children: "Online nå" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: userStats.map((stat, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800 rounded-lg p-3 text-center border border-cyberdark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-lg font-bold ${stat.color}`, children: stat.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: stat.label })
        ] }, index)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-white mb-3", children: "📋 Kontaktinfo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$2, { size: 16, className: "text-cybergold-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-white", children: user == null ? void 0 : user.email })
            ] }),
            ((_h = user == null ? void 0 : user.user_metadata) == null ? void 0 : _h.phone) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 16, className: "text-cybergold-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-white", children: user.user_metadata.phone })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "⚙️ Innstillinger" }),
          settingsMenu.map((setting, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: setting.action,
              className: "w-full bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700 active:bg-cyberdark-700 transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cybergold-400", children: setting.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-white", children: setting.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cyberdark-400", children: setting.desc })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings$2, { size: 16, className: "text-cyberdark-400" })
              ] })
            },
            index
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "👤 Konto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => navigate("/settings/account"),
              className: "w-full bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700 active:bg-cyberdark-700 transition-colors flex items-center space-x-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 20, className: "text-cyberblue-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-white", children: "Kontoinnstillinger" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cyberdark-400", children: "Administrer kontoen din" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleSignOut,
              className: "w-full bg-red-500/10 border border-red-500/30 rounded-lg p-4 active:bg-red-500/20 transition-colors flex items-center space-x-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 20, className: "text-red-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-red-400", children: "Logg ut" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-400/70", children: "Avslutt økten din" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cyberdark-400 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "SnakkaZ Chat v1.0.0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Sikker kommunikasjon siden 2025" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cybergold-400", children: "Bygget med ❤️ i Norge" })
        ] }) })
      ] }) })
    }
  );
};
const ProfilePageNew = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProfilePage
}, Symbol.toStringTag, { value: "Module" }));
const DashboardPage = () => {
  var _a;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeOfDay, setTimeOfDay] = reactExports.useState("");
  reactExports.useEffect(() => {
    const hour = (/* @__PURE__ */ new Date()).getHours();
    if (hour < 12) setTimeOfDay("God morgen");
    else if (hour < 18) setTimeOfDay("God dag");
    else setTimeOfDay("God kveld");
  }, []);
  const quickActions = [
    {
      title: "Start Chat",
      description: "Begynn en ny samtale",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-5 w-5" }),
      action: () => navigate("/chat"),
      color: "bg-cybergold-500/10 text-cybergold-400 border-cybergold-500/20"
    },
    {
      title: "Finn Venner",
      description: "Utvid nettverket ditt",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-5 w-5" }),
      action: () => navigate("/find-friends"),
      color: "bg-cybergreen-500/10 text-cybergreen-400 border-cybergreen-500/20"
    },
    {
      title: "Grupper",
      description: "Bli med i grupper",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
      action: () => navigate("/groups"),
      color: "bg-cyberblue-500/10 text-cyberblue-400 border-cyberblue-500/20"
    },
    {
      title: "AI Assistent",
      description: "Chat med AI",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-5 w-5" }),
      action: () => navigate("/ai-assistant"),
      color: "bg-cyberred-500/10 text-cyberred-400 border-cyberred-500/20"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    UnifiedLayout,
    {
      title: "Dashboard",
      subtitle: "Din sikre kommunikasjonsplattform",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm mx-auto space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-cybergold-600/20 to-cybergold-400/20 border border-cybergold-500/30 rounded-xl p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-bold text-cybergold-400", children: [
            timeOfDay,
            ", ",
            ((_a = user == null ? void 0 : user.user_metadata) == null ? void 0 : _a.username) || "Bruker",
            "!"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 mt-1 text-sm", children: "Velkommen til SnakkaZ Chat" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-cybergold-500/20 to-cybergold-600/20 rounded-lg p-3 border border-cybergold-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 18, className: "text-cybergold-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-cybergold-400", children: "24" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Chats" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-cyberblue-500/20 to-cyberblue-600/20 rounded-lg p-3 border border-cyberblue-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 18, className: "text-cyberblue-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-cyberblue-400", children: "8" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Grupper" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-cybergreen-500/20 to-cybergreen-600/20 rounded-lg p-3 border border-cybergreen-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 18, className: "text-cybergreen-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-cybergreen-400", children: "156" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Venner" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-cyberred-500/20 to-cyberred-600/20 rounded-lg p-3 border border-cyberred-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 18, className: "text-cyberred-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-cyberred-400", children: "12" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Uleste" })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "⚡ Quick Actions" }),
          quickActions.map((action, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: action.action,
              className: `w-full p-4 rounded-lg border transition-all duration-200 active:scale-95 ${action.color}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
                action.icon,
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium", children: action.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm opacity-70", children: action.description })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "opacity-50" })
              ] })
            },
            index
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-white mb-3", children: "📈 Siste Aktivitet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
            { action: "Ny melding", from: "Lisa Hansen", time: "2 min siden", type: "message" },
            { action: "Ble med i gruppe", from: "Team Norge", time: "15 min siden", type: "group" },
            { action: "Ny venn lagt til", from: "Erik Johansen", time: "1t siden", type: "friend" },
            { action: "AI Assistant brukt", from: "Kundeservice", time: "2t siden", type: "ai" }
          ].map((activity, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${activity.type === "message" ? "bg-cybergold-500 text-cyberdark-900" : activity.type === "group" ? "bg-cyberblue-500 text-white" : activity.type === "friend" ? "bg-cybergreen-500 text-cyberdark-900" : "bg-cyberred-500 text-white"}`, children: activity.from.charAt(0) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-white", children: activity.action }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-400", children: activity.from })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-400", children: activity.time })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "⚙️ Hurtiginnstillinger" }),
          [
            { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings$2, { size: 18 }), label: "Profil & Innstillinger", path: "/profile" },
            { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$2, { size: 18 }), label: "E-post", path: "/mail" }
          ].map((setting, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => navigate(setting.path),
              className: "w-full bg-cyberdark-800 rounded-lg p-3 border border-cyberdark-700 flex items-center space-x-3 active:bg-cyberdark-700 transition-colors",
              children: [
                setting.icon,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: setting.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "text-cyberdark-400 ml-auto" })
              ]
            },
            index
          ))
        ] })
      ] }) })
    }
  );
};
const DashboardPage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DashboardPage
}, Symbol.toStringTag, { value: "Module" }));
const MCPDashboard = () => {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const [servers, setServers] = reactExports.useState([
    {
      id: "1",
      name: "Snakkaz AI Tools",
      url: "mcp://localhost:3001",
      status: "online",
      description: "Main AI assistant tools and utilities",
      version: "1.0.0",
      tools: ["semantic_search", "code_analysis", "data_processing"],
      lastChecked: /* @__PURE__ */ new Date()
    },
    {
      id: "2",
      name: "Developer Tools",
      url: "mcp://dev.snakkaz.chat:3002",
      status: "offline",
      description: "Development and debugging utilities",
      version: "0.9.0",
      tools: ["git_operations", "file_system", "terminal_access"],
      lastChecked: new Date(Date.now() - 3e5)
      // 5 minutes ago
    }
  ]);
  const [isCreatingServer, setIsCreatingServer] = reactExports.useState(false);
  const [newServer, setNewServer] = reactExports.useState({
    name: "",
    url: "",
    description: ""
  });
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [selectedServer, setSelectedServer] = reactExports.useState(null);
  const handleCreateServer = () => {
    if (!newServer.name || !newServer.url) {
      toast({
        title: "Feil",
        description: "Vennligst fyll ut navn og URL.",
        variant: "destructive"
      });
      return;
    }
    const server = {
      id: Date.now().toString(),
      name: newServer.name,
      url: newServer.url,
      status: "offline",
      description: newServer.description,
      version: "1.0.0",
      tools: [],
      lastChecked: /* @__PURE__ */ new Date()
    };
    setServers((prev) => [...prev, server]);
    setNewServer({ name: "", url: "", description: "" });
    setIsCreatingServer(false);
    toast({
      title: "MCP Server opprettet",
      description: `${newServer.name} er lagt til i dashboardet.`
    });
  };
  const handleTestConnection = (serverId) => {
    setServers((prev) => prev.map(
      (server) => server.id === serverId ? { ...server, status: Math.random() > 0.5 ? "online" : "error", lastChecked: /* @__PURE__ */ new Date() } : server
    ));
    toast({
      title: "Tilkobling testet",
      description: "Serverstatus oppdatert."
    });
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopiert",
      description: "Tekst kopiert til utklippstavlen."
    });
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "text-green-400";
      case "offline":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      default:
        return "text-cybergold-400";
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "online":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" });
      case "offline":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" });
      case "error":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "h-4 w-4" });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cyberdark-950 text-cybergold-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-cyberdark-900 border-b border-cyberdark-700 px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "h-6 w-6 text-cybergold-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-cybergold-400", children: "MCP Dashboard" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-cybergold-600 text-cybergold-400", children: "mcp.snakkaz.chat" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-green-600 to-green-400 text-black", children: [
          servers.filter((s) => s.status === "online").length,
          " Online"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => setIsCreatingServer(true),
            className: "bg-cybergold-600 hover:bg-cybergold-500 text-black",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "h-4 w-4 mr-2" }),
              "Ny Server"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "container max-w-7xl py-8 px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "h-5 w-5 text-cybergold-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-600", children: "Totale Servere" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-cybergold-400", children: servers.length })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5 text-green-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-600", children: "Online" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-green-400", children: servers.filter((s) => s.status === "online").length })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-5 w-5 text-cybergold-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-600", children: "Totale Tools" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-cybergold-400", children: servers.reduce((acc, server) => acc + server.tools.length, 0) })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5 text-yellow-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-600", children: "Aktive Sessioner" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-yellow-400", children: "3" })
          ] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-3 mb-6 bg-cyberdark-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabsTrigger,
            {
              value: "overview",
              className: "data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400",
              children: "Oversikt"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabsTrigger,
            {
              value: "servers",
              className: "data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400",
              children: "Servere"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabsTrigger,
            {
              value: "tools",
              className: "data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400",
              children: "Tools"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "overview", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-cybergold-400 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-5 w-5" }),
              "Systemstatus"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-300", children: "MCP Protocol" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-900/20 text-green-400 border-green-600", children: "v2.0" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-300", children: "API Gateway" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-900/20 text-green-400 border-green-600", children: "Online" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-300", children: "Load Balancer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-900/20 text-green-400 border-green-600", children: "Healthy" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-300", children: "Monitoring" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-900/20 text-green-400 border-green-600", children: "Active" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-400", children: "Nylig Aktivitet" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2 bg-cyberdark-800 rounded", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-green-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-300", children: "Snakkaz AI Tools tilkoblet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cybergold-600", children: "2 minutter siden" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2 bg-cyberdark-800 rounded", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-4 w-4 text-cybergold-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-300", children: "Tool 'semantic_search' brukt" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cybergold-600", children: "5 minutter siden" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2 bg-cyberdark-800 rounded", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-yellow-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-300", children: "Developer Tools frakoblet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cybergold-600", children: "12 minutter siden" })
                ] })
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "servers", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          servers.map((server) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "bg-cyberdark-900 border-cyberdark-700 hover:border-cybergold-600/50 transition-colors cursor-pointer",
              onClick: () => setSelectedServer(server),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 ${getStatusColor(server.status)}`, children: [
                      getStatusIcon(server.status),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-medium text-cybergold-400", children: server.name })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: `border-current ${getStatusColor(server.status)}`,
                        children: server.status
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleTestConnection(server.id);
                        },
                        className: "border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4 mr-2" }),
                          "Test"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        onClick: (e) => {
                          e.stopPropagation();
                          copyToClipboard(server.url);
                        },
                        className: "border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600 mb-1", children: "URL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 font-mono text-xs", children: server.url })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600 mb-1", children: "Versjon" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300", children: server.version })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600 mb-1", children: "Tools" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-cybergold-300", children: [
                      server.tools.length,
                      " tilgjengelige"
                    ] })
                  ] })
                ] }),
                server.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600 text-sm mb-1", children: "Beskrivelse" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 text-sm", children: server.description })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: server.tools.map((tool, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "border-cybergold-600 text-cybergold-400 text-xs",
                    children: tool
                  },
                  index
                )) })
              ] })
            },
            server.id
          )),
          isCreatingServer && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cybergold-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-400", children: "Opprett Ny MCP Server" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Server Navn" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "name",
                    placeholder: "Min MCP Server",
                    value: newServer.name,
                    onChange: (e) => setNewServer((prev) => ({ ...prev, name: e.target.value })),
                    className: "mt-1 bg-cyberdark-800 border-cyberdark-700"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "url", children: "MCP URL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "url",
                    placeholder: "mcp://localhost:3000 eller wss://your-server.com",
                    value: newServer.url,
                    onChange: (e) => setNewServer((prev) => ({ ...prev, url: e.target.value })),
                    className: "mt-1 bg-cyberdark-800 border-cyberdark-700"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "Beskrivelse (valgfritt)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "description",
                    placeholder: "Beskriv hva denne serveren gjør...",
                    value: newServer.description,
                    onChange: (e) => setNewServer((prev) => ({ ...prev, description: e.target.value })),
                    className: "mt-1 bg-cyberdark-800 border-cyberdark-700"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: handleCreateServer,
                    className: "bg-cybergold-600 hover:bg-cybergold-500 text-black",
                    children: "Opprett Server"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => setIsCreatingServer(false),
                    className: "border-cyberdark-600 text-cybergold-400 hover:bg-cyberdark-800",
                    children: "Avbryt"
                  }
                )
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "tools", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: servers.flatMap(
          (server) => server.tools.map((tool, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-cybergold-400", children: tool }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `border-current ${getStatusColor(server.status)}`,
                  children: server.status
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-cybergold-600 mb-2", children: [
              "Fra: ",
              server.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3 mr-1" }),
                    "Bruk"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-3 w-3 mr-1" }),
                    "Docs"
                  ]
                }
              )
            ] })
          ] }) }, `${server.id}-${index}`))
        ) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mt-8 bg-gradient-to-r from-cybergold-900/20 to-cyberdark-800 border-cybergold-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "h-8 w-8 text-cybergold-400 mt-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-medium text-cybergold-400 mb-2", children: "Model Context Protocol (MCP)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 mb-4", children: "MCP muliggjør sikker kommunikasjon mellom AI-modeller og eksterne tjenester. Dette dashboardet lar deg administrere og overvåke dine MCP-servere." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4 mr-2" }),
                  "Dokumentasjon"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-4 w-4 mr-2" }),
                  "API Reference"
                ]
              }
            )
          ] })
        ] })
      ] }) }) })
    ] })
  ] });
};
const MCPDashboard$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MCPDashboard
}, Symbol.toStringTag, { value: "Module" }));
const Subscription = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SubscriptionPage, {});
};
const Subscription$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Subscription
}, Symbol.toStringTag, { value: "Module" }));
const AdminSecurityPanel = () => {
  const [accessGranted, setAccessGranted] = reactExports.useState(false);
  const [accessCode, setAccessCode] = reactExports.useState("");
  const handleAccess = () => {
    if (accessCode === "SNAKKAZ_ADMIN_2025") {
      setAccessGranted(true);
    } else {
      alert("Ugyldig tilgangskode");
    }
  };
  if (!accessGranted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-cyberdark-950 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900 p-8 rounded-lg border border-red-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-red-400 mb-4", children: "Begrenset tilgang" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "password",
          value: accessCode,
          onChange: (e) => setAccessCode(e.target.value),
          placeholder: "Tilgangskode",
          className: "w-full p-2 mb-4 bg-cyberdark-800 border border-red-500/30 rounded text-red-300"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleAccess,
          className: "w-full bg-red-600 text-white p-2 rounded hover:bg-red-700",
          children: "Få tilgang"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-cyberdark-950 p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-red-400 mb-6", children: "🔒 Sikkerhetssystem - Skjult Panel" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900 p-6 rounded-lg border border-red-500/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-red-300 mb-4", children: "Sikkerhetssystemer Tilgjengelig" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-red-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• SecurityMonitoringSystem - Sporing av mistenkelig aktivitet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Politirapportering kun ved alvorlige forbrytelser" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Automatisk logging av sikkerhetsrelaterte hendelser" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Trust-system integrering" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900 p-6 rounded-lg border border-amber-500/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-amber-300 mb-4", children: "⚠️ Viktig Informasjon" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-amber-200 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Dette systemet er skjult fra offentlige brukere" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Kun tilgjengelig via direkte URL: /admin/security" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Systemet samler IKKE persondata fra vanlige brukere" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Aktiveres kun ved mistanke om alvorlige forbrytelser" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900 p-6 rounded-lg border border-green-500/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-green-300 mb-4", children: "✅ STEG 3 - UX Forbedringer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-green-200 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Fjernet synlig referanse til politisamarbeid fra brukergrensesnitt" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Systemet fortsatt tilgjengelig for autorisert personell" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Appen fremstår nå som mer inkluderende og brukervennlig" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Sikkerhetsfunksjonalitet bevart i bakgrunnen" })
        ] })
      ] })
    ] })
  ] }) });
};
const AdminSecurityPanel$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminSecurityPanel
}, Symbol.toStringTag, { value: "Module" }));
const InviteSystemDemo = () => {
  const [avatarUrl, setAvatarUrl] = reactExports.useState("");
  const [groupSettings, setGroupSettings] = reactExports.useState({
    isPublic: false,
    requireApproval: true,
    allowInvites: true,
    hasPassword: false
  });
  const handleRegistrationSuccess = () => {
    console.log("Registration successful!");
  };
  const handleAvatarChange = (url) => {
    setAvatarUrl(url);
    console.log("Avatar changed:", url);
  };
  const handleGroupSettingsChange = (settings) => {
    setGroupSettings(settings);
    console.log("Group settings changed:", settings);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-cyberdark-950 via-cyberdark-900 to-cyberdark-800", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-cybergold-500/20 bg-cyberdark-900/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "text-cybergold-400 hover:text-cybergold-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }),
        "Tilbake"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-6 w-6 text-cybergold-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold bg-gradient-to-r from-cybergold-400 to-cyberblue-400 bg-clip-text text-transparent", children: "SnakkaZ Invitasjonssystem" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-cybergold-500/50 text-cybergold-400", children: "DEMO" })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-cybergold-200 mb-4", children: "Komplett invitasjon- og registreringssystem" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-cybergold-400 max-w-3xl mx-auto", children: "Test alle de nye funksjonene for brukerregistrering, avatar-opplasting, gruppeinnvitasjoner og app-deling i SnakkaZ Beta." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "register", className: "space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-4 w-full max-w-2xl mx-auto bg-cyberdark-800 border border-cybergold-500/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "register",
              className: "data-[state=active]:bg-cybergold-600 data-[state=active]:text-black",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 mr-2" }),
                "Registrering"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "avatar",
              className: "data-[state=active]:bg-cybergold-600 data-[state=active]:text-black",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4 mr-2" }),
                "Avatar"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "group",
              className: "data-[state=active]:bg-cybergold-600 data-[state=active]:text-black",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 mr-2" }),
                "Grupper"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "app",
              className: "data-[state=active]:bg-cybergold-600 data-[state=active]:text-black",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4 mr-2" }),
                "App-deling"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "register", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-8 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cybergold-500/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-cybergold-400 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5" }),
                "Forbedret registreringsform"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-cybergold-300", children: "Med real-time validering og intelligent forslag" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-cybergold-300", children: "✨ Nye funksjoner:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-cybergold-400 space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Real-time brukernavn- og e-postvalidering" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Automatiske forslag hvis navn/e-post er tatt" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Live passordstyrke-indikator" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Invitasjonskode-støtte" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Responsiv design med glassmorphism" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-cybergold-500/10 border border-cybergold-500/30 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-cybergold-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Test:" }),
                " Prøv å skrive inn et brukernavn eller e-post for å se real-time validering og forslag i aksjon!"
              ] }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            EnhancedRegisterForm,
            {
              onSuccess: handleRegistrationSuccess,
              inviteCode: "BETA2025"
            }
          ) }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "avatar", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-8 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cybergold-500/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-cybergold-400 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-5 w-5" }),
                "Avansert avatar-opplasting"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-cybergold-300", children: "Drag-and-drop med automatisk komprimering" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-cybergold-300", children: "🚀 Funksjoner:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-cybergold-400 space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Drag-and-drop fileopplasting" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Live forhåndsvisning av bilde" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Automatisk bildekomprimering" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Progress bar med prosent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Støtte for JPG, PNG, WebP, GIF" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Intelligent validering og feilhåndtering" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-cyberblue-500/10 border border-cyberblue-500/30 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-cybergold-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Test:" }),
                " Dra et bilde hit eller klikk for å velge fil. Se hvordan systemet håndterer komprimering og validering!"
              ] }) }),
              avatarUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-green-500/10 border border-green-500/30 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-green-400", children: [
                "✅ Avatar lastet opp: ",
                avatarUrl.slice(0, 50),
                "..."
              ] }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            EnhancedAvatarUpload,
            {
              onAvatarChange: handleAvatarChange,
              className: "w-full max-w-md"
            }
          ) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "group", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cybergold-500/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-cybergold-400 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
                "Gruppeinnvitasjonssystem"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-cybergold-300", children: "Komplett system for å administrere og dele gruppeinnvitasjoner" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-cybergold-300", children: "⚙️ Administratorfunksjoner:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-cybergold-400 space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Gruppetilgangskontroll" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Passord-beskyttelse" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Godkjenningskrav" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Medlemsrettigheter" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-cybergold-300", children: "🔗 Delingsfunksjoner:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-cybergold-400 space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• QR-kode generering" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Sosiale medier integrasjon" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Custom meldinger" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Lenke-utløp og bruksgrenser" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-cybergold-300", children: "📱 Plattformer:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-cybergold-400 space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• WhatsApp" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Telegram" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Facebook, Twitter, LinkedIn" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• E-post og SMS" })
                ] })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GroupInviteSystem,
            {
              groupId: "demo-group-123",
              groupName: "SnakkaZ Beta Testgruppe",
              groupDescription: "Demonstrasjonsgruppe for invitasjonssystemet",
              isAdmin: true,
              currentSettings: groupSettings,
              onSettingsChange: handleGroupSettingsChange
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "app", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-8 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cybergold-500/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-cybergold-400 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-5 w-5" }),
                  "App-invitasjonssystem"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-cybergold-300", children: "Inviter venner til hele SnakkaZ Beta-appen" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-cybergold-300", children: "🎁 Referanse-program:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-cybergold-400 space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Personlig referansekode" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Bonus-poeng for begge parter" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Statistikk over invitasjoner" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• QR-kode for rask deling" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-cybergold-300", children: "🚀 Markedsføring:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-cybergold-400 space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Forhåndsdefinerte meldinger" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Tilpassbare invitasjonstekster" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Bred sosial medier-støtte" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Viralt potensial" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-cybergold-300", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Vekststrategi:" }),
                  " Dette systemet er designet for å gjøre det super enkelt å dele SnakkaZ og få organisk vekst gjennom word-of-mouth markedsføring."
                ] }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cybergold-500/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-400 text-lg", children: "Ulike visningstyper" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-300 mb-2", children: "Knapp-variant:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SnakkaZInviteSystem, { variant: "button", showStats: false })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-300 mb-2", children: "Flytende variant (demo):" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-20 bg-cyberdark-800 rounded-lg border border-cybergold-500/20 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 right-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "lg",
                      className: "rounded-full h-12 w-12 bg-gradient-to-r from-cybergold-600 to-cyberblue-600 hover:from-cybergold-500 hover:to-cyberblue-500 text-white shadow-lg",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-5 w-5" })
                    }
                  ) }) })
                ] })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            SnakkaZInviteSystem,
            {
              variant: "card",
              showStats: true,
              className: "w-full max-w-md"
            }
          ) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-br from-cyberdark-900 to-cyberdark-800 border-cybergold-500/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-400 text-center", children: "🎯 Implementeringsstatus" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-6 w-6 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-green-400", children: "Real-time validering" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-500", children: "Komplett implementert" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-6 w-6 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-green-400", children: "Avatar-system" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-500", children: "Drag-drop og komprimering" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-6 w-6 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-green-400", children: "Gruppe-invitasjoner" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-500", children: "QR-koder og sosial deling" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-6 w-6 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-green-400", children: "App-invitasjoner" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-500", children: "Referanse-program klar" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-cybergold-300 text-lg", children: [
              "🚀 ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Alle systemer er implementert og klare for produksjon!" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-500 text-sm mt-2", children: "SnakkaZ Beta har nå et komplett invitasjon- og delingssystem som gjør det enkelt for brukere å invitere venner og utvide nettverket sitt." })
          ] })
        ] })
      ] }) })
    ] }) })
  ] });
};
const InviteSystemDemo$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: InviteSystemDemo
}, Symbol.toStringTag, { value: "Module" }));
const Profile = () => {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFirstTime = searchParams.get("firstTime") === "true";
  const [profile, setProfile] = reactExports.useState({
    username: "brukernavn",
    // Default placeholder
    displayName: "",
    bio: "",
    avatarUrl: "",
    status: "online",
    publicProfile: true
  });
  const [isEditing, setIsEditing] = reactExports.useState(isFirstTime);
  const [editedProfile, setEditedProfile] = reactExports.useState({ ...profile });
  const [activeTab, setActiveTab] = reactExports.useState("profile");
  reactExports.useEffect(() => {
    if (isFirstTime) {
      toast({
        title: "Velkommen til Snakkaz Chat! 🎉",
        description: "La oss sette opp profilen din for å komme i gang."
      });
    }
  }, [isFirstTime, toast]);
  const handleEditToggle = () => {
    if (isEditing) {
      setProfile(editedProfile);
      toast({
        title: "Profil oppdatert",
        description: "Profilendringene dine har blitt lagret."
      });
      if (isFirstTime) {
        setTimeout(() => {
          toast({
            title: "Profil fullført! ✅",
            description: "Du blir nå sendt til hovedsiden."
          });
          navigate("/dashboard");
        }, 1500);
      }
    }
    setIsEditing(!isEditing);
  };
  const handleSkipProfile = () => {
    if (isFirstTime) {
      navigate("/dashboard");
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSwitchChange = (checked) => {
    setEditedProfile((prev) => ({
      ...prev,
      publicProfile: checked
    }));
  };
  const handleAvatarUpload = () => {
    toast({
      title: "Bilde-opplasting",
      description: "Funksjon for å laste opp profilbilde er under utvikling."
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cyberdark-950 text-cybergold-300 pb-16 md:pb-0 md:pt-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(UnifiedNavigation, { variant: "horizontal" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "container max-w-4xl py-8 px-4", children: [
      isFirstTime && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mb-6 bg-gradient-to-r from-cybergold-900/20 to-cyberdark-800 border-cybergold-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-cybergold-400 mb-2", children: "Velkommen til Snakkaz Chat! 🎉" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 mb-4", children: "La oss sette opp profilen din for å komme i gang med å chatte." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: handleSkipProfile,
            className: "border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20",
            children: [
              "Hopp over ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
            ]
          }
        )
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-cybergold-400", children: isFirstTime ? "Sett opp profilen din" : "Min profil" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          isPremium && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-cybergold-600 to-cybergold-400 text-cyberdark-900 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3" }),
            " Premium"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-cybergold-600 text-cybergold-400", children: user == null ? void 0 : user.email })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-2 mb-6 bg-cyberdark-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "profile", className: "data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400", children: "Profildetaljer" }),
          isPremium && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "email", className: "data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400", children: "Premium E-post" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "profile", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cyberdark-700 md:col-span-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-400", children: "Profilbilde" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center pt-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-32 h-32 border-4 border-cybergold-600", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: profile.avatarUrl }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-cyberdark-800 text-cybergold-500 text-4xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, {}) })
                ] }),
                isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "icon",
                    className: "absolute bottom-0 right-0 bg-cybergold-600 hover:bg-cybergold-500 text-black rounded-full h-10 w-10",
                    onClick: handleAvatarUpload,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-5 w-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-cybergold-400 mb-1", children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    name: "displayName",
                    value: editedProfile.displayName,
                    onChange: handleInputChange,
                    placeholder: "Visningsnavn",
                    className: "bg-cyberdark-800 border-cyberdark-700 text-center"
                  }
                ) : profile.displayName || "Legg til visningsnavn" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-cybergold-600 mb-3", children: [
                  "@",
                  isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      name: "username",
                      value: editedProfile.username,
                      onChange: handleInputChange,
                      placeholder: "brukernavn",
                      className: "bg-cyberdark-800 border-cyberdark-700 text-center mt-2"
                    }
                  ) : profile.username
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center space-x-2 mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-2 w-2 rounded-full ${profile.status === "online" ? "bg-green-500" : profile.status === "away" ? "bg-amber-500" : "bg-red-500"}` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-cybergold-500 capitalize", children: profile.status })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: isEditing ? "default" : "outline",
                    className: isEditing ? "bg-cybergold-600 hover:bg-cybergold-500 text-black w-full" : "bg-cyberdark-800 border-cyberdark-700 hover:bg-cyberdark-700 w-full",
                    onClick: handleEditToggle,
                    children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 mr-2" }),
                      isFirstTime ? "Fullfør oppsettet" : "Lagre endringer"
                    ] }) : "Rediger profil"
                  }
                ),
                isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    className: "bg-red-900/20 border-red-900/50 hover:bg-red-900/30 text-red-400 mt-2 w-full",
                    onClick: () => {
                      setEditedProfile({ ...profile });
                      setIsEditing(false);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2" }),
                      "Avbryt"
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cyberdark-700 md:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-400", children: "Profildetaljer" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bio", className: "text-sm text-cybergold-500", children: "Bio" }),
                isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "bio",
                    name: "bio",
                    placeholder: "Skriv litt om deg selv...",
                    value: editedProfile.bio,
                    onChange: handleInputChange,
                    className: "mt-2 bg-cyberdark-800 border-cyberdark-700 min-h-[120px]"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 p-3 bg-cyberdark-800 rounded-md min-h-[80px]", children: profile.bio || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-600 italic", children: "Ingen biografi enda" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-cyberdark-700" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-cybergold-400", children: "Offentlig profil" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cybergold-600", children: "Tillat andre å se profilen din" })
                ] }),
                isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: editedProfile.publicProfile,
                    onCheckedChange: handleSwitchChange,
                    className: "data-[state=checked]:bg-cybergold-500"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: profile.publicProfile ? "border-green-600 text-green-400" : "border-red-600 text-red-400",
                    children: profile.publicProfile ? "Synlig" : "Privat"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-cyberdark-700" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-cybergold-400 mb-4", children: "Kontoinformasjon" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 items-center text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-600", children: "E-post" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-cybergold-300", children: user == null ? void 0 : user.email })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 items-center text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-600", children: "Medlem siden" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-cybergold-300", children: "Mai 2025" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 items-center text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-600", children: "Abonnement" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-cybergold-300", children: isPremium ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-gradient-to-r from-cybergold-600 to-cybergold-400 text-cyberdark-900", children: "Premium" }) : "Standard" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 items-center text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-600", children: "ID" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-cybergold-300 break-all", children: (user == null ? void 0 : user.id) || "Ikke tilgjengelig" })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cyberdark-700 md:col-span-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-400", children: "Aktivitet" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800 p-4 rounded-lg text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-cybergold-600 text-sm mb-1", children: "Meldinger" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-cybergold-400", children: "0" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800 p-4 rounded-lg text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-cybergold-600 text-sm mb-1", children: "Grupper" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-cybergold-400", children: "0" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800 p-4 rounded-lg text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-cybergold-600 text-sm mb-1", children: "Kontakter" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-cybergold-400", children: "0" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800 p-4 rounded-lg text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-cybergold-600 text-sm mb-1", children: "Delte filer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-cybergold-400", children: "0" })
              ] })
            ] }) })
          ] })
        ] }) }),
        isPremium && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CommunityEmailManager, {}) })
      ] })
    ] })
  ] });
};
const Profile$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Profile
}, Symbol.toStringTag, { value: "Module" }));
const Settings = () => {
  const { user, signOut, isPremium } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = reactExports.useState("general");
  const [settings, setSettings] = reactExports.useState({
    theme: "dark",
    language: "no",
    notifications: {
      enabled: true,
      sound: true,
      email: false,
      push: true
    },
    privacy: {
      profileVisibility: "all",
      lastSeen: true,
      readReceipts: true
    },
    security: {
      twoFactorAuth: false
    }
  });
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logget ut",
        description: "Du har blitt logget ut av Snakkaz Chat."
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Feil ved utlogging",
        description: "Kunne ikke logge ut. Vennligst prøv igjen."
      });
    }
  };
  const updateSetting = (category, setting, value) => {
    setSettings((prev) => {
      if (category === "notifications" || category === "privacy" || category === "security") {
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [setting]: value
          }
        };
      }
      return prev;
    });
    toast({
      title: "Innstilling oppdatert",
      description: `${setting} innstillingen har blitt oppdatert.`
    });
  };
  const updateTheme = (theme) => {
    setSettings((prev) => ({
      ...prev,
      theme
    }));
    toast({
      title: "Tema endret",
      description: `Tema er satt til ${theme === "dark" ? "mørkt" : theme === "light" ? "lyst" : "system"}.`
    });
  };
  const updateLanguage = (language) => {
    setSettings((prev) => ({
      ...prev,
      language
    }));
    toast({
      title: "Språk endret",
      description: `Språk er satt til ${language === "no" ? "norsk" : "engelsk"}.`
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cyberdark-950 text-cybergold-300 pb-16 md:pb-0 md:pt-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(UnifiedNavigation, { variant: "horizontal" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "container max-w-4xl py-8 px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-cybergold-400", children: "Innstillinger" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          isPremium && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-cybergold-600 to-cybergold-400 text-cyberdark-900 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3" }),
            " Premium"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-cybergold-600 text-cybergold-400", children: user == null ? void 0 : user.email })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-5 bg-cyberdark-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "general", className: "data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings$2, { className: "h-4 w-4 mr-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Generelt" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "notifications", className: "data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BellRing, { className: "h-4 w-4 mr-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Varsler" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "privacy", className: "data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 mr-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Personvern" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "security", className: "data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 mr-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Sikkerhet" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "about", className: "data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info$2, { className: "h-4 w-4 mr-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Om" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "general", className: "p-4 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-medium text-cybergold-300 mb-4", children: "Tema" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  className: `flex flex-col items-center justify-center h-24 ${settings.theme === "light" ? "bg-cybergold-600/20 border-cybergold-500" : "bg-cyberdark-800"}`,
                  onClick: () => updateTheme("light"),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-8 w-8 mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Lyst" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  className: `flex flex-col items-center justify-center h-24 ${settings.theme === "dark" ? "bg-cybergold-600/20 border-cybergold-500" : "bg-cyberdark-800"}`,
                  onClick: () => updateTheme("dark"),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-8 w-8 mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Mørkt" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  className: `flex flex-col items-center justify-center h-24 ${settings.theme === "system" ? "bg-cybergold-600/20 border-cybergold-500" : "bg-cyberdark-800"}`,
                  onClick: () => updateTheme("system"),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: "h-8 w-8 mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "System" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-cyberdark-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-medium text-cybergold-300 mb-4", children: "Språk" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: settings.language, onValueChange: updateLanguage, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-cyberdark-800 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Velg språk" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "no", children: "Norsk" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "en", children: "English" })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-cyberdark-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-medium text-cybergold-300 mb-4", children: "Profil og E-post" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-500", children: "Administrer profilen din og e-postinnstillinger fra profilsiden din." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                isPremium && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cybergold-600/10 border border-cybergold-600/20 rounded-md p-4 mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-5 w-5 text-cybergold-400" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-md font-medium text-cybergold-400", children: "Premium E-post" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-500 mb-3", children: "Som premium-bruker har du tilgang til @snakkaz.com e-postadresser. Du kan administrere dine e-postadresser fra profilsiden din." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "bg-cyberdark-800 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/profile", children: [
                    "Administrer e-postadresser",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$2, { className: "ml-2 h-4 w-4" })
                  ] }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "bg-cyberdark-800 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", children: "Gå til profilside" }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-cyberdark-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-medium text-cybergold-300 mb-4", children: "Konto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "destructive",
                className: "bg-red-900/20 hover:bg-red-900/40 border-red-900/50 text-red-400",
                onClick: handleSignOut,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4 mr-2" }),
                  "Logg ut"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "notifications", className: "p-4 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-medium text-cybergold-300", children: "Varsler" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: "notifications-toggle",
                checked: settings.notifications.enabled,
                onCheckedChange: (checked) => updateSetting("notifications", "enabled", checked),
                className: "data-[state=checked]:bg-cybergold-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 ml-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-cybergold-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "app-notifications",
                    className: settings.notifications.enabled ? "text-cybergold-300" : "text-cybergold-600",
                    children: "App-varsler"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  id: "app-notifications",
                  checked: settings.notifications.push && settings.notifications.enabled,
                  disabled: !settings.notifications.enabled,
                  onCheckedChange: (checked) => updateSetting("notifications", "push", checked),
                  className: "data-[state=checked]:bg-cybergold-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-5 w-5 text-cybergold-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "sound-notifications",
                    className: settings.notifications.enabled ? "text-cybergold-300" : "text-cybergold-600",
                    children: "Lydvarsler"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  id: "sound-notifications",
                  checked: settings.notifications.sound && settings.notifications.enabled,
                  disabled: !settings.notifications.enabled,
                  onCheckedChange: (checked) => updateSetting("notifications", "sound", checked),
                  className: "data-[state=checked]:bg-cybergold-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$2, { className: "h-5 w-5 text-cybergold-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "email-notifications",
                    className: settings.notifications.enabled ? "text-cybergold-300" : "text-cybergold-600",
                    children: "E-postvarsler"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  id: "email-notifications",
                  checked: settings.notifications.email && settings.notifications.enabled,
                  disabled: !settings.notifications.enabled,
                  onCheckedChange: (checked) => updateSetting("notifications", "email", checked),
                  className: "data-[state=checked]:bg-cybergold-500"
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "privacy", className: "p-4 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-medium text-cybergold-300 mb-4", children: "Profilsynlighet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: settings.privacy.profileVisibility,
                onValueChange: (value) => updateSetting("privacy", "profileVisibility", value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full sm:w-1/2 bg-cyberdark-800 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Velg hvem som kan se profilen din" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-cyberdark-800 border-cyberdark-700", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Alle" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "contacts", children: "Bare kontakter" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "Ingen (privat)" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-cyberdark-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "last-seen",
                    className: "text-cybergold-300 block mb-1",
                    children: "Vis sist sett"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600 text-sm", children: "La andre se når du sist var aktiv" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  id: "last-seen",
                  checked: settings.privacy.lastSeen,
                  onCheckedChange: (checked) => updateSetting("privacy", "lastSeen", checked),
                  className: "data-[state=checked]:bg-cybergold-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "read-receipts",
                    className: "text-cybergold-300 block mb-1",
                    children: "Lesebekreftelser"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600 text-sm", children: "La andre se når du har lest meldingene deres" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  id: "read-receipts",
                  checked: settings.privacy.readReceipts,
                  onCheckedChange: (checked) => updateSetting("privacy", "readReceipts", checked),
                  className: "data-[state=checked]:bg-cybergold-500"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "security", className: "p-4 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-medium text-cybergold-300 mb-4", children: "Kontosikerhet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              className: "bg-cyberdark-800 border-cyberdark-700 mb-4",
              onClick: () => toast({
                title: "Endre passord",
                description: "Funksjonen for å endre passord direkte er under utvikling."
              }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 mr-2" }),
                "Endre passord"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "two-factor-auth",
                  className: "text-cybergold-300 block mb-1",
                  children: "To-faktor autentisering"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600 text-sm", children: "Legg til et ekstra sikkerhetslag for kontoen din" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: "two-factor-auth",
                checked: settings.security.twoFactorAuth,
                onCheckedChange: (checked) => updateSetting("security", "twoFactorAuth", checked),
                className: "data-[state=checked]:bg-cybergold-500"
              }
            )
          ] }),
          settings.security.twoFactorAuth && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 bg-cyberdark-800 p-4 rounded-lg border border-cyberdark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-cybergold-400 mb-2", children: "Konfigurer to-faktor autentisering" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600 text-sm mb-4", children: "For å fullføre oppsett, skann QR-koden med en autentiserings-app som Google Authenticator eller Authy." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-4 rounded-md w-48 h-48 mx-auto mb-4 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-black text-xs", children: "QR-kode placeholder" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-cybergold-600 text-black hover:bg-cybergold-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "h-4 w-4 mr-2" }),
              "Fullfør oppsett"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-md font-medium text-cybergold-300 mb-3", children: "Innloggingsøkter" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-800 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-10 w-10 text-cybergold-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 font-medium", children: "Denne enheten" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600 text-xs", children: "Sist aktiv: Nå" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-600/20 text-green-400 border-green-700", children: "Aktiv" })
            ] }) }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "about", className: "p-4 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: "/logos/snakkaz-gold.svg",
                alt: "Snakkaz Logo",
                className: "h-20 w-auto mx-auto mb-3",
                onError: (e) => {
                  const target = e.target;
                  target.onerror = null;
                  target.src = "/logos/snakkaz-gold.png";
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-cybergold-400", children: "Snakkaz Chat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600", children: "Versjon 1.0.0" }),
            isPremium && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mt-2 bg-gradient-to-r from-cybergold-600 to-cybergold-400 text-cyberdark-900", children: "Premium abonnement aktivt" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 max-w-2xl mx-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 text-center", children: "Snakkaz Chat er en sikker, ende-til-ende-kryptert meldingstjeneste som prioriterer brukerens personvern og datasikkerhet." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-cyberdark-700" }),
            isPremium && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cybergold-600/10 border border-cybergold-600/20 rounded-md p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-medium text-cybergold-400 flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-5 w-5" }),
                  " Premium Funksjoner"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-cybergold-500", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$2, { className: "h-4 w-4 text-cybergold-400 flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "@snakkaz.com e-postadresser" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 text-cybergold-400 flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Forbedret ende-til-ende-kryptering" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-cybergold-400 flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Premium grupper med utvidede sikkerhetsfunksjoner" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "bg-cyberdark-800 border-cyberdark-700", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", children: "Administrer premium-funksjoner" }) }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-cyberdark-700" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium text-cybergold-300 mb-2", children: "Kontakt" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-cybergold-500", children: [
                "E-post: support@snakkaz.no",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                "Nettside: snakkaz.no"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-cyberdark-700" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium text-cybergold-300 mb-2", children: "Juridisk" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "link", className: "text-cybergold-400 hover:text-cybergold-300 p-0 h-auto", children: "Personvernserklæring" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "link", className: "text-cybergold-400 hover:text-cybergold-300 p-0 h-auto", children: "Brukervilkår" })
              ] })
            ] })
          ] })
        ] })
      ] }) })
    ] })
  ] });
};
const Settings$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Settings
}, Symbol.toStringTag, { value: "Module" }));
const Friends = () => {
  const { user } = useAuth();
  const isMobile2 = useIsMobile();
  const navigate = useNavigate();
  const content = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-cyberdark-950 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-6 max-w-6xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-cybergold-500/20 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-8 w-8 text-cybergold-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-cybergold-100", children: "Mine Venner" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberdark-300", children: "Administrer dine vennskap og forbindelser" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            className: "border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-500/10",
            onClick: () => navigate("/find-friends"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 mr-2" }),
              "Finn Venner"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-gradient-to-r from-transparent via-cybergold-500/30 to-transparent" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900/50 border-cyberdark-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-cybergold-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
          "Venneliste"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: (user == null ? void 0 : user.id) ? /* @__PURE__ */ jsxRuntimeExports.jsx(EnhancedFriendsList, { currentUserId: user.id }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberdark-400", children: "Du må være logget inn for å se venner" }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900/50 border-cyberdark-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-200", children: "Hurtighandlinger" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "w-full bg-cybergold-500 hover:bg-cybergold-600 text-black",
                onClick: () => navigate("/find-friends"),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 mr-2" }),
                  "Finn Nye Venner"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "w-full border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-500/10",
                onClick: () => navigate("/chat"),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4 mr-2" }),
                  "Start Chat"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900/50 border-cyberdark-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-200", children: "Tips for Å Koble Seg Til" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 text-sm text-cyberdark-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-cybergold-500 rounded-full mt-2 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Bruk søkefunksjonen for å finne venner ved brukernavn" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-cybergold-500 rounded-full mt-2 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Send venneforespørsler til folk du kjenner" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-cybergold-500 rounded-full mt-2 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: 'Administrer forespørsler i "Pending" fanen' })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-cybergold-500 rounded-full mt-2 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Start private samtaler direkte fra vennelisten" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] }) });
  if (isMobile2) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileLayout, { children: content });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: content });
};
const Friends$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Friends
}, Symbol.toStringTag, { value: "Module" }));
const Mail = () => {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = reactExports.useState("inbox");
  const [selectedMessage, setSelectedMessage] = reactExports.useState(null);
  const [isComposing, setIsComposing] = reactExports.useState(false);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [messages, setMessages] = reactExports.useState([
    {
      id: "1",
      from: "admin@snakkaz.chat",
      to: (user == null ? void 0 : user.email) || "",
      subject: "Velkommen til Snakkaz Chat Mail",
      content: "Velkommen til det nye mail-systemet! Her kan du sende og motta meldinger fra andre brukere.",
      timestamp: /* @__PURE__ */ new Date("2025-06-01T10:00:00"),
      read: false,
      starred: false,
      folder: "inbox"
    },
    {
      id: "2",
      from: "system@snakkaz.chat",
      to: (user == null ? void 0 : user.email) || "",
      subject: "Ditt Premium-abonnement",
      content: `Hei! ${isPremium ? "Takk for at du bruker Snakkaz Premium!" : "Oppgrader til Premium for flere funksjoner."}`,
      timestamp: /* @__PURE__ */ new Date("2025-06-01T09:30:00"),
      read: true,
      starred: true,
      folder: "inbox"
    }
  ]);
  const [newMessage, setNewMessage] = reactExports.useState({
    to: "",
    subject: "",
    content: ""
  });
  const filteredMessages = messages.filter((msg) => {
    const matchesFolder = msg.folder === activeTab;
    const matchesSearch = !searchTerm || msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) || msg.from.toLowerCase().includes(searchTerm.toLowerCase()) || msg.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFolder && matchesSearch;
  });
  const handleSendMessage = () => {
    if (!newMessage.to || !newMessage.subject || !newMessage.content) {
      toast({
        title: "Feil",
        description: "Vennligst fyll ut alle feltene.",
        variant: "destructive"
      });
      return;
    }
    const message = {
      id: Date.now().toString(),
      from: (user == null ? void 0 : user.email) || "",
      to: newMessage.to,
      subject: newMessage.subject,
      content: newMessage.content,
      timestamp: /* @__PURE__ */ new Date(),
      read: true,
      starred: false,
      folder: "sent"
    };
    setMessages((prev) => [...prev, message]);
    setNewMessage({ to: "", subject: "", content: "" });
    setIsComposing(false);
    toast({
      title: "Melding sendt",
      description: `Din melding til ${newMessage.to} er sendt!`
    });
  };
  const handleMarkAsRead = (messageId) => {
    setMessages((prev) => prev.map(
      (msg) => msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };
  const handleToggleStar = (messageId) => {
    setMessages((prev) => prev.map(
      (msg) => msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
    ));
  };
  const handleDeleteMessage = (messageId) => {
    setMessages((prev) => prev.map(
      (msg) => msg.id === messageId ? { ...msg, folder: "trash" } : msg
    ));
    setSelectedMessage(null);
    toast({
      title: "Melding slettet",
      description: "Meldingen er flyttet til papirkurven."
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cyberdark-950 text-cybergold-300 pb-16 md:pb-0 md:pt-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(UnifiedNavigation, { variant: "horizontal" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "container max-w-7xl py-8 px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$2, { className: "h-6 w-6 text-cybergold-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-cybergold-400", children: "Snakkaz Mail" }),
          isPremium && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-gradient-to-r from-cybergold-600 to-cybergold-400 text-cyberdark-900", children: "Premium" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => setIsComposing(true),
            className: "bg-cybergold-600 hover:bg-cybergold-500 text-black",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
              "Ny melding"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mb-6 bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cybergold-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Søk i meldinger...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "pl-10 bg-cyberdark-800 border-cyberdark-700"
          }
        )
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-400", children: "Mapper" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: activeTab, onValueChange: setActiveTab, orientation: "vertical", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-1 gap-2 bg-cyberdark-800 p-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  value: "inbox",
                  className: "flex items-center gap-2 data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "h-4 w-4" }),
                    "Innboks (",
                    messages.filter((m) => m.folder === "inbox").length,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  value: "sent",
                  className: "flex items-center gap-2 data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
                    "Sendt (",
                    messages.filter((m) => m.folder === "sent").length,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  value: "archive",
                  className: "flex items-center gap-2 data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "h-4 w-4" }),
                    "Arkiv (",
                    messages.filter((m) => m.folder === "archive").length,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  value: "trash",
                  className: "flex items-center gap-2 data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
                    "Papirkurv (",
                    messages.filter((m) => m.folder === "trash").length,
                    ")"
                  ]
                }
              )
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-4 bg-cyberdark-900 border-cyberdark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-400", children: "Meldinger" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-96 overflow-y-auto", children: filteredMessages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 text-center text-cybergold-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$2, { className: "h-12 w-12 mx-auto mb-2 opacity-50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Ingen meldinger i denne mappen" })
            ] }) : filteredMessages.map((message) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `p-4 border-b border-cyberdark-700 cursor-pointer hover:bg-cyberdark-800/50 transition-colors ${(selectedMessage == null ? void 0 : selectedMessage.id) === message.id ? "bg-cyberdark-800" : ""}`,
                onClick: () => {
                  setSelectedMessage(message);
                  if (!message.read) {
                    handleMarkAsRead(message.id);
                  }
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-cyberdark-700 text-cybergold-400 text-xs", children: message.from.charAt(0).toUpperCase() }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-medium ${!message.read ? "text-cybergold-400" : "text-cybergold-500"}`, children: activeTab === "sent" ? `Til: ${message.to}` : message.from })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      message.starred && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-yellow-400 fill-current" }),
                      !message.read && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 bg-cybergold-400 rounded-full" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: `font-medium mb-1 ${!message.read ? "text-cybergold-300" : "text-cybergold-500"}`, children: message.subject }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-600 truncate", children: message.content }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-cybergold-700 mt-2", children: [
                    message.timestamp.toLocaleDateString("nb-NO"),
                    " ",
                    message.timestamp.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })
                  ] })
                ]
              },
              message.id
            )) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: isComposing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-cybergold-400 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-5 w-5" }),
            "Ny melding"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "to", children: "Til" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "to",
                  type: "email",
                  placeholder: "mottaker@snakkaz.chat",
                  value: newMessage.to,
                  onChange: (e) => setNewMessage((prev) => ({ ...prev, to: e.target.value })),
                  className: "mt-1 bg-cyberdark-800 border-cyberdark-700"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "subject", children: "Emne" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "subject",
                  placeholder: "Skriv emnet her...",
                  value: newMessage.subject,
                  onChange: (e) => setNewMessage((prev) => ({ ...prev, subject: e.target.value })),
                  className: "mt-1 bg-cyberdark-800 border-cyberdark-700"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "content", children: "Melding" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "content",
                  placeholder: "Skriv meldingen din her...",
                  value: newMessage.content,
                  onChange: (e) => setNewMessage((prev) => ({ ...prev, content: e.target.value })),
                  className: "mt-1 bg-cyberdark-800 border-cyberdark-700 min-h-[200px]"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  onClick: handleSendMessage,
                  className: "bg-cybergold-600 hover:bg-cybergold-500 text-black",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-2" }),
                    "Send melding"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: () => setIsComposing(false),
                  className: "border-cyberdark-600 text-cybergold-400 hover:bg-cyberdark-800",
                  children: "Avbryt"
                }
              )
            ] })
          ] })
        ] }) : selectedMessage ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-400", children: selectedMessage.subject }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-cyberdark-700 text-cybergold-400 text-xs", children: selectedMessage.from.charAt(0).toUpperCase() }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-cybergold-400", children: [
                    "Fra: ",
                    selectedMessage.from
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-cybergold-600", children: [
                    selectedMessage.timestamp.toLocaleDateString("nb-NO"),
                    " ",
                    selectedMessage.timestamp.toLocaleTimeString("nb-NO")
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "icon",
                  variant: "outline",
                  onClick: () => handleToggleStar(selectedMessage.id),
                  className: `border-cyberdark-600 ${selectedMessage.starred ? "text-yellow-400" : "text-cybergold-600"} hover:bg-cyberdark-800`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `h-4 w-4 ${selectedMessage.starred ? "fill-current" : ""}` })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "icon",
                  variant: "outline",
                  onClick: () => handleDeleteMessage(selectedMessage.id),
                  className: "border-red-600 text-red-400 hover:bg-red-900/20",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose prose-invert max-w-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 whitespace-pre-wrap", children: selectedMessage.content }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-6 bg-cyberdark-700" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  onClick: () => {
                    setNewMessage({
                      to: selectedMessage.from,
                      subject: `Re: ${selectedMessage.subject}`,
                      content: `

--- Original melding ---
Fra: ${selectedMessage.from}
Emne: ${selectedMessage.subject}

${selectedMessage.content}`
                    });
                    setIsComposing(true);
                  },
                  variant: "outline",
                  className: "border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Reply, { className: "h-4 w-4 mr-2" }),
                    "Svar"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  onClick: () => {
                    setNewMessage({
                      to: "",
                      subject: `Fwd: ${selectedMessage.subject}`,
                      content: `

--- Videresendt melding ---
Fra: ${selectedMessage.from}
Emne: ${selectedMessage.subject}

${selectedMessage.content}`
                    });
                    setIsComposing(true);
                  },
                  variant: "outline",
                  className: "border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Forward, { className: "h-4 w-4 mr-2" }),
                    "Videresend"
                  ]
                }
              )
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-12 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$2, { className: "h-16 w-16 mx-auto mb-4 text-cybergold-600 opacity-50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-medium text-cybergold-400 mb-2", children: "Velg en melding" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600", children: "Klikk på en melding fra listen for å lese den, eller opprett en ny melding." })
        ] }) }) })
      ] }),
      !isPremium && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mt-6 bg-gradient-to-r from-cybergold-900/20 to-cyberdark-800 border-cybergold-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-6 w-6 text-cybergold-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-cybergold-400", children: "Oppgrader til Premium" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 text-sm", children: "Få tilgang til avanserte mail-funksjoner som filvedlegg, e-post-viderekobling og mer lagringsplass." })
        ] })
      ] }) }) })
    ] })
  ] });
};
const Mail$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Mail
}, Symbol.toStringTag, { value: "Module" }));
const MemoryDashboard = () => {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const [memories, setMemories] = reactExports.useState([]);
  const [stats, setStats] = reactExports.useState(null);
  const [adminOverview, setAdminOverview] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedType, setSelectedType] = reactExports.useState("all");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("memories");
  const [newMemory, setNewMemory] = reactExports.useState({
    type: "user_preference",
    key: "",
    value: "",
    context: ""
  });
  const memoryTypes = [
    { value: "user_preference", label: "Brukerpreferanse", color: "bg-blue-500" },
    { value: "conversation_context", label: "Samtale-kontekst", color: "bg-green-500" },
    { value: "learned_fact", label: "Lært faktum", color: "bg-purple-500" },
    { value: "emotional_state", label: "Følelsestilstand", color: "bg-pink-500" },
    { value: "task_context", label: "Oppgave-kontekst", color: "bg-orange-500" },
    { value: "user_relationship", label: "Brukerforhold", color: "bg-red-500" },
    { value: "interaction_pattern", label: "Interaksjonsmønster", color: "bg-indigo-500" }
  ];
  const getTypeInfo = (type) => {
    return memoryTypes.find((t) => t.value === type) || memoryTypes[0];
  };
  const loadMemories = reactExports.useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const memoryTypes2 = selectedType === "all" ? void 0 : [selectedType];
      const result = await memoryService.retrieveMemories(
        user.id,
        searchQuery || void 0,
        { memoryTypes: memoryTypes2, limit: 50 }
      );
      setMemories(result);
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke laste minner",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedType, searchQuery, toast]);
  const loadStats = reactExports.useCallback(async () => {
    if (!user) return;
    try {
      const result = await memoryService.analyzeMemoryPatterns(user.id);
      setStats(result);
    } catch (error) {
      console.error("Feil ved lasting av statistikk:", error);
    }
  }, [user]);
  const loadAdminOverview = reactExports.useCallback(async () => {
    try {
      const result = await memoryService.getAdminOverview();
      setAdminOverview(result);
    } catch (error) {
      console.error("Feil ved lasting av admin oversikt:", error);
    }
  }, []);
  reactExports.useEffect(() => {
    if (user) {
      loadMemories();
      loadStats();
      if (isPremium) {
        loadAdminOverview();
      }
    }
  }, [user, isPremium, loadMemories, loadStats, loadAdminOverview]);
  const handleCreateMemory = async () => {
    if (!user || !newMemory.key || !newMemory.value) {
      toast({
        title: "Feil",
        description: "Vennligst fyll ut nøkkel og verdi",
        variant: "destructive"
      });
      return;
    }
    try {
      const result = await memoryService.storeMemory(
        user.id,
        newMemory.type,
        newMemory.key,
        newMemory.value,
        {
          context: newMemory.context,
          source: "manual_dashboard"
        }
      );
      if (result.success) {
        toast({
          title: "Minne lagret",
          description: `Minne ID: ${result.memory_id || "Ukjent"}`
        });
        setNewMemory({
          type: "user_preference",
          key: "",
          value: "",
          context: ""
        });
        loadMemories();
        loadStats();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke lagre minne",
        variant: "destructive"
      });
    }
  };
  const handleDeleteMemory = async (key) => {
    if (!user) return;
    try {
      const result = await memoryService.forgetMemories(user.id, { key });
      if (result.success) {
        toast({
          title: "Minne slettet",
          description: `${result.deleted_count} minne(r) ble slettet`
        });
        loadMemories();
        loadStats();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke slette minne",
        variant: "destructive"
      });
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("nb-NO");
  };
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-cyberdark-950 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-400", children: "Du må være logget inn for å bruke minnesystemet." }) }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cyberdark-950 text-cybergold-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-cyberdark-900 border-b border-cyberdark-700 px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-6 w-6 text-cybergold-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-cybergold-400", children: "Minnesjstem" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600", children: "AI-drevet langtidsminne for personalisering" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-cybergold-600 to-cybergold-400 text-black", children: [
          memories.length,
          " Minner"
        ] }),
        isPremium && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-cybergold-600 text-cybergold-400", children: "Admin Tilgang" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "container max-w-7xl py-8 px-6", children: [
      stats && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-5 w-5 text-cybergold-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-600", children: "Totale Minner" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-cybergold-400", children: stats.total_memories })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5 text-yellow-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-600", children: "Gj.snitt Viktighet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-yellow-400", children: [
              (stats.avg_importance * 100).toFixed(0),
              "%"
            ] })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-green-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-600", children: "Maks Tilgang" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-green-400", children: stats.max_access_count })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-5 w-5 text-purple-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-600", children: "Minnetyper" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-purple-400", children: stats.unique_types })
          ] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-4 mb-6 bg-cyberdark-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "memories",
              className: "data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-4 w-4 mr-2" }),
                "Minner"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "create",
              className: "data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
                "Opprett"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "analytics",
              className: "data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 mr-2" }),
                "Analyse"
              ]
            }
          ),
          isPremium && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "admin",
              className: "data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 mr-2" }),
                "Admin"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "memories", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-3 h-4 w-4 text-cybergold-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Søk i minner...",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: "pl-10 bg-cyberdark-800 border-cyberdark-700"
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-48", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: selectedType,
                onChange: (e) => setSelectedType(e.target.value),
                className: "w-full p-2 bg-cyberdark-800 border border-cyberdark-700 rounded text-cybergold-300",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Alle typer" }),
                  memoryTypes.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: type.value, children: type.label }, type.value))
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: loadMemories,
                className: "bg-cybergold-600 hover:bg-cybergold-500 text-black",
                disabled: isLoading,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 mr-2" }),
                  "Søk"
                ]
              }
            )
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            memories.map((memory) => {
              const typeInfo = getTypeInfo(memory.memory_type);
              return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-3 h-3 rounded-full ${typeInfo.color}` }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-cybergold-400", children: memory.key }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "mt-1 border-current text-xs", children: typeInfo.label })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-sm", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600", children: "Viktighet" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-cybergold-400 font-mono", children: [
                        (memory.importance * 100).toFixed(0),
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        onClick: () => handleDeleteMemory(memory.key),
                        className: "border-red-600 text-red-400 hover:bg-red-600/20",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 mb-4", children: memory.value }),
                memory.context && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600 text-sm mb-1", children: "Kontekst" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-400 text-sm", children: memory.context })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600", children: "Tilgang" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-cybergold-300", children: [
                      memory.access_count,
                      "x"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600", children: "Opprettet" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300", children: formatDate(memory.created_at) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600", children: "Sist brukt" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300", children: formatDate(memory.last_accessed) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600", children: "Kilde" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300", children: memory.source || "Ukjent" })
                  ] })
                ] })
              ] }) }, memory.id);
            }),
            memories.length === 0 && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-8 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-12 w-12 text-cybergold-600 mx-auto mb-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-400", children: "Ingen minner funnet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600 text-sm mt-2", children: "Prøv å endre søkekriterier eller opprett ditt første minne." })
            ] }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "create", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-400", children: "Opprett Nytt Minne" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "type", children: "Minnetype" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: newMemory.type,
                  onChange: (e) => setNewMemory((prev) => ({ ...prev, type: e.target.value })),
                  className: "w-full p-2 mt-1 bg-cyberdark-800 border border-cyberdark-700 rounded text-cybergold-300",
                  children: memoryTypes.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: type.value, children: type.label }, type.value))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "key", children: "Nøkkel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "key",
                  placeholder: "f.eks. 'favoritt_farge' eller 'musikk_preferanse'",
                  value: newMemory.key,
                  onChange: (e) => setNewMemory((prev) => ({ ...prev, key: e.target.value })),
                  className: "mt-1 bg-cyberdark-800 border-cyberdark-700"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "value", children: "Verdi" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "value",
                  placeholder: "Skriv minneinnholdet her...",
                  value: newMemory.value,
                  onChange: (e) => setNewMemory((prev) => ({ ...prev, value: e.target.value })),
                  className: "mt-1 bg-cyberdark-800 border-cyberdark-700",
                  rows: 3
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "context", children: "Kontekst (valgfritt)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "context",
                  placeholder: "f.eks. 'Fra samtale om musikk'",
                  value: newMemory.context,
                  onChange: (e) => setNewMemory((prev) => ({ ...prev, context: e.target.value })),
                  className: "mt-1 bg-cyberdark-800 border-cyberdark-700"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: handleCreateMemory,
                className: "w-full bg-cybergold-600 hover:bg-cybergold-500 text-black",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
                  "Lagre Minne"
                ]
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "analytics", children: stats && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-400", children: "Minnefordeling etter Type" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: stats.type_distribution.map((type) => {
            const typeInfo = getTypeInfo(type.memory_type);
            const percentage = type.count / stats.total_memories * 100;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-3 h-3 rounded-full ${typeInfo.color}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-300", children: typeInfo.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-400 text-sm", children: type.count })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-cyberdark-800 rounded-full h-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `h-2 rounded-full ${typeInfo.color} opacity-70`,
                    style: { width: `${percentage}%` }
                  }
                ) })
              ] })
            ] }, type.memory_type);
          }) }) })
        ] }) }) }),
        isPremium && adminOverview && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "admin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-400", children: "Admin Oversikt" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600 text-sm", children: "Totale Brukere" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-cybergold-400", children: adminOverview.total_statistics.total_users })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600 text-sm", children: "Totale Minner" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-cybergold-400", children: adminOverview.total_statistics.total_memories })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600 text-sm", children: "Total Størrelse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-cybergold-400", children: [
                  (adminOverview.total_statistics.total_size_bytes / 1024 / 1024).toFixed(1),
                  " MB"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-600 text-sm", children: "Gj.snitt Viktighet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-cybergold-400", children: [
                  (adminOverview.total_statistics.avg_importance * 100).toFixed(0),
                  "%"
                ] })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-400", children: "Top Brukere (Minnebruk)" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: adminOverview.top_users.slice(0, 10).map((user2, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-cyberdark-800 rounded", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "border-cybergold-600 text-cybergold-400", children: [
                  "#",
                  index + 1
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-cybergold-300 font-mono", children: [
                  user2.user_id.slice(0, 8),
                  "..."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-cybergold-400", children: [
                  user2.total_memories,
                  " minner"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-cybergold-600 text-sm", children: [
                  (user2.total_size_bytes / 1024).toFixed(1),
                  " KB"
                ] })
              ] })
            ] }, user2.user_id)) }) })
          ] })
        ] }) })
      ] })
    ] })
  ] });
};
const MemoryDashboard$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MemoryDashboard
}, Symbol.toStringTag, { value: "Module" }));
export {
  AdminSecurityPanel$1 as A,
  CompleteMobileTest$1 as C,
  DashboardPage$1 as D,
  FinalMobileTest$1 as F,
  Info$1 as I,
  LiquidGlassDemo$1 as L,
  MobileTestPage$1 as M,
  PWADemo$1 as P,
  SnakkaZBetaLanding$1 as S,
  ImprovedMobileTest$1 as a,
  CreateGroupPage$1 as b,
  FriendsPage$1 as c,
  FindFriends$1 as d,
  ProfilePageNew as e,
  MCPDashboard$1 as f,
  Subscription$1 as g,
  InviteSystemDemo$1 as h,
  Profile$1 as i,
  Settings$1 as j,
  Friends$1 as k,
  Mail$1 as l,
  MemoryDashboard$1 as m
};
//# sourceMappingURL=pages-main-CX2DMHnw.js.map
