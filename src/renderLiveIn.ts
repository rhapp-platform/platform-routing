export default function renderLiveIn(nbf: string) {
  return `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://r.rhap.cc/latest/rh.css?latest" rel="stylesheet">
    <script src="/static/is.js"></script>
    <title>App Not Live</title>
</head>

<body class="light primary">
    <template id="rh-ctx-url">
        <header class="primary">
            <h6 class="center-align"><rh-span>@AG/AN</rh-span></h6>
        </header>
        <div class="fixed center middle center-align">
            <rh-icon-bare name="mdi:calendar-clock" size="8rem"></rh-icon-bare>
            <h6><rh-span>App is Not Live Yet!</rh-span></h6>
            <p class="">It will be available on</p>
            <h6 class="bold" id="livein-date"></h6>
            <div class="space"></div>
            <div>
                <p class="no-line small-text">Please check back later.If you have questions, please
                    contact the
                    app owner.</p>
            </div>
        </div>
        <rh-copyright size="small"></rh-copyright>
        <script>
            const htmlElement = document.documentElement;
            const lang = htmlElement.getAttribute('lang');
            console.log('HTML lang attribute:', lang);
            const t = "${nbf}";
            console.log(t);
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
            document.getElementById("livein-date").innerHTML = formattedDate;
        </script>
    </template>
    <rh-ctx-url></rh-ctx-url>
</body>

</html>
  `;
}
