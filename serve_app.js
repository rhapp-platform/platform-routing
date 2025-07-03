var L0=($,O)=>{try{return O($)}catch{return $.replace(/(?:%[0-9A-Fa-f]{2})+/g,(Y)=>{try{return O(Y)}catch{return Y}})}};var g=($)=>{if(!/[%+]/.test($))return $;if($.indexOf("+")!==-1)$=$.replace(/\+/g," ");return $.indexOf("%")!==-1?K($):$},z0=($,O,Y)=>{let Z;if(!Y&&O&&!/[%+]/.test(O)){let M=$.indexOf(`?${O}`,8);if(M===-1)M=$.indexOf(`&${O}`,8);while(M!==-1){const Q=$.charCodeAt(M+O.length+1);if(Q===61){const L=M+O.length+2,z=$.indexOf("&",L);return g($.slice(L,z===-1?void 0:z))}else if(Q==38||isNaN(Q))return"";M=$.indexOf(`&${O}`,M+1)}if(Z=/[%+]/.test($),!Z)return}const X={};Z??=/[%+]/.test($);let G=$.indexOf("?",8);while(G!==-1){const M=$.indexOf("&",G+1);let Q=$.indexOf("=",G);if(Q>M&&M!==-1)Q=-1;let L=$.slice(G+1,Q===-1?M===-1?void 0:M:Q);if(Z)L=g(L);if(G=M,L==="")continue;let z;if(Q===-1)z="";else if(z=$.slice(Q+1,M===-1?void 0:M),Z)z=g(z);if(Y){if(!(X[L]&&Array.isArray(X[L])))X[L]=[];X[L].push(z)}else X[L]??=z}return O?X[O]:X},V0=z0,N0=($,O)=>{return z0($,O,!0)},K=decodeURIComponent;var c=($)=>{return y($.replace(/_|-/g,(O)=>({_:"/","-":"+"})[O]??O))},k=($)=>d0($).replace(/\/|\+/g,(O)=>({"/":"_","+":"-"})[O]??O),d0=($)=>{let O="";const Y=new Uint8Array($);for(let Z=0,X=Y.length;Z<X;Z++)O+=String.fromCharCode(Y[Z]);return btoa(O)},y=($)=>{const O=atob($),Y=new Uint8Array(new ArrayBuffer(O.length)),Z=O.length/2;for(let X=0,G=O.length-1;X<=Z;X++,G--)Y[X]=O.charCodeAt(X),Y[G]=O.charCodeAt(G);return Y};var d=(($)=>{return $.HS256="HS256",$.HS384="HS384",$.HS512="HS512",$.RS256="RS256",$.RS384="RS384",$.RS512="RS512",$.PS256="PS256",$.PS384="PS384",$.PS512="PS512",$.ES256="ES256",$.ES384="ES384",$.ES512="ES512",$.EdDSA="EdDSA",$})(d||{});var u0={deno:"Deno",bun:"Bun",workerd:"Cloudflare-Workers",node:"Node.js"},D0=()=>{const $=globalThis;if(typeof navigator!=="undefined"&&typeof navigator.userAgent==="string"){for(let[Y,Z]of Object.entries(u0))if(i0(Z))return Y}if(typeof $?.EdgeRuntime==="string")return"edge-light";if($?.fastly!==void 0)return"fastly";if($?.process?.release?.name==="node")return"node";return"other"},i0=($)=>{return navigator.userAgent.startsWith($)};var J0=class extends Error{constructor($){super(`${$} is not an implemented algorithm`);this.name="JwtAlgorithmNotImplemented"}},u=class extends Error{constructor($){super(`invalid JWT token: ${$}`);this.name="JwtTokenInvalid"}},F0=class extends Error{constructor($){super(`token (${$}) is being used before it's valid`);this.name="JwtTokenNotBefore"}},_0=class extends Error{constructor($){super(`token (${$}) expired`);this.name="JwtTokenExpired"}},E0=class extends Error{constructor($,O){super(`Incorrect "iat" claim must be a older than "${$}" (iat: "${O}")`);this.name="JwtTokenIssuedAt"}},B0=class extends Error{constructor($){super(`jwt header is invalid: ${JSON.stringify($)}`);this.name="JwtHeaderInvalid"}},U0=class extends Error{constructor($){super(`token(${$}) signature mismatched`);this.name="JwtTokenSignatureMismatched"}},I=(($)=>{return $.Encrypt="encrypt",$.Decrypt="decrypt",$.Sign="sign",$.Verify="verify",$.DeriveKey="deriveKey",$.DeriveBits="deriveBits",$.WrapKey="wrapKey",$.UnwrapKey="unwrapKey",$})(I||{});var U=new TextEncoder,j0=new TextDecoder;async function A0($,O,Y){const Z=S0(O),X=await p0($,Z);return await crypto.subtle.sign(Z,X,Y)}async function I0($,O,Y,Z){const X=S0(O),G=await l0($,X);return await crypto.subtle.verify(X,G,Y,Z)}var i=function($){return y($.replace(/-+(BEGIN|END).*/g,"").replace(/\s/g,""))};async function p0($,O){if(!crypto.subtle||!crypto.subtle.importKey)throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");if(P0($)){if($.type!=="private"&&$.type!=="secret")throw new Error(`unexpected key type: CryptoKey.type is ${$.type}, expected private or secret`);return $}const Y=[I.Sign];if(typeof $==="object")return await crypto.subtle.importKey("jwk",$,O,!1,Y);if($.includes("PRIVATE"))return await crypto.subtle.importKey("pkcs8",i($),O,!1,Y);return await crypto.subtle.importKey("raw",U.encode($),O,!1,Y)}async function l0($,O){if(!crypto.subtle||!crypto.subtle.importKey)throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");if(P0($)){if($.type==="public"||$.type==="secret")return $;$=await H0($)}if(typeof $==="string"&&$.includes("PRIVATE")){const Z=await crypto.subtle.importKey("pkcs8",i($),O,!0,[I.Sign]);$=await H0(Z)}const Y=[I.Verify];if(typeof $==="object")return await crypto.subtle.importKey("jwk",$,O,!1,Y);if($.includes("PUBLIC"))return await crypto.subtle.importKey("spki",i($),O,!1,Y);return await crypto.subtle.importKey("raw",U.encode($),O,!1,Y)}async function H0($){if($.type!=="private")throw new Error(`unexpected key type: ${$.type}`);if(!$.extractable)throw new Error("unexpected private key is unextractable");const O=await crypto.subtle.exportKey("jwk",$),{kty:Y}=O,{alg:Z,e:X,n:G}=O,{crv:M,x:Q,y:L}=O;return{kty:Y,alg:Z,e:X,n:G,crv:M,x:Q,y:L,key_ops:[I.Verify]}}var S0=function($){switch($){case"HS256":return{name:"HMAC",hash:{name:"SHA-256"}};case"HS384":return{name:"HMAC",hash:{name:"SHA-384"}};case"HS512":return{name:"HMAC",hash:{name:"SHA-512"}};case"RS256":return{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}};case"RS384":return{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-384"}};case"RS512":return{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-512"}};case"PS256":return{name:"RSA-PSS",hash:{name:"SHA-256"},saltLength:32};case"PS384":return{name:"RSA-PSS",hash:{name:"SHA-384"},saltLength:48};case"PS512":return{name:"RSA-PSS",hash:{name:"SHA-512"},saltLength:64};case"ES256":return{name:"ECDSA",hash:{name:"SHA-256"},namedCurve:"P-256"};case"ES384":return{name:"ECDSA",hash:{name:"SHA-384"},namedCurve:"P-384"};case"ES512":return{name:"ECDSA",hash:{name:"SHA-512"},namedCurve:"P-521"};case"EdDSA":return{name:"Ed25519",namedCurve:"Ed25519"};default:throw new J0($)}},P0=function($){if(D0()==="node"&&!!crypto.webcrypto)return $ instanceof crypto.webcrypto.CryptoKey;return $ instanceof CryptoKey};var o0=function($){if(typeof $==="object"&&$!==null){const O=$;return"alg"in O&&Object.values(d).includes(O.alg)&&(!("typ"in O)||O.typ==="JWT")}return!1},R0=($)=>k(U.encode(JSON.stringify($))).replace(/=/g,""),n0=($)=>k($).replace(/=/g,""),T0=($)=>JSON.parse(j0.decode(c($))),w0=async($,O,Y="HS256")=>{const Z=R0($),G=`${R0({alg:Y,typ:"JWT"})}.${Z}`,M=await A0(O,Y,U.encode(G)),Q=n0(M);return`${G}.${Q}`},K0=async($,O,Y="HS256")=>{const Z=$.split(".");if(Z.length!==3)throw new u($);const{header:X,payload:G}=p($);if(!o0(X))throw new B0(X);const M=Date.now()/1000|0;if(G.nbf&&G.nbf>M)throw new F0($);if(G.exp&&G.exp<=M)throw new _0($);if(G.iat&&M<G.iat)throw new E0(M,G.iat);const Q=$.substring(0,$.lastIndexOf("."));if(!await I0(O,Y,c(Z[2]),U.encode(Q)))throw new U0($);return G},p=($)=>{try{const[O,Y]=$.split("."),Z=T0(O),X=T0(Y);return{header:Z,payload:X}}catch{throw new u($)}};var q={sign:w0,verify:K0,decode:p};async function s0($,O){const Y=await $.formData();if(Y)return r0(Y,O);return{}}var r0=function($,O){const Y=Object.create(null);if($.forEach((Z,X)=>{if(!(O.all||X.endsWith("[]")))Y[X]=Z;else t0(Y,X,Z)}),O.dot)Object.entries(Y).forEach(([Z,X])=>{if(Z.includes("."))a0(Y,Z,X),delete Y[Z]});return Y},q0=async($,O=Object.create(null))=>{const{all:Y=!1,dot:Z=!1}=O,G=($ instanceof C?$.raw.headers:$.headers).get("Content-Type");if(G?.startsWith("multipart/form-data")||G?.startsWith("application/x-www-form-urlencoded"))return s0($,{all:Y,dot:Z});return{}},t0=($,O,Y)=>{if($[O]!==void 0)if(Array.isArray($[O]))$[O].push(Y);else $[O]=[$[O],Y];else $[O]=Y},a0=($,O,Y)=>{let Z=$;const X=O.split(".");X.forEach((G,M)=>{if(M===X.length-1)Z[G]=Y;else{if(!Z[G]||typeof Z[G]!=="object"||Array.isArray(Z[G])||Z[G]instanceof File)Z[G]=Object.create(null);Z=Z[G]}})};var C0=($)=>L0($,K),C=class{raw;#Q;#Y;routeIndex=0;path;bodyCache={};constructor($,O="/",Y=[[]]){this.raw=$,this.path=O,this.#Y=Y,this.#Q={}}param($){return $?this.#G($):this.#W()}#G($){const O=this.#Y[0][this.routeIndex][1][$],Y=this.#X(O);return Y?/\%/.test(Y)?C0(Y):Y:void 0}#W(){const $={},O=Object.keys(this.#Y[0][this.routeIndex][1]);for(let Y of O){const Z=this.#X(this.#Y[0][this.routeIndex][1][Y]);if(Z&&typeof Z==="string")$[Y]=/\%/.test(Z)?C0(Z):Z}return $}#X($){return this.#Y[1]?this.#Y[1][$]:$}query($){return V0(this.url,$)}queries($){return N0(this.url,$)}header($){if($)return this.raw.headers.get($.toLowerCase())??void 0;const O={};return this.raw.headers.forEach((Y,Z)=>{O[Z]=Y}),O}async parseBody($){return this.bodyCache.parsedBody??=await q0(this,$)}#$=($)=>{const{bodyCache:O,raw:Y}=this,Z=O[$];if(Z)return Z;const X=Object.keys(O)[0];if(X)return O[X].then((G)=>{if(X==="json")G=JSON.stringify(G);return new Response(G)[$]()});return O[$]=Y[$]()};json(){return this.#$("json")}text(){return this.#$("text")}arrayBuffer(){return this.#$("arrayBuffer")}blob(){return this.#$("blob")}formData(){return this.#$("formData")}addValidatedData($,O){this.#Q[$]=O}valid($){return this.#Q[$]}get url(){return this.raw.url}get method(){return this.raw.method}get matchedRoutes(){return this.#Y[0].map(([[,$]])=>$)}get routePath(){return this.#Y[0].map(([[,$]])=>$)[this.routeIndex].path}};var x0={Stringify:1,BeforeStream:2,Stream:3},e0=($,O)=>{const Y=new String($);return Y.isEscaped=!0,Y.callbacks=O,Y};var l=async($,O,Y,Z,X)=>{if(typeof $==="object"&&!($ instanceof String)){if(!($ instanceof Promise))$=$.toString();if($ instanceof Promise)$=await $}const G=$.callbacks;if(!G?.length)return Promise.resolve($);if(X)X[0]+=$;else X=[$];const M=Promise.all(G.map((Q)=>Q({phase:O,buffer:X,context:Z}))).then((Q)=>Promise.all(Q.filter(Boolean).map((L)=>l(L,O,!1,Z,X))).then(()=>X[0]));if(Y)return e0(await M,G);else return M};var $2="text/plain; charset=UTF-8",n=($,O={})=>{for(let Y of Object.keys(O))$.set(Y,O[Y]);return $},a2=class{#Q;#Y;env={};#G;finalized=!1;error;#W=200;#X;#$;#O;#M;#L=!0;#N;#z;#V;#D;#J;constructor($,O){if(this.#Q=$,O)this.#X=O.executionCtx,this.env=O.env,this.#V=O.notFoundHandler,this.#J=O.path,this.#D=O.matchResult}get req(){return this.#Y??=new C(this.#Q,this.#J,this.#D),this.#Y}get event(){if(this.#X&&"respondWith"in this.#X)return this.#X;else throw Error("This context has no FetchEvent")}get executionCtx(){if(this.#X)return this.#X;else throw Error("This context has no ExecutionContext")}get res(){return this.#L=!1,this.#M||=new Response("404 Not Found",{status:404})}set res($){if(this.#L=!1,this.#M&&$)try{for(let[O,Y]of this.#M.headers.entries()){if(O==="content-type")continue;if(O==="set-cookie"){const Z=this.#M.headers.getSetCookie();$.headers.delete("set-cookie");for(let X of Z)$.headers.append("set-cookie",X)}else $.headers.set(O,Y)}}catch(O){if(O instanceof TypeError&&O.message.includes("immutable")){this.res=new Response($.body,{headers:$.headers,status:$.status});return}else throw O}this.#M=$,this.finalized=!0}render=(...$)=>{return this.#z??=(O)=>this.html(O),this.#z(...$)};setLayout=($)=>this.#N=$;getLayout=()=>this.#N;setRenderer=($)=>{this.#z=$};header=($,O,Y)=>{if(O===void 0){if(this.#$)this.#$.delete($);else if(this.#O)delete this.#O[$.toLocaleLowerCase()];if(this.finalized)this.res.headers.delete($);return}if(Y?.append){if(!this.#$)this.#L=!1,this.#$=new Headers(this.#O),this.#O={};this.#$.append($,O)}else if(this.#$)this.#$.set($,O);else this.#O??={},this.#O[$.toLowerCase()]=O;if(this.finalized)if(Y?.append)this.res.headers.append($,O);else this.res.headers.set($,O)};status=($)=>{this.#L=!1,this.#W=$};set=($,O)=>{this.#G??=new Map,this.#G.set($,O)};get=($)=>{return this.#G?this.#G.get($):void 0};get var(){if(!this.#G)return{};return Object.fromEntries(this.#G)}#Z($,O,Y){if(this.#L&&!Y&&!O&&this.#W===200)return new Response($,{headers:this.#O});if(O&&typeof O!=="number"){const X=new Headers(O.headers);if(this.#$)this.#$.forEach((M,Q)=>{if(Q==="set-cookie")X.append(Q,M);else X.set(Q,M)});const G=n(X,this.#O);return new Response($,{headers:G,status:O.status??this.#W})}const Z=typeof O==="number"?O:this.#W;if(this.#O??={},this.#$??=new Headers,n(this.#$,this.#O),this.#M)this.#M.headers.forEach((X,G)=>{if(G==="set-cookie")this.#$?.append(G,X);else this.#$?.set(G,X)}),n(this.#$,this.#O);Y??={};for(let[X,G]of Object.entries(Y))if(typeof G==="string")this.#$.set(X,G);else{this.#$.delete(X);for(let M of G)this.#$.append(X,M)}return new Response($,{status:Z,headers:this.#$})}newResponse=(...$)=>this.#Z(...$);body=($,O,Y)=>{return typeof O==="number"?this.#Z($,O,Y):this.#Z($,O)};text=($,O,Y)=>{if(!this.#O){if(this.#L&&!Y&&!O)return new Response($);this.#O={}}if(this.#O["content-type"]=$2,typeof O==="number")return this.#Z($,O,Y);return this.#Z($,O)};json=($,O,Y)=>{const Z=JSON.stringify($);return this.#O??={},this.#O["content-type"]="application/json",typeof O==="number"?this.#Z(Z,O,Y):this.#Z(Z,O)};html=($,O,Y)=>{if(this.#O??={},this.#O["content-type"]="text/html; charset=UTF-8",typeof $==="object")return l($,x0.Stringify,!1,{}).then((Z)=>{return typeof O==="number"?this.#Z(Z,O,Y):this.#Z(Z,O)});return typeof O==="number"?this.#Z($,O,Y):this.#Z($,O)};redirect=($,O)=>{return this.#$??=new Headers,this.#$.set("Location",String($)),this.newResponse(null,O??302)};notFound=()=>{return this.#V??=()=>new Response,this.#V(this)}};var O2=q.verify,Y2=q.decode,o=q.sign;var Z2="rush64counter648hua26gxitrocks";async function s({ag:$,an:O,aid:Y="xxxxx",pl:Z=0,reg:X="enam"}){const G=crypto.randomUUID(),M={sid:G,ag:$,an:O,aid:Y,pl:Z,reg:X,exp:Math.floor(Date.now()/1000)+28800};return{sessionToken:await o(M,Z2),sid:G}}async function r({ag:$,an:O,aid:Y,account:Z,reg:X,pl:G,color:M,lang:Q="en",version:L,b64:z,startBlock:$0}){const{sessionToken:O0,sid:j}=await s({ag:$,an:O,aid:Y,account:Z,reg:X,pl:G,color:M});return`

<!DOCTYPE html>
<html lang="${Q}">

<head>
    <meta charset="UTF-8">
    <title>@${$}/${O}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="a rhappsody app">
    <meta name="rh-sid" content="${j}">
    <meta name="rh-aid" content="${Y}">
    <meta name="rh-account" content="${Z}">
    <!-- Preload critical resources -->
    <link rel="preload" href="https://test.rh.local/core-rhapp/dist/rhapp.js" as="script">
    <link rel="preload" href="https://r.rhap.cc/latest/rh.css" as="style">
    <link rel="preload" href="https://public-enam.rhappsody.cloud/7f8c37cb-118b-44f7-814c-0332b392808f/08d97c15-6f06-420b-976f-2418bd9caa60/rhapp.bin" as="fetch" crossorigin>
    <link rel="icon" type="image/x-icon" href="/rh.ico">
    <!-- <link rel="manifest" href="${O}/manifest"> -->
    <!-- CSS should load first (render-blocking) -->
    <link rel="stylesheet" href="https://r.rhap.cc/latest/rh.css">
    <!-- JS library with async loading -->
    <script async src="https://test.rh.local/core-rhapp/dist/rhapp.js"></script>
    <!-- <script async src="/fn/ag-visit?sid=${j}&an=${O}"></script> -->
    <!-- Your app initialization script -->
    <script>
      // Wait for both library and binary to be ready
      async function initApp() {
        // Fetch binary file
        const R = await fetch('https://public-enam.rhappsody.cloud/7f8c37cb-118b-44f7-814c-0332b392808f/08d97c15-6f06-420b-976f-2418bd9caa60/rhapp.bin');
        const ab = await R.arrayBuffer();
        const rhcbin = new Uint8Array(ab);
        // Wait for library to be available
        while (typeof Rhapp === 'undefined') {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        window.app = new Rhapp(document.body);
        window.app.vm.boot(rhcbin);
      }
      // Start initialization when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
      } else {
        initApp();
      }
    </script>
  </head>
<body class="light" data-rh-session-token="${O0}"></body>
</html>
  `}function t($){return`
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://r.rhap.cc/latest/rh.css?latest" rel="stylesheet">
    <script src="/static/is.js"></script>
    <title>App Not Live</title>
</head>

<body class="light primary">
    <template id="rh-ctx-url">
        <header class="primary">
            <h6 class="center-align"><rh-span>@AG/AN</rh-span></h6>
        </header>
        <div class="fixed center middle center-align">
            <rh-icon-bare name="mdi:calendar-clock" size="8rem"></rh-icon-bare>
            <h6><rh-span>App is Not Live Yet!</rh-span></h6>
            <p class="">It will be available on</p>
            <h6 class="bold" id="livein-date"></h6>
            <div class="space"></div>
            <div>
                <p class="no-line small-text">Please check back later.If you have questions, please
                    contact the
                    app owner.</p>
            </div>
        </div>
        <rh-copyright size="small"></rh-copyright>
        <script>
            const htmlElement = document.documentElement;
            const lang = htmlElement.getAttribute('lang');
            console.log('HTML lang attribute:', lang);
            const t = "${$}";
            console.log(t);
            const date = new Date(Number(t));
            const formattedDate = date.toLocaleString(lang, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            });
            console.log(formattedDate);
            document.getElementById("livein-date").innerHTML = formattedDate;
        </script>
    </template>
    <rh-ctx-url></rh-ctx-url>
