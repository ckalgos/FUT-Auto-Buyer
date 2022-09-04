export const getCardName = (card) => {
  const translationService = services.Localization;
  if (!translationService) {
    return "";
  }
  if (card.isManagerContract()) {
    return translationService.localize("card.title.managercontracts");
  } else if (card.isPlayerContract()) {
    return translationService.localize("card.title.playercontracts");
  } else if (card.isStyleModifier()) {
    return UTLocalizationUtil.playStyleIdToName(
      card.subtype,
      translationService
    );
  } else if (card.isPlayerPositionModifier()) {
    return translationService
      .localize(
        "card.desc.training.pos." +
          card._staticData.trainPosFrom +
          "_" +
          card._staticData.trainPosTo
      )
      .replace(" >> ", "->");
  }
  return card._staticData.name;
};
