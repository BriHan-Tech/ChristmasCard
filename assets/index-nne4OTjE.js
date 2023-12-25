var Se = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports)
var Ce = Se((exports, module) => {
  ;(function () {
    const t = document.createElement('link').relList
    if (t && t.supports && t.supports('modulepreload')) return
    for (const n of document.querySelectorAll('link[rel="modulepreload"]')) i(n)
    new MutationObserver((n) => {
      for (const s of n)
        if (s.type === 'childList')
          for (const a of s.addedNodes) a.tagName === 'LINK' && a.rel === 'modulepreload' && i(a)
    }).observe(document, { childList: !0, subtree: !0 })
    function r(n) {
      const s = {}
      return (
        n.integrity && (s.integrity = n.integrity),
        n.referrerPolicy && (s.referrerPolicy = n.referrerPolicy),
        n.crossOrigin === 'use-credentials'
          ? (s.credentials = 'include')
          : n.crossOrigin === 'anonymous'
            ? (s.credentials = 'omit')
            : (s.credentials = 'same-origin'),
        s
      )
    }
    function i(n) {
      if (n.ep) return
      n.ep = !0
      const s = r(n)
      fetch(n.href, s)
    }
  })()
  function makeMap(e, t) {
    const r = Object.create(null),
      i = e.split(',')
    for (let n = 0; n < i.length; n++) r[i[n]] = !0
    return t ? (n) => !!r[n.toLowerCase()] : (n) => !!r[n]
  }
  const EMPTY_OBJ = {},
    EMPTY_ARR = [],
    NOOP = () => {},
    NO = () => !1,
    isOn = (e) =>
      e.charCodeAt(0) === 111 &&
      e.charCodeAt(1) === 110 &&
      (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
    isModelListener = (e) => e.startsWith('onUpdate:'),
    extend = Object.assign,
    remove = (e, t) => {
      const r = e.indexOf(t)
      r > -1 && e.splice(r, 1)
    },
    hasOwnProperty$d = Object.prototype.hasOwnProperty,
    hasOwn = (e, t) => hasOwnProperty$d.call(e, t),
    isArray$2 = Array.isArray,
    isMap$2 = (e) => toTypeString(e) === '[object Map]',
    isSet$2 = (e) => toTypeString(e) === '[object Set]',
    isFunction$1 = (e) => typeof e == 'function',
    isString = (e) => typeof e == 'string',
    isSymbol = (e) => typeof e == 'symbol',
    isObject$2 = (e) => e !== null && typeof e == 'object',
    isPromise = (e) =>
      (isObject$2(e) || isFunction$1(e)) && isFunction$1(e.then) && isFunction$1(e.catch),
    objectToString$1 = Object.prototype.toString,
    toTypeString = (e) => objectToString$1.call(e),
    toRawType = (e) => toTypeString(e).slice(8, -1),
    isPlainObject = (e) => toTypeString(e) === '[object Object]',
    isIntegerKey = (e) => isString(e) && e !== 'NaN' && e[0] !== '-' && '' + parseInt(e, 10) === e,
    isReservedProp = makeMap(
      ',key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted'
    ),
    cacheStringFunction = (e) => {
      const t = Object.create(null)
      return (r) => t[r] || (t[r] = e(r))
    },
    camelizeRE = /-(\w)/g,
    camelize = cacheStringFunction((e) =>
      e.replace(camelizeRE, (t, r) => (r ? r.toUpperCase() : ''))
    ),
    hyphenateRE = /\B([A-Z])/g,
    hyphenate = cacheStringFunction((e) => e.replace(hyphenateRE, '-$1').toLowerCase()),
    capitalize = cacheStringFunction((e) => e.charAt(0).toUpperCase() + e.slice(1)),
    toHandlerKey = cacheStringFunction((e) => (e ? `on${capitalize(e)}` : '')),
    hasChanged = (e, t) => !Object.is(e, t),
    invokeArrayFns = (e, t) => {
      for (let r = 0; r < e.length; r++) e[r](t)
    },
    def = (e, t, r) => {
      Object.defineProperty(e, t, { configurable: !0, enumerable: !1, value: r })
    },
    looseToNumber = (e) => {
      const t = parseFloat(e)
      return isNaN(t) ? e : t
    }
  let _globalThis
  const getGlobalThis = () =>
    _globalThis ||
    (_globalThis =
      typeof globalThis < 'u'
        ? globalThis
        : typeof self < 'u'
          ? self
          : typeof window < 'u'
            ? window
            : typeof global < 'u'
              ? global
              : {})
  function normalizeStyle(e) {
    if (isArray$2(e)) {
      const t = {}
      for (let r = 0; r < e.length; r++) {
        const i = e[r],
          n = isString(i) ? parseStringStyle(i) : normalizeStyle(i)
        if (n) for (const s in n) t[s] = n[s]
      }
      return t
    } else if (isString(e) || isObject$2(e)) return e
  }
  const listDelimiterRE = /;(?![^(]*\))/g,
    propertyDelimiterRE = /:([^]+)/,
    styleCommentRE = /\/\*[^]*?\*\//g
  function parseStringStyle(e) {
    const t = {}
    return (
      e
        .replace(styleCommentRE, '')
        .split(listDelimiterRE)
        .forEach((r) => {
          if (r) {
            const i = r.split(propertyDelimiterRE)
            i.length > 1 && (t[i[0].trim()] = i[1].trim())
          }
        }),
      t
    )
  }
  function normalizeClass(e) {
    let t = ''
    if (isString(e)) t = e
    else if (isArray$2(e))
      for (let r = 0; r < e.length; r++) {
        const i = normalizeClass(e[r])
        i && (t += i + ' ')
      }
    else if (isObject$2(e)) for (const r in e) e[r] && (t += r + ' ')
    return t.trim()
  }
  const specialBooleanAttrs =
      'itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly',
    isSpecialBooleanAttr = makeMap(specialBooleanAttrs)
  function includeBooleanAttr(e) {
    return !!e || e === ''
  }
  const toDisplayString = (e) =>
      isString(e)
        ? e
        : e == null
          ? ''
          : isArray$2(e) ||
              (isObject$2(e) && (e.toString === objectToString$1 || !isFunction$1(e.toString)))
            ? JSON.stringify(e, replacer, 2)
            : String(e),
    replacer = (e, t) =>
      t && t.__v_isRef
        ? replacer(e, t.value)
        : isMap$2(t)
          ? {
              [`Map(${t.size})`]: [...t.entries()].reduce(
                (r, [i, n], s) => ((r[stringifySymbol(i, s) + ' =>'] = n), r),
                {}
              )
            }
          : isSet$2(t)
            ? { [`Set(${t.size})`]: [...t.values()].map((r) => stringifySymbol(r)) }
            : isSymbol(t)
              ? stringifySymbol(t)
              : isObject$2(t) && !isArray$2(t) && !isPlainObject(t)
                ? String(t)
                : t,
    stringifySymbol = (e, t = '') => {
      var r
      return isSymbol(e) ? `Symbol(${(r = e.description) != null ? r : t})` : e
    }
  let activeEffectScope
  class EffectScope {
    constructor(t = !1) {
      ;(this.detached = t),
        (this._active = !0),
        (this.effects = []),
        (this.cleanups = []),
        (this.parent = activeEffectScope),
        !t &&
          activeEffectScope &&
          (this.index =
            (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1)
    }
    get active() {
      return this._active
    }
    run(t) {
      if (this._active) {
        const r = activeEffectScope
        try {
          return (activeEffectScope = this), t()
        } finally {
          activeEffectScope = r
        }
      }
    }
    on() {
      activeEffectScope = this
    }
    off() {
      activeEffectScope = this.parent
    }
    stop(t) {
      if (this._active) {
        let r, i
        for (r = 0, i = this.effects.length; r < i; r++) this.effects[r].stop()
        for (r = 0, i = this.cleanups.length; r < i; r++) this.cleanups[r]()
        if (this.scopes) for (r = 0, i = this.scopes.length; r < i; r++) this.scopes[r].stop(!0)
        if (!this.detached && this.parent && !t) {
          const n = this.parent.scopes.pop()
          n && n !== this && ((this.parent.scopes[this.index] = n), (n.index = this.index))
        }
        ;(this.parent = void 0), (this._active = !1)
      }
    }
  }
  function recordEffectScope(e, t = activeEffectScope) {
    t && t.active && t.effects.push(e)
  }
  function getCurrentScope() {
    return activeEffectScope
  }
  function onScopeDispose(e) {
    activeEffectScope && activeEffectScope.cleanups.push(e)
  }
  const createDep = (e) => {
      const t = new Set(e)
      return (t.w = 0), (t.n = 0), t
    },
    wasTracked = (e) => (e.w & trackOpBit) > 0,
    newTracked = (e) => (e.n & trackOpBit) > 0,
    initDepMarkers = ({ deps: e }) => {
      if (e.length) for (let t = 0; t < e.length; t++) e[t].w |= trackOpBit
    },
    finalizeDepMarkers = (e) => {
      const { deps: t } = e
      if (t.length) {
        let r = 0
        for (let i = 0; i < t.length; i++) {
          const n = t[i]
          wasTracked(n) && !newTracked(n) ? n.delete(e) : (t[r++] = n),
            (n.w &= ~trackOpBit),
            (n.n &= ~trackOpBit)
        }
        t.length = r
      }
    },
    targetMap = new WeakMap()
  let effectTrackDepth = 0,
    trackOpBit = 1
  const maxMarkerBits = 30
  let activeEffect
  const ITERATE_KEY = Symbol(''),
    MAP_KEY_ITERATE_KEY = Symbol('')
  class ReactiveEffect {
    constructor(t, r = null, i) {
      ;(this.fn = t),
        (this.scheduler = r),
        (this.active = !0),
        (this.deps = []),
        (this.parent = void 0),
        recordEffectScope(this, i)
    }
    run() {
      if (!this.active) return this.fn()
      let t = activeEffect,
        r = shouldTrack
      for (; t; ) {
        if (t === this) return
        t = t.parent
      }
      try {
        return (
          (this.parent = activeEffect),
          (activeEffect = this),
          (shouldTrack = !0),
          (trackOpBit = 1 << ++effectTrackDepth),
          effectTrackDepth <= maxMarkerBits ? initDepMarkers(this) : cleanupEffect(this),
          this.fn()
        )
      } finally {
        effectTrackDepth <= maxMarkerBits && finalizeDepMarkers(this),
          (trackOpBit = 1 << --effectTrackDepth),
          (activeEffect = this.parent),
          (shouldTrack = r),
          (this.parent = void 0),
          this.deferStop && this.stop()
      }
    }
    stop() {
      activeEffect === this
        ? (this.deferStop = !0)
        : this.active && (cleanupEffect(this), this.onStop && this.onStop(), (this.active = !1))
    }
  }
  function cleanupEffect(e) {
    const { deps: t } = e
    if (t.length) {
      for (let r = 0; r < t.length; r++) t[r].delete(e)
      t.length = 0
    }
  }
  let shouldTrack = !0
  const trackStack = []
  function pauseTracking() {
    trackStack.push(shouldTrack), (shouldTrack = !1)
  }
  function resetTracking() {
    const e = trackStack.pop()
    shouldTrack = e === void 0 ? !0 : e
  }
  function track(e, t, r) {
    if (shouldTrack && activeEffect) {
      let i = targetMap.get(e)
      i || targetMap.set(e, (i = new Map()))
      let n = i.get(r)
      n || i.set(r, (n = createDep())), trackEffects(n)
    }
  }
  function trackEffects(e, t) {
    let r = !1
    effectTrackDepth <= maxMarkerBits
      ? newTracked(e) || ((e.n |= trackOpBit), (r = !wasTracked(e)))
      : (r = !e.has(activeEffect)),
      r && (e.add(activeEffect), activeEffect.deps.push(e))
  }
  function trigger(e, t, r, i, n, s) {
    const a = targetMap.get(e)
    if (!a) return
    let l = []
    if (t === 'clear') l = [...a.values()]
    else if (r === 'length' && isArray$2(e)) {
      const o = Number(i)
      a.forEach((f, u) => {
        ;(u === 'length' || (!isSymbol(u) && u >= o)) && l.push(f)
      })
    } else
      switch ((r !== void 0 && l.push(a.get(r)), t)) {
        case 'add':
          isArray$2(e)
            ? isIntegerKey(r) && l.push(a.get('length'))
            : (l.push(a.get(ITERATE_KEY)), isMap$2(e) && l.push(a.get(MAP_KEY_ITERATE_KEY)))
          break
        case 'delete':
          isArray$2(e) ||
            (l.push(a.get(ITERATE_KEY)), isMap$2(e) && l.push(a.get(MAP_KEY_ITERATE_KEY)))
          break
        case 'set':
          isMap$2(e) && l.push(a.get(ITERATE_KEY))
          break
      }
    if (l.length === 1) l[0] && triggerEffects(l[0])
    else {
      const o = []
      for (const f of l) f && o.push(...f)
      triggerEffects(createDep(o))
    }
  }
  function triggerEffects(e, t) {
    const r = isArray$2(e) ? e : [...e]
    for (const i of r) i.computed && triggerEffect(i)
    for (const i of r) i.computed || triggerEffect(i)
  }
  function triggerEffect(e, t) {
    ;(e !== activeEffect || e.allowRecurse) && (e.scheduler ? e.scheduler() : e.run())
  }
  const isNonTrackableKeys = makeMap('__proto__,__v_isRef,__isVue'),
    builtInSymbols = new Set(
      Object.getOwnPropertyNames(Symbol)
        .filter((e) => e !== 'arguments' && e !== 'caller')
        .map((e) => Symbol[e])
        .filter(isSymbol)
    ),
    arrayInstrumentations = createArrayInstrumentations()
  function createArrayInstrumentations() {
    const e = {}
    return (
      ['includes', 'indexOf', 'lastIndexOf'].forEach((t) => {
        e[t] = function (...r) {
          const i = toRaw(this)
          for (let s = 0, a = this.length; s < a; s++) track(i, 'get', s + '')
          const n = i[t](...r)
          return n === -1 || n === !1 ? i[t](...r.map(toRaw)) : n
        }
      }),
      ['push', 'pop', 'shift', 'unshift', 'splice'].forEach((t) => {
        e[t] = function (...r) {
          pauseTracking()
          const i = toRaw(this)[t].apply(this, r)
          return resetTracking(), i
        }
      }),
      e
    )
  }
  function hasOwnProperty$c(e) {
    const t = toRaw(this)
    return track(t, 'has', e), t.hasOwnProperty(e)
  }
  class BaseReactiveHandler {
    constructor(t = !1, r = !1) {
      ;(this._isReadonly = t), (this._shallow = r)
    }
    get(t, r, i) {
      const n = this._isReadonly,
        s = this._shallow
      if (r === '__v_isReactive') return !n
      if (r === '__v_isReadonly') return n
      if (r === '__v_isShallow') return s
      if (r === '__v_raw')
        return i ===
          (n ? (s ? shallowReadonlyMap : readonlyMap) : s ? shallowReactiveMap : reactiveMap).get(
            t
          ) || Object.getPrototypeOf(t) === Object.getPrototypeOf(i)
          ? t
          : void 0
      const a = isArray$2(t)
      if (!n) {
        if (a && hasOwn(arrayInstrumentations, r)) return Reflect.get(arrayInstrumentations, r, i)
        if (r === 'hasOwnProperty') return hasOwnProperty$c
      }
      const l = Reflect.get(t, r, i)
      return (isSymbol(r) ? builtInSymbols.has(r) : isNonTrackableKeys(r)) ||
        (n || track(t, 'get', r), s)
        ? l
        : isRef(l)
          ? a && isIntegerKey(r)
            ? l
            : l.value
          : isObject$2(l)
            ? n
              ? readonly(l)
              : reactive(l)
            : l
    }
  }
  class MutableReactiveHandler extends BaseReactiveHandler {
    constructor(t = !1) {
      super(!1, t)
    }
    set(t, r, i, n) {
      let s = t[r]
      if (!this._shallow) {
        const o = isReadonly(s)
        if (
          (!isShallow(i) && !isReadonly(i) && ((s = toRaw(s)), (i = toRaw(i))),
          !isArray$2(t) && isRef(s) && !isRef(i))
        )
          return o ? !1 : ((s.value = i), !0)
      }
      const a = isArray$2(t) && isIntegerKey(r) ? Number(r) < t.length : hasOwn(t, r),
        l = Reflect.set(t, r, i, n)
      return (
        t === toRaw(n) &&
          (a ? hasChanged(i, s) && trigger(t, 'set', r, i) : trigger(t, 'add', r, i)),
        l
      )
    }
    deleteProperty(t, r) {
      const i = hasOwn(t, r)
      t[r]
      const n = Reflect.deleteProperty(t, r)
      return n && i && trigger(t, 'delete', r, void 0), n
    }
    has(t, r) {
      const i = Reflect.has(t, r)
      return (!isSymbol(r) || !builtInSymbols.has(r)) && track(t, 'has', r), i
    }
    ownKeys(t) {
      return track(t, 'iterate', isArray$2(t) ? 'length' : ITERATE_KEY), Reflect.ownKeys(t)
    }
  }
  class ReadonlyReactiveHandler extends BaseReactiveHandler {
    constructor(t = !1) {
      super(!0, t)
    }
    set(t, r) {
      return !0
    }
    deleteProperty(t, r) {
      return !0
    }
  }
  const mutableHandlers = new MutableReactiveHandler(),
    readonlyHandlers = new ReadonlyReactiveHandler(),
    shallowReactiveHandlers = new MutableReactiveHandler(!0),
    toShallow = (e) => e,
    getProto = (e) => Reflect.getPrototypeOf(e)
  function get(e, t, r = !1, i = !1) {
    e = e.__v_raw
    const n = toRaw(e),
      s = toRaw(t)
    r || (hasChanged(t, s) && track(n, 'get', t), track(n, 'get', s))
    const { has: a } = getProto(n),
      l = i ? toShallow : r ? toReadonly : toReactive
    if (a.call(n, t)) return l(e.get(t))
    if (a.call(n, s)) return l(e.get(s))
    e !== n && e.get(t)
  }
  function has(e, t = !1) {
    const r = this.__v_raw,
      i = toRaw(r),
      n = toRaw(e)
    return (
      t || (hasChanged(e, n) && track(i, 'has', e), track(i, 'has', n)),
      e === n ? r.has(e) : r.has(e) || r.has(n)
    )
  }
  function size(e, t = !1) {
    return (e = e.__v_raw), !t && track(toRaw(e), 'iterate', ITERATE_KEY), Reflect.get(e, 'size', e)
  }
  function add(e) {
    e = toRaw(e)
    const t = toRaw(this)
    return getProto(t).has.call(t, e) || (t.add(e), trigger(t, 'add', e, e)), this
  }
  function set(e, t) {
    t = toRaw(t)
    const r = toRaw(this),
      { has: i, get: n } = getProto(r)
    let s = i.call(r, e)
    s || ((e = toRaw(e)), (s = i.call(r, e)))
    const a = n.call(r, e)
    return (
      r.set(e, t), s ? hasChanged(t, a) && trigger(r, 'set', e, t) : trigger(r, 'add', e, t), this
    )
  }
  function deleteEntry(e) {
    const t = toRaw(this),
      { has: r, get: i } = getProto(t)
    let n = r.call(t, e)
    n || ((e = toRaw(e)), (n = r.call(t, e))), i && i.call(t, e)
    const s = t.delete(e)
    return n && trigger(t, 'delete', e, void 0), s
  }
  function clear() {
    const e = toRaw(this),
      t = e.size !== 0,
      r = e.clear()
    return t && trigger(e, 'clear', void 0, void 0), r
  }
  function createForEach(e, t) {
    return function (i, n) {
      const s = this,
        a = s.__v_raw,
        l = toRaw(a),
        o = t ? toShallow : e ? toReadonly : toReactive
      return !e && track(l, 'iterate', ITERATE_KEY), a.forEach((f, u) => i.call(n, o(f), o(u), s))
    }
  }
  function createIterableMethod(e, t, r) {
    return function (...i) {
      const n = this.__v_raw,
        s = toRaw(n),
        a = isMap$2(s),
        l = e === 'entries' || (e === Symbol.iterator && a),
        o = e === 'keys' && a,
        f = n[e](...i),
        u = r ? toShallow : t ? toReadonly : toReactive
      return (
        !t && track(s, 'iterate', o ? MAP_KEY_ITERATE_KEY : ITERATE_KEY),
        {
          next() {
            const { value: E, done: c } = f.next()
            return c ? { value: E, done: c } : { value: l ? [u(E[0]), u(E[1])] : u(E), done: c }
          },
          [Symbol.iterator]() {
            return this
          }
        }
      )
    }
  }
  function createReadonlyMethod(e) {
    return function (...t) {
      return e === 'delete' ? !1 : e === 'clear' ? void 0 : this
    }
  }
  function createInstrumentations() {
    const e = {
        get(s) {
          return get(this, s)
        },
        get size() {
          return size(this)
        },
        has,
        add,
        set,
        delete: deleteEntry,
        clear,
        forEach: createForEach(!1, !1)
      },
      t = {
        get(s) {
          return get(this, s, !1, !0)
        },
        get size() {
          return size(this)
        },
        has,
        add,
        set,
        delete: deleteEntry,
        clear,
        forEach: createForEach(!1, !0)
      },
      r = {
        get(s) {
          return get(this, s, !0)
        },
        get size() {
          return size(this, !0)
        },
        has(s) {
          return has.call(this, s, !0)
        },
        add: createReadonlyMethod('add'),
        set: createReadonlyMethod('set'),
        delete: createReadonlyMethod('delete'),
        clear: createReadonlyMethod('clear'),
        forEach: createForEach(!0, !1)
      },
      i = {
        get(s) {
          return get(this, s, !0, !0)
        },
        get size() {
          return size(this, !0)
        },
        has(s) {
          return has.call(this, s, !0)
        },
        add: createReadonlyMethod('add'),
        set: createReadonlyMethod('set'),
        delete: createReadonlyMethod('delete'),
        clear: createReadonlyMethod('clear'),
        forEach: createForEach(!0, !0)
      }
    return (
      ['keys', 'values', 'entries', Symbol.iterator].forEach((s) => {
        ;(e[s] = createIterableMethod(s, !1, !1)),
          (r[s] = createIterableMethod(s, !0, !1)),
          (t[s] = createIterableMethod(s, !1, !0)),
          (i[s] = createIterableMethod(s, !0, !0))
      }),
      [e, r, t, i]
    )
  }
  const [
    mutableInstrumentations,
    readonlyInstrumentations,
    shallowInstrumentations,
    shallowReadonlyInstrumentations
  ] = createInstrumentations()
  function createInstrumentationGetter(e, t) {
    const r = t
      ? e
        ? shallowReadonlyInstrumentations
        : shallowInstrumentations
      : e
        ? readonlyInstrumentations
        : mutableInstrumentations
    return (i, n, s) =>
      n === '__v_isReactive'
        ? !e
        : n === '__v_isReadonly'
          ? e
          : n === '__v_raw'
            ? i
            : Reflect.get(hasOwn(r, n) && n in i ? r : i, n, s)
  }
  const mutableCollectionHandlers = { get: createInstrumentationGetter(!1, !1) },
    shallowCollectionHandlers = { get: createInstrumentationGetter(!1, !0) },
    readonlyCollectionHandlers = { get: createInstrumentationGetter(!0, !1) },
    reactiveMap = new WeakMap(),
    shallowReactiveMap = new WeakMap(),
    readonlyMap = new WeakMap(),
    shallowReadonlyMap = new WeakMap()
  function targetTypeMap(e) {
    switch (e) {
      case 'Object':
      case 'Array':
        return 1
      case 'Map':
      case 'Set':
      case 'WeakMap':
      case 'WeakSet':
        return 2
      default:
        return 0
    }
  }
  function getTargetType(e) {
    return e.__v_skip || !Object.isExtensible(e) ? 0 : targetTypeMap(toRawType(e))
  }
  function reactive(e) {
    return isReadonly(e)
      ? e
      : createReactiveObject(e, !1, mutableHandlers, mutableCollectionHandlers, reactiveMap)
  }
  function shallowReactive(e) {
    return createReactiveObject(
      e,
      !1,
      shallowReactiveHandlers,
      shallowCollectionHandlers,
      shallowReactiveMap
    )
  }
  function readonly(e) {
    return createReactiveObject(e, !0, readonlyHandlers, readonlyCollectionHandlers, readonlyMap)
  }
  function createReactiveObject(e, t, r, i, n) {
    if (!isObject$2(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e
    const s = n.get(e)
    if (s) return s
    const a = getTargetType(e)
    if (a === 0) return e
    const l = new Proxy(e, a === 2 ? i : r)
    return n.set(e, l), l
  }
  function isReactive(e) {
    return isReadonly(e) ? isReactive(e.__v_raw) : !!(e && e.__v_isReactive)
  }
  function isReadonly(e) {
    return !!(e && e.__v_isReadonly)
  }
  function isShallow(e) {
    return !!(e && e.__v_isShallow)
  }
  function isProxy(e) {
    return isReactive(e) || isReadonly(e)
  }
  function toRaw(e) {
    const t = e && e.__v_raw
    return t ? toRaw(t) : e
  }
  function markRaw(e) {
    return def(e, '__v_skip', !0), e
  }
  const toReactive = (e) => (isObject$2(e) ? reactive(e) : e),
    toReadonly = (e) => (isObject$2(e) ? readonly(e) : e)
  function trackRefValue(e) {
    shouldTrack && activeEffect && ((e = toRaw(e)), trackEffects(e.dep || (e.dep = createDep())))
  }
  function triggerRefValue(e, t) {
    e = toRaw(e)
    const r = e.dep
    r && triggerEffects(r)
  }
  function isRef(e) {
    return !!(e && e.__v_isRef === !0)
  }
  function ref(e) {
    return createRef(e, !1)
  }
  function shallowRef(e) {
    return createRef(e, !0)
  }
  function createRef(e, t) {
    return isRef(e) ? e : new RefImpl(e, t)
  }
  class RefImpl {
    constructor(t, r) {
      ;(this.__v_isShallow = r),
        (this.dep = void 0),
        (this.__v_isRef = !0),
        (this._rawValue = r ? t : toRaw(t)),
        (this._value = r ? t : toReactive(t))
    }
    get value() {
      return trackRefValue(this), this._value
    }
    set value(t) {
      const r = this.__v_isShallow || isShallow(t) || isReadonly(t)
      ;(t = r ? t : toRaw(t)),
        hasChanged(t, this._rawValue) &&
          ((this._rawValue = t), (this._value = r ? t : toReactive(t)), triggerRefValue(this))
    }
  }
  function unref(e) {
    return isRef(e) ? e.value : e
  }
  const shallowUnwrapHandlers = {
    get: (e, t, r) => unref(Reflect.get(e, t, r)),
    set: (e, t, r, i) => {
      const n = e[t]
      return isRef(n) && !isRef(r) ? ((n.value = r), !0) : Reflect.set(e, t, r, i)
    }
  }
  function proxyRefs(e) {
    return isReactive(e) ? e : new Proxy(e, shallowUnwrapHandlers)
  }
  class ComputedRefImpl {
    constructor(t, r, i, n) {
      ;(this._setter = r),
        (this.dep = void 0),
        (this.__v_isRef = !0),
        (this.__v_isReadonly = !1),
        (this._dirty = !0),
        (this.effect = new ReactiveEffect(t, () => {
          this._dirty || ((this._dirty = !0), triggerRefValue(this))
        })),
        (this.effect.computed = this),
        (this.effect.active = this._cacheable = !n),
        (this.__v_isReadonly = i)
    }
    get value() {
      const t = toRaw(this)
      return (
        trackRefValue(t),
        (t._dirty || !t._cacheable) && ((t._dirty = !1), (t._value = t.effect.run())),
        t._value
      )
    }
    set value(t) {
      this._setter(t)
    }
  }
  function computed$1(e, t, r = !1) {
    let i, n
    const s = isFunction$1(e)
    return (
      s ? ((i = e), (n = NOOP)) : ((i = e.get), (n = e.set)), new ComputedRefImpl(i, n, s || !n, r)
    )
  }
  function warn(e, ...t) {}
  function callWithErrorHandling(e, t, r, i) {
    let n
    try {
      n = i ? e(...i) : e()
    } catch (s) {
      handleError(s, t, r)
    }
    return n
  }
  function callWithAsyncErrorHandling(e, t, r, i) {
    if (isFunction$1(e)) {
      const s = callWithErrorHandling(e, t, r, i)
      return (
        s &&
          isPromise(s) &&
          s.catch((a) => {
            handleError(a, t, r)
          }),
        s
      )
    }
    const n = []
    for (let s = 0; s < e.length; s++) n.push(callWithAsyncErrorHandling(e[s], t, r, i))
    return n
  }
  function handleError(e, t, r, i = !0) {
    const n = t ? t.vnode : null
    if (t) {
      let s = t.parent
      const a = t.proxy,
        l = r
      for (; s; ) {
        const f = s.ec
        if (f) {
          for (let u = 0; u < f.length; u++) if (f[u](e, a, l) === !1) return
        }
        s = s.parent
      }
      const o = t.appContext.config.errorHandler
      if (o) {
        callWithErrorHandling(o, null, 10, [e, a, l])
        return
      }
    }
    logError(e, r, n, i)
  }
  function logError(e, t, r, i = !0) {
    console.error(e)
  }
  let isFlushing = !1,
    isFlushPending = !1
  const queue = []
  let flushIndex = 0
  const pendingPostFlushCbs = []
  let activePostFlushCbs = null,
    postFlushIndex = 0
  const resolvedPromise = Promise.resolve()
  let currentFlushPromise = null
  function nextTick(e) {
    const t = currentFlushPromise || resolvedPromise
    return e ? t.then(this ? e.bind(this) : e) : t
  }
  function findInsertionIndex(e) {
    let t = flushIndex + 1,
      r = queue.length
    for (; t < r; ) {
      const i = (t + r) >>> 1,
        n = queue[i],
        s = getId(n)
      s < e || (s === e && n.pre) ? (t = i + 1) : (r = i)
    }
    return t
  }
  function queueJob(e) {
    ;(!queue.length ||
      !queue.includes(e, isFlushing && e.allowRecurse ? flushIndex + 1 : flushIndex)) &&
      (e.id == null ? queue.push(e) : queue.splice(findInsertionIndex(e.id), 0, e), queueFlush())
  }
  function queueFlush() {
    !isFlushing &&
      !isFlushPending &&
      ((isFlushPending = !0), (currentFlushPromise = resolvedPromise.then(flushJobs)))
  }
  function invalidateJob(e) {
    const t = queue.indexOf(e)
    t > flushIndex && queue.splice(t, 1)
  }
  function queuePostFlushCb(e) {
    isArray$2(e)
      ? pendingPostFlushCbs.push(...e)
      : (!activePostFlushCbs ||
          !activePostFlushCbs.includes(e, e.allowRecurse ? postFlushIndex + 1 : postFlushIndex)) &&
        pendingPostFlushCbs.push(e),
      queueFlush()
  }
  function flushPreFlushCbs(e, t, r = isFlushing ? flushIndex + 1 : 0) {
    for (; r < queue.length; r++) {
      const i = queue[r]
      if (i && i.pre) {
        if (e && i.id !== e.uid) continue
        queue.splice(r, 1), r--, i()
      }
    }
  }
  function flushPostFlushCbs(e) {
    if (pendingPostFlushCbs.length) {
      const t = [...new Set(pendingPostFlushCbs)]
      if (((pendingPostFlushCbs.length = 0), activePostFlushCbs)) {
        activePostFlushCbs.push(...t)
        return
      }
      for (
        activePostFlushCbs = t,
          activePostFlushCbs.sort((r, i) => getId(r) - getId(i)),
          postFlushIndex = 0;
        postFlushIndex < activePostFlushCbs.length;
        postFlushIndex++
      )
        activePostFlushCbs[postFlushIndex]()
      ;(activePostFlushCbs = null), (postFlushIndex = 0)
    }
  }
  const getId = (e) => (e.id == null ? 1 / 0 : e.id),
    comparator = (e, t) => {
      const r = getId(e) - getId(t)
      if (r === 0) {
        if (e.pre && !t.pre) return -1
        if (t.pre && !e.pre) return 1
      }
      return r
    }
  function flushJobs(e) {
    ;(isFlushPending = !1), (isFlushing = !0), queue.sort(comparator)
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const t = queue[flushIndex]
        t && t.active !== !1 && callWithErrorHandling(t, null, 14)
      }
    } finally {
      ;(flushIndex = 0),
        (queue.length = 0),
        flushPostFlushCbs(),
        (isFlushing = !1),
        (currentFlushPromise = null),
        (queue.length || pendingPostFlushCbs.length) && flushJobs()
    }
  }
  function emit(e, t, ...r) {
    if (e.isUnmounted) return
    const i = e.vnode.props || EMPTY_OBJ
    let n = r
    const s = t.startsWith('update:'),
      a = s && t.slice(7)
    if (a && a in i) {
      const u = `${a === 'modelValue' ? 'model' : a}Modifiers`,
        { number: E, trim: c } = i[u] || EMPTY_OBJ
      c && (n = r.map((b) => (isString(b) ? b.trim() : b))), E && (n = r.map(looseToNumber))
    }
    let l,
      o = i[(l = toHandlerKey(t))] || i[(l = toHandlerKey(camelize(t)))]
    !o && s && (o = i[(l = toHandlerKey(hyphenate(t)))]),
      o && callWithAsyncErrorHandling(o, e, 6, n)
    const f = i[l + 'Once']
    if (f) {
      if (!e.emitted) e.emitted = {}
      else if (e.emitted[l]) return
      ;(e.emitted[l] = !0), callWithAsyncErrorHandling(f, e, 6, n)
    }
  }
  function normalizeEmitsOptions(e, t, r = !1) {
    const i = t.emitsCache,
      n = i.get(e)
    if (n !== void 0) return n
    const s = e.emits
    let a = {},
      l = !1
    if (!isFunction$1(e)) {
      const o = (f) => {
        const u = normalizeEmitsOptions(f, t, !0)
        u && ((l = !0), extend(a, u))
      }
      !r && t.mixins.length && t.mixins.forEach(o),
        e.extends && o(e.extends),
        e.mixins && e.mixins.forEach(o)
    }
    return !s && !l
      ? (isObject$2(e) && i.set(e, null), null)
      : (isArray$2(s) ? s.forEach((o) => (a[o] = null)) : extend(a, s),
        isObject$2(e) && i.set(e, a),
        a)
  }
  function isEmitListener(e, t) {
    return !e || !isOn(t)
      ? !1
      : ((t = t.slice(2).replace(/Once$/, '')),
        hasOwn(e, t[0].toLowerCase() + t.slice(1)) || hasOwn(e, hyphenate(t)) || hasOwn(e, t))
  }
  let currentRenderingInstance = null,
    currentScopeId = null
  function setCurrentRenderingInstance(e) {
    const t = currentRenderingInstance
    return (currentRenderingInstance = e), (currentScopeId = (e && e.type.__scopeId) || null), t
  }
  function pushScopeId(e) {
    currentScopeId = e
  }
  function popScopeId() {
    currentScopeId = null
  }
  function withCtx(e, t = currentRenderingInstance, r) {
    if (!t || e._n) return e
    const i = (...n) => {
      i._d && setBlockTracking(-1)
      const s = setCurrentRenderingInstance(t)
      let a
      try {
        a = e(...n)
      } finally {
        setCurrentRenderingInstance(s), i._d && setBlockTracking(1)
      }
      return a
    }
    return (i._n = !0), (i._c = !0), (i._d = !0), i
  }
  function markAttrsAccessed() {}
  function renderComponentRoot(e) {
    const {
      type: t,
      vnode: r,
      proxy: i,
      withProxy: n,
      props: s,
      propsOptions: [a],
      slots: l,
      attrs: o,
      emit: f,
      render: u,
      renderCache: E,
      data: c,
      setupState: b,
      ctx: x,
      inheritAttrs: y
    } = e
    let _, m
    const A = setCurrentRenderingInstance(e)
    try {
      if (r.shapeFlag & 4) {
        const g = n || i,
          C = g
        ;(_ = normalizeVNode(u.call(C, g, E, s, b, c, x))), (m = o)
      } else {
        const g = t
        ;(_ = normalizeVNode(g.length > 1 ? g(s, { attrs: o, slots: l, emit: f }) : g(s, null))),
          (m = t.props ? o : getFunctionalFallthrough(o))
      }
    } catch (g) {
      ;(blockStack.length = 0), handleError(g, e, 1), (_ = createVNode(Comment))
    }
    let d = _
    if (m && y !== !1) {
      const g = Object.keys(m),
        { shapeFlag: C } = d
      g.length &&
        C & 7 &&
        (a && g.some(isModelListener) && (m = filterModelListeners(m, a)), (d = cloneVNode(d, m)))
    }
    return (
      r.dirs && ((d = cloneVNode(d)), (d.dirs = d.dirs ? d.dirs.concat(r.dirs) : r.dirs)),
      r.transition && (d.transition = r.transition),
      (_ = d),
      setCurrentRenderingInstance(A),
      _
    )
  }
  const getFunctionalFallthrough = (e) => {
      let t
      for (const r in e) (r === 'class' || r === 'style' || isOn(r)) && ((t || (t = {}))[r] = e[r])
      return t
    },
    filterModelListeners = (e, t) => {
      const r = {}
      for (const i in e) (!isModelListener(i) || !(i.slice(9) in t)) && (r[i] = e[i])
      return r
    }
  function shouldUpdateComponent(e, t, r) {
    const { props: i, children: n, component: s } = e,
      { props: a, children: l, patchFlag: o } = t,
      f = s.emitsOptions
    if (t.dirs || t.transition) return !0
    if (r && o >= 0) {
      if (o & 1024) return !0
      if (o & 16) return i ? hasPropsChanged(i, a, f) : !!a
      if (o & 8) {
        const u = t.dynamicProps
        for (let E = 0; E < u.length; E++) {
          const c = u[E]
          if (a[c] !== i[c] && !isEmitListener(f, c)) return !0
        }
      }
    } else
      return (n || l) && (!l || !l.$stable)
        ? !0
        : i === a
          ? !1
          : i
            ? a
              ? hasPropsChanged(i, a, f)
              : !0
            : !!a
    return !1
  }
  function hasPropsChanged(e, t, r) {
    const i = Object.keys(t)
    if (i.length !== Object.keys(e).length) return !0
    for (let n = 0; n < i.length; n++) {
      const s = i[n]
      if (t[s] !== e[s] && !isEmitListener(r, s)) return !0
    }
    return !1
  }
  function updateHOCHostEl({ vnode: e, parent: t }, r) {
    for (; t && t.subTree === e; ) ((e = t.vnode).el = r), (t = t.parent)
  }
  const COMPONENTS = 'components'
  function resolveComponent(e, t) {
    return resolveAsset(COMPONENTS, e, !0, t) || e
  }
  const NULL_DYNAMIC_COMPONENT = Symbol.for('v-ndc')
  function resolveAsset(e, t, r = !0, i = !1) {
    const n = currentRenderingInstance || currentInstance
    if (n) {
      const s = n.type
      if (e === COMPONENTS) {
        const l = getComponentName(s, !1)
        if (l && (l === t || l === camelize(t) || l === capitalize(camelize(t)))) return s
      }
      const a = resolve(n[e] || s[e], t) || resolve(n.appContext[e], t)
      return !a && i ? s : a
    }
  }
  function resolve(e, t) {
    return e && (e[t] || e[camelize(t)] || e[capitalize(camelize(t))])
  }
  const isSuspense = (e) => e.__isSuspense
  function queueEffectWithSuspense(e, t) {
    t && t.pendingBranch
      ? isArray$2(e)
        ? t.effects.push(...e)
        : t.effects.push(e)
      : queuePostFlushCb(e)
  }
  function watchEffect(e, t) {
    return doWatch(e, null, t)
  }
  const INITIAL_WATCHER_VALUE = {}
  function watch(e, t, r) {
    return doWatch(e, t, r)
  }
  function doWatch(
    e,
    t,
    { immediate: r, deep: i, flush: n, onTrack: s, onTrigger: a } = EMPTY_OBJ
  ) {
    var l
    const o =
      getCurrentScope() === ((l = currentInstance) == null ? void 0 : l.scope)
        ? currentInstance
        : null
    let f,
      u = !1,
      E = !1
    if (
      (isRef(e)
        ? ((f = () => e.value), (u = isShallow(e)))
        : isReactive(e)
          ? ((f = () => e), (i = !0))
          : isArray$2(e)
            ? ((E = !0),
              (u = e.some((g) => isReactive(g) || isShallow(g))),
              (f = () =>
                e.map((g) => {
                  if (isRef(g)) return g.value
                  if (isReactive(g)) return traverse(g)
                  if (isFunction$1(g)) return callWithErrorHandling(g, o, 2)
                })))
            : isFunction$1(e)
              ? t
                ? (f = () => callWithErrorHandling(e, o, 2))
                : (f = () => {
                    if (!(o && o.isUnmounted))
                      return c && c(), callWithAsyncErrorHandling(e, o, 3, [b])
                  })
              : (f = NOOP),
      t && i)
    ) {
      const g = f
      f = () => traverse(g())
    }
    let c,
      b = (g) => {
        c = A.onStop = () => {
          callWithErrorHandling(g, o, 4), (c = A.onStop = void 0)
        }
      },
      x
    if (isInSSRComponentSetup)
      if (
        ((b = NOOP),
        t ? r && callWithAsyncErrorHandling(t, o, 3, [f(), E ? [] : void 0, b]) : f(),
        n === 'sync')
      ) {
        const g = useSSRContext()
        x = g.__watcherHandles || (g.__watcherHandles = [])
      } else return NOOP
    let y = E ? new Array(e.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE
    const _ = () => {
      if (A.active)
        if (t) {
          const g = A.run()
          ;(i || u || (E ? g.some((C, P) => hasChanged(C, y[P])) : hasChanged(g, y))) &&
            (c && c(),
            callWithAsyncErrorHandling(t, o, 3, [
              g,
              y === INITIAL_WATCHER_VALUE ? void 0 : E && y[0] === INITIAL_WATCHER_VALUE ? [] : y,
              b
            ]),
            (y = g))
        } else A.run()
    }
    _.allowRecurse = !!t
    let m
    n === 'sync'
      ? (m = _)
      : n === 'post'
        ? (m = () => queuePostRenderEffect(_, o && o.suspense))
        : ((_.pre = !0), o && (_.id = o.uid), (m = () => queueJob(_)))
    const A = new ReactiveEffect(f, m)
    t
      ? r
        ? _()
        : (y = A.run())
      : n === 'post'
        ? queuePostRenderEffect(A.run.bind(A), o && o.suspense)
        : A.run()
    const d = () => {
      A.stop(), o && o.scope && remove(o.scope.effects, A)
    }
    return x && x.push(d), d
  }
  function instanceWatch(e, t, r) {
    const i = this.proxy,
      n = isString(e) ? (e.includes('.') ? createPathGetter(i, e) : () => i[e]) : e.bind(i, i)
    let s
    isFunction$1(t) ? (s = t) : ((s = t.handler), (r = t))
    const a = currentInstance
    setCurrentInstance(this)
    const l = doWatch(n, s.bind(i), r)
    return a ? setCurrentInstance(a) : unsetCurrentInstance(), l
  }
  function createPathGetter(e, t) {
    const r = t.split('.')
    return () => {
      let i = e
      for (let n = 0; n < r.length && i; n++) i = i[r[n]]
      return i
    }
  }
  function traverse(e, t) {
    if (!isObject$2(e) || e.__v_skip || ((t = t || new Set()), t.has(e))) return e
    if ((t.add(e), isRef(e))) traverse(e.value, t)
    else if (isArray$2(e)) for (let r = 0; r < e.length; r++) traverse(e[r], t)
    else if (isSet$2(e) || isMap$2(e))
      e.forEach((r) => {
        traverse(r, t)
      })
    else if (isPlainObject(e)) for (const r in e) traverse(e[r], t)
    return e
  }
  function invokeDirectiveHook(e, t, r, i) {
    const n = e.dirs,
      s = t && t.dirs
    for (let a = 0; a < n.length; a++) {
      const l = n[a]
      s && (l.oldValue = s[a].value)
      let o = l.dir[i]
      o && (pauseTracking(), callWithAsyncErrorHandling(o, r, 8, [e.el, l, e, t]), resetTracking())
    }
  }
  /*! #__NO_SIDE_EFFECTS__ */ function defineComponent(e, t) {
    return isFunction$1(e) ? extend({ name: e.name }, t, { setup: e }) : e
  }
  const isAsyncWrapper = (e) => !!e.type.__asyncLoader,
    isKeepAlive = (e) => e.type.__isKeepAlive
  function onActivated(e, t) {
    registerKeepAliveHook(e, 'a', t)
  }
  function onDeactivated(e, t) {
    registerKeepAliveHook(e, 'da', t)
  }
  function registerKeepAliveHook(e, t, r = currentInstance) {
    const i =
      e.__wdc ||
      (e.__wdc = () => {
        let n = r
        for (; n; ) {
          if (n.isDeactivated) return
          n = n.parent
        }
        return e()
      })
    if ((injectHook(t, i, r), r)) {
      let n = r.parent
      for (; n && n.parent; )
        isKeepAlive(n.parent.vnode) && injectToKeepAliveRoot(i, t, r, n), (n = n.parent)
    }
  }
  function injectToKeepAliveRoot(e, t, r, i) {
    const n = injectHook(t, e, i, !0)
    onUnmounted(() => {
      remove(i[t], n)
    }, r)
  }
  function injectHook(e, t, r = currentInstance, i = !1) {
    if (r) {
      const n = r[e] || (r[e] = []),
        s =
          t.__weh ||
          (t.__weh = (...a) => {
            if (r.isUnmounted) return
            pauseTracking(), setCurrentInstance(r)
            const l = callWithAsyncErrorHandling(t, r, e, a)
            return unsetCurrentInstance(), resetTracking(), l
          })
      return i ? n.unshift(s) : n.push(s), s
    }
  }
  const createHook =
      (e) =>
      (t, r = currentInstance) =>
        (!isInSSRComponentSetup || e === 'sp') && injectHook(e, (...i) => t(...i), r),
    onBeforeMount = createHook('bm'),
    onMounted = createHook('m'),
    onBeforeUpdate = createHook('bu'),
    onUpdated = createHook('u'),
    onBeforeUnmount = createHook('bum'),
    onUnmounted = createHook('um'),
    onServerPrefetch = createHook('sp'),
    onRenderTriggered = createHook('rtg'),
    onRenderTracked = createHook('rtc')
  function onErrorCaptured(e, t = currentInstance) {
    injectHook('ec', e, t)
  }
  function renderList(e, t, r, i) {
    let n
    const s = r && r[i]
    if (isArray$2(e) || isString(e)) {
      n = new Array(e.length)
      for (let a = 0, l = e.length; a < l; a++) n[a] = t(e[a], a, void 0, s && s[a])
    } else if (typeof e == 'number') {
      n = new Array(e)
      for (let a = 0; a < e; a++) n[a] = t(a + 1, a, void 0, s && s[a])
    } else if (isObject$2(e))
      if (e[Symbol.iterator]) n = Array.from(e, (a, l) => t(a, l, void 0, s && s[l]))
      else {
        const a = Object.keys(e)
        n = new Array(a.length)
        for (let l = 0, o = a.length; l < o; l++) {
          const f = a[l]
          n[l] = t(e[f], f, l, s && s[l])
        }
      }
    else n = []
    return r && (r[i] = n), n
  }
  const getPublicInstance = (e) =>
      e
        ? isStatefulComponent(e)
          ? getExposeProxy(e) || e.proxy
          : getPublicInstance(e.parent)
        : null,
    publicPropertiesMap = extend(Object.create(null), {
      $: (e) => e,
      $el: (e) => e.vnode.el,
      $data: (e) => e.data,
      $props: (e) => e.props,
      $attrs: (e) => e.attrs,
      $slots: (e) => e.slots,
      $refs: (e) => e.refs,
      $parent: (e) => getPublicInstance(e.parent),
      $root: (e) => getPublicInstance(e.root),
      $emit: (e) => e.emit,
      $options: (e) => resolveMergedOptions(e),
      $forceUpdate: (e) => e.f || (e.f = () => queueJob(e.update)),
      $nextTick: (e) => e.n || (e.n = nextTick.bind(e.proxy)),
      $watch: (e) => instanceWatch.bind(e)
    }),
    hasSetupBinding = (e, t) => e !== EMPTY_OBJ && !e.__isScriptSetup && hasOwn(e, t),
    PublicInstanceProxyHandlers = {
      get({ _: e }, t) {
        const {
          ctx: r,
          setupState: i,
          data: n,
          props: s,
          accessCache: a,
          type: l,
          appContext: o
        } = e
        let f
        if (t[0] !== '$') {
          const b = a[t]
          if (b !== void 0)
            switch (b) {
              case 1:
                return i[t]
              case 2:
                return n[t]
              case 4:
                return r[t]
              case 3:
                return s[t]
            }
          else {
            if (hasSetupBinding(i, t)) return (a[t] = 1), i[t]
            if (n !== EMPTY_OBJ && hasOwn(n, t)) return (a[t] = 2), n[t]
            if ((f = e.propsOptions[0]) && hasOwn(f, t)) return (a[t] = 3), s[t]
            if (r !== EMPTY_OBJ && hasOwn(r, t)) return (a[t] = 4), r[t]
            shouldCacheAccess && (a[t] = 0)
          }
        }
        const u = publicPropertiesMap[t]
        let E, c
        if (u) return t === '$attrs' && track(e, 'get', t), u(e)
        if ((E = l.__cssModules) && (E = E[t])) return E
        if (r !== EMPTY_OBJ && hasOwn(r, t)) return (a[t] = 4), r[t]
        if (((c = o.config.globalProperties), hasOwn(c, t))) return c[t]
      },
      set({ _: e }, t, r) {
        const { data: i, setupState: n, ctx: s } = e
        return hasSetupBinding(n, t)
          ? ((n[t] = r), !0)
          : i !== EMPTY_OBJ && hasOwn(i, t)
            ? ((i[t] = r), !0)
            : hasOwn(e.props, t) || (t[0] === '$' && t.slice(1) in e)
              ? !1
              : ((s[t] = r), !0)
      },
      has(
        { _: { data: e, setupState: t, accessCache: r, ctx: i, appContext: n, propsOptions: s } },
        a
      ) {
        let l
        return (
          !!r[a] ||
          (e !== EMPTY_OBJ && hasOwn(e, a)) ||
          hasSetupBinding(t, a) ||
          ((l = s[0]) && hasOwn(l, a)) ||
          hasOwn(i, a) ||
          hasOwn(publicPropertiesMap, a) ||
          hasOwn(n.config.globalProperties, a)
        )
      },
      defineProperty(e, t, r) {
        return (
          r.get != null
            ? (e._.accessCache[t] = 0)
            : hasOwn(r, 'value') && this.set(e, t, r.value, null),
          Reflect.defineProperty(e, t, r)
        )
      }
    }
  function normalizePropsOrEmits(e) {
    return isArray$2(e) ? e.reduce((t, r) => ((t[r] = null), t), {}) : e
  }
  let shouldCacheAccess = !0
  function applyOptions(e) {
    const t = resolveMergedOptions(e),
      r = e.proxy,
      i = e.ctx
    ;(shouldCacheAccess = !1), t.beforeCreate && callHook(t.beforeCreate, e, 'bc')
    const {
      data: n,
      computed: s,
      methods: a,
      watch: l,
      provide: o,
      inject: f,
      created: u,
      beforeMount: E,
      mounted: c,
      beforeUpdate: b,
      updated: x,
      activated: y,
      deactivated: _,
      beforeDestroy: m,
      beforeUnmount: A,
      destroyed: d,
      unmounted: g,
      render: C,
      renderTracked: P,
      renderTriggered: k,
      errorCaptured: M,
      serverPrefetch: D,
      expose: W,
      inheritAttrs: H,
      components: $,
      directives: Z,
      filters: Y
    } = t
    if ((f && resolveInjections(f, i, null), a))
      for (const T in a) {
        const j = a[T]
        isFunction$1(j) && (i[T] = j.bind(r))
      }
    if (n) {
      const T = n.call(r, r)
      isObject$2(T) && (e.data = reactive(T))
    }
    if (((shouldCacheAccess = !0), s))
      for (const T in s) {
        const j = s[T],
          S = isFunction$1(j) ? j.bind(r, r) : isFunction$1(j.get) ? j.get.bind(r, r) : NOOP,
          R = !isFunction$1(j) && isFunction$1(j.set) ? j.set.bind(r) : NOOP,
          V = computed({ get: S, set: R })
        Object.defineProperty(i, T, {
          enumerable: !0,
          configurable: !0,
          get: () => V.value,
          set: (K) => (V.value = K)
        })
      }
    if (l) for (const T in l) createWatcher(l[T], i, r, T)
    if (o) {
      const T = isFunction$1(o) ? o.call(r) : o
      Reflect.ownKeys(T).forEach((j) => {
        provide(j, T[j])
      })
    }
    u && callHook(u, e, 'c')
    function B(T, j) {
      isArray$2(j) ? j.forEach((S) => T(S.bind(r))) : j && T(j.bind(r))
    }
    if (
      (B(onBeforeMount, E),
      B(onMounted, c),
      B(onBeforeUpdate, b),
      B(onUpdated, x),
      B(onActivated, y),
      B(onDeactivated, _),
      B(onErrorCaptured, M),
      B(onRenderTracked, P),
      B(onRenderTriggered, k),
      B(onBeforeUnmount, A),
      B(onUnmounted, g),
      B(onServerPrefetch, D),
      isArray$2(W))
    )
      if (W.length) {
        const T = e.exposed || (e.exposed = {})
        W.forEach((j) => {
          Object.defineProperty(T, j, { get: () => r[j], set: (S) => (r[j] = S) })
        })
      } else e.exposed || (e.exposed = {})
    C && e.render === NOOP && (e.render = C),
      H != null && (e.inheritAttrs = H),
      $ && (e.components = $),
      Z && (e.directives = Z)
  }
  function resolveInjections(e, t, r = NOOP) {
    isArray$2(e) && (e = normalizeInject(e))
    for (const i in e) {
      const n = e[i]
      let s
      isObject$2(n)
        ? 'default' in n
          ? (s = inject(n.from || i, n.default, !0))
          : (s = inject(n.from || i))
        : (s = inject(n)),
        isRef(s)
          ? Object.defineProperty(t, i, {
              enumerable: !0,
              configurable: !0,
              get: () => s.value,
              set: (a) => (s.value = a)
            })
          : (t[i] = s)
    }
  }
  function callHook(e, t, r) {
    callWithAsyncErrorHandling(isArray$2(e) ? e.map((i) => i.bind(t.proxy)) : e.bind(t.proxy), t, r)
  }
  function createWatcher(e, t, r, i) {
    const n = i.includes('.') ? createPathGetter(r, i) : () => r[i]
    if (isString(e)) {
      const s = t[e]
      isFunction$1(s) && watch(n, s)
    } else if (isFunction$1(e)) watch(n, e.bind(r))
    else if (isObject$2(e))
      if (isArray$2(e)) e.forEach((s) => createWatcher(s, t, r, i))
      else {
        const s = isFunction$1(e.handler) ? e.handler.bind(r) : t[e.handler]
        isFunction$1(s) && watch(n, s, e)
      }
  }
  function resolveMergedOptions(e) {
    const t = e.type,
      { mixins: r, extends: i } = t,
      {
        mixins: n,
        optionsCache: s,
        config: { optionMergeStrategies: a }
      } = e.appContext,
      l = s.get(t)
    let o
    return (
      l
        ? (o = l)
        : !n.length && !r && !i
          ? (o = t)
          : ((o = {}),
            n.length && n.forEach((f) => mergeOptions(o, f, a, !0)),
            mergeOptions(o, t, a)),
      isObject$2(t) && s.set(t, o),
      o
    )
  }
  function mergeOptions(e, t, r, i = !1) {
    const { mixins: n, extends: s } = t
    s && mergeOptions(e, s, r, !0), n && n.forEach((a) => mergeOptions(e, a, r, !0))
    for (const a in t)
      if (!(i && a === 'expose')) {
        const l = internalOptionMergeStrats[a] || (r && r[a])
        e[a] = l ? l(e[a], t[a]) : t[a]
      }
    return e
  }
  const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeEmitsOrPropsOptions,
    emits: mergeEmitsOrPropsOptions,
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
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
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    watch: mergeWatchOptions,
    provide: mergeDataFn,
    inject: mergeInject
  }
  function mergeDataFn(e, t) {
    return t
      ? e
        ? function () {
            return extend(
              isFunction$1(e) ? e.call(this, this) : e,
              isFunction$1(t) ? t.call(this, this) : t
            )
          }
        : t
      : e
  }
  function mergeInject(e, t) {
    return mergeObjectOptions(normalizeInject(e), normalizeInject(t))
  }
  function normalizeInject(e) {
    if (isArray$2(e)) {
      const t = {}
      for (let r = 0; r < e.length; r++) t[e[r]] = e[r]
      return t
    }
    return e
  }
  function mergeAsArray(e, t) {
    return e ? [...new Set([].concat(e, t))] : t
  }
  function mergeObjectOptions(e, t) {
    return e ? extend(Object.create(null), e, t) : t
  }
  function mergeEmitsOrPropsOptions(e, t) {
    return e
      ? isArray$2(e) && isArray$2(t)
        ? [...new Set([...e, ...t])]
        : extend(Object.create(null), normalizePropsOrEmits(e), normalizePropsOrEmits(t ?? {}))
      : t
  }
  function mergeWatchOptions(e, t) {
    if (!e) return t
    if (!t) return e
    const r = extend(Object.create(null), e)
    for (const i in t) r[i] = mergeAsArray(e[i], t[i])
    return r
  }
  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: !1,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: Object.create(null),
      optionsCache: new WeakMap(),
      propsCache: new WeakMap(),
      emitsCache: new WeakMap()
    }
  }
  let uid$1 = 0
  function createAppAPI(e, t) {
    return function (i, n = null) {
      isFunction$1(i) || (i = extend({}, i)), n != null && !isObject$2(n) && (n = null)
      const s = createAppContext(),
        a = new WeakSet()
      let l = !1
      const o = (s.app = {
        _uid: uid$1++,
        _component: i,
        _props: n,
        _container: null,
        _context: s,
        _instance: null,
        version,
        get config() {
          return s.config
        },
        set config(f) {},
        use(f, ...u) {
          return (
            a.has(f) ||
              (f && isFunction$1(f.install)
                ? (a.add(f), f.install(o, ...u))
                : isFunction$1(f) && (a.add(f), f(o, ...u))),
            o
          )
        },
        mixin(f) {
          return s.mixins.includes(f) || s.mixins.push(f), o
        },
        component(f, u) {
          return u ? ((s.components[f] = u), o) : s.components[f]
        },
        directive(f, u) {
          return u ? ((s.directives[f] = u), o) : s.directives[f]
        },
        mount(f, u, E) {
          if (!l) {
            const c = createVNode(i, n)
            return (
              (c.appContext = s),
              u && t ? t(c, f) : e(c, f, E),
              (l = !0),
              (o._container = f),
              (f.__vue_app__ = o),
              getExposeProxy(c.component) || c.component.proxy
            )
          }
        },
        unmount() {
          l && (e(null, o._container), delete o._container.__vue_app__)
        },
        provide(f, u) {
          return (s.provides[f] = u), o
        },
        runWithContext(f) {
          currentApp = o
          try {
            return f()
          } finally {
            currentApp = null
          }
        }
      })
      return o
    }
  }
  let currentApp = null
  function provide(e, t) {
    if (currentInstance) {
      let r = currentInstance.provides
      const i = currentInstance.parent && currentInstance.parent.provides
      i === r && (r = currentInstance.provides = Object.create(i)), (r[e] = t)
    }
  }
  function inject(e, t, r = !1) {
    const i = currentInstance || currentRenderingInstance
    if (i || currentApp) {
      const n = i
        ? i.parent == null
          ? i.vnode.appContext && i.vnode.appContext.provides
          : i.parent.provides
        : currentApp._context.provides
      if (n && e in n) return n[e]
      if (arguments.length > 1) return r && isFunction$1(t) ? t.call(i && i.proxy) : t
    }
  }
  function initProps(e, t, r, i = !1) {
    const n = {},
      s = {}
    def(s, InternalObjectKey, 1), (e.propsDefaults = Object.create(null)), setFullProps(e, t, n, s)
    for (const a in e.propsOptions[0]) a in n || (n[a] = void 0)
    r ? (e.props = i ? n : shallowReactive(n)) : e.type.props ? (e.props = n) : (e.props = s),
      (e.attrs = s)
  }
  function updateProps(e, t, r, i) {
    const {
        props: n,
        attrs: s,
        vnode: { patchFlag: a }
      } = e,
      l = toRaw(n),
      [o] = e.propsOptions
    let f = !1
    if ((i || a > 0) && !(a & 16)) {
      if (a & 8) {
        const u = e.vnode.dynamicProps
        for (let E = 0; E < u.length; E++) {
          let c = u[E]
          if (isEmitListener(e.emitsOptions, c)) continue
          const b = t[c]
          if (o)
            if (hasOwn(s, c)) b !== s[c] && ((s[c] = b), (f = !0))
            else {
              const x = camelize(c)
              n[x] = resolvePropValue(o, l, x, b, e, !1)
            }
          else b !== s[c] && ((s[c] = b), (f = !0))
        }
      }
    } else {
      setFullProps(e, t, n, s) && (f = !0)
      let u
      for (const E in l)
        (!t || (!hasOwn(t, E) && ((u = hyphenate(E)) === E || !hasOwn(t, u)))) &&
          (o
            ? r &&
              (r[E] !== void 0 || r[u] !== void 0) &&
              (n[E] = resolvePropValue(o, l, E, void 0, e, !0))
            : delete n[E])
      if (s !== l) for (const E in s) (!t || !hasOwn(t, E)) && (delete s[E], (f = !0))
    }
    f && trigger(e, 'set', '$attrs')
  }
  function setFullProps(e, t, r, i) {
    const [n, s] = e.propsOptions
    let a = !1,
      l
    if (t)
      for (let o in t) {
        if (isReservedProp(o)) continue
        const f = t[o]
        let u
        n && hasOwn(n, (u = camelize(o)))
          ? !s || !s.includes(u)
            ? (r[u] = f)
            : ((l || (l = {}))[u] = f)
          : isEmitListener(e.emitsOptions, o) ||
            ((!(o in i) || f !== i[o]) && ((i[o] = f), (a = !0)))
      }
    if (s) {
      const o = toRaw(r),
        f = l || EMPTY_OBJ
      for (let u = 0; u < s.length; u++) {
        const E = s[u]
        r[E] = resolvePropValue(n, o, E, f[E], e, !hasOwn(f, E))
      }
    }
    return a
  }
  function resolvePropValue(e, t, r, i, n, s) {
    const a = e[r]
    if (a != null) {
      const l = hasOwn(a, 'default')
      if (l && i === void 0) {
        const o = a.default
        if (a.type !== Function && !a.skipFactory && isFunction$1(o)) {
          const { propsDefaults: f } = n
          r in f
            ? (i = f[r])
            : (setCurrentInstance(n), (i = f[r] = o.call(null, t)), unsetCurrentInstance())
        } else i = o
      }
      a[0] && (s && !l ? (i = !1) : a[1] && (i === '' || i === hyphenate(r)) && (i = !0))
    }
    return i
  }
  function normalizePropsOptions(e, t, r = !1) {
    const i = t.propsCache,
      n = i.get(e)
    if (n) return n
    const s = e.props,
      a = {},
      l = []
    let o = !1
    if (!isFunction$1(e)) {
      const u = (E) => {
        o = !0
        const [c, b] = normalizePropsOptions(E, t, !0)
        extend(a, c), b && l.push(...b)
      }
      !r && t.mixins.length && t.mixins.forEach(u),
        e.extends && u(e.extends),
        e.mixins && e.mixins.forEach(u)
    }
    if (!s && !o) return isObject$2(e) && i.set(e, EMPTY_ARR), EMPTY_ARR
    if (isArray$2(s))
      for (let u = 0; u < s.length; u++) {
        const E = camelize(s[u])
        validatePropName(E) && (a[E] = EMPTY_OBJ)
      }
    else if (s)
      for (const u in s) {
        const E = camelize(u)
        if (validatePropName(E)) {
          const c = s[u],
            b = (a[E] = isArray$2(c) || isFunction$1(c) ? { type: c } : extend({}, c))
          if (b) {
            const x = getTypeIndex(Boolean, b.type),
              y = getTypeIndex(String, b.type)
            ;(b[0] = x > -1), (b[1] = y < 0 || x < y), (x > -1 || hasOwn(b, 'default')) && l.push(E)
          }
        }
      }
    const f = [a, l]
    return isObject$2(e) && i.set(e, f), f
  }
  function validatePropName(e) {
    return e[0] !== '$'
  }
  function getType(e) {
    const t = e && e.toString().match(/^\s*(function|class) (\w+)/)
    return t ? t[2] : e === null ? 'null' : ''
  }
  function isSameType(e, t) {
    return getType(e) === getType(t)
  }
  function getTypeIndex(e, t) {
    return isArray$2(t)
      ? t.findIndex((r) => isSameType(r, e))
      : isFunction$1(t) && isSameType(t, e)
        ? 0
        : -1
  }
  const isInternalKey = (e) => e[0] === '_' || e === '$stable',
    normalizeSlotValue = (e) => (isArray$2(e) ? e.map(normalizeVNode) : [normalizeVNode(e)]),
    normalizeSlot = (e, t, r) => {
      if (t._n) return t
      const i = withCtx((...n) => normalizeSlotValue(t(...n)), r)
      return (i._c = !1), i
    },
    normalizeObjectSlots = (e, t, r) => {
      const i = e._ctx
      for (const n in e) {
        if (isInternalKey(n)) continue
        const s = e[n]
        if (isFunction$1(s)) t[n] = normalizeSlot(n, s, i)
        else if (s != null) {
          const a = normalizeSlotValue(s)
          t[n] = () => a
        }
      }
    },
    normalizeVNodeSlots = (e, t) => {
      const r = normalizeSlotValue(t)
      e.slots.default = () => r
    },
    initSlots = (e, t) => {
      if (e.vnode.shapeFlag & 32) {
        const r = t._
        r ? ((e.slots = toRaw(t)), def(t, '_', r)) : normalizeObjectSlots(t, (e.slots = {}))
      } else (e.slots = {}), t && normalizeVNodeSlots(e, t)
      def(e.slots, InternalObjectKey, 1)
    },
    updateSlots = (e, t, r) => {
      const { vnode: i, slots: n } = e
      let s = !0,
        a = EMPTY_OBJ
      if (i.shapeFlag & 32) {
        const l = t._
        l
          ? r && l === 1
            ? (s = !1)
            : (extend(n, t), !r && l === 1 && delete n._)
          : ((s = !t.$stable), normalizeObjectSlots(t, n)),
          (a = t)
      } else t && (normalizeVNodeSlots(e, t), (a = { default: 1 }))
      if (s) for (const l in n) !isInternalKey(l) && a[l] == null && delete n[l]
    }
  function setRef(e, t, r, i, n = !1) {
    if (isArray$2(e)) {
      e.forEach((c, b) => setRef(c, t && (isArray$2(t) ? t[b] : t), r, i, n))
      return
    }
    if (isAsyncWrapper(i) && !n) return
    const s = i.shapeFlag & 4 ? getExposeProxy(i.component) || i.component.proxy : i.el,
      a = n ? null : s,
      { i: l, r: o } = e,
      f = t && t.r,
      u = l.refs === EMPTY_OBJ ? (l.refs = {}) : l.refs,
      E = l.setupState
    if (
      (f != null &&
        f !== o &&
        (isString(f)
          ? ((u[f] = null), hasOwn(E, f) && (E[f] = null))
          : isRef(f) && (f.value = null)),
      isFunction$1(o))
    )
      callWithErrorHandling(o, l, 12, [a, u])
    else {
      const c = isString(o),
        b = isRef(o)
      if (c || b) {
        const x = () => {
          if (e.f) {
            const y = c ? (hasOwn(E, o) ? E[o] : u[o]) : o.value
            n
              ? isArray$2(y) && remove(y, s)
              : isArray$2(y)
                ? y.includes(s) || y.push(s)
                : c
                  ? ((u[o] = [s]), hasOwn(E, o) && (E[o] = u[o]))
                  : ((o.value = [s]), e.k && (u[e.k] = o.value))
          } else
            c ? ((u[o] = a), hasOwn(E, o) && (E[o] = a)) : b && ((o.value = a), e.k && (u[e.k] = a))
        }
        a ? ((x.id = -1), queuePostRenderEffect(x, r)) : x()
      }
    }
  }
  const queuePostRenderEffect = queueEffectWithSuspense
  function createRenderer(e) {
    return baseCreateRenderer(e)
  }
  function baseCreateRenderer(e, t) {
    const r = getGlobalThis()
    r.__VUE__ = !0
    const {
        insert: i,
        remove: n,
        patchProp: s,
        createElement: a,
        createText: l,
        createComment: o,
        setText: f,
        setElementText: u,
        parentNode: E,
        nextSibling: c,
        setScopeId: b = NOOP,
        insertStaticContent: x
      } = e,
      y = (F, I, O, z = null, N = null, U = null, q = !1, J = null, X = !!I.dynamicChildren) => {
        if (F === I) return
        F && !isSameVNodeType(F, I) && ((z = ce(F)), K(F, N, U, !0), (F = null)),
          I.patchFlag === -2 && ((X = !1), (I.dynamicChildren = null))
        const { type: G, ref: te, shapeFlag: Q } = I
        switch (G) {
          case Text:
            _(F, I, O, z)
            break
          case Comment:
            m(F, I, O, z)
            break
          case Static:
            F == null && A(I, O, z, q)
            break
          case Fragment:
            $(F, I, O, z, N, U, q, J, X)
            break
          default:
            Q & 1
              ? C(F, I, O, z, N, U, q, J, X)
              : Q & 6
                ? Z(F, I, O, z, N, U, q, J, X)
                : (Q & 64 || Q & 128) && G.process(F, I, O, z, N, U, q, J, X, me)
        }
        te != null && N && setRef(te, F && F.ref, U, I || F, !I)
      },
      _ = (F, I, O, z) => {
        if (F == null) i((I.el = l(I.children)), O, z)
        else {
          const N = (I.el = F.el)
          I.children !== F.children && f(N, I.children)
        }
      },
      m = (F, I, O, z) => {
        F == null ? i((I.el = o(I.children || '')), O, z) : (I.el = F.el)
      },
      A = (F, I, O, z) => {
        ;[F.el, F.anchor] = x(F.children, I, O, z, F.el, F.anchor)
      },
      d = ({ el: F, anchor: I }, O, z) => {
        let N
        for (; F && F !== I; ) (N = c(F)), i(F, O, z), (F = N)
        i(I, O, z)
      },
      g = ({ el: F, anchor: I }) => {
        let O
        for (; F && F !== I; ) (O = c(F)), n(F), (F = O)
        n(I)
      },
      C = (F, I, O, z, N, U, q, J, X) => {
        ;(q = q || I.type === 'svg'), F == null ? P(I, O, z, N, U, q, J, X) : D(F, I, N, U, q, J, X)
      },
      P = (F, I, O, z, N, U, q, J) => {
        let X, G
        const { type: te, props: Q, shapeFlag: ee, transition: ie, dirs: se } = F
        if (
          ((X = F.el = a(F.type, U, Q && Q.is, Q)),
          ee & 8
            ? u(X, F.children)
            : ee & 16 && M(F.children, X, null, z, N, U && te !== 'foreignObject', q, J),
          se && invokeDirectiveHook(F, null, z, 'created'),
          k(X, F, F.scopeId, q, z),
          Q)
        ) {
          for (const he in Q)
            he !== 'value' && !isReservedProp(he) && s(X, he, null, Q[he], U, F.children, z, N, ae)
          'value' in Q && s(X, 'value', null, Q.value),
            (G = Q.onVnodeBeforeMount) && invokeVNodeHook(G, z, F)
        }
        se && invokeDirectiveHook(F, null, z, 'beforeMount')
        const le = needTransition(N, ie)
        le && ie.beforeEnter(X),
          i(X, I, O),
          ((G = Q && Q.onVnodeMounted) || le || se) &&
            queuePostRenderEffect(() => {
              G && invokeVNodeHook(G, z, F),
                le && ie.enter(X),
                se && invokeDirectiveHook(F, null, z, 'mounted')
            }, N)
      },
      k = (F, I, O, z, N) => {
        if ((O && b(F, O), z)) for (let U = 0; U < z.length; U++) b(F, z[U])
        if (N) {
          let U = N.subTree
          if (I === U) {
            const q = N.vnode
            k(F, q, q.scopeId, q.slotScopeIds, N.parent)
          }
        }
      },
      M = (F, I, O, z, N, U, q, J, X = 0) => {
        for (let G = X; G < F.length; G++) {
          const te = (F[G] = J ? cloneIfMounted(F[G]) : normalizeVNode(F[G]))
          y(null, te, I, O, z, N, U, q, J)
        }
      },
      D = (F, I, O, z, N, U, q) => {
        const J = (I.el = F.el)
        let { patchFlag: X, dynamicChildren: G, dirs: te } = I
        X |= F.patchFlag & 16
        const Q = F.props || EMPTY_OBJ,
          ee = I.props || EMPTY_OBJ
        let ie
        O && toggleRecurse(O, !1),
          (ie = ee.onVnodeBeforeUpdate) && invokeVNodeHook(ie, O, I, F),
          te && invokeDirectiveHook(I, F, O, 'beforeUpdate'),
          O && toggleRecurse(O, !0)
        const se = N && I.type !== 'foreignObject'
        if (
          (G ? W(F.dynamicChildren, G, J, O, z, se, U) : q || j(F, I, J, null, O, z, se, U, !1),
          X > 0)
        ) {
          if (X & 16) H(J, I, Q, ee, O, z, N)
          else if (
            (X & 2 && Q.class !== ee.class && s(J, 'class', null, ee.class, N),
            X & 4 && s(J, 'style', Q.style, ee.style, N),
            X & 8)
          ) {
            const le = I.dynamicProps
            for (let he = 0; he < le.length; he++) {
              const fe = le[he],
                ye = Q[fe],
                Ae = ee[fe]
              ;(Ae !== ye || fe === 'value') && s(J, fe, ye, Ae, N, F.children, O, z, ae)
            }
          }
          X & 1 && F.children !== I.children && u(J, I.children)
        } else !q && G == null && H(J, I, Q, ee, O, z, N)
        ;((ie = ee.onVnodeUpdated) || te) &&
          queuePostRenderEffect(() => {
            ie && invokeVNodeHook(ie, O, I, F), te && invokeDirectiveHook(I, F, O, 'updated')
          }, z)
      },
      W = (F, I, O, z, N, U, q) => {
        for (let J = 0; J < I.length; J++) {
          const X = F[J],
            G = I[J],
            te =
              X.el && (X.type === Fragment || !isSameVNodeType(X, G) || X.shapeFlag & 70)
                ? E(X.el)
                : O
          y(X, G, te, null, z, N, U, q, !0)
        }
      },
      H = (F, I, O, z, N, U, q) => {
        if (O !== z) {
          if (O !== EMPTY_OBJ)
            for (const J in O)
              !isReservedProp(J) && !(J in z) && s(F, J, O[J], null, q, I.children, N, U, ae)
          for (const J in z) {
            if (isReservedProp(J)) continue
            const X = z[J],
              G = O[J]
            X !== G && J !== 'value' && s(F, J, G, X, q, I.children, N, U, ae)
          }
          'value' in z && s(F, 'value', O.value, z.value)
        }
      },
      $ = (F, I, O, z, N, U, q, J, X) => {
        const G = (I.el = F ? F.el : l('')),
          te = (I.anchor = F ? F.anchor : l(''))
        let { patchFlag: Q, dynamicChildren: ee, slotScopeIds: ie } = I
        ie && (J = J ? J.concat(ie) : ie),
          F == null
            ? (i(G, O, z), i(te, O, z), M(I.children, O, te, N, U, q, J, X))
            : Q > 0 && Q & 64 && ee && F.dynamicChildren
              ? (W(F.dynamicChildren, ee, O, N, U, q, J),
                (I.key != null || (N && I === N.subTree)) && traverseStaticChildren(F, I, !0))
              : j(F, I, O, te, N, U, q, J, X)
      },
      Z = (F, I, O, z, N, U, q, J, X) => {
        ;(I.slotScopeIds = J),
          F == null
            ? I.shapeFlag & 512
              ? N.ctx.activate(I, O, z, q, X)
              : Y(I, O, z, N, U, q, X)
            : L(F, I, X)
      },
      Y = (F, I, O, z, N, U, q) => {
        const J = (F.component = createComponentInstance(F, z, N))
        if ((isKeepAlive(F) && (J.ctx.renderer = me), setupComponent(J), J.asyncDep)) {
          if ((N && N.registerDep(J, B), !F.el)) {
            const X = (J.subTree = createVNode(Comment))
            m(null, X, I, O)
          }
          return
        }
        B(J, F, I, O, N, U, q)
      },
      L = (F, I, O) => {
        const z = (I.component = F.component)
        if (shouldUpdateComponent(F, I, O))
          if (z.asyncDep && !z.asyncResolved) {
            T(z, I, O)
            return
          } else (z.next = I), invalidateJob(z.update), z.update()
        else (I.el = F.el), (z.vnode = I)
      },
      B = (F, I, O, z, N, U, q) => {
        const J = () => {
            if (F.isMounted) {
              let { next: te, bu: Q, u: ee, parent: ie, vnode: se } = F,
                le = te,
                he
              toggleRecurse(F, !1),
                te ? ((te.el = se.el), T(F, te, q)) : (te = se),
                Q && invokeArrayFns(Q),
                (he = te.props && te.props.onVnodeBeforeUpdate) && invokeVNodeHook(he, ie, te, se),
                toggleRecurse(F, !0)
              const fe = renderComponentRoot(F),
                ye = F.subTree
              ;(F.subTree = fe),
                y(ye, fe, E(ye.el), ce(ye), F, N, U),
                (te.el = fe.el),
                le === null && updateHOCHostEl(F, fe.el),
                ee && queuePostRenderEffect(ee, N),
                (he = te.props && te.props.onVnodeUpdated) &&
                  queuePostRenderEffect(() => invokeVNodeHook(he, ie, te, se), N)
            } else {
              let te
              const { el: Q, props: ee } = I,
                { bm: ie, m: se, parent: le } = F,
                he = isAsyncWrapper(I)
              if (
                (toggleRecurse(F, !1),
                ie && invokeArrayFns(ie),
                !he && (te = ee && ee.onVnodeBeforeMount) && invokeVNodeHook(te, le, I),
                toggleRecurse(F, !0),
                Q && pe)
              ) {
                const fe = () => {
                  ;(F.subTree = renderComponentRoot(F)), pe(Q, F.subTree, F, N, null)
                }
                he ? I.type.__asyncLoader().then(() => !F.isUnmounted && fe()) : fe()
              } else {
                const fe = (F.subTree = renderComponentRoot(F))
                y(null, fe, O, z, F, N, U), (I.el = fe.el)
              }
              if ((se && queuePostRenderEffect(se, N), !he && (te = ee && ee.onVnodeMounted))) {
                const fe = I
                queuePostRenderEffect(() => invokeVNodeHook(te, le, fe), N)
              }
              ;(I.shapeFlag & 256 ||
                (le && isAsyncWrapper(le.vnode) && le.vnode.shapeFlag & 256)) &&
                F.a &&
                queuePostRenderEffect(F.a, N),
                (F.isMounted = !0),
                (I = O = z = null)
            }
          },
          X = (F.effect = new ReactiveEffect(J, () => queueJob(G), F.scope)),
          G = (F.update = () => X.run())
        ;(G.id = F.uid), toggleRecurse(F, !0), G()
      },
      T = (F, I, O) => {
        I.component = F
        const z = F.vnode.props
        ;(F.vnode = I),
          (F.next = null),
          updateProps(F, I.props, z, O),
          updateSlots(F, I.children, O),
          pauseTracking(),
          flushPreFlushCbs(F),
          resetTracking()
      },
      j = (F, I, O, z, N, U, q, J, X = !1) => {
        const G = F && F.children,
          te = F ? F.shapeFlag : 0,
          Q = I.children,
          { patchFlag: ee, shapeFlag: ie } = I
        if (ee > 0) {
          if (ee & 128) {
            R(G, Q, O, z, N, U, q, J, X)
            return
          } else if (ee & 256) {
            S(G, Q, O, z, N, U, q, J, X)
            return
          }
        }
        ie & 8
          ? (te & 16 && ae(G, N, U), Q !== G && u(O, Q))
          : te & 16
            ? ie & 16
              ? R(G, Q, O, z, N, U, q, J, X)
              : ae(G, N, U, !0)
            : (te & 8 && u(O, ''), ie & 16 && M(Q, O, z, N, U, q, J, X))
      },
      S = (F, I, O, z, N, U, q, J, X) => {
        ;(F = F || EMPTY_ARR), (I = I || EMPTY_ARR)
        const G = F.length,
          te = I.length,
          Q = Math.min(G, te)
        let ee
        for (ee = 0; ee < Q; ee++) {
          const ie = (I[ee] = X ? cloneIfMounted(I[ee]) : normalizeVNode(I[ee]))
          y(F[ee], ie, O, null, N, U, q, J, X)
        }
        G > te ? ae(F, N, U, !0, !1, Q) : M(I, O, z, N, U, q, J, X, Q)
      },
      R = (F, I, O, z, N, U, q, J, X) => {
        let G = 0
        const te = I.length
        let Q = F.length - 1,
          ee = te - 1
        for (; G <= Q && G <= ee; ) {
          const ie = F[G],
            se = (I[G] = X ? cloneIfMounted(I[G]) : normalizeVNode(I[G]))
          if (isSameVNodeType(ie, se)) y(ie, se, O, null, N, U, q, J, X)
          else break
          G++
        }
        for (; G <= Q && G <= ee; ) {
          const ie = F[Q],
            se = (I[ee] = X ? cloneIfMounted(I[ee]) : normalizeVNode(I[ee]))
          if (isSameVNodeType(ie, se)) y(ie, se, O, null, N, U, q, J, X)
          else break
          Q--, ee--
        }
        if (G > Q) {
          if (G <= ee) {
            const ie = ee + 1,
              se = ie < te ? I[ie].el : z
            for (; G <= ee; )
              y(
                null,
                (I[G] = X ? cloneIfMounted(I[G]) : normalizeVNode(I[G])),
                O,
                se,
                N,
                U,
                q,
                J,
                X
              ),
                G++
          }
        } else if (G > ee) for (; G <= Q; ) K(F[G], N, U, !0), G++
        else {
          const ie = G,
            se = G,
            le = new Map()
          for (G = se; G <= ee; G++) {
            const ge = (I[G] = X ? cloneIfMounted(I[G]) : normalizeVNode(I[G]))
            ge.key != null && le.set(ge.key, G)
          }
          let he,
            fe = 0
          const ye = ee - se + 1
          let Ae = !1,
            je = 0
          const xe = new Array(ye)
          for (G = 0; G < ye; G++) xe[G] = 0
          for (G = ie; G <= Q; G++) {
            const ge = F[G]
            if (fe >= ye) {
              K(ge, N, U, !0)
              continue
            }
            let ve
            if (ge.key != null) ve = le.get(ge.key)
            else
              for (he = se; he <= ee; he++)
                if (xe[he - se] === 0 && isSameVNodeType(ge, I[he])) {
                  ve = he
                  break
                }
            ve === void 0
              ? K(ge, N, U, !0)
              : ((xe[ve - se] = G + 1),
                ve >= je ? (je = ve) : (Ae = !0),
                y(ge, I[ve], O, null, N, U, q, J, X),
                fe++)
          }
          const be = Ae ? getSequence(xe) : EMPTY_ARR
          for (he = be.length - 1, G = ye - 1; G >= 0; G--) {
            const ge = se + G,
              ve = I[ge],
              Ee = ge + 1 < te ? I[ge + 1].el : z
            xe[G] === 0
              ? y(null, ve, O, Ee, N, U, q, J, X)
              : Ae && (he < 0 || G !== be[he] ? V(ve, O, Ee, 2) : he--)
          }
        }
      },
      V = (F, I, O, z, N = null) => {
        const { el: U, type: q, transition: J, children: X, shapeFlag: G } = F
        if (G & 6) {
          V(F.component.subTree, I, O, z)
          return
        }
        if (G & 128) {
          F.suspense.move(I, O, z)
          return
        }
        if (G & 64) {
          q.move(F, I, O, me)
          return
        }
        if (q === Fragment) {
          i(U, I, O)
          for (let Q = 0; Q < X.length; Q++) V(X[Q], I, O, z)
          i(F.anchor, I, O)
          return
        }
        if (q === Static) {
          d(F, I, O)
          return
        }
        if (z !== 2 && G & 1 && J)
          if (z === 0) J.beforeEnter(U), i(U, I, O), queuePostRenderEffect(() => J.enter(U), N)
          else {
            const { leave: Q, delayLeave: ee, afterLeave: ie } = J,
              se = () => i(U, I, O),
              le = () => {
                Q(U, () => {
                  se(), ie && ie()
                })
              }
            ee ? ee(U, se, le) : le()
          }
        else i(U, I, O)
      },
      K = (F, I, O, z = !1, N = !1) => {
        const {
          type: U,
          props: q,
          ref: J,
          children: X,
          dynamicChildren: G,
          shapeFlag: te,
          patchFlag: Q,
          dirs: ee
        } = F
        if ((J != null && setRef(J, null, O, F, !0), te & 256)) {
          I.ctx.deactivate(F)
          return
        }
        const ie = te & 1 && ee,
          se = !isAsyncWrapper(F)
        let le
        if ((se && (le = q && q.onVnodeBeforeUnmount) && invokeVNodeHook(le, I, F), te & 6))
          oe(F.component, O, z)
        else {
          if (te & 128) {
            F.suspense.unmount(O, z)
            return
          }
          ie && invokeDirectiveHook(F, null, I, 'beforeUnmount'),
            te & 64
              ? F.type.remove(F, I, O, N, me, z)
              : G && (U !== Fragment || (Q > 0 && Q & 64))
                ? ae(G, I, O, !1, !0)
                : ((U === Fragment && Q & 384) || (!N && te & 16)) && ae(X, I, O),
            z && re(F)
        }
        ;((se && (le = q && q.onVnodeUnmounted)) || ie) &&
          queuePostRenderEffect(() => {
            le && invokeVNodeHook(le, I, F), ie && invokeDirectiveHook(F, null, I, 'unmounted')
          }, O)
      },
      re = (F) => {
        const { type: I, el: O, anchor: z, transition: N } = F
        if (I === Fragment) {
          ne(O, z)
          return
        }
        if (I === Static) {
          g(F)
          return
        }
        const U = () => {
          n(O), N && !N.persisted && N.afterLeave && N.afterLeave()
        }
        if (F.shapeFlag & 1 && N && !N.persisted) {
          const { leave: q, delayLeave: J } = N,
            X = () => q(O, U)
          J ? J(F.el, U, X) : X()
        } else U()
      },
      ne = (F, I) => {
        let O
        for (; F !== I; ) (O = c(F)), n(F), (F = O)
        n(I)
      },
      oe = (F, I, O) => {
        const { bum: z, scope: N, update: U, subTree: q, um: J } = F
        z && invokeArrayFns(z),
          N.stop(),
          U && ((U.active = !1), K(q, F, I, O)),
          J && queuePostRenderEffect(J, I),
          queuePostRenderEffect(() => {
            F.isUnmounted = !0
          }, I),
          I &&
            I.pendingBranch &&
            !I.isUnmounted &&
            F.asyncDep &&
            !F.asyncResolved &&
            F.suspenseId === I.pendingId &&
            (I.deps--, I.deps === 0 && I.resolve())
      },
      ae = (F, I, O, z = !1, N = !1, U = 0) => {
        for (let q = U; q < F.length; q++) K(F[q], I, O, z, N)
      },
      ce = (F) =>
        F.shapeFlag & 6
          ? ce(F.component.subTree)
          : F.shapeFlag & 128
            ? F.suspense.next()
            : c(F.anchor || F.el),
      de = (F, I, O) => {
        F == null
          ? I._vnode && K(I._vnode, null, null, !0)
          : y(I._vnode || null, F, I, null, null, null, O),
          flushPreFlushCbs(),
          flushPostFlushCbs(),
          (I._vnode = F)
      },
      me = { p: y, um: K, m: V, r: re, mt: Y, mc: M, pc: j, pbc: W, n: ce, o: e }
    let ue, pe
    return t && ([ue, pe] = t(me)), { render: de, hydrate: ue, createApp: createAppAPI(de, ue) }
  }
  function toggleRecurse({ effect: e, update: t }, r) {
    e.allowRecurse = t.allowRecurse = r
  }
  function needTransition(e, t) {
    return (!e || (e && !e.pendingBranch)) && t && !t.persisted
  }
  function traverseStaticChildren(e, t, r = !1) {
    const i = e.children,
      n = t.children
    if (isArray$2(i) && isArray$2(n))
      for (let s = 0; s < i.length; s++) {
        const a = i[s]
        let l = n[s]
        l.shapeFlag & 1 &&
          !l.dynamicChildren &&
          ((l.patchFlag <= 0 || l.patchFlag === 32) &&
            ((l = n[s] = cloneIfMounted(n[s])), (l.el = a.el)),
          r || traverseStaticChildren(a, l)),
          l.type === Text && (l.el = a.el)
      }
  }
  function getSequence(e) {
    const t = e.slice(),
      r = [0]
    let i, n, s, a, l
    const o = e.length
    for (i = 0; i < o; i++) {
      const f = e[i]
      if (f !== 0) {
        if (((n = r[r.length - 1]), e[n] < f)) {
          ;(t[i] = n), r.push(i)
          continue
        }
        for (s = 0, a = r.length - 1; s < a; )
          (l = (s + a) >> 1), e[r[l]] < f ? (s = l + 1) : (a = l)
        f < e[r[s]] && (s > 0 && (t[i] = r[s - 1]), (r[s] = i))
      }
    }
    for (s = r.length, a = r[s - 1]; s-- > 0; ) (r[s] = a), (a = t[a])
    return r
  }
  const isTeleport = (e) => e.__isTeleport,
    Fragment = Symbol.for('v-fgt'),
    Text = Symbol.for('v-txt'),
    Comment = Symbol.for('v-cmt'),
    Static = Symbol.for('v-stc'),
    blockStack = []
  let currentBlock = null
  function openBlock(e = !1) {
    blockStack.push((currentBlock = e ? null : []))
  }
  function closeBlock() {
    blockStack.pop(), (currentBlock = blockStack[blockStack.length - 1] || null)
  }
  let isBlockTreeEnabled = 1
  function setBlockTracking(e) {
    isBlockTreeEnabled += e
  }
  function setupBlock(e) {
    return (
      (e.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null),
      closeBlock(),
      isBlockTreeEnabled > 0 && currentBlock && currentBlock.push(e),
      e
    )
  }
  function createElementBlock(e, t, r, i, n, s) {
    return setupBlock(createBaseVNode(e, t, r, i, n, s, !0))
  }
  function isVNode(e) {
    return e ? e.__v_isVNode === !0 : !1
  }
  function isSameVNodeType(e, t) {
    return e.type === t.type && e.key === t.key
  }
  const InternalObjectKey = '__vInternal',
    normalizeKey = ({ key: e }) => e ?? null,
    normalizeRef = ({ ref: e, ref_key: t, ref_for: r }) => (
      typeof e == 'number' && (e = '' + e),
      e != null
        ? isString(e) || isRef(e) || isFunction$1(e)
          ? { i: currentRenderingInstance, r: e, k: t, f: !!r }
          : e
        : null
    )
  function createBaseVNode(
    e,
    t = null,
    r = null,
    i = 0,
    n = null,
    s = e === Fragment ? 0 : 1,
    a = !1,
    l = !1
  ) {
    const o = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e,
      props: t,
      key: t && normalizeKey(t),
      ref: t && normalizeRef(t),
      scopeId: currentScopeId,
      slotScopeIds: null,
      children: r,
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
      shapeFlag: s,
      patchFlag: i,
      dynamicProps: n,
      dynamicChildren: null,
      appContext: null,
      ctx: currentRenderingInstance
    }
    return (
      l
        ? (normalizeChildren(o, r), s & 128 && e.normalize(o))
        : r && (o.shapeFlag |= isString(r) ? 8 : 16),
      isBlockTreeEnabled > 0 &&
        !a &&
        currentBlock &&
        (o.patchFlag > 0 || s & 6) &&
        o.patchFlag !== 32 &&
        currentBlock.push(o),
      o
    )
  }
  const createVNode = _createVNode
  function _createVNode(e, t = null, r = null, i = 0, n = null, s = !1) {
    if (((!e || e === NULL_DYNAMIC_COMPONENT) && (e = Comment), isVNode(e))) {
      const l = cloneVNode(e, t, !0)
      return (
        r && normalizeChildren(l, r),
        isBlockTreeEnabled > 0 &&
          !s &&
          currentBlock &&
          (l.shapeFlag & 6 ? (currentBlock[currentBlock.indexOf(e)] = l) : currentBlock.push(l)),
        (l.patchFlag |= -2),
        l
      )
    }
    if ((isClassComponent(e) && (e = e.__vccOpts), t)) {
      t = guardReactiveProps(t)
      let { class: l, style: o } = t
      l && !isString(l) && (t.class = normalizeClass(l)),
        isObject$2(o) &&
          (isProxy(o) && !isArray$2(o) && (o = extend({}, o)), (t.style = normalizeStyle(o)))
    }
    const a = isString(e)
      ? 1
      : isSuspense(e)
        ? 128
        : isTeleport(e)
          ? 64
          : isObject$2(e)
            ? 4
            : isFunction$1(e)
              ? 2
              : 0
    return createBaseVNode(e, t, r, i, n, a, s, !0)
  }
  function guardReactiveProps(e) {
    return e ? (isProxy(e) || InternalObjectKey in e ? extend({}, e) : e) : null
  }
  function cloneVNode(e, t, r = !1) {
    const { props: i, ref: n, patchFlag: s, children: a } = e,
      l = t ? mergeProps(i || {}, t) : i
    return {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e.type,
      props: l,
      key: l && normalizeKey(l),
      ref:
        t && t.ref
          ? r && n
            ? isArray$2(n)
              ? n.concat(normalizeRef(t))
              : [n, normalizeRef(t)]
            : normalizeRef(t)
          : n,
      scopeId: e.scopeId,
      slotScopeIds: e.slotScopeIds,
      children: a,
      target: e.target,
      targetAnchor: e.targetAnchor,
      staticCount: e.staticCount,
      shapeFlag: e.shapeFlag,
      patchFlag: t && e.type !== Fragment ? (s === -1 ? 16 : s | 16) : s,
      dynamicProps: e.dynamicProps,
      dynamicChildren: e.dynamicChildren,
      appContext: e.appContext,
      dirs: e.dirs,
      transition: e.transition,
      component: e.component,
      suspense: e.suspense,
      ssContent: e.ssContent && cloneVNode(e.ssContent),
      ssFallback: e.ssFallback && cloneVNode(e.ssFallback),
      el: e.el,
      anchor: e.anchor,
      ctx: e.ctx,
      ce: e.ce
    }
  }
  function createTextVNode(e = ' ', t = 0) {
    return createVNode(Text, null, e, t)
  }
  function normalizeVNode(e) {
    return e == null || typeof e == 'boolean'
      ? createVNode(Comment)
      : isArray$2(e)
        ? createVNode(Fragment, null, e.slice())
        : typeof e == 'object'
          ? cloneIfMounted(e)
          : createVNode(Text, null, String(e))
  }
  function cloneIfMounted(e) {
    return (e.el === null && e.patchFlag !== -1) || e.memo ? e : cloneVNode(e)
  }
  function normalizeChildren(e, t) {
    let r = 0
    const { shapeFlag: i } = e
    if (t == null) t = null
    else if (isArray$2(t)) r = 16
    else if (typeof t == 'object')
      if (i & 65) {
        const n = t.default
        n && (n._c && (n._d = !1), normalizeChildren(e, n()), n._c && (n._d = !0))
        return
      } else {
        r = 32
        const n = t._
        !n && !(InternalObjectKey in t)
          ? (t._ctx = currentRenderingInstance)
          : n === 3 &&
            currentRenderingInstance &&
            (currentRenderingInstance.slots._ === 1
              ? (t._ = 1)
              : ((t._ = 2), (e.patchFlag |= 1024)))
      }
    else
      isFunction$1(t)
        ? ((t = { default: t, _ctx: currentRenderingInstance }), (r = 32))
        : ((t = String(t)), i & 64 ? ((r = 16), (t = [createTextVNode(t)])) : (r = 8))
    ;(e.children = t), (e.shapeFlag |= r)
  }
  function mergeProps(...e) {
    const t = {}
    for (let r = 0; r < e.length; r++) {
      const i = e[r]
      for (const n in i)
        if (n === 'class') t.class !== i.class && (t.class = normalizeClass([t.class, i.class]))
        else if (n === 'style') t.style = normalizeStyle([t.style, i.style])
        else if (isOn(n)) {
          const s = t[n],
            a = i[n]
          a && s !== a && !(isArray$2(s) && s.includes(a)) && (t[n] = s ? [].concat(s, a) : a)
        } else n !== '' && (t[n] = i[n])
    }
    return t
  }
  function invokeVNodeHook(e, t, r, i = null) {
    callWithAsyncErrorHandling(e, t, 7, [r, i])
  }
  const emptyAppContext = createAppContext()
  let uid = 0
  function createComponentInstance(e, t, r) {
    const i = e.type,
      n = (t ? t.appContext : e.appContext) || emptyAppContext,
      s = {
        uid: uid++,
        vnode: e,
        type: i,
        parent: t,
        appContext: n,
        root: null,
        next: null,
        subTree: null,
        effect: null,
        update: null,
        scope: new EffectScope(!0),
        render: null,
        proxy: null,
        exposed: null,
        exposeProxy: null,
        withProxy: null,
        provides: t ? t.provides : Object.create(n.provides),
        accessCache: null,
        renderCache: [],
        components: null,
        directives: null,
        propsOptions: normalizePropsOptions(i, n),
        emitsOptions: normalizeEmitsOptions(i, n),
        emit: null,
        emitted: null,
        propsDefaults: EMPTY_OBJ,
        inheritAttrs: i.inheritAttrs,
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
        suspense: r,
        suspenseId: r ? r.pendingId : 0,
        asyncDep: null,
        asyncResolved: !1,
        isMounted: !1,
        isUnmounted: !1,
        isDeactivated: !1,
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
      }
    return (
      (s.ctx = { _: s }),
      (s.root = t ? t.root : s),
      (s.emit = emit.bind(null, s)),
      e.ce && e.ce(s),
      s
    )
  }
  let currentInstance = null
  const getCurrentInstance = () => currentInstance || currentRenderingInstance
  let internalSetCurrentInstance,
    globalCurrentInstanceSetters,
    settersKey = '__VUE_INSTANCE_SETTERS__'
  ;(globalCurrentInstanceSetters = getGlobalThis()[settersKey]) ||
    (globalCurrentInstanceSetters = getGlobalThis()[settersKey] = []),
    globalCurrentInstanceSetters.push((e) => (currentInstance = e)),
    (internalSetCurrentInstance = (e) => {
      globalCurrentInstanceSetters.length > 1
        ? globalCurrentInstanceSetters.forEach((t) => t(e))
        : globalCurrentInstanceSetters[0](e)
    })
  const setCurrentInstance = (e) => {
      internalSetCurrentInstance(e), e.scope.on()
    },
    unsetCurrentInstance = () => {
      currentInstance && currentInstance.scope.off(), internalSetCurrentInstance(null)
    }
  function isStatefulComponent(e) {
    return e.vnode.shapeFlag & 4
  }
  let isInSSRComponentSetup = !1
  function setupComponent(e, t = !1) {
    isInSSRComponentSetup = t
    const { props: r, children: i } = e.vnode,
      n = isStatefulComponent(e)
    initProps(e, r, n, t), initSlots(e, i)
    const s = n ? setupStatefulComponent(e, t) : void 0
    return (isInSSRComponentSetup = !1), s
  }
  function setupStatefulComponent(e, t) {
    const r = e.type
    ;(e.accessCache = Object.create(null)),
      (e.proxy = markRaw(new Proxy(e.ctx, PublicInstanceProxyHandlers)))
    const { setup: i } = r
    if (i) {
      const n = (e.setupContext = i.length > 1 ? createSetupContext(e) : null)
      setCurrentInstance(e), pauseTracking()
      const s = callWithErrorHandling(i, e, 0, [e.props, n])
      if ((resetTracking(), unsetCurrentInstance(), isPromise(s))) {
        if ((s.then(unsetCurrentInstance, unsetCurrentInstance), t))
          return s
            .then((a) => {
              handleSetupResult(e, a, t)
            })
            .catch((a) => {
              handleError(a, e, 0)
            })
        e.asyncDep = s
      } else handleSetupResult(e, s, t)
    } else finishComponentSetup(e, t)
  }
  function handleSetupResult(e, t, r) {
    isFunction$1(t)
      ? e.type.__ssrInlineRender
        ? (e.ssrRender = t)
        : (e.render = t)
      : isObject$2(t) && (e.setupState = proxyRefs(t)),
      finishComponentSetup(e, r)
  }
  let compile
  function finishComponentSetup(e, t, r) {
    const i = e.type
    if (!e.render) {
      if (!t && compile && !i.render) {
        const n = i.template || resolveMergedOptions(e).template
        if (n) {
          const { isCustomElement: s, compilerOptions: a } = e.appContext.config,
            { delimiters: l, compilerOptions: o } = i,
            f = extend(extend({ isCustomElement: s, delimiters: l }, a), o)
          i.render = compile(n, f)
        }
      }
      e.render = i.render || NOOP
    }
    {
      setCurrentInstance(e), pauseTracking()
      try {
        applyOptions(e)
      } finally {
        resetTracking(), unsetCurrentInstance()
      }
    }
  }
  function getAttrsProxy(e) {
    return (
      e.attrsProxy ||
      (e.attrsProxy = new Proxy(e.attrs, {
        get(t, r) {
          return track(e, 'get', '$attrs'), t[r]
        }
      }))
    )
  }
  function createSetupContext(e) {
    const t = (r) => {
      e.exposed = r || {}
    }
    return {
      get attrs() {
        return getAttrsProxy(e)
      },
      slots: e.slots,
      emit: e.emit,
      expose: t
    }
  }
  function getExposeProxy(e) {
    if (e.exposed)
      return (
        e.exposeProxy ||
        (e.exposeProxy = new Proxy(proxyRefs(markRaw(e.exposed)), {
          get(t, r) {
            if (r in t) return t[r]
            if (r in publicPropertiesMap) return publicPropertiesMap[r](e)
          },
          has(t, r) {
            return r in t || r in publicPropertiesMap
          }
        }))
      )
  }
  function getComponentName(e, t = !0) {
    return isFunction$1(e) ? e.displayName || e.name : e.name || (t && e.__name)
  }
  function isClassComponent(e) {
    return isFunction$1(e) && '__vccOpts' in e
  }
  const computed = (e, t) => computed$1(e, t, isInSSRComponentSetup),
    ssrContextKey = Symbol.for('v-scx'),
    useSSRContext = () => inject(ssrContextKey),
    version = '3.3.13',
    svgNS = 'http://www.w3.org/2000/svg',
    doc = typeof document < 'u' ? document : null,
    templateContainer = doc && doc.createElement('template'),
    nodeOps = {
      insert: (e, t, r) => {
        t.insertBefore(e, r || null)
      },
      remove: (e) => {
        const t = e.parentNode
        t && t.removeChild(e)
      },
      createElement: (e, t, r, i) => {
        const n = t ? doc.createElementNS(svgNS, e) : doc.createElement(e, r ? { is: r } : void 0)
        return (
          e === 'select' && i && i.multiple != null && n.setAttribute('multiple', i.multiple), n
        )
      },
      createText: (e) => doc.createTextNode(e),
      createComment: (e) => doc.createComment(e),
      setText: (e, t) => {
        e.nodeValue = t
      },
      setElementText: (e, t) => {
        e.textContent = t
      },
      parentNode: (e) => e.parentNode,
      nextSibling: (e) => e.nextSibling,
      querySelector: (e) => doc.querySelector(e),
      setScopeId(e, t) {
        e.setAttribute(t, '')
      },
      insertStaticContent(e, t, r, i, n, s) {
        const a = r ? r.previousSibling : t.lastChild
        if (n && (n === s || n.nextSibling))
          for (; t.insertBefore(n.cloneNode(!0), r), !(n === s || !(n = n.nextSibling)); );
        else {
          templateContainer.innerHTML = i ? `<svg>${e}</svg>` : e
          const l = templateContainer.content
          if (i) {
            const o = l.firstChild
            for (; o.firstChild; ) l.appendChild(o.firstChild)
            l.removeChild(o)
          }
          t.insertBefore(l, r)
        }
        return [a ? a.nextSibling : t.firstChild, r ? r.previousSibling : t.lastChild]
      }
    },
    vtcKey = Symbol('_vtc')
  function patchClass(e, t, r) {
    const i = e[vtcKey]
    i && (t = (t ? [t, ...i] : [...i]).join(' ')),
      t == null ? e.removeAttribute('class') : r ? e.setAttribute('class', t) : (e.className = t)
  }
  const vShowOldKey = Symbol('_vod'),
    CSS_VAR_TEXT = Symbol('')
  function patchStyle(e, t, r) {
    const i = e.style,
      n = isString(r)
    if (r && !n) {
      if (t && !isString(t)) for (const s in t) r[s] == null && setStyle(i, s, '')
      for (const s in r) setStyle(i, s, r[s])
    } else {
      const s = i.display
      if (n) {
        if (t !== r) {
          const a = i[CSS_VAR_TEXT]
          a && (r += ';' + a), (i.cssText = r)
        }
      } else t && e.removeAttribute('style')
      vShowOldKey in e && (i.display = s)
    }
  }
  const importantRE = /\s*!important$/
  function setStyle(e, t, r) {
    if (isArray$2(r)) r.forEach((i) => setStyle(e, t, i))
    else if ((r == null && (r = ''), t.startsWith('--'))) e.setProperty(t, r)
    else {
      const i = autoPrefix(e, t)
      importantRE.test(r)
        ? e.setProperty(hyphenate(i), r.replace(importantRE, ''), 'important')
        : (e[i] = r)
    }
  }
  const prefixes = ['Webkit', 'Moz', 'ms'],
    prefixCache = {}
  function autoPrefix(e, t) {
    const r = prefixCache[t]
    if (r) return r
    let i = camelize(t)
    if (i !== 'filter' && i in e) return (prefixCache[t] = i)
    i = capitalize(i)
    for (let n = 0; n < prefixes.length; n++) {
      const s = prefixes[n] + i
      if (s in e) return (prefixCache[t] = s)
    }
    return t
  }
  const xlinkNS = 'http://www.w3.org/1999/xlink'
  function patchAttr(e, t, r, i, n) {
    if (i && t.startsWith('xlink:'))
      r == null
        ? e.removeAttributeNS(xlinkNS, t.slice(6, t.length))
        : e.setAttributeNS(xlinkNS, t, r)
    else {
      const s = isSpecialBooleanAttr(t)
      r == null || (s && !includeBooleanAttr(r))
        ? e.removeAttribute(t)
        : e.setAttribute(t, s ? '' : r)
    }
  }
  function patchDOMProp(e, t, r, i, n, s, a) {
    if (t === 'innerHTML' || t === 'textContent') {
      i && a(i, n, s), (e[t] = r ?? '')
      return
    }
    const l = e.tagName
    if (t === 'value' && l !== 'PROGRESS' && !l.includes('-')) {
      e._value = r
      const f = l === 'OPTION' ? e.getAttribute('value') : e.value,
        u = r ?? ''
      f !== u && (e.value = u), r == null && e.removeAttribute(t)
      return
    }
    let o = !1
    if (r === '' || r == null) {
      const f = typeof e[t]
      f === 'boolean'
        ? (r = includeBooleanAttr(r))
        : r == null && f === 'string'
          ? ((r = ''), (o = !0))
          : f === 'number' && ((r = 0), (o = !0))
    }
    try {
      e[t] = r
    } catch {}
    o && e.removeAttribute(t)
  }
  function addEventListener(e, t, r, i) {
    e.addEventListener(t, r, i)
  }
  function removeEventListener(e, t, r, i) {
    e.removeEventListener(t, r, i)
  }
  const veiKey = Symbol('_vei')
  function patchEvent(e, t, r, i, n = null) {
    const s = e[veiKey] || (e[veiKey] = {}),
      a = s[t]
    if (i && a) a.value = i
    else {
      const [l, o] = parseName(t)
      if (i) {
        const f = (s[t] = createInvoker(i, n))
        addEventListener(e, l, f, o)
      } else a && (removeEventListener(e, l, a, o), (s[t] = void 0))
    }
  }
  const optionsModifierRE = /(?:Once|Passive|Capture)$/
  function parseName(e) {
    let t
    if (optionsModifierRE.test(e)) {
      t = {}
      let i
      for (; (i = e.match(optionsModifierRE)); )
        (e = e.slice(0, e.length - i[0].length)), (t[i[0].toLowerCase()] = !0)
    }
    return [e[2] === ':' ? e.slice(3) : hyphenate(e.slice(2)), t]
  }
  let cachedNow = 0
  const p = Promise.resolve(),
    getNow = () => cachedNow || (p.then(() => (cachedNow = 0)), (cachedNow = Date.now()))
  function createInvoker(e, t) {
    const r = (i) => {
      if (!i._vts) i._vts = Date.now()
      else if (i._vts <= r.attached) return
      callWithAsyncErrorHandling(patchStopImmediatePropagation(i, r.value), t, 5, [i])
    }
    return (r.value = e), (r.attached = getNow()), r
  }
  function patchStopImmediatePropagation(e, t) {
    if (isArray$2(t)) {
      const r = e.stopImmediatePropagation
      return (
        (e.stopImmediatePropagation = () => {
          r.call(e), (e._stopped = !0)
        }),
        t.map((i) => (n) => !n._stopped && i && i(n))
      )
    } else return t
  }
  const isNativeOn = (e) =>
      e.charCodeAt(0) === 111 &&
      e.charCodeAt(1) === 110 &&
      e.charCodeAt(2) > 96 &&
      e.charCodeAt(2) < 123,
    patchProp = (e, t, r, i, n = !1, s, a, l, o) => {
      t === 'class'
        ? patchClass(e, i, n)
        : t === 'style'
          ? patchStyle(e, r, i)
          : isOn(t)
            ? isModelListener(t) || patchEvent(e, t, r, i, a)
            : (
                  t[0] === '.'
                    ? ((t = t.slice(1)), !0)
                    : t[0] === '^'
                      ? ((t = t.slice(1)), !1)
                      : shouldSetAsProp(e, t, i, n)
                )
              ? patchDOMProp(e, t, i, s, a, l, o)
              : (t === 'true-value'
                  ? (e._trueValue = i)
                  : t === 'false-value' && (e._falseValue = i),
                patchAttr(e, t, i, n))
    }
  function shouldSetAsProp(e, t, r, i) {
    if (i)
      return !!(
        t === 'innerHTML' ||
        t === 'textContent' ||
        (t in e && isNativeOn(t) && isFunction$1(r))
      )
    if (
      t === 'spellcheck' ||
      t === 'draggable' ||
      t === 'translate' ||
      t === 'form' ||
      (t === 'list' && e.tagName === 'INPUT') ||
      (t === 'type' && e.tagName === 'TEXTAREA')
    )
      return !1
    if (t === 'width' || t === 'height') {
      const n = e.tagName
      if (n === 'IMG' || n === 'VIDEO' || n === 'CANVAS' || n === 'SOURCE') return !1
    }
    return isNativeOn(t) && isString(r) ? !1 : t in e
  }
  const rendererOptions = extend({ patchProp }, nodeOps)
  let renderer
  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions))
  }
  const createApp = (...e) => {
    const t = ensureRenderer().createApp(...e),
      { mount: r } = t
    return (
      (t.mount = (i) => {
        const n = normalizeContainer(i)
        if (!n) return
        const s = t._component
        !isFunction$1(s) && !s.render && !s.template && (s.template = n.innerHTML),
          (n.innerHTML = '')
        const a = r(n, !1, n instanceof SVGElement)
        return (
          n instanceof Element && (n.removeAttribute('v-cloak'), n.setAttribute('data-v-app', '')),
          a
        )
      }),
      t
    )
  }
  function normalizeContainer(e) {
    return isString(e) ? document.querySelector(e) : e
  }
  function tryOnScopeDispose(e) {
    return getCurrentScope() ? (onScopeDispose(e), !0) : !1
  }
  function toValue(e) {
    return typeof e == 'function' ? e() : unref(e)
  }
  const isClient = typeof window < 'u' && typeof document < 'u'
  typeof WorkerGlobalScope < 'u' && globalThis instanceof WorkerGlobalScope
  const toString = Object.prototype.toString,
    isObject$1 = (e) => toString.call(e) === '[object Object]',
    noop = () => {}
  function createFilterWrapper(e, t) {
    function r(...i) {
      return new Promise((n, s) => {
        Promise.resolve(e(() => t.apply(this, i), { fn: t, thisArg: this, args: i }))
          .then(n)
          .catch(s)
      })
    }
    return r
  }
  const bypassFilter = (e) => e()
  function pausableFilter(e = bypassFilter) {
    const t = ref(!0)
    function r() {
      t.value = !1
    }
    function i() {
      t.value = !0
    }
    const n = (...s) => {
      t.value && e(...s)
    }
    return { isActive: readonly(t), pause: r, resume: i, eventFilter: n }
  }
  function getLifeCycleTarget(e) {
    return e || getCurrentInstance()
  }
  function watchWithFilter(e, t, r = {}) {
    const { eventFilter: i = bypassFilter, ...n } = r
    return watch(e, createFilterWrapper(i, t), n)
  }
  function watchPausable(e, t, r = {}) {
    const { eventFilter: i, ...n } = r,
      { eventFilter: s, pause: a, resume: l, isActive: o } = pausableFilter(i)
    return {
      stop: watchWithFilter(e, t, { ...n, eventFilter: s }),
      pause: a,
      resume: l,
      isActive: o
    }
  }
  function tryOnMounted(e, t = !0, r) {
    const i = getLifeCycleTarget(r)
    i ? onMounted(e, i) : t ? e() : nextTick(e)
  }
  function whenever(e, t, r) {
    return watch(
      e,
      (i, n, s) => {
        i && t(i, n, s)
      },
      r
    )
  }
  function unrefElement(e) {
    var t
    const r = toValue(e)
    return (t = r == null ? void 0 : r.$el) != null ? t : r
  }
  const defaultWindow = isClient ? window : void 0
  function useEventListener(...e) {
    let t, r, i, n
    if (
      (typeof e[0] == 'string' || Array.isArray(e[0])
        ? (([r, i, n] = e), (t = defaultWindow))
        : ([t, r, i, n] = e),
      !t)
    )
      return noop
    Array.isArray(r) || (r = [r]), Array.isArray(i) || (i = [i])
    const s = [],
      a = () => {
        s.forEach((u) => u()), (s.length = 0)
      },
      l = (u, E, c, b) => (u.addEventListener(E, c, b), () => u.removeEventListener(E, c, b)),
      o = watch(
        () => [unrefElement(t), toValue(n)],
        ([u, E]) => {
          if ((a(), !u)) return
          const c = isObject$1(E) ? { ...E } : E
          s.push(...r.flatMap((b) => i.map((x) => l(u, b, x, c))))
        },
        { immediate: !0, flush: 'post' }
      ),
      f = () => {
        o(), a()
      }
    return tryOnScopeDispose(f), f
  }
  const _global =
      typeof globalThis < 'u'
        ? globalThis
        : typeof window < 'u'
          ? window
          : typeof global < 'u'
            ? global
            : typeof self < 'u'
              ? self
              : {},
    globalKey = '__vueuse_ssr_handlers__',
    handlers = getHandlers()
  function getHandlers() {
    return (
      globalKey in _global || (_global[globalKey] = _global[globalKey] || {}), _global[globalKey]
    )
  }
  function getSSRHandler(e, t) {
    return handlers[e] || t
  }
  function guessSerializerType(e) {
    return e == null
      ? 'any'
      : e instanceof Set
        ? 'set'
        : e instanceof Map
          ? 'map'
          : e instanceof Date
            ? 'date'
            : typeof e == 'boolean'
              ? 'boolean'
              : typeof e == 'string'
                ? 'string'
                : typeof e == 'object'
                  ? 'object'
                  : Number.isNaN(e)
                    ? 'any'
                    : 'number'
  }
  const StorageSerializers = {
      boolean: { read: (e) => e === 'true', write: (e) => String(e) },
      object: { read: (e) => JSON.parse(e), write: (e) => JSON.stringify(e) },
      number: { read: (e) => Number.parseFloat(e), write: (e) => String(e) },
      any: { read: (e) => e, write: (e) => String(e) },
      string: { read: (e) => e, write: (e) => String(e) },
      map: {
        read: (e) => new Map(JSON.parse(e)),
        write: (e) => JSON.stringify(Array.from(e.entries()))
      },
      set: { read: (e) => new Set(JSON.parse(e)), write: (e) => JSON.stringify(Array.from(e)) },
      date: { read: (e) => new Date(e), write: (e) => e.toISOString() }
    },
    customStorageEventName = 'vueuse-storage'
  function useStorage(e, t, r, i = {}) {
    var n
    const {
        flush: s = 'pre',
        deep: a = !0,
        listenToStorageChanges: l = !0,
        writeDefaults: o = !0,
        mergeDefaults: f = !1,
        shallow: u,
        window: E = defaultWindow,
        eventFilter: c,
        onError: b = (D) => {
          console.error(D)
        },
        initOnMounted: x
      } = i,
      y = (u ? shallowRef : ref)(typeof t == 'function' ? t() : t)
    if (!r)
      try {
        r = getSSRHandler('getDefaultStorage', () => {
          var D
          return (D = defaultWindow) == null ? void 0 : D.localStorage
        })()
      } catch (D) {
        b(D)
      }
    if (!r) return y
    const _ = toValue(t),
      m = guessSerializerType(_),
      A = (n = i.serializer) != null ? n : StorageSerializers[m],
      { pause: d, resume: g } = watchPausable(y, () => C(y.value), {
        flush: s,
        deep: a,
        eventFilter: c
      })
    return (
      E &&
        l &&
        tryOnMounted(() => {
          useEventListener(E, 'storage', M),
            useEventListener(E, customStorageEventName, k),
            x && M()
        }),
      x || M(),
      y
    )
    function C(D) {
      try {
        if (D == null) r.removeItem(e)
        else {
          const W = A.write(D),
            H = r.getItem(e)
          H !== W &&
            (r.setItem(e, W),
            E &&
              E.dispatchEvent(
                new CustomEvent(customStorageEventName, {
                  detail: { key: e, oldValue: H, newValue: W, storageArea: r }
                })
              ))
        }
      } catch (W) {
        b(W)
      }
    }
    function P(D) {
      const W = D ? D.newValue : r.getItem(e)
      if (W == null) return o && _ != null && r.setItem(e, A.write(_)), _
      if (!D && f) {
        const H = A.read(W)
        return typeof f == 'function'
          ? f(H, _)
          : m === 'object' && !Array.isArray(H)
            ? { ..._, ...H }
            : H
      } else return typeof W != 'string' ? W : A.read(W)
    }
    function k(D) {
      M(D.detail)
    }
    function M(D) {
      if (!(D && D.storageArea !== r)) {
        if (D && D.key == null) {
          y.value = _
          return
        }
        if (!(D && D.key !== e)) {
          d()
          try {
            ;(D == null ? void 0 : D.newValue) !== A.write(y.value) && (y.value = P(D))
          } catch (W) {
            b(W)
          } finally {
            D ? nextTick(g) : g()
          }
        }
      }
    }
  }
  function useLocalStorage(e, t, r = {}) {
    const { window: i = defaultWindow } = r
    return useStorage(e, t, i == null ? void 0 : i.localStorage, r)
  }
  const christmasHouse =
      'https://brihan-tech.github.io/ChristmasCard/assets/christmas-house-ed7vXUrF.png',
    christmasTree =
      'https://brihan-tech.github.io/ChristmasCard/assets/christmas-tree-9DLyXasX.png',
    christmasWreath =
      'https://brihan-tech.github.io/ChristmasCard/assets/christmas-wreath-QHE0-Tg6.png',
    gingerbreadMan =
      'https://brihan-tech.github.io/ChristmasCard/assets/gingerbread-man-e9fUV67_.png',
    santaClaus = 'https://brihan-tech.github.io/ChristmasCard/assets/santa-claus-_QgQrNBd.png',
    stocking = 'https://brihan-tech.github.io/ChristmasCard/assets/stocking-BmqP65Vx.png',
    gift = 'https://brihan-tech.github.io/ChristmasCard/assets/gift-SGF3MpYX.png',
    v = '5.4.2',
    fr = 29.9700012207031,
    ip = 0,
    op = 202.000008227629,
    w = 1e3,
    h = 800,
    nm = 'CM11',
    ddd = 0,
    assets = [
      {
        id: 'comp_0',
        layers: [
          {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: 'Shape Layer 3',
            td: 1,
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 },
              r: { a: 0, k: 0, ix: 10 },
              p: { a: 0, k: [500, 500, 0], ix: 2 },
              a: { a: 0, k: [0, 0, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0, 0],
                          [13, -4],
                          [1, -12],
                          [-8, 14],
                          [0, 0],
                          [-10, 3],
                          [-2.286, 8.762],
                          [5, -10],
                          [-7, -10],
                          [7, -7],
                          [-2, 20]
                        ],
                        o: [
                          [0, 0],
                          [-13, 4],
                          [-1, 12],
                          [8, -14],
                          [0, 0],
                          [10, -3],
                          [3, -11.5],
                          [-5, 10],
                          [7, 10],
                          [-7, 7],
                          [2, -20]
                        ],
                        v: [
                          [177, 13],
                          [163, 8],
                          [144, 38],
                          [154.5, 51],
                          [168, 19],
                          [171, 57],
                          [194, 17],
                          [191, -1],
                          [207, 34],
                          [218, 60],
                          [193, 52]
                        ],
                        c: !1
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0, 0, 0, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 2,
                    lj: 2,
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'tm',
                    s: { a: 0, k: 0, ix: 1 },
                    e: {
                      a: 1,
                      k: [
                        {
                          i: { x: [0.833], y: [0.833] },
                          o: { x: [0.167], y: [0.167] },
                          n: ['0p833_0p833_0p167_0p167'],
                          t: 110,
                          s: [0],
                          e: [100]
                        },
                        { t: 129.000005254278 }
                      ],
                      ix: 2
                    },
                    o: { a: 0, k: 0, ix: 3 },
                    m: 1,
                    ix: 4,
                    nm: 'Trim Paths 1',
                    mn: 'ADBE Vector Filter - Trim',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [0, 0], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Shape 2',
                np: 4,
                cix: 2,
                ix: 1,
                mn: 'ADBE Vector Group',
                hd: !1
              },
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0, 0],
                          [-14, -1],
                          [0, 11],
                          [21, -1],
                          [-4, -14],
                          [-33.003, -1.956],
                          [-7.5, 8.5],
                          [-16, 1],
                          [4, 10],
                          [13, -7],
                          [2, -49],
                          [-14, 12],
                          [-7.878, 19.696],
                          [10, 0],
                          [1, -19],
                          [-3, -13],
                          [-11, -8],
                          [-8, 2],
                          [2, 54.75],
                          [-19, 2],
                          [-9.947, 1.029],
                          [0, 12],
                          [-11.91, -5.211],
                          [-2, 10],
                          [4, -2],
                          [-5.5, -9.5],
                          [22.25, 35.25],
                          [0, 0],
                          [-24, -1],
                          [-25, -5],
                          [-32.024, -1.562],
                          [66, 35],
                          [-13.5, -13],
                          [36, 0],
                          [-24, -6],
                          [0, 0],
                          [-11.98, -8.253],
                          [0, 0],
                          [0, 0],
                          [-12, -8],
                          [0, 0],
                          [-15, -4],
                          [-1, -11],
                          [-24.25, 1.75]
                        ],
                        o: [
                          [0, 0],
                          [14, 1],
                          [0, -11],
                          [-21, 1],
                          [4, 14],
                          [33.75, 2],
                          [4.678, -5.302],
                          [16, -1],
                          [-4, -10],
                          [-13, 7],
                          [-2, 49],
                          [14, -12],
                          [4, -10],
                          [-10, 0],
                          [-1, 19],
                          [4, -15],
                          [11, 8],
                          [8, -2],
                          [-2, -1],
                          [-4, 12],
                          [14.5, -1.5],
                          [2, 2],
                          [8, 3.5],
                          [2, -10],
                          [-4, 2],
                          [6.471, 11.178],
                          [-22.759, -36.056],
                          [0, 0],
                          [24, 1],
                          [25, 5],
                          [41, 2],
                          [47, -1],
                          [10.389, 10.004],
                          [-36, 0],
                          [-2, -2],
                          [0, 0],
                          [11.25, 7.75],
                          [0, 0],
                          [0, 0],
                          [3, 10],
                          [0, 0],
                          [9, 2.5],
                          [1, 11],
                          [-23, -24]
                        ],
                        v: [
                          [-240, -34],
                          [-223, -23],
                          [-200, -48],
                          [-230, -69],
                          [-272, -33],
                          [-229.75, 1],
                          [-140.5, -24],
                          [-137, 2],
                          [-119, -41],
                          [-143, -55],
                          [-179, 31],
                          [-137, 76],
                          [-85, -20],
                          [-88, -53],
                          [-104, -16],
                          [-101, 61],
                          [-78, 8],
                          [-74, 60],
                          [-57, -11.25],
                          [-36, 8],
                          [-38, 56],
                          [-8, -17.5],
                          [-9, 53],
                          [14, 21],
                          [17, 4],
                          [29.5, 39],
                          [0, 38],
                          [-31, -11.5],
                          [-46, -37],
                          [36.5, -38.5],
                          [120, -16],
                          [168.5, -70.5],
                          [268, -42],
                          [250, 4],
                          [234, -32],
                          [49, -56],
                          [50.75, 52.75],
                          [73.5, 1],
                          [74, 58.5],
                          [97.5, 11.5],
                          [100, 60.5],
                          [120, 11],
                          [125.75, 51],
                          [148, 79]
                        ],
                        c: !1
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0, 0, 0, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 17, ix: 5 },
                    lc: 2,
                    lj: 2,
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'tm',
                    s: { a: 0, k: 0, ix: 1 },
                    e: {
                      a: 1,
                      k: [
                        {
                          i: { x: [0.833], y: [0.833] },
                          o: { x: [0.167], y: [0.167] },
                          n: ['0p833_0p833_0p167_0p167'],
                          t: 47,
                          s: [0],
                          e: [100]
                        },
                        { t: 109.000004439661 }
                      ],
                      ix: 2
                    },
                    o: { a: 0, k: 0, ix: 3 },
                    m: 1,
                    ix: 4,
                    nm: 'Trim Paths 1',
                    mn: 'ADBE Vector Filter - Trim',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [0, 0], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Shape 1',
                np: 4,
                cix: 2,
                ix: 2,
                mn: 'ADBE Vector Group',
                hd: !1
              }
            ],
            ip: 0,
            op: 317.000012911675,
            st: 0,
            bm: 0
          },
          {
            ddd: 0,
            ind: 2,
            ty: 4,
            nm: 'Layer 2 Outlines',
            tt: 1,
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 },
              r: { a: 0, k: 0, ix: 10 },
              p: { a: 0, k: [510.307, 504.87, 0], ix: 2 },
              a: { a: 0, k: [293.203, 93.358, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            hasMask: !0,
            masksProperties: [
              {
                inv: !0,
                mode: 'a',
                pt: {
                  a: 1,
                  k: [
                    {
                      i: { x: 0.833, y: 0.833 },
                      o: { x: 0.167, y: 0.167 },
                      n: '0p833_0p833_0p167_0p167',
                      t: 58,
                      s: [
                        {
                          i: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0]
                          ],
                          o: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0]
                          ],
                          v: [
                            [102.255, 73.079],
                            [99.201, 89.899],
                            [113.285, 84.649],
                            [118.84, 67.704]
                          ],
                          c: !0
                        }
                      ],
                      e: [
                        {
                          i: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0]
                          ],
                          o: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0]
                          ],
                          v: [
                            [99.201, 89.704],
                            [99.201, 89.899],
                            [113.285, 84.649],
                            [113.285, 84.579]
                          ],
                          c: !0
                        }
                      ]
                    },
                    { t: 59.0000024031193 }
                  ],
                  ix: 1
                },
                o: { a: 0, k: 100, ix: 3 },
                x: {
                  a: 1,
                  k: [
                    {
                      i: { x: [0.833], y: [0.833] },
                      o: { x: [0.167], y: [0.167] },
                      n: ['0p833_0p833_0p167_0p167'],
                      t: 58,
                      s: [0],
                      e: [-9]
                    },
                    { t: 59.0000024031193 }
                  ],
                  ix: 4
                },
                nm: 'Mask 1'
              },
              {
                inv: !1,
                mode: 's',
                pt: {
                  a: 1,
                  k: [
                    {
                      i: { x: 0.833, y: 0.833 },
                      o: { x: 0.167, y: 0.167 },
                      n: '0p833_0p833_0p167_0p167',
                      t: 65,
                      s: [
                        {
                          i: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0]
                          ],
                          o: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0]
                          ],
                          v: [
                            [169.951, 101.954],
                            [172.701, 124.149],
                            [184.91, 101.899],
                            [187.66, 71.954]
                          ],
                          c: !0
                        }
                      ],
                      e: [
                        {
                          i: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0]
                          ],
                          o: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0]
                          ],
                          v: [
                            [172.701, 123.704],
                            [172.701, 124.149],
                            [184.91, 101.899],
                            [185.41, 101.954]
                          ],
                          c: !0
                        }
                      ]
                    },
                    { t: 66.0000026882351 }
                  ],
                  ix: 1
                },
                o: { a: 0, k: 100, ix: 3 },
                x: {
                  a: 1,
                  k: [
                    {
                      i: { x: [0.833], y: [0.833] },
                      o: { x: [0.167], y: [0.167] },
                      n: ['0p833_0p833_0p167_0p167'],
                      t: 65,
                      s: [0],
                      e: [-4]
                    },
                    { t: 66.0000026882351 }
                  ],
                  ix: 4
                },
                nm: 'Mask 2'
              },
              {
                inv: !1,
                mode: 's',
                pt: {
                  a: 1,
                  k: [
                    {
                      i: { x: 0.833, y: 0.833 },
                      o: { x: 0.167, y: 0.167 },
                      n: '0p833_0p833_0p167_0p167',
                      t: 79,
                      s: [
                        {
                          i: [
                            [0, 0],
                            [-2.564, 1.836],
                            [0, 0],
                            [0, 0]
                          ],
                          o: [
                            [0, 0],
                            [2.321, -1.662],
                            [0, 0],
                            [0, 0]
                          ],
                          v: [
                            [279.701, 130.829],
                            [284.201, 139.149],
                            [291.66, 129.649],
                            [287.285, 122.454]
                          ],
                          c: !0
                        }
                      ],
                      e: [
                        {
                          i: [
                            [0, 0],
                            [-2.564, 1.836],
                            [0, 0],
                            [0, 0]
                          ],
                          o: [
                            [0, 0],
                            [2.321, -1.662],
                            [0, 0],
                            [0, 0]
                          ],
                          v: [
                            [279.701, 130.829],
                            [279.701, 130.774],
                            [287.285, 122.649],
                            [287.285, 122.454]
                          ],
                          c: !0
                        }
                      ]
                    },
                    { t: 80.0000032584668 }
                  ],
                  ix: 1
                },
                o: { a: 0, k: 100, ix: 3 },
                x: {
                  a: 1,
                  k: [
                    {
                      i: { x: [0.833], y: [0.833] },
                      o: { x: [0.167], y: [0.167] },
                      n: ['0p833_0p833_0p167_0p167'],
                      t: 79,
                      s: [0],
                      e: [-6]
                    },
                    { t: 80.0000032584668 }
                  ],
                  ix: 4
                },
                nm: 'Mask 3'
              },
              {
                inv: !1,
                mode: 's',
                pt: {
                  a: 1,
                  k: [
                    {
                      i: { x: 0.833, y: 0.833 },
                      o: { x: 0.167, y: 0.167 },
                      n: '0p833_0p833_0p167_0p167',
                      t: 98,
                      s: [
                        {
                          i: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0]
                          ],
                          o: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0]
                          ],
                          v: [
                            [319.005, 40.454],
                            [322.951, 55.149],
                            [334.66, 57.649],
                            [341.965, 44.204]
                          ],
                          c: !0
                        }
                      ],
                      e: [
                        {
                          i: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0]
                          ],
                          o: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0]
                          ],
                          v: [
                            [322.951, 54.704],
                            [322.951, 55.149],
                            [334.66, 57.649],
                            [334.66, 57.454]
                          ],
                          c: !0
                        }
                      ]
                    },
                    { t: 99.0000040323527 }
                  ],
                  ix: 1
                },
                o: { a: 0, k: 100, ix: 3 },
                x: {
                  a: 1,
                  k: [
                    {
                      i: { x: [0.833], y: [0.833] },
                      o: { x: [0.167], y: [0.167] },
                      n: ['0p833_0p833_0p167_0p167'],
                      t: 98,
                      s: [0],
                      e: [-10]
                    },
                    { t: 99.0000040323527 }
                  ],
                  ix: 4
                },
                nm: 'Mask 4'
              }
            ],
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [7.304, 13.205],
                          [-1.917, 6.491]
                        ],
                        o: [
                          [3.42, -5.853],
                          [19.548, 29.262]
                        ],
                        v: [
                          [0.617, 42.684],
                          [8.368, 23.839]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ind: 1,
                    ty: 'sh',
                    ix: 2,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [-0.998, 9.126],
                          [-1.74, -11.584],
                          [4.538, -11.268]
                        ],
                        o: [
                          [3.45, -31.577],
                          [1.801, 11.993],
                          [0, -9.243]
                        ],
                        v: [
                          [-107.07, -26.681],
                          [-94.512, -47.134],
                          [-108.806, 10.001]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 2',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ind: 2,
                    ty: 'sh',
                    ix: 3,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [-10.31, 9.957],
                          [-6.021, -1.286],
                          [7.114, -10.218],
                          [-0.546, 6.866],
                          [5.167, -1.321],
                          [0.75, -5.894],
                          [7.41, -3.221]
                        ],
                        o: [
                          [3.622, -3.497],
                          [14.971, 3.196],
                          [-7.43, 10.668],
                          [6.588, -4.233],
                          [-5.428, 1.386],
                          [-6.624, 4.798],
                          [3.724, -17.095]
                        ],
                        v: [
                          [-159.328, -51.34],
                          [-144.96, -55.631],
                          [-139.594, -8.51],
                          [-149.858, -21.564],
                          [-150.105, -32.883],
                          [-159.159, -20.482],
                          [-180.272, -8.429]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 3',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ind: 3,
                    ty: 'sh',
                    ix: 4,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [74.206, 0.933],
                          [4.325, -0.676],
                          [-5.69, -0.785],
                          [-1.379, -0.146],
                          [24.181, -14.514],
                          [42.493, 9.731],
                          [0, 0],
                          [-0.083, 0.183],
                          [0, 0],
                          [0, 0],
                          [0.308, -5.234],
                          [0, 0],
                          [4.354, 0.727],
                          [9.963, -15.451],
                          [-2.873, 1.943],
                          [4.452, 0.628],
                          [-20.333, 5.704],
                          [-28.859, -5.749],
                          [0.136, -7.205],
                          [3.884, -7.951],
                          [3.463, 7.748],
                          [8.031, -2.645],
                          [-8.223, -11.226],
                          [2.508, -6.789],
                          [-4.749, -11.578],
                          [-4.851, 10.79],
                          [0.913, -4.23],
                          [0.094, -2.419],
                          [1.83, -7.089],
                          [0.139, 22.923],
                          [-0.741, 3.077],
                          [4.949, 5.861],
                          [9.052, 2.409],
                          [-16.708, -8.927],
                          [1.279, -4.851],
                          [1.22, 5.58],
                          [-0.343, 6.529],
                          [8.752, -3.512],
                          [3.158, -9.306],
                          [-3.902, 9.784],
                          [1.25, 18.683],
                          [6.651, -0.42],
                          [-0.36, -19.551],
                          [3.386, -6.671],
                          [17.965, -0.065],
                          [-7.097, 36.793],
                          [-6.402, 4.644],
                          [-12.284, 8.149],
                          [0.861, 13.163],
                          [17.997, -13.231],
                          [4.464, -21.768],
                          [15.981, 2.311],
                          [-40.453, 12.473],
                          [12.059, -16.223],
                          [8.134, 8.926],
                          [1.471, 3.731],
                          [-6.748, -4.43],
                          [-7.322, 9.916],
                          [9.151, 9.332],
                          [-12.643, -33.172],
                          [-35.388, 9.487],
                          [-15.333, -10.759],
                          [-10.449, 18.002],
                          [-7.035, 0.366],
                          [-0.391, 4.666],
                          [-3.338, 8.576],
                          [1.169, -17.59],
                          [-2.202, -7.471],
                          [-5.963, 4.111],
                          [-0.647, 14.419],
                          [-1.99, 0.365],
                          [-1.569, -11.386],
                          [-6.808, 3.227],
                          [-2.768, 6.061],
                          [-5.035, 10.933],
                          [-6.291, 3.686],
                          [-3.223, 10.625],
                          [-12.836, 4.583],
                          [-3.144, 6.386],
                          [0.1, -2.092],
                          [-2.836, -0.752],
                          [0.009, 0.249],
                          [-2.427, 8.771],
                          [-1.23, -23.046],
                          [-0.973, -11.086],
                          [-0.349, 13.228],
                          [-0.805, 7.747],
                          [-0.747, -21.155],
                          [-0.446, -10.439],
                          [-5.859, -5.552],
                          [-6.487, 7.899],
                          [1.118, 10.415],
                          [9.182, 7.271],
                          [2.829, -0.771],
                          [2.194, -3.493],
                          [0.895, 1.528],
                          [1.367, 0.758],
                          [2.686, -6.739],
                          [0.769, 0.128],
                          [0.534, -8.499],
                          [-0.061, -5.071],
                          [2.82, -4.196],
                          [1.61, 9.056],
                          [-0.693, 19.366],
                          [-13.884, -2.663],
                          [32.091, 14.273],
                          [57.492, 1.794],
                          [-19.763, 0.021],
                          [-1.346, 5.272],
                          [5.75, -7.852],
                          [-12.232, -7.29],
                          [-12.668, 7.979]
                        ],
                        o: [
                          [-3.999, -0.05],
                          [-3.969, 0.623],
                          [2.277, 0.313],
                          [15.086, 1.599],
                          [-30.181, 18.114],
                          [0, 0],
                          [0.06, -1.542],
                          [0, 0],
                          [0, 0],
                          [-7.996, -1.628],
                          [0, 0],
                          [-4.751, -1.007],
                          [-15.392, -2.572],
                          [-8.151, 12.645],
                          [3.693, -2.497],
                          [-12.597, -1.771],
                          [18.923, -5.309],
                          [-0.17, 10.216],
                          [-0.3, 15.997],
                          [-2.648, -8.758],
                          [-1.504, -3.373],
                          [-8.297, 2.73],
                          [2.181, 2.978],
                          [-3.367, -6.207],
                          [-9.724, 13.268],
                          [-0.323, 0.235],
                          [-0.647, 3.006],
                          [-0.14, 3.618],
                          [-3.204, 12.408],
                          [-0.067, -11.212],
                          [1.919, -7.973],
                          [-1.777, -2.102],
                          [-1.144, -34.129],
                          [0.128, 5.666],
                          [-4.416, 16.756],
                          [-1.403, -6.419],
                          [0.271, -5.183],
                          [-10.173, 4.078],
                          [-1.186, -13.385],
                          [6.704, -16.808],
                          [-0.356, -5.326],
                          [-22.021, 1.39],
                          [0.192, 10.393],
                          [-6.884, 13.565],
                          [-19.672, 0.069],
                          [7.837, -3.102],
                          [0.178, 11.731],
                          [13.213, -8.766],
                          [-1.46, -22.287],
                          [-15.244, 11.207],
                          [-15.004, 4.393],
                          [-49.036, -7.09],
                          [29.214, -9.007],
                          [-5.99, 8.056],
                          [-2.168, -2.382],
                          [-0.921, -2.333],
                          [12.051, 7.913],
                          [6.595, -8.931],
                          [-26.821, -27.352],
                          [10.747, 28.195],
                          [-5.869, 31.938],
                          [24.817, 17.414],
                          [0.378, 5.051],
                          [10.769, -0.559],
                          [1.612, -7.099],
                          [8.356, -21.46],
                          [-0.513, 7.694],
                          [1.997, 6.777],
                          [13.965, -9.628],
                          [2.032, 0.135],
                          [-3.169, 10.808],
                          [0.812, 5.883],
                          [7.136, -3.211],
                          [1.854, 15.512],
                          [4.413, 6.304],
                          [8.475, -4.969],
                          [1.209, 7.487],
                          [6.796, -2.424],
                          [0.008, 2.482],
                          [-0.316, 6.662],
                          [3.392, 0.897],
                          [-0.315, -9.024],
                          [3.224, -11.641],
                          [0.626, 11.735],
                          [13.328, 0.293],
                          [0.184, -6.918],
                          [0.936, -9.028],
                          [0.294, 8.327],
                          [0.365, 8.58],
                          [5.057, 4.795],
                          [-11.457, -3.093],
                          [-1.955, -18.217],
                          [-1.592, -1.263],
                          [-4.892, 1.333],
                          [-0.44, -1.854],
                          [-0.659, -1.444],
                          [-9.115, -5.063],
                          [-0.067, -1.614],
                          [-7.849, -0.833],
                          [-0.307, 4.905],
                          [0.055, 4.912],
                          [-8.336, 12.414],
                          [-3.051, -17.158],
                          [19.852, 4.263],
                          [93.654, 17.971],
                          [101.141, -0.559],
                          [-33.616, -1.05],
                          [5.249, -0.007],
                          [1.684, -6.591],
                          [-9.626, 13.144],
                          [11.396, 6.791],
                          [34.407, -21.67]
                        ],
                        v: [
                          [176.601, -76.857],
                          [159.348, -76.37],
                          [157.186, -73.657],
                          [166.423, -72.21],
                          [165.79, -29.904],
                          [41.02, -35.827],
                          [41.137, -38.814],
                          [41.408, -51.549],
                          [41.406, -51.548],
                          [37.325, -52.301],
                          [29.59, -38.644],
                          [29.572, -38.365],
                          [15.885, -40.997],
                          [-63.168, -35.514],
                          [-43.704, -16.068],
                          [-45.777, -18.417],
                          [-47.931, -37.798],
                          [29.402, -33.482],
                          [29.846, -3.882],
                          [26.712, 32.453],
                          [12.799, 8.67],
                          [7.9, -6.242],
                          [3.888, 16.136],
                          [-1.582, 36.288],
                          [-8.823, 45.442],
                          [-12.983, 0.081],
                          [-26.763, 0.873],
                          [-27.732, 9.541],
                          [-29.957, 31.087],
                          [-45.005, 36.965],
                          [-40.835, 7.829],
                          [-43.415, -1.324],
                          [-59.893, 0.219],
                          [-66.397, 6.251],
                          [-68.079, 35.39],
                          [-78.34, 46.981],
                          [-79.267, 19.674],
                          [-86.424, -0.726],
                          [-107.392, 33.465],
                          [-105.017, 12.981],
                          [-89.395, -50.338],
                          [-99.341, -62.111],
                          [-119.504, 18.611],
                          [-122.12, 34.046],
                          [-161.016, 72.628],
                          [-180.938, -5.171],
                          [-159.359, -16.825],
                          [-139.148, -0.867],
                          [-125.046, -40.842],
                          [-163.947, -57.188],
                          [-193.336, -3.7],
                          [-240.281, -0.389],
                          [-247.779, -70.454],
                          [-215.56, -36.006],
                          [-244.947, -30.084],
                          [-250.273, -39.432],
                          [-248.176, -27.631],
                          [-211.369, -33.514],
                          [-213.934, -65.756],
                          [-280.31, -25.813],
                          [-193.882, -0.895],
                          [-179.171, 75.693],
                          [-118.521, 41.368],
                          [-112.417, 58.08],
                          [-105.574, 50.581],
                          [-98.314, 25.811],
                          [-91.28, 28.348],
                          [-89.848, 51.197],
                          [-75.518, 56.708],
                          [-60.991, 7.654],
                          [-52.138, 8.295],
                          [-56.079, 45.478],
                          [-42.337, 55.999],
                          [-28.259, 40.611],
                          [-5.047, 49.904],
                          [18.143, 55.37],
                          [30.721, 35.4],
                          [45.54, 55.124],
                          [60.257, 38.924],
                          [60.061, 46.577],
                          [63.333, 55.775],
                          [72.329, 55.516],
                          [73.539, 25.131],
                          [86.098, 21.521],
                          [85.639, 55.691],
                          [97.996, 46.305],
                          [98.632, 17.721],
                          [109.822, 21.255],
                          [109.416, 51.395],
                          [116.113, 74.873],
                          [137.648, 74.114],
                          [122.163, 51.786],
                          [116.015, 2.115],
                          [106.88, 0.525],
                          [96.17, 9.283],
                          [94.187, 3.938],
                          [90.647, 0.36],
                          [71.28, 18.098],
                          [71.288, 0.429],
                          [59.513, 8.308],
                          [59.802, 24.63],
                          [54.665, 40.331],
                          [42.565, 33.834],
                          [40.843, -31.108],
                          [93.364, -19.48],
                          [171.337, -74.389],
                          [235.183, 0.442],
                          [221.61, -39.699],
                          [227.777, -36.74],
                          [208.991, -35.967],
                          [215.533, -1.617],
                          [258.547, -1.874]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 4',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ind: 4,
                    ty: 'sh',
                    ix: 5,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [-9.164, -2.999],
                          [0, 0]
                        ],
                        o: [
                          [5.928, 1.939],
                          [-5.036, 27.86]
                        ],
                        v: [
                          [-20.294, -27.132],
                          [-13.987, -18.074]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 5',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ind: 5,
                    ty: 'sh',
                    ix: 6,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [1.115, -2.755],
                          [-0.293, 1.51],
                          [-0.191, -3.372]
                        ],
                        o: [
                          [-1.985, -2.639],
                          [0.52, -2.697],
                          [0.078, 1.376]
                        ],
                        v: [
                          [186.093, 12.301],
                          [183.981, 5.939],
                          [187.484, 6.162]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 6',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ind: 6,
                    ty: 'sh',
                    ix: 7,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [8.728, 11.462],
                          [0.029, 3.51],
                          [1.719, 2.075],
                          [-14.976, -19.218],
                          [3.248, -6.162],
                          [1.689, 1.852],
                          [-0.284, 4.816],
                          [-0.067, 2.052],
                          [6.337, 1.73],
                          [1.763, -7.311],
                          [-9.852, 18.77],
                          [-6.527, -2.335],
                          [0.876, -2.024],
                          [19.923, 2.016],
                          [5.267, -9.625],
                          [-3.131, -8.901],
                          [-5.909, 7.799],
                          [-1.347, -0.97],
                          [-4.309, 10.045],
                          [-0.345, -10.469],
                          [4.149, -0.856],
                          [2.427, 1.769],
                          [0.255, 3.754],
                          [-5.922, -6.115],
                          [-10.412, 1.763],
                          [0.015, 7.77]
                        ],
                        o: [
                          [0.95, -3.423],
                          [-0.044, -5.165],
                          [-7.101, -8.569],
                          [-0.518, 1.612],
                          [-4.276, 8.117],
                          [-3.087, -3.381],
                          [0.277, -4.689],
                          [0.123, -3.687],
                          [0.32, 2.632],
                          [-5.639, 23.379],
                          [3.285, -6.258],
                          [2.935, 1.049],
                          [3.417, 0.651],
                          [-11.899, -1.203],
                          [-5.929, 10.837],
                          [4.062, 11.55],
                          [0.79, 1.43],
                          [14.024, 10.108],
                          [7.502, 7.499],
                          [0.151, 4.636],
                          [-4.339, 0.896],
                          [-4.737, -3.456],
                          [-3.222, 0.054],
                          [3.08, 3.175],
                          [7.708, -1.306],
                          [-0.029, -15.632]
                        ],
                        v: [
                          [189.936, 15.472],
                          [192.04, 3.372],
                          [188.572, -8.018],
                          [181.73, 22.524],
                          [176.079, 35.968],
                          [162.668, 49.007],
                          [160.272, 30.93],
                          [161.376, 16.89],
                          [151.704, 13.085],
                          [149.72, 39.771],
                          [143.366, 14.524],
                          [160.051, 5.632],
                          [163.895, 11.305],
                          [159.846, 0.029],
                          [132.832, 13.636],
                          [129.608, 49.324],
                          [149.926, 48.969],
                          [153.194, 52.62],
                          [185.863, 26.89],
                          [203.868, 53.2],
                          [200.077, 62.562],
                          [190.056, 60.814],
                          [183.499, 46.736],
                          [180.04, 63.115],
                          [201.033, 67.244],
                          [214.866, 51.676]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 7',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'mm',
                    mm: 1,
                    nm: 'Merge Paths 1',
                    mn: 'ADBE Vector Filter - Merge',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [0.905999995213, 0.317999985639, 0.263000009574, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [293.203, 93.357], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 1',
                np: 9,
                cix: 2,
                ix: 1,
                mn: 'ADBE Vector Group',
                hd: !1
              }
            ],
            ip: 0,
            op: 317.000012911675,
            st: 0,
            bm: 0
          },
          {
            ddd: 0,
            ind: 3,
            ty: 4,
            nm: 'Shape Layer 2',
            td: 1,
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 },
              r: { a: 0, k: 0, ix: 10 },
              p: { a: 0, k: [500, 500, 0], ix: 2 },
              a: { a: 0, k: [0, 0, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0, 0],
                          [6, 0],
                          [-25, -2],
                          [-9.513, -8.154],
                          [-3, 11],
                          [4, 4],
                          [-7, -2],
                          [-10, 3],
                          [6, 5],
                          [-8, 0],
                          [-9, 2],
                          [-2, 8],
                          [-13, 4],
                          [0, 0],
                          [1, -11],
                          [40, 4],
                          [-5, 10],
                          [-16, -5],
                          [8, -4]
                        ],
                        o: [
                          [0, 0],
                          [-6, 0],
                          [-2, -1],
                          [10.5, 9],
                          [3, -11],
                          [-4, -4],
                          [0, 4],
                          [10, -3],
                          [-6, -5],
                          [-2, 4],
                          [9, -2],
                          [2, 6],
                          [13, -4],
                          [0, 0],
                          [-1, 11],
                          [-40, -4],
                          [5, -10],
                          [16, 5],
                          [-8, 4]
                        ],
                        v: [
                          [-15.5, -131.5],
                          [-28, -140.5],
                          [-17, -117],
                          [-32, -92],
                          [-3, -103],
                          [-2, -142],
                          [16, -134],
                          [17, -91],
                          [33, -144],
                          [52, -133],
                          [52, -92.5],
                          [73, -139],
                          [81, -93],
                          [103, -141],
                          [99, -67],
                          [47, -14],
                          [18, -52],
                          [56, -74],
                          [66, -51]
                        ],
                        c: !1
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0, 0, 0, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 2,
                    lj: 2,
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [0, 0], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Shape 1',
                np: 3,
                cix: 2,
                ix: 1,
                mn: 'ADBE Vector Group',
                hd: !1
              },
              {
                ty: 'tm',
                s: { a: 0, k: 0, ix: 1 },
                e: {
                  a: 1,
                  k: [
                    {
                      i: { x: [0.833], y: [0.833] },
                      o: { x: [0.167], y: [0.167] },
                      n: ['0p833_0p833_0p167_0p167'],
                      t: 17,
                      s: [0],
                      e: [100]
                    },
                    { t: 47.0000019143492 }
                  ],
                  ix: 2
                },
                o: { a: 0, k: 0, ix: 3 },
                m: 1,
                ix: 2,
                nm: 'Trim Paths 1',
                mn: 'ADBE Vector Filter - Trim',
                hd: !1
              }
            ],
            ip: 0,
            op: 317.000012911675,
            st: 0,
            bm: 0
          },
          {
            ddd: 0,
            ind: 4,
            ty: 4,
            nm: 'Layer 3 Outlines',
            tt: 1,
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 },
              r: { a: 0, k: 0, ix: 10 },
              p: { a: 0, k: [531.475, 422.924, 0], ix: 2 },
              a: { a: 0, k: [75.447, 78.717, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0.889, -11.286],
                          [-0.33, 4.502],
                          [0, 0],
                          [8.51, -7.394],
                          [-13.958, -1.19],
                          [1.607, -4.357],
                          [-4.333, -4.499],
                          [-6.037, 1.76],
                          [0.473, 16.737],
                          [-2.074, 0.143],
                          [0.309, -10.793],
                          [-9.144, 20.723],
                          [0, 0],
                          [-0.977, 9.695],
                          [-2.749, 0.013],
                          [0.439, -10.169],
                          [-9.272, 20.096],
                          [-7.449, 10.484],
                          [0, 0],
                          [-0.217, 0.316],
                          [1.043, -12.039],
                          [29.437, 11.494],
                          [4.537, 4.731],
                          [-11.532, 9.618],
                          [-8.804, -7.278],
                          [3.078, -5.464],
                          [33.373, -30.104],
                          [-13.263, -15.642],
                          [-12.252, 31.245],
                          [0.036, 10.721],
                          [-2.75, 21.935],
                          [0.088, 0.449],
                          [2.32, -0.624],
                          [0.41, -0.871],
                          [0.308, -2.335],
                          [1.128, -2.496],
                          [0.249, 22.878],
                          [0.237, 0.11],
                          [1.3, -1.35],
                          [0.003, -2.771],
                          [3.731, 1.825],
                          [-0.268, 7.182],
                          [-1.923, 5.416],
                          [0, 0],
                          [3.832, -2.795],
                          [1.838, 0.966],
                          [1.022, 2.692],
                          [2.448, 0.919],
                          [0, 0],
                          [-1.309, -6.029],
                          [-2.777, -1.666],
                          [2.937, -9.687],
                          [-0.837, 21.538],
                          [-1.055, 4.945],
                          [2.438, -0.918],
                          [2.543, 0.316],
                          [1.499, 2.177],
                          [-16.921, -5.84],
                          [3.535, -8.764],
                          [7.879, 0.385],
                          [-13.806, 2.506],
                          [2.533, 2.323],
                          [-6.774, 7.199]
                        ],
                        o: [
                          [-0.505, 6.439],
                          [0, 0],
                          [1.08, -11.81],
                          [-8.191, 7.254],
                          [-3.902, 2.617],
                          [-2.313, 6.269],
                          [4.047, 4.202],
                          [19.305, -5.624],
                          [2.137, 0.242],
                          [-1.149, 4.328],
                          [-0.624, 21.877],
                          [0, 0],
                          [3.921, -8.887],
                          [2.653, 0.754],
                          [-1.087, 3.978],
                          [-1.143, 26.429],
                          [3.596, 15.105],
                          [0, 0],
                          [0.221, -0.298],
                          [-0.091, 13.98],
                          [-2.39, 27.54],
                          [-0.169, -0.632],
                          [-12.321, -12.846],
                          [9.738, -8.122],
                          [5.12, 4.232],
                          [28.732, -12.236],
                          [-13.254, 11.955],
                          [19.031, 22.438],
                          [3.613, -9.209],
                          [-0.073, -21.961],
                          [0.049, -0.398],
                          [-0.361, -1.842],
                          [-1.232, 0.331],
                          [-0.96, 2.043],
                          [-0.488, 3.72],
                          [-4.615, 10.212],
                          [-0.128, -11.721],
                          [-0.144, -0.716],
                          [-2.299, 2.392],
                          [-0.016, 13.929],
                          [-1.255, -0.614],
                          [0.356, -9.514],
                          [0, 0],
                          [0.947, -2.608],
                          [-1.617, 1.176],
                          [0.051, -2.994],
                          [-1.04, -2.727],
                          [0, 0],
                          [-2.864, -1.096],
                          [0.647, 3.142],
                          [0.171, 5.053],
                          [-4.074, 13.446],
                          [0.39, -10.031],
                          [0.95, -4.438],
                          [-2.316, 0.871],
                          [-0.461, -2.632],
                          [-6.272, -9.148],
                          [0.624, 7.666],
                          [-2.021, 5.009],
                          [-11.059, -0.54],
                          [7.577, -1.374],
                          [-11.528, 4.053],
                          [4.043, -4.296]
                        ],
                        v: [
                          [-48.695, -51.679],
                          [-43.531, -53.782],
                          [-43.532, -53.782],
                          [-66.116, -63.282],
                          [-61.239, -39.23],
                          [-70.43, -27.675],
                          [-68.419, -9.745],
                          [-50.229, -5.482],
                          [-26.538, -55.378],
                          [-20.048, -55.229],
                          [-24.159, -27.31],
                          [-0.465, -21.375],
                          [-0.47, -21.375],
                          [7.355, -53.618],
                          [15.542, -52.5],
                          [11.572, -26.541],
                          [36.452, -25.216],
                          [61.35, -18.328],
                          [61.348, -18.328],
                          [62.001, -19.248],
                          [62.339, 20.153],
                          [4.342, 59.651],
                          [-5.708, 52.424],
                          [-2.051, 11.888],
                          [31.85, 9.482],
                          [35.068, 28.706],
                          [-6.022, 9.933],
                          [-12.525, 56.029],
                          [66.639, 36.891],
                          [72.434, 6.907],
                          [74.186, -56.294],
                          [75.11, -61.497],
                          [66.443, -62.271],
                          [64.92, -61.162],
                          [63.206, -53.026],
                          [61.322, -26.433],
                          [46.853, -35.075],
                          [48.21, -61.622],
                          [39.335, -63.776],
                          [35.995, -41.304],
                          [24.447, -16.617],
                          [22.733, -27.591],
                          [27.053, -53.732],
                          [27.053, -53.73],
                          [18.964, -59.122],
                          [7.733, -60.003],
                          [6.688, -70.115],
                          [1.715, -73.625],
                          [1.712, -73.625],
                          [-4.527, -63.516],
                          [2.68, -55.378],
                          [-1.894, -28.378],
                          [-12.929, -28.159],
                          [-9.35, -55.679],
                          [-16.743, -61.735],
                          [-27.145, -61.75],
                          [-29.903, -69.32],
                          [-30.803, -56.295],
                          [-35.529, -25.653],
                          [-52.788, -10.781],
                          [-50.689, -37.101],
                          [-47.168, -43.38],
                          [-59.209, -59.06]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [0.905999995213, 0.317999985639, 0.263000009574, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [75.447, 78.718], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 1',
                np: 2,
                cix: 2,
                ix: 1,
                mn: 'ADBE Vector Group',
                hd: !1
              }
            ],
            ip: 0,
            op: 317.000012911675,
            st: 0,
            bm: 0
          },
          {
            ddd: 0,
            ind: 5,
            ty: 4,
            nm: 'Shape Layer 1',
            td: 1,
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 },
              r: { a: 0, k: 0, ix: 10 },
              p: { a: 0, k: [500, 500, 0], ix: 2 },
              a: { a: 0, k: [0, 0, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0, 0],
                          [8, -11],
                          [-15, -4],
                          [-3, 11],
                          [0, 0],
                          [-8, -14],
                          [-4, 16],
                          [0, 0],
                          [-3, -16],
                          [-23, 21]
                        ],
                        o: [
                          [0, 0],
                          [-8, 11],
                          [15, 4],
                          [3, -11],
                          [0, 0],
                          [8, 14],
                          [4, -16],
                          [0, 0],
                          [3, 16],
                          [23, -21]
                        ],
                        v: [
                          [-112, -139],
                          [-135, -141],
                          [-135, -83],
                          [-105, -126],
                          [-90, -208],
                          [-85, -102],
                          [-68.5, -116],
                          [-53, -206],
                          [-51, -90],
                          [-7, -61]
                        ],
                        c: !1
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0, 0, 0, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 16, ix: 5 },
                    lc: 2,
                    lj: 2,
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [0, 0], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Shape 1',
                np: 3,
                cix: 2,
                ix: 1,
                mn: 'ADBE Vector Group',
                hd: !1
              },
              {
                ty: 'tm',
                s: { a: 0, k: 0, ix: 1 },
                e: {
                  a: 1,
                  k: [
                    {
                      i: { x: [0.833], y: [0.833] },
                      o: { x: [0.167], y: [0.167] },
                      n: ['0p833_0p833_0p167_0p167'],
                      t: 0,
                      s: [0],
                      e: [100]
                    },
                    { t: 18.000000733155 }
                  ],
                  ix: 2
                },
                o: { a: 0, k: 0, ix: 3 },
                m: 1,
                ix: 2,
                nm: 'Trim Paths 1',
                mn: 'ADBE Vector Filter - Trim',
                hd: !1
              }
            ],
            ip: 0,
            op: 317.000012911675,
            st: 0,
            bm: 0
          },
          {
            ddd: 0,
            ind: 6,
            ty: 4,
            nm: 'Layer 5 Outlines',
            tt: 1,
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 },
              r: { a: 0, k: 0, ix: 10 },
              p: { a: 0, k: [418.624, 374.971, 0], ix: 2 },
              a: { a: 0, k: [77.29, 86.585, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [1.768, 0.815],
                          [4.099, -0.571],
                          [-15.012, -5.838],
                          [-5.973, 12.173],
                          [-1.302, 28.676],
                          [-7.288, -0.462],
                          [0.295, -1.535],
                          [0.039, -1.399],
                          [0, 0],
                          [-3.464, -15.114],
                          [-1.724, 8.863],
                          [-0.683, 8.668],
                          [-2.887, 11.05],
                          [-1.958, -0.125],
                          [0.132, -1.716],
                          [-1.003, -25.682],
                          [-8.755, -17.267],
                          [-11.341, 13.497],
                          [0, 0],
                          [-0.267, -1.427],
                          [19.292, 10.761],
                          [2.99, 19.221],
                          [0.269, 2.056],
                          [3.546, -4.586],
                          [2.761, 24.558],
                          [-0.232, 8.796],
                          [8.126, -13.058],
                          [9.212, 8.824],
                          [-18.473, 10.405],
                          [-3.761, -0.017]
                        ],
                        o: [
                          [-1.125, -3.111],
                          [-20.787, 2.901],
                          [8.218, 3.198],
                          [12.781, -26.041],
                          [0.916, -20.176],
                          [2.021, 0.128],
                          [0.303, 0.091],
                          [0, 0],
                          [-0.413, 16.487],
                          [5.642, 24.625],
                          [1.435, -7.379],
                          [1.907, -24.175],
                          [0.651, -2.487],
                          [2.672, 0.168],
                          [-1.719, 22.317],
                          [0.386, 9.859],
                          [7.084, 13.97],
                          [0, 0],
                          [1.215, -1.467],
                          [0.269, 1.447],
                          [-18.576, -10.362],
                          [-0.334, -2.143],
                          [-2.736, 7.82],
                          [-9.741, 12.598],
                          [-0.988, -8.78],
                          [-3.033, 11.492],
                          [-8.656, 13.912],
                          [-12.204, -11.69],
                          [3.077, -1.733],
                          [12.813, 0.064]
                        ],
                        v: [
                          [-31.812, -12.663],
                          [-42.041, -16.326],
                          [-53.701, 39.51],
                          [-31.09, 23.36],
                          [-12.355, -66.159],
                          [-2.611, -82.76],
                          [-0.727, -81.06],
                          [-1.263, -64.869],
                          [-1.259, -64.87],
                          [0.505, 21.602],
                          [17.336, 8.018],
                          [19.815, -16.859],
                          [24.495, -78.219],
                          [34.813, -80.762],
                          [35.692, -70.904],
                          [31.529, 4.255],
                          [40.922, 54.31],
                          [73.666, 66.521],
                          [73.664, 66.521],
                          [76.771, 63.63],
                          [50.157, 75.574],
                          [22.49, 24.063],
                          [21.103, 7.881],
                          [11.939, 30.914],
                          [-13.059, 13.449],
                          [-13.52, -12.885],
                          [-29.572, 29.805],
                          [-64.836, 40.399],
                          [-52.798, -18.7],
                          [-42.53, -21.445]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [0.905999995213, 0.317999985639, 0.263000009574, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [77.29, 86.586], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 1',
                np: 2,
                cix: 2,
                ix: 1,
                mn: 'ADBE Vector Group',
                hd: !1
              }
            ],
            ip: 0,
            op: 317.000012911675,
            st: 0,
            bm: 0
          }
        ]
      },
      {
        id: 'comp_1',
        layers: [
          {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: 'Layer 6 Outlines',
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 },
              r: { a: 0, k: 0, ix: 10 },
              p: { a: 0, k: [351.245, 423.668, 0], ix: 2 },
              a: { a: 0, k: [190.925, 197.18, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [24.142, 7.153],
                          [-8.275, -3.744],
                          [2.476, 1.361]
                        ],
                        o: [
                          [2.593, 10.604],
                          [0.973, 0.442],
                          [12.848, 3.596]
                        ],
                        v: [
                          [-56.49, -25.587],
                          [-40.826, -0.411],
                          [-40.345, -0.418]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ind: 1,
                    ty: 'sh',
                    ix: 2,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0, 0],
                          [20.493, 7.394],
                          [-8.918, -111.233],
                          [-0.846, -4.172],
                          [6.491, -7.243],
                          [6.921, 26.555],
                          [14.776, -4.565],
                          [-77.651, -51.916],
                          [29.707, 33.95],
                          [5.632, -19.798],
                          [47.714, 57.835],
                          [-16.422, 38.232],
                          [-25.634, 7.876],
                          [-10.8, -1.977],
                          [-1.225, 13.268],
                          [-77.986, -27.702],
                          [0.781, -25.671],
                          [-3.335, -16.906]
                        ],
                        o: [
                          [9.929, -29.08],
                          [-84.112, -30.345],
                          [0.271, 3.384],
                          [22.256, 6.185],
                          [-6.595, 7.361],
                          [-9.678, -1.759],
                          [-68.744, 21.238],
                          [55.746, 37.27],
                          [-3.062, -3.498],
                          [-10.37, 36.46],
                          [-26.407, -32.011],
                          [10.984, -25.569],
                          [14.991, -4.606],
                          [-1.988, -9.271],
                          [9.274, -100.525],
                          [18.508, 6.574],
                          [-0.154, 7.556],
                          [0, 0]
                        ],
                        v: [
                          [180.746, -119.576],
                          [135.567, -166.088],
                          [-58.903, -40.629],
                          [-57.267, -29.064],
                          [-31.171, 0.958],
                          [-61.958, -26.888],
                          [-98.6, -23.601],
                          [-113.024, 157.69],
                          [-9.128, 118.717],
                          [-0.344, 142.502],
                          [-140.924, 139.095],
                          [-157.836, 26.15],
                          [-101.677, -27.272],
                          [-62.773, -30.324],
                          [-64.301, -64.096],
                          [134.219, -169.228],
                          [182.549, -121.336],
                          [179.199, -119.19]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 2',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'mm',
                    mm: 1,
                    nm: 'Merge Paths 1',
                    mn: 'ADBE Vector Filter - Merge',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [0.905999995213, 0.317999985639, 0.263000009574, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [190.925, 197.18], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 1',
                np: 4,
                cix: 2,
                ix: 1,
                mn: 'ADBE Vector Group',
                hd: !1
              }
            ],
            ip: 0,
            op: 317.000012911675,
            st: 0,
            bm: 0
          },
          {
            ddd: 0,
            ind: 2,
            ty: 4,
            nm: 'Layer 7 Outlines',
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 },
              r: { a: 0, k: 0, ix: 10 },
              p: { a: 0, k: [589.203, 491.397, 0], ix: 2 },
              a: { a: 0, k: [252.308, 244.856, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [5.008, -14.021],
                          [0, 0],
                          [-21.682, 8.508]
                        ],
                        o: [
                          [0, 0],
                          [2.299, -16.621],
                          [-28.435, 7.035]
                        ],
                        v: [
                          [-20.614, 12.311],
                          [-17.972, 20.74],
                          [20.614, -20.74]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [0.905999995213, 0.317999985639, 0.263000009574, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [211.295, 27.933], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 1',
                np: 2,
                cix: 2,
                ix: 1,
                mn: 'ADBE Vector Group',
                hd: !1
              },
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [11.827, -4.641],
                          [-9.534, 1.079],
                          [-5.529, 0.012]
                        ],
                        o: [
                          [6.869, -1.7],
                          [5.434, -1.001],
                          [-15.182, -1.261]
                        ],
                        v: [
                          [-20.47, 3.471],
                          [3.994, -0.72],
                          [20.47, -2.21]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [0.905999995213, 0.317999985639, 0.263000009574, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [252.379, 3.721], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 2',
                np: 2,
                cix: 2,
                ix: 2,
                mn: 'ADBE Vector Group',
                hd: !1
              },
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [28.477, 7.245],
                          [-58.193, 4.999],
                          [-6.082, -0.415]
                        ],
                        o: [
                          [-27.037, -6.879],
                          [6.576, -0.564],
                          [-11.538, 30.872]
                        ],
                        v: [
                          [49.307, -69.548],
                          [97.647, -114.941],
                          [116.628, -115.125]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ind: 1,
                    ty: 'sh',
                    ix: 2,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [49.376, 79.967],
                          [31.01, 4.239],
                          [61.458, -0.125],
                          [-22.881, -17.601],
                          [10.161, -31.133],
                          [14.752, -4.925],
                          [-39.335, 66.688],
                          [-2.15, 5.952],
                          [75.697, -66.605],
                          [62.283, 12.156],
                          [-56.739, -32.232],
                          [-2.122, 39.448],
                          [0.564, -0.997],
                          [0.54, -1.36],
                          [11.538, -7.508],
                          [-34.888, 44.303],
                          [-60.166, -9.543]
                        ],
                        o: [
                          [-17.808, -28.84],
                          [21.457, -67.206],
                          [20.423, 1.697],
                          [35.769, 27.516],
                          [-16.062, -1.386],
                          [-89.861, 29.99],
                          [3.559, -6.034],
                          [97.957, 11.948],
                          [-58.15, 51.164],
                          [-196.372, -38.328],
                          [34.443, 19.568],
                          [0.368, -6.84],
                          [-0.204, 0.36],
                          [-4.343, 9.349],
                          [-46.081, 29.986],
                          [53.803, -68.323],
                          [163.712, 25.968]
                        ],
                        v: [
                          [202.682, -68.746],
                          [123.951, -118.077],
                          [20.542, -243.913],
                          [86.531, -216.471],
                          [117.904, -118.755],
                          [70.927, -113.409],
                          [114.227, -96.56],
                          [122.751, -114.557],
                          [173.862, 99.776],
                          [-31.945, 109.299],
                          [-195.318, 218.406],
                          [-111.379, 174.241],
                          [-115.133, 177.167],
                          [-117.602, 184.598],
                          [-140.854, 214.052],
                          [-204.848, 142.884],
                          [48.573, 130.552]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 2',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'mm',
                    mm: 1,
                    nm: 'Merge Paths 1',
                    mn: 'ADBE Vector Filter - Merge',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [0.905999995213, 0.317999985639, 0.263000009574, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [252.308, 245.424], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 3',
                np: 4,
                cix: 2,
                ix: 3,
                mn: 'ADBE Vector Group',
                hd: !1
              }
            ],
            ip: 0,
            op: 317.000012911675,
            st: 0,
            bm: 0
          }
        ]
      },
      {
        id: 'comp_2',
        layers: [
          {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: 'Layer 2 Outlines 2',
            parent: 2,
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 },
              r: {
                a: 1,
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 103,
                    s: [0],
                    e: [7]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 107,
                    s: [7],
                    e: [2]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 113,
                    s: [2],
                    e: [4]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 125,
                    s: [4],
                    e: [0]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 140,
                    s: [0],
                    e: [0]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 158,
                    s: [0],
                    e: [7]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 162,
                    s: [7],
                    e: [2]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 168,
                    s: [2],
                    e: [4]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 180,
                    s: [4],
                    e: [0]
                  },
                  { t: 195.000007942513 }
                ],
                ix: 10
              },
              p: { a: 0, k: [94.935, 170.627, 0], ix: 2 },
              a: { a: 0, k: [285.983, 50.855, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [-37.433, -45.657],
                          [0, 0],
                          [44.305, 54.038],
                          [0, 0]
                        ],
                        o: [
                          [0, 0],
                          [53.575, -44.659],
                          [0, 0],
                          [-45.659, 37.432]
                        ],
                        v: [
                          [-18.312, 73.502],
                          [-5.5, 89.131],
                          [11.441, -89.131],
                          [-3.42, -76.947]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0.219999994016, 0.093999997307, 0.008000000785, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 1,
                    lj: 1,
                    ml: 10,
                    ml2: { a: 0, k: 10, ix: 8 },
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [90.745, 316.298], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 1',
                np: 3,
                cix: 2,
                ix: 1,
                mn: 'ADBE Vector Group',
                hd: !1
              },
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0.926, 1.13],
                          [0, 0],
                          [-1.13, 0.927],
                          [0, 0],
                          [-0.926, -1.129],
                          [0, 0],
                          [1.129, -0.926],
                          [0, 0]
                        ],
                        o: [
                          [0, 0],
                          [-0.926, -1.129],
                          [0, 0],
                          [1.129, -0.926],
                          [0, 0],
                          [0.926, 1.129],
                          [0, 0],
                          [-1.129, 0.926]
                        ],
                        v: [
                          [69.77, 151.369],
                          [-134.754, -98.091],
                          [-134.384, -101.828],
                          [-73.506, -151.739],
                          [-69.77, -151.369],
                          [134.754, 98.092],
                          [134.384, 101.829],
                          [73.506, 151.74]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0.219999994016, 0.093999997307, 0.008000000785, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 1,
                    lj: 1,
                    ml: 10,
                    ml2: { a: 0, k: 10, ix: 8 },
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [361.287, 187.665], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 2',
                np: 3,
                cix: 2,
                ix: 2,
                mn: 'ADBE Vector Group',
                hd: !1
              },
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [47.204, 57.575],
                          [-15.853, 12.997],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-37.433, -45.657],
                          [0, 0],
                          [-56.595, 42.107]
                        ],
                        o: [
                          [-12.997, -15.853],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-45.658, 37.432],
                          [0, 0],
                          [44.724, 54.551],
                          [60.425, -44.959]
                        ],
                        v: [
                          [144.606, 39.928],
                          [149.776, -12.31],
                          [217.321, -67.687],
                          [51.201, -270.306],
                          [-164.996, -93.054],
                          [-179.888, 57.395],
                          [-60.361, 203.186],
                          [121.363, 228.199]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0.219999994016, 0.093999997307, 0.008000000785, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 1,
                    lj: 1,
                    ml: 10,
                    ml2: { a: 0, k: 10, ix: 8 },
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [0.757000014361, 0.152999997606, 0.176000004189, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [252.321, 332.405], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 3',
                np: 3,
                cix: 2,
                ix: 3,
                mn: 'ADBE Vector Group',
                hd: !1
              }
            ],
            ip: 103.000004195276,
            op: 224.000009123707,
            st: 103.000004195276,
            bm: 0
          },
          {
            ddd: 0,
            ind: 2,
            ty: 4,
            nm: 'day 3',
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 },
              r: {
                a: 1,
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 103,
                    s: [0],
                    e: [9]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 107,
                    s: [9],
                    e: [-11]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 113,
                    s: [-11],
                    e: [4]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 125,
                    s: [4],
                    e: [0]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 140,
                    s: [0],
                    e: [0]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 158,
                    s: [0],
                    e: [9]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 162,
                    s: [9],
                    e: [-11]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 168,
                    s: [-11],
                    e: [4]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 180,
                    s: [4],
                    e: [0]
                  },
                  { t: 195.000007942513 }
                ],
                ix: 10
              },
              p: { a: 0, k: [954.23, 191.28, 0], ix: 2 },
              a: { a: 0, k: [101.745, 44.506, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0, 0],
                          [-65.744, 0]
                        ],
                        o: [
                          [0, 0],
                          [65.745, 0]
                        ],
                        v: [
                          [0, 65.505],
                          [0, -65.505]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0.219999994016, 0.093999997307, 0.008000000785, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 1,
                    lj: 1,
                    ml: 10,
                    ml2: { a: 0, k: 10, ix: 8 },
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [100.744, 100.506], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 1',
                np: 3,
                cix: 2,
                ix: 1,
                mn: 'ADBE Vector Group',
                hd: !1
              }
            ],
            ip: 103.000004195276,
            op: 224.000009123707,
            st: 103.000004195276,
            bm: 0
          },
          {
            ddd: 0,
            ind: 3,
            ty: 4,
            nm: 'Layer 4 Outlines 2',
            parent: 4,
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 },
              r: {
                a: 1,
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 103,
                    s: [0],
                    e: [-5]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 107,
                    s: [-5],
                    e: [-3]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 113,
                    s: [-3],
                    e: [2]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 125,
                    s: [2],
                    e: [0]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 140,
                    s: [0],
                    e: [0]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 158,
                    s: [0],
                    e: [-5]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 162,
                    s: [-5],
                    e: [-3]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 168,
                    s: [-3],
                    e: [2]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 180,
                    s: [2],
                    e: [0]
                  },
                  { t: 195.000007942513 }
                ],
                ix: 10
              },
              p: { a: 0, k: [106.934, 166.627, 0], ix: 2 },
              a: { a: 0, k: [297.983, 46.855, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [-37.433, -45.657],
                          [0, 0],
                          [44.305, 54.038],
                          [0, 0]
                        ],
                        o: [
                          [0, 0],
                          [53.575, -44.659],
                          [0, 0],
                          [-45.658, 37.432]
                        ],
                        v: [
                          [-18.312, 73.502],
                          [-5.499, 89.131],
                          [11.441, -89.131],
                          [-3.42, -76.947]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0.219999994016, 0.093999997307, 0.008000000785, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 1,
                    lj: 1,
                    ml: 10,
                    ml2: { a: 0, k: 10, ix: 8 },
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [90.746, 316.298], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 1',
                np: 3,
                cix: 2,
                ix: 1,
                mn: 'ADBE Vector Group',
                hd: !1
              },
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0.926, 1.13],
                          [0, 0],
                          [-1.129, 0.927],
                          [0, 0],
                          [-0.926, -1.129],
                          [0, 0],
                          [1.13, -0.926],
                          [0, 0]
                        ],
                        o: [
                          [0, 0],
                          [-0.926, -1.129],
                          [0, 0],
                          [1.13, -0.926],
                          [0, 0],
                          [0.926, 1.129],
                          [0, 0],
                          [-1.13, 0.926]
                        ],
                        v: [
                          [69.77, 151.369],
                          [-134.753, -98.091],
                          [-134.385, -101.828],
                          [-73.506, -151.739],
                          [-69.769, -151.369],
                          [134.753, 98.092],
                          [134.383, 101.829],
                          [73.507, 151.74]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0.219999994016, 0.093999997307, 0.008000000785, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 1,
                    lj: 1,
                    ml: 10,
                    ml2: { a: 0, k: 10, ix: 8 },
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [361.287, 187.665], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 2',
                np: 3,
                cix: 2,
                ix: 2,
                mn: 'ADBE Vector Group',
                hd: !1
              },
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [47.204, 57.575],
                          [-15.854, 12.997],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-37.433, -45.657],
                          [0, 0],
                          [-56.595, 42.107]
                        ],
                        o: [
                          [-12.997, -15.853],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-45.658, 37.432],
                          [0, 0],
                          [44.724, 54.551],
                          [60.425, -44.959]
                        ],
                        v: [
                          [144.606, 39.928],
                          [149.777, -12.31],
                          [217.321, -67.687],
                          [51.202, -270.306],
                          [-164.995, -93.054],
                          [-179.888, 57.395],
                          [-60.36, 203.186],
                          [121.363, 228.199]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0.219999994016, 0.093999997307, 0.008000000785, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 1,
                    lj: 1,
                    ml: 10,
                    ml2: { a: 0, k: 10, ix: 8 },
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [0.093999997307, 0.607999973671, 0.238999998803, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [252.321, 332.405], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 3',
                np: 3,
                cix: 2,
                ix: 3,
                mn: 'ADBE Vector Group',
                hd: !1
              }
            ],
            ip: 103.000004195276,
            op: 224.000009123707,
            st: 103.000004195276,
            bm: 0
          },
          {
            ddd: 0,
            ind: 4,
            ty: 4,
            nm: 'day 2',
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 },
              r: {
                a: 1,
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 103,
                    s: [0],
                    e: [-5]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 107,
                    s: [-5],
                    e: [7]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 113,
                    s: [7],
                    e: [-4]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 125,
                    s: [-4],
                    e: [0]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 140,
                    s: [0],
                    e: [0]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 158,
                    s: [0],
                    e: [-5]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 162,
                    s: [-5],
                    e: [7]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 168,
                    s: [7],
                    e: [-4]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 180,
                    s: [-4],
                    e: [0]
                  },
                  { t: 195.000007942513 }
                ],
                ix: 10
              },
              p: { a: 0, k: [1003.855, 192.28, 0], ix: 2 },
              a: { a: 0, k: [101.744, 45.506, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0, 0],
                          [-65.744, 0]
                        ],
                        o: [
                          [0, 0],
                          [65.744, 0]
                        ],
                        v: [
                          [0, 65.505],
                          [0, -65.505]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0.219999994016, 0.093999997307, 0.008000000785, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 1,
                    lj: 1,
                    ml: 10,
                    ml2: { a: 0, k: 10, ix: 8 },
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [100.744, 100.506], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 1',
                np: 3,
                cix: 2,
                ix: 1,
                mn: 'ADBE Vector Group',
                hd: !1
              }
            ],
            ip: 103.000004195276,
            op: 224.000009123707,
            st: 103.000004195276,
            bm: 0
          },
          {
            ddd: 0,
            ind: 5,
            ty: 4,
            nm: 'Layer 2 Outlines',
            parent: 6,
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 },
              r: {
                a: 1,
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 0,
                    s: [0],
                    e: [7]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 4,
                    s: [7],
                    e: [2]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 10,
                    s: [2],
                    e: [4]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 22,
                    s: [4],
                    e: [0]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 37,
                    s: [0],
                    e: [0]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 55,
                    s: [0],
                    e: [7]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 59,
                    s: [7],
                    e: [2]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 65,
                    s: [2],
                    e: [4]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 77,
                    s: [4],
                    e: [0]
                  },
                  { t: 92.0000037472368 }
                ],
                ix: 10
              },
              p: { a: 0, k: [94.935, 170.627, 0], ix: 2 },
              a: { a: 0, k: [285.983, 50.855, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [-37.433, -45.657],
                          [0, 0],
                          [44.305, 54.038],
                          [0, 0]
                        ],
                        o: [
                          [0, 0],
                          [53.575, -44.659],
                          [0, 0],
                          [-45.659, 37.432]
                        ],
                        v: [
                          [-18.312, 73.502],
                          [-5.5, 89.131],
                          [11.441, -89.131],
                          [-3.42, -76.947]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0.219999994016, 0.093999997307, 0.008000000785, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 1,
                    lj: 1,
                    ml: 10,
                    ml2: { a: 0, k: 10, ix: 8 },
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [90.745, 316.298], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 1',
                np: 3,
                cix: 2,
                ix: 1,
                mn: 'ADBE Vector Group',
                hd: !1
              },
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0.926, 1.13],
                          [0, 0],
                          [-1.13, 0.927],
                          [0, 0],
                          [-0.926, -1.129],
                          [0, 0],
                          [1.129, -0.926],
                          [0, 0]
                        ],
                        o: [
                          [0, 0],
                          [-0.926, -1.129],
                          [0, 0],
                          [1.129, -0.926],
                          [0, 0],
                          [0.926, 1.129],
                          [0, 0],
                          [-1.129, 0.926]
                        ],
                        v: [
                          [69.77, 151.369],
                          [-134.754, -98.091],
                          [-134.384, -101.828],
                          [-73.506, -151.739],
                          [-69.77, -151.369],
                          [134.754, 98.092],
                          [134.384, 101.829],
                          [73.506, 151.74]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0.219999994016, 0.093999997307, 0.008000000785, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 1,
                    lj: 1,
                    ml: 10,
                    ml2: { a: 0, k: 10, ix: 8 },
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [361.287, 187.665], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 2',
                np: 3,
                cix: 2,
                ix: 2,
                mn: 'ADBE Vector Group',
                hd: !1
              },
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [47.204, 57.575],
                          [-15.853, 12.997],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-37.433, -45.657],
                          [0, 0],
                          [-56.595, 42.107]
                        ],
                        o: [
                          [-12.997, -15.853],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-45.658, 37.432],
                          [0, 0],
                          [44.724, 54.551],
                          [60.425, -44.959]
                        ],
                        v: [
                          [144.606, 39.928],
                          [149.776, -12.31],
                          [217.321, -67.687],
                          [51.201, -270.306],
                          [-164.996, -93.054],
                          [-179.888, 57.395],
                          [-60.361, 203.186],
                          [121.363, 228.199]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0.219999994016, 0.093999997307, 0.008000000785, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 1,
                    lj: 1,
                    ml: 10,
                    ml2: { a: 0, k: 10, ix: 8 },
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [0.757000014361, 0.152999997606, 0.176000004189, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [252.321, 332.405], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 3',
                np: 3,
                cix: 2,
                ix: 3,
                mn: 'ADBE Vector Group',
                hd: !1
              }
            ],
            ip: 0,
            op: 104.000004236007,
            st: 0,
            bm: 0
          },
          {
            ddd: 0,
            ind: 6,
            ty: 4,
            nm: 'day',
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 },
              r: {
                a: 1,
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 0,
                    s: [0],
                    e: [9]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 4,
                    s: [9],
                    e: [-11]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 10,
                    s: [-11],
                    e: [4]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 22,
                    s: [4],
                    e: [0]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 37,
                    s: [0],
                    e: [0]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 55,
                    s: [0],
                    e: [9]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 59,
                    s: [9],
                    e: [-11]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 65,
                    s: [-11],
                    e: [4]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 77,
                    s: [4],
                    e: [0]
                  },
                  { t: 92.0000037472368 }
                ],
                ix: 10
              },
              p: { a: 0, k: [954.23, 191.28, 0], ix: 2 },
              a: { a: 0, k: [101.745, 44.506, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0, 0],
                          [-65.744, 0]
                        ],
                        o: [
                          [0, 0],
                          [65.745, 0]
                        ],
                        v: [
                          [0, 65.505],
                          [0, -65.505]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0.219999994016, 0.093999997307, 0.008000000785, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 1,
                    lj: 1,
                    ml: 10,
                    ml2: { a: 0, k: 10, ix: 8 },
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [100.744, 100.506], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 1',
                np: 3,
                cix: 2,
                ix: 1,
                mn: 'ADBE Vector Group',
                hd: !1
              }
            ],
            ip: 0,
            op: 104.000004236007,
            st: 0,
            bm: 0
          },
          {
            ddd: 0,
            ind: 7,
            ty: 4,
            nm: 'Layer 4 Outlines',
            parent: 8,
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 },
              r: {
                a: 1,
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 0,
                    s: [0],
                    e: [-5]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 4,
                    s: [-5],
                    e: [-3]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 10,
                    s: [-3],
                    e: [2]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 22,
                    s: [2],
                    e: [0]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 37,
                    s: [0],
                    e: [0]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 55,
                    s: [0],
                    e: [-5]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 59,
                    s: [-5],
                    e: [-3]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 65,
                    s: [-3],
                    e: [2]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 77,
                    s: [2],
                    e: [0]
                  },
                  { t: 92.0000037472368 }
                ],
                ix: 10
              },
              p: { a: 0, k: [106.934, 166.627, 0], ix: 2 },
              a: { a: 0, k: [297.983, 46.855, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [-37.433, -45.657],
                          [0, 0],
                          [44.305, 54.038],
                          [0, 0]
                        ],
                        o: [
                          [0, 0],
                          [53.575, -44.659],
                          [0, 0],
                          [-45.658, 37.432]
                        ],
                        v: [
                          [-18.312, 73.502],
                          [-5.499, 89.131],
                          [11.441, -89.131],
                          [-3.42, -76.947]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0.219999994016, 0.093999997307, 0.008000000785, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 1,
                    lj: 1,
                    ml: 10,
                    ml2: { a: 0, k: 10, ix: 8 },
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [90.746, 316.298], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 1',
                np: 3,
                cix: 2,
                ix: 1,
                mn: 'ADBE Vector Group',
                hd: !1
              },
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0.926, 1.13],
                          [0, 0],
                          [-1.129, 0.927],
                          [0, 0],
                          [-0.926, -1.129],
                          [0, 0],
                          [1.13, -0.926],
                          [0, 0]
                        ],
                        o: [
                          [0, 0],
                          [-0.926, -1.129],
                          [0, 0],
                          [1.13, -0.926],
                          [0, 0],
                          [0.926, 1.129],
                          [0, 0],
                          [-1.13, 0.926]
                        ],
                        v: [
                          [69.77, 151.369],
                          [-134.753, -98.091],
                          [-134.385, -101.828],
                          [-73.506, -151.739],
                          [-69.769, -151.369],
                          [134.753, 98.092],
                          [134.383, 101.829],
                          [73.507, 151.74]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0.219999994016, 0.093999997307, 0.008000000785, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 1,
                    lj: 1,
                    ml: 10,
                    ml2: { a: 0, k: 10, ix: 8 },
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [361.287, 187.665], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 2',
                np: 3,
                cix: 2,
                ix: 2,
                mn: 'ADBE Vector Group',
                hd: !1
              },
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [47.204, 57.575],
                          [-15.854, 12.997],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-37.433, -45.657],
                          [0, 0],
                          [-56.595, 42.107]
                        ],
                        o: [
                          [-12.997, -15.853],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [-45.658, 37.432],
                          [0, 0],
                          [44.724, 54.551],
                          [60.425, -44.959]
                        ],
                        v: [
                          [144.606, 39.928],
                          [149.777, -12.31],
                          [217.321, -67.687],
                          [51.202, -270.306],
                          [-164.995, -93.054],
                          [-179.888, 57.395],
                          [-60.36, 203.186],
                          [121.363, 228.199]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0.219999994016, 0.093999997307, 0.008000000785, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 1,
                    lj: 1,
                    ml: 10,
                    ml2: { a: 0, k: 10, ix: 8 },
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'fl',
                    c: { a: 0, k: [0.093999997307, 0.607999973671, 0.238999998803, 1], ix: 4 },
                    o: { a: 0, k: 100, ix: 5 },
                    r: 1,
                    nm: 'Fill 1',
                    mn: 'ADBE Vector Graphic - Fill',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [252.321, 332.405], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 3',
                np: 3,
                cix: 2,
                ix: 3,
                mn: 'ADBE Vector Group',
                hd: !1
              }
            ],
            ip: 0,
            op: 104.000004236007,
            st: 0,
            bm: 0
          },
          {
            ddd: 0,
            ind: 8,
            ty: 4,
            nm: 'day',
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 },
              r: {
                a: 1,
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 0,
                    s: [0],
                    e: [-5]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 4,
                    s: [-5],
                    e: [7]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 10,
                    s: [7],
                    e: [-4]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 22,
                    s: [-4],
                    e: [0]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 37,
                    s: [0],
                    e: [0]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 55,
                    s: [0],
                    e: [-5]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 59,
                    s: [-5],
                    e: [7]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 65,
                    s: [7],
                    e: [-4]
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ['0p833_0p833_0p167_0p167'],
                    t: 77,
                    s: [-4],
                    e: [0]
                  },
                  { t: 92.0000037472368 }
                ],
                ix: 10
              },
              p: { a: 0, k: [1003.855, 192.28, 0], ix: 2 },
              a: { a: 0, k: [101.744, 45.506, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ind: 0,
                    ty: 'sh',
                    ix: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0, 0],
                          [-65.744, 0]
                        ],
                        o: [
                          [0, 0],
                          [65.744, 0]
                        ],
                        v: [
                          [0, 65.505],
                          [0, -65.505]
                        ],
                        c: !0
                      },
                      ix: 2
                    },
                    nm: 'Path 1',
                    mn: 'ADBE Vector Shape - Group',
                    hd: !1
                  },
                  {
                    ty: 'st',
                    c: { a: 0, k: [0.219999994016, 0.093999997307, 0.008000000785, 1], ix: 3 },
                    o: { a: 0, k: 100, ix: 4 },
                    w: { a: 0, k: 14, ix: 5 },
                    lc: 1,
                    lj: 1,
                    ml: 10,
                    ml2: { a: 0, k: 10, ix: 8 },
                    nm: 'Stroke 1',
                    mn: 'ADBE Vector Graphic - Stroke',
                    hd: !1
                  },
                  {
                    ty: 'tr',
                    p: { a: 0, k: [100.744, 100.506], ix: 2 },
                    a: { a: 0, k: [0, 0], ix: 1 },
                    s: { a: 0, k: [100, 100], ix: 3 },
                    r: { a: 0, k: 0, ix: 6 },
                    o: { a: 0, k: 100, ix: 7 },
                    sk: { a: 0, k: 0, ix: 4 },
                    sa: { a: 0, k: 0, ix: 5 },
                    nm: 'Transform'
                  }
                ],
                nm: 'Group 1',
                np: 3,
                cix: 2,
                ix: 1,
                mn: 'ADBE Vector Group',
                hd: !1
              }
            ],
            ip: 0,
            op: 104.000004236007,
            st: 0,
            bm: 0
          }
        ]
      }
    ],
    layers = [
      {
        ddd: 0,
        ind: 1,
        ty: 0,
        nm: 'text',
        refId: 'comp_0',
        sr: 1,
        ks: {
          o: { a: 0, k: 100, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [500, 400, 0], ix: 2 },
          a: { a: 0, k: [500, 500, 0], ix: 1 },
          s: { a: 0, k: [100, 100, 100], ix: 6 }
        },
        ao: 0,
        w: 1e3,
        h: 1e3,
        ip: 3.00000012219251,
        op: 202.000008227629,
        st: 3.00000012219251,
        bm: 0
      },
      {
        ddd: 0,
        ind: 2,
        ty: 0,
        nm: 'text',
        refId: 'comp_0',
        sr: 1,
        ks: {
          o: { a: 0, k: 60, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [500, 400, 0], ix: 2 },
          a: { a: 0, k: [500, 500, 0], ix: 1 },
          s: { a: 0, k: [100, 100, 100], ix: 6 }
        },
        ao: 0,
        w: 1e3,
        h: 1e3,
        ip: 2.00000008146167,
        op: 202.000008227629,
        st: 2.00000008146167,
        bm: 0
      },
      {
        ddd: 0,
        ind: 3,
        ty: 0,
        nm: 'text',
        refId: 'comp_0',
        sr: 1,
        ks: {
          o: { a: 0, k: 100, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [500, 400, 0], ix: 2 },
          a: { a: 0, k: [500, 500, 0], ix: 1 },
          s: { a: 0, k: [100, 100, 100], ix: 6 }
        },
        ao: 0,
        ef: [
          {
            ty: 21,
            nm: 'Fill',
            np: 9,
            mn: 'ADBE Fill',
            ix: 1,
            en: 1,
            ef: [
              { ty: 10, nm: 'Fill Mask', mn: 'ADBE Fill-0001', ix: 1, v: { a: 0, k: 0, ix: 1 } },
              { ty: 7, nm: 'All Masks', mn: 'ADBE Fill-0007', ix: 2, v: { a: 0, k: 0, ix: 2 } },
              {
                ty: 2,
                nm: 'Color',
                mn: 'ADBE Fill-0002',
                ix: 3,
                v: { a: 0, k: [0.049473602325, 0.647870719433, 0.516256272793, 1], ix: 3 }
              },
              { ty: 7, nm: 'Invert', mn: 'ADBE Fill-0006', ix: 4, v: { a: 0, k: 0, ix: 4 } },
              {
                ty: 0,
                nm: 'Horizontal Feather',
                mn: 'ADBE Fill-0003',
                ix: 5,
                v: { a: 0, k: 0, ix: 5 }
              },
              {
                ty: 0,
                nm: 'Vertical Feather',
                mn: 'ADBE Fill-0004',
                ix: 6,
                v: { a: 0, k: 0, ix: 6 }
              },
              { ty: 0, nm: 'Opacity', mn: 'ADBE Fill-0005', ix: 7, v: { a: 0, k: 1, ix: 7 } }
            ]
          }
        ],
        w: 1e3,
        h: 1e3,
        ip: 0,
        op: 202.000008227629,
        st: 0,
        bm: 0
      },
      {
        ddd: 0,
        ind: 4,
        ty: 4,
        nm: 'Shape Layer 5',
        td: 1,
        sr: 1,
        ks: {
          o: { a: 0, k: 100, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [500, 400, 0], ix: 2 },
          a: { a: 0, k: [0, 0, 0], ix: 1 },
          s: { a: 0, k: [100, 100, 100], ix: 6 }
        },
        ao: 0,
        shapes: [
          {
            ty: 'gr',
            it: [
              {
                ind: 0,
                ty: 'sh',
                ix: 1,
                ks: {
                  a: 0,
                  k: {
                    i: [
                      [0, 0],
                      [54, -12],
                      [-2.356, 85.991],
                      [-14, 0],
                      [13.124, -25.055],
                      [-18, 46],
                      [-60, 8],
                      [8, -35],
                      [-61, -2],
                      [-16.92, -37.6],
                      [41, -18],
                      [-2, 12],
                      [-20, 0],
                      [-22, -32],
                      [28, -58],
                      [78, 10],
                      [36, -10],
                      [5, -50],
                      [-15, 78]
                    ],
                    o: [
                      [0, 0],
                      [-45.953, 10.212],
                      [2, -73],
                      [14, 0],
                      [-11, 21],
                      [18, -46],
                      [60, -8],
                      [-2, -8],
                      [48.016, 1.574],
                      [18, 40],
                      [-39.532, 17.356],
                      [2, -12],
                      [20, 0],
                      [22, 32],
                      [-28, 58],
                      [-78, -10],
                      [-36, 10],
                      [-4.78, 47.803],
                      [16.567, -86.148]
                    ],
                    v: [
                      [-156, 44],
                      [-191, 94],
                      [-312, -8],
                      [-242, -106],
                      [-182, -80],
                      [-205, -166],
                      [-96, -252],
                      [32, -196],
                      [93, -251],
                      [207, -191],
                      [172, -80],
                      [126, -94],
                      [174, -124],
                      [276, -93],
                      [300, 42],
                      [156, 121],
                      [-46, 96],
                      [-130, 164],
                      [-26, 168]
                    ],
                    c: !1
                  },
                  ix: 2
                },
                nm: 'Path 1',
                mn: 'ADBE Vector Shape - Group',
                hd: !1
              },
              {
                ty: 'st',
                c: { a: 0, k: [0, 0, 0, 1], ix: 3 },
                o: { a: 0, k: 100, ix: 4 },
                w: { a: 0, k: 9, ix: 5 },
                lc: 2,
                lj: 2,
                nm: 'Stroke 1',
                mn: 'ADBE Vector Graphic - Stroke',
                hd: !1
              },
              {
                ty: 'tr',
                p: { a: 0, k: [0, 0], ix: 2 },
                a: { a: 0, k: [0, 0], ix: 1 },
                s: { a: 0, k: [100, 100], ix: 3 },
                r: { a: 0, k: 0, ix: 6 },
                o: { a: 0, k: 100, ix: 7 },
                sk: { a: 0, k: 0, ix: 4 },
                sa: { a: 0, k: 0, ix: 5 },
                nm: 'Transform'
              }
            ],
            nm: 'Shape 1',
            np: 3,
            cix: 2,
            ix: 1,
            mn: 'ADBE Vector Group',
            hd: !1
          },
          {
            ty: 'tm',
            s: {
              a: 1,
              k: [
                {
                  i: { x: [0.667], y: [1] },
                  o: { x: [0.333], y: [0] },
                  n: ['0p667_1_0p333_0'],
                  t: 25,
                  s: [50],
                  e: [0]
                },
                { t: 135.000005498663 }
              ],
              ix: 1
            },
            e: {
              a: 1,
              k: [
                {
                  i: { x: [0.667], y: [1] },
                  o: { x: [0.333], y: [0] },
                  n: ['0p667_1_0p333_0'],
                  t: 25,
                  s: [50],
                  e: [100]
                },
                { t: 135.000005498663 }
              ],
              ix: 2
            },
            o: { a: 0, k: 0, ix: 3 },
            m: 1,
            ix: 2,
            nm: 'Trim Paths 1',
            mn: 'ADBE Vector Filter - Trim',
            hd: !1
          }
        ],
        ip: 2.00000008146167,
        op: 202.000008227629,
        st: 2.00000008146167,
        bm: 0
      },
      {
        ddd: 0,
        ind: 5,
        ty: 0,
        nm: 'ornament',
        tt: 1,
        refId: 'comp_1',
        sr: 1,
        ks: {
          o: { a: 0, k: 100, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [500, 400, 0], ix: 2 },
          a: { a: 0, k: [500, 500, 0], ix: 1 },
          s: { a: 0, k: [100, 100, 100], ix: 6 }
        },
        ao: 0,
        ef: [
          {
            ty: 21,
            nm: 'Fill',
            np: 9,
            mn: 'ADBE Fill',
            ix: 1,
            en: 1,
            ef: [
              { ty: 10, nm: 'Fill Mask', mn: 'ADBE Fill-0001', ix: 1, v: { a: 0, k: 0, ix: 1 } },
              { ty: 7, nm: 'All Masks', mn: 'ADBE Fill-0007', ix: 2, v: { a: 0, k: 0, ix: 2 } },
              {
                ty: 2,
                nm: 'Color',
                mn: 'ADBE Fill-0002',
                ix: 3,
                v: { a: 0, k: [0.002530399943, 0.805775105953, 0.64741486311, 1], ix: 3 }
              },
              { ty: 7, nm: 'Invert', mn: 'ADBE Fill-0006', ix: 4, v: { a: 0, k: 0, ix: 4 } },
              {
                ty: 0,
                nm: 'Horizontal Feather',
                mn: 'ADBE Fill-0003',
                ix: 5,
                v: { a: 0, k: 0, ix: 5 }
              },
              {
                ty: 0,
                nm: 'Vertical Feather',
                mn: 'ADBE Fill-0004',
                ix: 6,
                v: { a: 0, k: 0, ix: 6 }
              },
              { ty: 0, nm: 'Opacity', mn: 'ADBE Fill-0005', ix: 7, v: { a: 0, k: 1, ix: 7 } }
            ]
          }
        ],
        w: 1e3,
        h: 1e3,
        ip: 2.00000008146167,
        op: 202.000008227629,
        st: 2.00000008146167,
        bm: 0
      },
      {
        ddd: 0,
        ind: 6,
        ty: 4,
        nm: 'Shape Layer 4',
        td: 1,
        sr: 1,
        ks: {
          o: { a: 0, k: 100, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [500, 400, 0], ix: 2 },
          a: { a: 0, k: [0, 0, 0], ix: 1 },
          s: { a: 0, k: [100, 100, 100], ix: 6 }
        },
        ao: 0,
        shapes: [
          {
            ty: 'gr',
            it: [
              {
                ind: 0,
                ty: 'sh',
                ix: 1,
                ks: {
                  a: 0,
                  k: {
                    i: [
                      [0, 0],
                      [54, -12],
                      [-2.356, 85.991],
                      [-14, 0],
                      [13.124, -25.055],
                      [-18, 46],
                      [-60, 8],
                      [8, -35],
                      [-61, -2],
                      [-16.92, -37.6],
                      [41, -18],
                      [-2, 12],
                      [-20, 0],
                      [-22, -32],
                      [28, -58],
                      [78, 10],
                      [36, -10],
                      [5, -50],
                      [-15, 78]
                    ],
                    o: [
                      [0, 0],
                      [-45.953, 10.212],
                      [2, -73],
                      [14, 0],
                      [-11, 21],
                      [18, -46],
                      [60, -8],
                      [-2, -8],
                      [48.016, 1.574],
                      [18, 40],
                      [-39.532, 17.356],
                      [2, -12],
                      [20, 0],
                      [22, 32],
                      [-28, 58],
                      [-78, -10],
                      [-36, 10],
                      [-4.78, 47.803],
                      [16.567, -86.148]
                    ],
                    v: [
                      [-156, 44],
                      [-191, 94],
                      [-312, -8],
                      [-242, -106],
                      [-182, -80],
                      [-205, -166],
                      [-96, -252],
                      [32, -196],
                      [93, -251],
                      [207, -191],
                      [172, -80],
                      [126, -94],
                      [174, -124],
                      [276, -93],
                      [300, 42],
                      [156, 121],
                      [-46, 96],
                      [-130, 164],
                      [-26, 168]
                    ],
                    c: !1
                  },
                  ix: 2
                },
                nm: 'Path 1',
                mn: 'ADBE Vector Shape - Group',
                hd: !1
              },
              {
                ty: 'st',
                c: { a: 0, k: [0, 0, 0, 1], ix: 3 },
                o: { a: 0, k: 100, ix: 4 },
                w: { a: 0, k: 9, ix: 5 },
                lc: 2,
                lj: 2,
                nm: 'Stroke 1',
                mn: 'ADBE Vector Graphic - Stroke',
                hd: !1
              },
              {
                ty: 'tr',
                p: { a: 0, k: [0, 0], ix: 2 },
                a: { a: 0, k: [0, 0], ix: 1 },
                s: { a: 0, k: [100, 100], ix: 3 },
                r: { a: 0, k: 0, ix: 6 },
                o: { a: 0, k: 100, ix: 7 },
                sk: { a: 0, k: 0, ix: 4 },
                sa: { a: 0, k: 0, ix: 5 },
                nm: 'Transform'
              }
            ],
            nm: 'Shape 1',
            np: 3,
            cix: 2,
            ix: 1,
            mn: 'ADBE Vector Group',
            hd: !1
          },
          {
            ty: 'tm',
            s: {
              a: 1,
              k: [
                {
                  i: { x: [0.667], y: [1] },
                  o: { x: [0.333], y: [0] },
                  n: ['0p667_1_0p333_0'],
                  t: 23,
                  s: [50],
                  e: [0]
                },
                { t: 133.000005417201 }
              ],
              ix: 1
            },
            e: {
              a: 1,
              k: [
                {
                  i: { x: [0.667], y: [1] },
                  o: { x: [0.333], y: [0] },
                  n: ['0p667_1_0p333_0'],
                  t: 23,
                  s: [50],
                  e: [100]
                },
                { t: 133.000005417201 }
              ],
              ix: 2
            },
            o: { a: 0, k: 0, ix: 3 },
            m: 1,
            ix: 2,
            nm: 'Trim Paths 1',
            mn: 'ADBE Vector Filter - Trim',
            hd: !1
          }
        ],
        ip: 0,
        op: 202.000008227629,
        st: 0,
        bm: 0
      },
      {
        ddd: 0,
        ind: 7,
        ty: 0,
        nm: 'ornament',
        tt: 1,
        refId: 'comp_1',
        sr: 1,
        ks: {
          o: { a: 0, k: 20, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [500, 400, 0], ix: 2 },
          a: { a: 0, k: [500, 500, 0], ix: 1 },
          s: { a: 0, k: [100, 100, 100], ix: 6 }
        },
        ao: 0,
        ef: [
          {
            ty: 21,
            nm: 'Fill',
            np: 9,
            mn: 'ADBE Fill',
            ix: 1,
            en: 1,
            ef: [
              { ty: 10, nm: 'Fill Mask', mn: 'ADBE Fill-0001', ix: 1, v: { a: 0, k: 0, ix: 1 } },
              { ty: 7, nm: 'All Masks', mn: 'ADBE Fill-0007', ix: 2, v: { a: 0, k: 0, ix: 2 } },
              {
                ty: 2,
                nm: 'Color',
                mn: 'ADBE Fill-0002',
                ix: 3,
                v: { a: 0, k: [0.002530399943, 0.805775105953, 0.64741486311, 1], ix: 3 }
              },
              { ty: 7, nm: 'Invert', mn: 'ADBE Fill-0006', ix: 4, v: { a: 0, k: 0, ix: 4 } },
              {
                ty: 0,
                nm: 'Horizontal Feather',
                mn: 'ADBE Fill-0003',
                ix: 5,
                v: { a: 0, k: 0, ix: 5 }
              },
              {
                ty: 0,
                nm: 'Vertical Feather',
                mn: 'ADBE Fill-0004',
                ix: 6,
                v: { a: 0, k: 0, ix: 6 }
              },
              { ty: 0, nm: 'Opacity', mn: 'ADBE Fill-0005', ix: 7, v: { a: 0, k: 1, ix: 7 } }
            ]
          }
        ],
        w: 1e3,
        h: 1e3,
        ip: 0,
        op: 202.000008227629,
        st: 0,
        bm: 0
      },
      {
        ddd: 0,
        ind: 8,
        ty: 0,
        nm: 'CM8',
        refId: 'comp_2',
        sr: 1,
        ks: {
          o: { a: 0, k: 100, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [692, 604, 0], ix: 2 },
          a: { a: 0, k: [960, 500, 0], ix: 1 },
          s: {
            a: 0,
            k: [28, 28, 100],
            ix: 6,
            x: `var $bm_rt;
var acWidth = 1000;
var acHeight = 1000;
eval(['@JSXBIN@ES@2.0@MyBbyBnAhKMhLbyBn0ABJhNnABjzHjBjDiBjEjEiBiQBfnctf0DzQjBjDiBjEjEiBjOjDjIjPjSiQjPjJjOjUCAhOMhQbyBn0ABJhSnABjzIjBjDiBjEjEiWjBjMDfCzBhLEnVzDjWjBjMFfAnnntABF40BhAB0AzIjBjDiWjBjMiBjEjEGAhTMhVbyBn0ADJhXnABjzIjBjDiBjWjHiDjOjUHfCEnnndBntJhYnABjzIjBjDiBjWjHiWjBjMIfCEnCzBhKJVFfAjzLjBjDiBjWjHiXjFjJjHjIjUKfnnnnntOhZJhanAPjzLjXjFjJjHjIjUjFjEiDjOjULfBtAjzIjXjFjJjHjIjUjFjEMfnABF40BhAB0AzIjBjDiWjBjMiBjWjHNAhbMhdbyBn0ACJhfnAEjNfRBVFfAffJiAnABjzIjBjDiTjFjUiBjWjHOfnctfABF40BhAB0AzIjBjDiWjBjMiTjFjUPAiBMiDbyBn0ABOiEZiFnAEjzKjBjDjNjVjMiBjSjSjBjZQfRCVzBjBRfAVzBjCSfBffAUzChGhGTCzKjJjOjTjUjBjOjDjFjPjGUVRfAjzFiBjSjSjBjZVfnnCUVSfBjVfnnnnZiHnACJVRfAVSfBnnACR40BhAS4B0AhAC0AzFjBjDjNjVjMWAiIMiKbyBn0AEJiLnASzGjSjFjTjMjFjOXAEXzDjNjBjYYfjzEiNjBjUjIZfRCXzGjMjFjOjHjUjIgafVRfFXgafVSfGffnftJiMnASzDjSjFjTgbBEjVfRBVXfAftnftaiNbiOn0AFJiOnASzFjBifjWjBjMgcDndBftJiPnASzFjCifjWjBjMgdEndBftOiQJiQnASgcDQzAgefVRfFVzBjJgffCnffACzBhchAVgffCXgafVRfFnnnOiRJiRnASgdEQgefVSfGVgffCnffAChAVgffCXgafVSfGnnnJiSnABQgefVgbfBVgffCCJVgcfDVgdfEnnnfAVgffCAVXfAByBhAZiUnAVgbfBAHgf4C0AiAgb4B0AiAR40BhAS4B0AhAX40BiAgc4D0AiAgd4E0AiACFAQAiVMiXbyBn0ACJiZnABjzIjBjDiNjVjMiWjBjMhBfEjWfRCjhBfVFfAffnfJianABjzQjBjDiNjVjMjUjJjQjMjJjDjBjUjJjWjFhCfnctfABF40BhAB0AzIjBjDiWjBjMiNjVjMhDAibMidbyBn0ACOifcjAnAEjzIjQjBjSjTjFiJjOjUhEfRBVzIjFjBjTjFiUjZjQjFhFfAffVRBFdAfRBFdEfRBFdFfRBFdGfRBFdHfRBFdIfRBFdJfRBFdKfRBFdLfRBFdMfRBFdNfRBFdOfRBFdPfRBFdQfRBFdRfRBFdSfRBFdgcfRBFdgdfRBFdgefRBFdhAfRBFdhCfVbyjHn0ABZjHnAFbbyjVn0ABZjVnAjzKjFjBjTjFiJjOiRjVjBjEhGfbyjXn0ABZjXnAjzLjFjBjTjFiPjVjUiRjVjBjEhHfbyjZn0ABZjZnAjzNjFjBjTjFiJjOiPjVjUiRjVjBjEhIfbyjen0ABZjenAjzLjFjBjTjFiJjOiDjVjCjJjDhJfbykAn0ABZkAnAjzMjFjBjTjFiPjVjUiDjVjCjJjDhKfbykCn0ABZkCnAjzOjFjBjTjFiJjOiPjVjUiDjVjCjJjDhLfbykHn0ABZkHnAjzLjFjBjTjFiJjOiRjVjBjSjUhMfbykJn0ABZkJnAjzMjFjBjTjFiPjVjUiRjVjBjSjUhNfbykLn0ABZkLnAjzOjFjBjTjFiJjOiPjVjUiRjVjBjSjUhOfbykQn0ABZkQnAjzLjFjBjTjFiJjOiRjVjJjOjUhPfbykSn0ABZkSnAjzMjFjBjTjFiPjVjUiRjVjJjOjUhQfbykUn0ABZkUnAjzOjFjBjTjFiJjOiPjVjUiRjVjJjOjUhRfbykan0ABZkanAjzKjFjBjTjFiJjOiFjYjQjPhSfbykcn0ABZkcnAjzLjFjBjTjFiPjVjUiFjYjQjPhTfbyken0ABZkenAjzNjFjBjTjFiJjOiPjVjUiFjYjQjPhUfbylen0ABZlenAjzMjFjBjTjFiCjPjVjOjDjFiJjOhVfbymAn0ABZmAnAjzNjFjBjTjFiCjPjVjOjDjFiPjVjUhWfbymCn0ABZmCnAjzPjFjBjTjFiCjPjVjOjDjFiJjOiPjVjUhXfbymJn0ABZmJnAjzKjCjPjVjOjDjZiUjJjUjThYfbymQn0ABZmQnAjzRjFjBjTjFiJjOiLjJjMjMjFjSiRjVjJjOjUhZfAVhFfAnZmYnAFbABhF40BhAB0AzPjSjFjTjPjMjWjFiFjBjTjFiGjVjOjDhaAmZMmbbyBn0AFJmdnASzHjUjJjNjFiPjCjKhbAWzGiPjCjKjFjDjUhcAnftJmenABXzBjUhdfVhbfAVzKjNjBjSjLjFjSiUjJjNjFhefDnfJmfnABXzBjEhffVhbfAVzOjNjBjSjLjFjSiEjVjSjBjUjJjPjOiAfEnfJnAnABXzCjFjGiBfVhbfAEjhafRBVhFfFffnfJnCnABQgefjzLjNjBjSjLjFjSiUjJjNjFjTiCfCECEVzKjQjSjFjTjFjUiDjPjEjFiDfBnneBhDVzKjNjBjSjLjFjSiUjZjQjFiEfCnnVhbfAnfAGiD40BhAiE4B0AhAhe4C0AhAiA4D0AhAhb40BiAhF4E0AhAFBAzNjTjFjUiQjSjFjTjFjUiUjJjNjFiFAnDMnFbyBn0ABOnHbynJn0ABZnJnAQgefjiCfCECEViDfBnneBhDViEfCnnAEXzOjIjBjTiPjXjOiQjSjPjQjFjSjUjZiGfjiCfRBCECEViDfBnneBhDViEfCnnffbnNn0AFJnNnAShbAWhcAnftOnObynQn0ABJnQnABXhdfVhbfAXzHjJjOiQjPjJjOjUiHfjzJjCjBjTjFiMjBjZjFjSiIfnfACzChdhdiJViEfCnneBhRbynUn0ABJnUnABXhdfVhbfAXzIjPjVjUiQjPjJjOjUiKfjiIfnfJnWnABXhffVhbfAndAfJnXnABXiBfVhbfAnbfZnYnAVhbf0ADiD40BhAiE4B0AhAhb40BiACBAzPjHjFjUiGjYiQjSjFjTjFjUiUjJjNjFiLAnaMncbyBn0AHOneJnenASzDjEiJjOiMBndAffAChAViMfBnndAnOnfJnfnASzEjEiPjVjUiNDndAffAChAViNfDnndAnJ2CBnABXzEjGjBjEjFiOfjzCjBjDiPfndBfO2EBby2HBn0ABO2HBby2JBn0ABO2JBby2LBn0ABJ2LBnABXiOfjiPfndAfACiJViMfBnndAb2PBn0AEJ2PBnABXiOfjiPfCzBhPiQCzBhNiRjhdfVzDjUiJjOiSfAnnViMfBnnnfO2RBJ2RBnABXiOfjiPfndAfAChAXiOfjiPfnndAnO2SBJ2SBnABXiOfjiPfndBfACzBheiTXiOfjiPfnndBnO2UBJ2VBnABXiOfjiPfEVzKjFjBjTjFiGjVjOjDiJjOiUfERBXiOfjiPfffnfAViUfEnAChAjhdfCEViSfAViMfBnnnnnAChAjhdfVzEjUiPjVjUiVfCnnby2gbBn0ABO2gbBby2gdBn0ABJ2gdBnABXiOfjiPfndAfACiJViNfDnndAb2hBBn0AFJ2hBBnABXiOfjiPfCiQCiRjhdfViVfCnnViNfDnnnfO2hDBJ2hDBnABXiOfjiPfndAfAChAXiOfjiPfnndAnO2hEBJ2hEBnABXiOfjiPfndBfACiTXiOfjiPfnndBnO2hGBJ2hHBnABXiOfjiPfEVzLjFjBjTjFiGjVjOjDiPjVjUiWfFRBXiOfjiPfffnfAViWfFnJ2hJBnABXiOfjiPfCiRnXiOfjiPfdBnnfJ2hMBnABXzJjJjOjUjFjOjTjJjUjZiXfjiPfndBfJ2hNBnABXzCjFjOiYfjiPfnctfJ2hOBnABXhdfjiPfCiRjhdfViSfAnnnfAGiV4C0AhAiN4D0AhAiU4E0AhAiW4F0AhAiS40BhAiM4B0AhAG0AzOjVjQjEjBjUjFiBiDjPjCjKjFjDjUiZA2hPBM2hRBbyBn0ABJ2hTBnABXiYfjiPfncff0DzNjDjMjFjBjSiBiDjPjCjKjFjDjUiaA2hUBM2hWBbyBn0ABJ2hYBnABXiYfjiPfhzBhBibXiYfjiPfnf0DzOjJjOjWjFjSjUiBiDjPjCjKjFjDjUicA2hZBM2hbBbyBn0ADJ2hdBnASzFjJjOiPjCjKidAEjiLfRCViDfCFeBhRffnftJ2heBnASzGjPjVjUiPjCjKieBEjiLfRCViDfCFeBhSffnftO2iABby2iBBn0ABJ2iBBnAEjiZfRGXhdfVidfAXhffVidfAXhdfViefBXhffViefBXiBfVidfAXiBfViefBffAUTCzChehdifjhdfXhdfVidfAnnChAjhdfCEXhdfViefBXhffViefBnnnnnnby2iDBn0ABJ2iDBnAEjiafnfADid40BiAie4B0AiAiD40BhABCAzQjVjQjEjBjUjFiBiDjPjCjKjFjDjUiGjYjAA2iFBM2iIBbyBn0ADJ2iKBnASzGjSjFjTjVjMjUjBAVzMjEjFjGjBjVjMjUiWjBjMjVjFjCfCnftg2iLBbyBn0ABJ2iMBnASjBAEEXzGjFjGjGjFjDjUjDfjiIfRBVzKjTjMjJjEjFjSiOjBjNjFjEfBffRBFeYiBiEiCiFhAiTjMjJjEjFjShAiDjPjOjUjSjPjMhNhQhQhQhRffnffABnzBjFjFnnZ2iPBnAVjBf0ADjE40BhAjC4B0AhAjB40BiACBAzLjBjDiTjMjJjEjFjSiWjBjMjGA2iQBM2iSBbyBn0ADJ2iUBnASjBAVjCfCnftg2iVBbyBn0ABJ2iWBnASjBAEEXjDfjiIfRBVjEfBffRBFeXiBiEiCiFhAiBjOjHjMjFhAiDjPjOjUjSjPjMhNhQhQhQhRffnffABnjFnnZ2iZBnAVjBf0ADjE40BhAjC4B0AhAjB40BiACBAzKjBjDiBjOjHjMjFiWjBjMjHA2iaBM2icBbyBn0ADJ2ieBnASjBAVjCfCnftg2ifBbyBn0ABJ2jABnASjBAEEXjDfjiIfRBVjEfBffRBFeXiBiEiCiFhAiQjPjJjOjUhAiDjPjOjUjSjPjMhNhQhQhQhRffnffABnjFnnZ2jDBnAVjBf0ADjE40BhAjC4B0AhAjB40BiACBAzKjBjDiQjPjJjOjUiWjBjMjIA2jEBM2jGBbyBn0ADJ2jIBnASjBAVjCfCnftg2jJBbyBn0ABJ2jKBnASjBAEEXjDfjiIfRBVjEfBffRBFeZiBiEiCiFhAiQjPjJjOjUhTiEhAiDjPjOjUjSjPjMhNhQhQhQhRffnffABnjFnbyBn0ABg2jMBbyBn0ADJ2jNBnABjzFjUjNjQiYiZjJfEEXjDfjiIfRBCEVjEfyBnneEhAiYhMiZffRBFeXiBiEiCiFhAiQjPjJjOjUhAiDjPjOjUjSjPjMhNhQhQhQhRffnfJ2jOBnABjzEjUjNjQiajKfEEXjDfjiIfRBCEVjEfyBnneChAiaffRBFeYiBiEiCiFhAiTjMjJjEjFjShAiDjPjOjUjSjPjMhNhQhQhQhRffnfJ2jPBnASjByBARDXzBhQjLfjjJfXzBhRjMfjjJfjjKffnffABnjFnnZ2jTBnAVjBf0ADjE40BhAjC4B0AhAjB40BiACBAzMjBjDhTiEiQjPjJjOjUiWjBjMjNA2jUBM2jWBbyBn0ADJ2jYBnASjBAVjCfCnftg2jZBbyBn0ABJ2jaBnASjBAEEXjDfjiIfRBVjEfBffRBFeXiBiEiCiFhAiDjPjMjPjShAiDjPjOjUjSjPjMhNhQhQhQhRffnffABnjFnnZ2jdBnAVjBf0ADjE40BhAjC4B0AhAjB40BiACBAzKjBjDiDjPjMjPjSiWjBjMjOA2jeBM2kABbyBn0ACJ2kCBnABXiXfjiPfndBfg2kDBbyBn0ABJ2kEBnABXiXfjiPfCiQEEXjDfjiIfRBCEVzMjFjGjGjFjDjUiQjSjFjGjJjYjPfAnneKhAiJjOjUjFjOjTjJjUjZffRBFeYiBiEiCiFhAiTjMjJjEjFjShAiDjPjOjUjSjPjMhNhQhQhQhRffnndjEnfABnjFnnABjP40BhAB0AzMjHjFjUiJjOjUjFjOjTjJjUjZjQA2kHBM2kNBbyBn0ABZ2kNBnACJVhdfAVhdfAnnABhd40BhAB0AhGA2kNBM2kOBbyBn0ABZ2kOBnACJVhdfACiRnVhdfAdCnnnABhd40BhAB0AhHA2kOBM2kPBbyBn0ABZ2kPBnAdChAVhdfAnnd80EnAhfCJCJnVhdfAdCnVhdfAnnCEnCJCiRnCJnVhdfAdCndEnVhdfAnndyBnABhd40BhAB0AhIA2kPBM2kQBbyBn0ABZ2kQBnACJCJVhdfAVhdfAnnVhdfAnnABhd40BhAB0AhJA2kQBM2kRBbyBn0ABZ2kRBnACECJCJThdAyBfVhdfAnnVhdfAnnnndBABhd40BhAB0AhKA2kRBM2kSBbyBn0ABZ2kSBnAdChAVhdfAnnd80EnAhfCJCJCJnVhdfAdEnVhdfAnnVhdfAnnCECJCJCiRVhdfAnndBCiRCJnVhdfAdCnnndCnnCiRCJnVhdfAdCnnndCnnnndBABhd40BhAB0AhLA2kSBM2kTBbyBn0ABZ2kTBnACJCJCJVhdfAVhdfAnnVhdfAnnVhdfAnnABhd40BhAB0AhMA2kTBM2kUBbyBn0ABZ2kUBnACiRnCJCJCJThdAyBfVhdfAnnVhdfAnnVhdfAnndBnABhd40BhAB0AhNA2kUBM2kVBbyBn0ABZ2kVBnAdChAVhdfAnnd80EnAhfCJCJCJCJnVhdfAdInVhdfAnnVhdfAnnVhdfAnnCiRnCJCJCJCJnThdAyBfdInVhdfAnnVhdfAnnVhdfAnndBnABhd40BhAB0AhOA2kVBM2kWBbyBn0ABZ2kWBnACJCJCJCJVhdfAVhdfAnnVhdfAnnVhdfAnnVhdfAnnABhd40BhAB0AhPA2kWBM2kXBbyBn0ABZ2kXBnACEnCJCJCJCJThdAyBfVhdfAnnVhdfAnnVhdfAnnVhdfAnndBnABhd40BhAB0AhQA2kXBM2kYBbyBn0ABZ2kYBnAdChAVhdfAnnd80EnAhfCJCJCJCJCJnVhdfAdQnVhdfAnnVhdfAnnVhdfAnnVhdfAnnCEnCJCJCJCJCJnThdAyBfdQnVhdfAnnVhdfAnnVhdfAnnVhdfAnndBnABhd40BhAB0AhRA2kYBM2kZBbyBn0ABZ2kZBnACJCJCJCJCJCJCJCJCJCJCJCJCJCJCJCJCJVhdfAVhdfAnnVhdfAnnVhdfAnnVhdfAnnVhdfAnnVhdfAnnVhdfAnnVhdfAnnVhdfAnnVhdfAnnVhdfAnnVhdfAnnVhdfAnnVhdfAnnVhdfAnnVhdfAnnVhdfAnnABhd40BhAB0AhZA2kZBM2kbBbyBn0ABO2kbBby2kbBn0ABZ2kbBnACJCJnVhdfAd80DiAgeiAnVhdfAnnAChAVhdfAnnd8iGXidjUmRiFmXhfOy2kbBby2kbBn0ABZy2kbBnACECJCJnShdACiRnnnd8jUmRiFXidjUnBhfntfd80DiAgeiAnVhdfAnnnnd80EnIhfAChAVhdfAnnd8iGXidjUmRiFnHhfOy2kbBby2kbBn0ABZy2kbBnACECJCJnShdACiRnnnd8hPlanIlCkLhOnKhfntfd80DiAgeiAnVhdfAnnnnd80EnOhfAChAVhdfAnnd8XidjUmRiFXnNhfby2kbBn0ABZy2kbBnACECJCJnShdACiRnnnd8kMhOlanIlCkLnOhfntfd80DiAgeiAnVhdfAnnnnd80DkAnPhfABhd40BhAB0AhWA2kbBM2kcBbyBn0ABZ2kdBnACiRnEjhWfRBCiRnVhdfAdBnffdBnABhd40BhAB0AhVA2keBM2kfBbyBn0ABZ2kfBnAdChAVhdfAnnd80EnAhfCJEjhVfRBCJVhdfAnndCffnnd80EnAhfCECJEjhWfRBCiRCJVhdfAnndCnndBffnnd80EnAhfnnd80EnAhfABhd40BhAB0AhXA2kfBM2lABbyBn0ADJ2lCBnASRAnd8jBjRhYnTlLhZnbhfftO2lDBZ2lDBnAFdBACiJVhdfBnndBnO2lEBby2lFBn0ABZ2lFBnACJCJnVhdfBd80DiAgeiAnVhdfBnnAChAVhdfBnnd8iGXidjUmRiFmXhfO2lHBb2lIBn0ACJ2lIBnAShdBCiRnnnd8jUmRiFXidjUnBhfntfZ2lJBnACECJhzBhNjRVRfACiRnCECJCJnVhdfBd80DiAgeiAnVhdfBnnnnd80EnIhfdBnnnnndBAChAVhdfBnnd8iGXidjUmRiFnHhfO2lLBb2lMBn0ACJ2lMBnAShdBCiRnnnd8hPlanIlCkLhOnKhfntfZ2lNBnACECJhjRVRfACiRnCECJCJnVhdfBd80DiAgeiAnVhdfBnnnnd80EnOhfdBnnnnndBAChAVhdfBnnd8XidjUmRiFXnNhfb2lQBn0ACJ2lQBnAShdBCiRnnnd8kMhOlanIlCkLnOhfntfZ2lRBnACECJhjRVRfACiRnCECJCJnVhdfBd80DiAgeiAnVhdfBnnnnd80DkAnPhfdBnnnnndBAChd40BhAR40BiABBAhYA2lTBM2lVBbyBn0ABZ2lVBnAEXzDjQjPjXjSfjZfRCFdCCJnCiRVhdfAnndBdKnffABhd40BhAB0AzOjFjBjTjFiJjOiFjYjQjPiPjSjJjHjTA2lVBM2lXBbyBn0AEJ2lZBnASzBjZjUAEjjTfRBVhdfCffnftO2laBZ2lbBnAVjUf0ACiTVhdfCnnd8hThThThThThTmThfnJ2lcBnAShfBCiRnEjjTfRBCiRnCiQVhdfCnnd8hThThThThThTmThfdBnffdBnnftZ2ldBnACJCJVjUfAVhffBnnVhffBnnADjU40BiAhd40BhAhf4B0AiABCAhSA2leBM2mABbyBn0ABZ2mCBnACiRnEjhSfRBCiRnVhdfAdBnffdBnABhd40BhAB0AhTA2mDBM2mFBbyBn0ABZ2mFBnAdChAVhdfAnnd80EnAhfCJEjhSfRBCJVhdfAnndCffnnd80EnAhfCECJEjhTfRBCiRCJVhdfAnndCnndBffnnd80EnAhfnnd80EnAhfABhd40BhAB0AhUA2mFBM2mIBbyBn0ADJ2mKBnASjUACiQCJVRfCEXzDjDjPjTjVfjZfRBCJCJCJVhdfBVzBjGjWfDnnXzCiQiJjXfjZfnnnndCffnnEXzDjFjYjQjYfjZfRBCJVhdfBVhffEnnffnnnftO2mLBZ2mMBnAVjUf0AChAVhdfBnnd8kakZkZkZkZkZnJhfnZ2mNBnACJVjUfACiRnCiQCiRVhdfBnnd8kakZkZkZkZkZnJhfnnd8kakZkZkZkZkZmJhfdBnnnAFjU40BiAjW4C0AhAhd40BhAhf4D0AhAR4B0AhAEBAzLjPjWjFjSiDjVjNiTjIjPjUjZA2mOBWOFbyHn0ABJHnASiIyBjzJjUjIjJjTiMjBjZjFjSjafnftACiJizGjUjZjQjFjPjGjbViIfyBnneJjVjOjEjFjGjJjOjFjEnOJbyKn0ABJKnASiIyBjjafnftAhibViIfyBnJOnASzIjUjJjNjFiUjSiJjOjcyBnbftJPnASzJjUjJjNjFiUjSiPjVjUjdyBnbftJSnASiCyBWhcAnftJVnASiPyBEjhcfntnftJWnABXiYfViPfyBncffJXnASzBjWjeyBXzFjWjBjMjVjFjffjzMjUjIjJjTiQjSjPjQjFjSjUjZkAfnftJYnAShdyBjzEjUjJjNjFkBfnftJganASzHjBjDiXjJjEjUjIkCyBXzFjXjJjEjUjIkDfViIfyBnftJgbnASzIjBjDiIjFjJjHjIjUkEyBXzGjIjFjJjHjIjUkFfViIfyBnftJgcnASByBncfftJgdnASDyBndAftJgenASHyBndAftJgfnASIyBndAftJhAnASOyBncfftJhBnASKyBndBftJhCnAShCyBncfftJhDnAShByBndBftJhEnASMyBncfftJhFnASLyBndAftO2mVBby2mWBn0ABa2mWBb2mXBn0AFJ2mXBnASzBjNkGyBEXzDjLjFjZkHfXzGjNjBjSjLjFjSkIfViIfyBRBVgffyBffnftJ2mYBnASzBjQkJyBXzKjQjBjSjBjNjFjUjFjSjTkKfVkGfyBnftO2mbBb2mdBn0ADO2mdBD2mdBnAgefACzChBhdkLXzgfjajajajajajajajajajajajajajajaifiBiDiNjBjSjLjFjSiFjOjBjCjMjFjEkMfVkJfyBnneBhRnJ2mfBnASzKjQjSjFjTjFjUiUjZjQjFkNyBXzhFjajajajajajajajajajajajajajajaifiBiDiNjBjSjLjFjSiBjQjQiQjSjFjTjFjUiUjZjQjFkOfVkJfyBnftO2nBBby2nDBn0ABJ2nDBnASjcyBXkBfVkGfyBnffACiJVkNfyBnneBhRO2nFBby2nHBn0ABJ2nHBnASjdyBXkBfVkGfyBnffACiJVkNfyBnneBhSO2nJBb2nLBn0AFJ2nLBnASiEyBXzgcjajajajajajajajajajajajajajajaifiBiDiNjBjSjLjFjSiUjZjQjFkPfVkJfyBnftJ2nMBnASiDyBXzhCjajajajajajajajajajajajajajajaifiBiDiNjBjSjLjFjSiQjSjFjTjFjUiDjPjEjFkQfVkJfyBnftJ2nNBnAShFyBnbftO2nPBJ2nQBnAShFyBXzgcjajajajajajajajajajajajajajajaifiBiDiNjBjSjLjFjSiFjBjTjFkRfVkJfyBnffAEXiGfVkJfyBRBFegcjajajajajajajajajajajajajajajaifiBiDiNjBjSjLjFjSiFjBjTjFffnJ2nSBnAEjiFfRFViDfyBViEfyBXkBfVkGfyBXzIjEjVjSjBjUjJjPjOkSfVkGfyBVhFfyBffACiJVkNfyBnneBhTnAUTUTEXiGfVkJfyBRBFegfjajajajajajajajajajajajajajajaifiBiDiNjBjSjLjFjSiFjOjBjCjMjFjEffEXiGfVkJfyBRBFegcjajajajajajajajajajajajajajajaifiBiDiNjBjSjLjFjSiUjZjQjFffnnEXiGfVkJfyBRBFehFjajajajajajajajajajajajajajajaifiBiDiNjBjSjLjFjSiBjQjQiQjSjFjTjFjUiUjZjQjFffnnnJ2nVBnASkGyBjzJjVjOjEjFjGjJjOjFjEkTfnffJ2nWBnASkJyBjkTfnffAVgffyBBXzHjOjVjNiLjFjZjTkUfXkIfViIfyBByBzChchdkVACiTXkUfXkIfViIfyBnndAnAgagf4T0AiAhd4G0AiAkJ4V0AiAiD4Y0AiAiE4X0AiAje4F0AiAkG4U0AiAiI40BiAjc4B0AiAjd4C0AiAiC4D0AiAiP4E0AiAkC4H0AiAkE4I0AiAB4J0AiAD4K0AiAH4L0AiAI4M0AiAO4N0AiAK4O0AiAhC4P0AiAhB4Q0AiAM4R0AiAL4S0AiAkN4W0AiAhF4Z0AiAAgaAgeByB'][0]);
eval(['@JSXBIN@ES@2.0@MyBbyBnABMAbyBn0AUOCJCnASzBjUBAndBffACzBheCVBfAnndBnODJDnASBAndAffACzBhcDVBfAnndAnOFJFnASzLjGjJjSjTjUiCjPjVjOjDjFEBnd8hThThThThThTmDhfffACzChdhdFizGjUjZjQjFjPjGGVEfBnneJjVjOjEjFjGjJjOjFjEnOGJGnASzKjFjMjBjTjUjJjDjJjUjZHCnd80EnIhfffACFiGVHfCnneJjVjOjEjFjGjJjOjFjEnOHJHnASzKjNjBjYiCjPjVjOjDjFjTIDndJffACFiGVIfDnneJjVjOjEjFjGjJjOjFjEnJJnABjzBjFJfVHfCnfJKnABjzCjGjEKfCzBhKLVEfBnndCnfJLnASBACzBhNMnVEfBnnntfJMnASBACMnVBfAdBnnffJNnABjzDjGjEjJNfCzBhPOnjKfdBnnfJOnABjzBjHPfCLCLnjNfdInjNfnnnfJPnABjzCjWjZQfCLCLjKfjPfnnnnd80EnAhfnfJQnABjzEjOiNjBjYRfVIfDnfJSnABjzEjUiDjVjSSfndAfJTnABjzGjTjFjHiEjVjSTfCOCLnjQfdCnjPfnnnfJVnABjzFjUiOjFjYjUUfjTfnfJWnABjzCjOjCVfndAflXbYn0AFJYnABjQfCLnjJfnnntJZnABjTfCLnjJfnnntJganABjSfjUfnfJgbnABjUfCzBhLWnjTfnnntJgcnAPjVfBtAUzChGhGXCDjUfVBfAnnCzChchdYjVfjRfnnnnOgebgfn0AEJgfnABjzFjEjFjMjUjBZfCMVBfAjSfnnnfJhAnABjzBjZgafCLjZfCMjQfCOCLjPfjZfnnnndCnnnnnfOhBJhBnABjgafndBfACCjgafnndBnOhCJhCnABjgafndAfACDjgafnndAnACYjVfjRfnnbyhEn0ABJhEnABjgafndAfZhHnAjgafAEB40BhAE4B0AhAH4C0AhAI4D0AhAE0AzNjFjMjBjTjUjJjDiCjPjVjOjDjFgbAhI0EzAgcByB'][0]);
eval(['@JSXBIN@ES@2.0@MyBbyBn0AFJAnABjzLjBjDiBjWjHiXjFjJjHjIjUBfndBfJBnABjzIjXjFjJjHjIjUjFjECfncffOCbyEn0ABOEbFn0AFJFnABjCfnctfJGnABjBfCzBhPDCzBhNEjzBjUFfjzJjUjJjNjFiUjSiPjVjUGfnnCEjzIjUjJjNjFiUjSiJjOHfjGfnnnnnfOHJHnABjBfndAfACzBhcIjBfnndAnOIJInABjBfndBfACzBheJjBfnndBnJJnABjBfCEnjBfdBnnfACJjHfjGfnnnAUzChGhGKCzDhBhdhdLjHfnnbCLjGfnnbnnnJNnAEjzNjDjMjFjBjSiBiDjPjCjKjFjDjUMfnfOObyPn0ABOPbQn0ACJQnAEjzOjVjQjEjBjUjFiBiDjPjCjKjFjDjUNfREXzHjJjOiQjPjJjOjUOfjzJjCjBjTjFiMjBjZjFjSPfCEjHfXOfjPfnnXzIjPjVjUiQjPjJjOjUQfjPfFdAffJRnABXzEjGjBjEjFRfjzCjBjDSfCEnXRfjSfdBnnfACIjFfjHfnnnACLjHfnnbn0DzATByB'][0]);
eval(['@JSXBIN@ES@2.0@MyBbyBn0ABOAbAn0ABJAnAEjzIjBjDiWjBjMiNjVjMBfRBCzBhNCnCzBhKDEjzLjPjWjFjSiDjVjNiTjIjPjUEfRECCnXzEjGjBjEjFFfjzCjBjDGfdBnFdBEjzLjBjDiTjMjJjEjFjSiWjBjMHfRCFegdiBiDhAiJiOhAibhSiKiWidhAiOjVjNjCjFjShAjPjGhAjCjPjVjOjDjFjTFdBffFdHffCzBhLICzBhPJEjHfRCFeRiBiDhAiJiOhAibhSiKiWidhAiTjDjBjMjFFdjEffnndyjEnndBnndBnffAXzCjFjOKfjGfn0DzALByB'][0]);
eval(['@JSXBIN@ES@2.0@MyBbyBn0AFJAnABjzLjBjDiBjWjHiXjFjJjHjIjUBfndBfJBnABjzIjXjFjJjHjIjUjFjECfncffOCbyEn0ABOEbFn0AEJFnABjCfnctfJGnABjBfCzBhPDCzBhNEjzBjUFfjzJjUjJjNjFiUjSiPjVjUGfnnCEjzIjUjJjNjFiUjSiJjOHfjGfnnnnnfOHJHnABjBfndAfACzBhcIjBfnndAnOIJInABjBfndBfACzBheJjBfnndBnACJjHfjGfnnnAUzChGhGKCzDhBhdhdLjHfnnbCLjGfnnbnnnJMnAEjzNjDjMjFjBjSiBiDjPjCjKjFjDjUMfnfONbyOn0ABOObPn0ACJPnAEjzOjVjQjEjBjUjFiBiDjPjCjKjFjDjUNfREFdAFdAjGfCECEXzIjPjVjUiQjPjJjOjUOfjzJjCjBjTjFiMjBjZjFjSPfjGfnnXzNjGjSjBjNjFiEjVjSjBjUjJjPjOQfjzIjUjIjJjTiDjPjNjQRfnnffJQnABXzEjGjBjEjFSfjzCjBjDTfCEnXSfjTfdBnnfACzChehdUjFfjGfnnnACLjGfnnbn0DzAVByB'][0]);
eval(['@JSXBIN@ES@2.0@MyBbyBn0ACJAnABjzLjBjDiBjWjHiXjFjJjHjIjUBfndBfJBnABjzIjXjFjJjHjIjUjFjECfncff0DzADByB'][0]);
eval(['@JSXBIN@ES@2.0@MyBbyBn0ABJAnABXzCjFjOBfjzCjBjDCfnctf0DzADByB'][0]);
$bm_rt = eval(['@JSXBIN@ES@2.0@MyBbyBn0AEJAnABjzBjWBfXzFjWjBjMjVjFCfjzMjUjIjJjTiQjSjPjQjFjSjUjZDfnfOBbyCn0ABJCnABjBfEjzFjBjDjNjVjMEfRCjBfjzIjBjDiNjVjMiWjBjMFfffnfACzChdhdGjzQjBjDiNjVjMjUjJjQjMjJjDjBjUjJjWjFHfnnctbEn0AEOEbyFn0ABJFnABjBfCzBhKInnndAntACGjzIjBjDiTjFjUiBjWjHJfnnctnOIbyJn0ABJJnABjBfCzBhLKnXzLjBjOjDjIjPjSiQjPjJjOjULfjzJjUjSjBjOjTjGjPjSjNMfnnntAjzHjBjDiBjEjEiBiQNfnOMJNnAPjzIjBjDiBjWjHiDjOjUOfyBtACzBhePjzLjXjFjJjHjIjUjFjEiDjOjUQfnndBnOPbQn0ACJQnABjzIjBjDiBjWjHiWjBjMRfCzBhPSjRfjOfnnnfJRnABjBfCKnjRfnnntACPjOfnndAnJVnABjBfCKnjzIjBjDiBjEjEiWjBjMTfnnntJXnAjBf0DzAUByB'][0]);`
          }
        },
        ao: 0,
        ef: [
          {
            ty: 5,
            nm: 'AC IN [2JV] Number of bounces',
            np: 3,
            mn: 'ADBE Slider Control',
            ix: 1,
            en: 1,
            ef: [
              {
                ty: 0,
                nm: 'Slider',
                mn: 'ADBE Slider Control-0001',
                ix: 1,
                v: { a: 0, k: 1, ix: 1 }
              }
            ]
          },
          {
            ty: 5,
            nm: 'AC IN [2JV] Scale',
            np: 3,
            mn: 'ADBE Slider Control',
            ix: 2,
            en: 1,
            ef: [
              {
                ty: 0,
                nm: 'Slider',
                mn: 'ADBE Slider Control-0001',
                ix: 1,
                v: { a: 0, k: 0, ix: 1 }
              }
            ]
          }
        ],
        w: 1920,
        h: 1e3,
        ip: 92.0000037472368,
        op: 202.000008227629,
        st: 92.0000037472368,
        bm: 0
      }
    ],
    markers = [],
    merryChristmas = { v, fr, ip, op, w, h, nm, ddd, assets, layers, markers },
    _withScopeId = (e) => (pushScopeId('data-v-d5c942a0'), (e = e()), popScopeId(), e),
    _hoisted_1 = { class: 'absolute top-0 left-0 w-full h-full overflow-hidden' },
    _hoisted_2 = { class: 'w-full h-full flex flex-col justify-center items-center' },
    _hoisted_3 = {
      class: 'w-[400px] h-[400px] bg-white rounded-lg border-primary border-2 text-wrap text-center'
    },
    _hoisted_4 = _withScopeId(() =>
      createBaseVNode(
        'p',
        { class: 'w-full relative -mt-8 font-bold text-secondary px-4 leading-5' },
        ' Thank you for your friendship and support throughout the year! Your presence has been a gift in itself, making the tough times easier and the good times even brighter. I hope this holiday season brings you everything you wish for. ',
        -1
      )
    ),
    _hoisted_5 = {
      class: 'snap-center w-screen h-screen flex-grow-0 flex-shrink-0 relative overflow-hidden',
      style: { background: 'radial-gradient(at top, #12313b, #000822)' }
    },
    _hoisted_6 = {
      class: 'w-full h-full flex justify-center items-center flex-col gap-6 relative'
    },
    _hoisted_7 = { class: 'card-page cart-page-front' },
    _hoisted_8 = _withScopeId(() =>
      createBaseVNode('div', { class: 'card-page cart-page-outside' }, null, -1)
    ),
    _hoisted_9 = { class: 'card-page cart-page-inside' },
    _hoisted_10 = _withScopeId(() =>
      createBaseVNode(
        'svg',
        {
          version: '1.1',
          id: 'Layer_2',
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          x: '0px',
          y: '0px',
          width: '540.054px',
          height: '551.88px',
          viewBox: '0 0 540.054 551.88',
          'enable-background': 'new 0 0 540.054 551.88',
          'xml:space': 'preserve'
        },
        [
          createBaseVNode('path', {
            fill: '#0A0A0A',
            d: `M408.424,259.126c-6.145,0.44-11.873,2.104-17.349,4.458c1.873-7.48,7.205-30.873-6.877-29.254
                          c-1.13,0.129-1.724,0.823-1.892,1.648c-0.16,0.177-0.31,0.373-0.429,0.615c-3.015,6.094-5.718,14.199-9.76,19.695
                          c-1.472,2-2.722,4.848-5.667,6c-7.667,3-1-20.667,0.403-26.008c1.336-5.086-5.09-5.446-9.21-5.564
                          c-1.478-0.042-2.408,0.997-2.672,2.134c-1.771,4.952-4.872,14.68-4.664,22.817c-1.675,2.943-5.191,12.621-10.857,13.621
                          c-8.242,1.454-2.563-16.957-2-20.334c1.333-8,2.628-11.805-5.333-15c-2.264-0.908-5.406-1.915-7.769-2.502
                          c0.089-0.499,0.184-0.998,0.258-1.5c0.452-3.046,0.324-8.625-2.972-10.302c-3.246-1.651-7.683-1.042-9.018,2.881
                          c-2.086,6.129,1.369,9.709,6.025,11.925c-1.409,5.57-3.866,10.902-6.185,16.131c-2.527,5.698-5.047,11.584-8.066,17.048
                          c-0.503,0.889-1.105,1.706-1.777,2.474c-0.19,0.137-0.375,0.295-0.542,0.504c-0.147,0.184-0.301,0.334-0.453,0.499
                          c-0.32-1.622-0.045-3.463,0.099-5.091c0.205-2.319,0.537-4.664,0.959-6.956c1.638-8.898,5.757-23.821-7.247-27.625
                          c-2.769-1.015-5.481-2.27-8.029-3.789c0.729-3.351,1.066-6.749,0.714-10.099c-0.746-7.1-9.771-11.932-14.462-5.102
                          c-4.469,6.505,1.533,12.914,8.042,17.405c-1.567,5.595-4.063,11.042-6.443,16.208c-2.243,4.867-11.502,24.063-17.053,12.175
                          c-1.347-2.884-1.583-6.25-1.22-9.587c6.726-0.07,13.875-8.967,13.043-15.18c-0.25-1.867-1.442-3.323-2.996-4.121
                          c-4.746-3.586-10.56-2.08-15.424,1.055c-5.327,3.432-8.329,8.822-8.991,15.068c-0.485,4.564,0.015,9.123,1.842,13.173
                          c-0.671,2.181-1.46,4.302-2.526,6.266c-2.609,4.809-5.47-0.677-6.093-3.317c-0.732-3.105-3.745-21.835-4.826-27.99
                          c-0.839-4.777-2.416-9.121-6.94-11.494c-10.193-5.347-16.953,14.511-20.619,34.844c-0.15-1.523-0.739-13.674-0.972-15.188
                          c-0.754-4.909-1.971-10.466-5.743-13.968c-4.074-3.782-9.072,0.642-11.787,3.652c-0.854,0.947-1.633,1.957-2.358,3.01
                          c1.254-6.39,2.11-12.837,1.72-19.314c-0.468-7.769-12.292-8.248-17.77-6.557c-0.584,0.182-0.993,0.496-1.252,0.881
                          c-0.352,0.365-0.592,0.87-0.618,1.536c-0.461,11.669-2.083,23.257-2.582,34.933c-0.246,5.756-0.359,11.518-0.576,17.275
                          c-0.173,4.633-1.224,9.381-0.674,14.004c-0.065,0.294-0.071,0.599,0.018,0.902c0.062,0.21,0.139,0.41,0.224,0.605
                          c0.016,0.078,0.027,0.156,0.044,0.234c0.207,0.955,0.807,1.531,1.521,1.787c15.66,5.629,13.604-13.445,16.139-23.459
                          c1.607-6.35,3.581-13.52,7.333-19c2.295-3.353,4.394-5.369,5.333-1c0.722,3.357,1.002,10.45,1.042,13.863
                          c0.079,6.824,0.312,13.729,1.365,20.477c0.133,0.851,7.386,6.916,12.593,0.66c1.244-1.494,1.333-10,3.088-19.338
                          c0.628-3.344,1.549-6.59,2.556-9.836c0.305-0.986,3.55-9.936,5-7.762c1.556,2.336,1.679,18.956,2.082,23.988
                          c0.771,9.63,5.483,19.66,17.274,16.613c5.786-1.496,9.039-6.484,11.333-12.666c5.667,6.666,14.002,5.833,19.671,2.529
                          c0.402-0.234,0.683-0.529,0.88-0.852c2.013-1.537,3.779-3.596,5.123-5.467c4.225-5.885,7.139-12.777,9.854-19.457
                          c0.973-2.395,1.935-4.897,2.751-7.459c0.509,0.287,1.002,0.558,1.482,0.814c0.128,0.186,0.275,0.365,0.468,0.531
                          c2.325,1.996,1.456,5.473,0.881,7.986c-0.889,3.889-1.482,7.822-1.986,11.775c-0.613,4.807-1.573,9.453-1.231,14.329
                          c0.734,10.451,12.601,13.38,19.37,6.712c2.306-1.92,3.896-4.813,5.129-7.449c4.693-10.033,10.295-20.252,13.13-31.088
                          c0.216,0.063,0.431,0.124,0.646,0.184c0.032,0.029,0.066,0.051,0.088,0.09c1.744,3.153-0.742,13.437-1.256,16.153
                          c-2.333,12.333-3,18.667,3.667,22.333c9.042,4.973,16.05,0.096,21.877-7.192c1.284-1.417,2.431-3.014,3.48-4.706
                          c1.257,2.712,3.392,4.752,6.783,5.612c7.371,1.869,13.013-2.406,17.407-8.41c-1.083,4.436-2.145,8.874-2.98,13.362
                          c-0.004,0.021-0.008,0.043-0.012,0.064c-6.87,4.783-14.099,11.954-13.435,20.629c0.138,1.807,1.163,3.113,2.544,3.811
                          c6.372,6.195,14.074,1.231,18.952-5.764c4.638-6.649,6.664-14.654,8.515-22.522c6.12-3.015,12.377-5.245,19.508-5.757
                          C412.306,263.852,411.632,258.896,408.424,259.126z M263.93,237.873c-0.803,1.768-3.477,4.858-5.943,5.6
                          c0.358-1.313,0.771-2.576,1.212-3.75c0.547-1.458,1.317-2.783,2.211-4.049c0.785-1.5,1.993-1.813,3.625-0.939
                          C264.817,235.837,264.449,236.883,263.93,237.873z M365.309,289.485c1.212-3.271,3.501-6.058,6.237-8.472
                          c-0.521,2.279-1.136,4.535-1.949,6.755c-0.766,2.091-1.837,3.944-3.554,5.409c-0.506,0.432-0.859,0.606-1.102,0.609
                          c-0.147-0.158-0.293-0.33-0.439-0.51C364.358,292.245,365.125,289.979,365.309,289.485z M279.171,220.98
                          c-1.049-1.189-3.856-7.207,0.792-6.802c1.343,0.116,2.209,1.093,2.738,2.224c0.975,2.084,0.594,4.777,0.327,6.969
                          c-0.046,0.374-0.103,0.747-0.16,1.12C281.549,223.412,280.298,222.256,279.171,220.98z M460.261,321.795
                          c-2.297,0.051-4.698,0.373-7.054,0.967c-0.312-0.527-0.628-1.048-0.95-1.556c-2.765-4.362-7.715-7.108-8.257-11.988
                          c1.271-0.249,2.456-0.715,3.303-1.604c1.382-1.451,1.335-3.506,0.256-5.125c-0.635-0.953-2.586-1.854-3.663-2.118
                          c-4.707-1.161-8.634,4.292-9.429,8.232c-0.35,1.737-0.384,3.651-0.209,5.413c0.032,0.319,0.087,0.627,0.142,0.936
                          c-1.194,4.824-2.818,9.509-5.416,13.795c-2.218,3.66-3.302,8.554-7.522,10.611c-3.069,1.498-5.07-0.545-5.334-3.6
                          c-0.702-8.114,4.144-15.97,2.936-24.193c-0.539-3.666-3.685-6.91-7.546-7.244c-1.315-0.113-2.543,1.014-2.956,2.201
                          c-0.372,1.07-0.735,2.167-1.083,3.283c-0.474-0.447-0.978-0.844-1.503-1.197c-4.403-4.775-12.259-5.602-17.941-2.453
                          c-6.953,3.855-9.684,13.605-9.681,21.375c-1.202,1.977-2.692,4.322-4.335,6.551c-0.136,0.15-0.258,0.311-0.397,0.459
                          c-1.443,1.554-3.092,2.843-4.926,3.898c-2.527,1.455-2.635-1.416-2.886-2.939c-1.141-6.952,1.666-13.807-1.528-20.525
                          c-3.653-7.684-10.047-5.672-15.374-1.322c-2.936,2.396-5.522,5.318-7.486,8.565c-0.076-1.06-0.168-2.119-0.297-3.181
                          c-0.617-5.066-4.673-8.176-9.651-7.184c-5.563,1.109-9.828,7.385-12.553,11.808c-0.41,0.665-0.798,1.343-1.175,2.024
                          c0.194-5.033,0.603-10.133-0.059-15.098c-0.692-5.186-5.552-4.92-9.497-4.622c-1.083,0.081-1.706,0.7-1.946,1.472
                          c-0.196,0.277-0.341,0.617-0.412,1.029c-0.679,3.979-1.224,7.951-1.658,11.936c-1.622,4.756-3.42,9.466-6.394,13.561
                          c-0.307,0.422-0.634,0.824-0.974,1.207c-0.11,0.041-0.219,0.076-0.33,0.137c-2.94,1.57-4.662-6.824-4.906-8.22
                          c-0.814-4.654,0.061-9.686,0.714-14.305c0.635-4.497,1.364-8.981,2.235-13.439c0.105-0.539,0.236-1.069,0.378-1.597
                          c0.42,0.073,0.841,0.147,1.263,0.224c4.383,0.79,8.648,1.079,12.728-0.936c2.89-1.428,0.305-5.71-2.571-4.29
                          c-3.016,1.49-6.515,0.974-9.912,0.287c0.517-1.566,0.985-3.147,1.208-4.81c0.075-0.56-0.023-1.02-0.229-1.392
                          c-0.045-0.641-0.309-1.25-0.856-1.609c-2.438-1.6-4.834-2.195-7.724-2.332c-0.719-0.035-1.343,0.364-1.767,0.928
                          c-0.203,0.178-0.392,0.387-0.549,0.657c-1.304,2.247-2.335,4.739-3.181,7.353c-2.33,0.153-4.645,0.521-6.942,1.184
                          c-3.094,0.891-1.722,5.699,1.382,4.807c1.388-0.4,2.765-0.664,4.137-0.828c-1.098,4.696-1.791,9.529-2.483,13.885
                          c-0.53,3.335-0.896,6.857-0.917,10.385c-3.426,1.811-6.832,3.984-10.031,6.457c-5.628-11.931-11.693-25.008,0.925-32
                          c0.531-0.295,0.873-0.688,1.06-1.119c0.396-0.575,0.564-1.317,0.286-2.164c-1.721-5.236-7.724-6.742-12.485-5.035
                          c-0.323,0.041-0.658,0.155-0.996,0.362c-0.113,0.068-0.215,0.145-0.326,0.214c-0.993,0.516-1.907,1.172-2.664,1.996
                          c-5.104,4.49-7.203,10.863-6.915,17.957c0.065,1.615,0.319,3.197,0.69,4.758c-1.473,4.01-3.142,7.934-5.138,11.746
                          c-1.854,3.541-4.122,8.018-7.381,10.782c-0.321,0.022-0.661,0.119-1.012,0.31c-4.804,2.611-3.137-11.627-2.837-13.236
                          c0.785-4.214,2.301-8.338,2.565-12.637c0.4-6.508-6.321-8.827-11.453-6.123c-0.801,0.422-1.196,1.086-1.302,1.785
                          c-0.022,0.056-0.051,0.103-0.07,0.16c-1.207,3.733-2.928,9.746-3.682,15.844c-0.948,2.313-1.948,4.604-3.07,6.848
                          c-1.732,3.465-5,9.518-8.887,12.113c-0.366,0.063-0.741,0.222-1.109,0.53c-0.122,0.103-0.244,0.183-0.366,0.277
                          c-0.289,0.118-0.58,0.217-0.873,0.288c-2.352,0.576,0.619-16.209,0.891-17.508c1.781-8.487-0.302-15.61-8.368-19.57
                          c-0.847-0.416-1.717-0.775-2.599-1.105c0.453-4.509-0.037-8.852-2.241-12.449c-0.046-0.131-0.092-0.262-0.165-0.396
                          c-2.191-4.104-7.075-5.24-11.055-2.865c-4.282,2.555-4.094,8.762-1.85,12.619c1.901,3.268,5.42,4.953,8.943,6.233
                          c0.072,0.311,0.193,0.611,0.364,0.884c-0.454,1.828-0.976,3.596-1.413,5.209c-1.577,5.817-3.935,12.012-6.664,17.387
                          c-1.665,3.279-3.677,6.613-6.358,9.158c-2.974,2.82-2.679-5.398-2.763-6.967c-0.274-5.111-0.797-13.539-7.785-12.937
                          c-1.818,0.157-3.362,0.883-4.673,1.985c0.35-6.104,0.682-12.207,0.969-18.314c0.323-6.888,1.456-14.306-0.244-21.08
                          c-1.645-6.557-7.007-7.266-12.705-7.285c-1.728-0.006-2.521,1.422-2.401,2.754c-0.068,0.234-0.118,0.482-0.118,0.758
                          c-0.008,2.517-0.665,8.605-1.382,16.3c-4.275,13.324-8.808,26.704-16.4,38.53c-0.856,1.332-1.885,2.816-3.058,4.215
                          c-0.221,0.132-0.436,0.291-0.631,0.51c-0.683,0.764-1.378,1.516-2.089,2.25c-2.423,2.022-5.27,3.242-8.447,2.338
                          c-6.46-1.84-7.639-11.588-7.853-17.121c-0.59-15.274,5.032-50.82,27.228-45.957c1.721,0.378,2.999-0.893,3.273-2.221
                          c0.129-0.471,0.099-1.01-0.179-1.593c-5.391-11.304-21.279-10.751-30.837-5.546c-12.958,7.057-16.732,23.674-17.865,37.146
                          c-1.081,12.859-0.091,31.237,10.372,40.525c10.066,8.935,20.269,3.538,28.248-4.523c0.371-0.33,0.736-0.667,1.084-1.015
                          c5.312-5.294,8.684-12.483,11.898-19.151c1.37-2.843,2.604-5.744,3.759-8.681c-1.094,21.095-0.058,42.746,10.608,39.853
                          c0.612,0.042,1.254-0.122,1.836-0.602c1.856-1.529,2.811-3.461,3.047-5.876c0.423-4.313,0.841-8.667,1.106-12.994
                          c0.029-0.474,0.055-0.948,0.084-1.422c0.744-2.872,2.04-5.552,4.186-7.634c4.016-3.896,3.906,5.043,4.03,7.344
                          c0.278,5.185,1.018,14.533,8.667,11.76c7.027-2.548,10.771-14.33,13.25-20.424c1.593-3.917,3.619-8.845,4.956-13.94
                          c1.566,3.384-1.042,11.239-1.647,13.267c-1.476,4.941-2.356,10.434-1.964,15.589c0.706,9.278,11.976,11.216,18.402,6.605
                          c3.332-1.757,6.134-5.604,8.04-8.131c1.101-1.46,2.081-3.003,2.998-4.586c1.211,5.622,4.609,9.733,12.011,9.672
                          c7.101-0.059,11.214-5.362,14.678-10.935c2.319-3.731,4.263-7.62,5.963-11.614c2.494,5.507,5.872,10.794,8.059,16.11
                          c0.122,0.296,0.243,0.592,0.365,0.887c-2.071,2.531-3.853,5.227-5.233,8.051c-2.235,4.572-1.938,10.06,1.919,13.577
                          c0.492,0.448,1.026,0.776,1.581,1.019c2.955,3.153,8.446,0.907,11.498-0.992c5.925-3.688,6.264-9.9,5.278-16.197
                          c-0.465-2.975-1.808-6.379-3.436-9.988c2.62-2.053,5.406-3.893,8.191-5.485c0.415,3.625,1.309,7.151,2.914,10.368
                          c3.135,6.28,11.169,8.172,16.498,3.572c1.966-1.697,3.571-3.658,4.938-5.781c-0.023,4.055,0.58,8.397,3.894,10.92
                          c0.357,0.271,0.728,0.422,1.094,0.49c0.148,0.041,0.301,0.076,0.47,0.094c1.517,0.146,6.129-0.796,6.649-2.145
                          c2.517-6.523,4.879-13.422,8.739-19.307c0.129-0.097,0.255-0.202,0.375-0.332c0.863-0.926,1.713-1.857,2.613-2.748
                          c2.502-2.475,2.983,0.896,2.951,2.806c-0.054,3.146-0.345,6.255,0.466,9.348c1.156,4.401,3.6,10.899,9.298,9.868
                          c0.047-0.008,0.087-0.026,0.133-0.037c2.893-0.604,2.249-2.187,2.593-5.282c1.062-7.313,2.738-14.266,7.951-19.983
                          c2.406-2.638,3.516,1.379,3.458,3.277c-0.095,3.143,0.239,6.271,0.462,9.402c0.249,3.491,0.274,7.195,1.878,10.407
                          c3.042,6.089,9.097,5.726,14.351,2.589c2.73-1.63,5.002-3.938,7.014-6.527c0.79-0.836,1.535-1.721,2.248-2.633
                          c2.311,5.133,7.343,8.613,13.488,6.277c5.206-1.979,8.373-6.264,10.663-11.111c0.003,0.992,0.035,1.977,0.109,2.949
                          c0.443,5.781,2.322,12.656,8.681,14.157c6.782,1.601,13.651-3.394,16.59-9.077c3.014-5.826,5.978-11.104,8.182-16.93
                          c1.69,2.215,3.788,4.211,5.697,6.215c-1.943,1.607-3.578,3.559-4.705,5.9c-2.504,5.201-2.437,13.383,5.157,13.818
                          c1.853,0.106,5.827-0.85,7.13-1.448c4.467-2.05,7.093-7.038,6.412-12.717c-0.242-2.015-0.845-3.987-1.645-5.888
                          c1.505-0.325,2.975-0.504,4.309-0.533C463.024,326.706,463.48,321.725,460.261,321.795z M188.352,301.441
                          c-0.942-0.343-1.874-0.711-2.781-1.141c-1.822-0.864-3.352-2.31-3.907-4.281c-0.647-2.295,1.561-5.789,3.488-4.93
                          c0.107,0.214,0.24,0.426,0.432,0.63C188.093,294.385,188.643,297.85,188.352,301.441z M262.668,352.641
                          c-0.679,2.059-2.257,2.356-4.736,0.896c-1.603-2.24-0.157-5.558,0.847-7.611c0.641-1.311,1.408-2.587,2.267-3.83
                          c0.501,1.384,0.972,2.779,1.354,4.215C262.957,348.4,263.166,350.529,262.668,352.641z M399.04,324.032
                          c-1.301,2.104-5.967,10.753-8.043,5.184c-1.247-3.347,0.451-8.728,1.844-11.843c1.66-3.712,5.99-6.674,9.446-5.381
                          c1.393,0.712,1.355,1.988,1.422,2.088C402.629,317.688,400.541,321.604,399.04,324.032z M447.175,338.299
                          c-0.397,3.41-5.654,5.101-5.223,0.588c0.29-3.033,1.956-5.486,4.283-7.371C447.3,333.583,447.464,335.817,447.175,338.299z
                          M223.894,292.253c-1.772-3.511-0.005-8.671,3.667-10.292c0.365-0.162,0.747-0.25,1.123-0.273c1.069-0.67,2.285-1.07,3.589-1.021
                          c3.533,0.135,5.696,3.474,5.627,6.785c-0.071,3.384-1.722,6.66-5.083,7.813C229.756,296.314,225.461,295.355,223.894,292.253z
                          M308.336,425.396c-5.223-8.412-5.395-17.662-8.412-26.787c-1.359-4.113-4.332-9.742-8.426-12.928
                          c1.357-0.906,2.586-2.051,3.658-3.121c1.939-1.938,5.084-5.66,2.957-8.486c-2.625-3.483-6.977-0.607-10.061,3.186
                          c-0.195-3.039-1.205-6.039-2.945-8.348c-0.449-0.596-1.426-0.861-2.096-0.494c-3.602,1.968-4.486,5.473-3.988,9.096
                          c-0.645-0.423-1.311-0.816-2.016-1.146c-2.406-1.127-6.156-1.715-8.18,0.41c-2.232,2.342-0.52,5.75,1.561,7.461
                          c1.535,1.264,3.385,2.334,5.318,3.154c-3.342,3.002-6.027,7.102-7.779,10.5c-4.67,9.063-4.26,19.441-10.785,27.766
                          c-0.432,0.549-0.467,1.106-0.27,1.564c-0.113,0.512,0.018,1.057,0.543,1.438c4.328,3.127,10.275,4.57,16.166,5.256
                          c-0.072,2.406,1.021,4.623,3.855,5.092c2.941,0.488,5.65-1.881,6.91-4.469c4.621,0.059,8.988-0.834,13.396-2.129
                          c2.826-0.832,6.23-1.631,8.572-3.602C307.777,428.998,309.396,427.104,308.336,425.396z M290.861,379.414
                          c0.773-0.965,1.715-1.814,2.701-2.555c0.422-0.316,1.707-0.59,1.645-0.781c0.445,1.385-2.645,3.986-3.471,4.744
                          c-0.98,0.9-2.387,2.168-3.813,2.837C288.561,382.207,290,380.488,290.861,379.414z M283.254,372.627
                          c1.404,2.905,1.195,5.984,0.563,9.111C282.434,378.662,281.416,374.834,283.254,372.627z M271.51,379.096
                          c1.439-0.957,4.23,0.541,5.492,1.246c1.6,0.896,2.699,2.324,3.809,3.738c-0.592,0.24-1.17,0.533-1.736,0.855
                          C275.746,383.293,269.852,380.198,271.51,379.096z M282.422,428.195c-3.604,0.094-7.209-0.127-10.764-0.699
                          c-2.049-0.33-4.004-1.096-5.963-1.793c1.998-2.264,3.27-5.561,4.246-8.104c3.371-8.783,1.41-19.32,9.004-26.148
                          c11.117-9.994,14.707,11.941,15.469,18.465c0.658,5.637,1.75,10.769,4.873,14.936C293.908,426.943,288.521,428.035,282.422,428.195z
                          M321.808,144.121c-1.422,1.533-2.969,2.535-4.684,3.527c-1.709,0.988-8.504,4.634-9.122,0.725c-0.183-0.386-0.243-0.873-0.082-1.41
                          c0.069-0.227,0.156-0.443,0.25-0.655c0.625-1.88,2.575-3.097,4.015-3.896l0,0c0.53-0.303,1.055-0.574,1.543-0.817
                          c2.129-1.065,4.643-2.479,6.982-2.228C322.936,139.607,323.423,142.385,321.808,144.121z M328.172,172.662
                          c-3.793,1.312-12.827,2.691-14.633-2.268c-0.752-2.069,0.467-3.036,2.34-3.361c4.24-1.541,9.16-0.662,12.784,2.05
                          C330.049,170.12,329.875,172.072,328.172,172.662z M324.916,197.143c-1.335,2.791-5.577,0.688-7.417-0.281
                          c-2.016-1.059-5.563-2.74-6.187-5.203c-0.203-0.801,0.03-1.658,0.644-2.126c0.238-0.397,0.643-0.692,1.215-0.726
                          C316.851,188.586,327.475,191.793,324.916,197.143z M233.856,152.488c-0.237,0.131-0.514,0.209-0.835,0.191
                          c-3.007-0.154-6.901-1.332-8.833-3.824c-1.316-1.701-2.986-4.377-1.227-6.336c2.125-2.367,7.309,0.695,9.703,2.277
                          c0.1,0.059,0.205,0.119,0.303,0.178c1.395,0.83,4.222,2.334,4.225,4.27c0.008,0.033,0.025,0.065,0.031,0.1
                          C237.565,151.362,235.669,152.52,233.856,152.488z M230.982,173.435c-1.393,1.3-3.721,1.729-5.535,1.979
                          c-2.929,0.404-9.467,0.411-9.453-3.871c0.008-2.277,2.846-3.678,4.752-3.949c1.42-0.203,2.926-0.299,4.389-0.137
                          c2.098-0.279,4.139,0.038,5.646,1.414C232.195,170.161,232.443,172.07,230.982,173.435z M234.063,191.785
                          c-0.673,1.549-2.277,2.795-3.684,3.646c-2.131,1.293-7.573,3.701-8.916,0.16c-0.793-2.094,1.219-4.018,2.82-5.041
                          c2.022-1.943,5.043-3.156,7.463-2.689C233.645,188.229,234.885,189.895,234.063,191.785z M296.14,189.635
                          c-1.104,4.083-7.115,2.278-11.797-0.326c-0.054,0.566-0.196,1.088-0.486,1.482c-1.417,1.93-3.429,1.348-5.439,0.785
                          c-1.392-0.389-2.955-1.035-4.287-1.937c-1.921,1.688-4.589,3.128-6.68,2.35c-1.295-0.481-2.037-1.654-2.309-3.003
                          c-4.101,1.89-9.116,1.963-13.158,0.122c-0.898-0.409-1.146-1.304-0.686-2.151c0.67-1.236,1.87-2.507,3.237-3.609
                          c-2.208-0.544-4.239-1.514-5.653-2.916c-0.543-0.538-0.559-1.465-0.008-2.006c1.861-1.824,4.303-2.32,6.713-3.072
                          c1.243-0.389,2.343-1.06,3.408-1.803c-2.771-0.641-5.069-2.195-4.321-4.97c0.688-2.548,3.37-3.468,5.471-4.599
                          c1.62-0.871,2.862-2.019,4.045-3.221c0.102-0.169,0.203-0.338,0.301-0.508c-1.67-0.475-3.289-1.338-4.72-2.131
                          c-0.718-0.397-0.846-1.671-0.151-2.158c1.973-1.383,3.707-2.889,5.275-4.504c-0.562-0.574-0.789-1.381-0.392-2.521
                          c0.668-1.92,2.366-3.146,3.849-4.43c1.78-1.54,2.971-3.471,4.544-5.175c0.269-0.292,0.606-0.386,0.933-0.347
                          c0.707-0.57,2.092-0.457,2.498,0.701c1.061,3.03,3.752,5.49,5.982,7.695c1.026,1.015,2.254,2.354,1.722,3.914
                          c-0.293,0.858-0.995,1.34-1.885,1.592c0.318,0.398,0.655,0.783,1.036,1.133c0.85,0.781,1.873,1.389,2.766,2.122
                          c1.496,1.228,3.127,3.204,1.646,5.081c-0.693,0.879-1.709,1.33-2.878,1.475c1.904,0.926,4.104,1.422,6.026,2.4
                          c2.042,1.043,3.669,3.069,1.584,5.077c-1.285,1.236-3.229,1.612-5.104,1.686c0.6,0.649,1.212,1.286,1.895,1.851
                          c1.149,0.949,2.333,1.509,3.654,2.152c2.046,1,1.814,2.939,0.509,4.447c-0.993,1.146-2.275,1.703-3.674,1.875
                          c0.343,0.256,0.683,0.511,1.011,0.768C292.313,184.283,296.874,186.922,296.14,189.635z M233.117,380.289c0,2.761-2.238,5-5,5
                          s-5-2.239-5-5c0-2.762,2.238-5,5-5S233.117,377.527,233.117,380.289z M241.117,414.289c0,2.761-2.238,5-5,5s-5-2.239-5-5
                          c0-2.762,2.238-5,5-5S241.117,411.527,241.117,414.289z M337.117,413.289c0,2.761-2.238,5-5,5s-5-2.239-5-5c0-2.762,2.238-5,5-5
                          S337.117,410.527,337.117,413.289z M201.867,399.289c0,2.07-1.679,3.75-3.75,3.75s-3.75-1.68-3.75-3.75
                          c0-2.071,1.679-3.75,3.75-3.75S201.867,397.218,201.867,399.289z M331.617,377.289c0,2.07-1.679,3.75-3.75,3.75
                          s-3.75-1.68-3.75-3.75c0-2.071,1.679-3.75,3.75-3.75S331.617,375.218,331.617,377.289z M366.867,385.289
                          c0,2.07-1.679,3.75-3.75,3.75s-3.75-1.68-3.75-3.75c0-2.071,1.679-3.75,3.75-3.75S366.867,383.218,366.867,385.289z`
          })
        ],
        -1
      )
    ),
    _hoisted_11 = [_hoisted_10],
    _hoisted_12 = { class: 'card-page cart-page-bottom' },
    _hoisted_13 = { class: 'w-full' },
    _hoisted_14 = _withScopeId(() =>
      createBaseVNode(
        'p',
        { class: 'text-secondary font-bold text-base' },
        [
          createTextVNode(' As a token of my appreciation, '),
          createBaseVNode('br'),
          createTextVNode(' here is a Gift Card for Pinkoi! ')
        ],
        -1
      )
    ),
    _hoisted_15 = { class: 'mt-1 text-primary font-bold text-base' },
    _hoisted_16 = _withScopeId(() =>
      createBaseVNode(
        'svg',
        { viewBox: '0 0 40 40', xmlns: 'http://www.w3.org/2000/svg' },
        [
          createBaseVNode('path', {
            fill: '#fff',
            d: 'M31.6 17.7V26c0 1.9-.7 3.7-2 5.1v.9c0 1.6-1.3 3-3 3h-8.4c-1.6 0-3-1.3-3-3 0-.6.5-1 1-1s1 .4 1 1c0 .5.4 1 1 1h8.4c.5 0 1-.4 1-1v-1.2-.3-.1c0-.1.1-.2.2-.3 1.1-1.1 1.7-2.5 1.7-4v-8.3c0-.3-.1-.5-.3-.7-.1-.1-.5-.4-1-.3-.4.1-.8.6-.8 1.1v2.4c0 .6-.5 1-1 1s-1-.4-1-1v-5.5c0-.3-.1-.5-.3-.7s-.4-.3-.7-.3c-.5 0-1 .5-1 1v5.5c0 .6-.5 1-1 1s-1-.4-1-1v-8.5c0-.3-.1-.5-.3-.7s-.4-.3-.7-.3c-.5 0-1 .5-1 1v8.5c0 .6-.5 1-1 1s-1-.4-1-1V7.7c0-.3-.1-.5-.3-.7-.1-.1-.5-.4-1-.3-.4.1-.8.6-.8 1.1V20c0 .4-.2.8-.6.9-.4.2-.8.1-1.1-.2L11 18.1c-.6-.6-1.6-.6-2.2.1-.5.6-.4 1.5.2 2.1l7 7c.4.4.4 1 0 1.4-.2.2-.5.3-.7.3-.3 0-.5-.1-.7-.3l-7-7.1c-1.3-1.3-1.5-3.5-.3-4.8C8 16 9 15.5 10 15.5c.9 0 1.8.4 2.5 1l.9.9V7.9c0-1.4.9-2.7 2.3-3 1-.3 2.1 0 2.8.8.6.6.9 1.3.9 2.1V9c.3-.1.7-.2 1-.2.8 0 1.5.3 2.1.9s.9 1.3.9 2.1v.2c.3-.1.7-.2 1-.2.8 0 1.5.3 2.1.9s.9 1.3.9 2.1v.2c.1 0 .2-.1.3-.1 1-.3 2.1 0 2.8.8.8.5 1.1 1.3 1.1 2z'
          })
        ],
        -1
      )
    ),
    _hoisted_17 = [_hoisted_16],
    _hoisted_18 = { class: 'w-full h-full flex justify-center items-center flex-col gap-6' },
    _hoisted_19 = _withScopeId(() =>
      createBaseVNode(
        'h1',
        { class: 'text-white font-extrabold text-2xl' },
        'Here is a Christmas Game with a Prize 😊',
        -1
      )
    ),
    _hoisted_20 = {
      class:
        'bg-secondary w-[450px] h-[350px] rounded-md flex flex-wrap justify-evenly items-center p-3 gap-2'
    },
    _hoisted_21 = ['onClick'],
    _hoisted_22 = _withScopeId(() =>
      createBaseVNode('div', { class: 'bg-primary rounded-md card-front' }, null, -1)
    ),
    _hoisted_23 = _withScopeId(() => createBaseVNode('div', { class: '' }, null, -1)),
    winSoundFile = '@https://brihan-tech.github.io/ChristmasCard/assets/sounds/win.wav',
    snowFlakes = 300,
    _sfc_main$1 = defineComponent({
      __name: 'App',
      setup(e) {
        const t = new Audio(winSoundFile),
          r = useLocalStorage('hasCompleted', !1),
          i = ref(null),
          n = () => {
            if (i.value) {
              const d = i.value.scrollLeft,
                g = i.value.clientWidth
              i.value.scrollTo({ left: d + g, behavior: 'smooth' })
            }
          },
          s = (d) => {
            if (!i.value) return
            const g = i.value.clientWidth,
              C = d.deltaY > 0 ? i.value.scrollLeft + g : i.value.scrollLeft - g
            i.value.scrollTo({ left: C, behavior: 'smooth' })
          },
          a = ref(!1),
          l = () => (a.value = !a.value),
          o = [christmasTree, christmasWreath, gingerbreadMan, santaClaus, stocking, gift],
          f = [...o, ...o].sort(() => Math.random() - 0.5),
          u = ref(f.map((d) => ({ content: d, flipped: !1 }))),
          E = ref([]),
          c = ref([]),
          b = () => {
            setTimeout(() => {
              const d = u.value[c.value[0]],
                g = u.value[c.value[1]]
              d.content === g.content
                ? E.value.push(d.content)
                : ((u.value[c.value[0]].flipped = !1), (u.value[c.value[1]].flipped = !1)),
                (c.value = [])
            }, 1e3)
          },
          x = (d) => {
            if (!E.value.includes(u.value[d].content)) {
              if (c.value.length < 2 && !u.value[d].flipped) {
                ;(u.value[d].flipped = !0), c.value.push(d), c.value.length === 2 && b()
                return
              }
              c.value.length < 2 && u.value[d].flipped && ((u.value[d].flipped = !1), c.value.pop())
            }
          },
          y = computed(() => E.value.length === u.value.length / 2)
        whenever(y, () => {
          ;(r.value = !0), t.play()
        })
        const _ = () => {
            const d = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff']
            return d[Math.floor(Math.random() * d.length)]
          },
          m = (d) => ({
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            backgroundColor: _()
          }),
          A = computed(() => {
            const g = window.location.href.split('/')
            return g[g.length - 1]
          })
        return (
          onMounted(() => {
            window.innerWidth < 768 &&
              alert(
                'This app is best used on a desktop or laptop. Please switch to a larger screen to play.'
              )
          }),
          (d, g) => {
            const C = resolveComponent('Vue3Lottie')
            return (
              openBlock(),
              createElementBlock(
                'div',
                {
                  ref_key: 'appContainer',
                  ref: i,
                  class:
                    'flex flex-row overflow-x-auto snap-x snap-mandatory h-screen overflow-y-hidden whitespace-nowrap',
                  onWheel: s
                },
                [
                  createBaseVNode(
                    'section',
                    {
                      class:
                        'snap-center w-screen h-screen flex-grow-0 flex-shrink-0 bg-center bg-no-repeat bg-cover relative',
                      style: normalizeStyle(`background-image: url(${unref(christmasHouse)})`)
                    },
                    [
                      createBaseVNode('div', _hoisted_1, [
                        (openBlock(),
                        createElementBlock(
                          Fragment,
                          null,
                          renderList(snowFlakes, (P) =>
                            createBaseVNode('div', { class: 'snow', key: P })
                          ),
                          64
                        ))
                      ]),
                      createBaseVNode('div', _hoisted_2, [
                        createBaseVNode('div', _hoisted_3, [
                          createVNode(
                            C,
                            {
                              animationData: unref(merryChristmas),
                              height: 300,
                              width: 300,
                              loop: !1
                            },
                            null,
                            8,
                            ['animationData']
                          ),
                          _hoisted_4
                        ])
                      ]),
                      createBaseVNode(
                        'button',
                        {
                          class:
                            'absolute right-2 top-1/2 -translate-y-[50%] text-white text-6xl animate-pulse',
                          onClick: n
                        },
                        ' ▶ '
                      )
                    ],
                    4
                  ),
                  createBaseVNode('section', _hoisted_5, [
                    createBaseVNode(
                      'section',
                      {
                        class: 'absolute top-0 left-0 transition-all z-50 w-screen h-screen',
                        style: normalizeStyle([
                          { background: 'radial-gradient(at top, #12313b, #000822)' },
                          {
                            transform: unref(r) ? 'translateY(0vh)' : 'translateY(-100vh)',
                            opacity: unref(r) ? 1 : 0
                          }
                        ])
                      },
                      [
                        (openBlock(),
                        createElementBlock(
                          Fragment,
                          null,
                          renderList(200, (P) =>
                            createBaseVNode(
                              'div',
                              { key: P, class: 'confetti-piece', style: normalizeStyle(m()) },
                              null,
                              4
                            )
                          ),
                          64
                        )),
                        createBaseVNode('div', _hoisted_6, [
                          createBaseVNode(
                            'div',
                            {
                              class: normalizeClass(['christmas-card', { 'is-opened': a.value }]),
                              onClick: l
                            },
                            [
                              createBaseVNode('div', _hoisted_7, [
                                _hoisted_8,
                                createBaseVNode('div', _hoisted_9, [
                                  createBaseVNode(
                                    'span',
                                    {
                                      class: normalizeClass([
                                        'merry-christmas',
                                        { 'is-hidden': a.value }
                                      ])
                                    },
                                    _hoisted_11,
                                    2
                                  )
                                ])
                              ]),
                              createBaseVNode('div', _hoisted_12, [
                                createBaseVNode('div', _hoisted_13, [
                                  _hoisted_14,
                                  createBaseVNode('p', _hoisted_15, toDisplayString(A.value), 1)
                                ])
                              ])
                            ],
                            2
                          )
                        ]),
                        createBaseVNode(
                          'span',
                          {
                            class: normalizeClass([
                              'click-icon translate-y-[-100%]',
                              { 'opacity-0': a.value }
                            ])
                          },
                          _hoisted_17,
                          2
                        )
                      ],
                      4
                    ),
                    createBaseVNode('div', _hoisted_18, [
                      _hoisted_19,
                      createBaseVNode('section', _hoisted_20, [
                        (openBlock(!0),
                        createElementBlock(
                          Fragment,
                          null,
                          renderList(
                            u.value,
                            (P, k) => (
                              openBlock(),
                              createElementBlock(
                                'div',
                                {
                                  key: k,
                                  class: 'card rounded-md hover:cursor-pointer',
                                  onClick: (M) => x(k)
                                },
                                [
                                  createBaseVNode(
                                    'div',
                                    {
                                      class: normalizeClass([
                                        'card-inner rounded-md border-2 border-accent',
                                        { 'is-flipped': P.flipped }
                                      ])
                                    },
                                    [
                                      _hoisted_22,
                                      createBaseVNode(
                                        'div',
                                        {
                                          class:
                                            'card-back rounded-md bg-cover bg-center bg-no-repeat',
                                          style: normalizeStyle(
                                            `background-image: url(${P.content})`
                                          )
                                        },
                                        null,
                                        4
                                      )
                                    ],
                                    2
                                  )
                                ],
                                8,
                                _hoisted_21
                              )
                            )
                          ),
                          128
                        ))
                      ])
                    ]),
                    _hoisted_23
                  ])
                ],
                544
              )
            )
          }
        )
      }
    }),
    _export_sfc$1 = (e, t) => {
      const r = e.__vccOpts || e
      for (const [i, n] of t) r[i] = n
      return r
    },
    App = _export_sfc$1(_sfc_main$1, [['__scopeId', 'data-v-d5c942a0']])
  var commonjsGlobal =
    typeof globalThis < 'u'
      ? globalThis
      : typeof window < 'u'
        ? window
        : typeof global < 'u'
          ? global
          : typeof self < 'u'
            ? self
            : {}
  function getDefaultExportFromCjs(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, 'default') ? e.default : e
  }
  var lottie = { exports: {} }
  ;(function (module, exports) {
    typeof navigator < 'u' &&
      (function (e, t) {
        module.exports = t()
      })(commonjsGlobal, function () {
        var svgNS = 'http://www.w3.org/2000/svg',
          locationHref = '',
          _useWebWorker = !1,
          initialDefaultFrame = -999999,
          setWebWorker = function (t) {
            _useWebWorker = !!t
          },
          getWebWorker = function () {
            return _useWebWorker
          },
          setLocationHref = function (t) {
            locationHref = t
          },
          getLocationHref = function () {
            return locationHref
          }
        function createTag(e) {
          return document.createElement(e)
        }
        function extendPrototype(e, t) {
          var r,
            i = e.length,
            n
          for (r = 0; r < i; r += 1) {
            n = e[r].prototype
            for (var s in n) Object.prototype.hasOwnProperty.call(n, s) && (t.prototype[s] = n[s])
          }
        }
        function getDescriptor(e, t) {
          return Object.getOwnPropertyDescriptor(e, t)
        }
        function createProxyFunction(e) {
          function t() {}
          return (t.prototype = e), t
        }
        var audioControllerFactory = (function () {
            function e(t) {
              ;(this.audios = []), (this.audioFactory = t), (this._volume = 1), (this._isMuted = !1)
            }
            return (
              (e.prototype = {
                addAudio: function (r) {
                  this.audios.push(r)
                },
                pause: function () {
                  var r,
                    i = this.audios.length
                  for (r = 0; r < i; r += 1) this.audios[r].pause()
                },
                resume: function () {
                  var r,
                    i = this.audios.length
                  for (r = 0; r < i; r += 1) this.audios[r].resume()
                },
                setRate: function (r) {
                  var i,
                    n = this.audios.length
                  for (i = 0; i < n; i += 1) this.audios[i].setRate(r)
                },
                createAudio: function (r) {
                  return this.audioFactory
                    ? this.audioFactory(r)
                    : window.Howl
                      ? new window.Howl({ src: [r] })
                      : {
                          isPlaying: !1,
                          play: function () {
                            this.isPlaying = !0
                          },
                          seek: function () {
                            this.isPlaying = !1
                          },
                          playing: function () {},
                          rate: function () {},
                          setVolume: function () {}
                        }
                },
                setAudioFactory: function (r) {
                  this.audioFactory = r
                },
                setVolume: function (r) {
                  ;(this._volume = r), this._updateVolume()
                },
                mute: function () {
                  ;(this._isMuted = !0), this._updateVolume()
                },
                unmute: function () {
                  ;(this._isMuted = !1), this._updateVolume()
                },
                getVolume: function () {
                  return this._volume
                },
                _updateVolume: function () {
                  var r,
                    i = this.audios.length
                  for (r = 0; r < i; r += 1)
                    this.audios[r].volume(this._volume * (this._isMuted ? 0 : 1))
                }
              }),
              function () {
                return new e()
              }
            )
          })(),
          createTypedArray = (function () {
            function e(r, i) {
              var n = 0,
                s = [],
                a
              switch (r) {
                case 'int16':
                case 'uint8c':
                  a = 1
                  break
                default:
                  a = 1.1
                  break
              }
              for (n = 0; n < i; n += 1) s.push(a)
              return s
            }
            function t(r, i) {
              return r === 'float32'
                ? new Float32Array(i)
                : r === 'int16'
                  ? new Int16Array(i)
                  : r === 'uint8c'
                    ? new Uint8ClampedArray(i)
                    : e(r, i)
            }
            return typeof Uint8ClampedArray == 'function' && typeof Float32Array == 'function'
              ? t
              : e
          })()
        function createSizedArray(e) {
          return Array.apply(null, { length: e })
        }
        function _typeof$6(e) {
          '@babel/helpers - typeof'
          return (
            typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
              ? (_typeof$6 = function (r) {
                  return typeof r
                })
              : (_typeof$6 = function (r) {
                  return r &&
                    typeof Symbol == 'function' &&
                    r.constructor === Symbol &&
                    r !== Symbol.prototype
                    ? 'symbol'
                    : typeof r
                }),
            _typeof$6(e)
          )
        }
        var subframeEnabled = !0,
          expressionsPlugin = null,
          expressionsInterfaces = null,
          idPrefix$1 = '',
          isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
          bmPow = Math.pow,
          bmSqrt = Math.sqrt,
          bmFloor = Math.floor,
          bmMax = Math.max,
          bmMin = Math.min,
          BMMath = {}
        ;(function () {
          var e = [
              'abs',
              'acos',
              'acosh',
              'asin',
              'asinh',
              'atan',
              'atanh',
              'atan2',
              'ceil',
              'cbrt',
              'expm1',
              'clz32',
              'cos',
              'cosh',
              'exp',
              'floor',
              'fround',
              'hypot',
              'imul',
              'log',
              'log1p',
              'log2',
              'log10',
              'max',
              'min',
              'pow',
              'random',
              'round',
              'sign',
              'sin',
              'sinh',
              'sqrt',
              'tan',
              'tanh',
              'trunc',
              'E',
              'LN10',
              'LN2',
              'LOG10E',
              'LOG2E',
              'PI',
              'SQRT1_2',
              'SQRT2'
            ],
            t,
            r = e.length
          for (t = 0; t < r; t += 1) BMMath[e[t]] = Math[e[t]]
        })(),
          (BMMath.random = Math.random),
          (BMMath.abs = function (e) {
            var t = _typeof$6(e)
            if (t === 'object' && e.length) {
              var r = createSizedArray(e.length),
                i,
                n = e.length
              for (i = 0; i < n; i += 1) r[i] = Math.abs(e[i])
              return r
            }
            return Math.abs(e)
          })
        var defaultCurveSegments = 150,
          degToRads = Math.PI / 180,
          roundCorner = 0.5519
        function styleDiv(e) {
          ;(e.style.position = 'absolute'),
            (e.style.top = 0),
            (e.style.left = 0),
            (e.style.display = 'block'),
            (e.style.transformOrigin = '0 0'),
            (e.style.webkitTransformOrigin = '0 0'),
            (e.style.backfaceVisibility = 'visible'),
            (e.style.webkitBackfaceVisibility = 'visible'),
            (e.style.transformStyle = 'preserve-3d'),
            (e.style.webkitTransformStyle = 'preserve-3d'),
            (e.style.mozTransformStyle = 'preserve-3d')
        }
        function BMEnterFrameEvent(e, t, r, i) {
          ;(this.type = e),
            (this.currentTime = t),
            (this.totalTime = r),
            (this.direction = i < 0 ? -1 : 1)
        }
        function BMCompleteEvent(e, t) {
          ;(this.type = e), (this.direction = t < 0 ? -1 : 1)
        }
        function BMCompleteLoopEvent(e, t, r, i) {
          ;(this.type = e),
            (this.currentLoop = r),
            (this.totalLoops = t),
            (this.direction = i < 0 ? -1 : 1)
        }
        function BMSegmentStartEvent(e, t, r) {
          ;(this.type = e), (this.firstFrame = t), (this.totalFrames = r)
        }
        function BMDestroyEvent(e, t) {
          ;(this.type = e), (this.target = t)
        }
        function BMRenderFrameErrorEvent(e, t) {
          ;(this.type = 'renderFrameError'), (this.nativeError = e), (this.currentTime = t)
        }
        function BMConfigErrorEvent(e) {
          ;(this.type = 'configError'), (this.nativeError = e)
        }
        var createElementID = (function () {
          var e = 0
          return function () {
            return (e += 1), idPrefix$1 + '__lottie_element_' + e
          }
        })()
        function HSVtoRGB(e, t, r) {
          var i, n, s, a, l, o, f, u
          switch (
            ((a = Math.floor(e * 6)),
            (l = e * 6 - a),
            (o = r * (1 - t)),
            (f = r * (1 - l * t)),
            (u = r * (1 - (1 - l) * t)),
            a % 6)
          ) {
            case 0:
              ;(i = r), (n = u), (s = o)
              break
            case 1:
              ;(i = f), (n = r), (s = o)
              break
            case 2:
              ;(i = o), (n = r), (s = u)
              break
            case 3:
              ;(i = o), (n = f), (s = r)
              break
            case 4:
              ;(i = u), (n = o), (s = r)
              break
            case 5:
              ;(i = r), (n = o), (s = f)
              break
          }
          return [i, n, s]
        }
        function RGBtoHSV(e, t, r) {
          var i = Math.max(e, t, r),
            n = Math.min(e, t, r),
            s = i - n,
            a,
            l = i === 0 ? 0 : s / i,
            o = i / 255
          switch (i) {
            case n:
              a = 0
              break
            case e:
              ;(a = t - r + s * (t < r ? 6 : 0)), (a /= 6 * s)
              break
            case t:
              ;(a = r - e + s * 2), (a /= 6 * s)
              break
            case r:
              ;(a = e - t + s * 4), (a /= 6 * s)
              break
          }
          return [a, l, o]
        }
        function addSaturationToRGB(e, t) {
          var r = RGBtoHSV(e[0] * 255, e[1] * 255, e[2] * 255)
          return (
            (r[1] += t), r[1] > 1 ? (r[1] = 1) : r[1] <= 0 && (r[1] = 0), HSVtoRGB(r[0], r[1], r[2])
          )
        }
        function addBrightnessToRGB(e, t) {
          var r = RGBtoHSV(e[0] * 255, e[1] * 255, e[2] * 255)
          return (
            (r[2] += t), r[2] > 1 ? (r[2] = 1) : r[2] < 0 && (r[2] = 0), HSVtoRGB(r[0], r[1], r[2])
          )
        }
        function addHueToRGB(e, t) {
          var r = RGBtoHSV(e[0] * 255, e[1] * 255, e[2] * 255)
          return (
            (r[0] += t / 360),
            r[0] > 1 ? (r[0] -= 1) : r[0] < 0 && (r[0] += 1),
            HSVtoRGB(r[0], r[1], r[2])
          )
        }
        var rgbToHex = (function () {
            var e = [],
              t,
              r
            for (t = 0; t < 256; t += 1) (r = t.toString(16)), (e[t] = r.length === 1 ? '0' + r : r)
            return function (i, n, s) {
              return i < 0 && (i = 0), n < 0 && (n = 0), s < 0 && (s = 0), '#' + e[i] + e[n] + e[s]
            }
          })(),
          setSubframeEnabled = function (t) {
            subframeEnabled = !!t
          },
          getSubframeEnabled = function () {
            return subframeEnabled
          },
          setExpressionsPlugin = function (t) {
            expressionsPlugin = t
          },
          getExpressionsPlugin = function () {
            return expressionsPlugin
          },
          setExpressionInterfaces = function (t) {
            expressionsInterfaces = t
          },
          getExpressionInterfaces = function () {
            return expressionsInterfaces
          },
          setDefaultCurveSegments = function (t) {
            defaultCurveSegments = t
          },
          getDefaultCurveSegments = function () {
            return defaultCurveSegments
          },
          setIdPrefix = function (t) {
            idPrefix$1 = t
          }
        function createNS(e) {
          return document.createElementNS(svgNS, e)
        }
        function _typeof$5(e) {
          '@babel/helpers - typeof'
          return (
            typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
              ? (_typeof$5 = function (r) {
                  return typeof r
                })
              : (_typeof$5 = function (r) {
                  return r &&
                    typeof Symbol == 'function' &&
                    r.constructor === Symbol &&
                    r !== Symbol.prototype
                    ? 'symbol'
                    : typeof r
                }),
            _typeof$5(e)
          )
        }
        var dataManager = (function () {
            var e = 1,
              t = [],
              r,
              i,
              n = {
                onmessage: function () {},
                postMessage: function (b) {
                  r({ data: b })
                }
              },
              s = {
                postMessage: function (b) {
                  n.onmessage({ data: b })
                }
              }
            function a(c) {
              if (window.Worker && window.Blob && getWebWorker()) {
                var b = new Blob(['var _workerSelf = self; self.onmessage = ', c.toString()], {
                    type: 'text/javascript'
                  }),
                  x = URL.createObjectURL(b)
                return new Worker(x)
              }
              return (r = c), n
            }
            function l() {
              i ||
                ((i = a(function (b) {
                  function x() {
                    function _(L, B) {
                      var T,
                        j,
                        S = L.length,
                        R,
                        V,
                        K,
                        re
                      for (j = 0; j < S; j += 1)
                        if (((T = L[j]), 'ks' in T && !T.completed)) {
                          if (((T.completed = !0), T.hasMask)) {
                            var ne = T.masksProperties
                            for (V = ne.length, R = 0; R < V; R += 1)
                              if (ne[R].pt.k.i) C(ne[R].pt.k)
                              else
                                for (re = ne[R].pt.k.length, K = 0; K < re; K += 1)
                                  ne[R].pt.k[K].s && C(ne[R].pt.k[K].s[0]),
                                    ne[R].pt.k[K].e && C(ne[R].pt.k[K].e[0])
                          }
                          T.ty === 0
                            ? ((T.layers = d(T.refId, B)), _(T.layers, B))
                            : T.ty === 4
                              ? g(T.shapes)
                              : T.ty === 5 && Z(T)
                        }
                    }
                    function m(L, B) {
                      if (L) {
                        var T = 0,
                          j = L.length
                        for (T = 0; T < j; T += 1)
                          L[T].t === 1 &&
                            ((L[T].data.layers = d(L[T].data.refId, B)), _(L[T].data.layers, B))
                      }
                    }
                    function A(L, B) {
                      for (var T = 0, j = B.length; T < j; ) {
                        if (B[T].id === L) return B[T]
                        T += 1
                      }
                      return null
                    }
                    function d(L, B) {
                      var T = A(L, B)
                      return T
                        ? T.layers.__used
                          ? JSON.parse(JSON.stringify(T.layers))
                          : ((T.layers.__used = !0), T.layers)
                        : null
                    }
                    function g(L) {
                      var B,
                        T = L.length,
                        j,
                        S
                      for (B = T - 1; B >= 0; B -= 1)
                        if (L[B].ty === 'sh')
                          if (L[B].ks.k.i) C(L[B].ks.k)
                          else
                            for (S = L[B].ks.k.length, j = 0; j < S; j += 1)
                              L[B].ks.k[j].s && C(L[B].ks.k[j].s[0]),
                                L[B].ks.k[j].e && C(L[B].ks.k[j].e[0])
                        else L[B].ty === 'gr' && g(L[B].it)
                    }
                    function C(L) {
                      var B,
                        T = L.i.length
                      for (B = 0; B < T; B += 1)
                        (L.i[B][0] += L.v[B][0]),
                          (L.i[B][1] += L.v[B][1]),
                          (L.o[B][0] += L.v[B][0]),
                          (L.o[B][1] += L.v[B][1])
                    }
                    function P(L, B) {
                      var T = B ? B.split('.') : [100, 100, 100]
                      return L[0] > T[0]
                        ? !0
                        : T[0] > L[0]
                          ? !1
                          : L[1] > T[1]
                            ? !0
                            : T[1] > L[1]
                              ? !1
                              : L[2] > T[2]
                                ? !0
                                : T[2] > L[2]
                                  ? !1
                                  : null
                    }
                    var k = (function () {
                        var L = [4, 4, 14]
                        function B(j) {
                          var S = j.t.d
                          j.t.d = { k: [{ s: S, t: 0 }] }
                        }
                        function T(j) {
                          var S,
                            R = j.length
                          for (S = 0; S < R; S += 1) j[S].ty === 5 && B(j[S])
                        }
                        return function (j) {
                          if (P(L, j.v) && (T(j.layers), j.assets)) {
                            var S,
                              R = j.assets.length
                            for (S = 0; S < R; S += 1) j.assets[S].layers && T(j.assets[S].layers)
                          }
                        }
                      })(),
                      M = (function () {
                        var L = [4, 7, 99]
                        return function (B) {
                          if (B.chars && !P(L, B.v)) {
                            var T,
                              j = B.chars.length
                            for (T = 0; T < j; T += 1) {
                              var S = B.chars[T]
                              S.data &&
                                S.data.shapes &&
                                (g(S.data.shapes),
                                (S.data.ip = 0),
                                (S.data.op = 99999),
                                (S.data.st = 0),
                                (S.data.sr = 1),
                                (S.data.ks = {
                                  p: { k: [0, 0], a: 0 },
                                  s: { k: [100, 100], a: 0 },
                                  a: { k: [0, 0], a: 0 },
                                  r: { k: 0, a: 0 },
                                  o: { k: 100, a: 0 }
                                }),
                                B.chars[T].t ||
                                  (S.data.shapes.push({ ty: 'no' }),
                                  S.data.shapes[0].it.push({
                                    p: { k: [0, 0], a: 0 },
                                    s: { k: [100, 100], a: 0 },
                                    a: { k: [0, 0], a: 0 },
                                    r: { k: 0, a: 0 },
                                    o: { k: 100, a: 0 },
                                    sk: { k: 0, a: 0 },
                                    sa: { k: 0, a: 0 },
                                    ty: 'tr'
                                  })))
                            }
                          }
                        }
                      })(),
                      D = (function () {
                        var L = [5, 7, 15]
                        function B(j) {
                          var S = j.t.p
                          typeof S.a == 'number' && (S.a = { a: 0, k: S.a }),
                            typeof S.p == 'number' && (S.p = { a: 0, k: S.p }),
                            typeof S.r == 'number' && (S.r = { a: 0, k: S.r })
                        }
                        function T(j) {
                          var S,
                            R = j.length
                          for (S = 0; S < R; S += 1) j[S].ty === 5 && B(j[S])
                        }
                        return function (j) {
                          if (P(L, j.v) && (T(j.layers), j.assets)) {
                            var S,
                              R = j.assets.length
                            for (S = 0; S < R; S += 1) j.assets[S].layers && T(j.assets[S].layers)
                          }
                        }
                      })(),
                      W = (function () {
                        var L = [4, 1, 9]
                        function B(j) {
                          var S,
                            R = j.length,
                            V,
                            K
                          for (S = 0; S < R; S += 1)
                            if (j[S].ty === 'gr') B(j[S].it)
                            else if (j[S].ty === 'fl' || j[S].ty === 'st')
                              if (j[S].c.k && j[S].c.k[0].i)
                                for (K = j[S].c.k.length, V = 0; V < K; V += 1)
                                  j[S].c.k[V].s &&
                                    ((j[S].c.k[V].s[0] /= 255),
                                    (j[S].c.k[V].s[1] /= 255),
                                    (j[S].c.k[V].s[2] /= 255),
                                    (j[S].c.k[V].s[3] /= 255)),
                                    j[S].c.k[V].e &&
                                      ((j[S].c.k[V].e[0] /= 255),
                                      (j[S].c.k[V].e[1] /= 255),
                                      (j[S].c.k[V].e[2] /= 255),
                                      (j[S].c.k[V].e[3] /= 255))
                              else
                                (j[S].c.k[0] /= 255),
                                  (j[S].c.k[1] /= 255),
                                  (j[S].c.k[2] /= 255),
                                  (j[S].c.k[3] /= 255)
                        }
                        function T(j) {
                          var S,
                            R = j.length
                          for (S = 0; S < R; S += 1) j[S].ty === 4 && B(j[S].shapes)
                        }
                        return function (j) {
                          if (P(L, j.v) && (T(j.layers), j.assets)) {
                            var S,
                              R = j.assets.length
                            for (S = 0; S < R; S += 1) j.assets[S].layers && T(j.assets[S].layers)
                          }
                        }
                      })(),
                      H = (function () {
                        var L = [4, 4, 18]
                        function B(j) {
                          var S,
                            R = j.length,
                            V,
                            K
                          for (S = R - 1; S >= 0; S -= 1)
                            if (j[S].ty === 'sh')
                              if (j[S].ks.k.i) j[S].ks.k.c = j[S].closed
                              else
                                for (K = j[S].ks.k.length, V = 0; V < K; V += 1)
                                  j[S].ks.k[V].s && (j[S].ks.k[V].s[0].c = j[S].closed),
                                    j[S].ks.k[V].e && (j[S].ks.k[V].e[0].c = j[S].closed)
                            else j[S].ty === 'gr' && B(j[S].it)
                        }
                        function T(j) {
                          var S,
                            R,
                            V = j.length,
                            K,
                            re,
                            ne,
                            oe
                          for (R = 0; R < V; R += 1) {
                            if (((S = j[R]), S.hasMask)) {
                              var ae = S.masksProperties
                              for (re = ae.length, K = 0; K < re; K += 1)
                                if (ae[K].pt.k.i) ae[K].pt.k.c = ae[K].cl
                                else
                                  for (oe = ae[K].pt.k.length, ne = 0; ne < oe; ne += 1)
                                    ae[K].pt.k[ne].s && (ae[K].pt.k[ne].s[0].c = ae[K].cl),
                                      ae[K].pt.k[ne].e && (ae[K].pt.k[ne].e[0].c = ae[K].cl)
                            }
                            S.ty === 4 && B(S.shapes)
                          }
                        }
                        return function (j) {
                          if (P(L, j.v) && (T(j.layers), j.assets)) {
                            var S,
                              R = j.assets.length
                            for (S = 0; S < R; S += 1) j.assets[S].layers && T(j.assets[S].layers)
                          }
                        }
                      })()
                    function $(L) {
                      L.__complete ||
                        (W(L),
                        k(L),
                        M(L),
                        D(L),
                        H(L),
                        _(L.layers, L.assets),
                        m(L.chars, L.assets),
                        (L.__complete = !0))
                    }
                    function Z(L) {
                      L.t.a.length === 0 && 'm' in L.t.p
                    }
                    var Y = {}
                    return (
                      (Y.completeData = $),
                      (Y.checkColors = W),
                      (Y.checkChars = M),
                      (Y.checkPathProperties = D),
                      (Y.checkShapes = H),
                      (Y.completeLayers = _),
                      Y
                    )
                  }
                  if (
                    (s.dataManager || (s.dataManager = x()),
                    s.assetLoader ||
                      (s.assetLoader = (function () {
                        function _(A) {
                          var d = A.getResponseHeader('content-type')
                          return (d && A.responseType === 'json' && d.indexOf('json') !== -1) ||
                            (A.response && _typeof$5(A.response) === 'object')
                            ? A.response
                            : A.response && typeof A.response == 'string'
                              ? JSON.parse(A.response)
                              : A.responseText
                                ? JSON.parse(A.responseText)
                                : null
                        }
                        function m(A, d, g, C) {
                          var P,
                            k = new XMLHttpRequest()
                          try {
                            k.responseType = 'json'
                          } catch {}
                          k.onreadystatechange = function () {
                            if (k.readyState === 4)
                              if (k.status === 200) (P = _(k)), g(P)
                              else
                                try {
                                  ;(P = _(k)), g(P)
                                } catch (M) {
                                  C && C(M)
                                }
                          }
                          try {
                            k.open(['G', 'E', 'T'].join(''), A, !0)
                          } catch {
                            k.open(['G', 'E', 'T'].join(''), d + '/' + A, !0)
                          }
                          k.send()
                        }
                        return { load: m }
                      })()),
                    b.data.type === 'loadAnimation')
                  )
                    s.assetLoader.load(
                      b.data.path,
                      b.data.fullPath,
                      function (_) {
                        s.dataManager.completeData(_),
                          s.postMessage({ id: b.data.id, payload: _, status: 'success' })
                      },
                      function () {
                        s.postMessage({ id: b.data.id, status: 'error' })
                      }
                    )
                  else if (b.data.type === 'complete') {
                    var y = b.data.animation
                    s.dataManager.completeData(y),
                      s.postMessage({ id: b.data.id, payload: y, status: 'success' })
                  } else
                    b.data.type === 'loadData' &&
                      s.assetLoader.load(
                        b.data.path,
                        b.data.fullPath,
                        function (_) {
                          s.postMessage({ id: b.data.id, payload: _, status: 'success' })
                        },
                        function () {
                          s.postMessage({ id: b.data.id, status: 'error' })
                        }
                      )
                })),
                (i.onmessage = function (c) {
                  var b = c.data,
                    x = b.id,
                    y = t[x]
                  ;(t[x] = null),
                    b.status === 'success' ? y.onComplete(b.payload) : y.onError && y.onError()
                }))
            }
            function o(c, b) {
              e += 1
              var x = 'processId_' + e
              return (t[x] = { onComplete: c, onError: b }), x
            }
            function f(c, b, x) {
              l()
              var y = o(b, x)
              i.postMessage({
                type: 'loadAnimation',
                path: c,
                fullPath: window.location.origin + window.location.pathname,
                id: y
              })
            }
            function u(c, b, x) {
              l()
              var y = o(b, x)
              i.postMessage({
                type: 'loadData',
                path: c,
                fullPath: window.location.origin + window.location.pathname,
                id: y
              })
            }
            function E(c, b, x) {
              l()
              var y = o(b, x)
              i.postMessage({ type: 'complete', animation: c, id: y })
            }
            return { loadAnimation: f, loadData: u, completeAnimation: E }
          })(),
          ImagePreloader = (function () {
            var e = (function () {
              var m = createTag('canvas')
              ;(m.width = 1), (m.height = 1)
              var A = m.getContext('2d')
              return (A.fillStyle = 'rgba(0,0,0,0)'), A.fillRect(0, 0, 1, 1), m
            })()
            function t() {
              ;(this.loadedAssets += 1),
                this.loadedAssets === this.totalImages &&
                  this.loadedFootagesCount === this.totalFootages &&
                  this.imagesLoadedCb &&
                  this.imagesLoadedCb(null)
            }
            function r() {
              ;(this.loadedFootagesCount += 1),
                this.loadedAssets === this.totalImages &&
                  this.loadedFootagesCount === this.totalFootages &&
                  this.imagesLoadedCb &&
                  this.imagesLoadedCb(null)
            }
            function i(m, A, d) {
              var g = ''
              if (m.e) g = m.p
              else if (A) {
                var C = m.p
                C.indexOf('images/') !== -1 && (C = C.split('/')[1]), (g = A + C)
              } else (g = d), (g += m.u ? m.u : ''), (g += m.p)
              return g
            }
            function n(m) {
              var A = 0,
                d = setInterval(
                  function () {
                    var g = m.getBBox()
                    ;(g.width || A > 500) && (this._imageLoaded(), clearInterval(d)), (A += 1)
                  }.bind(this),
                  50
                )
            }
            function s(m) {
              var A = i(m, this.assetsPath, this.path),
                d = createNS('image')
              isSafari
                ? this.testImageLoaded(d)
                : d.addEventListener('load', this._imageLoaded, !1),
                d.addEventListener(
                  'error',
                  function () {
                    ;(g.img = e), this._imageLoaded()
                  }.bind(this),
                  !1
                ),
                d.setAttributeNS('http://www.w3.org/1999/xlink', 'href', A),
                this._elementHelper.append
                  ? this._elementHelper.append(d)
                  : this._elementHelper.appendChild(d)
              var g = { img: d, assetData: m }
              return g
            }
            function a(m) {
              var A = i(m, this.assetsPath, this.path),
                d = createTag('img')
              ;(d.crossOrigin = 'anonymous'),
                d.addEventListener('load', this._imageLoaded, !1),
                d.addEventListener(
                  'error',
                  function () {
                    ;(g.img = e), this._imageLoaded()
                  }.bind(this),
                  !1
                ),
                (d.src = A)
              var g = { img: d, assetData: m }
              return g
            }
            function l(m) {
              var A = { assetData: m },
                d = i(m, this.assetsPath, this.path)
              return (
                dataManager.loadData(
                  d,
                  function (g) {
                    ;(A.img = g), this._footageLoaded()
                  }.bind(this),
                  function () {
                    ;(A.img = {}), this._footageLoaded()
                  }.bind(this)
                ),
                A
              )
            }
            function o(m, A) {
              this.imagesLoadedCb = A
              var d,
                g = m.length
              for (d = 0; d < g; d += 1)
                m[d].layers ||
                  (!m[d].t || m[d].t === 'seq'
                    ? ((this.totalImages += 1), this.images.push(this._createImageData(m[d])))
                    : m[d].t === 3 &&
                      ((this.totalFootages += 1), this.images.push(this.createFootageData(m[d]))))
            }
            function f(m) {
              this.path = m || ''
            }
            function u(m) {
              this.assetsPath = m || ''
            }
            function E(m) {
              for (var A = 0, d = this.images.length; A < d; ) {
                if (this.images[A].assetData === m) return this.images[A].img
                A += 1
              }
              return null
            }
            function c() {
              ;(this.imagesLoadedCb = null), (this.images.length = 0)
            }
            function b() {
              return this.totalImages === this.loadedAssets
            }
            function x() {
              return this.totalFootages === this.loadedFootagesCount
            }
            function y(m, A) {
              m === 'svg'
                ? ((this._elementHelper = A),
                  (this._createImageData = this.createImageData.bind(this)))
                : (this._createImageData = this.createImgData.bind(this))
            }
            function _() {
              ;(this._imageLoaded = t.bind(this)),
                (this._footageLoaded = r.bind(this)),
                (this.testImageLoaded = n.bind(this)),
                (this.createFootageData = l.bind(this)),
                (this.assetsPath = ''),
                (this.path = ''),
                (this.totalImages = 0),
                (this.totalFootages = 0),
                (this.loadedAssets = 0),
                (this.loadedFootagesCount = 0),
                (this.imagesLoadedCb = null),
                (this.images = [])
            }
            return (
              (_.prototype = {
                loadAssets: o,
                setAssetsPath: u,
                setPath: f,
                loadedImages: b,
                loadedFootages: x,
                destroy: c,
                getAsset: E,
                createImgData: a,
                createImageData: s,
                imageLoaded: t,
                footageLoaded: r,
                setCacheType: y
              }),
              _
            )
          })()
        function BaseEvent() {}
        BaseEvent.prototype = {
          triggerEvent: function (t, r) {
            if (this._cbs[t]) for (var i = this._cbs[t], n = 0; n < i.length; n += 1) i[n](r)
          },
          addEventListener: function (t, r) {
            return (
              this._cbs[t] || (this._cbs[t] = []),
              this._cbs[t].push(r),
              function () {
                this.removeEventListener(t, r)
              }.bind(this)
            )
          },
          removeEventListener: function (t, r) {
            if (!r) this._cbs[t] = null
            else if (this._cbs[t]) {
              for (var i = 0, n = this._cbs[t].length; i < n; )
                this._cbs[t][i] === r && (this._cbs[t].splice(i, 1), (i -= 1), (n -= 1)), (i += 1)
              this._cbs[t].length || (this._cbs[t] = null)
            }
          }
        }
        var markerParser = (function () {
            function e(t) {
              for (
                var r = t.split(`\r
`),
                  i = {},
                  n,
                  s = 0,
                  a = 0;
                a < r.length;
                a += 1
              )
                (n = r[a].split(':')), n.length === 2 && ((i[n[0]] = n[1].trim()), (s += 1))
              if (s === 0) throw new Error()
              return i
            }
            return function (t) {
              for (var r = [], i = 0; i < t.length; i += 1) {
                var n = t[i],
                  s = { time: n.tm, duration: n.dr }
                try {
                  s.payload = JSON.parse(t[i].cm)
                } catch {
                  try {
                    s.payload = e(t[i].cm)
                  } catch {
                    s.payload = { name: t[i].cm }
                  }
                }
                r.push(s)
              }
              return r
            }
          })(),
          ProjectInterface = (function () {
            function e(t) {
              this.compositions.push(t)
            }
            return function () {
              function t(r) {
                for (var i = 0, n = this.compositions.length; i < n; ) {
                  if (this.compositions[i].data && this.compositions[i].data.nm === r)
                    return (
                      this.compositions[i].prepareFrame &&
                        this.compositions[i].data.xt &&
                        this.compositions[i].prepareFrame(this.currentFrame),
                      this.compositions[i].compInterface
                    )
                  i += 1
                }
                return null
              }
              return (t.compositions = []), (t.currentFrame = 0), (t.registerComposition = e), t
            }
          })(),
          renderers = {},
          registerRenderer = function (t, r) {
            renderers[t] = r
          }
        function getRenderer(e) {
          return renderers[e]
        }
        function getRegisteredRenderer() {
          if (renderers.canvas) return 'canvas'
          for (var e in renderers) if (renderers[e]) return e
          return ''
        }
        function _typeof$4(e) {
          '@babel/helpers - typeof'
          return (
            typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
              ? (_typeof$4 = function (r) {
                  return typeof r
                })
              : (_typeof$4 = function (r) {
                  return r &&
                    typeof Symbol == 'function' &&
                    r.constructor === Symbol &&
                    r !== Symbol.prototype
                    ? 'symbol'
                    : typeof r
                }),
            _typeof$4(e)
          )
        }
        var AnimationItem = function () {
          ;(this._cbs = []),
            (this.name = ''),
            (this.path = ''),
            (this.isLoaded = !1),
            (this.currentFrame = 0),
            (this.currentRawFrame = 0),
            (this.firstFrame = 0),
            (this.totalFrames = 0),
            (this.frameRate = 0),
            (this.frameMult = 0),
            (this.playSpeed = 1),
            (this.playDirection = 1),
            (this.playCount = 0),
            (this.animationData = {}),
            (this.assets = []),
            (this.isPaused = !0),
            (this.autoplay = !1),
            (this.loop = !0),
            (this.renderer = null),
            (this.animationID = createElementID()),
            (this.assetsPath = ''),
            (this.timeCompleted = 0),
            (this.segmentPos = 0),
            (this.isSubframeEnabled = getSubframeEnabled()),
            (this.segments = []),
            (this._idle = !0),
            (this._completedLoop = !1),
            (this.projectInterface = ProjectInterface()),
            (this.imagePreloader = new ImagePreloader()),
            (this.audioController = audioControllerFactory()),
            (this.markers = []),
            (this.configAnimation = this.configAnimation.bind(this)),
            (this.onSetupError = this.onSetupError.bind(this)),
            (this.onSegmentComplete = this.onSegmentComplete.bind(this)),
            (this.drawnFrameEvent = new BMEnterFrameEvent('drawnFrame', 0, 0, 0)),
            (this.expressionsPlugin = getExpressionsPlugin())
        }
        extendPrototype([BaseEvent], AnimationItem),
          (AnimationItem.prototype.setParams = function (e) {
            ;(e.wrapper || e.container) && (this.wrapper = e.wrapper || e.container)
            var t = 'svg'
            e.animType ? (t = e.animType) : e.renderer && (t = e.renderer)
            var r = getRenderer(t)
            ;(this.renderer = new r(this, e.rendererSettings)),
              this.imagePreloader.setCacheType(t, this.renderer.globalData.defs),
              this.renderer.setProjectInterface(this.projectInterface),
              (this.animType = t),
              e.loop === '' || e.loop === null || e.loop === void 0 || e.loop === !0
                ? (this.loop = !0)
                : e.loop === !1
                  ? (this.loop = !1)
                  : (this.loop = parseInt(e.loop, 10)),
              (this.autoplay = 'autoplay' in e ? e.autoplay : !0),
              (this.name = e.name ? e.name : ''),
              (this.autoloadSegments = Object.prototype.hasOwnProperty.call(e, 'autoloadSegments')
                ? e.autoloadSegments
                : !0),
              (this.assetsPath = e.assetsPath),
              (this.initialSegment = e.initialSegment),
              e.audioFactory && this.audioController.setAudioFactory(e.audioFactory),
              e.animationData
                ? this.setupAnimation(e.animationData)
                : e.path &&
                  (e.path.lastIndexOf('\\') !== -1
                    ? (this.path = e.path.substr(0, e.path.lastIndexOf('\\') + 1))
                    : (this.path = e.path.substr(0, e.path.lastIndexOf('/') + 1)),
                  (this.fileName = e.path.substr(e.path.lastIndexOf('/') + 1)),
                  (this.fileName = this.fileName.substr(0, this.fileName.lastIndexOf('.json'))),
                  dataManager.loadAnimation(e.path, this.configAnimation, this.onSetupError))
          }),
          (AnimationItem.prototype.onSetupError = function () {
            this.trigger('data_failed')
          }),
          (AnimationItem.prototype.setupAnimation = function (e) {
            dataManager.completeAnimation(e, this.configAnimation)
          }),
          (AnimationItem.prototype.setData = function (e, t) {
            t && _typeof$4(t) !== 'object' && (t = JSON.parse(t))
            var r = { wrapper: e, animationData: t },
              i = e.attributes
            ;(r.path = i.getNamedItem('data-animation-path')
              ? i.getNamedItem('data-animation-path').value
              : i.getNamedItem('data-bm-path')
                ? i.getNamedItem('data-bm-path').value
                : i.getNamedItem('bm-path')
                  ? i.getNamedItem('bm-path').value
                  : ''),
              (r.animType = i.getNamedItem('data-anim-type')
                ? i.getNamedItem('data-anim-type').value
                : i.getNamedItem('data-bm-type')
                  ? i.getNamedItem('data-bm-type').value
                  : i.getNamedItem('bm-type')
                    ? i.getNamedItem('bm-type').value
                    : i.getNamedItem('data-bm-renderer')
                      ? i.getNamedItem('data-bm-renderer').value
                      : i.getNamedItem('bm-renderer')
                        ? i.getNamedItem('bm-renderer').value
                        : getRegisteredRenderer() || 'canvas')
            var n = i.getNamedItem('data-anim-loop')
              ? i.getNamedItem('data-anim-loop').value
              : i.getNamedItem('data-bm-loop')
                ? i.getNamedItem('data-bm-loop').value
                : i.getNamedItem('bm-loop')
                  ? i.getNamedItem('bm-loop').value
                  : ''
            n === 'false'
              ? (r.loop = !1)
              : n === 'true'
                ? (r.loop = !0)
                : n !== '' && (r.loop = parseInt(n, 10))
            var s = i.getNamedItem('data-anim-autoplay')
              ? i.getNamedItem('data-anim-autoplay').value
              : i.getNamedItem('data-bm-autoplay')
                ? i.getNamedItem('data-bm-autoplay').value
                : i.getNamedItem('bm-autoplay')
                  ? i.getNamedItem('bm-autoplay').value
                  : !0
            ;(r.autoplay = s !== 'false'),
              (r.name = i.getNamedItem('data-name')
                ? i.getNamedItem('data-name').value
                : i.getNamedItem('data-bm-name')
                  ? i.getNamedItem('data-bm-name').value
                  : i.getNamedItem('bm-name')
                    ? i.getNamedItem('bm-name').value
                    : '')
            var a = i.getNamedItem('data-anim-prerender')
              ? i.getNamedItem('data-anim-prerender').value
              : i.getNamedItem('data-bm-prerender')
                ? i.getNamedItem('data-bm-prerender').value
                : i.getNamedItem('bm-prerender')
                  ? i.getNamedItem('bm-prerender').value
                  : ''
            a === 'false' && (r.prerender = !1),
              r.path ? this.setParams(r) : this.trigger('destroy')
          }),
          (AnimationItem.prototype.includeLayers = function (e) {
            e.op > this.animationData.op &&
              ((this.animationData.op = e.op),
              (this.totalFrames = Math.floor(e.op - this.animationData.ip)))
            var t = this.animationData.layers,
              r,
              i = t.length,
              n = e.layers,
              s,
              a = n.length
            for (s = 0; s < a; s += 1)
              for (r = 0; r < i; ) {
                if (t[r].id === n[s].id) {
                  t[r] = n[s]
                  break
                }
                r += 1
              }
            if (
              ((e.chars || e.fonts) &&
                (this.renderer.globalData.fontManager.addChars(e.chars),
                this.renderer.globalData.fontManager.addFonts(
                  e.fonts,
                  this.renderer.globalData.defs
                )),
              e.assets)
            )
              for (i = e.assets.length, r = 0; r < i; r += 1)
                this.animationData.assets.push(e.assets[r])
            ;(this.animationData.__complete = !1),
              dataManager.completeAnimation(this.animationData, this.onSegmentComplete)
          }),
          (AnimationItem.prototype.onSegmentComplete = function (e) {
            this.animationData = e
            var t = getExpressionsPlugin()
            t && t.initExpressions(this), this.loadNextSegment()
          }),
          (AnimationItem.prototype.loadNextSegment = function () {
            var e = this.animationData.segments
            if (!e || e.length === 0 || !this.autoloadSegments) {
              this.trigger('data_ready'), (this.timeCompleted = this.totalFrames)
              return
            }
            var t = e.shift()
            this.timeCompleted = t.time * this.frameRate
            var r = this.path + this.fileName + '_' + this.segmentPos + '.json'
            ;(this.segmentPos += 1),
              dataManager.loadData(
                r,
                this.includeLayers.bind(this),
                function () {
                  this.trigger('data_failed')
                }.bind(this)
              )
          }),
          (AnimationItem.prototype.loadSegments = function () {
            var e = this.animationData.segments
            e || (this.timeCompleted = this.totalFrames), this.loadNextSegment()
          }),
          (AnimationItem.prototype.imagesLoaded = function () {
            this.trigger('loaded_images'), this.checkLoaded()
          }),
          (AnimationItem.prototype.preloadImages = function () {
            this.imagePreloader.setAssetsPath(this.assetsPath),
              this.imagePreloader.setPath(this.path),
              this.imagePreloader.loadAssets(
                this.animationData.assets,
                this.imagesLoaded.bind(this)
              )
          }),
          (AnimationItem.prototype.configAnimation = function (e) {
            if (this.renderer)
              try {
                ;(this.animationData = e),
                  this.initialSegment
                    ? ((this.totalFrames = Math.floor(
                        this.initialSegment[1] - this.initialSegment[0]
                      )),
                      (this.firstFrame = Math.round(this.initialSegment[0])))
                    : ((this.totalFrames = Math.floor(
                        this.animationData.op - this.animationData.ip
                      )),
                      (this.firstFrame = Math.round(this.animationData.ip))),
                  this.renderer.configAnimation(e),
                  e.assets || (e.assets = []),
                  (this.assets = this.animationData.assets),
                  (this.frameRate = this.animationData.fr),
                  (this.frameMult = this.animationData.fr / 1e3),
                  this.renderer.searchExtraCompositions(e.assets),
                  (this.markers = markerParser(e.markers || [])),
                  this.trigger('config_ready'),
                  this.preloadImages(),
                  this.loadSegments(),
                  this.updaFrameModifier(),
                  this.waitForFontsLoaded(),
                  this.isPaused && this.audioController.pause()
              } catch (t) {
                this.triggerConfigError(t)
              }
          }),
          (AnimationItem.prototype.waitForFontsLoaded = function () {
            this.renderer &&
              (this.renderer.globalData.fontManager.isLoaded
                ? this.checkLoaded()
                : setTimeout(this.waitForFontsLoaded.bind(this), 20))
          }),
          (AnimationItem.prototype.checkLoaded = function () {
            if (
              !this.isLoaded &&
              this.renderer.globalData.fontManager.isLoaded &&
              (this.imagePreloader.loadedImages() || this.renderer.rendererType !== 'canvas') &&
              this.imagePreloader.loadedFootages()
            ) {
              this.isLoaded = !0
              var e = getExpressionsPlugin()
              e && e.initExpressions(this),
                this.renderer.initItems(),
                setTimeout(
                  function () {
                    this.trigger('DOMLoaded')
                  }.bind(this),
                  0
                ),
                this.gotoFrame(),
                this.autoplay && this.play()
            }
          }),
          (AnimationItem.prototype.resize = function (e, t) {
            var r = typeof e == 'number' ? e : void 0,
              i = typeof t == 'number' ? t : void 0
            this.renderer.updateContainerSize(r, i)
          }),
          (AnimationItem.prototype.setSubframe = function (e) {
            this.isSubframeEnabled = !!e
          }),
          (AnimationItem.prototype.gotoFrame = function () {
            ;(this.currentFrame = this.isSubframeEnabled
              ? this.currentRawFrame
              : ~~this.currentRawFrame),
              this.timeCompleted !== this.totalFrames &&
                this.currentFrame > this.timeCompleted &&
                (this.currentFrame = this.timeCompleted),
              this.trigger('enterFrame'),
              this.renderFrame(),
              this.trigger('drawnFrame')
          }),
          (AnimationItem.prototype.renderFrame = function () {
            if (!(this.isLoaded === !1 || !this.renderer))
              try {
                this.expressionsPlugin && this.expressionsPlugin.resetFrame(),
                  this.renderer.renderFrame(this.currentFrame + this.firstFrame)
              } catch (e) {
                this.triggerRenderFrameError(e)
              }
          }),
          (AnimationItem.prototype.play = function (e) {
            ;(e && this.name !== e) ||
              (this.isPaused === !0 &&
                ((this.isPaused = !1),
                this.trigger('_play'),
                this.audioController.resume(),
                this._idle && ((this._idle = !1), this.trigger('_active'))))
          }),
          (AnimationItem.prototype.pause = function (e) {
            ;(e && this.name !== e) ||
              (this.isPaused === !1 &&
                ((this.isPaused = !0),
                this.trigger('_pause'),
                (this._idle = !0),
                this.trigger('_idle'),
                this.audioController.pause()))
          }),
          (AnimationItem.prototype.togglePause = function (e) {
            ;(e && this.name !== e) || (this.isPaused === !0 ? this.play() : this.pause())
          }),
          (AnimationItem.prototype.stop = function (e) {
            ;(e && this.name !== e) ||
              (this.pause(),
              (this.playCount = 0),
              (this._completedLoop = !1),
              this.setCurrentRawFrameValue(0))
          }),
          (AnimationItem.prototype.getMarkerData = function (e) {
            for (var t, r = 0; r < this.markers.length; r += 1)
              if (((t = this.markers[r]), t.payload && t.payload.name === e)) return t
            return null
          }),
          (AnimationItem.prototype.goToAndStop = function (e, t, r) {
            if (!(r && this.name !== r)) {
              var i = Number(e)
              if (isNaN(i)) {
                var n = this.getMarkerData(e)
                n && this.goToAndStop(n.time, !0)
              } else
                t
                  ? this.setCurrentRawFrameValue(e)
                  : this.setCurrentRawFrameValue(e * this.frameModifier)
              this.pause()
            }
          }),
          (AnimationItem.prototype.goToAndPlay = function (e, t, r) {
            if (!(r && this.name !== r)) {
              var i = Number(e)
              if (isNaN(i)) {
                var n = this.getMarkerData(e)
                n &&
                  (n.duration
                    ? this.playSegments([n.time, n.time + n.duration], !0)
                    : this.goToAndStop(n.time, !0))
              } else this.goToAndStop(i, t, r)
              this.play()
            }
          }),
          (AnimationItem.prototype.advanceTime = function (e) {
            if (!(this.isPaused === !0 || this.isLoaded === !1)) {
              var t = this.currentRawFrame + e * this.frameModifier,
                r = !1
              t >= this.totalFrames - 1 && this.frameModifier > 0
                ? !this.loop || this.playCount === this.loop
                  ? this.checkSegments(t > this.totalFrames ? t % this.totalFrames : 0) ||
                    ((r = !0), (t = this.totalFrames - 1))
                  : t >= this.totalFrames
                    ? ((this.playCount += 1),
                      this.checkSegments(t % this.totalFrames) ||
                        (this.setCurrentRawFrameValue(t % this.totalFrames),
                        (this._completedLoop = !0),
                        this.trigger('loopComplete')))
                    : this.setCurrentRawFrameValue(t)
                : t < 0
                  ? this.checkSegments(t % this.totalFrames) ||
                    (this.loop && !(this.playCount-- <= 0 && this.loop !== !0)
                      ? (this.setCurrentRawFrameValue(this.totalFrames + (t % this.totalFrames)),
                        this._completedLoop
                          ? this.trigger('loopComplete')
                          : (this._completedLoop = !0))
                      : ((r = !0), (t = 0)))
                  : this.setCurrentRawFrameValue(t),
                r && (this.setCurrentRawFrameValue(t), this.pause(), this.trigger('complete'))
            }
          }),
          (AnimationItem.prototype.adjustSegment = function (e, t) {
            ;(this.playCount = 0),
              e[1] < e[0]
                ? (this.frameModifier > 0 &&
                    (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(-1)),
                  (this.totalFrames = e[0] - e[1]),
                  (this.timeCompleted = this.totalFrames),
                  (this.firstFrame = e[1]),
                  this.setCurrentRawFrameValue(this.totalFrames - 0.001 - t))
                : e[1] > e[0] &&
                  (this.frameModifier < 0 &&
                    (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(1)),
                  (this.totalFrames = e[1] - e[0]),
                  (this.timeCompleted = this.totalFrames),
                  (this.firstFrame = e[0]),
                  this.setCurrentRawFrameValue(0.001 + t)),
              this.trigger('segmentStart')
          }),
          (AnimationItem.prototype.setSegment = function (e, t) {
            var r = -1
            this.isPaused &&
              (this.currentRawFrame + this.firstFrame < e
                ? (r = e)
                : this.currentRawFrame + this.firstFrame > t && (r = t - e)),
              (this.firstFrame = e),
              (this.totalFrames = t - e),
              (this.timeCompleted = this.totalFrames),
              r !== -1 && this.goToAndStop(r, !0)
          }),
          (AnimationItem.prototype.playSegments = function (e, t) {
            if ((t && (this.segments.length = 0), _typeof$4(e[0]) === 'object')) {
              var r,
                i = e.length
              for (r = 0; r < i; r += 1) this.segments.push(e[r])
            } else this.segments.push(e)
            this.segments.length && t && this.adjustSegment(this.segments.shift(), 0),
              this.isPaused && this.play()
          }),
          (AnimationItem.prototype.resetSegments = function (e) {
            ;(this.segments.length = 0),
              this.segments.push([this.animationData.ip, this.animationData.op]),
              e && this.checkSegments(0)
          }),
          (AnimationItem.prototype.checkSegments = function (e) {
            return this.segments.length ? (this.adjustSegment(this.segments.shift(), e), !0) : !1
          }),
          (AnimationItem.prototype.destroy = function (e) {
            ;(e && this.name !== e) ||
              !this.renderer ||
              (this.renderer.destroy(),
              this.imagePreloader.destroy(),
              this.trigger('destroy'),
              (this._cbs = null),
              (this.onEnterFrame = null),
              (this.onLoopComplete = null),
              (this.onComplete = null),
              (this.onSegmentStart = null),
              (this.onDestroy = null),
              (this.renderer = null),
              (this.expressionsPlugin = null),
              (this.imagePreloader = null),
              (this.projectInterface = null))
          }),
          (AnimationItem.prototype.setCurrentRawFrameValue = function (e) {
            ;(this.currentRawFrame = e), this.gotoFrame()
          }),
          (AnimationItem.prototype.setSpeed = function (e) {
            ;(this.playSpeed = e), this.updaFrameModifier()
          }),
          (AnimationItem.prototype.setDirection = function (e) {
            ;(this.playDirection = e < 0 ? -1 : 1), this.updaFrameModifier()
          }),
          (AnimationItem.prototype.setLoop = function (e) {
            this.loop = e
          }),
          (AnimationItem.prototype.setVolume = function (e, t) {
            ;(t && this.name !== t) || this.audioController.setVolume(e)
          }),
          (AnimationItem.prototype.getVolume = function () {
            return this.audioController.getVolume()
          }),
          (AnimationItem.prototype.mute = function (e) {
            ;(e && this.name !== e) || this.audioController.mute()
          }),
          (AnimationItem.prototype.unmute = function (e) {
            ;(e && this.name !== e) || this.audioController.unmute()
          }),
          (AnimationItem.prototype.updaFrameModifier = function () {
            ;(this.frameModifier = this.frameMult * this.playSpeed * this.playDirection),
              this.audioController.setRate(this.playSpeed * this.playDirection)
          }),
          (AnimationItem.prototype.getPath = function () {
            return this.path
          }),
          (AnimationItem.prototype.getAssetsPath = function (e) {
            var t = ''
            if (e.e) t = e.p
            else if (this.assetsPath) {
              var r = e.p
              r.indexOf('images/') !== -1 && (r = r.split('/')[1]), (t = this.assetsPath + r)
            } else (t = this.path), (t += e.u ? e.u : ''), (t += e.p)
            return t
          }),
          (AnimationItem.prototype.getAssetData = function (e) {
            for (var t = 0, r = this.assets.length; t < r; ) {
              if (e === this.assets[t].id) return this.assets[t]
              t += 1
            }
            return null
          }),
          (AnimationItem.prototype.hide = function () {
            this.renderer.hide()
          }),
          (AnimationItem.prototype.show = function () {
            this.renderer.show()
          }),
          (AnimationItem.prototype.getDuration = function (e) {
            return e ? this.totalFrames : this.totalFrames / this.frameRate
          }),
          (AnimationItem.prototype.updateDocumentData = function (e, t, r) {
            try {
              var i = this.renderer.getElementByPath(e)
              i.updateDocumentData(t, r)
            } catch {}
          }),
          (AnimationItem.prototype.trigger = function (e) {
            if (this._cbs && this._cbs[e])
              switch (e) {
                case 'enterFrame':
                  this.triggerEvent(
                    e,
                    new BMEnterFrameEvent(
                      e,
                      this.currentFrame,
                      this.totalFrames,
                      this.frameModifier
                    )
                  )
                  break
                case 'drawnFrame':
                  ;(this.drawnFrameEvent.currentTime = this.currentFrame),
                    (this.drawnFrameEvent.totalTime = this.totalFrames),
                    (this.drawnFrameEvent.direction = this.frameModifier),
                    this.triggerEvent(e, this.drawnFrameEvent)
                  break
                case 'loopComplete':
                  this.triggerEvent(
                    e,
                    new BMCompleteLoopEvent(e, this.loop, this.playCount, this.frameMult)
                  )
                  break
                case 'complete':
                  this.triggerEvent(e, new BMCompleteEvent(e, this.frameMult))
                  break
                case 'segmentStart':
                  this.triggerEvent(
                    e,
                    new BMSegmentStartEvent(e, this.firstFrame, this.totalFrames)
                  )
                  break
                case 'destroy':
                  this.triggerEvent(e, new BMDestroyEvent(e, this))
                  break
                default:
                  this.triggerEvent(e)
              }
            e === 'enterFrame' &&
              this.onEnterFrame &&
              this.onEnterFrame.call(
                this,
                new BMEnterFrameEvent(e, this.currentFrame, this.totalFrames, this.frameMult)
              ),
              e === 'loopComplete' &&
                this.onLoopComplete &&
                this.onLoopComplete.call(
                  this,
                  new BMCompleteLoopEvent(e, this.loop, this.playCount, this.frameMult)
                ),
              e === 'complete' &&
                this.onComplete &&
                this.onComplete.call(this, new BMCompleteEvent(e, this.frameMult)),
              e === 'segmentStart' &&
                this.onSegmentStart &&
                this.onSegmentStart.call(
                  this,
                  new BMSegmentStartEvent(e, this.firstFrame, this.totalFrames)
                ),
              e === 'destroy' &&
                this.onDestroy &&
                this.onDestroy.call(this, new BMDestroyEvent(e, this))
          }),
          (AnimationItem.prototype.triggerRenderFrameError = function (e) {
            var t = new BMRenderFrameErrorEvent(e, this.currentFrame)
            this.triggerEvent('error', t), this.onError && this.onError.call(this, t)
          }),
          (AnimationItem.prototype.triggerConfigError = function (e) {
            var t = new BMConfigErrorEvent(e, this.currentFrame)
            this.triggerEvent('error', t), this.onError && this.onError.call(this, t)
          })
        var animationManager = (function () {
            var e = {},
              t = [],
              r = 0,
              i = 0,
              n = 0,
              s = !0,
              a = !1
            function l(B) {
              for (var T = 0, j = B.target; T < i; )
                t[T].animation === j && (t.splice(T, 1), (T -= 1), (i -= 1), j.isPaused || E()),
                  (T += 1)
            }
            function o(B, T) {
              if (!B) return null
              for (var j = 0; j < i; ) {
                if (t[j].elem === B && t[j].elem !== null) return t[j].animation
                j += 1
              }
              var S = new AnimationItem()
              return c(S, B), S.setData(B, T), S
            }
            function f() {
              var B,
                T = t.length,
                j = []
              for (B = 0; B < T; B += 1) j.push(t[B].animation)
              return j
            }
            function u() {
              ;(n += 1), W()
            }
            function E() {
              n -= 1
            }
            function c(B, T) {
              B.addEventListener('destroy', l),
                B.addEventListener('_active', u),
                B.addEventListener('_idle', E),
                t.push({ elem: T, animation: B }),
                (i += 1)
            }
            function b(B) {
              var T = new AnimationItem()
              return c(T, null), T.setParams(B), T
            }
            function x(B, T) {
              var j
              for (j = 0; j < i; j += 1) t[j].animation.setSpeed(B, T)
            }
            function y(B, T) {
              var j
              for (j = 0; j < i; j += 1) t[j].animation.setDirection(B, T)
            }
            function _(B) {
              var T
              for (T = 0; T < i; T += 1) t[T].animation.play(B)
            }
            function m(B) {
              var T = B - r,
                j
              for (j = 0; j < i; j += 1) t[j].animation.advanceTime(T)
              ;(r = B), n && !a ? window.requestAnimationFrame(m) : (s = !0)
            }
            function A(B) {
              ;(r = B), window.requestAnimationFrame(m)
            }
            function d(B) {
              var T
              for (T = 0; T < i; T += 1) t[T].animation.pause(B)
            }
            function g(B, T, j) {
              var S
              for (S = 0; S < i; S += 1) t[S].animation.goToAndStop(B, T, j)
            }
            function C(B) {
              var T
              for (T = 0; T < i; T += 1) t[T].animation.stop(B)
            }
            function P(B) {
              var T
              for (T = 0; T < i; T += 1) t[T].animation.togglePause(B)
            }
            function k(B) {
              var T
              for (T = i - 1; T >= 0; T -= 1) t[T].animation.destroy(B)
            }
            function M(B, T, j) {
              var S = [].concat(
                  [].slice.call(document.getElementsByClassName('lottie')),
                  [].slice.call(document.getElementsByClassName('bodymovin'))
                ),
                R,
                V = S.length
              for (R = 0; R < V; R += 1) j && S[R].setAttribute('data-bm-type', j), o(S[R], B)
              if (T && V === 0) {
                j || (j = 'svg')
                var K = document.getElementsByTagName('body')[0]
                K.innerText = ''
                var re = createTag('div')
                ;(re.style.width = '100%'),
                  (re.style.height = '100%'),
                  re.setAttribute('data-bm-type', j),
                  K.appendChild(re),
                  o(re, B)
              }
            }
            function D() {
              var B
              for (B = 0; B < i; B += 1) t[B].animation.resize()
            }
            function W() {
              !a && n && s && (window.requestAnimationFrame(A), (s = !1))
            }
            function H() {
              a = !0
            }
            function $() {
              ;(a = !1), W()
            }
            function Z(B, T) {
              var j
              for (j = 0; j < i; j += 1) t[j].animation.setVolume(B, T)
            }
            function Y(B) {
              var T
              for (T = 0; T < i; T += 1) t[T].animation.mute(B)
            }
            function L(B) {
              var T
              for (T = 0; T < i; T += 1) t[T].animation.unmute(B)
            }
            return (
              (e.registerAnimation = o),
              (e.loadAnimation = b),
              (e.setSpeed = x),
              (e.setDirection = y),
              (e.play = _),
              (e.pause = d),
              (e.stop = C),
              (e.togglePause = P),
              (e.searchAnimations = M),
              (e.resize = D),
              (e.goToAndStop = g),
              (e.destroy = k),
              (e.freeze = H),
              (e.unfreeze = $),
              (e.setVolume = Z),
              (e.mute = Y),
              (e.unmute = L),
              (e.getRegisteredAnimations = f),
              e
            )
          })(),
          BezierFactory = (function () {
            var e = {}
            e.getBezierEasing = r
            var t = {}
            function r(A, d, g, C, P) {
              var k = P || ('bez_' + A + '_' + d + '_' + g + '_' + C).replace(/\./g, 'p')
              if (t[k]) return t[k]
              var M = new m([A, d, g, C])
              return (t[k] = M), M
            }
            var i = 4,
              n = 0.001,
              s = 1e-7,
              a = 10,
              l = 11,
              o = 1 / (l - 1),
              f = typeof Float32Array == 'function'
            function u(A, d) {
              return 1 - 3 * d + 3 * A
            }
            function E(A, d) {
              return 3 * d - 6 * A
            }
            function c(A) {
              return 3 * A
            }
            function b(A, d, g) {
              return ((u(d, g) * A + E(d, g)) * A + c(d)) * A
            }
            function x(A, d, g) {
              return 3 * u(d, g) * A * A + 2 * E(d, g) * A + c(d)
            }
            function y(A, d, g, C, P) {
              var k,
                M,
                D = 0
              do (M = d + (g - d) / 2), (k = b(M, C, P) - A), k > 0 ? (g = M) : (d = M)
              while (Math.abs(k) > s && ++D < a)
              return M
            }
            function _(A, d, g, C) {
              for (var P = 0; P < i; ++P) {
                var k = x(d, g, C)
                if (k === 0) return d
                var M = b(d, g, C) - A
                d -= M / k
              }
              return d
            }
            function m(A) {
              ;(this._p = A),
                (this._mSampleValues = f ? new Float32Array(l) : new Array(l)),
                (this._precomputed = !1),
                (this.get = this.get.bind(this))
            }
            return (
              (m.prototype = {
                get: function (d) {
                  var g = this._p[0],
                    C = this._p[1],
                    P = this._p[2],
                    k = this._p[3]
                  return (
                    this._precomputed || this._precompute(),
                    g === C && P === k ? d : d === 0 ? 0 : d === 1 ? 1 : b(this._getTForX(d), C, k)
                  )
                },
                _precompute: function () {
                  var d = this._p[0],
                    g = this._p[1],
                    C = this._p[2],
                    P = this._p[3]
                  ;(this._precomputed = !0), (d !== g || C !== P) && this._calcSampleValues()
                },
                _calcSampleValues: function () {
                  for (var d = this._p[0], g = this._p[2], C = 0; C < l; ++C)
                    this._mSampleValues[C] = b(C * o, d, g)
                },
                _getTForX: function (d) {
                  for (
                    var g = this._p[0],
                      C = this._p[2],
                      P = this._mSampleValues,
                      k = 0,
                      M = 1,
                      D = l - 1;
                    M !== D && P[M] <= d;
                    ++M
                  )
                    k += o
                  --M
                  var W = (d - P[M]) / (P[M + 1] - P[M]),
                    H = k + W * o,
                    $ = x(H, g, C)
                  return $ >= n ? _(d, H, g, C) : $ === 0 ? H : y(d, k, k + o, g, C)
                }
              }),
              e
            )
          })(),
          pooling = (function () {
            function e(t) {
              return t.concat(createSizedArray(t.length))
            }
            return { double: e }
          })(),
          poolFactory = (function () {
            return function (e, t, r) {
              var i = 0,
                n = e,
                s = createSizedArray(n),
                a = { newElement: l, release: o }
              function l() {
                var f
                return i ? ((i -= 1), (f = s[i])) : (f = t()), f
              }
              function o(f) {
                i === n && ((s = pooling.double(s)), (n *= 2)), r && r(f), (s[i] = f), (i += 1)
              }
              return a
            }
          })(),
          bezierLengthPool = (function () {
            function e() {
              return {
                addedLength: 0,
                percents: createTypedArray('float32', getDefaultCurveSegments()),
                lengths: createTypedArray('float32', getDefaultCurveSegments())
              }
            }
            return poolFactory(8, e)
          })(),
          segmentsLengthPool = (function () {
            function e() {
              return { lengths: [], totalLength: 0 }
            }
            function t(r) {
              var i,
                n = r.lengths.length
              for (i = 0; i < n; i += 1) bezierLengthPool.release(r.lengths[i])
              r.lengths.length = 0
            }
            return poolFactory(8, e, t)
          })()
        function bezFunction() {
          var e = Math
          function t(c, b, x, y, _, m) {
            var A = c * y + b * _ + x * m - _ * y - m * c - x * b
            return A > -0.001 && A < 0.001
          }
          function r(c, b, x, y, _, m, A, d, g) {
            if (x === 0 && m === 0 && g === 0) return t(c, b, y, _, A, d)
            var C = e.sqrt(e.pow(y - c, 2) + e.pow(_ - b, 2) + e.pow(m - x, 2)),
              P = e.sqrt(e.pow(A - c, 2) + e.pow(d - b, 2) + e.pow(g - x, 2)),
              k = e.sqrt(e.pow(A - y, 2) + e.pow(d - _, 2) + e.pow(g - m, 2)),
              M
            return (
              C > P
                ? C > k
                  ? (M = C - P - k)
                  : (M = k - P - C)
                : k > P
                  ? (M = k - P - C)
                  : (M = P - C - k),
              M > -1e-4 && M < 1e-4
            )
          }
          var i = (function () {
            return function (c, b, x, y) {
              var _ = getDefaultCurveSegments(),
                m,
                A,
                d,
                g,
                C,
                P = 0,
                k,
                M = [],
                D = [],
                W = bezierLengthPool.newElement()
              for (d = x.length, m = 0; m < _; m += 1) {
                for (C = m / (_ - 1), k = 0, A = 0; A < d; A += 1)
                  (g =
                    bmPow(1 - C, 3) * c[A] +
                    3 * bmPow(1 - C, 2) * C * x[A] +
                    3 * (1 - C) * bmPow(C, 2) * y[A] +
                    bmPow(C, 3) * b[A]),
                    (M[A] = g),
                    D[A] !== null && (k += bmPow(M[A] - D[A], 2)),
                    (D[A] = M[A])
                k && ((k = bmSqrt(k)), (P += k)), (W.percents[m] = C), (W.lengths[m] = P)
              }
              return (W.addedLength = P), W
            }
          })()
          function n(c) {
            var b = segmentsLengthPool.newElement(),
              x = c.c,
              y = c.v,
              _ = c.o,
              m = c.i,
              A,
              d = c._length,
              g = b.lengths,
              C = 0
            for (A = 0; A < d - 1; A += 1)
              (g[A] = i(y[A], y[A + 1], _[A], m[A + 1])), (C += g[A].addedLength)
            return (
              x && d && ((g[A] = i(y[A], y[0], _[A], m[0])), (C += g[A].addedLength)),
              (b.totalLength = C),
              b
            )
          }
          function s(c) {
            ;(this.segmentLength = 0), (this.points = new Array(c))
          }
          function a(c, b) {
            ;(this.partialLength = c), (this.point = b)
          }
          var l = (function () {
            var c = {}
            return function (b, x, y, _) {
              var m = (
                b[0] +
                '_' +
                b[1] +
                '_' +
                x[0] +
                '_' +
                x[1] +
                '_' +
                y[0] +
                '_' +
                y[1] +
                '_' +
                _[0] +
                '_' +
                _[1]
              ).replace(/\./g, 'p')
              if (!c[m]) {
                var A = getDefaultCurveSegments(),
                  d,
                  g,
                  C,
                  P,
                  k,
                  M = 0,
                  D,
                  W,
                  H = null
                b.length === 2 &&
                  (b[0] !== x[0] || b[1] !== x[1]) &&
                  t(b[0], b[1], x[0], x[1], b[0] + y[0], b[1] + y[1]) &&
                  t(b[0], b[1], x[0], x[1], x[0] + _[0], x[1] + _[1]) &&
                  (A = 2)
                var $ = new s(A)
                for (C = y.length, d = 0; d < A; d += 1) {
                  for (W = createSizedArray(C), k = d / (A - 1), D = 0, g = 0; g < C; g += 1)
                    (P =
                      bmPow(1 - k, 3) * b[g] +
                      3 * bmPow(1 - k, 2) * k * (b[g] + y[g]) +
                      3 * (1 - k) * bmPow(k, 2) * (x[g] + _[g]) +
                      bmPow(k, 3) * x[g]),
                      (W[g] = P),
                      H !== null && (D += bmPow(W[g] - H[g], 2))
                  ;(D = bmSqrt(D)), (M += D), ($.points[d] = new a(D, W)), (H = W)
                }
                ;($.segmentLength = M), (c[m] = $)
              }
              return c[m]
            }
          })()
          function o(c, b) {
            var x = b.percents,
              y = b.lengths,
              _ = x.length,
              m = bmFloor((_ - 1) * c),
              A = c * b.addedLength,
              d = 0
            if (m === _ - 1 || m === 0 || A === y[m]) return x[m]
            for (var g = y[m] > A ? -1 : 1, C = !0; C; )
              if (
                (y[m] <= A && y[m + 1] > A
                  ? ((d = (A - y[m]) / (y[m + 1] - y[m])), (C = !1))
                  : (m += g),
                m < 0 || m >= _ - 1)
              ) {
                if (m === _ - 1) return x[m]
                C = !1
              }
            return x[m] + (x[m + 1] - x[m]) * d
          }
          function f(c, b, x, y, _, m) {
            var A = o(_, m),
              d = 1 - A,
              g =
                e.round(
                  (d * d * d * c[0] +
                    (A * d * d + d * A * d + d * d * A) * x[0] +
                    (A * A * d + d * A * A + A * d * A) * y[0] +
                    A * A * A * b[0]) *
                    1e3
                ) / 1e3,
              C =
                e.round(
                  (d * d * d * c[1] +
                    (A * d * d + d * A * d + d * d * A) * x[1] +
                    (A * A * d + d * A * A + A * d * A) * y[1] +
                    A * A * A * b[1]) *
                    1e3
                ) / 1e3
            return [g, C]
          }
          var u = createTypedArray('float32', 8)
          function E(c, b, x, y, _, m, A) {
            _ < 0 ? (_ = 0) : _ > 1 && (_ = 1)
            var d = o(_, A)
            m = m > 1 ? 1 : m
            var g = o(m, A),
              C,
              P = c.length,
              k = 1 - d,
              M = 1 - g,
              D = k * k * k,
              W = d * k * k * 3,
              H = d * d * k * 3,
              $ = d * d * d,
              Z = k * k * M,
              Y = d * k * M + k * d * M + k * k * g,
              L = d * d * M + k * d * g + d * k * g,
              B = d * d * g,
              T = k * M * M,
              j = d * M * M + k * g * M + k * M * g,
              S = d * g * M + k * g * g + d * M * g,
              R = d * g * g,
              V = M * M * M,
              K = g * M * M + M * g * M + M * M * g,
              re = g * g * M + M * g * g + g * M * g,
              ne = g * g * g
            for (C = 0; C < P; C += 1)
              (u[C * 4] = e.round((D * c[C] + W * x[C] + H * y[C] + $ * b[C]) * 1e3) / 1e3),
                (u[C * 4 + 1] = e.round((Z * c[C] + Y * x[C] + L * y[C] + B * b[C]) * 1e3) / 1e3),
                (u[C * 4 + 2] = e.round((T * c[C] + j * x[C] + S * y[C] + R * b[C]) * 1e3) / 1e3),
                (u[C * 4 + 3] = e.round((V * c[C] + K * x[C] + re * y[C] + ne * b[C]) * 1e3) / 1e3)
            return u
          }
          return {
            getSegmentsLength: n,
            getNewSegment: E,
            getPointInSegment: f,
            buildBezierData: l,
            pointOnLine2D: t,
            pointOnLine3D: r
          }
        }
        var bez = bezFunction(),
          initFrame = initialDefaultFrame,
          mathAbs = Math.abs
        function interpolateValue(e, t) {
          var r = this.offsetTime,
            i
          this.propType === 'multidimensional' && (i = createTypedArray('float32', this.pv.length))
          for (var n = t.lastIndex, s = n, a = this.keyframes.length - 1, l = !0, o, f, u; l; ) {
            if (
              ((o = this.keyframes[s]), (f = this.keyframes[s + 1]), s === a - 1 && e >= f.t - r)
            ) {
              o.h && (o = f), (n = 0)
              break
            }
            if (f.t - r > e) {
              n = s
              break
            }
            s < a - 1 ? (s += 1) : ((n = 0), (l = !1))
          }
          u = this.keyframesMetadata[s] || {}
          var E,
            c,
            b,
            x,
            y,
            _,
            m = f.t - r,
            A = o.t - r,
            d
          if (o.to) {
            u.bezierData || (u.bezierData = bez.buildBezierData(o.s, f.s || o.e, o.to, o.ti))
            var g = u.bezierData
            if (e >= m || e < A) {
              var C = e >= m ? g.points.length - 1 : 0
              for (c = g.points[C].point.length, E = 0; E < c; E += 1) i[E] = g.points[C].point[E]
            } else {
              u.__fnct
                ? (_ = u.__fnct)
                : ((_ = BezierFactory.getBezierEasing(o.o.x, o.o.y, o.i.x, o.i.y, o.n).get),
                  (u.__fnct = _)),
                (b = _((e - A) / (m - A)))
              var P = g.segmentLength * b,
                k,
                M = t.lastFrame < e && t._lastKeyframeIndex === s ? t._lastAddedLength : 0
              for (
                y = t.lastFrame < e && t._lastKeyframeIndex === s ? t._lastPoint : 0,
                  l = !0,
                  x = g.points.length;
                l;

              ) {
                if (
                  ((M += g.points[y].partialLength),
                  P === 0 || b === 0 || y === g.points.length - 1)
                ) {
                  for (c = g.points[y].point.length, E = 0; E < c; E += 1)
                    i[E] = g.points[y].point[E]
                  break
                } else if (P >= M && P < M + g.points[y + 1].partialLength) {
                  for (
                    k = (P - M) / g.points[y + 1].partialLength,
                      c = g.points[y].point.length,
                      E = 0;
                    E < c;
                    E += 1
                  )
                    i[E] =
                      g.points[y].point[E] + (g.points[y + 1].point[E] - g.points[y].point[E]) * k
                  break
                }
                y < x - 1 ? (y += 1) : (l = !1)
              }
              ;(t._lastPoint = y),
                (t._lastAddedLength = M - g.points[y].partialLength),
                (t._lastKeyframeIndex = s)
            }
          } else {
            var D, W, H, $, Z
            if (((a = o.s.length), (d = f.s || o.e), this.sh && o.h !== 1))
              if (e >= m) (i[0] = d[0]), (i[1] = d[1]), (i[2] = d[2])
              else if (e <= A) (i[0] = o.s[0]), (i[1] = o.s[1]), (i[2] = o.s[2])
              else {
                var Y = createQuaternion(o.s),
                  L = createQuaternion(d),
                  B = (e - A) / (m - A)
                quaternionToEuler(i, slerp(Y, L, B))
              }
            else
              for (s = 0; s < a; s += 1)
                o.h !== 1 &&
                  (e >= m
                    ? (b = 1)
                    : e < A
                      ? (b = 0)
                      : (o.o.x.constructor === Array
                          ? (u.__fnct || (u.__fnct = []),
                            u.__fnct[s]
                              ? (_ = u.__fnct[s])
                              : ((D = o.o.x[s] === void 0 ? o.o.x[0] : o.o.x[s]),
                                (W = o.o.y[s] === void 0 ? o.o.y[0] : o.o.y[s]),
                                (H = o.i.x[s] === void 0 ? o.i.x[0] : o.i.x[s]),
                                ($ = o.i.y[s] === void 0 ? o.i.y[0] : o.i.y[s]),
                                (_ = BezierFactory.getBezierEasing(D, W, H, $).get),
                                (u.__fnct[s] = _)))
                          : u.__fnct
                            ? (_ = u.__fnct)
                            : ((D = o.o.x),
                              (W = o.o.y),
                              (H = o.i.x),
                              ($ = o.i.y),
                              (_ = BezierFactory.getBezierEasing(D, W, H, $).get),
                              (o.keyframeMetadata = _)),
                        (b = _((e - A) / (m - A))))),
                  (d = f.s || o.e),
                  (Z = o.h === 1 ? o.s[s] : o.s[s] + (d[s] - o.s[s]) * b),
                  this.propType === 'multidimensional' ? (i[s] = Z) : (i = Z)
          }
          return (t.lastIndex = n), i
        }
        function slerp(e, t, r) {
          var i = [],
            n = e[0],
            s = e[1],
            a = e[2],
            l = e[3],
            o = t[0],
            f = t[1],
            u = t[2],
            E = t[3],
            c,
            b,
            x,
            y,
            _
          return (
            (b = n * o + s * f + a * u + l * E),
            b < 0 && ((b = -b), (o = -o), (f = -f), (u = -u), (E = -E)),
            1 - b > 1e-6
              ? ((c = Math.acos(b)),
                (x = Math.sin(c)),
                (y = Math.sin((1 - r) * c) / x),
                (_ = Math.sin(r * c) / x))
              : ((y = 1 - r), (_ = r)),
            (i[0] = y * n + _ * o),
            (i[1] = y * s + _ * f),
            (i[2] = y * a + _ * u),
            (i[3] = y * l + _ * E),
            i
          )
        }
        function quaternionToEuler(e, t) {
          var r = t[0],
            i = t[1],
            n = t[2],
            s = t[3],
            a = Math.atan2(2 * i * s - 2 * r * n, 1 - 2 * i * i - 2 * n * n),
            l = Math.asin(2 * r * i + 2 * n * s),
            o = Math.atan2(2 * r * s - 2 * i * n, 1 - 2 * r * r - 2 * n * n)
          ;(e[0] = a / degToRads), (e[1] = l / degToRads), (e[2] = o / degToRads)
        }
        function createQuaternion(e) {
          var t = e[0] * degToRads,
            r = e[1] * degToRads,
            i = e[2] * degToRads,
            n = Math.cos(t / 2),
            s = Math.cos(r / 2),
            a = Math.cos(i / 2),
            l = Math.sin(t / 2),
            o = Math.sin(r / 2),
            f = Math.sin(i / 2),
            u = n * s * a - l * o * f,
            E = l * o * a + n * s * f,
            c = l * s * a + n * o * f,
            b = n * o * a - l * s * f
          return [E, c, b, u]
        }
        function getValueAtCurrentTime() {
          var e = this.comp.renderedFrame - this.offsetTime,
            t = this.keyframes[0].t - this.offsetTime,
            r = this.keyframes[this.keyframes.length - 1].t - this.offsetTime
          if (
            !(
              e === this._caching.lastFrame ||
              (this._caching.lastFrame !== initFrame &&
                ((this._caching.lastFrame >= r && e >= r) ||
                  (this._caching.lastFrame < t && e < t)))
            )
          ) {
            this._caching.lastFrame >= e &&
              ((this._caching._lastKeyframeIndex = -1), (this._caching.lastIndex = 0))
            var i = this.interpolateValue(e, this._caching)
            this.pv = i
          }
          return (this._caching.lastFrame = e), this.pv
        }
        function setVValue(e) {
          var t
          if (this.propType === 'unidimensional')
            (t = e * this.mult), mathAbs(this.v - t) > 1e-5 && ((this.v = t), (this._mdf = !0))
          else
            for (var r = 0, i = this.v.length; r < i; )
              (t = e[r] * this.mult),
                mathAbs(this.v[r] - t) > 1e-5 && ((this.v[r] = t), (this._mdf = !0)),
                (r += 1)
        }
        function processEffectsSequence() {
          if (!(this.elem.globalData.frameId === this.frameId || !this.effectsSequence.length)) {
            if (this.lock) {
              this.setVValue(this.pv)
              return
            }
            ;(this.lock = !0), (this._mdf = this._isFirstFrame)
            var e,
              t = this.effectsSequence.length,
              r = this.kf ? this.pv : this.data.k
            for (e = 0; e < t; e += 1) r = this.effectsSequence[e](r)
            this.setVValue(r),
              (this._isFirstFrame = !1),
              (this.lock = !1),
              (this.frameId = this.elem.globalData.frameId)
          }
        }
        function addEffect(e) {
          this.effectsSequence.push(e), this.container.addDynamicProperty(this)
        }
        function ValueProperty(e, t, r, i) {
          ;(this.propType = 'unidimensional'),
            (this.mult = r || 1),
            (this.data = t),
            (this.v = r ? t.k * r : t.k),
            (this.pv = t.k),
            (this._mdf = !1),
            (this.elem = e),
            (this.container = i),
            (this.comp = e.comp),
            (this.k = !1),
            (this.kf = !1),
            (this.vel = 0),
            (this.effectsSequence = []),
            (this._isFirstFrame = !0),
            (this.getValue = processEffectsSequence),
            (this.setVValue = setVValue),
            (this.addEffect = addEffect)
        }
        function MultiDimensionalProperty(e, t, r, i) {
          ;(this.propType = 'multidimensional'),
            (this.mult = r || 1),
            (this.data = t),
            (this._mdf = !1),
            (this.elem = e),
            (this.container = i),
            (this.comp = e.comp),
            (this.k = !1),
            (this.kf = !1),
            (this.frameId = -1)
          var n,
            s = t.k.length
          for (
            this.v = createTypedArray('float32', s),
              this.pv = createTypedArray('float32', s),
              this.vel = createTypedArray('float32', s),
              n = 0;
            n < s;
            n += 1
          )
            (this.v[n] = t.k[n] * this.mult), (this.pv[n] = t.k[n])
          ;(this._isFirstFrame = !0),
            (this.effectsSequence = []),
            (this.getValue = processEffectsSequence),
            (this.setVValue = setVValue),
            (this.addEffect = addEffect)
        }
        function KeyframedValueProperty(e, t, r, i) {
          ;(this.propType = 'unidimensional'),
            (this.keyframes = t.k),
            (this.keyframesMetadata = []),
            (this.offsetTime = e.data.st),
            (this.frameId = -1),
            (this._caching = {
              lastFrame: initFrame,
              lastIndex: 0,
              value: 0,
              _lastKeyframeIndex: -1
            }),
            (this.k = !0),
            (this.kf = !0),
            (this.data = t),
            (this.mult = r || 1),
            (this.elem = e),
            (this.container = i),
            (this.comp = e.comp),
            (this.v = initFrame),
            (this.pv = initFrame),
            (this._isFirstFrame = !0),
            (this.getValue = processEffectsSequence),
            (this.setVValue = setVValue),
            (this.interpolateValue = interpolateValue),
            (this.effectsSequence = [getValueAtCurrentTime.bind(this)]),
            (this.addEffect = addEffect)
        }
        function KeyframedMultidimensionalProperty(e, t, r, i) {
          this.propType = 'multidimensional'
          var n,
            s = t.k.length,
            a,
            l,
            o,
            f
          for (n = 0; n < s - 1; n += 1)
            t.k[n].to &&
              t.k[n].s &&
              t.k[n + 1] &&
              t.k[n + 1].s &&
              ((a = t.k[n].s),
              (l = t.k[n + 1].s),
              (o = t.k[n].to),
              (f = t.k[n].ti),
              ((a.length === 2 &&
                !(a[0] === l[0] && a[1] === l[1]) &&
                bez.pointOnLine2D(a[0], a[1], l[0], l[1], a[0] + o[0], a[1] + o[1]) &&
                bez.pointOnLine2D(a[0], a[1], l[0], l[1], l[0] + f[0], l[1] + f[1])) ||
                (a.length === 3 &&
                  !(a[0] === l[0] && a[1] === l[1] && a[2] === l[2]) &&
                  bez.pointOnLine3D(
                    a[0],
                    a[1],
                    a[2],
                    l[0],
                    l[1],
                    l[2],
                    a[0] + o[0],
                    a[1] + o[1],
                    a[2] + o[2]
                  ) &&
                  bez.pointOnLine3D(
                    a[0],
                    a[1],
                    a[2],
                    l[0],
                    l[1],
                    l[2],
                    l[0] + f[0],
                    l[1] + f[1],
                    l[2] + f[2]
                  ))) &&
                ((t.k[n].to = null), (t.k[n].ti = null)),
              a[0] === l[0] &&
                a[1] === l[1] &&
                o[0] === 0 &&
                o[1] === 0 &&
                f[0] === 0 &&
                f[1] === 0 &&
                (a.length === 2 || (a[2] === l[2] && o[2] === 0 && f[2] === 0)) &&
                ((t.k[n].to = null), (t.k[n].ti = null)))
          ;(this.effectsSequence = [getValueAtCurrentTime.bind(this)]),
            (this.data = t),
            (this.keyframes = t.k),
            (this.keyframesMetadata = []),
            (this.offsetTime = e.data.st),
            (this.k = !0),
            (this.kf = !0),
            (this._isFirstFrame = !0),
            (this.mult = r || 1),
            (this.elem = e),
            (this.container = i),
            (this.comp = e.comp),
            (this.getValue = processEffectsSequence),
            (this.setVValue = setVValue),
            (this.interpolateValue = interpolateValue),
            (this.frameId = -1)
          var u = t.k[0].s.length
          for (
            this.v = createTypedArray('float32', u),
              this.pv = createTypedArray('float32', u),
              n = 0;
            n < u;
            n += 1
          )
            (this.v[n] = initFrame), (this.pv[n] = initFrame)
          ;(this._caching = {
            lastFrame: initFrame,
            lastIndex: 0,
            value: createTypedArray('float32', u)
          }),
            (this.addEffect = addEffect)
        }
        var PropertyFactory = (function () {
          function e(r, i, n, s, a) {
            i.sid && (i = r.globalData.slotManager.getProp(i))
            var l
            if (!i.k.length) l = new ValueProperty(r, i, s, a)
            else if (typeof i.k[0] == 'number') l = new MultiDimensionalProperty(r, i, s, a)
            else
              switch (n) {
                case 0:
                  l = new KeyframedValueProperty(r, i, s, a)
                  break
                case 1:
                  l = new KeyframedMultidimensionalProperty(r, i, s, a)
                  break
              }
            return l.effectsSequence.length && a.addDynamicProperty(l), l
          }
          var t = { getProp: e }
          return t
        })()
        function DynamicPropertyContainer() {}
        DynamicPropertyContainer.prototype = {
          addDynamicProperty: function (t) {
            this.dynamicProperties.indexOf(t) === -1 &&
              (this.dynamicProperties.push(t),
              this.container.addDynamicProperty(this),
              (this._isAnimated = !0))
          },
          iterateDynamicProperties: function () {
            this._mdf = !1
            var t,
              r = this.dynamicProperties.length
            for (t = 0; t < r; t += 1)
              this.dynamicProperties[t].getValue(),
                this.dynamicProperties[t]._mdf && (this._mdf = !0)
          },
          initDynamicPropertyContainer: function (t) {
            ;(this.container = t),
              (this.dynamicProperties = []),
              (this._mdf = !1),
              (this._isAnimated = !1)
          }
        }
        var pointPool = (function () {
          function e() {
            return createTypedArray('float32', 2)
          }
          return poolFactory(8, e)
        })()
        function ShapePath() {
          ;(this.c = !1),
            (this._length = 0),
            (this._maxLength = 8),
            (this.v = createSizedArray(this._maxLength)),
            (this.o = createSizedArray(this._maxLength)),
            (this.i = createSizedArray(this._maxLength))
        }
        ;(ShapePath.prototype.setPathData = function (e, t) {
          ;(this.c = e), this.setLength(t)
          for (var r = 0; r < t; )
            (this.v[r] = pointPool.newElement()),
              (this.o[r] = pointPool.newElement()),
              (this.i[r] = pointPool.newElement()),
              (r += 1)
        }),
          (ShapePath.prototype.setLength = function (e) {
            for (; this._maxLength < e; ) this.doubleArrayLength()
            this._length = e
          }),
          (ShapePath.prototype.doubleArrayLength = function () {
            ;(this.v = this.v.concat(createSizedArray(this._maxLength))),
              (this.i = this.i.concat(createSizedArray(this._maxLength))),
              (this.o = this.o.concat(createSizedArray(this._maxLength))),
              (this._maxLength *= 2)
          }),
          (ShapePath.prototype.setXYAt = function (e, t, r, i, n) {
            var s
            switch (
              ((this._length = Math.max(this._length, i + 1)),
              this._length >= this._maxLength && this.doubleArrayLength(),
              r)
            ) {
              case 'v':
                s = this.v
                break
              case 'i':
                s = this.i
                break
              case 'o':
                s = this.o
                break
              default:
                s = []
                break
            }
            ;(!s[i] || (s[i] && !n)) && (s[i] = pointPool.newElement()),
              (s[i][0] = e),
              (s[i][1] = t)
          }),
          (ShapePath.prototype.setTripleAt = function (e, t, r, i, n, s, a, l) {
            this.setXYAt(e, t, 'v', a, l),
              this.setXYAt(r, i, 'o', a, l),
              this.setXYAt(n, s, 'i', a, l)
          }),
          (ShapePath.prototype.reverse = function () {
            var e = new ShapePath()
            e.setPathData(this.c, this._length)
            var t = this.v,
              r = this.o,
              i = this.i,
              n = 0
            this.c &&
              (e.setTripleAt(t[0][0], t[0][1], i[0][0], i[0][1], r[0][0], r[0][1], 0, !1), (n = 1))
            var s = this._length - 1,
              a = this._length,
              l
            for (l = n; l < a; l += 1)
              e.setTripleAt(t[s][0], t[s][1], i[s][0], i[s][1], r[s][0], r[s][1], l, !1), (s -= 1)
            return e
          }),
          (ShapePath.prototype.length = function () {
            return this._length
          })
        var shapePool = (function () {
          function e() {
            return new ShapePath()
          }
          function t(n) {
            var s = n._length,
              a
            for (a = 0; a < s; a += 1)
              pointPool.release(n.v[a]),
                pointPool.release(n.i[a]),
                pointPool.release(n.o[a]),
                (n.v[a] = null),
                (n.i[a] = null),
                (n.o[a] = null)
            ;(n._length = 0), (n.c = !1)
          }
          function r(n) {
            var s = i.newElement(),
              a,
              l = n._length === void 0 ? n.v.length : n._length
            for (s.setLength(l), s.c = n.c, a = 0; a < l; a += 1)
              s.setTripleAt(n.v[a][0], n.v[a][1], n.o[a][0], n.o[a][1], n.i[a][0], n.i[a][1], a)
            return s
          }
          var i = poolFactory(4, e, t)
          return (i.clone = r), i
        })()
        function ShapeCollection() {
          ;(this._length = 0),
            (this._maxLength = 4),
            (this.shapes = createSizedArray(this._maxLength))
        }
        ;(ShapeCollection.prototype.addShape = function (e) {
          this._length === this._maxLength &&
            ((this.shapes = this.shapes.concat(createSizedArray(this._maxLength))),
            (this._maxLength *= 2)),
            (this.shapes[this._length] = e),
            (this._length += 1)
        }),
          (ShapeCollection.prototype.releaseShapes = function () {
            var e
            for (e = 0; e < this._length; e += 1) shapePool.release(this.shapes[e])
            this._length = 0
          })
        var shapeCollectionPool = (function () {
            var e = { newShapeCollection: n, release: s },
              t = 0,
              r = 4,
              i = createSizedArray(r)
            function n() {
              var a
              return t ? ((t -= 1), (a = i[t])) : (a = new ShapeCollection()), a
            }
            function s(a) {
              var l,
                o = a._length
              for (l = 0; l < o; l += 1) shapePool.release(a.shapes[l])
              ;(a._length = 0), t === r && ((i = pooling.double(i)), (r *= 2)), (i[t] = a), (t += 1)
            }
            return e
          })(),
          ShapePropertyFactory = (function () {
            var e = -999999
            function t(m, A, d) {
              var g = d.lastIndex,
                C,
                P,
                k,
                M,
                D,
                W,
                H,
                $,
                Z,
                Y = this.keyframes
              if (m < Y[0].t - this.offsetTime) (C = Y[0].s[0]), (k = !0), (g = 0)
              else if (m >= Y[Y.length - 1].t - this.offsetTime)
                (C = Y[Y.length - 1].s ? Y[Y.length - 1].s[0] : Y[Y.length - 2].e[0]), (k = !0)
              else {
                for (
                  var L = g, B = Y.length - 1, T = !0, j, S, R;
                  T && ((j = Y[L]), (S = Y[L + 1]), !(S.t - this.offsetTime > m));

                )
                  L < B - 1 ? (L += 1) : (T = !1)
                if (((R = this.keyframesMetadata[L] || {}), (k = j.h === 1), (g = L), !k)) {
                  if (m >= S.t - this.offsetTime) $ = 1
                  else if (m < j.t - this.offsetTime) $ = 0
                  else {
                    var V
                    R.__fnct
                      ? (V = R.__fnct)
                      : ((V = BezierFactory.getBezierEasing(j.o.x, j.o.y, j.i.x, j.i.y).get),
                        (R.__fnct = V)),
                      ($ = V(
                        (m - (j.t - this.offsetTime)) /
                          (S.t - this.offsetTime - (j.t - this.offsetTime))
                      ))
                  }
                  P = S.s ? S.s[0] : j.e[0]
                }
                C = j.s[0]
              }
              for (W = A._length, H = C.i[0].length, d.lastIndex = g, M = 0; M < W; M += 1)
                for (D = 0; D < H; D += 1)
                  (Z = k ? C.i[M][D] : C.i[M][D] + (P.i[M][D] - C.i[M][D]) * $),
                    (A.i[M][D] = Z),
                    (Z = k ? C.o[M][D] : C.o[M][D] + (P.o[M][D] - C.o[M][D]) * $),
                    (A.o[M][D] = Z),
                    (Z = k ? C.v[M][D] : C.v[M][D] + (P.v[M][D] - C.v[M][D]) * $),
                    (A.v[M][D] = Z)
            }
            function r() {
              var m = this.comp.renderedFrame - this.offsetTime,
                A = this.keyframes[0].t - this.offsetTime,
                d = this.keyframes[this.keyframes.length - 1].t - this.offsetTime,
                g = this._caching.lastFrame
              return (
                (g !== e && ((g < A && m < A) || (g > d && m > d))) ||
                  ((this._caching.lastIndex = g < m ? this._caching.lastIndex : 0),
                  this.interpolateShape(m, this.pv, this._caching)),
                (this._caching.lastFrame = m),
                this.pv
              )
            }
            function i() {
              this.paths = this.localShapeCollection
            }
            function n(m, A) {
              if (m._length !== A._length || m.c !== A.c) return !1
              var d,
                g = m._length
              for (d = 0; d < g; d += 1)
                if (
                  m.v[d][0] !== A.v[d][0] ||
                  m.v[d][1] !== A.v[d][1] ||
                  m.o[d][0] !== A.o[d][0] ||
                  m.o[d][1] !== A.o[d][1] ||
                  m.i[d][0] !== A.i[d][0] ||
                  m.i[d][1] !== A.i[d][1]
                )
                  return !1
              return !0
            }
            function s(m) {
              n(this.v, m) ||
                ((this.v = shapePool.clone(m)),
                this.localShapeCollection.releaseShapes(),
                this.localShapeCollection.addShape(this.v),
                (this._mdf = !0),
                (this.paths = this.localShapeCollection))
            }
            function a() {
              if (this.elem.globalData.frameId !== this.frameId) {
                if (!this.effectsSequence.length) {
                  this._mdf = !1
                  return
                }
                if (this.lock) {
                  this.setVValue(this.pv)
                  return
                }
                ;(this.lock = !0), (this._mdf = !1)
                var m
                this.kf ? (m = this.pv) : this.data.ks ? (m = this.data.ks.k) : (m = this.data.pt.k)
                var A,
                  d = this.effectsSequence.length
                for (A = 0; A < d; A += 1) m = this.effectsSequence[A](m)
                this.setVValue(m), (this.lock = !1), (this.frameId = this.elem.globalData.frameId)
              }
            }
            function l(m, A, d) {
              ;(this.propType = 'shape'),
                (this.comp = m.comp),
                (this.container = m),
                (this.elem = m),
                (this.data = A),
                (this.k = !1),
                (this.kf = !1),
                (this._mdf = !1)
              var g = d === 3 ? A.pt.k : A.ks.k
              ;(this.v = shapePool.clone(g)),
                (this.pv = shapePool.clone(this.v)),
                (this.localShapeCollection = shapeCollectionPool.newShapeCollection()),
                (this.paths = this.localShapeCollection),
                this.paths.addShape(this.v),
                (this.reset = i),
                (this.effectsSequence = [])
            }
            function o(m) {
              this.effectsSequence.push(m), this.container.addDynamicProperty(this)
            }
            ;(l.prototype.interpolateShape = t),
              (l.prototype.getValue = a),
              (l.prototype.setVValue = s),
              (l.prototype.addEffect = o)
            function f(m, A, d) {
              ;(this.propType = 'shape'),
                (this.comp = m.comp),
                (this.elem = m),
                (this.container = m),
                (this.offsetTime = m.data.st),
                (this.keyframes = d === 3 ? A.pt.k : A.ks.k),
                (this.keyframesMetadata = []),
                (this.k = !0),
                (this.kf = !0)
              var g = this.keyframes[0].s[0].i.length
              ;(this.v = shapePool.newElement()),
                this.v.setPathData(this.keyframes[0].s[0].c, g),
                (this.pv = shapePool.clone(this.v)),
                (this.localShapeCollection = shapeCollectionPool.newShapeCollection()),
                (this.paths = this.localShapeCollection),
                this.paths.addShape(this.v),
                (this.lastFrame = e),
                (this.reset = i),
                (this._caching = { lastFrame: e, lastIndex: 0 }),
                (this.effectsSequence = [r.bind(this)])
            }
            ;(f.prototype.getValue = a),
              (f.prototype.interpolateShape = t),
              (f.prototype.setVValue = s),
              (f.prototype.addEffect = o)
            var u = (function () {
                var m = roundCorner
                function A(d, g) {
                  ;(this.v = shapePool.newElement()),
                    this.v.setPathData(!0, 4),
                    (this.localShapeCollection = shapeCollectionPool.newShapeCollection()),
                    (this.paths = this.localShapeCollection),
                    this.localShapeCollection.addShape(this.v),
                    (this.d = g.d),
                    (this.elem = d),
                    (this.comp = d.comp),
                    (this.frameId = -1),
                    this.initDynamicPropertyContainer(d),
                    (this.p = PropertyFactory.getProp(d, g.p, 1, 0, this)),
                    (this.s = PropertyFactory.getProp(d, g.s, 1, 0, this)),
                    this.dynamicProperties.length
                      ? (this.k = !0)
                      : ((this.k = !1), this.convertEllToPath())
                }
                return (
                  (A.prototype = {
                    reset: i,
                    getValue: function () {
                      this.elem.globalData.frameId !== this.frameId &&
                        ((this.frameId = this.elem.globalData.frameId),
                        this.iterateDynamicProperties(),
                        this._mdf && this.convertEllToPath())
                    },
                    convertEllToPath: function () {
                      var g = this.p.v[0],
                        C = this.p.v[1],
                        P = this.s.v[0] / 2,
                        k = this.s.v[1] / 2,
                        M = this.d !== 3,
                        D = this.v
                      ;(D.v[0][0] = g),
                        (D.v[0][1] = C - k),
                        (D.v[1][0] = M ? g + P : g - P),
                        (D.v[1][1] = C),
                        (D.v[2][0] = g),
                        (D.v[2][1] = C + k),
                        (D.v[3][0] = M ? g - P : g + P),
                        (D.v[3][1] = C),
                        (D.i[0][0] = M ? g - P * m : g + P * m),
                        (D.i[0][1] = C - k),
                        (D.i[1][0] = M ? g + P : g - P),
                        (D.i[1][1] = C - k * m),
                        (D.i[2][0] = M ? g + P * m : g - P * m),
                        (D.i[2][1] = C + k),
                        (D.i[3][0] = M ? g - P : g + P),
                        (D.i[3][1] = C + k * m),
                        (D.o[0][0] = M ? g + P * m : g - P * m),
                        (D.o[0][1] = C - k),
                        (D.o[1][0] = M ? g + P : g - P),
                        (D.o[1][1] = C + k * m),
                        (D.o[2][0] = M ? g - P * m : g + P * m),
                        (D.o[2][1] = C + k),
                        (D.o[3][0] = M ? g - P : g + P),
                        (D.o[3][1] = C - k * m)
                    }
                  }),
                  extendPrototype([DynamicPropertyContainer], A),
                  A
                )
              })(),
              E = (function () {
                function m(A, d) {
                  ;(this.v = shapePool.newElement()),
                    this.v.setPathData(!0, 0),
                    (this.elem = A),
                    (this.comp = A.comp),
                    (this.data = d),
                    (this.frameId = -1),
                    (this.d = d.d),
                    this.initDynamicPropertyContainer(A),
                    d.sy === 1
                      ? ((this.ir = PropertyFactory.getProp(A, d.ir, 0, 0, this)),
                        (this.is = PropertyFactory.getProp(A, d.is, 0, 0.01, this)),
                        (this.convertToPath = this.convertStarToPath))
                      : (this.convertToPath = this.convertPolygonToPath),
                    (this.pt = PropertyFactory.getProp(A, d.pt, 0, 0, this)),
                    (this.p = PropertyFactory.getProp(A, d.p, 1, 0, this)),
                    (this.r = PropertyFactory.getProp(A, d.r, 0, degToRads, this)),
                    (this.or = PropertyFactory.getProp(A, d.or, 0, 0, this)),
                    (this.os = PropertyFactory.getProp(A, d.os, 0, 0.01, this)),
                    (this.localShapeCollection = shapeCollectionPool.newShapeCollection()),
                    this.localShapeCollection.addShape(this.v),
                    (this.paths = this.localShapeCollection),
                    this.dynamicProperties.length
                      ? (this.k = !0)
                      : ((this.k = !1), this.convertToPath())
                }
                return (
                  (m.prototype = {
                    reset: i,
                    getValue: function () {
                      this.elem.globalData.frameId !== this.frameId &&
                        ((this.frameId = this.elem.globalData.frameId),
                        this.iterateDynamicProperties(),
                        this._mdf && this.convertToPath())
                    },
                    convertStarToPath: function () {
                      var d = Math.floor(this.pt.v) * 2,
                        g = (Math.PI * 2) / d,
                        C = !0,
                        P = this.or.v,
                        k = this.ir.v,
                        M = this.os.v,
                        D = this.is.v,
                        W = (2 * Math.PI * P) / (d * 2),
                        H = (2 * Math.PI * k) / (d * 2),
                        $,
                        Z,
                        Y,
                        L,
                        B = -Math.PI / 2
                      B += this.r.v
                      var T = this.data.d === 3 ? -1 : 1
                      for (this.v._length = 0, $ = 0; $ < d; $ += 1) {
                        ;(Z = C ? P : k), (Y = C ? M : D), (L = C ? W : H)
                        var j = Z * Math.cos(B),
                          S = Z * Math.sin(B),
                          R = j === 0 && S === 0 ? 0 : S / Math.sqrt(j * j + S * S),
                          V = j === 0 && S === 0 ? 0 : -j / Math.sqrt(j * j + S * S)
                        ;(j += +this.p.v[0]),
                          (S += +this.p.v[1]),
                          this.v.setTripleAt(
                            j,
                            S,
                            j - R * L * Y * T,
                            S - V * L * Y * T,
                            j + R * L * Y * T,
                            S + V * L * Y * T,
                            $,
                            !0
                          ),
                          (C = !C),
                          (B += g * T)
                      }
                    },
                    convertPolygonToPath: function () {
                      var d = Math.floor(this.pt.v),
                        g = (Math.PI * 2) / d,
                        C = this.or.v,
                        P = this.os.v,
                        k = (2 * Math.PI * C) / (d * 4),
                        M,
                        D = -Math.PI * 0.5,
                        W = this.data.d === 3 ? -1 : 1
                      for (D += this.r.v, this.v._length = 0, M = 0; M < d; M += 1) {
                        var H = C * Math.cos(D),
                          $ = C * Math.sin(D),
                          Z = H === 0 && $ === 0 ? 0 : $ / Math.sqrt(H * H + $ * $),
                          Y = H === 0 && $ === 0 ? 0 : -H / Math.sqrt(H * H + $ * $)
                        ;(H += +this.p.v[0]),
                          ($ += +this.p.v[1]),
                          this.v.setTripleAt(
                            H,
                            $,
                            H - Z * k * P * W,
                            $ - Y * k * P * W,
                            H + Z * k * P * W,
                            $ + Y * k * P * W,
                            M,
                            !0
                          ),
                          (D += g * W)
                      }
                      ;(this.paths.length = 0), (this.paths[0] = this.v)
                    }
                  }),
                  extendPrototype([DynamicPropertyContainer], m),
                  m
                )
              })(),
              c = (function () {
                function m(A, d) {
                  ;(this.v = shapePool.newElement()),
                    (this.v.c = !0),
                    (this.localShapeCollection = shapeCollectionPool.newShapeCollection()),
                    this.localShapeCollection.addShape(this.v),
                    (this.paths = this.localShapeCollection),
                    (this.elem = A),
                    (this.comp = A.comp),
                    (this.frameId = -1),
                    (this.d = d.d),
                    this.initDynamicPropertyContainer(A),
                    (this.p = PropertyFactory.getProp(A, d.p, 1, 0, this)),
                    (this.s = PropertyFactory.getProp(A, d.s, 1, 0, this)),
                    (this.r = PropertyFactory.getProp(A, d.r, 0, 0, this)),
                    this.dynamicProperties.length
                      ? (this.k = !0)
                      : ((this.k = !1), this.convertRectToPath())
                }
                return (
                  (m.prototype = {
                    convertRectToPath: function () {
                      var d = this.p.v[0],
                        g = this.p.v[1],
                        C = this.s.v[0] / 2,
                        P = this.s.v[1] / 2,
                        k = bmMin(C, P, this.r.v),
                        M = k * (1 - roundCorner)
                      ;(this.v._length = 0),
                        this.d === 2 || this.d === 1
                          ? (this.v.setTripleAt(
                              d + C,
                              g - P + k,
                              d + C,
                              g - P + k,
                              d + C,
                              g - P + M,
                              0,
                              !0
                            ),
                            this.v.setTripleAt(
                              d + C,
                              g + P - k,
                              d + C,
                              g + P - M,
                              d + C,
                              g + P - k,
                              1,
                              !0
                            ),
                            k !== 0
                              ? (this.v.setTripleAt(
                                  d + C - k,
                                  g + P,
                                  d + C - k,
                                  g + P,
                                  d + C - M,
                                  g + P,
                                  2,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  d - C + k,
                                  g + P,
                                  d - C + M,
                                  g + P,
                                  d - C + k,
                                  g + P,
                                  3,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  d - C,
                                  g + P - k,
                                  d - C,
                                  g + P - k,
                                  d - C,
                                  g + P - M,
                                  4,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  d - C,
                                  g - P + k,
                                  d - C,
                                  g - P + M,
                                  d - C,
                                  g - P + k,
                                  5,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  d - C + k,
                                  g - P,
                                  d - C + k,
                                  g - P,
                                  d - C + M,
                                  g - P,
                                  6,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  d + C - k,
                                  g - P,
                                  d + C - M,
                                  g - P,
                                  d + C - k,
                                  g - P,
                                  7,
                                  !0
                                ))
                              : (this.v.setTripleAt(
                                  d - C,
                                  g + P,
                                  d - C + M,
                                  g + P,
                                  d - C,
                                  g + P,
                                  2
                                ),
                                this.v.setTripleAt(
                                  d - C,
                                  g - P,
                                  d - C,
                                  g - P + M,
                                  d - C,
                                  g - P,
                                  3
                                )))
                          : (this.v.setTripleAt(
                              d + C,
                              g - P + k,
                              d + C,
                              g - P + M,
                              d + C,
                              g - P + k,
                              0,
                              !0
                            ),
                            k !== 0
                              ? (this.v.setTripleAt(
                                  d + C - k,
                                  g - P,
                                  d + C - k,
                                  g - P,
                                  d + C - M,
                                  g - P,
                                  1,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  d - C + k,
                                  g - P,
                                  d - C + M,
                                  g - P,
                                  d - C + k,
                                  g - P,
                                  2,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  d - C,
                                  g - P + k,
                                  d - C,
                                  g - P + k,
                                  d - C,
                                  g - P + M,
                                  3,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  d - C,
                                  g + P - k,
                                  d - C,
                                  g + P - M,
                                  d - C,
                                  g + P - k,
                                  4,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  d - C + k,
                                  g + P,
                                  d - C + k,
                                  g + P,
                                  d - C + M,
                                  g + P,
                                  5,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  d + C - k,
                                  g + P,
                                  d + C - M,
                                  g + P,
                                  d + C - k,
                                  g + P,
                                  6,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  d + C,
                                  g + P - k,
                                  d + C,
                                  g + P - k,
                                  d + C,
                                  g + P - M,
                                  7,
                                  !0
                                ))
                              : (this.v.setTripleAt(
                                  d - C,
                                  g - P,
                                  d - C + M,
                                  g - P,
                                  d - C,
                                  g - P,
                                  1,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  d - C,
                                  g + P,
                                  d - C,
                                  g + P - M,
                                  d - C,
                                  g + P,
                                  2,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  d + C,
                                  g + P,
                                  d + C - M,
                                  g + P,
                                  d + C,
                                  g + P,
                                  3,
                                  !0
                                )))
                    },
                    getValue: function () {
                      this.elem.globalData.frameId !== this.frameId &&
                        ((this.frameId = this.elem.globalData.frameId),
                        this.iterateDynamicProperties(),
                        this._mdf && this.convertRectToPath())
                    },
                    reset: i
                  }),
                  extendPrototype([DynamicPropertyContainer], m),
                  m
                )
              })()
            function b(m, A, d) {
              var g
              if (d === 3 || d === 4) {
                var C = d === 3 ? A.pt : A.ks,
                  P = C.k
                P.length ? (g = new f(m, A, d)) : (g = new l(m, A, d))
              } else
                d === 5
                  ? (g = new c(m, A))
                  : d === 6
                    ? (g = new u(m, A))
                    : d === 7 && (g = new E(m, A))
              return g.k && m.addDynamicProperty(g), g
            }
            function x() {
              return l
            }
            function y() {
              return f
            }
            var _ = {}
            return (
              (_.getShapeProp = b),
              (_.getConstructorFunction = x),
              (_.getKeyframedConstructorFunction = y),
              _
            )
          })()
        /*!
 Transformation Matrix v2.0
 (c) Epistemex 2014-2015
 www.epistemex.com
 By Ken Fyrstenberg
 Contributions by leeoniya.
 License: MIT, header required.
 */ var Matrix = (function () {
          var e = Math.cos,
            t = Math.sin,
            r = Math.tan,
            i = Math.round
          function n() {
            return (
              (this.props[0] = 1),
              (this.props[1] = 0),
              (this.props[2] = 0),
              (this.props[3] = 0),
              (this.props[4] = 0),
              (this.props[5] = 1),
              (this.props[6] = 0),
              (this.props[7] = 0),
              (this.props[8] = 0),
              (this.props[9] = 0),
              (this.props[10] = 1),
              (this.props[11] = 0),
              (this.props[12] = 0),
              (this.props[13] = 0),
              (this.props[14] = 0),
              (this.props[15] = 1),
              this
            )
          }
          function s(j) {
            if (j === 0) return this
            var S = e(j),
              R = t(j)
            return this._t(S, -R, 0, 0, R, S, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
          }
          function a(j) {
            if (j === 0) return this
            var S = e(j),
              R = t(j)
            return this._t(1, 0, 0, 0, 0, S, -R, 0, 0, R, S, 0, 0, 0, 0, 1)
          }
          function l(j) {
            if (j === 0) return this
            var S = e(j),
              R = t(j)
            return this._t(S, 0, R, 0, 0, 1, 0, 0, -R, 0, S, 0, 0, 0, 0, 1)
          }
          function o(j) {
            if (j === 0) return this
            var S = e(j),
              R = t(j)
            return this._t(S, -R, 0, 0, R, S, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
          }
          function f(j, S) {
            return this._t(1, S, j, 1, 0, 0)
          }
          function u(j, S) {
            return this.shear(r(j), r(S))
          }
          function E(j, S) {
            var R = e(S),
              V = t(S)
            return this._t(R, V, 0, 0, -V, R, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
              ._t(1, 0, 0, 0, r(j), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
              ._t(R, -V, 0, 0, V, R, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
          }
          function c(j, S, R) {
            return (
              !R && R !== 0 && (R = 1),
              j === 1 && S === 1 && R === 1
                ? this
                : this._t(j, 0, 0, 0, 0, S, 0, 0, 0, 0, R, 0, 0, 0, 0, 1)
            )
          }
          function b(j, S, R, V, K, re, ne, oe, ae, ce, de, me, ue, pe, F, I) {
            return (
              (this.props[0] = j),
              (this.props[1] = S),
              (this.props[2] = R),
              (this.props[3] = V),
              (this.props[4] = K),
              (this.props[5] = re),
              (this.props[6] = ne),
              (this.props[7] = oe),
              (this.props[8] = ae),
              (this.props[9] = ce),
              (this.props[10] = de),
              (this.props[11] = me),
              (this.props[12] = ue),
              (this.props[13] = pe),
              (this.props[14] = F),
              (this.props[15] = I),
              this
            )
          }
          function x(j, S, R) {
            return (
              (R = R || 0),
              j !== 0 || S !== 0 || R !== 0
                ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, j, S, R, 1)
                : this
            )
          }
          function y(j, S, R, V, K, re, ne, oe, ae, ce, de, me, ue, pe, F, I) {
            var O = this.props
            if (
              j === 1 &&
              S === 0 &&
              R === 0 &&
              V === 0 &&
              K === 0 &&
              re === 1 &&
              ne === 0 &&
              oe === 0 &&
              ae === 0 &&
              ce === 0 &&
              de === 1 &&
              me === 0
            )
              return (
                (O[12] = O[12] * j + O[15] * ue),
                (O[13] = O[13] * re + O[15] * pe),
                (O[14] = O[14] * de + O[15] * F),
                (O[15] *= I),
                (this._identityCalculated = !1),
                this
              )
            var z = O[0],
              N = O[1],
              U = O[2],
              q = O[3],
              J = O[4],
              X = O[5],
              G = O[6],
              te = O[7],
              Q = O[8],
              ee = O[9],
              ie = O[10],
              se = O[11],
              le = O[12],
              he = O[13],
              fe = O[14],
              ye = O[15]
            return (
              (O[0] = z * j + N * K + U * ae + q * ue),
              (O[1] = z * S + N * re + U * ce + q * pe),
              (O[2] = z * R + N * ne + U * de + q * F),
              (O[3] = z * V + N * oe + U * me + q * I),
              (O[4] = J * j + X * K + G * ae + te * ue),
              (O[5] = J * S + X * re + G * ce + te * pe),
              (O[6] = J * R + X * ne + G * de + te * F),
              (O[7] = J * V + X * oe + G * me + te * I),
              (O[8] = Q * j + ee * K + ie * ae + se * ue),
              (O[9] = Q * S + ee * re + ie * ce + se * pe),
              (O[10] = Q * R + ee * ne + ie * de + se * F),
              (O[11] = Q * V + ee * oe + ie * me + se * I),
              (O[12] = le * j + he * K + fe * ae + ye * ue),
              (O[13] = le * S + he * re + fe * ce + ye * pe),
              (O[14] = le * R + he * ne + fe * de + ye * F),
              (O[15] = le * V + he * oe + fe * me + ye * I),
              (this._identityCalculated = !1),
              this
            )
          }
          function _(j) {
            var S = j.props
            return this.transform(
              S[0],
              S[1],
              S[2],
              S[3],
              S[4],
              S[5],
              S[6],
              S[7],
              S[8],
              S[9],
              S[10],
              S[11],
              S[12],
              S[13],
              S[14],
              S[15]
            )
          }
          function m() {
            return (
              this._identityCalculated ||
                ((this._identity = !(
                  this.props[0] !== 1 ||
                  this.props[1] !== 0 ||
                  this.props[2] !== 0 ||
                  this.props[3] !== 0 ||
                  this.props[4] !== 0 ||
                  this.props[5] !== 1 ||
                  this.props[6] !== 0 ||
                  this.props[7] !== 0 ||
                  this.props[8] !== 0 ||
                  this.props[9] !== 0 ||
                  this.props[10] !== 1 ||
                  this.props[11] !== 0 ||
                  this.props[12] !== 0 ||
                  this.props[13] !== 0 ||
                  this.props[14] !== 0 ||
                  this.props[15] !== 1
                )),
                (this._identityCalculated = !0)),
              this._identity
            )
          }
          function A(j) {
            for (var S = 0; S < 16; ) {
              if (j.props[S] !== this.props[S]) return !1
              S += 1
            }
            return !0
          }
          function d(j) {
            var S
            for (S = 0; S < 16; S += 1) j.props[S] = this.props[S]
            return j
          }
          function g(j) {
            var S
            for (S = 0; S < 16; S += 1) this.props[S] = j[S]
          }
          function C(j, S, R) {
            return {
              x: j * this.props[0] + S * this.props[4] + R * this.props[8] + this.props[12],
              y: j * this.props[1] + S * this.props[5] + R * this.props[9] + this.props[13],
              z: j * this.props[2] + S * this.props[6] + R * this.props[10] + this.props[14]
            }
          }
          function P(j, S, R) {
            return j * this.props[0] + S * this.props[4] + R * this.props[8] + this.props[12]
          }
          function k(j, S, R) {
            return j * this.props[1] + S * this.props[5] + R * this.props[9] + this.props[13]
          }
          function M(j, S, R) {
            return j * this.props[2] + S * this.props[6] + R * this.props[10] + this.props[14]
          }
          function D() {
            var j = this.props[0] * this.props[5] - this.props[1] * this.props[4],
              S = this.props[5] / j,
              R = -this.props[1] / j,
              V = -this.props[4] / j,
              K = this.props[0] / j,
              re = (this.props[4] * this.props[13] - this.props[5] * this.props[12]) / j,
              ne = -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) / j,
              oe = new Matrix()
            return (
              (oe.props[0] = S),
              (oe.props[1] = R),
              (oe.props[4] = V),
              (oe.props[5] = K),
              (oe.props[12] = re),
              (oe.props[13] = ne),
              oe
            )
          }
          function W(j) {
            var S = this.getInverseMatrix()
            return S.applyToPointArray(j[0], j[1], j[2] || 0)
          }
          function H(j) {
            var S,
              R = j.length,
              V = []
            for (S = 0; S < R; S += 1) V[S] = W(j[S])
            return V
          }
          function $(j, S, R) {
            var V = createTypedArray('float32', 6)
            if (this.isIdentity())
              (V[0] = j[0]),
                (V[1] = j[1]),
                (V[2] = S[0]),
                (V[3] = S[1]),
                (V[4] = R[0]),
                (V[5] = R[1])
            else {
              var K = this.props[0],
                re = this.props[1],
                ne = this.props[4],
                oe = this.props[5],
                ae = this.props[12],
                ce = this.props[13]
              ;(V[0] = j[0] * K + j[1] * ne + ae),
                (V[1] = j[0] * re + j[1] * oe + ce),
                (V[2] = S[0] * K + S[1] * ne + ae),
                (V[3] = S[0] * re + S[1] * oe + ce),
                (V[4] = R[0] * K + R[1] * ne + ae),
                (V[5] = R[0] * re + R[1] * oe + ce)
            }
            return V
          }
          function Z(j, S, R) {
            var V
            return (
              this.isIdentity()
                ? (V = [j, S, R])
                : (V = [
                    j * this.props[0] + S * this.props[4] + R * this.props[8] + this.props[12],
                    j * this.props[1] + S * this.props[5] + R * this.props[9] + this.props[13],
                    j * this.props[2] + S * this.props[6] + R * this.props[10] + this.props[14]
                  ]),
              V
            )
          }
          function Y(j, S) {
            if (this.isIdentity()) return j + ',' + S
            var R = this.props
            return (
              Math.round((j * R[0] + S * R[4] + R[12]) * 100) / 100 +
              ',' +
              Math.round((j * R[1] + S * R[5] + R[13]) * 100) / 100
            )
          }
          function L() {
            for (var j = 0, S = this.props, R = 'matrix3d(', V = 1e4; j < 16; )
              (R += i(S[j] * V) / V), (R += j === 15 ? ')' : ','), (j += 1)
            return R
          }
          function B(j) {
            var S = 1e4
            return (j < 1e-6 && j > 0) || (j > -1e-6 && j < 0) ? i(j * S) / S : j
          }
          function T() {
            var j = this.props,
              S = B(j[0]),
              R = B(j[1]),
              V = B(j[4]),
              K = B(j[5]),
              re = B(j[12]),
              ne = B(j[13])
            return 'matrix(' + S + ',' + R + ',' + V + ',' + K + ',' + re + ',' + ne + ')'
          }
          return function () {
            ;(this.reset = n),
              (this.rotate = s),
              (this.rotateX = a),
              (this.rotateY = l),
              (this.rotateZ = o),
              (this.skew = u),
              (this.skewFromAxis = E),
              (this.shear = f),
              (this.scale = c),
              (this.setTransform = b),
              (this.translate = x),
              (this.transform = y),
              (this.multiply = _),
              (this.applyToPoint = C),
              (this.applyToX = P),
              (this.applyToY = k),
              (this.applyToZ = M),
              (this.applyToPointArray = Z),
              (this.applyToTriplePoints = $),
              (this.applyToPointStringified = Y),
              (this.toCSS = L),
              (this.to2dCSS = T),
              (this.clone = d),
              (this.cloneFromProps = g),
              (this.equals = A),
              (this.inversePoints = H),
              (this.inversePoint = W),
              (this.getInverseMatrix = D),
              (this._t = this.transform),
              (this.isIdentity = m),
              (this._identity = !0),
              (this._identityCalculated = !1),
              (this.props = createTypedArray('float32', 16)),
              this.reset()
          }
        })()
        function _typeof$3(e) {
          '@babel/helpers - typeof'
          return (
            typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
              ? (_typeof$3 = function (r) {
                  return typeof r
                })
              : (_typeof$3 = function (r) {
                  return r &&
                    typeof Symbol == 'function' &&
                    r.constructor === Symbol &&
                    r !== Symbol.prototype
                    ? 'symbol'
                    : typeof r
                }),
            _typeof$3(e)
          )
        }
        var lottie = {}
        function setLocation(e) {
          setLocationHref(e)
        }
        function searchAnimations() {
          animationManager.searchAnimations()
        }
        function setSubframeRendering(e) {
          setSubframeEnabled(e)
        }
        function setPrefix(e) {
          setIdPrefix(e)
        }
        function loadAnimation(e) {
          return animationManager.loadAnimation(e)
        }
        function setQuality(e) {
          if (typeof e == 'string')
            switch (e) {
              case 'high':
                setDefaultCurveSegments(200)
                break
              default:
              case 'medium':
                setDefaultCurveSegments(50)
                break
              case 'low':
                setDefaultCurveSegments(10)
                break
            }
          else !isNaN(e) && e > 1 && setDefaultCurveSegments(e)
        }
        function inBrowser() {
          return typeof navigator < 'u'
        }
        function installPlugin(e, t) {
          e === 'expressions' && setExpressionsPlugin(t)
        }
        function getFactory(e) {
          switch (e) {
            case 'propertyFactory':
              return PropertyFactory
            case 'shapePropertyFactory':
              return ShapePropertyFactory
            case 'matrix':
              return Matrix
            default:
              return null
          }
        }
        ;(lottie.play = animationManager.play),
          (lottie.pause = animationManager.pause),
          (lottie.setLocationHref = setLocation),
          (lottie.togglePause = animationManager.togglePause),
          (lottie.setSpeed = animationManager.setSpeed),
          (lottie.setDirection = animationManager.setDirection),
          (lottie.stop = animationManager.stop),
          (lottie.searchAnimations = searchAnimations),
          (lottie.registerAnimation = animationManager.registerAnimation),
          (lottie.loadAnimation = loadAnimation),
          (lottie.setSubframeRendering = setSubframeRendering),
          (lottie.resize = animationManager.resize),
          (lottie.goToAndStop = animationManager.goToAndStop),
          (lottie.destroy = animationManager.destroy),
          (lottie.setQuality = setQuality),
          (lottie.inBrowser = inBrowser),
          (lottie.installPlugin = installPlugin),
          (lottie.freeze = animationManager.freeze),
          (lottie.unfreeze = animationManager.unfreeze),
          (lottie.setVolume = animationManager.setVolume),
          (lottie.mute = animationManager.mute),
          (lottie.unmute = animationManager.unmute),
          (lottie.getRegisteredAnimations = animationManager.getRegisteredAnimations),
          (lottie.useWebWorker = setWebWorker),
          (lottie.setIDPrefix = setPrefix),
          (lottie.__getFactory = getFactory),
          (lottie.version = '5.12.2')
        function checkReady() {
          document.readyState === 'complete' &&
            (clearInterval(readyStateCheckInterval), searchAnimations())
        }
        function getQueryVariable(e) {
          for (var t = queryString.split('&'), r = 0; r < t.length; r += 1) {
            var i = t[r].split('=')
            if (decodeURIComponent(i[0]) == e) return decodeURIComponent(i[1])
          }
          return null
        }
        var queryString = ''
        {
          var scripts = document.getElementsByTagName('script'),
            index = scripts.length - 1,
            myScript = scripts[index] || { src: '' }
          ;(queryString = myScript.src ? myScript.src.replace(/^[^\?]+\??/, '') : ''),
            getQueryVariable('renderer')
        }
        var readyStateCheckInterval = setInterval(checkReady, 100)
        try {
          _typeof$3(exports) !== 'object' && (window.bodymovin = lottie)
        } catch (e) {}
        var ShapeModifiers = (function () {
          var e = {},
            t = {}
          ;(e.registerModifier = r), (e.getModifier = i)
          function r(n, s) {
            t[n] || (t[n] = s)
          }
          function i(n, s, a) {
            return new t[n](s, a)
          }
          return e
        })()
        function ShapeModifier() {}
        ;(ShapeModifier.prototype.initModifierProperties = function () {}),
          (ShapeModifier.prototype.addShapeToModifier = function () {}),
          (ShapeModifier.prototype.addShape = function (e) {
            if (!this.closed) {
              e.sh.container.addDynamicProperty(e.sh)
              var t = {
                shape: e.sh,
                data: e,
                localShapeCollection: shapeCollectionPool.newShapeCollection()
              }
              this.shapes.push(t), this.addShapeToModifier(t), this._isAnimated && e.setAsAnimated()
            }
          }),
          (ShapeModifier.prototype.init = function (e, t) {
            ;(this.shapes = []),
              (this.elem = e),
              this.initDynamicPropertyContainer(e),
              this.initModifierProperties(e, t),
              (this.frameId = initialDefaultFrame),
              (this.closed = !1),
              (this.k = !1),
              this.dynamicProperties.length ? (this.k = !0) : this.getValue(!0)
          }),
          (ShapeModifier.prototype.processKeys = function () {
            this.elem.globalData.frameId !== this.frameId &&
              ((this.frameId = this.elem.globalData.frameId), this.iterateDynamicProperties())
          }),
          extendPrototype([DynamicPropertyContainer], ShapeModifier)
        function TrimModifier() {}
        extendPrototype([ShapeModifier], TrimModifier),
          (TrimModifier.prototype.initModifierProperties = function (e, t) {
            ;(this.s = PropertyFactory.getProp(e, t.s, 0, 0.01, this)),
              (this.e = PropertyFactory.getProp(e, t.e, 0, 0.01, this)),
              (this.o = PropertyFactory.getProp(e, t.o, 0, 0, this)),
              (this.sValue = 0),
              (this.eValue = 0),
              (this.getValue = this.processKeys),
              (this.m = t.m),
              (this._isAnimated =
                !!this.s.effectsSequence.length ||
                !!this.e.effectsSequence.length ||
                !!this.o.effectsSequence.length)
          }),
          (TrimModifier.prototype.addShapeToModifier = function (e) {
            e.pathsData = []
          }),
          (TrimModifier.prototype.calculateShapeEdges = function (e, t, r, i, n) {
            var s = []
            t <= 1
              ? s.push({ s: e, e: t })
              : e >= 1
                ? s.push({ s: e - 1, e: t - 1 })
                : (s.push({ s: e, e: 1 }), s.push({ s: 0, e: t - 1 }))
            var a = [],
              l,
              o = s.length,
              f
            for (l = 0; l < o; l += 1)
              if (((f = s[l]), !(f.e * n < i || f.s * n > i + r))) {
                var u, E
                f.s * n <= i ? (u = 0) : (u = (f.s * n - i) / r),
                  f.e * n >= i + r ? (E = 1) : (E = (f.e * n - i) / r),
                  a.push([u, E])
              }
            return a.length || a.push([0, 0]), a
          }),
          (TrimModifier.prototype.releasePathsData = function (e) {
            var t,
              r = e.length
            for (t = 0; t < r; t += 1) segmentsLengthPool.release(e[t])
            return (e.length = 0), e
          }),
          (TrimModifier.prototype.processShapes = function (e) {
            var t, r
            if (this._mdf || e) {
              var i = (this.o.v % 360) / 360
              if (
                (i < 0 && (i += 1),
                this.s.v > 1 ? (t = 1 + i) : this.s.v < 0 ? (t = 0 + i) : (t = this.s.v + i),
                this.e.v > 1 ? (r = 1 + i) : this.e.v < 0 ? (r = 0 + i) : (r = this.e.v + i),
                t > r)
              ) {
                var n = t
                ;(t = r), (r = n)
              }
              ;(t = Math.round(t * 1e4) * 1e-4),
                (r = Math.round(r * 1e4) * 1e-4),
                (this.sValue = t),
                (this.eValue = r)
            } else (t = this.sValue), (r = this.eValue)
            var s,
              a,
              l = this.shapes.length,
              o,
              f,
              u,
              E,
              c,
              b = 0
            if (r === t)
              for (a = 0; a < l; a += 1)
                this.shapes[a].localShapeCollection.releaseShapes(),
                  (this.shapes[a].shape._mdf = !0),
                  (this.shapes[a].shape.paths = this.shapes[a].localShapeCollection),
                  this._mdf && (this.shapes[a].pathsData.length = 0)
            else if ((r === 1 && t === 0) || (r === 0 && t === 1)) {
              if (this._mdf)
                for (a = 0; a < l; a += 1)
                  (this.shapes[a].pathsData.length = 0), (this.shapes[a].shape._mdf = !0)
            } else {
              var x = [],
                y,
                _
              for (a = 0; a < l; a += 1)
                if (((y = this.shapes[a]), !y.shape._mdf && !this._mdf && !e && this.m !== 2))
                  y.shape.paths = y.localShapeCollection
                else {
                  if (
                    ((s = y.shape.paths),
                    (f = s._length),
                    (c = 0),
                    !y.shape._mdf && y.pathsData.length)
                  )
                    c = y.totalShapeLength
                  else {
                    for (u = this.releasePathsData(y.pathsData), o = 0; o < f; o += 1)
                      (E = bez.getSegmentsLength(s.shapes[o])), u.push(E), (c += E.totalLength)
                    ;(y.totalShapeLength = c), (y.pathsData = u)
                  }
                  ;(b += c), (y.shape._mdf = !0)
                }
              var m = t,
                A = r,
                d = 0,
                g
              for (a = l - 1; a >= 0; a -= 1)
                if (((y = this.shapes[a]), y.shape._mdf)) {
                  for (
                    _ = y.localShapeCollection,
                      _.releaseShapes(),
                      this.m === 2 && l > 1
                        ? ((g = this.calculateShapeEdges(t, r, y.totalShapeLength, d, b)),
                          (d += y.totalShapeLength))
                        : (g = [[m, A]]),
                      f = g.length,
                      o = 0;
                    o < f;
                    o += 1
                  ) {
                    ;(m = g[o][0]),
                      (A = g[o][1]),
                      (x.length = 0),
                      A <= 1
                        ? x.push({ s: y.totalShapeLength * m, e: y.totalShapeLength * A })
                        : m >= 1
                          ? x.push({
                              s: y.totalShapeLength * (m - 1),
                              e: y.totalShapeLength * (A - 1)
                            })
                          : (x.push({ s: y.totalShapeLength * m, e: y.totalShapeLength }),
                            x.push({ s: 0, e: y.totalShapeLength * (A - 1) }))
                    var C = this.addShapes(y, x[0])
                    if (x[0].s !== x[0].e) {
                      if (x.length > 1) {
                        var P = y.shape.paths.shapes[y.shape.paths._length - 1]
                        if (P.c) {
                          var k = C.pop()
                          this.addPaths(C, _), (C = this.addShapes(y, x[1], k))
                        } else this.addPaths(C, _), (C = this.addShapes(y, x[1]))
                      }
                      this.addPaths(C, _)
                    }
                  }
                  y.shape.paths = _
                }
            }
          }),
          (TrimModifier.prototype.addPaths = function (e, t) {
            var r,
              i = e.length
            for (r = 0; r < i; r += 1) t.addShape(e[r])
          }),
          (TrimModifier.prototype.addSegment = function (e, t, r, i, n, s, a) {
            n.setXYAt(t[0], t[1], 'o', s),
              n.setXYAt(r[0], r[1], 'i', s + 1),
              a && n.setXYAt(e[0], e[1], 'v', s),
              n.setXYAt(i[0], i[1], 'v', s + 1)
          }),
          (TrimModifier.prototype.addSegmentFromArray = function (e, t, r, i) {
            t.setXYAt(e[1], e[5], 'o', r),
              t.setXYAt(e[2], e[6], 'i', r + 1),
              i && t.setXYAt(e[0], e[4], 'v', r),
              t.setXYAt(e[3], e[7], 'v', r + 1)
          }),
          (TrimModifier.prototype.addShapes = function (e, t, r) {
            var i = e.pathsData,
              n = e.shape.paths.shapes,
              s,
              a = e.shape.paths._length,
              l,
              o,
              f = 0,
              u,
              E,
              c,
              b,
              x = [],
              y,
              _ = !0
            for (
              r
                ? ((E = r._length), (y = r._length))
                : ((r = shapePool.newElement()), (E = 0), (y = 0)),
                x.push(r),
                s = 0;
              s < a;
              s += 1
            ) {
              for (
                c = i[s].lengths, r.c = n[s].c, o = n[s].c ? c.length : c.length + 1, l = 1;
                l < o;
                l += 1
              )
                if (((u = c[l - 1]), f + u.addedLength < t.s)) (f += u.addedLength), (r.c = !1)
                else if (f > t.e) {
                  r.c = !1
                  break
                } else
                  t.s <= f && t.e >= f + u.addedLength
                    ? (this.addSegment(n[s].v[l - 1], n[s].o[l - 1], n[s].i[l], n[s].v[l], r, E, _),
                      (_ = !1))
                    : ((b = bez.getNewSegment(
                        n[s].v[l - 1],
                        n[s].v[l],
                        n[s].o[l - 1],
                        n[s].i[l],
                        (t.s - f) / u.addedLength,
                        (t.e - f) / u.addedLength,
                        c[l - 1]
                      )),
                      this.addSegmentFromArray(b, r, E, _),
                      (_ = !1),
                      (r.c = !1)),
                    (f += u.addedLength),
                    (E += 1)
              if (n[s].c && c.length) {
                if (((u = c[l - 1]), f <= t.e)) {
                  var m = c[l - 1].addedLength
                  t.s <= f && t.e >= f + m
                    ? (this.addSegment(n[s].v[l - 1], n[s].o[l - 1], n[s].i[0], n[s].v[0], r, E, _),
                      (_ = !1))
                    : ((b = bez.getNewSegment(
                        n[s].v[l - 1],
                        n[s].v[0],
                        n[s].o[l - 1],
                        n[s].i[0],
                        (t.s - f) / m,
                        (t.e - f) / m,
                        c[l - 1]
                      )),
                      this.addSegmentFromArray(b, r, E, _),
                      (_ = !1),
                      (r.c = !1))
                } else r.c = !1
                ;(f += u.addedLength), (E += 1)
              }
              if (
                (r._length &&
                  (r.setXYAt(r.v[y][0], r.v[y][1], 'i', y),
                  r.setXYAt(r.v[r._length - 1][0], r.v[r._length - 1][1], 'o', r._length - 1)),
                f > t.e)
              )
                break
              s < a - 1 && ((r = shapePool.newElement()), (_ = !0), x.push(r), (E = 0))
            }
            return x
          })
        function PuckerAndBloatModifier() {}
        extendPrototype([ShapeModifier], PuckerAndBloatModifier),
          (PuckerAndBloatModifier.prototype.initModifierProperties = function (e, t) {
            ;(this.getValue = this.processKeys),
              (this.amount = PropertyFactory.getProp(e, t.a, 0, null, this)),
              (this._isAnimated = !!this.amount.effectsSequence.length)
          }),
          (PuckerAndBloatModifier.prototype.processPath = function (e, t) {
            var r = t / 100,
              i = [0, 0],
              n = e._length,
              s = 0
            for (s = 0; s < n; s += 1) (i[0] += e.v[s][0]), (i[1] += e.v[s][1])
            ;(i[0] /= n), (i[1] /= n)
            var a = shapePool.newElement()
            a.c = e.c
            var l, o, f, u, E, c
            for (s = 0; s < n; s += 1)
              (l = e.v[s][0] + (i[0] - e.v[s][0]) * r),
                (o = e.v[s][1] + (i[1] - e.v[s][1]) * r),
                (f = e.o[s][0] + (i[0] - e.o[s][0]) * -r),
                (u = e.o[s][1] + (i[1] - e.o[s][1]) * -r),
                (E = e.i[s][0] + (i[0] - e.i[s][0]) * -r),
                (c = e.i[s][1] + (i[1] - e.i[s][1]) * -r),
                a.setTripleAt(l, o, f, u, E, c, s)
            return a
          }),
          (PuckerAndBloatModifier.prototype.processShapes = function (e) {
            var t,
              r,
              i = this.shapes.length,
              n,
              s,
              a = this.amount.v
            if (a !== 0) {
              var l, o
              for (r = 0; r < i; r += 1) {
                if (
                  ((l = this.shapes[r]),
                  (o = l.localShapeCollection),
                  !(!l.shape._mdf && !this._mdf && !e))
                )
                  for (
                    o.releaseShapes(),
                      l.shape._mdf = !0,
                      t = l.shape.paths.shapes,
                      s = l.shape.paths._length,
                      n = 0;
                    n < s;
                    n += 1
                  )
                    o.addShape(this.processPath(t[n], a))
                l.shape.paths = l.localShapeCollection
              }
            }
            this.dynamicProperties.length || (this._mdf = !1)
          })
        var TransformPropertyFactory = (function () {
          var e = [0, 0]
          function t(o) {
            var f = this._mdf
            this.iterateDynamicProperties(),
              (this._mdf = this._mdf || f),
              this.a && o.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
              this.s && o.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
              this.sk && o.skewFromAxis(-this.sk.v, this.sa.v),
              this.r
                ? o.rotate(-this.r.v)
                : o
                    .rotateZ(-this.rz.v)
                    .rotateY(this.ry.v)
                    .rotateX(this.rx.v)
                    .rotateZ(-this.or.v[2])
                    .rotateY(this.or.v[1])
                    .rotateX(this.or.v[0]),
              this.data.p.s
                ? this.data.p.z
                  ? o.translate(this.px.v, this.py.v, -this.pz.v)
                  : o.translate(this.px.v, this.py.v, 0)
                : o.translate(this.p.v[0], this.p.v[1], -this.p.v[2])
          }
          function r(o) {
            if (this.elem.globalData.frameId !== this.frameId) {
              if (
                (this._isDirty && (this.precalculateMatrix(), (this._isDirty = !1)),
                this.iterateDynamicProperties(),
                this._mdf || o)
              ) {
                var f
                if (
                  (this.v.cloneFromProps(this.pre.props),
                  this.appliedTransformations < 1 &&
                    this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
                  this.appliedTransformations < 2 &&
                    this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                  this.sk &&
                    this.appliedTransformations < 3 &&
                    this.v.skewFromAxis(-this.sk.v, this.sa.v),
                  this.r && this.appliedTransformations < 4
                    ? this.v.rotate(-this.r.v)
                    : !this.r &&
                      this.appliedTransformations < 4 &&
                      this.v
                        .rotateZ(-this.rz.v)
                        .rotateY(this.ry.v)
                        .rotateX(this.rx.v)
                        .rotateZ(-this.or.v[2])
                        .rotateY(this.or.v[1])
                        .rotateX(this.or.v[0]),
                  this.autoOriented)
                ) {
                  var u, E
                  if (
                    ((f = this.elem.globalData.frameRate),
                    this.p && this.p.keyframes && this.p.getValueAtTime)
                  )
                    this.p._caching.lastFrame + this.p.offsetTime <= this.p.keyframes[0].t
                      ? ((u = this.p.getValueAtTime((this.p.keyframes[0].t + 0.01) / f, 0)),
                        (E = this.p.getValueAtTime(this.p.keyframes[0].t / f, 0)))
                      : this.p._caching.lastFrame + this.p.offsetTime >=
                          this.p.keyframes[this.p.keyframes.length - 1].t
                        ? ((u = this.p.getValueAtTime(
                            this.p.keyframes[this.p.keyframes.length - 1].t / f,
                            0
                          )),
                          (E = this.p.getValueAtTime(
                            (this.p.keyframes[this.p.keyframes.length - 1].t - 0.05) / f,
                            0
                          )))
                        : ((u = this.p.pv),
                          (E = this.p.getValueAtTime(
                            (this.p._caching.lastFrame + this.p.offsetTime - 0.01) / f,
                            this.p.offsetTime
                          )))
                  else if (
                    this.px &&
                    this.px.keyframes &&
                    this.py.keyframes &&
                    this.px.getValueAtTime &&
                    this.py.getValueAtTime
                  ) {
                    ;(u = []), (E = [])
                    var c = this.px,
                      b = this.py
                    c._caching.lastFrame + c.offsetTime <= c.keyframes[0].t
                      ? ((u[0] = c.getValueAtTime((c.keyframes[0].t + 0.01) / f, 0)),
                        (u[1] = b.getValueAtTime((b.keyframes[0].t + 0.01) / f, 0)),
                        (E[0] = c.getValueAtTime(c.keyframes[0].t / f, 0)),
                        (E[1] = b.getValueAtTime(b.keyframes[0].t / f, 0)))
                      : c._caching.lastFrame + c.offsetTime >= c.keyframes[c.keyframes.length - 1].t
                        ? ((u[0] = c.getValueAtTime(c.keyframes[c.keyframes.length - 1].t / f, 0)),
                          (u[1] = b.getValueAtTime(b.keyframes[b.keyframes.length - 1].t / f, 0)),
                          (E[0] = c.getValueAtTime(
                            (c.keyframes[c.keyframes.length - 1].t - 0.01) / f,
                            0
                          )),
                          (E[1] = b.getValueAtTime(
                            (b.keyframes[b.keyframes.length - 1].t - 0.01) / f,
                            0
                          )))
                        : ((u = [c.pv, b.pv]),
                          (E[0] = c.getValueAtTime(
                            (c._caching.lastFrame + c.offsetTime - 0.01) / f,
                            c.offsetTime
                          )),
                          (E[1] = b.getValueAtTime(
                            (b._caching.lastFrame + b.offsetTime - 0.01) / f,
                            b.offsetTime
                          )))
                  } else (E = e), (u = E)
                  this.v.rotate(-Math.atan2(u[1] - E[1], u[0] - E[0]))
                }
                this.data.p && this.data.p.s
                  ? this.data.p.z
                    ? this.v.translate(this.px.v, this.py.v, -this.pz.v)
                    : this.v.translate(this.px.v, this.py.v, 0)
                  : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2])
              }
              this.frameId = this.elem.globalData.frameId
            }
          }
          function i() {
            if (
              ((this.appliedTransformations = 0), this.pre.reset(), !this.a.effectsSequence.length)
            )
              this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
                (this.appliedTransformations = 1)
            else return
            if (!this.s.effectsSequence.length)
              this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                (this.appliedTransformations = 2)
            else return
            if (this.sk)
              if (!this.sk.effectsSequence.length && !this.sa.effectsSequence.length)
                this.pre.skewFromAxis(-this.sk.v, this.sa.v), (this.appliedTransformations = 3)
              else return
            this.r
              ? this.r.effectsSequence.length ||
                (this.pre.rotate(-this.r.v), (this.appliedTransformations = 4))
              : !this.rz.effectsSequence.length &&
                !this.ry.effectsSequence.length &&
                !this.rx.effectsSequence.length &&
                !this.or.effectsSequence.length &&
                (this.pre
                  .rotateZ(-this.rz.v)
                  .rotateY(this.ry.v)
                  .rotateX(this.rx.v)
                  .rotateZ(-this.or.v[2])
                  .rotateY(this.or.v[1])
                  .rotateX(this.or.v[0]),
                (this.appliedTransformations = 4))
          }
          function n() {}
          function s(o) {
            this._addDynamicProperty(o), this.elem.addDynamicProperty(o), (this._isDirty = !0)
          }
          function a(o, f, u) {
            if (
              ((this.elem = o),
              (this.frameId = -1),
              (this.propType = 'transform'),
              (this.data = f),
              (this.v = new Matrix()),
              (this.pre = new Matrix()),
              (this.appliedTransformations = 0),
              this.initDynamicPropertyContainer(u || o),
              f.p && f.p.s
                ? ((this.px = PropertyFactory.getProp(o, f.p.x, 0, 0, this)),
                  (this.py = PropertyFactory.getProp(o, f.p.y, 0, 0, this)),
                  f.p.z && (this.pz = PropertyFactory.getProp(o, f.p.z, 0, 0, this)))
                : (this.p = PropertyFactory.getProp(o, f.p || { k: [0, 0, 0] }, 1, 0, this)),
              f.rx)
            ) {
              if (
                ((this.rx = PropertyFactory.getProp(o, f.rx, 0, degToRads, this)),
                (this.ry = PropertyFactory.getProp(o, f.ry, 0, degToRads, this)),
                (this.rz = PropertyFactory.getProp(o, f.rz, 0, degToRads, this)),
                f.or.k[0].ti)
              ) {
                var E,
                  c = f.or.k.length
                for (E = 0; E < c; E += 1) (f.or.k[E].to = null), (f.or.k[E].ti = null)
              }
              ;(this.or = PropertyFactory.getProp(o, f.or, 1, degToRads, this)), (this.or.sh = !0)
            } else this.r = PropertyFactory.getProp(o, f.r || { k: 0 }, 0, degToRads, this)
            f.sk &&
              ((this.sk = PropertyFactory.getProp(o, f.sk, 0, degToRads, this)),
              (this.sa = PropertyFactory.getProp(o, f.sa, 0, degToRads, this))),
              (this.a = PropertyFactory.getProp(o, f.a || { k: [0, 0, 0] }, 1, 0, this)),
              (this.s = PropertyFactory.getProp(o, f.s || { k: [100, 100, 100] }, 1, 0.01, this)),
              f.o
                ? (this.o = PropertyFactory.getProp(o, f.o, 0, 0.01, o))
                : (this.o = { _mdf: !1, v: 1 }),
              (this._isDirty = !0),
              this.dynamicProperties.length || this.getValue(!0)
          }
          ;(a.prototype = { applyToMatrix: t, getValue: r, precalculateMatrix: i, autoOrient: n }),
            extendPrototype([DynamicPropertyContainer], a),
            (a.prototype.addDynamicProperty = s),
            (a.prototype._addDynamicProperty =
              DynamicPropertyContainer.prototype.addDynamicProperty)
          function l(o, f, u) {
            return new a(o, f, u)
          }
          return { getTransformProperty: l }
        })()
        function RepeaterModifier() {}
        extendPrototype([ShapeModifier], RepeaterModifier),
          (RepeaterModifier.prototype.initModifierProperties = function (e, t) {
            ;(this.getValue = this.processKeys),
              (this.c = PropertyFactory.getProp(e, t.c, 0, null, this)),
              (this.o = PropertyFactory.getProp(e, t.o, 0, null, this)),
              (this.tr = TransformPropertyFactory.getTransformProperty(e, t.tr, this)),
              (this.so = PropertyFactory.getProp(e, t.tr.so, 0, 0.01, this)),
              (this.eo = PropertyFactory.getProp(e, t.tr.eo, 0, 0.01, this)),
              (this.data = t),
              this.dynamicProperties.length || this.getValue(!0),
              (this._isAnimated = !!this.dynamicProperties.length),
              (this.pMatrix = new Matrix()),
              (this.rMatrix = new Matrix()),
              (this.sMatrix = new Matrix()),
              (this.tMatrix = new Matrix()),
              (this.matrix = new Matrix())
          }),
          (RepeaterModifier.prototype.applyTransforms = function (e, t, r, i, n, s) {
            var a = s ? -1 : 1,
              l = i.s.v[0] + (1 - i.s.v[0]) * (1 - n),
              o = i.s.v[1] + (1 - i.s.v[1]) * (1 - n)
            e.translate(i.p.v[0] * a * n, i.p.v[1] * a * n, i.p.v[2]),
              t.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]),
              t.rotate(-i.r.v * a * n),
              t.translate(i.a.v[0], i.a.v[1], i.a.v[2]),
              r.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]),
              r.scale(s ? 1 / l : l, s ? 1 / o : o),
              r.translate(i.a.v[0], i.a.v[1], i.a.v[2])
          }),
          (RepeaterModifier.prototype.init = function (e, t, r, i) {
            for (
              this.elem = e,
                this.arr = t,
                this.pos = r,
                this.elemsData = i,
                this._currentCopies = 0,
                this._elements = [],
                this._groups = [],
                this.frameId = -1,
                this.initDynamicPropertyContainer(e),
                this.initModifierProperties(e, t[r]);
              r > 0;

            )
              (r -= 1), this._elements.unshift(t[r])
            this.dynamicProperties.length ? (this.k = !0) : this.getValue(!0)
          }),
          (RepeaterModifier.prototype.resetElements = function (e) {
            var t,
              r = e.length
            for (t = 0; t < r; t += 1)
              (e[t]._processed = !1), e[t].ty === 'gr' && this.resetElements(e[t].it)
          }),
          (RepeaterModifier.prototype.cloneElements = function (e) {
            var t = JSON.parse(JSON.stringify(e))
            return this.resetElements(t), t
          }),
          (RepeaterModifier.prototype.changeGroupRender = function (e, t) {
            var r,
              i = e.length
            for (r = 0; r < i; r += 1)
              (e[r]._render = t), e[r].ty === 'gr' && this.changeGroupRender(e[r].it, t)
          }),
          (RepeaterModifier.prototype.processShapes = function (e) {
            var t,
              r,
              i,
              n,
              s,
              a = !1
            if (this._mdf || e) {
              var l = Math.ceil(this.c.v)
              if (this._groups.length < l) {
                for (; this._groups.length < l; ) {
                  var o = { it: this.cloneElements(this._elements), ty: 'gr' }
                  o.it.push({
                    a: { a: 0, ix: 1, k: [0, 0] },
                    nm: 'Transform',
                    o: { a: 0, ix: 7, k: 100 },
                    p: { a: 0, ix: 2, k: [0, 0] },
                    r: {
                      a: 1,
                      ix: 6,
                      k: [
                        { s: 0, e: 0, t: 0 },
                        { s: 0, e: 0, t: 1 }
                      ]
                    },
                    s: { a: 0, ix: 3, k: [100, 100] },
                    sa: { a: 0, ix: 5, k: 0 },
                    sk: { a: 0, ix: 4, k: 0 },
                    ty: 'tr'
                  }),
                    this.arr.splice(0, 0, o),
                    this._groups.splice(0, 0, o),
                    (this._currentCopies += 1)
                }
                this.elem.reloadShapes(), (a = !0)
              }
              s = 0
              var f
              for (i = 0; i <= this._groups.length - 1; i += 1) {
                if (
                  ((f = s < l),
                  (this._groups[i]._render = f),
                  this.changeGroupRender(this._groups[i].it, f),
                  !f)
                ) {
                  var u = this.elemsData[i].it,
                    E = u[u.length - 1]
                  E.transform.op.v !== 0
                    ? ((E.transform.op._mdf = !0), (E.transform.op.v = 0))
                    : (E.transform.op._mdf = !1)
                }
                s += 1
              }
              this._currentCopies = l
              var c = this.o.v,
                b = c % 1,
                x = c > 0 ? Math.floor(c) : Math.ceil(c),
                y = this.pMatrix.props,
                _ = this.rMatrix.props,
                m = this.sMatrix.props
              this.pMatrix.reset(),
                this.rMatrix.reset(),
                this.sMatrix.reset(),
                this.tMatrix.reset(),
                this.matrix.reset()
              var A = 0
              if (c > 0) {
                for (; A < x; )
                  this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1),
                    (A += 1)
                b &&
                  (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, b, !1),
                  (A += b))
              } else if (c < 0) {
                for (; A > x; )
                  this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !0),
                    (A -= 1)
                b &&
                  (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, -b, !0),
                  (A -= b))
              }
              ;(i = this.data.m === 1 ? 0 : this._currentCopies - 1),
                (n = this.data.m === 1 ? 1 : -1),
                (s = this._currentCopies)
              for (var d, g; s; ) {
                if (
                  ((t = this.elemsData[i].it),
                  (r = t[t.length - 1].transform.mProps.v.props),
                  (g = r.length),
                  (t[t.length - 1].transform.mProps._mdf = !0),
                  (t[t.length - 1].transform.op._mdf = !0),
                  (t[t.length - 1].transform.op.v =
                    this._currentCopies === 1
                      ? this.so.v
                      : this.so.v + (this.eo.v - this.so.v) * (i / (this._currentCopies - 1))),
                  A !== 0)
                ) {
                  for (
                    ((i !== 0 && n === 1) || (i !== this._currentCopies - 1 && n === -1)) &&
                      this.applyTransforms(
                        this.pMatrix,
                        this.rMatrix,
                        this.sMatrix,
                        this.tr,
                        1,
                        !1
                      ),
                      this.matrix.transform(
                        _[0],
                        _[1],
                        _[2],
                        _[3],
                        _[4],
                        _[5],
                        _[6],
                        _[7],
                        _[8],
                        _[9],
                        _[10],
                        _[11],
                        _[12],
                        _[13],
                        _[14],
                        _[15]
                      ),
                      this.matrix.transform(
                        m[0],
                        m[1],
                        m[2],
                        m[3],
                        m[4],
                        m[5],
                        m[6],
                        m[7],
                        m[8],
                        m[9],
                        m[10],
                        m[11],
                        m[12],
                        m[13],
                        m[14],
                        m[15]
                      ),
                      this.matrix.transform(
                        y[0],
                        y[1],
                        y[2],
                        y[3],
                        y[4],
                        y[5],
                        y[6],
                        y[7],
                        y[8],
                        y[9],
                        y[10],
                        y[11],
                        y[12],
                        y[13],
                        y[14],
                        y[15]
                      ),
                      d = 0;
                    d < g;
                    d += 1
                  )
                    r[d] = this.matrix.props[d]
                  this.matrix.reset()
                } else for (this.matrix.reset(), d = 0; d < g; d += 1) r[d] = this.matrix.props[d]
                ;(A += 1), (s -= 1), (i += n)
              }
            } else
              for (s = this._currentCopies, i = 0, n = 1; s; )
                (t = this.elemsData[i].it),
                  (r = t[t.length - 1].transform.mProps.v.props),
                  (t[t.length - 1].transform.mProps._mdf = !1),
                  (t[t.length - 1].transform.op._mdf = !1),
                  (s -= 1),
                  (i += n)
            return a
          }),
          (RepeaterModifier.prototype.addShape = function () {})
        function RoundCornersModifier() {}
        extendPrototype([ShapeModifier], RoundCornersModifier),
          (RoundCornersModifier.prototype.initModifierProperties = function (e, t) {
            ;(this.getValue = this.processKeys),
              (this.rd = PropertyFactory.getProp(e, t.r, 0, null, this)),
              (this._isAnimated = !!this.rd.effectsSequence.length)
          }),
          (RoundCornersModifier.prototype.processPath = function (e, t) {
            var r = shapePool.newElement()
            r.c = e.c
            var i,
              n = e._length,
              s,
              a,
              l,
              o,
              f,
              u,
              E = 0,
              c,
              b,
              x,
              y,
              _,
              m
            for (i = 0; i < n; i += 1)
              (s = e.v[i]),
                (l = e.o[i]),
                (a = e.i[i]),
                s[0] === l[0] && s[1] === l[1] && s[0] === a[0] && s[1] === a[1]
                  ? (i === 0 || i === n - 1) && !e.c
                    ? (r.setTripleAt(s[0], s[1], l[0], l[1], a[0], a[1], E), (E += 1))
                    : (i === 0 ? (o = e.v[n - 1]) : (o = e.v[i - 1]),
                      (f = Math.sqrt(Math.pow(s[0] - o[0], 2) + Math.pow(s[1] - o[1], 2))),
                      (u = f ? Math.min(f / 2, t) / f : 0),
                      (_ = s[0] + (o[0] - s[0]) * u),
                      (c = _),
                      (m = s[1] - (s[1] - o[1]) * u),
                      (b = m),
                      (x = c - (c - s[0]) * roundCorner),
                      (y = b - (b - s[1]) * roundCorner),
                      r.setTripleAt(c, b, x, y, _, m, E),
                      (E += 1),
                      i === n - 1 ? (o = e.v[0]) : (o = e.v[i + 1]),
                      (f = Math.sqrt(Math.pow(s[0] - o[0], 2) + Math.pow(s[1] - o[1], 2))),
                      (u = f ? Math.min(f / 2, t) / f : 0),
                      (x = s[0] + (o[0] - s[0]) * u),
                      (c = x),
                      (y = s[1] + (o[1] - s[1]) * u),
                      (b = y),
                      (_ = c - (c - s[0]) * roundCorner),
                      (m = b - (b - s[1]) * roundCorner),
                      r.setTripleAt(c, b, x, y, _, m, E),
                      (E += 1))
                  : (r.setTripleAt(
                      e.v[i][0],
                      e.v[i][1],
                      e.o[i][0],
                      e.o[i][1],
                      e.i[i][0],
                      e.i[i][1],
                      E
                    ),
                    (E += 1))
            return r
          }),
          (RoundCornersModifier.prototype.processShapes = function (e) {
            var t,
              r,
              i = this.shapes.length,
              n,
              s,
              a = this.rd.v
            if (a !== 0) {
              var l, o
              for (r = 0; r < i; r += 1) {
                if (
                  ((l = this.shapes[r]),
                  (o = l.localShapeCollection),
                  !(!l.shape._mdf && !this._mdf && !e))
                )
                  for (
                    o.releaseShapes(),
                      l.shape._mdf = !0,
                      t = l.shape.paths.shapes,
                      s = l.shape.paths._length,
                      n = 0;
                    n < s;
                    n += 1
                  )
                    o.addShape(this.processPath(t[n], a))
                l.shape.paths = l.localShapeCollection
              }
            }
            this.dynamicProperties.length || (this._mdf = !1)
          })
        function floatEqual(e, t) {
          return Math.abs(e - t) * 1e5 <= Math.min(Math.abs(e), Math.abs(t))
        }
        function floatZero(e) {
          return Math.abs(e) <= 1e-5
        }
        function lerp(e, t, r) {
          return e * (1 - r) + t * r
        }
        function lerpPoint(e, t, r) {
          return [lerp(e[0], t[0], r), lerp(e[1], t[1], r)]
        }
        function quadRoots(e, t, r) {
          if (e === 0) return []
          var i = t * t - 4 * e * r
          if (i < 0) return []
          var n = -t / (2 * e)
          if (i === 0) return [n]
          var s = Math.sqrt(i) / (2 * e)
          return [n - s, n + s]
        }
        function polynomialCoefficients(e, t, r, i) {
          return [-e + 3 * t - 3 * r + i, 3 * e - 6 * t + 3 * r, -3 * e + 3 * t, e]
        }
        function singlePoint(e) {
          return new PolynomialBezier(e, e, e, e, !1)
        }
        function PolynomialBezier(e, t, r, i, n) {
          n && pointEqual(e, t) && (t = lerpPoint(e, i, 1 / 3)),
            n && pointEqual(r, i) && (r = lerpPoint(e, i, 2 / 3))
          var s = polynomialCoefficients(e[0], t[0], r[0], i[0]),
            a = polynomialCoefficients(e[1], t[1], r[1], i[1])
          ;(this.a = [s[0], a[0]]),
            (this.b = [s[1], a[1]]),
            (this.c = [s[2], a[2]]),
            (this.d = [s[3], a[3]]),
            (this.points = [e, t, r, i])
        }
        ;(PolynomialBezier.prototype.point = function (e) {
          return [
            ((this.a[0] * e + this.b[0]) * e + this.c[0]) * e + this.d[0],
            ((this.a[1] * e + this.b[1]) * e + this.c[1]) * e + this.d[1]
          ]
        }),
          (PolynomialBezier.prototype.derivative = function (e) {
            return [
              (3 * e * this.a[0] + 2 * this.b[0]) * e + this.c[0],
              (3 * e * this.a[1] + 2 * this.b[1]) * e + this.c[1]
            ]
          }),
          (PolynomialBezier.prototype.tangentAngle = function (e) {
            var t = this.derivative(e)
            return Math.atan2(t[1], t[0])
          }),
          (PolynomialBezier.prototype.normalAngle = function (e) {
            var t = this.derivative(e)
            return Math.atan2(t[0], t[1])
          }),
          (PolynomialBezier.prototype.inflectionPoints = function () {
            var e = this.a[1] * this.b[0] - this.a[0] * this.b[1]
            if (floatZero(e)) return []
            var t = (-0.5 * (this.a[1] * this.c[0] - this.a[0] * this.c[1])) / e,
              r = t * t - ((1 / 3) * (this.b[1] * this.c[0] - this.b[0] * this.c[1])) / e
            if (r < 0) return []
            var i = Math.sqrt(r)
            return floatZero(i)
              ? i > 0 && i < 1
                ? [t]
                : []
              : [t - i, t + i].filter(function (n) {
                  return n > 0 && n < 1
                })
          }),
          (PolynomialBezier.prototype.split = function (e) {
            if (e <= 0) return [singlePoint(this.points[0]), this]
            if (e >= 1) return [this, singlePoint(this.points[this.points.length - 1])]
            var t = lerpPoint(this.points[0], this.points[1], e),
              r = lerpPoint(this.points[1], this.points[2], e),
              i = lerpPoint(this.points[2], this.points[3], e),
              n = lerpPoint(t, r, e),
              s = lerpPoint(r, i, e),
              a = lerpPoint(n, s, e)
            return [
              new PolynomialBezier(this.points[0], t, n, a, !0),
              new PolynomialBezier(a, s, i, this.points[3], !0)
            ]
          })
        function extrema(e, t) {
          var r = e.points[0][t],
            i = e.points[e.points.length - 1][t]
          if (r > i) {
            var n = i
            ;(i = r), (r = n)
          }
          for (var s = quadRoots(3 * e.a[t], 2 * e.b[t], e.c[t]), a = 0; a < s.length; a += 1)
            if (s[a] > 0 && s[a] < 1) {
              var l = e.point(s[a])[t]
              l < r ? (r = l) : l > i && (i = l)
            }
          return { min: r, max: i }
        }
        ;(PolynomialBezier.prototype.bounds = function () {
          return { x: extrema(this, 0), y: extrema(this, 1) }
        }),
          (PolynomialBezier.prototype.boundingBox = function () {
            var e = this.bounds()
            return {
              left: e.x.min,
              right: e.x.max,
              top: e.y.min,
              bottom: e.y.max,
              width: e.x.max - e.x.min,
              height: e.y.max - e.y.min,
              cx: (e.x.max + e.x.min) / 2,
              cy: (e.y.max + e.y.min) / 2
            }
          })
        function intersectData(e, t, r) {
          var i = e.boundingBox()
          return {
            cx: i.cx,
            cy: i.cy,
            width: i.width,
            height: i.height,
            bez: e,
            t: (t + r) / 2,
            t1: t,
            t2: r
          }
        }
        function splitData(e) {
          var t = e.bez.split(0.5)
          return [intersectData(t[0], e.t1, e.t), intersectData(t[1], e.t, e.t2)]
        }
        function boxIntersect(e, t) {
          return (
            Math.abs(e.cx - t.cx) * 2 < e.width + t.width &&
            Math.abs(e.cy - t.cy) * 2 < e.height + t.height
          )
        }
        function intersectsImpl(e, t, r, i, n, s) {
          if (boxIntersect(e, t)) {
            if (r >= s || (e.width <= i && e.height <= i && t.width <= i && t.height <= i)) {
              n.push([e.t, t.t])
              return
            }
            var a = splitData(e),
              l = splitData(t)
            intersectsImpl(a[0], l[0], r + 1, i, n, s),
              intersectsImpl(a[0], l[1], r + 1, i, n, s),
              intersectsImpl(a[1], l[0], r + 1, i, n, s),
              intersectsImpl(a[1], l[1], r + 1, i, n, s)
          }
        }
        ;(PolynomialBezier.prototype.intersections = function (e, t, r) {
          t === void 0 && (t = 2), r === void 0 && (r = 7)
          var i = []
          return intersectsImpl(intersectData(this, 0, 1), intersectData(e, 0, 1), 0, t, i, r), i
        }),
          (PolynomialBezier.shapeSegment = function (e, t) {
            var r = (t + 1) % e.length()
            return new PolynomialBezier(e.v[t], e.o[t], e.i[r], e.v[r], !0)
          }),
          (PolynomialBezier.shapeSegmentInverted = function (e, t) {
            var r = (t + 1) % e.length()
            return new PolynomialBezier(e.v[r], e.i[r], e.o[t], e.v[t], !0)
          })
        function crossProduct(e, t) {
          return [e[1] * t[2] - e[2] * t[1], e[2] * t[0] - e[0] * t[2], e[0] * t[1] - e[1] * t[0]]
        }
        function lineIntersection(e, t, r, i) {
          var n = [e[0], e[1], 1],
            s = [t[0], t[1], 1],
            a = [r[0], r[1], 1],
            l = [i[0], i[1], 1],
            o = crossProduct(crossProduct(n, s), crossProduct(a, l))
          return floatZero(o[2]) ? null : [o[0] / o[2], o[1] / o[2]]
        }
        function polarOffset(e, t, r) {
          return [e[0] + Math.cos(t) * r, e[1] - Math.sin(t) * r]
        }
        function pointDistance(e, t) {
          return Math.hypot(e[0] - t[0], e[1] - t[1])
        }
        function pointEqual(e, t) {
          return floatEqual(e[0], t[0]) && floatEqual(e[1], t[1])
        }
        function ZigZagModifier() {}
        extendPrototype([ShapeModifier], ZigZagModifier),
          (ZigZagModifier.prototype.initModifierProperties = function (e, t) {
            ;(this.getValue = this.processKeys),
              (this.amplitude = PropertyFactory.getProp(e, t.s, 0, null, this)),
              (this.frequency = PropertyFactory.getProp(e, t.r, 0, null, this)),
              (this.pointsType = PropertyFactory.getProp(e, t.pt, 0, null, this)),
              (this._isAnimated =
                this.amplitude.effectsSequence.length !== 0 ||
                this.frequency.effectsSequence.length !== 0 ||
                this.pointsType.effectsSequence.length !== 0)
          })
        function setPoint(e, t, r, i, n, s, a) {
          var l = r - Math.PI / 2,
            o = r + Math.PI / 2,
            f = t[0] + Math.cos(r) * i * n,
            u = t[1] - Math.sin(r) * i * n
          e.setTripleAt(
            f,
            u,
            f + Math.cos(l) * s,
            u - Math.sin(l) * s,
            f + Math.cos(o) * a,
            u - Math.sin(o) * a,
            e.length()
          )
        }
        function getPerpendicularVector(e, t) {
          var r = [t[0] - e[0], t[1] - e[1]],
            i = -Math.PI * 0.5,
            n = [Math.cos(i) * r[0] - Math.sin(i) * r[1], Math.sin(i) * r[0] + Math.cos(i) * r[1]]
          return n
        }
        function getProjectingAngle(e, t) {
          var r = t === 0 ? e.length() - 1 : t - 1,
            i = (t + 1) % e.length(),
            n = e.v[r],
            s = e.v[i],
            a = getPerpendicularVector(n, s)
          return Math.atan2(0, 1) - Math.atan2(a[1], a[0])
        }
        function zigZagCorner(e, t, r, i, n, s, a) {
          var l = getProjectingAngle(t, r),
            o = t.v[r % t._length],
            f = t.v[r === 0 ? t._length - 1 : r - 1],
            u = t.v[(r + 1) % t._length],
            E = s === 2 ? Math.sqrt(Math.pow(o[0] - f[0], 2) + Math.pow(o[1] - f[1], 2)) : 0,
            c = s === 2 ? Math.sqrt(Math.pow(o[0] - u[0], 2) + Math.pow(o[1] - u[1], 2)) : 0
          setPoint(e, t.v[r % t._length], l, a, i, c / ((n + 1) * 2), E / ((n + 1) * 2))
        }
        function zigZagSegment(e, t, r, i, n, s) {
          for (var a = 0; a < i; a += 1) {
            var l = (a + 1) / (i + 1),
              o =
                n === 2
                  ? Math.sqrt(
                      Math.pow(t.points[3][0] - t.points[0][0], 2) +
                        Math.pow(t.points[3][1] - t.points[0][1], 2)
                    )
                  : 0,
              f = t.normalAngle(l),
              u = t.point(l)
            setPoint(e, u, f, s, r, o / ((i + 1) * 2), o / ((i + 1) * 2)), (s = -s)
          }
          return s
        }
        ;(ZigZagModifier.prototype.processPath = function (e, t, r, i) {
          var n = e._length,
            s = shapePool.newElement()
          if (((s.c = e.c), e.c || (n -= 1), n === 0)) return s
          var a = -1,
            l = PolynomialBezier.shapeSegment(e, 0)
          zigZagCorner(s, e, 0, t, r, i, a)
          for (var o = 0; o < n; o += 1)
            (a = zigZagSegment(s, l, t, r, i, -a)),
              o === n - 1 && !e.c
                ? (l = null)
                : (l = PolynomialBezier.shapeSegment(e, (o + 1) % n)),
              zigZagCorner(s, e, o + 1, t, r, i, a)
          return s
        }),
          (ZigZagModifier.prototype.processShapes = function (e) {
            var t,
              r,
              i = this.shapes.length,
              n,
              s,
              a = this.amplitude.v,
              l = Math.max(0, Math.round(this.frequency.v)),
              o = this.pointsType.v
            if (a !== 0) {
              var f, u
              for (r = 0; r < i; r += 1) {
                if (
                  ((f = this.shapes[r]),
                  (u = f.localShapeCollection),
                  !(!f.shape._mdf && !this._mdf && !e))
                )
                  for (
                    u.releaseShapes(),
                      f.shape._mdf = !0,
                      t = f.shape.paths.shapes,
                      s = f.shape.paths._length,
                      n = 0;
                    n < s;
                    n += 1
                  )
                    u.addShape(this.processPath(t[n], a, l, o))
                f.shape.paths = f.localShapeCollection
              }
            }
            this.dynamicProperties.length || (this._mdf = !1)
          })
        function linearOffset(e, t, r) {
          var i = Math.atan2(t[0] - e[0], t[1] - e[1])
          return [polarOffset(e, i, r), polarOffset(t, i, r)]
        }
        function offsetSegment(e, t) {
          var r, i, n, s, a, l, o
          ;(o = linearOffset(e.points[0], e.points[1], t)),
            (r = o[0]),
            (i = o[1]),
            (o = linearOffset(e.points[1], e.points[2], t)),
            (n = o[0]),
            (s = o[1]),
            (o = linearOffset(e.points[2], e.points[3], t)),
            (a = o[0]),
            (l = o[1])
          var f = lineIntersection(r, i, n, s)
          f === null && (f = i)
          var u = lineIntersection(a, l, n, s)
          return u === null && (u = a), new PolynomialBezier(r, f, u, l)
        }
        function joinLines(e, t, r, i, n) {
          var s = t.points[3],
            a = r.points[0]
          if (i === 3 || pointEqual(s, a)) return s
          if (i === 2) {
            var l = -t.tangentAngle(1),
              o = -r.tangentAngle(0) + Math.PI,
              f = lineIntersection(
                s,
                polarOffset(s, l + Math.PI / 2, 100),
                a,
                polarOffset(a, l + Math.PI / 2, 100)
              ),
              u = f ? pointDistance(f, s) : pointDistance(s, a) / 2,
              E = polarOffset(s, l, 2 * u * roundCorner)
            return (
              e.setXYAt(E[0], E[1], 'o', e.length() - 1),
              (E = polarOffset(a, o, 2 * u * roundCorner)),
              e.setTripleAt(a[0], a[1], a[0], a[1], E[0], E[1], e.length()),
              a
            )
          }
          var c = pointEqual(s, t.points[2]) ? t.points[0] : t.points[2],
            b = pointEqual(a, r.points[1]) ? r.points[3] : r.points[1],
            x = lineIntersection(c, s, a, b)
          return x && pointDistance(x, s) < n
            ? (e.setTripleAt(x[0], x[1], x[0], x[1], x[0], x[1], e.length()), x)
            : s
        }
        function getIntersection(e, t) {
          var r = e.intersections(t)
          return r.length && floatEqual(r[0][0], 1) && r.shift(), r.length ? r[0] : null
        }
        function pruneSegmentIntersection(e, t) {
          var r = e.slice(),
            i = t.slice(),
            n = getIntersection(e[e.length - 1], t[0])
          return (
            n && ((r[e.length - 1] = e[e.length - 1].split(n[0])[0]), (i[0] = t[0].split(n[1])[1])),
            e.length > 1 && t.length > 1 && ((n = getIntersection(e[0], t[t.length - 1])), n)
              ? [[e[0].split(n[0])[0]], [t[t.length - 1].split(n[1])[1]]]
              : [r, i]
          )
        }
        function pruneIntersections(e) {
          for (var t, r = 1; r < e.length; r += 1)
            (t = pruneSegmentIntersection(e[r - 1], e[r])), (e[r - 1] = t[0]), (e[r] = t[1])
          return (
            e.length > 1 &&
              ((t = pruneSegmentIntersection(e[e.length - 1], e[0])),
              (e[e.length - 1] = t[0]),
              (e[0] = t[1])),
            e
          )
        }
        function offsetSegmentSplit(e, t) {
          var r = e.inflectionPoints(),
            i,
            n,
            s,
            a
          if (r.length === 0) return [offsetSegment(e, t)]
          if (r.length === 1 || floatEqual(r[1], 1))
            return (
              (s = e.split(r[0])),
              (i = s[0]),
              (n = s[1]),
              [offsetSegment(i, t), offsetSegment(n, t)]
            )
          ;(s = e.split(r[0])), (i = s[0])
          var l = (r[1] - r[0]) / (1 - r[0])
          return (
            (s = s[1].split(l)),
            (a = s[0]),
            (n = s[1]),
            [offsetSegment(i, t), offsetSegment(a, t), offsetSegment(n, t)]
          )
        }
        function OffsetPathModifier() {}
        extendPrototype([ShapeModifier], OffsetPathModifier),
          (OffsetPathModifier.prototype.initModifierProperties = function (e, t) {
            ;(this.getValue = this.processKeys),
              (this.amount = PropertyFactory.getProp(e, t.a, 0, null, this)),
              (this.miterLimit = PropertyFactory.getProp(e, t.ml, 0, null, this)),
              (this.lineJoin = t.lj),
              (this._isAnimated = this.amount.effectsSequence.length !== 0)
          }),
          (OffsetPathModifier.prototype.processPath = function (e, t, r, i) {
            var n = shapePool.newElement()
            n.c = e.c
            var s = e.length()
            e.c || (s -= 1)
            var a,
              l,
              o,
              f = []
            for (a = 0; a < s; a += 1)
              (o = PolynomialBezier.shapeSegment(e, a)), f.push(offsetSegmentSplit(o, t))
            if (!e.c)
              for (a = s - 1; a >= 0; a -= 1)
                (o = PolynomialBezier.shapeSegmentInverted(e, a)), f.push(offsetSegmentSplit(o, t))
            f = pruneIntersections(f)
            var u = null,
              E = null
            for (a = 0; a < f.length; a += 1) {
              var c = f[a]
              for (
                E && (u = joinLines(n, E, c[0], r, i)), E = c[c.length - 1], l = 0;
                l < c.length;
                l += 1
              )
                (o = c[l]),
                  u && pointEqual(o.points[0], u)
                    ? n.setXYAt(o.points[1][0], o.points[1][1], 'o', n.length() - 1)
                    : n.setTripleAt(
                        o.points[0][0],
                        o.points[0][1],
                        o.points[1][0],
                        o.points[1][1],
                        o.points[0][0],
                        o.points[0][1],
                        n.length()
                      ),
                  n.setTripleAt(
                    o.points[3][0],
                    o.points[3][1],
                    o.points[3][0],
                    o.points[3][1],
                    o.points[2][0],
                    o.points[2][1],
                    n.length()
                  ),
                  (u = o.points[3])
            }
            return f.length && joinLines(n, E, f[0][0], r, i), n
          }),
          (OffsetPathModifier.prototype.processShapes = function (e) {
            var t,
              r,
              i = this.shapes.length,
              n,
              s,
              a = this.amount.v,
              l = this.miterLimit.v,
              o = this.lineJoin
            if (a !== 0) {
              var f, u
              for (r = 0; r < i; r += 1) {
                if (
                  ((f = this.shapes[r]),
                  (u = f.localShapeCollection),
                  !(!f.shape._mdf && !this._mdf && !e))
                )
                  for (
                    u.releaseShapes(),
                      f.shape._mdf = !0,
                      t = f.shape.paths.shapes,
                      s = f.shape.paths._length,
                      n = 0;
                    n < s;
                    n += 1
                  )
                    u.addShape(this.processPath(t[n], a, o, l))
                f.shape.paths = f.localShapeCollection
              }
            }
            this.dynamicProperties.length || (this._mdf = !1)
          })
        function getFontProperties(e) {
          for (
            var t = e.fStyle ? e.fStyle.split(' ') : [],
              r = 'normal',
              i = 'normal',
              n = t.length,
              s,
              a = 0;
            a < n;
            a += 1
          )
            switch (((s = t[a].toLowerCase()), s)) {
              case 'italic':
                i = 'italic'
                break
              case 'bold':
                r = '700'
                break
              case 'black':
                r = '900'
                break
              case 'medium':
                r = '500'
                break
              case 'regular':
              case 'normal':
                r = '400'
                break
              case 'light':
              case 'thin':
                r = '200'
                break
            }
          return { style: i, weight: e.fWeight || r }
        }
        var FontManager = (function () {
          var e = 5e3,
            t = { w: 0, size: 0, shapes: [], data: { shapes: [] } },
            r = []
          r = r.concat([
            2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368, 2369, 2370, 2371,
            2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381, 2382, 2383, 2387, 2388,
            2389, 2390, 2391, 2402, 2403
          ])
          var i = 127988,
            n = 917631,
            s = 917601,
            a = 917626,
            l = 65039,
            o = 8205,
            f = 127462,
            u = 127487,
            E = ['d83cdffb', 'd83cdffc', 'd83cdffd', 'd83cdffe', 'd83cdfff']
          function c(B) {
            var T = B.split(','),
              j,
              S = T.length,
              R = []
            for (j = 0; j < S; j += 1) T[j] !== 'sans-serif' && T[j] !== 'monospace' && R.push(T[j])
            return R.join(',')
          }
          function b(B, T) {
            var j = createTag('span')
            j.setAttribute('aria-hidden', !0), (j.style.fontFamily = T)
            var S = createTag('span')
            ;(S.innerText = 'giItT1WQy@!-/#'),
              (j.style.position = 'absolute'),
              (j.style.left = '-10000px'),
              (j.style.top = '-10000px'),
              (j.style.fontSize = '300px'),
              (j.style.fontVariant = 'normal'),
              (j.style.fontStyle = 'normal'),
              (j.style.fontWeight = 'normal'),
              (j.style.letterSpacing = '0'),
              j.appendChild(S),
              document.body.appendChild(j)
            var R = S.offsetWidth
            return (S.style.fontFamily = c(B) + ', ' + T), { node: S, w: R, parent: j }
          }
          function x() {
            var B,
              T = this.fonts.length,
              j,
              S,
              R = T
            for (B = 0; B < T; B += 1)
              this.fonts[B].loaded
                ? (R -= 1)
                : this.fonts[B].fOrigin === 'n' || this.fonts[B].origin === 0
                  ? (this.fonts[B].loaded = !0)
                  : ((j = this.fonts[B].monoCase.node),
                    (S = this.fonts[B].monoCase.w),
                    j.offsetWidth !== S
                      ? ((R -= 1), (this.fonts[B].loaded = !0))
                      : ((j = this.fonts[B].sansCase.node),
                        (S = this.fonts[B].sansCase.w),
                        j.offsetWidth !== S && ((R -= 1), (this.fonts[B].loaded = !0))),
                    this.fonts[B].loaded &&
                      (this.fonts[B].sansCase.parent.parentNode.removeChild(
                        this.fonts[B].sansCase.parent
                      ),
                      this.fonts[B].monoCase.parent.parentNode.removeChild(
                        this.fonts[B].monoCase.parent
                      )))
            R !== 0 && Date.now() - this.initTime < e
              ? setTimeout(this.checkLoadedFontsBinded, 20)
              : setTimeout(this.setIsLoadedBinded, 10)
          }
          function y(B, T) {
            var j = document.body && T ? 'svg' : 'canvas',
              S,
              R = getFontProperties(B)
            if (j === 'svg') {
              var V = createNS('text')
              ;(V.style.fontSize = '100px'),
                V.setAttribute('font-family', B.fFamily),
                V.setAttribute('font-style', R.style),
                V.setAttribute('font-weight', R.weight),
                (V.textContent = '1'),
                B.fClass
                  ? ((V.style.fontFamily = 'inherit'), V.setAttribute('class', B.fClass))
                  : (V.style.fontFamily = B.fFamily),
                T.appendChild(V),
                (S = V)
            } else {
              var K = new OffscreenCanvas(500, 500).getContext('2d')
              ;(K.font = R.style + ' ' + R.weight + ' 100px ' + B.fFamily), (S = K)
            }
            function re(ne) {
              return j === 'svg'
                ? ((S.textContent = ne), S.getComputedTextLength())
                : S.measureText(ne).width
            }
            return { measureText: re }
          }
          function _(B, T) {
            if (!B) {
              this.isLoaded = !0
              return
            }
            if (this.chars) {
              ;(this.isLoaded = !0), (this.fonts = B.list)
              return
            }
            if (!document.body) {
              ;(this.isLoaded = !0),
                B.list.forEach(function (de) {
                  ;(de.helper = y(de)), (de.cache = {})
                }),
                (this.fonts = B.list)
              return
            }
            var j = B.list,
              S,
              R = j.length,
              V = R
            for (S = 0; S < R; S += 1) {
              var K = !0,
                re,
                ne
              if (
                ((j[S].loaded = !1),
                (j[S].monoCase = b(j[S].fFamily, 'monospace')),
                (j[S].sansCase = b(j[S].fFamily, 'sans-serif')),
                !j[S].fPath)
              )
                (j[S].loaded = !0), (V -= 1)
              else if (j[S].fOrigin === 'p' || j[S].origin === 3) {
                if (
                  ((re = document.querySelectorAll(
                    'style[f-forigin="p"][f-family="' +
                      j[S].fFamily +
                      '"], style[f-origin="3"][f-family="' +
                      j[S].fFamily +
                      '"]'
                  )),
                  re.length > 0 && (K = !1),
                  K)
                ) {
                  var oe = createTag('style')
                  oe.setAttribute('f-forigin', j[S].fOrigin),
                    oe.setAttribute('f-origin', j[S].origin),
                    oe.setAttribute('f-family', j[S].fFamily),
                    (oe.type = 'text/css'),
                    (oe.innerText =
                      '@font-face {font-family: ' +
                      j[S].fFamily +
                      "; font-style: normal; src: url('" +
                      j[S].fPath +
                      "');}"),
                    T.appendChild(oe)
                }
              } else if (j[S].fOrigin === 'g' || j[S].origin === 1) {
                for (
                  re = document.querySelectorAll('link[f-forigin="g"], link[f-origin="1"]'), ne = 0;
                  ne < re.length;
                  ne += 1
                )
                  re[ne].href.indexOf(j[S].fPath) !== -1 && (K = !1)
                if (K) {
                  var ae = createTag('link')
                  ae.setAttribute('f-forigin', j[S].fOrigin),
                    ae.setAttribute('f-origin', j[S].origin),
                    (ae.type = 'text/css'),
                    (ae.rel = 'stylesheet'),
                    (ae.href = j[S].fPath),
                    document.body.appendChild(ae)
                }
              } else if (j[S].fOrigin === 't' || j[S].origin === 2) {
                for (
                  re = document.querySelectorAll('script[f-forigin="t"], script[f-origin="2"]'),
                    ne = 0;
                  ne < re.length;
                  ne += 1
                )
                  j[S].fPath === re[ne].src && (K = !1)
                if (K) {
                  var ce = createTag('link')
                  ce.setAttribute('f-forigin', j[S].fOrigin),
                    ce.setAttribute('f-origin', j[S].origin),
                    ce.setAttribute('rel', 'stylesheet'),
                    ce.setAttribute('href', j[S].fPath),
                    T.appendChild(ce)
                }
              }
              ;(j[S].helper = y(j[S], T)), (j[S].cache = {}), this.fonts.push(j[S])
            }
            V === 0 ? (this.isLoaded = !0) : setTimeout(this.checkLoadedFonts.bind(this), 100)
          }
          function m(B) {
            if (B) {
              this.chars || (this.chars = [])
              var T,
                j = B.length,
                S,
                R = this.chars.length,
                V
              for (T = 0; T < j; T += 1) {
                for (S = 0, V = !1; S < R; )
                  this.chars[S].style === B[T].style &&
                    this.chars[S].fFamily === B[T].fFamily &&
                    this.chars[S].ch === B[T].ch &&
                    (V = !0),
                    (S += 1)
                V || (this.chars.push(B[T]), (R += 1))
              }
            }
          }
          function A(B, T, j) {
            for (var S = 0, R = this.chars.length; S < R; ) {
              if (
                this.chars[S].ch === B &&
                this.chars[S].style === T &&
                this.chars[S].fFamily === j
              )
                return this.chars[S]
              S += 1
            }
            return (
              ((typeof B == 'string' && B.charCodeAt(0) !== 13) || !B) &&
                console &&
                console.warn &&
                !this._warned &&
                ((this._warned = !0),
                console.warn('Missing character from exported characters list: ', B, T, j)),
              t
            )
          }
          function d(B, T, j) {
            var S = this.getFontByName(T),
              R = B
            if (!S.cache[R]) {
              var V = S.helper
              if (B === ' ') {
                var K = V.measureText('|' + B + '|'),
                  re = V.measureText('||')
                S.cache[R] = (K - re) / 100
              } else S.cache[R] = V.measureText(B) / 100
            }
            return S.cache[R] * j
          }
          function g(B) {
            for (var T = 0, j = this.fonts.length; T < j; ) {
              if (this.fonts[T].fName === B) return this.fonts[T]
              T += 1
            }
            return this.fonts[0]
          }
          function C(B) {
            var T = 0,
              j = B.charCodeAt(0)
            if (j >= 55296 && j <= 56319) {
              var S = B.charCodeAt(1)
              S >= 56320 && S <= 57343 && (T = (j - 55296) * 1024 + S - 56320 + 65536)
            }
            return T
          }
          function P(B, T) {
            var j = B.toString(16) + T.toString(16)
            return E.indexOf(j) !== -1
          }
          function k(B) {
            return B === o
          }
          function M(B) {
            return B === l
          }
          function D(B) {
            var T = C(B)
            return T >= f && T <= u
          }
          function W(B) {
            return D(B.substr(0, 2)) && D(B.substr(2, 2))
          }
          function H(B) {
            return r.indexOf(B) !== -1
          }
          function $(B, T) {
            var j = C(B.substr(T, 2))
            if (j !== i) return !1
            var S = 0
            for (T += 2; S < 5; ) {
              if (((j = C(B.substr(T, 2))), j < s || j > a)) return !1
              ;(S += 1), (T += 2)
            }
            return C(B.substr(T, 2)) === n
          }
          function Z() {
            this.isLoaded = !0
          }
          var Y = function () {
            ;(this.fonts = []),
              (this.chars = null),
              (this.typekitLoaded = 0),
              (this.isLoaded = !1),
              (this._warned = !1),
              (this.initTime = Date.now()),
              (this.setIsLoadedBinded = this.setIsLoaded.bind(this)),
              (this.checkLoadedFontsBinded = this.checkLoadedFonts.bind(this))
          }
          ;(Y.isModifier = P),
            (Y.isZeroWidthJoiner = k),
            (Y.isFlagEmoji = W),
            (Y.isRegionalCode = D),
            (Y.isCombinedCharacter = H),
            (Y.isRegionalFlag = $),
            (Y.isVariationSelector = M),
            (Y.BLACK_FLAG_CODE_POINT = i)
          var L = {
            addChars: m,
            addFonts: _,
            getCharData: A,
            getFontByName: g,
            measureText: d,
            checkLoadedFonts: x,
            setIsLoaded: Z
          }
          return (Y.prototype = L), Y
        })()
        function SlotManager(e) {
          this.animationData = e
        }
        SlotManager.prototype.getProp = function (e) {
          return this.animationData.slots && this.animationData.slots[e.sid]
            ? Object.assign(e, this.animationData.slots[e.sid].p)
            : e
        }
        function slotFactory(e) {
          return new SlotManager(e)
        }
        function RenderableElement() {}
        RenderableElement.prototype = {
          initRenderable: function () {
            ;(this.isInRange = !1),
              (this.hidden = !1),
              (this.isTransparent = !1),
              (this.renderableComponents = [])
          },
          addRenderableComponent: function (t) {
            this.renderableComponents.indexOf(t) === -1 && this.renderableComponents.push(t)
          },
          removeRenderableComponent: function (t) {
            this.renderableComponents.indexOf(t) !== -1 &&
              this.renderableComponents.splice(this.renderableComponents.indexOf(t), 1)
          },
          prepareRenderableFrame: function (t) {
            this.checkLayerLimits(t)
          },
          checkTransparency: function () {
            this.finalTransform.mProp.o.v <= 0
              ? !this.isTransparent &&
                this.globalData.renderConfig.hideOnTransparent &&
                ((this.isTransparent = !0), this.hide())
              : this.isTransparent && ((this.isTransparent = !1), this.show())
          },
          checkLayerLimits: function (t) {
            this.data.ip - this.data.st <= t && this.data.op - this.data.st > t
              ? this.isInRange !== !0 &&
                ((this.globalData._mdf = !0), (this._mdf = !0), (this.isInRange = !0), this.show())
              : this.isInRange !== !1 &&
                ((this.globalData._mdf = !0), (this.isInRange = !1), this.hide())
          },
          renderRenderable: function () {
            var t,
              r = this.renderableComponents.length
            for (t = 0; t < r; t += 1) this.renderableComponents[t].renderFrame(this._isFirstFrame)
          },
          sourceRectAtTime: function () {
            return { top: 0, left: 0, width: 100, height: 100 }
          },
          getLayerSize: function () {
            return this.data.ty === 5
              ? { w: this.data.textData.width, h: this.data.textData.height }
              : { w: this.data.width, h: this.data.height }
          }
        }
        var getBlendMode = (function () {
          var e = {
            0: 'source-over',
            1: 'multiply',
            2: 'screen',
            3: 'overlay',
            4: 'darken',
            5: 'lighten',
            6: 'color-dodge',
            7: 'color-burn',
            8: 'hard-light',
            9: 'soft-light',
            10: 'difference',
            11: 'exclusion',
            12: 'hue',
            13: 'saturation',
            14: 'color',
            15: 'luminosity'
          }
          return function (t) {
            return e[t] || ''
          }
        })()
        function SliderEffect(e, t, r) {
          this.p = PropertyFactory.getProp(t, e.v, 0, 0, r)
        }
        function AngleEffect(e, t, r) {
          this.p = PropertyFactory.getProp(t, e.v, 0, 0, r)
        }
        function ColorEffect(e, t, r) {
          this.p = PropertyFactory.getProp(t, e.v, 1, 0, r)
        }
        function PointEffect(e, t, r) {
          this.p = PropertyFactory.getProp(t, e.v, 1, 0, r)
        }
        function LayerIndexEffect(e, t, r) {
          this.p = PropertyFactory.getProp(t, e.v, 0, 0, r)
        }
        function MaskIndexEffect(e, t, r) {
          this.p = PropertyFactory.getProp(t, e.v, 0, 0, r)
        }
        function CheckboxEffect(e, t, r) {
          this.p = PropertyFactory.getProp(t, e.v, 0, 0, r)
        }
        function NoValueEffect() {
          this.p = {}
        }
        function EffectsManager(e, t) {
          var r = e.ef || []
          this.effectElements = []
          var i,
            n = r.length,
            s
          for (i = 0; i < n; i += 1) (s = new GroupEffect(r[i], t)), this.effectElements.push(s)
        }
        function GroupEffect(e, t) {
          this.init(e, t)
        }
        extendPrototype([DynamicPropertyContainer], GroupEffect),
          (GroupEffect.prototype.getValue = GroupEffect.prototype.iterateDynamicProperties),
          (GroupEffect.prototype.init = function (e, t) {
            ;(this.data = e), (this.effectElements = []), this.initDynamicPropertyContainer(t)
            var r,
              i = this.data.ef.length,
              n,
              s = this.data.ef
            for (r = 0; r < i; r += 1) {
              switch (((n = null), s[r].ty)) {
                case 0:
                  n = new SliderEffect(s[r], t, this)
                  break
                case 1:
                  n = new AngleEffect(s[r], t, this)
                  break
                case 2:
                  n = new ColorEffect(s[r], t, this)
                  break
                case 3:
                  n = new PointEffect(s[r], t, this)
                  break
                case 4:
                case 7:
                  n = new CheckboxEffect(s[r], t, this)
                  break
                case 10:
                  n = new LayerIndexEffect(s[r], t, this)
                  break
                case 11:
                  n = new MaskIndexEffect(s[r], t, this)
                  break
                case 5:
                  n = new EffectsManager(s[r], t)
                  break
                default:
                  n = new NoValueEffect(s[r])
                  break
              }
              n && this.effectElements.push(n)
            }
          })
        function BaseElement() {}
        BaseElement.prototype = {
          checkMasks: function () {
            if (!this.data.hasMask) return !1
            for (var t = 0, r = this.data.masksProperties.length; t < r; ) {
              if (
                this.data.masksProperties[t].mode !== 'n' &&
                this.data.masksProperties[t].cl !== !1
              )
                return !0
              t += 1
            }
            return !1
          },
          initExpressions: function () {
            var t = getExpressionInterfaces()
            if (t) {
              var r = t('layer'),
                i = t('effects'),
                n = t('shape'),
                s = t('text'),
                a = t('comp')
              ;(this.layerInterface = r(this)),
                this.data.hasMask &&
                  this.maskManager &&
                  this.layerInterface.registerMaskInterface(this.maskManager)
              var l = i.createEffectsInterface(this, this.layerInterface)
              this.layerInterface.registerEffectsInterface(l),
                this.data.ty === 0 || this.data.xt
                  ? (this.compInterface = a(this))
                  : this.data.ty === 4
                    ? ((this.layerInterface.shapeInterface = n(
                        this.shapesData,
                        this.itemsData,
                        this.layerInterface
                      )),
                      (this.layerInterface.content = this.layerInterface.shapeInterface))
                    : this.data.ty === 5 &&
                      ((this.layerInterface.textInterface = s(this)),
                      (this.layerInterface.text = this.layerInterface.textInterface))
            }
          },
          setBlendMode: function () {
            var t = getBlendMode(this.data.bm),
              r = this.baseElement || this.layerElement
            r.style['mix-blend-mode'] = t
          },
          initBaseData: function (t, r, i) {
            ;(this.globalData = r),
              (this.comp = i),
              (this.data = t),
              (this.layerId = createElementID()),
              this.data.sr || (this.data.sr = 1),
              (this.effectsManager = new EffectsManager(this.data, this, this.dynamicProperties))
          },
          getType: function () {
            return this.type
          },
          sourceRectAtTime: function () {}
        }
        function FrameElement() {}
        FrameElement.prototype = {
          initFrame: function () {
            ;(this._isFirstFrame = !1), (this.dynamicProperties = []), (this._mdf = !1)
          },
          prepareProperties: function (t, r) {
            var i,
              n = this.dynamicProperties.length
            for (i = 0; i < n; i += 1)
              (r || (this._isParent && this.dynamicProperties[i].propType === 'transform')) &&
                (this.dynamicProperties[i].getValue(),
                this.dynamicProperties[i]._mdf && ((this.globalData._mdf = !0), (this._mdf = !0)))
          },
          addDynamicProperty: function (t) {
            this.dynamicProperties.indexOf(t) === -1 && this.dynamicProperties.push(t)
          }
        }
        function FootageElement(e, t, r) {
          this.initFrame(),
            this.initRenderable(),
            (this.assetData = t.getAssetData(e.refId)),
            (this.footageData = t.imageLoader.getAsset(this.assetData)),
            this.initBaseData(e, t, r)
        }
        ;(FootageElement.prototype.prepareFrame = function () {}),
          extendPrototype([RenderableElement, BaseElement, FrameElement], FootageElement),
          (FootageElement.prototype.getBaseElement = function () {
            return null
          }),
          (FootageElement.prototype.renderFrame = function () {}),
          (FootageElement.prototype.destroy = function () {}),
          (FootageElement.prototype.initExpressions = function () {
            var e = getExpressionInterfaces()
            if (e) {
              var t = e('footage')
              this.layerInterface = t(this)
            }
          }),
          (FootageElement.prototype.getFootageData = function () {
            return this.footageData
          })
        function AudioElement(e, t, r) {
          this.initFrame(),
            this.initRenderable(),
            (this.assetData = t.getAssetData(e.refId)),
            this.initBaseData(e, t, r),
            (this._isPlaying = !1),
            (this._canPlay = !1)
          var i = this.globalData.getAssetsPath(this.assetData)
          ;(this.audio = this.globalData.audioController.createAudio(i)),
            (this._currentTime = 0),
            this.globalData.audioController.addAudio(this),
            (this._volumeMultiplier = 1),
            (this._volume = 1),
            (this._previousVolume = null),
            (this.tm = e.tm
              ? PropertyFactory.getProp(this, e.tm, 0, t.frameRate, this)
              : { _placeholder: !0 }),
            (this.lv = PropertyFactory.getProp(
              this,
              e.au && e.au.lv ? e.au.lv : { k: [100] },
              1,
              0.01,
              this
            ))
        }
        ;(AudioElement.prototype.prepareFrame = function (e) {
          if (
            (this.prepareRenderableFrame(e, !0),
            this.prepareProperties(e, !0),
            this.tm._placeholder)
          )
            this._currentTime = e / this.data.sr
          else {
            var t = this.tm.v
            this._currentTime = t
          }
          this._volume = this.lv.v[0]
          var r = this._volume * this._volumeMultiplier
          this._previousVolume !== r && ((this._previousVolume = r), this.audio.volume(r))
        }),
          extendPrototype([RenderableElement, BaseElement, FrameElement], AudioElement),
          (AudioElement.prototype.renderFrame = function () {
            this.isInRange &&
              this._canPlay &&
              (this._isPlaying
                ? (!this.audio.playing() ||
                    Math.abs(this._currentTime / this.globalData.frameRate - this.audio.seek()) >
                      0.1) &&
                  this.audio.seek(this._currentTime / this.globalData.frameRate)
                : (this.audio.play(),
                  this.audio.seek(this._currentTime / this.globalData.frameRate),
                  (this._isPlaying = !0)))
          }),
          (AudioElement.prototype.show = function () {}),
          (AudioElement.prototype.hide = function () {
            this.audio.pause(), (this._isPlaying = !1)
          }),
          (AudioElement.prototype.pause = function () {
            this.audio.pause(), (this._isPlaying = !1), (this._canPlay = !1)
          }),
          (AudioElement.prototype.resume = function () {
            this._canPlay = !0
          }),
          (AudioElement.prototype.setRate = function (e) {
            this.audio.rate(e)
          }),
          (AudioElement.prototype.volume = function (e) {
            ;(this._volumeMultiplier = e),
              (this._previousVolume = e * this._volume),
              this.audio.volume(this._previousVolume)
          }),
          (AudioElement.prototype.getBaseElement = function () {
            return null
          }),
          (AudioElement.prototype.destroy = function () {}),
          (AudioElement.prototype.sourceRectAtTime = function () {}),
          (AudioElement.prototype.initExpressions = function () {})
        function BaseRenderer() {}
        ;(BaseRenderer.prototype.checkLayers = function (e) {
          var t,
            r = this.layers.length,
            i
          for (this.completeLayers = !0, t = r - 1; t >= 0; t -= 1)
            this.elements[t] ||
              ((i = this.layers[t]),
              i.ip - i.st <= e - this.layers[t].st &&
                i.op - i.st > e - this.layers[t].st &&
                this.buildItem(t)),
              (this.completeLayers = this.elements[t] ? this.completeLayers : !1)
          this.checkPendingElements()
        }),
          (BaseRenderer.prototype.createItem = function (e) {
            switch (e.ty) {
              case 2:
                return this.createImage(e)
              case 0:
                return this.createComp(e)
              case 1:
                return this.createSolid(e)
              case 3:
                return this.createNull(e)
              case 4:
                return this.createShape(e)
              case 5:
                return this.createText(e)
              case 6:
                return this.createAudio(e)
              case 13:
                return this.createCamera(e)
              case 15:
                return this.createFootage(e)
              default:
                return this.createNull(e)
            }
          }),
          (BaseRenderer.prototype.createCamera = function () {
            throw new Error("You're using a 3d camera. Try the html renderer.")
          }),
          (BaseRenderer.prototype.createAudio = function (e) {
            return new AudioElement(e, this.globalData, this)
          }),
          (BaseRenderer.prototype.createFootage = function (e) {
            return new FootageElement(e, this.globalData, this)
          }),
          (BaseRenderer.prototype.buildAllItems = function () {
            var e,
              t = this.layers.length
            for (e = 0; e < t; e += 1) this.buildItem(e)
            this.checkPendingElements()
          }),
          (BaseRenderer.prototype.includeLayers = function (e) {
            this.completeLayers = !1
            var t,
              r = e.length,
              i,
              n = this.layers.length
            for (t = 0; t < r; t += 1)
              for (i = 0; i < n; ) {
                if (this.layers[i].id === e[t].id) {
                  this.layers[i] = e[t]
                  break
                }
                i += 1
              }
          }),
          (BaseRenderer.prototype.setProjectInterface = function (e) {
            this.globalData.projectInterface = e
          }),
          (BaseRenderer.prototype.initItems = function () {
            this.globalData.progressiveLoad || this.buildAllItems()
          }),
          (BaseRenderer.prototype.buildElementParenting = function (e, t, r) {
            for (var i = this.elements, n = this.layers, s = 0, a = n.length; s < a; )
              n[s].ind == t &&
                (!i[s] || i[s] === !0
                  ? (this.buildItem(s), this.addPendingElement(e))
                  : (r.push(i[s]),
                    i[s].setAsParent(),
                    n[s].parent !== void 0
                      ? this.buildElementParenting(e, n[s].parent, r)
                      : e.setHierarchy(r))),
                (s += 1)
          }),
          (BaseRenderer.prototype.addPendingElement = function (e) {
            this.pendingElements.push(e)
          }),
          (BaseRenderer.prototype.searchExtraCompositions = function (e) {
            var t,
              r = e.length
            for (t = 0; t < r; t += 1)
              if (e[t].xt) {
                var i = this.createComp(e[t])
                i.initExpressions(), this.globalData.projectInterface.registerComposition(i)
              }
          }),
          (BaseRenderer.prototype.getElementById = function (e) {
            var t,
              r = this.elements.length
            for (t = 0; t < r; t += 1) if (this.elements[t].data.ind === e) return this.elements[t]
            return null
          }),
          (BaseRenderer.prototype.getElementByPath = function (e) {
            var t = e.shift(),
              r
            if (typeof t == 'number') r = this.elements[t]
            else {
              var i,
                n = this.elements.length
              for (i = 0; i < n; i += 1)
                if (this.elements[i].data.nm === t) {
                  r = this.elements[i]
                  break
                }
            }
            return e.length === 0 ? r : r.getElementByPath(e)
          }),
          (BaseRenderer.prototype.setupGlobalData = function (e, t) {
            ;(this.globalData.fontManager = new FontManager()),
              (this.globalData.slotManager = slotFactory(e)),
              this.globalData.fontManager.addChars(e.chars),
              this.globalData.fontManager.addFonts(e.fonts, t),
              (this.globalData.getAssetData = this.animationItem.getAssetData.bind(
                this.animationItem
              )),
              (this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(
                this.animationItem
              )),
              (this.globalData.imageLoader = this.animationItem.imagePreloader),
              (this.globalData.audioController = this.animationItem.audioController),
              (this.globalData.frameId = 0),
              (this.globalData.frameRate = e.fr),
              (this.globalData.nm = e.nm),
              (this.globalData.compSize = { w: e.w, h: e.h })
          })
        var effectTypes = { TRANSFORM_EFFECT: 'transformEFfect' }
        function TransformElement() {}
        TransformElement.prototype = {
          initTransform: function () {
            var t = new Matrix()
            ;(this.finalTransform = {
              mProp: this.data.ks
                ? TransformPropertyFactory.getTransformProperty(this, this.data.ks, this)
                : { o: 0 },
              _matMdf: !1,
              _localMatMdf: !1,
              _opMdf: !1,
              mat: t,
              localMat: t,
              localOpacity: 1
            }),
              this.data.ao && (this.finalTransform.mProp.autoOriented = !0),
              this.data.ty
          },
          renderTransform: function () {
            if (
              ((this.finalTransform._opMdf =
                this.finalTransform.mProp.o._mdf || this._isFirstFrame),
              (this.finalTransform._matMdf = this.finalTransform.mProp._mdf || this._isFirstFrame),
              this.hierarchy)
            ) {
              var t,
                r = this.finalTransform.mat,
                i = 0,
                n = this.hierarchy.length
              if (!this.finalTransform._matMdf)
                for (; i < n; ) {
                  if (this.hierarchy[i].finalTransform.mProp._mdf) {
                    this.finalTransform._matMdf = !0
                    break
                  }
                  i += 1
                }
              if (this.finalTransform._matMdf)
                for (
                  t = this.finalTransform.mProp.v.props, r.cloneFromProps(t), i = 0;
                  i < n;
                  i += 1
                )
                  r.multiply(this.hierarchy[i].finalTransform.mProp.v)
            }
            this.finalTransform._matMdf &&
              (this.finalTransform._localMatMdf = this.finalTransform._matMdf),
              this.finalTransform._opMdf &&
                (this.finalTransform.localOpacity = this.finalTransform.mProp.o.v)
          },
          renderLocalTransform: function () {
            if (this.localTransforms) {
              var t = 0,
                r = this.localTransforms.length
              if (
                ((this.finalTransform._localMatMdf = this.finalTransform._matMdf),
                !this.finalTransform._localMatMdf || !this.finalTransform._opMdf)
              )
                for (; t < r; )
                  this.localTransforms[t]._mdf && (this.finalTransform._localMatMdf = !0),
                    this.localTransforms[t]._opMdf &&
                      !this.finalTransform._opMdf &&
                      ((this.finalTransform.localOpacity = this.finalTransform.mProp.o.v),
                      (this.finalTransform._opMdf = !0)),
                    (t += 1)
              if (this.finalTransform._localMatMdf) {
                var i = this.finalTransform.localMat
                for (this.localTransforms[0].matrix.clone(i), t = 1; t < r; t += 1) {
                  var n = this.localTransforms[t].matrix
                  i.multiply(n)
                }
                i.multiply(this.finalTransform.mat)
              }
              if (this.finalTransform._opMdf) {
                var s = this.finalTransform.localOpacity
                for (t = 0; t < r; t += 1) s *= this.localTransforms[t].opacity * 0.01
                this.finalTransform.localOpacity = s
              }
            }
          },
          searchEffectTransforms: function () {
            if (this.renderableEffectsManager) {
              var t = this.renderableEffectsManager.getEffects(effectTypes.TRANSFORM_EFFECT)
              if (t.length) {
                ;(this.localTransforms = []), (this.finalTransform.localMat = new Matrix())
                var r = 0,
                  i = t.length
                for (r = 0; r < i; r += 1) this.localTransforms.push(t[r])
              }
            }
          },
          globalToLocal: function (t) {
            var r = []
            r.push(this.finalTransform)
            for (var i = !0, n = this.comp; i; )
              n.finalTransform
                ? (n.data.hasMask && r.splice(0, 0, n.finalTransform), (n = n.comp))
                : (i = !1)
            var s,
              a = r.length,
              l
            for (s = 0; s < a; s += 1)
              (l = r[s].mat.applyToPointArray(0, 0, 0)), (t = [t[0] - l[0], t[1] - l[1], 0])
            return t
          },
          mHelper: new Matrix()
        }
        function MaskElement(e, t, r) {
          ;(this.data = e),
            (this.element = t),
            (this.globalData = r),
            (this.storedData = []),
            (this.masksProperties = this.data.masksProperties || []),
            (this.maskElement = null)
          var i = this.globalData.defs,
            n,
            s = this.masksProperties ? this.masksProperties.length : 0
          ;(this.viewData = createSizedArray(s)), (this.solidPath = '')
          var a,
            l = this.masksProperties,
            o = 0,
            f = [],
            u,
            E,
            c = createElementID(),
            b,
            x,
            y,
            _,
            m = 'clipPath',
            A = 'clip-path'
          for (n = 0; n < s; n += 1)
            if (
              (((l[n].mode !== 'a' && l[n].mode !== 'n') ||
                l[n].inv ||
                l[n].o.k !== 100 ||
                l[n].o.x) &&
                ((m = 'mask'), (A = 'mask')),
              (l[n].mode === 's' || l[n].mode === 'i') && o === 0
                ? ((b = createNS('rect')),
                  b.setAttribute('fill', '#ffffff'),
                  b.setAttribute('width', this.element.comp.data.w || 0),
                  b.setAttribute('height', this.element.comp.data.h || 0),
                  f.push(b))
                : (b = null),
              (a = createNS('path')),
              l[n].mode === 'n')
            )
              (this.viewData[n] = {
                op: PropertyFactory.getProp(this.element, l[n].o, 0, 0.01, this.element),
                prop: ShapePropertyFactory.getShapeProp(this.element, l[n], 3),
                elem: a,
                lastPath: ''
              }),
                i.appendChild(a)
            else {
              ;(o += 1),
                a.setAttribute('fill', l[n].mode === 's' ? '#000000' : '#ffffff'),
                a.setAttribute('clip-rule', 'nonzero')
              var d
              if (
                (l[n].x.k !== 0
                  ? ((m = 'mask'),
                    (A = 'mask'),
                    (_ = PropertyFactory.getProp(this.element, l[n].x, 0, null, this.element)),
                    (d = createElementID()),
                    (x = createNS('filter')),
                    x.setAttribute('id', d),
                    (y = createNS('feMorphology')),
                    y.setAttribute('operator', 'erode'),
                    y.setAttribute('in', 'SourceGraphic'),
                    y.setAttribute('radius', '0'),
                    x.appendChild(y),
                    i.appendChild(x),
                    a.setAttribute('stroke', l[n].mode === 's' ? '#000000' : '#ffffff'))
                  : ((y = null), (_ = null)),
                (this.storedData[n] = {
                  elem: a,
                  x: _,
                  expan: y,
                  lastPath: '',
                  lastOperator: '',
                  filterId: d,
                  lastRadius: 0
                }),
                l[n].mode === 'i')
              ) {
                E = f.length
                var g = createNS('g')
                for (u = 0; u < E; u += 1) g.appendChild(f[u])
                var C = createNS('mask')
                C.setAttribute('mask-type', 'alpha'),
                  C.setAttribute('id', c + '_' + o),
                  C.appendChild(a),
                  i.appendChild(C),
                  g.setAttribute('mask', 'url(' + getLocationHref() + '#' + c + '_' + o + ')'),
                  (f.length = 0),
                  f.push(g)
              } else f.push(a)
              l[n].inv && !this.solidPath && (this.solidPath = this.createLayerSolidPath()),
                (this.viewData[n] = {
                  elem: a,
                  lastPath: '',
                  op: PropertyFactory.getProp(this.element, l[n].o, 0, 0.01, this.element),
                  prop: ShapePropertyFactory.getShapeProp(this.element, l[n], 3),
                  invRect: b
                }),
                this.viewData[n].prop.k ||
                  this.drawPath(l[n], this.viewData[n].prop.v, this.viewData[n])
            }
          for (this.maskElement = createNS(m), s = f.length, n = 0; n < s; n += 1)
            this.maskElement.appendChild(f[n])
          o > 0 &&
            (this.maskElement.setAttribute('id', c),
            this.element.maskedElement.setAttribute(A, 'url(' + getLocationHref() + '#' + c + ')'),
            i.appendChild(this.maskElement)),
            this.viewData.length && this.element.addRenderableComponent(this)
        }
        ;(MaskElement.prototype.getMaskProperty = function (e) {
          return this.viewData[e].prop
        }),
          (MaskElement.prototype.renderFrame = function (e) {
            var t = this.element.finalTransform.mat,
              r,
              i = this.masksProperties.length
            for (r = 0; r < i; r += 1)
              if (
                ((this.viewData[r].prop._mdf || e) &&
                  this.drawPath(this.masksProperties[r], this.viewData[r].prop.v, this.viewData[r]),
                (this.viewData[r].op._mdf || e) &&
                  this.viewData[r].elem.setAttribute('fill-opacity', this.viewData[r].op.v),
                this.masksProperties[r].mode !== 'n' &&
                  (this.viewData[r].invRect &&
                    (this.element.finalTransform.mProp._mdf || e) &&
                    this.viewData[r].invRect.setAttribute(
                      'transform',
                      t.getInverseMatrix().to2dCSS()
                    ),
                  this.storedData[r].x && (this.storedData[r].x._mdf || e)))
              ) {
                var n = this.storedData[r].expan
                this.storedData[r].x.v < 0
                  ? (this.storedData[r].lastOperator !== 'erode' &&
                      ((this.storedData[r].lastOperator = 'erode'),
                      this.storedData[r].elem.setAttribute(
                        'filter',
                        'url(' + getLocationHref() + '#' + this.storedData[r].filterId + ')'
                      )),
                    n.setAttribute('radius', -this.storedData[r].x.v))
                  : (this.storedData[r].lastOperator !== 'dilate' &&
                      ((this.storedData[r].lastOperator = 'dilate'),
                      this.storedData[r].elem.setAttribute('filter', null)),
                    this.storedData[r].elem.setAttribute(
                      'stroke-width',
                      this.storedData[r].x.v * 2
                    ))
              }
          }),
          (MaskElement.prototype.getMaskelement = function () {
            return this.maskElement
          }),
          (MaskElement.prototype.createLayerSolidPath = function () {
            var e = 'M0,0 '
            return (
              (e += ' h' + this.globalData.compSize.w),
              (e += ' v' + this.globalData.compSize.h),
              (e += ' h-' + this.globalData.compSize.w),
              (e += ' v-' + this.globalData.compSize.h + ' '),
              e
            )
          }),
          (MaskElement.prototype.drawPath = function (e, t, r) {
            var i = ' M' + t.v[0][0] + ',' + t.v[0][1],
              n,
              s
            for (s = t._length, n = 1; n < s; n += 1)
              i +=
                ' C' +
                t.o[n - 1][0] +
                ',' +
                t.o[n - 1][1] +
                ' ' +
                t.i[n][0] +
                ',' +
                t.i[n][1] +
                ' ' +
                t.v[n][0] +
                ',' +
                t.v[n][1]
            if (
              (t.c &&
                s > 1 &&
                (i +=
                  ' C' +
                  t.o[n - 1][0] +
                  ',' +
                  t.o[n - 1][1] +
                  ' ' +
                  t.i[0][0] +
                  ',' +
                  t.i[0][1] +
                  ' ' +
                  t.v[0][0] +
                  ',' +
                  t.v[0][1]),
              r.lastPath !== i)
            ) {
              var a = ''
              r.elem && (t.c && (a = e.inv ? this.solidPath + i : i), r.elem.setAttribute('d', a)),
                (r.lastPath = i)
            }
          }),
          (MaskElement.prototype.destroy = function () {
            ;(this.element = null),
              (this.globalData = null),
              (this.maskElement = null),
              (this.data = null),
              (this.masksProperties = null)
          })
        var filtersFactory = (function () {
            var e = {}
            ;(e.createFilter = t), (e.createAlphaToLuminanceFilter = r)
            function t(i, n) {
              var s = createNS('filter')
              return (
                s.setAttribute('id', i),
                n !== !0 &&
                  (s.setAttribute('filterUnits', 'objectBoundingBox'),
                  s.setAttribute('x', '0%'),
                  s.setAttribute('y', '0%'),
                  s.setAttribute('width', '100%'),
                  s.setAttribute('height', '100%')),
                s
              )
            }
            function r() {
              var i = createNS('feColorMatrix')
              return (
                i.setAttribute('type', 'matrix'),
                i.setAttribute('color-interpolation-filters', 'sRGB'),
                i.setAttribute('values', '0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1'),
                i
              )
            }
            return e
          })(),
          featureSupport = (function () {
            var e = {
              maskType: !0,
              svgLumaHidden: !0,
              offscreenCanvas: typeof OffscreenCanvas < 'u'
            }
            return (
              (/MSIE 10/i.test(navigator.userAgent) ||
                /MSIE 9/i.test(navigator.userAgent) ||
                /rv:11.0/i.test(navigator.userAgent) ||
                /Edge\/\d./i.test(navigator.userAgent)) &&
                (e.maskType = !1),
              /firefox/i.test(navigator.userAgent) && (e.svgLumaHidden = !1),
              e
            )
          })(),
          registeredEffects$1 = {},
          idPrefix = 'filter_result_'
        function SVGEffects(e) {
          var t,
            r = 'SourceGraphic',
            i = e.data.ef ? e.data.ef.length : 0,
            n = createElementID(),
            s = filtersFactory.createFilter(n, !0),
            a = 0
          this.filters = []
          var l
          for (t = 0; t < i; t += 1) {
            l = null
            var o = e.data.ef[t].ty
            if (registeredEffects$1[o]) {
              var f = registeredEffects$1[o].effect
              ;(l = new f(s, e.effectsManager.effectElements[t], e, idPrefix + a, r)),
                (r = idPrefix + a),
                registeredEffects$1[o].countsAsEffect && (a += 1)
            }
            l && this.filters.push(l)
          }
          a &&
            (e.globalData.defs.appendChild(s),
            e.layerElement.setAttribute('filter', 'url(' + getLocationHref() + '#' + n + ')')),
            this.filters.length && e.addRenderableComponent(this)
        }
        ;(SVGEffects.prototype.renderFrame = function (e) {
          var t,
            r = this.filters.length
          for (t = 0; t < r; t += 1) this.filters[t].renderFrame(e)
        }),
          (SVGEffects.prototype.getEffects = function (e) {
            var t,
              r = this.filters.length,
              i = []
            for (t = 0; t < r; t += 1) this.filters[t].type === e && i.push(this.filters[t])
            return i
          })
        function registerEffect$1(e, t, r) {
          registeredEffects$1[e] = { effect: t, countsAsEffect: r }
        }
        function SVGBaseElement() {}
        SVGBaseElement.prototype = {
          initRendererElement: function () {
            this.layerElement = createNS('g')
          },
          createContainerElements: function () {
            ;(this.matteElement = createNS('g')),
              (this.transformedElement = this.layerElement),
              (this.maskedElement = this.layerElement),
              (this._sizeChanged = !1)
            var t = null
            if (this.data.td) {
              this.matteMasks = {}
              var r = createNS('g')
              r.setAttribute('id', this.layerId),
                r.appendChild(this.layerElement),
                (t = r),
                this.globalData.defs.appendChild(r)
            } else
              this.data.tt
                ? (this.matteElement.appendChild(this.layerElement),
                  (t = this.matteElement),
                  (this.baseElement = this.matteElement))
                : (this.baseElement = this.layerElement)
            if (
              (this.data.ln && this.layerElement.setAttribute('id', this.data.ln),
              this.data.cl && this.layerElement.setAttribute('class', this.data.cl),
              this.data.ty === 0 && !this.data.hd)
            ) {
              var i = createNS('clipPath'),
                n = createNS('path')
              n.setAttribute(
                'd',
                'M0,0 L' +
                  this.data.w +
                  ',0 L' +
                  this.data.w +
                  ',' +
                  this.data.h +
                  ' L0,' +
                  this.data.h +
                  'z'
              )
              var s = createElementID()
              if (
                (i.setAttribute('id', s),
                i.appendChild(n),
                this.globalData.defs.appendChild(i),
                this.checkMasks())
              ) {
                var a = createNS('g')
                a.setAttribute('clip-path', 'url(' + getLocationHref() + '#' + s + ')'),
                  a.appendChild(this.layerElement),
                  (this.transformedElement = a),
                  t
                    ? t.appendChild(this.transformedElement)
                    : (this.baseElement = this.transformedElement)
              } else
                this.layerElement.setAttribute(
                  'clip-path',
                  'url(' + getLocationHref() + '#' + s + ')'
                )
            }
            this.data.bm !== 0 && this.setBlendMode()
          },
          renderElement: function () {
            this.finalTransform._localMatMdf &&
              this.transformedElement.setAttribute(
                'transform',
                this.finalTransform.localMat.to2dCSS()
              ),
              this.finalTransform._opMdf &&
                this.transformedElement.setAttribute('opacity', this.finalTransform.localOpacity)
          },
          destroyBaseElement: function () {
            ;(this.layerElement = null), (this.matteElement = null), this.maskManager.destroy()
          },
          getBaseElement: function () {
            return this.data.hd ? null : this.baseElement
          },
          createRenderableComponents: function () {
            ;(this.maskManager = new MaskElement(this.data, this, this.globalData)),
              (this.renderableEffectsManager = new SVGEffects(this)),
              this.searchEffectTransforms()
          },
          getMatte: function (t) {
            if ((this.matteMasks || (this.matteMasks = {}), !this.matteMasks[t])) {
              var r = this.layerId + '_' + t,
                i,
                n,
                s,
                a
              if (t === 1 || t === 3) {
                var l = createNS('mask')
                l.setAttribute('id', r),
                  l.setAttribute('mask-type', t === 3 ? 'luminance' : 'alpha'),
                  (s = createNS('use')),
                  s.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + this.layerId),
                  l.appendChild(s),
                  this.globalData.defs.appendChild(l),
                  !featureSupport.maskType &&
                    t === 1 &&
                    (l.setAttribute('mask-type', 'luminance'),
                    (i = createElementID()),
                    (n = filtersFactory.createFilter(i)),
                    this.globalData.defs.appendChild(n),
                    n.appendChild(filtersFactory.createAlphaToLuminanceFilter()),
                    (a = createNS('g')),
                    a.appendChild(s),
                    l.appendChild(a),
                    a.setAttribute('filter', 'url(' + getLocationHref() + '#' + i + ')'))
              } else if (t === 2) {
                var o = createNS('mask')
                o.setAttribute('id', r), o.setAttribute('mask-type', 'alpha')
                var f = createNS('g')
                o.appendChild(f), (i = createElementID()), (n = filtersFactory.createFilter(i))
                var u = createNS('feComponentTransfer')
                u.setAttribute('in', 'SourceGraphic'), n.appendChild(u)
                var E = createNS('feFuncA')
                E.setAttribute('type', 'table'),
                  E.setAttribute('tableValues', '1.0 0.0'),
                  u.appendChild(E),
                  this.globalData.defs.appendChild(n)
                var c = createNS('rect')
                c.setAttribute('width', this.comp.data.w),
                  c.setAttribute('height', this.comp.data.h),
                  c.setAttribute('x', '0'),
                  c.setAttribute('y', '0'),
                  c.setAttribute('fill', '#ffffff'),
                  c.setAttribute('opacity', '0'),
                  f.setAttribute('filter', 'url(' + getLocationHref() + '#' + i + ')'),
                  f.appendChild(c),
                  (s = createNS('use')),
                  s.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + this.layerId),
                  f.appendChild(s),
                  featureSupport.maskType ||
                    (o.setAttribute('mask-type', 'luminance'),
                    n.appendChild(filtersFactory.createAlphaToLuminanceFilter()),
                    (a = createNS('g')),
                    f.appendChild(c),
                    a.appendChild(this.layerElement),
                    f.appendChild(a)),
                  this.globalData.defs.appendChild(o)
              }
              this.matteMasks[t] = r
            }
            return this.matteMasks[t]
          },
          setMatte: function (t) {
            this.matteElement &&
              this.matteElement.setAttribute('mask', 'url(' + getLocationHref() + '#' + t + ')')
          }
        }
        function HierarchyElement() {}
        HierarchyElement.prototype = {
          initHierarchy: function () {
            ;(this.hierarchy = []), (this._isParent = !1), this.checkParenting()
          },
          setHierarchy: function (t) {
            this.hierarchy = t
          },
          setAsParent: function () {
            this._isParent = !0
          },
          checkParenting: function () {
            this.data.parent !== void 0 &&
              this.comp.buildElementParenting(this, this.data.parent, [])
          }
        }
        function RenderableDOMElement() {}
        ;(function () {
          var e = {
            initElement: function (r, i, n) {
              this.initFrame(),
                this.initBaseData(r, i, n),
                this.initTransform(r, i, n),
                this.initHierarchy(),
                this.initRenderable(),
                this.initRendererElement(),
                this.createContainerElements(),
                this.createRenderableComponents(),
                this.createContent(),
                this.hide()
            },
            hide: function () {
              if (!this.hidden && (!this.isInRange || this.isTransparent)) {
                var r = this.baseElement || this.layerElement
                ;(r.style.display = 'none'), (this.hidden = !0)
              }
            },
            show: function () {
              if (this.isInRange && !this.isTransparent) {
                if (!this.data.hd) {
                  var r = this.baseElement || this.layerElement
                  r.style.display = 'block'
                }
                ;(this.hidden = !1), (this._isFirstFrame = !0)
              }
            },
            renderFrame: function () {
              this.data.hd ||
                this.hidden ||
                (this.renderTransform(),
                this.renderRenderable(),
                this.renderLocalTransform(),
                this.renderElement(),
                this.renderInnerContent(),
                this._isFirstFrame && (this._isFirstFrame = !1))
            },
            renderInnerContent: function () {},
            prepareFrame: function (r) {
              ;(this._mdf = !1),
                this.prepareRenderableFrame(r),
                this.prepareProperties(r, this.isInRange),
                this.checkTransparency()
            },
            destroy: function () {
              ;(this.innerElem = null), this.destroyBaseElement()
            }
          }
          extendPrototype([RenderableElement, createProxyFunction(e)], RenderableDOMElement)
        })()
        function IImageElement(e, t, r) {
          ;(this.assetData = t.getAssetData(e.refId)),
            this.assetData &&
              this.assetData.sid &&
              (this.assetData = t.slotManager.getProp(this.assetData)),
            this.initElement(e, t, r),
            (this.sourceRect = {
              top: 0,
              left: 0,
              width: this.assetData.w,
              height: this.assetData.h
            })
        }
        extendPrototype(
          [
            BaseElement,
            TransformElement,
            SVGBaseElement,
            HierarchyElement,
            FrameElement,
            RenderableDOMElement
          ],
          IImageElement
        ),
          (IImageElement.prototype.createContent = function () {
            var e = this.globalData.getAssetsPath(this.assetData)
            ;(this.innerElem = createNS('image')),
              this.innerElem.setAttribute('width', this.assetData.w + 'px'),
              this.innerElem.setAttribute('height', this.assetData.h + 'px'),
              this.innerElem.setAttribute(
                'preserveAspectRatio',
                this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio
              ),
              this.innerElem.setAttributeNS('http://www.w3.org/1999/xlink', 'href', e),
              this.layerElement.appendChild(this.innerElem)
          }),
          (IImageElement.prototype.sourceRectAtTime = function () {
            return this.sourceRect
          })
        function ProcessedElement(e, t) {
          ;(this.elem = e), (this.pos = t)
        }
        function IShapeElement() {}
        IShapeElement.prototype = {
          addShapeToModifiers: function (t) {
            var r,
              i = this.shapeModifiers.length
            for (r = 0; r < i; r += 1) this.shapeModifiers[r].addShape(t)
          },
          isShapeInAnimatedModifiers: function (t) {
            for (var r = 0, i = this.shapeModifiers.length; r < i; )
              if (this.shapeModifiers[r].isAnimatedWithShape(t)) return !0
            return !1
          },
          renderModifiers: function () {
            if (this.shapeModifiers.length) {
              var t,
                r = this.shapes.length
              for (t = 0; t < r; t += 1) this.shapes[t].sh.reset()
              r = this.shapeModifiers.length
              var i
              for (
                t = r - 1;
                t >= 0 && ((i = this.shapeModifiers[t].processShapes(this._isFirstFrame)), !i);
                t -= 1
              );
            }
          },
          searchProcessedElement: function (t) {
            for (var r = this.processedElements, i = 0, n = r.length; i < n; ) {
              if (r[i].elem === t) return r[i].pos
              i += 1
            }
            return 0
          },
          addProcessedElement: function (t, r) {
            for (var i = this.processedElements, n = i.length; n; )
              if (((n -= 1), i[n].elem === t)) {
                i[n].pos = r
                return
              }
            i.push(new ProcessedElement(t, r))
          },
          prepareFrame: function (t) {
            this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange)
          }
        }
        var lineCapEnum = { 1: 'butt', 2: 'round', 3: 'square' },
          lineJoinEnum = { 1: 'miter', 2: 'round', 3: 'bevel' }
        function SVGShapeData(e, t, r) {
          ;(this.caches = []),
            (this.styles = []),
            (this.transformers = e),
            (this.lStr = ''),
            (this.sh = r),
            (this.lvl = t),
            (this._isAnimated = !!r.k)
          for (var i = 0, n = e.length; i < n; ) {
            if (e[i].mProps.dynamicProperties.length) {
              this._isAnimated = !0
              break
            }
            i += 1
          }
        }
        SVGShapeData.prototype.setAsAnimated = function () {
          this._isAnimated = !0
        }
        function SVGStyleData(e, t) {
          ;(this.data = e),
            (this.type = e.ty),
            (this.d = ''),
            (this.lvl = t),
            (this._mdf = !1),
            (this.closed = e.hd === !0),
            (this.pElem = createNS('path')),
            (this.msElem = null)
        }
        SVGStyleData.prototype.reset = function () {
          ;(this.d = ''), (this._mdf = !1)
        }
        function DashProperty(e, t, r, i) {
          ;(this.elem = e),
            (this.frameId = -1),
            (this.dataProps = createSizedArray(t.length)),
            (this.renderer = r),
            (this.k = !1),
            (this.dashStr = ''),
            (this.dashArray = createTypedArray('float32', t.length ? t.length - 1 : 0)),
            (this.dashoffset = createTypedArray('float32', 1)),
            this.initDynamicPropertyContainer(i)
          var n,
            s = t.length || 0,
            a
          for (n = 0; n < s; n += 1)
            (a = PropertyFactory.getProp(e, t[n].v, 0, 0, this)),
              (this.k = a.k || this.k),
              (this.dataProps[n] = { n: t[n].n, p: a })
          this.k || this.getValue(!0), (this._isAnimated = this.k)
        }
        ;(DashProperty.prototype.getValue = function (e) {
          if (
            !(this.elem.globalData.frameId === this.frameId && !e) &&
            ((this.frameId = this.elem.globalData.frameId),
            this.iterateDynamicProperties(),
            (this._mdf = this._mdf || e),
            this._mdf)
          ) {
            var t = 0,
              r = this.dataProps.length
            for (this.renderer === 'svg' && (this.dashStr = ''), t = 0; t < r; t += 1)
              this.dataProps[t].n !== 'o'
                ? this.renderer === 'svg'
                  ? (this.dashStr += ' ' + this.dataProps[t].p.v)
                  : (this.dashArray[t] = this.dataProps[t].p.v)
                : (this.dashoffset[0] = this.dataProps[t].p.v)
          }
        }),
          extendPrototype([DynamicPropertyContainer], DashProperty)
        function SVGStrokeStyleData(e, t, r) {
          this.initDynamicPropertyContainer(e),
            (this.getValue = this.iterateDynamicProperties),
            (this.o = PropertyFactory.getProp(e, t.o, 0, 0.01, this)),
            (this.w = PropertyFactory.getProp(e, t.w, 0, null, this)),
            (this.d = new DashProperty(e, t.d || {}, 'svg', this)),
            (this.c = PropertyFactory.getProp(e, t.c, 1, 255, this)),
            (this.style = r),
            (this._isAnimated = !!this._isAnimated)
        }
        extendPrototype([DynamicPropertyContainer], SVGStrokeStyleData)
        function SVGFillStyleData(e, t, r) {
          this.initDynamicPropertyContainer(e),
            (this.getValue = this.iterateDynamicProperties),
            (this.o = PropertyFactory.getProp(e, t.o, 0, 0.01, this)),
            (this.c = PropertyFactory.getProp(e, t.c, 1, 255, this)),
            (this.style = r)
        }
        extendPrototype([DynamicPropertyContainer], SVGFillStyleData)
        function SVGNoStyleData(e, t, r) {
          this.initDynamicPropertyContainer(e),
            (this.getValue = this.iterateDynamicProperties),
            (this.style = r)
        }
        extendPrototype([DynamicPropertyContainer], SVGNoStyleData)
        function GradientProperty(e, t, r) {
          ;(this.data = t), (this.c = createTypedArray('uint8c', t.p * 4))
          var i = t.k.k[0].s ? t.k.k[0].s.length - t.p * 4 : t.k.k.length - t.p * 4
          ;(this.o = createTypedArray('float32', i)),
            (this._cmdf = !1),
            (this._omdf = !1),
            (this._collapsable = this.checkCollapsable()),
            (this._hasOpacity = i),
            this.initDynamicPropertyContainer(r),
            (this.prop = PropertyFactory.getProp(e, t.k, 1, null, this)),
            (this.k = this.prop.k),
            this.getValue(!0)
        }
        ;(GradientProperty.prototype.comparePoints = function (e, t) {
          for (var r = 0, i = this.o.length / 2, n; r < i; ) {
            if (((n = Math.abs(e[r * 4] - e[t * 4 + r * 2])), n > 0.01)) return !1
            r += 1
          }
          return !0
        }),
          (GradientProperty.prototype.checkCollapsable = function () {
            if (this.o.length / 2 !== this.c.length / 4) return !1
            if (this.data.k.k[0].s)
              for (var e = 0, t = this.data.k.k.length; e < t; ) {
                if (!this.comparePoints(this.data.k.k[e].s, this.data.p)) return !1
                e += 1
              }
            else if (!this.comparePoints(this.data.k.k, this.data.p)) return !1
            return !0
          }),
          (GradientProperty.prototype.getValue = function (e) {
            if (
              (this.prop.getValue(),
              (this._mdf = !1),
              (this._cmdf = !1),
              (this._omdf = !1),
              this.prop._mdf || e)
            ) {
              var t,
                r = this.data.p * 4,
                i,
                n
              for (t = 0; t < r; t += 1)
                (i = t % 4 === 0 ? 100 : 255),
                  (n = Math.round(this.prop.v[t] * i)),
                  this.c[t] !== n && ((this.c[t] = n), (this._cmdf = !e))
              if (this.o.length)
                for (r = this.prop.v.length, t = this.data.p * 4; t < r; t += 1)
                  (i = t % 2 === 0 ? 100 : 1),
                    (n = t % 2 === 0 ? Math.round(this.prop.v[t] * 100) : this.prop.v[t]),
                    this.o[t - this.data.p * 4] !== n &&
                      ((this.o[t - this.data.p * 4] = n), (this._omdf = !e))
              this._mdf = !e
            }
          }),
          extendPrototype([DynamicPropertyContainer], GradientProperty)
        function SVGGradientFillStyleData(e, t, r) {
          this.initDynamicPropertyContainer(e),
            (this.getValue = this.iterateDynamicProperties),
            this.initGradientData(e, t, r)
        }
        ;(SVGGradientFillStyleData.prototype.initGradientData = function (e, t, r) {
          ;(this.o = PropertyFactory.getProp(e, t.o, 0, 0.01, this)),
            (this.s = PropertyFactory.getProp(e, t.s, 1, null, this)),
            (this.e = PropertyFactory.getProp(e, t.e, 1, null, this)),
            (this.h = PropertyFactory.getProp(e, t.h || { k: 0 }, 0, 0.01, this)),
            (this.a = PropertyFactory.getProp(e, t.a || { k: 0 }, 0, degToRads, this)),
            (this.g = new GradientProperty(e, t.g, this)),
            (this.style = r),
            (this.stops = []),
            this.setGradientData(r.pElem, t),
            this.setGradientOpacity(t, r),
            (this._isAnimated = !!this._isAnimated)
        }),
          (SVGGradientFillStyleData.prototype.setGradientData = function (e, t) {
            var r = createElementID(),
              i = createNS(t.t === 1 ? 'linearGradient' : 'radialGradient')
            i.setAttribute('id', r),
              i.setAttribute('spreadMethod', 'pad'),
              i.setAttribute('gradientUnits', 'userSpaceOnUse')
            var n = [],
              s,
              a,
              l
            for (l = t.g.p * 4, a = 0; a < l; a += 4)
              (s = createNS('stop')), i.appendChild(s), n.push(s)
            e.setAttribute(
              t.ty === 'gf' ? 'fill' : 'stroke',
              'url(' + getLocationHref() + '#' + r + ')'
            ),
              (this.gf = i),
              (this.cst = n)
          }),
          (SVGGradientFillStyleData.prototype.setGradientOpacity = function (e, t) {
            if (this.g._hasOpacity && !this.g._collapsable) {
              var r,
                i,
                n,
                s = createNS('mask'),
                a = createNS('path')
              s.appendChild(a)
              var l = createElementID(),
                o = createElementID()
              s.setAttribute('id', o)
              var f = createNS(e.t === 1 ? 'linearGradient' : 'radialGradient')
              f.setAttribute('id', l),
                f.setAttribute('spreadMethod', 'pad'),
                f.setAttribute('gradientUnits', 'userSpaceOnUse'),
                (n = e.g.k.k[0].s ? e.g.k.k[0].s.length : e.g.k.k.length)
              var u = this.stops
              for (i = e.g.p * 4; i < n; i += 2)
                (r = createNS('stop')),
                  r.setAttribute('stop-color', 'rgb(255,255,255)'),
                  f.appendChild(r),
                  u.push(r)
              a.setAttribute(
                e.ty === 'gf' ? 'fill' : 'stroke',
                'url(' + getLocationHref() + '#' + l + ')'
              ),
                e.ty === 'gs' &&
                  (a.setAttribute('stroke-linecap', lineCapEnum[e.lc || 2]),
                  a.setAttribute('stroke-linejoin', lineJoinEnum[e.lj || 2]),
                  e.lj === 1 && a.setAttribute('stroke-miterlimit', e.ml)),
                (this.of = f),
                (this.ms = s),
                (this.ost = u),
                (this.maskId = o),
                (t.msElem = a)
            }
          }),
          extendPrototype([DynamicPropertyContainer], SVGGradientFillStyleData)
        function SVGGradientStrokeStyleData(e, t, r) {
          this.initDynamicPropertyContainer(e),
            (this.getValue = this.iterateDynamicProperties),
            (this.w = PropertyFactory.getProp(e, t.w, 0, null, this)),
            (this.d = new DashProperty(e, t.d || {}, 'svg', this)),
            this.initGradientData(e, t, r),
            (this._isAnimated = !!this._isAnimated)
        }
        extendPrototype(
          [SVGGradientFillStyleData, DynamicPropertyContainer],
          SVGGradientStrokeStyleData
        )
        function ShapeGroupData() {
          ;(this.it = []), (this.prevViewData = []), (this.gr = createNS('g'))
        }
        function SVGTransformData(e, t, r) {
          ;(this.transform = { mProps: e, op: t, container: r }),
            (this.elements = []),
            (this._isAnimated =
              this.transform.mProps.dynamicProperties.length ||
              this.transform.op.effectsSequence.length)
        }
        var buildShapeString = function (t, r, i, n) {
            if (r === 0) return ''
            var s = t.o,
              a = t.i,
              l = t.v,
              o,
              f = ' M' + n.applyToPointStringified(l[0][0], l[0][1])
            for (o = 1; o < r; o += 1)
              f +=
                ' C' +
                n.applyToPointStringified(s[o - 1][0], s[o - 1][1]) +
                ' ' +
                n.applyToPointStringified(a[o][0], a[o][1]) +
                ' ' +
                n.applyToPointStringified(l[o][0], l[o][1])
            return (
              i &&
                r &&
                ((f +=
                  ' C' +
                  n.applyToPointStringified(s[o - 1][0], s[o - 1][1]) +
                  ' ' +
                  n.applyToPointStringified(a[0][0], a[0][1]) +
                  ' ' +
                  n.applyToPointStringified(l[0][0], l[0][1])),
                (f += 'z')),
              f
            )
          },
          SVGElementsRenderer = (function () {
            var e = new Matrix(),
              t = new Matrix(),
              r = { createRenderFunction: i }
            function i(E) {
              switch (E.ty) {
                case 'fl':
                  return l
                case 'gf':
                  return f
                case 'gs':
                  return o
                case 'st':
                  return u
                case 'sh':
                case 'el':
                case 'rc':
                case 'sr':
                  return a
                case 'tr':
                  return n
                case 'no':
                  return s
                default:
                  return null
              }
            }
            function n(E, c, b) {
              ;(b || c.transform.op._mdf) &&
                c.transform.container.setAttribute('opacity', c.transform.op.v),
                (b || c.transform.mProps._mdf) &&
                  c.transform.container.setAttribute('transform', c.transform.mProps.v.to2dCSS())
            }
            function s() {}
            function a(E, c, b) {
              var x,
                y,
                _,
                m,
                A,
                d,
                g = c.styles.length,
                C = c.lvl,
                P,
                k,
                M,
                D
              for (d = 0; d < g; d += 1) {
                if (((m = c.sh._mdf || b), c.styles[d].lvl < C)) {
                  for (
                    k = t.reset(), M = C - c.styles[d].lvl, D = c.transformers.length - 1;
                    !m && M > 0;

                  )
                    (m = c.transformers[D].mProps._mdf || m), (M -= 1), (D -= 1)
                  if (m)
                    for (M = C - c.styles[d].lvl, D = c.transformers.length - 1; M > 0; )
                      k.multiply(c.transformers[D].mProps.v), (M -= 1), (D -= 1)
                } else k = e
                if (((P = c.sh.paths), (y = P._length), m)) {
                  for (_ = '', x = 0; x < y; x += 1)
                    (A = P.shapes[x]),
                      A && A._length && (_ += buildShapeString(A, A._length, A.c, k))
                  c.caches[d] = _
                } else _ = c.caches[d]
                ;(c.styles[d].d += E.hd === !0 ? '' : _), (c.styles[d]._mdf = m || c.styles[d]._mdf)
              }
            }
            function l(E, c, b) {
              var x = c.style
              ;(c.c._mdf || b) &&
                x.pElem.setAttribute(
                  'fill',
                  'rgb(' +
                    bmFloor(c.c.v[0]) +
                    ',' +
                    bmFloor(c.c.v[1]) +
                    ',' +
                    bmFloor(c.c.v[2]) +
                    ')'
                ),
                (c.o._mdf || b) && x.pElem.setAttribute('fill-opacity', c.o.v)
            }
            function o(E, c, b) {
              f(E, c, b), u(E, c, b)
            }
            function f(E, c, b) {
              var x = c.gf,
                y = c.g._hasOpacity,
                _ = c.s.v,
                m = c.e.v
              if (c.o._mdf || b) {
                var A = E.ty === 'gf' ? 'fill-opacity' : 'stroke-opacity'
                c.style.pElem.setAttribute(A, c.o.v)
              }
              if (c.s._mdf || b) {
                var d = E.t === 1 ? 'x1' : 'cx',
                  g = d === 'x1' ? 'y1' : 'cy'
                x.setAttribute(d, _[0]),
                  x.setAttribute(g, _[1]),
                  y && !c.g._collapsable && (c.of.setAttribute(d, _[0]), c.of.setAttribute(g, _[1]))
              }
              var C, P, k, M
              if (c.g._cmdf || b) {
                C = c.cst
                var D = c.g.c
                for (k = C.length, P = 0; P < k; P += 1)
                  (M = C[P]),
                    M.setAttribute('offset', D[P * 4] + '%'),
                    M.setAttribute(
                      'stop-color',
                      'rgb(' + D[P * 4 + 1] + ',' + D[P * 4 + 2] + ',' + D[P * 4 + 3] + ')'
                    )
              }
              if (y && (c.g._omdf || b)) {
                var W = c.g.o
                for (
                  c.g._collapsable ? (C = c.cst) : (C = c.ost), k = C.length, P = 0;
                  P < k;
                  P += 1
                )
                  (M = C[P]),
                    c.g._collapsable || M.setAttribute('offset', W[P * 2] + '%'),
                    M.setAttribute('stop-opacity', W[P * 2 + 1])
              }
              if (E.t === 1)
                (c.e._mdf || b) &&
                  (x.setAttribute('x2', m[0]),
                  x.setAttribute('y2', m[1]),
                  y &&
                    !c.g._collapsable &&
                    (c.of.setAttribute('x2', m[0]), c.of.setAttribute('y2', m[1])))
              else {
                var H
                if (
                  ((c.s._mdf || c.e._mdf || b) &&
                    ((H = Math.sqrt(Math.pow(_[0] - m[0], 2) + Math.pow(_[1] - m[1], 2))),
                    x.setAttribute('r', H),
                    y && !c.g._collapsable && c.of.setAttribute('r', H)),
                  c.e._mdf || c.h._mdf || c.a._mdf || b)
                ) {
                  H || (H = Math.sqrt(Math.pow(_[0] - m[0], 2) + Math.pow(_[1] - m[1], 2)))
                  var $ = Math.atan2(m[1] - _[1], m[0] - _[0]),
                    Z = c.h.v
                  Z >= 1 ? (Z = 0.99) : Z <= -1 && (Z = -0.99)
                  var Y = H * Z,
                    L = Math.cos($ + c.a.v) * Y + _[0],
                    B = Math.sin($ + c.a.v) * Y + _[1]
                  x.setAttribute('fx', L),
                    x.setAttribute('fy', B),
                    y &&
                      !c.g._collapsable &&
                      (c.of.setAttribute('fx', L), c.of.setAttribute('fy', B))
                }
              }
            }
            function u(E, c, b) {
              var x = c.style,
                y = c.d
              y &&
                (y._mdf || b) &&
                y.dashStr &&
                (x.pElem.setAttribute('stroke-dasharray', y.dashStr),
                x.pElem.setAttribute('stroke-dashoffset', y.dashoffset[0])),
                c.c &&
                  (c.c._mdf || b) &&
                  x.pElem.setAttribute(
                    'stroke',
                    'rgb(' +
                      bmFloor(c.c.v[0]) +
                      ',' +
                      bmFloor(c.c.v[1]) +
                      ',' +
                      bmFloor(c.c.v[2]) +
                      ')'
                  ),
                (c.o._mdf || b) && x.pElem.setAttribute('stroke-opacity', c.o.v),
                (c.w._mdf || b) &&
                  (x.pElem.setAttribute('stroke-width', c.w.v),
                  x.msElem && x.msElem.setAttribute('stroke-width', c.w.v))
            }
            return r
          })()
        function SVGShapeElement(e, t, r) {
          ;(this.shapes = []),
            (this.shapesData = e.shapes),
            (this.stylesList = []),
            (this.shapeModifiers = []),
            (this.itemsData = []),
            (this.processedElements = []),
            (this.animatedContents = []),
            this.initElement(e, t, r),
            (this.prevViewData = [])
        }
        extendPrototype(
          [
            BaseElement,
            TransformElement,
            SVGBaseElement,
            IShapeElement,
            HierarchyElement,
            FrameElement,
            RenderableDOMElement
          ],
          SVGShapeElement
        ),
          (SVGShapeElement.prototype.initSecondaryElement = function () {}),
          (SVGShapeElement.prototype.identityMatrix = new Matrix()),
          (SVGShapeElement.prototype.buildExpressionInterface = function () {}),
          (SVGShapeElement.prototype.createContent = function () {
            this.searchShapes(
              this.shapesData,
              this.itemsData,
              this.prevViewData,
              this.layerElement,
              0,
              [],
              !0
            ),
              this.filterUniqueShapes()
          }),
          (SVGShapeElement.prototype.filterUniqueShapes = function () {
            var e,
              t = this.shapes.length,
              r,
              i,
              n = this.stylesList.length,
              s,
              a = [],
              l = !1
            for (i = 0; i < n; i += 1) {
              for (s = this.stylesList[i], l = !1, a.length = 0, e = 0; e < t; e += 1)
                (r = this.shapes[e]),
                  r.styles.indexOf(s) !== -1 && (a.push(r), (l = r._isAnimated || l))
              a.length > 1 && l && this.setShapesAsAnimated(a)
            }
          }),
          (SVGShapeElement.prototype.setShapesAsAnimated = function (e) {
            var t,
              r = e.length
            for (t = 0; t < r; t += 1) e[t].setAsAnimated()
          }),
          (SVGShapeElement.prototype.createStyleElement = function (e, t) {
            var r,
              i = new SVGStyleData(e, t),
              n = i.pElem
            if (e.ty === 'st') r = new SVGStrokeStyleData(this, e, i)
            else if (e.ty === 'fl') r = new SVGFillStyleData(this, e, i)
            else if (e.ty === 'gf' || e.ty === 'gs') {
              var s = e.ty === 'gf' ? SVGGradientFillStyleData : SVGGradientStrokeStyleData
              ;(r = new s(this, e, i)),
                this.globalData.defs.appendChild(r.gf),
                r.maskId &&
                  (this.globalData.defs.appendChild(r.ms),
                  this.globalData.defs.appendChild(r.of),
                  n.setAttribute('mask', 'url(' + getLocationHref() + '#' + r.maskId + ')'))
            } else e.ty === 'no' && (r = new SVGNoStyleData(this, e, i))
            return (
              (e.ty === 'st' || e.ty === 'gs') &&
                (n.setAttribute('stroke-linecap', lineCapEnum[e.lc || 2]),
                n.setAttribute('stroke-linejoin', lineJoinEnum[e.lj || 2]),
                n.setAttribute('fill-opacity', '0'),
                e.lj === 1 && n.setAttribute('stroke-miterlimit', e.ml)),
              e.r === 2 && n.setAttribute('fill-rule', 'evenodd'),
              e.ln && n.setAttribute('id', e.ln),
              e.cl && n.setAttribute('class', e.cl),
              e.bm && (n.style['mix-blend-mode'] = getBlendMode(e.bm)),
              this.stylesList.push(i),
              this.addToAnimatedContents(e, r),
              r
            )
          }),
          (SVGShapeElement.prototype.createGroupElement = function (e) {
            var t = new ShapeGroupData()
            return (
              e.ln && t.gr.setAttribute('id', e.ln),
              e.cl && t.gr.setAttribute('class', e.cl),
              e.bm && (t.gr.style['mix-blend-mode'] = getBlendMode(e.bm)),
              t
            )
          }),
          (SVGShapeElement.prototype.createTransformElement = function (e, t) {
            var r = TransformPropertyFactory.getTransformProperty(this, e, this),
              i = new SVGTransformData(r, r.o, t)
            return this.addToAnimatedContents(e, i), i
          }),
          (SVGShapeElement.prototype.createShapeElement = function (e, t, r) {
            var i = 4
            e.ty === 'rc' ? (i = 5) : e.ty === 'el' ? (i = 6) : e.ty === 'sr' && (i = 7)
            var n = ShapePropertyFactory.getShapeProp(this, e, i, this),
              s = new SVGShapeData(t, r, n)
            return (
              this.shapes.push(s), this.addShapeToModifiers(s), this.addToAnimatedContents(e, s), s
            )
          }),
          (SVGShapeElement.prototype.addToAnimatedContents = function (e, t) {
            for (var r = 0, i = this.animatedContents.length; r < i; ) {
              if (this.animatedContents[r].element === t) return
              r += 1
            }
            this.animatedContents.push({
              fn: SVGElementsRenderer.createRenderFunction(e),
              element: t,
              data: e
            })
          }),
          (SVGShapeElement.prototype.setElementStyles = function (e) {
            var t = e.styles,
              r,
              i = this.stylesList.length
            for (r = 0; r < i; r += 1) this.stylesList[r].closed || t.push(this.stylesList[r])
          }),
          (SVGShapeElement.prototype.reloadShapes = function () {
            this._isFirstFrame = !0
            var e,
              t = this.itemsData.length
            for (e = 0; e < t; e += 1) this.prevViewData[e] = this.itemsData[e]
            for (
              this.searchShapes(
                this.shapesData,
                this.itemsData,
                this.prevViewData,
                this.layerElement,
                0,
                [],
                !0
              ),
                this.filterUniqueShapes(),
                t = this.dynamicProperties.length,
                e = 0;
              e < t;
              e += 1
            )
              this.dynamicProperties[e].getValue()
            this.renderModifiers()
          }),
          (SVGShapeElement.prototype.searchShapes = function (e, t, r, i, n, s, a) {
            var l = [].concat(s),
              o,
              f = e.length - 1,
              u,
              E,
              c = [],
              b = [],
              x,
              y,
              _
            for (o = f; o >= 0; o -= 1) {
              if (
                ((_ = this.searchProcessedElement(e[o])),
                _ ? (t[o] = r[_ - 1]) : (e[o]._render = a),
                e[o].ty === 'fl' ||
                  e[o].ty === 'st' ||
                  e[o].ty === 'gf' ||
                  e[o].ty === 'gs' ||
                  e[o].ty === 'no')
              )
                _ ? (t[o].style.closed = !1) : (t[o] = this.createStyleElement(e[o], n)),
                  e[o]._render &&
                    t[o].style.pElem.parentNode !== i &&
                    i.appendChild(t[o].style.pElem),
                  c.push(t[o].style)
              else if (e[o].ty === 'gr') {
                if (!_) t[o] = this.createGroupElement(e[o])
                else
                  for (E = t[o].it.length, u = 0; u < E; u += 1) t[o].prevViewData[u] = t[o].it[u]
                this.searchShapes(e[o].it, t[o].it, t[o].prevViewData, t[o].gr, n + 1, l, a),
                  e[o]._render && t[o].gr.parentNode !== i && i.appendChild(t[o].gr)
              } else
                e[o].ty === 'tr'
                  ? (_ || (t[o] = this.createTransformElement(e[o], i)),
                    (x = t[o].transform),
                    l.push(x))
                  : e[o].ty === 'sh' || e[o].ty === 'rc' || e[o].ty === 'el' || e[o].ty === 'sr'
                    ? (_ || (t[o] = this.createShapeElement(e[o], l, n)),
                      this.setElementStyles(t[o]))
                    : e[o].ty === 'tm' ||
                        e[o].ty === 'rd' ||
                        e[o].ty === 'ms' ||
                        e[o].ty === 'pb' ||
                        e[o].ty === 'zz' ||
                        e[o].ty === 'op'
                      ? (_
                          ? ((y = t[o]), (y.closed = !1))
                          : ((y = ShapeModifiers.getModifier(e[o].ty)),
                            y.init(this, e[o]),
                            (t[o] = y),
                            this.shapeModifiers.push(y)),
                        b.push(y))
                      : e[o].ty === 'rp' &&
                        (_
                          ? ((y = t[o]), (y.closed = !0))
                          : ((y = ShapeModifiers.getModifier(e[o].ty)),
                            (t[o] = y),
                            y.init(this, e, o, t),
                            this.shapeModifiers.push(y),
                            (a = !1)),
                        b.push(y))
              this.addProcessedElement(e[o], o + 1)
            }
            for (f = c.length, o = 0; o < f; o += 1) c[o].closed = !0
            for (f = b.length, o = 0; o < f; o += 1) b[o].closed = !0
          }),
          (SVGShapeElement.prototype.renderInnerContent = function () {
            this.renderModifiers()
            var e,
              t = this.stylesList.length
            for (e = 0; e < t; e += 1) this.stylesList[e].reset()
            for (this.renderShape(), e = 0; e < t; e += 1)
              (this.stylesList[e]._mdf || this._isFirstFrame) &&
                (this.stylesList[e].msElem &&
                  (this.stylesList[e].msElem.setAttribute('d', this.stylesList[e].d),
                  (this.stylesList[e].d = 'M0 0' + this.stylesList[e].d)),
                this.stylesList[e].pElem.setAttribute('d', this.stylesList[e].d || 'M0 0'))
          }),
          (SVGShapeElement.prototype.renderShape = function () {
            var e,
              t = this.animatedContents.length,
              r
            for (e = 0; e < t; e += 1)
              (r = this.animatedContents[e]),
                (this._isFirstFrame || r.element._isAnimated) &&
                  r.data !== !0 &&
                  r.fn(r.data, r.element, this._isFirstFrame)
          }),
          (SVGShapeElement.prototype.destroy = function () {
            this.destroyBaseElement(), (this.shapesData = null), (this.itemsData = null)
          })
        function LetterProps(e, t, r, i, n, s) {
          ;(this.o = e),
            (this.sw = t),
            (this.sc = r),
            (this.fc = i),
            (this.m = n),
            (this.p = s),
            (this._mdf = { o: !0, sw: !!t, sc: !!r, fc: !!i, m: !0, p: !0 })
        }
        LetterProps.prototype.update = function (e, t, r, i, n, s) {
          ;(this._mdf.o = !1),
            (this._mdf.sw = !1),
            (this._mdf.sc = !1),
            (this._mdf.fc = !1),
            (this._mdf.m = !1),
            (this._mdf.p = !1)
          var a = !1
          return (
            this.o !== e && ((this.o = e), (this._mdf.o = !0), (a = !0)),
            this.sw !== t && ((this.sw = t), (this._mdf.sw = !0), (a = !0)),
            this.sc !== r && ((this.sc = r), (this._mdf.sc = !0), (a = !0)),
            this.fc !== i && ((this.fc = i), (this._mdf.fc = !0), (a = !0)),
            this.m !== n && ((this.m = n), (this._mdf.m = !0), (a = !0)),
            s.length &&
              (this.p[0] !== s[0] ||
                this.p[1] !== s[1] ||
                this.p[4] !== s[4] ||
                this.p[5] !== s[5] ||
                this.p[12] !== s[12] ||
                this.p[13] !== s[13]) &&
              ((this.p = s), (this._mdf.p = !0), (a = !0)),
            a
          )
        }
        function TextProperty(e, t) {
          ;(this._frameId = initialDefaultFrame),
            (this.pv = ''),
            (this.v = ''),
            (this.kf = !1),
            (this._isFirstFrame = !0),
            (this._mdf = !1),
            t.d && t.d.sid && (t.d = e.globalData.slotManager.getProp(t.d)),
            (this.data = t),
            (this.elem = e),
            (this.comp = this.elem.comp),
            (this.keysIndex = 0),
            (this.canResize = !1),
            (this.minimumFontSize = 1),
            (this.effectsSequence = []),
            (this.currentData = {
              ascent: 0,
              boxWidth: this.defaultBoxWidth,
              f: '',
              fStyle: '',
              fWeight: '',
              fc: '',
              j: '',
              justifyOffset: '',
              l: [],
              lh: 0,
              lineWidths: [],
              ls: '',
              of: '',
              s: '',
              sc: '',
              sw: 0,
              t: 0,
              tr: 0,
              sz: 0,
              ps: null,
              fillColorAnim: !1,
              strokeColorAnim: !1,
              strokeWidthAnim: !1,
              yOffset: 0,
              finalSize: 0,
              finalText: [],
              finalLineHeight: 0,
              __complete: !1
            }),
            this.copyData(this.currentData, this.data.d.k[0].s),
            this.searchProperty() || this.completeTextData(this.currentData)
        }
        ;(TextProperty.prototype.defaultBoxWidth = [0, 0]),
          (TextProperty.prototype.copyData = function (e, t) {
            for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
            return e
          }),
          (TextProperty.prototype.setCurrentData = function (e) {
            e.__complete || this.completeTextData(e),
              (this.currentData = e),
              (this.currentData.boxWidth = this.currentData.boxWidth || this.defaultBoxWidth),
              (this._mdf = !0)
          }),
          (TextProperty.prototype.searchProperty = function () {
            return this.searchKeyframes()
          }),
          (TextProperty.prototype.searchKeyframes = function () {
            return (
              (this.kf = this.data.d.k.length > 1),
              this.kf && this.addEffect(this.getKeyframeValue.bind(this)),
              this.kf
            )
          }),
          (TextProperty.prototype.addEffect = function (e) {
            this.effectsSequence.push(e), this.elem.addDynamicProperty(this)
          }),
          (TextProperty.prototype.getValue = function (e) {
            if (
              !(
                (this.elem.globalData.frameId === this.frameId || !this.effectsSequence.length) &&
                !e
              )
            ) {
              this.currentData.t = this.data.d.k[this.keysIndex].s.t
              var t = this.currentData,
                r = this.keysIndex
              if (this.lock) {
                this.setCurrentData(this.currentData)
                return
              }
              ;(this.lock = !0), (this._mdf = !1)
              var i,
                n = this.effectsSequence.length,
                s = e || this.data.d.k[this.keysIndex].s
              for (i = 0; i < n; i += 1)
                r !== this.keysIndex
                  ? (s = this.effectsSequence[i](s, s.t))
                  : (s = this.effectsSequence[i](this.currentData, s.t))
              t !== s && this.setCurrentData(s),
                (this.v = this.currentData),
                (this.pv = this.v),
                (this.lock = !1),
                (this.frameId = this.elem.globalData.frameId)
            }
          }),
          (TextProperty.prototype.getKeyframeValue = function () {
            for (
              var e = this.data.d.k, t = this.elem.comp.renderedFrame, r = 0, i = e.length;
              r <= i - 1 && !(r === i - 1 || e[r + 1].t > t);

            )
              r += 1
            return this.keysIndex !== r && (this.keysIndex = r), this.data.d.k[this.keysIndex].s
          }),
          (TextProperty.prototype.buildFinalText = function (e) {
            for (var t = [], r = 0, i = e.length, n, s, a = !1, l = !1, o = ''; r < i; )
              (a = l),
                (l = !1),
                (n = e.charCodeAt(r)),
                (o = e.charAt(r)),
                FontManager.isCombinedCharacter(n)
                  ? (a = !0)
                  : n >= 55296 && n <= 56319
                    ? FontManager.isRegionalFlag(e, r)
                      ? (o = e.substr(r, 14))
                      : ((s = e.charCodeAt(r + 1)),
                        s >= 56320 &&
                          s <= 57343 &&
                          (FontManager.isModifier(n, s)
                            ? ((o = e.substr(r, 2)), (a = !0))
                            : FontManager.isFlagEmoji(e.substr(r, 4))
                              ? (o = e.substr(r, 4))
                              : (o = e.substr(r, 2))))
                    : n > 56319
                      ? ((s = e.charCodeAt(r + 1)), FontManager.isVariationSelector(n) && (a = !0))
                      : FontManager.isZeroWidthJoiner(n) && ((a = !0), (l = !0)),
                a ? ((t[t.length - 1] += o), (a = !1)) : t.push(o),
                (r += o.length)
            return t
          }),
          (TextProperty.prototype.completeTextData = function (e) {
            e.__complete = !0
            var t = this.elem.globalData.fontManager,
              r = this.data,
              i = [],
              n,
              s,
              a,
              l = 0,
              o,
              f = r.m.g,
              u = 0,
              E = 0,
              c = 0,
              b = [],
              x = 0,
              y = 0,
              _,
              m,
              A = t.getFontByName(e.f),
              d,
              g = 0,
              C = getFontProperties(A)
            ;(e.fWeight = C.weight),
              (e.fStyle = C.style),
              (e.finalSize = e.s),
              (e.finalText = this.buildFinalText(e.t)),
              (s = e.finalText.length),
              (e.finalLineHeight = e.lh)
            var P = (e.tr / 1e3) * e.finalSize,
              k
            if (e.sz)
              for (var M = !0, D = e.sz[0], W = e.sz[1], H, $; M; ) {
                ;($ = this.buildFinalText(e.t)),
                  (H = 0),
                  (x = 0),
                  (s = $.length),
                  (P = (e.tr / 1e3) * e.finalSize)
                var Z = -1
                for (n = 0; n < s; n += 1)
                  (k = $[n].charCodeAt(0)),
                    (a = !1),
                    $[n] === ' '
                      ? (Z = n)
                      : (k === 13 || k === 3) &&
                        ((x = 0), (a = !0), (H += e.finalLineHeight || e.finalSize * 1.2)),
                    t.chars
                      ? ((d = t.getCharData($[n], A.fStyle, A.fFamily)),
                        (g = a ? 0 : (d.w * e.finalSize) / 100))
                      : (g = t.measureText($[n], e.f, e.finalSize)),
                    x + g > D && $[n] !== ' '
                      ? (Z === -1 ? (s += 1) : (n = Z),
                        (H += e.finalLineHeight || e.finalSize * 1.2),
                        $.splice(n, Z === n ? 1 : 0, '\r'),
                        (Z = -1),
                        (x = 0))
                      : ((x += g), (x += P))
                ;(H += (A.ascent * e.finalSize) / 100),
                  this.canResize && e.finalSize > this.minimumFontSize && W < H
                    ? ((e.finalSize -= 1), (e.finalLineHeight = (e.finalSize * e.lh) / e.s))
                    : ((e.finalText = $), (s = e.finalText.length), (M = !1))
              }
            ;(x = -P), (g = 0)
            var Y = 0,
              L
            for (n = 0; n < s; n += 1)
              if (
                ((a = !1),
                (L = e.finalText[n]),
                (k = L.charCodeAt(0)),
                k === 13 || k === 3
                  ? ((Y = 0),
                    b.push(x),
                    (y = x > y ? x : y),
                    (x = -2 * P),
                    (o = ''),
                    (a = !0),
                    (c += 1))
                  : (o = L),
                t.chars
                  ? ((d = t.getCharData(L, A.fStyle, t.getFontByName(e.f).fFamily)),
                    (g = a ? 0 : (d.w * e.finalSize) / 100))
                  : (g = t.measureText(o, e.f, e.finalSize)),
                L === ' ' ? (Y += g + P) : ((x += g + P + Y), (Y = 0)),
                i.push({
                  l: g,
                  an: g,
                  add: u,
                  n: a,
                  anIndexes: [],
                  val: o,
                  line: c,
                  animatorJustifyOffset: 0
                }),
                f == 2)
              ) {
                if (((u += g), o === '' || o === ' ' || n === s - 1)) {
                  for ((o === '' || o === ' ') && (u -= g); E <= n; )
                    (i[E].an = u), (i[E].ind = l), (i[E].extra = g), (E += 1)
                  ;(l += 1), (u = 0)
                }
              } else if (f == 3) {
                if (((u += g), o === '' || n === s - 1)) {
                  for (o === '' && (u -= g); E <= n; )
                    (i[E].an = u), (i[E].ind = l), (i[E].extra = g), (E += 1)
                  ;(u = 0), (l += 1)
                }
              } else (i[l].ind = l), (i[l].extra = 0), (l += 1)
            if (((e.l = i), (y = x > y ? x : y), b.push(x), e.sz))
              (e.boxWidth = e.sz[0]), (e.justifyOffset = 0)
            else
              switch (((e.boxWidth = y), e.j)) {
                case 1:
                  e.justifyOffset = -e.boxWidth
                  break
                case 2:
                  e.justifyOffset = -e.boxWidth / 2
                  break
                default:
                  e.justifyOffset = 0
              }
            e.lineWidths = b
            var B = r.a,
              T,
              j
            m = B.length
            var S,
              R,
              V = []
            for (_ = 0; _ < m; _ += 1) {
              for (
                T = B[_],
                  T.a.sc && (e.strokeColorAnim = !0),
                  T.a.sw && (e.strokeWidthAnim = !0),
                  (T.a.fc || T.a.fh || T.a.fs || T.a.fb) && (e.fillColorAnim = !0),
                  R = 0,
                  S = T.s.b,
                  n = 0;
                n < s;
                n += 1
              )
                (j = i[n]),
                  (j.anIndexes[_] = R),
                  ((S == 1 && j.val !== '') ||
                    (S == 2 && j.val !== '' && j.val !== ' ') ||
                    (S == 3 && (j.n || j.val == ' ' || n == s - 1)) ||
                    (S == 4 && (j.n || n == s - 1))) &&
                    (T.s.rn === 1 && V.push(R), (R += 1))
              r.a[_].s.totalChars = R
              var K = -1,
                re
              if (T.s.rn === 1)
                for (n = 0; n < s; n += 1)
                  (j = i[n]),
                    K != j.anIndexes[_] &&
                      ((K = j.anIndexes[_]),
                      (re = V.splice(Math.floor(Math.random() * V.length), 1)[0])),
                    (j.anIndexes[_] = re)
            }
            ;(e.yOffset = e.finalLineHeight || e.finalSize * 1.2),
              (e.ls = e.ls || 0),
              (e.ascent = (A.ascent * e.finalSize) / 100)
          }),
          (TextProperty.prototype.updateDocumentData = function (e, t) {
            t = t === void 0 ? this.keysIndex : t
            var r = this.copyData({}, this.data.d.k[t].s)
            ;(r = this.copyData(r, e)),
              (this.data.d.k[t].s = r),
              this.recalculate(t),
              this.setCurrentData(r),
              this.elem.addDynamicProperty(this)
          }),
          (TextProperty.prototype.recalculate = function (e) {
            var t = this.data.d.k[e].s
            ;(t.__complete = !1), (this.keysIndex = 0), (this._isFirstFrame = !0), this.getValue(t)
          }),
          (TextProperty.prototype.canResizeFont = function (e) {
            ;(this.canResize = e),
              this.recalculate(this.keysIndex),
              this.elem.addDynamicProperty(this)
          }),
          (TextProperty.prototype.setMinimumFontSize = function (e) {
            ;(this.minimumFontSize = Math.floor(e) || 1),
              this.recalculate(this.keysIndex),
              this.elem.addDynamicProperty(this)
          })
        var TextSelectorProp = (function () {
          var e = Math.max,
            t = Math.min,
            r = Math.floor
          function i(s, a) {
            ;(this._currentTextLength = -1),
              (this.k = !1),
              (this.data = a),
              (this.elem = s),
              (this.comp = s.comp),
              (this.finalS = 0),
              (this.finalE = 0),
              this.initDynamicPropertyContainer(s),
              (this.s = PropertyFactory.getProp(s, a.s || { k: 0 }, 0, 0, this)),
              'e' in a
                ? (this.e = PropertyFactory.getProp(s, a.e, 0, 0, this))
                : (this.e = { v: 100 }),
              (this.o = PropertyFactory.getProp(s, a.o || { k: 0 }, 0, 0, this)),
              (this.xe = PropertyFactory.getProp(s, a.xe || { k: 0 }, 0, 0, this)),
              (this.ne = PropertyFactory.getProp(s, a.ne || { k: 0 }, 0, 0, this)),
              (this.sm = PropertyFactory.getProp(s, a.sm || { k: 100 }, 0, 0, this)),
              (this.a = PropertyFactory.getProp(s, a.a, 0, 0.01, this)),
              this.dynamicProperties.length || this.getValue()
          }
          ;(i.prototype = {
            getMult: function (a) {
              this._currentTextLength !== this.elem.textProperty.currentData.l.length &&
                this.getValue()
              var l = 0,
                o = 0,
                f = 1,
                u = 1
              this.ne.v > 0 ? (l = this.ne.v / 100) : (o = -this.ne.v / 100),
                this.xe.v > 0 ? (f = 1 - this.xe.v / 100) : (u = 1 + this.xe.v / 100)
              var E = BezierFactory.getBezierEasing(l, o, f, u).get,
                c = 0,
                b = this.finalS,
                x = this.finalE,
                y = this.data.sh
              if (y === 2)
                x === b
                  ? (c = a >= x ? 1 : 0)
                  : (c = e(0, t(0.5 / (x - b) + (a - b) / (x - b), 1))),
                  (c = E(c))
              else if (y === 3)
                x === b
                  ? (c = a >= x ? 0 : 1)
                  : (c = 1 - e(0, t(0.5 / (x - b) + (a - b) / (x - b), 1))),
                  (c = E(c))
              else if (y === 4)
                x === b
                  ? (c = 0)
                  : ((c = e(0, t(0.5 / (x - b) + (a - b) / (x - b), 1))),
                    c < 0.5 ? (c *= 2) : (c = 1 - 2 * (c - 0.5))),
                  (c = E(c))
              else if (y === 5) {
                if (x === b) c = 0
                else {
                  var _ = x - b
                  a = t(e(0, a + 0.5 - b), x - b)
                  var m = -_ / 2 + a,
                    A = _ / 2
                  c = Math.sqrt(1 - (m * m) / (A * A))
                }
                c = E(c)
              } else
                y === 6
                  ? (x === b
                      ? (c = 0)
                      : ((a = t(e(0, a + 0.5 - b), x - b)),
                        (c = (1 + Math.cos(Math.PI + (Math.PI * 2 * a) / (x - b))) / 2)),
                    (c = E(c)))
                  : (a >= r(b) &&
                      (a - b < 0 ? (c = e(0, t(t(x, 1) - (b - a), 1))) : (c = e(0, t(x - a, 1)))),
                    (c = E(c)))
              if (this.sm.v !== 100) {
                var d = this.sm.v * 0.01
                d === 0 && (d = 1e-8)
                var g = 0.5 - d * 0.5
                c < g ? (c = 0) : ((c = (c - g) / d), c > 1 && (c = 1))
              }
              return c * this.a.v
            },
            getValue: function (a) {
              this.iterateDynamicProperties(),
                (this._mdf = a || this._mdf),
                (this._currentTextLength = this.elem.textProperty.currentData.l.length || 0),
                a && this.data.r === 2 && (this.e.v = this._currentTextLength)
              var l = this.data.r === 2 ? 1 : 100 / this.data.totalChars,
                o = this.o.v / l,
                f = this.s.v / l + o,
                u = this.e.v / l + o
              if (f > u) {
                var E = f
                ;(f = u), (u = E)
              }
              ;(this.finalS = f), (this.finalE = u)
            }
          }),
            extendPrototype([DynamicPropertyContainer], i)
          function n(s, a, l) {
            return new i(s, a)
          }
          return { getTextSelectorProp: n }
        })()
        function TextAnimatorDataProperty(e, t, r) {
          var i = { propType: !1 },
            n = PropertyFactory.getProp,
            s = t.a
          ;(this.a = {
            r: s.r ? n(e, s.r, 0, degToRads, r) : i,
            rx: s.rx ? n(e, s.rx, 0, degToRads, r) : i,
            ry: s.ry ? n(e, s.ry, 0, degToRads, r) : i,
            sk: s.sk ? n(e, s.sk, 0, degToRads, r) : i,
            sa: s.sa ? n(e, s.sa, 0, degToRads, r) : i,
            s: s.s ? n(e, s.s, 1, 0.01, r) : i,
            a: s.a ? n(e, s.a, 1, 0, r) : i,
            o: s.o ? n(e, s.o, 0, 0.01, r) : i,
            p: s.p ? n(e, s.p, 1, 0, r) : i,
            sw: s.sw ? n(e, s.sw, 0, 0, r) : i,
            sc: s.sc ? n(e, s.sc, 1, 0, r) : i,
            fc: s.fc ? n(e, s.fc, 1, 0, r) : i,
            fh: s.fh ? n(e, s.fh, 0, 0, r) : i,
            fs: s.fs ? n(e, s.fs, 0, 0.01, r) : i,
            fb: s.fb ? n(e, s.fb, 0, 0.01, r) : i,
            t: s.t ? n(e, s.t, 0, 0, r) : i
          }),
            (this.s = TextSelectorProp.getTextSelectorProp(e, t.s, r)),
            (this.s.t = t.s.t)
        }
        function TextAnimatorProperty(e, t, r) {
          ;(this._isFirstFrame = !0),
            (this._hasMaskedPath = !1),
            (this._frameId = -1),
            (this._textData = e),
            (this._renderType = t),
            (this._elem = r),
            (this._animatorsData = createSizedArray(this._textData.a.length)),
            (this._pathData = {}),
            (this._moreOptions = { alignment: {} }),
            (this.renderedLetters = []),
            (this.lettersChangedFlag = !1),
            this.initDynamicPropertyContainer(r)
        }
        ;(TextAnimatorProperty.prototype.searchProperties = function () {
          var e,
            t = this._textData.a.length,
            r,
            i = PropertyFactory.getProp
          for (e = 0; e < t; e += 1)
            (r = this._textData.a[e]),
              (this._animatorsData[e] = new TextAnimatorDataProperty(this._elem, r, this))
          this._textData.p && 'm' in this._textData.p
            ? ((this._pathData = {
                a: i(this._elem, this._textData.p.a, 0, 0, this),
                f: i(this._elem, this._textData.p.f, 0, 0, this),
                l: i(this._elem, this._textData.p.l, 0, 0, this),
                r: i(this._elem, this._textData.p.r, 0, 0, this),
                p: i(this._elem, this._textData.p.p, 0, 0, this),
                m: this._elem.maskManager.getMaskProperty(this._textData.p.m)
              }),
              (this._hasMaskedPath = !0))
            : (this._hasMaskedPath = !1),
            (this._moreOptions.alignment = i(this._elem, this._textData.m.a, 1, 0, this))
        }),
          (TextAnimatorProperty.prototype.getMeasures = function (e, t) {
            if (
              ((this.lettersChangedFlag = t),
              !(
                !this._mdf &&
                !this._isFirstFrame &&
                !t &&
                (!this._hasMaskedPath || !this._pathData.m._mdf)
              ))
            ) {
              this._isFirstFrame = !1
              var r = this._moreOptions.alignment.v,
                i = this._animatorsData,
                n = this._textData,
                s = this.mHelper,
                a = this._renderType,
                l = this.renderedLetters.length,
                o,
                f,
                u,
                E,
                c = e.l,
                b,
                x,
                y,
                _,
                m,
                A,
                d,
                g,
                C,
                P,
                k,
                M,
                D,
                W,
                H
              if (this._hasMaskedPath) {
                if (((H = this._pathData.m), !this._pathData.n || this._pathData._mdf)) {
                  var $ = H.v
                  this._pathData.r.v && ($ = $.reverse()),
                    (b = { tLength: 0, segments: [] }),
                    (E = $._length - 1)
                  var Z
                  for (M = 0, u = 0; u < E; u += 1)
                    (Z = bez.buildBezierData(
                      $.v[u],
                      $.v[u + 1],
                      [$.o[u][0] - $.v[u][0], $.o[u][1] - $.v[u][1]],
                      [$.i[u + 1][0] - $.v[u + 1][0], $.i[u + 1][1] - $.v[u + 1][1]]
                    )),
                      (b.tLength += Z.segmentLength),
                      b.segments.push(Z),
                      (M += Z.segmentLength)
                  ;(u = E),
                    H.v.c &&
                      ((Z = bez.buildBezierData(
                        $.v[u],
                        $.v[0],
                        [$.o[u][0] - $.v[u][0], $.o[u][1] - $.v[u][1]],
                        [$.i[0][0] - $.v[0][0], $.i[0][1] - $.v[0][1]]
                      )),
                      (b.tLength += Z.segmentLength),
                      b.segments.push(Z),
                      (M += Z.segmentLength)),
                    (this._pathData.pi = b)
                }
                if (
                  ((b = this._pathData.pi),
                  (x = this._pathData.f.v),
                  (d = 0),
                  (A = 1),
                  (_ = 0),
                  (m = !0),
                  (P = b.segments),
                  x < 0 && H.v.c)
                )
                  for (
                    b.tLength < Math.abs(x) && (x = -Math.abs(x) % b.tLength),
                      d = P.length - 1,
                      C = P[d].points,
                      A = C.length - 1;
                    x < 0;

                  )
                    (x += C[A].partialLength),
                      (A -= 1),
                      A < 0 && ((d -= 1), (C = P[d].points), (A = C.length - 1))
                ;(C = P[d].points), (g = C[A - 1]), (y = C[A]), (k = y.partialLength)
              }
              ;(E = c.length), (o = 0), (f = 0)
              var Y = e.finalSize * 1.2 * 0.714,
                L = !0,
                B,
                T,
                j,
                S,
                R
              S = i.length
              var V,
                K = -1,
                re,
                ne,
                oe,
                ae = x,
                ce = d,
                de = A,
                me = -1,
                ue,
                pe,
                F,
                I,
                O,
                z,
                N,
                U,
                q = '',
                J = this.defaultPropsArray,
                X
              if (e.j === 2 || e.j === 1) {
                var G = 0,
                  te = 0,
                  Q = e.j === 2 ? -0.5 : -1,
                  ee = 0,
                  ie = !0
                for (u = 0; u < E; u += 1)
                  if (c[u].n) {
                    for (G && (G += te); ee < u; ) (c[ee].animatorJustifyOffset = G), (ee += 1)
                    ;(G = 0), (ie = !0)
                  } else {
                    for (j = 0; j < S; j += 1)
                      (B = i[j].a),
                        B.t.propType &&
                          (ie && e.j === 2 && (te += B.t.v * Q),
                          (T = i[j].s),
                          (V = T.getMult(c[u].anIndexes[j], n.a[j].s.totalChars)),
                          V.length ? (G += B.t.v * V[0] * Q) : (G += B.t.v * V * Q))
                    ie = !1
                  }
                for (G && (G += te); ee < u; ) (c[ee].animatorJustifyOffset = G), (ee += 1)
              }
              for (u = 0; u < E; u += 1) {
                if ((s.reset(), (ue = 1), c[u].n))
                  (o = 0),
                    (f += e.yOffset),
                    (f += L ? 1 : 0),
                    (x = ae),
                    (L = !1),
                    this._hasMaskedPath &&
                      ((d = ce),
                      (A = de),
                      (C = P[d].points),
                      (g = C[A - 1]),
                      (y = C[A]),
                      (k = y.partialLength),
                      (_ = 0)),
                    (q = ''),
                    (U = ''),
                    (z = ''),
                    (X = ''),
                    (J = this.defaultPropsArray)
                else {
                  if (this._hasMaskedPath) {
                    if (me !== c[u].line) {
                      switch (e.j) {
                        case 1:
                          x += M - e.lineWidths[c[u].line]
                          break
                        case 2:
                          x += (M - e.lineWidths[c[u].line]) / 2
                          break
                      }
                      me = c[u].line
                    }
                    K !== c[u].ind &&
                      (c[K] && (x += c[K].extra), (x += c[u].an / 2), (K = c[u].ind)),
                      (x += r[0] * c[u].an * 0.005)
                    var se = 0
                    for (j = 0; j < S; j += 1)
                      (B = i[j].a),
                        B.p.propType &&
                          ((T = i[j].s),
                          (V = T.getMult(c[u].anIndexes[j], n.a[j].s.totalChars)),
                          V.length ? (se += B.p.v[0] * V[0]) : (se += B.p.v[0] * V)),
                        B.a.propType &&
                          ((T = i[j].s),
                          (V = T.getMult(c[u].anIndexes[j], n.a[j].s.totalChars)),
                          V.length ? (se += B.a.v[0] * V[0]) : (se += B.a.v[0] * V))
                    for (
                      m = !0,
                        this._pathData.a.v &&
                          ((x =
                            c[0].an * 0.5 +
                            ((M - this._pathData.f.v - c[0].an * 0.5 - c[c.length - 1].an * 0.5) *
                              K) /
                              (E - 1)),
                          (x += this._pathData.f.v));
                      m;

                    )
                      _ + k >= x + se || !C
                        ? ((D = (x + se - _) / y.partialLength),
                          (ne = g.point[0] + (y.point[0] - g.point[0]) * D),
                          (oe = g.point[1] + (y.point[1] - g.point[1]) * D),
                          s.translate(-r[0] * c[u].an * 0.005, -(r[1] * Y) * 0.01),
                          (m = !1))
                        : C &&
                          ((_ += y.partialLength),
                          (A += 1),
                          A >= C.length &&
                            ((A = 0),
                            (d += 1),
                            P[d]
                              ? (C = P[d].points)
                              : H.v.c
                                ? ((A = 0), (d = 0), (C = P[d].points))
                                : ((_ -= y.partialLength), (C = null))),
                          C && ((g = y), (y = C[A]), (k = y.partialLength)))
                    ;(re = c[u].an / 2 - c[u].add), s.translate(-re, 0, 0)
                  } else
                    (re = c[u].an / 2 - c[u].add),
                      s.translate(-re, 0, 0),
                      s.translate(-r[0] * c[u].an * 0.005, -r[1] * Y * 0.01, 0)
                  for (j = 0; j < S; j += 1)
                    (B = i[j].a),
                      B.t.propType &&
                        ((T = i[j].s),
                        (V = T.getMult(c[u].anIndexes[j], n.a[j].s.totalChars)),
                        (o !== 0 || e.j !== 0) &&
                          (this._hasMaskedPath
                            ? V.length
                              ? (x += B.t.v * V[0])
                              : (x += B.t.v * V)
                            : V.length
                              ? (o += B.t.v * V[0])
                              : (o += B.t.v * V)))
                  for (
                    e.strokeWidthAnim && (F = e.sw || 0),
                      e.strokeColorAnim &&
                        (e.sc ? (pe = [e.sc[0], e.sc[1], e.sc[2]]) : (pe = [0, 0, 0])),
                      e.fillColorAnim && e.fc && (I = [e.fc[0], e.fc[1], e.fc[2]]),
                      j = 0;
                    j < S;
                    j += 1
                  )
                    (B = i[j].a),
                      B.a.propType &&
                        ((T = i[j].s),
                        (V = T.getMult(c[u].anIndexes[j], n.a[j].s.totalChars)),
                        V.length
                          ? s.translate(-B.a.v[0] * V[0], -B.a.v[1] * V[1], B.a.v[2] * V[2])
                          : s.translate(-B.a.v[0] * V, -B.a.v[1] * V, B.a.v[2] * V))
                  for (j = 0; j < S; j += 1)
                    (B = i[j].a),
                      B.s.propType &&
                        ((T = i[j].s),
                        (V = T.getMult(c[u].anIndexes[j], n.a[j].s.totalChars)),
                        V.length
                          ? s.scale(1 + (B.s.v[0] - 1) * V[0], 1 + (B.s.v[1] - 1) * V[1], 1)
                          : s.scale(1 + (B.s.v[0] - 1) * V, 1 + (B.s.v[1] - 1) * V, 1))
                  for (j = 0; j < S; j += 1) {
                    if (
                      ((B = i[j].a),
                      (T = i[j].s),
                      (V = T.getMult(c[u].anIndexes[j], n.a[j].s.totalChars)),
                      B.sk.propType &&
                        (V.length
                          ? s.skewFromAxis(-B.sk.v * V[0], B.sa.v * V[1])
                          : s.skewFromAxis(-B.sk.v * V, B.sa.v * V)),
                      B.r.propType && (V.length ? s.rotateZ(-B.r.v * V[2]) : s.rotateZ(-B.r.v * V)),
                      B.ry.propType &&
                        (V.length ? s.rotateY(B.ry.v * V[1]) : s.rotateY(B.ry.v * V)),
                      B.rx.propType &&
                        (V.length ? s.rotateX(B.rx.v * V[0]) : s.rotateX(B.rx.v * V)),
                      B.o.propType &&
                        (V.length
                          ? (ue += (B.o.v * V[0] - ue) * V[0])
                          : (ue += (B.o.v * V - ue) * V)),
                      e.strokeWidthAnim &&
                        B.sw.propType &&
                        (V.length ? (F += B.sw.v * V[0]) : (F += B.sw.v * V)),
                      e.strokeColorAnim && B.sc.propType)
                    )
                      for (O = 0; O < 3; O += 1)
                        V.length
                          ? (pe[O] += (B.sc.v[O] - pe[O]) * V[0])
                          : (pe[O] += (B.sc.v[O] - pe[O]) * V)
                    if (e.fillColorAnim && e.fc) {
                      if (B.fc.propType)
                        for (O = 0; O < 3; O += 1)
                          V.length
                            ? (I[O] += (B.fc.v[O] - I[O]) * V[0])
                            : (I[O] += (B.fc.v[O] - I[O]) * V)
                      B.fh.propType &&
                        (V.length
                          ? (I = addHueToRGB(I, B.fh.v * V[0]))
                          : (I = addHueToRGB(I, B.fh.v * V))),
                        B.fs.propType &&
                          (V.length
                            ? (I = addSaturationToRGB(I, B.fs.v * V[0]))
                            : (I = addSaturationToRGB(I, B.fs.v * V))),
                        B.fb.propType &&
                          (V.length
                            ? (I = addBrightnessToRGB(I, B.fb.v * V[0]))
                            : (I = addBrightnessToRGB(I, B.fb.v * V)))
                    }
                  }
                  for (j = 0; j < S; j += 1)
                    (B = i[j].a),
                      B.p.propType &&
                        ((T = i[j].s),
                        (V = T.getMult(c[u].anIndexes[j], n.a[j].s.totalChars)),
                        this._hasMaskedPath
                          ? V.length
                            ? s.translate(0, B.p.v[1] * V[0], -B.p.v[2] * V[1])
                            : s.translate(0, B.p.v[1] * V, -B.p.v[2] * V)
                          : V.length
                            ? s.translate(B.p.v[0] * V[0], B.p.v[1] * V[1], -B.p.v[2] * V[2])
                            : s.translate(B.p.v[0] * V, B.p.v[1] * V, -B.p.v[2] * V))
                  if (
                    (e.strokeWidthAnim && (z = F < 0 ? 0 : F),
                    e.strokeColorAnim &&
                      (N =
                        'rgb(' +
                        Math.round(pe[0] * 255) +
                        ',' +
                        Math.round(pe[1] * 255) +
                        ',' +
                        Math.round(pe[2] * 255) +
                        ')'),
                    e.fillColorAnim &&
                      e.fc &&
                      (U =
                        'rgb(' +
                        Math.round(I[0] * 255) +
                        ',' +
                        Math.round(I[1] * 255) +
                        ',' +
                        Math.round(I[2] * 255) +
                        ')'),
                    this._hasMaskedPath)
                  ) {
                    if (
                      (s.translate(0, -e.ls),
                      s.translate(0, r[1] * Y * 0.01 + f, 0),
                      this._pathData.p.v)
                    ) {
                      W = (y.point[1] - g.point[1]) / (y.point[0] - g.point[0])
                      var le = (Math.atan(W) * 180) / Math.PI
                      y.point[0] < g.point[0] && (le += 180), s.rotate((-le * Math.PI) / 180)
                    }
                    s.translate(ne, oe, 0),
                      (x -= r[0] * c[u].an * 0.005),
                      c[u + 1] &&
                        K !== c[u + 1].ind &&
                        ((x += c[u].an / 2), (x += e.tr * 0.001 * e.finalSize))
                  } else {
                    switch (
                      (s.translate(o, f, 0),
                      e.ps && s.translate(e.ps[0], e.ps[1] + e.ascent, 0),
                      e.j)
                    ) {
                      case 1:
                        s.translate(
                          c[u].animatorJustifyOffset +
                            e.justifyOffset +
                            (e.boxWidth - e.lineWidths[c[u].line]),
                          0,
                          0
                        )
                        break
                      case 2:
                        s.translate(
                          c[u].animatorJustifyOffset +
                            e.justifyOffset +
                            (e.boxWidth - e.lineWidths[c[u].line]) / 2,
                          0,
                          0
                        )
                        break
                    }
                    s.translate(0, -e.ls),
                      s.translate(re, 0, 0),
                      s.translate(r[0] * c[u].an * 0.005, r[1] * Y * 0.01, 0),
                      (o += c[u].l + e.tr * 0.001 * e.finalSize)
                  }
                  a === 'html'
                    ? (q = s.toCSS())
                    : a === 'svg'
                      ? (q = s.to2dCSS())
                      : (J = [
                          s.props[0],
                          s.props[1],
                          s.props[2],
                          s.props[3],
                          s.props[4],
                          s.props[5],
                          s.props[6],
                          s.props[7],
                          s.props[8],
                          s.props[9],
                          s.props[10],
                          s.props[11],
                          s.props[12],
                          s.props[13],
                          s.props[14],
                          s.props[15]
                        ]),
                    (X = ue)
                }
                l <= u
                  ? ((R = new LetterProps(X, z, N, U, q, J)),
                    this.renderedLetters.push(R),
                    (l += 1),
                    (this.lettersChangedFlag = !0))
                  : ((R = this.renderedLetters[u]),
                    (this.lettersChangedFlag =
                      R.update(X, z, N, U, q, J) || this.lettersChangedFlag))
              }
            }
          }),
          (TextAnimatorProperty.prototype.getValue = function () {
            this._elem.globalData.frameId !== this._frameId &&
              ((this._frameId = this._elem.globalData.frameId), this.iterateDynamicProperties())
          }),
          (TextAnimatorProperty.prototype.mHelper = new Matrix()),
          (TextAnimatorProperty.prototype.defaultPropsArray = []),
          extendPrototype([DynamicPropertyContainer], TextAnimatorProperty)
        function ITextElement() {}
        ;(ITextElement.prototype.initElement = function (e, t, r) {
          ;(this.lettersChangedFlag = !0),
            this.initFrame(),
            this.initBaseData(e, t, r),
            (this.textProperty = new TextProperty(this, e.t, this.dynamicProperties)),
            (this.textAnimator = new TextAnimatorProperty(e.t, this.renderType, this)),
            this.initTransform(e, t, r),
            this.initHierarchy(),
            this.initRenderable(),
            this.initRendererElement(),
            this.createContainerElements(),
            this.createRenderableComponents(),
            this.createContent(),
            this.hide(),
            this.textAnimator.searchProperties(this.dynamicProperties)
        }),
          (ITextElement.prototype.prepareFrame = function (e) {
            ;(this._mdf = !1),
              this.prepareRenderableFrame(e),
              this.prepareProperties(e, this.isInRange)
          }),
          (ITextElement.prototype.createPathShape = function (e, t) {
            var r,
              i = t.length,
              n,
              s = ''
            for (r = 0; r < i; r += 1)
              t[r].ty === 'sh' && ((n = t[r].ks.k), (s += buildShapeString(n, n.i.length, !0, e)))
            return s
          }),
          (ITextElement.prototype.updateDocumentData = function (e, t) {
            this.textProperty.updateDocumentData(e, t)
          }),
          (ITextElement.prototype.canResizeFont = function (e) {
            this.textProperty.canResizeFont(e)
          }),
          (ITextElement.prototype.setMinimumFontSize = function (e) {
            this.textProperty.setMinimumFontSize(e)
          }),
          (ITextElement.prototype.applyTextPropertiesToMatrix = function (e, t, r, i, n) {
            switch (
              (e.ps && t.translate(e.ps[0], e.ps[1] + e.ascent, 0), t.translate(0, -e.ls, 0), e.j)
            ) {
              case 1:
                t.translate(e.justifyOffset + (e.boxWidth - e.lineWidths[r]), 0, 0)
                break
              case 2:
                t.translate(e.justifyOffset + (e.boxWidth - e.lineWidths[r]) / 2, 0, 0)
                break
            }
            t.translate(i, n, 0)
          }),
          (ITextElement.prototype.buildColor = function (e) {
            return (
              'rgb(' +
              Math.round(e[0] * 255) +
              ',' +
              Math.round(e[1] * 255) +
              ',' +
              Math.round(e[2] * 255) +
              ')'
            )
          }),
          (ITextElement.prototype.emptyProp = new LetterProps()),
          (ITextElement.prototype.destroy = function () {}),
          (ITextElement.prototype.validateText = function () {
            ;(this.textProperty._mdf || this.textProperty._isFirstFrame) &&
              (this.buildNewText(),
              (this.textProperty._isFirstFrame = !1),
              (this.textProperty._mdf = !1))
          })
        var emptyShapeData = { shapes: [] }
        function SVGTextLottieElement(e, t, r) {
          ;(this.textSpans = []), (this.renderType = 'svg'), this.initElement(e, t, r)
        }
        extendPrototype(
          [
            BaseElement,
            TransformElement,
            SVGBaseElement,
            HierarchyElement,
            FrameElement,
            RenderableDOMElement,
            ITextElement
          ],
          SVGTextLottieElement
        ),
          (SVGTextLottieElement.prototype.createContent = function () {
            this.data.singleShape &&
              !this.globalData.fontManager.chars &&
              (this.textContainer = createNS('text'))
          }),
          (SVGTextLottieElement.prototype.buildTextContents = function (e) {
            for (var t = 0, r = e.length, i = [], n = ''; t < r; )
              e[t] === '\r' || e[t] === '' ? (i.push(n), (n = '')) : (n += e[t]), (t += 1)
            return i.push(n), i
          }),
          (SVGTextLottieElement.prototype.buildShapeData = function (e, t) {
            if (e.shapes && e.shapes.length) {
              var r = e.shapes[0]
              if (r.it) {
                var i = r.it[r.it.length - 1]
                i.s && ((i.s.k[0] = t), (i.s.k[1] = t))
              }
            }
            return e
          }),
          (SVGTextLottieElement.prototype.buildNewText = function () {
            this.addDynamicProperty(this)
            var e,
              t,
              r = this.textProperty.currentData
            ;(this.renderedLetters = createSizedArray(r ? r.l.length : 0)),
              r.fc
                ? this.layerElement.setAttribute('fill', this.buildColor(r.fc))
                : this.layerElement.setAttribute('fill', 'rgba(0,0,0,0)'),
              r.sc &&
                (this.layerElement.setAttribute('stroke', this.buildColor(r.sc)),
                this.layerElement.setAttribute('stroke-width', r.sw)),
              this.layerElement.setAttribute('font-size', r.finalSize)
            var i = this.globalData.fontManager.getFontByName(r.f)
            if (i.fClass) this.layerElement.setAttribute('class', i.fClass)
            else {
              this.layerElement.setAttribute('font-family', i.fFamily)
              var n = r.fWeight,
                s = r.fStyle
              this.layerElement.setAttribute('font-style', s),
                this.layerElement.setAttribute('font-weight', n)
            }
            this.layerElement.setAttribute('aria-label', r.t)
            var a = r.l || [],
              l = !!this.globalData.fontManager.chars
            t = a.length
            var o,
              f = this.mHelper,
              u = '',
              E = this.data.singleShape,
              c = 0,
              b = 0,
              x = !0,
              y = r.tr * 0.001 * r.finalSize
            if (E && !l && !r.sz) {
              var _ = this.textContainer,
                m = 'start'
              switch (r.j) {
                case 1:
                  m = 'end'
                  break
                case 2:
                  m = 'middle'
                  break
                default:
                  m = 'start'
                  break
              }
              _.setAttribute('text-anchor', m), _.setAttribute('letter-spacing', y)
              var A = this.buildTextContents(r.finalText)
              for (t = A.length, b = r.ps ? r.ps[1] + r.ascent : 0, e = 0; e < t; e += 1)
                (o = this.textSpans[e].span || createNS('tspan')),
                  (o.textContent = A[e]),
                  o.setAttribute('x', 0),
                  o.setAttribute('y', b),
                  (o.style.display = 'inherit'),
                  _.appendChild(o),
                  this.textSpans[e] || (this.textSpans[e] = { span: null, glyph: null }),
                  (this.textSpans[e].span = o),
                  (b += r.finalLineHeight)
              this.layerElement.appendChild(_)
            } else {
              var d = this.textSpans.length,
                g
              for (e = 0; e < t; e += 1) {
                if (
                  (this.textSpans[e] ||
                    (this.textSpans[e] = { span: null, childSpan: null, glyph: null }),
                  !l || !E || e === 0)
                ) {
                  if (((o = d > e ? this.textSpans[e].span : createNS(l ? 'g' : 'text')), d <= e)) {
                    if (
                      (o.setAttribute('stroke-linecap', 'butt'),
                      o.setAttribute('stroke-linejoin', 'round'),
                      o.setAttribute('stroke-miterlimit', '4'),
                      (this.textSpans[e].span = o),
                      l)
                    ) {
                      var C = createNS('g')
                      o.appendChild(C), (this.textSpans[e].childSpan = C)
                    }
                    ;(this.textSpans[e].span = o), this.layerElement.appendChild(o)
                  }
                  o.style.display = 'inherit'
                }
                if (
                  (f.reset(),
                  E &&
                    (a[e].n && ((c = -y), (b += r.yOffset), (b += x ? 1 : 0), (x = !1)),
                    this.applyTextPropertiesToMatrix(r, f, a[e].line, c, b),
                    (c += a[e].l || 0),
                    (c += y)),
                  l)
                ) {
                  g = this.globalData.fontManager.getCharData(
                    r.finalText[e],
                    i.fStyle,
                    this.globalData.fontManager.getFontByName(r.f).fFamily
                  )
                  var P
                  if (g.t === 1) P = new SVGCompElement(g.data, this.globalData, this)
                  else {
                    var k = emptyShapeData
                    g.data && g.data.shapes && (k = this.buildShapeData(g.data, r.finalSize)),
                      (P = new SVGShapeElement(k, this.globalData, this))
                  }
                  if (this.textSpans[e].glyph) {
                    var M = this.textSpans[e].glyph
                    this.textSpans[e].childSpan.removeChild(M.layerElement), M.destroy()
                  }
                  ;(this.textSpans[e].glyph = P),
                    (P._debug = !0),
                    P.prepareFrame(0),
                    P.renderFrame(),
                    this.textSpans[e].childSpan.appendChild(P.layerElement),
                    g.t === 1 &&
                      this.textSpans[e].childSpan.setAttribute(
                        'transform',
                        'scale(' + r.finalSize / 100 + ',' + r.finalSize / 100 + ')'
                      )
                } else
                  E &&
                    o.setAttribute(
                      'transform',
                      'translate(' + f.props[12] + ',' + f.props[13] + ')'
                    ),
                    (o.textContent = a[e].val),
                    o.setAttributeNS(
                      'http://www.w3.org/XML/1998/namespace',
                      'xml:space',
                      'preserve'
                    )
              }
              E && o && o.setAttribute('d', u)
            }
            for (; e < this.textSpans.length; )
              (this.textSpans[e].span.style.display = 'none'), (e += 1)
            this._sizeChanged = !0
          }),
          (SVGTextLottieElement.prototype.sourceRectAtTime = function () {
            if (
              (this.prepareFrame(this.comp.renderedFrame - this.data.st),
              this.renderInnerContent(),
              this._sizeChanged)
            ) {
              this._sizeChanged = !1
              var e = this.layerElement.getBBox()
              this.bbox = { top: e.y, left: e.x, width: e.width, height: e.height }
            }
            return this.bbox
          }),
          (SVGTextLottieElement.prototype.getValue = function () {
            var e,
              t = this.textSpans.length,
              r
            for (this.renderedFrame = this.comp.renderedFrame, e = 0; e < t; e += 1)
              (r = this.textSpans[e].glyph),
                r &&
                  (r.prepareFrame(this.comp.renderedFrame - this.data.st),
                  r._mdf && (this._mdf = !0))
          }),
          (SVGTextLottieElement.prototype.renderInnerContent = function () {
            if (
              (this.validateText(),
              (!this.data.singleShape || this._mdf) &&
                (this.textAnimator.getMeasures(
                  this.textProperty.currentData,
                  this.lettersChangedFlag
                ),
                this.lettersChangedFlag || this.textAnimator.lettersChangedFlag))
            ) {
              this._sizeChanged = !0
              var e,
                t,
                r = this.textAnimator.renderedLetters,
                i = this.textProperty.currentData.l
              t = i.length
              var n, s, a
              for (e = 0; e < t; e += 1)
                i[e].n ||
                  ((n = r[e]),
                  (s = this.textSpans[e].span),
                  (a = this.textSpans[e].glyph),
                  a && a.renderFrame(),
                  n._mdf.m && s.setAttribute('transform', n.m),
                  n._mdf.o && s.setAttribute('opacity', n.o),
                  n._mdf.sw && s.setAttribute('stroke-width', n.sw),
                  n._mdf.sc && s.setAttribute('stroke', n.sc),
                  n._mdf.fc && s.setAttribute('fill', n.fc))
            }
          })
        function ISolidElement(e, t, r) {
          this.initElement(e, t, r)
        }
        extendPrototype([IImageElement], ISolidElement),
          (ISolidElement.prototype.createContent = function () {
            var e = createNS('rect')
            e.setAttribute('width', this.data.sw),
              e.setAttribute('height', this.data.sh),
              e.setAttribute('fill', this.data.sc),
              this.layerElement.appendChild(e)
          })
        function NullElement(e, t, r) {
          this.initFrame(),
            this.initBaseData(e, t, r),
            this.initFrame(),
            this.initTransform(e, t, r),
            this.initHierarchy()
        }
        ;(NullElement.prototype.prepareFrame = function (e) {
          this.prepareProperties(e, !0)
        }),
          (NullElement.prototype.renderFrame = function () {}),
          (NullElement.prototype.getBaseElement = function () {
            return null
          }),
          (NullElement.prototype.destroy = function () {}),
          (NullElement.prototype.sourceRectAtTime = function () {}),
          (NullElement.prototype.hide = function () {}),
          extendPrototype(
            [BaseElement, TransformElement, HierarchyElement, FrameElement],
            NullElement
          )
        function SVGRendererBase() {}
        extendPrototype([BaseRenderer], SVGRendererBase),
          (SVGRendererBase.prototype.createNull = function (e) {
            return new NullElement(e, this.globalData, this)
          }),
          (SVGRendererBase.prototype.createShape = function (e) {
            return new SVGShapeElement(e, this.globalData, this)
          }),
          (SVGRendererBase.prototype.createText = function (e) {
            return new SVGTextLottieElement(e, this.globalData, this)
          }),
          (SVGRendererBase.prototype.createImage = function (e) {
            return new IImageElement(e, this.globalData, this)
          }),
          (SVGRendererBase.prototype.createSolid = function (e) {
            return new ISolidElement(e, this.globalData, this)
          }),
          (SVGRendererBase.prototype.configAnimation = function (e) {
            this.svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg'),
              this.svgElement.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink'),
              this.renderConfig.viewBoxSize
                ? this.svgElement.setAttribute('viewBox', this.renderConfig.viewBoxSize)
                : this.svgElement.setAttribute('viewBox', '0 0 ' + e.w + ' ' + e.h),
              this.renderConfig.viewBoxOnly ||
                (this.svgElement.setAttribute('width', e.w),
                this.svgElement.setAttribute('height', e.h),
                (this.svgElement.style.width = '100%'),
                (this.svgElement.style.height = '100%'),
                (this.svgElement.style.transform = 'translate3d(0,0,0)'),
                (this.svgElement.style.contentVisibility = this.renderConfig.contentVisibility)),
              this.renderConfig.width &&
                this.svgElement.setAttribute('width', this.renderConfig.width),
              this.renderConfig.height &&
                this.svgElement.setAttribute('height', this.renderConfig.height),
              this.renderConfig.className &&
                this.svgElement.setAttribute('class', this.renderConfig.className),
              this.renderConfig.id && this.svgElement.setAttribute('id', this.renderConfig.id),
              this.renderConfig.focusable !== void 0 &&
                this.svgElement.setAttribute('focusable', this.renderConfig.focusable),
              this.svgElement.setAttribute(
                'preserveAspectRatio',
                this.renderConfig.preserveAspectRatio
              ),
              this.animationItem.wrapper.appendChild(this.svgElement)
            var t = this.globalData.defs
            this.setupGlobalData(e, t),
              (this.globalData.progressiveLoad = this.renderConfig.progressiveLoad),
              (this.data = e)
            var r = createNS('clipPath'),
              i = createNS('rect')
            i.setAttribute('width', e.w),
              i.setAttribute('height', e.h),
              i.setAttribute('x', 0),
              i.setAttribute('y', 0)
            var n = createElementID()
            r.setAttribute('id', n),
              r.appendChild(i),
              this.layerElement.setAttribute(
                'clip-path',
                'url(' + getLocationHref() + '#' + n + ')'
              ),
              t.appendChild(r),
              (this.layers = e.layers),
              (this.elements = createSizedArray(e.layers.length))
          }),
          (SVGRendererBase.prototype.destroy = function () {
            this.animationItem.wrapper && (this.animationItem.wrapper.innerText = ''),
              (this.layerElement = null),
              (this.globalData.defs = null)
            var e,
              t = this.layers ? this.layers.length : 0
            for (e = 0; e < t; e += 1)
              this.elements[e] && this.elements[e].destroy && this.elements[e].destroy()
            ;(this.elements.length = 0), (this.destroyed = !0), (this.animationItem = null)
          }),
          (SVGRendererBase.prototype.updateContainerSize = function () {}),
          (SVGRendererBase.prototype.findIndexByInd = function (e) {
            var t = 0,
              r = this.layers.length
            for (t = 0; t < r; t += 1) if (this.layers[t].ind === e) return t
            return -1
          }),
          (SVGRendererBase.prototype.buildItem = function (e) {
            var t = this.elements
            if (!(t[e] || this.layers[e].ty === 99)) {
              t[e] = !0
              var r = this.createItem(this.layers[e])
              if (
                ((t[e] = r),
                getExpressionsPlugin() &&
                  (this.layers[e].ty === 0 &&
                    this.globalData.projectInterface.registerComposition(r),
                  r.initExpressions()),
                this.appendElementInPos(r, e),
                this.layers[e].tt)
              ) {
                var i = 'tp' in this.layers[e] ? this.findIndexByInd(this.layers[e].tp) : e - 1
                if (i === -1) return
                if (!this.elements[i] || this.elements[i] === !0)
                  this.buildItem(i), this.addPendingElement(r)
                else {
                  var n = t[i],
                    s = n.getMatte(this.layers[e].tt)
                  r.setMatte(s)
                }
              }
            }
          }),
          (SVGRendererBase.prototype.checkPendingElements = function () {
            for (; this.pendingElements.length; ) {
              var e = this.pendingElements.pop()
              if ((e.checkParenting(), e.data.tt))
                for (var t = 0, r = this.elements.length; t < r; ) {
                  if (this.elements[t] === e) {
                    var i = 'tp' in e.data ? this.findIndexByInd(e.data.tp) : t - 1,
                      n = this.elements[i],
                      s = n.getMatte(this.layers[t].tt)
                    e.setMatte(s)
                    break
                  }
                  t += 1
                }
            }
          }),
          (SVGRendererBase.prototype.renderFrame = function (e) {
            if (!(this.renderedFrame === e || this.destroyed)) {
              e === null ? (e = this.renderedFrame) : (this.renderedFrame = e),
                (this.globalData.frameNum = e),
                (this.globalData.frameId += 1),
                (this.globalData.projectInterface.currentFrame = e),
                (this.globalData._mdf = !1)
              var t,
                r = this.layers.length
              for (this.completeLayers || this.checkLayers(e), t = r - 1; t >= 0; t -= 1)
                (this.completeLayers || this.elements[t]) &&
                  this.elements[t].prepareFrame(e - this.layers[t].st)
              if (this.globalData._mdf)
                for (t = 0; t < r; t += 1)
                  (this.completeLayers || this.elements[t]) && this.elements[t].renderFrame()
            }
          }),
          (SVGRendererBase.prototype.appendElementInPos = function (e, t) {
            var r = e.getBaseElement()
            if (r) {
              for (var i = 0, n; i < t; )
                this.elements[i] &&
                  this.elements[i] !== !0 &&
                  this.elements[i].getBaseElement() &&
                  (n = this.elements[i].getBaseElement()),
                  (i += 1)
              n ? this.layerElement.insertBefore(r, n) : this.layerElement.appendChild(r)
            }
          }),
          (SVGRendererBase.prototype.hide = function () {
            this.layerElement.style.display = 'none'
          }),
          (SVGRendererBase.prototype.show = function () {
            this.layerElement.style.display = 'block'
          })
        function ICompElement() {}
        extendPrototype(
          [BaseElement, TransformElement, HierarchyElement, FrameElement, RenderableDOMElement],
          ICompElement
        ),
          (ICompElement.prototype.initElement = function (e, t, r) {
            this.initFrame(),
              this.initBaseData(e, t, r),
              this.initTransform(e, t, r),
              this.initRenderable(),
              this.initHierarchy(),
              this.initRendererElement(),
              this.createContainerElements(),
              this.createRenderableComponents(),
              (this.data.xt || !t.progressiveLoad) && this.buildAllItems(),
              this.hide()
          }),
          (ICompElement.prototype.prepareFrame = function (e) {
            if (
              ((this._mdf = !1),
              this.prepareRenderableFrame(e),
              this.prepareProperties(e, this.isInRange),
              !(!this.isInRange && !this.data.xt))
            ) {
              if (this.tm._placeholder) this.renderedFrame = e / this.data.sr
              else {
                var t = this.tm.v
                t === this.data.op && (t = this.data.op - 1), (this.renderedFrame = t)
              }
              var r,
                i = this.elements.length
              for (
                this.completeLayers || this.checkLayers(this.renderedFrame), r = i - 1;
                r >= 0;
                r -= 1
              )
                (this.completeLayers || this.elements[r]) &&
                  (this.elements[r].prepareFrame(this.renderedFrame - this.layers[r].st),
                  this.elements[r]._mdf && (this._mdf = !0))
            }
          }),
          (ICompElement.prototype.renderInnerContent = function () {
            var e,
              t = this.layers.length
            for (e = 0; e < t; e += 1)
              (this.completeLayers || this.elements[e]) && this.elements[e].renderFrame()
          }),
          (ICompElement.prototype.setElements = function (e) {
            this.elements = e
          }),
          (ICompElement.prototype.getElements = function () {
            return this.elements
          }),
          (ICompElement.prototype.destroyElements = function () {
            var e,
              t = this.layers.length
            for (e = 0; e < t; e += 1) this.elements[e] && this.elements[e].destroy()
          }),
          (ICompElement.prototype.destroy = function () {
            this.destroyElements(), this.destroyBaseElement()
          })
        function SVGCompElement(e, t, r) {
          ;(this.layers = e.layers),
            (this.supports3d = !0),
            (this.completeLayers = !1),
            (this.pendingElements = []),
            (this.elements = this.layers ? createSizedArray(this.layers.length) : []),
            this.initElement(e, t, r),
            (this.tm = e.tm
              ? PropertyFactory.getProp(this, e.tm, 0, t.frameRate, this)
              : { _placeholder: !0 })
        }
        extendPrototype([SVGRendererBase, ICompElement, SVGBaseElement], SVGCompElement),
          (SVGCompElement.prototype.createComp = function (e) {
            return new SVGCompElement(e, this.globalData, this)
          })
        function SVGRenderer(e, t) {
          ;(this.animationItem = e),
            (this.layers = null),
            (this.renderedFrame = -1),
            (this.svgElement = createNS('svg'))
          var r = ''
          if (t && t.title) {
            var i = createNS('title'),
              n = createElementID()
            i.setAttribute('id', n),
              (i.textContent = t.title),
              this.svgElement.appendChild(i),
              (r += n)
          }
          if (t && t.description) {
            var s = createNS('desc'),
              a = createElementID()
            s.setAttribute('id', a),
              (s.textContent = t.description),
              this.svgElement.appendChild(s),
              (r += ' ' + a)
          }
          r && this.svgElement.setAttribute('aria-labelledby', r)
          var l = createNS('defs')
          this.svgElement.appendChild(l)
          var o = createNS('g')
          this.svgElement.appendChild(o),
            (this.layerElement = o),
            (this.renderConfig = {
              preserveAspectRatio: (t && t.preserveAspectRatio) || 'xMidYMid meet',
              imagePreserveAspectRatio: (t && t.imagePreserveAspectRatio) || 'xMidYMid slice',
              contentVisibility: (t && t.contentVisibility) || 'visible',
              progressiveLoad: (t && t.progressiveLoad) || !1,
              hideOnTransparent: !(t && t.hideOnTransparent === !1),
              viewBoxOnly: (t && t.viewBoxOnly) || !1,
              viewBoxSize: (t && t.viewBoxSize) || !1,
              className: (t && t.className) || '',
              id: (t && t.id) || '',
              focusable: t && t.focusable,
              filterSize: {
                width: (t && t.filterSize && t.filterSize.width) || '100%',
                height: (t && t.filterSize && t.filterSize.height) || '100%',
                x: (t && t.filterSize && t.filterSize.x) || '0%',
                y: (t && t.filterSize && t.filterSize.y) || '0%'
              },
              width: t && t.width,
              height: t && t.height,
              runExpressions: !t || t.runExpressions === void 0 || t.runExpressions
            }),
            (this.globalData = {
              _mdf: !1,
              frameNum: -1,
              defs: l,
              renderConfig: this.renderConfig
            }),
            (this.elements = []),
            (this.pendingElements = []),
            (this.destroyed = !1),
            (this.rendererType = 'svg')
        }
        extendPrototype([SVGRendererBase], SVGRenderer),
          (SVGRenderer.prototype.createComp = function (e) {
            return new SVGCompElement(e, this.globalData, this)
          })
        function ShapeTransformManager() {
          ;(this.sequences = {}), (this.sequenceList = []), (this.transform_key_count = 0)
        }
        ShapeTransformManager.prototype = {
          addTransformSequence: function (t) {
            var r,
              i = t.length,
              n = '_'
            for (r = 0; r < i; r += 1) n += t[r].transform.key + '_'
            var s = this.sequences[n]
            return (
              s ||
                ((s = { transforms: [].concat(t), finalTransform: new Matrix(), _mdf: !1 }),
                (this.sequences[n] = s),
                this.sequenceList.push(s)),
              s
            )
          },
          processSequence: function (t, r) {
            for (var i = 0, n = t.transforms.length, s = r; i < n && !r; ) {
              if (t.transforms[i].transform.mProps._mdf) {
                s = !0
                break
              }
              i += 1
            }
            if (s)
              for (t.finalTransform.reset(), i = n - 1; i >= 0; i -= 1)
                t.finalTransform.multiply(t.transforms[i].transform.mProps.v)
            t._mdf = s
          },
          processSequences: function (t) {
            var r,
              i = this.sequenceList.length
            for (r = 0; r < i; r += 1) this.processSequence(this.sequenceList[r], t)
          },
          getNewKey: function () {
            return (this.transform_key_count += 1), '_' + this.transform_key_count
          }
        }
        var lumaLoader = function () {
          var t = '__lottie_element_luma_buffer',
            r = null,
            i = null,
            n = null
          function s() {
            var o = createNS('svg'),
              f = createNS('filter'),
              u = createNS('feColorMatrix')
            return (
              f.setAttribute('id', t),
              u.setAttribute('type', 'matrix'),
              u.setAttribute('color-interpolation-filters', 'sRGB'),
              u.setAttribute(
                'values',
                '0.3, 0.3, 0.3, 0, 0, 0.3, 0.3, 0.3, 0, 0, 0.3, 0.3, 0.3, 0, 0, 0.3, 0.3, 0.3, 0, 0'
              ),
              f.appendChild(u),
              o.appendChild(f),
              o.setAttribute('id', t + '_svg'),
              featureSupport.svgLumaHidden && (o.style.display = 'none'),
              o
            )
          }
          function a() {
            r ||
              ((n = s()),
              document.body.appendChild(n),
              (r = createTag('canvas')),
              (i = r.getContext('2d')),
              (i.filter = 'url(#' + t + ')'),
              (i.fillStyle = 'rgba(0,0,0,0)'),
              i.fillRect(0, 0, 1, 1))
          }
          function l(o) {
            return (
              r || a(),
              (r.width = o.width),
              (r.height = o.height),
              (i.filter = 'url(#' + t + ')'),
              r
            )
          }
          return { load: a, get: l }
        }
        function createCanvas(e, t) {
          if (featureSupport.offscreenCanvas) return new OffscreenCanvas(e, t)
          var r = createTag('canvas')
          return (r.width = e), (r.height = t), r
        }
        var assetLoader = (function () {
            return { loadLumaCanvas: lumaLoader.load, getLumaCanvas: lumaLoader.get, createCanvas }
          })(),
          registeredEffects = {}
        function CVEffects(e) {
          var t,
            r = e.data.ef ? e.data.ef.length : 0
          this.filters = []
          var i
          for (t = 0; t < r; t += 1) {
            i = null
            var n = e.data.ef[t].ty
            if (registeredEffects[n]) {
              var s = registeredEffects[n].effect
              i = new s(e.effectsManager.effectElements[t], e)
            }
            i && this.filters.push(i)
          }
          this.filters.length && e.addRenderableComponent(this)
        }
        ;(CVEffects.prototype.renderFrame = function (e) {
          var t,
            r = this.filters.length
          for (t = 0; t < r; t += 1) this.filters[t].renderFrame(e)
        }),
          (CVEffects.prototype.getEffects = function (e) {
            var t,
              r = this.filters.length,
              i = []
            for (t = 0; t < r; t += 1) this.filters[t].type === e && i.push(this.filters[t])
            return i
          })
        function registerEffect(e, t) {
          registeredEffects[e] = { effect: t }
        }
        function CVMaskElement(e, t) {
          ;(this.data = e),
            (this.element = t),
            (this.masksProperties = this.data.masksProperties || []),
            (this.viewData = createSizedArray(this.masksProperties.length))
          var r,
            i = this.masksProperties.length,
            n = !1
          for (r = 0; r < i; r += 1)
            this.masksProperties[r].mode !== 'n' && (n = !0),
              (this.viewData[r] = ShapePropertyFactory.getShapeProp(
                this.element,
                this.masksProperties[r],
                3
              ))
          ;(this.hasMasks = n), n && this.element.addRenderableComponent(this)
        }
        ;(CVMaskElement.prototype.renderFrame = function () {
          if (this.hasMasks) {
            var e = this.element.finalTransform.mat,
              t = this.element.canvasContext,
              r,
              i = this.masksProperties.length,
              n,
              s,
              a
            for (t.beginPath(), r = 0; r < i; r += 1)
              if (this.masksProperties[r].mode !== 'n') {
                this.masksProperties[r].inv &&
                  (t.moveTo(0, 0),
                  t.lineTo(this.element.globalData.compSize.w, 0),
                  t.lineTo(this.element.globalData.compSize.w, this.element.globalData.compSize.h),
                  t.lineTo(0, this.element.globalData.compSize.h),
                  t.lineTo(0, 0)),
                  (a = this.viewData[r].v),
                  (n = e.applyToPointArray(a.v[0][0], a.v[0][1], 0)),
                  t.moveTo(n[0], n[1])
                var l,
                  o = a._length
                for (l = 1; l < o; l += 1)
                  (s = e.applyToTriplePoints(a.o[l - 1], a.i[l], a.v[l])),
                    t.bezierCurveTo(s[0], s[1], s[2], s[3], s[4], s[5])
                ;(s = e.applyToTriplePoints(a.o[l - 1], a.i[0], a.v[0])),
                  t.bezierCurveTo(s[0], s[1], s[2], s[3], s[4], s[5])
              }
            this.element.globalData.renderer.save(!0), t.clip()
          }
        }),
          (CVMaskElement.prototype.getMaskProperty = MaskElement.prototype.getMaskProperty),
          (CVMaskElement.prototype.destroy = function () {
            this.element = null
          })
        function CVBaseElement() {}
        var operationsMap = { 1: 'source-in', 2: 'source-out', 3: 'source-in', 4: 'source-out' }
        ;(CVBaseElement.prototype = {
          createElements: function () {},
          initRendererElement: function () {},
          createContainerElements: function () {
            if (this.data.tt >= 1) {
              this.buffers = []
              var t = this.globalData.canvasContext,
                r = assetLoader.createCanvas(t.canvas.width, t.canvas.height)
              this.buffers.push(r)
              var i = assetLoader.createCanvas(t.canvas.width, t.canvas.height)
              this.buffers.push(i),
                this.data.tt >= 3 && !document._isProxy && assetLoader.loadLumaCanvas()
            }
            ;(this.canvasContext = this.globalData.canvasContext),
              (this.transformCanvas = this.globalData.transformCanvas),
              (this.renderableEffectsManager = new CVEffects(this)),
              this.searchEffectTransforms()
          },
          createContent: function () {},
          setBlendMode: function () {
            var t = this.globalData
            if (t.blendMode !== this.data.bm) {
              t.blendMode = this.data.bm
              var r = getBlendMode(this.data.bm)
              t.canvasContext.globalCompositeOperation = r
            }
          },
          createRenderableComponents: function () {
            ;(this.maskManager = new CVMaskElement(this.data, this)),
              (this.transformEffects = this.renderableEffectsManager.getEffects(
                effectTypes.TRANSFORM_EFFECT
              ))
          },
          hideElement: function () {
            !this.hidden && (!this.isInRange || this.isTransparent) && (this.hidden = !0)
          },
          showElement: function () {
            this.isInRange &&
              !this.isTransparent &&
              ((this.hidden = !1), (this._isFirstFrame = !0), (this.maskManager._isFirstFrame = !0))
          },
          clearCanvas: function (t) {
            t.clearRect(
              this.transformCanvas.tx,
              this.transformCanvas.ty,
              this.transformCanvas.w * this.transformCanvas.sx,
              this.transformCanvas.h * this.transformCanvas.sy
            )
          },
          prepareLayer: function () {
            if (this.data.tt >= 1) {
              var t = this.buffers[0],
                r = t.getContext('2d')
              this.clearCanvas(r),
                r.drawImage(this.canvasContext.canvas, 0, 0),
                (this.currentTransform = this.canvasContext.getTransform()),
                this.canvasContext.setTransform(1, 0, 0, 1, 0, 0),
                this.clearCanvas(this.canvasContext),
                this.canvasContext.setTransform(this.currentTransform)
            }
          },
          exitLayer: function () {
            if (this.data.tt >= 1) {
              var t = this.buffers[1],
                r = t.getContext('2d')
              this.clearCanvas(r),
                r.drawImage(this.canvasContext.canvas, 0, 0),
                this.canvasContext.setTransform(1, 0, 0, 1, 0, 0),
                this.clearCanvas(this.canvasContext),
                this.canvasContext.setTransform(this.currentTransform)
              var i = this.comp.getElementById('tp' in this.data ? this.data.tp : this.data.ind - 1)
              if (
                (i.renderFrame(!0),
                this.canvasContext.setTransform(1, 0, 0, 1, 0, 0),
                this.data.tt >= 3 && !document._isProxy)
              ) {
                var n = assetLoader.getLumaCanvas(this.canvasContext.canvas),
                  s = n.getContext('2d')
                s.drawImage(this.canvasContext.canvas, 0, 0),
                  this.clearCanvas(this.canvasContext),
                  this.canvasContext.drawImage(n, 0, 0)
              }
              ;(this.canvasContext.globalCompositeOperation = operationsMap[this.data.tt]),
                this.canvasContext.drawImage(t, 0, 0),
                (this.canvasContext.globalCompositeOperation = 'destination-over'),
                this.canvasContext.drawImage(this.buffers[0], 0, 0),
                this.canvasContext.setTransform(this.currentTransform),
                (this.canvasContext.globalCompositeOperation = 'source-over')
            }
          },
          renderFrame: function (t) {
            if (!(this.hidden || this.data.hd) && !(this.data.td === 1 && !t)) {
              this.renderTransform(),
                this.renderRenderable(),
                this.renderLocalTransform(),
                this.setBlendMode()
              var r = this.data.ty === 0
              this.prepareLayer(),
                this.globalData.renderer.save(r),
                this.globalData.renderer.ctxTransform(this.finalTransform.localMat.props),
                this.globalData.renderer.ctxOpacity(this.finalTransform.localOpacity),
                this.renderInnerContent(),
                this.globalData.renderer.restore(r),
                this.exitLayer(),
                this.maskManager.hasMasks && this.globalData.renderer.restore(!0),
                this._isFirstFrame && (this._isFirstFrame = !1)
            }
          },
          destroy: function () {
            ;(this.canvasContext = null),
              (this.data = null),
              (this.globalData = null),
              this.maskManager.destroy()
          },
          mHelper: new Matrix()
        }),
          (CVBaseElement.prototype.hide = CVBaseElement.prototype.hideElement),
          (CVBaseElement.prototype.show = CVBaseElement.prototype.showElement)
        function CVShapeData(e, t, r, i) {
          ;(this.styledShapes = []), (this.tr = [0, 0, 0, 0, 0, 0])
          var n = 4
          t.ty === 'rc' ? (n = 5) : t.ty === 'el' ? (n = 6) : t.ty === 'sr' && (n = 7),
            (this.sh = ShapePropertyFactory.getShapeProp(e, t, n, e))
          var s,
            a = r.length,
            l
          for (s = 0; s < a; s += 1)
            r[s].closed ||
              ((l = { transforms: i.addTransformSequence(r[s].transforms), trNodes: [] }),
              this.styledShapes.push(l),
              r[s].elements.push(l))
        }
        CVShapeData.prototype.setAsAnimated = SVGShapeData.prototype.setAsAnimated
        function CVShapeElement(e, t, r) {
          ;(this.shapes = []),
            (this.shapesData = e.shapes),
            (this.stylesList = []),
            (this.itemsData = []),
            (this.prevViewData = []),
            (this.shapeModifiers = []),
            (this.processedElements = []),
            (this.transformsManager = new ShapeTransformManager()),
            this.initElement(e, t, r)
        }
        extendPrototype(
          [
            BaseElement,
            TransformElement,
            CVBaseElement,
            IShapeElement,
            HierarchyElement,
            FrameElement,
            RenderableElement
          ],
          CVShapeElement
        ),
          (CVShapeElement.prototype.initElement = RenderableDOMElement.prototype.initElement),
          (CVShapeElement.prototype.transformHelper = { opacity: 1, _opMdf: !1 }),
          (CVShapeElement.prototype.dashResetter = []),
          (CVShapeElement.prototype.createContent = function () {
            this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, !0, [])
          }),
          (CVShapeElement.prototype.createStyleElement = function (e, t) {
            var r = {
                data: e,
                type: e.ty,
                preTransforms: this.transformsManager.addTransformSequence(t),
                transforms: [],
                elements: [],
                closed: e.hd === !0
              },
              i = {}
            if (
              (e.ty === 'fl' || e.ty === 'st'
                ? ((i.c = PropertyFactory.getProp(this, e.c, 1, 255, this)),
                  i.c.k ||
                    (r.co =
                      'rgb(' +
                      bmFloor(i.c.v[0]) +
                      ',' +
                      bmFloor(i.c.v[1]) +
                      ',' +
                      bmFloor(i.c.v[2]) +
                      ')'))
                : (e.ty === 'gf' || e.ty === 'gs') &&
                  ((i.s = PropertyFactory.getProp(this, e.s, 1, null, this)),
                  (i.e = PropertyFactory.getProp(this, e.e, 1, null, this)),
                  (i.h = PropertyFactory.getProp(this, e.h || { k: 0 }, 0, 0.01, this)),
                  (i.a = PropertyFactory.getProp(this, e.a || { k: 0 }, 0, degToRads, this)),
                  (i.g = new GradientProperty(this, e.g, this))),
              (i.o = PropertyFactory.getProp(this, e.o, 0, 0.01, this)),
              e.ty === 'st' || e.ty === 'gs')
            ) {
              if (
                ((r.lc = lineCapEnum[e.lc || 2]),
                (r.lj = lineJoinEnum[e.lj || 2]),
                e.lj == 1 && (r.ml = e.ml),
                (i.w = PropertyFactory.getProp(this, e.w, 0, null, this)),
                i.w.k || (r.wi = i.w.v),
                e.d)
              ) {
                var n = new DashProperty(this, e.d, 'canvas', this)
                ;(i.d = n), i.d.k || ((r.da = i.d.dashArray), (r.do = i.d.dashoffset[0]))
              }
            } else r.r = e.r === 2 ? 'evenodd' : 'nonzero'
            return this.stylesList.push(r), (i.style = r), i
          }),
          (CVShapeElement.prototype.createGroupElement = function () {
            var e = { it: [], prevViewData: [] }
            return e
          }),
          (CVShapeElement.prototype.createTransformElement = function (e) {
            var t = {
              transform: {
                opacity: 1,
                _opMdf: !1,
                key: this.transformsManager.getNewKey(),
                op: PropertyFactory.getProp(this, e.o, 0, 0.01, this),
                mProps: TransformPropertyFactory.getTransformProperty(this, e, this)
              }
            }
            return t
          }),
          (CVShapeElement.prototype.createShapeElement = function (e) {
            var t = new CVShapeData(this, e, this.stylesList, this.transformsManager)
            return this.shapes.push(t), this.addShapeToModifiers(t), t
          }),
          (CVShapeElement.prototype.reloadShapes = function () {
            this._isFirstFrame = !0
            var e,
              t = this.itemsData.length
            for (e = 0; e < t; e += 1) this.prevViewData[e] = this.itemsData[e]
            for (
              this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, !0, []),
                t = this.dynamicProperties.length,
                e = 0;
              e < t;
              e += 1
            )
              this.dynamicProperties[e].getValue()
            this.renderModifiers(), this.transformsManager.processSequences(this._isFirstFrame)
          }),
          (CVShapeElement.prototype.addTransformToStyleList = function (e) {
            var t,
              r = this.stylesList.length
            for (t = 0; t < r; t += 1)
              this.stylesList[t].closed || this.stylesList[t].transforms.push(e)
          }),
          (CVShapeElement.prototype.removeTransformFromStyleList = function () {
            var e,
              t = this.stylesList.length
            for (e = 0; e < t; e += 1)
              this.stylesList[e].closed || this.stylesList[e].transforms.pop()
          }),
          (CVShapeElement.prototype.closeStyles = function (e) {
            var t,
              r = e.length
            for (t = 0; t < r; t += 1) e[t].closed = !0
          }),
          (CVShapeElement.prototype.searchShapes = function (e, t, r, i, n) {
            var s,
              a = e.length - 1,
              l,
              o,
              f = [],
              u = [],
              E,
              c,
              b,
              x = [].concat(n)
            for (s = a; s >= 0; s -= 1) {
              if (
                ((E = this.searchProcessedElement(e[s])),
                E ? (t[s] = r[E - 1]) : (e[s]._shouldRender = i),
                e[s].ty === 'fl' || e[s].ty === 'st' || e[s].ty === 'gf' || e[s].ty === 'gs')
              )
                E ? (t[s].style.closed = !1) : (t[s] = this.createStyleElement(e[s], x)),
                  f.push(t[s].style)
              else if (e[s].ty === 'gr') {
                if (!E) t[s] = this.createGroupElement(e[s])
                else
                  for (o = t[s].it.length, l = 0; l < o; l += 1) t[s].prevViewData[l] = t[s].it[l]
                this.searchShapes(e[s].it, t[s].it, t[s].prevViewData, i, x)
              } else
                e[s].ty === 'tr'
                  ? (E || ((b = this.createTransformElement(e[s])), (t[s] = b)),
                    x.push(t[s]),
                    this.addTransformToStyleList(t[s]))
                  : e[s].ty === 'sh' || e[s].ty === 'rc' || e[s].ty === 'el' || e[s].ty === 'sr'
                    ? E || (t[s] = this.createShapeElement(e[s]))
                    : e[s].ty === 'tm' ||
                        e[s].ty === 'rd' ||
                        e[s].ty === 'pb' ||
                        e[s].ty === 'zz' ||
                        e[s].ty === 'op'
                      ? (E
                          ? ((c = t[s]), (c.closed = !1))
                          : ((c = ShapeModifiers.getModifier(e[s].ty)),
                            c.init(this, e[s]),
                            (t[s] = c),
                            this.shapeModifiers.push(c)),
                        u.push(c))
                      : e[s].ty === 'rp' &&
                        (E
                          ? ((c = t[s]), (c.closed = !0))
                          : ((c = ShapeModifiers.getModifier(e[s].ty)),
                            (t[s] = c),
                            c.init(this, e, s, t),
                            this.shapeModifiers.push(c),
                            (i = !1)),
                        u.push(c))
              this.addProcessedElement(e[s], s + 1)
            }
            for (
              this.removeTransformFromStyleList(), this.closeStyles(f), a = u.length, s = 0;
              s < a;
              s += 1
            )
              u[s].closed = !0
          }),
          (CVShapeElement.prototype.renderInnerContent = function () {
            ;(this.transformHelper.opacity = 1),
              (this.transformHelper._opMdf = !1),
              this.renderModifiers(),
              this.transformsManager.processSequences(this._isFirstFrame),
              this.renderShape(this.transformHelper, this.shapesData, this.itemsData, !0)
          }),
          (CVShapeElement.prototype.renderShapeTransform = function (e, t) {
            ;(e._opMdf || t.op._mdf || this._isFirstFrame) &&
              ((t.opacity = e.opacity), (t.opacity *= t.op.v), (t._opMdf = !0))
          }),
          (CVShapeElement.prototype.drawLayer = function () {
            var e,
              t = this.stylesList.length,
              r,
              i,
              n,
              s,
              a,
              l,
              o = this.globalData.renderer,
              f = this.globalData.canvasContext,
              u,
              E
            for (e = 0; e < t; e += 1)
              if (
                ((E = this.stylesList[e]),
                (u = E.type),
                !(
                  ((u === 'st' || u === 'gs') && E.wi === 0) ||
                  !E.data._shouldRender ||
                  E.coOp === 0 ||
                  this.globalData.currentGlobalAlpha === 0
                ))
              ) {
                for (
                  o.save(),
                    a = E.elements,
                    u === 'st' || u === 'gs'
                      ? (o.ctxStrokeStyle(u === 'st' ? E.co : E.grd),
                        o.ctxLineWidth(E.wi),
                        o.ctxLineCap(E.lc),
                        o.ctxLineJoin(E.lj),
                        o.ctxMiterLimit(E.ml || 0))
                      : o.ctxFillStyle(u === 'fl' ? E.co : E.grd),
                    o.ctxOpacity(E.coOp),
                    u !== 'st' && u !== 'gs' && f.beginPath(),
                    o.ctxTransform(E.preTransforms.finalTransform.props),
                    i = a.length,
                    r = 0;
                  r < i;
                  r += 1
                ) {
                  for (
                    (u === 'st' || u === 'gs') &&
                      (f.beginPath(), E.da && (f.setLineDash(E.da), (f.lineDashOffset = E.do))),
                      l = a[r].trNodes,
                      s = l.length,
                      n = 0;
                    n < s;
                    n += 1
                  )
                    l[n].t === 'm'
                      ? f.moveTo(l[n].p[0], l[n].p[1])
                      : l[n].t === 'c'
                        ? f.bezierCurveTo(
                            l[n].pts[0],
                            l[n].pts[1],
                            l[n].pts[2],
                            l[n].pts[3],
                            l[n].pts[4],
                            l[n].pts[5]
                          )
                        : f.closePath()
                  ;(u === 'st' || u === 'gs') &&
                    (o.ctxStroke(), E.da && f.setLineDash(this.dashResetter))
                }
                u !== 'st' && u !== 'gs' && this.globalData.renderer.ctxFill(E.r), o.restore()
              }
          }),
          (CVShapeElement.prototype.renderShape = function (e, t, r, i) {
            var n,
              s = t.length - 1,
              a
            for (a = e, n = s; n >= 0; n -= 1)
              t[n].ty === 'tr'
                ? ((a = r[n].transform), this.renderShapeTransform(e, a))
                : t[n].ty === 'sh' || t[n].ty === 'el' || t[n].ty === 'rc' || t[n].ty === 'sr'
                  ? this.renderPath(t[n], r[n])
                  : t[n].ty === 'fl'
                    ? this.renderFill(t[n], r[n], a)
                    : t[n].ty === 'st'
                      ? this.renderStroke(t[n], r[n], a)
                      : t[n].ty === 'gf' || t[n].ty === 'gs'
                        ? this.renderGradientFill(t[n], r[n], a)
                        : t[n].ty === 'gr'
                          ? this.renderShape(a, t[n].it, r[n].it)
                          : t[n].ty
            i && this.drawLayer()
          }),
          (CVShapeElement.prototype.renderStyledShape = function (e, t) {
            if (this._isFirstFrame || t._mdf || e.transforms._mdf) {
              var r = e.trNodes,
                i = t.paths,
                n,
                s,
                a,
                l = i._length
              r.length = 0
              var o = e.transforms.finalTransform
              for (a = 0; a < l; a += 1) {
                var f = i.shapes[a]
                if (f && f.v) {
                  for (s = f._length, n = 1; n < s; n += 1)
                    n === 1 && r.push({ t: 'm', p: o.applyToPointArray(f.v[0][0], f.v[0][1], 0) }),
                      r.push({ t: 'c', pts: o.applyToTriplePoints(f.o[n - 1], f.i[n], f.v[n]) })
                  s === 1 && r.push({ t: 'm', p: o.applyToPointArray(f.v[0][0], f.v[0][1], 0) }),
                    f.c &&
                      s &&
                      (r.push({ t: 'c', pts: o.applyToTriplePoints(f.o[n - 1], f.i[0], f.v[0]) }),
                      r.push({ t: 'z' }))
                }
              }
              e.trNodes = r
            }
          }),
          (CVShapeElement.prototype.renderPath = function (e, t) {
            if (e.hd !== !0 && e._shouldRender) {
              var r,
                i = t.styledShapes.length
              for (r = 0; r < i; r += 1) this.renderStyledShape(t.styledShapes[r], t.sh)
            }
          }),
          (CVShapeElement.prototype.renderFill = function (e, t, r) {
            var i = t.style
            ;(t.c._mdf || this._isFirstFrame) &&
              (i.co =
                'rgb(' +
                bmFloor(t.c.v[0]) +
                ',' +
                bmFloor(t.c.v[1]) +
                ',' +
                bmFloor(t.c.v[2]) +
                ')'),
              (t.o._mdf || r._opMdf || this._isFirstFrame) && (i.coOp = t.o.v * r.opacity)
          }),
          (CVShapeElement.prototype.renderGradientFill = function (e, t, r) {
            var i = t.style,
              n
            if (
              !i.grd ||
              t.g._mdf ||
              t.s._mdf ||
              t.e._mdf ||
              (e.t !== 1 && (t.h._mdf || t.a._mdf))
            ) {
              var s = this.globalData.canvasContext,
                a = t.s.v,
                l = t.e.v
              if (e.t === 1) n = s.createLinearGradient(a[0], a[1], l[0], l[1])
              else {
                var o = Math.sqrt(Math.pow(a[0] - l[0], 2) + Math.pow(a[1] - l[1], 2)),
                  f = Math.atan2(l[1] - a[1], l[0] - a[0]),
                  u = t.h.v
                u >= 1 ? (u = 0.99) : u <= -1 && (u = -0.99)
                var E = o * u,
                  c = Math.cos(f + t.a.v) * E + a[0],
                  b = Math.sin(f + t.a.v) * E + a[1]
                n = s.createRadialGradient(c, b, 0, a[0], a[1], o)
              }
              var x,
                y = e.g.p,
                _ = t.g.c,
                m = 1
              for (x = 0; x < y; x += 1)
                t.g._hasOpacity && t.g._collapsable && (m = t.g.o[x * 2 + 1]),
                  n.addColorStop(
                    _[x * 4] / 100,
                    'rgba(' + _[x * 4 + 1] + ',' + _[x * 4 + 2] + ',' + _[x * 4 + 3] + ',' + m + ')'
                  )
              i.grd = n
            }
            i.coOp = t.o.v * r.opacity
          }),
          (CVShapeElement.prototype.renderStroke = function (e, t, r) {
            var i = t.style,
              n = t.d
            n && (n._mdf || this._isFirstFrame) && ((i.da = n.dashArray), (i.do = n.dashoffset[0])),
              (t.c._mdf || this._isFirstFrame) &&
                (i.co =
                  'rgb(' +
                  bmFloor(t.c.v[0]) +
                  ',' +
                  bmFloor(t.c.v[1]) +
                  ',' +
                  bmFloor(t.c.v[2]) +
                  ')'),
              (t.o._mdf || r._opMdf || this._isFirstFrame) && (i.coOp = t.o.v * r.opacity),
              (t.w._mdf || this._isFirstFrame) && (i.wi = t.w.v)
          }),
          (CVShapeElement.prototype.destroy = function () {
            ;(this.shapesData = null),
              (this.globalData = null),
              (this.canvasContext = null),
              (this.stylesList.length = 0),
              (this.itemsData.length = 0)
          })
        function CVTextElement(e, t, r) {
          ;(this.textSpans = []),
            (this.yOffset = 0),
            (this.fillColorAnim = !1),
            (this.strokeColorAnim = !1),
            (this.strokeWidthAnim = !1),
            (this.stroke = !1),
            (this.fill = !1),
            (this.justifyOffset = 0),
            (this.currentRender = null),
            (this.renderType = 'canvas'),
            (this.values = {
              fill: 'rgba(0,0,0,0)',
              stroke: 'rgba(0,0,0,0)',
              sWidth: 0,
              fValue: ''
            }),
            this.initElement(e, t, r)
        }
        extendPrototype(
          [
            BaseElement,
            TransformElement,
            CVBaseElement,
            HierarchyElement,
            FrameElement,
            RenderableElement,
            ITextElement
          ],
          CVTextElement
        ),
          (CVTextElement.prototype.tHelper = createTag('canvas').getContext('2d')),
          (CVTextElement.prototype.buildNewText = function () {
            var e = this.textProperty.currentData
            this.renderedLetters = createSizedArray(e.l ? e.l.length : 0)
            var t = !1
            e.fc
              ? ((t = !0), (this.values.fill = this.buildColor(e.fc)))
              : (this.values.fill = 'rgba(0,0,0,0)'),
              (this.fill = t)
            var r = !1
            e.sc &&
              ((r = !0), (this.values.stroke = this.buildColor(e.sc)), (this.values.sWidth = e.sw))
            var i = this.globalData.fontManager.getFontByName(e.f),
              n,
              s,
              a = e.l,
              l = this.mHelper
            ;(this.stroke = r),
              (this.values.fValue =
                e.finalSize + 'px ' + this.globalData.fontManager.getFontByName(e.f).fFamily),
              (s = e.finalText.length)
            var o,
              f,
              u,
              E,
              c,
              b,
              x,
              y,
              _,
              m,
              A = this.data.singleShape,
              d = e.tr * 0.001 * e.finalSize,
              g = 0,
              C = 0,
              P = !0,
              k = 0
            for (n = 0; n < s; n += 1) {
              ;(o = this.globalData.fontManager.getCharData(
                e.finalText[n],
                i.fStyle,
                this.globalData.fontManager.getFontByName(e.f).fFamily
              )),
                (f = (o && o.data) || {}),
                l.reset(),
                A && a[n].n && ((g = -d), (C += e.yOffset), (C += P ? 1 : 0), (P = !1)),
                (c = f.shapes ? f.shapes[0].it : []),
                (x = c.length),
                l.scale(e.finalSize / 100, e.finalSize / 100),
                A && this.applyTextPropertiesToMatrix(e, l, a[n].line, g, C),
                (_ = createSizedArray(x - 1))
              var M = 0
              for (b = 0; b < x; b += 1)
                if (c[b].ty === 'sh') {
                  for (E = c[b].ks.k.i.length, y = c[b].ks.k, m = [], u = 1; u < E; u += 1)
                    u === 1 &&
                      m.push(
                        l.applyToX(y.v[0][0], y.v[0][1], 0),
                        l.applyToY(y.v[0][0], y.v[0][1], 0)
                      ),
                      m.push(
                        l.applyToX(y.o[u - 1][0], y.o[u - 1][1], 0),
                        l.applyToY(y.o[u - 1][0], y.o[u - 1][1], 0),
                        l.applyToX(y.i[u][0], y.i[u][1], 0),
                        l.applyToY(y.i[u][0], y.i[u][1], 0),
                        l.applyToX(y.v[u][0], y.v[u][1], 0),
                        l.applyToY(y.v[u][0], y.v[u][1], 0)
                      )
                  m.push(
                    l.applyToX(y.o[u - 1][0], y.o[u - 1][1], 0),
                    l.applyToY(y.o[u - 1][0], y.o[u - 1][1], 0),
                    l.applyToX(y.i[0][0], y.i[0][1], 0),
                    l.applyToY(y.i[0][0], y.i[0][1], 0),
                    l.applyToX(y.v[0][0], y.v[0][1], 0),
                    l.applyToY(y.v[0][0], y.v[0][1], 0)
                  ),
                    (_[M] = m),
                    (M += 1)
                }
              A && ((g += a[n].l), (g += d)),
                this.textSpans[k]
                  ? (this.textSpans[k].elem = _)
                  : (this.textSpans[k] = { elem: _ }),
                (k += 1)
            }
          }),
          (CVTextElement.prototype.renderInnerContent = function () {
            this.validateText()
            var e = this.canvasContext
            ;(e.font = this.values.fValue),
              this.globalData.renderer.ctxLineCap('butt'),
              this.globalData.renderer.ctxLineJoin('miter'),
              this.globalData.renderer.ctxMiterLimit(4),
              this.data.singleShape ||
                this.textAnimator.getMeasures(
                  this.textProperty.currentData,
                  this.lettersChangedFlag
                )
            var t,
              r,
              i,
              n,
              s,
              a,
              l = this.textAnimator.renderedLetters,
              o = this.textProperty.currentData.l
            r = o.length
            var f,
              u = null,
              E = null,
              c = null,
              b,
              x,
              y = this.globalData.renderer
            for (t = 0; t < r; t += 1)
              if (!o[t].n) {
                if (
                  ((f = l[t]), f && (y.save(), y.ctxTransform(f.p), y.ctxOpacity(f.o)), this.fill)
                ) {
                  for (
                    f && f.fc
                      ? u !== f.fc && (y.ctxFillStyle(f.fc), (u = f.fc))
                      : u !== this.values.fill &&
                        ((u = this.values.fill), y.ctxFillStyle(this.values.fill)),
                      b = this.textSpans[t].elem,
                      n = b.length,
                      this.globalData.canvasContext.beginPath(),
                      i = 0;
                    i < n;
                    i += 1
                  )
                    for (
                      x = b[i],
                        a = x.length,
                        this.globalData.canvasContext.moveTo(x[0], x[1]),
                        s = 2;
                      s < a;
                      s += 6
                    )
                      this.globalData.canvasContext.bezierCurveTo(
                        x[s],
                        x[s + 1],
                        x[s + 2],
                        x[s + 3],
                        x[s + 4],
                        x[s + 5]
                      )
                  this.globalData.canvasContext.closePath(), y.ctxFill()
                }
                if (this.stroke) {
                  for (
                    f && f.sw
                      ? c !== f.sw && ((c = f.sw), y.ctxLineWidth(f.sw))
                      : c !== this.values.sWidth &&
                        ((c = this.values.sWidth), y.ctxLineWidth(this.values.sWidth)),
                      f && f.sc
                        ? E !== f.sc && ((E = f.sc), y.ctxStrokeStyle(f.sc))
                        : E !== this.values.stroke &&
                          ((E = this.values.stroke), y.ctxStrokeStyle(this.values.stroke)),
                      b = this.textSpans[t].elem,
                      n = b.length,
                      this.globalData.canvasContext.beginPath(),
                      i = 0;
                    i < n;
                    i += 1
                  )
                    for (
                      x = b[i],
                        a = x.length,
                        this.globalData.canvasContext.moveTo(x[0], x[1]),
                        s = 2;
                      s < a;
                      s += 6
                    )
                      this.globalData.canvasContext.bezierCurveTo(
                        x[s],
                        x[s + 1],
                        x[s + 2],
                        x[s + 3],
                        x[s + 4],
                        x[s + 5]
                      )
                  this.globalData.canvasContext.closePath(), y.ctxStroke()
                }
                f && this.globalData.renderer.restore()
              }
          })
        function CVImageElement(e, t, r) {
          ;(this.assetData = t.getAssetData(e.refId)),
            (this.img = t.imageLoader.getAsset(this.assetData)),
            this.initElement(e, t, r)
        }
        extendPrototype(
          [
            BaseElement,
            TransformElement,
            CVBaseElement,
            HierarchyElement,
            FrameElement,
            RenderableElement
          ],
          CVImageElement
        ),
          (CVImageElement.prototype.initElement = SVGShapeElement.prototype.initElement),
          (CVImageElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame),
          (CVImageElement.prototype.createContent = function () {
            if (
              this.img.width &&
              (this.assetData.w !== this.img.width || this.assetData.h !== this.img.height)
            ) {
              var e = createTag('canvas')
              ;(e.width = this.assetData.w), (e.height = this.assetData.h)
              var t = e.getContext('2d'),
                r = this.img.width,
                i = this.img.height,
                n = r / i,
                s = this.assetData.w / this.assetData.h,
                a,
                l,
                o = this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio
              ;(n > s && o === 'xMidYMid slice') || (n < s && o !== 'xMidYMid slice')
                ? ((l = i), (a = l * s))
                : ((a = r), (l = a / s)),
                t.drawImage(
                  this.img,
                  (r - a) / 2,
                  (i - l) / 2,
                  a,
                  l,
                  0,
                  0,
                  this.assetData.w,
                  this.assetData.h
                ),
                (this.img = e)
            }
          }),
          (CVImageElement.prototype.renderInnerContent = function () {
            this.canvasContext.drawImage(this.img, 0, 0)
          }),
          (CVImageElement.prototype.destroy = function () {
            this.img = null
          })
        function CVSolidElement(e, t, r) {
          this.initElement(e, t, r)
        }
        extendPrototype(
          [
            BaseElement,
            TransformElement,
            CVBaseElement,
            HierarchyElement,
            FrameElement,
            RenderableElement
          ],
          CVSolidElement
        ),
          (CVSolidElement.prototype.initElement = SVGShapeElement.prototype.initElement),
          (CVSolidElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame),
          (CVSolidElement.prototype.renderInnerContent = function () {
            this.globalData.renderer.ctxFillStyle(this.data.sc),
              this.globalData.renderer.ctxFillRect(0, 0, this.data.sw, this.data.sh)
          })
        function CanvasRendererBase() {}
        extendPrototype([BaseRenderer], CanvasRendererBase),
          (CanvasRendererBase.prototype.createShape = function (e) {
            return new CVShapeElement(e, this.globalData, this)
          }),
          (CanvasRendererBase.prototype.createText = function (e) {
            return new CVTextElement(e, this.globalData, this)
          }),
          (CanvasRendererBase.prototype.createImage = function (e) {
            return new CVImageElement(e, this.globalData, this)
          }),
          (CanvasRendererBase.prototype.createSolid = function (e) {
            return new CVSolidElement(e, this.globalData, this)
          }),
          (CanvasRendererBase.prototype.createNull = SVGRenderer.prototype.createNull),
          (CanvasRendererBase.prototype.ctxTransform = function (e) {
            ;(e[0] === 1 && e[1] === 0 && e[4] === 0 && e[5] === 1 && e[12] === 0 && e[13] === 0) ||
              this.canvasContext.transform(e[0], e[1], e[4], e[5], e[12], e[13])
          }),
          (CanvasRendererBase.prototype.ctxOpacity = function (e) {
            this.canvasContext.globalAlpha *= e < 0 ? 0 : e
          }),
          (CanvasRendererBase.prototype.ctxFillStyle = function (e) {
            this.canvasContext.fillStyle = e
          }),
          (CanvasRendererBase.prototype.ctxStrokeStyle = function (e) {
            this.canvasContext.strokeStyle = e
          }),
          (CanvasRendererBase.prototype.ctxLineWidth = function (e) {
            this.canvasContext.lineWidth = e
          }),
          (CanvasRendererBase.prototype.ctxLineCap = function (e) {
            this.canvasContext.lineCap = e
          }),
          (CanvasRendererBase.prototype.ctxLineJoin = function (e) {
            this.canvasContext.lineJoin = e
          }),
          (CanvasRendererBase.prototype.ctxMiterLimit = function (e) {
            this.canvasContext.miterLimit = e
          }),
          (CanvasRendererBase.prototype.ctxFill = function (e) {
            this.canvasContext.fill(e)
          }),
          (CanvasRendererBase.prototype.ctxFillRect = function (e, t, r, i) {
            this.canvasContext.fillRect(e, t, r, i)
          }),
          (CanvasRendererBase.prototype.ctxStroke = function () {
            this.canvasContext.stroke()
          }),
          (CanvasRendererBase.prototype.reset = function () {
            if (!this.renderConfig.clearCanvas) {
              this.canvasContext.restore()
              return
            }
            this.contextData.reset()
          }),
          (CanvasRendererBase.prototype.save = function () {
            this.canvasContext.save()
          }),
          (CanvasRendererBase.prototype.restore = function (e) {
            if (!this.renderConfig.clearCanvas) {
              this.canvasContext.restore()
              return
            }
            e && (this.globalData.blendMode = 'source-over'), this.contextData.restore(e)
          }),
          (CanvasRendererBase.prototype.configAnimation = function (e) {
            if (this.animationItem.wrapper) {
              this.animationItem.container = createTag('canvas')
              var t = this.animationItem.container.style
              ;(t.width = '100%'), (t.height = '100%')
              var r = '0px 0px 0px'
              ;(t.transformOrigin = r),
                (t.mozTransformOrigin = r),
                (t.webkitTransformOrigin = r),
                (t['-webkit-transform'] = r),
                (t.contentVisibility = this.renderConfig.contentVisibility),
                this.animationItem.wrapper.appendChild(this.animationItem.container),
                (this.canvasContext = this.animationItem.container.getContext('2d')),
                this.renderConfig.className &&
                  this.animationItem.container.setAttribute('class', this.renderConfig.className),
                this.renderConfig.id &&
                  this.animationItem.container.setAttribute('id', this.renderConfig.id)
            } else this.canvasContext = this.renderConfig.context
            this.contextData.setContext(this.canvasContext),
              (this.data = e),
              (this.layers = e.layers),
              (this.transformCanvas = { w: e.w, h: e.h, sx: 0, sy: 0, tx: 0, ty: 0 }),
              this.setupGlobalData(e, document.body),
              (this.globalData.canvasContext = this.canvasContext),
              (this.globalData.renderer = this),
              (this.globalData.isDashed = !1),
              (this.globalData.progressiveLoad = this.renderConfig.progressiveLoad),
              (this.globalData.transformCanvas = this.transformCanvas),
              (this.elements = createSizedArray(e.layers.length)),
              this.updateContainerSize()
          }),
          (CanvasRendererBase.prototype.updateContainerSize = function (e, t) {
            this.reset()
            var r, i
            e
              ? ((r = e),
                (i = t),
                (this.canvasContext.canvas.width = r),
                (this.canvasContext.canvas.height = i))
              : (this.animationItem.wrapper && this.animationItem.container
                  ? ((r = this.animationItem.wrapper.offsetWidth),
                    (i = this.animationItem.wrapper.offsetHeight))
                  : ((r = this.canvasContext.canvas.width), (i = this.canvasContext.canvas.height)),
                (this.canvasContext.canvas.width = r * this.renderConfig.dpr),
                (this.canvasContext.canvas.height = i * this.renderConfig.dpr))
            var n, s
            if (
              this.renderConfig.preserveAspectRatio.indexOf('meet') !== -1 ||
              this.renderConfig.preserveAspectRatio.indexOf('slice') !== -1
            ) {
              var a = this.renderConfig.preserveAspectRatio.split(' '),
                l = a[1] || 'meet',
                o = a[0] || 'xMidYMid',
                f = o.substr(0, 4),
                u = o.substr(4)
              ;(n = r / i),
                (s = this.transformCanvas.w / this.transformCanvas.h),
                (s > n && l === 'meet') || (s < n && l === 'slice')
                  ? ((this.transformCanvas.sx =
                      r / (this.transformCanvas.w / this.renderConfig.dpr)),
                    (this.transformCanvas.sy =
                      r / (this.transformCanvas.w / this.renderConfig.dpr)))
                  : ((this.transformCanvas.sx =
                      i / (this.transformCanvas.h / this.renderConfig.dpr)),
                    (this.transformCanvas.sy =
                      i / (this.transformCanvas.h / this.renderConfig.dpr))),
                f === 'xMid' && ((s < n && l === 'meet') || (s > n && l === 'slice'))
                  ? (this.transformCanvas.tx =
                      ((r - this.transformCanvas.w * (i / this.transformCanvas.h)) / 2) *
                      this.renderConfig.dpr)
                  : f === 'xMax' && ((s < n && l === 'meet') || (s > n && l === 'slice'))
                    ? (this.transformCanvas.tx =
                        (r - this.transformCanvas.w * (i / this.transformCanvas.h)) *
                        this.renderConfig.dpr)
                    : (this.transformCanvas.tx = 0),
                u === 'YMid' && ((s > n && l === 'meet') || (s < n && l === 'slice'))
                  ? (this.transformCanvas.ty =
                      ((i - this.transformCanvas.h * (r / this.transformCanvas.w)) / 2) *
                      this.renderConfig.dpr)
                  : u === 'YMax' && ((s > n && l === 'meet') || (s < n && l === 'slice'))
                    ? (this.transformCanvas.ty =
                        (i - this.transformCanvas.h * (r / this.transformCanvas.w)) *
                        this.renderConfig.dpr)
                    : (this.transformCanvas.ty = 0)
            } else
              this.renderConfig.preserveAspectRatio === 'none'
                ? ((this.transformCanvas.sx = r / (this.transformCanvas.w / this.renderConfig.dpr)),
                  (this.transformCanvas.sy = i / (this.transformCanvas.h / this.renderConfig.dpr)),
                  (this.transformCanvas.tx = 0),
                  (this.transformCanvas.ty = 0))
                : ((this.transformCanvas.sx = this.renderConfig.dpr),
                  (this.transformCanvas.sy = this.renderConfig.dpr),
                  (this.transformCanvas.tx = 0),
                  (this.transformCanvas.ty = 0))
            ;(this.transformCanvas.props = [
              this.transformCanvas.sx,
              0,
              0,
              0,
              0,
              this.transformCanvas.sy,
              0,
              0,
              0,
              0,
              1,
              0,
              this.transformCanvas.tx,
              this.transformCanvas.ty,
              0,
              1
            ]),
              this.ctxTransform(this.transformCanvas.props),
              this.canvasContext.beginPath(),
              this.canvasContext.rect(0, 0, this.transformCanvas.w, this.transformCanvas.h),
              this.canvasContext.closePath(),
              this.canvasContext.clip(),
              this.renderFrame(this.renderedFrame, !0)
          }),
          (CanvasRendererBase.prototype.destroy = function () {
            this.renderConfig.clearCanvas &&
              this.animationItem.wrapper &&
              (this.animationItem.wrapper.innerText = '')
            var e,
              t = this.layers ? this.layers.length : 0
            for (e = t - 1; e >= 0; e -= 1)
              this.elements[e] && this.elements[e].destroy && this.elements[e].destroy()
            ;(this.elements.length = 0),
              (this.globalData.canvasContext = null),
              (this.animationItem.container = null),
              (this.destroyed = !0)
          }),
          (CanvasRendererBase.prototype.renderFrame = function (e, t) {
            if (
              !(
                (this.renderedFrame === e && this.renderConfig.clearCanvas === !0 && !t) ||
                this.destroyed ||
                e === -1
              )
            ) {
              ;(this.renderedFrame = e),
                (this.globalData.frameNum = e - this.animationItem._isFirstFrame),
                (this.globalData.frameId += 1),
                (this.globalData._mdf = !this.renderConfig.clearCanvas || t),
                (this.globalData.projectInterface.currentFrame = e)
              var r,
                i = this.layers.length
              for (this.completeLayers || this.checkLayers(e), r = i - 1; r >= 0; r -= 1)
                (this.completeLayers || this.elements[r]) &&
                  this.elements[r].prepareFrame(e - this.layers[r].st)
              if (this.globalData._mdf) {
                for (
                  this.renderConfig.clearCanvas === !0
                    ? this.canvasContext.clearRect(
                        0,
                        0,
                        this.transformCanvas.w,
                        this.transformCanvas.h
                      )
                    : this.save(),
                    r = i - 1;
                  r >= 0;
                  r -= 1
                )
                  (this.completeLayers || this.elements[r]) && this.elements[r].renderFrame()
                this.renderConfig.clearCanvas !== !0 && this.restore()
              }
            }
          }),
          (CanvasRendererBase.prototype.buildItem = function (e) {
            var t = this.elements
            if (!(t[e] || this.layers[e].ty === 99)) {
              var r = this.createItem(this.layers[e], this, this.globalData)
              ;(t[e] = r), r.initExpressions()
            }
          }),
          (CanvasRendererBase.prototype.checkPendingElements = function () {
            for (; this.pendingElements.length; ) {
              var e = this.pendingElements.pop()
              e.checkParenting()
            }
          }),
          (CanvasRendererBase.prototype.hide = function () {
            this.animationItem.container.style.display = 'none'
          }),
          (CanvasRendererBase.prototype.show = function () {
            this.animationItem.container.style.display = 'block'
          })
        function CanvasContext() {
          ;(this.opacity = -1),
            (this.transform = createTypedArray('float32', 16)),
            (this.fillStyle = ''),
            (this.strokeStyle = ''),
            (this.lineWidth = ''),
            (this.lineCap = ''),
            (this.lineJoin = ''),
            (this.miterLimit = ''),
            (this.id = Math.random())
        }
        function CVContextData() {
          ;(this.stack = []), (this.cArrPos = 0), (this.cTr = new Matrix())
          var e,
            t = 15
          for (e = 0; e < t; e += 1) {
            var r = new CanvasContext()
            this.stack[e] = r
          }
          ;(this._length = t),
            (this.nativeContext = null),
            (this.transformMat = new Matrix()),
            (this.currentOpacity = 1),
            (this.currentFillStyle = ''),
            (this.appliedFillStyle = ''),
            (this.currentStrokeStyle = ''),
            (this.appliedStrokeStyle = ''),
            (this.currentLineWidth = ''),
            (this.appliedLineWidth = ''),
            (this.currentLineCap = ''),
            (this.appliedLineCap = ''),
            (this.currentLineJoin = ''),
            (this.appliedLineJoin = ''),
            (this.appliedMiterLimit = ''),
            (this.currentMiterLimit = '')
        }
        ;(CVContextData.prototype.duplicate = function () {
          var e = this._length * 2,
            t = 0
          for (t = this._length; t < e; t += 1) this.stack[t] = new CanvasContext()
          this._length = e
        }),
          (CVContextData.prototype.reset = function () {
            ;(this.cArrPos = 0), this.cTr.reset(), (this.stack[this.cArrPos].opacity = 1)
          }),
          (CVContextData.prototype.restore = function (e) {
            this.cArrPos -= 1
            var t = this.stack[this.cArrPos],
              r = t.transform,
              i,
              n = this.cTr.props
            for (i = 0; i < 16; i += 1) n[i] = r[i]
            if (e) {
              this.nativeContext.restore()
              var s = this.stack[this.cArrPos + 1]
              ;(this.appliedFillStyle = s.fillStyle),
                (this.appliedStrokeStyle = s.strokeStyle),
                (this.appliedLineWidth = s.lineWidth),
                (this.appliedLineCap = s.lineCap),
                (this.appliedLineJoin = s.lineJoin),
                (this.appliedMiterLimit = s.miterLimit)
            }
            this.nativeContext.setTransform(r[0], r[1], r[4], r[5], r[12], r[13]),
              (e || (t.opacity !== -1 && this.currentOpacity !== t.opacity)) &&
                ((this.nativeContext.globalAlpha = t.opacity), (this.currentOpacity = t.opacity)),
              (this.currentFillStyle = t.fillStyle),
              (this.currentStrokeStyle = t.strokeStyle),
              (this.currentLineWidth = t.lineWidth),
              (this.currentLineCap = t.lineCap),
              (this.currentLineJoin = t.lineJoin),
              (this.currentMiterLimit = t.miterLimit)
          }),
          (CVContextData.prototype.save = function (e) {
            e && this.nativeContext.save()
            var t = this.cTr.props
            this._length <= this.cArrPos && this.duplicate()
            var r = this.stack[this.cArrPos],
              i
            for (i = 0; i < 16; i += 1) r.transform[i] = t[i]
            this.cArrPos += 1
            var n = this.stack[this.cArrPos]
            ;(n.opacity = r.opacity),
              (n.fillStyle = r.fillStyle),
              (n.strokeStyle = r.strokeStyle),
              (n.lineWidth = r.lineWidth),
              (n.lineCap = r.lineCap),
              (n.lineJoin = r.lineJoin),
              (n.miterLimit = r.miterLimit)
          }),
          (CVContextData.prototype.setOpacity = function (e) {
            this.stack[this.cArrPos].opacity = e
          }),
          (CVContextData.prototype.setContext = function (e) {
            this.nativeContext = e
          }),
          (CVContextData.prototype.fillStyle = function (e) {
            this.stack[this.cArrPos].fillStyle !== e &&
              ((this.currentFillStyle = e), (this.stack[this.cArrPos].fillStyle = e))
          }),
          (CVContextData.prototype.strokeStyle = function (e) {
            this.stack[this.cArrPos].strokeStyle !== e &&
              ((this.currentStrokeStyle = e), (this.stack[this.cArrPos].strokeStyle = e))
          }),
          (CVContextData.prototype.lineWidth = function (e) {
            this.stack[this.cArrPos].lineWidth !== e &&
              ((this.currentLineWidth = e), (this.stack[this.cArrPos].lineWidth = e))
          }),
          (CVContextData.prototype.lineCap = function (e) {
            this.stack[this.cArrPos].lineCap !== e &&
              ((this.currentLineCap = e), (this.stack[this.cArrPos].lineCap = e))
          }),
          (CVContextData.prototype.lineJoin = function (e) {
            this.stack[this.cArrPos].lineJoin !== e &&
              ((this.currentLineJoin = e), (this.stack[this.cArrPos].lineJoin = e))
          }),
          (CVContextData.prototype.miterLimit = function (e) {
            this.stack[this.cArrPos].miterLimit !== e &&
              ((this.currentMiterLimit = e), (this.stack[this.cArrPos].miterLimit = e))
          }),
          (CVContextData.prototype.transform = function (e) {
            this.transformMat.cloneFromProps(e)
            var t = this.cTr
            this.transformMat.multiply(t), t.cloneFromProps(this.transformMat.props)
            var r = t.props
            this.nativeContext.setTransform(r[0], r[1], r[4], r[5], r[12], r[13])
          }),
          (CVContextData.prototype.opacity = function (e) {
            var t = this.stack[this.cArrPos].opacity
            ;(t *= e < 0 ? 0 : e),
              this.stack[this.cArrPos].opacity !== t &&
                (this.currentOpacity !== e &&
                  ((this.nativeContext.globalAlpha = e), (this.currentOpacity = e)),
                (this.stack[this.cArrPos].opacity = t))
          }),
          (CVContextData.prototype.fill = function (e) {
            this.appliedFillStyle !== this.currentFillStyle &&
              ((this.appliedFillStyle = this.currentFillStyle),
              (this.nativeContext.fillStyle = this.appliedFillStyle)),
              this.nativeContext.fill(e)
          }),
          (CVContextData.prototype.fillRect = function (e, t, r, i) {
            this.appliedFillStyle !== this.currentFillStyle &&
              ((this.appliedFillStyle = this.currentFillStyle),
              (this.nativeContext.fillStyle = this.appliedFillStyle)),
              this.nativeContext.fillRect(e, t, r, i)
          }),
          (CVContextData.prototype.stroke = function () {
            this.appliedStrokeStyle !== this.currentStrokeStyle &&
              ((this.appliedStrokeStyle = this.currentStrokeStyle),
              (this.nativeContext.strokeStyle = this.appliedStrokeStyle)),
              this.appliedLineWidth !== this.currentLineWidth &&
                ((this.appliedLineWidth = this.currentLineWidth),
                (this.nativeContext.lineWidth = this.appliedLineWidth)),
              this.appliedLineCap !== this.currentLineCap &&
                ((this.appliedLineCap = this.currentLineCap),
                (this.nativeContext.lineCap = this.appliedLineCap)),
              this.appliedLineJoin !== this.currentLineJoin &&
                ((this.appliedLineJoin = this.currentLineJoin),
                (this.nativeContext.lineJoin = this.appliedLineJoin)),
              this.appliedMiterLimit !== this.currentMiterLimit &&
                ((this.appliedMiterLimit = this.currentMiterLimit),
                (this.nativeContext.miterLimit = this.appliedMiterLimit)),
              this.nativeContext.stroke()
          })
        function CVCompElement(e, t, r) {
          ;(this.completeLayers = !1),
            (this.layers = e.layers),
            (this.pendingElements = []),
            (this.elements = createSizedArray(this.layers.length)),
            this.initElement(e, t, r),
            (this.tm = e.tm
              ? PropertyFactory.getProp(this, e.tm, 0, t.frameRate, this)
              : { _placeholder: !0 })
        }
        extendPrototype([CanvasRendererBase, ICompElement, CVBaseElement], CVCompElement),
          (CVCompElement.prototype.renderInnerContent = function () {
            var e = this.canvasContext
            e.beginPath(),
              e.moveTo(0, 0),
              e.lineTo(this.data.w, 0),
              e.lineTo(this.data.w, this.data.h),
              e.lineTo(0, this.data.h),
              e.lineTo(0, 0),
              e.clip()
            var t,
              r = this.layers.length
            for (t = r - 1; t >= 0; t -= 1)
              (this.completeLayers || this.elements[t]) && this.elements[t].renderFrame()
          }),
          (CVCompElement.prototype.destroy = function () {
            var e,
              t = this.layers.length
            for (e = t - 1; e >= 0; e -= 1) this.elements[e] && this.elements[e].destroy()
            ;(this.layers = null), (this.elements = null)
          }),
          (CVCompElement.prototype.createComp = function (e) {
            return new CVCompElement(e, this.globalData, this)
          })
        function CanvasRenderer(e, t) {
          ;(this.animationItem = e),
            (this.renderConfig = {
              clearCanvas: t && t.clearCanvas !== void 0 ? t.clearCanvas : !0,
              context: (t && t.context) || null,
              progressiveLoad: (t && t.progressiveLoad) || !1,
              preserveAspectRatio: (t && t.preserveAspectRatio) || 'xMidYMid meet',
              imagePreserveAspectRatio: (t && t.imagePreserveAspectRatio) || 'xMidYMid slice',
              contentVisibility: (t && t.contentVisibility) || 'visible',
              className: (t && t.className) || '',
              id: (t && t.id) || '',
              runExpressions: !t || t.runExpressions === void 0 || t.runExpressions
            }),
            (this.renderConfig.dpr = (t && t.dpr) || 1),
            this.animationItem.wrapper &&
              (this.renderConfig.dpr = (t && t.dpr) || window.devicePixelRatio || 1),
            (this.renderedFrame = -1),
            (this.globalData = {
              frameNum: -1,
              _mdf: !1,
              renderConfig: this.renderConfig,
              currentGlobalAlpha: -1
            }),
            (this.contextData = new CVContextData()),
            (this.elements = []),
            (this.pendingElements = []),
            (this.transformMat = new Matrix()),
            (this.completeLayers = !1),
            (this.rendererType = 'canvas'),
            this.renderConfig.clearCanvas &&
              ((this.ctxTransform = this.contextData.transform.bind(this.contextData)),
              (this.ctxOpacity = this.contextData.opacity.bind(this.contextData)),
              (this.ctxFillStyle = this.contextData.fillStyle.bind(this.contextData)),
              (this.ctxStrokeStyle = this.contextData.strokeStyle.bind(this.contextData)),
              (this.ctxLineWidth = this.contextData.lineWidth.bind(this.contextData)),
              (this.ctxLineCap = this.contextData.lineCap.bind(this.contextData)),
              (this.ctxLineJoin = this.contextData.lineJoin.bind(this.contextData)),
              (this.ctxMiterLimit = this.contextData.miterLimit.bind(this.contextData)),
              (this.ctxFill = this.contextData.fill.bind(this.contextData)),
              (this.ctxFillRect = this.contextData.fillRect.bind(this.contextData)),
              (this.ctxStroke = this.contextData.stroke.bind(this.contextData)),
              (this.save = this.contextData.save.bind(this.contextData)))
        }
        extendPrototype([CanvasRendererBase], CanvasRenderer),
          (CanvasRenderer.prototype.createComp = function (e) {
            return new CVCompElement(e, this.globalData, this)
          })
        function HBaseElement() {}
        ;(HBaseElement.prototype = {
          checkBlendMode: function () {},
          initRendererElement: function () {
            ;(this.baseElement = createTag(this.data.tg || 'div')),
              this.data.hasMask
                ? ((this.svgElement = createNS('svg')),
                  (this.layerElement = createNS('g')),
                  (this.maskedElement = this.layerElement),
                  this.svgElement.appendChild(this.layerElement),
                  this.baseElement.appendChild(this.svgElement))
                : (this.layerElement = this.baseElement),
              styleDiv(this.baseElement)
          },
          createContainerElements: function () {
            ;(this.renderableEffectsManager = new CVEffects(this)),
              (this.transformedElement = this.baseElement),
              (this.maskedElement = this.layerElement),
              this.data.ln && this.layerElement.setAttribute('id', this.data.ln),
              this.data.cl && this.layerElement.setAttribute('class', this.data.cl),
              this.data.bm !== 0 && this.setBlendMode()
          },
          renderElement: function () {
            var t = this.transformedElement ? this.transformedElement.style : {}
            if (this.finalTransform._matMdf) {
              var r = this.finalTransform.mat.toCSS()
              ;(t.transform = r), (t.webkitTransform = r)
            }
            this.finalTransform._opMdf && (t.opacity = this.finalTransform.mProp.o.v)
          },
          renderFrame: function () {
            this.data.hd ||
              this.hidden ||
              (this.renderTransform(),
              this.renderRenderable(),
              this.renderElement(),
              this.renderInnerContent(),
              this._isFirstFrame && (this._isFirstFrame = !1))
          },
          destroy: function () {
            ;(this.layerElement = null),
              (this.transformedElement = null),
              this.matteElement && (this.matteElement = null),
              this.maskManager && (this.maskManager.destroy(), (this.maskManager = null))
          },
          createRenderableComponents: function () {
            this.maskManager = new MaskElement(this.data, this, this.globalData)
          },
          addEffects: function () {},
          setMatte: function () {}
        }),
          (HBaseElement.prototype.getBaseElement = SVGBaseElement.prototype.getBaseElement),
          (HBaseElement.prototype.destroyBaseElement = HBaseElement.prototype.destroy),
          (HBaseElement.prototype.buildElementParenting =
            BaseRenderer.prototype.buildElementParenting)
        function HSolidElement(e, t, r) {
          this.initElement(e, t, r)
        }
        extendPrototype(
          [
            BaseElement,
            TransformElement,
            HBaseElement,
            HierarchyElement,
            FrameElement,
            RenderableDOMElement
          ],
          HSolidElement
        ),
          (HSolidElement.prototype.createContent = function () {
            var e
            this.data.hasMask
              ? ((e = createNS('rect')),
                e.setAttribute('width', this.data.sw),
                e.setAttribute('height', this.data.sh),
                e.setAttribute('fill', this.data.sc),
                this.svgElement.setAttribute('width', this.data.sw),
                this.svgElement.setAttribute('height', this.data.sh))
              : ((e = createTag('div')),
                (e.style.width = this.data.sw + 'px'),
                (e.style.height = this.data.sh + 'px'),
                (e.style.backgroundColor = this.data.sc)),
              this.layerElement.appendChild(e)
          })
        function HShapeElement(e, t, r) {
          ;(this.shapes = []),
            (this.shapesData = e.shapes),
            (this.stylesList = []),
            (this.shapeModifiers = []),
            (this.itemsData = []),
            (this.processedElements = []),
            (this.animatedContents = []),
            (this.shapesContainer = createNS('g')),
            this.initElement(e, t, r),
            (this.prevViewData = []),
            (this.currentBBox = { x: 999999, y: -999999, h: 0, w: 0 })
        }
        extendPrototype(
          [
            BaseElement,
            TransformElement,
            HSolidElement,
            SVGShapeElement,
            HBaseElement,
            HierarchyElement,
            FrameElement,
            RenderableElement
          ],
          HShapeElement
        ),
          (HShapeElement.prototype._renderShapeFrame = HShapeElement.prototype.renderInnerContent),
          (HShapeElement.prototype.createContent = function () {
            var e
            if (((this.baseElement.style.fontSize = 0), this.data.hasMask))
              this.layerElement.appendChild(this.shapesContainer), (e = this.svgElement)
            else {
              e = createNS('svg')
              var t = this.comp.data ? this.comp.data : this.globalData.compSize
              e.setAttribute('width', t.w),
                e.setAttribute('height', t.h),
                e.appendChild(this.shapesContainer),
                this.layerElement.appendChild(e)
            }
            this.searchShapes(
              this.shapesData,
              this.itemsData,
              this.prevViewData,
              this.shapesContainer,
              0,
              [],
              !0
            ),
              this.filterUniqueShapes(),
              (this.shapeCont = e)
          }),
          (HShapeElement.prototype.getTransformedPoint = function (e, t) {
            var r,
              i = e.length
            for (r = 0; r < i; r += 1) t = e[r].mProps.v.applyToPointArray(t[0], t[1], 0)
            return t
          }),
          (HShapeElement.prototype.calculateShapeBoundingBox = function (e, t) {
            var r = e.sh.v,
              i = e.transformers,
              n,
              s = r._length,
              a,
              l,
              o,
              f
            if (!(s <= 1)) {
              for (n = 0; n < s - 1; n += 1)
                (a = this.getTransformedPoint(i, r.v[n])),
                  (l = this.getTransformedPoint(i, r.o[n])),
                  (o = this.getTransformedPoint(i, r.i[n + 1])),
                  (f = this.getTransformedPoint(i, r.v[n + 1])),
                  this.checkBounds(a, l, o, f, t)
              r.c &&
                ((a = this.getTransformedPoint(i, r.v[n])),
                (l = this.getTransformedPoint(i, r.o[n])),
                (o = this.getTransformedPoint(i, r.i[0])),
                (f = this.getTransformedPoint(i, r.v[0])),
                this.checkBounds(a, l, o, f, t))
            }
          }),
          (HShapeElement.prototype.checkBounds = function (e, t, r, i, n) {
            this.getBoundsOfCurve(e, t, r, i)
            var s = this.shapeBoundingBox
            ;(n.x = bmMin(s.left, n.x)),
              (n.xMax = bmMax(s.right, n.xMax)),
              (n.y = bmMin(s.top, n.y)),
              (n.yMax = bmMax(s.bottom, n.yMax))
          }),
          (HShapeElement.prototype.shapeBoundingBox = { left: 0, right: 0, top: 0, bottom: 0 }),
          (HShapeElement.prototype.tempBoundingBox = {
            x: 0,
            xMax: 0,
            y: 0,
            yMax: 0,
            width: 0,
            height: 0
          }),
          (HShapeElement.prototype.getBoundsOfCurve = function (e, t, r, i) {
            for (
              var n = [
                  [e[0], i[0]],
                  [e[1], i[1]]
                ],
                s,
                a,
                l,
                o,
                f,
                u,
                E,
                c = 0;
              c < 2;
              ++c
            )
              (a = 6 * e[c] - 12 * t[c] + 6 * r[c]),
                (s = -3 * e[c] + 9 * t[c] - 9 * r[c] + 3 * i[c]),
                (l = 3 * t[c] - 3 * e[c]),
                (a |= 0),
                (s |= 0),
                (l |= 0),
                (s === 0 && a === 0) ||
                  (s === 0
                    ? ((o = -l / a), o > 0 && o < 1 && n[c].push(this.calculateF(o, e, t, r, i, c)))
                    : ((f = a * a - 4 * l * s),
                      f >= 0 &&
                        ((u = (-a + bmSqrt(f)) / (2 * s)),
                        u > 0 && u < 1 && n[c].push(this.calculateF(u, e, t, r, i, c)),
                        (E = (-a - bmSqrt(f)) / (2 * s)),
                        E > 0 && E < 1 && n[c].push(this.calculateF(E, e, t, r, i, c)))))
            ;(this.shapeBoundingBox.left = bmMin.apply(null, n[0])),
              (this.shapeBoundingBox.top = bmMin.apply(null, n[1])),
              (this.shapeBoundingBox.right = bmMax.apply(null, n[0])),
              (this.shapeBoundingBox.bottom = bmMax.apply(null, n[1]))
          }),
          (HShapeElement.prototype.calculateF = function (e, t, r, i, n, s) {
            return (
              bmPow(1 - e, 3) * t[s] +
              3 * bmPow(1 - e, 2) * e * r[s] +
              3 * (1 - e) * bmPow(e, 2) * i[s] +
              bmPow(e, 3) * n[s]
            )
          }),
          (HShapeElement.prototype.calculateBoundingBox = function (e, t) {
            var r,
              i = e.length
            for (r = 0; r < i; r += 1)
              e[r] && e[r].sh
                ? this.calculateShapeBoundingBox(e[r], t)
                : e[r] && e[r].it
                  ? this.calculateBoundingBox(e[r].it, t)
                  : e[r] && e[r].style && e[r].w && this.expandStrokeBoundingBox(e[r].w, t)
          }),
          (HShapeElement.prototype.expandStrokeBoundingBox = function (e, t) {
            var r = 0
            if (e.keyframes) {
              for (var i = 0; i < e.keyframes.length; i += 1) {
                var n = e.keyframes[i].s
                n > r && (r = n)
              }
              r *= e.mult
            } else r = e.v * e.mult
            ;(t.x -= r), (t.xMax += r), (t.y -= r), (t.yMax += r)
          }),
          (HShapeElement.prototype.currentBoxContains = function (e) {
            return (
              this.currentBBox.x <= e.x &&
              this.currentBBox.y <= e.y &&
              this.currentBBox.width + this.currentBBox.x >= e.x + e.width &&
              this.currentBBox.height + this.currentBBox.y >= e.y + e.height
            )
          }),
          (HShapeElement.prototype.renderInnerContent = function () {
            if ((this._renderShapeFrame(), !this.hidden && (this._isFirstFrame || this._mdf))) {
              var e = this.tempBoundingBox,
                t = 999999
              if (
                ((e.x = t),
                (e.xMax = -t),
                (e.y = t),
                (e.yMax = -t),
                this.calculateBoundingBox(this.itemsData, e),
                (e.width = e.xMax < e.x ? 0 : e.xMax - e.x),
                (e.height = e.yMax < e.y ? 0 : e.yMax - e.y),
                this.currentBoxContains(e))
              )
                return
              var r = !1
              if (
                (this.currentBBox.w !== e.width &&
                  ((this.currentBBox.w = e.width),
                  this.shapeCont.setAttribute('width', e.width),
                  (r = !0)),
                this.currentBBox.h !== e.height &&
                  ((this.currentBBox.h = e.height),
                  this.shapeCont.setAttribute('height', e.height),
                  (r = !0)),
                r || this.currentBBox.x !== e.x || this.currentBBox.y !== e.y)
              ) {
                ;(this.currentBBox.w = e.width),
                  (this.currentBBox.h = e.height),
                  (this.currentBBox.x = e.x),
                  (this.currentBBox.y = e.y),
                  this.shapeCont.setAttribute(
                    'viewBox',
                    this.currentBBox.x +
                      ' ' +
                      this.currentBBox.y +
                      ' ' +
                      this.currentBBox.w +
                      ' ' +
                      this.currentBBox.h
                  )
                var i = this.shapeCont.style,
                  n = 'translate(' + this.currentBBox.x + 'px,' + this.currentBBox.y + 'px)'
                ;(i.transform = n), (i.webkitTransform = n)
              }
            }
          })
        function HTextElement(e, t, r) {
          ;(this.textSpans = []),
            (this.textPaths = []),
            (this.currentBBox = { x: 999999, y: -999999, h: 0, w: 0 }),
            (this.renderType = 'svg'),
            (this.isMasked = !1),
            this.initElement(e, t, r)
        }
        extendPrototype(
          [
            BaseElement,
            TransformElement,
            HBaseElement,
            HierarchyElement,
            FrameElement,
            RenderableDOMElement,
            ITextElement
          ],
          HTextElement
        ),
          (HTextElement.prototype.createContent = function () {
            if (((this.isMasked = this.checkMasks()), this.isMasked)) {
              ;(this.renderType = 'svg'),
                (this.compW = this.comp.data.w),
                (this.compH = this.comp.data.h),
                this.svgElement.setAttribute('width', this.compW),
                this.svgElement.setAttribute('height', this.compH)
              var e = createNS('g')
              this.maskedElement.appendChild(e), (this.innerElem = e)
            } else (this.renderType = 'html'), (this.innerElem = this.layerElement)
            this.checkParenting()
          }),
          (HTextElement.prototype.buildNewText = function () {
            var e = this.textProperty.currentData
            this.renderedLetters = createSizedArray(e.l ? e.l.length : 0)
            var t = this.innerElem.style,
              r = e.fc ? this.buildColor(e.fc) : 'rgba(0,0,0,0)'
            ;(t.fill = r),
              (t.color = r),
              e.sc && ((t.stroke = this.buildColor(e.sc)), (t.strokeWidth = e.sw + 'px'))
            var i = this.globalData.fontManager.getFontByName(e.f)
            if (!this.globalData.fontManager.chars)
              if (
                ((t.fontSize = e.finalSize + 'px'), (t.lineHeight = e.finalSize + 'px'), i.fClass)
              )
                this.innerElem.className = i.fClass
              else {
                t.fontFamily = i.fFamily
                var n = e.fWeight,
                  s = e.fStyle
                ;(t.fontStyle = s), (t.fontWeight = n)
              }
            var a,
              l,
              o = e.l
            l = o.length
            var f,
              u,
              E,
              c = this.mHelper,
              b,
              x = '',
              y = 0
            for (a = 0; a < l; a += 1) {
              if (
                (this.globalData.fontManager.chars
                  ? (this.textPaths[y]
                      ? (f = this.textPaths[y])
                      : ((f = createNS('path')),
                        f.setAttribute('stroke-linecap', lineCapEnum[1]),
                        f.setAttribute('stroke-linejoin', lineJoinEnum[2]),
                        f.setAttribute('stroke-miterlimit', '4')),
                    this.isMasked ||
                      (this.textSpans[y]
                        ? ((u = this.textSpans[y]), (E = u.children[0]))
                        : ((u = createTag('div')),
                          (u.style.lineHeight = 0),
                          (E = createNS('svg')),
                          E.appendChild(f),
                          styleDiv(u))))
                  : this.isMasked
                    ? (f = this.textPaths[y] ? this.textPaths[y] : createNS('text'))
                    : this.textSpans[y]
                      ? ((u = this.textSpans[y]), (f = this.textPaths[y]))
                      : ((u = createTag('span')),
                        styleDiv(u),
                        (f = createTag('span')),
                        styleDiv(f),
                        u.appendChild(f)),
                this.globalData.fontManager.chars)
              ) {
                var _ = this.globalData.fontManager.getCharData(
                    e.finalText[a],
                    i.fStyle,
                    this.globalData.fontManager.getFontByName(e.f).fFamily
                  ),
                  m
                if (
                  (_ ? (m = _.data) : (m = null),
                  c.reset(),
                  m &&
                    m.shapes &&
                    m.shapes.length &&
                    ((b = m.shapes[0].it),
                    c.scale(e.finalSize / 100, e.finalSize / 100),
                    (x = this.createPathShape(c, b)),
                    f.setAttribute('d', x)),
                  this.isMasked)
                )
                  this.innerElem.appendChild(f)
                else {
                  if ((this.innerElem.appendChild(u), m && m.shapes)) {
                    document.body.appendChild(E)
                    var A = E.getBBox()
                    E.setAttribute('width', A.width + 2),
                      E.setAttribute('height', A.height + 2),
                      E.setAttribute(
                        'viewBox',
                        A.x - 1 + ' ' + (A.y - 1) + ' ' + (A.width + 2) + ' ' + (A.height + 2)
                      )
                    var d = E.style,
                      g = 'translate(' + (A.x - 1) + 'px,' + (A.y - 1) + 'px)'
                    ;(d.transform = g), (d.webkitTransform = g), (o[a].yOffset = A.y - 1)
                  } else E.setAttribute('width', 1), E.setAttribute('height', 1)
                  u.appendChild(E)
                }
              } else if (
                ((f.textContent = o[a].val),
                f.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve'),
                this.isMasked)
              )
                this.innerElem.appendChild(f)
              else {
                this.innerElem.appendChild(u)
                var C = f.style,
                  P = 'translate3d(0,' + -e.finalSize / 1.2 + 'px,0)'
                ;(C.transform = P), (C.webkitTransform = P)
              }
              this.isMasked ? (this.textSpans[y] = f) : (this.textSpans[y] = u),
                (this.textSpans[y].style.display = 'block'),
                (this.textPaths[y] = f),
                (y += 1)
            }
            for (; y < this.textSpans.length; ) (this.textSpans[y].style.display = 'none'), (y += 1)
          }),
          (HTextElement.prototype.renderInnerContent = function () {
            this.validateText()
            var e
            if (this.data.singleShape) {
              if (!this._isFirstFrame && !this.lettersChangedFlag) return
              if (this.isMasked && this.finalTransform._matMdf) {
                this.svgElement.setAttribute(
                  'viewBox',
                  -this.finalTransform.mProp.p.v[0] +
                    ' ' +
                    -this.finalTransform.mProp.p.v[1] +
                    ' ' +
                    this.compW +
                    ' ' +
                    this.compH
                ),
                  (e = this.svgElement.style)
                var t =
                  'translate(' +
                  -this.finalTransform.mProp.p.v[0] +
                  'px,' +
                  -this.finalTransform.mProp.p.v[1] +
                  'px)'
                ;(e.transform = t), (e.webkitTransform = t)
              }
            }
            if (
              (this.textAnimator.getMeasures(
                this.textProperty.currentData,
                this.lettersChangedFlag
              ),
              !(!this.lettersChangedFlag && !this.textAnimator.lettersChangedFlag))
            ) {
              var r,
                i,
                n = 0,
                s = this.textAnimator.renderedLetters,
                a = this.textProperty.currentData.l
              i = a.length
              var l, o, f
              for (r = 0; r < i; r += 1)
                a[r].n
                  ? (n += 1)
                  : ((o = this.textSpans[r]),
                    (f = this.textPaths[r]),
                    (l = s[n]),
                    (n += 1),
                    l._mdf.m &&
                      (this.isMasked
                        ? o.setAttribute('transform', l.m)
                        : ((o.style.webkitTransform = l.m), (o.style.transform = l.m))),
                    (o.style.opacity = l.o),
                    l.sw && l._mdf.sw && f.setAttribute('stroke-width', l.sw),
                    l.sc && l._mdf.sc && f.setAttribute('stroke', l.sc),
                    l.fc && l._mdf.fc && (f.setAttribute('fill', l.fc), (f.style.color = l.fc)))
              if (this.innerElem.getBBox && !this.hidden && (this._isFirstFrame || this._mdf)) {
                var u = this.innerElem.getBBox()
                this.currentBBox.w !== u.width &&
                  ((this.currentBBox.w = u.width), this.svgElement.setAttribute('width', u.width)),
                  this.currentBBox.h !== u.height &&
                    ((this.currentBBox.h = u.height),
                    this.svgElement.setAttribute('height', u.height))
                var E = 1
                if (
                  this.currentBBox.w !== u.width + E * 2 ||
                  this.currentBBox.h !== u.height + E * 2 ||
                  this.currentBBox.x !== u.x - E ||
                  this.currentBBox.y !== u.y - E
                ) {
                  ;(this.currentBBox.w = u.width + E * 2),
                    (this.currentBBox.h = u.height + E * 2),
                    (this.currentBBox.x = u.x - E),
                    (this.currentBBox.y = u.y - E),
                    this.svgElement.setAttribute(
                      'viewBox',
                      this.currentBBox.x +
                        ' ' +
                        this.currentBBox.y +
                        ' ' +
                        this.currentBBox.w +
                        ' ' +
                        this.currentBBox.h
                    ),
                    (e = this.svgElement.style)
                  var c = 'translate(' + this.currentBBox.x + 'px,' + this.currentBBox.y + 'px)'
                  ;(e.transform = c), (e.webkitTransform = c)
                }
              }
            }
          })
        function HCameraElement(e, t, r) {
          this.initFrame(), this.initBaseData(e, t, r), this.initHierarchy()
          var i = PropertyFactory.getProp
          if (
            ((this.pe = i(this, e.pe, 0, 0, this)),
            e.ks.p.s
              ? ((this.px = i(this, e.ks.p.x, 1, 0, this)),
                (this.py = i(this, e.ks.p.y, 1, 0, this)),
                (this.pz = i(this, e.ks.p.z, 1, 0, this)))
              : (this.p = i(this, e.ks.p, 1, 0, this)),
            e.ks.a && (this.a = i(this, e.ks.a, 1, 0, this)),
            e.ks.or.k.length && e.ks.or.k[0].to)
          ) {
            var n,
              s = e.ks.or.k.length
            for (n = 0; n < s; n += 1) (e.ks.or.k[n].to = null), (e.ks.or.k[n].ti = null)
          }
          ;(this.or = i(this, e.ks.or, 1, degToRads, this)),
            (this.or.sh = !0),
            (this.rx = i(this, e.ks.rx, 0, degToRads, this)),
            (this.ry = i(this, e.ks.ry, 0, degToRads, this)),
            (this.rz = i(this, e.ks.rz, 0, degToRads, this)),
            (this.mat = new Matrix()),
            (this._prevMat = new Matrix()),
            (this._isFirstFrame = !0),
            (this.finalTransform = { mProp: this })
        }
        extendPrototype([BaseElement, FrameElement, HierarchyElement], HCameraElement),
          (HCameraElement.prototype.setup = function () {
            var e,
              t = this.comp.threeDElements.length,
              r,
              i,
              n
            for (e = 0; e < t; e += 1)
              if (((r = this.comp.threeDElements[e]), r.type === '3d')) {
                ;(i = r.perspectiveElem.style), (n = r.container.style)
                var s = this.pe.v + 'px',
                  a = '0px 0px 0px',
                  l = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)'
                ;(i.perspective = s),
                  (i.webkitPerspective = s),
                  (n.transformOrigin = a),
                  (n.mozTransformOrigin = a),
                  (n.webkitTransformOrigin = a),
                  (i.transform = l),
                  (i.webkitTransform = l)
              }
          }),
          (HCameraElement.prototype.createElements = function () {}),
          (HCameraElement.prototype.hide = function () {}),
          (HCameraElement.prototype.renderFrame = function () {
            var e = this._isFirstFrame,
              t,
              r
            if (this.hierarchy)
              for (r = this.hierarchy.length, t = 0; t < r; t += 1)
                e = this.hierarchy[t].finalTransform.mProp._mdf || e
            if (
              e ||
              this.pe._mdf ||
              (this.p && this.p._mdf) ||
              (this.px && (this.px._mdf || this.py._mdf || this.pz._mdf)) ||
              this.rx._mdf ||
              this.ry._mdf ||
              this.rz._mdf ||
              this.or._mdf ||
              (this.a && this.a._mdf)
            ) {
              if ((this.mat.reset(), this.hierarchy))
                for (r = this.hierarchy.length - 1, t = r; t >= 0; t -= 1) {
                  var i = this.hierarchy[t].finalTransform.mProp
                  this.mat.translate(-i.p.v[0], -i.p.v[1], i.p.v[2]),
                    this.mat.rotateX(-i.or.v[0]).rotateY(-i.or.v[1]).rotateZ(i.or.v[2]),
                    this.mat.rotateX(-i.rx.v).rotateY(-i.ry.v).rotateZ(i.rz.v),
                    this.mat.scale(1 / i.s.v[0], 1 / i.s.v[1], 1 / i.s.v[2]),
                    this.mat.translate(i.a.v[0], i.a.v[1], i.a.v[2])
                }
              if (
                (this.p
                  ? this.mat.translate(-this.p.v[0], -this.p.v[1], this.p.v[2])
                  : this.mat.translate(-this.px.v, -this.py.v, this.pz.v),
                this.a)
              ) {
                var n
                this.p
                  ? (n = [
                      this.p.v[0] - this.a.v[0],
                      this.p.v[1] - this.a.v[1],
                      this.p.v[2] - this.a.v[2]
                    ])
                  : (n = [
                      this.px.v - this.a.v[0],
                      this.py.v - this.a.v[1],
                      this.pz.v - this.a.v[2]
                    ])
                var s = Math.sqrt(Math.pow(n[0], 2) + Math.pow(n[1], 2) + Math.pow(n[2], 2)),
                  a = [n[0] / s, n[1] / s, n[2] / s],
                  l = Math.sqrt(a[2] * a[2] + a[0] * a[0]),
                  o = Math.atan2(a[1], l),
                  f = Math.atan2(a[0], -a[2])
                this.mat.rotateY(f).rotateX(-o)
              }
              this.mat.rotateX(-this.rx.v).rotateY(-this.ry.v).rotateZ(this.rz.v),
                this.mat.rotateX(-this.or.v[0]).rotateY(-this.or.v[1]).rotateZ(this.or.v[2]),
                this.mat.translate(
                  this.globalData.compSize.w / 2,
                  this.globalData.compSize.h / 2,
                  0
                ),
                this.mat.translate(0, 0, this.pe.v)
              var u = !this._prevMat.equals(this.mat)
              if ((u || this.pe._mdf) && this.comp.threeDElements) {
                r = this.comp.threeDElements.length
                var E, c, b
                for (t = 0; t < r; t += 1)
                  if (((E = this.comp.threeDElements[t]), E.type === '3d')) {
                    if (u) {
                      var x = this.mat.toCSS()
                      ;(b = E.container.style), (b.transform = x), (b.webkitTransform = x)
                    }
                    this.pe._mdf &&
                      ((c = E.perspectiveElem.style),
                      (c.perspective = this.pe.v + 'px'),
                      (c.webkitPerspective = this.pe.v + 'px'))
                  }
                this.mat.clone(this._prevMat)
              }
            }
            this._isFirstFrame = !1
          }),
          (HCameraElement.prototype.prepareFrame = function (e) {
            this.prepareProperties(e, !0)
          }),
          (HCameraElement.prototype.destroy = function () {}),
          (HCameraElement.prototype.getBaseElement = function () {
            return null
          })
        function HImageElement(e, t, r) {
          ;(this.assetData = t.getAssetData(e.refId)), this.initElement(e, t, r)
        }
        extendPrototype(
          [
            BaseElement,
            TransformElement,
            HBaseElement,
            HSolidElement,
            HierarchyElement,
            FrameElement,
            RenderableElement
          ],
          HImageElement
        ),
          (HImageElement.prototype.createContent = function () {
            var e = this.globalData.getAssetsPath(this.assetData),
              t = new Image()
            this.data.hasMask
              ? ((this.imageElem = createNS('image')),
                this.imageElem.setAttribute('width', this.assetData.w + 'px'),
                this.imageElem.setAttribute('height', this.assetData.h + 'px'),
                this.imageElem.setAttributeNS('http://www.w3.org/1999/xlink', 'href', e),
                this.layerElement.appendChild(this.imageElem),
                this.baseElement.setAttribute('width', this.assetData.w),
                this.baseElement.setAttribute('height', this.assetData.h))
              : this.layerElement.appendChild(t),
              (t.crossOrigin = 'anonymous'),
              (t.src = e),
              this.data.ln && this.baseElement.setAttribute('id', this.data.ln)
          })
        function HybridRendererBase(e, t) {
          ;(this.animationItem = e),
            (this.layers = null),
            (this.renderedFrame = -1),
            (this.renderConfig = {
              className: (t && t.className) || '',
              imagePreserveAspectRatio: (t && t.imagePreserveAspectRatio) || 'xMidYMid slice',
              hideOnTransparent: !(t && t.hideOnTransparent === !1),
              filterSize: {
                width: (t && t.filterSize && t.filterSize.width) || '400%',
                height: (t && t.filterSize && t.filterSize.height) || '400%',
                x: (t && t.filterSize && t.filterSize.x) || '-100%',
                y: (t && t.filterSize && t.filterSize.y) || '-100%'
              }
            }),
            (this.globalData = { _mdf: !1, frameNum: -1, renderConfig: this.renderConfig }),
            (this.pendingElements = []),
            (this.elements = []),
            (this.threeDElements = []),
            (this.destroyed = !1),
            (this.camera = null),
            (this.supports3d = !0),
            (this.rendererType = 'html')
        }
        extendPrototype([BaseRenderer], HybridRendererBase),
          (HybridRendererBase.prototype.buildItem = SVGRenderer.prototype.buildItem),
          (HybridRendererBase.prototype.checkPendingElements = function () {
            for (; this.pendingElements.length; ) {
              var e = this.pendingElements.pop()
              e.checkParenting()
            }
          }),
          (HybridRendererBase.prototype.appendElementInPos = function (e, t) {
            var r = e.getBaseElement()
            if (r) {
              var i = this.layers[t]
              if (!i.ddd || !this.supports3d)
                if (this.threeDElements) this.addTo3dContainer(r, t)
                else {
                  for (var n = 0, s, a, l; n < t; )
                    this.elements[n] &&
                      this.elements[n] !== !0 &&
                      this.elements[n].getBaseElement &&
                      ((a = this.elements[n]),
                      (l = this.layers[n].ddd
                        ? this.getThreeDContainerByPos(n)
                        : a.getBaseElement()),
                      (s = l || s)),
                      (n += 1)
                  s
                    ? (!i.ddd || !this.supports3d) && this.layerElement.insertBefore(r, s)
                    : (!i.ddd || !this.supports3d) && this.layerElement.appendChild(r)
                }
              else this.addTo3dContainer(r, t)
            }
          }),
          (HybridRendererBase.prototype.createShape = function (e) {
            return this.supports3d
              ? new HShapeElement(e, this.globalData, this)
              : new SVGShapeElement(e, this.globalData, this)
          }),
          (HybridRendererBase.prototype.createText = function (e) {
            return this.supports3d
              ? new HTextElement(e, this.globalData, this)
              : new SVGTextLottieElement(e, this.globalData, this)
          }),
          (HybridRendererBase.prototype.createCamera = function (e) {
            return (this.camera = new HCameraElement(e, this.globalData, this)), this.camera
          }),
          (HybridRendererBase.prototype.createImage = function (e) {
            return this.supports3d
              ? new HImageElement(e, this.globalData, this)
              : new IImageElement(e, this.globalData, this)
          }),
          (HybridRendererBase.prototype.createSolid = function (e) {
            return this.supports3d
              ? new HSolidElement(e, this.globalData, this)
              : new ISolidElement(e, this.globalData, this)
          }),
          (HybridRendererBase.prototype.createNull = SVGRenderer.prototype.createNull),
          (HybridRendererBase.prototype.getThreeDContainerByPos = function (e) {
            for (var t = 0, r = this.threeDElements.length; t < r; ) {
              if (this.threeDElements[t].startPos <= e && this.threeDElements[t].endPos >= e)
                return this.threeDElements[t].perspectiveElem
              t += 1
            }
            return null
          }),
          (HybridRendererBase.prototype.createThreeDContainer = function (e, t) {
            var r = createTag('div'),
              i,
              n
            styleDiv(r)
            var s = createTag('div')
            if ((styleDiv(s), t === '3d')) {
              ;(i = r.style),
                (i.width = this.globalData.compSize.w + 'px'),
                (i.height = this.globalData.compSize.h + 'px')
              var a = '50% 50%'
              ;(i.webkitTransformOrigin = a),
                (i.mozTransformOrigin = a),
                (i.transformOrigin = a),
                (n = s.style)
              var l = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)'
              ;(n.transform = l), (n.webkitTransform = l)
            }
            r.appendChild(s)
            var o = { container: s, perspectiveElem: r, startPos: e, endPos: e, type: t }
            return this.threeDElements.push(o), o
          }),
          (HybridRendererBase.prototype.build3dContainers = function () {
            var e,
              t = this.layers.length,
              r,
              i = ''
            for (e = 0; e < t; e += 1)
              this.layers[e].ddd && this.layers[e].ty !== 3
                ? (i !== '3d' && ((i = '3d'), (r = this.createThreeDContainer(e, '3d'))),
                  (r.endPos = Math.max(r.endPos, e)))
                : (i !== '2d' && ((i = '2d'), (r = this.createThreeDContainer(e, '2d'))),
                  (r.endPos = Math.max(r.endPos, e)))
            for (t = this.threeDElements.length, e = t - 1; e >= 0; e -= 1)
              this.resizerElem.appendChild(this.threeDElements[e].perspectiveElem)
          }),
          (HybridRendererBase.prototype.addTo3dContainer = function (e, t) {
            for (var r = 0, i = this.threeDElements.length; r < i; ) {
              if (t <= this.threeDElements[r].endPos) {
                for (var n = this.threeDElements[r].startPos, s; n < t; )
                  this.elements[n] &&
                    this.elements[n].getBaseElement &&
                    (s = this.elements[n].getBaseElement()),
                    (n += 1)
                s
                  ? this.threeDElements[r].container.insertBefore(e, s)
                  : this.threeDElements[r].container.appendChild(e)
                break
              }
              r += 1
            }
          }),
          (HybridRendererBase.prototype.configAnimation = function (e) {
            var t = createTag('div'),
              r = this.animationItem.wrapper,
              i = t.style
            ;(i.width = e.w + 'px'),
              (i.height = e.h + 'px'),
              (this.resizerElem = t),
              styleDiv(t),
              (i.transformStyle = 'flat'),
              (i.mozTransformStyle = 'flat'),
              (i.webkitTransformStyle = 'flat'),
              this.renderConfig.className && t.setAttribute('class', this.renderConfig.className),
              r.appendChild(t),
              (i.overflow = 'hidden')
            var n = createNS('svg')
            n.setAttribute('width', '1'),
              n.setAttribute('height', '1'),
              styleDiv(n),
              this.resizerElem.appendChild(n)
            var s = createNS('defs')
            n.appendChild(s),
              (this.data = e),
              this.setupGlobalData(e, n),
              (this.globalData.defs = s),
              (this.layers = e.layers),
              (this.layerElement = this.resizerElem),
              this.build3dContainers(),
              this.updateContainerSize()
          }),
          (HybridRendererBase.prototype.destroy = function () {
            this.animationItem.wrapper && (this.animationItem.wrapper.innerText = ''),
              (this.animationItem.container = null),
              (this.globalData.defs = null)
            var e,
              t = this.layers ? this.layers.length : 0
            for (e = 0; e < t; e += 1)
              this.elements[e] && this.elements[e].destroy && this.elements[e].destroy()
            ;(this.elements.length = 0), (this.destroyed = !0), (this.animationItem = null)
          }),
          (HybridRendererBase.prototype.updateContainerSize = function () {
            var e = this.animationItem.wrapper.offsetWidth,
              t = this.animationItem.wrapper.offsetHeight,
              r = e / t,
              i = this.globalData.compSize.w / this.globalData.compSize.h,
              n,
              s,
              a,
              l
            i > r
              ? ((n = e / this.globalData.compSize.w),
                (s = e / this.globalData.compSize.w),
                (a = 0),
                (l = (t - this.globalData.compSize.h * (e / this.globalData.compSize.w)) / 2))
              : ((n = t / this.globalData.compSize.h),
                (s = t / this.globalData.compSize.h),
                (a = (e - this.globalData.compSize.w * (t / this.globalData.compSize.h)) / 2),
                (l = 0))
            var o = this.resizerElem.style
            ;(o.webkitTransform =
              'matrix3d(' + n + ',0,0,0,0,' + s + ',0,0,0,0,1,0,' + a + ',' + l + ',0,1)'),
              (o.transform = o.webkitTransform)
          }),
          (HybridRendererBase.prototype.renderFrame = SVGRenderer.prototype.renderFrame),
          (HybridRendererBase.prototype.hide = function () {
            this.resizerElem.style.display = 'none'
          }),
          (HybridRendererBase.prototype.show = function () {
            this.resizerElem.style.display = 'block'
          }),
          (HybridRendererBase.prototype.initItems = function () {
            if ((this.buildAllItems(), this.camera)) this.camera.setup()
            else {
              var e = this.globalData.compSize.w,
                t = this.globalData.compSize.h,
                r,
                i = this.threeDElements.length
              for (r = 0; r < i; r += 1) {
                var n = this.threeDElements[r].perspectiveElem.style
                ;(n.webkitPerspective = Math.sqrt(Math.pow(e, 2) + Math.pow(t, 2)) + 'px'),
                  (n.perspective = n.webkitPerspective)
              }
            }
          }),
          (HybridRendererBase.prototype.searchExtraCompositions = function (e) {
            var t,
              r = e.length,
              i = createTag('div')
            for (t = 0; t < r; t += 1)
              if (e[t].xt) {
                var n = this.createComp(e[t], i, this.globalData.comp, null)
                n.initExpressions(), this.globalData.projectInterface.registerComposition(n)
              }
          })
        function HCompElement(e, t, r) {
          ;(this.layers = e.layers),
            (this.supports3d = !e.hasMask),
            (this.completeLayers = !1),
            (this.pendingElements = []),
            (this.elements = this.layers ? createSizedArray(this.layers.length) : []),
            this.initElement(e, t, r),
            (this.tm = e.tm
              ? PropertyFactory.getProp(this, e.tm, 0, t.frameRate, this)
              : { _placeholder: !0 })
        }
        extendPrototype([HybridRendererBase, ICompElement, HBaseElement], HCompElement),
          (HCompElement.prototype._createBaseContainerElements =
            HCompElement.prototype.createContainerElements),
          (HCompElement.prototype.createContainerElements = function () {
            this._createBaseContainerElements(),
              this.data.hasMask
                ? (this.svgElement.setAttribute('width', this.data.w),
                  this.svgElement.setAttribute('height', this.data.h),
                  (this.transformedElement = this.baseElement))
                : (this.transformedElement = this.layerElement)
          }),
          (HCompElement.prototype.addTo3dContainer = function (e, t) {
            for (var r = 0, i; r < t; )
              this.elements[r] &&
                this.elements[r].getBaseElement &&
                (i = this.elements[r].getBaseElement()),
                (r += 1)
            i ? this.layerElement.insertBefore(e, i) : this.layerElement.appendChild(e)
          }),
          (HCompElement.prototype.createComp = function (e) {
            return this.supports3d
              ? new HCompElement(e, this.globalData, this)
              : new SVGCompElement(e, this.globalData, this)
          })
        function HybridRenderer(e, t) {
          ;(this.animationItem = e),
            (this.layers = null),
            (this.renderedFrame = -1),
            (this.renderConfig = {
              className: (t && t.className) || '',
              imagePreserveAspectRatio: (t && t.imagePreserveAspectRatio) || 'xMidYMid slice',
              hideOnTransparent: !(t && t.hideOnTransparent === !1),
              filterSize: {
                width: (t && t.filterSize && t.filterSize.width) || '400%',
                height: (t && t.filterSize && t.filterSize.height) || '400%',
                x: (t && t.filterSize && t.filterSize.x) || '-100%',
                y: (t && t.filterSize && t.filterSize.y) || '-100%'
              },
              runExpressions: !t || t.runExpressions === void 0 || t.runExpressions
            }),
            (this.globalData = { _mdf: !1, frameNum: -1, renderConfig: this.renderConfig }),
            (this.pendingElements = []),
            (this.elements = []),
            (this.threeDElements = []),
            (this.destroyed = !1),
            (this.camera = null),
            (this.supports3d = !0),
            (this.rendererType = 'html')
        }
        extendPrototype([HybridRendererBase], HybridRenderer),
          (HybridRenderer.prototype.createComp = function (e) {
            return this.supports3d
              ? new HCompElement(e, this.globalData, this)
              : new SVGCompElement(e, this.globalData, this)
          })
        var CompExpressionInterface = (function () {
          return function (e) {
            function t(r) {
              for (var i = 0, n = e.layers.length; i < n; ) {
                if (e.layers[i].nm === r || e.layers[i].ind === r)
                  return e.elements[i].layerInterface
                i += 1
              }
              return null
            }
            return (
              Object.defineProperty(t, '_name', { value: e.data.nm }),
              (t.layer = t),
              (t.pixelAspect = 1),
              (t.height = e.data.h || e.globalData.compSize.h),
              (t.width = e.data.w || e.globalData.compSize.w),
              (t.pixelAspect = 1),
              (t.frameDuration = 1 / e.globalData.frameRate),
              (t.displayStartTime = 0),
              (t.numLayers = e.layers.length),
              t
            )
          }
        })()
        function _typeof$2(e) {
          '@babel/helpers - typeof'
          return (
            typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
              ? (_typeof$2 = function (r) {
                  return typeof r
                })
              : (_typeof$2 = function (r) {
                  return r &&
                    typeof Symbol == 'function' &&
                    r.constructor === Symbol &&
                    r !== Symbol.prototype
                    ? 'symbol'
                    : typeof r
                }),
            _typeof$2(e)
          )
        }
        function seedRandom(e, t) {
          var r = this,
            i = 256,
            n = 6,
            s = 52,
            a = 'random',
            l = t.pow(i, n),
            o = t.pow(2, s),
            f = o * 2,
            u = i - 1,
            E
          function c(d, g, C) {
            var P = []
            g = g === !0 ? { entropy: !0 } : g || {}
            var k = _(y(g.entropy ? [d, A(e)] : d === null ? m() : d, 3), P),
              M = new b(P),
              D = function () {
                for (var H = M.g(n), $ = l, Z = 0; H < o; )
                  (H = (H + Z) * i), ($ *= i), (Z = M.g(1))
                for (; H >= f; ) (H /= 2), ($ /= 2), (Z >>>= 1)
                return (H + Z) / $
              }
            return (
              (D.int32 = function () {
                return M.g(4) | 0
              }),
              (D.quick = function () {
                return M.g(4) / 4294967296
              }),
              (D.double = D),
              _(A(M.S), e),
              (
                g.pass ||
                C ||
                function (W, H, $, Z) {
                  return (
                    Z &&
                      (Z.S && x(Z, M),
                      (W.state = function () {
                        return x(M, {})
                      })),
                    $ ? ((t[a] = W), H) : W
                  )
                }
              )(D, k, 'global' in g ? g.global : this == t, g.state)
            )
          }
          t['seed' + a] = c
          function b(d) {
            var g,
              C = d.length,
              P = this,
              k = 0,
              M = (P.i = P.j = 0),
              D = (P.S = [])
            for (C || (d = [C++]); k < i; ) D[k] = k++
            for (k = 0; k < i; k++) (D[k] = D[(M = u & (M + d[k % C] + (g = D[k])))]), (D[M] = g)
            P.g = function (W) {
              for (var H, $ = 0, Z = P.i, Y = P.j, L = P.S; W--; )
                (H = L[(Z = u & (Z + 1))]),
                  ($ = $ * i + L[u & ((L[Z] = L[(Y = u & (Y + H))]) + (L[Y] = H))])
              return (P.i = Z), (P.j = Y), $
            }
          }
          function x(d, g) {
            return (g.i = d.i), (g.j = d.j), (g.S = d.S.slice()), g
          }
          function y(d, g) {
            var C = [],
              P = _typeof$2(d),
              k
            if (g && P == 'object')
              for (k in d)
                try {
                  C.push(y(d[k], g - 1))
                } catch {}
            return C.length ? C : P == 'string' ? d : d + '\0'
          }
          function _(d, g) {
            for (var C = d + '', P, k = 0; k < C.length; )
              g[u & k] = u & ((P ^= g[u & k] * 19) + C.charCodeAt(k++))
            return A(g)
          }
          function m() {
            try {
              var d = new Uint8Array(i)
              return (r.crypto || r.msCrypto).getRandomValues(d), A(d)
            } catch {
              var g = r.navigator,
                C = g && g.plugins
              return [+new Date(), r, C, r.screen, A(e)]
            }
          }
          function A(d) {
            return String.fromCharCode.apply(0, d)
          }
          _(t.random(), e)
        }
        function initialize$2(e) {
          seedRandom([], e)
        }
        var propTypes = { SHAPE: 'shape' }
        function _typeof$1(e) {
          '@babel/helpers - typeof'
          return (
            typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
              ? (_typeof$1 = function (r) {
                  return typeof r
                })
              : (_typeof$1 = function (r) {
                  return r &&
                    typeof Symbol == 'function' &&
                    r.constructor === Symbol &&
                    r !== Symbol.prototype
                    ? 'symbol'
                    : typeof r
                }),
            _typeof$1(e)
          )
        }
        var ExpressionManager = (function () {
            var ob = {},
              Math = BMMath,
              window = null,
              document = null,
              XMLHttpRequest = null,
              fetch = null,
              frames = null,
              _lottieGlobal = {}
            initialize$2(BMMath)
            function resetFrame() {
              _lottieGlobal = {}
            }
            function $bm_isInstanceOfArray(e) {
              return e.constructor === Array || e.constructor === Float32Array
            }
            function isNumerable(e, t) {
              return e === 'number' || t instanceof Number || e === 'boolean' || e === 'string'
            }
            function $bm_neg(e) {
              var t = _typeof$1(e)
              if (t === 'number' || e instanceof Number || t === 'boolean') return -e
              if ($bm_isInstanceOfArray(e)) {
                var r,
                  i = e.length,
                  n = []
                for (r = 0; r < i; r += 1) n[r] = -e[r]
                return n
              }
              return e.propType ? e.v : -e
            }
            var easeInBez = BezierFactory.getBezierEasing(0.333, 0, 0.833, 0.833, 'easeIn').get,
              easeOutBez = BezierFactory.getBezierEasing(0.167, 0.167, 0.667, 1, 'easeOut').get,
              easeInOutBez = BezierFactory.getBezierEasing(0.33, 0, 0.667, 1, 'easeInOut').get
            function sum(e, t) {
              var r = _typeof$1(e),
                i = _typeof$1(t)
              if ((isNumerable(r, e) && isNumerable(i, t)) || r === 'string' || i === 'string')
                return e + t
              if ($bm_isInstanceOfArray(e) && isNumerable(i, t))
                return (e = e.slice(0)), (e[0] += t), e
              if (isNumerable(r, e) && $bm_isInstanceOfArray(t))
                return (t = t.slice(0)), (t[0] = e + t[0]), t
              if ($bm_isInstanceOfArray(e) && $bm_isInstanceOfArray(t)) {
                for (var n = 0, s = e.length, a = t.length, l = []; n < s || n < a; )
                  (typeof e[n] == 'number' || e[n] instanceof Number) &&
                  (typeof t[n] == 'number' || t[n] instanceof Number)
                    ? (l[n] = e[n] + t[n])
                    : (l[n] = t[n] === void 0 ? e[n] : e[n] || t[n]),
                    (n += 1)
                return l
              }
              return 0
            }
            var add = sum
            function sub(e, t) {
              var r = _typeof$1(e),
                i = _typeof$1(t)
              if (isNumerable(r, e) && isNumerable(i, t))
                return (
                  r === 'string' && (e = parseInt(e, 10)),
                  i === 'string' && (t = parseInt(t, 10)),
                  e - t
                )
              if ($bm_isInstanceOfArray(e) && isNumerable(i, t))
                return (e = e.slice(0)), (e[0] -= t), e
              if (isNumerable(r, e) && $bm_isInstanceOfArray(t))
                return (t = t.slice(0)), (t[0] = e - t[0]), t
              if ($bm_isInstanceOfArray(e) && $bm_isInstanceOfArray(t)) {
                for (var n = 0, s = e.length, a = t.length, l = []; n < s || n < a; )
                  (typeof e[n] == 'number' || e[n] instanceof Number) &&
                  (typeof t[n] == 'number' || t[n] instanceof Number)
                    ? (l[n] = e[n] - t[n])
                    : (l[n] = t[n] === void 0 ? e[n] : e[n] || t[n]),
                    (n += 1)
                return l
              }
              return 0
            }
            function mul(e, t) {
              var r = _typeof$1(e),
                i = _typeof$1(t),
                n
              if (isNumerable(r, e) && isNumerable(i, t)) return e * t
              var s, a
              if ($bm_isInstanceOfArray(e) && isNumerable(i, t)) {
                for (a = e.length, n = createTypedArray('float32', a), s = 0; s < a; s += 1)
                  n[s] = e[s] * t
                return n
              }
              if (isNumerable(r, e) && $bm_isInstanceOfArray(t)) {
                for (a = t.length, n = createTypedArray('float32', a), s = 0; s < a; s += 1)
                  n[s] = e * t[s]
                return n
              }
              return 0
            }
            function div(e, t) {
              var r = _typeof$1(e),
                i = _typeof$1(t),
                n
              if (isNumerable(r, e) && isNumerable(i, t)) return e / t
              var s, a
              if ($bm_isInstanceOfArray(e) && isNumerable(i, t)) {
                for (a = e.length, n = createTypedArray('float32', a), s = 0; s < a; s += 1)
                  n[s] = e[s] / t
                return n
              }
              if (isNumerable(r, e) && $bm_isInstanceOfArray(t)) {
                for (a = t.length, n = createTypedArray('float32', a), s = 0; s < a; s += 1)
                  n[s] = e / t[s]
                return n
              }
              return 0
            }
            function mod(e, t) {
              return (
                typeof e == 'string' && (e = parseInt(e, 10)),
                typeof t == 'string' && (t = parseInt(t, 10)),
                e % t
              )
            }
            var $bm_sum = sum,
              $bm_sub = sub,
              $bm_mul = mul,
              $bm_div = div,
              $bm_mod = mod
            function clamp(e, t, r) {
              if (t > r) {
                var i = r
                ;(r = t), (t = i)
              }
              return Math.min(Math.max(e, t), r)
            }
            function radiansToDegrees(e) {
              return e / degToRads
            }
            var radians_to_degrees = radiansToDegrees
            function degreesToRadians(e) {
              return e * degToRads
            }
            var degrees_to_radians = radiansToDegrees,
              helperLengthArray = [0, 0, 0, 0, 0, 0]
            function length(e, t) {
              if (typeof e == 'number' || e instanceof Number) return (t = t || 0), Math.abs(e - t)
              t || (t = helperLengthArray)
              var r,
                i = Math.min(e.length, t.length),
                n = 0
              for (r = 0; r < i; r += 1) n += Math.pow(t[r] - e[r], 2)
              return Math.sqrt(n)
            }
            function normalize(e) {
              return div(e, length(e))
            }
            function rgbToHsl(e) {
              var t = e[0],
                r = e[1],
                i = e[2],
                n = Math.max(t, r, i),
                s = Math.min(t, r, i),
                a,
                l,
                o = (n + s) / 2
              if (n === s) (a = 0), (l = 0)
              else {
                var f = n - s
                switch (((l = o > 0.5 ? f / (2 - n - s) : f / (n + s)), n)) {
                  case t:
                    a = (r - i) / f + (r < i ? 6 : 0)
                    break
                  case r:
                    a = (i - t) / f + 2
                    break
                  case i:
                    a = (t - r) / f + 4
                    break
                }
                a /= 6
              }
              return [a, l, o, e[3]]
            }
            function hue2rgb(e, t, r) {
              return (
                r < 0 && (r += 1),
                r > 1 && (r -= 1),
                r < 1 / 6
                  ? e + (t - e) * 6 * r
                  : r < 1 / 2
                    ? t
                    : r < 2 / 3
                      ? e + (t - e) * (2 / 3 - r) * 6
                      : e
              )
            }
            function hslToRgb(e) {
              var t = e[0],
                r = e[1],
                i = e[2],
                n,
                s,
                a
              if (r === 0) (n = i), (a = i), (s = i)
              else {
                var l = i < 0.5 ? i * (1 + r) : i + r - i * r,
                  o = 2 * i - l
                ;(n = hue2rgb(o, l, t + 1 / 3)),
                  (s = hue2rgb(o, l, t)),
                  (a = hue2rgb(o, l, t - 1 / 3))
              }
              return [n, s, a, e[3]]
            }
            function linear(e, t, r, i, n) {
              if (((i === void 0 || n === void 0) && ((i = t), (n = r), (t = 0), (r = 1)), r < t)) {
                var s = r
                ;(r = t), (t = s)
              }
              if (e <= t) return i
              if (e >= r) return n
              var a = r === t ? 0 : (e - t) / (r - t)
              if (!i.length) return i + (n - i) * a
              var l,
                o = i.length,
                f = createTypedArray('float32', o)
              for (l = 0; l < o; l += 1) f[l] = i[l] + (n[l] - i[l]) * a
              return f
            }
            function random(e, t) {
              if (
                (t === void 0 && (e === void 0 ? ((e = 0), (t = 1)) : ((t = e), (e = void 0))),
                t.length)
              ) {
                var r,
                  i = t.length
                e || (e = createTypedArray('float32', i))
                var n = createTypedArray('float32', i),
                  s = BMMath.random()
                for (r = 0; r < i; r += 1) n[r] = e[r] + s * (t[r] - e[r])
                return n
              }
              e === void 0 && (e = 0)
              var a = BMMath.random()
              return e + a * (t - e)
            }
            function createPath(e, t, r, i) {
              var n,
                s = e.length,
                a = shapePool.newElement()
              a.setPathData(!!i, s)
              var l = [0, 0],
                o,
                f
              for (n = 0; n < s; n += 1)
                (o = t && t[n] ? t[n] : l),
                  (f = r && r[n] ? r[n] : l),
                  a.setTripleAt(
                    e[n][0],
                    e[n][1],
                    f[0] + e[n][0],
                    f[1] + e[n][1],
                    o[0] + e[n][0],
                    o[1] + e[n][1],
                    n,
                    !0
                  )
              return a
            }
            function initiateExpression(elem, data, property) {
              function noOp(e) {
                return e
              }
              if (!elem.globalData.renderConfig.runExpressions) return noOp
              var val = data.x,
                needsVelocity = /velocity(?![\w\d])/.test(val),
                _needsRandom = val.indexOf('random') !== -1,
                elemType = elem.data.ty,
                transform,
                $bm_transform,
                content,
                effect,
                thisProperty = property
              ;(thisProperty.valueAtTime = thisProperty.getValueAtTime),
                Object.defineProperty(thisProperty, 'value', {
                  get: function () {
                    return thisProperty.v
                  }
                }),
                (elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate),
                (elem.comp.displayStartTime = 0)
              var inPoint = elem.data.ip / elem.comp.globalData.frameRate,
                outPoint = elem.data.op / elem.comp.globalData.frameRate,
                width = elem.data.sw ? elem.data.sw : 0,
                height = elem.data.sh ? elem.data.sh : 0,
                name = elem.data.nm,
                loopIn,
                loop_in,
                loopOut,
                loop_out,
                smooth,
                toWorld,
                fromWorld,
                fromComp,
                toComp,
                fromCompToSurface,
                position,
                rotation,
                anchorPoint,
                scale,
                thisLayer,
                thisComp,
                mask,
                valueAtTime,
                velocityAtTime,
                scoped_bm_rt,
                expression_function = eval(
                  '[function _expression_function(){' + val + ';scoped_bm_rt=$bm_rt}]'
                )[0],
                numKeys = property.kf ? data.k.length : 0,
                active = !this.data || this.data.hd !== !0,
                wiggle = function e(t, r) {
                  var i,
                    n,
                    s = this.pv.length ? this.pv.length : 1,
                    a = createTypedArray('float32', s)
                  t = 5
                  var l = Math.floor(time * t)
                  for (i = 0, n = 0; i < l; ) {
                    for (n = 0; n < s; n += 1) a[n] += -r + r * 2 * BMMath.random()
                    i += 1
                  }
                  var o = time * t,
                    f = o - Math.floor(o),
                    u = createTypedArray('float32', s)
                  if (s > 1) {
                    for (n = 0; n < s; n += 1)
                      u[n] = this.pv[n] + a[n] + (-r + r * 2 * BMMath.random()) * f
                    return u
                  }
                  return this.pv + a[0] + (-r + r * 2 * BMMath.random()) * f
                }.bind(this)
              thisProperty.loopIn &&
                ((loopIn = thisProperty.loopIn.bind(thisProperty)), (loop_in = loopIn)),
                thisProperty.loopOut &&
                  ((loopOut = thisProperty.loopOut.bind(thisProperty)), (loop_out = loopOut)),
                thisProperty.smooth && (smooth = thisProperty.smooth.bind(thisProperty))
              function loopInDuration(e, t) {
                return loopIn(e, t, !0)
              }
              function loopOutDuration(e, t) {
                return loopOut(e, t, !0)
              }
              this.getValueAtTime && (valueAtTime = this.getValueAtTime.bind(this)),
                this.getVelocityAtTime && (velocityAtTime = this.getVelocityAtTime.bind(this))
              var comp = elem.comp.globalData.projectInterface.bind(
                elem.comp.globalData.projectInterface
              )
              function lookAt(e, t) {
                var r = [t[0] - e[0], t[1] - e[1], t[2] - e[2]],
                  i = Math.atan2(r[0], Math.sqrt(r[1] * r[1] + r[2] * r[2])) / degToRads,
                  n = -Math.atan2(r[1], r[2]) / degToRads
                return [n, i, 0]
              }
              function easeOut(e, t, r, i, n) {
                return applyEase(easeOutBez, e, t, r, i, n)
              }
              function easeIn(e, t, r, i, n) {
                return applyEase(easeInBez, e, t, r, i, n)
              }
              function ease(e, t, r, i, n) {
                return applyEase(easeInOutBez, e, t, r, i, n)
              }
              function applyEase(e, t, r, i, n, s) {
                n === void 0 ? ((n = r), (s = i)) : (t = (t - r) / (i - r)),
                  t > 1 ? (t = 1) : t < 0 && (t = 0)
                var a = e(t)
                if ($bm_isInstanceOfArray(n)) {
                  var l,
                    o = n.length,
                    f = createTypedArray('float32', o)
                  for (l = 0; l < o; l += 1) f[l] = (s[l] - n[l]) * a + n[l]
                  return f
                }
                return (s - n) * a + n
              }
              function nearestKey(e) {
                var t,
                  r = data.k.length,
                  i,
                  n
                if (!data.k.length || typeof data.k[0] == 'number') (i = 0), (n = 0)
                else if (((i = -1), (e *= elem.comp.globalData.frameRate), e < data.k[0].t))
                  (i = 1), (n = data.k[0].t)
                else {
                  for (t = 0; t < r - 1; t += 1)
                    if (e === data.k[t].t) {
                      ;(i = t + 1), (n = data.k[t].t)
                      break
                    } else if (e > data.k[t].t && e < data.k[t + 1].t) {
                      e - data.k[t].t > data.k[t + 1].t - e
                        ? ((i = t + 2), (n = data.k[t + 1].t))
                        : ((i = t + 1), (n = data.k[t].t))
                      break
                    }
                  i === -1 && ((i = t + 1), (n = data.k[t].t))
                }
                var s = {}
                return (s.index = i), (s.time = n / elem.comp.globalData.frameRate), s
              }
              function key(e) {
                var t, r, i
                if (!data.k.length || typeof data.k[0] == 'number')
                  throw new Error('The property has no keyframe at index ' + e)
                ;(e -= 1), (t = { time: data.k[e].t / elem.comp.globalData.frameRate, value: [] })
                var n = Object.prototype.hasOwnProperty.call(data.k[e], 's')
                  ? data.k[e].s
                  : data.k[e - 1].e
                for (i = n.length, r = 0; r < i; r += 1) (t[r] = n[r]), (t.value[r] = n[r])
                return t
              }
              function framesToTime(e, t) {
                return t || (t = elem.comp.globalData.frameRate), e / t
              }
              function timeToFrames(e, t) {
                return !e && e !== 0 && (e = time), t || (t = elem.comp.globalData.frameRate), e * t
              }
              function seedRandom(e) {
                BMMath.seedrandom(randSeed + e)
              }
              function sourceRectAtTime() {
                return elem.sourceRectAtTime()
              }
              function substring(e, t) {
                return typeof value == 'string'
                  ? t === void 0
                    ? value.substring(e)
                    : value.substring(e, t)
                  : ''
              }
              function substr(e, t) {
                return typeof value == 'string'
                  ? t === void 0
                    ? value.substr(e)
                    : value.substr(e, t)
                  : ''
              }
              function posterizeTime(e) {
                ;(time = e === 0 ? 0 : Math.floor(time * e) / e), (value = valueAtTime(time))
              }
              var time,
                velocity,
                value,
                text,
                textIndex,
                textTotal,
                selectorValue,
                index = elem.data.ind,
                hasParent = !!(elem.hierarchy && elem.hierarchy.length),
                parent,
                randSeed = Math.floor(Math.random() * 1e6),
                globalData = elem.globalData
              function executeExpression(e) {
                return (
                  (value = e),
                  this.frameExpressionId === elem.globalData.frameId &&
                  this.propType !== 'textSelector'
                    ? value
                    : (this.propType === 'textSelector' &&
                        ((textIndex = this.textIndex),
                        (textTotal = this.textTotal),
                        (selectorValue = this.selectorValue)),
                      thisLayer ||
                        ((text = elem.layerInterface.text),
                        (thisLayer = elem.layerInterface),
                        (thisComp = elem.comp.compInterface),
                        (toWorld = thisLayer.toWorld.bind(thisLayer)),
                        (fromWorld = thisLayer.fromWorld.bind(thisLayer)),
                        (fromComp = thisLayer.fromComp.bind(thisLayer)),
                        (toComp = thisLayer.toComp.bind(thisLayer)),
                        (mask = thisLayer.mask ? thisLayer.mask.bind(thisLayer) : null),
                        (fromCompToSurface = fromComp)),
                      transform ||
                        ((transform = elem.layerInterface('ADBE Transform Group')),
                        ($bm_transform = transform),
                        transform && (anchorPoint = transform.anchorPoint)),
                      elemType === 4 &&
                        !content &&
                        (content = thisLayer('ADBE Root Vectors Group')),
                      effect || (effect = thisLayer(4)),
                      (hasParent = !!(elem.hierarchy && elem.hierarchy.length)),
                      hasParent && !parent && (parent = elem.hierarchy[0].layerInterface),
                      (time = this.comp.renderedFrame / this.comp.globalData.frameRate),
                      _needsRandom && seedRandom(randSeed + time),
                      needsVelocity && (velocity = velocityAtTime(time)),
                      expression_function(),
                      (this.frameExpressionId = elem.globalData.frameId),
                      (scoped_bm_rt =
                        scoped_bm_rt.propType === propTypes.SHAPE ? scoped_bm_rt.v : scoped_bm_rt),
                      scoped_bm_rt)
                )
              }
              return (
                (executeExpression.__preventDeadCodeRemoval = [
                  $bm_transform,
                  anchorPoint,
                  time,
                  velocity,
                  inPoint,
                  outPoint,
                  width,
                  height,
                  name,
                  loop_in,
                  loop_out,
                  smooth,
                  toComp,
                  fromCompToSurface,
                  toWorld,
                  fromWorld,
                  mask,
                  position,
                  rotation,
                  scale,
                  thisComp,
                  numKeys,
                  active,
                  wiggle,
                  loopInDuration,
                  loopOutDuration,
                  comp,
                  lookAt,
                  easeOut,
                  easeIn,
                  ease,
                  nearestKey,
                  key,
                  text,
                  textIndex,
                  textTotal,
                  selectorValue,
                  framesToTime,
                  timeToFrames,
                  sourceRectAtTime,
                  substring,
                  substr,
                  posterizeTime,
                  index,
                  globalData
                ]),
                executeExpression
              )
            }
            return (
              (ob.initiateExpression = initiateExpression),
              (ob.__preventDeadCodeRemoval = [
                window,
                document,
                XMLHttpRequest,
                fetch,
                frames,
                $bm_neg,
                add,
                $bm_sum,
                $bm_sub,
                $bm_mul,
                $bm_div,
                $bm_mod,
                clamp,
                radians_to_degrees,
                degreesToRadians,
                degrees_to_radians,
                normalize,
                rgbToHsl,
                hslToRgb,
                linear,
                random,
                createPath,
                _lottieGlobal
              ]),
              (ob.resetFrame = resetFrame),
              ob
            )
          })(),
          Expressions = (function () {
            var e = {}
            ;(e.initExpressions = t), (e.resetFrame = ExpressionManager.resetFrame)
            function t(r) {
              var i = 0,
                n = []
              function s() {
                i += 1
              }
              function a() {
                ;(i -= 1), i === 0 && o()
              }
              function l(f) {
                n.indexOf(f) === -1 && n.push(f)
              }
              function o() {
                var f,
                  u = n.length
                for (f = 0; f < u; f += 1) n[f].release()
                n.length = 0
              }
              ;(r.renderer.compInterface = CompExpressionInterface(r.renderer)),
                r.renderer.globalData.projectInterface.registerComposition(r.renderer),
                (r.renderer.globalData.pushExpression = s),
                (r.renderer.globalData.popExpression = a),
                (r.renderer.globalData.registerExpressionProperty = l)
            }
            return e
          })(),
          MaskManagerInterface = (function () {
            function e(r, i) {
              ;(this._mask = r), (this._data = i)
            }
            Object.defineProperty(e.prototype, 'maskPath', {
              get: function () {
                return this._mask.prop.k && this._mask.prop.getValue(), this._mask.prop
              }
            }),
              Object.defineProperty(e.prototype, 'maskOpacity', {
                get: function () {
                  return this._mask.op.k && this._mask.op.getValue(), this._mask.op.v * 100
                }
              })
            var t = function (i) {
              var n = createSizedArray(i.viewData.length),
                s,
                a = i.viewData.length
              for (s = 0; s < a; s += 1) n[s] = new e(i.viewData[s], i.masksProperties[s])
              var l = function (f) {
                for (s = 0; s < a; ) {
                  if (i.masksProperties[s].nm === f) return n[s]
                  s += 1
                }
                return null
              }
              return l
            }
            return t
          })(),
          ExpressionPropertyInterface = (function () {
            var e = { pv: 0, v: 0, mult: 1 },
              t = { pv: [0, 0, 0], v: [0, 0, 0], mult: 1 }
            function r(a, l, o) {
              Object.defineProperty(a, 'velocity', {
                get: function () {
                  return l.getVelocityAtTime(l.comp.currentFrame)
                }
              }),
                (a.numKeys = l.keyframes ? l.keyframes.length : 0),
                (a.key = function (f) {
                  if (!a.numKeys) return 0
                  var u = ''
                  's' in l.keyframes[f - 1]
                    ? (u = l.keyframes[f - 1].s)
                    : 'e' in l.keyframes[f - 2]
                      ? (u = l.keyframes[f - 2].e)
                      : (u = l.keyframes[f - 2].s)
                  var E = o === 'unidimensional' ? new Number(u) : Object.assign({}, u)
                  return (
                    (E.time = l.keyframes[f - 1].t / l.elem.comp.globalData.frameRate),
                    (E.value = o === 'unidimensional' ? u[0] : u),
                    E
                  )
                }),
                (a.valueAtTime = l.getValueAtTime),
                (a.speedAtTime = l.getSpeedAtTime),
                (a.velocityAtTime = l.getVelocityAtTime),
                (a.propertyGroup = l.propertyGroup)
            }
            function i(a) {
              ;(!a || !('pv' in a)) && (a = e)
              var l = 1 / a.mult,
                o = a.pv * l,
                f = new Number(o)
              return (
                (f.value = o),
                r(f, a, 'unidimensional'),
                function () {
                  return (
                    a.k && a.getValue(),
                    (o = a.v * l),
                    f.value !== o &&
                      ((f = new Number(o)), (f.value = o), r(f, a, 'unidimensional')),
                    f
                  )
                }
              )
            }
            function n(a) {
              ;(!a || !('pv' in a)) && (a = t)
              var l = 1 / a.mult,
                o = (a.data && a.data.l) || a.pv.length,
                f = createTypedArray('float32', o),
                u = createTypedArray('float32', o)
              return (
                (f.value = u),
                r(f, a, 'multidimensional'),
                function () {
                  a.k && a.getValue()
                  for (var E = 0; E < o; E += 1) (u[E] = a.v[E] * l), (f[E] = u[E])
                  return f
                }
              )
            }
            function s() {
              return e
            }
            return function (a) {
              return a ? (a.propType === 'unidimensional' ? i(a) : n(a)) : s
            }
          })(),
          TransformExpressionInterface = (function () {
            return function (e) {
              function t(a) {
                switch (a) {
                  case 'scale':
                  case 'Scale':
                  case 'ADBE Scale':
                  case 6:
                    return t.scale
                  case 'rotation':
                  case 'Rotation':
                  case 'ADBE Rotation':
                  case 'ADBE Rotate Z':
                  case 10:
                    return t.rotation
                  case 'ADBE Rotate X':
                    return t.xRotation
                  case 'ADBE Rotate Y':
                    return t.yRotation
                  case 'position':
                  case 'Position':
                  case 'ADBE Position':
                  case 2:
                    return t.position
                  case 'ADBE Position_0':
                    return t.xPosition
                  case 'ADBE Position_1':
                    return t.yPosition
                  case 'ADBE Position_2':
                    return t.zPosition
                  case 'anchorPoint':
                  case 'AnchorPoint':
                  case 'Anchor Point':
                  case 'ADBE AnchorPoint':
                  case 1:
                    return t.anchorPoint
                  case 'opacity':
                  case 'Opacity':
                  case 11:
                    return t.opacity
                  default:
                    return null
                }
              }
              Object.defineProperty(t, 'rotation', {
                get: ExpressionPropertyInterface(e.r || e.rz)
              }),
                Object.defineProperty(t, 'zRotation', {
                  get: ExpressionPropertyInterface(e.rz || e.r)
                }),
                Object.defineProperty(t, 'xRotation', { get: ExpressionPropertyInterface(e.rx) }),
                Object.defineProperty(t, 'yRotation', { get: ExpressionPropertyInterface(e.ry) }),
                Object.defineProperty(t, 'scale', { get: ExpressionPropertyInterface(e.s) })
              var r, i, n, s
              return (
                e.p
                  ? (s = ExpressionPropertyInterface(e.p))
                  : ((r = ExpressionPropertyInterface(e.px)),
                    (i = ExpressionPropertyInterface(e.py)),
                    e.pz && (n = ExpressionPropertyInterface(e.pz))),
                Object.defineProperty(t, 'position', {
                  get: function () {
                    return e.p ? s() : [r(), i(), n ? n() : 0]
                  }
                }),
                Object.defineProperty(t, 'xPosition', { get: ExpressionPropertyInterface(e.px) }),
                Object.defineProperty(t, 'yPosition', { get: ExpressionPropertyInterface(e.py) }),
                Object.defineProperty(t, 'zPosition', { get: ExpressionPropertyInterface(e.pz) }),
                Object.defineProperty(t, 'anchorPoint', { get: ExpressionPropertyInterface(e.a) }),
                Object.defineProperty(t, 'opacity', { get: ExpressionPropertyInterface(e.o) }),
                Object.defineProperty(t, 'skew', { get: ExpressionPropertyInterface(e.sk) }),
                Object.defineProperty(t, 'skewAxis', { get: ExpressionPropertyInterface(e.sa) }),
                Object.defineProperty(t, 'orientation', { get: ExpressionPropertyInterface(e.or) }),
                t
              )
            }
          })(),
          LayerExpressionInterface = (function () {
            function e(f) {
              var u = new Matrix()
              if (f !== void 0) {
                var E = this._elem.finalTransform.mProp.getValueAtTime(f)
                E.clone(u)
              } else {
                var c = this._elem.finalTransform.mProp
                c.applyToMatrix(u)
              }
              return u
            }
            function t(f, u) {
              var E = this.getMatrix(u)
              return (E.props[12] = 0), (E.props[13] = 0), (E.props[14] = 0), this.applyPoint(E, f)
            }
            function r(f, u) {
              var E = this.getMatrix(u)
              return this.applyPoint(E, f)
            }
            function i(f, u) {
              var E = this.getMatrix(u)
              return (E.props[12] = 0), (E.props[13] = 0), (E.props[14] = 0), this.invertPoint(E, f)
            }
            function n(f, u) {
              var E = this.getMatrix(u)
              return this.invertPoint(E, f)
            }
            function s(f, u) {
              if (this._elem.hierarchy && this._elem.hierarchy.length) {
                var E,
                  c = this._elem.hierarchy.length
                for (E = 0; E < c; E += 1)
                  this._elem.hierarchy[E].finalTransform.mProp.applyToMatrix(f)
              }
              return f.applyToPointArray(u[0], u[1], u[2] || 0)
            }
            function a(f, u) {
              if (this._elem.hierarchy && this._elem.hierarchy.length) {
                var E,
                  c = this._elem.hierarchy.length
                for (E = 0; E < c; E += 1)
                  this._elem.hierarchy[E].finalTransform.mProp.applyToMatrix(f)
              }
              return f.inversePoint(u)
            }
            function l(f) {
              var u = new Matrix()
              if (
                (u.reset(),
                this._elem.finalTransform.mProp.applyToMatrix(u),
                this._elem.hierarchy && this._elem.hierarchy.length)
              ) {
                var E,
                  c = this._elem.hierarchy.length
                for (E = 0; E < c; E += 1)
                  this._elem.hierarchy[E].finalTransform.mProp.applyToMatrix(u)
                return u.inversePoint(f)
              }
              return u.inversePoint(f)
            }
            function o() {
              return [1, 1, 1, 1]
            }
            return function (f) {
              var u
              function E(y) {
                b.mask = new MaskManagerInterface(y, f)
              }
              function c(y) {
                b.effect = y
              }
              function b(y) {
                switch (y) {
                  case 'ADBE Root Vectors Group':
                  case 'Contents':
                  case 2:
                    return b.shapeInterface
                  case 1:
                  case 6:
                  case 'Transform':
                  case 'transform':
                  case 'ADBE Transform Group':
                    return u
                  case 4:
                  case 'ADBE Effect Parade':
                  case 'effects':
                  case 'Effects':
                    return b.effect
                  case 'ADBE Text Properties':
                    return b.textInterface
                  default:
                    return null
                }
              }
              ;(b.getMatrix = e),
                (b.invertPoint = a),
                (b.applyPoint = s),
                (b.toWorld = r),
                (b.toWorldVec = t),
                (b.fromWorld = n),
                (b.fromWorldVec = i),
                (b.toComp = r),
                (b.fromComp = l),
                (b.sampleImage = o),
                (b.sourceRectAtTime = f.sourceRectAtTime.bind(f)),
                (b._elem = f),
                (u = TransformExpressionInterface(f.finalTransform.mProp))
              var x = getDescriptor(u, 'anchorPoint')
              return (
                Object.defineProperties(b, {
                  hasParent: {
                    get: function () {
                      return f.hierarchy.length
                    }
                  },
                  parent: {
                    get: function () {
                      return f.hierarchy[0].layerInterface
                    }
                  },
                  rotation: getDescriptor(u, 'rotation'),
                  scale: getDescriptor(u, 'scale'),
                  position: getDescriptor(u, 'position'),
                  opacity: getDescriptor(u, 'opacity'),
                  anchorPoint: x,
                  anchor_point: x,
                  transform: {
                    get: function () {
                      return u
                    }
                  },
                  active: {
                    get: function () {
                      return f.isInRange
                    }
                  }
                }),
                (b.startTime = f.data.st),
                (b.index = f.data.ind),
                (b.source = f.data.refId),
                (b.height = f.data.ty === 0 ? f.data.h : 100),
                (b.width = f.data.ty === 0 ? f.data.w : 100),
                (b.inPoint = f.data.ip / f.comp.globalData.frameRate),
                (b.outPoint = f.data.op / f.comp.globalData.frameRate),
                (b._name = f.data.nm),
                (b.registerMaskInterface = E),
                (b.registerEffectsInterface = c),
                b
              )
            }
          })(),
          propertyGroupFactory = (function () {
            return function (e, t) {
              return function (r) {
                return (r = r === void 0 ? 1 : r), r <= 0 ? e : t(r - 1)
              }
            }
          })(),
          PropertyInterface = (function () {
            return function (e, t) {
              var r = { _name: e }
              function i(n) {
                return (n = n === void 0 ? 1 : n), n <= 0 ? r : t(n - 1)
              }
              return i
            }
          })(),
          EffectsExpressionInterface = (function () {
            var e = { createEffectsInterface: t }
            function t(n, s) {
              if (n.effectsManager) {
                var a = [],
                  l = n.data.ef,
                  o,
                  f = n.effectsManager.effectElements.length
                for (o = 0; o < f; o += 1) a.push(r(l[o], n.effectsManager.effectElements[o], s, n))
                var u = n.data.ef || [],
                  E = function (b) {
                    for (o = 0, f = u.length; o < f; ) {
                      if (b === u[o].nm || b === u[o].mn || b === u[o].ix) return a[o]
                      o += 1
                    }
                    return null
                  }
                return (
                  Object.defineProperty(E, 'numProperties', {
                    get: function () {
                      return u.length
                    }
                  }),
                  E
                )
              }
              return null
            }
            function r(n, s, a, l) {
              function o(b) {
                for (var x = n.ef, y = 0, _ = x.length; y < _; ) {
                  if (b === x[y].nm || b === x[y].mn || b === x[y].ix)
                    return x[y].ty === 5 ? u[y] : u[y]()
                  y += 1
                }
                throw new Error()
              }
              var f = propertyGroupFactory(o, a),
                u = [],
                E,
                c = n.ef.length
              for (E = 0; E < c; E += 1)
                n.ef[E].ty === 5
                  ? u.push(r(n.ef[E], s.effectElements[E], s.effectElements[E].propertyGroup, l))
                  : u.push(i(s.effectElements[E], n.ef[E].ty, l, f))
              return (
                n.mn === 'ADBE Color Control' &&
                  Object.defineProperty(o, 'color', {
                    get: function () {
                      return u[0]()
                    }
                  }),
                Object.defineProperties(o, {
                  numProperties: {
                    get: function () {
                      return n.np
                    }
                  },
                  _name: { value: n.nm },
                  propertyGroup: { value: f }
                }),
                (o.enabled = n.en !== 0),
                (o.active = o.enabled),
                o
              )
            }
            function i(n, s, a, l) {
              var o = ExpressionPropertyInterface(n.p)
              function f() {
                return s === 10 ? a.comp.compInterface(n.p.v) : o()
              }
              return n.p.setGroupProperty && n.p.setGroupProperty(PropertyInterface('', l)), f
            }
            return e
          })(),
          ShapePathInterface = (function () {
            return function (t, r, i) {
              var n = r.sh
              function s(l) {
                return l === 'Shape' ||
                  l === 'shape' ||
                  l === 'Path' ||
                  l === 'path' ||
                  l === 'ADBE Vector Shape' ||
                  l === 2
                  ? s.path
                  : null
              }
              var a = propertyGroupFactory(s, i)
              return (
                n.setGroupProperty(PropertyInterface('Path', a)),
                Object.defineProperties(s, {
                  path: {
                    get: function () {
                      return n.k && n.getValue(), n
                    }
                  },
                  shape: {
                    get: function () {
                      return n.k && n.getValue(), n
                    }
                  },
                  _name: { value: t.nm },
                  ix: { value: t.ix },
                  propertyIndex: { value: t.ix },
                  mn: { value: t.mn },
                  propertyGroup: { value: i }
                }),
                s
              )
            }
          })(),
          ShapeExpressionInterface = (function () {
            function e(x, y, _) {
              var m = [],
                A,
                d = x ? x.length : 0
              for (A = 0; A < d; A += 1)
                x[A].ty === 'gr'
                  ? m.push(r(x[A], y[A], _))
                  : x[A].ty === 'fl'
                    ? m.push(i(x[A], y[A], _))
                    : x[A].ty === 'st'
                      ? m.push(a(x[A], y[A], _))
                      : x[A].ty === 'tm'
                        ? m.push(l(x[A], y[A], _))
                        : x[A].ty === 'tr' ||
                          (x[A].ty === 'el'
                            ? m.push(f(x[A], y[A], _))
                            : x[A].ty === 'sr'
                              ? m.push(u(x[A], y[A], _))
                              : x[A].ty === 'sh'
                                ? m.push(ShapePathInterface(x[A], y[A], _))
                                : x[A].ty === 'rc'
                                  ? m.push(E(x[A], y[A], _))
                                  : x[A].ty === 'rd'
                                    ? m.push(c(x[A], y[A], _))
                                    : x[A].ty === 'rp'
                                      ? m.push(b(x[A], y[A], _))
                                      : x[A].ty === 'gf'
                                        ? m.push(n(x[A], y[A], _))
                                        : m.push(s(x[A], y[A])))
              return m
            }
            function t(x, y, _) {
              var m,
                A = function (C) {
                  for (var P = 0, k = m.length; P < k; ) {
                    if (
                      m[P]._name === C ||
                      m[P].mn === C ||
                      m[P].propertyIndex === C ||
                      m[P].ix === C ||
                      m[P].ind === C
                    )
                      return m[P]
                    P += 1
                  }
                  return typeof C == 'number' ? m[C - 1] : null
                }
              ;(A.propertyGroup = propertyGroupFactory(A, _)),
                (m = e(x.it, y.it, A.propertyGroup)),
                (A.numProperties = m.length)
              var d = o(x.it[x.it.length - 1], y.it[y.it.length - 1], A.propertyGroup)
              return (A.transform = d), (A.propertyIndex = x.cix), (A._name = x.nm), A
            }
            function r(x, y, _) {
              var m = function (C) {
                switch (C) {
                  case 'ADBE Vectors Group':
                  case 'Contents':
                  case 2:
                    return m.content
                  default:
                    return m.transform
                }
              }
              m.propertyGroup = propertyGroupFactory(m, _)
              var A = t(x, y, m.propertyGroup),
                d = o(x.it[x.it.length - 1], y.it[y.it.length - 1], m.propertyGroup)
              return (
                (m.content = A),
                (m.transform = d),
                Object.defineProperty(m, '_name', {
                  get: function () {
                    return x.nm
                  }
                }),
                (m.numProperties = x.np),
                (m.propertyIndex = x.ix),
                (m.nm = x.nm),
                (m.mn = x.mn),
                m
              )
            }
            function i(x, y, _) {
              function m(A) {
                return A === 'Color' || A === 'color'
                  ? m.color
                  : A === 'Opacity' || A === 'opacity'
                    ? m.opacity
                    : null
              }
              return (
                Object.defineProperties(m, {
                  color: { get: ExpressionPropertyInterface(y.c) },
                  opacity: { get: ExpressionPropertyInterface(y.o) },
                  _name: { value: x.nm },
                  mn: { value: x.mn }
                }),
                y.c.setGroupProperty(PropertyInterface('Color', _)),
                y.o.setGroupProperty(PropertyInterface('Opacity', _)),
                m
              )
            }
            function n(x, y, _) {
              function m(A) {
                return A === 'Start Point' || A === 'start point'
                  ? m.startPoint
                  : A === 'End Point' || A === 'end point'
                    ? m.endPoint
                    : A === 'Opacity' || A === 'opacity'
                      ? m.opacity
                      : null
              }
              return (
                Object.defineProperties(m, {
                  startPoint: { get: ExpressionPropertyInterface(y.s) },
                  endPoint: { get: ExpressionPropertyInterface(y.e) },
                  opacity: { get: ExpressionPropertyInterface(y.o) },
                  type: {
                    get: function () {
                      return 'a'
                    }
                  },
                  _name: { value: x.nm },
                  mn: { value: x.mn }
                }),
                y.s.setGroupProperty(PropertyInterface('Start Point', _)),
                y.e.setGroupProperty(PropertyInterface('End Point', _)),
                y.o.setGroupProperty(PropertyInterface('Opacity', _)),
                m
              )
            }
            function s() {
              function x() {
                return null
              }
              return x
            }
            function a(x, y, _) {
              var m = propertyGroupFactory(k, _),
                A = propertyGroupFactory(P, m)
              function d(M) {
                Object.defineProperty(P, x.d[M].nm, {
                  get: ExpressionPropertyInterface(y.d.dataProps[M].p)
                })
              }
              var g,
                C = x.d ? x.d.length : 0,
                P = {}
              for (g = 0; g < C; g += 1) d(g), y.d.dataProps[g].p.setGroupProperty(A)
              function k(M) {
                return M === 'Color' || M === 'color'
                  ? k.color
                  : M === 'Opacity' || M === 'opacity'
                    ? k.opacity
                    : M === 'Stroke Width' || M === 'stroke width'
                      ? k.strokeWidth
                      : null
              }
              return (
                Object.defineProperties(k, {
                  color: { get: ExpressionPropertyInterface(y.c) },
                  opacity: { get: ExpressionPropertyInterface(y.o) },
                  strokeWidth: { get: ExpressionPropertyInterface(y.w) },
                  dash: {
                    get: function () {
                      return P
                    }
                  },
                  _name: { value: x.nm },
                  mn: { value: x.mn }
                }),
                y.c.setGroupProperty(PropertyInterface('Color', m)),
                y.o.setGroupProperty(PropertyInterface('Opacity', m)),
                y.w.setGroupProperty(PropertyInterface('Stroke Width', m)),
                k
              )
            }
            function l(x, y, _) {
              function m(d) {
                return d === x.e.ix || d === 'End' || d === 'end'
                  ? m.end
                  : d === x.s.ix
                    ? m.start
                    : d === x.o.ix
                      ? m.offset
                      : null
              }
              var A = propertyGroupFactory(m, _)
              return (
                (m.propertyIndex = x.ix),
                y.s.setGroupProperty(PropertyInterface('Start', A)),
                y.e.setGroupProperty(PropertyInterface('End', A)),
                y.o.setGroupProperty(PropertyInterface('Offset', A)),
                (m.propertyIndex = x.ix),
                (m.propertyGroup = _),
                Object.defineProperties(m, {
                  start: { get: ExpressionPropertyInterface(y.s) },
                  end: { get: ExpressionPropertyInterface(y.e) },
                  offset: { get: ExpressionPropertyInterface(y.o) },
                  _name: { value: x.nm }
                }),
                (m.mn = x.mn),
                m
              )
            }
            function o(x, y, _) {
              function m(d) {
                return x.a.ix === d || d === 'Anchor Point'
                  ? m.anchorPoint
                  : x.o.ix === d || d === 'Opacity'
                    ? m.opacity
                    : x.p.ix === d || d === 'Position'
                      ? m.position
                      : x.r.ix === d || d === 'Rotation' || d === 'ADBE Vector Rotation'
                        ? m.rotation
                        : x.s.ix === d || d === 'Scale'
                          ? m.scale
                          : (x.sk && x.sk.ix === d) || d === 'Skew'
                            ? m.skew
                            : (x.sa && x.sa.ix === d) || d === 'Skew Axis'
                              ? m.skewAxis
                              : null
              }
              var A = propertyGroupFactory(m, _)
              return (
                y.transform.mProps.o.setGroupProperty(PropertyInterface('Opacity', A)),
                y.transform.mProps.p.setGroupProperty(PropertyInterface('Position', A)),
                y.transform.mProps.a.setGroupProperty(PropertyInterface('Anchor Point', A)),
                y.transform.mProps.s.setGroupProperty(PropertyInterface('Scale', A)),
                y.transform.mProps.r.setGroupProperty(PropertyInterface('Rotation', A)),
                y.transform.mProps.sk &&
                  (y.transform.mProps.sk.setGroupProperty(PropertyInterface('Skew', A)),
                  y.transform.mProps.sa.setGroupProperty(PropertyInterface('Skew Angle', A))),
                y.transform.op.setGroupProperty(PropertyInterface('Opacity', A)),
                Object.defineProperties(m, {
                  opacity: { get: ExpressionPropertyInterface(y.transform.mProps.o) },
                  position: { get: ExpressionPropertyInterface(y.transform.mProps.p) },
                  anchorPoint: { get: ExpressionPropertyInterface(y.transform.mProps.a) },
                  scale: { get: ExpressionPropertyInterface(y.transform.mProps.s) },
                  rotation: { get: ExpressionPropertyInterface(y.transform.mProps.r) },
                  skew: { get: ExpressionPropertyInterface(y.transform.mProps.sk) },
                  skewAxis: { get: ExpressionPropertyInterface(y.transform.mProps.sa) },
                  _name: { value: x.nm }
                }),
                (m.ty = 'tr'),
                (m.mn = x.mn),
                (m.propertyGroup = _),
                m
              )
            }
            function f(x, y, _) {
              function m(g) {
                return x.p.ix === g ? m.position : x.s.ix === g ? m.size : null
              }
              var A = propertyGroupFactory(m, _)
              m.propertyIndex = x.ix
              var d = y.sh.ty === 'tm' ? y.sh.prop : y.sh
              return (
                d.s.setGroupProperty(PropertyInterface('Size', A)),
                d.p.setGroupProperty(PropertyInterface('Position', A)),
                Object.defineProperties(m, {
                  size: { get: ExpressionPropertyInterface(d.s) },
                  position: { get: ExpressionPropertyInterface(d.p) },
                  _name: { value: x.nm }
                }),
                (m.mn = x.mn),
                m
              )
            }
            function u(x, y, _) {
              function m(g) {
                return x.p.ix === g
                  ? m.position
                  : x.r.ix === g
                    ? m.rotation
                    : x.pt.ix === g
                      ? m.points
                      : x.or.ix === g || g === 'ADBE Vector Star Outer Radius'
                        ? m.outerRadius
                        : x.os.ix === g
                          ? m.outerRoundness
                          : x.ir && (x.ir.ix === g || g === 'ADBE Vector Star Inner Radius')
                            ? m.innerRadius
                            : x.is && x.is.ix === g
                              ? m.innerRoundness
                              : null
              }
              var A = propertyGroupFactory(m, _),
                d = y.sh.ty === 'tm' ? y.sh.prop : y.sh
              return (
                (m.propertyIndex = x.ix),
                d.or.setGroupProperty(PropertyInterface('Outer Radius', A)),
                d.os.setGroupProperty(PropertyInterface('Outer Roundness', A)),
                d.pt.setGroupProperty(PropertyInterface('Points', A)),
                d.p.setGroupProperty(PropertyInterface('Position', A)),
                d.r.setGroupProperty(PropertyInterface('Rotation', A)),
                x.ir &&
                  (d.ir.setGroupProperty(PropertyInterface('Inner Radius', A)),
                  d.is.setGroupProperty(PropertyInterface('Inner Roundness', A))),
                Object.defineProperties(m, {
                  position: { get: ExpressionPropertyInterface(d.p) },
                  rotation: { get: ExpressionPropertyInterface(d.r) },
                  points: { get: ExpressionPropertyInterface(d.pt) },
                  outerRadius: { get: ExpressionPropertyInterface(d.or) },
                  outerRoundness: { get: ExpressionPropertyInterface(d.os) },
                  innerRadius: { get: ExpressionPropertyInterface(d.ir) },
                  innerRoundness: { get: ExpressionPropertyInterface(d.is) },
                  _name: { value: x.nm }
                }),
                (m.mn = x.mn),
                m
              )
            }
            function E(x, y, _) {
              function m(g) {
                return x.p.ix === g
                  ? m.position
                  : x.r.ix === g
                    ? m.roundness
                    : x.s.ix === g || g === 'Size' || g === 'ADBE Vector Rect Size'
                      ? m.size
                      : null
              }
              var A = propertyGroupFactory(m, _),
                d = y.sh.ty === 'tm' ? y.sh.prop : y.sh
              return (
                (m.propertyIndex = x.ix),
                d.p.setGroupProperty(PropertyInterface('Position', A)),
                d.s.setGroupProperty(PropertyInterface('Size', A)),
                d.r.setGroupProperty(PropertyInterface('Rotation', A)),
                Object.defineProperties(m, {
                  position: { get: ExpressionPropertyInterface(d.p) },
                  roundness: { get: ExpressionPropertyInterface(d.r) },
                  size: { get: ExpressionPropertyInterface(d.s) },
                  _name: { value: x.nm }
                }),
                (m.mn = x.mn),
                m
              )
            }
            function c(x, y, _) {
              function m(g) {
                return x.r.ix === g || g === 'Round Corners 1' ? m.radius : null
              }
              var A = propertyGroupFactory(m, _),
                d = y
              return (
                (m.propertyIndex = x.ix),
                d.rd.setGroupProperty(PropertyInterface('Radius', A)),
                Object.defineProperties(m, {
                  radius: { get: ExpressionPropertyInterface(d.rd) },
                  _name: { value: x.nm }
                }),
                (m.mn = x.mn),
                m
              )
            }
            function b(x, y, _) {
              function m(g) {
                return x.c.ix === g || g === 'Copies'
                  ? m.copies
                  : x.o.ix === g || g === 'Offset'
                    ? m.offset
                    : null
              }
              var A = propertyGroupFactory(m, _),
                d = y
              return (
                (m.propertyIndex = x.ix),
                d.c.setGroupProperty(PropertyInterface('Copies', A)),
                d.o.setGroupProperty(PropertyInterface('Offset', A)),
                Object.defineProperties(m, {
                  copies: { get: ExpressionPropertyInterface(d.c) },
                  offset: { get: ExpressionPropertyInterface(d.o) },
                  _name: { value: x.nm }
                }),
                (m.mn = x.mn),
                m
              )
            }
            return function (x, y, _) {
              var m
              function A(g) {
                if (typeof g == 'number') return (g = g === void 0 ? 1 : g), g === 0 ? _ : m[g - 1]
                for (var C = 0, P = m.length; C < P; ) {
                  if (m[C]._name === g) return m[C]
                  C += 1
                }
                return null
              }
              function d() {
                return _
              }
              return (
                (A.propertyGroup = propertyGroupFactory(A, d)),
                (m = e(x, y, A.propertyGroup)),
                (A.numProperties = m.length),
                (A._name = 'Contents'),
                A
              )
            }
          })(),
          TextExpressionInterface = (function () {
            return function (e) {
              var t
              function r(i) {
                switch (i) {
                  case 'ADBE Text Document':
                    return r.sourceText
                  default:
                    return null
                }
              }
              return (
                Object.defineProperty(r, 'sourceText', {
                  get: function () {
                    e.textProperty.getValue()
                    var n = e.textProperty.currentData.t
                    return (
                      (!t || n !== t.value) &&
                        ((t = new String(n)),
                        (t.value = n || new String(n)),
                        Object.defineProperty(t, 'style', {
                          get: function () {
                            return { fillColor: e.textProperty.currentData.fc }
                          }
                        })),
                      t
                    )
                  }
                }),
                r
              )
            }
          })()
        function _typeof(e) {
          '@babel/helpers - typeof'
          return (
            typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
              ? (_typeof = function (r) {
                  return typeof r
                })
              : (_typeof = function (r) {
                  return r &&
                    typeof Symbol == 'function' &&
                    r.constructor === Symbol &&
                    r !== Symbol.prototype
                    ? 'symbol'
                    : typeof r
                }),
            _typeof(e)
          )
        }
        var FootageInterface = (function () {
            var e = function (i) {
                var n = '',
                  s = i.getFootageData()
                function a() {
                  return (n = ''), (s = i.getFootageData()), l
                }
                function l(o) {
                  if (s[o]) return (n = o), (s = s[o]), _typeof(s) === 'object' ? l : s
                  var f = o.indexOf(n)
                  if (f !== -1) {
                    var u = parseInt(o.substr(f + n.length), 10)
                    return (s = s[u]), _typeof(s) === 'object' ? l : s
                  }
                  return ''
                }
                return a
              },
              t = function (i) {
                function n(s) {
                  return s === 'Outline' ? n.outlineInterface() : null
                }
                return (n._name = 'Outline'), (n.outlineInterface = e(i)), n
              }
            return function (r) {
              function i(n) {
                return n === 'Data' ? i.dataInterface : null
              }
              return (i._name = 'Data'), (i.dataInterface = t(r)), i
            }
          })(),
          interfaces = {
            layer: LayerExpressionInterface,
            effects: EffectsExpressionInterface,
            comp: CompExpressionInterface,
            shape: ShapeExpressionInterface,
            text: TextExpressionInterface,
            footage: FootageInterface
          }
        function getInterface(e) {
          return interfaces[e] || null
        }
        var expressionHelpers = (function () {
          function e(a, l, o) {
            l.x &&
              ((o.k = !0),
              (o.x = !0),
              (o.initiateExpression = ExpressionManager.initiateExpression),
              o.effectsSequence.push(o.initiateExpression(a, l, o).bind(o)))
          }
          function t(a) {
            return (
              (a *= this.elem.globalData.frameRate),
              (a -= this.offsetTime),
              a !== this._cachingAtTime.lastFrame &&
                ((this._cachingAtTime.lastIndex =
                  this._cachingAtTime.lastFrame < a ? this._cachingAtTime.lastIndex : 0),
                (this._cachingAtTime.value = this.interpolateValue(a, this._cachingAtTime)),
                (this._cachingAtTime.lastFrame = a)),
              this._cachingAtTime.value
            )
          }
          function r(a) {
            var l = -0.01,
              o = this.getValueAtTime(a),
              f = this.getValueAtTime(a + l),
              u = 0
            if (o.length) {
              var E
              for (E = 0; E < o.length; E += 1) u += Math.pow(f[E] - o[E], 2)
              u = Math.sqrt(u) * 100
            } else u = 0
            return u
          }
          function i(a) {
            if (this.vel !== void 0) return this.vel
            var l = -0.001,
              o = this.getValueAtTime(a),
              f = this.getValueAtTime(a + l),
              u
            if (o.length) {
              u = createTypedArray('float32', o.length)
              var E
              for (E = 0; E < o.length; E += 1) u[E] = (f[E] - o[E]) / l
            } else u = (f - o) / l
            return u
          }
          function n() {
            return this.pv
          }
          function s(a) {
            this.propertyGroup = a
          }
          return {
            searchExpressions: e,
            getSpeedAtTime: r,
            getVelocityAtTime: i,
            getValueAtTime: t,
            getStaticValueAtTime: n,
            setGroupProperty: s
          }
        })()
        function addPropertyDecorator() {
          function e(c, b, x) {
            if (!this.k || !this.keyframes) return this.pv
            c = c ? c.toLowerCase() : ''
            var y = this.comp.renderedFrame,
              _ = this.keyframes,
              m = _[_.length - 1].t
            if (y <= m) return this.pv
            var A, d
            x
              ? (b
                  ? (A = Math.abs(m - this.elem.comp.globalData.frameRate * b))
                  : (A = Math.max(0, m - this.elem.data.ip)),
                (d = m - A))
              : ((!b || b > _.length - 1) && (b = _.length - 1),
                (d = _[_.length - 1 - b].t),
                (A = m - d))
            var g, C, P
            if (c === 'pingpong') {
              var k = Math.floor((y - d) / A)
              if (k % 2 !== 0)
                return this.getValueAtTime(
                  (A - ((y - d) % A) + d) / this.comp.globalData.frameRate,
                  0
                )
            } else if (c === 'offset') {
              var M = this.getValueAtTime(d / this.comp.globalData.frameRate, 0),
                D = this.getValueAtTime(m / this.comp.globalData.frameRate, 0),
                W = this.getValueAtTime((((y - d) % A) + d) / this.comp.globalData.frameRate, 0),
                H = Math.floor((y - d) / A)
              if (this.pv.length) {
                for (P = new Array(M.length), C = P.length, g = 0; g < C; g += 1)
                  P[g] = (D[g] - M[g]) * H + W[g]
                return P
              }
              return (D - M) * H + W
            } else if (c === 'continue') {
              var $ = this.getValueAtTime(m / this.comp.globalData.frameRate, 0),
                Z = this.getValueAtTime((m - 0.001) / this.comp.globalData.frameRate, 0)
              if (this.pv.length) {
                for (P = new Array($.length), C = P.length, g = 0; g < C; g += 1)
                  P[g] = $[g] + (($[g] - Z[g]) * ((y - m) / this.comp.globalData.frameRate)) / 5e-4
                return P
              }
              return $ + ($ - Z) * ((y - m) / 0.001)
            }
            return this.getValueAtTime((((y - d) % A) + d) / this.comp.globalData.frameRate, 0)
          }
          function t(c, b, x) {
            if (!this.k) return this.pv
            c = c ? c.toLowerCase() : ''
            var y = this.comp.renderedFrame,
              _ = this.keyframes,
              m = _[0].t
            if (y >= m) return this.pv
            var A, d
            x
              ? (b
                  ? (A = Math.abs(this.elem.comp.globalData.frameRate * b))
                  : (A = Math.max(0, this.elem.data.op - m)),
                (d = m + A))
              : ((!b || b > _.length - 1) && (b = _.length - 1), (d = _[b].t), (A = d - m))
            var g, C, P
            if (c === 'pingpong') {
              var k = Math.floor((m - y) / A)
              if (k % 2 === 0)
                return this.getValueAtTime((((m - y) % A) + m) / this.comp.globalData.frameRate, 0)
            } else if (c === 'offset') {
              var M = this.getValueAtTime(m / this.comp.globalData.frameRate, 0),
                D = this.getValueAtTime(d / this.comp.globalData.frameRate, 0),
                W = this.getValueAtTime(
                  (A - ((m - y) % A) + m) / this.comp.globalData.frameRate,
                  0
                ),
                H = Math.floor((m - y) / A) + 1
              if (this.pv.length) {
                for (P = new Array(M.length), C = P.length, g = 0; g < C; g += 1)
                  P[g] = W[g] - (D[g] - M[g]) * H
                return P
              }
              return W - (D - M) * H
            } else if (c === 'continue') {
              var $ = this.getValueAtTime(m / this.comp.globalData.frameRate, 0),
                Z = this.getValueAtTime((m + 0.001) / this.comp.globalData.frameRate, 0)
              if (this.pv.length) {
                for (P = new Array($.length), C = P.length, g = 0; g < C; g += 1)
                  P[g] = $[g] + (($[g] - Z[g]) * (m - y)) / 0.001
                return P
              }
              return $ + (($ - Z) * (m - y)) / 0.001
            }
            return this.getValueAtTime(
              (A - (((m - y) % A) + m)) / this.comp.globalData.frameRate,
              0
            )
          }
          function r(c, b) {
            if (!this.k) return this.pv
            if (((c = (c || 0.4) * 0.5), (b = Math.floor(b || 5)), b <= 1)) return this.pv
            var x = this.comp.renderedFrame / this.comp.globalData.frameRate,
              y = x - c,
              _ = x + c,
              m = b > 1 ? (_ - y) / (b - 1) : 1,
              A = 0,
              d = 0,
              g
            this.pv.length ? (g = createTypedArray('float32', this.pv.length)) : (g = 0)
            for (var C; A < b; ) {
              if (((C = this.getValueAtTime(y + A * m)), this.pv.length))
                for (d = 0; d < this.pv.length; d += 1) g[d] += C[d]
              else g += C
              A += 1
            }
            if (this.pv.length) for (d = 0; d < this.pv.length; d += 1) g[d] /= b
            else g /= b
            return g
          }
          function i(c) {
            this._transformCachingAtTime || (this._transformCachingAtTime = { v: new Matrix() })
            var b = this._transformCachingAtTime.v
            if ((b.cloneFromProps(this.pre.props), this.appliedTransformations < 1)) {
              var x = this.a.getValueAtTime(c)
              b.translate(-x[0] * this.a.mult, -x[1] * this.a.mult, x[2] * this.a.mult)
            }
            if (this.appliedTransformations < 2) {
              var y = this.s.getValueAtTime(c)
              b.scale(y[0] * this.s.mult, y[1] * this.s.mult, y[2] * this.s.mult)
            }
            if (this.sk && this.appliedTransformations < 3) {
              var _ = this.sk.getValueAtTime(c),
                m = this.sa.getValueAtTime(c)
              b.skewFromAxis(-_ * this.sk.mult, m * this.sa.mult)
            }
            if (this.r && this.appliedTransformations < 4) {
              var A = this.r.getValueAtTime(c)
              b.rotate(-A * this.r.mult)
            } else if (!this.r && this.appliedTransformations < 4) {
              var d = this.rz.getValueAtTime(c),
                g = this.ry.getValueAtTime(c),
                C = this.rx.getValueAtTime(c),
                P = this.or.getValueAtTime(c)
              b.rotateZ(-d * this.rz.mult)
                .rotateY(g * this.ry.mult)
                .rotateX(C * this.rx.mult)
                .rotateZ(-P[2] * this.or.mult)
                .rotateY(P[1] * this.or.mult)
                .rotateX(P[0] * this.or.mult)
            }
            if (this.data.p && this.data.p.s) {
              var k = this.px.getValueAtTime(c),
                M = this.py.getValueAtTime(c)
              if (this.data.p.z) {
                var D = this.pz.getValueAtTime(c)
                b.translate(k * this.px.mult, M * this.py.mult, -D * this.pz.mult)
              } else b.translate(k * this.px.mult, M * this.py.mult, 0)
            } else {
              var W = this.p.getValueAtTime(c)
              b.translate(W[0] * this.p.mult, W[1] * this.p.mult, -W[2] * this.p.mult)
            }
            return b
          }
          function n() {
            return this.v.clone(new Matrix())
          }
          var s = TransformPropertyFactory.getTransformProperty
          TransformPropertyFactory.getTransformProperty = function (c, b, x) {
            var y = s(c, b, x)
            return (
              y.dynamicProperties.length
                ? (y.getValueAtTime = i.bind(y))
                : (y.getValueAtTime = n.bind(y)),
              (y.setGroupProperty = expressionHelpers.setGroupProperty),
              y
            )
          }
          var a = PropertyFactory.getProp
          PropertyFactory.getProp = function (c, b, x, y, _) {
            var m = a(c, b, x, y, _)
            m.kf
              ? (m.getValueAtTime = expressionHelpers.getValueAtTime.bind(m))
              : (m.getValueAtTime = expressionHelpers.getStaticValueAtTime.bind(m)),
              (m.setGroupProperty = expressionHelpers.setGroupProperty),
              (m.loopOut = e),
              (m.loopIn = t),
              (m.smooth = r),
              (m.getVelocityAtTime = expressionHelpers.getVelocityAtTime.bind(m)),
              (m.getSpeedAtTime = expressionHelpers.getSpeedAtTime.bind(m)),
              (m.numKeys = b.a === 1 ? b.k.length : 0),
              (m.propertyIndex = b.ix)
            var A = 0
            return (
              x !== 0 &&
                (A = createTypedArray('float32', b.a === 1 ? b.k[0].s.length : b.k.length)),
              (m._cachingAtTime = { lastFrame: initialDefaultFrame, lastIndex: 0, value: A }),
              expressionHelpers.searchExpressions(c, b, m),
              m.k && _.addDynamicProperty(m),
              m
            )
          }
          function l(c) {
            return (
              this._cachingAtTime ||
                (this._cachingAtTime = {
                  shapeValue: shapePool.clone(this.pv),
                  lastIndex: 0,
                  lastTime: initialDefaultFrame
                }),
              (c *= this.elem.globalData.frameRate),
              (c -= this.offsetTime),
              c !== this._cachingAtTime.lastTime &&
                ((this._cachingAtTime.lastIndex =
                  this._cachingAtTime.lastTime < c ? this._caching.lastIndex : 0),
                (this._cachingAtTime.lastTime = c),
                this.interpolateShape(c, this._cachingAtTime.shapeValue, this._cachingAtTime)),
              this._cachingAtTime.shapeValue
            )
          }
          var o = ShapePropertyFactory.getConstructorFunction(),
            f = ShapePropertyFactory.getKeyframedConstructorFunction()
          function u() {}
          ;(u.prototype = {
            vertices: function (b, x) {
              this.k && this.getValue()
              var y = this.v
              x !== void 0 && (y = this.getValueAtTime(x, 0))
              var _,
                m = y._length,
                A = y[b],
                d = y.v,
                g = createSizedArray(m)
              for (_ = 0; _ < m; _ += 1)
                b === 'i' || b === 'o'
                  ? (g[_] = [A[_][0] - d[_][0], A[_][1] - d[_][1]])
                  : (g[_] = [A[_][0], A[_][1]])
              return g
            },
            points: function (b) {
              return this.vertices('v', b)
            },
            inTangents: function (b) {
              return this.vertices('i', b)
            },
            outTangents: function (b) {
              return this.vertices('o', b)
            },
            isClosed: function () {
              return this.v.c
            },
            pointOnPath: function (b, x) {
              var y = this.v
              x !== void 0 && (y = this.getValueAtTime(x, 0)),
                this._segmentsLength || (this._segmentsLength = bez.getSegmentsLength(y))
              for (
                var _ = this._segmentsLength,
                  m = _.lengths,
                  A = _.totalLength * b,
                  d = 0,
                  g = m.length,
                  C = 0,
                  P;
                d < g;

              ) {
                if (C + m[d].addedLength > A) {
                  var k = d,
                    M = y.c && d === g - 1 ? 0 : d + 1,
                    D = (A - C) / m[d].addedLength
                  P = bez.getPointInSegment(y.v[k], y.v[M], y.o[k], y.i[M], D, m[d])
                  break
                } else C += m[d].addedLength
                d += 1
              }
              return (
                P ||
                  (P = y.c
                    ? [y.v[0][0], y.v[0][1]]
                    : [y.v[y._length - 1][0], y.v[y._length - 1][1]]),
                P
              )
            },
            vectorOnPath: function (b, x, y) {
              b == 1 ? (b = this.v.c) : b == 0 && (b = 0.999)
              var _ = this.pointOnPath(b, x),
                m = this.pointOnPath(b + 0.001, x),
                A = m[0] - _[0],
                d = m[1] - _[1],
                g = Math.sqrt(Math.pow(A, 2) + Math.pow(d, 2))
              if (g === 0) return [0, 0]
              var C = y === 'tangent' ? [A / g, d / g] : [-d / g, A / g]
              return C
            },
            tangentOnPath: function (b, x) {
              return this.vectorOnPath(b, x, 'tangent')
            },
            normalOnPath: function (b, x) {
              return this.vectorOnPath(b, x, 'normal')
            },
            setGroupProperty: expressionHelpers.setGroupProperty,
            getValueAtTime: expressionHelpers.getStaticValueAtTime
          }),
            extendPrototype([u], o),
            extendPrototype([u], f),
            (f.prototype.getValueAtTime = l),
            (f.prototype.initiateExpression = ExpressionManager.initiateExpression)
          var E = ShapePropertyFactory.getShapeProp
          ShapePropertyFactory.getShapeProp = function (c, b, x, y, _) {
            var m = E(c, b, x, y, _)
            return (
              (m.propertyIndex = b.ix),
              (m.lock = !1),
              x === 3
                ? expressionHelpers.searchExpressions(c, b.pt, m)
                : x === 4 && expressionHelpers.searchExpressions(c, b.ks, m),
              m.k && c.addDynamicProperty(m),
              m
            )
          }
        }
        function initialize$1() {
          addPropertyDecorator()
        }
        function addDecorator() {
          function e() {
            return this.data.d.x
              ? ((this.calculateExpression = ExpressionManager.initiateExpression.bind(this)(
                  this.elem,
                  this.data.d,
                  this
                )),
                this.addEffect(this.getExpressionValue.bind(this)),
                !0)
              : null
          }
          ;(TextProperty.prototype.getExpressionValue = function (t, r) {
            var i = this.calculateExpression(r)
            if (t.t !== i) {
              var n = {}
              return this.copyData(n, t), (n.t = i.toString()), (n.__complete = !1), n
            }
            return t
          }),
            (TextProperty.prototype.searchProperty = function () {
              var t = this.searchKeyframes(),
                r = this.searchExpressions()
              return (this.kf = t || r), this.kf
            }),
            (TextProperty.prototype.searchExpressions = e)
        }
        function initialize() {
          addDecorator()
        }
        function SVGComposableEffect() {}
        SVGComposableEffect.prototype = {
          createMergeNode: function e(t, r) {
            var i = createNS('feMerge')
            i.setAttribute('result', t)
            var n, s
            for (s = 0; s < r.length; s += 1)
              (n = createNS('feMergeNode')),
                n.setAttribute('in', r[s]),
                i.appendChild(n),
                i.appendChild(n)
            return i
          }
        }
        var linearFilterValue =
          '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0'
        function SVGTintFilter(e, t, r, i, n) {
          this.filterManager = t
          var s = createNS('feColorMatrix')
          s.setAttribute('type', 'matrix'),
            s.setAttribute('color-interpolation-filters', 'linearRGB'),
            s.setAttribute('values', linearFilterValue + ' 1 0'),
            (this.linearFilter = s),
            s.setAttribute('result', i + '_tint_1'),
            e.appendChild(s),
            (s = createNS('feColorMatrix')),
            s.setAttribute('type', 'matrix'),
            s.setAttribute('color-interpolation-filters', 'sRGB'),
            s.setAttribute('values', '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'),
            s.setAttribute('result', i + '_tint_2'),
            e.appendChild(s),
            (this.matrixFilter = s)
          var a = this.createMergeNode(i, [n, i + '_tint_1', i + '_tint_2'])
          e.appendChild(a)
        }
        extendPrototype([SVGComposableEffect], SVGTintFilter),
          (SVGTintFilter.prototype.renderFrame = function (e) {
            if (e || this.filterManager._mdf) {
              var t = this.filterManager.effectElements[0].p.v,
                r = this.filterManager.effectElements[1].p.v,
                i = this.filterManager.effectElements[2].p.v / 100
              this.linearFilter.setAttribute('values', linearFilterValue + ' ' + i + ' 0'),
                this.matrixFilter.setAttribute(
                  'values',
                  r[0] -
                    t[0] +
                    ' 0 0 0 ' +
                    t[0] +
                    ' ' +
                    (r[1] - t[1]) +
                    ' 0 0 0 ' +
                    t[1] +
                    ' ' +
                    (r[2] - t[2]) +
                    ' 0 0 0 ' +
                    t[2] +
                    ' 0 0 0 1 0'
                )
            }
          })
        function SVGFillFilter(e, t, r, i) {
          this.filterManager = t
          var n = createNS('feColorMatrix')
          n.setAttribute('type', 'matrix'),
            n.setAttribute('color-interpolation-filters', 'sRGB'),
            n.setAttribute('values', '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'),
            n.setAttribute('result', i),
            e.appendChild(n),
            (this.matrixFilter = n)
        }
        SVGFillFilter.prototype.renderFrame = function (e) {
          if (e || this.filterManager._mdf) {
            var t = this.filterManager.effectElements[2].p.v,
              r = this.filterManager.effectElements[6].p.v
            this.matrixFilter.setAttribute(
              'values',
              '0 0 0 0 ' + t[0] + ' 0 0 0 0 ' + t[1] + ' 0 0 0 0 ' + t[2] + ' 0 0 0 ' + r + ' 0'
            )
          }
        }
        function SVGStrokeEffect(e, t, r) {
          ;(this.initialized = !1), (this.filterManager = t), (this.elem = r), (this.paths = [])
        }
        ;(SVGStrokeEffect.prototype.initialize = function () {
          var e = this.elem.layerElement.children || this.elem.layerElement.childNodes,
            t,
            r,
            i,
            n
          for (
            this.filterManager.effectElements[1].p.v === 1
              ? ((n = this.elem.maskManager.masksProperties.length), (i = 0))
              : ((i = this.filterManager.effectElements[0].p.v - 1), (n = i + 1)),
              r = createNS('g'),
              r.setAttribute('fill', 'none'),
              r.setAttribute('stroke-linecap', 'round'),
              r.setAttribute('stroke-dashoffset', 1),
              i;
            i < n;
            i += 1
          )
            (t = createNS('path')), r.appendChild(t), this.paths.push({ p: t, m: i })
          if (this.filterManager.effectElements[10].p.v === 3) {
            var s = createNS('mask'),
              a = createElementID()
            s.setAttribute('id', a),
              s.setAttribute('mask-type', 'alpha'),
              s.appendChild(r),
              this.elem.globalData.defs.appendChild(s)
            var l = createNS('g')
            for (l.setAttribute('mask', 'url(' + getLocationHref() + '#' + a + ')'); e[0]; )
              l.appendChild(e[0])
            this.elem.layerElement.appendChild(l),
              (this.masker = s),
              r.setAttribute('stroke', '#fff')
          } else if (
            this.filterManager.effectElements[10].p.v === 1 ||
            this.filterManager.effectElements[10].p.v === 2
          ) {
            if (this.filterManager.effectElements[10].p.v === 2)
              for (
                e = this.elem.layerElement.children || this.elem.layerElement.childNodes;
                e.length;

              )
                this.elem.layerElement.removeChild(e[0])
            this.elem.layerElement.appendChild(r),
              this.elem.layerElement.removeAttribute('mask'),
              r.setAttribute('stroke', '#fff')
          }
          ;(this.initialized = !0), (this.pathMasker = r)
        }),
          (SVGStrokeEffect.prototype.renderFrame = function (e) {
            this.initialized || this.initialize()
            var t,
              r = this.paths.length,
              i,
              n
            for (t = 0; t < r; t += 1)
              if (
                this.paths[t].m !== -1 &&
                ((i = this.elem.maskManager.viewData[this.paths[t].m]),
                (n = this.paths[t].p),
                (e || this.filterManager._mdf || i.prop._mdf) && n.setAttribute('d', i.lastPath),
                e ||
                  this.filterManager.effectElements[9].p._mdf ||
                  this.filterManager.effectElements[4].p._mdf ||
                  this.filterManager.effectElements[7].p._mdf ||
                  this.filterManager.effectElements[8].p._mdf ||
                  i.prop._mdf)
              ) {
                var s
                if (
                  this.filterManager.effectElements[7].p.v !== 0 ||
                  this.filterManager.effectElements[8].p.v !== 100
                ) {
                  var a =
                      Math.min(
                        this.filterManager.effectElements[7].p.v,
                        this.filterManager.effectElements[8].p.v
                      ) * 0.01,
                    l =
                      Math.max(
                        this.filterManager.effectElements[7].p.v,
                        this.filterManager.effectElements[8].p.v
                      ) * 0.01,
                    o = n.getTotalLength()
                  s = '0 0 0 ' + o * a + ' '
                  var f = o * (l - a),
                    u =
                      1 +
                      this.filterManager.effectElements[4].p.v *
                        2 *
                        this.filterManager.effectElements[9].p.v *
                        0.01,
                    E = Math.floor(f / u),
                    c
                  for (c = 0; c < E; c += 1)
                    s +=
                      '1 ' +
                      this.filterManager.effectElements[4].p.v *
                        2 *
                        this.filterManager.effectElements[9].p.v *
                        0.01 +
                      ' '
                  s += '0 ' + o * 10 + ' 0 0'
                } else
                  s =
                    '1 ' +
                    this.filterManager.effectElements[4].p.v *
                      2 *
                      this.filterManager.effectElements[9].p.v *
                      0.01
                n.setAttribute('stroke-dasharray', s)
              }
            if (
              ((e || this.filterManager.effectElements[4].p._mdf) &&
                this.pathMasker.setAttribute(
                  'stroke-width',
                  this.filterManager.effectElements[4].p.v * 2
                ),
              (e || this.filterManager.effectElements[6].p._mdf) &&
                this.pathMasker.setAttribute('opacity', this.filterManager.effectElements[6].p.v),
              (this.filterManager.effectElements[10].p.v === 1 ||
                this.filterManager.effectElements[10].p.v === 2) &&
                (e || this.filterManager.effectElements[3].p._mdf))
            ) {
              var b = this.filterManager.effectElements[3].p.v
              this.pathMasker.setAttribute(
                'stroke',
                'rgb(' +
                  bmFloor(b[0] * 255) +
                  ',' +
                  bmFloor(b[1] * 255) +
                  ',' +
                  bmFloor(b[2] * 255) +
                  ')'
              )
            }
          })
        function SVGTritoneFilter(e, t, r, i) {
          this.filterManager = t
          var n = createNS('feColorMatrix')
          n.setAttribute('type', 'matrix'),
            n.setAttribute('color-interpolation-filters', 'linearRGB'),
            n.setAttribute(
              'values',
              '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'
            ),
            e.appendChild(n)
          var s = createNS('feComponentTransfer')
          s.setAttribute('color-interpolation-filters', 'sRGB'),
            s.setAttribute('result', i),
            (this.matrixFilter = s)
          var a = createNS('feFuncR')
          a.setAttribute('type', 'table'), s.appendChild(a), (this.feFuncR = a)
          var l = createNS('feFuncG')
          l.setAttribute('type', 'table'), s.appendChild(l), (this.feFuncG = l)
          var o = createNS('feFuncB')
          o.setAttribute('type', 'table'), s.appendChild(o), (this.feFuncB = o), e.appendChild(s)
        }
        SVGTritoneFilter.prototype.renderFrame = function (e) {
          if (e || this.filterManager._mdf) {
            var t = this.filterManager.effectElements[0].p.v,
              r = this.filterManager.effectElements[1].p.v,
              i = this.filterManager.effectElements[2].p.v,
              n = i[0] + ' ' + r[0] + ' ' + t[0],
              s = i[1] + ' ' + r[1] + ' ' + t[1],
              a = i[2] + ' ' + r[2] + ' ' + t[2]
            this.feFuncR.setAttribute('tableValues', n),
              this.feFuncG.setAttribute('tableValues', s),
              this.feFuncB.setAttribute('tableValues', a)
          }
        }
        function SVGProLevelsFilter(e, t, r, i) {
          this.filterManager = t
          var n = this.filterManager.effectElements,
            s = createNS('feComponentTransfer')
          ;(n[10].p.k ||
            n[10].p.v !== 0 ||
            n[11].p.k ||
            n[11].p.v !== 1 ||
            n[12].p.k ||
            n[12].p.v !== 1 ||
            n[13].p.k ||
            n[13].p.v !== 0 ||
            n[14].p.k ||
            n[14].p.v !== 1) &&
            (this.feFuncR = this.createFeFunc('feFuncR', s)),
            (n[17].p.k ||
              n[17].p.v !== 0 ||
              n[18].p.k ||
              n[18].p.v !== 1 ||
              n[19].p.k ||
              n[19].p.v !== 1 ||
              n[20].p.k ||
              n[20].p.v !== 0 ||
              n[21].p.k ||
              n[21].p.v !== 1) &&
              (this.feFuncG = this.createFeFunc('feFuncG', s)),
            (n[24].p.k ||
              n[24].p.v !== 0 ||
              n[25].p.k ||
              n[25].p.v !== 1 ||
              n[26].p.k ||
              n[26].p.v !== 1 ||
              n[27].p.k ||
              n[27].p.v !== 0 ||
              n[28].p.k ||
              n[28].p.v !== 1) &&
              (this.feFuncB = this.createFeFunc('feFuncB', s)),
            (n[31].p.k ||
              n[31].p.v !== 0 ||
              n[32].p.k ||
              n[32].p.v !== 1 ||
              n[33].p.k ||
              n[33].p.v !== 1 ||
              n[34].p.k ||
              n[34].p.v !== 0 ||
              n[35].p.k ||
              n[35].p.v !== 1) &&
              (this.feFuncA = this.createFeFunc('feFuncA', s)),
            (this.feFuncR || this.feFuncG || this.feFuncB || this.feFuncA) &&
              (s.setAttribute('color-interpolation-filters', 'sRGB'), e.appendChild(s)),
            (n[3].p.k ||
              n[3].p.v !== 0 ||
              n[4].p.k ||
              n[4].p.v !== 1 ||
              n[5].p.k ||
              n[5].p.v !== 1 ||
              n[6].p.k ||
              n[6].p.v !== 0 ||
              n[7].p.k ||
              n[7].p.v !== 1) &&
              ((s = createNS('feComponentTransfer')),
              s.setAttribute('color-interpolation-filters', 'sRGB'),
              s.setAttribute('result', i),
              e.appendChild(s),
              (this.feFuncRComposed = this.createFeFunc('feFuncR', s)),
              (this.feFuncGComposed = this.createFeFunc('feFuncG', s)),
              (this.feFuncBComposed = this.createFeFunc('feFuncB', s)))
        }
        ;(SVGProLevelsFilter.prototype.createFeFunc = function (e, t) {
          var r = createNS(e)
          return r.setAttribute('type', 'table'), t.appendChild(r), r
        }),
          (SVGProLevelsFilter.prototype.getTableValue = function (e, t, r, i, n) {
            for (
              var s = 0,
                a = 256,
                l,
                o = Math.min(e, t),
                f = Math.max(e, t),
                u = Array.call(null, { length: a }),
                E,
                c = 0,
                b = n - i,
                x = t - e;
              s <= 256;

            )
              (l = s / 256),
                l <= o
                  ? (E = x < 0 ? n : i)
                  : l >= f
                    ? (E = x < 0 ? i : n)
                    : (E = i + b * Math.pow((l - e) / x, 1 / r)),
                (u[c] = E),
                (c += 1),
                (s += 256 / (a - 1))
            return u.join(' ')
          }),
          (SVGProLevelsFilter.prototype.renderFrame = function (e) {
            if (e || this.filterManager._mdf) {
              var t,
                r = this.filterManager.effectElements
              this.feFuncRComposed &&
                (e || r[3].p._mdf || r[4].p._mdf || r[5].p._mdf || r[6].p._mdf || r[7].p._mdf) &&
                ((t = this.getTableValue(r[3].p.v, r[4].p.v, r[5].p.v, r[6].p.v, r[7].p.v)),
                this.feFuncRComposed.setAttribute('tableValues', t),
                this.feFuncGComposed.setAttribute('tableValues', t),
                this.feFuncBComposed.setAttribute('tableValues', t)),
                this.feFuncR &&
                  (e ||
                    r[10].p._mdf ||
                    r[11].p._mdf ||
                    r[12].p._mdf ||
                    r[13].p._mdf ||
                    r[14].p._mdf) &&
                  ((t = this.getTableValue(r[10].p.v, r[11].p.v, r[12].p.v, r[13].p.v, r[14].p.v)),
                  this.feFuncR.setAttribute('tableValues', t)),
                this.feFuncG &&
                  (e ||
                    r[17].p._mdf ||
                    r[18].p._mdf ||
                    r[19].p._mdf ||
                    r[20].p._mdf ||
                    r[21].p._mdf) &&
                  ((t = this.getTableValue(r[17].p.v, r[18].p.v, r[19].p.v, r[20].p.v, r[21].p.v)),
                  this.feFuncG.setAttribute('tableValues', t)),
                this.feFuncB &&
                  (e ||
                    r[24].p._mdf ||
                    r[25].p._mdf ||
                    r[26].p._mdf ||
                    r[27].p._mdf ||
                    r[28].p._mdf) &&
                  ((t = this.getTableValue(r[24].p.v, r[25].p.v, r[26].p.v, r[27].p.v, r[28].p.v)),
                  this.feFuncB.setAttribute('tableValues', t)),
                this.feFuncA &&
                  (e ||
                    r[31].p._mdf ||
                    r[32].p._mdf ||
                    r[33].p._mdf ||
                    r[34].p._mdf ||
                    r[35].p._mdf) &&
                  ((t = this.getTableValue(r[31].p.v, r[32].p.v, r[33].p.v, r[34].p.v, r[35].p.v)),
                  this.feFuncA.setAttribute('tableValues', t))
            }
          })
        function SVGDropShadowEffect(e, t, r, i, n) {
          var s = t.container.globalData.renderConfig.filterSize,
            a = t.data.fs || s
          e.setAttribute('x', a.x || s.x),
            e.setAttribute('y', a.y || s.y),
            e.setAttribute('width', a.width || s.width),
            e.setAttribute('height', a.height || s.height),
            (this.filterManager = t)
          var l = createNS('feGaussianBlur')
          l.setAttribute('in', 'SourceAlpha'),
            l.setAttribute('result', i + '_drop_shadow_1'),
            l.setAttribute('stdDeviation', '0'),
            (this.feGaussianBlur = l),
            e.appendChild(l)
          var o = createNS('feOffset')
          o.setAttribute('dx', '25'),
            o.setAttribute('dy', '0'),
            o.setAttribute('in', i + '_drop_shadow_1'),
            o.setAttribute('result', i + '_drop_shadow_2'),
            (this.feOffset = o),
            e.appendChild(o)
          var f = createNS('feFlood')
          f.setAttribute('flood-color', '#00ff00'),
            f.setAttribute('flood-opacity', '1'),
            f.setAttribute('result', i + '_drop_shadow_3'),
            (this.feFlood = f),
            e.appendChild(f)
          var u = createNS('feComposite')
          u.setAttribute('in', i + '_drop_shadow_3'),
            u.setAttribute('in2', i + '_drop_shadow_2'),
            u.setAttribute('operator', 'in'),
            u.setAttribute('result', i + '_drop_shadow_4'),
            e.appendChild(u)
          var E = this.createMergeNode(i, [i + '_drop_shadow_4', n])
          e.appendChild(E)
        }
        extendPrototype([SVGComposableEffect], SVGDropShadowEffect),
          (SVGDropShadowEffect.prototype.renderFrame = function (e) {
            if (e || this.filterManager._mdf) {
              if (
                ((e || this.filterManager.effectElements[4].p._mdf) &&
                  this.feGaussianBlur.setAttribute(
                    'stdDeviation',
                    this.filterManager.effectElements[4].p.v / 4
                  ),
                e || this.filterManager.effectElements[0].p._mdf)
              ) {
                var t = this.filterManager.effectElements[0].p.v
                this.feFlood.setAttribute(
                  'flood-color',
                  rgbToHex(Math.round(t[0] * 255), Math.round(t[1] * 255), Math.round(t[2] * 255))
                )
              }
              if (
                ((e || this.filterManager.effectElements[1].p._mdf) &&
                  this.feFlood.setAttribute(
                    'flood-opacity',
                    this.filterManager.effectElements[1].p.v / 255
                  ),
                e ||
                  this.filterManager.effectElements[2].p._mdf ||
                  this.filterManager.effectElements[3].p._mdf)
              ) {
                var r = this.filterManager.effectElements[3].p.v,
                  i = (this.filterManager.effectElements[2].p.v - 90) * degToRads,
                  n = r * Math.cos(i),
                  s = r * Math.sin(i)
                this.feOffset.setAttribute('dx', n), this.feOffset.setAttribute('dy', s)
              }
            }
          })
        var _svgMatteSymbols = []
        function SVGMatte3Effect(e, t, r) {
          ;(this.initialized = !1),
            (this.filterManager = t),
            (this.filterElem = e),
            (this.elem = r),
            (r.matteElement = createNS('g')),
            r.matteElement.appendChild(r.layerElement),
            r.matteElement.appendChild(r.transformedElement),
            (r.baseElement = r.matteElement)
        }
        ;(SVGMatte3Effect.prototype.findSymbol = function (e) {
          for (var t = 0, r = _svgMatteSymbols.length; t < r; ) {
            if (_svgMatteSymbols[t] === e) return _svgMatteSymbols[t]
            t += 1
          }
          return null
        }),
          (SVGMatte3Effect.prototype.replaceInParent = function (e, t) {
            var r = e.layerElement.parentNode
            if (r) {
              for (var i = r.children, n = 0, s = i.length; n < s && i[n] !== e.layerElement; )
                n += 1
              var a
              n <= s - 2 && (a = i[n + 1])
              var l = createNS('use')
              l.setAttribute('href', '#' + t), a ? r.insertBefore(l, a) : r.appendChild(l)
            }
          }),
          (SVGMatte3Effect.prototype.setElementAsMask = function (e, t) {
            if (!this.findSymbol(t)) {
              var r = createElementID(),
                i = createNS('mask')
              i.setAttribute('id', t.layerId),
                i.setAttribute('mask-type', 'alpha'),
                _svgMatteSymbols.push(t)
              var n = e.globalData.defs
              n.appendChild(i)
              var s = createNS('symbol')
              s.setAttribute('id', r),
                this.replaceInParent(t, r),
                s.appendChild(t.layerElement),
                n.appendChild(s)
              var a = createNS('use')
              a.setAttribute('href', '#' + r), i.appendChild(a), (t.data.hd = !1), t.show()
            }
            e.setMatte(t.layerId)
          }),
          (SVGMatte3Effect.prototype.initialize = function () {
            for (
              var e = this.filterManager.effectElements[0].p.v,
                t = this.elem.comp.elements,
                r = 0,
                i = t.length;
              r < i;

            )
              t[r] && t[r].data.ind === e && this.setElementAsMask(this.elem, t[r]), (r += 1)
            this.initialized = !0
          }),
          (SVGMatte3Effect.prototype.renderFrame = function () {
            this.initialized || this.initialize()
          })
        function SVGGaussianBlurEffect(e, t, r, i) {
          e.setAttribute('x', '-100%'),
            e.setAttribute('y', '-100%'),
            e.setAttribute('width', '300%'),
            e.setAttribute('height', '300%'),
            (this.filterManager = t)
          var n = createNS('feGaussianBlur')
          n.setAttribute('result', i), e.appendChild(n), (this.feGaussianBlur = n)
        }
        SVGGaussianBlurEffect.prototype.renderFrame = function (e) {
          if (e || this.filterManager._mdf) {
            var t = 0.3,
              r = this.filterManager.effectElements[0].p.v * t,
              i = this.filterManager.effectElements[1].p.v,
              n = i == 3 ? 0 : r,
              s = i == 2 ? 0 : r
            this.feGaussianBlur.setAttribute('stdDeviation', n + ' ' + s)
            var a = this.filterManager.effectElements[2].p.v == 1 ? 'wrap' : 'duplicate'
            this.feGaussianBlur.setAttribute('edgeMode', a)
          }
        }
        function TransformEffect() {}
        ;(TransformEffect.prototype.init = function (e) {
          ;(this.effectsManager = e),
            (this.type = effectTypes.TRANSFORM_EFFECT),
            (this.matrix = new Matrix()),
            (this.opacity = -1),
            (this._mdf = !1),
            (this._opMdf = !1)
        }),
          (TransformEffect.prototype.renderFrame = function (e) {
            if (((this._opMdf = !1), (this._mdf = !1), e || this.effectsManager._mdf)) {
              var t = this.effectsManager.effectElements,
                r = t[0].p.v,
                i = t[1].p.v,
                n = t[2].p.v === 1,
                s = t[3].p.v,
                a = n ? s : t[4].p.v,
                l = t[5].p.v,
                o = t[6].p.v,
                f = t[7].p.v
              this.matrix.reset(),
                this.matrix.translate(-r[0], -r[1], r[2]),
                this.matrix.scale(a * 0.01, s * 0.01, 1),
                this.matrix.rotate(-f * degToRads),
                this.matrix.skewFromAxis(-l * degToRads, (o + 90) * degToRads),
                this.matrix.translate(i[0], i[1], 0),
                (this._mdf = !0),
                this.opacity !== t[8].p.v && ((this.opacity = t[8].p.v), (this._opMdf = !0))
            }
          })
        function SVGTransformEffect(e, t) {
          this.init(t)
        }
        extendPrototype([TransformEffect], SVGTransformEffect)
        function CVTransformEffect(e) {
          this.init(e)
        }
        return (
          extendPrototype([TransformEffect], CVTransformEffect),
          registerRenderer('canvas', CanvasRenderer),
          registerRenderer('html', HybridRenderer),
          registerRenderer('svg', SVGRenderer),
          ShapeModifiers.registerModifier('tm', TrimModifier),
          ShapeModifiers.registerModifier('pb', PuckerAndBloatModifier),
          ShapeModifiers.registerModifier('rp', RepeaterModifier),
          ShapeModifiers.registerModifier('rd', RoundCornersModifier),
          ShapeModifiers.registerModifier('zz', ZigZagModifier),
          ShapeModifiers.registerModifier('op', OffsetPathModifier),
          setExpressionsPlugin(Expressions),
          setExpressionInterfaces(getInterface),
          initialize$1(),
          initialize(),
          registerEffect$1(20, SVGTintFilter, !0),
          registerEffect$1(21, SVGFillFilter, !0),
          registerEffect$1(22, SVGStrokeEffect, !1),
          registerEffect$1(23, SVGTritoneFilter, !0),
          registerEffect$1(24, SVGProLevelsFilter, !0),
          registerEffect$1(25, SVGDropShadowEffect, !0),
          registerEffect$1(28, SVGMatte3Effect, !1),
          registerEffect$1(29, SVGGaussianBlurEffect, !0),
          registerEffect$1(35, SVGTransformEffect, !1),
          registerEffect(35, CVTransformEffect),
          lottie
        )
      })
  })(lottie, lottie.exports)
  var lottieExports = lottie.exports
  const Lottie = getDefaultExportFromCjs(lottieExports)
  ;(function () {
    try {
      if (typeof document < 'u') {
        var e = document.createElement('style')
        e.appendChild(
          document.createTextNode(
            '.lottie-animation-container{width:var(--lottie-animation-container-width);height:var(--lottie-animation-container-height);background-color:var(--lottie-animation-container-background-color);overflow:hidden;margin:var(--lottie-animation-margin)}.lottie-animation-container svg{transform:scale(var(--lottie-animation-scale))}'
          )
        ),
          document.head.appendChild(e)
      }
    } catch (t) {
      console.error('vite-plugin-css-injected-by-js', t)
    }
  })()
  var __defProp = Object.defineProperty,
    __defProps = Object.defineProperties,
    __getOwnPropDescs = Object.getOwnPropertyDescriptors,
    __getOwnPropSymbols = Object.getOwnPropertySymbols,
    __hasOwnProp = Object.prototype.hasOwnProperty,
    __propIsEnum = Object.prototype.propertyIsEnumerable,
    __defNormalProp = (e, t, r) =>
      t in e
        ? __defProp(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
        : (e[t] = r),
    __spreadValues = (e, t) => {
      for (var r in t || (t = {})) __hasOwnProp.call(t, r) && __defNormalProp(e, r, t[r])
      if (__getOwnPropSymbols)
        for (var r of __getOwnPropSymbols(t)) __propIsEnum.call(t, r) && __defNormalProp(e, r, t[r])
      return e
    },
    __spreadProps = (e, t) => __defProps(e, __getOwnPropDescs(t)),
    freeGlobal = typeof global == 'object' && global && global.Object === Object && global,
    freeGlobal$1 = freeGlobal,
    freeSelf = typeof self == 'object' && self && self.Object === Object && self,
    root = freeGlobal$1 || freeSelf || Function('return this')(),
    root$1 = root,
    Symbol$1 = root$1.Symbol,
    Symbol$2 = Symbol$1,
    objectProto$e = Object.prototype,
    hasOwnProperty$b = objectProto$e.hasOwnProperty,
    nativeObjectToString$1 = objectProto$e.toString,
    symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0
  function getRawTag(e) {
    var t = hasOwnProperty$b.call(e, symToStringTag$1),
      r = e[symToStringTag$1]
    try {
      e[symToStringTag$1] = void 0
      var i = !0
    } catch {}
    var n = nativeObjectToString$1.call(e)
    return i && (t ? (e[symToStringTag$1] = r) : delete e[symToStringTag$1]), n
  }
  var objectProto$d = Object.prototype,
    nativeObjectToString = objectProto$d.toString
  function objectToString(e) {
    return nativeObjectToString.call(e)
  }
  var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]',
    symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0
  function baseGetTag(e) {
    return e == null
      ? e === void 0
        ? undefinedTag
        : nullTag
      : symToStringTag && symToStringTag in Object(e)
        ? getRawTag(e)
        : objectToString(e)
  }
  function isObjectLike(e) {
    return e != null && typeof e == 'object'
  }
  var isArray = Array.isArray,
    isArray$1 = isArray
  function isObject(e) {
    var t = typeof e
    return e != null && (t == 'object' || t == 'function')
  }
  var asyncTag = '[object AsyncFunction]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]'
  function isFunction(e) {
    if (!isObject(e)) return !1
    var t = baseGetTag(e)
    return t == funcTag$2 || t == genTag$1 || t == asyncTag || t == proxyTag
  }
  var coreJsData = root$1['__core-js_shared__'],
    coreJsData$1 = coreJsData,
    maskSrcKey = (function () {
      var e = /[^.]+$/.exec((coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO) || '')
      return e ? 'Symbol(src)_1.' + e : ''
    })()
  function isMasked(e) {
    return !!maskSrcKey && maskSrcKey in e
  }
  var funcProto$1 = Function.prototype,
    funcToString$1 = funcProto$1.toString
  function toSource(e) {
    if (e != null) {
      try {
        return funcToString$1.call(e)
      } catch {}
      try {
        return e + ''
      } catch {}
    }
    return ''
  }
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
    reIsHostCtor = /^\[object .+?Constructor\]$/,
    funcProto = Function.prototype,
    objectProto$c = Object.prototype,
    funcToString = funcProto.toString,
    hasOwnProperty$a = objectProto$c.hasOwnProperty,
    reIsNative = RegExp(
      '^' +
        funcToString
          .call(hasOwnProperty$a)
          .replace(reRegExpChar, '\\$&')
          .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
        '$'
    )
  function baseIsNative(e) {
    if (!isObject(e) || isMasked(e)) return !1
    var t = isFunction(e) ? reIsNative : reIsHostCtor
    return t.test(toSource(e))
  }
  function getValue(e, t) {
    return e == null ? void 0 : e[t]
  }
  function getNative(e, t) {
    var r = getValue(e, t)
    return baseIsNative(r) ? r : void 0
  }
  var WeakMap$1 = getNative(root$1, 'WeakMap'),
    WeakMap$1$1 = WeakMap$1,
    objectCreate = Object.create,
    baseCreate = (function () {
      function e() {}
      return function (t) {
        if (!isObject(t)) return {}
        if (objectCreate) return objectCreate(t)
        e.prototype = t
        var r = new e()
        return (e.prototype = void 0), r
      }
    })(),
    baseCreate$1 = baseCreate
  function copyArray(e, t) {
    var r = -1,
      i = e.length
    for (t || (t = Array(i)); ++r < i; ) t[r] = e[r]
    return t
  }
  var defineProperty = (function () {
      try {
        var e = getNative(Object, 'defineProperty')
        return e({}, '', {}), e
      } catch {}
    })(),
    defineProperty$1 = defineProperty
  function arrayEach(e, t) {
    for (var r = -1, i = e == null ? 0 : e.length; ++r < i && t(e[r], r, e) !== !1; );
    return e
  }
  var MAX_SAFE_INTEGER$1 = 9007199254740991,
    reIsUint = /^(?:0|[1-9]\d*)$/
  function isIndex(e, t) {
    var r = typeof e
    return (
      (t = t ?? MAX_SAFE_INTEGER$1),
      !!t && (r == 'number' || (r != 'symbol' && reIsUint.test(e))) && e > -1 && e % 1 == 0 && e < t
    )
  }
  function baseAssignValue(e, t, r) {
    t == '__proto__' && defineProperty$1
      ? defineProperty$1(e, t, { configurable: !0, enumerable: !0, value: r, writable: !0 })
      : (e[t] = r)
  }
  function eq(e, t) {
    return e === t || (e !== e && t !== t)
  }
  var objectProto$b = Object.prototype,
    hasOwnProperty$9 = objectProto$b.hasOwnProperty
  function assignValue(e, t, r) {
    var i = e[t]
    ;(!(hasOwnProperty$9.call(e, t) && eq(i, r)) || (r === void 0 && !(t in e))) &&
      baseAssignValue(e, t, r)
  }
  function copyObject(e, t, r, i) {
    var n = !r
    r || (r = {})
    for (var s = -1, a = t.length; ++s < a; ) {
      var l = t[s],
        o = i ? i(r[l], e[l], l, r, e) : void 0
      o === void 0 && (o = e[l]), n ? baseAssignValue(r, l, o) : assignValue(r, l, o)
    }
    return r
  }
  var MAX_SAFE_INTEGER = 9007199254740991
  function isLength(e) {
    return typeof e == 'number' && e > -1 && e % 1 == 0 && e <= MAX_SAFE_INTEGER
  }
  function isArrayLike(e) {
    return e != null && isLength(e.length) && !isFunction(e)
  }
  var objectProto$a = Object.prototype
  function isPrototype(e) {
    var t = e && e.constructor,
      r = (typeof t == 'function' && t.prototype) || objectProto$a
    return e === r
  }
  function baseTimes(e, t) {
    for (var r = -1, i = Array(e); ++r < e; ) i[r] = t(r)
    return i
  }
  var argsTag$3 = '[object Arguments]'
  function baseIsArguments(e) {
    return isObjectLike(e) && baseGetTag(e) == argsTag$3
  }
  var objectProto$9 = Object.prototype,
    hasOwnProperty$8 = objectProto$9.hasOwnProperty,
    propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable,
    isArguments = baseIsArguments(
      (function () {
        return arguments
      })()
    )
      ? baseIsArguments
      : function (e) {
          return (
            isObjectLike(e) &&
            hasOwnProperty$8.call(e, 'callee') &&
            !propertyIsEnumerable$1.call(e, 'callee')
          )
        },
    isArguments$1 = isArguments
  function stubFalse() {
    return !1
  }
  var freeExports$2 = typeof exports == 'object' && exports && !exports.nodeType && exports,
    freeModule$2 =
      freeExports$2 && typeof module == 'object' && module && !module.nodeType && module,
    moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2,
    Buffer$1 = moduleExports$2 ? root$1.Buffer : void 0,
    nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : void 0,
    isBuffer = nativeIsBuffer || stubFalse,
    isBuffer$1 = isBuffer,
    argsTag$2 = '[object Arguments]',
    arrayTag$2 = '[object Array]',
    boolTag$3 = '[object Boolean]',
    dateTag$3 = '[object Date]',
    errorTag$2 = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag$5 = '[object Map]',
    numberTag$3 = '[object Number]',
    objectTag$3 = '[object Object]',
    regexpTag$3 = '[object RegExp]',
    setTag$5 = '[object Set]',
    stringTag$3 = '[object String]',
    weakMapTag$2 = '[object WeakMap]',
    arrayBufferTag$3 = '[object ArrayBuffer]',
    dataViewTag$4 = '[object DataView]',
    float32Tag$2 = '[object Float32Array]',
    float64Tag$2 = '[object Float64Array]',
    int8Tag$2 = '[object Int8Array]',
    int16Tag$2 = '[object Int16Array]',
    int32Tag$2 = '[object Int32Array]',
    uint8Tag$2 = '[object Uint8Array]',
    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
    uint16Tag$2 = '[object Uint16Array]',
    uint32Tag$2 = '[object Uint32Array]',
    typedArrayTags = {}
  typedArrayTags[float32Tag$2] =
    typedArrayTags[float64Tag$2] =
    typedArrayTags[int8Tag$2] =
    typedArrayTags[int16Tag$2] =
    typedArrayTags[int32Tag$2] =
    typedArrayTags[uint8Tag$2] =
    typedArrayTags[uint8ClampedTag$2] =
    typedArrayTags[uint16Tag$2] =
    typedArrayTags[uint32Tag$2] =
      !0
  typedArrayTags[argsTag$2] =
    typedArrayTags[arrayTag$2] =
    typedArrayTags[arrayBufferTag$3] =
    typedArrayTags[boolTag$3] =
    typedArrayTags[dataViewTag$4] =
    typedArrayTags[dateTag$3] =
    typedArrayTags[errorTag$2] =
    typedArrayTags[funcTag$1] =
    typedArrayTags[mapTag$5] =
    typedArrayTags[numberTag$3] =
    typedArrayTags[objectTag$3] =
    typedArrayTags[regexpTag$3] =
    typedArrayTags[setTag$5] =
    typedArrayTags[stringTag$3] =
    typedArrayTags[weakMapTag$2] =
      !1
  function baseIsTypedArray(e) {
    return isObjectLike(e) && isLength(e.length) && !!typedArrayTags[baseGetTag(e)]
  }
  function baseUnary(e) {
    return function (t) {
      return e(t)
    }
  }
  var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports,
    freeModule$1 =
      freeExports$1 && typeof module == 'object' && module && !module.nodeType && module,
    moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1,
    freeProcess = moduleExports$1 && freeGlobal$1.process,
    nodeUtil = (function () {
      try {
        var e = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types
        return e || (freeProcess && freeProcess.binding && freeProcess.binding('util'))
      } catch {}
    })(),
    nodeUtil$1 = nodeUtil,
    nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray,
    isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray,
    isTypedArray$1 = isTypedArray,
    objectProto$8 = Object.prototype,
    hasOwnProperty$7 = objectProto$8.hasOwnProperty
  function arrayLikeKeys(e, t) {
    var r = isArray$1(e),
      i = !r && isArguments$1(e),
      n = !r && !i && isBuffer$1(e),
      s = !r && !i && !n && isTypedArray$1(e),
      a = r || i || n || s,
      l = a ? baseTimes(e.length, String) : [],
      o = l.length
    for (var f in e)
      (t || hasOwnProperty$7.call(e, f)) &&
        !(
          a &&
          (f == 'length' ||
            (n && (f == 'offset' || f == 'parent')) ||
            (s && (f == 'buffer' || f == 'byteLength' || f == 'byteOffset')) ||
            isIndex(f, o))
        ) &&
        l.push(f)
    return l
  }
  function overArg(e, t) {
    return function (r) {
      return e(t(r))
    }
  }
  var nativeKeys = overArg(Object.keys, Object),
    nativeKeys$1 = nativeKeys,
    objectProto$7 = Object.prototype,
    hasOwnProperty$6 = objectProto$7.hasOwnProperty
  function baseKeys(e) {
    if (!isPrototype(e)) return nativeKeys$1(e)
    var t = []
    for (var r in Object(e)) hasOwnProperty$6.call(e, r) && r != 'constructor' && t.push(r)
    return t
  }
  function keys(e) {
    return isArrayLike(e) ? arrayLikeKeys(e) : baseKeys(e)
  }
  function nativeKeysIn(e) {
    var t = []
    if (e != null) for (var r in Object(e)) t.push(r)
    return t
  }
  var objectProto$6 = Object.prototype,
    hasOwnProperty$5 = objectProto$6.hasOwnProperty
  function baseKeysIn(e) {
    if (!isObject(e)) return nativeKeysIn(e)
    var t = isPrototype(e),
      r = []
    for (var i in e) (i == 'constructor' && (t || !hasOwnProperty$5.call(e, i))) || r.push(i)
    return r
  }
  function keysIn(e) {
    return isArrayLike(e) ? arrayLikeKeys(e, !0) : baseKeysIn(e)
  }
  var nativeCreate = getNative(Object, 'create'),
    nativeCreate$1 = nativeCreate
  function hashClear() {
    ;(this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {}), (this.size = 0)
  }
  function hashDelete(e) {
    var t = this.has(e) && delete this.__data__[e]
    return (this.size -= t ? 1 : 0), t
  }
  var HASH_UNDEFINED$2 = '__lodash_hash_undefined__',
    objectProto$5 = Object.prototype,
    hasOwnProperty$4 = objectProto$5.hasOwnProperty
  function hashGet(e) {
    var t = this.__data__
    if (nativeCreate$1) {
      var r = t[e]
      return r === HASH_UNDEFINED$2 ? void 0 : r
    }
    return hasOwnProperty$4.call(t, e) ? t[e] : void 0
  }
  var objectProto$4 = Object.prototype,
    hasOwnProperty$3 = objectProto$4.hasOwnProperty
  function hashHas(e) {
    var t = this.__data__
    return nativeCreate$1 ? t[e] !== void 0 : hasOwnProperty$3.call(t, e)
  }
  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__'
  function hashSet(e, t) {
    var r = this.__data__
    return (
      (this.size += this.has(e) ? 0 : 1),
      (r[e] = nativeCreate$1 && t === void 0 ? HASH_UNDEFINED$1 : t),
      this
    )
  }
  function Hash(e) {
    var t = -1,
      r = e == null ? 0 : e.length
    for (this.clear(); ++t < r; ) {
      var i = e[t]
      this.set(i[0], i[1])
    }
  }
  Hash.prototype.clear = hashClear
  Hash.prototype.delete = hashDelete
  Hash.prototype.get = hashGet
  Hash.prototype.has = hashHas
  Hash.prototype.set = hashSet
  function listCacheClear() {
    ;(this.__data__ = []), (this.size = 0)
  }
  function assocIndexOf(e, t) {
    for (var r = e.length; r--; ) if (eq(e[r][0], t)) return r
    return -1
  }
  var arrayProto = Array.prototype,
    splice = arrayProto.splice
  function listCacheDelete(e) {
    var t = this.__data__,
      r = assocIndexOf(t, e)
    if (r < 0) return !1
    var i = t.length - 1
    return r == i ? t.pop() : splice.call(t, r, 1), --this.size, !0
  }
  function listCacheGet(e) {
    var t = this.__data__,
      r = assocIndexOf(t, e)
    return r < 0 ? void 0 : t[r][1]
  }
  function listCacheHas(e) {
    return assocIndexOf(this.__data__, e) > -1
  }
  function listCacheSet(e, t) {
    var r = this.__data__,
      i = assocIndexOf(r, e)
    return i < 0 ? (++this.size, r.push([e, t])) : (r[i][1] = t), this
  }
  function ListCache(e) {
    var t = -1,
      r = e == null ? 0 : e.length
    for (this.clear(); ++t < r; ) {
      var i = e[t]
      this.set(i[0], i[1])
    }
  }
  ListCache.prototype.clear = listCacheClear
  ListCache.prototype.delete = listCacheDelete
  ListCache.prototype.get = listCacheGet
  ListCache.prototype.has = listCacheHas
  ListCache.prototype.set = listCacheSet
  var Map$1 = getNative(root$1, 'Map'),
    Map$1$1 = Map$1
  function mapCacheClear() {
    ;(this.size = 0),
      (this.__data__ = { hash: new Hash(), map: new (Map$1$1 || ListCache)(), string: new Hash() })
  }
  function isKeyable(e) {
    var t = typeof e
    return t == 'string' || t == 'number' || t == 'symbol' || t == 'boolean'
      ? e !== '__proto__'
      : e === null
  }
  function getMapData(e, t) {
    var r = e.__data__
    return isKeyable(t) ? r[typeof t == 'string' ? 'string' : 'hash'] : r.map
  }
  function mapCacheDelete(e) {
    var t = getMapData(this, e).delete(e)
    return (this.size -= t ? 1 : 0), t
  }
  function mapCacheGet(e) {
    return getMapData(this, e).get(e)
  }
  function mapCacheHas(e) {
    return getMapData(this, e).has(e)
  }
  function mapCacheSet(e, t) {
    var r = getMapData(this, e),
      i = r.size
    return r.set(e, t), (this.size += r.size == i ? 0 : 1), this
  }
  function MapCache(e) {
    var t = -1,
      r = e == null ? 0 : e.length
    for (this.clear(); ++t < r; ) {
      var i = e[t]
      this.set(i[0], i[1])
    }
  }
  MapCache.prototype.clear = mapCacheClear
  MapCache.prototype.delete = mapCacheDelete
  MapCache.prototype.get = mapCacheGet
  MapCache.prototype.has = mapCacheHas
  MapCache.prototype.set = mapCacheSet
  function arrayPush(e, t) {
    for (var r = -1, i = t.length, n = e.length; ++r < i; ) e[n + r] = t[r]
    return e
  }
  var getPrototype = overArg(Object.getPrototypeOf, Object),
    getPrototype$1 = getPrototype
  function stackClear() {
    ;(this.__data__ = new ListCache()), (this.size = 0)
  }
  function stackDelete(e) {
    var t = this.__data__,
      r = t.delete(e)
    return (this.size = t.size), r
  }
  function stackGet(e) {
    return this.__data__.get(e)
  }
  function stackHas(e) {
    return this.__data__.has(e)
  }
  var LARGE_ARRAY_SIZE = 200
  function stackSet(e, t) {
    var r = this.__data__
    if (r instanceof ListCache) {
      var i = r.__data__
      if (!Map$1$1 || i.length < LARGE_ARRAY_SIZE - 1)
        return i.push([e, t]), (this.size = ++r.size), this
      r = this.__data__ = new MapCache(i)
    }
    return r.set(e, t), (this.size = r.size), this
  }
  function Stack(e) {
    var t = (this.__data__ = new ListCache(e))
    this.size = t.size
  }
  Stack.prototype.clear = stackClear
  Stack.prototype.delete = stackDelete
  Stack.prototype.get = stackGet
  Stack.prototype.has = stackHas
  Stack.prototype.set = stackSet
  function baseAssign(e, t) {
    return e && copyObject(t, keys(t), e)
  }
  function baseAssignIn(e, t) {
    return e && copyObject(t, keysIn(t), e)
  }
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports,
    freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module,
    moduleExports = freeModule && freeModule.exports === freeExports,
    Buffer2 = moduleExports ? root$1.Buffer : void 0,
    allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0
  function cloneBuffer(e, t) {
    if (t) return e.slice()
    var r = e.length,
      i = allocUnsafe ? allocUnsafe(r) : new e.constructor(r)
    return e.copy(i), i
  }
  function arrayFilter(e, t) {
    for (var r = -1, i = e == null ? 0 : e.length, n = 0, s = []; ++r < i; ) {
      var a = e[r]
      t(a, r, e) && (s[n++] = a)
    }
    return s
  }
  function stubArray() {
    return []
  }
  var objectProto$3 = Object.prototype,
    propertyIsEnumerable = objectProto$3.propertyIsEnumerable,
    nativeGetSymbols$1 = Object.getOwnPropertySymbols,
    getSymbols = nativeGetSymbols$1
      ? function (e) {
          return e == null
            ? []
            : ((e = Object(e)),
              arrayFilter(nativeGetSymbols$1(e), function (t) {
                return propertyIsEnumerable.call(e, t)
              }))
        }
      : stubArray,
    getSymbols$1 = getSymbols
  function copySymbols(e, t) {
    return copyObject(e, getSymbols$1(e), t)
  }
  var nativeGetSymbols = Object.getOwnPropertySymbols,
    getSymbolsIn = nativeGetSymbols
      ? function (e) {
          for (var t = []; e; ) arrayPush(t, getSymbols$1(e)), (e = getPrototype$1(e))
          return t
        }
      : stubArray,
    getSymbolsIn$1 = getSymbolsIn
  function copySymbolsIn(e, t) {
    return copyObject(e, getSymbolsIn$1(e), t)
  }
  function baseGetAllKeys(e, t, r) {
    var i = t(e)
    return isArray$1(e) ? i : arrayPush(i, r(e))
  }
  function getAllKeys(e) {
    return baseGetAllKeys(e, keys, getSymbols$1)
  }
  function getAllKeysIn(e) {
    return baseGetAllKeys(e, keysIn, getSymbolsIn$1)
  }
  var DataView = getNative(root$1, 'DataView'),
    DataView$1 = DataView,
    Promise$1 = getNative(root$1, 'Promise'),
    Promise$2 = Promise$1,
    Set$1 = getNative(root$1, 'Set'),
    Set$1$1 = Set$1,
    mapTag$4 = '[object Map]',
    objectTag$2 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$4 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]',
    dataViewTag$3 = '[object DataView]',
    dataViewCtorString = toSource(DataView$1),
    mapCtorString = toSource(Map$1$1),
    promiseCtorString = toSource(Promise$2),
    setCtorString = toSource(Set$1$1),
    weakMapCtorString = toSource(WeakMap$1$1),
    getTag = baseGetTag
  ;((DataView$1 && getTag(new DataView$1(new ArrayBuffer(1))) != dataViewTag$3) ||
    (Map$1$1 && getTag(new Map$1$1()) != mapTag$4) ||
    (Promise$2 && getTag(Promise$2.resolve()) != promiseTag) ||
    (Set$1$1 && getTag(new Set$1$1()) != setTag$4) ||
    (WeakMap$1$1 && getTag(new WeakMap$1$1()) != weakMapTag$1)) &&
    (getTag = function (e) {
      var t = baseGetTag(e),
        r = t == objectTag$2 ? e.constructor : void 0,
        i = r ? toSource(r) : ''
      if (i)
        switch (i) {
          case dataViewCtorString:
            return dataViewTag$3
          case mapCtorString:
            return mapTag$4
          case promiseCtorString:
            return promiseTag
          case setCtorString:
            return setTag$4
          case weakMapCtorString:
            return weakMapTag$1
        }
      return t
    })
  var getTag$1 = getTag,
    objectProto$2 = Object.prototype,
    hasOwnProperty$2 = objectProto$2.hasOwnProperty
  function initCloneArray(e) {
    var t = e.length,
      r = new e.constructor(t)
    return (
      t &&
        typeof e[0] == 'string' &&
        hasOwnProperty$2.call(e, 'index') &&
        ((r.index = e.index), (r.input = e.input)),
      r
    )
  }
  var Uint8Array2 = root$1.Uint8Array,
    Uint8Array$1 = Uint8Array2
  function cloneArrayBuffer(e) {
    var t = new e.constructor(e.byteLength)
    return new Uint8Array$1(t).set(new Uint8Array$1(e)), t
  }
  function cloneDataView(e, t) {
    var r = t ? cloneArrayBuffer(e.buffer) : e.buffer
    return new e.constructor(r, e.byteOffset, e.byteLength)
  }
  var reFlags = /\w*$/
  function cloneRegExp(e) {
    var t = new e.constructor(e.source, reFlags.exec(e))
    return (t.lastIndex = e.lastIndex), t
  }
  var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : void 0,
    symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0
  function cloneSymbol(e) {
    return symbolValueOf$1 ? Object(symbolValueOf$1.call(e)) : {}
  }
  function cloneTypedArray(e, t) {
    var r = t ? cloneArrayBuffer(e.buffer) : e.buffer
    return new e.constructor(r, e.byteOffset, e.length)
  }
  var boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    mapTag$3 = '[object Map]',
    numberTag$2 = '[object Number]',
    regexpTag$2 = '[object RegExp]',
    setTag$3 = '[object Set]',
    stringTag$2 = '[object String]',
    symbolTag$2 = '[object Symbol]',
    arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]',
    float32Tag$1 = '[object Float32Array]',
    float64Tag$1 = '[object Float64Array]',
    int8Tag$1 = '[object Int8Array]',
    int16Tag$1 = '[object Int16Array]',
    int32Tag$1 = '[object Int32Array]',
    uint8Tag$1 = '[object Uint8Array]',
    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
    uint16Tag$1 = '[object Uint16Array]',
    uint32Tag$1 = '[object Uint32Array]'
  function initCloneByTag(e, t, r) {
    var i = e.constructor
    switch (t) {
      case arrayBufferTag$2:
        return cloneArrayBuffer(e)
      case boolTag$2:
      case dateTag$2:
        return new i(+e)
      case dataViewTag$2:
        return cloneDataView(e, r)
      case float32Tag$1:
      case float64Tag$1:
      case int8Tag$1:
      case int16Tag$1:
      case int32Tag$1:
      case uint8Tag$1:
      case uint8ClampedTag$1:
      case uint16Tag$1:
      case uint32Tag$1:
        return cloneTypedArray(e, r)
      case mapTag$3:
        return new i()
      case numberTag$2:
      case stringTag$2:
        return new i(e)
      case regexpTag$2:
        return cloneRegExp(e)
      case setTag$3:
        return new i()
      case symbolTag$2:
        return cloneSymbol(e)
    }
  }
  function initCloneObject(e) {
    return typeof e.constructor == 'function' && !isPrototype(e)
      ? baseCreate$1(getPrototype$1(e))
      : {}
  }
  var mapTag$2 = '[object Map]'
  function baseIsMap(e) {
    return isObjectLike(e) && getTag$1(e) == mapTag$2
  }
  var nodeIsMap = nodeUtil$1 && nodeUtil$1.isMap,
    isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap,
    isMap$1 = isMap,
    setTag$2 = '[object Set]'
  function baseIsSet(e) {
    return isObjectLike(e) && getTag$1(e) == setTag$2
  }
  var nodeIsSet = nodeUtil$1 && nodeUtil$1.isSet,
    isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet,
    isSet$1 = isSet,
    CLONE_DEEP_FLAG$1 = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG$1 = 4,
    argsTag$1 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag$1 = '[object Map]',
    numberTag$1 = '[object Number]',
    objectTag$1 = '[object Object]',
    regexpTag$1 = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag$1 = '[object Symbol]',
    weakMapTag = '[object WeakMap]',
    arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]',
    cloneableTags = {}
  cloneableTags[argsTag$1] =
    cloneableTags[arrayTag$1] =
    cloneableTags[arrayBufferTag$1] =
    cloneableTags[dataViewTag$1] =
    cloneableTags[boolTag$1] =
    cloneableTags[dateTag$1] =
    cloneableTags[float32Tag] =
    cloneableTags[float64Tag] =
    cloneableTags[int8Tag] =
    cloneableTags[int16Tag] =
    cloneableTags[int32Tag] =
    cloneableTags[mapTag$1] =
    cloneableTags[numberTag$1] =
    cloneableTags[objectTag$1] =
    cloneableTags[regexpTag$1] =
    cloneableTags[setTag$1] =
    cloneableTags[stringTag$1] =
    cloneableTags[symbolTag$1] =
    cloneableTags[uint8Tag] =
    cloneableTags[uint8ClampedTag] =
    cloneableTags[uint16Tag] =
    cloneableTags[uint32Tag] =
      !0
  cloneableTags[errorTag$1] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = !1
  function baseClone(e, t, r, i, n, s) {
    var a,
      l = t & CLONE_DEEP_FLAG$1,
      o = t & CLONE_FLAT_FLAG,
      f = t & CLONE_SYMBOLS_FLAG$1
    if ((r && (a = n ? r(e, i, n, s) : r(e)), a !== void 0)) return a
    if (!isObject(e)) return e
    var u = isArray$1(e)
    if (u) {
      if (((a = initCloneArray(e)), !l)) return copyArray(e, a)
    } else {
      var E = getTag$1(e),
        c = E == funcTag || E == genTag
      if (isBuffer$1(e)) return cloneBuffer(e, l)
      if (E == objectTag$1 || E == argsTag$1 || (c && !n)) {
        if (((a = o || c ? {} : initCloneObject(e)), !l))
          return o ? copySymbolsIn(e, baseAssignIn(a, e)) : copySymbols(e, baseAssign(a, e))
      } else {
        if (!cloneableTags[E]) return n ? e : {}
        a = initCloneByTag(e, E, l)
      }
    }
    s || (s = new Stack())
    var b = s.get(e)
    if (b) return b
    s.set(e, a),
      isSet$1(e)
        ? e.forEach(function (_) {
            a.add(baseClone(_, t, r, _, e, s))
          })
        : isMap$1(e) &&
          e.forEach(function (_, m) {
            a.set(m, baseClone(_, t, r, m, e, s))
          })
    var x = f ? (o ? getAllKeysIn : getAllKeys) : o ? keysIn : keys,
      y = u ? void 0 : x(e)
    return (
      arrayEach(y || e, function (_, m) {
        y && ((m = _), (_ = e[m])), assignValue(a, m, baseClone(_, t, r, m, e, s))
      }),
      a
    )
  }
  var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4
  function cloneDeep(e) {
    return baseClone(e, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG)
  }
  var HASH_UNDEFINED = '__lodash_hash_undefined__'
  function setCacheAdd(e) {
    return this.__data__.set(e, HASH_UNDEFINED), this
  }
  function setCacheHas(e) {
    return this.__data__.has(e)
  }
  function SetCache(e) {
    var t = -1,
      r = e == null ? 0 : e.length
    for (this.__data__ = new MapCache(); ++t < r; ) this.add(e[t])
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd
  SetCache.prototype.has = setCacheHas
  function arraySome(e, t) {
    for (var r = -1, i = e == null ? 0 : e.length; ++r < i; ) if (t(e[r], r, e)) return !0
    return !1
  }
  function cacheHas(e, t) {
    return e.has(t)
  }
  var COMPARE_PARTIAL_FLAG$3 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2
  function equalArrays(e, t, r, i, n, s) {
    var a = r & COMPARE_PARTIAL_FLAG$3,
      l = e.length,
      o = t.length
    if (l != o && !(a && o > l)) return !1
    var f = s.get(e),
      u = s.get(t)
    if (f && u) return f == t && u == e
    var E = -1,
      c = !0,
      b = r & COMPARE_UNORDERED_FLAG$1 ? new SetCache() : void 0
    for (s.set(e, t), s.set(t, e); ++E < l; ) {
      var x = e[E],
        y = t[E]
      if (i) var _ = a ? i(y, x, E, t, e, s) : i(x, y, E, e, t, s)
      if (_ !== void 0) {
        if (_) continue
        c = !1
        break
      }
      if (b) {
        if (
          !arraySome(t, function (m, A) {
            if (!cacheHas(b, A) && (x === m || n(x, m, r, i, s))) return b.push(A)
          })
        ) {
          c = !1
          break
        }
      } else if (!(x === y || n(x, y, r, i, s))) {
        c = !1
        break
      }
    }
    return s.delete(e), s.delete(t), c
  }
  function mapToArray(e) {
    var t = -1,
      r = Array(e.size)
    return (
      e.forEach(function (i, n) {
        r[++t] = [n, i]
      }),
      r
    )
  }
  function setToArray(e) {
    var t = -1,
      r = Array(e.size)
    return (
      e.forEach(function (i) {
        r[++t] = i
      }),
      r
    )
  }
  var COMPARE_PARTIAL_FLAG$2 = 1,
    COMPARE_UNORDERED_FLAG = 2,
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    symbolProto = Symbol$2 ? Symbol$2.prototype : void 0,
    symbolValueOf = symbolProto ? symbolProto.valueOf : void 0
  function equalByTag(e, t, r, i, n, s, a) {
    switch (r) {
      case dataViewTag:
        if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) return !1
        ;(e = e.buffer), (t = t.buffer)
      case arrayBufferTag:
        return !(e.byteLength != t.byteLength || !s(new Uint8Array$1(e), new Uint8Array$1(t)))
      case boolTag:
      case dateTag:
      case numberTag:
        return eq(+e, +t)
      case errorTag:
        return e.name == t.name && e.message == t.message
      case regexpTag:
      case stringTag:
        return e == t + ''
      case mapTag:
        var l = mapToArray
      case setTag:
        var o = i & COMPARE_PARTIAL_FLAG$2
        if ((l || (l = setToArray), e.size != t.size && !o)) return !1
        var f = a.get(e)
        if (f) return f == t
        ;(i |= COMPARE_UNORDERED_FLAG), a.set(e, t)
        var u = equalArrays(l(e), l(t), i, n, s, a)
        return a.delete(e), u
      case symbolTag:
        if (symbolValueOf) return symbolValueOf.call(e) == symbolValueOf.call(t)
    }
    return !1
  }
  var COMPARE_PARTIAL_FLAG$1 = 1,
    objectProto$1 = Object.prototype,
    hasOwnProperty$1 = objectProto$1.hasOwnProperty
  function equalObjects(e, t, r, i, n, s) {
    var a = r & COMPARE_PARTIAL_FLAG$1,
      l = getAllKeys(e),
      o = l.length,
      f = getAllKeys(t),
      u = f.length
    if (o != u && !a) return !1
    for (var E = o; E--; ) {
      var c = l[E]
      if (!(a ? c in t : hasOwnProperty$1.call(t, c))) return !1
    }
    var b = s.get(e),
      x = s.get(t)
    if (b && x) return b == t && x == e
    var y = !0
    s.set(e, t), s.set(t, e)
    for (var _ = a; ++E < o; ) {
      c = l[E]
      var m = e[c],
        A = t[c]
      if (i) var d = a ? i(A, m, c, t, e, s) : i(m, A, c, e, t, s)
      if (!(d === void 0 ? m === A || n(m, A, r, i, s) : d)) {
        y = !1
        break
      }
      _ || (_ = c == 'constructor')
    }
    if (y && !_) {
      var g = e.constructor,
        C = t.constructor
      g != C &&
        'constructor' in e &&
        'constructor' in t &&
        !(typeof g == 'function' && g instanceof g && typeof C == 'function' && C instanceof C) &&
        (y = !1)
    }
    return s.delete(e), s.delete(t), y
  }
  var COMPARE_PARTIAL_FLAG = 1,
    argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]',
    objectProto = Object.prototype,
    hasOwnProperty = objectProto.hasOwnProperty
  function baseIsEqualDeep(e, t, r, i, n, s) {
    var a = isArray$1(e),
      l = isArray$1(t),
      o = a ? arrayTag : getTag$1(e),
      f = l ? arrayTag : getTag$1(t)
    ;(o = o == argsTag ? objectTag : o), (f = f == argsTag ? objectTag : f)
    var u = o == objectTag,
      E = f == objectTag,
      c = o == f
    if (c && isBuffer$1(e)) {
      if (!isBuffer$1(t)) return !1
      ;(a = !0), (u = !1)
    }
    if (c && !u)
      return (
        s || (s = new Stack()),
        a || isTypedArray$1(e) ? equalArrays(e, t, r, i, n, s) : equalByTag(e, t, o, r, i, n, s)
      )
    if (!(r & COMPARE_PARTIAL_FLAG)) {
      var b = u && hasOwnProperty.call(e, '__wrapped__'),
        x = E && hasOwnProperty.call(t, '__wrapped__')
      if (b || x) {
        var y = b ? e.value() : e,
          _ = x ? t.value() : t
        return s || (s = new Stack()), n(y, _, r, i, s)
      }
    }
    return c ? (s || (s = new Stack()), equalObjects(e, t, r, i, n, s)) : !1
  }
  function baseIsEqual(e, t, r, i, n) {
    return e === t
      ? !0
      : e == null || t == null || (!isObjectLike(e) && !isObjectLike(t))
        ? e !== e && t !== t
        : baseIsEqualDeep(e, t, r, i, baseIsEqual, n)
  }
  function isEqual(e, t) {
    return baseIsEqual(e, t)
  }
  var _export_sfc = (e, t) => {
    const r = e.__vccOpts || e
    for (const [i, n] of t) r[i] = n
    return r
  }
  const _sfc_main = defineComponent({
    props: {
      animationData: { type: Object, default: () => ({}) },
      animationLink: { type: String, default: '' },
      loop: { type: [Boolean, Number], default: !0 },
      autoPlay: { type: Boolean, default: !0 },
      width: { type: [Number, String], default: '100%' },
      height: { type: [Number, String], default: '100%' },
      speed: { type: Number, default: 1 },
      delay: { type: Number, default: 0 },
      direction: { type: String, default: 'forward' },
      pauseOnHover: { type: Boolean, default: !1 },
      playOnHover: { type: Boolean, default: !1 },
      backgroundColor: { type: String, default: 'transparent' },
      pauseAnimation: { type: Boolean, default: !1 },
      noMargin: { type: Boolean, default: !1 },
      scale: { type: Number, default: 1 },
      renderer: { type: String, default: 'svg' },
      rendererSettings: { type: Object, default: () => ({}) },
      assetsPath: { type: String, default: '' }
    },
    emits: {
      onComplete: null,
      onLoopComplete: null,
      onEnterFrame: null,
      onSegmentStart: null,
      onAnimationLoaded: null
    },
    setup(e, { emit: t }) {
      const r = ref(),
        i = ref()
      let n = null,
        s = 1
      watchEffect(async () => {
        if (e.animationLink != '')
          try {
            const k = await (await fetch(e.animationLink)).json()
            ;(r.value = k), nextTick(() => a())
          } catch (P) {
            console.error(P)
            return
          }
        else if (isEqual(e.animationData, {}) === !1)
          (r.value = cloneDeep(e.animationData)), nextTick(() => a())
        else throw new Error('You must provide either animationLink or animationData')
      })
      const a = () => {
          if (!i.value || !r.value) return
          n == null || n.destroy(), (n = null)
          let P = e.autoPlay,
            k = e.loop
          e.playOnHover && (P = !1),
            typeof k == 'number' && k > 0 && (k = k - 1),
            e.delay > 0 && (P = !1)
          const M = {
            container: i.value,
            renderer: e.renderer,
            loop: k,
            autoplay: P,
            animationData: r.value,
            assetsPath: e.assetsPath
          }
          isEqual(e.rendererSettings, {}) === !1 && (M.rendererSettings = e.rendererSettings),
            e.scale !== 1 &&
              (M.rendererSettings = __spreadProps(__spreadValues({}, M.rendererSettings), {
                viewBoxOnly: !0
              })),
            (n = Lottie.loadAnimation(M)),
            setTimeout(() => {
              ;(P = e.autoPlay),
                e.playOnHover
                  ? n == null || n.pause()
                  : P
                    ? n == null || n.play()
                    : n == null || n.pause(),
                t('onAnimationLoaded')
            }, e.delay),
            n.setSpeed(e.speed),
            e.direction === 'reverse' && n.setDirection(-1),
            e.direction === 'normal' && n.setDirection(1),
            (e.pauseAnimation || e.playOnHover) && n.pause(),
            n.addEventListener('loopComplete', () => {
              e.direction === 'alternate' &&
                (n == null || n.stop(),
                (s = s === -1 ? 1 : -1),
                n == null || n.setDirection(s),
                n == null || n.play()),
                t('onLoopComplete')
            }),
            n.addEventListener('complete', () => {
              t('onComplete')
            }),
            n.addEventListener('enterFrame', () => {
              t('onEnterFrame')
            }),
            n.addEventListener('segmentStart', () => {
              t('onSegmentStart')
            })
        },
        l = computed(() => {
          let P = e.width,
            k = e.height
          return (
            typeof e.width == 'number' && (P = `${e.width}px`),
            typeof e.height == 'number' && (k = `${e.height}px`),
            {
              '--lottie-animation-container-width': P,
              '--lottie-animation-container-height': k,
              '--lottie-animation-container-background-color': e.backgroundColor,
              '--lottie-animation-margin': e.noMargin ? '0' : '0 auto',
              '--lottie-animation-scale': e.scale != 1 ? e.scale : ''
            }
          )
        }),
        o = () => {
          n && e.pauseOnHover && n.pause(), n && e.playOnHover && n.play()
        },
        f = () => {
          n && e.pauseOnHover && n.play(), n && e.playOnHover && n.pause()
        }
      return (
        watch(
          () => e.pauseAnimation,
          () => {
            if ((e.pauseOnHover || e.playOnHover) && e.pauseAnimation) {
              console.error(
                'If you are using pauseAnimation prop for Vue3-Lottie, please remove the props pauseOnHover and playOnHover'
              )
              return
            }
            n && (e.pauseAnimation ? n.pause() : n.play())
          }
        ),
        {
          lottieAnimationContainer: i,
          hoverEnded: f,
          hoverStarted: o,
          getCurrentStyle: l,
          play: () => {
            n && n.play()
          },
          pause: () => {
            n && n.pause()
          },
          stop: () => {
            n && n.stop()
          },
          destroy: () => {
            n && n.destroy()
          },
          setSpeed: (P = 1) => {
            if (P <= 0) throw new Error('Speed must be greater than 0')
            n && n.setSpeed(P)
          },
          setDirection: (P) => {
            n && (P === 'forward' ? n.setDirection(1) : P === 'reverse' && n.setDirection(-1))
          },
          goToAndStop: (P, k = !0) => {
            n && n.goToAndStop(P, k)
          },
          goToAndPlay: (P, k = !0) => {
            n && n.goToAndPlay(P, k)
          },
          playSegments: (P, k = !1) => {
            n && n.playSegments(P, k)
          },
          setSubFrame: (P = !0) => {
            n && n.setSubframe(P)
          },
          getDuration: (P = !0) => {
            if (n) return n.getDuration(P)
          },
          updateDocumentData: (P, k = 0) => {
            n && n.renderer.elements[k].updateDocumentData(P)
          }
        }
      )
    }
  })
  function _sfc_render(e, t, r, i, n, s) {
    return (
      openBlock(),
      createElementBlock(
        'div',
        {
          ref: 'lottieAnimationContainer',
          class: 'lottie-animation-container',
          style: normalizeStyle(e.getCurrentStyle),
          onMouseenter: t[0] || (t[0] = (...a) => e.hoverStarted && e.hoverStarted(...a)),
          onMouseleave: t[1] || (t[1] = (...a) => e.hoverEnded && e.hoverEnded(...a))
        },
        null,
        36
      )
    )
  }
  var Vue3Lottie = _export_sfc(_sfc_main, [['render', _sfc_render]]),
    index = {
      install(e, t) {
        var r
        const i = (r = t == null ? void 0 : t.name) != null ? r : 'Vue3Lottie'
        e.component(i, Vue3Lottie)
      }
    }
  createApp(App).use(index).mount('#app')
})
export default Ce()
