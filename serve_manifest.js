export default {
  async fetch(request) {
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, _manifest] = url.pathname.split("/");

    const sp = url.searchParams.get("sp") || "";
    const name = url.searchParams.get("n") || `${ag}/${an}`;
    const type = url.searchParams.get("t") || "app";
    const color = url.searchParams.get("c") || "#0000ff";

    let manifest = "";

    switch (type) {
      case "sc":
        const icon = url.searchParams.get("ic") || "globe2";
        manifest = {
          name,
          short_name: name,
          description: `@${ag}/${an} ${name}`,
          lang: "en",
          orientation: "portrait",
          display: "standalone",
          background_color: `#${color}`,
          theme_color: `#${color}`,
          start_url: `/${an}/${sp}`,
          dir: "ltr",
          features: ["powered by Rhappsody"],
          icons: [
            {
              // src: `https://api.dicebear.com/9.x/icons/svg?seed=${an}&backgroundColor=${color}&icon=${icon}`,
              src: `https://${ag}.rhapp.app/${an}/icon`,

              sizes: "512x512",
              type: "image/svg",
            },
          ],
        };
        break;

      case "app":
        manifest = {
          name,
          short_name: name,
          description: `${name} rhappsody app`,
          lang: "en",
          orientation: "portrait",
          display: "standalone",
          background_color: `#${color}`,
          theme_color: `#${color}`,
          start_url: `/${an}`,
          features: ["powered by Rhappsody"],
          icons: [
            {
              src: `https://${ag}.rhapp.app/${an}/icon`,
              sizes: "512x512",
              type: "image/png",
            },
          ],
        };
        break;

      case "ag":
      default:
        manifest = {
          name,
          short_name: name,
          description: `${ag} ${name} page`,
          lang: "en",
          orientation: "portrait",
          display: "standalone",
          background_color: `#${color}`,
          theme_color: `#${color}`,
          start_url: `/${sp}`,
          features: ["powered by Rhappsody"],
          icons: [
            {
              src: `https://${ag}.rhapp.app/main/icon`,
              sizes: "512x512",
              type: "image/png",
            },
          ],
        };
        break;
    }

    return new Response(JSON.stringify(manifest), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  },
};
