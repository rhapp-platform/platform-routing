import renderApp from "./renderApp";
import renderLiveIn from "./renderLiveIn";
import renderExpired from "./renderExpired";
import renderManifest from "./renderManifest";

const CFN_SHARED_SECRET = "rush64counter648hua26gxitrocks";
const SBS_BASE = "https://sb.rhap.cc/storage/v1/object/public/apps";
const CTX_BASE = "https://pub-enam.rhap.cc/";

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
    // HANDLE SPECIAL STATIC FILES
    if (an === "rh.ico")
      return fetch(
        `https://sb.rhap.cc/storage/v1/object/public/apps/_system/ico/blue.ico`
      );
    if (an === "sw.js")
      return fetch(`https://app-sidecar.rhappsody.cloud/sw.js`);

    if (an === "_rhapp.js") return fetch(`${SBS_BASE}/${ag}/_rhapp.js`);
    // END HANDLE SPECIAL STATIC FILES

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
    const appBin = await fetch(
      `${CTX_BASE}/${ag}/${an}/${appFilename}${hasLatest}`
    );
    // HANDLE APP NOT FOUND SCENARIO START
    if (!appBin.ok)
      return new Response(`app @${ag}/${an} not found here....`, {
        status: 404,
      });
    // return fetch(`https://app-sidecar.rhappsody.cloud/dne/index.html?latest`);
    // HANDLE APP NOT FOUND SCENARIO END
    const arrayBuffer = await appBin.arrayBuffer();
    const b64 = arrayBufferToBase64(arrayBuffer);

    /////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////******* GET CONTEXT FROM CONTENT-TYPE    ////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const CT = appBin.headers.get("Content-Type");
    const [_a, _x, account, aid, rest] = CT.split("/");
    const [sysStatus, status, version, pl, reg, color, exp, nbf, appname] =
      rest.split("-");

    /////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////******* APP LEVEL SIDECAR (NEEDS CONTEXT SO IT IS HERE)   ///////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    let startBlock = "start"; // define this here becasue "go" case below needs it

    if (sidecar) {
      switch (sidecar) {
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
            if (!response.ok) {
              throw new Error(`Snippet HTTP error status: ${response.status}`);
            }
            return response;
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
        // case "img":
        //   if (block === "banner")
        //     return fetch(
        //       `https://placehold.co/800x200?text=@${ag}@${an}-banner`
        //     );
        //   const variant = other ? other : "orig";
        //   const builtIn = await fetch(
        //     `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/img/${block}/${variant}.png`
        //   );
        //   if (builtIn.ok) {
        //     return builtIn;
        //   } else {
        //     return fetch(
        //       `https://sb.rhap.cc/storage/v1/object/public/system-public/images/${block}_default.png`
        //     );
        //   }
        //   break;
        case "is":
        case "app":
        case "source":
        case "data":
        case "edit":
        case "images":
        case "users":
        case "share":
        case "info":
        case "settings":
        case "admin":
        // case "preview": -- needs work....
        case "login":
        case "inbox":
        case "splash":
        case "me":
        case "publish":
        case "contact":
        case "_dev":
        case "help":
        case "chat":
        case "blog":
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
    if (sysStatus !== "0")
      return fetch(`https://app-sidecar.rhappsody.cloud/is/suspended.html`);
    // SUSPENDED OR OVER QUOTA END!

    if (hasPreview) return appResponse;

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
      if (exp !== "0") {
        if (now > Number(exp)) {
          return new Response(renderExpired(exp), {
            headers: {
              "content-type": "text/html;charset=UTF-8",
            },
          });
        }
      }
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
    //     return new Response(
    //       `<html lang="en"><head>
    //     <meta charset="UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <title>STUB</title>
    //     <link rel="stylesheet" href="https://r.rhap.cc/latest/rh.css?latest">
    //     <script src="https://r.rhap.cc/latest/rhappsody-x.js?latest"></script>
    // </head>
    // <body>
    // <h1>STUB</h1>
    // </body>
    //       </html>`,
    //       {
    //         headers: {
    //           "Content-Type": "text/html; charset=utf-8",
    //         },
    //       }
    //     );
    // STUB END
    // RENDER APP START

    const html = await renderApp({
      ag,
      an,
      aid,
      reg,
      pl,
      color,
      b64,
      startBlock,
    });

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
    // RENDER APP END
  },
};
