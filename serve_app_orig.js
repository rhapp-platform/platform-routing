const CFN_SHARED_SECRET = "rush64counter648hua26gxitrocks";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, sidecar, block, other] = url.pathname.split("/");
    // Check for ?latest query param
    const hasLatest = url.searchParams.has("latest") ? `?ts=${Date.now()}` : "";
    //const hasLatest = true ? `?ts=${Date.now()}` : "";

    // AN Switch: https://<ag>.rhapp.app/<an>
    switch (an) {
      case "sw.js":
        // special handling for service worker - serve from root path to get wide scope!
        return fetch(`https://app-sidecar.rhappsody.cloud/sw.js`);
      case "fn":
        // handle ag specific cfn calls:
        //http://<ag>.rhapp.app/fn/<cfnname>
        // NOTE: NO BODY PASSTHRU!
        const modifiedUrl = new URL(`https://cfn-${sidecar}.xpes.workers.dev`);
        // Copy existing query parameters from the original URL
        for (const [key, value] of url.searchParams) {
          modifiedUrl.searchParams.set(key, value);
        }
        modifiedUrl.searchParams.set("ag", ag);
        modifiedUrl.searchParams.set("shared_secret", CFN_SHARED_SECRET);
        const modifiedRequest = new Request(modifiedUrl, {
          method: request.method,
          headers: request.headers,
        });
        return fetch(modifiedRequest);
      case "static":
        return fetch(`https://app-sidecar.rhappsody.cloud/${an}/${sidecar}`);
      case "apps":
      case "new":
      case "create":
      // new is used for basic new ..edit source
      // create is used for recipes!
      case "auth":
      case "signup":
      case "dashboard":
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
        case "img":
          if (block === "banner")
            return fetch(
              `https://placehold.co/800x200?text=@${ag}@${an}-banner`
            );
          const builtIn = await fetch(
            `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/${block}.png`
          );
          if (builtIn.ok) {
            return builtIn;
          } else {
            return fetch(
              `https://sb.rhap.cc/storage/v1/object/public/system-public/images/${block}_default.png`
            );
          }
          break;
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

    ///////////////////// EXPIRIMENT ///////////////////////
    //https://sb.rhap.cc/storage/v1/object/public/apps/gerp/goof.html?t=2024-12-11T11%3A01%3A33.672Z
    // const ts = Date.now();
    // `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/app.rhx?t=${ts}`;
    // pull the cached version..we need to invalidate this url but we get speed!

    // `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/app.rhx?t=${Date.now()}`

    const sbsResponse = await fetch(
      `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/app.rhx${hasLatest}`
    );
    // Check if app is found. If not return dne page...
    if (!sbsResponse.ok) {
      return fetch(`https://app-sidecar.rhappsody.cloud/dne/index.html?latest`);
    }

    // SBS return a cache-control header that tells us if the app is active or not
    //  it looks like: "cache-control": "public, max-age=64000",
    // we use specific values to determine if the app is active or not...
    //  max-age=60  ---> APP IS INACTIVE
    //  max-age=62  ---> APP IS SUSPENDED
    //  max-age=63  ---> APP IS OVER QUOTA

    // // Check if app is active. If not return inactive page...
    // if (sbsResponse.headers.get("cache-control").endsWith("60")) {
    //   return new Response("App is inactive");
    //   // return fetch(`https://app-sidecar.rhappsody.cloud/is/inactive.html`);
    // }
    // if (sbsResponse.headers.get("cache-control").endsWith("62")) {
    //   return new Response("App is suspended");
    //   // return fetch(`https://app-sidecar.rhappsody.cloud/is/inactive.html`);
    // }

    // We will use the SBS content-type to creatively.....application/x-rha-<status>-<ver>-<pl>-<reg>
    const contentType = sbsResponse.headers.get("content-type");
    const [_a, _r, account, aid, meta] = contentType.split("/");
    const [sysstatus, status, ver, pl, reg, color, exp, nbf] = meta.split("-");

    const rhCtx = `${account}/${aid}/${sysstatus}-${status}-${ver}-${pl}-${reg}-${color}-${exp}-${nbf}`;

    // return new Response(`${startBlock} : ${rhCtx}`);

    // SUSPENDED OR OVER QUOTA START!
    if (sysstatus !== "0") {
      return fetch(`https://app-sidecar.rhappsody.cloud/is/suspended.html`);
    }
    // SUSPENDED OR OVER QUOTA END!

    // LIVEIN APP CHECK
    if (nbf !== "0") {
      const response = await fetch(
        `https://app-sidecar.rhappsody.cloud/is/livein.html?latest&t=${nbf}`
      );
      const url = new URL(response.url);
      url.searchParams.set("t", nbf);
      response = await fetch(url);
      return response;
    }
    // LIVEIN APP CHECK END

    // EXPIRED APP CHECK
    if (exp !== "0") {
      return fetch(
        `https://app-sidecar.rhappsody.cloud/is/expired.html?latest&t=${exp}`
      );
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

    const newsbsHeaders = new Headers(sbsResponse.headers);
    newsbsHeaders.set(
      "rh-ctx",
      `${account}/${aid}/${sysstatus}-${status}-${ver}-${pl}-${reg}-${color}-${exp}-${nbf}`
    );
    newsbsHeaders.set("rh-aid", aid);
    newsbsHeaders.set("rh-reg", reg);
    newsbsHeaders.set("rh-pl", pl);

    // Add text/htmlcontent-type header for HTML response since SBS forces it to be text/plain
    newsbsHeaders.set("content-type", "text/html; charset=utf-8");
    return new Response(sbsResponse.body, {
      status: sbsResponse.status,
      headers: newsbsHeaders,
    });

    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////

    const response = await fetch(
      `https://app-public.rhappsody.cloud/${ag}/${an}/app.html`
    );

    const disposition = response.headers.get("content-disposition");

    // App not found:
    if (!disposition) {
      if (an === "main")
        return fetch(
          `https://app-sidecar.rhappsody.cloud/claim/index.html?latest`
        );
      else
        return fetch(
          `https://app-sidecar.rhappsody.cloud/dne/index.html?latest`
        );
    }

    // Content-Disposition hack
    // inline;filename={active}:{pl}:{reg}:{userid}/{aid}:{exp}:{nbf}
    // const [prefix, metadata] = disposition.split("=");
    // const metadataParts = metadata.split(":");
    // const status = metadataParts[0];
    // // const ver = metadataParts[1];
    // const pl = Number(metadataParts[2]);
    // const reg = metadataParts[3];
    // const path = metadataParts[4];
    // const color = metadataParts[5];
    // const exp = metadataParts[6];
    // const nbf = metadataParts[7];
    // const [account, aid] = path.split("/");
    // end for inline (for a snippet)

    // return new Response(`status: ${status} type: ${typeof status}`, {
    //     headers: {
    //         "Content-Disposition": disposition,
    //     },
    // });

    let response2;
    switch (status) {
      case "0":
        // active app
        const newHeaders = new Headers(response.headers);
        newHeaders.set("rh-path", path);
        newHeaders.set("rh-an", an);
        newHeaders.set("rh-ctx", metadata);
        newHeaders.set("Server-Timing", `rhctx;desc="${metadata}"`);
        const startBlock = sidecar === "go" ? block : "start";
        newHeaders.set("rh-start-block", startBlock);

        // newHeaders.set("rh-pl", pl);
        // newHeaders.set("rh-reg", reg);
        // newHeaders.set("rh-apppath", path);
        // newHeaders.set("rh-account", account);
        // newHeaders.set("rh-aid", aid);
        // if (exp) newHeaders.set("rh-exp", exp);
        // if (nbf) newHeaders.set("rh-nbf", nbf);
        // Return the modified response with updated headers

        // return new Response(`status: ${status} type: ${typeof status}`, {
        //     status: response.status,
        //     headers: newHeaders,
        // });
        return new Response(response.body, {
          status: response.status,
          headers: newHeaders,
        });
      default:
        response2 = await fetch(
          `https://app-sidecar.rhappsody.cloud/is/inactive.html`
        );
        break;
    }

    const newHeaders2 = new Headers(response2.headers);
    newHeaders2.set("rh-ctx", metadata);
    newHeaders2.set("rh-app-active", "true");

    newHeaders2.set("Server-Timing", `rhctx;desc="${metadata}"`);
    // Return the modified response with updated headers
    return new Response(response2.body, {
      status: response2.status,
      headers: newHeaders2,
    });
  },
};
