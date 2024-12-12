/**
 * Programmer: @NabiKAZ (https://twitter.com/NabiKAZ)
 * Channel: https://t.me/BotSorati
 * More: https://t.me/BotSorati/587
**/

import morse from 'morse';
import chalk from 'chalk';
import { wordlists } from 'bip39';

const bip39Words = wordlists.english.map(word => word.toLowerCase());

const morseCodes = [
  "- …. .-. .. …- .",
  "…- — -.– .- –. .",
  ".– .- -.–",
  "-.-. .-.. .. -.-. -.-",
  "-.. . -. .. .- .-..",
  ". -. . .-. –. -.–",
  ".-. . -.-. .. . .–. .",
  "-.-. — … -",
  "-… .-. ..- … ….",
  ".- -. -..- .. . - -.–",
  "-.. . .–. .- .-. -",
  "-.-. ..- … …. .. — -.",
  "… .. –. …. -",
  "– .- -.-. -.-. ..- – ..- –",
  "… …. .. . .-.. -..",
  "..-. — .-. - ..- -. .",
  ".-.. .- -… — .-.",
  "- — -… .- -.-. -.- —",
  "— .– -. . .-.",
  "… - .. -.-. -.-",
  ".–. .-. — .— . -.-. -",
  "… -.-. .-. . . -.",
  "-. . .. - …. . .-.",
  ".–. .-. — … .–. . .-.",
];

const translateMorse = (code) => {
  return code.split(" ").map((char) => {
    if (char.match(/^[.-]+$/)) {
      return morse.decode(char);
    } else {
      return "#";
    }
  }).join("").toLowerCase();
};

const convertSpecialChars = (code) => {
  return code
    .replace(/–/g, "--")
    .replace(/—/g, "---")
    .replace(/…/g, "...");
};

const table = morseCodes.map((code, index) => {
  const word = translateMorse(code);
  const modifiedCode = convertSpecialChars(code);
  const modifiedWord = translateMorse(modifiedCode);
  return {
    index: index + 1,
    originalCode: code,
    originalWord: word,
    modifiedCode: modifiedCode,
    modifiedWord: modifiedWord,
  };
});

console.log(` # | ${'Original'.padEnd(30)} | ${'Word'.padEnd(12)} | ${'Modified'.padEnd(30)} | ${'Word'.padEnd(12)}`);
console.log("-".repeat(14+30+12+30+12));


const finalWords = [];

table.forEach(({ index, originalCode, originalWord, modifiedCode, modifiedWord }) => {
  const indexStr = index.toString().padStart(2, '0');
  const originalColor = bip39Words.includes(originalWord) ? chalk.green : chalk.red;
  const modifiedColor = bip39Words.includes(modifiedWord) ? chalk.green : chalk.red;

  console.log(
    `${indexStr} | ${originalCode.padEnd(30)} | ${originalColor(originalWord.padEnd(12))} | ${modifiedCode.padEnd(30)} | ${modifiedColor(modifiedWord.padEnd(12))}`
  );

  finalWords.push(chalk[bip39Words.includes(modifiedWord) ? 'green' : 'red'](modifiedWord));
});

console.log("\nFinal Words:");
console.log(finalWords.join(' '));
