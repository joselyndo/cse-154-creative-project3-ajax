/**
 * Header comment
 */

"use strict";

(function() {
  const BASE_URL = "https://www.cheapshark.com/api/1.0/";
  const DEALS_ENDPOINT = "deals?";
  const GAMES_ENDPOINT = "games?";
  const DEALS_REDIRECT = "https://www.cheapshark.com/redirect?dealID=";
  const SEARCH_EXACT = "&exact=1";
  const CURR_ON_SALE = "onSale=1";
  const THUMBNAIL_ALT = " thumbnail";
  const NORMAL_PRICE = "Normal price: $";
  const CURR_PRICE = "Current price: $";
  const CURR_CHEAPEST_PRICE = "Current cheapest price: $";

  window.addEventListener("load", init);

  function init() {
    addDealsToHome();

    let dealsBtn = document.getElementById("deals-btn");
    dealsBtn.addEventListener("click", getMoreDeals);

    let searchBtn = document.getElementById("search-btn");
    searchBtn.addEventListener("click", searchGames);
  }

  function addDealsToHome() {
    let dealsPreview = document.querySelector("div");
    dealsPreview.innerHTML = "";
    queryDeals(BASE_URL + DEALS_ENDPOINT + CURR_ON_SALE + "&pageSize=5", dealsPreview);
  }

  async function queryDeals(url, dealsContainer) {
    try {
      let response = await fetch(url);
      await statusCheck(response);
      response = await response.json();
      handleDealsReponse(response, dealsContainer);
    } catch (error) {
      handleDealsError(dealsContainer);
    }
  }

  function getMoreDeals() {
    let resultsSection = document.getElementById("results-section");
    resultsSection.innerHTML = "";

    let dealsHeader = document.createElement("h1");
    dealsHeader.textContent = "Deals";
    resultsSection.appendChild(dealsHeader);

    let resultsContainer = document.createElement("section");
    queryDeals(BASE_URL + DEALS_ENDPOINT + CURR_ON_SALE, resultsContainer);
    resultsSection.appendChild(resultsContainer);
    revealResults();
  }

  function handleDealsReponse(response, container) {
    let deals = createDeals(response);
    addToDealsContainer(deals, container);
  }

  function createDeals(response) {
    let dealsArr = [];
    for (let deal = 0; deal < response.length; deal++) {
      let gameThumbnail = document.createElement("img");
      gameThumbnail.src = response[deal].thumb;
      gameThumbnail.alt = response[deal].title + THUMBNAIL_ALT;

      let title = document.createElement("h3");
      title.textContent = response[deal].title;

      let dealSection = document.createElement("section");
      dealSection.appendChild(gameThumbnail);
      dealSection.appendChild(title);
      dealSection.appendChild(createPElement(NORMAL_PRICE + response[deal].normalPrice));
      dealSection.appendChild(createPElement(CURR_PRICE + response[deal].salePrice));
      dealSection.appendChild(createDealLink(DEALS_REDIRECT + response[deal].dealID));
      dealsArr.push(dealSection);
    }

    return dealsArr;
  }

  function addToDealsContainer(deals, container) {
    for (let deal = 0; deal < deals.length; deal++) {
      container.appendChild(deals[deal]);
    }
  }

  function searchGames() {
    let searchBar = document.getElementById("search-bar");
    let resultsHeader = document.createElement("h1");
    resultsHeader.textContent = "Results for " + "\"" + searchBar.value + "\"";

    let resultsContainer = document.createElement("section");
    let resultsSection = document.getElementById("results-section");
    resultsSection.innerHTML = "";
    resultsSection.appendChild(resultsHeader);
    resultsSection.appendChild(resultsContainer);
    queryListOfGames(searchBar.value);
    revealResults();
  }

  async function queryListOfGames(searchInput) {
    try {
      let queryURL = BASE_URL + GAMES_ENDPOINT + "title=" + searchInput;
      if (document.getElementById("checkbox").checked) {
        queryURL += SEARCH_EXACT;
      }

      let response = await fetch(queryURL);
      await statusCheck(response);
      response = await response.json();
      if (response.length > 0) {
        displayGames(response);
      } else {
        displayNoResults();
      }
    } catch (error) {
      handleLookupError();
    }
  }

  function displayGames(response) {
    let resultsContainer = document.querySelector("#results-section section");

    for (let result = 0; result < response.length; result++) {
      let gameThumbnail = document.createElement("img");
      gameThumbnail.src = response[result].thumb;
      gameThumbnail.alt = response[result].external + THUMBNAIL_ALT;

      let gameName = document.createElement("h3");
      gameName.textContent = response[result].external;

      let gameResult = document.createElement("section");
      gameResult.appendChild(gameThumbnail);
      gameResult.appendChild(gameName);
      gameResult.appendChild(createPElement(CURR_CHEAPEST_PRICE + response[result].cheapest));
      gameResult.appendChild(createDealLink(DEALS_REDIRECT + response[result].cheapestDealID));
      resultsContainer.appendChild(gameResult);
    }
  }

  function createPElement(content) {
    let pElement = document.createElement("p");
    pElement.textContent = content;
    return pElement;
  }

  function createDealLink(link) {
    let dealLink = document.createElement("a");
    dealLink.href = link;
    dealLink.target = "_blank";
    dealLink.textContent = "Go to deal";
    return dealLink;
  }

  function displayNoResults() {
    addMessage("No results found");
  }

  function revealResults() {
    let resultsSection = document.getElementById("results-section");
    if (!resultsSection.checkVisibility()) {
      resultsSection.classList.remove("invisible");
      resultsSection.classList.add("visible");
    }
  }

  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  function handleDealsError(dealsContainer) {
    addMessage("Error: unable to display deals", dealsContainer);
  }

  function handleLookupError() {
    addMessage("Error: please try again later", document.getElementById("results-section"));
  }

  function addMessage(message, messageContainer) {
    let errorMessage = document.createElement("p");
    errorMessage.textContent = message;
    messageContainer.appendChild(errorMessage);
  }
})();