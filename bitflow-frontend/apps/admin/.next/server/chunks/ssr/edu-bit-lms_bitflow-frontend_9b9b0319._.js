module.exports = [
"[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef(({ className, variant = 'default', padding = 'md', children, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('rounded-3xl transition-all duration-200', {
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
Card.displayName = 'Card';
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex flex-col space-y-1.5 pb-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Card.tsx",
        lineNumber: 54,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardHeader.displayName = 'CardHeader';
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-2xl font-semibold leading-none tracking-tight', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Card.tsx",
        lineNumber: 66,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardTitle.displayName = 'CardTitle';
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Card.tsx",
        lineNumber: 78,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardDescription.displayName = 'CardDescription';
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('pt-0', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Card.tsx",
        lineNumber: 90,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardContent.displayName = 'CardContent';
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex items-center pt-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Card.tsx",
        lineNumber: 98,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardFooter.displayName = 'CardFooter';
}),
"[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/lib/cn.ts [app-ssr] (ecmascript)");
;
;
;
const Table = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full overflow-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("w-full caption-bottom text-sm", className),
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
Table.displayName = "Table";
const TableHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-xs uppercase", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx",
        lineNumber: 12,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
TableHeader.displayName = "TableHeader";
const TableBody = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("[&_tr:last-child]:border-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx",
        lineNumber: 17,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
TableBody.displayName = "TableBody";
const TableRow = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("border-b border-border transition-colors", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx",
        lineNumber: 22,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
TableRow.displayName = "TableRow";
const TableHead = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("py-3 text-left font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx",
        lineNumber: 31,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
TableHead.displayName = "TableHead";
const TableCell = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("py-3 align-middle", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx",
        lineNumber: 40,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
TableCell.displayName = "TableCell";
const TableCaption = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("caption", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-4 text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx",
        lineNumber: 45,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
TableCaption.displayName = "TableCaption";
;
}),
"[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Input Component
 * 
 * Based on the glassmorphic design with rounded, frosted inputs
 * Supports various types and states
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const Input = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ label, error, helperText, leftIcon, rightIcon, variant = 'default', className, type = 'text', ...props }, ref)=>{
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "block text-sm font-medium mb-2",
                children: [
                    label,
                    props.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    leftIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400",
                        children: leftIcon
                    }, void 0, false, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                        lineNumber: 51,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: ref,
                        type: inputType,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('w-full px-6 py-3 rounded-full transition-all duration-300', 'focus:outline-none focus:ring-2 focus:ring-white/30', 'placeholder:text-gray-400', {
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
                    isPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setShowPassword(!showPassword),
                        className: "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",
                        children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-5 w-5",
                            viewBox: "0 0 20 20",
                            fill: "currentColor",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M10 12a2 2 0 100-4 2 2 0 000 4z"
                                }, void 0, false, {
                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                                    lineNumber: 95,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-5 w-5",
                            viewBox: "0 0 20 20",
                            fill: "currentColor",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    fillRule: "evenodd",
                                    d: "M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z",
                                    clipRule: "evenodd"
                                }, void 0, false, {
                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                                    lineNumber: 109,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
                    rightIcon && !isPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-sm text-red-400",
                children: error
            }, void 0, false, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                lineNumber: 125,
                columnNumber: 19
            }, ("TURBOPACK compile-time value", void 0)),
            helperText && !error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
});
Input.displayName = 'Input';
}),
"[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CoursesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+react-query@5.90.2_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+react-query@5.90.2_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+react-query@5.90.2_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/table.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx [app-ssr] (ecmascript)");
"use client";
;
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
    archived: "warning"
};
const typeMap = {
    theory: "default",
    practical: "secondary",
    lab: "outline"
};
function CoursesPage() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [departmentFilter, setDepartmentFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [semesterFilter, setSemesterFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    // Fetch courses from API
    const { data: courses = [], isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'courses',
            searchQuery,
            departmentFilter,
            semesterFilter
        ],
        queryFn: async ()=>{
            // TODO: Replace with actual API endpoint
            // const response = await fetch(`/api/courses?search=${searchQuery}&department=${departmentFilter}&semester=${semesterFilter}`);
            // return response.json();
            // Mock data for now
            return [
                {
                    id: "1",
                    course_code: "CS101",
                    name: "Introduction to Programming",
                    description: "Fundamentals of programming using Python",
                    department_id: "1",
                    department_name: "Computer Science & Engineering",
                    college_name: "MVP Engineering College",
                    credits: 4,
                    semester: 1,
                    type: "theory",
                    hours_per_week: 5,
                    prerequisites: "None",
                    faculty_id: "1",
                    faculty_name: "Dr. Rajesh Kumar",
                    status: "active",
                    created_at: "2024-01-15"
                },
                {
                    id: "2",
                    course_code: "CS102",
                    name: "Programming Lab",
                    description: "Hands-on programming practice",
                    department_id: "1",
                    department_name: "Computer Science & Engineering",
                    college_name: "MVP Engineering College",
                    credits: 2,
                    semester: 1,
                    type: "lab",
                    hours_per_week: 4,
                    prerequisites: "CS101 (Co-requisite)",
                    faculty_id: "1",
                    faculty_name: "Dr. Rajesh Kumar",
                    status: "active",
                    created_at: "2024-01-15"
                },
                {
                    id: "3",
                    course_code: "ME201",
                    name: "Engineering Mechanics",
                    description: "Study of forces and motion",
                    department_id: "2",
                    department_name: "Mechanical Engineering",
                    college_name: "MVP Engineering College",
                    credits: 3,
                    semester: 3,
                    type: "theory",
                    hours_per_week: 4,
                    prerequisites: "Physics I, Mathematics II",
                    faculty_id: "2",
                    faculty_name: "Dr. Priya Mehta",
                    status: "active",
                    created_at: "2024-01-15"
                },
                {
                    id: "4",
                    course_code: "ME202",
                    name: "Workshop Practice",
                    description: "Practical training in mechanical workshop",
                    department_id: "2",
                    department_name: "Mechanical Engineering",
                    college_name: "MVP Engineering College",
                    credits: 2,
                    semester: 3,
                    type: "practical",
                    hours_per_week: 6,
                    prerequisites: "None",
                    faculty_id: "2",
                    faculty_name: "Dr. Priya Mehta",
                    status: "active",
                    created_at: "2024-01-15"
                },
                {
                    id: "5",
                    course_code: "BUS301",
                    name: "Marketing Management",
                    description: "Principles and practices of marketing",
                    department_id: "3",
                    department_name: "Business Administration",
                    college_name: "Greenfield Business Institute",
                    credits: 3,
                    semester: 5,
                    type: "theory",
                    hours_per_week: 4,
                    prerequisites: "Introduction to Business",
                    faculty_id: "3",
                    faculty_name: "Prof. Amit Verma",
                    status: "active",
                    created_at: "2024-01-15"
                },
                {
                    id: "6",
                    course_code: "ENG201",
                    name: "Shakespeare Studies",
                    description: "Analysis of Shakespeare's major works",
                    department_id: "4",
                    department_name: "English Literature",
                    college_name: "Stellar Arts & Science College",
                    credits: 3,
                    semester: 3,
                    type: "theory",
                    hours_per_week: 4,
                    prerequisites: "English Literature I",
                    faculty_id: "4",
                    faculty_name: "Dr. Sarah Johnson",
                    status: "inactive",
                    created_at: "2024-01-15"
                }
            ];
        }
    });
    // Delete mutation
    const deleteMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: async (id)=>{
            // TODO: Replace with actual API endpoint
            // await fetch(`/api/courses/${id}`, { method: 'DELETE' });
            console.log('Delete course:', id);
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'courses'
                ]
            });
        }
    });
    const handleDelete = (id)=>{
        if (window.confirm('Are you sure you want to delete this course?')) {
            deleteMutation.mutate(id);
        }
    };
    // Loading state
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-muted-foreground",
                children: "Loading courses..."
            }, void 0, false, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                lineNumber: 193,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
            lineNumber: 192,
            columnNumber: 7
        }, this);
    }
    // Error state
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-red-500",
                children: "Error loading courses. Please try again."
            }, void 0, false, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                lineNumber: 202,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
            lineNumber: 201,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col justify-between gap-4 sm:flex-row sm:items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-semibold",
                                children: "Courses Management"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-muted-foreground",
                                children: "Manage course catalog, credits, and curriculum across all departments."
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                lineNumber: 212,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                        lineNumber: 210,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "secondary",
                                children: "Import CSV"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                lineNumber: 217,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "secondary",
                                children: "Export"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                lineNumber: 218,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>window.location.href = '/courses/create',
                                children: "Add Course"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                lineNumber: 219,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                        lineNumber: 216,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "pt-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-4 md:grid-cols-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                type: "text",
                                placeholder: "Search by course name or code...",
                                value: searchQuery,
                                onChange: (e)=>setSearchQuery(e.target.value),
                                className: "md:col-span-1"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                lineNumber: 229,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: departmentFilter,
                                onChange: (e)=>setDepartmentFilter(e.target.value),
                                className: "flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "All Departments"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                        lineNumber: 241,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "1",
                                        children: "Computer Science & Engineering"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                        lineNumber: 242,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "2",
                                        children: "Mechanical Engineering"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                        lineNumber: 243,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "3",
                                        children: "Business Administration"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                        lineNumber: 244,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "4",
                                        children: "English Literature"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                        lineNumber: 245,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                lineNumber: 236,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: semesterFilter,
                                onChange: (e)=>setSemesterFilter(e.target.value),
                                className: "flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "All Semesters"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                        lineNumber: 252,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "1",
                                        children: "Semester 1"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                        lineNumber: 253,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "2",
                                        children: "Semester 2"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                        lineNumber: 254,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "3",
                                        children: "Semester 3"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                        lineNumber: 255,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "4",
                                        children: "Semester 4"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                        lineNumber: 256,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "5",
                                        children: "Semester 5"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                        lineNumber: 257,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "6",
                                        children: "Semester 6"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                        lineNumber: 258,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "7",
                                        children: "Semester 7"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                        lineNumber: 259,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "8",
                                        children: "Semester 8"
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                        lineNumber: 260,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                lineNumber: 247,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                        lineNumber: 228,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                    lineNumber: 227,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                children: "Courses Overview"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                lineNumber: 269,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: [
                                    "All courses with curriculum details. Total: ",
                                    courses.length,
                                    " courses"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                lineNumber: 270,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHeader"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    children: "Code"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                    lineNumber: 279,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    children: "Course Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                    lineNumber: 280,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    children: "Department"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                    lineNumber: 281,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    className: "text-center",
                                                    children: "Credits"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                    lineNumber: 282,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    className: "text-center",
                                                    children: "Semester"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                    lineNumber: 283,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    children: "Type"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                    lineNumber: 284,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    children: "Faculty"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                    lineNumber: 285,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    children: "Status"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                    lineNumber: 286,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    className: "text-right",
                                                    children: "Actions"
                                                }, void 0, false, {
                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                    lineNumber: 287,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                            lineNumber: 278,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                        lineNumber: 277,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableBody"], {
                                        children: courses.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                colSpan: 9,
                                                className: "text-center text-muted-foreground",
                                                children: "No courses found."
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                lineNumber: 293,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                            lineNumber: 292,
                                            columnNumber: 19
                                        }, this) : courses.map((course)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                                                className: "hover:bg-muted/40",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "font-mono text-xs font-semibold",
                                                        children: course.course_code
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                        lineNumber: 300,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "font-medium",
                                                        children: course.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                        lineNumber: 303,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "text-sm",
                                                        children: course.department_name
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                        lineNumber: 304,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "text-center font-semibold",
                                                        children: course.credits
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                        lineNumber: 305,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "text-center",
                                                        children: course.semester
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                        lineNumber: 308,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: typeMap[course.type] ?? "default",
                                                            children: course.type
                                                        }, void 0, false, {
                                                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                            lineNumber: 310,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                        lineNumber: 309,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "text-sm text-muted-foreground",
                                                        children: course.faculty_name || "Not assigned"
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                        lineNumber: 314,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: statusMap[course.status] ?? "secondary",
                                                            children: course.status
                                                        }, void 0, false, {
                                                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                            lineNumber: 318,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                        lineNumber: 317,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        className: "text-right",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-end gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                                    variant: "secondary",
                                                                    size: "sm",
                                                                    onClick: ()=>window.location.href = `/courses/${course.id}`,
                                                                    children: "View"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                                    lineNumber: 324,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                                    variant: "secondary",
                                                                    size: "sm",
                                                                    onClick: ()=>window.location.href = `/courses/${course.id}/edit`,
                                                                    children: "Edit"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                                    lineNumber: 331,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                                    variant: "danger",
                                                                    size: "sm",
                                                                    onClick: ()=>handleDelete(course.id),
                                                                    disabled: deleteMutation.isPending,
                                                                    children: "Delete"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                                    lineNumber: 338,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                            lineNumber: 323,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                        lineNumber: 322,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, course.id, true, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                                lineNumber: 299,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                        lineNumber: 290,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                                lineNumber: 276,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                            lineNumber: 275,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                        lineNumber: 274,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
                lineNumber: 267,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/courses/page.tsx",
        lineNumber: 208,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=edu-bit-lms_bitflow-frontend_9b9b0319._.js.map