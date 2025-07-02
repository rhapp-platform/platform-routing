export default {
    async fetch(request) {
        // Make a copy of the request to modify its headers
        const modifiedRequest = new Request(request);

        // Get the ag/an from the request
        const url = new URL(request.url);
        const ag = url.hostname.split(".")[0];
        const [, an, sidecar] = url.pathname.split("/");

        if(sidecar!=="preview") return fetch(request);


        // if we have any sidecar e.g
        // /main/xxxx .. early return...
        if (sidecar) return fetch(request);

        // R2: app-lookups bucket:
        // ag/an stub objects....content: userid/aid/pl/reg
        // use a head request to get the userid, aid, reg, pl..

        //return fetch(`https://app-public.rhappsody.cloud/${ag}/${an}/app.html`);
        const response = await fetch(`https://app-public.rhappsody.cloud/${ag}/${an}/app.html`);

        const disposition = response.headers.get("content-disposition");

        if (!disposition) {
            return new Response(`serve: ${ag}/${an} missing cd`, {
                status: 403,
                statusText: "missing rh-cd"
            });
        }

        // Content-Disposition hack
        // inline;filename={active}:{pl}:{reg}:{userid}/{aid}:{exp}:{nbf}
        // start for inline (for a snippet)
        const [prefix, metadata] = disposition.split("=");
        const metadataParts = metadata.split(":");

        const A = metadataParts[0];
        const pl = Number(metadataParts[1]);
        const reg = metadataParts[2];
        const path = metadataParts[3];
        const exp = metadataParts[4];
        const nbf = metadataParts[5];
        const [account, aid] = path.split("/");
        // end for inline (for a snippet)

        // we use a rh-resolve request header to get the metadata back..
        const resolve = request.headers.get("rh-resolve");
        if (resolve) {
            // we need to return the metadata as a json object..
            return new Response(JSON.stringify({
                pl,
                reg,
                account,
                aid,
                path,
                exp,
                nbf
            }), {
                headers: {
                    "Content-Type": "application/json"
                },
            });
        }

        // Create a new Headers object to modify response headers
        const newHeaders = new Headers(response.headers);

        // Remove headers that start with the specified prefix
        newHeaders.set("rh-ctx", metadata);
        newHeaders.set("rh-pl", pl);
        newHeaders.set("rh-reg", reg);
        newHeaders.set("rh-apppath", path);
        newHeaders.set("rh-account", account);
        newHeaders.set("rh-preview", "1");
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

    }

};