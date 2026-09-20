let callback = arguments[arguments.length - 1];
let button = document.getElementById("imdb_id_picker");

let meta_og_type = document.querySelector("meta[property='og:type']");
if (meta_og_type) {
  meta_og_type = meta_og_type.getAttribute("content");
}

console.log("------------------");
console.log(meta_og_type);
console.log("------------------");

let buttonAction = (() => {
  switch (meta_og_type) {
    case "video.movie":
      return { text: "USE THIS MOVIE", color: "#53ff53", pickable: true };
    case "video.tv_show":
      return {
        text: "BROWSE TO AN EPISODE",
        color: "#ffd453",
        pickable: false,
      };
    case "video.episode":
      return { text: "USE THIS EPISODE", color: "#53ff53", pickable: true };
    case "website":
      return { text: "CHOOSE A TITLE", color: "#ff5353", pickable: false };
    default:
      return null;
  }
})();

if (!buttonAction) {
  callback(false);
  throw new Error("no button action");
}

if (button) {
  button.onclick = () => {
    callback(true);
  };
}

if (!button) {
  let button = document.createElement("button");
  button.id = "imdb_id_picker";
  button.innerText = buttonAction.text;
  button.style.background = buttonAction.color;
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
  button.style.height = "3em";
  button.style.boxShadow = "0 0 1em #00000088";
  document.body.style.paddingTop = "3em";

  if (buttonAction.pickable) {
    button.onclick = () => {
      callback(true);
    };
  } else {
    button.style.pointerEvents = "none";
  }

  document.body.insertBefore(button, document.body.firstChild);
}
