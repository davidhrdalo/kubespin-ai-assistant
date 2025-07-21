// plugins/kubespin-ai-assistant/kubespin-ui/pages/CodeGeneratorPage.sidebar.js
export const getCodeGeneratorPageSidebarConfig = ({
  addLog,
  session,
  // Add any other props needed for this page
}) => ({
  topItems: [
    { type: "title", text: "AI Assistant" },
    { type: "link", to: "/plugin/ai-assistant", icon: "FaInfoCircle", text: "Overview" },
    { type: "link", to: "/plugin/ai-assistant/chat", icon: "FaComments", text: "Chat" },
    { type: "link", to: "/plugin/ai-assistant/code-generator", icon: "FaCode", text: "Code Generator", end: true },
    { type: "link", to: "/plugin/ai-assistant/tool-calls", icon: "FaTools", text: "Tool Calls" },
    { type: "link", to: "/plugin/ai-assistant/plugin-manager", icon: "FaPuzzlePiece", text: "Plugin Manager" },
    { type: "divider" },
    { type: "link", to: "/plugin/ai-assistant/settings", icon: "FaCog", text: "Settings", disabled: true, title: "Settings (Coming Soon)" },
  ],
  bottomItems: [
    { type: "divider" },
    { type: "link", to: "/home", icon: "FaHome", text: "Back to Home" },
  ],
}); 