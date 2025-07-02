export default {
  async fetch(request) {
    // Get the ag/an from the request
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, image, type, tag, varorw = "orig", h] =
      url.pathname.split("/");

    // // get the rh-ctx, rh-sidecar headers
    const rhCtx = request.headers.get("rh-ctx");
    const parts = rhCtx.split(":");
    const path = parts[4];

    const srcUrl = `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/img`;
    const origurl = `${srcUrl}/${tag}/${varorw}.png`;

    let serveurl = origurl;

    // return new Response(JSON.stringify({ type, tag, varorw, h }), {
    //   headers: { "Content-Type": "application/json" },
    // });

    switch (type) {
      // /image/placeholder/600x400/
      case "random":
        let randImage = `https://loremflickr.com/${varorw}/${h}/${tag}`;
        return fetch(randImage);

      case "placeholder":
        const [phw, phh] = tag.split("x");
        const bgColor = h ? h : `f7f6f6`;
        let placeholderUrl = `https://images.placeholders.dev/?width=${phw}&height=${phh}&bgColor=%23${bgColor}&textColor=%236d6e71&fontSize=16`;
        if (varorw) placeholderUrl += `&text=${varorw}`;
        if (h) placeholderUrl += `&bgColor=${h}`;
        return fetch(placeholderUrl);

      // /image/static/foo/orig
      // /image/direct/foo/4x3
      case "static":
      case "direct":
        return fetch(origurl);

      // /image/edit/foo
      // /image/info/foo
      case "edit":
      case "info":
        const response = await fetch(
          `https://app-sidecar.rhappsody.cloud/images/${type}.html`
        );
        const newHeaders = new Headers(response.headers);
        newHeaders.set("rh-ctx", rhCtx);
        newHeaders.set("Server-Timing", `rhctx;desc="${rhCtx}"`);
        return new Response(response.body, {
          status: response.status,
          headers: newHeaders,
        });

      // /image/opt/foo/800
      // /image/opt/foo/800x200
      case "opt":
        let modifier = h ? `s_${varorw}x${h},fit_cover` : `w_${varorw}`;
        return fetch(
          `https://image-serve.fly.dev/${modifier},sharpen=100/${srcUrl}/${tag}/orig.png`
        );

      // /image/rawopt/foo/sharpen_30
      case "rawopt":
        return fetch(`https://image-serve.fly.dev/${varorw}/${origurl}`);
      default:
        return new Response(`INVALID: image/${type}!`, {
          status: 464,
        });
    }

    // if the image is missing, return a placeholder
    // if (response.status !== 200) {
    //   return fetch(
    //     `https://images.placeholders.dev/?width=600&height=400&text=rhapp%20image%20%2B${tag}%20missing&bgColor=%23f7f6f6&textColor=%236d6e71&fontSize=16`
    //   );
    // }
  },
};
