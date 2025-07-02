export default {
  async fetch(request) {
    // Make a copy of the request to modify its headers
    //const modifiedRequest = new Request(request);

    // Get the ag/an from the request
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, sidecar] = url.pathname.split("/");

    // handle special root level ans

    // new is used for basic new ..edit source
    // create is used for recipes!
    switch (an) {
      case "groups":
      case "apps":
      case "new":
      case "create":
      case "dashboard":
      case "account":
      case "appdir":
      case "claim":
      case "dne":
        return fetch(request);
    }

    // if we have any other sidecare
    // /main/xxxx .. early return...
    if (sidecar) return fetch(request);

    // R2: app-lookups bucket:
    // ag/an stub objects....content: userid/aid/pl/reg
    // use a head request to get the userid, aid, reg, pl..

    //return fetch(`https://app-public.rhappsody.cloud/${ag}/${an}/app.html`);
    const response = await fetch(
      `https://app-public.rhappsody.cloud/${ag}/${an}/app.html`
    );

    const disposition = response.headers.get("content-disposition");

    if (!disposition) {
      const html = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rhapp not found</title>
    <link rel="stylesheet" href="https://r.rhap.cc/latest/rh.css">
    <script src="https://wc.rhap.cc/rh-logo.js"></script>
</head>
<body>
    <div class="fixed center middle center-align">
        <rh-logo size="180"></rh-logo>
        <h4 class="center-align bold">Rhapp Not Found</h4>
        <h6 class="center-align">https://${ag}.rhapp.app/${an}</h6>
    </div>
</body>
</html>`;

      return new Response(html, {
        status: 404,
        statusText: "rhapp not found",
        headers: {
          "content-type": "text/html",
        },
      });

      //return fetch(`https://${ag}.rhapp.app/dne?an=${an}`);
      // return new Response(`serve: ${ag}/${an} missing cd`, {
      //     status: 403,
      //     statusText: "missing rh-cd"
      // });
    }

    // Content-Disposition hack
    // inline;filename={active}:{pl}:{reg}:{userid}/{aid}:{exp}:{nbf}
    // start for inline (for a snippet)
    const [prefix, metadata] = disposition.split("=");
    const metadataParts = metadata.split(":");

    const A = metadataParts[0];
    const ver = metadataParts[1];
    const pl = Number(metadataParts[2]);
    const reg = metadataParts[3];
    const path = metadataParts[4];
    const color = metadataParts[5];
    const exp = metadataParts[6];
    const nbf = metadataParts[7];
    const [account, aid] = path.split("/");
    // end for inline (for a snippet)

    // START enforce active
    if (A === "0") {
      const html = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rhapp not found</title>
    <link rel="stylesheet" href="https://r.rhap.cc/latest/rh.css">
    <script src="https://wc.rhap.cc/rh-logo.js"></script>
</head>
<body>
    <div class="fixed center middle center-align">
        <rh-logo size="180"></rh-logo>
        <h4 class="center-align bold">Rhapp Inactive</h4>
        <h6 class="center-align">https://${ag}.rhapp.app/${an}</h6>
    </div>
</body>
</html>`;

      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": disposition,
        },
      });
    }
    // END enforce active

    // we use a rh-resolve request header to get the metadata back..
    const resolve = request.headers.get("rh-resolve");
    if (resolve) {
      // we need to return the metadata as a json object..
      return new Response(
        JSON.stringify({
          pl,
          reg,
          account,
          aid,
          path,
          exp,
          nbf,
          color,
          ver,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Content-Disposition": disposition,
          },
        }
      );
    }

    // Create a new Headers object to modify response headers
    const newHeaders = new Headers(response.headers);

    // Remove headers that start with the specified prefix
    newHeaders.set("rh-ctx", metadata);
    newHeaders.set("rh-pl", pl);
    newHeaders.set("rh-reg", reg);
    newHeaders.set("rh-apppath", path);
    newHeaders.set("rh-account", account);
    newHeaders.set("rh-aid", aid);
    if (exp) newHeaders.set("rh-exp", exp);
    if (nbf) newHeaders.set("rh-nbf", nbf);

    newHeaders.set("Server-Timing", `rhctx;desc="${metadata}"`);
    // newHeaders.append("Server-Timing", `rhctx;desc="${metadata}"`);

    // Return the modified response with updated headers
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
