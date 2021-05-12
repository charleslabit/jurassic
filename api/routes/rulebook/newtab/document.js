const express = require("express");
const router = express.Router();
const nano = require("nano")("http://root:admin@10.168.64.31:5984");
const RulebookFInalData = nano.db.use("rulebook");
const RuleBookBefore = nano.db.use("rulebookv2_initial");
const knex_mysql_Rulebook = require("knex")({
  client: "mysql",
  connection: {
    host: "10.11.1.59",
    user: "charles",
    password: "labit",
    database: "rulebook",
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
      idleTimeoutMillis: 300000,
      max: 100,
    },
  },
});
const knex_mssql_CompanyInformation = require("knex")({
  client: "mssql",
  connection: {
    host: "hrdsql",
    user: "sa",
    password: "81at84",
    database: "CompanyInformation",
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
      idleTimeoutMillis: 300000,
      max: 100,
    },
    options: {
      encrypt: false,
      enableArithAbort: true,
    },
  },
});

const bodyParser = require("body-parser");
const cors = require("cors");
router.use(cors());
router.use(bodyParser.urlencoded({ limit: "1000mb", extended: false }));
router.use(
  bodyParser.json({
    limit: "1000mb",
  })
);

router.get("/get/initial/:value", (req, res) => {
  let val = req.params.value;

  RuleBookBefore.view("rulebook_initial_view", "initialDoc_view", {
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
      ] = `<head>  <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">  </head> ${
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

router.get("/get/final/:value", (req, res) => {
  let val = req.params.value;

  RulebookFInalData.view("delo", "searchDocument", {
    include_docs: true,
    key: val,
  }).then((body) => {
    let toSend = body.rows.map((r) => r.value);
    for (
      let i = 0;
      i < toSend[0].data[toSend[0].version - 1].content.length;
      i++
    ) {
      toSend[0].data[toSend[0].version - 1].content[i] = `<head> <div id="p${
        i + 1
      }"></div><head>   <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet"> </head> <div style="page-break-after:always"></div> ${
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
          toSend[0].data[toSend[0].version - 1].content[i][index - 6].match(
            /#/g
          ) ||
          toSend[0].data[toSend[0].version - 1].content[i][index - 19].match(
            /#/g
          )
        ) {
          return str;
        } else if (
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

      // var changeLinkPDF = new RegExp("http://10.168.64.159.6660/newPage");
      // toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
      //   toSend[0].version - 1
      // ].content[i].replace(changeLinkPDF, "http://10.11.1.59:2929/document");
      var changeLinkPDF = new RegExp("http://10.168.64.159.6660/newPage");
      toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
        toSend[0].version - 1
      ].content[i].replace(changeLinkPDF, "http://hrdapps59:2929/document");

      var changeLinkPDF2 = new RegExp("http://10.168.64.159:2929/document");
      toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
        toSend[0].version - 1
      ].content[i].replace(changeLinkPDF2, "http://hrdapps59:2929/document");
    }
    res.send(toSend[0]);
  });
});

router.get("/get/final_keywords/or/and/:value", (req, res) => {
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

  RulebookFInalData.get(val).then((body) => {
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
      body.data[body.data.length - 1].content[i] = `<div id=p${i + 1}></div> ${
        body.data[body.data.length - 1].content[i]
      }`;
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
          body.data[body.version - 1].content[i][index - 6].match(/#/g) ||
          body.data[body.version - 1].content[i][index - 19].match(/#/g)
        ) {
          return str;
        } else if (
          body.data[body.version - 1].content[i][index - 8].match(
            /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/gi
          ) == null
        )
          return `<i class="small mdi mdi-file-document" style="color:red;background-color:white;"></i> ${str}  `;
        else {
          return `<i class="small mdi mdi-link" style="color:green;background-color:white;"></i> ${str}  `;
        }
      });

      const changeLinkPDF = new RegExp(
        "http://10.168.64.159:6660/newPage",
        "g"
      );
      body.data[body.version - 1].content[i] = body.data[
        body.version - 1
      ].content[i].replace(changeLinkPDF, "http://hrdapps59:2929/document");

      const changeLinkPDF2 = new RegExp(
        "http://10.168.64.159:2929/document",
        "g"
      );
      body.data[body.version - 1].content[i] = body.data[
        body.version - 1
      ].content[i].replace(changeLinkPDF2, "http://hrdapps59:2929/document");
    }

    res.send(body);
  });
});

