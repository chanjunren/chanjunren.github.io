import { Card, CardContent, CardTitle } from "@site/src/components/ui/Card";
import IdealImage from "@theme/IdealImage";
import TypewriterText from "../common/TypewriterText";
import { useMateria } from "../home/hooks/useMateria";
import CustomTag from "../ui/CustomTag";
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
    <Card className="col-span-2 gap-4">
      <CustomTag className="font-normal ml-5" color="rose">
        QOTD
      </CustomTag>
      <CardContent className="flex flex-col cursor-help">
        <span className="mb-2">{featuredQuote.quote}</span>
        <span className="border-l-2 border-l-accent pl-2">
          {featuredQuote.source}
        </span>
      </CardContent>
    </Card>
  );
}
