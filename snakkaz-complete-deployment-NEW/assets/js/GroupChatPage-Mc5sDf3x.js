import { r as reactExports, j as jsxRuntimeExports } from "./vendor-react-core-peV8eoe8.js";
import { u as useAuth, z as useToast, E as Skeleton, S as ScrollArea, C as Card } from "./app-utils-BV6CnmwB.js";
import { EnhancedGroupChat } from "./EnhancedGroupChat-Bn7-6oTy.js";
import { c as useParams } from "./vendor-router-DR7xMgBe.js";
import "./vendor-react-dom-DBSIcw_A.js";
import "./vendor-misc-CCY79dSD.js";
import "./vendor-database-s2JKKpHA.js";
import "./components-ui-DbvoVZ_f.js";
import "./vendor-style-utils-nLA3zUC6.js";
import "./vendor-media-BkkA1nSt.js";
import "./vendor-animation-Ct_3gxOz.js";
import "./vendor-network-BSBq6A-N.js";
import "./app-services-Dev6HuE6.js";
import "./vendor-security-LdHy7Pt9.js";
import "./vendor-react-hooks-e3EokQmA.js";
import "./vendor-radix-ui-UJNVxv2C.js";
import "./vendor-date-utils-D2GbuEg1.js";
const GroupChatPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [message, setMessage] = reactExports.useState("");
  const [groupName, setGroupName] = reactExports.useState("");
  const [groupData, setGroupData] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const loadGroupData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const mockGroupData = {
          id: id || "new-group",
          name: id ? `Gruppe #${id}` : "Ny gruppe",
          creator_id: (user == null ? void 0 : user.id) || "unknown",
          security_level: "standard",
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          write_permissions: "all",
          default_message_ttl: 0
        };
        setGroupData(mockGroupData);
        setGroupName(mockGroupData.name);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading group data:", error);
        toast({
          variant: "destructive",
          title: "Feil ved lasting",
          description: "Kunne ikke laste gruppedata. Prøv igjen senere."
        });
      }
    };
    loadGroupData();
  }, [id, toast, user]);
  const handleBack = () => {
    window.history.back();
  };
  if (isLoading || !groupData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col bg-cyberdark-950 text-cybergold-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-cyberdark-800 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-1/3 bg-cyberdark-800" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20 bg-cyberdark-800" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 bg-cyberdark-800" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: Array(5).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: `max-w-[80%] p-3 ${i % 2 === 0 ? "bg-cyberdark-800" : "bg-cyberdark-700"} border-none`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 bg-cyberdark-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-10 bg-cyberdark-700 ml-2" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full bg-cyberdark-700 mb-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4/5 bg-cyberdark-700" })
      ] }) }, i)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-cyberdark-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-cyberdark-800" }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    EnhancedGroupChat,
    {
      group: groupData,
      currentUserId: (user == null ? void 0 : user.id) || "unknown",
      onBack: handleBack,
      userProfiles: {}
    }
  );
};
export {
  GroupChatPage as default
};
//# sourceMappingURL=GroupChatPage-Mc5sDf3x.js.map
