import { usePowerShell, $, minimist, spinner, glob } from "zx";
import kebabCase from "lodash.kebabcase";
import stripColor from "strip-color";
import { rimraf } from "rimraf";

usePowerShell();

const argv = minimist(process.argv.slice(2), {});
const assignmentId = argv.assignment;
const language = argv.language ?? "java";

await $`gh extension install github/gh-classroom`;

let jplagPath = await getJPlagPath();

if (!jplagPath) {
  await spinner(
    "JPlag release not downloaded, downloading...",
    () => $`gh release download "v6.2.0" -R "jplag/JPlag" --dir data/jplag`
  );
  
  jplagPath = await getJPlagPath();
}

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

await spinner("Downloading assignment repositories...", async () => {
  await rimraf([
    `data/assignment-repos/${assignmentName}-submissions`,
    `data/starter-repos/${assignmentName}`,
  ]);

  await Promise.all([
    $`gh classroom clone student-repos -a ${assignmentId} --directory data/assignment-repos`,
    $`gh classroom clone starter-repo -a ${assignmentId} --directory data/starter-repos`,
  ]);
});

await spinner(
  "Generating plagiation report...",
  () =>
    $`java -jar ${jplagPath} data/assignment-repos/${assignmentName}-submissions -bc data/starter-repos/${assignmentName} --language ${language} --overwrite`
);

async function getJPlagPath() {
  const jars = await glob("data/jplag/*.jar");

  return jars[0];
}
