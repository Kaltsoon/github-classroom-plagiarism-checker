## GitHub Classroom Plagiarism Checker

Command-line tool for checking plagiarism in GitHub Classroom assignments using [JPlag](https://github.com/jplag/JPlag).

## Requirements and setup

The tool requires Java version >= 21 and Node.js version >= 22.

The setup is done as follows:

1. Install [GitHub CLI](https://cli.github.com/) and authenticate it using the `gh auth login` command.
2. Run `npm install` to install the dependencies.

## Usage

Run the `npx zx src/check.mjs --assignment "870565" --language "java"` to check plagiarism in an assignment. The `--assignment` flag determines the assignment id, and the `--language` flag determines the programming language used in the assignment (defaults to "java"). After installing the assignment repositories, a JPlag report should open in the browser.

## License

[MIT](./LICENSE)
