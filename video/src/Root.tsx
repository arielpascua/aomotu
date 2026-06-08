import React from "react";
import { Composition } from "remotion";
import { Showreel } from "./Showreel";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Showreel"
      component={Showreel}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
