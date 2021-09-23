let eventMappers = new Set();

export const generateButton = (id, label, callback, additionalClasses) => {
  if (!eventMappers.has(id)) {
    initializeListensers(id, callback);
    eventMappers.add(id);
  }
  return `<button class="btn-standard ${additionalClasses}" id="${id}">${label}</button>`;
};

const initializeListensers = (id, callback) => {
  $(document).on(
    {
      mouseenter: function () {
        $(this).addClass("hover");
      },
      mouseleave: function () {
        $(this).removeClass("hover");
      },
      click: function () {
        callback();
      },
    },
    `#${id}`
  );
};
