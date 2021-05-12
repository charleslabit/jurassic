const express = require("express");
const router = express.Router();
const moment = require("moment");
const nano = require("nano")("http://root:admin@10.168.64.31:5984");
const RulebookSchedule = nano.db.use("rulebookv2");
const RuleBookBefore = nano.db.use("rulebookv2_initial");
const RuleBookAfter = nano.db.use("rulebook_afterthemeeting");
const RuleBookToUpdate = nano.db.use("rulebook_toupdate");
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

router.get("/get/new_documentno", (req, res) => {
  //Array ==  0  => new document     ||   Array == 2  => Transfer from after the meeting to  ToUpdate

  let array = 0;
  if (req.query.beforeORtoUpdate == "before") {
    array = 0;
  } else {
    array = 2;
  }
  let dateToday = req.query.dateToday;
  scheduleDate = [];

  RulebookSchedule.get("830c03b52f66bcbf802b89713d45d23b").then((body) => {
    scheduleDate = body.schedules[req.query.year];

    let newDocumentQuarter = "";
    let counter = 0;
    let quarter = Object.keys(scheduleDate);

    quarter.map((rec) => {
      scheduleDate[rec][0];
      if (counter == 0) {
        if (scheduleDate[rec][0] >= dateToday) {
          counter = 1;
          newDocumentQuarter = scheduleDate[rec][array];
        }
      }
    });

    let finalDocumentNo = "";
    let newBody = {};

    let newCurrentDate = moment(newDocumentQuarter).format("YYMMDD");

    if (array == 2) {
      RulebookFInalData.view("delo", "allrecord", {}).then((body2) => {
        newBody = body2.rows
          .map((item) => item.value)
          .filter((rec) => {
            return (
              !rec.obsolete && rec._id.substring(0, 6).includes(newCurrentDate)
            );
          })
          .map((rec) => {
            return rec._id;
          });
        newBody.sort();

        // If WAKU the first character of the document is 5 other is 2
        let method = 0;
        if (req.query.method == "WAKU") {
          method = 5;
        } else {
          method = 2;
        }
        if (newBody.length > 0) {
          let latestDocumentNo = newBody[newBody.length - 1];
          let newTemp = latestDocumentNo.substring(7, latestDocumentNo.length);
          let newTempNo = parseInt(newTemp) + 1;
          if (newTempNo.toString().length == 1) {
            newTempNo = `0${newTempNo}`;
          }
          finalDocumentNo = latestDocumentNo.substring(0, 6) + "-" + newTempNo;
          finalDocumentNo = finalDocumentNo.replace(
            finalDocumentNo.substring(0, 1),
            method
          );
        } else {
          finalDocumentNo = newCurrentDate + "-" + "01";
          finalDocumentNo = finalDocumentNo.replace(
            finalDocumentNo.substring(0, 1),
            method
          );
        }
        res.send(finalDocumentNo);
      });
    } else {
      res.send(newDocumentQuarter);
    }
  });
});

router.get("/get/final_documentno", (req, res) => {
  let newCurrentDate = req.query.newDocumentNo.split("-")[1];
  // +
  // "-" +
  // req.query.newDocumentNo.split("-")[2];
  let finalDocumentNo = "";
  let newBody = {};

  RuleBookToUpdate.view("rulebook-view", "rulebook-toUpdate").then((body) => {
    newBody = body.rows
      .map((item) => item.value)
      .filter((rec) => {
        return !rec.obsolete && rec._id.includes(newCurrentDate);
      })
      .map((rec) => {
        return rec._id;
      });
    newBody.sort();

    // If WAKU the first character of the document is 5 other is 2
    let method = 0;
    if (req.query.method == "WAKU") {
      method = 5;
    } else {
      method = 2;
    }
    if (newBody.length > 0) {
      let latestDocumentNo = newBody[newBody.length - 1];
      let newTemp = latestDocumentNo.substring(7, latestDocumentNo.length);
      let newTempNo = parseInt(newTemp) + 1;
      if (newTempNo.toString().length == 1) {
        newTempNo = `0${newTempNo}`;
      }
      finalDocumentNo = latestDocumentNo.substring(0, 6) + "-" + newTempNo;
      finalDocumentNo = finalDocumentNo.replace(
        finalDocumentNo.substring(0, 1),
        method
      );
    } else {
      finalDocumentNo = `${newCurrentDate.replace(
        newCurrentDate.substring(0, 1),
        method
      )}-01`;
    }
    res.send(finalDocumentNo);
  });
});