router.get("/get/final_keywords/multiple/:value", (req, res) => {
  let val = req.params.value;

  let search = [];
  RulebookFInalData.get("6ae914f4049882f985bd8baf20ea5736").then((body) => {
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

  RulebookFInalData.get(val).then((body) => {
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
          body.data[body.version - 1].content[i][index - 6].match(/#/g) ||
          body.data[body.version - 1].content[i][index - 19].match(/#/g)
        ) {
          return str;
        } else if (
          body.data[body.version - 1].content[i][index - 8].match(
            /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/gi
          ) == null
        )
          return `<i class="small mdi mdi-file-document" style="color:red;background-color:white;"></i> ${str}  `;
        else {
          return `<i class="small mdi mdi-link" style="color:green;background-color:white;"></i> ${str}  `;
        }
      });
      // let changeLinkPDF = new RegExp("http://10.168.64.159:6660/newPage", "g");
      // body.data[body.version - 1].content[i] = body.data[
      //   body.version - 1
      // ].content[i].replace(changeLinkPDF, "http://10.11.1.59:2929/document");

      const changeLinkPDF = new RegExp(
        "http://10.168.64.159:6660/newPage",
        "g"
      );
      body.data[body.version - 1].content[i] = body.data[
        body.version - 1
      ].content[i].replace(changeLinkPDF, "http://hrdapps59:2929/document");

      const changeLinkPDF2 = new RegExp(
        "http://10.168.64.159:2929/document",
        "g"
      );
      body.data[body.version - 1].content[i] = body.data[
        body.version - 1
      ].content[i].replace(changeLinkPDF2, "http://hrdapps59:2929/document");
    }

    res.send(body);
  });
});

