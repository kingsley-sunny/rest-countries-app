window.onload = () => {
  const ui = new UI();
  const html = new Html();
  console.log(html);

  document.querySelector("#dark-mode-btn").addEventListener("click", () => {
    ui.changeToDarkMode();
  });

  html.htmlDom(document.querySelector("#filter-list"), {
    eventName: "click",
    eventHandler: (e) => {
      ui.displayFilteredItem(e);
      ui.getCountriesByRegion(e);
    },
  });

  html.htmlDom(document.querySelector("#filter-container"), {
    eventName: "click",
    eventHandler: (e) => {
      ui.displayOptions(e);
    },
  });

  try {
    ui.getCountries();
  } catch (error) {}

  html.htmlDom(document.querySelector("#filter-container"), {
    eventName: "click",
    eventHandler: (e) => {
      ui.cancelFilter(e);
    },
  });

  html.htmlDom(document.querySelector("form"), {
    eventName: "submit",
    eventHandler: (e) => {
      e.preventDefault();
      ui.searchForACountry();
    },
  });

  html.htmlDom(document.querySelector("#countries-container"), {
    eventName: "click",
    eventHandler: (e) => {
      console.log(document.querySelector(".countries"));
      e.preventDefault();
      ui.linkToCountryPage(e);
    },
  });

};