router.get("/check/exist_documentno", (req, res) => {
  let selectedDate = req.query.selectedDate;
  let scheduleDate = [];

  RulebookSchedule.get("830c03b52f66bcbf802b89713d45d23b").then((body) => {
    scheduleDate = body.schedules[req.query.year];
    let newDocumentNo = "";
    let counter = 0;
    let quarter = Object.keys(scheduleDate);

    quarter.map((rec) => {
      if (counter == 0) {
        if (scheduleDate[rec][0] >= selectedDate) {
          counter = 1;
          newDocumentNo = scheduleDate[rec][1];
        }
      }
    });
    if (newDocumentNo) {
      newDocumentNo = moment(newDocumentNo).format("YYMMDD");
      res.send(newDocumentNo);
    } else {
      res.send("Schedule does not exist");
    }
  });
});

router.get("/get/japanese_incharge", (req, res) => {
  let DatabaseView = null;

  DatabaseView = RuleBookBefore.view("rulebook_initial_view", "document_view");

  DatabaseView.then((body) => {
    let newBody = body.rows
      .map((rec) => {
        return rec.value;
      })
      .filter((rec) => {
        return !rec.obsolete && rec.personInCharge;
      })

      .map((rec) => {
        return rec.personInCharge;
      });

    uniqueArray = newBody.filter(function (item, pos) {
      return newBody.indexOf(item) == pos;
    });

    res.send(uniqueArray);
  });
});

router.get("/get/final_documents", (req, res) => {
  let keyValue;
  if (req.query.status == "approved") {
    keyValue = true;
  } else if (req.query.status == "for approval") {
    keyValue = false;
  } else keyValue = req.query.status;
  RulebookFInalData.view("delo", "allrecord-title", {
    key: keyValue,
    include_docs: true,
  }).then((body) => {
    let temp = body.rows
      .map((a) => a.doc)
      .filter((rec) => {
        return !rec.obsolete;
      });
    let toSend = temp.map((b) => {
      return {
        _id: b._id,
        title: b.data[b.version - 1].RuleKenmei,
        // remarks: b.approvalRemarks,
      };
    });
    res.send(toSend);
  });
});

router.get("/generate/initial_documentno", (req, res) => {
  RuleBookBefore.view("rulebook_initial_view", "checkExists_view", {
    key: req.query.person,
  }).then((body) => {
    let documentNo = "";
    let date = req.query.date;
    if (body.rows.length > 0) {
      let toSend = body.rows

        .map((r) => {
          return r.value.slice(-9);
        })
        .filter((rec) => {
          return rec.substring(0, 6) == date;
        });
      let num = 0;
      if (toSend.length > 0) {
        num = parseInt(toSend[toSend.length - 1].substring(7, 9)) + 1;
        if (num >= 1) {
          if (num < 10) {
            num = `0${num}`;
          }
          documentNo = `${req.query.person}-${date}-${num}`;
        }
      } else {
        documentNo = `${req.query.person}-${date}-01`;
      }
      res.send(documentNo);
    } else {
      documentNo = `${req.query.person}-${date}-01`;
      res.send(documentNo);
    }
  });
});

