const magnifyGlass = document.getElementById("magnify-glass");
const magnifyGlassDiv = document.querySelector(".magnify-glass-div");
const mainContainer = document.querySelector(".main-container");
const clickIconText = document.querySelector(".click-icon-text");
const searchContainer = document.createElement("div");
const searchInput = document.createElement("input");
const xIcon = document.createElement("div");
const errorText = document.createElement("p");
errorText.append("Couldn't find any results for your search...");

searchContainer.setAttribute("class", "search-container");
searchInput.setAttribute("type", "text");
searchInput.setAttribute("onkeypress", "return enterKeyPressed(event)");
xIcon.setAttribute("class", "fa fa-times");
xIcon.setAttribute("id", "x-icon");

searchContainer.append(searchInput);
searchContainer.append(xIcon);

magnifyGlass.addEventListener("click", function () {
  magnifyGlass.style.display = "none";
  magnifyGlassDiv.append(searchContainer);
});

xIcon.addEventListener("click", function () {
  magnifyGlass.style.display = "block";
  searchInput.value = "";
  magnifyGlassDiv.removeChild(searchContainer);
  if (mainContainer.children.length === 5) {
    mainContainer.removeChild(mainContainer.children[4]);
  }
  clickIconText.style.display = "block";
});

let titleArray;
let snippetArray = [];

const getWikiArticle = (searchParam) => {
  fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchParam}&srprop=sectiontitle&origin=*&format=json&formatversion=2`
  )
    .then((response) => response.json())
    .catch(() => console.error("there was an error making your request"))
    .then((data) => {
      titleArray = data.query.search;
    });
};

const getWikiArticle2 = (searchParam) => {
  fetch(
    `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=${searchParam}&origin=*&format=json&formatversion=2&exsentences=1&explaintext=1`
  )
    .then((response) => response.json())
    .catch(() => console.error("there was an error making your request"))
    .then((data) => {
      snippetArray.push(data.query.pages[0]);
    });
};

function enterKeyPressed(event) {
  if (event.keyCode === 13) {
    snippetArray = [];
    if (mainContainer.children.length === 5) {
      mainContainer.removeChild(mainContainer.children[4]);
    }
    getWikiArticle(searchInput.value);
    let resultsContainer = document.createElement("div");
    resultsContainer.setAttribute("class", "results-container");
    mainContainer.append(resultsContainer);
    setTimeout(() => {
      if (titleArray.length !== 0) {
        clickIconText.style.display = "none";
        setTimeout(() => {
          for (let i = 0; i < 10; i++) {
            getWikiArticle2(titleArray[i].title);
          }
        }, 750);
        setTimeout(() => {
          for (let i = 0; i < snippetArray.length; i++) {
            let resultsLink = document.createElement("a");
            resultsLink.setAttribute(
              "href",
              `https://en.wikipedia.org/?curid=${snippetArray[i].pageid}`
            );
            resultsLink.setAttribute("target", "_blank");
            let resultDiv = document.createElement("div");
            resultDiv.setAttribute("class", "result-div");
            let rCh3 = document.createElement("h3");
            let rCp = document.createElement("p");
            rCh3.append(snippetArray[i].title);
            rCp.append(snippetArray[i].extract);
            resultDiv.append(rCh3);
            resultDiv.append(rCp);
            resultsLink.append(resultDiv);
            resultsContainer.append(resultsLink);
          }
        }, 1250);
      } else {
        mainContainer.append(errorText);
        setTimeout(() => {
          mainContainer.removeChild(errorText);
        }, 3000);
      }
    }, 500);
  }
}
