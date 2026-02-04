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

export const TopicOutro = ({ submissions = default_submissions, next }) => {
  const topic_submissions =
    submissions && submissions.length > 0 ? submissions : default_submissions;
  console.log("<TopicOutro>", submissions, topic_submissions);
  const defaultAnswers = topic_submissions.map((item) => {
    return false;
  });
  const [answers, setAnswers] = React.useState(defaultAnswers);
  const totalCheckedAnswers = answers.reduce((acc, curr) => {
    if (curr) acc++;
    return acc;
  }, 0);
  const onCheckChange = (ind) => {
    const newAnswers = answers.map((answer, i) => {
      if (i === ind) return !answer;
      return answer;
    });

    setAnswers(newAnswers);
    const slideId = topic_submissions[ind].slideId;
    updateSlideImportance(slideId, !answers[ind]);

    setIsImportantBySlideId(slideId, newAnswers[ind]);
  };
  const topicName = topic_submissions[0].topicName;

  const printSummary = () => {
    var myWindow = window.open("", "MsgWindow", "width=1024,height=1024");
    const rules = Array.from(document.styleSheets).reduce((sum, sheet) => {
      // errors in CORS at some sheets (e.g. qiita)
      // like: "Uncaught DOMException: Failed to read the 'cssRules'
      // property from 'CSSStyleSheet': Cannot access rules"
      try {
        return [
          ...sum,
          ...Array.from(sheet.cssRules).map((rule) => rule.cssText),
        ];
      } catch (e) {
        // console.log('errored', e);
        return sum;
      }
    }, []);

    myWindow.document.write(
      "<html><head></head><body>" +
        document.querySelectorAll("#summary_table")[0].innerHTML +
        "</body></html>"
    );
    // at dst document
    const newSheet = myWindow.document
      .querySelector("head")
      .appendChild(document.createElement("style")).sheet;
    rules.forEach((rule) => newSheet.insertRule(rule, newSheet.length));
    const allButtons = myWindow.document.querySelectorAll("button");
    allButtons.forEach((btn) => btn.parentNode.removeChild(btn));
  };

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
            <CardTitle className="text-center text-2xl">
              <p className="text-2xl">{`סיכום דירוג תחום "${topicName}"`}</p>
              <p className="text-sm font-normal mt-2">
                {
                  "בטבלה הבאה מופיע סיכום הדירוגים שלך בכל אחד מהפריטים בתחום זה."
                }
              </p>
              <p className="text-sm font-normal mt-2">
                {"ביכולתך לסמן בעמודה הימנית 2-3 פעילויות שהכי היית רוצה לקדם."}
              </p>
            </CardTitle>
            <CardDescription>
              <Table className="relative table-fixed border mt-8" style={{}}>
                <TableCaption>
                  <Button
                    type="submit"
                    className="mx-auto absolute h-5 text-xs rounded-xs px-2 py-0 -top-8 left-0 hover:bg-primary bg-primary/50 border border-primary/50"
                    onClick={printSummary}
                  >
                    {"פתח להדפסה"}
                  </Button>
                </TableCaption>
                <TableHeader className="text-xs">
                  <TableRow>
                    <TableHead className="text-right"></TableHead>
                    <TableHead className="w-full max-w-[70%] font-bold text-right">
                      {"פריט"}
                    </TableHead>
                    <TableHead className="w-[12%] font-bold text-right">
                      {"רמת ביצוע שדורגה"}
                    </TableHead>
                    <TableHead className="w-[14%] font-bold text-right">
                      {"מידת חשיבות שדורגה"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topic_submissions.map((submission, index) => (
                    <TableRow key={submission.answer}>
                      <TableCell className="font-medium text-right py-2">
                        <Checkbox
                          checked={answers[index]}
                          onCheckedChange={() => onCheckChange(index)}
                          className="mr-2 mt-1"
                        />
                      </TableCell>
                      <TableCell
                        style={{ textWrap: "nowrap" }}
                        className="font-medium py-2 text-right w-full max-w-[70%] overflow-hidden text-ellipsis"
                      >
                        <span className="font-bold">{submission.title}:</span>
                        <span> </span>
                        <span>{submission.subtitle}</span>
                      </TableCell>
                      <TableCell className="font-bold text-right py-2">
                        {submission.answer ? submission.answer : "-"}
                      </TableCell>
                      <TableCell className="font-bold text-right py-2">
                        {submission.desired_answer
                          ? submission.desired_answer
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex relative">
                <Button
                  type="submit"
                  className="mx-auto w-[200px]"
                  onClick={next}
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