router.post("/create/new_document/:id", (req, res) => {
  let toInsert = {
    _id: `${req.params.id}`,
    version: 1,
    updated: false,
    data: [
      {
        SeihinKubun: "",
        KanriBangou: `${req.params.id}`,
        RuleKenmei: `○○○○○○○○○○`,
        Kubun: "ルール",
        YumeNoIe: false,
        Ippan: false,
        G: false,
        F: false,
        A: false,
        B: false,
        "F2-TD": false,
        Icube: false,
        Ismart: false,
        Ismile: false,
        Taishin: false,
        Menshin: false,
        Tantou: "",
        MailAddress: "",
        TantouBusho: "",
        TekiyouKubun: "",
        UpdatedDate: "",
        personInCharge: req.query.person,

        content: [
          `&nbsp; &nbsp; 1. <span style="font-size: 18px;">○○○○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;① <span style="font-size: 17px;">○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 1) <span style="font-size: 17px;">○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2) <span style="font-size: 17px;">○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 3) <span style="font-size: 17px;">○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; a) <span style="font-size: 17px;">○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; b) <span style="font-size: 17px;">○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; c) <span style="font-size: 17px;">○○○○○○○</span>
          <br>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; ② ○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 1) <span style="font-size: 17px;">○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2) <span style="font-size: 17px;">○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 3) <span style="font-size: 17px;">○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; a) <span style="font-size: 17px;">○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; b) <span style="font-size: 17px;">○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; c) <span style="font-size: 17px;">○○○○○○○</span>
          <br>
          <br>&nbsp; &nbsp; 2. ○○○○○○○○○○
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ① <span style="font-size: 17px;">○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 1) <span style="font-size: 17px;">○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2) <span style="font-size: 17px;">○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 3) <span style="font-size: 17px;">○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; a) <span style="font-size: 17px;">○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; b) <span style="font-size: 17px;">○○○○○○○</span>
          <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; c) <span style="font-size: 17px;">○○○○○○○</span>
          
`,
        ],
      },
    ],
    documentType: "RULEBOOK",
    isApproved: "temporary",
    scheduleDate: [req.query.date],
    UpdatedBy: req.query.updatedby,
  };

  RuleBookBefore.insert(toInsert)
    .then(() => {
      res.send("Success!");
    })
    .catch((err) => {
      console.log("ERROR", err.message);
      res.send("Already exist");
    });
});

router.get("/get/edit_document/:value/:kind", (req, res) => {
  let val = req.params.value;
  let kind = req.params.kind;
  let myDatabase = null;

  if (kind == "Before") {
    myDatabase = RuleBookBefore;
  } else if (kind == "After") {
    myDatabase = RuleBookAfter;
  } else if (kind == "ToUpdate") {
    myDatabase = RuleBookToUpdate;
  } else {
    myDatabase = RulebookFInalData;
  }

  myDatabase
    .get(val)
    .then((body) => {
      res.send(body);
    })
    .catch((err) => {
      // console.log('Error',err)
      console.log("error", val, kind);
    });
});

router.get("/get/rulebook_finaldata", (req, res) => {
  // let key = req.query.key;
  // let limit = req.query.limit;
  // let skip = req.query.skip;

  let params = {
    include_docs: true,
  };

  // if (key) {
  //   params.key = key;
  // }
  // if (limit) {
  //   params.limit = parseInt(limit);
  // }
  // if (skip) {
  //   params.skip = parseInt(skip);
  // }

  RulebookFInalData.view("delo", "list-rule", params).then((body) => {
    let toSend = [];
    toSend = body.rows.map((item) => item.value);
    // var br = new RegExp("<br>", "g");
    toSend = toSend.map((rec) => {
      rec.title = rec.title.replace(/<\/?[^>]+(>|$)/g, "");

      // rec.title = rec.title.replace(br, function (str) {
      //   return "";
      // });
      // let index = rec.title.indexOf("、");
      // if (index != -1) {
      //   rec.title = rec.title.substring(0, index);
      // }
      if (!rec.countViews) {
        rec.countViews = 0;
      }
      if (!rec.countFavorites) {
        rec.countFavorites = 0;
      }

      return rec;
    });

    res.send({
      toSend: toSend.sort((a, b) => (a.countViews < b.countViews ? 1 : -1)),
      // total_rows: body.total_rows,
    });
  });
});

router.post("/update/obsolete", (req, res) => {
  let idRecord = req.query.ID;
  RulebookFInalData.get(idRecord).then((body) => {
    body.obsolete = true;
    body.obsoleteReason = req.query.reason;
    RulebookFInalData.insert(body).then((body2) => {
      res.send(body2);
    });
  });
});

