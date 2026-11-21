import { MotionConfig } from "motion/react";
import { SmoothScrollProvider } from "./components/core/SmoothScrollProvider";
import { PaperTexturesLayer } from "./components/core/PaperTexturesLayer";
import { Topbar } from "./components/core/Topbar";
import { HeroPostcard } from "./components/sections/HeroPostcard";
import { LuGuideSection } from "./components/sections/LuGuideSection";
import { ControversyArchive } from "./components/sections/ControversyArchive";
import { Route95Timeline } from "./components/sections/Route95Timeline";
import { NetworkPulseSection } from "./components/sections/NetworkPulseSection";
import { RealismSection } from "./components/sections/RealismSection";
import { VideoProposalSection } from "./components/sections/VideoProposalSection";
import { SourcesSection } from "./components/sections/SourcesSection";
import { PostcardFooter } from "./components/sections/PostcardFooter";
import { CaseDossier } from "./components/overlays/CaseDossier";
import { ScriptDialog } from "./components/overlays/ScriptDialog";
import { BayshoreMobileDock } from "./components/overlays/BayshoreMobileDock";
import { LeonidaRadioPill } from "./components/audio/LeonidaRadioPill";
import { AmbientSpectrumCanvas } from "./components/audio/AmbientSpectrumCanvas";

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <a className="skip-link" href="#archivo">
          Saltar al archivo
        </a>

        <PaperTexturesLayer />
        <AmbientSpectrumCanvas />

        <div className="relative z-10">
          <Topbar />

          <main>
            <HeroPostcard />
            <LuGuideSection />
            <ControversyArchive />
            <Route95Timeline />
            <NetworkPulseSection />
            <RealismSection />
            <VideoProposalSection />
            <SourcesSection />
          </main>

          <PostcardFooter />
        </div>

        {/* Overlays, Thumb-Zone Dock & Bass-Reactive Leonida FM Radio Pill */}
        <BayshoreMobileDock />
        <LeonidaRadioPill />
        <CaseDossier />
        <ScriptDialog />
      </SmoothScrollProvider>
    </MotionConfig>
  );
}

export default App;
