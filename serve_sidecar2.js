export default {
  async fetch(request) {
    // Get the ag/an from the request
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, sidecar, subpage, subsubpage] = url.pathname.split("/");

    // get the rh-ctx, rh-sidecar headers
    const rhCtx = request.headers.get("rh-ctx");
    // const sidecarhdr = request.headers.get("rh-sidecar");

    // return new Response(`${sidecar} ${subpage}`);

    // `https://cfn-${subpage}.xpes.workers.dev?ag=${ag}&an=${an}&shared_secret=${CFN_SHARED_SECRET}`;

    const CFN_SHARED_SECRET = "rush64counter648hua26gxitrocks";
    //cfn-test.xpes.workers.dev
    if (sidecar == "fn") {
      try {
        const modifiedUrl = new URL(`https://cfn-${subpage}.xpes.workers.dev`);

        // Copy existing query parameters from the original URL
        for (const [key, value] of url.searchParams) {
          modifiedUrl.searchParams.set(key, value);
        }

        modifiedUrl.searchParams.set("ag", ag);
        modifiedUrl.searchParams.set("an", an);
        modifiedUrl.searchParams.set("shared_secret", CFN_SHARED_SECRET);
        modifiedUrl.searchParams.set("rh_ctx", rhCtx);

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

        const response = await fetch(modifiedRequest);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      } catch (error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
      }
    }

    const SUBPAGE =
      subpage === "index.js"
        ? "index.js"
        : subpage
        ? `${subpage}.html`
        : "index.html";

    const response = await fetch(
      `https://app-sidecar.rhappsody.cloud/${sidecar}/${SUBPAGE}`
    );

    // const response =
    //     sidecar === "api" ?
    //     await fetch(request) :
    //     subpage ?
    //     await fetch(`https://app-sidecar.rhappsody.cloud/${sidecar}/${subpage}.html`) :
    //     await fetch(`https://app-sidecar.rhappsody.cloud/${sidecar}/index.html`);

    // Create a new Headers object to modify response headers
    const newHeaders = new Headers(response.headers);

    // remove existing Server-Timing header
    // newHeaders.delete("Server-Timing");
    newHeaders.set("Server-Timing", `rhctx;desc="${rhCtx}"`);
    newHeaders.set("rh-ctx", rhCtx);
    // newHeaders.set("rh-sidecar2", sidecarhdr);

    // Return the modified response with updated headers
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
