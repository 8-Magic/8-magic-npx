#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import boxen from "boxen";

const program = new Command();
program
	.name("8-magic")
	.description("A clairvoyant piece of software, in your CLI")
	.version("1.0.0");
// .option(
// 	"-t, --type < all | positive | neutral | negative ",
// 	"Type of answer you want",
// 	"all"
// );

program.parse(process.argv);

// const options = program.opts();

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

(async () => {
	const spinner = ora(`Hold up, consulting the universe ⊹₊⟡⋆`).start();
	spinner.color = "green";
	spinner.spinner = "star";

	try {
		const res = await fetch(`https://api.8.alialmasi.ir/v2/answers`);

		if (!res.ok) {
			spinner.fail(`Universe's message wasn't OK: ${res.statusText}`);
			process.exit(1);
		}

		const data = await res.json();
		spinner.succeed("The universe delivers. Check it out ── .✦");

		const boxContent = boxen(
			chalk.greenBright(
				`${emoji(data?.data.answer.type)} ${data?.data.answer.answer}`
			),
			{
				padding: 1,
				borderColor: "green",
				borderStyle: "singleDouble",
				textAlignment: "center"
			}
		);

		console.log(boxContent);
	} catch (err: any) {
		spinner.fail("Universe's servers were down:");
		console.error(chalk.red(`💥 ${err.message}`));
		process.exit(1);
	}
})();
