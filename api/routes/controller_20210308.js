const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const moment = require("moment");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const mssql = require("mssql");
// const nodemailer = require("nodemailer");

const nano = require("nano")("http://root:admin@10.168.64.31:5984");
const RuleBook2 = nano.db.use("rulebookv2");

const RuleBook = nano.db.use("rulebook");
const RuleBookAfter = nano.db.use("rulebook_afterthemeeting");
const RuleBookToUpdate = nano.db.use("rulebook_toupdate");

const RuleBookInitial = nano.db.use("rulebookv2_initial");
const FroalaEditor = require("wysiwyg-editor-node-sdk");
const e = require("express");
const { count } = require("console");
// const e = require("express");
// const { Console } = require("console");

router.use(cors()); //Cross-Origin Resource Sharing (CORS)
router.use(bodyParser.urlencoded({ limit: "1000mb", extended: false }));
router.use(
  bodyParser.json({
    limit: "1000mb",
  })
);

var knex_mysql_Rulebook = require("knex")({
  client: "mysql",
  connection: {
    host: "10.169.141.8",
    user: "testuser",
    password: "smdasg",
    database: "Rulebook",
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
      idleTimeoutMillis: 300000,
      max: 100,
    },
  },
});

router.get("/get/content_incharge", (req, res) => {
  let sql = `SELECT A.DocumentNo, A.CheckerCode,B.CheckerName, A.DepartmentCode, C.DepartmentName, A.SeqNo, A.Content FROM t_InCharge A
  INNER JOIN m_Checker B ON A.CheckerCode = B.CheckerCode
  INNER JOIN m_Department C ON A.DepartmentCode = C.DepartmentCode
  WHERE A.DocumentNo ='${req.query.DocumentNo}'`;
  knex_mysql_Rulebook.raw(sql).then((data) => {
    res.send(data[0]);
  });
});

router.get("/get/content_incharge/checker", (req, res) => {
  let sql = `SELECT * FROM m_Checker `;
  knex_mysql_Rulebook.raw(sql).then((data) => {
    res.send(data[0]);
  });
});

router.get("/get/content_incharge/department", (req, res) => {
  let sql = `SELECT * FROM m_Department `;
  knex_mysql_Rulebook.raw(sql).then((data) => {
    res.send(data[0]);
  });
});

router.post("/delete/content_incharge", (req, res) => {
  let sql = `DELETE FROM Rulebook.t_InCharge
WHERE DocumentNo = '${req.query.DocumentNo}' AND CheckerCode = ${req.query.CheckerCode} AND DepartmentCode = ${req.query.DepartmentCode} AND SeqNo = ${req.query.SeqNo};`;
  knex_mysql_Rulebook.raw(sql).then(() => {
    res.send("Deleted!");
  });
});

router.post(`/add/content_incharge`, (req, res) => {
  let sql = `CALL Rulebook.RulebookInCharge_procedure ('${req.body.DocumentNo}', ${req.body.CheckerCode}, ${req.body.DepartmentCode}, '${req.body.Content}', '${req.body.UpdatedBy}');`;
  knex_mysql_Rulebook.raw(sql).then(() => {
    res.send("okie");
  });
});

router.post("/update/content_incharge_setting", (req, res) => {
  let sql = `CALL Rulebook.RulebookMaintenance_procedure ('${req.body.CheckerOrDepartment}', ${req.body.IsInsert}, ${req.body.UpdateCondition}, ${req.body.CheckerCode},
 '${req.body.CheckerName}', ${req.body.DepartmentCode}, '${req.body.DepartmentName}', '${req.body.UpdatedBy}');`;
  knex_mysql_Rulebook.raw(sql).then(() => {
    res.send("okie");
  });
});

router.get("/get/maintenance/personincharge", (req, res) => {
  let sql = `SELECT * FROM m_personInCharge`;
  knex_mysql_Rulebook.raw(sql).then((data) => {
    res.send(data[0]);
  });
});

router.post("/add/maintenance/personincharge", (req, res) => {
  let sql = `CALL Rulebook.RulebookPersonInCharge_procedure (${req.body.IsInsert}, ${req.body.UpdateCondition}, '${req.body.EmployeeCode}', '${req.body.EmployeeNameJap}',
 '${req.body.EmployeeNameEng}','${req.body.EmailAddress}', '${req.body.UpdatedBy}');`;

  knex_mysql_Rulebook.raw(sql).then((data) => {
    // console.log(data[0][0][0])
    res.send(data[0]);
  });
});

router.post(`/add/content_remarks`, (req, res) => {
  let sql = `CALL Rulebook.RulebookRemarks_procedure ('${req.body.DocumentNo}','${req.body.Content}', '${req.body.UpdatedBy}');`;
  knex_mysql_Rulebook.raw(sql).then(() => {
    res.send("okie");
  });
});

router.post(`/add/content_remarks/remarks`, (req, res) => {
  let sql = `UPDATE Rulebook.t_Remarks
  SET Remarks = '${req.query.Remarks}'
  WHERE DocumentNo = '${req.query.DocumentNo}' AND SeqNo = ${req.query.SeqNo} `;
  knex_mysql_Rulebook.raw(sql).then(() => {
    res.send("okie");
  });
});

router.get("/get/content_remarks", (req, res) => {
  let sql = `SELECT * FROM t_Remarks WHERE DocumentNo = '${req.query.DocumentNo}'`;
  knex_mysql_Rulebook.raw(sql).then((data) => {
    res.send(data[0]);
  });
});

router.post("/delete/content_remarks", (req, res) => {
  let sql = `DELETE FROM t_Remarks WHERE DocumentNo = '${req.query.DocumentNo}' AND SeqNo = ${req.query.SeqNo}`;
  knex_mysql_Rulebook.raw(sql).then((data) => {
    res.send(data[0]);
  });
});

router.post("/delete/content_remarks", (req, res) => {
  let sql = `DELETE FROM t_Remarks WHERE DocumentNo = '${req.query.DocumentNo}' AND SeqNo = ${req.query.SeqNo}`;
  knex_mysql_Rulebook.raw(sql).then((data) => {
    res.send(data[0]);
  });
});

router.post("/add/document_notification", (req, res) => {
  let forChecking = null;
  if (req.query.forChecking == "TRUE") {
    forChecking = true;
  } else if (req.query.forChecking == "FALSE") {
    forChecking = false;
  } else {
    forChecking = "APPROVED";
  }
  let Database = null;
  if (req.query.kind == "Before") {
    Database = RuleBookInitial;
  } else {
    Database = RuleBookAfter;
  }

  Database.get(req.query.documentID).then((body) => {
    if (req.query.kind == "Before") {
      body.forCheckingBeforeTheMeeting = forChecking;
    } else {
      body.forCheckingAfterTheMeeting = forChecking;
    }

    Database.insert(body);
    res.send("okie");
  });
});





