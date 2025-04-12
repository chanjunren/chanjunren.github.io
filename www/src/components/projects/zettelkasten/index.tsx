import { useHistory } from "@docusaurus/router";
import { GalleryProjectInfo } from "@site/src/types";
import SimpleCard from "../../common/SimpleCard";

const Zettelkasten: GalleryProjectInfo = {
  id: "zettelkasten",
  title: "Zettelkasten",
  subtitle: "My notes",
  containerCss: "md:col-span-3",
  card: ({ onClick }) => {
    const history = useHistory();
    return (
      <SimpleCard
        className="rounded-lg relative cursor-pointer h-full"
        onClick={() => history.push("/docs/zettelkasten")}
        // onClick={onClick}
      >
        <p className="text-3xl absolute top-1/2 left-1/2 m-0 transform -translate-x-1/2 -translate-y-1/2">
          🗃️
        </p>
      </SimpleCard>
    );
  },
  description: null,
};

export default Zettelkasten;
