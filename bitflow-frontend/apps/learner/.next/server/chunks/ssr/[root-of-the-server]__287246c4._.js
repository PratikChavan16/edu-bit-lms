module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/packages/ui/src/providers/theme-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const ThemeContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"](undefined);
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
    const [theme, setThemeState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](()=>defaultTheme);
    const [mounted, setMounted] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const applyTheme = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        const root = document.documentElement;
        const resolved = value === "system" && enableSystem ? getSystemTheme() : value;
        disableTransitionsTemporarily(disableTransitionOnChange);
        if (attribute === "class") {
            root.classList.remove("light", "dark");
            root.classList.add(resolved);
        } else {
            root.setAttribute(attribute, resolved);
        }
    }, [
        attribute,
        disableTransitionOnChange,
        enableSystem
    ]);
    const setTheme = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        setThemeState(value);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        storageKey
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
        const savedTheme = undefined;
        const initialTheme = undefined;
        const mediaQuery = undefined;
        const handleChange = undefined;
    }, [
        applyTheme,
        defaultTheme,
        enableSystem,
        storageKey
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!mounted) {
            return;
        }
        applyTheme(theme);
    }, [
        applyTheme,
        mounted,
        theme
    ]);
    const resolvedTheme = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return theme === "dark" ? "dark" : "light";
    }, [
        enableSystem,
        theme
    ]);
    const value = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>({
            theme,
            resolvedTheme,
            setTheme
        }), [
        resolvedTheme,
        setTheme,
        theme
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/ui/src/providers/theme-provider.tsx",
        lineNumber: 143,
        columnNumber: 10
    }, this);
}
function useTheme() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"](ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/apps/learner/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$axios$40$1$2e$12$2e$2$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/axios@1.12.2/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
class ApiClient {
    client;
    constructor(){
        this.client = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$axios$40$1$2e$12$2e$2$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
            baseURL: ("TURBOPACK compile-time value", "http://localhost:8000/api") || 'http://localhost:8000/api',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        // Request interceptor - add auth token
        this.client.interceptors.request.use((config)=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return config;
        }, (error)=>Promise.reject(error));
        // Response interceptor - handle errors
        this.client.interceptors.response.use((response)=>response, (error)=>{
            if (error.response?.status === 401) {
                // Token expired or invalid
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            }
            return Promise.reject(error);
        });
    }
    // Authentication
    async login(email, password, remember = false) {
        const response = await this.client.post('/auth/login', {
            email,
            password,
            remember
        });
        return response.data;
    }
    async logout() {
        const response = await this.client.post('/auth/logout');
        return response.data;
    }
    async getMe() {
        const response = await this.client.get('/auth/me');
        return response.data;
    }
    async forgotPassword(email) {
        const response = await this.client.post('/auth/forgot-password', {
            email
        });
        return response.data;
    }
    async changePassword(currentPassword, newPassword) {
        const response = await this.client.post('/auth/change-password', {
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: newPassword
        });
        return response.data;
    }
    // Learner Profile
    async getProfile() {
        const response = await this.client.get('/learner/profile');
        return response.data;
    }
    async updateProfile(data) {
        const response = await this.client.patch('/learner/profile', data);
        return response.data;
    }
    async uploadProfilePicture(file) {
        const formData = new FormData();
        formData.append('profile_picture', file);
        const response = await this.client.post('/learner/profile/picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
    async getAttendanceData(params) {
        const response = await this.client.get('/learner/profile/attendance', {
            params
        });
        return response.data;
    }
    async getFeeStatus() {
        const response = await this.client.get('/learner/profile/fees');
        return response.data;
    }
    async getPerformance() {
        const response = await this.client.get('/learner/profile/performance');
        return response.data;
    }
    async getTimetable() {
        const response = await this.client.get('/learner/profile/timetable');
        return response.data;
    }
    async getLibraryResources() {
        const response = await this.client.get('/learner/profile/library');
        return response.data;
    }
    // Dashboard
    async getDashboard() {
        const response = await this.client.get('/learner/dashboard');
        return response.data;
    }
    // Library
    async getLibraryResourcesList(params) {
        const response = await this.client.get('/learner/library/resources', {
            params
        });
        return response.data;
    }
    async getLibraryResourceDetails(id) {
        const response = await this.client.get(`/learner/library/resources/${id}`);
        return response.data;
    }
    async toggleBookmark(id) {
        const response = await this.client.post(`/learner/library/resources/${id}/bookmark`);
        return response.data;
    }
    async getBookmarks() {
        const response = await this.client.get('/learner/library/bookmarks');
        return response.data;
    }
    // Assessments
    async getAssessments(params) {
        const response = await this.client.get('/learner/assessments', {
            params
        });
        return response.data;
    }
    async getAssessmentDetails(id) {
        const response = await this.client.get(`/learner/assessments/${id}`);
        return response.data;
    }
    async submitAssessment(id, answers) {
        const response = await this.client.post(`/learner/assessments/${id}/submit`, {
            answers
        });
        return response.data;
    }
    // Announcements
    async getAnnouncements(params) {
        const response = await this.client.get('/learner/announcements', {
            params
        });
        return response.data;
    }
    async getAnnouncementDetails(id) {
        const response = await this.client.get(`/learner/announcements/${id}`);
        return response.data;
    }
    async markAnnouncementAsRead(id) {
        const response = await this.client.post(`/learner/announcements/${id}/read`);
        return response.data;
    }
    // Notifications
    async getNotifications(params) {
        const response = await this.client.get('/learner/notifications', {
            params
        });
        return response.data;
    }
    async getUnreadCount() {
        const response = await this.client.get('/learner/notifications/unread-count');
        return response.data;
    }
    async markNotificationAsRead(id) {
        const response = await this.client.post(`/learner/notifications/${id}/read`);
        return response.data;
    }
    async markAllNotificationsAsRead() {
        const response = await this.client.post('/learner/notifications/mark-all-read');
        return response.data;
    }
    // Documents
    async getDocumentFolders() {
        const response = await this.client.get('/learner/documents/folders');
        return response.data;
    }
    async uploadDocument(folderId, file) {
        const formData = new FormData();
        formData.append('document', file);
        const response = await this.client.post(`/learner/documents/folders/${folderId}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
    // Fees
    async getFeeInvoices() {
        const response = await this.client.get('/learner/fees/invoices');
        return response.data;
    }
    async getFeeInvoiceDetails(id) {
        const response = await this.client.get(`/learner/fees/invoices/${id}`);
        return response.data;
    }
}
const api = new ApiClient();
const __TURBOPACK__default__export__ = api;
}),
"[project]/apps/learner/context/auth-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$learner$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/learner/lib/api.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check if user is already logged in
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);
    const login = async (email, password, remember = false)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$learner$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].login(email, password, remember);
            setToken(response.token);
            setUser(response.user);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };
    const logout = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$learner$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally{
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            token,
            loading,
            login,
            logout,
            isAuthenticated: !!token && !!user
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/learner/context/auth-context.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
}),
"[project]/apps/learner/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryProvider",
    ()=>QueryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.2_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$learner$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/learner/context/auth-context.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const createClient = ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
        defaultOptions: {
            queries: {
                staleTime: 60_000,
                refetchOnWindowFocus: false
            }
        }
    });
function QueryProvider({ children }) {
    const [client] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(createClient);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$2_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: client,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$learner$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
            children: children
        }, void 0, false, {
            fileName: "[project]/apps/learner/app/providers.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/learner/app/providers.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/packages/ui/src/lib/cn.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$2$2e$6$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@2.6.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$2$2e$6$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/packages/ui/src/components/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$3_$40$types$2b$react$40$18$2e$3$2e$26_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.2.3_@types+react@18.3.26_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/cn.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background", {
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
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$3_$40$types$2b$react$40$18$2e$3$2e$26_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
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
Button.displayName = "Button";
;
}),
"[project]/packages/ui/src/components/separator.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Separator",
    ()=>Separator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/cn.ts [app-ssr] (ecmascript)");
;
;
function Separator({ className, orientation = "horizontal", decorative = true, role, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: decorative ? "presentation" : role ?? "separator",
        "aria-orientation": orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui/src/components/separator.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}),
"[project]/packages/ui/src/components/badge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/cn.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
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
const Badge = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui/src/components/badge.tsx",
        lineNumber: 29,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
Badge.displayName = "Badge";
;
}),
"[project]/apps/learner/components/site-shell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SiteShell",
    ()=>SiteShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/cn.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$separator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/separator.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/badge.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const primaryNav = [
    {
        href: "/dashboard",
        label: "Dashboard"
    },
    {
        href: "/library",
        label: "Library"
    },
    {
        href: "/documents",
        label: "Documents"
    },
    {
        href: "/results",
        label: "Results"
    },
    {
        href: "/help",
        label: "Help"
    }
];
function SiteShell({ children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen flex-col bg-muted/20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "border-b border-border bg-surface/95 backdrop-blur",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/dashboard",
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "h-9 w-9 rounded-lg bg-primary/10 text-center text-lg font-semibold leading-9 text-primary",
                                                children: "B"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/learner/components/site-shell.tsx",
                                                lineNumber: 32,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-semibold",
                                                        children: "Bitflow Nova"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/learner/components/site-shell.tsx",
                                                        lineNumber: 34,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "MVP Engineering College"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/learner/components/site-shell.tsx",
                                                        lineNumber: 35,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/learner/components/site-shell.tsx",
                                                lineNumber: 33,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/learner/components/site-shell.tsx",
                                        lineNumber: 31,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: "secondary",
                                        className: "hidden md:inline-flex",
                                        children: "Academic Year 2025-26"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/learner/components/site-shell.tsx",
                                        lineNumber: 38,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/learner/components/site-shell.tsx",
                                lineNumber: 30,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden items-center gap-6 md:flex",
                                children: primaryNav.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.href,
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm font-medium transition-colors", pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground"),
                                        children: item.label
                                    }, item.href, false, {
                                        fileName: "[project]/apps/learner/components/site-shell.tsx",
                                        lineNumber: 44,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/apps/learner/components/site-shell.tsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        children: "Notifications"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/learner/components/site-shell.tsx",
                                        lineNumber: 57,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        children: "ID Card"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/learner/components/site-shell.tsx",
                                        lineNumber: 60,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/learner/components/site-shell.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/learner/components/site-shell.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$separator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"], {
                        className: "md:hidden"
                    }, void 0, false, {
                        fileName: "[project]/apps/learner/components/site-shell.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "flex items-center gap-3 overflow-x-auto px-4 pb-3 pt-2 md:hidden",
                        children: primaryNav.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-full px-4 py-2 text-sm font-medium", pathname === item.href ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"),
                                children: item.label
                            }, item.href, false, {
                                fileName: "[project]/apps/learner/components/site-shell.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/learner/components/site-shell.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/learner/components/site-shell.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto w-full max-w-6xl px-6 py-8",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/apps/learner/components/site-shell.tsx",
                    lineNumber: 80,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/learner/components/site-shell.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "border-t border-border bg-surface/80",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Powered by Bitflow Nova"
                        }, void 0, false, {
                            fileName: "[project]/apps/learner/components/site-shell.tsx",
                            lineNumber: 84,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/help",
                                    children: "Support"
                                }, void 0, false, {
                                    fileName: "[project]/apps/learner/components/site-shell.tsx",
                                    lineNumber: 86,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/documents",
                                    children: "Documents"
                                }, void 0, false, {
                                    fileName: "[project]/apps/learner/components/site-shell.tsx",
                                    lineNumber: 87,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/settings",
                                    children: "Settings"
                                }, void 0, false, {
                                    fileName: "[project]/apps/learner/components/site-shell.tsx",
                                    lineNumber: 88,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/learner/components/site-shell.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/learner/components/site-shell.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/learner/components/site-shell.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/learner/components/site-shell.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__287246c4._.js.map