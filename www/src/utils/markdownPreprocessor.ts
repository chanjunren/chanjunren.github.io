const OBSIDIAN_IMG_REGEX = /!\[\[([^\]]+)\]\]/g;
const DATE_TAG_REGEX = /(🗓️\s*\d{8}\s*\d{4}\s*\n)/g;

export function obsidianToDocusaurusPreprocessor({
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
      .replace(DATE_TAG_REGEX, "$1<br/>")
  );
}
