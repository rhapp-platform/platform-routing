// I made a change to the snippet, and want to test it locally

export default {
  async fetch(request) {
    // Make a copy of the request to modify its headers
    //const modifiedRequest = new Request(request);

    // Get the ag/an from the request
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, sidecar, block] = url.pathname.split("/");

    // handle special root level ans

    // new is used for basic new ..edit source
    // create is used for recipes!
    switch (an) {
      case "static":
        return fetch(`https://app-sidecar.rhappsody.cloud/${an}/${sidecar}`);
      case "groups":
      case "apps":
      case "new":
      case "create":
      case "signup":
      case "dashboard":
      case "account":
      case "claim":
      case "dne":
        const SC = sidecar || "index";
        return fetch(`https://app-sidecar.rhappsody.cloud/${an}/${SC}.html`);
    }

    // if we have any other sidecare
    // /main/xxxx .. early return...

    if (sidecar && sidecar !== "go") return fetch(request);

    const response = await fetch(
      `https://app-public.rhappsody.cloud/${ag}/${an}/app.html`
    );

    const disposition = response.headers.get("content-disposition");

    // App not found:
    if (!disposition)
      return fetch(`https://app-sidecar.rhappsody.cloud/dne/index.html?latest`);

    // Content-Disposition hack
    // inline;filename={active}:{pl}:{reg}:{userid}/{aid}:{exp}:{nbf}
    const [prefix, metadata] = disposition.split("=");
    const metadataParts = metadata.split(":");
    const status = metadataParts[0];
    // const ver = metadataParts[1];
    const pl = Number(metadataParts[2]);
    const reg = metadataParts[3];
    const path = metadataParts[4];
    const color = metadataParts[5];
    const exp = metadataParts[6];
    const nbf = metadataParts[7];
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
