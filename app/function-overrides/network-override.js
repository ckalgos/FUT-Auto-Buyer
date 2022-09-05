const defaultFetch = window.fetch;
window.fetch = function (request, options) {
  if (
    request &&
    /discordapp/.test(request) &&
    (options.method === "POST" || options.method === "DELETE")
  ) {
    return new Promise((resolve, reject) => {
      const headers = Object.assign({}, options.headers, {
        "User-Agent": "From Node",
      });
      GM_xmlhttpRequest({
        method: options.method,
        headers,
        url: request,
        data: options.body,
        onload: (res) => {
          if (res.status === 200 || res.status === 204) {
            res.text = () =>
              new Promise((resolve) => resolve(res.responseText));
            res.headers = res.responseHeaders
              .split("\r\n")
              .reduce(function (acc, current) {
                var parts = current.split(": ");
                acc.set(parts[0], parts[1]);
                return acc;
              }, new Map());
            resolve(res);
          } else {
            reject(res);
          }
        },
      });
    });
  }
  const response = defaultFetch.call(this, request, options);
  return response;
};
