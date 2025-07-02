//import decodeRhaContentType from "../../lib/common/decodeRhaContentType";
export default {
  async fetch(request) {
    // Make a copy of the request to modify its headers
    const modifiedRequest = new Request(request);

    // Get the ag/an from the request
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, sidecar] = url.pathname.split("/");
    const latest = url.searchParams.get("latest") ? `?t=${Date.now()}` : "";

    // Lookup the app by sending a HEAD request for its app.rha file..
    // const response = await fetch(
    //   `https://app-public.rhappsody.cloud/${ag}/${an}/app.html?latest`,
    //   {
    //     method: "HEAD",
    //   }
    // );

    const ctxResponse = await fetch(
      `https://sb.rhap.cc/storage/v1/object/public/apps/${ag}/${an}/app.ctx${latest}`
    );

    // App not found:
    if (!ctxResponse.ok) {
      return fetch(`https://app-sidecar.rhappsody.cloud/dne/index.html?latest`);
    }

    const contentType = ctxResponse.headers.get("content-type");

    // const disposition = response.headers.get("content-disposition");

    // inline;filename={active}:{pl}:{reg}:{userid}/{aid}:{exp}:{nbf}
    // const [prefix, metadata] = disposition.split("=");
    modifiedRequest.headers.set("rh-ctx", contentType);
    modifiedRequest.headers.set("rh-an", an);
    modifiedRequest.headers.set("rh-sidecar", sidecar);

    return fetch(modifiedRequest);
  },
};
