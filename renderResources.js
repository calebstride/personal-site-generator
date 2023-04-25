// Create reference instance
const fmh = require("./src/FileManagerHelper.js");
const rrr = require("./src/RenderResourcesRunner.js");
const { version } = require("./package.json");
const { ArgumentParser } = require("argparse");
const path = process.cwd();

// Following handles input params
const parser = new ArgumentParser({
    description: "Arguments for generating website content",
});

parser.add_argument("-v", "--version", { action: "version", version });
parser.add_argument("-o", "--output", {
    help: "The directory that the generated files should be placed. Is /public by default",
});
parser.add_argument("-c", "--content", {
    help: "The directory that contains the content of the website. Default is /resources/siteContent",
});

const arguments = parser.parse_args();

let outputDir = arguments.output === undefined ? path + "\\public" : arguments.output;
let contentDir = arguments.content === undefined ? path + "\\resources\\siteContent" : arguments.output;

// Now runs the generation of the website from resources
fmh.removeOutputDirectory(outputDir);
fmh.createOutputDirectory(outputDir);

rrr.renderFiles(path, outputDir, contentDir);

console.log("Finished compiling the files.");
