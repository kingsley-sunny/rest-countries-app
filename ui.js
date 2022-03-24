const http = new EasyHTTP();

class UI {
  changeToDarkMode() {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.toggle("dark");
    } else {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.toggle("dark");
    }
  }

  checkStorage(key) {
    if (!localStorage.getItem(key)) {
      return false;
    }
    return localStorage.getItem(key);
  }

  store(key, value) {
    const hide = btoa(value);
    localStorage.setItem(key, hide);
  }

  get(key) {
    if (!this.checkStorage()) {
      this.store(key, "");
      return;
    }
    const value = localStorage.getItem(key);
    const reveal = atob(value);
  }

  displayOptions(e) {
    const filterList = document.querySelector("#filter-list");
    if (!e.target.classList.contains("result")) {
      console.log(e.target.id);
      filterList.classList.toggle("hidden");
    }
  }

  displayFilteredItem(e) {
    const filterContainer = document.querySelector("#filter-container");
    const filterList = document.querySelector("#filter-list");
    let result;
    if (!document.querySelector("#result")) {
      result = document.createElement("div");
      result.id = "result";
      result.innerHTML = `
                <div class="result bg-gray-400 text-sm rounded-full px-2 flex justify-between items-center">
                <p class="result">${e.target.textContent}</p>
                <span id="cancel-filter-btn" class="result p-1 cursor-pointer font-bold">X</span>
                </div>
            `;
      filterContainer.append(result);
      filterList.classList.add("hidden");
    }

    result = document.querySelector("#result");
    result.children[0].children[0].textContent = e.target.textContent;
    console.log(e.target.textContent);
    filterList.classList.add("hidden");

    console.log();
  }

  displayLoading() {
    const loading = `
        <div class="col-span-4 flex flex-col justify-center items-center gap-y-2">
        <img src="./img/loading-buffering.gif" alt="" class="w-32 h-32">
        <p class="">Loading</p>    
        </div>
        `;
    const container = document.querySelector("#countries-container");
    container.innerHTML = loading;
  }

  displayError(err) {
    const loading = `
        <div class="col-span-4 border-2 flex flex-col justify-center items-center gap-y-2">
        <h2 class="text-3xl text-red-700 font:bold dark:text-red-300">Error</h2>
        <p class="">${err.message}</p>    
        </div>
        `;
    const container = document.querySelector("#countries-container");
    container.innerHTML = loading;
    console.log(err);
  }

  getCountries() {
    const countries = [];
    const countriesNum = [];
    this.displayLoading();
    http.get("https://restcountries.com/v2/all").then((res) => {
      let i = 0;
      while (i < 12) {
        const random = Math.floor(Math.random() * res.length);
        if (!countriesNum.includes(random)) {
          countriesNum.push(random);
          countries.push(res[random]);
          i++;
        }
      }
      console.log("dome");
      console.log(countries);
      this.renderCounryToUI(
        countries,
        document.querySelector("#countries-container")
      );
    });
  }

  getCountriesByRegion(e) {
    if (e.target.classList.contains("filter-options")) {
      const search = document.querySelector("#search-input");
      search.value = "";
      this.displayLoading();
      const text = e.target.textContent;
      http
        .get(`https://restcountries.com/v3.1/subregion/${text.toLowerCase()}`)
        .then((res, err) => {
          console.log(res);
          if (res.status !== 404) {
            this.renderCounryToUI(
              res,
              document.querySelector("#countries-container"),
              "common"
            );
          } else {
            this.displayError(res);
          }
        })
        .catch((err) => {
          this.displayError(err);
        });
    }
  }

  linkToCountryPage(e) {
    e.preventDefault();

    if (e.target.classList.contains("countries")) {
      console.log(document.querySelector(".countries"));
    }
  }

  searchForACountry() {
    const search = document.querySelector("#search-input");
    http
      .get(`https://restcountries.com/v3.1/name/${search.value}`)
      .then((res, err) => {
        console.log(res);
        this.displayLoading();
        this.renderCounryToUI(
          res,
          document.querySelector("#countries-container"),
          "common"
        );
      });
  }

  renderCounryToUI(items, selector, official) {
    selector.innerHTML = "";
    items.forEach((item) => {
      const post = `
            <a href="country.html" class="countries max-w-xs shadow-md rounded-sm overflow-hidden grid grid-rows-2 light-mode mode bg-white text-gray-700 dark:text-white dark:bg-gray-800">
                <div class="countries border-b-2">
                    <img src=${
                      item.flags.png
                    } class=" countries w-full h-[185px] object-container object-center">
                </div>
                <div class="countries px-6 pt-8 overflow-hidden">
                    <h2 class="countries text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap ">${
                      item.name[official] || item.name
                    }</h2>
                    <div class="countries mt-2 space-y-1.5">
                        <p class="countries font-[800]">Population: <span class="font-[400] ml-1">${
                          item.population
                        }</span></p>
                        <p class="countries font-[800]">Region: <span class="font-[400] ml-1">${
                          item.region
                        }</span></p>
                        <p class="countries font-[800]">Capital: <span class="font-[400] ml-1">${
                          item.capital
                        }</span></p>
                    </div>
                </div>
            </a>
            `;
      selector.innerHTML += post;
    });
  }

  cancelFilter(e) {
    console.log(e.target.id);
    if (e.target.id === "cancel-filter-btn") {
      console.log(e.target);
      console.log(e.target.parentElement);
      e.target.parentElement.parentElement.remove();
    }
  }
}

