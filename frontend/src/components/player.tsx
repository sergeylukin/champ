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
  getDesiredImprovementsIdMap,
} from "@/services/UsersService";
import { cn } from "@/lib/utils";

const allTopics = getTopicsTitles();
const allDesiredImprovements = getDesiredImprovements();

export function Player() {
  const [slides, setSlides] = React.useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(null);
  const [currentSlide, setCurrentSlide] = React.useState(null);
  // holds id of current answer - to update record by id if answer is changed in UI
  // is reset when user navigates to next question
  const [currentSubmissionId, setCurrentSubmissionId] = React.useState(null);
  const [currentValue, setCurrentValue] = React.useState(3);
  
  // Explantion:
  // Desired improvement is a 1-to-1 relation in DB
  // In UI it's represented as number (1-5) via <Slider />
  //
  // When slider value changes -> id of desired_improvement is fetched from
  // numToDesiredImprovementIdMap and stored in currentDesiredImprovement 
  //
  // In addition, currentNumericDesiredImprovement is updated
  // to reflect current slider state 
  //
  // output format: {1: 'some id', 2: 'another id', ...}
  const numToDesiredImprovementIdMap = getDesiredImprovementsIdMap();
  const [currentDesiredImprovement, setCurrentDesiredImprovement] =
    React.useState(null);
  const [currentNumericDesiredImprovement, setNumericCurrentDesiredImprovement] = React.useState(3);

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
      if (slideId) {
        if (!alreadySubmitted(slideId)) {
          addSubmission(slideId);
        }
        console.log('before updateing answer', currentDesiredImprovement)
        const record = await updateSlideAnswer(currentSubmissionId, slideId, answer, currentDesiredImprovement);
        console.log('SET SUBMISSION ID TO ', record.id)
        setCurrentSubmissionId(record.id);
      }

      
      const topicName = allTopics[currentSlide.topic].subtitle;
      console.log('before addSubmissionForSummary', currentDesiredImprovement)
      addSubmissionForSummary(
        currentSlide.topic,
        topicName,
        slideId,
        currentSlide.title,
        currentSlide.subtitle,
        answer,
        currentDesiredImprovement
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
                  "fixed left-0 top-0 z-10 h-full w-full bg-primary bg-white bg-no-repeat bg-center bg-origin-border bg-cover flex align-center justify-center"
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
                      className="mx-auto w-full"
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
                    title={allTopics[currentSlide.topic].subtitle}
                    subtitle={allTopics[currentSlide.topic].title}
                  />
                </div>
              )}
              <Card className="border-0 pt-0 relative">
                <CardHeader>
                  <CardTitle className="text-black bg-secondary/50 rounded-sm py-4 px-6 text-center">
                    <p className="lg:text-5xl sm:text-base">
                      {currentSlide?.title}
                    </p>
                    <p
                      className="pt-4 lg:text-xl font-regular sm:text-base"
                      style={{ fontWeight: "400" }}
                    >
                      {currentSlide?.subtitle}
                    </p>
                  </CardTitle>
                  <CardDescription>{}</CardDescription>
                </CardHeader>
                <CardContent className="flex-column">
                  <div className="grid gap-6 mt-[-1em] grid-cols-2">
                    <div>
                      <figure className="flex-row justify-start">
                        <img
                          className="aspect-square"
                          src={
                            resetImages
                              ? `https://ratee.pockethost.io/api/files/m8ih3udzcgmwlaj/2aeudphns9aug9r/fff_AjkycInW6S.png?token=`
                              : `https://ratee.pockethost.io/api/files/7un2ljqbqmwf5ba/${currentSlide.id}/${currentSlide.image}`
                          }
                          alt={currentSlide.subtitle}
                        />
                      </figure>
                    </div>
                    {/* container for both vertically positioned sliders */}
                    <div className="flex flex-col gap-4">
                      <div className="align-middle grid grow bg-accent3">
                        <p className="pt-6 text-2xl font-bold">{currentSlide.question1_title}</p>
                        <div className="px-6">
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
                          <div className="grid gap-6 grid-cols-3 text-xl pt-4 font-bold">
                            <p>{"אף פעם"}</p>
                            <p>{"לפעמים"}</p>
                            <p>{"הרבה מאוד"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="align-middle grid grow bg-accent1">
                        {/* TODO: rename to new field name (question2_title) */}
                        <p className="pt-6 text-2xl font-bold">{currentSlide.question2_title}</p>
                        <div className="px-6">
                          <Slider
                              onValueChange={(val) => {
                                setNumericCurrentDesiredImprovement(val);
                              }}
                              // Explanation:
                              // in order to avoid DB updates on every slider tick change
                              // onValueCommit is called when user releases pointer
                              onValueCommit={(val) => {
                                setCurrentDesiredImprovement(numToDesiredImprovementIdMap[val]);
                              }}
                              transparent
                              value={[currentNumericDesiredImprovement]}
                              min={1}
                              max={5}
                              step={1}
                            />
                          <div className="grid gap-6 grid-cols-3 text-xl pt-4 font-bold">
                            <p>{"בכלל לא"}</p>
                            <p>{"קצת"}</p>
                            <p>{"מאוד"}</p>
                          </div>
                        </div>
                      </div>
                      {/* here goes the Next / SKip... */}
                      <div className="flex flex-row justify-between">
                        {!nextButtonClickability && (
                          <></>
                            // TODO: revisit
                          /*<div className="absolute w-full h-full flex  justify-center items-center bg-white bg-opacity-80"></div>*/
                        )}
                        <Button
                          variant="outline"
                          className="p-1 m-0 text-lg"
                          onClick={async () => {
                            setResetImages(true);
                            setTimeout(() => setResetImages(false), 1000);
                            const slideId = currentSlide ? currentSlide.id : null;
                            // TODO: can be extracted (currently duplicated)
                            if (slideId) {
                              if (!alreadySubmitted(slideId)) {
                                addSubmission(slideId);
                              }
                              await updateSlideAnswer(currentSubmissionId, slideId, null, null);
                            }
                            const topicName = allTopics[currentSlide.topic].subtitle;
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
                            setCurrentSubmissionId(null);
                          }}
                        >
                          {"דלג"}
                          <img src="/reset.png" width={"30"} className="mr-4" />
                        </Button>
                        {(currentDesiredImprovement === null ||
                          !nextButtonClickability) && (
                            <></>
                            // TODO: revisit
                          //<div className="absolute w-full h-full flex  justify-center items-center bg-white bg-opacity-80"></div>
                        )}
                        <Button
                          className="p-1 m-0 text-md bg-white"
                          variant="outline"
                          onClick={async () => {
                            setResetImages(true);
                            setTimeout(() => setResetImages(false), 1000);
                            setCurrentSlideIndex(currentSlideIndex + 1);
                            setCurrentSubmissionId(null);
                          }}
                        >
                          {"הבא"}
                          <img src="/arrow.png" width={"50"} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </>
  );
}
