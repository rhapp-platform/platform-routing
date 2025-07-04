var xh=function(h,$){const O={alg:"HS256",typ:"JWT"},j=btoa(JSON.stringify(O)).replace(/[=]/g,""),Q=btoa(JSON.stringify(h)).replace(/[=]/g,""),z=`${j}.${Q}`,G=btoa($+z).slice(0,16);return`${z}.${G}`};async function w({ag:h,an:$,aid:O="xxxxx",pl:j=0,reg:Q="enam"}){const z=crypto.randomUUID(),G=crypto.randomUUID(),A={sid:z,ag:h,an:$,aid:O,pl:j,reg:Q,nonce:G,exp:Math.floor(Date.now()/1000)+28800};return{contextToken:xh(A,"rush64counter648hua26gxitrocks"),sid:z}}async function E({ag:h,an:$,aid:O,account:j,reg:Q,pl:z,color:G,lang:A="en",version:R,b64:U,startBlock:c,includeServiceWorker:g=!1}){const{contextToken:I,sid:f}=await w({ag:h,an:$,aid:O,account:j,reg:Q,pl:z,color:G});return`

<!DOCTYPE html>
<html lang="${A}">

<head>
    <meta charset="UTF-8">
    <title>@${h}/${$}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="a rhappsody app">
    <meta name="rh-sid" content="${f}">
    <meta name="rh-aid" content="${O}">
    <meta name="rh-account" content="${j}">
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
    ${g?'<!-- Service Worker -->\n    <script src="/sw.js"></script>':""}
    <!-- <script async src="/fn/ag-visit?sid=${f}&an=${$}"></script> -->
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
  `}function b(h){return`
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
  `}function p({ag:h,an:$,color:O}){return`{
  "name": "${h} ${$}",
  "short_name": "${h} ${$}",
  "description": "${h} ${$} page",
  "lang": "en",
  "orientation": "portrait",
  "display": "standalone",
  "background_color": "#${O}",
  "theme_color": "#${O}",
  "start_url": "/${$}",
  "features": ["powered by Rhappsody"],
  "icons": [
    {
      "src": "https://${h}.rhapp.app/${$}/icon",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`}function H({ag:h,an:$}){return`<!DOCTYPE html>
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
</html>`}function S({ag:h,an:$,sysStatus:O}){return`<!DOCTYPE html>
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
        <div class="app-name">@${h}/${$}</div>
        <div class="status-info">System Status: ${O}</div>
        <a href="https://${h}.rhapp.app" class="home-link">Go to App Group Home</a>
    </div>
</body>
</html>`}var F="rush64counter648hua26gxitrocks";var jh="https://ctx.rhap.cc";var Fh={async fetch(h){const $=new URL(h.url),O=$.hostname.split(".")[0],[,j,Q,z,G]=$.pathname.split("/");if(j==="cf-fonts")return fetch(h);if(j==="_"){const x=$.pathname.replace("/_/","");return fetch(`https://rh.rhap.cc/${x}`)}if(j==="__"){const x=$.searchParams.get("release");let K=$.pathname.replace("/__/","");if(x){const Y=K.split("/");Y[0]=x,K=Y.join("/")}return fetch(`https://release.rhapp.cc/${K}`)}if(j==="doc"){const x=$.pathname.replace("/doc/","");return fetch(`https://agdoc.rhappsody.com/${x}`)}if($.pathname.endsWith("/manifest")){const x=p({ag:O,an:j,color:"blue"});return new Response(x,{headers:{"Content-Type":"application/json"}})}if(j==="rh.ico"){const x=await fetch(`https://ico.rhappsody.cloud/${O}.ico`);if(x.ok)return x;else return new Response(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <rect x="0" y="0" width="32" height="32" rx="6" ry="6" fill="#FF8C42"/>
          <text x="16" y="23" font-family="Arial, sans-serif" font-size="22" font-weight="bold" text-anchor="middle" fill="white">rh</text>
        </svg>`,{headers:{"Content-Type":"image/svg+xml","Cache-Control":"public, max-age=3600"}})}if(j==="sw.js")return fetch("https://release.rhapp.cc/sw.js");if(j==="ai")return fetch(`https://${O}.rhapp.ai`);if(["account","apps","auth","claim","create","dashboard","groups","images","users","new","signup","used","visits"].includes(j)){const x=Q?`${Q}.html`:"index.html";return fetch(`https://app-sidecar.rhappsody.cloud/${j}/${x}`)}if(j==="fn"){const x=new URL(`https://cfn-${Q}.xpes.workers.dev`);for(let[X,D]of $.searchParams)x.searchParams.set(X,D);x.searchParams.set("ag",O),x.searchParams.set("shared_secret",F);let K=null;if(h.body)K=h.clone().body;const Y=new Request(x,{method:h.method,headers:h.headers,body:h.body});return fetch(Y)}if(j==="rha"){const x=new URL(`https://rha-${Q}.xpes.workers.dev`);for(let[X,D]of $.searchParams)x.searchParams.set(X,D);x.searchParams.set("ag",O),x.searchParams.set("shared_secret",F);let K=null;if(h.body)K=h.clone().body;const Y=new Request(x,{method:h.method,headers:h.headers,body:K});return fetch(Y)}const R=$.searchParams.has("latest")?`?latest&ts=${Date.now()}`:"",U=$.searchParams.has("preview"),c=$.searchParams.has("oldversion"),g=U?"preview.rhbin":c?"previous.rhbin":"app.rhbin",I=await fetch(`${jh}/${O}/${j}/app.ctx`);if(!I.ok)return new Response(H({ag:O,an:j}),{status:404,headers:{"Content-Type":"text/html; charset=utf-8"}});const f=await I.text(),J=I.headers.get("Content-Type"),[u,d,L,W,n,s,i,q,a]=J.split("/"),[T,_,l,y,B,r,N]=n.split("-");let o="start";if(Q)switch(Q){case"doc":const x=z?`${z}.html`:"index.html";return fetch(`https://appdoc.rhappsody.com/${x}`);case"_ctx":return new Response(JSON.stringify({account:L,aid:W,brand:s,color:i,lang:q,name:a,sysStatus:T,status:_,version:l,pl:y,reg:B,exp:r,nbf:N}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, PUT, DELETE, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization, X-Client-ID,rh-tag"}});case"icon":const K=`https://sb.rhap.cc/storage/v1/object/public/apps/${L}/${W}/app-icon.png`;return fetch(K);case"banner":const Y=`https://sb.rhap.cc/storage/v1/object/public/apps/${L}/${W}/banner.png`;return fetch(Y);case"social":const X=`https://sb.rhap.cc/storage/v1/object/public/apps/${L}/${W}/social.png`;return fetch(X);case"rha":try{let M=`https://rha-${z}.xpes.workers.dev?ag=${O}&an=${j}&shared_secret=${F}&rh_ctx=${J}`,v=null;if(h.body)v=h.clone().body;const C=new Request(M,{method:h.method,headers:h.headers,body:v}),V=await fetch(C),Z=new Headers(V.headers);if(Z.set("Access-Control-Allow-Origin","*"),Z.set("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS"),Z.set("Access-Control-Allow-Headers","Content-Type, Authorization, X-Client-ID,rh-tag"),!V.ok)throw new Error(`Snippet HTTP error status: ${V.status}`);return new Response(V.body,{status:V.status,statusText:V.statusText,headers:Z})}catch(M){return new Response(`Error in snippet: ${M.message}`,{status:555})}break;case"fn":try{let M=`https://cfn-${z}.xpes.workers.dev?ag=${O}&an=${j}&shared_secret=${F}&rh_ctx=${J}`,v=null;if(h.body)v=h.clone().body;const C=new Request(M,{method:h.method,headers:h.headers,body:v}),V=await fetch(C),Z=new Headers(V.headers);if(Z.set("Access-Control-Allow-Origin","*"),Z.set("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS"),Z.set("Access-Control-Allow-Headers","Content-Type, Authorization"),!V.ok)throw new Error(`Snippet HTTP error status: ${V.status}`);return new Response(V.body,{status:V.status,statusText:V.statusText,headers:Z})}catch(M){return new Response(`Error in snippet: ${M.message}`,{status:555})}break;case"go":o=z;break;case"manifest":break;case"icon":return fetch(`https://sb.rhap.cc/storage/v1/object/public/apps/${O}/${j}/app-icon.png`);case"as":const D=$.searchParams.get("pw"),t=$.searchParams.get("role");let m=`${G?`https://serve-app-as.xpes.workers.dev/${z}/${G}`:`https://serve-app-as.xpes.workers.dev/${z}`}?ag=${O}&an=${j}&shared_secret=${F}`;if(D)m+=`&pw=${D}`;if(t)m+=`&role=${t}`;return fetch(m,{method:h.method});case"img":return fetch(`https://pub-${B}.rhappsody.cloud/${L}/${W}/images/${z}.png`);case"is":case"app":case"source":case"data":case"edit":case"images":case"assets":case"overview":case"users":case"share":case"install":case"info":case"profile":case"admin":case"login":case"inbox":case"splash":case"plugins":case"publish":case"contact":case"_dev":case"help":case"ask":case"chat":case"blog":case"files":case"attachments":const hh=z?`${z}.html`:"index.html",P=await fetch(`https://app-sidecar.rhappsody.cloud/${Q}/${hh}`),k=new Headers(P.headers);return k.set("Server-Timing",`rhctx;desc="${J}"`),k.set("rh-ctx",J),new Response(P.body,{status:P.status,headers:k});default:return fetch(h)}if(T!=="0")return new Response(S({ag:O,an:j,sysStatus:T}),{status:503,headers:{"Content-Type":"text/html; charset=utf-8"}});if(_==="1")return new Response(`inactive status = ${_}`);if(U){if(Number(y)<10)return fetch("https://app-sidecar.rhappsody.cloud/preview/notsupported.html");const x=await fetch("https://app-sidecar.rhappsody.cloud/preview/index.html"),K=new Headers(x.headers);return K.set("Server-Timing",`rhctx;desc="${J}"`),K.set("rh-ctx",J),new Response(x.body,{status:x.status,headers:K})}if(!U){const x=Date.now();if(N!=="0"&&N!=="null"){if(x<Number(N))return new Response(b(N),{headers:{"content-type":"text/html;charset=UTF-8"}})}}if(_==="1"){const x=$.searchParams.get("pw");let Y=`https://serve-app-as.xpes.workers.dev/protected?ag=${O}&an=${j}&shared_secret=${F}`;if(x)Y+=`&pw=${x}`;return fetch(Y,{method:h.method})}const e=await E({ag:O,an:j,aid:W,reg:B,pl:y,color:i,lang:q,b64:f,startBlock:o,version:l});return new Response(e,{headers:{"Content-Type":"text/html; charset=utf-8"}})}};export{Fh as default};
