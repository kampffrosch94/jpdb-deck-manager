var pt=Object.defineProperty;var ht=(e,t,n)=>t in e?pt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var He=(e,t,n)=>(ht(e,typeof t!="symbol"?t+"":t,n),n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))l(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&l(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function l(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();function X(){}function ft(e){return e()}function Se(){return Object.create(null)}function _e(e){e.forEach(ft)}function _t(e){return typeof e=="function"}function Ne(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function gt(e){return Object.keys(e).length===0}function mt(e,...t){if(e==null){for(const l of t)l(void 0);return X}const n=e.subscribe(...t);return n.unsubscribe?()=>n.unsubscribe():n}function ce(e,t,n){e.$$.on_destroy.push(mt(t,n))}function ue(e){return e??""}function Be(e,t,n){return e.set(n),t}function r(e,t){e.appendChild(t)}function q(e,t,n){e.insertBefore(t,n||null)}function N(e){e.parentNode&&e.parentNode.removeChild(e)}function Xe(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function _(e){return document.createElement(e)}function w(e){return document.createTextNode(e)}function y(){return w(" ")}function bt(){return w("")}function A(e,t,n,l){return e.addEventListener(t,n,l),()=>e.removeEventListener(t,n,l)}function g(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function kt(e){let t;return{p(...n){t=n,t.forEach(l=>e.push(l))},r(){t.forEach(n=>e.splice(e.indexOf(n),1))}}}function re(e){return e===""?null:+e}function vt(e){return Array.from(e.childNodes)}function se(e,t){t=""+t,e.data!==t&&(e.data=t)}function H(e,t){e.value=t??""}function qe(e,t,n,l){n==null?e.style.removeProperty(t):e.style.setProperty(t,n,l?"important":"")}function Ue(e,t,n){for(let l=0;l<e.options.length;l+=1){const i=e.options[l];if(i.__value===t){i.selected=!0;return}}(!n||t!==void 0)&&(e.selectedIndex=-1)}function wt(e){const t=e.querySelector(":checked");return t&&t.__value}let Ze;function Pe(e){Ze=e}const ve=[],$e=[];let ye=[];const xe=[],yt=Promise.resolve();let Ge=!1;function jt(){Ge||(Ge=!0,yt.then(dt))}function We(e){ye.push(e)}const Ke=new Set;let be=0;function dt(){if(be!==0)return;const e=Ze;do{try{for(;be<ve.length;){const t=ve[be];be++,Pe(t),Ct(t.$$)}}catch(t){throw ve.length=0,be=0,t}for(Pe(null),ve.length=0,be=0;$e.length;)$e.pop()();for(let t=0;t<ye.length;t+=1){const n=ye[t];Ke.has(n)||(Ke.add(n),n())}ye.length=0}while(ve.length);for(;xe.length;)xe.pop()();Ge=!1,Ke.clear(),Pe(e)}function Ct(e){if(e.fragment!==null){e.update(),_e(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(We)}}function Mt(e){const t=[],n=[];ye.forEach(l=>e.indexOf(l)===-1?t.push(l):n.push(l)),n.forEach(l=>l()),ye=t}const Ve=new Set;let he;function Nt(){he={r:0,c:[],p:he}}function Lt(){he.r||_e(he.c),he=he.p}function ge(e,t){e&&e.i&&(Ve.delete(e),e.i(t))}function Ce(e,t,n,l){if(e&&e.o){if(Ve.has(e))return;Ve.add(e),he.c.push(()=>{Ve.delete(e),l&&(n&&e.d(1),l())}),e.o(t)}else l&&l()}function Me(e){return(e==null?void 0:e.length)!==void 0?e:Array.from(e)}function Re(e){e&&e.c()}function Ie(e,t,n){const{fragment:l,after_update:i}=e.$$;l&&l.m(t,n),We(()=>{const s=e.$$.on_mount.map(ft).filter(_t);e.$$.on_destroy?e.$$.on_destroy.push(...s):_e(s),e.$$.on_mount=[]}),i.forEach(We)}function Ae(e,t){const n=e.$$;n.fragment!==null&&(Mt(n.after_update),_e(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function Ot(e,t){e.$$.dirty[0]===-1&&(ve.push(e),jt(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function Fe(e,t,n,l,i,s,o=null,a=[-1]){const u=Ze;Pe(e);const c=e.$$={fragment:null,ctx:[],props:s,update:X,not_equal:i,bound:Se(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(u?u.$$.context:[])),callbacks:Se(),dirty:a,skip_bound:!1,root:t.target||u.$$.root};o&&o(c.root);let d=!1;if(c.ctx=n?n(e,t.props||{},(p,b,...k)=>{const W=k.length?k[0]:b;return c.ctx&&i(c.ctx[p],c.ctx[p]=W)&&(!c.skip_bound&&c.bound[p]&&c.bound[p](W),d&&Ot(e,p)),b}):[],c.update(),d=!0,_e(c.before_update),c.fragment=l?l(c.ctx):!1,t.target){if(t.hydrate){const p=vt(t.target);c.fragment&&c.fragment.l(p),p.forEach(N)}else c.fragment&&c.fragment.c();t.intro&&ge(e.$$.fragment),Ie(e,t.target,t.anchor),dt()}Pe(u)}class Te{constructor(){He(this,"$$");He(this,"$$set")}$destroy(){Ae(this,1),this.$destroy=X}$on(t,n){if(!_t(n))return X;const l=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return l.push(n),()=>{const i=l.indexOf(n);i!==-1&&l.splice(i,1)}}$set(t){this.$$set&&!gt(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const Et="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(Et);const ke=[];function Je(e,t=X){let n;const l=new Set;function i(a){if(Ne(e,a)&&(e=a,n)){const u=!ke.length;for(const c of l)c[1](),ke.push(c,e);if(u){for(let c=0;c<ke.length;c+=2)ke[c][0](ke[c+1]);ke.length=0}}}function s(a){i(a(e))}function o(a,u=X){const c=[a,u];return l.add(c),l.size===1&&(n=t(i,s)||X),a(e),()=>{l.delete(c),l.size===0&&n&&(n(),n=null)}}return{set:i,update:s,subscribe:o}}const ze=Je(""),Qe=Je(!1),je=Je(""),De=Je([]);function et(e,t,n){const l=e.slice();return l[18]=t[n],l}function tt(e){let t,n,l,i=e[18].name+"",s,o,a,u,c,d,p,b=e[18].known_coverage.toFixed(1)+"",k,W,m,L=e[18].learning_coverage.toFixed(1)+"",M,D,O,G=e[18].vocab_count+"",h,R,F,$=e[18].word_count+"",te,x,T,ie=e[18].is_built_in+"",Z,ne,Y,oe;function le(...ee){return e[16](e[18],...ee)}return{c(){t=_("tr"),n=_("td"),l=_("a"),s=w(i),o=y(),a=_("a"),u=w("[jpdb]"),d=y(),p=_("td"),k=w(b),W=y(),m=_("td"),M=w(L),D=y(),O=_("td"),h=w(G),R=y(),F=_("td"),te=w($),x=y(),T=_("td"),Z=w(ie),ne=y(),g(l,"href","#"),g(a,"target","_blank"),g(a,"href",c="https://jpdb.io/deck?id="+e[18].id),g(n,"class","svelte-mesrax"),qe(p,"text-align","right"),g(p,"class","svelte-mesrax"),qe(m,"text-align","right"),g(m,"class","svelte-mesrax"),qe(O,"text-align","right"),g(O,"class","svelte-mesrax"),qe(F,"text-align","right"),g(F,"class","svelte-mesrax"),qe(T,"text-align","center"),g(T,"class","svelte-mesrax"),g(t,"class","svelte-mesrax")},m(ee,S){q(ee,t,S),r(t,n),r(n,l),r(l,s),r(n,o),r(n,a),r(a,u),r(t,d),r(t,p),r(p,k),r(t,W),r(t,m),r(m,M),r(t,D),r(t,O),r(O,h),r(t,R),r(t,F),r(F,te),r(t,x),r(t,T),r(T,Z),r(t,ne),Y||(oe=A(l,"click",le),Y=!0)},p(ee,S){e=ee,S&32&&i!==(i=e[18].name+"")&&se(s,i),S&32&&c!==(c="https://jpdb.io/deck?id="+e[18].id)&&g(a,"href",c),S&32&&b!==(b=e[18].known_coverage.toFixed(1)+"")&&se(k,b),S&32&&L!==(L=e[18].learning_coverage.toFixed(1)+"")&&se(M,L),S&32&&G!==(G=e[18].vocab_count+"")&&se(h,G),S&32&&$!==($=e[18].word_count+"")&&se(te,$),S&32&&ie!==(ie=e[18].is_built_in+"")&&se(Z,ie)},d(ee){ee&&N(t),Y=!1,oe()}}}function nt(e){let t,n,l;return{c(){t=_("button"),t.textContent="add all"},m(i,s){q(i,t,s),n||(l=A(t,"click",e[17]),n=!0)},p:X,d(i){i&&N(t),n=!1,l()}}}function qt(e){let t,n,l,i=e[5].length+"",s,o,a=e[3].length+"",u,c,d,p,b,k,W,m,L,M,D,O,G,h,R,F,$,te,x,T,ie,Z,ne,Y,oe,le,ee,S,v,B,V,I,J,U,de,ae,Le,me,pe,Oe,fe,K,Q,z=Me(e[5]),E=[];for(let f=0;f<z.length;f+=1)E[f]=tt(et(e,z,f));let P=e[3].length>0&&nt(e);return{c(){t=_("div"),n=_("h3"),l=w("Decklist (showing "),s=w(i),o=w(" of "),u=w(a),c=w(")"),d=w(`
    Min coverage:
    `),p=_("input"),b=w(`
    Min learning coverage:
    `),k=_("input"),W=w(`
    Filter builtin:
    `),m=_("input"),L=y(),M=_("table"),D=_("tr"),O=_("th"),G=_("i"),R=w(`
                name`),F=y(),$=_("th"),te=_("i"),T=w(`
                coverage`),ie=y(),Z=_("th"),ne=_("i"),oe=w(`
                learning`),le=_("br"),ee=w("coverage"),S=y(),v=_("th"),B=_("i"),I=w(`
                vocab`),J=y(),U=_("th"),de=_("i"),Le=w(`
                words`),me=y(),pe=_("th"),pe.textContent="is_built_in",Oe=y();for(let f=0;f<E.length;f+=1)E[f].c();fe=y(),P&&P.c(),g(p,"type","number"),g(k,"type","number"),g(m,"type","checkbox"),g(G,"class",h=ue(e[4]==e[7].Name?"sorting_asc":"sorting")+" svelte-mesrax"),g(te,"class",x=ue(e[4]==e[7].Coverage?"sorting_desc":"sorting")+" svelte-mesrax"),g(ne,"class",Y=ue(e[4]==e[7].Learning?"sorting_desc":"sorting")+" svelte-mesrax"),g(B,"class",V=ue(e[4]==e[7].VocabCount?"sorting_desc":"sorting")+" svelte-mesrax"),g(de,"class",ae=ue(e[4]==e[7].WordCount?"sorting_desc":"sorting")+" svelte-mesrax"),g(D,"class","svelte-mesrax"),g(M,"class","svelte-mesrax")},m(f,C){q(f,t,C),r(t,n),r(n,l),r(n,s),r(n,o),r(n,u),r(n,c),r(t,d),r(t,p),H(p,e[0]),r(t,b),r(t,k),H(k,e[1]),r(t,W),r(t,m),m.checked=e[2],r(t,L),r(t,M),r(M,D),r(D,O),r(O,G),r(O,R),r(D,F),r(D,$),r($,te),r($,T),r(D,ie),r(D,Z),r(Z,ne),r(Z,oe),r(Z,le),r(Z,ee),r(D,S),r(D,v),r(v,B),r(v,I),r(D,J),r(D,U),r(U,de),r(U,Le),r(D,me),r(D,pe),r(M,Oe);for(let j=0;j<E.length;j+=1)E[j]&&E[j].m(M,null);r(t,fe),P&&P.m(t,null),K||(Q=[A(p,"input",e[8]),A(k,"input",e[9]),A(m,"change",e[10]),A(O,"click",e[11]),A($,"click",e[12]),A(Z,"click",e[13]),A(v,"click",e[14]),A(U,"click",e[15])],K=!0)},p(f,[C]){if(C&32&&i!==(i=f[5].length+"")&&se(s,i),C&8&&a!==(a=f[3].length+"")&&se(u,a),C&1&&re(p.value)!==f[0]&&H(p,f[0]),C&2&&re(k.value)!==f[1]&&H(k,f[1]),C&4&&(m.checked=f[2]),C&16&&h!==(h=ue(f[4]==f[7].Name?"sorting_asc":"sorting")+" svelte-mesrax")&&g(G,"class",h),C&16&&x!==(x=ue(f[4]==f[7].Coverage?"sorting_desc":"sorting")+" svelte-mesrax")&&g(te,"class",x),C&16&&Y!==(Y=ue(f[4]==f[7].Learning?"sorting_desc":"sorting")+" svelte-mesrax")&&g(ne,"class",Y),C&16&&V!==(V=ue(f[4]==f[7].VocabCount?"sorting_desc":"sorting")+" svelte-mesrax")&&g(B,"class",V),C&16&&ae!==(ae=ue(f[4]==f[7].WordCount?"sorting_desc":"sorting")+" svelte-mesrax")&&g(de,"class",ae),C&96){z=Me(f[5]);let j;for(j=0;j<z.length;j+=1){const Ee=et(f,z,j);E[j]?E[j].p(Ee,C):(E[j]=tt(Ee),E[j].c(),E[j].m(M,null))}for(;j<E.length;j+=1)E[j].d(1);E.length=z.length}f[3].length>0?P?P.p(f,C):(P=nt(f),P.c(),P.m(t,null)):P&&(P.d(1),P=null)},i:X,o:X,d(f){f&&N(t),Xe(E,f),P&&P.d(),K=!1,_e(Q)}}}function Bt(e,t,n){let l,i;ce(e,De,h=>n(6,i=h));let{min_coverage:s}=t,{min_learning:o}=t,{filter_builtin:a}=t,{decks:u}=t;var c=(h=>(h[h.Name=0]="Name",h[h.Coverage=1]="Coverage",h[h.Learning=2]="Learning",h[h.WordCount=3]="WordCount",h[h.VocabCount=4]="VocabCount",h))(c||{});let d=0;function p(){s=re(this.value),n(0,s)}function b(){o=re(this.value),n(1,o)}function k(){a=this.checked,n(2,a)}const W=h=>n(4,d=c.Name),m=h=>n(4,d=c.Coverage),L=h=>n(4,d=c.Learning),M=h=>n(4,d=c.VocabCount),D=h=>n(4,d=c.WordCount),O=(h,R)=>{R.preventDefault(),i.push(h),De.set(i)},G=async()=>{i.concat(l),De.set(i)};return e.$$set=h=>{"min_coverage"in h&&n(0,s=h.min_coverage),"min_learning"in h&&n(1,o=h.min_learning),"filter_builtin"in h&&n(2,a=h.filter_builtin),"decks"in h&&n(3,u=h.decks)},e.$$.update=()=>{e.$$.dirty&31&&n(5,l=u.filter(h=>h.known_coverage>=s&&h.learning_coverage>=o&&(h.is_built_in||!a)).sort((h,R)=>{switch(d){case 0:return h.name.localeCompare(R.name);case 1:return R.known_coverage-h.known_coverage;case 2:return R.learning_coverage-h.learning_coverage;case 3:return R.word_count-h.word_count;case 4:return R.vocab_count-h.vocab_count}}))},[s,o,a,u,d,l,i,c,p,b,k,W,m,L,M,D,O,G]}class Pt extends Te{constructor(t){super(),Fe(this,t,Bt,qt,Ne,{min_coverage:0,min_learning:1,filter_builtin:2,decks:3})}}async function we(e,t,n){let l=new Headers;return l.set("Authorization","Bearer "+n),l.set("Content-Type","application/json"),await fetch("https://jpdb.io/api/v1/"+e,{headers:l,method:"POST",body:JSON.stringify(t)})}function lt(e,t,n){const l=e.slice();return l[33]=t[n],l}function it(e,t,n){const l=e.slice();return l[36]=t[n],l}function rt(e){let t,n=e[36].name+"",l;return{c(){t=_("p"),l=w(n)},m(i,s){q(i,t,s),r(t,l)},p(i,s){s[0]&1024&&n!==(n=i[36].name+"")&&se(l,n)},d(i){i&&N(t)}}}function st(e){let t,n,l,i,s;return{c(){t=_("p"),n=w(`min decks:
                `),l=_("input"),g(l,"type","number")},m(o,a){q(o,t,a),r(t,n),r(t,l),H(l,e[2]),i||(s=A(l,"input",e[24]),i=!0)},p(o,a){a[0]&4&&re(l.value)!==o[2]&&H(l,o[2])},d(o){o&&N(t),i=!1,s()}}}function ot(e){let t,n,l,i=Me(e[12]),s=[];for(let o=0;o<i.length;o+=1)s[o]=ut(lt(e,i,o));return{c(){t=_("select");for(let o=0;o<s.length;o+=1)s[o].c();e[6]===void 0&&We(()=>e[26].call(t))},m(o,a){q(o,t,a);for(let u=0;u<s.length;u+=1)s[u]&&s[u].m(t,null);Ue(t,e[6],!0),n||(l=A(t,"change",e[26]),n=!0)},p(o,a){if(a[0]&4096){i=Me(o[12]);let u;for(u=0;u<i.length;u+=1){const c=lt(o,i,u);s[u]?s[u].p(c,a):(s[u]=ut(c),s[u].c(),s[u].m(t,null))}for(;u<s.length;u+=1)s[u].d(1);s.length=i.length}a[0]&4160&&Ue(t,o[6])},d(o){o&&N(t),Xe(s,o),n=!1,l()}}}function ut(e){let t,n=e[33]+"",l,i;return{c(){t=_("option"),l=w(n),i=y(),t.__value=e[33],H(t,t.__value)},m(s,o){q(s,t,o),r(t,l),r(t,i)},p:X,d(s){s&&N(t)}}}function ct(e){let t,n,l,i,s,o,a,u,c;return{c(){t=_("p"),n=w("min: "),l=_("input"),i=y(),s=_("p"),o=w("max: "),a=_("input"),g(l,"type","number"),g(a,"type","number")},m(d,p){q(d,t,p),r(t,n),r(t,l),H(l,e[8]),q(d,i,p),q(d,s,p),r(s,o),r(s,a),H(a,e[9]),u||(c=[A(l,"input",e[28]),A(a,"input",e[29])],u=!0)},p(d,p){p[0]&256&&re(l.value)!==d[8]&&H(l,d[8]),p[0]&512&&re(a.value)!==d[9]&&H(a,d[9])},d(d){d&&(N(t),N(i),N(s)),u=!1,_e(c)}}}function at(e){let t,n,l=e[4].name+"",i,s,o,a,u;return{c(){t=_("p"),n=w(`Last created:
                `),i=w(l),s=y(),o=_("a"),a=w("[jpdb]"),g(o,"target","_blank"),g(o,"href",u="https://jpdb.io/deck?id="+e[4].id)},m(c,d){q(c,t,d),r(t,n),r(t,i),r(t,s),r(t,o),r(o,a)},p(c,d){d[0]&16&&l!==(l=c[4].name+"")&&se(i,l),d[0]&16&&u!==(u="https://jpdb.io/deck?id="+c[4].id)&&g(o,"href",u)},d(c){c&&N(t)}}}function Dt(e){let t,n,l,i,s,o,a,u,c,d,p,b,k,W,m,L,M,D,O,G,h,R,F,$,te,x,T,ie,Z,ne,Y,oe,le,ee,S,v,B,V,I,J,U,de,ae,Le,me,pe,Oe,fe=Me(e[10]),K=[];for(let f=0;f<fe.length;f+=1)K[f]=rt(it(e,fe,f));let Q=e[3]==e[11].BijakMerge&&st(e),z=e[5]&&ot(e),E=e[7]&&ct(e),P=e[4]!=null&&at(e);return me=kt(e[21][0]),{c(){t=_("div"),n=_("h3"),n.textContent="Deckmerger",l=w(`
        selected decks:`),i=_("br"),s=y();for(let f=0;f<K.length;f+=1)K[f].c();o=y(),a=_("button"),a.textContent="Reset selection",u=y(),c=_("p"),d=w(`Name of new deck
            `),p=_("input"),b=y(),k=_("p"),W=w(`min occurences:
            `),m=_("input"),L=y(),M=_("p"),D=_("label"),O=_("input"),G=w(`
                Merge`),h=y(),R=_("label"),F=_("input"),$=w(`
                Intersect`),te=y(),x=_("label"),T=_("input"),ie=w(`
                BijakMerge`),Z=y(),Q&&Q.c(),ne=y(),Y=_("p"),oe=w(`Filter for card state?
            `),le=_("input"),ee=y(),z&&z.c(),S=y(),v=_("p"),B=w(`Filter by global frequency?
            `),V=_("input"),I=y(),E&&E.c(),J=y(),U=_("button"),de=w("create deck"),Le=y(),P&&P.c(),g(p,"type","text"),g(m,"type","number"),g(O,"type","radio"),g(O,"name","strat"),O.__value=e[11].Merge,H(O,O.__value),g(D,"title","Merges decks into new deck, adds up all vocab occurences, then removes all vocab where occurences < min_occurences"),g(F,"type","radio"),g(F,"name","strat"),F.__value=e[11].Intersect,H(F,F.__value),g(R,"title","Only adds those words into the new deck that appear in all decks. Then removes all where occurences < min_occurences"),g(T,"type","radio"),g(T,"name","strat"),T.__value=e[11].BijakMerge,H(T,T.__value),g(x,"title","The BijakMerge (named after its inventor) works just like the regular merge, but also needs a minimum number of decks for a word to appear in for it to be included."),g(le,"type","checkbox"),g(V,"type","checkbox"),U.disabled=ae=e[10].length<=0,g(t,"id","deckmerger_div"),me.p(O,F,T)},m(f,C){q(f,t,C),r(t,n),r(t,l),r(t,i),r(t,s);for(let j=0;j<K.length;j+=1)K[j]&&K[j].m(t,null);r(t,o),r(t,a),r(t,u),r(t,c),r(c,d),r(c,p),H(p,e[0]),r(t,b),r(t,k),r(k,W),r(k,m),H(m,e[1]),r(t,L),r(t,M),r(M,D),r(D,O),O.checked=O.__value===e[3],r(D,G),r(M,h),r(M,R),r(R,F),F.checked=F.__value===e[3],r(R,$),r(M,te),r(M,x),r(x,T),T.checked=T.__value===e[3],r(x,ie),r(t,Z),Q&&Q.m(t,null),r(t,ne),r(t,Y),r(Y,oe),r(Y,le),le.checked=e[5],r(Y,ee),z&&z.m(Y,null),r(t,S),r(t,v),r(v,B),r(v,V),V.checked=e[7],r(v,I),E&&E.m(v,null),r(t,J),r(t,U),r(U,de),r(t,Le),P&&P.m(t,null),pe||(Oe=[A(a,"click",e[17]),A(p,"input",e[18]),A(m,"input",e[19]),A(O,"change",e[20]),A(F,"change",e[22]),A(T,"change",e[23]),A(le,"change",e[25]),A(V,"change",e[27]),A(U,"click",e[30])],pe=!0)},p(f,C){if(C[0]&1024){fe=Me(f[10]);let j;for(j=0;j<fe.length;j+=1){const Ee=it(f,fe,j);K[j]?K[j].p(Ee,C):(K[j]=rt(Ee),K[j].c(),K[j].m(t,o))}for(;j<K.length;j+=1)K[j].d(1);K.length=fe.length}C[0]&1&&p.value!==f[0]&&H(p,f[0]),C[0]&2&&re(m.value)!==f[1]&&H(m,f[1]),C[0]&8&&(O.checked=O.__value===f[3]),C[0]&8&&(F.checked=F.__value===f[3]),C[0]&8&&(T.checked=T.__value===f[3]),f[3]==f[11].BijakMerge?Q?Q.p(f,C):(Q=st(f),Q.c(),Q.m(t,ne)):Q&&(Q.d(1),Q=null),C[0]&32&&(le.checked=f[5]),f[5]?z?z.p(f,C):(z=ot(f),z.c(),z.m(Y,null)):z&&(z.d(1),z=null),C[0]&128&&(V.checked=f[7]),f[7]?E?E.p(f,C):(E=ct(f),E.c(),E.m(v,null)):E&&(E.d(1),E=null),C[0]&1024&&ae!==(ae=f[10].length<=0)&&(U.disabled=ae),f[4]!=null?P?P.p(f,C):(P=at(f),P.c(),P.m(t,null)):P&&(P.d(1),P=null)},i:X,o:X,d(f){f&&N(t),Xe(K,f),Q&&Q.d(),z&&z.d(),E&&E.d(),P&&P.d(),me.r(),pe=!1,_e(Oe)}}}function Ye(e,t){const n=[];for(const l of e)for(const i of l){const s=n.find(o=>o.vid===i.vid&&o.sid===i.sid);s!=null?(s.occurences+=i.occurences,s.decks+=1):n.push({decks:1,...i})}return n.filter(l=>l.decks>=t)}function It(e,t,n){let l,i,s;ce(e,ze,v=>n(31,l=v)),ce(e,je,v=>n(32,i=v)),ce(e,De,v=>n(10,s=v));var o=(v=>(v[v.Merge=0]="Merge",v[v.Intersect=1]="Intersect",v[v.BijakMerge=2]="BijakMerge",v))(o||{});let a="",u=1,c=1,d=0,p=null,b=!1,k=["new","locked","learning","known","due","failed","never-forget","suspended","blacklisted"],W=k[0],m=!1,L=1,M=3e4;async function D(v){const B=await(await we("deck/list-vocabulary",{id:v.id,fetch_occurences:!0},l)).json();let V=[];for(let I=0;I<B.vocabulary.length;I++){let J={vid:B.vocabulary[I][0],sid:B.vocabulary[I][1],occurences:B.occurences[I]};V.push(J)}return{vocabs:V,...v}}async function O(v){const B=v.map(J=>[J.vid,J.sid]),V=await(await we("lookup-vocabulary",{list:B,fields:["card_state","frequency_rank"]},l)).json();let I=[];for(let J=0;J<V.vocabulary_info.length;J++)I.push({state:V.vocabulary_info[J][0],frequency:V.vocabulary_info[J][1],...v[J]});return I}async function G(v,B){let V=[],I=[];B.forEach(U=>{V.push([U.vid,U.sid]),I.push(U.occurences)});const J=await(await we("deck/add-vocabulary",{id:v,vocabulary:V,occurences:I},l)).json();Be(je,i=JSON.stringify(J),i)}async function h(v){return(await(await we("deck/create-empty",{name:v},l)).json()).id}const R=[[]],F=()=>{Be(De,s=[],s)};function $(){a=this.value,n(0,a)}function te(){u=re(this.value),n(1,u)}function x(){d=this.__value,n(3,d)}function T(){d=this.__value,n(3,d)}function ie(){d=this.__value,n(3,d)}function Z(){c=re(this.value),n(2,c)}function ne(){b=this.checked,n(5,b)}function Y(){W=wt(this),n(6,W),n(12,k)}function oe(){m=this.checked,n(7,m)}function le(){L=re(this.value),n(8,L)}function ee(){M=re(this.value),n(9,M)}return[a,u,c,d,p,b,W,m,L,M,s,o,k,D,O,G,h,F,$,te,x,R,T,ie,Z,ne,Y,oe,le,ee,async()=>{if(a!==""){n(4,p=null);const v=[];for(const I of s){const J=await D(I);v.push(J.vocabs)}let B;switch(d){case o.Merge:B=Ye(v,1);break;case o.Intersect:B=Ye(v,v.length);break;case o.BijakMerge:B=Ye(v,c);break}B=B.filter(I=>I.occurences>=u),(b||m)&&(B=await O(B),b&&(B=B.filter(I=>I.state[0]===W)),m&&(B=B.filter(I=>L<=I.frequency&&I.frequency<=M)));const V=await h(a);await G(V,B),n(4,p={id:V,name:a})}}]}class At extends Te{constructor(t){super(),Fe(this,t,It,Dt,Ne,{},null,[-1,-1])}}function Ft(e){let t,n,l,i,s,o,a,u,c,d,p;return{c(){t=_("p"),t.innerHTML='Put your API Token here (from the bottom of <a href="https://jpdb.io/settings">jpdb.io/settings</a>), it won&#39;t get sent anywhere except jpdb.io. Don&#39;t share it with anyone!',n=y(),l=_("p"),l.textContent="After you have done this press fetch user decks.",i=y(),s=_("p"),s.textContent=`You can enter the token in your browsers password manager if you don't want
    to input it every time you use this site.`,o=y(),a=_("input"),u=y(),c=_("button"),c.textContent="Confirm",g(a,"type","password"),g(c,"type","button")},m(b,k){q(b,t,k),q(b,n,k),q(b,l,k),q(b,i,k),q(b,s,k),q(b,o,k),q(b,a,k),H(a,e[0]),q(b,u,k),q(b,c,k),d||(p=[A(a,"input",e[2]),A(c,"click",e[1])],d=!0)},p(b,[k]){k&1&&a.value!==b[0]&&H(a,b[0])},i:X,o:X,d(b){b&&(N(t),N(n),N(l),N(i),N(s),N(o),N(a),N(u),N(c)),d=!1,_e(p)}}}function Tt(e,t,n){let l,i,s;ce(e,Qe,u=>n(3,l=u)),ce(e,je,u=>n(4,i=u)),ce(e,ze,u=>n(0,s=u));async function o(){const c=await(await we("ping",{},s)).json();Be(je,i=JSON.stringify(c),i),i=="{}"&&(Be(je,i="Token confirmed as correct.",i),Be(Qe,l=!0,l))}function a(){s=this.value,ze.set(s)}return[s,o,a]}class Vt extends Te{constructor(t){super(),Fe(this,t,Tt,Ft,Ne,{})}}function Wt(e){let t,n,l,i,s,o,a,u,c,d,p,b,k,W;return c=new Pt({props:{decks:e[0],min_coverage:Jt,min_learning:Ht,filter_builtin:Kt}}),p=new At({}),{c(){t=_("p"),t.textContent="Result:",n=y(),l=_("pre"),i=w(e[2]),s=y(),o=_("button"),o.textContent="Fetch user decks",a=y(),u=_("div"),Re(c.$$.fragment),d=y(),Re(p.$$.fragment),g(o,"type","button"),g(u,"class","container svelte-1gcq67e")},m(m,L){q(m,t,L),q(m,n,L),q(m,l,L),r(l,i),q(m,s,L),q(m,o,L),q(m,a,L),q(m,u,L),Ie(c,u,null),r(u,d),Ie(p,u,null),b=!0,k||(W=A(o,"click",e[3]),k=!0)},p(m,L){(!b||L&4)&&se(i,m[2]);const M={};L&1&&(M.decks=m[0]),c.$set(M)},i(m){b||(ge(c.$$.fragment,m),ge(p.$$.fragment,m),b=!0)},o(m){Ce(c.$$.fragment,m),Ce(p.$$.fragment,m),b=!1},d(m){m&&(N(t),N(n),N(l),N(s),N(o),N(a),N(u)),Ae(c),Ae(p),k=!1,W()}}}function Rt(e){let t,n;return t=new Vt({}),{c(){Re(t.$$.fragment)},m(l,i){Ie(t,l,i),n=!0},p:X,i(l){n||(ge(t.$$.fragment,l),n=!0)},o(l){Ce(t.$$.fragment,l),n=!1},d(l){Ae(t,l)}}}function zt(e){let t,n,l,i;const s=[Rt,Wt],o=[];function a(u,c){return u[1]?1:0}return t=a(e),n=o[t]=s[t](e),{c(){n.c(),l=bt()},m(u,c){o[t].m(u,c),q(u,l,c),i=!0},p(u,[c]){let d=t;t=a(u),t===d?o[t].p(u,c):(Nt(),Ce(o[d],1,1,()=>{o[d]=null}),Lt(),n=o[t],n?n.p(u,c):(n=o[t]=s[t](u),n.c()),ge(n,1),n.m(l.parentNode,l))},i(u){i||(ge(n),i=!0)},o(u){Ce(n),i=!1},d(u){u&&N(l),o[t].d(u)}}}let Jt=0,Ht=0,Kt=!1;function Yt(e,t,n){let l,i,s;ce(e,ze,u=>n(4,l=u)),ce(e,Qe,u=>n(1,i=u)),ce(e,je,u=>n(2,s=u));let o=[];async function a(){const c=await(await we("list-user-decks",{fields:["name","vocabulary_known_coverage","vocabulary_in_progress_coverage","is_built_in","id","word_count","vocabulary_count"]},l)).json();n(0,o=c.decks.map(d=>{let[p,b,k,W,m,L,M]=d;return{name:p,id:m,known_coverage:b??0,learning_coverage:k??0,is_built_in:W,word_count:L,vocab_count:M}})),o.sort((d,p)=>d.name.localeCompare(p.name))}return[o,i,s,a]}class Gt extends Te{constructor(t){super(),Fe(this,t,Yt,zt,Ne,{})}}function Qt(e){let t,n,l;return n=new Gt({}),{c(){t=_("main"),Re(n.$$.fragment)},m(i,s){q(i,t,s),Ie(n,t,null),l=!0},p:X,i(i){l||(ge(n.$$.fragment,i),l=!0)},o(i){Ce(n.$$.fragment,i),l=!1},d(i){i&&N(t),Ae(n)}}}class Xt extends Te{constructor(t){super(),Fe(this,t,null,Qt,Ne,{})}}new Xt({target:document.getElementById("app")});