router.post("/add/view_count/:val", (req, res) => {
  let val = req.params.val;
  RulebookFInalData.get(val).then((body) => {
    if (body.countViews) {
      body.countViews = body.countViews + 1;
    } else body.countViews = 1;

    RulebookFInalData.insert(body);
    res.send("k");
  });
});

router.post("/transfer_document", (req, res) => {
  let newApproverData = {};
  newApproverData.name = req.body.approver.name;
  newApproverData.updatedDate = req.body.approver.updatedDate;

  let myDatabase = null;
  if (req.query.transferCondition == "Before") {
    myDatabase = RuleBookBefore;
  } else if (req.query.transferCondition == "After") {
    myDatabase = RuleBookAfter;
  } else if (req.query.transferCondition == "ToUpdate") {
    myDatabase = RuleBookToUpdate;
  } else {
    myDatabase = RulebookFInalData;
  }

  myDatabase.get(req.body._id).then((body) => {
    let beforeBody = Object.assign({}, body);
    let afterBody = Object.assign({}, body);
    let toUpdateBody = Object.assign({}, body);

    if (req.query.transferCondition == "Before") {
      beforeBody.forCheckingBeforeTheMeeting = false;
      beforeBody.alreadyInAfter = true;
      RuleBookBefore.insert(beforeBody);

      RuleBookAfter.get(req.body._id)
        .then((initial) => {
          RuleBookAfter.destroy(initial._id, initial._rev).then(() => {
            delete body._rev;
            RuleBookAfter.insert(body).then(() => {
              res.send("ok");
            });
          });
        })
        .catch(() => {
          delete body._rev;
          RuleBookAfter.insert(body).then(() => {
            res.send("ok");
          });
        });
    }

    if (req.query.transferCondition == "After") {
      afterBody.forCheckingAfterTheMeeting = false;
      afterBody.alreadyInToUpdate = true;
      RuleBookAfter.insert(afterBody);

      if (!body.isRevised && body._id.length != 9) {
        body._id = req.query.newFinalDocumentNo;
      }

      RuleBookToUpdate.get(req.body._id)
        .then((toUpdate) => {
          RuleBookToUpdate.destroy(toUpdate._id, toUpdate._rev).then(() => {
            delete body._rev;
            RuleBookToUpdate.insert(body).then(() => {
              res.send("ok");
            });
          });
        })
        .catch(() => {
          delete body._rev;
          RuleBookToUpdate.insert(body).then(() => {
            res.send("ok");
          });
        });
    }

    if (req.query.transferCondition == "ToUpdate") {
      toUpdateBody.alreadyInFinal = true;
      RuleBookToUpdate.insert(toUpdateBody);

      RulebookFInalData.get(req.body._id)
        .then((final) => {
          RulebookFInalData.destroy(final._id, final._rev).then(() => {
            delete body._rev;
            RulebookFInalData.insert(body).then(() => {
              res.send("ok");
            });
          });
        })
        .catch(() => {
          delete body._rev;
          RulebookFInalData.insert(body).then(() => {
            res.send("ok");
          });
        });
    }
  });
});

