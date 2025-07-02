export default {
  async fetch(request) {
    // Get the ag/an from the request
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, image, tag, w, h] = url.pathname.split("/");

    // get the rh-ctx, rh-sidecar headers
    const rhCtx = request.headers.get("rh-ctx");
    const parts = rhCtx.split(":");
    const path = parts[4];

    const origurl = `https://sb.rhap.cc/storage/v1/object/public/apps-public/${path}/img/${tag}/orig.png`;
    let serveurl = origurl;

    // a width param of "info" returns metadata
    if (w) {
      //   if (w === "info") return new Response(`${ag}/${an} +${tag} ${path}`);
      if (w === "edit" || w === "info") {
        const response = await fetch(
          `https://app-sidecar.rhappsody.cloud/image/${w}.html?latest`
        );
        // Create a new Headers object to modify response headers
        const newHeaders = new Headers(response.headers);
        newHeaders.set("rh-ctx", rhCtx);
        newHeaders.set("Server-Timing", `rhctx;desc="${rhCtx}"`);
        // Return the modified response with updated headers
        return new Response(response.body, {
          status: response.status,
          headers: newHeaders,
        });
      }
      let modifier;
      if (w === "tr") {
        modifier = h;
      } else if (h) {
        modifier = `s_${w}x${h},fit_cover`;
      } else modifier = `w_${w}`;
      serveurl = `https://image-serve.fly.dev/${modifier},sharpen=100/${origurl}`;
    }
    const response = await fetch(serveurl);

    // if the image is missing, return a placeholder
    if (response.status !== 200) {
      return fetch(
        `https://images.placeholders.dev/?width=600&height=400&text=rhapp%20image%20%2B${tag}%20missing&bgColor=%23f7f6f6&textColor=%236d6e71&fontSize=16`
      );
    }

    // return the image
    return response;
  },
};
