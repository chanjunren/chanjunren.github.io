import BrowserOnly from "@docusaurus/BrowserOnly";
import VaultusaurusGraph from "@theme/VaultusaurusGraph";
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
          <VaultusaurusGraph
            expandable={false}
            enableGlobalGraph={false}
            customGraph={{
              links: [
                {
                  source: "home",
                  target: "whoami",
                },
                {
                  source: "home",
                  target: "zettelkasten",
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
                  id: "whoami",
                  label: "whoami",
                  path: "/whoami",
                  type: "DOCUMENT",
                },
                {
                  id: "zettelkasten",
                  label: "zettelkasten",
                  path: "/docs/zettelkasten",
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
