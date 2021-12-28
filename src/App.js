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

  // graph demo graph
  const data = [
    {
      name: "Page A",
      uv: 590,
      pv: 800,
      amt: 1400,
      cnt: 490
    },
    {
      name: "Page B",
      uv: 868,
      pv: 967,
      amt: 1506,
      cnt: 590
    },
    {
      name: "Page C",
      uv: 1397,
      pv: 1098,
      amt: 989,
      cnt: 350
    },
    {
      name: "Page D",
      uv: 1480,
      pv: 1200,
      amt: 1228,
      cnt: 480
    },
    {
      name: "Page E",
      uv: 1520,
      pv: 1108,
      amt: 1100,
      cnt: 460
    },
    {
      name: "Page F",
      uv: 1400,
      pv: 680,
      amt: 1700,
      cnt: 380
    }
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
    n = Math.random() * range + min;
    return n;
  }

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

  // const user array
  let user = [11111, 2, 3, 4, 2, 3, 2, 4, 5, 7, 8, 9, 8, 6, 4];
  user = user; // getRandomData() user getBenfordData()
  // get first digit
  let firstDigit = user.map((x) => x.toString().charAt(0));
  let result = [];
  // write to array
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

  const round = (value, decimals = 3) => {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  };

  // create graph data
  let graphdata = [];
  result.forEach((x, i) => {
    graphdata.push({
      name: x.number.toString(),
      distribution: round(x.frequency),
      benford: round(x.propability)
    });
  });

  console.log(graphdata);

  function dev() {
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
      <p>test set für das wsw busradar</p>
      <pre>{user}</pre>
      <p>first Digits only</p>
      <pre>{firstDigit}</pre>
      <hr></hr>
      <br></br>
      <h3>Distribution</h3>
      <ul>
        {result.map((x) => (
          <li key={x.number}>
            {x.number} • {x.frequency} • {x.propability}
          </li>
        ))}
      </ul>
      <h3>Result</h3>
      <p>
        Absilute Mean distribution
        <br />
        The lower the number the more natural the distribution.{" "}
      </p>
      <p>{dev()}</p>
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
