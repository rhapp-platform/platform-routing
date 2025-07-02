export default function renderExpired({
  exp,
  lang,
}: {
  exp: string;
  lang: string;
}) {
  return `
<!DOCTYPE html>
<html lang="${lang}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://r.rhap.cc/latest/rh.css" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="/rh.ico">
    <script src="https://r.rhap.cc/lib/sidecar.js?latest"></script>
    <title>App Expired</title>
</head>

<body class="light primary">
    <template id="rh-ctx-st">
        <div class="fixed center middle center-align">
            <rh-app-icon></rh-app-icon>
            <rh-logo size="150" color="#f2f2f2"></rh-logo>
            <rh-icon-bare name="flat-color-icons:expired" size="10rem"></rh-icon-bare>
            <h6><rh-span>This App has expired and is no longer active</rh-span></h6>
            <p class="small-text">The App expired on <span id="expired-date"></span>.<br /> Please contact the app owner
                for
                more information.</p>
        </div>
        <rh-copyright size="small"></rh-copyright>
        <script>
            const htmlElement = document.documentElement;
            const lang = htmlElement.getAttribute('lang');
            console.log('HTML lang attribute:', lang);
            const t = "${exp}";
            const date = new Date(Number(t));
            const formattedDate = date.toLocaleString(lang, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            });
            console.log(formattedDate);
            document.getElementById("expired-date").innerHTML = formattedDate;
        </script>
    </template>
    <rh-ctx-st></rh-ctx-st>
</body>

</html>
  `;
}
