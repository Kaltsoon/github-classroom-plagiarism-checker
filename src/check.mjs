import { usePowerShell, $ } from "zx";

usePowerShell();

const ASSIGNMENT_ID = "870565";

await $`gh extension install github/gh-classroom`;
await $`gh classroom clone student-repos -a ${ASSIGNMENT_ID} --directory data/assignment-repos`;
await $`gh classroom clone starter-repo -a ${ASSIGNMENT_ID} --directory data/starter-repos`;