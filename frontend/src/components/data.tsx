import { useEffect, useState } from "react";
import quotes from "./quotes.json";
interface IProps {
  url: string;
}
function getRandomNumber(min, max) {
  // Generate a random number between min (inclusive) and max (inclusive)
  return Math.floor(Math.random() * max) + 1;
}
export const Data: React.FC<IProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);
  console.log("here");

  useEffect(() => {
    setIsError(false);
    setIsLoading(true);
    setData(undefined);

    console.log("fetching " + url);
    setData(quotes.data);
    setIsLoading(false);
  }, [url]);

  let quote = "";
  if (data) {
    console.log(data.length);
    const random = getRandomNumber(1, data.length);
    console.log(random);
    quote = data[random];
    console.log(quote);
  }

  return isLoading ? (
    <h1>Loading....</h1>
  ) : isError ? (
    <h1>Error</h1>
  ) : (
    <p>{JSON.stringify(quote, null, 2)}</p>
  );
};
