// Enter Snippet code below

export default {
  async fetch(request) {
    // lookfor cib (cache-in-browser) URL param
    const u = new URL(request.url);
    const cib = u.searchParams.get("cib");
    const response = await fetch(request);

    // Clone the response so that it's no longer immutable
    const newResponse = new Response(response.body, response);

    // Add/override Cache-Control header if cib is true
    if (cib) {
      // Convert cib parameter to seconds, or default to 30 days (2592000 seconds)
      const maxAge = parseInt(cib) || 2592000;
      newResponse.headers.set("Cache-Control", `public, max-age=${maxAge}`);
      newResponse.headers.set("Rh-Cib", `true`);
    }
    return newResponse;
  },
};
