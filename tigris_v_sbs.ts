// We use this in TEST.js to compare the performance of Tigris vs SBS
// SBS seems to be faster....
// We will use SBS for primary app but then Tigris for archiving and "temp" TTL content
// as well as probably app specific content and data...so keep to close to the requester
// and make caching a non-issue....

const sbsBase = "https://sb.rhap.cc/storage/v1/object/public/apps";
const tigrisBase = "https://fly.storage.tigris.dev/pub.rhapp.net";

// Function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer); // Create a byte array from the buffer
  const len = bytes.byteLength;

  // Iterate through each byte and build a binary string
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  // Encode the binary string to Base64
  return btoa(binary);
}

export default {
  async fetch(request) {
    // START ORIGINAL REQUEST URL DECODE
    const url = new URL(request.url);
    const ag = url.hostname.split(".")[0];
    const [, an, sidecar, block, other] = url.pathname.split("/");
    const hasTigris = url.searchParams.has("tigris");
    // END ORIGINAL REQUEST URL DECODE

    const base = hasTigris ? tigrisBase : sbsBase;
    //const base = tigrisBase;

    const t1 = performance.now();
    // const response = await fetch(`${base}/${ag}/${an}/app.rhc.flc`);
    // const response = await fetch(`${base}/${ag}/${an}/text.rhc.txt`);
    const response = await fetch(`${base}/${ag}/${an}/100k.bin`);
    const t2 = performance.now();
    // Convert response to a Blob
    const arrayBuffer = await response.arrayBuffer();
    // Convert ArrayBuffer to Base64
    const b64 = arrayBufferToBase64(arrayBuffer);
    const t3 = performance.now();
    const headerObj = Object.fromEntries(response.headers.entries());
    const et = t2 - t1;
    const et2 = t3 - t2;
    const resp = JSON.stringify({
      et,
      et2,
      status: response.status,
      headerObj,
      b64,
    });
    return new Response(resp, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
