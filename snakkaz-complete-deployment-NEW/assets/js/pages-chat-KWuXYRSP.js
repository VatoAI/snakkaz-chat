import { r as reactExports, j as jsxRuntimeExports, ay as MessageCircle, bc as Crown, bk as Bitcoin, aV as Send, b4 as Search, aJ as Plus, bC as Pin, bD as Loader, X, aK as Menu, aP as Hash, aD as Users, aB as LogOut, aE as UserPlus, aA as Settings } from "./vendor-react-core-peV8eoe8.js";
import { u as useAuth, C as Card, f as CardHeader, g as CardTitle, i as CardContent, o as Badge, S as ScrollArea, I as Input, B as Button, z as useToast, e as cn } from "./app-utils-BV6CnmwB.js";
import { F as FreeUserNavigation, U as UnifiedLayout, S as SnakkaZLogo, a as SnakkaZInviteSystem } from "./components-ui-DbvoVZ_f.js";
import { u as useNavigate } from "./vendor-router-DR7xMgBe.js";
import { c as chatService } from "./app-services-Dev6HuE6.js";
const BasicChatPage = () => {
  const { user } = useAuth();
  const [message, setMessage] = reactExports.useState("");
  const [messages, setMessages] = reactExports.useState([
    {
      id: "1",
      text: "Velkommen til Snakkaz Chat! 🚀",
      user: "Velkommen",
      timestamp: /* @__PURE__ */ new Date(),
      type: "welcome"
    },
    {
      id: "2",
      text: "Del dine tanker, møt nye venner og bygg ekte forbindelser her! 💬",
      user: "Fellesskap",
      timestamp: /* @__PURE__ */ new Date(),
      type: "community"
    }
  ]);
  const sendMessage = () => {
    var _a;
    if (message.trim() && user) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        user: ((_a = user.email) == null ? void 0 : _a.split("@")[0]) || "Anonym",
        timestamp: /* @__PURE__ */ new Date(),
        type: "user"
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      if (message.toLowerCase().includes("hei") || message.toLowerCase().includes("hallo")) {
        setTimeout(() => {
          const encouragementMessage = {
            id: (Date.now() + 1).toString(),
            text: "👋 Flott at du vil chatte! Inviter venner til å bli med - desto flere, desto morsommere blir det!",
            user: "Fellesskap",
            timestamp: /* @__PURE__ */ new Date(),
            type: "community"
          };
          setMessages((prev) => [...prev, encouragementMessage]);
        }, 1e3);
      }
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-cyberdark-900 to-cyberdark-800 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md bg-cyberdark-800/50 border-cyberprimary-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-12 w-12 text-cyberprimary-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl text-cyberprimary-100", children: "Snakkaz Chat" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberdark-300", children: "Logg inn for å begynne å chatte" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-cyberdark-700/30 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-cyberprimary-200 mb-2", children: "Chat Features:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-cyberdark-300 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Chat med andre brukere" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• BTC/NOK diskusjoner" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Basis trading-tips" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-gradient-to-r from-cyberprimary-900/20 to-cybersecondary-900/20 rounded-lg border border-cyberprimary-500/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-4 w-4 text-cyberprimary-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-cyberprimary-200", children: "Avanserte Features:" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-cyberdark-300 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Krypterte private meldinger" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Avanserte BTC analyser" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Direktehandel funksjoner" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Utvidede trading signaler" })
          ] })
        ] })
      ] }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-cyberdark-900 to-cyberdark-800 flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(FreeUserNavigation, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-4xl p-4 h-screen flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold text-cyberprimary-100 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-8 w-8 text-cyberprimary-400" }),
            "Snakkaz Chat"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberdark-300", children: "BTC/NOK Trading & Chat Community" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "border-cyberprimary-500/30 text-cyberprimary-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bitcoin, { className: "h-3 w-3 mr-1" }),
          "Chat Medlem"
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-800/50 border-cyberprimary-500/20 h-[600px] flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-cyberprimary-200", children: "Chat Room" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-cyberdark-700 text-cyberdark-300", children: [
            messages.filter((m) => m.type === "user").length,
            " meldinger"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex-1 flex flex-col p-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: messages.map((msg) => {
            var _a, _b;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `flex flex-col gap-1 ${msg.type === "user" && msg.user === (((_a = user.email) == null ? void 0 : _a.split("@")[0]) || "Anonym") ? "items-end" : "items-start"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-cyberdark-400", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-medium ${msg.type === "welcome" ? "text-cybergold-400" : msg.type === "community" ? "text-green-400" : "text-cyberdark-300"}`, children: msg.user }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: msg.timestamp.toLocaleTimeString() })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `max-w-xs px-4 py-2 rounded-lg ${msg.type === "user" && msg.user === (((_b = user.email) == null ? void 0 : _b.split("@")[0]) || "Anonym") ? "bg-cyberprimary-600 text-white ml-auto" : msg.type === "welcome" ? "bg-cybergold-900/20 text-cybergold-200 border border-cybergold-500/20" : msg.type === "community" ? "bg-green-900/20 text-green-200 border border-green-500/20" : "bg-cyberdark-700 text-cyberdark-200"}`,
                      children: msg.text
                    }
                  )
                ]
              },
              msg.id
            );
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-t border-cyberdark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: message,
                  onChange: (e) => setMessage(e.target.value),
                  onKeyPress: handleKeyPress,
                  placeholder: "Skriv en melding...",
                  className: "flex-1 bg-cyberdark-700 border-cyberdark-600 text-cyberdark-100 placeholder:text-cyberdark-400"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: sendMessage,
                  disabled: !message.trim(),
                  className: "bg-cyberprimary-600 hover:bg-cyberprimary-700 text-white",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cyberdark-400 mt-2", children: '💡 Tip: Skriv "BTC" for trading-tips! Få utvidet tilgang for avanserte funksjoner.' })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mt-4 bg-gradient-to-r from-cyberprimary-900/20 to-cybersecondary-900/20 border-cyberprimary-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-cyberprimary-200 mb-1", children: "Få Utvidet Tilgang" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cyberdark-300", children: "Få tilgang til krypterte meldinger, avanserte BTC-analyser og mer!" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "border-cyberprimary-500 text-cyberprimary-300 hover:bg-cyberprimary-500/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-4 w-4 mr-2" }),
          "Oppgrader"
        ] })
      ] }) }) })
    ] }) })
  ] });
};
const BasicChatPage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BasicChatPage
}, Symbol.toStringTag, { value: "Module" }));
const ChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const chats = [
    {
      name: "Team Norge",
      lastMsg: "Møte i morgen kl 10",
      time: "14:32",
      unread: 3,
      pinned: true,
      isGroup: true,
      avatar: "TN",
      online: false
    },
    {
      name: "Lisa Hansen",
      lastMsg: "Takk for hjelpen! 🙏",
      time: "13:45",
      unread: 1,
      pinned: false,
      isGroup: false,
      avatar: "LH",
      online: true
    },
    {
      name: "Utvikler Chat",
      lastMsg: "Ny versjon er klar",
      time: "12:15",
      unread: 0,
      pinned: false,
      isGroup: true,
      avatar: "UC",
      online: false
    },
    {
      name: "Familie",
      lastMsg: "Middag på søndag?",
      time: "11:30",
      unread: 5,
      pinned: true,
      isGroup: true,
      avatar: "FA",
      online: false
    },
    {
      name: "Erik Johansen",
      lastMsg: "Ser deg i morgen",
      time: "10:15",
      unread: 0,
      pinned: false,
      isGroup: false,
      avatar: "EJ",
      online: false
    },
    {
      name: "Maria Silva",
      lastMsg: "Bra jobba! 👏",
      time: "09:30",
      unread: 2,
      pinned: false,
      isGroup: false,
      avatar: "MS",
      online: true
    }
  ];
  const filteredChats = chats.filter(
    (chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || chat.lastMsg.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getAvatarColor = (isGroup, name) => {
    if (isGroup) return "bg-cyberblue-500";
    const colors = ["bg-cybergold-500", "bg-cybergreen-500", "bg-cyberred-500", "bg-cyberblue-500"];
    return colors[name.length % colors.length];
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    UnifiedLayout,
    {
      title: "Chats",
      subtitle: "Dine samtaler",
      headerActions: {
        onCall: () => navigate("/calls"),
        onVideoCall: () => navigate("/video-calls"),
        onOptions: () => navigate("/chat/settings")
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm mx-auto space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18, className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-cyberdark-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Søk i chats...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "w-full bg-cyberdark-800 border border-cyberdark-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-cyberdark-400 focus:outline-none focus:ring-2 focus:ring-cybergold-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => navigate("/chat/new"),
              className: "flex-1 bg-cybergold-500/10 border border-cybergold-500/30 rounded-lg p-3 flex items-center justify-center space-x-2 text-cybergold-400 active:bg-cybergold-500/20 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Ny Chat" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => navigate("/groups/create"),
              className: "flex-1 bg-cyberblue-500/10 border border-cyberblue-500/30 rounded-lg p-3 flex items-center justify-center space-x-2 text-cyberblue-400 active:bg-cyberblue-500/20 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Ny Gruppe" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-cybergold-400", children: chats.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Totale chats" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-cybergreen-400", children: chats.reduce((sum, chat) => sum + chat.unread, 0) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Uleste" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-cyberblue-400", children: chats.filter((chat) => chat.online).length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-300", children: "Online" })
          ] })
        ] }) }),
        chats.some((chat) => chat.pinned) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-cybergold-400 flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Festede chats" })
          ] }),
          filteredChats.filter((chat) => chat.pinned).map((chat, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-cybergold-500/10 border border-cybergold-500/20 rounded-lg p-4 active:bg-cybergold-500/20 transition-colors",
              onClick: () => navigate(`/chat/${chat.name.toLowerCase().replace(/\s+/g, "-")}`),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 ${getAvatarColor(chat.isGroup, chat.name)} rounded-full flex items-center justify-center text-white font-bold`, children: chat.avatar }),
                  chat.online && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 w-4 h-4 bg-cybergreen-500 border-2 border-cyberdark-800 rounded-full" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-white truncate", children: chat.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { size: 12, className: "text-cybergold-400" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cyberdark-300 truncate", children: chat.lastMsg })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cyberdark-400", children: chat.time }),
                  chat.unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-cybergold-500 text-cyberdark-900 text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium", children: chat.unread })
                ] })
              ] })
            },
            `pinned-${index}`
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-white flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Alle chats" })
          ] }),
          filteredChats.filter((chat) => !chat.pinned).map((chat, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700 active:bg-cyberdark-700 transition-colors",
              onClick: () => navigate(`/chat/${chat.name.toLowerCase().replace(/\s+/g, "-")}`),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 ${getAvatarColor(chat.isGroup, chat.name)} rounded-full flex items-center justify-center text-white font-bold`, children: chat.avatar }),
                  chat.online && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 w-4 h-4 bg-cybergreen-500 border-2 border-cyberdark-800 rounded-full" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-white truncate", children: chat.name }),
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
        ] }),
        filteredChats.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 48, className: "text-cyberdark-400 mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white mb-2", children: "Ingen chats funnet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberdark-400 text-sm mb-4", children: searchQuery ? "Prøv et annet søk" : "Start din første samtale" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => navigate("/chat/new"),
              className: "bg-cybergold-500 text-cyberdark-900 px-6 py-2 rounded-lg font-medium active:scale-95 transition-transform",
              children: "Start ny chat"
            }
          )
        ] })
      ] }) })
    }
  );
};
const ChatPageNew = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ChatPage
}, Symbol.toStringTag, { value: "Module" }));
const SnakkaZChatBeta = () => {
  var _a, _b, _c;
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = reactExports.useState("");
  const [activeRoom, setActiveRoom] = reactExports.useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = reactExports.useState(false);
  const [isUserListOpen, setIsUserListOpen] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [isInviteSystemOpen, setIsInviteSystemOpen] = reactExports.useState(false);
  const [rooms, setRooms] = reactExports.useState([]);
  const [messages, setMessages] = reactExports.useState([]);
  const [onlineUsers, setOnlineUsers] = reactExports.useState([]);
  const messagesEndRef = reactExports.useRef(null);
  const messageInputRef = reactExports.useRef(null);
  const scrollToBottom = () => {
    var _a2;
    (_a2 = messagesEndRef.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
  };
  reactExports.useEffect(() => {
    scrollToBottom();
  }, [messages]);
  reactExports.useEffect(() => {
    if (!user) return;
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        const roomsList = await chatService.getChatRooms();
        setRooms(roomsList);
        const defaultRoom = roomsList.find((r) => r.name === "General") || roomsList[0];
        if (defaultRoom) {
          setActiveRoom(defaultRoom.id);
        }
        const users = await chatService.getOnlineUsers();
        setOnlineUsers(users);
        await chatService.updatePresence(true);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        toast({
          title: "Feil",
          description: "Kunne ikke koble til chat. Prøv å laste siden på nytt.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    initializeChat();
    return () => {
      chatService.updatePresence(false);
      chatService.cleanup();
    };
  }, [user, toast]);
  reactExports.useEffect(() => {
    if (!activeRoom) return;
    const loadMessages = async () => {
      try {
        const roomMessages = await chatService.getMessages(activeRoom);
        setMessages(roomMessages);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };
    loadMessages();
    const unsubscribe = chatService.subscribeToMessages(activeRoom, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    return unsubscribe;
  }, [activeRoom]);
  const sendMessage = async () => {
    var _a2;
    if (!message.trim() || !user || !activeRoom) return;
    try {
      await chatService.sendMessage(activeRoom, message.trim());
      setMessage("");
      (_a2 = messageInputRef.current) == null ? void 0 : _a2.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke sende melding. Prøv igjen.",
        variant: "destructive"
      });
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const filteredMessages = messages;
  const activeRoomData = rooms.find((r) => r.id === activeRoom);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-screen bg-cyberdark-950 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 text-cybergold-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: "animate-spin", size: 24 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Laster chat..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen bg-cyberdark-950 flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:hidden flex items-center justify-between p-4 bg-cyberdark-900 border-b border-cybergold-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
          className: "text-cybergold-400",
          children: isMobileMenuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { size: 20 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { size: 16, className: "text-cybergold-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-medium", children: (activeRoomData == null ? void 0 : activeRoomData.name) || "Chat" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => setIsUserListOpen(!isUserListOpen),
          className: "text-cybergold-400",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 20 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
        "bg-cyberdark-900 border-r border-cybergold-500/20 flex flex-col",
        "lg:w-80 lg:block",
        isMobileMenuOpen ? "fixed inset-y-0 left-0 z-50 w-80" : "hidden lg:block"
      ), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-cybergold-500/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SnakkaZLogo, { variant: "header", animated: true }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-glass-subtle p-3 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-cybergold-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cyberdark-950 font-bold text-sm", children: (_a = user == null ? void 0 : user.email) == null ? void 0 : _a.charAt(0).toUpperCase() }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm font-medium truncate", children: (_b = user == null ? void 0 : user.email) == null ? void 0 : _b.split("@")[0] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-400 text-xs", children: "Online" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: signOut,
                className: "text-cyberred-400 hover:text-cyberred-300 p-1",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16 })
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-cybergold-400 text-sm font-medium mb-3 flex items-center justify-between", children: [
            "OFFENTLIGE ROM",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "p-1 h-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }) })
          ] }),
          rooms.filter((r) => r.type === "public").map((room) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                setActiveRoom(room.id);
                setIsMobileMenuOpen(false);
              },
              className: cn(
                "w-full text-left p-3 rounded-lg transition-all duration-200",
                "flex items-center justify-between group",
                activeRoom === room.id ? "liquid-glass-moderate text-white" : "hover:liquid-glass-subtle text-cybergold-300 hover:text-white"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { size: 16, className: "text-cybergold-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: room.name })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: room.participant_count || 0 })
              ]
            },
            room.id
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-cybergold-400 text-sm font-medium mb-3 mt-6 flex items-center justify-between", children: [
            "GRUPPER",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "p-1 h-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }) })
          ] }),
          rooms.filter((r) => r.type === "group").map((room) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                setActiveRoom(room.id);
                setIsMobileMenuOpen(false);
              },
              className: cn(
                "w-full text-left p-3 rounded-lg transition-all duration-200",
                "flex items-center justify-between group",
                activeRoom === room.id ? "liquid-glass-moderate text-white" : "hover:liquid-glass-subtle text-cybergold-300 hover:text-white"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 16, className: "text-cybergold-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: room.name })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: room.participant_count || 0 })
              ]
            },
            room.id
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cybergold-400 text-sm font-medium mb-3 mt-6", children: "INVITASJONER" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SnakkaZInviteSystem,
              {
                variant: "button",
                className: "w-full justify-start text-sm h-10",
                showStats: false
              }
            ),
            activeRoom && ((_c = rooms.find((r) => r.id === activeRoom)) == null ? void 0 : _c.type) === "group" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "w-full justify-start text-sm h-10 border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10",
                onClick: () => {
                  toast({
                    title: "Gruppeinnvitasjon",
                    description: "Funksjonen kommer snart!"
                  });
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 mr-2" }),
                  "Inviter til gruppe"
                ]
              }
            )
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex items-center justify-between p-4 bg-cyberdark-900 border-b border-cybergold-500/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { size: 20, className: "text-cybergold-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-white", children: (activeRoomData == null ? void 0 : activeRoomData.name) || "Chat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "border-cybergold-500/50 text-cybergold-400", children: [
              (activeRoomData == null ? void 0 : activeRoomData.participant_count) || 0,
              " medlemmer"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-cybergold-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-cybergold-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 16 }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 max-w-4xl mx-auto", children: [
          filteredMessages.map((msg) => {
            var _a2, _b2, _c2, _d;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start space-x-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-cybergold-500 rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cyberdark-950 font-bold text-sm", children: ((_b2 = (_a2 = msg.user_profile) == null ? void 0 : _a2.display_name) == null ? void 0 : _b2.charAt(0).toUpperCase()) || ((_c2 = msg.user_id) == null ? void 0 : _c2.charAt(0).toUpperCase()) || "U" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-white", children: ((_d = msg.user_profile) == null ? void 0 : _d.display_name) || msg.user_id || "Anonym" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-400 text-xs", children: new Date(msg.created_at).toLocaleTimeString() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-glass-chat p-3 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white", children: msg.content }) })
              ] })
            ] }) }, msg.id);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-cyberdark-900 border-t border-cybergold-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: message,
              onChange: (e) => setMessage(e.target.value),
              onKeyPress: handleKeyPress,
              placeholder: `Skriv en melding til ${(activeRoomData == null ? void 0 : activeRoomData.name) || "rommet"}...`,
              ref: messageInputRef,
              className: "liquid-glass-subtle border-cybergold-500/30 text-white placeholder:text-cybergold-400 pr-12"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: sendMessage,
              disabled: !message.trim(),
              className: "liquid-glass-moderate border-cybergold-500/30 hover:border-cybergold-500/50 text-cybergold-400 hover:text-white",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 18 })
            }
          )
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
        "bg-cyberdark-900 border-l border-cybergold-500/20 flex flex-col",
        "lg:w-64 lg:block",
        isUserListOpen ? "fixed inset-y-0 right-0 z-50 w-64" : "hidden lg:block"
      ), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-cybergold-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-white", children: [
            "Online (",
            onlineUsers.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-cybergold-400 lg:hidden", onClick: () => setIsUserListOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: onlineUsers.map((user2) => {
          var _a2, _b2;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 p-2 rounded-lg hover:liquid-glass-subtle cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-cybergold-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cyberdark-950 font-bold text-sm", children: ((_a2 = user2.display_name) == null ? void 0 : _a2.charAt(0).toUpperCase()) || ((_b2 = user2.id) == null ? void 0 : _b2.charAt(0).toUpperCase()) || "U" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-cyberdark-900" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm font-medium truncate", children: user2.display_name || user2.id || "Anonym" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-400 text-xs", children: "Online" })
            ] })
          ] }, user2.id);
        }) }) })
      ] })
    ] }),
    (isMobileMenuOpen || isUserListOpen) && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/50 z-40 lg:hidden",
        onClick: () => {
          setIsMobileMenuOpen(false);
          setIsUserListOpen(false);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
      "fixed inset-0 z-50 flex items-center justify-center p-4",
      isInviteSystemOpen ? "block" : "hidden"
    ), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md bg-cyberdark-900 rounded-lg shadow-lg p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Inviter til rom" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => setIsInviteSystemOpen(false),
            className: "text-cybergold-400",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SnakkaZInviteSystem, {}) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
      "fixed inset-0 z-50 flex items-center justify-center p-4",
      isInviteSystemOpen ? "block" : "hidden"
    ), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md bg-cyberdark-900 rounded-lg shadow-lg p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Inviter til gruppe" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => setIsInviteSystemOpen(false),
            className: "text-cybergold-400",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-400", children: "Gruppeinvitasjon kommer snart!" }) }) })
    ] }) })
  ] });
};
const SnakkaZChatBeta$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SnakkaZChatBeta
}, Symbol.toStringTag, { value: "Module" }));
export {
  BasicChatPage$1 as B,
  ChatPageNew as C,
  SnakkaZChatBeta$1 as S
};
//# sourceMappingURL=pages-chat-KWuXYRSP.js.map
