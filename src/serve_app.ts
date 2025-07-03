import renderApp from "./renderApp2";
import renderLiveIn from "./renderLiveIn";
import renderExpired from "./renderExpired";
import renderManifest from "./renderManifest";
import render404 from "./render404";

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// CONSTANTS AND CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════════════════════

const CFN_SHARED_SECRET = "rush64counter648hua26gxitrocks";
const SBS_BASE = "https://sb.rhap.cc/storage/v1/object/public/apps";
const CTX_BASE = "https://ctx.rhap.cc";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════════════════════

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default {
  async fetch(request) {
    // ═══════════════════════════════════════════════════════════════════════════════════════════
    // PARSE URL COMPONENTS
    // • ag = hostname.split(".")[0]  (e.g., "bob" from bob.rhapp.app)
    // • [an, sidecar, block, other] = pathname.split("/")
    // ═══════════════════════════════════════════════════════════════════════════════════════════
    
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, sidecar, block, other] = url.pathname.split("/");

    // ═══════════════════════════════════════════════════════════════════════════════════════════
    // LEVEL 1: SPECIAL SYSTEM ROUTES
    // ═══════════════════════════════════════════════════════════════════════════════════════════
    
    // ──────────────────────────────────────
    // cf-fonts → Cloudflare Font Optimization proxy
    // ──────────────────────────────────────
    if (an === "cf-fonts") {
      return fetch(request);
    }

    // ──────────────────────────────────────
    // _ (runtime) → rh.rhap.cc
    // ──────────────────────────────────────
    if (an === "_") {
      const rhPath = url.pathname.replace("/_/", "");
      return fetch(`https://rh.rhap.cc/${rhPath}`);
    }

    // ──────────────────────────────────────
    // release → release.rhapp.cc (R2 releases)
    // ──────────────────────────────────────
    if (an === "release") {
      const releasePath = url.pathname.replace("/release/", "");
      return fetch(`https://release.rhapp.cc/${releasePath}`);
    }

    // ──────────────────────────────────────
    // _doc (docs) → doc.rhap.cc
    // ──────────────────────────────────────
    if (an === "_doc") {
      const docPath = url.pathname.replace("/_doc/", "");
      return fetch(`https://doc.rhap.cc/${docPath}`);
    }

    // ═══════════════════════════════════════════════════════════════════════════════════════════
    // LEVEL 2: APP GROUP (AG) LEVEL ROUTES
    // ═══════════════════════════════════════════════════════════════════════════════════════════
    
    // ──────────────────────────────────────
    // /manifest → JSON response
    // ──────────────────────────────────────
    if (url.pathname.endsWith("/manifest")) {
      return new Response(
        JSON.stringify(renderManifest({ ag, an, name: an, color: "blue" })),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ──────────────────────────────────────
    // Static File Proxying (fetched from external sources)
    // • rh.ico → Supabase storage
    // • sw.js → release.rhapp.cc (must be root-level for full domain scope)
    // ──────────────────────────────────────
    if (an === "rh.ico")
      return fetch(
        `https://sb.rhap.cc/storage/v1/object/public/apps/_system/ico/blue.ico`
      );
    if (an === "sw.js")
      return fetch(`https://release.rhapp.cc/sw.js`);


    // ──────────────────────────────────────
    // Special AN Names → app-sidecar.rhappsody.cloud/<an>/
    // account, apps, auth, claim, create, dashboard, groups,
    // images, users, new, signup, used, visits
    // ──────────────────────────────────────
    const validSpecialAnNames = [
      "account",
      "apps",
      "auth",
      "claim",
      "create",
      "dashboard",
      "groups",
      "images",
      "users",
      "new",
      "signup",
      "used",
      "visits",
    ];
    if (validSpecialAnNames.includes(an)) {
      const SC = sidecar ? `${sidecar}.html` : "index.html";
      return fetch(`https://app-sidecar.rhappsody.cloud/${an}/${SC}`);
    }

    // ──────────────────────────────────────
    // fn (CFN calls) → cfn-*.xpes.workers.dev
    // https://<ag>.rhapp.app/fn/<cfnname>
    // ──────────────────────────────────────
    if (an === "fn") {
      const modifiedUrl = new URL(`https://cfn-${sidecar}.xpes.workers.dev`);
      // Copy existing query parameters from the original URL
      for (const [key, value] of url.searchParams) {
        modifiedUrl.searchParams.set(key, value);
      }
      modifiedUrl.searchParams.set("ag", ag);
      modifiedUrl.searchParams.set("shared_secret", CFN_SHARED_SECRET);

      let requestBody = null;
      if (request.body) {
        const clonedRequest = request.clone();
        requestBody = clonedRequest.body;
      }

      const modifiedRequest = new Request(modifiedUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
      return fetch(modifiedRequest);
    }


    // ──────────────────────────────────────
    // rha (actions) → rha-*.xpes.workers.dev
    // https://<ag>.rhapp.app/rha/<action>
    // ──────────────────────────────────────
    if (an === "rha") {
      const modifiedUrl = new URL(`https://rha-${sidecar}.xpes.workers.dev`);
      // Copy existing query parameters from the original URL
      for (const [key, value] of url.searchParams) {
        modifiedUrl.searchParams.set(key, value);
      }
      modifiedUrl.searchParams.set("ag", ag);
      modifiedUrl.searchParams.set("shared_secret", CFN_SHARED_SECRET);

      let requestBody = null;
      if (request.body) {
        const clonedRequest = request.clone();
        requestBody = clonedRequest.body;
      }

      const modifiedRequest = new Request(modifiedUrl, {
        method: request.method,
        headers: request.headers,
        body: requestBody,
      });
      return fetch(modifiedRequest);
    }

    // ═══════════════════════════════════════════════════════════════════════════════════════════
    // QUERY PARAMETER PARSING
    // • ?latest    → Forces latest version (adds timestamp)
    // • ?preview   → Preview mode (requires pl >= 10)
    // • ?oldversion → Uses previous.rhbin instead of app.rhbin
    // ═══════════════════════════════════════════════════════════════════════════════════════════
    
    const hasLatest = url.searchParams.has("latest")
      ? `?latest&ts=${Date.now()}`
      : "";
    const hasPreview = url.searchParams.has("preview");
    const hasOldversion = url.searchParams.has("oldversion");

    const appFilename = hasPreview
      ? "preview.rhbin"
      : hasOldversion
      ? "previous.rhbin"
      : "app.rhbin";

    // ═══════════════════════════════════════════════════════════════════════════════════════════
    // LEVEL 3: FETCH APP CONTEXT (CTX)
    // Fetch: https://ctx.rhap.cc/<ag>/<an>/app.ctx
    // → If 404: Return "app not found"
    // → Extract context from Content-Type header
    // ═══════════════════════════════════════════════════════════════════════════════════════════
    
    const appBin = await fetch(`${CTX_BASE}/${ag}/${an}/app.ctx`);
    
    if (!appBin.ok) {
      return new Response(render404({ ag, an }), {
        status: 404,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }
    
    const b64 = await appBin.text();

    // ──────────────────────────────────────
    // Extract context from Content-Type header:
    // • account, aid, brand, color, lang, name
    // • sysStatus, status, version, pl, reg, exp, nbf
    // ──────────────────────────────────────
    const CT = appBin.headers.get("Content-Type");
    const [_a, _x, account, aid, rest, brand, color, lang, name] =
      CT.split("/");
    const [sysStatus, status, version, pl, reg, exp, nbf] = rest.split("-");

    // ═══════════════════════════════════════════════════════════════════════════════════════════
    // LEVEL 4: APP-LEVEL SIDECAR ROUTES
    // ═══════════════════════════════════════════════════════════════════════════════════════════
    
    let startBlock = "start"; // Default start block, can be overridden by /go/<block>

    if (sidecar) {
      switch (sidecar) {
        // ──────────────────────────────────────
        // _ctx → JSON context
        // ──────────────────────────────────────
        case "_ctx":
          return new Response(
            JSON.stringify({
              account,
              aid,
              brand,
              color,
              lang,
              name,
              sysStatus,
              status,
              version,
              pl,
              reg,
              exp,
              nbf,
            }),
            {
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-ID,rh-tag",
              },
            }
          );
        // ──────────────────────────────────────
        // icon/banner/social → Supabase storage
        // ──────────────────────────────────────
        case "icon":
          const iconPath = `https://sb.rhap.cc/storage/v1/object/public/apps/${account}/${aid}/app-icon.png`;
          return fetch(iconPath);
        case "banner":
          const bannerPath = `https://sb.rhap.cc/storage/v1/object/public/apps/${account}/${aid}/banner.png`;
          return fetch(bannerPath);
        case "social":
          const socialPath = `https://sb.rhap.cc/storage/v1/object/public/apps/${account}/${aid}/social.png`;
          return fetch(socialPath);

        // ──────────────────────────────────────
        // rhapp.js → app.js from R2
        // ──────────────────────────────────────
        case "rhapp.js":
          const appBinPath = `https://pub-${reg}.rhap.cc/${account}/${aid}/app.js`;
          const appBin = await fetch(appBinPath);
          const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          };
          return new Response(appBin.body, {
            headers: {
              ...corsHeaders,
              ...appBin.headers,
            },
          });
        // ──────────────────────────────────────
        // rha/<action> → rha-*.xpes.workers.dev + context
        // ──────────────────────────────────────
        case "rha":

          try {
            // const modifiedUrl44 = new URL(
            //   `https://cfn-${block}.xpes.workers.dev`
            // );
            let modurl = `https://rha-${block}.xpes.workers.dev?ag=${ag}&an=${an}&shared_secret=${CFN_SHARED_SECRET}&rh_ctx=${CT}`;
            // // Copy existing query parameters from the original URL
            // for (const [key, value] of url.searchParams) {
            //   modifiedUrl.searchParams.set(key, value);
            // }

            // modifiedUrl.searchParams.set("ag", ag);
            // modifiedUrl.searchParams.set("an", an);
            // modifiedUrl.searchParams.set("shared_secret", CFN_SHARED_SECRET);
            // modifiedUrl.searchParams.set("rh_ctx", CT);

            let requestBody = null;
            if (request.body) {
              const clonedRequest = request.clone();
              requestBody = clonedRequest.body;
            }

            const modifiedRequest = new Request(modurl, {
              method: request.method,
              headers: request.headers,
              body: requestBody,
            });

            // return new Response(modurl);

            const response = await fetch(modifiedRequest);
            const newHeaders = new Headers(response.headers);
            newHeaders.set("Access-Control-Allow-Origin", "*");
            newHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            newHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Client-ID,rh-tag");
            if (!response.ok) {
              throw new Error(`Snippet HTTP error status: ${response.status}`);
            }
            return new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: newHeaders,
            });
          } catch (error) {
            return new Response(`Error in snippet: ${error.message}`, {
              status: 555,
            });
          }
          break;

        // ──────────────────────────────────────
        // fn/<cfn> → cfn-*.xpes.workers.dev
        // ──────────────────────────────────────
        case "fn":

          try {
            // const modifiedUrl44 = new URL(
            //   `https://cfn-${block}.xpes.workers.dev`
            // );
            let modurl = `https://cfn-${block}.xpes.workers.dev?ag=${ag}&an=${an}&shared_secret=${CFN_SHARED_SECRET}&rh_ctx=${CT}`;
            // // Copy existing query parameters from the original URL
            // for (const [key, value] of url.searchParams) {
            //   modifiedUrl.searchParams.set(key, value);
            // }

            // modifiedUrl.searchParams.set("ag", ag);
            // modifiedUrl.searchParams.set("an", an);
            // modifiedUrl.searchParams.set("shared_secret", CFN_SHARED_SECRET);
            // modifiedUrl.searchParams.set("rh_ctx", CT);

            let requestBody = null;
            if (request.body) {
              const clonedRequest = request.clone();
              requestBody = clonedRequest.body;
            }

            const modifiedRequest = new Request(modurl, {
              method: request.method,
              headers: request.headers,
              body: requestBody,
            });

            // return new Response(modurl);

            const response = await fetch(modifiedRequest);
            const newHeaders = new Headers(response.headers);
            newHeaders.set("Access-Control-Allow-Origin", "*");
            newHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            newHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
            if (!response.ok) {
              throw new Error(`Snippet HTTP error status: ${response.status}`);
            }
            return new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: newHeaders,
            });
          } catch (error) {
            return new Response(`Error in snippet: ${error.message}`, {
              status: 555,
            });
          }
          break;

        // ──────────────────────────────────────
        // go/<block> → Set custom start block
        // ──────────────────────────────────────
        case "go":
          startBlock = block;
          break;
        case "manifest":
          // ...need to serve APP manifest here....
          break;

        case "icon":
          return fetch(
            `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/app-icon.png`
          );

        // ──────────────────────────────────────
        // as → serve-as functionality
        // ──────────────────────────────────────
        case "as":
          const pw = url.searchParams.get("pw");
          const role = url.searchParams.get("role");
          const base = other
            ? `https://serve-app-as.xpes.workers.dev/${block}/${other}`
            : `https://serve-app-as.xpes.workers.dev/${block}`;
          let URL = `${base}?ag=${ag}&an=${an}&shared_secret=${CFN_SHARED_SECRET}`;
          if (pw) URL += `&pw=${pw}`;
          if (role) URL += `&role=${role}`;
          return fetch(URL, {
            method: request.method,
          });
          break;
        // ──────────────────────────────────────
        // img/<name> → R2 images
        // ──────────────────────────────────────
        case "img":
          return fetch(`https://pub-${reg}.rhappsody.cloud/${account}/${aid}/images/${block}.png`);
        // ──────────────────────────────────────
        // Sidecar Pages → app-sidecar.rhappsody.cloud/<sidecar>/<block>.html
        // is, app, source, data, edit, images, assets, overview, users,
        // share, install, info, profile, admin, login, inbox, splash,
        // plugins, publish, contact, _dev, help, ask, chat, blog, files
        // ──────────────────────────────────────
        case "is":
        case "app":
        case "source":
        case "data":
        case "edit":
        case "images":
        case "assets":
        case "overview":
        case "users":
        case "share":
        case "install":
        case "info":
        case "profile":
        case "admin":
        case "login":
        case "inbox":
        case "splash":
        case "plugins":
        case "publish":
        case "contact":
        case "_dev":
        case "help":
        case "ask":
        case "chat":
        case "blog":
        case "files":
        case "attachments":
          const SIDECARPAGE = block ? `${block}.html` : "index.html";
          const sidecarResponse = await fetch(
            `https://app-sidecar.rhappsody.cloud/${sidecar}/${SIDECARPAGE}`
          );
          const newHeaders = new Headers(sidecarResponse.headers);
          newHeaders.set("Server-Timing", `rhctx;desc="${CT}"`);
          newHeaders.set("rh-ctx", CT);
          return new Response(sidecarResponse.body, {
            status: sidecarResponse.status,
            headers: newHeaders,
          });

        default:
          // if we have any other sidecar
          return fetch(request);
      }
    }

    // ═══════════════════════════════════════════════════════════════════════════════════════════
    // LEVEL 5: APP STATUS & ACCESS CHECKS
    // ═══════════════════════════════════════════════════════════════════════════════════════════
    
    // ──────────────────────────────────────
    // 1. System Status Check
    // sysStatus !== 0 → Return error
    // ──────────────────────────────────────
    if (sysStatus !== "0") 
      return new Response(`sysStatus = ${sysStatus}`);

    // ──────────────────────────────────────
    // 2. App Status Check  
    // status === 1 → Inactive/Password protected
    // ──────────────────────────────────────
    if (status === "1") 
      return new Response(`inactive status = ${status}`);

    // ──────────────────────────────────────
    // 3. Preview Mode Check (?preview)
    // pl < 10 → Not supported
    // Otherwise → app-sidecar.rhappsody.cloud/preview/
    // ──────────────────────────────────────
    if (hasPreview) {
      if (Number(pl) < 10)
        return fetch(
          `https://app-sidecar.rhappsody.cloud/preview/notsupported.html`
        );

      const previewResponse = await fetch(
        `https://app-sidecar.rhappsody.cloud/preview/index.html`
      );
      const newH = new Headers(previewResponse.headers);
      newH.set("Server-Timing", `rhctx;desc="${CT}"`);
      newH.set("rh-ctx", CT);
      return new Response(previewResponse.body, {
        status: previewResponse.status,
        headers: newH,
      });
    }

    // ──────────────────────────────────────
    // 4. Time-Based Access (non-preview only)
    // nbf check → If not live yet → renderLiveIn()
    // exp check → If expired → renderExpired() [commented out]
    // ──────────────────────────────────────
    if (!hasPreview) {
      const now = Date.now();
      
      // Check if app is not yet live (nbf = not before)
      if (nbf !== "0" && nbf !== "null") {
        if (now < Number(nbf)) {
          return new Response(renderLiveIn(nbf), {
            headers: {
              "content-type": "text/html;charset=UTF-8",
            },
          });
        }
      }
      
      // Check if app has expired (currently commented out)
      // if (exp !== "0") {
      //   if (now > Number(exp)) {
      //     return new Response(renderExpired({ exp, lang }), {
      //       headers: {
      //         "content-type": "text/html;charset=UTF-8",
      //         "server-timing": `rhctx;desc="${CT}"`,
      //       },
      //     });
      //   }
      // }
    }

    // ──────────────────────────────────────
    // Password Protected App Check
    // status === 1 → serve-app-as.xpes.workers.dev/protected
    // ──────────────────────────────────────
    if (status === "1") {
      const pw = url.searchParams.get("pw");
      const base = `https://serve-app-as.xpes.workers.dev/protected`;
      let URL = `${base}?ag=${ag}&an=${an}&shared_secret=${CFN_SHARED_SECRET}`;
      if (pw) URL += `&pw=${pw}`;
      return fetch(URL, {
        method: request.method,
      });
    }

    // ═══════════════════════════════════════════════════════════════════════════════════════════
    // LEVEL 6: RENDER APPLICATION
    // All checks passed - render the app
    // ═══════════════════════════════════════════════════════════════════════════════════════════

    const html = await renderApp({
      ag,         // app group
      an,         // app name
      aid,        // app id
      reg,        // region
      pl,         // plan level
      color,      // theme color
      lang,       // language
      b64,        // base64 app binary
      startBlock, // starting block (default: "start", override with /go/<block>)
      version     // app version
    });

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  },
};
