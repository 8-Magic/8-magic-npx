#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import boxen, { Options as boxenOptions } from "boxen";
import { colorize } from "json-colorizer";
import type { AnswerObject } from "./types.js";

const details: { name: string; description: string; version: string } = {
  name: "8-Magic",
  description: "A clairvoyant Node package for your CLI",
  version: "1.0.2",
};

const program = new Command();
program
  .name(details.name)
  .description(details.description)
  .version(details.version)
  .option("--json", "Receive raw JSON output from the API");

program.parse(process.argv);

const options = program.opts();

const boxenSettings: boxenOptions = {
  padding: 1,
  margin: 1,
  borderColor: "green",
  borderStyle: "round",
  textAlignment: "left",
};

const emoji = (type: string): string => {
  switch (type) {
    case "positive":
      return "👍";
    case "neutral":
      return "🤷";
    case "negative":
      return "👎";
    default:
      return "";
  }
};

function printAnswer({ answer, type }: AnswerObject): string {
  switch (type) {
    case "positive":
      return chalk.greenBright(answer);
    case "neutral":
      return chalk.yellowBright(answer);
    case "negative":
      return chalk.redBright(answer);
    default:
      return chalk.white(answer);
  }
}

function printType(type: string): string {
  switch (type) {
    case "positive":
      return "YES";
    case "neutral":
      return "IDK";
    case "negative":
      return "NO";
    default:
      return "";
  }
}

(async () => {
  const spinner = ora(`Hold up, consulting the universe ⊹₊⟡⋆`).start();
  spinner.color = "green";
  spinner.spinner = "star";
  spinner.indent = 1;

  try {
    const res = await fetch(`https://api.8.alialmasi.ir/v2/answers`);

    if (!res.ok) {
      spinner.fail(`Universe's message wasn't OK: ${res.statusText}`);
      process.exit(1);
    }

    const data = await res.json();
    const answerObject: AnswerObject = data?.data.answer;
    spinner.succeed("The universe delivers. Check it out ── .✦");
    let boxContent: string = "";
    if (options.json) boxContent = colorize(data, { indent: 1 }).toString();
    else
      boxContent = boxen(
        [
          `${emoji(answerObject.type)} ${printAnswer(answerObject)}`,
          "",
          `Short: ${chalk.bold(printType(answerObject.type))}`,
        ].join("\n"),
        boxenSettings
      );

    if (boxContent && boxContent != "") console.log(boxContent);
    else throw new Error("Error while trying to print the output.");
  } catch (err: any) {
    spinner.fail("Error while contacting universe's servers:");
    console.error(chalk.redBright(`💥 ${err.message}`));
    process.exit(1);
  }
})();
