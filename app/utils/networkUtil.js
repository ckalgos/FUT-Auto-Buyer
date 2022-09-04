import { sendExternalRequest } from "../services/externalRequest";

export const sendRequest = (url, method, identifier) => {
  return new Promise((resolve, reject) => {
    sendExternalRequest({
      method,
      identifier,
      url,
      onload: (res) => {
        if (res.status !== 200) {
          return reject();
        }
        return resolve(res.response);
      },
    });
  });
};
