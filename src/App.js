import "./styles.css";
import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default function App() {
  // links
  // https://en.wikipedia.org/wiki/Average_absolute_deviation
  // https://kevinbasset.medium.com/i-used-benfords-law-to-analyze-covid-19-in-113-countries-1a1194668069
  // https://en.wikipedia.org/wiki/Benford%27s_law#Examples
  // https://www.codedrome.com/benfords-law-in-javascript/

  // Benford number distribution
  const BenfordPercentages = [
    0,
    0.301,
    0.176,
    0.125,
    0.097,
    0.079,
    0.067,
    0.058,
    0.051,
    0.046
  ];

  // random data set
  function getRandomData() {
    const randomData = new Array(1000);
    for (let i = 0; i < 1000; i++) {
      randomData[i] = Math.floor(Math.random() * 1000);
    }
    return randomData;
  }

  function randBetween(min, max) {
    const range = max - min;
    let n;
    n = Math.random() * range + min;
    return n;
  }

  // random data set by benfords distribution
  function getBenfordData() {
    let BenfordData = [];
    let randomfactor;
    let start;
    let max;

    for (let firstdigit = 1; firstdigit <= 9; firstdigit++) {
      // get a random number between 0.8 and 1.2
      randomfactor = Math.random() * 0.4 + 0.8;
      max = Math.floor(1000 * BenfordPercentages[firstdigit] * randomfactor);
      for (let numcount = 1; numcount < max; numcount++) {
        start = firstdigit * 1000;
        BenfordData.push(randBetween(start, start + 1000));
      }
    }
    return BenfordData;
  }

  // example array
  let example = [11111, 2, 3, 4, 2, 3, 2, 4, 5, 7, 8, 9, 8, 6, 4];
  let dataSeries = example; // getRandomData() user getBenfordData()

  // get first digits of each number
  let firstDigit = dataSeries.map((x) => x.toString().charAt(0));

  // calculate result array
  let result = [];
  for (let n = 0; n < 10; n++) {
    result[n] = {
      number: n,
      amount: firstDigit.filter((d) => Number(d) === n).length,
      frequency:
        firstDigit.filter((d) => Number(d) === n).length / firstDigit.length,
      propability: BenfordPercentages[n],
      deviation: Math.abs(
        firstDigit.filter((d) => Number(d) === n).length / firstDigit.length -
          BenfordPercentages[n]
      )
    };
  }

  // rounding function
  const round = (value, decimals = 3) => {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  };

  // create array for graph
  let graphdata = [];
  result.forEach((x, i) => {
    graphdata.push({
      name: x.number.toString(),
      distribution: round(x.frequency),
      benford: round(x.propability)
    });
  });

  // calculate Mean Absolute Deviation
  function absoluteMeanDeviation() {
    let deviation = 0;
    result.forEach((x) => {
      console.log(Math.abs(x.frequency - x.propability), "/", x.amount);
      deviation += Math.abs(x.frequency * 100 - x.propability * 100);
    });
    deviation = deviation / firstDigit.length;
    return deviation;
  }

  return (
    <div className="App">
      <h1>Benfords Law</h1>
      <p>Set</p>
      <pre>{dataSeries}</pre>
      <p>first digits only</p>
      <pre>{firstDigit}</pre>
      <hr></hr>
      <br></br>
      <h3>Distribution</h3>
      <ul>
        {result.map((x) => (
          <li key={x.number}>
            {x.number} • {round(x.frequency)} • {x.propability}
          </li>
        ))}
      </ul>
      <h3>Mean Absolute Deviation</h3>
      <p>The lower the number the more natural the distribution. </p>
      <p>{absoluteMeanDeviation()}</p>
      <hr></hr>
      <h3>Graph</h3>
      <ComposedChart
        width={500}
        height={400}
        data={graphdata}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name" scale="band" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="distribution" barSize={20} fill="#413ea0" />
        <Line type="monotone" dataKey="benford" stroke="#ff7300" />
      </ComposedChart>
    </div>
  );
}
