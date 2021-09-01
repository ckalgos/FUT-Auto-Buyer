module.exports = {
  headers: {
    name: "FUT Auto Buyer",
    namespace: "http://tampermonkey.net/",
    version: "1.0.0",
    description: "FUT Auto Buyer",
    author: "CK Algos",
    match: [
      "https://www.ea.com/*/fifa/ultimate-team/web-app/*",
      "https://www.ea.com/fifa/ultimate-team/web-app/*",
    ],
    grant: ["GM_xmlhttpRequest", "GM_download"],
    connect: ["ea.com", "ea2.com", "futbin.com"],
    require: [
      "https://github.com/chithakumar13/fut-trade-enhancer/releases/latest/download/fut-trade-enhancer.user.js",
    ],
  },
};