router.get("/get/rulebook_documents", (req, res) => {
  let Database = null;
  if (req.query.kind == "Before") {
    Database = RuleBookBefore.view("rulebook_initial_view", "initialDoc_view");
  } else if (req.query.kind == "After") {
    Database = RuleBookAfter.view("rulebook-view", "rulebook-afterthemeeting");
  } else if (req.query.kind == "ToUpdate") {
    Database = RuleBookToUpdate.view("rulebook-view", "rulebook-toUpdate");
  } else {
    Database = RulebookFInalData.view("delo", "finalDoc_view");
  }

  Database.then((body) => {
    let scheduleDate = {};
    let FirstQuarter = [];
    let SecondQuarter = [];
    let ThirdQuarter = [];
    let FourthQuarter = [];
    let FifthQuarter = [];
    RulebookSchedule.get("830c03b52f66bcbf802b89713d45d23b").then((body2) => {
      scheduleDate = body2.schedules[req.query.year];

      let newBody = body.rows
        .map((rec) => {
          return rec.value;
        })
        .filter((rec) => {
          return rec.documentType == "RULEBOOK";
        })

        .map((rec) => {
          return {
            _id: rec._id,
            isApproved: rec.isApproved,
            RulebookUpdatedDate: rec.RulebookUpdatedDate,
            scheduleDate: rec.scheduleDate,
            title: rec.data[rec.version - 1].RuleKenmei.replace(/<br>/gi, "\n"),
            personInCharge: rec.data[rec.version - 1].personInCharge,
            alreadyInAfter: rec.alreadyInAfter,
            alreadyInToUpdate: rec.alreadyInToUpdate,
            alreadyInFinal: rec.alreadyInFinal,
            forCheckingBeforeTheMeeting: rec.forCheckingBeforeTheMeeting,
            forCheckingAfterTheMeeting: rec.forCheckingAfterTheMeeting,
          };
        })
        .filter((rec) => {
          return rec.scheduleDate;
        });

      if (scheduleDate.First) {
        FirstQuarter = newBody.filter((rec) => {
          return (
            rec.scheduleDate.length != 3 &&
            rec.scheduleDate.includes(scheduleDate.First[0])
          );
        });
        FirstQuarter.map((rec) => {
          return (rec.scheduleDate = scheduleDate.First);
        });
      }

      if (scheduleDate.Second) {
        SecondQuarter = newBody.filter((rec) => {
          return (
            rec.scheduleDate.length != 3 &&
            rec.scheduleDate.includes(scheduleDate.Second[0])
          );
        });
        SecondQuarter.map((rec) => {
          return (rec.scheduleDate = scheduleDate.Second);
        });
      }

      if (scheduleDate.Third) {
        ThirdQuarter = newBody.filter((rec) => {
          return (
            rec.scheduleDate.length != 3 &&
            rec.scheduleDate.includes(scheduleDate.Third[0])
          );
        });
        ThirdQuarter.map((rec) => {
          return (rec.scheduleDate = scheduleDate.Third);
        });
      }

      if (scheduleDate.Fourth) {
        FourthQuarter = newBody.filter((rec) => {
          return (
            rec.scheduleDate.length != 3 &&
            rec.scheduleDate.includes(scheduleDate.Fourth[0])
          );
        });
        FourthQuarter.map((rec) => {
          return (rec.scheduleDate = scheduleDate.Fourth);
        });
      }

      if (scheduleDate.Fifth) {
        FifthQuarter = newBody.filter((rec) => {
          return (
            rec.scheduleDate.length != 3 &&
            rec.scheduleDate.includes(scheduleDate.Fifth[0])
          );
        });
        FifthQuarter.map((rec) => {
          return (rec.scheduleDate = scheduleDate.Fifth);
        });
      }

      let allQuarter = {
        FirstQuarter: FirstQuarter,
        SecondQuarter: SecondQuarter,
        ThirdQuarter: ThirdQuarter,
        FourthQuarter: FourthQuarter,
        FifthQuarter: FifthQuarter,
      };
      res.send(allQuarter);
    });
  });
});

router.post("/update_document/:documentID/:kind", (req, res) => {
  let val = req.params.documentID;
  let kind = req.params.kind;

  let myData = req.body.data[req.body.version - 1];
  myData.RuleKenmei = myData.RuleKenmei.replace(/\n/gi, "<br>");
  myData.UpdatedDate = moment().format("YYYY-MM-DD hh:mm:ss");

  let Database = null;
  if (kind == "Before") {
    Database = RuleBookBefore;
  } else if (kind == "After") {
    Database = RuleBookAfter;
  } else if (kind == "ToUpdate") {
    Database = RuleBookToUpdate;
  } else {
    Database = RulebookFInalData;
  }

  Database.get(val).then((body) => {
    body.updated = true;
    body.method = req.body.method;
    body.criteria = req.body.criteria;
    body.productType = req.body.productType;
    body.RulebookUpdatedDate = req.body.RulebookUpdatedDate;
    body.UpdatedBy = req.query.updatedby;
    // body.isApproved = "temporary";
    body.data[body.version - 1] = myData;
    Database.insert(body);
    res.send("ok");
  });
});

