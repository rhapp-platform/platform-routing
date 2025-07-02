// Serves app data:
// https://{ag}.rhapp.app/{an}/data/pub/{dataPath}  --> SBS apps-public bucket
// https://{ag}.rhapp.app/{an}/data/reg/{dataPath}  --> R2 {reg}-public bucket

// NOTE: private data access will be serve via different routes that pass through worker for authentication:
// /api/data/......

export default {
  async fetch(request) {
    // Get the ag/an from the request
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, _data, bucket, ...rest] = url.pathname.split("/");
    const dataPath = rest.join("/");

    // get the rh-ctx, rh-sidecar headers
    const rhCtx = request.headers.get("rh-ctx");
    const parts = rhCtx.split(":");
    const path = parts[4];

    switch (bucket) {
      case "":
        return new Response(`${ag}/${an} data/list2`);
      case "list":
        return new Response(`${ag}/${an} data/list`);
      case "edit":
        return new Response(`${ag}/${an} data/edit`);
      case "pub":
        // serve from SBS apps-public bucket
        const dataUrl = `https://sb.rhap.cc/storage/v1/object/public/apps-public/${path}/data/${dataPath}`;
        const response = await fetch(dataUrl);
        // if the image is missing, return a placeholder
        if (response.status !== 200) {
          return new Response(`${ag}/${an} data/pub/${dataPath} not found`, {
            status: 404,
          });
        }
        return response;
      case "reg":
        const reg = parts[3];
        return new Response(
          `serve from R2 ${reg}-public : ${path}/${dataPath}`
        );
      default:
        return new Response(`INVALID: ${ag}/${an} data/${bucket}!`, {
          status: 404,
        });
    }
  },
};
