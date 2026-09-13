import useBaseUrl from "@docusaurus/useBaseUrl";
import IdealImage from "@theme/IdealImage";

export function LoadingFallback() {
  return (
    <div className="flex min-h-[calc(100vh-57px)] w-full items-center justify-center">
      <div className="size-32">
        <IdealImage img={useBaseUrl("lbxx_booty_dance.gif")} />
      </div>
    </div>
  );
}
