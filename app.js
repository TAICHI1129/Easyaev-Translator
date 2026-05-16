let dictionary = {};

let exceptions = {};

const button =
  document.getElementById(
    "translateButton"
  );

const statusText =
  document.getElementById(
    "status"
  );

initialize();

async function initialize() {

  button.disabled = true;

  try {

    await loadDictionary();

    await loadExceptions();

    statusText.innerText =
      "辞書読み込み完了";

    button.disabled =
      false;

  } catch (error) {

    console.error(error);

    statusText.innerText =
      "読み込み失敗";
  }
}

/*
  辞書読み込み
*/

async function loadDictionary() {

  const response =
    await fetch(
      "Easyaev.zpdc"
    );

  if (!response.ok) {

    throw new Error(
      "辞書取得失敗"
    );
  }

  const data =
    await response.json();

  buildDictionary(data);

  console.log(
    "dictionary:",
    dictionary
  );
}

/*
  辞書構築
*/

function buildDictionary(data) {

  dictionary = {};

  if (!data.words) {
    return;
  }

  for (
    const word
    of data.words
  ) {

    /*
      エアーシャ語
    */

    const easya =
      word.spelling;

    /*
      英語
    */

    const english =
      word.sections?.[0]
      ?.equivalents?.[0]
      ?.terms?.[0];

    if (
      easya &&
      english
    ) {

      /*
        英語
        ↓
        エアーシャ語
      */

      dictionary[
        english.toLowerCase()
      ] = easya;

      console.log(
        english,
        "→",
        easya
      );
    }
  }
}

/*
  例外読み込み
*/

async function loadExceptions() {

  try {

    const response =
      await fetch(
        "Exceptions.txt"
      );

    if (!response.ok) {

      console.warn(
        "Exceptions.txt が存在しません"
      );

      return;
    }

    const text =
      await response.text();

    parseExceptions(text);

    console.log(
      "exceptions:",
      exceptions
    );

  } catch (error) {

    console.error(
      "例外読み込み失敗:",
      error
    );
  }
}

/*
  例外解析
*/

function parseExceptions(text) {

  exceptions = {};

  const lines =
    text.split("\n");

  for (const line of lines) {

    const trimmed =
      line.trim();

    /*
      空行
    */

    if (!trimmed) {
      continue;
    }

    /*
      コメント
    */

    if (
      trimmed.startsWith("#")
    ) {
      continue;
    }

    /*
      este|mio=am
    */

    const parts =
      trimmed.split("=");

    if (
      parts.length !== 2
    ) {
      continue;
    }

    const key =
      parts[0]
      .trim()
      .toLowerCase();

    const value =
      parts[1]
      .trim();

    exceptions[key] =
      value;
  }
}

/*
  ボタン
*/

button.addEventListener(
  "click",
  translate
);

/*
  翻訳
*/

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

  for (
    let i = 0;
    i < tokens.length;
    i++
  ) {

    const token =
      tokens[i];

    const previous =
      tokens[i - 1];

    /*
      例外キー
      este|mio
    */

    const exceptionKey =
      token +
      "|" +
      previous;

    /*
      例外優先
    */

    if (
      exceptions[
        exceptionKey
      ]
    ) {

      translated.push(
        exceptions[
          exceptionKey
        ]
      );

      continue;
    }

    /*
      通常辞書
    */

    if (
      dictionary[token]
    ) {

      translated.push(
        dictionary[token]
      );

    } else {

      /*
        未知語
      */

      translated.push(
        token
      );
    }
  }

  result.innerText =
    translated.join(" ");
}

/*
  トークン化
*/

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
