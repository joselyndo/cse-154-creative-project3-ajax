/**
 * Joselyn Do
 * April 29th, 2024
 * Section AB: Elias & Quinton
 *
 * This is the index.js file adding the functionality to the Video Game Deals webpage.
 * The functionality includes obtaining deals or video games for the user and displaying results
 * for the user.
 */

"use strict";

(function() {
  const BASE_URL = "https://www.cheapshark.com/api/1.0/";
  const DEALS_ENDPOINT = "deals?";
  const GAMES_ENDPOINT = "games?";
  const DEALS_REDIRECT = "https://www.cheapshark.com/redirect?dealID=";
  const SEARCH_EXACT = "&exact=1";
  const CURR_ON_SALE = "onSale=1";
  const RESULTS = "Results for \"";
  const THUMBNAIL_ALT = " thumbnail";
  const NORMAL_PRICE = "Normal price: $";
  const CURR_PRICE = "Current price: $";
  const CURR_CHEAPEST_PRICE = "Current cheapest price: $";

  window.addEventListener("load", init);

  /** Initializes the main page */
  function init() {
    addDealsToHome();

    let dealsBtn = document.getElementById("deals-btn");
    dealsBtn.addEventListener("click", getMoreDeals);

    let searchBtn = document.getElementById("search-btn");
    searchBtn.addEventListener("click", searchGames);
  }

  /** Adds 5 video game deals to the Video Game Deals section */
  function addDealsToHome() {
    let dealsPreview = document.querySelector("div");
    dealsPreview.innerHTML = "";
    queryDeals(BASE_URL + DEALS_ENDPOINT + CURR_ON_SALE + "&pageSize=5", dealsPreview);
  }

  /**
   * Queries for the given url to add results into the given dealsContainer
   * @param {String} url - the url to query.
   * @param {HTMLElement} dealsContainer - the HTML element that will hold the resulting deals
   */
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

  /** Populates the results section with more deals */
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

  /**
   * Handles the output of a valid query for deals
   * @param {JSON[]} response - an array containing JSON objects for each deal
   * @param {HTMLElement} container - the HTML element that will hold the resulting deals
   */
  function handleDealsReponse(response, container) {
    let deals = createDeals(response);
    addToDealsContainer(deals, container);
  }

  /**
   * Converts the given response to an array of HTMLElements to be displayed on the webpage as deals
   * @param {JSON[]} response - an array containing JSON objects for each deal
   * @return {HTMLElement[]} an array containing HTML elements for each deal
   */
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

  /**
   * Adds video game deals to the webpage
   * @param {HTMLElement[]} deals - an array of HTML elements representing deals to be displayed
   * @param {HTMLElement} container - the HTML element to hold and display the deals
   */
  function addToDealsContainer(deals, container) {
    for (let deal = 0; deal < deals.length; deal++) {
      container.appendChild(deals[deal]);
    }
  }

  /** Searches for and displays games specified by the user input */
  function searchGames() {
    let searchBar = document.getElementById("search-bar");
    let resultsHeader = document.createElement("h1");
    resultsHeader.textContent = RESULTS + searchBar.value + "\"";

    let resultsContainer = document.createElement("section");
    let resultsSection = document.getElementById("results-section");
    resultsSection.innerHTML = "";
    resultsSection.appendChild(resultsHeader);
    resultsSection.appendChild(resultsContainer);
    queryListOfGames(searchBar.value);
    revealResults();
  }

  /**
   * Queries for a list of games matching the given search input
   * @param {String} searchInput - a keyword or video game title to query for
   */
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

  /**
   * Displays information regarding the current price of games
   * @param {Response} response - a Response containing an array of JSON elements to display
   */
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

  /**
   * Creates an element to hold text content
   * @param {String} content - the message that a paragraph element will hold
   * @return {HTMLParagraphElement} an element containing text to be displayed
   */
  function createPElement(content) {
    let pElement = document.createElement("p");
    pElement.textContent = content;
    return pElement;
  }

  /**
   * Creates an element that links to another page
   * @param {String} link - a String URL to a webpage
   * @return {HTMLAnchorElement} an element containing the given link
   */
  function createDealLink(link) {
    let dealLink = document.createElement("a");
    dealLink.href = link;
    dealLink.target = "_blank";
    dealLink.textContent = "Go to deal";
    return dealLink;
  }

  /** Displays a message saying that no video game results were found */
  function displayNoResults() {
    addMessage("No results found");
  }

  /** Reveals the results section */
  function revealResults() {
    let resultsSection = document.getElementById("results-section");
    if (!resultsSection.checkVisibility()) {
      resultsSection.classList.remove("invisible");
      resultsSection.classList.add("visible");
    }
  }

  /**
   * Checks to see if the three selected cards make up a valid set. This is done by comparing each
   * of the type of attribute against the other two cards. If each four attributes for each card are
   * either all the same or all different, then the cards make a set. If not, they do not make a set
   * @param {Promise<Response>} res - the response to evaluate the status code of
   * @return {Promise<Response>} a valid response
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Displays a message saying that an error occurred and that the deals cannot be displayed
   * @param {HTMLElement} dealsContainer - the element that will hold the message
   */
  function handleDealsError(dealsContainer) {
    addMessage("Error: unable to display deals", dealsContainer);
  }

  /**
   * Displays a message saying that an error occurred and
   * that the lookup should be done again later
   */
  function handleLookupError() {
    addMessage("Error: please try again later", document.getElementById("results-section"));
  }

  /**
   * Adds the given message to the given container
   * @param {String} message - the message to display
   * @param {HTMLElement} messageContainer - the element that will hold the message
   */
  function addMessage(message, messageContainer) {
    let errorMessage = document.createElement("p");
    errorMessage.textContent = message;
    messageContainer.appendChild(errorMessage);
  }
})();