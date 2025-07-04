var V0=function($,j){const z={alg:"HS256",typ:"JWT"},x=btoa(JSON.stringify(z)).replace(/[=]/g,""),O=btoa(JSON.stringify($)).replace(/[=]/g,""),J=`${x}.${O}`,G=btoa(j+J).slice(0,16);return`${J}.${G}`};async function b({ag:$,an:j,aid:z="xxxxx",pl:x=0,reg:O="enam"}){const J=crypto.randomUUID(),G=crypto.randomUUID(),U={sid:J,ag:$,an:j,aid:z,pl:x,reg:O,nonce:G,exp:Math.floor(Date.now()/1000)+28800};return{contextToken:V0(U,"rush64counter648hua26gxitrocks"),sid:J}}async function w({ag:$,an:j,aid:z,account:x,reg:O,pl:J,color:G,lang:U="en",version:p,b64:v,startBlock:g,includeServiceWorker:c=!1}){const{contextToken:I,sid:_}=await b({ag:$,an:j,aid:z,account:x,reg:O,pl:J,color:G});return`

<!DOCTYPE html>
<html lang="${U}">

<head>
    <meta charset="UTF-8">
    <title>@${$}/${j}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="a rhappsody app">
    <meta name="rh-sid" content="${_}">
    <meta name="rh-aid" content="${z}">
    <meta name="rh-account" content="${x}">
    <!-- Preload critical resources -->
    <link rel="preload" href="https://test.rh.local/core-rhapp/dist/rhapp.js" as="script">
    <link rel="preload" href="https://r.rhap.cc/latest/rh.css" as="style">
    <link rel="preload" href="https://public-enam.rhappsody.cloud/7f8c37cb-118b-44f7-814c-0332b392808f/08d97c15-6f06-420b-976f-2418bd9caa60/rhapp.bin" as="fetch" crossorigin>
    <link rel="icon" type="image/x-icon" href="/rh.ico">
    <!-- <link rel="manifest" href="${j}/manifest"> -->
    <!-- CSS should load first (render-blocking) -->
    <link rel="stylesheet" href="https://r.rhap.cc/latest/rh.css">
    <!-- JS library with async loading -->
    <script async src="https://test.rh.local/core-rhapp/dist/rhapp.js"></script>
    ${c?'<!-- Service Worker -->\n    <script src="/sw.js"></script>':""}
    <!-- <script async src="/fn/ag-visit?sid=${_}&an=${j}"></script> -->
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
<body class="light" data-rh-context-token="${I}"></body>
</html>
  `}function H($){return`
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
  `}function C({ag:$,an:j,color:z}){return{name:`${$} ${j}`,short_name:`${$} ${j}`,description:`${$} ${j} page`,lang:"en",orientation:"portrait",display:"standalone",background_color:`#${z}`,theme_color:`#${z}`,start_url:`/${j}`,features:["powered by Rhappsody"],icons:[{src:`https://${$}.rhapp.app/${j}/icon`,sizes:"512x512",type:"image/png"}]}}function S({ag:$,an:j}){return`<!DOCTYPE html>
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
        <div class="app-name">@${$}/${j}</div>
        <a href="https://${$}.rhapp.app" class="home-link">Go to App Group Home</a>
    </div>
</body>
</html>`}function R({ag:$,an:j,sysStatus:z}){return`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App Suspended</title>
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
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
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
            margin-bottom: 1rem;
            font-family: 'Courier New', monospace;
        }
        
        .status-info {
            font-size: 1rem;
            color: #666;
            margin-bottom: 3rem;
        }
        
        .home-link {
            display: inline-block;
            padding: 1rem 2.5rem;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
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
        <rh-logo size="200" color="#ff6b6b"></rh-logo>
        <div class="error-code">\u26A0</div>
        <div class="error-message">App Suspended</div>
        <div class="app-name">@${$}/${j}</div>
        <div class="status-info">System Status: ${z}</div>
        <a href="https://${$}.rhapp.app" class="home-link">Go to App Group Home</a>
    </div>
</body>
</html>`}var D="rush64counter648hua26gxitrocks";var x0="https://ctx.rhap.cc";var D0={async fetch($){const j=new URL($.url),z=j.hostname.split(".")[0],[,x,O,J,G]=j.pathname.split("/");if(x==="cf-fonts")return fetch($);if(x==="_"){const V=j.pathname.replace("/_/","");return fetch(`https://rh.rhap.cc/${V}`)}if(x==="__"){const V=j.searchParams.get("release");let K=j.pathname.replace("/__/","");if(V){const Y=K.split("/");Y[0]=V,K=Y.join("/")}return fetch(`https://release.rhapp.cc/${K}`)}if(x==="doc"){const V=j.pathname.replace("/doc/","");return fetch(`https://agdoc.rhappsody.com/${V}`)}if(j.pathname.endsWith("/manifest"))return new Response(JSON.stringify(C({ag:z,an:x,name:x,color:"blue"})),{headers:{"Content-Type":"application/json"}});if(x==="rh.ico"){const V=await fetch(`https://ico.rhappsody.cloud/${z}.ico`);if(V.ok)return V;else return new Response(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <rect x="0" y="0" width="32" height="32" rx="6" ry="6" fill="#FF8C42"/>
          <text x="16" y="23" font-family="Arial, sans-serif" font-size="22" font-weight="bold" text-anchor="middle" fill="white">rh</text>
        </svg>`,{headers:{"Content-Type":"image/svg+xml","Cache-Control":"public, max-age=3600"}})}if(x==="sw.js")return fetch("https://release.rhapp.cc/sw.js");if(["account","apps","auth","claim","create","dashboard","groups","images","users","new","signup","used","visits"].includes(x)){const V=O?`${O}.html`:"index.html";return fetch(`https://app-sidecar.rhappsody.cloud/${x}/${V}`)}if(x==="fn"){const V=new URL(`https://cfn-${O}.xpes.workers.dev`);for(let[M,F]of j.searchParams)V.searchParams.set(M,F);V.searchParams.set("ag",z),V.searchParams.set("shared_secret",D);let K=null;if($.body)K=$.clone().body;const Y=new Request(V,{method:$.method,headers:$.headers,body:$.body});return fetch(Y)}if(x==="rha"){const V=new URL(`https://rha-${O}.xpes.workers.dev`);for(let[M,F]of j.searchParams)V.searchParams.set(M,F);V.searchParams.set("ag",z),V.searchParams.set("shared_secret",D);let K=null;if($.body)K=$.clone().body;const Y=new Request(V,{method:$.method,headers:$.headers,body:K});return fetch(Y)}const p=j.searchParams.has("latest")?`?latest&ts=${Date.now()}`:"",v=j.searchParams.has("preview"),g=j.searchParams.has("oldversion"),c=v?"preview.rhbin":g?"previous.rhbin":"app.rhbin",I=await fetch(`${x0}/${z}/${x}/app.ctx`);if(!I.ok)return new Response(S({ag:z,an:x}),{status:404,headers:{"Content-Type":"text/html; charset=utf-8"}});const _=await I.text(),X=I.headers.get("Content-Type"),[d,u,L,h,n,s,l,q,a]=X.split("/"),[m,f,i,y,B,r,N]=n.split("-");let o="start";if(O)switch(O){case"doc":const V=J?`${J}.html`:"index.html";return fetch(`https://appdoc.rhappsody.com/${V}`);case"_ctx":return new Response(JSON.stringify({account:L,aid:h,brand:s,color:l,lang:q,name:a,sysStatus:m,status:f,version:i,pl:y,reg:B,exp:r,nbf:N}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, PUT, DELETE, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization, X-Client-ID,rh-tag"}});case"icon":const K=`https://sb.rhap.cc/storage/v1/object/public/apps/${L}/${h}/app-icon.png`;return fetch(K);case"banner":const Y=`https://sb.rhap.cc/storage/v1/object/public/apps/${L}/${h}/banner.png`;return fetch(Y);case"social":const M=`https://sb.rhap.cc/storage/v1/object/public/apps/${L}/${h}/social.png`;return fetch(M);case"rha":try{let W=`https://rha-${J}.xpes.workers.dev?ag=${z}&an=${x}&shared_secret=${D}&rh_ctx=${X}`,A=null;if($.body)A=$.clone().body;const E=new Request(W,{method:$.method,headers:$.headers,body:A}),Q=await fetch(E),Z=new Headers(Q.headers);if(Z.set("Access-Control-Allow-Origin","*"),Z.set("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS"),Z.set("Access-Control-Allow-Headers","Content-Type, Authorization, X-Client-ID,rh-tag"),!Q.ok)throw new Error(`Snippet HTTP error status: ${Q.status}`);return new Response(Q.body,{status:Q.status,statusText:Q.statusText,headers:Z})}catch(W){return new Response(`Error in snippet: ${W.message}`,{status:555})}break;case"fn":try{let W=`https://cfn-${J}.xpes.workers.dev?ag=${z}&an=${x}&shared_secret=${D}&rh_ctx=${X}`,A=null;if($.body)A=$.clone().body;const E=new Request(W,{method:$.method,headers:$.headers,body:A}),Q=await fetch(E),Z=new Headers(Q.headers);if(Z.set("Access-Control-Allow-Origin","*"),Z.set("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS"),Z.set("Access-Control-Allow-Headers","Content-Type, Authorization"),!Q.ok)throw new Error(`Snippet HTTP error status: ${Q.status}`);return new Response(Q.body,{status:Q.status,statusText:Q.statusText,headers:Z})}catch(W){return new Response(`Error in snippet: ${W.message}`,{status:555})}break;case"go":o=J;break;case"manifest":break;case"icon":return fetch(`https://sb.rhap.cc/storage/v1/object/public/apps/${z}/${x}/app-icon.png`);case"as":const F=j.searchParams.get("pw"),t=j.searchParams.get("role");let T=`${G?`https://serve-app-as.xpes.workers.dev/${J}/${G}`:`https://serve-app-as.xpes.workers.dev/${J}`}?ag=${z}&an=${x}&shared_secret=${D}`;if(F)T+=`&pw=${F}`;if(t)T+=`&role=${t}`;return fetch(T,{method:$.method});case"img":return fetch(`https://pub-${B}.rhappsody.cloud/${L}/${h}/images/${J}.png`);case"is":case"app":case"source":case"data":case"edit":case"images":case"assets":case"overview":case"users":case"share":case"install":case"info":case"profile":case"admin":case"login":case"inbox":case"splash":case"plugins":case"publish":case"contact":case"_dev":case"help":case"ask":case"chat":case"blog":case"files":case"attachments":const $0=J?`${J}.html`:"index.html",P=await fetch(`https://app-sidecar.rhappsody.cloud/${O}/${$0}`),k=new Headers(P.headers);return k.set("Server-Timing",`rhctx;desc="${X}"`),k.set("rh-ctx",X),new Response(P.body,{status:P.status,headers:k});default:return fetch($)}if(m!=="0")return new Response(R({ag:z,an:x,sysStatus:m}),{status:503,headers:{"Content-Type":"text/html; charset=utf-8"}});if(f==="1")return new Response(`inactive status = ${f}`);if(v){if(Number(y)<10)return fetch("https://app-sidecar.rhappsody.cloud/preview/notsupported.html");const V=await fetch("https://app-sidecar.rhappsody.cloud/preview/index.html"),K=new Headers(V.headers);return K.set("Server-Timing",`rhctx;desc="${X}"`),K.set("rh-ctx",X),new Response(V.body,{status:V.status,headers:K})}if(!v){const V=Date.now();if(N!=="0"&&N!=="null"){if(V<Number(N))return new Response(H(N),{headers:{"content-type":"text/html;charset=UTF-8"}})}}if(f==="1"){const V=j.searchParams.get("pw");let Y=`https://serve-app-as.xpes.workers.dev/protected?ag=${z}&an=${x}&shared_secret=${D}`;if(V)Y+=`&pw=${V}`;return fetch(Y,{method:$.method})}const e=await w({ag:z,an:x,aid:h,reg:B,pl:y,color:l,lang:q,b64:_,startBlock:o,version:i});return new Response(e,{headers:{"Content-Type":"text/html; charset=utf-8"}})}};export{D0 as default};
