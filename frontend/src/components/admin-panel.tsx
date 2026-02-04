import * as React from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
import {
  addSubmission,
  updateSlideAnswer,
  alreadySubmitted,
  fetchTrainers,
  fetchUsers,
  getDesiredImprovements,
} from "@/services/UsersService";
import { cn } from "@/lib/utils";

export function AdminPanel() {
  const [trainers, setTrainers] = React.useState([]);
  const [currentTrainer, setCurrentTrainer] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const f = async () => {
      const trainers = await fetchTrainers();
      setTrainers(trainers);
      const users = await fetchUsers();
      setUsers(users);
    };
    f();
  }, []);

  return (
    <>
      {!trainers.length && !users.length ? (
        <p>{"loading..."}</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">{""}</CardTitle>
            <CardDescription>{}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex-column">
              <div className="grid gap-6 grid-cols-3 mt-6">
                <Select
                  onValueChange={(val) => {
                    setCurrentTrainer(val);
                    console.log("trainer changed to ", val);
                  }}
                >
                  <SelectTrigger className="w-[200px] mx-auto">
                    <SelectValue placeholder={"כל המטפלים"} />
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
                <Select
                  onValueChange={(val) => {
                    setCurrentUser(val);
                    console.log("user changed to ", val);
                  }}
                >
                  <SelectTrigger className="w-[200px] mx-auto">
                    <SelectValue placeholder={"כל היוזרים"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/*<SelectLabel>{"Select trainer"}</SelectLabel>*/}
                      {users?.map((option, index) => (
                        <SelectItem value={option.id} key={index}>
                          {option.email}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="w-auto ml-auto"
                  onClick={() => console.log("Applying")}
                >
                  {"למשוך"}
                </Button>
              </div>
              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Slide</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Trainer</TableHead>
                      <TableHead className="text-right">Answer</TableHead>
                      <TableHead className="text-right">
                        Wish to improve
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">slide #1</TableCell>
                      <TableCell>foo@example.com</TableCell>
                      <TableCell>{"מחקר"}</TableCell>
                      <TableCell className="text-right">4</TableCell>
                      <TableCell className="text-right">{"כלל לא"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex">
              <Button
                className="w-full"
                onClick={() => console.log("EXPORTING TO CSV")}
              >
                {"Export to CSV"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
