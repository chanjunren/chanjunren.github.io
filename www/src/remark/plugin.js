import { visit } from "unist-util-visit";

export default function convertToDocusaurusMdx() {
  return async (tree, file) => {
    visit(tree, "ParagraphNode", (node) => {
      console.log(node);
      const children = node.children;

      children.forEach((child, index) => {
        console.log("CHILD", child);
      });
    });
  };
}
