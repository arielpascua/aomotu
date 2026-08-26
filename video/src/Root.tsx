import React from "react";
import { Composition } from "remotion";
import { Showreel, TOTAL_FRAMES, FPS } from "./Showreel";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Showreel"
      component={Showreel}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
