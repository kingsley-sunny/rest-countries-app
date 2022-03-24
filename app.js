window.onload = () => {
  const ui = new UI();

  document.querySelector("#dark-mode-btn").addEventListener("click", () => {
    ui.changeToDarkMode();
  });

  document.querySelector("#filter-list").addEventListener("click", (e) => {
    ui.displayFilteredItem(e);
    ui.getCountriesByRegion(e)
  });

  document.querySelector("#filter-container").addEventListener("click", (e) => {
    ui.displayOptions(e);
  });

  ui.getCountries();

  document.querySelector('#filter-container').addEventListener('click', (e) => {
    ui.cancelFilter(e);
  });

  document.querySelector("form").addEventListener('submit', e => {
      e.preventDefault();
      ui.searchForACountry();
      console.log(e)
  })



};
