const REMOVE = [
  "[data-testid='find-results-section-name']",
  "[data-testid='find-results-section-interest']",
  "[data-testid='episodes-widget']",
];
document.querySelectorAll(REMOVE.join(",")).forEach((el) => el.remove());

//
//
//

let callback = arguments[arguments.length - 1];
let button = document.getElementById("imdb_id_picker");

let meta_og_type = document.querySelector("meta[property='og:type']");
if (meta_og_type) {
  meta_og_type = meta_og_type.getAttribute("content");
}

function submit() {
  function get(testid) {
    return document.querySelector(`[data-testid='${testid}']`).innerText;
  }

  let val = (() => {
    if (meta_og_type == "video.movie") {
      return {};
    } else if (meta_og_type == "video.episode") {
      let seriesName = get("hero-title-block__series-link");
      let episodeName = get("hero__primary-text");
      let seasonEpisode = get("hero-subnav-bar-season-episode-numbers-section")
        .replace("S", "")
        .replace("E", "")
        .split(".");

      return {
        series: {
          series_name: seriesName,
          episode_name: episodeName,
          season: parseInt(seasonEpisode[0]),
          episode: parseInt(seasonEpisode[1]),
        },
      };
    } else {
      return null;
    }
  })();
  callback(val);
}

function viewEpisodes() {
  window.location.href =
    window.location.origin + window.location.pathname + "episodes";
}

const COLOR_NO_ACTION = "#999999";
const COLOR_REDIRECT = "#ffd453";
const COLOR_SUBMIT = "#53ff53";

let buttonAction = (() => {
  switch (meta_og_type) {
    case "video.movie":
      return { text: "USE THIS MOVIE", color: COLOR_SUBMIT, action: submit };
    case "video.tv_show":
      if (window.location.pathname.endsWith("episodes/")) {
        return {
          text: "CHOOSE AN EPISODE",
          color: COLOR_NO_ACTION,
          action: null,
        };
      }
      return {
        text: "GO TO EPISODES",
        color: COLOR_REDIRECT,
        action: viewEpisodes,
      };
    case "video.episode":
      return { text: "USE THIS EPISODE", color: COLOR_SUBMIT, action: submit };
    case "website":
      return { text: "CHOOSE A TITLE", color: COLOR_NO_ACTION, action: null };
    default:
      return null;
  }
})();

if (!buttonAction) {
  callback(null);
  throw new Error("no button action");
}

if (button) {
  button.onclick = buttonAction.action;
}

if (!button) {
  let button = document.createElement("button");
  button.id = "imdb_id_picker";
  button.innerText = buttonAction.text;
  button.style.backgroundColor = buttonAction.color;
  button.style.padding = "1em";
  button.style.fontFamily = "sans-serif";
  button.style.fontWeight = "bold";
  button.style.cursor = "pointer";
  button.style.border = "0";
  button.style.borderRadius = "0";
  button.style.position = "fixed";
  button.style.top = "0";
  button.style.zIndex = "9999";
  button.style.width = "100%";
  button.style.boxShadow = "0 0 1em #00000088";
  button.style.height = "4em";
  document.body.style.paddingTop = "4em";

  if (buttonAction.action) {
    button.onclick = buttonAction.action;
    button.style.pointerEvents = "initial";
  } else {
    button.style.pointerEvents = "none";
  }

  document.body.insertBefore(button, document.body.firstChild);
}
