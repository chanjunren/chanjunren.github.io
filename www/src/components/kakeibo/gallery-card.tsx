import useBaseUrl from "@docusaurus/useBaseUrl";
import IdealImage from "@theme/IdealImage";

export default function KakeiboGalleryCard({
  onClick,
}: {
  onClick: () => void;
}) {
  const image = "images/kakeibo-dashboard.png";

  return (
    <div
      className="group relative flex aspect-video flex-grow cursor-pointer items-end justify-center overflow-hidden rounded-lg bg-(--gray-transparent-bg) pt-5 pb-0"
      onClick={onClick}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[22%] top-[8%] z-0 scale-0 text-4xl opacity-0 transition-all delay-0 duration-300 ease-out group-hover:-translate-y-2 group-hover:rotate-[-12deg] group-hover:scale-100 group-hover:opacity-100"
      >
        🍍
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[5%] z-0 -translate-x-1/2 scale-0 text-4xl opacity-0 transition-all delay-100 duration-300 ease-out group-hover:-translate-y-2 group-hover:rotate-[8deg] group-hover:scale-100 group-hover:opacity-100"
      >
        💸
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[22%] top-[8%] z-0 scale-0 text-4xl opacity-0 transition-all delay-200 duration-300 ease-out group-hover:-translate-y-2 group-hover:rotate-[12deg] group-hover:scale-100 group-hover:opacity-100"
      >
        😭
      </span>
      <div className="relative z-10 w-[97%] translate-y-[10%] transition-transform duration-300 ease-out group-hover:translate-y-[3%]">
        <span className="pointer-events-none absolute -top-6 right-0 z-20 whitespace-nowrap text-right font-mono text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100">
          (mock numbers btw)
        </span>
        <IdealImage
          card={useBaseUrl(image)}
          img={image}
          className="w-full rounded-md object-contain shadow-sm"
        />
      </div>
    </div>
  );
}