router.get("/get/obsoletes", (req, res) => {
  RulebookFInalData.view("delo", "obsolete-view", {
    include_docs: true,
  }).then((body) => {
    let temp = body.rows.map((a) => a.doc);
    // .filter((rec) => {
    //   return rec.obsolete;
    // });
    let toSend = temp.map((data) => {
      return {
        _id: data._id,
        title: data.data[data.version - 1].RuleKenmei,
        obsoleteReason: data.obsoleteReason,
      };
    });

    res.send(toSend);
  });
});

router.post("/add/revision_reason/:reason/:id/:incharge", (req, res) => {
  let reason = req.params.reason;
  let id = req.params.id;
  let incharge = req.params.incharge;

  RulebookFInalData.get(id).then((body) => {
    let newData = Object.assign({}, body.data[body.version - 1]);
    newData.ApprovalRemarks = reason;
    // newData.isRevise = false;
    newData.personInCharge = incharge;

    if (!body.isRevised) {
      delete body._rev;
    }

    body.data.push(newData);
    body.isApproved = "temporary";
    body.version = body.version + 1;
    body.approvalRemarks = reason;
    body.scheduleDate = [req.query.date];
    // body.scheduleDate = ["2021-01-14"];
    body.isRevised = true;
    body.alreadyInAfter = false;
    body.alreadyInToUpdate = false;
    body.alreadyInFinal = false;
    body.forCheckingBeforeTheMeeting = false;
    body.forCheckingAfterTheMeeting = false;
    body.UpdatedBy = req.query.updatedby;

    RuleBookBefore.get(id)
      .then((initial) => {
        RuleBookBefore.destroy(initial._id, initial._rev).then(() => {
          delete body._rev;
          RuleBookBefore.insert(body);
        });
      })
      .catch(() => {
        delete body._rev;
        RuleBookBefore.insert(body);
      });
  });

  res.send("okie");
});

router.post("/confirm_document", (req, res) => {
  let newApproverData = {};
  newApproverData.name = req.body.approver.name;
  newApproverData.updatedDate = req.body.approver.updatedDate;

  RuleBookToUpdate.get(req.body._id).then((body) => {
    let toUpdateBody = Object.assign({}, body);
    toUpdateBody.alreadyInFinal = true;
    RuleBookToUpdate.insert(toUpdateBody);

    body.approver = [];
    body.approver.push(newApproverData);
    body.isApproved = true;
    if (req.body.approvalRemarks) {
      body.approvalRemarks = req.body.approvalRemarks;
    }

    RulebookFInalData.get(req.body._id)
      .then((final) => {
        RulebookFInalData.destroy(final._id, final._rev).then(() => {
          delete body._rev;
          RulebookFInalData.insert(body);
        });
      })
      .catch(() => {
        delete body._rev;
        RulebookFInalData.insert(body);
      });
  });
  res.send("ok");
});

const insertData = (documents, approver, remarks) => {
  for (const docs of documents) {
    console.log(docs);
    RuleBookToUpdate.get(docs).then((body) => {
      let toUpdateBody = Object.assign({}, body);
      toUpdateBody.alreadyInFinal = true;
      RuleBookToUpdate.insert(toUpdateBody);

      body.approver = [];
      body.approver.push(approver);
      body.isApproved = true;
      if (remarks) {
        body.approvalRemarks = remarks;
      }

      RulebookFInalData.get(docs)
        .then((final) => {
          RulebookFInalData.destroy(final._id, final._rev).then(() => {
            delete body._rev;
            RulebookFInalData.insert(body);
          });
        })
        .catch(() => {
          delete body._rev;
          RulebookFInalData.insert(body);
        });
    });
  }
};

router.post("/confirm_bulk_document", async (req, res) => {
  let newApproverData = {};
  newApproverData.name = req.body.approver.name;
  newApproverData.updatedDate = req.body.approver.updatedDate;
  let documents = req.body.documentID;
  let remarks = req.body.approvalRemarks;

  await insertData(documents, newApproverData, remarks);
  console.log("okk");
  res.send("ok");
});

module.exports = router;
