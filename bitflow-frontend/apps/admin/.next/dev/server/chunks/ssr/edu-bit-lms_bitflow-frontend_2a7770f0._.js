module.exports = [
"[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Input Component
 * 
 * Based on the glassmorphic design with rounded, frosted inputs
 * Supports various types and states
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const Input = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ label, error, helperText, leftIcon, rightIcon, variant = 'default', className, type = 'text', ...props }, ref)=>{
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "block text-sm font-medium mb-2",
                children: [
                    label,
                    props.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    leftIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400",
                        children: leftIcon
                    }, void 0, false, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                        lineNumber: 51,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                    isPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setShowPassword(!showPassword),
                        className: "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",
                        children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-5 w-5",
                            viewBox: "0 0 20 20",
                            fill: "currentColor",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M10 12a2 2 0 100-4 2 2 0 000 4z"
                                }, void 0, false, {
                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                                    lineNumber: 95,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-5 w-5",
                            viewBox: "0 0 20 20",
                            fill: "currentColor",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    fillRule: "evenodd",
                                    d: "M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z",
                                    clipRule: "evenodd"
                                }, void 0, false, {
                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                                    lineNumber: 109,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
                    rightIcon && !isPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-sm text-red-400",
                children: error
            }, void 0, false, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx",
                lineNumber: 125,
                columnNumber: 19
            }, ("TURBOPACK compile-time value", void 0)),
            helperText && !error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
"[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/label.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const Label = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/label.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
Label.displayName = "Label";
;
}),
"[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/select.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectItem",
    ()=>SelectItem,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const Select = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, children, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
        ref: ref,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/select.tsx",
        lineNumber: 12,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Select.displayName = "Select";
const SelectTrigger = Select;
const SelectContent = ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
const SelectItem = ({ value, children, className })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
        value: value,
        className: className,
        children: children
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/select.tsx",
        lineNumber: 32,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const SelectValue = ({ placeholder })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
        value: "",
        disabled: true,
        children: placeholder
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/select.tsx",
        lineNumber: 35,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
;
}),
"[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/textarea.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const Textarea = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/textarea.tsx",
        lineNumber: 9,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Textarea.displayName = "Textarea";
