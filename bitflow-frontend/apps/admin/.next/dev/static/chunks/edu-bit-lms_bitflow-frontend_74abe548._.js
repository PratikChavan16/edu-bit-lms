(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Card Component
 * 
 * Glassmorphic card component matching the design
 * Creates frosted glass effect with backdrop blur
 */ __turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef(_c = ({ className, variant = 'default', padding = 'md', children, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('rounded-3xl transition-all duration-200', {
            // Default variant - white background with dark text
            'bg-white shadow-2xl': variant === 'default',
            // Glass variant (glassmorphic style) - transparent with inherited text
            'bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl': variant === 'glass'
        }, {
            'p-0': padding === 'none',
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg'
        }, className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Card.tsx",
        lineNumber: 19,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Card;
Card.displayName = 'Card';
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef(_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col space-y-1.5 pb-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Card.tsx",
        lineNumber: 54,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CardHeader;
CardHeader.displayName = 'CardHeader';
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef(_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-2xl font-semibold leading-none tracking-tight', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Card.tsx",
        lineNumber: 66,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CardTitle;
CardTitle.displayName = 'CardTitle';
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef(_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Card.tsx",
        lineNumber: 78,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CardDescription;
CardDescription.displayName = 'CardDescription';
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef(_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('pt-0', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Card.tsx",
        lineNumber: 90,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CardContent;
CardContent.displayName = 'CardContent';
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef(_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center pt-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Card.tsx",
        lineNumber: 98,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = CardFooter;
CardFooter.displayName = 'CardFooter';
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
__turbopack_context__.k.register(_c10, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c11, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Table",
    ()=>Table,
    "TableBody",
    ()=>TableBody,
    "TableCaption",
    ()=>TableCaption,
    "TableCell",
    ()=>TableCell,
    "TableHead",
    ()=>TableHead,
    "TableHeader",
    ()=>TableHeader,
    "TableRow",
    ()=>TableRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/lib/cn.ts [app-client] (ecmascript)");
;
;
;
const Table = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full overflow-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full caption-bottom text-sm", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx",
            lineNumber: 6,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx",
        lineNumber: 5,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Table;
Table.displayName = "Table";
const TableHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-xs uppercase", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx",
        lineNumber: 12,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = TableHeader;
TableHeader.displayName = "TableHeader";
const TableBody = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr:last-child]:border-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx",
        lineNumber: 17,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = TableBody;
TableBody.displayName = "TableBody";
const TableRow = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-b border-border transition-colors", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx",
        lineNumber: 22,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = TableRow;
TableRow.displayName = "TableRow";
const TableHead = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-3 text-left font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx",
        lineNumber: 31,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = TableHead;
TableHead.displayName = "TableHead";
const TableCell = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-3 align-middle", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx",
        lineNumber: 40,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = TableCell;
TableCell.displayName = "TableCell";
const TableCaption = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c12 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("caption", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-4 text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx",
        lineNumber: 45,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c13 = TableCaption;
TableCaption.displayName = "TableCaption";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13;
__turbopack_context__.k.register(_c, "Table$React.forwardRef");
__turbopack_context__.k.register(_c1, "Table");
__turbopack_context__.k.register(_c2, "TableHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "TableHeader");
__turbopack_context__.k.register(_c4, "TableBody$React.forwardRef");
__turbopack_context__.k.register(_c5, "TableBody");
__turbopack_context__.k.register(_c6, "TableRow$React.forwardRef");
__turbopack_context__.k.register(_c7, "TableRow");
__turbopack_context__.k.register(_c8, "TableHead$React.forwardRef");
__turbopack_context__.k.register(_c9, "TableHead");
__turbopack_context__.k.register(_c10, "TableCell$React.forwardRef");
__turbopack_context__.k.register(_c11, "TableCell");
__turbopack_context__.k.register(_c12, "TableCaption$React.forwardRef");
__turbopack_context__.k.register(_c13, "TableCaption");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Input Component
 * 
 * Based on the glassmorphic design with rounded, frosted inputs
 * Supports various types and states
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const Input = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ label, error, helperText, leftIcon, rightIcon, variant = 'default', className, type = 'text', ...props }, ref)=>{
    _s();
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "block text-sm font-medium mb-2",
                children: [
                    label,
                    props.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-red-500 ml-1",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                        lineNumber: 46,
                        columnNumber: 32
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                lineNumber: 44,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    leftIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400",
                        children: leftIcon
                    }, void 0, false, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                        lineNumber: 51,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: ref,
                        type: inputType,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full px-6 py-3 rounded-full transition-all duration-300', 'focus:outline-none focus:ring-2 focus:ring-white/30', 'placeholder:text-gray-400', {
                            // Glass variant (matches design)
                            'bg-white/90 backdrop-blur-sm text-gray-700': variant === 'glass',
                            'hover:bg-white/95': variant === 'glass',
                            // Default variant
                            'bg-white border border-gray-300 text-gray-900': variant === 'default',
                            'hover:border-gray-400': variant === 'default',
                            // Error state
                            'border-red-500 focus:ring-red-500': error,
                            // Icon padding
                            'pl-12': leftIcon,
                            'pr-12': rightIcon || isPassword
                        }, className),
                        ...props
                    }, void 0, false, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                        lineNumber: 55,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    isPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setShowPassword(!showPassword),
                        className: "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",
                        children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-5 w-5",
                            viewBox: "0 0 20 20",
                            fill: "currentColor",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M10 12a2 2 0 100-4 2 2 0 000 4z"
                                }, void 0, false, {
                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                                    lineNumber: 95,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    fillRule: "evenodd",
                                    d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
                                    clipRule: "evenodd"
                                }, void 0, false, {
                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                                    lineNumber: 96,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                            lineNumber: 89,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-5 w-5",
                            viewBox: "0 0 20 20",
                            fill: "currentColor",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    fillRule: "evenodd",
                                    d: "M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z",
                                    clipRule: "evenodd"
                                }, void 0, false, {
                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                                    lineNumber: 109,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                                }, void 0, false, {
                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                                    lineNumber: 114,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                            lineNumber: 103,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                        lineNumber: 83,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    rightIcon && !isPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400",
                        children: rightIcon
                    }, void 0, false, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                        lineNumber: 120,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-sm text-red-400",
                children: error
            }, void 0, false, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                lineNumber: 125,
                columnNumber: 19
            }, ("TURBOPACK compile-time value", void 0)),
            helperText && !error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-sm text-gray-400",
                children: helperText
            }, void 0, false, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                lineNumber: 127,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
        lineNumber: 42,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
}, "daguiRHWMFkqPgCh/ppD7CF5VuQ=")), "daguiRHWMFkqPgCh/ppD7CF5VuQ=");
_c1 = Input;
Input.displayName = 'Input';
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$forwardRef");
__turbopack_context__.k.register(_c1, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DepartmentsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+react-query@5.90.2_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+react-query@5.90.2_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+react-query@5.90.2_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx [app-client] (ecmascript)");
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
const statusMap = {
    active: "success",
    inactive: "secondary"
};
function DepartmentsPage() {
    _s();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [collegeFilter, setCollegeFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Fetch departments from API
    const { data: departments = [], isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'departments',
            searchQuery,
            collegeFilter
        ],
        queryFn: {
            "DepartmentsPage.useQuery": async ()=>{
                // TODO: Replace with actual API endpoint
                // const response = await fetch(`/api/departments?search=${searchQuery}&college=${collegeFilter}`);
                // return response.json();
                // Mock data for now
                return [
                    {
                        id: "1",
                        name: "Computer Science & Engineering",
                        code: "CSE",
                        college_id: "1",
                        college_name: "MVP Engineering College",
                        head_of_department: "Dr. Rajesh Kumar",
                        status: "active",
                        faculty_count: 25,
                        students_count: 450,
                        created_at: "2024-01-15"
                    },
                    {
                        id: "2",
                        name: "Mechanical Engineering",
                        code: "MECH",
                        college_id: "1",
                        college_name: "MVP Engineering College",
                        head_of_department: "Dr. Priya Sharma",
                        status: "active",
                        faculty_count: 18,
                        students_count: 320,
                        created_at: "2024-01-15"
                    },
                    {
                        id: "3",
                        name: "Business Administration",
                        code: "BA",
                        college_id: "3",
                        college_name: "Greenfield Business Institute",
                        head_of_department: "Prof. Amit Verma",
                        status: "active",
                        faculty_count: 15,
                        students_count: 280,
                        created_at: "2024-03-10"
                    },
                    {
                        id: "4",
                        name: "English Literature",
                        code: "ENG",
                        college_id: "2",
                        college_name: "Stellar Arts & Science College",
                        head_of_department: "Dr. Sarah Johnson",
                        status: "active",
                        faculty_count: 12,
                        students_count: 180,
                        created_at: "2024-02-20"
                    },
                    {
                        id: "5",
                        name: "Electronics Engineering",
                        code: "ECE",
                        college_id: "1",
                        college_name: "MVP Engineering College",
                        head_of_department: "Dr. Suresh Reddy",
                        status: "inactive",
                        faculty_count: 8,
                        students_count: 120,
                        created_at: "2024-01-15"
                    }
                ];
            }
        }["DepartmentsPage.useQuery"]
    });
    // Delete mutation
    const deleteMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "DepartmentsPage.useMutation[deleteMutation]": async (id)=>{
                // TODO: Replace with actual API endpoint
                // await fetch(`/api/departments/${id}`, { method: 'DELETE' });
                console.log('Delete department:', id);
            }
        }["DepartmentsPage.useMutation[deleteMutation]"],
        onSuccess: {
            "DepartmentsPage.useMutation[deleteMutation]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'departments'
                    ]
                });
            }
        }["DepartmentsPage.useMutation[deleteMutation]"]
    });
    const handleDelete = (id)=>{
        if (window.confirm('Are you sure you want to delete this department?')) {
            deleteMutation.mutate(id);
        }
    };
    // Loading state
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-muted-foreground",
                children: "Loading departments..."
            }, void 0, false, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                lineNumber: 131,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
            lineNumber: 130,
            columnNumber: 7
        }, this);
    }
    // Error state
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-red-500",
                children: "Error loading departments. Please try again."
            }, void 0, false, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                lineNumber: 140,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
            lineNumber: 139,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col justify-between gap-4 sm:flex-row sm:items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-semibold",
                                children: "Departments"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-muted-foreground",
                                children: "Manage departments across all colleges."
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "secondary",
                                children: "Import CSV"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>window.location.href = '/departments/create',
                                children: "Add Department"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "pt-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-4 md:flex-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                type: "text",
                                placeholder: "Search departments by name or code...",
                                value: searchQuery,
                                onChange: (e)=>setSearchQuery(e.target.value),
                                className: "flex-1"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                lineNumber: 164,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: collegeFilter,
                                onChange: (e)=>setCollegeFilter(e.target.value),
                                className: "flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "All Colleges"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                        lineNumber: 176,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "1",
                                        children: "MVP Engineering College"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                        lineNumber: 177,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "2",
                                        children: "Stellar Arts & Science College"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                        lineNumber: 178,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "3",
                                        children: "Greenfield Business Institute"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                        lineNumber: 179,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "secondary",
                                children: "Search"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                lineNumber: 181,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                        lineNumber: 163,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                    lineNumber: 162,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                children: "Departments Overview"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                lineNumber: 189,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: "All departments in the system with their details."
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                lineNumber: 190,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                        lineNumber: 188,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                children: "Department Name"
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                lineNumber: 196,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                children: "Code"
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                lineNumber: 197,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                children: "College"
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                lineNumber: 198,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                children: "Head of Department"
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                lineNumber: 199,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                lineNumber: 200,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                className: "text-right",
                                                children: "Faculty"
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                lineNumber: 201,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                className: "text-right",
                                                children: "Students"
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                lineNumber: 202,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                className: "text-right",
                                                children: "Actions"
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                lineNumber: 203,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                        lineNumber: 195,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                    lineNumber: 194,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                                    children: departments.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            colSpan: 8,
                                            className: "text-center text-muted-foreground",
                                            children: "No departments found."
                                        }, void 0, false, {
                                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                            lineNumber: 209,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                        lineNumber: 208,
                                        columnNumber: 17
                                    }, this) : departments.map((department)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                            className: "hover:bg-muted/40",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    className: "font-medium",
                                                    children: department.name
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    className: "text-muted-foreground",
                                                    children: department.code
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                    lineNumber: 217,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    className: "text-sm",
                                                    children: department.college_name
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    className: "text-sm",
                                                    children: department.head_of_department || "—"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                    lineNumber: 221,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                        variant: statusMap[department.status] ?? "secondary",
                                                        children: department.status
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                        lineNumber: 225,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                    lineNumber: 224,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    className: "text-right",
                                                    children: department.faculty_count || 0
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    className: "text-right",
                                                    children: department.students_count || 0
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                    lineNumber: 230,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    className: "text-right",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-end gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                variant: "secondary",
                                                                size: "sm",
                                                                onClick: ()=>window.location.href = `/departments/${department.id}/edit`,
                                                                children: "Edit"
                                                            }, void 0, false, {
                                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                                lineNumber: 233,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                variant: "danger",
                                                                size: "sm",
                                                                onClick: ()=>handleDelete(department.id),
                                                                disabled: deleteMutation.isPending,
                                                                children: "Delete"
                                                            }, void 0, false, {
                                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                                lineNumber: 240,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                        lineNumber: 232,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                                    lineNumber: 231,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, department.id, true, {
                                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                            lineNumber: 215,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                                    lineNumber: 206,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                            lineNumber: 193,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/departments/page.tsx",
        lineNumber: 146,
        columnNumber: 5
    }, this);
}
_s(DepartmentsPage, "1C7XA7e2OAqAnDrUXONITnjgNaE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
_c = DepartmentsPage;
var _c;
__turbopack_context__.k.register(_c, "DepartmentsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=edu-bit-lms_bitflow-frontend_74abe548._.js.map