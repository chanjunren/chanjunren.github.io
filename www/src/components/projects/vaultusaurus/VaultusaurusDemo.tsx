import BrowserOnly from "@docusaurus/BrowserOnly";
import LocalGraph from "@theme/LocalGraph";
import { ReactElement } from "react";

export default function VaultusaurusDemo({ onClick }): ReactElement {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg relative overflow-hidden shadow-md"
    >
      <p className="absolute bg-black bg-opacity-75 px-2 py-1 rounded-md text-2xl top-4 right-4">
        ❣️
      </p>
      <BrowserOnly>
        {() => (
          <LocalGraph
            customGraph={{
              links: [
                {
                  source: "home",
                  target: "about",
                },
                {
                  source: "home",
                  target: "zettelkasten",
                },
                {
                  source: "home",
                  target: "gallery",
                },
              ],
              nodes: [
                {
                  id: "home",
                  label: "home",
                  path: "/",
                  type: "DOCUMENT",
                },
                {
                  id: "about",
                  label: "about",
                  path: "/about",
                  type: "DOCUMENT",
                },
                {
                  id: "zettelkasten",
                  label: "zettelkasten",
                  path: "/docs/zettelkasten",
                  type: "DOCUMENT",
                },
                {
                  id: "gallery",
                  label: "gallery",
                  path: "/gallery",
                  type: "DOCUMENT",
                },
              ],
            }}
          />
        )}
      </BrowserOnly>
    </div>
  );
}
