/*
 * quotes.js — KAAST banner quotes. One is chosen at random each time the
 * app opens.
 *
 * TO ADD A QUOTE: append an object to the array below and rebuild
 * (python web/build_v15.py). Field:
 *   text : the quote (Odia, English, or mixed — any length)
 * Plain quotes only — no attributions/dates (by request, v1.5).
 */
"use strict";

const KAAST_QUOTES = [
  {
    text: "ଷଣ୍ଢ ମୁଣ୍ଡେ ଚାନ୍ଦ ଉଇଁ ଆସୁଅଛି, କଣା କେରାଣ୍ଡି ଦରାଣ୍ଡି ଧରିଛି। " +
          "ଏମିତି ଯୋଗେ ସୁତ ଜନ୍ମିଲେ ରାଜଯୋଗଟି ହୁଏ ଭଳେ।",
  },
  {
    text: "(That) which is lotted cannot be blotted.",
  },
  {
    text: "ଧ୍ୟାନ ବଳାତିତଂ ନାନ୍ୟଂ ବଳଂ ।",
  },
  {
    text: "ସମୟର ଚକ ଘୁରୁଛି, ଏହି ଚକ ସହିତ କାହାର ଭାଗ୍ୟ ବଦଳୁଛି। " +
          "ରାଜା ରାମଚନ୍ଦ୍ର ଯାଆନ୍ତି ବନବାସ, ନଳ ରାଜା କାଟନ୍ତି ଘାସ। " +
          "ଅଶୋକ ବନେ ଜନକ ରାଜକୁମାରୀ ଲୋତକ ଝରାଉଛନ୍ତି। " +
          "ଏହି ତ ସମୟର ଚକ ଘୁରୁଛି, ଏହି ଚକ ସହିତ କାହାର ଭାଗ୍ୟ ବଦଳୁଛି।",
  },
  {
    text: "କର୍ମ ଫଳେ ଭବେ ବଡ଼ ପଣ ପାଇ, ଧର୍ମ ଫଳେ ତାକୁ କର ଚିର ସ୍ଥାୟୀ |",
  },
];

if (typeof module !== "undefined" && module.exports) module.exports = KAAST_QUOTES;
