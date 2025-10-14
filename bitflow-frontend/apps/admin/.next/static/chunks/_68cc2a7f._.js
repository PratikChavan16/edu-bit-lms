(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/packages/ui/src/providers/theme-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const ThemeContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
const DEFAULT_STORAGE_KEY = "bitflow-theme";
const getSystemTheme = ()=>window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const disableTransitionsTemporarily = (shouldDisable)=>{
    if (!shouldDisable) {
        return;
    }
    const style = document.createElement("style");
    style.appendChild(document.createTextNode("* { transition: none !important; }"));
    document.head.appendChild(style);
    queueMicrotask(()=>{
        document.head.removeChild(style);
    });
};
function ThemeProvider({ children, attribute = "class", defaultTheme = "system", enableSystem = true, disableTransitionOnChange = false, storageKey = DEFAULT_STORAGE_KEY }) {
    _s();
    const [theme, setThemeState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        "ThemeProvider.useState": ()=>defaultTheme
    }["ThemeProvider.useState"]);
    const [mounted, setMounted] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const applyTheme = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ThemeProvider.useCallback[applyTheme]": (value)=>{
            const root = document.documentElement;
            const resolved = value === "system" && enableSystem ? getSystemTheme() : value;
            disableTransitionsTemporarily(disableTransitionOnChange);
            if (attribute === "class") {
                root.classList.remove("light", "dark");
                root.classList.add(resolved);
            } else {
                root.setAttribute(attribute, resolved);
            }
        }
    }["ThemeProvider.useCallback[applyTheme]"], [
        attribute,
        disableTransitionOnChange,
        enableSystem
    ]);
    const setTheme = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ThemeProvider.useCallback[setTheme]": (value)=>{
            setThemeState(value);
            if ("TURBOPACK compile-time truthy", 1) {
                try {
                    localStorage.setItem(storageKey, value);
                } catch (error) {
                    console.warn("Unable to persist theme preference", error);
                }
            }
        }
    }["ThemeProvider.useCallback[setTheme]"], [
        storageKey
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "ThemeProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const savedTheme = ({
                "ThemeProvider.useEffect.savedTheme": ()=>{
                    try {
                        const entry = localStorage.getItem(storageKey);
                        return entry === "light" || entry === "dark" || entry === "system" ? entry : null;
                    } catch (error) {
                        console.warn("Unable to read theme preference", error);
                        return null;
                    }
                }
            })["ThemeProvider.useEffect.savedTheme"]();
            const initialTheme = savedTheme ?? defaultTheme;
            setThemeState(initialTheme);
            applyTheme(initialTheme);
            setMounted(true);
            if (!enableSystem) {
                return;
            }
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = {
                "ThemeProvider.useEffect.handleChange": ()=>{
                    setThemeState({
                        "ThemeProvider.useEffect.handleChange": (current)=>{
                            if (current !== "system") {
                                return current;
                            }
                            applyTheme("system");
                            return current;
                        }
                    }["ThemeProvider.useEffect.handleChange"]);
                }
            }["ThemeProvider.useEffect.handleChange"];
            mediaQuery.addEventListener("change", handleChange);
            return ({
                "ThemeProvider.useEffect": ()=>mediaQuery.removeEventListener("change", handleChange)
            })["ThemeProvider.useEffect"];
        }
    }["ThemeProvider.useEffect"], [
        applyTheme,
        defaultTheme,
        enableSystem,
        storageKey
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "ThemeProvider.useEffect": ()=>{
            if (!mounted) {
                return;
            }
            applyTheme(theme);
        }
    }["ThemeProvider.useEffect"], [
        applyTheme,
        mounted,
        theme
    ]);
    const resolvedTheme = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ThemeProvider.useMemo[resolvedTheme]": ()=>{
            if (theme === "system" && ("TURBOPACK compile-time value", "object") !== "undefined" && enableSystem) {
                return getSystemTheme();
            }
            return theme === "dark" ? "dark" : "light";
        }
    }["ThemeProvider.useMemo[resolvedTheme]"], [
        enableSystem,
        theme
    ]);
    const value = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ThemeProvider.useMemo[value]": ()=>({
                theme,
                resolvedTheme,
                setTheme
            })
    }["ThemeProvider.useMemo[value]"], [
        resolvedTheme,
        setTheme,
        theme
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/ui/src/providers/theme-provider.tsx",
        lineNumber: 143,
        columnNumber: 10
    }, this);
}
_s(ThemeProvider, "huRFhqfiFYMn93C5u6FyBmDsCsk=");
_c = ThemeProvider;
function useTheme() {
    _s1();
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/toast/useToast.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toast",
    ()=>toast,
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@4.5.7_@types+react@18.3.26_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
;
const useToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])((set)=>({
        toasts: [],
        addToast: (toast)=>{
            const id = Math.random().toString(36).substring(7);
            const newToast = {
                id,
                duration: 5000,
                ...toast
            };
            set((state)=>({
                    toasts: [
                        ...state.toasts,
                        newToast
                    ]
                }));
            // Auto-remove toast after duration
            if (newToast.duration) {
                setTimeout(()=>{
                    set((state)=>({
                            toasts: state.toasts.filter((t)=>t.id !== id)
                        }));
                }, newToast.duration);
            }
        },
        removeToast: (id)=>set((state)=>({
                    toasts: state.toasts.filter((t)=>t.id !== id)
                })),
        clearToasts: ()=>set({
                toasts: []
            })
    }));
