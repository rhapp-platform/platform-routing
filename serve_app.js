var xO=function(O,$){const z={alg:"HS256",typ:"JWT"},j=btoa(JSON.stringify(z)).replace(/[=]/g,""),K=btoa(JSON.stringify(O)).replace(/[=]/g,""),J=`${j}.${K}`,X=btoa($+J).slice(0,16);return`${J}.${X}`};async function b({ag:O,an:$,aid:z="xxxxx",pl:j=0,reg:K="enam"}){const J=crypto.randomUUID(),X={sid:J,ag:O,an:$,aid:z,pl:j,reg:K,exp:Math.floor(Date.now()/1000)+28800};return{sessionToken:xO(X,"rush64counter648hua26gxitrocks"),sid:J}}async function f({ag:O,an:$,aid:z,account:j,reg:K,pl:J,color:X,lang:U="en",version:t,b64:P,startBlock:w}){const{sessionToken:R,sid:I}=await b({ag:O,an:$,aid:z,account:j,reg:K,pl:J,color:X});return`

<!DOCTYPE html>
<html lang="${U}">

<head>
    <meta charset="UTF-8">
    <title>@${O}/${$}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="a rhappsody app">
    <meta name="rh-sid" content="${I}">
    <meta name="rh-aid" content="${z}">
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
    <!-- <script async src="/fn/ag-visit?sid=${I}&an=${$}"></script> -->
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
<body class="light" data-rh-session-token="${R}"></body>
</html>
  `}function E(O){return`
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
            const t = "${O}";
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
  `}function C({ag:O,an:$,color:z}){return{name:`${O} ${$}`,short_name:`${O} ${$}`,description:`${O} ${$} page`,lang:"en",orientation:"portrait",display:"standalone",background_color:`#${z}`,theme_color:`#${z}`,start_url:`/${$}`,features:["powered by Rhappsody"],icons:[{src:`https://${O}.rhapp.app/${$}/icon`,sizes:"512x512",type:"image/png"}]}}function H({ag:O,an:$}){return`<!DOCTYPE html>
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
        <div class="app-name">@${O}/${$}</div>
        <a href="https://${O}.rhapp.app" class="home-link">Go to App Group Home</a>
    </div>
</body>
</html>`}var m="rush64counter648hua26gxitrocks";var jO="https://ctx.rhap.cc";var IO={async fetch(O){const $=new URL(O.url),z=$.hostname.split(".")[0],[,j,K,J,X]=$.pathname.split("/");if(j==="cf-fonts")return fetch(O);if(j==="_"){const x=$.pathname.replace("/_/","");return fetch(`https://rh.rhap.cc/${x}`)}if(j==="release"){const x=$.pathname.replace("/release/","");return fetch(`https://release.rhapp.cc/${x}`)}if(j==="_doc"){const x=$.pathname.replace("/_doc/","");return fetch(`https://doc.rhap.cc/${x}`)}if($.pathname.endsWith("/manifest"))return new Response(JSON.stringify(C({ag:z,an:j,name:j,color:"blue"})),{headers:{"Content-Type":"application/json"}});if(j==="rh.ico")return fetch("https://sb.rhap.cc/storage/v1/object/public/apps/_system/ico/blue.ico");if(j==="sw.js")return fetch("https://release.rhapp.cc/sw.js");if(["account","apps","auth","claim","create","dashboard","groups","images","users","new","signup","used","visits"].includes(j)){const x=K?`${K}.html`:"index.html";return fetch(`https://app-sidecar.rhappsody.cloud/${j}/${x}`)}if(j==="fn"){const x=new URL(`https://cfn-${K}.xpes.workers.dev`);for(let[G,F]of $.searchParams)x.searchParams.set(G,F);x.searchParams.set("ag",z),x.searchParams.set("shared_secret",m);let V=null;if(O.body)V=O.clone().body;const Z=new Request(x,{method:O.method,headers:O.headers,body:O.body});return fetch(Z)}if(j==="rha"){const x=new URL(`https://rha-${K}.xpes.workers.dev`);for(let[G,F]of $.searchParams)x.searchParams.set(G,F);x.searchParams.set("ag",z),x.searchParams.set("shared_secret",m);let V=null;if(O.body)V=O.clone().body;const Z=new Request(x,{method:O.method,headers:O.headers,body:V});return fetch(Z)}const t=$.searchParams.has("latest")?`?latest&ts=${Date.now()}`:"",P=$.searchParams.has("preview"),w=$.searchParams.has("oldversion"),R=P?"preview.rhbin":w?"previous.rhbin":"app.rhbin",I=await fetch(`${jO}/${z}/${j}/app.ctx`);if(!I.ok)return new Response(H({ag:z,an:j}),{status:404,headers:{"Content-Type":"text/html; charset=utf-8"}});const p=await I.text(),Y=I.headers.get("Content-Type"),[d,zO,D,h,u,n,g,c,s]=Y.split("/"),[k,A,l,y,v,a,L]=u.split("-");let i="start";if(K)switch(K){case"_ctx":return new Response(JSON.stringify({account:D,aid:h,brand:n,color:g,lang:c,name:s,sysStatus:k,status:A,version:l,pl:y,reg:v,exp:a,nbf:L}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, PUT, DELETE, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization, X-Client-ID,rh-tag"}});case"icon":const x=`https://sb.rhap.cc/storage/v1/object/public/apps/${D}/${h}/app-icon.png`;return fetch(x);case"banner":const V=`https://sb.rhap.cc/storage/v1/object/public/apps/${D}/${h}/banner.png`;return fetch(V);case"social":const Z=`https://sb.rhap.cc/storage/v1/object/public/apps/${D}/${h}/social.png`;return fetch(Z);case"rhapp.js":const G=`https://pub-${v}.rhap.cc/${D}/${h}/app.js`,F=await fetch(G),e={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, PUT, DELETE, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization"};return new Response(F.body,{headers:{...e,...F.headers}});case"rha":try{let M=`https://rha-${J}.xpes.workers.dev?ag=${z}&an=${j}&shared_secret=${m}&rh_ctx=${Y}`,N=null;if(O.body)N=O.clone().body;const S=new Request(M,{method:O.method,headers:O.headers,body:N}),Q=await fetch(S),W=new Headers(Q.headers);if(W.set("Access-Control-Allow-Origin","*"),W.set("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS"),W.set("Access-Control-Allow-Headers","Content-Type, Authorization, X-Client-ID,rh-tag"),!Q.ok)throw new Error(`Snippet HTTP error status: ${Q.status}`);return new Response(Q.body,{status:Q.status,statusText:Q.statusText,headers:W})}catch(M){return new Response(`Error in snippet: ${M.message}`,{status:555})}break;case"fn":try{let M=`https://cfn-${J}.xpes.workers.dev?ag=${z}&an=${j}&shared_secret=${m}&rh_ctx=${Y}`,N=null;if(O.body)N=O.clone().body;const S=new Request(M,{method:O.method,headers:O.headers,body:N}),Q=await fetch(S),W=new Headers(Q.headers);if(W.set("Access-Control-Allow-Origin","*"),W.set("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS"),W.set("Access-Control-Allow-Headers","Content-Type, Authorization"),!Q.ok)throw new Error(`Snippet HTTP error status: ${Q.status}`);return new Response(Q.body,{status:Q.status,statusText:Q.statusText,headers:W})}catch(M){return new Response(`Error in snippet: ${M.message}`,{status:555})}break;case"go":i=J;break;case"manifest":break;case"icon":return fetch(`https://sb.rhap.cc/storage/v1/object/public/apps/${z}/${j}/app-icon.png`);case"as":const q=$.searchParams.get("pw"),o=$.searchParams.get("role");let T=`${X?`https://serve-app-as.xpes.workers.dev/${J}/${X}`:`https://serve-app-as.xpes.workers.dev/${J}`}?ag=${z}&an=${j}&shared_secret=${m}`;if(q)T+=`&pw=${q}`;if(o)T+=`&role=${o}`;return fetch(T,{method:O.method});case"img":return fetch(`https://pub-${v}.rhappsody.cloud/${D}/${h}/images/${J}.png`);case"is":case"app":case"source":case"data":case"edit":case"images":case"assets":case"overview":case"users":case"share":case"install":case"info":case"profile":case"admin":case"login":case"inbox":case"splash":case"plugins":case"publish":case"contact":case"_dev":case"help":case"ask":case"chat":case"blog":case"files":case"attachments":const OO=J?`${J}.html`:"index.html",_=await fetch(`https://app-sidecar.rhappsody.cloud/${K}/${OO}`),B=new Headers(_.headers);return B.set("Server-Timing",`rhctx;desc="${Y}"`),B.set("rh-ctx",Y),new Response(_.body,{status:_.status,headers:B});default:return fetch(O)}if(k!=="0")return new Response(`sysStatus = ${k}`);if(A==="1")return new Response(`inactive status = ${A}`);if(P){if(Number(y)<10)return fetch("https://app-sidecar.rhappsody.cloud/preview/notsupported.html");const x=await fetch("https://app-sidecar.rhappsody.cloud/preview/index.html"),V=new Headers(x.headers);return V.set("Server-Timing",`rhctx;desc="${Y}"`),V.set("rh-ctx",Y),new Response(x.body,{status:x.status,headers:V})}if(!P){const x=Date.now();if(L!=="0"&&L!=="null"){if(x<Number(L))return new Response(E(L),{headers:{"content-type":"text/html;charset=UTF-8"}})}}if(A==="1"){const x=$.searchParams.get("pw");let Z=`https://serve-app-as.xpes.workers.dev/protected?ag=${z}&an=${j}&shared_secret=${m}`;if(x)Z+=`&pw=${x}`;return fetch(Z,{method:O.method})}const r=await f({ag:z,an:j,aid:h,reg:v,pl:y,color:g,lang:c,b64:p,startBlock:i,version:l});return new Response(r,{headers:{"Content-Type":"text/html; charset=utf-8"}})}};export{IO as default};
