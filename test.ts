const R = await fetch("https://glenn.rhapp.app", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});
console.log({ R });

// We are going to use specific ultra-specific cache-control headers to determine if the app is active or inactive

//  max-age=61  ---> APP IS INACTIVE
//  max-age=62 ---> APP IS SUSPENDED
//  max-age=63 ---> APP IS OVER QUOTA
//

// function encodeCacheControl(: number) {
//   return `max-age=${maxAge}`;
// }

// function decodeCacheControl(cacheControl: string) {
//   const [_, maxAge] = cacheControl.split("=");
//   return parseInt(maxAge);
// }
