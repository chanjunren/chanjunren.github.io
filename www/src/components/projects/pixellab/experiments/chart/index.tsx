import { useState } from "react";
import PixelLabContainer from "../../helpers/PixelLabContainer";
import { Background } from "./background";
import { Data } from "./data";

export default function Chart() {
  const [data, setData] = useState({
    neutral: 7,
    buy: 22,
    sell: 5,
    strongSell: 1,
    strongBuy: 13,
  });
  return (
    <PixelLabContainer label="007">
      <svg
        id="chart"
        onClick={() => {
          setData({
            neutral: randomBetween(1, 30),
            buy: randomBetween(1, 30),
            sell: randomBetween(1, 30),
            strongSell: randomBetween(1, 30),
            strongBuy: randomBetween(1, 30),
          });
        }}
        viewBox="0 0 100 100"
        width="100"
        className="cursor-pointer"
      >
        <Background data={data} />
        <Data data={data} />
      </svg>
    </PixelLabContainer>
  );
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
