export default {
  async fetch(request) {
    // Make a copy of the request to modify its headers
    const modifiedRequest = new Request(request);

    // Get the ag/an from the request
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, sidecar] = url.pathname.split("/");

    // Lookup the app by sending a HEAD request for its app.rha file..
    const response = await fetch(
      `https://app-public.rhappsody.cloud/${ag}/${an}/app.html?latest`,
      {
        method: "HEAD",
      }
    );
    const disposition = response.headers.get("content-disposition");

    // App not found:
    if (!disposition)
      return fetch(`https://app-sidecar.rhappsody.cloud/dne/index.html?latest`);

    // inline;filename={active}:{pl}:{reg}:{userid}/{aid}:{exp}:{nbf}
    const [prefix, metadata] = disposition.split("=");
    modifiedRequest.headers.set("rh-ctx", metadata);
    modifiedRequest.headers.set("rh-an", an);
    modifiedRequest.headers.set("rh-sidecar", sidecar);

    return fetch(modifiedRequest);
  },
};
