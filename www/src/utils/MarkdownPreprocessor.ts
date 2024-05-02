// MarkdownPreprocessor.ts

const OBSIDIAN_IMG_REGEX = /!\[\[([^\]]+)\]\]/g;

// Necessary because Obsidian and Docusaurus has different syntax for images 
export function obsidianToDocusaurusPreprocessor ({filePath, fileContent}: {filePath: string, fileContent: string}) {
  const newContent = fileContent.replace(OBSIDIAN_IMG_REGEX, (match, imageName) => {
    return `![${imageName}](/${imageName})`;
  });

  return newContent;
}