const toast = {
    success: (title, message, duration)=>{
        useToast.getState().addToast({
            type: 'success',
            title,
            message,
            duration
        });
    },
    error: (title, message, duration)=>{
        useToast.getState().addToast({
            type: 'error',
            title,
            message,
            duration
        });
    },
    warning: (title, message, duration)=>{
        useToast.getState().addToast({
            type: 'warning',
            title,
            message,
            duration
        });
    },
    info: (title, message, duration)=>{
        useToast.getState().addToast({
            type: 'info',
            title,
            message,
            duration
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/lib/cn.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$2$2e$6$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@2.6.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$2$2e$6$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/toast/index.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastContainer",
    ()=>ToastContainer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.446.0_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.446.0_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.446.0_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.446.0_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.446.0_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$toast$2f$useToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/toast/useToast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/cn.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const toastIcons = {
    success: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"],
    error: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"],
    warning: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
    info: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"]
};
const toastStyles = {
    success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
    error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
    info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100'
};
const iconStyles = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400'
};
function ToastItem({ toast, onClose }) {
    _s();
    const Icon = toastIcons[toast.type];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ToastItem.useEffect": ()=>{
            if (toast.duration) {
                const timer = setTimeout(onClose, toast.duration);
                return ({
                    "ToastItem.useEffect": ()=>clearTimeout(timer)
                })["ToastItem.useEffect"];
            }
        }
    }["ToastItem.useEffect"], [
        toast.duration,
        onClose
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-start gap-3 p-4 rounded-lg border shadow-lg', 'animate-in slide-in-from-right-full duration-300', 'transition-all', toastStyles[toast.type]),
        role: "alert",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-5 h-5 flex-shrink-0 mt-0.5', iconStyles[toast.type])
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/toast/index.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-semibold text-sm",
                        children: toast.title
                    }, void 0, false, {
                        fileName: "[project]/packages/ui/src/toast/index.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    toast.message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm opacity-90 mt-1",
                        children: toast.message
                    }, void 0, false, {
                        fileName: "[project]/packages/ui/src/toast/index.tsx",
                        lineNumber: 59,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/packages/ui/src/toast/index.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onClose,
                className: "flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity",
                "aria-label": "Close notification",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/packages/ui/src/toast/index.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/toast/index.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/packages/ui/src/toast/index.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
_s(ToastItem, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ToastItem;
function ToastContainer() {
    _s1();
    const { toasts, removeToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$toast$2f$useToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-md pointer-events-none",
        "aria-live": "polite",
        "aria-atomic": "true",
        children: toasts.map((toast)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastItem, {
                    toast: toast,
                    onClose: ()=>removeToast(toast.id)
                }, void 0, false, {
                    fileName: "[project]/packages/ui/src/toast/index.tsx",
                    lineNumber: 85,
                    columnNumber: 11
                }, this)
            }, toast.id, false, {
                fileName: "[project]/packages/ui/src/toast/index.tsx",
                lineNumber: 84,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/packages/ui/src/toast/index.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}
_s1(ToastContainer, "hDKWezg0iwBHWd7k0YqUAkfEZE4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$toast$2f$useToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c1 = ToastContainer;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "ToastItem");
__turbopack_context__.k.register(_c1, "ToastContainer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/toast/index.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastContainer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$toast$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ToastContainer"],
    "toast",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$toast$2f$useToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"],
    "useToast",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$toast$2f$useToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$toast$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/toast/index.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$toast$2f$useToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/toast/useToast.ts [app-client] (ecmascript)");
}),
"[project]/apps/admin/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryProvider",
    ()=>QueryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.2_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const createClient = ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
        defaultOptions: {
            queries: {
                staleTime: 30_000,
                refetchOnWindowFocus: false
            }
        }
    });
function QueryProvider({ children }) {
    _s();
    const [client] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(createClient);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: client,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/admin/app/providers.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, this);
}
_s(QueryProvider, "Uiacsy9L3pb/Ss83ckGeYvMOFMU=");
_c = QueryProvider;
var _c;
__turbopack_context__.k.register(_c, "QueryProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/api-client/src/auth/useAuth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuth",
    ()=>useAuth,
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$19$2e$3$2e$0$2d$canary$2d$3025aa39$2d$20251007$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@4.5.7_@types+react@18.3.26_react@19.3.0-canary-3025aa39-20251007/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$19$2e$3$2e$0$2d$canary$2d$3025aa39$2d$20251007$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@4.5.7_@types+react@18.3.26_react@19.3.0-canary-3025aa39-20251007/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8000/api") || 'http://localhost:8000/api';
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$19$2e$3$2e$0$2d$canary$2d$3025aa39$2d$20251007$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$19$2e$3$2e$0$2d$canary$2d$3025aa39$2d$20251007$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: async (username, password)=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        password,
                        device_name: 'web'
                    })
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Login failed');
                }
                if (data.success) {
                    set({
                        token: data.data.token,
                        user: data.data.user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });
                }
            } catch (error) {
                set({
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Login failed'
                });
                throw error;
            }
        },
        logout: async ()=>{
            const { token } = get();
            if (token) {
                try {
                    await fetch(`${API_BASE_URL}/auth/logout`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                } catch (error) {
                    console.error('Logout request failed:', error);
                }
            }
            set({
                token: null,
                user: null,
                isAuthenticated: false,
                error: null
            });
        },
        setUser: (user)=>{
            set({
                user,
                isAuthenticated: true
            });
        },
        setToken: (token)=>{
            set({
                token
            });
        },
        clearAuth: ()=>{
            set({
                token: null,
                user: null,
                isAuthenticated: false,
                error: null
            });
        },
        fetchUser: async ()=>{
            const { token } = get();
            if (!token) {
                return;
            }
            set({
                isLoading: true
            });
            try {
                const response = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }
                if (data.success) {
                    set({
                        user: data.data,
                        isAuthenticated: true,
                        isLoading: false
                    });
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                set({
                    isLoading: false,
                    token: null,
                    user: null,
                    isAuthenticated: false
                });
            }
        }
    }), {
    name: 'auth-storage',
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$19$2e$3$2e$0$2d$canary$2d$3025aa39$2d$20251007$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
    partialize: (state)=>({
            token: state.token,
            user: state.user,
            isAuthenticated: state.isAuthenticated
        }),
    onRehydrateStorage: ()=>(state)=>{
            // Ensure isAuthenticated is set correctly after rehydration
            if (state?.token && state?.user) {
                state.isAuthenticated = true;
            }
        }
}));
function useAuth() {
    _s();
    return useAuthStore();
}
_s(useAuth, "BSK3XewfuZPixDP8tbzcobpulFc=", false, function() {
    return [
        useAuthStore
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/admin/components/auth-guard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthGuard",
    ()=>AuthGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2d$client$2f$src$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api-client/src/auth/useAuth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const PUBLIC_ROUTES = [
    '/login'
];
function AuthGuard({ children }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { isAuthenticated, isLoading, token } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2d$client$2f$src$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const isPublicRoute = PUBLIC_ROUTES.some((route)=>pathname?.startsWith(route));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthGuard.useEffect": ()=>{
            // Don't redirect during initial load
            if (isLoading) return;
            // If not on a public route and not authenticated, redirect to login
            if (!isPublicRoute && !isAuthenticated) {
                router.push(`/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`);
            }
            // If on login page and authenticated, redirect to dashboard
            if (pathname === '/login' && isAuthenticated) {
                router.push('/dashboard');
            }
        }
    }["AuthGuard.useEffect"], [
        isAuthenticated,
        isLoading,
        isPublicRoute,
        pathname,
        router
    ]);
    // Show loading state while checking auth
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-muted/20",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    }, void 0, false, {
                        fileName: "[project]/apps/admin/components/auth-guard.tsx",
                        lineNumber: 40,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-sm text-muted-foreground",
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/apps/admin/components/auth-guard.tsx",
                        lineNumber: 41,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/admin/components/auth-guard.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/admin/components/auth-guard.tsx",
            lineNumber: 38,
            columnNumber: 7
        }, this);
    }
    // Show loading state while redirecting unauthenticated users
    if (!isPublicRoute && !isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-muted/20",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    }, void 0, false, {
                        fileName: "[project]/apps/admin/components/auth-guard.tsx",
                        lineNumber: 52,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-sm text-muted-foreground",
                        children: "Redirecting to login..."
                    }, void 0, false, {
                        fileName: "[project]/apps/admin/components/auth-guard.tsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/admin/components/auth-guard.tsx",
                lineNumber: 51,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/admin/components/auth-guard.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(AuthGuard, "+/R02HM8YA5gf6rHV1OeyV96b8s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2d$client$2f$src$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = AuthGuard;
var _c;
__turbopack_context__.k.register(_c, "AuthGuard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/cn.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground",
            secondary: "border-transparent bg-secondary text-secondary-foreground",
            outline: "border-border bg-transparent text-foreground",
            success: "border-transparent bg-success text-success-foreground",
            warning: "border-transparent bg-warning text-warning-foreground",
            destructive: "border-transparent bg-destructive text-destructive-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Badge = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui/src/components/badge.tsx",
        lineNumber: 29,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Badge;
Badge.displayName = "Badge";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Badge$React.forwardRef");
__turbopack_context__.k.register(_c1, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$3_$40$types$2b$react$40$18$2e$3$2e$26_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.2.3_@types+react@18.3.26_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/cn.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
            outline: "border border-input bg-background hover:bg-muted hover:text-foreground",
            ghost: "hover:bg-muted hover:text-foreground",
            destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$3_$40$types$2b$react$40$18$2e$3$2e$26_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui/src/components/button.tsx",
        lineNumber: 39,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/separator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Separator",
    ()=>Separator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/cn.ts [app-client] (ecmascript)");
;
;
function Separator({ className, orientation = "horizontal", decorative = true, role, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: decorative ? "presentation" : role ?? "separator",
        "aria-orientation": orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui/src/components/separator.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = Separator;
var _c;
__turbopack_context__.k.register(_c, "Separator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/api-client/src/tenant/useTenant.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTenantStore",
    ()=>useTenantStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$19$2e$3$2e$0$2d$canary$2d$3025aa39$2d$20251007$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@4.5.7_@types+react@18.3.26_react@19.3.0-canary-3025aa39-20251007/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$19$2e$3$2e$0$2d$canary$2d$3025aa39$2d$20251007$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@4.5.7_@types+react@18.3.26_react@19.3.0-canary-3025aa39-20251007/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8000/api") || 'http://localhost:8000/api';
const useTenantStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$19$2e$3$2e$0$2d$canary$2d$3025aa39$2d$20251007$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$19$2e$3$2e$0$2d$canary$2d$3025aa39$2d$20251007$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        currentTenant: null,
        availableTenants: [],
        isLoading: false,
        error: null,
        setCurrentTenant: (tenant)=>{
            set({
                currentTenant: tenant,
                error: null
            });
        },
        setAvailableTenants: (tenants)=>{
            set({
                availableTenants: tenants
            });
        },
        fetchTenants: async (token)=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                const response = await fetch(`${API_BASE_URL}/admin/universities`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch universities');
                }
                const result = await response.json();
                const universities = result.data || result;
                // Convert to University format
                const tenants = Array.isArray(universities) ? universities.map((u)=>({
                        id: u.id,
                        name: u.name,
                        slug: u.slug,
                        domain: u.domain,
                        status: u.status
                    })) : [];
                set({
                    availableTenants: tenants,
                    isLoading: false,
                    error: null
                });
                // Auto-select first tenant if none selected
                const currentTenant = get().currentTenant;
                if (!currentTenant && tenants.length > 0) {
                    set({
                        currentTenant: tenants[0]
                    });
                }
            } catch (error) {
                set({
                    error: error instanceof Error ? error.message : 'Failed to fetch tenants',
                    isLoading: false
                });
            }
        },
        clearTenant: ()=>{
            set({
                currentTenant: null,
                availableTenants: [],
                error: null
            });
        }
    }), {
    name: 'tenant-storage',
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$19$2e$3$2e$0$2d$canary$2d$3025aa39$2d$20251007$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
    partialize: (state)=>({
            currentTenant: state.currentTenant
        })
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/admin/components/tenant-switcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TenantSwitcher",
    ()=>TenantSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.446.0_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.446.0_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.446.0_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.446.0_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/cn.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2d$client$2f$src$2f$tenant$2f$useTenant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api-client/src/tenant/useTenant.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2d$client$2f$src$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api-client/src/auth/useAuth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function TenantSwitcher({ open, onOpenChange }) {
    _s();
    const { token } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2d$client$2f$src$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const { currentTenant, availableTenants, isLoading, setCurrentTenant, fetchTenants } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2d$client$2f$src$2f$tenant$2f$useTenant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTenantStore"])();
    // Fetch tenants when dialog opens
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TenantSwitcher.useEffect": ()=>{
            if (open && token && availableTenants.length === 0) {
                fetchTenants(token);
            }
        }
    }["TenantSwitcher.useEffect"], [
        open,
        token
    ]);
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/50",
                onClick: ()=>onOpenChange(false)
            }, void 0, false, {
                fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-semibold",
                                        children: "Switch University Context"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                                        lineNumber: 50,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onOpenChange(false),
                                        className: "rounded-md p-2 hover:bg-muted",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                                            lineNumber: 55,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                                        lineNumber: 51,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-sm text-muted-foreground",
                                children: "Select a university to manage. Your view will be filtered to show only data for the selected institution."
                            }, void 0, false, {
                                fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center py-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "h-6 w-6 animate-spin text-muted-foreground"
                                }, void 0, false, {
                                    fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                                    lineNumber: 67,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-2 text-sm text-muted-foreground",
                                    children: "Loading universities..."
                                }, void 0, false, {
                                    fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                                    lineNumber: 68,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                            lineNumber: 66,
                            columnNumber: 13
                        }, this) : availableTenants.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "py-8 text-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground",
                                children: "No universities found"
                            }, void 0, false, {
                                fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                                lineNumber: 72,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                            lineNumber: 71,
                            columnNumber: 13
                        }, this) : availableTenants.map((university)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setCurrentTenant(university);
                                    onOpenChange(false);
                                },
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-muted', currentTenant?.id === university.id && 'border-primary bg-primary/5'),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                            className: "h-5 w-5 text-primary"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                                            lineNumber: 88,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                                        lineNumber: 87,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium",
                                                children: university.name
                                            }, void 0, false, {
                                                fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                                                lineNumber: 91,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: university.slug
                                            }, void 0, false, {
                                                fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                                                lineNumber: 92,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                                        lineNumber: 90,
                                        columnNumber: 17
                                    }, this),
                                    currentTenant?.id === university.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                        className: "h-5 w-5 text-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                                        lineNumber: 95,
                                        columnNumber: 19
                                    }, this),
                                    university.status !== 'live' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800",
                                        children: university.status
                                    }, void 0, false, {
                                        fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                                        lineNumber: 98,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, university.id, true, {
                                fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                                lineNumber: 76,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 flex justify-end gap-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: ()=>onOpenChange(false),
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/admin/components/tenant-switcher.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_s(TenantSwitcher, "bocjdft3GohFxrdlSwwJZUit5R8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2d$client$2f$src$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2d$client$2f$src$2f$tenant$2f$useTenant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTenantStore"]
    ];
});
_c = TenantSwitcher;
var _c;
__turbopack_context__.k.register(_c, "TenantSwitcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/admin/components/app-shell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppShell",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/cn.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/separator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2d$client$2f$src$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api-client/src/auth/useAuth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$components$2f$tenant$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/admin/components/tenant-switcher.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
const sections = [
    {
        title: "Operations",
        items: [
            {
                href: "/dashboard",
                label: "Dashboard"
            },
            {
                href: "/universities",
                label: "Universities"
            },
            {
                href: "/feature-toggles",
                label: "Feature toggles",
                badge: "Live"
            },
            {
                href: "/change-requests",
                label: "Change requests"
            }
        ]
    },
    {
        title: "Finance",
        items: [
            {
                href: "/billing",
                label: "Billing"
            },
            {
                href: "/invoices",
                label: "Invoices"
            }
        ]
    },
    {
        title: "Governance",
        items: [
            {
                href: "/audit-log",
                label: "Audit log"
            },
            {
                href: "/backups",
                label: "Backups"
            }
        ]
    }
];
function AppShell({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2d$client$2f$src$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const [showTenantSwitcher, setShowTenantSwitcher] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Don't show app shell for login page
    if (pathname === '/login' || !isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen bg-muted/20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "hidden w-72 shrink-0 border-r border-border bg-surface lg:flex lg:flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3 px-6 py-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs uppercase tracking-wide text-muted-foreground",
                                        children: "Bitflow Nova"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/admin/components/app-shell.tsx",
                                        lineNumber: 58,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-lg font-semibold",
                                        children: "Central Operations"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/admin/components/app-shell.tsx",
                                        lineNumber: 59,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/admin/components/app-shell.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "outline",
                                children: "v0.1"
                            }, void 0, false, {
                                fileName: "[project]/apps/admin/components/app-shell.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/admin/components/app-shell.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {}, void 0, false, {
                        fileName: "[project]/apps/admin/components/app-shell.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "flex-1 space-y-8 px-6 py-6",
                        children: sections.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
                                        children: section.title
                                    }, void 0, false, {
                                        fileName: "[project]/apps/admin/components/app-shell.tsx",
                                        lineNumber: 67,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "space-y-1",
                                        children: section.items.map((item)=>{
                                            const active = pathname === item.href;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: item.href,
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors", active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: item.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/admin/components/app-shell.tsx",
                                                            lineNumber: 84,
                                                            columnNumber: 25
                                                        }, this),
                                                        item.badge ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: "secondary",
                                                            children: item.badge
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/admin/components/app-shell.tsx",
                                                            lineNumber: 85,
                                                            columnNumber: 39
                                                        }, this) : null
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/admin/components/app-shell.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 23
                                                }, this)
                                            }, item.href, false, {
                                                fileName: "[project]/apps/admin/components/app-shell.tsx",
                                                lineNumber: 74,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/apps/admin/components/app-shell.tsx",
                                        lineNumber: 70,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, section.title, true, {
                                fileName: "[project]/apps/admin/components/app-shell.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/admin/components/app-shell.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-6 pb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            className: "w-full",
                            variant: "secondary",
                            onClick: ()=>setShowTenantSwitcher(true),
                            children: "Switch tenant"
                        }, void 0, false, {
                            fileName: "[project]/apps/admin/components/app-shell.tsx",
                            lineNumber: 95,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/admin/components/app-shell.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/admin/components/app-shell.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "flex h-16 items-center justify-between border-b border-border bg-surface/95 px-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs uppercase tracking-wide text-muted-foreground",
                                        children: "Today"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/admin/components/app-shell.tsx",
                                        lineNumber: 108,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-lg font-semibold",
                                        children: "Tuesday, 7 October 2025"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/admin/components/app-shell.tsx",
                                        lineNumber: 109,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/admin/components/app-shell.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        children: "Support"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/admin/components/app-shell.tsx",
                                        lineNumber: 112,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        children: "Provision university"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/admin/components/app-shell.tsx",
                                        lineNumber: 113,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/admin/components/app-shell.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/admin/components/app-shell.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 overflow-y-auto px-6 py-10",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/apps/admin/components/app-shell.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/admin/components/app-shell.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$components$2f$tenant$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TenantSwitcher"], {
                open: showTenantSwitcher,
                onOpenChange: setShowTenantSwitcher
            }, void 0, false, {
                fileName: "[project]/apps/admin/components/app-shell.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/admin/components/app-shell.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_s(AppShell, "KuD8/zCTCk/VXJsmXNC5Ol6e2rg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2d$client$2f$src$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = AppShell;
var _c;
__turbopack_context__.k.register(_c, "AppShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_68cc2a7f._.js.map