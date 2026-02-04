import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

        <CardContent className="grid gap-6">
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
              "grid-cols-3": currentOptions?.length >= 3,
            })}
          >
            {currentOptions?.map((option, index) => {
              const Icon =
                option.icon && Icons[option.icon] ? Icons[option.icon] : null;
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
                      "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                      {
                        "border-primary": option.selected,
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
