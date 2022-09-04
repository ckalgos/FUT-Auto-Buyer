export const topNavOverride = () => {
  UTNavigationBarView.prototype.layoutSubviews = function () {
    let t = this,
      e = this.getRootElement();
    this.primaryButton &&
      DOMKit.insertBefore(this.primaryButton.getRootElement(), e.firstChild);
    this.secondaryButton &&
      e.appendChild(this.secondaryButton.getRootElement());
    this._subviews.forEach(function (e) {
      e.view !== t.primaryButton &&
        e.view !== t.secondaryButton &&
        e.container.appendChild(e.view.getRootElement());
    }, this);
    if (this.primaryButton && this.__clubInfo) {
      this._menuBtn && this._menuBtn.removeFromSuperview();
      this._menuBtn = generateNavButton.call(this);
      const settingBtn = $(this.primaryButton.getRootElement());
      const menuBtn = $(this._menuBtn.getRootElement());
      $(".top-nav").remove();
      settingBtn.wrap(`<div class="top-nav"></div>`);
      menuBtn.insertBefore(settingBtn);
    }
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
