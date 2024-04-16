import express from "express";
import ResourseTable from "./utils/resourceTable.mjs";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const resourceMapping = new Map([
  [
    "01",
    [0, 2, 3],
  ],
  [
    "02",
    [0, 3],
  ],
  ["03", [0]],
  ["10", [1]],
  [
    "12",
    [1, 0, 3],
  ],
  [
    "13",
    [1, 0],
  ],
  [
    "20",
    [2, 1],
  ],
  ["21", [2]],
  [
    "23",
    [2, 1, 0],
  ],
  [
    "30",
    [3, 2, 1],
  ],
  [
    "31",
    [3, 2],
  ],
  ["32", [3]],
]);

console.log(resourceMapping);

app.get("/carEnter", (req, res) => {
  try {
    // console.log({ body: res.query });

    let { startLane, currTime, endLane } = req.query;

    currTime = parseInt(currTime);
    
    const resourceTable = ResourseTable.getInstance();
    const resources = resourceMapping.get(startLane + endLane);
    console.log({ startLane, currTime, endLane, resources });

    startLane = parseInt(startLane);
    endLane = parseInt(endLane);

    const newSpeed = resourceTable.allocateResources(
      resources,
      startLane,
      currTime
    );

    // console.log(resourceTable.getTable());

    return res.send(newSpeed.toString());
  } catch (err) {
    // console.log(err);
    return res.send("-1");
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
