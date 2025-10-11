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
"[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FacultyPage
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
    inactive: "secondary",
    on_leave: "warning"
};
function FacultyPage() {
    _s();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [departmentFilter, setDepartmentFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [collegeFilter, setCollegeFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Fetch faculty from API
    const { data: faculty = [], isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'faculty',
            searchQuery,
            departmentFilter,
            collegeFilter
        ],
        queryFn: {
            "FacultyPage.useQuery": async ()=>{
                // TODO: Replace with actual API endpoint
                // const response = await fetch(`/api/faculty?search=${searchQuery}&department=${departmentFilter}&college=${collegeFilter}`);
                // return response.json();
                // Mock data for now
                return [
                    {
                        id: "1",
                        employee_id: "FAC001",
                        first_name: "Rajesh",
                        last_name: "Kumar",
                        email: "rajesh.kumar@mvp.edu",
                        phone: "+91 98765 43210",
                        department_id: "1",
                        department_name: "Computer Science & Engineering",
                        college_name: "MVP Engineering College",
                        designation: "Professor",
                        qualifications: "Ph.D. in Computer Science",
                        experience_years: 15,
                        specialization: "Machine Learning, AI",
                        date_of_birth: "1978-05-15",
                        gender: "male",
                        date_of_joining: "2010-07-01",
                        salary: 85000,
                        status: "active",
                        created_at: "2010-07-01"
                    },
                    {
                        id: "2",
                        employee_id: "FAC002",
                        first_name: "Priya",
                        last_name: "Sharma",
                        email: "priya.sharma@mvp.edu",
                        phone: "+91 98765 43211",
                        department_id: "2",
                        department_name: "Mechanical Engineering",
                        college_name: "MVP Engineering College",
                        designation: "Associate Professor",
                        qualifications: "Ph.D. in Mechanical Engineering",
                        experience_years: 12,
                        specialization: "Robotics, Automation",
                        date_of_birth: "1982-08-20",
                        gender: "female",
                        date_of_joining: "2013-08-15",
                        salary: 75000,
                        status: "active",
                        created_at: "2013-08-15"
                    },
                    {
                        id: "3",
                        employee_id: "FAC003",
                        first_name: "Amit",
                        last_name: "Verma",
                        email: "amit.verma@greenfield.edu",
                        phone: "+91 98765 43212",
                        department_id: "3",
                        department_name: "Business Administration",
                        college_name: "Greenfield Business Institute",
                        designation: "Assistant Professor",
                        qualifications: "MBA, Ph.D. in Management",
                        experience_years: 8,
                        specialization: "Marketing, Strategy",
                        date_of_birth: "1985-03-10",
                        gender: "male",
                        date_of_joining: "2017-06-01",
                        salary: 65000,
                        status: "active",
                        created_at: "2017-06-01"
                    },
                    {
                        id: "4",
                        employee_id: "FAC004",
                        first_name: "Sarah",
                        last_name: "Johnson",
                        email: "sarah.johnson@stellar.edu",
                        phone: "+91 98765 43213",
                        department_id: "4",
                        department_name: "English Literature",
                        college_name: "Stellar Arts & Science College",
                        designation: "Senior Lecturer",
                        qualifications: "M.A., Ph.D. in English Literature",
                        experience_years: 10,
                        specialization: "Victorian Literature, Poetry",
                        date_of_birth: "1983-11-25",
                        gender: "female",
                        date_of_joining: "2015-01-10",
                        salary: 55000,
                        status: "on_leave",
                        created_at: "2015-01-10"
                    },
                    {
                        id: "5",
                        employee_id: "FAC005",
                        first_name: "Suresh",
                        last_name: "Reddy",
                        email: "suresh.reddy@mvp.edu",
                        phone: "+91 98765 43214",
                        department_id: "5",
                        department_name: "Electronics Engineering",
                        college_name: "MVP Engineering College",
                        designation: "Lecturer",
                        qualifications: "M.Tech in Electronics",
                        experience_years: 5,
                        specialization: "VLSI Design, Embedded Systems",
                        date_of_birth: "1988-07-18",
                        gender: "male",
                        date_of_joining: "2020-08-01",
                        salary: 45000,
                        status: "inactive",
                        created_at: "2020-08-01"
                    },
                    {
                        id: "6",
                        employee_id: "FAC006",
                        first_name: "Anita",
                        last_name: "Desai",
                        email: "anita.desai@stellar.edu",
                        phone: "+91 98765 43215",
                        department_id: "4",
                        department_name: "English Literature",
                        college_name: "Stellar Arts & Science College",
                        designation: "Assistant Professor",
                        qualifications: "M.A., M.Phil in English",
                        experience_years: 6,
                        specialization: "Modern Literature, Linguistics",
                        date_of_birth: "1987-02-14",
                        gender: "female",
                        date_of_joining: "2019-07-15",
                        salary: 50000,
                        status: "active",
                        created_at: "2019-07-15"
                    }
                ];
            }
        }["FacultyPage.useQuery"]
    });
    // Delete mutation
    const deleteMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "FacultyPage.useMutation[deleteMutation]": async (id)=>{
                // TODO: Replace with actual API endpoint
                // await fetch(`/api/faculty/${id}`, { method: 'DELETE' });
                console.log('Delete faculty:', id);
            }
        }["FacultyPage.useMutation[deleteMutation]"],
        onSuccess: {
            "FacultyPage.useMutation[deleteMutation]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'faculty'
                    ]
                });
            }
        }["FacultyPage.useMutation[deleteMutation]"]
    });
    const handleDelete = (id)=>{
        if (window.confirm('Are you sure you want to delete this faculty member?')) {
            deleteMutation.mutate(id);
        }
    };
    // Loading state
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-muted-foreground",
                children: "Loading faculty..."
            }, void 0, false, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                lineNumber: 208,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
            lineNumber: 207,
            columnNumber: 7
        }, this);
    }
    // Error state
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-red-500",
                children: "Error loading faculty. Please try again."
            }, void 0, false, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                lineNumber: 217,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
            lineNumber: 216,
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
                                children: "Faculty Management"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-muted-foreground",
                                children: "Manage faculty members across all departments and colleges."
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                lineNumber: 227,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "secondary",
                                children: "Import CSV"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                lineNumber: 230,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "secondary",
                                children: "Export"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                lineNumber: 231,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>window.location.href = '/faculty/create',
                                children: "Add Faculty"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                lineNumber: 232,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                        lineNumber: 229,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                lineNumber: 224,
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
                                placeholder: "Search by name, email, or employee ID...",
                                value: searchQuery,
                                onChange: (e)=>setSearchQuery(e.target.value),
                                className: "flex-1"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                lineNumber: 242,
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
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                        lineNumber: 254,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "1",
                                        children: "MVP Engineering College"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                        lineNumber: 255,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "2",
                                        children: "Stellar Arts & Science College"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                        lineNumber: 256,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "3",
                                        children: "Greenfield Business Institute"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                        lineNumber: 257,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                lineNumber: 249,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: departmentFilter,
                                onChange: (e)=>setDepartmentFilter(e.target.value),
                                className: "flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "All Departments"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                        lineNumber: 264,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "1",
                                        children: "Computer Science & Engineering"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                        lineNumber: 265,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "2",
                                        children: "Mechanical Engineering"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                        lineNumber: 266,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "3",
                                        children: "Business Administration"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                        lineNumber: 267,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "4",
                                        children: "English Literature"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                        lineNumber: 268,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "5",
                                        children: "Electronics Engineering"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                        lineNumber: 269,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                lineNumber: 259,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "secondary",
                                children: "Search"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                lineNumber: 271,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                        lineNumber: 241,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                    lineNumber: 240,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                lineNumber: 239,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                children: "Faculty Overview"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: [
                                    "All faculty members with their details. Total: ",
                                    faculty.length,
                                    " faculty"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                lineNumber: 280,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    className: "w-[100px]",
                                                    children: "Employee ID"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                    lineNumber: 289,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    className: "w-[150px]",
                                                    children: "Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                    lineNumber: 290,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    className: "w-[200px]",
                                                    children: "Email"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    className: "w-[130px]",
                                                    children: "Phone"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                    lineNumber: 292,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    className: "w-[180px]",
                                                    children: "Department"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                    lineNumber: 293,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    className: "w-[180px]",
                                                    children: "College"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    className: "w-[130px]",
                                                    children: "Designation"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                    lineNumber: 295,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    className: "w-[180px]",
                                                    children: "Qualifications"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                    lineNumber: 296,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    className: "w-[120px] text-right",
                                                    children: "Experience"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                    lineNumber: 297,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    className: "w-[100px]",
                                                    children: "Status"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                    lineNumber: 298,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    className: "w-[150px] text-right",
                                                    children: "Actions"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                    lineNumber: 299,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                            lineNumber: 288,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                        lineNumber: 287,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                                        children: faculty.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                colSpan: 11,
                                                className: "text-center text-muted-foreground",
                                                children: "No faculty members found."
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                lineNumber: 305,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                            lineNumber: 304,
                                            columnNumber: 19
                                        }, this) : faculty.map((member)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                                className: "hover:bg-muted/40",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "w-[100px] font-mono text-xs",
                                                        children: member.employee_id
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                        lineNumber: 312,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "w-[150px] font-medium",
                                                        children: [
                                                            member.first_name,
                                                            " ",
                                                            member.last_name
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                        lineNumber: 313,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "w-[200px] text-sm text-muted-foreground",
                                                        children: member.email
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                        lineNumber: 316,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "w-[130px] text-sm",
                                                        children: member.phone
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                        lineNumber: 319,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "w-[180px] text-sm",
                                                        children: member.department_name
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                        lineNumber: 320,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "w-[180px] text-sm text-muted-foreground",
                                                        children: member.college_name
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                        lineNumber: 321,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "w-[130px] text-sm",
                                                        children: member.designation
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                        lineNumber: 324,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "w-[180px] text-sm",
                                                        children: member.qualifications
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                        lineNumber: 325,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "w-[120px] text-right",
                                                        children: [
                                                            member.experience_years,
                                                            " years"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                        lineNumber: 326,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "w-[100px]",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: statusMap[member.status] ?? "secondary",
                                                            children: member.status.replace('_', ' ')
                                                        }, void 0, false, {
                                                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                            lineNumber: 328,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                        lineNumber: 327,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "w-[150px] text-right",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-end gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    variant: "secondary",
                                                                    size: "sm",
                                                                    onClick: ()=>window.location.href = `/faculty/${member.id}/edit`,
                                                                    children: "Edit"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                                    lineNumber: 334,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    variant: "danger",
                                                                    size: "sm",
                                                                    onClick: ()=>handleDelete(member.id),
                                                                    disabled: deleteMutation.isPending,
                                                                    children: "Delete"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                                    lineNumber: 341,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                            lineNumber: 333,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                        lineNumber: 332,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, member.id, true, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                                lineNumber: 311,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                        lineNumber: 302,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                                lineNumber: 286,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                            lineNumber: 285,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/faculty/page.tsx",
        lineNumber: 223,
        columnNumber: 5
    }, this);
}
_s(FacultyPage, "o8vdHoe0eKbcivDUZQw88WYjv3Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
_c = FacultyPage;
var _c;
__turbopack_context__.k.register(_c, "FacultyPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=edu-bit-lms_bitflow-frontend_97d7a409._.js.map