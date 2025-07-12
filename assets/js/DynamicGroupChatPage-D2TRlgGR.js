const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/js/EnhancedGroupChat-C_bnn-j0.js","assets/js/vendor-react-core-Cd05VJ5Y.js","assets/js/vendor-react-dom-DmiX1e6y.js","assets/js/vendor-misc-guM_vOlB.js","assets/js/vendor-database-Cidpe8p9.js","assets/js/components-ui-CoK5VGD0.js","assets/js/vendor-animation-BRHAymv3.js","assets/js/app-utils-CvwRV1zG.js","assets/js/vendor-style-utils-nLA3zUC6.js","assets/js/app-services-Cf0jkxe3.js","assets/js/vendor-security-LdHy7Pt9.js","assets/js/vendor-router-DRYHFKTT.js","assets/js/vendor-media-rJiPBk-1.js","assets/js/vendor-network-BSBq6A-N.js","assets/js/vendor-react-hooks-Df_KBos6.js","assets/js/vendor-radix-ui-UJNVxv2C.js","assets/js/vendor-date-utils-D2GbuEg1.js"])))=>i.map(i=>d[i]);
import { _ as __vitePreload } from "./components-ui-CoK5VGD0.js";
import { j as jsxRuntimeExports, r as reactExports, bq as React } from "./vendor-react-core-Cd05VJ5Y.js";
import { u as useAuth, F as Skeleton, E as ScrollArea, C as Card } from "./app-utils-CvwRV1zG.js";
import { c as useParams } from "./vendor-router-DRYHFKTT.js";
import "./vendor-animation-BRHAymv3.js";
import "./vendor-database-Cidpe8p9.js";
import "./vendor-style-utils-nLA3zUC6.js";
import "./vendor-media-rJiPBk-1.js";
import "./vendor-misc-guM_vOlB.js";
import "./vendor-network-BSBq6A-N.js";
import "./app-services-Cf0jkxe3.js";
import "./vendor-security-LdHy7Pt9.js";
import "./vendor-react-dom-DmiX1e6y.js";
import "./vendor-react-hooks-Df_KBos6.js";
import "./vendor-radix-ui-UJNVxv2C.js";
const EnhancedGroupChat = reactExports.lazy(
  () => __vitePreload(() => import("./EnhancedGroupChat-C_bnn-j0.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]) : void 0).then((module) => ({ default: module.EnhancedGroupChat }))
);
const GroupChatSkeleton = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col bg-cyberdark-950 text-cybergold-200", children: [
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
const DynamicGroupChatPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(GroupChatSkeleton, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(GroupChatSkeleton, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(EnhancedGroupChatWrapper, { groupId: id, user }) });
};
const EnhancedGroupChatWrapper = ({ groupId, user }) => {
  const [groupData, setGroupData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const loadGroupData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockGroupData = {
          id: groupId || "new-group",
          name: groupId ? `Gruppe #${groupId}` : "Ny gruppe",
          creator_id: (user == null ? void 0 : user.id) || "unknown",
          security_level: "standard",
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          write_permissions: "all",
          default_message_ttl: 0
        };
        setGroupData(mockGroupData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading group data:", error);
        setIsLoading(false);
      }
    };
    loadGroupData();
  }, [groupId, user]);
  const handleBack = () => {
    window.history.back();
  };
  if (isLoading || !groupData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(GroupChatSkeleton, {});
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
  DynamicGroupChatPage as default
};
//# sourceMappingURL=DynamicGroupChatPage-D2TRlgGR.js.map
