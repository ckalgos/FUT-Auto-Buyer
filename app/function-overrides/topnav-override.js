export const topNavOverride = () => {
  const layoutSubViews = UTNavigationBarView.prototype.layoutSubviews;
  UTNavigationBarView.prototype.layoutSubviews = function (...args) {
    const result = layoutSubViews.call(this, ...args);
    if (this.primaryButton && this.__clubInfo) {
      this._menuBtn && this._menuBtn.removeFromSuperview();
      this._menuBtn = generateNavButton.call(this);
      const settingBtn = $(this.primaryButton.getRootElement());
      const menuBtn = $(this._menuBtn.getRootElement());
      $(".top-nav").remove();
      settingBtn.wrap(`<div class="top-nav"></div>`);
      menuBtn.insertBefore(settingBtn);
    }
    return result;
  };

  function generateNavButton() {
    const _menuBtn = new UTNavigationButtonControl();
    _menuBtn.init();
    _menuBtn.addClass("menu-btn");
    _menuBtn.setInteractionState(!0);
    _menuBtn.addTarget(
      this,
      () => {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: "OpenDrawer" })
        );
      },
      EventType.TAP
    );
    return _menuBtn;
  }
};
