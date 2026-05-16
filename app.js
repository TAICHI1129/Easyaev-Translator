let dictionary = {};

loadDictionary();

async function loadDictionary() {

  const response =
    await fetch(
      "dictionary.json"
    );

  const data =
    await response.json();

  buildDictionary(data);
}

function buildDictionary(data) {

  for (
    const word
    of data.words
  ) {

    const source =
      word.spelling;

    const translation =
      word.sections?.[0]
      ?.equivalents?.[0]
      ?.names?.[0];

    if (
      source &&
      translation
    ) {

      dictionary[
        source.toLowerCase()
      ] = translation;
    }
  }
}

const button =
  document.getElementById(
    "translateButton"
  );

button.addEventListener(
  "click",
  translate
);

function translate() {

  const input =
    document.getElementById(
      "input"
    ).value;

  const result =
    document.getElementById(
      "result"
    );

  const tokens =
    tokenize(input);

  const translated = [];

  for (const token of tokens) {

    if (
      dictionary[token]
    ) {

      translated.push(
        dictionary[token]
      );

    } else {

      translated.push(
        "[" + token + "]"
      );
    }
  }

  result.innerText =
    translated.join(" ");
}

function tokenize(text) {

  return text

    .toLowerCase()

    .replace(
      /[^\p{L}\p{N}\s']/gu,
      ""
    )

    .split(/\s+/)

    .filter(Boolean);
}