router.get("/get/personincharge_notifcation", (req, res) => {
  let counter = {};

  RuleBookInitial.view("rulebook_initial_view", "initialDoc_view").then(
    (body) => {
      let newBody = body.rows
        .map((rec) => {
          return rec;
        })
        .map((rec) => {
          return rec.value;
        })
        .filter((rec) => {
          if (rec.forCheckingBeforeTheMeeting) {
            return (rec.forCheckingBeforeTheMeeting = true);
          } 
            else {
              return;
            }
        })
        .map((rec) => {
          
          return rec.data;
        })

        .map((rec) => {
          return rec[rec.length-1].personInCharge;
        })
        .filter(rec => {
          return rec
        })
        .filter((rec) => {
          return rec == req.query.personincharge;
        });
    
      counter.Before = newBody.length;

      RuleBookAfter.view("rulebook-view", "rulebook-afterthemeeting").then(
        (body2) => {
          let newBody2 = body2.rows
            .map((rec) => {
              return rec;
            })
            .map((rec) => {
              return rec.value;
            })
            .filter((rec) => {
              if (rec.forCheckingAfterTheMeeting) {
                return (rec.forCheckingAfterTheMeeting = true);
              } else {
                return;
              }
            })
            .map((rec) => {
              return rec.data;
            })
          
            .map((rec) => {
              return rec[rec.length-1].personInCharge;
            })
            .filter((rec) => {
              return rec == req.query.personincharge;
            });

          counter.After = newBody2.length;
          res.send(counter);
        }
      );
    }
  );
});

// router.post("/sendEmail", (req, res) => {
//   const transporter = nodemailer.createTransport({
//     host: "HRDSMTP",
//     port: 25,
//     use_authentication: false,
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });
//   var mailOptions = {
//     from: "Rulebook System Feedback <rulebook-feedback@hrd-s.com>",
//     to: "rulebook-feedback@hrd-s.com", //on multiple recipient, just separated it by adding comma ,())
//     subject: "Rulebook Feedback",
//     // text: req.body.body
//     html: `<p>Feedback From : ${req.body.name}(${req.body.from}) </p>
//              <h4>${req.body.requestType} </h4>
//              <h2>${req.body.title}</h2>
//              <a href="https://rulebook.hrd-s.com/feedback"> https://rulebook.hrd-s.com/feedback </a>
//              `,
//   };
//   // console.log(mailOptions)
//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//       res.send(error);
//     } else {
//       console.log("Message sent: " + info.response);
//       res.send("Message sent: " + info.response);
//     }
//     // res.send(mailOptions)
//   });
// });

router.get("/", (req, res) => {
  res.send(":)");
});

router.post("/froalaRemove", function (req, res) {
  var a = _.replace(req.body.src, req.body.replace, "../rulebook/dist/");
  fsx.removeSync(a);
  res.send("Removed");
});

router.post("/upload_image", (req, res) => {
  FroalaEditor.Image.upload(req, "/upload_images/", function (err, data) {
    if (err) {
      return res.send(JSON.stringify(err));
    }
    res.send(data);
  });
});

router.get("/masterlist/id2/:id", (req, res) => {
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

router.get("/masterlist/selectUser", (req, res) => {
  const query = {
    selector: {
      department: {
        $eq: "RESEARCH AND DEVELOPMENT",
      },
    },
    fields: ["employee_code", "full_name"],
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
        RuleBook2.get("c018d2995f46c98ceacedaad0774499e").then((body2) => {
          let employeeCode = Object.keys(body2.listOfUsers);
          let isSend = [];
          isSend = employeeCode
            .map((rec) => {
              let toReturn = body2.listOfUsers[rec].filter((rec2) => {
                return rec2.scheduleDate == req.query.scheduledDate;
              });
              if (toReturn.length > 0) {
                return rec;
              }
            })
            .filter((r) => {
              return r != null;
            });
          body.docs.map((rec) => {
            rec.isDisable = false;
            rec.isSelect = false;
            if (isSend.includes(rec.employee_code)) {
              rec.isDisable = true;
              rec.isSelect = true;
            }
            return rec;
          });
          // res.send(isSend);
          // res.send(body2.listOfUsers)

          res.send(body.docs);
        });
      } else {
      }
    }
  );
});

