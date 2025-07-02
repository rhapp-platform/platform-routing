import renderApp from "./renderApp2";
import renderLiveIn from "./renderLiveIn";
import renderExpired from "./renderExpired";
import renderManifest from "./renderManifest";

const CFN_SHARED_SECRET = "rush64counter648hua26gxitrocks";
const SBS_BASE = "https://sb.rhap.cc/storage/v1/object/public/apps";
const CTX_BASE = "https://ctx.rhap.cc";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Function to convert ArrayBuffer to Base64
// Function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer); // Create a byte array from the buffer
  const len = bytes.byteLength;

  // Iterate through each byte and build a binary string
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // Encode the binary string to Base64
  return btoa(binary);
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, sidecar, block, other] = url.pathname.split("/");

    // allow Cloudflare Font Optimation to work for everying
    if (an === "cf-fonts") {
      // return new Response("cf-fonts here");
      return fetch(request);
    }

    // Runtime local path
    if (an === "_") {
      // strip /ops/ from the pathname
      const rhPath = url.pathname.replace("/_/", "");
      // return new Response(rhPath);
      return fetch(`https://rh.rhap.cc/${rhPath}`);
    }

    // Runtime local path
    if (an === "_op") {
      // strip /ops/ from the pathname
      const opsPath = url.pathname.replace("/_op/", "");
      return fetch(`https://op.rhap.cc/${opsPath}`);
    }

    // Runtime local path
    if (an === "_doc") {
      // strip /ops/ from the pathname
      const docPath = url.pathname.replace("/_doc/", "");
      return fetch(`https://doc.rhap.cc/${docPath}`);
    }

    // MANIFEST START
    // if we have https://<ag>.rhapp.app/<an>/manifest, serve that
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
    // MANIFEST END

    // HANDLE IMAGES at AG level: https://<ag>.rhapp.app/_img/<sidecar>/<block>
    // HANDLE IMAGES at AG level: https://<ag>.rhapp.app/_img/<tag>/<variant>
    if (an === "_img") {
      const variant = block ? block : "orig";
      const builtIn = await fetch(
        `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/_img/${sidecar}/${variant}.png`
      );
      return builtIn;
    }
    // END HANDLE IMAGES

    // HANDLE SYSTEM ASSETS at AG level: https://<ag>.rhapp.app/_assets/<sidecar>/<block>
    // HANDLE SYSTEM ASSETS at AG level: https://<ag>.rhapp.app/_assets/<tag>/<variant>
    // "sidecar" is the folder name, "block" is the actual asset name WITH extension included!!!!
    if (an === "_assets") {
      const builtIn = await fetch(
        `https://sb.rhap.cc/storage/v1/object/public/apps/_system/${sidecar}/${block}`
      );
      return builtIn;
    }
    // END HANDLE IMAGES
    // HANDLE SPECIAL STATIC FILES
    if (an === "rh.ico")
      return fetch(
        `https://sb.rhap.cc/storage/v1/object/public/apps/_system/ico/blue.ico`
      );
    if (an === "sw.js")
      return fetch(`https://app-sidecar.rhappsody.cloud/sw.js`);

    if (an === "_rhapp.js") return fetch(`${SBS_BASE}/${ag}/_rhapp.js`);
    // END HANDLE SPECIAL STATIC FILES

    if (an === "_ai") {
      // Strip off first segment of pathname
      const pathParts = url.pathname.split("/");
      pathParts.shift(); // Remove empty first element from leading slash
      pathParts.shift(); // Remove _ai segment
      const aiPath = pathParts.join("/");
      return fetch(`https://ai.rhap.cc/${aiPath}`);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////   **********  HANDLE SPECIAL "AN" NAMES  //////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // HANDLE AG level SPECIAL "AN" NAMES
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

    /////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////   **********  CFN CALLs AT AG LEVEL  /////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // HANDLE AG SPECIFIC CFN CALLS: https://<ag>.rhapp.app/fn/<cfnname>
    if (an === "fn") {
      // handle ag specific cfn calls:
      //http://<ag>.rhapp.app/fn/<cfnname>
      // NOTE: BODY PASSTHRU now enabled!
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


    /////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////   **********  ACTION CALLs AT AG LEVEL  /////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // HANDLE AG SPECIFIC CFN CALLS: https://<ag>.rhapp.app/fn/<cfnname>
    if (an === "rha") {
      // handle ag specific cfn calls:
      //http://<ag>.rhapp.app/fn/<cfnname>
      // NOTE: BODY PASSTHRU now enabled!
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

    /////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////******* PARSE APP SERVING QUERY    ////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const hasLatest = url.searchParams.has("latest")
      ? `?latest&ts=${Date.now()}`
      : "";
    const hasPreview = url.searchParams.has("preview");
    const hasOldversion = url.searchParams.has("oldversion");
    // END PARSE QUERY PARAMS

    const appFilename = hasPreview
      ? "preview.rhbin"
      : hasOldversion
      ? "previous.rhbin"
      : "app.rhbin";

    //https:fly.storage.tigris.dev/pub.rhapp.net/bob/derp2/app.html
    /////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////******* FETCH CTX/APPBIN    ////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const appBin = await fetch(`${CTX_BASE}/${ag}/${an}/app.ctx`);
    // HANDLE APP NOT FOUND SCENARIO START
    if (!appBin.ok)
      return new Response(`app! @${ag}/${an} not found here....`, {
        status: 404,
      });
    // return fetch(`https://app-sidecar.rhappsody.cloud/dne/index.html?latest`);
    // HANDLE APP NOT FOUND SCENARIO END
    const b64 = await appBin.text();
    // const b64 = arrayBufferToBase64(arrayBuffer);

    /////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////******* GET CONTEXT FROM CONTENT-TYPE    ////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const CT = appBin.headers.get("Content-Type");
    const [_a, _x, account, aid, rest, brand, color, lang, name] =
      CT.split("/");
    const [sysStatus, status, version, pl, reg, exp, nbf] = rest.split("-");

    /////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////******* APP LEVEL SIDECAR (NEEDS CONTEXT SO IT IS HERE)   ///////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    let startBlock = "start"; // define this here becasue "go" case below needs it

    if (sidecar) {
      switch (sidecar) {
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
        case "icon":
          const iconPath = `https://sb.rhap.cc/storage/v1/object/public/apps/${account}/${aid}/app-icon.png`;
          return fetch(iconPath);
        case "banner":
          const bannerPath = `https://sb.rhap.cc/storage/v1/object/public/apps/${account}/${aid}/banner.png`;
          return fetch(bannerPath);
        case "social":
          const socialPath = `https://sb.rhap.cc/storage/v1/object/public/apps/${account}/${aid}/social.png`;
          return fetch(socialPath);

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
        // return new Response(appBin, {
        //   headers: corsHeaders,
        // });
        case "rha":
          // handle an specific action calls:
          // https://<ag>.rhapp.app/rha/<cfnname>/<an>

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

        case "fn":
          // handle an specific cfn calls:
          // https://<ag>.rhapp.app/<an>/fn/<cfnname>

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

        case "go":
          // this is a block name overide of start - https://<ag>.rhapp.app/<an>/go/<block>
          startBlock = block;
          break;
        case "manifest":
          // ...need to serve APP manifest here....
          break;

        case "icon":
          return fetch(
            `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/app-icon.png`
          );

        case "as":
          // Get password from query params if present
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
        // app image...in R2....
        case "img":
          return fetch(`https://pub-${reg}.rhappsody.cloud/${account}/${aid}/images/${block}.png`);
          // const variant = other ? other : "orig";
          // const builtIn = await fetch(
          //   `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/img/${block}/${variant}.png`
          // );
          // if (builtIn.ok) {
          //   return builtIn;
          // } else {
          //   return fetch(
          //     `https://sb.rhap.cc/storage/v1/object/public/system-public/images/${block}_default.png`
          //   );
          // }
        //   break;
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
        // case "preview": -- needs work....
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

    /////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////   **********  SERVING APP********** /////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////

    // SUSPENDED OR OVER QUOTA START!
    if (sysStatus !== "0") return new Response(`sysStatus = ${sysStatus}`);
    // return fetch(`https://app-sidecar.rhappsody.cloud/is/suspended.html`);
    // SUSPENDED OR OVER QUOTA END!

    // APP IS SET TO IN
    if (status === "1") return new Response(`inactive status = ${status}`);
    // return fetch(`https://app-sidecar.rhappsody.cloud/is/suspended.html`);
    // SUSPENDED OR OVER QUOTA END!

    // PREVIEW APP START   ?preview
    if (hasPreview) {
      // if the app is not supported on the plan, serve the notsupported.html page
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
    // PREVIEW APP END

    // EXPIRED AND GOLIVE CHECK FOR NON-PREVIEW APPS
    if (!hasPreview) {
      // LIVEIN APP CHECK
      const now = Date.now();
      if (nbf !== "0" && nbf !== "null") {
        if (now < Number(nbf)) {
          return new Response(renderLiveIn(nbf), {
            headers: {
              "content-type": "text/html;charset=UTF-8",
            },
          });
        }
      }
      // LIVEIN APP CHECK END
      // EXPIRED APP CHECK
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
      // EXPIRED APP CHECK END
    }
    // EXPIRED AND GOLIVE CHECK FOR NON-PREVIEW APPS END

    // PASSWORD PROTECTED APP START!
    if (status === "1") {
      const pw = url.searchParams.get("pw");
      const base = `https://serve-app-as.xpes.workers.dev/protected`;
      let URL = `${base}?ag=${ag}&an=${an}&shared_secret=${CFN_SHARED_SECRET}`;
      if (pw) URL += `&pw=${pw}`;
      return fetch(URL, {
        method: request.method,
      });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////   CLEAR TO SERVE/////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////

    // STUB START
    // return new Response(
    //   `<html lang="en"><head>
    //     <meta charset="UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <title>STUB</title>
    //     <link rel="stylesheet" href="https://r.rhap.cc/latest/rh.css?latest">
    //     <script src="https://r.rhap.cc/latest/rhappsody-x.js?latest"></script>
    //     <script src="/${an}/rhapp.js?latest"></script>
    // </head>
    // <body>
    // <h1>${aid}</h1>
    // </body>
    //       </html>`,
    //   {
    //     headers: {
    //       "Content-Type": "text/html; charset=utf-8",
    //     },
    //   }
    // );
    // STUB END
    // RENDER APP START

    // const b64 = "1234567890";

    const html = await renderApp({
      ag,
      an,
      aid,
      reg,
      pl,
      color,
      lang,
      b64,
      startBlock,
      version,
    });

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
    // RENDER APP END
  },
};
