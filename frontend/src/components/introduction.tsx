import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  updateSlideImportance,
  setIsImportantBySlideId,
} from "@/services/UsersService";

const default_submissions = [
  {
    slideId: "ivgeo7nzk0ktdgi",
    answer: 3,
    topicName: "טיפול עצמי",
    desired_answer: 5,
    title: "שמירה על היגיינת הגוף",
    subtitle:
      "שמירה על ניקיון אישי, ניקיון הסביבה סירוק, תספורת, שימוש בתכשירים מקלחת (חפיפה, סיבון גוף, ניגוב)",
    is_important: false,
  },
  {
    slideId: "qqq",
    answer: 3,
    topicName: "טיפול עצמי",
    desired_answer: 5,
    title: "טיפוח וניקיון השיער",
    subtitle: "סירוק, תספורת, שימוש בתכשירים",
    is_important: false,
  },
  {
    slideId: "abc",
    answer: 3,
    topicName: "טיפול עצמי",
    desired_answer: 5,
    title: "היגיינה בשירותים",
    subtitle: "שמירה על ניקיון אישי, ניקיון הסביבה",
    is_important: false,
  },
];

export const Introduction = ({ next }) => {
  return (
    <div
      className={
        "fixed left-0 top-0 z-10 h-full w-full bg-slideintro bg-no-repeat bg-center bg-origin-border bg-cover flex align-center justify-center"
      }
    >
      <div
        className={
          "absolute top-[10%] w-[80%] bg-white flex justify-center mx-auto p-0 border-4 border-secondary text-5xl font-bold pb-7"
        }
        style={{ maxHeight: "80vh", overflowY: "scroll" }}
      >
        <Card
          className="flex border-0 w-full items-center justify-center mt-0 pt-0"
          id={"summary_table"}
        >
          <CardHeader className="w-full">
            <CardTitle className="text-center text-2xl"></CardTitle>
            <CardDescription className="flex-row justify-center align-center">
              <img
                src="/explanation.png"
                className="max-h-[calc(100vh-350px)] object-contain"
                width={"100%"}
              />
              <div className="flex relative mt-4">
                <Button
                  type="submit"
                  className="mx-auto w-[200px]"
                  onClick={() => next(false)}
                >
                  {"המשך"}
                </Button>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
