import { KakeiboMockup } from "@site/src/components/kakeibo/mockup";

export default function KakeiboMockupPage() {
  return (
    <KakeiboMockup className="min-h-screen">
      <div className="mx-auto mb-4 max-w-[1440px] px-3 pt-8 sm:px-6 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-normal text-muted-foreground">
          mockup / 家計簿
        </p>
      </div>
    </KakeiboMockup>
  );
}
