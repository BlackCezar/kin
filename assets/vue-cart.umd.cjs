(function(factory) {
  typeof define === "function" && define.amd ? define(factory) : factory();
})(function() {
  "use strict";
  /**
  * @vue/shared v3.4.14
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  function makeMap(str, expectsLowerCase) {
    const set2 = new Set(str.split(","));
    return expectsLowerCase ? (val) => set2.has(val.toLowerCase()) : (val) => set2.has(val);
  }
  const EMPTY_OBJ = {};
  const EMPTY_ARR = [];
  const NOOP = () => {
  };
  const NO = () => false;
  const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
  (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
  const isModelListener = (key) => key.startsWith("onUpdate:");
  const extend = Object.assign;
  const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
      arr.splice(i, 1);
    }
  };
  const hasOwnProperty$2 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$2.call(val, key);
  const isArray = Array.isArray;
  const isMap = (val) => toTypeString(val) === "[object Map]";
  const isSet = (val) => toTypeString(val) === "[object Set]";
  const isDate$2 = (val) => toTypeString(val) === "[object Date]";
  const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isSymbol = (val) => typeof val === "symbol";
  const isObject$4 = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return (isObject$4(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  const isPlainObject$2 = (val) => toTypeString(val) === "[object Object]";
  const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  const isReservedProp = /* @__PURE__ */ makeMap(
    // the leading comma is intentional so empty string "" is also included
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  );
  const cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };
  const camelizeRE = /-(\w)/g;
  const camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (_, c2) => c2 ? c2.toUpperCase() : "");
  });
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction(
    (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
  );
  const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  const toHandlerKey = cacheStringFunction((str) => {
    const s = str ? `on${capitalize(str)}` : ``;
    return s;
  });
  const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  const invokeArrayFns = (fns, arg) => {
    for (let i = 0; i < fns.length; i++) {
      fns[i](arg);
    }
  };
  const def = (obj, key, value) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      value
    });
  };
  const looseToNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
  };
  const toNumber$2 = (val) => {
    const n = isString(val) ? Number(val) : NaN;
    return isNaN(n) ? val : n;
  };
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
  };
  const GLOBALS_ALLOWED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error";
  const isGloballyAllowed = /* @__PURE__ */ makeMap(GLOBALS_ALLOWED);
  function normalizeStyle(value) {
    if (isArray(value)) {
      const res = {};
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
        if (normalized) {
          for (const key in normalized) {
            res[key] = normalized[key];
          }
        }
      }
      return res;
    } else if (isString(value) || isObject$4(value)) {
      return value;
    }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:([^]+)/;
  const styleCommentRE = /\/\*[^]*?\*\//g;
  function parseStringStyle(cssText) {
    const ret = {};
    cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }
  function normalizeClass(value) {
    let res = "";
    if (isString(value)) {
      res = value;
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const normalized = normalizeClass(value[i]);
        if (normalized) {
          res += normalized + " ";
        }
      }
    } else if (isObject$4(value)) {
      for (const name in value) {
        if (value[name]) {
          res += name + " ";
        }
      }
    }
    return res.trim();
  }
  function normalizeProps(props) {
    if (!props)
      return null;
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (style) {
      props.style = normalizeStyle(style);
    }
    return props;
  }
  const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
  function includeBooleanAttr(value) {
    return !!value || value === "";
  }
  function looseCompareArrays(a, b) {
    if (a.length !== b.length)
      return false;
    let equal = true;
    for (let i = 0; equal && i < a.length; i++) {
      equal = looseEqual(a[i], b[i]);
    }
    return equal;
  }
  function looseEqual(a, b) {
    if (a === b)
      return true;
    let aValidType = isDate$2(a);
    let bValidType = isDate$2(b);
    if (aValidType || bValidType) {
      return aValidType && bValidType ? a.getTime() === b.getTime() : false;
    }
    aValidType = isSymbol(a);
    bValidType = isSymbol(b);
    if (aValidType || bValidType) {
      return a === b;
    }
    aValidType = isArray(a);
    bValidType = isArray(b);
    if (aValidType || bValidType) {
      return aValidType && bValidType ? looseCompareArrays(a, b) : false;
    }
    aValidType = isObject$4(a);
    bValidType = isObject$4(b);
    if (aValidType || bValidType) {
      if (!aValidType || !bValidType) {
        return false;
      }
      const aKeysCount = Object.keys(a).length;
      const bKeysCount = Object.keys(b).length;
      if (aKeysCount !== bKeysCount) {
        return false;
      }
      for (const key in a) {
        const aHasKey = a.hasOwnProperty(key);
        const bHasKey = b.hasOwnProperty(key);
        if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
          return false;
        }
      }
    }
    return String(a) === String(b);
  }
  function looseIndexOf(arr, val) {
    return arr.findIndex((item) => looseEqual(item, val));
  }
  const toDisplayString = (val) => {
    return isString(val) ? val : val == null ? "" : isArray(val) || isObject$4(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
  };
  const replacer = (_key, val) => {
    if (val && val.__v_isRef) {
      return replacer(_key, val.value);
    } else if (isMap(val)) {
      return {
        [`Map(${val.size})`]: [...val.entries()].reduce(
          (entries, [key, val2], i) => {
            entries[stringifySymbol(key, i) + " =>"] = val2;
            return entries;
          },
          {}
        )
      };
    } else if (isSet(val)) {
      return {
        [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
      };
    } else if (isSymbol(val)) {
      return stringifySymbol(val);
    } else if (isObject$4(val) && !isArray(val) && !isPlainObject$2(val)) {
      return String(val);
    }
    return val;
  };
  const stringifySymbol = (v, i = "") => {
    var _a;
    return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
  };
  /**
  * @vue/reactivity v3.4.14
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  let activeEffectScope;
  class EffectScope {
    constructor(detached = false) {
      this.detached = detached;
      this._active = true;
      this.effects = [];
      this.cleanups = [];
      this.parent = activeEffectScope;
      if (!detached && activeEffectScope) {
        this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1;
      }
    }
    get active() {
      return this._active;
    }
    run(fn) {
      if (this._active) {
        const currentEffectScope = activeEffectScope;
        try {
          activeEffectScope = this;
          return fn();
        } finally {
          activeEffectScope = currentEffectScope;
        }
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    on() {
      activeEffectScope = this;
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    off() {
      activeEffectScope = this.parent;
    }
    stop(fromParent) {
      if (this._active) {
        let i, l2;
        for (i = 0, l2 = this.effects.length; i < l2; i++) {
          this.effects[i].stop();
        }
        for (i = 0, l2 = this.cleanups.length; i < l2; i++) {
          this.cleanups[i]();
        }
        if (this.scopes) {
          for (i = 0, l2 = this.scopes.length; i < l2; i++) {
            this.scopes[i].stop(true);
          }
        }
        if (!this.detached && this.parent && !fromParent) {
          const last = this.parent.scopes.pop();
          if (last && last !== this) {
            this.parent.scopes[this.index] = last;
            last.index = this.index;
          }
        }
        this.parent = void 0;
        this._active = false;
      }
    }
  }
  function effectScope(detached) {
    return new EffectScope(detached);
  }
  function recordEffectScope(effect2, scope = activeEffectScope) {
    if (scope && scope.active) {
      scope.effects.push(effect2);
    }
  }
  function getCurrentScope() {
    return activeEffectScope;
  }
  function onScopeDispose(fn) {
    if (activeEffectScope) {
      activeEffectScope.cleanups.push(fn);
    }
  }
  let activeEffect;
  class ReactiveEffect {
    constructor(fn, trigger2, scheduler, scope) {
      this.fn = fn;
      this.trigger = trigger2;
      this.scheduler = scheduler;
      this.active = true;
      this.deps = [];
      this._dirtyLevel = 2;
      this._trackId = 0;
      this._runnings = 0;
      this._shouldSchedule = false;
      this._depsLength = 0;
      recordEffectScope(this, scope);
    }
    get dirty() {
      if (this._dirtyLevel === 1) {
        pauseTracking();
        for (let i = 0; i < this._depsLength; i++) {
          const dep = this.deps[i];
          if (dep.computed) {
            triggerComputed(dep.computed);
            if (this._dirtyLevel >= 2) {
              break;
            }
          }
        }
        if (this._dirtyLevel < 2) {
          this._dirtyLevel = 0;
        }
        resetTracking();
      }
      return this._dirtyLevel >= 2;
    }
    set dirty(v) {
      this._dirtyLevel = v ? 2 : 0;
    }
    run() {
      this._dirtyLevel = 0;
      if (!this.active) {
        return this.fn();
      }
      let lastShouldTrack = shouldTrack;
      let lastEffect = activeEffect;
      try {
        shouldTrack = true;
        activeEffect = this;
        this._runnings++;
        preCleanupEffect(this);
        return this.fn();
      } finally {
        postCleanupEffect(this);
        this._runnings--;
        activeEffect = lastEffect;
        shouldTrack = lastShouldTrack;
      }
    }
    stop() {
      var _a;
      if (this.active) {
        preCleanupEffect(this);
        postCleanupEffect(this);
        (_a = this.onStop) == null ? void 0 : _a.call(this);
        this.active = false;
      }
    }
  }
  function triggerComputed(computed2) {
    return computed2.value;
  }
  function preCleanupEffect(effect2) {
    effect2._trackId++;
    effect2._depsLength = 0;
  }
  function postCleanupEffect(effect2) {
    if (effect2.deps && effect2.deps.length > effect2._depsLength) {
      for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
        cleanupDepEffect(effect2.deps[i], effect2);
      }
      effect2.deps.length = effect2._depsLength;
    }
  }
  function cleanupDepEffect(dep, effect2) {
    const trackId = dep.get(effect2);
    if (trackId !== void 0 && effect2._trackId !== trackId) {
      dep.delete(effect2);
      if (dep.size === 0) {
        dep.cleanup();
      }
    }
  }
  function effect(fn, options) {
    if (fn.effect instanceof ReactiveEffect) {
      fn = fn.effect.fn;
    }
    const _effect = new ReactiveEffect(fn, NOOP, () => {
      if (_effect.dirty) {
        _effect.run();
      }
    });
    if (options) {
      extend(_effect, options);
      if (options.scope)
        recordEffectScope(_effect, options.scope);
    }
    if (!options || !options.lazy) {
      _effect.run();
    }
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
  }
  function stop$1(runner) {
    runner.effect.stop();
  }
  let shouldTrack = true;
  let pauseScheduleStack = 0;
  const trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function pauseScheduling() {
    pauseScheduleStack++;
  }
  function resetScheduling() {
    pauseScheduleStack--;
    while (!pauseScheduleStack && queueEffectSchedulers.length) {
      queueEffectSchedulers.shift()();
    }
  }
  function trackEffect(effect2, dep, debuggerEventExtraInfo) {
    if (dep.get(effect2) !== effect2._trackId) {
      dep.set(effect2, effect2._trackId);
      const oldDep = effect2.deps[effect2._depsLength];
      if (oldDep !== dep) {
        if (oldDep) {
          cleanupDepEffect(oldDep, effect2);
        }
        effect2.deps[effect2._depsLength++] = dep;
      } else {
        effect2._depsLength++;
      }
    }
  }
  const queueEffectSchedulers = [];
  function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
    pauseScheduling();
    for (const effect2 of dep.keys()) {
      if (dep.get(effect2) !== effect2._trackId) {
        continue;
      }
      if (effect2._dirtyLevel < dirtyLevel && !(effect2._runnings && !effect2.allowRecurse)) {
        const lastDirtyLevel = effect2._dirtyLevel;
        effect2._dirtyLevel = dirtyLevel;
        if (lastDirtyLevel === 0) {
          effect2._shouldSchedule = true;
          effect2.trigger();
        }
      }
      if (effect2.scheduler && effect2._shouldSchedule && (!effect2._runnings || effect2.allowRecurse)) {
        effect2._shouldSchedule = false;
        queueEffectSchedulers.push(effect2.scheduler);
      }
    }
    resetScheduling();
  }
  const createDep = (cleanup, computed2) => {
    const dep = /* @__PURE__ */ new Map();
    dep.cleanup = cleanup;
    dep.computed = computed2;
    return dep;
  };
  const targetMap = /* @__PURE__ */ new WeakMap();
  const ITERATE_KEY = Symbol("");
  const MAP_KEY_ITERATE_KEY = Symbol("");
  function track(target, type, key) {
    if (shouldTrack && activeEffect) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
      }
      trackEffect(
        activeEffect,
        dep
      );
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    let deps = [];
    if (type === "clear") {
      deps = [...depsMap.values()];
    } else if (key === "length" && isArray(target)) {
      const newLength = Number(newValue);
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
          deps.push(dep);
        }
      });
    } else {
      if (key !== void 0) {
        deps.push(depsMap.get(key));
      }
      switch (type) {
        case "add":
          if (!isArray(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isIntegerKey(key)) {
            deps.push(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!isArray(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
    pauseScheduling();
    for (const dep of deps) {
      if (dep) {
        triggerEffects(
          dep,
          2
        );
      }
    }
    resetScheduling();
  }
  function getDepFromReactive(object2, key) {
    var _a;
    return (_a = targetMap.get(object2)) == null ? void 0 : _a.get(key);
  }
  const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
  const builtInSymbols = new Set(
    /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
  );
  const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
  function createArrayInstrumentations() {
    const instrumentations = {};
    ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
      instrumentations[key] = function(...args) {
        const arr = toRaw(this);
        for (let i = 0, l2 = this.length; i < l2; i++) {
          track(arr, "get", i + "");
        }
        const res = arr[key](...args);
        if (res === -1 || res === false) {
          return arr[key](...args.map(toRaw));
        } else {
          return res;
        }
      };
    });
    ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
      instrumentations[key] = function(...args) {
        pauseTracking();
        pauseScheduling();
        const res = toRaw(this)[key].apply(this, args);
        resetScheduling();
        resetTracking();
        return res;
      };
    });
    return instrumentations;
  }
  function hasOwnProperty$1(key) {
    const obj = toRaw(this);
    track(obj, "has", key);
    return obj.hasOwnProperty(key);
  }
  class BaseReactiveHandler {
    constructor(_isReadonly = false, _shallow = false) {
      this._isReadonly = _isReadonly;
      this._shallow = _shallow;
    }
    get(target, key, receiver) {
      const isReadonly2 = this._isReadonly, shallow = this._shallow;
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_isShallow") {
        return shallow;
      } else if (key === "__v_raw") {
        if (receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
        // this means the reciever is a user proxy of the reactive proxy
        Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
          return target;
        }
        return;
      }
      const targetIsArray = isArray(target);
      if (!isReadonly2) {
        if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
          return Reflect.get(arrayInstrumentations, key, receiver);
        }
        if (key === "hasOwnProperty") {
          return hasOwnProperty$1;
        }
      }
      const res = Reflect.get(target, key, receiver);
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (shallow) {
        return res;
      }
      if (isRef(res)) {
        return targetIsArray && isIntegerKey(key) ? res : res.value;
      }
      if (isObject$4(res)) {
        return isReadonly2 ? readonly(res) : reactive(res);
      }
      return res;
    }
  }
  class MutableReactiveHandler extends BaseReactiveHandler {
    constructor(shallow = false) {
      super(false, shallow);
    }
    set(target, key, value, receiver) {
      let oldValue = target[key];
      if (!this._shallow) {
        const isOldValueReadonly = isReadonly(oldValue);
        if (!isShallow(value) && !isReadonly(value)) {
          oldValue = toRaw(oldValue);
          value = toRaw(value);
        }
        if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
          if (isOldValueReadonly) {
            return false;
          } else {
            oldValue.value = value;
            return true;
          }
        }
      }
      const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
      const result = Reflect.set(target, key, value, receiver);
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
      }
      return result;
    }
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
        trigger(target, "delete", key, void 0);
      }
      return result;
    }
    has(target, key) {
      const result = Reflect.has(target, key);
      if (!isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has", key);
      }
      return result;
    }
    ownKeys(target) {
      track(
        target,
        "iterate",
        isArray(target) ? "length" : ITERATE_KEY
      );
      return Reflect.ownKeys(target);
    }
  }
  class ReadonlyReactiveHandler extends BaseReactiveHandler {
    constructor(shallow = false) {
      super(true, shallow);
    }
    set(target, key) {
      return true;
    }
    deleteProperty(target, key) {
      return true;
    }
  }
  const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
  const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
  const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
    true
  );
  const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
  const toShallow = (value) => value;
  const getProto = (v) => Reflect.getPrototypeOf(v);
  function get(target, key, isReadonly2 = false, isShallow2 = false) {
    target = target["__v_raw"];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (!isReadonly2) {
      if (hasChanged(key, rawKey)) {
        track(rawTarget, "get", key);
      }
      track(rawTarget, "get", rawKey);
    }
    const { has: has2 } = getProto(rawTarget);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    if (has2.call(rawTarget, key)) {
      return wrap(target.get(key));
    } else if (has2.call(rawTarget, rawKey)) {
      return wrap(target.get(rawKey));
    } else if (target !== rawTarget) {
      target.get(key);
    }
  }
  function has(key, isReadonly2 = false) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (!isReadonly2) {
      if (hasChanged(key, rawKey)) {
        track(rawTarget, "has", key);
      }
      track(rawTarget, "has", rawKey);
    }
    return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
  }
  function size(target, isReadonly2 = false) {
    target = target["__v_raw"];
    !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
    return Reflect.get(target, "size", target);
  }
  function add(value) {
    value = toRaw(value);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, value);
    if (!hadKey) {
      target.add(value);
      trigger(target, "add", value, value);
    }
    return this;
  }
  function set$1(key, value) {
    value = toRaw(value);
    const target = toRaw(this);
    const { has: has2, get: get2 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    }
    const oldValue = get2.call(target, key);
    target.set(key, value);
    if (!hadKey) {
      trigger(target, "add", key, value);
    } else if (hasChanged(value, oldValue)) {
      trigger(target, "set", key, value);
    }
    return this;
  }
  function deleteEntry(key) {
    const target = toRaw(this);
    const { has: has2, get: get2 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    }
    get2 ? get2.call(target, key) : void 0;
    const result = target.delete(key);
    if (hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  function clear() {
    const target = toRaw(this);
    const hadItems = target.size !== 0;
    const result = target.clear();
    if (hadItems) {
      trigger(target, "clear", void 0, void 0);
    }
    return result;
  }
  function createForEach(isReadonly2, isShallow2) {
    return function forEach2(callback, thisArg) {
      const observed = this;
      const target = observed["__v_raw"];
      const rawTarget = toRaw(target);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    };
  }
  function createIterableMethod(method, isReadonly2, isShallow2) {
    return function(...args) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const targetIsMap = isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(
        rawTarget,
        "iterate",
        isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
      );
      return {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        // iterable protocol
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      return type === "delete" ? false : type === "clear" ? void 0 : this;
    };
  }
  function createInstrumentations() {
    const mutableInstrumentations2 = {
      get(key) {
        return get(this, key);
      },
      get size() {
        return size(this);
      },
      has,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, false)
    };
    const shallowInstrumentations2 = {
      get(key) {
        return get(this, key, false, true);
      },
      get size() {
        return size(this);
      },
      has,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, true)
    };
    const readonlyInstrumentations2 = {
      get(key) {
        return get(this, key, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has.call(this, key, true);
      },
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear"),
      forEach: createForEach(true, false)
    };
    const shallowReadonlyInstrumentations2 = {
      get(key) {
        return get(this, key, true, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has.call(this, key, true);
      },
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear"),
      forEach: createForEach(true, true)
    };
    const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
    iteratorMethods.forEach((method) => {
      mutableInstrumentations2[method] = createIterableMethod(
        method,
        false,
        false
      );
      readonlyInstrumentations2[method] = createIterableMethod(
        method,
        true,
        false
      );
      shallowInstrumentations2[method] = createIterableMethod(
        method,
        false,
        true
      );
      shallowReadonlyInstrumentations2[method] = createIterableMethod(
        method,
        true,
        true
      );
    });
    return [
      mutableInstrumentations2,
      readonlyInstrumentations2,
      shallowInstrumentations2,
      shallowReadonlyInstrumentations2
    ];
  }
  const [
    mutableInstrumentations,
    readonlyInstrumentations,
    shallowInstrumentations,
    shallowReadonlyInstrumentations
  ] = /* @__PURE__ */ createInstrumentations();
  function createInstrumentationGetter(isReadonly2, shallow) {
    const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(
        hasOwn(instrumentations, key) && key in target ? instrumentations : target,
        key,
        receiver
      );
    };
  }
  const mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, false)
  };
  const shallowCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, true)
  };
  const readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, false)
  };
  const shallowReadonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, true)
  };
  const reactiveMap = /* @__PURE__ */ new WeakMap();
  const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  const readonlyMap = /* @__PURE__ */ new WeakMap();
  const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function getTargetType(value) {
    return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
  }
  function reactive(target) {
    if (isReadonly(target)) {
      return target;
    }
    return createReactiveObject(
      target,
      false,
      mutableHandlers,
      mutableCollectionHandlers,
      reactiveMap
    );
  }
  function shallowReactive(target) {
    return createReactiveObject(
      target,
      false,
      shallowReactiveHandlers,
      shallowCollectionHandlers,
      shallowReactiveMap
    );
  }
  function readonly(target) {
    return createReactiveObject(
      target,
      true,
      readonlyHandlers,
      readonlyCollectionHandlers,
      readonlyMap
    );
  }
  function shallowReadonly(target) {
    return createReactiveObject(
      target,
      true,
      shallowReadonlyHandlers,
      shallowReadonlyCollectionHandlers,
      shallowReadonlyMap
    );
  }
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject$4(target)) {
      return target;
    }
    if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const targetType = getTargetType(target);
    if (targetType === 0) {
      return target;
    }
    const proxy = new Proxy(
      target,
      targetType === 2 ? collectionHandlers : baseHandlers
    );
    proxyMap.set(target, proxy);
    return proxy;
  }
  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"]);
    }
    return !!(value && value["__v_isReactive"]);
  }
  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"]);
  }
  function isShallow(value) {
    return !!(value && value["__v_isShallow"]);
  }
  function isProxy(value) {
    return isReactive(value) || isReadonly(value);
  }
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? toRaw(raw) : observed;
  }
  function markRaw(value) {
    def(value, "__v_skip", true);
    return value;
  }
  const toReactive = (value) => isObject$4(value) ? reactive(value) : value;
  const toReadonly = (value) => isObject$4(value) ? readonly(value) : value;
  class ComputedRefImpl {
    constructor(getter, _setter, isReadonly2, isSSR) {
      this._setter = _setter;
      this.dep = void 0;
      this.__v_isRef = true;
      this["__v_isReadonly"] = false;
      this.effect = new ReactiveEffect(
        () => getter(this._value),
        () => triggerRefValue(this, 1)
      );
      this.effect.computed = this;
      this.effect.active = this._cacheable = !isSSR;
      this["__v_isReadonly"] = isReadonly2;
    }
    get value() {
      const self2 = toRaw(this);
      if (!self2._cacheable || self2.effect.dirty) {
        if (hasChanged(self2._value, self2._value = self2.effect.run())) {
          triggerRefValue(self2, 2);
        }
      }
      trackRefValue(self2);
      return self2._value;
    }
    set value(newValue) {
      this._setter(newValue);
    }
    // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
    get _dirty() {
      return this.effect.dirty;
    }
    set _dirty(v) {
      this.effect.dirty = v;
    }
    // #endregion
  }
  function computed$1(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    const onlyGetter = isFunction(getterOrOptions);
    if (onlyGetter) {
      getter = getterOrOptions;
      setter = NOOP;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
    return cRef;
  }
  function trackRefValue(ref2) {
    if (shouldTrack && activeEffect) {
      ref2 = toRaw(ref2);
      trackEffect(
        activeEffect,
        ref2.dep || (ref2.dep = createDep(
          () => ref2.dep = void 0,
          ref2 instanceof ComputedRefImpl ? ref2 : void 0
        ))
      );
    }
  }
  function triggerRefValue(ref2, dirtyLevel = 2, newVal) {
    ref2 = toRaw(ref2);
    const dep = ref2.dep;
    if (dep) {
      triggerEffects(
        dep,
        dirtyLevel
      );
    }
  }
  function isRef(r2) {
    return !!(r2 && r2.__v_isRef === true);
  }
  function ref(value) {
    return createRef(value, false);
  }
  function shallowRef(value) {
    return createRef(value, true);
  }
  function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
      return rawValue;
    }
    return new RefImpl(rawValue, shallow);
  }
  class RefImpl {
    constructor(value, __v_isShallow) {
      this.__v_isShallow = __v_isShallow;
      this.dep = void 0;
      this.__v_isRef = true;
      this._rawValue = __v_isShallow ? value : toRaw(value);
      this._value = __v_isShallow ? value : toReactive(value);
    }
    get value() {
      trackRefValue(this);
      return this._value;
    }
    set value(newVal) {
      const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
      newVal = useDirectValue ? newVal : toRaw(newVal);
      if (hasChanged(newVal, this._rawValue)) {
        this._rawValue = newVal;
        this._value = useDirectValue ? newVal : toReactive(newVal);
        triggerRefValue(this, 2);
      }
    }
  }
  function triggerRef(ref2) {
    triggerRefValue(ref2, 2);
  }
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  function toValue(source) {
    return isFunction(source) ? source() : unref(source);
  }
  const shallowUnwrapHandlers = {
    get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  };
  function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }
  class CustomRefImpl {
    constructor(factory) {
      this.dep = void 0;
      this.__v_isRef = true;
      const { get: get2, set: set2 } = factory(
        () => trackRefValue(this),
        () => triggerRefValue(this)
      );
      this._get = get2;
      this._set = set2;
    }
    get value() {
      return this._get();
    }
    set value(newVal) {
      this._set(newVal);
    }
  }
  function customRef(factory) {
    return new CustomRefImpl(factory);
  }
  function toRefs(object2) {
    const ret = isArray(object2) ? new Array(object2.length) : {};
    for (const key in object2) {
      ret[key] = propertyToRef(object2, key);
    }
    return ret;
  }
  class ObjectRefImpl {
    constructor(_object, _key, _defaultValue) {
      this._object = _object;
      this._key = _key;
      this._defaultValue = _defaultValue;
      this.__v_isRef = true;
    }
    get value() {
      const val = this._object[this._key];
      return val === void 0 ? this._defaultValue : val;
    }
    set value(newVal) {
      this._object[this._key] = newVal;
    }
    get dep() {
      return getDepFromReactive(toRaw(this._object), this._key);
    }
  }
  class GetterRefImpl {
    constructor(_getter) {
      this._getter = _getter;
      this.__v_isRef = true;
      this.__v_isReadonly = true;
    }
    get value() {
      return this._getter();
    }
  }
  function toRef(source, key, defaultValue) {
    if (isRef(source)) {
      return source;
    } else if (isFunction(source)) {
      return new GetterRefImpl(source);
    } else if (isObject$4(source) && arguments.length > 1) {
      return propertyToRef(source, key, defaultValue);
    } else {
      return ref(source);
    }
  }
  function propertyToRef(source, key, defaultValue) {
    const val = source[key];
    return isRef(val) ? val : new ObjectRefImpl(source, key, defaultValue);
  }
  const TrackOpTypes = {
    "GET": "get",
    "HAS": "has",
    "ITERATE": "iterate"
  };
  const TriggerOpTypes = {
    "SET": "set",
    "ADD": "add",
    "DELETE": "delete",
    "CLEAR": "clear"
  };
  /**
  * @vue/runtime-core v3.4.14
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  const stack = [];
  function warn$1(msg, ...args) {
    pauseTracking();
    const instance = stack.length ? stack[stack.length - 1].component : null;
    const appWarnHandler = instance && instance.appContext.config.warnHandler;
    const trace = getComponentTrace();
    if (appWarnHandler) {
      callWithErrorHandling(
        appWarnHandler,
        instance,
        11,
        [
          msg + args.join(""),
          instance && instance.proxy,
          trace.map(
            ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
          ).join("\n"),
          trace
        ]
      );
    } else {
      const warnArgs = [`[Vue warn]: ${msg}`, ...args];
      if (trace.length && // avoid spamming console during tests
      true) {
        warnArgs.push(`
`, ...formatTrace(trace));
      }
      console.warn(...warnArgs);
    }
    resetTracking();
  }
  function getComponentTrace() {
    let currentVNode = stack[stack.length - 1];
    if (!currentVNode) {
      return [];
    }
    const normalizedStack = [];
    while (currentVNode) {
      const last = normalizedStack[0];
      if (last && last.vnode === currentVNode) {
        last.recurseCount++;
      } else {
        normalizedStack.push({
          vnode: currentVNode,
          recurseCount: 0
        });
      }
      const parentInstance = currentVNode.component && currentVNode.component.parent;
      currentVNode = parentInstance && parentInstance.vnode;
    }
    return normalizedStack;
  }
  function formatTrace(trace) {
    const logs = [];
    trace.forEach((entry, i) => {
      logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
    });
    return logs;
  }
  function formatTraceEntry({ vnode, recurseCount }) {
    const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
    const isRoot = vnode.component ? vnode.component.parent == null : false;
    const open = ` at <${formatComponentName(
      vnode.component,
      vnode.type,
      isRoot
    )}`;
    const close = `>` + postfix;
    return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
  }
  function formatProps(props) {
    const res = [];
    const keys = Object.keys(props);
    keys.slice(0, 3).forEach((key) => {
      res.push(...formatProp(key, props[key]));
    });
    if (keys.length > 3) {
      res.push(` ...`);
    }
    return res;
  }
  function formatProp(key, value, raw) {
    if (isString(value)) {
      value = JSON.stringify(value);
      return raw ? value : [`${key}=${value}`];
    } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
      return raw ? value : [`${key}=${value}`];
    } else if (isRef(value)) {
      value = formatProp(key, toRaw(value.value), true);
      return raw ? value : [`${key}=Ref<`, value, `>`];
    } else if (isFunction(value)) {
      return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
    } else {
      value = toRaw(value);
      return raw ? value : [`${key}=`, value];
    }
  }
  function assertNumber(val, type) {
    return;
  }
  const ErrorCodes = {
    "SETUP_FUNCTION": 0,
    "0": "SETUP_FUNCTION",
    "RENDER_FUNCTION": 1,
    "1": "RENDER_FUNCTION",
    "WATCH_GETTER": 2,
    "2": "WATCH_GETTER",
    "WATCH_CALLBACK": 3,
    "3": "WATCH_CALLBACK",
    "WATCH_CLEANUP": 4,
    "4": "WATCH_CLEANUP",
    "NATIVE_EVENT_HANDLER": 5,
    "5": "NATIVE_EVENT_HANDLER",
    "COMPONENT_EVENT_HANDLER": 6,
    "6": "COMPONENT_EVENT_HANDLER",
    "VNODE_HOOK": 7,
    "7": "VNODE_HOOK",
    "DIRECTIVE_HOOK": 8,
    "8": "DIRECTIVE_HOOK",
    "TRANSITION_HOOK": 9,
    "9": "TRANSITION_HOOK",
    "APP_ERROR_HANDLER": 10,
    "10": "APP_ERROR_HANDLER",
    "APP_WARN_HANDLER": 11,
    "11": "APP_WARN_HANDLER",
    "FUNCTION_REF": 12,
    "12": "FUNCTION_REF",
    "ASYNC_COMPONENT_LOADER": 13,
    "13": "ASYNC_COMPONENT_LOADER",
    "SCHEDULER": 14,
    "14": "SCHEDULER"
  };
  const ErrorTypeStrings$1 = {
    ["sp"]: "serverPrefetch hook",
    ["bc"]: "beforeCreate hook",
    ["c"]: "created hook",
    ["bm"]: "beforeMount hook",
    ["m"]: "mounted hook",
    ["bu"]: "beforeUpdate hook",
    ["u"]: "updated",
    ["bum"]: "beforeUnmount hook",
    ["um"]: "unmounted hook",
    ["a"]: "activated hook",
    ["da"]: "deactivated hook",
    ["ec"]: "errorCaptured hook",
    ["rtc"]: "renderTracked hook",
    ["rtg"]: "renderTriggered hook",
    [0]: "setup function",
    [1]: "render function",
    [2]: "watcher getter",
    [3]: "watcher callback",
    [4]: "watcher cleanup function",
    [5]: "native event handler",
    [6]: "component event handler",
    [7]: "vnode hook",
    [8]: "directive hook",
    [9]: "transition hook",
    [10]: "app errorHandler",
    [11]: "app warnHandler",
    [12]: "ref function",
    [13]: "async component loader",
    [14]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://github.com/vuejs/core ."
  };
  function callWithErrorHandling(fn, instance, type, args) {
    let res;
    try {
      res = args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, instance, type);
    }
    return res;
  }
  function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunction(fn)) {
      const res = callWithErrorHandling(fn, instance, type, args);
      if (res && isPromise(res)) {
        res.catch((err) => {
          handleError(err, instance, type);
        });
      }
      return res;
    }
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
  function handleError(err, instance, type, throwInDev = true) {
    const contextVNode = instance ? instance.vnode : null;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy;
      const errorInfo = `https://vuejs.org/errors/#runtime-${type}`;
      while (cur) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }
        cur = cur.parent;
      }
      const appErrorHandler = instance.appContext.config.errorHandler;
      if (appErrorHandler) {
        callWithErrorHandling(
          appErrorHandler,
          null,
          10,
          [err, exposedInstance, errorInfo]
        );
        return;
      }
    }
    logError(err, type, contextVNode, throwInDev);
  }
  function logError(err, type, contextVNode, throwInDev = true) {
    {
      console.error(err);
    }
  }
  let isFlushing = false;
  let isFlushPending = false;
  const queue = [];
  let flushIndex = 0;
  const pendingPostFlushCbs = [];
  let activePostFlushCbs = null;
  let postFlushIndex = 0;
  const resolvedPromise = /* @__PURE__ */ Promise.resolve();
  let currentFlushPromise = null;
  function nextTick(fn) {
    const p2 = currentFlushPromise || resolvedPromise;
    return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
  }
  function findInsertionIndex(id) {
    let start = flushIndex + 1;
    let end = queue.length;
    while (start < end) {
      const middle = start + end >>> 1;
      const middleJob = queue[middle];
      const middleJobId = getId(middleJob);
      if (middleJobId < id || middleJobId === id && middleJob.pre) {
        start = middle + 1;
      } else {
        end = middle;
      }
    }
    return start;
  }
  function queueJob(job) {
    if (!queue.length || !queue.includes(
      job,
      isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
    )) {
      if (job.id == null) {
        queue.push(job);
      } else {
        queue.splice(findInsertionIndex(job.id), 0, job);
      }
      queueFlush();
    }
  }
  function queueFlush() {
    if (!isFlushing && !isFlushPending) {
      isFlushPending = true;
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }
  function invalidateJob(job) {
    const i = queue.indexOf(job);
    if (i > flushIndex) {
      queue.splice(i, 1);
    }
  }
  function queuePostFlushCb(cb) {
    if (!isArray(cb)) {
      if (!activePostFlushCbs || !activePostFlushCbs.includes(
        cb,
        cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
      )) {
        pendingPostFlushCbs.push(cb);
      }
    } else {
      pendingPostFlushCbs.push(...cb);
    }
    queueFlush();
  }
  function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
    for (; i < queue.length; i++) {
      const cb = queue[i];
      if (cb && cb.pre) {
        if (instance && cb.id !== instance.uid) {
          continue;
        }
        queue.splice(i, 1);
        i--;
        cb();
      }
    }
  }
  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      const deduped = [...new Set(pendingPostFlushCbs)].sort(
        (a, b) => getId(a) - getId(b)
      );
      pendingPostFlushCbs.length = 0;
      if (activePostFlushCbs) {
        activePostFlushCbs.push(...deduped);
        return;
      }
      activePostFlushCbs = deduped;
      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        activePostFlushCbs[postFlushIndex]();
      }
      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }
  const getId = (job) => job.id == null ? Infinity : job.id;
  const comparator = (a, b) => {
    const diff2 = getId(a) - getId(b);
    if (diff2 === 0) {
      if (a.pre && !b.pre)
        return -1;
      if (b.pre && !a.pre)
        return 1;
    }
    return diff2;
  };
  function flushJobs(seen) {
    isFlushPending = false;
    isFlushing = true;
    queue.sort(comparator);
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job && job.active !== false) {
          if (false)
            ;
          callWithErrorHandling(job, null, 14);
        }
      }
    } finally {
      flushIndex = 0;
      queue.length = 0;
      flushPostFlushCbs();
      isFlushing = false;
      currentFlushPromise = null;
      if (queue.length || pendingPostFlushCbs.length) {
        flushJobs();
      }
    }
  }
  let devtools$1;
  let buffer = [];
  function setDevtoolsHook$1(hook, target) {
    var _a, _b;
    devtools$1 = hook;
    if (devtools$1) {
      devtools$1.enabled = true;
      buffer.forEach(({ event, args }) => devtools$1.emit(event, ...args));
      buffer = [];
    } else if (
      // handle late devtools injection - only do this if we are in an actual
      // browser environment to avoid the timer handle stalling test runner exit
      // (#4815)
      typeof window !== "undefined" && // some envs mock window but not fully
      window.HTMLElement && // also exclude jsdom
      !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
    ) {
      const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
      replay.push((newHook) => {
        setDevtoolsHook$1(newHook, target);
      });
      setTimeout(() => {
        if (!devtools$1) {
          target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
          buffer = [];
        }
      }, 3e3);
    } else {
      buffer = [];
    }
  }
  function emit(instance, event, ...rawArgs) {
    if (instance.isUnmounted)
      return;
    const props = instance.vnode.props || EMPTY_OBJ;
    let args = rawArgs;
    const isModelListener2 = event.startsWith("update:");
    const modelArg = isModelListener2 && event.slice(7);
    if (modelArg && modelArg in props) {
      const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
      const { number: number2, trim } = props[modifiersKey] || EMPTY_OBJ;
      if (trim) {
        args = rawArgs.map((a) => isString(a) ? a.trim() : a);
      }
      if (number2) {
        args = rawArgs.map(looseToNumber);
      }
    }
    let handlerName;
    let handler2 = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
    props[handlerName = toHandlerKey(camelize(event))];
    if (!handler2 && isModelListener2) {
      handler2 = props[handlerName = toHandlerKey(hyphenate(event))];
    }
    if (handler2) {
      callWithAsyncErrorHandling(
        handler2,
        instance,
        6,
        args
      );
    }
    const onceHandler = props[handlerName + `Once`];
    if (onceHandler) {
      if (!instance.emitted) {
        instance.emitted = {};
      } else if (instance.emitted[handlerName]) {
        return;
      }
      instance.emitted[handlerName] = true;
      callWithAsyncErrorHandling(
        onceHandler,
        instance,
        6,
        args
      );
    }
  }
  function normalizeEmitsOptions(comp, appContext, asMixin = false) {
    const cache = appContext.emitsCache;
    const cached = cache.get(comp);
    if (cached !== void 0) {
      return cached;
    }
    const raw = comp.emits;
    let normalized = {};
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendEmits = (raw2) => {
        const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
        if (normalizedFromExtend) {
          hasExtends = true;
          extend(normalized, normalizedFromExtend);
        }
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendEmits);
      }
      if (comp.extends) {
        extendEmits(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendEmits);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject$4(comp)) {
        cache.set(comp, null);
      }
      return null;
    }
    if (isArray(raw)) {
      raw.forEach((key) => normalized[key] = null);
    } else {
      extend(normalized, raw);
    }
    if (isObject$4(comp)) {
      cache.set(comp, normalized);
    }
    return normalized;
  }
  function isEmitListener(options, key) {
    if (!options || !isOn(key)) {
      return false;
    }
    key = key.slice(2).replace(/Once$/, "");
    return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
  }
  let currentRenderingInstance = null;
  let currentScopeId = null;
  function setCurrentRenderingInstance(instance) {
    const prev = currentRenderingInstance;
    currentRenderingInstance = instance;
    currentScopeId = instance && instance.type.__scopeId || null;
    return prev;
  }
  function pushScopeId(id) {
    currentScopeId = id;
  }
  function popScopeId() {
    currentScopeId = null;
  }
  const withScopeId = (_id2) => withCtx;
  function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
    if (!ctx)
      return fn;
    if (fn._n) {
      return fn;
    }
    const renderFnWithContext = (...args) => {
      if (renderFnWithContext._d) {
        setBlockTracking(-1);
      }
      const prevInstance = setCurrentRenderingInstance(ctx);
      let res;
      try {
        res = fn(...args);
      } finally {
        setCurrentRenderingInstance(prevInstance);
        if (renderFnWithContext._d) {
          setBlockTracking(1);
        }
      }
      return res;
    };
    renderFnWithContext._n = true;
    renderFnWithContext._c = true;
    renderFnWithContext._d = true;
    return renderFnWithContext;
  }
  function markAttrsAccessed() {
  }
  function renderComponentRoot(instance) {
    const {
      type: Component,
      vnode,
      proxy,
      withProxy,
      props,
      propsOptions: [propsOptions],
      slots,
      attrs,
      emit: emit2,
      render: render2,
      renderCache,
      data,
      setupState,
      ctx,
      inheritAttrs
    } = instance;
    let result;
    let fallthroughAttrs;
    const prev = setCurrentRenderingInstance(instance);
    try {
      if (vnode.shapeFlag & 4) {
        const proxyToUse = withProxy || proxy;
        const thisProxy = false ? new Proxy(proxyToUse, {
          get(target, key, receiver) {
            warn$1(
              `Property '${String(
                key
              )}' was accessed via 'this'. Avoid using 'this' in templates.`
            );
            return Reflect.get(target, key, receiver);
          }
        }) : proxyToUse;
        result = normalizeVNode(
          render2.call(
            thisProxy,
            proxyToUse,
            renderCache,
            props,
            setupState,
            data,
            ctx
          )
        );
        fallthroughAttrs = attrs;
      } else {
        const render22 = Component;
        if (false)
          ;
        result = normalizeVNode(
          render22.length > 1 ? render22(
            props,
            false ? {
              get attrs() {
                markAttrsAccessed();
                return attrs;
              },
              slots,
              emit: emit2
            } : { attrs, slots, emit: emit2 }
          ) : render22(
            props,
            null
            /* we know it doesn't need it */
          )
        );
        fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
      }
    } catch (err) {
      blockStack.length = 0;
      handleError(err, instance, 1);
      result = createVNode(Comment);
    }
    let root = result;
    if (fallthroughAttrs && inheritAttrs !== false) {
      const keys = Object.keys(fallthroughAttrs);
      const { shapeFlag } = root;
      if (keys.length) {
        if (shapeFlag & (1 | 6)) {
          if (propsOptions && keys.some(isModelListener)) {
            fallthroughAttrs = filterModelListeners(
              fallthroughAttrs,
              propsOptions
            );
          }
          root = cloneVNode(root, fallthroughAttrs);
        }
      }
    }
    if (vnode.dirs) {
      root = cloneVNode(root);
      root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
    }
    if (vnode.transition) {
      root.transition = vnode.transition;
    }
    {
      result = root;
    }
    setCurrentRenderingInstance(prev);
    return result;
  }
  function filterSingleRoot(children, recurse = true) {
    let singleRoot;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (isVNode(child)) {
        if (child.type !== Comment || child.children === "v-if") {
          if (singleRoot) {
            return;
          } else {
            singleRoot = child;
          }
        }
      } else {
        return;
      }
    }
    return singleRoot;
  }
  const getFunctionalFallthrough = (attrs) => {
    let res;
    for (const key in attrs) {
      if (key === "class" || key === "style" || isOn(key)) {
        (res || (res = {}))[key] = attrs[key];
      }
    }
    return res;
  };
  const filterModelListeners = (attrs, props) => {
    const res = {};
    for (const key in attrs) {
      if (!isModelListener(key) || !(key.slice(9) in props)) {
        res[key] = attrs[key];
      }
    }
    return res;
  };
  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const { props: prevProps, children: prevChildren, component } = prevVNode;
    const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
    const emits = component.emitsOptions;
    if (nextVNode.dirs || nextVNode.transition) {
      return true;
    }
    if (optimized && patchFlag >= 0) {
      if (patchFlag & 1024) {
        return true;
      }
      if (patchFlag & 16) {
        if (!prevProps) {
          return !!nextProps;
        }
        return hasPropsChanged(prevProps, nextProps, emits);
      } else if (patchFlag & 8) {
        const dynamicProps = nextVNode.dynamicProps;
        for (let i = 0; i < dynamicProps.length; i++) {
          const key = dynamicProps[i];
          if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
            return true;
          }
        }
      }
    } else {
      if (prevChildren || nextChildren) {
        if (!nextChildren || !nextChildren.$stable) {
          return true;
        }
      }
      if (prevProps === nextProps) {
        return false;
      }
      if (!prevProps) {
        return !!nextProps;
      }
      if (!nextProps) {
        return true;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    }
    return false;
  }
  function hasPropsChanged(prevProps, nextProps, emitsOptions) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
        return true;
      }
    }
    return false;
  }
  function updateHOCHostEl({ vnode, parent }, el) {
    while (parent) {
      const root = parent.subTree;
      if (root.suspense && root.suspense.activeBranch === vnode) {
        root.el = vnode.el;
      }
      if (root === vnode) {
        (vnode = parent.vnode).el = el;
        parent = parent.parent;
      } else {
        break;
      }
    }
  }
  const COMPONENTS = "components";
  const DIRECTIVES = "directives";
  function resolveComponent(name, maybeSelfReference) {
    return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
  }
  const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
  function resolveDynamicComponent(component) {
    if (isString(component)) {
      return resolveAsset(COMPONENTS, component, false) || component;
    } else {
      return component || NULL_DYNAMIC_COMPONENT;
    }
  }
  function resolveDirective(name) {
    return resolveAsset(DIRECTIVES, name);
  }
  function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
    const instance = currentRenderingInstance || currentInstance;
    if (instance) {
      const Component = instance.type;
      if (type === COMPONENTS) {
        const selfName = getComponentName(
          Component,
          false
        );
        if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
          return Component;
        }
      }
      const res = (
        // local registration
        // check instance[type] first which is resolved for options API
        resolve(instance[type] || Component[type], name) || // global registration
        resolve(instance.appContext[type], name)
      );
      if (!res && maybeSelfReference) {
        return Component;
      }
      return res;
    }
  }
  function resolve(registry, name) {
    return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
  }
  const isSuspense = (type) => type.__isSuspense;
  let suspenseId = 0;
  const SuspenseImpl = {
    name: "Suspense",
    // In order to make Suspense tree-shakable, we need to avoid importing it
    // directly in the renderer. The renderer checks for the __isSuspense flag
    // on a vnode's type and calls the `process` method, passing in renderer
    // internals.
    __isSuspense: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals) {
      if (n1 == null) {
        mountSuspense(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
          rendererInternals
        );
      } else {
        if (parentSuspense && parentSuspense.deps > 0) {
          n2.suspense = n1.suspense;
          return;
        }
        patchSuspense(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          namespace,
          slotScopeIds,
          optimized,
          rendererInternals
        );
      }
    },
    hydrate: hydrateSuspense,
    create: createSuspenseBoundary,
    normalize: normalizeSuspenseChildren
  };
  const Suspense = SuspenseImpl;
  function triggerEvent(vnode, name) {
    const eventListener = vnode.props && vnode.props[name];
    if (isFunction(eventListener)) {
      eventListener();
    }
  }
  function mountSuspense(vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals) {
    const {
      p: patch,
      o: { createElement }
    } = rendererInternals;
    const hiddenContainer = createElement("div");
    const suspense = vnode.suspense = createSuspenseBoundary(
      vnode,
      parentSuspense,
      parentComponent,
      container,
      hiddenContainer,
      anchor,
      namespace,
      slotScopeIds,
      optimized,
      rendererInternals
    );
    patch(
      null,
      suspense.pendingBranch = vnode.ssContent,
      hiddenContainer,
      null,
      parentComponent,
      suspense,
      namespace,
      slotScopeIds
    );
    if (suspense.deps > 0) {
      triggerEvent(vnode, "onPending");
      triggerEvent(vnode, "onFallback");
      patch(
        null,
        vnode.ssFallback,
        container,
        anchor,
        parentComponent,
        null,
        // fallback tree will not have suspense context
        namespace,
        slotScopeIds
      );
      setActiveBranch(suspense, vnode.ssFallback);
    } else {
      suspense.resolve(false, true);
    }
  }
  function patchSuspense(n1, n2, container, anchor, parentComponent, namespace, slotScopeIds, optimized, { p: patch, um: unmount, o: { createElement } }) {
    const suspense = n2.suspense = n1.suspense;
    suspense.vnode = n2;
    n2.el = n1.el;
    const newBranch = n2.ssContent;
    const newFallback = n2.ssFallback;
    const { activeBranch, pendingBranch, isInFallback, isHydrating } = suspense;
    if (pendingBranch) {
      suspense.pendingBranch = newBranch;
      if (isSameVNodeType(newBranch, pendingBranch)) {
        patch(
          pendingBranch,
          newBranch,
          suspense.hiddenContainer,
          null,
          parentComponent,
          suspense,
          namespace,
          slotScopeIds,
          optimized
        );
        if (suspense.deps <= 0) {
          suspense.resolve();
        } else if (isInFallback) {
          if (!isHydrating) {
            patch(
              activeBranch,
              newFallback,
              container,
              anchor,
              parentComponent,
              null,
              // fallback tree will not have suspense context
              namespace,
              slotScopeIds,
              optimized
            );
            setActiveBranch(suspense, newFallback);
          }
        }
      } else {
        suspense.pendingId = suspenseId++;
        if (isHydrating) {
          suspense.isHydrating = false;
          suspense.activeBranch = pendingBranch;
        } else {
          unmount(pendingBranch, parentComponent, suspense);
        }
        suspense.deps = 0;
        suspense.effects.length = 0;
        suspense.hiddenContainer = createElement("div");
        if (isInFallback) {
          patch(
            null,
            newBranch,
            suspense.hiddenContainer,
            null,
            parentComponent,
            suspense,
            namespace,
            slotScopeIds,
            optimized
          );
          if (suspense.deps <= 0) {
            suspense.resolve();
          } else {
            patch(
              activeBranch,
              newFallback,
              container,
              anchor,
              parentComponent,
              null,
              // fallback tree will not have suspense context
              namespace,
              slotScopeIds,
              optimized
            );
            setActiveBranch(suspense, newFallback);
          }
        } else if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
          patch(
            activeBranch,
            newBranch,
            container,
            anchor,
            parentComponent,
            suspense,
            namespace,
            slotScopeIds,
            optimized
          );
          suspense.resolve(true);
        } else {
          patch(
            null,
            newBranch,
            suspense.hiddenContainer,
            null,
            parentComponent,
            suspense,
            namespace,
            slotScopeIds,
            optimized
          );
          if (suspense.deps <= 0) {
            suspense.resolve();
          }
        }
      }
    } else {
      if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
        patch(
          activeBranch,
          newBranch,
          container,
          anchor,
          parentComponent,
          suspense,
          namespace,
          slotScopeIds,
          optimized
        );
        setActiveBranch(suspense, newBranch);
      } else {
        triggerEvent(n2, "onPending");
        suspense.pendingBranch = newBranch;
        if (newBranch.shapeFlag & 512) {
          suspense.pendingId = newBranch.component.suspenseId;
        } else {
          suspense.pendingId = suspenseId++;
        }
        patch(
          null,
          newBranch,
          suspense.hiddenContainer,
          null,
          parentComponent,
          suspense,
          namespace,
          slotScopeIds,
          optimized
        );
        if (suspense.deps <= 0) {
          suspense.resolve();
        } else {
          const { timeout: timeout2, pendingId } = suspense;
          if (timeout2 > 0) {
            setTimeout(() => {
              if (suspense.pendingId === pendingId) {
                suspense.fallback(newFallback);
              }
            }, timeout2);
          } else if (timeout2 === 0) {
            suspense.fallback(newFallback);
          }
        }
      }
    }
  }
  function createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, namespace, slotScopeIds, optimized, rendererInternals, isHydrating = false) {
    const {
      p: patch,
      m: move,
      um: unmount,
      n: next,
      o: { parentNode, remove: remove2 }
    } = rendererInternals;
    let parentSuspenseId;
    const isSuspensible = isVNodeSuspensible(vnode);
    if (isSuspensible) {
      if (parentSuspense == null ? void 0 : parentSuspense.pendingBranch) {
        parentSuspenseId = parentSuspense.pendingId;
        parentSuspense.deps++;
      }
    }
    const timeout2 = vnode.props ? toNumber$2(vnode.props.timeout) : void 0;
    const initialAnchor = anchor;
    const suspense = {
      vnode,
      parent: parentSuspense,
      parentComponent,
      namespace,
      container,
      hiddenContainer,
      deps: 0,
      pendingId: suspenseId++,
      timeout: typeof timeout2 === "number" ? timeout2 : -1,
      activeBranch: null,
      pendingBranch: null,
      isInFallback: !isHydrating,
      isHydrating,
      isUnmounted: false,
      effects: [],
      resolve(resume = false, sync = false) {
        const {
          vnode: vnode2,
          activeBranch,
          pendingBranch,
          pendingId,
          effects,
          parentComponent: parentComponent2,
          container: container2
        } = suspense;
        let delayEnter = false;
        if (suspense.isHydrating) {
          suspense.isHydrating = false;
        } else if (!resume) {
          delayEnter = activeBranch && pendingBranch.transition && pendingBranch.transition.mode === "out-in";
          if (delayEnter) {
            activeBranch.transition.afterLeave = () => {
              if (pendingId === suspense.pendingId) {
                move(
                  pendingBranch,
                  container2,
                  anchor === initialAnchor ? next(activeBranch) : anchor,
                  0
                );
                queuePostFlushCb(effects);
              }
            };
          }
          if (activeBranch) {
            if (parentNode(activeBranch.el) !== suspense.hiddenContainer) {
              anchor = next(activeBranch);
            }
            unmount(activeBranch, parentComponent2, suspense, true);
          }
          if (!delayEnter) {
            move(pendingBranch, container2, anchor, 0);
          }
        }
        setActiveBranch(suspense, pendingBranch);
        suspense.pendingBranch = null;
        suspense.isInFallback = false;
        let parent = suspense.parent;
        let hasUnresolvedAncestor = false;
        while (parent) {
          if (parent.pendingBranch) {
            parent.effects.push(...effects);
            hasUnresolvedAncestor = true;
            break;
          }
          parent = parent.parent;
        }
        if (!hasUnresolvedAncestor && !delayEnter) {
          queuePostFlushCb(effects);
        }
        suspense.effects = [];
        if (isSuspensible) {
          if (parentSuspense && parentSuspense.pendingBranch && parentSuspenseId === parentSuspense.pendingId) {
            parentSuspense.deps--;
            if (parentSuspense.deps === 0 && !sync) {
              parentSuspense.resolve();
            }
          }
        }
        triggerEvent(vnode2, "onResolve");
      },
      fallback(fallbackVNode) {
        if (!suspense.pendingBranch) {
          return;
        }
        const { vnode: vnode2, activeBranch, parentComponent: parentComponent2, container: container2, namespace: namespace2 } = suspense;
        triggerEvent(vnode2, "onFallback");
        const anchor2 = next(activeBranch);
        const mountFallback = () => {
          if (!suspense.isInFallback) {
            return;
          }
          patch(
            null,
            fallbackVNode,
            container2,
            anchor2,
            parentComponent2,
            null,
            // fallback tree will not have suspense context
            namespace2,
            slotScopeIds,
            optimized
          );
          setActiveBranch(suspense, fallbackVNode);
        };
        const delayEnter = fallbackVNode.transition && fallbackVNode.transition.mode === "out-in";
        if (delayEnter) {
          activeBranch.transition.afterLeave = mountFallback;
        }
        suspense.isInFallback = true;
        unmount(
          activeBranch,
          parentComponent2,
          null,
          // no suspense so unmount hooks fire now
          true
          // shouldRemove
        );
        if (!delayEnter) {
          mountFallback();
        }
      },
      move(container2, anchor2, type) {
        suspense.activeBranch && move(suspense.activeBranch, container2, anchor2, type);
        suspense.container = container2;
      },
      next() {
        return suspense.activeBranch && next(suspense.activeBranch);
      },
      registerDep(instance, setupRenderEffect) {
        const isInPendingSuspense = !!suspense.pendingBranch;
        if (isInPendingSuspense) {
          suspense.deps++;
        }
        const hydratedEl = instance.vnode.el;
        instance.asyncDep.catch((err) => {
          handleError(err, instance, 0);
        }).then((asyncSetupResult) => {
          if (instance.isUnmounted || suspense.isUnmounted || suspense.pendingId !== instance.suspenseId) {
            return;
          }
          instance.asyncResolved = true;
          const { vnode: vnode2 } = instance;
          handleSetupResult(instance, asyncSetupResult, false);
          if (hydratedEl) {
            vnode2.el = hydratedEl;
          }
          const placeholder = !hydratedEl && instance.subTree.el;
          setupRenderEffect(
            instance,
            vnode2,
            // component may have been moved before resolve.
            // if this is not a hydration, instance.subTree will be the comment
            // placeholder.
            parentNode(hydratedEl || instance.subTree.el),
            // anchor will not be used if this is hydration, so only need to
            // consider the comment placeholder case.
            hydratedEl ? null : next(instance.subTree),
            suspense,
            namespace,
            optimized
          );
          if (placeholder) {
            remove2(placeholder);
          }
          updateHOCHostEl(instance, vnode2.el);
          if (isInPendingSuspense && --suspense.deps === 0) {
            suspense.resolve();
          }
        });
      },
      unmount(parentSuspense2, doRemove) {
        suspense.isUnmounted = true;
        if (suspense.activeBranch) {
          unmount(
            suspense.activeBranch,
            parentComponent,
            parentSuspense2,
            doRemove
          );
        }
        if (suspense.pendingBranch) {
          unmount(
            suspense.pendingBranch,
            parentComponent,
            parentSuspense2,
            doRemove
          );
        }
      }
    };
    return suspense;
  }
  function hydrateSuspense(node, vnode, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals, hydrateNode) {
    const suspense = vnode.suspense = createSuspenseBoundary(
      vnode,
      parentSuspense,
      parentComponent,
      node.parentNode,
      // eslint-disable-next-line no-restricted-globals
      document.createElement("div"),
      null,
      namespace,
      slotScopeIds,
      optimized,
      rendererInternals,
      true
    );
    const result = hydrateNode(
      node,
      suspense.pendingBranch = vnode.ssContent,
      parentComponent,
      suspense,
      slotScopeIds,
      optimized
    );
    if (suspense.deps === 0) {
      suspense.resolve(false, true);
    }
    return result;
  }
  function normalizeSuspenseChildren(vnode) {
    const { shapeFlag, children } = vnode;
    const isSlotChildren = shapeFlag & 32;
    vnode.ssContent = normalizeSuspenseSlot(
      isSlotChildren ? children.default : children
    );
    vnode.ssFallback = isSlotChildren ? normalizeSuspenseSlot(children.fallback) : createVNode(Comment);
  }
  function normalizeSuspenseSlot(s) {
    let block;
    if (isFunction(s)) {
      const trackBlock = isBlockTreeEnabled && s._c;
      if (trackBlock) {
        s._d = false;
        openBlock();
      }
      s = s();
      if (trackBlock) {
        s._d = true;
        block = currentBlock;
        closeBlock();
      }
    }
    if (isArray(s)) {
      const singleChild = filterSingleRoot(s);
      s = singleChild;
    }
    s = normalizeVNode(s);
    if (block && !s.dynamicChildren) {
      s.dynamicChildren = block.filter((c2) => c2 !== s);
    }
    return s;
  }
  function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray(fn)) {
        suspense.effects.push(...fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn);
    }
  }
  function setActiveBranch(suspense, branch) {
    suspense.activeBranch = branch;
    const { vnode, parentComponent } = suspense;
    let el = branch.el;
    while (!el && branch.component) {
      branch = branch.component.subTree;
      el = branch.el;
    }
    vnode.el = el;
    if (parentComponent && parentComponent.subTree === vnode) {
      parentComponent.vnode.el = el;
      updateHOCHostEl(parentComponent, el);
    }
  }
  function isVNodeSuspensible(vnode) {
    var _a;
    return ((_a = vnode.props) == null ? void 0 : _a.suspensible) != null && vnode.props.suspensible !== false;
  }
  const ssrContextKey = Symbol.for("v-scx");
  const useSSRContext = () => {
    {
      const ctx = inject(ssrContextKey);
      return ctx;
    }
  };
  function watchEffect(effect2, options) {
    return doWatch(effect2, null, options);
  }
  function watchPostEffect(effect2, options) {
    return doWatch(
      effect2,
      null,
      { flush: "post" }
    );
  }
  function watchSyncEffect(effect2, options) {
    return doWatch(
      effect2,
      null,
      { flush: "sync" }
    );
  }
  const INITIAL_WATCHER_VALUE = {};
  function watch(source, cb, options) {
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, {
    immediate,
    deep,
    flush,
    once,
    onTrack,
    onTrigger
  } = EMPTY_OBJ) {
    if (cb && once) {
      const _cb = cb;
      cb = (...args) => {
        _cb(...args);
        unwatch();
      };
    }
    const instance = currentInstance;
    const reactiveGetter = (source2) => deep === true ? source2 : (
      // for deep: false, only traverse root-level properties
      traverse(source2, deep === false ? 1 : void 0)
    );
    let getter;
    let forceTrigger = false;
    let isMultiSource = false;
    if (isRef(source)) {
      getter = () => source.value;
      forceTrigger = isShallow(source);
    } else if (isReactive(source)) {
      getter = () => reactiveGetter(source);
      forceTrigger = true;
    } else if (isArray(source)) {
      isMultiSource = true;
      forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
      getter = () => source.map((s) => {
        if (isRef(s)) {
          return s.value;
        } else if (isReactive(s)) {
          return reactiveGetter(s);
        } else if (isFunction(s)) {
          return callWithErrorHandling(s, instance, 2);
        } else
          ;
      });
    } else if (isFunction(source)) {
      if (cb) {
        getter = () => callWithErrorHandling(source, instance, 2);
      } else {
        getter = () => {
          if (cleanup) {
            cleanup();
          }
          return callWithAsyncErrorHandling(
            source,
            instance,
            3,
            [onCleanup]
          );
        };
      }
    } else {
      getter = NOOP;
    }
    if (cb && deep) {
      const baseGetter = getter;
      getter = () => traverse(baseGetter());
    }
    let cleanup;
    let onCleanup = (fn) => {
      cleanup = effect2.onStop = () => {
        callWithErrorHandling(fn, instance, 4);
        cleanup = effect2.onStop = void 0;
      };
    };
    let ssrCleanup;
    if (isInSSRComponentSetup) {
      onCleanup = NOOP;
      if (!cb) {
        getter();
      } else if (immediate) {
        callWithAsyncErrorHandling(cb, instance, 3, [
          getter(),
          isMultiSource ? [] : void 0,
          onCleanup
        ]);
      }
      if (flush === "sync") {
        const ctx = useSSRContext();
        ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
      } else {
        return NOOP;
      }
    }
    let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
    const job = () => {
      if (!effect2.active || !effect2.dirty) {
        return;
      }
      if (cb) {
        const newValue = effect2.run();
        if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
          if (cleanup) {
            cleanup();
          }
          callWithAsyncErrorHandling(cb, instance, 3, [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
            onCleanup
          ]);
          oldValue = newValue;
        }
      } else {
        effect2.run();
      }
    };
    job.allowRecurse = !!cb;
    let scheduler;
    if (flush === "sync") {
      scheduler = job;
    } else if (flush === "post") {
      scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
    } else {
      job.pre = true;
      if (instance)
        job.id = instance.uid;
      scheduler = () => queueJob(job);
    }
    const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
    const scope = getCurrentScope();
    const unwatch = () => {
      effect2.stop();
      if (scope) {
        remove(scope.effects, effect2);
      }
    };
    if (cb) {
      if (immediate) {
        job();
      } else {
        oldValue = effect2.run();
      }
    } else if (flush === "post") {
      queuePostRenderEffect(
        effect2.run.bind(effect2),
        instance && instance.suspense
      );
    } else {
      effect2.run();
    }
    if (ssrCleanup)
      ssrCleanup.push(unwatch);
    return unwatch;
  }
  function instanceWatch(source, value, options) {
    const publicThis = this.proxy;
    const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
    let cb;
    if (isFunction(value)) {
      cb = value;
    } else {
      cb = value.handler;
      options = value;
    }
    const reset = setCurrentInstance(this);
    const res = doWatch(getter, cb.bind(publicThis), options);
    reset();
    return res;
  }
  function createPathGetter(ctx, path) {
    const segments = path.split(".");
    return () => {
      let cur = ctx;
      for (let i = 0; i < segments.length && cur; i++) {
        cur = cur[segments[i]];
      }
      return cur;
    };
  }
  function traverse(value, depth, currentDepth = 0, seen) {
    if (!isObject$4(value) || value["__v_skip"]) {
      return value;
    }
    if (depth && depth > 0) {
      if (currentDepth >= depth) {
        return value;
      }
      currentDepth++;
    }
    seen = seen || /* @__PURE__ */ new Set();
    if (seen.has(value)) {
      return value;
    }
    seen.add(value);
    if (isRef(value)) {
      traverse(value.value, depth, currentDepth, seen);
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        traverse(value[i], depth, currentDepth, seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach((v) => {
        traverse(v, depth, currentDepth, seen);
      });
    } else if (isPlainObject$2(value)) {
      for (const key in value) {
        traverse(value[key], depth, currentDepth, seen);
      }
    }
    return value;
  }
  function withDirectives(vnode, directives) {
    if (currentRenderingInstance === null) {
      return vnode;
    }
    const instance = getExposeProxy(currentRenderingInstance) || currentRenderingInstance.proxy;
    const bindings = vnode.dirs || (vnode.dirs = []);
    for (let i = 0; i < directives.length; i++) {
      let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
      if (dir) {
        if (isFunction(dir)) {
          dir = {
            mounted: dir,
            updated: dir
          };
        }
        if (dir.deep) {
          traverse(value);
        }
        bindings.push({
          dir,
          instance,
          value,
          oldValue: void 0,
          arg,
          modifiers
        });
      }
    }
    return vnode;
  }
  function invokeDirectiveHook(vnode, prevVNode, instance, name) {
    const bindings = vnode.dirs;
    const oldBindings = prevVNode && prevVNode.dirs;
    for (let i = 0; i < bindings.length; i++) {
      const binding = bindings[i];
      if (oldBindings) {
        binding.oldValue = oldBindings[i].value;
      }
      let hook = binding.dir[name];
      if (hook) {
        pauseTracking();
        callWithAsyncErrorHandling(hook, instance, 8, [
          vnode.el,
          binding,
          vnode,
          prevVNode
        ]);
        resetTracking();
      }
    }
  }
  const leaveCbKey = Symbol("_leaveCb");
  const enterCbKey$1 = Symbol("_enterCb");
  function useTransitionState() {
    const state = {
      isMounted: false,
      isLeaving: false,
      isUnmounting: false,
      leavingVNodes: /* @__PURE__ */ new Map()
    };
    onMounted(() => {
      state.isMounted = true;
    });
    onBeforeUnmount(() => {
      state.isUnmounting = true;
    });
    return state;
  }
  const TransitionHookValidator = [Function, Array];
  const BaseTransitionPropsValidators = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    // enter
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    // leave
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    // appear
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  };
  const BaseTransitionImpl = {
    name: `BaseTransition`,
    props: BaseTransitionPropsValidators,
    setup(props, { slots }) {
      const instance = getCurrentInstance();
      const state = useTransitionState();
      let prevTransitionKey;
      return () => {
        const children = slots.default && getTransitionRawChildren(slots.default(), true);
        if (!children || !children.length) {
          return;
        }
        let child = children[0];
        if (children.length > 1) {
          for (const c2 of children) {
            if (c2.type !== Comment) {
              child = c2;
              break;
            }
          }
        }
        const rawProps = toRaw(props);
        const { mode } = rawProps;
        if (state.isLeaving) {
          return emptyPlaceholder(child);
        }
        const innerChild = getKeepAliveChild(child);
        if (!innerChild) {
          return emptyPlaceholder(child);
        }
        const enterHooks = resolveTransitionHooks(
          innerChild,
          rawProps,
          state,
          instance
        );
        setTransitionHooks(innerChild, enterHooks);
        const oldChild = instance.subTree;
        const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
        let transitionKeyChanged = false;
        const { getTransitionKey } = innerChild.type;
        if (getTransitionKey) {
          const key = getTransitionKey();
          if (prevTransitionKey === void 0) {
            prevTransitionKey = key;
          } else if (key !== prevTransitionKey) {
            prevTransitionKey = key;
            transitionKeyChanged = true;
          }
        }
        if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
          const leavingHooks = resolveTransitionHooks(
            oldInnerChild,
            rawProps,
            state,
            instance
          );
          setTransitionHooks(oldInnerChild, leavingHooks);
          if (mode === "out-in") {
            state.isLeaving = true;
            leavingHooks.afterLeave = () => {
              state.isLeaving = false;
              if (instance.update.active !== false) {
                instance.effect.dirty = true;
                instance.update();
              }
            };
            return emptyPlaceholder(child);
          } else if (mode === "in-out" && innerChild.type !== Comment) {
            leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
              const leavingVNodesCache = getLeavingNodesForType(
                state,
                oldInnerChild
              );
              leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
              el[leaveCbKey] = () => {
                earlyRemove();
                el[leaveCbKey] = void 0;
                delete enterHooks.delayedLeave;
              };
              enterHooks.delayedLeave = delayedLeave;
            };
          }
        }
        return child;
      };
    }
  };
  const BaseTransition = BaseTransitionImpl;
  function getLeavingNodesForType(state, vnode) {
    const { leavingVNodes } = state;
    let leavingVNodesCache = leavingVNodes.get(vnode.type);
    if (!leavingVNodesCache) {
      leavingVNodesCache = /* @__PURE__ */ Object.create(null);
      leavingVNodes.set(vnode.type, leavingVNodesCache);
    }
    return leavingVNodesCache;
  }
  function resolveTransitionHooks(vnode, props, state, instance) {
    const {
      appear,
      mode,
      persisted = false,
      onBeforeEnter,
      onEnter,
      onAfterEnter,
      onEnterCancelled,
      onBeforeLeave,
      onLeave,
      onAfterLeave,
      onLeaveCancelled,
      onBeforeAppear,
      onAppear,
      onAfterAppear,
      onAppearCancelled
    } = props;
    const key = String(vnode.key);
    const leavingVNodesCache = getLeavingNodesForType(state, vnode);
    const callHook2 = (hook, args) => {
      hook && callWithAsyncErrorHandling(
        hook,
        instance,
        9,
        args
      );
    };
    const callAsyncHook = (hook, args) => {
      const done = args[1];
      callHook2(hook, args);
      if (isArray(hook)) {
        if (hook.every((hook2) => hook2.length <= 1))
          done();
      } else if (hook.length <= 1) {
        done();
      }
    };
    const hooks = {
      mode,
      persisted,
      beforeEnter(el) {
        let hook = onBeforeEnter;
        if (!state.isMounted) {
          if (appear) {
            hook = onBeforeAppear || onBeforeEnter;
          } else {
            return;
          }
        }
        if (el[leaveCbKey]) {
          el[leaveCbKey](
            true
            /* cancelled */
          );
        }
        const leavingVNode = leavingVNodesCache[key];
        if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) {
          leavingVNode.el[leaveCbKey]();
        }
        callHook2(hook, [el]);
      },
      enter(el) {
        let hook = onEnter;
        let afterHook = onAfterEnter;
        let cancelHook = onEnterCancelled;
        if (!state.isMounted) {
          if (appear) {
            hook = onAppear || onEnter;
            afterHook = onAfterAppear || onAfterEnter;
            cancelHook = onAppearCancelled || onEnterCancelled;
          } else {
            return;
          }
        }
        let called = false;
        const done = el[enterCbKey$1] = (cancelled) => {
          if (called)
            return;
          called = true;
          if (cancelled) {
            callHook2(cancelHook, [el]);
          } else {
            callHook2(afterHook, [el]);
          }
          if (hooks.delayedLeave) {
            hooks.delayedLeave();
          }
          el[enterCbKey$1] = void 0;
        };
        if (hook) {
          callAsyncHook(hook, [el, done]);
        } else {
          done();
        }
      },
      leave(el, remove2) {
        const key2 = String(vnode.key);
        if (el[enterCbKey$1]) {
          el[enterCbKey$1](
            true
            /* cancelled */
          );
        }
        if (state.isUnmounting) {
          return remove2();
        }
        callHook2(onBeforeLeave, [el]);
        let called = false;
        const done = el[leaveCbKey] = (cancelled) => {
          if (called)
            return;
          called = true;
          remove2();
          if (cancelled) {
            callHook2(onLeaveCancelled, [el]);
          } else {
            callHook2(onAfterLeave, [el]);
          }
          el[leaveCbKey] = void 0;
          if (leavingVNodesCache[key2] === vnode) {
            delete leavingVNodesCache[key2];
          }
        };
        leavingVNodesCache[key2] = vnode;
        if (onLeave) {
          callAsyncHook(onLeave, [el, done]);
        } else {
          done();
        }
      },
      clone(vnode2) {
        return resolveTransitionHooks(vnode2, props, state, instance);
      }
    };
    return hooks;
  }
  function emptyPlaceholder(vnode) {
    if (isKeepAlive(vnode)) {
      vnode = cloneVNode(vnode);
      vnode.children = null;
      return vnode;
    }
  }
  function getKeepAliveChild(vnode) {
    return isKeepAlive(vnode) ? (
      // #7121 ensure get the child component subtree in case
      // it's been replaced during HMR
      vnode.children ? vnode.children[0] : void 0
    ) : vnode;
  }
  function setTransitionHooks(vnode, hooks) {
    if (vnode.shapeFlag & 6 && vnode.component) {
      setTransitionHooks(vnode.component.subTree, hooks);
    } else if (vnode.shapeFlag & 128) {
      vnode.ssContent.transition = hooks.clone(vnode.ssContent);
      vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
    } else {
      vnode.transition = hooks;
    }
  }
  function getTransitionRawChildren(children, keepComment = false, parentKey) {
    let ret = [];
    let keyedFragmentCount = 0;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
      if (child.type === Fragment) {
        if (child.patchFlag & 128)
          keyedFragmentCount++;
        ret = ret.concat(
          getTransitionRawChildren(child.children, keepComment, key)
        );
      } else if (keepComment || child.type !== Comment) {
        ret.push(key != null ? cloneVNode(child, { key }) : child);
      }
    }
    if (keyedFragmentCount > 1) {
      for (let i = 0; i < ret.length; i++) {
        ret[i].patchFlag = -2;
      }
    }
    return ret;
  }
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function defineComponent(options, extraOptions) {
    return isFunction(options) ? (
      // #8326: extend call and options.name access are considered side-effects
      // by Rollup, so we have to wrap it in a pure-annotated IIFE.
      /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
    ) : options;
  }
  const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function defineAsyncComponent(source) {
    if (isFunction(source)) {
      source = { loader: source };
    }
    const {
      loader,
      loadingComponent,
      errorComponent,
      delay: delay2 = 200,
      timeout: timeout2,
      // undefined = never times out
      suspensible = true,
      onError: userOnError
    } = source;
    let pendingRequest = null;
    let resolvedComp;
    let retries = 0;
    const retry = () => {
      retries++;
      pendingRequest = null;
      return load();
    };
    const load = () => {
      let thisRequest;
      return pendingRequest || (thisRequest = pendingRequest = loader().catch((err) => {
        err = err instanceof Error ? err : new Error(String(err));
        if (userOnError) {
          return new Promise((resolve2, reject) => {
            const userRetry = () => resolve2(retry());
            const userFail = () => reject(err);
            userOnError(err, userRetry, userFail, retries + 1);
          });
        } else {
          throw err;
        }
      }).then((comp) => {
        if (thisRequest !== pendingRequest && pendingRequest) {
          return pendingRequest;
        }
        if (comp && (comp.__esModule || comp[Symbol.toStringTag] === "Module")) {
          comp = comp.default;
        }
        resolvedComp = comp;
        return comp;
      }));
    };
    return /* @__PURE__ */ defineComponent({
      name: "AsyncComponentWrapper",
      __asyncLoader: load,
      get __asyncResolved() {
        return resolvedComp;
      },
      setup() {
        const instance = currentInstance;
        if (resolvedComp) {
          return () => createInnerComp(resolvedComp, instance);
        }
        const onError = (err) => {
          pendingRequest = null;
          handleError(
            err,
            instance,
            13,
            !errorComponent
          );
        };
        if (suspensible && instance.suspense || isInSSRComponentSetup) {
          return load().then((comp) => {
            return () => createInnerComp(comp, instance);
          }).catch((err) => {
            onError(err);
            return () => errorComponent ? createVNode(errorComponent, {
              error: err
            }) : null;
          });
        }
        const loaded = ref(false);
        const error = ref();
        const delayed = ref(!!delay2);
        if (delay2) {
          setTimeout(() => {
            delayed.value = false;
          }, delay2);
        }
        if (timeout2 != null) {
          setTimeout(() => {
            if (!loaded.value && !error.value) {
              const err = new Error(
                `Async component timed out after ${timeout2}ms.`
              );
              onError(err);
              error.value = err;
            }
          }, timeout2);
        }
        load().then(() => {
          loaded.value = true;
          if (instance.parent && isKeepAlive(instance.parent.vnode)) {
            instance.parent.effect.dirty = true;
            queueJob(instance.parent.update);
          }
        }).catch((err) => {
          onError(err);
          error.value = err;
        });
        return () => {
          if (loaded.value && resolvedComp) {
            return createInnerComp(resolvedComp, instance);
          } else if (error.value && errorComponent) {
            return createVNode(errorComponent, {
              error: error.value
            });
          } else if (loadingComponent && !delayed.value) {
            return createVNode(loadingComponent);
          }
        };
      }
    });
  }
  function createInnerComp(comp, parent) {
    const { ref: ref22, props, children, ce: ce2 } = parent.vnode;
    const vnode = createVNode(comp, props, children);
    vnode.ref = ref22;
    vnode.ce = ce2;
    delete parent.vnode.ce;
    return vnode;
  }
  const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
  const KeepAliveImpl = {
    name: `KeepAlive`,
    // Marker for special handling inside the renderer. We are not using a ===
    // check directly on KeepAlive in the renderer, because importing it directly
    // would prevent it from being tree-shaken.
    __isKeepAlive: true,
    props: {
      include: [String, RegExp, Array],
      exclude: [String, RegExp, Array],
      max: [String, Number]
    },
    setup(props, { slots }) {
      const instance = getCurrentInstance();
      const sharedContext = instance.ctx;
      if (!sharedContext.renderer) {
        return () => {
          const children = slots.default && slots.default();
          return children && children.length === 1 ? children[0] : children;
        };
      }
      const cache = /* @__PURE__ */ new Map();
      const keys = /* @__PURE__ */ new Set();
      let current = null;
      const parentSuspense = instance.suspense;
      const {
        renderer: {
          p: patch,
          m: move,
          um: _unmount,
          o: { createElement }
        }
      } = sharedContext;
      const storageContainer = createElement("div");
      sharedContext.activate = (vnode, container, anchor, namespace, optimized) => {
        const instance2 = vnode.component;
        move(vnode, container, anchor, 0, parentSuspense);
        patch(
          instance2.vnode,
          vnode,
          container,
          anchor,
          instance2,
          parentSuspense,
          namespace,
          vnode.slotScopeIds,
          optimized
        );
        queuePostRenderEffect(() => {
          instance2.isDeactivated = false;
          if (instance2.a) {
            invokeArrayFns(instance2.a);
          }
          const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
          if (vnodeHook) {
            invokeVNodeHook(vnodeHook, instance2.parent, vnode);
          }
        }, parentSuspense);
      };
      sharedContext.deactivate = (vnode) => {
        const instance2 = vnode.component;
        move(vnode, storageContainer, null, 1, parentSuspense);
        queuePostRenderEffect(() => {
          if (instance2.da) {
            invokeArrayFns(instance2.da);
          }
          const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
          if (vnodeHook) {
            invokeVNodeHook(vnodeHook, instance2.parent, vnode);
          }
          instance2.isDeactivated = true;
        }, parentSuspense);
      };
      function unmount(vnode) {
        resetShapeFlag(vnode);
        _unmount(vnode, instance, parentSuspense, true);
      }
      function pruneCache(filter) {
        cache.forEach((vnode, key) => {
          const name = getComponentName(vnode.type);
          if (name && (!filter || !filter(name))) {
            pruneCacheEntry(key);
          }
        });
      }
      function pruneCacheEntry(key) {
        const cached = cache.get(key);
        if (!current || !isSameVNodeType(cached, current)) {
          unmount(cached);
        } else if (current) {
          resetShapeFlag(current);
        }
        cache.delete(key);
        keys.delete(key);
      }
      watch(
        () => [props.include, props.exclude],
        ([include, exclude]) => {
          include && pruneCache((name) => matches(include, name));
          exclude && pruneCache((name) => !matches(exclude, name));
        },
        // prune post-render after `current` has been updated
        { flush: "post", deep: true }
      );
      let pendingCacheKey = null;
      const cacheSubtree = () => {
        if (pendingCacheKey != null) {
          cache.set(pendingCacheKey, getInnerChild(instance.subTree));
        }
      };
      onMounted(cacheSubtree);
      onUpdated(cacheSubtree);
      onBeforeUnmount(() => {
        cache.forEach((cached) => {
          const { subTree, suspense } = instance;
          const vnode = getInnerChild(subTree);
          if (cached.type === vnode.type && cached.key === vnode.key) {
            resetShapeFlag(vnode);
            const da = vnode.component.da;
            da && queuePostRenderEffect(da, suspense);
            return;
          }
          unmount(cached);
        });
      });
      return () => {
        pendingCacheKey = null;
        if (!slots.default) {
          return null;
        }
        const children = slots.default();
        const rawVNode = children[0];
        if (children.length > 1) {
          current = null;
          return children;
        } else if (!isVNode(rawVNode) || !(rawVNode.shapeFlag & 4) && !(rawVNode.shapeFlag & 128)) {
          current = null;
          return rawVNode;
        }
        let vnode = getInnerChild(rawVNode);
        const comp = vnode.type;
        const name = getComponentName(
          isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp
        );
        const { include, exclude, max } = props;
        if (include && (!name || !matches(include, name)) || exclude && name && matches(exclude, name)) {
          current = vnode;
          return rawVNode;
        }
        const key = vnode.key == null ? comp : vnode.key;
        const cachedVNode = cache.get(key);
        if (vnode.el) {
          vnode = cloneVNode(vnode);
          if (rawVNode.shapeFlag & 128) {
            rawVNode.ssContent = vnode;
          }
        }
        pendingCacheKey = key;
        if (cachedVNode) {
          vnode.el = cachedVNode.el;
          vnode.component = cachedVNode.component;
          if (vnode.transition) {
            setTransitionHooks(vnode, vnode.transition);
          }
          vnode.shapeFlag |= 512;
          keys.delete(key);
          keys.add(key);
        } else {
          keys.add(key);
          if (max && keys.size > parseInt(max, 10)) {
            pruneCacheEntry(keys.values().next().value);
          }
        }
        vnode.shapeFlag |= 256;
        current = vnode;
        return isSuspense(rawVNode.type) ? rawVNode : vnode;
      };
    }
  };
  const KeepAlive = KeepAliveImpl;
  function matches(pattern, name) {
    if (isArray(pattern)) {
      return pattern.some((p2) => matches(p2, name));
    } else if (isString(pattern)) {
      return pattern.split(",").includes(name);
    } else if (isRegExp(pattern)) {
      return pattern.test(name);
    }
    return false;
  }
  function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a", target);
  }
  function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da", target);
  }
  function registerKeepAliveHook(hook, type, target = currentInstance) {
    const wrappedHook = hook.__wdc || (hook.__wdc = () => {
      let current = target;
      while (current) {
        if (current.isDeactivated) {
          return;
        }
        current = current.parent;
      }
      return hook();
    });
    injectHook(type, wrappedHook, target);
    if (target) {
      let current = target.parent;
      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type, target, current);
        }
        current = current.parent;
      }
    }
  }
  function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
    const injected = injectHook(
      type,
      hook,
      keepAliveRoot,
      true
      /* prepend */
    );
    onUnmounted(() => {
      remove(keepAliveRoot[type], injected);
    }, target);
  }
  function resetShapeFlag(vnode) {
    vnode.shapeFlag &= ~256;
    vnode.shapeFlag &= ~512;
  }
  function getInnerChild(vnode) {
    return vnode.shapeFlag & 128 ? vnode.ssContent : vnode;
  }
  function injectHook(type, hook, target = currentInstance, prepend = false) {
    if (target) {
      const hooks = target[type] || (target[type] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        if (target.isUnmounted) {
          return;
        }
        pauseTracking();
        const reset = setCurrentInstance(target);
        const res = callWithAsyncErrorHandling(hook, target, type, args);
        reset();
        resetTracking();
        return res;
      });
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => (
    // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
    (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
  );
  const onBeforeMount = createHook("bm");
  const onMounted = createHook("m");
  const onBeforeUpdate = createHook("bu");
  const onUpdated = createHook("u");
  const onBeforeUnmount = createHook("bum");
  const onUnmounted = createHook("um");
  const onServerPrefetch = createHook("sp");
  const onRenderTriggered = createHook(
    "rtg"
  );
  const onRenderTracked = createHook(
    "rtc"
  );
  function onErrorCaptured(hook, target = currentInstance) {
    injectHook("ec", hook, target);
  }
  function renderList(source, renderItem, cache, index) {
    let ret;
    const cached = cache && cache[index];
    if (isArray(source) || isString(source)) {
      ret = new Array(source.length);
      for (let i = 0, l2 = source.length; i < l2; i++) {
        ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
      }
    } else if (typeof source === "number") {
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
      }
    } else if (isObject$4(source)) {
      if (source[Symbol.iterator]) {
        ret = Array.from(
          source,
          (item, i) => renderItem(item, i, void 0, cached && cached[i])
        );
      } else {
        const keys = Object.keys(source);
        ret = new Array(keys.length);
        for (let i = 0, l2 = keys.length; i < l2; i++) {
          const key = keys[i];
          ret[i] = renderItem(source[key], key, i, cached && cached[i]);
        }
      }
    } else {
      ret = [];
    }
    if (cache) {
      cache[index] = ret;
    }
    return ret;
  }
  function createSlots(slots, dynamicSlots) {
    for (let i = 0; i < dynamicSlots.length; i++) {
      const slot = dynamicSlots[i];
      if (isArray(slot)) {
        for (let j2 = 0; j2 < slot.length; j2++) {
          slots[slot[j2].name] = slot[j2].fn;
        }
      } else if (slot) {
        slots[slot.name] = slot.key ? (...args) => {
          const res = slot.fn(...args);
          if (res)
            res.key = slot.key;
          return res;
        } : slot.fn;
      }
    }
    return slots;
  }
  function renderSlot(slots, name, props = {}, fallback, noSlotted) {
    if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
      if (name !== "default")
        props.name = name;
      return createVNode("slot", props, fallback && fallback());
    }
    let slot = slots[name];
    if (slot && slot._c) {
      slot._d = false;
    }
    openBlock();
    const validSlotContent = slot && ensureValidVNode(slot(props));
    const rendered = createBlock(
      Fragment,
      {
        key: props.key || // slot content array of a dynamic conditional slot may have a branch
        // key attached in the `createSlots` helper, respect that
        validSlotContent && validSlotContent.key || `_${name}`
      },
      validSlotContent || (fallback ? fallback() : []),
      validSlotContent && slots._ === 1 ? 64 : -2
    );
    if (!noSlotted && rendered.scopeId) {
      rendered.slotScopeIds = [rendered.scopeId + "-s"];
    }
    if (slot && slot._c) {
      slot._d = true;
    }
    return rendered;
  }
  function ensureValidVNode(vnodes) {
    return vnodes.some((child) => {
      if (!isVNode(child))
        return true;
      if (child.type === Comment)
        return false;
      if (child.type === Fragment && !ensureValidVNode(child.children))
        return false;
      return true;
    }) ? vnodes : null;
  }
  function toHandlers(obj, preserveCaseIfNecessary) {
    const ret = {};
    for (const key in obj) {
      ret[preserveCaseIfNecessary && /[A-Z]/.test(key) ? `on:${key}` : toHandlerKey(key)] = obj[key];
    }
    return ret;
  }
  const getPublicInstance = (i) => {
    if (!i)
      return null;
    if (isStatefulComponent(i))
      return getExposeProxy(i) || i.proxy;
    return getPublicInstance(i.parent);
  };
  const publicPropertiesMap = (
    // Move PURE marker to new line to workaround compiler discarding it
    // due to type annotation
    /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
      $: (i) => i,
      $el: (i) => i.vnode.el,
      $data: (i) => i.data,
      $props: (i) => i.props,
      $attrs: (i) => i.attrs,
      $slots: (i) => i.slots,
      $refs: (i) => i.refs,
      $parent: (i) => getPublicInstance(i.parent),
      $root: (i) => getPublicInstance(i.root),
      $emit: (i) => i.emit,
      $options: (i) => resolveMergedOptions(i),
      $forceUpdate: (i) => i.f || (i.f = () => {
        i.effect.dirty = true;
        queueJob(i.update);
      }),
      $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
      $watch: (i) => instanceWatch.bind(i)
    })
  );
  const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
  const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
      const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
      let normalizedProps;
      if (key[0] !== "$") {
        const n = accessCache[key];
        if (n !== void 0) {
          switch (n) {
            case 1:
              return setupState[key];
            case 2:
              return data[key];
            case 4:
              return ctx[key];
            case 3:
              return props[key];
          }
        } else if (hasSetupBinding(setupState, key)) {
          accessCache[key] = 1;
          return setupState[key];
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          accessCache[key] = 2;
          return data[key];
        } else if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
        ) {
          accessCache[key] = 3;
          return props[key];
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4;
          return ctx[key];
        } else if (shouldCacheAccess) {
          accessCache[key] = 0;
        }
      }
      const publicGetter = publicPropertiesMap[key];
      let cssModule, globalProperties;
      if (publicGetter) {
        if (key === "$attrs") {
          track(instance, "get", key);
        }
        return publicGetter(instance);
      } else if (
        // css module (injected by vue-loader)
        (cssModule = type.__cssModules) && (cssModule = cssModule[key])
      ) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (
        // global properties
        globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
      ) {
        {
          return globalProperties[key];
        }
      } else
        ;
    },
    set({ _: instance }, key, value) {
      const { data, setupState, ctx } = instance;
      if (hasSetupBinding(setupState, key)) {
        setupState[key] = value;
        return true;
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        data[key] = value;
        return true;
      } else if (hasOwn(instance.props, key)) {
        return false;
      }
      if (key[0] === "$" && key.slice(1) in instance) {
        return false;
      } else {
        {
          ctx[key] = value;
        }
      }
      return true;
    },
    has({
      _: { data, setupState, accessCache, ctx, appContext, propsOptions }
    }, key) {
      let normalizedProps;
      return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
    },
    defineProperty(target, key, descriptor) {
      if (descriptor.get != null) {
        target._.accessCache[key] = 0;
      } else if (hasOwn(descriptor, "value")) {
        this.set(target, key, descriptor.value, null);
      }
      return Reflect.defineProperty(target, key, descriptor);
    }
  };
  const RuntimeCompiledPublicInstanceProxyHandlers = /* @__PURE__ */ extend(
    {},
    PublicInstanceProxyHandlers,
    {
      get(target, key) {
        if (key === Symbol.unscopables) {
          return;
        }
        return PublicInstanceProxyHandlers.get(target, key, target);
      },
      has(_, key) {
        const has2 = key[0] !== "_" && !isGloballyAllowed(key);
        return has2;
      }
    }
  );
  function defineProps() {
    return null;
  }
  function defineEmits() {
    return null;
  }
  function defineExpose(exposed) {
  }
  function defineOptions(options) {
  }
  function defineSlots() {
    return null;
  }
  function defineModel() {
  }
  function withDefaults(props, defaults) {
    return null;
  }
  function useSlots() {
    return getContext().slots;
  }
  function useAttrs() {
    return getContext().attrs;
  }
  function getContext() {
    const i = getCurrentInstance();
    return i.setupContext || (i.setupContext = createSetupContext(i));
  }
  function normalizePropsOrEmits(props) {
    return isArray(props) ? props.reduce(
      (normalized, p2) => (normalized[p2] = null, normalized),
      {}
    ) : props;
  }
  function mergeDefaults(raw, defaults) {
    const props = normalizePropsOrEmits(raw);
    for (const key in defaults) {
      if (key.startsWith("__skip"))
        continue;
      let opt = props[key];
      if (opt) {
        if (isArray(opt) || isFunction(opt)) {
          opt = props[key] = { type: opt, default: defaults[key] };
        } else {
          opt.default = defaults[key];
        }
      } else if (opt === null) {
        opt = props[key] = { default: defaults[key] };
      } else
        ;
      if (opt && defaults[`__skip_${key}`]) {
        opt.skipFactory = true;
      }
    }
    return props;
  }
  function mergeModels(a, b) {
    if (!a || !b)
      return a || b;
    if (isArray(a) && isArray(b))
      return a.concat(b);
    return extend({}, normalizePropsOrEmits(a), normalizePropsOrEmits(b));
  }
  function createPropsRestProxy(props, excludedKeys) {
    const ret = {};
    for (const key in props) {
      if (!excludedKeys.includes(key)) {
        Object.defineProperty(ret, key, {
          enumerable: true,
          get: () => props[key]
        });
      }
    }
    return ret;
  }
  function withAsyncContext(getAwaitable) {
    const ctx = getCurrentInstance();
    let awaitable = getAwaitable();
    unsetCurrentInstance();
    if (isPromise(awaitable)) {
      awaitable = awaitable.catch((e) => {
        setCurrentInstance(ctx);
        throw e;
      });
    }
    return [awaitable, () => setCurrentInstance(ctx)];
  }
  let shouldCacheAccess = true;
  function applyOptions(instance) {
    const options = resolveMergedOptions(instance);
    const publicThis = instance.proxy;
    const ctx = instance.ctx;
    shouldCacheAccess = false;
    if (options.beforeCreate) {
      callHook$1(options.beforeCreate, instance, "bc");
    }
    const {
      // state
      data: dataOptions,
      computed: computedOptions,
      methods,
      watch: watchOptions,
      provide: provideOptions,
      inject: injectOptions,
      // lifecycle
      created,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
      activated,
      deactivated,
      beforeDestroy,
      beforeUnmount,
      destroyed,
      unmounted,
      render: render2,
      renderTracked,
      renderTriggered,
      errorCaptured,
      serverPrefetch,
      // public API
      expose,
      inheritAttrs,
      // assets
      components,
      directives,
      filters
    } = options;
    const checkDuplicateProperties = null;
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
    if (methods) {
      for (const key in methods) {
        const methodHandler = methods[key];
        if (isFunction(methodHandler)) {
          {
            ctx[key] = methodHandler.bind(publicThis);
          }
        }
      }
    }
    if (dataOptions) {
      const data = dataOptions.call(publicThis, publicThis);
      if (!isObject$4(data))
        ;
      else {
        instance.data = reactive(data);
      }
    }
    shouldCacheAccess = true;
    if (computedOptions) {
      for (const key in computedOptions) {
        const opt = computedOptions[key];
        const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
        const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
        const c2 = computed({
          get: get2,
          set: set2
        });
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => c2.value,
          set: (v) => c2.value = v
        });
      }
    }
    if (watchOptions) {
      for (const key in watchOptions) {
        createWatcher(watchOptions[key], ctx, publicThis, key);
      }
    }
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
    if (created) {
      callHook$1(created, instance, "c");
    }
    function registerLifecycleHook(register, hook) {
      if (isArray(hook)) {
        hook.forEach((_hook) => register(_hook.bind(publicThis)));
      } else if (hook) {
        register(hook.bind(publicThis));
      }
    }
    registerLifecycleHook(onBeforeMount, beforeMount);
    registerLifecycleHook(onMounted, mounted);
    registerLifecycleHook(onBeforeUpdate, beforeUpdate);
    registerLifecycleHook(onUpdated, updated);
    registerLifecycleHook(onActivated, activated);
    registerLifecycleHook(onDeactivated, deactivated);
    registerLifecycleHook(onErrorCaptured, errorCaptured);
    registerLifecycleHook(onRenderTracked, renderTracked);
    registerLifecycleHook(onRenderTriggered, renderTriggered);
    registerLifecycleHook(onBeforeUnmount, beforeUnmount);
    registerLifecycleHook(onUnmounted, unmounted);
    registerLifecycleHook(onServerPrefetch, serverPrefetch);
    if (isArray(expose)) {
      if (expose.length) {
        const exposed = instance.exposed || (instance.exposed = {});
        expose.forEach((key) => {
          Object.defineProperty(exposed, key, {
            get: () => publicThis[key],
            set: (val) => publicThis[key] = val
          });
        });
      } else if (!instance.exposed) {
        instance.exposed = {};
      }
    }
    if (render2 && instance.render === NOOP) {
      instance.render = render2;
    }
    if (inheritAttrs != null) {
      instance.inheritAttrs = inheritAttrs;
    }
    if (components)
      instance.components = components;
    if (directives)
      instance.directives = directives;
  }
  function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
    if (isArray(injectOptions)) {
      injectOptions = normalizeInject(injectOptions);
    }
    for (const key in injectOptions) {
      const opt = injectOptions[key];
      let injected;
      if (isObject$4(opt)) {
        if ("default" in opt) {
          injected = inject(
            opt.from || key,
            opt.default,
            true
          );
        } else {
          injected = inject(opt.from || key);
        }
      } else {
        injected = inject(opt);
      }
      if (isRef(injected)) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
    }
  }
  function callHook$1(hook, instance, type) {
    callWithAsyncErrorHandling(
      isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
      instance,
      type
    );
  }
  function createWatcher(raw, ctx, publicThis, key) {
    const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
    if (isString(raw)) {
      const handler2 = ctx[raw];
      if (isFunction(handler2)) {
        watch(getter, handler2);
      }
    } else if (isFunction(raw)) {
      watch(getter, raw.bind(publicThis));
    } else if (isObject$4(raw)) {
      if (isArray(raw)) {
        raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key));
      } else {
        const handler2 = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
        if (isFunction(handler2)) {
          watch(getter, handler2, raw);
        }
      }
    } else
      ;
  }
  function resolveMergedOptions(instance) {
    const base = instance.type;
    const { mixins, extends: extendsOptions } = base;
    const {
      mixins: globalMixins,
      optionsCache: cache,
      config: { optionMergeStrategies }
    } = instance.appContext;
    const cached = cache.get(base);
    let resolved;
    if (cached) {
      resolved = cached;
    } else if (!globalMixins.length && !mixins && !extendsOptions) {
      {
        resolved = base;
      }
    } else {
      resolved = {};
      if (globalMixins.length) {
        globalMixins.forEach(
          (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
        );
      }
      mergeOptions(resolved, base, optionMergeStrategies);
    }
    if (isObject$4(base)) {
      cache.set(base, resolved);
    }
    return resolved;
  }
  function mergeOptions(to, from, strats, asMixin = false) {
    const { mixins, extends: extendsOptions } = from;
    if (extendsOptions) {
      mergeOptions(to, extendsOptions, strats, true);
    }
    if (mixins) {
      mixins.forEach(
        (m) => mergeOptions(to, m, strats, true)
      );
    }
    for (const key in from) {
      if (asMixin && key === "expose")
        ;
      else {
        const strat = internalOptionMergeStrats[key] || strats && strats[key];
        to[key] = strat ? strat(to[key], from[key]) : from[key];
      }
    }
    return to;
  }
  const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeEmitsOrPropsOptions,
    emits: mergeEmitsOrPropsOptions,
    // objects
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    // lifecycle
    beforeCreate: mergeAsArray,
    created: mergeAsArray,
    beforeMount: mergeAsArray,
    mounted: mergeAsArray,
    beforeUpdate: mergeAsArray,
    updated: mergeAsArray,
    beforeDestroy: mergeAsArray,
    beforeUnmount: mergeAsArray,
    destroyed: mergeAsArray,
    unmounted: mergeAsArray,
    activated: mergeAsArray,
    deactivated: mergeAsArray,
    errorCaptured: mergeAsArray,
    serverPrefetch: mergeAsArray,
    // assets
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    // watch
    watch: mergeWatchOptions,
    // provide / inject
    provide: mergeDataFn,
    inject: mergeInject
  };
  function mergeDataFn(to, from) {
    if (!from) {
      return to;
    }
    if (!to) {
      return from;
    }
    return function mergedDataFn() {
      return extend(
        isFunction(to) ? to.call(this, this) : to,
        isFunction(from) ? from.call(this, this) : from
      );
    };
  }
  function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
  }
  function normalizeInject(raw) {
    if (isArray(raw)) {
      const res = {};
      for (let i = 0; i < raw.length; i++) {
        res[raw[i]] = raw[i];
      }
      return res;
    }
    return raw;
  }
  function mergeAsArray(to, from) {
    return to ? [...new Set([].concat(to, from))] : from;
  }
  function mergeObjectOptions(to, from) {
    return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
  }
  function mergeEmitsOrPropsOptions(to, from) {
    if (to) {
      if (isArray(to) && isArray(from)) {
        return [.../* @__PURE__ */ new Set([...to, ...from])];
      }
      return extend(
        /* @__PURE__ */ Object.create(null),
        normalizePropsOrEmits(to),
        normalizePropsOrEmits(from != null ? from : {})
      );
    } else {
      return from;
    }
  }
  function mergeWatchOptions(to, from) {
    if (!to)
      return from;
    if (!from)
      return to;
    const merged = extend(/* @__PURE__ */ Object.create(null), to);
    for (const key in from) {
      merged[key] = mergeAsArray(to[key], from[key]);
    }
    return merged;
  }
  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: /* @__PURE__ */ Object.create(null),
      optionsCache: /* @__PURE__ */ new WeakMap(),
      propsCache: /* @__PURE__ */ new WeakMap(),
      emitsCache: /* @__PURE__ */ new WeakMap()
    };
  }
  let uid$1 = 0;
  function createAppAPI(render2, hydrate2) {
    return function createApp2(rootComponent, rootProps = null) {
      if (!isFunction(rootComponent)) {
        rootComponent = extend({}, rootComponent);
      }
      if (rootProps != null && !isObject$4(rootProps)) {
        rootProps = null;
      }
      const context = createAppContext();
      const installedPlugins = /* @__PURE__ */ new WeakSet();
      let isMounted = false;
      const app2 = context.app = {
        _uid: uid$1++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        _instance: null,
        version,
        get config() {
          return context.config;
        },
        set config(v) {
        },
        use(plugin, ...options) {
          if (installedPlugins.has(plugin))
            ;
          else if (plugin && isFunction(plugin.install)) {
            installedPlugins.add(plugin);
            plugin.install(app2, ...options);
          } else if (isFunction(plugin)) {
            installedPlugins.add(plugin);
            plugin(app2, ...options);
          } else
            ;
          return app2;
        },
        mixin(mixin) {
          {
            if (!context.mixins.includes(mixin)) {
              context.mixins.push(mixin);
            }
          }
          return app2;
        },
        component(name, component) {
          if (!component) {
            return context.components[name];
          }
          context.components[name] = component;
          return app2;
        },
        directive(name, directive) {
          if (!directive) {
            return context.directives[name];
          }
          context.directives[name] = directive;
          return app2;
        },
        mount(rootContainer, isHydrate, namespace) {
          if (!isMounted) {
            const vnode = createVNode(rootComponent, rootProps);
            vnode.appContext = context;
            if (namespace === true) {
              namespace = "svg";
            } else if (namespace === false) {
              namespace = void 0;
            }
            if (isHydrate && hydrate2) {
              hydrate2(vnode, rootContainer);
            } else {
              render2(vnode, rootContainer, namespace);
            }
            isMounted = true;
            app2._container = rootContainer;
            rootContainer.__vue_app__ = app2;
            return getExposeProxy(vnode.component) || vnode.component.proxy;
          }
        },
        unmount() {
          if (isMounted) {
            render2(null, app2._container);
            delete app2._container.__vue_app__;
          }
        },
        provide(key, value) {
          context.provides[key] = value;
          return app2;
        },
        runWithContext(fn) {
          currentApp = app2;
          try {
            return fn();
          } finally {
            currentApp = null;
          }
        }
      };
      return app2;
    };
  }
  let currentApp = null;
  function provide(key, value) {
    if (!currentInstance)
      ;
    else {
      let provides = currentInstance.provides;
      const parentProvides = currentInstance.parent && currentInstance.parent.provides;
      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      }
      provides[key] = value;
    }
  }
  function inject(key, defaultValue, treatDefaultAsFactory = false) {
    const instance = currentInstance || currentRenderingInstance;
    if (instance || currentApp) {
      const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
      if (provides && key in provides) {
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
      } else
        ;
    }
  }
  function hasInjectionContext() {
    return !!(currentInstance || currentRenderingInstance || currentApp);
  }
  function initProps(instance, rawProps, isStateful, isSSR = false) {
    const props = {};
    const attrs = {};
    def(attrs, InternalObjectKey, 1);
    instance.propsDefaults = /* @__PURE__ */ Object.create(null);
    setFullProps(instance, rawProps, props, attrs);
    for (const key in instance.propsOptions[0]) {
      if (!(key in props)) {
        props[key] = void 0;
      }
    }
    if (isStateful) {
      instance.props = isSSR ? props : shallowReactive(props);
    } else {
      if (!instance.type.props) {
        instance.props = attrs;
      } else {
        instance.props = props;
      }
    }
    instance.attrs = attrs;
  }
  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const {
      props,
      attrs,
      vnode: { patchFlag }
    } = instance;
    const rawCurrentProps = toRaw(props);
    const [options] = instance.propsOptions;
    let hasAttrsChanged = false;
    if (
      // always force full diff in dev
      // - #1942 if hmr is enabled with sfc component
      // - vite#872 non-sfc component used by sfc component
      (optimized || patchFlag > 0) && !(patchFlag & 16)
    ) {
      if (patchFlag & 8) {
        const propsToUpdate = instance.vnode.dynamicProps;
        for (let i = 0; i < propsToUpdate.length; i++) {
          let key = propsToUpdate[i];
          if (isEmitListener(instance.emitsOptions, key)) {
            continue;
          }
          const value = rawProps[key];
          if (options) {
            if (hasOwn(attrs, key)) {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            } else {
              const camelizedKey = camelize(key);
              props[camelizedKey] = resolvePropValue(
                options,
                rawCurrentProps,
                camelizedKey,
                value,
                instance,
                false
              );
            }
          } else {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
    } else {
      if (setFullProps(instance, rawProps, props, attrs)) {
        hasAttrsChanged = true;
      }
      let kebabKey;
      for (const key in rawCurrentProps) {
        if (!rawProps || // for camelCase
        !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
        // and converted to camelCase (#955)
        ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps && // for camelCase
            (rawPrevProps[key] !== void 0 || // for kebab-case
            rawPrevProps[kebabKey] !== void 0)) {
              props[key] = resolvePropValue(
                options,
                rawCurrentProps,
                key,
                void 0,
                instance,
                true
              );
            }
          } else {
            delete props[key];
          }
        }
      }
      if (attrs !== rawCurrentProps) {
        for (const key in attrs) {
          if (!rawProps || !hasOwn(rawProps, key) && true) {
            delete attrs[key];
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (hasAttrsChanged) {
      trigger(instance, "set", "$attrs");
    }
  }
  function setFullProps(instance, rawProps, props, attrs) {
    const [options, needCastKeys] = instance.propsOptions;
    let hasAttrsChanged = false;
    let rawCastValues;
    if (rawProps) {
      for (let key in rawProps) {
        if (isReservedProp(key)) {
          continue;
        }
        const value = rawProps[key];
        let camelKey;
        if (options && hasOwn(options, camelKey = camelize(key))) {
          if (!needCastKeys || !needCastKeys.includes(camelKey)) {
            props[camelKey] = value;
          } else {
            (rawCastValues || (rawCastValues = {}))[camelKey] = value;
          }
        } else if (!isEmitListener(instance.emitsOptions, key)) {
          if (!(key in attrs) || value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (needCastKeys) {
      const rawCurrentProps = toRaw(props);
      const castValues = rawCastValues || EMPTY_OBJ;
      for (let i = 0; i < needCastKeys.length; i++) {
        const key = needCastKeys[i];
        props[key] = resolvePropValue(
          options,
          rawCurrentProps,
          key,
          castValues[key],
          instance,
          !hasOwn(castValues, key)
        );
      }
    }
    return hasAttrsChanged;
  }
  function resolvePropValue(options, props, key, value, instance, isAbsent2) {
    const opt = options[key];
    if (opt != null) {
      const hasDefault = hasOwn(opt, "default");
      if (hasDefault && value === void 0) {
        const defaultValue = opt.default;
        if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
          const { propsDefaults } = instance;
          if (key in propsDefaults) {
            value = propsDefaults[key];
          } else {
            const reset = setCurrentInstance(instance);
            value = propsDefaults[key] = defaultValue.call(
              null,
              props
            );
            reset();
          }
        } else {
          value = defaultValue;
        }
      }
      if (opt[
        0
        /* shouldCast */
      ]) {
        if (isAbsent2 && !hasDefault) {
          value = false;
        } else if (opt[
          1
          /* shouldCastTrue */
        ] && (value === "" || value === hyphenate(key))) {
          value = true;
        }
      }
    }
    return value;
  }
  function normalizePropsOptions(comp, appContext, asMixin = false) {
    const cache = appContext.propsCache;
    const cached = cache.get(comp);
    if (cached) {
      return cached;
    }
    const raw = comp.props;
    const normalized = {};
    const needCastKeys = [];
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendProps = (raw2) => {
        hasExtends = true;
        const [props, keys] = normalizePropsOptions(raw2, appContext, true);
        extend(normalized, props);
        if (keys)
          needCastKeys.push(...keys);
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendProps);
      }
      if (comp.extends) {
        extendProps(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendProps);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject$4(comp)) {
        cache.set(comp, EMPTY_ARR);
      }
      return EMPTY_ARR;
    }
    if (isArray(raw)) {
      for (let i = 0; i < raw.length; i++) {
        const normalizedKey = camelize(raw[i]);
        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = EMPTY_OBJ;
        }
      }
    } else if (raw) {
      for (const key in raw) {
        const normalizedKey = camelize(key);
        if (validatePropName(normalizedKey)) {
          const opt = raw[key];
          const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
          if (prop) {
            const booleanIndex = getTypeIndex(Boolean, prop.type);
            const stringIndex = getTypeIndex(String, prop.type);
            prop[
              0
              /* shouldCast */
            ] = booleanIndex > -1;
            prop[
              1
              /* shouldCastTrue */
            ] = stringIndex < 0 || booleanIndex < stringIndex;
            if (booleanIndex > -1 || hasOwn(prop, "default")) {
              needCastKeys.push(normalizedKey);
            }
          }
        }
      }
    }
    const res = [normalized, needCastKeys];
    if (isObject$4(comp)) {
      cache.set(comp, res);
    }
    return res;
  }
  function validatePropName(key) {
    if (key[0] !== "$") {
      return true;
    }
    return false;
  }
  function getType(ctor) {
    const match = ctor && ctor.toString().match(/^\s*(function|class) (\w+)/);
    return match ? match[2] : ctor === null ? "null" : "";
  }
  function isSameType(a, b) {
    return getType(a) === getType(b);
  }
  function getTypeIndex(type, expectedTypes) {
    if (isArray(expectedTypes)) {
      return expectedTypes.findIndex((t) => isSameType(t, type));
    } else if (isFunction(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1;
    }
    return -1;
  }
  const isInternalKey = (key) => key[0] === "_" || key === "$stable";
  const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
  const normalizeSlot = (key, rawSlot, ctx) => {
    if (rawSlot._n) {
      return rawSlot;
    }
    const normalized = withCtx((...args) => {
      if (false)
        ;
      return normalizeSlotValue(rawSlot(...args));
    }, ctx);
    normalized._c = false;
    return normalized;
  };
  const normalizeObjectSlots = (rawSlots, slots, instance) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
      if (isInternalKey(key))
        continue;
      const value = rawSlots[key];
      if (isFunction(value)) {
        slots[key] = normalizeSlot(key, value, ctx);
      } else if (value != null) {
        const normalized = normalizeSlotValue(value);
        slots[key] = () => normalized;
      }
    }
  };
  const normalizeVNodeSlots = (instance, children) => {
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
  };
  const initSlots = (instance, children) => {
    if (instance.vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        instance.slots = toRaw(children);
        def(children, "_", type);
      } else {
        normalizeObjectSlots(
          children,
          instance.slots = {}
        );
      }
    } else {
      instance.slots = {};
      if (children) {
        normalizeVNodeSlots(instance, children);
      }
    }
    def(instance.slots, InternalObjectKey, 1);
  };
  const updateSlots = (instance, children, optimized) => {
    const { vnode, slots } = instance;
    let needDeletionCheck = true;
    let deletionComparisonTarget = EMPTY_OBJ;
    if (vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        if (optimized && type === 1) {
          needDeletionCheck = false;
        } else {
          extend(slots, children);
          if (!optimized && type === 1) {
            delete slots._;
          }
        }
      } else {
        needDeletionCheck = !children.$stable;
        normalizeObjectSlots(children, slots);
      }
      deletionComparisonTarget = children;
    } else if (children) {
      normalizeVNodeSlots(instance, children);
      deletionComparisonTarget = { default: 1 };
    }
    if (needDeletionCheck) {
      for (const key in slots) {
        if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
          delete slots[key];
        }
      }
    }
  };
  function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
    if (isArray(rawRef)) {
      rawRef.forEach(
        (r2, i) => setRef(
          r2,
          oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
          parentSuspense,
          vnode,
          isUnmount
        )
      );
      return;
    }
    if (isAsyncWrapper(vnode) && !isUnmount) {
      return;
    }
    const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
    const value = isUnmount ? null : refValue;
    const { i: owner, r: ref3 } = rawRef;
    const oldRef = oldRawRef && oldRawRef.r;
    const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
    const setupState = owner.setupState;
    if (oldRef != null && oldRef !== ref3) {
      if (isString(oldRef)) {
        refs[oldRef] = null;
        if (hasOwn(setupState, oldRef)) {
          setupState[oldRef] = null;
        }
      } else if (isRef(oldRef)) {
        oldRef.value = null;
      }
    }
    if (isFunction(ref3)) {
      callWithErrorHandling(ref3, owner, 12, [value, refs]);
    } else {
      const _isString = isString(ref3);
      const _isRef = isRef(ref3);
      if (_isString || _isRef) {
        const doSet = () => {
          if (rawRef.f) {
            const existing = _isString ? hasOwn(setupState, ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
            if (isUnmount) {
              isArray(existing) && remove(existing, refValue);
            } else {
              if (!isArray(existing)) {
                if (_isString) {
                  refs[ref3] = [refValue];
                  if (hasOwn(setupState, ref3)) {
                    setupState[ref3] = refs[ref3];
                  }
                } else {
                  ref3.value = [refValue];
                  if (rawRef.k)
                    refs[rawRef.k] = ref3.value;
                }
              } else if (!existing.includes(refValue)) {
                existing.push(refValue);
              }
            }
          } else if (_isString) {
            refs[ref3] = value;
            if (hasOwn(setupState, ref3)) {
              setupState[ref3] = value;
            }
          } else if (_isRef) {
            ref3.value = value;
            if (rawRef.k)
              refs[rawRef.k] = value;
          } else
            ;
        };
        if (value) {
          doSet.id = -1;
          queuePostRenderEffect(doSet, parentSuspense);
        } else {
          doSet();
        }
      }
    }
  }
  let hasMismatch = false;
  const isSVGContainer = (container) => container.namespaceURI.includes("svg") && container.tagName !== "foreignObject";
  const isMathMLContainer = (container) => container.namespaceURI.includes("MathML");
  const getContainerType = (container) => {
    if (isSVGContainer(container))
      return "svg";
    if (isMathMLContainer(container))
      return "mathml";
    return void 0;
  };
  const isComment = (node) => node.nodeType === 8;
  function createHydrationFunctions(rendererInternals) {
    const {
      mt: mountComponent,
      p: patch,
      o: {
        patchProp: patchProp2,
        createText,
        nextSibling,
        parentNode,
        remove: remove2,
        insert,
        createComment
      }
    } = rendererInternals;
    const hydrate2 = (vnode, container) => {
      if (!container.hasChildNodes()) {
        patch(null, vnode, container);
        flushPostFlushCbs();
        container._vnode = vnode;
        return;
      }
      hasMismatch = false;
      hydrateNode(container.firstChild, vnode, null, null, null);
      flushPostFlushCbs();
      container._vnode = vnode;
      if (hasMismatch && true) {
        console.error(`Hydration completed but contains mismatches.`);
      }
    };
    const hydrateNode = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized = false) => {
      const isFragmentStart = isComment(node) && node.data === "[";
      const onMismatch = () => handleMismatch(
        node,
        vnode,
        parentComponent,
        parentSuspense,
        slotScopeIds,
        isFragmentStart
      );
      const { type, ref: ref3, shapeFlag, patchFlag } = vnode;
      let domType = node.nodeType;
      vnode.el = node;
      if (patchFlag === -2) {
        optimized = false;
        vnode.dynamicChildren = null;
      }
      let nextNode = null;
      switch (type) {
        case Text:
          if (domType !== 3) {
            if (vnode.children === "") {
              insert(vnode.el = createText(""), parentNode(node), node);
              nextNode = node;
            } else {
              nextNode = onMismatch();
            }
          } else {
            if (node.data !== vnode.children) {
              hasMismatch = true;
              node.data = vnode.children;
            }
            nextNode = nextSibling(node);
          }
          break;
        case Comment:
          if (isTemplateNode(node)) {
            nextNode = nextSibling(node);
            replaceNode(
              vnode.el = node.content.firstChild,
              node,
              parentComponent
            );
          } else if (domType !== 8 || isFragmentStart) {
            nextNode = onMismatch();
          } else {
            nextNode = nextSibling(node);
          }
          break;
        case Static:
          if (isFragmentStart) {
            node = nextSibling(node);
            domType = node.nodeType;
          }
          if (domType === 1 || domType === 3) {
            nextNode = node;
            const needToAdoptContent = !vnode.children.length;
            for (let i = 0; i < vnode.staticCount; i++) {
              if (needToAdoptContent)
                vnode.children += nextNode.nodeType === 1 ? nextNode.outerHTML : nextNode.data;
              if (i === vnode.staticCount - 1) {
                vnode.anchor = nextNode;
              }
              nextNode = nextSibling(nextNode);
            }
            return isFragmentStart ? nextSibling(nextNode) : nextNode;
          } else {
            onMismatch();
          }
          break;
        case Fragment:
          if (!isFragmentStart) {
            nextNode = onMismatch();
          } else {
            nextNode = hydrateFragment(
              node,
              vnode,
              parentComponent,
              parentSuspense,
              slotScopeIds,
              optimized
            );
          }
          break;
        default:
          if (shapeFlag & 1) {
            if ((domType !== 1 || vnode.type.toLowerCase() !== node.tagName.toLowerCase()) && !isTemplateNode(node)) {
              nextNode = onMismatch();
            } else {
              nextNode = hydrateElement(
                node,
                vnode,
                parentComponent,
                parentSuspense,
                slotScopeIds,
                optimized
              );
            }
          } else if (shapeFlag & 6) {
            vnode.slotScopeIds = slotScopeIds;
            const container = parentNode(node);
            if (isFragmentStart) {
              nextNode = locateClosingAnchor(node);
            } else if (isComment(node) && node.data === "teleport start") {
              nextNode = locateClosingAnchor(node, node.data, "teleport end");
            } else {
              nextNode = nextSibling(node);
            }
            mountComponent(
              vnode,
              container,
              null,
              parentComponent,
              parentSuspense,
              getContainerType(container),
              optimized
            );
            if (isAsyncWrapper(vnode)) {
              let subTree;
              if (isFragmentStart) {
                subTree = createVNode(Fragment);
                subTree.anchor = nextNode ? nextNode.previousSibling : container.lastChild;
              } else {
                subTree = node.nodeType === 3 ? createTextVNode("") : createVNode("div");
              }
              subTree.el = node;
              vnode.component.subTree = subTree;
            }
          } else if (shapeFlag & 64) {
            if (domType !== 8) {
              nextNode = onMismatch();
            } else {
              nextNode = vnode.type.hydrate(
                node,
                vnode,
                parentComponent,
                parentSuspense,
                slotScopeIds,
                optimized,
                rendererInternals,
                hydrateChildren
              );
            }
          } else if (shapeFlag & 128) {
            nextNode = vnode.type.hydrate(
              node,
              vnode,
              parentComponent,
              parentSuspense,
              getContainerType(parentNode(node)),
              slotScopeIds,
              optimized,
              rendererInternals,
              hydrateNode
            );
          } else
            ;
      }
      if (ref3 != null) {
        setRef(ref3, null, parentSuspense, vnode);
      }
      return nextNode;
    };
    const hydrateElement = (el, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
      optimized = optimized || !!vnode.dynamicChildren;
      const { type, props, patchFlag, shapeFlag, dirs, transition } = vnode;
      const forcePatch = type === "input" || type === "option";
      if (forcePatch || patchFlag !== -1) {
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "created");
        }
        let needCallTransitionHooks = false;
        if (isTemplateNode(el)) {
          needCallTransitionHooks = needTransition(parentSuspense, transition) && parentComponent && parentComponent.vnode.props && parentComponent.vnode.props.appear;
          const content = el.content.firstChild;
          if (needCallTransitionHooks) {
            transition.beforeEnter(content);
          }
          replaceNode(content, el, parentComponent);
          vnode.el = el = content;
        }
        if (shapeFlag & 16 && // skip if element has innerHTML / textContent
        !(props && (props.innerHTML || props.textContent))) {
          let next = hydrateChildren(
            el.firstChild,
            vnode,
            el,
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
          while (next) {
            hasMismatch = true;
            const cur = next;
            next = next.nextSibling;
            remove2(cur);
          }
        } else if (shapeFlag & 8) {
          if (el.textContent !== vnode.children) {
            hasMismatch = true;
            el.textContent = vnode.children;
          }
        }
        if (props) {
          if (forcePatch || !optimized || patchFlag & (16 | 32)) {
            for (const key in props) {
              if (forcePatch && (key.endsWith("value") || key === "indeterminate") || isOn(key) && !isReservedProp(key) || // force hydrate v-bind with .prop modifiers
              key[0] === ".") {
                patchProp2(
                  el,
                  key,
                  null,
                  props[key],
                  void 0,
                  void 0,
                  parentComponent
                );
              }
            }
          } else if (props.onClick) {
            patchProp2(
              el,
              "onClick",
              null,
              props.onClick,
              void 0,
              void 0,
              parentComponent
            );
          }
        }
        let vnodeHooks;
        if (vnodeHooks = props && props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHooks, parentComponent, vnode);
        }
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
        }
        if ((vnodeHooks = props && props.onVnodeMounted) || dirs || needCallTransitionHooks) {
          queueEffectWithSuspense(() => {
            vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
            needCallTransitionHooks && transition.enter(el);
            dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
          }, parentSuspense);
        }
      }
      return el.nextSibling;
    };
    const hydrateChildren = (node, parentVNode, container, parentComponent, parentSuspense, slotScopeIds, optimized) => {
      optimized = optimized || !!parentVNode.dynamicChildren;
      const children = parentVNode.children;
      const l2 = children.length;
      for (let i = 0; i < l2; i++) {
        const vnode = optimized ? children[i] : children[i] = normalizeVNode(children[i]);
        if (node) {
          node = hydrateNode(
            node,
            vnode,
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
        } else if (vnode.type === Text && !vnode.children) {
          continue;
        } else {
          hasMismatch = true;
          patch(
            null,
            vnode,
            container,
            null,
            parentComponent,
            parentSuspense,
            getContainerType(container),
            slotScopeIds
          );
        }
      }
      return node;
    };
    const hydrateFragment = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
      const { slotScopeIds: fragmentSlotScopeIds } = vnode;
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      const container = parentNode(node);
      const next = hydrateChildren(
        nextSibling(node),
        vnode,
        container,
        parentComponent,
        parentSuspense,
        slotScopeIds,
        optimized
      );
      if (next && isComment(next) && next.data === "]") {
        return nextSibling(vnode.anchor = next);
      } else {
        hasMismatch = true;
        insert(vnode.anchor = createComment(`]`), container, next);
        return next;
      }
    };
    const handleMismatch = (node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragment) => {
      hasMismatch = true;
      vnode.el = null;
      if (isFragment) {
        const end = locateClosingAnchor(node);
        while (true) {
          const next2 = nextSibling(node);
          if (next2 && next2 !== end) {
            remove2(next2);
          } else {
            break;
          }
        }
      }
      const next = nextSibling(node);
      const container = parentNode(node);
      remove2(node);
      patch(
        null,
        vnode,
        container,
        next,
        parentComponent,
        parentSuspense,
        getContainerType(container),
        slotScopeIds
      );
      return next;
    };
    const locateClosingAnchor = (node, open = "[", close = "]") => {
      let match = 0;
      while (node) {
        node = nextSibling(node);
        if (node && isComment(node)) {
          if (node.data === open)
            match++;
          if (node.data === close) {
            if (match === 0) {
              return nextSibling(node);
            } else {
              match--;
            }
          }
        }
      }
      return node;
    };
    const replaceNode = (newNode, oldNode, parentComponent) => {
      const parentNode2 = oldNode.parentNode;
      if (parentNode2) {
        parentNode2.replaceChild(newNode, oldNode);
      }
      let parent = parentComponent;
      while (parent) {
        if (parent.vnode.el === oldNode) {
          parent.vnode.el = parent.subTree.el = newNode;
        }
        parent = parent.parent;
      }
    };
    const isTemplateNode = (node) => {
      return node.nodeType === 1 && node.tagName.toLowerCase() === "template";
    };
    return [hydrate2, hydrateNode];
  }
  const queuePostRenderEffect = queueEffectWithSuspense;
  function createRenderer(options) {
    return baseCreateRenderer(options);
  }
  function createHydrationRenderer(options) {
    return baseCreateRenderer(options, createHydrationFunctions);
  }
  function baseCreateRenderer(options, createHydrationFns) {
    const target = getGlobalThis();
    target.__VUE__ = true;
    const {
      insert: hostInsert,
      remove: hostRemove,
      patchProp: hostPatchProp,
      createElement: hostCreateElement,
      createText: hostCreateText,
      createComment: hostCreateComment,
      setText: hostSetText,
      setElementText: hostSetElementText,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setScopeId: hostSetScopeId = NOOP,
      insertStaticContent: hostInsertStaticContent
    } = options;
    const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
      if (n1 === n2) {
        return;
      }
      if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1);
        unmount(n1, parentComponent, parentSuspense, true);
        n1 = null;
      }
      if (n2.patchFlag === -2) {
        optimized = false;
        n2.dynamicChildren = null;
      }
      const { type, ref: ref3, shapeFlag } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container, anchor);
          break;
        case Comment:
          processCommentNode(n1, n2, container, anchor);
          break;
        case Static:
          if (n1 == null) {
            mountStaticNode(n2, container, anchor, namespace);
          }
          break;
        case Fragment:
          processFragment(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          break;
        default:
          if (shapeFlag & 1) {
            processElement(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 6) {
            processComponent(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 64) {
            type.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          } else if (shapeFlag & 128) {
            type.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          } else
            ;
      }
      if (ref3 != null && parentComponent) {
        setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
      }
    };
    const processText = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateText(n2.children),
          container,
          anchor
        );
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processCommentNode = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateComment(n2.children || ""),
          container,
          anchor
        );
      } else {
        n2.el = n1.el;
      }
    };
    const mountStaticNode = (n2, container, anchor, namespace) => {
      [n2.el, n2.anchor] = hostInsertStaticContent(
        n2.children,
        container,
        anchor,
        namespace,
        n2.el,
        n2.anchor
      );
    };
    const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostInsert(el, container, nextSibling);
        el = next;
      }
      hostInsert(anchor, container, nextSibling);
    };
    const removeStaticNode = ({ el, anchor }) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostRemove(el);
        el = next;
      }
      hostRemove(anchor);
    };
    const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      if (n2.type === "svg") {
        namespace = "svg";
      } else if (n2.type === "math") {
        namespace = "mathml";
      }
      if (n1 == null) {
        mountElement(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        patchElement(
          n1,
          n2,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    };
    const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let el;
      let vnodeHook;
      const { props, shapeFlag, transition, dirs } = vnode;
      el = vnode.el = hostCreateElement(
        vnode.type,
        namespace,
        props && props.is,
        props
      );
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(
          vnode.children,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(vnode, namespace),
          slotScopeIds,
          optimized
        );
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(
              el,
              key,
              null,
              props[key],
              namespace,
              vnode.children,
              parentComponent,
              parentSuspense,
              unmountChildren
            );
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value, namespace);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      const needCallTransitionHooks = needTransition(parentSuspense, transition);
      if (needCallTransitionHooks) {
        transition.beforeEnter(el);
      }
      hostInsert(el, container, anchor);
      if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
    };
    const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
      if (scopeId) {
        hostSetScopeId(el, scopeId);
      }
      if (slotScopeIds) {
        for (let i = 0; i < slotScopeIds.length; i++) {
          hostSetScopeId(el, slotScopeIds[i]);
        }
      }
      if (parentComponent) {
        let subTree = parentComponent.subTree;
        if (vnode === subTree) {
          const parentVNode = parentComponent.vnode;
          setScopeId(
            el,
            parentVNode,
            parentVNode.scopeId,
            parentVNode.slotScopeIds,
            parentComponent.parent
          );
        }
      }
    };
    const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
      for (let i = start; i < children.length; i++) {
        const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
        patch(
          null,
          child,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    };
    const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const el = n2.el = n1.el;
      let { patchFlag, dynamicChildren, dirs } = n2;
      patchFlag |= n1.patchFlag & 16;
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      let vnodeHook;
      parentComponent && toggleRecurse(parentComponent, false);
      if (vnodeHook = newProps.onVnodeBeforeUpdate) {
        invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      }
      if (dirs) {
        invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
      }
      parentComponent && toggleRecurse(parentComponent, true);
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          el,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace),
          slotScopeIds
        );
      } else if (!optimized) {
        patchChildren(
          n1,
          n2,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace),
          slotScopeIds,
          false
        );
      }
      if (patchFlag > 0) {
        if (patchFlag & 16) {
          patchProps(
            el,
            n2,
            oldProps,
            newProps,
            parentComponent,
            parentSuspense,
            namespace
          );
        } else {
          if (patchFlag & 2) {
            if (oldProps.class !== newProps.class) {
              hostPatchProp(el, "class", null, newProps.class, namespace);
            }
          }
          if (patchFlag & 4) {
            hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
          }
          if (patchFlag & 8) {
            const propsToUpdate = n2.dynamicProps;
            for (let i = 0; i < propsToUpdate.length; i++) {
              const key = propsToUpdate[i];
              const prev = oldProps[key];
              const next = newProps[key];
              if (next !== prev || key === "value") {
                hostPatchProp(
                  el,
                  key,
                  prev,
                  next,
                  namespace,
                  n1.children,
                  parentComponent,
                  parentSuspense,
                  unmountChildren
                );
              }
            }
          }
        }
        if (patchFlag & 1) {
          if (n1.children !== n2.children) {
            hostSetElementText(el, n2.children);
          }
        }
      } else if (!optimized && dynamicChildren == null) {
        patchProps(
          el,
          n2,
          oldProps,
          newProps,
          parentComponent,
          parentSuspense,
          namespace
        );
      }
      if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
        }, parentSuspense);
      }
    };
    const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
      for (let i = 0; i < newChildren.length; i++) {
        const oldVNode = oldChildren[i];
        const newVNode = newChildren[i];
        const container = (
          // oldVNode may be an errored async setup() component inside Suspense
          // which will not have a mounted element
          oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
          // of the Fragment itself so it can move its children.
          (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
          // which also requires the correct parent container
          !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
          oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
            // In other cases, the parent container is not actually used so we
            // just pass the block element here to avoid a DOM parentNode call.
            fallbackContainer
          )
        );
        patch(
          oldVNode,
          newVNode,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          true
        );
      }
    };
    const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, namespace) => {
      if (oldProps !== newProps) {
        if (oldProps !== EMPTY_OBJ) {
          for (const key in oldProps) {
            if (!isReservedProp(key) && !(key in newProps)) {
              hostPatchProp(
                el,
                key,
                oldProps[key],
                null,
                namespace,
                vnode.children,
                parentComponent,
                parentSuspense,
                unmountChildren
              );
            }
          }
        }
        for (const key in newProps) {
          if (isReservedProp(key))
            continue;
          const next = newProps[key];
          const prev = oldProps[key];
          if (next !== prev && key !== "value") {
            hostPatchProp(
              el,
              key,
              prev,
              next,
              namespace,
              vnode.children,
              parentComponent,
              parentSuspense,
              unmountChildren
            );
          }
        }
        if ("value" in newProps) {
          hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
        }
      }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
      const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
      let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      if (n1 == null) {
        hostInsert(fragmentStartAnchor, container, anchor);
        hostInsert(fragmentEndAnchor, container, anchor);
        mountChildren(
          // #10007
          // such fragment like `<></>` will be compiled into
          // a fragment which doesn't have a children.
          // In this case fallback to an empty array
          n2.children || [],
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
        // of renderSlot() with no valid children
        n1.dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            container,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds
          );
          if (
            // #2080 if the stable fragment has a key, it's a <template v-for> that may
            //  get moved around. Make sure all root level vnodes inherit el.
            // #2134 or if it's a component root, it may also get moved around
            // as the component is being moved.
            n2.key != null || parentComponent && n2 === parentComponent.subTree
          ) {
            traverseStaticChildren(
              n1,
              n2,
              true
              /* shallow */
            );
          }
        } else {
          patchChildren(
            n1,
            n2,
            container,
            fragmentEndAnchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      n2.slotScopeIds = slotScopeIds;
      if (n1 == null) {
        if (n2.shapeFlag & 512) {
          parentComponent.ctx.activate(
            n2,
            container,
            anchor,
            namespace,
            optimized
          );
        } else {
          mountComponent(
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            optimized
          );
        }
      } else {
        updateComponent(n1, n2, optimized);
      }
    };
    const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
      const instance = initialVNode.component = createComponentInstance(
        initialVNode,
        parentComponent,
        parentSuspense
      );
      if (isKeepAlive(initialVNode)) {
        instance.ctx.renderer = internals;
      }
      {
        setupComponent(instance);
      }
      if (instance.asyncDep) {
        parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
        if (!initialVNode.el) {
          const placeholder = instance.subTree = createVNode(Comment);
          processCommentNode(null, placeholder, container, anchor);
        }
      } else {
        setupRenderEffect(
          instance,
          initialVNode,
          container,
          anchor,
          parentSuspense,
          namespace,
          optimized
        );
      }
    };
    const updateComponent = (n1, n2, optimized) => {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2, optimized)) {
        if (instance.asyncDep && !instance.asyncResolved) {
          updateComponentPreRender(instance, n2, optimized);
          return;
        } else {
          instance.next = n2;
          invalidateJob(instance.update);
          instance.effect.dirty = true;
          instance.update();
        }
      } else {
        n2.el = n1.el;
        instance.vnode = n2;
      }
    };
    const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
      const componentUpdateFn = () => {
        if (!instance.isMounted) {
          let vnodeHook;
          const { el, props } = initialVNode;
          const { bm, m, parent } = instance;
          const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
          toggleRecurse(instance, false);
          if (bm) {
            invokeArrayFns(bm);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
          }
          toggleRecurse(instance, true);
          if (el && hydrateNode) {
            const hydrateSubTree = () => {
              instance.subTree = renderComponentRoot(instance);
              hydrateNode(
                el,
                instance.subTree,
                instance,
                parentSuspense,
                null
              );
            };
            if (isAsyncWrapperVNode) {
              initialVNode.type.__asyncLoader().then(
                // note: we are moving the render call into an async callback,
                // which means it won't track dependencies - but it's ok because
                // a server-rendered async wrapper is already in resolved state
                // and it will never need to change.
                () => !instance.isUnmounted && hydrateSubTree()
              );
            } else {
              hydrateSubTree();
            }
          } else {
            const subTree = instance.subTree = renderComponentRoot(instance);
            patch(
              null,
              subTree,
              container,
              anchor,
              instance,
              parentSuspense,
              namespace
            );
            initialVNode.el = subTree.el;
          }
          if (m) {
            queuePostRenderEffect(m, parentSuspense);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
            const scopedInitialVNode = initialVNode;
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
              parentSuspense
            );
          }
          if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
            instance.a && queuePostRenderEffect(instance.a, parentSuspense);
          }
          instance.isMounted = true;
          initialVNode = container = anchor = null;
        } else {
          let { next, bu, u, parent, vnode } = instance;
          {
            const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
            if (nonHydratedAsyncRoot) {
              if (next) {
                next.el = vnode.el;
                updateComponentPreRender(instance, next, optimized);
              }
              nonHydratedAsyncRoot.asyncDep.then(() => {
                if (!instance.isUnmounted) {
                  componentUpdateFn();
                }
              });
              return;
            }
          }
          let originNext = next;
          let vnodeHook;
          toggleRecurse(instance, false);
          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next, optimized);
          } else {
            next = vnode;
          }
          if (bu) {
            invokeArrayFns(bu);
          }
          if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
            invokeVNodeHook(vnodeHook, parent, next, vnode);
          }
          toggleRecurse(instance, true);
          const nextTree = renderComponentRoot(instance);
          const prevTree = instance.subTree;
          instance.subTree = nextTree;
          patch(
            prevTree,
            nextTree,
            // parent may have changed if it's in a teleport
            hostParentNode(prevTree.el),
            // anchor may have changed if it's in a fragment
            getNextHostNode(prevTree),
            instance,
            parentSuspense,
            namespace
          );
          next.el = nextTree.el;
          if (originNext === null) {
            updateHOCHostEl(instance, nextTree.el);
          }
          if (u) {
            queuePostRenderEffect(u, parentSuspense);
          }
          if (vnodeHook = next.props && next.props.onVnodeUpdated) {
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, next, vnode),
              parentSuspense
            );
          }
        }
      };
      const effect2 = instance.effect = new ReactiveEffect(
        componentUpdateFn,
        NOOP,
        () => queueJob(update),
        instance.scope
        // track it in component's effect scope
      );
      const update = instance.update = () => {
        if (effect2.dirty) {
          effect2.run();
        }
      };
      update.id = instance.uid;
      toggleRecurse(instance, true);
      update();
    };
    const updateComponentPreRender = (instance, nextVNode, optimized) => {
      nextVNode.component = instance;
      const prevProps = instance.vnode.props;
      instance.vnode = nextVNode;
      instance.next = null;
      updateProps(instance, nextVNode.props, prevProps, optimized);
      updateSlots(instance, nextVNode.children, optimized);
      pauseTracking();
      flushPreFlushCbs(instance);
      resetTracking();
    };
    const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
      const c1 = n1 && n1.children;
      const prevShapeFlag = n1 ? n1.shapeFlag : 0;
      const c2 = n2.children;
      const { patchFlag, shapeFlag } = n2;
      if (patchFlag > 0) {
        if (patchFlag & 128) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        } else if (patchFlag & 256) {
          patchUnkeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        }
      }
      if (shapeFlag & 8) {
        if (prevShapeFlag & 16) {
          unmountChildren(c1, parentComponent, parentSuspense);
        }
        if (c2 !== c1) {
          hostSetElementText(container, c2);
        }
      } else {
        if (prevShapeFlag & 16) {
          if (shapeFlag & 16) {
            patchKeyedChildren(
              c1,
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else {
            unmountChildren(c1, parentComponent, parentSuspense, true);
          }
        } else {
          if (prevShapeFlag & 8) {
            hostSetElementText(container, "");
          }
          if (shapeFlag & 16) {
            mountChildren(
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          }
        }
      }
    };
    const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      c1 = c1 || EMPTY_ARR;
      c2 = c2 || EMPTY_ARR;
      const oldLength = c1.length;
      const newLength = c2.length;
      const commonLength = Math.min(oldLength, newLength);
      let i;
      for (i = 0; i < commonLength; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        patch(
          c1[i],
          nextChild,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
      if (oldLength > newLength) {
        unmountChildren(
          c1,
          parentComponent,
          parentSuspense,
          true,
          false,
          commonLength
        );
      } else {
        mountChildren(
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
          commonLength
        );
      }
    };
    const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let i = 0;
      const l2 = c2.length;
      let e1 = c1.length - 1;
      let e2 = l2 - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
          while (i <= e2) {
            patch(
              null,
              c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            i++;
          }
        }
      } else if (i > e2) {
        while (i <= e1) {
          unmount(c1[i], parentComponent, parentSuspense, true);
          i++;
        }
      } else {
        const s1 = i;
        const s2 = i;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (i = s2; i <= e2; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          if (nextChild.key != null) {
            keyToNewIndexMap.set(nextChild.key, i);
          }
        }
        let j2;
        let patched = 0;
        const toBePatched = e2 - s2 + 1;
        let moved = false;
        let maxNewIndexSoFar = 0;
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i = 0; i < toBePatched; i++)
          newIndexToOldIndexMap[i] = 0;
        for (i = s1; i <= e1; i++) {
          const prevChild = c1[i];
          if (patched >= toBePatched) {
            unmount(prevChild, parentComponent, parentSuspense, true);
            continue;
          }
          let newIndex;
          if (prevChild.key != null) {
            newIndex = keyToNewIndexMap.get(prevChild.key);
          } else {
            for (j2 = s2; j2 <= e2; j2++) {
              if (newIndexToOldIndexMap[j2 - s2] === 0 && isSameVNodeType(prevChild, c2[j2])) {
                newIndex = j2;
                break;
              }
            }
          }
          if (newIndex === void 0) {
            unmount(prevChild, parentComponent, parentSuspense, true);
          } else {
            newIndexToOldIndexMap[newIndex - s2] = i + 1;
            if (newIndex >= maxNewIndexSoFar) {
              maxNewIndexSoFar = newIndex;
            } else {
              moved = true;
            }
            patch(
              prevChild,
              c2[newIndex],
              container,
              null,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            patched++;
          }
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
        j2 = increasingNewIndexSequence.length - 1;
        for (i = toBePatched - 1; i >= 0; i--) {
          const nextIndex = s2 + i;
          const nextChild = c2[nextIndex];
          const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
          if (newIndexToOldIndexMap[i] === 0) {
            patch(
              null,
              nextChild,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (moved) {
            if (j2 < 0 || i !== increasingNewIndexSequence[j2]) {
              move(nextChild, container, anchor, 2);
            } else {
              j2--;
            }
          }
        }
      }
    };
    const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
      const { el, type, transition, children, shapeFlag } = vnode;
      if (shapeFlag & 6) {
        move(vnode.component.subTree, container, anchor, moveType);
        return;
      }
      if (shapeFlag & 128) {
        vnode.suspense.move(container, anchor, moveType);
        return;
      }
      if (shapeFlag & 64) {
        type.move(vnode, container, anchor, internals);
        return;
      }
      if (type === Fragment) {
        hostInsert(el, container, anchor);
        for (let i = 0; i < children.length; i++) {
          move(children[i], container, anchor, moveType);
        }
        hostInsert(vnode.anchor, container, anchor);
        return;
      }
      if (type === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      }
      const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
      if (needTransition2) {
        if (moveType === 0) {
          transition.beforeEnter(el);
          hostInsert(el, container, anchor);
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        } else {
          const { leave, delayLeave, afterLeave } = transition;
          const remove22 = () => hostInsert(el, container, anchor);
          const performLeave = () => {
            leave(el, () => {
              remove22();
              afterLeave && afterLeave();
            });
          };
          if (delayLeave) {
            delayLeave(el, remove22, performLeave);
          } else {
            performLeave();
          }
        }
      } else {
        hostInsert(el, container, anchor);
      }
    };
    const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
      const {
        type,
        props,
        ref: ref3,
        children,
        dynamicChildren,
        shapeFlag,
        patchFlag,
        dirs
      } = vnode;
      if (ref3 != null) {
        setRef(ref3, null, parentSuspense, vnode, true);
      }
      if (shapeFlag & 256) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }
      const shouldInvokeDirs = shapeFlag & 1 && dirs;
      const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
      let vnodeHook;
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
      if (shapeFlag & 6) {
        unmountComponent(vnode.component, parentSuspense, doRemove);
      } else {
        if (shapeFlag & 128) {
          vnode.suspense.unmount(parentSuspense, doRemove);
          return;
        }
        if (shouldInvokeDirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
        }
        if (shapeFlag & 64) {
          vnode.type.remove(
            vnode,
            parentComponent,
            parentSuspense,
            optimized,
            internals,
            doRemove
          );
        } else if (dynamicChildren && // #1153: fast path should not be taken for non-stable (v-for) fragments
        (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
          unmountChildren(
            dynamicChildren,
            parentComponent,
            parentSuspense,
            false,
            true
          );
        } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
          unmountChildren(children, parentComponent, parentSuspense);
        }
        if (doRemove) {
          remove2(vnode);
        }
      }
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        }, parentSuspense);
      }
    };
    const remove2 = (vnode) => {
      const { type, el, anchor, transition } = vnode;
      if (type === Fragment) {
        {
          removeFragment(el, anchor);
        }
        return;
      }
      if (type === Static) {
        removeStaticNode(vnode);
        return;
      }
      const performRemove = () => {
        hostRemove(el);
        if (transition && !transition.persisted && transition.afterLeave) {
          transition.afterLeave();
        }
      };
      if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
        const { leave, delayLeave } = transition;
        const performLeave = () => leave(el, performRemove);
        if (delayLeave) {
          delayLeave(vnode.el, performRemove, performLeave);
        } else {
          performLeave();
        }
      } else {
        performRemove();
      }
    };
    const removeFragment = (cur, end) => {
      let next;
      while (cur !== end) {
        next = hostNextSibling(cur);
        hostRemove(cur);
        cur = next;
      }
      hostRemove(end);
    };
    const unmountComponent = (instance, parentSuspense, doRemove) => {
      const { bum, scope, update, subTree, um } = instance;
      if (bum) {
        invokeArrayFns(bum);
      }
      scope.stop();
      if (update) {
        update.active = false;
        unmount(subTree, instance, parentSuspense, doRemove);
      }
      if (um) {
        queuePostRenderEffect(um, parentSuspense);
      }
      queuePostRenderEffect(() => {
        instance.isUnmounted = true;
      }, parentSuspense);
      if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
        parentSuspense.deps--;
        if (parentSuspense.deps === 0) {
          parentSuspense.resolve();
        }
      }
    };
    const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
      for (let i = start; i < children.length; i++) {
        unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
      }
    };
    const getNextHostNode = (vnode) => {
      if (vnode.shapeFlag & 6) {
        return getNextHostNode(vnode.component.subTree);
      }
      if (vnode.shapeFlag & 128) {
        return vnode.suspense.next();
      }
      return hostNextSibling(vnode.anchor || vnode.el);
    };
    let isFlushing2 = false;
    const render2 = (vnode, container, namespace) => {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null, null, true);
        }
      } else {
        patch(
          container._vnode || null,
          vnode,
          container,
          null,
          null,
          null,
          namespace
        );
      }
      if (!isFlushing2) {
        isFlushing2 = true;
        flushPreFlushCbs();
        flushPostFlushCbs();
        isFlushing2 = false;
      }
      container._vnode = vnode;
    };
    const internals = {
      p: patch,
      um: unmount,
      m: move,
      r: remove2,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    let hydrate2;
    let hydrateNode;
    if (createHydrationFns) {
      [hydrate2, hydrateNode] = createHydrationFns(
        internals
      );
    }
    return {
      render: render2,
      hydrate: hydrate2,
      createApp: createAppAPI(render2, hydrate2)
    };
  }
  function resolveChildrenNamespace({ type, props }, currentNamespace) {
    return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
  }
  function toggleRecurse({ effect: effect2, update }, allowed) {
    effect2.allowRecurse = update.allowRecurse = allowed;
  }
  function needTransition(parentSuspense, transition) {
    return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
  }
  function traverseStaticChildren(n1, n2, shallow = false) {
    const ch1 = n1.children;
    const ch2 = n2.children;
    if (isArray(ch1) && isArray(ch2)) {
      for (let i = 0; i < ch1.length; i++) {
        const c1 = ch1[i];
        let c2 = ch2[i];
        if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
          if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
            c2 = ch2[i] = cloneIfMounted(ch2[i]);
            c2.el = c1.el;
          }
          if (!shallow)
            traverseStaticChildren(c1, c2);
        }
        if (c2.type === Text) {
          c2.el = c1.el;
        }
      }
    }
  }
  function getSequence(arr) {
    const p2 = arr.slice();
    const result = [0];
    let i, j2, u, v, c2;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j2 = result[result.length - 1];
        if (arr[j2] < arrI) {
          p2[i] = j2;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c2 = u + v >> 1;
          if (arr[result[c2]] < arrI) {
            u = c2 + 1;
          } else {
            v = c2;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p2[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p2[v];
    }
    return result;
  }
  function locateNonHydratedAsyncRoot(instance) {
    const subComponent = instance.subTree.component;
    if (subComponent) {
      if (subComponent.asyncDep && !subComponent.asyncResolved) {
        return subComponent;
      } else {
        return locateNonHydratedAsyncRoot(subComponent);
      }
    }
  }
  const isTeleport = (type) => type.__isTeleport;
  const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
  const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
  const isTargetMathML = (target) => typeof MathMLElement === "function" && target instanceof MathMLElement;
  const resolveTarget = (props, select) => {
    const targetSelector = props && props.to;
    if (isString(targetSelector)) {
      if (!select) {
        return null;
      } else {
        const target = select(targetSelector);
        return target;
      }
    } else {
      return targetSelector;
    }
  };
  const TeleportImpl = {
    name: "Teleport",
    __isTeleport: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals) {
      const {
        mc: mountChildren,
        pc: patchChildren,
        pbc: patchBlockChildren,
        o: { insert, querySelector, createText, createComment }
      } = internals;
      const disabled = isTeleportDisabled(n2.props);
      let { shapeFlag, children, dynamicChildren } = n2;
      if (n1 == null) {
        const placeholder = n2.el = createText("");
        const mainAnchor = n2.anchor = createText("");
        insert(placeholder, container, anchor);
        insert(mainAnchor, container, anchor);
        const target = n2.target = resolveTarget(n2.props, querySelector);
        const targetAnchor = n2.targetAnchor = createText("");
        if (target) {
          insert(targetAnchor, target);
          if (namespace === "svg" || isTargetSVG(target)) {
            namespace = "svg";
          } else if (namespace === "mathml" || isTargetMathML(target)) {
            namespace = "mathml";
          }
        }
        const mount = (container2, anchor2) => {
          if (shapeFlag & 16) {
            mountChildren(
              children,
              container2,
              anchor2,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          }
        };
        if (disabled) {
          mount(container, mainAnchor);
        } else if (target) {
          mount(target, targetAnchor);
        }
      } else {
        n2.el = n1.el;
        const mainAnchor = n2.anchor = n1.anchor;
        const target = n2.target = n1.target;
        const targetAnchor = n2.targetAnchor = n1.targetAnchor;
        const wasDisabled = isTeleportDisabled(n1.props);
        const currentContainer = wasDisabled ? container : target;
        const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
        if (namespace === "svg" || isTargetSVG(target)) {
          namespace = "svg";
        } else if (namespace === "mathml" || isTargetMathML(target)) {
          namespace = "mathml";
        }
        if (dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            currentContainer,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds
          );
          traverseStaticChildren(n1, n2, true);
        } else if (!optimized) {
          patchChildren(
            n1,
            n2,
            currentContainer,
            currentAnchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            false
          );
        }
        if (disabled) {
          if (!wasDisabled) {
            moveTeleport(
              n2,
              container,
              mainAnchor,
              internals,
              1
            );
          } else {
            if (n2.props && n1.props && n2.props.to !== n1.props.to) {
              n2.props.to = n1.props.to;
            }
          }
        } else {
          if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
            const nextTarget = n2.target = resolveTarget(
              n2.props,
              querySelector
            );
            if (nextTarget) {
              moveTeleport(
                n2,
                nextTarget,
                null,
                internals,
                0
              );
            }
          } else if (wasDisabled) {
            moveTeleport(
              n2,
              target,
              targetAnchor,
              internals,
              1
            );
          }
        }
      }
      updateCssVars(n2);
    },
    remove(vnode, parentComponent, parentSuspense, optimized, { um: unmount, o: { remove: hostRemove } }, doRemove) {
      const { shapeFlag, children, anchor, targetAnchor, target, props } = vnode;
      if (target) {
        hostRemove(targetAnchor);
      }
      doRemove && hostRemove(anchor);
      if (shapeFlag & 16) {
        const shouldRemove = doRemove || !isTeleportDisabled(props);
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          unmount(
            child,
            parentComponent,
            parentSuspense,
            shouldRemove,
            !!child.dynamicChildren
          );
        }
      }
    },
    move: moveTeleport,
    hydrate: hydrateTeleport
  };
  function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
    if (moveType === 0) {
      insert(vnode.targetAnchor, container, parentAnchor);
    }
    const { el, anchor, shapeFlag, children, props } = vnode;
    const isReorder = moveType === 2;
    if (isReorder) {
      insert(el, container, parentAnchor);
    }
    if (!isReorder || isTeleportDisabled(props)) {
      if (shapeFlag & 16) {
        for (let i = 0; i < children.length; i++) {
          move(
            children[i],
            container,
            parentAnchor,
            2
          );
        }
      }
    }
    if (isReorder) {
      insert(anchor, container, parentAnchor);
    }
  }
  function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, {
    o: { nextSibling, parentNode, querySelector }
  }, hydrateChildren) {
    const target = vnode.target = resolveTarget(
      vnode.props,
      querySelector
    );
    if (target) {
      const targetNode = target._lpa || target.firstChild;
      if (vnode.shapeFlag & 16) {
        if (isTeleportDisabled(vnode.props)) {
          vnode.anchor = hydrateChildren(
            nextSibling(node),
            vnode,
            parentNode(node),
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
          vnode.targetAnchor = targetNode;
        } else {
          vnode.anchor = nextSibling(node);
          let targetAnchor = targetNode;
          while (targetAnchor) {
            targetAnchor = nextSibling(targetAnchor);
            if (targetAnchor && targetAnchor.nodeType === 8 && targetAnchor.data === "teleport anchor") {
              vnode.targetAnchor = targetAnchor;
              target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
              break;
            }
          }
          hydrateChildren(
            targetNode,
            vnode,
            target,
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
        }
      }
      updateCssVars(vnode);
    }
    return vnode.anchor && nextSibling(vnode.anchor);
  }
  const Teleport = TeleportImpl;
  function updateCssVars(vnode) {
    const ctx = vnode.ctx;
    if (ctx && ctx.ut) {
      let node = vnode.children[0].el;
      while (node && node !== vnode.targetAnchor) {
        if (node.nodeType === 1)
          node.setAttribute("data-v-owner", ctx.uid);
        node = node.nextSibling;
      }
      ctx.ut();
    }
  }
  const Fragment = Symbol.for("v-fgt");
  const Text = Symbol.for("v-txt");
  const Comment = Symbol.for("v-cmt");
  const Static = Symbol.for("v-stc");
  const blockStack = [];
  let currentBlock = null;
  function openBlock(disableTracking = false) {
    blockStack.push(currentBlock = disableTracking ? null : []);
  }
  function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
  }
  let isBlockTreeEnabled = 1;
  function setBlockTracking(value) {
    isBlockTreeEnabled += value;
  }
  function setupBlock(vnode) {
    vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
    closeBlock();
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
    return setupBlock(
      createBaseVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        shapeFlag,
        true
      )
    );
  }
  function createBlock(type, props, children, patchFlag, dynamicProps) {
    return setupBlock(
      createVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        true
      )
    );
  }
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  function transformVNodeArgs(transformer) {
  }
  const InternalObjectKey = `__vInternal`;
  const normalizeKey = ({ key }) => key != null ? key : null;
  const normalizeRef = ({
    ref: ref3,
    ref_key,
    ref_for
  }) => {
    if (typeof ref3 === "number") {
      ref3 = "" + ref3;
    }
    return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
  };
  function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
    const vnode = {
      __v_isVNode: true,
      __v_skip: true,
      type,
      props,
      key: props && normalizeKey(props),
      ref: props && normalizeRef(props),
      scopeId: currentScopeId,
      slotScopeIds: null,
      children,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag,
      patchFlag,
      dynamicProps,
      dynamicChildren: null,
      appContext: null,
      ctx: currentRenderingInstance
    };
    if (needFullChildrenNormalization) {
      normalizeChildren$1(vnode, children);
      if (shapeFlag & 128) {
        type.normalize(vnode);
      }
    } else if (children) {
      vnode.shapeFlag |= isString(children) ? 8 : 16;
    }
    if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
    !isBlockNode && // has current parent block
    currentBlock && // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    vnode.patchFlag !== 32) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  const createVNode = _createVNode;
  function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type || type === NULL_DYNAMIC_COMPONENT) {
      type = Comment;
    }
    if (isVNode(type)) {
      const cloned = cloneVNode(
        type,
        props,
        true
        /* mergeRef: true */
      );
      if (children) {
        normalizeChildren$1(cloned, children);
      }
      if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
        if (cloned.shapeFlag & 6) {
          currentBlock[currentBlock.indexOf(type)] = cloned;
        } else {
          currentBlock.push(cloned);
        }
      }
      cloned.patchFlag |= -2;
      return cloned;
    }
    if (isClassComponent(type)) {
      type = type.__vccOpts;
    }
    if (props) {
      props = guardReactiveProps(props);
      let { class: klass, style } = props;
      if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
      }
      if (isObject$4(style)) {
        if (isProxy(style) && !isArray(style)) {
          style = extend({}, style);
        }
        props.style = normalizeStyle(style);
      }
    }
    const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$4(type) ? 4 : isFunction(type) ? 2 : 0;
    return createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      isBlockNode,
      true
    );
  }
  function guardReactiveProps(props) {
    if (!props)
      return null;
    return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
  }
  function cloneVNode(vnode, extraProps, mergeRef = false) {
    const { props, ref: ref3, patchFlag, children } = vnode;
    const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
    const cloned = {
      __v_isVNode: true,
      __v_skip: true,
      type: vnode.type,
      props: mergedProps,
      key: mergedProps && normalizeKey(mergedProps),
      ref: extraProps && extraProps.ref ? (
        // #2078 in the case of <component :is="vnode" ref="extra"/>
        // if the vnode itself already has a ref, cloneVNode will need to merge
        // the refs so the single vnode can be set on multiple refs
        mergeRef && ref3 ? isArray(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
      ) : ref3,
      scopeId: vnode.scopeId,
      slotScopeIds: vnode.slotScopeIds,
      children,
      target: vnode.target,
      targetAnchor: vnode.targetAnchor,
      staticCount: vnode.staticCount,
      shapeFlag: vnode.shapeFlag,
      // if the vnode is cloned with extra props, we can no longer assume its
      // existing patch flag to be reliable and need to add the FULL_PROPS flag.
      // note: preserve flag for fragments since they use the flag for children
      // fast paths only.
      patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition: vnode.transition,
      // These should technically only be non-null on mounted VNodes. However,
      // they *should* be copied for kept-alive vnodes. So we just always copy
      // them since them being non-null during a mount doesn't affect the logic as
      // they will simply be overwritten.
      component: vnode.component,
      suspense: vnode.suspense,
      ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
      ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
      el: vnode.el,
      anchor: vnode.anchor,
      ctx: vnode.ctx,
      ce: vnode.ce
    };
    return cloned;
  }
  function createTextVNode(text = " ", flag = 0) {
    return createVNode(Text, null, text, flag);
  }
  function createStaticVNode(content, numberOfNodes) {
    const vnode = createVNode(Static, null, content);
    vnode.staticCount = numberOfNodes;
    return vnode;
  }
  function createCommentVNode(text = "", asBlock = false) {
    return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
  }
  function normalizeVNode(child) {
    if (child == null || typeof child === "boolean") {
      return createVNode(Comment);
    } else if (isArray(child)) {
      return createVNode(
        Fragment,
        null,
        // #3666, avoid reference pollution when reusing vnode
        child.slice()
      );
    } else if (typeof child === "object") {
      return cloneIfMounted(child);
    } else {
      return createVNode(Text, null, String(child));
    }
  }
  function cloneIfMounted(child) {
    return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
  }
  function normalizeChildren$1(vnode, children) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
      children = null;
    } else if (isArray(children)) {
      type = 16;
    } else if (typeof children === "object") {
      if (shapeFlag & (1 | 64)) {
        const slot = children.default;
        if (slot) {
          slot._c && (slot._d = false);
          normalizeChildren$1(vnode, slot());
          slot._c && (slot._d = true);
        }
        return;
      } else {
        type = 32;
        const slotFlag = children._;
        if (!slotFlag && !(InternalObjectKey in children)) {
          children._ctx = currentRenderingInstance;
        } else if (slotFlag === 3 && currentRenderingInstance) {
          if (currentRenderingInstance.slots._ === 1) {
            children._ = 1;
          } else {
            children._ = 2;
            vnode.patchFlag |= 1024;
          }
        }
      }
    } else if (isFunction(children)) {
      children = { default: children, _ctx: currentRenderingInstance };
      type = 32;
    } else {
      children = String(children);
      if (shapeFlag & 64) {
        type = 16;
        children = [createTextVNode(children)];
      } else {
        type = 8;
      }
    }
    vnode.children = children;
    vnode.shapeFlag |= type;
  }
  function mergeProps(...args) {
    const ret = {};
    for (let i = 0; i < args.length; i++) {
      const toMerge = args[i];
      for (const key in toMerge) {
        if (key === "class") {
          if (ret.class !== toMerge.class) {
            ret.class = normalizeClass([ret.class, toMerge.class]);
          }
        } else if (key === "style") {
          ret.style = normalizeStyle([ret.style, toMerge.style]);
        } else if (isOn(key)) {
          const existing = ret[key];
          const incoming = toMerge[key];
          if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
            ret[key] = existing ? [].concat(existing, incoming) : incoming;
          }
        } else if (key !== "") {
          ret[key] = toMerge[key];
        }
      }
    }
    return ret;
  }
  function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7, [
      vnode,
      prevVNode
    ]);
  }
  const emptyAppContext = createAppContext();
  let uid = 0;
  function createComponentInstance(vnode, parent, suspense) {
    const type = vnode.type;
    const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    const instance = {
      uid: uid++,
      vnode,
      type,
      parent,
      appContext,
      root: null,
      // to be immediately set
      next: null,
      subTree: null,
      // will be set synchronously right after creation
      effect: null,
      update: null,
      // will be set synchronously right after creation
      scope: new EffectScope(
        true
        /* detached */
      ),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      accessCache: null,
      renderCache: [],
      // local resolved assets
      components: null,
      directives: null,
      // resolved props and emits options
      propsOptions: normalizePropsOptions(type, appContext),
      emitsOptions: normalizeEmitsOptions(type, appContext),
      // emit
      emit: null,
      // to be set immediately
      emitted: null,
      // props default value
      propsDefaults: EMPTY_OBJ,
      // inheritAttrs
      inheritAttrs: type.inheritAttrs,
      // state
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      attrsProxy: null,
      slotsProxy: null,
      // suspense related
      suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: false,
      // lifecycle hooks
      // not using enums here because it results in computed properties
      isMounted: false,
      isUnmounted: false,
      isDeactivated: false,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    };
    {
      instance.ctx = { _: instance };
    }
    instance.root = parent ? parent.root : instance;
    instance.emit = emit.bind(null, instance);
    if (vnode.ce) {
      vnode.ce(instance);
    }
    return instance;
  }
  let currentInstance = null;
  const getCurrentInstance = () => currentInstance || currentRenderingInstance;
  let internalSetCurrentInstance;
  let setInSSRSetupState;
  {
    const g2 = getGlobalThis();
    const registerGlobalSetter = (key, setter) => {
      let setters;
      if (!(setters = g2[key]))
        setters = g2[key] = [];
      setters.push(setter);
      return (v) => {
        if (setters.length > 1)
          setters.forEach((set2) => set2(v));
        else
          setters[0](v);
      };
    };
    internalSetCurrentInstance = registerGlobalSetter(
      `__VUE_INSTANCE_SETTERS__`,
      (v) => currentInstance = v
    );
    setInSSRSetupState = registerGlobalSetter(
      `__VUE_SSR_SETTERS__`,
      (v) => isInSSRComponentSetup = v
    );
  }
  const setCurrentInstance = (instance) => {
    const prev = currentInstance;
    internalSetCurrentInstance(instance);
    instance.scope.on();
    return () => {
      instance.scope.off();
      internalSetCurrentInstance(prev);
    };
  };
  const unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off();
    internalSetCurrentInstance(null);
  };
  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
  }
  let isInSSRComponentSetup = false;
  function setupComponent(instance, isSSR = false) {
    isSSR && setInSSRSetupState(isSSR);
    const { props, children } = instance.vnode;
    const isStateful = isStatefulComponent(instance);
    initProps(instance, props, isStateful, isSSR);
    initSlots(instance, children);
    const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
    isSSR && setInSSRSetupState(false);
    return setupResult;
  }
  function setupStatefulComponent(instance, isSSR) {
    const Component = instance.type;
    instance.accessCache = /* @__PURE__ */ Object.create(null);
    instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
    const { setup } = Component;
    if (setup) {
      const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
      const reset = setCurrentInstance(instance);
      pauseTracking();
      const setupResult = callWithErrorHandling(
        setup,
        instance,
        0,
        [
          instance.props,
          setupContext
        ]
      );
      resetTracking();
      reset();
      if (isPromise(setupResult)) {
        setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
        if (isSSR) {
          return setupResult.then((resolvedResult) => {
            handleSetupResult(instance, resolvedResult, isSSR);
          }).catch((e) => {
            handleError(e, instance, 0);
          });
        } else {
          instance.asyncDep = setupResult;
        }
      } else {
        handleSetupResult(instance, setupResult, isSSR);
      }
    } else {
      finishComponentSetup(instance, isSSR);
    }
  }
  function handleSetupResult(instance, setupResult, isSSR) {
    if (isFunction(setupResult)) {
      if (instance.type.__ssrInlineRender) {
        instance.ssrRender = setupResult;
      } else {
        instance.render = setupResult;
      }
    } else if (isObject$4(setupResult)) {
      instance.setupState = proxyRefs(setupResult);
    } else
      ;
    finishComponentSetup(instance, isSSR);
  }
  let compile$1;
  let installWithProxy;
  function registerRuntimeCompiler(_compile) {
    compile$1 = _compile;
    installWithProxy = (i) => {
      if (i.render._rc) {
        i.withProxy = new Proxy(i.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
      }
    };
  }
  const isRuntimeOnly = () => !compile$1;
  function finishComponentSetup(instance, isSSR, skipOptions) {
    const Component = instance.type;
    if (!instance.render) {
      if (!isSSR && compile$1 && !Component.render) {
        const template = Component.template || resolveMergedOptions(instance).template;
        if (template) {
          const { isCustomElement, compilerOptions } = instance.appContext.config;
          const { delimiters, compilerOptions: componentCompilerOptions } = Component;
          const finalCompilerOptions = extend(
            extend(
              {
                isCustomElement,
                delimiters
              },
              compilerOptions
            ),
            componentCompilerOptions
          );
          Component.render = compile$1(template, finalCompilerOptions);
        }
      }
      instance.render = Component.render || NOOP;
      if (installWithProxy) {
        installWithProxy(instance);
      }
    }
    {
      const reset = setCurrentInstance(instance);
      pauseTracking();
      try {
        applyOptions(instance);
      } finally {
        resetTracking();
        reset();
      }
    }
  }
  function getAttrsProxy(instance) {
    return instance.attrsProxy || (instance.attrsProxy = new Proxy(
      instance.attrs,
      {
        get(target, key) {
          track(instance, "get", "$attrs");
          return target[key];
        }
      }
    ));
  }
  function createSetupContext(instance) {
    const expose = (exposed) => {
      instance.exposed = exposed || {};
    };
    {
      return {
        get attrs() {
          return getAttrsProxy(instance);
        },
        slots: instance.slots,
        emit: instance.emit,
        expose
      };
    }
  }
  function getExposeProxy(instance) {
    if (instance.exposed) {
      return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key) {
          if (key in target) {
            return target[key];
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
          }
        },
        has(target, key) {
          return key in target || key in publicPropertiesMap;
        }
      }));
    }
  }
  const classifyRE = /(?:^|[-_])(\w)/g;
  const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
  function getComponentName(Component, includeInferred = true) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
  }
  function formatComponentName(instance, Component, isRoot = false) {
    let name = getComponentName(Component);
    if (!name && Component.__file) {
      const match = Component.__file.match(/([^/\\]+)\.\w+$/);
      if (match) {
        name = match[1];
      }
    }
    if (!name && instance && instance.parent) {
      const inferFromRegistry = (registry) => {
        for (const key in registry) {
          if (registry[key] === Component) {
            return key;
          }
        }
      };
      name = inferFromRegistry(
        instance.components || instance.parent.type.components
      ) || inferFromRegistry(instance.appContext.components);
    }
    return name ? classify(name) : isRoot ? `App` : `Anonymous`;
  }
  function isClassComponent(value) {
    return isFunction(value) && "__vccOpts" in value;
  }
  const computed = (getterOrOptions, debugOptions) => {
    return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  };
  function useModel(props, name, options = EMPTY_OBJ) {
    const i = getCurrentInstance();
    const camelizedName = camelize(name);
    const hyphenatedName = hyphenate(name);
    const res = customRef((track2, trigger2) => {
      let localValue;
      watchSyncEffect(() => {
        const propValue = props[name];
        if (hasChanged(localValue, propValue)) {
          localValue = propValue;
          trigger2();
        }
      });
      return {
        get() {
          track2();
          return options.get ? options.get(localValue) : localValue;
        },
        set(value) {
          const rawProps = i.vnode.props;
          if (!(rawProps && // check if parent has passed v-model
          (name in rawProps || camelizedName in rawProps || hyphenatedName in rawProps) && (`onUpdate:${name}` in rawProps || `onUpdate:${camelizedName}` in rawProps || `onUpdate:${hyphenatedName}` in rawProps)) && hasChanged(value, localValue)) {
            localValue = value;
            trigger2();
          }
          i.emit(`update:${name}`, options.set ? options.set(value) : value);
        }
      };
    });
    const modifierKey = name === "modelValue" ? "modelModifiers" : `${name}Modifiers`;
    res[Symbol.iterator] = () => {
      let i2 = 0;
      return {
        next() {
          if (i2 < 2) {
            return { value: i2++ ? props[modifierKey] || {} : res, done: false };
          } else {
            return { done: true };
          }
        }
      };
    };
    return res;
  }
  function h(type, propsOrChildren, children) {
    const l2 = arguments.length;
    if (l2 === 2) {
      if (isObject$4(propsOrChildren) && !isArray(propsOrChildren)) {
        if (isVNode(propsOrChildren)) {
          return createVNode(type, null, [propsOrChildren]);
        }
        return createVNode(type, propsOrChildren);
      } else {
        return createVNode(type, null, propsOrChildren);
      }
    } else {
      if (l2 > 3) {
        children = Array.prototype.slice.call(arguments, 2);
      } else if (l2 === 3 && isVNode(children)) {
        children = [children];
      }
      return createVNode(type, propsOrChildren, children);
    }
  }
  function initCustomFormatter() {
    {
      return;
    }
  }
  function withMemo(memo, render2, cache, index) {
    const cached = cache[index];
    if (cached && isMemoSame(cached, memo)) {
      return cached;
    }
    const ret = render2();
    ret.memo = memo.slice();
    return cache[index] = ret;
  }
  function isMemoSame(cached, memo) {
    const prev = cached.memo;
    if (prev.length != memo.length) {
      return false;
    }
    for (let i = 0; i < prev.length; i++) {
      if (hasChanged(prev[i], memo[i])) {
        return false;
      }
    }
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(cached);
    }
    return true;
  }
  const version = "3.4.14";
  const warn = NOOP;
  const ErrorTypeStrings = ErrorTypeStrings$1;
  const devtools = devtools$1;
  const setDevtoolsHook = setDevtoolsHook$1;
  const _ssrUtils = {
    createComponentInstance,
    setupComponent,
    renderComponentRoot,
    setCurrentRenderingInstance,
    isVNode,
    normalizeVNode
  };
  const ssrUtils = _ssrUtils;
  const resolveFilter = null;
  const compatUtils = null;
  const DeprecationTypes = null;
  /**
  * @vue/runtime-dom v3.4.14
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  const svgNS = "http://www.w3.org/2000/svg";
  const mathmlNS = "http://www.w3.org/1998/Math/MathML";
  const doc = typeof document !== "undefined" ? document : null;
  const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
  const nodeOps = {
    insert: (child, parent, anchor) => {
      parent.insertBefore(child, anchor || null);
    },
    remove: (child) => {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    createElement: (tag, namespace, is, props) => {
      const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : doc.createElement(tag, is ? { is } : void 0);
      if (tag === "select" && props && props.multiple != null) {
        el.setAttribute("multiple", props.multiple);
      }
      return el;
    },
    createText: (text) => doc.createTextNode(text),
    createComment: (text) => doc.createComment(text),
    setText: (node, text) => {
      node.nodeValue = text;
    },
    setElementText: (el, text) => {
      el.textContent = text;
    },
    parentNode: (node) => node.parentNode,
    nextSibling: (node) => node.nextSibling,
    querySelector: (selector) => doc.querySelector(selector),
    setScopeId(el, id) {
      el.setAttribute(id, "");
    },
    // __UNSAFE__
    // Reason: innerHTML.
    // Static content here can only come from compiled templates.
    // As long as the user only uses trusted templates, this is safe.
    insertStaticContent(content, parent, anchor, namespace, start, end) {
      const before = anchor ? anchor.previousSibling : parent.lastChild;
      if (start && (start === end || start.nextSibling)) {
        while (true) {
          parent.insertBefore(start.cloneNode(true), anchor);
          if (start === end || !(start = start.nextSibling))
            break;
        }
      } else {
        templateContainer.innerHTML = namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content;
        const template = templateContainer.content;
        if (namespace === "svg" || namespace === "mathml") {
          const wrapper = template.firstChild;
          while (wrapper.firstChild) {
            template.appendChild(wrapper.firstChild);
          }
          template.removeChild(wrapper);
        }
        parent.insertBefore(template, anchor);
      }
      return [
        // first
        before ? before.nextSibling : parent.firstChild,
        // last
        anchor ? anchor.previousSibling : parent.lastChild
      ];
    }
  };
  const TRANSITION = "transition";
  const ANIMATION = "animation";
  const vtcKey = Symbol("_vtc");
  const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
  Transition.displayName = "Transition";
  const DOMTransitionPropsValidators = {
    name: String,
    type: String,
    css: {
      type: Boolean,
      default: true
    },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String
  };
  const TransitionPropsValidators = Transition.props = /* @__PURE__ */ extend(
    {},
    BaseTransitionPropsValidators,
    DOMTransitionPropsValidators
  );
  const callHook = (hook, args = []) => {
    if (isArray(hook)) {
      hook.forEach((h2) => h2(...args));
    } else if (hook) {
      hook(...args);
    }
  };
  const hasExplicitCallback = (hook) => {
    return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
  };
  function resolveTransitionProps(rawProps) {
    const baseProps = {};
    for (const key in rawProps) {
      if (!(key in DOMTransitionPropsValidators)) {
        baseProps[key] = rawProps[key];
      }
    }
    if (rawProps.css === false) {
      return baseProps;
    }
    const {
      name = "v",
      type,
      duration,
      enterFromClass = `${name}-enter-from`,
      enterActiveClass = `${name}-enter-active`,
      enterToClass = `${name}-enter-to`,
      appearFromClass = enterFromClass,
      appearActiveClass = enterActiveClass,
      appearToClass = enterToClass,
      leaveFromClass = `${name}-leave-from`,
      leaveActiveClass = `${name}-leave-active`,
      leaveToClass = `${name}-leave-to`
    } = rawProps;
    const durations = normalizeDuration(duration);
    const enterDuration = durations && durations[0];
    const leaveDuration = durations && durations[1];
    const {
      onBeforeEnter,
      onEnter,
      onEnterCancelled,
      onLeave,
      onLeaveCancelled,
      onBeforeAppear = onBeforeEnter,
      onAppear = onEnter,
      onAppearCancelled = onEnterCancelled
    } = baseProps;
    const finishEnter = (el, isAppear, done) => {
      removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
      removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
      done && done();
    };
    const finishLeave = (el, done) => {
      el._isLeaving = false;
      removeTransitionClass(el, leaveFromClass);
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
      done && done();
    };
    const makeEnterHook = (isAppear) => {
      return (el, done) => {
        const hook = isAppear ? onAppear : onEnter;
        const resolve2 = () => finishEnter(el, isAppear, done);
        callHook(hook, [el, resolve2]);
        nextFrame(() => {
          removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
          addTransitionClass(el, isAppear ? appearToClass : enterToClass);
          if (!hasExplicitCallback(hook)) {
            whenTransitionEnds(el, type, enterDuration, resolve2);
          }
        });
      };
    };
    return extend(baseProps, {
      onBeforeEnter(el) {
        callHook(onBeforeEnter, [el]);
        addTransitionClass(el, enterFromClass);
        addTransitionClass(el, enterActiveClass);
      },
      onBeforeAppear(el) {
        callHook(onBeforeAppear, [el]);
        addTransitionClass(el, appearFromClass);
        addTransitionClass(el, appearActiveClass);
      },
      onEnter: makeEnterHook(false),
      onAppear: makeEnterHook(true),
      onLeave(el, done) {
        el._isLeaving = true;
        const resolve2 = () => finishLeave(el, done);
        addTransitionClass(el, leaveFromClass);
        forceReflow();
        addTransitionClass(el, leaveActiveClass);
        nextFrame(() => {
          if (!el._isLeaving) {
            return;
          }
          removeTransitionClass(el, leaveFromClass);
          addTransitionClass(el, leaveToClass);
          if (!hasExplicitCallback(onLeave)) {
            whenTransitionEnds(el, type, leaveDuration, resolve2);
          }
        });
        callHook(onLeave, [el, resolve2]);
      },
      onEnterCancelled(el) {
        finishEnter(el, false);
        callHook(onEnterCancelled, [el]);
      },
      onAppearCancelled(el) {
        finishEnter(el, true);
        callHook(onAppearCancelled, [el]);
      },
      onLeaveCancelled(el) {
        finishLeave(el);
        callHook(onLeaveCancelled, [el]);
      }
    });
  }
  function normalizeDuration(duration) {
    if (duration == null) {
      return null;
    } else if (isObject$4(duration)) {
      return [NumberOf(duration.enter), NumberOf(duration.leave)];
    } else {
      const n = NumberOf(duration);
      return [n, n];
    }
  }
  function NumberOf(val) {
    const res = toNumber$2(val);
    return res;
  }
  function addTransitionClass(el, cls) {
    cls.split(/\s+/).forEach((c2) => c2 && el.classList.add(c2));
    (el[vtcKey] || (el[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
  }
  function removeTransitionClass(el, cls) {
    cls.split(/\s+/).forEach((c2) => c2 && el.classList.remove(c2));
    const _vtc = el[vtcKey];
    if (_vtc) {
      _vtc.delete(cls);
      if (!_vtc.size) {
        el[vtcKey] = void 0;
      }
    }
  }
  function nextFrame(cb) {
    requestAnimationFrame(() => {
      requestAnimationFrame(cb);
    });
  }
  let endId = 0;
  function whenTransitionEnds(el, expectedType, explicitTimeout, resolve2) {
    const id = el._endId = ++endId;
    const resolveIfNotStale = () => {
      if (id === el._endId) {
        resolve2();
      }
    };
    if (explicitTimeout) {
      return setTimeout(resolveIfNotStale, explicitTimeout);
    }
    const { type, timeout: timeout2, propCount } = getTransitionInfo(el, expectedType);
    if (!type) {
      return resolve2();
    }
    const endEvent = type + "end";
    let ended = 0;
    const end = () => {
      el.removeEventListener(endEvent, onEnd);
      resolveIfNotStale();
    };
    const onEnd = (e) => {
      if (e.target === el && ++ended >= propCount) {
        end();
      }
    };
    setTimeout(() => {
      if (ended < propCount) {
        end();
      }
    }, timeout2 + 1);
    el.addEventListener(endEvent, onEnd);
  }
  function getTransitionInfo(el, expectedType) {
    const styles = window.getComputedStyle(el);
    const getStyleProperties = (key) => (styles[key] || "").split(", ");
    const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
    const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
    const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
    const animationTimeout = getTimeout(animationDelays, animationDurations);
    let type = null;
    let timeout2 = 0;
    let propCount = 0;
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout2 = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout2 = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout2 = Math.max(transitionTimeout, animationTimeout);
      type = timeout2 > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
      propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
    }
    const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(
      getStyleProperties(`${TRANSITION}Property`).toString()
    );
    return {
      type,
      timeout: timeout2,
      propCount,
      hasTransform
    };
  }
  function getTimeout(delays, durations) {
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }
    return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
  }
  function toMs(s) {
    if (s === "auto")
      return 0;
    return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
  }
  function forceReflow() {
    return document.body.offsetHeight;
  }
  function patchClass(el, value, isSVG) {
    const transitionClasses = el[vtcKey];
    if (transitionClasses) {
      value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
    }
    if (value == null) {
      el.removeAttribute("class");
    } else if (isSVG) {
      el.setAttribute("class", value);
    } else {
      el.className = value;
    }
  }
  const vShowOldKey = Symbol("_vod");
  const vShow = {
    beforeMount(el, { value }, { transition }) {
      el[vShowOldKey] = el.style.display === "none" ? "" : el.style.display;
      if (transition && value) {
        transition.beforeEnter(el);
      } else {
        setDisplay(el, value);
      }
    },
    mounted(el, { value }, { transition }) {
      if (transition && value) {
        transition.enter(el);
      }
    },
    updated(el, { value, oldValue }, { transition }) {
      if (!value === !oldValue)
        return;
      if (transition) {
        if (value) {
          transition.beforeEnter(el);
          setDisplay(el, true);
          transition.enter(el);
        } else {
          transition.leave(el, () => {
            setDisplay(el, false);
          });
        }
      } else {
        setDisplay(el, value);
      }
    },
    beforeUnmount(el, { value }) {
      setDisplay(el, value);
    }
  };
  function setDisplay(el, value) {
    el.style.display = value ? el[vShowOldKey] : "none";
  }
  function initVShowForSSR() {
    vShow.getSSRProps = ({ value }) => {
      if (!value) {
        return { style: { display: "none" } };
      }
    };
  }
  const CSS_VAR_TEXT = Symbol("");
  function useCssVars(getter) {
    const instance = getCurrentInstance();
    if (!instance) {
      return;
    }
    const updateTeleports = instance.ut = (vars = getter(instance.proxy)) => {
      Array.from(
        document.querySelectorAll(`[data-v-owner="${instance.uid}"]`)
      ).forEach((node) => setVarsOnNode(node, vars));
    };
    const setVars = () => {
      const vars = getter(instance.proxy);
      setVarsOnVNode(instance.subTree, vars);
      updateTeleports(vars);
    };
    watchPostEffect(setVars);
    onMounted(() => {
      const ob = new MutationObserver(setVars);
      ob.observe(instance.subTree.el.parentNode, { childList: true });
      onUnmounted(() => ob.disconnect());
    });
  }
  function setVarsOnVNode(vnode, vars) {
    if (vnode.shapeFlag & 128) {
      const suspense = vnode.suspense;
      vnode = suspense.activeBranch;
      if (suspense.pendingBranch && !suspense.isHydrating) {
        suspense.effects.push(() => {
          setVarsOnVNode(suspense.activeBranch, vars);
        });
      }
    }
    while (vnode.component) {
      vnode = vnode.component.subTree;
    }
    if (vnode.shapeFlag & 1 && vnode.el) {
      setVarsOnNode(vnode.el, vars);
    } else if (vnode.type === Fragment) {
      vnode.children.forEach((c2) => setVarsOnVNode(c2, vars));
    } else if (vnode.type === Static) {
      let { el, anchor } = vnode;
      while (el) {
        setVarsOnNode(el, vars);
        if (el === anchor)
          break;
        el = el.nextSibling;
      }
    }
  }
  function setVarsOnNode(el, vars) {
    if (el.nodeType === 1) {
      const style = el.style;
      let cssText = "";
      for (const key in vars) {
        style.setProperty(`--${key}`, vars[key]);
        cssText += `--${key}: ${vars[key]};`;
      }
      style[CSS_VAR_TEXT] = cssText;
    }
  }
  function patchStyle(el, prev, next) {
    const style = el.style;
    const currentDisplay = style.display;
    const isCssString = isString(next);
    if (next && !isCssString) {
      if (prev && !isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
      for (const key in next) {
        setStyle(style, key, next[key]);
      }
    } else {
      if (isCssString) {
        if (prev !== next) {
          const cssVarText = style[CSS_VAR_TEXT];
          if (cssVarText) {
            next += ";" + cssVarText;
          }
          style.cssText = next;
        }
      } else if (prev) {
        el.removeAttribute("style");
      }
    }
    if (vShowOldKey in el) {
      style.display = currentDisplay;
    }
  }
  const importantRE = /\s*!important$/;
  function setStyle(style, name, val) {
    if (isArray(val)) {
      val.forEach((v) => setStyle(style, name, v));
    } else {
      if (val == null)
        val = "";
      if (name.startsWith("--")) {
        style.setProperty(name, val);
      } else {
        const prefixed = autoPrefix(style, name);
        if (importantRE.test(val)) {
          style.setProperty(
            hyphenate(prefixed),
            val.replace(importantRE, ""),
            "important"
          );
        } else {
          style[prefixed] = val;
        }
      }
    }
  }
  const prefixes$1 = ["Webkit", "Moz", "ms"];
  const prefixCache = {};
  function autoPrefix(style, rawName) {
    const cached = prefixCache[rawName];
    if (cached) {
      return cached;
    }
    let name = camelize(rawName);
    if (name !== "filter" && name in style) {
      return prefixCache[rawName] = name;
    }
    name = capitalize(name);
    for (let i = 0; i < prefixes$1.length; i++) {
      const prefixed = prefixes$1[i] + name;
      if (prefixed in style) {
        return prefixCache[rawName] = prefixed;
      }
    }
    return rawName;
  }
  const xlinkNS = "http://www.w3.org/1999/xlink";
  function patchAttr(el, key, value, isSVG, instance) {
    if (isSVG && key.startsWith("xlink:")) {
      if (value == null) {
        el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      const isBoolean = isSpecialBooleanAttr(key);
      if (value == null || isBoolean && !includeBooleanAttr(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, isBoolean ? "" : value);
      }
    }
  }
  function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
    if (key === "innerHTML" || key === "textContent") {
      if (prevChildren) {
        unmountChildren(prevChildren, parentComponent, parentSuspense);
      }
      el[key] = value == null ? "" : value;
      return;
    }
    const tag = el.tagName;
    if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
    !tag.includes("-")) {
      el._value = value;
      const oldValue = tag === "OPTION" ? el.getAttribute("value") : el.value;
      const newValue = value == null ? "" : value;
      if (oldValue !== newValue) {
        el.value = newValue;
      }
      if (value == null) {
        el.removeAttribute(key);
      }
      return;
    }
    let needRemove = false;
    if (value === "" || value == null) {
      const type = typeof el[key];
      if (type === "boolean") {
        value = includeBooleanAttr(value);
      } else if (value == null && type === "string") {
        value = "";
        needRemove = true;
      } else if (type === "number") {
        value = 0;
        needRemove = true;
      }
    }
    try {
      el[key] = value;
    } catch (e) {
    }
    needRemove && el.removeAttribute(key);
  }
  function addEventListener(el, event, handler2, options) {
    el.addEventListener(event, handler2, options);
  }
  function removeEventListener(el, event, handler2, options) {
    el.removeEventListener(event, handler2, options);
  }
  const veiKey = Symbol("_vei");
  function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
    const invokers = el[veiKey] || (el[veiKey] = {});
    const existingInvoker = invokers[rawName];
    if (nextValue && existingInvoker) {
      existingInvoker.value = nextValue;
    } else {
      const [name, options] = parseName(rawName);
      if (nextValue) {
        const invoker = invokers[rawName] = createInvoker(nextValue, instance);
        addEventListener(el, name, invoker, options);
      } else if (existingInvoker) {
        removeEventListener(el, name, existingInvoker, options);
        invokers[rawName] = void 0;
      }
    }
  }
  const optionsModifierRE = /(?:Once|Passive|Capture)$/;
  function parseName(name) {
    let options;
    if (optionsModifierRE.test(name)) {
      options = {};
      let m;
      while (m = name.match(optionsModifierRE)) {
        name = name.slice(0, name.length - m[0].length);
        options[m[0].toLowerCase()] = true;
      }
    }
    const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
    return [event, options];
  }
  let cachedNow = 0;
  const p = /* @__PURE__ */ Promise.resolve();
  const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
  function createInvoker(initialValue, instance) {
    const invoker = (e) => {
      if (!e._vts) {
        e._vts = Date.now();
      } else if (e._vts <= invoker.attached) {
        return;
      }
      callWithAsyncErrorHandling(
        patchStopImmediatePropagation(e, invoker.value),
        instance,
        5,
        [e]
      );
    };
    invoker.value = initialValue;
    invoker.attached = getNow();
    return invoker;
  }
  function patchStopImmediatePropagation(e, value) {
    if (isArray(value)) {
      const originalStop = e.stopImmediatePropagation;
      e.stopImmediatePropagation = () => {
        originalStop.call(e);
        e._stopped = true;
      };
      return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
    } else {
      return value;
    }
  }
  const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
  key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
  const patchProp = (el, key, prevValue, nextValue, namespace, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
    const isSVG = namespace === "svg";
    if (key === "class") {
      patchClass(el, nextValue, isSVG);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (isOn(key)) {
      if (!isModelListener(key)) {
        patchEvent(el, key, prevValue, nextValue, parentComponent);
      }
    } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
      patchDOMProp(
        el,
        key,
        nextValue,
        prevChildren,
        parentComponent,
        parentSuspense,
        unmountChildren
      );
    } else {
      if (key === "true-value") {
        el._trueValue = nextValue;
      } else if (key === "false-value") {
        el._falseValue = nextValue;
      }
      patchAttr(el, key, nextValue, isSVG);
    }
  };
  function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG) {
      if (key === "innerHTML" || key === "textContent") {
        return true;
      }
      if (key in el && isNativeOn(key) && isFunction(value)) {
        return true;
      }
      return false;
    }
    if (key === "spellcheck" || key === "draggable" || key === "translate") {
      return false;
    }
    if (key === "form") {
      return false;
    }
    if (key === "list" && el.tagName === "INPUT") {
      return false;
    }
    if (key === "type" && el.tagName === "TEXTAREA") {
      return false;
    }
    if (key === "width" || key === "height") {
      const tag = el.tagName;
      if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
        return false;
      }
    }
    if (isNativeOn(key) && isString(value)) {
      return false;
    }
    return key in el;
  }
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function defineCustomElement(options, hydrate2) {
    const Comp = /* @__PURE__ */ defineComponent(options);
    class VueCustomElement extends VueElement {
      constructor(initialProps) {
        super(Comp, initialProps, hydrate2);
      }
    }
    VueCustomElement.def = Comp;
    return VueCustomElement;
  }
  /*! #__NO_SIDE_EFFECTS__ */
  const defineSSRCustomElement = /* @__NO_SIDE_EFFECTS__ */ (options) => {
    return /* @__PURE__ */ defineCustomElement(options, hydrate);
  };
  const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {
  };
  class VueElement extends BaseClass {
    constructor(_def, _props = {}, hydrate2) {
      super();
      this._def = _def;
      this._props = _props;
      this._instance = null;
      this._connected = false;
      this._resolved = false;
      this._numberProps = null;
      this._ob = null;
      if (this.shadowRoot && hydrate2) {
        hydrate2(this._createVNode(), this.shadowRoot);
      } else {
        this.attachShadow({ mode: "open" });
        if (!this._def.__asyncLoader) {
          this._resolveProps(this._def);
        }
      }
    }
    connectedCallback() {
      this._connected = true;
      if (!this._instance) {
        if (this._resolved) {
          this._update();
        } else {
          this._resolveDef();
        }
      }
    }
    disconnectedCallback() {
      this._connected = false;
      if (this._ob) {
        this._ob.disconnect();
        this._ob = null;
      }
      nextTick(() => {
        if (!this._connected) {
          render$d(null, this.shadowRoot);
          this._instance = null;
        }
      });
    }
    /**
     * resolve inner component definition (handle possible async component)
     */
    _resolveDef() {
      this._resolved = true;
      for (let i = 0; i < this.attributes.length; i++) {
        this._setAttr(this.attributes[i].name);
      }
      this._ob = new MutationObserver((mutations) => {
        for (const m of mutations) {
          this._setAttr(m.attributeName);
        }
      });
      this._ob.observe(this, { attributes: true });
      const resolve2 = (def2, isAsync = false) => {
        const { props, styles } = def2;
        let numberProps;
        if (props && !isArray(props)) {
          for (const key in props) {
            const opt = props[key];
            if (opt === Number || opt && opt.type === Number) {
              if (key in this._props) {
                this._props[key] = toNumber$2(this._props[key]);
              }
              (numberProps || (numberProps = /* @__PURE__ */ Object.create(null)))[camelize(key)] = true;
            }
          }
        }
        this._numberProps = numberProps;
        if (isAsync) {
          this._resolveProps(def2);
        }
        this._applyStyles(styles);
        this._update();
      };
      const asyncDef = this._def.__asyncLoader;
      if (asyncDef) {
        asyncDef().then((def2) => resolve2(def2, true));
      } else {
        resolve2(this._def);
      }
    }
    _resolveProps(def2) {
      const { props } = def2;
      const declaredPropKeys = isArray(props) ? props : Object.keys(props || {});
      for (const key of Object.keys(this)) {
        if (key[0] !== "_" && declaredPropKeys.includes(key)) {
          this._setProp(key, this[key], true, false);
        }
      }
      for (const key of declaredPropKeys.map(camelize)) {
        Object.defineProperty(this, key, {
          get() {
            return this._getProp(key);
          },
          set(val) {
            this._setProp(key, val);
          }
        });
      }
    }
    _setAttr(key) {
      let value = this.getAttribute(key);
      const camelKey = camelize(key);
      if (this._numberProps && this._numberProps[camelKey]) {
        value = toNumber$2(value);
      }
      this._setProp(camelKey, value, false);
    }
    /**
     * @internal
     */
    _getProp(key) {
      return this._props[key];
    }
    /**
     * @internal
     */
    _setProp(key, val, shouldReflect = true, shouldUpdate = true) {
      if (val !== this._props[key]) {
        this._props[key] = val;
        if (shouldUpdate && this._instance) {
          this._update();
        }
        if (shouldReflect) {
          if (val === true) {
            this.setAttribute(hyphenate(key), "");
          } else if (typeof val === "string" || typeof val === "number") {
            this.setAttribute(hyphenate(key), val + "");
          } else if (!val) {
            this.removeAttribute(hyphenate(key));
          }
        }
      }
    }
    _update() {
      render$d(this._createVNode(), this.shadowRoot);
    }
    _createVNode() {
      const vnode = createVNode(this._def, extend({}, this._props));
      if (!this._instance) {
        vnode.ce = (instance) => {
          this._instance = instance;
          instance.isCE = true;
          const dispatch = (event, args) => {
            this.dispatchEvent(
              new CustomEvent(event, {
                detail: args
              })
            );
          };
          instance.emit = (event, ...args) => {
            dispatch(event, args);
            if (hyphenate(event) !== event) {
              dispatch(hyphenate(event), args);
            }
          };
          let parent = this;
          while (parent = parent && (parent.parentNode || parent.host)) {
            if (parent instanceof VueElement) {
              instance.parent = parent._instance;
              instance.provides = parent._instance.provides;
              break;
            }
          }
        };
      }
      return vnode;
    }
    _applyStyles(styles) {
      if (styles) {
        styles.forEach((css2) => {
          const s = document.createElement("style");
          s.textContent = css2;
          this.shadowRoot.appendChild(s);
        });
      }
    }
  }
  function useCssModule(name = "$style") {
    {
      const instance = getCurrentInstance();
      if (!instance) {
        return EMPTY_OBJ;
      }
      const modules = instance.type.__cssModules;
      if (!modules) {
        return EMPTY_OBJ;
      }
      const mod = modules[name];
      if (!mod) {
        return EMPTY_OBJ;
      }
      return mod;
    }
  }
  const positionMap = /* @__PURE__ */ new WeakMap();
  const newPositionMap = /* @__PURE__ */ new WeakMap();
  const moveCbKey = Symbol("_moveCb");
  const enterCbKey = Symbol("_enterCb");
  const TransitionGroupImpl = {
    name: "TransitionGroup",
    props: /* @__PURE__ */ extend({}, TransitionPropsValidators, {
      tag: String,
      moveClass: String
    }),
    setup(props, { slots }) {
      const instance = getCurrentInstance();
      const state = useTransitionState();
      let prevChildren;
      let children;
      onUpdated(() => {
        if (!prevChildren.length) {
          return;
        }
        const moveClass = props.moveClass || `${props.name || "v"}-move`;
        if (!hasCSSTransform(
          prevChildren[0].el,
          instance.vnode.el,
          moveClass
        )) {
          return;
        }
        prevChildren.forEach(callPendingCbs);
        prevChildren.forEach(recordPosition);
        const movedChildren = prevChildren.filter(applyTranslation);
        forceReflow();
        movedChildren.forEach((c2) => {
          const el = c2.el;
          const style = el.style;
          addTransitionClass(el, moveClass);
          style.transform = style.webkitTransform = style.transitionDuration = "";
          const cb = el[moveCbKey] = (e) => {
            if (e && e.target !== el) {
              return;
            }
            if (!e || /transform$/.test(e.propertyName)) {
              el.removeEventListener("transitionend", cb);
              el[moveCbKey] = null;
              removeTransitionClass(el, moveClass);
            }
          };
          el.addEventListener("transitionend", cb);
        });
      });
      return () => {
        const rawProps = toRaw(props);
        const cssTransitionProps = resolveTransitionProps(rawProps);
        let tag = rawProps.tag || Fragment;
        prevChildren = children;
        children = slots.default ? getTransitionRawChildren(slots.default()) : [];
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child.key != null) {
            setTransitionHooks(
              child,
              resolveTransitionHooks(child, cssTransitionProps, state, instance)
            );
          }
        }
        if (prevChildren) {
          for (let i = 0; i < prevChildren.length; i++) {
            const child = prevChildren[i];
            setTransitionHooks(
              child,
              resolveTransitionHooks(child, cssTransitionProps, state, instance)
            );
            positionMap.set(child, child.el.getBoundingClientRect());
          }
        }
        return createVNode(tag, null, children);
      };
    }
  };
  const removeMode = (props) => delete props.mode;
  /* @__PURE__ */ removeMode(TransitionGroupImpl.props);
  const TransitionGroup = TransitionGroupImpl;
  function callPendingCbs(c2) {
    const el = c2.el;
    if (el[moveCbKey]) {
      el[moveCbKey]();
    }
    if (el[enterCbKey]) {
      el[enterCbKey]();
    }
  }
  function recordPosition(c2) {
    newPositionMap.set(c2, c2.el.getBoundingClientRect());
  }
  function applyTranslation(c2) {
    const oldPos = positionMap.get(c2);
    const newPos = newPositionMap.get(c2);
    const dx = oldPos.left - newPos.left;
    const dy = oldPos.top - newPos.top;
    if (dx || dy) {
      const s = c2.el.style;
      s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
      s.transitionDuration = "0s";
      return c2;
    }
  }
  function hasCSSTransform(el, root, moveClass) {
    const clone2 = el.cloneNode();
    const _vtc = el[vtcKey];
    if (_vtc) {
      _vtc.forEach((cls) => {
        cls.split(/\s+/).forEach((c2) => c2 && clone2.classList.remove(c2));
      });
    }
    moveClass.split(/\s+/).forEach((c2) => c2 && clone2.classList.add(c2));
    clone2.style.display = "none";
    const container = root.nodeType === 1 ? root : root.parentNode;
    container.appendChild(clone2);
    const { hasTransform } = getTransitionInfo(clone2);
    container.removeChild(clone2);
    return hasTransform;
  }
  const getModelAssigner = (vnode) => {
    const fn = vnode.props["onUpdate:modelValue"] || false;
    return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
  };
  function onCompositionStart(e) {
    e.target.composing = true;
  }
  function onCompositionEnd(e) {
    const target = e.target;
    if (target.composing) {
      target.composing = false;
      target.dispatchEvent(new Event("input"));
    }
  }
  const assignKey = Symbol("_assign");
  const vModelText = {
    created(el, { modifiers: { lazy, trim, number: number2 } }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      const castToNumber = number2 || vnode.props && vnode.props.type === "number";
      addEventListener(el, lazy ? "change" : "input", (e) => {
        if (e.target.composing)
          return;
        let domValue = el.value;
        if (trim) {
          domValue = domValue.trim();
        }
        if (castToNumber) {
          domValue = looseToNumber(domValue);
        }
        el[assignKey](domValue);
      });
      if (trim) {
        addEventListener(el, "change", () => {
          el.value = el.value.trim();
        });
      }
      if (!lazy) {
        addEventListener(el, "compositionstart", onCompositionStart);
        addEventListener(el, "compositionend", onCompositionEnd);
        addEventListener(el, "change", onCompositionEnd);
      }
    },
    // set value on mounted so it's after min/max for type="range"
    mounted(el, { value }) {
      el.value = value == null ? "" : value;
    },
    beforeUpdate(el, { value, modifiers: { lazy, trim, number: number2 } }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      if (el.composing)
        return;
      const elValue = number2 || el.type === "number" ? looseToNumber(el.value) : el.value;
      const newValue = value == null ? "" : value;
      if (elValue === newValue) {
        return;
      }
      if (document.activeElement === el && el.type !== "range") {
        if (lazy) {
          return;
        }
        if (trim && el.value.trim() === newValue) {
          return;
        }
      }
      el.value = newValue;
    }
  };
  const vModelCheckbox = {
    // #4096 array checkboxes need to be deep traversed
    deep: true,
    created(el, _, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      addEventListener(el, "change", () => {
        const modelValue = el._modelValue;
        const elementValue = getValue(el);
        const checked = el.checked;
        const assign2 = el[assignKey];
        if (isArray(modelValue)) {
          const index = looseIndexOf(modelValue, elementValue);
          const found = index !== -1;
          if (checked && !found) {
            assign2(modelValue.concat(elementValue));
          } else if (!checked && found) {
            const filtered = [...modelValue];
            filtered.splice(index, 1);
            assign2(filtered);
          }
        } else if (isSet(modelValue)) {
          const cloned = new Set(modelValue);
          if (checked) {
            cloned.add(elementValue);
          } else {
            cloned.delete(elementValue);
          }
          assign2(cloned);
        } else {
          assign2(getCheckboxValue(el, checked));
        }
      });
    },
    // set initial checked on mount to wait for true-value/false-value
    mounted: setChecked,
    beforeUpdate(el, binding, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      setChecked(el, binding, vnode);
    }
  };
  function setChecked(el, { value, oldValue }, vnode) {
    el._modelValue = value;
    if (isArray(value)) {
      el.checked = looseIndexOf(value, vnode.props.value) > -1;
    } else if (isSet(value)) {
      el.checked = value.has(vnode.props.value);
    } else if (value !== oldValue) {
      el.checked = looseEqual(value, getCheckboxValue(el, true));
    }
  }
  const vModelRadio = {
    created(el, { value }, vnode) {
      el.checked = looseEqual(value, vnode.props.value);
      el[assignKey] = getModelAssigner(vnode);
      addEventListener(el, "change", () => {
        el[assignKey](getValue(el));
      });
    },
    beforeUpdate(el, { value, oldValue }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      if (value !== oldValue) {
        el.checked = looseEqual(value, vnode.props.value);
      }
    }
  };
  const vModelSelect = {
    // <select multiple> value need to be deep traversed
    deep: true,
    created(el, { value, modifiers: { number: number2 } }, vnode) {
      const isSetModel = isSet(value);
      addEventListener(el, "change", () => {
        const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map(
          (o) => number2 ? looseToNumber(getValue(o)) : getValue(o)
        );
        el[assignKey](
          el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]
        );
      });
      el[assignKey] = getModelAssigner(vnode);
    },
    // set value in mounted & updated because <select> relies on its children
    // <option>s.
    mounted(el, { value }) {
      setSelected(el, value);
    },
    beforeUpdate(el, _binding, vnode) {
      el[assignKey] = getModelAssigner(vnode);
    },
    updated(el, { value }) {
      setSelected(el, value);
    }
  };
  function setSelected(el, value) {
    const isMultiple = el.multiple;
    if (isMultiple && !isArray(value) && !isSet(value)) {
      return;
    }
    for (let i = 0, l2 = el.options.length; i < l2; i++) {
      const option = el.options[i];
      const optionValue = getValue(option);
      if (isMultiple) {
        if (isArray(value)) {
          option.selected = looseIndexOf(value, optionValue) > -1;
        } else {
          option.selected = value.has(optionValue);
        }
      } else {
        if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i)
            el.selectedIndex = i;
          return;
        }
      }
    }
    if (!isMultiple && el.selectedIndex !== -1) {
      el.selectedIndex = -1;
    }
  }
  function getValue(el) {
    return "_value" in el ? el._value : el.value;
  }
  function getCheckboxValue(el, checked) {
    const key = checked ? "_trueValue" : "_falseValue";
    return key in el ? el[key] : checked;
  }
  const vModelDynamic = {
    created(el, binding, vnode) {
      callModelHook(el, binding, vnode, null, "created");
    },
    mounted(el, binding, vnode) {
      callModelHook(el, binding, vnode, null, "mounted");
    },
    beforeUpdate(el, binding, vnode, prevVNode) {
      callModelHook(el, binding, vnode, prevVNode, "beforeUpdate");
    },
    updated(el, binding, vnode, prevVNode) {
      callModelHook(el, binding, vnode, prevVNode, "updated");
    }
  };
  function resolveDynamicModel(tagName, type) {
    switch (tagName) {
      case "SELECT":
        return vModelSelect;
      case "TEXTAREA":
        return vModelText;
      default:
        switch (type) {
          case "checkbox":
            return vModelCheckbox;
          case "radio":
            return vModelRadio;
          default:
            return vModelText;
        }
    }
  }
  function callModelHook(el, binding, vnode, prevVNode, hook) {
    const modelToUse = resolveDynamicModel(
      el.tagName,
      vnode.props && vnode.props.type
    );
    const fn = modelToUse[hook];
    fn && fn(el, binding, vnode, prevVNode);
  }
  function initVModelForSSR() {
    vModelText.getSSRProps = ({ value }) => ({ value });
    vModelRadio.getSSRProps = ({ value }, vnode) => {
      if (vnode.props && looseEqual(vnode.props.value, value)) {
        return { checked: true };
      }
    };
    vModelCheckbox.getSSRProps = ({ value }, vnode) => {
      if (isArray(value)) {
        if (vnode.props && looseIndexOf(value, vnode.props.value) > -1) {
          return { checked: true };
        }
      } else if (isSet(value)) {
        if (vnode.props && value.has(vnode.props.value)) {
          return { checked: true };
        }
      } else if (value) {
        return { checked: true };
      }
    };
    vModelDynamic.getSSRProps = (binding, vnode) => {
      if (typeof vnode.type !== "string") {
        return;
      }
      const modelToUse = resolveDynamicModel(
        // resolveDynamicModel expects an uppercase tag name, but vnode.type is lowercase
        vnode.type.toUpperCase(),
        vnode.props && vnode.props.type
      );
      if (modelToUse.getSSRProps) {
        return modelToUse.getSSRProps(binding, vnode);
      }
    };
  }
  const systemModifiers = ["ctrl", "shift", "alt", "meta"];
  const modifierGuards = {
    stop: (e) => e.stopPropagation(),
    prevent: (e) => e.preventDefault(),
    self: (e) => e.target !== e.currentTarget,
    ctrl: (e) => !e.ctrlKey,
    shift: (e) => !e.shiftKey,
    alt: (e) => !e.altKey,
    meta: (e) => !e.metaKey,
    left: (e) => "button" in e && e.button !== 0,
    middle: (e) => "button" in e && e.button !== 1,
    right: (e) => "button" in e && e.button !== 2,
    exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
  };
  const withModifiers = (fn, modifiers) => {
    const cache = fn._withMods || (fn._withMods = {});
    const cacheKey = modifiers.join(".");
    return cache[cacheKey] || (cache[cacheKey] = (event, ...args) => {
      for (let i = 0; i < modifiers.length; i++) {
        const guard = modifierGuards[modifiers[i]];
        if (guard && guard(event, modifiers))
          return;
      }
      return fn(event, ...args);
    });
  };
  const keyNames = {
    esc: "escape",
    space: " ",
    up: "arrow-up",
    left: "arrow-left",
    right: "arrow-right",
    down: "arrow-down",
    delete: "backspace"
  };
  const withKeys = (fn, modifiers) => {
    const cache = fn._withKeys || (fn._withKeys = {});
    const cacheKey = modifiers.join(".");
    return cache[cacheKey] || (cache[cacheKey] = (event) => {
      if (!("key" in event)) {
        return;
      }
      const eventKey = hyphenate(event.key);
      if (modifiers.some((k2) => k2 === eventKey || keyNames[k2] === eventKey)) {
        return fn(event);
      }
    });
  };
  const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
  let renderer;
  let enabledHydration = false;
  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions));
  }
  function ensureHydrationRenderer() {
    renderer = enabledHydration ? renderer : createHydrationRenderer(rendererOptions);
    enabledHydration = true;
    return renderer;
  }
  const render$d = (...args) => {
    ensureRenderer().render(...args);
  };
  const hydrate = (...args) => {
    ensureHydrationRenderer().hydrate(...args);
  };
  const createApp = (...args) => {
    const app2 = ensureRenderer().createApp(...args);
    const { mount } = app2;
    app2.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (!container)
        return;
      const component = app2._component;
      if (!isFunction(component) && !component.render && !component.template) {
        component.template = container.innerHTML;
      }
      container.innerHTML = "";
      const proxy = mount(container, false, resolveRootNamespace(container));
      if (container instanceof Element) {
        container.removeAttribute("v-cloak");
        container.setAttribute("data-v-app", "");
      }
      return proxy;
    };
    return app2;
  };
  const createSSRApp = (...args) => {
    const app2 = ensureHydrationRenderer().createApp(...args);
    const { mount } = app2;
    app2.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (container) {
        return mount(container, true, resolveRootNamespace(container));
      }
    };
    return app2;
  };
  function resolveRootNamespace(container) {
    if (container instanceof SVGElement) {
      return "svg";
    }
    if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
      return "mathml";
    }
  }
  function normalizeContainer(container) {
    if (isString(container)) {
      const res = document.querySelector(container);
      return res;
    }
    return container;
  }
  let ssrDirectiveInitialized = false;
  const initDirectivesForSSR = () => {
    if (!ssrDirectiveInitialized) {
      ssrDirectiveInitialized = true;
      initVModelForSSR();
      initVShowForSSR();
    }
  };
  /**
  * vue v3.4.14
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  const compile = () => {
  };
  const vue_runtime_esmBundler = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    BaseTransition,
    BaseTransitionPropsValidators,
    Comment,
    DeprecationTypes,
    EffectScope,
    ErrorCodes,
    ErrorTypeStrings,
    Fragment,
    KeepAlive,
    ReactiveEffect,
    Static,
    Suspense,
    Teleport,
    Text,
    TrackOpTypes,
    Transition,
    TransitionGroup,
    TriggerOpTypes,
    VueElement,
    assertNumber,
    callWithAsyncErrorHandling,
    callWithErrorHandling,
    camelize,
    capitalize,
    cloneVNode,
    compatUtils,
    compile,
    computed,
    createApp,
    createBlock,
    createCommentVNode,
    createElementBlock,
    createElementVNode: createBaseVNode,
    createHydrationRenderer,
    createPropsRestProxy,
    createRenderer,
    createSSRApp,
    createSlots,
    createStaticVNode,
    createTextVNode,
    createVNode,
    customRef,
    defineAsyncComponent,
    defineComponent,
    defineCustomElement,
    defineEmits,
    defineExpose,
    defineModel,
    defineOptions,
    defineProps,
    defineSSRCustomElement,
    defineSlots,
    devtools,
    effect,
    effectScope,
    getCurrentInstance,
    getCurrentScope,
    getTransitionRawChildren,
    guardReactiveProps,
    h,
    handleError,
    hasInjectionContext,
    hydrate,
    initCustomFormatter,
    initDirectivesForSSR,
    inject,
    isMemoSame,
    isProxy,
    isReactive,
    isReadonly,
    isRef,
    isRuntimeOnly,
    isShallow,
    isVNode,
    markRaw,
    mergeDefaults,
    mergeModels,
    mergeProps,
    nextTick,
    normalizeClass,
    normalizeProps,
    normalizeStyle,
    onActivated,
    onBeforeMount,
    onBeforeUnmount,
    onBeforeUpdate,
    onDeactivated,
    onErrorCaptured,
    onMounted,
    onRenderTracked,
    onRenderTriggered,
    onScopeDispose,
    onServerPrefetch,
    onUnmounted,
    onUpdated,
    openBlock,
    popScopeId,
    provide,
    proxyRefs,
    pushScopeId,
    queuePostFlushCb,
    reactive,
    readonly,
    ref,
    registerRuntimeCompiler,
    render: render$d,
    renderList,
    renderSlot,
    resolveComponent,
    resolveDirective,
    resolveDynamicComponent,
    resolveFilter,
    resolveTransitionHooks,
    setBlockTracking,
    setDevtoolsHook,
    setTransitionHooks,
    shallowReactive,
    shallowReadonly,
    shallowRef,
    ssrContextKey,
    ssrUtils,
    stop: stop$1,
    toDisplayString,
    toHandlerKey,
    toHandlers,
    toRaw,
    toRef,
    toRefs,
    toValue,
    transformVNodeArgs,
    triggerRef,
    unref,
    useAttrs,
    useCssModule,
    useCssVars,
    useModel,
    useSSRContext,
    useSlots,
    useTransitionState,
    vModelCheckbox,
    vModelDynamic,
    vModelRadio,
    vModelSelect,
    vModelText,
    vShow,
    version,
    warn,
    watch,
    watchEffect,
    watchPostEffect,
    watchSyncEffect,
    withAsyncContext,
    withCtx,
    withDefaults,
    withDirectives,
    withKeys,
    withMemo,
    withModifiers,
    withScopeId
  }, Symbol.toStringTag, { value: "Module" }));
  var isVue2 = false;
  /*!
   * pinia v2.1.7
   * (c) 2023 Eduardo San Martin Morote
   * @license MIT
   */
  let activePinia;
  const setActivePinia = (pinia2) => activePinia = pinia2;
  const piniaSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function isPlainObject$1(o) {
    return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  function createPinia() {
    const scope = effectScope(true);
    const state = scope.run(() => ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia2 = markRaw({
      install(app2) {
        setActivePinia(pinia2);
        {
          pinia2._a = app2;
          app2.provide(piniaSymbol, pinia2);
          app2.config.globalProperties.$pinia = pinia2;
          toBeInstalled.forEach((plugin) => _p.push(plugin));
          toBeInstalled = [];
        }
      },
      use(plugin) {
        if (!this._a && !isVue2) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      // it's actually undefined here
      // @ts-expect-error
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    return pinia2;
  }
  const noop = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
    subscriptions.push(callback);
    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback);
      if (idx > -1) {
        subscriptions.splice(idx, 1);
        onCleanup();
      }
    };
    if (!detached && getCurrentScope()) {
      onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.slice().forEach((callback) => {
      callback(...args);
    });
  }
  const fallbackRunWithContext = (fn) => fn();
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    }
    if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject$1(targetValue) && isPlainObject$1(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function shouldHydrate(obj) {
    return !isPlainObject$1(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o) {
    return !!(isRef(o) && o.effect);
  }
  function createOptionsStore(id, options, pinia2, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia2.state.value[id];
    let store;
    function setup() {
      if (!initialState && true) {
        {
          pinia2.state.value[id] = state ? state() : {};
        }
      }
      const localState = toRefs(pinia2.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = markRaw(computed(() => {
          setActivePinia(pinia2);
          const store2 = pinia2._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia2, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia2, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    const $subscribeOptions = {
      deep: true
      // flush: 'post',
    };
    let isListening;
    let isSyncListening;
    let subscriptions = [];
    let actionSubscriptions = [];
    let debuggerEvents;
    const initialState = pinia2.state.value[$id];
    if (!isOptionsStore && !initialState && true) {
      {
        pinia2.state.value[$id] = {};
      }
    }
    ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia2.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia2.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia2.state.value[$id]);
    }
    const $reset = isOptionsStore ? function $reset2() {
      const { state } = options;
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    } : (
      /* istanbul ignore next */
      noop
    );
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia2._s.delete($id);
    }
    function wrapAction(name, action) {
      return function() {
        setActivePinia(pinia2);
        const args = Array.from(arguments);
        const afterCallbackList = [];
        const onErrorCallbackList = [];
        function after(callback) {
          afterCallbackList.push(callback);
        }
        function onError(callback) {
          onErrorCallbackList.push(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name,
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = action.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackList, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackList, ret);
        return ret;
      };
    }
    const partialStore = {
      _p: pinia2,
      // _s: scope,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => watch(() => pinia2.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = reactive(partialStore);
    pinia2._s.set($id, store);
    const runWithContext = pinia2._a && pinia2._a.runWithContext || fallbackRunWithContext;
    const setupStore = runWithContext(() => pinia2._e.run(() => (scope = effectScope()).run(setup)));
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
        if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          {
            pinia2.state.value[$id][key] = prop;
          }
        }
      } else if (typeof prop === "function") {
        const actionValue = wrapAction(key, prop);
        {
          setupStore[key] = actionValue;
        }
        optionsForPlugin.actions[key] = prop;
      } else
        ;
    }
    {
      assign(store, setupStore);
      assign(toRaw(store), setupStore);
    }
    Object.defineProperty(store, "$state", {
      get: () => pinia2.state.value[$id],
      set: (state) => {
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    pinia2._p.forEach((extender) => {
      {
        assign(store, scope.run(() => extender({
          store,
          app: pinia2._a,
          pinia: pinia2,
          options: optionsForPlugin
        })));
      }
    });
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
  function defineStore(idOrOptions, setup, setupOptions) {
    let id;
    let options;
    const isSetupStore = typeof setup === "function";
    if (typeof idOrOptions === "string") {
      id = idOrOptions;
      options = isSetupStore ? setupOptions : setup;
    } else {
      options = idOrOptions;
      id = idOrOptions.id;
    }
    function useStore(pinia2, hot) {
      const hasContext = hasInjectionContext();
      pinia2 = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      pinia2 || (hasContext ? inject(piniaSymbol, null) : null);
      if (pinia2)
        setActivePinia(pinia2);
      pinia2 = activePinia;
      if (!pinia2._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia2);
        } else {
          createOptionsStore(id, options, pinia2);
        }
      }
      const store = pinia2._s.get(id);
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  function storeToRefs(store) {
    {
      store = toRaw(store);
      const refs = {};
      for (const key in store) {
        const value = store[key];
        if (isRef(value) || isReactive(value)) {
          refs[key] = // ---
          toRef(store, key);
        }
      }
      return refs;
    }
  }
  const D = {
    TOP_LEFT: "top-left",
    TOP_RIGHT: "top-right",
    TOP_CENTER: "top-center",
    BOTTOM_LEFT: "bottom-left",
    BOTTOM_RIGHT: "bottom-right",
    BOTTOM_CENTER: "bottom-center"
  }, M = {
    LIGHT: "light",
    DARK: "dark",
    COLORED: "colored",
    AUTO: "auto"
  }, g = {
    INFO: "info",
    SUCCESS: "success",
    WARNING: "warning",
    ERROR: "error",
    DEFAULT: "default"
  }, Ne = {
    BOUNCE: "bounce",
    SLIDE: "slide",
    FLIP: "flip",
    ZOOM: "zoom"
  }, ce = {
    dangerouslyHTMLString: false,
    multiple: true,
    position: D.TOP_RIGHT,
    autoClose: 5e3,
    transition: "bounce",
    hideProgressBar: false,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    closeOnClick: true,
    className: "",
    bodyClassName: "",
    style: {},
    progressClassName: "",
    progressStyle: {},
    role: "alert",
    theme: "light"
  }, Ie = {
    rtl: false,
    newestOnTop: false,
    toastClassName: ""
  }, fe = {
    ...ce,
    ...Ie
  };
  ({
    ...ce,
    type: g.DEFAULT
  });
  var r = /* @__PURE__ */ ((e) => (e[e.COLLAPSE_DURATION = 300] = "COLLAPSE_DURATION", e[e.DEBOUNCE_DURATION = 50] = "DEBOUNCE_DURATION", e.CSS_NAMESPACE = "Toastify", e))(r || {}), J = /* @__PURE__ */ ((e) => (e.ENTRANCE_ANIMATION_END = "d", e))(J || {});
  const _e = {
    enter: "Toastify--animate Toastify__bounce-enter",
    exit: "Toastify--animate Toastify__bounce-exit",
    appendPosition: true
  }, he = {
    enter: "Toastify--animate Toastify__slide-enter",
    exit: "Toastify--animate Toastify__slide-exit",
    appendPosition: true
  }, Oe = {
    enter: "Toastify--animate Toastify__zoom-enter",
    exit: "Toastify--animate Toastify__zoom-exit"
  }, be = {
    enter: "Toastify--animate Toastify__flip-enter",
    exit: "Toastify--animate Toastify__flip-exit"
  };
  function me(e) {
    let t = _e;
    if (!e || typeof e == "string")
      switch (e) {
        case "flip":
          t = be;
          break;
        case "zoom":
          t = Oe;
          break;
        case "slide":
          t = he;
          break;
      }
    else
      t = e;
    return t;
  }
  function Pe(e) {
    return e.containerId || String(e.position);
  }
  const K = "will-unmount";
  function Le(e = D.TOP_RIGHT) {
    return !!document.querySelector(".".concat(r.CSS_NAMESPACE, "__toast-container--").concat(e));
  }
  function $e(e = D.TOP_RIGHT) {
    return "".concat(r.CSS_NAMESPACE, "__toast-container--").concat(e);
  }
  function qe(e, t, n = false) {
    const a = [
      "".concat(r.CSS_NAMESPACE, "__toast-container"),
      "".concat(r.CSS_NAMESPACE, "__toast-container--").concat(e),
      n ? "".concat(r.CSS_NAMESPACE, "__toast-container--rtl") : null
    ].filter(Boolean).join(" ");
    return B(t) ? t({
      position: e,
      rtl: n,
      defaultClassName: a
    }) : "".concat(a, " ").concat(t || "");
  }
  function Be(e) {
    var C;
    const { position: t, containerClassName: n, rtl: a = false, style: o = {} } = e, s = r.CSS_NAMESPACE, u = $e(t), E = document.querySelector(".".concat(s)), d = document.querySelector(".".concat(u)), p2 = !!d && !((C = d.className) != null && C.includes(K)), m = E || document.createElement("div"), S = document.createElement("div");
    S.className = qe(
      t,
      n,
      a
    ), S.dataset.testid = "".concat(r.CSS_NAMESPACE, "__toast-container--").concat(t), S.id = Pe(e);
    for (const v in o)
      if (Object.prototype.hasOwnProperty.call(o, v)) {
        const I = o[v];
        S.style[v] = I;
      }
    return E || (m.className = r.CSS_NAMESPACE, document.body.appendChild(m)), p2 || m.appendChild(S), S;
  }
  function ee(e) {
    var a, o, s;
    const t = typeof e == "string" ? e : ((a = e.currentTarget) == null ? void 0 : a.id) || ((o = e.target) == null ? void 0 : o.id), n = document.getElementById(t);
    n && n.removeEventListener("animationend", ee, false);
    try {
      x[t].unmount(), (s = document.getElementById(t)) == null || s.remove(), delete x[t], delete c[t];
    } catch {
    }
  }
  const x = reactive({});
  function Me(e, t) {
    const n = document.getElementById(String(t));
    n && (x[n.id] = e);
  }
  function te(e, t = true) {
    const n = String(e);
    if (!x[n])
      return;
    const a = document.getElementById(n);
    a && a.classList.add(K), t ? (Re(e), a && a.addEventListener("animationend", ee, false)) : ee(n), N.items = N.items.filter((o) => o.containerId !== e);
  }
  function we(e) {
    for (const t in x)
      te(t, e);
    N.items = [];
  }
  function ge(e, t) {
    const n = document.getElementById(e.toastId);
    if (n) {
      let a = e;
      a = {
        ...a,
        ...me(a.transition)
      };
      const o = a.appendPosition ? "".concat(a.exit, "--").concat(a.position) : a.exit;
      n.className += " ".concat(o), t && t(n);
    }
  }
  function Re(e) {
    for (const t in c)
      if (t === e)
        for (const n of c[t] || [])
          ge(n);
  }
  function Fe(e) {
    const n = k().find((a) => a.toastId === e);
    return n == null ? void 0 : n.containerId;
  }
  function se(e) {
    return document.getElementById(e);
  }
  function Ue(e) {
    const t = se(e.containerId);
    return t && t.classList.contains(K);
  }
  function re(e) {
    var n;
    const t = isVNode(e.content) ? toRaw(e.content.props) : null;
    return t != null ? t : toRaw((n = e.data) != null ? n : {});
  }
  function xe(e) {
    return e ? N.items.filter((n) => n.containerId === e).length > 0 : N.items.length > 0;
  }
  function De() {
    if (N.items.length > 0) {
      const e = N.items.shift();
      j(e == null ? void 0 : e.toastContent, e == null ? void 0 : e.toastProps);
    }
  }
  const c = reactive({}), N = reactive({
    items: []
  });
  function k() {
    const e = toRaw(c);
    return Object.values(e).reduce((t, n) => [...t, ...n], []);
  }
  function ke(e) {
    return k().find((n) => n.toastId === e);
  }
  function j(e, t = {}) {
    if (Ue(t)) {
      const n = se(t.containerId);
      n && n.addEventListener("animationend", ne.bind(null, e, t), false);
    } else
      ne(e, t);
  }
  function ne(e, t = {}) {
    const n = se(t.containerId);
    n && n.removeEventListener("animationend", ne.bind(null, e, t), false);
    const a = c[t.containerId] || [], o = a.length > 0;
    if (!o && !Le(t.position)) {
      const s = Be(t), u = createApp(rt, t);
      u.mount(s), Me(u, s.id);
    }
    o && (t.position = a[0].position), nextTick(() => {
      t.updateId ? A.update(t) : A.add(e, t);
    });
  }
  const A = {
    /**
     * add a toast
     * @param _ ..
     * @param opts toast props
     */
    add(e, t) {
      const { containerId: n = "" } = t;
      n && (c[n] = c[n] || [], c[n].find((a) => a.toastId === t.toastId) || setTimeout(() => {
        var a, o;
        t.newestOnTop ? (a = c[n]) == null || a.unshift(t) : (o = c[n]) == null || o.push(t), t.onOpen && t.onOpen(re(t));
      }, t.delay || 0));
    },
    /**
     * remove a toast
     * @param id toastId
     */
    remove(e) {
      if (e) {
        const t = Fe(e);
        if (t) {
          const n = c[t];
          let a = n.find((o) => o.toastId === e);
          c[t] = n.filter((o) => o.toastId !== e), !c[t].length && !xe(t) && te(t, false), De(), nextTick(() => {
            a != null && a.onClose && (a.onClose(re(a)), a = void 0);
          });
        }
      }
    },
    /**
     * update the toast
     * @param opts toast props
     */
    update(e = {}) {
      const { containerId: t = "" } = e;
      if (t && e.updateId) {
        c[t] = c[t] || [];
        const n = c[t].find((a) => a.toastId === e.toastId);
        n && setTimeout(() => {
          for (const a in e)
            if (Object.prototype.hasOwnProperty.call(e, a)) {
              const o = e[a];
              n[a] = o;
            }
        }, e.delay || 0);
      }
    },
    /**
     * clear all toasts in container.
     * @param containerId container id
     */
    clear(e, t = true) {
      e ? te(e, t) : we(t);
    },
    dismissCallback(e) {
      var a;
      const t = (a = e.currentTarget) == null ? void 0 : a.id, n = document.getElementById(t);
      n && (n.removeEventListener("animationend", A.dismissCallback, false), setTimeout(() => {
        A.remove(t);
      }));
    },
    dismiss(e) {
      if (e) {
        const t = k();
        for (const n of t)
          if (n.toastId === e) {
            ge(n, (a) => {
              a.addEventListener("animationend", A.dismissCallback, false);
            });
            break;
          }
      }
    }
  }, Ce = reactive({}), Q = reactive({});
  function ye() {
    return Math.random().toString(36).substring(2, 9);
  }
  function He(e) {
    return typeof e == "number" && !isNaN(e);
  }
  function ae(e) {
    return typeof e == "string";
  }
  function B(e) {
    return typeof e == "function";
  }
  function Y(...e) {
    return mergeProps(...e);
  }
  function G(e) {
    return typeof e == "object" && (!!(e != null && e.render) || !!(e != null && e.setup) || typeof (e == null ? void 0 : e.type) == "object");
  }
  function ze(e = {}) {
    Ce["".concat(r.CSS_NAMESPACE, "-default-options")] = e;
  }
  function je() {
    return Ce["".concat(r.CSS_NAMESPACE, "-default-options")] || fe;
  }
  function Ge() {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  }
  var V = /* @__PURE__ */ ((e) => (e[e.Enter = 0] = "Enter", e[e.Exit = 1] = "Exit", e))(V || {});
  const Ee = {
    containerId: {
      type: [String, Number],
      required: false,
      default: ""
    },
    clearOnUrlChange: {
      type: Boolean,
      required: false,
      default: true
    },
    dangerouslyHTMLString: {
      type: Boolean,
      required: false,
      default: false
    },
    multiple: {
      type: Boolean,
      required: false,
      default: true
    },
    limit: {
      type: Number,
      required: false,
      default: void 0
    },
    position: {
      type: String,
      required: false,
      default: D.TOP_LEFT
    },
    bodyClassName: {
      type: String,
      required: false,
      default: ""
    },
    autoClose: {
      type: [Number, Boolean],
      required: false,
      default: false
    },
    closeButton: {
      type: [Boolean, Function, Object],
      required: false,
      default: void 0
    },
    transition: {
      type: [String, Object],
      required: false,
      default: "bounce"
    },
    hideProgressBar: {
      type: Boolean,
      required: false,
      default: false
    },
    pauseOnHover: {
      type: Boolean,
      required: false,
      default: true
    },
    pauseOnFocusLoss: {
      type: Boolean,
      required: false,
      default: true
    },
    closeOnClick: {
      type: Boolean,
      required: false,
      default: true
    },
    progress: {
      type: Number,
      required: false,
      default: void 0
    },
    progressClassName: {
      type: String,
      required: false,
      default: ""
    },
    toastStyle: {
      type: Object,
      required: false,
      default() {
        return {};
      }
    },
    progressStyle: {
      type: Object,
      required: false,
      default() {
        return {};
      }
    },
    role: {
      type: String,
      required: false,
      default: "alert"
    },
    theme: {
      type: String,
      required: false,
      default: M.AUTO
    },
    content: {
      type: [String, Object, Function],
      required: false,
      default: ""
    },
    toastId: {
      type: [String, Number],
      required: false,
      default: ""
    },
    data: {
      type: [Object, String],
      required: false,
      default() {
        return {};
      }
    },
    type: {
      type: String,
      required: false,
      default: g.DEFAULT
    },
    icon: {
      type: [Boolean, String, Number, Object, Function],
      required: false,
      default: void 0
    },
    delay: {
      type: Number,
      required: false,
      default: void 0
    },
    onOpen: {
      type: Function,
      required: false,
      default: void 0
    },
    onClose: {
      type: Function,
      required: false,
      default: void 0
    },
    onClick: {
      type: Function,
      required: false,
      default: void 0
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: void 0
    },
    rtl: {
      type: Boolean,
      required: false,
      default: false
    },
    toastClassName: {
      type: String,
      required: false,
      default: ""
    },
    updateId: {
      type: [String, Number],
      required: false,
      default: ""
    }
  }, Ve = {
    autoClose: {
      type: [Number, Boolean],
      required: true
    },
    isRunning: {
      type: Boolean,
      required: false,
      default: void 0
    },
    type: {
      type: String,
      required: false,
      default: g.DEFAULT
    },
    theme: {
      type: String,
      required: false,
      default: M.AUTO
    },
    hide: {
      type: Boolean,
      required: false,
      default: void 0
    },
    className: {
      type: [String, Function],
      required: false,
      default: ""
    },
    controlledProgress: {
      type: Boolean,
      required: false,
      default: void 0
    },
    rtl: {
      type: Boolean,
      required: false,
      default: void 0
    },
    isIn: {
      type: Boolean,
      required: false,
      default: void 0
    },
    progress: {
      type: Number,
      required: false,
      default: void 0
    },
    closeToast: {
      type: Function,
      required: false,
      default: void 0
    }
  }, Qe = /* @__PURE__ */ defineComponent({
    name: "ProgressBar",
    props: Ve,
    // @ts-ignore
    setup(e, {
      attrs: t
    }) {
      const n = ref(), a = computed(() => e.hide ? "true" : "false"), o = computed(() => ({
        ...t.style || {},
        animationDuration: "".concat(e.autoClose === true ? 5e3 : e.autoClose, "ms"),
        animationPlayState: e.isRunning ? "running" : "paused",
        opacity: e.hide || e.autoClose === false ? 0 : 1,
        transform: e.controlledProgress ? "scaleX(".concat(e.progress, ")") : "none"
      })), s = computed(() => ["".concat(r.CSS_NAMESPACE, "__progress-bar"), e.controlledProgress ? "".concat(r.CSS_NAMESPACE, "__progress-bar--controlled") : "".concat(r.CSS_NAMESPACE, "__progress-bar--animated"), "".concat(r.CSS_NAMESPACE, "__progress-bar-theme--").concat(e.theme), "".concat(r.CSS_NAMESPACE, "__progress-bar--").concat(e.type), e.rtl ? "".concat(r.CSS_NAMESPACE, "__progress-bar--rtl") : null].filter(Boolean).join(" ")), u = computed(() => "".concat(s.value, " ").concat((t == null ? void 0 : t.class) || "")), E = () => {
        n.value && (n.value.onanimationend = null, n.value.ontransitionend = null);
      }, d = () => {
        e.isIn && e.closeToast && e.autoClose !== false && (e.closeToast(), E());
      }, p2 = computed(() => e.controlledProgress ? null : d), m = computed(() => e.controlledProgress ? d : null);
      return watchEffect(() => {
        n.value && (E(), n.value.onanimationend = p2.value, n.value.ontransitionend = m.value);
      }), () => createVNode("div", {
        ref: n,
        role: "progressbar",
        "aria-hidden": a.value,
        "aria-label": "notification timer",
        class: u.value,
        style: o.value
      }, null);
    }
  }), We = /* @__PURE__ */ defineComponent({
    name: "CloseButton",
    inheritAttrs: false,
    props: {
      theme: {
        type: String,
        required: false,
        default: M.AUTO
      },
      type: {
        type: String,
        required: false,
        default: M.LIGHT
      },
      ariaLabel: {
        type: String,
        required: false,
        default: "close"
      },
      closeToast: {
        type: Function,
        required: false,
        default: void 0
      }
    },
    setup(e) {
      return () => createVNode("button", {
        class: "".concat(r.CSS_NAMESPACE, "__close-button ").concat(r.CSS_NAMESPACE, "__close-button--").concat(e.theme),
        type: "button",
        onClick: (t) => {
          t.stopPropagation(), e.closeToast && e.closeToast(t);
        },
        "aria-label": e.ariaLabel
      }, [createVNode("svg", {
        "aria-hidden": "true",
        viewBox: "0 0 14 16"
      }, [createVNode("path", {
        "fill-rule": "evenodd",
        d: "M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"
      }, null)])]);
    }
  }), Z = ({
    theme: e,
    type: t,
    path: n,
    ...a
  }) => createVNode("svg", mergeProps({
    viewBox: "0 0 24 24",
    width: "100%",
    height: "100%",
    fill: e === "colored" ? "currentColor" : "var(--toastify-icon-color-".concat(t, ")")
  }, a), [createVNode("path", {
    d: n
  }, null)]);
  function Ke(e) {
    return createVNode(Z, mergeProps(e, {
      path: "M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"
    }), null);
  }
  function Ye(e) {
    return createVNode(Z, mergeProps(e, {
      path: "M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"
    }), null);
  }
  function Ze(e) {
    return createVNode(Z, mergeProps(e, {
      path: "M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"
    }), null);
  }
  function Xe(e) {
    return createVNode(Z, mergeProps(e, {
      path: "M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"
    }), null);
  }
  function Je() {
    return createVNode("div", {
      class: "".concat(r.CSS_NAMESPACE, "__spinner")
    }, null);
  }
  const oe = {
    info: Ye,
    warning: Ke,
    success: Ze,
    error: Xe,
    spinner: Je
  }, et = (e) => e in oe;
  function tt({
    theme: e,
    type: t,
    isLoading: n,
    icon: a
  }) {
    let o;
    const s = {
      theme: e,
      type: t
    };
    return n ? o = oe.spinner() : a === false ? o = void 0 : G(a) ? o = toRaw(a) : B(a) ? o = a(s) : isVNode(a) ? o = cloneVNode(a, s) : ae(a) || He(a) ? o = a : et(t) && (o = oe[t](s)), o;
  }
  const nt = () => {
  };
  function at(e, t, n = r.COLLAPSE_DURATION) {
    const { scrollHeight: a, style: o } = e, s = n;
    requestAnimationFrame(() => {
      o.minHeight = "initial", o.height = a + "px", o.transition = "all ".concat(s, "ms"), requestAnimationFrame(() => {
        o.height = "0", o.padding = "0", o.margin = "0", setTimeout(t, s);
      });
    });
  }
  function ot(e) {
    const t = ref(false), n = ref(false), a = ref(false), o = ref(V.Enter), s = reactive({
      ...e,
      appendPosition: e.appendPosition || false,
      collapse: typeof e.collapse > "u" ? true : e.collapse,
      collapseDuration: e.collapseDuration || r.COLLAPSE_DURATION
    }), u = s.done || nt, E = computed(() => s.appendPosition ? "".concat(s.enter, "--").concat(s.position) : s.enter), d = computed(() => s.appendPosition ? "".concat(s.exit, "--").concat(s.position) : s.exit), p2 = computed(() => e.pauseOnHover ? {
      onMouseenter: h2,
      onMouseleave: _
    } : {});
    function m() {
      const y = E.value.split(" ");
      C().addEventListener(
        J.ENTRANCE_ANIMATION_END,
        _,
        { once: true }
      );
      const O = ($) => {
        const F = C();
        $.target === F && (F.dispatchEvent(new Event(J.ENTRANCE_ANIMATION_END)), F.removeEventListener("animationend", O), F.removeEventListener("animationcancel", O), o.value === V.Enter && $.type !== "animationcancel" && F.classList.remove(...y));
      }, b = () => {
        const $ = C();
        $.classList.add(...y), $.addEventListener("animationend", O), $.addEventListener("animationcancel", O);
      };
      e.pauseOnFocusLoss && v(), b();
    }
    function S() {
      if (!C())
        return;
      const y = () => {
        const b = C();
        b.removeEventListener("animationend", y), s.collapse ? at(b, u, s.collapseDuration) : u();
      }, O = () => {
        const b = C();
        o.value = V.Exit, b && (b.className += " ".concat(d.value), b.addEventListener("animationend", y));
      };
      n.value || (a.value ? y() : setTimeout(O));
    }
    function C() {
      return e.toastRef.value;
    }
    function v() {
      document.hasFocus() || h2(), window.addEventListener("focus", _), window.addEventListener("blur", h2);
    }
    function I() {
      window.removeEventListener("focus", _), window.removeEventListener("blur", h2);
    }
    function _() {
      (!e.loading.value || e.isLoading === void 0) && (t.value = true);
    }
    function h2() {
      t.value = false;
    }
    function R(y) {
      y && (y.stopPropagation(), y.preventDefault()), n.value = false;
    }
    return watchEffect(S), watchEffect(() => {
      const y = k();
      n.value = y.findIndex((O) => O.toastId === s.toastId) > -1;
    }), watchEffect(() => {
      e.isLoading !== void 0 && (e.loading.value ? h2() : _());
    }), onMounted(m), onUnmounted(() => {
      e.pauseOnFocusLoss && I();
    }), {
      isIn: n,
      isRunning: t,
      hideToast: R,
      eventHandlers: p2
    };
  }
  const st = /* @__PURE__ */ defineComponent({
    name: "ToastItem",
    inheritAttrs: false,
    props: Ee,
    // @ts-ignore
    setup(e) {
      const t = ref(), n = computed(() => !!e.isLoading), a = computed(() => e.progress !== void 0 && e.progress !== null), o = computed(() => tt(e)), s = computed(() => ["".concat(r.CSS_NAMESPACE, "__toast"), "".concat(r.CSS_NAMESPACE, "__toast-theme--").concat(e.theme), "".concat(r.CSS_NAMESPACE, "__toast--").concat(e.type), e.rtl ? "".concat(r.CSS_NAMESPACE, "__toast--rtl") : void 0, e.toastClassName || ""].filter(Boolean).join(" ")), {
        isRunning: u,
        isIn: E,
        hideToast: d,
        eventHandlers: p2
      } = ot({
        toastRef: t,
        loading: n,
        done: () => {
          A.remove(e.toastId);
        },
        ...me(e.transition),
        ...e
      });
      return () => createVNode("div", mergeProps({
        id: e.toastId,
        class: s.value,
        style: e.toastStyle || {},
        ref: t,
        "data-testid": "toast-item-".concat(e.toastId),
        onClick: (m) => {
          e.closeOnClick && d(), e.onClick && e.onClick(m);
        }
      }, p2.value), [createVNode("div", {
        role: e.role,
        "data-testid": "toast-body",
        class: "".concat(r.CSS_NAMESPACE, "__toast-body ").concat(e.bodyClassName || "")
      }, [o.value != null && createVNode("div", {
        "data-testid": "toast-icon-".concat(e.type),
        class: ["".concat(r.CSS_NAMESPACE, "__toast-icon"), e.isLoading ? "" : "".concat(r.CSS_NAMESPACE, "--animate-icon ").concat(r.CSS_NAMESPACE, "__zoom-enter")].join(" ")
      }, [G(o.value) ? h(toRaw(o.value), {
        theme: e.theme,
        type: e.type
      }) : B(o.value) ? o.value({
        theme: e.theme,
        type: e.type
      }) : o.value]), createVNode("div", {
        "data-testid": "toast-content"
      }, [G(e.content) ? h(toRaw(e.content), {
        toastProps: toRaw(e),
        closeToast: d,
        data: e.data
      }) : B(e.content) ? e.content({
        toastProps: toRaw(e),
        closeToast: d,
        data: e.data
      }) : e.dangerouslyHTMLString ? h("div", {
        innerHTML: e.content
      }) : e.content])]), (e.closeButton === void 0 || e.closeButton === true) && createVNode(We, {
        theme: e.theme,
        closeToast: (m) => {
          m.stopPropagation(), m.preventDefault(), d();
        }
      }, null), G(e.closeButton) ? h(toRaw(e.closeButton), {
        closeToast: d,
        type: e.type,
        theme: e.theme
      }) : B(e.closeButton) ? e.closeButton({
        closeToast: d,
        type: e.type,
        theme: e.theme
      }) : null, createVNode(Qe, {
        className: e.progressClassName,
        style: e.progressStyle,
        rtl: e.rtl,
        theme: e.theme,
        isIn: E.value,
        type: e.type,
        hide: e.hideProgressBar,
        isRunning: u.value,
        autoClose: e.autoClose,
        controlledProgress: a.value,
        progress: e.progress,
        closeToast: e.isLoading ? void 0 : d
      }, null)]);
    }
  });
  let U = 0;
  function Se() {
    typeof window > "u" || (U && window.cancelAnimationFrame(U), U = window.requestAnimationFrame(Se), Q.lastUrl !== window.location.href && (Q.lastUrl = window.location.href, A.clear()));
  }
  const rt = /* @__PURE__ */ defineComponent({
    name: "ToastifyContainer",
    inheritAttrs: false,
    props: Ee,
    // @ts-ignore
    setup(e) {
      const t = computed(() => e.containerId), n = computed(() => c[t.value] || []), a = computed(() => n.value.filter((o) => o.position === e.position));
      return onMounted(() => {
        typeof window < "u" && e.clearOnUrlChange && window.requestAnimationFrame(Se);
      }), onUnmounted(() => {
        typeof window < "u" && U && (window.cancelAnimationFrame(U), Q.lastUrl = "");
      }), () => createVNode(Fragment, null, [a.value.map((o) => {
        const {
          toastId: s = ""
        } = o;
        return createVNode(st, mergeProps({
          key: s
        }, o), null);
      })]);
    }
  });
  let X = false;
  function ve() {
    const e = [];
    return k().forEach((n) => {
      const a = document.getElementById(n.containerId);
      a && !a.classList.contains(K) && e.push(n);
    }), e;
  }
  function lt(e) {
    const t = ve().length, n = e != null ? e : 0;
    return n > 0 && t + N.items.length >= n;
  }
  function it(e) {
    lt(e.limit) && !e.updateId && N.items.push({
      toastId: e.toastId,
      containerId: e.containerId,
      toastContent: e.content,
      toastProps: e
    });
  }
  function L(e, t, n = {}) {
    if (X)
      return;
    n = Y(je(), {
      type: t
    }, toRaw(n)), (!n.toastId || typeof n.toastId != "string" && typeof n.toastId != "number") && (n.toastId = ye()), n = {
      ...n,
      content: e,
      containerId: n.containerId || String(n.position)
    };
    const a = Number(n == null ? void 0 : n.progress);
    return a < 0 && (n.progress = 0), a > 1 && (n.progress = 1), n.theme === "auto" && (n.theme = Ge()), it(n), Q.lastUrl = window.location.href, n.multiple ? N.items.length ? n.updateId && j(e, n) : j(e, n) : (X = true, l.clearAll(void 0, false), setTimeout(() => {
      j(e, n);
    }, 0), setTimeout(() => {
      X = false;
    }, 390)), n.toastId;
  }
  const l = (e, t) => L(e, g.DEFAULT, t);
  l.info = (e, t) => L(e, g.DEFAULT, {
    ...t,
    type: g.INFO
  });
  l.error = (e, t) => L(e, g.DEFAULT, {
    ...t,
    type: g.ERROR
  });
  l.warning = (e, t) => L(e, g.DEFAULT, {
    ...t,
    type: g.WARNING
  });
  l.warn = l.warning;
  l.success = (e, t) => L(e, g.DEFAULT, {
    ...t,
    type: g.SUCCESS
  });
  l.loading = (e, t) => L(e, g.DEFAULT, Y(t, {
    isLoading: true,
    autoClose: false,
    closeOnClick: false,
    closeButton: false,
    draggable: false
  }));
  l.dark = (e, t) => L(e, g.DEFAULT, Y(t, {
    theme: M.DARK
  }));
  l.remove = (e) => {
    e ? A.dismiss(e) : A.clear();
  };
  l.clearAll = (e, t) => {
    A.clear(e, t);
  };
  l.isActive = (e) => {
    let t = false;
    return t = ve().findIndex((a) => a.toastId === e) > -1, t;
  };
  l.update = (e, t = {}) => {
    setTimeout(() => {
      const n = ke(e);
      if (n) {
        const a = toRaw(n), {
          content: o
        } = a, s = {
          ...a,
          ...t,
          toastId: t.toastId || e,
          updateId: ye()
        }, u = s.render || o;
        delete s.render, L(u, s.type, s);
      }
    }, 0);
  };
  l.done = (e) => {
    l.update(e, {
      isLoading: false,
      progress: 1
    });
  };
  l.promise = ut;
  function ut(e, {
    pending: t,
    error: n,
    success: a
  }, o) {
    var m, S, C;
    let s;
    const u = {
      ...o || {},
      autoClose: false
    };
    t && (s = ae(t) ? l.loading(t, u) : l.loading(t.render, {
      ...u,
      ...t
    }));
    const E = {
      autoClose: (m = o == null ? void 0 : o.autoClose) != null ? m : true,
      closeOnClick: (S = o == null ? void 0 : o.closeOnClick) != null ? S : true,
      closeButton: (C = o == null ? void 0 : o.autoClose) != null ? C : null,
      isLoading: void 0,
      draggable: null,
      delay: 100
    }, d = (v, I, _) => {
      if (I == null) {
        l.remove(s);
        return;
      }
      const h2 = {
        type: v,
        ...E,
        ...o,
        data: _
      }, R = ae(I) ? {
        render: I
      } : I;
      return s ? l.update(s, {
        ...h2,
        ...R,
        isLoading: false
      }) : l(R.render, {
        ...h2,
        ...R,
        isLoading: false
      }), _;
    }, p2 = B(e) ? e() : e;
    return p2.then((v) => {
      d("success", a, v);
    }).catch((v) => {
      d("error", n, v);
    }), p2;
  }
  l.POSITION = D;
  l.THEME = M;
  l.TYPE = g;
  l.TRANSITIONS = Ne;
  const dt = {
    install(e, t = {}) {
      ct(t);
    }
  };
  typeof window < "u" && (window.Vue3Toastify = dt);
  function ct(e = {}) {
    const t = Y(fe, e);
    ze(t);
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
  }
  function getAugmentedNamespace(n) {
    if (n.__esModule)
      return n;
    var f = n.default;
    if (typeof f == "function") {
      var a = function a2() {
        if (this instanceof a2) {
          return Reflect.construct(f, arguments, this.constructor);
        }
        return f.apply(this, arguments);
      };
      a.prototype = f.prototype;
    } else
      a = {};
    Object.defineProperty(a, "__esModule", { value: true });
    Object.keys(n).forEach(function(k2) {
      var d = Object.getOwnPropertyDescriptor(n, k2);
      Object.defineProperty(a, k2, d.get ? d : {
        enumerable: true,
        get: function() {
          return n[k2];
        }
      });
    });
    return a;
  }
  function Cache(maxSize) {
    this._maxSize = maxSize;
    this.clear();
  }
  Cache.prototype.clear = function() {
    this._size = 0;
    this._values = /* @__PURE__ */ Object.create(null);
  };
  Cache.prototype.get = function(key) {
    return this._values[key];
  };
  Cache.prototype.set = function(key, value) {
    this._size >= this._maxSize && this.clear();
    if (!(key in this._values))
      this._size++;
    return this._values[key] = value;
  };
  var SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g, DIGIT_REGEX = /^\d+$/, LEAD_DIGIT_REGEX = /^\d/, SPEC_CHAR_REGEX = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g, CLEAN_QUOTES_REGEX = /^\s*(['"]?)(.*?)(\1)\s*$/, MAX_CACHE_SIZE = 512;
  var pathCache = new Cache(MAX_CACHE_SIZE), setCache = new Cache(MAX_CACHE_SIZE), getCache = new Cache(MAX_CACHE_SIZE);
  var propertyExpr = {
    Cache,
    split,
    normalizePath,
    setter: function(path) {
      var parts = normalizePath(path);
      return setCache.get(path) || setCache.set(path, function setter(obj, value) {
        var index = 0;
        var len = parts.length;
        var data = obj;
        while (index < len - 1) {
          var part = parts[index];
          if (part === "__proto__" || part === "constructor" || part === "prototype") {
            return obj;
          }
          data = data[parts[index++]];
        }
        data[parts[index]] = value;
      });
    },
    getter: function(path, safe) {
      var parts = normalizePath(path);
      return getCache.get(path) || getCache.set(path, function getter(data) {
        var index = 0, len = parts.length;
        while (index < len) {
          if (data != null || !safe)
            data = data[parts[index++]];
          else
            return;
        }
        return data;
      });
    },
    join: function(segments) {
      return segments.reduce(function(path, part) {
        return path + (isQuoted(part) || DIGIT_REGEX.test(part) ? "[" + part + "]" : (path ? "." : "") + part);
      }, "");
    },
    forEach: function(path, cb, thisArg) {
      forEach(Array.isArray(path) ? path : split(path), cb, thisArg);
    }
  };
  function normalizePath(path) {
    return pathCache.get(path) || pathCache.set(
      path,
      split(path).map(function(part) {
        return part.replace(CLEAN_QUOTES_REGEX, "$2");
      })
    );
  }
  function split(path) {
    return path.match(SPLIT_REGEX) || [""];
  }
  function forEach(parts, iter, thisArg) {
    var len = parts.length, part, idx, isArray2, isBracket;
    for (idx = 0; idx < len; idx++) {
      part = parts[idx];
      if (part) {
        if (shouldBeQuoted(part)) {
          part = '"' + part + '"';
        }
        isBracket = isQuoted(part);
        isArray2 = !isBracket && /^\d+$/.test(part);
        iter.call(thisArg, part, isBracket, isArray2, idx, parts);
      }
    }
  }
  function isQuoted(str) {
    return typeof str === "string" && str && ["'", '"'].indexOf(str.charAt(0)) !== -1;
  }
  function hasLeadingNumber(part) {
    return part.match(LEAD_DIGIT_REGEX) && !part.match(DIGIT_REGEX);
  }
  function hasSpecialChars(part) {
    return SPEC_CHAR_REGEX.test(part);
  }
  function shouldBeQuoted(part) {
    return !isQuoted(part) && (hasLeadingNumber(part) || hasSpecialChars(part));
  }
  const reWords = /[A-Z\xc0-\xd6\xd8-\xde]?[a-z\xdf-\xf6\xf8-\xff]+(?:['’](?:d|ll|m|re|s|t|ve))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde]|$)|(?:[A-Z\xc0-\xd6\xd8-\xde]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde](?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])|$)|[A-Z\xc0-\xd6\xd8-\xde]?(?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:d|ll|m|re|s|t|ve))?|[A-Z\xc0-\xd6\xd8-\xde]+(?:['’](?:D|LL|M|RE|S|T|VE))?|\d*(?:1ST|2ND|3RD|(?![123])\dTH)(?=\b|[a-z_])|\d*(?:1st|2nd|3rd|(?![123])\dth)(?=\b|[A-Z_])|\d+|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?)*/g;
  const words = (str) => str.match(reWords) || [];
  const upperFirst = (str) => str[0].toUpperCase() + str.slice(1);
  const join = (str, d) => words(str).join(d).toLowerCase();
  const camelCase = (str) => words(str).reduce(
    (acc, next) => `${acc}${!acc ? next.toLowerCase() : next[0].toUpperCase() + next.slice(1).toLowerCase()}`,
    ""
  );
  const pascalCase = (str) => upperFirst(camelCase(str));
  const snakeCase = (str) => join(str, "_");
  const kebabCase = (str) => join(str, "-");
  const sentenceCase = (str) => upperFirst(join(str, " "));
  const titleCase = (str) => words(str).map(upperFirst).join(" ");
  var tinyCase = {
    words,
    upperFirst,
    camelCase,
    pascalCase,
    snakeCase,
    kebabCase,
    sentenceCase,
    titleCase
  };
  var toposort$2 = { exports: {} };
  toposort$2.exports = function(edges) {
    return toposort(uniqueNodes(edges), edges);
  };
  toposort$2.exports.array = toposort;
  function toposort(nodes, edges) {
    var cursor = nodes.length, sorted = new Array(cursor), visited = {}, i = cursor, outgoingEdges = makeOutgoingEdges(edges), nodesHash = makeNodesHash(nodes);
    edges.forEach(function(edge) {
      if (!nodesHash.has(edge[0]) || !nodesHash.has(edge[1])) {
        throw new Error("Unknown node. There is an unknown node in the supplied edges.");
      }
    });
    while (i--) {
      if (!visited[i])
        visit(nodes[i], i, /* @__PURE__ */ new Set());
    }
    return sorted;
    function visit(node, i2, predecessors) {
      if (predecessors.has(node)) {
        var nodeRep;
        try {
          nodeRep = ", node was:" + JSON.stringify(node);
        } catch (e) {
          nodeRep = "";
        }
        throw new Error("Cyclic dependency" + nodeRep);
      }
      if (!nodesHash.has(node)) {
        throw new Error("Found unknown node. Make sure to provided all involved nodes. Unknown node: " + JSON.stringify(node));
      }
      if (visited[i2])
        return;
      visited[i2] = true;
      var outgoing = outgoingEdges.get(node) || /* @__PURE__ */ new Set();
      outgoing = Array.from(outgoing);
      if (i2 = outgoing.length) {
        predecessors.add(node);
        do {
          var child = outgoing[--i2];
          visit(child, nodesHash.get(child), predecessors);
        } while (i2);
        predecessors.delete(node);
      }
      sorted[--cursor] = node;
    }
  }
  function uniqueNodes(arr) {
    var res = /* @__PURE__ */ new Set();
    for (var i = 0, len = arr.length; i < len; i++) {
      var edge = arr[i];
      res.add(edge[0]);
      res.add(edge[1]);
    }
    return Array.from(res);
  }
  function makeOutgoingEdges(arr) {
    var edges = /* @__PURE__ */ new Map();
    for (var i = 0, len = arr.length; i < len; i++) {
      var edge = arr[i];
      if (!edges.has(edge[0]))
        edges.set(edge[0], /* @__PURE__ */ new Set());
      if (!edges.has(edge[1]))
        edges.set(edge[1], /* @__PURE__ */ new Set());
      edges.get(edge[0]).add(edge[1]);
    }
    return edges;
  }
  function makeNodesHash(arr) {
    var res = /* @__PURE__ */ new Map();
    for (var i = 0, len = arr.length; i < len; i++) {
      res.set(arr[i], i);
    }
    return res;
  }
  var toposortExports = toposort$2.exports;
  const toposort$1 = /* @__PURE__ */ getDefaultExportFromCjs(toposortExports);
  const toString = Object.prototype.toString;
  const errorToString = Error.prototype.toString;
  const regExpToString = RegExp.prototype.toString;
  const symbolToString = typeof Symbol !== "undefined" ? Symbol.prototype.toString : () => "";
  const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
  function printNumber(val) {
    if (val != +val)
      return "NaN";
    const isNegativeZero = val === 0 && 1 / val < 0;
    return isNegativeZero ? "-0" : "" + val;
  }
  function printSimpleValue(val, quoteStrings = false) {
    if (val == null || val === true || val === false)
      return "" + val;
    const typeOf = typeof val;
    if (typeOf === "number")
      return printNumber(val);
    if (typeOf === "string")
      return quoteStrings ? `"${val}"` : val;
    if (typeOf === "function")
      return "[Function " + (val.name || "anonymous") + "]";
    if (typeOf === "symbol")
      return symbolToString.call(val).replace(SYMBOL_REGEXP, "Symbol($1)");
    const tag = toString.call(val).slice(8, -1);
    if (tag === "Date")
      return isNaN(val.getTime()) ? "" + val : val.toISOString(val);
    if (tag === "Error" || val instanceof Error)
      return "[" + errorToString.call(val) + "]";
    if (tag === "RegExp")
      return regExpToString.call(val);
    return null;
  }
  function printValue(value, quoteStrings) {
    let result = printSimpleValue(value, quoteStrings);
    if (result !== null)
      return result;
    return JSON.stringify(value, function(key, value2) {
      let result2 = printSimpleValue(this[key], quoteStrings);
      if (result2 !== null)
        return result2;
      return value2;
    }, 2);
  }
  function toArray(value) {
    return value == null ? [] : [].concat(value);
  }
  let _Symbol$toStringTag;
  let strReg = /\$\{\s*(\w+)\s*\}/g;
  _Symbol$toStringTag = Symbol.toStringTag;
  class ValidationError extends Error {
    static formatError(message, params) {
      const path = params.label || params.path || "this";
      if (path !== params.path)
        params = Object.assign({}, params, {
          path
        });
      if (typeof message === "string")
        return message.replace(strReg, (_, key) => printValue(params[key]));
      if (typeof message === "function")
        return message(params);
      return message;
    }
    static isError(err) {
      return err && err.name === "ValidationError";
    }
    constructor(errorOrErrors, value, field, type, disableStack) {
      super();
      this.value = void 0;
      this.path = void 0;
      this.type = void 0;
      this.errors = void 0;
      this.params = void 0;
      this.inner = void 0;
      this[_Symbol$toStringTag] = "Error";
      this.name = "ValidationError";
      this.value = value;
      this.path = field;
      this.type = type;
      this.errors = [];
      this.inner = [];
      toArray(errorOrErrors).forEach((err) => {
        if (ValidationError.isError(err)) {
          this.errors.push(...err.errors);
          const innerErrors = err.inner.length ? err.inner : [err];
          this.inner.push(...innerErrors);
        } else {
          this.errors.push(err);
        }
      });
      this.message = this.errors.length > 1 ? `${this.errors.length} errors occurred` : this.errors[0];
      if (!disableStack && Error.captureStackTrace)
        Error.captureStackTrace(this, ValidationError);
    }
  }
  let mixed = {
    default: "${path} is invalid",
    required: "${path} is a required field",
    defined: "${path} must be defined",
    notNull: "${path} cannot be null",
    oneOf: "${path} must be one of the following values: ${values}",
    notOneOf: "${path} must not be one of the following values: ${values}",
    notType: ({
      path,
      type,
      value,
      originalValue
    }) => {
      const castMsg = originalValue != null && originalValue !== value ? ` (cast from the value \`${printValue(originalValue, true)}\`).` : ".";
      return type !== "mixed" ? `${path} must be a \`${type}\` type, but the final value was: \`${printValue(value, true)}\`` + castMsg : `${path} must match the configured type. The validated value was: \`${printValue(value, true)}\`` + castMsg;
    }
  };
  let string = {
    length: "${path} must be exactly ${length} characters",
    min: "${path} must be at least ${min} characters",
    max: "${path} must be at most ${max} characters",
    matches: '${path} must match the following: "${regex}"',
    email: "${path} must be a valid email",
    url: "${path} must be a valid URL",
    uuid: "${path} must be a valid UUID",
    trim: "${path} must be a trimmed string",
    lowercase: "${path} must be a lowercase string",
    uppercase: "${path} must be a upper case string"
  };
  let number = {
    min: "${path} must be greater than or equal to ${min}",
    max: "${path} must be less than or equal to ${max}",
    lessThan: "${path} must be less than ${less}",
    moreThan: "${path} must be greater than ${more}",
    positive: "${path} must be a positive number",
    negative: "${path} must be a negative number",
    integer: "${path} must be an integer"
  };
  let date = {
    min: "${path} field must be later than ${min}",
    max: "${path} field must be at earlier than ${max}"
  };
  let boolean = {
    isValue: "${path} field must be ${value}"
  };
  let object = {
    noUnknown: "${path} field has unspecified keys: ${unknown}"
  };
  let array = {
    min: "${path} field must have at least ${min} items",
    max: "${path} field must have less than or equal to ${max} items",
    length: "${path} must have ${length} items"
  };
  let tuple = {
    notType: (params) => {
      const {
        path,
        value,
        spec
      } = params;
      const typeLen = spec.types.length;
      if (Array.isArray(value)) {
        if (value.length < typeLen)
          return `${path} tuple value has too few items, expected a length of ${typeLen} but got ${value.length} for value: \`${printValue(value, true)}\``;
        if (value.length > typeLen)
          return `${path} tuple value has too many items, expected a length of ${typeLen} but got ${value.length} for value: \`${printValue(value, true)}\``;
      }
      return ValidationError.formatError(mixed.notType, params);
    }
  };
  var locale = Object.assign(/* @__PURE__ */ Object.create(null), {
    mixed,
    string,
    number,
    date,
    object,
    array,
    boolean,
    tuple
  });
  const isSchema = (obj) => obj && obj.__isYupSchema__;
  class Condition {
    static fromOptions(refs, config) {
      if (!config.then && !config.otherwise)
        throw new TypeError("either `then:` or `otherwise:` is required for `when()` conditions");
      let {
        is,
        then,
        otherwise
      } = config;
      let check = typeof is === "function" ? is : (...values) => values.every((value) => value === is);
      return new Condition(refs, (values, schema) => {
        var _branch;
        let branch = check(...values) ? then : otherwise;
        return (_branch = branch == null ? void 0 : branch(schema)) != null ? _branch : schema;
      });
    }
    constructor(refs, builder) {
      this.fn = void 0;
      this.refs = refs;
      this.refs = refs;
      this.fn = builder;
    }
    resolve(base, options) {
      let values = this.refs.map((ref2) => (
        // TODO: ? operator here?
        ref2.getValue(options == null ? void 0 : options.value, options == null ? void 0 : options.parent, options == null ? void 0 : options.context)
      ));
      let schema = this.fn(values, base, options);
      if (schema === void 0 || // @ts-ignore this can be base
      schema === base) {
        return base;
      }
      if (!isSchema(schema))
        throw new TypeError("conditions must return a schema object");
      return schema.resolve(options);
    }
  }
  const prefixes = {
    context: "$",
    value: "."
  };
  class Reference {
    constructor(key, options = {}) {
      this.key = void 0;
      this.isContext = void 0;
      this.isValue = void 0;
      this.isSibling = void 0;
      this.path = void 0;
      this.getter = void 0;
      this.map = void 0;
      if (typeof key !== "string")
        throw new TypeError("ref must be a string, got: " + key);
      this.key = key.trim();
      if (key === "")
        throw new TypeError("ref must be a non-empty string");
      this.isContext = this.key[0] === prefixes.context;
      this.isValue = this.key[0] === prefixes.value;
      this.isSibling = !this.isContext && !this.isValue;
      let prefix = this.isContext ? prefixes.context : this.isValue ? prefixes.value : "";
      this.path = this.key.slice(prefix.length);
      this.getter = this.path && propertyExpr.getter(this.path, true);
      this.map = options.map;
    }
    getValue(value, parent, context) {
      let result = this.isContext ? context : this.isValue ? value : parent;
      if (this.getter)
        result = this.getter(result || {});
      if (this.map)
        result = this.map(result);
      return result;
    }
    /**
     *
     * @param {*} value
     * @param {Object} options
     * @param {Object=} options.context
     * @param {Object=} options.parent
     */
    cast(value, options) {
      return this.getValue(value, options == null ? void 0 : options.parent, options == null ? void 0 : options.context);
    }
    resolve() {
      return this;
    }
    describe() {
      return {
        type: "ref",
        key: this.key
      };
    }
    toString() {
      return `Ref(${this.key})`;
    }
    static isRef(value) {
      return value && value.__isYupRef;
    }
  }
  Reference.prototype.__isYupRef = true;
  const isAbsent = (value) => value == null;
  function createValidation(config) {
    function validate2({
      value,
      path = "",
      options,
      originalValue,
      schema
    }, panic, next) {
      const {
        name,
        test,
        params,
        message,
        skipAbsent
      } = config;
      let {
        parent,
        context,
        abortEarly = schema.spec.abortEarly,
        disableStackTrace = schema.spec.disableStackTrace
      } = options;
      function resolve2(item) {
        return Reference.isRef(item) ? item.getValue(value, parent, context) : item;
      }
      function createError(overrides = {}) {
        var _overrides$disableSta;
        const nextParams = Object.assign({
          value,
          originalValue,
          label: schema.spec.label,
          path: overrides.path || path,
          spec: schema.spec
        }, params, overrides.params);
        for (const key of Object.keys(nextParams))
          nextParams[key] = resolve2(nextParams[key]);
        const error = new ValidationError(ValidationError.formatError(overrides.message || message, nextParams), value, nextParams.path, overrides.type || name, (_overrides$disableSta = overrides.disableStackTrace) != null ? _overrides$disableSta : disableStackTrace);
        error.params = nextParams;
        return error;
      }
      const invalid = abortEarly ? panic : next;
      let ctx = {
        path,
        parent,
        type: name,
        from: options.from,
        createError,
        resolve: resolve2,
        options,
        originalValue,
        schema
      };
      const handleResult = (validOrError) => {
        if (ValidationError.isError(validOrError))
          invalid(validOrError);
        else if (!validOrError)
          invalid(createError());
        else
          next(null);
      };
      const handleError2 = (err) => {
        if (ValidationError.isError(err))
          invalid(err);
        else
          panic(err);
      };
      const shouldSkip = skipAbsent && isAbsent(value);
      if (shouldSkip) {
        return handleResult(true);
      }
      let result;
      try {
        var _result;
        result = test.call(ctx, value, ctx);
        if (typeof ((_result = result) == null ? void 0 : _result.then) === "function") {
          if (options.sync) {
            throw new Error(`Validation test of type: "${ctx.type}" returned a Promise during a synchronous validate. This test will finish after the validate call has returned`);
          }
          return Promise.resolve(result).then(handleResult, handleError2);
        }
      } catch (err) {
        handleError2(err);
        return;
      }
      handleResult(result);
    }
    validate2.OPTIONS = config;
    return validate2;
  }
  function getIn(schema, path, value, context = value) {
    let parent, lastPart, lastPartDebug;
    if (!path)
      return {
        parent,
        parentPath: path,
        schema
      };
    propertyExpr.forEach(path, (_part, isBracket, isArray2) => {
      let part = isBracket ? _part.slice(1, _part.length - 1) : _part;
      schema = schema.resolve({
        context,
        parent,
        value
      });
      let isTuple = schema.type === "tuple";
      let idx = isArray2 ? parseInt(part, 10) : 0;
      if (schema.innerType || isTuple) {
        if (isTuple && !isArray2)
          throw new Error(`Yup.reach cannot implicitly index into a tuple type. the path part "${lastPartDebug}" must contain an index to the tuple element, e.g. "${lastPartDebug}[0]"`);
        if (value && idx >= value.length) {
          throw new Error(`Yup.reach cannot resolve an array item at index: ${_part}, in the path: ${path}. because there is no value at that index. `);
        }
        parent = value;
        value = value && value[idx];
        schema = isTuple ? schema.spec.types[idx] : schema.innerType;
      }
      if (!isArray2) {
        if (!schema.fields || !schema.fields[part])
          throw new Error(`The schema does not contain the path: ${path}. (failed at: ${lastPartDebug} which is a type: "${schema.type}")`);
        parent = value;
        value = value && value[part];
        schema = schema.fields[part];
      }
      lastPart = part;
      lastPartDebug = isBracket ? "[" + _part + "]" : "." + _part;
    });
    return {
      schema,
      parent,
      parentPath: lastPart
    };
  }
  class ReferenceSet extends Set {
    describe() {
      const description = [];
      for (const item of this.values()) {
        description.push(Reference.isRef(item) ? item.describe() : item);
      }
      return description;
    }
    resolveAll(resolve2) {
      let result = [];
      for (const item of this.values()) {
        result.push(resolve2(item));
      }
      return result;
    }
    clone() {
      return new ReferenceSet(this.values());
    }
    merge(newItems, removeItems) {
      const next = this.clone();
      newItems.forEach((value) => next.add(value));
      removeItems.forEach((value) => next.delete(value));
      return next;
    }
  }
  function clone(src, seen = /* @__PURE__ */ new Map()) {
    if (isSchema(src) || !src || typeof src !== "object")
      return src;
    if (seen.has(src))
      return seen.get(src);
    let copy2;
    if (src instanceof Date) {
      copy2 = new Date(src.getTime());
      seen.set(src, copy2);
    } else if (src instanceof RegExp) {
      copy2 = new RegExp(src);
      seen.set(src, copy2);
    } else if (Array.isArray(src)) {
      copy2 = new Array(src.length);
      seen.set(src, copy2);
      for (let i = 0; i < src.length; i++)
        copy2[i] = clone(src[i], seen);
    } else if (src instanceof Map) {
      copy2 = /* @__PURE__ */ new Map();
      seen.set(src, copy2);
      for (const [k2, v] of src.entries())
        copy2.set(k2, clone(v, seen));
    } else if (src instanceof Set) {
      copy2 = /* @__PURE__ */ new Set();
      seen.set(src, copy2);
      for (const v of src)
        copy2.add(clone(v, seen));
    } else if (src instanceof Object) {
      copy2 = {};
      seen.set(src, copy2);
      for (const [k2, v] of Object.entries(src))
        copy2[k2] = clone(v, seen);
    } else {
      throw Error(`Unable to clone ${src}`);
    }
    return copy2;
  }
  class Schema {
    constructor(options) {
      this.type = void 0;
      this.deps = [];
      this.tests = void 0;
      this.transforms = void 0;
      this.conditions = [];
      this._mutate = void 0;
      this.internalTests = {};
      this._whitelist = new ReferenceSet();
      this._blacklist = new ReferenceSet();
      this.exclusiveTests = /* @__PURE__ */ Object.create(null);
      this._typeCheck = void 0;
      this.spec = void 0;
      this.tests = [];
      this.transforms = [];
      this.withMutation(() => {
        this.typeError(mixed.notType);
      });
      this.type = options.type;
      this._typeCheck = options.check;
      this.spec = Object.assign({
        strip: false,
        strict: false,
        abortEarly: true,
        recursive: true,
        disableStackTrace: false,
        nullable: false,
        optional: true,
        coerce: true
      }, options == null ? void 0 : options.spec);
      this.withMutation((s) => {
        s.nonNullable();
      });
    }
    // TODO: remove
    get _type() {
      return this.type;
    }
    clone(spec) {
      if (this._mutate) {
        if (spec)
          Object.assign(this.spec, spec);
        return this;
      }
      const next = Object.create(Object.getPrototypeOf(this));
      next.type = this.type;
      next._typeCheck = this._typeCheck;
      next._whitelist = this._whitelist.clone();
      next._blacklist = this._blacklist.clone();
      next.internalTests = Object.assign({}, this.internalTests);
      next.exclusiveTests = Object.assign({}, this.exclusiveTests);
      next.deps = [...this.deps];
      next.conditions = [...this.conditions];
      next.tests = [...this.tests];
      next.transforms = [...this.transforms];
      next.spec = clone(Object.assign({}, this.spec, spec));
      return next;
    }
    label(label) {
      let next = this.clone();
      next.spec.label = label;
      return next;
    }
    meta(...args) {
      if (args.length === 0)
        return this.spec.meta;
      let next = this.clone();
      next.spec.meta = Object.assign(next.spec.meta || {}, args[0]);
      return next;
    }
    withMutation(fn) {
      let before = this._mutate;
      this._mutate = true;
      let result = fn(this);
      this._mutate = before;
      return result;
    }
    concat(schema) {
      if (!schema || schema === this)
        return this;
      if (schema.type !== this.type && this.type !== "mixed")
        throw new TypeError(`You cannot \`concat()\` schema's of different types: ${this.type} and ${schema.type}`);
      let base = this;
      let combined = schema.clone();
      const mergedSpec = Object.assign({}, base.spec, combined.spec);
      combined.spec = mergedSpec;
      combined.internalTests = Object.assign({}, base.internalTests, combined.internalTests);
      combined._whitelist = base._whitelist.merge(schema._whitelist, schema._blacklist);
      combined._blacklist = base._blacklist.merge(schema._blacklist, schema._whitelist);
      combined.tests = base.tests;
      combined.exclusiveTests = base.exclusiveTests;
      combined.withMutation((next) => {
        schema.tests.forEach((fn) => {
          next.test(fn.OPTIONS);
        });
      });
      combined.transforms = [...base.transforms, ...combined.transforms];
      return combined;
    }
    isType(v) {
      if (v == null) {
        if (this.spec.nullable && v === null)
          return true;
        if (this.spec.optional && v === void 0)
          return true;
        return false;
      }
      return this._typeCheck(v);
    }
    resolve(options) {
      let schema = this;
      if (schema.conditions.length) {
        let conditions = schema.conditions;
        schema = schema.clone();
        schema.conditions = [];
        schema = conditions.reduce((prevSchema, condition) => condition.resolve(prevSchema, options), schema);
        schema = schema.resolve(options);
      }
      return schema;
    }
    resolveOptions(options) {
      var _options$strict, _options$abortEarly, _options$recursive, _options$disableStack;
      return Object.assign({}, options, {
        from: options.from || [],
        strict: (_options$strict = options.strict) != null ? _options$strict : this.spec.strict,
        abortEarly: (_options$abortEarly = options.abortEarly) != null ? _options$abortEarly : this.spec.abortEarly,
        recursive: (_options$recursive = options.recursive) != null ? _options$recursive : this.spec.recursive,
        disableStackTrace: (_options$disableStack = options.disableStackTrace) != null ? _options$disableStack : this.spec.disableStackTrace
      });
    }
    /**
     * Run the configured transform pipeline over an input value.
     */
    cast(value, options = {}) {
      let resolvedSchema = this.resolve(Object.assign({
        value
      }, options));
      let allowOptionality = options.assert === "ignore-optionality";
      let result = resolvedSchema._cast(value, options);
      if (options.assert !== false && !resolvedSchema.isType(result)) {
        if (allowOptionality && isAbsent(result)) {
          return result;
        }
        let formattedValue = printValue(value);
        let formattedResult = printValue(result);
        throw new TypeError(`The value of ${options.path || "field"} could not be cast to a value that satisfies the schema type: "${resolvedSchema.type}". 

attempted value: ${formattedValue} 
` + (formattedResult !== formattedValue ? `result of cast: ${formattedResult}` : ""));
      }
      return result;
    }
    _cast(rawValue, options) {
      let value = rawValue === void 0 ? rawValue : this.transforms.reduce((prevValue, fn) => fn.call(this, prevValue, rawValue, this), rawValue);
      if (value === void 0) {
        value = this.getDefault(options);
      }
      return value;
    }
    _validate(_value, options = {}, panic, next) {
      let {
        path,
        originalValue = _value,
        strict = this.spec.strict
      } = options;
      let value = _value;
      if (!strict) {
        value = this._cast(value, Object.assign({
          assert: false
        }, options));
      }
      let initialTests = [];
      for (let test of Object.values(this.internalTests)) {
        if (test)
          initialTests.push(test);
      }
      this.runTests({
        path,
        value,
        originalValue,
        options,
        tests: initialTests
      }, panic, (initialErrors) => {
        if (initialErrors.length) {
          return next(initialErrors, value);
        }
        this.runTests({
          path,
          value,
          originalValue,
          options,
          tests: this.tests
        }, panic, next);
      });
    }
    /**
     * Executes a set of validations, either schema, produced Tests or a nested
     * schema validate result.
     */
    runTests(runOptions, panic, next) {
      let fired = false;
      let {
        tests,
        value,
        originalValue,
        path,
        options
      } = runOptions;
      let panicOnce = (arg) => {
        if (fired)
          return;
        fired = true;
        panic(arg, value);
      };
      let nextOnce = (arg) => {
        if (fired)
          return;
        fired = true;
        next(arg, value);
      };
      let count = tests.length;
      let nestedErrors = [];
      if (!count)
        return nextOnce([]);
      let args = {
        value,
        originalValue,
        path,
        options,
        schema: this
      };
      for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        test(args, panicOnce, function finishTestRun(err) {
          if (err) {
            Array.isArray(err) ? nestedErrors.push(...err) : nestedErrors.push(err);
          }
          if (--count <= 0) {
            nextOnce(nestedErrors);
          }
        });
      }
    }
    asNestedTest({
      key,
      index,
      parent,
      parentPath,
      originalParent,
      options
    }) {
      const k2 = key != null ? key : index;
      if (k2 == null) {
        throw TypeError("Must include `key` or `index` for nested validations");
      }
      const isIndex2 = typeof k2 === "number";
      let value = parent[k2];
      const testOptions = Object.assign({}, options, {
        // Nested validations fields are always strict:
        //    1. parent isn't strict so the casting will also have cast inner values
        //    2. parent is strict in which case the nested values weren't cast either
        strict: true,
        parent,
        value,
        originalValue: originalParent[k2],
        // FIXME: tests depend on `index` being passed around deeply,
        //   we should not let the options.key/index bleed through
        key: void 0,
        // index: undefined,
        [isIndex2 ? "index" : "key"]: k2,
        path: isIndex2 || k2.includes(".") ? `${parentPath || ""}[${value ? k2 : `"${k2}"`}]` : (parentPath ? `${parentPath}.` : "") + key
      });
      return (_, panic, next) => this.resolve(testOptions)._validate(value, testOptions, panic, next);
    }
    validate(value, options) {
      var _options$disableStack2;
      let schema = this.resolve(Object.assign({}, options, {
        value
      }));
      let disableStackTrace = (_options$disableStack2 = options == null ? void 0 : options.disableStackTrace) != null ? _options$disableStack2 : schema.spec.disableStackTrace;
      return new Promise((resolve2, reject) => schema._validate(value, options, (error, parsed) => {
        if (ValidationError.isError(error))
          error.value = parsed;
        reject(error);
      }, (errors, validated) => {
        if (errors.length)
          reject(new ValidationError(errors, validated, void 0, void 0, disableStackTrace));
        else
          resolve2(validated);
      }));
    }
    validateSync(value, options) {
      var _options$disableStack3;
      let schema = this.resolve(Object.assign({}, options, {
        value
      }));
      let result;
      let disableStackTrace = (_options$disableStack3 = options == null ? void 0 : options.disableStackTrace) != null ? _options$disableStack3 : schema.spec.disableStackTrace;
      schema._validate(value, Object.assign({}, options, {
        sync: true
      }), (error, parsed) => {
        if (ValidationError.isError(error))
          error.value = parsed;
        throw error;
      }, (errors, validated) => {
        if (errors.length)
          throw new ValidationError(errors, value, void 0, void 0, disableStackTrace);
        result = validated;
      });
      return result;
    }
    isValid(value, options) {
      return this.validate(value, options).then(() => true, (err) => {
        if (ValidationError.isError(err))
          return false;
        throw err;
      });
    }
    isValidSync(value, options) {
      try {
        this.validateSync(value, options);
        return true;
      } catch (err) {
        if (ValidationError.isError(err))
          return false;
        throw err;
      }
    }
    _getDefault(options) {
      let defaultValue = this.spec.default;
      if (defaultValue == null) {
        return defaultValue;
      }
      return typeof defaultValue === "function" ? defaultValue.call(this, options) : clone(defaultValue);
    }
    getDefault(options) {
      let schema = this.resolve(options || {});
      return schema._getDefault(options);
    }
    default(def2) {
      if (arguments.length === 0) {
        return this._getDefault();
      }
      let next = this.clone({
        default: def2
      });
      return next;
    }
    strict(isStrict = true) {
      return this.clone({
        strict: isStrict
      });
    }
    nullability(nullable, message) {
      const next = this.clone({
        nullable
      });
      next.internalTests.nullable = createValidation({
        message,
        name: "nullable",
        test(value) {
          return value === null ? this.schema.spec.nullable : true;
        }
      });
      return next;
    }
    optionality(optional, message) {
      const next = this.clone({
        optional
      });
      next.internalTests.optionality = createValidation({
        message,
        name: "optionality",
        test(value) {
          return value === void 0 ? this.schema.spec.optional : true;
        }
      });
      return next;
    }
    optional() {
      return this.optionality(true);
    }
    defined(message = mixed.defined) {
      return this.optionality(false, message);
    }
    nullable() {
      return this.nullability(true);
    }
    nonNullable(message = mixed.notNull) {
      return this.nullability(false, message);
    }
    required(message = mixed.required) {
      return this.clone().withMutation((next) => next.nonNullable(message).defined(message));
    }
    notRequired() {
      return this.clone().withMutation((next) => next.nullable().optional());
    }
    transform(fn) {
      let next = this.clone();
      next.transforms.push(fn);
      return next;
    }
    /**
     * Adds a test function to the schema's queue of tests.
     * tests can be exclusive or non-exclusive.
     *
     * - exclusive tests, will replace any existing tests of the same name.
     * - non-exclusive: can be stacked
     *
     * If a non-exclusive test is added to a schema with an exclusive test of the same name
     * the exclusive test is removed and further tests of the same name will be stacked.
     *
     * If an exclusive test is added to a schema with non-exclusive tests of the same name
     * the previous tests are removed and further tests of the same name will replace each other.
     */
    test(...args) {
      let opts;
      if (args.length === 1) {
        if (typeof args[0] === "function") {
          opts = {
            test: args[0]
          };
        } else {
          opts = args[0];
        }
      } else if (args.length === 2) {
        opts = {
          name: args[0],
          test: args[1]
        };
      } else {
        opts = {
          name: args[0],
          message: args[1],
          test: args[2]
        };
      }
      if (opts.message === void 0)
        opts.message = mixed.default;
      if (typeof opts.test !== "function")
        throw new TypeError("`test` is a required parameters");
      let next = this.clone();
      let validate2 = createValidation(opts);
      let isExclusive = opts.exclusive || opts.name && next.exclusiveTests[opts.name] === true;
      if (opts.exclusive) {
        if (!opts.name)
          throw new TypeError("Exclusive tests must provide a unique `name` identifying the test");
      }
      if (opts.name)
        next.exclusiveTests[opts.name] = !!opts.exclusive;
      next.tests = next.tests.filter((fn) => {
        if (fn.OPTIONS.name === opts.name) {
          if (isExclusive)
            return false;
          if (fn.OPTIONS.test === validate2.OPTIONS.test)
            return false;
        }
        return true;
      });
      next.tests.push(validate2);
      return next;
    }
    when(keys, options) {
      if (!Array.isArray(keys) && typeof keys !== "string") {
        options = keys;
        keys = ".";
      }
      let next = this.clone();
      let deps = toArray(keys).map((key) => new Reference(key));
      deps.forEach((dep) => {
        if (dep.isSibling)
          next.deps.push(dep.key);
      });
      next.conditions.push(typeof options === "function" ? new Condition(deps, options) : Condition.fromOptions(deps, options));
      return next;
    }
    typeError(message) {
      let next = this.clone();
      next.internalTests.typeError = createValidation({
        message,
        name: "typeError",
        skipAbsent: true,
        test(value) {
          if (!this.schema._typeCheck(value))
            return this.createError({
              params: {
                type: this.schema.type
              }
            });
          return true;
        }
      });
      return next;
    }
    oneOf(enums, message = mixed.oneOf) {
      let next = this.clone();
      enums.forEach((val) => {
        next._whitelist.add(val);
        next._blacklist.delete(val);
      });
      next.internalTests.whiteList = createValidation({
        message,
        name: "oneOf",
        skipAbsent: true,
        test(value) {
          let valids = this.schema._whitelist;
          let resolved = valids.resolveAll(this.resolve);
          return resolved.includes(value) ? true : this.createError({
            params: {
              values: Array.from(valids).join(", "),
              resolved
            }
          });
        }
      });
      return next;
    }
    notOneOf(enums, message = mixed.notOneOf) {
      let next = this.clone();
      enums.forEach((val) => {
        next._blacklist.add(val);
        next._whitelist.delete(val);
      });
      next.internalTests.blacklist = createValidation({
        message,
        name: "notOneOf",
        test(value) {
          let invalids = this.schema._blacklist;
          let resolved = invalids.resolveAll(this.resolve);
          if (resolved.includes(value))
            return this.createError({
              params: {
                values: Array.from(invalids).join(", "),
                resolved
              }
            });
          return true;
        }
      });
      return next;
    }
    strip(strip = true) {
      let next = this.clone();
      next.spec.strip = strip;
      return next;
    }
    /**
     * Return a serialized description of the schema including validations, flags, types etc.
     *
     * @param options Provide any needed context for resolving runtime schema alterations (lazy, when conditions, etc).
     */
    describe(options) {
      const next = (options ? this.resolve(options) : this).clone();
      const {
        label,
        meta,
        optional,
        nullable
      } = next.spec;
      const description = {
        meta,
        label,
        optional,
        nullable,
        default: next.getDefault(options),
        type: next.type,
        oneOf: next._whitelist.describe(),
        notOneOf: next._blacklist.describe(),
        tests: next.tests.map((fn) => ({
          name: fn.OPTIONS.name,
          params: fn.OPTIONS.params
        })).filter((n, idx, list) => list.findIndex((c2) => c2.name === n.name) === idx)
      };
      return description;
    }
  }
  Schema.prototype.__isYupSchema__ = true;
  for (const method of ["validate", "validateSync"])
    Schema.prototype[`${method}At`] = function(path, value, options = {}) {
      const {
        parent,
        parentPath,
        schema
      } = getIn(this, path, value, options.context);
      return schema[method](parent && parent[parentPath], Object.assign({}, options, {
        parent,
        path
      }));
    };
  for (const alias of ["equals", "is"])
    Schema.prototype[alias] = Schema.prototype.oneOf;
  for (const alias of ["not", "nope"])
    Schema.prototype[alias] = Schema.prototype.notOneOf;
  const returnsTrue = () => true;
  function create$8(spec) {
    return new MixedSchema(spec);
  }
  class MixedSchema extends Schema {
    constructor(spec) {
      super(typeof spec === "function" ? {
        type: "mixed",
        check: spec
      } : Object.assign({
        type: "mixed",
        check: returnsTrue
      }, spec));
    }
  }
  create$8.prototype = MixedSchema.prototype;
  let rEmail = (
    // eslint-disable-next-line
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  );
  let rUrl = (
    // eslint-disable-next-line
    /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
  );
  let rUUID = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  let isTrimmed = (value) => isAbsent(value) || value === value.trim();
  let objStringTag = {}.toString();
  function create$6() {
    return new StringSchema();
  }
  class StringSchema extends Schema {
    constructor() {
      super({
        type: "string",
        check(value) {
          if (value instanceof String)
            value = value.valueOf();
          return typeof value === "string";
        }
      });
      this.withMutation(() => {
        this.transform((value, _raw, ctx) => {
          if (!ctx.spec.coerce || ctx.isType(value))
            return value;
          if (Array.isArray(value))
            return value;
          const strValue = value != null && value.toString ? value.toString() : value;
          if (strValue === objStringTag)
            return value;
          return strValue;
        });
      });
    }
    required(message) {
      return super.required(message).withMutation((schema) => schema.test({
        message: message || mixed.required,
        name: "required",
        skipAbsent: true,
        test: (value) => !!value.length
      }));
    }
    notRequired() {
      return super.notRequired().withMutation((schema) => {
        schema.tests = schema.tests.filter((t) => t.OPTIONS.name !== "required");
        return schema;
      });
    }
    length(length, message = string.length) {
      return this.test({
        message,
        name: "length",
        exclusive: true,
        params: {
          length
        },
        skipAbsent: true,
        test(value) {
          return value.length === this.resolve(length);
        }
      });
    }
    min(min, message = string.min) {
      return this.test({
        message,
        name: "min",
        exclusive: true,
        params: {
          min
        },
        skipAbsent: true,
        test(value) {
          return value.length >= this.resolve(min);
        }
      });
    }
    max(max, message = string.max) {
      return this.test({
        name: "max",
        exclusive: true,
        message,
        params: {
          max
        },
        skipAbsent: true,
        test(value) {
          return value.length <= this.resolve(max);
        }
      });
    }
    matches(regex, options) {
      let excludeEmptyString = false;
      let message;
      let name;
      if (options) {
        if (typeof options === "object") {
          ({
            excludeEmptyString = false,
            message,
            name
          } = options);
        } else {
          message = options;
        }
      }
      return this.test({
        name: name || "matches",
        message: message || string.matches,
        params: {
          regex
        },
        skipAbsent: true,
        test: (value) => value === "" && excludeEmptyString || value.search(regex) !== -1
      });
    }
    email(message = string.email) {
      return this.matches(rEmail, {
        name: "email",
        message,
        excludeEmptyString: true
      });
    }
    url(message = string.url) {
      return this.matches(rUrl, {
        name: "url",
        message,
        excludeEmptyString: true
      });
    }
    uuid(message = string.uuid) {
      return this.matches(rUUID, {
        name: "uuid",
        message,
        excludeEmptyString: false
      });
    }
    //-- transforms --
    ensure() {
      return this.default("").transform((val) => val === null ? "" : val);
    }
    trim(message = string.trim) {
      return this.transform((val) => val != null ? val.trim() : val).test({
        message,
        name: "trim",
        test: isTrimmed
      });
    }
    lowercase(message = string.lowercase) {
      return this.transform((value) => !isAbsent(value) ? value.toLowerCase() : value).test({
        message,
        name: "string_case",
        exclusive: true,
        skipAbsent: true,
        test: (value) => isAbsent(value) || value === value.toLowerCase()
      });
    }
    uppercase(message = string.uppercase) {
      return this.transform((value) => !isAbsent(value) ? value.toUpperCase() : value).test({
        message,
        name: "string_case",
        exclusive: true,
        skipAbsent: true,
        test: (value) => isAbsent(value) || value === value.toUpperCase()
      });
    }
  }
  create$6.prototype = StringSchema.prototype;
  const isoReg = /^(\d{4}|[+-]\d{6})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:[ T]?(\d{2}):?(\d{2})(?::?(\d{2})(?:[,.](\d{1,}))?)?(?:(Z)|([+-])(\d{2})(?::?(\d{2}))?)?)?$/;
  function toNumber$1(str, defaultValue = 0) {
    return Number(str) || defaultValue;
  }
  function parseIsoDate(date2) {
    const regexResult = isoReg.exec(date2);
    if (!regexResult)
      return Date.parse ? Date.parse(date2) : Number.NaN;
    const struct = {
      year: toNumber$1(regexResult[1]),
      month: toNumber$1(regexResult[2], 1) - 1,
      day: toNumber$1(regexResult[3], 1),
      hour: toNumber$1(regexResult[4]),
      minute: toNumber$1(regexResult[5]),
      second: toNumber$1(regexResult[6]),
      millisecond: regexResult[7] ? (
        // allow arbitrary sub-second precision beyond milliseconds
        toNumber$1(regexResult[7].substring(0, 3))
      ) : 0,
      z: regexResult[8] || void 0,
      plusMinus: regexResult[9] || void 0,
      hourOffset: toNumber$1(regexResult[10]),
      minuteOffset: toNumber$1(regexResult[11])
    };
    if (struct.z === void 0 && struct.plusMinus === void 0) {
      return new Date(struct.year, struct.month, struct.day, struct.hour, struct.minute, struct.second, struct.millisecond).valueOf();
    }
    let totalMinutesOffset = 0;
    if (struct.z !== "Z" && struct.plusMinus !== void 0) {
      totalMinutesOffset = struct.hourOffset * 60 + struct.minuteOffset;
      if (struct.plusMinus === "+")
        totalMinutesOffset = 0 - totalMinutesOffset;
    }
    return Date.UTC(struct.year, struct.month, struct.day, struct.hour, struct.minute + totalMinutesOffset, struct.second, struct.millisecond);
  }
  let invalidDate = /* @__PURE__ */ new Date("");
  let isDate$1 = (obj) => Object.prototype.toString.call(obj) === "[object Date]";
  class DateSchema extends Schema {
    constructor() {
      super({
        type: "date",
        check(v) {
          return isDate$1(v) && !isNaN(v.getTime());
        }
      });
      this.withMutation(() => {
        this.transform((value, _raw, ctx) => {
          if (!ctx.spec.coerce || ctx.isType(value) || value === null)
            return value;
          value = parseIsoDate(value);
          return !isNaN(value) ? new Date(value) : DateSchema.INVALID_DATE;
        });
      });
    }
    prepareParam(ref2, name) {
      let param;
      if (!Reference.isRef(ref2)) {
        let cast = this.cast(ref2);
        if (!this._typeCheck(cast))
          throw new TypeError(`\`${name}\` must be a Date or a value that can be \`cast()\` to a Date`);
        param = cast;
      } else {
        param = ref2;
      }
      return param;
    }
    min(min, message = date.min) {
      let limit = this.prepareParam(min, "min");
      return this.test({
        message,
        name: "min",
        exclusive: true,
        params: {
          min
        },
        skipAbsent: true,
        test(value) {
          return value >= this.resolve(limit);
        }
      });
    }
    max(max, message = date.max) {
      let limit = this.prepareParam(max, "max");
      return this.test({
        message,
        name: "max",
        exclusive: true,
        params: {
          max
        },
        skipAbsent: true,
        test(value) {
          return value <= this.resolve(limit);
        }
      });
    }
  }
  DateSchema.INVALID_DATE = invalidDate;
  DateSchema.prototype;
  function sortFields(fields, excludedEdges = []) {
    let edges = [];
    let nodes = /* @__PURE__ */ new Set();
    let excludes = new Set(excludedEdges.map(([a, b]) => `${a}-${b}`));
    function addNode(depPath, key) {
      let node = propertyExpr.split(depPath)[0];
      nodes.add(node);
      if (!excludes.has(`${key}-${node}`))
        edges.push([key, node]);
    }
    for (const key of Object.keys(fields)) {
      let value = fields[key];
      nodes.add(key);
      if (Reference.isRef(value) && value.isSibling)
        addNode(value.path, key);
      else if (isSchema(value) && "deps" in value)
        value.deps.forEach((path) => addNode(path, key));
    }
    return toposort$1.array(Array.from(nodes), edges).reverse();
  }
  function findIndex(arr, err) {
    let idx = Infinity;
    arr.some((key, ii) => {
      var _err$path;
      if ((_err$path = err.path) != null && _err$path.includes(key)) {
        idx = ii;
        return true;
      }
    });
    return idx;
  }
  function sortByKeyOrder(keys) {
    return (a, b) => {
      return findIndex(keys, a) - findIndex(keys, b);
    };
  }
  const parseJson = (value, _, ctx) => {
    if (typeof value !== "string") {
      return value;
    }
    let parsed = value;
    try {
      parsed = JSON.parse(value);
    } catch (err) {
    }
    return ctx.isType(parsed) ? parsed : value;
  };
  function deepPartial(schema) {
    if ("fields" in schema) {
      const partial = {};
      for (const [key, fieldSchema] of Object.entries(schema.fields)) {
        partial[key] = deepPartial(fieldSchema);
      }
      return schema.setFields(partial);
    }
    if (schema.type === "array") {
      const nextArray = schema.optional();
      if (nextArray.innerType)
        nextArray.innerType = deepPartial(nextArray.innerType);
      return nextArray;
    }
    if (schema.type === "tuple") {
      return schema.optional().clone({
        types: schema.spec.types.map(deepPartial)
      });
    }
    if ("optional" in schema) {
      return schema.optional();
    }
    return schema;
  }
  const deepHas = (obj, p2) => {
    const path = [...propertyExpr.normalizePath(p2)];
    if (path.length === 1)
      return path[0] in obj;
    let last = path.pop();
    let parent = propertyExpr.getter(propertyExpr.join(path), true)(obj);
    return !!(parent && last in parent);
  };
  let isObject$3 = (obj) => Object.prototype.toString.call(obj) === "[object Object]";
  function unknown(ctx, value) {
    let known = Object.keys(ctx.fields);
    return Object.keys(value).filter((key) => known.indexOf(key) === -1);
  }
  const defaultSort = sortByKeyOrder([]);
  function create$3(spec) {
    return new ObjectSchema(spec);
  }
  class ObjectSchema extends Schema {
    constructor(spec) {
      super({
        type: "object",
        check(value) {
          return isObject$3(value) || typeof value === "function";
        }
      });
      this.fields = /* @__PURE__ */ Object.create(null);
      this._sortErrors = defaultSort;
      this._nodes = [];
      this._excludedEdges = [];
      this.withMutation(() => {
        if (spec) {
          this.shape(spec);
        }
      });
    }
    _cast(_value, options = {}) {
      var _options$stripUnknown;
      let value = super._cast(_value, options);
      if (value === void 0)
        return this.getDefault(options);
      if (!this._typeCheck(value))
        return value;
      let fields = this.fields;
      let strip = (_options$stripUnknown = options.stripUnknown) != null ? _options$stripUnknown : this.spec.noUnknown;
      let props = [].concat(this._nodes, Object.keys(value).filter((v) => !this._nodes.includes(v)));
      let intermediateValue = {};
      let innerOptions = Object.assign({}, options, {
        parent: intermediateValue,
        __validating: options.__validating || false
      });
      let isChanged = false;
      for (const prop of props) {
        let field = fields[prop];
        let exists = prop in value;
        if (field) {
          let fieldValue;
          let inputValue = value[prop];
          innerOptions.path = (options.path ? `${options.path}.` : "") + prop;
          field = field.resolve({
            value: inputValue,
            context: options.context,
            parent: intermediateValue
          });
          let fieldSpec = field instanceof Schema ? field.spec : void 0;
          let strict = fieldSpec == null ? void 0 : fieldSpec.strict;
          if (fieldSpec != null && fieldSpec.strip) {
            isChanged = isChanged || prop in value;
            continue;
          }
          fieldValue = !options.__validating || !strict ? (
            // TODO: use _cast, this is double resolving
            field.cast(value[prop], innerOptions)
          ) : value[prop];
          if (fieldValue !== void 0) {
            intermediateValue[prop] = fieldValue;
          }
        } else if (exists && !strip) {
          intermediateValue[prop] = value[prop];
        }
        if (exists !== prop in intermediateValue || intermediateValue[prop] !== value[prop]) {
          isChanged = true;
        }
      }
      return isChanged ? intermediateValue : value;
    }
    _validate(_value, options = {}, panic, next) {
      let {
        from = [],
        originalValue = _value,
        recursive = this.spec.recursive
      } = options;
      options.from = [{
        schema: this,
        value: originalValue
      }, ...from];
      options.__validating = true;
      options.originalValue = originalValue;
      super._validate(_value, options, panic, (objectErrors, value) => {
        if (!recursive || !isObject$3(value)) {
          next(objectErrors, value);
          return;
        }
        originalValue = originalValue || value;
        let tests = [];
        for (let key of this._nodes) {
          let field = this.fields[key];
          if (!field || Reference.isRef(field)) {
            continue;
          }
          tests.push(field.asNestedTest({
            options,
            key,
            parent: value,
            parentPath: options.path,
            originalParent: originalValue
          }));
        }
        this.runTests({
          tests,
          value,
          originalValue,
          options
        }, panic, (fieldErrors) => {
          next(fieldErrors.sort(this._sortErrors).concat(objectErrors), value);
        });
      });
    }
    clone(spec) {
      const next = super.clone(spec);
      next.fields = Object.assign({}, this.fields);
      next._nodes = this._nodes;
      next._excludedEdges = this._excludedEdges;
      next._sortErrors = this._sortErrors;
      return next;
    }
    concat(schema) {
      let next = super.concat(schema);
      let nextFields = next.fields;
      for (let [field, schemaOrRef] of Object.entries(this.fields)) {
        const target = nextFields[field];
        nextFields[field] = target === void 0 ? schemaOrRef : target;
      }
      return next.withMutation((s) => (
        // XXX: excludes here is wrong
        s.setFields(nextFields, [...this._excludedEdges, ...schema._excludedEdges])
      ));
    }
    _getDefault(options) {
      if ("default" in this.spec) {
        return super._getDefault(options);
      }
      if (!this._nodes.length) {
        return void 0;
      }
      let dft = {};
      this._nodes.forEach((key) => {
        var _innerOptions;
        const field = this.fields[key];
        let innerOptions = options;
        if ((_innerOptions = innerOptions) != null && _innerOptions.value) {
          innerOptions = Object.assign({}, innerOptions, {
            parent: innerOptions.value,
            value: innerOptions.value[key]
          });
        }
        dft[key] = field && "getDefault" in field ? field.getDefault(innerOptions) : void 0;
      });
      return dft;
    }
    setFields(shape, excludedEdges) {
      let next = this.clone();
      next.fields = shape;
      next._nodes = sortFields(shape, excludedEdges);
      next._sortErrors = sortByKeyOrder(Object.keys(shape));
      if (excludedEdges)
        next._excludedEdges = excludedEdges;
      return next;
    }
    shape(additions, excludes = []) {
      return this.clone().withMutation((next) => {
        let edges = next._excludedEdges;
        if (excludes.length) {
          if (!Array.isArray(excludes[0]))
            excludes = [excludes];
          edges = [...next._excludedEdges, ...excludes];
        }
        return next.setFields(Object.assign(next.fields, additions), edges);
      });
    }
    partial() {
      const partial = {};
      for (const [key, schema] of Object.entries(this.fields)) {
        partial[key] = "optional" in schema && schema.optional instanceof Function ? schema.optional() : schema;
      }
      return this.setFields(partial);
    }
    deepPartial() {
      const next = deepPartial(this);
      return next;
    }
    pick(keys) {
      const picked = {};
      for (const key of keys) {
        if (this.fields[key])
          picked[key] = this.fields[key];
      }
      return this.setFields(picked, this._excludedEdges.filter(([a, b]) => keys.includes(a) && keys.includes(b)));
    }
    omit(keys) {
      const remaining = [];
      for (const key of Object.keys(this.fields)) {
        if (keys.includes(key))
          continue;
        remaining.push(key);
      }
      return this.pick(remaining);
    }
    from(from, to, alias) {
      let fromGetter = propertyExpr.getter(from, true);
      return this.transform((obj) => {
        if (!obj)
          return obj;
        let newObj = obj;
        if (deepHas(obj, from)) {
          newObj = Object.assign({}, obj);
          if (!alias)
            delete newObj[from];
          newObj[to] = fromGetter(obj);
        }
        return newObj;
      });
    }
    /** Parse an input JSON string to an object */
    json() {
      return this.transform(parseJson);
    }
    noUnknown(noAllow = true, message = object.noUnknown) {
      if (typeof noAllow !== "boolean") {
        message = noAllow;
        noAllow = true;
      }
      let next = this.test({
        name: "noUnknown",
        exclusive: true,
        message,
        test(value) {
          if (value == null)
            return true;
          const unknownKeys = unknown(this.schema, value);
          return !noAllow || unknownKeys.length === 0 || this.createError({
            params: {
              unknown: unknownKeys.join(", ")
            }
          });
        }
      });
      next.spec.noUnknown = noAllow;
      return next;
    }
    unknown(allow = true, message = object.noUnknown) {
      return this.noUnknown(!allow, message);
    }
    transformKeys(fn) {
      return this.transform((obj) => {
        if (!obj)
          return obj;
        const result = {};
        for (const key of Object.keys(obj))
          result[fn(key)] = obj[key];
        return result;
      });
    }
    camelCase() {
      return this.transformKeys(tinyCase.camelCase);
    }
    snakeCase() {
      return this.transformKeys(tinyCase.snakeCase);
    }
    constantCase() {
      return this.transformKeys((key) => tinyCase.snakeCase(key).toUpperCase());
    }
    describe(options) {
      const next = (options ? this.resolve(options) : this).clone();
      const base = super.describe(options);
      base.fields = {};
      for (const [key, value] of Object.entries(next.fields)) {
        var _innerOptions2;
        let innerOptions = options;
        if ((_innerOptions2 = innerOptions) != null && _innerOptions2.value) {
          innerOptions = Object.assign({}, innerOptions, {
            parent: innerOptions.value,
            value: innerOptions.value[key]
          });
        }
        base.fields[key] = value.describe(innerOptions);
      }
      return base;
    }
  }
  create$3.prototype = ObjectSchema.prototype;
  function create(builder) {
    return new Lazy(builder);
  }
  class Lazy {
    constructor(builder) {
      this.type = "lazy";
      this.__isYupSchema__ = true;
      this.spec = void 0;
      this._resolve = (value, options = {}) => {
        let schema = this.builder(value, options);
        if (!isSchema(schema))
          throw new TypeError("lazy() functions must return a valid schema");
        if (this.spec.optional)
          schema = schema.optional();
        return schema.resolve(options);
      };
      this.builder = builder;
      this.spec = {
        meta: void 0,
        optional: false
      };
    }
    clone(spec) {
      const next = new Lazy(this.builder);
      next.spec = Object.assign({}, this.spec, spec);
      return next;
    }
    optionality(optional) {
      const next = this.clone({
        optional
      });
      return next;
    }
    optional() {
      return this.optionality(true);
    }
    resolve(options) {
      return this._resolve(options.value, options);
    }
    cast(value, options) {
      return this._resolve(value, options).cast(value, options);
    }
    asNestedTest(config) {
      let {
        key,
        index,
        parent,
        options
      } = config;
      let value = parent[index != null ? index : key];
      return this._resolve(value, Object.assign({}, options, {
        value,
        parent
      })).asNestedTest(config);
    }
    validate(value, options) {
      return this._resolve(value, options).validate(value, options);
    }
    validateSync(value, options) {
      return this._resolve(value, options).validateSync(value, options);
    }
    validateAt(path, value, options) {
      return this._resolve(value, options).validateAt(path, value, options);
    }
    validateSyncAt(path, value, options) {
      return this._resolve(value, options).validateSyncAt(path, value, options);
    }
    isValid(value, options) {
      return this._resolve(value, options).isValid(value, options);
    }
    isValidSync(value, options) {
      return this._resolve(value, options).isValidSync(value, options);
    }
    describe(options) {
      return options ? this.resolve(options).describe(options) : {
        type: "lazy",
        meta: this.spec.meta,
        label: void 0
      };
    }
    meta(...args) {
      if (args.length === 0)
        return this.spec.meta;
      let next = this.clone();
      next.spec.meta = Object.assign(next.spec.meta || {}, args[0]);
      return next;
    }
  }
  function setLocale(custom) {
    Object.keys(custom).forEach((type) => {
      Object.keys(custom[type]).forEach((method) => {
        locale[type][method] = custom[type][method];
      });
    });
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$f = {};
  const _hoisted_1$o = { class: "t-flex t-flex-col t-w-full t-gap-8 lg:t-gap-13 t-max-w-[576px]" };
  const _hoisted_2$i = { class: "t-flex t-flex-col t-gap-3" };
  const _hoisted_3$f = /* @__PURE__ */ createBaseVNode("h2", { class: "t-h2 t-pl-5 lg:t-pl-7 lg:t-mb-3" }, "Получатель", -1);
  const _hoisted_4$e = /* @__PURE__ */ createBaseVNode("h2", { class: "t-h2 t-pl-5 lg:t-pl-7 t-mb-5" }, "Доставка", -1);
  const _hoisted_5$e = { class: "t-flex t-gap-1.5 lg:t-gap-2 t-mb-7 lg:t-mb-3" };
  const _hoisted_6$b = { class: "t-flex t-flex-col t-gap-3" };
  const _hoisted_7$9 = /* @__PURE__ */ createBaseVNode("h2", { class: "t-h2 t-pl-5 lg:t-pl-7 t-mb-5" }, "Способ оплаты", -1);
  function _sfc_render$1(_ctx, _cache) {
    const _component_Skeleton = resolveComponent("Skeleton");
    return openBlock(), createElementBlock("div", _hoisted_1$o, [
      createBaseVNode("div", _hoisted_2$i, [
        _hoisted_3$f,
        createVNode(_component_Skeleton, {
          height: "48px",
          "border-radius": "0"
        }),
        createVNode(_component_Skeleton, {
          height: "48px",
          "border-radius": "0"
        }),
        createVNode(_component_Skeleton, {
          height: "48px",
          "border-radius": "0"
        })
      ]),
      createBaseVNode("div", null, [
        _hoisted_4$e,
        createBaseVNode("div", _hoisted_5$e, [
          createVNode(_component_Skeleton, {
            height: "48px",
            "border-radius": "0"
          }),
          createVNode(_component_Skeleton, {
            height: "48px",
            "border-radius": "0"
          })
        ]),
        createBaseVNode("div", _hoisted_6$b, [
          createVNode(_component_Skeleton, {
            height: "48px",
            "border-radius": "0"
          }),
          createVNode(_component_Skeleton, {
            height: "48px",
            "border-radius": "0"
          })
        ])
      ]),
      createBaseVNode("div", null, [
        _hoisted_7$9,
        createVNode(_component_Skeleton, {
          height: "48px",
          "border-radius": "0"
        })
      ])
    ]);
  }
  const CheckoutFormSkeleton = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$1], ["__file", "C:/projects/geek-flow/kin/src/components/forms/CheckoutFormSkeleton.vue"]]);
  const _sfc_main$d = {};
  const _hoisted_1$n = { class: "t-max-w-[544px] t-w-full t-min-w-[352px]" };
  const _hoisted_2$h = { class: "t-mb-9" };
  const _hoisted_3$e = /* @__PURE__ */ createBaseVNode("h2", { class: "t-h2 t-pl-5 lg:t-pl-7 t-mb-5" }, "Детали заказа", -1);
  const _hoisted_4$d = { class: "t-grid t-grid-cols-[88px_auto] lg:t-grid-cols-[132px_auto] t-gap-6 t-mb-12" };
  const _hoisted_5$d = { class: "t-flex t-w-full t-flex-col t-gap-1" };
  const _hoisted_6$a = { class: "t-flex t-w-full t-flex-col t-gap-4" };
  const _hoisted_7$8 = /* @__PURE__ */ createBaseVNode("div", { class: "t-w-full t-h-px !t-block t-border t-border-black" }, null, -1);
  function _sfc_render(_ctx, _cache) {
    const _component_Skeleton = resolveComponent("Skeleton");
    return openBlock(), createElementBlock("div", _hoisted_1$n, [
      createBaseVNode("div", _hoisted_2$h, [
        _hoisted_3$e,
        createVNode(_component_Skeleton, {
          height: "48px",
          "border-radius": "0"
        })
      ]),
      createBaseVNode("div", _hoisted_4$d, [
        createVNode(_component_Skeleton, {
          shape: "rectangle",
          "border-radius": "0",
          class: "t-aspect-square t-w-full t-h-auto"
        }),
        createBaseVNode("div", _hoisted_5$d, [
          createVNode(_component_Skeleton, {
            height: "20px",
            "border-radius": "0"
          }),
          createVNode(_component_Skeleton, {
            height: "16px",
            "border-radius": "0"
          })
        ])
      ]),
      createBaseVNode("div", _hoisted_6$a, [
        createVNode(_component_Skeleton, {
          height: "16px",
          "border-radius": "0"
        }),
        createVNode(_component_Skeleton, {
          height: "16px",
          "border-radius": "0"
        }),
        createVNode(_component_Skeleton, {
          height: "16px",
          "border-radius": "0"
        }),
        _hoisted_7$8,
        createVNode(_component_Skeleton, {
          height: "16px",
          "border-radius": "0"
        }),
        createVNode(_component_Skeleton, {
          height: "48px",
          "border-radius": "0",
          class: "t-mt-9 lg:t-mt-14"
        })
      ])
    ]);
  }
  const CheckoutAsideSkeleton = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render], ["__file", "C:/projects/geek-flow/kin/src/components/aside/CheckoutAsideSkeleton.vue"]]);
  const _hoisted_1$m = { class: "t-grid t-grid-cols-1 lg:t-grid-cols-2 t-gap-11 lg:t-justify-center t-justify-items-center t-w-full" };
  const _sfc_main$c = /* @__PURE__ */ defineComponent({
    __name: "CheckoutSkeleton",
    setup(__props) {
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$m, [
          createVNode(CheckoutFormSkeleton),
          createVNode(CheckoutAsideSkeleton)
        ]);
      };
    }
  });
  const CheckoutSkeleton = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__file", "C:/projects/geek-flow/kin/src/components/containers/CheckoutSkeleton.vue"]]);
  var ICheckoutStatus = /* @__PURE__ */ ((ICheckoutStatus2) => {
    ICheckoutStatus2["CREATED"] = "CREATED";
    ICheckoutStatus2["PROCESS"] = "PROCESS";
    ICheckoutStatus2["COMPLETED"] = "COMPLETED";
    ICheckoutStatus2["CANCELED"] = "CANCELED";
    ICheckoutStatus2["TO_CANCEL"] = "TO_CANCEL";
    return ICheckoutStatus2;
  })(ICheckoutStatus || {});
  class HTTPError extends Error {
    constructor(response, request, options) {
      const code = response.status || response.status === 0 ? response.status : "";
      const title = response.statusText || "";
      const status = `${code} ${title}`.trim();
      const reason = status ? `status code ${status}` : "an unknown error";
      super(`Request failed with ${reason}`);
      Object.defineProperty(this, "response", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "request", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "options", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      this.name = "HTTPError";
      this.response = response;
      this.request = request;
      this.options = options;
    }
  }
  class TimeoutError extends Error {
    constructor(request) {
      super("Request timed out");
      Object.defineProperty(this, "request", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      this.name = "TimeoutError";
      this.request = request;
    }
  }
  const isObject$2 = (value) => value !== null && typeof value === "object";
  const validateAndMerge = (...sources) => {
    for (const source of sources) {
      if ((!isObject$2(source) || Array.isArray(source)) && source !== void 0) {
        throw new TypeError("The `options` argument must be an object");
      }
    }
    return deepMerge({}, ...sources);
  };
  const mergeHeaders = (source1 = {}, source2 = {}) => {
    const result = new globalThis.Headers(source1);
    const isHeadersInstance = source2 instanceof globalThis.Headers;
    const source = new globalThis.Headers(source2);
    for (const [key, value] of source.entries()) {
      if (isHeadersInstance && value === "undefined" || value === void 0) {
        result.delete(key);
      } else {
        result.set(key, value);
      }
    }
    return result;
  };
  const deepMerge = (...sources) => {
    let returnValue = {};
    let headers = {};
    for (const source of sources) {
      if (Array.isArray(source)) {
        if (!Array.isArray(returnValue)) {
          returnValue = [];
        }
        returnValue = [...returnValue, ...source];
      } else if (isObject$2(source)) {
        for (let [key, value] of Object.entries(source)) {
          if (isObject$2(value) && key in returnValue) {
            value = deepMerge(returnValue[key], value);
          }
          returnValue = { ...returnValue, [key]: value };
        }
        if (isObject$2(source.headers)) {
          headers = mergeHeaders(headers, source.headers);
          returnValue.headers = headers;
        }
      }
    }
    return returnValue;
  };
  const supportsRequestStreams = (() => {
    let duplexAccessed = false;
    let hasContentType = false;
    const supportsReadableStream = typeof globalThis.ReadableStream === "function";
    const supportsRequest = typeof globalThis.Request === "function";
    if (supportsReadableStream && supportsRequest) {
      hasContentType = new globalThis.Request("https://empty.invalid", {
        body: new globalThis.ReadableStream(),
        method: "POST",
        // @ts-expect-error - Types are outdated.
        get duplex() {
          duplexAccessed = true;
          return "half";
        }
      }).headers.has("Content-Type");
    }
    return duplexAccessed && !hasContentType;
  })();
  const supportsAbortController = typeof globalThis.AbortController === "function";
  const supportsResponseStreams = typeof globalThis.ReadableStream === "function";
  const supportsFormData = typeof globalThis.FormData === "function";
  const requestMethods = ["get", "post", "put", "patch", "head", "delete"];
  const responseTypes = {
    json: "application/json",
    text: "text/*",
    formData: "multipart/form-data",
    arrayBuffer: "*/*",
    blob: "*/*"
  };
  const maxSafeTimeout = 2147483647;
  const stop = Symbol("stop");
  const kyOptionKeys = {
    json: true,
    parseJson: true,
    searchParams: true,
    prefixUrl: true,
    retry: true,
    timeout: true,
    hooks: true,
    throwHttpErrors: true,
    onDownloadProgress: true,
    fetch: true
  };
  const requestOptionsRegistry = {
    method: true,
    headers: true,
    body: true,
    mode: true,
    credentials: true,
    cache: true,
    redirect: true,
    referrer: true,
    referrerPolicy: true,
    integrity: true,
    keepalive: true,
    signal: true,
    window: true,
    dispatcher: true,
    duplex: true
  };
  const normalizeRequestMethod = (input) => requestMethods.includes(input) ? input.toUpperCase() : input;
  const retryMethods = ["get", "put", "head", "delete", "options", "trace"];
  const retryStatusCodes = [408, 413, 429, 500, 502, 503, 504];
  const retryAfterStatusCodes = [413, 429, 503];
  const defaultRetryOptions = {
    limit: 2,
    methods: retryMethods,
    statusCodes: retryStatusCodes,
    afterStatusCodes: retryAfterStatusCodes,
    maxRetryAfter: Number.POSITIVE_INFINITY,
    backoffLimit: Number.POSITIVE_INFINITY,
    delay: (attemptCount) => 0.3 * 2 ** (attemptCount - 1) * 1e3
  };
  const normalizeRetryOptions = (retry = {}) => {
    if (typeof retry === "number") {
      return {
        ...defaultRetryOptions,
        limit: retry
      };
    }
    if (retry.methods && !Array.isArray(retry.methods)) {
      throw new Error("retry.methods must be an array");
    }
    if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
      throw new Error("retry.statusCodes must be an array");
    }
    return {
      ...defaultRetryOptions,
      ...retry,
      afterStatusCodes: retryAfterStatusCodes
    };
  };
  async function timeout(request, init, abortController, options) {
    return new Promise((resolve2, reject) => {
      const timeoutId = setTimeout(() => {
        if (abortController) {
          abortController.abort();
        }
        reject(new TimeoutError(request));
      }, options.timeout);
      void options.fetch(request, init).then(resolve2).catch(reject).then(() => {
        clearTimeout(timeoutId);
      });
    });
  }
  async function delay(ms, { signal }) {
    return new Promise((resolve2, reject) => {
      if (signal) {
        signal.throwIfAborted();
        signal.addEventListener("abort", abortHandler, { once: true });
      }
      function abortHandler() {
        clearTimeout(timeoutId);
        reject(signal.reason);
      }
      const timeoutId = setTimeout(() => {
        signal == null ? void 0 : signal.removeEventListener("abort", abortHandler);
        resolve2();
      }, ms);
    });
  }
  const findUnknownOptions = (request, options) => {
    const unknownOptions = {};
    for (const key in options) {
      if (!(key in requestOptionsRegistry) && !(key in kyOptionKeys) && !(key in request)) {
        unknownOptions[key] = options[key];
      }
    }
    return unknownOptions;
  };
  class Ky {
    static create(input, options) {
      const ky2 = new Ky(input, options);
      const function_ = async () => {
        if (typeof ky2._options.timeout === "number" && ky2._options.timeout > maxSafeTimeout) {
          throw new RangeError(`The \`timeout\` option cannot be greater than ${maxSafeTimeout}`);
        }
        await Promise.resolve();
        let response = await ky2._fetch();
        for (const hook of ky2._options.hooks.afterResponse) {
          const modifiedResponse = await hook(ky2.request, ky2._options, ky2._decorateResponse(response.clone()));
          if (modifiedResponse instanceof globalThis.Response) {
            response = modifiedResponse;
          }
        }
        ky2._decorateResponse(response);
        if (!response.ok && ky2._options.throwHttpErrors) {
          let error = new HTTPError(response, ky2.request, ky2._options);
          for (const hook of ky2._options.hooks.beforeError) {
            error = await hook(error);
          }
          throw error;
        }
        if (ky2._options.onDownloadProgress) {
          if (typeof ky2._options.onDownloadProgress !== "function") {
            throw new TypeError("The `onDownloadProgress` option must be a function");
          }
          if (!supportsResponseStreams) {
            throw new Error("Streams are not supported in your environment. `ReadableStream` is missing.");
          }
          return ky2._stream(response.clone(), ky2._options.onDownloadProgress);
        }
        return response;
      };
      const isRetriableMethod = ky2._options.retry.methods.includes(ky2.request.method.toLowerCase());
      const result = isRetriableMethod ? ky2._retry(function_) : function_();
      for (const [type, mimeType] of Object.entries(responseTypes)) {
        result[type] = async () => {
          ky2.request.headers.set("accept", ky2.request.headers.get("accept") || mimeType);
          const awaitedResult = await result;
          const response = awaitedResult.clone();
          if (type === "json") {
            if (response.status === 204) {
              return "";
            }
            const arrayBuffer = await response.clone().arrayBuffer();
            const responseSize = arrayBuffer.byteLength;
            if (responseSize === 0) {
              return "";
            }
            if (options.parseJson) {
              return options.parseJson(await response.text());
            }
          }
          return response[type]();
        };
      }
      return result;
    }
    // eslint-disable-next-line complexity
    constructor(input, options = {}) {
      Object.defineProperty(this, "request", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "abortController", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "_retryCount", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      });
      Object.defineProperty(this, "_input", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "_options", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      this._input = input;
      this._options = {
        // TODO: credentials can be removed when the spec change is implemented in all browsers. Context: https://www.chromestatus.com/feature/4539473312350208
        credentials: this._input.credentials || "same-origin",
        ...options,
        headers: mergeHeaders(this._input.headers, options.headers),
        hooks: deepMerge({
          beforeRequest: [],
          beforeRetry: [],
          beforeError: [],
          afterResponse: []
        }, options.hooks),
        method: normalizeRequestMethod(options.method ?? this._input.method),
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        prefixUrl: String(options.prefixUrl || ""),
        retry: normalizeRetryOptions(options.retry),
        throwHttpErrors: options.throwHttpErrors !== false,
        timeout: options.timeout ?? 1e4,
        fetch: options.fetch ?? globalThis.fetch.bind(globalThis)
      };
      if (typeof this._input !== "string" && !(this._input instanceof URL || this._input instanceof globalThis.Request)) {
        throw new TypeError("`input` must be a string, URL, or Request");
      }
      if (this._options.prefixUrl && typeof this._input === "string") {
        if (this._input.startsWith("/")) {
          throw new Error("`input` must not begin with a slash when using `prefixUrl`");
        }
        if (!this._options.prefixUrl.endsWith("/")) {
          this._options.prefixUrl += "/";
        }
        this._input = this._options.prefixUrl + this._input;
      }
      if (supportsAbortController) {
        this.abortController = new globalThis.AbortController();
        if (this._options.signal) {
          const originalSignal = this._options.signal;
          this._options.signal.addEventListener("abort", () => {
            this.abortController.abort(originalSignal.reason);
          });
        }
        this._options.signal = this.abortController.signal;
      }
      if (supportsRequestStreams) {
        this._options.duplex = "half";
      }
      this.request = new globalThis.Request(this._input, this._options);
      if (this._options.searchParams) {
        const textSearchParams = typeof this._options.searchParams === "string" ? this._options.searchParams.replace(/^\?/, "") : new URLSearchParams(this._options.searchParams).toString();
        const searchParams = "?" + textSearchParams;
        const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams);
        if ((supportsFormData && this._options.body instanceof globalThis.FormData || this._options.body instanceof URLSearchParams) && !(this._options.headers && this._options.headers["content-type"])) {
          this.request.headers.delete("content-type");
        }
        this.request = new globalThis.Request(new globalThis.Request(url, { ...this.request }), this._options);
      }
      if (this._options.json !== void 0) {
        this._options.body = JSON.stringify(this._options.json);
        this.request.headers.set("content-type", this._options.headers.get("content-type") ?? "application/json");
        this.request = new globalThis.Request(this.request, { body: this._options.body });
      }
    }
    _calculateRetryDelay(error) {
      this._retryCount++;
      if (this._retryCount <= this._options.retry.limit && !(error instanceof TimeoutError)) {
        if (error instanceof HTTPError) {
          if (!this._options.retry.statusCodes.includes(error.response.status)) {
            return 0;
          }
          const retryAfter = error.response.headers.get("Retry-After");
          if (retryAfter && this._options.retry.afterStatusCodes.includes(error.response.status)) {
            let after = Number(retryAfter);
            if (Number.isNaN(after)) {
              after = Date.parse(retryAfter) - Date.now();
            } else {
              after *= 1e3;
            }
            if (this._options.retry.maxRetryAfter !== void 0 && after > this._options.retry.maxRetryAfter) {
              return 0;
            }
            return after;
          }
          if (error.response.status === 413) {
            return 0;
          }
        }
        const retryDelay = this._options.retry.delay(this._retryCount);
        return Math.min(this._options.retry.backoffLimit, retryDelay);
      }
      return 0;
    }
    _decorateResponse(response) {
      if (this._options.parseJson) {
        response.json = async () => this._options.parseJson(await response.text());
      }
      return response;
    }
    async _retry(function_) {
      try {
        return await function_();
      } catch (error) {
        const ms = Math.min(this._calculateRetryDelay(error), maxSafeTimeout);
        if (ms !== 0 && this._retryCount > 0) {
          await delay(ms, { signal: this._options.signal });
          for (const hook of this._options.hooks.beforeRetry) {
            const hookResult = await hook({
              request: this.request,
              options: this._options,
              error,
              retryCount: this._retryCount
            });
            if (hookResult === stop) {
              return;
            }
          }
          return this._retry(function_);
        }
        throw error;
      }
    }
    async _fetch() {
      for (const hook of this._options.hooks.beforeRequest) {
        const result = await hook(this.request, this._options);
        if (result instanceof Request) {
          this.request = result;
          break;
        }
        if (result instanceof Response) {
          return result;
        }
      }
      const nonRequestOptions = findUnknownOptions(this.request, this._options);
      if (this._options.timeout === false) {
        return this._options.fetch(this.request.clone(), nonRequestOptions);
      }
      return timeout(this.request.clone(), nonRequestOptions, this.abortController, this._options);
    }
    /* istanbul ignore next */
    _stream(response, onDownloadProgress) {
      const totalBytes = Number(response.headers.get("content-length")) || 0;
      let transferredBytes = 0;
      if (response.status === 204) {
        if (onDownloadProgress) {
          onDownloadProgress({ percent: 1, totalBytes, transferredBytes }, new Uint8Array());
        }
        return new globalThis.Response(null, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      }
      return new globalThis.Response(new globalThis.ReadableStream({
        async start(controller) {
          const reader = response.body.getReader();
          if (onDownloadProgress) {
            onDownloadProgress({ percent: 0, transferredBytes: 0, totalBytes }, new Uint8Array());
          }
          async function read() {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              return;
            }
            if (onDownloadProgress) {
              transferredBytes += value.byteLength;
              const percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes;
              onDownloadProgress({ percent, transferredBytes, totalBytes }, value);
            }
            controller.enqueue(value);
            await read();
          }
          await read();
        }
      }), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    }
  }
  /*! MIT License © Sindre Sorhus */
  const createInstance = (defaults) => {
    const ky2 = (input, options) => Ky.create(input, validateAndMerge(defaults, options));
    for (const method of requestMethods) {
      ky2[method] = (input, options) => Ky.create(input, validateAndMerge(defaults, options, { method }));
    }
    ky2.create = (newDefaults) => createInstance(validateAndMerge(newDefaults));
    ky2.extend = (newDefaults) => createInstance(validateAndMerge(defaults, newDefaults));
    ky2.stop = stop;
    return ky2;
  };
  const ky = createInstance();
  const client = ky.create({
    prefixUrl: `${"https://back.kin-store.ru"}/api`
  });
  var PaymentStatus = /* @__PURE__ */ ((PaymentStatus2) => {
    PaymentStatus2["PAID"] = "PAID";
    PaymentStatus2["VOID"] = "VOID";
    PaymentStatus2["WAITING"] = "WAITING";
    PaymentStatus2["CREATED"] = "CREATED";
    PaymentStatus2["PROCESSING"] = "PROCESSING";
    PaymentStatus2["CANCELED"] = "CANCELED";
    PaymentStatus2["APPROVED"] = "APPROVED";
    return PaymentStatus2;
  })(PaymentStatus || {});
  const useCheckout = defineStore("checkout", {
    state: () => ({
      checkout: null,
      cart: null,
      error: null,
      isFetchingCart: false,
      isFetching: false,
      isDiscounting: false,
      checkoutId: null,
      isLoading: false
    }),
    getters: {
      total: (state2) => {
        var _a;
        return ((_a = state2.cart) == null ? void 0 : _a.total_price) ?? 0;
      },
      discount: (state2) => {
        var _a;
        return ((_a = state2.cart) == null ? void 0 : _a.total_discount) ?? 0;
      },
      hasDiscount: (state2) => {
        var _a, _b;
        return (_b = (_a = state2.cart) == null ? void 0 : _a.cart_level_discount_applications) == null ? void 0 : _b.find(
          (item) => item.type === "discount_code"
        );
      },
      isPaid: (state2) => {
        var _a, _b, _c, _d, _e2;
        if ([PaymentStatus.PAID, PaymentStatus.APPROVED].includes(
          (_b = (_a = state2.checkout) == null ? void 0 : _a.payment) == null ? void 0 : _b.status
        ))
          return true;
        if ((_c = state2.checkout) == null ? void 0 : _c.orderId)
          return true;
        if ([ICheckoutStatus.COMPLETED, ICheckoutStatus.PROCESS].includes(
          (_d = state2.checkout) == null ? void 0 : _d.status
        ) && ((_e2 = state2.checkout) == null ? void 0 : _e2.orderId))
          return true;
        return false;
      }
    },
    actions: {
      setCheckoutId(id) {
        this.checkoutId = id;
      },
      isMatch() {
        if (!this.checkout || !this.cart)
          return false;
        const amount = this.checkout.items.reduce(
          (acc, item) => acc += item.price * item.count,
          0
        );
        const cartAmount = this.cart.items.reduce(
          (acc, item) => acc += item.price * item.quantity,
          0
        );
        if (amount !== cartAmount)
          return false;
        if (this.checkout.items.length !== this.cart.items.length)
          for (const item of this.cart.items) {
            const hasInCheckout = this.checkout.items.find(
              (i) => i.variantId === `gid://Shopify/ProductVariant/${item.variant_id}`
            );
            if (!hasInCheckout)
              return false;
            if (item.quantity !== hasInCheckout.count)
              return false;
          }
        return true;
      },
      async clearDiscount() {
        this.isDiscounting = true;
        try {
          await ky.get("/discount/null");
          await ky.post("/cart/update.js", {
            json: {
              attributes: {
                discount: null
              }
            }
          });
          await this.fetchCart();
        } catch (err) {
          if (err.name === "HTTPError") {
            const errorJson = await err.response.json();
            this.error = errorJson;
            this.isFetching = false;
          } else {
            l.error(err.message ?? "Ошибка очистки промокода");
            this.isLoading = false;
          }
        }
        this.isDiscounting = false;
      },
      async appendDiscount(discount) {
        this.isDiscounting = true;
        try {
          await ky.get("/discount/" + discount);
          await ky.post("/cart/update.js", {
            json: {
              attributes: {
                discount
              }
            }
          });
          await this.fetchCart();
        } catch (err) {
          if (err.name === "HTTPError") {
            const errorJson = await err.response.json();
            this.error = errorJson;
            this.isFetching = false;
          } else {
            l.error(err.message ?? "Промокод не найден");
            this.isLoading = false;
          }
        }
        this.isDiscounting = false;
      },
      async toPayment(values, token) {
        this.isLoading = true;
        try {
          if (this.checkout && this.isMatch()) {
            await this.checkCart();
            const paymentResult = await client.post("cart/payment", {
              json: {
                _id: this.checkoutId,
                contacts: {
                  email: values.email,
                  phone: values.phone,
                  username: values.username
                },
                token,
                delivery: {
                  address: values.deliveryAddress,
                  type: values.deliveryType,
                  addressObject: values.deliveryObject
                },
                payment: values.paymentType,
                discountApplications: this.cart.cart_level_discount_applications
              }
            }).json();
            if (paymentResult == null ? void 0 : paymentResult.redirect) {
              this.isLoading = false;
              window.location.href = paymentResult.redirect;
            }
          } else {
            l.error(
              "Во время перехода к оплате возникла ошибка, попробуйте еще раз"
            );
          }
        } catch (err) {
          if (err.name === "HTTPError") {
            const errorJson = await err.response.json();
            this.error = errorJson;
            console.log("err", errorJson);
            this.isFetching = false;
          } else {
            console.trace(err);
            console.dir(err);
            l.error(err.message ?? "Возникла ошибка при оформлении заказа");
            this.isLoading = false;
          }
        }
      },
      async reCreate() {
        var _a, _b, _c;
        this.isFetching = true;
        if (!this.cart || ((_a = this.cart) == null ? void 0 : _a.items.length))
          return;
        console.log("ReCreate");
        try {
          const result = await client.post("cart", {
            json: {
              token: this.cart.token,
              codes: ((_b = this.cart.attributes) == null ? void 0 : _b.discount) ? [this.cart.attributes.discount] : [],
              items: this.cart.items.map((item) => {
                var _a2;
                return {
                  quantity: item.quantity,
                  price: item.price,
                  discount: item.original_price - item.discounted_price,
                  allocations: ((_a2 = item.line_level_discount_allocations) == null ? void 0 : _a2.length) ? item.line_level_discount_allocations : [],
                  title: item.title,
                  vendor: item.vendor,
                  product_title: item.product_title,
                  product_type: item.product_type,
                  size: item.variant_title,
                  image: item.featured_image,
                  description: item.product_description,
                  id: item.id,
                  variantId: "gid://shopify/ProductVariant/" + item.variant_id
                };
              })
            }
          }).json();
          console.log("create checkout response", result);
          if ((_c = result == null ? void 0 : result.object) == null ? void 0 : _c._id) {
            this.checkoutId = result.object._id;
            this.checkout = result.object;
            localStorage.setItem("checkout-id", result.object._id);
            const params = new URLSearchParams(window.location.search);
            params.set("id", result.object._id);
            window.location.search = "?" + params.toString();
            this.isFetching = false;
          }
          this.isFetching = false;
        } catch (err) {
          if (err.name === "HTTPError") {
            const errorJson = await err.response.json();
            this.error = errorJson;
            console.log("err", errorJson);
            this.isFetching = false;
          }
        }
      },
      async fetchCart() {
        this.cart = await ky.get("/cart.js").json();
        console.log("cart loaded");
      },
      setError(err) {
        this.error = err;
      },
      async fetchCheckout() {
        var _a, _b;
        const result = await client.get(`cart/${this.checkoutId}`).json();
        if ((_a = result == null ? void 0 : result.object) == null ? void 0 : _a._id) {
          this.checkout = result.object;
          if (this.checkout.isClosed) {
            return;
          }
          if (!this.isMatch()) {
            this.checkout = null;
            this.checkoutId = null;
            this.reCreate();
          } else if ([ICheckoutStatus.COMPLETED, ICheckoutStatus.PROCESS].includes(
            result.object.status
          )) {
            if (((_b = this.cart) == null ? void 0 : _b.token) === this.checkout.id) {
              localStorage.removeItem("checkout-id");
              document.cookie = document.cookie.split(";").filter((item) => {
                const [key] = item.split("=");
                return key.trim() !== "cart";
              }).join(";");
            }
          }
        }
      },
      async checkCart() {
        var _a;
        try {
          console.log("[checkCart]");
          await client.post("cart/check", {
            json: {
              items: (_a = this.cart) == null ? void 0 : _a.items.map((c2) => ({
                id: c2.id,
                product_type: c2.product_type,
                quantity: c2.quantity
              }))
            }
          });
        } catch (err) {
          if (err.name === "HTTPError") {
            const errorJson = await err.response.json();
            this.error = errorJson;
            console.log("[checkCart] error", errorJson);
          }
        }
        this.isFetching = false;
      },
      async loadCheckout() {
        var _a, _b, _c;
        this.isFetchingCart = true;
        await this.fetchCart();
        this.isFetching = true;
        this.isFetchingCart = false;
        if (this.checkoutId) {
          console.log("has checkoutId", this.checkoutId);
          try {
            await this.fetchCheckout();
            this.isFetching = false;
          } catch (err) {
            if (err.name === "HTTPError") {
              const errorJson = await err.response.json();
              this.error = errorJson;
              console.log("[loadCheckout] err on fetchCheckout", errorJson);
              if (errorJson.status === 400 && this.cart.items.length) {
                this.checkout = null;
                this.checkoutId = null;
                this.reCreate();
              } else {
                this.isFetching = false;
              }
            }
          }
        } else if ((_a = this.cart) == null ? void 0 : _a.items.length) {
          try {
            const result = await client.post("cart", {
              json: {
                token: this.cart.token,
                codes: ((_b = this.cart.attributes) == null ? void 0 : _b.discount) ? [this.cart.attributes.discount] : [],
                items: this.cart.items.map((item) => {
                  var _a2;
                  return {
                    quantity: item.quantity,
                    price: item.price,
                    discount: item.original_price - item.discounted_price,
                    allocations: ((_a2 = item.line_level_discount_allocations) == null ? void 0 : _a2.length) ? item.line_level_discount_allocations : [],
                    title: item.title,
                    vendor: item.vendor,
                    product_title: item.product_title,
                    product_type: item.product_type,
                    size: item.variant_title,
                    image: item.featured_image,
                    description: item.product_description,
                    id: item.id,
                    variantId: "gid://shopify/ProductVariant/" + item.variant_id
                  };
                })
              }
            }).json();
            console.log("create checkout response", result);
            if ((_c = result == null ? void 0 : result.object) == null ? void 0 : _c._id) {
              this.checkoutId = result.object._id;
              this.checkout = result.object;
              localStorage.setItem("checkout-id", result.object._id);
              const params = new URLSearchParams(window.location.search);
              params.set("id", result.object._id);
              window.location.search = "?" + params.toString();
              console.log("params", params.toString());
            }
          } catch (err) {
            if (err.name === "HTTPError") {
              const errorJson = await err.response.json();
              this.error = errorJson;
              console.log("[loadCheckout] err", errorJson);
              this.isFetching = false;
            }
          }
        }
        this.isFetching = false;
      }
    }
  });
  const useSettings = defineStore("settings", {
    state: () => ({
      paymentTypes: [],
      messages: null,
      isFetchingPaymentTypes: false,
      isFetchingSettings: false
    }),
    getters: {
      activePaymentTypes: (state) => state.paymentTypes.filter((p2) => p2.isActive)
    },
    actions: {
      async loadPaymentTypes() {
        this.isFetchingPaymentTypes = true;
        const result = await client.get("cart/payments").json();
        if ((result == null ? void 0 : result.array) && Array.isArray(result.array)) {
          this.paymentTypes = result.array;
        }
        this.isFetchingPaymentTypes = false;
      },
      async loadSettings() {
        this.isFetchingSettings = true;
        const result = await client.get("cart/messages").json();
        if (result == null ? void 0 : result.object) {
          this.messages = result.object.messages;
        }
        console.log("[loadSettings]", result == null ? void 0 : result.object);
        this.isFetchingSettings = false;
      }
    }
  });
  const _hoisted_1$l = { class: "t-min-h-[40vh] t-items-center t-justify-center t-flex t-flex-1 t-flex-col t-w-full" };
  const _hoisted_2$g = { class: "t-mt-auto t-flex t-flex-col t-pb-10 lg:t-pb-16 t-items-center" };
  const _hoisted_3$d = { class: "t-mb-10 lg:t-mb-16" };
  const _hoisted_4$c = /* @__PURE__ */ createBaseVNode("circle", {
    cx: "60",
    cy: "60",
    r: "60",
    fill: "#EDECE3",
    "fill-opacity": "0.4"
  }, null, -1);
  const _hoisted_5$c = /* @__PURE__ */ createBaseVNode("path", {
    d: "M45.1191 64.32L54.7191 73.92L78.7191 49.92",
    stroke: "#111827",
    "stroke-width": "3",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, null, -1);
  const _hoisted_6$9 = [
    _hoisted_4$c,
    _hoisted_5$c
  ];
  const _hoisted_7$7 = /* @__PURE__ */ createBaseVNode("circle", {
    cx: "60",
    cy: "60",
    r: "60",
    fill: "#EDECE3",
    "fill-opacity": "0.4"
  }, null, -1);
  const _hoisted_8$5 = /* @__PURE__ */ createBaseVNode("path", {
    d: "M74.5043 45.7044L45.7043 74.5044",
    stroke: "#111827",
    "stroke-width": "3",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, null, -1);
  const _hoisted_9$4 = /* @__PURE__ */ createBaseVNode("path", {
    d: "M45.7043 45.7044L74.5043 74.5044",
    stroke: "#111827",
    "stroke-width": "3",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, null, -1);
  const _hoisted_10$3 = [
    _hoisted_7$7,
    _hoisted_8$5,
    _hoisted_9$4
  ];
  const _hoisted_11$2 = { class: "t-text-[28px] lg:t-text-[48px] t-text-black t-mb-4 lg:t-mb-5" };
  const _hoisted_12$1 = { class: "t-text-base lg:t-text-[20px] t-text-black" };
  const _hoisted_13$1 = /* @__PURE__ */ createBaseVNode("a", { href: "/" }, "На главную", -1);
  const _hoisted_14 = /* @__PURE__ */ createBaseVNode("a", { href: "/cart" }, "В корзину", -1);
  const _sfc_main$b = /* @__PURE__ */ defineComponent({
    __name: "OrderResult",
    setup(__props) {
      const checkoutStore = useCheckout();
      const { isPaid, checkout } = storeToRefs(checkoutStore);
      const settingsStore = useSettings();
      const { messages } = storeToRefs(settingsStore);
      const reCreateCheckout = () => {
        checkoutStore.reCreate();
      };
      const statusText = computed(() => {
        var _a, _b, _c, _d;
        if (isPaid.value) {
          if (!messages.value)
            return;
          if ((_a = checkout.value) == null ? void 0 : _a.orderId) {
            return (_b = messages.value.paidStatusText) == null ? void 0 : _b.replace("{orderId}", checkout.value.orderId);
          }
          if (((_c = checkout.value) == null ? void 0 : _c.status) === ICheckoutStatus.PROCESS)
            return "Еще чуть-чуть";
          return messages.value.errorStatusText;
        } else {
          return (_d = messages.value) == null ? void 0 : _d.expiredStatusText;
        }
      });
      const descriptionText = computed(() => {
        var _a, _b, _c, _d;
        if (isPaid.value) {
          if (!messages.value)
            return;
          if ((_a = checkout.value) == null ? void 0 : _a.orderId) {
            return (_b = messages.value.paidDescriptionText) == null ? void 0 : _b.replace("{orderId}", checkout.value.orderId);
          }
          if (((_c = checkout.value) == null ? void 0 : _c.status) === ICheckoutStatus.PROCESS)
            return "Ваш заказ в процессе формирования, пожалуйста, подождите";
          return messages.value.errorDescriptionText;
        } else {
          return (_d = messages.value) == null ? void 0 : _d.expiredDescriptionText;
        }
      });
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$l, [
          createBaseVNode("div", _hoisted_2$g, [
            createBaseVNode("div", _hoisted_3$d, [
              (openBlock(), createElementBlock("svg", {
                class: normalizeClass(["lg:t-w-[15rem] lg:t-h-[15rem]", {
                  "hidden": !unref(checkoutStore).isPaid
                }]),
                width: "120",
                height: "120",
                viewBox: "0 0 120 120",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg"
              }, [..._hoisted_6$9], 2)),
              (openBlock(), createElementBlock("svg", {
                class: normalizeClass([{
                  "hidden": unref(checkoutStore).isPaid
                }, "lg:t-w-[15rem] lg:t-h-[15rem]"]),
                width: "120",
                height: "120",
                viewBox: "0 0 120 120",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg"
              }, [..._hoisted_10$3], 2))
            ]),
            unref(messages) ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createBaseVNode("div", _hoisted_11$2, toDisplayString(statusText.value), 1),
              createBaseVNode("div", _hoisted_12$1, toDisplayString(descriptionText.value), 1)
            ], 64)) : createCommentVNode("", true)
          ]),
          createBaseVNode("div", { class: "t-flex t-justify-center t-w-full t-mt-auto t-gap-4" }, [
            _hoisted_13$1,
            createBaseVNode("button", {
              type: "button",
              onClick: reCreateCheckout
            }, " Попробовать заново "),
            _hoisted_14
          ])
        ]);
      };
    }
  });
  const OrderResult = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__file", "C:/projects/geek-flow/kin/src/components/containers/OrderResult.vue"]]);
  /**
    * vee-validate v4.12.4
    * (c) 2023 Abdelrahman Awad
    * @license MIT
    */
  function isCallable(fn) {
    return typeof fn === "function";
  }
  function isNullOrUndefined(value) {
    return value === null || value === void 0;
  }
  const isObject$1 = (obj) => obj !== null && !!obj && typeof obj === "object" && !Array.isArray(obj);
  function isIndex(value) {
    return Number(value) >= 0;
  }
  function toNumber(value) {
    const n = parseFloat(value);
    return isNaN(n) ? value : n;
  }
  function isObjectLike(value) {
    return typeof value === "object" && value !== null;
  }
  function getTag(value) {
    if (value == null) {
      return value === void 0 ? "[object Undefined]" : "[object Null]";
    }
    return Object.prototype.toString.call(value);
  }
  function isPlainObject(value) {
    if (!isObjectLike(value) || getTag(value) !== "[object Object]") {
      return false;
    }
    if (Object.getPrototypeOf(value) === null) {
      return true;
    }
    let proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
  }
  function merge(target, source) {
    Object.keys(source).forEach((key) => {
      if (isPlainObject(source[key]) && isPlainObject(target[key])) {
        if (!target[key]) {
          target[key] = {};
        }
        merge(target[key], source[key]);
        return;
      }
      target[key] = source[key];
    });
    return target;
  }
  function normalizeFormPath(path) {
    const pathArr = path.split(".");
    if (!pathArr.length) {
      return "";
    }
    let fullPath = String(pathArr[0]);
    for (let i = 1; i < pathArr.length; i++) {
      if (isIndex(pathArr[i])) {
        fullPath += `[${pathArr[i]}]`;
        continue;
      }
      fullPath += `.${pathArr[i]}`;
    }
    return fullPath;
  }
  const RULES = {};
  function resolveRule(id) {
    return RULES[id];
  }
  function set(obj, key, val) {
    if (typeof val.value === "object")
      val.value = klona(val.value);
    if (!val.enumerable || val.get || val.set || !val.configurable || !val.writable || key === "__proto__") {
      Object.defineProperty(obj, key, val);
    } else
      obj[key] = val.value;
  }
  function klona(x2) {
    if (typeof x2 !== "object")
      return x2;
    var i = 0, k2, list, tmp, str = Object.prototype.toString.call(x2);
    if (str === "[object Object]") {
      tmp = Object.create(x2.__proto__ || null);
    } else if (str === "[object Array]") {
      tmp = Array(x2.length);
    } else if (str === "[object Set]") {
      tmp = /* @__PURE__ */ new Set();
      x2.forEach(function(val) {
        tmp.add(klona(val));
      });
    } else if (str === "[object Map]") {
      tmp = /* @__PURE__ */ new Map();
      x2.forEach(function(val, key) {
        tmp.set(klona(key), klona(val));
      });
    } else if (str === "[object Date]") {
      tmp = /* @__PURE__ */ new Date(+x2);
    } else if (str === "[object RegExp]") {
      tmp = new RegExp(x2.source, x2.flags);
    } else if (str === "[object DataView]") {
      tmp = new x2.constructor(klona(x2.buffer));
    } else if (str === "[object ArrayBuffer]") {
      tmp = x2.slice(0);
    } else if (str.slice(-6) === "Array]") {
      tmp = new x2.constructor(x2);
    }
    if (tmp) {
      for (list = Object.getOwnPropertySymbols(x2); i < list.length; i++) {
        set(tmp, list[i], Object.getOwnPropertyDescriptor(x2, list[i]));
      }
      for (i = 0, list = Object.getOwnPropertyNames(x2); i < list.length; i++) {
        if (Object.hasOwnProperty.call(tmp, k2 = list[i]) && tmp[k2] === x2[k2])
          continue;
        set(tmp, k2, Object.getOwnPropertyDescriptor(x2, k2));
      }
    }
    return tmp || x2;
  }
  const FormContextKey = Symbol("vee-validate-form");
  const FieldContextKey = Symbol("vee-validate-field-instance");
  const IS_ABSENT = Symbol("Default empty value");
  const isClient = typeof window !== "undefined";
  function isLocator(value) {
    return isCallable(value) && !!value.__locatorRef;
  }
  function isTypedSchema(value) {
    return !!value && isCallable(value.parse) && value.__type === "VVTypedSchema";
  }
  function isYupValidator(value) {
    return !!value && isCallable(value.validate);
  }
  function hasCheckedAttr(type) {
    return type === "checkbox" || type === "radio";
  }
  function isContainerValue(value) {
    return isObject$1(value) || Array.isArray(value);
  }
  function isEmptyContainer(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return isObject$1(value) && Object.keys(value).length === 0;
  }
  function isNotNestedPath(path) {
    return /^\[.+\]$/i.test(path);
  }
  function isNativeMultiSelect(el) {
    return isNativeSelect(el) && el.multiple;
  }
  function isNativeSelect(el) {
    return el.tagName === "SELECT";
  }
  function isNativeMultiSelectNode(tag, attrs) {
    const hasTruthyBindingValue = ![false, null, void 0, 0].includes(attrs.multiple) && !Number.isNaN(attrs.multiple);
    return tag === "select" && "multiple" in attrs && hasTruthyBindingValue;
  }
  function shouldHaveValueBinding(tag, attrs) {
    return !isNativeMultiSelectNode(tag, attrs) && attrs.type !== "file" && !hasCheckedAttr(attrs.type);
  }
  function isFormSubmitEvent(evt) {
    return isEvent(evt) && evt.target && "submit" in evt.target;
  }
  function isEvent(evt) {
    if (!evt) {
      return false;
    }
    if (typeof Event !== "undefined" && isCallable(Event) && evt instanceof Event) {
      return true;
    }
    if (evt && evt.srcElement) {
      return true;
    }
    return false;
  }
  function isPropPresent(obj, prop) {
    return prop in obj && obj[prop] !== IS_ABSENT;
  }
  function isEqual(a, b) {
    if (a === b)
      return true;
    if (a && b && typeof a === "object" && typeof b === "object") {
      if (a.constructor !== b.constructor)
        return false;
      var length, i, keys;
      if (Array.isArray(a)) {
        length = a.length;
        if (length != b.length)
          return false;
        for (i = length; i-- !== 0; )
          if (!isEqual(a[i], b[i]))
            return false;
        return true;
      }
      if (a instanceof Map && b instanceof Map) {
        if (a.size !== b.size)
          return false;
        for (i of a.entries())
          if (!b.has(i[0]))
            return false;
        for (i of a.entries())
          if (!isEqual(i[1], b.get(i[0])))
            return false;
        return true;
      }
      if (isFile(a) && isFile(b)) {
        if (a.size !== b.size)
          return false;
        if (a.name !== b.name)
          return false;
        if (a.lastModified !== b.lastModified)
          return false;
        if (a.type !== b.type)
          return false;
        return true;
      }
      if (a instanceof Set && b instanceof Set) {
        if (a.size !== b.size)
          return false;
        for (i of a.entries())
          if (!b.has(i[0]))
            return false;
        return true;
      }
      if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
        length = a.length;
        if (length != b.length)
          return false;
        for (i = length; i-- !== 0; )
          if (a[i] !== b[i])
            return false;
        return true;
      }
      if (a.constructor === RegExp)
        return a.source === b.source && a.flags === b.flags;
      if (a.valueOf !== Object.prototype.valueOf)
        return a.valueOf() === b.valueOf();
      if (a.toString !== Object.prototype.toString)
        return a.toString() === b.toString();
      keys = Object.keys(a);
      length = keys.length;
      for (i = length; i-- !== 0; ) {
        var key = keys[i];
        if (!isEqual(a[key], b[key]))
          return false;
      }
      return true;
    }
    return a !== a && b !== b;
  }
  function isFile(a) {
    if (!isClient) {
      return false;
    }
    return a instanceof File;
  }
  function cleanupNonNestedPath(path) {
    if (isNotNestedPath(path)) {
      return path.replace(/\[|\]/gi, "");
    }
    return path;
  }
  function getFromPath(object2, path, fallback) {
    if (!object2) {
      return fallback;
    }
    if (isNotNestedPath(path)) {
      return object2[cleanupNonNestedPath(path)];
    }
    const resolvedValue = (path || "").split(/\.|\[(\d+)\]/).filter(Boolean).reduce((acc, propKey) => {
      if (isContainerValue(acc) && propKey in acc) {
        return acc[propKey];
      }
      return fallback;
    }, object2);
    return resolvedValue;
  }
  function setInPath(object2, path, value) {
    if (isNotNestedPath(path)) {
      object2[cleanupNonNestedPath(path)] = value;
      return;
    }
    const keys = path.split(/\.|\[(\d+)\]/).filter(Boolean);
    let acc = object2;
    for (let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1) {
        acc[keys[i]] = value;
        return;
      }
      if (!(keys[i] in acc) || isNullOrUndefined(acc[keys[i]])) {
        acc[keys[i]] = isIndex(keys[i + 1]) ? [] : {};
      }
      acc = acc[keys[i]];
    }
  }
  function unset(object2, key) {
    if (Array.isArray(object2) && isIndex(key)) {
      object2.splice(Number(key), 1);
      return;
    }
    if (isObject$1(object2)) {
      delete object2[key];
    }
  }
  function unsetPath(object2, path) {
    if (isNotNestedPath(path)) {
      delete object2[cleanupNonNestedPath(path)];
      return;
    }
    const keys = path.split(/\.|\[(\d+)\]/).filter(Boolean);
    let acc = object2;
    for (let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1) {
        unset(acc, keys[i]);
        break;
      }
      if (!(keys[i] in acc) || isNullOrUndefined(acc[keys[i]])) {
        break;
      }
      acc = acc[keys[i]];
    }
    const pathValues = keys.map((_, idx) => {
      return getFromPath(object2, keys.slice(0, idx).join("."));
    });
    for (let i = pathValues.length - 1; i >= 0; i--) {
      if (!isEmptyContainer(pathValues[i])) {
        continue;
      }
      if (i === 0) {
        unset(object2, keys[0]);
        continue;
      }
      unset(pathValues[i - 1], keys[i - 1]);
    }
  }
  function keysOf(record) {
    return Object.keys(record);
  }
  function injectWithSelf(symbol, def2 = void 0) {
    const vm = getCurrentInstance();
    return (vm === null || vm === void 0 ? void 0 : vm.provides[symbol]) || inject(symbol, def2);
  }
  function resolveNextCheckboxValue(currentValue, checkedValue, uncheckedValue) {
    if (Array.isArray(currentValue)) {
      const newVal = [...currentValue];
      const idx = newVal.findIndex((v) => isEqual(v, checkedValue));
      idx >= 0 ? newVal.splice(idx, 1) : newVal.push(checkedValue);
      return newVal;
    }
    return isEqual(currentValue, checkedValue) ? uncheckedValue : checkedValue;
  }
  function debounceAsync(inner, ms = 0) {
    let timer = null;
    let resolves = [];
    return function(...args) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        const result = inner(...args);
        resolves.forEach((r2) => r2(result));
        resolves = [];
      }, ms);
      return new Promise((resolve2) => resolves.push(resolve2));
    };
  }
  function applyModelModifiers(value, modifiers) {
    if (!isObject$1(modifiers)) {
      return value;
    }
    if (modifiers.number) {
      return toNumber(value);
    }
    return value;
  }
  function withLatest(fn, onDone) {
    let latestRun;
    return async function runLatest(...args) {
      const pending = fn(...args);
      latestRun = pending;
      const result = await pending;
      if (pending !== latestRun) {
        return result;
      }
      latestRun = void 0;
      return onDone(result, args);
    };
  }
  function normalizeErrorItem(message) {
    return Array.isArray(message) ? message : message ? [message] : [];
  }
  function omit(obj, keys) {
    const target = {};
    for (const key in obj) {
      if (!keys.includes(key)) {
        target[key] = obj[key];
      }
    }
    return target;
  }
  function debounceNextTick(inner) {
    let lastTick = null;
    let resolves = [];
    return function(...args) {
      const thisTick = nextTick(() => {
        if (lastTick !== thisTick) {
          return;
        }
        const result = inner(...args);
        resolves.forEach((r2) => r2(result));
        resolves = [];
        lastTick = null;
      });
      lastTick = thisTick;
      return new Promise((resolve2) => resolves.push(resolve2));
    };
  }
  function normalizeChildren(tag, context, slotProps) {
    if (!context.slots.default) {
      return context.slots.default;
    }
    if (typeof tag === "string" || !tag) {
      return context.slots.default(slotProps());
    }
    return {
      default: () => {
        var _a, _b;
        return (_b = (_a = context.slots).default) === null || _b === void 0 ? void 0 : _b.call(_a, slotProps());
      }
    };
  }
  function getBoundValue(el) {
    if (hasValueBinding(el)) {
      return el._value;
    }
    return void 0;
  }
  function hasValueBinding(el) {
    return "_value" in el;
  }
  function parseInputValue(el) {
    if (el.type === "number") {
      return Number.isNaN(el.valueAsNumber) ? el.value : el.valueAsNumber;
    }
    if (el.type === "range") {
      return Number.isNaN(el.valueAsNumber) ? el.value : el.valueAsNumber;
    }
    return el.value;
  }
  function normalizeEventValue(value) {
    if (!isEvent(value)) {
      return value;
    }
    const input = value.target;
    if (hasCheckedAttr(input.type) && hasValueBinding(input)) {
      return getBoundValue(input);
    }
    if (input.type === "file" && input.files) {
      const files = Array.from(input.files);
      return input.multiple ? files : files[0];
    }
    if (isNativeMultiSelect(input)) {
      return Array.from(input.options).filter((opt) => opt.selected && !opt.disabled).map(getBoundValue);
    }
    if (isNativeSelect(input)) {
      const selectedOption = Array.from(input.options).find((opt) => opt.selected);
      return selectedOption ? getBoundValue(selectedOption) : input.value;
    }
    return parseInputValue(input);
  }
  function normalizeRules(rules) {
    const acc = {};
    Object.defineProperty(acc, "_$$isNormalized", {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });
    if (!rules) {
      return acc;
    }
    if (isObject$1(rules) && rules._$$isNormalized) {
      return rules;
    }
    if (isObject$1(rules)) {
      return Object.keys(rules).reduce((prev, curr) => {
        const params = normalizeParams(rules[curr]);
        if (rules[curr] !== false) {
          prev[curr] = buildParams(params);
        }
        return prev;
      }, acc);
    }
    if (typeof rules !== "string") {
      return acc;
    }
    return rules.split("|").reduce((prev, rule) => {
      const parsedRule = parseRule(rule);
      if (!parsedRule.name) {
        return prev;
      }
      prev[parsedRule.name] = buildParams(parsedRule.params);
      return prev;
    }, acc);
  }
  function normalizeParams(params) {
    if (params === true) {
      return [];
    }
    if (Array.isArray(params)) {
      return params;
    }
    if (isObject$1(params)) {
      return params;
    }
    return [params];
  }
  function buildParams(provided) {
    const mapValueToLocator = (value) => {
      if (typeof value === "string" && value[0] === "@") {
        return createLocator(value.slice(1));
      }
      return value;
    };
    if (Array.isArray(provided)) {
      return provided.map(mapValueToLocator);
    }
    if (provided instanceof RegExp) {
      return [provided];
    }
    return Object.keys(provided).reduce((prev, key) => {
      prev[key] = mapValueToLocator(provided[key]);
      return prev;
    }, {});
  }
  const parseRule = (rule) => {
    let params = [];
    const name = rule.split(":")[0];
    if (rule.includes(":")) {
      params = rule.split(":").slice(1).join(":").split(",");
    }
    return { name, params };
  };
  function createLocator(value) {
    const locator = (crossTable) => {
      const val = getFromPath(crossTable, value) || crossTable[value];
      return val;
    };
    locator.__locatorRef = value;
    return locator;
  }
  function extractLocators(params) {
    if (Array.isArray(params)) {
      return params.filter(isLocator);
    }
    return keysOf(params).filter((key) => isLocator(params[key])).map((key) => params[key]);
  }
  const DEFAULT_CONFIG = {
    generateMessage: ({ field }) => `${field} is not valid.`,
    bails: true,
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: false,
    validateOnModelUpdate: true
  };
  let currentConfig = Object.assign({}, DEFAULT_CONFIG);
  const getConfig = () => currentConfig;
  async function validate(value, rules, options = {}) {
    const shouldBail = options === null || options === void 0 ? void 0 : options.bails;
    const field = {
      name: (options === null || options === void 0 ? void 0 : options.name) || "{field}",
      rules,
      label: options === null || options === void 0 ? void 0 : options.label,
      bails: shouldBail !== null && shouldBail !== void 0 ? shouldBail : true,
      formData: (options === null || options === void 0 ? void 0 : options.values) || {}
    };
    const result = await _validate(field, value);
    const errors = result.errors;
    return {
      errors,
      valid: !errors.length
    };
  }
  async function _validate(field, value) {
    if (isTypedSchema(field.rules) || isYupValidator(field.rules)) {
      return validateFieldWithTypedSchema(value, field.rules);
    }
    if (isCallable(field.rules) || Array.isArray(field.rules)) {
      const ctx = {
        field: field.label || field.name,
        name: field.name,
        label: field.label,
        form: field.formData,
        value
      };
      const pipeline = Array.isArray(field.rules) ? field.rules : [field.rules];
      const length2 = pipeline.length;
      const errors2 = [];
      for (let i = 0; i < length2; i++) {
        const rule = pipeline[i];
        const result = await rule(value, ctx);
        const isValid = typeof result !== "string" && !Array.isArray(result) && result;
        if (isValid) {
          continue;
        }
        if (Array.isArray(result)) {
          errors2.push(...result);
        } else {
          const message = typeof result === "string" ? result : _generateFieldError(ctx);
          errors2.push(message);
        }
        if (field.bails) {
          return {
            errors: errors2
          };
        }
      }
      return {
        errors: errors2
      };
    }
    const normalizedContext = Object.assign(Object.assign({}, field), { rules: normalizeRules(field.rules) });
    const errors = [];
    const rulesKeys = Object.keys(normalizedContext.rules);
    const length = rulesKeys.length;
    for (let i = 0; i < length; i++) {
      const rule = rulesKeys[i];
      const result = await _test(normalizedContext, value, {
        name: rule,
        params: normalizedContext.rules[rule]
      });
      if (result.error) {
        errors.push(result.error);
        if (field.bails) {
          return {
            errors
          };
        }
      }
    }
    return {
      errors
    };
  }
  function isYupError(err) {
    return !!err && err.name === "ValidationError";
  }
  function yupToTypedSchema(yupSchema) {
    const schema = {
      __type: "VVTypedSchema",
      async parse(values) {
        var _a;
        try {
          const output = await yupSchema.validate(values, { abortEarly: false });
          return {
            output,
            errors: []
          };
        } catch (err) {
          if (!isYupError(err)) {
            throw err;
          }
          if (!((_a = err.inner) === null || _a === void 0 ? void 0 : _a.length) && err.errors.length) {
            return { errors: [{ path: err.path, errors: err.errors }] };
          }
          const errors = err.inner.reduce((acc, curr) => {
            const path = curr.path || "";
            if (!acc[path]) {
              acc[path] = { errors: [], path };
            }
            acc[path].errors.push(...curr.errors);
            return acc;
          }, {});
          return { errors: Object.values(errors) };
        }
      }
    };
    return schema;
  }
  async function validateFieldWithTypedSchema(value, schema) {
    const typedSchema = isTypedSchema(schema) ? schema : yupToTypedSchema(schema);
    const result = await typedSchema.parse(value);
    const messages = [];
    for (const error of result.errors) {
      if (error.errors.length) {
        messages.push(...error.errors);
      }
    }
    return {
      errors: messages
    };
  }
  async function _test(field, value, rule) {
    const validator = resolveRule(rule.name);
    if (!validator) {
      throw new Error(`No such validator '${rule.name}' exists.`);
    }
    const params = fillTargetValues(rule.params, field.formData);
    const ctx = {
      field: field.label || field.name,
      name: field.name,
      label: field.label,
      value,
      form: field.formData,
      rule: Object.assign(Object.assign({}, rule), { params })
    };
    const result = await validator(value, params, ctx);
    if (typeof result === "string") {
      return {
        error: result
      };
    }
    return {
      error: result ? void 0 : _generateFieldError(ctx)
    };
  }
  function _generateFieldError(fieldCtx) {
    const message = getConfig().generateMessage;
    if (!message) {
      return "Field is invalid";
    }
    return message(fieldCtx);
  }
  function fillTargetValues(params, crossTable) {
    const normalize = (value) => {
      if (isLocator(value)) {
        return value(crossTable);
      }
      return value;
    };
    if (Array.isArray(params)) {
      return params.map(normalize);
    }
    return Object.keys(params).reduce((acc, param) => {
      acc[param] = normalize(params[param]);
      return acc;
    }, {});
  }
  async function validateTypedSchema(schema, values) {
    const typedSchema = isTypedSchema(schema) ? schema : yupToTypedSchema(schema);
    const validationResult = await typedSchema.parse(klona(values));
    const results = {};
    const errors = {};
    for (const error of validationResult.errors) {
      const messages = error.errors;
      const path = (error.path || "").replace(/\["(\d+)"\]/g, (_, m) => {
        return `[${m}]`;
      });
      results[path] = { valid: !messages.length, errors: messages };
      if (messages.length) {
        errors[path] = messages[0];
      }
    }
    return {
      valid: !validationResult.errors.length,
      results,
      errors,
      values: validationResult.value
    };
  }
  async function validateObjectSchema(schema, values, opts) {
    const paths = keysOf(schema);
    const validations = paths.map(async (path) => {
      var _a, _b, _c;
      const strings = (_a = opts === null || opts === void 0 ? void 0 : opts.names) === null || _a === void 0 ? void 0 : _a[path];
      const fieldResult = await validate(getFromPath(values, path), schema[path], {
        name: (strings === null || strings === void 0 ? void 0 : strings.name) || path,
        label: strings === null || strings === void 0 ? void 0 : strings.label,
        values,
        bails: (_c = (_b = opts === null || opts === void 0 ? void 0 : opts.bailsMap) === null || _b === void 0 ? void 0 : _b[path]) !== null && _c !== void 0 ? _c : true
      });
      return Object.assign(Object.assign({}, fieldResult), { path });
    });
    let isAllValid = true;
    const validationResults = await Promise.all(validations);
    const results = {};
    const errors = {};
    for (const result of validationResults) {
      results[result.path] = {
        valid: result.valid,
        errors: result.errors
      };
      if (!result.valid) {
        isAllValid = false;
        errors[result.path] = result.errors[0];
      }
    }
    return {
      valid: isAllValid,
      results,
      errors
    };
  }
  let ID_COUNTER = 0;
  function useFieldState(path, init) {
    const { value, initialValue, setInitialValue } = _useFieldValue(path, init.modelValue, init.form);
    if (!init.form) {
      let setState2 = function(state2) {
        var _a;
        if ("value" in state2) {
          value.value = state2.value;
        }
        if ("errors" in state2) {
          setErrors(state2.errors);
        }
        if ("touched" in state2) {
          meta.touched = (_a = state2.touched) !== null && _a !== void 0 ? _a : meta.touched;
        }
        if ("initialValue" in state2) {
          setInitialValue(state2.initialValue);
        }
      };
      const { errors: errors2, setErrors } = createFieldErrors();
      const id = ID_COUNTER >= Number.MAX_SAFE_INTEGER ? 0 : ++ID_COUNTER;
      const meta = createFieldMeta(value, initialValue, errors2, init.schema);
      return {
        id,
        path,
        value,
        initialValue,
        meta,
        flags: { pendingUnmount: { [id]: false }, pendingReset: false },
        errors: errors2,
        setState: setState2
      };
    }
    const state = init.form.createPathState(path, {
      bails: init.bails,
      label: init.label,
      type: init.type,
      validate: init.validate,
      schema: init.schema
    });
    const errors = computed(() => state.errors);
    function setState(state2) {
      var _a, _b, _c;
      if ("value" in state2) {
        value.value = state2.value;
      }
      if ("errors" in state2) {
        (_a = init.form) === null || _a === void 0 ? void 0 : _a.setFieldError(unref(path), state2.errors);
      }
      if ("touched" in state2) {
        (_b = init.form) === null || _b === void 0 ? void 0 : _b.setFieldTouched(unref(path), (_c = state2.touched) !== null && _c !== void 0 ? _c : false);
      }
      if ("initialValue" in state2) {
        setInitialValue(state2.initialValue);
      }
    }
    return {
      id: Array.isArray(state.id) ? state.id[state.id.length - 1] : state.id,
      path,
      value,
      errors,
      meta: state,
      initialValue,
      flags: state.__flags,
      setState
    };
  }
  function _useFieldValue(path, modelValue, form) {
    const modelRef = ref(unref(modelValue));
    function resolveInitialValue2() {
      if (!form) {
        return unref(modelRef);
      }
      return getFromPath(form.initialValues.value, unref(path), unref(modelRef));
    }
    function setInitialValue(value2) {
      if (!form) {
        modelRef.value = value2;
        return;
      }
      form.setFieldInitialValue(unref(path), value2, true);
    }
    const initialValue = computed(resolveInitialValue2);
    if (!form) {
      const value2 = ref(resolveInitialValue2());
      return {
        value: value2,
        initialValue,
        setInitialValue
      };
    }
    const currentValue = resolveModelValue(modelValue, form, initialValue, path);
    form.stageInitialValue(unref(path), currentValue, true);
    const value = computed({
      get() {
        return getFromPath(form.values, unref(path));
      },
      set(newVal) {
        form.setFieldValue(unref(path), newVal, false);
      }
    });
    return {
      value,
      initialValue,
      setInitialValue
    };
  }
  function resolveModelValue(modelValue, form, initialValue, path) {
    if (isRef(modelValue)) {
      return unref(modelValue);
    }
    if (modelValue !== void 0) {
      return modelValue;
    }
    return getFromPath(form.values, unref(path), unref(initialValue));
  }
  function createFieldMeta(currentValue, initialValue, errors, schema) {
    var _a, _b;
    const isRequired = (_b = (_a = schema === null || schema === void 0 ? void 0 : schema.describe) === null || _a === void 0 ? void 0 : _a.call(schema).required) !== null && _b !== void 0 ? _b : false;
    const meta = reactive({
      touched: false,
      pending: false,
      valid: true,
      required: isRequired,
      validated: !!unref(errors).length,
      initialValue: computed(() => unref(initialValue)),
      dirty: computed(() => {
        return !isEqual(unref(currentValue), unref(initialValue));
      })
    });
    watch(errors, (value) => {
      meta.valid = !value.length;
    }, {
      immediate: true,
      flush: "sync"
    });
    return meta;
  }
  function createFieldErrors() {
    const errors = ref([]);
    return {
      errors,
      setErrors: (messages) => {
        errors.value = normalizeErrorItem(messages);
      }
    };
  }
  function useField(path, rules, opts) {
    if (hasCheckedAttr(opts === null || opts === void 0 ? void 0 : opts.type)) {
      return useFieldWithChecked(path, rules, opts);
    }
    return _useField(path, rules, opts);
  }
  function _useField(path, rules, opts) {
    const { initialValue: modelValue, validateOnMount, bails, type, checkedValue, label, validateOnValueUpdate, uncheckedValue, controlled, keepValueOnUnmount, syncVModel, form: controlForm } = normalizeOptions(opts);
    const injectedForm = controlled ? injectWithSelf(FormContextKey) : void 0;
    const form = controlForm || injectedForm;
    const name = computed(() => normalizeFormPath(toValue(path)));
    const validator = computed(() => {
      const schema = toValue(form === null || form === void 0 ? void 0 : form.schema);
      if (schema) {
        return void 0;
      }
      const rulesValue = unref(rules);
      if (isYupValidator(rulesValue) || isTypedSchema(rulesValue) || isCallable(rulesValue) || Array.isArray(rulesValue)) {
        return rulesValue;
      }
      return normalizeRules(rulesValue);
    });
    const { id, value, initialValue, meta, setState, errors, flags } = useFieldState(name, {
      modelValue,
      form,
      bails,
      label,
      type,
      validate: validator.value ? validate$1 : void 0,
      schema: isTypedSchema(rules) ? rules : void 0
    });
    const errorMessage = computed(() => errors.value[0]);
    if (syncVModel) {
      useVModel({
        value,
        prop: syncVModel,
        handleChange,
        shouldValidate: () => validateOnValueUpdate && !flags.pendingReset
      });
    }
    const handleBlur = (evt, shouldValidate = false) => {
      meta.touched = true;
      if (shouldValidate) {
        validateWithStateMutation();
      }
    };
    async function validateCurrentValue(mode) {
      var _a, _b;
      if (form === null || form === void 0 ? void 0 : form.validateSchema) {
        const { results } = await form.validateSchema(mode);
        return (_a = results[toValue(name)]) !== null && _a !== void 0 ? _a : { valid: true, errors: [] };
      }
      if (validator.value) {
        return validate(value.value, validator.value, {
          name: toValue(name),
          label: toValue(label),
          values: (_b = form === null || form === void 0 ? void 0 : form.values) !== null && _b !== void 0 ? _b : {},
          bails
        });
      }
      return { valid: true, errors: [] };
    }
    const validateWithStateMutation = withLatest(async () => {
      meta.pending = true;
      meta.validated = true;
      return validateCurrentValue("validated-only");
    }, (result) => {
      if (flags.pendingUnmount[field.id]) {
        return result;
      }
      setState({ errors: result.errors });
      meta.pending = false;
      meta.valid = result.valid;
      return result;
    });
    const validateValidStateOnly = withLatest(async () => {
      return validateCurrentValue("silent");
    }, (result) => {
      meta.valid = result.valid;
      return result;
    });
    function validate$1(opts2) {
      if ((opts2 === null || opts2 === void 0 ? void 0 : opts2.mode) === "silent") {
        return validateValidStateOnly();
      }
      return validateWithStateMutation();
    }
    function handleChange(e, shouldValidate = true) {
      const newValue = normalizeEventValue(e);
      setValue(newValue, shouldValidate);
    }
    onMounted(() => {
      if (validateOnMount) {
        return validateWithStateMutation();
      }
      if (!form || !form.validateSchema) {
        validateValidStateOnly();
      }
    });
    function setTouched(isTouched) {
      meta.touched = isTouched;
    }
    function resetField(state) {
      var _a;
      const newValue = state && "value" in state ? state.value : initialValue.value;
      setState({
        value: klona(newValue),
        initialValue: klona(newValue),
        touched: (_a = state === null || state === void 0 ? void 0 : state.touched) !== null && _a !== void 0 ? _a : false,
        errors: (state === null || state === void 0 ? void 0 : state.errors) || []
      });
      meta.pending = false;
      meta.validated = false;
      validateValidStateOnly();
    }
    const vm = getCurrentInstance();
    function setValue(newValue, shouldValidate = true) {
      value.value = vm && syncVModel ? applyModelModifiers(newValue, vm.props.modelModifiers) : newValue;
      const validateFn = shouldValidate ? validateWithStateMutation : validateValidStateOnly;
      validateFn();
    }
    function setErrors(errors2) {
      setState({ errors: Array.isArray(errors2) ? errors2 : [errors2] });
    }
    const valueProxy = computed({
      get() {
        return value.value;
      },
      set(newValue) {
        setValue(newValue, validateOnValueUpdate);
      }
    });
    const field = {
      id,
      name,
      label,
      value: valueProxy,
      meta,
      errors,
      errorMessage,
      type,
      checkedValue,
      uncheckedValue,
      bails,
      keepValueOnUnmount,
      resetField,
      handleReset: () => resetField(),
      validate: validate$1,
      handleChange,
      handleBlur,
      setState,
      setTouched,
      setErrors,
      setValue
    };
    provide(FieldContextKey, field);
    if (isRef(rules) && typeof unref(rules) !== "function") {
      watch(rules, (value2, oldValue) => {
        if (isEqual(value2, oldValue)) {
          return;
        }
        meta.validated ? validateWithStateMutation() : validateValidStateOnly();
      }, {
        deep: true
      });
    }
    if (!form) {
      return field;
    }
    const dependencies = computed(() => {
      const rulesVal = validator.value;
      if (!rulesVal || isCallable(rulesVal) || isYupValidator(rulesVal) || isTypedSchema(rulesVal) || Array.isArray(rulesVal)) {
        return {};
      }
      return Object.keys(rulesVal).reduce((acc, rule) => {
        const deps = extractLocators(rulesVal[rule]).map((dep) => dep.__locatorRef).reduce((depAcc, depName) => {
          const depValue = getFromPath(form.values, depName) || form.values[depName];
          if (depValue !== void 0) {
            depAcc[depName] = depValue;
          }
          return depAcc;
        }, {});
        Object.assign(acc, deps);
        return acc;
      }, {});
    });
    watch(dependencies, (deps, oldDeps) => {
      if (!Object.keys(deps).length) {
        return;
      }
      const shouldValidate = !isEqual(deps, oldDeps);
      if (shouldValidate) {
        meta.validated ? validateWithStateMutation() : validateValidStateOnly();
      }
    });
    onBeforeUnmount(() => {
      var _a;
      const shouldKeepValue = (_a = toValue(field.keepValueOnUnmount)) !== null && _a !== void 0 ? _a : toValue(form.keepValuesOnUnmount);
      const path2 = toValue(name);
      if (shouldKeepValue || !form || flags.pendingUnmount[field.id]) {
        form === null || form === void 0 ? void 0 : form.removePathState(path2, id);
        return;
      }
      flags.pendingUnmount[field.id] = true;
      const pathState = form.getPathState(path2);
      const matchesId = Array.isArray(pathState === null || pathState === void 0 ? void 0 : pathState.id) && (pathState === null || pathState === void 0 ? void 0 : pathState.multiple) ? pathState === null || pathState === void 0 ? void 0 : pathState.id.includes(field.id) : (pathState === null || pathState === void 0 ? void 0 : pathState.id) === field.id;
      if (!matchesId) {
        return;
      }
      if ((pathState === null || pathState === void 0 ? void 0 : pathState.multiple) && Array.isArray(pathState.value)) {
        const valueIdx = pathState.value.findIndex((i) => isEqual(i, toValue(field.checkedValue)));
        if (valueIdx > -1) {
          const newVal = [...pathState.value];
          newVal.splice(valueIdx, 1);
          form.setFieldValue(path2, newVal);
        }
        if (Array.isArray(pathState.id)) {
          pathState.id.splice(pathState.id.indexOf(field.id), 1);
        }
      } else {
        form.unsetPathValue(toValue(name));
      }
      form.removePathState(path2, id);
    });
    return field;
  }
  function normalizeOptions(opts) {
    const defaults = () => ({
      initialValue: void 0,
      validateOnMount: false,
      bails: true,
      label: void 0,
      validateOnValueUpdate: true,
      keepValueOnUnmount: void 0,
      syncVModel: false,
      controlled: true
    });
    const isVModelSynced = !!(opts === null || opts === void 0 ? void 0 : opts.syncVModel);
    const modelPropName = typeof (opts === null || opts === void 0 ? void 0 : opts.syncVModel) === "string" ? opts.syncVModel : (opts === null || opts === void 0 ? void 0 : opts.modelPropName) || "modelValue";
    const initialValue = isVModelSynced && !("initialValue" in (opts || {})) ? getCurrentModelValue(getCurrentInstance(), modelPropName) : opts === null || opts === void 0 ? void 0 : opts.initialValue;
    if (!opts) {
      return Object.assign(Object.assign({}, defaults()), { initialValue });
    }
    const checkedValue = "valueProp" in opts ? opts.valueProp : opts.checkedValue;
    const controlled = "standalone" in opts ? !opts.standalone : opts.controlled;
    const syncVModel = (opts === null || opts === void 0 ? void 0 : opts.modelPropName) || (opts === null || opts === void 0 ? void 0 : opts.syncVModel) || false;
    return Object.assign(Object.assign(Object.assign({}, defaults()), opts || {}), {
      initialValue,
      controlled: controlled !== null && controlled !== void 0 ? controlled : true,
      checkedValue,
      syncVModel
    });
  }
  function useFieldWithChecked(name, rules, opts) {
    const form = !(opts === null || opts === void 0 ? void 0 : opts.standalone) ? injectWithSelf(FormContextKey) : void 0;
    const checkedValue = opts === null || opts === void 0 ? void 0 : opts.checkedValue;
    const uncheckedValue = opts === null || opts === void 0 ? void 0 : opts.uncheckedValue;
    function patchCheckedApi(field) {
      const handleChange = field.handleChange;
      const checked = computed(() => {
        const currentValue = toValue(field.value);
        const checkedVal = toValue(checkedValue);
        return Array.isArray(currentValue) ? currentValue.findIndex((v) => isEqual(v, checkedVal)) >= 0 : isEqual(checkedVal, currentValue);
      });
      function handleCheckboxChange(e, shouldValidate = true) {
        var _a, _b;
        if (checked.value === ((_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.checked)) {
          if (shouldValidate) {
            field.validate();
          }
          return;
        }
        const path = toValue(name);
        const pathState = form === null || form === void 0 ? void 0 : form.getPathState(path);
        const value = normalizeEventValue(e);
        let newValue = (_b = toValue(checkedValue)) !== null && _b !== void 0 ? _b : value;
        if (form && (pathState === null || pathState === void 0 ? void 0 : pathState.multiple) && pathState.type === "checkbox") {
          newValue = resolveNextCheckboxValue(getFromPath(form.values, path) || [], newValue, void 0);
        } else if ((opts === null || opts === void 0 ? void 0 : opts.type) === "checkbox") {
          newValue = resolveNextCheckboxValue(toValue(field.value), newValue, toValue(uncheckedValue));
        }
        handleChange(newValue, shouldValidate);
      }
      return Object.assign(Object.assign({}, field), {
        checked,
        checkedValue,
        uncheckedValue,
        handleChange: handleCheckboxChange
      });
    }
    return patchCheckedApi(_useField(name, rules, opts));
  }
  function useVModel({ prop, value, handleChange, shouldValidate }) {
    const vm = getCurrentInstance();
    if (!vm || !prop) {
      return;
    }
    const propName = typeof prop === "string" ? prop : "modelValue";
    const emitName = `update:${propName}`;
    if (!(propName in vm.props)) {
      return;
    }
    watch(value, (newValue) => {
      if (isEqual(newValue, getCurrentModelValue(vm, propName))) {
        return;
      }
      vm.emit(emitName, newValue);
    });
    watch(() => getCurrentModelValue(vm, propName), (propValue) => {
      if (propValue === IS_ABSENT && value.value === void 0) {
        return;
      }
      const newValue = propValue === IS_ABSENT ? void 0 : propValue;
      if (isEqual(newValue, value.value)) {
        return;
      }
      handleChange(newValue, shouldValidate());
    });
  }
  function getCurrentModelValue(vm, propName) {
    if (!vm) {
      return void 0;
    }
    return vm.props[propName];
  }
  const FieldImpl = /* @__PURE__ */ defineComponent({
    name: "Field",
    inheritAttrs: false,
    props: {
      as: {
        type: [String, Object],
        default: void 0
      },
      name: {
        type: String,
        required: true
      },
      rules: {
        type: [Object, String, Function],
        default: void 0
      },
      validateOnMount: {
        type: Boolean,
        default: false
      },
      validateOnBlur: {
        type: Boolean,
        default: void 0
      },
      validateOnChange: {
        type: Boolean,
        default: void 0
      },
      validateOnInput: {
        type: Boolean,
        default: void 0
      },
      validateOnModelUpdate: {
        type: Boolean,
        default: void 0
      },
      bails: {
        type: Boolean,
        default: () => getConfig().bails
      },
      label: {
        type: String,
        default: void 0
      },
      uncheckedValue: {
        type: null,
        default: void 0
      },
      modelValue: {
        type: null,
        default: IS_ABSENT
      },
      modelModifiers: {
        type: null,
        default: () => ({})
      },
      "onUpdate:modelValue": {
        type: null,
        default: void 0
      },
      standalone: {
        type: Boolean,
        default: false
      },
      keepValue: {
        type: Boolean,
        default: void 0
      }
    },
    setup(props, ctx) {
      const rules = toRef(props, "rules");
      const name = toRef(props, "name");
      const label = toRef(props, "label");
      const uncheckedValue = toRef(props, "uncheckedValue");
      const keepValue = toRef(props, "keepValue");
      const { errors, value, errorMessage, validate: validateField, handleChange, handleBlur, setTouched, resetField, handleReset, meta, checked, setErrors } = useField(name, rules, {
        validateOnMount: props.validateOnMount,
        bails: props.bails,
        standalone: props.standalone,
        type: ctx.attrs.type,
        initialValue: resolveInitialValue(props, ctx),
        // Only for checkboxes and radio buttons
        checkedValue: ctx.attrs.value,
        uncheckedValue,
        label,
        validateOnValueUpdate: props.validateOnModelUpdate,
        keepValueOnUnmount: keepValue,
        syncVModel: true
      });
      const onChangeHandler = function handleChangeWithModel(e, shouldValidate = true) {
        handleChange(e, shouldValidate);
      };
      const sharedProps = computed(() => {
        const { validateOnInput, validateOnChange, validateOnBlur, validateOnModelUpdate } = resolveValidationTriggers(props);
        function baseOnBlur(e) {
          handleBlur(e, validateOnBlur);
          if (isCallable(ctx.attrs.onBlur)) {
            ctx.attrs.onBlur(e);
          }
        }
        function baseOnInput(e) {
          onChangeHandler(e, validateOnInput);
          if (isCallable(ctx.attrs.onInput)) {
            ctx.attrs.onInput(e);
          }
        }
        function baseOnChange(e) {
          onChangeHandler(e, validateOnChange);
          if (isCallable(ctx.attrs.onChange)) {
            ctx.attrs.onChange(e);
          }
        }
        const attrs = {
          name: props.name,
          onBlur: baseOnBlur,
          onInput: baseOnInput,
          onChange: baseOnChange
        };
        attrs["onUpdate:modelValue"] = (e) => onChangeHandler(e, validateOnModelUpdate);
        return attrs;
      });
      const fieldProps = computed(() => {
        const attrs = Object.assign({}, sharedProps.value);
        if (hasCheckedAttr(ctx.attrs.type) && checked) {
          attrs.checked = checked.value;
        }
        const tag = resolveTag(props, ctx);
        if (shouldHaveValueBinding(tag, ctx.attrs)) {
          attrs.value = value.value;
        }
        return attrs;
      });
      const componentProps = computed(() => {
        return Object.assign(Object.assign({}, sharedProps.value), { modelValue: value.value });
      });
      function slotProps() {
        return {
          field: fieldProps.value,
          componentField: componentProps.value,
          value: value.value,
          meta,
          errors: errors.value,
          errorMessage: errorMessage.value,
          validate: validateField,
          resetField,
          handleChange: onChangeHandler,
          handleInput: (e) => onChangeHandler(e, false),
          handleReset,
          handleBlur: sharedProps.value.onBlur,
          setTouched,
          setErrors
        };
      }
      ctx.expose({
        value,
        meta,
        errors,
        errorMessage,
        setErrors,
        setTouched,
        reset: resetField,
        validate: validateField,
        handleChange
      });
      return () => {
        const tag = resolveDynamicComponent(resolveTag(props, ctx));
        const children = normalizeChildren(tag, ctx, slotProps);
        if (tag) {
          return h(tag, Object.assign(Object.assign({}, ctx.attrs), fieldProps.value), children);
        }
        return children;
      };
    }
  });
  function resolveTag(props, ctx) {
    let tag = props.as || "";
    if (!props.as && !ctx.slots.default) {
      tag = "input";
    }
    return tag;
  }
  function resolveValidationTriggers(props) {
    var _a, _b, _c, _d;
    const { validateOnInput, validateOnChange, validateOnBlur, validateOnModelUpdate } = getConfig();
    return {
      validateOnInput: (_a = props.validateOnInput) !== null && _a !== void 0 ? _a : validateOnInput,
      validateOnChange: (_b = props.validateOnChange) !== null && _b !== void 0 ? _b : validateOnChange,
      validateOnBlur: (_c = props.validateOnBlur) !== null && _c !== void 0 ? _c : validateOnBlur,
      validateOnModelUpdate: (_d = props.validateOnModelUpdate) !== null && _d !== void 0 ? _d : validateOnModelUpdate
    };
  }
  function resolveInitialValue(props, ctx) {
    if (!hasCheckedAttr(ctx.attrs.type)) {
      return isPropPresent(props, "modelValue") ? props.modelValue : ctx.attrs.value;
    }
    return isPropPresent(props, "modelValue") ? props.modelValue : void 0;
  }
  const Field = FieldImpl;
  let FORM_COUNTER = 0;
  const PRIVATE_PATH_STATE_KEYS = ["bails", "fieldsCount", "id", "multiple", "type", "validate"];
  function resolveInitialValues(opts) {
    const providedValues = Object.assign({}, toValue((opts === null || opts === void 0 ? void 0 : opts.initialValues) || {}));
    const schema = unref(opts === null || opts === void 0 ? void 0 : opts.validationSchema);
    if (schema && isTypedSchema(schema) && isCallable(schema.cast)) {
      return klona(schema.cast(providedValues) || {});
    }
    return klona(providedValues);
  }
  function useForm(opts) {
    var _a;
    const formId = FORM_COUNTER++;
    let FIELD_ID_COUNTER = 0;
    const isSubmitting = ref(false);
    const isValidating = ref(false);
    const submitCount = ref(0);
    const fieldArrays = [];
    const formValues = reactive(resolveInitialValues(opts));
    const pathStates = ref([]);
    const extraErrorsBag = ref({});
    const pathStateLookup = ref({});
    const rebuildPathLookup = debounceNextTick(() => {
      pathStateLookup.value = pathStates.value.reduce((names, state) => {
        names[normalizeFormPath(toValue(state.path))] = state;
        return names;
      }, {});
    });
    function setFieldError2(field, message) {
      const state = findPathState(field);
      if (!state) {
        if (typeof field === "string") {
          extraErrorsBag.value[normalizeFormPath(field)] = normalizeErrorItem(message);
        }
        return;
      }
      if (typeof field === "string") {
        const normalizedPath = normalizeFormPath(field);
        if (extraErrorsBag.value[normalizedPath]) {
          delete extraErrorsBag.value[normalizedPath];
        }
      }
      state.errors = normalizeErrorItem(message);
      state.valid = !state.errors.length;
    }
    function setErrors(paths) {
      keysOf(paths).forEach((path) => {
        setFieldError2(path, paths[path]);
      });
    }
    if (opts === null || opts === void 0 ? void 0 : opts.initialErrors) {
      setErrors(opts.initialErrors);
    }
    const errorBag = computed(() => {
      const pathErrors = pathStates.value.reduce((acc, state) => {
        if (state.errors.length) {
          acc[state.path] = state.errors;
        }
        return acc;
      }, {});
      return Object.assign(Object.assign({}, extraErrorsBag.value), pathErrors);
    });
    const errors = computed(() => {
      return keysOf(errorBag.value).reduce((acc, key) => {
        const errors2 = errorBag.value[key];
        if (errors2 === null || errors2 === void 0 ? void 0 : errors2.length) {
          acc[key] = errors2[0];
        }
        return acc;
      }, {});
    });
    const fieldNames = computed(() => {
      return pathStates.value.reduce((names, state) => {
        names[state.path] = { name: state.path || "", label: state.label || "" };
        return names;
      }, {});
    });
    const fieldBailsMap = computed(() => {
      return pathStates.value.reduce((map, state) => {
        var _a2;
        map[state.path] = (_a2 = state.bails) !== null && _a2 !== void 0 ? _a2 : true;
        return map;
      }, {});
    });
    const initialErrors = Object.assign({}, (opts === null || opts === void 0 ? void 0 : opts.initialErrors) || {});
    const keepValuesOnUnmount = (_a = opts === null || opts === void 0 ? void 0 : opts.keepValuesOnUnmount) !== null && _a !== void 0 ? _a : false;
    const { initialValues, originalInitialValues, setInitialValues } = useFormInitialValues(pathStates, formValues, opts);
    const meta = useFormMeta(pathStates, formValues, originalInitialValues, errors);
    const controlledValues = computed(() => {
      return pathStates.value.reduce((acc, state) => {
        const value = getFromPath(formValues, state.path);
        setInPath(acc, state.path, value);
        return acc;
      }, {});
    });
    const schema = opts === null || opts === void 0 ? void 0 : opts.validationSchema;
    function createPathState(path, config) {
      var _a2, _b;
      const initialValue = computed(() => getFromPath(initialValues.value, toValue(path)));
      const pathStateExists = pathStateLookup.value[toValue(path)];
      const isCheckboxOrRadio = (config === null || config === void 0 ? void 0 : config.type) === "checkbox" || (config === null || config === void 0 ? void 0 : config.type) === "radio";
      if (pathStateExists && isCheckboxOrRadio) {
        pathStateExists.multiple = true;
        const id2 = FIELD_ID_COUNTER++;
        if (Array.isArray(pathStateExists.id)) {
          pathStateExists.id.push(id2);
        } else {
          pathStateExists.id = [pathStateExists.id, id2];
        }
        pathStateExists.fieldsCount++;
        pathStateExists.__flags.pendingUnmount[id2] = false;
        return pathStateExists;
      }
      const currentValue = computed(() => getFromPath(formValues, toValue(path)));
      const pathValue = toValue(path);
      const unsetBatchIndex = UNSET_BATCH.findIndex((_path) => _path === pathValue);
      if (unsetBatchIndex !== -1) {
        UNSET_BATCH.splice(unsetBatchIndex, 1);
      }
      const isRequired = computed(() => {
        var _a3, _b2, _c, _d, _e2, _f;
        if (isTypedSchema(schema)) {
          return (_c = (_b2 = (_a3 = schema).describe) === null || _b2 === void 0 ? void 0 : _b2.call(_a3, toValue(path)).required) !== null && _c !== void 0 ? _c : false;
        }
        if (isTypedSchema(config === null || config === void 0 ? void 0 : config.schema)) {
          return (_f = (_e2 = (_d = config === null || config === void 0 ? void 0 : config.schema).describe) === null || _e2 === void 0 ? void 0 : _e2.call(_d).required) !== null && _f !== void 0 ? _f : false;
        }
        return false;
      });
      const id = FIELD_ID_COUNTER++;
      const state = reactive({
        id,
        path,
        touched: false,
        pending: false,
        valid: true,
        validated: !!((_a2 = initialErrors[pathValue]) === null || _a2 === void 0 ? void 0 : _a2.length),
        required: isRequired,
        initialValue,
        errors: shallowRef([]),
        bails: (_b = config === null || config === void 0 ? void 0 : config.bails) !== null && _b !== void 0 ? _b : false,
        label: config === null || config === void 0 ? void 0 : config.label,
        type: (config === null || config === void 0 ? void 0 : config.type) || "default",
        value: currentValue,
        multiple: false,
        __flags: {
          pendingUnmount: { [id]: false },
          pendingReset: false
        },
        fieldsCount: 1,
        validate: config === null || config === void 0 ? void 0 : config.validate,
        dirty: computed(() => {
          return !isEqual(unref(currentValue), unref(initialValue));
        })
      });
      pathStates.value.push(state);
      pathStateLookup.value[pathValue] = state;
      rebuildPathLookup();
      if (errors.value[pathValue] && !initialErrors[pathValue]) {
        nextTick(() => {
          validateField(pathValue, { mode: "silent" });
        });
      }
      if (isRef(path)) {
        watch(path, (newPath) => {
          rebuildPathLookup();
          const nextValue = klona(currentValue.value);
          pathStateLookup.value[newPath] = state;
          nextTick(() => {
            setInPath(formValues, newPath, nextValue);
          });
        });
      }
      return state;
    }
    const debouncedSilentValidation = debounceAsync(_validateSchema, 5);
    const debouncedValidation = debounceAsync(_validateSchema, 5);
    const validateSchema = withLatest(async (mode) => {
      return await (mode === "silent" ? debouncedSilentValidation() : debouncedValidation());
    }, (formResult, [mode]) => {
      const currentErrorsPaths = keysOf(formCtx.errorBag.value);
      const paths = [
        .../* @__PURE__ */ new Set([...keysOf(formResult.results), ...pathStates.value.map((p2) => p2.path), ...currentErrorsPaths])
      ].sort();
      const results = paths.reduce((validation, _path) => {
        var _a2;
        const expectedPath = _path;
        const pathState = findPathState(expectedPath) || findHoistedPath(expectedPath);
        const messages = ((_a2 = formResult.results[expectedPath]) === null || _a2 === void 0 ? void 0 : _a2.errors) || [];
        const path = toValue(pathState === null || pathState === void 0 ? void 0 : pathState.path) || expectedPath;
        const fieldResult = mergeValidationResults({ errors: messages, valid: !messages.length }, validation.results[path]);
        validation.results[path] = fieldResult;
        if (!fieldResult.valid) {
          validation.errors[path] = fieldResult.errors[0];
        }
        if (pathState && extraErrorsBag.value[path]) {
          delete extraErrorsBag.value[path];
        }
        if (!pathState) {
          setFieldError2(path, messages);
          return validation;
        }
        pathState.valid = fieldResult.valid;
        if (mode === "silent") {
          return validation;
        }
        if (mode === "validated-only" && !pathState.validated) {
          return validation;
        }
        setFieldError2(pathState, fieldResult.errors);
        return validation;
      }, { valid: formResult.valid, results: {}, errors: {} });
      if (formResult.values) {
        results.values = formResult.values;
      }
      return results;
    });
    function mutateAllPathState(mutation) {
      pathStates.value.forEach(mutation);
    }
    function findPathState(path) {
      const normalizedPath = typeof path === "string" ? normalizeFormPath(path) : path;
      const pathState = typeof normalizedPath === "string" ? pathStateLookup.value[normalizedPath] : normalizedPath;
      return pathState;
    }
    function findHoistedPath(path) {
      const candidates = pathStates.value.filter((state) => path.startsWith(state.path));
      return candidates.reduce((bestCandidate, candidate) => {
        if (!bestCandidate) {
          return candidate;
        }
        return candidate.path.length > bestCandidate.path.length ? candidate : bestCandidate;
      }, void 0);
    }
    let UNSET_BATCH = [];
    let PENDING_UNSET;
    function unsetPathValue(path) {
      UNSET_BATCH.push(path);
      if (!PENDING_UNSET) {
        PENDING_UNSET = nextTick(() => {
          const sortedPaths = [...UNSET_BATCH].sort().reverse();
          sortedPaths.forEach((p2) => {
            unsetPath(formValues, p2);
          });
          UNSET_BATCH = [];
          PENDING_UNSET = null;
        });
      }
      return PENDING_UNSET;
    }
    function makeSubmissionFactory(onlyControlled) {
      return function submitHandlerFactory(fn, onValidationError) {
        return function submissionHandler(e) {
          if (e instanceof Event) {
            e.preventDefault();
            e.stopPropagation();
          }
          mutateAllPathState((s) => s.touched = true);
          isSubmitting.value = true;
          submitCount.value++;
          return validate2().then((result) => {
            const values = klona(formValues);
            if (result.valid && typeof fn === "function") {
              const controlled = klona(controlledValues.value);
              let submittedValues = onlyControlled ? controlled : values;
              if (result.values) {
                submittedValues = result.values;
              }
              return fn(submittedValues, {
                evt: e,
                controlledValues: controlled,
                setErrors,
                setFieldError: setFieldError2,
                setTouched,
                setFieldTouched,
                setValues,
                setFieldValue,
                resetForm,
                resetField
              });
            }
            if (!result.valid && typeof onValidationError === "function") {
              onValidationError({
                values,
                evt: e,
                errors: result.errors,
                results: result.results
              });
            }
          }).then((returnVal) => {
            isSubmitting.value = false;
            return returnVal;
          }, (err) => {
            isSubmitting.value = false;
            throw err;
          });
        };
      };
    }
    const handleSubmitImpl = makeSubmissionFactory(false);
    const handleSubmit = handleSubmitImpl;
    handleSubmit.withControlled = makeSubmissionFactory(true);
    function removePathState(path, id) {
      const idx = pathStates.value.findIndex((s) => s.path === path);
      const pathState = pathStates.value[idx];
      if (idx === -1 || !pathState) {
        return;
      }
      nextTick(() => {
        validateField(path, { mode: "silent", warn: false });
      });
      if (pathState.multiple && pathState.fieldsCount) {
        pathState.fieldsCount--;
      }
      if (Array.isArray(pathState.id)) {
        const idIndex = pathState.id.indexOf(id);
        if (idIndex >= 0) {
          pathState.id.splice(idIndex, 1);
        }
        delete pathState.__flags.pendingUnmount[id];
      }
      if (!pathState.multiple || pathState.fieldsCount <= 0) {
        pathStates.value.splice(idx, 1);
        unsetInitialValue(path);
        rebuildPathLookup();
        delete pathStateLookup.value[path];
      }
    }
    function destroyPath(path) {
      keysOf(pathStateLookup.value).forEach((key) => {
        if (key.startsWith(path)) {
          delete pathStateLookup.value[key];
        }
      });
      pathStates.value = pathStates.value.filter((s) => !s.path.startsWith(path));
      nextTick(() => {
        rebuildPathLookup();
      });
    }
    const formCtx = {
      formId,
      values: formValues,
      controlledValues,
      errorBag,
      errors,
      schema,
      submitCount,
      meta,
      isSubmitting,
      isValidating,
      fieldArrays,
      keepValuesOnUnmount,
      validateSchema: unref(schema) ? validateSchema : void 0,
      validate: validate2,
      setFieldError: setFieldError2,
      validateField,
      setFieldValue,
      setValues,
      setErrors,
      setFieldTouched,
      setTouched,
      resetForm,
      resetField,
      handleSubmit,
      useFieldModel,
      defineInputBinds,
      defineComponentBinds,
      defineField,
      stageInitialValue,
      unsetInitialValue,
      setFieldInitialValue,
      createPathState,
      getPathState: findPathState,
      unsetPathValue,
      removePathState,
      initialValues,
      getAllPathStates: () => pathStates.value,
      destroyPath,
      isFieldTouched,
      isFieldDirty,
      isFieldValid
    };
    function setFieldValue(field, value, shouldValidate = true) {
      const clonedValue = klona(value);
      const path = typeof field === "string" ? field : field.path;
      const pathState = findPathState(path);
      if (!pathState) {
        createPathState(path);
      }
      setInPath(formValues, path, clonedValue);
      if (shouldValidate) {
        validateField(path);
      }
    }
    function forceSetValues(fields, shouldValidate = true) {
      keysOf(formValues).forEach((key) => {
        delete formValues[key];
      });
      keysOf(fields).forEach((path) => {
        setFieldValue(path, fields[path], false);
      });
      if (shouldValidate) {
        validate2();
      }
    }
    function setValues(fields, shouldValidate = true) {
      merge(formValues, fields);
      fieldArrays.forEach((f) => f && f.reset());
      if (shouldValidate) {
        validate2();
      }
    }
    function createModel(path, shouldValidate) {
      const pathState = findPathState(toValue(path)) || createPathState(path);
      return computed({
        get() {
          return pathState.value;
        },
        set(value) {
          var _a2;
          const pathValue = toValue(path);
          setFieldValue(pathValue, value, (_a2 = toValue(shouldValidate)) !== null && _a2 !== void 0 ? _a2 : false);
        }
      });
    }
    function setFieldTouched(field, isTouched) {
      const pathState = findPathState(field);
      if (pathState) {
        pathState.touched = isTouched;
      }
    }
    function isFieldTouched(field) {
      const pathState = findPathState(field);
      if (pathState) {
        return pathState.touched;
      }
      return pathStates.value.filter((s) => s.path.startsWith(field)).some((s) => s.touched);
    }
    function isFieldDirty(field) {
      const pathState = findPathState(field);
      if (pathState) {
        return pathState.dirty;
      }
      return pathStates.value.filter((s) => s.path.startsWith(field)).some((s) => s.dirty);
    }
    function isFieldValid(field) {
      const pathState = findPathState(field);
      if (pathState) {
        return pathState.valid;
      }
      return pathStates.value.filter((s) => s.path.startsWith(field)).every((s) => s.valid);
    }
    function setTouched(fields) {
      if (typeof fields === "boolean") {
        mutateAllPathState((state) => {
          state.touched = fields;
        });
        return;
      }
      keysOf(fields).forEach((field) => {
        setFieldTouched(field, !!fields[field]);
      });
    }
    function resetField(field, state) {
      var _a2;
      const newValue = state && "value" in state ? state.value : getFromPath(initialValues.value, field);
      const pathState = findPathState(field);
      if (pathState) {
        pathState.__flags.pendingReset = true;
      }
      setFieldInitialValue(field, klona(newValue), true);
      setFieldValue(field, newValue, false);
      setFieldTouched(field, (_a2 = state === null || state === void 0 ? void 0 : state.touched) !== null && _a2 !== void 0 ? _a2 : false);
      setFieldError2(field, (state === null || state === void 0 ? void 0 : state.errors) || []);
      nextTick(() => {
        if (pathState) {
          pathState.__flags.pendingReset = false;
        }
      });
    }
    function resetForm(resetState, opts2) {
      let newValues = klona((resetState === null || resetState === void 0 ? void 0 : resetState.values) ? resetState.values : originalInitialValues.value);
      newValues = (opts2 === null || opts2 === void 0 ? void 0 : opts2.force) ? newValues : merge(originalInitialValues.value, newValues);
      newValues = isTypedSchema(schema) && isCallable(schema.cast) ? schema.cast(newValues) : newValues;
      setInitialValues(newValues);
      mutateAllPathState((state) => {
        var _a2;
        state.__flags.pendingReset = true;
        state.validated = false;
        state.touched = ((_a2 = resetState === null || resetState === void 0 ? void 0 : resetState.touched) === null || _a2 === void 0 ? void 0 : _a2[state.path]) || false;
        setFieldValue(state.path, getFromPath(newValues, state.path), false);
        setFieldError2(state.path, void 0);
      });
      (opts2 === null || opts2 === void 0 ? void 0 : opts2.force) ? forceSetValues(newValues, false) : setValues(newValues, false);
      setErrors((resetState === null || resetState === void 0 ? void 0 : resetState.errors) || {});
      submitCount.value = (resetState === null || resetState === void 0 ? void 0 : resetState.submitCount) || 0;
      nextTick(() => {
        validate2({ mode: "silent" });
        mutateAllPathState((state) => {
          state.__flags.pendingReset = false;
        });
      });
    }
    async function validate2(opts2) {
      const mode = (opts2 === null || opts2 === void 0 ? void 0 : opts2.mode) || "force";
      if (mode === "force") {
        mutateAllPathState((f) => f.validated = true);
      }
      if (formCtx.validateSchema) {
        return formCtx.validateSchema(mode);
      }
      isValidating.value = true;
      const validations = await Promise.all(pathStates.value.map((state) => {
        if (!state.validate) {
          return Promise.resolve({
            key: state.path,
            valid: true,
            errors: []
          });
        }
        return state.validate(opts2).then((result) => {
          return {
            key: state.path,
            valid: result.valid,
            errors: result.errors
          };
        });
      }));
      isValidating.value = false;
      const results = {};
      const errors2 = {};
      for (const validation of validations) {
        results[validation.key] = {
          valid: validation.valid,
          errors: validation.errors
        };
        if (validation.errors.length) {
          errors2[validation.key] = validation.errors[0];
        }
      }
      return {
        valid: validations.every((r2) => r2.valid),
        results,
        errors: errors2
      };
    }
    async function validateField(path, opts2) {
      var _a2;
      const state = findPathState(path);
      if (state && (opts2 === null || opts2 === void 0 ? void 0 : opts2.mode) !== "silent") {
        state.validated = true;
      }
      if (schema) {
        const { results } = await validateSchema((opts2 === null || opts2 === void 0 ? void 0 : opts2.mode) || "validated-only");
        return results[path] || { errors: [], valid: true };
      }
      if (state === null || state === void 0 ? void 0 : state.validate) {
        return state.validate(opts2);
      }
      !state && ((_a2 = opts2 === null || opts2 === void 0 ? void 0 : opts2.warn) !== null && _a2 !== void 0 ? _a2 : true);
      return Promise.resolve({ errors: [], valid: true });
    }
    function unsetInitialValue(path) {
      unsetPath(initialValues.value, path);
    }
    function stageInitialValue(path, value, updateOriginal = false) {
      setFieldInitialValue(path, value);
      setInPath(formValues, path, value);
      if (updateOriginal && !(opts === null || opts === void 0 ? void 0 : opts.initialValues)) {
        setInPath(originalInitialValues.value, path, klona(value));
      }
    }
    function setFieldInitialValue(path, value, updateOriginal = false) {
      setInPath(initialValues.value, path, klona(value));
      if (updateOriginal) {
        setInPath(originalInitialValues.value, path, klona(value));
      }
    }
    async function _validateSchema() {
      const schemaValue = unref(schema);
      if (!schemaValue) {
        return { valid: true, results: {}, errors: {} };
      }
      isValidating.value = true;
      const formResult = isYupValidator(schemaValue) || isTypedSchema(schemaValue) ? await validateTypedSchema(schemaValue, formValues) : await validateObjectSchema(schemaValue, formValues, {
        names: fieldNames.value,
        bailsMap: fieldBailsMap.value
      });
      isValidating.value = false;
      return formResult;
    }
    const submitForm = handleSubmit((_, { evt }) => {
      if (isFormSubmitEvent(evt)) {
        evt.target.submit();
      }
    });
    onMounted(() => {
      if (opts === null || opts === void 0 ? void 0 : opts.initialErrors) {
        setErrors(opts.initialErrors);
      }
      if (opts === null || opts === void 0 ? void 0 : opts.initialTouched) {
        setTouched(opts.initialTouched);
      }
      if (opts === null || opts === void 0 ? void 0 : opts.validateOnMount) {
        validate2();
        return;
      }
      if (formCtx.validateSchema) {
        formCtx.validateSchema("silent");
      }
    });
    if (isRef(schema)) {
      watch(schema, () => {
        var _a2;
        (_a2 = formCtx.validateSchema) === null || _a2 === void 0 ? void 0 : _a2.call(formCtx, "validated-only");
      });
    }
    provide(FormContextKey, formCtx);
    function defineField(path, config) {
      const label = isCallable(config) ? void 0 : config === null || config === void 0 ? void 0 : config.label;
      const pathState = findPathState(toValue(path)) || createPathState(path, { label });
      const evalConfig = () => isCallable(config) ? config(omit(pathState, PRIVATE_PATH_STATE_KEYS)) : config || {};
      function onBlur() {
        var _a2;
        pathState.touched = true;
        const validateOnBlur = (_a2 = evalConfig().validateOnBlur) !== null && _a2 !== void 0 ? _a2 : getConfig().validateOnBlur;
        if (validateOnBlur) {
          validateField(pathState.path);
        }
      }
      function onInput() {
        var _a2;
        const validateOnInput = (_a2 = evalConfig().validateOnInput) !== null && _a2 !== void 0 ? _a2 : getConfig().validateOnInput;
        if (validateOnInput) {
          nextTick(() => {
            validateField(pathState.path);
          });
        }
      }
      function onChange() {
        var _a2;
        const validateOnChange = (_a2 = evalConfig().validateOnChange) !== null && _a2 !== void 0 ? _a2 : getConfig().validateOnChange;
        if (validateOnChange) {
          nextTick(() => {
            validateField(pathState.path);
          });
        }
      }
      const props = computed(() => {
        const base = {
          onChange,
          onInput,
          onBlur
        };
        if (isCallable(config)) {
          return Object.assign(Object.assign({}, base), config(omit(pathState, PRIVATE_PATH_STATE_KEYS)).props || {});
        }
        if (config === null || config === void 0 ? void 0 : config.props) {
          return Object.assign(Object.assign({}, base), config.props(omit(pathState, PRIVATE_PATH_STATE_KEYS)));
        }
        return base;
      });
      const model = createModel(path, () => {
        var _a2, _b, _c;
        return (_c = (_a2 = evalConfig().validateOnModelUpdate) !== null && _a2 !== void 0 ? _a2 : (_b = getConfig()) === null || _b === void 0 ? void 0 : _b.validateOnModelUpdate) !== null && _c !== void 0 ? _c : true;
      });
      return [model, props];
    }
    function useFieldModel(pathOrPaths) {
      if (!Array.isArray(pathOrPaths)) {
        return createModel(pathOrPaths);
      }
      return pathOrPaths.map((p2) => createModel(p2, true));
    }
    function defineInputBinds(path, config) {
      const [model, props] = defineField(path, config);
      function onBlur(e) {
        props.value.onBlur(e);
      }
      function onInput(e) {
        const value = normalizeEventValue(e);
        setFieldValue(toValue(path), value, false);
        props.value.onInput(e);
      }
      function onChange(e) {
        const value = normalizeEventValue(e);
        setFieldValue(toValue(path), value, false);
        props.value.onChange(e);
      }
      return computed(() => {
        return Object.assign(Object.assign({}, props.value), {
          onBlur,
          onInput,
          onChange,
          value: model.value
        });
      });
    }
    function defineComponentBinds(path, config) {
      const [model, props] = defineField(path, config);
      const pathState = findPathState(toValue(path));
      function onUpdateModelValue(value) {
        model.value = value;
      }
      return computed(() => {
        const conf = isCallable(config) ? config(omit(pathState, PRIVATE_PATH_STATE_KEYS)) : config || {};
        return Object.assign({ [conf.model || "modelValue"]: model.value, [`onUpdate:${conf.model || "modelValue"}`]: onUpdateModelValue }, props.value);
      });
    }
    return Object.assign(Object.assign({}, formCtx), { values: readonly(formValues), handleReset: () => resetForm(), submitForm });
  }
  function useFormMeta(pathsState, currentValues, initialValues, errors) {
    const MERGE_STRATEGIES = {
      touched: "some",
      pending: "some",
      valid: "every"
    };
    const isDirty = computed(() => {
      return !isEqual(currentValues, unref(initialValues));
    });
    function calculateFlags() {
      const states = pathsState.value;
      return keysOf(MERGE_STRATEGIES).reduce((acc, flag) => {
        const mergeMethod = MERGE_STRATEGIES[flag];
        acc[flag] = states[mergeMethod]((s) => s[flag]);
        return acc;
      }, {});
    }
    const flags = reactive(calculateFlags());
    watchEffect(() => {
      const value = calculateFlags();
      flags.touched = value.touched;
      flags.valid = value.valid;
      flags.pending = value.pending;
    });
    return computed(() => {
      return Object.assign(Object.assign({ initialValues: unref(initialValues) }, flags), { valid: flags.valid && !keysOf(errors.value).length, dirty: isDirty.value });
    });
  }
  function useFormInitialValues(pathsState, formValues, opts) {
    const values = resolveInitialValues(opts);
    const initialValues = ref(values);
    const originalInitialValues = ref(klona(values));
    function setInitialValues(values2, updateFields = false) {
      initialValues.value = merge(klona(initialValues.value) || {}, klona(values2));
      originalInitialValues.value = merge(klona(originalInitialValues.value) || {}, klona(values2));
      if (!updateFields) {
        return;
      }
      pathsState.value.forEach((state) => {
        const wasTouched = state.touched;
        if (wasTouched) {
          return;
        }
        const newValue = getFromPath(initialValues.value, state.path);
        setInPath(formValues, state.path, klona(newValue));
      });
    }
    return {
      initialValues,
      originalInitialValues,
      setInitialValues
    };
  }
  function mergeValidationResults(a, b) {
    if (!b) {
      return a;
    }
    return {
      valid: a.valid && b.valid,
      errors: [...a.errors, ...b.errors]
    };
  }
  const _withScopeId = (n) => (pushScopeId("data-v-54b62445"), n = n(), popScopeId(), n);
  const _hoisted_1$k = { class: "t-absolute input-label group-empty:t-top-auto group-empty:t-text-base t-top-1 t-text-[10px]" };
  const _hoisted_2$f = {
    key: 2,
    class: "t-absolute t-right-4 t-text-[#C62424] t-top-4 t-flex t-gap-2 t-items-center"
  };
  const _hoisted_3$c = { class: "t-text-[10px]" };
  const _hoisted_4$b = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none"
  }, [
    /* @__PURE__ */ createBaseVNode("path", {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M5.80764 5.09358L1.30624 0.501464L0.592112 1.20148L5.09352 5.7936L0.501407 10.295L1.20143 11.0091L5.79354 6.50773L10.2949 11.0998L11.009 10.3998L6.50766 5.80771L11.0998 1.30633L10.3997 0.592201L5.80764 5.09358Z",
      fill: "currentColor"
    })
  ], -1));
  const _hoisted_5$b = {
    key: 3,
    class: "t-absolute t-top-4 t-right-4"
  };
  const _hoisted_6$8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "15",
    height: "12",
    viewBox: "0 0 15 12",
    fill: "none"
  }, [
    /* @__PURE__ */ createBaseVNode("path", {
      d: "M1 5.09091L5.58824 10L14 1",
      stroke: "#3F9F2F",
      "stroke-width": "1.5"
    })
  ], -1));
  const _hoisted_7$6 = [
    _hoisted_6$8
  ];
  const _sfc_main$a = /* @__PURE__ */ defineComponent({
    __name: "UiInput",
    props: {
      name: { type: String, required: true },
      label: { type: String, required: true },
      type: { type: null, required: false },
      readonly: { type: null, required: false },
      autocomplete: { type: null, required: false }
    },
    setup(__props) {
      return (_ctx, _cache) => {
        const _component_InputMask = resolveComponent("InputMask");
        const _component_InputText = resolveComponent("InputText");
        return openBlock(), createBlock(unref(Field), {
          name: _ctx.name,
          label: _ctx.label,
          as: "label",
          class: "t-border input-wrapper t-h-[48px] t-group t-border-black t-relative t-px-4 t-pb-[10px] t-flex t-items-center"
        }, {
          default: withCtx(({ value, handleChange, errorMessage, meta, handleBlur }) => [
            createBaseVNode("span", _hoisted_1$k, toDisplayString(_ctx.label), 1),
            _ctx.type === "tel" ? (openBlock(), createBlock(_component_InputMask, {
              key: 0,
              class: "t-rounded-none input t-self-end t-text-base t-leading-[15px] focus:t-shadow-none t-w-full t-outline-none",
              "model-value": value,
              placeholder: "",
              readonly: _ctx.readonly,
              onBlur: handleBlur,
              mask: "+7 999 999 99-99",
              type: "tel",
              autocomplete: _ctx.autocomplete,
              "onUpdate:modelValue": handleChange
            }, null, 8, ["model-value", "readonly", "onBlur", "autocomplete", "onUpdate:modelValue"])) : (openBlock(), createBlock(_component_InputText, {
              key: 1,
              class: "t-rounded-none input t-self-end t-text-base t-leading-[15px] focus:t-shadow-none t-w-full t-outline-none",
              "model-value": value,
              placeholder: "",
              readonly: _ctx.readonly,
              onBlur: handleBlur,
              type: _ctx.type ? _ctx.type : "text",
              autocomplete: _ctx.autocomplete,
              "onUpdate:modelValue": handleChange
            }, null, 8, ["model-value", "readonly", "onBlur", "type", "autocomplete", "onUpdate:modelValue"])),
            errorMessage ? (openBlock(), createElementBlock("div", _hoisted_2$f, [
              createBaseVNode("span", _hoisted_3$c, toDisplayString(errorMessage), 1),
              _hoisted_4$b
            ])) : createCommentVNode("", true),
            meta.touched && meta.valid ? (openBlock(), createElementBlock("div", _hoisted_5$b, [..._hoisted_7$6])) : createCommentVNode("", true)
          ]),
          _: 1
        }, 8, ["name", "label"]);
      };
    }
  });
  const UiInput = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-54b62445"], ["__file", "C:/projects/geek-flow/kin/src/components/ui/UiInput.vue"]]);
  const useDelivery = defineStore("delivery", {
    state: () => ({
      controller: null,
      amount: 0,
      addressObject: null,
      isFetchingPoints: false,
      points: [],
      isLoading: false
    }),
    actions: {
      abortDelivery() {
        if (this.controller) {
          this.controller.abort();
          this.controller = null;
          this.controller = new AbortController();
        }
      },
      async loadPoints() {
        this.isFetchingPoints = true;
        const result = await client.get("delivery/locations").json();
        if ((result == null ? void 0 : result.array) && Array.isArray(result.array)) {
          this.points = result.array;
        }
        this.isFetchingPoints = false;
      },
      async calcDelivery(address, total) {
        const payload = {
          country: (address == null ? void 0 : address.data.country) || "Россия",
          region: (address == null ? void 0 : address.data.region) || "",
          city: (address == null ? void 0 : address.data.city) || ""
        };
        this.isLoading = true;
        const result = await client.post("delivery/calculate", {
          json: {
            address: payload,
            total
          }
        }).json().catch((error) => {
          if (error instanceof DOMException)
            ;
          else {
            console.log("getSuggestions Failed", error);
            l.error(error.message ? error.message : "Ошибка");
          }
        });
        if (result == null ? void 0 : result.amount) {
          this.amount = result.amount;
        }
        this.isLoading = false;
      },
      async getSuggestions(address) {
        var _a;
        const result = await client.post("delivery/suggestion", {
          json: {
            address
          },
          signal: (_a = this.controller) == null ? void 0 : _a.signal
        }).json().catch((error) => {
          if (error instanceof DOMException)
            ;
          else {
            console.log("getSuggestions Failed", error);
            l.error(error.message ? error.message : "Ошибка");
          }
        });
        return result == null ? void 0 : result.suggestions;
      }
    }
  });
  var VueYandexMaps;
  ((VueYandexMaps2) => {
    VueYandexMaps2.settings = safeRef({
      apikey: ""
    });
    VueYandexMaps2.ymaps = () => ymaps3;
    class YandexMapException2 extends Error {
      constructor(message) {
        super(message);
        this.message = message;
        this.name = "YandexMapException";
      }
    }
    VueYandexMaps2.YandexMapException = YandexMapException2;
    VueYandexMaps2.loadStatus = safeRef("pending");
    VueYandexMaps2.isLoaded = safeComputed(() => VueYandexMaps2.loadStatus.value === "loaded" || VueYandexMaps2.loadStatus.value === "error");
    VueYandexMaps2.loadError = safeRef(null);
  })(VueYandexMaps || (VueYandexMaps = {}));
  function safeRef(value) {
    if (typeof window === "undefined") {
      return {
        // @ts-ignore
        value,
        // @ts-ignore
        __v_isRef: true
      };
    }
    return ref(value);
  }
  function safeComputed(getter, debugOptions) {
    if (typeof window === "undefined") {
      return {
        get value() {
          return getter();
        },
        // @ts-ignore
        __v_isRef: true
      };
    }
    return computed(getter, debugOptions);
  }
  function copy(target) {
    if (Array.isArray(target))
      return target.map((i) => copy(i));
    if (!target || typeof target !== "object" || (target == null ? void 0 : target.constructor) !== void 0 && (target == null ? void 0 : target.constructor) !== Object)
      return target;
    return Object.keys(target).reduce((carry, key) => {
      const val = target[key];
      carry[key] = copy(val);
      return carry;
    }, {});
  }
  function isDev() {
    var _a;
    return typeof process !== "undefined" && (((_a = process.env) == null ? void 0 : _a.NODE_ENV) === "development" || process.dev);
  }
  function getException({ text, isInternal, warn: warn2 }) {
    if (warn2) {
      text = `Warning: ${text}`;
    }
    if (isInternal) {
      text += " This is likely Vue Yandex Maps internal bug.";
      if (isDev()) {
        text += " You can report this bug here: https://github.com/PNKBizz/vue-yandex-maps/issues/new/choose";
      }
    }
    return new VueYandexMaps.YandexMapException(text);
  }
  function throwException(settings) {
    const exception = getException(settings);
    if (settings.warn) {
      console.warn(exception);
    } else {
      throw exception;
    }
  }
  function excludeKeys(item, ignoreKeys) {
    for (const [key, value] of Object.entries(item)) {
      if (ignoreKeys.includes(key))
        delete item[key];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        excludeKeys(value, ignoreKeys);
        if (!Object.keys(value).length)
          delete item[key];
      }
    }
  }
  const YandexMapException = VueYandexMaps.YandexMapException;
  const allowedOptionsKeys = {
    apikey: true,
    lang: true,
    initializeOn: true,
    importModules: true,
    version: true,
    strictMode: true,
    domain: true,
    mapsRenderWaitDuration: true,
    mapsScriptWaitDuration: true
  };
  function initYmaps() {
    return new Promise((res, rej) => {
      if (typeof ymaps3 !== "undefined")
        return res();
      if (typeof window === "undefined")
        return rej(new YandexMapException("You must call initYmaps on Client Side only"));
      if (document.getElementById("vue-yandex-maps")) {
        const watcher = watch(VueYandexMaps.loadStatus, (val) => {
          if (!VueYandexMaps.isLoaded.value)
            return;
          watcher();
          if (val === "error")
            rej(VueYandexMaps.loadError);
          if (val === "loaded")
            res();
        }, {
          immediate: true
        });
        return;
      }
      VueYandexMaps.loadStatus.value = "loading";
      const settings = VueYandexMaps.settings.value;
      const yandexMapScript = document.createElement("SCRIPT");
      const url = new URL(`${settings.domain}/${settings.version}/`);
      url.searchParams.set("lang", settings.lang || "ru_RU");
      url.searchParams.set("apikey", settings.apikey);
      yandexMapScript.setAttribute("src", url.toString());
      yandexMapScript.setAttribute("async", "");
      yandexMapScript.setAttribute("defer", "");
      yandexMapScript.setAttribute("type", "text/javascript");
      yandexMapScript.setAttribute("id", "vue-yandex-maps");
      document.head.appendChild(yandexMapScript);
      yandexMapScript.onload = async () => {
        try {
          await VueYandexMaps.ymaps().ready;
          if (settings.strictMode)
            VueYandexMaps.ymaps().strictMode = true;
          if (settings.importModules) {
            await Promise.all(
              settings.importModules.map(
                (module) => VueYandexMaps.ymaps().import(module)
              )
            );
          }
          VueYandexMaps.loadStatus.value = "loaded";
          res();
        } catch (e) {
          VueYandexMaps.loadStatus.value = "error";
          VueYandexMaps.loadError.value = e;
          rej(e);
        }
      };
      yandexMapScript.onerror = (e) => {
        VueYandexMaps.loadError.value = e;
        rej(e);
      };
    });
  }
  function createYmapsOptions(options) {
    const optionsShallowClone = {
      lang: "ru_RU",
      initializeOn: "onComponentMount",
      importModules: [],
      version: "v3",
      strictMode: false,
      domain: "https://api-maps.yandex.ru",
      mapsRenderWaitDuration: true,
      mapsScriptWaitDuration: true,
      ...options
    };
    if (!optionsShallowClone.apikey) {
      throwException({
        text: "You must specify apikey for createYmapsOptions"
      });
    }
    const notAllowedKeys = Object.keys(optionsShallowClone).filter((key) => !(key in allowedOptionsKeys));
    if (notAllowedKeys.length) {
      throwException({
        text: `You have passed unknown keys to createYmapsOptions: ${notAllowedKeys.join(", ")}. Only ${Object.keys(allowedOptionsKeys).join(", ")} are allowed.`
      });
    }
    VueYandexMaps.settings.value = optionsShallowClone;
    return optionsShallowClone;
  }
  function createYmaps(settings) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      install(app2) {
        createYmapsOptions(settings);
      }
    };
  }
  const isDate = (d) => d instanceof Date;
  const isEmpty = (o) => Object.keys(o).length === 0;
  const isObject = (o) => o != null && typeof o === "object";
  const hasOwnProperty = (o, ...args) => Object.prototype.hasOwnProperty.call(o, ...args);
  const isEmptyObject = (o) => isObject(o) && isEmpty(o);
  const makeObjectWithoutPrototype = () => /* @__PURE__ */ Object.create(null);
  const diff = (lhs, rhs) => {
    if (lhs === rhs)
      return {};
    if (!isObject(lhs) || !isObject(rhs))
      return rhs;
    const deletedValues = Object.keys(lhs).reduce((acc, key) => {
      if (!hasOwnProperty(rhs, key)) {
        acc[key] = void 0;
      }
      return acc;
    }, makeObjectWithoutPrototype());
    if (isDate(lhs) || isDate(rhs)) {
      if (lhs.valueOf() == rhs.valueOf())
        return {};
      return rhs;
    }
    return Object.keys(rhs).reduce((acc, key) => {
      if (!hasOwnProperty(lhs, key)) {
        acc[key] = rhs[key];
        return acc;
      }
      const difference = diff(lhs[key], rhs[key]);
      if (isEmptyObject(difference) && !isDate(difference) && (isEmptyObject(lhs[key]) || !isEmptyObject(rhs[key])))
        return acc;
      acc[key] = difference;
      return acc;
    }, deletedValues);
  };
  const _sfc_main$m = /* @__PURE__ */ defineComponent({
    name: "YandexMap",
    props: {
      modelValue: {
        type: Object,
        default: null
      },
      value: {
        type: Object,
        default: null
      },
      tag: {
        type: String,
        default: "div"
      },
      width: {
        type: String,
        default: "100%"
      },
      height: {
        type: String,
        default: "100%"
      },
      // z-index for Map Container. Without this, elements of the map will be displayed under your site's elements due to high z-index inside of them
      zIndex: {
        type: Number,
        default: 0
      },
      /**
       * @description Settings for cart initialization.,
       *
       * You can modify this object or use map methods, such as setLocation/setBehaviors e.t.c.
       * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/map.html#map-parms
       * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/map.html#map-parms
       */
      settings: {
        type: Object,
        required: true
      },
      /**
       * @description Makes settings readonly. Enable this if reactivity causes problems
       */
      readonlySettings: {
        type: Boolean,
        default: false
      },
      /**
       * @description Always inserts actual user center or bounds (based on your input) on every location change
       * @note This prop will cause user location change on every settings update (if user did move since last time). Use it with caution.
       */
      realSettingsLocation: {
        type: Boolean,
        default: false
      },
      /**
       * @description You can also add layers through <yandex-*> components
       *
       * Modifying this object after mount will cause no effect.
       *
       * Instead, please use map methods, such as addChild.
       * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/map.html#layers
       * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/map.html#layers
       */
      layers: {
        type: Array,
        default: () => []
      },
      /**
       * @description Adds cursor: grab/grabbing to ymaps scheme layer
       */
      cursorGrab: {
        type: Boolean,
        default: false
      }
    },
    /**
     * @description Other events are NOT available. You can listen to events via layers prop, addChildren prop or by adding <ymap-listener> as children.
     * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/events.html
     * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/events.html
     */
    emits: {
      "input"(map) {
        return !map || typeof ymaps3 === "undefined" || map instanceof ymaps3.YMap;
      },
      "update:modelValue"(map) {
        return !map || typeof ymaps3 === "undefined" || map instanceof ymaps3.YMap;
      }
    },
    slots: Object,
    setup(props, {
      slots,
      emit: emit2
    }) {
      const map = shallowRef(null);
      const layers = shallowRef([]);
      const projection = shallowRef(null);
      const ymapContainer = ref(null);
      const mounted = shallowRef(false);
      const grabbing = shallowRef(false);
      const needsToHold = ref(0);
      provide("map", map);
      provide("layers", layers);
      provide("projection", projection);
      provide("needsToHold", needsToHold);
      emit2("input", map.value);
      emit2("update:modelValue", map.value);
      const getSettings = computed(() => ({
        ...props.settings,
        projection: void 0
      }));
      const init = async () => {
        if (!props.settings.location) {
          throwException({
            text: "You must specify location in YandexMap settings"
          });
        }
        const container = ymapContainer.value;
        if (!container) {
          throwException({
            text: "<yandex-map> container is undefined after component mount.",
            isInternal: true
          });
        }
        if (map.value)
          map.value.destroy();
        const settings = getSettings.value;
        if (projection.value)
          settings.projection = projection.value;
        const createdMap = new ymaps3.YMap(container, settings, [
          ...layers.value,
          ...props.layers
        ]);
        map.value = createdMap;
        emit2("input", map.value);
        emit2("update:modelValue", map.value);
      };
      onMounted(async () => {
        if (!VueYandexMaps.isLoaded.value) {
          if (VueYandexMaps.settings.value.initializeOn === "onComponentMount") {
            try {
              await initYmaps();
            } catch (e) {
              console.error("An error occured while initializing Yandex Map with onComponentMount setting");
              console.error(e);
              return;
            }
          } else {
            throwException({
              text: "You have set up <yandex-map> component without initializing Yandex maps. Please check initializeOn setting or call initYmaps manually before registering this component."
            });
          }
        }
        mounted.value = true;
        await nextTick();
        if (needsToHold.value) {
          await new Promise((resolve2) => watch(needsToHold, () => {
            if (!needsToHold.value)
              resolve2();
          }, {
            immediate: true
          }));
        }
        await init();
        let listener;
        const setupWatcher = () => {
          let settings = JSON.parse(JSON.stringify(toRaw(getSettings.value)));
          watch(getSettings, (val) => {
            var _a;
            const rawVal = toRaw(val);
            const clonedSettings = JSON.parse(JSON.stringify(rawVal));
            if (props.realSettingsLocation && clonedSettings.location && map.value) {
              if ("center" in clonedSettings.location && "center" in settings.location) {
                settings.location.center = map.value.center;
              } else if ("bounds" in clonedSettings.location && "bounds" in settings.location) {
                settings.location.bounds = map.value.bounds;
              }
              if ("zoom" in clonedSettings.location && "zoom" in settings.location)
                settings.location.zoom = map.value.zoom;
            }
            const settingsDiff = Object.keys(diff(settings, clonedSettings));
            if (settingsDiff.length === 0)
              return;
            const updatedSettings = { ...clonedSettings };
            for (const key in updatedSettings) {
              if (!settingsDiff.includes(key))
                delete updatedSettings[key];
            }
            settings = clonedSettings;
            (_a = map.value) == null ? void 0 : _a.update(updatedSettings);
          }, {
            deep: true
          });
        };
        if (!props.readonlySettings) {
          setupWatcher();
        }
        watch(() => props.readonlySettings, (val) => {
          if (!val)
            ;
          else {
            setupWatcher();
          }
        });
        watch(() => props.cursorGrab, (val) => {
          if (!map.value)
            return;
          if (val) {
            listener = new ymaps3.YMapListener({
              onActionStart: (e) => {
                if (e.type === "drag")
                  grabbing.value = true;
              },
              onActionEnd: (e) => {
                if (e.type === "drag")
                  grabbing.value = false;
              }
            });
            map.value.addChild(listener);
          } else if (listener)
            map.value.removeChild(listener);
        }, { immediate: true });
      });
      onBeforeUnmount(() => {
        map.value = null;
        emit2("input", map.value);
        emit2("update:modelValue", map.value);
      });
      return () => {
        var _a;
        const mapNodeProps = {
          class: [
            "__ymap",
            {
              "__ymap--grab": props.cursorGrab,
              "__ymap--grabbing": props.cursorGrab && grabbing.value
            }
          ],
          style: {
            width: props.width,
            height: props.height,
            "z-index": props.zIndex.toString()
          }
        };
        const containerNode = h("div", {
          class: "__ymap_container",
          ref: ymapContainer
        });
        const slotsNodeProps = {
          class: "__ymap_slots",
          style: { display: "none" }
        };
        if (!mounted.value)
          return h(props.tag, mapNodeProps, [containerNode, h("div", slotsNodeProps)]);
        return h(props.tag, mapNodeProps, [
          containerNode,
          h("div", slotsNodeProps, (_a = slots.default) == null ? void 0 : _a.call(slots, {}))
        ]);
      };
    }
  });
  function injectMap() {
    if (!getCurrentInstance()) {
      throwException({
        text: "injectMap must be only called on runtime.",
        isInternal: true
      });
    }
    const map = inject("map");
    if (!map || !isRef(map)) {
      throwException({
        text: "Was not able to inject valid map in injectMap.",
        isInternal: true
      });
    }
    return map;
  }
  function injectLayers() {
    if (!getCurrentInstance()) {
      throwException({
        text: "injectLayers must be only called on runtime.",
        isInternal: true
      });
    }
    const layers = inject("layers");
    if (!layers || !isRef(layers)) {
      throwException({
        text: "Was not able to inject valid layers in injectLayers.",
        isInternal: true
      });
    }
    return layers;
  }
  function waitTillYmapInit({ timeoutCallback } = {}) {
    if (typeof window === "undefined") {
      throwException({
        text: "waitTillYmapInit cannot be called on SSR.",
        isInternal: true
      });
    }
    if (typeof ymaps3 !== "undefined")
      return;
    return new Promise((resolve2, reject) => {
      if (typeof ymaps3 === "undefined") {
        let timeout2;
        if (VueYandexMaps.settings.value.mapsScriptWaitDuration !== false) {
          timeout2 = setTimeout(() => {
            timeoutCallback == null ? void 0 : timeoutCallback(timeout2, true);
            reject(new VueYandexMaps.YandexMapException("Was not able to wait for map initialization in waitTillYmapInit. Ensure that map was initialized. You can change this behaviour by using mapsScriptWaitDuration."));
          }, typeof VueYandexMaps.settings.value.mapsScriptWaitDuration === "number" ? VueYandexMaps.settings.value.mapsScriptWaitDuration : 5e3);
          timeoutCallback == null ? void 0 : timeoutCallback(timeout2, false);
        }
        watch(VueYandexMaps.isLoaded, () => {
          if (timeout2) {
            clearTimeout(timeout2);
            timeoutCallback == null ? void 0 : timeoutCallback(timeout2, true);
          }
          if (VueYandexMaps.loadStatus.value === "loaded") {
            resolve2();
          } else {
            reject(VueYandexMaps.loadError);
          }
        }, {
          immediate: true
        });
      } else {
        resolve2();
      }
    });
  }
  function waitTillMapInit({
    map: _map,
    timeoutCallback
  } = {}) {
    if (!_map && !getCurrentInstance()) {
      throwException({
        text: "onMapInit must be only called on runtime.",
        isInternal: true
      });
    }
    if (typeof window === "undefined") {
      throwException({
        text: "waitTillMapInit cannot be called on SSR.",
        isInternal: true
      });
    }
    const map = _map || injectMap();
    if (map.value)
      return;
    return new Promise((resolve2, reject) => {
      let timeout2;
      if (VueYandexMaps.settings.value.mapsRenderWaitDuration !== false) {
        timeout2 = setTimeout(() => {
          timeoutCallback == null ? void 0 : timeoutCallback(timeout2, true);
          reject(new VueYandexMaps.YandexMapException("Was not able to wait for map initialization in waitTillMapInit. You can change this behaviour by using mapsRenderWaitDuration."));
        }, typeof VueYandexMaps.settings.value.mapsRenderWaitDuration === "number" ? VueYandexMaps.settings.value.mapsRenderWaitDuration : 5e3);
        timeoutCallback == null ? void 0 : timeoutCallback(timeout2, false);
      }
      let watcher;
      watcher = watch(map, () => {
        if (map.value) {
          watcher == null ? void 0 : watcher();
          if (timeout2) {
            clearTimeout(timeout2);
            timeoutCallback == null ? void 0 : timeoutCallback(timeout2, true);
          }
          resolve2();
        }
      }, {
        immediate: true
      });
    });
  }
  function deleteMapChild({
    children,
    isMercator,
    root
  }) {
    var _a;
    if (!root) {
      throwException({
        text: "Failed to execute deleteMapChild due to destroyed root",
        isInternal: true
      });
    }
    if (children && !isMercator) {
      if (typeof (root == null ? void 0 : root.value) === "object" && Array.isArray(root.value)) {
        root.value = root.value.filter((x2) => x2 !== children);
      } else {
        (_a = root.value) == null ? void 0 : _a.removeChild(children);
      }
    } else if (root.value && children && isMercator && "update" in root.value) {
      root.value.update({
        projection: void 0
      });
    }
  }
  async function setupMapChildren({
    returnOnly,
    willDeleteByHand,
    strictMapRoot,
    requiredImport,
    createFunction,
    settings,
    settingsUpdateIgnoreKeys,
    isLayer,
    isMercator,
    isMapRoot,
    mapRootRef,
    duplicateInit
  }) {
    if (!getCurrentInstance()) {
      throwException({
        text: "setupMapChildren must be only called on runtime.",
        isInternal: true
      });
    }
    const children = shallowRef();
    const mapRoot = inject("mapRoot", null);
    const initPromises = inject("mapRootInitPromises", null);
    let childrenPromises;
    const map = injectMap();
    const layers = injectLayers();
    let timeouts = null;
    const timeoutCallback = (timeout2, isDelete) => {
      if (!timeouts)
        timeouts = /* @__PURE__ */ new Set();
      if (!isDelete)
        timeouts.add(timeout2);
      else
        timeouts.delete(timeout2);
    };
    if (isMapRoot && !duplicateInit) {
      provide("mapRoot", mapRootRef || children);
      childrenPromises = shallowRef([]);
      provide("mapRootInitPromises", childrenPromises);
    }
    if (!returnOnly && !willDeleteByHand) {
      onBeforeUnmount(() => {
        if (children.value) {
          deleteMapChild({
            children: children.value,
            isMercator,
            root: (mapRoot == null ? void 0 : mapRoot.value) ? mapRoot : map
          });
        }
        if (timeouts == null ? void 0 : timeouts.size) {
          timeouts.forEach((timeout2) => clearTimeout(timeout2));
          timeouts.clear();
        }
      });
    }
    if (settings) {
      let lastSettings = copy(toRaw(settings.value));
      watch(settings, (value) => {
        if (!value)
          return;
        const settingsDiff = Object.keys(diff(lastSettings, value));
        if (settingsDiff.length === 0)
          return;
        const updatedSettings = { ...value };
        for (const key in updatedSettings) {
          if (!settingsDiff.includes(key))
            delete updatedSettings[key];
        }
        const ignoreKeys = settingsUpdateIgnoreKeys && (isRef(settingsUpdateIgnoreKeys) ? settingsUpdateIgnoreKeys.value : settingsUpdateIgnoreKeys);
        if (ignoreKeys)
          excludeKeys(updatedSettings, ignoreKeys);
        if (Object.keys(updatedSettings).length === 0)
          return;
        lastSettings = toRaw(copy(value));
        if (children.value && "update" in children.value)
          children.value.update(updatedSettings);
      }, { deep: true });
    }
    if (!isLayer && !isMercator) {
      await waitTillMapInit({ timeoutCallback });
      if (!map.value) {
        throwException({
          text: "map is undefined in setupMapChildren.",
          isInternal: true
        });
      }
    } else {
      await waitTillYmapInit({ timeoutCallback });
    }
    if (strictMapRoot) {
      if (!(mapRoot == null ? void 0 : mapRoot.value))
        await nextTick();
      if (!(mapRoot == null ? void 0 : mapRoot.value)) {
        throwException({
          text: "mapRoot is undefined in setupMapChildren.",
          isInternal: true
        });
      }
    }
    if (isMapRoot) {
      await nextTick();
      await Promise.all((childrenPromises == null ? void 0 : childrenPromises.value) || []);
    }
    let importData;
    if (requiredImport) {
      const importPromise = requiredImport();
      if (initPromises == null ? void 0 : initPromises.value)
        initPromises.value.push(Promise.resolve(importPromise));
      importData = await importPromise;
    }
    children.value = createFunction(importData);
    if (!returnOnly && map.value && !isMercator) {
      if (initPromises == null ? void 0 : initPromises.value) {
        await Promise.all(initPromises.value);
        if (!requiredImport)
          await nextTick();
      }
      if (typeof (mapRoot == null ? void 0 : mapRoot.value) === "object" && Array.isArray(mapRoot.value)) {
        mapRoot.value = [
          ...mapRoot.value,
          children.value
        ];
      } else {
        ((mapRoot == null ? void 0 : mapRoot.value) || map.value).addChild(children.value);
      }
    } else if (isLayer) {
      layers.value.push(children.value);
    } else if (isMercator && map.value) {
      map.value.update({
        projection: children.value
      });
    }
    return children.value;
  }
  const _sfc_main$k = /* @__PURE__ */ defineComponent({
    name: "YandexMapDefaultFeaturesLayer",
    props: {
      value: {
        type: Object,
        default: null
      },
      modelValue: {
        type: Object,
        default: null
      },
      settings: {
        type: Object,
        default: () => ({})
      }
    },
    emits: {
      "input"(item) {
        return true;
      },
      "update:modelValue"(item) {
        return true;
      },
      hold(status) {
        return true;
      }
    },
    slots: Object,
    setup(props, {
      slots,
      emit: emit2
    }) {
      const hold = inject("needsToHold");
      hold.value++;
      let mapLayer;
      onMounted(async () => {
        mapLayer = await setupMapChildren({
          createFunction: () => new ymaps3.YMapDefaultFeaturesLayer(props.settings || {}),
          settings: computed(() => props.settings),
          isLayer: true
        });
        emit2("input", mapLayer);
        emit2("update:modelValue", mapLayer);
        hold.value--;
      });
      return () => {
        var _a;
        return h("div", (_a = slots.default) == null ? void 0 : _a.call(slots, {}));
      };
    }
  });
  const _sfc_main$j = /* @__PURE__ */ defineComponent({
    name: "YandexMapDefaultSchemeLayer",
    props: {
      value: {
        type: Object,
        default: null
      },
      modelValue: {
        type: Object,
        default: null
      },
      settings: {
        type: Object,
        default: () => ({})
      }
    },
    slots: Object,
    emits: {
      "input"(item) {
        return true;
      },
      "update:modelValue"(item) {
        return true;
      },
      hold(status) {
        return true;
      }
    },
    setup(props, {
      slots,
      emit: emit2
    }) {
      const hold = inject("needsToHold");
      hold.value++;
      let mapLayer;
      onMounted(async () => {
        mapLayer = await setupMapChildren({
          createFunction: () => new ymaps3.YMapDefaultSchemeLayer(props.settings || {}),
          settings: computed(() => props.settings),
          isLayer: true
        });
        emit2("input", mapLayer);
        emit2("update:modelValue", mapLayer);
        hold.value--;
      });
      return () => {
        var _a;
        return h("div", (_a = slots.default) == null ? void 0 : _a.call(slots, {}));
      };
    }
  });
  function getMarkerContainerProps({
    position,
    containerAttrs,
    wrapperAttrs,
    zeroSizes
  }) {
    const root = {
      class: ["__ymap-marker"],
      style: {}
    };
    const children = {
      class: ["__ymap-marker_wrapper"],
      style: {}
    };
    const isDefaultPosition = position === "default" || position === "default default";
    if (position && !isDefaultPosition) {
      if (position.startsWith("translate")) {
        children.style.transform = position;
      } else {
        let translateX = 0;
        let translateY = 0;
        const splitted = position.split(" ");
        for (let i = 0; i < splitted.length; i++) {
          let local = 0;
          const item = splitted[i];
          switch (item) {
            case "top":
            case "left":
              local = -100;
              break;
            case "top-center":
            case "left-center":
              local = -50;
              break;
            case "bottom":
            case "right":
              local = 100;
              break;
            case "bottom-center":
            case "right-center":
              local = 50;
              break;
            default:
              local = 0;
          }
          if (item.startsWith("left") || item.startsWith("right"))
            translateX = local;
          else
            translateY = local;
        }
        children.style.transform = `translate(${translateX}%, ${translateY}%)`;
      }
    }
    if (zeroSizes === true || zeroSizes !== false && position && !isDefaultPosition) {
      root.style.width = "0";
      root.style.height = "0";
      if (children.style.transform)
        children.style.width = "fit-content";
    }
    const attrs = {
      root: { ...containerAttrs ?? {} },
      children: { ...wrapperAttrs ?? {} }
    };
    for (const [key, value] of Object.entries(attrs)) {
      const obj = key === "root" ? root : children;
      if (value.class) {
        if (!Array.isArray(value.class))
          value.class = [value.class];
        value.class = [
          ...obj.class,
          ...value.class
        ];
      }
      if (value == null ? void 0 : value.style) {
        if (typeof value.style !== "object" || Array.isArray(value.style)) {
          console.warn(`Style property was given in ${key} of marker, but it is not an object. Style of this prop can only be an object, therefore it was ignored.`);
        } else {
          value.style = {
            ...obj.style,
            ...value.style
          };
        }
      }
      Object.assign(obj, value);
    }
    return {
      root,
      children
    };
  }
  const _sfc_main$e = /* @__PURE__ */ defineComponent({
    name: "YandexMapMarker",
    props: {
      value: {
        type: Object,
        default: null
      },
      modelValue: {
        type: Object,
        default: null
      },
      settings: {
        type: Object,
        required: true
      },
      /**
       * @description Sets translate(%, %) to marker to align it properly.
       *
       * If you want to make aligment to be like Yandex Maps 2.0, set this property to "top left-center".
       * @default default (as goes in Yandex by default)
       */
      position: {
        type: String
      },
      /**
       * @description Allows you to add any attributes to <div class="__ymap-marker"> container.
       *
       * Important: to pass styles, you must use object-style prop instead of string.
       */
      containerAttrs: {
        type: Object,
        default: () => ({})
      },
      /**
       * @description Allows you to add any attributes to <div class="__ymap-marker_wrapper"> container.
       *
       * Important: to pass styles, you must use object-style prop instead of string.
       */
      wrapperAttrs: {
        type: Object,
        default: () => ({})
      },
      /**
       * @description Will add width and height: 0 to container.
       *
       * Null enables default behaviour, false disables it completely (even if position is specified).
       *
       * @default true if position is specified, false otherwise
       */
      zeroSizes: {
        type: Boolean,
        default: null
      }
    },
    emits: {
      "input"(item) {
        return true;
      },
      "update:modelValue"(item) {
        return true;
      }
    },
    slots: Object,
    setup(props, {
      slots,
      emit: emit2
    }) {
      let mapChildren;
      const element = ref(null);
      onMounted(async () => {
        if (!props.settings.coordinates) {
          throwException({
            text: "You must specify coordinates in YandexMapMarker settings"
          });
        }
        mapChildren = await setupMapChildren({
          settings: computed(() => props.settings),
          createFunction: () => new ymaps3.YMapMarker(props.settings, element.value)
        });
        emit2("input", mapChildren);
        emit2("update:modelValue", mapChildren);
      });
      watch(element, () => {
        var _a;
        if (element.value)
          (_a = element.value.parentNode) == null ? void 0 : _a.removeChild(element.value);
      });
      const rootProps = computed(() => getMarkerContainerProps({
        position: props.position,
        containerAttrs: props.containerAttrs,
        wrapperAttrs: props.wrapperAttrs,
        zeroSizes: props.zeroSizes
      }));
      return () => {
        var _a;
        return h("div", {
          ...rootProps.value.root,
          ref: element
        }, [
          h("div", {
            ...rootProps.value.children
          }, (_a = slots.default) == null ? void 0 : _a.call(slots, {}))
        ]);
      };
    }
  });
  const _hoisted_1$j = { class: "map-container" };
  const _hoisted_2$e = ["onClick"];
  const _hoisted_3$b = ["innerHTML"];
  const _sfc_main$9 = /* @__PURE__ */ defineComponent({
    __name: "CheckoutDeliverySelfForm",
    setup(__props) {
      var map = shallowRef(null);
      var settings = ref({
        location: {
          center: [37.617644, 55.755819],
          zoom: 9
        }
      });
      const deliveryStore = useDelivery();
      const { points, isFetchingPoints } = storeToRefs(deliveryStore);
      const { handleChange: setDeliveryObject } = useField("deliveryObject");
      const { handleChange: setDeliveryAddress } = useField("deliveryAddress");
      onMounted(() => {
        deliveryStore.loadPoints();
      });
      var selectPoint = (point) => {
        setDeliveryObject(point);
        setDeliveryAddress(point.name);
      };
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$j, [
          createVNode(unref(_sfc_main$m), {
            modelValue: unref(map),
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(map) ? map.value = $event : map = $event),
            width: "100%",
            settings: unref(settings)
          }, {
            default: withCtx(() => [
              createVNode(unref(_sfc_main$j)),
              createVNode(unref(_sfc_main$k)),
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(points), (point) => {
                return openBlock(), createBlock(unref(_sfc_main$e), {
                  key: point.id,
                  position: "top left",
                  settings: {
                    coordinates: [point.address.longitude, point.address.latitude],
                    id: point.id,
                    properties: {}
                  }
                }, {
                  default: withCtx(() => [
                    createBaseVNode("div", {
                      class: "icon t-cursor-pointer",
                      onClick: ($event) => unref(selectPoint)(point),
                      style: normalizeStyle({
                        position: "relative",
                        width: "size" in point ? point.size : "20px",
                        height: "size" in point ? point.size : "20px",
                        color: "color" in point && point.color,
                        background: "no-repeat center center",
                        backgroundSize: "contain",
                        backgroundImage: "icon" in point && `url(${point.icon})`
                      })
                    }, [
                      createBaseVNode("div", {
                        class: "icon_title",
                        style: normalizeStyle({
                          position: "absolute",
                          top: "120%",
                          left: "50%",
                          fontSize: "10px",
                          padding: "2px 4px",
                          textAlign: "center",
                          backgroundColor: "#fff",
                          transform: "translateX(-50%)"
                        }),
                        innerHTML: point.name
                      }, null, 12, _hoisted_3$b)
                    ], 12, _hoisted_2$e)
                  ]),
                  _: 2
                }, 1032, ["settings"]);
              }), 128))
            ]),
            _: 1
          }, 8, ["modelValue", "settings"])
        ]);
      };
    }
  });
  const CheckoutDeliverySelfForm = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-666170e5"], ["__file", "C:/projects/geek-flow/kin/src/components/forms/CheckoutDeliverySelfForm.vue"]]);
  const _hoisted_1$i = { class: "t-mb-7 lg:t-mb-3" };
  const _hoisted_2$d = { class: "" };
  const _hoisted_3$a = { class: "error-text" };
  const _hoisted_4$a = { class: "t-flex t-flex-col t-gap-3" };
  const _hoisted_5$a = {
    key: 0,
    class: "t-group autocomplete t-relative"
  };
  const _hoisted_6$7 = /* @__PURE__ */ createBaseVNode("span", { class: "t-absolute input-label t-left-4 group-empty:t-top-auto group-empty:t-text-base t-top-1 t-text-[10px]" }, "Адрес доставки", -1);
  const _hoisted_7$5 = /* @__PURE__ */ createBaseVNode("svg", {
    class: "search-icon",
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none"
  }, [
    /* @__PURE__ */ createBaseVNode("path", {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M13.0108 13.7179C11.7372 14.8278 10.0721 15.5 8.25 15.5C4.24594 15.5 1 12.2541 1 8.25C1 4.24594 4.24594 1 8.25 1C12.2541 1 15.5 4.24594 15.5 8.25C15.5 10.0721 14.8278 11.7372 13.7179 13.0108L19.8536 19.1464L19.1464 19.8536L13.0108 13.7179ZM14.5 8.25C14.5 11.7018 11.7018 14.5 8.25 14.5C4.79822 14.5 2 11.7018 2 8.25C2 4.79822 4.79822 2 8.25 2C11.7018 2 14.5 4.79822 14.5 8.25Z",
      fill: "black"
    })
  ], -1);
  const _hoisted_8$4 = {
    key: 0,
    class: "error-text"
  };
  const _sfc_main$8 = /* @__PURE__ */ defineComponent({
    __name: "CheckoutDeliveryForm",
    setup(__props) {
      var deliveryStore = useDelivery();
      var deliveryTypes = markRaw([
        {
          type: "delivery",
          name: "Курьер"
        },
        {
          type: "self",
          name: "Самовывоз"
        }
      ]);
      var { value: deliveryType, errorMessage } = useField("deliveryType");
      var {
        value: deliveryAddress,
        handleChange: setDeliveryAddress,
        meta
      } = useField("deliveryAddress");
      var {
        handleChange: setDeliveryObject,
        errorMessage: deliveryError,
        validate: validate2,
        value: deliveryObject,
        setTouched
      } = useField("deliveryObject");
      var filteredAddresses = ref([]);
      var addressField = ref("");
      var checkoutStore = useCheckout();
      watchEffect(() => {
        if (meta.touched && deliveryAddress.value) {
          setTouched(true);
        }
      });
      watchEffect(() => {
        if (deliveryAddress.value && deliveryObject.value) {
          deliveryStore.calcDelivery(deliveryObject.value, checkoutStore.total);
        }
      });
      var search = async (event) => {
        const list = await deliveryStore.getSuggestions(event.query);
        if (list == null ? void 0 : list.length) {
          filteredAddresses.value = list;
        } else {
          filteredAddresses.value = [];
        }
      };
      var itemSelect = (event) => {
        setDeliveryObject(event.value);
        setDeliveryAddress(event.value.value);
        addressField.value = "";
        setTouched(true);
        nextTick(validate2);
      };
      return (_ctx, _cache) => {
        const _component_SelectButton = resolveComponent("SelectButton");
        const _component_AutoComplete = resolveComponent("AutoComplete");
        return openBlock(), createElementBlock(Fragment, null, [
          createBaseVNode("div", _hoisted_1$i, [
            createBaseVNode("div", _hoisted_2$d, [
              createVNode(_component_SelectButton, {
                modelValue: unref(deliveryType),
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(deliveryType) ? deliveryType.value = $event : deliveryType = $event),
                options: unref(deliveryTypes),
                "option-label": "name",
                "option-value": "type"
              }, null, 8, ["modelValue", "options"])
            ]),
            createBaseVNode("span", _hoisted_3$a, toDisplayString(unref(errorMessage)), 1)
          ]),
          createBaseVNode("div", _hoisted_4$a, [
            unref(deliveryType) === "delivery" ? (openBlock(), createElementBlock("div", _hoisted_5$a, [
              _hoisted_6$7,
              createVNode(_component_AutoComplete, {
                modelValue: unref(addressField),
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => isRef(addressField) ? addressField.value = $event : addressField = $event),
                suggestions: unref(filteredAddresses),
                "option-label": "value",
                "empty-search-message": "Результатов не найдено",
                placeholder: "",
                onComplete: unref(search),
                onItemSelect: unref(itemSelect)
              }, null, 8, ["modelValue", "suggestions", "onComplete", "onItemSelect"]),
              _hoisted_7$5
            ])) : (openBlock(), createBlock(CheckoutDeliverySelfForm, { key: 1 })),
            createBaseVNode("div", null, [
              createVNode(UiInput, {
                name: "deliveryAddress",
                label: "Выбранный адрес доставки",
                readonly: ""
              }),
              unref(deliveryError) ? (openBlock(), createElementBlock("div", _hoisted_8$4, toDisplayString(unref(deliveryError)), 1)) : createCommentVNode("", true)
            ])
          ])
        ], 64);
      };
    }
  });
  const CheckoutDeliveryForm = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__file", "C:/projects/geek-flow/kin/src/components/forms/CheckoutDeliveryForm.vue"]]);
  const _hoisted_1$h = { key: 0 };
  const _hoisted_2$c = {
    key: 1,
    class: "t-flex t-flex-col t-gap-3"
  };
  const _hoisted_3$9 = { class: "radio-block-name" };
  const _hoisted_4$9 = {
    key: 0,
    class: "t-ml-auto t-max-h-7",
    xmlns: "http://www.w3.org/2000/svg",
    width: "66",
    height: "16",
    viewBox: "0 0 66 16",
    fill: "none"
  };
  const _hoisted_5$9 = /* @__PURE__ */ createStaticVNode('<g clip-path="url(#clip0_5_2343)" data-v-ab902c2a><path d="M34.4292 4.30169H32.2978L30.7895 6.95236H30.0131L29.9883 1.21582H27.9706V11.5762H29.9883L30.0131 8.73267H30.7845L32.7874 11.5762H35.0227L32.4115 7.8079L34.4292 4.30169Z" fill="black" data-v-ab902c2a></path><path d="M49.7002 7.71389C49.2903 7.44863 48.8459 7.24063 48.3797 7.09572L47.9346 6.9276L47.816 6.88309C47.5391 6.77922 47.2473 6.67045 47.2374 6.38856C47.2349 6.30506 47.2533 6.22227 47.2915 6.1479C47.3294 6.07352 47.3858 6.01 47.455 5.96325C47.6011 5.86257 47.7723 5.80436 47.9495 5.79513C48.3358 5.76845 48.7189 5.88264 49.0276 6.11657L49.0819 6.15118L50.16 4.90991L50.1057 4.86542C49.9714 4.74575 49.8258 4.63973 49.6705 4.54892C49.3923 4.38982 49.0901 4.27787 48.7755 4.21758C48.3222 4.12116 47.8537 4.12116 47.4006 4.21758C46.9625 4.27556 46.5469 4.44592 46.194 4.71211C45.9682 4.88864 45.7797 5.10793 45.6387 5.35739C45.4981 5.60685 45.4077 5.88162 45.373 6.16602C45.3112 6.67923 45.4415 7.19716 45.739 7.61993C46.134 8.05744 46.6506 8.36734 47.2225 8.51008L47.3116 8.53976L47.5143 8.60898C48.2462 8.85626 48.4539 8.95516 48.5725 9.10351C48.6278 9.17815 48.6589 9.26789 48.6616 9.36067C48.6616 9.71178 48.2314 9.85519 47.9396 9.94422C47.7356 9.98253 47.5259 9.97861 47.3235 9.93268C47.121 9.88675 46.9302 9.79979 46.7627 9.67717C46.4915 9.49589 46.2595 9.26216 46.0801 8.98978C45.9665 9.10848 44.8487 10.2113 44.8686 10.231L44.9033 10.2805C45.4417 10.9547 46.1963 11.4228 47.0396 11.6058C47.2322 11.6431 47.4272 11.6679 47.6232 11.68H47.8259C48.4921 11.694 49.1447 11.4909 49.6853 11.1014C50.0511 10.8428 50.3314 10.4813 50.4915 10.0629C50.5887 9.78202 50.623 9.48324 50.5922 9.1876C50.5614 8.89197 50.4664 8.60668 50.3133 8.35183C50.157 8.09771 49.9479 7.88013 49.7002 7.71389Z" fill="black" data-v-ab902c2a></path><path d="M56.2181 7.71398C55.8099 7.44874 55.3675 7.24074 54.9028 7.09582L54.4527 6.92769L54.3391 6.88318C54.0572 6.77931 53.7704 6.67051 53.7555 6.38865C53.7568 6.30531 53.7776 6.22345 53.8163 6.14959C53.855 6.07574 53.9103 6.01195 53.9781 5.96335C54.1242 5.86263 54.2954 5.80445 54.4726 5.79522C54.8589 5.76944 55.2415 5.88353 55.5507 6.11666L55.6 6.15127L56.6781 4.91L56.6287 4.86549C56.4935 4.74468 56.3461 4.63858 56.1886 4.54901C55.9122 4.39011 55.6115 4.27814 55.2983 4.21767C54.8435 4.12113 54.3736 4.12113 53.9188 4.21767C53.4811 4.27737 53.0657 4.44755 52.7119 4.7122C52.4849 4.88707 52.2946 5.10512 52.1519 5.35379C52.0095 5.60246 51.9174 5.87683 51.8812 6.16117C51.8165 6.67456 51.947 7.19353 52.2472 7.61508C52.6422 8.05259 53.1588 8.36247 53.7307 8.50524L53.8148 8.53491L54.0175 8.60414C54.7544 8.85139 54.9621 8.95032 55.0807 9.09867C55.1378 9.17204 55.1676 9.26295 55.1648 9.35582C55.1648 9.70694 54.7396 9.85035 54.4478 9.93937C54.2431 9.97778 54.0324 9.97391 53.8292 9.92801C53.626 9.88208 53.4342 9.79507 53.266 9.67232C52.997 9.48839 52.7655 9.25513 52.5834 8.98493C52.4747 9.10361 51.3569 10.2064 51.3718 10.2262L51.4113 10.2757C51.9499 10.9499 52.7045 11.4179 53.5478 11.601C53.7404 11.6386 53.9354 11.6633 54.1314 11.6751H54.3341C55.0003 11.6891 55.6529 11.486 56.1935 11.0966C56.5593 10.8379 56.8396 10.4765 56.9997 10.0581C57.0967 9.77718 57.1312 9.47839 57.1004 9.18276C57.0697 8.88712 56.9746 8.60183 56.8215 8.34699C56.6672 8.09592 56.4615 7.88022 56.2181 7.71398Z" fill="black" data-v-ab902c2a></path><path d="M41.0557 4.30174V5.01385H40.9669C40.4146 4.46086 39.6662 4.1481 38.8849 4.14349C38.4058 4.13401 37.9299 4.22557 37.4887 4.41215C37.0473 4.59877 36.6501 4.87624 36.3231 5.22651C35.6636 5.96504 35.31 6.9269 35.3341 7.91673C35.3085 8.92318 35.6613 9.90258 36.3231 10.6614C36.6424 11.0119 37.0332 11.2896 37.4694 11.4756C37.9053 11.6616 38.3763 11.7516 38.8502 11.7394C39.6327 11.7248 40.3853 11.436 40.9766 10.9235H41.0557V11.5614H43.1526V4.30174H41.0557ZM41.1597 7.9563C41.1808 8.54135 40.9853 9.11359 40.6106 9.56353C40.4312 9.76456 40.2096 9.92367 39.9618 10.0296C39.7141 10.1356 39.4459 10.1858 39.1767 10.1767C38.9154 10.1811 38.6564 10.1265 38.4192 10.0169C38.182 9.90727 37.9726 9.74555 37.8068 9.54373C37.4366 9.08448 37.2468 8.50599 37.2726 7.91673C37.2558 7.34521 37.4493 6.78736 37.8165 6.34908C37.9857 6.15034 38.1966 5.99139 38.4343 5.88368C38.672 5.77595 38.9306 5.72211 39.1913 5.72598C39.4591 5.71764 39.725 5.76878 39.9704 5.87567C40.2158 5.98256 40.4347 6.14255 40.6106 6.34414C40.9853 6.79604 41.1805 7.3698 41.1597 7.9563Z" fill="black" data-v-ab902c2a></path><path d="M63.8634 4.30167V5.0138H63.7743C63.2233 4.462 62.4772 4.14932 61.6973 4.14341C61.2177 4.13451 60.7413 4.22626 60.2992 4.4128C59.8573 4.59936 59.459 4.87654 59.1308 5.22643C58.4713 5.96496 58.1177 6.92685 58.1418 7.91668C58.1162 8.92313 58.469 9.90253 59.1308 10.6613C59.4501 11.0118 59.8409 11.2895 60.2768 11.4755C60.713 11.6615 61.184 11.7515 61.6579 11.7394C62.4405 11.7247 63.1928 11.4359 63.7843 10.9234H63.8634V11.5614H65.9603V4.30167H63.8634ZM63.9674 7.95623C63.9907 8.54162 63.7949 9.1147 63.4183 9.56345C63.2389 9.76448 63.0173 9.92362 62.7695 10.0296C62.5216 10.1355 62.2536 10.1858 61.9842 10.1767C61.7229 10.1811 61.4641 10.1264 61.2269 10.0168C60.9897 9.90722 60.7803 9.74547 60.6143 9.54368C60.2443 9.08443 60.0543 8.50594 60.0803 7.91668C60.0635 7.34513 60.257 6.78731 60.6242 6.34903C60.7934 6.15026 61.0043 5.99134 61.242 5.88361C61.4797 5.7759 61.7383 5.72203 61.999 5.72593C62.2668 5.71759 62.5328 5.7687 62.7781 5.87559C63.0235 5.98248 63.2421 6.14249 63.4183 6.34407C63.7949 6.79483 63.9905 7.36937 63.9674 7.95623Z" fill="black" data-v-ab902c2a></path><path d="M14.1972 0C9.84415 0 6.38145 3.51217 6.38145 7.81579C6.38145 12.1689 9.89362 15.6316 14.1972 15.6316C18.5009 15.6316 22.013 12.1194 22.013 7.81579C22.013 3.51217 18.5009 0 14.1972 0ZM14.1972 10.6849C12.6143 10.6849 11.2787 9.34927 11.2787 7.76631C11.2787 6.18338 12.6143 4.84777 14.1972 4.84777C15.7802 4.84777 17.1158 6.18338 17.1158 7.76631C17.0663 9.39872 15.7802 10.6849 14.1972 10.6849Z" fill="url(#paint0_linear_5_2343)" data-v-ab902c2a></path><path d="M6.33178 2.22607V13.6035H3.56162L0 2.22607H6.33178Z" fill="url(#paint1_linear_5_2343)" data-v-ab902c2a></path></g><defs data-v-ab902c2a><linearGradient id="paint0_linear_5_2343" x1="14.1972" y1="0" x2="14.1972" y2="15.6316" gradientUnits="userSpaceOnUse" data-v-ab902c2a><stop stop-color="#0160D1" data-v-ab902c2a></stop><stop offset="1" stop-color="#00479C" data-v-ab902c2a></stop></linearGradient><linearGradient id="paint1_linear_5_2343" x1="3.16589" y1="2.22607" x2="3.16589" y2="13.6035" gradientUnits="userSpaceOnUse" data-v-ab902c2a><stop stop-color="#0160D1" data-v-ab902c2a></stop><stop offset="1" stop-color="#00479C" data-v-ab902c2a></stop></linearGradient><clipPath id="clip0_5_2343" data-v-ab902c2a><rect width="66" height="15.6316" fill="white" data-v-ab902c2a></rect></clipPath></defs>', 2);
  const _hoisted_7$4 = [
    _hoisted_5$9
  ];
  const _hoisted_8$3 = {
    key: 1,
    class: "t-ml-auto t-max-h-7",
    width: "40",
    height: "40",
    viewBox: "0 0 40 40",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };
  const _hoisted_9$3 = /* @__PURE__ */ createStaticVNode('<path d="M4.00146 8.70703L8.84546 17.3654V22.6467L4.00713 31.288L4.00146 8.70703Z" fill="#5B57A2" data-v-ab902c2a></path><path d="M22.6003 14.2145L27.1393 11.4325L36.4287 11.4238L22.6003 19.8952V14.2145Z" fill="#D90751" data-v-ab902c2a></path><path d="M22.5748 8.65566L22.6004 20.119L17.7451 17.1356V0L22.5751 8.65566H22.5748Z" fill="#FAB718" data-v-ab902c2a></path><path d="M36.4288 11.4237L27.1391 11.4323L22.5748 8.65566L17.7451 0L36.4284 11.4237H36.4288Z" fill="#ED6F26" data-v-ab902c2a></path><path d="M22.6004 31.336V25.7743L17.7451 22.8477L17.7478 40.0003L22.6004 31.336Z" fill="#63B22F" data-v-ab902c2a></path><path d="M27.1281 28.5793L8.84513 17.3654L4.00146 8.70703L36.4091 28.568L27.1278 28.5793H27.1281Z" fill="#1487C9" data-v-ab902c2a></path><path d="M17.7483 39.9997L22.6003 31.3354L27.1279 28.5787L36.4089 28.5674L17.7483 39.9997Z" fill="#017F36" data-v-ab902c2a></path><path d="M4.00708 31.2878L17.7847 22.8479L13.1527 20.0059L8.84541 22.6465L4.00708 31.2878Z" fill="#984995" data-v-ab902c2a></path>', 8);
  const _hoisted_17 = [
    _hoisted_9$3
  ];
  const _sfc_main$7 = /* @__PURE__ */ defineComponent({
    __name: "CheckoutPaymentForm",
    setup(__props) {
      const settingsStore = useSettings();
      const { activePaymentTypes, isFetchingPaymentTypes } = storeToRefs(settingsStore);
      onMounted(settingsStore.loadPaymentTypes);
      const { value } = useField("paymentType");
      return (_ctx, _cache) => {
        const _component_Skeleton = resolveComponent("Skeleton");
        const _component_RadioButton = resolveComponent("RadioButton");
        return unref(isFetchingPaymentTypes) ? (openBlock(), createElementBlock("div", _hoisted_1$h, [
          createVNode(_component_Skeleton, {
            height: "48px",
            "border-radius": "0"
          })
        ])) : (openBlock(), createElementBlock("div", _hoisted_2$c, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(activePaymentTypes), (item) => {
            return openBlock(), createElementBlock("label", {
              key: item._id,
              class: "t-flex radio-block t-cursor-pointer t-items-center"
            }, [
              createVNode(_component_RadioButton, {
                class: "t-hidden",
                modelValue: unref(value),
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(value) ? value.value = $event : null),
                name: "paymentType",
                value: item.code
              }, null, 8, ["modelValue", "value"]),
              createBaseVNode("span", _hoisted_3$9, toDisplayString(item.title), 1),
              item.code === "yookassa" ? (openBlock(), createElementBlock("svg", _hoisted_4$9, [..._hoisted_7$4])) : item.code === "yookassa_sbp" ? (openBlock(), createElementBlock("svg", _hoisted_8$3, [..._hoisted_17])) : createCommentVNode("", true)
            ]);
          }), 128))
        ]));
      };
    }
  });
  const CheckoutPaymentForm = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-ab902c2a"], ["__file", "C:/projects/geek-flow/kin/src/components/forms/CheckoutPaymentForm.vue"]]);
  const _hoisted_1$g = { class: "t-flex t-flex-col t-w-full t-gap-8 lg:t-gap-13 t-max-w-[576px]" };
  const _hoisted_2$b = { class: "t-flex t-flex-col t-gap-3" };
  const _hoisted_3$8 = /* @__PURE__ */ createBaseVNode("h2", { class: "t-h2 t-pl-5 lg:t-pl-7 lg:t-mb-3" }, "Получатель", -1);
  const _hoisted_4$8 = /* @__PURE__ */ createBaseVNode("h2", { class: "t-h2 t-pl-5 lg:t-pl-7 t-mb-5" }, "Доставка", -1);
  const _hoisted_5$8 = /* @__PURE__ */ createBaseVNode("h2", { class: "t-h2 t-pl-5 lg:t-pl-7 t-mb-5" }, "Способ оплаты", -1);
  const _sfc_main$6 = /* @__PURE__ */ defineComponent({
    __name: "CheckoutForm",
    setup(__props) {
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$g, [
          createBaseVNode("div", _hoisted_2$b, [
            _hoisted_3$8,
            createVNode(UiInput, {
              name: "username",
              label: "Имя",
              autocomplete: "shipping name"
            }),
            createVNode(UiInput, {
              name: "email",
              type: "email",
              label: "Почта",
              autocomplete: "shipping email"
            }),
            createVNode(UiInput, {
              name: "phone",
              type: "tel",
              label: "Телефон",
              autocomplete: "shipping tel"
            })
          ]),
          createBaseVNode("div", null, [
            _hoisted_4$8,
            createVNode(CheckoutDeliveryForm)
          ]),
          createBaseVNode("div", null, [
            _hoisted_5$8,
            createVNode(CheckoutPaymentForm)
          ])
        ]);
      };
    }
  });
  const CheckoutForm = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__file", "C:/projects/geek-flow/kin/src/components/forms/CheckoutForm.vue"]]);
  function toMoney(val) {
    const intl = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0
    });
    return intl.format(val / 100);
  }
  const _hoisted_1$f = { class: "t-aspect-square t-w-full t-h-auto" };
  const _hoisted_2$a = ["href"];
  const _hoisted_3$7 = ["src", "alt"];
  const _hoisted_4$7 = { class: "t-flex t-w-full t-flex-col t-gap-1" };
  const _hoisted_5$7 = { class: "t-text-base t-line-clamp-1" };
  const _hoisted_6$6 = ["href"];
  const _hoisted_7$3 = { class: "t-text-base t-line-clamp-1 -t-mt-2 t-uppercase t-text-[#6D7175]" };
  const _hoisted_8$2 = { class: "t-flex t-justify-between" };
  const _hoisted_9$2 = { class: "t-flex t-justify-between" };
  const _hoisted_10$2 = { class: "t-flex t-flex-col lg:t-flex-row" };
  const _hoisted_11$1 = {
    key: 0,
    class: "error-text"
  };
  const _sfc_main$5 = /* @__PURE__ */ defineComponent({
    __name: "CheckoutAsideProductLine",
    props: {
      line: { type: Object, required: true },
      error: { type: String, required: false }
    },
    setup(__props) {
      const props = __props;
      const size2 = computed(
        () => props.line.options_with_values.find((i) => i.name === "size")
      );
      return (_ctx, _cache) => {
        var _a;
        return openBlock(), createElementBlock(Fragment, null, [
          createBaseVNode("div", _hoisted_1$f, [
            createBaseVNode("a", {
              href: `/products/${_ctx.line.handle}`
            }, [
              _ctx.line.image ? (openBlock(), createElementBlock("img", {
                key: 0,
                src: _ctx.line.image,
                alt: _ctx.line.title
              }, null, 8, _hoisted_3$7)) : createCommentVNode("", true)
            ], 8, _hoisted_2$a)
          ]),
          createBaseVNode("div", _hoisted_4$7, [
            createBaseVNode("div", _hoisted_5$7, [
              createBaseVNode("a", {
                href: `/products/${_ctx.line.handle}`
              }, toDisplayString(_ctx.line.title), 9, _hoisted_6$6)
            ]),
            createBaseVNode("div", _hoisted_7$3, toDisplayString(_ctx.line.variant_options[0]), 1),
            createBaseVNode("div", _hoisted_8$2, [
              createBaseVNode("span", null, toDisplayString((_a = size2.value) == null ? void 0 : _a.value), 1),
              createBaseVNode("span", null, "x" + toDisplayString(_ctx.line.quantity), 1)
            ]),
            createBaseVNode("div", _hoisted_9$2, [
              createBaseVNode("span", null, toDisplayString(_ctx.line.vendor), 1),
              createBaseVNode("div", _hoisted_10$2, [
                createBaseVNode("span", null, toDisplayString(unref(toMoney)(_ctx.line.price)), 1)
              ])
            ]),
            _ctx.error ? (openBlock(), createElementBlock("div", _hoisted_11$1, toDisplayString(_ctx.error), 1)) : createCommentVNode("", true)
          ])
        ], 64);
      };
    }
  });
  const CheckoutAsideProductLine = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__file", "C:/projects/geek-flow/kin/src/components/aside/CheckoutAsideProductLine.vue"]]);
  const _hoisted_1$e = {
    key: 0,
    class: "t-flex t-w-full t-flex-col t-gap-4"
  };
  const _hoisted_2$9 = { class: "t-flex t-justify-between" };
  const _hoisted_3$6 = /* @__PURE__ */ createBaseVNode("span", null, "Сумма", -1);
  const _hoisted_4$6 = { class: "t-flex t-justify-between" };
  const _hoisted_5$6 = /* @__PURE__ */ createBaseVNode("span", null, "Стоимость доставки", -1);
  const _hoisted_6$5 = { class: "t-flex t-justify-between" };
  const _hoisted_7$2 = /* @__PURE__ */ createBaseVNode("span", null, "Скидка", -1);
  const _hoisted_8$1 = /* @__PURE__ */ createBaseVNode("div", { class: "t-w-full t-h-px !t-block t-border t-border-black" }, null, -1);
  const _hoisted_9$1 = { class: "t-flex t-justify-between" };
  const _hoisted_10$1 = /* @__PURE__ */ createBaseVNode("span", null, "ИТОГ", -1);
  const _sfc_main$4 = /* @__PURE__ */ defineComponent({
    __name: "CheckoutAsideTotals",
    setup(__props) {
      const checkoutStore = useCheckout();
      const deliveryStore = useDelivery();
      const { amount: deliveryAmount } = storeToRefs(deliveryStore);
      const { cart, isFetchingCart, discount } = storeToRefs(checkoutStore);
      return (_ctx, _cache) => {
        return unref(cart) && unref(isFetchingCart) === false ? (openBlock(), createElementBlock("div", _hoisted_1$e, [
          createBaseVNode("div", _hoisted_2$9, [
            _hoisted_3$6,
            createBaseVNode("span", null, toDisplayString(unref(toMoney)(unref(cart).items_subtotal_price)), 1)
          ]),
          createBaseVNode("div", _hoisted_4$6, [
            _hoisted_5$6,
            createBaseVNode("span", null, toDisplayString(unref(toMoney)(unref(deliveryAmount))), 1)
          ]),
          createBaseVNode("div", _hoisted_6$5, [
            _hoisted_7$2,
            createBaseVNode("span", null, toDisplayString(unref(toMoney)(unref(discount))), 1)
          ]),
          _hoisted_8$1,
          createBaseVNode("div", _hoisted_9$1, [
            _hoisted_10$1,
            createBaseVNode("span", null, toDisplayString(unref(toMoney)(unref(cart).total_price + unref(deliveryAmount))), 1)
          ])
        ])) : createCommentVNode("", true);
      };
    }
  });
  const CheckoutAsideTotals = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__file", "C:/projects/geek-flow/kin/src/components/aside/CheckoutAsideTotals.vue"]]);
  const _hoisted_1$d = { class: "t-max-w-[544px] t-w-full t-min-w-[352px]" };
  const _hoisted_2$8 = /* @__PURE__ */ createBaseVNode("h2", { class: "t-h2 t-pl-5 lg:t-pl-7 t-mb-5" }, "Детали заказа", -1);
  const _hoisted_3$5 = { class: "t-grid t-grid-cols-[88px_auto] lg:t-grid-cols-[132px_auto] t-gap-6 t-mb-12" };
  const _hoisted_4$5 = ["disabled"];
  const _hoisted_5$5 = {
    key: 0,
    class: "t-text-white"
  };
  const _hoisted_6$4 = {
    key: 1,
    class: "t-text-white"
  };
  const _sfc_main$3 = /* @__PURE__ */ defineComponent({
    __name: "CheckoutAside",
    setup(__props) {
      const checkoutStore = useCheckout();
      const { cart, isLoading, isDiscounting, hasDiscount } = storeToRefs(checkoutStore);
      const { handleSubmit, setFieldValue, values, setFieldError: setFieldError2 } = useForm({
        validationSchema: create$3().shape({
          promoCode: create$6().optional().min(4)
        }),
        initialValues: {
          promoCode: ""
        }
      });
      onMounted(() => {
        var _a, _b;
        if (hasDiscount.value) {
          console.log("onMounted");
          setFieldValue(
            "promoCode",
            (_b = (_a = cart.value) == null ? void 0 : _a.cart_level_discount_applications.find(
              (item) => item.type === "discount_code"
            )) == null ? void 0 : _b.title
          );
        }
      });
      const processPromoCode = handleSubmit(async (values2) => {
        var _a, _b, _c;
        if ((_a = values2.promoCode) == null ? void 0 : _a.trim()) {
          if (!((_b = cart.value) == null ? void 0 : _b.attributes.discount) || cart.value.attributes.discount !== values2.promoCode) {
            await checkoutStore.appendDiscount(values2.promoCode);
            if (!((_c = cart.value) == null ? void 0 : _c.attributes.discount))
              setFieldError2("promoCode", "Промокод не найден");
          }
        }
      });
      const onBlur = async () => {
        var _a, _b, _c, _d;
        if (!((_a = values.promoCode) == null ? void 0 : _a.trim()) && ((_b = cart.value) == null ? void 0 : _b.attributes.discount) && !isDiscounting.value) {
          await checkoutStore.clearDiscount();
          setFieldError2("promoCode", "");
        } else if (((_c = values.promoCode) == null ? void 0 : _c.trim()) && ((_d = cart.value) == null ? void 0 : _d.attributes.discount)) {
          await checkoutStore.appendDiscount(values.promoCode);
        }
      };
      return (_ctx, _cache) => {
        var _a;
        return openBlock(), createElementBlock("aside", _hoisted_1$d, [
          createBaseVNode("form", {
            onSubmit: _cache[0] || (_cache[0] = withModifiers(
              //@ts-ignore
              (...args) => unref(processPromoCode) && unref(processPromoCode)(...args),
              ["prevent"]
            )),
            class: "t-mb-9"
          }, [
            _hoisted_2$8,
            createVNode(UiInput, {
              onBlur,
              label: "Промокод",
              name: "promoCode"
            })
          ], 32),
          createBaseVNode("div", _hoisted_3$5, [
            (openBlock(true), createElementBlock(Fragment, null, renderList((_a = unref(cart)) == null ? void 0 : _a.items, (item) => {
              return openBlock(), createBlock(CheckoutAsideProductLine, {
                key: item.id,
                line: item
              }, null, 8, ["line"]);
            }), 128))
          ]),
          createVNode(CheckoutAsideTotals),
          createBaseVNode("button", {
            onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("submit")),
            disabled: unref(isLoading) || unref(isDiscounting),
            class: normalizeClass(["t-mt-9 t-transition-colors hover:t-bg-opacity-80 lg:t-mt-14 t-bg-black t-py-4 t-w-full", {
              "t-bg-opacity-80": unref(isLoading) || unref(isDiscounting)
            }])
          }, [
            !unref(isLoading) ? (openBlock(), createElementBlock("span", _hoisted_5$5, " Перейти к оплате ")) : (openBlock(), createElementBlock("span", _hoisted_6$4, "Переход к оплате..."))
          ], 10, _hoisted_4$5)
        ]);
      };
    }
  });
  const CheckoutAside = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__file", "C:/projects/geek-flow/kin/src/components/aside/CheckoutAside.vue"]]);
  var ReCaptchaVuePlugin = {};
  var ReCaptcha = {};
  var ReCaptchaLoader$1 = {};
  var ReCaptchaInstance$1 = {};
  var __awaiter$1 = commonjsGlobal && commonjsGlobal.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator$1 = commonjsGlobal && commonjsGlobal.__generator || function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g2;
    return g2 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
      return this;
    }), g2;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  Object.defineProperty(ReCaptchaInstance$1, "__esModule", { value: true });
  ReCaptchaInstance$1.ReCaptchaInstance = void 0;
  var ReCaptchaInstance = function() {
    function ReCaptchaInstance2(siteKey, recaptchaID, recaptcha2) {
      this.siteKey = siteKey;
      this.recaptchaID = recaptchaID;
      this.recaptcha = recaptcha2;
      this.styleContainer = null;
    }
    ReCaptchaInstance2.prototype.execute = function(action) {
      return __awaiter$1(this, void 0, void 0, function() {
        return __generator$1(this, function(_a) {
          return [2, this.recaptcha.enterprise ? this.recaptcha.enterprise.execute(this.recaptchaID, { action }) : this.recaptcha.execute(this.recaptchaID, { action })];
        });
      });
    };
    ReCaptchaInstance2.prototype.getSiteKey = function() {
      return this.siteKey;
    };
    ReCaptchaInstance2.prototype.hideBadge = function() {
      if (this.styleContainer !== null) {
        return;
      }
      this.styleContainer = document.createElement("style");
      this.styleContainer.innerHTML = ".grecaptcha-badge{visibility:hidden !important;}";
      document.head.appendChild(this.styleContainer);
    };
    ReCaptchaInstance2.prototype.showBadge = function() {
      if (this.styleContainer === null) {
        return;
      }
      document.head.removeChild(this.styleContainer);
      this.styleContainer = null;
    };
    return ReCaptchaInstance2;
  }();
  ReCaptchaInstance$1.ReCaptchaInstance = ReCaptchaInstance;
  Object.defineProperty(ReCaptchaLoader$1, "__esModule", { value: true });
  ReCaptchaLoader$1.getInstance = ReCaptchaLoader$1.load = void 0;
  var ReCaptchaInstance_1 = ReCaptchaInstance$1;
  var ELoadingState;
  (function(ELoadingState2) {
    ELoadingState2[ELoadingState2["NOT_LOADED"] = 0] = "NOT_LOADED";
    ELoadingState2[ELoadingState2["LOADING"] = 1] = "LOADING";
    ELoadingState2[ELoadingState2["LOADED"] = 2] = "LOADED";
  })(ELoadingState || (ELoadingState = {}));
  var ReCaptchaLoader = function() {
    function ReCaptchaLoader2() {
    }
    ReCaptchaLoader2.load = function(siteKey, options) {
      if (options === void 0) {
        options = {};
      }
      if (typeof document === "undefined") {
        return Promise.reject(new Error("This is a library for the browser!"));
      }
      if (ReCaptchaLoader2.getLoadingState() === ELoadingState.LOADED) {
        if (ReCaptchaLoader2.instance.getSiteKey() === siteKey) {
          return Promise.resolve(ReCaptchaLoader2.instance);
        } else {
          return Promise.reject(new Error("reCAPTCHA already loaded with different site key!"));
        }
      }
      if (ReCaptchaLoader2.getLoadingState() === ELoadingState.LOADING) {
        if (siteKey !== ReCaptchaLoader2.instanceSiteKey) {
          return Promise.reject(new Error("reCAPTCHA already loaded with different site key!"));
        }
        return new Promise(function(resolve2, reject) {
          ReCaptchaLoader2.successfulLoadingConsumers.push(function(instance) {
            return resolve2(instance);
          });
          ReCaptchaLoader2.errorLoadingRunnable.push(function(reason) {
            return reject(reason);
          });
        });
      }
      ReCaptchaLoader2.instanceSiteKey = siteKey;
      ReCaptchaLoader2.setLoadingState(ELoadingState.LOADING);
      var loader = new ReCaptchaLoader2();
      return new Promise(function(resolve2, reject) {
        loader.loadScript(siteKey, options.useRecaptchaNet || false, options.useEnterprise || false, options.renderParameters ? options.renderParameters : {}, options.customUrl).then(function() {
          ReCaptchaLoader2.setLoadingState(ELoadingState.LOADED);
          var widgetID = loader.doExplicitRender(grecaptcha, siteKey, options.explicitRenderParameters ? options.explicitRenderParameters : {}, options.useEnterprise || false);
          var instance = new ReCaptchaInstance_1.ReCaptchaInstance(siteKey, widgetID, grecaptcha);
          ReCaptchaLoader2.successfulLoadingConsumers.forEach(function(v) {
            return v(instance);
          });
          ReCaptchaLoader2.successfulLoadingConsumers = [];
          if (options.autoHideBadge) {
            instance.hideBadge();
          }
          ReCaptchaLoader2.instance = instance;
          resolve2(instance);
        }).catch(function(error) {
          ReCaptchaLoader2.errorLoadingRunnable.forEach(function(v) {
            return v(error);
          });
          ReCaptchaLoader2.errorLoadingRunnable = [];
          reject(error);
        });
      });
    };
    ReCaptchaLoader2.getInstance = function() {
      return ReCaptchaLoader2.instance;
    };
    ReCaptchaLoader2.setLoadingState = function(state) {
      ReCaptchaLoader2.loadingState = state;
    };
    ReCaptchaLoader2.getLoadingState = function() {
      if (ReCaptchaLoader2.loadingState === null) {
        return ELoadingState.NOT_LOADED;
      } else {
        return ReCaptchaLoader2.loadingState;
      }
    };
    ReCaptchaLoader2.prototype.loadScript = function(siteKey, useRecaptchaNet, useEnterprise, renderParameters, customUrl) {
      var _this = this;
      if (useRecaptchaNet === void 0) {
        useRecaptchaNet = false;
      }
      if (useEnterprise === void 0) {
        useEnterprise = false;
      }
      if (renderParameters === void 0) {
        renderParameters = {};
      }
      if (customUrl === void 0) {
        customUrl = "";
      }
      var scriptElement = document.createElement("script");
      scriptElement.setAttribute("recaptcha-v3-script", "");
      var scriptBase = "https://www.google.com/recaptcha/api.js";
      if (useRecaptchaNet) {
        if (useEnterprise) {
          scriptBase = "https://recaptcha.net/recaptcha/enterprise.js";
        } else {
          scriptBase = "https://recaptcha.net/recaptcha/api.js";
        }
      }
      if (useEnterprise) {
        scriptBase = "https://www.google.com/recaptcha/enterprise.js";
      }
      if (customUrl) {
        scriptBase = customUrl;
      }
      if (renderParameters.render) {
        renderParameters.render = void 0;
      }
      var parametersQuery = this.buildQueryString(renderParameters);
      scriptElement.src = scriptBase + "?render=explicit" + parametersQuery;
      return new Promise(function(resolve2, reject) {
        scriptElement.addEventListener("load", _this.waitForScriptToLoad(function() {
          resolve2(scriptElement);
        }, useEnterprise), false);
        scriptElement.onerror = function(error) {
          ReCaptchaLoader2.setLoadingState(ELoadingState.NOT_LOADED);
          reject(error);
        };
        document.head.appendChild(scriptElement);
      });
    };
    ReCaptchaLoader2.prototype.buildQueryString = function(parameters) {
      var parameterKeys = Object.keys(parameters);
      if (parameterKeys.length < 1) {
        return "";
      }
      return "&" + Object.keys(parameters).filter(function(parameterKey) {
        return !!parameters[parameterKey];
      }).map(function(parameterKey) {
        return parameterKey + "=" + parameters[parameterKey];
      }).join("&");
    };
    ReCaptchaLoader2.prototype.waitForScriptToLoad = function(callback, useEnterprise) {
      var _this = this;
      return function() {
        if (window.grecaptcha === void 0) {
          setTimeout(function() {
            _this.waitForScriptToLoad(callback, useEnterprise);
          }, ReCaptchaLoader2.SCRIPT_LOAD_DELAY);
        } else {
          if (useEnterprise) {
            window.grecaptcha.enterprise.ready(function() {
              callback();
            });
          } else {
            window.grecaptcha.ready(function() {
              callback();
            });
          }
        }
      };
    };
    ReCaptchaLoader2.prototype.doExplicitRender = function(grecaptcha2, siteKey, parameters, isEnterprise) {
      var augmentedParameters = {
        sitekey: siteKey,
        badge: parameters.badge,
        size: parameters.size,
        tabindex: parameters.tabindex
      };
      if (parameters.container) {
        if (isEnterprise) {
          return grecaptcha2.enterprise.render(parameters.container, augmentedParameters);
        } else {
          return grecaptcha2.render(parameters.container, augmentedParameters);
        }
      } else {
        if (isEnterprise) {
          return grecaptcha2.enterprise.render(augmentedParameters);
        } else {
          return grecaptcha2.render(augmentedParameters);
        }
      }
    };
    ReCaptchaLoader2.loadingState = null;
    ReCaptchaLoader2.instance = null;
    ReCaptchaLoader2.instanceSiteKey = null;
    ReCaptchaLoader2.successfulLoadingConsumers = [];
    ReCaptchaLoader2.errorLoadingRunnable = [];
    ReCaptchaLoader2.SCRIPT_LOAD_DELAY = 25;
    return ReCaptchaLoader2;
  }();
  ReCaptchaLoader$1.load = ReCaptchaLoader.load;
  ReCaptchaLoader$1.getInstance = ReCaptchaLoader.getInstance;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReCaptchaInstance = exports.getInstance = exports.load = void 0;
    var ReCaptchaLoader_1 = ReCaptchaLoader$1;
    Object.defineProperty(exports, "load", { enumerable: true, get: function() {
      return ReCaptchaLoader_1.load;
    } });
    Object.defineProperty(exports, "getInstance", { enumerable: true, get: function() {
      return ReCaptchaLoader_1.getInstance;
    } });
    var ReCaptchaInstance_12 = ReCaptchaInstance$1;
    Object.defineProperty(exports, "ReCaptchaInstance", { enumerable: true, get: function() {
      return ReCaptchaInstance_12.ReCaptchaInstance;
    } });
  })(ReCaptcha);
  const require$$1 = /* @__PURE__ */ getAugmentedNamespace(vue_runtime_esmBundler);
  var __awaiter = commonjsGlobal && commonjsGlobal.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator = commonjsGlobal && commonjsGlobal.__generator || function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g2;
    return g2 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
      return this;
    }), g2;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  Object.defineProperty(ReCaptchaVuePlugin, "__esModule", { value: true });
  var useReCaptcha_1 = ReCaptchaVuePlugin.useReCaptcha = VueReCaptcha = ReCaptchaVuePlugin.VueReCaptcha = void 0;
  var recaptcha_v3_1 = ReCaptcha;
  var vue_1 = require$$1;
  var VueReCaptchaInjectKey = Symbol("VueReCaptchaInjectKey");
  var globalConfig = {
    loadedWaiters: [],
    error: null
  };
  var VueReCaptcha = ReCaptchaVuePlugin.VueReCaptcha = {
    install: function(app2, options) {
      var isLoaded = vue_1.ref(false);
      var instance = vue_1.ref(void 0);
      app2.config.globalProperties.$recaptchaLoaded = recaptchaLoaded(isLoaded);
      initializeReCaptcha(options).then(function(wrapper) {
        isLoaded.value = true;
        instance.value = wrapper;
        app2.config.globalProperties.$recaptcha = recaptcha(instance);
        app2.config.globalProperties.$recaptchaInstance = instance;
        globalConfig.loadedWaiters.forEach(function(v) {
          return v.resolve(true);
        });
      }).catch(function(error) {
        globalConfig.error = error;
        globalConfig.loadedWaiters.forEach(function(v) {
          return v.reject(error);
        });
      });
      app2.provide(VueReCaptchaInjectKey, {
        instance,
        isLoaded,
        executeRecaptcha: recaptcha(instance),
        recaptchaLoaded: recaptchaLoaded(isLoaded)
      });
    }
  };
  function useReCaptcha() {
    return vue_1.inject(VueReCaptchaInjectKey);
  }
  useReCaptcha_1 = ReCaptchaVuePlugin.useReCaptcha = useReCaptcha;
  function initializeReCaptcha(options) {
    return __awaiter(this, void 0, void 0, function() {
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            return [4, recaptcha_v3_1.load(options.siteKey, options.loaderOptions)];
          case 1:
            return [2, _a.sent()];
        }
      });
    });
  }
  function recaptchaLoaded(isLoaded) {
    return function() {
      return new Promise(function(resolve2, reject) {
        if (globalConfig.error !== null) {
          return reject(globalConfig.error);
        }
        if (isLoaded.value) {
          return resolve2(true);
        }
        globalConfig.loadedWaiters.push({ resolve: resolve2, reject });
      });
    };
  }
  function recaptcha(instance) {
    var _this = this;
    return function(action) {
      return __awaiter(_this, void 0, void 0, function() {
        var _a;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              return [4, (_a = instance.value) === null || _a === void 0 ? void 0 : _a.execute(action)];
            case 1:
              return [2, _b.sent()];
          }
        });
      });
    };
  }
  const _hoisted_1$c = { class: "t-grid t-grid-cols-1 lg:t-grid-cols-2 t-gap-11 lg:t-justify-center t-justify-items-center t-w-full" };
  const _sfc_main$2 = /* @__PURE__ */ defineComponent({
    __name: "CheckoutContent",
    setup(__props) {
      var _a, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m;
      const { executeRecaptcha, recaptchaLoaded: recaptchaLoaded2 } = useReCaptcha_1();
      const recaptcha2 = async () => {
        await recaptchaLoaded2();
        return await executeRecaptcha("submit");
      };
      const checkoutStore = useCheckout();
      const { checkout } = storeToRefs(checkoutStore);
      const { handleSubmit } = useForm({
        validationSchema: create$3().shape({
          username: create$6().required("Заполните имя"),
          email: create$6().email("Неверный формат email").matches(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Неверный формат email"
          ).required("Заполните email"),
          phone: create$6().required(),
          deliveryType: create$6().required("Выберите способ доставки"),
          deliveryAddress: create$6().required("Выберите адрес доставки"),
          deliveryObject: create((_value, options) => {
            console.log(options.parent.deliveryType);
            if (options.parent.deliveryType === "self") {
              return create$3().shape({
                id: create$6().required("Выберите пункт"),
                address: create$8()
              });
            } else
              return create$3().shape({
                data: create$3().shape({
                  house: create$6().required("Укажите дом").min(1),
                  city: create$6().optional().nullable().test(function(val, ctx) {
                    const { settlement } = this.parent;
                    if (!settlement || settlement.trim().length === 0) {
                      if (!val || val.trim() === "")
                        ctx.createError({ message: "Укажите город" });
                    }
                    return true;
                  }),
                  settlement: create$6().optional().nullable().test(function(val, ctx) {
                    const { city } = this.parent;
                    if (!city || city.trim().length === 0) {
                      if (!val || val.trim() === "")
                        ctx.createError({
                          message: "Укажите населенный пункт"
                        });
                    }
                    return true;
                  })
                }).required("Укажите адрес")
              }).required("Укажите адрес");
          }),
          paymentType: create$6().oneOf(["yookassa", "yookassa_sbp"], "Неверный способ оплаты").required()
        }),
        initialValues: {
          username: ((_b = (_a = checkout.value) == null ? void 0 : _a.contacts) == null ? void 0 : _b.username) ?? "",
          email: ((_d = (_c = checkout.value) == null ? void 0 : _c.contacts) == null ? void 0 : _d.email) ?? "",
          phone: ((_f = (_e2 = checkout.value) == null ? void 0 : _e2.contacts) == null ? void 0 : _f.phone) ?? "",
          deliveryType: ((_h = (_g = checkout.value) == null ? void 0 : _g.delivery) == null ? void 0 : _h.type) ?? "delivery",
          paymentType: ((_i = checkout.value) == null ? void 0 : _i.paymentType) ?? "yookassa",
          deliveryAddress: ((_k = (_j = checkout.value) == null ? void 0 : _j.delivery) == null ? void 0 : _k.address) ?? "",
          deliveryObject: ((_m = (_l = checkout.value) == null ? void 0 : _l.delivery) == null ? void 0 : _m.addressObject) ?? null
        }
      });
      var processForm = handleSubmit(async (values) => {
        console.log("values", values);
        const token = await recaptcha2();
        const result = checkoutStore.toPayment(values, token);
        if (result && "status" in result && result.status === 422) {
          setFieldError(result.payload.id, result.message);
        } else if (result && "status" in result && result.status === 406) {
          setFieldError(result.payload.id, result.message);
        } else if (result && "message" in result && result.message) {
          l.error(result.message);
        }
      });
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$c, [
          createVNode(CheckoutForm),
          createVNode(CheckoutAside, { onSubmit: unref(processForm) }, null, 8, ["onSubmit"])
        ]);
      };
    }
  });
  const CheckoutContent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__file", "C:/projects/geek-flow/kin/src/components/containers/CheckoutContent.vue"]]);
  const _hoisted_1$b = { key: 0 };
  const _hoisted_2$7 = { class: "t-max-w-[544px] t-mx-auto t-w-full t-min-w-[352px]" };
  const _hoisted_3$4 = { class: "t-mb-9" };
  const _hoisted_4$4 = /* @__PURE__ */ createBaseVNode("h2", { class: "t-h2 t-text-center t-pl-5 lg:t-pl-7 t-mb-5" }, " Ошибка при оформлении заказа ", -1);
  const _hoisted_5$4 = {
    key: 0,
    class: "t-text-center"
  };
  const _hoisted_6$3 = { class: "t-grid t-grid-cols-[88px_auto] lg:t-grid-cols-[132px_auto] t-gap-6 t-mb-12" };
  const _hoisted_7$1 = { key: 1 };
  const _hoisted_8 = { class: "t-mb-9" };
  const _hoisted_9 = /* @__PURE__ */ createBaseVNode("h2", { class: "t-h2 t-text-center t-mb-5" }, "Ошибка при оформлении заказа", -1);
  const _hoisted_10 = {
    key: 0,
    class: "t-text-center"
  };
  const _hoisted_11 = { class: "t-flex t-justify-center t-w-full t-mt-auto t-gap-4" };
  const _hoisted_12 = /* @__PURE__ */ createBaseVNode("a", { href: "/" }, "На главную", -1);
  const _hoisted_13 = /* @__PURE__ */ createBaseVNode("a", { href: "/cart" }, "В корзину", -1);
  const _sfc_main$1 = /* @__PURE__ */ defineComponent({
    __name: "OrderError",
    setup(__props) {
      const checkoutStore = useCheckout();
      const { error, cart } = storeToRefs(checkoutStore);
      const errorItems = computed(() => {
        var _a, _b;
        if ([422, 406].includes((_a = error.value) == null ? void 0 : _a.status) && ((_b = cart.value) == null ? void 0 : _b.items)) {
          const item = cart.value.items.find(
            (i) => i.id === Number(error.value.payload.id)
          );
          return item ? [item] : [];
        }
      });
      return (_ctx, _cache) => {
        var _a, _b, _c, _d, _e2;
        return openBlock(), createElementBlock("div", null, [
          ((_a = unref(error)) == null ? void 0 : _a.status) === 422 || ((_b = unref(error)) == null ? void 0 : _b.status) === 406 ? (openBlock(), createElementBlock("div", _hoisted_1$b, [
            createBaseVNode("aside", _hoisted_2$7, [
              createBaseVNode("div", _hoisted_3$4, [
                _hoisted_4$4,
                ((_c = unref(error)) == null ? void 0 : _c.message) ? (openBlock(), createElementBlock("p", _hoisted_5$4, toDisplayString(unref(error).message), 1)) : createCommentVNode("", true)
              ]),
              createBaseVNode("div", _hoisted_6$3, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(errorItems.value, (item) => {
                  return openBlock(), createBlock(CheckoutAsideProductLine, {
                    key: item.id,
                    error: unref(error).message,
                    line: item
                  }, null, 8, ["error", "line"]);
                }), 128))
              ])
            ])
          ])) : ((_d = unref(error)) == null ? void 0 : _d.status) === 400 ? (openBlock(), createElementBlock("div", _hoisted_7$1, [
            createBaseVNode("div", _hoisted_8, [
              _hoisted_9,
              ((_e2 = unref(error)) == null ? void 0 : _e2.message) ? (openBlock(), createElementBlock("p", _hoisted_10, toDisplayString(unref(error).message), 1)) : createCommentVNode("", true)
            ])
          ])) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_11, [
            _hoisted_12,
            createBaseVNode("button", {
              type: "button",
              onClick: _cache[0] || (_cache[0] = //@ts-ignore
              (...args) => unref(checkoutStore).reCreate && unref(checkoutStore).reCreate(...args))
            }, " Попробовать заново "),
            _hoisted_13
          ])
        ]);
      };
    }
  });
  const OrderError = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__file", "C:/projects/geek-flow/kin/src/components/containers/OrderError.vue"]]);
  const _hoisted_1$a = { class: "page-width" };
  const _hoisted_2$6 = { key: 0 };
  const _hoisted_3$3 = { key: 3 };
  const _hoisted_4$3 = /* @__PURE__ */ createBaseVNode("h2", null, "Возникла ошибка", -1);
  const _hoisted_5$3 = [
    _hoisted_4$3
  ];
  const _sfc_main = /* @__PURE__ */ defineComponent({
    __name: "Checkout",
    setup(__props) {
      const checkoutStore = useCheckout();
      const settingsStore = useSettings();
      const { checkout, isFetching, isFetchingCart, error, cart } = storeToRefs(checkoutStore);
      const { instance, recaptchaLoaded: recaptchaLoaded2 } = useReCaptcha_1();
      onMounted(async () => {
        var _a;
        try {
          const params = new URLSearchParams(window.location.search);
          const checkoutId = params.get("id");
          const localStorageId = localStorage.getItem("checkout-id");
          if (checkoutId) {
            checkoutStore.setCheckoutId(checkoutId);
          } else if (localStorageId) {
            checkoutStore.setCheckoutId(localStorageId);
          }
          if (!checkout.value) {
            await checkoutStore.loadCheckout();
            if (checkout.value && !checkout.value.isClosed)
              await checkoutStore.checkCart();
          }
          await settingsStore.loadSettings();
          console.log("!!!", checkout.value, cart.value);
          if (!checkout.value && ((_a = cart.value) == null ? void 0 : _a.items.length) === 0) {
            checkoutStore.setError({
              status: 400,
              message: "Корзина пуста",
              payload: {}
            });
          }
          console.log(error.value);
          await recaptchaLoaded2();
          if (instance.value)
            instance.value.hideBadge();
        } catch (err) {
          console.log("Checkout err", err);
        }
      });
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$a, [
          unref(isFetching) || unref(isFetchingCart) ? (openBlock(), createBlock(CheckoutSkeleton, { key: 0 })) : unref(error) ? (openBlock(), createBlock(OrderError, { key: 1 })) : unref(checkout) ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
            unref(checkout).isClosed || unref(checkout).status === unref(ICheckoutStatus).PROCESS ? (openBlock(), createElementBlock("div", _hoisted_2$6, [
              (openBlock(), createBlock(Suspense, null, {
                fallback: withCtx(() => [
                  createTextVNode(" Загрузка... ")
                ]),
                default: withCtx(() => [
                  createVNode(OrderResult)
                ]),
                _: 1
              }))
            ])) : (openBlock(), createBlock(CheckoutContent, { key: 1 }))
          ], 64)) : (openBlock(), createElementBlock("div", _hoisted_3$3, [..._hoisted_5$3]))
        ]);
      };
    }
  });
  const Checkout = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/projects/geek-flow/kin/src/Checkout.vue"]]);
  function _createForOfIteratorHelper$1(o, allowArrayLike) {
    var it2 = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it2) {
      if (Array.isArray(o) || (it2 = _unsupportedIterableToArray$3$1(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it2)
          o = it2;
        var i = 0;
        var F = function F2() {
        };
        return { s: F, n: function n() {
          if (i >= o.length)
            return { done: true };
          return { done: false, value: o[i++] };
        }, e: function e(_e2) {
          throw _e2;
        }, f: F };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return { s: function s() {
      it2 = it2.call(o);
    }, n: function n() {
      var step = it2.next();
      normalCompletion = step.done;
      return step;
    }, e: function e(_e2) {
      didErr = true;
      err = _e2;
    }, f: function f() {
      try {
        if (!normalCompletion && it2["return"] != null)
          it2["return"]();
      } finally {
        if (didErr)
          throw err;
      }
    } };
  }
  function _toConsumableArray$3(arr) {
    return _arrayWithoutHoles$3(arr) || _iterableToArray$3(arr) || _unsupportedIterableToArray$3$1(arr) || _nonIterableSpread$3();
  }
  function _nonIterableSpread$3() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _iterableToArray$3(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
      return Array.from(iter);
  }
  function _arrayWithoutHoles$3(arr) {
    if (Array.isArray(arr))
      return _arrayLikeToArray$3$1(arr);
  }
  function _typeof$3$1(o) {
    "@babel/helpers - typeof";
    return _typeof$3$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof$3$1(o);
  }
  function _slicedToArray$1$1(arr, i) {
    return _arrayWithHoles$1$1(arr) || _iterableToArrayLimit$1$1(arr, i) || _unsupportedIterableToArray$3$1(arr, i) || _nonIterableRest$1$1();
  }
  function _nonIterableRest$1$1() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray$3$1(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray$3$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray$3$1(o, minLen);
  }
  function _arrayLikeToArray$3$1(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  function _iterableToArrayLimit$1$1(r2, l2) {
    var t = null == r2 ? null : "undefined" != typeof Symbol && r2[Symbol.iterator] || r2["@@iterator"];
    if (null != t) {
      var e, n, i, u, a = [], f = true, o = false;
      try {
        if (i = (t = t.call(r2)).next, 0 === l2) {
          if (Object(t) !== t)
            return;
          f = false;
        } else
          for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l2); f = true)
            ;
      } catch (r3) {
        o = true, n = r3;
      } finally {
        try {
          if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
            return;
        } finally {
          if (o)
            throw n;
        }
      }
      return a;
    }
  }
  function _arrayWithHoles$1$1(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  var DomHandler = {
    innerWidth: function innerWidth(el) {
      if (el) {
        var width = el.offsetWidth;
        var style = getComputedStyle(el);
        width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        return width;
      }
      return 0;
    },
    width: function width(el) {
      if (el) {
        var width2 = el.offsetWidth;
        var style = getComputedStyle(el);
        width2 -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        return width2;
      }
      return 0;
    },
    getWindowScrollTop: function getWindowScrollTop() {
      var doc2 = document.documentElement;
      return (window.pageYOffset || doc2.scrollTop) - (doc2.clientTop || 0);
    },
    getWindowScrollLeft: function getWindowScrollLeft() {
      var doc2 = document.documentElement;
      return (window.pageXOffset || doc2.scrollLeft) - (doc2.clientLeft || 0);
    },
    getOuterWidth: function getOuterWidth(el, margin) {
      if (el) {
        var width = el.offsetWidth;
        if (margin) {
          var style = getComputedStyle(el);
          width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        }
        return width;
      }
      return 0;
    },
    getOuterHeight: function getOuterHeight(el, margin) {
      if (el) {
        var height = el.offsetHeight;
        if (margin) {
          var style = getComputedStyle(el);
          height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        }
        return height;
      }
      return 0;
    },
    getClientHeight: function getClientHeight(el, margin) {
      if (el) {
        var height = el.clientHeight;
        if (margin) {
          var style = getComputedStyle(el);
          height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        }
        return height;
      }
      return 0;
    },
    getViewport: function getViewport() {
      var win = window, d = document, e = d.documentElement, g2 = d.getElementsByTagName("body")[0], w = win.innerWidth || e.clientWidth || g2.clientWidth, h2 = win.innerHeight || e.clientHeight || g2.clientHeight;
      return {
        width: w,
        height: h2
      };
    },
    getOffset: function getOffset(el) {
      if (el) {
        var rect = el.getBoundingClientRect();
        return {
          top: rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
          left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0)
        };
      }
      return {
        top: "auto",
        left: "auto"
      };
    },
    index: function index(element) {
      if (element) {
        var _this$getParentNode;
        var children = (_this$getParentNode = this.getParentNode(element)) === null || _this$getParentNode === void 0 ? void 0 : _this$getParentNode.childNodes;
        var num = 0;
        for (var i = 0; i < children.length; i++) {
          if (children[i] === element)
            return num;
          if (children[i].nodeType === 1)
            num++;
        }
      }
      return -1;
    },
    addMultipleClasses: function addMultipleClasses(element, classNames) {
      var _this = this;
      if (element && classNames) {
        [classNames].flat().filter(Boolean).forEach(function(cNames) {
          return cNames.split(" ").forEach(function(className) {
            return _this.addClass(element, className);
          });
        });
      }
    },
    removeMultipleClasses: function removeMultipleClasses(element, classNames) {
      var _this2 = this;
      if (element && classNames) {
        [classNames].flat().filter(Boolean).forEach(function(cNames) {
          return cNames.split(" ").forEach(function(className) {
            return _this2.removeClass(element, className);
          });
        });
      }
    },
    addClass: function addClass(element, className) {
      if (element && className && !this.hasClass(element, className)) {
        if (element.classList)
          element.classList.add(className);
        else
          element.className += " " + className;
      }
    },
    removeClass: function removeClass(element, className) {
      if (element && className) {
        if (element.classList)
          element.classList.remove(className);
        else
          element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
      }
    },
    hasClass: function hasClass(element, className) {
      if (element) {
        if (element.classList)
          return element.classList.contains(className);
        else
          return new RegExp("(^| )" + className + "( |$)", "gi").test(element.className);
      }
      return false;
    },
    addStyles: function addStyles(element) {
      var styles = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      if (element) {
        Object.entries(styles).forEach(function(_ref) {
          var _ref2 = _slicedToArray$1$1(_ref, 2), key = _ref2[0], value = _ref2[1];
          return element.style[key] = value;
        });
      }
    },
    find: function find(element, selector) {
      return this.isElement(element) ? element.querySelectorAll(selector) : [];
    },
    findSingle: function findSingle(element, selector) {
      return this.isElement(element) ? element.querySelector(selector) : null;
    },
    createElement: function createElement(type) {
      var attributes = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      if (type) {
        var element = document.createElement(type);
        this.setAttributes(element, attributes);
        for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          children[_key - 2] = arguments[_key];
        }
        element.append.apply(element, children);
        return element;
      }
      return void 0;
    },
    setAttribute: function setAttribute(element) {
      var attribute = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      var value = arguments.length > 2 ? arguments[2] : void 0;
      if (this.isElement(element) && value !== null && value !== void 0) {
        element.setAttribute(attribute, value);
      }
    },
    setAttributes: function setAttributes(element) {
      var _this3 = this;
      var attributes = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      if (this.isElement(element)) {
        var computedStyles = function computedStyles2(rule, value) {
          var _element$$attrs, _element$$attrs2;
          var styles = element !== null && element !== void 0 && (_element$$attrs = element.$attrs) !== null && _element$$attrs !== void 0 && _element$$attrs[rule] ? [element === null || element === void 0 || (_element$$attrs2 = element.$attrs) === null || _element$$attrs2 === void 0 ? void 0 : _element$$attrs2[rule]] : [];
          return [value].flat().reduce(function(cv, v) {
            if (v !== null && v !== void 0) {
              var type = _typeof$3$1(v);
              if (type === "string" || type === "number") {
                cv.push(v);
              } else if (type === "object") {
                var _cv = Array.isArray(v) ? computedStyles2(rule, v) : Object.entries(v).map(function(_ref3) {
                  var _ref4 = _slicedToArray$1$1(_ref3, 2), _k = _ref4[0], _v = _ref4[1];
                  return rule === "style" && (!!_v || _v === 0) ? "".concat(_k.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), ":").concat(_v) : !!_v ? _k : void 0;
                });
                cv = _cv.length ? cv.concat(_cv.filter(function(c2) {
                  return !!c2;
                })) : cv;
              }
            }
            return cv;
          }, styles);
        };
        Object.entries(attributes).forEach(function(_ref5) {
          var _ref6 = _slicedToArray$1$1(_ref5, 2), key = _ref6[0], value = _ref6[1];
          if (value !== void 0 && value !== null) {
            var matchedEvent = key.match(/^on(.+)/);
            if (matchedEvent) {
              element.addEventListener(matchedEvent[1].toLowerCase(), value);
            } else if (key === "p-bind") {
              _this3.setAttributes(element, value);
            } else {
              value = key === "class" ? _toConsumableArray$3(new Set(computedStyles("class", value))).join(" ").trim() : key === "style" ? computedStyles("style", value).join(";").trim() : value;
              (element.$attrs = element.$attrs || {}) && (element.$attrs[key] = value);
              element.setAttribute(key, value);
            }
          }
        });
      }
    },
    getAttribute: function getAttribute(element, name) {
      if (this.isElement(element)) {
        var value = element.getAttribute(name);
        if (!isNaN(value)) {
          return +value;
        }
        if (value === "true" || value === "false") {
          return value === "true";
        }
        return value;
      }
      return void 0;
    },
    isAttributeEquals: function isAttributeEquals(element, name, value) {
      return this.isElement(element) ? this.getAttribute(element, name) === value : false;
    },
    isAttributeNotEquals: function isAttributeNotEquals(element, name, value) {
      return !this.isAttributeEquals(element, name, value);
    },
    getHeight: function getHeight(el) {
      if (el) {
        var height = el.offsetHeight;
        var style = getComputedStyle(el);
        height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
        return height;
      }
      return 0;
    },
    getWidth: function getWidth(el) {
      if (el) {
        var width = el.offsetWidth;
        var style = getComputedStyle(el);
        width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
        return width;
      }
      return 0;
    },
    absolutePosition: function absolutePosition(element, target) {
      if (element) {
        var elementDimensions = element.offsetParent ? {
          width: element.offsetWidth,
          height: element.offsetHeight
        } : this.getHiddenElementDimensions(element);
        var elementOuterHeight = elementDimensions.height;
        var elementOuterWidth = elementDimensions.width;
        var targetOuterHeight = target.offsetHeight;
        var targetOuterWidth = target.offsetWidth;
        var targetOffset = target.getBoundingClientRect();
        var windowScrollTop = this.getWindowScrollTop();
        var windowScrollLeft = this.getWindowScrollLeft();
        var viewport = this.getViewport();
        var top, left;
        if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
          top = targetOffset.top + windowScrollTop - elementOuterHeight;
          element.style.transformOrigin = "bottom";
          if (top < 0) {
            top = windowScrollTop;
          }
        } else {
          top = targetOuterHeight + targetOffset.top + windowScrollTop;
          element.style.transformOrigin = "top";
        }
        if (targetOffset.left + elementOuterWidth > viewport.width)
          left = Math.max(0, targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth);
        else
          left = targetOffset.left + windowScrollLeft;
        element.style.top = top + "px";
        element.style.left = left + "px";
      }
    },
    relativePosition: function relativePosition(element, target) {
      if (element) {
        var elementDimensions = element.offsetParent ? {
          width: element.offsetWidth,
          height: element.offsetHeight
        } : this.getHiddenElementDimensions(element);
        var targetHeight = target.offsetHeight;
        var targetOffset = target.getBoundingClientRect();
        var viewport = this.getViewport();
        var top, left;
        if (targetOffset.top + targetHeight + elementDimensions.height > viewport.height) {
          top = -1 * elementDimensions.height;
          element.style.transformOrigin = "bottom";
          if (targetOffset.top + top < 0) {
            top = -1 * targetOffset.top;
          }
        } else {
          top = targetHeight;
          element.style.transformOrigin = "top";
        }
        if (elementDimensions.width > viewport.width) {
          left = targetOffset.left * -1;
        } else if (targetOffset.left + elementDimensions.width > viewport.width) {
          left = (targetOffset.left + elementDimensions.width - viewport.width) * -1;
        } else {
          left = 0;
        }
        element.style.top = top + "px";
        element.style.left = left + "px";
      }
    },
    nestedPosition: function nestedPosition(element, level) {
      if (element) {
        var parentItem = element.parentElement;
        var elementOffset = this.getOffset(parentItem);
        var viewport = this.getViewport();
        var sublistWidth = element.offsetParent ? element.offsetWidth : this.getHiddenElementOuterWidth(element);
        var itemOuterWidth = this.getOuterWidth(parentItem.children[0]);
        var left;
        if (parseInt(elementOffset.left, 10) + itemOuterWidth + sublistWidth > viewport.width - this.calculateScrollbarWidth()) {
          if (parseInt(elementOffset.left, 10) < sublistWidth) {
            if (level % 2 === 1) {
              left = parseInt(elementOffset.left, 10) ? "-" + parseInt(elementOffset.left, 10) + "px" : "100%";
            } else if (level % 2 === 0) {
              left = viewport.width - sublistWidth - this.calculateScrollbarWidth() + "px";
            }
          } else {
            left = "-100%";
          }
        } else {
          left = "100%";
        }
        element.style.top = "0px";
        element.style.left = left;
      }
    },
    getParentNode: function getParentNode(element) {
      var parent = element === null || element === void 0 ? void 0 : element.parentNode;
      if (parent && parent.host) {
        parent = parent.host;
      }
      return parent;
    },
    getParents: function getParents(element) {
      var parents = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
      var parent = this.getParentNode(element);
      return parent === null ? parents : this.getParents(parent, parents.concat([parent]));
    },
    getScrollableParents: function getScrollableParents(element) {
      var scrollableParents = [];
      if (element) {
        var parents = this.getParents(element);
        var overflowRegex = /(auto|scroll)/;
        var overflowCheck = function overflowCheck2(node) {
          try {
            var styleDeclaration = window["getComputedStyle"](node, null);
            return overflowRegex.test(styleDeclaration.getPropertyValue("overflow")) || overflowRegex.test(styleDeclaration.getPropertyValue("overflowX")) || overflowRegex.test(styleDeclaration.getPropertyValue("overflowY"));
          } catch (err) {
            return false;
          }
        };
        var _iterator = _createForOfIteratorHelper$1(parents), _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done; ) {
            var parent = _step.value;
            var scrollSelectors = parent.nodeType === 1 && parent.dataset["scrollselectors"];
            if (scrollSelectors) {
              var selectors = scrollSelectors.split(",");
              var _iterator2 = _createForOfIteratorHelper$1(selectors), _step2;
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
                  var selector = _step2.value;
                  var el = this.findSingle(parent, selector);
                  if (el && overflowCheck(el)) {
                    scrollableParents.push(el);
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            }
            if (parent.nodeType !== 9 && overflowCheck(parent)) {
              scrollableParents.push(parent);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      return scrollableParents;
    },
    getHiddenElementOuterHeight: function getHiddenElementOuterHeight(element) {
      if (element) {
        element.style.visibility = "hidden";
        element.style.display = "block";
        var elementHeight = element.offsetHeight;
        element.style.display = "none";
        element.style.visibility = "visible";
        return elementHeight;
      }
      return 0;
    },
    getHiddenElementOuterWidth: function getHiddenElementOuterWidth(element) {
      if (element) {
        element.style.visibility = "hidden";
        element.style.display = "block";
        var elementWidth = element.offsetWidth;
        element.style.display = "none";
        element.style.visibility = "visible";
        return elementWidth;
      }
      return 0;
    },
    getHiddenElementDimensions: function getHiddenElementDimensions(element) {
      if (element) {
        var dimensions = {};
        element.style.visibility = "hidden";
        element.style.display = "block";
        dimensions.width = element.offsetWidth;
        dimensions.height = element.offsetHeight;
        element.style.display = "none";
        element.style.visibility = "visible";
        return dimensions;
      }
      return 0;
    },
    fadeIn: function fadeIn(element, duration) {
      if (element) {
        element.style.opacity = 0;
        var last = +/* @__PURE__ */ new Date();
        var opacity = 0;
        var tick = function tick2() {
          opacity = +element.style.opacity + ((/* @__PURE__ */ new Date()).getTime() - last) / duration;
          element.style.opacity = opacity;
          last = +/* @__PURE__ */ new Date();
          if (+opacity < 1) {
            window.requestAnimationFrame && requestAnimationFrame(tick2) || setTimeout(tick2, 16);
          }
        };
        tick();
      }
    },
    fadeOut: function fadeOut(element, ms) {
      if (element) {
        var opacity = 1, interval = 50, duration = ms, gap = interval / duration;
        var fading = setInterval(function() {
          opacity -= gap;
          if (opacity <= 0) {
            opacity = 0;
            clearInterval(fading);
          }
          element.style.opacity = opacity;
        }, interval);
      }
    },
    getUserAgent: function getUserAgent() {
      return navigator.userAgent;
    },
    appendChild: function appendChild(element, target) {
      if (this.isElement(target))
        target.appendChild(element);
      else if (target.el && target.elElement)
        target.elElement.appendChild(element);
      else
        throw new Error("Cannot append " + target + " to " + element);
    },
    isElement: function isElement(obj) {
      return (typeof HTMLElement === "undefined" ? "undefined" : _typeof$3$1(HTMLElement)) === "object" ? obj instanceof HTMLElement : obj && _typeof$3$1(obj) === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string";
    },
    scrollInView: function scrollInView(container, item) {
      var borderTopValue = getComputedStyle(container).getPropertyValue("borderTopWidth");
      var borderTop = borderTopValue ? parseFloat(borderTopValue) : 0;
      var paddingTopValue = getComputedStyle(container).getPropertyValue("paddingTop");
      var paddingTop = paddingTopValue ? parseFloat(paddingTopValue) : 0;
      var containerRect = container.getBoundingClientRect();
      var itemRect = item.getBoundingClientRect();
      var offset = itemRect.top + document.body.scrollTop - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
      var scroll = container.scrollTop;
      var elementHeight = container.clientHeight;
      var itemHeight = this.getOuterHeight(item);
      if (offset < 0) {
        container.scrollTop = scroll + offset;
      } else if (offset + itemHeight > elementHeight) {
        container.scrollTop = scroll + offset - elementHeight + itemHeight;
      }
    },
    clearSelection: function clearSelection() {
      if (window.getSelection) {
        if (window.getSelection().empty) {
          window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges && window.getSelection().rangeCount > 0 && window.getSelection().getRangeAt(0).getClientRects().length > 0) {
          window.getSelection().removeAllRanges();
        }
      } else if (document["selection"] && document["selection"].empty) {
        try {
          document["selection"].empty();
        } catch (error) {
        }
      }
    },
    getSelection: function getSelection() {
      if (window.getSelection)
        return window.getSelection().toString();
      else if (document.getSelection)
        return document.getSelection().toString();
      else if (document["selection"])
        return document["selection"].createRange().text;
      return null;
    },
    calculateScrollbarWidth: function calculateScrollbarWidth() {
      if (this.calculatedScrollbarWidth != null)
        return this.calculatedScrollbarWidth;
      var scrollDiv = document.createElement("div");
      this.addStyles(scrollDiv, {
        width: "100px",
        height: "100px",
        overflow: "scroll",
        position: "absolute",
        top: "-9999px"
      });
      document.body.appendChild(scrollDiv);
      var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      this.calculatedScrollbarWidth = scrollbarWidth;
      return scrollbarWidth;
    },
    calculateBodyScrollbarWidth: function calculateBodyScrollbarWidth() {
      return window.innerWidth - document.documentElement.offsetWidth;
    },
    getBrowser: function getBrowser() {
      if (!this.browser) {
        var matched = this.resolveUserAgent();
        this.browser = {};
        if (matched.browser) {
          this.browser[matched.browser] = true;
          this.browser["version"] = matched.version;
        }
        if (this.browser["chrome"]) {
          this.browser["webkit"] = true;
        } else if (this.browser["webkit"]) {
          this.browser["safari"] = true;
        }
      }
      return this.browser;
    },
    resolveUserAgent: function resolveUserAgent() {
      var ua = navigator.userAgent.toLowerCase();
      var match = /(chrome)[ ]([\w.]+)/.exec(ua) || /(webkit)[ ]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ ]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
      return {
        browser: match[1] || "",
        version: match[2] || "0"
      };
    },
    isVisible: function isVisible(element) {
      return element && element.offsetParent != null;
    },
    invokeElementMethod: function invokeElementMethod(element, methodName, args) {
      element[methodName].apply(element, args);
    },
    isExist: function isExist(element) {
      return !!(element !== null && typeof element !== "undefined" && element.nodeName && this.getParentNode(element));
    },
    isClient: function isClient2() {
      return !!(typeof window !== "undefined" && window.document && window.document.createElement);
    },
    focus: function focus(el, options) {
      el && document.activeElement !== el && el.focus(options);
    },
    isFocusableElement: function isFocusableElement(element) {
      var selector = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      return this.isElement(element) ? element.matches('button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])'.concat(selector, ',\n                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector)) : false;
    },
    getFocusableElements: function getFocusableElements(element) {
      var selector = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      var focusableElements = this.find(element, 'button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])'.concat(selector, ',\n                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector));
      var visibleFocusableElements = [];
      var _iterator3 = _createForOfIteratorHelper$1(focusableElements), _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
          var focusableElement = _step3.value;
          if (getComputedStyle(focusableElement).display != "none" && getComputedStyle(focusableElement).visibility != "hidden")
            visibleFocusableElements.push(focusableElement);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return visibleFocusableElements;
    },
    getFirstFocusableElement: function getFirstFocusableElement(element, selector) {
      var focusableElements = this.getFocusableElements(element, selector);
      return focusableElements.length > 0 ? focusableElements[0] : null;
    },
    getLastFocusableElement: function getLastFocusableElement(element, selector) {
      var focusableElements = this.getFocusableElements(element, selector);
      return focusableElements.length > 0 ? focusableElements[focusableElements.length - 1] : null;
    },
    getNextFocusableElement: function getNextFocusableElement(container, element, selector) {
      var focusableElements = this.getFocusableElements(container, selector);
      var index = focusableElements.length > 0 ? focusableElements.findIndex(function(el) {
        return el === element;
      }) : -1;
      var nextIndex = index > -1 && focusableElements.length >= index + 1 ? index + 1 : -1;
      return nextIndex > -1 ? focusableElements[nextIndex] : null;
    },
    getPreviousElementSibling: function getPreviousElementSibling(element, selector) {
      var previousElement = element.previousElementSibling;
      while (previousElement) {
        if (previousElement.matches(selector)) {
          return previousElement;
        } else {
          previousElement = previousElement.previousElementSibling;
        }
      }
      return null;
    },
    getNextElementSibling: function getNextElementSibling(element, selector) {
      var nextElement = element.nextElementSibling;
      while (nextElement) {
        if (nextElement.matches(selector)) {
          return nextElement;
        } else {
          nextElement = nextElement.nextElementSibling;
        }
      }
      return null;
    },
    isClickable: function isClickable(element) {
      if (element) {
        var targetNode = element.nodeName;
        var parentNode = element.parentElement && element.parentElement.nodeName;
        return targetNode === "INPUT" || targetNode === "TEXTAREA" || targetNode === "BUTTON" || targetNode === "A" || parentNode === "INPUT" || parentNode === "TEXTAREA" || parentNode === "BUTTON" || parentNode === "A" || !!element.closest(".p-button, .p-checkbox, .p-radiobutton");
      }
      return false;
    },
    applyStyle: function applyStyle(element, style) {
      if (typeof style === "string") {
        element.style.cssText = style;
      } else {
        for (var prop in style) {
          element.style[prop] = style[prop];
        }
      }
    },
    isIOS: function isIOS() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window["MSStream"];
    },
    isAndroid: function isAndroid() {
      return /(android)/i.test(navigator.userAgent);
    },
    isTouchDevice: function isTouchDevice() {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    },
    hasCSSAnimation: function hasCSSAnimation(element) {
      if (element) {
        var style = getComputedStyle(element);
        var animationDuration = parseFloat(style.getPropertyValue("animation-duration") || "0");
        return animationDuration > 0;
      }
      return false;
    },
    hasCSSTransition: function hasCSSTransition(element) {
      if (element) {
        var style = getComputedStyle(element);
        var transitionDuration = parseFloat(style.getPropertyValue("transition-duration") || "0");
        return transitionDuration > 0;
      }
      return false;
    },
    exportCSV: function exportCSV(csv, filename) {
      var blob = new Blob([csv], {
        type: "application/csv;charset=utf-8;"
      });
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename + ".csv");
      } else {
        var link = document.createElement("a");
        if (link.download !== void 0) {
          link.setAttribute("href", URL.createObjectURL(blob));
          link.setAttribute("download", filename + ".csv");
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          csv = "data:text/csv;charset=utf-8," + csv;
          window.open(encodeURI(csv));
        }
      }
    },
    blockBodyScroll: function blockBodyScroll() {
      var className = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "p-overflow-hidden";
      document.body.style.setProperty("--scrollbar-width", this.calculateBodyScrollbarWidth() + "px");
      this.addClass(document.body, className);
    },
    unblockBodyScroll: function unblockBodyScroll() {
      var className = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "p-overflow-hidden";
      document.body.style.removeProperty("--scrollbar-width");
      this.removeClass(document.body, className);
    }
  };
  function _typeof$2$1(o) {
    "@babel/helpers - typeof";
    return _typeof$2$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof$2$1(o);
  }
  function _classCallCheck$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties$1(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey$1$2(descriptor.key), descriptor);
    }
  }
  function _createClass$1(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties$1(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties$1(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  function _toPropertyKey$1$2(t) {
    var i = _toPrimitive$1$2(t, "string");
    return "symbol" == _typeof$2$1(i) ? i : String(i);
  }
  function _toPrimitive$1$2(t, r2) {
    if ("object" != _typeof$2$1(t) || !t)
      return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r2 || "default");
      if ("object" != _typeof$2$1(i))
        return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t);
  }
  var ConnectedOverlayScrollHandler = /* @__PURE__ */ function() {
    function ConnectedOverlayScrollHandler2(element) {
      var listener = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
      };
      _classCallCheck$1(this, ConnectedOverlayScrollHandler2);
      this.element = element;
      this.listener = listener;
    }
    _createClass$1(ConnectedOverlayScrollHandler2, [{
      key: "bindScrollListener",
      value: function bindScrollListener() {
        this.scrollableParents = DomHandler.getScrollableParents(this.element);
        for (var i = 0; i < this.scrollableParents.length; i++) {
          this.scrollableParents[i].addEventListener("scroll", this.listener);
        }
      }
    }, {
      key: "unbindScrollListener",
      value: function unbindScrollListener() {
        if (this.scrollableParents) {
          for (var i = 0; i < this.scrollableParents.length; i++) {
            this.scrollableParents[i].removeEventListener("scroll", this.listener);
          }
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.unbindScrollListener();
        this.element = null;
        this.listener = null;
        this.scrollableParents = null;
      }
    }]);
    return ConnectedOverlayScrollHandler2;
  }();
  function primebus() {
    var allHandlers = /* @__PURE__ */ new Map();
    return {
      on: function on(type, handler2) {
        var handlers = allHandlers.get(type);
        if (!handlers)
          handlers = [handler2];
        else
          handlers.push(handler2);
        allHandlers.set(type, handlers);
      },
      off: function off(type, handler2) {
        var handlers = allHandlers.get(type);
        if (handlers) {
          handlers.splice(handlers.indexOf(handler2) >>> 0, 1);
        }
      },
      emit: function emit2(type, evt) {
        var handlers = allHandlers.get(type);
        if (handlers) {
          handlers.slice().map(function(handler2) {
            handler2(evt);
          });
        }
      }
    };
  }
  function _slicedToArray$2(arr, i) {
    return _arrayWithHoles$2(arr) || _iterableToArrayLimit$2(arr, i) || _unsupportedIterableToArray$2$1(arr, i) || _nonIterableRest$2();
  }
  function _nonIterableRest$2() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _iterableToArrayLimit$2(r2, l2) {
    var t = null == r2 ? null : "undefined" != typeof Symbol && r2[Symbol.iterator] || r2["@@iterator"];
    if (null != t) {
      var e, n, i, u, a = [], f = true, o = false;
      try {
        if (i = (t = t.call(r2)).next, 0 === l2) {
          if (Object(t) !== t)
            return;
          f = false;
        } else
          for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l2); f = true)
            ;
      } catch (r3) {
        o = true, n = r3;
      } finally {
        try {
          if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
            return;
        } finally {
          if (o)
            throw n;
        }
      }
      return a;
    }
  }
  function _arrayWithHoles$2(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function _toConsumableArray$2$1(arr) {
    return _arrayWithoutHoles$2$1(arr) || _iterableToArray$2$1(arr) || _unsupportedIterableToArray$2$1(arr) || _nonIterableSpread$2$1();
  }
  function _nonIterableSpread$2$1() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _iterableToArray$2$1(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
      return Array.from(iter);
  }
  function _arrayWithoutHoles$2$1(arr) {
    if (Array.isArray(arr))
      return _arrayLikeToArray$2$1(arr);
  }
  function _createForOfIteratorHelper$2(o, allowArrayLike) {
    var it2 = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it2) {
      if (Array.isArray(o) || (it2 = _unsupportedIterableToArray$2$1(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it2)
          o = it2;
        var i = 0;
        var F = function F2() {
        };
        return { s: F, n: function n() {
          if (i >= o.length)
            return { done: true };
          return { done: false, value: o[i++] };
        }, e: function e(_e2) {
          throw _e2;
        }, f: F };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return { s: function s() {
      it2 = it2.call(o);
    }, n: function n() {
      var step = it2.next();
      normalCompletion = step.done;
      return step;
    }, e: function e(_e2) {
      didErr = true;
      err = _e2;
    }, f: function f() {
      try {
        if (!normalCompletion && it2["return"] != null)
          it2["return"]();
      } finally {
        if (didErr)
          throw err;
      }
    } };
  }
  function _unsupportedIterableToArray$2$1(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray$2$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray$2$1(o, minLen);
  }
  function _arrayLikeToArray$2$1(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  function _typeof$1$3(o) {
    "@babel/helpers - typeof";
    return _typeof$1$3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof$1$3(o);
  }
  var ObjectUtils = {
    equals: function equals(obj1, obj2, field) {
      if (field)
        return this.resolveFieldData(obj1, field) === this.resolveFieldData(obj2, field);
      else
        return this.deepEquals(obj1, obj2);
    },
    deepEquals: function deepEquals(a, b) {
      if (a === b)
        return true;
      if (a && b && _typeof$1$3(a) == "object" && _typeof$1$3(b) == "object") {
        var arrA = Array.isArray(a), arrB = Array.isArray(b), i, length, key;
        if (arrA && arrB) {
          length = a.length;
          if (length != b.length)
            return false;
          for (i = length; i-- !== 0; )
            if (!this.deepEquals(a[i], b[i]))
              return false;
          return true;
        }
        if (arrA != arrB)
          return false;
        var dateA = a instanceof Date, dateB = b instanceof Date;
        if (dateA != dateB)
          return false;
        if (dateA && dateB)
          return a.getTime() == b.getTime();
        var regexpA = a instanceof RegExp, regexpB = b instanceof RegExp;
        if (regexpA != regexpB)
          return false;
        if (regexpA && regexpB)
          return a.toString() == b.toString();
        var keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length)
          return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
            return false;
        for (i = length; i-- !== 0; ) {
          key = keys[i];
          if (!this.deepEquals(a[key], b[key]))
            return false;
        }
        return true;
      }
      return a !== a && b !== b;
    },
    resolveFieldData: function resolveFieldData(data, field) {
      if (!data || !field) {
        return null;
      }
      try {
        var value = data[field];
        if (this.isNotEmpty(value))
          return value;
      } catch (_unused) {
      }
      if (Object.keys(data).length) {
        if (this.isFunction(field)) {
          return field(data);
        } else if (field.indexOf(".") === -1) {
          return data[field];
        } else {
          var fields = field.split(".");
          var _value = data;
          for (var i = 0, len = fields.length; i < len; ++i) {
            if (_value == null) {
              return null;
            }
            _value = _value[fields[i]];
          }
          return _value;
        }
      }
      return null;
    },
    getItemValue: function getItemValue(obj) {
      for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }
      return this.isFunction(obj) ? obj.apply(void 0, params) : obj;
    },
    filter: function filter(value, fields, filterValue) {
      var filteredItems = [];
      if (value) {
        var _iterator = _createForOfIteratorHelper$2(value), _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done; ) {
            var item = _step.value;
            var _iterator2 = _createForOfIteratorHelper$2(fields), _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
                var field = _step2.value;
                if (String(this.resolveFieldData(item, field)).toLowerCase().indexOf(filterValue.toLowerCase()) > -1) {
                  filteredItems.push(item);
                  break;
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      return filteredItems;
    },
    reorderArray: function reorderArray(value, from, to) {
      if (value && from !== to) {
        if (to >= value.length) {
          to %= value.length;
          from %= value.length;
        }
        value.splice(to, 0, value.splice(from, 1)[0]);
      }
    },
    findIndexInList: function findIndexInList(value, list) {
      var index = -1;
      if (list) {
        for (var i = 0; i < list.length; i++) {
          if (list[i] === value) {
            index = i;
            break;
          }
        }
      }
      return index;
    },
    contains: function contains(value, list) {
      if (value != null && list && list.length) {
        var _iterator3 = _createForOfIteratorHelper$2(list), _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
            var val = _step3.value;
            if (this.equals(value, val))
              return true;
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
      return false;
    },
    insertIntoOrderedArray: function insertIntoOrderedArray(item, index, arr, sourceArr) {
      if (arr.length > 0) {
        var injected = false;
        for (var i = 0; i < arr.length; i++) {
          var currentItemIndex = this.findIndexInList(arr[i], sourceArr);
          if (currentItemIndex > index) {
            arr.splice(i, 0, item);
            injected = true;
            break;
          }
        }
        if (!injected) {
          arr.push(item);
        }
      } else {
        arr.push(item);
      }
    },
    removeAccents: function removeAccents(str) {
      if (str && str.search(/[\xC0-\xFF]/g) > -1) {
        str = str.replace(/[\xC0-\xC5]/g, "A").replace(/[\xC6]/g, "AE").replace(/[\xC7]/g, "C").replace(/[\xC8-\xCB]/g, "E").replace(/[\xCC-\xCF]/g, "I").replace(/[\xD0]/g, "D").replace(/[\xD1]/g, "N").replace(/[\xD2-\xD6\xD8]/g, "O").replace(/[\xD9-\xDC]/g, "U").replace(/[\xDD]/g, "Y").replace(/[\xDE]/g, "P").replace(/[\xE0-\xE5]/g, "a").replace(/[\xE6]/g, "ae").replace(/[\xE7]/g, "c").replace(/[\xE8-\xEB]/g, "e").replace(/[\xEC-\xEF]/g, "i").replace(/[\xF1]/g, "n").replace(/[\xF2-\xF6\xF8]/g, "o").replace(/[\xF9-\xFC]/g, "u").replace(/[\xFE]/g, "p").replace(/[\xFD\xFF]/g, "y");
      }
      return str;
    },
    getVNodeProp: function getVNodeProp(vnode, prop) {
      if (vnode) {
        var props = vnode.props;
        if (props) {
          var kebabProp = prop.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
          var propName = Object.prototype.hasOwnProperty.call(props, kebabProp) ? kebabProp : prop;
          return vnode.type["extends"].props[prop].type === Boolean && props[propName] === "" ? true : props[propName];
        }
      }
      return null;
    },
    toFlatCase: function toFlatCase(str) {
      return this.isString(str) ? str.replace(/(-|_)/g, "").toLowerCase() : str;
    },
    toKebabCase: function toKebabCase(str) {
      return this.isString(str) ? str.replace(/(_)/g, "-").replace(/[A-Z]/g, function(c2, i) {
        return i === 0 ? c2 : "-" + c2.toLowerCase();
      }).toLowerCase() : str;
    },
    toCapitalCase: function toCapitalCase(str) {
      return this.isString(str, {
        empty: false
      }) ? str[0].toUpperCase() + str.slice(1) : str;
    },
    isEmpty: function isEmpty2(value) {
      return value === null || value === void 0 || value === "" || Array.isArray(value) && value.length === 0 || !(value instanceof Date) && _typeof$1$3(value) === "object" && Object.keys(value).length === 0;
    },
    isNotEmpty: function isNotEmpty(value) {
      return !this.isEmpty(value);
    },
    isFunction: function isFunction2(value) {
      return !!(value && value.constructor && value.call && value.apply);
    },
    isObject: function isObject2(value) {
      var empty = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      return value instanceof Object && value.constructor === Object && (empty || Object.keys(value).length !== 0);
    },
    isDate: function isDate2(value) {
      return value instanceof Date && value.constructor === Date;
    },
    isArray: function isArray2(value) {
      var empty = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      return Array.isArray(value) && (empty || value.length !== 0);
    },
    isString: function isString2(value) {
      var empty = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      return typeof value === "string" && (empty || value !== "");
    },
    isPrintableCharacter: function isPrintableCharacter() {
      var _char = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return this.isNotEmpty(_char) && _char.length === 1 && _char.match(/\S| /);
    },
    /**
     * Firefox-v103 does not currently support the "findLast" method. It is stated that this method will be supported with Firefox-v104.
     * https://caniuse.com/mdn-javascript_builtins_array_findlast
     */
    findLast: function findLast(arr, callback) {
      var item;
      if (this.isNotEmpty(arr)) {
        try {
          item = arr.findLast(callback);
        } catch (_unused2) {
          item = _toConsumableArray$2$1(arr).reverse().find(callback);
        }
      }
      return item;
    },
    /**
     * Firefox-v103 does not currently support the "findLastIndex" method. It is stated that this method will be supported with Firefox-v104.
     * https://caniuse.com/mdn-javascript_builtins_array_findlastindex
     */
    findLastIndex: function findLastIndex(arr, callback) {
      var index = -1;
      if (this.isNotEmpty(arr)) {
        try {
          index = arr.findLastIndex(callback);
        } catch (_unused3) {
          index = arr.lastIndexOf(_toConsumableArray$2$1(arr).reverse().find(callback));
        }
      }
      return index;
    },
    sort: function sort(value1, value2) {
      var order = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
      var comparator2 = arguments.length > 3 ? arguments[3] : void 0;
      var nullSortOrder = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 1;
      var result = this.compare(value1, value2, comparator2, order);
      var finalSortOrder = order;
      if (this.isEmpty(value1) || this.isEmpty(value2)) {
        finalSortOrder = nullSortOrder === 1 ? order : nullSortOrder;
      }
      return finalSortOrder * result;
    },
    compare: function compare(value1, value2, comparator2) {
      var order = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 1;
      var result = -1;
      var emptyValue1 = this.isEmpty(value1);
      var emptyValue2 = this.isEmpty(value2);
      if (emptyValue1 && emptyValue2)
        result = 0;
      else if (emptyValue1)
        result = order;
      else if (emptyValue2)
        result = -order;
      else if (typeof value1 === "string" && typeof value2 === "string")
        result = comparator2(value1, value2);
      else
        result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
      return result;
    },
    localeComparator: function localeComparator() {
      return new Intl.Collator(void 0, {
        numeric: true
      }).compare;
    },
    nestedKeys: function nestedKeys() {
      var _this = this;
      var obj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var parentKey = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      return Object.entries(obj).reduce(function(o, _ref) {
        var _ref2 = _slicedToArray$2(_ref, 2), key = _ref2[0], value = _ref2[1];
        var currentKey = parentKey ? "".concat(parentKey, ".").concat(key) : key;
        _this.isObject(value) ? o = o.concat(_this.nestedKeys(value, currentKey)) : o.push(currentKey);
        return o;
      }, []);
    },
    stringify: function stringify(value) {
      var _this2 = this;
      var indent = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
      var currentIndent = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
      var currentIndentStr = " ".repeat(currentIndent);
      var nextIndentStr = " ".repeat(currentIndent + indent);
      if (this.isArray(value)) {
        return "[" + value.map(function(v) {
          return _this2.stringify(v, indent, currentIndent + indent);
        }).join(", ") + "]";
      } else if (this.isDate(value)) {
        return value.toISOString();
      } else if (this.isFunction(value)) {
        return value.toString();
      } else if (this.isObject(value)) {
        return "{\n" + Object.entries(value).map(function(_ref3) {
          var _ref4 = _slicedToArray$2(_ref3, 2), k2 = _ref4[0], v = _ref4[1];
          return "".concat(nextIndentStr).concat(k2, ": ").concat(_this2.stringify(v, indent, currentIndent + indent));
        }).join(",\n") + "\n".concat(currentIndentStr) + "}";
      } else {
        return JSON.stringify(value);
      }
    }
  };
  var lastId = 0;
  function UniqueComponentId() {
    var prefix = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pv_id_";
    lastId++;
    return "".concat(prefix).concat(lastId);
  }
  function _toConsumableArray$4(arr) {
    return _arrayWithoutHoles$4(arr) || _iterableToArray$4(arr) || _unsupportedIterableToArray$5(arr) || _nonIterableSpread$4();
  }
  function _nonIterableSpread$4() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray$5(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray$5(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray$5(o, minLen);
  }
  function _iterableToArray$4(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
      return Array.from(iter);
  }
  function _arrayWithoutHoles$4(arr) {
    if (Array.isArray(arr))
      return _arrayLikeToArray$5(arr);
  }
  function _arrayLikeToArray$5(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  function handler() {
    var zIndexes = [];
    var generateZIndex = function generateZIndex2(key, autoZIndex) {
      var baseZIndex = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 999;
      var lastZIndex = getLastZIndex(key, autoZIndex, baseZIndex);
      var newZIndex = lastZIndex.value + (lastZIndex.key === key ? 0 : baseZIndex) + 1;
      zIndexes.push({
        key,
        value: newZIndex
      });
      return newZIndex;
    };
    var revertZIndex = function revertZIndex2(zIndex) {
      zIndexes = zIndexes.filter(function(obj) {
        return obj.value !== zIndex;
      });
    };
    var getCurrentZIndex = function getCurrentZIndex2(key, autoZIndex) {
      return getLastZIndex(key, autoZIndex).value;
    };
    var getLastZIndex = function getLastZIndex2(key, autoZIndex) {
      var baseZIndex = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
      return _toConsumableArray$4(zIndexes).reverse().find(function(obj) {
        return autoZIndex ? true : obj.key === key;
      }) || {
        key,
        value: baseZIndex
      };
    };
    var getZIndex = function getZIndex2(el) {
      return el ? parseInt(el.style.zIndex, 10) || 0 : 0;
    };
    return {
      get: getZIndex,
      set: function set2(key, el, baseZIndex) {
        if (el) {
          el.style.zIndex = String(generateZIndex(key, true, baseZIndex));
        }
      },
      clear: function clear2(el) {
        if (el) {
          revertZIndex(getZIndex(el));
          el.style.zIndex = "";
        }
      },
      getCurrent: function getCurrent(key) {
        return getCurrentZIndex(key, true);
      }
    };
  }
  var ZIndexUtils = handler();
  function _typeof$9(o) {
    "@babel/helpers - typeof";
    return _typeof$9 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof$9(o);
  }
  function ownKeys$8(e, r2) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r2 && (o = o.filter(function(r3) {
        return Object.getOwnPropertyDescriptor(e, r3).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread$8(e) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys$8(Object(t), true).forEach(function(r3) {
        _defineProperty$9(e, r3, t[r3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$8(Object(t)).forEach(function(r3) {
        Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
      });
    }
    return e;
  }
  function _defineProperty$9(obj, key, value) {
    key = _toPropertyKey$9(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey$9(t) {
    var i = _toPrimitive$9(t, "string");
    return "symbol" == _typeof$9(i) ? i : String(i);
  }
  function _toPrimitive$9(t, r2) {
    if ("object" != _typeof$9(t) || !t)
      return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r2 || "default");
      if ("object" != _typeof$9(i))
        return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t);
  }
  function tryOnMounted(fn) {
    var sync = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    if (getCurrentInstance())
      onMounted(fn);
    else if (sync)
      fn();
    else
      nextTick(fn);
  }
  var _id = 0;
  function useStyle(css2) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var isLoaded = ref(false);
    var cssRef = ref(css2);
    var styleRef = ref(null);
    var defaultDocument = DomHandler.isClient() ? window.document : void 0;
    var _options$document = options.document, document2 = _options$document === void 0 ? defaultDocument : _options$document, _options$immediate = options.immediate, immediate = _options$immediate === void 0 ? true : _options$immediate, _options$manual = options.manual, manual = _options$manual === void 0 ? false : _options$manual, _options$name = options.name, name = _options$name === void 0 ? "style_".concat(++_id) : _options$name, _options$id = options.id, id = _options$id === void 0 ? void 0 : _options$id, _options$media = options.media, media = _options$media === void 0 ? void 0 : _options$media, _options$nonce = options.nonce, nonce = _options$nonce === void 0 ? void 0 : _options$nonce, _options$props = options.props, props = _options$props === void 0 ? {} : _options$props;
    var stop2 = function stop3() {
    };
    var load = function load2(_css) {
      var _props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      if (!document2)
        return;
      var _styleProps = _objectSpread$8(_objectSpread$8({}, props), _props);
      var _name = _styleProps.name || name, _id2 = _styleProps.id || id, _nonce = _styleProps.nonce || nonce;
      styleRef.value = document2.querySelector('style[data-primevue-style-id="'.concat(_name, '"]')) || document2.getElementById(_id2) || document2.createElement("style");
      if (!styleRef.value.isConnected) {
        cssRef.value = _css || css2;
        DomHandler.setAttributes(styleRef.value, {
          type: "text/css",
          id: _id2,
          media,
          nonce: _nonce
        });
        document2.head.appendChild(styleRef.value);
        DomHandler.setAttribute(styleRef.value, "data-primevue-style-id", name);
        DomHandler.setAttributes(styleRef.value, _styleProps);
      }
      if (isLoaded.value)
        return;
      stop2 = watch(cssRef, function(value) {
        styleRef.value.textContent = value;
      }, {
        immediate: true
      });
      isLoaded.value = true;
    };
    var unload = function unload2() {
      if (!document2 || !isLoaded.value)
        return;
      stop2();
      DomHandler.isExist(styleRef.value) && document2.head.removeChild(styleRef.value);
      isLoaded.value = false;
    };
    if (immediate && !manual)
      tryOnMounted(load);
    return {
      id,
      name,
      css: cssRef,
      unload,
      load,
      isLoaded: readonly(isLoaded)
    };
  }
  function _typeof$8(o) {
    "@babel/helpers - typeof";
    return _typeof$8 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof$8(o);
  }
  function _slicedToArray$1(arr, i) {
    return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$4(arr, i) || _nonIterableRest$1();
  }
  function _nonIterableRest$1() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray$4(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray$4(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray$4(o, minLen);
  }
  function _arrayLikeToArray$4(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  function _iterableToArrayLimit$1(r2, l2) {
    var t = null == r2 ? null : "undefined" != typeof Symbol && r2[Symbol.iterator] || r2["@@iterator"];
    if (null != t) {
      var e, n, i, u, a = [], f = true, o = false;
      try {
        if (i = (t = t.call(r2)).next, 0 === l2) {
          if (Object(t) !== t)
            return;
          f = false;
        } else
          for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l2); f = true)
            ;
      } catch (r3) {
        o = true, n = r3;
      } finally {
        try {
          if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
            return;
        } finally {
          if (o)
            throw n;
        }
      }
      return a;
    }
  }
  function _arrayWithHoles$1(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function ownKeys$7(e, r2) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r2 && (o = o.filter(function(r3) {
        return Object.getOwnPropertyDescriptor(e, r3).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread$7(e) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys$7(Object(t), true).forEach(function(r3) {
        _defineProperty$8(e, r3, t[r3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$7(Object(t)).forEach(function(r3) {
        Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
      });
    }
    return e;
  }
  function _defineProperty$8(obj, key, value) {
    key = _toPropertyKey$8(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey$8(t) {
    var i = _toPrimitive$8(t, "string");
    return "symbol" == _typeof$8(i) ? i : String(i);
  }
  function _toPrimitive$8(t, r2) {
    if ("object" != _typeof$8(t) || !t)
      return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r2 || "default");
      if ("object" != _typeof$8(i))
        return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t);
  }
  var css$7 = "\n.p-hidden-accessible {\n    border: 0;\n    clip: rect(0 0 0 0);\n    height: 1px;\n    margin: -1px;\n    overflow: hidden;\n    padding: 0;\n    position: absolute;\n    width: 1px;\n}\n\n.p-hidden-accessible input,\n.p-hidden-accessible select {\n    transform: scale(0);\n}\n\n.p-overflow-hidden {\n    overflow: hidden;\n    padding-right: var(--scrollbar-width);\n}\n";
  var classes$9 = {};
  var inlineStyles$2 = {};
  var BaseStyle = {
    name: "base",
    css: css$7,
    classes: classes$9,
    inlineStyles: inlineStyles$2,
    loadStyle: function loadStyle() {
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      return this.css ? useStyle(this.css, _objectSpread$7({
        name: this.name
      }, options)) : {};
    },
    getStyleSheet: function getStyleSheet() {
      var extendedCSS = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      var props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      if (this.css) {
        var _props = Object.entries(props).reduce(function(acc, _ref) {
          var _ref2 = _slicedToArray$1(_ref, 2), k2 = _ref2[0], v = _ref2[1];
          return acc.push("".concat(k2, '="').concat(v, '"')) && acc;
        }, []).join(" ");
        return '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(_props, ">").concat(this.css).concat(extendedCSS, "</style>");
      }
      return "";
    },
    extend: function extend2(style) {
      return _objectSpread$7(_objectSpread$7({}, this), {}, {
        css: void 0
      }, style);
    }
  };
  function _typeof$1$2(o) {
    "@babel/helpers - typeof";
    return _typeof$1$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof$1$2(o);
  }
  function ownKeys$1$1(e, r2) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r2 && (o = o.filter(function(r3) {
        return Object.getOwnPropertyDescriptor(e, r3).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread$1$1(e) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys$1$1(Object(t), true).forEach(function(r3) {
        _defineProperty$1$1(e, r3, t[r3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1$1(Object(t)).forEach(function(r3) {
        Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
      });
    }
    return e;
  }
  function _defineProperty$1$1(obj, key, value) {
    key = _toPropertyKey$1$1(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey$1$1(t) {
    var i = _toPrimitive$1$1(t, "string");
    return "symbol" == _typeof$1$2(i) ? i : String(i);
  }
  function _toPrimitive$1$1(t, r2) {
    if ("object" != _typeof$1$2(t) || !t)
      return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r2 || "default");
      if ("object" != _typeof$1$2(i))
        return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t);
  }
  var buttonCSS = "\n.p-button {\n    display: inline-flex;\n    cursor: pointer;\n    user-select: none;\n    align-items: center;\n    vertical-align: bottom;\n    text-align: center;\n    overflow: hidden;\n    position: relative;\n}\n\n.p-button-label {\n    flex: 1 1 auto;\n}\n\n.p-button-icon-right {\n    order: 1;\n}\n\n.p-button:disabled {\n    cursor: default;\n}\n\n.p-button-icon-only {\n    justify-content: center;\n}\n\n.p-button-icon-only .p-button-label {\n    visibility: hidden;\n    width: 0;\n    flex: 0 0 auto;\n}\n\n.p-button-vertical {\n    flex-direction: column;\n}\n\n.p-button-icon-bottom {\n    order: 2;\n}\n\n.p-buttonset .p-button {\n    margin: 0;\n}\n\n.p-buttonset .p-button:not(:last-child), .p-buttonset .p-button:not(:last-child):hover {\n    border-right: 0 none;\n}\n\n.p-buttonset .p-button:not(:first-of-type):not(:last-of-type) {\n    border-radius: 0;\n}\n\n.p-buttonset .p-button:first-of-type:not(:only-of-type) {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n\n.p-buttonset .p-button:last-of-type:not(:only-of-type) {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n}\n\n.p-buttonset .p-button:focus {\n    position: relative;\n    z-index: 1;\n}\n";
  var checkboxCSS = "\n.p-checkbox {\n    display: inline-flex;\n    cursor: pointer;\n    user-select: none;\n    vertical-align: bottom;\n    position: relative;\n}\n\n.p-checkbox.p-checkbox-disabled {\n    cursor: default;\n}\n\n.p-checkbox-box {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n";
  var inputTextCSS = "\n.p-fluid .p-inputtext {\n    width: 100%;\n}\n\n/* InputGroup */\n.p-inputgroup {\n    display: flex;\n    align-items: stretch;\n    width: 100%;\n}\n\n.p-inputgroup-addon {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.p-inputgroup .p-float-label {\n    display: flex;\n    align-items: stretch;\n    width: 100%;\n}\n\n.p-inputgroup .p-inputtext,\n.p-fluid .p-inputgroup .p-inputtext,\n.p-inputgroup .p-inputwrapper,\n.p-fluid .p-inputgroup .p-input {\n    flex: 1 1 auto;\n    width: 1%;\n}\n\n/* Floating Label */\n.p-float-label {\n    display: block;\n    position: relative;\n}\n\n.p-float-label label {\n    position: absolute;\n    pointer-events: none;\n    top: 50%;\n    margin-top: -.5rem;\n    transition-property: all;\n    transition-timing-function: ease;\n    line-height: 1;\n}\n\n.p-float-label textarea ~ label {\n    top: 1rem;\n}\n\n.p-float-label input:focus ~ label,\n.p-float-label input.p-filled ~ label,\n.p-float-label input:-webkit-autofill ~ label,\n.p-float-label textarea:focus ~ label,\n.p-float-label textarea.p-filled ~ label,\n.p-float-label .p-inputwrapper-focus ~ label,\n.p-float-label .p-inputwrapper-filled ~ label {\n    top: -.75rem;\n    font-size: 12px;\n}\n\n\n.p-float-label .p-placeholder,\n.p-float-label input::placeholder,\n.p-float-label .p-inputtext::placeholder {\n    opacity: 0;\n    transition-property: all;\n    transition-timing-function: ease;\n}\n\n.p-float-label .p-focus .p-placeholder,\n.p-float-label input:focus::placeholder,\n.p-float-label .p-inputtext:focus::placeholder {\n    opacity: 1;\n    transition-property: all;\n    transition-timing-function: ease;\n}\n\n.p-input-icon-left,\n.p-input-icon-right {\n    position: relative;\n    display: inline-block;\n}\n\n.p-input-icon-left > i,\n.p-input-icon-left > svg,\n.p-input-icon-right > i,\n.p-input-icon-right > svg {\n    position: absolute;\n    top: 50%;\n    margin-top: -.5rem;\n}\n\n.p-fluid .p-input-icon-left,\n.p-fluid .p-input-icon-right {\n    display: block;\n    width: 100%;\n}\n";
  var radioButtonCSS = "\n.p-radiobutton {\n    position: relative;\n    display: inline-flex;\n    cursor: pointer;\n    user-select: none;\n    vertical-align: bottom;\n}\n\n.p-radiobutton.p-radiobutton-disabled {\n    cursor: default;\n}\n\n.p-radiobutton-box {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n.p-radiobutton-icon {\n    -webkit-backface-visibility: hidden;\n    backface-visibility: hidden;\n    transform: translateZ(0) scale(.1);\n    border-radius: 50%;\n    visibility: hidden;\n}\n\n.p-radiobutton-box.p-highlight .p-radiobutton-icon {\n    transform: translateZ(0) scale(1.0, 1.0);\n    visibility: visible;\n}\n";
  var css$6 = "\n@layer primevue {\n.p-component, .p-component * {\n    box-sizing: border-box;\n}\n\n.p-hidden-space {\n    visibility: hidden;\n}\n\n.p-reset {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    outline: 0;\n    text-decoration: none;\n    font-size: 100%;\n    list-style: none;\n}\n\n.p-disabled, .p-disabled * {\n    cursor: default;\n    pointer-events: none;\n    user-select: none;\n}\n\n.p-component-overlay {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n}\n\n.p-unselectable-text {\n    user-select: none;\n}\n\n.p-sr-only {\n    border: 0;\n    clip: rect(1px, 1px, 1px, 1px);\n    clip-path: inset(50%);\n    height: 1px;\n    margin: -1px;\n    overflow: hidden;\n    padding: 0;\n    position: absolute;\n    width: 1px;\n    word-wrap: normal;\n}\n\n.p-link {\n	text-align: left;\n	background-color: transparent;\n	margin: 0;\n	padding: 0;\n	border: none;\n    cursor: pointer;\n    user-select: none;\n}\n\n.p-link:disabled {\n	cursor: default;\n}\n\n/* Non vue overlay animations */\n.p-connected-overlay {\n    opacity: 0;\n    transform: scaleY(0.8);\n    transition: transform .12s cubic-bezier(0, 0, 0.2, 1), opacity .12s cubic-bezier(0, 0, 0.2, 1);\n}\n\n.p-connected-overlay-visible {\n    opacity: 1;\n    transform: scaleY(1);\n}\n\n.p-connected-overlay-hidden {\n    opacity: 0;\n    transform: scaleY(1);\n    transition: opacity .1s linear;\n}\n\n/* Vue based overlay animations */\n.p-connected-overlay-enter-from {\n    opacity: 0;\n    transform: scaleY(0.8);\n}\n\n.p-connected-overlay-leave-to {\n    opacity: 0;\n}\n\n.p-connected-overlay-enter-active {\n    transition: transform .12s cubic-bezier(0, 0, 0.2, 1), opacity .12s cubic-bezier(0, 0, 0.2, 1);\n}\n\n.p-connected-overlay-leave-active {\n    transition: opacity .1s linear;\n}\n\n/* Toggleable Content */\n.p-toggleable-content-enter-from,\n.p-toggleable-content-leave-to {\n    max-height: 0;\n}\n\n.p-toggleable-content-enter-to,\n.p-toggleable-content-leave-from {\n    max-height: 1000px;\n}\n\n.p-toggleable-content-leave-active {\n    overflow: hidden;\n    transition: max-height 0.45s cubic-bezier(0, 1, 0, 1);\n}\n\n.p-toggleable-content-enter-active {\n    overflow: hidden;\n    transition: max-height 1s ease-in-out;\n}\n".concat(buttonCSS, "\n").concat(checkboxCSS, "\n").concat(inputTextCSS, "\n").concat(radioButtonCSS, "\n}\n");
  var BaseComponentStyle = BaseStyle.extend({
    name: "common",
    css: css$6,
    loadGlobalStyle: function loadGlobalStyle(globalCSS) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return useStyle(globalCSS, _objectSpread$1$1({
        name: "global"
      }, options));
    }
  });
  function _typeof$7(o) {
    "@babel/helpers - typeof";
    return _typeof$7 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof$7(o);
  }
  function ownKeys$6(e, r2) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r2 && (o = o.filter(function(r3) {
        return Object.getOwnPropertyDescriptor(e, r3).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread$6(e) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys$6(Object(t), true).forEach(function(r3) {
        _defineProperty$7(e, r3, t[r3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$6(Object(t)).forEach(function(r3) {
        Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
      });
    }
    return e;
  }
  function _defineProperty$7(obj, key, value) {
    key = _toPropertyKey$7(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey$7(t) {
    var i = _toPrimitive$7(t, "string");
    return "symbol" == _typeof$7(i) ? i : String(i);
  }
  function _toPrimitive$7(t, r2) {
    if ("object" != _typeof$7(t) || !t)
      return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r2 || "default");
      if ("object" != _typeof$7(i))
        return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t);
  }
  var script$f = {
    name: "BaseComponent",
    props: {
      pt: {
        type: Object,
        "default": void 0
      },
      ptOptions: {
        type: Object,
        "default": void 0
      },
      unstyled: {
        type: Boolean,
        "default": void 0
      }
    },
    inject: {
      $parentInstance: {
        "default": void 0
      }
    },
    watch: {
      isUnstyled: {
        immediate: true,
        handler: function handler2(newValue) {
          if (!newValue) {
            var _this$$config, _this$$config2;
            BaseComponentStyle.loadStyle({
              nonce: (_this$$config = this.$config) === null || _this$$config === void 0 || (_this$$config = _this$$config.csp) === null || _this$$config === void 0 ? void 0 : _this$$config.nonce
            });
            this.$options.style && this.$style.loadStyle({
              nonce: (_this$$config2 = this.$config) === null || _this$$config2 === void 0 || (_this$$config2 = _this$$config2.csp) === null || _this$$config2 === void 0 ? void 0 : _this$$config2.nonce
            });
          }
        }
      }
    },
    beforeCreate: function beforeCreate() {
      var _this$pt, _this$pt2, _this$pt3, _ref, _ref$onBeforeCreate, _this$$config3, _this$$primevue, _this$$primevue2, _this$$primevue3, _ref2, _ref2$onBeforeCreate;
      var _usept = (_this$pt = this.pt) === null || _this$pt === void 0 ? void 0 : _this$pt["_usept"];
      var originalValue = _usept ? (_this$pt2 = this.pt) === null || _this$pt2 === void 0 || (_this$pt2 = _this$pt2.originalValue) === null || _this$pt2 === void 0 ? void 0 : _this$pt2[this.$.type.name] : void 0;
      var value = _usept ? (_this$pt3 = this.pt) === null || _this$pt3 === void 0 || (_this$pt3 = _this$pt3.value) === null || _this$pt3 === void 0 ? void 0 : _this$pt3[this.$.type.name] : this.pt;
      (_ref = value || originalValue) === null || _ref === void 0 || (_ref = _ref.hooks) === null || _ref === void 0 || (_ref$onBeforeCreate = _ref["onBeforeCreate"]) === null || _ref$onBeforeCreate === void 0 || _ref$onBeforeCreate.call(_ref);
      var _useptInConfig = (_this$$config3 = this.$config) === null || _this$$config3 === void 0 || (_this$$config3 = _this$$config3.pt) === null || _this$$config3 === void 0 ? void 0 : _this$$config3["_usept"];
      var originalValueInConfig = _useptInConfig ? (_this$$primevue = this.$primevue) === null || _this$$primevue === void 0 || (_this$$primevue = _this$$primevue.config) === null || _this$$primevue === void 0 || (_this$$primevue = _this$$primevue.pt) === null || _this$$primevue === void 0 ? void 0 : _this$$primevue.originalValue : void 0;
      var valueInConfig = _useptInConfig ? (_this$$primevue2 = this.$primevue) === null || _this$$primevue2 === void 0 || (_this$$primevue2 = _this$$primevue2.config) === null || _this$$primevue2 === void 0 || (_this$$primevue2 = _this$$primevue2.pt) === null || _this$$primevue2 === void 0 ? void 0 : _this$$primevue2.value : (_this$$primevue3 = this.$primevue) === null || _this$$primevue3 === void 0 || (_this$$primevue3 = _this$$primevue3.config) === null || _this$$primevue3 === void 0 ? void 0 : _this$$primevue3.pt;
      (_ref2 = valueInConfig || originalValueInConfig) === null || _ref2 === void 0 || (_ref2 = _ref2[this.$.type.name]) === null || _ref2 === void 0 || (_ref2 = _ref2.hooks) === null || _ref2 === void 0 || (_ref2$onBeforeCreate = _ref2["onBeforeCreate"]) === null || _ref2$onBeforeCreate === void 0 || _ref2$onBeforeCreate.call(_ref2);
    },
    created: function created() {
      this._hook("onCreated");
    },
    beforeMount: function beforeMount() {
      var _this$$config4;
      BaseStyle.loadStyle({
        nonce: (_this$$config4 = this.$config) === null || _this$$config4 === void 0 || (_this$$config4 = _this$$config4.csp) === null || _this$$config4 === void 0 ? void 0 : _this$$config4.nonce
      });
      this._loadGlobalStyles();
      this._hook("onBeforeMount");
    },
    mounted: function mounted() {
      this._hook("onMounted");
    },
    beforeUpdate: function beforeUpdate() {
      this._hook("onBeforeUpdate");
    },
    updated: function updated() {
      this._hook("onUpdated");
    },
    beforeUnmount: function beforeUnmount() {
      this._hook("onBeforeUnmount");
    },
    unmounted: function unmounted() {
      this._hook("onUnmounted");
    },
    methods: {
      _hook: function _hook(hookName) {
        if (!this.$options.hostName) {
          var selfHook = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(hookName));
          var defaultHook = this._useDefaultPT(this._getOptionValue, "hooks.".concat(hookName));
          selfHook === null || selfHook === void 0 || selfHook();
          defaultHook === null || defaultHook === void 0 || defaultHook();
        }
      },
      _loadGlobalStyles: function _loadGlobalStyles() {
        var _this$$config5;
        var globalCSS = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
        ObjectUtils.isNotEmpty(globalCSS) && BaseComponentStyle.loadGlobalStyle(globalCSS, {
          nonce: (_this$$config5 = this.$config) === null || _this$$config5 === void 0 || (_this$$config5 = _this$$config5.csp) === null || _this$$config5 === void 0 ? void 0 : _this$$config5.nonce
        });
      },
      _getHostInstance: function _getHostInstance(instance) {
        return instance ? this.$options.hostName ? instance.$.type.name === this.$options.hostName ? instance : this._getHostInstance(instance.$parentInstance) : instance.$parentInstance : void 0;
      },
      _getPropValue: function _getPropValue(name) {
        var _this$_getHostInstanc;
        return this[name] || ((_this$_getHostInstanc = this._getHostInstance(this)) === null || _this$_getHostInstanc === void 0 ? void 0 : _this$_getHostInstanc[name]);
      },
      _getOptionValue: function _getOptionValue(options) {
        var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
        var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var fKeys = ObjectUtils.toFlatCase(key).split(".");
        var fKey = fKeys.shift();
        return fKey ? ObjectUtils.isObject(options) ? this._getOptionValue(ObjectUtils.getItemValue(options[Object.keys(options).find(function(k2) {
          return ObjectUtils.toFlatCase(k2) === fKey;
        }) || ""], params), fKeys.join("."), params) : void 0 : ObjectUtils.getItemValue(options, params);
      },
      _getPTValue: function _getPTValue() {
        var _this$$config6;
        var obj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
        var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var searchInDefaultPT = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : true;
        var datasetPrefix = "data-pc-";
        var searchOut = /./g.test(key) && !!params[key.split(".")[0]];
        var _ref3 = this._getPropValue("ptOptions") || ((_this$$config6 = this.$config) === null || _this$$config6 === void 0 ? void 0 : _this$$config6.ptOptions) || {}, _ref3$mergeSections = _ref3.mergeSections, mergeSections = _ref3$mergeSections === void 0 ? true : _ref3$mergeSections, _ref3$mergeProps = _ref3.mergeProps, useMergeProps = _ref3$mergeProps === void 0 ? false : _ref3$mergeProps;
        var global2 = searchInDefaultPT ? searchOut ? this._useGlobalPT(this._getPTClassValue, key, params) : this._useDefaultPT(this._getPTClassValue, key, params) : void 0;
        var self2 = searchOut ? void 0 : this._usePT(this._getPT(obj, this.$name), this._getPTClassValue, key, _objectSpread$6(_objectSpread$6({}, params), {}, {
          global: global2 || {}
        }));
        var datasets = key !== "transition" && _objectSpread$6(_objectSpread$6({}, key === "root" && _defineProperty$7({}, "".concat(datasetPrefix, "name"), ObjectUtils.toFlatCase(this.$.type.name))), {}, _defineProperty$7({}, "".concat(datasetPrefix, "section"), ObjectUtils.toFlatCase(key)));
        return mergeSections || !mergeSections && self2 ? useMergeProps ? mergeProps(global2, self2, datasets) : _objectSpread$6(_objectSpread$6(_objectSpread$6({}, global2), self2), datasets) : _objectSpread$6(_objectSpread$6({}, self2), datasets);
      },
      _getPTClassValue: function _getPTClassValue() {
        var value = this._getOptionValue.apply(this, arguments);
        return ObjectUtils.isString(value) || ObjectUtils.isArray(value) ? {
          "class": value
        } : value;
      },
      _getPT: function _getPT(pt) {
        var _this = this;
        var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
        var callback = arguments.length > 2 ? arguments[2] : void 0;
        var getValue2 = function getValue3(value) {
          var _ref5;
          var checkSameKey = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
          var computedValue = callback ? callback(value) : value;
          var _key = ObjectUtils.toFlatCase(key);
          var _cKey = ObjectUtils.toFlatCase(_this.$name);
          return (_ref5 = checkSameKey ? _key !== _cKey ? computedValue === null || computedValue === void 0 ? void 0 : computedValue[_key] : void 0 : computedValue === null || computedValue === void 0 ? void 0 : computedValue[_key]) !== null && _ref5 !== void 0 ? _ref5 : computedValue;
        };
        return pt !== null && pt !== void 0 && pt.hasOwnProperty("_usept") ? {
          _usept: pt["_usept"],
          originalValue: getValue2(pt.originalValue),
          value: getValue2(pt.value)
        } : getValue2(pt, true);
      },
      _usePT: function _usePT(pt, callback, key, params) {
        var fn = function fn2(value2) {
          return callback(value2, key, params);
        };
        if (pt !== null && pt !== void 0 && pt.hasOwnProperty("_usept")) {
          var _this$$config7;
          var _ref6 = pt["_usept"] || ((_this$$config7 = this.$config) === null || _this$$config7 === void 0 ? void 0 : _this$$config7.ptOptions) || {}, _ref6$mergeSections = _ref6.mergeSections, mergeSections = _ref6$mergeSections === void 0 ? true : _ref6$mergeSections, _ref6$mergeProps = _ref6.mergeProps, useMergeProps = _ref6$mergeProps === void 0 ? false : _ref6$mergeProps;
          var originalValue = fn(pt.originalValue);
          var value = fn(pt.value);
          if (originalValue === void 0 && value === void 0)
            return void 0;
          else if (ObjectUtils.isString(value))
            return value;
          else if (ObjectUtils.isString(originalValue))
            return originalValue;
          return mergeSections || !mergeSections && value ? useMergeProps ? mergeProps(originalValue, value) : _objectSpread$6(_objectSpread$6({}, originalValue), value) : value;
        }
        return fn(pt);
      },
      _useGlobalPT: function _useGlobalPT(callback, key, params) {
        return this._usePT(this.globalPT, callback, key, params);
      },
      _useDefaultPT: function _useDefaultPT(callback, key, params) {
        return this._usePT(this.defaultPT, callback, key, params);
      },
      ptm: function ptm() {
        var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
        var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        return this._getPTValue(this.pt, key, _objectSpread$6(_objectSpread$6({}, this.$params), params));
      },
      ptmo: function ptmo() {
        var obj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
        var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        return this._getPTValue(obj, key, _objectSpread$6({
          instance: this
        }, params), false);
      },
      cx: function cx() {
        var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
        var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        return !this.isUnstyled ? this._getOptionValue(this.$style.classes, key, _objectSpread$6(_objectSpread$6({}, this.$params), params)) : void 0;
      },
      sx: function sx() {
        var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
        var when = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        if (when) {
          var self2 = this._getOptionValue(this.$style.inlineStyles, key, _objectSpread$6(_objectSpread$6({}, this.$params), params));
          var base = this._getOptionValue(BaseComponentStyle.inlineStyles, key, _objectSpread$6(_objectSpread$6({}, this.$params), params));
          return [base, self2];
        }
        return void 0;
      }
    },
    computed: {
      globalPT: function globalPT() {
        var _this$$config8, _this2 = this;
        return this._getPT((_this$$config8 = this.$config) === null || _this$$config8 === void 0 ? void 0 : _this$$config8.pt, void 0, function(value) {
          return ObjectUtils.getItemValue(value, {
            instance: _this2
          });
        });
      },
      defaultPT: function defaultPT() {
        var _this$$config9, _this3 = this;
        return this._getPT((_this$$config9 = this.$config) === null || _this$$config9 === void 0 ? void 0 : _this$$config9.pt, void 0, function(value) {
          return _this3._getOptionValue(value, _this3.$name, _objectSpread$6({}, _this3.$params)) || ObjectUtils.getItemValue(value, _objectSpread$6({}, _this3.$params));
        });
      },
      isUnstyled: function isUnstyled() {
        var _this$$config10;
        return this.unstyled !== void 0 ? this.unstyled : (_this$$config10 = this.$config) === null || _this$$config10 === void 0 ? void 0 : _this$$config10.unstyled;
      },
      $params: function $params() {
        var parentInstance = this._getHostInstance(this) || this.$parent;
        return {
          instance: this,
          props: this.$props,
          state: this.$data,
          attrs: this.$attrs,
          parent: {
            instance: parentInstance,
            props: parentInstance === null || parentInstance === void 0 ? void 0 : parentInstance.$props,
            state: parentInstance === null || parentInstance === void 0 ? void 0 : parentInstance.$data,
            attrs: parentInstance === null || parentInstance === void 0 ? void 0 : parentInstance.$attrs
          },
          /* @deprecated since v3.43.0. Use the `parent.instance` instead of the `parentInstance`.*/
          parentInstance
        };
      },
      $style: function $style() {
        return _objectSpread$6(_objectSpread$6({
          classes: void 0,
          inlineStyles: void 0,
          loadStyle: function loadStyle() {
          },
          loadCustomStyle: function loadCustomStyle() {
          }
        }, (this._getHostInstance(this) || {}).$style), this.$options.style);
      },
      $config: function $config() {
        var _this$$primevue4;
        return (_this$$primevue4 = this.$primevue) === null || _this$$primevue4 === void 0 ? void 0 : _this$$primevue4.config;
      },
      $name: function $name() {
        return this.$options.hostName || this.$.type.name;
      }
    }
  };
  var css$5 = "\n@layer primevue {\n    .p-skeleton {\n        overflow: hidden;\n    }\n\n    .p-skeleton::after {\n        content: '';\n        animation: p-skeleton-animation 1.2s infinite;\n        height: 100%;\n        left: 0;\n        position: absolute;\n        right: 0;\n        top: 0;\n        transform: translateX(-100%);\n        z-index: 1;\n    }\n\n    .p-skeleton.p-skeleton-circle {\n        border-radius: 50%;\n    }\n\n    .p-skeleton-none::after {\n        animation: none;\n    }\n\n    @keyframes p-skeleton-animation {\n        from {\n            transform: translateX(-100%);\n        }\n        to {\n            transform: translateX(100%);\n        }\n    }\n}\n";
  var inlineStyles$1 = {
    root: {
      position: "relative"
    }
  };
  var classes$8 = {
    root: function root(_ref) {
      var props = _ref.props;
      return ["p-skeleton p-component", {
        "p-skeleton-circle": props.shape === "circle",
        "p-skeleton-none": props.animation === "none"
      }];
    }
  };
  var SkeletonStyle = BaseStyle.extend({
    name: "skeleton",
    css: css$5,
    classes: classes$8,
    inlineStyles: inlineStyles$1
  });
  var script$1$8 = {
    name: "BaseSkeleton",
    "extends": script$f,
    props: {
      shape: {
        type: String,
        "default": "rectangle"
      },
      size: {
        type: String,
        "default": null
      },
      width: {
        type: String,
        "default": "100%"
      },
      height: {
        type: String,
        "default": "1rem"
      },
      borderRadius: {
        type: String,
        "default": null
      },
      animation: {
        type: String,
        "default": "wave"
      }
    },
    style: SkeletonStyle,
    provide: function provide2() {
      return {
        $parentInstance: this
      };
    }
  };
  var script$e = {
    name: "Skeleton",
    "extends": script$1$8,
    computed: {
      containerStyle: function containerStyle() {
        if (this.size)
          return {
            width: this.size,
            height: this.size,
            borderRadius: this.borderRadius
          };
        else
          return {
            width: this.width,
            height: this.height,
            borderRadius: this.borderRadius
          };
      }
    }
  };
  function render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", mergeProps({
      "class": _ctx.cx("root"),
      style: [_ctx.sx("root"), $options.containerStyle],
      "aria-hidden": "true"
    }, _ctx.ptm("root"), {
      "data-pc-name": "skeleton"
    }), null, 16);
  }
  script$e.render = render$c;
  var classes$7 = {
    root: function root(_ref) {
      var instance = _ref.instance, props = _ref.props;
      return ["p-inputtext p-component", {
        "p-filled": instance.filled,
        "p-inputtext-sm": props.size === "small",
        "p-inputtext-lg": props.size === "large"
      }];
    }
  };
  var InputTextStyle = BaseStyle.extend({
    name: "inputtext",
    classes: classes$7
  });
  var script$1$7 = {
    name: "BaseInputText",
    "extends": script$f,
    props: {
      modelValue: null,
      size: {
        type: String,
        "default": null
      }
    },
    style: InputTextStyle,
    provide: function provide2() {
      return {
        $parentInstance: this
      };
    }
  };
  var script$d = {
    name: "InputText",
    "extends": script$1$7,
    emits: ["update:modelValue"],
    methods: {
      getPTOptions: function getPTOptions(key) {
        return this.ptm(key, {
          context: {
            filled: this.filled,
            disabled: this.$attrs.disabled || this.$attrs.disabled === ""
          }
        });
      },
      onInput: function onInput(event) {
        this.$emit("update:modelValue", event.target.value);
      }
    },
    computed: {
      filled: function filled() {
        return this.modelValue != null && this.modelValue.toString().length > 0;
      }
    }
  };
  var _hoisted_1$9 = ["value"];
  function render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("input", mergeProps({
      "class": _ctx.cx("root"),
      value: _ctx.modelValue,
      onInput: _cache[0] || (_cache[0] = function() {
        return $options.onInput && $options.onInput.apply($options, arguments);
      })
    }, $options.getPTOptions("root"), {
      "data-pc-name": "inputtext"
    }), null, 16, _hoisted_1$9);
  }
  script$d.render = render$b;
  var classes$6 = {
    root: function root(_ref) {
      var instance = _ref.instance;
      return ["p-inputmask p-inputtext p-component", {
        "p-filled": instance.filled
      }];
    }
  };
  var InputMaskStyle = BaseStyle.extend({
    name: "inputmask",
    classes: classes$6
  });
  var script$1$6 = {
    name: "BaseInputMask",
    "extends": script$f,
    props: {
      modelValue: null,
      slotChar: {
        type: String,
        "default": "_"
      },
      mask: {
        type: String,
        "default": null
      },
      autoClear: {
        type: Boolean,
        "default": true
      },
      unmask: {
        type: Boolean,
        "default": false
      },
      readonly: {
        type: Boolean,
        "default": false
      }
    },
    style: InputMaskStyle
  };
  var script$c = {
    name: "InputMask",
    "extends": script$1$6,
    emits: ["update:modelValue", "focus", "blur", "keydown", "complete", "keypress", "paste"],
    watch: {
      mask: function mask(newMask, oldMask) {
        if (oldMask !== newMask) {
          this.initMask();
        }
      }
    },
    mounted: function mounted() {
      this.initMask();
    },
    updated: function updated() {
      if (this.isValueUpdated()) {
        this.updateValue();
      }
    },
    methods: {
      onInput: function onInput(event) {
        if (this.androidChrome)
          this.handleAndroidInput(event);
        else
          this.handleInputChange(event);
        this.$emit("update:modelValue", event.target.value);
      },
      onFocus: function onFocus(event) {
        var _this = this;
        if (this.readonly) {
          return;
        }
        this.focus = true;
        clearTimeout(this.caretTimeoutId);
        var pos;
        this.focusText = this.$el.value;
        pos = this.checkVal();
        this.caretTimeoutId = setTimeout(function() {
          if (_this.$el !== document.activeElement) {
            return;
          }
          _this.writeBuffer();
          if (pos === _this.mask.replace("?", "").length) {
            _this.caret(0, pos);
          } else {
            _this.caret(pos);
          }
        }, 10);
        this.$emit("focus", event);
      },
      onBlur: function onBlur(event) {
        this.focus = false;
        this.checkVal();
        this.updateModel(event);
        if (this.$el.value !== this.focusText) {
          var e = document.createEvent("HTMLEvents");
          e.initEvent("change", true, false);
          this.$el.dispatchEvent(e);
        }
        this.$emit("blur", event);
      },
      onKeyDown: function onKeyDown(event) {
        if (this.readonly) {
          return;
        }
        var k2 = event.which || event.keyCode, pos, begin, end;
        var iPhone = /iphone/i.test(DomHandler.getUserAgent());
        this.oldVal = this.$el.value;
        if (k2 === 8 || k2 === 46 || iPhone && k2 === 127) {
          pos = this.caret();
          begin = pos.begin;
          end = pos.end;
          if (end - begin === 0) {
            begin = k2 !== 46 ? this.seekPrev(begin) : end = this.seekNext(begin - 1);
            end = k2 === 46 ? this.seekNext(end) : end;
          }
          this.clearBuffer(begin, end);
          this.shiftL(begin, end - 1);
          this.updateModel(event);
          event.preventDefault();
        } else if (k2 === 13) {
          this.$el.blur();
          this.updateModel(event);
        } else if (k2 === 27) {
          this.$el.value = this.focusText;
          this.caret(0, this.checkVal());
          this.updateModel(event);
          event.preventDefault();
        }
        this.$emit("keydown", event);
      },
      onKeyPress: function onKeyPress(event) {
        var _this2 = this;
        if (this.readonly) {
          return;
        }
        var k2 = event.which || event.keyCode, pos = this.caret(), p2, c2, next, completed;
        if (event.ctrlKey || event.altKey || event.metaKey || k2 < 32) {
          return;
        } else if (k2 && k2 !== 13) {
          if (pos.end - pos.begin !== 0) {
            this.clearBuffer(pos.begin, pos.end);
            this.shiftL(pos.begin, pos.end - 1);
          }
          p2 = this.seekNext(pos.begin - 1);
          if (p2 < this.len) {
            c2 = String.fromCharCode(k2);
            if (this.tests[p2].test(c2)) {
              this.shiftR(p2);
              this.buffer[p2] = c2;
              this.writeBuffer();
              next = this.seekNext(p2);
              if (/android/i.test(DomHandler.getUserAgent())) {
                var proxy = function proxy2() {
                  _this2.caret(next);
                };
                setTimeout(proxy, 0);
              } else {
                this.caret(next);
              }
              if (pos.begin <= this.lastRequiredNonMaskPos) {
                completed = this.isCompleted();
              }
            }
          }
          event.preventDefault();
        }
        this.updateModel(event);
        if (completed) {
          this.$emit("complete", event);
        }
        this.$emit("keypress", event);
      },
      onPaste: function onPaste(event) {
        this.handleInputChange(event);
        this.$emit("paste", event);
      },
      caret: function caret(first, last) {
        var range, begin, end;
        if (!this.$el.offsetParent || this.$el !== document.activeElement) {
          return;
        }
        if (typeof first === "number") {
          begin = first;
          end = typeof last === "number" ? last : begin;
          if (this.$el.setSelectionRange) {
            this.$el.setSelectionRange(begin, end);
          } else if (this.$el["createTextRange"]) {
            range = this.$el["createTextRange"]();
            range.collapse(true);
            range.moveEnd("character", end);
            range.moveStart("character", begin);
            range.select();
          }
        } else {
          if (this.$el.setSelectionRange) {
            begin = this.$el.selectionStart;
            end = this.$el.selectionEnd;
          } else if (document["selection"] && document["selection"].createRange) {
            range = document["selection"].createRange();
            begin = 0 - range.duplicate().moveStart("character", -1e5);
            end = begin + range.text.length;
          }
          return {
            begin,
            end
          };
        }
      },
      isCompleted: function isCompleted() {
        for (var i = this.firstNonMaskPos; i <= this.lastRequiredNonMaskPos; i++) {
          if (this.tests[i] && this.buffer[i] === this.getPlaceholder(i)) {
            return false;
          }
        }
        return true;
      },
      getPlaceholder: function getPlaceholder(i) {
        if (i < this.slotChar.length) {
          return this.slotChar.charAt(i);
        }
        return this.slotChar.charAt(0);
      },
      seekNext: function seekNext(pos) {
        while (++pos < this.len && !this.tests[pos])
          ;
        return pos;
      },
      seekPrev: function seekPrev(pos) {
        while (--pos >= 0 && !this.tests[pos])
          ;
        return pos;
      },
      shiftL: function shiftL(begin, end) {
        var i, j2;
        if (begin < 0) {
          return;
        }
        for (i = begin, j2 = this.seekNext(end); i < this.len; i++) {
          if (this.tests[i]) {
            if (j2 < this.len && this.tests[i].test(this.buffer[j2])) {
              this.buffer[i] = this.buffer[j2];
              this.buffer[j2] = this.getPlaceholder(j2);
            } else {
              break;
            }
            j2 = this.seekNext(j2);
          }
        }
        this.writeBuffer();
        this.caret(Math.max(this.firstNonMaskPos, begin));
      },
      shiftR: function shiftR(pos) {
        var i, c2, j2, t;
        for (i = pos, c2 = this.getPlaceholder(pos); i < this.len; i++) {
          if (this.tests[i]) {
            j2 = this.seekNext(i);
            t = this.buffer[i];
            this.buffer[i] = c2;
            if (j2 < this.len && this.tests[j2].test(t)) {
              c2 = t;
            } else {
              break;
            }
          }
        }
      },
      handleAndroidInput: function handleAndroidInput(event) {
        var curVal = this.$el.value;
        var pos = this.caret();
        if (this.oldVal && this.oldVal.length && this.oldVal.length > curVal.length) {
          this.checkVal(true);
          while (pos.begin > 0 && !this.tests[pos.begin - 1])
            pos.begin--;
          if (pos.begin === 0) {
            while (pos.begin < this.firstNonMaskPos && !this.tests[pos.begin])
              pos.begin++;
          }
          this.caret(pos.begin, pos.begin);
        } else {
          this.checkVal(true);
          while (pos.begin < this.len && !this.tests[pos.begin])
            pos.begin++;
          this.caret(pos.begin, pos.begin);
        }
        if (this.isCompleted()) {
          this.$emit("complete", event);
        }
      },
      clearBuffer: function clearBuffer(start, end) {
        var i;
        for (i = start; i < end && i < this.len; i++) {
          if (this.tests[i]) {
            this.buffer[i] = this.getPlaceholder(i);
          }
        }
      },
      writeBuffer: function writeBuffer() {
        this.$el.value = this.buffer.join("");
      },
      checkVal: function checkVal(allow) {
        this.isValueChecked = true;
        var test = this.$el.value, lastMatch = -1, i, c2, pos;
        for (i = 0, pos = 0; i < this.len; i++) {
          if (this.tests[i]) {
            this.buffer[i] = this.getPlaceholder(i);
            while (pos++ < test.length) {
              c2 = test.charAt(pos - 1);
              if (this.tests[i].test(c2)) {
                this.buffer[i] = c2;
                lastMatch = i;
                break;
              }
            }
            if (pos > test.length) {
              this.clearBuffer(i + 1, this.len);
              break;
            }
          } else {
            if (this.buffer[i] === test.charAt(pos)) {
              pos++;
            }
            if (i < this.partialPosition) {
              lastMatch = i;
            }
          }
        }
        if (allow) {
          this.writeBuffer();
        } else if (lastMatch + 1 < this.partialPosition) {
          if (this.autoClear || this.buffer.join("") === this.defaultBuffer) {
            if (this.$el.value)
              this.$el.value = "";
            this.clearBuffer(0, this.len);
          } else {
            this.writeBuffer();
          }
        } else {
          this.writeBuffer();
          this.$el.value = this.$el.value.substring(0, lastMatch + 1);
        }
        return this.partialPosition ? i : this.firstNonMaskPos;
      },
      handleInputChange: function handleInputChange(event) {
        var isPasteEvent = event.type === "paste";
        if (this.readonly || isPasteEvent) {
          return;
        }
        var pos = this.checkVal(true);
        this.caret(pos);
        this.updateModel(event);
        if (this.isCompleted()) {
          this.$emit("complete", event);
        }
      },
      getUnmaskedValue: function getUnmaskedValue() {
        var unmaskedBuffer = [];
        for (var i = 0; i < this.buffer.length; i++) {
          var c2 = this.buffer[i];
          if (this.tests[i] && c2 !== this.getPlaceholder(i)) {
            unmaskedBuffer.push(c2);
          }
        }
        return unmaskedBuffer.join("");
      },
      updateModel: function updateModel(e) {
        var val = this.unmask ? this.getUnmaskedValue() : e.target.value;
        this.$emit("update:modelValue", this.defaultBuffer !== val ? val : "");
      },
      updateValue: function updateValue() {
        var _this3 = this;
        var updateModel = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
        if (this.$el) {
          if (this.modelValue == null) {
            this.$el.value = "";
            updateModel && this.$emit("update:modelValue", "");
          } else {
            this.$el.value = this.modelValue;
            this.checkVal();
            setTimeout(function() {
              if (_this3.$el) {
                _this3.writeBuffer();
                _this3.checkVal();
                if (updateModel) {
                  var val = _this3.unmask ? _this3.getUnmaskedValue() : _this3.$el.value;
                  _this3.$emit("update:modelValue", _this3.defaultBuffer !== val ? val : "");
                }
              }
            }, 10);
          }
          this.focusText = this.$el.value;
        }
      },
      initMask: function initMask() {
        this.tests = [];
        this.partialPosition = this.mask.length;
        this.len = this.mask.length;
        this.firstNonMaskPos = null;
        this.defs = {
          9: "[0-9]",
          a: "[A-Za-z]",
          "*": "[A-Za-z0-9]"
        };
        var ua = DomHandler.getUserAgent();
        this.androidChrome = /chrome/i.test(ua) && /android/i.test(ua);
        var maskTokens = this.mask.split("");
        for (var i = 0; i < maskTokens.length; i++) {
          var c2 = maskTokens[i];
          if (c2 === "?") {
            this.len--;
            this.partialPosition = i;
          } else if (this.defs[c2]) {
            this.tests.push(new RegExp(this.defs[c2]));
            if (this.firstNonMaskPos === null) {
              this.firstNonMaskPos = this.tests.length - 1;
            }
            if (i < this.partialPosition) {
              this.lastRequiredNonMaskPos = this.tests.length - 1;
            }
          } else {
            this.tests.push(null);
          }
        }
        this.buffer = [];
        for (var _i = 0; _i < maskTokens.length; _i++) {
          var _c = maskTokens[_i];
          if (_c !== "?") {
            if (this.defs[_c])
              this.buffer.push(this.getPlaceholder(_i));
            else
              this.buffer.push(_c);
          }
        }
        this.defaultBuffer = this.buffer.join("");
        this.updateValue(false);
      },
      isValueUpdated: function isValueUpdated() {
        return this.unmask ? this.modelValue != this.getUnmaskedValue() : this.defaultBuffer !== this.$el.value && this.$el.value !== this.modelValue;
      }
    },
    computed: {
      filled: function filled() {
        return this.modelValue != null && this.modelValue.toString().length > 0;
      },
      ptmParams: function ptmParams() {
        return {
          context: {
            filled: this.filled,
            disabled: this.$attrs.disabled || this.$attrs.disabled === ""
          }
        };
      }
    }
  };
  var _hoisted_1$8 = ["readonly"];
  function render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("input", mergeProps({
      "class": _ctx.cx("root"),
      readonly: _ctx.readonly,
      onInput: _cache[0] || (_cache[0] = function() {
        return $options.onInput && $options.onInput.apply($options, arguments);
      }),
      onFocus: _cache[1] || (_cache[1] = function() {
        return $options.onFocus && $options.onFocus.apply($options, arguments);
      }),
      onBlur: _cache[2] || (_cache[2] = function() {
        return $options.onBlur && $options.onBlur.apply($options, arguments);
      }),
      onKeydown: _cache[3] || (_cache[3] = function() {
        return $options.onKeyDown && $options.onKeyDown.apply($options, arguments);
      }),
      onKeypress: _cache[4] || (_cache[4] = function() {
        return $options.onKeyPress && $options.onKeyPress.apply($options, arguments);
      }),
      onPaste: _cache[5] || (_cache[5] = function() {
        return $options.onPaste && $options.onPaste.apply($options, arguments);
      })
    }, _ctx.ptm("root", $options.ptmParams), {
      "data-pc-name": "inputmask"
    }), null, 16, _hoisted_1$8);
  }
  script$c.render = render$a;
  function _typeof$6(o) {
    "@babel/helpers - typeof";
    return _typeof$6 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof$6(o);
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$3(arr, i) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray$3(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray$3(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray$3(o, minLen);
  }
  function _arrayLikeToArray$3(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  function _iterableToArrayLimit(r2, l2) {
    var t = null == r2 ? null : "undefined" != typeof Symbol && r2[Symbol.iterator] || r2["@@iterator"];
    if (null != t) {
      var e, n, i, u, a = [], f = true, o = false;
      try {
        if (i = (t = t.call(r2)).next, 0 === l2) {
          if (Object(t) !== t)
            return;
          f = false;
        } else
          for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l2); f = true)
            ;
      } catch (r3) {
        o = true, n = r3;
      } finally {
        try {
          if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
            return;
        } finally {
          if (o)
            throw n;
        }
      }
      return a;
    }
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function ownKeys$5(e, r2) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r2 && (o = o.filter(function(r3) {
        return Object.getOwnPropertyDescriptor(e, r3).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread$5(e) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys$5(Object(t), true).forEach(function(r3) {
        _defineProperty$6(e, r3, t[r3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$5(Object(t)).forEach(function(r3) {
        Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
      });
    }
    return e;
  }
  function _defineProperty$6(obj, key, value) {
    key = _toPropertyKey$6(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey$6(t) {
    var i = _toPrimitive$6(t, "string");
    return "symbol" == _typeof$6(i) ? i : String(i);
  }
  function _toPrimitive$6(t, r2) {
    if ("object" != _typeof$6(t) || !t)
      return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r2 || "default");
      if ("object" != _typeof$6(i))
        return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t);
  }
  var BaseDirective = {
    _getMeta: function _getMeta() {
      return [ObjectUtils.isObject(arguments.length <= 0 ? void 0 : arguments[0]) ? void 0 : arguments.length <= 0 ? void 0 : arguments[0], ObjectUtils.getItemValue(ObjectUtils.isObject(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
    },
    _getConfig: function _getConfig(binding, vnode) {
      var _ref, _binding$instance, _vnode$ctx;
      return (_ref = (binding === null || binding === void 0 || (_binding$instance = binding.instance) === null || _binding$instance === void 0 ? void 0 : _binding$instance.$primevue) || (vnode === null || vnode === void 0 || (_vnode$ctx = vnode.ctx) === null || _vnode$ctx === void 0 || (_vnode$ctx = _vnode$ctx.appContext) === null || _vnode$ctx === void 0 || (_vnode$ctx = _vnode$ctx.config) === null || _vnode$ctx === void 0 || (_vnode$ctx = _vnode$ctx.globalProperties) === null || _vnode$ctx === void 0 ? void 0 : _vnode$ctx.$primevue)) === null || _ref === void 0 ? void 0 : _ref.config;
    },
    _getOptionValue: function _getOptionValue(options) {
      var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      var fKeys = ObjectUtils.toFlatCase(key).split(".");
      var fKey = fKeys.shift();
      return fKey ? ObjectUtils.isObject(options) ? BaseDirective._getOptionValue(ObjectUtils.getItemValue(options[Object.keys(options).find(function(k2) {
        return ObjectUtils.toFlatCase(k2) === fKey;
      }) || ""], params), fKeys.join("."), params) : void 0 : ObjectUtils.getItemValue(options, params);
    },
    _getPTValue: function _getPTValue() {
      var _instance$binding, _instance$$config;
      var instance = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var obj = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var key = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "";
      var params = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
      var searchInDefaultPT = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
      var getValue2 = function getValue3() {
        var value = BaseDirective._getOptionValue.apply(BaseDirective, arguments);
        return ObjectUtils.isString(value) || ObjectUtils.isArray(value) ? {
          "class": value
        } : value;
      };
      var datasetPrefix = "data-pc-";
      var _ref2 = ((_instance$binding = instance.binding) === null || _instance$binding === void 0 || (_instance$binding = _instance$binding.value) === null || _instance$binding === void 0 ? void 0 : _instance$binding.ptOptions) || ((_instance$$config = instance.$config) === null || _instance$$config === void 0 ? void 0 : _instance$$config.ptOptions) || {}, _ref2$mergeSections = _ref2.mergeSections, mergeSections = _ref2$mergeSections === void 0 ? true : _ref2$mergeSections, _ref2$mergeProps = _ref2.mergeProps, useMergeProps = _ref2$mergeProps === void 0 ? false : _ref2$mergeProps;
      var global2 = searchInDefaultPT ? BaseDirective._useDefaultPT(instance, instance.defaultPT(), getValue2, key, params) : void 0;
      var self2 = BaseDirective._usePT(instance, BaseDirective._getPT(obj, instance.$name), getValue2, key, _objectSpread$5(_objectSpread$5({}, params), {}, {
        global: global2 || {}
      }));
      var datasets = _objectSpread$5(_objectSpread$5({}, key === "root" && _defineProperty$6({}, "".concat(datasetPrefix, "name"), ObjectUtils.toFlatCase(instance.$name))), {}, _defineProperty$6({}, "".concat(datasetPrefix, "section"), ObjectUtils.toFlatCase(key)));
      return mergeSections || !mergeSections && self2 ? useMergeProps ? mergeProps(global2, self2, datasets) : _objectSpread$5(_objectSpread$5(_objectSpread$5({}, global2), self2), datasets) : _objectSpread$5(_objectSpread$5({}, self2), datasets);
    },
    _getPT: function _getPT(pt) {
      var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      var callback = arguments.length > 2 ? arguments[2] : void 0;
      var getValue2 = function getValue3(value) {
        var _computedValue$_key;
        var computedValue = callback ? callback(value) : value;
        var _key = ObjectUtils.toFlatCase(key);
        return (_computedValue$_key = computedValue === null || computedValue === void 0 ? void 0 : computedValue[_key]) !== null && _computedValue$_key !== void 0 ? _computedValue$_key : computedValue;
      };
      return pt !== null && pt !== void 0 && pt.hasOwnProperty("_usept") ? {
        _usept: pt["_usept"],
        originalValue: getValue2(pt.originalValue),
        value: getValue2(pt.value)
      } : getValue2(pt);
    },
    _usePT: function _usePT() {
      var instance = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var pt = arguments.length > 1 ? arguments[1] : void 0;
      var callback = arguments.length > 2 ? arguments[2] : void 0;
      var key = arguments.length > 3 ? arguments[3] : void 0;
      var params = arguments.length > 4 ? arguments[4] : void 0;
      var fn = function fn2(value2) {
        return callback(value2, key, params);
      };
      if (pt !== null && pt !== void 0 && pt.hasOwnProperty("_usept")) {
        var _instance$$config2;
        var _ref4 = pt["_usept"] || ((_instance$$config2 = instance.$config) === null || _instance$$config2 === void 0 ? void 0 : _instance$$config2.ptOptions) || {}, _ref4$mergeSections = _ref4.mergeSections, mergeSections = _ref4$mergeSections === void 0 ? true : _ref4$mergeSections, _ref4$mergeProps = _ref4.mergeProps, useMergeProps = _ref4$mergeProps === void 0 ? false : _ref4$mergeProps;
        var originalValue = fn(pt.originalValue);
        var value = fn(pt.value);
        if (originalValue === void 0 && value === void 0)
          return void 0;
        else if (ObjectUtils.isString(value))
          return value;
        else if (ObjectUtils.isString(originalValue))
          return originalValue;
        return mergeSections || !mergeSections && value ? useMergeProps ? mergeProps(originalValue, value) : _objectSpread$5(_objectSpread$5({}, originalValue), value) : value;
      }
      return fn(pt);
    },
    _useDefaultPT: function _useDefaultPT() {
      var instance = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var defaultPT = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var callback = arguments.length > 2 ? arguments[2] : void 0;
      var key = arguments.length > 3 ? arguments[3] : void 0;
      var params = arguments.length > 4 ? arguments[4] : void 0;
      return BaseDirective._usePT(instance, defaultPT, callback, key, params);
    },
    _hook: function _hook(directiveName, hookName, el, binding, vnode, prevVnode) {
      var _binding$value, _config$pt;
      var name = "on".concat(ObjectUtils.toCapitalCase(hookName));
      var config = BaseDirective._getConfig(binding, vnode);
      var instance = el === null || el === void 0 ? void 0 : el.$instance;
      var selfHook = BaseDirective._usePT(instance, BaseDirective._getPT(binding === null || binding === void 0 || (_binding$value = binding.value) === null || _binding$value === void 0 ? void 0 : _binding$value.pt, directiveName), BaseDirective._getOptionValue, "hooks.".concat(name));
      var defaultHook = BaseDirective._useDefaultPT(instance, config === null || config === void 0 || (_config$pt = config.pt) === null || _config$pt === void 0 || (_config$pt = _config$pt.directives) === null || _config$pt === void 0 ? void 0 : _config$pt[directiveName], BaseDirective._getOptionValue, "hooks.".concat(name));
      var options = {
        el,
        binding,
        vnode,
        prevVnode
      };
      selfHook === null || selfHook === void 0 || selfHook(instance, options);
      defaultHook === null || defaultHook === void 0 || defaultHook(instance, options);
    },
    _extend: function _extend(name) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var handleHook = function handleHook2(hook, el, binding, vnode, prevVnode) {
        var _el$$instance$hook, _el$$instance7;
        el._$instances = el._$instances || {};
        var config = BaseDirective._getConfig(binding, vnode);
        var $prevInstance = el._$instances[name] || {};
        var $options = ObjectUtils.isEmpty($prevInstance) ? _objectSpread$5(_objectSpread$5({}, options), options === null || options === void 0 ? void 0 : options.methods) : {};
        el._$instances[name] = _objectSpread$5(_objectSpread$5({}, $prevInstance), {}, {
          /* new instance variables to pass in directive methods */
          $name: name,
          $host: el,
          $binding: binding,
          $modifiers: binding === null || binding === void 0 ? void 0 : binding.modifiers,
          $value: binding === null || binding === void 0 ? void 0 : binding.value,
          $el: $prevInstance["$el"] || el || void 0,
          $style: _objectSpread$5({
            classes: void 0,
            inlineStyles: void 0,
            loadStyle: function loadStyle() {
            }
          }, options === null || options === void 0 ? void 0 : options.style),
          $config: config,
          /* computed instance variables */
          defaultPT: function defaultPT() {
            return BaseDirective._getPT(config === null || config === void 0 ? void 0 : config.pt, void 0, function(value) {
              var _value$directives;
              return value === null || value === void 0 || (_value$directives = value.directives) === null || _value$directives === void 0 ? void 0 : _value$directives[name];
            });
          },
          isUnstyled: function isUnstyled() {
            var _el$$instance, _el$$instance2;
            return ((_el$$instance = el.$instance) === null || _el$$instance === void 0 || (_el$$instance = _el$$instance.$binding) === null || _el$$instance === void 0 || (_el$$instance = _el$$instance.value) === null || _el$$instance === void 0 ? void 0 : _el$$instance.unstyled) !== void 0 ? (_el$$instance2 = el.$instance) === null || _el$$instance2 === void 0 || (_el$$instance2 = _el$$instance2.$binding) === null || _el$$instance2 === void 0 || (_el$$instance2 = _el$$instance2.value) === null || _el$$instance2 === void 0 ? void 0 : _el$$instance2.unstyled : config === null || config === void 0 ? void 0 : config.unstyled;
          },
          /* instance's methods */
          ptm: function ptm() {
            var _el$$instance3;
            var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
            var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            return BaseDirective._getPTValue(el.$instance, (_el$$instance3 = el.$instance) === null || _el$$instance3 === void 0 || (_el$$instance3 = _el$$instance3.$binding) === null || _el$$instance3 === void 0 || (_el$$instance3 = _el$$instance3.value) === null || _el$$instance3 === void 0 ? void 0 : _el$$instance3.pt, key, _objectSpread$5({}, params));
          },
          ptmo: function ptmo() {
            var obj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
            var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
            var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
            return BaseDirective._getPTValue(el.$instance, obj, key, params, false);
          },
          cx: function cx() {
            var _el$$instance4, _el$$instance5;
            var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
            var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            return !((_el$$instance4 = el.$instance) !== null && _el$$instance4 !== void 0 && _el$$instance4.isUnstyled()) ? BaseDirective._getOptionValue((_el$$instance5 = el.$instance) === null || _el$$instance5 === void 0 || (_el$$instance5 = _el$$instance5.$style) === null || _el$$instance5 === void 0 ? void 0 : _el$$instance5.classes, key, _objectSpread$5({}, params)) : void 0;
          },
          sx: function sx() {
            var _el$$instance6;
            var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
            var when = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
            var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
            return when ? BaseDirective._getOptionValue((_el$$instance6 = el.$instance) === null || _el$$instance6 === void 0 || (_el$$instance6 = _el$$instance6.$style) === null || _el$$instance6 === void 0 ? void 0 : _el$$instance6.inlineStyles, key, _objectSpread$5({}, params)) : void 0;
          }
        }, $options);
        el.$instance = el._$instances[name];
        (_el$$instance$hook = (_el$$instance7 = el.$instance)[hook]) === null || _el$$instance$hook === void 0 || _el$$instance$hook.call(_el$$instance7, el, binding, vnode, prevVnode);
        BaseDirective._hook(name, hook, el, binding, vnode, prevVnode);
      };
      return {
        created: function created(el, binding, vnode, prevVnode) {
          handleHook("created", el, binding, vnode, prevVnode);
        },
        beforeMount: function beforeMount(el, binding, vnode, prevVnode) {
          var _config$csp, _el$$instance8, _el$$instance9, _config$csp2;
          var config = BaseDirective._getConfig(binding, vnode);
          BaseStyle.loadStyle(void 0, {
            nonce: config === null || config === void 0 || (_config$csp = config.csp) === null || _config$csp === void 0 ? void 0 : _config$csp.nonce
          });
          !((_el$$instance8 = el.$instance) !== null && _el$$instance8 !== void 0 && _el$$instance8.isUnstyled()) && ((_el$$instance9 = el.$instance) === null || _el$$instance9 === void 0 || (_el$$instance9 = _el$$instance9.$style) === null || _el$$instance9 === void 0 ? void 0 : _el$$instance9.loadStyle(void 0, {
            nonce: config === null || config === void 0 || (_config$csp2 = config.csp) === null || _config$csp2 === void 0 ? void 0 : _config$csp2.nonce
          }));
          handleHook("beforeMount", el, binding, vnode, prevVnode);
        },
        mounted: function mounted(el, binding, vnode, prevVnode) {
          handleHook("mounted", el, binding, vnode, prevVnode);
        },
        beforeUpdate: function beforeUpdate(el, binding, vnode, prevVnode) {
          handleHook("beforeUpdate", el, binding, vnode, prevVnode);
        },
        updated: function updated(el, binding, vnode, prevVnode) {
          handleHook("updated", el, binding, vnode, prevVnode);
        },
        beforeUnmount: function beforeUnmount(el, binding, vnode, prevVnode) {
          handleHook("beforeUnmount", el, binding, vnode, prevVnode);
        },
        unmounted: function unmounted(el, binding, vnode, prevVnode) {
          handleHook("unmounted", el, binding, vnode, prevVnode);
        }
      };
    },
    extend: function extend2() {
      var _BaseDirective$_getMe = BaseDirective._getMeta.apply(BaseDirective, arguments), _BaseDirective$_getMe2 = _slicedToArray(_BaseDirective$_getMe, 2), name = _BaseDirective$_getMe2[0], options = _BaseDirective$_getMe2[1];
      return _objectSpread$5({
        extend: function extend3() {
          var _BaseDirective$_getMe3 = BaseDirective._getMeta.apply(BaseDirective, arguments), _BaseDirective$_getMe4 = _slicedToArray(_BaseDirective$_getMe3, 2), _name = _BaseDirective$_getMe4[0], _options = _BaseDirective$_getMe4[1];
          return BaseDirective.extend(_name, _objectSpread$5(_objectSpread$5(_objectSpread$5({}, options), options === null || options === void 0 ? void 0 : options.methods), _options));
        }
      }, BaseDirective._extend(name, options));
    }
  };
  var css$4 = "\n@keyframes ripple {\n    100% {\n        opacity: 0;\n        transform: scale(2.5);\n    }\n}\n\n@layer primevue {\n    .p-ripple {\n        overflow: hidden;\n        position: relative;\n    }\n\n    .p-ink {\n        display: block;\n        position: absolute;\n        background: rgba(255, 255, 255, 0.5);\n        border-radius: 100%;\n        transform: scale(0);\n        pointer-events: none;\n    }\n\n    .p-ink-active {\n        animation: ripple 0.4s linear;\n    }\n\n    .p-ripple-disabled .p-ink {\n        display: none;\n    }\n}\n";
  var classes$5 = {
    root: "p-ink"
  };
  var RippleStyle = BaseStyle.extend({
    name: "ripple",
    css: css$4,
    classes: classes$5
  });
  var BaseRipple = BaseDirective.extend({
    style: RippleStyle
  });
  function _toConsumableArray$2(arr) {
    return _arrayWithoutHoles$2(arr) || _iterableToArray$2(arr) || _unsupportedIterableToArray$2(arr) || _nonIterableSpread$2();
  }
  function _nonIterableSpread$2() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray$2(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray$2(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray$2(o, minLen);
  }
  function _iterableToArray$2(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
      return Array.from(iter);
  }
  function _arrayWithoutHoles$2(arr) {
    if (Array.isArray(arr))
      return _arrayLikeToArray$2(arr);
  }
  function _arrayLikeToArray$2(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  var Ripple = BaseRipple.extend("ripple", {
    mounted: function mounted(el) {
      var _el$$instance;
      var config = el === null || el === void 0 || (_el$$instance = el.$instance) === null || _el$$instance === void 0 ? void 0 : _el$$instance.$config;
      if (config && config.ripple) {
        this.create(el);
        this.bindEvents(el);
        el.setAttribute("data-pd-ripple", true);
      }
    },
    unmounted: function unmounted(el) {
      this.remove(el);
    },
    timeout: void 0,
    methods: {
      bindEvents: function bindEvents(el) {
        el.addEventListener("mousedown", this.onMouseDown.bind(this));
      },
      unbindEvents: function unbindEvents(el) {
        el.removeEventListener("mousedown", this.onMouseDown.bind(this));
      },
      create: function create2(el) {
        var ink = DomHandler.createElement("span", {
          role: "presentation",
          "aria-hidden": true,
          "data-p-ink": true,
          "data-p-ink-active": false,
          "class": !this.isUnstyled() && this.cx("root"),
          onAnimationEnd: this.onAnimationEnd.bind(this),
          "p-bind": this.ptm("root")
        });
        el.appendChild(ink);
        this.$el = ink;
      },
      remove: function remove2(el) {
        var ink = this.getInk(el);
        if (ink) {
          this.unbindEvents(el);
          ink.removeEventListener("animationend", this.onAnimationEnd);
          ink.remove();
        }
      },
      onMouseDown: function onMouseDown(event) {
        var _this = this;
        var target = event.currentTarget;
        var ink = this.getInk(target);
        if (!ink || getComputedStyle(ink, null).display === "none") {
          return;
        }
        !this.isUnstyled() && DomHandler.removeClass(ink, "p-ink-active");
        ink.setAttribute("data-p-ink-active", "false");
        if (!DomHandler.getHeight(ink) && !DomHandler.getWidth(ink)) {
          var d = Math.max(DomHandler.getOuterWidth(target), DomHandler.getOuterHeight(target));
          ink.style.height = d + "px";
          ink.style.width = d + "px";
        }
        var offset = DomHandler.getOffset(target);
        var x2 = event.pageX - offset.left + document.body.scrollTop - DomHandler.getWidth(ink) / 2;
        var y = event.pageY - offset.top + document.body.scrollLeft - DomHandler.getHeight(ink) / 2;
        ink.style.top = y + "px";
        ink.style.left = x2 + "px";
        !this.isUnstyled() && DomHandler.addClass(ink, "p-ink-active");
        ink.setAttribute("data-p-ink-active", "true");
        this.timeout = setTimeout(function() {
          if (ink) {
            !_this.isUnstyled() && DomHandler.removeClass(ink, "p-ink-active");
            ink.setAttribute("data-p-ink-active", "false");
          }
        }, 401);
      },
      onAnimationEnd: function onAnimationEnd(event) {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        !this.isUnstyled() && DomHandler.removeClass(event.currentTarget, "p-ink-active");
        event.currentTarget.setAttribute("data-p-ink-active", "false");
      },
      getInk: function getInk(el) {
        return el && el.children ? _toConsumableArray$2(el.children).find(function(child) {
          return DomHandler.getAttribute(child, "data-pc-name") === "ripple";
        }) : void 0;
      }
    }
  });
  var classes$4 = {
    root: function root(_ref) {
      var props = _ref.props;
      return ["p-selectbutton p-buttonset p-component", {
        "p-disabled": props.disabled
      }];
    },
    button: function button(_ref2) {
      var instance = _ref2.instance, option = _ref2.option;
      return ["p-button p-component", {
        "p-highlight": instance.isSelected(option),
        "p-disabled": instance.isOptionDisabled(option)
      }];
    },
    label: "p-button-label"
  };
  var SelectButtonStyle = BaseStyle.extend({
    name: "selectbutton",
    classes: classes$4
  });
  var script$1$5 = {
    name: "BaseSelectButton",
    "extends": script$f,
    props: {
      modelValue: null,
      options: Array,
      optionLabel: null,
      optionValue: null,
      optionDisabled: null,
      multiple: Boolean,
      unselectable: {
        type: Boolean,
        "default": true
      },
      allowEmpty: {
        type: Boolean,
        "default": true
      },
      disabled: Boolean,
      dataKey: null,
      ariaLabelledby: {
        type: String,
        "default": null
      }
    },
    style: SelectButtonStyle,
    provide: function provide2() {
      return {
        $parentInstance: this
      };
    }
  };
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it2 = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it2) {
      if (Array.isArray(o) || (it2 = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it2)
          o = it2;
        var i = 0;
        var F = function F2() {
        };
        return { s: F, n: function n() {
          if (i >= o.length)
            return { done: true };
          return { done: false, value: o[i++] };
        }, e: function e(_e2) {
          throw _e2;
        }, f: F };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return { s: function s() {
      it2 = it2.call(o);
    }, n: function n() {
      var step = it2.next();
      normalCompletion = step.done;
      return step;
    }, e: function e(_e2) {
      didErr = true;
      err = _e2;
    }, f: function f() {
      try {
        if (!normalCompletion && it2["return"] != null)
          it2["return"]();
      } finally {
        if (didErr)
          throw err;
      }
    } };
  }
  function _toConsumableArray$1(arr) {
    return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread$1();
  }
  function _nonIterableSpread$1() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray$1(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray$1(o, minLen);
  }
  function _iterableToArray$1(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
      return Array.from(iter);
  }
  function _arrayWithoutHoles$1(arr) {
    if (Array.isArray(arr))
      return _arrayLikeToArray$1(arr);
  }
  function _arrayLikeToArray$1(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  var script$b = {
    name: "SelectButton",
    "extends": script$1$5,
    emits: ["update:modelValue", "focus", "blur", "change"],
    data: function data() {
      return {
        focusedIndex: 0
      };
    },
    mounted: function mounted() {
      this.defaultTabIndexes();
    },
    methods: {
      defaultTabIndexes: function defaultTabIndexes() {
        var opts = DomHandler.find(this.$refs.container, '[data-pc-section="button"]');
        var firstHighlight = DomHandler.findSingle(this.$refs.container, '[data-p-highlight="true"]');
        for (var i = 0; i < opts.length; i++) {
          if (DomHandler.getAttribute(opts[i], "data-p-highlight") === true && ObjectUtils.equals(opts[i], firstHighlight) || firstHighlight === null && i == 0) {
            this.focusedIndex = i;
          }
        }
      },
      getOptionLabel: function getOptionLabel(option) {
        return this.optionLabel ? ObjectUtils.resolveFieldData(option, this.optionLabel) : option;
      },
      getOptionValue: function getOptionValue(option) {
        return this.optionValue ? ObjectUtils.resolveFieldData(option, this.optionValue) : option;
      },
      getOptionRenderKey: function getOptionRenderKey(option) {
        return this.dataKey ? ObjectUtils.resolveFieldData(option, this.dataKey) : this.getOptionLabel(option);
      },
      getPTOptions: function getPTOptions(option, key) {
        return this.ptm(key, {
          context: {
            active: this.isSelected(option),
            disabled: this.isOptionDisabled(option),
            option
          }
        });
      },
      isOptionDisabled: function isOptionDisabled(option) {
        return this.optionDisabled ? ObjectUtils.resolveFieldData(option, this.optionDisabled) : false;
      },
      onOptionSelect: function onOptionSelect(event, option, index) {
        var _this = this;
        if (this.disabled || this.isOptionDisabled(option)) {
          return;
        }
        var selected = this.isSelected(option);
        if (selected && !(this.unselectable && this.allowEmpty)) {
          return;
        }
        var optionValue = this.getOptionValue(option);
        var newValue;
        if (this.multiple) {
          if (selected)
            newValue = this.modelValue.filter(function(val) {
              return !ObjectUtils.equals(val, optionValue, _this.equalityKey);
            });
          else
            newValue = this.modelValue ? [].concat(_toConsumableArray$1(this.modelValue), [optionValue]) : [optionValue];
        } else {
          newValue = selected ? null : optionValue;
        }
        this.focusedIndex = index;
        this.$emit("update:modelValue", newValue);
        this.$emit("change", {
          event,
          value: newValue
        });
      },
      isSelected: function isSelected(option) {
        var selected = false;
        var optionValue = this.getOptionValue(option);
        if (this.multiple) {
          if (this.modelValue) {
            var _iterator = _createForOfIteratorHelper(this.modelValue), _step;
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                var val = _step.value;
                if (ObjectUtils.equals(val, optionValue, this.equalityKey)) {
                  selected = true;
                  break;
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
        } else {
          selected = ObjectUtils.equals(this.modelValue, optionValue, this.equalityKey);
        }
        return selected;
      },
      onKeydown: function onKeydown(event, option, index) {
        switch (event.code) {
          case "Space": {
            this.onOptionSelect(event, option, index);
            event.preventDefault();
            break;
          }
          case "ArrowDown":
          case "ArrowRight": {
            this.changeTabIndexes(event, "next");
            event.preventDefault();
            break;
          }
          case "ArrowUp":
          case "ArrowLeft": {
            this.changeTabIndexes(event, "prev");
            event.preventDefault();
            break;
          }
        }
      },
      changeTabIndexes: function changeTabIndexes(event, direction) {
        var firstTabableChild, index;
        for (var i = 0; i <= this.$refs.container.children.length - 1; i++) {
          if (this.$refs.container.children[i].getAttribute("tabindex") === "0")
            firstTabableChild = {
              elem: this.$refs.container.children[i],
              index: i
            };
        }
        if (direction === "prev") {
          if (firstTabableChild.index === 0)
            index = this.$refs.container.children.length - 1;
          else
            index = firstTabableChild.index - 1;
        } else {
          if (firstTabableChild.index === this.$refs.container.children.length - 1)
            index = 0;
          else
            index = firstTabableChild.index + 1;
        }
        this.focusedIndex = index;
        this.$refs.container.children[index].focus();
      },
      onFocus: function onFocus(event) {
        this.$emit("focus", event);
      },
      onBlur: function onBlur(event, option) {
        if (event.target && event.relatedTarget && event.target.parentElement !== event.relatedTarget.parentElement) {
          this.defaultTabIndexes();
        }
        this.$emit("blur", event, option);
      }
    },
    computed: {
      equalityKey: function equalityKey() {
        return this.optionValue ? null : this.dataKey;
      }
    },
    directives: {
      ripple: Ripple
    }
  };
  var _hoisted_1$7 = ["aria-labelledby"];
  var _hoisted_2$5 = ["tabindex", "aria-label", "role", "aria-checked", "aria-disabled", "onClick", "onKeydown", "onBlur", "data-p-highlight", "data-p-disabled"];
  function render$9(_ctx, _cache, $props, $setup, $data, $options) {
    var _directive_ripple = resolveDirective("ripple");
    return openBlock(), createElementBlock("div", mergeProps({
      ref: "container",
      "class": _ctx.cx("root"),
      role: "group",
      "aria-labelledby": _ctx.ariaLabelledby
    }, _ctx.ptm("root"), {
      "data-pc-name": "selectbutton"
    }), [(openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.options, function(option, i) {
      return withDirectives((openBlock(), createElementBlock("div", mergeProps({
        key: $options.getOptionRenderKey(option),
        tabindex: i === $data.focusedIndex ? "0" : "-1",
        "aria-label": $options.getOptionLabel(option),
        role: _ctx.multiple ? "checkbox" : "radio",
        "aria-checked": $options.isSelected(option),
        "aria-disabled": _ctx.optionDisabled,
        "class": _ctx.cx("button", {
          option
        }),
        onClick: function onClick($event) {
          return $options.onOptionSelect($event, option, i);
        },
        onKeydown: function onKeydown($event) {
          return $options.onKeydown($event, option, i);
        },
        onFocus: _cache[0] || (_cache[0] = function($event) {
          return $options.onFocus($event);
        }),
        onBlur: function onBlur($event) {
          return $options.onBlur($event, option);
        }
      }, $options.getPTOptions(option, "button"), {
        "data-p-highlight": $options.isSelected(option),
        "data-p-disabled": $options.isOptionDisabled(option)
      }), [renderSlot(_ctx.$slots, "option", {
        option,
        index: i,
        "class": normalizeClass(_ctx.cx("label"))
      }, function() {
        return [createBaseVNode("span", mergeProps({
          "class": _ctx.cx("label")
        }, $options.getPTOptions(option, "label")), toDisplayString($options.getOptionLabel(option)), 17)];
      })], 16, _hoisted_2$5)), [[_directive_ripple]]);
    }), 128))], 16, _hoisted_1$7);
  }
  script$b.render = render$9;
  var css$3 = "\n@layer primevue {\n    .p-badge {\n        display: inline-block;\n        border-radius: 10px;\n        text-align: center;\n        padding: 0 .5rem;\n    }\n\n    .p-overlay-badge {\n        position: relative;\n    }\n\n    .p-overlay-badge .p-badge {\n        position: absolute;\n        top: 0;\n        right: 0;\n        transform: translate(50%,-50%);\n        transform-origin: 100% 0;\n        margin: 0;\n    }\n\n    .p-badge-dot {\n        width: .5rem;\n        min-width: .5rem;\n        height: .5rem;\n        border-radius: 50%;\n        padding: 0;\n    }\n\n    .p-badge-no-gutter {\n        padding: 0;\n        border-radius: 50%;\n    }\n}\n";
  var classes$3 = {
    root: function root(_ref) {
      var props = _ref.props, instance = _ref.instance;
      return ["p-badge p-component", {
        "p-badge-no-gutter": ObjectUtils.isNotEmpty(props.value) && String(props.value).length === 1,
        "p-badge-dot": ObjectUtils.isEmpty(props.value) && !instance.$slots["default"],
        "p-badge-lg": props.size === "large",
        "p-badge-xl": props.size === "xlarge",
        "p-badge-info": props.severity === "info",
        "p-badge-success": props.severity === "success",
        "p-badge-warning": props.severity === "warning",
        "p-badge-danger": props.severity === "danger"
      }];
    }
  };
  var BadgeStyle = BaseStyle.extend({
    name: "badge",
    css: css$3,
    classes: classes$3
  });
  var script$1$4 = {
    name: "BaseBadge",
    "extends": script$f,
    props: {
      value: {
        type: [String, Number],
        "default": null
      },
      severity: {
        type: String,
        "default": null
      },
      size: {
        type: String,
        "default": null
      }
    },
    style: BadgeStyle,
    provide: function provide2() {
      return {
        $parentInstance: this
      };
    }
  };
  var script$a = {
    name: "Badge",
    "extends": script$1$4
  };
  function render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("span", mergeProps({
      "class": _ctx.cx("root")
    }, _ctx.ptm("root"), {
      "data-pc-name": "badge"
    }), [renderSlot(_ctx.$slots, "default", {}, function() {
      return [createTextVNode(toDisplayString(_ctx.value), 1)];
    })], 16);
  }
  script$a.render = render$8;
  var css$2 = "\n.p-icon {\n    display: inline-block;\n}\n\n.p-icon-spin {\n    -webkit-animation: p-icon-spin 2s infinite linear;\n    animation: p-icon-spin 2s infinite linear;\n}\n\n@-webkit-keyframes p-icon-spin {\n    0% {\n        -webkit-transform: rotate(0deg);\n        transform: rotate(0deg);\n    }\n    100% {\n        -webkit-transform: rotate(359deg);\n        transform: rotate(359deg);\n    }\n}\n\n@keyframes p-icon-spin {\n    0% {\n        -webkit-transform: rotate(0deg);\n        transform: rotate(0deg);\n    }\n    100% {\n        -webkit-transform: rotate(359deg);\n        transform: rotate(359deg);\n    }\n}\n";
  var BaseIconStyle = BaseStyle.extend({
    name: "baseicon",
    css: css$2
  });
  function _typeof$5(o) {
    "@babel/helpers - typeof";
    return _typeof$5 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof$5(o);
  }
  function ownKeys$4(e, r2) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r2 && (o = o.filter(function(r3) {
        return Object.getOwnPropertyDescriptor(e, r3).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread$4(e) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys$4(Object(t), true).forEach(function(r3) {
        _defineProperty$5(e, r3, t[r3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function(r3) {
        Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
      });
    }
    return e;
  }
  function _defineProperty$5(obj, key, value) {
    key = _toPropertyKey$5(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey$5(t) {
    var i = _toPrimitive$5(t, "string");
    return "symbol" == _typeof$5(i) ? i : String(i);
  }
  function _toPrimitive$5(t, r2) {
    if ("object" != _typeof$5(t) || !t)
      return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r2 || "default");
      if ("object" != _typeof$5(i))
        return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t);
  }
  var script$9 = {
    name: "BaseIcon",
    "extends": script$f,
    props: {
      label: {
        type: String,
        "default": void 0
      },
      spin: {
        type: Boolean,
        "default": false
      }
    },
    style: BaseIconStyle,
    methods: {
      pti: function pti() {
        var isLabelEmpty = ObjectUtils.isEmpty(this.label);
        return _objectSpread$4(_objectSpread$4({}, !this.isUnstyled && {
          "class": ["p-icon", {
            "p-icon-spin": this.spin
          }]
        }), {}, {
          role: !isLabelEmpty ? "img" : void 0,
          "aria-label": !isLabelEmpty ? this.label : void 0,
          "aria-hidden": isLabelEmpty
        });
      }
    }
  };
  var script$8 = {
    name: "SpinnerIcon",
    "extends": script$9,
    computed: {
      pathId: function pathId() {
        return "pv_icon_clip_".concat(UniqueComponentId());
      }
    }
  };
  var _hoisted_1$6 = ["clip-path"];
  var _hoisted_2$4 = /* @__PURE__ */ createBaseVNode("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1);
  var _hoisted_3$2 = [_hoisted_2$4];
  var _hoisted_4$2 = ["id"];
  var _hoisted_5$2 = /* @__PURE__ */ createBaseVNode("rect", {
    width: "14",
    height: "14",
    fill: "white"
  }, null, -1);
  var _hoisted_6$2 = [_hoisted_5$2];
  function render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("svg", mergeProps({
      width: "14",
      height: "14",
      viewBox: "0 0 14 14",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, _ctx.pti()), [createBaseVNode("g", {
      "clip-path": "url(#".concat($options.pathId, ")")
    }, _hoisted_3$2, 8, _hoisted_1$6), createBaseVNode("defs", null, [createBaseVNode("clipPath", {
      id: "".concat($options.pathId)
    }, _hoisted_6$2, 8, _hoisted_4$2)])], 16);
  }
  script$8.render = render$7;
  function _typeof$4(o) {
    "@babel/helpers - typeof";
    return _typeof$4 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof$4(o);
  }
  function _defineProperty$4(obj, key, value) {
    key = _toPropertyKey$4(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey$4(t) {
    var i = _toPrimitive$4(t, "string");
    return "symbol" == _typeof$4(i) ? i : String(i);
  }
  function _toPrimitive$4(t, r2) {
    if ("object" != _typeof$4(t) || !t)
      return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r2 || "default");
      if ("object" != _typeof$4(i))
        return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t);
  }
  var classes$2 = {
    root: function root(_ref) {
      var instance = _ref.instance, props = _ref.props;
      return ["p-button p-component", _defineProperty$4(_defineProperty$4(_defineProperty$4(_defineProperty$4(_defineProperty$4(_defineProperty$4(_defineProperty$4(_defineProperty$4({
        "p-button-icon-only": instance.hasIcon && !props.label && !props.badge,
        "p-button-vertical": (props.iconPos === "top" || props.iconPos === "bottom") && props.label,
        "p-disabled": instance.$attrs.disabled || instance.$attrs.disabled === "" || props.loading,
        "p-button-loading": props.loading,
        "p-button-loading-label-only": props.loading && !instance.hasIcon && props.label,
        "p-button-link": props.link
      }, "p-button-".concat(props.severity), props.severity), "p-button-raised", props.raised), "p-button-rounded", props.rounded), "p-button-text", props.text), "p-button-outlined", props.outlined), "p-button-sm", props.size === "small"), "p-button-lg", props.size === "large"), "p-button-plain", props.plain)];
    },
    loadingIcon: "p-button-loading-icon pi-spin",
    icon: function icon(_ref3) {
      var props = _ref3.props;
      return ["p-button-icon", {
        "p-button-icon-left": props.iconPos === "left" && props.label,
        "p-button-icon-right": props.iconPos === "right" && props.label,
        "p-button-icon-top": props.iconPos === "top" && props.label,
        "p-button-icon-bottom": props.iconPos === "bottom" && props.label
      }];
    },
    label: "p-button-label"
  };
  var ButtonStyle = BaseStyle.extend({
    name: "button",
    classes: classes$2
  });
  var script$1$3 = {
    name: "BaseButton",
    "extends": script$f,
    props: {
      label: {
        type: String,
        "default": null
      },
      icon: {
        type: String,
        "default": null
      },
      iconPos: {
        type: String,
        "default": "left"
      },
      iconClass: {
        type: String,
        "default": null
      },
      badge: {
        type: String,
        "default": null
      },
      badgeClass: {
        type: String,
        "default": null
      },
      badgeSeverity: {
        type: String,
        "default": null
      },
      loading: {
        type: Boolean,
        "default": false
      },
      loadingIcon: {
        type: String,
        "default": void 0
      },
      link: {
        type: Boolean,
        "default": false
      },
      severity: {
        type: String,
        "default": null
      },
      raised: {
        type: Boolean,
        "default": false
      },
      rounded: {
        type: Boolean,
        "default": false
      },
      text: {
        type: Boolean,
        "default": false
      },
      outlined: {
        type: Boolean,
        "default": false
      },
      size: {
        type: String,
        "default": null
      },
      plain: {
        type: Boolean,
        "default": false
      }
    },
    style: ButtonStyle,
    provide: function provide2() {
      return {
        $parentInstance: this
      };
    }
  };
  var script$7 = {
    name: "Button",
    "extends": script$1$3,
    methods: {
      getPTOptions: function getPTOptions(key) {
        return this.ptm(key, {
          context: {
            disabled: this.disabled
          }
        });
      }
    },
    computed: {
      disabled: function disabled() {
        return this.$attrs.disabled || this.$attrs.disabled === "" || this.loading;
      },
      defaultAriaLabel: function defaultAriaLabel() {
        return this.label ? this.label + (this.badge ? " " + this.badge : "") : this.$attrs.ariaLabel;
      },
      hasIcon: function hasIcon() {
        return this.icon || this.$slots.icon;
      }
    },
    components: {
      SpinnerIcon: script$8,
      Badge: script$a
    },
    directives: {
      ripple: Ripple
    }
  };
  var _hoisted_1$5 = ["aria-label", "disabled", "data-pc-severity"];
  function render$6(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_SpinnerIcon = resolveComponent("SpinnerIcon");
    var _component_Badge = resolveComponent("Badge");
    var _directive_ripple = resolveDirective("ripple");
    return withDirectives((openBlock(), createElementBlock("button", mergeProps({
      "class": _ctx.cx("root"),
      type: "button",
      "aria-label": $options.defaultAriaLabel,
      disabled: $options.disabled
    }, $options.getPTOptions("root"), {
      "data-pc-name": "button",
      "data-pc-severity": _ctx.severity
    }), [renderSlot(_ctx.$slots, "default", {}, function() {
      return [_ctx.loading ? renderSlot(_ctx.$slots, "loadingicon", {
        key: 0,
        "class": normalizeClass([_ctx.cx("loadingIcon"), _ctx.cx("icon")])
      }, function() {
        return [_ctx.loadingIcon ? (openBlock(), createElementBlock("span", mergeProps({
          key: 0,
          "class": [_ctx.cx("loadingIcon"), _ctx.cx("icon"), _ctx.loadingIcon]
        }, _ctx.ptm("loadingIcon")), null, 16)) : (openBlock(), createBlock(_component_SpinnerIcon, mergeProps({
          key: 1,
          "class": [_ctx.cx("loadingIcon"), _ctx.cx("icon")],
          spin: ""
        }, _ctx.ptm("loadingIcon")), null, 16, ["class"]))];
      }) : renderSlot(_ctx.$slots, "icon", {
        key: 1,
        "class": normalizeClass([_ctx.cx("icon")])
      }, function() {
        return [_ctx.icon ? (openBlock(), createElementBlock("span", mergeProps({
          key: 0,
          "class": [_ctx.cx("icon"), _ctx.icon, _ctx.iconClass]
        }, _ctx.ptm("icon")), null, 16)) : createCommentVNode("", true)];
      }), createBaseVNode("span", mergeProps({
        "class": _ctx.cx("label")
      }, _ctx.ptm("label")), toDisplayString(_ctx.label || " "), 17), _ctx.badge ? (openBlock(), createBlock(_component_Badge, mergeProps({
        key: 2,
        value: _ctx.badge,
        "class": _ctx.badgeClass,
        severity: _ctx.badgeSeverity,
        unstyled: _ctx.unstyled
      }, _ctx.ptm("badge")), null, 16, ["value", "class", "severity", "unstyled"])) : createCommentVNode("", true)];
    })], 16, _hoisted_1$5)), [[_directive_ripple]]);
  }
  script$7.render = render$6;
  var script$6 = {
    name: "ChevronDownIcon",
    "extends": script$9
  };
  var _hoisted_1$4 = /* @__PURE__ */ createBaseVNode("path", {
    d: "M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z",
    fill: "currentColor"
  }, null, -1);
  var _hoisted_2$3 = [_hoisted_1$4];
  function render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("svg", mergeProps({
      width: "14",
      height: "14",
      viewBox: "0 0 14 14",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, _ctx.pti()), _hoisted_2$3, 16);
  }
  script$6.render = render$5;
  var script$5 = {
    name: "TimesCircleIcon",
    "extends": script$9,
    computed: {
      pathId: function pathId() {
        return "pv_icon_clip_".concat(UniqueComponentId());
      }
    }
  };
  var _hoisted_1$3 = ["clip-path"];
  var _hoisted_2$2 = /* @__PURE__ */ createBaseVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M7 14C5.61553 14 4.26215 13.5895 3.11101 12.8203C1.95987 12.0511 1.06266 10.9579 0.532846 9.67879C0.00303296 8.3997 -0.13559 6.99224 0.134506 5.63437C0.404603 4.2765 1.07129 3.02922 2.05026 2.05026C3.02922 1.07129 4.2765 0.404603 5.63437 0.134506C6.99224 -0.13559 8.3997 0.00303296 9.67879 0.532846C10.9579 1.06266 12.0511 1.95987 12.8203 3.11101C13.5895 4.26215 14 5.61553 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14ZM7 1.16667C5.84628 1.16667 4.71846 1.50879 3.75918 2.14976C2.79989 2.79074 2.05222 3.70178 1.61071 4.76768C1.16919 5.83358 1.05367 7.00647 1.27876 8.13803C1.50384 9.26958 2.05941 10.309 2.87521 11.1248C3.69102 11.9406 4.73042 12.4962 5.86198 12.7212C6.99353 12.9463 8.16642 12.8308 9.23232 12.3893C10.2982 11.9478 11.2093 11.2001 11.8502 10.2408C12.4912 9.28154 12.8333 8.15373 12.8333 7C12.8333 5.45291 12.2188 3.96918 11.1248 2.87521C10.0308 1.78125 8.5471 1.16667 7 1.16667ZM4.66662 9.91668C4.58998 9.91704 4.51404 9.90209 4.44325 9.87271C4.37246 9.84333 4.30826 9.8001 4.2544 9.74557C4.14516 9.6362 4.0838 9.48793 4.0838 9.33335C4.0838 9.17876 4.14516 9.0305 4.2544 8.92113L6.17553 7L4.25443 5.07891C4.15139 4.96832 4.09529 4.82207 4.09796 4.67094C4.10063 4.51982 4.16185 4.37563 4.26872 4.26876C4.3756 4.16188 4.51979 4.10066 4.67091 4.09799C4.82204 4.09532 4.96829 4.15142 5.07887 4.25446L6.99997 6.17556L8.92106 4.25446C9.03164 4.15142 9.1779 4.09532 9.32903 4.09799C9.48015 4.10066 9.62434 4.16188 9.73121 4.26876C9.83809 4.37563 9.89931 4.51982 9.90198 4.67094C9.90464 4.82207 9.84855 4.96832 9.74551 5.07891L7.82441 7L9.74554 8.92113C9.85478 9.0305 9.91614 9.17876 9.91614 9.33335C9.91614 9.48793 9.85478 9.6362 9.74554 9.74557C9.69168 9.8001 9.62748 9.84333 9.55669 9.87271C9.4859 9.90209 9.40996 9.91704 9.33332 9.91668C9.25668 9.91704 9.18073 9.90209 9.10995 9.87271C9.03916 9.84333 8.97495 9.8001 8.9211 9.74557L6.99997 7.82444L5.07884 9.74557C5.02499 9.8001 4.96078 9.84333 4.88999 9.87271C4.81921 9.90209 4.74326 9.91704 4.66662 9.91668Z",
    fill: "currentColor"
  }, null, -1);
  var _hoisted_3$1 = [_hoisted_2$2];
  var _hoisted_4$1 = ["id"];
  var _hoisted_5$1 = /* @__PURE__ */ createBaseVNode("rect", {
    width: "14",
    height: "14",
    fill: "white"
  }, null, -1);
  var _hoisted_6$1 = [_hoisted_5$1];
  function render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("svg", mergeProps({
      width: "14",
      height: "14",
      viewBox: "0 0 14 14",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, _ctx.pti()), [createBaseVNode("g", {
      "clip-path": "url(#".concat($options.pathId, ")")
    }, _hoisted_3$1, 8, _hoisted_1$3), createBaseVNode("defs", null, [createBaseVNode("clipPath", {
      id: "".concat($options.pathId)
    }, _hoisted_6$1, 8, _hoisted_4$1)])], 16);
  }
  script$5.render = render$4;
  var OverlayEventBus = primebus();
  var script$4 = {
    name: "Portal",
    props: {
      appendTo: {
        type: [String, Object],
        "default": "body"
      },
      disabled: {
        type: Boolean,
        "default": false
      }
    },
    data: function data() {
      return {
        mounted: false
      };
    },
    mounted: function mounted() {
      this.mounted = DomHandler.isClient();
    },
    computed: {
      inline: function inline() {
        return this.disabled || this.appendTo === "self";
      }
    }
  };
  function render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return $options.inline ? renderSlot(_ctx.$slots, "default", {
      key: 0
    }) : $data.mounted ? (openBlock(), createBlock(Teleport, {
      key: 1,
      to: $props.appendTo
    }, [renderSlot(_ctx.$slots, "default")], 8, ["to"])) : createCommentVNode("", true);
  }
  script$4.render = render$3;
  var css$1 = "\n@layer primevue {\n    .p-virtualscroller {\n        position: relative;\n        overflow: auto;\n        contain: strict;\n        transform: translateZ(0);\n        will-change: scroll-position;\n        outline: 0 none;\n    }\n\n    .p-virtualscroller-content {\n        position: absolute;\n        top: 0;\n        left: 0;\n        /* contain: content; */\n        min-height: 100%;\n        min-width: 100%;\n        will-change: transform;\n    }\n\n    .p-virtualscroller-spacer {\n        position: absolute;\n        top: 0;\n        left: 0;\n        height: 1px;\n        width: 1px;\n        transform-origin: 0 0;\n        pointer-events: none;\n    }\n\n    .p-virtualscroller .p-virtualscroller-loader {\n        position: sticky;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n    }\n\n    .p-virtualscroller-loader.p-component-overlay {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n    }\n\n    .p-virtualscroller-loading-icon {\n        font-size: 2rem;\n    }\n\n    .p-virtualscroller-loading-icon.p-icon {\n        width: 2rem;\n        height: 2rem;\n    }\n\n    .p-virtualscroller-horizontal > .p-virtualscroller-content {\n        display: flex;\n    }\n\n    /* Inline */\n    .p-virtualscroller-inline .p-virtualscroller-content {\n        position: static;\n    }\n}\n";
  var VirtualScrollerStyle = BaseStyle.extend({
    name: "virtualscroller",
    css: css$1
  });
  var script$1$2 = {
    name: "BaseVirtualScroller",
    "extends": script$f,
    props: {
      id: {
        type: String,
        "default": null
      },
      style: null,
      "class": null,
      items: {
        type: Array,
        "default": null
      },
      itemSize: {
        type: [Number, Array],
        "default": 0
      },
      scrollHeight: null,
      scrollWidth: null,
      orientation: {
        type: String,
        "default": "vertical"
      },
      numToleratedItems: {
        type: Number,
        "default": null
      },
      delay: {
        type: Number,
        "default": 0
      },
      resizeDelay: {
        type: Number,
        "default": 10
      },
      lazy: {
        type: Boolean,
        "default": false
      },
      disabled: {
        type: Boolean,
        "default": false
      },
      loaderDisabled: {
        type: Boolean,
        "default": false
      },
      columns: {
        type: Array,
        "default": null
      },
      loading: {
        type: Boolean,
        "default": false
      },
      showSpacer: {
        type: Boolean,
        "default": true
      },
      showLoader: {
        type: Boolean,
        "default": false
      },
      tabindex: {
        type: Number,
        "default": 0
      },
      inline: {
        type: Boolean,
        "default": false
      },
      step: {
        type: Number,
        "default": 0
      },
      appendOnly: {
        type: Boolean,
        "default": false
      },
      autoSize: {
        type: Boolean,
        "default": false
      }
    },
    style: VirtualScrollerStyle,
    provide: function provide2() {
      return {
        $parentInstance: this
      };
    },
    beforeMount: function beforeMount() {
      VirtualScrollerStyle.loadStyle();
    }
  };
  function _typeof$3(o) {
    "@babel/helpers - typeof";
    return _typeof$3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof$3(o);
  }
  function ownKeys$3(e, r2) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r2 && (o = o.filter(function(r3) {
        return Object.getOwnPropertyDescriptor(e, r3).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread$3(e) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys$3(Object(t), true).forEach(function(r3) {
        _defineProperty$3(e, r3, t[r3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function(r3) {
        Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
      });
    }
    return e;
  }
  function _defineProperty$3(obj, key, value) {
    key = _toPropertyKey$3(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey$3(t) {
    var i = _toPrimitive$3(t, "string");
    return "symbol" == _typeof$3(i) ? i : String(i);
  }
  function _toPrimitive$3(t, r2) {
    if ("object" != _typeof$3(t) || !t)
      return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r2 || "default");
      if ("object" != _typeof$3(i))
        return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t);
  }
  var script$3 = {
    name: "VirtualScroller",
    "extends": script$1$2,
    emits: ["update:numToleratedItems", "scroll", "scroll-index-change", "lazy-load"],
    data: function data() {
      return {
        first: this.isBoth() ? {
          rows: 0,
          cols: 0
        } : 0,
        last: this.isBoth() ? {
          rows: 0,
          cols: 0
        } : 0,
        page: this.isBoth() ? {
          rows: 0,
          cols: 0
        } : 0,
        numItemsInViewport: this.isBoth() ? {
          rows: 0,
          cols: 0
        } : 0,
        lastScrollPos: this.isBoth() ? {
          top: 0,
          left: 0
        } : 0,
        d_numToleratedItems: this.numToleratedItems,
        d_loading: this.loading,
        loaderArr: [],
        spacerStyle: {},
        contentStyle: {}
      };
    },
    element: null,
    content: null,
    lastScrollPos: null,
    scrollTimeout: null,
    resizeTimeout: null,
    defaultWidth: 0,
    defaultHeight: 0,
    defaultContentWidth: 0,
    defaultContentHeight: 0,
    isRangeChanged: false,
    lazyLoadState: {},
    resizeListener: null,
    initialized: false,
    watch: {
      numToleratedItems: function numToleratedItems(newValue) {
        this.d_numToleratedItems = newValue;
      },
      loading: function loading(newValue, oldValue) {
        if (this.lazy && newValue !== oldValue && newValue !== this.d_loading) {
          this.d_loading = newValue;
        }
      },
      items: function items(newValue, oldValue) {
        if (!oldValue || oldValue.length !== (newValue || []).length) {
          this.init();
          this.calculateAutoSize();
        }
      },
      itemSize: function itemSize() {
        this.init();
        this.calculateAutoSize();
      },
      orientation: function orientation() {
        this.lastScrollPos = this.isBoth() ? {
          top: 0,
          left: 0
        } : 0;
      },
      scrollHeight: function scrollHeight() {
        this.init();
        this.calculateAutoSize();
      },
      scrollWidth: function scrollWidth() {
        this.init();
        this.calculateAutoSize();
      }
    },
    mounted: function mounted() {
      this.viewInit();
      this.lastScrollPos = this.isBoth() ? {
        top: 0,
        left: 0
      } : 0;
      this.lazyLoadState = this.lazyLoadState || {};
    },
    updated: function updated() {
      !this.initialized && this.viewInit();
    },
    unmounted: function unmounted() {
      this.unbindResizeListener();
      this.initialized = false;
    },
    methods: {
      viewInit: function viewInit() {
        if (DomHandler.isVisible(this.element)) {
          this.setContentEl(this.content);
          this.init();
          this.bindResizeListener();
          this.defaultWidth = DomHandler.getWidth(this.element);
          this.defaultHeight = DomHandler.getHeight(this.element);
          this.defaultContentWidth = DomHandler.getWidth(this.content);
          this.defaultContentHeight = DomHandler.getHeight(this.content);
          this.initialized = true;
        }
      },
      init: function init() {
        if (!this.disabled) {
          this.setSize();
          this.calculateOptions();
          this.setSpacerSize();
        }
      },
      isVertical: function isVertical() {
        return this.orientation === "vertical";
      },
      isHorizontal: function isHorizontal() {
        return this.orientation === "horizontal";
      },
      isBoth: function isBoth() {
        return this.orientation === "both";
      },
      scrollTo: function scrollTo(options) {
        this.lastScrollPos = this.both ? {
          top: 0,
          left: 0
        } : 0;
        this.element && this.element.scrollTo(options);
      },
      scrollToIndex: function scrollToIndex(index) {
        var _this = this;
        var behavior = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "auto";
        var both = this.isBoth();
        var horizontal = this.isHorizontal();
        var first = this.first;
        var _this$calculateNumIte = this.calculateNumItems(), numToleratedItems = _this$calculateNumIte.numToleratedItems;
        var contentPos = this.getContentPosition();
        var itemSize = this.itemSize;
        var calculateFirst = function calculateFirst2() {
          var _index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
          var _numT = arguments.length > 1 ? arguments[1] : void 0;
          return _index <= _numT ? 0 : _index;
        };
        var calculateCoord = function calculateCoord2(_first, _size, _cpos) {
          return _first * _size + _cpos;
        };
        var scrollTo = function scrollTo2() {
          var left = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
          var top = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return _this.scrollTo({
            left,
            top,
            behavior
          });
        };
        var newFirst = both ? {
          rows: 0,
          cols: 0
        } : 0;
        var isRangeChanged = false;
        if (both) {
          newFirst = {
            rows: calculateFirst(index[0], numToleratedItems[0]),
            cols: calculateFirst(index[1], numToleratedItems[1])
          };
          scrollTo(calculateCoord(newFirst.cols, itemSize[1], contentPos.left), calculateCoord(newFirst.rows, itemSize[0], contentPos.top));
          isRangeChanged = newFirst.rows !== first.rows || newFirst.cols !== first.cols;
        } else {
          newFirst = calculateFirst(index, numToleratedItems);
          horizontal ? scrollTo(calculateCoord(newFirst, itemSize, contentPos.left), 0) : scrollTo(0, calculateCoord(newFirst, itemSize, contentPos.top));
          isRangeChanged = newFirst !== first;
        }
        this.isRangeChanged = isRangeChanged;
        this.first = newFirst;
      },
      scrollInView: function scrollInView(index, to) {
        var _this2 = this;
        var behavior = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "auto";
        if (to) {
          var both = this.isBoth();
          var horizontal = this.isHorizontal();
          var _this$getRenderedRang = this.getRenderedRange(), first = _this$getRenderedRang.first, viewport = _this$getRenderedRang.viewport;
          var scrollTo = function scrollTo2() {
            var left = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
            var top = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
            return _this2.scrollTo({
              left,
              top,
              behavior
            });
          };
          var isToStart = to === "to-start";
          var isToEnd = to === "to-end";
          if (isToStart) {
            if (both) {
              if (viewport.first.rows - first.rows > index[0]) {
                scrollTo(viewport.first.cols * this.itemSize[1], (viewport.first.rows - 1) * this.itemSize[0]);
              } else if (viewport.first.cols - first.cols > index[1]) {
                scrollTo((viewport.first.cols - 1) * this.itemSize[1], viewport.first.rows * this.itemSize[0]);
              }
            } else {
              if (viewport.first - first > index) {
                var pos = (viewport.first - 1) * this.itemSize;
                horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
              }
            }
          } else if (isToEnd) {
            if (both) {
              if (viewport.last.rows - first.rows <= index[0] + 1) {
                scrollTo(viewport.first.cols * this.itemSize[1], (viewport.first.rows + 1) * this.itemSize[0]);
              } else if (viewport.last.cols - first.cols <= index[1] + 1) {
                scrollTo((viewport.first.cols + 1) * this.itemSize[1], viewport.first.rows * this.itemSize[0]);
              }
            } else {
              if (viewport.last - first <= index + 1) {
                var _pos2 = (viewport.first + 1) * this.itemSize;
                horizontal ? scrollTo(_pos2, 0) : scrollTo(0, _pos2);
              }
            }
          }
        } else {
          this.scrollToIndex(index, behavior);
        }
      },
      getRenderedRange: function getRenderedRange() {
        var calculateFirstInViewport = function calculateFirstInViewport2(_pos, _size) {
          return Math.floor(_pos / (_size || _pos));
        };
        var firstInViewport = this.first;
        var lastInViewport = 0;
        if (this.element) {
          var both = this.isBoth();
          var horizontal = this.isHorizontal();
          var _this$element = this.element, scrollTop = _this$element.scrollTop, scrollLeft = _this$element.scrollLeft;
          if (both) {
            firstInViewport = {
              rows: calculateFirstInViewport(scrollTop, this.itemSize[0]),
              cols: calculateFirstInViewport(scrollLeft, this.itemSize[1])
            };
            lastInViewport = {
              rows: firstInViewport.rows + this.numItemsInViewport.rows,
              cols: firstInViewport.cols + this.numItemsInViewport.cols
            };
          } else {
            var scrollPos = horizontal ? scrollLeft : scrollTop;
            firstInViewport = calculateFirstInViewport(scrollPos, this.itemSize);
            lastInViewport = firstInViewport + this.numItemsInViewport;
          }
        }
        return {
          first: this.first,
          last: this.last,
          viewport: {
            first: firstInViewport,
            last: lastInViewport
          }
        };
      },
      calculateNumItems: function calculateNumItems() {
        var both = this.isBoth();
        var horizontal = this.isHorizontal();
        var itemSize = this.itemSize;
        var contentPos = this.getContentPosition();
        var contentWidth = this.element ? this.element.offsetWidth - contentPos.left : 0;
        var contentHeight = this.element ? this.element.offsetHeight - contentPos.top : 0;
        var calculateNumItemsInViewport = function calculateNumItemsInViewport2(_contentSize, _itemSize) {
          return Math.ceil(_contentSize / (_itemSize || _contentSize));
        };
        var calculateNumToleratedItems = function calculateNumToleratedItems2(_numItems) {
          return Math.ceil(_numItems / 2);
        };
        var numItemsInViewport = both ? {
          rows: calculateNumItemsInViewport(contentHeight, itemSize[0]),
          cols: calculateNumItemsInViewport(contentWidth, itemSize[1])
        } : calculateNumItemsInViewport(horizontal ? contentWidth : contentHeight, itemSize);
        var numToleratedItems = this.d_numToleratedItems || (both ? [calculateNumToleratedItems(numItemsInViewport.rows), calculateNumToleratedItems(numItemsInViewport.cols)] : calculateNumToleratedItems(numItemsInViewport));
        return {
          numItemsInViewport,
          numToleratedItems
        };
      },
      calculateOptions: function calculateOptions() {
        var _this3 = this;
        var both = this.isBoth();
        var first = this.first;
        var _this$calculateNumIte2 = this.calculateNumItems(), numItemsInViewport = _this$calculateNumIte2.numItemsInViewport, numToleratedItems = _this$calculateNumIte2.numToleratedItems;
        var calculateLast = function calculateLast2(_first, _num, _numT) {
          var _isCols = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
          return _this3.getLast(_first + _num + (_first < _numT ? 2 : 3) * _numT, _isCols);
        };
        var last = both ? {
          rows: calculateLast(first.rows, numItemsInViewport.rows, numToleratedItems[0]),
          cols: calculateLast(first.cols, numItemsInViewport.cols, numToleratedItems[1], true)
        } : calculateLast(first, numItemsInViewport, numToleratedItems);
        this.last = last;
        this.numItemsInViewport = numItemsInViewport;
        this.d_numToleratedItems = numToleratedItems;
        this.$emit("update:numToleratedItems", this.d_numToleratedItems);
        if (this.showLoader) {
          this.loaderArr = both ? Array.from({
            length: numItemsInViewport.rows
          }).map(function() {
            return Array.from({
              length: numItemsInViewport.cols
            });
          }) : Array.from({
            length: numItemsInViewport
          });
        }
        if (this.lazy) {
          Promise.resolve().then(function() {
            _this3.lazyLoadState = {
              first: _this3.step ? both ? {
                rows: 0,
                cols: first.cols
              } : 0 : first,
              last: Math.min(_this3.step ? _this3.step : last, _this3.items.length)
            };
            _this3.$emit("lazy-load", _this3.lazyLoadState);
          });
        }
      },
      calculateAutoSize: function calculateAutoSize() {
        var _this4 = this;
        if (this.autoSize && !this.d_loading) {
          Promise.resolve().then(function() {
            if (_this4.content) {
              var both = _this4.isBoth();
              var horizontal = _this4.isHorizontal();
              var vertical = _this4.isVertical();
              _this4.content.style.minHeight = _this4.content.style.minWidth = "auto";
              _this4.content.style.position = "relative";
              _this4.element.style.contain = "none";
              var _ref = [DomHandler.getWidth(_this4.content), DomHandler.getHeight(_this4.content)], contentWidth = _ref[0], contentHeight = _ref[1];
              contentWidth !== _this4.defaultContentWidth && (_this4.element.style.width = "");
              contentHeight !== _this4.defaultContentHeight && (_this4.element.style.height = "");
              var _ref2 = [DomHandler.getWidth(_this4.element), DomHandler.getHeight(_this4.element)], width = _ref2[0], height = _ref2[1];
              (both || horizontal) && (_this4.element.style.width = width < _this4.defaultWidth ? width + "px" : _this4.scrollWidth || _this4.defaultWidth + "px");
              (both || vertical) && (_this4.element.style.height = height < _this4.defaultHeight ? height + "px" : _this4.scrollHeight || _this4.defaultHeight + "px");
              _this4.content.style.minHeight = _this4.content.style.minWidth = "";
              _this4.content.style.position = "";
              _this4.element.style.contain = "";
            }
          });
        }
      },
      getLast: function getLast() {
        var last = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
        var isCols = arguments.length > 1 ? arguments[1] : void 0;
        return this.items ? Math.min(isCols ? (this.columns || this.items[0]).length : this.items.length, last) : 0;
      },
      getContentPosition: function getContentPosition() {
        if (this.content) {
          var style = getComputedStyle(this.content);
          var left = parseFloat(style.paddingLeft) + Math.max(parseFloat(style.left) || 0, 0);
          var right = parseFloat(style.paddingRight) + Math.max(parseFloat(style.right) || 0, 0);
          var top = parseFloat(style.paddingTop) + Math.max(parseFloat(style.top) || 0, 0);
          var bottom = parseFloat(style.paddingBottom) + Math.max(parseFloat(style.bottom) || 0, 0);
          return {
            left,
            right,
            top,
            bottom,
            x: left + right,
            y: top + bottom
          };
        }
        return {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          x: 0,
          y: 0
        };
      },
      setSize: function setSize() {
        var _this5 = this;
        if (this.element) {
          var both = this.isBoth();
          var horizontal = this.isHorizontal();
          var parentElement = this.element.parentElement;
          var width = this.scrollWidth || "".concat(this.element.offsetWidth || parentElement.offsetWidth, "px");
          var height = this.scrollHeight || "".concat(this.element.offsetHeight || parentElement.offsetHeight, "px");
          var setProp = function setProp2(_name, _value) {
            return _this5.element.style[_name] = _value;
          };
          if (both || horizontal) {
            setProp("height", height);
            setProp("width", width);
          } else {
            setProp("height", height);
          }
        }
      },
      setSpacerSize: function setSpacerSize() {
        var _this6 = this;
        var items = this.items;
        if (items) {
          var both = this.isBoth();
          var horizontal = this.isHorizontal();
          var contentPos = this.getContentPosition();
          var setProp = function setProp2(_name, _value, _size) {
            var _cpos = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
            return _this6.spacerStyle = _objectSpread$3(_objectSpread$3({}, _this6.spacerStyle), _defineProperty$3({}, "".concat(_name), (_value || []).length * _size + _cpos + "px"));
          };
          if (both) {
            setProp("height", items, this.itemSize[0], contentPos.y);
            setProp("width", this.columns || items[1], this.itemSize[1], contentPos.x);
          } else {
            horizontal ? setProp("width", this.columns || items, this.itemSize, contentPos.x) : setProp("height", items, this.itemSize, contentPos.y);
          }
        }
      },
      setContentPosition: function setContentPosition(pos) {
        var _this7 = this;
        if (this.content && !this.appendOnly) {
          var both = this.isBoth();
          var horizontal = this.isHorizontal();
          var first = pos ? pos.first : this.first;
          var calculateTranslateVal = function calculateTranslateVal2(_first, _size) {
            return _first * _size;
          };
          var setTransform = function setTransform2() {
            var _x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
            var _y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
            return _this7.contentStyle = _objectSpread$3(_objectSpread$3({}, _this7.contentStyle), {
              transform: "translate3d(".concat(_x, "px, ").concat(_y, "px, 0)")
            });
          };
          if (both) {
            setTransform(calculateTranslateVal(first.cols, this.itemSize[1]), calculateTranslateVal(first.rows, this.itemSize[0]));
          } else {
            var translateVal = calculateTranslateVal(first, this.itemSize);
            horizontal ? setTransform(translateVal, 0) : setTransform(0, translateVal);
          }
        }
      },
      onScrollPositionChange: function onScrollPositionChange(event) {
        var _this8 = this;
        var target = event.target;
        var both = this.isBoth();
        var horizontal = this.isHorizontal();
        var contentPos = this.getContentPosition();
        var calculateScrollPos = function calculateScrollPos2(_pos, _cpos) {
          return _pos ? _pos > _cpos ? _pos - _cpos : _pos : 0;
        };
        var calculateCurrentIndex = function calculateCurrentIndex2(_pos, _size) {
          return Math.floor(_pos / (_size || _pos));
        };
        var calculateTriggerIndex = function calculateTriggerIndex2(_currentIndex, _first, _last, _num, _numT, _isScrollDownOrRight) {
          return _currentIndex <= _numT ? _numT : _isScrollDownOrRight ? _last - _num - _numT : _first + _numT - 1;
        };
        var calculateFirst = function calculateFirst2(_currentIndex, _triggerIndex, _first, _last, _num, _numT, _isScrollDownOrRight) {
          if (_currentIndex <= _numT)
            return 0;
          else
            return Math.max(0, _isScrollDownOrRight ? _currentIndex < _triggerIndex ? _first : _currentIndex - _numT : _currentIndex > _triggerIndex ? _first : _currentIndex - 2 * _numT);
        };
        var calculateLast = function calculateLast2(_currentIndex, _first, _last, _num, _numT, _isCols) {
          var lastValue = _first + _num + 2 * _numT;
          if (_currentIndex >= _numT) {
            lastValue += _numT + 1;
          }
          return _this8.getLast(lastValue, _isCols);
        };
        var scrollTop = calculateScrollPos(target.scrollTop, contentPos.top);
        var scrollLeft = calculateScrollPos(target.scrollLeft, contentPos.left);
        var newFirst = both ? {
          rows: 0,
          cols: 0
        } : 0;
        var newLast = this.last;
        var isRangeChanged = false;
        var newScrollPos = this.lastScrollPos;
        if (both) {
          var isScrollDown = this.lastScrollPos.top <= scrollTop;
          var isScrollRight = this.lastScrollPos.left <= scrollLeft;
          if (!this.appendOnly || this.appendOnly && (isScrollDown || isScrollRight)) {
            var currentIndex = {
              rows: calculateCurrentIndex(scrollTop, this.itemSize[0]),
              cols: calculateCurrentIndex(scrollLeft, this.itemSize[1])
            };
            var triggerIndex = {
              rows: calculateTriggerIndex(currentIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
              cols: calculateTriggerIndex(currentIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
            };
            newFirst = {
              rows: calculateFirst(currentIndex.rows, triggerIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
              cols: calculateFirst(currentIndex.cols, triggerIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
            };
            newLast = {
              rows: calculateLast(currentIndex.rows, newFirst.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
              cols: calculateLast(currentIndex.cols, newFirst.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], true)
            };
            isRangeChanged = newFirst.rows !== this.first.rows || newLast.rows !== this.last.rows || newFirst.cols !== this.first.cols || newLast.cols !== this.last.cols || this.isRangeChanged;
            newScrollPos = {
              top: scrollTop,
              left: scrollLeft
            };
          }
        } else {
          var scrollPos = horizontal ? scrollLeft : scrollTop;
          var isScrollDownOrRight = this.lastScrollPos <= scrollPos;
          if (!this.appendOnly || this.appendOnly && isScrollDownOrRight) {
            var _currentIndex2 = calculateCurrentIndex(scrollPos, this.itemSize);
            var _triggerIndex2 = calculateTriggerIndex(_currentIndex2, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
            newFirst = calculateFirst(_currentIndex2, _triggerIndex2, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
            newLast = calculateLast(_currentIndex2, newFirst, this.last, this.numItemsInViewport, this.d_numToleratedItems);
            isRangeChanged = newFirst !== this.first || newLast !== this.last || this.isRangeChanged;
            newScrollPos = scrollPos;
          }
        }
        return {
          first: newFirst,
          last: newLast,
          isRangeChanged,
          scrollPos: newScrollPos
        };
      },
      onScrollChange: function onScrollChange(event) {
        var _this$onScrollPositio = this.onScrollPositionChange(event), first = _this$onScrollPositio.first, last = _this$onScrollPositio.last, isRangeChanged = _this$onScrollPositio.isRangeChanged, scrollPos = _this$onScrollPositio.scrollPos;
        if (isRangeChanged) {
          var newState = {
            first,
            last
          };
          this.setContentPosition(newState);
          this.first = first;
          this.last = last;
          this.lastScrollPos = scrollPos;
          this.$emit("scroll-index-change", newState);
          if (this.lazy && this.isPageChanged(first)) {
            var lazyLoadState = {
              first: this.step ? Math.min(this.getPageByFirst(first) * this.step, this.items.length - this.step) : first,
              last: Math.min(this.step ? (this.getPageByFirst(first) + 1) * this.step : last, this.items.length)
            };
            var isLazyStateChanged = this.lazyLoadState.first !== lazyLoadState.first || this.lazyLoadState.last !== lazyLoadState.last;
            isLazyStateChanged && this.$emit("lazy-load", lazyLoadState);
            this.lazyLoadState = lazyLoadState;
          }
        }
      },
      onScroll: function onScroll(event) {
        var _this9 = this;
        this.$emit("scroll", event);
        if (this.delay) {
          if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
          }
          if (this.isPageChanged()) {
            if (!this.d_loading && this.showLoader) {
              var _this$onScrollPositio2 = this.onScrollPositionChange(event), isRangeChanged = _this$onScrollPositio2.isRangeChanged;
              var changed = isRangeChanged || (this.step ? this.isPageChanged() : false);
              changed && (this.d_loading = true);
            }
            this.scrollTimeout = setTimeout(function() {
              _this9.onScrollChange(event);
              if (_this9.d_loading && _this9.showLoader && (!_this9.lazy || _this9.loading === void 0)) {
                _this9.d_loading = false;
                _this9.page = _this9.getPageByFirst();
              }
            }, this.delay);
          }
        } else {
          this.onScrollChange(event);
        }
      },
      onResize: function onResize() {
        var _this10 = this;
        if (this.resizeTimeout) {
          clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(function() {
          if (DomHandler.isVisible(_this10.element)) {
            var both = _this10.isBoth();
            var vertical = _this10.isVertical();
            var horizontal = _this10.isHorizontal();
            var _ref3 = [DomHandler.getWidth(_this10.element), DomHandler.getHeight(_this10.element)], width = _ref3[0], height = _ref3[1];
            var isDiffWidth = width !== _this10.defaultWidth, isDiffHeight = height !== _this10.defaultHeight;
            var reinit = both ? isDiffWidth || isDiffHeight : horizontal ? isDiffWidth : vertical ? isDiffHeight : false;
            if (reinit) {
              _this10.d_numToleratedItems = _this10.numToleratedItems;
              _this10.defaultWidth = width;
              _this10.defaultHeight = height;
              _this10.defaultContentWidth = DomHandler.getWidth(_this10.content);
              _this10.defaultContentHeight = DomHandler.getHeight(_this10.content);
              _this10.init();
            }
          }
        }, this.resizeDelay);
      },
      bindResizeListener: function bindResizeListener() {
        if (!this.resizeListener) {
          this.resizeListener = this.onResize.bind(this);
          window.addEventListener("resize", this.resizeListener);
          window.addEventListener("orientationchange", this.resizeListener);
        }
      },
      unbindResizeListener: function unbindResizeListener() {
        if (this.resizeListener) {
          window.removeEventListener("resize", this.resizeListener);
          window.removeEventListener("orientationchange", this.resizeListener);
          this.resizeListener = null;
        }
      },
      getOptions: function getOptions(renderedIndex) {
        var count = (this.items || []).length;
        var index = this.isBoth() ? this.first.rows + renderedIndex : this.first + renderedIndex;
        return {
          index,
          count,
          first: index === 0,
          last: index === count - 1,
          even: index % 2 === 0,
          odd: index % 2 !== 0
        };
      },
      getLoaderOptions: function getLoaderOptions(index, extOptions) {
        var count = this.loaderArr.length;
        return _objectSpread$3({
          index,
          count,
          first: index === 0,
          last: index === count - 1,
          even: index % 2 === 0,
          odd: index % 2 !== 0
        }, extOptions);
      },
      getPageByFirst: function getPageByFirst(first) {
        return Math.floor(((first !== null && first !== void 0 ? first : this.first) + this.d_numToleratedItems * 4) / (this.step || 1));
      },
      isPageChanged: function isPageChanged(first) {
        return this.step ? this.page !== this.getPageByFirst(first !== null && first !== void 0 ? first : this.first) : true;
      },
      setContentEl: function setContentEl(el) {
        this.content = el || this.content || DomHandler.findSingle(this.element, '[data-pc-section="content"]');
      },
      elementRef: function elementRef(el) {
        this.element = el;
      },
      contentRef: function contentRef(el) {
        this.content = el;
      }
    },
    computed: {
      containerClass: function containerClass() {
        return ["p-virtualscroller", this["class"], {
          "p-virtualscroller-inline": this.inline,
          "p-virtualscroller-both p-both-scroll": this.isBoth(),
          "p-virtualscroller-horizontal p-horizontal-scroll": this.isHorizontal()
        }];
      },
      contentClass: function contentClass() {
        return ["p-virtualscroller-content", {
          "p-virtualscroller-loading": this.d_loading
        }];
      },
      loaderClass: function loaderClass() {
        return ["p-virtualscroller-loader", {
          "p-component-overlay": !this.$slots.loader
        }];
      },
      loadedItems: function loadedItems() {
        var _this11 = this;
        if (this.items && !this.d_loading) {
          if (this.isBoth())
            return this.items.slice(this.appendOnly ? 0 : this.first.rows, this.last.rows).map(function(item) {
              return _this11.columns ? item : item.slice(_this11.appendOnly ? 0 : _this11.first.cols, _this11.last.cols);
            });
          else if (this.isHorizontal() && this.columns)
            return this.items;
          else
            return this.items.slice(this.appendOnly ? 0 : this.first, this.last);
        }
        return [];
      },
      loadedRows: function loadedRows() {
        return this.d_loading ? this.loaderDisabled ? this.loaderArr : [] : this.loadedItems;
      },
      loadedColumns: function loadedColumns() {
        if (this.columns) {
          var both = this.isBoth();
          var horizontal = this.isHorizontal();
          if (both || horizontal) {
            return this.d_loading && this.loaderDisabled ? both ? this.loaderArr[0] : this.loaderArr : this.columns.slice(both ? this.first.cols : this.first, both ? this.last.cols : this.last);
          }
        }
        return this.columns;
      }
    },
    components: {
      SpinnerIcon: script$8
    }
  };
  var _hoisted_1$2 = ["tabindex"];
  function render$2(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_SpinnerIcon = resolveComponent("SpinnerIcon");
    return !_ctx.disabled ? (openBlock(), createElementBlock("div", mergeProps({
      key: 0,
      ref: $options.elementRef,
      "class": $options.containerClass,
      tabindex: _ctx.tabindex,
      style: _ctx.style,
      onScroll: _cache[0] || (_cache[0] = function() {
        return $options.onScroll && $options.onScroll.apply($options, arguments);
      })
    }, _ctx.ptm("root"), {
      "data-pc-name": "virtualscroller"
    }), [renderSlot(_ctx.$slots, "content", {
      styleClass: $options.contentClass,
      items: $options.loadedItems,
      getItemOptions: $options.getOptions,
      loading: $data.d_loading,
      getLoaderOptions: $options.getLoaderOptions,
      itemSize: _ctx.itemSize,
      rows: $options.loadedRows,
      columns: $options.loadedColumns,
      contentRef: $options.contentRef,
      spacerStyle: $data.spacerStyle,
      contentStyle: $data.contentStyle,
      vertical: $options.isVertical(),
      horizontal: $options.isHorizontal(),
      both: $options.isBoth()
    }, function() {
      return [createBaseVNode("div", mergeProps({
        ref: $options.contentRef,
        "class": $options.contentClass,
        style: $data.contentStyle
      }, _ctx.ptm("content")), [(openBlock(true), createElementBlock(Fragment, null, renderList($options.loadedItems, function(item, index) {
        return renderSlot(_ctx.$slots, "item", {
          key: index,
          item,
          options: $options.getOptions(index)
        });
      }), 128))], 16)];
    }), _ctx.showSpacer ? (openBlock(), createElementBlock("div", mergeProps({
      key: 0,
      "class": "p-virtualscroller-spacer",
      style: $data.spacerStyle
    }, _ctx.ptm("spacer")), null, 16)) : createCommentVNode("", true), !_ctx.loaderDisabled && _ctx.showLoader && $data.d_loading ? (openBlock(), createElementBlock("div", mergeProps({
      key: 1,
      "class": $options.loaderClass
    }, _ctx.ptm("loader")), [_ctx.$slots && _ctx.$slots.loader ? (openBlock(true), createElementBlock(Fragment, {
      key: 0
    }, renderList($data.loaderArr, function(_, index) {
      return renderSlot(_ctx.$slots, "loader", {
        key: index,
        options: $options.getLoaderOptions(index, $options.isBoth() && {
          numCols: _ctx.d_numItemsInViewport.cols
        })
      });
    }), 128)) : createCommentVNode("", true), renderSlot(_ctx.$slots, "loadingicon", {}, function() {
      return [createVNode(_component_SpinnerIcon, mergeProps({
        spin: "",
        "class": "p-virtualscroller-loading-icon"
      }, _ctx.ptm("loadingIcon")), null, 16)];
    })], 16)) : createCommentVNode("", true)], 16, _hoisted_1$2)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [renderSlot(_ctx.$slots, "default"), renderSlot(_ctx.$slots, "content", {
      items: _ctx.items,
      rows: _ctx.items,
      columns: $options.loadedColumns
    })], 64));
  }
  script$3.render = render$2;
  var css = "\n@layer primevue {\n    .p-autocomplete {\n        display: inline-flex;\n    }\n\n    .p-autocomplete-loader {\n        position: absolute;\n        top: 50%;\n        margin-top: -0.5rem;\n    }\n\n    .p-autocomplete-dd .p-autocomplete-input {\n        flex: 1 1 auto;\n        width: 1%;\n    }\n\n    .p-autocomplete-dd .p-autocomplete-input,\n    .p-autocomplete-dd .p-autocomplete-multiple-container {\n        border-top-right-radius: 0;\n        border-bottom-right-radius: 0;\n    }\n\n    .p-autocomplete-dd .p-autocomplete-dropdown {\n        border-top-left-radius: 0;\n        border-bottom-left-radius: 0px;\n    }\n\n    .p-autocomplete .p-autocomplete-panel {\n        min-width: 100%;\n    }\n\n    .p-autocomplete-panel {\n        position: absolute;\n        overflow: auto;\n        top: 0;\n        left: 0;\n    }\n\n    .p-autocomplete-items {\n        margin: 0;\n        padding: 0;\n        list-style-type: none;\n    }\n\n    .p-autocomplete-item {\n        cursor: pointer;\n        white-space: nowrap;\n        position: relative;\n        overflow: hidden;\n    }\n\n    .p-autocomplete-multiple-container {\n        margin: 0;\n        padding: 0;\n        list-style-type: none;\n        cursor: text;\n        overflow: hidden;\n        display: flex;\n        align-items: center;\n        flex-wrap: wrap;\n    }\n\n    .p-autocomplete-token {\n        cursor: default;\n        display: inline-flex;\n        align-items: center;\n        flex: 0 0 auto;\n    }\n\n    .p-autocomplete-token-icon {\n        cursor: pointer;\n    }\n\n    .p-autocomplete-input-token {\n        flex: 1 1 auto;\n        display: inline-flex;\n    }\n\n    .p-autocomplete-input-token input {\n        border: 0 none;\n        outline: 0 none;\n        background-color: transparent;\n        margin: 0;\n        padding: 0;\n        box-shadow: none;\n        border-radius: 0;\n        width: 100%;\n    }\n\n    .p-fluid .p-autocomplete {\n        display: flex;\n    }\n\n    .p-fluid .p-autocomplete-dd .p-autocomplete-input {\n        width: 1%;\n    }\n}\n";
  var inlineStyles = {
    root: {
      position: "relative"
    }
  };
  var classes$1 = {
    root: function root(_ref) {
      var instance = _ref.instance, props = _ref.props;
      return ["p-autocomplete p-component p-inputwrapper", {
        "p-disabled": props.disabled,
        "p-focus": instance.focused,
        "p-autocomplete-dd": props.dropdown,
        "p-autocomplete-multiple": props.multiple,
        "p-inputwrapper-filled": props.modelValue || ObjectUtils.isNotEmpty(instance.inputValue),
        "p-inputwrapper-focus": instance.focused,
        "p-overlay-open": instance.overlayVisible
      }];
    },
    input: function input(_ref2) {
      var props = _ref2.props;
      return ["p-autocomplete-input p-inputtext p-component", {
        "p-autocomplete-dd-input": props.dropdown
      }];
    },
    container: "p-autocomplete-multiple-container p-component p-inputtext",
    token: function token(_ref3) {
      var instance = _ref3.instance, i = _ref3.i;
      return ["p-autocomplete-token", {
        "p-focus": instance.focusedMultipleOptionIndex === i
      }];
    },
    tokenLabel: "p-autocomplete-token-label",
    removeTokenIcon: "p-autocomplete-token-icon",
    inputToken: "p-autocomplete-input-token",
    loadingIcon: "p-autocomplete-loader",
    dropdownButton: "p-autocomplete-dropdown",
    panel: function panel(_ref4) {
      var instance = _ref4.instance;
      return ["p-autocomplete-panel p-component", {
        "p-input-filled": instance.$primevue.config.inputStyle === "filled",
        "p-ripple-disabled": instance.$primevue.config.ripple === false
      }];
    },
    list: "p-autocomplete-items",
    itemGroup: "p-autocomplete-item-group",
    item: function item(_ref5) {
      var instance = _ref5.instance, option = _ref5.option, i = _ref5.i, getItemOptions = _ref5.getItemOptions;
      return ["p-autocomplete-item", {
        "p-highlight": instance.isSelected(option),
        "p-focus": instance.focusedOptionIndex === instance.getOptionIndex(i, getItemOptions),
        "p-disabled": instance.isOptionDisabled(option)
      }];
    },
    emptyMessage: "p-autocomplete-empty-message"
  };
  var AutoCompleteStyle = BaseStyle.extend({
    name: "autocomplete",
    css,
    classes: classes$1,
    inlineStyles
  });
  var script$1$1 = {
    name: "BaseAutoComplete",
    "extends": script$f,
    props: {
      modelValue: null,
      suggestions: {
        type: Array,
        "default": null
      },
      field: {
        // TODO: Deprecated since v3.16.0
        type: [String, Function],
        "default": null
      },
      optionLabel: null,
      optionDisabled: null,
      optionGroupLabel: null,
      optionGroupChildren: null,
      scrollHeight: {
        type: String,
        "default": "200px"
      },
      dropdown: {
        type: Boolean,
        "default": false
      },
      dropdownMode: {
        type: String,
        "default": "blank"
      },
      autoHighlight: {
        // TODO: Deprecated since v3.16.0. Use selectOnFocus property instead.
        type: Boolean,
        "default": false
      },
      multiple: {
        type: Boolean,
        "default": false
      },
      loading: {
        type: Boolean,
        "default": false
      },
      disabled: {
        type: Boolean,
        "default": false
      },
      placeholder: {
        type: String,
        "default": null
      },
      dataKey: {
        type: String,
        "default": null
      },
      minLength: {
        type: Number,
        "default": 1
      },
      delay: {
        type: Number,
        "default": 300
      },
      appendTo: {
        type: [String, Object],
        "default": "body"
      },
      forceSelection: {
        type: Boolean,
        "default": false
      },
      completeOnFocus: {
        type: Boolean,
        "default": false
      },
      inputId: {
        type: String,
        "default": null
      },
      inputStyle: {
        type: Object,
        "default": null
      },
      inputClass: {
        type: [String, Object],
        "default": null
      },
      inputProps: {
        type: null,
        "default": null
      },
      panelStyle: {
        type: Object,
        "default": null
      },
      panelClass: {
        type: [String, Object],
        "default": null
      },
      panelProps: {
        type: null,
        "default": null
      },
      dropdownIcon: {
        type: String,
        "default": void 0
      },
      dropdownClass: {
        type: [String, Object],
        "default": null
      },
      loadingIcon: {
        type: String,
        "default": void 0
      },
      removeTokenIcon: {
        type: String,
        "default": void 0
      },
      virtualScrollerOptions: {
        type: Object,
        "default": null
      },
      autoOptionFocus: {
        type: Boolean,
        "default": true
      },
      selectOnFocus: {
        type: Boolean,
        "default": false
      },
      searchLocale: {
        type: String,
        "default": void 0
      },
      searchMessage: {
        type: String,
        "default": null
      },
      selectionMessage: {
        type: String,
        "default": null
      },
      emptySelectionMessage: {
        type: String,
        "default": null
      },
      emptySearchMessage: {
        type: String,
        "default": null
      },
      tabindex: {
        type: Number,
        "default": 0
      },
      ariaLabel: {
        type: String,
        "default": null
      },
      ariaLabelledby: {
        type: String,
        "default": null
      }
    },
    style: AutoCompleteStyle,
    provide: function provide2() {
      return {
        $parentInstance: this
      };
    }
  };
  function _typeof$1$1(o) {
    "@babel/helpers - typeof";
    return _typeof$1$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof$1$1(o);
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
      return Array.from(iter);
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr))
      return _arrayLikeToArray(arr);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  var script$2 = {
    name: "AutoComplete",
    "extends": script$1$1,
    emits: ["update:modelValue", "change", "focus", "blur", "item-select", "item-unselect", "dropdown-click", "clear", "complete", "before-show", "before-hide", "show", "hide"],
    outsideClickListener: null,
    resizeListener: null,
    scrollHandler: null,
    overlay: null,
    virtualScroller: null,
    searchTimeout: null,
    focusOnHover: false,
    dirty: false,
    data: function data() {
      return {
        id: this.$attrs.id,
        focused: false,
        focusedOptionIndex: -1,
        focusedMultipleOptionIndex: -1,
        overlayVisible: false,
        searching: false
      };
    },
    watch: {
      "$attrs.id": function $attrsId(newValue) {
        this.id = newValue || UniqueComponentId();
      },
      suggestions: function suggestions() {
        if (this.searching) {
          this.show();
          this.focusedOptionIndex = this.overlayVisible && this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
          this.searching = false;
        }
        this.autoUpdateModel();
      }
    },
    mounted: function mounted() {
      this.id = this.id || UniqueComponentId();
      this.autoUpdateModel();
    },
    updated: function updated() {
      if (this.overlayVisible) {
        this.alignOverlay();
      }
    },
    beforeUnmount: function beforeUnmount() {
      this.unbindOutsideClickListener();
      this.unbindResizeListener();
      if (this.scrollHandler) {
        this.scrollHandler.destroy();
        this.scrollHandler = null;
      }
      if (this.overlay) {
        ZIndexUtils.clear(this.overlay);
        this.overlay = null;
      }
    },
    methods: {
      getOptionIndex: function getOptionIndex(index, fn) {
        return this.virtualScrollerDisabled ? index : fn && fn(index)["index"];
      },
      getOptionLabel: function getOptionLabel(option) {
        return this.field || this.optionLabel ? ObjectUtils.resolveFieldData(option, this.field || this.optionLabel) : option;
      },
      getOptionValue: function getOptionValue(option) {
        return option;
      },
      getOptionRenderKey: function getOptionRenderKey(option, index) {
        return (this.dataKey ? ObjectUtils.resolveFieldData(option, this.dataKey) : this.getOptionLabel(option)) + "_" + index;
      },
      getPTOptions: function getPTOptions(option, itemOptions, index, key) {
        return this.ptm(key, {
          context: {
            selected: this.isSelected(option),
            focused: this.focusedOptionIndex === this.getOptionIndex(index, itemOptions),
            disabled: this.isOptionDisabled(option)
          }
        });
      },
      isOptionDisabled: function isOptionDisabled(option) {
        return this.optionDisabled ? ObjectUtils.resolveFieldData(option, this.optionDisabled) : false;
      },
      isOptionGroup: function isOptionGroup(option) {
        return this.optionGroupLabel && option.optionGroup && option.group;
      },
      getOptionGroupLabel: function getOptionGroupLabel(optionGroup) {
        return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupLabel);
      },
      getOptionGroupChildren: function getOptionGroupChildren(optionGroup) {
        return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupChildren);
      },
      getAriaPosInset: function getAriaPosInset(index) {
        var _this = this;
        return (this.optionGroupLabel ? index - this.visibleOptions.slice(0, index).filter(function(option) {
          return _this.isOptionGroup(option);
        }).length : index) + 1;
      },
      show: function show(isFocus) {
        this.$emit("before-show");
        this.dirty = true;
        this.overlayVisible = true;
        this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
        isFocus && DomHandler.focus(this.$refs.focusInput);
      },
      hide: function hide(isFocus) {
        var _this2 = this;
        var _hide = function _hide2() {
          _this2.$emit("before-hide");
          _this2.dirty = isFocus;
          _this2.overlayVisible = false;
          _this2.focusedOptionIndex = -1;
          isFocus && DomHandler.focus(_this2.$refs.focusInput);
        };
        setTimeout(function() {
          _hide();
        }, 0);
      },
      onFocus: function onFocus(event) {
        if (this.disabled) {
          return;
        }
        if (!this.dirty && this.completeOnFocus) {
          this.search(event, event.target.value, "focus");
        }
        this.dirty = true;
        this.focused = true;
        this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.overlayVisible && this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
        this.overlayVisible && this.scrollInView(this.focusedOptionIndex);
        this.$emit("focus", event);
      },
      onBlur: function onBlur(event) {
        this.dirty = false;
        this.focused = false;
        this.focusedOptionIndex = -1;
        this.$emit("blur", event);
      },
      onKeyDown: function onKeyDown(event) {
        if (this.disabled) {
          event.preventDefault();
          return;
        }
        switch (event.code) {
          case "ArrowDown":
            this.onArrowDownKey(event);
            break;
          case "ArrowUp":
            this.onArrowUpKey(event);
            break;
          case "ArrowLeft":
            this.onArrowLeftKey(event);
            break;
          case "ArrowRight":
            this.onArrowRightKey(event);
            break;
          case "Home":
            this.onHomeKey(event);
            break;
          case "End":
            this.onEndKey(event);
            break;
          case "PageDown":
            this.onPageDownKey(event);
            break;
          case "PageUp":
            this.onPageUpKey(event);
            break;
          case "Enter":
          case "NumpadEnter":
            this.onEnterKey(event);
            break;
          case "Escape":
            this.onEscapeKey(event);
            break;
          case "Tab":
            this.onTabKey(event);
            break;
          case "Backspace":
            this.onBackspaceKey(event);
            break;
        }
      },
      onInput: function onInput(event) {
        var _this3 = this;
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
        }
        var query = event.target.value;
        if (!this.multiple) {
          this.updateModel(event, query);
        }
        if (query.length === 0) {
          this.hide();
          this.$emit("clear");
        } else {
          if (query.length >= this.minLength) {
            this.focusedOptionIndex = -1;
            this.searchTimeout = setTimeout(function() {
              _this3.search(event, query, "input");
            }, this.delay);
          } else {
            this.hide();
          }
        }
      },
      onChange: function onChange(event) {
        var _this4 = this;
        if (this.forceSelection) {
          var valid = false;
          if (this.visibleOptions && !this.multiple) {
            var matchedValue = this.visibleOptions.find(function(option) {
              return _this4.isOptionMatched(option, _this4.$refs.focusInput.value || "");
            });
            if (matchedValue !== void 0) {
              valid = true;
              !this.isSelected(matchedValue) && this.onOptionSelect(event, matchedValue);
            }
          }
          if (!valid) {
            this.$refs.focusInput.value = "";
            this.$emit("clear");
            !this.multiple && this.updateModel(event, null);
          }
        }
      },
      onMultipleContainerFocus: function onMultipleContainerFocus() {
        if (this.disabled) {
          return;
        }
        this.focused = true;
      },
      onMultipleContainerBlur: function onMultipleContainerBlur() {
        this.focusedMultipleOptionIndex = -1;
        this.focused = false;
      },
      onMultipleContainerKeyDown: function onMultipleContainerKeyDown(event) {
        if (this.disabled) {
          event.preventDefault();
          return;
        }
        switch (event.code) {
          case "ArrowLeft":
            this.onArrowLeftKeyOnMultiple(event);
            break;
          case "ArrowRight":
            this.onArrowRightKeyOnMultiple(event);
            break;
          case "Backspace":
            this.onBackspaceKeyOnMultiple(event);
            break;
        }
      },
      onContainerClick: function onContainerClick(event) {
        if (this.disabled || this.searching || this.loading || this.isInputClicked(event) || this.isDropdownClicked(event)) {
          return;
        }
        if (!this.overlay || !this.overlay.contains(event.target)) {
          DomHandler.focus(this.$refs.focusInput);
        }
      },
      onDropdownClick: function onDropdownClick(event) {
        var query = void 0;
        if (this.overlayVisible) {
          this.hide(true);
        } else {
          DomHandler.focus(this.$refs.focusInput);
          query = this.$refs.focusInput.value;
          if (this.dropdownMode === "blank")
            this.search(event, "", "dropdown");
          else if (this.dropdownMode === "current")
            this.search(event, query, "dropdown");
        }
        this.$emit("dropdown-click", {
          originalEvent: event,
          query
        });
      },
      onOptionSelect: function onOptionSelect(event, option) {
        var isHide = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
        var value = this.getOptionValue(option);
        if (this.multiple) {
          this.$refs.focusInput.value = "";
          if (!this.isSelected(option)) {
            this.updateModel(event, [].concat(_toConsumableArray(this.modelValue || []), [value]));
          }
        } else {
          this.updateModel(event, value);
        }
        this.$emit("item-select", {
          originalEvent: event,
          value: option
        });
        isHide && this.hide(true);
      },
      onOptionMouseMove: function onOptionMouseMove(event, index) {
        if (this.focusOnHover) {
          this.changeFocusedOptionIndex(event, index);
        }
      },
      onOverlayClick: function onOverlayClick(event) {
        OverlayEventBus.emit("overlay-click", {
          originalEvent: event,
          target: this.$el
        });
      },
      onOverlayKeyDown: function onOverlayKeyDown(event) {
        switch (event.code) {
          case "Escape":
            this.onEscapeKey(event);
            break;
        }
      },
      onArrowDownKey: function onArrowDownKey(event) {
        if (!this.overlayVisible) {
          return;
        }
        var optionIndex = this.focusedOptionIndex !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex) : this.findFirstFocusedOptionIndex();
        this.changeFocusedOptionIndex(event, optionIndex);
        event.preventDefault();
      },
      onArrowUpKey: function onArrowUpKey(event) {
        if (!this.overlayVisible) {
          return;
        }
        if (event.altKey) {
          if (this.focusedOptionIndex !== -1) {
            this.onOptionSelect(event, this.visibleOptions[this.focusedOptionIndex]);
          }
          this.overlayVisible && this.hide();
          event.preventDefault();
        } else {
          var optionIndex = this.focusedOptionIndex !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex) : this.findLastFocusedOptionIndex();
          this.changeFocusedOptionIndex(event, optionIndex);
          event.preventDefault();
        }
      },
      onArrowLeftKey: function onArrowLeftKey(event) {
        var target = event.currentTarget;
        this.focusedOptionIndex = -1;
        if (this.multiple) {
          if (ObjectUtils.isEmpty(target.value) && this.hasSelectedOption) {
            DomHandler.focus(this.$refs.multiContainer);
            this.focusedMultipleOptionIndex = this.modelValue.length;
          } else {
            event.stopPropagation();
          }
        }
      },
      onArrowRightKey: function onArrowRightKey(event) {
        this.focusedOptionIndex = -1;
        this.multiple && event.stopPropagation();
      },
      onHomeKey: function onHomeKey(event) {
        var currentTarget = event.currentTarget;
        var len = currentTarget.value.length;
        currentTarget.setSelectionRange(0, event.shiftKey ? len : 0);
        this.focusedOptionIndex = -1;
        event.preventDefault();
      },
      onEndKey: function onEndKey(event) {
        var currentTarget = event.currentTarget;
        var len = currentTarget.value.length;
        currentTarget.setSelectionRange(event.shiftKey ? 0 : len, len);
        this.focusedOptionIndex = -1;
        event.preventDefault();
      },
      onPageUpKey: function onPageUpKey(event) {
        this.scrollInView(0);
        event.preventDefault();
      },
      onPageDownKey: function onPageDownKey(event) {
        this.scrollInView(this.visibleOptions.length - 1);
        event.preventDefault();
      },
      onEnterKey: function onEnterKey(event) {
        if (!this.overlayVisible) {
          this.onArrowDownKey(event);
        } else {
          if (this.focusedOptionIndex !== -1) {
            this.onOptionSelect(event, this.visibleOptions[this.focusedOptionIndex]);
          }
          this.hide();
        }
        event.preventDefault();
      },
      onEscapeKey: function onEscapeKey(event) {
        this.overlayVisible && this.hide(true);
        event.preventDefault();
      },
      onTabKey: function onTabKey(event) {
        if (this.focusedOptionIndex !== -1) {
          this.onOptionSelect(event, this.visibleOptions[this.focusedOptionIndex]);
        }
        this.overlayVisible && this.hide();
      },
      onBackspaceKey: function onBackspaceKey(event) {
        if (this.multiple) {
          if (ObjectUtils.isNotEmpty(this.modelValue) && !this.$refs.focusInput.value) {
            var removedValue = this.modelValue[this.modelValue.length - 1];
            var newValue = this.modelValue.slice(0, -1);
            this.$emit("update:modelValue", newValue);
            this.$emit("item-unselect", {
              originalEvent: event,
              value: removedValue
            });
          }
          event.stopPropagation();
        }
      },
      onArrowLeftKeyOnMultiple: function onArrowLeftKeyOnMultiple() {
        this.focusedMultipleOptionIndex = this.focusedMultipleOptionIndex < 1 ? 0 : this.focusedMultipleOptionIndex - 1;
      },
      onArrowRightKeyOnMultiple: function onArrowRightKeyOnMultiple() {
        this.focusedMultipleOptionIndex++;
        if (this.focusedMultipleOptionIndex > this.modelValue.length - 1) {
          this.focusedMultipleOptionIndex = -1;
          DomHandler.focus(this.$refs.focusInput);
        }
      },
      onBackspaceKeyOnMultiple: function onBackspaceKeyOnMultiple(event) {
        if (this.focusedMultipleOptionIndex !== -1) {
          this.removeOption(event, this.focusedMultipleOptionIndex);
        }
      },
      onOverlayEnter: function onOverlayEnter(el) {
        ZIndexUtils.set("overlay", el, this.$primevue.config.zIndex.overlay);
        DomHandler.addStyles(el, {
          position: "absolute",
          top: "0",
          left: "0"
        });
        this.alignOverlay();
      },
      onOverlayAfterEnter: function onOverlayAfterEnter() {
        this.bindOutsideClickListener();
        this.bindScrollListener();
        this.bindResizeListener();
        this.$emit("show");
      },
      onOverlayLeave: function onOverlayLeave() {
        this.unbindOutsideClickListener();
        this.unbindScrollListener();
        this.unbindResizeListener();
        this.$emit("hide");
        this.overlay = null;
      },
      onOverlayAfterLeave: function onOverlayAfterLeave(el) {
        ZIndexUtils.clear(el);
      },
      alignOverlay: function alignOverlay() {
        var target = this.multiple ? this.$refs.multiContainer : this.$refs.focusInput;
        if (this.appendTo === "self") {
          DomHandler.relativePosition(this.overlay, target);
        } else {
          this.overlay.style.minWidth = DomHandler.getOuterWidth(target) + "px";
          DomHandler.absolutePosition(this.overlay, target);
        }
      },
      bindOutsideClickListener: function bindOutsideClickListener() {
        var _this5 = this;
        if (!this.outsideClickListener) {
          this.outsideClickListener = function(event) {
            if (_this5.overlayVisible && _this5.overlay && _this5.isOutsideClicked(event)) {
              _this5.hide();
            }
          };
          document.addEventListener("click", this.outsideClickListener);
        }
      },
      unbindOutsideClickListener: function unbindOutsideClickListener() {
        if (this.outsideClickListener) {
          document.removeEventListener("click", this.outsideClickListener);
          this.outsideClickListener = null;
        }
      },
      bindScrollListener: function bindScrollListener() {
        var _this6 = this;
        if (!this.scrollHandler) {
          this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.container, function() {
            if (_this6.overlayVisible) {
              _this6.hide();
            }
          });
        }
        this.scrollHandler.bindScrollListener();
      },
      unbindScrollListener: function unbindScrollListener() {
        if (this.scrollHandler) {
          this.scrollHandler.unbindScrollListener();
        }
      },
      bindResizeListener: function bindResizeListener() {
        var _this7 = this;
        if (!this.resizeListener) {
          this.resizeListener = function() {
            if (_this7.overlayVisible && !DomHandler.isTouchDevice()) {
              _this7.hide();
            }
          };
          window.addEventListener("resize", this.resizeListener);
        }
      },
      unbindResizeListener: function unbindResizeListener() {
        if (this.resizeListener) {
          window.removeEventListener("resize", this.resizeListener);
          this.resizeListener = null;
        }
      },
      isOutsideClicked: function isOutsideClicked(event) {
        return !this.overlay.contains(event.target) && !this.isInputClicked(event) && !this.isDropdownClicked(event);
      },
      isInputClicked: function isInputClicked(event) {
        if (this.multiple)
          return event.target === this.$refs.multiContainer || this.$refs.multiContainer.contains(event.target);
        else
          return event.target === this.$refs.focusInput;
      },
      isDropdownClicked: function isDropdownClicked(event) {
        return this.$refs.dropdownButton ? event.target === this.$refs.dropdownButton || this.$refs.dropdownButton.$el.contains(event.target) : false;
      },
      isOptionMatched: function isOptionMatched(option, value) {
        return this.isValidOption(option) && this.getOptionLabel(option).toLocaleLowerCase(this.searchLocale) === value.toLocaleLowerCase(this.searchLocale);
      },
      isValidOption: function isValidOption(option) {
        return ObjectUtils.isNotEmpty(option) && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
      },
      isValidSelectedOption: function isValidSelectedOption(option) {
        return this.isValidOption(option) && this.isSelected(option);
      },
      isSelected: function isSelected(option) {
        return ObjectUtils.equals(this.modelValue, this.getOptionValue(option), this.equalityKey);
      },
      findFirstOptionIndex: function findFirstOptionIndex() {
        var _this8 = this;
        return this.visibleOptions.findIndex(function(option) {
          return _this8.isValidOption(option);
        });
      },
      findLastOptionIndex: function findLastOptionIndex() {
        var _this9 = this;
        return ObjectUtils.findLastIndex(this.visibleOptions, function(option) {
          return _this9.isValidOption(option);
        });
      },
      findNextOptionIndex: function findNextOptionIndex(index) {
        var _this10 = this;
        var matchedOptionIndex = index < this.visibleOptions.length - 1 ? this.visibleOptions.slice(index + 1).findIndex(function(option) {
          return _this10.isValidOption(option);
        }) : -1;
        return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index;
      },
      findPrevOptionIndex: function findPrevOptionIndex(index) {
        var _this11 = this;
        var matchedOptionIndex = index > 0 ? ObjectUtils.findLastIndex(this.visibleOptions.slice(0, index), function(option) {
          return _this11.isValidOption(option);
        }) : -1;
        return matchedOptionIndex > -1 ? matchedOptionIndex : index;
      },
      findSelectedOptionIndex: function findSelectedOptionIndex() {
        var _this12 = this;
        return this.hasSelectedOption ? this.visibleOptions.findIndex(function(option) {
          return _this12.isValidSelectedOption(option);
        }) : -1;
      },
      findFirstFocusedOptionIndex: function findFirstFocusedOptionIndex() {
        var selectedIndex = this.findSelectedOptionIndex();
        return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
      },
      findLastFocusedOptionIndex: function findLastFocusedOptionIndex() {
        var selectedIndex = this.findSelectedOptionIndex();
        return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
      },
      search: function search(event, query, source) {
        if (query === void 0 || query === null) {
          return;
        }
        if (source === "input" && query.trim().length === 0) {
          return;
        }
        this.searching = true;
        this.$emit("complete", {
          originalEvent: event,
          query
        });
      },
      removeOption: function removeOption(event, index) {
        var _this13 = this;
        var removedOption = this.modelValue[index];
        var value = this.modelValue.filter(function(_, i) {
          return i !== index;
        }).map(function(option) {
          return _this13.getOptionValue(option);
        });
        this.updateModel(event, value);
        this.$emit("item-unselect", {
          originalEvent: event,
          value: removedOption
        });
        this.dirty = true;
        DomHandler.focus(this.$refs.focusInput);
      },
      changeFocusedOptionIndex: function changeFocusedOptionIndex(event, index) {
        if (this.focusedOptionIndex !== index) {
          this.focusedOptionIndex = index;
          this.scrollInView();
          if (this.selectOnFocus || this.autoHighlight) {
            this.onOptionSelect(event, this.visibleOptions[index], false);
          }
        }
      },
      scrollInView: function scrollInView() {
        var _this14 = this;
        var index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : -1;
        var id = index !== -1 ? "".concat(this.id, "_").concat(index) : this.focusedOptionId;
        var element = DomHandler.findSingle(this.list, 'li[id="'.concat(id, '"]'));
        if (element) {
          element.scrollIntoView && element.scrollIntoView({
            block: "nearest",
            inline: "start"
          });
        } else if (!this.virtualScrollerDisabled) {
          setTimeout(function() {
            _this14.virtualScroller && _this14.virtualScroller.scrollToIndex(index !== -1 ? index : _this14.focusedOptionIndex);
          }, 0);
        }
      },
      autoUpdateModel: function autoUpdateModel() {
        if ((this.selectOnFocus || this.autoHighlight) && this.autoOptionFocus && !this.hasSelectedOption) {
          this.focusedOptionIndex = this.findFirstFocusedOptionIndex();
          this.onOptionSelect(null, this.visibleOptions[this.focusedOptionIndex], false);
        }
      },
      updateModel: function updateModel(event, value) {
        this.$emit("update:modelValue", value);
        this.$emit("change", {
          originalEvent: event,
          value
        });
      },
      flatOptions: function flatOptions(options) {
        var _this15 = this;
        return (options || []).reduce(function(result, option, index) {
          result.push({
            optionGroup: option,
            group: true,
            index
          });
          var optionGroupChildren = _this15.getOptionGroupChildren(option);
          optionGroupChildren && optionGroupChildren.forEach(function(o) {
            return result.push(o);
          });
          return result;
        }, []);
      },
      overlayRef: function overlayRef(el) {
        this.overlay = el;
      },
      listRef: function listRef(el, contentRef) {
        this.list = el;
        contentRef && contentRef(el);
      },
      virtualScrollerRef: function virtualScrollerRef(el) {
        this.virtualScroller = el;
      }
    },
    computed: {
      visibleOptions: function visibleOptions() {
        return this.optionGroupLabel ? this.flatOptions(this.suggestions) : this.suggestions || [];
      },
      inputValue: function inputValue() {
        if (ObjectUtils.isNotEmpty(this.modelValue)) {
          if (_typeof$1$1(this.modelValue) === "object") {
            var label = this.getOptionLabel(this.modelValue);
            return label != null ? label : this.modelValue;
          } else {
            return this.modelValue;
          }
        } else {
          return "";
        }
      },
      hasSelectedOption: function hasSelectedOption() {
        return ObjectUtils.isNotEmpty(this.modelValue);
      },
      equalityKey: function equalityKey() {
        return this.dataKey;
      },
      searchResultMessageText: function searchResultMessageText() {
        return ObjectUtils.isNotEmpty(this.visibleOptions) && this.overlayVisible ? this.searchMessageText.replaceAll("{0}", this.visibleOptions.length) : this.emptySearchMessageText;
      },
      searchMessageText: function searchMessageText() {
        return this.searchMessage || this.$primevue.config.locale.searchMessage || "";
      },
      emptySearchMessageText: function emptySearchMessageText() {
        return this.emptySearchMessage || this.$primevue.config.locale.emptySearchMessage || "";
      },
      selectionMessageText: function selectionMessageText() {
        return this.selectionMessage || this.$primevue.config.locale.selectionMessage || "";
      },
      emptySelectionMessageText: function emptySelectionMessageText() {
        return this.emptySelectionMessage || this.$primevue.config.locale.emptySelectionMessage || "";
      },
      selectedMessageText: function selectedMessageText() {
        return this.hasSelectedOption ? this.selectionMessageText.replaceAll("{0}", this.multiple ? this.modelValue.length : "1") : this.emptySelectionMessageText;
      },
      focusedOptionId: function focusedOptionId() {
        return this.focusedOptionIndex !== -1 ? "".concat(this.id, "_").concat(this.focusedOptionIndex) : null;
      },
      focusedMultipleOptionId: function focusedMultipleOptionId() {
        return this.focusedMultipleOptionIndex !== -1 ? "".concat(this.id, "_multiple_option_").concat(this.focusedMultipleOptionIndex) : null;
      },
      ariaSetSize: function ariaSetSize() {
        var _this16 = this;
        return this.visibleOptions.filter(function(option) {
          return !_this16.isOptionGroup(option);
        }).length;
      },
      virtualScrollerDisabled: function virtualScrollerDisabled() {
        return !this.virtualScrollerOptions;
      }
    },
    components: {
      Button: script$7,
      VirtualScroller: script$3,
      Portal: script$4,
      ChevronDownIcon: script$6,
      SpinnerIcon: script$8,
      TimesCircleIcon: script$5
    },
    directives: {
      ripple: Ripple
    }
  };
  function _typeof$2(o) {
    "@babel/helpers - typeof";
    return _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof$2(o);
  }
  function ownKeys$2(e, r2) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r2 && (o = o.filter(function(r3) {
        return Object.getOwnPropertyDescriptor(e, r3).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread$2(e) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys$2(Object(t), true).forEach(function(r3) {
        _defineProperty$2(e, r3, t[r3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function(r3) {
        Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
      });
    }
    return e;
  }
  function _defineProperty$2(obj, key, value) {
    key = _toPropertyKey$2(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey$2(t) {
    var i = _toPrimitive$2(t, "string");
    return "symbol" == _typeof$2(i) ? i : String(i);
  }
  function _toPrimitive$2(t, r2) {
    if ("object" != _typeof$2(t) || !t)
      return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r2 || "default");
      if ("object" != _typeof$2(i))
        return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t);
  }
  var _hoisted_1$1 = ["id", "value", "placeholder", "tabindex", "disabled", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant"];
  var _hoisted_2$1 = ["aria-activedescendant"];
  var _hoisted_3 = ["id", "aria-label", "aria-setsize", "aria-posinset"];
  var _hoisted_4 = ["id", "placeholder", "tabindex", "disabled", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant"];
  var _hoisted_5 = ["id"];
  var _hoisted_6 = ["id"];
  var _hoisted_7 = ["id", "aria-label", "aria-selected", "aria-disabled", "aria-setsize", "aria-posinset", "onClick", "onMousemove", "data-p-highlight", "data-p-focus", "data-p-disabled"];
  function render$1(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_SpinnerIcon = resolveComponent("SpinnerIcon");
    var _component_Button = resolveComponent("Button");
    var _component_VirtualScroller = resolveComponent("VirtualScroller");
    var _component_Portal = resolveComponent("Portal");
    var _directive_ripple = resolveDirective("ripple");
    return openBlock(), createElementBlock("div", mergeProps({
      ref: "container",
      "class": _ctx.cx("root"),
      style: _ctx.sx("root"),
      onClick: _cache[15] || (_cache[15] = function() {
        return $options.onContainerClick && $options.onContainerClick.apply($options, arguments);
      })
    }, _ctx.ptm("root"), {
      "data-pc-name": "autocomplete"
    }), [!_ctx.multiple ? (openBlock(), createElementBlock("input", mergeProps({
      key: 0,
      ref: "focusInput",
      id: _ctx.inputId,
      type: "text",
      "class": [_ctx.cx("input"), _ctx.inputClass],
      style: _ctx.inputStyle,
      value: $options.inputValue,
      placeholder: _ctx.placeholder,
      tabindex: !_ctx.disabled ? _ctx.tabindex : -1,
      disabled: _ctx.disabled,
      autocomplete: "off",
      role: "combobox",
      "aria-label": _ctx.ariaLabel,
      "aria-labelledby": _ctx.ariaLabelledby,
      "aria-haspopup": "listbox",
      "aria-autocomplete": "list",
      "aria-expanded": $data.overlayVisible,
      "aria-controls": $data.id + "_list",
      "aria-activedescendant": $data.focused ? $options.focusedOptionId : void 0,
      onFocus: _cache[0] || (_cache[0] = function() {
        return $options.onFocus && $options.onFocus.apply($options, arguments);
      }),
      onBlur: _cache[1] || (_cache[1] = function() {
        return $options.onBlur && $options.onBlur.apply($options, arguments);
      }),
      onKeydown: _cache[2] || (_cache[2] = function() {
        return $options.onKeyDown && $options.onKeyDown.apply($options, arguments);
      }),
      onInput: _cache[3] || (_cache[3] = function() {
        return $options.onInput && $options.onInput.apply($options, arguments);
      }),
      onChange: _cache[4] || (_cache[4] = function() {
        return $options.onChange && $options.onChange.apply($options, arguments);
      })
    }, _objectSpread$2(_objectSpread$2({}, _ctx.inputProps), _ctx.ptm("input"))), null, 16, _hoisted_1$1)) : createCommentVNode("", true), _ctx.multiple ? (openBlock(), createElementBlock("ul", mergeProps({
      key: 1,
      ref: "multiContainer",
      "class": _ctx.cx("container"),
      tabindex: "-1",
      role: "listbox",
      "aria-orientation": "horizontal",
      "aria-activedescendant": $data.focused ? $options.focusedMultipleOptionId : void 0,
      onFocus: _cache[10] || (_cache[10] = function() {
        return $options.onMultipleContainerFocus && $options.onMultipleContainerFocus.apply($options, arguments);
      }),
      onBlur: _cache[11] || (_cache[11] = function() {
        return $options.onMultipleContainerBlur && $options.onMultipleContainerBlur.apply($options, arguments);
      }),
      onKeydown: _cache[12] || (_cache[12] = function() {
        return $options.onMultipleContainerKeyDown && $options.onMultipleContainerKeyDown.apply($options, arguments);
      })
    }, _ctx.ptm("container")), [(openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.modelValue, function(option, i) {
      return openBlock(), createElementBlock("li", mergeProps({
        key: i,
        id: $data.id + "_multiple_option_" + i,
        "class": _ctx.cx("token", {
          i
        }),
        role: "option",
        "aria-label": $options.getOptionLabel(option),
        "aria-selected": true,
        "aria-setsize": _ctx.modelValue.length,
        "aria-posinset": i + 1
      }, _ctx.ptm("token")), [renderSlot(_ctx.$slots, "chip", {
        value: option
      }, function() {
        return [createBaseVNode("span", mergeProps({
          "class": _ctx.cx("tokenLabel")
        }, _ctx.ptm("tokenLabel")), toDisplayString($options.getOptionLabel(option)), 17)];
      }), renderSlot(_ctx.$slots, "removetokenicon", {
        "class": normalizeClass(_ctx.cx("removeTokenIcon")),
        index: i,
        onClick: function onClick(event) {
          return $options.removeOption(event, i);
        },
        removeCallback: function removeCallback(event) {
          return $options.removeOption(event, i);
        }
      }, function() {
        return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.removeTokenIcon ? "span" : "TimesCircleIcon"), mergeProps({
          "class": [_ctx.cx("removeTokenIcon"), _ctx.removeTokenIcon],
          onClick: function onClick($event) {
            return $options.removeOption($event, i);
          },
          "aria-hidden": "true"
        }, _ctx.ptm("removeTokenIcon")), null, 16, ["class", "onClick"]))];
      })], 16, _hoisted_3);
    }), 128)), createBaseVNode("li", mergeProps({
      "class": _ctx.cx("inputToken"),
      role: "option"
    }, _ctx.ptm("inputToken")), [createBaseVNode("input", mergeProps({
      ref: "focusInput",
      id: _ctx.inputId,
      type: "text",
      style: _ctx.inputStyle,
      "class": _ctx.inputClass,
      placeholder: _ctx.placeholder,
      tabindex: !_ctx.disabled ? _ctx.tabindex : -1,
      disabled: _ctx.disabled,
      autocomplete: "off",
      role: "combobox",
      "aria-label": _ctx.ariaLabel,
      "aria-labelledby": _ctx.ariaLabelledby,
      "aria-haspopup": "listbox",
      "aria-autocomplete": "list",
      "aria-expanded": $data.overlayVisible,
      "aria-controls": $data.id + "_list",
      "aria-activedescendant": $data.focused ? $options.focusedOptionId : void 0,
      onFocus: _cache[5] || (_cache[5] = function() {
        return $options.onFocus && $options.onFocus.apply($options, arguments);
      }),
      onBlur: _cache[6] || (_cache[6] = function() {
        return $options.onBlur && $options.onBlur.apply($options, arguments);
      }),
      onKeydown: _cache[7] || (_cache[7] = function() {
        return $options.onKeyDown && $options.onKeyDown.apply($options, arguments);
      }),
      onInput: _cache[8] || (_cache[8] = function() {
        return $options.onInput && $options.onInput.apply($options, arguments);
      }),
      onChange: _cache[9] || (_cache[9] = function() {
        return $options.onChange && $options.onChange.apply($options, arguments);
      })
    }, _objectSpread$2(_objectSpread$2({}, _ctx.inputProps), _ctx.ptm("input"))), null, 16, _hoisted_4)], 16)], 16, _hoisted_2$1)) : createCommentVNode("", true), $data.searching || _ctx.loading ? renderSlot(_ctx.$slots, "loadingicon", {
      key: 2,
      "class": normalizeClass(_ctx.cx("loadingIcon"))
    }, function() {
      return [_ctx.loadingIcon ? (openBlock(), createElementBlock("i", mergeProps({
        key: 0,
        "class": ["pi-spin", _ctx.cx("loadingIcon"), _ctx.loadingIcon],
        "aria-hidden": "true"
      }, _ctx.ptm("loadingIcon")), null, 16)) : (openBlock(), createBlock(_component_SpinnerIcon, mergeProps({
        key: 1,
        "class": [_ctx.cx("loadingIcon"), _ctx.loadingIcon],
        spin: "",
        "aria-hidden": "true"
      }, _ctx.ptm("loadingIcon")), null, 16, ["class"]))];
    }) : createCommentVNode("", true), _ctx.dropdown ? (openBlock(), createBlock(_component_Button, {
      key: 3,
      ref: "dropdownButton",
      type: "button",
      tabindex: "-1",
      "class": normalizeClass([_ctx.cx("dropdownButton"), _ctx.dropdownClass]),
      disabled: _ctx.disabled,
      "aria-hidden": "true",
      onClick: $options.onDropdownClick,
      unstyled: _ctx.unstyled,
      pt: _ctx.ptm("dropdownButton"),
      "data-pc-section": "dropdownbutton"
    }, {
      icon: withCtx(function() {
        return [renderSlot(_ctx.$slots, "dropdownicon", {
          "class": normalizeClass(_ctx.dropdownIcon)
        }, function() {
          return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.dropdownIcon ? "span" : "ChevronDownIcon"), mergeProps({
            "class": _ctx.dropdownIcon
          }, _ctx.ptm("dropdownButton")["icon"], {
            "data-pc-section": "dropdownicon"
          }), null, 16, ["class"]))];
        })];
      }),
      _: 3
    }, 8, ["class", "disabled", "onClick", "unstyled", "pt"])) : createCommentVNode("", true), createBaseVNode("span", mergeProps({
      role: "status",
      "aria-live": "polite",
      "class": "p-hidden-accessible"
    }, _ctx.ptm("hiddenSearchResult"), {
      "data-p-hidden-accessible": true
    }), toDisplayString($options.searchResultMessageText), 17), createVNode(_component_Portal, {
      appendTo: _ctx.appendTo
    }, {
      "default": withCtx(function() {
        return [createVNode(Transition, mergeProps({
          name: "p-connected-overlay",
          onEnter: $options.onOverlayEnter,
          onAfterEnter: $options.onOverlayAfterEnter,
          onLeave: $options.onOverlayLeave,
          onAfterLeave: $options.onOverlayAfterLeave
        }, _ctx.ptm("transition")), {
          "default": withCtx(function() {
            return [$data.overlayVisible ? (openBlock(), createElementBlock("div", mergeProps({
              key: 0,
              ref: $options.overlayRef,
              "class": [_ctx.cx("panel"), _ctx.panelClass],
              style: _objectSpread$2(_objectSpread$2({}, _ctx.panelStyle), {}, {
                "max-height": $options.virtualScrollerDisabled ? _ctx.scrollHeight : ""
              }),
              onClick: _cache[13] || (_cache[13] = function() {
                return $options.onOverlayClick && $options.onOverlayClick.apply($options, arguments);
              }),
              onKeydown: _cache[14] || (_cache[14] = function() {
                return $options.onOverlayKeyDown && $options.onOverlayKeyDown.apply($options, arguments);
              })
            }, _objectSpread$2(_objectSpread$2({}, _ctx.panelProps), _ctx.ptm("panel"))), [renderSlot(_ctx.$slots, "header", {
              value: _ctx.modelValue,
              suggestions: $options.visibleOptions
            }), createVNode(_component_VirtualScroller, mergeProps({
              ref: $options.virtualScrollerRef
            }, _ctx.virtualScrollerOptions, {
              style: {
                height: _ctx.scrollHeight
              },
              items: $options.visibleOptions,
              tabindex: -1,
              disabled: $options.virtualScrollerDisabled,
              pt: _ctx.ptm("virtualScroller")
            }), createSlots({
              content: withCtx(function(_ref) {
                var styleClass = _ref.styleClass, contentRef = _ref.contentRef, items = _ref.items, getItemOptions = _ref.getItemOptions, contentStyle = _ref.contentStyle, itemSize = _ref.itemSize;
                return [createBaseVNode("ul", mergeProps({
                  ref: function ref2(el) {
                    return $options.listRef(el, contentRef);
                  },
                  id: $data.id + "_list",
                  "class": [_ctx.cx("list"), styleClass],
                  style: contentStyle,
                  role: "listbox"
                }, _ctx.ptm("list")), [(openBlock(true), createElementBlock(Fragment, null, renderList(items, function(option, i) {
                  return openBlock(), createElementBlock(Fragment, {
                    key: $options.getOptionRenderKey(option, $options.getOptionIndex(i, getItemOptions))
                  }, [$options.isOptionGroup(option) ? (openBlock(), createElementBlock("li", mergeProps({
                    key: 0,
                    id: $data.id + "_" + $options.getOptionIndex(i, getItemOptions),
                    style: {
                      height: itemSize ? itemSize + "px" : void 0
                    },
                    "class": _ctx.cx("itemGroup"),
                    role: "option"
                  }, _ctx.ptm("itemGroup")), [renderSlot(_ctx.$slots, "optiongroup", {
                    option: option.optionGroup,
                    item: option.optionGroup,
                    index: $options.getOptionIndex(i, getItemOptions)
                  }, function() {
                    return [createTextVNode(toDisplayString($options.getOptionGroupLabel(option.optionGroup)), 1)];
                  })], 16, _hoisted_6)) : withDirectives((openBlock(), createElementBlock("li", mergeProps({
                    key: 1,
                    id: $data.id + "_" + $options.getOptionIndex(i, getItemOptions),
                    style: {
                      height: itemSize ? itemSize + "px" : void 0
                    },
                    "class": _ctx.cx("item", {
                      option,
                      i,
                      getItemOptions
                    }),
                    role: "option",
                    "aria-label": $options.getOptionLabel(option),
                    "aria-selected": $options.isSelected(option),
                    "aria-disabled": $options.isOptionDisabled(option),
                    "aria-setsize": $options.ariaSetSize,
                    "aria-posinset": $options.getAriaPosInset($options.getOptionIndex(i, getItemOptions)),
                    onClick: function onClick($event) {
                      return $options.onOptionSelect($event, option);
                    },
                    onMousemove: function onMousemove($event) {
                      return $options.onOptionMouseMove($event, $options.getOptionIndex(i, getItemOptions));
                    },
                    "data-p-highlight": $options.isSelected(option),
                    "data-p-focus": $data.focusedOptionIndex === $options.getOptionIndex(i, getItemOptions),
                    "data-p-disabled": $options.isOptionDisabled(option)
                  }, $options.getPTOptions(option, getItemOptions, i, "item")), [_ctx.$slots.option ? renderSlot(_ctx.$slots, "option", {
                    key: 0,
                    option,
                    index: $options.getOptionIndex(i, getItemOptions)
                  }, function() {
                    return [createTextVNode(toDisplayString($options.getOptionLabel(option)), 1)];
                  }) : renderSlot(_ctx.$slots, "item", {
                    key: 1,
                    item: option,
                    index: $options.getOptionIndex(i, getItemOptions)
                  }, function() {
                    return [createTextVNode(toDisplayString($options.getOptionLabel(option)), 1)];
                  })], 16, _hoisted_7)), [[_directive_ripple]])], 64);
                }), 128)), !items || items && items.length === 0 ? (openBlock(), createElementBlock("li", mergeProps({
                  key: 0,
                  "class": _ctx.cx("emptyMessage"),
                  role: "option"
                }, _ctx.ptm("emptyMessage")), [renderSlot(_ctx.$slots, "empty", {}, function() {
                  return [createTextVNode(toDisplayString($options.searchResultMessageText), 1)];
                })], 16)) : createCommentVNode("", true)], 16, _hoisted_5)];
              }),
              _: 2
            }, [_ctx.$slots.loader ? {
              name: "loader",
              fn: withCtx(function(_ref2) {
                var options = _ref2.options;
                return [renderSlot(_ctx.$slots, "loader", {
                  options
                })];
              }),
              key: "0"
            } : void 0]), 1040, ["style", "items", "disabled", "pt"]), renderSlot(_ctx.$slots, "footer", {
              value: _ctx.modelValue,
              suggestions: $options.visibleOptions
            }), createBaseVNode("span", mergeProps({
              role: "status",
              "aria-live": "polite",
              "class": "p-hidden-accessible"
            }, _ctx.ptm("hiddenSelectedMessage"), {
              "data-p-hidden-accessible": true
            }), toDisplayString($options.selectedMessageText), 17)], 16)) : createCommentVNode("", true)];
          }),
          _: 3
        }, 16, ["onEnter", "onAfterEnter", "onLeave", "onAfterLeave"])];
      }),
      _: 3
    }, 8, ["appendTo"])], 16);
  }
  script$2.render = render$1;
  var classes = {
    root: function root(_ref) {
      var instance = _ref.instance, props = _ref.props;
      return ["p-radiobutton p-component", {
        "p-radiobutton-checked": instance.checked,
        "p-radiobutton-disabled": props.disabled,
        "p-radiobutton-focused": instance.focused
      }];
    },
    input: function input(_ref2) {
      var instance = _ref2.instance, props = _ref2.props;
      return ["p-radiobutton-box", {
        "p-highlight": instance.checked,
        "p-disabled": props.disabled,
        "p-focus": instance.focused
      }];
    },
    icon: "p-radiobutton-icon"
  };
  var RadioButtonStyle = BaseStyle.extend({
    name: "radiobutton",
    classes
  });
  var script$1 = {
    name: "BaseRadioButton",
    "extends": script$f,
    props: {
      value: null,
      modelValue: null,
      name: {
        type: String,
        "default": null
      },
      disabled: {
        type: Boolean,
        "default": false
      },
      inputId: {
        type: String,
        "default": null
      },
      inputClass: {
        type: [String, Object],
        "default": null
      },
      inputStyle: {
        type: Object,
        "default": null
      },
      inputProps: {
        type: null,
        "default": null
      },
      ariaLabelledby: {
        type: String,
        "default": null
      },
      ariaLabel: {
        type: String,
        "default": null
      }
    },
    style: RadioButtonStyle,
    provide: function provide2() {
      return {
        $parentInstance: this
      };
    }
  };
  var script = {
    name: "RadioButton",
    "extends": script$1,
    emits: ["click", "update:modelValue", "change", "focus", "blur"],
    data: function data() {
      return {
        focused: false
      };
    },
    methods: {
      onClick: function onClick(event) {
        if (!this.disabled) {
          this.$emit("click", event);
          this.$emit("update:modelValue", this.value);
          this.$refs.input.focus();
          if (!this.checked) {
            this.$emit("change", event);
          }
        }
      },
      onFocus: function onFocus(event) {
        this.focused = true;
        this.$emit("focus", event);
      },
      onBlur: function onBlur(event) {
        this.focused = false;
        this.$emit("blur", event);
      }
    },
    computed: {
      checked: function checked() {
        return this.modelValue != null && ObjectUtils.equals(this.modelValue, this.value);
      }
    }
  };
  function _typeof$1(o) {
    "@babel/helpers - typeof";
    return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof$1(o);
  }
  function ownKeys$1(e, r2) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r2 && (o = o.filter(function(r3) {
        return Object.getOwnPropertyDescriptor(e, r3).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread$1(e) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys$1(Object(t), true).forEach(function(r3) {
        _defineProperty$1(e, r3, t[r3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r3) {
        Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
      });
    }
    return e;
  }
  function _defineProperty$1(obj, key, value) {
    key = _toPropertyKey$1(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey$1(t) {
    var i = _toPrimitive$1(t, "string");
    return "symbol" == _typeof$1(i) ? i : String(i);
  }
  function _toPrimitive$1(t, r2) {
    if ("object" != _typeof$1(t) || !t)
      return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r2 || "default");
      if ("object" != _typeof$1(i))
        return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t);
  }
  var _hoisted_1 = ["id", "name", "checked", "disabled", "value", "aria-labelledby", "aria-label"];
  var _hoisted_2 = ["data-p-highlight", "data-p-disabled", "data-p-focused"];
  function render(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", mergeProps({
      "class": _ctx.cx("root"),
      onClick: _cache[2] || (_cache[2] = function($event) {
        return $options.onClick($event);
      })
    }, _ctx.ptm("root"), {
      "data-pc-name": "radiobutton"
    }), [createBaseVNode("div", mergeProps({
      "class": "p-hidden-accessible"
    }, _ctx.ptm("hiddenInputWrapper"), {
      "data-p-hidden-accessible": true
    }), [createBaseVNode("input", mergeProps({
      ref: "input",
      id: _ctx.inputId,
      type: "radio",
      name: _ctx.name,
      checked: $options.checked,
      disabled: _ctx.disabled,
      value: _ctx.value,
      "aria-labelledby": _ctx.ariaLabelledby,
      "aria-label": _ctx.ariaLabel,
      onFocus: _cache[0] || (_cache[0] = function() {
        return $options.onFocus && $options.onFocus.apply($options, arguments);
      }),
      onBlur: _cache[1] || (_cache[1] = function() {
        return $options.onBlur && $options.onBlur.apply($options, arguments);
      })
    }, _ctx.ptm("hiddenInput")), null, 16, _hoisted_1)], 16), createBaseVNode("div", mergeProps({
      ref: "box",
      "class": [_ctx.cx("input"), _ctx.inputClass],
      style: _ctx.inputStyle
    }, _objectSpread$1(_objectSpread$1({}, _ctx.inputProps), _ctx.ptm("input")), {
      "data-p-highlight": $options.checked,
      "data-p-disabled": _ctx.disabled,
      "data-p-focused": $data.focused
    }), [createBaseVNode("div", mergeProps({
      "class": _ctx.cx("icon")
    }, _ctx.ptm("icon")), null, 16)], 16, _hoisted_2)], 16);
  }
  script.render = render;
  var FilterMatchMode = {
    STARTS_WITH: "startsWith",
    CONTAINS: "contains",
    NOT_CONTAINS: "notContains",
    ENDS_WITH: "endsWith",
    EQUALS: "equals",
    NOT_EQUALS: "notEquals",
    IN: "in",
    LESS_THAN: "lt",
    LESS_THAN_OR_EQUAL_TO: "lte",
    GREATER_THAN: "gt",
    GREATER_THAN_OR_EQUAL_TO: "gte",
    BETWEEN: "between",
    DATE_IS: "dateIs",
    DATE_IS_NOT: "dateIsNot",
    DATE_BEFORE: "dateBefore",
    DATE_AFTER: "dateAfter"
  };
  function _typeof(o) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof(o);
  }
  function ownKeys(e, r2) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r2 && (o = o.filter(function(r3) {
        return Object.getOwnPropertyDescriptor(e, r3).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread(e) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys(Object(t), true).forEach(function(r3) {
        _defineProperty(e, r3, t[r3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r3) {
        Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
      });
    }
    return e;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == _typeof(i) ? i : String(i);
  }
  function _toPrimitive(t, r2) {
    if ("object" != _typeof(t) || !t)
      return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r2 || "default");
      if ("object" != _typeof(i))
        return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t);
  }
  var defaultOptions = {
    ripple: false,
    inputStyle: "outlined",
    locale: {
      startsWith: "Starts with",
      contains: "Contains",
      notContains: "Not contains",
      endsWith: "Ends with",
      equals: "Equals",
      notEquals: "Not equals",
      noFilter: "No Filter",
      lt: "Less than",
      lte: "Less than or equal to",
      gt: "Greater than",
      gte: "Greater than or equal to",
      dateIs: "Date is",
      dateIsNot: "Date is not",
      dateBefore: "Date is before",
      dateAfter: "Date is after",
      clear: "Clear",
      apply: "Apply",
      matchAll: "Match All",
      matchAny: "Match Any",
      addRule: "Add Rule",
      removeRule: "Remove Rule",
      accept: "Yes",
      reject: "No",
      choose: "Choose",
      upload: "Upload",
      cancel: "Cancel",
      completed: "Completed",
      pending: "Pending",
      fileSizeTypes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      chooseYear: "Choose Year",
      chooseMonth: "Choose Month",
      chooseDate: "Choose Date",
      prevDecade: "Previous Decade",
      nextDecade: "Next Decade",
      prevYear: "Previous Year",
      nextYear: "Next Year",
      prevMonth: "Previous Month",
      nextMonth: "Next Month",
      prevHour: "Previous Hour",
      nextHour: "Next Hour",
      prevMinute: "Previous Minute",
      nextMinute: "Next Minute",
      prevSecond: "Previous Second",
      nextSecond: "Next Second",
      am: "am",
      pm: "pm",
      today: "Today",
      weekHeader: "Wk",
      firstDayOfWeek: 0,
      showMonthAfterYear: false,
      dateFormat: "mm/dd/yy",
      weak: "Weak",
      medium: "Medium",
      strong: "Strong",
      passwordPrompt: "Enter a password",
      emptyFilterMessage: "No results found",
      // @deprecated Use 'emptySearchMessage' option instead.
      searchMessage: "{0} results are available",
      selectionMessage: "{0} items selected",
      emptySelectionMessage: "No selected item",
      emptySearchMessage: "No results found",
      emptyMessage: "No available options",
      aria: {
        trueLabel: "True",
        falseLabel: "False",
        nullLabel: "Not Selected",
        star: "1 star",
        stars: "{star} stars",
        selectAll: "All items selected",
        unselectAll: "All items unselected",
        close: "Close",
        previous: "Previous",
        next: "Next",
        navigation: "Navigation",
        scrollTop: "Scroll Top",
        moveTop: "Move Top",
        moveUp: "Move Up",
        moveDown: "Move Down",
        moveBottom: "Move Bottom",
        moveToTarget: "Move to Target",
        moveToSource: "Move to Source",
        moveAllToTarget: "Move All to Target",
        moveAllToSource: "Move All to Source",
        pageLabel: "Page {page}",
        firstPageLabel: "First Page",
        lastPageLabel: "Last Page",
        nextPageLabel: "Next Page",
        prevPageLabel: "Previous Page",
        rowsPerPageLabel: "Rows per page",
        jumpToPageDropdownLabel: "Jump to Page Dropdown",
        jumpToPageInputLabel: "Jump to Page Input",
        selectRow: "Row Selected",
        unselectRow: "Row Unselected",
        expandRow: "Row Expanded",
        collapseRow: "Row Collapsed",
        showFilterMenu: "Show Filter Menu",
        hideFilterMenu: "Hide Filter Menu",
        filterOperator: "Filter Operator",
        filterConstraint: "Filter Constraint",
        editRow: "Row Edit",
        saveEdit: "Save Edit",
        cancelEdit: "Cancel Edit",
        listView: "List View",
        gridView: "Grid View",
        slide: "Slide",
        slideNumber: "{slideNumber}",
        zoomImage: "Zoom Image",
        zoomIn: "Zoom In",
        zoomOut: "Zoom Out",
        rotateRight: "Rotate Right",
        rotateLeft: "Rotate Left"
      }
    },
    filterMatchModeOptions: {
      text: [FilterMatchMode.STARTS_WITH, FilterMatchMode.CONTAINS, FilterMatchMode.NOT_CONTAINS, FilterMatchMode.ENDS_WITH, FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS],
      numeric: [FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS, FilterMatchMode.LESS_THAN, FilterMatchMode.LESS_THAN_OR_EQUAL_TO, FilterMatchMode.GREATER_THAN, FilterMatchMode.GREATER_THAN_OR_EQUAL_TO],
      date: [FilterMatchMode.DATE_IS, FilterMatchMode.DATE_IS_NOT, FilterMatchMode.DATE_BEFORE, FilterMatchMode.DATE_AFTER]
    },
    zIndex: {
      modal: 1100,
      overlay: 1e3,
      menu: 1e3,
      tooltip: 1100
    },
    pt: void 0,
    ptOptions: {
      mergeSections: true,
      mergeProps: false
    },
    unstyled: false,
    csp: {
      nonce: void 0
    }
  };
  var PrimeVueSymbol = Symbol();
  function switchTheme(currentTheme, newTheme, linkElementId, callback) {
    if (currentTheme !== newTheme) {
      var linkElement = document.getElementById(linkElementId);
      var cloneLinkElement = linkElement.cloneNode(true);
      var newThemeUrl = linkElement.getAttribute("href").replace(currentTheme, newTheme);
      cloneLinkElement.setAttribute("id", linkElementId + "-clone");
      cloneLinkElement.setAttribute("href", newThemeUrl);
      cloneLinkElement.addEventListener("load", function() {
        linkElement.remove();
        cloneLinkElement.setAttribute("id", linkElementId);
        if (callback) {
          callback();
        }
      });
      linkElement.parentNode && linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
    }
  }
  var PrimeVue = {
    install: function install(app2, options) {
      var configOptions = options ? _objectSpread(_objectSpread({}, defaultOptions), options) : _objectSpread({}, defaultOptions);
      var PrimeVue2 = {
        config: reactive(configOptions),
        changeTheme: switchTheme
      };
      app2.config.globalProperties.$primevue = PrimeVue2;
      app2.provide(PrimeVueSymbol, PrimeVue2);
    }
  };
  const pinia = createPinia();
  const app = createApp(Checkout);
  app.use(pinia);
  app.use(PrimeVue);
  app.component("Skeleton", script$e);
  app.component("InputText", script$d);
  app.component("InputMask", script$c);
  app.component("SelectButton", script$b);
  app.component("AutoComplete", script$2);
  app.component("RadioButton", script);
  app.use(
    createYmaps({
      apikey: "371adf45-5b12-41ab-ab00-b5144c633c34"
    })
  );
  app.use(VueReCaptcha, {
    siteKey: "6LeQmycpAAAAAAmbBlU3kWBsKLT4d0A6ueka4XDw"
  });
  app.use(dt, {
    autoClose: 3e3
  });
  app.mount("#checkout");
  setLocale({
    string: {
      email: "Неверный формат email",
      min: ({ min }) => `Минимум ${min}`,
      length: ({ length }) => `Минимум ${length}`,
      max: ({ max }) => `Максимум ${max}`
    },
    mixed: {
      default: "Заполните поле корректно",
      required: "Поле обязательно"
    },
    tuple: {
      notType: "Неверный формат"
    }
  });
});
