export default {
  async fetch(request) {
    // Get the ag/an from the request
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, sidecar, subpage] = url.pathname.split("/");

    // get the rh-ctx, rh-sidecar headers
    const rhCtx = request.headers.get("rh-ctx");
    const sidecarhdr = request.headers.get("rh-sidecar");

    const response =
      sidecar === "api"
        ? await fetch(request)
        : subpage
        ? await fetch(
            `https://app-sidecar.rhappsody.cloud/${sidecar}/${subpage}.html`
          )
        : await fetch(
            `https://app-sidecar.rhappsody.cloud/${sidecar}/index.html`
          );

    // Create a new Headers object to modify response headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Server-Timing", `rhctx;desc="${rhCtx}"`);
    newHeaders.set("rh-ctx", rhCtx);
    newHeaders.set("rh-sidecar2", sidecarhdr);

    // Return the modified response with updated headers
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
