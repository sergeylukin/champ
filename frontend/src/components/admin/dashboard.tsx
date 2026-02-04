import * as React from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Editor } from "@/components/admin/editor";
import {
  fetchIntroSlideContents,
  updateIntroSlideContents,
} from "@/services/UsersService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTable } from "@/components/submissions/data-table";
import { type Submission, columns } from "@/components/submissions/columns";
import {
  addSubmission,
  updateSlideAnswer,
  alreadySubmitted,
  fetchTrainers,
  fetchUsers,
  adminLogout,
  getDesiredImprovements,
  fetchSubmissionsByTrainer,
} from "@/services/UsersService";
import { cn } from "@/lib/utils";

const ALL_USERS = "0";

export function AdminDashboard() {
  const [trainers, setTrainers] = React.useState([]);
  const [currentTrainerName, setCurrentTrainerName] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [usersNames, setUsersNames] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState(ALL_USERS);
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [originalData, setOriginalData] = React.useState([]);
  const [introSliderMarkdown, setIntroSliderMarkdown] = React.useState("");

  React.useEffect(() => {
    if (!window.localStorage.getItem("admin_uid")) adminLogout();
    const f = async () => {
      const trainers = await fetchTrainers();
      setTrainers(trainers);
      const introMarkdown = await fetchIntroSlideContents();
      setIntroSliderMarkdown(introMarkdown);
    };
    f();
  }, []);

  return (
    <>
      <div className="flex-col flex">
        <div className="ltr">
          <div className="flex h-16 items-center px-4">
            <Button variant="outline" onClick={adminLogout}>
              {"יציאה"}
            </Button>
          </div>
        </div>
        <div className="container mx-auto" style={{ marginTop: "0px" }}>
          <Tabs defaultValue="reports" className="h-full gap-y-6">
            <div className="space-between flex items-center absolute right-6 top-4">
              <TabsList>
                <TabsTrigger value="reports" className="relative">
                  {"דוח״ות"}
                </TabsTrigger>
                <TabsTrigger value="pages">{"טקסט"}</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              value="reports"
              className="rtl border-none p-0 outline-none"
            >
              <div className="">
                {!trainers.length && !users.length ? (
                  <p>{"loading..."}</p>
                ) : (
                  <Card>
                    <CardContent className="relative">
                      <div className="flex gap-x-3">
                        <Select
                          onValueChange={async (val) => {
                            setIsLoading(true);
                            const trainerName = trainers.reduce((acc, next) => {
                              if (next.id === val) acc = next.name;
                              return acc;
                            }, "");
                            setCurrentTrainerName(trainerName);
                            const records = await fetchSubmissionsByTrainer(
                              val
                            );
                            const availableUsers = records.reduce(
                              (acc, next) => {
                                if (acc.indexOf(next.email) === -1)
                                  acc.push(next.email);
                                return acc;
                              },
                              []
                            );
                            setUsers(availableUsers);
                            const usersNames = records.reduce((acc, next) => {
                              acc[
                                next.email
                              ] = `${next.firstname} ${next.lastname}`;
                              return acc;
                            }, {});
                            setUsersNames(usersNames);
                            setCurrentUser(ALL_USERS);
                            setData(records);
                            setOriginalData(records);
                            setIsLoading(false);
                          }}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder={"נא לבחור מטפל"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {/*<SelectLabel>{"Select trainer"}</SelectLabel>*/}
                              {trainers?.map((option, index) => (
                                <SelectItem value={option.id} key={index}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {isLoading ? (
                          <Button
                            disabled
                            variant="outline"
                            className="w-[200px]"
                          >
                            <Loader2 className="mx-2 h-4 w-4 animate-spin" />
                            {"טוען"}
                          </Button>
                        ) : users.length ? (
                          <Select
                            onValueChange={(val) => {
                              setCurrentUser(val);
                              const newData =
                                val === ALL_USERS
                                  ? originalData
                                  : originalData.filter(
                                      (item) => item.email === val
                                    );
                              setData(newData);
                              console.log("user changed to ", val);
                            }}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder={"כל הנבדקים"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {/*<SelectLabel>{"Select trainer"}</SelectLabel>*/}
                                <SelectItem
                                  value={ALL_USERS}
                                  key={0}
                                  selected={currentUser === ALL_USERS}
                                >
                                  {"כל הנבדקים"}
                                </SelectItem>
                                {users?.map((email, index) => (
                                  <SelectItem value={email} key={index}>
                                    {`${usersNames[email]}`}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        ) : null}
                      </div>
                      {currentTrainerName && !isLoading && (
                        <div
                          className="absolute left-6 flex mt-6"
                          style={{ top: "-1rem" }}
                        >
                          <Button
                            className="bg-red-500 hover:bg-red-300"
                            onClick={() => {
                              const date = new Date();

                              let currentDay = String(date.getDate()).padStart(
                                2,
                                "0"
                              );

                              let currentMonth = String(
                                date.getMonth() + 1
                              ).padStart(2, "0");

                              let currentYear = date.getFullYear();

                              // we will display the date as DD-MM-YYYY
                              let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;
                              console.log("DATA", data);

                              const translations = {
                                answer: "ביצוע",
                                desired_improvement: "שיפור",
                                is_important: "נבחר",
                                name: "שם",
                                email: "אימייל",
                              };

                              function transformData(data) {
                                const users = {};
                                const headers = [
                                  translations.name,
                                  translations.email,
                                ];
                                const headerSet = new Set(headers);

                                data.forEach(
                                  ({
                                    email,
                                    firstname,
                                    lastname,
                                    slide,
                                    topic,
                                    ...rest
                                  }) => {
                                    if (!slide || !topic) return;
                                    const userKey = email;
                                    if (!users[userKey]) {
                                      users[userKey] = {
                                        [translations.name]: `${firstname} ${lastname}`,
                                        [translations.email]: email,
                                      };
                                    }

                                    Object.entries(rest).forEach(
                                      ([key, value]) => {
                                        const translatedKey =
                                          translations[key] || key;
                                        const topicStripped = topic
                                          .trim()
                                          .replace(/[^-\s\p{L}\d]/gu, "");
                                        const slideStripped = slide
                                          .trim()
                                          .replace(/[^-\s\p{L}\d]/gu, "");
                                        const column = `${topicStripped}-${slideStripped}-${translatedKey}`;
                                        users[userKey][column] = value
                                          ? String(value)
                                          : "";
                                        if (!headerSet.has(column)) {
                                          headers.push(column);
                                          headerSet.add(column);
                                        }
                                      }
                                    );
                                  }
                                );

                                const result = [headers];

                                Object.values(users).forEach((user) => {
                                  result.push(
                                    headers.map((header) => user[header] || "")
                                  );
                                });

                                return result;
                              }

                              // const columnsCsv = data.reduce((acc, curr) => {
                              //   acc.push(
                              //     curr.topic + "_" + curr.slide + "_ביצוע"
                              //   );
                              //   acc.push(
                              //     curr.topic + "_" + curr.slide + "_רצון לשינוי"
                              //   );
                              //   acc.push(
                              //     curr.topic + "_" + curr.slide + "_נבחר לקידום"
                              //   );
                              //   return acc;
                              // }, []);
                              //
                              // const columnsArr = data.reduce((acc, curr) => {
                              //   acc.push(
                              //     curr.topic + "_" + curr.slide + "_ביצוע"
                              //   );
                              //   acc.push(
                              //     curr.topic + "_" + curr.slide + "_רצון לשינוי"
                              //   );
                              //   acc.push(
                              //     curr.topic + "_" + curr.slide + "_נבחר לקידום"
                              //   );
                              //   return acc;
                              // }, []);
                              //
                              // const rows = columns.reduce((acc, curr) => {
                              //
                              // }, []);

                              // const content = [
                              //   [...["נבדק", "מייל"], ...columns],
                              //   ...data.map((e) => {
                              //     console.log("ROW", e);
                              //     const row = [
                              //       `${e.firstname} ${e.lastname}`,
                              //       e.email,
                              //       e.topic,
                              //       e.slide,
                              //       e.answer,
                              //       e.desired_improvement,
                              //       e.is_important,
                              //     ];
                              //     return row;
                              //   }),
                              // ];

                              const content = transformData(data);
                              console.log("CONTENTTTTT", content);
                              var finalVal = "";

                              // for (var i = 0; i < content.length; i++) {
                              //   var value = content[i];
                              //
                              //   for (var j = 0; j < value.length; j++) {
                              //     var innerValue = value[j]
                              //       ? value[j].toString()
                              //       : "";
                              //     let result;
                              //     switch (innerValue) {
                              //       case "כלל לא":
                              //         result = "1";
                              //         break;
                              //       case "במידה מועטה":
                              //         result = "2";
                              //         break;
                              //       case "לא משנה לי":
                              //         result = "3";
                              //         break;
                              //       case "במידה רבה":
                              //         result = "4";
                              //         break;
                              //       case "במידה רבה מאוד":
                              //         result = "5";
                              //         break;
                              //       default:
                              //         result = innerValue;
                              //     }
                              //
                              //     // result = result.replace(/"/g, '""');
                              //     // if (result.search(/("|,|\n)/g) >= 0)
                              //     //   result = '"' + result + '"';
                              //     if (j > 0) finalVal += ",";
                              //     finalVal += result;
                              //   }
                              //
                              //   finalVal += "\n";
                              // }

                              let csvFilename = `${currentDate}_${currentTrainerName}`;
                              if (currentUser !== ALL_USERS) {
                                csvFilename += `_${usersNames[currentUser]}`;
                              }
                              csvFilename += ".csv";

                              // var encodedUri =
                              //   "data:text/csv;charset=utf-8," +
                              //   encodeURIComponent(finalVal);
                              // const csvContent = content
                              //   .map((row) =>
                              //     row
                              //       .map(
                              //         (value) =>
                              //           `"${value.replace(/"/g, '""')}"`
                              //       )
                              //       .join(",")
                              //   )
                              //   .join("\n");
                              function exportToCSV(
                                data,
                                filename = "export.csv"
                              ) {
                                const csvContent = data
                                  .map((row) =>
                                    row
                                      .map(
                                        (value) =>
                                          `"${value.replace(/"/g, '""')}"`
                                      )
                                      .join(",")
                                  )
                                  .join("\n");
                                const blob = new Blob(["\ufeff" + csvContent], {
                                  type: "text/csv;charset=utf-8;",
                                });
                                const link = document.createElement("a");
                                link.href = URL.createObjectURL(blob);
                                link.setAttribute("download", filename);
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }

                              exportToCSV(transformData(data), csvFilename);

                              console.log("EXPORTING TO CSV");
                            }}
                          >
                            {"ייצוא ל-CSV"}
                          </Button>
                        </div>
                      )}
                      <div className="mt-6">
                        <DataTable data={data} columns={columns} />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            <TabsContent
              value="pages"
              className="prose h-full flex-col border-none p-0 data-[state=active]:flex"
            >
              <Editor
                initialContent={introSliderMarkdown}
                onSave={async (md) => {
                  await updateIntroSlideContents(md);
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
