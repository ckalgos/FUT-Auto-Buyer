import { getValue, setValue } from "./repository";

export const initListeners = () => {
  window.addEventListener(
    "message",
    (payload) => {
      const data = JSON.parse(payload.data);
      switch (data.type) {
        case "dataFromExternalAB": {
          const { res, identifier } = data.response;
          const callBack = getValue(identifier);
          callBack && callBack(res);
          return setValue(identifier, null);
        }
      }
    },
    true
  );
};
