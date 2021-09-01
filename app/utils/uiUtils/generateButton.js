export const generateButton = (id, label, callback, additionalClasses) => {
  initializeListensers(id, callback);
  return `<button class="btn-standard ${additionalClasses}" id="${id}">${label}</button>`;
};

const initializeListensers = (id, callback) => {
  jQuery(document).on(
    {
      mouseenter: function () {
        jQuery(this).addClass("hover");
      },
      mouseleave: function () {
        jQuery(this).removeClass("hover");
      },
      click: function () {
        callback();
      },
    },
    `#${id}`
  );
};
