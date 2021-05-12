const express = require('express')
const router = express.Router()
const nano = require("nano")("http://root:admin@10.168.64.31:5984");
const RulebookFInalData = nano.db.use("rulebook");

const bodyParser = require("body-parser");
const cors = require("cors");
router.use(cors());
router.use(bodyParser.urlencoded({ limit: "1000mb", extended: false }));
router.use(
  bodyParser.json({
    limit: "1000mb",
  })
);

router.get("/get", (req, res) => {
    RulebookFInalData.view("delo", "all-files", {
      include_docs: true,
    }).then((body) => {
      let toSend = body.rows.map((item) => item.doc);
      res.send(toSend);
    });
  });


  router.post("/add", (req, res) => {
    RulebookFInalData.insert(req.body).then((body) => {
      res.send(body);
    });
  });


module.exports = router