import * as React from "react";
import { Button } from "@/components/ui/button";

export const IntroSlide = () => {
  const [visible, setVisible] = React.useState(true);
  return (
    visible && (
      <div className="Intro absolute h-full w-full z-10">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <img src="/intro-title.jpg"
          width="auto" height="auto"
          className="mx-auto left-0 right-0 w-[40vw] h-auto" />
          <Button
            type="submit"
            className="mx-auto w-[30vw] py-[30px] mt-5 !bg-[#8591a1] !text-[#d1d8e0]"
            onClick={() => setVisible(false)}
          >
            {"התחל"}
          </Button>
        </div>
      </div>
    )
  );
};
