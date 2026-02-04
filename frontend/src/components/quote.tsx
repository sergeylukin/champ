import { useEffect, useState } from "react";
import quotes from "./quotes.json";
import { cn } from "../lib/utils";

export function Quote() {
  const random = Math.floor(Math.random() * (quotes.data.length - 1)) + 1;
  const quote = quotes.data[random];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 1000);
  }, []);

  return (
    <blockquote
      className={cn(
        !!visible ? "opacity-1" : "opacity-0",
        "ease-in-out duration-1000 space-y-2 ltr"
      )}
    >
      <p className="text-lg">{quote.text}</p>
      <footer className="text-sm pl-4">- {quote.author}</footer>
    </blockquote>
  );
}
