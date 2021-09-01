export const getUserPlatform = () => {
  if (services.User.getUser().getSelectedPersona().isPlaystation) {
    return "ps";
  } else if (services.User.getUser().getSelectedPersona().isXbox) {
    return "xbox";
  } else {
    return "pc";
  }
};
