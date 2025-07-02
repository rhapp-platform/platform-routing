export default {
  async fetch(request) {
    // Get the ag/an from the request
    const url = new URL(request.url);
    const host = url.hostname.split(".")[0];

    // we let api.rhapp.app through directly
    if (host === "api") return fetch(`https://api.rhapp.cc${url.pathname}`);
    if (host === "img") return new Response("images");

    // return new Response(
    //   `https://app-sidecar.rhappsody.cloud/host/${host}/index.html`
    // );

    if (url.pathname === "/manifest.json") {
      return fetch(
        `https://app-sidecar.rhappsody.cloud/host/${host}/manifest.json`
      );
    } else if (url.pathname === "/index.js") {
      return fetch(`https://app-sidecar.rhappsody.cloud/host/${host}/index.js`);
    } else if (url.pathname === "/sw.js") {
      return fetch(`https://app-sidecar.rhappsody.cloud/sw.js`);
    }

    // otherwise, return the page
    const PATH = `${url.pathname}.html`;

    // return new Response(
    //   `https://app-sidecar.rhappsody.cloud/host/${host}${PATH}`
    // );
    const response = await fetch(
      `https://app-sidecar.rhappsody.cloud/host/${host}${PATH}`
    );
    return response;
  },
};