;
}),
"[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreateBatchPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$react$2d$hook$2d$form$40$7$2e$65$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/react-hook-form@7.65.0_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/react-hook-form/dist/index.esm.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$hookform$2b$resolvers$40$5$2e$2$2e$2_react$2d$hook$2d$form$40$7$2e$65$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_$2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@hookform+resolvers@5.2.2_react-hook-form@7.65.0_react@19.3.0-canary-a4eb2dfa-20251006_/node_modules/@hookform/resolvers/zod/dist/zod.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-ssr] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+react-query@5.90.2_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+react-query@5.90.2_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/Input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/label.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/select.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/packages/ui/src/components/textarea.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/lucide-react@0.446.0_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@16.0.0-canary.1_react-dom@19.3.0-canary-06fcc8f3-20251009_react@19.3.0-canary-a4eb2dfa-2_elfx46ks3wvyirx3iff46tv4ya/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
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
;
;
;
;
// Mock data
const mockCourses = [
    {
        id: "1",
        name: "Computer Science"
    },
    {
        id: "2",
        name: "Mechanical Engineering"
    },
    {
        id: "3",
        name: "Business Administration"
    }
];
// Validation schema
const batchSchema = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    batchYear: __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Batch year is required").regex(/^\d{4}-\d{4}$/, "Format: YYYY-YYYY (e.g., 2021-2025)"),
    batchName: __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(3, "Batch name must be at least 3 characters").max(50, "Batch name must not exceed 50 characters"),
    courseId: __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Course is required"),
    startDate: __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Start date is required"),
    endDate: __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "End date is required"),
    currentSemester: __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0, "Current semester must be at least 0").max(8, "Current semester must not exceed 8"),
    enrollmentCapacity: __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(1, "Enrollment capacity must be at least 1").max(500, "Enrollment capacity must not exceed 500"),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "active",
        "completed",
        "upcoming"
    ], {
        required_error: "Status is required"
    })
});
function CreateBatchPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const { register, handleSubmit, formState: { errors }, setValue, watch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$react$2d$hook$2d$form$40$7$2e$65$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$hookform$2b$resolvers$40$5$2e$2$2e$2_react$2d$hook$2d$form$40$7$2e$65$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_$2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["zodResolver"])(batchSchema),
        defaultValues: {
            status: "upcoming",
            currentSemester: 0
        }
    });
    const createMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: async (data)=>{
            // Simulate API call
            await new Promise((resolve)=>setTimeout(resolve, 1000));
            console.log("Creating batch:", data);
            return data;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    "batches"
                ]
            });
            router.push("/batches");
        }
    });
    const onSubmit = (data)=>{
        createMutation.mutate(data);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/batches",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            size: "sm",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$446$2e$0_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold",
                                children: "Add New Batch"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-muted-foreground",
                                children: "Create a new academic batch for enrollment"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit(onSubmit),
                className: "space-y-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg border p-6 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold",
                                children: "Basic Information"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-4 md:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "batchYear",
                                                children: [
                                                    "Batch Year ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-red-500",
                                                        children: "*"
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                        lineNumber: 118,
                                                        columnNumber: 28
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 117,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                id: "batchYear",
                                                placeholder: "2021-2025",
                                                ...register("batchYear"),
                                                className: errors.batchYear ? "border-red-500" : ""
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 120,
                                                columnNumber: 15
                                            }, this),
                                            errors.batchYear && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-red-500",
                                                children: errors.batchYear.message
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 127,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Format: YYYY-YYYY (e.g., 2021-2025 for 4-year course)"
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 131,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                        lineNumber: 116,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "batchName",
                                                children: [
                                                    "Batch Name ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-red-500",
                                                        children: "*"
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                        lineNumber: 138,
                                                        columnNumber: 28
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 137,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                id: "batchName",
                                                placeholder: "Batch 2021",
                                                ...register("batchName"),
                                                className: errors.batchName ? "border-red-500" : ""
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 140,
                                                columnNumber: 15
                                            }, this),
                                            errors.batchName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-red-500",
                                                children: errors.batchName.message
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 147,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                        lineNumber: 136,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "courseId",
                                                children: [
                                                    "Course ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-red-500",
                                                        children: "*"
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                        lineNumber: 155,
                                                        columnNumber: 24
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 154,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                                onValueChange: (value)=>setValue("courseId", value),
                                                defaultValue: watch("courseId"),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                        className: "bg-white text-black",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                            placeholder: "Select course"
                                                        }, void 0, false, {
                                                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                            lineNumber: 162,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                        lineNumber: 161,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                        className: "bg-white",
                                                        children: mockCourses.map((course)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: course.id,
                                                                className: "text-black",
                                                                children: course.name
                                                            }, course.id, false, {
                                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                                lineNumber: 166,
                                                                columnNumber: 21
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                        lineNumber: 164,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 157,
                                                columnNumber: 15
                                            }, this),
                                            errors.courseId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-red-500",
                                                children: errors.courseId.message
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 173,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                        lineNumber: 153,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "status",
                                                children: [
                                                    "Status ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-red-500",
                                                        children: "*"
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                        lineNumber: 179,
                                                        columnNumber: 24
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 178,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                                onValueChange: (value)=>setValue("status", value),
                                                defaultValue: watch("status"),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                        className: "bg-white text-black",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                            placeholder: "Select status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                            lineNumber: 186,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                        lineNumber: 185,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                        className: "bg-white",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "upcoming",
                                                                className: "text-black",
                                                                children: "Upcoming"
                                                            }, void 0, false, {
                                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                                lineNumber: 189,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "active",
                                                                className: "text-black",
                                                                children: "Active"
                                                            }, void 0, false, {
                                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                                lineNumber: 190,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "completed",
                                                                className: "text-black",
                                                                children: "Completed"
                                                            }, void 0, false, {
                                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                                lineNumber: 191,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                        lineNumber: 188,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 181,
                                                columnNumber: 15
                                            }, this),
                                            errors.status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-red-500",
                                                children: errors.status.message
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 195,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                        lineNumber: 177,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg border p-6 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold",
                                children: "Academic Details"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-4 md:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "startDate",
                                                children: [
                                                    "Start Date ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-red-500",
                                                        children: "*"
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                        lineNumber: 207,
                                                        columnNumber: 28
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 206,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                id: "startDate",
                                                type: "date",
                                                ...register("startDate"),
                                                className: errors.startDate ? "border-red-500" : ""
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 209,
                                                columnNumber: 15
                                            }, this),
                                            errors.startDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-red-500",
                                                children: errors.startDate.message
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 216,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                        lineNumber: 205,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "endDate",
                                                children: [
                                                    "End Date ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-red-500",
                                                        children: "*"
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                        lineNumber: 222,
                                                        columnNumber: 26
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 221,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                id: "endDate",
                                                type: "date",
                                                ...register("endDate"),
                                                className: errors.endDate ? "border-red-500" : ""
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 224,
                                                columnNumber: 15
                                            }, this),
                                            errors.endDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-red-500",
                                                children: errors.endDate.message
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 231,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                        lineNumber: 220,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "currentSemester",
                                                children: [
                                                    "Current Semester ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-red-500",
                                                        children: "*"
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                        lineNumber: 237,
                                                        columnNumber: 34
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 236,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                id: "currentSemester",
                                                type: "number",
                                                min: "0",
                                                max: "8",
                                                placeholder: "1",
                                                ...register("currentSemester", {
                                                    valueAsNumber: true
                                                }),
                                                className: errors.currentSemester ? "border-red-500" : ""
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 239,
                                                columnNumber: 15
                                            }, this),
                                            errors.currentSemester && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-red-500",
                                                children: errors.currentSemester.message
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 249,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Use 0 for upcoming batches not yet started"
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 253,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                        lineNumber: 235,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "enrollmentCapacity",
                                                children: [
                                                    "Enrollment Capacity ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-red-500",
                                                        children: "*"
                                                    }, void 0, false, {
                                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                        lineNumber: 260,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 259,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                id: "enrollmentCapacity",
                                                type: "number",
                                                min: "1",
                                                max: "500",
                                                placeholder: "150",
                                                ...register("enrollmentCapacity", {
                                                    valueAsNumber: true
                                                }),
                                                className: errors.enrollmentCapacity ? "border-red-500" : ""
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 262,
                                                columnNumber: 15
                                            }, this),
                                            errors.enrollmentCapacity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-red-500",
                                                children: errors.enrollmentCapacity.message
                                            }, void 0, false, {
                                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                                lineNumber: 272,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                        lineNumber: 258,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                lineNumber: 204,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg border p-6 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold",
                                children: "Additional Information"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                lineNumber: 282,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "description",
                                            children: "Description"
                                        }, void 0, false, {
                                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                            lineNumber: 285,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                                            id: "description",
                                            placeholder: "Brief description of the batch...",
                                            rows: 4,
                                            ...register("description"),
                                            className: "bg-white text-black"
                                        }, void 0, false, {
                                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                            lineNumber: 286,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-muted-foreground",
                                            children: "Optional notes about the batch (e.g., special programs, initiatives)"
                                        }, void 0, false, {
                                            fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                            lineNumber: 293,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                    lineNumber: 284,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                lineNumber: 283,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                        lineNumber: 281,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/batches",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "outline",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                    lineNumber: 303,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                lineNumber: 302,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0$2d$canary$2e$1_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$06fcc8f3$2d$20251009_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$2_elfx46ks3wvyirx3iff46tv4ya$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$packages$2f$ui$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                type: "submit",
                                disabled: createMutation.isPending,
                                children: createMutation.isPending ? "Creating..." : "Create Batch"
                            }, void 0, false, {
                                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                                lineNumber: 307,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                        lineNumber: 301,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/edu-bit-lms/bitflow-frontend/apps/admin/app/batches/create/page.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=edu-bit-lms_bitflow-frontend_2a7770f0._.js.map