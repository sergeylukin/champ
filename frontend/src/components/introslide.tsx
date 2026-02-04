import * as React from "react";
import { Button } from "@/components/ui/button";

export const IntroSlide = () => {
  const [visible, setVisible] = React.useState(true);
  return (
    visible && (
      <div className="Intro absolute h-full w-full z-10">
        <div className="Intro-title pb-4">
          <Button
            type="submit"
            className="mx-auto w-[200px] mt-5"
            onClick={() => setVisible(false)}
          >
            {"התחל"}
          </Button>
        </div>
      </div>
    )
  );
};
