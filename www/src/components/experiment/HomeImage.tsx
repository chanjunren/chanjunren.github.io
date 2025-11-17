import { Card, CardContent } from "@site/src/components/ui/Card";
import IdealImage from "@theme/IdealImage";
import TypewriterText from "../common/TypewriterText";
import { useMateria } from "../home/hooks/useMateria";
import { Button } from "../ui/Button";
const CHINESE_COMMA = "，";

export default function HomeImage() {
  const { featuredQuote, message } = useMateria();

  if (message) {
    return <TypewriterText active text={message} />;
  }

  if (!featuredQuote) {
    return null;
  }

  return (
    <Card className="h-fit w-fit">
      <CardContent>
        <IdealImage
          className="rounded-md shadow-lg object-contain w-56"
          img="https://i.pinimg.com/1200x/74/4e/6c/744e6c227ade7f3104ad1c28cd1bf539.jpg"
        />
      </CardContent>
    </Card>
  );
}
