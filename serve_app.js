var hh=function(h,$){const G={alg:"HS256",typ:"JWT"},z=btoa(JSON.stringify(G)).replace(/[=]/g,""),K=btoa(JSON.stringify(h)).replace(/[=]/g,""),J=`${z}.${K}`,Z=btoa($+J).slice(0,16);return`${J}.${Z}`};async function S({ag:h,an:$,aid:G="xxxxx",pl:z=0,reg:K="enam"}){const J=crypto.randomUUID(),Z=crypto.randomUUID(),P={sid:J,ag:h,an:$,aid:G,pl:z,reg:K,nonce:Z,exp:Math.floor(Date.now()/1000)+28800};return{contextToken:hh(P,"rush64counter648hua26gxitrocks"),sid:J}}async function b({ag:h,an:$,aid:G,account:z,reg:K,pl:J,color:Z,lang:P="en",version:p,b64:m,startBlock:R,includeServiceWorker:c=!1}){const{contextToken:A,sid:v}=await S({ag:h,an:$,aid:G,account:z,reg:K,pl:J,color:Z});return`

<!DOCTYPE html>
<html lang="${P}">

<head>
    <meta charset="UTF-8">
    <title>@${h}/${$}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="a rhappsody app">
    <meta name="rh-sid" content="${v}">
    <meta name="rh-aid" content="${G}">
    <meta name="rh-account" content="${z}">
    <!-- Preload critical resources -->
    <link rel="preload" href="https://test.rh.local/core-rhapp/dist/rhapp.js" as="script">
    <link rel="preload" href="https://r.rhap.cc/latest/rh.css" as="style">
    <link rel="preload" href="https://public-enam.rhappsody.cloud/7f8c37cb-118b-44f7-814c-0332b392808f/08d97c15-6f06-420b-976f-2418bd9caa60/rhapp.bin" as="fetch" crossorigin>
    <link rel="icon" type="image/x-icon" href="/rh.ico">
    <!-- <link rel="manifest" href="${$}/manifest"> -->
    <!-- CSS should load first (render-blocking) -->
    <link rel="stylesheet" href="https://r.rhap.cc/latest/rh.css">
    <!-- JS library with async loading -->
    <script async src="https://test.rh.local/core-rhapp/dist/rhapp.js"></script>
    ${c?'<!-- Service Worker -->\n    <script src="/sw.js"></script>':""}
    <!-- <script async src="/fn/ag-visit?sid=${v}&an=${$}"></script> -->
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
<body class="light" data-rh-context-token="${A}"></body>
</html>
  `}function H(h){return`
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
            const t = "${h}";
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
  `}function C({ag:h,an:$,color:G}){return{name:`${h} ${$}`,short_name:`${h} ${$}`,description:`${h} ${$} page`,lang:"en",orientation:"portrait",display:"standalone",background_color:`#${G}`,theme_color:`#${G}`,start_url:`/${$}`,features:["powered by Rhappsody"],icons:[{src:`https://${h}.rhapp.app/${$}/icon`,sizes:"512x512",type:"image/png"}]}}function w({ag:h,an:$}){return`<!DOCTYPE html>
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
        <div class="app-name">@${h}/${$}</div>
        <a href="https://${h}.rhapp.app" class="home-link">Go to App Group Home</a>
    </div>
</body>
</html>`}var N="rush64counter648hua26gxitrocks";var $h="https://ctx.rhap.cc";var Oh={async fetch(h){const $=new URL(h.url),G=$.hostname.split(".")[0],[,z,K,J,Z]=$.pathname.split("/");if(z==="cf-fonts")return fetch(h);if(z==="_"){const j=$.pathname.replace("/_/","");return fetch(`https://rh.rhap.cc/${j}`)}if(z==="__"){const j=$.pathname.replace("/__/","");return fetch(`https://release.rhapp.cc/${j}`)}if(z==="_doc"){const j=$.pathname.replace("/_doc/","");return fetch(`https://doc.rhap.cc/${j}`)}if($.pathname.endsWith("/manifest"))return new Response(JSON.stringify(C({ag:G,an:z,name:z,color:"blue"})),{headers:{"Content-Type":"application/json"}});if(z==="rh.ico")return fetch("https://sb.rhap.cc/storage/v1/object/public/apps/_system/ico/blue.ico");if(z==="sw.js")return fetch("https://release.rhapp.cc/sw.js");if(["account","apps","auth","claim","create","dashboard","groups","images","users","new","signup","used","visits"].includes(z)){const j=K?`${K}.html`:"index.html";return fetch(`https://app-sidecar.rhappsody.cloud/${z}/${j}`)}if(z==="fn"){const j=new URL(`https://cfn-${K}.xpes.workers.dev`);for(let[O,W]of $.searchParams)j.searchParams.set(O,W);j.searchParams.set("ag",G),j.searchParams.set("shared_secret",N);let V=null;if(h.body)V=h.clone().body;const I=new Request(j,{method:h.method,headers:h.headers,body:h.body});return fetch(I)}if(z==="rha"){const j=new URL(`https://rha-${K}.xpes.workers.dev`);for(let[O,W]of $.searchParams)j.searchParams.set(O,W);j.searchParams.set("ag",G),j.searchParams.set("shared_secret",N);let V=null;if(h.body)V=h.clone().body;const I=new Request(j,{method:h.method,headers:h.headers,body:V});return fetch(I)}const p=$.searchParams.has("latest")?`?latest&ts=${Date.now()}`:"",m=$.searchParams.has("preview"),R=$.searchParams.has("oldversion"),c=m?"preview.rhbin":R?"previous.rhbin":"app.rhbin",A=await fetch(`${$h}/${G}/${z}/app.ctx`);if(!A.ok)return new Response(w({ag:G,an:z}),{status:404,headers:{"Content-Type":"text/html; charset=utf-8"}});const v=await A.text(),x=A.headers.get("Content-Type"),[o,t,D,M,d,u,g,l,n]=x.split("/"),[_,U,i,y,B,s,F]=d.split("-");let q="start";if(K)switch(K){case"_ctx":return new Response(JSON.stringify({account:D,aid:M,brand:u,color:g,lang:l,name:n,sysStatus:_,status:U,version:i,pl:y,reg:B,exp:s,nbf:F}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, PUT, DELETE, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization, X-Client-ID,rh-tag"}});case"icon":const j=`https://sb.rhap.cc/storage/v1/object/public/apps/${D}/${M}/app-icon.png`;return fetch(j);case"banner":const V=`https://sb.rhap.cc/storage/v1/object/public/apps/${D}/${M}/banner.png`;return fetch(V);case"social":const I=`https://sb.rhap.cc/storage/v1/object/public/apps/${D}/${M}/social.png`;return fetch(I);case"rha":try{let X=`https://rha-${J}.xpes.workers.dev?ag=${G}&an=${z}&shared_secret=${N}&rh_ctx=${x}`,L=null;if(h.body)L=h.clone().body;const E=new Request(X,{method:h.method,headers:h.headers,body:L}),Q=await fetch(E),Y=new Headers(Q.headers);if(Y.set("Access-Control-Allow-Origin","*"),Y.set("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS"),Y.set("Access-Control-Allow-Headers","Content-Type, Authorization, X-Client-ID,rh-tag"),!Q.ok)throw new Error(`Snippet HTTP error status: ${Q.status}`);return new Response(Q.body,{status:Q.status,statusText:Q.statusText,headers:Y})}catch(X){return new Response(`Error in snippet: ${X.message}`,{status:555})}break;case"fn":try{let X=`https://cfn-${J}.xpes.workers.dev?ag=${G}&an=${z}&shared_secret=${N}&rh_ctx=${x}`,L=null;if(h.body)L=h.clone().body;const E=new Request(X,{method:h.method,headers:h.headers,body:L}),Q=await fetch(E),Y=new Headers(Q.headers);if(Y.set("Access-Control-Allow-Origin","*"),Y.set("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS"),Y.set("Access-Control-Allow-Headers","Content-Type, Authorization"),!Q.ok)throw new Error(`Snippet HTTP error status: ${Q.status}`);return new Response(Q.body,{status:Q.status,statusText:Q.statusText,headers:Y})}catch(X){return new Response(`Error in snippet: ${X.message}`,{status:555})}break;case"go":q=J;break;case"manifest":break;case"icon":return fetch(`https://sb.rhap.cc/storage/v1/object/public/apps/${G}/${z}/app-icon.png`);case"as":const O=$.searchParams.get("pw"),W=$.searchParams.get("role");let k=`${Z?`https://serve-app-as.xpes.workers.dev/${J}/${Z}`:`https://serve-app-as.xpes.workers.dev/${J}`}?ag=${G}&an=${z}&shared_secret=${N}`;if(O)k+=`&pw=${O}`;if(W)k+=`&role=${W}`;return fetch(k,{method:h.method});case"img":return fetch(`https://pub-${B}.rhappsody.cloud/${D}/${M}/images/${J}.png`);case"is":case"app":case"source":case"data":case"edit":case"images":case"assets":case"overview":case"users":case"share":case"install":case"info":case"profile":case"admin":case"login":case"inbox":case"splash":case"plugins":case"publish":case"contact":case"_dev":case"help":case"ask":case"chat":case"blog":case"files":case"attachments":const r=J?`${J}.html`:"index.html",f=await fetch(`https://app-sidecar.rhappsody.cloud/${K}/${r}`),T=new Headers(f.headers);return T.set("Server-Timing",`rhctx;desc="${x}"`),T.set("rh-ctx",x),new Response(f.body,{status:f.status,headers:T});default:return fetch(h)}if(_!=="0")return new Response(`sysStatus = ${_}`);if(U==="1")return new Response(`inactive status = ${U}`);if(m){if(Number(y)<10)return fetch("https://app-sidecar.rhappsody.cloud/preview/notsupported.html");const j=await fetch("https://app-sidecar.rhappsody.cloud/preview/index.html"),V=new Headers(j.headers);return V.set("Server-Timing",`rhctx;desc="${x}"`),V.set("rh-ctx",x),new Response(j.body,{status:j.status,headers:V})}if(!m){const j=Date.now();if(F!=="0"&&F!=="null"){if(j<Number(F))return new Response(H(F),{headers:{"content-type":"text/html;charset=UTF-8"}})}}if(U==="1"){const j=$.searchParams.get("pw");let I=`https://serve-app-as.xpes.workers.dev/protected?ag=${G}&an=${z}&shared_secret=${N}`;if(j)I+=`&pw=${j}`;return fetch(I,{method:h.method})}const a=await b({ag:G,an:z,aid:M,reg:B,pl:y,color:g,lang:l,b64:v,startBlock:q,version:i});return new Response(a,{headers:{"Content-Type":"text/html; charset=utf-8"}})}};export{Oh as default};
