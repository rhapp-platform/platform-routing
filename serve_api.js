export default {
  async fetch(request) {
    // Get the ag/an from the request
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, _api, ...rest] = url.pathname.split("/");
    const apipath = rest.join("/");

    // get the rh-ctx, rh-sidecar headers
    const rhCtx = request.headers.get("rh-ctx");
    const metadataParts = rhCtx.split(":");
    const status = metadataParts[0];
    const ver = metadataParts[1];
    const pl = Number(metadataParts[2]);
    const reg = metadataParts[3];
    const path = metadataParts[4];
    const color = metadataParts[5];
    const exp = metadataParts[6];
    const nbf = metadataParts[7];
    const [account, aid] = path.split("/");

    const SHARED_API_SECRET = "k9m4n7p2q5r8s3t6";

    const resp = {
      ag,
      an,
      path,
      pl,
      reg,
      account,
      aid,
    };

    // clone the request
    const apiRequest = request.clone();
    // Create a new request with the modified URL
    const apiUrl = new URL(`https://api.rhapp.cc/${apipath}`);
    const modifiedRequest = new Request(apiUrl, request);

    modifiedRequest.headers.set("x-shared-api-secret", SHARED_API_SECRET);
    modifiedRequest.headers.set("rh-path", path);
    modifiedRequest.headers.set("rh-ag", ag);
    modifiedRequest.headers.set("rh-an", an);
    modifiedRequest.headers.set("rh-pl", pl);
    modifiedRequest.headers.set("rh-reg", reg);
    modifiedRequest.headers.set("rh-account", account);
    modifiedRequest.headers.set("rh-aid", aid);
    modifiedRequest.headers.set("rh-ctx", rhCtx);
    const response = await fetch(modifiedRequest);
    return response;

    // return new Response(JSON.stringify(resp), {
    //   status: 200,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // const response = await fetch(
    //   `https://app-sidecar.rhappsody.cloud/${sidecar}/${SUBPAGE}.html`
    // );

    // const response =
    //     sidecar === "api" ?
    //     await fetch(request) :
    //     subpage ?
    //     await fetch(`https://app-sidecar.rhappsody.cloud/${sidecar}/${subpage}.html`) :
    //     await fetch(`https://app-sidecar.rhappsody.cloud/${sidecar}/index.html`);

    // Create a new Headers object to modify response headers
    // const newHeaders = new Headers(response.headers);
    // newHeaders.set("Server-Timing", `rhctx;desc="${rhCtx}"`);
    // newHeaders.set("rh-ctx", rhCtx);

    // // Return the modified response with updated headers
    // return new Response(response.body, {
    //   status: response.status,
    //   headers: newHeaders,
    // });
  },
};
