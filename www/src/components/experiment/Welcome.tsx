import { Card, CardDescription, CardTitle } from "@site/src/components/ui/Card";
import CustomTag from "@site/src/components/ui/CustomTag";
import { useMateria } from "../home/hooks/useMateria";

export default function Welcome() {
  return (
    <Card className="col-span-2 p-10">
      <CustomTag color="rose">HELLO</CustomTag>
      <CardDescription>
        A space for Jun Ren to do whatever he wants
      </CardDescription>
    </Card>
  );
}
