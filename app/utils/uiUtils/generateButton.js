let eventMappers = new Set();

export const generateButton = (id, label, callback, additionalClasses) => {
  if (!eventMappers.has(id)) {
    initializeListensers(id, callback);
    eventMappers.add(id);
  }
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
