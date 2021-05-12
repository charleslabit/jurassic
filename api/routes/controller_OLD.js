const express = require("express");
const bodyParser = require("body-parser");
const Papa = require("papaparse");
const moment = require("moment");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const router = express.Router();
const mssql = require("mssql");

const nano = require("nano")("http://root:admin@10.168.64.31:5984");
const RuleBook2 = nano.db.use("rulebookv2");

const RuleBook = nano.db.use("rulebook");

const RuleBookInitial = nano.db.use("rulebookv2_initial");
const FroalaEditor = require("wysiwyg-editor-node-sdk");
const e = require("express");

router.use(cors());
router.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
  })
);
router.use(bodyParser.json({ limit: "50mb" }));

router.get("/", (req, res) => {
  res.send("Pogi");
});

router.post("/froalaRemove", function (req, res) {
  var a = _.replace(req.body.src, req.body.replace, "../rulebook/dist/");
  fsx.removeSync(a);
  res.send("Removed");
});

router.post(
  "/upload_image/:id",
  (req, res) => {
    var param = req.params.id;
    // fsx.pathExists(
    //   "C:\\Users\\smd245\\Desktop\\froalaSaver\\",
    //   (err, exists) => {
    //     console.log(err,exists)
    // if (exists == false) {
    //   mkdirp(
    //     "../rulebook/dist/uploads/image/froala/" + param + "/",
    //     function (err) {
    //       if (!err) {
    //         FroalaEditor.Image.upload(
    //           req,
    //           "../rulebook/dist/uploads/image/froala/" + param + "/",
    //           function (err, data) {
    //             if (err) {
    //               return res.send(JSON.stringify(err));
    //             }
    //             res.send(data);
    //           }
    //         );
    //       }
    //     }
    //   );
    // } else {
    FroalaEditor.Image.upload(
      req,
      "C:\\Users\\smd245\\Desktop\\froalaSaver\\",
      function (err, data) {
        if (err) {
          return res.send(JSON.stringify(err));
        }
        res.send(data);
      }
    );
  }
  // }
);
// });

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
      // employee_code: {
      //   $eq: req.params.id,
      // },
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
        // req.query.scheduledDate = "2020-12-23";
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
  let filterIsApproved = null;

  if (req.query.beforeORafter == "before") {
    DatabaseView = RuleBookInitial.view(
      "rulebook_initial_view",
      "document_view"
    );
  } else {
    DatabaseView = RuleBook.view("delo", "document_view");
  }

  if (req.query.meeting == "approval") {
    filterIsApproved = false;
  } else {
    filterIsApproved = true;
  }

  DatabaseView.then((body) => {
    let newBody = body.rows
      .map((rec) => {
        return rec.value;
      })
      .filter((rec) => {
        return rec.isApproved == filterIsApproved && !rec.obsolete;
      })
      .map((rec) => {
        return rec.personInCharge;
      })
      .filter((rec) => {
        return rec;
      });

    uniqueArray = newBody.filter(function (item, pos) {
      return newBody.indexOf(item) == pos;
    });

    res.send(uniqueArray);
  });
});

router.get("/get/personincharge/list", (req, res) => {
  RuleBookInitial.view("rulebook_initial_view", "initialDoc_view").then(
    (body) => {
      let newBody = body.rows
        .map((rec) => {
          return rec.value;
        })

        // .filter((rec) => {
        //   if (req.query.person) {
        //     return rec._id.includes(req.query.person);
        //   }
        //   return rec;
        // })

        .map((rec) => {
          return {
            _id: rec._id,
            isApproved: rec.isApproved,
            approver: rec.approver,
            isFinishedBeforeTheMeeting: rec.isFinishedBeforeTheMeeting,
            RulebookUpdatedDate: rec.RulebookUpdatedDate,
          };
        });

     

      res.send(newBody);
    }
  );
});

