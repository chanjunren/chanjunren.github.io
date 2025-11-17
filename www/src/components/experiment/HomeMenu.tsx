import { Card, CardContent } from "@site/src/components/ui/Card";
import IdealImage from "@theme/IdealImage";
import TypewriterText from "../common/TypewriterText";
import { useMateria } from "../home/hooks/useMateria";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
const CHINESE_COMMA = "，";

export default function HomeMenu() {
  return (
    <Card className="grow">
      <CardContent className="flex flex-col items-start gap-2">
        <Button>about</Button>
        <Button className="mb-10">zettelkasten</Button>
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://github.com/maxleiter.png"
              alt="@maxleiter"
            />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://github.com/evilrabbit.png"
              alt="@evilrabbit"
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
}
