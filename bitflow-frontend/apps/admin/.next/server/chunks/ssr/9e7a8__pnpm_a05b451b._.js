module.exports = [
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/timeoutManager.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/timeoutManager.ts
__turbopack_context__.s([
    "TimeoutManager",
    ()=>TimeoutManager,
    "defaultTimeoutProvider",
    ()=>defaultTimeoutProvider,
    "systemSetTimeoutZero",
    ()=>systemSetTimeoutZero,
    "timeoutManager",
    ()=>timeoutManager
]);
var defaultTimeoutProvider = {
    // We need the wrapper function syntax below instead of direct references to
    // global setTimeout etc.
    //
    // BAD: `setTimeout: setTimeout`
    // GOOD: `setTimeout: (cb, delay) => setTimeout(cb, delay)`
    //
    // If we use direct references here, then anything that wants to spy on or
    // replace the global setTimeout (like tests) won't work since we'll already
    // have a hard reference to the original implementation at the time when this
    // file was imported.
    setTimeout: (callback, delay)=>setTimeout(callback, delay),
    clearTimeout: (timeoutId)=>clearTimeout(timeoutId),
    setInterval: (callback, delay)=>setInterval(callback, delay),
    clearInterval: (intervalId)=>clearInterval(intervalId)
};
var TimeoutManager = class {
    // We cannot have TimeoutManager<T> as we must instantiate it with a concrete
    // type at app boot; and if we leave that type, then any new timer provider
    // would need to support ReturnType<typeof setTimeout>, which is infeasible.
    //
    // We settle for type safety for the TimeoutProvider type, and accept that
    // this class is unsafe internally to allow for extension.
    #provider = defaultTimeoutProvider;
    #providerCalled = false;
    setTimeoutProvider(provider) {
        if ("TURBOPACK compile-time truthy", 1) {
            if (this.#providerCalled && provider !== this.#provider) {
                console.error(`[timeoutManager]: Switching provider after calls to previous provider might result in unexpected behavior.`, {
                    previous: this.#provider,
                    provider
                });
            }
        }
        this.#provider = provider;
        if (("TURBOPACK compile-time value", "development") !== "production") {
            this.#providerCalled = false;
        }
    }
    setTimeout(callback, delay) {
        if (("TURBOPACK compile-time value", "development") !== "production") {
            this.#providerCalled = true;
        }
        return this.#provider.setTimeout(callback, delay);
    }
    clearTimeout(timeoutId) {
        this.#provider.clearTimeout(timeoutId);
    }
    setInterval(callback, delay) {
        if (("TURBOPACK compile-time value", "development") !== "production") {
            this.#providerCalled = true;
        }
        return this.#provider.setInterval(callback, delay);
    }
    clearInterval(intervalId) {
        this.#provider.clearInterval(intervalId);
    }
};
var timeoutManager = new TimeoutManager();
function systemSetTimeoutZero(callback) {
    setTimeout(callback, 0);
}
;
 //# sourceMappingURL=timeoutManager.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/utils.ts
__turbopack_context__.s([
    "addToEnd",
    ()=>addToEnd,
    "addToStart",
    ()=>addToStart,
    "ensureQueryFn",
    ()=>ensureQueryFn,
    "functionalUpdate",
    ()=>functionalUpdate,
    "hashKey",
    ()=>hashKey,
    "hashQueryKeyByOptions",
    ()=>hashQueryKeyByOptions,
    "isPlainArray",
    ()=>isPlainArray,
    "isPlainObject",
    ()=>isPlainObject,
    "isServer",
    ()=>isServer,
    "isValidTimeout",
    ()=>isValidTimeout,
    "keepPreviousData",
    ()=>keepPreviousData,
    "matchMutation",
    ()=>matchMutation,
    "matchQuery",
    ()=>matchQuery,
    "noop",
    ()=>noop,
    "partialMatchKey",
    ()=>partialMatchKey,
    "replaceData",
    ()=>replaceData,
    "replaceEqualDeep",
    ()=>replaceEqualDeep,
    "resolveEnabled",
    ()=>resolveEnabled,
    "resolveStaleTime",
    ()=>resolveStaleTime,
    "shallowEqualObjects",
    ()=>shallowEqualObjects,
    "shouldThrowError",
    ()=>shouldThrowError,
    "skipToken",
    ()=>skipToken,
    "sleep",
    ()=>sleep,
    "timeUntilStale",
    ()=>timeUntilStale
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/timeoutManager.js [app-ssr] (ecmascript)");
;
var isServer = ("TURBOPACK compile-time value", "undefined") === "undefined" || "Deno" in globalThis;
function noop() {}
function functionalUpdate(updater, input) {
    return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
    return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
    return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveStaleTime(staleTime, query) {
    return typeof staleTime === "function" ? staleTime(query) : staleTime;
}
function resolveEnabled(enabled, query) {
    return typeof enabled === "function" ? enabled(query) : enabled;
}
function matchQuery(filters, query) {
    const { type = "all", exact, fetchStatus, predicate, queryKey, stale } = filters;
    if (queryKey) {
        if (exact) {
            if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
                return false;
            }
        } else if (!partialMatchKey(query.queryKey, queryKey)) {
            return false;
        }
    }
    if (type !== "all") {
        const isActive = query.isActive();
        if (type === "active" && !isActive) {
            return false;
        }
        if (type === "inactive" && isActive) {
            return false;
        }
    }
    if (typeof stale === "boolean" && query.isStale() !== stale) {
        return false;
    }
    if (fetchStatus && fetchStatus !== query.state.fetchStatus) {
        return false;
    }
    if (predicate && !predicate(query)) {
        return false;
    }
    return true;
}
function matchMutation(filters, mutation) {
    const { exact, status, predicate, mutationKey } = filters;
    if (mutationKey) {
        if (!mutation.options.mutationKey) {
            return false;
        }
        if (exact) {
            if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) {
                return false;
            }
        } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
            return false;
        }
    }
    if (status && mutation.state.status !== status) {
        return false;
    }
    if (predicate && !predicate(mutation)) {
        return false;
    }
    return true;
}
function hashQueryKeyByOptions(queryKey, options) {
    const hashFn = options?.queryKeyHashFn || hashKey;
    return hashFn(queryKey);
}
function hashKey(queryKey) {
    return JSON.stringify(queryKey, (_, val)=>isPlainObject(val) ? Object.keys(val).sort().reduce((result, key)=>{
            result[key] = val[key];
            return result;
        }, {}) : val);
}
function partialMatchKey(a, b) {
    if (a === b) {
        return true;
    }
    if (typeof a !== typeof b) {
        return false;
    }
    if (a && b && typeof a === "object" && typeof b === "object") {
        return Object.keys(b).every((key)=>partialMatchKey(a[key], b[key]));
    }
    return false;
}
var hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a, b) {
    if (a === b) {
        return a;
    }
    const array = isPlainArray(a) && isPlainArray(b);
    if (!array && !(isPlainObject(a) && isPlainObject(b))) return b;
    const aItems = array ? a : Object.keys(a);
    const aSize = aItems.length;
    const bItems = array ? b : Object.keys(b);
    const bSize = bItems.length;
    const copy = array ? new Array(bSize) : {};
    let equalItems = 0;
    for(let i = 0; i < bSize; i++){
        const key = array ? i : bItems[i];
        const aItem = a[key];
        const bItem = b[key];
        if (aItem === bItem) {
            copy[key] = aItem;
            if (array ? i < aSize : hasOwn.call(a, key)) equalItems++;
            continue;
        }
        if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
            copy[key] = bItem;
            continue;
        }
        const v = replaceEqualDeep(aItem, bItem);
        copy[key] = v;
        if (v === aItem) equalItems++;
    }
    return aSize === bSize && equalItems === aSize ? a : copy;
}
function shallowEqualObjects(a, b) {
    if (!b || Object.keys(a).length !== Object.keys(b).length) {
        return false;
    }
    for(const key in a){
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
function isPlainArray(value) {
    return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
    if (!hasObjectPrototype(o)) {
        return false;
    }
    const ctor = o.constructor;
    if (ctor === void 0) {
        return true;
    }
    const prot = ctor.prototype;
    if (!hasObjectPrototype(prot)) {
        return false;
    }
    if (!prot.hasOwnProperty("isPrototypeOf")) {
        return false;
    }
    if (Object.getPrototypeOf(o) !== Object.prototype) {
        return false;
    }
    return true;
}
function hasObjectPrototype(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(timeout) {
    return new Promise((resolve)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["timeoutManager"].setTimeout(resolve, timeout);
    });
}
function replaceData(prevData, data, options) {
    if (typeof options.structuralSharing === "function") {
        return options.structuralSharing(prevData, data);
    } else if (options.structuralSharing !== false) {
        if ("TURBOPACK compile-time truthy", 1) {
            try {
                return replaceEqualDeep(prevData, data);
            } catch (error) {
                console.error(`Structural sharing requires data to be JSON serializable. To fix this, turn off structuralSharing or return JSON-serializable data from your queryFn. [${options.queryHash}]: ${error}`);
                throw error;
            }
        }
        return replaceEqualDeep(prevData, data);
    }
    return data;
}
function keepPreviousData(previousData) {
    return previousData;
}
function addToEnd(items, item, max = 0) {
    const newItems = [
        ...items,
        item
    ];
    return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
    const newItems = [
        item,
        ...items
    ];
    return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
var skipToken = Symbol();
function ensureQueryFn(options, fetchOptions) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (options.queryFn === skipToken) {
            console.error(`Attempted to invoke queryFn when set to skipToken. This is likely a configuration error. Query hash: '${options.queryHash}'`);
        }
    }
    if (!options.queryFn && fetchOptions?.initialPromise) {
        return ()=>fetchOptions.initialPromise;
    }
    if (!options.queryFn || options.queryFn === skipToken) {
        return ()=>Promise.reject(new Error(`Missing queryFn: '${options.queryHash}'`));
    }
    return options.queryFn;
}
function shouldThrowError(throwOnError, params) {
    if (typeof throwOnError === "function") {
        return throwOnError(...params);
    }
    return !!throwOnError;
}
;
 //# sourceMappingURL=utils.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/notifyManager.ts
__turbopack_context__.s([
    "createNotifyManager",
    ()=>createNotifyManager,
    "defaultScheduler",
    ()=>defaultScheduler,
    "notifyManager",
    ()=>notifyManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/timeoutManager.js [app-ssr] (ecmascript)");
;
var defaultScheduler = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["systemSetTimeoutZero"];
function createNotifyManager() {
    let queue = [];
    let transactions = 0;
    let notifyFn = (callback)=>{
        callback();
    };
    let batchNotifyFn = (callback)=>{
        callback();
    };
    let scheduleFn = defaultScheduler;
    const schedule = (callback)=>{
        if (transactions) {
            queue.push(callback);
        } else {
            scheduleFn(()=>{
                notifyFn(callback);
            });
        }
    };
    const flush = ()=>{
        const originalQueue = queue;
        queue = [];
        if (originalQueue.length) {
            scheduleFn(()=>{
                batchNotifyFn(()=>{
                    originalQueue.forEach((callback)=>{
                        notifyFn(callback);
                    });
                });
            });
        }
    };
    return {
        batch: (callback)=>{
            let result;
            transactions++;
            try {
                result = callback();
            } finally{
                transactions--;
                if (!transactions) {
                    flush();
                }
            }
            return result;
        },
        /**
     * All calls to the wrapped function will be batched.
     */ batchCalls: (callback)=>{
            return (...args)=>{
                schedule(()=>{
                    callback(...args);
                });
            };
        },
        schedule,
        /**
     * Use this method to set a custom notify function.
     * This can be used to for example wrap notifications with `React.act` while running tests.
     */ setNotifyFunction: (fn)=>{
            notifyFn = fn;
        },
        /**
     * Use this method to set a custom function to batch notifications together into a single tick.
     * By default React Query will use the batch function provided by ReactDOM or React Native.
     */ setBatchNotifyFunction: (fn)=>{
            batchNotifyFn = fn;
        },
        setScheduler: (fn)=>{
            scheduleFn = fn;
        }
    };
}
var notifyManager = createNotifyManager();
;
 //# sourceMappingURL=notifyManager.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/subscribable.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/subscribable.ts
__turbopack_context__.s([
    "Subscribable",
    ()=>Subscribable
]);
var Subscribable = class {
    constructor(){
        this.listeners = /* @__PURE__ */ new Set();
        this.subscribe = this.subscribe.bind(this);
    }
    subscribe(listener) {
        this.listeners.add(listener);
        this.onSubscribe();
        return ()=>{
            this.listeners.delete(listener);
            this.onUnsubscribe();
        };
    }
    hasListeners() {
        return this.listeners.size > 0;
    }
    onSubscribe() {}
    onUnsubscribe() {}
};
;
 //# sourceMappingURL=subscribable.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/focusManager.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/focusManager.ts
__turbopack_context__.s([
    "FocusManager",
    ()=>FocusManager,
    "focusManager",
    ()=>focusManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/subscribable.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
;
;
var FocusManager = class extends __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Subscribable"] {
    #focused;
    #cleanup;
    #setup;
    constructor(){
        super();
        this.#setup = (onFocus)=>{
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isServer"] && window.addEventListener) {
                const listener = ()=>onFocus();
                window.addEventListener("visibilitychange", listener, false);
                return ()=>{
                    window.removeEventListener("visibilitychange", listener);
                };
            }
            return;
        };
    }
    onSubscribe() {
        if (!this.#cleanup) {
            this.setEventListener(this.#setup);
        }
    }
    onUnsubscribe() {
        if (!this.hasListeners()) {
            this.#cleanup?.();
            this.#cleanup = void 0;
        }
    }
    setEventListener(setup) {
        this.#setup = setup;
        this.#cleanup?.();
        this.#cleanup = setup((focused)=>{
            if (typeof focused === "boolean") {
                this.setFocused(focused);
            } else {
                this.onFocus();
            }
        });
    }
    setFocused(focused) {
        const changed = this.#focused !== focused;
        if (changed) {
            this.#focused = focused;
            this.onFocus();
        }
    }
    onFocus() {
        const isFocused = this.isFocused();
        this.listeners.forEach((listener)=>{
            listener(isFocused);
        });
    }
    isFocused() {
        if (typeof this.#focused === "boolean") {
            return this.#focused;
        }
        return globalThis.document?.visibilityState !== "hidden";
    }
};
var focusManager = new FocusManager();
;
 //# sourceMappingURL=focusManager.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/onlineManager.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/onlineManager.ts
__turbopack_context__.s([
    "OnlineManager",
    ()=>OnlineManager,
    "onlineManager",
    ()=>onlineManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/subscribable.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
;
;
var OnlineManager = class extends __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Subscribable"] {
    #online = true;
    #cleanup;
    #setup;
    constructor(){
        super();
        this.#setup = (onOnline)=>{
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isServer"] && window.addEventListener) {
                const onlineListener = ()=>onOnline(true);
                const offlineListener = ()=>onOnline(false);
                window.addEventListener("online", onlineListener, false);
                window.addEventListener("offline", offlineListener, false);
                return ()=>{
                    window.removeEventListener("online", onlineListener);
                    window.removeEventListener("offline", offlineListener);
                };
            }
            return;
        };
    }
    onSubscribe() {
        if (!this.#cleanup) {
            this.setEventListener(this.#setup);
        }
    }
    onUnsubscribe() {
        if (!this.hasListeners()) {
            this.#cleanup?.();
            this.#cleanup = void 0;
        }
    }
    setEventListener(setup) {
        this.#setup = setup;
        this.#cleanup?.();
        this.#cleanup = setup(this.setOnline.bind(this));
    }
    setOnline(online) {
        const changed = this.#online !== online;
        if (changed) {
            this.#online = online;
            this.listeners.forEach((listener)=>{
                listener(online);
            });
        }
    }
    isOnline() {
        return this.#online;
    }
};
var onlineManager = new OnlineManager();
;
 //# sourceMappingURL=onlineManager.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/thenable.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/thenable.ts
__turbopack_context__.s([
    "pendingThenable",
    ()=>pendingThenable,
    "tryResolveSync",
    ()=>tryResolveSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
;
function pendingThenable() {
    let resolve;
    let reject;
    const thenable = new Promise((_resolve, _reject)=>{
        resolve = _resolve;
        reject = _reject;
    });
    thenable.status = "pending";
    thenable.catch(()=>{});
    function finalize(data) {
        Object.assign(thenable, data);
        delete thenable.resolve;
        delete thenable.reject;
    }
    thenable.resolve = (value)=>{
        finalize({
            status: "fulfilled",
            value
        });
        resolve(value);
    };
    thenable.reject = (reason)=>{
        finalize({
            status: "rejected",
            reason
        });
        reject(reason);
    };
    return thenable;
}
function tryResolveSync(promise) {
    let data;
    promise.then((result)=>{
        data = result;
        return result;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"])?.catch(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]);
    if (data !== void 0) {
        return {
            data
        };
    }
    return void 0;
}
;
 //# sourceMappingURL=thenable.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/retryer.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/retryer.ts
__turbopack_context__.s([
    "CancelledError",
    ()=>CancelledError,
    "canFetch",
    ()=>canFetch,
    "createRetryer",
    ()=>createRetryer,
    "isCancelledError",
    ()=>isCancelledError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$focusManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/focusManager.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/onlineManager.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$thenable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/thenable.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
;
;
;
;
function defaultRetryDelay(failureCount) {
    return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
    return (networkMode ?? "online") === "online" ? __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onlineManager"].isOnline() : true;
}
var CancelledError = class extends Error {
    constructor(options){
        super("CancelledError");
        this.revert = options?.revert;
        this.silent = options?.silent;
    }
};
function isCancelledError(value) {
    return value instanceof CancelledError;
}
function createRetryer(config) {
    let isRetryCancelled = false;
    let failureCount = 0;
    let continueFn;
    const thenable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$thenable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pendingThenable"])();
    const isResolved = ()=>thenable.status !== "pending";
    const cancel = (cancelOptions)=>{
        if (!isResolved()) {
            const error = new CancelledError(cancelOptions);
            reject(error);
            config.onCancel?.(error);
        }
    };
    const cancelRetry = ()=>{
        isRetryCancelled = true;
    };
    const continueRetry = ()=>{
        isRetryCancelled = false;
    };
    const canContinue = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$focusManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["focusManager"].isFocused() && (config.networkMode === "always" || __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onlineManager"].isOnline()) && config.canRun();
    const canStart = ()=>canFetch(config.networkMode) && config.canRun();
    const resolve = (value)=>{
        if (!isResolved()) {
            continueFn?.();
            thenable.resolve(value);
        }
    };
    const reject = (value)=>{
        if (!isResolved()) {
            continueFn?.();
            thenable.reject(value);
        }
    };
    const pause = ()=>{
        return new Promise((continueResolve)=>{
            continueFn = (value)=>{
                if (isResolved() || canContinue()) {
                    continueResolve(value);
                }
            };
            config.onPause?.();
        }).then(()=>{
            continueFn = void 0;
            if (!isResolved()) {
                config.onContinue?.();
            }
        });
    };
    const run = ()=>{
        if (isResolved()) {
            return;
        }
        let promiseOrValue;
        const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
        try {
            promiseOrValue = initialPromise ?? config.fn();
        } catch (error) {
            promiseOrValue = Promise.reject(error);
        }
        Promise.resolve(promiseOrValue).then(resolve).catch((error)=>{
            if (isResolved()) {
                return;
            }
            const retry = config.retry ?? (__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isServer"] ? 0 : 3);
            const retryDelay = config.retryDelay ?? defaultRetryDelay;
            const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
            const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
            if (isRetryCancelled || !shouldRetry) {
                reject(error);
                return;
            }
            failureCount++;
            config.onFail?.(failureCount, error);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sleep"])(delay).then(()=>{
                return canContinue() ? void 0 : pause();
            }).then(()=>{
                if (isRetryCancelled) {
                    reject(error);
                } else {
                    run();
                }
            });
        });
    };
    return {
        promise: thenable,
        status: ()=>thenable.status,
        cancel,
        continue: ()=>{
            continueFn?.();
            return thenable;
        },
        cancelRetry,
        continueRetry,
        canStart,
        start: ()=>{
            if (canStart()) {
                run();
            } else {
                pause().then(run);
            }
            return thenable;
        }
    };
}
;
 //# sourceMappingURL=retryer.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/removable.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/removable.ts
__turbopack_context__.s([
    "Removable",
    ()=>Removable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/timeoutManager.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
;
;
var Removable = class {
    #gcTimeout;
    destroy() {
        this.clearGcTimeout();
    }
    scheduleGc() {
        this.clearGcTimeout();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidTimeout"])(this.gcTime)) {
            this.#gcTimeout = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["timeoutManager"].setTimeout(()=>{
                this.optionalRemove();
            }, this.gcTime);
        }
    }
    updateGcTime(newGcTime) {
        this.gcTime = Math.max(this.gcTime || 0, newGcTime ?? (__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isServer"] ? Infinity : 5 * 60 * 1e3));
    }
    clearGcTimeout() {
        if (this.#gcTimeout) {
            __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["timeoutManager"].clearTimeout(this.#gcTimeout);
            this.#gcTimeout = void 0;
        }
    }
};
;
 //# sourceMappingURL=removable.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/query.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/query.ts
__turbopack_context__.s([
    "Query",
    ()=>Query,
    "fetchState",
    ()=>fetchState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/retryer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$removable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/removable.js [app-ssr] (ecmascript)");
;
;
;
;
var Query = class extends __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$removable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Removable"] {
    #initialState;
    #revertState;
    #cache;
    #client;
    #retryer;
    #defaultOptions;
    #abortSignalConsumed;
    constructor(config){
        super();
        this.#abortSignalConsumed = false;
        this.#defaultOptions = config.defaultOptions;
        this.setOptions(config.options);
        this.observers = [];
        this.#client = config.client;
        this.#cache = this.#client.getQueryCache();
        this.queryKey = config.queryKey;
        this.queryHash = config.queryHash;
        this.#initialState = getDefaultState(this.options);
        this.state = config.state ?? this.#initialState;
        this.scheduleGc();
    }
    get meta() {
        return this.options.meta;
    }
    get promise() {
        return this.#retryer?.promise;
    }
    setOptions(options) {
        this.options = {
            ...this.#defaultOptions,
            ...options
        };
        this.updateGcTime(this.options.gcTime);
        if (this.state && this.state.data === void 0) {
            const defaultState = getDefaultState(this.options);
            if (defaultState.data !== void 0) {
                this.setData(defaultState.data, {
                    updatedAt: defaultState.dataUpdatedAt,
                    manual: true
                });
                this.#initialState = defaultState;
            }
        }
    }
    optionalRemove() {
        if (!this.observers.length && this.state.fetchStatus === "idle") {
            this.#cache.remove(this);
        }
    }
    setData(newData, options) {
        const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replaceData"])(this.state.data, newData, this.options);
        this.#dispatch({
            data,
            type: "success",
            dataUpdatedAt: options?.updatedAt,
            manual: options?.manual
        });
        return data;
    }
    setState(state, setStateOptions) {
        this.#dispatch({
            type: "setState",
            state,
            setStateOptions
        });
    }
    cancel(options) {
        const promise = this.#retryer?.promise;
        this.#retryer?.cancel(options);
        return promise ? promise.then(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]).catch(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]) : Promise.resolve();
    }
    destroy() {
        super.destroy();
        this.cancel({
            silent: true
        });
    }
    reset() {
        this.destroy();
        this.setState(this.#initialState);
    }
    isActive() {
        return this.observers.some((observer)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveEnabled"])(observer.options.enabled, this) !== false);
    }
    isDisabled() {
        if (this.getObserversCount() > 0) {
            return !this.isActive();
        }
        return this.options.queryFn === __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["skipToken"] || this.state.dataUpdateCount + this.state.errorUpdateCount === 0;
    }
    isStatic() {
        if (this.getObserversCount() > 0) {
            return this.observers.some((observer)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveStaleTime"])(observer.options.staleTime, this) === "static");
        }
        return false;
    }
    isStale() {
        if (this.getObserversCount() > 0) {
            return this.observers.some((observer)=>observer.getCurrentResult().isStale);
        }
        return this.state.data === void 0 || this.state.isInvalidated;
    }
    isStaleByTime(staleTime = 0) {
        if (this.state.data === void 0) {
            return true;
        }
        if (staleTime === "static") {
            return false;
        }
        if (this.state.isInvalidated) {
            return true;
        }
        return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["timeUntilStale"])(this.state.dataUpdatedAt, staleTime);
    }
    onFocus() {
        const observer = this.observers.find((x)=>x.shouldFetchOnWindowFocus());
        observer?.refetch({
            cancelRefetch: false
        });
        this.#retryer?.continue();
    }
    onOnline() {
        const observer = this.observers.find((x)=>x.shouldFetchOnReconnect());
        observer?.refetch({
            cancelRefetch: false
        });
        this.#retryer?.continue();
    }
    addObserver(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
            this.clearGcTimeout();
            this.#cache.notify({
                type: "observerAdded",
                query: this,
                observer
            });
        }
    }
    removeObserver(observer) {
        if (this.observers.includes(observer)) {
            this.observers = this.observers.filter((x)=>x !== observer);
            if (!this.observers.length) {
                if (this.#retryer) {
                    if (this.#abortSignalConsumed) {
                        this.#retryer.cancel({
                            revert: true
                        });
                    } else {
                        this.#retryer.cancelRetry();
                    }
                }
                this.scheduleGc();
            }
            this.#cache.notify({
                type: "observerRemoved",
                query: this,
                observer
            });
        }
    }
    getObserversCount() {
        return this.observers.length;
    }
    invalidate() {
        if (!this.state.isInvalidated) {
            this.#dispatch({
                type: "invalidate"
            });
        }
    }
    async fetch(options, fetchOptions) {
        if (this.state.fetchStatus !== "idle" && // If the promise in the retyer is already rejected, we have to definitely
        // re-start the fetch; there is a chance that the query is still in a
        // pending state when that happens
        this.#retryer?.status() !== "rejected") {
            if (this.state.data !== void 0 && fetchOptions?.cancelRefetch) {
                this.cancel({
                    silent: true
                });
            } else if (this.#retryer) {
                this.#retryer.continueRetry();
                return this.#retryer.promise;
            }
        }
        if (options) {
            this.setOptions(options);
        }
        if (!this.options.queryFn) {
            const observer = this.observers.find((x)=>x.options.queryFn);
            if (observer) {
                this.setOptions(observer.options);
            }
        }
        if ("TURBOPACK compile-time truthy", 1) {
            if (!Array.isArray(this.options.queryKey)) {
                console.error(`As of v4, queryKey needs to be an Array. If you are using a string like 'repoData', please change it to an Array, e.g. ['repoData']`);
            }
        }
        const abortController = new AbortController();
        const addSignalProperty = (object)=>{
            Object.defineProperty(object, "signal", {
                enumerable: true,
                get: ()=>{
                    this.#abortSignalConsumed = true;
                    return abortController.signal;
                }
            });
        };
        const fetchFn = ()=>{
            const queryFn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ensureQueryFn"])(this.options, fetchOptions);
            const createQueryFnContext = ()=>{
                const queryFnContext2 = {
                    client: this.#client,
                    queryKey: this.queryKey,
                    meta: this.meta
                };
                addSignalProperty(queryFnContext2);
                return queryFnContext2;
            };
            const queryFnContext = createQueryFnContext();
            this.#abortSignalConsumed = false;
            if (this.options.persister) {
                return this.options.persister(queryFn, queryFnContext, this);
            }
            return queryFn(queryFnContext);
        };
        const createFetchContext = ()=>{
            const context2 = {
                fetchOptions,
                options: this.options,
                queryKey: this.queryKey,
                client: this.#client,
                state: this.state,
                fetchFn
            };
            addSignalProperty(context2);
            return context2;
        };
        const context = createFetchContext();
        this.options.behavior?.onFetch(context, this);
        this.#revertState = this.state;
        if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) {
            this.#dispatch({
                type: "fetch",
                meta: context.fetchOptions?.meta
            });
        }
        this.#retryer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createRetryer"])({
            initialPromise: fetchOptions?.initialPromise,
            fn: context.fetchFn,
            onCancel: (error)=>{
                if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CancelledError"] && error.revert) {
                    this.setState({
                        ...this.#revertState,
                        fetchStatus: "idle"
                    });
                }
                abortController.abort();
            },
            onFail: (failureCount, error)=>{
                this.#dispatch({
                    type: "failed",
                    failureCount,
                    error
                });
            },
            onPause: ()=>{
                this.#dispatch({
                    type: "pause"
                });
            },
            onContinue: ()=>{
                this.#dispatch({
                    type: "continue"
                });
            },
            retry: context.options.retry,
            retryDelay: context.options.retryDelay,
            networkMode: context.options.networkMode,
            canRun: ()=>true
        });
        try {
            const data = await this.#retryer.start();
            if (data === void 0) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.error(`Query data cannot be undefined. Please make sure to return a value other than undefined from your query function. Affected query key: ${this.queryHash}`);
                }
                throw new Error(`${this.queryHash} data is undefined`);
            }
            this.setData(data);
            this.#cache.config.onSuccess?.(data, this);
            this.#cache.config.onSettled?.(data, this.state.error, this);
            return data;
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CancelledError"]) {
                if (error.silent) {
                    return this.#retryer.promise;
                } else if (error.revert) {
                    if (this.state.data === void 0) {
                        throw error;
                    }
                    return this.state.data;
                }
            }
            this.#dispatch({
                type: "error",
                error
            });
            this.#cache.config.onError?.(error, this);
            this.#cache.config.onSettled?.(this.state.data, error, this);
            throw error;
        } finally{
            this.scheduleGc();
        }
    }
    #dispatch(action) {
        const reducer = (state)=>{
            switch(action.type){
                case "failed":
                    return {
                        ...state,
                        fetchFailureCount: action.failureCount,
                        fetchFailureReason: action.error
                    };
                case "pause":
                    return {
                        ...state,
                        fetchStatus: "paused"
                    };
                case "continue":
                    return {
                        ...state,
                        fetchStatus: "fetching"
                    };
                case "fetch":
                    return {
                        ...state,
                        ...fetchState(state.data, this.options),
                        fetchMeta: action.meta ?? null
                    };
                case "success":
                    const newState = {
                        ...state,
                        data: action.data,
                        dataUpdateCount: state.dataUpdateCount + 1,
                        dataUpdatedAt: action.dataUpdatedAt ?? Date.now(),
                        error: null,
                        isInvalidated: false,
                        status: "success",
                        ...!action.manual && {
                            fetchStatus: "idle",
                            fetchFailureCount: 0,
                            fetchFailureReason: null
                        }
                    };
                    this.#revertState = action.manual ? newState : void 0;
                    return newState;
                case "error":
                    const error = action.error;
                    return {
                        ...state,
                        error,
                        errorUpdateCount: state.errorUpdateCount + 1,
                        errorUpdatedAt: Date.now(),
                        fetchFailureCount: state.fetchFailureCount + 1,
                        fetchFailureReason: error,
                        fetchStatus: "idle",
                        status: "error"
                    };
                case "invalidate":
                    return {
                        ...state,
                        isInvalidated: true
                    };
                case "setState":
                    return {
                        ...state,
                        ...action.state
                    };
            }
        };
        this.state = reducer(this.state);
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.observers.forEach((observer)=>{
                observer.onQueryUpdate();
            });
            this.#cache.notify({
                query: this,
                type: "updated",
                action
            });
        });
    }
};
function fetchState(data, options) {
    return {
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchStatus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canFetch"])(options.networkMode) ? "fetching" : "paused",
        ...data === void 0 && {
            error: null,
            status: "pending"
        }
    };
}
function getDefaultState(options) {
    const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
    const hasData = data !== void 0;
    const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
    return {
        data,
        dataUpdateCount: 0,
        dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchMeta: null,
        isInvalidated: false,
        status: hasData ? "success" : "pending",
        fetchStatus: "idle"
    };
}
;
 //# sourceMappingURL=query.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/queryCache.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/queryCache.ts
__turbopack_context__.s([
    "QueryCache",
    ()=>QueryCache
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$query$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/query.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/subscribable.js [app-ssr] (ecmascript)");
;
;
;
;
var QueryCache = class extends __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Subscribable"] {
    constructor(config = {}){
        super();
        this.config = config;
        this.#queries = /* @__PURE__ */ new Map();
    }
    #queries;
    build(client, options, state) {
        const queryKey = options.queryKey;
        const queryHash = options.queryHash ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hashQueryKeyByOptions"])(queryKey, options);
        let query = this.get(queryHash);
        if (!query) {
            query = new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$query$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Query"]({
                client,
                queryKey,
                queryHash,
                options: client.defaultQueryOptions(options),
                state,
                defaultOptions: client.getQueryDefaults(queryKey)
            });
            this.add(query);
        }
        return query;
    }
    add(query) {
        if (!this.#queries.has(query.queryHash)) {
            this.#queries.set(query.queryHash, query);
            this.notify({
                type: "added",
                query
            });
        }
    }
    remove(query) {
        const queryInMap = this.#queries.get(query.queryHash);
        if (queryInMap) {
            query.destroy();
            if (queryInMap === query) {
                this.#queries.delete(query.queryHash);
            }
            this.notify({
                type: "removed",
                query
            });
        }
    }
    clear() {
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.getAll().forEach((query)=>{
                this.remove(query);
            });
        });
    }
    get(queryHash) {
        return this.#queries.get(queryHash);
    }
    getAll() {
        return [
            ...this.#queries.values()
        ];
    }
    find(filters) {
        const defaultedFilters = {
            exact: true,
            ...filters
        };
        return this.getAll().find((query)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchQuery"])(defaultedFilters, query));
    }
    findAll(filters = {}) {
        const queries = this.getAll();
        return Object.keys(filters).length > 0 ? queries.filter((query)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchQuery"])(filters, query)) : queries;
    }
    notify(event) {
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.listeners.forEach((listener)=>{
                listener(event);
            });
        });
    }
    onFocus() {
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.getAll().forEach((query)=>{
                query.onFocus();
            });
        });
    }
    onOnline() {
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.getAll().forEach((query)=>{
                query.onOnline();
            });
        });
    }
};
;
 //# sourceMappingURL=queryCache.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/mutation.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/mutation.ts
__turbopack_context__.s([
    "Mutation",
    ()=>Mutation,
    "getDefaultState",
    ()=>getDefaultState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$removable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/removable.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/retryer.js [app-ssr] (ecmascript)");
;
;
;
var Mutation = class extends __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$removable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Removable"] {
    #client;
    #observers;
    #mutationCache;
    #retryer;
    constructor(config){
        super();
        this.#client = config.client;
        this.mutationId = config.mutationId;
        this.#mutationCache = config.mutationCache;
        this.#observers = [];
        this.state = config.state || getDefaultState();
        this.setOptions(config.options);
        this.scheduleGc();
    }
    setOptions(options) {
        this.options = options;
        this.updateGcTime(this.options.gcTime);
    }
    get meta() {
        return this.options.meta;
    }
    addObserver(observer) {
        if (!this.#observers.includes(observer)) {
            this.#observers.push(observer);
            this.clearGcTimeout();
            this.#mutationCache.notify({
                type: "observerAdded",
                mutation: this,
                observer
            });
        }
    }
    removeObserver(observer) {
        this.#observers = this.#observers.filter((x)=>x !== observer);
        this.scheduleGc();
        this.#mutationCache.notify({
            type: "observerRemoved",
            mutation: this,
            observer
        });
    }
    optionalRemove() {
        if (!this.#observers.length) {
            if (this.state.status === "pending") {
                this.scheduleGc();
            } else {
                this.#mutationCache.remove(this);
            }
        }
    }
    continue() {
        return this.#retryer?.continue() ?? // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
        this.execute(this.state.variables);
    }
    async execute(variables) {
        const onContinue = ()=>{
            this.#dispatch({
                type: "continue"
            });
        };
        const mutationFnContext = {
            client: this.#client,
            meta: this.options.meta,
            mutationKey: this.options.mutationKey
        };
        this.#retryer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createRetryer"])({
            fn: ()=>{
                if (!this.options.mutationFn) {
                    return Promise.reject(new Error("No mutationFn found"));
                }
                return this.options.mutationFn(variables, mutationFnContext);
            },
            onFail: (failureCount, error)=>{
                this.#dispatch({
                    type: "failed",
                    failureCount,
                    error
                });
            },
            onPause: ()=>{
                this.#dispatch({
                    type: "pause"
                });
            },
            onContinue,
            retry: this.options.retry ?? 0,
            retryDelay: this.options.retryDelay,
            networkMode: this.options.networkMode,
            canRun: ()=>this.#mutationCache.canRun(this)
        });
        const restored = this.state.status === "pending";
        const isPaused = !this.#retryer.canStart();
        try {
            if (restored) {
                onContinue();
            } else {
                this.#dispatch({
                    type: "pending",
                    variables,
                    isPaused
                });
                await this.#mutationCache.config.onMutate?.(variables, this, mutationFnContext);
                const context = await this.options.onMutate?.(variables, mutationFnContext);
                if (context !== this.state.context) {
                    this.#dispatch({
                        type: "pending",
                        context,
                        variables,
                        isPaused
                    });
                }
            }
            const data = await this.#retryer.start();
            await this.#mutationCache.config.onSuccess?.(data, variables, this.state.context, this, mutationFnContext);
            await this.options.onSuccess?.(data, variables, this.state.context, mutationFnContext);
            await this.#mutationCache.config.onSettled?.(data, null, this.state.variables, this.state.context, this, mutationFnContext);
            await this.options.onSettled?.(data, null, variables, this.state.context, mutationFnContext);
            this.#dispatch({
                type: "success",
                data
            });
            return data;
        } catch (error) {
            try {
                await this.#mutationCache.config.onError?.(error, variables, this.state.context, this, mutationFnContext);
                await this.options.onError?.(error, variables, this.state.context, mutationFnContext);
                await this.#mutationCache.config.onSettled?.(void 0, error, this.state.variables, this.state.context, this, mutationFnContext);
                await this.options.onSettled?.(void 0, error, variables, this.state.context, mutationFnContext);
                throw error;
            } finally{
                this.#dispatch({
                    type: "error",
                    error
                });
            }
        } finally{
            this.#mutationCache.runNext(this);
        }
    }
    #dispatch(action) {
        const reducer = (state)=>{
            switch(action.type){
                case "failed":
                    return {
                        ...state,
                        failureCount: action.failureCount,
                        failureReason: action.error
                    };
                case "pause":
                    return {
                        ...state,
                        isPaused: true
                    };
                case "continue":
                    return {
                        ...state,
                        isPaused: false
                    };
                case "pending":
                    return {
                        ...state,
                        context: action.context,
                        data: void 0,
                        failureCount: 0,
                        failureReason: null,
                        error: null,
                        isPaused: action.isPaused,
                        status: "pending",
                        variables: action.variables,
                        submittedAt: Date.now()
                    };
                case "success":
                    return {
                        ...state,
                        data: action.data,
                        failureCount: 0,
                        failureReason: null,
                        error: null,
                        status: "success",
                        isPaused: false
                    };
                case "error":
                    return {
                        ...state,
                        data: void 0,
                        error: action.error,
                        failureCount: state.failureCount + 1,
                        failureReason: action.error,
                        isPaused: false,
                        status: "error"
                    };
            }
        };
        this.state = reducer(this.state);
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.#observers.forEach((observer)=>{
                observer.onMutationUpdate(action);
            });
            this.#mutationCache.notify({
                mutation: this,
                type: "updated",
                action
            });
        });
    }
};
function getDefaultState() {
    return {
        context: void 0,
        data: void 0,
        error: null,
        failureCount: 0,
        failureReason: null,
        isPaused: false,
        status: "idle",
        variables: void 0,
        submittedAt: 0
    };
}
;
 //# sourceMappingURL=mutation.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/mutationCache.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/mutationCache.ts
__turbopack_context__.s([
    "MutationCache",
    ()=>MutationCache
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$mutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/mutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/subscribable.js [app-ssr] (ecmascript)");
;
;
;
;
var MutationCache = class extends __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Subscribable"] {
    constructor(config = {}){
        super();
        this.config = config;
        this.#mutations = /* @__PURE__ */ new Set();
        this.#scopes = /* @__PURE__ */ new Map();
        this.#mutationId = 0;
    }
    #mutations;
    #scopes;
    #mutationId;
    build(client, options, state) {
        const mutation = new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$mutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mutation"]({
            client,
            mutationCache: this,
            mutationId: ++this.#mutationId,
            options: client.defaultMutationOptions(options),
            state
        });
        this.add(mutation);
        return mutation;
    }
    add(mutation) {
        this.#mutations.add(mutation);
        const scope = scopeFor(mutation);
        if (typeof scope === "string") {
            const scopedMutations = this.#scopes.get(scope);
            if (scopedMutations) {
                scopedMutations.push(mutation);
            } else {
                this.#scopes.set(scope, [
                    mutation
                ]);
            }
        }
        this.notify({
            type: "added",
            mutation
        });
    }
    remove(mutation) {
        if (this.#mutations.delete(mutation)) {
            const scope = scopeFor(mutation);
            if (typeof scope === "string") {
                const scopedMutations = this.#scopes.get(scope);
                if (scopedMutations) {
                    if (scopedMutations.length > 1) {
                        const index = scopedMutations.indexOf(mutation);
                        if (index !== -1) {
                            scopedMutations.splice(index, 1);
                        }
                    } else if (scopedMutations[0] === mutation) {
                        this.#scopes.delete(scope);
                    }
                }
            }
        }
        this.notify({
            type: "removed",
            mutation
        });
    }
    canRun(mutation) {
        const scope = scopeFor(mutation);
        if (typeof scope === "string") {
            const mutationsWithSameScope = this.#scopes.get(scope);
            const firstPendingMutation = mutationsWithSameScope?.find((m)=>m.state.status === "pending");
            return !firstPendingMutation || firstPendingMutation === mutation;
        } else {
            return true;
        }
    }
    runNext(mutation) {
        const scope = scopeFor(mutation);
        if (typeof scope === "string") {
            const foundMutation = this.#scopes.get(scope)?.find((m)=>m !== mutation && m.state.isPaused);
            return foundMutation?.continue() ?? Promise.resolve();
        } else {
            return Promise.resolve();
        }
    }
    clear() {
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.#mutations.forEach((mutation)=>{
                this.notify({
                    type: "removed",
                    mutation
                });
            });
            this.#mutations.clear();
            this.#scopes.clear();
        });
    }
    getAll() {
        return Array.from(this.#mutations);
    }
    find(filters) {
        const defaultedFilters = {
            exact: true,
            ...filters
        };
        return this.getAll().find((mutation)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchMutation"])(defaultedFilters, mutation));
    }
    findAll(filters = {}) {
        return this.getAll().filter((mutation)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchMutation"])(filters, mutation));
    }
    notify(event) {
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.listeners.forEach((listener)=>{
                listener(event);
            });
        });
    }
    resumePausedMutations() {
        const pausedMutations = this.getAll().filter((x)=>x.state.isPaused);
        return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>Promise.all(pausedMutations.map((mutation)=>mutation.continue().catch(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]))));
    }
};
function scopeFor(mutation) {
    return mutation.options.scope?.id;
}
;
 //# sourceMappingURL=mutationCache.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/infiniteQueryBehavior.ts
__turbopack_context__.s([
    "hasNextPage",
    ()=>hasNextPage,
    "hasPreviousPage",
    ()=>hasPreviousPage,
    "infiniteQueryBehavior",
    ()=>infiniteQueryBehavior
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
;
function infiniteQueryBehavior(pages) {
    return {
        onFetch: (context, query)=>{
            const options = context.options;
            const direction = context.fetchOptions?.meta?.fetchMore?.direction;
            const oldPages = context.state.data?.pages || [];
            const oldPageParams = context.state.data?.pageParams || [];
            let result = {
                pages: [],
                pageParams: []
            };
            let currentPage = 0;
            const fetchFn = async ()=>{
                let cancelled = false;
                const addSignalProperty = (object)=>{
                    Object.defineProperty(object, "signal", {
                        enumerable: true,
                        get: ()=>{
                            if (context.signal.aborted) {
                                cancelled = true;
                            } else {
                                context.signal.addEventListener("abort", ()=>{
                                    cancelled = true;
                                });
                            }
                            return context.signal;
                        }
                    });
                };
                const queryFn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ensureQueryFn"])(context.options, context.fetchOptions);
                const fetchPage = async (data, param, previous)=>{
                    if (cancelled) {
                        return Promise.reject();
                    }
                    if (param == null && data.pages.length) {
                        return Promise.resolve(data);
                    }
                    const createQueryFnContext = ()=>{
                        const queryFnContext2 = {
                            client: context.client,
                            queryKey: context.queryKey,
                            pageParam: param,
                            direction: previous ? "backward" : "forward",
                            meta: context.options.meta
                        };
                        addSignalProperty(queryFnContext2);
                        return queryFnContext2;
                    };
                    const queryFnContext = createQueryFnContext();
                    const page = await queryFn(queryFnContext);
                    const { maxPages } = context.options;
                    const addTo = previous ? __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addToStart"] : __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addToEnd"];
                    return {
                        pages: addTo(data.pages, page, maxPages),
                        pageParams: addTo(data.pageParams, param, maxPages)
                    };
                };
                if (direction && oldPages.length) {
                    const previous = direction === "backward";
                    const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
                    const oldData = {
                        pages: oldPages,
                        pageParams: oldPageParams
                    };
                    const param = pageParamFn(options, oldData);
                    result = await fetchPage(oldData, param, previous);
                } else {
                    const remainingPages = pages ?? oldPages.length;
                    do {
                        const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
                        if (currentPage > 0 && param == null) {
                            break;
                        }
                        result = await fetchPage(result, param);
                        currentPage++;
                    }while (currentPage < remainingPages)
                }
                return result;
            };
            if (context.options.persister) {
                context.fetchFn = ()=>{
                    return context.options.persister?.(fetchFn, {
                        client: context.client,
                        queryKey: context.queryKey,
                        meta: context.options.meta,
                        signal: context.signal
                    }, query);
                };
            } else {
                context.fetchFn = fetchFn;
            }
        }
    };
}
function getNextPageParam(options, { pages, pageParams }) {
    const lastIndex = pages.length - 1;
    return pages.length > 0 ? options.getNextPageParam(pages[lastIndex], pages, pageParams[lastIndex], pageParams) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
    return pages.length > 0 ? options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams) : void 0;
}
function hasNextPage(options, data) {
    if (!data) return false;
    return getNextPageParam(options, data) != null;
}
function hasPreviousPage(options, data) {
    if (!data || !options.getPreviousPageParam) return false;
    return getPreviousPageParam(options, data) != null;
}
;
 //# sourceMappingURL=infiniteQueryBehavior.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/queryClient.ts
__turbopack_context__.s([
    "QueryClient",
    ()=>QueryClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/queryCache.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$mutationCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/mutationCache.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$focusManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/focusManager.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/onlineManager.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$infiniteQueryBehavior$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+query-core@5.90.2/node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
var QueryClient = class {
    #queryCache;
    #mutationCache;
    #defaultOptions;
    #queryDefaults;
    #mutationDefaults;
    #mountCount;
    #unsubscribeFocus;
    #unsubscribeOnline;
    constructor(config = {}){
        this.#queryCache = config.queryCache || new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryCache"]();
        this.#mutationCache = config.mutationCache || new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$mutationCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MutationCache"]();
        this.#defaultOptions = config.defaultOptions || {};
        this.#queryDefaults = /* @__PURE__ */ new Map();
        this.#mutationDefaults = /* @__PURE__ */ new Map();
        this.#mountCount = 0;
    }
    mount() {
        this.#mountCount++;
        if (this.#mountCount !== 1) return;
        this.#unsubscribeFocus = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$focusManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["focusManager"].subscribe(async (focused)=>{
            if (focused) {
                await this.resumePausedMutations();
                this.#queryCache.onFocus();
            }
        });
        this.#unsubscribeOnline = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onlineManager"].subscribe(async (online)=>{
            if (online) {
                await this.resumePausedMutations();
                this.#queryCache.onOnline();
            }
        });
    }
    unmount() {
        this.#mountCount--;
        if (this.#mountCount !== 0) return;
        this.#unsubscribeFocus?.();
        this.#unsubscribeFocus = void 0;
        this.#unsubscribeOnline?.();
        this.#unsubscribeOnline = void 0;
    }
    isFetching(filters) {
        return this.#queryCache.findAll({
            ...filters,
            fetchStatus: "fetching"
        }).length;
    }
    isMutating(filters) {
        return this.#mutationCache.findAll({
            ...filters,
            status: "pending"
        }).length;
    }
    /**
   * Imperative (non-reactive) way to retrieve data for a QueryKey.
   * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
   *
   * Hint: Do not use this function inside a component, because it won't receive updates.
   * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
   */ getQueryData(queryKey) {
        const options = this.defaultQueryOptions({
            queryKey
        });
        return this.#queryCache.get(options.queryHash)?.state.data;
    }
    ensureQueryData(options) {
        const defaultedOptions = this.defaultQueryOptions(options);
        const query = this.#queryCache.build(this, defaultedOptions);
        const cachedData = query.state.data;
        if (cachedData === void 0) {
            return this.fetchQuery(options);
        }
        if (options.revalidateIfStale && query.isStaleByTime((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveStaleTime"])(defaultedOptions.staleTime, query))) {
            void this.prefetchQuery(defaultedOptions);
        }
        return Promise.resolve(cachedData);
    }
    getQueriesData(filters) {
        return this.#queryCache.findAll(filters).map(({ queryKey, state })=>{
            const data = state.data;
            return [
                queryKey,
                data
            ];
        });
    }
    setQueryData(queryKey, updater, options) {
        const defaultedOptions = this.defaultQueryOptions({
            queryKey
        });
        const query = this.#queryCache.get(defaultedOptions.queryHash);
        const prevData = query?.state.data;
        const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["functionalUpdate"])(updater, prevData);
        if (data === void 0) {
            return void 0;
        }
        return this.#queryCache.build(this, defaultedOptions).setData(data, {
            ...options,
            manual: true
        });
    }
    setQueriesData(filters, updater, options) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>this.#queryCache.findAll(filters).map(({ queryKey })=>[
                    queryKey,
                    this.setQueryData(queryKey, updater, options)
                ]));
    }
    getQueryState(queryKey) {
        const options = this.defaultQueryOptions({
            queryKey
        });
        return this.#queryCache.get(options.queryHash)?.state;
    }
    removeQueries(filters) {
        const queryCache = this.#queryCache;
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            queryCache.findAll(filters).forEach((query)=>{
                queryCache.remove(query);
            });
        });
    }
    resetQueries(filters, options) {
        const queryCache = this.#queryCache;
        return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            queryCache.findAll(filters).forEach((query)=>{
                query.reset();
            });
            return this.refetchQueries({
                type: "active",
                ...filters
            }, options);
        });
    }
    cancelQueries(filters, cancelOptions = {}) {
        const defaultedCancelOptions = {
            revert: true,
            ...cancelOptions
        };
        const promises = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>this.#queryCache.findAll(filters).map((query)=>query.cancel(defaultedCancelOptions)));
        return Promise.all(promises).then(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]).catch(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]);
    }
    invalidateQueries(filters, options = {}) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.#queryCache.findAll(filters).forEach((query)=>{
                query.invalidate();
            });
            if (filters?.refetchType === "none") {
                return Promise.resolve();
            }
            return this.refetchQueries({
                ...filters,
                type: filters?.refetchType ?? filters?.type ?? "active"
            }, options);
        });
    }
    refetchQueries(filters, options = {}) {
        const fetchOptions = {
            ...options,
            cancelRefetch: options.cancelRefetch ?? true
        };
        const promises = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>this.#queryCache.findAll(filters).filter((query)=>!query.isDisabled() && !query.isStatic()).map((query)=>{
                let promise = query.fetch(void 0, fetchOptions);
                if (!fetchOptions.throwOnError) {
                    promise = promise.catch(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]);
                }
                return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
            }));
        return Promise.all(promises).then(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]);
    }
    fetchQuery(options) {
        const defaultedOptions = this.defaultQueryOptions(options);
        if (defaultedOptions.retry === void 0) {
            defaultedOptions.retry = false;
        }
        const query = this.#queryCache.build(this, defaultedOptions);
        return query.isStaleByTime((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveStaleTime"])(defaultedOptions.staleTime, query)) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
    }
    prefetchQuery(options) {
        return this.fetchQuery(options).then(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]).catch(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]);
    }
    fetchInfiniteQuery(options) {
        options.behavior = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$infiniteQueryBehavior$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["infiniteQueryBehavior"])(options.pages);
        return this.fetchQuery(options);
    }
    prefetchInfiniteQuery(options) {
        return this.fetchInfiniteQuery(options).then(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]).catch(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]);
    }
    ensureInfiniteQueryData(options) {
        options.behavior = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$infiniteQueryBehavior$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["infiniteQueryBehavior"])(options.pages);
        return this.ensureQueryData(options);
    }
    resumePausedMutations() {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onlineManager"].isOnline()) {
            return this.#mutationCache.resumePausedMutations();
        }
        return Promise.resolve();
    }
    getQueryCache() {
        return this.#queryCache;
    }
    getMutationCache() {
        return this.#mutationCache;
    }
    getDefaultOptions() {
        return this.#defaultOptions;
    }
    setDefaultOptions(options) {
        this.#defaultOptions = options;
    }
    setQueryDefaults(queryKey, options) {
        this.#queryDefaults.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hashKey"])(queryKey), {
            queryKey,
            defaultOptions: options
        });
    }
    getQueryDefaults(queryKey) {
        const defaults = [
            ...this.#queryDefaults.values()
        ];
        const result = {};
        defaults.forEach((queryDefault)=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["partialMatchKey"])(queryKey, queryDefault.queryKey)) {
                Object.assign(result, queryDefault.defaultOptions);
            }
        });
        return result;
    }
    setMutationDefaults(mutationKey, options) {
        this.#mutationDefaults.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hashKey"])(mutationKey), {
            mutationKey,
            defaultOptions: options
        });
    }
    getMutationDefaults(mutationKey) {
        const defaults = [
            ...this.#mutationDefaults.values()
        ];
        const result = {};
        defaults.forEach((queryDefault)=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["partialMatchKey"])(mutationKey, queryDefault.mutationKey)) {
                Object.assign(result, queryDefault.defaultOptions);
            }
        });
        return result;
    }
    defaultQueryOptions(options) {
        if (options._defaulted) {
            return options;
        }
        const defaultedOptions = {
            ...this.#defaultOptions.queries,
            ...this.getQueryDefaults(options.queryKey),
            ...options,
            _defaulted: true
        };
        if (!defaultedOptions.queryHash) {
            defaultedOptions.queryHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hashQueryKeyByOptions"])(defaultedOptions.queryKey, defaultedOptions);
        }
        if (defaultedOptions.refetchOnReconnect === void 0) {
            defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
        }
        if (defaultedOptions.throwOnError === void 0) {
            defaultedOptions.throwOnError = !!defaultedOptions.suspense;
        }
        if (!defaultedOptions.networkMode && defaultedOptions.persister) {
            defaultedOptions.networkMode = "offlineFirst";
        }
        if (defaultedOptions.queryFn === __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$2$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["skipToken"]) {
            defaultedOptions.enabled = false;
        }
        return defaultedOptions;
    }
    defaultMutationOptions(options) {
        if (options?._defaulted) {
            return options;
        }
        return {
            ...this.#defaultOptions.mutations,
            ...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
            ...options,
            _defaulted: true
        };
    }
    clear() {
        this.#queryCache.clear();
        this.#mutationCache.clear();
    }
};
;
 //# sourceMappingURL=queryClient.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxRuntime; //# sourceMappingURL=react-jsx-runtime.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@tanstack+react-query@5.90.2_react@19.3.0-canary-a4eb2dfa-20251006/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryClientContext",
    ()=>QueryClientContext,
    "QueryClientProvider",
    ()=>QueryClientProvider,
    "useQueryClient",
    ()=>useQueryClient
]);
// src/QueryClientProvider.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
var QueryClientContext = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"](void 0);
var useQueryClient = (queryClient)=>{
    const client = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"](QueryClientContext);
    if (queryClient) {
        return queryClient;
    }
    if (!client) {
        throw new Error("No QueryClient set, use QueryClientProvider to set one");
    }
    return client;
};
var QueryClientProvider = ({ client, children })=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        client.mount();
        return ()=>{
            client.unmount();
        };
    }, [
        client
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(QueryClientContext.Provider, {
        value: client,
        children
    });
};
;
 //# sourceMappingURL=QueryClientProvider.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@swc+helpers@0.5.15/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) return obj;
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") return {
        default: obj
    };
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) return cache.get(obj);
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
            else newObj[key] = obj[key];
        }
    }
    newObj.default = obj;
    if (cache) cache.set(obj, newObj);
    return newObj;
}
exports._ = _interop_require_wildcard;
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assign: null,
    searchParamsToUrlQuery: null,
    urlQueryToSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    assign: function() {
        return assign;
    },
    searchParamsToUrlQuery: function() {
        return searchParamsToUrlQuery;
    },
    urlQueryToSearchParams: function() {
        return urlQueryToSearchParams;
    }
});
function searchParamsToUrlQuery(searchParams) {
    const query = {};
    for (const [key, value] of searchParams.entries()){
        const existing = query[key];
        if (typeof existing === 'undefined') {
            query[key] = value;
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            query[key] = [
                existing,
                value
            ];
        }
    }
    return query;
}
function stringifyUrlQueryParam(param) {
    if (typeof param === 'string') {
        return param;
    }
    if (typeof param === 'number' && !isNaN(param) || typeof param === 'boolean') {
        return String(param);
    } else {
        return '';
    }
}
function urlQueryToSearchParams(query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)){
        if (Array.isArray(value)) {
            for (const item of value){
                searchParams.append(key, stringifyUrlQueryParam(item));
            }
        } else {
            searchParams.set(key, stringifyUrlQueryParam(value));
        }
    }
    return searchParams;
}
function assign(target, ...searchParamsList) {
    for (const searchParams of searchParamsList){
        for (const key of searchParams.keys()){
            target.delete(key);
        }
        for (const [key, value] of searchParams.entries()){
            target.append(key, value);
        }
    }
    return target;
} //# sourceMappingURL=querystring.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Format function modified from nodejs
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    formatUrl: null,
    formatWithValidation: null,
    urlObjectKeys: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    formatUrl: function() {
        return formatUrl;
    },
    formatWithValidation: function() {
        return formatWithValidation;
    },
    urlObjectKeys: function() {
        return urlObjectKeys;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@swc+helpers@0.5.15/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-ssr] (ecmascript)");
const _querystring = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-ssr] (ecmascript)"));
const slashedProtocols = /https?|ftp|gopher|file/;
function formatUrl(urlObj) {
    let { auth, hostname } = urlObj;
    let protocol = urlObj.protocol || '';
    let pathname = urlObj.pathname || '';
    let hash = urlObj.hash || '';
    let query = urlObj.query || '';
    let host = false;
    auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ':') + '@' : '';
    if (urlObj.host) {
        host = auth + urlObj.host;
    } else if (hostname) {
        host = auth + (~hostname.indexOf(':') ? `[${hostname}]` : hostname);
        if (urlObj.port) {
            host += ':' + urlObj.port;
        }
    }
    if (query && typeof query === 'object') {
        query = String(_querystring.urlQueryToSearchParams(query));
    }
    let search = urlObj.search || query && `?${query}` || '';
    if (protocol && !protocol.endsWith(':')) protocol += ':';
    if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname[0] !== '/') pathname = '/' + pathname;
    } else if (!host) {
        host = '';
    }
    if (hash && hash[0] !== '#') hash = '#' + hash;
    if (search && search[0] !== '?') search = '?' + search;
    pathname = pathname.replace(/[?#]/g, encodeURIComponent);
    search = search.replace('#', '%23');
    return `${protocol}${host}${pathname}${search}${hash}`;
}
const urlObjectKeys = [
    'auth',
    'hash',
    'host',
    'hostname',
    'href',
    'path',
    'pathname',
    'port',
    'protocol',
    'query',
    'search',
    'slashes'
];
function formatWithValidation(url) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (url !== null && typeof url === 'object') {
            Object.keys(url).forEach((key)=>{
                if (!urlObjectKeys.includes(key)) {
                    console.warn(`Unknown key passed via urlObject into url.format: ${key}`);
                }
            });
        }
    }
    return formatUrl(url);
} //# sourceMappingURL=format-url.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/app-router-context.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['contexts'].AppRouterContext; //# sourceMappingURL=app-router-context.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/use-merged-ref.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useMergedRef", {
    enumerable: true,
    get: function() {
        return useMergedRef;
    }
});
const _react = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
function useMergedRef(refA, refB) {
    const cleanupA = (0, _react.useRef)(null);
    const cleanupB = (0, _react.useRef)(null);
    // NOTE: In theory, we could skip the wrapping if only one of the refs is non-null.
    // (this happens often if the user doesn't pass a ref to Link/Form/Image)
    // But this can cause us to leak a cleanup-ref into user code (previously via `<Link legacyBehavior>`),
    // and the user might pass that ref into ref-merging library that doesn't support cleanup refs
    // (because it hasn't been updated for React 19)
    // which can then cause things to blow up, because a cleanup-returning ref gets called with `null`.
    // So in practice, it's safer to be defensive and always wrap the ref, even on React 19.
    return (0, _react.useCallback)((current)=>{
        if (current === null) {
            const cleanupFnA = cleanupA.current;
            if (cleanupFnA) {
                cleanupA.current = null;
                cleanupFnA();
            }
            const cleanupFnB = cleanupB.current;
            if (cleanupFnB) {
                cleanupB.current = null;
                cleanupFnB();
            }
        } else {
            if (refA) {
                cleanupA.current = applyRef(refA, current);
            }
            if (refB) {
                cleanupB.current = applyRef(refB, current);
            }
        }
    }, [
        refA,
        refB
    ]);
}
function applyRef(refA, current) {
    if (typeof refA === 'function') {
        const cleanup = refA(current);
        if (typeof cleanup === 'function') {
            return cleanup;
        } else {
            return ()=>refA(null);
        }
    } else {
        refA.current = current;
        return ()=>{
            refA.current = null;
        };
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=use-merged-ref.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/utils.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DecodeError: null,
    MiddlewareNotFoundError: null,
    MissingStaticPage: null,
    NormalizeError: null,
    PageNotFoundError: null,
    SP: null,
    ST: null,
    WEB_VITALS: null,
    execOnce: null,
    getDisplayName: null,
    getLocationOrigin: null,
    getURL: null,
    isAbsoluteUrl: null,
    isResSent: null,
    loadGetInitialProps: null,
    normalizeRepeatedSlashes: null,
    stringifyError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DecodeError: function() {
        return DecodeError;
    },
    MiddlewareNotFoundError: function() {
        return MiddlewareNotFoundError;
    },
    MissingStaticPage: function() {
        return MissingStaticPage;
    },
    NormalizeError: function() {
        return NormalizeError;
    },
    PageNotFoundError: function() {
        return PageNotFoundError;
    },
    SP: function() {
        return SP;
    },
    ST: function() {
        return ST;
    },
    WEB_VITALS: function() {
        return WEB_VITALS;
    },
    execOnce: function() {
        return execOnce;
    },
    getDisplayName: function() {
        return getDisplayName;
    },
    getLocationOrigin: function() {
        return getLocationOrigin;
    },
    getURL: function() {
        return getURL;
    },
    isAbsoluteUrl: function() {
        return isAbsoluteUrl;
    },
    isResSent: function() {
        return isResSent;
    },
    loadGetInitialProps: function() {
        return loadGetInitialProps;
    },
    normalizeRepeatedSlashes: function() {
        return normalizeRepeatedSlashes;
    },
    stringifyError: function() {
        return stringifyError;
    }
});
const WEB_VITALS = [
    'CLS',
    'FCP',
    'FID',
    'INP',
    'LCP',
    'TTFB'
];
function execOnce(fn) {
    let used = false;
    let result;
    return (...args)=>{
        if (!used) {
            used = true;
            result = fn(...args);
        }
        return result;
    };
}
// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const isAbsoluteUrl = (url)=>ABSOLUTE_URL_REGEX.test(url);
function getLocationOrigin() {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}
function getURL() {
    const { href } = window.location;
    const origin = getLocationOrigin();
    return href.substring(origin.length);
}
function getDisplayName(Component) {
    return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Unknown';
}
function isResSent(res) {
    return res.finished || res.headersSent;
}
function normalizeRepeatedSlashes(url) {
    const urlParts = url.split('?');
    const urlNoQuery = urlParts[0];
    return urlNoQuery // first we replace any non-encoded backslashes with forward
    // then normalize repeated forward slashes
    .replace(/\\/g, '/').replace(/\/\/+/g, '/') + (urlParts[1] ? `?${urlParts.slice(1).join('?')}` : '');
}
async function loadGetInitialProps(App, ctx) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (App.prototype?.getInitialProps) {
            const message = `"${getDisplayName(App)}.getInitialProps()" is defined as an instance method - visit https://nextjs.org/docs/messages/get-initial-props-as-an-instance-method for more information.`;
            throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
                value: "E394",
                enumerable: false,
                configurable: true
            });
        }
    }
    // when called from _app `ctx` is nested in `ctx`
    const res = ctx.res || ctx.ctx && ctx.ctx.res;
    if (!App.getInitialProps) {
        if (ctx.ctx && ctx.Component) {
            // @ts-ignore pageProps default
            return {
                pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
            };
        }
        return {};
    }
    const props = await App.getInitialProps(ctx);
    if (res && isResSent(res)) {
        return props;
    }
    if (!props) {
        const message = `"${getDisplayName(App)}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
        throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: false,
            configurable: true
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (Object.keys(props).length === 0 && !ctx.ctx) {
            console.warn(`${getDisplayName(App)} returned an empty object from \`getInitialProps\`. This de-optimizes and prevents automatic static optimization. https://nextjs.org/docs/messages/empty-object-getInitialProps`);
        }
    }
    return props;
}
const SP = typeof performance !== 'undefined';
const ST = SP && [
    'mark',
    'measure',
    'getEntriesByName'
].every((method)=>typeof performance[method] === 'function');
class DecodeError extends Error {
}
class NormalizeError extends Error {
}
class PageNotFoundError extends Error {
    constructor(page){
        super();
        this.code = 'ENOENT';
        this.name = 'PageNotFoundError';
        this.message = `Cannot find module for page: ${page}`;
    }
}
class MissingStaticPage extends Error {
    constructor(page, message){
        super();
        this.message = `Failed to load static file for page: ${page} ${message}`;
    }
}
class MiddlewareNotFoundError extends Error {
    constructor(){
        super();
        this.code = 'ENOENT';
        this.message = `Cannot find the middleware module`;
    }
}
function stringifyError(error) {
    return JSON.stringify({
        message: error.message,
        stack: error.stack
    });
} //# sourceMappingURL=utils.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/router/utils/parse-path.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Given a path this function will find the pathname, query and hash and return
 * them. This is useful to parse full paths on the client side.
 * @param path A path to parse e.g. /foo/bar?id=1#hash
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parsePath", {
    enumerable: true,
    get: function() {
        return parsePath;
    }
});
function parsePath(path) {
    const hashIndex = path.indexOf('#');
    const queryIndex = path.indexOf('?');
    const hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);
    if (hasQuery || hashIndex > -1) {
        return {
            pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
            query: hasQuery ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : undefined) : '',
            hash: hashIndex > -1 ? path.slice(hashIndex) : ''
        };
    }
    return {
        pathname: path,
        query: '',
        hash: ''
    };
} //# sourceMappingURL=parse-path.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/router/utils/add-path-prefix.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addPathPrefix", {
    enumerable: true,
    get: function() {
        return addPathPrefix;
    }
});
const _parsepath = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/router/utils/parse-path.js [app-ssr] (ecmascript)");
function addPathPrefix(path, prefix) {
    if (!path.startsWith('/') || !prefix) {
        return path;
    }
    const { pathname, query, hash } = (0, _parsepath.parsePath)(path);
    return `${prefix}${pathname}${query}${hash}`;
} //# sourceMappingURL=add-path-prefix.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/router/utils/remove-trailing-slash.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Removes the trailing slash for a given route or page path. Preserves the
 * root page. Examples:
 *   - `/foo/bar/` -> `/foo/bar`
 *   - `/foo/bar` -> `/foo/bar`
 *   - `/` -> `/`
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "removeTrailingSlash", {
    enumerable: true,
    get: function() {
        return removeTrailingSlash;
    }
});
function removeTrailingSlash(route) {
    return route.replace(/\/$/, '') || '/';
} //# sourceMappingURL=remove-trailing-slash.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/normalize-trailing-slash.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizePathTrailingSlash", {
    enumerable: true,
    get: function() {
        return normalizePathTrailingSlash;
    }
});
const _removetrailingslash = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/router/utils/remove-trailing-slash.js [app-ssr] (ecmascript)");
const _parsepath = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/router/utils/parse-path.js [app-ssr] (ecmascript)");
const normalizePathTrailingSlash = (path)=>{
    if (!path.startsWith('/') || ("TURBOPACK compile-time value", void 0)) {
        return path;
    }
    const { pathname, query, hash } = (0, _parsepath.parsePath)(path);
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return `${(0, _removetrailingslash.removeTrailingSlash)(pathname)}${query}${hash}`;
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=normalize-trailing-slash.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/add-base-path.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addBasePath", {
    enumerable: true,
    get: function() {
        return addBasePath;
    }
});
const _addpathprefix = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/router/utils/add-path-prefix.js [app-ssr] (ecmascript)");
const _normalizetrailingslash = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/normalize-trailing-slash.js [app-ssr] (ecmascript)");
const basePath = ("TURBOPACK compile-time value", "") || '';
function addBasePath(path, required) {
    return (0, _normalizetrailingslash.normalizePathTrailingSlash)(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : (0, _addpathprefix.addPathPrefix)(path, basePath));
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=add-base-path.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/utils/warn-once.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "warnOnce", {
    enumerable: true,
    get: function() {
        return warnOnce;
    }
});
let warnOnce = (_)=>{};
if ("TURBOPACK compile-time truthy", 1) {
    const warnings = new Set();
    warnOnce = (msg)=>{
        if (!warnings.has(msg)) {
            console.warn(msg);
        }
        warnings.add(msg);
    };
} //# sourceMappingURL=warn-once.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/segment-cache.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Entry point to the Segment Cache implementation.
 *
 * All code related to the Segment Cache lives `segment-cache-impl` directory.
 * Callers access it through this indirection.
 *
 * This is to ensure the code is dead code eliminated from the bundle if the
 * flag is disabled.
 *
 * TODO: This is super tedious. Since experimental flags are an essential part
 * of our workflow, we should establish a better pattern for dead code
 * elimination. Ideally it would be done at the bundler level, like how React's
 * build process works. In the React repo, you don't even need to add any extra
 * configuration per experiment — if the code is not reachable, it gets stripped
 * from the build automatically by Rollup. Or, shorter term, we could stub out
 * experimental modules at build time by updating the build config, i.e. a more
 * automated version of what I'm doing manually in this file.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    FetchStrategy: null,
    NavigationResultTag: null,
    PrefetchPriority: null,
    cancelPrefetchTask: null,
    createCacheKey: null,
    getCurrentCacheVersion: null,
    isPrefetchTaskDirty: null,
    navigate: null,
    prefetch: null,
    reschedulePrefetchTask: null,
    revalidateEntireCache: null,
    schedulePrefetchTask: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    FetchStrategy: function() {
        return FetchStrategy;
    },
    NavigationResultTag: function() {
        return NavigationResultTag;
    },
    PrefetchPriority: function() {
        return PrefetchPriority;
    },
    cancelPrefetchTask: function() {
        return cancelPrefetchTask;
    },
    createCacheKey: function() {
        return createCacheKey;
    },
    getCurrentCacheVersion: function() {
        return getCurrentCacheVersion;
    },
    isPrefetchTaskDirty: function() {
        return isPrefetchTaskDirty;
    },
    navigate: function() {
        return navigate;
    },
    prefetch: function() {
        return prefetch;
    },
    reschedulePrefetchTask: function() {
        return reschedulePrefetchTask;
    },
    revalidateEntireCache: function() {
        return revalidateEntireCache;
    },
    schedulePrefetchTask: function() {
        return schedulePrefetchTask;
    }
});
const notEnabled = ()=>{
    throw Object.defineProperty(new Error('Segment Cache experiment is not enabled. This is a bug in Next.js.'), "__NEXT_ERROR_CODE", {
        value: "E654",
        enumerable: false,
        configurable: true
    });
};
const prefetch = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : notEnabled;
const navigate = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : notEnabled;
const revalidateEntireCache = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : notEnabled;
const getCurrentCacheVersion = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : notEnabled;
const schedulePrefetchTask = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : notEnabled;
const cancelPrefetchTask = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : notEnabled;
const reschedulePrefetchTask = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : notEnabled;
const isPrefetchTaskDirty = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : notEnabled;
const createCacheKey = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : notEnabled;
var NavigationResultTag = /*#__PURE__*/ function(NavigationResultTag) {
    NavigationResultTag[NavigationResultTag["MPA"] = 0] = "MPA";
    NavigationResultTag[NavigationResultTag["Success"] = 1] = "Success";
    NavigationResultTag[NavigationResultTag["NoOp"] = 2] = "NoOp";
    NavigationResultTag[NavigationResultTag["Async"] = 3] = "Async";
    return NavigationResultTag;
}({});
var PrefetchPriority = /*#__PURE__*/ function(PrefetchPriority) {
    /**
   * Assigned to the most recently hovered/touched link. Special network
   * bandwidth is reserved for this task only. There's only ever one Intent-
   * priority task at a time; when a new Intent task is scheduled, the previous
   * one is bumped down to Default.
   */ PrefetchPriority[PrefetchPriority["Intent"] = 2] = "Intent";
    /**
   * The default priority for prefetch tasks.
   */ PrefetchPriority[PrefetchPriority["Default"] = 1] = "Default";
    /**
   * Assigned to tasks when they spawn non-blocking background work, like
   * revalidating a partially cached entry to see if more data is available.
   */ PrefetchPriority[PrefetchPriority["Background"] = 0] = "Background";
    return PrefetchPriority;
}({});
var FetchStrategy = /*#__PURE__*/ function(FetchStrategy) {
    // Deliberately ordered so we can easily compare two segments
    // and determine if one segment is "more specific" than another
    // (i.e. if it's likely that it contains more data)
    FetchStrategy[FetchStrategy["LoadingBoundary"] = 0] = "LoadingBoundary";
    FetchStrategy[FetchStrategy["PPR"] = 1] = "PPR";
    FetchStrategy[FetchStrategy["PPRRuntime"] = 2] = "PPRRuntime";
    FetchStrategy[FetchStrategy["Full"] = 3] = "Full";
    return FetchStrategy;
}({});
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=segment-cache.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/router-reducer/router-reducer-types.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ACTION_HMR_REFRESH: null,
    ACTION_NAVIGATE: null,
    ACTION_PREFETCH: null,
    ACTION_REFRESH: null,
    ACTION_RESTORE: null,
    ACTION_SERVER_ACTION: null,
    ACTION_SERVER_PATCH: null,
    PrefetchCacheEntryStatus: null,
    PrefetchKind: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ACTION_HMR_REFRESH: function() {
        return ACTION_HMR_REFRESH;
    },
    ACTION_NAVIGATE: function() {
        return ACTION_NAVIGATE;
    },
    ACTION_PREFETCH: function() {
        return ACTION_PREFETCH;
    },
    ACTION_REFRESH: function() {
        return ACTION_REFRESH;
    },
    ACTION_RESTORE: function() {
        return ACTION_RESTORE;
    },
    ACTION_SERVER_ACTION: function() {
        return ACTION_SERVER_ACTION;
    },
    ACTION_SERVER_PATCH: function() {
        return ACTION_SERVER_PATCH;
    },
    PrefetchCacheEntryStatus: function() {
        return PrefetchCacheEntryStatus;
    },
    PrefetchKind: function() {
        return PrefetchKind;
    }
});
const ACTION_REFRESH = 'refresh';
const ACTION_NAVIGATE = 'navigate';
const ACTION_RESTORE = 'restore';
const ACTION_SERVER_PATCH = 'server-patch';
const ACTION_PREFETCH = 'prefetch';
const ACTION_HMR_REFRESH = 'hmr-refresh';
const ACTION_SERVER_ACTION = 'server-action';
var PrefetchKind = /*#__PURE__*/ function(PrefetchKind) {
    PrefetchKind["AUTO"] = "auto";
    PrefetchKind["FULL"] = "full";
    PrefetchKind["TEMPORARY"] = "temporary";
    return PrefetchKind;
}({});
var PrefetchCacheEntryStatus = /*#__PURE__*/ function(PrefetchCacheEntryStatus) {
    PrefetchCacheEntryStatus["fresh"] = "fresh";
    PrefetchCacheEntryStatus["reusable"] = "reusable";
    PrefetchCacheEntryStatus["expired"] = "expired";
    PrefetchCacheEntryStatus["stale"] = "stale";
    return PrefetchCacheEntryStatus;
}({});
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=router-reducer-types.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/invariant-error.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InvariantError", {
    enumerable: true,
    get: function() {
        return InvariantError;
    }
});
class InvariantError extends Error {
    constructor(message, options){
        super(`Invariant: ${message.endsWith('.') ? message : message + '.'} This is a bug in Next.js.`, options);
        this.name = 'InvariantError';
    }
} //# sourceMappingURL=invariant-error.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/links.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    IDLE_LINK_STATUS: null,
    PENDING_LINK_STATUS: null,
    mountFormInstance: null,
    mountLinkInstance: null,
    onLinkVisibilityChanged: null,
    onNavigationIntent: null,
    pingVisibleLinks: null,
    setLinkForCurrentNavigation: null,
    unmountLinkForCurrentNavigation: null,
    unmountPrefetchableInstance: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    IDLE_LINK_STATUS: function() {
        return IDLE_LINK_STATUS;
    },
    PENDING_LINK_STATUS: function() {
        return PENDING_LINK_STATUS;
    },
    mountFormInstance: function() {
        return mountFormInstance;
    },
    mountLinkInstance: function() {
        return mountLinkInstance;
    },
    onLinkVisibilityChanged: function() {
        return onLinkVisibilityChanged;
    },
    onNavigationIntent: function() {
        return onNavigationIntent;
    },
    pingVisibleLinks: function() {
        return pingVisibleLinks;
    },
    setLinkForCurrentNavigation: function() {
        return setLinkForCurrentNavigation;
    },
    unmountLinkForCurrentNavigation: function() {
        return unmountLinkForCurrentNavigation;
    },
    unmountPrefetchableInstance: function() {
        return unmountPrefetchableInstance;
    }
});
const _segmentcache = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/segment-cache.js [app-ssr] (ecmascript)");
const _react = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
const _routerreducertypes = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/router-reducer/router-reducer-types.js [app-ssr] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
// Tracks the most recently navigated link instance. When null, indicates
// the current navigation was not initiated by a link click.
let linkForMostRecentNavigation = null;
const PENDING_LINK_STATUS = {
    pending: true
};
const IDLE_LINK_STATUS = {
    pending: false
};
function setLinkForCurrentNavigation(link) {
    (0, _react.startTransition)(()=>{
        linkForMostRecentNavigation?.setOptimisticLinkStatus(IDLE_LINK_STATUS);
        link?.setOptimisticLinkStatus(PENDING_LINK_STATUS);
        linkForMostRecentNavigation = link;
    });
}
function unmountLinkForCurrentNavigation(link) {
    if (linkForMostRecentNavigation === link) {
        linkForMostRecentNavigation = null;
    }
}
// Use a WeakMap to associate a Link instance with its DOM element. This is
// used by the IntersectionObserver to track the link's visibility.
const prefetchable = typeof WeakMap === 'function' ? new WeakMap() : new Map();
// A Set of the currently visible links. We re-prefetch visible links after a
// cache invalidation, or when the current URL changes. It's a separate data
// structure from the WeakMap above because only the visible links need to
// be enumerated.
const prefetchableAndVisible = new Set();
// A single IntersectionObserver instance shared by all <Link> components.
const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(handleIntersect, {
    rootMargin: '200px'
}) : null;
function observeVisibility(element, instance) {
    const existingInstance = prefetchable.get(element);
    if (existingInstance !== undefined) {
        // This shouldn't happen because each <Link> component should have its own
        // anchor tag instance, but it's defensive coding to avoid a memory leak in
        // case there's a logical error somewhere else.
        unmountPrefetchableInstance(element);
    }
    // Only track prefetchable links that have a valid prefetch URL
    prefetchable.set(element, instance);
    if (observer !== null) {
        observer.observe(element);
    }
}
function coercePrefetchableUrl(href) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        return null;
    }
}
function mountLinkInstance(element, href, router, fetchStrategy, prefetchEnabled, setOptimisticLinkStatus) {
    if (prefetchEnabled) {
        const prefetchURL = coercePrefetchableUrl(href);
        if (prefetchURL !== null) {
            const instance = {
                router,
                fetchStrategy,
                isVisible: false,
                prefetchTask: null,
                prefetchHref: prefetchURL.href,
                setOptimisticLinkStatus
            };
            // We only observe the link's visibility if it's prefetchable. For
            // example, this excludes links to external URLs.
            observeVisibility(element, instance);
            return instance;
        }
    }
    // If the link is not prefetchable, we still create an instance so we can
    // track its optimistic state (i.e. useLinkStatus).
    const instance = {
        router,
        fetchStrategy,
        isVisible: false,
        prefetchTask: null,
        prefetchHref: null,
        setOptimisticLinkStatus
    };
    return instance;
}
function mountFormInstance(element, href, router, fetchStrategy) {
    const prefetchURL = coercePrefetchableUrl(href);
    if (prefetchURL === null) {
        // This href is not prefetchable, so we don't track it.
        // TODO: We currently observe/unobserve a form every time its href changes.
        // For Links, this isn't a big deal because the href doesn't usually change,
        // but for forms it's extremely common. We should optimize this.
        return;
    }
    const instance = {
        router,
        fetchStrategy,
        isVisible: false,
        prefetchTask: null,
        prefetchHref: prefetchURL.href,
        setOptimisticLinkStatus: null
    };
    observeVisibility(element, instance);
}
function unmountPrefetchableInstance(element) {
    const instance = prefetchable.get(element);
    if (instance !== undefined) {
        prefetchable.delete(element);
        prefetchableAndVisible.delete(instance);
        const prefetchTask = instance.prefetchTask;
        if (prefetchTask !== null) {
            (0, _segmentcache.cancelPrefetchTask)(prefetchTask);
        }
    }
    if (observer !== null) {
        observer.unobserve(element);
    }
}
function handleIntersect(entries) {
    for (const entry of entries){
        // Some extremely old browsers or polyfills don't reliably support
        // isIntersecting so we check intersectionRatio instead. (Do we care? Not
        // really. But whatever this is fine.)
        const isVisible = entry.intersectionRatio > 0;
        onLinkVisibilityChanged(entry.target, isVisible);
    }
}
function onLinkVisibilityChanged(element, isVisible) {
    if ("TURBOPACK compile-time truthy", 1) {
        // Prefetching on viewport is disabled in development for performance
        // reasons, because it requires compiling the target page.
        // TODO: Investigate re-enabling this.
        return;
    }
    //TURBOPACK unreachable
    ;
    const instance = undefined;
}
function onNavigationIntent(element, unstable_upgradeToDynamicPrefetch) {
    const instance = prefetchable.get(element);
    if (instance === undefined) {
        return;
    }
    // Prefetch the link on hover/touchstart.
    if (instance !== undefined) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        rescheduleLinkPrefetch(instance, _segmentcache.PrefetchPriority.Intent);
    }
}
function rescheduleLinkPrefetch(instance, priority) {
    // Ensures that app-router-instance is not compiled in the server bundle
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function pingVisibleLinks(nextUrl, tree) {
    // For each currently visible link, cancel the existing prefetch task (if it
    // exists) and schedule a new one. This is effectively the same as if all the
    // visible links left and then re-entered the viewport.
    //
    // This is called when the Next-Url or the base tree changes, since those
    // may affect the result of a prefetch task. It's also called after a
    // cache invalidation.
    for (const instance of prefetchableAndVisible){
        const task = instance.prefetchTask;
        if (task !== null && !(0, _segmentcache.isPrefetchTaskDirty)(task, nextUrl, tree)) {
            continue;
        }
        // Something changed. Cancel the existing prefetch task and schedule a
        // new one.
        if (task !== null) {
            (0, _segmentcache.cancelPrefetchTask)(task);
        }
        const cacheKey = (0, _segmentcache.createCacheKey)(instance.prefetchHref, nextUrl);
        instance.prefetchTask = (0, _segmentcache.schedulePrefetchTask)(cacheKey, tree, instance.fetchStrategy, _segmentcache.PrefetchPriority.Default, null);
    }
}
function prefetchWithOldCacheImplementation(instance) {
    // This is the path used when the Segment Cache is not enabled.
    if ("TURBOPACK compile-time truthy", 1) {
        return;
    }
    //TURBOPACK unreachable
    ;
    const doPrefetch = undefined;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=links.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/router/utils/path-has-prefix.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "pathHasPrefix", {
    enumerable: true,
    get: function() {
        return pathHasPrefix;
    }
});
const _parsepath = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/router/utils/parse-path.js [app-ssr] (ecmascript)");
function pathHasPrefix(path, prefix) {
    if (typeof path !== 'string') {
        return false;
    }
    const { pathname } = (0, _parsepath.parsePath)(path);
    return pathname === prefix || pathname.startsWith(prefix + '/');
} //# sourceMappingURL=path-has-prefix.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/has-base-path.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hasBasePath", {
    enumerable: true,
    get: function() {
        return hasBasePath;
    }
});
const _pathhasprefix = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/router/utils/path-has-prefix.js [app-ssr] (ecmascript)");
const basePath = ("TURBOPACK compile-time value", "") || '';
function hasBasePath(path) {
    return (0, _pathhasprefix.pathHasPrefix)(path, basePath);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=has-base-path.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isLocalURL", {
    enumerable: true,
    get: function() {
        return isLocalURL;
    }
});
const _utils = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/utils.js [app-ssr] (ecmascript)");
const _hasbasepath = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/has-base-path.js [app-ssr] (ecmascript)");
function isLocalURL(url) {
    // prevent a hydration mismatch on href for url with anchor refs
    if (!(0, _utils.isAbsoluteUrl)(url)) return true;
    try {
        // absolute urls can be local if they are on the same origin
        const locationOrigin = (0, _utils.getLocationOrigin)();
        const resolved = new URL(url, locationOrigin);
        return resolved.origin === locationOrigin && (0, _hasbasepath.hasBasePath)(resolved.pathname);
    } catch (_) {
        return false;
    }
} //# sourceMappingURL=is-local-url.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    useLinkStatus: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    /**
 * A React component that extends the HTML `<a>` element to provide
 * [prefetching](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)
 * and client-side navigation. This is the primary way to navigate between routes in Next.js.
 *
 * @remarks
 * - Prefetching is only enabled in production.
 *
 * @see https://nextjs.org/docs/app/api-reference/components/link
 */ default: function() {
        return LinkComponent;
    },
    useLinkStatus: function() {
        return useLinkStatus;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/@swc+helpers@0.5.15/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-ssr] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)"));
const _formaturl = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-ssr] (ecmascript)");
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/app-router-context.js [app-ssr] (ecmascript)");
const _usemergedref = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/use-merged-ref.js [app-ssr] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/utils.js [app-ssr] (ecmascript)");
const _addbasepath = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/add-base-path.js [app-ssr] (ecmascript)");
const _warnonce = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/utils/warn-once.js [app-ssr] (ecmascript)");
const _links = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/links.js [app-ssr] (ecmascript)");
const _islocalurl = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-ssr] (ecmascript)");
const _segmentcache = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/segment-cache.js [app-ssr] (ecmascript)");
function isModifiedEvent(event) {
    const eventTarget = event.currentTarget;
    const target = eventTarget.getAttribute('target');
    return target && target !== '_self' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || // triggers resource download
    event.nativeEvent && event.nativeEvent.which === 2;
}
function linkClicked(e, href, as, linkInstanceRef, replace, scroll, onNavigate) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function formatStringOrUrl(urlObjOrString) {
    if (typeof urlObjOrString === 'string') {
        return urlObjOrString;
    }
    return (0, _formaturl.formatUrl)(urlObjOrString);
}
function LinkComponent(props) {
    const [linkStatus, setOptimisticLinkStatus] = (0, _react.useOptimistic)(_links.IDLE_LINK_STATUS);
    const linkInstanceRef = (0, _react.useRef)(null);
    const { href: hrefProp, as: asProp, children, prefetch: prefetchProp = null, replace, shallow, scroll, onClick, onMouseEnter: onMouseEnterProp, onTouchStart: onTouchStartProp, onNavigate, ref: forwardedRef, unstable_dynamicOnHover, ...restProps } = props;
    const router = _react.default.useContext(_approutercontextsharedruntime.AppRouterContext);
    const prefetchEnabled = prefetchProp !== false;
    const fetchStrategy = prefetchProp !== false ? getFetchStrategyFromPrefetchProp(prefetchProp) : _segmentcache.FetchStrategy.PPR;
    if ("TURBOPACK compile-time truthy", 1) {
        function createPropError(args) {
            return Object.defineProperty(new Error(`Failed prop type: The prop \`${args.key}\` expects a ${args.expected} in \`<Link>\`, but got \`${args.actual}\` instead.` + (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '')), "__NEXT_ERROR_CODE", {
                value: "E319",
                enumerable: false,
                configurable: true
            });
        }
        // TypeScript trick for type-guarding:
        const requiredPropsGuard = {
            href: true
        };
        const requiredProps = Object.keys(requiredPropsGuard);
        requiredProps.forEach((key)=>{
            if (key === 'href') {
                if (props[key] == null || typeof props[key] !== 'string' && typeof props[key] !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: props[key] === null ? 'null' : typeof props[key]
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const _ = key;
            }
        });
        // TypeScript trick for type-guarding:
        const optionalPropsGuard = {
            as: true,
            replace: true,
            scroll: true,
            shallow: true,
            prefetch: true,
            unstable_dynamicOnHover: true,
            onClick: true,
            onMouseEnter: true,
            onTouchStart: true,
            onNavigate: true
        };
        const optionalProps = Object.keys(optionalPropsGuard);
        optionalProps.forEach((key)=>{
            const valType = typeof props[key];
            if (key === 'as') {
                if (props[key] && valType !== 'string' && valType !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: valType
                    });
                }
            } else if (key === 'onClick' || key === 'onMouseEnter' || key === 'onTouchStart' || key === 'onNavigate') {
                if (props[key] && valType !== 'function') {
                    throw createPropError({
                        key,
                        expected: '`function`',
                        actual: valType
                    });
                }
            } else if (key === 'replace' || key === 'scroll' || key === 'shallow' || key === 'unstable_dynamicOnHover') {
                if (props[key] != null && valType !== 'boolean') {
                    throw createPropError({
                        key,
                        expected: '`boolean`',
                        actual: valType
                    });
                }
            } else if (key === 'prefetch') {
                if (props[key] != null && valType !== 'boolean' && props[key] !== 'auto' && props[key] !== 'unstable_forceStale') {
                    throw createPropError({
                        key,
                        expected: '`boolean | "auto" | "unstable_forceStale"`',
                        actual: valType
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const _ = key;
            }
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (props.locale) {
            (0, _warnonce.warnOnce)('The `locale` prop is not supported in `next/link` while using the `app` router. Read more about app router internalization: https://nextjs.org/docs/app/building-your-application/routing/internationalization');
        }
        if (!asProp) {
            let href;
            if (typeof hrefProp === 'string') {
                href = hrefProp;
            } else if (typeof hrefProp === 'object' && typeof hrefProp.pathname === 'string') {
                href = hrefProp.pathname;
            }
            if (href) {
                const hasDynamicSegment = href.split('/').some((segment)=>segment.startsWith('[') && segment.endsWith(']'));
                if (hasDynamicSegment) {
                    throw Object.defineProperty(new Error(`Dynamic href \`${href}\` found in <Link> while using the \`/app\` router, this is not supported. Read more: https://nextjs.org/docs/messages/app-dir-dynamic-href`), "__NEXT_ERROR_CODE", {
                        value: "E267",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
    }
    const { href, as } = _react.default.useMemo(()=>{
        const resolvedHref = formatStringOrUrl(hrefProp);
        return {
            href: resolvedHref,
            as: asProp ? formatStringOrUrl(asProp) : resolvedHref
        };
    }, [
        hrefProp,
        asProp
    ]);
    if ("TURBOPACK compile-time truthy", 1) {
        if (children?.type === 'a') {
            throw Object.defineProperty(new Error('Invalid <Link> with <a> child. Please remove <a>.\nLearn more: https://nextjs.org/docs/messages/invalid-new-link-with-extra-anchor'), "__NEXT_ERROR_CODE", {
                value: "E794",
                enumerable: false,
                configurable: true
            });
        }
    }
    // Use a callback ref to attach an IntersectionObserver to the anchor tag on
    // mount. In the future we will also use this to keep track of all the
    // currently mounted <Link> instances, e.g. so we can re-prefetch them after
    // a revalidation or refresh.
    const observeLinkVisibilityOnMount = _react.default.useCallback((element)=>{
        if (router !== null) {
            linkInstanceRef.current = (0, _links.mountLinkInstance)(element, href, router, fetchStrategy, prefetchEnabled, setOptimisticLinkStatus);
        }
        return ()=>{
            if (linkInstanceRef.current) {
                (0, _links.unmountLinkForCurrentNavigation)(linkInstanceRef.current);
                linkInstanceRef.current = null;
            }
            (0, _links.unmountPrefetchableInstance)(element);
        };
    }, [
        prefetchEnabled,
        href,
        router,
        fetchStrategy,
        setOptimisticLinkStatus
    ]);
    const mergedRef = (0, _usemergedref.useMergedRef)(observeLinkVisibilityOnMount, forwardedRef);
    const anchorProps = {
        ref: mergedRef,
        onClick (e) {
            if (typeof onClick === 'function') {
                onClick(e);
            }
            if (!router) {
                return;
            }
            if (e.defaultPrevented) {
                return;
            }
            linkClicked(e, href, as, linkInstanceRef, replace, scroll, onNavigate);
        },
        onMouseEnter (e) {
            if (typeof onMouseEnterProp === 'function') {
                onMouseEnterProp(e);
            }
            if (!router) {
                return;
            }
            if ("TURBOPACK compile-time truthy", 1) {
                return;
            }
            //TURBOPACK unreachable
            ;
            const upgradeToDynamicPrefetch = undefined;
        },
        onTouchStart: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : function onTouchStart(e) {
            if (typeof onTouchStartProp === 'function') {
                onTouchStartProp(e);
            }
            if (!router) {
                return;
            }
            if (!prefetchEnabled) {
                return;
            }
            const upgradeToDynamicPrefetch = unstable_dynamicOnHover === true;
            (0, _links.onNavigationIntent)(e.currentTarget, upgradeToDynamicPrefetch);
        }
    };
    // If the url is absolute, we can bypass the logic to prepend the basePath.
    if ((0, _utils.isAbsoluteUrl)(as)) {
        anchorProps.href = as;
    } else {
        anchorProps.href = (0, _addbasepath.addBasePath)(as);
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(LinkStatusContext.Provider, {
        value: linkStatus,
        children: /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            ...restProps,
            ...anchorProps,
            children: children
        })
    });
}
const LinkStatusContext = /*#__PURE__*/ (0, _react.createContext)(_links.IDLE_LINK_STATUS);
const useLinkStatus = ()=>{
    return (0, _react.useContext)(LinkStatusContext);
};
function getFetchStrategyFromPrefetchProp(prefetchProp) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        return prefetchProp === null || prefetchProp === 'auto' ? _segmentcache.FetchStrategy.PPR : // (although invalid values should've been filtered out by prop validation in dev)
        _segmentcache.FetchStrategy.Full;
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=link.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/hooks-client-context.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['contexts'].HooksClientContext; //# sourceMappingURL=hooks-client-context.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/router-reducer/reducers/get-segment-value.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getSegmentValue", {
    enumerable: true,
    get: function() {
        return getSegmentValue;
    }
});
function getSegmentValue(segment) {
    return Array.isArray(segment) ? segment[1] : segment;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=get-segment-value.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DEFAULT_SEGMENT_KEY: null,
    PAGE_SEGMENT_KEY: null,
    addSearchParamsIfPageSegment: null,
    isGroupSegment: null,
    isParallelRouteSegment: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DEFAULT_SEGMENT_KEY: function() {
        return DEFAULT_SEGMENT_KEY;
    },
    PAGE_SEGMENT_KEY: function() {
        return PAGE_SEGMENT_KEY;
    },
    addSearchParamsIfPageSegment: function() {
        return addSearchParamsIfPageSegment;
    },
    isGroupSegment: function() {
        return isGroupSegment;
    },
    isParallelRouteSegment: function() {
        return isParallelRouteSegment;
    }
});
function isGroupSegment(segment) {
    // Use array[0] for performant purpose
    return segment[0] === '(' && segment.endsWith(')');
}
function isParallelRouteSegment(segment) {
    return segment.startsWith('@') && segment !== '@children';
}
function addSearchParamsIfPageSegment(segment, searchParams) {
    const isPageSegment = segment.includes(PAGE_SEGMENT_KEY);
    if (isPageSegment) {
        const stringifiedQuery = JSON.stringify(searchParams);
        return stringifiedQuery !== '{}' ? PAGE_SEGMENT_KEY + '?' + stringifiedQuery : PAGE_SEGMENT_KEY;
    }
    return segment;
}
const PAGE_SEGMENT_KEY = '__PAGE__';
const DEFAULT_SEGMENT_KEY = '__DEFAULT__'; //# sourceMappingURL=segment.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/redirect-status-code.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RedirectStatusCode", {
    enumerable: true,
    get: function() {
        return RedirectStatusCode;
    }
});
var RedirectStatusCode = /*#__PURE__*/ function(RedirectStatusCode) {
    RedirectStatusCode[RedirectStatusCode["SeeOther"] = 303] = "SeeOther";
    RedirectStatusCode[RedirectStatusCode["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    RedirectStatusCode[RedirectStatusCode["PermanentRedirect"] = 308] = "PermanentRedirect";
    return RedirectStatusCode;
}({});
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=redirect-status-code.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/redirect-error.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    REDIRECT_ERROR_CODE: null,
    RedirectType: null,
    isRedirectError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    REDIRECT_ERROR_CODE: function() {
        return REDIRECT_ERROR_CODE;
    },
    RedirectType: function() {
        return RedirectType;
    },
    isRedirectError: function() {
        return isRedirectError;
    }
});
const _redirectstatuscode = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/redirect-status-code.js [app-ssr] (ecmascript)");
const REDIRECT_ERROR_CODE = 'NEXT_REDIRECT';
var RedirectType = /*#__PURE__*/ function(RedirectType) {
    RedirectType["push"] = "push";
    RedirectType["replace"] = "replace";
    return RedirectType;
}({});
function isRedirectError(error) {
    if (typeof error !== 'object' || error === null || !('digest' in error) || typeof error.digest !== 'string') {
        return false;
    }
    const digest = error.digest.split(';');
    const [errorCode, type] = digest;
    const destination = digest.slice(2, -2).join(';');
    const status = digest.at(-2);
    const statusCode = Number(status);
    return errorCode === REDIRECT_ERROR_CODE && (type === 'replace' || type === 'push') && typeof destination === 'string' && !isNaN(statusCode) && statusCode in _redirectstatuscode.RedirectStatusCode;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=redirect-error.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/redirect.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getRedirectError: null,
    getRedirectStatusCodeFromError: null,
    getRedirectTypeFromError: null,
    getURLFromRedirectError: null,
    permanentRedirect: null,
    redirect: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getRedirectError: function() {
        return getRedirectError;
    },
    getRedirectStatusCodeFromError: function() {
        return getRedirectStatusCodeFromError;
    },
    getRedirectTypeFromError: function() {
        return getRedirectTypeFromError;
    },
    getURLFromRedirectError: function() {
        return getURLFromRedirectError;
    },
    permanentRedirect: function() {
        return permanentRedirect;
    },
    redirect: function() {
        return redirect;
    }
});
const _redirectstatuscode = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/redirect-status-code.js [app-ssr] (ecmascript)");
const _redirecterror = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/redirect-error.js [app-ssr] (ecmascript)");
const actionAsyncStorage = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)").actionAsyncStorage : "TURBOPACK unreachable";
function getRedirectError(url, type, statusCode = _redirectstatuscode.RedirectStatusCode.TemporaryRedirect) {
    const error = Object.defineProperty(new Error(_redirecterror.REDIRECT_ERROR_CODE), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.digest = `${_redirecterror.REDIRECT_ERROR_CODE};${type};${url};${statusCode};`;
    return error;
}
function redirect(/** The URL to redirect to */ url, type) {
    type ??= actionAsyncStorage?.getStore()?.isAction ? _redirecterror.RedirectType.push : _redirecterror.RedirectType.replace;
    throw getRedirectError(url, type, _redirectstatuscode.RedirectStatusCode.TemporaryRedirect);
}
function permanentRedirect(/** The URL to redirect to */ url, type = _redirecterror.RedirectType.replace) {
    throw getRedirectError(url, type, _redirectstatuscode.RedirectStatusCode.PermanentRedirect);
}
function getURLFromRedirectError(error) {
    if (!(0, _redirecterror.isRedirectError)(error)) return null;
    // Slices off the beginning of the digest that contains the code and the
    // separating ';'.
    return error.digest.split(';').slice(2, -2).join(';');
}
function getRedirectTypeFromError(error) {
    if (!(0, _redirecterror.isRedirectError)(error)) {
        throw Object.defineProperty(new Error('Not a redirect error'), "__NEXT_ERROR_CODE", {
            value: "E260",
            enumerable: false,
            configurable: true
        });
    }
    return error.digest.split(';', 2)[1];
}
function getRedirectStatusCodeFromError(error) {
    if (!(0, _redirecterror.isRedirectError)(error)) {
        throw Object.defineProperty(new Error('Not a redirect error'), "__NEXT_ERROR_CODE", {
            value: "E260",
            enumerable: false,
            configurable: true
        });
    }
    return Number(error.digest.split(';').at(-2));
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=redirect.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    HTTPAccessErrorStatus: null,
    HTTP_ERROR_FALLBACK_ERROR_CODE: null,
    getAccessFallbackErrorTypeByStatus: null,
    getAccessFallbackHTTPStatus: null,
    isHTTPAccessFallbackError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    HTTPAccessErrorStatus: function() {
        return HTTPAccessErrorStatus;
    },
    HTTP_ERROR_FALLBACK_ERROR_CODE: function() {
        return HTTP_ERROR_FALLBACK_ERROR_CODE;
    },
    getAccessFallbackErrorTypeByStatus: function() {
        return getAccessFallbackErrorTypeByStatus;
    },
    getAccessFallbackHTTPStatus: function() {
        return getAccessFallbackHTTPStatus;
    },
    isHTTPAccessFallbackError: function() {
        return isHTTPAccessFallbackError;
    }
});
const HTTPAccessErrorStatus = {
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401
};
const ALLOWED_CODES = new Set(Object.values(HTTPAccessErrorStatus));
const HTTP_ERROR_FALLBACK_ERROR_CODE = 'NEXT_HTTP_ERROR_FALLBACK';
function isHTTPAccessFallbackError(error) {
    if (typeof error !== 'object' || error === null || !('digest' in error) || typeof error.digest !== 'string') {
        return false;
    }
    const [prefix, httpStatus] = error.digest.split(';');
    return prefix === HTTP_ERROR_FALLBACK_ERROR_CODE && ALLOWED_CODES.has(Number(httpStatus));
}
function getAccessFallbackHTTPStatus(error) {
    const httpStatus = error.digest.split(';')[1];
    return Number(httpStatus);
}
function getAccessFallbackErrorTypeByStatus(status) {
    switch(status){
        case 401:
            return 'unauthorized';
        case 403:
            return 'forbidden';
        case 404:
            return 'not-found';
        default:
            return;
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=http-access-fallback.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/not-found.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "notFound", {
    enumerable: true,
    get: function() {
        return notFound;
    }
});
const _httpaccessfallback = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js [app-ssr] (ecmascript)");
/**
 * This function allows you to render the [not-found.js file](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
 * within a route segment as well as inject a tag.
 *
 * `notFound()` can be used in
 * [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components),
 * [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers), and
 * [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).
 *
 * - In a Server Component, this will insert a `<meta name="robots" content="noindex" />` meta tag and set the status code to 404.
 * - In a Route Handler or Server Action, it will serve a 404 to the caller.
 *
 * Read more: [Next.js Docs: `notFound`](https://nextjs.org/docs/app/api-reference/functions/not-found)
 */ const DIGEST = `${_httpaccessfallback.HTTP_ERROR_FALLBACK_ERROR_CODE};404`;
function notFound() {
    // eslint-disable-next-line no-throw-literal
    const error = Object.defineProperty(new Error(DIGEST), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.digest = DIGEST;
    throw error;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=not-found.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/forbidden.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "forbidden", {
    enumerable: true,
    get: function() {
        return forbidden;
    }
});
const _httpaccessfallback = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js [app-ssr] (ecmascript)");
// TODO: Add `forbidden` docs
/**
 * @experimental
 * This function allows you to render the [forbidden.js file](https://nextjs.org/docs/app/api-reference/file-conventions/forbidden)
 * within a route segment as well as inject a tag.
 *
 * `forbidden()` can be used in
 * [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components),
 * [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers), and
 * [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).
 *
 * Read more: [Next.js Docs: `forbidden`](https://nextjs.org/docs/app/api-reference/functions/forbidden)
 */ const DIGEST = `${_httpaccessfallback.HTTP_ERROR_FALLBACK_ERROR_CODE};403`;
function forbidden() {
    if ("TURBOPACK compile-time truthy", 1) {
        throw Object.defineProperty(new Error(`\`forbidden()\` is experimental and only allowed to be enabled when \`experimental.authInterrupts\` is enabled.`), "__NEXT_ERROR_CODE", {
            value: "E488",
            enumerable: false,
            configurable: true
        });
    }
    // eslint-disable-next-line no-throw-literal
    const error = Object.defineProperty(new Error(DIGEST), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.digest = DIGEST;
    throw error;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=forbidden.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/unauthorized.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "unauthorized", {
    enumerable: true,
    get: function() {
        return unauthorized;
    }
});
const _httpaccessfallback = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js [app-ssr] (ecmascript)");
// TODO: Add `unauthorized` docs
/**
 * @experimental
 * This function allows you to render the [unauthorized.js file](https://nextjs.org/docs/app/api-reference/file-conventions/unauthorized)
 * within a route segment as well as inject a tag.
 *
 * `unauthorized()` can be used in
 * [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components),
 * [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers), and
 * [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).
 *
 *
 * Read more: [Next.js Docs: `unauthorized`](https://nextjs.org/docs/app/api-reference/functions/unauthorized)
 */ const DIGEST = `${_httpaccessfallback.HTTP_ERROR_FALLBACK_ERROR_CODE};401`;
function unauthorized() {
    if ("TURBOPACK compile-time truthy", 1) {
        throw Object.defineProperty(new Error(`\`unauthorized()\` is experimental and only allowed to be used when \`experimental.authInterrupts\` is enabled.`), "__NEXT_ERROR_CODE", {
            value: "E411",
            enumerable: false,
            configurable: true
        });
    }
    // eslint-disable-next-line no-throw-literal
    const error = Object.defineProperty(new Error(DIGEST), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.digest = DIGEST;
    throw error;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=unauthorized.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/dynamic-rendering-utils.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    isHangingPromiseRejectionError: null,
    makeDevtoolsIOAwarePromise: null,
    makeHangingPromise: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    isHangingPromiseRejectionError: function() {
        return isHangingPromiseRejectionError;
    },
    makeDevtoolsIOAwarePromise: function() {
        return makeDevtoolsIOAwarePromise;
    },
    makeHangingPromise: function() {
        return makeHangingPromise;
    }
});
function isHangingPromiseRejectionError(err) {
    if (typeof err !== 'object' || err === null || !('digest' in err)) {
        return false;
    }
    return err.digest === HANGING_PROMISE_REJECTION;
}
const HANGING_PROMISE_REJECTION = 'HANGING_PROMISE_REJECTION';
class HangingPromiseRejectionError extends Error {
    constructor(route, expression){
        super(`During prerendering, ${expression} rejects when the prerender is complete. Typically these errors are handled by React but if you move ${expression} to a different context by using \`setTimeout\`, \`after\`, or similar functions you may observe this error and you should handle it in that context. This occurred at route "${route}".`), this.route = route, this.expression = expression, this.digest = HANGING_PROMISE_REJECTION;
    }
}
const abortListenersBySignal = new WeakMap();
function makeHangingPromise(signal, route, expression) {
    if (signal.aborted) {
        return Promise.reject(new HangingPromiseRejectionError(route, expression));
    } else {
        const hangingPromise = new Promise((_, reject)=>{
            const boundRejection = reject.bind(null, new HangingPromiseRejectionError(route, expression));
            let currentListeners = abortListenersBySignal.get(signal);
            if (currentListeners) {
                currentListeners.push(boundRejection);
            } else {
                const listeners = [
                    boundRejection
                ];
                abortListenersBySignal.set(signal, listeners);
                signal.addEventListener('abort', ()=>{
                    for(let i = 0; i < listeners.length; i++){
                        listeners[i]();
                    }
                }, {
                    once: true
                });
            }
        });
        // We are fine if no one actually awaits this promise. We shouldn't consider this an unhandled rejection so
        // we attach a noop catch handler here to suppress this warning. If you actually await somewhere or construct
        // your own promise out of it you'll need to ensure you handle the error when it rejects.
        hangingPromise.catch(ignoreReject);
        return hangingPromise;
    }
}
function ignoreReject() {}
function makeDevtoolsIOAwarePromise(underlying) {
    // in React DevTools if we resolve in a setTimeout we will observe
    // the promise resolution as something that can suspend a boundary or root.
    return new Promise((resolve)=>{
        // Must use setTimeout to be considered IO React DevTools. setImmediate will not work.
        setTimeout(()=>{
            resolve(underlying);
        }, 0);
    });
} //# sourceMappingURL=dynamic-rendering-utils.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/lib/router-utils/is-postpone.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isPostpone", {
    enumerable: true,
    get: function() {
        return isPostpone;
    }
});
const REACT_POSTPONE_TYPE = Symbol.for('react.postpone');
function isPostpone(error) {
    return typeof error === 'object' && error !== null && error.$$typeof === REACT_POSTPONE_TYPE;
} //# sourceMappingURL=is-postpone.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This has to be a shared module which is shared between client component error boundary and dynamic component
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    BailoutToCSRError: null,
    isBailoutToCSRError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    BailoutToCSRError: function() {
        return BailoutToCSRError;
    },
    isBailoutToCSRError: function() {
        return isBailoutToCSRError;
    }
});
const BAILOUT_TO_CSR = 'BAILOUT_TO_CLIENT_SIDE_RENDERING';
class BailoutToCSRError extends Error {
    constructor(reason){
        super(`Bail out to client-side rendering: ${reason}`), this.reason = reason, this.digest = BAILOUT_TO_CSR;
    }
}
function isBailoutToCSRError(err) {
    if (typeof err !== 'object' || err === null || !('digest' in err)) {
        return false;
    }
    return err.digest === BAILOUT_TO_CSR;
} //# sourceMappingURL=bailout-to-csr.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/is-next-router-error.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isNextRouterError", {
    enumerable: true,
    get: function() {
        return isNextRouterError;
    }
});
const _httpaccessfallback = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js [app-ssr] (ecmascript)");
const _redirecterror = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/redirect-error.js [app-ssr] (ecmascript)");
function isNextRouterError(error) {
    return (0, _redirecterror.isRedirectError)(error) || (0, _httpaccessfallback.isHTTPAccessFallbackError)(error);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=is-next-router-error.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/hooks-server-context.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DynamicServerError: null,
    isDynamicServerError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DynamicServerError: function() {
        return DynamicServerError;
    },
    isDynamicServerError: function() {
        return isDynamicServerError;
    }
});
const DYNAMIC_ERROR_CODE = 'DYNAMIC_SERVER_USAGE';
class DynamicServerError extends Error {
    constructor(description){
        super(`Dynamic server usage: ${description}`), this.description = description, this.digest = DYNAMIC_ERROR_CODE;
    }
}
function isDynamicServerError(err) {
    if (typeof err !== 'object' || err === null || !('digest' in err) || typeof err.digest !== 'string') {
        return false;
    }
    return err.digest === DYNAMIC_ERROR_CODE;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=hooks-server-context.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/static-generation-bailout.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StaticGenBailoutError: null,
    isStaticGenBailoutError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    StaticGenBailoutError: function() {
        return StaticGenBailoutError;
    },
    isStaticGenBailoutError: function() {
        return isStaticGenBailoutError;
    }
});
const NEXT_STATIC_GEN_BAILOUT = 'NEXT_STATIC_GEN_BAILOUT';
class StaticGenBailoutError extends Error {
    constructor(...args){
        super(...args), this.code = NEXT_STATIC_GEN_BAILOUT;
    }
}
function isStaticGenBailoutError(error) {
    if (typeof error !== 'object' || error === null || !('code' in error)) {
        return false;
    }
    return error.code === NEXT_STATIC_GEN_BAILOUT;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=static-generation-bailout.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/lib/framework/boundary-constants.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    METADATA_BOUNDARY_NAME: null,
    OUTLET_BOUNDARY_NAME: null,
    ROOT_LAYOUT_BOUNDARY_NAME: null,
    VIEWPORT_BOUNDARY_NAME: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    METADATA_BOUNDARY_NAME: function() {
        return METADATA_BOUNDARY_NAME;
    },
    OUTLET_BOUNDARY_NAME: function() {
        return OUTLET_BOUNDARY_NAME;
    },
    ROOT_LAYOUT_BOUNDARY_NAME: function() {
        return ROOT_LAYOUT_BOUNDARY_NAME;
    },
    VIEWPORT_BOUNDARY_NAME: function() {
        return VIEWPORT_BOUNDARY_NAME;
    }
});
const METADATA_BOUNDARY_NAME = '__next_metadata_boundary__';
const VIEWPORT_BOUNDARY_NAME = '__next_viewport_boundary__';
const OUTLET_BOUNDARY_NAME = '__next_outlet_boundary__';
const ROOT_LAYOUT_BOUNDARY_NAME = '__next_root_layout_boundary__'; //# sourceMappingURL=boundary-constants.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/lib/scheduler.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    atLeastOneTask: null,
    scheduleImmediate: null,
    scheduleOnNextTick: null,
    waitAtLeastOneReactRenderTask: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    atLeastOneTask: function() {
        return atLeastOneTask;
    },
    scheduleImmediate: function() {
        return scheduleImmediate;
    },
    scheduleOnNextTick: function() {
        return scheduleOnNextTick;
    },
    waitAtLeastOneReactRenderTask: function() {
        return waitAtLeastOneReactRenderTask;
    }
});
const scheduleOnNextTick = (cb)=>{
    // We use Promise.resolve().then() here so that the operation is scheduled at
    // the end of the promise job queue, we then add it to the next process tick
    // to ensure it's evaluated afterwards.
    //
    // This was inspired by the implementation of the DataLoader interface: https://github.com/graphql/dataloader/blob/d336bd15282664e0be4b4a657cb796f09bafbc6b/src/index.js#L213-L255
    //
    Promise.resolve().then(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            process.nextTick(cb);
        }
    });
};
const scheduleImmediate = (cb)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        setImmediate(cb);
    }
};
function atLeastOneTask() {
    return new Promise((resolve)=>scheduleImmediate(resolve));
}
function waitAtLeastOneReactRenderTask() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        return new Promise((r)=>setImmediate(r));
    }
} //# sourceMappingURL=scheduler.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * The functions provided by this module are used to communicate certain properties
 * about the currently running code so that Next.js can make decisions on how to handle
 * the current execution in different rendering modes such as pre-rendering, resuming, and SSR.
 *
 * Today Next.js treats all code as potentially static. Certain APIs may only make sense when dynamically rendering.
 * Traditionally this meant deopting the entire render to dynamic however with PPR we can now deopt parts
 * of a React tree as dynamic while still keeping other parts static. There are really two different kinds of
 * Dynamic indications.
 *
 * The first is simply an intention to be dynamic. unstable_noStore is an example of this where
 * the currently executing code simply declares that the current scope is dynamic but if you use it
 * inside unstable_cache it can still be cached. This type of indication can be removed if we ever
 * make the default dynamic to begin with because the only way you would ever be static is inside
 * a cache scope which this indication does not affect.
 *
 * The second is an indication that a dynamic data source was read. This is a stronger form of dynamic
 * because it means that it is inappropriate to cache this at all. using a dynamic data source inside
 * unstable_cache should error. If you want to use some dynamic data inside unstable_cache you should
 * read that data outside the cache and pass it in as an argument to the cached function.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Postpone: null,
    PreludeState: null,
    abortAndThrowOnSynchronousRequestDataAccess: null,
    abortOnSynchronousPlatformIOAccess: null,
    accessedDynamicData: null,
    annotateDynamicAccess: null,
    consumeDynamicAccess: null,
    createDynamicTrackingState: null,
    createDynamicValidationState: null,
    createHangingInputAbortSignal: null,
    createRenderInBrowserAbortSignal: null,
    delayUntilRuntimeStage: null,
    formatDynamicAPIAccesses: null,
    getFirstDynamicReason: null,
    isDynamicPostpone: null,
    isPrerenderInterruptedError: null,
    logDisallowedDynamicError: null,
    markCurrentScopeAsDynamic: null,
    postponeWithTracking: null,
    throwIfDisallowedDynamic: null,
    throwToInterruptStaticGeneration: null,
    trackAllowedDynamicAccess: null,
    trackDynamicDataInDynamicRender: null,
    trackSynchronousPlatformIOAccessInDev: null,
    useDynamicRouteParams: null,
    useDynamicSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    Postpone: function() {
        return Postpone;
    },
    PreludeState: function() {
        return PreludeState;
    },
    abortAndThrowOnSynchronousRequestDataAccess: function() {
        return abortAndThrowOnSynchronousRequestDataAccess;
    },
    abortOnSynchronousPlatformIOAccess: function() {
        return abortOnSynchronousPlatformIOAccess;
    },
    accessedDynamicData: function() {
        return accessedDynamicData;
    },
    annotateDynamicAccess: function() {
        return annotateDynamicAccess;
    },
    consumeDynamicAccess: function() {
        return consumeDynamicAccess;
    },
    createDynamicTrackingState: function() {
        return createDynamicTrackingState;
    },
    createDynamicValidationState: function() {
        return createDynamicValidationState;
    },
    createHangingInputAbortSignal: function() {
        return createHangingInputAbortSignal;
    },
    createRenderInBrowserAbortSignal: function() {
        return createRenderInBrowserAbortSignal;
    },
    delayUntilRuntimeStage: function() {
        return delayUntilRuntimeStage;
    },
    formatDynamicAPIAccesses: function() {
        return formatDynamicAPIAccesses;
    },
    getFirstDynamicReason: function() {
        return getFirstDynamicReason;
    },
    isDynamicPostpone: function() {
        return isDynamicPostpone;
    },
    isPrerenderInterruptedError: function() {
        return isPrerenderInterruptedError;
    },
    logDisallowedDynamicError: function() {
        return logDisallowedDynamicError;
    },
    markCurrentScopeAsDynamic: function() {
        return markCurrentScopeAsDynamic;
    },
    postponeWithTracking: function() {
        return postponeWithTracking;
    },
    throwIfDisallowedDynamic: function() {
        return throwIfDisallowedDynamic;
    },
    throwToInterruptStaticGeneration: function() {
        return throwToInterruptStaticGeneration;
    },
    trackAllowedDynamicAccess: function() {
        return trackAllowedDynamicAccess;
    },
    trackDynamicDataInDynamicRender: function() {
        return trackDynamicDataInDynamicRender;
    },
    trackSynchronousPlatformIOAccessInDev: function() {
        return trackSynchronousPlatformIOAccessInDev;
    },
    useDynamicRouteParams: function() {
        return useDynamicRouteParams;
    },
    useDynamicSearchParams: function() {
        return useDynamicSearchParams;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(__turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)"));
const _hooksservercontext = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/hooks-server-context.js [app-ssr] (ecmascript)");
const _staticgenerationbailout = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/static-generation-bailout.js [app-ssr] (ecmascript)");
const _workunitasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
const _workasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
const _dynamicrenderingutils = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/dynamic-rendering-utils.js [app-ssr] (ecmascript)");
const _boundaryconstants = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/lib/framework/boundary-constants.js [app-ssr] (ecmascript)");
const _scheduler = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/lib/scheduler.js [app-ssr] (ecmascript)");
const _bailouttocsr = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-ssr] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const hasPostpone = typeof _react.default.unstable_postpone === 'function';
function createDynamicTrackingState(isDebugDynamicAccesses) {
    return {
        isDebugDynamicAccesses,
        dynamicAccesses: [],
        syncDynamicErrorWithStack: null
    };
}
function createDynamicValidationState() {
    return {
        hasSuspenseAboveBody: false,
        hasDynamicMetadata: false,
        hasDynamicViewport: false,
        hasAllowedDynamic: false,
        dynamicErrors: []
    };
}
function getFirstDynamicReason(trackingState) {
    var _trackingState_dynamicAccesses_;
    return (_trackingState_dynamicAccesses_ = trackingState.dynamicAccesses[0]) == null ? void 0 : _trackingState_dynamicAccesses_.expression;
}
function markCurrentScopeAsDynamic(store, workUnitStore, expression) {
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'cache':
            case 'unstable-cache':
                // Inside cache scopes, marking a scope as dynamic has no effect,
                // because the outer cache scope creates a cache boundary. This is
                // subtly different from reading a dynamic data source, which is
                // forbidden inside a cache scope.
                return;
            case 'private-cache':
                // A private cache scope is already dynamic by definition.
                return;
            case 'prerender-legacy':
            case 'prerender-ppr':
            case 'request':
                break;
            default:
                workUnitStore;
        }
    }
    // If we're forcing dynamic rendering or we're forcing static rendering, we
    // don't need to do anything here because the entire page is already dynamic
    // or it's static and it should not throw or postpone here.
    if (store.forceDynamic || store.forceStatic) return;
    if (store.dynamicShouldError) {
        throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError(`Route ${store.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
            value: "E553",
            enumerable: false,
            configurable: true
        });
    }
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender-ppr':
                return postponeWithTracking(store.route, expression, workUnitStore.dynamicTracking);
            case 'prerender-legacy':
                workUnitStore.revalidate = 0;
                // We aren't prerendering, but we are generating a static page. We need
                // to bail out of static generation.
                const err = Object.defineProperty(new _hooksservercontext.DynamicServerError(`Route ${store.route} couldn't be rendered statically because it used ${expression}. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", {
                    value: "E550",
                    enumerable: false,
                    configurable: true
                });
                store.dynamicUsageDescription = expression;
                store.dynamicUsageStack = err.stack;
                throw err;
            case 'request':
                if ("TURBOPACK compile-time truthy", 1) {
                    workUnitStore.usedDynamic = true;
                }
                break;
            default:
                workUnitStore;
        }
    }
}
function throwToInterruptStaticGeneration(expression, store, prerenderStore) {
    // We aren't prerendering but we are generating a static page. We need to bail out of static generation
    const err = Object.defineProperty(new _hooksservercontext.DynamicServerError(`Route ${store.route} couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", {
        value: "E558",
        enumerable: false,
        configurable: true
    });
    prerenderStore.revalidate = 0;
    store.dynamicUsageDescription = expression;
    store.dynamicUsageStack = err.stack;
    throw err;
}
function trackDynamicDataInDynamicRender(workUnitStore) {
    switch(workUnitStore.type){
        case 'cache':
        case 'unstable-cache':
            // Inside cache scopes, marking a scope as dynamic has no effect,
            // because the outer cache scope creates a cache boundary. This is
            // subtly different from reading a dynamic data source, which is
            // forbidden inside a cache scope.
            return;
        case 'private-cache':
            // A private cache scope is already dynamic by definition.
            return;
        case 'prerender':
        case 'prerender-runtime':
        case 'prerender-legacy':
        case 'prerender-ppr':
        case 'prerender-client':
            break;
        case 'request':
            if ("TURBOPACK compile-time truthy", 1) {
                workUnitStore.usedDynamic = true;
            }
            break;
        default:
            workUnitStore;
    }
}
function abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore) {
    const reason = `Route ${route} needs to bail out of prerendering at this point because it used ${expression}.`;
    const error = createPrerenderInterruptedError(reason);
    prerenderStore.controller.abort(error);
    const dynamicTracking = prerenderStore.dynamicTracking;
    if (dynamicTracking) {
        dynamicTracking.dynamicAccesses.push({
            // When we aren't debugging, we don't need to create another error for the
            // stack trace.
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : undefined,
            expression
        });
    }
}
function abortOnSynchronousPlatformIOAccess(route, expression, errorWithStack, prerenderStore) {
    const dynamicTracking = prerenderStore.dynamicTracking;
    abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore);
    // It is important that we set this tracking value after aborting. Aborts are executed
    // synchronously except for the case where you abort during render itself. By setting this
    // value late we can use it to determine if any of the aborted tasks are the task that
    // called the sync IO expression in the first place.
    if (dynamicTracking) {
        if (dynamicTracking.syncDynamicErrorWithStack === null) {
            dynamicTracking.syncDynamicErrorWithStack = errorWithStack;
        }
    }
}
function trackSynchronousPlatformIOAccessInDev(requestStore) {
    // We don't actually have a controller to abort but we do the semantic equivalent by
    // advancing the request store out of prerender mode
    requestStore.prerenderPhase = false;
}
function abortAndThrowOnSynchronousRequestDataAccess(route, expression, errorWithStack, prerenderStore) {
    const prerenderSignal = prerenderStore.controller.signal;
    if (prerenderSignal.aborted === false) {
        // TODO it would be better to move this aborted check into the callsite so we can avoid making
        // the error object when it isn't relevant to the aborting of the prerender however
        // since we need the throw semantics regardless of whether we abort it is easier to land
        // this way. See how this was handled with `abortOnSynchronousPlatformIOAccess` for a closer
        // to ideal implementation
        abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore);
        // It is important that we set this tracking value after aborting. Aborts are executed
        // synchronously except for the case where you abort during render itself. By setting this
        // value late we can use it to determine if any of the aborted tasks are the task that
        // called the sync IO expression in the first place.
        const dynamicTracking = prerenderStore.dynamicTracking;
        if (dynamicTracking) {
            if (dynamicTracking.syncDynamicErrorWithStack === null) {
                dynamicTracking.syncDynamicErrorWithStack = errorWithStack;
            }
        }
    }
    throw createPrerenderInterruptedError(`Route ${route} needs to bail out of prerendering at this point because it used ${expression}.`);
}
function Postpone({ reason, route }) {
    const prerenderStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    const dynamicTracking = prerenderStore && prerenderStore.type === 'prerender-ppr' ? prerenderStore.dynamicTracking : null;
    postponeWithTracking(route, reason, dynamicTracking);
}
function postponeWithTracking(route, expression, dynamicTracking) {
    assertPostpone();
    if (dynamicTracking) {
        dynamicTracking.dynamicAccesses.push({
            // When we aren't debugging, we don't need to create another error for the
            // stack trace.
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : undefined,
            expression
        });
    }
    _react.default.unstable_postpone(createPostponeReason(route, expression));
}
function createPostponeReason(route, expression) {
    return `Route ${route} needs to bail out of prerendering at this point because it used ${expression}. ` + `React throws this special object to indicate where. It should not be caught by ` + `your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error`;
}
function isDynamicPostpone(err) {
    if (typeof err === 'object' && err !== null && typeof err.message === 'string') {
        return isDynamicPostponeReason(err.message);
    }
    return false;
}
function isDynamicPostponeReason(reason) {
    return reason.includes('needs to bail out of prerendering at this point because it used') && reason.includes('Learn more: https://nextjs.org/docs/messages/ppr-caught-error');
}
if (isDynamicPostponeReason(createPostponeReason('%%%', '^^^')) === false) {
    throw Object.defineProperty(new Error('Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js'), "__NEXT_ERROR_CODE", {
        value: "E296",
        enumerable: false,
        configurable: true
    });
}
const NEXT_PRERENDER_INTERRUPTED = 'NEXT_PRERENDER_INTERRUPTED';
function createPrerenderInterruptedError(message) {
    const error = Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.digest = NEXT_PRERENDER_INTERRUPTED;
    return error;
}
function isPrerenderInterruptedError(error) {
    return typeof error === 'object' && error !== null && error.digest === NEXT_PRERENDER_INTERRUPTED && 'name' in error && 'message' in error && error instanceof Error;
}
function accessedDynamicData(dynamicAccesses) {
    return dynamicAccesses.length > 0;
}
function consumeDynamicAccess(serverDynamic, clientDynamic) {
    // We mutate because we only call this once we are no longer writing
    // to the dynamicTrackingState and it's more efficient than creating a new
    // array.
    serverDynamic.dynamicAccesses.push(...clientDynamic.dynamicAccesses);
    return serverDynamic.dynamicAccesses;
}
function formatDynamicAPIAccesses(dynamicAccesses) {
    return dynamicAccesses.filter((access)=>typeof access.stack === 'string' && access.stack.length > 0).map(({ expression, stack })=>{
        stack = stack.split('\n') // Remove the "Error: " prefix from the first line of the stack trace as
        // well as the first 4 lines of the stack trace which is the distance
        // from the user code and the `new Error().stack` call.
        .slice(4).filter((line)=>{
            // Exclude Next.js internals from the stack trace.
            if (line.includes('node_modules/next/')) {
                return false;
            }
            // Exclude anonymous functions from the stack trace.
            if (line.includes(' (<anonymous>)')) {
                return false;
            }
            // Exclude Node.js internals from the stack trace.
            if (line.includes(' (node:')) {
                return false;
            }
            return true;
        }).join('\n');
        return `Dynamic API Usage Debug - ${expression}:\n${stack}`;
    });
}
function assertPostpone() {
    if (!hasPostpone) {
        throw Object.defineProperty(new Error(`Invariant: React.unstable_postpone is not defined. This suggests the wrong version of React was loaded. This is a bug in Next.js`), "__NEXT_ERROR_CODE", {
            value: "E224",
            enumerable: false,
            configurable: true
        });
    }
}
function createRenderInBrowserAbortSignal() {
    const controller = new AbortController();
    controller.abort(Object.defineProperty(new _bailouttocsr.BailoutToCSRError('Render in Browser'), "__NEXT_ERROR_CODE", {
        value: "E721",
        enumerable: false,
        configurable: true
    }));
    return controller.signal;
}
function createHangingInputAbortSignal(workUnitStore) {
    switch(workUnitStore.type){
        case 'prerender':
        case 'prerender-runtime':
            const controller = new AbortController();
            if (workUnitStore.cacheSignal) {
                // If we have a cacheSignal it means we're in a prospective render. If
                // the input we're waiting on is coming from another cache, we do want
                // to wait for it so that we can resolve this cache entry too.
                workUnitStore.cacheSignal.inputReady().then(()=>{
                    controller.abort();
                });
            } else {
                // Otherwise we're in the final render and we should already have all
                // our caches filled.
                // If the prerender uses stages, we have wait until the runtime stage,
                // at which point all runtime inputs will be resolved.
                // (otherwise, a runtime prerender might consider `cookies()` hanging
                //  even though they'd resolve in the next task.)
                //
                // We might still be waiting on some microtasks so we
                // wait one tick before giving up. When we give up, we still want to
                // render the content of this cache as deeply as we can so that we can
                // suspend as deeply as possible in the tree or not at all if we don't
                // end up waiting for the input.
                const runtimeStagePromise = (0, _workunitasyncstorageexternal.getRuntimeStagePromise)(workUnitStore);
                if (runtimeStagePromise) {
                    runtimeStagePromise.then(()=>(0, _scheduler.scheduleOnNextTick)(()=>controller.abort()));
                } else {
                    (0, _scheduler.scheduleOnNextTick)(()=>controller.abort());
                }
            }
            return controller.signal;
        case 'prerender-client':
        case 'prerender-ppr':
        case 'prerender-legacy':
        case 'request':
        case 'cache':
        case 'private-cache':
        case 'unstable-cache':
            return undefined;
        default:
            workUnitStore;
    }
}
function annotateDynamicAccess(expression, prerenderStore) {
    const dynamicTracking = prerenderStore.dynamicTracking;
    if (dynamicTracking) {
        dynamicTracking.dynamicAccesses.push({
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : undefined,
            expression
        });
    }
}
function useDynamicRouteParams(expression) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workStore && workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender-client':
            case 'prerender':
                {
                    const fallbackParams = workUnitStore.fallbackRouteParams;
                    if (fallbackParams && fallbackParams.size > 0) {
                        // We are in a prerender with cacheComponents semantics. We are going to
                        // hang here and never resolve. This will cause the currently
                        // rendering component to effectively be a dynamic hole.
                        _react.default.use((0, _dynamicrenderingutils.makeHangingPromise)(workUnitStore.renderSignal, workStore.route, expression));
                    }
                    break;
                }
            case 'prerender-ppr':
                {
                    const fallbackParams = workUnitStore.fallbackRouteParams;
                    if (fallbackParams && fallbackParams.size > 0) {
                        return postponeWithTracking(workStore.route, expression, workUnitStore.dynamicTracking);
                    }
                    break;
                }
            case 'prerender-runtime':
                throw Object.defineProperty(new _invarianterror.InvariantError(`\`${expression}\` was called during a runtime prerender. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                    value: "E771",
                    enumerable: false,
                    configurable: true
                });
            case 'cache':
            case 'private-cache':
                throw Object.defineProperty(new _invarianterror.InvariantError(`\`${expression}\` was called inside a cache scope. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                    value: "E745",
                    enumerable: false,
                    configurable: true
                });
            case 'prerender-legacy':
            case 'request':
            case 'unstable-cache':
                break;
            default:
                workUnitStore;
        }
    }
}
function useDynamicSearchParams(expression) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (!workStore) {
        // We assume pages router context and just return
        return;
    }
    if (!workUnitStore) {
        (0, _workunitasyncstorageexternal.throwForMissingRequestStore)(expression);
    }
    switch(workUnitStore.type){
        case 'prerender-client':
            {
                _react.default.use((0, _dynamicrenderingutils.makeHangingPromise)(workUnitStore.renderSignal, workStore.route, expression));
                break;
            }
        case 'prerender-legacy':
        case 'prerender-ppr':
            {
                if (workStore.forceStatic) {
                    return;
                }
                throw Object.defineProperty(new _bailouttocsr.BailoutToCSRError(expression), "__NEXT_ERROR_CODE", {
                    value: "E394",
                    enumerable: false,
                    configurable: true
                });
            }
        case 'prerender':
        case 'prerender-runtime':
            throw Object.defineProperty(new _invarianterror.InvariantError(`\`${expression}\` was called from a Server Component. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                value: "E795",
                enumerable: false,
                configurable: true
            });
        case 'cache':
        case 'unstable-cache':
        case 'private-cache':
            throw Object.defineProperty(new _invarianterror.InvariantError(`\`${expression}\` was called inside a cache scope. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                value: "E745",
                enumerable: false,
                configurable: true
            });
        case 'request':
            return;
        default:
            workUnitStore;
    }
}
const hasSuspenseRegex = /\n\s+at Suspense \(<anonymous>\)/;
// Common implicit body tags that React will treat as body when placed directly in html
const bodyAndImplicitTags = 'body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6';
// Detects when RootLayoutBoundary (our framework marker component) appears
// after Suspense in the component stack, indicating the root layout is wrapped
// within a Suspense boundary. Ensures no body/html/implicit-body components are in between.
//
// Example matches:
//   at Suspense (<anonymous>)
//   at __next_root_layout_boundary__ (<anonymous>)
//
// Or with other components in between (but not body/html/implicit-body):
//   at Suspense (<anonymous>)
//   at SomeComponent (<anonymous>)
//   at __next_root_layout_boundary__ (<anonymous>)
const hasSuspenseBeforeRootLayoutWithoutBodyOrImplicitBodyRegex = new RegExp(`\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:${bodyAndImplicitTags}) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at ${_boundaryconstants.ROOT_LAYOUT_BOUNDARY_NAME} \\([^\\n]*\\)`);
const hasMetadataRegex = new RegExp(`\\n\\s+at ${_boundaryconstants.METADATA_BOUNDARY_NAME}[\\n\\s]`);
const hasViewportRegex = new RegExp(`\\n\\s+at ${_boundaryconstants.VIEWPORT_BOUNDARY_NAME}[\\n\\s]`);
const hasOutletRegex = new RegExp(`\\n\\s+at ${_boundaryconstants.OUTLET_BOUNDARY_NAME}[\\n\\s]`);
function trackAllowedDynamicAccess(workStore, componentStack, dynamicValidation, clientDynamic) {
    if (hasOutletRegex.test(componentStack)) {
        // We don't need to track that this is dynamic. It is only so when something else is also dynamic.
        return;
    } else if (hasMetadataRegex.test(componentStack)) {
        dynamicValidation.hasDynamicMetadata = true;
        return;
    } else if (hasViewportRegex.test(componentStack)) {
        dynamicValidation.hasDynamicViewport = true;
        return;
    } else if (hasSuspenseBeforeRootLayoutWithoutBodyOrImplicitBodyRegex.test(componentStack)) {
        // For Suspense within body, the prelude wouldn't be empty so it wouldn't violate the empty static shells rule.
        // But if you have Suspense above body, the prelude is empty but we allow that because having Suspense
        // is an explicit signal from the user that they acknowledge the empty shell and want dynamic rendering.
        dynamicValidation.hasAllowedDynamic = true;
        dynamicValidation.hasSuspenseAboveBody = true;
        return;
    } else if (hasSuspenseRegex.test(componentStack)) {
        // this error had a Suspense boundary above it so we don't need to report it as a source
        // of disallowed
        dynamicValidation.hasAllowedDynamic = true;
        return;
    } else if (clientDynamic.syncDynamicErrorWithStack) {
        // This task was the task that called the sync error.
        dynamicValidation.dynamicErrors.push(clientDynamic.syncDynamicErrorWithStack);
        return;
    } else {
        const message = `Route "${workStore.route}": A component accessed data, headers, params, searchParams, or a short-lived cache without a Suspense boundary nor a "use cache" above it. See more info: https://nextjs.org/docs/messages/next-prerender-missing-suspense`;
        const error = createErrorWithComponentOrOwnerStack(message, componentStack);
        dynamicValidation.dynamicErrors.push(error);
        return;
    }
}
/**
 * In dev mode, we prefer using the owner stack, otherwise the provided
 * component stack is used.
 */ function createErrorWithComponentOrOwnerStack(message, componentStack) {
    const ownerStack = ("TURBOPACK compile-time value", "development") !== 'production' && _react.default.captureOwnerStack ? _react.default.captureOwnerStack() : null;
    const error = Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.stack = error.name + ': ' + message + (ownerStack ?? componentStack);
    return error;
}
var PreludeState = /*#__PURE__*/ function(PreludeState) {
    PreludeState[PreludeState["Full"] = 0] = "Full";
    PreludeState[PreludeState["Empty"] = 1] = "Empty";
    PreludeState[PreludeState["Errored"] = 2] = "Errored";
    return PreludeState;
}({});
function logDisallowedDynamicError(workStore, error) {
    console.error(error);
    if (!workStore.dev) {
        if (workStore.hasReadableErrorStacks) {
            console.error(`To get a more detailed stack trace and pinpoint the issue, start the app in development mode by running \`next dev\`, then open "${workStore.route}" in your browser to investigate the error.`);
        } else {
            console.error(`To get a more detailed stack trace and pinpoint the issue, try one of the following:
  - Start the app in development mode by running \`next dev\`, then open "${workStore.route}" in your browser to investigate the error.
  - Rerun the production build with \`next build --debug-prerender\` to generate better stack traces.`);
        }
    }
}
function throwIfDisallowedDynamic(workStore, prelude, dynamicValidation, serverDynamic) {
    if (serverDynamic.syncDynamicErrorWithStack) {
        logDisallowedDynamicError(workStore, serverDynamic.syncDynamicErrorWithStack);
        throw new _staticgenerationbailout.StaticGenBailoutError();
    }
    if (prelude !== 0) {
        if (dynamicValidation.hasSuspenseAboveBody) {
            // This route has opted into allowing fully dynamic rendering
            // by including a Suspense boundary above the body. In this case
            // a lack of a shell is not considered disallowed so we simply return
            return;
        }
        // We didn't have any sync bailouts but there may be user code which
        // blocked the root. We would have captured these during the prerender
        // and can log them here and then terminate the build/validating render
        const dynamicErrors = dynamicValidation.dynamicErrors;
        if (dynamicErrors.length > 0) {
            for(let i = 0; i < dynamicErrors.length; i++){
                logDisallowedDynamicError(workStore, dynamicErrors[i]);
            }
            throw new _staticgenerationbailout.StaticGenBailoutError();
        }
        // If we got this far then the only other thing that could be blocking
        // the root is dynamic Viewport. If this is dynamic then
        // you need to opt into that by adding a Suspense boundary above the body
        // to indicate your are ok with fully dynamic rendering.
        if (dynamicValidation.hasDynamicViewport) {
            console.error(`Route "${workStore.route}" has a \`generateViewport\` that depends on Request data (\`cookies()\`, etc...) or uncached external data (\`fetch(...)\`, etc...) without explicitly allowing fully dynamic rendering. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-viewport`);
            throw new _staticgenerationbailout.StaticGenBailoutError();
        }
        if (prelude === 1) {
            // If we ever get this far then we messed up the tracking of invalid dynamic.
            // We still adhere to the constraint that you must produce a shell but invite the
            // user to report this as a bug in Next.js.
            console.error(`Route "${workStore.route}" did not produce a static shell and Next.js was unable to determine a reason. This is a bug in Next.js.`);
            throw new _staticgenerationbailout.StaticGenBailoutError();
        }
    } else {
        if (dynamicValidation.hasAllowedDynamic === false && dynamicValidation.hasDynamicMetadata) {
            console.error(`Route "${workStore.route}" has a \`generateMetadata\` that depends on Request data (\`cookies()\`, etc...) or uncached external data (\`fetch(...)\`, etc...) when the rest of the route does not. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-metadata`);
            throw new _staticgenerationbailout.StaticGenBailoutError();
        }
    }
}
function delayUntilRuntimeStage(prerenderStore, result) {
    if (prerenderStore.runtimeStagePromise) {
        return prerenderStore.runtimeStagePromise.then(()=>result);
    }
    return result;
} //# sourceMappingURL=dynamic-rendering.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/unstable-rethrow.server.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "unstable_rethrow", {
    enumerable: true,
    get: function() {
        return unstable_rethrow;
    }
});
const _dynamicrenderingutils = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/dynamic-rendering-utils.js [app-ssr] (ecmascript)");
const _ispostpone = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/lib/router-utils/is-postpone.js [app-ssr] (ecmascript)");
const _bailouttocsr = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-ssr] (ecmascript)");
const _isnextroutererror = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/is-next-router-error.js [app-ssr] (ecmascript)");
const _dynamicrendering = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-ssr] (ecmascript)");
const _hooksservercontext = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/hooks-server-context.js [app-ssr] (ecmascript)");
function unstable_rethrow(error) {
    if ((0, _isnextroutererror.isNextRouterError)(error) || (0, _bailouttocsr.isBailoutToCSRError)(error) || (0, _hooksservercontext.isDynamicServerError)(error) || (0, _dynamicrendering.isDynamicPostpone)(error) || (0, _ispostpone.isPostpone)(error) || (0, _dynamicrenderingutils.isHangingPromiseRejectionError)(error) || (0, _dynamicrendering.isPrerenderInterruptedError)(error)) {
        throw error;
    }
    if (error instanceof Error && 'cause' in error) {
        unstable_rethrow(error.cause);
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=unstable-rethrow.server.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/unstable-rethrow.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * This function should be used to rethrow internal Next.js errors so that they can be handled by the framework.
 * When wrapping an API that uses errors to interrupt control flow, you should use this function before you do any error handling.
 * This function will rethrow the error if it is a Next.js error so it can be handled, otherwise it will do nothing.
 *
 * Read more: [Next.js Docs: `unstable_rethrow`](https://nextjs.org/docs/app/api-reference/functions/unstable_rethrow)
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "unstable_rethrow", {
    enumerable: true,
    get: function() {
        return unstable_rethrow;
    }
});
const unstable_rethrow = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/unstable-rethrow.server.js [app-ssr] (ecmascript)").unstable_rethrow : "TURBOPACK unreachable";
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=unstable-rethrow.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/navigation.react-server.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @internal */ Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ReadonlyURLSearchParams: null,
    RedirectType: null,
    forbidden: null,
    notFound: null,
    permanentRedirect: null,
    redirect: null,
    unauthorized: null,
    unstable_isUnrecognizedActionError: null,
    unstable_rethrow: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ReadonlyURLSearchParams: function() {
        return ReadonlyURLSearchParams;
    },
    RedirectType: function() {
        return _redirecterror.RedirectType;
    },
    forbidden: function() {
        return _forbidden.forbidden;
    },
    notFound: function() {
        return _notfound.notFound;
    },
    permanentRedirect: function() {
        return _redirect.permanentRedirect;
    },
    redirect: function() {
        return _redirect.redirect;
    },
    unauthorized: function() {
        return _unauthorized.unauthorized;
    },
    unstable_isUnrecognizedActionError: function() {
        return unstable_isUnrecognizedActionError;
    },
    unstable_rethrow: function() {
        return _unstablerethrow.unstable_rethrow;
    }
});
const _redirect = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/redirect.js [app-ssr] (ecmascript)");
const _redirecterror = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/redirect-error.js [app-ssr] (ecmascript)");
const _notfound = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/not-found.js [app-ssr] (ecmascript)");
const _forbidden = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/forbidden.js [app-ssr] (ecmascript)");
const _unauthorized = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/unauthorized.js [app-ssr] (ecmascript)");
const _unstablerethrow = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/unstable-rethrow.js [app-ssr] (ecmascript)");
class ReadonlyURLSearchParamsError extends Error {
    constructor(){
        super('Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams');
    }
}
class ReadonlyURLSearchParams extends URLSearchParams {
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ append() {
        throw new ReadonlyURLSearchParamsError();
    }
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ delete() {
        throw new ReadonlyURLSearchParamsError();
    }
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ set() {
        throw new ReadonlyURLSearchParamsError();
    }
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ sort() {
        throw new ReadonlyURLSearchParamsError();
    }
}
function unstable_isUnrecognizedActionError() {
    throw Object.defineProperty(new Error('`unstable_isUnrecognizedActionError` can only be used on the client.'), "__NEXT_ERROR_CODE", {
        value: "E776",
        enumerable: false,
        configurable: true
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=navigation.react-server.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/server-inserted-html.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['contexts'].ServerInsertedHtml; //# sourceMappingURL=server-inserted-html.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/unrecognized-action-error.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    UnrecognizedActionError: null,
    unstable_isUnrecognizedActionError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    UnrecognizedActionError: function() {
        return UnrecognizedActionError;
    },
    unstable_isUnrecognizedActionError: function() {
        return unstable_isUnrecognizedActionError;
    }
});
class UnrecognizedActionError extends Error {
    constructor(...args){
        super(...args);
        this.name = 'UnrecognizedActionError';
    }
}
function unstable_isUnrecognizedActionError(error) {
    return !!(error && typeof error === 'object' && error instanceof UnrecognizedActionError);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=unrecognized-action-error.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/navigation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ReadonlyURLSearchParams: null,
    RedirectType: null,
    ServerInsertedHTMLContext: null,
    forbidden: null,
    notFound: null,
    permanentRedirect: null,
    redirect: null,
    unauthorized: null,
    unstable_isUnrecognizedActionError: null,
    unstable_rethrow: null,
    useParams: null,
    usePathname: null,
    useRouter: null,
    useSearchParams: null,
    useSelectedLayoutSegment: null,
    useSelectedLayoutSegments: null,
    useServerInsertedHTML: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ReadonlyURLSearchParams: function() {
        return _navigationreactserver.ReadonlyURLSearchParams;
    },
    RedirectType: function() {
        return _navigationreactserver.RedirectType;
    },
    ServerInsertedHTMLContext: function() {
        return _serverinsertedhtmlsharedruntime.ServerInsertedHTMLContext;
    },
    forbidden: function() {
        return _navigationreactserver.forbidden;
    },
    notFound: function() {
        return _navigationreactserver.notFound;
    },
    permanentRedirect: function() {
        return _navigationreactserver.permanentRedirect;
    },
    redirect: function() {
        return _navigationreactserver.redirect;
    },
    unauthorized: function() {
        return _navigationreactserver.unauthorized;
    },
    unstable_isUnrecognizedActionError: function() {
        return _unrecognizedactionerror.unstable_isUnrecognizedActionError;
    },
    unstable_rethrow: function() {
        return _navigationreactserver.unstable_rethrow;
    },
    useParams: function() {
        return useParams;
    },
    usePathname: function() {
        return usePathname;
    },
    useRouter: function() {
        return useRouter;
    },
    useSearchParams: function() {
        return useSearchParams;
    },
    useSelectedLayoutSegment: function() {
        return useSelectedLayoutSegment;
    },
    useSelectedLayoutSegments: function() {
        return useSelectedLayoutSegments;
    },
    useServerInsertedHTML: function() {
        return _serverinsertedhtmlsharedruntime.useServerInsertedHTML;
    }
});
const _react = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/app-router-context.js [app-ssr] (ecmascript)");
const _hooksclientcontextsharedruntime = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/hooks-client-context.js [app-ssr] (ecmascript)");
const _getsegmentvalue = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/router-reducer/reducers/get-segment-value.js [app-ssr] (ecmascript)");
const _segment = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)");
const _navigationreactserver = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/navigation.react-server.js [app-ssr] (ecmascript)");
const _serverinsertedhtmlsharedruntime = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/server-inserted-html.js [app-ssr] (ecmascript)");
const _unrecognizedactionerror = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/unrecognized-action-error.js [app-ssr] (ecmascript)");
const useDynamicRouteParams = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-ssr] (ecmascript)").useDynamicRouteParams : "TURBOPACK unreachable";
const useDynamicSearchParams = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-ssr] (ecmascript)").useDynamicSearchParams : "TURBOPACK unreachable";
function useSearchParams() {
    useDynamicSearchParams?.('useSearchParams()');
    const searchParams = (0, _react.useContext)(_hooksclientcontextsharedruntime.SearchParamsContext);
    // In the case where this is `null`, the compat types added in
    // `next-env.d.ts` will add a new overload that changes the return type to
    // include `null`.
    const readonlySearchParams = (0, _react.useMemo)(()=>{
        if (!searchParams) {
            // When the router is not ready in pages, we won't have the search params
            // available.
            return null;
        }
        return new _navigationreactserver.ReadonlyURLSearchParams(searchParams);
    }, [
        searchParams
    ]);
    return readonlySearchParams;
}
function usePathname() {
    useDynamicRouteParams?.('usePathname()');
    // In the case where this is `null`, the compat types added in `next-env.d.ts`
    // will add a new overload that changes the return type to include `null`.
    return (0, _react.useContext)(_hooksclientcontextsharedruntime.PathnameContext);
}
function useRouter() {
    const router = (0, _react.useContext)(_approutercontextsharedruntime.AppRouterContext);
    if (router === null) {
        throw Object.defineProperty(new Error('invariant expected app router to be mounted'), "__NEXT_ERROR_CODE", {
            value: "E238",
            enumerable: false,
            configurable: true
        });
    }
    return router;
}
function useParams() {
    useDynamicRouteParams?.('useParams()');
    return (0, _react.useContext)(_hooksclientcontextsharedruntime.PathParamsContext);
}
/** Get the canonical parameters from the current level to the leaf node. */ // Client components API
function getSelectedLayoutSegmentPath(tree, parallelRouteKey, first = true, segmentPath = []) {
    let node;
    if (first) {
        // Use the provided parallel route key on the first parallel route
        node = tree[1][parallelRouteKey];
    } else {
        // After first parallel route prefer children, if there's no children pick the first parallel route.
        const parallelRoutes = tree[1];
        node = parallelRoutes.children ?? Object.values(parallelRoutes)[0];
    }
    if (!node) return segmentPath;
    const segment = node[0];
    let segmentValue = (0, _getsegmentvalue.getSegmentValue)(segment);
    if (!segmentValue || segmentValue.startsWith(_segment.PAGE_SEGMENT_KEY)) {
        return segmentPath;
    }
    segmentPath.push(segmentValue);
    return getSelectedLayoutSegmentPath(node, parallelRouteKey, false, segmentPath);
}
function useSelectedLayoutSegments(parallelRouteKey = 'children') {
    useDynamicRouteParams?.('useSelectedLayoutSegments()');
    const context = (0, _react.useContext)(_approutercontextsharedruntime.LayoutRouterContext);
    // @ts-expect-error This only happens in `pages`. Type is overwritten in navigation.d.ts
    if (!context) return null;
    return getSelectedLayoutSegmentPath(context.parentTree, parallelRouteKey);
}
function useSelectedLayoutSegment(parallelRouteKey = 'children') {
    useDynamicRouteParams?.('useSelectedLayoutSegment()');
    const selectedLayoutSegments = useSelectedLayoutSegments(parallelRouteKey);
    if (!selectedLayoutSegments || selectedLayoutSegments.length === 0) {
        return null;
    }
    const selectedLayoutSegment = parallelRouteKey === 'children' ? selectedLayoutSegments[0] : selectedLayoutSegments[selectedLayoutSegments.length - 1];
    // if the default slot is showing, we return null since it's not technically "selected" (it's a fallback)
    // and returning an internal value like `__DEFAULT__` would be confusing.
    return selectedLayoutSegment === _segment.DEFAULT_SEGMENT_KEY ? null : selectedLayoutSegment;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=navigation.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/navigation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/navigation.js [app-ssr] (ecmascript)");
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clsx",
    ()=>clsx,
    "default",
    ()=>__TURBOPACK__default__export__
]);
function r(e) {
    var t, f, n = "";
    if ("string" == typeof e || "number" == typeof e) n += e;
    else if ("object" == typeof e) if (Array.isArray(e)) {
        var o = e.length;
        for(t = 0; t < o; t++)e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
    } else for(f in e)e[f] && (n && (n += " "), n += f);
    return n;
}
function clsx() {
    for(var e, t, f = 0, n = "", o = arguments.length; f < o; f++)(e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
    return n;
}
const __TURBOPACK__default__export__ = clsx;
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/tailwind-merge@2.6.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTailwindMerge",
    ()=>createTailwindMerge,
    "extendTailwindMerge",
    ()=>extendTailwindMerge,
    "fromTheme",
    ()=>fromTheme,
    "getDefaultConfig",
    ()=>getDefaultConfig,
    "mergeConfigs",
    ()=>mergeConfigs,
    "twJoin",
    ()=>twJoin,
    "twMerge",
    ()=>twMerge,
    "validators",
    ()=>validators
]);
const CLASS_PART_SEPARATOR = '-';
const createClassGroupUtils = (config)=>{
    const classMap = createClassMap(config);
    const { conflictingClassGroups, conflictingClassGroupModifiers } = config;
    const getClassGroupId = (className)=>{
        const classParts = className.split(CLASS_PART_SEPARATOR);
        // Classes like `-inset-1` produce an empty string as first classPart. We assume that classes for negative values are used correctly and remove it from classParts.
        if (classParts[0] === '' && classParts.length !== 1) {
            classParts.shift();
        }
        return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
    };
    const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier)=>{
        const conflicts = conflictingClassGroups[classGroupId] || [];
        if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
            return [
                ...conflicts,
                ...conflictingClassGroupModifiers[classGroupId]
            ];
        }
        return conflicts;
    };
    return {
        getClassGroupId,
        getConflictingClassGroupIds
    };
};
const getGroupRecursive = (classParts, classPartObject)=>{
    if (classParts.length === 0) {
        return classPartObject.classGroupId;
    }
    const currentClassPart = classParts[0];
    const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
    const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : undefined;
    if (classGroupFromNextClassPart) {
        return classGroupFromNextClassPart;
    }
    if (classPartObject.validators.length === 0) {
        return undefined;
    }
    const classRest = classParts.join(CLASS_PART_SEPARATOR);
    return classPartObject.validators.find(({ validator })=>validator(classRest))?.classGroupId;
};
const arbitraryPropertyRegex = /^\[(.+)\]$/;
const getGroupIdForArbitraryProperty = (className)=>{
    if (arbitraryPropertyRegex.test(className)) {
        const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
        const property = arbitraryPropertyClassName?.substring(0, arbitraryPropertyClassName.indexOf(':'));
        if (property) {
            // I use two dots here because one dot is used as prefix for class groups in plugins
            return 'arbitrary..' + property;
        }
    }
};
/**
 * Exported for testing only
 */ const createClassMap = (config)=>{
    const { theme, prefix } = config;
    const classMap = {
        nextPart: new Map(),
        validators: []
    };
    const prefixedClassGroupEntries = getPrefixedClassGroupEntries(Object.entries(config.classGroups), prefix);
    prefixedClassGroupEntries.forEach(([classGroupId, classGroup])=>{
        processClassesRecursively(classGroup, classMap, classGroupId, theme);
    });
    return classMap;
};
const processClassesRecursively = (classGroup, classPartObject, classGroupId, theme)=>{
    classGroup.forEach((classDefinition)=>{
        if (typeof classDefinition === 'string') {
            const classPartObjectToEdit = classDefinition === '' ? classPartObject : getPart(classPartObject, classDefinition);
            classPartObjectToEdit.classGroupId = classGroupId;
            return;
        }
        if (typeof classDefinition === 'function') {
            if (isThemeGetter(classDefinition)) {
                processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
                return;
            }
            classPartObject.validators.push({
                validator: classDefinition,
                classGroupId
            });
            return;
        }
        Object.entries(classDefinition).forEach(([key, classGroup])=>{
            processClassesRecursively(classGroup, getPart(classPartObject, key), classGroupId, theme);
        });
    });
};
const getPart = (classPartObject, path)=>{
    let currentClassPartObject = classPartObject;
    path.split(CLASS_PART_SEPARATOR).forEach((pathPart)=>{
        if (!currentClassPartObject.nextPart.has(pathPart)) {
            currentClassPartObject.nextPart.set(pathPart, {
                nextPart: new Map(),
                validators: []
            });
        }
        currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
    });
    return currentClassPartObject;
};
const isThemeGetter = (func)=>func.isThemeGetter;
const getPrefixedClassGroupEntries = (classGroupEntries, prefix)=>{
    if (!prefix) {
        return classGroupEntries;
    }
    return classGroupEntries.map(([classGroupId, classGroup])=>{
        const prefixedClassGroup = classGroup.map((classDefinition)=>{
            if (typeof classDefinition === 'string') {
                return prefix + classDefinition;
            }
            if (typeof classDefinition === 'object') {
                return Object.fromEntries(Object.entries(classDefinition).map(([key, value])=>[
                        prefix + key,
                        value
                    ]));
            }
            return classDefinition;
        });
        return [
            classGroupId,
            prefixedClassGroup
        ];
    });
};
// LRU cache inspired from hashlru (https://github.com/dominictarr/hashlru/blob/v1.0.4/index.js) but object replaced with Map to improve performance
const createLruCache = (maxCacheSize)=>{
    if (maxCacheSize < 1) {
        return {
            get: ()=>undefined,
            set: ()=>{}
        };
    }
    let cacheSize = 0;
    let cache = new Map();
    let previousCache = new Map();
    const update = (key, value)=>{
        cache.set(key, value);
        cacheSize++;
        if (cacheSize > maxCacheSize) {
            cacheSize = 0;
            previousCache = cache;
            cache = new Map();
        }
    };
    return {
        get (key) {
            let value = cache.get(key);
            if (value !== undefined) {
                return value;
            }
            if ((value = previousCache.get(key)) !== undefined) {
                update(key, value);
                return value;
            }
        },
        set (key, value) {
            if (cache.has(key)) {
                cache.set(key, value);
            } else {
                update(key, value);
            }
        }
    };
};
const IMPORTANT_MODIFIER = '!';
const createParseClassName = (config)=>{
    const { separator, experimentalParseClassName } = config;
    const isSeparatorSingleCharacter = separator.length === 1;
    const firstSeparatorCharacter = separator[0];
    const separatorLength = separator.length;
    // parseClassName inspired by https://github.com/tailwindlabs/tailwindcss/blob/v3.2.2/src/util/splitAtTopLevelOnly.js
    const parseClassName = (className)=>{
        const modifiers = [];
        let bracketDepth = 0;
        let modifierStart = 0;
        let postfixModifierPosition;
        for(let index = 0; index < className.length; index++){
            let currentCharacter = className[index];
            if (bracketDepth === 0) {
                if (currentCharacter === firstSeparatorCharacter && (isSeparatorSingleCharacter || className.slice(index, index + separatorLength) === separator)) {
                    modifiers.push(className.slice(modifierStart, index));
                    modifierStart = index + separatorLength;
                    continue;
                }
                if (currentCharacter === '/') {
                    postfixModifierPosition = index;
                    continue;
                }
            }
            if (currentCharacter === '[') {
                bracketDepth++;
            } else if (currentCharacter === ']') {
                bracketDepth--;
            }
        }
        const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
        const hasImportantModifier = baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER);
        const baseClassName = hasImportantModifier ? baseClassNameWithImportantModifier.substring(1) : baseClassNameWithImportantModifier;
        const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : undefined;
        return {
            modifiers,
            hasImportantModifier,
            baseClassName,
            maybePostfixModifierPosition
        };
    };
    if (experimentalParseClassName) {
        return (className)=>experimentalParseClassName({
                className,
                parseClassName
            });
    }
    return parseClassName;
};
/**
 * Sorts modifiers according to following schema:
 * - Predefined modifiers are sorted alphabetically
 * - When an arbitrary variant appears, it must be preserved which modifiers are before and after it
 */ const sortModifiers = (modifiers)=>{
    if (modifiers.length <= 1) {
        return modifiers;
    }
    const sortedModifiers = [];
    let unsortedModifiers = [];
    modifiers.forEach((modifier)=>{
        const isArbitraryVariant = modifier[0] === '[';
        if (isArbitraryVariant) {
            sortedModifiers.push(...unsortedModifiers.sort(), modifier);
            unsortedModifiers = [];
        } else {
            unsortedModifiers.push(modifier);
        }
    });
    sortedModifiers.push(...unsortedModifiers.sort());
    return sortedModifiers;
};
const createConfigUtils = (config)=>({
        cache: createLruCache(config.cacheSize),
        parseClassName: createParseClassName(config),
        ...createClassGroupUtils(config)
    });
const SPLIT_CLASSES_REGEX = /\s+/;
const mergeClassList = (classList, configUtils)=>{
    const { parseClassName, getClassGroupId, getConflictingClassGroupIds } = configUtils;
    /**
   * Set of classGroupIds in following format:
   * `{importantModifier}{variantModifiers}{classGroupId}`
   * @example 'float'
   * @example 'hover:focus:bg-color'
   * @example 'md:!pr'
   */ const classGroupsInConflict = [];
    const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
    let result = '';
    for(let index = classNames.length - 1; index >= 0; index -= 1){
        const originalClassName = classNames[index];
        const { modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition } = parseClassName(originalClassName);
        let hasPostfixModifier = Boolean(maybePostfixModifierPosition);
        let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
        if (!classGroupId) {
            if (!hasPostfixModifier) {
                // Not a Tailwind class
                result = originalClassName + (result.length > 0 ? ' ' + result : result);
                continue;
            }
            classGroupId = getClassGroupId(baseClassName);
            if (!classGroupId) {
                // Not a Tailwind class
                result = originalClassName + (result.length > 0 ? ' ' + result : result);
                continue;
            }
            hasPostfixModifier = false;
        }
        const variantModifier = sortModifiers(modifiers).join(':');
        const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
        const classId = modifierId + classGroupId;
        if (classGroupsInConflict.includes(classId)) {
            continue;
        }
        classGroupsInConflict.push(classId);
        const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
        for(let i = 0; i < conflictGroups.length; ++i){
            const group = conflictGroups[i];
            classGroupsInConflict.push(modifierId + group);
        }
        // Tailwind class not in conflict
        result = originalClassName + (result.length > 0 ? ' ' + result : result);
    }
    return result;
};
/**
 * The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of tailwind-merge better.
 *
 * Specifically:
 * - Runtime code from https://github.com/lukeed/clsx/blob/v1.2.1/src/index.js
 * - TypeScript types from https://github.com/lukeed/clsx/blob/v1.2.1/clsx.d.ts
 *
 * Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 */ function twJoin() {
    let index = 0;
    let argument;
    let resolvedValue;
    let string = '';
    while(index < arguments.length){
        if (argument = arguments[index++]) {
            if (resolvedValue = toValue(argument)) {
                string && (string += ' ');
                string += resolvedValue;
            }
        }
    }
    return string;
}
const toValue = (mix)=>{
    if (typeof mix === 'string') {
        return mix;
    }
    let resolvedValue;
    let string = '';
    for(let k = 0; k < mix.length; k++){
        if (mix[k]) {
            if (resolvedValue = toValue(mix[k])) {
                string && (string += ' ');
                string += resolvedValue;
            }
        }
    }
    return string;
};
function createTailwindMerge(createConfigFirst, ...createConfigRest) {
    let configUtils;
    let cacheGet;
    let cacheSet;
    let functionToCall = initTailwindMerge;
    function initTailwindMerge(classList) {
        const config = createConfigRest.reduce((previousConfig, createConfigCurrent)=>createConfigCurrent(previousConfig), createConfigFirst());
        configUtils = createConfigUtils(config);
        cacheGet = configUtils.cache.get;
        cacheSet = configUtils.cache.set;
        functionToCall = tailwindMerge;
        return tailwindMerge(classList);
    }
    function tailwindMerge(classList) {
        const cachedResult = cacheGet(classList);
        if (cachedResult) {
            return cachedResult;
        }
        const result = mergeClassList(classList, configUtils);
        cacheSet(classList, result);
        return result;
    }
    return function callTailwindMerge() {
        return functionToCall(twJoin.apply(null, arguments));
    };
}
const fromTheme = (key)=>{
    const themeGetter = (theme)=>theme[key] || [];
    themeGetter.isThemeGetter = true;
    return themeGetter;
};
const arbitraryValueRegex = /^\[(?:([a-z-]+):)?(.+)\]$/i;
const fractionRegex = /^\d+\/\d+$/;
const stringLengths = /*#__PURE__*/ new Set([
    'px',
    'full',
    'screen'
]);
const tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
const lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
const colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/;
// Shadow always begins with x and y offset separated by underscore optionally prepended by inset
const shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
const imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
const isLength = (value)=>isNumber(value) || stringLengths.has(value) || fractionRegex.test(value);
const isArbitraryLength = (value)=>getIsArbitraryValue(value, 'length', isLengthOnly);
const isNumber = (value)=>Boolean(value) && !Number.isNaN(Number(value));
const isArbitraryNumber = (value)=>getIsArbitraryValue(value, 'number', isNumber);
const isInteger = (value)=>Boolean(value) && Number.isInteger(Number(value));
const isPercent = (value)=>value.endsWith('%') && isNumber(value.slice(0, -1));
const isArbitraryValue = (value)=>arbitraryValueRegex.test(value);
const isTshirtSize = (value)=>tshirtUnitRegex.test(value);
const sizeLabels = /*#__PURE__*/ new Set([
    'length',
    'size',
    'percentage'
]);
const isArbitrarySize = (value)=>getIsArbitraryValue(value, sizeLabels, isNever);
const isArbitraryPosition = (value)=>getIsArbitraryValue(value, 'position', isNever);
const imageLabels = /*#__PURE__*/ new Set([
    'image',
    'url'
]);
const isArbitraryImage = (value)=>getIsArbitraryValue(value, imageLabels, isImage);
const isArbitraryShadow = (value)=>getIsArbitraryValue(value, '', isShadow);
const isAny = ()=>true;
const getIsArbitraryValue = (value, label, testValue)=>{
    const result = arbitraryValueRegex.exec(value);
    if (result) {
        if (result[1]) {
            return typeof label === 'string' ? result[1] === label : label.has(result[1]);
        }
        return testValue(result[2]);
    }
    return false;
};
const isLengthOnly = (value)=>// `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
    // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
    // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
    lengthUnitRegex.test(value) && !colorFunctionRegex.test(value);
const isNever = ()=>false;
const isShadow = (value)=>shadowRegex.test(value);
const isImage = (value)=>imageRegex.test(value);
const validators = /*#__PURE__*/ Object.defineProperty({
    __proto__: null,
    isAny,
    isArbitraryImage,
    isArbitraryLength,
    isArbitraryNumber,
    isArbitraryPosition,
    isArbitraryShadow,
    isArbitrarySize,
    isArbitraryValue,
    isInteger,
    isLength,
    isNumber,
    isPercent,
    isTshirtSize
}, Symbol.toStringTag, {
    value: 'Module'
});
const getDefaultConfig = ()=>{
    const colors = fromTheme('colors');
    const spacing = fromTheme('spacing');
    const blur = fromTheme('blur');
    const brightness = fromTheme('brightness');
    const borderColor = fromTheme('borderColor');
    const borderRadius = fromTheme('borderRadius');
    const borderSpacing = fromTheme('borderSpacing');
    const borderWidth = fromTheme('borderWidth');
    const contrast = fromTheme('contrast');
    const grayscale = fromTheme('grayscale');
    const hueRotate = fromTheme('hueRotate');
    const invert = fromTheme('invert');
    const gap = fromTheme('gap');
    const gradientColorStops = fromTheme('gradientColorStops');
    const gradientColorStopPositions = fromTheme('gradientColorStopPositions');
    const inset = fromTheme('inset');
    const margin = fromTheme('margin');
    const opacity = fromTheme('opacity');
    const padding = fromTheme('padding');
    const saturate = fromTheme('saturate');
    const scale = fromTheme('scale');
    const sepia = fromTheme('sepia');
    const skew = fromTheme('skew');
    const space = fromTheme('space');
    const translate = fromTheme('translate');
    const getOverscroll = ()=>[
            'auto',
            'contain',
            'none'
        ];
    const getOverflow = ()=>[
            'auto',
            'hidden',
            'clip',
            'visible',
            'scroll'
        ];
    const getSpacingWithAutoAndArbitrary = ()=>[
            'auto',
            isArbitraryValue,
            spacing
        ];
    const getSpacingWithArbitrary = ()=>[
            isArbitraryValue,
            spacing
        ];
    const getLengthWithEmptyAndArbitrary = ()=>[
            '',
            isLength,
            isArbitraryLength
        ];
    const getNumberWithAutoAndArbitrary = ()=>[
            'auto',
            isNumber,
            isArbitraryValue
        ];
    const getPositions = ()=>[
            'bottom',
            'center',
            'left',
            'left-bottom',
            'left-top',
            'right',
            'right-bottom',
            'right-top',
            'top'
        ];
    const getLineStyles = ()=>[
            'solid',
            'dashed',
            'dotted',
            'double',
            'none'
        ];
    const getBlendModes = ()=>[
            'normal',
            'multiply',
            'screen',
            'overlay',
            'darken',
            'lighten',
            'color-dodge',
            'color-burn',
            'hard-light',
            'soft-light',
            'difference',
            'exclusion',
            'hue',
            'saturation',
            'color',
            'luminosity'
        ];
    const getAlign = ()=>[
            'start',
            'end',
            'center',
            'between',
            'around',
            'evenly',
            'stretch'
        ];
    const getZeroAndEmpty = ()=>[
            '',
            '0',
            isArbitraryValue
        ];
    const getBreaks = ()=>[
            'auto',
            'avoid',
            'all',
            'avoid-page',
            'page',
            'left',
            'right',
            'column'
        ];
    const getNumberAndArbitrary = ()=>[
            isNumber,
            isArbitraryValue
        ];
    return {
        cacheSize: 500,
        separator: ':',
        theme: {
            colors: [
                isAny
            ],
            spacing: [
                isLength,
                isArbitraryLength
            ],
            blur: [
                'none',
                '',
                isTshirtSize,
                isArbitraryValue
            ],
            brightness: getNumberAndArbitrary(),
            borderColor: [
                colors
            ],
            borderRadius: [
                'none',
                '',
                'full',
                isTshirtSize,
                isArbitraryValue
            ],
            borderSpacing: getSpacingWithArbitrary(),
            borderWidth: getLengthWithEmptyAndArbitrary(),
            contrast: getNumberAndArbitrary(),
            grayscale: getZeroAndEmpty(),
            hueRotate: getNumberAndArbitrary(),
            invert: getZeroAndEmpty(),
            gap: getSpacingWithArbitrary(),
            gradientColorStops: [
                colors
            ],
            gradientColorStopPositions: [
                isPercent,
                isArbitraryLength
            ],
            inset: getSpacingWithAutoAndArbitrary(),
            margin: getSpacingWithAutoAndArbitrary(),
            opacity: getNumberAndArbitrary(),
            padding: getSpacingWithArbitrary(),
            saturate: getNumberAndArbitrary(),
            scale: getNumberAndArbitrary(),
            sepia: getZeroAndEmpty(),
            skew: getNumberAndArbitrary(),
            space: getSpacingWithArbitrary(),
            translate: getSpacingWithArbitrary()
        },
        classGroups: {
            // Layout
            /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */ aspect: [
                {
                    aspect: [
                        'auto',
                        'square',
                        'video',
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */ container: [
                'container'
            ],
            /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */ columns: [
                {
                    columns: [
                        isTshirtSize
                    ]
                }
            ],
            /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */ 'break-after': [
                {
                    'break-after': getBreaks()
                }
            ],
            /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */ 'break-before': [
                {
                    'break-before': getBreaks()
                }
            ],
            /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */ 'break-inside': [
                {
                    'break-inside': [
                        'auto',
                        'avoid',
                        'avoid-page',
                        'avoid-column'
                    ]
                }
            ],
            /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */ 'box-decoration': [
                {
                    'box-decoration': [
                        'slice',
                        'clone'
                    ]
                }
            ],
            /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */ box: [
                {
                    box: [
                        'border',
                        'content'
                    ]
                }
            ],
            /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */ display: [
                'block',
                'inline-block',
                'inline',
                'flex',
                'inline-flex',
                'table',
                'inline-table',
                'table-caption',
                'table-cell',
                'table-column',
                'table-column-group',
                'table-footer-group',
                'table-header-group',
                'table-row-group',
                'table-row',
                'flow-root',
                'grid',
                'inline-grid',
                'contents',
                'list-item',
                'hidden'
            ],
            /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */ float: [
                {
                    float: [
                        'right',
                        'left',
                        'none',
                        'start',
                        'end'
                    ]
                }
            ],
            /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */ clear: [
                {
                    clear: [
                        'left',
                        'right',
                        'both',
                        'none',
                        'start',
                        'end'
                    ]
                }
            ],
            /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */ isolation: [
                'isolate',
                'isolation-auto'
            ],
            /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */ 'object-fit': [
                {
                    object: [
                        'contain',
                        'cover',
                        'fill',
                        'none',
                        'scale-down'
                    ]
                }
            ],
            /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */ 'object-position': [
                {
                    object: [
                        ...getPositions(),
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */ overflow: [
                {
                    overflow: getOverflow()
                }
            ],
            /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */ 'overflow-x': [
                {
                    'overflow-x': getOverflow()
                }
            ],
            /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */ 'overflow-y': [
                {
                    'overflow-y': getOverflow()
                }
            ],
            /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */ overscroll: [
                {
                    overscroll: getOverscroll()
                }
            ],
            /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */ 'overscroll-x': [
                {
                    'overscroll-x': getOverscroll()
                }
            ],
            /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */ 'overscroll-y': [
                {
                    'overscroll-y': getOverscroll()
                }
            ],
            /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */ position: [
                'static',
                'fixed',
                'absolute',
                'relative',
                'sticky'
            ],
            /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ inset: [
                {
                    inset: [
                        inset
                    ]
                }
            ],
            /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ 'inset-x': [
                {
                    'inset-x': [
                        inset
                    ]
                }
            ],
            /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ 'inset-y': [
                {
                    'inset-y': [
                        inset
                    ]
                }
            ],
            /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ start: [
                {
                    start: [
                        inset
                    ]
                }
            ],
            /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ end: [
                {
                    end: [
                        inset
                    ]
                }
            ],
            /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ top: [
                {
                    top: [
                        inset
                    ]
                }
            ],
            /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ right: [
                {
                    right: [
                        inset
                    ]
                }
            ],
            /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ bottom: [
                {
                    bottom: [
                        inset
                    ]
                }
            ],
            /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ left: [
                {
                    left: [
                        inset
                    ]
                }
            ],
            /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */ visibility: [
                'visible',
                'invisible',
                'collapse'
            ],
            /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */ z: [
                {
                    z: [
                        'auto',
                        isInteger,
                        isArbitraryValue
                    ]
                }
            ],
            // Flexbox and Grid
            /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */ basis: [
                {
                    basis: getSpacingWithAutoAndArbitrary()
                }
            ],
            /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */ 'flex-direction': [
                {
                    flex: [
                        'row',
                        'row-reverse',
                        'col',
                        'col-reverse'
                    ]
                }
            ],
            /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */ 'flex-wrap': [
                {
                    flex: [
                        'wrap',
                        'wrap-reverse',
                        'nowrap'
                    ]
                }
            ],
            /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */ flex: [
                {
                    flex: [
                        '1',
                        'auto',
                        'initial',
                        'none',
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */ grow: [
                {
                    grow: getZeroAndEmpty()
                }
            ],
            /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */ shrink: [
                {
                    shrink: getZeroAndEmpty()
                }
            ],
            /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */ order: [
                {
                    order: [
                        'first',
                        'last',
                        'none',
                        isInteger,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */ 'grid-cols': [
                {
                    'grid-cols': [
                        isAny
                    ]
                }
            ],
            /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */ 'col-start-end': [
                {
                    col: [
                        'auto',
                        {
                            span: [
                                'full',
                                isInteger,
                                isArbitraryValue
                            ]
                        },
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */ 'col-start': [
                {
                    'col-start': getNumberWithAutoAndArbitrary()
                }
            ],
            /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */ 'col-end': [
                {
                    'col-end': getNumberWithAutoAndArbitrary()
                }
            ],
            /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */ 'grid-rows': [
                {
                    'grid-rows': [
                        isAny
                    ]
                }
            ],
            /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */ 'row-start-end': [
                {
                    row: [
                        'auto',
                        {
                            span: [
                                isInteger,
                                isArbitraryValue
                            ]
                        },
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */ 'row-start': [
                {
                    'row-start': getNumberWithAutoAndArbitrary()
                }
            ],
            /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */ 'row-end': [
                {
                    'row-end': getNumberWithAutoAndArbitrary()
                }
            ],
            /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */ 'grid-flow': [
                {
                    'grid-flow': [
                        'row',
                        'col',
                        'dense',
                        'row-dense',
                        'col-dense'
                    ]
                }
            ],
            /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */ 'auto-cols': [
                {
                    'auto-cols': [
                        'auto',
                        'min',
                        'max',
                        'fr',
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */ 'auto-rows': [
                {
                    'auto-rows': [
                        'auto',
                        'min',
                        'max',
                        'fr',
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */ gap: [
                {
                    gap: [
                        gap
                    ]
                }
            ],
            /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */ 'gap-x': [
                {
                    'gap-x': [
                        gap
                    ]
                }
            ],
            /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */ 'gap-y': [
                {
                    'gap-y': [
                        gap
                    ]
                }
            ],
            /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */ 'justify-content': [
                {
                    justify: [
                        'normal',
                        ...getAlign()
                    ]
                }
            ],
            /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */ 'justify-items': [
                {
                    'justify-items': [
                        'start',
                        'end',
                        'center',
                        'stretch'
                    ]
                }
            ],
            /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */ 'justify-self': [
                {
                    'justify-self': [
                        'auto',
                        'start',
                        'end',
                        'center',
                        'stretch'
                    ]
                }
            ],
            /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */ 'align-content': [
                {
                    content: [
                        'normal',
                        ...getAlign(),
                        'baseline'
                    ]
                }
            ],
            /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */ 'align-items': [
                {
                    items: [
                        'start',
                        'end',
                        'center',
                        'baseline',
                        'stretch'
                    ]
                }
            ],
            /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */ 'align-self': [
                {
                    self: [
                        'auto',
                        'start',
                        'end',
                        'center',
                        'stretch',
                        'baseline'
                    ]
                }
            ],
            /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */ 'place-content': [
                {
                    'place-content': [
                        ...getAlign(),
                        'baseline'
                    ]
                }
            ],
            /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */ 'place-items': [
                {
                    'place-items': [
                        'start',
                        'end',
                        'center',
                        'baseline',
                        'stretch'
                    ]
                }
            ],
            /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */ 'place-self': [
                {
                    'place-self': [
                        'auto',
                        'start',
                        'end',
                        'center',
                        'stretch'
                    ]
                }
            ],
            // Spacing
            /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */ p: [
                {
                    p: [
                        padding
                    ]
                }
            ],
            /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */ px: [
                {
                    px: [
                        padding
                    ]
                }
            ],
            /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */ py: [
                {
                    py: [
                        padding
                    ]
                }
            ],
            /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */ ps: [
                {
                    ps: [
                        padding
                    ]
                }
            ],
            /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */ pe: [
                {
                    pe: [
                        padding
                    ]
                }
            ],
            /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */ pt: [
                {
                    pt: [
                        padding
                    ]
                }
            ],
            /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */ pr: [
                {
                    pr: [
                        padding
                    ]
                }
            ],
            /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */ pb: [
                {
                    pb: [
                        padding
                    ]
                }
            ],
            /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */ pl: [
                {
                    pl: [
                        padding
                    ]
                }
            ],
            /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */ m: [
                {
                    m: [
                        margin
                    ]
                }
            ],
            /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */ mx: [
                {
                    mx: [
                        margin
                    ]
                }
            ],
            /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */ my: [
                {
                    my: [
                        margin
                    ]
                }
            ],
            /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */ ms: [
                {
                    ms: [
                        margin
                    ]
                }
            ],
            /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */ me: [
                {
                    me: [
                        margin
                    ]
                }
            ],
            /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */ mt: [
                {
                    mt: [
                        margin
                    ]
                }
            ],
            /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */ mr: [
                {
                    mr: [
                        margin
                    ]
                }
            ],
            /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */ mb: [
                {
                    mb: [
                        margin
                    ]
                }
            ],
            /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */ ml: [
                {
                    ml: [
                        margin
                    ]
                }
            ],
            /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */ 'space-x': [
                {
                    'space-x': [
                        space
                    ]
                }
            ],
            /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */ 'space-x-reverse': [
                'space-x-reverse'
            ],
            /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */ 'space-y': [
                {
                    'space-y': [
                        space
                    ]
                }
            ],
            /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */ 'space-y-reverse': [
                'space-y-reverse'
            ],
            // Sizing
            /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */ w: [
                {
                    w: [
                        'auto',
                        'min',
                        'max',
                        'fit',
                        'svw',
                        'lvw',
                        'dvw',
                        isArbitraryValue,
                        spacing
                    ]
                }
            ],
            /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */ 'min-w': [
                {
                    'min-w': [
                        isArbitraryValue,
                        spacing,
                        'min',
                        'max',
                        'fit'
                    ]
                }
            ],
            /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */ 'max-w': [
                {
                    'max-w': [
                        isArbitraryValue,
                        spacing,
                        'none',
                        'full',
                        'min',
                        'max',
                        'fit',
                        'prose',
                        {
                            screen: [
                                isTshirtSize
                            ]
                        },
                        isTshirtSize
                    ]
                }
            ],
            /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */ h: [
                {
                    h: [
                        isArbitraryValue,
                        spacing,
                        'auto',
                        'min',
                        'max',
                        'fit',
                        'svh',
                        'lvh',
                        'dvh'
                    ]
                }
            ],
            /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */ 'min-h': [
                {
                    'min-h': [
                        isArbitraryValue,
                        spacing,
                        'min',
                        'max',
                        'fit',
                        'svh',
                        'lvh',
                        'dvh'
                    ]
                }
            ],
            /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */ 'max-h': [
                {
                    'max-h': [
                        isArbitraryValue,
                        spacing,
                        'min',
                        'max',
                        'fit',
                        'svh',
                        'lvh',
                        'dvh'
                    ]
                }
            ],
            /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */ size: [
                {
                    size: [
                        isArbitraryValue,
                        spacing,
                        'auto',
                        'min',
                        'max',
                        'fit'
                    ]
                }
            ],
            // Typography
            /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */ 'font-size': [
                {
                    text: [
                        'base',
                        isTshirtSize,
                        isArbitraryLength
                    ]
                }
            ],
            /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */ 'font-smoothing': [
                'antialiased',
                'subpixel-antialiased'
            ],
            /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */ 'font-style': [
                'italic',
                'not-italic'
            ],
            /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */ 'font-weight': [
                {
                    font: [
                        'thin',
                        'extralight',
                        'light',
                        'normal',
                        'medium',
                        'semibold',
                        'bold',
                        'extrabold',
                        'black',
                        isArbitraryNumber
                    ]
                }
            ],
            /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */ 'font-family': [
                {
                    font: [
                        isAny
                    ]
                }
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-normal': [
                'normal-nums'
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-ordinal': [
                'ordinal'
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-slashed-zero': [
                'slashed-zero'
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-figure': [
                'lining-nums',
                'oldstyle-nums'
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-spacing': [
                'proportional-nums',
                'tabular-nums'
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-fraction': [
                'diagonal-fractions',
                'stacked-fractions'
            ],
            /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */ tracking: [
                {
                    tracking: [
                        'tighter',
                        'tight',
                        'normal',
                        'wide',
                        'wider',
                        'widest',
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */ 'line-clamp': [
                {
                    'line-clamp': [
                        'none',
                        isNumber,
                        isArbitraryNumber
                    ]
                }
            ],
            /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */ leading: [
                {
                    leading: [
                        'none',
                        'tight',
                        'snug',
                        'normal',
                        'relaxed',
                        'loose',
                        isLength,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */ 'list-image': [
                {
                    'list-image': [
                        'none',
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */ 'list-style-type': [
                {
                    list: [
                        'none',
                        'disc',
                        'decimal',
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */ 'list-style-position': [
                {
                    list: [
                        'inside',
                        'outside'
                    ]
                }
            ],
            /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */ 'placeholder-color': [
                {
                    placeholder: [
                        colors
                    ]
                }
            ],
            /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */ 'placeholder-opacity': [
                {
                    'placeholder-opacity': [
                        opacity
                    ]
                }
            ],
            /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */ 'text-alignment': [
                {
                    text: [
                        'left',
                        'center',
                        'right',
                        'justify',
                        'start',
                        'end'
                    ]
                }
            ],
            /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */ 'text-color': [
                {
                    text: [
                        colors
                    ]
                }
            ],
            /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */ 'text-opacity': [
                {
                    'text-opacity': [
                        opacity
                    ]
                }
            ],
            /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */ 'text-decoration': [
                'underline',
                'overline',
                'line-through',
                'no-underline'
            ],
            /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */ 'text-decoration-style': [
                {
                    decoration: [
                        ...getLineStyles(),
                        'wavy'
                    ]
                }
            ],
            /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */ 'text-decoration-thickness': [
                {
                    decoration: [
                        'auto',
                        'from-font',
                        isLength,
                        isArbitraryLength
                    ]
                }
            ],
            /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */ 'underline-offset': [
                {
                    'underline-offset': [
                        'auto',
                        isLength,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */ 'text-decoration-color': [
                {
                    decoration: [
                        colors
                    ]
                }
            ],
            /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */ 'text-transform': [
                'uppercase',
                'lowercase',
                'capitalize',
                'normal-case'
            ],
            /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */ 'text-overflow': [
                'truncate',
                'text-ellipsis',
                'text-clip'
            ],
            /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */ 'text-wrap': [
                {
                    text: [
                        'wrap',
                        'nowrap',
                        'balance',
                        'pretty'
                    ]
                }
            ],
            /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */ indent: [
                {
                    indent: getSpacingWithArbitrary()
                }
            ],
            /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */ 'vertical-align': [
                {
                    align: [
                        'baseline',
                        'top',
                        'middle',
                        'bottom',
                        'text-top',
                        'text-bottom',
                        'sub',
                        'super',
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */ whitespace: [
                {
                    whitespace: [
                        'normal',
                        'nowrap',
                        'pre',
                        'pre-line',
                        'pre-wrap',
                        'break-spaces'
                    ]
                }
            ],
            /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */ break: [
                {
                    break: [
                        'normal',
                        'words',
                        'all',
                        'keep'
                    ]
                }
            ],
            /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */ hyphens: [
                {
                    hyphens: [
                        'none',
                        'manual',
                        'auto'
                    ]
                }
            ],
            /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */ content: [
                {
                    content: [
                        'none',
                        isArbitraryValue
                    ]
                }
            ],
            // Backgrounds
            /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */ 'bg-attachment': [
                {
                    bg: [
                        'fixed',
                        'local',
                        'scroll'
                    ]
                }
            ],
            /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */ 'bg-clip': [
                {
                    'bg-clip': [
                        'border',
                        'padding',
                        'content',
                        'text'
                    ]
                }
            ],
            /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */ 'bg-opacity': [
                {
                    'bg-opacity': [
                        opacity
                    ]
                }
            ],
            /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */ 'bg-origin': [
                {
                    'bg-origin': [
                        'border',
                        'padding',
                        'content'
                    ]
                }
            ],
            /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */ 'bg-position': [
                {
                    bg: [
                        ...getPositions(),
                        isArbitraryPosition
                    ]
                }
            ],
            /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */ 'bg-repeat': [
                {
                    bg: [
                        'no-repeat',
                        {
                            repeat: [
                                '',
                                'x',
                                'y',
                                'round',
                                'space'
                            ]
                        }
                    ]
                }
            ],
            /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */ 'bg-size': [
                {
                    bg: [
                        'auto',
                        'cover',
                        'contain',
                        isArbitrarySize
                    ]
                }
            ],
            /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */ 'bg-image': [
                {
                    bg: [
                        'none',
                        {
                            'gradient-to': [
                                't',
                                'tr',
                                'r',
                                'br',
                                'b',
                                'bl',
                                'l',
                                'tl'
                            ]
                        },
                        isArbitraryImage
                    ]
                }
            ],
            /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */ 'bg-color': [
                {
                    bg: [
                        colors
                    ]
                }
            ],
            /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-from-pos': [
                {
                    from: [
                        gradientColorStopPositions
                    ]
                }
            ],
            /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-via-pos': [
                {
                    via: [
                        gradientColorStopPositions
                    ]
                }
            ],
            /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-to-pos': [
                {
                    to: [
                        gradientColorStopPositions
                    ]
                }
            ],
            /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-from': [
                {
                    from: [
                        gradientColorStops
                    ]
                }
            ],
            /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-via': [
                {
                    via: [
                        gradientColorStops
                    ]
                }
            ],
            /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-to': [
                {
                    to: [
                        gradientColorStops
                    ]
                }
            ],
            // Borders
            /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */ rounded: [
                {
                    rounded: [
                        borderRadius
                    ]
                }
            ],
            /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-s': [
                {
                    'rounded-s': [
                        borderRadius
                    ]
                }
            ],
            /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-e': [
                {
                    'rounded-e': [
                        borderRadius
                    ]
                }
            ],
            /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-t': [
                {
                    'rounded-t': [
                        borderRadius
                    ]
                }
            ],
            /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-r': [
                {
                    'rounded-r': [
                        borderRadius
                    ]
                }
            ],
            /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-b': [
                {
                    'rounded-b': [
                        borderRadius
                    ]
                }
            ],
            /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-l': [
                {
                    'rounded-l': [
                        borderRadius
                    ]
                }
            ],
            /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-ss': [
                {
                    'rounded-ss': [
                        borderRadius
                    ]
                }
            ],
            /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-se': [
                {
                    'rounded-se': [
                        borderRadius
                    ]
                }
            ],
            /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-ee': [
                {
                    'rounded-ee': [
                        borderRadius
                    ]
                }
            ],
            /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-es': [
                {
                    'rounded-es': [
                        borderRadius
                    ]
                }
            ],
            /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-tl': [
                {
                    'rounded-tl': [
                        borderRadius
                    ]
                }
            ],
            /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-tr': [
                {
                    'rounded-tr': [
                        borderRadius
                    ]
                }
            ],
            /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-br': [
                {
                    'rounded-br': [
                        borderRadius
                    ]
                }
            ],
            /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-bl': [
                {
                    'rounded-bl': [
                        borderRadius
                    ]
                }
            ],
            /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w': [
                {
                    border: [
                        borderWidth
                    ]
                }
            ],
            /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-x': [
                {
                    'border-x': [
                        borderWidth
                    ]
                }
            ],
            /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-y': [
                {
                    'border-y': [
                        borderWidth
                    ]
                }
            ],
            /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-s': [
                {
                    'border-s': [
                        borderWidth
                    ]
                }
            ],
            /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-e': [
                {
                    'border-e': [
                        borderWidth
                    ]
                }
            ],
            /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-t': [
                {
                    'border-t': [
                        borderWidth
                    ]
                }
            ],
            /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-r': [
                {
                    'border-r': [
                        borderWidth
                    ]
                }
            ],
            /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-b': [
                {
                    'border-b': [
                        borderWidth
                    ]
                }
            ],
            /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-l': [
                {
                    'border-l': [
                        borderWidth
                    ]
                }
            ],
            /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */ 'border-opacity': [
                {
                    'border-opacity': [
                        opacity
                    ]
                }
            ],
            /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */ 'border-style': [
                {
                    border: [
                        ...getLineStyles(),
                        'hidden'
                    ]
                }
            ],
            /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */ 'divide-x': [
                {
                    'divide-x': [
                        borderWidth
                    ]
                }
            ],
            /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */ 'divide-x-reverse': [
                'divide-x-reverse'
            ],
            /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */ 'divide-y': [
                {
                    'divide-y': [
                        borderWidth
                    ]
                }
            ],
            /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */ 'divide-y-reverse': [
                'divide-y-reverse'
            ],
            /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */ 'divide-opacity': [
                {
                    'divide-opacity': [
                        opacity
                    ]
                }
            ],
            /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */ 'divide-style': [
                {
                    divide: getLineStyles()
                }
            ],
            /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color': [
                {
                    border: [
                        borderColor
                    ]
                }
            ],
            /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-x': [
                {
                    'border-x': [
                        borderColor
                    ]
                }
            ],
            /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-y': [
                {
                    'border-y': [
                        borderColor
                    ]
                }
            ],
            /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-s': [
                {
                    'border-s': [
                        borderColor
                    ]
                }
            ],
            /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-e': [
                {
                    'border-e': [
                        borderColor
                    ]
                }
            ],
            /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-t': [
                {
                    'border-t': [
                        borderColor
                    ]
                }
            ],
            /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-r': [
                {
                    'border-r': [
                        borderColor
                    ]
                }
            ],
            /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-b': [
                {
                    'border-b': [
                        borderColor
                    ]
                }
            ],
            /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-l': [
                {
                    'border-l': [
                        borderColor
                    ]
                }
            ],
            /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */ 'divide-color': [
                {
                    divide: [
                        borderColor
                    ]
                }
            ],
            /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */ 'outline-style': [
                {
                    outline: [
                        '',
                        ...getLineStyles()
                    ]
                }
            ],
            /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */ 'outline-offset': [
                {
                    'outline-offset': [
                        isLength,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */ 'outline-w': [
                {
                    outline: [
                        isLength,
                        isArbitraryLength
                    ]
                }
            ],
            /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */ 'outline-color': [
                {
                    outline: [
                        colors
                    ]
                }
            ],
            /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */ 'ring-w': [
                {
                    ring: getLengthWithEmptyAndArbitrary()
                }
            ],
            /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */ 'ring-w-inset': [
                'ring-inset'
            ],
            /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */ 'ring-color': [
                {
                    ring: [
                        colors
                    ]
                }
            ],
            /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */ 'ring-opacity': [
                {
                    'ring-opacity': [
                        opacity
                    ]
                }
            ],
            /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */ 'ring-offset-w': [
                {
                    'ring-offset': [
                        isLength,
                        isArbitraryLength
                    ]
                }
            ],
            /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */ 'ring-offset-color': [
                {
                    'ring-offset': [
                        colors
                    ]
                }
            ],
            // Effects
            /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */ shadow: [
                {
                    shadow: [
                        '',
                        'inner',
                        'none',
                        isTshirtSize,
                        isArbitraryShadow
                    ]
                }
            ],
            /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */ 'shadow-color': [
                {
                    shadow: [
                        isAny
                    ]
                }
            ],
            /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */ opacity: [
                {
                    opacity: [
                        opacity
                    ]
                }
            ],
            /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */ 'mix-blend': [
                {
                    'mix-blend': [
                        ...getBlendModes(),
                        'plus-lighter',
                        'plus-darker'
                    ]
                }
            ],
            /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */ 'bg-blend': [
                {
                    'bg-blend': getBlendModes()
                }
            ],
            // Filters
            /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */ filter: [
                {
                    filter: [
                        '',
                        'none'
                    ]
                }
            ],
            /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */ blur: [
                {
                    blur: [
                        blur
                    ]
                }
            ],
            /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */ brightness: [
                {
                    brightness: [
                        brightness
                    ]
                }
            ],
            /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */ contrast: [
                {
                    contrast: [
                        contrast
                    ]
                }
            ],
            /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */ 'drop-shadow': [
                {
                    'drop-shadow': [
                        '',
                        'none',
                        isTshirtSize,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */ grayscale: [
                {
                    grayscale: [
                        grayscale
                    ]
                }
            ],
            /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */ 'hue-rotate': [
                {
                    'hue-rotate': [
                        hueRotate
                    ]
                }
            ],
            /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */ invert: [
                {
                    invert: [
                        invert
                    ]
                }
            ],
            /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */ saturate: [
                {
                    saturate: [
                        saturate
                    ]
                }
            ],
            /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */ sepia: [
                {
                    sepia: [
                        sepia
                    ]
                }
            ],
            /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */ 'backdrop-filter': [
                {
                    'backdrop-filter': [
                        '',
                        'none'
                    ]
                }
            ],
            /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */ 'backdrop-blur': [
                {
                    'backdrop-blur': [
                        blur
                    ]
                }
            ],
            /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */ 'backdrop-brightness': [
                {
                    'backdrop-brightness': [
                        brightness
                    ]
                }
            ],
            /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */ 'backdrop-contrast': [
                {
                    'backdrop-contrast': [
                        contrast
                    ]
                }
            ],
            /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */ 'backdrop-grayscale': [
                {
                    'backdrop-grayscale': [
                        grayscale
                    ]
                }
            ],
            /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */ 'backdrop-hue-rotate': [
                {
                    'backdrop-hue-rotate': [
                        hueRotate
                    ]
                }
            ],
            /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */ 'backdrop-invert': [
                {
                    'backdrop-invert': [
                        invert
                    ]
                }
            ],
            /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */ 'backdrop-opacity': [
                {
                    'backdrop-opacity': [
                        opacity
                    ]
                }
            ],
            /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */ 'backdrop-saturate': [
                {
                    'backdrop-saturate': [
                        saturate
                    ]
                }
            ],
            /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */ 'backdrop-sepia': [
                {
                    'backdrop-sepia': [
                        sepia
                    ]
                }
            ],
            // Tables
            /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */ 'border-collapse': [
                {
                    border: [
                        'collapse',
                        'separate'
                    ]
                }
            ],
            /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */ 'border-spacing': [
                {
                    'border-spacing': [
                        borderSpacing
                    ]
                }
            ],
            /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */ 'border-spacing-x': [
                {
                    'border-spacing-x': [
                        borderSpacing
                    ]
                }
            ],
            /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */ 'border-spacing-y': [
                {
                    'border-spacing-y': [
                        borderSpacing
                    ]
                }
            ],
            /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */ 'table-layout': [
                {
                    table: [
                        'auto',
                        'fixed'
                    ]
                }
            ],
            /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */ caption: [
                {
                    caption: [
                        'top',
                        'bottom'
                    ]
                }
            ],
            // Transitions and Animation
            /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */ transition: [
                {
                    transition: [
                        'none',
                        'all',
                        '',
                        'colors',
                        'opacity',
                        'shadow',
                        'transform',
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */ duration: [
                {
                    duration: getNumberAndArbitrary()
                }
            ],
            /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */ ease: [
                {
                    ease: [
                        'linear',
                        'in',
                        'out',
                        'in-out',
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */ delay: [
                {
                    delay: getNumberAndArbitrary()
                }
            ],
            /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */ animate: [
                {
                    animate: [
                        'none',
                        'spin',
                        'ping',
                        'pulse',
                        'bounce',
                        isArbitraryValue
                    ]
                }
            ],
            // Transforms
            /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */ transform: [
                {
                    transform: [
                        '',
                        'gpu',
                        'none'
                    ]
                }
            ],
            /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */ scale: [
                {
                    scale: [
                        scale
                    ]
                }
            ],
            /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */ 'scale-x': [
                {
                    'scale-x': [
                        scale
                    ]
                }
            ],
            /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */ 'scale-y': [
                {
                    'scale-y': [
                        scale
                    ]
                }
            ],
            /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */ rotate: [
                {
                    rotate: [
                        isInteger,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */ 'translate-x': [
                {
                    'translate-x': [
                        translate
                    ]
                }
            ],
            /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */ 'translate-y': [
                {
                    'translate-y': [
                        translate
                    ]
                }
            ],
            /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */ 'skew-x': [
                {
                    'skew-x': [
                        skew
                    ]
                }
            ],
            /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */ 'skew-y': [
                {
                    'skew-y': [
                        skew
                    ]
                }
            ],
            /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */ 'transform-origin': [
                {
                    origin: [
                        'center',
                        'top',
                        'top-right',
                        'right',
                        'bottom-right',
                        'bottom',
                        'bottom-left',
                        'left',
                        'top-left',
                        isArbitraryValue
                    ]
                }
            ],
            // Interactivity
            /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */ accent: [
                {
                    accent: [
                        'auto',
                        colors
                    ]
                }
            ],
            /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */ appearance: [
                {
                    appearance: [
                        'none',
                        'auto'
                    ]
                }
            ],
            /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */ cursor: [
                {
                    cursor: [
                        'auto',
                        'default',
                        'pointer',
                        'wait',
                        'text',
                        'move',
                        'help',
                        'not-allowed',
                        'none',
                        'context-menu',
                        'progress',
                        'cell',
                        'crosshair',
                        'vertical-text',
                        'alias',
                        'copy',
                        'no-drop',
                        'grab',
                        'grabbing',
                        'all-scroll',
                        'col-resize',
                        'row-resize',
                        'n-resize',
                        'e-resize',
                        's-resize',
                        'w-resize',
                        'ne-resize',
                        'nw-resize',
                        'se-resize',
                        'sw-resize',
                        'ew-resize',
                        'ns-resize',
                        'nesw-resize',
                        'nwse-resize',
                        'zoom-in',
                        'zoom-out',
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */ 'caret-color': [
                {
                    caret: [
                        colors
                    ]
                }
            ],
            /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */ 'pointer-events': [
                {
                    'pointer-events': [
                        'none',
                        'auto'
                    ]
                }
            ],
            /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */ resize: [
                {
                    resize: [
                        'none',
                        'y',
                        'x',
                        ''
                    ]
                }
            ],
            /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */ 'scroll-behavior': [
                {
                    scroll: [
                        'auto',
                        'smooth'
                    ]
                }
            ],
            /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-m': [
                {
                    'scroll-m': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-mx': [
                {
                    'scroll-mx': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-my': [
                {
                    'scroll-my': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-ms': [
                {
                    'scroll-ms': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-me': [
                {
                    'scroll-me': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-mt': [
                {
                    'scroll-mt': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-mr': [
                {
                    'scroll-mr': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-mb': [
                {
                    'scroll-mb': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-ml': [
                {
                    'scroll-ml': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-p': [
                {
                    'scroll-p': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-px': [
                {
                    'scroll-px': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-py': [
                {
                    'scroll-py': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-ps': [
                {
                    'scroll-ps': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-pe': [
                {
                    'scroll-pe': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-pt': [
                {
                    'scroll-pt': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-pr': [
                {
                    'scroll-pr': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-pb': [
                {
                    'scroll-pb': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-pl': [
                {
                    'scroll-pl': getSpacingWithArbitrary()
                }
            ],
            /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */ 'snap-align': [
                {
                    snap: [
                        'start',
                        'end',
                        'center',
                        'align-none'
                    ]
                }
            ],
            /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */ 'snap-stop': [
                {
                    snap: [
                        'normal',
                        'always'
                    ]
                }
            ],
            /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */ 'snap-type': [
                {
                    snap: [
                        'none',
                        'x',
                        'y',
                        'both'
                    ]
                }
            ],
            /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */ 'snap-strictness': [
                {
                    snap: [
                        'mandatory',
                        'proximity'
                    ]
                }
            ],
            /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */ touch: [
                {
                    touch: [
                        'auto',
                        'none',
                        'manipulation'
                    ]
                }
            ],
            /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */ 'touch-x': [
                {
                    'touch-pan': [
                        'x',
                        'left',
                        'right'
                    ]
                }
            ],
            /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */ 'touch-y': [
                {
                    'touch-pan': [
                        'y',
                        'up',
                        'down'
                    ]
                }
            ],
            /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */ 'touch-pz': [
                'touch-pinch-zoom'
            ],
            /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */ select: [
                {
                    select: [
                        'none',
                        'text',
                        'all',
                        'auto'
                    ]
                }
            ],
            /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */ 'will-change': [
                {
                    'will-change': [
                        'auto',
                        'scroll',
                        'contents',
                        'transform',
                        isArbitraryValue
                    ]
                }
            ],
            // SVG
            /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */ fill: [
                {
                    fill: [
                        colors,
                        'none'
                    ]
                }
            ],
            /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */ 'stroke-w': [
                {
                    stroke: [
                        isLength,
                        isArbitraryLength,
                        isArbitraryNumber
                    ]
                }
            ],
            /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */ stroke: [
                {
                    stroke: [
                        colors,
                        'none'
                    ]
                }
            ],
            // Accessibility
            /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */ sr: [
                'sr-only',
                'not-sr-only'
            ],
            /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */ 'forced-color-adjust': [
                {
                    'forced-color-adjust': [
                        'auto',
                        'none'
                    ]
                }
            ]
        },
        conflictingClassGroups: {
            overflow: [
                'overflow-x',
                'overflow-y'
            ],
            overscroll: [
                'overscroll-x',
                'overscroll-y'
            ],
            inset: [
                'inset-x',
                'inset-y',
                'start',
                'end',
                'top',
                'right',
                'bottom',
                'left'
            ],
            'inset-x': [
                'right',
                'left'
            ],
            'inset-y': [
                'top',
                'bottom'
            ],
            flex: [
                'basis',
                'grow',
                'shrink'
            ],
            gap: [
                'gap-x',
                'gap-y'
            ],
            p: [
                'px',
                'py',
                'ps',
                'pe',
                'pt',
                'pr',
                'pb',
                'pl'
            ],
            px: [
                'pr',
                'pl'
            ],
            py: [
                'pt',
                'pb'
            ],
            m: [
                'mx',
                'my',
                'ms',
                'me',
                'mt',
                'mr',
                'mb',
                'ml'
            ],
            mx: [
                'mr',
                'ml'
            ],
            my: [
                'mt',
                'mb'
            ],
            size: [
                'w',
                'h'
            ],
            'font-size': [
                'leading'
            ],
            'fvn-normal': [
                'fvn-ordinal',
                'fvn-slashed-zero',
                'fvn-figure',
                'fvn-spacing',
                'fvn-fraction'
            ],
            'fvn-ordinal': [
                'fvn-normal'
            ],
            'fvn-slashed-zero': [
                'fvn-normal'
            ],
            'fvn-figure': [
                'fvn-normal'
            ],
            'fvn-spacing': [
                'fvn-normal'
            ],
            'fvn-fraction': [
                'fvn-normal'
            ],
            'line-clamp': [
                'display',
                'overflow'
            ],
            rounded: [
                'rounded-s',
                'rounded-e',
                'rounded-t',
                'rounded-r',
                'rounded-b',
                'rounded-l',
                'rounded-ss',
                'rounded-se',
                'rounded-ee',
                'rounded-es',
                'rounded-tl',
                'rounded-tr',
                'rounded-br',
                'rounded-bl'
            ],
            'rounded-s': [
                'rounded-ss',
                'rounded-es'
            ],
            'rounded-e': [
                'rounded-se',
                'rounded-ee'
            ],
            'rounded-t': [
                'rounded-tl',
                'rounded-tr'
            ],
            'rounded-r': [
                'rounded-tr',
                'rounded-br'
            ],
            'rounded-b': [
                'rounded-br',
                'rounded-bl'
            ],
            'rounded-l': [
                'rounded-tl',
                'rounded-bl'
            ],
            'border-spacing': [
                'border-spacing-x',
                'border-spacing-y'
            ],
            'border-w': [
                'border-w-s',
                'border-w-e',
                'border-w-t',
                'border-w-r',
                'border-w-b',
                'border-w-l'
            ],
            'border-w-x': [
                'border-w-r',
                'border-w-l'
            ],
            'border-w-y': [
                'border-w-t',
                'border-w-b'
            ],
            'border-color': [
                'border-color-s',
                'border-color-e',
                'border-color-t',
                'border-color-r',
                'border-color-b',
                'border-color-l'
            ],
            'border-color-x': [
                'border-color-r',
                'border-color-l'
            ],
            'border-color-y': [
                'border-color-t',
                'border-color-b'
            ],
            'scroll-m': [
                'scroll-mx',
                'scroll-my',
                'scroll-ms',
                'scroll-me',
                'scroll-mt',
                'scroll-mr',
                'scroll-mb',
                'scroll-ml'
            ],
            'scroll-mx': [
                'scroll-mr',
                'scroll-ml'
            ],
            'scroll-my': [
                'scroll-mt',
                'scroll-mb'
            ],
            'scroll-p': [
                'scroll-px',
                'scroll-py',
                'scroll-ps',
                'scroll-pe',
                'scroll-pt',
                'scroll-pr',
                'scroll-pb',
                'scroll-pl'
            ],
            'scroll-px': [
                'scroll-pr',
                'scroll-pl'
            ],
            'scroll-py': [
                'scroll-pt',
                'scroll-pb'
            ],
            touch: [
                'touch-x',
                'touch-y',
                'touch-pz'
            ],
            'touch-x': [
                'touch'
            ],
            'touch-y': [
                'touch'
            ],
            'touch-pz': [
                'touch'
            ]
        },
        conflictingClassGroupModifiers: {
            'font-size': [
                'leading'
            ]
        }
    };
};
/**
 * @param baseConfig Config where other config will be merged into. This object will be mutated.
 * @param configExtension Partial config to merge into the `baseConfig`.
 */ const mergeConfigs = (baseConfig, { cacheSize, prefix, separator, experimentalParseClassName, extend = {}, override = {} })=>{
    overrideProperty(baseConfig, 'cacheSize', cacheSize);
    overrideProperty(baseConfig, 'prefix', prefix);
    overrideProperty(baseConfig, 'separator', separator);
    overrideProperty(baseConfig, 'experimentalParseClassName', experimentalParseClassName);
    for(const configKey in override){
        overrideConfigProperties(baseConfig[configKey], override[configKey]);
    }
    for(const key in extend){
        mergeConfigProperties(baseConfig[key], extend[key]);
    }
    return baseConfig;
};
const overrideProperty = (baseObject, overrideKey, overrideValue)=>{
    if (overrideValue !== undefined) {
        baseObject[overrideKey] = overrideValue;
    }
};
const overrideConfigProperties = (baseObject, overrideObject)=>{
    if (overrideObject) {
        for(const key in overrideObject){
            overrideProperty(baseObject, key, overrideObject[key]);
        }
    }
};
const mergeConfigProperties = (baseObject, mergeObject)=>{
    if (mergeObject) {
        for(const key in mergeObject){
            const mergeValue = mergeObject[key];
            if (mergeValue !== undefined) {
                baseObject[key] = (baseObject[key] || []).concat(mergeValue);
            }
        }
    }
};
const extendTailwindMerge = (configExtension, ...createConfig)=>typeof configExtension === 'function' ? createTailwindMerge(getDefaultConfig, configExtension, ...createConfig) : createTailwindMerge(()=>mergeConfigs(getDefaultConfig(), configExtension), ...createConfig);
const twMerge = /*#__PURE__*/ createTailwindMerge(getDefaultConfig);
;
 //# sourceMappingURL=bundle-mjs.mjs.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Copyright 2022 Joe Bell. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR REPRESENTATIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */ __turbopack_context__.s([
    "cva",
    ()=>cva,
    "cx",
    ()=>cx
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
;
const falsyToString = (value)=>typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
const cx = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"];
const cva = (base, config)=>(props)=>{
        var _config_compoundVariants;
        if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
        const { variants, defaultVariants } = config;
        const getVariantClassNames = Object.keys(variants).map((variant)=>{
            const variantProp = props === null || props === void 0 ? void 0 : props[variant];
            const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
            if (variantProp === null) return null;
            const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
            return variants[variant][variantKey];
        });
        const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param)=>{
            let [key, value] = param;
            if (value === undefined) {
                return acc;
            }
            acc[key] = value;
            return acc;
        }, {});
        const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param)=>{
            let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
            return Object.entries(compoundVariantOptions).every((param)=>{
                let [key, value] = param;
                return Array.isArray(value) ? value.includes({
                    ...defaultVariants,
                    ...propsWithoutUndefined
                }[key]) : ({
                    ...defaultVariants,
                    ...propsWithoutUndefined
                })[key] === value;
            }) ? [
                ...acc,
                cvClass,
                cvClassName
            ] : acc;
        }, []);
        return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
    };
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/router-reducer/router-reducer-types.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACTION_HMR_REFRESH",
    ()=>ACTION_HMR_REFRESH,
    "ACTION_NAVIGATE",
    ()=>ACTION_NAVIGATE,
    "ACTION_PREFETCH",
    ()=>ACTION_PREFETCH,
    "ACTION_REFRESH",
    ()=>ACTION_REFRESH,
    "ACTION_RESTORE",
    ()=>ACTION_RESTORE,
    "ACTION_SERVER_ACTION",
    ()=>ACTION_SERVER_ACTION,
    "ACTION_SERVER_PATCH",
    ()=>ACTION_SERVER_PATCH,
    "PrefetchCacheEntryStatus",
    ()=>PrefetchCacheEntryStatus,
    "PrefetchKind",
    ()=>PrefetchKind
]);
const ACTION_REFRESH = 'refresh';
const ACTION_NAVIGATE = 'navigate';
const ACTION_RESTORE = 'restore';
const ACTION_SERVER_PATCH = 'server-patch';
const ACTION_PREFETCH = 'prefetch';
const ACTION_HMR_REFRESH = 'hmr-refresh';
const ACTION_SERVER_ACTION = 'server-action';
var PrefetchKind = /*#__PURE__*/ function(PrefetchKind) {
    PrefetchKind["AUTO"] = "auto";
    PrefetchKind["FULL"] = "full";
    PrefetchKind["TEMPORARY"] = "temporary";
    return PrefetchKind;
}({});
var PrefetchCacheEntryStatus = /*#__PURE__*/ function(PrefetchCacheEntryStatus) {
    PrefetchCacheEntryStatus["fresh"] = "fresh";
    PrefetchCacheEntryStatus["reusable"] = "reusable";
    PrefetchCacheEntryStatus["expired"] = "expired";
    PrefetchCacheEntryStatus["stale"] = "stale";
    return PrefetchCacheEntryStatus;
}({}); //# sourceMappingURL=router-reducer-types.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactDOM; //# sourceMappingURL=react-dom.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-server-dom-turbopack-client.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactServerDOMTurbopackClient; //# sourceMappingURL=react-server-dom-turbopack-client.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/app-router-headers.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACTION_HEADER",
    ()=>ACTION_HEADER,
    "FLIGHT_HEADERS",
    ()=>FLIGHT_HEADERS,
    "NEXT_ACTION_NOT_FOUND_HEADER",
    ()=>NEXT_ACTION_NOT_FOUND_HEADER,
    "NEXT_DID_POSTPONE_HEADER",
    ()=>NEXT_DID_POSTPONE_HEADER,
    "NEXT_HMR_REFRESH_HASH_COOKIE",
    ()=>NEXT_HMR_REFRESH_HASH_COOKIE,
    "NEXT_HMR_REFRESH_HEADER",
    ()=>NEXT_HMR_REFRESH_HEADER,
    "NEXT_HTML_REQUEST_ID_HEADER",
    ()=>NEXT_HTML_REQUEST_ID_HEADER,
    "NEXT_IS_PRERENDER_HEADER",
    ()=>NEXT_IS_PRERENDER_HEADER,
    "NEXT_REQUEST_ID_HEADER",
    ()=>NEXT_REQUEST_ID_HEADER,
    "NEXT_REWRITTEN_PATH_HEADER",
    ()=>NEXT_REWRITTEN_PATH_HEADER,
    "NEXT_REWRITTEN_QUERY_HEADER",
    ()=>NEXT_REWRITTEN_QUERY_HEADER,
    "NEXT_ROUTER_PREFETCH_HEADER",
    ()=>NEXT_ROUTER_PREFETCH_HEADER,
    "NEXT_ROUTER_SEGMENT_PREFETCH_HEADER",
    ()=>NEXT_ROUTER_SEGMENT_PREFETCH_HEADER,
    "NEXT_ROUTER_STALE_TIME_HEADER",
    ()=>NEXT_ROUTER_STALE_TIME_HEADER,
    "NEXT_ROUTER_STATE_TREE_HEADER",
    ()=>NEXT_ROUTER_STATE_TREE_HEADER,
    "NEXT_RSC_UNION_QUERY",
    ()=>NEXT_RSC_UNION_QUERY,
    "NEXT_URL",
    ()=>NEXT_URL,
    "RSC_CONTENT_TYPE_HEADER",
    ()=>RSC_CONTENT_TYPE_HEADER,
    "RSC_HEADER",
    ()=>RSC_HEADER
]);
const RSC_HEADER = 'rsc';
const ACTION_HEADER = 'next-action';
const NEXT_ROUTER_STATE_TREE_HEADER = 'next-router-state-tree';
const NEXT_ROUTER_PREFETCH_HEADER = 'next-router-prefetch';
const NEXT_ROUTER_SEGMENT_PREFETCH_HEADER = 'next-router-segment-prefetch';
const NEXT_HMR_REFRESH_HEADER = 'next-hmr-refresh';
const NEXT_HMR_REFRESH_HASH_COOKIE = '__next_hmr_refresh_hash__';
const NEXT_URL = 'next-url';
const RSC_CONTENT_TYPE_HEADER = 'text/x-component';
const FLIGHT_HEADERS = [
    RSC_HEADER,
    NEXT_ROUTER_STATE_TREE_HEADER,
    NEXT_ROUTER_PREFETCH_HEADER,
    NEXT_HMR_REFRESH_HEADER,
    NEXT_ROUTER_SEGMENT_PREFETCH_HEADER
];
const NEXT_RSC_UNION_QUERY = '_rsc';
const NEXT_ROUTER_STALE_TIME_HEADER = 'x-nextjs-stale-time';
const NEXT_DID_POSTPONE_HEADER = 'x-nextjs-postponed';
const NEXT_REWRITTEN_PATH_HEADER = 'x-nextjs-rewritten-path';
const NEXT_REWRITTEN_QUERY_HEADER = 'x-nextjs-rewritten-query';
const NEXT_IS_PRERENDER_HEADER = 'x-nextjs-prerender';
const NEXT_ACTION_NOT_FOUND_HEADER = 'x-nextjs-action-not-found';
const NEXT_REQUEST_ID_HEADER = 'x-nextjs-request-id';
const NEXT_HTML_REQUEST_ID_HEADER = 'x-nextjs-html-request-id'; //# sourceMappingURL=app-router-headers.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/is-thenable.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Check to see if a value is Thenable.
 *
 * @param promise the maybe-thenable value
 * @returns true if the value is thenable
 */ __turbopack_context__.s([
    "isThenable",
    ()=>isThenable
]);
function isThenable(promise) {
    return promise !== null && typeof promise === 'object' && 'then' in promise && typeof promise.then === 'function';
} //# sourceMappingURL=is-thenable.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/next-devtools/dev-overlay.shim.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    dispatcher: null,
    renderAppDevOverlay: null,
    renderPagesDevOverlay: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    dispatcher: function() {
        return dispatcher;
    },
    renderAppDevOverlay: function() {
        return renderAppDevOverlay;
    },
    renderPagesDevOverlay: function() {
        return renderPagesDevOverlay;
    }
});
function renderAppDevOverlay() {
    throw Object.defineProperty(new Error("Next DevTools: Can't render in this environment. This is a bug in Next.js"), "__NEXT_ERROR_CODE", {
        value: "E697",
        enumerable: false,
        configurable: true
    });
}
function renderPagesDevOverlay() {
    throw Object.defineProperty(new Error("Next DevTools: Can't render in this environment. This is a bug in Next.js"), "__NEXT_ERROR_CODE", {
        value: "E697",
        enumerable: false,
        configurable: true
    });
}
const dispatcher = new Proxy({}, {
    get: (_, prop)=>{
        return ()=>{
            throw Object.defineProperty(new Error(`Next DevTools: Can't dispatch ${String(prop)} in this environment. This is a bug in Next.js`), "__NEXT_ERROR_CODE", {
                value: "E698",
                enumerable: false,
                configurable: true
            });
        };
    }
});
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=dev-overlay.shim.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/next-devtools/userspace/use-app-dev-rendering-indicator.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppDevRenderingIndicator",
    ()=>useAppDevRenderingIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$next$2d$devtools$2f$dev$2d$overlay$2e$shim$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/next-devtools/dev-overlay.shim.js [app-ssr] (ecmascript)");
'use client';
;
;
const useAppDevRenderingIndicator = ()=>{
    const [isPending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransition"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isPending) {
            __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$next$2d$devtools$2f$dev$2d$overlay$2e$shim$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dispatcher"].renderingIndicatorShow();
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$next$2d$devtools$2f$dev$2d$overlay$2e$shim$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dispatcher"].renderingIndicatorHide();
        }
    }, [
        isPending
    ]);
    return startTransition;
}; //# sourceMappingURL=use-app-dev-rendering-indicator.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/use-action-queue.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dispatchAppRouterAction",
    ()=>dispatchAppRouterAction,
    "useActionQueue",
    ()=>useActionQueue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$is$2d$thenable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/is-thenable.js [app-ssr] (ecmascript)");
;
;
// The app router state lives outside of React, so we can import the dispatch
// method directly wherever we need it, rather than passing it around via props
// or context.
let dispatch = null;
function dispatchAppRouterAction(action) {
    if (dispatch === null) {
        throw Object.defineProperty(new Error('Internal Next.js error: Router action dispatched before initialization.'), "__NEXT_ERROR_CODE", {
            value: "E668",
            enumerable: false,
            configurable: true
        });
    }
    dispatch(action);
}
function useActionQueue(actionQueue) {
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(actionQueue.state);
    // Because of a known issue that requires to decode Flight streams inside the
    // render phase, we have to be a bit clever and assign the dispatch method to
    // a module-level variable upon initialization. The useState hook in this
    // module only exists to synchronize state that lives outside of React.
    // Ideally, what we'd do instead is pass the state as a prop to root.render;
    // this is conceptually how we're modeling the app router state, despite the
    // weird implementation details.
    if ("TURBOPACK compile-time truthy", 1) {
        const { useAppDevRenderingIndicator } = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/next-devtools/userspace/use-app-dev-rendering-indicator.js [app-ssr] (ecmascript)");
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const appDevRenderingIndicator = useAppDevRenderingIndicator();
        dispatch = (action)=>{
            appDevRenderingIndicator(()=>{
                actionQueue.dispatch(action, setState);
            });
        };
    } else //TURBOPACK unreachable
    ;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$is$2d$thenable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isThenable"])(state) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"])(state) : state;
} //# sourceMappingURL=use-action-queue.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/app-call-server.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "callServer",
    ()=>callServer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$router$2d$reducer$2d$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/router-reducer/router-reducer-types.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$use$2d$action$2d$queue$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/use-action-queue.js [app-ssr] (ecmascript)");
;
;
;
async function callServer(actionId, actionArgs) {
    return new Promise((resolve, reject)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startTransition"])(()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$use$2d$action$2d$queue$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dispatchAppRouterAction"])({
                type: __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$router$2d$reducer$2d$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ACTION_SERVER_ACTION"],
                actionId,
                actionArgs,
                resolve,
                reject
            });
        });
    });
} //# sourceMappingURL=app-call-server.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/app-find-source-map-url.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "findSourceMapURL",
    ()=>findSourceMapURL
]);
const basePath = ("TURBOPACK compile-time value", "") || '';
const pathname = `${basePath}/__nextjs_source-map`;
const findSourceMapURL = ("TURBOPACK compile-time truthy", 1) ? function findSourceMapURL(filename) {
    if (filename === '') {
        return null;
    }
    if (filename.startsWith(document.location.origin) && filename.includes('/_next/static')) {
        // This is a request for a client chunk. This can only happen when
        // using Turbopack. In this case, since we control how those source
        // maps are generated, we can safely assume that the sourceMappingURL
        // is relative to the filename, with an added `.map` extension. The
        // browser can just request this file, and it gets served through the
        // normal dev server, without the need to route this through
        // the `/__nextjs_source-map` dev middleware.
        return `${filename}.map`;
    }
    const url = new URL(pathname, document.location.origin);
    url.searchParams.set('filename', filename);
    return url.href;
} : "TURBOPACK unreachable"; //# sourceMappingURL=app-find-source-map-url.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/segment.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_SEGMENT_KEY",
    ()=>DEFAULT_SEGMENT_KEY,
    "PAGE_SEGMENT_KEY",
    ()=>PAGE_SEGMENT_KEY,
    "addSearchParamsIfPageSegment",
    ()=>addSearchParamsIfPageSegment,
    "isGroupSegment",
    ()=>isGroupSegment,
    "isParallelRouteSegment",
    ()=>isParallelRouteSegment
]);
function isGroupSegment(segment) {
    // Use array[0] for performant purpose
    return segment[0] === '(' && segment.endsWith(')');
}
function isParallelRouteSegment(segment) {
    return segment.startsWith('@') && segment !== '@children';
}
function addSearchParamsIfPageSegment(segment, searchParams) {
    const isPageSegment = segment.includes(PAGE_SEGMENT_KEY);
    if (isPageSegment) {
        const stringifiedQuery = JSON.stringify(searchParams);
        return stringifiedQuery !== '{}' ? PAGE_SEGMENT_KEY + '?' + stringifiedQuery : PAGE_SEGMENT_KEY;
    }
    return segment;
}
const PAGE_SEGMENT_KEY = '__PAGE__';
const DEFAULT_SEGMENT_KEY = '__DEFAULT__'; //# sourceMappingURL=segment.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/flight-data-helpers.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFlightDataPartsFromPath",
    ()=>getFlightDataPartsFromPath,
    "getNextFlightSegmentPath",
    ()=>getNextFlightSegmentPath,
    "normalizeFlightData",
    ()=>normalizeFlightData,
    "prepareFlightRouterStateForRequest",
    ()=>prepareFlightRouterStateForRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/segment.js [app-ssr] (ecmascript)");
;
function getFlightDataPartsFromPath(flightDataPath) {
    // Pick the last 4 items from the `FlightDataPath` to get the [tree, seedData, viewport, isHeadPartial].
    const flightDataPathLength = 4;
    // tree, seedData, and head are *always* the last three items in the `FlightDataPath`.
    const [tree, seedData, head, isHeadPartial] = flightDataPath.slice(-flightDataPathLength);
    // The `FlightSegmentPath` is everything except the last three items. For a root render, it won't be present.
    const segmentPath = flightDataPath.slice(0, -flightDataPathLength);
    return {
        // TODO: Unify these two segment path helpers. We are inconsistently pushing an empty segment ("")
        // to the start of the segment path in some places which makes it hard to use solely the segment path.
        // Look for "// TODO-APP: remove ''" in the codebase.
        pathToSegment: segmentPath.slice(0, -1),
        segmentPath,
        // if the `FlightDataPath` corresponds with the root, there'll be no segment path,
        // in which case we default to ''.
        segment: segmentPath[segmentPath.length - 1] ?? '',
        tree,
        seedData,
        head,
        isHeadPartial,
        isRootRender: flightDataPath.length === flightDataPathLength
    };
}
function getNextFlightSegmentPath(flightSegmentPath) {
    // Since `FlightSegmentPath` is a repeated tuple of `Segment` and `ParallelRouteKey`, we slice off two items
    // to get the next segment path.
    return flightSegmentPath.slice(2);
}
function normalizeFlightData(flightData) {
    // FlightData can be a string when the server didn't respond with a proper flight response,
    // or when a redirect happens, to signal to the client that it needs to perform an MPA navigation.
    if (typeof flightData === 'string') {
        return flightData;
    }
    return flightData.map((flightDataPath)=>getFlightDataPartsFromPath(flightDataPath));
}
function prepareFlightRouterStateForRequest(flightRouterState, isHmrRefresh) {
    // HMR requests need the complete, unmodified state for proper functionality
    if (isHmrRefresh) {
        return encodeURIComponent(JSON.stringify(flightRouterState));
    }
    return encodeURIComponent(JSON.stringify(stripClientOnlyDataFromFlightRouterState(flightRouterState)));
}
/**
 * Recursively strips client-only data from FlightRouterState while preserving
 * server-needed information for proper rendering decisions.
 */ function stripClientOnlyDataFromFlightRouterState(flightRouterState) {
    const [segment, parallelRoutes, _url, refreshMarker, isRootLayout, hasLoadingBoundary] = flightRouterState;
    // __PAGE__ segments are always fetched from the server, so there's
    // no need to send them up
    const cleanedSegment = stripSearchParamsFromPageSegment(segment);
    // Recursively process parallel routes
    const cleanedParallelRoutes = {};
    for (const [key, childState] of Object.entries(parallelRoutes)){
        cleanedParallelRoutes[key] = stripClientOnlyDataFromFlightRouterState(childState);
    }
    const result = [
        cleanedSegment,
        cleanedParallelRoutes,
        null,
        shouldPreserveRefreshMarker(refreshMarker) ? refreshMarker : null
    ];
    // Append optional fields if present
    if (isRootLayout !== undefined) {
        result[4] = isRootLayout;
    }
    if (hasLoadingBoundary !== undefined) {
        result[5] = hasLoadingBoundary;
    }
    return result;
}
/**
 * Strips search parameters from __PAGE__ segments to prevent sensitive
 * client-side data from being sent to the server.
 */ function stripSearchParamsFromPageSegment(segment) {
    if (typeof segment === 'string' && segment.startsWith(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PAGE_SEGMENT_KEY"] + '?')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PAGE_SEGMENT_KEY"];
    }
    return segment;
}
/**
 * Determines whether the refresh marker should be sent to the server
 * Client-only markers like 'refresh' are stripped, while server-needed markers
 * like 'refetch' and 'inside-shared-layout' are preserved.
 */ function shouldPreserveRefreshMarker(refreshMarker) {
    return Boolean(refreshMarker && refreshMarker !== 'refresh');
} //# sourceMappingURL=flight-data-helpers.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/app-build-id.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// This gets assigned as a side-effect during app initialization. Because it
// represents the build used to create the JS bundle, it should never change
// after being set, so we store it in a global variable.
//
// When performing RSC requests, if the incoming data has a different build ID,
// we perform an MPA navigation/refresh to load the updated build and ensure
// that the client and server in sync.
// Starts as an empty string. In practice, because setAppBuildId is called
// during initialization before hydration starts, this will always get
// reassigned to the actual build ID before it's ever needed by a navigation.
// If for some reasons it didn't, due to a bug or race condition, then on
// navigation the build comparision would fail and trigger an MPA navigation.
__turbopack_context__.s([
    "getAppBuildId",
    ()=>getAppBuildId,
    "setAppBuildId",
    ()=>setAppBuildId
]);
let globalBuildId = '';
function setAppBuildId(buildId) {
    globalBuildId = buildId;
}
function getAppBuildId() {
    return globalBuildId;
} //# sourceMappingURL=app-build-id.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/hash.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// http://www.cse.yorku.ca/~oz/hash.html
// More specifically, 32-bit hash via djbxor
// (ref: https://gist.github.com/eplawless/52813b1d8ad9af510d85?permalink_comment_id=3367765#gistcomment-3367765)
// This is due to number type differences between rust for turbopack to js number types,
// where rust does not have easy way to repreesnt js's 53-bit float number type for the matching
// overflow behavior. This is more `correct` in terms of having canonical hash across different runtime / implementation
// as can gaurantee determinstic output from 32bit hash.
__turbopack_context__.s([
    "djb2Hash",
    ()=>djb2Hash,
    "hexHash",
    ()=>hexHash
]);
function djb2Hash(str) {
    let hash = 5381;
    for(let i = 0; i < str.length; i++){
        const char = str.charCodeAt(i);
        hash = (hash << 5) + hash + char & 0xffffffff;
    }
    return hash >>> 0;
}
function hexHash(str) {
    return djb2Hash(str).toString(36).slice(0, 5);
} //# sourceMappingURL=hash.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/router/utils/cache-busting-search-param.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeCacheBustingSearchParam",
    ()=>computeCacheBustingSearchParam
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$hash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/hash.js [app-ssr] (ecmascript)");
;
function computeCacheBustingSearchParam(prefetchHeader, segmentPrefetchHeader, stateTreeHeader, nextUrlHeader) {
    if ((prefetchHeader === undefined || prefetchHeader === '0') && segmentPrefetchHeader === undefined && stateTreeHeader === undefined && nextUrlHeader === undefined) {
        return '';
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$hash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hexHash"])([
        prefetchHeader || '0',
        segmentPrefetchHeader || '0',
        stateTreeHeader || '0',
        nextUrlHeader || '0'
    ].join(','));
} //# sourceMappingURL=cache-busting-search-param.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/router-reducer/set-cache-busting-search-param.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "setCacheBustingSearchParam",
    ()=>setCacheBustingSearchParam,
    "setCacheBustingSearchParamWithHash",
    ()=>setCacheBustingSearchParamWithHash
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$router$2f$utils$2f$cache$2d$busting$2d$search$2d$param$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/router/utils/cache-busting-search-param.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/app-router-headers.js [app-ssr] (ecmascript)");
'use client';
;
;
const setCacheBustingSearchParam = (url, headers)=>{
    const uniqueCacheKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$router$2f$utils$2f$cache$2d$busting$2d$search$2d$param$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["computeCacheBustingSearchParam"])(headers[__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_ROUTER_PREFETCH_HEADER"]], headers[__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_ROUTER_SEGMENT_PREFETCH_HEADER"]], headers[__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_ROUTER_STATE_TREE_HEADER"]], headers[__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_URL"]]);
    setCacheBustingSearchParamWithHash(url, uniqueCacheKey);
};
const setCacheBustingSearchParamWithHash = (url, hash)=>{
    /**
   * Note that we intentionally do not use `url.searchParams.set` here:
   *
   * const url = new URL('https://example.com/search?q=custom%20spacing');
   * url.searchParams.set('_rsc', 'abc123');
   * console.log(url.toString()); // Outputs: https://example.com/search?q=custom+spacing&_rsc=abc123
   *                                                                             ^ <--- this is causing confusion
   * This is in fact intended based on https://url.spec.whatwg.org/#interface-urlsearchparams, but
   * we want to preserve the %20 as %20 if that's what the user passed in, hence the custom
   * logic below.
   */ const existingSearch = url.search;
    const rawQuery = existingSearch.startsWith('?') ? existingSearch.slice(1) : existingSearch;
    // Always remove any existing cache busting param and add a fresh one to ensure
    // we have the correct value based on current request headers
    const pairs = rawQuery.split('&').filter((pair)=>pair && !pair.startsWith(`${__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_RSC_UNION_QUERY"]}=`));
    if (hash.length > 0) {
        pairs.push(`${__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_RSC_UNION_QUERY"]}=${hash}`);
    } else {
        pairs.push(`${__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_RSC_UNION_QUERY"]}`);
    }
    url.search = pairs.length ? `?${pairs.join('&')}` : '';
}; //# sourceMappingURL=set-cache-busting-search-param.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/segment-cache/segment-value-encoding.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ROOT_SEGMENT_CACHE_KEY",
    ()=>ROOT_SEGMENT_CACHE_KEY,
    "ROOT_SEGMENT_REQUEST_KEY",
    ()=>ROOT_SEGMENT_REQUEST_KEY,
    "appendSegmentCacheKeyPart",
    ()=>appendSegmentCacheKeyPart,
    "appendSegmentRequestKeyPart",
    ()=>appendSegmentRequestKeyPart,
    "convertSegmentPathToStaticExportFilename",
    ()=>convertSegmentPathToStaticExportFilename,
    "createSegmentCacheKeyPart",
    ()=>createSegmentCacheKeyPart,
    "createSegmentRequestKeyPart",
    ()=>createSegmentRequestKeyPart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/segment.js [app-ssr] (ecmascript)");
;
const ROOT_SEGMENT_REQUEST_KEY = '';
const ROOT_SEGMENT_CACHE_KEY = '';
function createSegmentRequestKeyPart(segment) {
    if (typeof segment === 'string') {
        if (segment.startsWith(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PAGE_SEGMENT_KEY"])) {
            // The Flight Router State type sometimes includes the search params in
            // the page segment. However, the Segment Cache tracks this as a separate
            // key. So, we strip the search params here, and then add them back when
            // the cache entry is turned back into a FlightRouterState. This is an
            // unfortunate consequence of the FlightRouteState being used both as a
            // transport type and as a cache key; we'll address this once more of the
            // Segment Cache implementation has settled.
            // TODO: We should hoist the search params out of the FlightRouterState
            // type entirely, This is our plan for dynamic route params, too.
            return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PAGE_SEGMENT_KEY"];
        }
        const safeName = // But params typically don't include the leading slash. We should use
        // a different encoding to avoid this special case.
        segment === '/_not-found' ? '_not-found' : encodeToFilesystemAndURLSafeString(segment);
        // Since this is not a dynamic segment, it's fully encoded. It does not
        // need to be "hydrated" with a param value.
        return safeName;
    }
    const name = segment[0];
    const paramType = segment[2];
    const safeName = encodeToFilesystemAndURLSafeString(name);
    const encodedName = '$' + paramType + '$' + safeName;
    return encodedName;
}
function appendSegmentRequestKeyPart(parentRequestKey, parallelRouteKey, childRequestKeyPart) {
    // Aside from being filesystem safe, segment keys are also designed so that
    // each segment and parallel route creates its own subdirectory. Roughly in
    // the same shape as the source app directory. This is mostly just for easier
    // debugging (you can open up the build folder and navigate the output); if
    // we wanted to do we could just use a flat structure.
    // Omit the parallel route key for children, since this is the most
    // common case. Saves some bytes (and it's what the app directory does).
    const slotKey = parallelRouteKey === 'children' ? childRequestKeyPart : `@${encodeToFilesystemAndURLSafeString(parallelRouteKey)}/${childRequestKeyPart}`;
    return parentRequestKey + '/' + slotKey;
}
function createSegmentCacheKeyPart(requestKeyPart, segment) {
    if (typeof segment === 'string') {
        return requestKeyPart;
    }
    const paramValue = segment[1];
    const safeValue = encodeToFilesystemAndURLSafeString(paramValue);
    return requestKeyPart + '$' + safeValue;
}
function appendSegmentCacheKeyPart(parentSegmentKey, parallelRouteKey, childCacheKeyPart) {
    const slotKey = parallelRouteKey === 'children' ? childCacheKeyPart : `@${encodeToFilesystemAndURLSafeString(parallelRouteKey)}/${childCacheKeyPart}`;
    return parentSegmentKey + '/' + slotKey;
}
// Define a regex pattern to match the most common characters found in a route
// param. It excludes anything that might not be cross-platform filesystem
// compatible, like |. It does not need to be precise because the fallback is to
// just base64url-encode the whole parameter, which is fine; we just don't do it
// by default for compactness, and for easier debugging.
const simpleParamValueRegex = /^[a-zA-Z0-9\-_@]+$/;
function encodeToFilesystemAndURLSafeString(value) {
    if (simpleParamValueRegex.test(value)) {
        return value;
    }
    // If there are any unsafe characters, base64url-encode the entire value.
    // We also add a ! prefix so it doesn't collide with the simple case.
    const base64url = btoa(value).replace(/\+/g, '-') // Replace '+' with '-'
    .replace(/\//g, '_') // Replace '/' with '_'
    .replace(/=+$/, '') // Remove trailing '='
    ;
    return '!' + base64url;
}
function convertSegmentPathToStaticExportFilename(segmentPath) {
    return `__next${segmentPath.replace(/\//g, '.')}.txt`;
} //# sourceMappingURL=segment-value-encoding.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/route-params.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "doesStaticSegmentAppearInURL",
    ()=>doesStaticSegmentAppearInURL,
    "getCacheKeyForDynamicParam",
    ()=>getCacheKeyForDynamicParam,
    "getParamValueFromCacheKey",
    ()=>getParamValueFromCacheKey,
    "getRenderedPathname",
    ()=>getRenderedPathname,
    "getRenderedSearch",
    ()=>getRenderedSearch,
    "parseDynamicParamFromURLPart",
    ()=>parseDynamicParamFromURLPart,
    "urlToUrlWithoutFlightMarker",
    ()=>urlToUrlWithoutFlightMarker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/segment.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2d$cache$2f$segment$2d$value$2d$encoding$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/segment-cache/segment-value-encoding.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/app-router-headers.js [app-ssr] (ecmascript)");
;
;
;
function getRenderedSearch(response) {
    // If the server performed a rewrite, the search params used to render the
    // page will be different from the params in the request URL. In this case,
    // the response will include a header that gives the rewritten search query.
    const rewrittenQuery = response.headers.get(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_REWRITTEN_QUERY_HEADER"]);
    if (rewrittenQuery !== null) {
        return rewrittenQuery === '' ? '' : '?' + rewrittenQuery;
    }
    // If the header is not present, there was no rewrite, so we use the search
    // query of the response URL.
    return urlToUrlWithoutFlightMarker(new URL(response.url)).search;
}
function getRenderedPathname(response) {
    // If the server performed a rewrite, the pathname used to render the
    // page will be different from the pathname in the request URL. In this case,
    // the response will include a header that gives the rewritten pathname.
    const rewrittenPath = response.headers.get(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_REWRITTEN_PATH_HEADER"]);
    return rewrittenPath ?? urlToUrlWithoutFlightMarker(new URL(response.url)).pathname;
}
function parseDynamicParamFromURLPart(paramType, pathnameParts, partIndex) {
    // This needs to match the behavior in get-dynamic-param.ts.
    switch(paramType){
        // Catchalls
        case 'c':
        case 'ci':
            {
                // Catchalls receive all the remaining URL parts. If there are no
                // remaining pathname parts, return an empty array.
                return partIndex < pathnameParts.length ? pathnameParts.slice(partIndex).map((s)=>encodeURIComponent(s)) : [];
            }
        // Optional catchalls
        case 'oc':
            {
                // Optional catchalls receive all the remaining URL parts, unless this is
                // the end of the pathname, in which case they return null.
                return partIndex < pathnameParts.length ? pathnameParts.slice(partIndex).map((s)=>encodeURIComponent(s)) : null;
            }
        // Dynamic
        case 'd':
        case 'di':
            {
                if (partIndex >= pathnameParts.length) {
                    // The route tree expected there to be more parts in the URL than there
                    // actually are. This could happen if the x-nextjs-rewritten-path header
                    // is incorrectly set, or potentially due to bug in Next.js. TODO:
                    // Should this be a hard error? During a prefetch, we can just abort.
                    // During a client navigation, we could trigger a hard refresh. But if
                    // it happens during initial render, we don't really have any
                    // recovery options.
                    return '';
                }
                return encodeURIComponent(pathnameParts[partIndex]);
            }
        default:
            paramType;
            return '';
    }
}
function doesStaticSegmentAppearInURL(segment) {
    // This is not a parameterized segment; however, we need to determine
    // whether or not this segment appears in the URL. For example, this route
    // groups do not appear in the URL, so they should be skipped. Any other
    // special cases must be handled here.
    // TODO: Consider encoding this directly into the router tree instead of
    // inferring it on the client based on the segment type. Something like
    // a `doesAppearInURL` flag in FlightRouterState.
    if (segment === __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2d$cache$2f$segment$2d$value$2d$encoding$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROOT_SEGMENT_REQUEST_KEY"] || // For some reason, the loader tree sometimes includes extra __PAGE__
    // "layouts" when part of a parallel route. But it's not a leaf node.
    // Otherwise, we wouldn't need this special case because pages are
    // always leaf nodes.
    // TODO: Investigate why the loader produces these fake page segments.
    segment.startsWith(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PAGE_SEGMENT_KEY"]) || // Route groups.
    segment[0] === '(' && segment.endsWith(')') || segment === __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_SEGMENT_KEY"] || segment === '/_not-found') {
        return false;
    } else {
        // All other segment types appear in the URL
        return true;
    }
}
function getCacheKeyForDynamicParam(paramValue, renderedSearch) {
    // This needs to match the logic in get-dynamic-param.ts, until we're able to
    // unify the various implementations so that these are always computed on
    // the client.
    if (typeof paramValue === 'string') {
        // TODO: Refactor or remove this helper function to accept a string rather
        // than the whole segment type. Also we can probably just append the
        // search string instead of turning it into JSON.
        const pageSegmentWithSearchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addSearchParamsIfPageSegment"])(paramValue, Object.fromEntries(new URLSearchParams(renderedSearch)));
        return pageSegmentWithSearchParams;
    } else if (paramValue === null) {
        return '';
    } else {
        return paramValue.join('/');
    }
}
function urlToUrlWithoutFlightMarker(url) {
    const urlWithoutFlightParameters = new URL(url);
    urlWithoutFlightParameters.searchParams.delete(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_RSC_UNION_QUERY"]);
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return urlWithoutFlightParameters;
}
function getParamValueFromCacheKey(paramCacheKey, paramType) {
    // Turn the cache key string sent by the server (as part of FlightRouterState)
    // into a value that can be passed to `useParams` and client components.
    const isCatchAll = paramType === 'c' || paramType === 'oc';
    if (isCatchAll) {
        // Catch-all param keys are a concatenation of the path segments.
        // See equivalent logic in `getSelectedParams`.
        // TODO: We should just pass the array directly, rather than concatenate
        // it to a string and then split it back to an array. It needs to be an
        // array in some places, like when passing a key React, but we can convert
        // it at runtime in those places.
        return paramCacheKey.split('/');
    }
    return paramCacheKey;
} //# sourceMappingURL=route-params.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/router-reducer/fetch-server-response.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createFetch",
    ()=>createFetch,
    "createFromNextReadableStream",
    ()=>createFromNextReadableStream,
    "fetchServerResponse",
    ()=>fetchServerResponse
]);
// TODO: Explicitly import from client.browser
// eslint-disable-next-line import/no-extraneous-dependencies
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$server$2d$dom$2d$turbopack$2d$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-server-dom-turbopack-client.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/app-router-headers.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$app$2d$call$2d$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/app-call-server.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$app$2d$find$2d$source$2d$map$2d$url$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/app-find-source-map-url.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$router$2d$reducer$2d$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/router-reducer/router-reducer-types.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$flight$2d$data$2d$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/flight-data-helpers.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$app$2d$build$2d$id$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/app-build-id.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$set$2d$cache$2d$busting$2d$search$2d$param$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/router-reducer/set-cache-busting-search-param.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$route$2d$params$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/route-params.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
const createFromReadableStream = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$server$2d$dom$2d$turbopack$2d$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createFromReadableStream"];
let createDebugChannel;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
function doMpaNavigation(url) {
    return {
        flightData: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$route$2d$params$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["urlToUrlWithoutFlightMarker"])(new URL(url, location.origin)).toString(),
        canonicalUrl: undefined,
        couldBeIntercepted: false,
        prerendered: false,
        postponed: false,
        staleTime: -1
    };
}
let abortController = new AbortController();
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
async function fetchServerResponse(url, options) {
    const { flightRouterState, nextUrl, prefetchKind } = options;
    const headers = {
        // Enable flight response
        [__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RSC_HEADER"]]: '1',
        // Provide the current router state
        [__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_ROUTER_STATE_TREE_HEADER"]]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$flight$2d$data$2d$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["prepareFlightRouterStateForRequest"])(flightRouterState, options.isHmrRefresh)
    };
    /**
   * Three cases:
   * - `prefetchKind` is `undefined`, it means it's a normal navigation, so we want to prefetch the page data fully
   * - `prefetchKind` is `full` - we want to prefetch the whole page so same as above
   * - `prefetchKind` is `auto` - if the page is dynamic, prefetch the page data partially, if static prefetch the page data fully
   */ if (prefetchKind === __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$router$2d$reducer$2d$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PrefetchKind"].AUTO) {
        headers[__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_ROUTER_PREFETCH_HEADER"]] = '1';
    }
    if (("TURBOPACK compile-time value", "development") === 'development' && options.isHmrRefresh) {
        headers[__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_HMR_REFRESH_HEADER"]] = '1';
    }
    if (nextUrl) {
        headers[__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_URL"]] = nextUrl;
    }
    try {
        // When creating a "temporary" prefetch (the "on-demand" prefetch that gets created on navigation, if one doesn't exist)
        // we send the request with a "high" priority as it's in response to a user interaction that could be blocking a transition.
        // Otherwise, all other prefetches are sent with a "low" priority.
        // We use "auto" for in all other cases to match the existing default, as this function is shared outside of prefetching.
        const fetchPriority = prefetchKind ? prefetchKind === __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$router$2d$reducer$2d$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PrefetchKind"].TEMPORARY ? 'high' : 'low' : 'auto';
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const res = await createFetch(url, headers, fetchPriority, abortController.signal);
        const responseUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$route$2d$params$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["urlToUrlWithoutFlightMarker"])(new URL(res.url));
        const canonicalUrl = res.redirected ? responseUrl : undefined;
        const contentType = res.headers.get('content-type') || '';
        const interception = !!res.headers.get('vary')?.includes(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_URL"]);
        const postponed = !!res.headers.get(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_DID_POSTPONE_HEADER"]);
        const staleTimeHeaderSeconds = res.headers.get(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_ROUTER_STALE_TIME_HEADER"]);
        const staleTime = staleTimeHeaderSeconds !== null ? parseInt(staleTimeHeaderSeconds, 10) * 1000 : -1;
        let isFlightResponse = contentType.startsWith(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RSC_CONTENT_TYPE_HEADER"]);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // If fetch returns something different than flight response handle it like a mpa navigation
        // If the fetch was not 200, we also handle it like a mpa navigation
        if (!isFlightResponse || !res.ok || !res.body) {
            // in case the original URL came with a hash, preserve it before redirecting to the new URL
            if (url.hash) {
                responseUrl.hash = url.hash;
            }
            return doMpaNavigation(responseUrl.toString());
        }
        // We may navigate to a page that requires a different Webpack runtime.
        // In prod, every page will have the same Webpack runtime.
        // In dev, the Webpack runtime is minimal for each page.
        // We need to ensure the Webpack runtime is updated before executing client-side JS of the new page.
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Handle the `fetch` readable stream that can be unwrapped by `React.use`.
        const flightStream = postponed ? createUnclosingPrefetchStream(res.body) : res.body;
        const response = await createFromNextReadableStream(flightStream, res.headers);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$app$2d$build$2d$id$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAppBuildId"])() !== response.b) {
            return doMpaNavigation(res.url);
        }
        return {
            flightData: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$flight$2d$data$2d$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeFlightData"])(response.f),
            canonicalUrl: canonicalUrl,
            couldBeIntercepted: interception,
            prerendered: response.S,
            postponed,
            staleTime
        };
    } catch (err) {
        if (!abortController.signal.aborted) {
            console.error(`Failed to fetch RSC payload for ${url}. Falling back to browser navigation.`, err);
        }
        // If fetch fails handle it like a mpa navigation
        // TODO-APP: Add a test for the case where a CORS request fails, e.g. external url redirect coming from the response.
        // See https://github.com/vercel/next.js/issues/43605#issuecomment-1451617521 for a reproduction.
        return {
            flightData: url.toString(),
            canonicalUrl: undefined,
            couldBeIntercepted: false,
            prerendered: false,
            postponed: false,
            staleTime: -1
        };
    }
}
async function createFetch(url, headers, fetchPriority, signal) {
    // TODO: In output: "export" mode, the headers do nothing. Omit them (and the
    // cache busting search param) from the request so they're
    // maximally cacheable.
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (("TURBOPACK compile-time value", "development") !== 'production' && self.__next_r) {
        headers[__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_HTML_REQUEST_ID_HEADER"]] = self.__next_r;
    }
    const fetchOptions = {
        // Backwards compat for older browsers. `same-origin` is the default in modern browsers.
        credentials: 'same-origin',
        headers,
        priority: fetchPriority || undefined,
        signal
    };
    // `fetchUrl` is slightly different from `url` because we add a cache-busting
    // search param to it. This should not leak outside of this function, so we
    // track them separately.
    let fetchUrl = new URL(url);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$set$2d$cache$2d$busting$2d$search$2d$param$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setCacheBustingSearchParam"])(fetchUrl, headers);
    let browserResponse = await fetch(fetchUrl, fetchOptions);
    // If the server responds with a redirect (e.g. 307), and the redirected
    // location does not contain the cache busting search param set in the
    // original request, the response is likely invalid — when following the
    // redirect, the browser forwards the request headers, but since the cache
    // busting search param is missing, the server will reject the request due to
    // a mismatch.
    //
    // Ideally, we would be able to intercept the redirect response and perform it
    // manually, instead of letting the browser automatically follow it, but this
    // is not allowed by the fetch API.
    //
    // So instead, we must "replay" the redirect by fetching the new location
    // again, but this time we'll append the cache busting search param to prevent
    // a mismatch.
    //
    // TODO: We can optimize Next.js's built-in middleware APIs by returning a
    // custom status code, to prevent the browser from automatically following it.
    //
    // This does not affect Server Action-based redirects; those are encoded
    // differently, as part of the Flight body. It only affects redirects that
    // occur in a middleware or a third-party proxy.
    let redirected = browserResponse.redirected;
    if ("TURBOPACK compile-time truthy", 1) {
        // This is to prevent a redirect loop. Same limit used by Chrome.
        const MAX_REDIRECTS = 20;
        for(let n = 0; n < MAX_REDIRECTS; n++){
            if (!browserResponse.redirected) {
                break;
            }
            const responseUrl = new URL(browserResponse.url, fetchUrl);
            if (responseUrl.origin !== fetchUrl.origin) {
                break;
            }
            if (responseUrl.searchParams.get(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_RSC_UNION_QUERY"]) === fetchUrl.searchParams.get(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_RSC_UNION_QUERY"])) {
                break;
            }
            // The RSC request was redirected. Assume the response is invalid.
            //
            // Append the cache busting search param to the redirected URL and
            // fetch again.
            fetchUrl = new URL(responseUrl);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$set$2d$cache$2d$busting$2d$search$2d$param$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setCacheBustingSearchParam"])(fetchUrl, headers);
            browserResponse = await fetch(fetchUrl, fetchOptions);
            // We just performed a manual redirect, so this is now true.
            redirected = true;
        }
    }
    // Remove the cache busting search param from the response URL, to prevent it
    // from leaking outside of this function.
    const responseUrl = new URL(browserResponse.url, fetchUrl);
    responseUrl.searchParams.delete(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$app$2d$router$2d$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEXT_RSC_UNION_QUERY"]);
    const rscResponse = {
        url: responseUrl.href,
        // This is true if any redirects occurred, either automatically by the
        // browser, or manually by us. So it's different from
        // `browserResponse.redirected`, which only tells us whether the browser
        // followed a redirect, and only for the last response in the chain.
        redirected,
        // These can be copied from the last browser response we received. We
        // intentionally only expose the subset of fields that are actually used
        // elsewhere in the codebase.
        ok: browserResponse.ok,
        headers: browserResponse.headers,
        body: browserResponse.body,
        status: browserResponse.status
    };
    return rscResponse;
}
function createFromNextReadableStream(flightStream, responseHeaders) {
    return createFromReadableStream(flightStream, {
        callServer: __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$app$2d$call$2d$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"],
        findSourceMapURL: __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$app$2d$find$2d$source$2d$map$2d$url$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"],
        debugChannel: createDebugChannel && createDebugChannel(responseHeaders)
    });
}
function createUnclosingPrefetchStream(originalFlightStream) {
    // When PPR is enabled, prefetch streams may contain references that never
    // resolve, because that's how we encode dynamic data access. In the decoded
    // object returned by the Flight client, these are reified into hanging
    // promises that suspend during render, which is effectively what we want.
    // The UI resolves when it switches to the dynamic data stream
    // (via useDeferredValue(dynamic, static)).
    //
    // However, the Flight implementation currently errors if the server closes
    // the response before all the references are resolved. As a cheat to work
    // around this, we wrap the original stream in a new stream that never closes,
    // and therefore doesn't error.
    const reader = originalFlightStream.getReader();
    return new ReadableStream({
        async pull (controller) {
            while(true){
                const { done, value } = await reader.read();
                if (!done) {
                    // Pass to the target stream and keep consuming the Flight response
                    // from the server.
                    controller.enqueue(value);
                    continue;
                }
                // The server stream has closed. Exit, but intentionally do not close
                // the target stream.
                return;
            }
        }
    });
} //# sourceMappingURL=fetch-server-response.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/unresolved-thenable.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Create a "Thenable" that does not resolve. This is used to suspend indefinitely when data is not available yet.
 */ __turbopack_context__.s([
    "unresolvedThenable",
    ()=>unresolvedThenable
]);
const unresolvedThenable = {
    then: ()=>{}
}; //# sourceMappingURL=unresolved-thenable.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/navigation-untracked.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUntrackedPathname",
    ()=>useUntrackedPathname
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$hooks$2d$client$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/hooks-client-context.js [app-ssr] (ecmascript)");
;
;
/**
 * This checks to see if the current render has any unknown route parameters that
 * would cause the pathname to be dynamic. It's used to trigger a different
 * render path in the error boundary.
 *
 * @returns true if there are any unknown route parameters, false otherwise
 */ function hasFallbackRouteParams() {
    if ("TURBOPACK compile-time truthy", 1) {
        // AsyncLocalStorage should not be included in the client bundle.
        const { workUnitAsyncStorage } = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
        const workUnitStore = workUnitAsyncStorage.getStore();
        if (!workUnitStore) return false;
        switch(workUnitStore.type){
            case 'prerender':
            case 'prerender-client':
            case 'prerender-ppr':
                const fallbackParams = workUnitStore.fallbackRouteParams;
                return fallbackParams ? fallbackParams.size > 0 : false;
            case 'prerender-legacy':
            case 'request':
            case 'prerender-runtime':
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                break;
            default:
                workUnitStore;
        }
        return false;
    }
    //TURBOPACK unreachable
    ;
}
function useUntrackedPathname() {
    // If there are any unknown route parameters we would typically throw
    // an error, but this internal method allows us to return a null value instead
    // for components that do not propagate the pathname to the static shell (like
    // the error boundary).
    if (hasFallbackRouteParams()) {
        return null;
    }
    // This shouldn't cause any issues related to conditional rendering because
    // the environment will be consistent for the render.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$hooks$2d$client$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PathnameContext"]);
} //# sourceMappingURL=navigation-untracked.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/http-access-fallback/http-access-fallback.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HTTPAccessErrorStatus",
    ()=>HTTPAccessErrorStatus,
    "HTTP_ERROR_FALLBACK_ERROR_CODE",
    ()=>HTTP_ERROR_FALLBACK_ERROR_CODE,
    "getAccessFallbackErrorTypeByStatus",
    ()=>getAccessFallbackErrorTypeByStatus,
    "getAccessFallbackHTTPStatus",
    ()=>getAccessFallbackHTTPStatus,
    "isHTTPAccessFallbackError",
    ()=>isHTTPAccessFallbackError
]);
const HTTPAccessErrorStatus = {
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401
};
const ALLOWED_CODES = new Set(Object.values(HTTPAccessErrorStatus));
const HTTP_ERROR_FALLBACK_ERROR_CODE = 'NEXT_HTTP_ERROR_FALLBACK';
function isHTTPAccessFallbackError(error) {
    if (typeof error !== 'object' || error === null || !('digest' in error) || typeof error.digest !== 'string') {
        return false;
    }
    const [prefix, httpStatus] = error.digest.split(';');
    return prefix === HTTP_ERROR_FALLBACK_ERROR_CODE && ALLOWED_CODES.has(Number(httpStatus));
}
function getAccessFallbackHTTPStatus(error) {
    const httpStatus = error.digest.split(';')[1];
    return Number(httpStatus);
}
function getAccessFallbackErrorTypeByStatus(status) {
    switch(status){
        case 401:
            return 'unauthorized';
        case 403:
            return 'forbidden';
        case 404:
            return 'not-found';
        default:
            return;
    }
} //# sourceMappingURL=http-access-fallback.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/redirect-status-code.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RedirectStatusCode",
    ()=>RedirectStatusCode
]);
var RedirectStatusCode = /*#__PURE__*/ function(RedirectStatusCode) {
    RedirectStatusCode[RedirectStatusCode["SeeOther"] = 303] = "SeeOther";
    RedirectStatusCode[RedirectStatusCode["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    RedirectStatusCode[RedirectStatusCode["PermanentRedirect"] = 308] = "PermanentRedirect";
    return RedirectStatusCode;
}({}); //# sourceMappingURL=redirect-status-code.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/redirect-error.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "REDIRECT_ERROR_CODE",
    ()=>REDIRECT_ERROR_CODE,
    "RedirectType",
    ()=>RedirectType,
    "isRedirectError",
    ()=>isRedirectError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$status$2d$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/redirect-status-code.js [app-ssr] (ecmascript)");
;
const REDIRECT_ERROR_CODE = 'NEXT_REDIRECT';
var RedirectType = /*#__PURE__*/ function(RedirectType) {
    RedirectType["push"] = "push";
    RedirectType["replace"] = "replace";
    return RedirectType;
}({});
function isRedirectError(error) {
    if (typeof error !== 'object' || error === null || !('digest' in error) || typeof error.digest !== 'string') {
        return false;
    }
    const digest = error.digest.split(';');
    const [errorCode, type] = digest;
    const destination = digest.slice(2, -2).join(';');
    const status = digest.at(-2);
    const statusCode = Number(status);
    return errorCode === REDIRECT_ERROR_CODE && (type === 'replace' || type === 'push') && typeof destination === 'string' && !isNaN(statusCode) && statusCode in __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$status$2d$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RedirectStatusCode"];
} //# sourceMappingURL=redirect-error.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/is-next-router-error.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isNextRouterError",
    ()=>isNextRouterError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/http-access-fallback/http-access-fallback.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/redirect-error.js [app-ssr] (ecmascript)");
;
;
function isNextRouterError(error) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRedirectError"])(error) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isHTTPAccessFallbackError"])(error);
} //# sourceMappingURL=is-next-router-error.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/router-reducer/create-href-from-url.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createHrefFromUrl",
    ()=>createHrefFromUrl
]);
function createHrefFromUrl(url, includeHash = true) {
    return url.pathname + url.search + (includeHash ? url.hash : '');
} //# sourceMappingURL=create-href-from-url.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/nav-failure-handler.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "handleHardNavError",
    ()=>handleHardNavError,
    "useNavFailureHandler",
    ()=>useNavFailureHandler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$create$2d$href$2d$from$2d$url$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/router-reducer/create-href-from-url.js [app-ssr] (ecmascript)");
;
;
function handleHardNavError(error) {
    if (error && ("TURBOPACK compile-time value", "undefined") !== 'undefined' && window.next.__pendingUrl && (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$create$2d$href$2d$from$2d$url$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHrefFromUrl"])(new URL(window.location.href)) !== (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$create$2d$href$2d$from$2d$url$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHrefFromUrl"])(window.next.__pendingUrl)) //TURBOPACK unreachable
    ;
    return false;
}
function useNavFailureHandler() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
} //# sourceMappingURL=nav-failure-handler.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/handle-isr-error.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HandleISRError",
    ()=>HandleISRError
]);
const workAsyncStorage = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)").workAsyncStorage : "TURBOPACK unreachable";
function HandleISRError({ error }) {
    if (workAsyncStorage) {
        const store = workAsyncStorage.getStore();
        if (store?.isStaticGeneration) {
            if (error) {
                console.error(error);
            }
            throw error;
        }
    }
    return null;
} //# sourceMappingURL=handle-isr-error.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/router/utils/html-bots.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// This regex contains the bots that we need to do a blocking render for and can't safely stream the response
// due to how they parse the DOM. For example, they might explicitly check for metadata in the `head` tag, so we can't stream metadata tags after the `head` was sent.
// Note: The pattern [\w-]+-Google captures all Google crawlers with "-Google" suffix (e.g., Mediapartners-Google, AdsBot-Google, Storebot-Google)
// as well as crawlers starting with "Google-" (e.g., Google-PageRenderer, Google-InspectionTool)
__turbopack_context__.s([
    "HTML_LIMITED_BOT_UA_RE",
    ()=>HTML_LIMITED_BOT_UA_RE
]);
const HTML_LIMITED_BOT_UA_RE = /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight/i; //# sourceMappingURL=html-bots.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/router/utils/is-bot.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HTML_LIMITED_BOT_UA_RE_STRING",
    ()=>HTML_LIMITED_BOT_UA_RE_STRING,
    "getBotType",
    ()=>getBotType,
    "isBot",
    ()=>isBot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$router$2f$utils$2f$html$2d$bots$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/router/utils/html-bots.js [app-ssr] (ecmascript)");
;
// Bot crawler that will spin up a headless browser and execute JS.
// Only the main Googlebot search crawler executes JavaScript, not other Google crawlers.
// x-ref: https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
// This regex specifically matches "Googlebot" but NOT "Mediapartners-Google", "AdsBot-Google", etc.
const HEADLESS_BROWSER_BOT_UA_RE = /Googlebot(?!-)|Googlebot$/i;
const HTML_LIMITED_BOT_UA_RE_STRING = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$router$2f$utils$2f$html$2d$bots$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HTML_LIMITED_BOT_UA_RE"].source;
;
function isDomBotUA(userAgent) {
    return HEADLESS_BROWSER_BOT_UA_RE.test(userAgent);
}
function isHtmlLimitedBotUA(userAgent) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$router$2f$utils$2f$html$2d$bots$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HTML_LIMITED_BOT_UA_RE"].test(userAgent);
}
function isBot(userAgent) {
    return isDomBotUA(userAgent) || isHtmlLimitedBotUA(userAgent);
}
function getBotType(userAgent) {
    if (isDomBotUA(userAgent)) {
        return 'dom';
    }
    if (isHtmlLimitedBotUA(userAgent)) {
        return 'html';
    }
    return undefined;
} //# sourceMappingURL=is-bot.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/error-boundary.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorBoundary",
    ()=>ErrorBoundary,
    "ErrorBoundaryHandler",
    ()=>ErrorBoundaryHandler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$navigation$2d$untracked$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/navigation-untracked.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$is$2d$next$2d$router$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/is-next-router-error.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$nav$2d$failure$2d$handler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/nav-failure-handler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$handle$2d$isr$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/handle-isr-error.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$router$2f$utils$2f$is$2d$bot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/router/utils/is-bot.js [app-ssr] (ecmascript) <locals>");
'use client';
;
;
;
;
;
;
;
const isBotUserAgent = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$router$2f$utils$2f$is$2d$bot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isBot"])(window.navigator.userAgent);
class ErrorBoundaryHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Component {
    constructor(props){
        super(props), this.reset = ()=>{
            this.setState({
                error: null
            });
        };
        this.state = {
            error: null,
            previousPathname: this.props.pathname
        };
    }
    static getDerivedStateFromError(error) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$is$2d$next$2d$router$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNextRouterError"])(error)) {
            // Re-throw if an expected internal Next.js router error occurs
            // this means it should be handled by a different boundary (such as a NotFound boundary in a parent segment)
            throw error;
        }
        return {
            error
        };
    }
    static getDerivedStateFromProps(props, state) {
        const { error } = state;
        // if we encounter an error while
        // a navigation is pending we shouldn't render
        // the error boundary and instead should fallback
        // to a hard navigation to attempt recovering
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        /**
     * Handles reset of the error boundary when a navigation happens.
     * Ensures the error boundary does not stay enabled when navigating to a new page.
     * Approach of setState in render is safe as it checks the previous pathname and then overrides
     * it as outlined in https://react.dev/reference/react/useState#storing-information-from-previous-renders
     */ if (props.pathname !== state.previousPathname && state.error) {
            return {
                error: null,
                previousPathname: props.pathname
            };
        }
        return {
            error: state.error,
            previousPathname: props.pathname
        };
    }
    // Explicit type is needed to avoid the generated `.d.ts` having a wide return type that could be specific to the `@types/react` version.
    render() {
        //When it's bot request, segment level error boundary will keep rendering the children,
        // the final error will be caught by the root error boundary and determine wether need to apply graceful degrade.
        if (this.state.error && !isBotUserAgent) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$handle$2d$isr$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HandleISRError"], {
                        error: this.state.error
                    }),
                    this.props.errorStyles,
                    this.props.errorScripts,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(this.props.errorComponent, {
                        error: this.state.error,
                        reset: this.reset
                    })
                ]
            });
        }
        return this.props.children;
    }
}
function ErrorBoundary({ errorComponent, errorStyles, errorScripts, children }) {
    // When we're rendering the missing params shell, this will return null. This
    // is because we won't be rendering any not found boundaries or error
    // boundaries for the missing params shell. When this runs on the client
    // (where these errors can occur), we will get the correct pathname.
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$navigation$2d$untracked$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUntrackedPathname"])();
    if (errorComponent) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ErrorBoundaryHandler, {
            pathname: pathname,
            errorComponent: errorComponent,
            errorStyles: errorStyles,
            errorScripts: errorScripts,
            children: children
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    });
} //# sourceMappingURL=error-boundary.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/match-segments.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "matchSegment",
    ()=>matchSegment
]);
const matchSegment = (existingSegment, segment)=>{
    // segment is either Array or string
    if (typeof existingSegment === 'string') {
        if (typeof segment === 'string') {
            // Common case: segment is just a string
            return existingSegment === segment;
        }
        return false;
    }
    if (typeof segment === 'string') {
        return false;
    }
    return existingSegment[0] === segment[0] && existingSegment[1] === segment[1];
}; //# sourceMappingURL=match-segments.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/utils/warn-once.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "warnOnce",
    ()=>warnOnce
]);
let warnOnce = (_)=>{};
if ("TURBOPACK compile-time truthy", 1) {
    const warnings = new Set();
    warnOnce = (msg)=>{
        if (!warnings.has(msg)) {
            console.warn(msg);
        }
        warnings.add(msg);
    };
}
;
 //# sourceMappingURL=warn-once.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/router/utils/disable-smooth-scroll.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "disableSmoothScrollDuringRouteTransition",
    ()=>disableSmoothScrollDuringRouteTransition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$warn$2d$once$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/utils/warn-once.js [app-ssr] (ecmascript)");
;
function disableSmoothScrollDuringRouteTransition(fn, options = {}) {
    // if only the hash is changed, we don't need to disable smooth scrolling
    // we only care to prevent smooth scrolling when navigating to a new page to avoid jarring UX
    if (options.onlyHashChange) {
        fn();
        return;
    }
    const htmlElement = document.documentElement;
    const hasDataAttribute = htmlElement.dataset.scrollBehavior === 'smooth';
    if (!hasDataAttribute) {
        // Warn if smooth scrolling is detected but no data attribute is present
        if (("TURBOPACK compile-time value", "development") === 'development' && getComputedStyle(htmlElement).scrollBehavior === 'smooth') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$warn$2d$once$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warnOnce"])('Detected `scroll-behavior: smooth` on the `<html>` element. To disable smooth scrolling during route transitions, ' + 'add `data-scroll-behavior="smooth"` to your <html> element. ' + 'Learn more: https://nextjs.org/docs/messages/missing-data-scroll-behavior');
        }
        // No smooth scrolling configured, run directly without style manipulation
        fn();
        return;
    }
    // Proceed with temporarily disabling smooth scrolling
    const existing = htmlElement.style.scrollBehavior;
    htmlElement.style.scrollBehavior = 'auto';
    if (!options.dontForceLayout) {
        // In Chrome-based browsers we need to force reflow before calling `scrollTo`.
        // Otherwise it will not pickup the change in scrollBehavior
        // More info here: https://github.com/vercel/next.js/issues/40719#issuecomment-1336248042
        htmlElement.getClientRects();
    }
    fn();
    htmlElement.style.scrollBehavior = existing;
} //# sourceMappingURL=disable-smooth-scroll.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/router-reducer/reducers/get-segment-value.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSegmentValue",
    ()=>getSegmentValue
]);
function getSegmentValue(segment) {
    return Array.isArray(segment) ? segment[1] : segment;
} //# sourceMappingURL=get-segment-value.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/redirect.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRedirectError",
    ()=>getRedirectError,
    "getRedirectStatusCodeFromError",
    ()=>getRedirectStatusCodeFromError,
    "getRedirectTypeFromError",
    ()=>getRedirectTypeFromError,
    "getURLFromRedirectError",
    ()=>getURLFromRedirectError,
    "permanentRedirect",
    ()=>permanentRedirect,
    "redirect",
    ()=>redirect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$status$2d$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/redirect-status-code.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/redirect-error.js [app-ssr] (ecmascript)");
;
;
const actionAsyncStorage = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)").actionAsyncStorage : "TURBOPACK unreachable";
function getRedirectError(url, type, statusCode = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$status$2d$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RedirectStatusCode"].TemporaryRedirect) {
    const error = Object.defineProperty(new Error(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REDIRECT_ERROR_CODE"]), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.digest = `${__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REDIRECT_ERROR_CODE"]};${type};${url};${statusCode};`;
    return error;
}
function redirect(/** The URL to redirect to */ url, type) {
    type ??= actionAsyncStorage?.getStore()?.isAction ? __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RedirectType"].push : __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RedirectType"].replace;
    throw getRedirectError(url, type, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$status$2d$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RedirectStatusCode"].TemporaryRedirect);
}
function permanentRedirect(/** The URL to redirect to */ url, type = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RedirectType"].replace) {
    throw getRedirectError(url, type, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$status$2d$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RedirectStatusCode"].PermanentRedirect);
}
function getURLFromRedirectError(error) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRedirectError"])(error)) return null;
    // Slices off the beginning of the digest that contains the code and the
    // separating ';'.
    return error.digest.split(';').slice(2, -2).join(';');
}
function getRedirectTypeFromError(error) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRedirectError"])(error)) {
        throw Object.defineProperty(new Error('Not a redirect error'), "__NEXT_ERROR_CODE", {
            value: "E260",
            enumerable: false,
            configurable: true
        });
    }
    return error.digest.split(';', 2)[1];
}
function getRedirectStatusCodeFromError(error) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRedirectError"])(error)) {
        throw Object.defineProperty(new Error('Not a redirect error'), "__NEXT_ERROR_CODE", {
            value: "E260",
            enumerable: false,
            configurable: true
        });
    }
    return Number(error.digest.split(';').at(-2));
} //# sourceMappingURL=redirect.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/not-found.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "notFound",
    ()=>notFound
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/http-access-fallback/http-access-fallback.js [app-ssr] (ecmascript)");
;
/**
 * This function allows you to render the [not-found.js file](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
 * within a route segment as well as inject a tag.
 *
 * `notFound()` can be used in
 * [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components),
 * [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers), and
 * [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).
 *
 * - In a Server Component, this will insert a `<meta name="robots" content="noindex" />` meta tag and set the status code to 404.
 * - In a Route Handler or Server Action, it will serve a 404 to the caller.
 *
 * Read more: [Next.js Docs: `notFound`](https://nextjs.org/docs/app/api-reference/functions/not-found)
 */ const DIGEST = `${__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HTTP_ERROR_FALLBACK_ERROR_CODE"]};404`;
function notFound() {
    // eslint-disable-next-line no-throw-literal
    const error = Object.defineProperty(new Error(DIGEST), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.digest = DIGEST;
    throw error;
} //# sourceMappingURL=not-found.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/forbidden.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "forbidden",
    ()=>forbidden
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/http-access-fallback/http-access-fallback.js [app-ssr] (ecmascript)");
;
// TODO: Add `forbidden` docs
/**
 * @experimental
 * This function allows you to render the [forbidden.js file](https://nextjs.org/docs/app/api-reference/file-conventions/forbidden)
 * within a route segment as well as inject a tag.
 *
 * `forbidden()` can be used in
 * [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components),
 * [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers), and
 * [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).
 *
 * Read more: [Next.js Docs: `forbidden`](https://nextjs.org/docs/app/api-reference/functions/forbidden)
 */ const DIGEST = `${__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HTTP_ERROR_FALLBACK_ERROR_CODE"]};403`;
function forbidden() {
    if ("TURBOPACK compile-time truthy", 1) {
        throw Object.defineProperty(new Error(`\`forbidden()\` is experimental and only allowed to be enabled when \`experimental.authInterrupts\` is enabled.`), "__NEXT_ERROR_CODE", {
            value: "E488",
            enumerable: false,
            configurable: true
        });
    }
    // eslint-disable-next-line no-throw-literal
    const error = Object.defineProperty(new Error(DIGEST), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.digest = DIGEST;
    throw error;
} //# sourceMappingURL=forbidden.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/unauthorized.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "unauthorized",
    ()=>unauthorized
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/http-access-fallback/http-access-fallback.js [app-ssr] (ecmascript)");
;
// TODO: Add `unauthorized` docs
/**
 * @experimental
 * This function allows you to render the [unauthorized.js file](https://nextjs.org/docs/app/api-reference/file-conventions/unauthorized)
 * within a route segment as well as inject a tag.
 *
 * `unauthorized()` can be used in
 * [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components),
 * [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers), and
 * [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).
 *
 *
 * Read more: [Next.js Docs: `unauthorized`](https://nextjs.org/docs/app/api-reference/functions/unauthorized)
 */ const DIGEST = `${__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HTTP_ERROR_FALLBACK_ERROR_CODE"]};401`;
function unauthorized() {
    if ("TURBOPACK compile-time truthy", 1) {
        throw Object.defineProperty(new Error(`\`unauthorized()\` is experimental and only allowed to be used when \`experimental.authInterrupts\` is enabled.`), "__NEXT_ERROR_CODE", {
            value: "E411",
            enumerable: false,
            configurable: true
        });
    }
    // eslint-disable-next-line no-throw-literal
    const error = Object.defineProperty(new Error(DIGEST), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.digest = DIGEST;
    throw error;
} //# sourceMappingURL=unauthorized.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/dynamic-rendering-utils.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isHangingPromiseRejectionError",
    ()=>isHangingPromiseRejectionError,
    "makeDevtoolsIOAwarePromise",
    ()=>makeDevtoolsIOAwarePromise,
    "makeHangingPromise",
    ()=>makeHangingPromise
]);
function isHangingPromiseRejectionError(err) {
    if (typeof err !== 'object' || err === null || !('digest' in err)) {
        return false;
    }
    return err.digest === HANGING_PROMISE_REJECTION;
}
const HANGING_PROMISE_REJECTION = 'HANGING_PROMISE_REJECTION';
class HangingPromiseRejectionError extends Error {
    constructor(route, expression){
        super(`During prerendering, ${expression} rejects when the prerender is complete. Typically these errors are handled by React but if you move ${expression} to a different context by using \`setTimeout\`, \`after\`, or similar functions you may observe this error and you should handle it in that context. This occurred at route "${route}".`), this.route = route, this.expression = expression, this.digest = HANGING_PROMISE_REJECTION;
    }
}
const abortListenersBySignal = new WeakMap();
function makeHangingPromise(signal, route, expression) {
    if (signal.aborted) {
        return Promise.reject(new HangingPromiseRejectionError(route, expression));
    } else {
        const hangingPromise = new Promise((_, reject)=>{
            const boundRejection = reject.bind(null, new HangingPromiseRejectionError(route, expression));
            let currentListeners = abortListenersBySignal.get(signal);
            if (currentListeners) {
                currentListeners.push(boundRejection);
            } else {
                const listeners = [
                    boundRejection
                ];
                abortListenersBySignal.set(signal, listeners);
                signal.addEventListener('abort', ()=>{
                    for(let i = 0; i < listeners.length; i++){
                        listeners[i]();
                    }
                }, {
                    once: true
                });
            }
        });
        // We are fine if no one actually awaits this promise. We shouldn't consider this an unhandled rejection so
        // we attach a noop catch handler here to suppress this warning. If you actually await somewhere or construct
        // your own promise out of it you'll need to ensure you handle the error when it rejects.
        hangingPromise.catch(ignoreReject);
        return hangingPromise;
    }
}
function ignoreReject() {}
function makeDevtoolsIOAwarePromise(underlying) {
    // in React DevTools if we resolve in a setTimeout we will observe
    // the promise resolution as something that can suspend a boundary or root.
    return new Promise((resolve)=>{
        // Must use setTimeout to be considered IO React DevTools. setImmediate will not work.
        setTimeout(()=>{
            resolve(underlying);
        }, 0);
    });
} //# sourceMappingURL=dynamic-rendering-utils.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/lib/router-utils/is-postpone.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isPostpone",
    ()=>isPostpone
]);
const REACT_POSTPONE_TYPE = Symbol.for('react.postpone');
function isPostpone(error) {
    return typeof error === 'object' && error !== null && error.$$typeof === REACT_POSTPONE_TYPE;
} //# sourceMappingURL=is-postpone.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/lazy-dynamic/bailout-to-csr.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// This has to be a shared module which is shared between client component error boundary and dynamic component
__turbopack_context__.s([
    "BailoutToCSRError",
    ()=>BailoutToCSRError,
    "isBailoutToCSRError",
    ()=>isBailoutToCSRError
]);
const BAILOUT_TO_CSR = 'BAILOUT_TO_CLIENT_SIDE_RENDERING';
class BailoutToCSRError extends Error {
    constructor(reason){
        super(`Bail out to client-side rendering: ${reason}`), this.reason = reason, this.digest = BAILOUT_TO_CSR;
    }
}
function isBailoutToCSRError(err) {
    if (typeof err !== 'object' || err === null || !('digest' in err)) {
        return false;
    }
    return err.digest === BAILOUT_TO_CSR;
} //# sourceMappingURL=bailout-to-csr.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/hooks-server-context.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DynamicServerError",
    ()=>DynamicServerError,
    "isDynamicServerError",
    ()=>isDynamicServerError
]);
const DYNAMIC_ERROR_CODE = 'DYNAMIC_SERVER_USAGE';
class DynamicServerError extends Error {
    constructor(description){
        super(`Dynamic server usage: ${description}`), this.description = description, this.digest = DYNAMIC_ERROR_CODE;
    }
}
function isDynamicServerError(err) {
    if (typeof err !== 'object' || err === null || !('digest' in err) || typeof err.digest !== 'string') {
        return false;
    }
    return err.digest === DYNAMIC_ERROR_CODE;
} //# sourceMappingURL=hooks-server-context.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/static-generation-bailout.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StaticGenBailoutError",
    ()=>StaticGenBailoutError,
    "isStaticGenBailoutError",
    ()=>isStaticGenBailoutError
]);
const NEXT_STATIC_GEN_BAILOUT = 'NEXT_STATIC_GEN_BAILOUT';
class StaticGenBailoutError extends Error {
    constructor(...args){
        super(...args), this.code = NEXT_STATIC_GEN_BAILOUT;
    }
}
function isStaticGenBailoutError(error) {
    if (typeof error !== 'object' || error === null || !('code' in error)) {
        return false;
    }
    return error.code === NEXT_STATIC_GEN_BAILOUT;
} //# sourceMappingURL=static-generation-bailout.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/lib/framework/boundary-constants.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "METADATA_BOUNDARY_NAME",
    ()=>METADATA_BOUNDARY_NAME,
    "OUTLET_BOUNDARY_NAME",
    ()=>OUTLET_BOUNDARY_NAME,
    "ROOT_LAYOUT_BOUNDARY_NAME",
    ()=>ROOT_LAYOUT_BOUNDARY_NAME,
    "VIEWPORT_BOUNDARY_NAME",
    ()=>VIEWPORT_BOUNDARY_NAME
]);
const METADATA_BOUNDARY_NAME = '__next_metadata_boundary__';
const VIEWPORT_BOUNDARY_NAME = '__next_viewport_boundary__';
const OUTLET_BOUNDARY_NAME = '__next_outlet_boundary__';
const ROOT_LAYOUT_BOUNDARY_NAME = '__next_root_layout_boundary__'; //# sourceMappingURL=boundary-constants.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/lib/scheduler.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Schedules a function to be called on the next tick after the other promises
 * have been resolved.
 *
 * @param cb the function to schedule
 */ __turbopack_context__.s([
    "atLeastOneTask",
    ()=>atLeastOneTask,
    "scheduleImmediate",
    ()=>scheduleImmediate,
    "scheduleOnNextTick",
    ()=>scheduleOnNextTick,
    "waitAtLeastOneReactRenderTask",
    ()=>waitAtLeastOneReactRenderTask
]);
const scheduleOnNextTick = (cb)=>{
    // We use Promise.resolve().then() here so that the operation is scheduled at
    // the end of the promise job queue, we then add it to the next process tick
    // to ensure it's evaluated afterwards.
    //
    // This was inspired by the implementation of the DataLoader interface: https://github.com/graphql/dataloader/blob/d336bd15282664e0be4b4a657cb796f09bafbc6b/src/index.js#L213-L255
    //
    Promise.resolve().then(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            process.nextTick(cb);
        }
    });
};
const scheduleImmediate = (cb)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        setImmediate(cb);
    }
};
function atLeastOneTask() {
    return new Promise((resolve)=>scheduleImmediate(resolve));
}
function waitAtLeastOneReactRenderTask() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        return new Promise((r)=>setImmediate(r));
    }
} //# sourceMappingURL=scheduler.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/invariant-error.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InvariantError",
    ()=>InvariantError
]);
class InvariantError extends Error {
    constructor(message, options){
        super(`Invariant: ${message.endsWith('.') ? message : message + '.'} This is a bug in Next.js.`, options);
        this.name = 'InvariantError';
    }
} //# sourceMappingURL=invariant-error.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/app-render/dynamic-rendering.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * The functions provided by this module are used to communicate certain properties
 * about the currently running code so that Next.js can make decisions on how to handle
 * the current execution in different rendering modes such as pre-rendering, resuming, and SSR.
 *
 * Today Next.js treats all code as potentially static. Certain APIs may only make sense when dynamically rendering.
 * Traditionally this meant deopting the entire render to dynamic however with PPR we can now deopt parts
 * of a React tree as dynamic while still keeping other parts static. There are really two different kinds of
 * Dynamic indications.
 *
 * The first is simply an intention to be dynamic. unstable_noStore is an example of this where
 * the currently executing code simply declares that the current scope is dynamic but if you use it
 * inside unstable_cache it can still be cached. This type of indication can be removed if we ever
 * make the default dynamic to begin with because the only way you would ever be static is inside
 * a cache scope which this indication does not affect.
 *
 * The second is an indication that a dynamic data source was read. This is a stronger form of dynamic
 * because it means that it is inappropriate to cache this at all. using a dynamic data source inside
 * unstable_cache should error. If you want to use some dynamic data inside unstable_cache you should
 * read that data outside the cache and pass it in as an argument to the cached function.
 */ // Once postpone is in stable we should switch to importing the postpone export directly
__turbopack_context__.s([
    "Postpone",
    ()=>Postpone,
    "PreludeState",
    ()=>PreludeState,
    "abortAndThrowOnSynchronousRequestDataAccess",
    ()=>abortAndThrowOnSynchronousRequestDataAccess,
    "abortOnSynchronousPlatformIOAccess",
    ()=>abortOnSynchronousPlatformIOAccess,
    "accessedDynamicData",
    ()=>accessedDynamicData,
    "annotateDynamicAccess",
    ()=>annotateDynamicAccess,
    "consumeDynamicAccess",
    ()=>consumeDynamicAccess,
    "createDynamicTrackingState",
    ()=>createDynamicTrackingState,
    "createDynamicValidationState",
    ()=>createDynamicValidationState,
    "createHangingInputAbortSignal",
    ()=>createHangingInputAbortSignal,
    "createRenderInBrowserAbortSignal",
    ()=>createRenderInBrowserAbortSignal,
    "delayUntilRuntimeStage",
    ()=>delayUntilRuntimeStage,
    "formatDynamicAPIAccesses",
    ()=>formatDynamicAPIAccesses,
    "getFirstDynamicReason",
    ()=>getFirstDynamicReason,
    "isDynamicPostpone",
    ()=>isDynamicPostpone,
    "isPrerenderInterruptedError",
    ()=>isPrerenderInterruptedError,
    "logDisallowedDynamicError",
    ()=>logDisallowedDynamicError,
    "markCurrentScopeAsDynamic",
    ()=>markCurrentScopeAsDynamic,
    "postponeWithTracking",
    ()=>postponeWithTracking,
    "throwIfDisallowedDynamic",
    ()=>throwIfDisallowedDynamic,
    "throwToInterruptStaticGeneration",
    ()=>throwToInterruptStaticGeneration,
    "trackAllowedDynamicAccess",
    ()=>trackAllowedDynamicAccess,
    "trackDynamicDataInDynamicRender",
    ()=>trackDynamicDataInDynamicRender,
    "trackSynchronousPlatformIOAccessInDev",
    ()=>trackSynchronousPlatformIOAccessInDev,
    "useDynamicRouteParams",
    ()=>useDynamicRouteParams,
    "useDynamicSearchParams",
    ()=>useDynamicSearchParams
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$hooks$2d$server$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/hooks-server-context.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$static$2d$generation$2d$bailout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/static-generation-bailout.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dynamic$2d$rendering$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/dynamic-rendering-utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$framework$2f$boundary$2d$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/lib/framework/boundary-constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$scheduler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/lib/scheduler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$lazy$2d$dynamic$2f$bailout$2d$to$2d$csr$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/lazy-dynamic/bailout-to-csr.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
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
const hasPostpone = typeof __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].unstable_postpone === 'function';
function createDynamicTrackingState(isDebugDynamicAccesses) {
    return {
        isDebugDynamicAccesses,
        dynamicAccesses: [],
        syncDynamicErrorWithStack: null
    };
}
function createDynamicValidationState() {
    return {
        hasSuspenseAboveBody: false,
        hasDynamicMetadata: false,
        hasDynamicViewport: false,
        hasAllowedDynamic: false,
        dynamicErrors: []
    };
}
function getFirstDynamicReason(trackingState) {
    var _trackingState_dynamicAccesses_;
    return (_trackingState_dynamicAccesses_ = trackingState.dynamicAccesses[0]) == null ? void 0 : _trackingState_dynamicAccesses_.expression;
}
function markCurrentScopeAsDynamic(store, workUnitStore, expression) {
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'cache':
            case 'unstable-cache':
                // Inside cache scopes, marking a scope as dynamic has no effect,
                // because the outer cache scope creates a cache boundary. This is
                // subtly different from reading a dynamic data source, which is
                // forbidden inside a cache scope.
                return;
            case 'private-cache':
                // A private cache scope is already dynamic by definition.
                return;
            case 'prerender-legacy':
            case 'prerender-ppr':
            case 'request':
                break;
            default:
                workUnitStore;
        }
    }
    // If we're forcing dynamic rendering or we're forcing static rendering, we
    // don't need to do anything here because the entire page is already dynamic
    // or it's static and it should not throw or postpone here.
    if (store.forceDynamic || store.forceStatic) return;
    if (store.dynamicShouldError) {
        throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$static$2d$generation$2d$bailout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaticGenBailoutError"](`Route ${store.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
            value: "E553",
            enumerable: false,
            configurable: true
        });
    }
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender-ppr':
                return postponeWithTracking(store.route, expression, workUnitStore.dynamicTracking);
            case 'prerender-legacy':
                workUnitStore.revalidate = 0;
                // We aren't prerendering, but we are generating a static page. We need
                // to bail out of static generation.
                const err = Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$hooks$2d$server$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DynamicServerError"](`Route ${store.route} couldn't be rendered statically because it used ${expression}. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", {
                    value: "E550",
                    enumerable: false,
                    configurable: true
                });
                store.dynamicUsageDescription = expression;
                store.dynamicUsageStack = err.stack;
                throw err;
            case 'request':
                if ("TURBOPACK compile-time truthy", 1) {
                    workUnitStore.usedDynamic = true;
                }
                break;
            default:
                workUnitStore;
        }
    }
}
function throwToInterruptStaticGeneration(expression, store, prerenderStore) {
    // We aren't prerendering but we are generating a static page. We need to bail out of static generation
    const err = Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$hooks$2d$server$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DynamicServerError"](`Route ${store.route} couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", {
        value: "E558",
        enumerable: false,
        configurable: true
    });
    prerenderStore.revalidate = 0;
    store.dynamicUsageDescription = expression;
    store.dynamicUsageStack = err.stack;
    throw err;
}
function trackDynamicDataInDynamicRender(workUnitStore) {
    switch(workUnitStore.type){
        case 'cache':
        case 'unstable-cache':
            // Inside cache scopes, marking a scope as dynamic has no effect,
            // because the outer cache scope creates a cache boundary. This is
            // subtly different from reading a dynamic data source, which is
            // forbidden inside a cache scope.
            return;
        case 'private-cache':
            // A private cache scope is already dynamic by definition.
            return;
        case 'prerender':
        case 'prerender-runtime':
        case 'prerender-legacy':
        case 'prerender-ppr':
        case 'prerender-client':
            break;
        case 'request':
            if ("TURBOPACK compile-time truthy", 1) {
                workUnitStore.usedDynamic = true;
            }
            break;
        default:
            workUnitStore;
    }
}
function abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore) {
    const reason = `Route ${route} needs to bail out of prerendering at this point because it used ${expression}.`;
    const error = createPrerenderInterruptedError(reason);
    prerenderStore.controller.abort(error);
    const dynamicTracking = prerenderStore.dynamicTracking;
    if (dynamicTracking) {
        dynamicTracking.dynamicAccesses.push({
            // When we aren't debugging, we don't need to create another error for the
            // stack trace.
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : undefined,
            expression
        });
    }
}
function abortOnSynchronousPlatformIOAccess(route, expression, errorWithStack, prerenderStore) {
    const dynamicTracking = prerenderStore.dynamicTracking;
    abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore);
    // It is important that we set this tracking value after aborting. Aborts are executed
    // synchronously except for the case where you abort during render itself. By setting this
    // value late we can use it to determine if any of the aborted tasks are the task that
    // called the sync IO expression in the first place.
    if (dynamicTracking) {
        if (dynamicTracking.syncDynamicErrorWithStack === null) {
            dynamicTracking.syncDynamicErrorWithStack = errorWithStack;
        }
    }
}
function trackSynchronousPlatformIOAccessInDev(requestStore) {
    // We don't actually have a controller to abort but we do the semantic equivalent by
    // advancing the request store out of prerender mode
    requestStore.prerenderPhase = false;
}
function abortAndThrowOnSynchronousRequestDataAccess(route, expression, errorWithStack, prerenderStore) {
    const prerenderSignal = prerenderStore.controller.signal;
    if (prerenderSignal.aborted === false) {
        // TODO it would be better to move this aborted check into the callsite so we can avoid making
        // the error object when it isn't relevant to the aborting of the prerender however
        // since we need the throw semantics regardless of whether we abort it is easier to land
        // this way. See how this was handled with `abortOnSynchronousPlatformIOAccess` for a closer
        // to ideal implementation
        abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore);
        // It is important that we set this tracking value after aborting. Aborts are executed
        // synchronously except for the case where you abort during render itself. By setting this
        // value late we can use it to determine if any of the aborted tasks are the task that
        // called the sync IO expression in the first place.
        const dynamicTracking = prerenderStore.dynamicTracking;
        if (dynamicTracking) {
            if (dynamicTracking.syncDynamicErrorWithStack === null) {
                dynamicTracking.syncDynamicErrorWithStack = errorWithStack;
            }
        }
    }
    throw createPrerenderInterruptedError(`Route ${route} needs to bail out of prerendering at this point because it used ${expression}.`);
}
function Postpone({ reason, route }) {
    const prerenderStore = __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["workUnitAsyncStorage"].getStore();
    const dynamicTracking = prerenderStore && prerenderStore.type === 'prerender-ppr' ? prerenderStore.dynamicTracking : null;
    postponeWithTracking(route, reason, dynamicTracking);
}
function postponeWithTracking(route, expression, dynamicTracking) {
    assertPostpone();
    if (dynamicTracking) {
        dynamicTracking.dynamicAccesses.push({
            // When we aren't debugging, we don't need to create another error for the
            // stack trace.
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : undefined,
            expression
        });
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].unstable_postpone(createPostponeReason(route, expression));
}
function createPostponeReason(route, expression) {
    return `Route ${route} needs to bail out of prerendering at this point because it used ${expression}. ` + `React throws this special object to indicate where. It should not be caught by ` + `your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error`;
}
function isDynamicPostpone(err) {
    if (typeof err === 'object' && err !== null && typeof err.message === 'string') {
        return isDynamicPostponeReason(err.message);
    }
    return false;
}
function isDynamicPostponeReason(reason) {
    return reason.includes('needs to bail out of prerendering at this point because it used') && reason.includes('Learn more: https://nextjs.org/docs/messages/ppr-caught-error');
}
if (isDynamicPostponeReason(createPostponeReason('%%%', '^^^')) === false) {
    throw Object.defineProperty(new Error('Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js'), "__NEXT_ERROR_CODE", {
        value: "E296",
        enumerable: false,
        configurable: true
    });
}
const NEXT_PRERENDER_INTERRUPTED = 'NEXT_PRERENDER_INTERRUPTED';
function createPrerenderInterruptedError(message) {
    const error = Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.digest = NEXT_PRERENDER_INTERRUPTED;
    return error;
}
function isPrerenderInterruptedError(error) {
    return typeof error === 'object' && error !== null && error.digest === NEXT_PRERENDER_INTERRUPTED && 'name' in error && 'message' in error && error instanceof Error;
}
function accessedDynamicData(dynamicAccesses) {
    return dynamicAccesses.length > 0;
}
function consumeDynamicAccess(serverDynamic, clientDynamic) {
    // We mutate because we only call this once we are no longer writing
    // to the dynamicTrackingState and it's more efficient than creating a new
    // array.
    serverDynamic.dynamicAccesses.push(...clientDynamic.dynamicAccesses);
    return serverDynamic.dynamicAccesses;
}
function formatDynamicAPIAccesses(dynamicAccesses) {
    return dynamicAccesses.filter((access)=>typeof access.stack === 'string' && access.stack.length > 0).map(({ expression, stack })=>{
        stack = stack.split('\n') // Remove the "Error: " prefix from the first line of the stack trace as
        // well as the first 4 lines of the stack trace which is the distance
        // from the user code and the `new Error().stack` call.
        .slice(4).filter((line)=>{
            // Exclude Next.js internals from the stack trace.
            if (line.includes('node_modules/next/')) {
                return false;
            }
            // Exclude anonymous functions from the stack trace.
            if (line.includes(' (<anonymous>)')) {
                return false;
            }
            // Exclude Node.js internals from the stack trace.
            if (line.includes(' (node:')) {
                return false;
            }
            return true;
        }).join('\n');
        return `Dynamic API Usage Debug - ${expression}:\n${stack}`;
    });
}
function assertPostpone() {
    if (!hasPostpone) {
        throw Object.defineProperty(new Error(`Invariant: React.unstable_postpone is not defined. This suggests the wrong version of React was loaded. This is a bug in Next.js`), "__NEXT_ERROR_CODE", {
            value: "E224",
            enumerable: false,
            configurable: true
        });
    }
}
function createRenderInBrowserAbortSignal() {
    const controller = new AbortController();
    controller.abort(Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$lazy$2d$dynamic$2f$bailout$2d$to$2d$csr$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BailoutToCSRError"]('Render in Browser'), "__NEXT_ERROR_CODE", {
        value: "E721",
        enumerable: false,
        configurable: true
    }));
    return controller.signal;
}
function createHangingInputAbortSignal(workUnitStore) {
    switch(workUnitStore.type){
        case 'prerender':
        case 'prerender-runtime':
            const controller = new AbortController();
            if (workUnitStore.cacheSignal) {
                // If we have a cacheSignal it means we're in a prospective render. If
                // the input we're waiting on is coming from another cache, we do want
                // to wait for it so that we can resolve this cache entry too.
                workUnitStore.cacheSignal.inputReady().then(()=>{
                    controller.abort();
                });
            } else {
                // Otherwise we're in the final render and we should already have all
                // our caches filled.
                // If the prerender uses stages, we have wait until the runtime stage,
                // at which point all runtime inputs will be resolved.
                // (otherwise, a runtime prerender might consider `cookies()` hanging
                //  even though they'd resolve in the next task.)
                //
                // We might still be waiting on some microtasks so we
                // wait one tick before giving up. When we give up, we still want to
                // render the content of this cache as deeply as we can so that we can
                // suspend as deeply as possible in the tree or not at all if we don't
                // end up waiting for the input.
                const runtimeStagePromise = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["getRuntimeStagePromise"])(workUnitStore);
                if (runtimeStagePromise) {
                    runtimeStagePromise.then(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$scheduler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scheduleOnNextTick"])(()=>controller.abort()));
                } else {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$scheduler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scheduleOnNextTick"])(()=>controller.abort());
                }
            }
            return controller.signal;
        case 'prerender-client':
        case 'prerender-ppr':
        case 'prerender-legacy':
        case 'request':
        case 'cache':
        case 'private-cache':
        case 'unstable-cache':
            return undefined;
        default:
            workUnitStore;
    }
}
function annotateDynamicAccess(expression, prerenderStore) {
    const dynamicTracking = prerenderStore.dynamicTracking;
    if (dynamicTracking) {
        dynamicTracking.dynamicAccesses.push({
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : undefined,
            expression
        });
    }
}
function useDynamicRouteParams(expression) {
    const workStore = __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["workAsyncStorage"].getStore();
    const workUnitStore = __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["workUnitAsyncStorage"].getStore();
    if (workStore && workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender-client':
            case 'prerender':
                {
                    const fallbackParams = workUnitStore.fallbackRouteParams;
                    if (fallbackParams && fallbackParams.size > 0) {
                        // We are in a prerender with cacheComponents semantics. We are going to
                        // hang here and never resolve. This will cause the currently
                        // rendering component to effectively be a dynamic hole.
                        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].use((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dynamic$2d$rendering$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeHangingPromise"])(workUnitStore.renderSignal, workStore.route, expression));
                    }
                    break;
                }
            case 'prerender-ppr':
                {
                    const fallbackParams = workUnitStore.fallbackRouteParams;
                    if (fallbackParams && fallbackParams.size > 0) {
                        return postponeWithTracking(workStore.route, expression, workUnitStore.dynamicTracking);
                    }
                    break;
                }
            case 'prerender-runtime':
                throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"](`\`${expression}\` was called during a runtime prerender. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                    value: "E771",
                    enumerable: false,
                    configurable: true
                });
            case 'cache':
            case 'private-cache':
                throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"](`\`${expression}\` was called inside a cache scope. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                    value: "E745",
                    enumerable: false,
                    configurable: true
                });
            case 'prerender-legacy':
            case 'request':
            case 'unstable-cache':
                break;
            default:
                workUnitStore;
        }
    }
}
function useDynamicSearchParams(expression) {
    const workStore = __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["workAsyncStorage"].getStore();
    const workUnitStore = __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["workUnitAsyncStorage"].getStore();
    if (!workStore) {
        // We assume pages router context and just return
        return;
    }
    if (!workUnitStore) {
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["throwForMissingRequestStore"])(expression);
    }
    switch(workUnitStore.type){
        case 'prerender-client':
            {
                __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].use((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dynamic$2d$rendering$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeHangingPromise"])(workUnitStore.renderSignal, workStore.route, expression));
                break;
            }
        case 'prerender-legacy':
        case 'prerender-ppr':
            {
                if (workStore.forceStatic) {
                    return;
                }
                throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$lazy$2d$dynamic$2f$bailout$2d$to$2d$csr$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BailoutToCSRError"](expression), "__NEXT_ERROR_CODE", {
                    value: "E394",
                    enumerable: false,
                    configurable: true
                });
            }
        case 'prerender':
        case 'prerender-runtime':
            throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"](`\`${expression}\` was called from a Server Component. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                value: "E795",
                enumerable: false,
                configurable: true
            });
        case 'cache':
        case 'unstable-cache':
        case 'private-cache':
            throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"](`\`${expression}\` was called inside a cache scope. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                value: "E745",
                enumerable: false,
                configurable: true
            });
        case 'request':
            return;
        default:
            workUnitStore;
    }
}
const hasSuspenseRegex = /\n\s+at Suspense \(<anonymous>\)/;
// Common implicit body tags that React will treat as body when placed directly in html
const bodyAndImplicitTags = 'body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6';
// Detects when RootLayoutBoundary (our framework marker component) appears
// after Suspense in the component stack, indicating the root layout is wrapped
// within a Suspense boundary. Ensures no body/html/implicit-body components are in between.
//
// Example matches:
//   at Suspense (<anonymous>)
//   at __next_root_layout_boundary__ (<anonymous>)
//
// Or with other components in between (but not body/html/implicit-body):
//   at Suspense (<anonymous>)
//   at SomeComponent (<anonymous>)
//   at __next_root_layout_boundary__ (<anonymous>)
const hasSuspenseBeforeRootLayoutWithoutBodyOrImplicitBodyRegex = new RegExp(`\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:${bodyAndImplicitTags}) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at ${__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$framework$2f$boundary$2d$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROOT_LAYOUT_BOUNDARY_NAME"]} \\([^\\n]*\\)`);
const hasMetadataRegex = new RegExp(`\\n\\s+at ${__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$framework$2f$boundary$2d$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["METADATA_BOUNDARY_NAME"]}[\\n\\s]`);
const hasViewportRegex = new RegExp(`\\n\\s+at ${__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$framework$2f$boundary$2d$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VIEWPORT_BOUNDARY_NAME"]}[\\n\\s]`);
const hasOutletRegex = new RegExp(`\\n\\s+at ${__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$framework$2f$boundary$2d$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OUTLET_BOUNDARY_NAME"]}[\\n\\s]`);
function trackAllowedDynamicAccess(workStore, componentStack, dynamicValidation, clientDynamic) {
    if (hasOutletRegex.test(componentStack)) {
        // We don't need to track that this is dynamic. It is only so when something else is also dynamic.
        return;
    } else if (hasMetadataRegex.test(componentStack)) {
        dynamicValidation.hasDynamicMetadata = true;
        return;
    } else if (hasViewportRegex.test(componentStack)) {
        dynamicValidation.hasDynamicViewport = true;
        return;
    } else if (hasSuspenseBeforeRootLayoutWithoutBodyOrImplicitBodyRegex.test(componentStack)) {
        // For Suspense within body, the prelude wouldn't be empty so it wouldn't violate the empty static shells rule.
        // But if you have Suspense above body, the prelude is empty but we allow that because having Suspense
        // is an explicit signal from the user that they acknowledge the empty shell and want dynamic rendering.
        dynamicValidation.hasAllowedDynamic = true;
        dynamicValidation.hasSuspenseAboveBody = true;
        return;
    } else if (hasSuspenseRegex.test(componentStack)) {
        // this error had a Suspense boundary above it so we don't need to report it as a source
        // of disallowed
        dynamicValidation.hasAllowedDynamic = true;
        return;
    } else if (clientDynamic.syncDynamicErrorWithStack) {
        // This task was the task that called the sync error.
        dynamicValidation.dynamicErrors.push(clientDynamic.syncDynamicErrorWithStack);
        return;
    } else {
        const message = `Route "${workStore.route}": A component accessed data, headers, params, searchParams, or a short-lived cache without a Suspense boundary nor a "use cache" above it. See more info: https://nextjs.org/docs/messages/next-prerender-missing-suspense`;
        const error = createErrorWithComponentOrOwnerStack(message, componentStack);
        dynamicValidation.dynamicErrors.push(error);
        return;
    }
}
/**
 * In dev mode, we prefer using the owner stack, otherwise the provided
 * component stack is used.
 */ function createErrorWithComponentOrOwnerStack(message, componentStack) {
    const ownerStack = ("TURBOPACK compile-time value", "development") !== 'production' && __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].captureOwnerStack ? __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].captureOwnerStack() : null;
    const error = Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.stack = error.name + ': ' + message + (ownerStack ?? componentStack);
    return error;
}
var PreludeState = /*#__PURE__*/ function(PreludeState) {
    PreludeState[PreludeState["Full"] = 0] = "Full";
    PreludeState[PreludeState["Empty"] = 1] = "Empty";
    PreludeState[PreludeState["Errored"] = 2] = "Errored";
    return PreludeState;
}({});
function logDisallowedDynamicError(workStore, error) {
    console.error(error);
    if (!workStore.dev) {
        if (workStore.hasReadableErrorStacks) {
            console.error(`To get a more detailed stack trace and pinpoint the issue, start the app in development mode by running \`next dev\`, then open "${workStore.route}" in your browser to investigate the error.`);
        } else {
            console.error(`To get a more detailed stack trace and pinpoint the issue, try one of the following:
  - Start the app in development mode by running \`next dev\`, then open "${workStore.route}" in your browser to investigate the error.
  - Rerun the production build with \`next build --debug-prerender\` to generate better stack traces.`);
        }
    }
}
function throwIfDisallowedDynamic(workStore, prelude, dynamicValidation, serverDynamic) {
    if (serverDynamic.syncDynamicErrorWithStack) {
        logDisallowedDynamicError(workStore, serverDynamic.syncDynamicErrorWithStack);
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$static$2d$generation$2d$bailout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaticGenBailoutError"]();
    }
    if (prelude !== 0) {
        if (dynamicValidation.hasSuspenseAboveBody) {
            // This route has opted into allowing fully dynamic rendering
            // by including a Suspense boundary above the body. In this case
            // a lack of a shell is not considered disallowed so we simply return
            return;
        }
        // We didn't have any sync bailouts but there may be user code which
        // blocked the root. We would have captured these during the prerender
        // and can log them here and then terminate the build/validating render
        const dynamicErrors = dynamicValidation.dynamicErrors;
        if (dynamicErrors.length > 0) {
            for(let i = 0; i < dynamicErrors.length; i++){
                logDisallowedDynamicError(workStore, dynamicErrors[i]);
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$static$2d$generation$2d$bailout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaticGenBailoutError"]();
        }
        // If we got this far then the only other thing that could be blocking
        // the root is dynamic Viewport. If this is dynamic then
        // you need to opt into that by adding a Suspense boundary above the body
        // to indicate your are ok with fully dynamic rendering.
        if (dynamicValidation.hasDynamicViewport) {
            console.error(`Route "${workStore.route}" has a \`generateViewport\` that depends on Request data (\`cookies()\`, etc...) or uncached external data (\`fetch(...)\`, etc...) without explicitly allowing fully dynamic rendering. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-viewport`);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$static$2d$generation$2d$bailout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaticGenBailoutError"]();
        }
        if (prelude === 1) {
            // If we ever get this far then we messed up the tracking of invalid dynamic.
            // We still adhere to the constraint that you must produce a shell but invite the
            // user to report this as a bug in Next.js.
            console.error(`Route "${workStore.route}" did not produce a static shell and Next.js was unable to determine a reason. This is a bug in Next.js.`);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$static$2d$generation$2d$bailout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaticGenBailoutError"]();
        }
    } else {
        if (dynamicValidation.hasAllowedDynamic === false && dynamicValidation.hasDynamicMetadata) {
            console.error(`Route "${workStore.route}" has a \`generateMetadata\` that depends on Request data (\`cookies()\`, etc...) or uncached external data (\`fetch(...)\`, etc...) when the rest of the route does not. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-metadata`);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$static$2d$generation$2d$bailout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaticGenBailoutError"]();
        }
    }
}
function delayUntilRuntimeStage(prerenderStore, result) {
    if (prerenderStore.runtimeStagePromise) {
        return prerenderStore.runtimeStagePromise.then(()=>result);
    }
    return result;
} //# sourceMappingURL=dynamic-rendering.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/unstable-rethrow.server.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "unstable_rethrow",
    ()=>unstable_rethrow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dynamic$2d$rendering$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/dynamic-rendering-utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$lib$2f$router$2d$utils$2f$is$2d$postpone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/lib/router-utils/is-postpone.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$lazy$2d$dynamic$2f$bailout$2d$to$2d$csr$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/lazy-dynamic/bailout-to-csr.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$is$2d$next$2d$router$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/is-next-router-error.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$app$2d$render$2f$dynamic$2d$rendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/app-render/dynamic-rendering.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$hooks$2d$server$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/hooks-server-context.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
function unstable_rethrow(error) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$is$2d$next$2d$router$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNextRouterError"])(error) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$lazy$2d$dynamic$2f$bailout$2d$to$2d$csr$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBailoutToCSRError"])(error) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$hooks$2d$server$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDynamicServerError"])(error) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$app$2d$render$2f$dynamic$2d$rendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDynamicPostpone"])(error) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$lib$2f$router$2d$utils$2f$is$2d$postpone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPostpone"])(error) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dynamic$2d$rendering$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isHangingPromiseRejectionError"])(error) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$app$2d$render$2f$dynamic$2d$rendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPrerenderInterruptedError"])(error)) {
        throw error;
    }
    if (error instanceof Error && 'cause' in error) {
        unstable_rethrow(error.cause);
    }
} //# sourceMappingURL=unstable-rethrow.server.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/unstable-rethrow.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This function should be used to rethrow internal Next.js errors so that they can be handled by the framework.
 * When wrapping an API that uses errors to interrupt control flow, you should use this function before you do any error handling.
 * This function will rethrow the error if it is a Next.js error so it can be handled, otherwise it will do nothing.
 *
 * Read more: [Next.js Docs: `unstable_rethrow`](https://nextjs.org/docs/app/api-reference/functions/unstable_rethrow)
 */ __turbopack_context__.s([
    "unstable_rethrow",
    ()=>unstable_rethrow
]);
const unstable_rethrow = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/unstable-rethrow.server.js [app-ssr] (ecmascript)").unstable_rethrow : "TURBOPACK unreachable"; //# sourceMappingURL=unstable-rethrow.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/navigation.react-server.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/** @internal */ __turbopack_context__.s([
    "ReadonlyURLSearchParams",
    ()=>ReadonlyURLSearchParams,
    "unstable_isUnrecognizedActionError",
    ()=>unstable_isUnrecognizedActionError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/redirect.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/redirect-error.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$not$2d$found$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/not-found.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$forbidden$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/forbidden.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$unauthorized$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/unauthorized.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$unstable$2d$rethrow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/unstable-rethrow.js [app-ssr] (ecmascript)");
class ReadonlyURLSearchParamsError extends Error {
    constructor(){
        super('Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams');
    }
}
class ReadonlyURLSearchParams extends URLSearchParams {
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ append() {
        throw new ReadonlyURLSearchParamsError();
    }
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ delete() {
        throw new ReadonlyURLSearchParamsError();
    }
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ set() {
        throw new ReadonlyURLSearchParamsError();
    }
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ sort() {
        throw new ReadonlyURLSearchParamsError();
    }
}
function unstable_isUnrecognizedActionError() {
    throw Object.defineProperty(new Error('`unstable_isUnrecognizedActionError` can only be used on the client.'), "__NEXT_ERROR_CODE", {
        value: "E776",
        enumerable: false,
        configurable: true
    });
}
;
;
;
;
;
;
;
 //# sourceMappingURL=navigation.react-server.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/unrecognized-action-error.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UnrecognizedActionError",
    ()=>UnrecognizedActionError,
    "unstable_isUnrecognizedActionError",
    ()=>unstable_isUnrecognizedActionError
]);
class UnrecognizedActionError extends Error {
    constructor(...args){
        super(...args);
        this.name = 'UnrecognizedActionError';
    }
}
function unstable_isUnrecognizedActionError(error) {
    return !!(error && typeof error === 'object' && error instanceof UnrecognizedActionError);
} //# sourceMappingURL=unrecognized-action-error.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/navigation.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useParams",
    ()=>useParams,
    "usePathname",
    ()=>usePathname,
    "useRouter",
    ()=>useRouter,
    "useSearchParams",
    ()=>useSearchParams,
    "useSelectedLayoutSegment",
    ()=>useSelectedLayoutSegment,
    "useSelectedLayoutSegments",
    ()=>useSelectedLayoutSegments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/app-router-context.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$hooks$2d$client$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/hooks-client-context.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$reducers$2f$get$2d$segment$2d$value$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/router-reducer/reducers/get-segment-value.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/segment.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/navigation.react-server.js [app-ssr] (ecmascript) <locals>");
// Client components API
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$server$2d$inserted$2d$html$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/server-inserted-html.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$unrecognized$2d$action$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/unrecognized-action-error.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
const useDynamicRouteParams = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/app-render/dynamic-rendering.js [app-ssr] (ecmascript)").useDynamicRouteParams : "TURBOPACK unreachable";
const useDynamicSearchParams = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/app-render/dynamic-rendering.js [app-ssr] (ecmascript)").useDynamicSearchParams : "TURBOPACK unreachable";
function useSearchParams() {
    useDynamicSearchParams?.('useSearchParams()');
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$hooks$2d$client$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SearchParamsContext"]);
    // In the case where this is `null`, the compat types added in
    // `next-env.d.ts` will add a new overload that changes the return type to
    // include `null`.
    const readonlySearchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!searchParams) {
            // When the router is not ready in pages, we won't have the search params
            // available.
            return null;
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ReadonlyURLSearchParams"](searchParams);
    }, [
        searchParams
    ]);
    return readonlySearchParams;
}
function usePathname() {
    useDynamicRouteParams?.('usePathname()');
    // In the case where this is `null`, the compat types added in `next-env.d.ts`
    // will add a new overload that changes the return type to include `null`.
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$hooks$2d$client$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PathnameContext"]);
}
;
function useRouter() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppRouterContext"]);
    if (router === null) {
        throw Object.defineProperty(new Error('invariant expected app router to be mounted'), "__NEXT_ERROR_CODE", {
            value: "E238",
            enumerable: false,
            configurable: true
        });
    }
    return router;
}
function useParams() {
    useDynamicRouteParams?.('useParams()');
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$hooks$2d$client$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PathParamsContext"]);
}
/** Get the canonical parameters from the current level to the leaf node. */ // Client components API
function getSelectedLayoutSegmentPath(tree, parallelRouteKey, first = true, segmentPath = []) {
    let node;
    if (first) {
        // Use the provided parallel route key on the first parallel route
        node = tree[1][parallelRouteKey];
    } else {
        // After first parallel route prefer children, if there's no children pick the first parallel route.
        const parallelRoutes = tree[1];
        node = parallelRoutes.children ?? Object.values(parallelRoutes)[0];
    }
    if (!node) return segmentPath;
    const segment = node[0];
    let segmentValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$reducers$2f$get$2d$segment$2d$value$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSegmentValue"])(segment);
    if (!segmentValue || segmentValue.startsWith(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PAGE_SEGMENT_KEY"])) {
        return segmentPath;
    }
    segmentPath.push(segmentValue);
    return getSelectedLayoutSegmentPath(node, parallelRouteKey, false, segmentPath);
}
function useSelectedLayoutSegments(parallelRouteKey = 'children') {
    useDynamicRouteParams?.('useSelectedLayoutSegments()');
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LayoutRouterContext"]);
    // @ts-expect-error This only happens in `pages`. Type is overwritten in navigation.d.ts
    if (!context) return null;
    return getSelectedLayoutSegmentPath(context.parentTree, parallelRouteKey);
}
function useSelectedLayoutSegment(parallelRouteKey = 'children') {
    useDynamicRouteParams?.('useSelectedLayoutSegment()');
    const selectedLayoutSegments = useSelectedLayoutSegments(parallelRouteKey);
    if (!selectedLayoutSegments || selectedLayoutSegments.length === 0) {
        return null;
    }
    const selectedLayoutSegment = parallelRouteKey === 'children' ? selectedLayoutSegments[0] : selectedLayoutSegments[selectedLayoutSegments.length - 1];
    // if the default slot is showing, we return null since it's not technically "selected" (it's a fallback)
    // and returning an internal value like `__DEFAULT__` would be confusing.
    return selectedLayoutSegment === __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_SEGMENT_KEY"] ? null : selectedLayoutSegment;
}
;
;
 //# sourceMappingURL=navigation.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/redirect-boundary.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RedirectBoundary",
    ()=>RedirectBoundary,
    "RedirectErrorBoundary",
    ()=>RedirectErrorBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/navigation.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/redirect.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/redirect-error.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function HandleRedirect({ redirect, reset, redirectType }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].startTransition(()=>{
            if (redirectType === __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RedirectType"].push) {
                router.push(redirect, {});
            } else {
                router.replace(redirect, {});
            }
            reset();
        });
    }, [
        redirect,
        redirectType,
        reset,
        router
    ]);
    return null;
}
class RedirectErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: null,
            redirectType: null
        };
    }
    static getDerivedStateFromError(error) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRedirectError"])(error)) {
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getURLFromRedirectError"])(error);
            const redirectType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRedirectTypeFromError"])(error);
            return {
                redirect: url,
                redirectType
            };
        }
        // Re-throw if error is not for redirect
        throw error;
    }
    // Explicit type is needed to avoid the generated `.d.ts` having a wide return type that could be specific to the `@types/react` version.
    render() {
        const { redirect, redirectType } = this.state;
        if (redirect !== null && redirectType !== null) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(HandleRedirect, {
                redirect: redirect,
                redirectType: redirectType,
                reset: ()=>this.setState({
                        redirect: null
                    })
            });
        }
        return this.props.children;
    }
}
function RedirectBoundary({ children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useRouter"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(RedirectErrorBoundary, {
        router: router,
        children: children
    });
} //# sourceMappingURL=redirect-boundary.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/http-access-fallback/error-boundary.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HTTPAccessFallbackBoundary",
    ()=>HTTPAccessFallbackBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
/**
 * HTTPAccessFallbackBoundary is a boundary that catches errors and renders a
 * fallback component for HTTP errors.
 *
 * It receives the status code, and determine if it should render fallbacks for few HTTP 4xx errors.
 *
 * e.g. 404
 * 404 represents not found, and the fallback component pair contains the component and its styles.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$navigation$2d$untracked$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/navigation-untracked.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/http-access-fallback/http-access-fallback.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$warn$2d$once$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/utils/warn-once.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/app-router-context.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
class HTTPAccessFallbackErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Component {
    constructor(props){
        super(props);
        this.state = {
            triggeredStatus: undefined,
            previousPathname: props.pathname
        };
    }
    componentDidCatch() {
        if (("TURBOPACK compile-time value", "development") === 'development' && this.props.missingSlots && this.props.missingSlots.size > 0 && // A missing children slot is the typical not-found case, so no need to warn
        !this.props.missingSlots.has('children')) {
            let warningMessage = 'No default component was found for a parallel route rendered on this page. Falling back to nearest NotFound boundary.\n' + 'Learn more: https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#defaultjs\n\n';
            const formattedSlots = Array.from(this.props.missingSlots).sort((a, b)=>a.localeCompare(b)).map((slot)=>`@${slot}`).join(', ');
            warningMessage += 'Missing slots: ' + formattedSlots;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$warn$2d$once$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warnOnce"])(warningMessage);
        }
    }
    static getDerivedStateFromError(error) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isHTTPAccessFallbackError"])(error)) {
            const httpStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAccessFallbackHTTPStatus"])(error);
            return {
                triggeredStatus: httpStatus
            };
        }
        // Re-throw if error is not for 404
        throw error;
    }
    static getDerivedStateFromProps(props, state) {
        /**
     * Handles reset of the error boundary when a navigation happens.
     * Ensures the error boundary does not stay enabled when navigating to a new page.
     * Approach of setState in render is safe as it checks the previous pathname and then overrides
     * it as outlined in https://react.dev/reference/react/useState#storing-information-from-previous-renders
     */ if (props.pathname !== state.previousPathname && state.triggeredStatus) {
            return {
                triggeredStatus: undefined,
                previousPathname: props.pathname
            };
        }
        return {
            triggeredStatus: state.triggeredStatus,
            previousPathname: props.pathname
        };
    }
    render() {
        const { notFound, forbidden, unauthorized, children } = this.props;
        const { triggeredStatus } = this.state;
        const errorComponents = {
            [__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HTTPAccessErrorStatus"].NOT_FOUND]: notFound,
            [__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HTTPAccessErrorStatus"].FORBIDDEN]: forbidden,
            [__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HTTPAccessErrorStatus"].UNAUTHORIZED]: unauthorized
        };
        if (triggeredStatus) {
            const isNotFound = triggeredStatus === __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HTTPAccessErrorStatus"].NOT_FOUND && notFound;
            const isForbidden = triggeredStatus === __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HTTPAccessErrorStatus"].FORBIDDEN && forbidden;
            const isUnauthorized = triggeredStatus === __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HTTPAccessErrorStatus"].UNAUTHORIZED && unauthorized;
            // If there's no matched boundary in this layer, keep throwing the error by rendering the children
            if (!(isNotFound || isForbidden || isUnauthorized)) {
                return children;
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("meta", {
                        name: "robots",
                        content: "noindex"
                    }),
                    ("TURBOPACK compile-time value", "development") === 'development' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("meta", {
                        name: "boundary-next-error",
                        content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAccessFallbackErrorTypeByStatus"])(triggeredStatus)
                    }),
                    errorComponents[triggeredStatus]
                ]
            });
        }
        return children;
    }
}
function HTTPAccessFallbackBoundary({ notFound, forbidden, unauthorized, children }) {
    // When we're rendering the missing params shell, this will return null. This
    // is because we won't be rendering any not found boundaries or error
    // boundaries for the missing params shell. When this runs on the client
    // (where these error can occur), we will get the correct pathname.
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$navigation$2d$untracked$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUntrackedPathname"])();
    const missingSlots = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MissingSlotContext"]);
    const hasErrorFallback = !!(notFound || forbidden || unauthorized);
    if (hasErrorFallback) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(HTTPAccessFallbackErrorBoundary, {
            pathname: pathname,
            notFound: notFound,
            forbidden: forbidden,
            unauthorized: unauthorized,
            missingSlots: missingSlots,
            children: children
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    });
} //# sourceMappingURL=error-boundary.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/router-reducer/create-router-cache-key.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createRouterCacheKey",
    ()=>createRouterCacheKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/segment.js [app-ssr] (ecmascript)");
;
function createRouterCacheKey(segment, withoutSearchParameters = false) {
    // if the segment is an array, it means it's a dynamic segment
    // for example, ['lang', 'en', 'd']. We need to convert it to a string to store it as a cache node key.
    if (Array.isArray(segment)) {
        return `${segment[0]}|${segment[1]}|${segment[2]}`;
    }
    // Page segments might have search parameters, ie __PAGE__?foo=bar
    // When `withoutSearchParameters` is true, we only want to return the page segment
    if (withoutSearchParameters && segment.startsWith(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PAGE_SEGMENT_KEY"])) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PAGE_SEGMENT_KEY"];
    }
    return segment;
} //# sourceMappingURL=create-router-cache-key.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/page-path/ensure-leading-slash.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * For a given page path, this function ensures that there is a leading slash.
 * If there is not a leading slash, one is added, otherwise it is noop.
 */ __turbopack_context__.s([
    "ensureLeadingSlash",
    ()=>ensureLeadingSlash
]);
function ensureLeadingSlash(path) {
    return path.startsWith('/') ? path : `/${path}`;
} //# sourceMappingURL=ensure-leading-slash.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/router/utils/app-paths.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalizeAppPath",
    ()=>normalizeAppPath,
    "normalizeRscURL",
    ()=>normalizeRscURL
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$page$2d$path$2f$ensure$2d$leading$2d$slash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/page-path/ensure-leading-slash.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/segment.js [app-ssr] (ecmascript)");
;
;
function normalizeAppPath(route) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$page$2d$path$2f$ensure$2d$leading$2d$slash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ensureLeadingSlash"])(route.split('/').reduce((pathname, segment, index, segments)=>{
        // Empty segments are ignored.
        if (!segment) {
            return pathname;
        }
        // Groups are ignored.
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$segment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isGroupSegment"])(segment)) {
            return pathname;
        }
        // Parallel segments are ignored.
        if (segment[0] === '@') {
            return pathname;
        }
        // The last segment (if it's a leaf) should be ignored.
        if ((segment === 'page' || segment === 'route') && index === segments.length - 1) {
            return pathname;
        }
        return `${pathname}/${segment}`;
    }, ''));
}
function normalizeRscURL(url) {
    return url.replace(/\.rsc($|\?)/, '$1');
} //# sourceMappingURL=app-paths.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/router/utils/interception-routes.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "INTERCEPTION_ROUTE_MARKERS",
    ()=>INTERCEPTION_ROUTE_MARKERS,
    "extractInterceptionRouteInformation",
    ()=>extractInterceptionRouteInformation,
    "isInterceptionRouteAppPath",
    ()=>isInterceptionRouteAppPath
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$router$2f$utils$2f$app$2d$paths$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/router/utils/app-paths.js [app-ssr] (ecmascript)");
;
const INTERCEPTION_ROUTE_MARKERS = [
    '(..)(..)',
    '(.)',
    '(..)',
    '(...)'
];
function isInterceptionRouteAppPath(path) {
    // TODO-APP: add more serious validation
    return path.split('/').find((segment)=>INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m))) !== undefined;
}
function extractInterceptionRouteInformation(path) {
    let interceptingRoute, marker, interceptedRoute;
    for (const segment of path.split('/')){
        marker = INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m));
        if (marker) {
            ;
            [interceptingRoute, interceptedRoute] = path.split(marker, 2);
            break;
        }
    }
    if (!interceptingRoute || !marker || !interceptedRoute) {
        throw Object.defineProperty(new Error(`Invalid interception route: ${path}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`), "__NEXT_ERROR_CODE", {
            value: "E269",
            enumerable: false,
            configurable: true
        });
    }
    interceptingRoute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$router$2f$utils$2f$app$2d$paths$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeAppPath"])(interceptingRoute) // normalize the path, e.g. /(blog)/feed -> /feed
    ;
    switch(marker){
        case '(.)':
            // (.) indicates that we should match with sibling routes, so we just need to append the intercepted route to the intercepting route
            if (interceptingRoute === '/') {
                interceptedRoute = `/${interceptedRoute}`;
            } else {
                interceptedRoute = interceptingRoute + '/' + interceptedRoute;
            }
            break;
        case '(..)':
            // (..) indicates that we should match at one level up, so we need to remove the last segment of the intercepting route
            if (interceptingRoute === '/') {
                throw Object.defineProperty(new Error(`Invalid interception route: ${path}. Cannot use (..) marker at the root level, use (.) instead.`), "__NEXT_ERROR_CODE", {
                    value: "E207",
                    enumerable: false,
                    configurable: true
                });
            }
            interceptedRoute = interceptingRoute.split('/').slice(0, -1).concat(interceptedRoute).join('/');
            break;
        case '(...)':
            // (...) will match the route segment in the root directory, so we need to use the root directory to prepend the intercepted route
            interceptedRoute = '/' + interceptedRoute;
            break;
        case '(..)(..)':
            // (..)(..) indicates that we should match at two levels up, so we need to remove the last two segments of the intercepting route
            const splitInterceptingRoute = interceptingRoute.split('/');
            if (splitInterceptingRoute.length <= 2) {
                throw Object.defineProperty(new Error(`Invalid interception route: ${path}. Cannot use (..)(..) marker at the root level or one level up.`), "__NEXT_ERROR_CODE", {
                    value: "E486",
                    enumerable: false,
                    configurable: true
                });
            }
            interceptedRoute = splitInterceptingRoute.slice(0, -2).concat(interceptedRoute).join('/');
            break;
        default:
            throw Object.defineProperty(new Error('Invariant: unexpected marker'), "__NEXT_ERROR_CODE", {
                value: "E112",
                enumerable: false,
                configurable: true
            });
    }
    return {
        interceptingRoute,
        interceptedRoute
    };
} //# sourceMappingURL=interception-routes.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/router-reducer/reducers/has-interception-route-in-current-tree.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasInterceptionRouteInCurrentTree",
    ()=>hasInterceptionRouteInCurrentTree
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$router$2f$utils$2f$interception$2d$routes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/router/utils/interception-routes.js [app-ssr] (ecmascript)");
;
function hasInterceptionRouteInCurrentTree([segment, parallelRoutes]) {
    // If we have a dynamic segment, it's marked as an interception route by the presence of the `i` suffix.
    if (Array.isArray(segment) && (segment[2] === 'di' || segment[2] === 'ci')) {
        return true;
    }
    // If segment is not an array, apply the existing string-based check
    if (typeof segment === 'string' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$router$2f$utils$2f$interception$2d$routes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isInterceptionRouteAppPath"])(segment)) {
        return true;
    }
    // Iterate through parallelRoutes if they exist
    if (parallelRoutes) {
        for(const key in parallelRoutes){
            if (hasInterceptionRouteInCurrentTree(parallelRoutes[key])) {
                return true;
            }
        }
    }
    return false;
} //# sourceMappingURL=has-interception-route-in-current-tree.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/bfcache.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useRouterBFCache",
    ()=>useRouterBFCache
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
// When the flag is disabled, only track the currently active tree
const MAX_BF_CACHE_ENTRIES = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 1;
function useRouterBFCache(activeTree, activeStateKey) {
    // The currently active entry. The entries form a linked list, sorted in
    // order of most recently active. This allows us to reuse parts of the list
    // without cloning, unless there's a reordering or removal.
    // TODO: Once we start tracking back/forward history at each route level,
    // we should use the history order instead. In other words, when traversing
    // to an existing entry as a result of a popstate event, we should maintain
    // the existing order instead of moving it to the front of the list. I think
    // an initial implementation of this could be to pass an incrementing id
    // to history.pushState/replaceState, then use that here for ordering.
    const [prevActiveEntry, setPrevActiveEntry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        const initialEntry = {
            tree: activeTree,
            stateKey: activeStateKey,
            next: null
        };
        return initialEntry;
    });
    if (prevActiveEntry.tree === activeTree) {
        // Fast path. The active tree hasn't changed, so we can reuse the
        // existing state.
        return prevActiveEntry;
    }
    // The route tree changed. Note that this doesn't mean that the tree changed
    // *at this level* — the change may be due to a child route. Either way, we
    // need to either add or update the router tree in the bfcache.
    //
    // The rest of the code looks more complicated than it actually is because we
    // can't mutate the state in place; we have to copy-on-write.
    // Create a new entry for the active cache key. This is the head of the new
    // linked list.
    const newActiveEntry = {
        tree: activeTree,
        stateKey: activeStateKey,
        next: null
    };
    // We need to append the old list onto the new list. If the head of the new
    // list was already present in the cache, then we'll need to clone everything
    // that came before it. Then we can reuse the rest.
    let n = 1;
    let oldEntry = prevActiveEntry;
    let clonedEntry = newActiveEntry;
    while(oldEntry !== null && n < MAX_BF_CACHE_ENTRIES){
        if (oldEntry.stateKey === activeStateKey) {
            // Fast path. This entry in the old list that corresponds to the key that
            // is now active. We've already placed a clone of this entry at the front
            // of the new list. We can reuse the rest of the old list without cloning.
            // NOTE: We don't need to worry about eviction in this case because we
            // haven't increased the size of the cache, and we assume the max size
            // is constant across renders. If we were to change it to a dynamic limit,
            // then the implementation would need to account for that.
            clonedEntry.next = oldEntry.next;
            break;
        } else {
            // Clone the entry and append it to the list.
            n++;
            const entry = {
                tree: oldEntry.tree,
                stateKey: oldEntry.stateKey,
                next: null
            };
            clonedEntry.next = entry;
            clonedEntry = entry;
        }
        oldEntry = oldEntry.next;
    }
    setPrevActiveEntry(newActiveEntry);
    return newActiveEntry;
} //# sourceMappingURL=bfcache.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/next-devtools/userspace/app/segment-explorer-node.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SEGMENT_EXPLORER_SIMULATED_ERROR_MESSAGE",
    ()=>SEGMENT_EXPLORER_SIMULATED_ERROR_MESSAGE,
    "SegmentBoundaryTriggerNode",
    ()=>SegmentBoundaryTriggerNode,
    "SegmentStateProvider",
    ()=>SegmentStateProvider,
    "SegmentViewNode",
    ()=>SegmentViewNode,
    "SegmentViewStateNode",
    ()=>SegmentViewStateNode,
    "useSegmentState",
    ()=>useSegmentState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$next$2d$devtools$2f$dev$2d$overlay$2e$shim$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/next-devtools/dev-overlay.shim.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$not$2d$found$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/not-found.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const SEGMENT_EXPLORER_SIMULATED_ERROR_MESSAGE = 'NEXT_DEVTOOLS_SIMULATED_ERROR';
function SegmentTrieNode({ type, pagePath }) {
    const { boundaryType, setBoundaryType } = useSegmentState();
    const nodeState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return {
            type,
            pagePath,
            boundaryType,
            setBoundaryType
        };
    }, [
        type,
        pagePath,
        boundaryType,
        setBoundaryType
    ]);
    // Use `useLayoutEffect` to ensure the state is updated during suspense.
    // `useEffect` won't work as the state is preserved during suspense.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$next$2d$devtools$2f$dev$2d$overlay$2e$shim$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dispatcher"].segmentExplorerNodeAdd(nodeState);
        return ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$next$2d$devtools$2f$dev$2d$overlay$2e$shim$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dispatcher"].segmentExplorerNodeRemove(nodeState);
        };
    }, [
        nodeState
    ]);
    return null;
}
function NotFoundSegmentNode() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$not$2d$found$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notFound"])();
}
function ErrorSegmentNode() {
    throw Object.defineProperty(new Error(SEGMENT_EXPLORER_SIMULATED_ERROR_MESSAGE), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
}
const forever = new Promise(()=>{});
function LoadingSegmentNode() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"])(forever);
    return null;
}
function SegmentViewStateNode({ page }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$next$2d$devtools$2f$dev$2d$overlay$2e$shim$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dispatcher"].segmentExplorerUpdateRouteState(page);
        return ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$next$2d$devtools$2f$dev$2d$overlay$2e$shim$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dispatcher"].segmentExplorerUpdateRouteState('');
        };
    }, [
        page
    ]);
    return null;
}
function SegmentBoundaryTriggerNode() {
    const { boundaryType } = useSegmentState();
    let segmentNode = null;
    if (boundaryType === 'loading') {
        segmentNode = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(LoadingSegmentNode, {});
    } else if (boundaryType === 'not-found') {
        segmentNode = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(NotFoundSegmentNode, {});
    } else if (boundaryType === 'error') {
        segmentNode = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ErrorSegmentNode, {});
    }
    return segmentNode;
}
function SegmentViewNode({ type, pagePath, children }) {
    const segmentNode = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(SegmentTrieNode, {
        type: type,
        pagePath: pagePath
    }, type);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            segmentNode,
            children
        ]
    });
}
const SegmentStateContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])({
    boundaryType: null,
    setBoundaryType: ()=>{}
});
function SegmentStateProvider({ children }) {
    const [boundaryType, setBoundaryType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [errorBoundaryKey, setErrorBoundaryKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const reloadBoundary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setErrorBoundaryKey((prev)=>prev + 1), []);
    const setBoundaryTypeAndReload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((type)=>{
        if (type === null) {
            reloadBoundary();
        }
        setBoundaryType(type);
    }, [
        reloadBoundary
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(SegmentStateContext.Provider, {
        value: {
            boundaryType,
            setBoundaryType: setBoundaryTypeAndReload
        },
        children: children
    }, errorBoundaryKey);
}
function useSegmentState() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(SegmentStateContext);
} //# sourceMappingURL=segment-explorer-node.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/layout-router.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OuterLayoutRouter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$router$2d$reducer$2d$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/router-reducer/router-reducer-types.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/app-router-context.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$fetch$2d$server$2d$response$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/router-reducer/fetch-server-response.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$unresolved$2d$thenable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/unresolved-thenable.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$error$2d$boundary$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/error-boundary.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$match$2d$segments$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/match-segments.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$router$2f$utils$2f$disable$2d$smooth$2d$scroll$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/router/utils/disable-smooth-scroll.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$boundary$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/redirect-boundary.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$error$2d$boundary$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/http-access-fallback/error-boundary.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$create$2d$router$2d$cache$2d$key$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/router-reducer/create-router-cache-key.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$reducers$2f$has$2d$interception$2d$route$2d$in$2d$current$2d$tree$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/router-reducer/reducers/has-interception-route-in-current-tree.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$use$2d$action$2d$queue$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/use-action-queue.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$bfcache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/bfcache.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$router$2f$utils$2f$app$2d$paths$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/router/utils/app-paths.js [app-ssr] (ecmascript)");
'use client';
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
;
;
;
;
/**
 * Add refetch marker to router state at the point of the current layout segment.
 * This ensures the response returned is not further down than the current layout segment.
 */ function walkAddRefetch(segmentPathToWalk, treeToRecreate) {
    if (segmentPathToWalk) {
        const [segment, parallelRouteKey] = segmentPathToWalk;
        const isLast = segmentPathToWalk.length === 2;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$match$2d$segments$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchSegment"])(treeToRecreate[0], segment)) {
            if (treeToRecreate[1].hasOwnProperty(parallelRouteKey)) {
                if (isLast) {
                    const subTree = walkAddRefetch(undefined, treeToRecreate[1][parallelRouteKey]);
                    return [
                        treeToRecreate[0],
                        {
                            ...treeToRecreate[1],
                            [parallelRouteKey]: [
                                subTree[0],
                                subTree[1],
                                subTree[2],
                                'refetch'
                            ]
                        }
                    ];
                }
                return [
                    treeToRecreate[0],
                    {
                        ...treeToRecreate[1],
                        [parallelRouteKey]: walkAddRefetch(segmentPathToWalk.slice(2), treeToRecreate[1][parallelRouteKey])
                    }
                ];
            }
        }
    }
    return treeToRecreate;
}
const __DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
// TODO-APP: Replace with new React API for finding dom nodes without a `ref` when available
/**
 * Wraps ReactDOM.findDOMNode with additional logic to hide React Strict Mode warning
 */ function findDOMNode(instance) {
    // Tree-shake for server bundle
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    // __DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.findDOMNode is null during module init.
    // We need to lazily reference it.
    const internal_reactDOMfindDOMNode = undefined;
}
const rectProperties = [
    'bottom',
    'height',
    'left',
    'right',
    'top',
    'width',
    'x',
    'y'
];
/**
 * Check if a HTMLElement is hidden or fixed/sticky position
 */ function shouldSkipElement(element) {
    // we ignore fixed or sticky positioned elements since they'll likely pass the "in-viewport" check
    // and will result in a situation we bail on scroll because of something like a fixed nav,
    // even though the actual page content is offscreen
    if ([
        'sticky',
        'fixed'
    ].includes(getComputedStyle(element).position)) {
        if ("TURBOPACK compile-time truthy", 1) {
            console.warn('Skipping auto-scroll behavior due to `position: sticky` or `position: fixed` on element:', element);
        }
        return true;
    }
    // Uses `getBoundingClientRect` to check if the element is hidden instead of `offsetParent`
    // because `offsetParent` doesn't consider document/body
    const rect = element.getBoundingClientRect();
    return rectProperties.every((item)=>rect[item] === 0);
}
/**
 * Check if the top corner of the HTMLElement is in the viewport.
 */ function topOfElementInViewport(element, viewportHeight) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.top <= viewportHeight;
}
/**
 * Find the DOM node for a hash fragment.
 * If `top` the page has to scroll to the top of the page. This mirrors the browser's behavior.
 * If the hash fragment is an id, the page has to scroll to the element with that id.
 * If the hash fragment is a name, the page has to scroll to the first element with that name.
 */ function getHashFragmentDomNode(hashFragment) {
    // If the hash fragment is `top` the page has to scroll to the top of the page.
    if (hashFragment === 'top') {
        return document.body;
    }
    // If the hash fragment is an id, the page has to scroll to the element with that id.
    return document.getElementById(hashFragment) ?? // If the hash fragment is a name, the page has to scroll to the first element with that name.
    document.getElementsByName(hashFragment)[0];
}
class InnerScrollAndFocusHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Component {
    componentDidMount() {
        this.handlePotentialScroll();
    }
    componentDidUpdate() {
        // Because this property is overwritten in handlePotentialScroll it's fine to always run it when true as it'll be set to false for subsequent renders.
        if (this.props.focusAndScrollRef.apply) {
            this.handlePotentialScroll();
        }
    }
    render() {
        return this.props.children;
    }
    constructor(...args){
        super(...args), this.handlePotentialScroll = ()=>{
            // Handle scroll and focus, it's only applied once in the first useEffect that triggers that changed.
            const { focusAndScrollRef, segmentPath } = this.props;
            if (focusAndScrollRef.apply) {
                // segmentPaths is an array of segment paths that should be scrolled to
                // if the current segment path is not in the array, the scroll is not applied
                // unless the array is empty, in which case the scroll is always applied
                if (focusAndScrollRef.segmentPaths.length !== 0 && !focusAndScrollRef.segmentPaths.some((scrollRefSegmentPath)=>segmentPath.every((segment, index)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$match$2d$segments$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchSegment"])(segment, scrollRefSegmentPath[index])))) {
                    return;
                }
                let domNode = null;
                const hashFragment = focusAndScrollRef.hashFragment;
                if (hashFragment) {
                    domNode = getHashFragmentDomNode(hashFragment);
                }
                // `findDOMNode` is tricky because it returns just the first child if the component is a fragment.
                // This already caused a bug where the first child was a <link/> in head.
                if (!domNode) {
                    domNode = findDOMNode(this);
                }
                // If there is no DOM node this layout-router level is skipped. It'll be handled higher-up in the tree.
                if (!(domNode instanceof Element)) {
                    return;
                }
                // Verify if the element is a HTMLElement and if we want to consider it for scroll behavior.
                // If the element is skipped, try to select the next sibling and try again.
                while(!(domNode instanceof HTMLElement) || shouldSkipElement(domNode)){
                    if ("TURBOPACK compile-time truthy", 1) {
                        if (domNode.parentElement?.localName === 'head') {
                        // TODO: We enter this state when metadata was rendered as part of the page or via Next.js.
                        // This is always a bug in Next.js and caused by React hoisting metadata.
                        // We need to replace `findDOMNode` in favor of Fragment Refs (when available) so that we can skip over metadata.
                        }
                    }
                    // No siblings found that match the criteria are found, so handle scroll higher up in the tree instead.
                    if (domNode.nextElementSibling === null) {
                        return;
                    }
                    domNode = domNode.nextElementSibling;
                }
                // State is mutated to ensure that the focus and scroll is applied only once.
                focusAndScrollRef.apply = false;
                focusAndScrollRef.hashFragment = null;
                focusAndScrollRef.segmentPaths = [];
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$router$2f$utils$2f$disable$2d$smooth$2d$scroll$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["disableSmoothScrollDuringRouteTransition"])(()=>{
                    // In case of hash scroll, we only need to scroll the element into view
                    if (hashFragment) {
                        ;
                        domNode.scrollIntoView();
                        return;
                    }
                    // Store the current viewport height because reading `clientHeight` causes a reflow,
                    // and it won't change during this function.
                    const htmlElement = document.documentElement;
                    const viewportHeight = htmlElement.clientHeight;
                    // If the element's top edge is already in the viewport, exit early.
                    if (topOfElementInViewport(domNode, viewportHeight)) {
                        return;
                    }
                    // Otherwise, try scrolling go the top of the document to be backward compatible with pages
                    // scrollIntoView() called on `<html/>` element scrolls horizontally on chrome and firefox (that shouldn't happen)
                    // We could use it to scroll horizontally following RTL but that also seems to be broken - it will always scroll left
                    // scrollLeft = 0 also seems to ignore RTL and manually checking for RTL is too much hassle so we will scroll just vertically
                    htmlElement.scrollTop = 0;
                    // Scroll to domNode if domNode is not in viewport when scrolled to top of document
                    if (!topOfElementInViewport(domNode, viewportHeight)) {
                        // Scroll into view doesn't scroll horizontally by default when not needed
                        ;
                        domNode.scrollIntoView();
                    }
                }, {
                    // We will force layout by querying domNode position
                    dontForceLayout: true,
                    onlyHashChange: focusAndScrollRef.onlyHashChange
                });
                // Mutate after scrolling so that it can be read by `disableSmoothScrollDuringRouteTransition`
                focusAndScrollRef.onlyHashChange = false;
                // Set focus on the element
                domNode.focus();
            }
        };
    }
}
function ScrollAndFocusHandler({ segmentPath, children }) {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GlobalLayoutRouterContext"]);
    if (!context) {
        throw Object.defineProperty(new Error('invariant global layout router not mounted'), "__NEXT_ERROR_CODE", {
            value: "E473",
            enumerable: false,
            configurable: true
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(InnerScrollAndFocusHandler, {
        segmentPath: segmentPath,
        focusAndScrollRef: context.focusAndScrollRef,
        children: children
    });
}
/**
 * InnerLayoutRouter handles rendering the provided segment based on the cache.
 */ function InnerLayoutRouter({ tree, segmentPath, cacheNode, url }) {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GlobalLayoutRouterContext"]);
    if (!context) {
        throw Object.defineProperty(new Error('invariant global layout router not mounted'), "__NEXT_ERROR_CODE", {
            value: "E473",
            enumerable: false,
            configurable: true
        });
    }
    const { tree: fullTree } = context;
    // `rsc` represents the renderable node for this segment.
    // If this segment has a `prefetchRsc`, it's the statically prefetched data.
    // We should use that on initial render instead of `rsc`. Then we'll switch
    // to `rsc` when the dynamic response streams in.
    //
    // If no prefetch data is available, then we go straight to rendering `rsc`.
    const resolvedPrefetchRsc = cacheNode.prefetchRsc !== null ? cacheNode.prefetchRsc : cacheNode.rsc;
    // We use `useDeferredValue` to handle switching between the prefetched and
    // final values. The second argument is returned on initial render, then it
    // re-renders with the first argument.
    const rsc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDeferredValue"])(cacheNode.rsc, resolvedPrefetchRsc);
    // `rsc` is either a React node or a promise for a React node, except we
    // special case `null` to represent that this segment's data is missing. If
    // it's a promise, we need to unwrap it so we can determine whether or not the
    // data is missing.
    const resolvedRsc = typeof rsc === 'object' && rsc !== null && typeof rsc.then === 'function' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"])(rsc) : rsc;
    if (!resolvedRsc) {
        // The data for this segment is not available, and there's no pending
        // navigation that will be able to fulfill it. We need to fetch more from
        // the server and patch the cache.
        // Check if there's already a pending request.
        let lazyData = cacheNode.lazyData;
        if (lazyData === null) {
            /**
       * Router state with refetch marker added
       */ // TODO-APP: remove ''
            const refetchTree = walkAddRefetch([
                '',
                ...segmentPath
            ], fullTree);
            const includeNextUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$reducers$2f$has$2d$interception$2d$route$2d$in$2d$current$2d$tree$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasInterceptionRouteInCurrentTree"])(fullTree);
            const navigatedAt = Date.now();
            cacheNode.lazyData = lazyData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$fetch$2d$server$2d$response$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchServerResponse"])(new URL(url, location.origin), {
                flightRouterState: refetchTree,
                nextUrl: includeNextUrl ? context.nextUrl : null
            }).then((serverResponse)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startTransition"])(()=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$use$2d$action$2d$queue$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dispatchAppRouterAction"])({
                        type: __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$router$2d$reducer$2d$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ACTION_SERVER_PATCH"],
                        previousTree: fullTree,
                        serverResponse,
                        navigatedAt
                    });
                });
                return serverResponse;
            });
            // Suspend while waiting for lazyData to resolve
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"])(lazyData);
        }
        // Suspend infinitely as `changeByServerResponse` will cause a different part of the tree to be rendered.
        // A falsey `resolvedRsc` indicates missing data -- we should not commit that branch, and we need to wait for the data to arrive.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$unresolved$2d$thenable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unresolvedThenable"]);
    }
    // If we get to this point, then we know we have something we can render.
    const subtree = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LayoutRouterContext"].Provider, {
        value: {
            parentTree: tree,
            parentCacheNode: cacheNode,
            parentSegmentPath: segmentPath,
            // TODO-APP: overriding of url for parallel routes
            url: url
        },
        children: resolvedRsc
    });
    // Ensure root layout is not wrapped in a div as the root layout renders `<html>`
    return subtree;
}
/**
 * Renders suspense boundary with the provided "loading" property as the fallback.
 * If no loading property is provided it renders the children without a suspense boundary.
 */ function LoadingBoundary({ loading, children }) {
    // If loading is a promise, unwrap it. This happens in cases where we haven't
    // yet received the loading data from the server — which includes whether or
    // not this layout has a loading component at all.
    //
    // It's OK to suspend here instead of inside the fallback because this
    // promise will resolve simultaneously with the data for the segment itself.
    // So it will never suspend for longer than it would have if we didn't use
    // a Suspense fallback at all.
    let loadingModuleData;
    if (typeof loading === 'object' && loading !== null && typeof loading.then === 'function') {
        const promiseForLoading = loading;
        loadingModuleData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"])(promiseForLoading);
    } else {
        loadingModuleData = loading;
    }
    if (loadingModuleData) {
        const loadingRsc = loadingModuleData[0];
        const loadingStyles = loadingModuleData[1];
        const loadingScripts = loadingModuleData[2];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
            fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    loadingStyles,
                    loadingScripts,
                    loadingRsc
                ]
            }),
            children: children
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    });
}
function OuterLayoutRouter({ parallelRouterKey, error, errorStyles, errorScripts, templateStyles, templateScripts, template, notFound, forbidden, unauthorized, segmentViewBoundaries }) {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LayoutRouterContext"]);
    if (!context) {
        throw Object.defineProperty(new Error('invariant expected layout router to be mounted'), "__NEXT_ERROR_CODE", {
            value: "E56",
            enumerable: false,
            configurable: true
        });
    }
    const { parentTree, parentCacheNode, parentSegmentPath, url } = context;
    // Get the CacheNode for this segment by reading it from the parent segment's
    // child map.
    const parentParallelRoutes = parentCacheNode.parallelRoutes;
    let segmentMap = parentParallelRoutes.get(parallelRouterKey);
    // If the parallel router cache node does not exist yet, create it.
    // This writes to the cache when there is no item in the cache yet. It never *overwrites* existing cache items which is why it's safe in concurrent mode.
    if (!segmentMap) {
        segmentMap = new Map();
        parentParallelRoutes.set(parallelRouterKey, segmentMap);
    }
    const parentTreeSegment = parentTree[0];
    const segmentPath = parentSegmentPath === null ? // the code. We should clean this up.
    [
        parallelRouterKey
    ] : parentSegmentPath.concat([
        parentTreeSegment,
        parallelRouterKey
    ]);
    // The "state" key of a segment is the one passed to React — it represents the
    // identity of the UI tree. Whenever the state key changes, the tree is
    // recreated and the state is reset. In the App Router model, search params do
    // not cause state to be lost, so two segments with the same segment path but
    // different search params should have the same state key.
    //
    // The "cache" key of a segment, however, *does* include the search params, if
    // it's possible that the segment accessed the search params on the server.
    // (This only applies to page segments; layout segments cannot access search
    // params on the server.)
    const activeTree = parentTree[1][parallelRouterKey];
    const activeSegment = activeTree[0];
    const activeStateKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$create$2d$router$2d$cache$2d$key$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createRouterCacheKey"])(activeSegment, true) // no search params
    ;
    // At each level of the route tree, not only do we render the currently
    // active segment — we also render the last N segments that were active at
    // this level inside a hidden <Activity> boundary, to preserve their state
    // if or when the user navigates to them again.
    //
    // bfcacheEntry is a linked list of FlightRouterStates.
    let bfcacheEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$bfcache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouterBFCache"])(activeTree, activeStateKey);
    let children = [];
    do {
        const tree = bfcacheEntry.tree;
        const stateKey = bfcacheEntry.stateKey;
        const segment = tree[0];
        const cacheKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$router$2d$reducer$2f$create$2d$router$2d$cache$2d$key$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createRouterCacheKey"])(segment);
        // Read segment path from the parallel router cache node.
        let cacheNode = segmentMap.get(cacheKey);
        if (cacheNode === undefined) {
            // When data is not available during rendering client-side we need to fetch
            // it from the server.
            const newLazyCacheNode = {
                lazyData: null,
                rsc: null,
                prefetchRsc: null,
                head: null,
                prefetchHead: null,
                parallelRoutes: new Map(),
                loading: null,
                navigatedAt: -1
            };
            // Flight data fetch kicked off during render and put into the cache.
            cacheNode = newLazyCacheNode;
            segmentMap.set(cacheKey, newLazyCacheNode);
        }
        /*
    - Error boundary
      - Only renders error boundary if error component is provided.
      - Rendered for each segment to ensure they have their own error state.
      - When gracefully degrade for bots, skip rendering error boundary.
    - Loading boundary
      - Only renders suspense boundary if loading components is provided.
      - Rendered for each segment to ensure they have their own loading state.
      - Passed to the router during rendering to ensure it can be immediately rendered when suspending on a Flight fetch.
  */ let segmentBoundaryTriggerNode = null;
        let segmentViewStateNode = null;
        if ("TURBOPACK compile-time truthy", 1) {
            const { SegmentBoundaryTriggerNode, SegmentViewStateNode } = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/next-devtools/userspace/app/segment-explorer-node.js [app-ssr] (ecmascript)");
            const pagePrefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$router$2f$utils$2f$app$2d$paths$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeAppPath"])(url);
            segmentViewStateNode = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(SegmentViewStateNode, {
                page: pagePrefix
            }, pagePrefix);
            segmentBoundaryTriggerNode = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(SegmentBoundaryTriggerNode, {})
            });
        }
        // TODO: The loading module data for a segment is stored on the parent, then
        // applied to each of that parent segment's parallel route slots. In the
        // simple case where there's only one parallel route (the `children` slot),
        // this is no different from if the loading module data where stored on the
        // child directly. But I'm not sure this actually makes sense when there are
        // multiple parallel routes. It's not a huge issue because you always have
        // the option to define a narrower loading boundary for a particular slot. But
        // this sort of smells like an implementation accident to me.
        const loadingModuleData = parentCacheNode.loading;
        let child = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TemplateContext"].Provider, {
            value: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(ScrollAndFocusHandler, {
                segmentPath: segmentPath,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$error$2d$boundary$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorBoundary"], {
                        errorComponent: error,
                        errorStyles: errorStyles,
                        errorScripts: errorScripts,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(LoadingBoundary, {
                            loading: loadingModuleData,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$error$2d$boundary$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HTTPAccessFallbackBoundary"], {
                                notFound: notFound,
                                forbidden: forbidden,
                                unauthorized: unauthorized,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$boundary$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RedirectBoundary"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(InnerLayoutRouter, {
                                            url: url,
                                            tree: tree,
                                            cacheNode: cacheNode,
                                            segmentPath: segmentPath
                                        }),
                                        segmentBoundaryTriggerNode
                                    ]
                                })
                            })
                        })
                    }),
                    segmentViewStateNode
                ]
            }),
            children: [
                templateStyles,
                templateScripts,
                template
            ]
        }, stateKey);
        if ("TURBOPACK compile-time truthy", 1) {
            const { SegmentStateProvider } = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/next-devtools/userspace/app/segment-explorer-node.js [app-ssr] (ecmascript)");
            child = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(SegmentStateProvider, {
                children: [
                    child,
                    segmentViewBoundaries
                ]
            }, stateKey);
        }
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        children.push(child);
        bfcacheEntry = bfcacheEntry.next;
    }while (bfcacheEntry !== null)
    return children;
} //# sourceMappingURL=layout-router.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/render-from-template-context.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RenderFromTemplateContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/app-router-context.js [app-ssr] (ecmascript)");
'use client';
;
;
;
function RenderFromTemplateContext() {
    const children = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TemplateContext"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    });
} //# sourceMappingURL=render-from-template-context.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/web/spec-extension/adapters/reflect.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReflectAdapter",
    ()=>ReflectAdapter
]);
class ReflectAdapter {
    static get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === 'function') {
            return value.bind(target);
        }
        return value;
    }
    static set(target, prop, value, receiver) {
        return Reflect.set(target, prop, value, receiver);
    }
    static has(target, prop) {
        return Reflect.has(target, prop);
    }
    static deleteProperty(target, prop) {
        return Reflect.deleteProperty(target, prop);
    }
} //# sourceMappingURL=reflect.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/create-deduped-by-callsite-server-error-logger.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createDedupedByCallsiteServerErrorLoggerDev",
    ()=>createDedupedByCallsiteServerErrorLoggerDev
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
const errorRef = {
    current: null
};
// React.cache is currently only available in canary/experimental React channels.
const cache = typeof __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cache"] === 'function' ? __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cache"] : (fn)=>fn;
// When Cache Components is enabled, we record these as errors so that they
// are captured by the dev overlay as it's more critical to fix these
// when enabled.
const logErrorOrWarn = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : console.warn;
// We don't want to dedupe across requests.
// The developer might've just attempted to fix the warning so we should warn again if it still happens.
const flushCurrentErrorIfNew = cache((key)=>{
    try {
        logErrorOrWarn(errorRef.current);
    } finally{
        errorRef.current = null;
    }
});
function createDedupedByCallsiteServerErrorLoggerDev(getMessage) {
    return function logDedupedError(...args) {
        const message = getMessage(...args);
        if ("TURBOPACK compile-time truthy", 1) {
            var _stack;
            const callStackFrames = (_stack = new Error().stack) == null ? void 0 : _stack.split('\n');
            if (callStackFrames === undefined || callStackFrames.length < 4) {
                logErrorOrWarn(message);
            } else {
                // Error:
                //   logDedupedError
                //   asyncApiBeingAccessedSynchronously
                //   <userland callsite>
                // TODO: This breaks if sourcemaps with ignore lists are enabled.
                const key = callStackFrames[4];
                errorRef.current = message;
                flushCurrentErrorIfNew(key);
            }
        } else //TURBOPACK unreachable
        ;
    };
} //# sourceMappingURL=create-deduped-by-callsite-server-error-logger.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/utils/reflect-utils.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// This regex will have fast negatives meaning valid identifiers may not pass
// this test. However this is only used during static generation to provide hints
// about why a page bailed out of some or all prerendering and we can use bracket notation
// for example while `ಠ_ಠ` is a valid identifier it's ok to print `searchParams['ಠ_ಠ']`
// even if this would have been fine too `searchParams.ಠ_ಠ`
__turbopack_context__.s([
    "describeHasCheckingStringProperty",
    ()=>describeHasCheckingStringProperty,
    "describeStringPropertyAccess",
    ()=>describeStringPropertyAccess,
    "wellKnownProperties",
    ()=>wellKnownProperties
]);
const isDefinitelyAValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
function describeStringPropertyAccess(target, prop) {
    if (isDefinitelyAValidIdentifier.test(prop)) {
        return `\`${target}.${prop}\``;
    }
    return `\`${target}[${JSON.stringify(prop)}]\``;
}
function describeHasCheckingStringProperty(target, prop) {
    const stringifiedProp = JSON.stringify(prop);
    return `\`Reflect.has(${target}, ${stringifiedProp})\`, \`${stringifiedProp} in ${target}\`, or similar`;
}
const wellKnownProperties = new Set([
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toString',
    'valueOf',
    'toLocaleString',
    // Promise prototype
    // fallthrough
    'then',
    'catch',
    'finally',
    // React Promise extension
    // fallthrough
    'status',
    // React introspection
    'displayName',
    '_debugInfo',
    // Common tested properties
    // fallthrough
    'toJSON',
    '$$typeof',
    '__esModule'
]); //# sourceMappingURL=reflect-utils.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/request/utils.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isRequestAPICallableInsideAfter",
    ()=>isRequestAPICallableInsideAfter,
    "throwForSearchParamsAccessInUseCache",
    ()=>throwForSearchParamsAccessInUseCache,
    "throwWithStaticGenerationBailoutErrorWithDynamicError",
    ()=>throwWithStaticGenerationBailoutErrorWithDynamicError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$static$2d$generation$2d$bailout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/static-generation-bailout.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$after$2d$task$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$after$2d$task$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)");
;
;
function throwWithStaticGenerationBailoutErrorWithDynamicError(route, expression) {
    throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$static$2d$generation$2d$bailout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaticGenBailoutError"](`Route ${route} with \`dynamic = "error"\` couldn't be rendered statically because it used ${expression}. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
        value: "E543",
        enumerable: false,
        configurable: true
    });
}
function throwForSearchParamsAccessInUseCache(workStore, constructorOpt) {
    const error = Object.defineProperty(new Error(`Route ${workStore.route} used \`searchParams\` inside "use cache". Accessing dynamic request data inside a cache scope is not supported. If you need some search params inside a cached function await \`searchParams\` outside of the cached function and pass only the required search params as arguments to the cached function. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", {
        value: "E842",
        enumerable: false,
        configurable: true
    });
    Error.captureStackTrace(error, constructorOpt);
    workStore.invalidDynamicUsageError ??= error;
    throw error;
}
function isRequestAPICallableInsideAfter() {
    const afterTaskStore = __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$after$2d$task$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$after$2d$task$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["afterTaskAsyncStorage"].getStore();
    return (afterTaskStore == null ? void 0 : afterTaskStore.rootTaskSpawnPhase) === 'action';
} //# sourceMappingURL=utils.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/request/search-params.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPrerenderSearchParamsForClientPage",
    ()=>createPrerenderSearchParamsForClientPage,
    "createSearchParamsFromClient",
    ()=>createSearchParamsFromClient,
    "createServerSearchParamsForMetadata",
    ()=>createServerSearchParamsForMetadata,
    "createServerSearchParamsForServerPage",
    ()=>createServerSearchParamsForServerPage,
    "makeErroringSearchParamsForUseCache",
    ()=>makeErroringSearchParamsForUseCache
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$adapters$2f$reflect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/web/spec-extension/adapters/reflect.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$app$2d$render$2f$dynamic$2d$rendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/app-render/dynamic-rendering.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dynamic$2d$rendering$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/dynamic-rendering-utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$create$2d$deduped$2d$by$2d$callsite$2d$server$2d$error$2d$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/create-deduped-by-callsite-server-error-logger.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$reflect$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/utils/reflect-utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/request/utils.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
function createSearchParamsFromClient(underlyingSearchParams, workStore) {
    const workUnitStore = __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["workUnitAsyncStorage"].getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender':
            case 'prerender-client':
            case 'prerender-ppr':
            case 'prerender-legacy':
                return createStaticPrerenderSearchParams(workStore, workUnitStore);
            case 'prerender-runtime':
                throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"]('createSearchParamsFromClient should not be called in a runtime prerender.'), "__NEXT_ERROR_CODE", {
                    value: "E769",
                    enumerable: false,
                    configurable: true
                });
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"]('createSearchParamsFromClient should not be called in cache contexts.'), "__NEXT_ERROR_CODE", {
                    value: "E739",
                    enumerable: false,
                    configurable: true
                });
            case 'request':
                return createRenderSearchParams(underlyingSearchParams, workStore);
            default:
                workUnitStore;
        }
    }
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["throwInvariantForMissingStore"])();
}
const createServerSearchParamsForMetadata = createServerSearchParamsForServerPage;
function createServerSearchParamsForServerPage(underlyingSearchParams, workStore) {
    const workUnitStore = __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["workUnitAsyncStorage"].getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender':
            case 'prerender-client':
            case 'prerender-ppr':
            case 'prerender-legacy':
                return createStaticPrerenderSearchParams(workStore, workUnitStore);
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"]('createServerSearchParamsForServerPage should not be called in cache contexts.'), "__NEXT_ERROR_CODE", {
                    value: "E747",
                    enumerable: false,
                    configurable: true
                });
            case 'prerender-runtime':
                return createRuntimePrerenderSearchParams(underlyingSearchParams, workUnitStore);
            case 'request':
                return createRenderSearchParams(underlyingSearchParams, workStore);
            default:
                workUnitStore;
        }
    }
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["throwInvariantForMissingStore"])();
}
function createPrerenderSearchParamsForClientPage(workStore) {
    if (workStore.forceStatic) {
        // When using forceStatic we override all other logic and always just return an empty
        // dictionary object.
        return Promise.resolve({});
    }
    const workUnitStore = __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["workUnitAsyncStorage"].getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender':
            case 'prerender-client':
                // We're prerendering in a mode that aborts (cacheComponents) and should stall
                // the promise to ensure the RSC side is considered dynamic
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dynamic$2d$rendering$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeHangingPromise"])(workUnitStore.renderSignal, workStore.route, '`searchParams`');
            case 'prerender-runtime':
                throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"]('createPrerenderSearchParamsForClientPage should not be called in a runtime prerender.'), "__NEXT_ERROR_CODE", {
                    value: "E768",
                    enumerable: false,
                    configurable: true
                });
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"]('createPrerenderSearchParamsForClientPage should not be called in cache contexts.'), "__NEXT_ERROR_CODE", {
                    value: "E746",
                    enumerable: false,
                    configurable: true
                });
            case 'prerender-ppr':
            case 'prerender-legacy':
            case 'request':
                return Promise.resolve({});
            default:
                workUnitStore;
        }
    }
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["throwInvariantForMissingStore"])();
}
function createStaticPrerenderSearchParams(workStore, prerenderStore) {
    if (workStore.forceStatic) {
        // When using forceStatic we override all other logic and always just return an empty
        // dictionary object.
        return Promise.resolve({});
    }
    switch(prerenderStore.type){
        case 'prerender':
        case 'prerender-client':
            // We are in a cacheComponents (PPR or otherwise) prerender
            return makeHangingSearchParams(workStore, prerenderStore);
        case 'prerender-ppr':
        case 'prerender-legacy':
            // We are in a legacy static generation and need to interrupt the
            // prerender when search params are accessed.
            return makeErroringSearchParams(workStore, prerenderStore);
        default:
            return prerenderStore;
    }
}
function createRuntimePrerenderSearchParams(underlyingSearchParams, workUnitStore) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$app$2d$render$2f$dynamic$2d$rendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["delayUntilRuntimeStage"])(workUnitStore, makeUntrackedSearchParams(underlyingSearchParams));
}
function createRenderSearchParams(underlyingSearchParams, workStore) {
    if (workStore.forceStatic) {
        // When using forceStatic we override all other logic and always just return an empty
        // dictionary object.
        return Promise.resolve({});
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            // Semantically we only need the dev tracking when running in `next dev`
            // but since you would never use next dev with production NODE_ENV we use this
            // as a proxy so we can statically exclude this code from production builds.
            return makeUntrackedSearchParamsWithDevWarnings(underlyingSearchParams, workStore);
        } else //TURBOPACK unreachable
        ;
    }
}
const CachedSearchParams = new WeakMap();
const CachedSearchParamsForUseCache = new WeakMap();
function makeHangingSearchParams(workStore, prerenderStore) {
    const cachedSearchParams = CachedSearchParams.get(prerenderStore);
    if (cachedSearchParams) {
        return cachedSearchParams;
    }
    const promise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dynamic$2d$rendering$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeHangingPromise"])(prerenderStore.renderSignal, workStore.route, '`searchParams`');
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (Object.hasOwn(promise, prop)) {
                // The promise has this property directly. we must return it.
                // We know it isn't a dynamic access because it can only be something
                // that was previously written to the promise and thus not an underlying searchParam value
                return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$adapters$2f$reflect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReflectAdapter"].get(target, prop, receiver);
            }
            switch(prop){
                case 'then':
                    {
                        const expression = '`await searchParams`, `searchParams.then`, or similar';
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$app$2d$render$2f$dynamic$2d$rendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["annotateDynamicAccess"])(expression, prerenderStore);
                        return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$adapters$2f$reflect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReflectAdapter"].get(target, prop, receiver);
                    }
                case 'status':
                    {
                        const expression = '`use(searchParams)`, `searchParams.status`, or similar';
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$app$2d$render$2f$dynamic$2d$rendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["annotateDynamicAccess"])(expression, prerenderStore);
                        return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$adapters$2f$reflect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReflectAdapter"].get(target, prop, receiver);
                    }
                default:
                    {
                        return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$adapters$2f$reflect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReflectAdapter"].get(target, prop, receiver);
                    }
            }
        }
    });
    CachedSearchParams.set(prerenderStore, proxiedPromise);
    return proxiedPromise;
}
function makeErroringSearchParams(workStore, prerenderStore) {
    const cachedSearchParams = CachedSearchParams.get(workStore);
    if (cachedSearchParams) {
        return cachedSearchParams;
    }
    const underlyingSearchParams = {};
    // For search params we don't construct a ReactPromise because we want to interrupt
    // rendering on any property access that was not set from outside and so we only want
    // to have properties like value and status if React sets them.
    const promise = Promise.resolve(underlyingSearchParams);
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (Object.hasOwn(promise, prop)) {
                // The promise has this property directly. we must return it.
                // We know it isn't a dynamic access because it can only be something
                // that was previously written to the promise and thus not an underlying searchParam value
                return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$adapters$2f$reflect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReflectAdapter"].get(target, prop, receiver);
            }
            if (typeof prop === 'string' && prop === 'then') {
                const expression = '`await searchParams`, `searchParams.then`, or similar';
                if (workStore.dynamicShouldError) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwWithStaticGenerationBailoutErrorWithDynamicError"])(workStore.route, expression);
                } else if (prerenderStore.type === 'prerender-ppr') {
                    // PPR Prerender (no cacheComponents)
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$app$2d$render$2f$dynamic$2d$rendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["postponeWithTracking"])(workStore.route, expression, prerenderStore.dynamicTracking);
                } else {
                    // Legacy Prerender
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$app$2d$render$2f$dynamic$2d$rendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwToInterruptStaticGeneration"])(expression, workStore, prerenderStore);
                }
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$adapters$2f$reflect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReflectAdapter"].get(target, prop, receiver);
        }
    });
    CachedSearchParams.set(workStore, proxiedPromise);
    return proxiedPromise;
}
function makeErroringSearchParamsForUseCache(workStore) {
    const cachedSearchParams = CachedSearchParamsForUseCache.get(workStore);
    if (cachedSearchParams) {
        return cachedSearchParams;
    }
    const promise = Promise.resolve({});
    const proxiedPromise = new Proxy(promise, {
        get: function get(target, prop, receiver) {
            if (Object.hasOwn(promise, prop)) {
                // The promise has this property directly. we must return it. We know it
                // isn't a dynamic access because it can only be something that was
                // previously written to the promise and thus not an underlying
                // searchParam value
                return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$adapters$2f$reflect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReflectAdapter"].get(target, prop, receiver);
            }
            if (typeof prop === 'string' && (prop === 'then' || !__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$reflect$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wellKnownProperties"].has(prop))) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwForSearchParamsAccessInUseCache"])(workStore, get);
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$adapters$2f$reflect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReflectAdapter"].get(target, prop, receiver);
        }
    });
    CachedSearchParamsForUseCache.set(workStore, proxiedPromise);
    return proxiedPromise;
}
function makeUntrackedSearchParams(underlyingSearchParams) {
    const cachedSearchParams = CachedSearchParams.get(underlyingSearchParams);
    if (cachedSearchParams) {
        return cachedSearchParams;
    }
    const promise = Promise.resolve(underlyingSearchParams);
    CachedSearchParams.set(underlyingSearchParams, promise);
    return promise;
}
function makeUntrackedSearchParamsWithDevWarnings(underlyingSearchParams, store) {
    const cachedSearchParams = CachedSearchParams.get(underlyingSearchParams);
    if (cachedSearchParams) {
        return cachedSearchParams;
    }
    // Track which properties we should warn for.
    const proxiedProperties = new Set();
    // We have an unfortunate sequence of events that requires this initialization logic. We want to instrument the underlying
    // searchParams object to detect if you are accessing values in dev. This is used for warnings and for things like the static prerender
    // indicator. However when we pass this proxy to our Promise.resolve() below the VM checks if the resolved value is a promise by looking
    // at the `.then` property. To our dynamic tracking logic this is indistinguishable from a `then` searchParam and so we would normally trigger
    // dynamic tracking. However we know that this .then is not real dynamic access, it's just how thenables resolve in sequence. So we introduce
    // this initialization concept so we omit the dynamic check until after we've constructed our resolved promise.
    let promiseInitialized = false;
    const proxiedUnderlying = new Proxy(underlyingSearchParams, {
        get (target, prop, receiver) {
            if (typeof prop === 'string' && promiseInitialized) {
                if (store.dynamicShouldError) {
                    const expression = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$reflect$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["describeStringPropertyAccess"])('searchParams', prop);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwWithStaticGenerationBailoutErrorWithDynamicError"])(store.route, expression);
                }
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$adapters$2f$reflect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReflectAdapter"].get(target, prop, receiver);
        },
        has (target, prop) {
            if (typeof prop === 'string') {
                if (store.dynamicShouldError) {
                    const expression = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$reflect$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["describeHasCheckingStringProperty"])('searchParams', prop);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwWithStaticGenerationBailoutErrorWithDynamicError"])(store.route, expression);
                }
            }
            return Reflect.has(target, prop);
        },
        ownKeys (target) {
            if (store.dynamicShouldError) {
                const expression = '`{...searchParams}`, `Object.keys(searchParams)`, or similar';
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwWithStaticGenerationBailoutErrorWithDynamicError"])(store.route, expression);
            }
            return Reflect.ownKeys(target);
        }
    });
    // We don't use makeResolvedReactPromise here because searchParams
    // supports copying with spread and we don't want to unnecessarily
    // instrument the promise with spreadable properties of ReactPromise.
    const promise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dynamic$2d$rendering$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeDevtoolsIOAwarePromise"])(proxiedUnderlying);
    promise.then(()=>{
        promiseInitialized = true;
    });
    Object.keys(underlyingSearchParams).forEach((prop)=>{
        if (__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$reflect$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wellKnownProperties"].has(prop)) {
        // These properties cannot be shadowed because they need to be the
        // true underlying value for Promises to work correctly at runtime
        } else {
            proxiedProperties.add(prop);
        }
    });
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (prop === 'then' && store.dynamicShouldError) {
                const expression = '`searchParams.then`';
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwWithStaticGenerationBailoutErrorWithDynamicError"])(store.route, expression);
            }
            if (typeof prop === 'string') {
                if (!__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$reflect$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wellKnownProperties"].has(prop) && (proxiedProperties.has(prop) || // We are accessing a property that doesn't exist on the promise nor
                // the underlying searchParams.
                Reflect.has(target, prop) === false)) {
                    const expression = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$reflect$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["describeStringPropertyAccess"])('searchParams', prop);
                    warnForSyncAccess(store.route, expression);
                }
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$adapters$2f$reflect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReflectAdapter"].get(target, prop, receiver);
        },
        set (target, prop, value, receiver) {
            if (typeof prop === 'string') {
                proxiedProperties.delete(prop);
            }
            return Reflect.set(target, prop, value, receiver);
        },
        has (target, prop) {
            if (typeof prop === 'string') {
                if (!__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$reflect$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wellKnownProperties"].has(prop) && (proxiedProperties.has(prop) || // We are accessing a property that doesn't exist on the promise nor
                // the underlying searchParams.
                Reflect.has(target, prop) === false)) {
                    const expression = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$reflect$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["describeHasCheckingStringProperty"])('searchParams', prop);
                    warnForSyncAccess(store.route, expression);
                }
            }
            return Reflect.has(target, prop);
        },
        ownKeys (target) {
            const expression = '`Object.keys(searchParams)` or similar';
            warnForSyncAccess(store.route, expression);
            return Reflect.ownKeys(target);
        }
    });
    CachedSearchParams.set(underlyingSearchParams, proxiedPromise);
    return proxiedPromise;
}
const warnForSyncAccess = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$create$2d$deduped$2d$by$2d$callsite$2d$server$2d$error$2d$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDedupedByCallsiteServerErrorLoggerDev"])(createSearchAccessError);
function createSearchAccessError(route, expression) {
    const prefix = route ? `Route "${route}" ` : 'This route ';
    return Object.defineProperty(new Error(`${prefix}used ${expression}. ` + `\`searchParams\` is a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. ` + `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", {
        value: "E848",
        enumerable: false,
        configurable: true
    });
} //# sourceMappingURL=search-params.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/request/params.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createParamsFromClient",
    ()=>createParamsFromClient,
    "createPrerenderParamsForClientSegment",
    ()=>createPrerenderParamsForClientSegment,
    "createServerParamsForMetadata",
    ()=>createServerParamsForMetadata,
    "createServerParamsForRoute",
    ()=>createServerParamsForRoute,
    "createServerParamsForServerSegment",
    ()=>createServerParamsForServerSegment
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$adapters$2f$reflect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/web/spec-extension/adapters/reflect.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$app$2d$render$2f$dynamic$2d$rendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/app-render/dynamic-rendering.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$reflect$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/utils/reflect-utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dynamic$2d$rendering$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/dynamic-rendering-utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$create$2d$deduped$2d$by$2d$callsite$2d$server$2d$error$2d$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/create-deduped-by-callsite-server-error-logger.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$dynamic$2d$access$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$dynamic$2d$access$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)");
;
;
;
;
;
;
;
;
;
function createParamsFromClient(underlyingParams, workStore) {
    const workUnitStore = __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["workUnitAsyncStorage"].getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender':
            case 'prerender-client':
            case 'prerender-ppr':
            case 'prerender-legacy':
                return createStaticPrerenderParams(underlyingParams, workStore, workUnitStore);
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"]('createParamsFromClient should not be called in cache contexts.'), "__NEXT_ERROR_CODE", {
                    value: "E736",
                    enumerable: false,
                    configurable: true
                });
            case 'prerender-runtime':
                throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"]('createParamsFromClient should not be called in a runtime prerender.'), "__NEXT_ERROR_CODE", {
                    value: "E770",
                    enumerable: false,
                    configurable: true
                });
            case 'request':
                if ("TURBOPACK compile-time truthy", 1) {
                    // Semantically we only need the dev tracking when running in `next dev`
                    // but since you would never use next dev with production NODE_ENV we use this
                    // as a proxy so we can statically exclude this code from production builds.
                    const devFallbackParams = workUnitStore.devFallbackParams;
                    return createRenderParamsInDev(underlyingParams, devFallbackParams, workStore);
                } else //TURBOPACK unreachable
                ;
            default:
                workUnitStore;
        }
    }
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["throwInvariantForMissingStore"])();
}
const createServerParamsForMetadata = createServerParamsForServerSegment;
function createServerParamsForRoute(underlyingParams, workStore) {
    const workUnitStore = __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["workUnitAsyncStorage"].getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender':
            case 'prerender-client':
            case 'prerender-ppr':
            case 'prerender-legacy':
                return createStaticPrerenderParams(underlyingParams, workStore, workUnitStore);
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"]('createServerParamsForRoute should not be called in cache contexts.'), "__NEXT_ERROR_CODE", {
                    value: "E738",
                    enumerable: false,
                    configurable: true
                });
            case 'prerender-runtime':
                return createRuntimePrerenderParams(underlyingParams, workUnitStore);
            case 'request':
                if ("TURBOPACK compile-time truthy", 1) {
                    // Semantically we only need the dev tracking when running in `next dev`
                    // but since you would never use next dev with production NODE_ENV we use this
                    // as a proxy so we can statically exclude this code from production builds.
                    const devFallbackParams = workUnitStore.devFallbackParams;
                    return createRenderParamsInDev(underlyingParams, devFallbackParams, workStore);
                } else //TURBOPACK unreachable
                ;
            default:
                workUnitStore;
        }
    }
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["throwInvariantForMissingStore"])();
}
function createServerParamsForServerSegment(underlyingParams, workStore) {
    const workUnitStore = __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["workUnitAsyncStorage"].getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender':
            case 'prerender-client':
            case 'prerender-ppr':
            case 'prerender-legacy':
                return createStaticPrerenderParams(underlyingParams, workStore, workUnitStore);
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"]('createServerParamsForServerSegment should not be called in cache contexts.'), "__NEXT_ERROR_CODE", {
                    value: "E743",
                    enumerable: false,
                    configurable: true
                });
            case 'prerender-runtime':
                return createRuntimePrerenderParams(underlyingParams, workUnitStore);
            case 'request':
                if ("TURBOPACK compile-time truthy", 1) {
                    // Semantically we only need the dev tracking when running in `next dev`
                    // but since you would never use next dev with production NODE_ENV we use this
                    // as a proxy so we can statically exclude this code from production builds.
                    const devFallbackParams = workUnitStore.devFallbackParams;
                    return createRenderParamsInDev(underlyingParams, devFallbackParams, workStore);
                } else //TURBOPACK unreachable
                ;
            default:
                workUnitStore;
        }
    }
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["throwInvariantForMissingStore"])();
}
function createPrerenderParamsForClientSegment(underlyingParams) {
    const workStore = __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["workAsyncStorage"].getStore();
    if (!workStore) {
        throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"]('Missing workStore in createPrerenderParamsForClientSegment'), "__NEXT_ERROR_CODE", {
            value: "E773",
            enumerable: false,
            configurable: true
        });
    }
    const workUnitStore = __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$work$2d$unit$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["workUnitAsyncStorage"].getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender':
            case 'prerender-client':
                const fallbackParams = workUnitStore.fallbackRouteParams;
                if (fallbackParams) {
                    for(let key in underlyingParams){
                        if (fallbackParams.has(key)) {
                            // This params object has one or more fallback params, so we need
                            // to consider the awaiting of this params object "dynamic". Since
                            // we are in cacheComponents mode we encode this as a promise that never
                            // resolves.
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dynamic$2d$rendering$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeHangingPromise"])(workUnitStore.renderSignal, workStore.route, '`params`');
                        }
                    }
                }
                break;
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"]('createPrerenderParamsForClientSegment should not be called in cache contexts.'), "__NEXT_ERROR_CODE", {
                    value: "E734",
                    enumerable: false,
                    configurable: true
                });
            case 'prerender-ppr':
            case 'prerender-legacy':
            case 'prerender-runtime':
            case 'request':
                break;
            default:
                workUnitStore;
        }
    }
    // We're prerendering in a mode that does not abort. We resolve the promise without
    // any tracking because we're just transporting a value from server to client where the tracking
    // will be applied.
    return Promise.resolve(underlyingParams);
}
function createStaticPrerenderParams(underlyingParams, workStore, prerenderStore) {
    switch(prerenderStore.type){
        case 'prerender':
        case 'prerender-client':
            {
                const fallbackParams = prerenderStore.fallbackRouteParams;
                if (fallbackParams) {
                    for(const key in underlyingParams){
                        if (fallbackParams.has(key)) {
                            // This params object has one or more fallback params, so we need
                            // to consider the awaiting of this params object "dynamic". Since
                            // we are in cacheComponents mode we encode this as a promise that never
                            // resolves.
                            return makeHangingParams(underlyingParams, workStore, prerenderStore);
                        }
                    }
                }
                break;
            }
        case 'prerender-ppr':
            {
                const fallbackParams = prerenderStore.fallbackRouteParams;
                if (fallbackParams) {
                    for(const key in underlyingParams){
                        if (fallbackParams.has(key)) {
                            return makeErroringParams(underlyingParams, fallbackParams, workStore, prerenderStore);
                        }
                    }
                }
                break;
            }
        case 'prerender-legacy':
            break;
        default:
            prerenderStore;
    }
    return makeUntrackedParams(underlyingParams);
}
function createRuntimePrerenderParams(underlyingParams, workUnitStore) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$app$2d$render$2f$dynamic$2d$rendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["delayUntilRuntimeStage"])(workUnitStore, makeUntrackedParams(underlyingParams));
}
function createRenderParamsInProd(underlyingParams) {
    return makeUntrackedParams(underlyingParams);
}
function createRenderParamsInDev(underlyingParams, devFallbackParams, workStore) {
    let hasFallbackParams = false;
    if (devFallbackParams) {
        for(let key in underlyingParams){
            if (devFallbackParams.has(key)) {
                hasFallbackParams = true;
                break;
            }
        }
    }
    return makeDynamicallyTrackedParamsWithDevWarnings(underlyingParams, hasFallbackParams, workStore);
}
const CachedParams = new WeakMap();
const fallbackParamsProxyHandler = {
    get: function get(target, prop, receiver) {
        if (prop === 'then' || prop === 'catch' || prop === 'finally') {
            const originalMethod = __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$adapters$2f$reflect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReflectAdapter"].get(target, prop, receiver);
            return ({
                [prop]: (...args)=>{
                    const store = __TURBOPACK__imported__module__$5b$externals$5d2f$next$2f$dist$2f$server$2f$app$2d$render$2f$dynamic$2d$access$2d$async$2d$storage$2e$external$2e$js__$5b$external$5d$__$28$next$2f$dist$2f$server$2f$app$2d$render$2f$dynamic$2d$access$2d$async$2d$storage$2e$external$2e$js$2c$__cjs$29$__["dynamicAccessAsyncStorage"].getStore();
                    if (store) {
                        store.abortController.abort(Object.defineProperty(new Error(`Accessed fallback \`params\` during prerendering.`), "__NEXT_ERROR_CODE", {
                            value: "E691",
                            enumerable: false,
                            configurable: true
                        }));
                    }
                    return new Proxy(originalMethod.apply(target, args), fallbackParamsProxyHandler);
                }
            })[prop];
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$adapters$2f$reflect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReflectAdapter"].get(target, prop, receiver);
    }
};
function makeHangingParams(underlyingParams, workStore, prerenderStore) {
    const cachedParams = CachedParams.get(underlyingParams);
    if (cachedParams) {
        return cachedParams;
    }
    const promise = new Proxy((0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dynamic$2d$rendering$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeHangingPromise"])(prerenderStore.renderSignal, workStore.route, '`params`'), fallbackParamsProxyHandler);
    CachedParams.set(underlyingParams, promise);
    return promise;
}
function makeErroringParams(underlyingParams, fallbackParams, workStore, prerenderStore) {
    const cachedParams = CachedParams.get(underlyingParams);
    if (cachedParams) {
        return cachedParams;
    }
    const augmentedUnderlying = {
        ...underlyingParams
    };
    // We don't use makeResolvedReactPromise here because params
    // supports copying with spread and we don't want to unnecessarily
    // instrument the promise with spreadable properties of ReactPromise.
    const promise = Promise.resolve(augmentedUnderlying);
    CachedParams.set(underlyingParams, promise);
    Object.keys(underlyingParams).forEach((prop)=>{
        if (__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$reflect$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wellKnownProperties"].has(prop)) {
        // These properties cannot be shadowed because they need to be the
        // true underlying value for Promises to work correctly at runtime
        } else {
            if (fallbackParams.has(prop)) {
                Object.defineProperty(augmentedUnderlying, prop, {
                    get () {
                        const expression = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$reflect$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["describeStringPropertyAccess"])('params', prop);
                        // In most dynamic APIs we also throw if `dynamic = "error"` however
                        // for params is only dynamic when we're generating a fallback shell
                        // and even when `dynamic = "error"` we still support generating dynamic
                        // fallback shells
                        // TODO remove this comment when cacheComponents is the default since there
                        // will be no `dynamic = "error"`
                        if (prerenderStore.type === 'prerender-ppr') {
                            // PPR Prerender (no cacheComponents)
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$app$2d$render$2f$dynamic$2d$rendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["postponeWithTracking"])(workStore.route, expression, prerenderStore.dynamicTracking);
                        } else {
                            // Legacy Prerender
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$app$2d$render$2f$dynamic$2d$rendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwToInterruptStaticGeneration"])(expression, workStore, prerenderStore);
                        }
                    },
                    enumerable: true
                });
            }
        }
    });
    return promise;
}
function makeUntrackedParams(underlyingParams) {
    const cachedParams = CachedParams.get(underlyingParams);
    if (cachedParams) {
        return cachedParams;
    }
    const promise = Promise.resolve(underlyingParams);
    CachedParams.set(underlyingParams, promise);
    return promise;
}
function makeDynamicallyTrackedParamsWithDevWarnings(underlyingParams, hasFallbackParams, store) {
    const cachedParams = CachedParams.get(underlyingParams);
    if (cachedParams) {
        return cachedParams;
    }
    // We don't use makeResolvedReactPromise here because params
    // supports copying with spread and we don't want to unnecessarily
    // instrument the promise with spreadable properties of ReactPromise.
    const promise = hasFallbackParams ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dynamic$2d$rendering$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeDevtoolsIOAwarePromise"])(underlyingParams) : Promise.resolve(underlyingParams);
    // Track which properties we should warn for.
    const proxiedProperties = new Set();
    Object.keys(underlyingParams).forEach((prop)=>{
        if (__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$reflect$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wellKnownProperties"].has(prop)) {
        // These properties cannot be shadowed because they need to be the
        // true underlying value for Promises to work correctly at runtime
        } else {
            proxiedProperties.add(prop);
        }
    });
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (typeof prop === 'string') {
                if (proxiedProperties.has(prop)) {
                    const expression = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$utils$2f$reflect$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["describeStringPropertyAccess"])('params', prop);
                    warnForSyncAccess(store.route, expression);
                }
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$adapters$2f$reflect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReflectAdapter"].get(target, prop, receiver);
        },
        set (target, prop, value, receiver) {
            if (typeof prop === 'string') {
                proxiedProperties.delete(prop);
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$adapters$2f$reflect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReflectAdapter"].set(target, prop, value, receiver);
        },
        ownKeys (target) {
            const expression = '`...params` or similar expression';
            warnForSyncAccess(store.route, expression);
            return Reflect.ownKeys(target);
        }
    });
    CachedParams.set(underlyingParams, proxiedPromise);
    return proxiedPromise;
}
const warnForSyncAccess = (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$create$2d$deduped$2d$by$2d$callsite$2d$server$2d$error$2d$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDedupedByCallsiteServerErrorLoggerDev"])(createParamsAccessError);
function createParamsAccessError(route, expression) {
    const prefix = route ? `Route "${route}" ` : 'This route ';
    return Object.defineProperty(new Error(`${prefix}used ${expression}. ` + `\`params\` is a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. ` + `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", {
        value: "E834",
        enumerable: false,
        configurable: true
    });
} //# sourceMappingURL=params.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/client-page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClientPageRoot",
    ()=>ClientPageRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
'use client';
;
;
function ClientPageRoot({ Component, searchParams, params, promises }) {
    if ("TURBOPACK compile-time truthy", 1) {
        const { workAsyncStorage } = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
        let clientSearchParams;
        let clientParams;
        // We are going to instrument the searchParams prop with tracking for the
        // appropriate context. We wrap differently in prerendering vs rendering
        const store = workAsyncStorage.getStore();
        if (!store) {
            throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"]('Expected workStore to exist when handling searchParams in a client Page.'), "__NEXT_ERROR_CODE", {
                value: "E564",
                enumerable: false,
                configurable: true
            });
        }
        const { createSearchParamsFromClient } = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/request/search-params.js [app-ssr] (ecmascript)");
        clientSearchParams = createSearchParamsFromClient(searchParams, store);
        const { createParamsFromClient } = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/request/params.js [app-ssr] (ecmascript)");
        clientParams = createParamsFromClient(params, store);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Component, {
            params: clientParams,
            searchParams: clientSearchParams
        });
    } else //TURBOPACK unreachable
    ;
} //# sourceMappingURL=client-page.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/client/components/client-segment.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClientSegmentRoot",
    ()=>ClientSegmentRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
'use client';
;
;
function ClientSegmentRoot({ Component, slots, params, promise }) {
    if ("TURBOPACK compile-time truthy", 1) {
        const { workAsyncStorage } = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
        let clientParams;
        // We are going to instrument the searchParams prop with tracking for the
        // appropriate context. We wrap differently in prerendering vs rendering
        const store = workAsyncStorage.getStore();
        if (!store) {
            throw Object.defineProperty(new __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$invariant$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvariantError"]('Expected workStore to exist when handling params in a client segment such as a Layout or Template.'), "__NEXT_ERROR_CODE", {
                value: "E600",
                enumerable: false,
                configurable: true
            });
        }
        const { createParamsFromClient } = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/server/request/params.js [app-ssr] (ecmascript)");
        clientParams = createParamsFromClient(params, store);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Component, {
            ...slots,
            params: clientParams
        });
    } else //TURBOPACK unreachable
    ;
} //# sourceMappingURL=client-segment.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/lib/metadata/generate/icon-mark.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IconMark",
    ()=>IconMark
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
'use client';
;
const IconMark = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("meta", {
        name: "\xabnxt-icon\xbb"
    });
}; //# sourceMappingURL=icon-mark.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/lib/framework/boundary-components.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MetadataBoundary",
    ()=>MetadataBoundary,
    "OutletBoundary",
    ()=>OutletBoundary,
    "RootLayoutBoundary",
    ()=>RootLayoutBoundary,
    "ViewportBoundary",
    ()=>ViewportBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$framework$2f$boundary$2d$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/esm/lib/framework/boundary-constants.js [app-ssr] (ecmascript)");
'use client';
;
// We use a namespace object to allow us to recover the name of the function
// at runtime even when production bundling/minification is used.
const NameSpace = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$framework$2f$boundary$2d$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["METADATA_BOUNDARY_NAME"]]: function({ children }) {
        return children;
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$framework$2f$boundary$2d$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VIEWPORT_BOUNDARY_NAME"]]: function({ children }) {
        return children;
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$framework$2f$boundary$2d$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OUTLET_BOUNDARY_NAME"]]: function({ children }) {
        return children;
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$framework$2f$boundary$2d$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROOT_LAYOUT_BOUNDARY_NAME"]]: function({ children }) {
        return children;
    }
};
const MetadataBoundary = // so it retains the name inferred from the namespace object
NameSpace[__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$framework$2f$boundary$2d$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["METADATA_BOUNDARY_NAME"].slice(0)];
const ViewportBoundary = // so it retains the name inferred from the namespace object
NameSpace[__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$framework$2f$boundary$2d$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VIEWPORT_BOUNDARY_NAME"].slice(0)];
const OutletBoundary = // so it retains the name inferred from the namespace object
NameSpace[__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$framework$2f$boundary$2d$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OUTLET_BOUNDARY_NAME"].slice(0)];
const RootLayoutBoundary = // so it retains the name inferred from the namespace object
NameSpace[__TURBOPACK__imported__module__$5b$project$5d2f$edu$2d$bit$2d$lms$2f$bitflow$2d$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$49_react$2d$dom$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$20251006_react$40$19$2e$3$2e$0$2d$canary$2d$a4eb2dfa$2d$_uc47x56iwmn47x4r5d6fvjqgzi$2f$node_modules$2f$next$2f$dist$2f$esm$2f$lib$2f$framework$2f$boundary$2d$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROOT_LAYOUT_BOUNDARY_NAME"].slice(0)]; //# sourceMappingURL=boundary-components.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/handle-isr-error.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HandleISRError", {
    enumerable: true,
    get: function() {
        return HandleISRError;
    }
});
const workAsyncStorage = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)").workAsyncStorage : "TURBOPACK unreachable";
function HandleISRError({ error }) {
    if (workAsyncStorage) {
        const store = workAsyncStorage.getStore();
        if (store?.isStaticGeneration) {
            if (error) {
                console.error(error);
            }
            throw error;
        }
    }
    return null;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=handle-isr-error.js.map
}),
"[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/builtin/global-error.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, // supplied custom global error signatures.
"default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
const _handleisrerror = __turbopack_context__.r("[project]/edu-bit-lms/bitflow-frontend/node_modules/.pnpm/next@15.6.0-canary.49_react-dom@19.3.0-canary-a4eb2dfa-20251006_react@19.3.0-canary-a4eb2dfa-_uc47x56iwmn47x4r5d6fvjqgzi/node_modules/next/dist/client/components/handle-isr-error.js [app-ssr] (ecmascript)");
const styles = {
    error: {
        // https://github.com/sindresorhus/modern-normalize/blob/main/modern-normalize.css#L38-L52
        fontFamily: 'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
        height: '100vh',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '28px',
        margin: '0 8px'
    }
};
function DefaultGlobalError({ error }) {
    const digest = error?.digest;
    return /*#__PURE__*/ (0, _jsxruntime.jsxs)("html", {
        id: "__next_error__",
        children: [
            /*#__PURE__*/ (0, _jsxruntime.jsx)("head", {}),
            /*#__PURE__*/ (0, _jsxruntime.jsxs)("body", {
                children: [
                    /*#__PURE__*/ (0, _jsxruntime.jsx)(_handleisrerror.HandleISRError, {
                        error: error
                    }),
                    /*#__PURE__*/ (0, _jsxruntime.jsx)("div", {
                        style: styles.error,
                        children: /*#__PURE__*/ (0, _jsxruntime.jsxs)("div", {
                            children: [
                                /*#__PURE__*/ (0, _jsxruntime.jsxs)("h2", {
                                    style: styles.text,
                                    children: [
                                        "Application error: a ",
                                        digest ? 'server' : 'client',
                                        "-side exception has occurred while loading ",
                                        window.location.hostname,
                                        " (see the",
                                        ' ',
                                        digest ? 'server logs' : 'browser console',
                                        " for more information)."
                                    ]
                                }),
                                digest ? /*#__PURE__*/ (0, _jsxruntime.jsx)("p", {
                                    style: styles.text,
                                    children: `Digest: ${digest}`
                                }) : null
                            ]
                        })
                    })
                ]
            })
        ]
    });
}
const _default = DefaultGlobalError;
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=global-error.js.map
}),
];

//# sourceMappingURL=9e7a8__pnpm_a05b451b._.js.map