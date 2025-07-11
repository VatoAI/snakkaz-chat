import { j as jsxRuntimeExports, bY as ChevronLeft, aD as Users$1, aA as Settings, ax as RefreshCw, aI as Shield, b6 as Lock, a_ as Star, a$ as Zap, r as reactExports, bh as Crown, X, bZ as FileUp, aV as Send, b_ as Ellipsis, b$ as UserX, ba as Search, br as CircleX, az as User, aH as Info, bH as SquarePen, aE as UserPlus, c0 as Trash, aw as CircleAlert, c1 as ChartNoAxesColumnIncreasing, c2 as CirclePlus, be as Clock, Q as Check, G as ChevronDown, Y as ChevronUp, c3 as File, b as Root2, L as List, c as Trigger, d as Content, bw as Upload, bI as Download, aQ as Share2, c4 as FolderPlus, c5 as Folder, c6 as ClipboardCheck, b5 as Globe, bv as Image, c7 as Film, c8 as FileText, c9 as FileSpreadsheet, ca as Presentation, cb as FileArchive, bz as KeyRound, aU as MessageSquare, cc as ChartColumnIncreasing } from "./vendor-react-core-Cd05VJ5Y.js";
import { S as SecurityLevel, t as toSecurityLevel } from "./vendor-security-LdHy7Pt9.js";
import { n as UserAvatar, o as SecurityBadge } from "./components-ui-CoK5VGD0.js";
import { B as Button, t as TooltipProvider, v as Tooltip, w as TooltipTrigger, x as TooltipContent, e as cn, T as Textarea, I as Input, L as Label$1, y as useToast, z as Badge, a9 as DropdownMenu, aa as DropdownMenuTrigger, ab as DropdownMenuContent, ac as DropdownMenuItem, r as supabase, D as Dialog, k as DialogContent, l as DialogHeader, m as DialogTitle, n as DialogDescription, a3 as Select, a4 as SelectTrigger, a5 as SelectValue, a6 as SelectContent, a7 as SelectItem, V as DialogFooter, H as Tabs, J as TabsList, K as TabsTrigger, M as TabsContent, C as Card, f as CardHeader, g as CardTitle, h as CardDescription, i as CardContent, A as Avatar, a as AvatarImage, b as AvatarFallback, S as Switch, G as CardFooter, ad as AlertDialog, ae as AlertDialogTrigger, af as AlertDialogContent, ag as AlertDialogHeader, ah as AlertDialogTitle, ai as AlertDialogDescription, aj as AlertDialogFooter, ak as AlertDialogCancel, al as AlertDialogAction, N as Separator, j as DialogTrigger, am as useNetworkStatus, an as useMediaQuery, ao as useEnhancedOfflineMessages } from "./app-utils-CvwRV1zG.js";
import { d as getGroupKey, e as rotateGroupKey, f as encryptGroupMessage, I as IndexedDBStorage, i as indexedDBStorage } from "./app-services-Cf0jkxe3.js";
import { f as format, a as formatDistanceToNow } from "./vendor-date-utils-D2GbuEg1.js";
import "./vendor-react-dom-DmiX1e6y.js";
import "./vendor-misc-guM_vOlB.js";
import "./vendor-database-Cidpe8p9.js";
import "./vendor-react-hooks-Df_KBos6.js";
import "./vendor-radix-ui-UJNVxv2C.js";
import "./vendor-animation-BRHAymv3.js";
import "./vendor-router-DRYHFKTT.js";
import "./vendor-style-utils-nLA3zUC6.js";
import "./vendor-media-rJiPBk-1.js";
import "./vendor-network-BSBq6A-N.js";
const GroupChatHeader = ({
  group,
  connectionState,
  dataChannelState,
  usingServerFallback,
  connectionAttempts,
  onBack,
  onReconnect,
  securityLevel,
  setSecurityLevel,
  userProfiles = {},
  isAdmin,
  isPremium,
  isPremiumMember,
  onShowInvite,
  onShowPremium,
  onShowMembers,
  onOpenSettings,
  isPageEncryptionEnabled,
  onEnablePageEncryption,
  onEncryptAllMessages,
  encryptionStatus,
  isMobile = false
}) => {
  var _a;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-b border-cyberdark-700 bg-cyberdark-900/80", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: onBack,
          className: "mr-2 text-cybergold-400 hover:bg-cyberdark-800",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          UserAvatar,
          {
            src: group.avatar_url || "/snakkaz-logo.png",
            alt: group.name,
            isGroup: true,
            size: isMobile ? 32 : 36
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-cybergold-300", children: group.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-cybergold-500", children: [
            ((_a = group.members) == null ? void 0 : _a.length) || 0,
            " medlemmer"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: onShowMembers,
            className: "text-cybergold-400 hover:bg-cyberdark-800",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users$1, { className: "h-4 w-4" })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Vis medlemmer" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: onShowInvite,
            className: "text-cybergold-400 hover:bg-cyberdark-800",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: "lucide lucide-user-plus h-4 w-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8.5", cy: "7", r: "4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "20", x2: "17", y1: "15", y2: "15" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "18.5", x2: "18.5", y1: "13.5", y2: "16.5" })
                ]
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Inviter medlemmer" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: onOpenSettings,
            className: "text-cybergold-400 hover:bg-cyberdark-800",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Gruppeinnstillinger" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: onReconnect,
            disabled: connectionState === "connecting" || connectionState === "connected",
            className: cn(
              "text-cybergold-400 hover:bg-cyberdark-800",
              connectionState === "connecting" && "animate-spin"
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: connectionState === "connecting" ? "Kobler til..." : connectionState === "connected" ? "Tilkoblet" : "Koble til på nytt" }) })
      ] }) })
    ] })
  ] });
};
const GroupChatEmptyState = ({
  groupName,
  connectionState,
  securityLevel,
  isAdmin,
  isPremium,
  isPremiumMember,
  memberCount,
  onShowInvite,
  onShowPremium,
  isPageEncryptionEnabled,
  onEnablePageEncryption
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center p-8 h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-cyberdark-800/70 rounded-xl p-6 border border-cybergold-800/40 max-w-md w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-cybergold-300 text-xl font-semibold mb-1", children: groupName ? `Velkommen til ${groupName}` : "Ny gruppesamtale" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-500 mb-6", children: "Denne samtalen er tom. Start samtalen ved å sende en melding!" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900/50 rounded-lg p-4 text-left border border-cyberdark-700/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-2", children: [
          securityLevel === SecurityLevel.SERVER_E2EE ? /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 mr-2 text-cybergold-500" }) : securityLevel === SecurityLevel.P2P_E2EE ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-5 w-5 mr-2 text-cybergold-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 mr-2 text-cybergold-600/70" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-cybergold-300 font-medium", children: "Sikkerhetsnivå" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-500/80", children: securityLevel === SecurityLevel.SERVER_E2EE ? "Denne samtalen er beskyttet med ende-til-ende-kryptering via serveren." : securityLevel === SecurityLevel.P2P_E2EE ? connectionState === "connected" ? "Denne samtalen er beskyttet med direkte ende-til-ende-kryptering mellom deltakerne." : "Venter på direkte ende-til-ende-kryptert tilkobling..." : "Standard sikkerhetsnivå. Meldinger lagres kryptert på serveren." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "bg-cyberdark-900/50 text-cybergold-400 border-cyberdark-700/50 hover:bg-cyberdark-800 hover:text-cybergold-300 justify-start gap-2",
          onClick: onShowInvite,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users$1, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex-1 text-left", children: [
              memberCount,
              " ",
              memberCount === 1 ? "medlem" : "medlemmer",
              " i denne gruppen"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cybergold-500", children: "Inviter flere" })
          ]
        }
      ),
      isPremium && !isPremiumMember && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "bg-cybergold-900/20 text-cybergold-400 border-cybergold-700/30 hover:bg-cybergold-900/40 hover:text-cybergold-300 justify-start gap-2",
          onClick: onShowPremium,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-cybergold-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-left", children: "Dette er en premium-gruppe" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cybergold-500", children: "Oppgrader" })
          ]
        }
      ),
      (isAdmin || isPremiumMember) && !isPageEncryptionEnabled && onEnablePageEncryption && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "bg-cyberdark-900/50 text-cybergold-400 border-cyberdark-700/50 hover:bg-cyberdark-800 hover:text-cybergold-300 justify-start gap-2",
          onClick: onEnablePageEncryption,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-left", children: "Aktiver helside-kryptering" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cybergold-500", children: "Anbefalt" })
          ]
        }
      )
    ] })
  ] }) }) });
};
const MessageGroup = ({
  groupedMessages,
  getDateSeparatorText,
  getUserStatus,
  onEditMessage,
  onDeleteMessage,
  securityLevel = "standard"
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: Object.keys(groupedMessages).map((dateKey) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cyberdark-400 bg-cyberdark-900/70 px-2 py-1 rounded-full", children: getDateSeparatorText(dateKey) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: groupedMessages[dateKey].map((message) => {
      var _a;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "message-item", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 rounded-lg bg-cyberdark-800/70 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-cybergold-300", children: ((_a = message.sender) == null ? void 0 : _a.username) || "Unknown user" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cyberdark-400", children: new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-white", children: message.content })
      ] }) }, message.id);
    }) })
  ] }, dateKey)) });
};
const DirectMessageList = ({
  messages,
  currentUserId,
  peerIsTyping,
  isMessageRead,
  connectionState,
  dataChannelState,
  usingServerFallback,
  onEditMessage,
  onDeleteMessage,
  securityLevel = "server_e2ee",
  isPageEncrypted = false,
  isPremiumMember = false,
  isMobile = false
}) => {
  const bottomRef = reactExports.useRef(null);
  const messagesEndRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    var _a;
    (_a = messagesEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, peerIsTyping]);
  const getDateSeparatorText = (dateKey) => {
    return dateKey;
  };
  const getUserStatus = (userId) => {
    return "online";
  };
  const groupedMessages = {};
  messages.forEach((message) => {
    const date = new Date(message.created_at).toDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", ref: bottomRef, children: [
    isPageEncrypted && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center p-2 mb-2 text-xs text-cybergold-300 bg-cybergold-900/10 rounded-md border border-cybergold-500/20", children: "Denne samtalen er beskyttet med helside-kryptering" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MessageGroup,
      {
        groupedMessages,
        getDateSeparatorText,
        getUserStatus,
        onEditMessage,
        onDeleteMessage,
        securityLevel
      }
    ),
    peerIsTyping && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 text-sm text-cybergold-400 animate-pulse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-cyberdark-800 border border-cybergold-500/20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 rounded-lg bg-cyberdark-800 border border-cybergold-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-bounce", children: "." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-bounce", style: { animationDelay: "0.2s" }, children: "." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-bounce", style: { animationDelay: "0.4s" }, children: "." })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
  ] });
};
const DirectMessageForm = ({
  usingServerFallback,
  sendError,
  isLoading,
  onSendMessage,
  newMessage,
  onChangeMessage,
  connectionState,
  dataChannelState,
  editingMessage,
  onCancelEdit,
  securityLevel,
  isPageEncrypted = false,
  isPremiumMember = false,
  maxFileSize = 50 * 1024 * 1024
  // Default: 50MB
}) => {
  const [isComposing, setIsComposing] = reactExports.useState(false);
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" && !selectedFile || isLoading) return;
    setIsComposing(false);
    await onSendMessage(e, newMessage);
    setSelectedFile(null);
  };
  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    const file = e.target.files[0];
    if (file.size > maxFileSize) {
      alert(`Filen er for stor (${formatFileSize(file.size)}). Maksimal størrelse er ${formatFileSize(maxFileSize)}`);
      e.target.value = "";
      return;
    }
    setSelectedFile(file);
  };
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    else return (bytes / 1073741824).toFixed(1) + " GB";
  };
  const isConnected = securityLevel === "p2p_e2ee" && (connectionState === "connected" && dataChannelState === "open" || usingServerFallback) || securityLevel === "server_e2ee" || securityLevel === "standard";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-cybergold-500/30 p-4 bg-cyberdark-900", children: [
    isPremiumMember && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 p-2 bg-gradient-to-r from-cybergold-900 to-cyberdark-800 border border-cybergold-500/30 rounded-md text-sm text-cybergold-300 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-4 w-4 text-cybergold-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Premium-funksjoner aktivert" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-cybergold-500/80", children: [
        "Maks filstørrelse: ",
        formatFileSize(maxFileSize)
      ] })
    ] }),
    isPageEncrypted && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 p-2 bg-cyberblue-600/10 border border-cyberblue-500/30 rounded-md text-sm text-cyberblue-300 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isPremiumMember ? "Denne samtalen er beskyttet med 256-bit kryptering" : "Denne samtalen er helside-kryptert" })
    ] }),
    !isConnected && securityLevel === "p2p_e2ee" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 p-2 bg-amber-600/20 border border-amber-500/40 rounded-md text-sm text-amber-300", children: "Venter på tilkobling. Meldingen vil sendes når tilkoblingen er etablert, eller faller tilbake til server etter en kort stund." }),
    sendError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 p-2 bg-red-600/20 border border-red-500/40 rounded-md text-sm text-red-300", children: sendError }),
    editingMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between p-2 bg-amber-600/20 border border-amber-500/40 rounded-md text-sm text-amber-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Redigerer melding" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: onCancelEdit,
          className: "h-6 w-6 text-amber-300 hover:text-amber-200 hover:bg-amber-900/40",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }),
    selectedFile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between p-2 bg-cyberblue-600/20 border border-cyberblue-500/40 rounded-md text-sm text-cyberblue-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileUp, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          selectedFile.name,
          " (",
          formatFileSize(selectedFile.size),
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => setSelectedFile(null),
          className: "h-6 w-6 text-cyberblue-300 hover:text-cyberblue-200 hover:bg-cyberblue-900/40",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            value: newMessage,
            onChange: (e) => {
              onChangeMessage(e.target.value);
              setIsComposing(true);
            },
            placeholder: "Skriv en melding...",
            rows: 1,
            className: "resize-none bg-cyberdark-800 border-cybergold-500/30 focus:border-cybergold-500/60 pr-10",
            onKeyDown: (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 right-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SecurityBadge,
          {
            securityLevel,
            connectionState,
            dataChannelState,
            usingServerFallback,
            isPremium: isPremiumMember,
            size: "sm"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "file",
              onChange: handleFileChange,
              className: "hidden",
              id: "file-upload"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Label$1,
            {
              htmlFor: "file-upload",
              className: cn(
                "flex items-center gap-1 py-1 px-2 rounded cursor-pointer text-sm",
                isPremiumMember ? "bg-gradient-to-r from-cybergold-900 to-cyberdark-700 hover:from-cybergold-800 hover:to-cyberdark-600" : "bg-cyberdark-700 hover:bg-cyberdark-600"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileUp, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isPremiumMember ? `Fil (opp til ${formatFileSize(maxFileSize)})` : "Fil" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "submit",
            className: `bg-cybergold-600 hover:bg-cybergold-700 text-black px-4 ${isLoading || newMessage.trim() === "" && !selectedFile ? "opacity-50 cursor-not-allowed" : ""}`,
            disabled: isLoading || newMessage.trim() === "" && !selectedFile,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-2" }),
              "Send"
            ]
          }
        )
      ] })
    ] })
  ] });
};
function useGroupChat(options) {
  const { group, currentUserId } = options;
  const [messages, setMessages] = reactExports.useState([]);
  const [securityLevel, setSecurityLevel] = reactExports.useState(SecurityLevel.STANDARD);
  const mockSendMessage = async (text, attachmentBlob) => {
    console.log("Sending message:", text, attachmentBlob);
    return true;
  };
  const mockLoadMoreMessages = async () => {
    console.log("Loading more messages");
  };
  const mockMarkMessageAsRead = async (messageId) => {
    console.log("Marking message as read:", messageId);
  };
  const mockReconnect = async () => {
    console.log("Reconnecting");
    return true;
  };
  return {
    messages,
    sendMessage: mockSendMessage,
    isLoading: false,
    loadMoreMessages: mockLoadMoreMessages,
    markMessageAsRead: mockMarkMessageAsRead,
    connectionState: "connected",
    dataChannelState: "connected",
    usingServerFallback: false,
    connectionAttempts: 0,
    members: group.members,
    isAdmin: group.members.some((m) => m.user_id === currentUserId && m.role === "admin"),
    isPremium: true,
    // Assume premium for now
    isPremiumMember: true,
    // Assume premium for now
    securityLevel,
    setSecurityLevel,
    reconnect: mockReconnect,
    isPageEncryptionEnabled: true,
    enablePageEncryption: () => true,
    encryptAllMessages: () => Promise.resolve(true),
    handleDeleteMessage: async (messageId) => {
      console.log("Deleting message:", messageId);
      return true;
    }
  };
}
const ROLE_HIERARCHY = [
  "admin",
  "moderator",
  "premium",
  "member"
];
function validateRoleChange(members, currentUserId, targetUserId, newRole) {
  const currentUserMember = members.find((m) => m.user_id === currentUserId);
  const targetUserMember = members.find((m) => m.user_id === targetUserId);
  if (!currentUserMember || !targetUserMember) {
    return {
      valid: false,
      message: "Could not find one or both users in the group."
    };
  }
  const currentUserRole = currentUserMember.role;
  const targetUserRole = targetUserMember.role;
  if (!hasRolePermission(currentUserRole, "moderator")) {
    return {
      valid: false,
      message: "You don't have permission to change member roles."
    };
  }
  if ((newRole === "admin" || newRole === "moderator") && !hasRolePermission(currentUserRole, "admin")) {
    return {
      valid: false,
      message: "Only administrators can promote members to admin or moderator roles."
    };
  }
  if (targetUserRole === "admin" && newRole !== "admin") {
    const adminCount = members.filter((m) => m.role === "admin").length;
    if (adminCount <= 1) {
      return {
        valid: false,
        message: "Cannot demote the last administrator."
      };
    }
  }
  if (hasRolePermission(targetUserRole, "admin") && !hasRolePermission(currentUserRole, "admin")) {
    return {
      valid: false,
      message: "You cannot change the role of a user with higher permissions than you."
    };
  }
  return { valid: true };
}
function hasRolePermission(userRole, requiredRole) {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  if (userRoleIndex === -1 || requiredRoleIndex === -1) {
    return false;
  }
  return userRoleIndex <= requiredRoleIndex;
}
function getRolePermissions(role) {
  return {
    canManageRoles: hasRolePermission(role, "admin"),
    canModerateMessages: hasRolePermission(role, "moderator"),
    canInviteMembers: hasRolePermission(role, "moderator"),
    canRemoveMembers: hasRolePermission(role, "moderator"),
    canManageFiles: hasRolePermission(role, "moderator"),
    canCreatePolls: hasRolePermission(role, "moderator"),
    canUploadUnlimitedFiles: hasRolePermission(role, "premium"),
    canCreateEncryptedChats: hasRolePermission(role, "premium"),
    canSendMessages: true
  };
}
function getRoleLabel(role) {
  const labels = {
    "admin": "Administrator",
    "moderator": "Moderator",
    "premium": "Premium Member",
    "member": "Member"
  };
  return labels[role] || "Unknown Role";
}
function getRoleDescription(role) {
  const descriptions = {
    "admin": "Full control of group settings and members",
    "moderator": "Can manage members, messages and files",
    "premium": "Standard member with access to premium features",
    "member": "Standard member with basic permissions"
  };
  return descriptions[role] || "Unknown role permissions";
}
const GroupMembersList = ({
  members,
  currentUserId,
  userProfiles,
  isAdmin,
  groupId,
  onMemberUpdated,
  isMobile = false
}) => {
  const { toast } = useToast();
  const handlePromoteToAdmin = async (memberId) => {
    try {
      const { error } = await supabase.from("group_members").update({ role: "admin" }).eq("group_id", groupId).eq("user_id", memberId);
      if (error) {
        throw error;
      }
      toast({
        title: "Member promoted",
        description: "Member is now an administrator"
      });
      onMemberUpdated == null ? void 0 : onMemberUpdated();
    } catch (error) {
      console.error("Error promoting member:", error);
      toast({
        title: "Could not promote member",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handlePromoteToModerator = async (memberId) => {
    try {
      const { error } = await supabase.from("group_members").update({ role: "moderator" }).eq("group_id", groupId).eq("user_id", memberId);
      if (error) {
        throw error;
      }
      toast({
        title: "Member promoted",
        description: "Member is now a moderator"
      });
      onMemberUpdated == null ? void 0 : onMemberUpdated();
    } catch (error) {
      console.error("Error promoting to moderator:", error);
      toast({
        title: "Could not promote member",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handlePromoteToPremium = async (memberId) => {
    try {
      const { error } = await supabase.from("group_members").update({ role: "premium" }).eq("group_id", groupId).eq("user_id", memberId);
      if (error) {
        throw error;
      }
      toast({
        title: "Member promoted",
        description: "Member is now a premium member"
      });
      onMemberUpdated == null ? void 0 : onMemberUpdated();
    } catch (error) {
      console.error("Error promoting to premium:", error);
      toast({
        title: "Could not promote member",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleDemoteToMember = async (memberId, currentRole) => {
    try {
      const { error } = await supabase.from("group_members").update({ role: "member" }).eq("group_id", groupId).eq("user_id", memberId);
      if (error) {
        throw error;
      }
      toast({
        title: "Member demoted",
        description: `Member is no longer a ${getRoleLabel(currentRole).toLowerCase()}`
      });
      onMemberUpdated == null ? void 0 : onMemberUpdated();
    } catch (error) {
      console.error("Error demoting member:", error);
      toast({
        title: "Could not demote member",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleRemoveMember = async (memberId) => {
    try {
      const { error } = await supabase.from("group_members").delete().eq("group_id", groupId).eq("user_id", memberId);
      if (error) {
        throw error;
      }
      toast({
        title: "Member removed",
        description: "Member has been removed from the group"
      });
      onMemberUpdated == null ? void 0 : onMemberUpdated();
    } catch (error) {
      console.error("Error removing member:", error);
      toast({
        title: "Could not remove member",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3 mr-0.5" });
      case "moderator":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3 mr-0.5" });
      case "premium":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 mr-0.5" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Users$1, { className: "h-3 w-3 mr-0.5" });
    }
  };
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin":
        return "secondary";
      case "moderator":
        return "default";
      case "premium":
        return "outline";
      default:
        return "outline";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: members.map((member) => {
    var _a;
    const userProfile = userProfiles[member.user_id];
    const isCurrentUser = member.user_id === currentUserId;
    const memberRole = member.role;
    const currentUserRole = ((_a = members.find((m) => m.user_id === currentUserId)) == null ? void 0 : _a.role) || "member";
    const canManageMember = hasRolePermission(currentUserRole, "admin") || hasRolePermission(currentUserRole, "moderator") && memberRole === "member";
    const adminCount = members.filter((m) => m.role === "admin").length;
    const isLastAdmin = memberRole === "admin" && adminCount === 1;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 rounded-md bg-cyberdark-900/50 border border-cyberdark-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          UserAvatar,
          {
            src: (userProfile == null ? void 0 : userProfile.avatar_url) || void 0,
            alt: (userProfile == null ? void 0 : userProfile.username) || "Group Member",
            size: 32
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-cybergold-300", children: (userProfile == null ? void 0 : userProfile.username) || "Unknown User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cybergold-500 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: getRoleBadgeVariant(memberRole), className: "mr-1", children: [
              getRoleIcon(memberRole),
              getRoleLabel(memberRole)
            ] }),
            isCurrentUser && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: "You" })
          ] })
        ] })
      ] }),
      canManageMember && !isCurrentUser && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "h-8 w-8 p-0 rounded-full hover:bg-cyberdark-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "h-4 w-4 text-cybergold-400" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", forceMount: true, className: "w-48 bg-cyberdark-900 border-cyberdark-700 text-cybergold-200", children: [
          hasRolePermission(currentUserRole, "admin") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            memberRole !== "admin" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => handlePromoteToAdmin(member.user_id), className: "focus:bg-cyberdark-800", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-4 w-4 mr-2 text-amber-400" }),
              "Promote to Admin"
            ] }) : !isLastAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => handleDemoteToMember(member.user_id, memberRole), className: "focus:bg-cyberdark-800", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 mr-2 text-cybergold-400" }),
              "Demote to Member"
            ] }),
            memberRole !== "moderator" && memberRole !== "admin" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => handlePromoteToModerator(member.user_id), className: "focus:bg-cyberdark-800", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 mr-2 text-cybergold-400" }),
              "Promote to Moderator"
            ] }) : memberRole === "moderator" && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => handleDemoteToMember(member.user_id, memberRole), className: "focus:bg-cyberdark-800", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users$1, { className: "h-4 w-4 mr-2" }),
              "Demote to Member"
            ] }),
            memberRole !== "premium" && memberRole !== "admin" && memberRole !== "moderator" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => handlePromoteToPremium(member.user_id), className: "focus:bg-cyberdark-800", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 mr-2 text-purple-400" }),
              "Promote to Premium"
            ] }) : memberRole === "premium" && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => handleDemoteToMember(member.user_id, memberRole), className: "focus:bg-cyberdark-800", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users$1, { className: "h-4 w-4 mr-2" }),
              "Demote to Member"
            ] })
          ] }),
          hasRolePermission(currentUserRole, "moderator") && memberRole !== "admin" && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => handleRemoveMember(member.user_id), className: "text-red-500 focus:bg-cyberdark-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "h-4 w-4 mr-2" }),
            "Remove from group"
          ] })
        ] })
      ] })
    ] }, member.user_id);
  }) });
};
function GroupMemberRoleManager({
  isOpen,
  onClose,
  members,
  currentUserId,
  userProfiles,
  groupId,
  onMemberUpdated
}) {
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [isUpdating, setIsUpdating] = reactExports.useState({});
  const { toast } = useToast();
  const filteredMembers = members.filter((member) => {
    var _a, _b;
    const username = ((_a = userProfiles[member.user_id]) == null ? void 0 : _a.username) || "";
    const fullName = ((_b = userProfiles[member.user_id]) == null ? void 0 : _b.full_name) || "";
    return username.toLowerCase().includes(searchQuery.toLowerCase()) || fullName.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const isCurrentUserAdmin = members.some(
    (member) => member.user_id === currentUserId && member.role === "admin"
  );
  const adminCount = members.filter((member) => member.role === "admin").length;
  const updateMemberRole = async (memberId, newRole) => {
    const validationResult = validateRoleChange(
      members,
      currentUserId,
      memberId,
      newRole
    );
    if (!validationResult.valid) {
      toast({
        title: "Action not allowed",
        description: validationResult.message,
        variant: "destructive"
      });
      return;
    }
    setIsUpdating((prev) => ({ ...prev, [memberId]: true }));
    try {
      const { error } = await supabase.from("group_members").update({ role: newRole }).eq("group_id", groupId).eq("user_id", memberId);
      if (error) throw error;
      toast({
        title: "Role updated",
        description: `Member role successfully updated to ${getRoleLabel(newRole)}.`
      });
      if (onMemberUpdated) {
        onMemberUpdated();
      }
    } catch (error) {
      console.error("Error updating member role:", error);
      toast({
        title: "Failed to update role",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating((prev) => ({ ...prev, [memberId]: false }));
    }
  };
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-4 w-4 text-amber-400" });
      case "moderator":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-cybergold-400" });
      case "premium":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-purple-400" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-gray-400" });
    }
  };
  const getRoleName = (role) => getRoleLabel(role);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-cyberdark-900 border-cybergold-500/30 text-cybergold-200 sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "mr-2 h-5 w-5 text-cybergold-400" }),
        "Manage Member Roles"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-cybergold-500/70", children: "Assign different roles to members to control their permissions in the group" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-2.5 h-4 w-4 text-cybergold-500/70" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search members...",
          className: "pl-8 bg-cyberdark-800 border-cybergold-500/30 text-cybergold-300 placeholder:text-cybergold-500/50",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 overflow-y-auto max-h-[60vh]", children: filteredMembers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-4 text-cybergold-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-8 w-8 mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No members found" })
    ] }) : filteredMembers.map((member) => {
      var _a;
      const profile = userProfiles[member.user_id] || {};
      const isCurrentUser = member.user_id === currentUserId;
      const isCreator = member.user_id === ((_a = members.find((m) => m.user_id === currentUserId)) == null ? void 0 : _a.group_id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between p-3 rounded-md bg-cyberdark-800/50 border border-cyberdark-700",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                UserAvatar,
                {
                  src: profile.avatar_url,
                  alt: profile.username || "User",
                  size: 40
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium text-cybergold-300 flex items-center gap-2", children: [
                  profile.username || "Unknown User",
                  isCurrentUser && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: "You" }),
                  isCreator && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-amber-950/60 text-amber-400 border-amber-500/30 text-xs", children: "Creator" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cybergold-500 flex items-center gap-1", children: [
                  getRoleIcon(member.role),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: getRoleName(member.role) })
                ] })
              ] })
            ] }),
            isCurrentUserAdmin && (!isCreator || isCurrentUser) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                defaultValue: member.role,
                onValueChange: (value) => updateMemberRole(member.user_id, value),
                disabled: isUpdating[member.user_id] || isCurrentUser && adminCount < 2,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-32 h-8 bg-cyberdark-900/70 border-cybergold-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-cyberdark-900 border-cybergold-500/30", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "admin", className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3.5 w-3.5 text-amber-400" }),
                      "Admin"
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "moderator", className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3.5 w-3.5 text-cybergold-400" }),
                      "Moderator"
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "premium", className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 text-purple-400" }),
                      "Premium"
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "member", className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5 text-gray-400" }),
                      "Member"
                    ] }) })
                  ] })
                ]
              }
            )
          ]
        },
        member.user_id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-start gap-2 p-2 rounded-md bg-cyberdark-800/30 border border-cybergold-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-5 w-5 text-cybergold-400 flex-shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cybergold-400/80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium mb-1", children: "Role permissions:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3 text-amber-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Admins: ",
              getRoleDescription("admin")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3 text-cybergold-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Moderators: ",
              getRoleDescription("moderator")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 text-purple-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Premium: ",
              getRoleDescription("premium")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3 text-gray-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Members: ",
              getRoleDescription("member")
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "ghost",
        onClick: onClose,
        className: "bg-cyberdark-800 text-cybergold-300 border-cybergold-500/30 hover:bg-cyberdark-700",
        children: "Close"
      }
    ) })
  ] }) });
}
const GroupSettingsPanel = ({
  group,
  currentUserId,
  members,
  userProfiles,
  onClose,
  refreshGroup
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = reactExports.useState("general");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [editMode, setEditMode] = reactExports.useState(false);
  const [inviteLink, setInviteLink] = reactExports.useState("");
  const [isProcessingInvite, setIsProcessingInvite] = reactExports.useState(false);
  const [groupName, setGroupName] = reactExports.useState(group.name);
  const [groupDescription, setGroupDescription] = reactExports.useState(group.description || "");
  const [groupAvatar, setGroupAvatar] = reactExports.useState(group.avatar_url || "");
  const [allowMediaSharing, setAllowMediaSharing] = reactExports.useState(group.allow_media_sharing !== false);
  const [allowLinkPreviews, setAllowLinkPreviews] = reactExports.useState(group.allow_link_previews !== false);
  const [allowMemberInvites, setAllowMemberInvites] = reactExports.useState(group.allow_member_invites === true);
  const [isPrivate, setIsPrivate] = reactExports.useState(group.is_private !== false);
  const [securityLevel, setSecurityLevel] = reactExports.useState(group.security_level || "standard");
  const isAdmin = members.some(
    (member) => member.user_id === currentUserId && member.role === "admin"
  );
  const generateInviteLink = async () => {
    setIsProcessingInvite(true);
    try {
      const { data, error } = await supabase.from("group_invites").insert({
        group_id: group.id,
        created_by: currentUserId,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString(),
        // 7 days
        max_uses: 10
      }).select().single();
      if (error) throw error;
      if (data) {
        const link = `${window.location.origin}/join-group/${data.invite_code}`;
        setInviteLink(link);
        toast({
          title: "Invitation link created",
          description: "The link will be valid for 7 days or 10 uses"
        });
      }
    } catch (error) {
      console.error("Failed to generate invite link:", error);
      toast({
        title: "Failed to create invite",
        description: "Could not generate invitation link",
        variant: "destructive"
      });
    } finally {
      setIsProcessingInvite(false);
    }
  };
  const saveGroupSettings = async () => {
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only admins can update group settings",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.from("group_chats").update({
        name: groupName,
        description: groupDescription,
        avatar_url: groupAvatar,
        allow_media_sharing: allowMediaSharing,
        allow_link_previews: allowLinkPreviews,
        allow_member_invites: allowMemberInvites,
        is_private: isPrivate,
        security_level: securityLevel,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", group.id);
      if (error) throw error;
      toast({
        title: "Settings saved",
        description: "Group settings have been updated successfully"
      });
      setEditMode(false);
      refreshGroup();
    } catch (error) {
      console.error("Failed to save group settings:", error);
      toast({
        title: "Failed to save settings",
        description: "An error occurred while updating group settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const updateMemberRole = async (userId, newRole) => {
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only admins can change member roles",
        variant: "destructive"
      });
      return;
    }
    if (userId === currentUserId && newRole !== "admin") {
      const admins = members.filter((m) => m.role === "admin");
      if (admins.length <= 1) {
        toast({
          title: "Action not allowed",
          description: "You are the last admin. Assign another admin first.",
          variant: "destructive"
        });
        return;
      }
    }
    try {
      const { error } = await supabase.from("group_members").update({ role: newRole }).eq("group_id", group.id).eq("user_id", userId);
      if (error) throw error;
      toast({
        title: "Role updated",
        description: "Member's role has been updated successfully"
      });
      refreshGroup();
    } catch (error) {
      console.error("Failed to update member role:", error);
      toast({
        title: "Failed to update role",
        description: "An error occurred while updating the member's role",
        variant: "destructive"
      });
    }
  };
  const removeMember = async (userId) => {
    if (!isAdmin && userId !== currentUserId) {
      toast({
        title: "Permission denied",
        description: "Only admins can remove other members",
        variant: "destructive"
      });
      return;
    }
    if (userId === currentUserId && isAdmin) {
      const admins = members.filter((m) => m.role === "admin");
      if (admins.length <= 1) {
        toast({
          title: "Action not allowed",
          description: "You are the last admin. Assign another admin first.",
          variant: "destructive"
        });
        return;
      }
    }
    try {
      const { error } = await supabase.from("group_members").delete().eq("group_id", group.id).eq("user_id", userId);
      if (error) throw error;
      if (userId === currentUserId) {
        toast({
          title: "Left group",
          description: "You have left the group"
        });
        onClose();
        return;
      }
      toast({
        title: "Member removed",
        description: "Member has been removed from the group"
      });
      refreshGroup();
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast({
        title: "Failed to remove member",
        description: "An error occurred while removing the member",
        variant: "destructive"
      });
    }
  };
  const deleteGroup = async () => {
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only admins can delete the group",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      await supabase.from("messages").delete().eq("group_id", group.id);
      await supabase.from("group_members").delete().eq("group_id", group.id);
      const { error } = await supabase.from("group_chats").delete().eq("id", group.id);
      if (error) throw error;
      toast({
        title: "Group deleted",
        description: "The group has been permanently deleted"
      });
      onClose();
    } catch (error) {
      console.error("Failed to delete group:", error);
      toast({
        title: "Failed to delete group",
        description: "An error occurred while deleting the group",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full bg-cyberdark-900 border-l border-cyberdark-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-cyberdark-800 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-cybergold-300 flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "mr-2 h-5 w-5 text-cybergold-500" }),
        "Group Settings"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: onClose,
          className: "text-gray-400 hover:text-cybergold-400",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "flex flex-col flex-grow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-cyberdark-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-transparent p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "general",
            className: "data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400",
            children: "General"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "members",
            className: "data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400",
            children: "Members"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "security",
            className: "data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400",
            children: "Security"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "danger",
            className: "data-[state=active]:bg-cyberdark-800 data-[state=active]:text-red-400",
            children: "Danger Zone"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-grow overflow-auto p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "general", className: "mt-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-850 border-cyberdark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-200", children: "Group Information" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Basic information about your group chat" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: !editMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-16 w-16 border-2 border-cybergold-600/30", children: groupAvatar ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: groupAvatar, alt: groupName }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-cybergold-950 text-cybergold-400 text-xl", children: groupName.substring(0, 2).toUpperCase() }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-cybergold-200", children: groupName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 text-sm", children: [
                    "Created ",
                    new Date(group.created_at).toLocaleDateString()
                  ] })
                ] })
              ] }),
              groupDescription && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-gray-300", children: groupDescription }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: isPrivate ? "outline" : "secondary", className: "mr-2", children: isPrivate ? "Private Group" : "Public Group" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "bg-cyberdark-800", children: [
                  members.length,
                  " members"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-medium text-cybergold-300 mb-1", children: "Features" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full ${allowMediaSharing ? "bg-green-500" : "bg-red-500"}` }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-300", children: "Media sharing" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full ${allowLinkPreviews ? "bg-green-500" : "bg-red-500"}` }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-300", children: "Link previews" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full ${allowMemberInvites ? "bg-green-500" : "bg-red-500"}` }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-300", children: "Member invites" })
                  ] })
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start space-x-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 flex-grow", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "groupName", className: "text-cybergold-300", children: "Group Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "groupName",
                    value: groupName,
                    onChange: (e) => setGroupName(e.target.value),
                    className: "bg-cyberdark-900 border-cyberdark-700",
                    placeholder: "Enter group name"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "groupAvatar", className: "text-cybergold-300", children: "Avatar URL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "groupAvatar",
                    value: groupAvatar,
                    onChange: (e) => setGroupAvatar(e.target.value),
                    className: "bg-cyberdark-900 border-cyberdark-700",
                    placeholder: "Enter avatar URL"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "groupDescription", className: "text-cybergold-300", children: "Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "groupDescription",
                    value: groupDescription,
                    onChange: (e) => setGroupDescription(e.target.value),
                    className: "bg-cyberdark-900 border-cyberdark-700 min-h-[100px]",
                    placeholder: "Describe your group"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-medium text-cybergold-300", children: "Features" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "allowMediaSharing", className: "text-gray-300", children: "Media Sharing" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Allow members to share images and files" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      id: "allowMediaSharing",
                      checked: allowMediaSharing,
                      onCheckedChange: setAllowMediaSharing
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "allowLinkPreviews", className: "text-gray-300", children: "Link Previews" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Show previews of shared links in chat" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      id: "allowLinkPreviews",
                      checked: allowLinkPreviews,
                      onCheckedChange: setAllowLinkPreviews
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "allowMemberInvites", className: "text-gray-300", children: "Member Invites" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Allow members to invite others" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      id: "allowMemberInvites",
                      checked: allowMemberInvites,
                      onCheckedChange: setAllowMemberInvites
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "isPrivate", className: "text-gray-300", children: "Private Group" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Only accessible through invitations" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      id: "isPrivate",
                      checked: isPrivate,
                      onCheckedChange: setIsPrivate
                    }
                  )
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "justify-between border-t border-cyberdark-700 pt-4", children: !editMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                onClick: () => setEditMode(true),
                disabled: !isAdmin,
                className: "border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-950/30",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "mr-2 h-4 w-4" }),
                  "Edit Settings"
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2 w-full justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  onClick: () => {
                    setEditMode(false);
                    setGroupName(group.name);
                    setGroupDescription(group.description || "");
                    setGroupAvatar(group.avatar_url || "");
                    setAllowMediaSharing(group.allow_media_sharing !== false);
                    setAllowLinkPreviews(group.allow_link_previews !== false);
                    setAllowMemberInvites(group.allow_member_invites === true);
                    setIsPrivate(group.is_private !== false);
                  },
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: saveGroupSettings,
                  disabled: isLoading,
                  children: isLoading ? "Saving..." : "Save Changes"
                }
              )
            ] }) })
          ] }),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-4 bg-cyberdark-850 border-cyberdark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-200", children: "Invite People" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Generate an invitation link to share with others" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: inviteLink ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-300", children: "Share this link with people you want to invite:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    readOnly: true,
                    value: inviteLink,
                    className: "bg-cyberdark-900 border-cyberdark-700 rounded-r-none"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    className: "rounded-l-none",
                    onClick: () => {
                      navigator.clipboard.writeText(inviteLink);
                      toast({
                        title: "Link copied",
                        description: "Invitation link copied to clipboard"
                      });
                    },
                    children: "Copy"
                  }
                )
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                onClick: generateInviteLink,
                disabled: isProcessingInvite,
                className: "w-full border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-950/30",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "mr-2 h-4 w-4" }),
                  isProcessingInvite ? "Generating..." : "Generate Invitation Link"
                ]
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "members", className: "mt-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-850 border-cyberdark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-200", children: "Member Management" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
                members.length,
                " members in this group"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: members.map((member) => {
              const profile = userProfiles[member.user_id] || {};
              const isSelf = member.user_id === currentUserId;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between p-2 rounded-md hover:bg-cyberdark-800",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8", children: profile.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: profile.avatar_url, alt: profile.username }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-cybergold-950 text-cybergold-400", children: profile.username ? profile.username[0] : "?" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-cybergold-200", children: [
                          profile.username || profile.full_name || "Unknown User",
                          isSelf && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-gray-500", children: "(You)" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: isSelf ? "This is you" : `User ID: ${member.user_id.substring(0, 8)}...` })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
                      isAdmin && !isSelf ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Select,
                        {
                          value: member.role,
                          onValueChange: (value) => updateMemberRole(member.user_id, value),
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[110px] h-8 text-xs bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: member.role }) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "admin", className: "text-cybergold-400", children: "Admin" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "moderator", className: "text-blue-400", children: "Moderator" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "member", children: "Member" })
                            ] })
                          ]
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: `
                                ${member.role === "admin" ? "bg-cybergold-950 text-cybergold-400 border-cybergold-700/30" : ""}
                                ${member.role === "moderator" ? "bg-blue-950 text-blue-400 border-blue-700/30" : ""}
                                ${member.role === "member" ? "bg-cyberdark-900 text-gray-400 border-cyberdark-700" : ""}
                              `,
                          children: member.role
                        }
                      ),
                      (isAdmin && !isSelf || !isAdmin && isSelf) && /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            variant: "ghost",
                            size: "icon",
                            className: "text-gray-400 hover:text-red-400 hover:bg-red-950/20 h-8 w-8",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "h-4 w-4" })
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "text-cybergold-200", children: isSelf ? "Leave Group" : "Remove Member" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: isSelf ? "Are you sure you want to leave this group? You'll need an invitation to rejoin." : `Are you sure you want to remove ${profile.username || "this member"} from the group?` })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "bg-cyberdark-800 hover:bg-cyberdark-700", children: "Cancel" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              AlertDialogAction,
                              {
                                className: "bg-red-600 hover:bg-red-700 text-white",
                                onClick: () => removeMember(member.user_id),
                                children: isSelf ? "Leave Group" : "Remove Member"
                              }
                            )
                          ] })
                        ] })
                      ] })
                    ] })
                  ]
                },
                member.user_id
              );
            }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-4 bg-cyberdark-850 border-cyberdark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-200", children: "Role Permissions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "What each role can do in the group" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-medium text-cybergold-400 flex items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "mr-1 h-4 w-4" }),
                  " Admin"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "Can edit group settings, manage members, change roles, and delete the group." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-cyberdark-700" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-medium text-blue-400 flex items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "mr-1 h-4 w-4" }),
                  " Moderator"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "Can pin messages, delete any message, and manage media content." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-cyberdark-700" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-medium text-gray-300 flex items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users$1, { className: "mr-1 h-4 w-4" }),
                  " Member"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "Can send messages, upload media (if allowed), and manage their own content." })
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "security", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-850 border-cyberdark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cybergold-200", children: "Security Settings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Control the security level and privacy of this group" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "securityLevel", className: "text-cybergold-300", children: "Security Level" }),
            !editMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `
                        flex items-center p-3 rounded-md
                        ${securityLevel === "p2p_e2ee" ? "bg-green-950/20 border border-green-800/30" : securityLevel === "server_e2ee" ? "bg-blue-950/20 border border-blue-800/30" : "bg-cyberdark-900 border border-cyberdark-700"}
                      `, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: `
                            h-6 w-6
                            ${securityLevel === "p2p_e2ee" ? "text-green-500" : securityLevel === "server_e2ee" ? "text-blue-500" : "text-gray-500"}
                          ` }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: `
                            font-medium text-sm
                            ${securityLevel === "p2p_e2ee" ? "text-green-400" : securityLevel === "server_e2ee" ? "text-blue-400" : "text-gray-300"}
                          `, children: securityLevel === "p2p_e2ee" ? "Maximum Security (P2P E2EE)" : securityLevel === "server_e2ee" ? "High Security (Server E2EE)" : "Standard Security" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: securityLevel === "p2p_e2ee" ? "End-to-end encrypted with peer-to-peer connections" : securityLevel === "server_e2ee" ? "End-to-end encrypted with server relay" : "Standard server-side encryption" })
                ] })
              ] }),
              !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Only group admins can change the security level." })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: securityLevel,
                onValueChange: setSecurityLevel,
                disabled: !isAdmin,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select security level" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "p2p_e2ee", className: "text-green-400", children: "Maximum Security (P2P E2EE)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "server_e2ee", className: "text-blue-400", children: "High Security (Server E2EE)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "standard", className: "text-gray-300", children: "Standard Security" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-medium text-cybergold-300 mb-2", children: "Security Features" }),
              !editMode ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 rounded-md bg-cyberdark-900", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 mr-2 text-gray-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-300", children: "Private Group" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: isPrivate ? "default" : "secondary", className: "text-xs", children: isPrivate ? "Enabled" : "Disabled" })
              ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label$1, { className: "text-gray-300 flex items-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 mr-2" }),
                    "Private Group"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 ml-6", children: "Only invited members can join" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: isPrivate,
                    onCheckedChange: setIsPrivate,
                    disabled: !isAdmin
                  }
                )
              ] }) })
            ] })
          ] }) }),
          editMode && /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "justify-end border-t border-cyberdark-700 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: saveGroupSettings,
              disabled: isLoading,
              children: isLoading ? "Saving..." : "Save Security Settings"
            }
          ) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "danger", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-850 border-red-900/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-red-400 flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "mr-2 h-5 w-5" }),
              "Danger Zone"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Actions that cannot be undone" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            (!isAdmin || members.filter((m) => m.role === "admin").length > 1) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-red-900/30 rounded-md p-4 bg-red-950/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-medium text-gray-200", children: "Leave Group" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Remove yourself from this group. You'll need an invitation to rejoin." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "destructive",
                    size: "sm",
                    className: "bg-red-900/30 hover:bg-red-800/50 text-red-300",
                    children: "Leave Group"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "text-cybergold-200", children: "Leave Group" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Are you sure you want to leave this group? You'll need an invitation to rejoin." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "bg-cyberdark-800 hover:bg-cyberdark-700", children: "Cancel" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      AlertDialogAction,
                      {
                        className: "bg-red-600 hover:bg-red-700 text-white",
                        onClick: () => removeMember(currentUserId),
                        children: "Leave Group"
                      }
                    )
                  ] })
                ] })
              ] })
            ] }) }),
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-red-900/30 rounded-md p-4 bg-red-950/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-medium text-gray-200", children: "Delete Group" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Permanently remove this group and all its messages. This cannot be undone." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "destructive",
                    size: "sm",
                    className: "bg-red-900/30 hover:bg-red-800/50 text-red-300",
                    children: "Delete Group"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "text-cybergold-200", children: "Delete Group" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                      'This will permanently delete the group "',
                      group.name,
                      '" and all its messages. This action cannot be undone.'
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "bg-cyberdark-800 hover:bg-cyberdark-700", children: "Cancel" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      AlertDialogAction,
                      {
                        className: "bg-red-600 hover:bg-red-700 text-white",
                        onClick: deleteGroup,
                        children: "Delete Group"
                      }
                    )
                  ] })
                ] })
              ] })
            ] }) })
          ] }) })
        ] }) })
      ] })
    ] })
  ] });
};
function GroupPollSystem({
  groupId,
  currentUserId,
  isAdmin,
  canCreatePolls = isAdmin
  // Default to isAdmin if not provided
}) {
  const [showCreateDialog, setShowCreateDialog] = reactExports.useState(false);
  const [pollQuestion, setPollQuestion] = reactExports.useState("");
  const [pollOptions, setPollOptions] = reactExports.useState(["", ""]);
  const [expiresIn, setExpiresIn] = reactExports.useState(null);
  const [isAnonymous, setIsAnonymous] = reactExports.useState(false);
  const [isMultiSelect, setIsMultiSelect] = reactExports.useState(false);
  const [isCreatingPoll, setIsCreatingPoll] = reactExports.useState(false);
  const [polls, setPolls] = reactExports.useState([]);
  const [expandedPollId, setExpandedPollId] = reactExports.useState(null);
  const [userVotes, setUserVotes] = reactExports.useState({});
  const [isLoadingPolls, setIsLoadingPolls] = reactExports.useState(true);
  const [isSubmittingVote, setIsSubmittingVote] = reactExports.useState(false);
  const { toast } = useToast();
  const fetchPolls = reactExports.useCallback(async () => {
    try {
      setIsLoadingPolls(true);
      const { data: pollsData, error: pollsError } = await supabase.from("group_polls").select("*").eq("group_id", groupId).order("created_at", { ascending: false });
      if (pollsError) throw pollsError;
      const { data: votesData, error: votesError } = await supabase.from("poll_votes").select("poll_id, option_id").eq("user_id", currentUserId);
      if (votesError) throw votesError;
      const userVotesMap = {};
      votesData == null ? void 0 : votesData.forEach((vote) => {
        if (!userVotesMap[vote.poll_id]) {
          userVotesMap[vote.poll_id] = [];
        }
        userVotesMap[vote.poll_id].push(vote.option_id);
      });
      setUserVotes(userVotesMap);
      setPolls(pollsData || []);
    } catch (error) {
      console.error("Failed to fetch polls:", error);
      toast({
        title: "Failed to load polls",
        description: "Could not load poll data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPolls(false);
    }
  }, [groupId, currentUserId, toast]);
  reactExports.useEffect(() => {
    fetchPolls();
    const pollsSubscription = supabase.channel("group-polls").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "group_polls",
      filter: `group_id=eq.${groupId}`
    }, () => {
      fetchPolls();
    }).subscribe();
    const votesSubscription = supabase.channel("poll-votes").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "poll_votes"
    }, () => {
      fetchPolls();
    }).subscribe();
    return () => {
      pollsSubscription.unsubscribe();
      votesSubscription.unsubscribe();
    };
  }, [groupId, fetchPolls]);
  const addOption = () => {
    setPollOptions([...pollOptions, ""]);
  };
  const removeOption = (index) => {
    const newOptions = [...pollOptions];
    newOptions.splice(index, 1);
    setPollOptions(newOptions);
  };
  const updateOption = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };
  const handleCreatePoll = async () => {
    if (!pollQuestion.trim()) {
      toast({
        title: "Missing Question",
        description: "Please provide a poll question.",
        variant: "destructive"
      });
      return;
    }
    const validOptions = pollOptions.filter((opt) => opt.trim() !== "");
    if (validOptions.length < 2) {
      toast({
        title: "Not Enough Options",
        description: "Please provide at least 2 options.",
        variant: "destructive"
      });
      return;
    }
    setIsCreatingPoll(true);
    try {
      let expiresAt = null;
      if (expiresIn) {
        const hours = parseInt(expiresIn);
        expiresAt = new Date(Date.now() + hours * 60 * 60 * 1e3).toISOString();
      }
      const options = validOptions.map((text) => ({
        id: crypto.randomUUID(),
        text,
        votes: 0
      }));
      const { data, error } = await supabase.from("group_polls").insert({
        group_id: groupId,
        created_by: currentUserId,
        question: pollQuestion,
        options,
        expires_at: expiresAt,
        is_anonymous: isAnonymous,
        is_multi_select: isMultiSelect,
        is_active: true
      }).select();
      if (error) throw error;
      const announcementType = isAnonymous ? "anonymous" : "standard";
      await supabase.from("group_messages").insert({
        group_id: groupId,
        sender_id: currentUserId,
        content: `📊 **New Poll Created**: "${pollQuestion}"`,
        message_type: "system",
        metadata: {
          type: "poll_created",
          poll_id: data[0].id,
          anonymous: isAnonymous,
          multi_select: isMultiSelect
        }
      });
      setPollQuestion("");
      setPollOptions(["", ""]);
      setExpiresIn(null);
      setIsAnonymous(false);
      setIsMultiSelect(false);
      setShowCreateDialog(false);
      toast({
        title: "Poll Created",
        description: "Your poll has been created successfully."
      });
      fetchPolls();
    } catch (error) {
      console.error("Failed to create poll:", error);
      toast({
        title: "Poll Creation Failed",
        description: "Could not create your poll. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingPoll(false);
    }
  };
  const toggleExpandPoll = (pollId) => {
    setExpandedPollId(expandedPollId === pollId ? null : pollId);
  };
  const submitVote = async (pollId, optionId, poll) => {
    if (isSubmittingVote) return;
    setIsSubmittingVote(true);
    try {
      const existingVotes = userVotes[pollId] || [];
      if (!poll.isMultiSelect && existingVotes.length > 0) {
        await supabase.from("poll_votes").delete().eq("user_id", currentUserId).eq("poll_id", pollId);
      } else if (poll.isMultiSelect && existingVotes.includes(optionId)) {
        await supabase.from("poll_votes").delete().eq("user_id", currentUserId).eq("poll_id", pollId).eq("option_id", optionId);
        setIsSubmittingVote(false);
        return;
      }
      const { error } = await supabase.from("poll_votes").insert({
        user_id: currentUserId,
        poll_id: pollId,
        option_id: optionId,
        voted_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (error) throw error;
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
      fetchPolls();
    } catch (error) {
      console.error("Failed to submit vote:", error);
      toast({
        title: "Vote Failed",
        description: "Could not submit your vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingVote(false);
    }
  };
  const calculatePercentage = (votes, poll) => {
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
    if (totalVotes === 0) return 0;
    return Math.round(votes / totalVotes * 100);
  };
  const isPollExpired = (poll) => {
    if (!poll.expiresAt) return false;
    return new Date(poll.expiresAt) < /* @__PURE__ */ new Date();
  };
  const closePoll = async (pollId) => {
    try {
      await supabase.from("group_polls").update({ is_active: false }).eq("id", pollId);
      toast({
        title: "Poll Closed",
        description: "The poll has been closed successfully."
      });
      fetchPolls();
    } catch (error) {
      console.error("Failed to close poll:", error);
      toast({
        title: "Action Failed",
        description: "Could not close the poll. Please try again.",
        variant: "destructive"
      });
    }
  };
  const formatTimeRemaining = (expiresAt) => {
    const now = /* @__PURE__ */ new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / (1e3 * 60 * 60));
    const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold text-cybergold-200 flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumnIncreasing, { className: "mr-2 h-5 w-5 text-cybergold-400" }),
        "Group Polls"
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: showCreateDialog, onOpenChange: setShowCreateDialog, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-950/30",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-4 w-4 mr-2" }),
              "Create Poll"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-cyberdark-900 border-cybergold-500/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-cybergold-200", children: "Create a New Poll" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-cybergold-400", children: "Create a poll for group members to vote on" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "question", className: "text-cybergold-200", children: "Poll Question" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "question",
                  placeholder: "What would you like to ask?",
                  value: pollQuestion,
                  onChange: (e) => setPollQuestion(e.target.value),
                  className: "bg-cyberdark-950 border-cybergold-500/30 text-cybergold-200"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { className: "text-cybergold-200", children: "Options" }),
              pollOptions.map((option, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: `Option ${index + 1}`,
                    value: option,
                    onChange: (e) => updateOption(index, e.target.value),
                    className: "bg-cyberdark-950 border-cybergold-500/30 text-cybergold-200"
                  }
                ),
                index > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    onClick: () => removeOption(index),
                    className: "h-8 w-8 text-cybergold-500",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                  }
                )
              ] }, index)),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  onClick: addOption,
                  className: "text-cybergold-400 hover:text-cybergold-300",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-4 w-4 mr-2" }),
                    "Add Option"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "expires", className: "text-cybergold-200", children: "Expires In (Optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  id: "expires",
                  value: expiresIn || "",
                  onChange: (e) => setExpiresIn(e.target.value || null),
                  className: "w-full h-9 px-3 py-1 rounded-md bg-cyberdark-950 border border-cybergold-500/30 text-cybergold-200",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "No Expiration" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "1", children: "1 Hour" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "6", children: "6 Hours" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "24", children: "24 Hours" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "48", children: "2 Days" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "168", children: "7 Days" })
                  ]
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "anonymous", className: "text-cybergold-200", children: "Anonymous Voting" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cybergold-500", children: "Votes will be anonymous" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    id: "anonymous",
                    checked: isAnonymous,
                    onCheckedChange: setIsAnonymous
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "multiselect", className: "text-cybergold-200", children: "Multiple Selections" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cybergold-500", children: "Allow voting for multiple options" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    id: "multiselect",
                    checked: isMultiSelect,
                    onCheckedChange: setIsMultiSelect
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setShowCreateDialog(false),
                disabled: isCreatingPoll,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleCreatePoll,
                disabled: isCreatingPoll,
                className: "bg-cybergold-600 hover:bg-cybergold-700 text-cyberdark-950",
                children: isCreatingPoll ? "Creating..." : "Create Poll"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    isLoadingPolls ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-pulse flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-36 bg-cyberdark-800 rounded-md mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-48 bg-cyberdark-800 rounded-md" })
    ] }) }) : polls.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6 bg-cyberdark-900/50 rounded-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumnIncreasing, { className: "h-10 w-10 text-cybergold-400/50 mx-auto mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-500", children: "No polls have been created yet." }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => setShowCreateDialog(true),
          className: "mt-2 text-cybergold-400 hover:text-cybergold-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-4 w-4 mr-2" }),
            "Create First Poll"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: polls.sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }).map((poll) => {
      var _a;
      const isExpanded = expandedPollId === poll.id;
      const hasVoted = ((_a = userVotes[poll.id]) == null ? void 0 : _a.length) > 0;
      const isExpired = isPollExpired(poll);
      const canVote = poll.isActive && !isExpired;
      const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: `bg-cyberdark-800/50 border-${poll.isActive ? "cybergold" : "gray"}-500/30`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base text-cybergold-200", children: poll.question }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { className: "text-cybergold-500 text-xs", children: [
              "Created ",
              format(new Date(poll.createdAt), "MMM d, yyyy")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
            poll.expiresAt && poll.isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "bg-cyberdark-900/70 border-cybergold-500/30 text-xs py-0 px-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 mr-1" }),
              formatTimeRemaining(poll.expiresAt)
            ] }),
            !poll.isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-cyberdark-900/70 border-gray-500/30 text-xs py-0 px-2 text-gray-400", children: "Closed" }),
            poll.isAnonymous && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-cyberdark-900/70 border-blue-500/30 text-xs py-0 px-2 text-blue-400", children: "Anonymous" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          poll.options.slice(0, isExpanded ? void 0 : 3).map((option) => {
            var _a2;
            const percentage = calculatePercentage(option.votes, poll);
            const isOptionSelected = (_a2 = userVotes[poll.id]) == null ? void 0 : _a2.includes(option.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      className: `mr-2 h-5 w-5 rounded ${isOptionSelected ? "bg-cybergold-600 text-black flex items-center justify-center" : "border border-cybergold-500/50"} ${!canVote && "opacity-70 cursor-not-allowed"}`,
                      onClick: () => canVote && submitVote(poll.id, option.id, poll),
                      disabled: !canVote || isSubmittingVote,
                      children: isOptionSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: option.text })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-cybergold-400", children: [
                  percentage,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 relative w-full overflow-hidden rounded-full bg-cyberdark-950", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full bg-gradient-to-r from-cybergold-700/80 to-cybergold-500/80",
                  style: { width: `${percentage}%` }
                }
              ) }),
              (hasVoted || !poll.isActive || isExpired) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cybergold-500", children: [
                option.votes,
                " vote",
                option.votes !== 1 ? "s" : ""
              ] })
            ] }, option.id);
          }),
          !isExpanded && poll.options.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => toggleExpandPoll(poll.id),
              className: "w-full text-xs text-cybergold-400 hover:text-cybergold-300",
              children: [
                "Show ",
                poll.options.length - 3,
                " more options",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 ml-2" })
              ]
            }
          ),
          isExpanded && poll.options.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => toggleExpandPoll(poll.id),
              className: "w-full text-xs text-cybergold-400 hover:text-cybergold-300",
              children: [
                "Show fewer options",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3 ml-2" })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardFooter, { className: "flex justify-between pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cybergold-500", children: [
            totalVotes,
            " vote",
            totalVotes !== 1 ? "s" : ""
          ] }),
          isAdmin && poll.isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => closePoll(poll.id),
              className: "text-xs h-7 text-gray-400 hover:text-gray-300",
              children: "Close Poll"
            }
          )
        ] })
      ] }, poll.id);
    }) })
  ] });
}
function GroupFilesManager({
  groupId,
  currentUserId,
  isAdmin,
  canManageFiles = isAdmin,
  // Default to isAdmin if not provided
  isPremium,
  groupName,
  maxUploadSize = isPremium ? 100 : 20
  // Default max size: 100MB for premium, 20MB for standard
}) {
  var _a;
  const [files, setFiles] = reactExports.useState([]);
  const [folders, setFolders] = reactExports.useState([]);
  const [currentFolder, setCurrentFolder] = reactExports.useState(null);
  const [isLoadingFiles, setIsLoadingFiles] = reactExports.useState(true);
  const [selectedFileIds, setSelectedFileIds] = reactExports.useState([]);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [showUploadDialog, setShowUploadDialog] = reactExports.useState(false);
  const [selectedFiles, setSelectedFiles] = reactExports.useState([]);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = reactExports.useState(false);
  const [folderName, setFolderName] = reactExports.useState("");
  const [isCreatingFolder, setIsCreatingFolder] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("files");
  const [showShareDialog, setShowShareDialog] = reactExports.useState(false);
  const [shareFileId, setShareFileId] = reactExports.useState(null);
  const [shareUrl, setShareUrl] = reactExports.useState("");
  const [isGeneratingShareUrl, setIsGeneratingShareUrl] = reactExports.useState(false);
  const [sortBy, setSortBy] = reactExports.useState("date");
  const [sortDirection, setSortDirection] = reactExports.useState("desc");
  const fileInputRef = reactExports.useRef(null);
  const { toast } = useToast();
  const fetchFilesAndFolders = reactExports.useCallback(async () => {
    try {
      setIsLoadingFiles(true);
      const { data: filesData, error: filesError } = await supabase.from("group_files").select(`
          *,
          profiles:uploaded_by (display_name)
        `).eq("group_id", groupId);
      if (filesError) throw filesError;
      const { data: foldersData, error: foldersError } = await supabase.from("group_folders").select("*").eq("group_id", groupId).order("created_at", { ascending: false });
      if (foldersError) throw foldersError;
      const processedFiles = (filesData == null ? void 0 : filesData.map((file) => {
        var _a2;
        return {
          id: file.id,
          groupId: file.group_id,
          uploadedBy: file.uploaded_by,
          uploadedByName: ((_a2 = file.profiles) == null ? void 0 : _a2.display_name) || "Unknown User",
          fileName: file.file_name,
          fileSize: file.file_size,
          fileType: file.file_type,
          path: file.path,
          publicUrl: file.public_url || supabase.storage.from("group-files").getPublicUrl(file.path).data.publicUrl,
          folderId: file.folder_id,
          isEncrypted: file.is_encrypted,
          createdAt: file.created_at,
          thumbnailUrl: file.thumbnail_url
        };
      })) || [];
      const processedFolders = (foldersData == null ? void 0 : foldersData.map((folder) => {
        const fileCount = processedFiles.filter((file) => file.folderId === folder.id).length;
        return {
          id: folder.id,
          groupId: folder.group_id,
          createdBy: folder.created_by,
          name: folder.name,
          createdAt: folder.created_at,
          fileCount
        };
      })) || [];
      setFiles(processedFiles);
      setFolders(processedFolders);
    } catch (error) {
      console.error("Failed to fetch files and folders:", error);
      toast({
        title: "Failed to load files",
        description: "Could not load file data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingFiles(false);
    }
  }, [groupId, toast]);
  reactExports.useEffect(() => {
    fetchFilesAndFolders();
    const filesSubscription = supabase.channel("group-files").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "group_files",
      filter: `group_id=eq.${groupId}`
    }, () => {
      fetchFilesAndFolders();
    }).subscribe();
    const foldersSubscription = supabase.channel("group-folders").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "group_folders",
      filter: `group_id=eq.${groupId}`
    }, () => {
      fetchFilesAndFolders();
    }).subscribe();
    return () => {
      filesSubscription.unsubscribe();
      foldersSubscription.unsubscribe();
    };
  }, [groupId, fetchFilesAndFolders]);
  const handleFileSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files2 = Array.from(e.target.files);
    const oversizedFiles = files2.filter((file) => file.size > maxUploadSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "Files too large",
        description: `${oversizedFiles.length} file(s) exceed the ${maxUploadSize}MB limit.`,
        variant: "destructive"
      });
      const validFiles = files2.filter((file) => file.size <= maxUploadSize * 1024 * 1024);
      setSelectedFiles(validFiles);
    } else {
      setSelectedFiles(files2);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);
    try {
      let successCount = 0;
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileProgress = i / selectedFiles.length * 100;
        setUploadProgress(fileProgress);
        const filePath = `${groupId}/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from("group-files").upload(filePath, file);
        if (uploadError) {
          console.error(`Failed to upload ${file.name}:`, uploadError);
          continue;
        }
        const { data: urlData } = supabase.storage.from("group-files").getPublicUrl(filePath);
        const { error: dbError } = await supabase.from("group_files").insert({
          group_id: groupId,
          uploaded_by: currentUserId,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          path: filePath,
          public_url: urlData == null ? void 0 : urlData.publicUrl,
          folder_id: currentFolder,
          is_encrypted: false
          // Basic upload is unencrypted
        });
        if (dbError) {
          console.error(`Failed to record ${file.name} in database:`, dbError);
          continue;
        }
        await supabase.from("group_messages").insert({
          group_id: groupId,
          sender_id: currentUserId,
          content: `📎 **File Shared**: "${file.name}"`,
          message_type: "system",
          metadata: {
            type: "file_shared",
            file_name: file.name,
            file_type: file.type
          }
        });
        successCount++;
      }
      if (successCount > 0) {
        toast({
          title: "Upload Complete",
          description: `Successfully uploaded ${successCount} file(s)`
        });
        fetchFilesAndFolders();
      } else {
        toast({
          title: "Upload Failed",
          description: "Could not upload any files. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Failed during upload:", error);
      toast({
        title: "Upload Error",
        description: "An error occurred during upload. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setSelectedFiles([]);
      setShowUploadDialog(false);
    }
  };
  const createFolder = async () => {
    if (!folderName.trim()) {
      toast({
        title: "Missing Folder Name",
        description: "Please provide a name for the folder.",
        variant: "destructive"
      });
      return;
    }
    setIsCreatingFolder(true);
    try {
      const { data: existingFolders } = await supabase.from("group_folders").select("id").eq("group_id", groupId).eq("name", folderName.trim()).limit(1);
      if (existingFolders && existingFolders.length > 0) {
        toast({
          title: "Folder Already Exists",
          description: "A folder with this name already exists.",
          variant: "destructive"
        });
        return;
      }
      const { data, error } = await supabase.from("group_folders").insert({
        group_id: groupId,
        created_by: currentUserId,
        name: folderName.trim()
      }).select();
      if (error) throw error;
      setFolderName("");
      setShowCreateFolderDialog(false);
      toast({
        title: "Folder Created",
        description: "Your folder has been created successfully."
      });
      fetchFilesAndFolders();
    } catch (error) {
      console.error("Failed to create folder:", error);
      toast({
        title: "Folder Creation Failed",
        description: "Could not create your folder. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingFolder(false);
    }
  };
  const deleteSelectedFiles = async () => {
    if (selectedFileIds.length === 0) return;
    try {
      const filesToDelete = files.filter((file) => selectedFileIds.includes(file.id));
      for (const file of filesToDelete) {
        await supabase.storage.from("group-files").remove([file.path]);
      }
      await supabase.from("group_files").delete().in("id", selectedFileIds);
      toast({
        title: "Files Deleted",
        description: `Successfully deleted ${selectedFileIds.length} file(s)`
      });
      setSelectedFileIds([]);
      fetchFilesAndFolders();
    } catch (error) {
      console.error("Failed to delete files:", error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the selected files. Please try again.",
        variant: "destructive"
      });
    }
  };
  const toggleFileSelection = (fileId) => {
    setSelectedFileIds((prev) => {
      if (prev.includes(fileId)) {
        return prev.filter((id) => id !== fileId);
      } else {
        return [...prev, fileId];
      }
    });
  };
  const navigateToFolder = (folderId) => {
    setCurrentFolder(folderId);
    setSelectedFileIds([]);
  };
  const generateShareUrl = async (fileId) => {
    setShareFileId(fileId);
    setIsGeneratingShareUrl(true);
    try {
      const file = files.find((f) => f.id === fileId);
      if (!file) throw new Error("File not found");
      const expiryTime = /* @__PURE__ */ new Date();
      expiryTime.setDate(expiryTime.getDate() + 7);
      const { data, error } = await supabase.from("file_shares").insert({
        file_id: fileId,
        created_by: currentUserId,
        expires_at: expiryTime.toISOString(),
        share_token: crypto.randomUUID()
      }).select();
      if (error) throw error;
      const shareToken = data[0].share_token;
      const url = `${window.location.origin}/shared-file/${shareToken}`;
      setShareUrl(url);
      setShowShareDialog(true);
    } catch (error) {
      console.error("Failed to generate share URL:", error);
      toast({
        title: "Sharing Failed",
        description: "Could not create sharing link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingShareUrl(false);
    }
  };
  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        toast({
          title: "Link Copied",
          description: "Sharing link copied to clipboard"
        });
      },
      (err) => {
        console.error("Failed to copy URL:", err);
      }
    );
  };
  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-5 w-5" });
    if (fileType.startsWith("video/")) return /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "h-5 w-5" });
    if (fileType.startsWith("text/")) return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5" });
    if (fileType.includes("spreadsheet") || fileType.includes("excel")) return /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-5 w-5" });
    if (fileType.includes("presentation") || fileType.includes("powerpoint")) return /* @__PURE__ */ jsxRuntimeExports.jsx(Presentation, { className: "h-5 w-5" });
    if (fileType.includes("zip") || fileType.includes("rar") || fileType.includes("compressed")) return /* @__PURE__ */ jsxRuntimeExports.jsx(FileArchive, { className: "h-5 w-5" });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "h-5 w-5" });
  };
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  const filteredFiles = files.filter((file) => {
    const folderMatch = currentFolder === null ? file.folderId === null : file.folderId === currentFolder;
    const searchMatch = searchQuery === "" || file.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return folderMatch && searchMatch;
  }).sort((a, b) => {
    if (sortBy === "name") {
      return sortDirection === "asc" ? a.fileName.localeCompare(b.fileName) : b.fileName.localeCompare(a.fileName);
    } else if (sortBy === "size") {
      return sortDirection === "asc" ? a.fileSize - b.fileSize : b.fileSize - a.fileSize;
    } else {
      return sortDirection === "asc" ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
  const getBreadcrumb = () => {
    if (currentFolder === null) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-200", children: "All Files" });
    }
    const folder = folders.find((f) => f.id === currentFolder);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "text-cyberblue-400 hover:text-cyberblue-300",
          onClick: () => navigateToFolder(null),
          children: "All Files"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 mx-1", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-200", children: (folder == null ? void 0 : folder.name) || "Unknown Folder" })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold text-cybergold-200 flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "mr-2 h-5 w-5 text-cybergold-400" }),
      "Group Files"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Root2, { value: activeTab, onValueChange: setActiveTab, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(List, { className: "flex border-b border-cyberdark-700 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Trigger,
          {
            value: "files",
            className: `px-4 py-2 -mb-px text-sm font-medium ${activeTab === "files" ? "text-cybergold-400 border-b-2 border-cybergold-400" : "text-gray-400 hover:text-gray-300"}`,
            children: "Files"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Trigger,
          {
            value: "folders",
            className: `px-4 py-2 -mb-px text-sm font-medium ${activeTab === "folders" ? "text-cybergold-400 border-b-2 border-cybergold-400" : "text-gray-400 hover:text-gray-300"}`,
            children: "Folders"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { value: "files", className: "outline-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900/50 rounded-md p-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-cybergold-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Search files...",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: "pl-9 bg-cyberdark-800 border-cyberdark-700 text-white"
                }
              ),
              searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "absolute right-2.5 top-2.5 text-gray-400 hover:text-white",
                  onClick: () => setSearchQuery(""),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "h-10 border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-950/30",
                  onClick: () => fetchFilesAndFolders(),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: showUploadDialog, onOpenChange: setShowUploadDialog, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    className: "h-10 bg-cybergold-700 hover:bg-cybergold-600 text-cyberdark-950",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-2" }),
                      "Upload"
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-cyberdark-900 border-cybergold-500/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-cybergold-200", children: "Upload Files" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-cybergold-400", children: [
                      "Upload files to share with the group.",
                      currentFolder !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block mt-1", children: [
                        "Uploading to folder: ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: (_a = folders.find((f) => f.id === currentFolder)) == null ? void 0 : _a.name })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-cybergold-500/30 rounded-md p-8 text-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          ref: fileInputRef,
                          type: "file",
                          multiple: true,
                          onChange: handleFileSelect,
                          className: "hidden"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-12 w-12 text-cybergold-400 mb-4" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-200 mb-2", children: "Drag & drop files here or click to browse" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-cybergold-500 text-sm mb-4", children: [
                          "Maximum file size: ",
                          maxUploadSize,
                          " MB"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            variant: "outline",
                            onClick: () => {
                              var _a2;
                              return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
                            },
                            className: "border-cybergold-500/50 text-cybergold-400",
                            children: "Select Files"
                          }
                        )
                      ] })
                    ] }),
                    selectedFiles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800/70 rounded-md p-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-cybergold-200 mb-2", children: [
                        "Selected ",
                        selectedFiles.length,
                        " file(s):"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-32 overflow-y-auto", children: selectedFiles.map((file, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-1 border-b border-cyberdark-700 last:border-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
                          getFileIcon(file.type),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-sm text-white truncate max-w-[200px]", children: file.name })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cybergold-500", children: formatFileSize(file.size) })
                      ] }, index)) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        onClick: () => {
                          setShowUploadDialog(false);
                          setSelectedFiles([]);
                        },
                        disabled: isUploading,
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        onClick: handleUpload,
                        disabled: isUploading || selectedFiles.length === 0,
                        className: "bg-cybergold-600 hover:bg-cybergold-700 text-cyberdark-950",
                        children: isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : "Upload"
                      }
                    )
                  ] })
                ] })
              ] }),
              selectedFileIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "destructive",
                  size: "sm",
                  className: "h-10",
                  onClick: deleteSelectedFiles,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "h-4 w-4 mr-2" }),
                    "Delete (",
                    selectedFileIds.length,
                    ")"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-sm text-cybergold-500", children: getBreadcrumb() })
        ] }),
        isLoadingFiles ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-pulse flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-36 bg-cyberdark-800 rounded-md mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-48 bg-cyberdark-800 rounded-md" })
        ] }) }) : filteredFiles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6 bg-cyberdark-900/50 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "h-10 w-10 text-cybergold-400/50 mx-auto mb-2" }),
          searchQuery ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-500", children: "No files match your search." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-500", children: "No files have been uploaded yet." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => setShowUploadDialog(true),
                className: "mt-2 text-cybergold-400 hover:text-cybergold-300",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-2" }),
                  "Upload Files"
                ]
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[auto_1fr_auto_auto] gap-3 px-4 py-2 bg-cyberdark-800 rounded-t-md text-cybergold-400 text-sm font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `text-left ${sortBy === "name" ? "text-cybergold-300" : ""}`,
                onClick: () => {
                  setSortDirection(sortBy === "name" && sortDirection === "asc" ? "desc" : "asc");
                  setSortBy("name");
                },
                children: "Name"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `text-right ${sortBy === "size" ? "text-cybergold-300" : ""} w-20`,
                onClick: () => {
                  setSortDirection(sortBy === "size" && sortDirection === "asc" ? "desc" : "asc");
                  setSortBy("size");
                },
                children: "Size"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `text-right ${sortBy === "date" ? "text-cybergold-300" : ""} w-32`,
                onClick: () => {
                  setSortDirection(sortBy === "date" && sortDirection === "asc" ? "desc" : "asc");
                  setSortBy("date");
                },
                children: "Uploaded"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-cyberdark-900/50 rounded-b-md overflow-hidden", children: filteredFiles.map((file) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `grid grid-cols-[auto_1fr_auto_auto] gap-3 px-4 py-3 items-center border-b border-cyberdark-800 last:border-0 hover:bg-cyberdark-800/50 ${selectedFileIds.includes(file.id) ? "bg-cybergold-900/20" : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: selectedFileIds.includes(file.id),
                    onChange: () => toggleFileSelection(file.id),
                    className: "h-4 w-4 rounded border-cybergold-500/50 bg-transparent"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2 flex-shrink-0 text-cybergold-400", children: getFileIcon(file.fileType) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "a",
                    {
                      href: file.publicUrl,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "truncate text-white hover:text-cybergold-300",
                      title: file.fileName,
                      children: file.fileName
                    }
                  ),
                  file.isEncrypted && /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5 ml-2 text-green-500" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cybergold-500 text-sm text-right w-20", children: formatFileSize(file.fileSize) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-500 text-sm text-right w-32", title: format(new Date(file.createdAt), "PPP"), children: formatDistanceToNow(new Date(file.createdAt), { addSuffix: true }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex ml-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => window.open(file.publicUrl, "_blank"),
                        className: "text-cyberblue-400 hover:text-cyberblue-300 p-1",
                        title: "Download",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => generateShareUrl(file.id),
                        className: "text-cyberblue-400 hover:text-cyberblue-300 p-1",
                        title: "Share",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" })
                      }
                    )
                  ] })
                ] })
              ]
            },
            file.id
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { value: "folders", className: "outline-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-cybergold-200", children: "Group Folders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: showCreateFolderDialog, onOpenChange: setShowCreateFolderDialog, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-950/30",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "h-4 w-4 mr-2" }),
                  "New Folder"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-cyberdark-900 border-cybergold-500/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-cybergold-200", children: "Create New Folder" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "folderName", className: "text-cybergold-200", children: "Folder Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "folderName",
                    placeholder: "Enter folder name",
                    value: folderName,
                    onChange: (e) => setFolderName(e.target.value),
                    className: "bg-cyberdark-950 border-cybergold-500/30 text-cybergold-200"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => setShowCreateFolderDialog(false),
                    disabled: isCreatingFolder,
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: createFolder,
                    disabled: isCreatingFolder || !folderName.trim(),
                    className: "bg-cybergold-600 hover:bg-cybergold-700 text-cyberdark-950",
                    children: isCreatingFolder ? "Creating..." : "Create Folder"
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        isLoadingFiles ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-pulse flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-36 bg-cyberdark-800 rounded-md mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-48 bg-cyberdark-800 rounded-md" })
        ] }) }) : folders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6 bg-cyberdark-900/50 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-10 w-10 text-cybergold-400/50 mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-500", children: "No folders have been created yet." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => setShowCreateFolderDialog(true),
              className: "mt-2 text-cybergold-400 hover:text-cybergold-300",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "h-4 w-4 mr-2" }),
                "Create First Folder"
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: folders.map((folder) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900/70 border-cybergold-500/30 hover:bg-cyberdark-800/70 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 cursor-pointer", onClick: () => navigateToFolder(folder.id), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-6 w-6 text-cybergold-400 mr-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base text-cybergold-200 truncate", children: folder.name })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-0 pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-cybergold-500 text-sm", children: [
              folder.fileCount,
              " file",
              folder.fileCount !== 1 ? "s" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-cybergold-500 text-xs", children: [
              "Created ",
              formatDistanceToNow(new Date(folder.createdAt), { addSuffix: true })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => navigateToFolder(folder.id),
              className: "w-full text-cybergold-400 hover:text-cybergold-300 bg-cyberdark-800/50",
              children: "Open Folder"
            }
          ) })
        ] }, folder.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showShareDialog, onOpenChange: setShowShareDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-cyberdark-900 border-cybergold-500/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-cybergold-200", children: "Share File" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-cybergold-400", children: "Anyone with this link can access the file" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800 p-3 rounded-md flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: shareUrl,
              readOnly: true,
              className: "flex-1 bg-transparent border-none text-white text-sm focus:outline-none"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: copyShareUrl,
              className: "flex-shrink-0",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { className: "h-4 w-4 text-cybergold-400" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800/50 p-3 rounded-md text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-5 w-5 text-cybergold-400 mx-auto mb-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cybergold-500", children: "This link expires in 7 days" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setShowShareDialog(false),
            children: "Done"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: copyShareUrl,
            className: "bg-cybergold-600 hover:bg-cybergold-700 text-cyberdark-950",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { className: "h-4 w-4 mr-2" }),
              "Copy Link"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
