export default {
  async fetch(request) {
    // Get the ag/an from the request
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, sidecar, subpage] = url.pathname.split("/");

    // get the rh-ctx, rh-sidecar headers
    const rhCtx = request.headers.get("rh-ctx");
    const sidecarhdr = request.headers.get("rh-sidecar");

    // let api route flow to worker!
    // if (sidecar === "api") {
    //   return new Response("api route!");
    // }

    const response =
      sidecar === "api"
        ? new Response("api route!")
        : subpage
        ? await fetch(`https://${ag}.rhapp.app/${sidecar}/${subpage}`)
        : await fetch(`https://${ag}.rhapp.app/${sidecar}`);

    // Create a new Headers object to modify response headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Server-Timing", `rhctx;desc="${rhCtx}"`);
    newHeaders.set("rh-ctx", rhCtx);
    newHeaders.set("rh-sidecar", sidecarhdr);

    // Return the modified response with updated headers
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
