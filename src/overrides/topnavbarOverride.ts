import { find } from "../utils/UI/dom/dom.util";

export const topNavBarOverride = () => {
  const layoutSubViews = UTNavigationBarView.prototype.layoutSubviews;
  UTNavigationBarView.prototype.layoutSubviews = function (...args) {
    const result = layoutSubViews.call(this, ...args);
    if (this.primaryButton && this.__clubInfo) {
      this._menuBtn && this._menuBtn.removeFromSuperview();
      this._menuBtn = generateNavButton.call(this);
      const settingBtn = this.primaryButton.getRootElement();
      const menuBtn = this._menuBtn.getRootElement();
      find(".top-nav")?.remove();

      const wrapper = document.createElement("div");
      wrapper.classList.add("top-nav");

      wrapper.appendChild(settingBtn);
      settingBtn.parentNode?.insertBefore(menuBtn, settingBtn);
      console.log(wrapper);

      const topBarElement = this.getRootElement();
      topBarElement.insertBefore(wrapper, topBarElement.firstChild);
    }
    return result;
  };

  const generateNavButton = () => {
    const menuBtn = new UTNavigationButtonControl();
    menuBtn.init();
    menuBtn.addClass("menu-btn");
    menuBtn.setInteractionState(!0);
    menuBtn.addTarget(
      this,
      () => {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: "OpenDrawer" })
        );
      },
      EventType.TAP
    );
    return menuBtn;
  };
};
