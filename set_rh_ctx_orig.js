export default {
  async fetch(request) {
    // Make a copy of the request to modify its headers
    const modifiedRequest = new Request(request);

    // Get the ag/an from the request
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, sidecar] = url.pathname.split("/");

    // Lookup the app by sending a HEAD request for its app.rha file..
    // const response = await fetch(
    //   `https://app-public.rhappsody.cloud/${ag}/${an}/app.html?latest`,
    //   {
    //     method: "HEAD",
    //   }
    // );

    const sbsResponse = await fetch(
      `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/app.rhx?t=${Date.now()}`
    );

    // App not found:
    if (!sbsResponse.ok) {
      return fetch(`https://app-sidecar.rhappsody.cloud/dne/index.html?latest`);
    }

    const contentType = sbsResponse.headers.get("content-type");
    const rhCtx = contentType.split("/")[1];

    // const disposition = response.headers.get("content-disposition");

    // inline;filename={active}:{pl}:{reg}:{userid}/{aid}:{exp}:{nbf}
    // const [prefix, metadata] = disposition.split("=");
    modifiedRequest.headers.set("rh-ctx", rhCtx);
    modifiedRequest.headers.set("rh-an", an);
    modifiedRequest.headers.set("rh-sidecar", sidecar);

    return fetch(modifiedRequest);
  },
};
