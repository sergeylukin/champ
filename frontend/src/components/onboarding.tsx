import * as React from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import showdown from "showdown";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchIntroSlideContents,
  getOnboardingSteps,
} from "@/services/UsersService";
import { cn } from "@/lib/utils";

export function Onboarding() {
  const [stepDescription, setStepDescription] = React.useState("");
  const [steps, setSteps] = React.useState([]);
  const [currentOptions, setCurrentOptions] = React.useState([]);
  const [currentStep, setCurrentStep] = React.useState(null);
  const [introSlideContents, setIntroSlideContents] = React.useState("");
  const [introSlideOpen, setIntroSlideOpen] = React.useState(true);
  const IconBoy = Icons["boy"];
  const Icon = Icons["girl"];
  var converter = new showdown.Converter();
  var html = converter.makeHtml(introSlideContents);

  React.useEffect(() => {
    const f = async () => {
      const firstIntroSlideContents = await fetchIntroSlideContents();
      setIntroSlideContents(firstIntroSlideContents);

      const steps = await getOnboardingSteps();
      setSteps(steps);
      setCurrentStep(1);
      setCurrentOptions(steps[currentStep - 1]?.options);
    };
    f();
  }, []);
  React.useEffect(() => {
    if (currentStep > steps.length) {
      window.location.href = "/dashboard";
      return;
    }
    setCurrentOptions(steps[currentStep - 1]?.options);
    if (steps[currentStep - 1])
      steps[currentStep - 1]?.onRender(steps[currentStep - 1]?.options);
  }, [currentStep]);
  console.log("HOOOray", currentStep, steps);
  return (
    <>
      {(currentStep > steps.length || !currentStep) && (
        <div className="fixed inset-0 bg-white min-h-screen min-w-screen z-10"></div>
      )}
      {introSlideContents && (
        <Dialog open={introSlideOpen} onOpenChange={setIntroSlideOpen}>
          <DialogContent className="absolute w-[80vw] bg-red max-w-[80vw]">
            <DialogHeader className="top-0">
              <DialogTitle></DialogTitle>
              <DialogDescription className="lg:prose text-right lg:text-2xl text-center">
                <div dangerouslySetInnerHTML={{ __html: html }}></div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild className="">
                <Button type="submit" className="mx-auto w-[200px]">
                  {"נתחיל"}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {!introSlideOpen && (
        <Card size={steps[currentStep - 1]?.size}>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
            {steps[currentStep - 1]?.subtitle && (
              <CardDescription>
                {steps[currentStep - 1]?.subtitle}
              </CardDescription>
            )}
          </CardHeader>
          {currentStep >= 1 && (
            <CardContent className="grid gap-6">
              {steps[currentStep - 1]?.component === "boxes" ? (
                <RadioGroup
                  onValueChange={(val) => {
                    console.log("CHANGE", val);
                    const options = steps[currentStep - 1]?.onChange(
                      val,
                      currentOptions
                    );
                    setCurrentOptions(options);

                    steps[currentStep - 1]?.update(options);
                  }}
                  defaultValue="card"
                  className={cn("grid gap-4", {
                    "grid-cols-2": currentOptions?.length === 2,
                    "md:grid-cols-3": currentOptions?.length >= 3,
                  })}
                >
                  {currentOptions?.map((option, index) => {
                    const Icon =
                      option.icon && Icons[option.icon]
                        ? Icons[option.icon]
                        : null;
                    //   <div className="mb-3 h-6 w-6">{Icons[option.icon]}</div>
                    // )

                    return (
                      <div key={index}>
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={option.id}
                          className={cn(
                            "flex flex-col items-center justify-between rounded-md bg-secondary/[40%] p-4 hover:bg-secondary/[50%] hover:text-bold hover:text-accent-foreground",
                            {
                              "font-bold": option.selected,
                              "border-secondary": option.selected,
                              "border-4": option.selected,
                            }
                          )}
                        >
                          {Icon && <Icon className="mb-3 h-6 w-6" />}
                          {option.name}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              ) : steps[currentStep - 1]?.component === "checkboxes" ? (
                <div
                  className={cn("grid gap-4", {
                    "grid-cols-2": currentOptions?.length === 2,
                    "md:grid-cols-3": currentOptions?.length >= 3,
                  })}
                >
                  {currentOptions?.map((option, index) => {
                    if (option.id === "syo76yuz3y8avn7") {
                      return;
                    }
                    const Icon =
                      option.icon && Icons[option.icon]
                        ? Icons[option.icon]
                        : null;
                    return (
                      <div
                        onClick={() => {
                          const val = option.id;
                          console.log("CHANGE", val);
                          const options = steps[currentStep - 1]?.onChange(
                            val,
                            currentOptions
                          );
                          setCurrentOptions(options);

                          steps[currentStep - 1]?.update(options);
                        }}
                        className={cn(
                          "flex flex-col items-center justify-between rounded-md bg-secondary/[40%] p-4 hover:bg-secondary/[50%] hover:text-accent-foreground text-sm",
                          {
                            "font-bold": option.selected,
                            "border-secondary": option.selected,
                            "border-4": option.selected,
                          }
                        )}
                      >
                        {Icon && <Icon className="mb-3 h-6 w-6" />}
                        {option.name}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Select
                  onValueChange={(val) => {
                    console.log("CHANGE", val);
                    const options = steps[currentStep - 1]?.onChange(
                      val,
                      currentOptions
                    );
                    setCurrentOptions(options);

                    steps[currentStep - 1]?.update(options);
                  }}
                >
                  <SelectTrigger className=" mx-auto">
                    <SelectValue placeholder={currentOptions?.[0]?.name} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/*<SelectLabel>Fruits</SelectLabel>*/}
                      {currentOptions?.map((option, index) => (
                        <SelectItem value={option.id} key={index}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          )}

          <CardFooter>
            {currentStep >= 1 && (
              <Button
                className="mx-auto w-[200px]"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                {"הבא"}
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  );
}
