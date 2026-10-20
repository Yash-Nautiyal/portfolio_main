import { HomeWindow } from "@/components/hp/home-window";
import { BuildsCard, CtaCard, Honeycomb, IntroCard } from "@/components/hp/cards";
import { DeviceCard } from "@/components/hp/device-card";

export default function HomePage() {
  return (
    <HomeWindow
      left={
        <>
          <IntroCard />
          <DeviceCard />
          <CtaCard />
        </>
      }
      right={
        <>
          <Honeycomb />
          <BuildsCard />
        </>
      }
    />
  );
}