</body>

</html>
  `}function a({ag:$,an:O,color:Y}){return{name:`${$} ${O}`,short_name:`${$} ${O}`,description:`${$} ${O} page`,lang:"en",orientation:"portrait",display:"standalone",background_color:`#${Y}`,theme_color:`#${Y}`,start_url:`/${O}`,features:["powered by Rhappsody"],icons:[{src:`https://${$}.rhapp.app/${O}/icon`,sizes:"512x512",type:"image/png"}]}}function e({ag:$,an:O}){return`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - App Not Found</title>
    <script type="module" src="https://wc.rhap.cc/rh-logo.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #000;
            color: #fff;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        
        .container {
            text-align: center;
            padding: 2rem;
            max-width: 600px;
        }
        
        rh-logo {
            display: block;
            margin: 0 auto 2rem;
            opacity: 0.8;
        }
        
        .error-code {
            font-size: 12rem;
            font-weight: 900;
            line-height: 1;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            margin-bottom: 1rem;
            animation: pulse 2s ease-in-out infinite;
        }
        
        .error-message {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            letter-spacing: -0.02em;
        }
        
        .app-name {
            font-size: 1.5rem;
            font-weight: 500;
            color: #999;
            margin-bottom: 3rem;
            font-family: 'Courier New', monospace;
        }
        
        .home-link {
            display: inline-block;
            padding: 1rem 2.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.8;
            }
        }
        
        @media (max-width: 768px) {
            .error-code {
                font-size: 8rem;
            }
            .error-message {
                font-size: 2rem;
            }
            .app-name {
                font-size: 1.2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <rh-logo size="200" color="#667eea"></rh-logo>
        <div class="error-code">404</div>
        <div class="error-message">App Not Found</div>
        <div class="app-name">@${$}/${O}</div>
        <a href="https://${$}.rhapp.app" class="home-link">Go to App Group Home</a>
    </div>
</body>
</html>`}var S="rush64counter648hua26gxitrocks",X2="https://sb.rhap.cc/storage/v1/object/public/apps",G2="https://ctx.rhap.cc";var P8={async fetch($){const O=new URL($.url),Y=O.hostname.split(".")[0],[,Z,X,G,M]=O.pathname.split("/");if(Z==="cf-fonts")return fetch($);if(Z==="_"){const W=O.pathname.replace("/_/","");return fetch(`https://rh.rhap.cc/${W}`)}if(Z==="_doc"){const W=O.pathname.replace("/_doc/","");return fetch(`https://doc.rhap.cc/${W}`)}if(O.pathname.endsWith("/manifest"))return new Response(JSON.stringify(a({ag:Y,an:Z,name:Z,color:"blue"})),{headers:{"Content-Type":"application/json"}});if(Z==="rh.ico")return fetch("https://sb.rhap.cc/storage/v1/object/public/apps/_system/ico/blue.ico");if(Z==="sw.js")return fetch("https://app-sidecar.rhappsody.cloud/sw.js");if(Z==="_rhapp.js")return fetch(`${X2}/${Y}/_rhapp.js`);if(["account","apps","auth","claim","create","dashboard","groups","images","users","new","signup","used","visits"].includes(Z)){const W=X?`${X}.html`:"index.html";return fetch(`https://app-sidecar.rhappsody.cloud/${Z}/${W}`)}if(Z==="fn"){const W=new URL(`https://cfn-${X}.xpes.workers.dev`);for(let[E,A]of O.searchParams)W.searchParams.set(E,A);W.searchParams.set("ag",Y),W.searchParams.set("shared_secret",S);let N=null;if($.body)N=$.clone().body;const F=new Request(W,{method:$.method,headers:$.headers,body:$.body});return fetch(F)}if(Z==="rha"){const W=new URL(`https://rha-${X}.xpes.workers.dev`);for(let[E,A]of O.searchParams)W.searchParams.set(E,A);W.searchParams.set("ag",Y),W.searchParams.set("shared_secret",S);let N=null;if($.body)N=$.clone().body;const F=new Request(W,{method:$.method,headers:$.headers,body:N});return fetch(F)}const L=O.searchParams.has("latest")?`?latest&ts=${Date.now()}`:"",z=O.searchParams.has("preview"),$0=O.searchParams.has("oldversion"),O0=z?"preview.rhbin":$0?"previous.rhbin":"app.rhbin",j=await fetch(`${G2}/${Y}/${Z}/app.ctx`);if(!j.ok)return new Response(e({ag:Y,an:Z}),{status:404,headers:{"Content-Type":"text/html; charset=utf-8"}});const Y0=await j.text(),J=j.headers.get("Content-Type"),[f0,M2,H,_,b0,v0,Z0,X0,h0]=J.split("/"),[x,T,G0,f,w,m0,P]=b0.split("-");let M0="start";if(X)switch(X){case"_ctx":return new Response(JSON.stringify({account:H,aid:_,brand:v0,color:Z0,lang:X0,name:h0,sysStatus:x,status:T,version:G0,pl:f,reg:w,exp:m0,nbf:P}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, PUT, DELETE, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization, X-Client-ID,rh-tag"}});case"icon":const W=`https://sb.rhap.cc/storage/v1/object/public/apps/${H}/${_}/app-icon.png`;return fetch(W);case"banner":const N=`https://sb.rhap.cc/storage/v1/object/public/apps/${H}/${_}/banner.png`;return fetch(N);case"social":const F=`https://sb.rhap.cc/storage/v1/object/public/apps/${H}/${_}/social.png`;return fetch(F);case"rhapp.js":const E=`https://pub-${w}.rhap.cc/${H}/${_}/app.js`,A=await fetch(E),c0={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, PUT, DELETE, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization"};return new Response(A.body,{headers:{...c0,...A.headers}});case"rha":try{let B=`https://rha-${G}.xpes.workers.dev?ag=${Y}&an=${Z}&shared_secret=${S}&rh_ctx=${J}`,R=null;if($.body)R=$.clone().body;const m=new Request(B,{method:$.method,headers:$.headers,body:R}),V=await fetch(m),D=new Headers(V.headers);if(D.set("Access-Control-Allow-Origin","*"),D.set("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS"),D.set("Access-Control-Allow-Headers","Content-Type, Authorization, X-Client-ID,rh-tag"),!V.ok)throw new Error(`Snippet HTTP error status: ${V.status}`);return new Response(V.body,{status:V.status,statusText:V.statusText,headers:D})}catch(B){return new Response(`Error in snippet: ${B.message}`,{status:555})}break;case"fn":try{let B=`https://cfn-${G}.xpes.workers.dev?ag=${Y}&an=${Z}&shared_secret=${S}&rh_ctx=${J}`,R=null;if($.body)R=$.clone().body;const m=new Request(B,{method:$.method,headers:$.headers,body:R}),V=await fetch(m),D=new Headers(V.headers);if(D.set("Access-Control-Allow-Origin","*"),D.set("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS"),D.set("Access-Control-Allow-Headers","Content-Type, Authorization"),!V.ok)throw new Error(`Snippet HTTP error status: ${V.status}`);return new Response(V.body,{status:V.status,statusText:V.statusText,headers:D})}catch(B){return new Response(`Error in snippet: ${B.message}`,{status:555})}break;case"go":M0=G;break;case"manifest":break;case"icon":return fetch(`https://sb.rhap.cc/storage/v1/object/public/apps/${Y}/${Z}/app-icon.png`);case"as":const Q0=O.searchParams.get("pw"),W0=O.searchParams.get("role");let b=`${M?`https://serve-app-as.xpes.workers.dev/${G}/${M}`:`https://serve-app-as.xpes.workers.dev/${G}`}?ag=${Y}&an=${Z}&shared_secret=${S}`;if(Q0)b+=`&pw=${Q0}`;if(W0)b+=`&role=${W0}`;return fetch(b,{method:$.method});case"img":return fetch(`https://pub-${w}.rhappsody.cloud/${H}/${_}/images/${G}.png`);case"is":case"app":case"source":case"data":case"edit":case"images":case"assets":case"overview":case"users":case"share":case"install":case"info":case"profile":case"admin":case"login":case"inbox":case"splash":case"plugins":case"publish":case"contact":case"_dev":case"help":case"ask":case"chat":case"blog":case"files":case"attachments":const k0=G?`${G}.html`:"index.html",v=await fetch(`https://app-sidecar.rhappsody.cloud/${X}/${k0}`),h=new Headers(v.headers);return h.set("Server-Timing",`rhctx;desc="${J}"`),h.set("rh-ctx",J),new Response(v.body,{status:v.status,headers:h});default:return fetch($)}if(x!=="0")return new Response(`sysStatus = ${x}`);if(T==="1")return new Response(`inactive status = ${T}`);if(z){if(Number(f)<10)return fetch("https://app-sidecar.rhappsody.cloud/preview/notsupported.html");const W=await fetch("https://app-sidecar.rhappsody.cloud/preview/index.html"),N=new Headers(W.headers);return N.set("Server-Timing",`rhctx;desc="${J}"`),N.set("rh-ctx",J),new Response(W.body,{status:W.status,headers:N})}if(!z){const W=Date.now();if(P!=="0"&&P!=="null"){if(W<Number(P))return new Response(t(P),{headers:{"content-type":"text/html;charset=UTF-8"}})}}if(T==="1"){const W=O.searchParams.get("pw");let F=`https://serve-app-as.xpes.workers.dev/protected?ag=${Y}&an=${Z}&shared_secret=${S}`;if(W)F+=`&pw=${W}`;return fetch(F,{method:$.method})}const g0=await r({ag:Y,an:Z,aid:_,reg:w,pl:f,color:Z0,lang:X0,b64:Y0,startBlock:M0,version:G0});return new Response(g0,{headers:{"Content-Type":"text/html; charset=utf-8"}})}};export{P8 as default};
