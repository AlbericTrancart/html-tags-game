const tagsList = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "menu",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "search",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
];

const deprecatedTagsList = [
  "acronym",
  "big",
  "center",
  "dir",
  "font",
  "frame",
  "frameset",
  "image",
  "marquee",
  "menuitem",
  "nobr",
  "noembed",
  "noframes",
  "param",
  "plaintext",
  "rb",
  "rtc",
  "strike",
  "tt",
  "xmp",
];

let tagFounds = [];
let timeLeft = tagsList.length;
let timer = null;

const tagForm = document.getElementById("tag-form");
const gameOverMessage = document.getElementById("game-over");
const timeMeter = document.getElementById("time-meter");
const tagsFoundCounter = document.getElementById("tags-found-counter");
const tagsFoundList = document.getElementById("tags-found-list");
const revealMissedTagsButton = document.getElementById("reveal-missed-tags");
const tryAgainButton = document.getElementById("try-again");
const tagsMissedSection = document.getElementById("tags-missed-section");
const tagsMissedList = document.getElementById("tags-missed-list");

// Set initial values
const totalCounts = document.querySelectorAll("[data-tags-total-count]");
totalCounts.forEach(function (totalCount) {
  totalCount.textContent = tagsList.length;
});
timeMeter.setAttribute("value", timeLeft);
timeMeter.setAttribute("max", timeLeft);
timeMeter.setAttribute("optimum", timeLeft);
timeMeter.setAttribute("high", Math.floor(timeLeft * 0.5));
timeMeter.setAttribute("low", Math.floor(timeLeft * 0.2));
timeMeter.textContent = `${timeLeft} seconds`;

function changeTime(diff) {
  timeLeft += diff;
  timeMeter.setAttribute("value", timeLeft);
  timeMeter.textContent = `${timeLeft} seconds`;
}

function addTagToList(listElement, tagName) {
  const tagLink = document.createElement("a");
  tagLink.textContent = `<${tagName}>`;
  tagLink.setAttribute(
    "href",
    `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/${tagName}`
  );
  tagLink.classList.add("tag-item");
  const tagFound = document.createElement("li");
  tagFound.appendChild(tagLink);
  listElement.appendChild(tagFound);
}

function tagFound(tagName) {
  if (tagFounds.includes(tagName)) {
    return;
  }

  tagFounds.push(tagName);
  changeTime(1);
  tagsFoundCounter.textContent = tagFounds.length;

  addTagToList(tagsFoundList, tagName);

  if (tagFounds.length === tagsList.length) {
    win();
  }
}

function win() {
  clearInterval(timer);
  timer = null;
  alert("You Win!");
}

function gameOver() {
  clearInterval(timer);
  timer = null;

  tagForm.classList.add("hidden");
  gameOverMessage.classList.remove("hidden");
}

tagForm.addEventListener("submit", function (event) {
  const formData = new FormData(tagForm);
  const tagName = formData.get("tag");

  if (timer === null) {
    timer = setInterval(function () {
      changeTime(-1);

      if (timeLeft === 0) {
        gameOver();
      }
    }, 1000);
  }

  if (tagsList.includes(tagName)) {
    tagFound(tagName);
  }

  tagForm.reset();
  event.preventDefault();
});

tryAgainButton.addEventListener("click", function () {
  gameOverMessage.classList.add("hidden");
  tagsMissedSection.classList.add("hidden");
  tagForm.classList.remove("hidden");

  tagFounds = [];
  timeLeft = tagsList.length;
  tagsFoundCounter.textContent = 0;
  tagsFoundList.innerHTML = "";
  tagsMissedList.innerHTML = "";
});

revealMissedTagsButton.addEventListener("click", function () {
  tagsList.forEach(function (tagName) {
    if (tagFounds.includes(tagName)) {
      return;
    }

    addTagToList(tagsMissedList, tagName);
  });

  tagsMissedSection.classList.remove("hidden");
});
