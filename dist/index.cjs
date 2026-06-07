"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
var sanity = require("sanity"), jsxRuntime = require("react/jsx-runtime"), react = require("react"), ui = require("@sanity/ui"), icons = require("@sanity/icons");
const DEFAULT_STORAGE_KEY = "sanity-context";
let _definitions = [], _storageKey = DEFAULT_STORAGE_KEY, _state = {}, _resolver = null;
const _listeners = /* @__PURE__ */ new Set();
function defaultState(definitions) {
  return Object.fromEntries(definitions.map((d) => [d.id, { enabled: !1, value: d.defaultValue }]));
}
function loadFromStorage(definitions) {
  if (typeof window > "u") return defaultState(definitions);
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return defaultState(definitions);
    const saved = JSON.parse(raw);
    return Object.fromEntries(
      definitions.map((d) => [
        d.id,
        {
          enabled: !!saved[d.id]?.enabled,
          value: d.options.find((o) => o.value === saved[d.id]?.value)?.value ?? d.defaultValue
        }
      ])
    );
  } catch {
    return defaultState(definitions);
  }
}
function persist() {
  typeof window < "u" && localStorage.setItem(_storageKey, JSON.stringify(_state));
}
function notify() {
  _listeners.forEach((fn) => fn());
}
function initContextStore(definitions, storageKey) {
  _definitions = definitions, _storageKey = storageKey ?? DEFAULT_STORAGE_KEY, _state = loadFromStorage(definitions), notify();
}
function setContextsResolver(resolver, storageKey) {
  _resolver = resolver, _storageKey = storageKey ?? DEFAULT_STORAGE_KEY;
}
function resolveContexts(ctx) {
  _resolver && initContextStore(_resolver(ctx), _storageKey);
}
function getContextDefinitions() {
  return _definitions;
}
function getContext() {
  return _state;
}
function setContextEntry(id, patch) {
  _state[id] && (_state = { ..._state, [id]: { ..._state[id], ...patch } }, persist(), notify());
}
function subscribeToContext(listener) {
  return _listeners.add(listener), () => {
    _listeners.delete(listener);
  };
}
const ContextIcon = react.forwardRef(
  function(_props, _ref) {
    return /* @__PURE__ */ jsxRuntime.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 128 128", xmlns: "http://www.w3.org/2000/svg", children: [
      /* @__PURE__ */ jsxRuntime.jsx("defs", { children: /* @__PURE__ */ jsxRuntime.jsxs("linearGradient", { id: "g", x1: "0", y1: "0", x2: "1", y2: "0", children: [
        /* @__PURE__ */ jsxRuntime.jsx("stop", { offset: "0%", "stop-color": "#6366F1" }),
        /* @__PURE__ */ jsxRuntime.jsx("stop", { offset: "100%", "stop-color": "#06B6D4" })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx(
        "rect",
        {
          x: "16",
          y: "20",
          width: "32",
          height: "88",
          rx: "8",
          fill: "none",
          stroke: "#6366F1",
          "stroke-width": "6"
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        "rect",
        {
          x: "80",
          y: "20",
          width: "32",
          height: "88",
          rx: "8",
          fill: "none",
          stroke: "#06B6D4",
          "stroke-width": "6"
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        "path",
        {
          d: "M48 64 C60 40, 68 88, 80 64",
          fill: "none",
          stroke: "url(#g)",
          "stroke-width": "6",
          "stroke-linecap": "round"
        }
      )
    ] });
  }
);
function ContextItem({ id, label, enabled, onToggle, children }) {
  return /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", justify: "space-between", gap: 4, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(
      ui.Flex,
      {
        align: "center",
        gap: 2,
        as: "label",
        htmlFor: id,
        style: { cursor: "pointer", flexShrink: 0 },
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.Switch,
            {
              id,
              checked: enabled,
              onChange: (e) => onToggle(e.currentTarget.checked)
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { size: 1, children: label })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { style: { width: 150, opacity: enabled ? 1 : 0.35, pointerEvents: enabled ? "auto" : "none" }, children })
  ] });
}
function useContextState() {
  return react.useSyncExternalStore(subscribeToContext, getContext, getContext);
}
function ContextPopover() {
  const [open, setOpen] = react.useState(!1), definitions = getContextDefinitions(), state = useContextState(), triggerRef = react.useRef(null), cardRef = react.useRef(null), [coords, setCoords] = react.useState({ top: 0, right: 0 }), hasActive = Object.values(state).some((e) => e.enabled);
  return react.useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
  }, [open]), react.useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      const target = e.target;
      triggerRef.current?.contains(target) || cardRef.current?.contains(target) || target.closest?.("[data-context-ui]") || setOpen(!1);
    };
    return document.addEventListener("mousedown", handler), () => document.removeEventListener("mousedown", handler);
  }, [open]), /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { ref: triggerRef, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Tooltip, { content: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, children: "Sanity context" }), placement: "bottom", portal: !0, children: /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        mode: "bleed",
        icon: ContextIcon,
        selected: open,
        tone: hasActive ? "primary" : "default",
        onClick: () => setOpen((v) => !v)
      }
    ) }) }),
    open && /* @__PURE__ */ jsxRuntime.jsx(ui.Portal, { children: /* @__PURE__ */ jsxRuntime.jsx(ui.Layer, { children: /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref: cardRef,
        style: { position: "fixed", top: coords.top, right: coords.right },
        children: /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { "data-context-ui": !0, padding: 3, shadow: 2, style: { minWidth: 260 }, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Stack, { space: 3, children: definitions.map((def) => {
          const entry = state[def.id], currentTitle = def.options.find((o) => o.value === entry?.value)?.title ?? def.options[0]?.title;
          return /* @__PURE__ */ jsxRuntime.jsx(
            ContextItem,
            {
              id: `sanity-context-${def.id}`,
              label: def.title,
              enabled: entry?.enabled ?? !1,
              onToggle: (enabled) => setContextEntry(def.id, { enabled }),
              children: /* @__PURE__ */ jsxRuntime.jsx(
                ui.MenuButton,
                {
                  button: /* @__PURE__ */ jsxRuntime.jsx(
                    ui.Button,
                    {
                      text: currentTitle,
                      fontSize: 1,
                      padding: 2,
                      mode: "ghost",
                      style: { width: "100%" }
                    }
                  ),
                  id: `sanity-context-menu-${def.id}`,
                  menu: /* @__PURE__ */ jsxRuntime.jsx(ui.Menu, { "data-context-ui": !0, children: def.options.map((opt) => /* @__PURE__ */ jsxRuntime.jsx(
                    ui.MenuItem,
                    {
                      text: opt.title,
                      icon: entry?.value === opt.value ? icons.CheckmarkIcon : void 0,
                      onClick: () => setContextEntry(def.id, { value: opt.value })
                    },
                    opt.value
                  )) }),
                  popover: { placement: "bottom-start" }
                }
              )
            },
            def.id
          );
        }) }) })
      }
    ) }) })
  ] });
}
function ContextNavbar(props) {
  const currentUser = sanity.useCurrentUser(), workspace = sanity.useWorkspace(), resolved = react.useRef(!1);
  return react.useEffect(() => {
    resolved.current || !currentUser || (resolveContexts({ currentUser, workspace }), resolved.current = !0);
  }, [currentUser, workspace]), /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { style: { width: "100%" }, children: [
    /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { flex: 1, style: { minWidth: 0 }, children: props.renderDefault(props) }),
    /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { borderBottom: !0, style: { display: "flex", alignItems: "center", paddingRight: 8 }, children: /* @__PURE__ */ jsxRuntime.jsx(ContextPopover, {}) })
  ] });
}
function contextPlugin(config) {
  return typeof config.contexts == "function" ? setContextsResolver(config.contexts, config.storageKey) : initContextStore(config.contexts, config.storageKey), sanity.definePlugin({
    name: "sanity-context",
    studio: {
      components: { navbar: ContextNavbar }
    }
  })();
}
exports.ContextIcon = ContextIcon;
exports.contextPlugin = contextPlugin;
exports.getContext = getContext;
exports.subscribeToContext = subscribeToContext;
//# sourceMappingURL=index.cjs.map
