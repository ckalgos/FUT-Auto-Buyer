import { getValue, setValue } from "../services/repository";

export const getUserPlatform = () => {
  let platform = getValue("userPlatform");
  if (platform) return platform;

  if (services.User.getUser().getSelectedPersona().isPlaystation) {
    setValue("userPlatform", "ps");
    return "ps";
  } else if (services.User.getUser().getSelectedPersona().isXbox) {
    setValue("userPlatform", "xbox");
    return "xbox";
  } else {
    setValue("userPlatform", "pc");
    return "pc";
  }
};
