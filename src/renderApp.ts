interface RenderAppProps {
  nbf: string;
  ag: string;
  an: string;
  b64: string;
  aid: string;
  lang: string;
  account: string;
  reg: string;
  pl: string;
  color: string;
  startBlock: string;
  version: string;
  includeServiceWorker?: boolean;
}

import genContextToken from "./genContextToken";

export default async function renderApp({
  ag,
  an,
  aid,
  account,
  reg,
  pl,
  color,
  lang = "en",
  version,
  b64,
  startBlock,
  includeServiceWorker = false,
}: RenderAppProps) {
  const { contextToken, sid } = await genContextToken({
    ag,
    an,
    aid,
    account,
    reg,
    pl,
    color,
  });


  const cssUrl = `https://r.rhap.cc/latest/rh.css`;
  // const jsUrl = `https://r.rhap.cc/latest/rhapp.js`;
  const jsUrl = `https://test.rh.local/core-rhapp/dist/rhapp.js`;
  const binUrl = `https://public-enam.rhappsody.cloud/7f8c37cb-118b-44f7-814c-0332b392808f/08d97c15-6f06-420b-976f-2418bd9caa60/rhapp.bin`;


  return `

<!DOCTYPE html>
<html lang="${lang}">

<head>
    <meta charset="UTF-8">
    <title>@${ag}/${an}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="a rhappsody app">
    <meta name="rh-sid" content="${sid}">
    <meta name="rh-aid" content="${aid}">
    <meta name="rh-account" content="${account}">
    <!-- Preload critical resources -->
    <link rel="preload" href="${jsUrl}" as="script">
    <link rel="preload" href="${cssUrl}" as="style">
    <link rel="preload" href="${binUrl}" as="fetch" crossorigin>
    <link rel="icon" type="image/x-icon" href="/rh.ico">
    <!-- <link rel="manifest" href="${an}/manifest"> -->
    <!-- CSS should load first (render-blocking) -->
    <link rel="stylesheet" href="${cssUrl}">
    <!-- JS library with async loading -->
    <script async src="${jsUrl}"></script>
    ${includeServiceWorker ? '<!-- Service Worker -->\n    <script src="/sw.js"></script>' : ''}
    <!-- <script async src="/fn/ag-visit?sid=${sid}&an=${an}"></script> -->
    <!-- Your app initialization script -->
    <script>
      // Wait for both library and binary to be ready
      async function initApp() {
        // Fetch binary file
        const R = await fetch('${binUrl}');
        const ab = await R.arrayBuffer();
        const rhcbin = new Uint8Array(ab);
        // Wait for library to be available
        while (typeof Rhapp === 'undefined') {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        window.app = new Rhapp(document.body);
        window.app.vm.boot(rhcbin);
      }
      // Start initialization when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
      } else {
        initApp();
      }
    </script>
  </head>
<body class="light" data-rh-context-token="${contextToken}"></body>
</html>
  `;
}