router.get("/get/personincharge/approved/list", (req, res) => {
  RuleBookInitial.view("rulebook_initial_view", "initialDoc_view").then(
    (body) => {
      let newBody = body.rows
        .map((rec) => {
          return rec.value;
        })
        .filter((rec) => {
          return rec._id.includes(req.query.person);
        })
        .map((rec) => {
          return { _id: rec._id, isApproved: rec.isApproved };
        });

      res.send(newBody);
    }
  );
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
    let toSend = searchArr.map((data) => {
      let content = data.map((rec) => {
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

    let toSend = searchArr.map((data) => {
      let content = data.map((rec) => {
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
      let toSend = searchArr.map((data) => {
        let content = data.map((rec) => {
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
      var re2 = new RegExp("</a>", "gi");
      body.data[body.version - 1].content[i] = body.data[
        body.version - 1
      ].content[i].replace(re2, function (str) {
        let index = body.data[body.version - 1].content[i].indexOf(str);

        if (
          body.data[body.version - 1].content[i][index - 8].match(
            /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/gi
          ) == null
        )
          return `<i class="small mdi mdi-file-pdf-outline" style="color:red; background-color:white;"></i>  ${str} `;
        else {
          return `<i class="small mdi mdi-link" style="color:green;background-color:white;"></i> ${str}  `;
        }
      });
      var page2 = new RegExp("：P", "g");

      let cnt = 0;

      body.data[body.data.length - 1].content[i] = body.data[
        body.data.length - 1
      ].content[i]
        .toString()
        .replace(page2, function (str) {
          cnt = cnt + 1;
          return `<a href="#p${cnt}" style='color:black'> ${str}</a>`;
        });
    }

    let imageCount = body.data[body.version - 1].content
      .toString()
      .match(/<img/g);

    var idImg = new RegExp("<img", "g");
    let cnt = 0;
    let cnt2 = 0;
    let imgsrc = [
      body.data[body.version - 1].content
        .toString()
        .replace(idImg, function (str) {
          cnt = cnt + 1;
          return `${str} id=p${cnt}`;
        }),
    ];
    body.data[body.version - 1].content = imgsrc;
    let PageCount = body.data[body.version - 1].content.toString().match(/:P/g);
    // console.log(PageCount);
    if (PageCount) {
      if (PageCount.length > 0) {
        let pagelink = [
          body.data[body.version - 1].content
            .toString()
            .replace(/:P/g, function (str) {
              cnt2 = cnt2 + 1;
              return `<a href="#p${cnt2}" style='color:black'> ${str}</a>`;
            }),
          ,
        ];
        body.data[body.version - 1].content = pagelink;
      }
    }

    res.send(body);
  });
});
//************************************************* */

//For Approval and Link Vue
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
    // let imageCount = toSend[0].data[toSend[0].version - 1].content
    //   .toString()
    //   .match(/<img/g);
    // console.log(imageCount.length);

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
    // let imageCount = toSend[0].data[toSend[0].version - 1].content
    //   .toString()
    //   .match(/<img/g);
    // console.log(imageCount.length);

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
//************************************************************ */

// ================== UPDATE DOCUMENTS API ============================== //

//================= FINAL DOCUMENTS
router.get("/get/all_final/documents", (req, res) => {
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

//==========END

//==========CHECK EXISTING DOCUMENT (FOR CREATION)
// router.get("/checkExistsDocs", (req, res) => {
//   RuleBookInitial.view("rulebook_initial_view", "checkExists_view", {
//     key: req.query.person,
//   }).then((body) => {
//     let documentNo = "";
//     if (body.rows.length > 0) {
//       let toSend = body.rows.map((r) => {
//         return r.value.substring(0, 9);
//       });

//       if (toSend[toSend.length - 1].substring(7, 9) < 99) {
//         let num = parseInt(toSend[toSend.length - 1].substring(7, 9)) + 1;

//         if (num.toString().length == 1) {
//           num = `0${num}`;
//         }
//         documentNo = `${toSend[toSend.length - 1].substring(0, 6)}-${num}-${
//           req.query.person
//         }`;
//       } else {
//         let num = parseInt(toSend[toSend.length - 1].substring(0, 6)) + 1;
//         if (num.toString().length == 1) {
//           num = `00000${num}`;
//         } else if (num.toString().length == 2) {
//           num = `0000${num}`;
//         } else if (num.toString().length == 3) {
//           num = `000${num}`;
//         } else if (num.toString().length == 4) {
//           num = `00${num}`;
//         } else if (num.toString().length == 5) {
//           num = `0${num}`;
//         }
//         // console.log(num)
//         documentNo = `${num}-01-${req.query.person}`;
//       }
//     } else documentNo = `000000-01-${req.query.person}`;
//     res.send(documentNo);
//   });
// });

router.get("/checkExistsDocs", (req, res) => {
  RuleBookInitial.view("rulebook_initial_view", "checkExists_view", {
    key: req.query.person,
  }).then((body) => {
    let documentNo = "";
    let date = req.query.date;

    if (body.rows.length > 0) {
      let toSend = body.rows.map((r) => {
        return r.value.substring(5, 14);
      });

      // if (toSend[toSend.length - 1].substring(7, 9) < 99) {
      let num = parseInt(toSend[toSend.length - 1].substring(7, 9)) + 1;

      if (num.toString().length == 1) {
        num = `0${num}`;
      }
      documentNo = `${req.query.person}-${date.substring(2)}-${num}`;
      //   documentNo = `${toSend[toSend.length - 1].substring(0, 6)}-${num}-${req.query.person
      //     }`;
      // } else {
      //   let num = parseInt(toSend[toSend.length - 1].substring(0, 6)) + 1;
      //   if (num.toString().length == 1) {
      //     num = `00000${num}`;
      //   } else if (num.toString().length == 2) {
      //     num = `0000${num}`;
      //   } else if (num.toString().length == 3) {
      //     num = `000${num}`;
      //   } else if (num.toString().length == 4) {
      //     num = `00${num}`;
      //   } else if (num.toString().length == 5) {
      //     num = `0${num}`;
      //   }
      //   // console.log(num)
      //   documentNo = `${num}-01-${req.query.person}`;
      res.send(documentNo);
      // }
    } else documentNo = `${req.query.person}-${date.substring(2)}-01`;
    res.send(documentNo);
  });
});

//============================= END ==============================================//

router.post("/create/new_document/:id", (req, res) => {
  let toInsert = {
    _id: `${req.params.id}`,
    version: 1,
    updated: false,
    data: [
      {
        SeihinKubun: "",
        KanriBangou: `${req.params.id}`,
        RuleKenmei: "",
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
        content: [
          `<p style="color: rgb(0, 0, 0);text-align: left;background: transparent;"><span style='font-family: "MS Gothic"; font-size: 24px;'>○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○<span style='color: rgb(0, 0, 0); font-family: "MS Gothic"; font-size: 24px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;'>○○○○</span><span style='color: rgb(0, 0, 0); font-family: "MS Gothic"; font-size: 24px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;;color: rgb(0, 0, 0); font-family: "MS Gothic"; font-size: 24px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;'>○○○○○○○</span>&nbsp;</span></p>

          <p style="color: rgb(0, 0, 0);text-align: left;background: transparent;"><span style="font-size: 24px;"><span style="font-family: MS Gothic;">○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○</span><span style="font-family: MS Gothic;">○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○<span style='color: rgb(0, 0, 0); font-family: "MS Gothic"; font-size: 24px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;'>○○○○○</span>&nbsp;</span></span></p>
          
          <ol>
            <li style="font-size:24px;">
          
              <h1 style='color: #000000;text-align: justify;background: transparent;font-family: "ＭＳ ゴシック", "MS Gothic", monospace;font-size:16px;'><span style="font-size: 24px;"><span style="font-family: MS Gothic;">○○○</span></span></h1>
          
              <ol style="font-size:22px;">
                <li>
          
                  <p style='color: #000000;text-align: justify;background: transparent;font-family: "ＭＳ ゴシック", "MS Gothic", monospace;font-size:15px;'><span style="font-size: 24px;"><span style="font-family: MS Gothic;">○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○</span></span></p>
                </li>
                <li>
          
                  <p style='color: #000000;text-align: justify;background: transparent;font-family: "ＭＳ ゴシック", "MS Gothic", monospace;font-size:15px;'><span style="font-size: 24px;"><span style="font-family: MS Gothic;">○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○</span></span></p>
          
                  <ol style="font-weight:normal;">
                    <li style="font-weight:normal;">
          
                      <p style='color: #000000;text-align: justify;background: transparent;font-family: "ＭＳ ゴシック", "MS Gothic", monospace;font-size:15px;'><span style="font-size: 24px;"><span style="font-family: MS Gothic;">○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○</span></span></p>
          
                      <ol type="a">
                        <li>
          
                          <p style='color: #000000;text-align: justify;background: transparent;font-family: "ＭＳ ゴシック", "MS Gothic", monospace;font-size:15px;'><span style="font-size: 24px;"><span style="font-family: MS Gothic;">○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○</span></span></p>
                        </li>
                        <li>
          
                          <p style='color: #000000;text-align: justify;background: transparent;font-family: "ＭＳ ゴシック", "MS Gothic", monospace;font-size:15px;'><span style="font-size: 24px;"><span style="font-family: MS Gothic;">○○○○○</span></span></p>
                        </li>
                      </ol>
                    </li>
                    <li>
          
                      <p style='color: #000000;text-align: justify;background: transparent;font-family: "ＭＳ ゴシック", "MS Gothic", monospace;font-size:15px;'><span style="font-size: 24px;"><span style="font-family: MS Gothic;">○○○○○○○○○○○○</span></span></p>
                    </li>
                    <li>
          
                      <p style='color: #000000;text-align: justify;background: transparent;font-family: "ＭＳ ゴシック", "MS Gothic", monospace;font-size:15px;'><span style="font-size: 24px;"><span style="font-family: MS Gothic;">○○○○○</span></span></p>
          
                      <ol type="a">
                        <li>
          
                          <p style='color: #000000;text-align: justify;background: transparent;font-family: "ＭＳ ゴシック", "MS Gothic", monospace;font-size:15px;'><span style="font-size: 24px;"><span style="font-family: MS Gothic;">○○○○○</span></span></p>
                        </li>
                        <li>
          
                          <p style='color: #000000;text-align: justify;background: transparent;font-family: "ＭＳ ゴシック", "MS Gothic", monospace;font-size:15px;'><span style="font-size: 24px;"><span style="font-family: MS Gothic;">○○○○○</span></span></p>
                        </li>
                      </ol>
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
          </ol>
          
          <p style='color: rgb(0, 0, 0);text-align: right;background: transparent;font-family: "ＭＳ ゴシック", "MS Gothic", monospace;font-size:15px;'><span style="font-size: 24px;"><span style="font-family: MS Gothic;">(関連件名：「参照するルールのタイトル」参照)　</span><span style='font-family: "MS Gothic"; background-color: rgb(250, 197, 28);'>000000-00</span><span style="font-family: MS Gothic;">　</span></span></p>
          
          <p style='color: rgb(0, 0, 0);text-align: right;background: transparent;font-family: "ＭＳ ゴシック", "MS Gothic", monospace;font-size:15px;'>
            <br>
          </p>
          
          <ol start="2" style="font-weight:bold; font-size:24px;">
            <li>
          
              <h1 style='color: #000000;text-align: justify;background: transparent;font-family: "ＭＳ ゴシック", "MS Gothic", monospace;font-size:16px;'><span style="font-size: 24px;"><span style="font-family: MS Gothic;">○○○</span></span></h1>
          
              <ol style="font-size:22px;">
                <li>
          
                  <p style='color: #000000;text-align: justify;background: transparent;font-family: "ＭＳ ゴシック", "MS Gothic", monospace;font-size:15px;'><span style="font-size: 24px;"><span style="font-family: MS Gothic;">○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○</span></span></p>
                </li>
              </ol>
            </li>
          </ol>
          
          <p>
            <br>
          </p>
          
`,
        ],
      },
    ],
    documentType: "RULEBOOK",
    isApproved: "temporary",
    personInCharge: req.query.person,
  };

  RuleBookInitial.insert(toInsert).then((body) => {
    // console.log(body);
    res.send(body);
  });
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
    body.data.push(newData);
    body.isApproved = "temporary";
    body.version = body.version + 1;
    body.approvalRemarks = reason;
    // let toPush = {};
    RuleBook.insert(body);
  });
  res.send("OK");
});

// =========================== EDIT DOCUMENTS API ============================== //
router.get("/get/:value", (req, res) => {
  let val = req.params.value;
  RuleBook.get(val).then((body) => {
    res.send(body);
  });
});

router.get("/getInitial/:value", (req, res) => {
  let val = req.params.value;
  RuleBookInitial.get(val).then((body) => {
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

// ============== SAVING OF INITIAL DOCUMENT======================= //
// router.post("/post/update_doc_temporary/initial/:value", (req, res) => {
//   let val = req.params.value;
//   let myData = req.body.data[req.body.version - 1];

//   myData.RuleKenmei = myData.RuleKenmei.replace(/\n/gi, "<br>");

//   myData.UpdatedDate = moment().format("YYYY-MM-DD hh:mm:ss");
//   RuleBookInitial.get(val).then((body) => {
//     myData.ApprovalRemarks = body.data[body.data.length - 1].ApprovalRemarks;
//     body.updated = true;
//     body.isApproved = "temporary";
//     body.version = body.data.length;
//     body.data[body.data.length - 1] = myData;

//     body.method = req.body.method;
//     body.criteria = req.body.criteria;
//     body.productType = req.body.productType;
//     body.documentType = "RULEBOOK";
//     body.RulebookUpdatedDate = req.body.RulebookUpdatedDate;

//     RuleBookInitial.insert(body, val).then((body) => {
//       res.send("ok");
//     });
//   });
// });

//SAVE FUNCTION OF EDITOR RULEBOOK AND RULEBOOK INITIAL @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
router.post(
  "/post/update_documents/:documentID/:isApprovedValue/:kind",
  (req, res) => {
    let val = req.params.documentID;
    let isApprovedValue = "";
    if (req.params.isApprovedValue == "false") {
      isApprovedValue = false;
    } else {
      isApprovedValue = req.params.isApprovedValue;
    }
    let kind = req.params.kind;

    let myData = req.body.data[req.body.version - 1];
    myData.RuleKenmei = myData.RuleKenmei.replace(/\n/gi, "<br>");
    myData.UpdatedDate = moment().format("YYYY-MM-DD hh:mm:ss");

    let Database = null;
    if (kind == "Initial") {
      Database = RuleBookInitial;
    } else {
      Database = RuleBook;
    }

    Database.get(val).then((body) => {
      body.updated = true;
      body.method = req.body.method;
      body.criteria = req.body.criteria;
      body.productType = req.body.productType;
      body.RulebookUpdatedDate = req.body.RulebookUpdatedDate;
      if (body.isApproved == "disapproved") {
        myData.ApprovalRemarks = body.approvalRemarks;
        body.version = body.version + 1;
        body.isApproved = false;
        delete myData.disapprover;
        body.data.push(myData);
      } else if (body.isApproved == "temporary") {
        body.isApproved = isApprovedValue;
        body.data[body.version - 1] = myData;
      } else {
        body.isApproved = false;
        body.data[body.version - 1] = myData;
      }

      Database.insert(body);
      res.send("ok");
    });
  }
);
//=========================== END ====================================//

//=====================SAVING OF FINAL DOCUMENT =====================//
// router.post("/post/update_doc_temporary/final/:value", (req, res) => {
//   let val = req.params.value;
//   let myData = req.body.data[req.body.version - 1];

//   myData.RuleKenmei = myData.RuleKenmei.replace(/\n/gi, "<br>");

//   myData.UpdatedDate = moment().format("YYYY-MM-DD hh:mm:ss");
//   RuleBookInitial.get(val).then((body) => {
//     myData.ApprovalRemarks = body.data[body.data.length - 1].ApprovalRemarks;
//     body.updated = true;
//     body.isApproved = "temporary";
//     body.version = body.data.length;
//     body.data[body.data.length - 1] = myData;

//     body.method = req.body.method;
//     body.criteria = req.body.criteria;
//     body.productType = req.body.productType;
//     body.documentType = "RULEBOOK";
//     body.RulebookUpdatedDate = req.body.RulebookUpdatedDate;

//     RuleBook.insert(body, val).then((body) => {
//       res.send("ok");
//     });
//   });
// });
// router.post("/post/update_doc/final/:value", (req, res) => {
//   // console.log(req.body);
//   // console.log()//
//   //
//   let val = req.params.value;
//   let myData = req.body.data[req.body.version - 1];
//   // console.log(req.body)
//   myData.RuleKenmei = myData.RuleKenmei.replace(/\n/gi, "<br>");

//   myData.UpdatedDate = moment().format("YYYY-MM-DD hh:mm:ss");
//   RuleBook.get(val).then((body) => {
//     if (body.data[body.version - 1].isRevise) {
//       myData.ApprovalRemarks = body.approvalRemarks;
//       body.updated = true;
//       body.isApproved = false;
//       body.version = body.version + 1;
//       body.data.push(myData);
//       body.method = req.body.method;
//       body.criteria = req.body.criteria;
//       body.productType = req.body.productType;
//       body.documentType = "RULEBOOK";
//       body.RulebookUpdatedDate = req.body.RulebookUpdatedDate;
//     } else if (
//       !body.data[body.version - 1].isRevise &&
//       body.data[body.version - 1].ApprovalRemarks
//     ) {
//       // console.log("update");
//       // console.log(body);
//       myData.ApprovalRemarks = body.data.approvalRemarks;
//       body.updated = true;
//       body.isApproved = false;
//       body.version = body.version;
//       body.data[body.version - 1] = myData;
//       body.data[body.version - 1].isRevise = true;
//       body.method = req.body.method;
//       body.criteria = req.body.criteria;
//       body.productType = req.body.productType;
//       body.RulebookUpdatedDate = req.body.RulebookUpdatedDate;
//     } else {
//       body.updated = true;
//       myData.ApprovalRemarks = body.approvalRemarks;
//       body.isApproved = false;

//       if (body.data[body.version - 1].RuleKenmei == "") {
//         body.data[0] = myData;
//         body.version = 1;
//       } else {
//         body.version = body.version + 1;
//         body.data.push(myData);
//       }

//       body.method = req.body.method;
//       body.criteria = req.body.criteria;
//       body.productType = req.body.productType;
//       body.documentType = "RULEBOOK";
//       body.RulebookUpdatedDate = req.body.RulebookUpdatedDate;
//     }
//     RuleBook.insert(body, val).then((body) => {
//       res.send("ok");
//     });
//   });
// });

// ========================== your routes here ==============================//
router.get("/getAllFiles", (req, res) => {
  RuleBook.view("delo", "all-files", {
    include_docs: true,
  }).then((body) => {
    let toSend = body.rows.map((item) => item.doc);
    res.send(toSend);
  });
});

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

router.get("/get/updated_rules/:status", (req, res) => {
  let status = req.params.status;
  let key = false;
  if (status === "approved") {
    key = true;
  }
  RuleBook.view("delo", "updated", {
    include_docs: true,
    key: key,
  }).then((body) => {
    let temp = body.rows
      .map((item) => item.doc)
      .filter((rec) => {
        return !rec.obsolete;
      });

    let toSend = temp.map((data) => {
      return {
        _id: data._id,
        title: data.data[data.version - 1].RuleKenmei,
        personInCharge: data.personInCharge,
      };
    });
    // .filter(rec => {
    //   return rec.personInCharge
    // })

    res.send(toSend);
  });
});

router.get("/get/all/obsolete", (req, res) => {
  RuleBook.view("delo", "obsolete-view", {
    include_docs: true,
  }).then((body) => {
    let temp = body.rows
      .map((a) => a.doc)
      .filter((rec) => {
        return rec.obsolete;
      });
    let toSend = temp.map((data) => {
      return { _id: data._id, title: data.data[data.version - 1].RuleKenmei };
    });
    res.send(toSend);
  });
});

router.post("/update/initial/obsolete", (req, res) => {
  let idRecord = req.query.ID;
  RuleBookInitial.get(idRecord).then((body) => {
    body.obsolete = true;
    RuleBookInitial.insert(body).then((body2) => {
      res.send(body2);
    });
  });
});

router.post("/update/final/obsolete", (req, res) => {
  let idRecord = req.query.ID;
  RuleBook.get(idRecord).then((body) => {
    body.obsolete = true;
    RuleBook.insert(body).then((body2) => {
      res.send(body2);
    });
  });
});

// router.get("/get/this/:value", (req, res) => {
//   let val = req.params.value;
//   RuleBook.view("delo", "searchDocument", {
//     include_docs: true,
//     key: val,
//   }).then((body) => {
//     let toSend = body.rows.map((r) => r.value);
//     for (
//       let i = 0;
//       i < toSend[0].data[toSend[0].version - 1].content.length;
//       i++
//     ) {
//       toSend[0].data[toSend[0].version - 1].content[
//         i
//       ] = `<head>  <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet"> </head> ${
//         toSend[0].data[toSend[0].version - 1].content[i]
//       }`;
//       var re2 = new RegExp("</a>", "gi");
//       toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
//         toSend[0].version - 1
//       ].content[i].replace(re2, function (str) {
//         let index = toSend[0].data[toSend[0].version - 1].content[i].indexOf(
//           str
//         );
//         if (
//           toSend[0].data[toSend[0].version - 1].content[i][index - 8].match(
//             /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/gi
//           ) == null
//         )
//           return `<i class="small mdi mdi-file-pdf-outline" style="color:red; background-color:white;"></i> ${str}  `;
//         else {
//           return `<i class="small mdi mdi-link" style="color:green;background-color:white;"></i>  ${str} `;
//         }
//       });

//       let findXLS = new RegExp(".xls", "g");
//       if (
//         toSend[0].data[toSend[0].version - 1].content[i].match(findXLS) != null
//       ) {
//         let findLink = new RegExp(
//           `href="http://hrdapps48:3001/ftp/rule_book/`,
//           "g"
//         );
//         let indicesLink = [];
//         let indicesXLS = [];
//         let result = "";
//         while (
//           (result = findLink.exec(
//             toSend[0].data[toSend[0].version - 1].content[i]
//           ))
//         ) {
//           indicesLink.push(result.index);
//         }

//         while (
//           (result = findXLS.exec(
//             toSend[0].data[toSend[0].version - 1].content[i]
//           ))
//         ) {
//           indicesXLS.push(result.index);
//         }
//         for (let j = 0; j < indicesLink.length; j++) {
//           let sjisArray = decodeURI(
//             toSend[0].data[toSend[0].version - 1].content[i].substring(
//               indicesLink[j] + 42,
//               indicesXLS[j]
//             )
//           );

//         }
//       }

//       var pdfURL = new RegExp("hrdapps48", "gi");
//       toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
//         toSend[0].version - 1
//       ].content[i].replace(pdfURL, function (str) {
//         return `${str}.hrd-s.com`;
//       });

//       var page2 = new RegExp("：P", "g");
//       let cnt = 0;

//       toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
//         toSend[0].version - 1
//       ].content[i]
//         .toString()
//         .replace(page2, function (str) {
//           cnt = cnt + 1;
//           return `<a href="#p${cnt}" style='color:black'> ${str}</a>`;
//         });
//       // }
//     }
//     let imageCount = toSend[0].data[toSend[0].version - 1].content
//       .toString()
//       .match(/<img/g);

//     var idImg = new RegExp("<img", "g");
//     let cnt = 0;
//     let cnt2 = 0;
//     let imgsrc = [
//       toSend[0].data[toSend[0].version - 1].content
//         .toString()
//         .replace(idImg, function (str) {
//           cnt = cnt + 1;
//           return `${str} id=p${cnt}`;
//         }),
//     ];
//     toSend[0].data[toSend[0].version - 1].content = imgsrc;
//     let PageCount = toSend[0].data[toSend[0].version - 1].content
//       .toString()
//       .match(/:P/g);
//     if (PageCount) {
//       if (PageCount.length > 0) {
//         let pagelink = [
//           toSend[0].data[toSend[0].version - 1].content
//             .toString()
//             .replace(/:P[0-9]/g, function (str) {
//               cnt2 = cnt2 + 1;
//               return `<a href="#p${cnt2}" > ${str}</a>`;
//             }),
//           ,
//         ];

//         toSend[0].data[toSend[0].version - 1].content = pagelink;
//       }
//     }
//     res.send(toSend[0]);
//   });
// });

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

// router.post("/update/document", (req, res) => {
//   RuleBook.get(req.body._id).then((body) => {
//     let newApproverData = {};
//     newApproverData.name = req.body.approver.name;
//     newApproverData.updatedDate = req.body.approver.updatedDate;
//     body.approver.push(newApproverData);
//     body.isApproved = req.body.isApproved;
//     if (req.body.approvalRemarks) {
//       body.approvalRemarks = req.body.approvalRemarks;
//     }
//     RuleBook.insert(body).then((body2) => {
//       res.send(body2);
//     });
//   });
// });
//APPROVED AND DISAPPROVED FUNCTION OF RULEBOOK AND RULEBOOK INITIAL @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
router.post("/update/approved_document", (req, res) => {
  let newApproverData = {};
  newApproverData.name = req.body.approver.name;
  newApproverData.updatedDate = req.body.approver.updatedDate;

  if (req.query.beforeORafter == "before") {
    RuleBookInitial.get(req.body._id).then((body) => {
      body.updated = true;

      if (req.query.isApproved == "false") {
        body.isApproved = true;
        body.approver = [];
        body.approver.push(newApproverData);

        RuleBookInitial.insert(body);
      } else if (req.query.isApproved == "true") {
        let newBody = Object.assign({}, body);
        newBody.isApproved = true;
        newBody.isFinishedBeforeTheMeeting = true;
        RuleBookInitial.insert(newBody);

        body.isApproved = false;
        body._id = req.query.newFinalDocumentNo;
        delete body._rev;
        RuleBook.insert(body);
      }
    });
  } else {
    RuleBook.get(req.body._id).then((body) => {
      // body.approver.push(req.body.approver);
      body.approver.push(newApproverData);
      body.isApproved = req.body.isApproved;
      if (req.body.approvalRemarks) {
        body.approvalRemarks = req.body.approvalRemarks;
      }
      RuleBook.insert(body);
    });
  }
  res.send("ok");
});

router.post("/update/disapproved_document", (req, res) => {
  let newApproverData = {};
  newApproverData.name = req.body.approver.name;
  newApproverData.updatedDate = req.body.approver.updatedDate;
  if (req.query.beforeORafter == "before") {
    RuleBookInitial.get(req.body._id).then((body) => {
      if (!body.data[body.data.length - 1].disapprover) {
        body.data[body.data.length - 1].disapprover = [];
      }
      body.data[body.data.length - 1].disapprover.push(newApproverData);
      // body.approver.push(newApproverData);
      body.isApproved = "disapproved";
      body.approvalRemarks = req.body.approvalRemarks;
      RuleBookInitial.insert(body);
      // console.log(body);
    });
  } else {
    RuleBook.get(req.body._id).then((body) => {
      if (!body.data[body.data.length - 1].disapprover) {
        body.data[body.data.length - 1].disapprover = [];
      }
      body.data[body.data.length - 1].disapprover.push(newApproverData);
      // body.isApproved = req.body.isApproved;
      body.isApproved = "disapproved";
      if (req.body.approvalRemarks) {
        body.approvalRemarks = req.body.approvalRemarks;
      }

      // console.log(body)
      RuleBook.insert(body);
    });
  }
  res.send("ok");
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

//For Link Vue highlight text
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
        let index = body.data[body.version - 1].content[i].indexOf(str);

        if (
          body.data[body.version - 1].content[i][index - 8].match(
            /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/gi
          ) == null
        )
          return ` <i class="small mdi mdi-file-pdf-outline" style="color:red; background-color:white;"></i>  ${str} `;
        else {
          return ` <i class="small mdi mdi-link" style="color:green; background-color:white;"></i> ${str}`;
        }
      });
      var page2 = new RegExp("：P", "g");

      let cnt = 0;

      body.data[body.data.length - 1].content[i] = body.data[
        body.data.length - 1
      ].content[i]
        .toString()
        .replace(page2, function (str) {
          cnt = cnt + 1;
          return `<a href="#p${cnt}" style='color:black'> ${str}</a>`;
        });
    }

    let imageCount = body.data[body.version - 1].content
      .toString()
      .match(/<img/g);

    var idImg = new RegExp("<img", "g");
    let cnt = 0;
    let cnt2 = 0;
    let imgsrc = [
      body.data[body.version - 1].content
        .toString()
        .replace(idImg, function (str) {
          cnt = cnt + 1;
          return `${str} id=p${cnt}`;
        }),
    ];
    body.data[body.version - 1].content = imgsrc;
    let PageCount = body.data[body.version - 1].content.toString().match(/:P/g);
    if (PageCount) {
      if (PageCount.length > 0) {
        let pagelink = [
          body.data[body.version - 1].content
            .toString()
            .replace(/:P/g, function (str) {
              cnt2 = cnt2 + 1;
              return `<a href="#p${cnt2}" style='color:black'> ${str}</a>`;
            }),
          ,
        ];
        body.data[body.version - 1].content = pagelink;
      }
    }

    res.send(body);
  });
});

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

// =============================== END =================================== //

// ========================== your routes here ==============================//

module.exports = router;
