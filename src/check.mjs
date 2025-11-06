import { usePowerShell, $, minimist, spinner } from "zx";
import kebabCase from "lodash.kebabcase";
import stripColor from "strip-color";

usePowerShell();

const argv = minimist(process.argv.slice(2), {});
const assignmentId = argv.assignment;
const language = argv.language ?? "java";

await $`gh extension install github/gh-classroom`;

const assignmentDescription =
  await $`gh classroom assignment -a ${assignmentId}`;

const assignmentName = kebabCase(
  assignmentDescription
    .text()
    .split("\n")
    .map((line) => stripColor(line.trim()))
    .find((line) => line.toString().includes("Title:"))
    .split(":")
    .at(1)
    .trim()
);

await spinner("Downloading assignment repositories...", () =>
  Promise.all([
    $`gh classroom clone student-repos -a ${assignmentId} --directory data/assignment-repos`,
    $`gh classroom clone starter-repo -a ${assignmentId} --directory data/starter-repos`,
  ])
);

await spinner(
  "Generating plagiation report...",
  () =>
    $`java -jar data/jplag/jplag.jar data/assignment-repos/${assignmentName}-submissions -bc data/starter-repos/${assignmentName} --language ${language}`
);
