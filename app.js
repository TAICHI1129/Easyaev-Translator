let dictionary = {};

loadDictionary();

async function loadDictionary() {

  try {

    const response =
      await fetch(
        "Easyaev.zpdc"
      );

    const data =
      await response.json();

    console.log(
      "辞書データ:",
      data
    );

    buildDictionary(data);

    console.log(
      "完成辞書:",
      dictionary
    );

  } catch (error) {

    console.error(
      "辞書読み込み失敗:",
      error
    );
  }
}

function buildDictionary(data) {

  if (!data.words) {

    console.error(
      "words が存在しません"
    );

    return;
  }

  for (
    const word
    of data.words
  ) {

    const source =
      word.spelling;

    let translation =
      null;

    if (
      word.sections &&
      word.sections.length > 0
    ) {

      const section =
        word.sections[0];

      if (
        section.equivalents &&
        section.equivalents.length > 0
      ) {

        const equivalent =
          section.equivalents[0];

        /*
          構造パターン対応
        */

        if (
          equivalent.name
        ) {

          translation =
            equivalent.name;

        } else if (
          equivalent.names &&
          equivalent.names.length > 0
        ) {

          translation =
            equivalent.names[0];

        } else if (
          equivalent.value
        ) {

          translation =
            equivalent.value;
        }

        console.log(
          "equivalent:",
          equivalent
        );
      }
    }

    if (
      source &&
      translation
    ) {

      dictionary[
        source.toLowerCase()
      ] = translation;

      console.log(
        "追加:",
        source,
        "→",
        translation
      );
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

  console.log(
    "tokens:",
    tokens
  );

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
