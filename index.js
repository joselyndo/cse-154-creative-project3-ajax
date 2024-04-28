/**
 * Header comment
 */

"use strict";

(function() {
  const BASE_URL = "https://www.cheapshark.com/api/1.0/";
  const DEALS_ENDPOINT = "deals?";
  const GAMES_ENDPOINT = "games?";
  const METACRITIC_BASE_URL = "https://www.metacritic.com/";

  function init() {
    // add event listener to logo image in header
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