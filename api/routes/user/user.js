const express = require("express");
const router = express.Router();

const nano = require("nano")("http://root:admin@10.168.64.31:5984");

const bodyParser = require("body-parser");
const cors = require("cors");
router.use(cors());
router.use(bodyParser.urlencoded({ limit: "1000mb", extended: false }));
router.use(
  bodyParser.json({
    limit: "1000mb",
  })
);

router.get("/get/:id", (req, res) => {
    const query = {
      selector: {
        employee_code: {
          $eq: req.params.id,
        },
      },
      fields: [
        "employee_code",
        "password",
        "team",
        "full_name",
        "department",
        "section",
        "testm",
        "designation",
        "status",
        "update",
        "master",
        "position",
        "i_pallet",
        "newRights",
        "listenTo",
      ],
      limit: 10000,
    };
    nano.request(
      {
        method: "post",
        db: "hrd_masteruser",
        doc: "_find",
        body: query,
      },
      (err, body) => {
        if (!err) {
          res.send(body.docs);
        } else {
        }
      }
    );
  });
  
  
  module.exports = router