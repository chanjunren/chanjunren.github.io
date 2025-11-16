import { ChevronRightIcon } from "@radix-ui/react-icons";
import TypewriterText from "../common/TypewriterText";
import { Item, ItemActions, ItemContent, ItemTitle } from "../ui/Item";
import { useMateria } from "./hooks/useMateria";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@site/src/components/ui/HoverCard";
import { Separator } from "@site/src/components/ui/Separator";
import CustomTag from "@site/src/components/ui/CustomTag";

const CHINESE_COMMA = "，";

export default function Quote() {
  const { featuredQuote, message } = useMateria();

  if (message) {
    return <TypewriterText active text={message} />;
  }

  if (!featuredQuote) {
    return null;
  }

  return (
    <div className="flex-grow self-center">
      <CustomTag color="rose" className="mb-5">
        QOTD
      </CustomTag>
      <HoverCard>
        <HoverCardTrigger asChild className="cursor-help">
          <div className="flex flex-col">
            <span className="text-2xl mb-3 font-['Noto Serif SC']">
              {featuredQuote.quote}
            </span>
            <span className="">- {featuredQuote.source}</span>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-96">
          <div className="flex flex-col justify-between gap-4">
            <span className="text-[var(--reduced-emphasis-color)]">
              {featuredQuote.pinyin}
            </span>
            <span>{featuredQuote.meaning}</span>
            <Separator className="my-3" />
            <span>{featuredQuote.background}</span>
          </div>
        </HoverCardContent>
      </HoverCard>
      {/* <Item variant="outline" size="sm">
        <ItemContent>
          <ItemTitle className="text-xl font-normal">
            [{featuredQuote.quote}]
          </ItemTitle>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="size-4" />
        </ItemActions>
      </Item> */}
    </div>
  );
}
