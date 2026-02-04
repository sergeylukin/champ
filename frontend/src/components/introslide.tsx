import * as React from "react";
import { Button } from "@/components/ui/button";

export const IntroSlide = () => {
  const [visible, setVisible] = React.useState(true);
  return (
    visible && (
      <div className="Intro absolute h-full w-full z-10">
        <div className="Intro-title py-4">
          <p className="text-3xl text-secondary">
            Take PART: Participation Activities Rating for Teenagers
          </p>
          <p className="text-2xl mt-4 font-bold">
            אבחון דירוג פעילות והשתתפות לבני נוער
          </p>
          <p className="text-l mt-4 text-secondary"></p>
          <p className="text-l mt-1 text-secondary">
            מרב פורת, אפרת לנדס, ד״ר לירון לאמאש, ד״ר יעל פוגל
          </p>
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
