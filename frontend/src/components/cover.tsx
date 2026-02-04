import * as React from "react";
import { Button } from "@/components/ui/button";

export const Cover = ({ onStart = () => {}, title = "עבודה והתנדבות" }) => {
  return (
    <div
      className={
        "fixed left-0 top-0 z-10 h-full w-full bg-primary bg-slideintro bg-no-repeat bg-center bg-origin-border bg-cover flex align-center justify-center"
      }
    >
      <div
        className={
          "absolute bottom-[10%] w-auto bg-white flex flex-col gap-5 justify-center mx-auto p-4 pt-7 px-12 border-4 border-bluedark font-bold pb-7"
        }
      >
        <p className="text-center text-2xl ">{title}</p>
        <div className="flex relative">
          <Button
            type="submit"
            className="mx-auto w-full bg-primary"
            onClick={onStart}
          >
            {"התחל"}
          </Button>
        </div>
      </div>
    </div>
  );
};