router.post("/add/final/favorite", (req, res) => {
  let documentNo = req.query.documentNo;
  let employeeID = req.query.employeeID;
  RulebookFInalData.get("6962e85ae13cfdc59db882f0d0aa6352").then((body) => {
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
        RulebookFInalData.get(documentNo).then((body) => {
          if (body.countFavorites) {
            body.countFavorites = body.countFavorites - 1;
          } else body.countFavorites = 1;
          RulebookFInalData.insert(body).then(() => {
            res.send("Removed");
          });
        });
      } else {
        RulebookFInalData.get(documentNo).then((body) => {
          if (body.countFavorites) {
            body.countFavorites = body.countFavorites + 1;
          } else body.countFavorites = 1;

          RulebookFInalData.insert(body).then(() => {
            res.send("Added");
          });
        });
        body.Favorites[index].docs.push(documentNo);
      }
      RulebookFInalData.insert(body);
    } else {
      body.Favorites.push({ id: employeeID, docs: [documentNo] });
      RulebookFInalData.insert(body).then(() => {
        res.send("Added");
      });
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

router.get("/get/checkfavorites", (req, res) => {
  RulebookFInalData.get("6962e85ae13cfdc59db882f0d0aa6352").then((body) => {
    res.send(
      body.Favorites.filter((rec) => {
        return rec.id == req.query.employeeID;
      })
    );
  });
});

const tooltipFunction = (i, val, toSend) => {
  let sql = `SELECT A.DocumentNo, A.DepartmentName, A.SeqNo, A.Content FROM t_InCharge A
       WHERE A.DocumentNo ='${val}'`;
  knex_mysql_Rulebook.raw(sql).then((data) => {
    const body = data[0].map((rec) => {
      return {
        DocumentNo: rec.DocumentNo,
        Department: rec.DepartmentName,
        Content: rec.Content,
      };
    });

    const regexComma = new RegExp(",", "gi");

    for (let j = 0; j < body.length; j++) {
      toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
        toSend[0].version - 1
      ].content[i].replace(body[j].Content, (record) => {
        if (body[j].Content.includes("center")) {
          return `<span style="width:100%" class="tooltip"> <span class="tooltiptext">In-Charge: <br>${body[
            j
          ].Department.replace(regexComma, "<br>")}</span>${record} </span>`;
        } else {
          return `<span class="tooltip"> <span class="tooltiptext">In-Charge: <br>${body[
            j
          ].Department.replace(regexComma, "<br>")}</span>${record} </span>`;
        }
      });
    }
  });
};

// INCHARGE ASSIGN
router.get("/get/final_incharge/:value", async (req, res) => {
  let val = req.params.value;
  let toSend = [];

  RulebookFInalData.view("delo", "searchDocument", {
    include_docs: true,
    key: val,
  })
    .then((body) => {
      toSend = body.rows.map((r) => r.value);
      for (
        let i = 0;
        i < toSend[0].data[toSend[0].version - 1].content.length;
        i++
      ) {
        toSend[0].data[toSend[0].version - 1].content[i] = `<head> <div id="p${
          i + 1
        }"></div><head>   <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet"> </head> <div style="page-break-after:always"></div> ${
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
            toSend[0].data[toSend[0].version - 1].content[i][index - 6].match(
              /#/g
            ) ||
            toSend[0].data[toSend[0].version - 1].content[i][index - 19].match(
              /#/g
            )
          ) {
            return str;
          } else if (
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
          toSend[0].data[toSend[0].version - 1].content[i].match(findXLS) !=
          null
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
        }
        var pdfURL = new RegExp("hrdapps48", "gi");
        toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
          toSend[0].version - 1
        ].content[i].replace(pdfURL, function (str) {
          return `${str}.hrd-s.com`;
        });

        // var changeLinkPDF = new RegExp("http://10.168.64.159.6660/newPage");
        // toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
        //   toSend[0].version - 1
        // ].content[i].replace(changeLinkPDF, "http://10.11.1.59:2929/document");

        // var changeLinkPDF2 = new RegExp("http://10.168.64.159:2929/document");
        // toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
        //   toSend[0].version - 1
        // ].content[i].replace(changeLinkPDF2, "http://10.11.1.59:2929/document");

        var changeLinkPDF = new RegExp("http://10.168.64.159.6660/newPage");
        toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
          toSend[0].version - 1
        ].content[i].replace(changeLinkPDF, "http://hrdapps59:2929/document");

        var changeLinkPDF2 = new RegExp("http://10.168.64.159:2929/document");
        toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
          toSend[0].version - 1
        ].content[i].replace(changeLinkPDF2, "http://hrdapps59:2929/document");

        // Tooltip

        let sql = `SELECT A.DocumentNo, A.DepartmentName, A.SeqNo, A.Content FROM t_InCharge A
         WHERE A.DocumentNo ='${val}'`;
        knex_mysql_Rulebook.raw(sql).then((data) => {
          const body = data[0].map((rec) => {
            return {
              DocumentNo: rec.DocumentNo,
              Department: rec.DepartmentName,
              Content: rec.Content,
            };
          });

          const regexComma = new RegExp(",", "gi");

          for (let j = 0; j < body.length; j++) {
            toSend[0].data[toSend[0].version - 1].content[i] = toSend[0].data[
              toSend[0].version - 1
            ].content[i].replace(body[j].Content, (record) => {
              if (body[j].Content.includes("center")) {
                return `<span style="width:100%" class="tooltip"> <span class="tooltiptext">In-Charge: <br>${body[
                  j
                ].Department.replace(
                  regexComma,
                  "<br>"
                )}</span>${record} </span>`;
              } else {
                return `<span class="tooltip"> <span class="tooltiptext">In-Charge: <br>${body[
                  j
                ].Department.replace(
                  regexComma,
                  "<br>"
                )}</span>${record} </span>`;
              }
            });
          }
        });
        //tooltip
      }
    })
    .then(() => {
      console.log(
        // "22222222222222222222222222222222222222222222222222222222w2222222222222222222222222222222222222222222222222222222222222222222222222"
      );
      setTimeout(() => {
        res.send(toSend[0]);
      }, 3000);
    });
});

module.exports = router;
