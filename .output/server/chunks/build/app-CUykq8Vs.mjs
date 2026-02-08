import { createComponent, isServer, ssr, ssrHydrationKey, escape, getRequestEvent, delegateEvents } from 'solid-js/web';
import { q as qt } from '../nitro/nitro.mjs';
import { Suspense, createSignal, onCleanup, children, createMemo, getOwner, sharedConfig, useContext, createRenderEffect, on, runWithOwner, createContext, untrack, Show, createRoot, startTransition, resetErrorBoundaries, batch, createComponent as createComponent$1 } from 'solid-js';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import 'seroval';
import 'seroval-plugins/web';
import 'solid-js/web/storage';

function ae() {
  let e = /* @__PURE__ */ new Set();
  function t(n) {
    return e.add(n), () => e.delete(n);
  }
  let r = false;
  function o(n, a) {
    if (r) return !(r = false);
    const s = { to: n, options: a, defaultPrevented: false, preventDefault: () => s.defaultPrevented = true };
    for (const i of e) i.listener({ ...s, from: i.location, retry: (h) => {
      h && (r = true), i.navigate(n, { ...a, resolve: false });
    } });
    return !s.defaultPrevented;
  }
  return { subscribe: t, confirm: o };
}
let M;
function H() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), M = window.history.state._depth;
}
isServer || H();
function qe(e) {
  return { ...e, _depth: window.history.state && window.history.state._depth };
}
function _e(e, t) {
  let r = false;
  return () => {
    const o = M;
    H();
    const n = o == null ? null : M - o;
    if (r) {
      r = false;
      return;
    }
    n && t(n) ? (r = true, window.history.go(-n)) : e();
  };
}
const je = /^(?:[a-z0-9]+:)?\/\//i, Be = /^\/+|(\/)\/+$/g, se = "http://sr";
function j(e, t = false) {
  const r = e.replace(Be, "$1");
  return r ? t || /^[?#]/.test(r) ? r : "/" + r : "";
}
function W(e, t, r) {
  if (je.test(t)) return;
  const o = j(e), n = r && j(r);
  let a = "";
  return !n || t.startsWith("/") ? a = o : n.toLowerCase().indexOf(o.toLowerCase()) !== 0 ? a = o + n : a = n, (a || "/") + j(t, !a);
}
function Ie(e, t) {
  if (e == null) throw new Error(t);
  return e;
}
function $e(e, t) {
  return j(e).replace(/\/*(\*.*)?$/g, "") + j(t);
}
function ie(e) {
  const t = {};
  return e.searchParams.forEach((r, o) => {
    o in t ? Array.isArray(t[o]) ? t[o].push(r) : t[o] = [t[o], r] : t[o] = r;
  }), t;
}
function We(e, t, r) {
  const [o, n] = e.split("/*", 2), a = o.split("/").filter(Boolean), s = a.length;
  return (i) => {
    const h = i.split("/").filter(Boolean), c = h.length - s;
    if (c < 0 || c > 0 && n === void 0 && !t) return null;
    const d = { path: s ? "" : "/", params: {} }, y = (m) => r === void 0 ? void 0 : r[m];
    for (let m = 0; m < s; m++) {
      const g = a[m], v = g[0] === ":", u = v ? h[m] : h[m].toLowerCase(), l = v ? g.slice(1) : g.toLowerCase();
      if (v && K(u, y(l))) d.params[l] = u;
      else if (v || !K(u, l)) return null;
      d.path += `/${u}`;
    }
    if (n) {
      const m = c ? h.slice(-c).join("/") : "";
      if (K(m, y(n))) d.params[n] = m;
      else return null;
    }
    return d;
  };
}
function K(e, t) {
  const r = (o) => o === e;
  return t === void 0 ? true : typeof t == "string" ? r(t) : typeof t == "function" ? t(e) : Array.isArray(t) ? t.some(r) : t instanceof RegExp ? t.test(e) : false;
}
function De(e) {
  const [t, r] = e.pattern.split("/*", 2), o = t.split("/").filter(Boolean);
  return o.reduce((n, a) => n + (a.startsWith(":") ? 2 : 3), o.length - (r === void 0 ? 0 : 1));
}
function ce(e) {
  const t = /* @__PURE__ */ new Map(), r = getOwner();
  return new Proxy({}, { get(o, n) {
    return t.has(n) || runWithOwner(r, () => t.set(n, createMemo(() => e()[n]))), t.get(n)();
  }, getOwnPropertyDescriptor() {
    return { enumerable: true, configurable: true };
  }, ownKeys() {
    return Reflect.ownKeys(e());
  }, has(o, n) {
    return n in e();
  } });
}
function ue(e) {
  let t = /(\/?\:[^\/]+)\?/.exec(e);
  if (!t) return [e];
  let r = e.slice(0, t.index), o = e.slice(t.index + t[0].length);
  const n = [r, r += t[1]];
  for (; t = /^(\/\:[^\/]+)\?/.exec(o); ) n.push(r += t[1]), o = o.slice(t[0].length);
  return ue(o).reduce((a, s) => [...a, ...n.map((i) => i + s)], []);
}
const Te = 100, le = createContext(), he = createContext(), Ke = () => Ie(useContext(le), "<A> and 'use' router primitives can be only used inside a Route."), Me = () => Ke().location;
function Ne(e, t = "") {
  const { component: r, preload: o, load: n, children: a, info: s } = e, i = !a || Array.isArray(a) && !a.length, h = { key: e, component: r, preload: o || n, info: s };
  return fe(e.path).reduce((c, d) => {
    for (const y of ue(d)) {
      const m = $e(t, y);
      let g = i ? m : m.split("/*", 1)[0];
      g = g.split("/").map((v) => v.startsWith(":") || v.startsWith("*") ? v : encodeURIComponent(v)).join("/"), c.push({ ...h, originalPath: d, pattern: g, matcher: We(g, !i, e.matchFilters) });
    }
    return c;
  }, []);
}
function He(e, t = 0) {
  return { routes: e, score: De(e[e.length - 1]) * 1e4 - t, matcher(r) {
    const o = [];
    for (let n = e.length - 1; n >= 0; n--) {
      const a = e[n], s = a.matcher(r);
      if (!s) return null;
      o.unshift({ ...s, route: a });
    }
    return o;
  } };
}
function fe(e) {
  return Array.isArray(e) ? e : [e];
}
function de(e, t = "", r = [], o = []) {
  const n = fe(e);
  for (let a = 0, s = n.length; a < s; a++) {
    const i = n[a];
    if (i && typeof i == "object") {
      i.hasOwnProperty("path") || (i.path = "");
      const h = Ne(i, t);
      for (const c of h) {
        r.push(c);
        const d = Array.isArray(i.children) && i.children.length === 0;
        if (i.children && !d) de(i.children, c.pattern, r, o);
        else {
          const y = He([...r], o.length);
          o.push(y);
        }
        r.pop();
      }
    }
  }
  return r.length ? o : o.sort((a, s) => s.score - a.score);
}
function B(e, t) {
  for (let r = 0, o = e.length; r < o; r++) {
    const n = e[r].matcher(t);
    if (n) return n;
  }
  return [];
}
function ze(e, t, r) {
  const o = new URL(se), n = createMemo((d) => {
    const y = e();
    try {
      return new URL(y, o);
    } catch {
      return console.error(`Invalid path ${y}`), d;
    }
  }, o, { equals: (d, y) => d.href === y.href }), a = createMemo(() => n().pathname), s = createMemo(() => n().search, true), i = createMemo(() => n().hash), h = () => "", c = on(s, () => ie(n()));
  return { get pathname() {
    return a();
  }, get search() {
    return s();
  }, get hash() {
    return i();
  }, get state() {
    return t();
  }, get key() {
    return h();
  }, query: r ? r(c) : ce(c) };
}
let x;
function Ve() {
  return x;
}
function Je(e, t, r, o = {}) {
  const { signal: [n, a], utils: s = {} } = e, i = s.parsePath || ((f) => f), h = s.renderPath || ((f) => f), c = s.beforeLeave || ae(), d = W("", o.base || "");
  if (d === void 0) throw new Error(`${d} is not a valid base path`);
  d && !n().value && a({ value: d, replace: true, scroll: false });
  const [y, m] = createSignal(false);
  let g;
  const v = (f, p) => {
    p.value === u() && p.state === b() || (g === void 0 && m(true), x = f, g = p, startTransition(() => {
      g === p && (l(g.value), w(g.state), resetErrorBoundaries(), isServer || E[1]((R) => R.filter((C) => C.pending)));
    }).finally(() => {
      g === p && batch(() => {
        x = void 0, f === "navigate" && ye(g), m(false), g = void 0;
      });
    }));
  }, [u, l] = createSignal(n().value), [b, w] = createSignal(n().state), A = ze(u, b, s.queryWrapper), L = [], E = createSignal(isServer ? ve() : []), q = createMemo(() => typeof o.transformUrl == "function" ? B(t(), o.transformUrl(A.pathname)) : B(t(), A.pathname)), z = () => {
    const f = q(), p = {};
    for (let R = 0; R < f.length; R++) Object.assign(p, f[R].params);
    return p;
  }, pe = s.paramsWrapper ? s.paramsWrapper(z, t) : ce(z), V = { pattern: d, path: () => d, outlet: () => null, resolvePath(f) {
    return W(d, f);
  } };
  return createRenderEffect(on(n, (f) => v("native", f), { defer: true })), { base: V, location: A, params: pe, isRouting: y, renderPath: h, parsePath: i, navigatorFactory: we, matches: q, beforeLeave: c, preloadRoute: be, singleFlight: o.singleFlight === void 0 ? true : o.singleFlight, submissions: E };
  function ge(f, p, R) {
    untrack(() => {
      if (typeof p == "number") {
        p && (s.go ? s.go(p) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const C = !p || p[0] === "?", { replace: I, resolve: O, scroll: $, state: U } = { replace: false, resolve: !C, scroll: true, ...R }, F = O ? f.resolvePath(p) : W(C && A.pathname || "", p);
      if (F === void 0) throw new Error(`Path '${p}' is not a routable path`);
      if (L.length >= Te) throw new Error("Too many redirects");
      const J = u();
      if (F !== J || U !== b()) if (isServer) {
        const X = getRequestEvent();
        X && (X.response = { status: 302, headers: new Headers({ Location: F }) }), a({ value: F, replace: I, scroll: $, state: U });
      } else c.confirm(F, R) && (L.push({ value: J, replace: I, scroll: $, state: b() }), v("navigate", { value: F, state: U }));
    });
  }
  function we(f) {
    return f = f || useContext(he) || V, (p, R) => ge(f, p, R);
  }
  function ye(f) {
    const p = L[0];
    p && (a({ ...f, replace: p.replace, scroll: p.scroll }), L.length = 0);
  }
  function be(f, p) {
    const R = B(t(), f.pathname), C = x;
    x = "preload";
    for (let I in R) {
      const { route: O, params: $ } = R[I];
      O.component && O.component.preload && O.component.preload();
      const { preload: U } = O;
      p && U && runWithOwner(r(), () => U({ params: $, location: { pathname: f.pathname, search: f.search, hash: f.hash, query: ie(f), state: null, key: "" }, intent: "preload" }));
    }
    x = C;
  }
  function ve() {
    const f = getRequestEvent();
    return f && f.router && f.router.submission ? [f.router.submission] : [];
  }
}
function Xe(e, t, r, o) {
  const { base: n, location: a, params: s } = e, { pattern: i, component: h, preload: c } = o().route, d = createMemo(() => o().path);
  h && h.preload && h.preload();
  const y = c ? c({ params: s, location: a, intent: x || "initial" }) : void 0;
  return { parent: t, pattern: i, path: d, outlet: () => h ? createComponent$1(h, { params: s, location: a, data: y, get children() {
    return r();
  } }) : r(), resolvePath(g) {
    return W(n.path(), g, d());
  } };
}
const me = (e) => (t) => {
  const { base: r } = t, o = children(() => t.children), n = createMemo(() => de(o(), t.base || ""));
  let a;
  const s = Je(e, n, () => a, { base: r, singleFlight: t.singleFlight, transformUrl: t.transformUrl });
  return e.create && e.create(s), createComponent(le.Provider, { value: s, get children() {
    return createComponent(Ge, { routerState: s, get root() {
      return t.root;
    }, get preload() {
      return t.rootPreload || t.rootLoad;
    }, get children() {
      return [(a = getOwner()) && null, createComponent(Qe, { routerState: s, get branches() {
        return n();
      } })];
    } });
  } });
};
function Ge(e) {
  const t = e.routerState.location, r = e.routerState.params, o = createMemo(() => e.preload && untrack(() => {
    e.preload({ params: r, location: t, intent: Ve() || "initial" });
  }));
  return createComponent(Show, { get when() {
    return e.root;
  }, keyed: true, get fallback() {
    return e.children;
  }, children: (n) => createComponent(n, { params: r, location: t, get data() {
    return o();
  }, get children() {
    return e.children;
  } }) });
}
function Qe(e) {
  if (isServer) {
    const n = getRequestEvent();
    if (n && n.router && n.router.dataOnly) {
      Ye(n, e.routerState, e.branches);
      return;
    }
    n && ((n.router || (n.router = {})).matches || (n.router.matches = e.routerState.matches().map(({ route: a, path: s, params: i }) => ({ path: a.originalPath, pattern: a.pattern, match: s, params: i, info: a.info }))));
  }
  const t = [];
  let r;
  const o = createMemo(on(e.routerState.matches, (n, a, s) => {
    let i = a && n.length === a.length;
    const h = [];
    for (let c = 0, d = n.length; c < d; c++) {
      const y = a && a[c], m = n[c];
      s && y && m.route.key === y.route.key ? h[c] = s[c] : (i = false, t[c] && t[c](), createRoot((g) => {
        t[c] = g, h[c] = Xe(e.routerState, h[c - 1] || e.routerState.base, Q(() => o()[c + 1]), () => {
          var _a;
          const v = e.routerState.matches();
          return (_a = v[c]) != null ? _a : v[0];
        });
      }));
    }
    return t.splice(n.length).forEach((c) => c()), s && i ? s : (r = h[0], h);
  }));
  return Q(() => o() && r)();
}
const Q = (e) => () => createComponent(Show, { get when() {
  return e();
}, keyed: true, children: (t) => createComponent(he.Provider, { value: t, get children() {
  return t.outlet();
} }) });
function Ye(e, t, r) {
  const o = new URL(e.request.url), n = B(r, new URL(e.router.previousUrl || e.request.url).pathname), a = B(r, o.pathname);
  for (let s = 0; s < a.length; s++) {
    (!n[s] || a[s].route !== n[s].route) && (e.router.dataOnly = true);
    const { route: i, params: h } = a[s];
    i.preload && i.preload({ params: h, location: t.location, intent: "preload" });
  }
}
function Ze([e, t], r, o) {
  return [e, o ? (n) => t(o(n)) : t];
}
function et(e) {
  let t = false;
  const r = (n) => typeof n == "string" ? { value: n } : n, o = Ze(createSignal(r(e.get()), { equals: (n, a) => n.value === a.value && n.state === a.state }), void 0, (n) => (!t && e.set(n), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), n));
  return e.init && onCleanup(e.init((n = e.get()) => {
    t = true, o[1](r(n)), t = false;
  })), me({ signal: o, create: e.create, utils: e.utils });
}
function tt(e, t, r) {
  return e.addEventListener(t, r), () => e.removeEventListener(t, r);
}
function nt(e, t) {
  const r = e && document.getElementById(e);
  r ? r.scrollIntoView() : t && window.scrollTo(0, 0);
}
function rt(e) {
  const t = new URL(e);
  return t.pathname + t.search;
}
function ot(e) {
  let t;
  const r = { value: e.url || (t = getRequestEvent()) && rt(t.request.url) || "" };
  return me({ signal: [() => r, (o) => Object.assign(r, o)] })(e);
}
const at = /* @__PURE__ */ new Map();
function st(e = true, t = false, r = "/_server", o) {
  return (n) => {
    const a = n.base.path(), s = n.navigatorFactory(n.base);
    let i, h;
    function c(u) {
      return u.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function d(u) {
      if (u.defaultPrevented || u.button !== 0 || u.metaKey || u.altKey || u.ctrlKey || u.shiftKey) return;
      const l = u.composedPath().find((q) => q instanceof Node && q.nodeName.toUpperCase() === "A");
      if (!l || t && !l.hasAttribute("link")) return;
      const b = c(l), w = b ? l.href.baseVal : l.href;
      if ((b ? l.target.baseVal : l.target) || !w && !l.hasAttribute("state")) return;
      const L = (l.getAttribute("rel") || "").split(/\s+/);
      if (l.hasAttribute("download") || L && L.includes("external")) return;
      const E = b ? new URL(w, document.baseURI) : new URL(w);
      if (!(E.origin !== window.location.origin || a && E.pathname && !E.pathname.toLowerCase().startsWith(a.toLowerCase()))) return [l, E];
    }
    function y(u) {
      const l = d(u);
      if (!l) return;
      const [b, w] = l, A = n.parsePath(w.pathname + w.search + w.hash), L = b.getAttribute("state");
      u.preventDefault(), s(A, { resolve: false, replace: b.hasAttribute("replace"), scroll: !b.hasAttribute("noscroll"), state: L ? JSON.parse(L) : void 0 });
    }
    function m(u) {
      const l = d(u);
      if (!l) return;
      const [b, w] = l;
      o && (w.pathname = o(w.pathname)), n.preloadRoute(w, b.getAttribute("preload") !== "false");
    }
    function g(u) {
      clearTimeout(i);
      const l = d(u);
      if (!l) return h = null;
      const [b, w] = l;
      h !== b && (o && (w.pathname = o(w.pathname)), i = setTimeout(() => {
        n.preloadRoute(w, b.getAttribute("preload") !== "false"), h = b;
      }, 20));
    }
    function v(u) {
      if (u.defaultPrevented) return;
      let l = u.submitter && u.submitter.hasAttribute("formaction") ? u.submitter.getAttribute("formaction") : u.target.getAttribute("action");
      if (!l) return;
      if (!l.startsWith("https://action/")) {
        const w = new URL(l, se);
        if (l = n.parsePath(w.pathname + w.search), !l.startsWith(r)) return;
      }
      if (u.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const b = at.get(l);
      if (b) {
        u.preventDefault();
        const w = new FormData(u.target, u.submitter);
        b.call({ r: n, f: u.target }, u.target.enctype === "multipart/form-data" ? w : new URLSearchParams(w));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", y), e && (document.addEventListener("mousemove", g, { passive: true }), document.addEventListener("focusin", m, { passive: true }), document.addEventListener("touchstart", m, { passive: true })), document.addEventListener("submit", v), onCleanup(() => {
      document.removeEventListener("click", y), e && (document.removeEventListener("mousemove", g), document.removeEventListener("focusin", m), document.removeEventListener("touchstart", m)), document.removeEventListener("submit", v);
    });
  };
}
function it(e) {
  if (isServer) return ot(e);
  const t = () => {
    const o = window.location.pathname.replace(/^\/+/, "/") + window.location.search, n = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: o + window.location.hash, state: n };
  }, r = ae();
  return et({ get: t, set({ value: o, replace: n, scroll: a, state: s }) {
    n ? window.history.replaceState(qe(s), "", o) : window.history.pushState(s, "", o), nt(decodeURIComponent(window.location.hash.slice(1)), a), H();
  }, init: (o) => tt(window, "popstate", _e(o, (n) => {
    if (n) return !r.confirm(n);
    {
      const a = t();
      return !r.confirm(a.value, { state: a.state });
    }
  })), create: st(e.preload, e.explicitLinks, e.actionBase, e.transformUrl), utils: { go: (o) => window.history.go(o), beforeLeave: r } })(e);
}
var ct = ["<nav", ' class="bg-sky-800"><ul class="container flex items-center p-3 text-gray-200"><li class="', '"><a href="/">Home</a></li><li class="', '"><a href="/about">About</a></li></ul></nav>'];
function ut() {
  const e = Me(), t = (r) => r == e.pathname ? "border-sky-600" : "border-transparent hover:border-sky-600";
  return ssr(ct, ssrHydrationKey(), `border-b-2 ${escape(t("/"), true)} mx-1.5 sm:mx-6`, `border-b-2 ${escape(t("/about"), true)} mx-1.5 sm:mx-6`);
}
function Rt() {
  return createComponent(it, { root: (e) => [createComponent(ut, {}), createComponent(Suspense, { get children() {
    return e.children;
  } })], get children() {
    return createComponent(qt, {});
  } });
}

export { Rt as default };
//# sourceMappingURL=app-CUykq8Vs.mjs.map
