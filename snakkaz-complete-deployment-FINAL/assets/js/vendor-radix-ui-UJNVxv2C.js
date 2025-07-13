function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
  return function handleEvent(event) {
    originalEventHandler == null ? void 0 : originalEventHandler(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler == null ? void 0 : ourEventHandler(event);
    }
  };
}
function clamp(value, [min, max]) {
  return Math.min(max, Math.max(min, value));
}
export {
  clamp as a,
  composeEventHandlers as c
};
//# sourceMappingURL=vendor-radix-ui-UJNVxv2C.js.map
