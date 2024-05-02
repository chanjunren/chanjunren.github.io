// MarkdownPreprocessor.ts

const OBSIDIAN_IMG_REGEX = /!\[\[([^\]]+)\]\]/g;
const DATE_TAG_REGEX = /(🗓️\s*\d{8}\s*\d{4}\s*\n)/g;

function obsidianToDocusaurusPreprocessor({
  filePath,
  fileContent,
}: {
  filePath: string;
  fileContent: string;
}) {
  return (
    fileContent
      // Necessary because Obsidian and Docusaurus has different syntax for images
      .replace(
        OBSIDIAN_IMG_REGEX,
        (match, imageName) => `![${imageName}](/${imageName})`
      )
      // Doesn't work as expected
      .replace(DATE_TAG_REGEX, "$1<br/>")
  );
}

const STIRNG_TEST = "🗓️ 20240404 0940\n📎 #backend #dts";

console.log(
  obsidianToDocusaurusPreprocessor({
    filePath: "PATH",
    fileContent: STIRNG_TEST,
  })
);
