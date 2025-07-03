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
}

import genSessionToken from "./genSessionToken";

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
}: RenderAppProps) {
  const { sessionToken, sid } = await genSessionToken({
    ag,
    an,
    aid,
    account,
    reg,
    pl,
    color,
  });
  return `
  <!DOCTYPE html>
<html lang="${lang}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://r.rhap.cc/latest/rh.css" rel="stylesheet">
    <script defer src="https://r.rhap.cc/latest/rhappsody-x.js"></script>
    <!-- <script async src="/fn/ag-visit?sid=${sid}&an=${an}"></script> -->
    <!-- <script src="/${an}/rhapp.js"></script> -->
    <link rel="icon" type="image/x-icon" href="/rh.ico">
    <link rel="manifest" href="${an}/manifest">
    <meta name="rh-sid" content="${sid}">
    <meta name="rh-aid" content="${aid}">
    <meta name="rh-account" content="${account}">
    <title>@${ag}/${an}</title>
    <p>Start Block: ${startBlock}</p>
    <p>Version: ${version}</p>
    <p>B64 length: ${b64.length}</p>
    <style>
    /*inlineCSS here*/
    </style>
</head>

<body class="light primary" data-rh-session-token="${sessionToken}">
    <header class="primary">
        <h6 class="center-align"><rh-span>@${ag}/${an}</rh-span></h6>
    </header>
    <h1>${ag}/${an}</h1>
    <script>
      window.b64 = "${b64}";
      function sendAnalyticsBeacon() {
        const data = new FormData(); // You can add data to the form data object
        //navigator.sendBeacon('/analytics-endpoint', data); 
        console.log("sendAnalyticsBeacon...");
      }
window.addEventListener('DOMContentLoaded', () => {
   console.log("DOMContentLoaded...send beacon...");
   sendAnalyticsBeacon();
});
    </script>
</body>

</html>
  `;
}