router.get("/get/new_register_quarter", (req, res) => {
  //Array ==  0  => new document     ||   Array == 2  => Transfer from after the meeting to  ToUpdate

  let array = 0;
  if (req.query.beforeORtoUpdate == "before") {
    array = 0;
  } else {
    array = 2;
  }

  let dateToday = req.query.dateToday;
  scheduleDate = [];

  RuleBook2.get("830c03b52f66bcbf802b89713d45d23b").then((body) => {
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
      RuleBook.view("delo", "allrecord", {}).then((body2) => {
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

router.get("/checkexist/document", (req, res) => {
  RuleBook.view("delo", "allrecord", {}).then((body) => {
    let finalDocumentNo = "";
    let temp = body.rows
      .map((item) => item.value)
      .filter((rec) => {
        return (
          !rec.obsolete &&
          rec._id.substring(0, 6).includes(req.query.currentDate)
        );
      })
      .map((rec) => {
        return rec._id;
      });
    temp.sort();
    if (temp.length > 0) {
      let latestDocumentNo = temp[temp.length - 1];

      let newTemp = latestDocumentNo.substring(7, latestDocumentNo.length);
      let newTempNo = parseInt(newTemp) + 1;
      if (newTempNo.toString().length == 1) {
        newTempNo = `0${newTempNo}`;
      }
      finalDocumentNo = latestDocumentNo.substring(0, 6) + "-" + newTempNo;
    } else {
      finalDocumentNo = req.query.currentDate + "-" + "01";
    }

    res.send(finalDocumentNo);
  });
});

router.get("/get/personincharge", (req, res) => {
  let DatabaseView = null;

  DatabaseView = RuleBookInitial.view("rulebook_initial_view", "document_view");

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

router.get("/get/before_and_after_the_meeting", (req, res) => {
  let Database = null;
  if (req.query.kind == "Before") {
    Database = RuleBookInitial.view("rulebook_initial_view", "initialDoc_view");
  } else if (req.query.kind == "After") {
    Database = RuleBookAfter.view("rulebook-view", "rulebook-afterthemeeting");
  } else if (req.query.kind == "ToUpdate") {
    Database = RuleBookToUpdate.view("rulebook-view", "rulebook-toUpdate");
  } else {
    Database = RuleBook.view("delo", "finalDoc_view");
  }

  Database.then((body) => {
    let scheduleDate = {};
    let FirstQuarter = [];
    let SecondQuarter = [];
    let ThirdQuarter = [];
    let FourthQuarter = [];
    let FifthQuarter = [];
    RuleBook2.get("830c03b52f66bcbf802b89713d45d23b").then((body2) => {
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

router.post("/post/update_documents/:documentID/:kind", (req, res) => {
  let val = req.params.documentID;
  let kind = req.params.kind;

  let myData = req.body.data[req.body.version - 1];
  myData.RuleKenmei = myData.RuleKenmei.replace(/\n/gi, "<br>");
  myData.UpdatedDate = moment().format("YYYY-MM-DD hh:mm:ss");

  let Database = null;
  if (kind == "Before") {
    Database = RuleBookInitial;
  } else if (kind == "After") {
    Database = RuleBookAfter;
  } else if (kind == "ToUpdate") {
    Database = RuleBookToUpdate;
  } else {
    Database = RuleBook;
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

router.get("/get/all/obsolete", (req, res) => {
  RuleBook.view("delo", "obsolete-view", {
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

// ============================= SCHEDULE =========================== //
router.get("/get/schedule", (req, res) => {
  RuleBook2.get("c018d2995f46c98ceacedaad075c7471").then((body) => {
    res.send(body);
  });
});

router.post("/add/schedule", (req, res) => {
  RuleBook2.get("c018d2995f46c98ceacedaad075c7471").then((body) => {
    let toInsert = [];
    for (let i = 0; i < 4; i++) {
      toInsert.push(null);
    }

    if (body.scheduleDate[req.body.scheduleDate]) {
      res.send("Schedule Exist");
    } else {
      body.scheduleDate[req.body.scheduleDate] = toInsert;
      RuleBook2.insert(body).then((body2) => {
        res.send(body2);
      });
    }
  });
});

router.post("/update/schedule", (req, res) => {
  RuleBook2.get("c018d2995f46c98ceacedaad075c7471").then((body) => {
    body.scheduleDate[req.query.year] = req.body.data;
    RuleBook2.insert(body).then((body2) => {
      res.send(body2);
    });
  });
});

// ======================= END =============================== //

// ======================= SCHEDULE 2 ======================= //
router.get("/get/year/schedules", (req, res) => {
  RuleBook2.get("830c03b52f66bcbf802b89713d45d23b").then((body) => {
    res.send(Object.keys(body.schedules));
  });
});

router.get("/get/schedules", (req, res) => {
  RuleBook2.get("830c03b52f66bcbf802b89713d45d23b").then((body) => {
    res.send(body.schedules[req.query.year]);
  });
});

router.get("/add/year/schedule", (req, res) => {
  RuleBook2.get("830c03b52f66bcbf802b89713d45d23b").then((body) => {
    if (!body.schedules[req.query.year]) {
      body.schedules[req.query.year] = {};
      RuleBook2.insert(body).then(() => {
        res.send("OK");
      });
    } else {
      res.send("Already exists!");
    }
  });
});

router.post("/update/schedules", (req, res) => {
  // console.log(req.body)

  RuleBook2.get("830c03b52f66bcbf802b89713d45d23b").then((body) => {
    body.schedules[req.query.year][req.body.quarter] = [];
    if (req.body.before) {
      body.schedules[req.query.year][req.body.quarter].push(req.body.before);
    }
    if (req.body.meeting) {
      body.schedules[req.query.year][req.body.quarter].push(req.body.meeting);
    }
    if (req.body.after) {
      body.schedules[req.query.year][req.body.quarter].push(req.body.after);
    }
    RuleBook2.insert(body).then(() => {
      res.send("OK");
    });
  });
});

// ===================== END ========================== //

//================== NOTIFICATION  FOR USERS SCHEDULE ============================ //
router.get("/get/notification", (req, res) => {
  RuleBook2.get("c018d2995f46c98ceacedaad0774499e").then((body) => {
    // console.log(body)
    if (body.listOfUsers[req.query.employee_code]) {
      let newBody = body.listOfUsers[req.query.employee_code].filter((rec) => {
        return !rec.isRead;
      });

      res.send(newBody);
    } else res.send("No data");
  });
});

router.post("/update/notification", (req, res) => {
  // req.query.index = 0
  RuleBook2.get("c018d2995f46c98ceacedaad0774499e").then((body) => {
    // console.log(body)
    let indexSchedule = -1;

    body.listOfUsers[req.query.employee_code].map((rec, index) => {
      if (rec.scheduleDate == req.query.scheduleDate) {
        indexSchedule = index;
      }
    });
    body.listOfUsers[req.query.employee_code][indexSchedule].isRead = true;
    RuleBook2.insert(body).then(() => {
      res.send("OK");
    });
    // console.log(body.listOfUsers[req.query.employee_code][indexSchedule])
  });
});

router.post("/add/notification", (req, res) => {
  RuleBook2.get("c018d2995f46c98ceacedaad0774499e").then((body) => {
    let toInsert = {};

    toInsert = [
      {
        title: "Date scheduled",
        scheduleDate: req.query.scheduleDate,
      },
    ];
    // console.log(Object.keys(body.listOfUsers));
    // console.log(body.listOfUsers[req.body[0].employee_code][0].scheduleDate)

    for (let i = 0; i < req.body.length; i++) {
      if (!body.listOfUsers[req.body[i].employee_code]) {
        body.listOfUsers[req.body[i].employee_code] = toInsert;
      } else {
        body.listOfUsers[req.body[i].employee_code].push(toInsert[0]);
      }
    }
    // console.log(body)
    RuleBook2.insert(body);
    res.send(req.body);
  });
});

//============================== END ====================================== //

//For Searching OR Condition
router.get("/get/title_rules", (req, res) => {
  RuleBook.view("delo", "new_title_content", {}).then((body) => {
    let search = [];
    if (req.query.search.includes("　")) {
      search = req.query.search.toUpperCase().replace(/\s+/g, " ").split(" ");
    } else {
      search = req.query.search.toUpperCase().replace(/\s+/g, " ").split(" ");
    }

    body.rows = body.rows.map((a) => a.value);
    let searchArr = search.map((searchKey) => {
      let temp = body.rows.filter((rec) => {
        if (rec.content) {
          let len = rec.content
            .map((rec) => {
              return `'${rec}'`;
            })
            .toString();
          return (
            rec.title.includes(searchKey) ||
            len
              .toString()
              .replace(/(<([^>]+)>)/gi, "")
              .includes(searchKey) ||
            rec._id.includes(searchKey)
          );
        }
      });
      return temp;
    });
    // console.log(searchArr)
    let toSend = searchArr.map((data) => {
      let content = data.filter(r => {
        if (req.query.except) {
          return !r.title.includes(req.query.except) && !r.content.toString().includes(req.query.except)
        }
        else return r
      }).map((rec) => {
        let str = rec.content.toString().replace(/(<([^>]+)>)/gi, "");
        let fStr = str.replace(/&nbsp;/gi, "");
        search.map((q) => {
          var re = new RegExp(q, "g");
          fStr = fStr.replace(re, function (str) {
            return `<span style="background-color:yellow"> <b> ${str} </b> </span>`;
          });
          let index = fStr.indexOf(`${q}`);
          fStr = fStr.substring(index - 50, fStr.length - 1);
          rec.title = rec.title.replace(re, function (str) {
            return `<b> ${str} </b>`;
          });
        });

        return {
          title: rec.title,
          _id: rec._id,
          content: fStr,
          YumeNoIe: rec.YumeNoIe,
          Ippan: rec.YumeNoIe,
          Icube: rec.Icube,
          Ismart: rec.Ismart,
          Taishin: rec.Taishin,
          Menshin: rec.Menshin,
          productType: rec.productType,
          method: rec.method,
          criteria: rec.criteria,
          RulebookUpdatedDate: rec.RulebookUpdatedDate,
          G: rec.G,
          F: rec.F,
          A: rec.A,
          B: rec.B,
          "F2-TD": rec["F2-TD"],
          Ismile: rec.Ismile,
          countViews: rec.countViews,
          countFavorites: rec.countFavorites,
        };
      });
      return content;
    });
    let content = [];
    for (let i = 0; i < toSend.length; i++) {
      for (let h = 0; h < toSend[i].length; h++) {
        content.push(toSend[i][h]);
      }
    }

    const uniqueElementsBy = (arr, fn) =>
      arr.reduce((acc, v) => {
        if (!acc.some((x) => fn(v, x))) acc.push(v);
        return acc;
      }, []);

    let x = uniqueElementsBy(content, (a, b) => a._id == b._id);

    var br = new RegExp("<br>", "g");
    x = x.map((rec) => {
      rec.title = rec.title.replace(br, function () {
        return "";
      });
      let index = rec.title.indexOf("、");
      if (index != -1) {
        rec.title = rec.title.substring(0, index);
      }
      return rec;
    });
    res.send(x);
  });
});

router.get("/get/classname", (req, res) => {
  let value = req.query.value;

  RuleBookInitial.view("rulebook_initial_view", "searchDocument", {
    key: value,
  }).then((body) => {
    let newBody = body.rows
      .map((rec) => {
        return rec.value;
      })
      .map((rec) => {
        return rec.data;
      });

    let test = '<h1 class="tae">abc</h1>';

    var allClasses = [];

    var allElements = body.querySelectorAll("*");
    for (var i = 0; i < allElements.length; i++) {
      var classes = allElements[i].className.toString().split(/\s+/);
      for (var j = 0; j < classes.length; j++) {
        var cls = classes[j];
        if (cls && allClasses.indexOf(cls) === -1) allClasses.push(cls);
      }
    }

    res.send(allClasses);
  });
});

//************************************************************************ */

//For Searching AND Condition
router.get("/get/title_rules/and", (req, res) => {
  RuleBook.view("delo", "new_title_content", {}).then((body) => {
    let search = [];

    if (req.query.search.includes("　")) {
      search = req.query.search.toUpperCase().replace(/\s+/g, " ").split(" ");
    } else {
      search = req.query.search.toUpperCase().replace(/\s+/g, " ").split(" ");
    }

    body.rows = body.rows.map((a) => a.value);

    let searchArr = search.map((searchKey) => {
      let temp = body.rows.filter((rec) => {
        if (rec.content) {
          let len = rec.content
            .map((rec) => {
              return `'${rec}'`;
            })
            .toString();
          return (
            rec.title.includes(searchKey) ||
            len
              .toString()
              .replace(/(<([^>]+)>)/gi, "")
              .includes(searchKey) ||
            rec._id.includes(searchKey)
          );
        }
      });
      return temp;
    });

    var result = searchArr.reduce((res, arr, index) => {
      arr.forEach(({ _id, value }) => {
        res[_id] = res[_id] || { occurrences: 0 };
        res[_id]["where"] = res[_id]["where"] || [];
        if (!res[_id]["where"].includes(index)) {
          res[_id].occurrences += 1;
        }
      });
      return res;
    }, {});

    searchArr.forEach((arr) =>
      arr.forEach((obj) => Object.assign(obj, result[obj._id]))
    );
    // console.log(req.query.except)
    let toSend = searchArr.map((data) => {
      let content = data.filter(r => {
        if (req.query.except) {
          return !r.title.includes(req.query.except) && !r.content.toString().includes(req.query.except)
        }
        else return r
      }).map((rec) => {
        let str = rec.content.toString().replace(/(<([^>]+)>)/gi, "");
        let fStr = str.replace(/&nbsp;/gi, "");

        search.map((q) => {
          var re = new RegExp(q, "i");
          fStr = fStr.replace(re, function (str) {
            return `<span style="background-color:yellow"> <b> ${str} </b> </span>`;
          });
          let index = fStr.indexOf(`${q}`);
          fStr = fStr.substring(index - 50, fStr.length - 1);
          rec.title = rec.title.replace(re, function (str) {
            return `<b> ${str} </b>`;
          });
        });

        return {
          title: rec.title,
          _id: rec._id,
          content: fStr,
          YumeNoIe: rec.YumeNoIe,
          Ippan: rec.YumeNoIe,
          Icube: rec.Icube,
          Ismart: rec.Ismart,
          Taishin: rec.Taishin,
          Menshin: rec.Menshin,
          productType: rec.productType,
          method: rec.method,
          criteria: rec.criteria,
          occurrences: rec.occurrences,
          RulebookUpdatedDate: rec.RulebookUpdatedDate,
          G: rec.G,
          F: rec.F,
          A: rec.A,
          B: rec.B,
          "F2-TD": rec["F2-TD"],
          Ismile: rec.Ismile,
          countViews: rec.countViews,
          countFavorites: rec.countFavorites,
        };
      });
      return content;
    });
    let content = [];
    for (let i = 0; i < toSend.length; i++) {
      for (let h = 0; h < toSend[i].length; h++) {
        if (toSend[i][h].occurrences >= toSend.length) {
          content.push(toSend[i][h]);
        }
      }
    }

    const uniqueElementsBy = (arr, fn) =>
      arr.reduce((acc, v) => {
        if (!acc.some((x) => fn(v, x))) acc.push(v);
        return acc;
      }, []);

    let x = uniqueElementsBy(content, (a, b) => a._id == b._id);
    var br = new RegExp("<br>", "g");
    x = x.map((rec) => {
      rec.title = rec.title.replace(br, function () {
        return "";
      });
      let index = rec.title.indexOf("、");
      if (index != -1) {
        rec.title = rec.title.substring(0, index);
      }
      return rec;
    });
    res.send(x);
  });
});
//******************************************************************* */

//For Searching MULTI Condition
router.get("/get/multiple_rules", async (req, res) => {
  let keywords = [];
  await RuleBook.get("6ae914f4049882f985bd8baf20ea5736").then((body) => {
    keywords = body.data
      .map((rec, index) => {
        if (rec.indexOf(req.query.search) >= 0) {
          return rec;
        }
      })
      .filter((rec) => {
        return rec != null;
      });
    if (keywords != undefined) {
      if (keywords.includes("")) {
        keywords = keywords.filter((rec) => {
          return rec != "";
        });
      }
    }
  });
  var merged = [].concat.apply([], keywords);
  if (merged.length > 0) {
    await RuleBook.view("delo", "new_title_content", {}).then((body) => {
      let search = merged;

      body.rows = body.rows.map((a) => a.value);
      let searchArr = search.map((searchKey) => {
        let temp = body.rows.filter((rec) => {
          if (rec.content) {
            let len = rec.content
              .map((rec) => {
                return `'${rec}'`;
              })
              .toString();
            return (
              rec.title.includes(searchKey) ||
              len
                .toString()
                .replace(/(<([^>]+)>)/gi, "")
                .includes(searchKey) ||
              rec._id.includes(searchKey)
            );
          }
        });
        return temp;
      });
      // console.log(req.query.except)
      let toSend = searchArr.map((data) => {
        let content = data.filter(r => {
          if (req.query.except) {
            return !r.title.includes(req.query.except) && !r.content.toString().includes(req.query.except)
          }
          else return r
        }).map((rec) => {
          let str = rec.content.toString().replace(/(<([^>]+)>)/gi, "");
          let fStr = str.replace(/&nbsp;/gi, "");
          search.map((q) => {
            var re = new RegExp(q, "g");
            fStr = fStr.replace(re, function (str) {
              return `<span style="background-color:yellow"> <b> ${str} </b> </span>`;
            });
            let index = fStr.indexOf(`${q}`);
            fStr = fStr.substring(index - 50, fStr.length - 1);
            rec.title = rec.title.replace(re, function (str) {
              return `<b> ${str} </b>`;
            });
          });

          return {
            title: rec.title,
            _id: rec._id,
            content: fStr,
            YumeNoIe: rec.YumeNoIe,
            Ippan: rec.YumeNoIe,
            Icube: rec.Icube,
            Ismart: rec.Ismart,
            Taishin: rec.Taishin,
            Menshin: rec.Menshin,
            productType: rec.productType,
            method: rec.method,
            criteria: rec.criteria,
            RulebookUpdatedDate: rec.RulebookUpdatedDate,
            G: rec.G,
            F: rec.F,
            A: rec.A,
            B: rec.B,
            "F2-TD": rec["F2-TD"],
            Ismile: rec.Ismile,
          };
        });
        return content;
      });
      let content = [];
      for (let i = 0; i < toSend.length; i++) {
        for (let h = 0; h < toSend[i].length; h++) {
          content.push(toSend[i][h]);
        }
      }

      const uniqueElementsBy = (arr, fn) =>
        arr.reduce((acc, v) => {
          if (!acc.some((x) => fn(v, x))) acc.push(v);
          return acc;
        }, []);

      let x = uniqueElementsBy(content, (a, b) => a._id == b._id);
      res.send(x);
    });
  } else res.send("No data in master");
});
//*************************************************************************** */

//For Link Vue with multiple highlight
router.get("/get/morethanthis/multiple/:value", (req, res) => {
  let val = req.params.value;

  let search = [];
  RuleBook.get("6ae914f4049882f985bd8baf20ea5736").then((body) => {
    search = body.data
      .map((rec, index) => {
        if (rec.indexOf(req.query.search) >= 0) {
          return rec;
        }
      })
      .filter((rec) => {
        return rec != null;
      });

    search = [].concat.apply([], search);
  });

  search = search.map((r) => {
    if (!r.match(/\-/gi) >= 0) {
      return r;
    } else return {};
  });

  RuleBook.get(val).then((body) => {
    let doc = body.data[body.version - 1].content;
    let title = body.data[body.version - 1].RuleKenmei;
    for (let i = 0; i < doc.length; i++) {
      for (let j = 0; j < search.length; j++) {
        var re = new RegExp(search[j], "g");
        if (doc[i].includes(search[j])) {
          doc[i] = doc[i].replace(re, function (str) {
            if (str.match(/(<([^>]+)>)/g, "") >= 0) {
              return `<span style="background-color:#05e6ff"> ${str} </span>`;
            } else return str;
          });
        }
      }
    }

    body.data[body.version - 1].content = doc;
    body.data[body.version - 1].RuleKenmei = title;

    for (let i = 0; i < body.data[body.version - 1].content.length; i++) {
      var pdfURL = new RegExp("http://hrdapps48", "g");
      body.data[body.data.length - 1].content[i] = body.data[
        body.data.length - 1
      ].content[i]
        .toString()
        .replace(pdfURL, function (str) {
          return `${str}.hrd-s.com`;
        });
      var re2 = new RegExp("</a>", "g");
      body.data[body.version - 1].content[i] = body.data[
        body.version - 1
      ].content[i].replace(re2, function (str) {
        let index = body.data[body.version - 1].content[i].indexOf(
          str
        );
        if (body.data[body.version - 1].content[i][index - 6].match(/#/g) || body.data[body.version - 1].content[i][index - 19].match(/#/g)) {
          return str
        }
        else if (
          body.data[body.version - 1].content[i][index - 8].match(
            /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/gi
          ) == null
        )
          return `<i class="small mdi mdi-file-document" style="color:red;background-color:white;"></i> ${str}  `;
        else {
          return `<i class="small mdi mdi-link" style="color:green;background-color:white;"></i> ${str}  `;
        }
      });
      let changeLinkPDF = new RegExp("http://10.168.64.159:6660/newPage", "g")
      body.data[body.version - 1].content[i] = body.data[
        body.version - 1
      ].content[i].replace(changeLinkPDF, "http://10.168.64.159:2929/document")
    }

    res.send(body);
  });
});
//************************************************* */

//For Approval and Link Vue
// ****   ** ******  **          **    ********            ********
// **  ** ** **       **         **       **       **      **     *
// **   **** *****     **  **   **        **      ** **    ********
// **     ** **         **** ****         **     ******    **    **
// **     ** ******     **     **         **   **     **   *******
router.get("/get/final/:value", (req, res) => {
  let val = req.params.value;

  RuleBook.view("delo", "searchDocument", {
    include_docs: true,
    key: val,
  }).then((body) => {
    let toSend = body.rows.map((r) => r.value);
    for (
      let i = 0;
      i < toSend[0].data[toSend[0].version - 1].content.length;
      i++
    ) {
      toSend[0].data[toSend[0].version - 1].content[
        i
      ] = `<head> <div id="p${i + 1}"></div><head>   <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet"> </head> <div style="page-break-before:always"></div> ${toSend[0].data[toSend[0].version - 1].content[i]
        }`;

      var re2 = new RegExp("</a>", "gi");
      toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
        toSend[0].version - 1
      ].content[i].replace(re2,
        function (str) {
          let index = toSend[0].data[toSend[0].version - 1].content[i].indexOf(
            str
          );
          if (toSend[0].data[toSend[0].version - 1].content[i][index - 6].match(/#/g) || toSend[0].data[toSend[0].version - 1].content[i][index - 19].match(/#/g)) {
            return str
          }
          else if (
            toSend[0].data[toSend[0].version - 1].content[i][index - 8].match(
              /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/gi
            ) == null
          )
            return `<i class="small mdi mdi-file-document" style="color:red;background-color:white;"></i> ${str}  `;
          else {
            return `<i class="small mdi mdi-link" style="color:green;background-color:white;"></i> ${str}  `;
          }
        });


      let findXLS = new RegExp(".xls", "g");
      if (
        toSend[0].data[toSend[0].version - 1].content[i].match(findXLS) != null
      ) {
        let findLink = new RegExp(
          `href="http://hrdapps48:3001/ftp/rule_book/`,
          "g"
        );
        let indicesLink = [];
        let indicesXLS = [];
        let result = "";
        while (
          (result = findLink.exec(
            toSend[0].data[toSend[0].version - 1].content[i]
          ))
        ) {
          indicesLink.push(result.index);
        }

        while (
          (result = findXLS.exec(
            toSend[0].data[toSend[0].version - 1].content[i]
          ))
        ) {
          indicesXLS.push(result.index);
        }
        // console.log({ ftp: indicesLink, filename: indicesXLS })
        for (let j = 0; j < indicesLink.length; j++) {
          let sjisArray = decodeURI(
            toSend[0].data[toSend[0].version - 1].content[i].substring(
              indicesLink[j] + 42,
              indicesXLS[j]
            )
          );

          // console.log(sjisArray);
        }
      }

      var pdfURL = new RegExp("hrdapps48", "gi");
      toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
        toSend[0].version - 1
      ].content[i].replace(pdfURL, function (str) {
        return `${str}.hrd-s.com`;
      });

      var changeLinkPDF = new RegExp("http://10.168.64.159.6660/newPage")
      toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
        toSend[0].version - 1
      ].content[i].replace(changeLinkPDF,"http://10.168.64.159:2929/document");

    }
    res.send(toSend[0]);
  });
});

router.get("/get/initial/:value", (req, res) => {
  let val = req.params.value;

  RuleBookInitial.view("rulebook_initial_view", "initialDoc_view", {
    include_docs: true,
    key: val,
  }).then((body) => {
    let toSend = body.rows.map((r) => r.value);
    for (
      let i = 0;
      i < toSend[0].data[toSend[0].version - 1].content.length;
      i++
    ) {
      toSend[0].data[toSend[0].version - 1].content[
        i
      ] = `<head>  <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet"> </head> ${
        toSend[0].data[toSend[0].version - 1].content[i]
      }`;

      var re2 = new RegExp("</a>", "gi");
      toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
        toSend[0].version - 1
      ].content[i].replace(re2, function (str) {
        let index = toSend[0].data[toSend[0].version - 1].content[i].indexOf(
          str
        );

        if (
          toSend[0].data[toSend[0].version - 1].content[i][index - 8].match(
            /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/gi
          ) == null
        )
          return `<i class="small mdi mdi-file-pdf-outline" style="color:red; background-color:white;"></i> ${str}  `;
        else {
          return `<i class="small mdi mdi-link" style="color:green;background-color:white;"></i>  ${str} `;
        }
      });

      let findXLS = new RegExp(".xls", "g");
      if (
        toSend[0].data[toSend[0].version - 1].content[i].match(findXLS) != null
      ) {
        let findLink = new RegExp(
          `href="http://hrdapps48:3001/ftp/rule_book/`,
          "g"
        );
        let indicesLink = [];
        let indicesXLS = [];
        let result = "";
        while (
          (result = findLink.exec(
            toSend[0].data[toSend[0].version - 1].content[i]
          ))
        ) {
          indicesLink.push(result.index);
        }

        while (
          (result = findXLS.exec(
            toSend[0].data[toSend[0].version - 1].content[i]
          ))
        ) {
          indicesXLS.push(result.index);
        }
        // console.log({ ftp: indicesLink, filename: indicesXLS })
        for (let j = 0; j < indicesLink.length; j++) {
          let sjisArray = decodeURI(
            toSend[0].data[toSend[0].version - 1].content[i].substring(
              indicesLink[j] + 42,
              indicesXLS[j]
            )
          );

          // console.log(sjisArray);
        }
      }

      var pdfURL = new RegExp("hrdapps48", "gi");
      toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
        toSend[0].version - 1
      ].content[i].replace(pdfURL, function (str) {
        return `${str}.hrd-s.com`;
      });

      var page2 = new RegExp("：P", "g");
      let cnt = 0;

      toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
        toSend[0].version - 1
      ].content[i]
        .toString()
        .replace(page2, function (str) {
          cnt = cnt + 1;
          return `<a href="#p${cnt}" style='color:black'> ${str}</a>`;
        });
      // }
    }

    var idImg = new RegExp("<img", "g");
    let cnt = 0;
    let cnt2 = 0;
    let imgsrc = [
      toSend[0].data[toSend[0].version - 1].content
        .toString()
        .replace(idImg, function (str) {
          cnt = cnt + 1;
          return `${str} id=p${cnt}`;
        }),
    ];
    toSend[0].data[toSend[0].version - 1].content = imgsrc;
    let PageCount = toSend[0].data[toSend[0].version - 1].content
      .toString()
      .match(/:P/g);
    // console.log(PageCount);
    if (PageCount) {
      if (PageCount.length > 0) {
        let pagelink = [
          toSend[0].data[toSend[0].version - 1].content
            .toString()
            .replace(/:P[0-9]/g, function (str) {
              cnt2 = cnt2 + 1;
              return `<a href="#p${cnt2}" > ${str}</a>`;
            }),
          ,
        ];

        toSend[0].data[toSend[0].version - 1].content = pagelink;
      }
    }
    res.send(toSend[0]);
  });
});

router.get("/get/morethanthis/:value", (req, res) => {
  let val = req.params.value;

  let search = [];

  if (req.query.search.includes("　")) {
    search = req.query.search.toUpperCase().replace(/\s+/g, " ").split(" ");
  } else {
    search = req.query.search.toUpperCase().replace(/\s+/g, " ").split(" ");
  }
  search = search.map((r) => {
    if (!r.match(/\-/gi) >= 0) {
      return r;
    } else return {};
  });

  RuleBook.get(val).then((body) => {
    let doc = body.data[body.version - 1].content;
    let title = body.data[body.version - 1].RuleKenmei;
    for (let i = 0; i < doc.length; i++) {
      for (let j = 0; j < search.length; j++) {
        var re = new RegExp(search[j], "g");
        if (doc[i].includes(search[j])) {
          doc[i] = doc[i].replace(re, function (str) {
            if (str.match(/(<([^>]+)>)/g, "") >= 0) {
              return `<span style="background-color:#05e6ff"> ${str} </span>`;
            } else return str;
          });
        }
      }
    }

    body.data[body.version - 1].content = doc;
    body.data[body.version - 1].RuleKenmei = title;

    for (let i = 0; i < body.data[body.version - 1].content.length; i++) {
      body.data[body.data.length - 1].content[i] = `<div id=p${i + 1}></div> ${body.data[body.data.length - 1].content[i]}`
      var pdfURL = new RegExp("http://hrdapps48", "g");
      body.data[body.data.length - 1].content[i] = body.data[
        body.data.length - 1
      ].content[i]
        .toString()
        .replace(pdfURL, function (str) {
          return `${str}.hrd-s.com`;
        });
      var re2 = new RegExp("</a>", "g");
      body.data[body.version - 1].content[i] = body.data[
        body.version - 1
      ].content[i].replace(re2, function (str) {
        let index = body.data[body.version - 1].content[i].indexOf(
          str
        );
        if (body.data[body.version - 1].content[i][index - 6].match(/#/g) || body.data[body.version - 1].content[i][index - 19].match(/#/g)) {
          return str
        }
        else if (
          body.data[body.version - 1].content[i][index - 8].match(
            /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/gi
          ) == null
        )
          return `<i class="small mdi mdi-file-document" style="color:red;background-color:white;"></i> ${str}  `;
        else {
          return `<i class="small mdi mdi-link" style="color:green;background-color:white;"></i> ${str}  `;
        }
      });
      let changeLinkPDF = new RegExp("http://10.168.64.159:6660/newPage", "g")
      body.data[body.version - 1].content[i] = body.data[
        body.version - 1
      ].content[i].replace(changeLinkPDF,"http://10.168.64.159:2929/document")
    }
   

    res.send(body);
  });
});

//************************************************************ */

// ================== UPDATE DOCUMENTS API ============================== //

//================= FINAL DOCUMENTS
router.get("/get/all_final/documents", (req, res) => {
  let keyValue;
  if (req.query.status == "approved") {
    keyValue = true;
  } else if (req.query.status == "for approval") {
    keyValue = false;
  } else keyValue = req.query.status;
  RuleBook.view("delo", "allrecord-title", {
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
        remarks: b.approvalRemarks,
      };
    });
    res.send(toSend);
  });
});

//================INITIAL DOCUMENTS

//=========LIST
router.get("/get/all_initial/documents", (req, res) => {
  let status = "";
  if (req.query.status == "approved") {
    status = true;
  } else if (req.query.status == "for approval") {
    status = false;
  } else {
    status = req.query.status;
  }
  RuleBookInitial.view("rulebook_initial_view", "isApproved_view", {
    key: status,
  }).then((body) => {
    let toSend = body.rows.map((r) => {
      return r.value;
    });
    res.send(toSend);
  });
});

router.get("/checkExistsDocs", (req, res) => {
  RuleBookInitial.view("rulebook_initial_view", "checkExists_view", {
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
          return rec.substring(0, 6) == moment(date).format("YYMMDD");
        });

      let num = 0;
      if (toSend.length > 0) {
        // console.log('Existing yung person in InCharge at same yung date')
        num = parseInt(toSend[toSend.length - 1].substring(7, 9)) + 1;
        if (num.toString().length == 1) {
          num = `0${num}`;
          documentNo = `${req.query.person}-${date.substring(2)}-${num}`;
        }
      } else {
        // console.log('Existing yung person in charge pero hindi same ang date')
        documentNo = `${req.query.person}-${date.substring(2)}-01`;
      }
      res.send(documentNo);
    } else {
      // console.log("Hindi pa existing yung person in charge");
      documentNo = `${req.query.person}-${date.substring(2)}-01`;
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

  RuleBookInitial.insert(toInsert)
    .then(() => {
      res.send("Success!");
    })
    .catch(() => {
      res.send("Already exist");
    });
});

router.post("/create/new_existing_document/:id", (req, res) => {
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
    isApproved: true,
    scheduleDate: ["2021-01-14"],
    Updatedby: req.query.updatedby,
  };

  RuleBookInitial.insert(toInsert)
    .then(() => {
      res.send("Success!");
    })
    .catch(() => {
      res.send("Already exist");
    });
});

// =========================== EDIT DOCUMENTS API ============================== //
router.get("/get/edit_document/:value/:kind", (req, res) => {
  let val = req.params.value;
  let kind = req.params.kind;
  let myDatabase = null;

  if (kind == "Before") {
    myDatabase = RuleBookInitial;
  } else if (kind == "After") {
    myDatabase = RuleBookAfter;
  } else if (kind == "ToUpdate") {
    myDatabase = RuleBookToUpdate;
  } else {
    myDatabase = RuleBook;
  }

  myDatabase.get(val).then((body) => {
    res.send(body);
  });
});

//====UPLOAD IMAGE TO SERVER FROALA
router.post("/upload_images", (req, res) => {
  FroalaEditor.Image.upload(req, "./upload_images/", function (err, data) {
    if (err) {
      console.log("err");
      return res.send(JSON.stringify(err));
    } else {
      console.log("ok");
      console.log(data);
      setTimeout(() => {
        res.send(data);
      }, 2000);
    }
  });
});

// ========================== your routes here ==============================//
//     **  **         *
//     **   **       **
//     **    **  *  *
// *****       ** **
router.get("/getAllFiles", (req, res) => {
  RuleBook.view("delo", "all-files", {
    include_docs: true,
  }).then((body) => {
    let toSend = body.rows.map((item) => item.doc);
    res.send(toSend);
  });
});

// *   *                    *****
// *   *   ***    *     *   *
// *****  *   *   * * * *   ****
// *   *  *   *   *  *  *   *
// *   *   ***    *     *   ******
router.get("/getAllDocs", (req, res) => {
  let key = req.query.key;
  let limit = req.query.limit;
  let skip = req.query.skip;

  let params = {
    include_docs: true,
  };

  if (key) {
    params.key = key;
  }
  if (limit) {
    params.limit = parseInt(limit);
  }
  if (skip) {
    params.skip = parseInt(skip);
  }

  RuleBook.view("delo", "list-rule", params).then((body) => {
    let toSend = [];
    toSend = body.rows.map((item) => item.value);
    var br = new RegExp("<br>", "g");
    toSend = toSend.map((rec) => {
      rec.title = rec.title.replace(br, function (str) {
        return "";
      });
      let index = rec.title.indexOf("、");
      if (index != -1) {
        rec.title = rec.title.substring(0, index);
      }
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
      total_rows: body.total_rows,
    });
  });
});

router.post("/update/final/obsolete", (req, res) => {
  let idRecord = req.query.ID;
  RuleBook.get(idRecord).then((body) => {
    body.obsolete = true;
    body.obsoleteReason = req.query.reason;
    RuleBook.insert(body).then((body2) => {
      res.send(body2);
    });
  });
});

router.post("/addCount/:val", (req, res) => {
  let val = req.params.val;
  RuleBook.get(val).then((body) => {
    if (body.countViews) {
      body.countViews = body.countViews + 1;
    } else body.countViews = 1;

    RuleBook.insert(body);
    res.send("k");
  });
});

router.post("/transfer_documents", (req, res) => {
  let newApproverData = {};
  newApproverData.name = req.body.approver.name;
  newApproverData.updatedDate = req.body.approver.updatedDate;

  let myDatabase = null;
  if (req.query.transferCondition == "Before") {
    myDatabase = RuleBookInitial;
  } else if (req.query.transferCondition == "After") {
    myDatabase = RuleBookAfter;
  } else if (req.query.transferCondition == "ToUpdate") {
    myDatabase = RuleBookToUpdate;
  } else {
    myDatabase = RuleBook;
  }

  myDatabase.get(req.body._id).then((body) => {
    let beforeBody = Object.assign({}, body);
    let afterBody = Object.assign({}, body);
    let toUpdateBody = Object.assign({}, body);

    if (req.query.transferCondition == "Before") {
      beforeBody.forCheckingBeforeTheMeeting = false;
      beforeBody.alreadyInAfter = true;
      RuleBookInitial.insert(beforeBody);

      RuleBookAfter.get(req.body._id)
        .then((initial) => {
          RuleBookAfter.destroy(initial._id, initial._rev).then(() => {
            delete body._rev;
            RuleBookAfter.insert(body);
          });
        })
        .catch(() => {
          delete body._rev;
          RuleBookAfter.insert(body);
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
            RuleBookToUpdate.insert(body);
          });
        })
        .catch(() => {
          delete body._rev;
          RuleBookToUpdate.insert(body);
        });
    }

    if (req.query.transferCondition == "ToUpdate") {
      toUpdateBody.alreadyInFinal = true;
      RuleBookToUpdate.insert(toUpdateBody);

      RuleBook.get(req.body._id)
        .then((final) => {
          RuleBook.destroy(final._id, final._rev).then(() => {
            delete body._rev;
            RuleBook.insert(body);
          });
        })
        .catch(() => {
          delete body._rev;
          RuleBook.insert(body);
        });
    }
  });
  res.send("ok");
});

router.post("/add/revision_reason/:reason/:id/:incharge", (req, res) => {
  let reason = req.params.reason;
  let id = req.params.id;
  let incharge = req.params.incharge;

  RuleBook.get(id).then((body) => {
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
    // body.scheduleDate = [req.query.date];
    body.scheduleDate = ["2021-01-14"];
    body.isRevised = true;
    body.alreadyInAfter = false;
    body.alreadyInToUpdate = false;
    body.alreadyInFinal = false;
    body.forCheckingBeforeTheMeeting = false;
    body.forCheckingAfterTheMeeting = false;
    body.UpdatedBy = req.query.updatedby;

    RuleBookInitial.get(id)
      .then((initial) => {
        RuleBookInitial.destroy(initial._id, initial._rev).then(() => {
          delete body._rev;
          RuleBookInitial.insert(body);
        });
      })
      .catch(() => {
        delete body._rev;
        RuleBookInitial.insert(body);
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

    RuleBook.get(req.body._id)
      .then((final) => {
        RuleBook.destroy(final._id, final._rev).then(() => {
          delete body._rev;
          RuleBook.insert(body);
        });
      })
      .catch(() => {
        delete body._rev;
        RuleBook.insert(body);
      });
  });
  res.send("ok");
});

router.post("/confirm_document_february_update", (req, res) => {
  let newApproverData = {};
  newApproverData.name = req.body.approver.name;
  newApproverData.updatedDate = req.body.approver.updatedDate;

  RuleBookInitial.get(req.body._id).then((body) => {
    let toUpdateBody = Object.assign({}, body);
    toUpdateBody.alreadyInAfter = true;
    RuleBookInitial.insert(toUpdateBody);

    body.approver = [];
    body.approver.push(newApproverData);
    body.isApproved = true;
    if (req.body.approvalRemarks) {
      body.approvalRemarks = req.body.approvalRemarks;
    }

    RuleBook.get(req.body._id)
      .then((final) => {
        RuleBook.destroy(final._id, final._rev).then(() => {
          delete body._rev;
          RuleBook.insert(body);
        });
      })
      .catch(() => {
        delete body._rev;

        RuleBook.insert(body);
      });
  });
  res.send("ok");
});

//For Link Vue highlight text

router.get("/counter", (req, res) => {
  RuleBook.view("delo", "Counter").then((body) => {
    let data = body.rows.filter((rec) => {
      return rec.key !== null && rec.value.obsolete === undefined;
    });

    let toSend = {};
    toSend.approved = data.filter((rec) => {
      return rec.key === true && rec.value.obsolete === undefined;
    }).length;

    toSend.forApproval = data.filter((rec) => {
      return rec.key === false && rec.value.obsolete === undefined;
    }).length;

    toSend.disApproved = data.filter((rec) => {
      return rec.key === "disapproved" && rec.value.obsolete === undefined;
    }).length;
    toSend.temporary = body.rows.filter((rec) => {
      return rec.key === "temporary" && !rec.value.obsolete;
    }).length;
    toSend.obsolete = body.rows.filter((rec) => {
      return rec.value.obsolete == true;
    }).length;
    toSend.AllData = body.rows.length;
    res.send(toSend);
  });
});

// ========================== Notification For Approval ====================== //
router.get("/get/notification/approval", (req, res) => {
  RuleBook2.get("c018d2995f46c98ceacedaad07da44a2").then((body) => {
    // console.log(body)
    if (body.listOfNotifications[req.query.name]) {
      let newBody = body.listOfNotifications[req.query.name].filter((rec) => {
        return !rec.isRead;
      });
      res.send(newBody);
    } else res.send("No data");
  });
});

router.post("/add/notification/approval", (req, res) => {
  RuleBook2.get("c018d2995f46c98ceacedaad07da44a2").then((body) => {
    let toInsert = {};
    toInsert = req.body;
    if (body.listOfNotifications[req.query.name]) {
      body.listOfNotifications[req.query.name].push(toInsert);
    } else {
      body.listOfNotifications[req.query.name] = [toInsert];
    }
    RuleBook2.insert(body).then(() => {});
    res.send(req.body);
  });
});

router.get("/checkFavorites", (req, res) => {
  RuleBook.get("6962e85ae13cfdc59db882f0d0aa6352").then((body) => {
    res.send(
      body.Favorites.filter((rec) => {
        return rec.id == req.query.employeeID;
      })
    );
  });
});

router.post("/addFavorites", (req, res) => {
  let documentNo = req.query.documentNo;
  let employeeID = req.query.employeeID;
  RuleBook.get("6962e85ae13cfdc59db882f0d0aa6352").then((body) => {
    let exist = body.Favorites.filter((rec) => {
      return rec.id == employeeID;
    });

    let index = findWithAttr(body.Favorites, "id", employeeID);
    if (exist.length > 0) {
      if (body.Favorites[index].docs.includes(documentNo)) {
        let removeIndex = findWithAttr(
          body.Favorites[index],
          "docs",
          documentNo
        );

        body.Favorites[index].docs.splice(removeIndex, 1);
        RuleBook.get(documentNo).then((body) => {
          if (body.countFavorites) {
            body.countFavorites = body.countFavorites - 1;
          } else body.countFavorites = 1;
          RuleBook.insert(body);
          res.send("k");
        });
      } else {
        RuleBook.get(documentNo).then((body) => {
          if (body.countFavorites) {
            body.countFavorites = body.countFavorites + 1;
          } else body.countFavorites = 1;

          RuleBook.insert(body);
          res.send("k");
        });
        body.Favorites[index].docs.push(documentNo);
      }
      RuleBook.insert(body);
    } else {
      body.Favorites.push({ id: employeeID, docs: [documentNo] });
      RuleBook.insert(body);
    }
  });
});

const findWithAttr = (array, attr, value) => {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
};

// =============================== END =================================== //

// ========================== your routes here ==============================//

//TO BE IMPORT IN AWS//
router.get("/import", (req, res) => {
  let keyValue;
  if (req.query.status == "approved") {
    keyValue = true;
  } else keyValue = req.query.status;
  RuleBook.view("delo", "allrecord-title", {
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
        remarks: b.approvalRemarks,
      };
    });
    res.send(temp);
  });
});

////////==============================FEBRUARY UPDATES ROUTES=============================//////////
router.post("/create/february_documents/:id", (req, res) => {
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
  };

  RuleBookInitial.insert(toInsert).then((body) => {
    // console.log(body);
    res.send(body);
  });
});

module.exports = router;
