// Serves the app.html from SBS

import renderLiveIn from "./renderLiveIn";
import renderExpired from "./renderExpired";
import renderManifest from "./renderManifest";

const CFN_SHARED_SECRET = "rush64counter648hua26gxitrocks";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, sidecar, block, other] = url.pathname.split("/");
    // Check for ?latest query param
    const hasLatest = url.searchParams.has("latest")
      ? `?latest&ts=${Date.now()}`
      : "";
    const hasPreview = url.searchParams.has("preview");
    const hasOldversion = url.searchParams.has("oldversion");
    const tigris = url.searchParams.has("tigris");

    //////////////////  EXPERIMENTAL //////////////////////////

    const htmlFile = hasPreview
      ? "preview.html"
      : hasOldversion
      ? "archive.html"
      : "app.html";
    // const appHTML = await fetch(
    //   `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/${htmlFile}${hasLatest}`
    // );

    //https:fly.storage.tigris.dev/pub.rhapp.net/bob/derp2/app.html
    const sbsBase = "https://sb.rhap.cc/storage/v1/object/public/apps/";
    const tigrisBase = "https://fly.storage.tigris.dev/pub.rhapp.net/";

    const base = tigris ? tigrisBase : sbsBase;

    const appHTML = await fetch(`${base}${ag}/${an}/${htmlFile}${hasLatest}`);

    const newappHeaders = new Headers(appHTML.headers);
    // newappHeaders.set("rh-ctx", rhCtx);
    // newappHeaders.set("Server-Timing", `rhctx;desc="${rhCtx}"`);
    // newappHeaders.set("rh-aid", aid);
    newappHeaders.set("content-type", "text/html; charset=utf-8");
    const appResponse = new Response(appHTML.body, {
      status: appHTML.status,
      headers: newappHeaders,
    });

    return appResponse;

    // return appHTML;
    //////////////////  EXPERIMENTAL //////////////////////////

    // AN Switch: https://<ag>.rhapp.app/<an>
    switch (an) {
      case "sw.js":
        // special handling for service worker - serve from root path to get wide scope!
        return fetch(`https://app-sidecar.rhappsody.cloud/sw.js`);
      case "fn":
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

      case "static":
        return fetch(
          `https://app-sidecar.rhappsody.cloud/${an}/${sidecar}?latest`
        );

      case "rh.ico":
        return fetch(
          `https://sb.rhap.cc/storage/v1/object/public/apps/_system/ico/blue.ico`
        );
      case "_img":
        const variant = block ? block : "orig";
        const builtIn = await fetch(
          `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/_img/${sidecar}/${variant}.png`
        );
        return builtIn;
      // return fetch(
      //   `https://sb.rhap.cc/storage/v1/object/public/system-public/images/${block}_default.png`
      // );

      // if (builtIn.ok) {
      //   return builtIn;
      // } else {
      //   return fetch(
      //     `https://sb.rhap.cc/storage/v1/object/public/system-public/images/${block}_default.png`
      //   );
      // }
      // break;

      // PREVIEW APPROCH - ALTERNATE APPROACH : https://<ag>.rhapp.app/preview/<an>
      // case "preview":
      //   // ok...the sidecar is now the "an"..... https://<ag>.rhapp.app/preview/<an>
      //   const previewHTML = await fetch(
      //     `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${sidecar}/preview.html${hasLatest}`
      //   );
      //   const newPreviewHeaders = new Headers(previewHTML.headers);
      //   // newPreviewHeaders.set("rh-ctx", rhCtx);
      //   // newPreviewHeaders.set("Server-Timing", `rhctx;desc="${rhCtx}"`);
      //   newPreviewHeaders.set("content-type", "text/html; charset=utf-8");
      //   return new Response(previewHTML.body, {
      //     status: previewHTML.status,
      //     headers: newPreviewHeaders,
      //   });

      case "apps":
      case "new":
      case "visits":
      case "create":
      case "auth":
      case "signup":
      case "account":
      case "dashboard":
      case "used":

      case "claim":
      case "dne":
        const SC =
          sidecar === "index.js"
            ? "index.js"
            : sidecar
            ? `${sidecar}.html`
            : "index.html";
        return fetch(`https://app-sidecar.rhappsody.cloud/${an}/${SC}`);
      case "api":
        return fetch(`https://api.rhapp.cc/test`);
    }
    // END AN Switch

    let startBlock = "start";
    // SIDECAR Processing: https://<ag>.rhapp.app/<an><sidecar>/<block>/<other>
    if (sidecar) {
      switch (sidecar) {
        case "manifest":
          // pass through to next section cuz we need to get app.ctx...
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
        case "go":
          // this is a block name overide of start
          startBlock = block;
          // https://<ag>.rhapp.app/<an>/go/<block>
          break;
        default:
          // if we have any other sidecar
          return fetch(request);
      }
    }
    // END SIDECAR Processing

    ///////////////////// SERVING A APP  https://<ag>.rhapp.app/<an> ///////////////////////

    ////////  CONTEXT START ///////////////////////
    const ctxResponse = await fetch(
      `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/app.ctx${hasLatest}`
    );
    if (!ctxResponse.ok)
      return fetch(`https://app-sidecar.rhappsody.cloud/dne/index.html?latest`);
    const contentType = ctxResponse.headers.get("content-type");
    const [_a, _r, account, aid, meta] = contentType.split("/");
    const [sysstatus, status, ver, pl, reg, color, exp, nbf, name] =
      meta.split("-");
    const rhCtx = `${account}/${aid}/${sysstatus}-${status}-${ver}-${pl}-${reg}-${color}-${exp}-${nbf}-${name}`;
    ////////  CONTEXT END ///////////////////////

    // MANIFEST START
    // if we have https://<ag>.rhapp.app/<an>/manifest, serve that
    if (url.pathname.endsWith("/manifest")) {
      return new Response(
        JSON.stringify(renderManifest({ ag, an, name, color })),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    // MANIFEST END

    // SUSPENDED OR OVER QUOTA START!
    if (sysstatus !== "0")
      return fetch(`https://app-sidecar.rhappsody.cloud/is/suspended.html`);
    // SUSPENDED OR OVER QUOTA END!

    //////////////////  EXPERIMENTAL //////////////////////////
    // const htmlFile = hasPreview
    //   ? "preview.html"
    //   : hasOldversion
    //   ? "archive.html"
    //   : "app.html";
    // // const appHTML = await fetch(
    // //   `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/${htmlFile}${hasLatest}`
    // // );

    // //https:fly.storage.tigris.dev/pub.rhapp.net/bob/derp2/app.html

    // const sbsBase = "https://sb.rhap.cc/storage/v1/object/public/apps/";
    // const tigrisBase = "https://fly.storage.tigris.dev/pub.rhapp.net/";

    // const appHTML = await fetch(
    //   `${tigrisBase}${ag}/${an}/${htmlFile}${hasLatest}`
    // );

    //////////////////  EXPERIMENTAL //////////////////////////

    // const newappHeaders = new Headers(appHTML.headers);
    // newappHeaders.set("rh-ctx", rhCtx);
    // newappHeaders.set("Server-Timing", `rhctx;desc="${rhCtx}"`);
    // newappHeaders.set("rh-aid", aid);
    // newappHeaders.set("content-type", "text/html; charset=utf-8");
    // const appResponse = new Response(appHTML.body, {
    //   status: appHTML.status,
    //   headers: newappHeaders,
    // });
    // if we have a preview, we skip the rest of the checks....
    if (hasPreview) return appResponse;

    // LIVEIN APP CHECK
    if (nbf !== "0" && nbf !== "null") {
      const now = Date.now();
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
      const now = Date.now();
      if (now > Number(exp)) {
        return new Response(renderExpired(exp), {
          headers: {
            "content-type": "text/html;charset=UTF-8",
          },
        });
      }
    }
    // EXPIRED APP CHECK END

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
    // PASSWORD PROTECTED APP END!

    // Serve the live app!
    return appResponse;

    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////

    // //  `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/app.rhx${hasLatest}`;///////////////////////////////

    // const response = await fetch(
    //   `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/app.html${hasLatest}`
    // );

    // // const response = await fetch(
    // //   `https://app-public.rhappsody.cloud/${ag}/${an}/app.html``https://app-public.rhappsody.cloud/${ag}/${an}/app.html``https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/app.rhx${hasLatest}`
    // // );

    // const disposition = response.headers.get("content-disposition");

    // // App not found:
    // if (!disposition) {
    //   if (an === "main")
    //     return fetch(
    //       `https://app-sidecar.rhappsody.cloud/claim/index.html?latest`
    //     );
    //   else
    //     return fetch(
    //       `https://app-sidecar.rhappsody.cloud/dne/index.html?latest`
    //     );
    // }

    // let response2;
    // switch (status) {
    //   case "0":
    //     // active app
    //     const newHeaders = new Headers(response.headers);
    //     newHeaders.set("rh-path", path);
    //     newHeaders.set("rh-an", an);
    //     newHeaders.set("rh-ctx", metadata);
    //     newHeaders.set("Server-Timing", `rhctx;desc="${metadata}"`);
    //     const startBlock = sidecar === "go" ? block : "start";
    //     newHeaders.set("rh-start-block", startBlock);

    //     return new Response(response.body, {
    //       status: response.status,
    //       headers: newHeaders,
    //     });

    //   default:
    //     response2 = await fetch(
    //       `https://app-sidecar.rhappsody.cloud/is/inactive.html`
    //     );
    //     break;
    // }

    // const newHeaders2 = new Headers(response2.headers);
    // newHeaders2.set("rh-ctx", metadata);
    // newHeaders2.set("rh-app-active", "true");

    // newHeaders2.set("Server-Timing", `rhctx;desc="${metadata}"`);
    // // Return the modified response with updated headers
    // return new Response(response2.body, {
    //   status: response2.status,
    //   headers: newHeaders2,
    // });
  },
};
