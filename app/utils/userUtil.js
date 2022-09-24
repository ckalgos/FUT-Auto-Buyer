import { getValue, setValue } from "../services/repository";

export const getUserPlatform = () => {
  let platform = getValue("userPlatform");
  if (platform) return platform;

  if (services.User.getUser().getSelectedPersona().isPC) {
    setValue("userPlatform", "pc");
    return "pc";
  }

  setValue("userPlatform", "ps");
  return "ps";
};

export const updateUserCredits = () => {
  return new Promise((resolve) => {
    services.User.requestCurrencies().observe(this, function (sender, data) {
      resolve();
    });
  });
};
