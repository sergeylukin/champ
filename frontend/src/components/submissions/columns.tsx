"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { desiredImprovementToNumber } from "@/lib/submissions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Submission = {
  id: string;
  slide: string;
  answer: number;
  desired_improvement: string;
  email: string;
};

export const columns = [
  {
    accessorKey: "firstname",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <div className="text-right">{"נבדק"}</div>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const firstName = row.original.firstname;
      const lastName = row.original.lastname;

      return (
        <div className="text-right font-bold">
          {firstName} {lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <div className="text-right">{"מייל"}</div>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "topic",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <div className="text-right">{"תחום"}</div>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const topic = row.getValue("topic");
      return <div className="text-right font-medium">{topic}</div>;
    },
  },
  {
    accessorKey: "slide",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <div className="text-right">{"פריט"}</div>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const slide = row.getValue("slide");
      return <div className="text-right">{slide}</div>;
    },
  },
  {
    accessorKey: "answer",
    header: () => <div className="text-right">{"דירוג ביצוע"}</div>,
    cell: ({ row }) => {
      const answer = parseFloat(row.getValue("answer"));
      const formatted = answer === 0 ? "-" : answer;

      return <div className="text-right font-bold">{formatted}</div>;
    },
  },
  {
    accessorKey: "desired_improvement",
    header: () => <div className="text-right">{"רצון לשינוי"}</div>,
    cell: ({ row }) => {
      const score = desiredImprovementToNumber(
        row.getValue("desired_improvement")
      );
      const formatted = score === null ? "-" : String(score);

      return <div className="text-right font-bold">{formatted}</div>;
    },
  },
  {
    accessorKey: "is_important",
    header: () => <div className="text-right">{"נבחר לקידום"}</div>,
  },
];
