import {
  BackpackIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import { Button } from "../ui/Button";

const CHINESE_COMMA = "，";

export default function HomeMenu() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Button className="cursor-pointer">🗃️ zettelkasten</Button>
      <Button className="cursor-pointer">🌳 whoami</Button>
      {/* // https://i.pinimg.com/1200x/b7/0c/5f/b70c5f97d31e72afaed922985391d650.jpg */}
      <Button className="cursor-pointer mb-3">📟 projects</Button>
      <div className="flex -space-x-2">
        <Button variant="outline" size="icon" className="rounded-full">
          <GitHubLogoIcon />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <LinkedInLogoIcon />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <BackpackIcon />
        </Button>
      </div>
    </div>
  );
}
