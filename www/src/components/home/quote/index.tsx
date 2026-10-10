import QuoteItem from "@site/src/components/home/quote/quote-item";
import QuoteStatistics from "@site/src/components/home/quote/quote-statistics";
import QuoteTable from "@site/src/components/home/quote/quote-table";
import { InkColumn, inkDuration } from "@site/src/components/home/quote/ink-column";
import TypewriterText from "@site/src/components/ui/typewriter-text";
import {useMateria} from "@site/src/hooks/useMateria";
import { type CSSProperties } from "react";
import styles from "./index.module.css";

const CHINESE_COMMA = "，";
const ICON_STAGGER_MS = 120;

// Characters stripped from the source before it is shown.
const SOURCE_FILTERED_CHARS = ["《", "》"];

function stripFiltered(text: string) {
  return [...text]
    .filter((char) => !SOURCE_FILTERED_CHARS.includes(char))
    .join("");
}

export default function Quote() {
  const { featuredQuote, message, quotes } = useMateria();

  if (message) {
    return <TypewriterText active text={message} />;
  }

  if (!featuredQuote || !quotes) {
    return null;
  }

  const quoteParts = featuredQuote.quote.split(CHINESE_COMMA);
  // The source inks in after the last quote character, then the icons rise.
  const quoteLength = quoteParts.reduce((sum, part) => sum + [...part.trim()].length, 0);
  const source = stripFiltered(featuredQuote.source);
  const iconDelay = inkDuration(quoteLength + [...source].length);
  const rise = (index: number) =>
    ({ "--delay": `${iconDelay + index * ICON_STAGGER_MS}ms` }) as CSSProperties;

  return (
    <div className="flex gap-5">
      <div className="flex flex-col justify-between gap-10">
        <div className={"flex flex-col gap-2"}>
          <span className={styles.rise} style={rise(0)}>
            <QuoteTable quotes={quotes} />
          </span>
          <span className={styles.rise} style={rise(1)}>
            <QuoteStatistics />
          </span>
        </div>
        <InkColumn
          text={source}
          startIndex={quoteLength}
          className="text-muted-foreground"
        />
      </div>
      <QuoteItem quoteInfo={featuredQuote} display="main" />
    </div>
  );
}
