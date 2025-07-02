interface RenderManifestProps {
  ag: string;
  an: string;
  color: string;
}

export default function renderManifest({ ag, an, color }: RenderManifestProps) {
  return {
    name: `${ag} ${an}`,
    short_name: `${ag} ${an}`,
    description: `${ag} ${an} page`,
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
}
