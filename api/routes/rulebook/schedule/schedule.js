const express = require("express");
const router = express.Router();

const nano = require("nano")("http://root:admin@10.168.64.31:5984");
const RulebookSchedule = nano.db.use("rulebookv2");

const bodyParser = require("body-parser");
const cors = require("cors");
router.use(cors());
router.use(bodyParser.urlencoded({ limit: "1000mb", extended: false }));
router.use(
  bodyParser.json({
    limit: "1000mb",
  })
);

// add/year/schedule
router.get("/add/year/:year", (req, res) => {
  const year = req.params.year;
  RulebookSchedule.get("830c03b52f66bcbf802b89713d45d23b").then((body) => {
    if (!body.schedules[year]) {
      body.schedules[year] = {};
      RulebookSchedule.insert(body).then(() => {
        res.send("OK");
      });
    } else {
      res.send("Already exists!");
    }
  });
});

// /get/year/schedules
router.get("/get/year", (req, res) => {
  RulebookSchedule.get("830c03b52f66bcbf802b89713d45d23b").then((body) => {
    res.send(Object.keys(body.schedules));
  });
});

// get/schedules
router.get("/get/:year", (req, res) => {
  const year = req.params.year;
  RulebookSchedule.get("830c03b52f66bcbf802b89713d45d23b").then((body) => {
    res.send(body.schedules[year]);
  });
});

// /update/schedules
router.post("/update/:year", (req, res) => {
  const year = req.params.year;
  RulebookSchedule.get("830c03b52f66bcbf802b89713d45d23b").then((body) => {
    body.schedules[year][req.body.quarter] = [];
    if (req.body.before) {
      body.schedules[year][req.body.quarter].push(req.body.before);
    }
    if (req.body.meeting) {
      body.schedules[year][req.body.quarter].push(req.body.meeting);
    }
    if (req.body.after) {
      body.schedules[year][req.body.quarter].push(req.body.after);
    }
    RulebookSchedule.insert(body).then(() => {
      res.send("OK");
    });
  });
});

// get/all_scheduledate
router.get("/get/date/:year", (req, res) => {
  const year = req.params.year;
  let scheduleDate = [];
  RulebookSchedule.get("830c03b52f66bcbf802b89713d45d23b").then((body) => {
    scheduleDate = body.schedules[year];

    let quarter = Object.keys(scheduleDate);
    let data = [];
    quarter.map((rec) => {
      data.push(scheduleDate[rec][0]);
    });

    res.send(data);

    // res.send(latestScheduleDate);
  });
});

// get/latest_scheduledate
router.get("/get/latest_date/:year", (req, res) => {
  const year = req.params.year;
  let scheduleDate = [];
  RulebookSchedule.get("830c03b52f66bcbf802b89713d45d23b").then((body) => {
    scheduleDate = body.schedules[year];
    let quarter = Object.keys(scheduleDate);
    let latestQuarter = quarter[quarter.length - 1];
    let latestScheduleDate = scheduleDate[latestQuarter][0];
    console.log(quarter)

    res.send(latestScheduleDate);
  });
});

module.exports = router;
