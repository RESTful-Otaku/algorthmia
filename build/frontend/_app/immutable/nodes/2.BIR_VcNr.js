import"../chunks/DsnmJJEf.js";import{i as Ie}from"../chunks/BWnWXc6O.js";import{O as At,F as Xt,aI as Yt,M as De,G as ue,aJ as Kt,H as et,a as m,a5 as ge,J as zr,K as Sr,L as Rt,N as He,V as Ne,aK as Ar,aL as Pr,P as tt,R as Mr,aM as st,aN as ot,Q as Nr,aO as Ot,m as ye,a6 as Gt,aP as Zt,ar as Er,S as Pt,T as er,aQ as Ir,aR as ft,Y as tr,aq as Mt,aS as Tr,aT as Rr,aU as Or,aV as Gr,aW as Lr,a3 as Nt,aX as Vr,I as rr,aY as Fr,aZ as jr,a_ as Br,a$ as Lt,b0 as Wr,b1 as Dr,b2 as Hr,W as qr,f as q,b3 as Ur,b4 as ar,ad as Jr,n as ze,p as _e,b5 as nt,w as k,x as we,i as Be,B as h,D as S,C as p,an as Y,y as H,ao as Qr,b6 as Xr,l as B,v as qe,b7 as Yr,A as me,z as Ue,b as be,E as re,b8 as Ae,b9 as Et,ay as sr,o as Kr}from"../chunks/DIHAgvM1.js";import{l as ae,p as Z,s as de,i as Q,r as it,b as Zr}from"../chunks/CswuPFyP.js";import{a as Qe,s as he}from"../chunks/CpHxrJvM.js";import{a as Le,b as Je,c as or,d as rt,e as ea,f as lt,t as ta,g as ra,h as yt,i as aa,j as _t,k as nr,r as ir,p as sa,l as oa,m as Vt,n as vt,o as Ft,q as at,u as na,v as mt,w as ia,x as la,y as pt,z as da,A as ca,B as ua,C as jt,D as fa,E as va}from"../chunks/CuDkzaR-.js";function It(t,e){return e}function ma(t,e,r){for(var a=t.items,o=[],n=e.length,s=0;s<n;s++)Or(e[s].e,o,!0);var i=n>0&&o.length===0&&r!==null;if(i){var d=r.parentNode;Gr(d),d.append(r),a.clear(),$e(t,e[0].prev,e[n-1].next)}Lr(o,()=>{for(var l=0;l<n;l++){var c=e[l];i||(a.delete(c.k),$e(t,c.prev,c.next)),Mt(c.e,!i)}})}function Xe(t,e,r,a,o,n=null){var s=t,i={flags:e,items:new Map,first:null},d=(e&Yt)!==0;if(d){var l=t;s=ue?De(Kt(l)):l.appendChild(At())}ue&&et();var c=null,b=!1,_=new Map,E=ge(()=>{var v=r();return Er(v)?v:v==null?[]:Zt(v)}),f,g;function $(){pa(g,f,i,_,s,o,e,a,r),n!==null&&(f.length===0?c?Pt(c):c=tt(()=>n(s)):c!==null&&er(c,()=>{c=null}))}Xt(()=>{g??=Nt,f=m(E);var v=f.length;if(b&&v===0)return;b=v===0;let P=!1;if(ue){var R=zr(s)===Sr;R!==(v===0)&&(s=Rt(),De(s),He(!1),P=!0)}if(ue){for(var G=null,T,x=0;x<v;x++){if(Ne.nodeType===Ar&&Ne.data===Pr){s=Ne,P=!0,He(!1);break}var w=f[x],u=a(w,x);T=wt(Ne,i,G,null,w,u,x,o,e,r),i.items.set(u,T),G=T}v>0&&De(Rt())}if(ue)v===0&&n&&(c=tt(()=>n(s)));else if(Mr()){var V=new Set,L=Nr;for(x=0;x<v;x+=1){w=f[x],u=a(w,x);var j=i.items.get(u)??_.get(u);j?(e&(st|ot))!==0&&lr(j,w,x,e):(T=wt(null,i,null,null,w,u,x,o,e,r,!0),_.set(u,T)),V.add(u)}for(const[M,D]of i.items)V.has(M)||L.skipped_effects.add(D.e);L.add_callback($)}else $();P&&He(!0),m(E)}),ue&&(s=Ne)}function pa(t,e,r,a,o,n,s,i,d){var l=(s&Tr)!==0,c=(s&(st|ot))!==0,b=e.length,_=r.items,E=r.first,f=E,g,$=null,v,P=[],R=[],G,T,x,w;if(l)for(w=0;w<b;w+=1)G=e[w],T=i(G,w),x=_.get(T),x!==void 0&&(x.a?.measure(),(v??=new Set).add(x));for(w=0;w<b;w+=1){if(G=e[w],T=i(G,w),x=_.get(T),x===void 0){var u=a.get(T);if(u!==void 0){a.delete(T),_.set(T,u);var V=$?$.next:f;$e(r,$,u),$e(r,u,V),gt(u,V,o),$=u}else{var L=f?f.e.nodes_start:o;$=wt(L,r,$,$===null?r.first:$.next,G,T,w,n,s,d)}_.set(T,$),P=[],R=[],f=$.next;continue}if(c&&lr(x,G,w,s),(x.e.f&ft)!==0&&(Pt(x.e),l&&(x.a?.unfix(),(v??=new Set).delete(x))),x!==f){if(g!==void 0&&g.has(x)){if(P.length<R.length){var j=R[0],M;$=j.prev;var D=P[0],K=P[P.length-1];for(M=0;M<P.length;M+=1)gt(P[M],j,o);for(M=0;M<R.length;M+=1)g.delete(R[M]);$e(r,D.prev,K.next),$e(r,$,D),$e(r,K,j),f=j,$=K,w-=1,P=[],R=[]}else g.delete(x),gt(x,f,o),$e(r,x.prev,x.next),$e(r,x,$===null?r.first:$.next),$e(r,$,x),$=x;continue}for(P=[],R=[];f!==null&&f.k!==T;)(f.e.f&ft)===0&&(g??=new Set).add(f),R.push(f),f=f.next;if(f===null)continue;x=f}P.push(x),$=x,f=x.next}if(f!==null||g!==void 0){for(var U=g===void 0?[]:Zt(g);f!==null;)(f.e.f&ft)===0&&U.push(f),f=f.next;var I=U.length;if(I>0){var A=(s&Yt)!==0&&b===0?o:null;if(l){for(w=0;w<I;w+=1)U[w].a?.measure();for(w=0;w<I;w+=1)U[w].a?.fix()}ma(r,U,A)}}l&&tr(()=>{if(v!==void 0)for(x of v)x.a?.apply()}),t.first=r.first&&r.first.e,t.last=$&&$.e;for(var y of a.values())Mt(y.e);a.clear()}function lr(t,e,r,a){(a&st)!==0&&Ot(t.v,e),(a&ot)!==0?Ot(t.i,r):t.i=r}function wt(t,e,r,a,o,n,s,i,d,l,c){var b=(d&st)!==0,_=(d&Ir)===0,E=b?_?ye(o,!1,!1):Gt(o):o,f=(d&ot)===0?s:Gt(s),g={i:f,v:E,k:n,a:null,e:null,prev:r,next:a};try{if(t===null){var $=document.createDocumentFragment();$.append(t=At())}return g.e=tt(()=>i(t,E,f,l),ue),g.e.prev=r&&r.e,g.e.next=a&&a.e,r===null?c||(e.first=g):(r.next=g,r.e.next=g.e),a!==null&&(a.prev=g,a.e.prev=g.e),g}finally{}}function gt(t,e,r){for(var a=t.next?t.next.e.nodes_start:r,o=e?e.e.nodes_start:r,n=t.e.nodes_start;n!==null&&n!==a;){var s=Rr(n);o.before(n),n=s}}function $e(t,e,r){e===null?t.first=r:(e.next=r,e.e.next=r&&r.e),r!==null&&(r.prev=e,r.e.prev=e&&e.e)}function oe(t,e,r,a,o){ue&&et();var n=e.$$slots?.[r],s=!1;n===!0&&(n=e.children,s=!0),n===void 0||n(t,s?()=>a:a)}function ga(t,e,r,a,o,n){let s=ue;ue&&et();var i,d,l=null;ue&&Ne.nodeType===Vr&&(l=Ne,et());var c=ue?Ne:t,b;Xt(()=>{const _=e()||null;var E=Fr;_!==i&&(b&&(_===null?er(b,()=>{b=null,d=null}):_===d?Pt(b):(Mt(b),Lt(!1))),_&&_!==d&&(b=tt(()=>{if(l=ue?l:document.createElementNS(E,_),jr(l,l),a){ue&&Br(_)&&l.append(document.createComment(""));var f=ue?Kt(l):l.appendChild(At());ue&&(f===null?He(!1):De(f)),a(l,f)}Nt.nodes_end=l,c.before(l)})),i=_,i&&(d=i),Lt(!0))},rr),s&&(He(!0),De(c))}const ha=()=>performance.now(),Se={tick:t=>requestAnimationFrame(t),now:()=>ha(),tasks:new Set};function dr(){const t=Se.now();Se.tasks.forEach(e=>{e.c(t)||(Se.tasks.delete(e),e.f())}),Se.tasks.size!==0&&Se.tick(dr)}function ba(t){let e;return Se.tasks.size===0&&Se.tick(dr),{promise:new Promise(r=>{Se.tasks.add(e={c:t,f:r})}),abort(){Se.tasks.delete(e)}}}function Ye(t,e){ar(()=>{t.dispatchEvent(new CustomEvent(e))})}function xa(t){if(t==="float")return"cssFloat";if(t==="offset")return"cssOffset";if(t.startsWith("--"))return t;const e=t.split("-");return e.length===1?e[0]:e[0]+e.slice(1).map(r=>r[0].toUpperCase()+r.slice(1)).join("")}function Bt(t){const e={},r=t.split(";");for(const a of r){const[o,n]=a.split(":");if(!o||n===void 0)break;const s=xa(o.trim());e[s]=n.trim()}return e}const ya=t=>t;function cr(t,e,r,a){var o=(t&Ur)!==0,n="both",s,i=e.inert,d=e.style.overflow,l,c;function b(){return ar(()=>s??=r()(e,a?.()??{},{direction:n}))}var _={is_global:o,in(){e.inert=i,Ye(e,"introstart"),l=kt(e,b(),c,1,()=>{Ye(e,"introend"),l?.abort(),l=s=void 0,e.style.overflow=d})},out($){e.inert=!0,Ye(e,"outrostart"),c=kt(e,b(),l,0,()=>{Ye(e,"outroend"),$?.()})},stop:()=>{l?.abort(),c?.abort()}},E=Nt;if((E.transitions??=[]).push(_),Wr){var f=o;if(!f){for(var g=E.parent;g&&(g.f&rr)!==0;)for(;(g=g.parent)&&(g.f&Dr)===0;);f=!g||(g.f&Hr)!==0}f&&qr(()=>{q(()=>_.in())})}}function kt(t,e,r,a,o){var n=a===1;if(Jr(e)){var s,i=!1;return tr(()=>{if(!i){var $=e({direction:n?"in":"out"});s=kt(t,$,r,a,o)}}),{abort:()=>{i=!0,s?.abort()},deactivate:()=>s.deactivate(),reset:()=>s.reset(),t:()=>s.t()}}if(r?.deactivate(),!e?.duration)return o(),{abort:ze,deactivate:ze,reset:ze,t:()=>a};const{delay:d=0,css:l,tick:c,easing:b=ya}=e;var _=[];if(n&&r===void 0&&(c&&c(0,1),l)){var E=Bt(l(0,1));_.push(E,E)}var f=()=>1-a,g=t.animate(_,{duration:d,fill:"forwards"});return g.onfinish=()=>{g.cancel();var $=r?.t()??1-a;r?.abort();var v=a-$,P=e.duration*Math.abs(v),R=[];if(P>0){var G=!1;if(l)for(var T=Math.ceil(P/16.666666666666668),x=0;x<=T;x+=1){var w=$+v*b(x/T),u=Bt(l(w,1-w));R.push(u),G||=u.overflow==="hidden"}G&&(t.style.overflow="hidden"),f=()=>{var V=g.currentTime;return $+v*b(V/P)},c&&ba(()=>{if(g.playState!=="running")return!1;var V=f();return c(V,1-V),!0})}g=t.animate(R,{duration:P,fill:"forwards"}),g.onfinish=()=>{f=()=>a,c?.(a,1-a),o()}},{abort:()=>{g&&(g.cancel(),g.effect=null,g.onfinish=ze)},deactivate:()=>{o=ze},reset:()=>{a===0&&c?.(1,0)},t:()=>f()}}/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 * 
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 * ---
 * 
 * The MIT License (MIT) (for portions derived from Feather)
 * 
 * Copyright (c) 2013-2023 Cole Bemis
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */const _a={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};var wa=nt("<svg><!><!></svg>");function ce(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]),a=ae(r,["name","color","size","strokeWidth","absoluteStrokeWidth","iconNode"]);_e(e,!1);let o=Z(e,"name",8,void 0),n=Z(e,"color",8,"currentColor"),s=Z(e,"size",8,24),i=Z(e,"strokeWidth",8,2),d=Z(e,"absoluteStrokeWidth",8,!1),l=Z(e,"iconNode",24,()=>[]);const c=(...f)=>f.filter((g,$,v)=>!!g&&v.indexOf(g)===$).join(" ");Ie();var b=wa();Le(b,(f,g)=>({..._a,...a,width:s(),height:s(),stroke:n(),"stroke-width":f,class:g}),[()=>(Be(d()),Be(i()),Be(s()),q(()=>d()?Number(i())*24/Number(s()):i())),()=>(Be(o()),Be(r),q(()=>c("lucide-icon","lucide",o()?`lucide-${o()}`:"",r.class)))]);var _=h(b);Xe(_,1,l,It,(f,g)=>{var $=Qr(()=>Xr(m(g),2));let v=()=>m($)[0],P=()=>m($)[1];var R=Y(),G=H(R);ga(G,v,!0,(T,x)=>{Le(T,()=>({...P()}))}),k(f,R)});var E=S(_);oe(E,e,"default",{}),p(b),k(t,b),we()}function ka(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["path",{d:"m6 9 6 6 6-6"}]];ce(t,de({name:"chevron-down"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function $a(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["circle",{cx:"12",cy:"12",r:"10"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16"}]];ce(t,de({name:"circle-alert"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function Ca(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335"}],["path",{d:"m9 11 3 3L22 4"}]];ce(t,de({name:"circle-check-big"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function ur(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 16v-4"}],["path",{d:"M12 8h.01"}]];ce(t,de({name:"info"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function za(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["path",{d:"M4 12h16"}],["path",{d:"M4 18h16"}],["path",{d:"M4 6h16"}]];ce(t,de({name:"menu"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function Sa(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"}]];ce(t,de({name:"moon"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function Wt(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1"}]];ce(t,de({name:"pause"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function fr(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"}]];ce(t,de({name:"play"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function Aa(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}],["path",{d:"M3 3v5h5"}]];ce(t,de({name:"rotate-ccw"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function Dt(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["path",{d:"m21 21-4.34-4.34"}],["circle",{cx:"11",cy:"11",r:"8"}]];ce(t,de({name:"search"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function Pa(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"}],["circle",{cx:"12",cy:"12",r:"3"}]];ce(t,de({name:"settings"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function Ma(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["path",{d:"m18 14 4 4-4 4"}],["path",{d:"m18 2 4 4-4 4"}],["path",{d:"M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"}],["path",{d:"M2 6h1.972a4 4 0 0 1 3.6 2.2"}],["path",{d:"M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"}]];ce(t,de({name:"shuffle"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function Na(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["path",{d:"M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"}],["path",{d:"M3 20V4"}]];ce(t,de({name:"skip-back"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function Ea(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["path",{d:"M21 4v16"}],["path",{d:"M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"}]];ce(t,de({name:"skip-forward"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function Ia(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}]];ce(t,de({name:"square"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function Ta(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["circle",{cx:"12",cy:"12",r:"4"}],["path",{d:"M12 2v2"}],["path",{d:"M12 20v2"}],["path",{d:"m4.93 4.93 1.41 1.41"}],["path",{d:"m17.66 17.66 1.41 1.41"}],["path",{d:"M2 12h2"}],["path",{d:"M20 12h2"}],["path",{d:"m6.34 17.66-1.41 1.41"}],["path",{d:"m19.07 4.93-1.41 1.41"}]];ce(t,de({name:"sun"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function Ra(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"}],["path",{d:"M12 9v4"}],["path",{d:"M12 17h.01"}]];ce(t,de({name:"triangle-alert"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}function $t(t,e){const r=ae(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]];ce(t,de({name:"x"},()=>r,{get iconNode(){return a},children:(o,n)=>{var s=Y(),i=H(s);oe(i,e,"default",{}),k(o,s)},$$slots:{default:!0}}))}const Tt="-",Oa=t=>{const e=La(t),{conflictingClassGroups:r,conflictingClassGroupModifiers:a}=t;return{getClassGroupId:s=>{const i=s.split(Tt);return i[0]===""&&i.length!==1&&i.shift(),vr(i,e)||Ga(s)},getConflictingClassGroupIds:(s,i)=>{const d=r[s]||[];return i&&a[s]?[...d,...a[s]]:d}}},vr=(t,e)=>{if(t.length===0)return e.classGroupId;const r=t[0],a=e.nextPart.get(r),o=a?vr(t.slice(1),a):void 0;if(o)return o;if(e.validators.length===0)return;const n=t.join(Tt);return e.validators.find(({validator:s})=>s(n))?.classGroupId},Ht=/^\[(.+)\]$/,Ga=t=>{if(Ht.test(t)){const e=Ht.exec(t)[1],r=e?.substring(0,e.indexOf(":"));if(r)return"arbitrary.."+r}},La=t=>{const{theme:e,classGroups:r}=t,a={nextPart:new Map,validators:[]};for(const o in r)Ct(r[o],a,o,e);return a},Ct=(t,e,r,a)=>{t.forEach(o=>{if(typeof o=="string"){const n=o===""?e:qt(e,o);n.classGroupId=r;return}if(typeof o=="function"){if(Va(o)){Ct(o(a),e,r,a);return}e.validators.push({validator:o,classGroupId:r});return}Object.entries(o).forEach(([n,s])=>{Ct(s,qt(e,n),r,a)})})},qt=(t,e)=>{let r=t;return e.split(Tt).forEach(a=>{r.nextPart.has(a)||r.nextPart.set(a,{nextPart:new Map,validators:[]}),r=r.nextPart.get(a)}),r},Va=t=>t.isThemeGetter,Fa=t=>{if(t<1)return{get:()=>{},set:()=>{}};let e=0,r=new Map,a=new Map;const o=(n,s)=>{r.set(n,s),e++,e>t&&(e=0,a=r,r=new Map)};return{get(n){let s=r.get(n);if(s!==void 0)return s;if((s=a.get(n))!==void 0)return o(n,s),s},set(n,s){r.has(n)?r.set(n,s):o(n,s)}}},zt="!",St=":",ja=St.length,Ba=t=>{const{prefix:e,experimentalParseClassName:r}=t;let a=o=>{const n=[];let s=0,i=0,d=0,l;for(let f=0;f<o.length;f++){let g=o[f];if(s===0&&i===0){if(g===St){n.push(o.slice(d,f)),d=f+ja;continue}if(g==="/"){l=f;continue}}g==="["?s++:g==="]"?s--:g==="("?i++:g===")"&&i--}const c=n.length===0?o:o.substring(d),b=Wa(c),_=b!==c,E=l&&l>d?l-d:void 0;return{modifiers:n,hasImportantModifier:_,baseClassName:b,maybePostfixModifierPosition:E}};if(e){const o=e+St,n=a;a=s=>s.startsWith(o)?n(s.substring(o.length)):{isExternal:!0,modifiers:[],hasImportantModifier:!1,baseClassName:s,maybePostfixModifierPosition:void 0}}if(r){const o=a;a=n=>r({className:n,parseClassName:o})}return a},Wa=t=>t.endsWith(zt)?t.substring(0,t.length-1):t.startsWith(zt)?t.substring(1):t,Da=t=>{const e=Object.fromEntries(t.orderSensitiveModifiers.map(a=>[a,!0]));return a=>{if(a.length<=1)return a;const o=[];let n=[];return a.forEach(s=>{s[0]==="["||e[s]?(o.push(...n.sort(),s),n=[]):n.push(s)}),o.push(...n.sort()),o}},Ha=t=>({cache:Fa(t.cacheSize),parseClassName:Ba(t),sortModifiers:Da(t),...Oa(t)}),qa=/\s+/,Ua=(t,e)=>{const{parseClassName:r,getClassGroupId:a,getConflictingClassGroupIds:o,sortModifiers:n}=e,s=[],i=t.trim().split(qa);let d="";for(let l=i.length-1;l>=0;l-=1){const c=i[l],{isExternal:b,modifiers:_,hasImportantModifier:E,baseClassName:f,maybePostfixModifierPosition:g}=r(c);if(b){d=c+(d.length>0?" "+d:d);continue}let $=!!g,v=a($?f.substring(0,g):f);if(!v){if(!$){d=c+(d.length>0?" "+d:d);continue}if(v=a(f),!v){d=c+(d.length>0?" "+d:d);continue}$=!1}const P=n(_).join(":"),R=E?P+zt:P,G=R+v;if(s.includes(G))continue;s.push(G);const T=o(v,$);for(let x=0;x<T.length;++x){const w=T[x];s.push(R+w)}d=c+(d.length>0?" "+d:d)}return d};function Ja(){let t=0,e,r,a="";for(;t<arguments.length;)(e=arguments[t++])&&(r=mr(e))&&(a&&(a+=" "),a+=r);return a}const mr=t=>{if(typeof t=="string")return t;let e,r="";for(let a=0;a<t.length;a++)t[a]&&(e=mr(t[a]))&&(r&&(r+=" "),r+=e);return r};function Qa(t,...e){let r,a,o,n=s;function s(d){const l=e.reduce((c,b)=>b(c),t());return r=Ha(l),a=r.cache.get,o=r.cache.set,n=i,i(d)}function i(d){const l=a(d);if(l)return l;const c=Ua(d,r);return o(d,c),c}return function(){return n(Ja.apply(null,arguments))}}const se=t=>{const e=r=>r[t]||[];return e.isThemeGetter=!0,e},pr=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,gr=/^\((?:(\w[\w-]*):)?(.+)\)$/i,Xa=/^\d+\/\d+$/,Ya=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,Ka=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,Za=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,es=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,ts=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,Re=t=>Xa.test(t),F=t=>!!t&&!Number.isNaN(Number(t)),Me=t=>!!t&&Number.isInteger(Number(t)),ht=t=>t.endsWith("%")&&F(t.slice(0,-1)),Ce=t=>Ya.test(t),rs=()=>!0,as=t=>Ka.test(t)&&!Za.test(t),hr=()=>!1,ss=t=>es.test(t),os=t=>ts.test(t),ns=t=>!C(t)&&!z(t),is=t=>Ve(t,yr,hr),C=t=>pr.test(t),Ee=t=>Ve(t,_r,as),bt=t=>Ve(t,fs,F),Ut=t=>Ve(t,br,hr),ls=t=>Ve(t,xr,os),Ke=t=>Ve(t,wr,ss),z=t=>gr.test(t),We=t=>Fe(t,_r),ds=t=>Fe(t,vs),Jt=t=>Fe(t,br),cs=t=>Fe(t,yr),us=t=>Fe(t,xr),Ze=t=>Fe(t,wr,!0),Ve=(t,e,r)=>{const a=pr.exec(t);return a?a[1]?e(a[1]):r(a[2]):!1},Fe=(t,e,r=!1)=>{const a=gr.exec(t);return a?a[1]?e(a[1]):r:!1},br=t=>t==="position"||t==="percentage",xr=t=>t==="image"||t==="url",yr=t=>t==="length"||t==="size"||t==="bg-size",_r=t=>t==="length",fs=t=>t==="number",vs=t=>t==="family-name",wr=t=>t==="shadow",ms=()=>{const t=se("color"),e=se("font"),r=se("text"),a=se("font-weight"),o=se("tracking"),n=se("leading"),s=se("breakpoint"),i=se("container"),d=se("spacing"),l=se("radius"),c=se("shadow"),b=se("inset-shadow"),_=se("text-shadow"),E=se("drop-shadow"),f=se("blur"),g=se("perspective"),$=se("aspect"),v=se("ease"),P=se("animate"),R=()=>["auto","avoid","all","avoid-page","page","left","right","column"],G=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],T=()=>[...G(),z,C],x=()=>["auto","hidden","clip","visible","scroll"],w=()=>["auto","contain","none"],u=()=>[z,C,d],V=()=>[Re,"full","auto",...u()],L=()=>[Me,"none","subgrid",z,C],j=()=>["auto",{span:["full",Me,z,C]},Me,z,C],M=()=>[Me,"auto",z,C],D=()=>["auto","min","max","fr",z,C],K=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],U=()=>["start","end","center","stretch","center-safe","end-safe"],I=()=>["auto",...u()],A=()=>[Re,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...u()],y=()=>[t,z,C],xe=()=>[...G(),Jt,Ut,{position:[z,C]}],ne=()=>["no-repeat",{repeat:["","x","y","space","round"]}],ie=()=>["auto","cover","contain",cs,is,{size:[z,C]}],O=()=>[ht,We,Ee],N=()=>["","none","full",l,z,C],W=()=>["",F,We,Ee],X=()=>["solid","dashed","dotted","double"],ee=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],J=()=>[F,ht,Jt,Ut],te=()=>["","none",f,z,C],fe=()=>["none",F,z,C],le=()=>["none",F,z,C],pe=()=>[F,z,C],ke=()=>[Re,"full",...u()];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[Ce],breakpoint:[Ce],color:[rs],container:[Ce],"drop-shadow":[Ce],ease:["in","out","in-out"],font:[ns],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[Ce],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[Ce],shadow:[Ce],spacing:["px",F],text:[Ce],"text-shadow":[Ce],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",Re,C,z,$]}],container:["container"],columns:[{columns:[F,C,z,i]}],"break-after":[{"break-after":R()}],"break-before":[{"break-before":R()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:T()}],overflow:[{overflow:x()}],"overflow-x":[{"overflow-x":x()}],"overflow-y":[{"overflow-y":x()}],overscroll:[{overscroll:w()}],"overscroll-x":[{"overscroll-x":w()}],"overscroll-y":[{"overscroll-y":w()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:V()}],"inset-x":[{"inset-x":V()}],"inset-y":[{"inset-y":V()}],start:[{start:V()}],end:[{end:V()}],top:[{top:V()}],right:[{right:V()}],bottom:[{bottom:V()}],left:[{left:V()}],visibility:["visible","invisible","collapse"],z:[{z:[Me,"auto",z,C]}],basis:[{basis:[Re,"full","auto",i,...u()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[F,Re,"auto","initial","none",C]}],grow:[{grow:["",F,z,C]}],shrink:[{shrink:["",F,z,C]}],order:[{order:[Me,"first","last","none",z,C]}],"grid-cols":[{"grid-cols":L()}],"col-start-end":[{col:j()}],"col-start":[{"col-start":M()}],"col-end":[{"col-end":M()}],"grid-rows":[{"grid-rows":L()}],"row-start-end":[{row:j()}],"row-start":[{"row-start":M()}],"row-end":[{"row-end":M()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":D()}],"auto-rows":[{"auto-rows":D()}],gap:[{gap:u()}],"gap-x":[{"gap-x":u()}],"gap-y":[{"gap-y":u()}],"justify-content":[{justify:[...K(),"normal"]}],"justify-items":[{"justify-items":[...U(),"normal"]}],"justify-self":[{"justify-self":["auto",...U()]}],"align-content":[{content:["normal",...K()]}],"align-items":[{items:[...U(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...U(),{baseline:["","last"]}]}],"place-content":[{"place-content":K()}],"place-items":[{"place-items":[...U(),"baseline"]}],"place-self":[{"place-self":["auto",...U()]}],p:[{p:u()}],px:[{px:u()}],py:[{py:u()}],ps:[{ps:u()}],pe:[{pe:u()}],pt:[{pt:u()}],pr:[{pr:u()}],pb:[{pb:u()}],pl:[{pl:u()}],m:[{m:I()}],mx:[{mx:I()}],my:[{my:I()}],ms:[{ms:I()}],me:[{me:I()}],mt:[{mt:I()}],mr:[{mr:I()}],mb:[{mb:I()}],ml:[{ml:I()}],"space-x":[{"space-x":u()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":u()}],"space-y-reverse":["space-y-reverse"],size:[{size:A()}],w:[{w:[i,"screen",...A()]}],"min-w":[{"min-w":[i,"screen","none",...A()]}],"max-w":[{"max-w":[i,"screen","none","prose",{screen:[s]},...A()]}],h:[{h:["screen","lh",...A()]}],"min-h":[{"min-h":["screen","lh","none",...A()]}],"max-h":[{"max-h":["screen","lh",...A()]}],"font-size":[{text:["base",r,We,Ee]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[a,z,bt]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",ht,C]}],"font-family":[{font:[ds,C,e]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[o,z,C]}],"line-clamp":[{"line-clamp":[F,"none",z,bt]}],leading:[{leading:[n,...u()]}],"list-image":[{"list-image":["none",z,C]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",z,C]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:y()}],"text-color":[{text:y()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...X(),"wavy"]}],"text-decoration-thickness":[{decoration:[F,"from-font","auto",z,Ee]}],"text-decoration-color":[{decoration:y()}],"underline-offset":[{"underline-offset":[F,"auto",z,C]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:u()}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",z,C]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",z,C]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:xe()}],"bg-repeat":[{bg:ne()}],"bg-size":[{bg:ie()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},Me,z,C],radial:["",z,C],conic:[Me,z,C]},us,ls]}],"bg-color":[{bg:y()}],"gradient-from-pos":[{from:O()}],"gradient-via-pos":[{via:O()}],"gradient-to-pos":[{to:O()}],"gradient-from":[{from:y()}],"gradient-via":[{via:y()}],"gradient-to":[{to:y()}],rounded:[{rounded:N()}],"rounded-s":[{"rounded-s":N()}],"rounded-e":[{"rounded-e":N()}],"rounded-t":[{"rounded-t":N()}],"rounded-r":[{"rounded-r":N()}],"rounded-b":[{"rounded-b":N()}],"rounded-l":[{"rounded-l":N()}],"rounded-ss":[{"rounded-ss":N()}],"rounded-se":[{"rounded-se":N()}],"rounded-ee":[{"rounded-ee":N()}],"rounded-es":[{"rounded-es":N()}],"rounded-tl":[{"rounded-tl":N()}],"rounded-tr":[{"rounded-tr":N()}],"rounded-br":[{"rounded-br":N()}],"rounded-bl":[{"rounded-bl":N()}],"border-w":[{border:W()}],"border-w-x":[{"border-x":W()}],"border-w-y":[{"border-y":W()}],"border-w-s":[{"border-s":W()}],"border-w-e":[{"border-e":W()}],"border-w-t":[{"border-t":W()}],"border-w-r":[{"border-r":W()}],"border-w-b":[{"border-b":W()}],"border-w-l":[{"border-l":W()}],"divide-x":[{"divide-x":W()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":W()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...X(),"hidden","none"]}],"divide-style":[{divide:[...X(),"hidden","none"]}],"border-color":[{border:y()}],"border-color-x":[{"border-x":y()}],"border-color-y":[{"border-y":y()}],"border-color-s":[{"border-s":y()}],"border-color-e":[{"border-e":y()}],"border-color-t":[{"border-t":y()}],"border-color-r":[{"border-r":y()}],"border-color-b":[{"border-b":y()}],"border-color-l":[{"border-l":y()}],"divide-color":[{divide:y()}],"outline-style":[{outline:[...X(),"none","hidden"]}],"outline-offset":[{"outline-offset":[F,z,C]}],"outline-w":[{outline:["",F,We,Ee]}],"outline-color":[{outline:y()}],shadow:[{shadow:["","none",c,Ze,Ke]}],"shadow-color":[{shadow:y()}],"inset-shadow":[{"inset-shadow":["none",b,Ze,Ke]}],"inset-shadow-color":[{"inset-shadow":y()}],"ring-w":[{ring:W()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:y()}],"ring-offset-w":[{"ring-offset":[F,Ee]}],"ring-offset-color":[{"ring-offset":y()}],"inset-ring-w":[{"inset-ring":W()}],"inset-ring-color":[{"inset-ring":y()}],"text-shadow":[{"text-shadow":["none",_,Ze,Ke]}],"text-shadow-color":[{"text-shadow":y()}],opacity:[{opacity:[F,z,C]}],"mix-blend":[{"mix-blend":[...ee(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":ee()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[F]}],"mask-image-linear-from-pos":[{"mask-linear-from":J()}],"mask-image-linear-to-pos":[{"mask-linear-to":J()}],"mask-image-linear-from-color":[{"mask-linear-from":y()}],"mask-image-linear-to-color":[{"mask-linear-to":y()}],"mask-image-t-from-pos":[{"mask-t-from":J()}],"mask-image-t-to-pos":[{"mask-t-to":J()}],"mask-image-t-from-color":[{"mask-t-from":y()}],"mask-image-t-to-color":[{"mask-t-to":y()}],"mask-image-r-from-pos":[{"mask-r-from":J()}],"mask-image-r-to-pos":[{"mask-r-to":J()}],"mask-image-r-from-color":[{"mask-r-from":y()}],"mask-image-r-to-color":[{"mask-r-to":y()}],"mask-image-b-from-pos":[{"mask-b-from":J()}],"mask-image-b-to-pos":[{"mask-b-to":J()}],"mask-image-b-from-color":[{"mask-b-from":y()}],"mask-image-b-to-color":[{"mask-b-to":y()}],"mask-image-l-from-pos":[{"mask-l-from":J()}],"mask-image-l-to-pos":[{"mask-l-to":J()}],"mask-image-l-from-color":[{"mask-l-from":y()}],"mask-image-l-to-color":[{"mask-l-to":y()}],"mask-image-x-from-pos":[{"mask-x-from":J()}],"mask-image-x-to-pos":[{"mask-x-to":J()}],"mask-image-x-from-color":[{"mask-x-from":y()}],"mask-image-x-to-color":[{"mask-x-to":y()}],"mask-image-y-from-pos":[{"mask-y-from":J()}],"mask-image-y-to-pos":[{"mask-y-to":J()}],"mask-image-y-from-color":[{"mask-y-from":y()}],"mask-image-y-to-color":[{"mask-y-to":y()}],"mask-image-radial":[{"mask-radial":[z,C]}],"mask-image-radial-from-pos":[{"mask-radial-from":J()}],"mask-image-radial-to-pos":[{"mask-radial-to":J()}],"mask-image-radial-from-color":[{"mask-radial-from":y()}],"mask-image-radial-to-color":[{"mask-radial-to":y()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":G()}],"mask-image-conic-pos":[{"mask-conic":[F]}],"mask-image-conic-from-pos":[{"mask-conic-from":J()}],"mask-image-conic-to-pos":[{"mask-conic-to":J()}],"mask-image-conic-from-color":[{"mask-conic-from":y()}],"mask-image-conic-to-color":[{"mask-conic-to":y()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:xe()}],"mask-repeat":[{mask:ne()}],"mask-size":[{mask:ie()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",z,C]}],filter:[{filter:["","none",z,C]}],blur:[{blur:te()}],brightness:[{brightness:[F,z,C]}],contrast:[{contrast:[F,z,C]}],"drop-shadow":[{"drop-shadow":["","none",E,Ze,Ke]}],"drop-shadow-color":[{"drop-shadow":y()}],grayscale:[{grayscale:["",F,z,C]}],"hue-rotate":[{"hue-rotate":[F,z,C]}],invert:[{invert:["",F,z,C]}],saturate:[{saturate:[F,z,C]}],sepia:[{sepia:["",F,z,C]}],"backdrop-filter":[{"backdrop-filter":["","none",z,C]}],"backdrop-blur":[{"backdrop-blur":te()}],"backdrop-brightness":[{"backdrop-brightness":[F,z,C]}],"backdrop-contrast":[{"backdrop-contrast":[F,z,C]}],"backdrop-grayscale":[{"backdrop-grayscale":["",F,z,C]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[F,z,C]}],"backdrop-invert":[{"backdrop-invert":["",F,z,C]}],"backdrop-opacity":[{"backdrop-opacity":[F,z,C]}],"backdrop-saturate":[{"backdrop-saturate":[F,z,C]}],"backdrop-sepia":[{"backdrop-sepia":["",F,z,C]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":u()}],"border-spacing-x":[{"border-spacing-x":u()}],"border-spacing-y":[{"border-spacing-y":u()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",z,C]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[F,"initial",z,C]}],ease:[{ease:["linear","initial",v,z,C]}],delay:[{delay:[F,z,C]}],animate:[{animate:["none",P,z,C]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[g,z,C]}],"perspective-origin":[{"perspective-origin":T()}],rotate:[{rotate:fe()}],"rotate-x":[{"rotate-x":fe()}],"rotate-y":[{"rotate-y":fe()}],"rotate-z":[{"rotate-z":fe()}],scale:[{scale:le()}],"scale-x":[{"scale-x":le()}],"scale-y":[{"scale-y":le()}],"scale-z":[{"scale-z":le()}],"scale-3d":["scale-3d"],skew:[{skew:pe()}],"skew-x":[{"skew-x":pe()}],"skew-y":[{"skew-y":pe()}],transform:[{transform:[z,C,"","none","gpu","cpu"]}],"transform-origin":[{origin:T()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:ke()}],"translate-x":[{"translate-x":ke()}],"translate-y":[{"translate-y":ke()}],"translate-z":[{"translate-z":ke()}],"translate-none":["translate-none"],accent:[{accent:y()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:y()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",z,C]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":u()}],"scroll-mx":[{"scroll-mx":u()}],"scroll-my":[{"scroll-my":u()}],"scroll-ms":[{"scroll-ms":u()}],"scroll-me":[{"scroll-me":u()}],"scroll-mt":[{"scroll-mt":u()}],"scroll-mr":[{"scroll-mr":u()}],"scroll-mb":[{"scroll-mb":u()}],"scroll-ml":[{"scroll-ml":u()}],"scroll-p":[{"scroll-p":u()}],"scroll-px":[{"scroll-px":u()}],"scroll-py":[{"scroll-py":u()}],"scroll-ps":[{"scroll-ps":u()}],"scroll-pe":[{"scroll-pe":u()}],"scroll-pt":[{"scroll-pt":u()}],"scroll-pr":[{"scroll-pr":u()}],"scroll-pb":[{"scroll-pb":u()}],"scroll-pl":[{"scroll-pl":u()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",z,C]}],fill:[{fill:["none",...y()]}],"stroke-w":[{stroke:[F,We,Ee,bt]}],stroke:[{stroke:["none",...y()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}},dt=Qa(ms);var ps=nt('<svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'),gs=B("<button><!> <!></button>");function ve(t,e){_e(e,!0);let r=Z(e,"variant",3,"primary"),a=Z(e,"size",3,"md"),o=Z(e,"disabled",3,!1),n=Z(e,"loading",3,!1),s=Z(e,"class",3,""),i=it(e,["$$slots","$$events","$$legacy","variant","size","disabled","loading","onClick","class","children"]);const d="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed btn-hover",l={primary:"bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md",secondary:"bg-secondary-100 hover:bg-secondary-200 text-secondary-900 dark:bg-secondary-700 dark:hover:bg-secondary-600 dark:text-secondary-100",outline:"border border-secondary-300 hover:bg-secondary-50 text-secondary-700 dark:border-secondary-600 dark:hover:bg-secondary-800 dark:text-secondary-300",ghost:"hover:bg-secondary-100 text-secondary-700 dark:hover:bg-secondary-800 dark:text-secondary-300",danger:"bg-error-600 hover:bg-error-700 text-white shadow-sm hover:shadow-md"},c={sm:"px-3 py-1.5 text-sm",md:"px-4 py-2 text-sm",lg:"px-6 py-3 text-base"},b=dt(d,l[r()],c[a()],s());function _(){!o()&&!n()&&e.onClick&&e.onClick()}var E=gs();Le(E,()=>({class:b,disabled:o(),onclick:_,...i}));var f=h(E);{var g=v=>{var P=ps();k(v,P)};Q(f,v=>{n()&&v(g)})}var $=S(f,2);qe($,()=>e.children??ze),p(E),k(t,E),we()}function hs(t){const e=t-1;return e*e*e+1}function kr(t,{delay:e=0,duration:r=400,easing:a=hs,axis:o="y"}={}){const n=getComputedStyle(t),s=+n.opacity,i=o==="y"?"height":"width",d=parseFloat(n[i]),l=o==="y"?["top","bottom"]:["left","right"],c=l.map(v=>`${v[0].toUpperCase()}${v.slice(1)}`),b=parseFloat(n[`padding${c[0]}`]),_=parseFloat(n[`padding${c[1]}`]),E=parseFloat(n[`margin${c[0]}`]),f=parseFloat(n[`margin${c[1]}`]),g=parseFloat(n[`border${c[0]}Width`]),$=parseFloat(n[`border${c[1]}Width`]);return{delay:e,duration:r,easing:a,css:v=>`overflow: hidden;opacity: ${Math.min(v*20,1)*s};${i}: ${v*d}px;padding-${l[0]}: ${v*b}px;padding-${l[1]}: ${v*_}px;margin-${l[0]}: ${v*E}px;margin-${l[1]}: ${v*f}px;border-${l[0]}-width: ${v*g}px;border-${l[1]}-width: ${v*$}px;min-${i}: 0`}}var bs=B("<div><!></div>"),xs=B("<div><!></div> <!>",1);function ys(t,e){_e(e,!0);let r=Z(e,"isOpen",7,!1),a=Z(e,"class",3,"");const o=Yr();function n(){r(!r()),o("toggle",{isOpen:r()})}var s=xs(),i=H(s),d=h(i);qe(d,()=>e.children??ze,()=>({isOpen:r(),toggle:n})),p(i);var l=S(i,2);{var c=b=>{var _=bs(),E=h(_);qe(E,()=>e.children??ze,()=>({isOpen:r(),toggle:n})),p(_),cr(3,_,()=>kr,()=>({duration:300})),k(b,_)};Q(l,b=>{r()&&b(c)})}me(()=>Je(i,1,or(a()))),k(t,s),we()}var _s=B('<div class="flex-1 max-w-md mx-6"><div class="flex items-center space-x-2"><h2 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100"> </h2> <!></div> <div class="flex items-center space-x-4 text-sm text-secondary-600 dark:text-secondary-400"><span><strong>Time:</strong> </span> <span><strong>Space:</strong> </span></div></div>'),ws=B('<div class="mt-4 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700"><p class="text-sm text-secondary-700 dark:text-secondary-300 leading-relaxed"> </p></div>'),ks=B('<header class="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 px-6 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><!> <div class="flex items-center space-x-3"><h1 class="text-2xl font-bold text-primary-600 dark:text-primary-400">Algorithm Visualizer</h1> <span class="text-sm text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">v1.0.0</span></div></div> <!> <div class="flex items-center space-x-2"><!></div></div> <!></header>');function $s(t,e){_e(e,!1);const r=()=>he(lt,"$selectedAlgorithm",o),a=()=>he(ta,"$theme",o),[o,n]=Qe();let s=ye(!1);Ie();var i=ks(),d=h(i),l=h(d),c=h(l);ve(c,{variant:"ghost",size:"sm",get onClick(){return rt},class:"lg:hidden",children:(v,P)=>{za(v,{class:"w-5 h-5"})},$$slots:{default:!0}}),Ue(2),p(l);var b=S(l,2);{var _=v=>{var P=_s(),R=h(P),G=h(R),T=h(G,!0);p(G);var x=S(G,2);ve(x,{variant:"ghost",size:"sm",onClick:()=>be(s,!m(s)),children:(M,D)=>{ur(M,{class:"w-4 h-4"})},$$slots:{default:!0}}),p(R);var w=S(R,2),u=h(w),V=S(h(u));p(u);var L=S(u,2),j=S(h(L));p(L),p(w),p(P),me(()=>{re(T,r().name),re(V,` ${r().time_complexity??""}`),re(j,` ${r().space_complexity??""}`)}),k(v,P)};Q(b,v=>{r()&&v(_)})}var E=S(b,2),f=h(E);ve(f,{variant:"ghost",size:"sm",get onClick(){return ea},class:"p-2",children:(v,P)=>{var R=Y(),G=H(R);{var T=w=>{Sa(w,{class:"w-5 h-5"})},x=w=>{Ta(w,{class:"w-5 h-5"})};Q(G,w=>{a()==="light"?w(T):w(x,!1)})}k(v,R)},$$slots:{default:!0}}),p(E),p(d);var g=S(d,2);{var $=v=>{ys(v,{get isOpen(){return m(s)},children:(R,G)=>{let T=()=>G?.().isOpen;var x=Y(),w=H(x);{var u=V=>{var L=ws(),j=h(L),M=h(j,!0);p(j),p(L),me(()=>re(M,r().description)),k(V,L)};Q(w,V=>{T()&&V(u)})}k(R,x)},$$slots:{default:!0}})};Q(g,v=>{r()&&m(s)&&v($)})}p(i),k(t,i),we(),n()}var Cs=B('<div class="text-sm text-secondary-600 dark:text-secondary-400"> </div>'),zs=B('<div class="flex items-center justify-center h-full"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div> <p class="text-secondary-600 dark:text-secondary-400">Loading...</p></div></div>'),Ss=B('<div class="flex items-center justify-center h-full"><div class="text-center"><div class="w-16 h-16 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></div> <h4 class="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">No Algorithm Selected</h4> <p class="text-secondary-600 dark:text-secondary-400">Select an algorithm from the side panel to start visualizing</p></div></div>'),As=B('<div class="flex items-center justify-center h-full"><div class="text-center"><div class="animate-pulse w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div> <h4 class="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">Ready to Visualize</h4> <p class="text-secondary-600 dark:text-secondary-400">Click "Generate" to create data and start the algorithm</p></div></div>'),Ps=B('<div class="flex flex-col items-center space-y-2"><div role="button" tabindex="0"><span class="text-xs font-medium text-secondary-700 dark:text-secondary-300"> </span></div> <span class="text-xs text-secondary-500 dark:text-secondary-400 font-mono"></span></div>'),Ms=B('<div class="h-full flex items-end justify-center space-x-1 p-4"></div>'),Ns=B('<div class="p-4 bg-secondary-50 dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-700"><div class="text-sm text-secondary-700 dark:text-secondary-300"><strong> </strong> </div></div>'),Es=B('<div class="h-full bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 shadow-lg overflow-hidden"><div class="p-4 border-b border-secondary-200 dark:border-secondary-700"><div class="flex items-center justify-between"><h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Visualization</h3> <!></div></div> <div class="flex-1 p-6 h-full"><!></div> <!></div>');function Is(t,e){_e(e,!1);const r=()=>he(ra,"$currentStep",i),a=()=>he(lt,"$selectedAlgorithm",i),o=()=>he(yt,"$execution",i),n=()=>he(_t,"$controlState",i),s=()=>he(aa,"$isLoading",i),[i,d]=Qe(),l=ye(),c=ye(),b=ye();let _=ye();function E(){if(!a())return;Array.from({length:20},()=>Math.floor(Math.random()*100)+1)}function f(M){const D="grid-cell",K=m(c).includes(M)?"highlighted":"",U=g(r()?.action,M);return`${D} ${K} ${U}`.trim()}function g(M,D){if(!M||!m(c).includes(D))return"";switch(M){case"compare":return"comparing";case"swap":case"swap_complete":return"swapping";case"complete":return"sorted";default:return""}}function $(M){const D=Math.max(...m(l),1),K=M/D*100;return`${Math.max(K,10)}%`}Ae(()=>r(),()=>{be(l,r()?.data||[])}),Ae(()=>r(),()=>{be(c,r()?.highlights||[])}),Ae(()=>r(),()=>{be(b,r()?.metadata||{})}),Ae(()=>(a(),o()),()=>{a()&&!o()&&E()}),Et(),Ie();var v=Es(),P=h(v),R=h(P),G=S(h(R),2);{var T=M=>{var D=Cs(),K=h(D);p(D),me(()=>re(K,`Step ${n(),q(()=>n().currentStep+1)??""} of ${n(),q(()=>n().totalSteps)??""}`)),k(M,D)};Q(G,M=>{a()&&M(T)})}p(R),p(P);var x=S(P,2),w=h(x);{var u=M=>{var D=zs();k(M,D)},V=M=>{var D=Y(),K=H(D);{var U=A=>{var y=Ss();k(A,y)},I=A=>{var y=Y(),xe=H(y);{var ne=O=>{var N=As();k(O,N)},ie=O=>{var N=Ms();Xe(N,5,()=>m(l),It,(W,X,ee)=>{var J=Ps(),te=h(J),fe=h(te),le=h(fe,!0);p(fe),p(te);var pe=S(te,2);pe.textContent=ee,p(J),me((ke,Te)=>{Je(te,1,ke),nr(te,`height: ${Te??""}; min-height: 20px; width: 40px;`),re(le,m(X))},[()=>or(q(()=>f(ee))),()=>(m(X),q(()=>$(m(X))))]),k(W,J)}),p(N),Zr(N,W=>be(_,W),()=>m(_)),k(O,N)};Q(xe,O=>{m(l),q(()=>m(l).length===0)?O(ne):O(ie,!1)},!0)}k(A,y)};Q(K,A=>{a()?A(I,!1):A(U)},!0)}k(M,D)};Q(w,M=>{s()?M(u):M(V,!1)})}p(x);var L=S(x,2);{var j=M=>{var D=Ns(),K=h(D),U=h(K),I=h(U);p(U);var A=S(U);p(K),p(D),me(()=>{re(I,`Step ${r(),q(()=>r().step_number+1)??""}:`),re(A,` ${r(),q(()=>r().metadata.description)??""}`)}),k(M,D)};Q(L,M=>{r(),q(()=>r()&&r().metadata.description)&&M(j)})}p(v),k(t,v),we(),d()}var Ts=B("<input/>");function Qt(t,e){_e(e,!0);let r=Z(e,"step",3,1),a=Z(e,"disabled",3,!1),o=Z(e,"class",3,""),n=it(e,["$$slots","$$events","$$legacy","min","max","value","step","disabled","onChange","class"]);const i=dt("w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer focus-ring disabled:opacity-50 disabled:cursor-not-allowed",o());function d(c){const b=c.target,_=parseInt(b.value);e.onChange&&e.onChange(_)}var l=Ts();ir(l),Le(l,()=>({type:"range",min:e.min,max:e.max,step:r(),disabled:a(),class:i,value:e.value,oninput:d,...n}),void 0,void 0,"svelte-1r58cnh"),k(t,l),we()}const Rs="http://localhost:8080/api/v1";class Ge extends Error{constructor(e,r,a){super(e),this.status=r,this.response=a,this.name="APIError"}}async function Oe(t,e={}){const r=`${Rs}${t}`,o={...{headers:{"Content-Type":"application/json"}},...e};try{const n=await fetch(r,o),s=await n.json();if(!n.ok)throw new Ge(s.error||`HTTP ${n.status}: ${n.statusText}`,n.status,s);if(!s.success)throw new Ge(s.error||"Request failed",n.status,s);return s.data}catch(n){throw n instanceof Ge?n:new Ge(n instanceof Error?n.message:"Network error",0)}}const $r={async healthCheck(){return Oe("/health")},async getAlgorithms(){return Oe("/algorithms")},async getAlgorithmsByType(t){return Oe(`/algorithms/type/${t}`)},async getAlgorithm(t){return Oe(`/algorithms/${t}`)},async getAlgorithmConfig(t){return Oe(`/algorithms/${t}/config`)},async executeAlgorithm(t,e){return Oe(`/algorithms/${t}/execute`,{method:"POST",body:JSON.stringify(e)})}};var Os=nt('<svg class="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'),Gs=nt("<!> ",1),Ls=B('<div class="flex-1 max-w-md mx-6"><div class="flex items-center space-x-3"><span class="text-sm text-secondary-600 dark:text-secondary-400 font-mono"> </span> <!> <span class="text-sm text-secondary-600 dark:text-secondary-400 font-mono"> </span></div></div>'),Vs=B("<!> Generate",1),Fs=B("<!> Reset",1),js=B('<div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 shadow-lg p-6"><div class="flex items-center justify-between"><div class="flex items-center space-x-3"><!> <!> <!> <div class="flex items-center space-x-2 ml-4"><!> <!></div></div> <!> <div class="flex items-center space-x-3"><div class="flex items-center space-x-2"><span class="text-sm text-secondary-600 dark:text-secondary-400">Speed:</span> <!></div> <!> <!></div></div></div>');function Bs(t,e){_e(e,!1);const r=()=>he(lt,"$selectedAlgorithm",n),a=()=>he(_t,"$controlState",n),o=()=>he(yt,"$execution",n),[n,s]=Qe(),i=ye(),d=ye(),l=ye(),c=ye();let b=ye(!1);async function _(){r()&&(o()?sa():await v())}async function E(){oa()}function f(){Vt()}async function g(){r()&&await v()}async function $(){Vt(),await v()}async function v(){if(!(!r()||m(b)))try{be(b,!0),Ft(!0);const O={array_size:20,speed:a().speed},N=await $r.executeAlgorithm(r().id,O),W={id:crypto.randomUUID(),algorithm_id:r().id,steps:N,current_step:0,is_running:!1,is_paused:!1,is_complete:!1,start_time:new Date().toISOString()};yt.set(W),_t.update(X=>({...X,totalSteps:N.length,currentStep:0})),at({type:"success",title:"Algorithm Ready",message:`${r().name} generated ${N.length} steps`,duration:3e3})}catch(O){const N=O instanceof Ge?O.message:"Failed to execute algorithm";at({type:"error",title:"Execution Error",message:N,duration:5e3})}finally{be(b,!1),Ft(!1)}}function P(O){vt(O)}function R(O){na(O)}function G(){const O=Math.max(0,a().currentStep-1);vt(O)}function T(){const O=Math.min(a().totalSteps-1,a().currentStep+1);vt(O)}Ae(()=>(r(),a(),m(b)),()=>{be(i,r()&&!a().isPlaying&&!m(b))}),Ae(()=>(a(),m(b)),()=>{be(d,a().isPlaying&&!m(b))}),Ae(()=>(a(),o()),()=>{be(l,a().isPlaying||a().isPaused||o())}),Ae(()=>(r(),m(b)),()=>{be(c,r()&&!m(b))}),Et(),Ie();var x=js(),w=h(x),u=h(w),V=h(u);{let O=ge(()=>!m(i));ve(V,{variant:"primary",size:"lg",get disabled(){return m(O)},get loading(){return m(b)},onClick:_,children:(N,W)=>{var X=Gs(),ee=H(X);{var J=le=>{var pe=Os();k(le,pe)},te=le=>{var pe=Y(),ke=H(pe);{var Te=Pe=>{Wt(Pe,{class:"w-5 h-5"})},ct=Pe=>{fr(Pe,{class:"w-5 h-5"})};Q(ke,Pe=>{a(),q(()=>a().isPlaying)?Pe(Te):Pe(ct,!1)},!0)}k(le,pe)};Q(ee,le=>{m(b)?le(J):le(te,!1)})}var fe=S(ee,1,!0);me(()=>re(fe,(a(),q(()=>a().isPlaying?"Pause":"Play")))),k(N,X)},$$slots:{default:!0}})}var L=S(V,2);{let O=ge(()=>!m(d));ve(L,{variant:"outline",size:"lg",get disabled(){return m(O)},onClick:E,children:(N,W)=>{Wt(N,{class:"w-5 h-5"})},$$slots:{default:!0}})}var j=S(L,2);{let O=ge(()=>!m(l));ve(j,{variant:"outline",size:"lg",get disabled(){return m(O)},onClick:f,children:(N,W)=>{Ia(N,{class:"w-5 h-5"})},$$slots:{default:!0}})}var M=S(j,2),D=h(M);{let O=ge(()=>(a(),q(()=>a().currentStep===0)));ve(D,{variant:"ghost",size:"sm",get disabled(){return m(O)},onClick:G,children:(N,W)=>{Na(N,{class:"w-4 h-4"})},$$slots:{default:!0}})}var K=S(D,2);{let O=ge(()=>(a(),q(()=>a().currentStep>=a().totalSteps-1)));ve(K,{variant:"ghost",size:"sm",get disabled(){return m(O)},onClick:T,children:(N,W)=>{Ea(N,{class:"w-4 h-4"})},$$slots:{default:!0}})}p(M),p(u);var U=S(u,2);{var I=O=>{var N=Ls(),W=h(N),X=h(W),ee=h(X,!0);p(X);var J=S(X,2);{let le=ge(()=>(a(),q(()=>a().totalSteps-1)));Qt(J,{min:0,get max(){return m(le)},get value(){return a(),q(()=>a().currentStep)},onChange:P,class:"flex-1"})}var te=S(J,2),fe=h(te,!0);p(te),p(W),p(N),me(()=>{re(ee,(a(),q(()=>a().currentStep+1))),re(fe,(a(),q(()=>a().totalSteps)))}),k(O,N)};Q(U,O=>{o(),a(),q(()=>o()&&a().totalSteps>0)&&O(I)})}var A=S(U,2),y=h(A),xe=S(h(y),2);Qt(xe,{min:1,max:10,get value(){return a(),q(()=>a().speed)},onChange:R,class:"w-20"}),p(y);var ne=S(y,2);{let O=ge(()=>!m(c));ve(ne,{variant:"outline",size:"lg",get disabled(){return m(O)},get loading(){return m(b)},onClick:g,children:(N,W)=>{var X=Vs(),ee=H(X);Ma(ee,{class:"w-5 h-5"}),Ue(),k(N,X)},$$slots:{default:!0}})}var ie=S(ne,2);{let O=ge(()=>!o()||m(b));ve(ie,{variant:"outline",size:"lg",get disabled(){return m(O)},onClick:$,children:(N,W)=>{var X=Fs(),ee=H(X);Aa(ee,{class:"w-5 h-5"}),Ue(),k(N,X)},$$slots:{default:!0}})}p(A),p(w),p(x),k(t,x),we(),s()}var Ws=B("<input/>");function xt(t,e){_e(e,!0);let r=Z(e,"type",3,"text"),a=Z(e,"placeholder",3,""),o=Z(e,"value",3,""),n=Z(e,"disabled",3,!1),s=Z(e,"required",3,!1),i=Z(e,"class",3,""),d=it(e,["$$slots","$$events","$$legacy","type","placeholder","value","disabled","required","min","max","step","onChange","class"]);const c=dt("block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder-secondary-500 dark:placeholder-secondary-400 focus-ring disabled:opacity-50 disabled:cursor-not-allowed",i());function b(E){const f=E.target,g=r()==="number"?Number(f.value):f.value;e.onChange&&e.onChange(g)}var _=Ws();ir(_),Le(_,()=>({type:r(),placeholder:a(),disabled:n(),required:s(),min:e.min,max:e.max,step:e.step,class:c,value:o(),oninput:b,...d})),k(t,_),we()}var Ds=B('<h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100"> </h3>'),Hs=B('<p class="text-sm text-secondary-600 dark:text-secondary-400 mt-1"> </p>'),qs=B('<div class="mb-3"><!> <!></div>'),Us=B('<div class="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-secondary-200 dark:border-secondary-700"></div>'),Js=B('<div><!> <div class="space-y-3"><!></div> <!></div>');function Qs(t,e){_e(e,!0);let r=Z(e,"hover",3,!1),a=Z(e,"class",3,""),o=it(e,["$$slots","$$events","$$legacy","title","subtitle","actions","hover","onClick","class","children"]);const n="bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 shadow-sm p-4 transition-all duration-200",s=r()?"hover:shadow-md hover:-translate-y-0.5":"",i=e.onClick?"cursor-pointer":"",d=dt(n,s,i,a());function l(){e.onClick&&e.onClick()}var c=Js();Le(c,()=>({class:d,onclick:l,...o}));var b=h(c);{var _=v=>{var P=qs(),R=h(P);{var G=w=>{var u=Ds(),V=h(u,!0);p(u),me(()=>re(V,e.title)),k(w,u)};Q(R,w=>{e.title&&w(G)})}var T=S(R,2);{var x=w=>{var u=Hs(),V=h(u,!0);p(u),me(()=>re(V,e.subtitle)),k(w,u)};Q(T,w=>{e.subtitle&&w(x)})}p(P),k(v,P)};Q(b,v=>{(e.title||e.subtitle)&&v(_)})}var E=S(b,2),f=h(E);qe(f,()=>e.children??ze),p(E);var g=S(E,2);{var $=v=>{var P=Us();Xe(P,21,()=>e.actions,It,(R,G)=>{var T=Y(),x=H(T);qe(x,()=>m(G)),k(R,T)}),p(P),k(v,P)};Q(g,v=>{e.actions&&e.actions.length>0&&v($)})}p(c),k(t,c),we()}var Xs=t=>t.key==="Escape"&&rt(),Ys=B('<div class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" role="button" tabindex="0"></div>'),Ks=B('<div class="flex items-start justify-between"><div class="flex-1 min-w-0"><div class="flex items-center space-x-2 mb-1"><h3 class="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate"> </h3> <span> </span></div> <p class="text-xs text-secondary-600 dark:text-secondary-400 line-clamp-2"> </p> <div class="flex items-center space-x-3 mt-2 text-xs text-secondary-500 dark:text-secondary-400"><span> </span> <span> </span></div></div> <!></div>'),Zs=B('<div class="text-center py-8"><!> <p class="text-sm text-secondary-500 dark:text-secondary-400">No algorithms found</p></div>'),eo=B("<!> Apply & Run",1),to=B('<div class="border-t border-secondary-200 dark:border-secondary-700 p-4"><div class="flex items-center justify-between mb-4"><h3 class="text-sm font-medium text-secondary-900 dark:text-secondary-100">Configuration</h3> <!></div> <div class="space-y-4"><div><label for="array-size" class="block text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-2">Array Size</label> <!></div> <div><label for="speed" class="block text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-2">Speed</label> <!></div> <!></div></div>'),ro=B('<!> <aside><div class="flex flex-col h-full"><div class="p-4 border-b border-secondary-200 dark:border-secondary-700"><div class="flex items-center justify-between"><h2 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Algorithms</h2> <!></div></div> <div class="p-4 border-b border-secondary-200 dark:border-secondary-700"><div class="relative"><!> <!> <!></div></div> <div class="flex-1 overflow-y-auto p-4 space-y-2"><!> <!></div> <!></div></aside>',1);function ao(t,e){_e(e,!1);const r=()=>he(ia,"$sidePanelState",n),a=()=>he(la,"$filteredAlgorithms",n),o=()=>he(lt,"$selectedAlgorithm",n),[n,s]=Qe();let i=ye("");function d(I){da(I)}function l(I){be(i,String(I))}function c(){be(i,""),mt("")}function b(I){switch(I){case"sorting":return"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";case"search":return"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";case"graph":return"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";default:return"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"}}Ae(()=>(m(i),r(),mt),()=>{m(i)!==r().searchQuery&&mt(m(i))}),Et(),Ie();var _=ro(),E=H(_);{var f=I=>{var A=Ys();A.__click=function(...y){rt?.apply(this,y)},A.__keydown=[Xs],k(I,A)};Q(E,I=>{r(),q(()=>r().isOpen)&&I(f)})}var g=S(E,2),$=h(g),v=h($),P=h(v),R=S(h(P),2);ve(R,{variant:"ghost",size:"sm",get onClick(){return rt},class:"lg:hidden",children:(I,A)=>{$t(I,{class:"w-5 h-5"})},$$slots:{default:!0}}),p(P),p(v);var G=S(v,2),T=h(G),x=h(T);Dt(x,{class:"absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400"});var w=S(x,2);xt(w,{type:"text",placeholder:"Search algorithms...",get value(){return m(i)},onChange:l,class:"pl-10 pr-10"});var u=S(w,2);{var V=I=>{ve(I,{variant:"ghost",size:"sm",onClick:c,class:"absolute right-1 top-1/2 transform -translate-y-1/2 p-1",children:(A,y)=>{$t(A,{class:"w-4 h-4"})},$$slots:{default:!0}})};Q(u,I=>{m(i)&&I(V)})}p(T),p(G);var L=S(G,2),j=h(L);Xe(j,1,a,I=>I.id,(I,A)=>{{let y=ge(()=>(o(),m(A),q(()=>o()?.id===m(A).id?"ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900":"")));Qs(I,{get class(){return`cursor-pointer transition-all duration-200 hover:shadow-md ${m(y)??""}`},onClick:()=>d(m(A)),children:(xe,ne)=>{var ie=Ks(),O=h(ie),N=h(O),W=h(N),X=h(W,!0);p(W);var ee=S(W,2),J=h(ee,!0);p(ee),p(N);var te=S(N,2),fe=h(te,!0);p(te);var le=S(te,2),pe=h(le),ke=h(pe);p(pe);var Te=S(pe,2),ct=h(Te);p(Te),p(le),p(O);var Pe=S(O,2);{var Cr=je=>{ve(je,{variant:"ghost",size:"sm",onClick:ut=>{ut.stopPropagation(),pt()},children:(ut,fo)=>{Pa(ut,{class:"w-4 h-4"})},$$slots:{default:!0}})};Q(Pe,je=>{o(),m(A),q(()=>o()?.id===m(A).id)&&je(Cr)})}p(ie),me(je=>{re(X,(m(A),q(()=>m(A).name))),Je(ee,1,`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${je??""}`),re(J,(m(A),q(()=>m(A).type))),re(fe,(m(A),q(()=>m(A).description))),re(ke,`Time: ${m(A),q(()=>m(A).time_complexity)??""}`),re(ct,`Space: ${m(A),q(()=>m(A).space_complexity)??""}`)},[()=>(m(A),q(()=>b(m(A).type)))]),k(xe,ie)},$$slots:{default:!0}})}});var M=S(j,2);{var D=I=>{var A=Zs(),y=h(A);Dt(y,{class:"w-12 h-12 text-secondary-300 dark:text-secondary-600 mx-auto mb-4"}),Ue(2),p(A),k(I,A)};Q(M,I=>{a(),q(()=>a().length===0)&&I(D)})}p(L);var K=S(L,2);{var U=I=>{var A=to(),y=h(A),xe=S(h(y),2);ve(xe,{variant:"ghost",size:"sm",get onClick(){return pt},children:(ee,J)=>{ka(ee,{class:"w-4 h-4"})},$$slots:{default:!0}}),p(y);var ne=S(y,2),ie=h(ne),O=S(h(ie),2);xt(O,{id:"array-size",type:"number",value:20,min:5,max:100,class:"w-full"}),p(ie);var N=S(ie,2),W=S(h(N),2);xt(W,{id:"speed",type:"number",value:5,min:1,max:10,class:"w-full"}),p(N);var X=S(N,2);ve(X,{variant:"primary",size:"sm",class:"w-full",onClick:()=>{pt()},children:(ee,J)=>{var te=eo(),fe=H(te);fr(fe,{class:"w-4 h-4 mr-2"}),Ue(),k(ee,te)},$$slots:{default:!0}}),p(ne),p(A),k(I,A)};Q(K,I=>{o(),r(),q(()=>o()&&r().showConfig)&&I(U)})}p($),p(g),me(()=>Je(g,1,`fixed right-0 top-0 h-full w-80 bg-white dark:bg-secondary-800 border-l border-secondary-200 dark:border-secondary-700 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${r(),q(()=>r().isOpen?"translate-x-0":"translate-x-full")??""} lg:translate-x-0 lg:static lg:z-auto`)),k(t,_),we(),s()}sr(["click","keydown"]);var so=B('<h4 class="text-sm font-medium mb-1"> </h4>'),oo=B('<div class="mt-2 w-full bg-current bg-opacity-20 rounded-full h-1"><div class="loading-bar bg-current bg-opacity-60 h-1 rounded-full"></div></div>'),no=(t,e)=>ua(m(e).id),io=B('<div><div class="flex items-start"><div class="flex-shrink-0"><!></div> <div class="ml-3 flex-1"><!> <p class="text-sm opacity-90"> </p> <!></div> <div class="ml-4 flex-shrink-0"><button type="button" class="inline-flex text-current opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2 rounded"><!></button></div></div></div>'),lo=B('<div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full"></div>');function co(t,e){_e(e,!1);const r=()=>he(ca,"$notifications",a),[a,o]=Qe();function n(d){switch(d){case"success":return"bg-success-50 border-success-200 text-success-800 dark:bg-success-900 dark:border-success-700 dark:text-success-200";case"error":return"bg-error-50 border-error-200 text-error-800 dark:bg-error-900 dark:border-error-700 dark:text-error-200";case"warning":return"bg-warning-50 border-warning-200 text-warning-800 dark:bg-warning-900 dark:border-warning-700 dark:text-warning-200";case"info":default:return"bg-primary-50 border-primary-200 text-primary-800 dark:bg-primary-900 dark:border-primary-700 dark:text-primary-200"}}function s(d){switch(d){case"success":return"text-success-600 dark:text-success-400";case"error":return"text-error-600 dark:text-error-400";case"warning":return"text-warning-600 dark:text-warning-400";case"info":default:return"text-primary-600 dark:text-primary-400"}}Ie();var i=lo();Xe(i,5,r,d=>d.id,(d,l)=>{var c=io(),b=h(c),_=h(b),E=h(_);{var f=L=>{{let j=ge(()=>s(m(l).type));Ca(L,{get class(){return`w-5 h-5 ${m(j)??""}`}})}},g=L=>{var j=Y(),M=H(j);{var D=U=>{{let I=ge(()=>s(m(l).type));$a(U,{get class(){return`w-5 h-5 ${m(I)??""}`}})}},K=U=>{var I=Y(),A=H(I);{var y=ne=>{{let ie=ge(()=>s(m(l).type));Ra(ne,{get class(){return`w-5 h-5 ${m(ie)??""}`}})}},xe=ne=>{{let ie=ge(()=>s(m(l).type));ur(ne,{get class(){return`w-5 h-5 ${m(ie)??""}`}})}};Q(A,ne=>{m(l).type==="warning"?ne(y):ne(xe,!1)},!0)}k(U,I)};Q(M,U=>{m(l).type==="error"?U(D):U(K,!1)},!0)}k(L,j)};Q(E,L=>{m(l).type==="success"?L(f):L(g,!1)})}p(_);var $=S(_,2),v=h($);{var P=L=>{var j=so(),M=h(j,!0);p(j),me(()=>re(M,m(l).title)),k(L,j)};Q(v,L=>{m(l).title&&L(P)})}var R=S(v,2),G=h(R,!0);p(R);var T=S(R,2);{var x=L=>{var j=oo(),M=h(j);p(j),me(()=>nr(M,`animation-duration: ${m(l).duration??""}ms;`)),k(L,j)};Q(T,L=>{m(l).duration>0&&L(x)})}p($);var w=S($,2),u=h(w);u.__click=[no,l];var V=h(u);$t(V,{class:"w-4 h-4"}),p(u),p(w),p(b),p(c),me(L=>{Je(c,1,`notification-enter p-4 rounded-lg border shadow-lg ${L??""}`),re(G,m(l).message)},[()=>n(m(l).type)]),cr(3,c,()=>kr,()=>({duration:300})),k(d,c)}),p(i),k(t,i),we(),o()}sr(["click"]);var uo=B('<div class="flex h-screen overflow-hidden"><div class="flex-1 flex flex-col"><!> <main class="flex-1 flex flex-col p-6 space-y-6"><div class="flex-1 min-h-0"><!></div> <!></main></div> <!></div> <!>',1);function xo(t,e){_e(e,!1),Kr(async()=>{try{jt(!0);const _=await $r.getAlgorithms();fa(_),at({type:"success",title:"Welcome!",message:"Algorithm Visualizer loaded successfully. Select an algorithm to get started.",duration:3e3})}catch(_){const E=_ instanceof Ge?_.message:"Failed to load algorithms";va(E),at({type:"error",title:"Error",message:E,duration:5e3})}finally{jt(!1)}}),Ie();var r=uo(),a=H(r),o=h(a),n=h(o);$s(n,{});var s=S(n,2),i=h(s),d=h(i);Is(d,{}),p(i);var l=S(i,2);Bs(l,{}),p(s),p(o);var c=S(o,2);ao(c,{}),p(a);var b=S(a,2);co(b,{}),k(t,r),we()}export{xo as component};