const Label = ({ htmlFor, children, className = "" }) => /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor, className: `mb-2 block text-sm font-medium ${className}`, children });
function EnhancedGroupChat({
  group,
  currentUserId,
  onBack,
  userProfiles = {}
}) {
  const [encryptionEnabled, setEncryptionEnabled] = reactExports.useState(false);
  const [encryptionStatus, setEncryptionStatus] = reactExports.useState("initializing");
  const [isEncrypting, setIsEncrypting] = reactExports.useState(false);
  const [showEncryptionDialog, setShowEncryptionDialog] = reactExports.useState(false);
  const [rotatingKey, setRotatingKey] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("messages");
  const [isRoleManagerOpen, setIsRoleManagerOpen] = reactExports.useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = reactExports.useState(false);
  const { online } = useNetworkStatus();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const {
    messages,
    sendMessage,
    isLoading,
    connectionState,
    dataChannelState,
    usingServerFallback,
    connectionAttempts,
    members,
    isAdmin,
    isPremium,
    isPremiumMember,
    securityLevel,
    setSecurityLevel,
    reconnect,
    isPageEncryptionEnabled,
    enablePageEncryption,
    encryptAllMessages
  } = useGroupChat({
    group,
    currentUserId
  });
  const currentUserMember = members.find((member) => member.user_id === currentUserId);
  const currentUserRole = (currentUserMember == null ? void 0 : currentUserMember.role) || "member";
  reactExports.useMemo(() => getRolePermissions(currentUserRole), [currentUserRole]);
  const loadGroup = async () => {
    try {
      const { data: updatedGroup, error } = await supabase.from("group_chats").select(`
          *,
          members:group_members(*)
        `).eq("id", group.id).single();
      if (error) {
        console.error("Failed to load group data:", error);
        toast({
          title: "Failed to refresh group data",
          description: "Could not load the latest group information",
          variant: "destructive"
        });
        return;
      }
      if (updatedGroup) {
        Object.assign(group, updatedGroup);
        if (updatedGroup.members && updatedGroup.members.length > 0 && JSON.stringify(updatedGroup.members) !== JSON.stringify(members)) {
          setTimeout(() => {
            reconnect();
          }, 100);
        }
        toast({
          title: "Group updated",
          description: "Group information has been refreshed"
        });
      }
    } catch (error) {
      console.error("Error loading group data:", error);
    }
  };
  const canManageRoles = reactExports.useMemo(() => hasRolePermission(currentUserRole, "admin"), [currentUserRole]);
  reactExports.useMemo(() => hasRolePermission(currentUserRole, "moderator"), [currentUserRole]);
  const canCreatePolls = reactExports.useMemo(() => hasRolePermission(currentUserRole, "moderator"), [currentUserRole]);
  const canManageFiles = reactExports.useMemo(() => hasRolePermission(currentUserRole, "moderator"), [currentUserRole]);
  const {
    sendMessage: sendOfflineMessage,
    syncMessages: syncOfflineMessages,
    pendingCount,
    isSyncing
  } = useEnhancedOfflineMessages({
    onSendMessage: async (message, mediaBlob) => {
      try {
        console.log("Sending message from offline store:", message);
        return true;
      } catch (error) {
        console.error("Failed to send offline message:", error);
        return false;
      }
    },
    enabled: true
  });
  reactExports.useEffect(() => {
    async function initializeEncryption() {
      setEncryptionStatus("initializing");
      try {
        const encryptionSetting = group.security_level === "high" || group.security_level === "maximum";
        if (encryptionSetting) {
          const keyId = await getGroupKey(group.id);
          setEncryptionEnabled(!!keyId);
          setEncryptionStatus("ready");
        } else {
          setEncryptionEnabled(false);
          setEncryptionStatus("ready");
        }
      } catch (error) {
        console.error("Failed to initialize encryption:", error);
        setEncryptionStatus("error");
        setEncryptionEnabled(false);
      }
    }
    initializeEncryption();
  }, [group.id, group.security_level]);
  const toggleEncryption = async () => {
    if (encryptionStatus !== "ready") return;
    setIsEncrypting(true);
    try {
      if (encryptionEnabled) {
        toast({
          title: "Encryption cannot be disabled",
          description: "For security reasons, once encryption is enabled it cannot be disabled.",
          variant: "destructive"
        });
      } else {
        await getGroupKey(group.id);
        setEncryptionEnabled(true);
        if (group.security_level !== "high" && group.security_level !== "maximum") {
          await supabase.from("groups").update({ security_level: "high" }).eq("id", group.id);
        }
        toast({
          title: "Encryption Enabled",
          description: "End-to-end encryption is now active for this group."
        });
      }
    } catch (error) {
      console.error("Failed to toggle encryption:", error);
      toast({
        title: "Encryption Failed",
        description: "Could not enable encryption. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEncrypting(false);
    }
  };
  const handleRotateKeys = async () => {
    if (!encryptionEnabled || rotatingKey) return;
    setRotatingKey(true);
    try {
      await rotateGroupKey(group.id);
      toast({
        title: "Keys Rotated",
        description: "New encryption keys have been generated for this group."
      });
    } catch (error) {
      console.error("Failed to rotate keys:", error);
      toast({
        title: "Key Rotation Failed",
        description: "Could not generate new encryption keys. Please try again.",
        variant: "destructive"
      });
    } finally {
      setRotatingKey(false);
    }
  };
  const handleSendMessage = async (e, text) => {
    e.preventDefault();
    if (!text.trim()) return false;
    try {
      let processedMessage = text;
      const attachmentBlob = void 0;
      if (encryptionEnabled) {
        try {
          const encryptedData = await encryptGroupMessage(group.id, text);
          processedMessage = JSON.stringify(encryptedData);
        } catch (error) {
          console.error("Failed to encrypt message:", error);
          toast({
            title: "Encryption Failed",
            description: "Could not encrypt your message. It will be sent unencrypted.",
            variant: "destructive"
          });
        }
      }
      let attachmentId = null;
      if (attachmentBlob && IndexedDBStorage.isSupported()) ;
      if (online) {
        await sendMessage(processedMessage, attachmentId);
      } else {
        await sendOfflineMessage(processedMessage, {
          groupId: group.id,
          mediaBlob: attachmentBlob,
          mediaType: attachmentBlob == null ? void 0 : attachmentBlob.type,
          mediaName: "attachment"
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Message Failed",
        description: "Could not send your message. Please try again.",
        variant: "destructive"
      });
    }
  };
  const processedMessages = reactExports.useMemo(() => {
    if (!messages) return [];
    return messages.map((message) => {
      if (!encryptionEnabled) return message;
      try {
        const messageData = JSON.parse(message.content);
        if (messageData && messageData.ciphertext && messageData.iv && messageData.keyId) {
          return {
            ...message,
            isEncrypted: true,
            encryptedData: messageData
          };
        }
      } catch (e) {
      }
      return message;
    });
  }, [messages, encryptionEnabled]);
  const EncryptionStatus = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-1 py-1 px-2 text-xs rounded-full bg-cyberdark-900", children: encryptionEnabled ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3 text-green-500" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-500", children: "Encrypted" })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3 text-amber-500" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-500", children: "Standard" })
  ] }) });
  const handleOpenSettings = () => {
    setShowSettingsPanel(true);
  };
  const handleCloseSettings = () => {
    setShowSettingsPanel(false);
    loadGroup();
    toast({
      title: "Settings updated",
      description: "Group settings have been applied successfully"
    });
  };
  if (showSettingsPanel) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      GroupSettingsPanel,
      {
        group,
        currentUserId,
        members,
        userProfiles,
        onClose: handleCloseSettings,
        refreshGroup: loadGroup
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full bg-cyberdark-950 relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      GroupChatHeader,
      {
        group,
        connectionState,
        dataChannelState,
        usingServerFallback,
        connectionAttempts,
        onBack,
        onReconnect: reconnect,
        securityLevel,
        setSecurityLevel: (level) => setSecurityLevel(toSecurityLevel(level)),
        userProfiles,
        isAdmin,
        isPremium,
        isPremiumMember,
        onShowInvite: () => {
        },
        onShowPremium: () => {
        },
        onShowMembers: () => {
        },
        onOpenSettings: handleOpenSettings,
        isPageEncryptionEnabled,
        onEnablePageEncryption: enablePageEncryption,
        onEncryptAllMessages: encryptAllMessages,
        encryptionStatus,
        isMobile
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900/70 border-b border-cyberdark-800 px-4 py-2 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(EncryptionStatus, {}),
        encryptionEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cybergold-500", children: "End-to-end encrypted" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-2", children: encryptionEnabled ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "h-7 text-xs",
          onClick: handleRotateKeys,
          disabled: rotatingKey,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-3 w-3 mr-1" }),
            rotatingKey ? "Rotating..." : "Rotate Keys"
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "h-7 text-xs",
          onClick: toggleEncryption,
          disabled: isEncrypting || encryptionStatus !== "ready",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3 mr-1" }),
            isEncrypting ? "Enabling..." : "Enable Encryption"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-cyberdark-900/50 border-b border-cyberdark-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-transparent w-full justify-start h-auto px-2 pb-1 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "messages",
            className: "data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400 h-8 text-sm rounded-md",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4 mr-1.5" }),
              "Messages"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "polls",
            className: "data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400 h-8 text-sm rounded-md",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumnIncreasing, { className: "h-4 w-4 mr-1.5" }),
              "Polls"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "files",
            className: "data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400 h-8 text-sm rounded-md",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 mr-1.5" }),
              "Files"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "members",
            className: "data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400 h-8 text-sm rounded-md",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users$1, { className: "h-4 w-4 mr-1.5" }),
              "Members"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "messages", className: "flex-grow overflow-hidden m-0 p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-grow overflow-hidden", children: messages.length === 0 && !isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          GroupChatEmptyState,
          {
            groupName: group.name,
            connectionState,
            securityLevel,
            isAdmin,
            isPremium,
            isPremiumMember,
            memberCount: members.length,
            onShowInvite: () => {
            },
            onShowPremium: () => {
            },
            isPageEncryptionEnabled
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          DirectMessageList,
          {
            messages: processedMessages,
            currentUserId,
            peerIsTyping: false,
            isMessageRead: () => true,
            connectionState,
            dataChannelState,
            usingServerFallback,
            onEditMessage: () => {
            },
            onDeleteMessage: () => {
            },
            securityLevel,
            isPageEncrypted: isPageEncryptionEnabled,
            isPremiumMember,
            isMobile
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 bg-cyberdark-900/50 border-t border-cyberdark-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DirectMessageForm,
            {
              onSendMessage: handleSendMessage,
              usingServerFallback,
              sendError: null,
              isLoading,
              newMessage: "",
              onChangeMessage: () => {
              },
              connectionState,
              dataChannelState,
              editingMessage: null,
              onCancelEdit: () => {
              },
              securityLevel
            }
          ),
          pendingCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 px-2 flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-cybergold-500", children: [
              pendingCount,
              " unsent message",
              pendingCount !== 1 ? "s" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-6 text-xs",
                onClick: syncOfflineMessages,
                disabled: !online || isSyncing,
                children: isSyncing ? "Sending..." : "Send now"
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "polls", className: "m-0 p-4 overflow-y-auto max-h-[calc(100vh-14rem)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        GroupPollSystem,
        {
          groupId: group.id,
          currentUserId,
          isAdmin: canManageRoles,
          canCreatePolls
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "files", className: "m-0 p-4 overflow-y-auto max-h-[calc(100vh-14rem)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        GroupFilesManager,
        {
          groupId: group.id,
          currentUserId,
          isAdmin: canManageRoles,
          canManageFiles,
          isPremium,
          groupName: group.name
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "members", className: "m-0 p-4 overflow-y-auto max-h-[calc(100vh-14rem)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold text-cybergold-200 flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users$1, { className: "mr-2 h-5 w-5 text-cybergold-400" }),
            "Group Members"
          ] }),
          canManageRoles && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-950/30",
              onClick: () => setIsRoleManagerOpen(true),
              children: "Manage Roles"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          GroupMembersList,
          {
            members,
            currentUserId,
            userProfiles,
            isAdmin: canManageRoles,
            groupId: group.id,
            onMemberUpdated: () => {
              toast({
                title: "Member role updated",
                description: "The changes have been saved successfully"
              });
            },
            isMobile
          }
        )
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      GroupMemberRoleManager,
      {
        isOpen: isRoleManagerOpen,
        onClose: () => setIsRoleManagerOpen(false),
        members,
        currentUserId,
        userProfiles,
        groupId: group.id,
        onMemberUpdated: () => {
          toast({
            title: "Member roles updated",
            description: "The changes have been saved successfully"
          });
        }
      }
    )
  ] });
}
export {
  EnhancedGroupChat
};
//# sourceMappingURL=EnhancedGroupChat-C_bnn-j0.js.map
