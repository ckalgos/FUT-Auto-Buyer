export const getCurrentController = () => {
  return getAppMain()
    .getRootViewController()
    .getPresentedViewController()
    .getCurrentViewController()
    .getCurrentController();
};
