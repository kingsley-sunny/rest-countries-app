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
    if (this.checkStorage() == true) {
      this.store(key, "");
      return;
    }
    const value = localStorage.getItem(key);
    const reveal = atob(value);
    return reveal;
  }

  displayOptions(e) {
    const filterList = document.querySelector("#filter-list");
    if (!e.target.classList.contains("result")) {
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
    filterList.classList.add("hidden");

  }

  displayLoading(selector) {
    const loading = `
        <div class="col-span-4 flex flex-col justify-center items-center gap-y-2">
        <img src="./img/loading-buffering.gif" alt="" class="w-32 h-32">
        <p class="">Loading</p>    
        </div>
        `;
    
    selector.innerHTML = loading;
  }

  displayError(err, selector) {
    const loading = `
        <div class="col-span-4 border-2 flex flex-col justify-center items-center gap-y-2">
        <h2 class="text-3xl text-red-700 font:bold dark:text-red-300">Error</h2>
        <p class="">${err.message}</p>    
        </div>
        `;
    selector.innerHTML = loading;
  }

  getCountries() {
    const countries = [];
    const countriesNum = [];
    this.displayLoading(document.querySelector("#countries-container"));
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
      this.renderCountryToUI(
        countries,
        document.querySelector("#countries-container"),
        'official'
      );
    });
  }

  getCountriesByRegion(e) {
    if (e.target.classList.contains("filter-options")) {
      const search = document.querySelector("#search-input");
      search.value = "";
      this.displayLoading(document.querySelector("#countries-container"));
      const text = e.target.textContent;
      http
        .get(`https://restcountries.com/v3.1/subregion/${text.toLowerCase()}`)
        .then((res, err) => {
          if (res.status !== 404) {
            this.renderCountryToUI(
              res,
              document.querySelector("#countries-container"),
              "official"
            );
          } else {
            this.displayError(res, document.querySelector('#countries-container'));
          }
        })
        .catch((err) => {
          this.displayError(err, document.querySelector('#countries-container'));
        });
    }
  }
   
  getCountryDetails(e) {
    this.displayLoading(document.querySelector("#country-details"));
    
    const value = this.get("restCountries");
    http
      .get(`https://restcountries.com/v3.1/name/${value}?fullText=true`)
      .then((res, err) => {
          if(this.status !== 404){
              this.renderCountryDetailsToUI(res, document.querySelector('#country-details'));
          } else {
              this.displayError(err, this.displayError(res, document.querySelector('#country-details')))
          }
      }).catch(err => {
          this.displayError(err, document.querySelector('#country-details'))
      })
  }

  linkToCountryPage(e) {
    e.preventDefault();
    if (e.target.attributes.getNamedItem("country-name")) {
      const name = e.target.attributes.getNamedItem("country-name").value;
      this.store("restCountries", name);
      window.location = "country.html";
    }
  }

  searchForACountry() {
    const search = document.querySelector("#search-input");
    http
      .get(`https://restcountries.com/v3.1/name/${search.value}`)
      .then((res, err) => {
        this.displayLoading(document.querySelector("#countries-container"));
        this.renderCountryToUI(
          res,
          document.querySelector("#countries-container"),
          "common"
        );
      });
  }

  renderCountryToUI(items, selector, common) {
    selector.innerHTML = "";
    if (items.length < 1) {
      return;
    }
    items.forEach((item) => {
      const post = `
            <a country-name = "${
              item.name[common] || item.name
            }" class="max-w-xs shadow-md cursor-pointer rounded-sm overflow-hidden grid grid-rows-2 light-mode mode bg-white text-gray-700 dark:text-white dark:bg-gray-800">
                <div country-name = "${
                  item.name[common] || item.name
                }" class="border-b-2 dark:border-b-0 cursor-pointer">
                    <img src=${item.flags.png} country-name = "${
        item.name[common] || item.name
      }" class=" w-full h-[185px] object-container cursor-pointer object-center">
                </div>
                <div country-name = "${
                  item.name[common] || item.name
                }" class="px-6 pt-8 overflow-hidden cursor-pointer">
                    <h2 country-name = "${
                      item.name[common] || item.name
                    }" class="text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer">${
        item.name[common] || item.name
      }</h2>
                    <div country-name = "${
                      item.name[common] || item.name
                    }" class="mt-2 space-y-1.5 cursor-pointer">
                        <p country-name = "${
                          item.name[common] || item.name
                        }" class="font-[800] cursor-pointer">Population: <span class="font-[400] ml-1">${
        item.population
      }</span></p>
                        <p country-name = "${
                          item.name[common] || item.name
                        }" class="font-[800]">Region: <span class="font-[400] ml-1 cursor-pointer">${
        item.region
      }</span></p>
                        <p country-name = "${
                          item.name[common] || item.name
                        }" class="font-[800]">Capital: <span class="font-[400] ml-1 cursor-pointer">${
        item.capital
      }</span></p>
                    </div>
                </div>
            </a>
            `;
      selector.innerHTML += post;
    });
  }

  renderCountryDetailsToUI(array, selector){
      const data = array[0];
    const details = `
    <div class="w-full h-full">
               <img src=${data.flags.png} class="w-full h-full object-container object-center" alt="">
           </div>
           <div class=" ">
                <div class="">
                    <h1 class="text-3xl font-bold">${data.name.common}</h1>
                    <div class="md:grid grid-cols-2 gap-x-4 items-start">
                        <ul class="mt-8 space-y-4">
                            <li class="font-[500] capitalize">Native Name:<span class="font-[400] ml-2">${data.name.nativeName[Object.keys(data.name.nativeName)[Object.keys(data.name.nativeName).length - 1]].official}</span></li>
                            <li class="font-[500] capitalize">population:<span class="font-[400] ml-2">${data.population}</span></li>
                            <li class="font-[500] capitalize">region:<span class="font-[400] ml-2">${data.region}</span></li>
                            <li class="font-[500] capitalize">sub region:<span class="font-[400] ml-2">${data.subregion}</span></li>
                            <li class="font-[500] capitalize">capital:<span class="font-[400] ml-2">${data.capital}</span></li>
                        </ul>

                        <ul class="mt-8 space-y-4">
                            <li class="font-[500] capitalize">top level domain:<span class="font-[400] ml-2">${data.tld}</span></li>
                            <li class="font-[500] capitalize">currencies:<span class="font-[400] ml-2">${Object.keys(data.currencies)}</span></li>
                            <li class="font-[500] capitalize">languages:<span class="font-[400] ml-2">${Object.keys(data.languages)}</span></li>
                        </ul>
                    </div>
    
                </div>

                <div class="mt-10 md:flex gap-x-5  items-baseline">
                    <h1 class="text-lg md:text-base  font-[500]">Border Countries</h1>
                    <div class="flex items-center flex-wrap mt-4 gap-2">
                        ${
                            data.borders ? data.borders.map(item =>  `<button class="py-1.5 px-4 bg-white dark:bg-gray-700 rounded-lg shadow-xl border-2 dark:border-0 cursor-default">${item}</button>`): 'No borders'
                        }

                        
                    </div>
                </div>
           </div>
    `;

    selector.innerHTML = details;
  }

  cancelFilter(e) {
    if (e.target.id === "cancel-filter-btn") {
      e.target.parentElement.parentElement.remove();
    }
  }
}

