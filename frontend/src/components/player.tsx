import * as React from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import showdown from "showdown";
import { TopicOutro } from "@/components/topicoutro";
import { Cover } from "@/components/cover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Introduction } from "@/components/introduction";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addSubmission,
  getSummaryByTopicId,
  getSummary,
  logout,
  addSubmissionForSummary,
  updateSlideAnswer,
  alreadySubmitted,
  getSlides,
  getTopicsTitles,
  getDesiredImprovements,
  fetchIntroSlideContents,
} from "@/services/UsersService";
import { cn } from "@/lib/utils";

const allTopics = getTopicsTitles();
const allDesiredImprovements = getDesiredImprovements();

export function Player() {
  const [slides, setSlides] = React.useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(null);
  const [currentSlide, setCurrentSlide] = React.useState(null);
  const [currentValue, setCurrentValue] = React.useState(3);
  const [currentDesiredImprovement, setCurrentDesiredImprovement] =
    React.useState(null);
  const [nextButtonClickability, setNextButtonClickability] =
    React.useState(true);
  const [currentValueStep, setCurrentValueStep] = React.useState(35);
  const [introSlideContents, setIntroSlideContents] = React.useState("");
  const [introSlideOpen, setIntroSlideOpen] = React.useState(true);
  const [resetImages, setResetImages] = React.useState(false);
  const [slideIntroVisibility, setSlideIntroVisibility] = React.useState(false);
  const [topicOutroCover, setTopicOutroVisibility] = React.useState(false);
  var converter = new showdown.Converter();
  var html = converter.makeHtml(introSlideContents);

  React.useEffect(() => {
    const f = async () => {
      const firstIntroSlideContents = await fetchIntroSlideContents();
      setIntroSlideContents(firstIntroSlideContents);

      const records = await getSlides();
      setSlides(records);
      setCurrentSlideIndex(0);
      setSlideIntroVisibility(true);
    };
    f();
  }, []);

  React.useEffect(() => {
    const f = async () => {
      const slideId = currentSlide ? currentSlide.id : null;
      const answer = currentValue;
      if (slides?.[currentSlideIndex]) {
        setCurrentSlide(slides[currentSlideIndex]);
        setCurrentValue(3);
        setCurrentValueStep(35);
        setCurrentDesiredImprovement(null);
      }
      if (
        !!currentSlideIndex &&
        (slides[currentSlideIndex]?.topic !==
          slides?.[currentSlideIndex - 1]?.topic ||
          currentSlideIndex >= slides?.length)
      ) {
        setTopicOutroVisibility(true);
      }
    };
    f();
  }, [currentSlideIndex]);

  React.useEffect(() => {
    setNextButtonClickability(false);
    const f = async () => {
      const slideId = currentSlide ? currentSlide.id : null;
      const answer = currentValue;
      if (slideId && !alreadySubmitted(slideId)) {
        addSubmission(slideId);
        await updateSlideAnswer(slideId, answer, currentDesiredImprovement);
      }
      const desiredImprovementValue = allDesiredImprovements.reduce(
        (acc, curr, ind) => {
          console.log('reduce: picking desiredImprovementValue', curr, currentDesiredImprovement, ind, acc)
          if (curr.id === currentDesiredImprovement) acc = ind + 1;
          return acc;
        },
        0
      );
      const topicName = allTopics[currentSlide.topic];
      console.log('before addSubmissionForSummary', desiredImprovementValue)
      addSubmissionForSummary(
        currentSlide.topic,
        topicName,
        slideId,
        currentSlide.title,
        currentSlide.subtitle,
        answer,
        desiredImprovementValue
      );
      setNextButtonClickability(true);
    };
    if (currentDesiredImprovement !== null) {
      f();
    } else {
      setNextButtonClickability(true);
    }
  }, [currentDesiredImprovement]);
  console.log("asdasdasd", slideIntroVisibility);

  return (
    <>
      {slides === null ? (
        <p>{"טוען..."}</p>
      ) : window.innerWidth > 1000 && introSlideOpen ? (
        <div
          className={cn("absolute z-50 h-full w-full top-0 left-0", {
            hidden: !introSlideOpen,
          })}
        >
          <Introduction next={setIntroSlideOpen} />
        </div>
      ) : (
        <div>
          {slides?.length === 0 && (
            <div className={"absolute z-50 h-full w-full top-0 left-0"}>
              <div
                className={
                  "fixed left-0 top-0 z-10 h-full w-full bg-primary bg-finished bg-no-repeat bg-center bg-origin-border bg-cover flex align-center justify-center"
                }
              >
                <div
                  className={
                    "absolute bottom-[10%] w-auto bg-white flex flex-col gap-5 justify-center mx-auto p-4 pt-7 px-12 border-4 border-bluedark font-bold pb-7"
                  }
                >
                  <p className="text-center text-2xl ">
                    {"תודה על שיתוף הפעולה!"}
                  </p>
                  <div className="flex relative">
                    <Button
                      type="submit"
                      className="mx-auto w-full bg-primary"
                      onClick={logout}
                    >
                      {"סיום"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!!slides?.length && currentSlide && (
            <div>
              {topicOutroCover && (
                <div className={"absolute z-50 h-full w-full top-0 left-0"}>
                  <TopicOutro
                    submissions={getSummaryByTopicId(
                      slides?.[currentSlideIndex - 1]?.topic
                    )}
                    next={() => {
                      setTopicOutroVisibility(false);
                      setSlideIntroVisibility(true);
                      setTimeout(() => {
                        setSlideIntroVisibility(false);
                      }, 8000);
                      if (
                        slides?.length &&
                        currentSlideIndex >= slides?.length
                      ) {
                        setSlides([]);
                      }
                    }}
                  />
                </div>
              )}
              {slideIntroVisibility && (
                <div className={"absolute z-50 h-full w-full top-0 left-0"}>
                  <Cover
                    onStart={() => setSlideIntroVisibility(false)}
                    title={allTopics[currentSlide.topic]}
                  />
                </div>
              )}
              <Card className="border-0 pt-0 relative">
                <CardHeader>
                  <CardTitle className="bg-secondary/50 rounded-sm py-4 px-6 text-center">
                    <p className="text-2xl sm:text-base">
                      {currentSlide?.title}
                    </p>
                    <p
                      className="text-l font-regular sm:text-base"
                      style={{ fontWeight: "400" }}
                    >
                      {currentSlide?.subtitle}
                    </p>
                  </CardTitle>
                  <CardDescription>{}</CardDescription>
                </CardHeader>
                <CardContent className="flex-column">
                  <div className="grid gap-6 mt-[-1em] grid-cols-3">
                    <div>
                      <figure className="flex-row justify-start">
                        <img
                          className="aspect-square"
                          src={
                            resetImages
                              ? `https://ratee.pockethost.io/api/files/m8ih3udzcgmwlaj/2aeudphns9aug9r/fff_AjkycInW6S.png?token=`
                              : `https://ratee.pockethost.io/api/files/m8ih3udzcgmwlaj/${currentSlide.id}/${currentSlide.image1}`
                          }
                          alt={currentSlide.image1_title}
                        />
                        <figcaption className="grow-0 my-2 sm:text-[0.85rem] md:text-md text-center text-gray-800 font-regular dark:text-gray-400">
                          {currentSlide.image1_title}
                        </figcaption>
                      </figure>
                    </div>
                    <div className="align-middle grid grow">
                      <Slider
                        onValueChange={(val) => {
                          const newValue = Math.round((val - 10) / 10) || 1;
                          setCurrentValue(newValue);
                          setCurrentValueStep(val);
                          console.log("HEEEEy SLIDER", val, newValue);
                        }}
                        transparent
                        value={[currentValueStep]}
                        min={10}
                        max={60}
                        step={1}
                      />
                    </div>
                    <div>
                      <figure className="flex-row justify-start">
                        <img
                          className="aspect-square"
                          src={
                            resetImages
                              ? `https://ratee.pockethost.io/api/files/m8ih3udzcgmwlaj/2aeudphns9aug9r/fff_AjkycInW6S.png?token=`
                              : `https://ratee.pockethost.io/api/files/m8ih3udzcgmwlaj/${currentSlide.id}/${currentSlide.image2}`
                          }
                          alt={currentSlide.image2_title}
                        />
                        <figcaption className="grow-0 my-2 sm:text-[0.85rem] md:text-md text-center text-gray-800 font-regular dark:text-gray-400">
                          {currentSlide.image2_title}
                        </figcaption>
                      </figure>
                    </div>
                  </div>
                  <div className="grid gap-2 mt-6">
                    <p className="text-center text-md font-bold">
                      {currentSlide.buttons_title
                        ? currentSlide.buttons_title
                        : "באיזו מידה חשוב לך לשפר את הביצוע / להיות עצמאי יותר בביצוע שלה?"}
                    </p>
                    <RadioGroup
                      onValueChange={(val) => {
                        setCurrentDesiredImprovement(val);
                      }}
                      defaultValue={currentDesiredImprovement}
                      value={currentDesiredImprovement}
                      className={cn("grid gap-2 sm:grid-cols-5 w-[75%] m-auto")}
                    >
                      {getDesiredImprovements().map((option, index) => {
                        option.selected =
                          currentDesiredImprovement === option.id;

                        return (
                          <div key={`${currentSlide.id}_${index}`}>
                            <RadioGroupItem
                              value={option.id}
                              id={`${currentSlide.id}_${option.id}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`${currentSlide.id}_${option.id}`}
                              style={{ textWrap: "nowrap" }}
                              className={cn(
                                "flex flex-col items-center justify-between rounded-sm bg-secondary/50 py-4 px-4 hover:bg-secondary/80 text-white text-center",
                                {
                                  "bg-secondary": option.selected,
                                }
                              )}
                            >
                              {option.name}
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                </CardContent>

                <CardFooter className="absolute bottom-0 left-0 bg-blend-overlay bg-white-200 mt-4 grid align-center grid-rows-2 gap-1 md:ml-12">
                  <div>
                    {!nextButtonClickability && (
                      <div className="absolute w-full h-full flex  justify-center items-center bg-white bg-opacity-80"></div>
                    )}
                    <Button
                      variant="outline"
                      className="w-full p-1 m-0 text-lg"
                      onClick={async () => {
                        setResetImages(true);
                        setTimeout(() => setResetImages(false), 1000);
                        const slideId = currentSlide ? currentSlide.id : null;
                        if (slideId && !alreadySubmitted(slideId)) {
                          addSubmission(slideId);
                          await updateSlideAnswer(slideId, null, null);
                        }
                        const topicName = allTopics[currentSlide.topic];
                        addSubmissionForSummary(
                          currentSlide.topic,
                          topicName,
                          slideId,
                          currentSlide.title,
                          currentSlide.subtitle,
                          null,
                          null
                        );
                        setCurrentSlideIndex(currentSlideIndex + 1);
                      }}
                    >
                      {"דלג"}
                      <img src="/reset.png" width={"30"} className="mr-4" />
                    </Button>
                  </div>{" "}
                  <div className="flex relative">
                    {(currentDesiredImprovement === null ||
                      !nextButtonClickability) && (
                      <div className="absolute w-full h-full flex  justify-center items-center bg-white bg-opacity-80"></div>
                    )}
                    <Button
                      className="w-full p-1 m-0 text-md bg-white"
                      variant="outline"
                      onClick={async () => {
                        setResetImages(true);
                        setTimeout(() => setResetImages(false), 1000);
                        setCurrentSlideIndex(currentSlideIndex + 1);
                      }}
                    >
                      {"הבא"}
                      <img src="/arrow.png" width={"50"} />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      )}
    </>
  );
}
