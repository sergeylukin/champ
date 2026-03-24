import * as React from "react";
import { Button } from "@/components/ui/button";

export const Cover = ({ onStart = () => {}, title = "עבודה והתנדבות", subtitle = "" }) => {
  return (
    <div
      className={
        "fixed left-0 top-0 z-10 h-full w-full bg-white flex align-center justify-center"
      }
    >
      <div
        className={
          "absolute top-[10%] w-auto bg-white flex flex-col gap-5 justify-center mx-auto p-4 pt-7 px-12  font-bold pb-7"
        }
      >
        <img src="/hero-title.jpg" width="auto" height="5rem" className="mx-auto pb-3 left-0 right-0" ></img>
        <div className="bg-topicIntro bg-no-repeat bg-bottom-left bg-origin-border bg-accent2 h-[50vh] w-[70vw] flex flex-col justify-center">
          <p className="text-center text-3xl ">{title}</p>
          <p className="text-center text-xl">{subtitle}</p>
          <div className="flex relative mt-8">
            <Button
              type="submit"
              className="mx-auto"
              onClick={onStart}
            >
              {"התחל"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
