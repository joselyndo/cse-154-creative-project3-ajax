/**
 * Header comment
 */

"use strict";

(function() {
  const BASE_URL = "https://www.cheapshark.com/api/1.0/";
  const DEALS_ENDPOINT = "deals?";
  const GAMES_ENDPOINT = "games?";
  const METACRITIC_BASE_URL = "https://www.metacritic.com/";
  const DEALS_REDIRECT = "https://www.cheapshark.com/redirect?dealID=";
  const THUMBNAIL_ALT = " thumbail";
  const CHEAPEST_PRICE = "Cheapest price: $";

  window.addEventListener("load", init);

  function init() {
    let dealsBtn = document.getElementById("deals-btn");
    dealsBtn.addEventListener("click", getMoreDeals);

    let searchBtn = document.getElementById("search-btn");
    searchBtn.addEventListener("click", searchGames);
  }

  function getMoreDeals() {
    revealResults();

  }

  function searchGames() {
    let searchBar = document.querySelector("input");
    let resultsHeader = document.createElement("h1");
    resultsHeader.textContent = "Results for " + "\"" + searchBar.value + "\"";

    let resultsContainer = document.createElement("section"); // the section to contain the results
    let resultsSection = document.getElementById("results-section");
    resultsSection.innerHTML = "";
    resultsSection.appendChild(resultsHeader);
    resultsSection.appendChild(resultsContainer);
    queryListOfGames(searchBar.value);
    revealResults();
  }

  async function queryListOfGames(searchInput) {
    try {
      let response = await fetch(BASE_URL + GAMES_ENDPOINT + "title=" + searchInput);
      await statusCheck(response);
      response = await response.json();
      if (response.length > 0) {
        displayGames(response);
      } else {
        displayNoResults();
      }
    } catch (error) {
      handleError();
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

      let price = document.createElement("p");
      price.textContent = CHEAPEST_PRICE + response[result].cheapest;

      let dealLink = document.createElement("a");
      dealLink.href = DEALS_REDIRECT + response[result].cheapestDealID;
      dealLink.target = "_blank";
      dealLink.textContent = "Go to deal";

      let gameResult = document.createElement("section");
      gameResult.appendChild(gameThumbnail);
      gameResult.appendChild(gameName);
      gameResult.appendChild(price);
      gameResult.appendChild(dealLink);
      resultsContainer.appendChild(gameResult);
    }
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

  function handleError() {
    addMessage("Error: try again later");
  }

  function addMessage(message) {
    let resultsSection = document.getElementById("results-section");
    let errorMessage = document.createElement("p");
    errorMessage.textContent = message;
    resultsSection.appendChild(errorMessage);
  }

})();

/**
 * Things to consider
 * Redirect to deal
 *  https://www.cheapshark.com/redirect?dealID={id}
 * List of deals
 *  https://www.cheapshark.com/api/1.0/deals?
 *    pageNumber,pageSize, desc,lowerPrice, upperPrice, metacritic,
 *    steamRating, maxAge, title, exact, onSale
 *    sortBy
 *      DealRating, Title, Savings, Price, Metacritic, Reviews, Release, Store, Recent
 * Deal lookup
 *  https://www.cheapshark.com/api/1.0/deals?id=
 *  id
 * List of Games
 *  https://www.cheapshark.com/api/1.0/games?
 *  title, steamAppID,limt, exact
 * Game look up
 *  https://www.cheapshark.com/api/1.0/games?id=
 * id
 */

// Deals or search up games
// Deals > check out deals button
// Games
// Enter title (to get list of games)
//  Click a game = pulls up deals (use game lookup)
// Click a specific deal = Deal lookup