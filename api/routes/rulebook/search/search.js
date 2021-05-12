const express = require("express");
const router = express.Router();
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

// get/title_rules
router.get("/get/content", (req, res) => {
  RulebookFInalData.view("delo", "new_title_content", {}).then((body) => {
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
      let content = data
        .filter((r) => {
          if (req.query.except) {
            return (
              !r.title.includes(req.query.except) &&
              !r.content.toString().includes(req.query.except)
            );
          } else return r;
        })
        .map((rec) => {
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

//   get/title_rules/and
router.get("/get/content/and", (req, res) => {
  RulebookFInalData.view("delo", "new_title_content", {}).then((body) => {
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
      let content = data
        .filter((r) => {
          if (req.query.except) {
            return (
              !r.title.includes(req.query.except) &&
              !r.content.toString().includes(req.query.except)
            );
          } else return r;
        })
        .map((rec) => {
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

//   get/multiple_rules
router.get("/get/content/multiple", async (req, res) => {
  let keywords = [];
  await RulebookFInalData.get("6ae914f4049882f985bd8baf20ea5736").then(
    (body) => {
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
    }
  );
  var merged = [].concat.apply([], keywords);
  if (merged.length > 0) {
    await RulebookFInalData.view("delo", "new_title_content", {}).then(
      (body) => {
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
          let content = data
            .filter((r) => {
              if (req.query.except) {
                return (
                  !r.title.includes(req.query.except) &&
                  !r.content.toString().includes(req.query.except)
                );
              } else return r;
            })
            .map((rec) => {
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
      }
    );
  } else res.send("No data in master");
});







router.get('/get/multiple_rules2', (req, res) => {
  let keywords = []
  const params = {
    TableName: RULEBOOK_DOCUMENTS_TBL,
    Key: { _id: '12345678910', documentType: 'MASTER' }
  }
  dynamoDb.get(params, (error, result) => {
    if (error) {
      res.send(error.message)
    } else {
      //==All records in master
      let master = result.Item.data
      let search = ''

      if (req.query.search.includes('　')) {
        search = req.query.search.replace(/\s+/g, ' ').split(' ')
      } else {
        search = req.query.search.replace(/\s+/g, ' ').split(' ')
      }

      //===Get all keywords to be search
      search.map(r2 => {
        //==Search if groupname
        if (master[r2]) {
          keywords.push(r2)
          master[r2].map((r, i) => {
            //==keywords
            if (typeof r == 'string') {
              keywords.push(r)
            }
            //==subgroup
            else {
              if (r.sGroup) {
                r.sGroup.map(s => {
                  keywords.push(s)
                  master[s].map(sData => {
                    if (typeof sData == 'string') {
                      keywords.push(sData)
                    }
                  })
                })
              }
            }
          })
        }
        //==Search if keyword
        else {
          // console.log('keyword')
          let gName = ''
          let propS = Object.keys(master)
          if (propS) {
            propS.map(rec => {
              master[rec].map(r => {
                //==keywords
                if (typeof r == 'string') {
                  if (r == r2) {
                    gName = rec
                    keywords.push(rec)
                  }
                }
              })
            })
            if (gName) {
              master[gName].map(rec => {
                if (typeof rec == 'string') {
                  keywords.push(rec)
                } else {
                  rec.sGroup.map(r => {
                    keywords.push(r)
                    master.data[r].map(s => {
                      if (typeof s == 'string') {
                        keywords.push(s)
                      }
                    })
                  })
                }
              })
            }
          }
        }
      })
      //  res.send(keywords)
      if (keywords.length > 0) {
        getRuleBookDocuments().then(data => {
          let search = keywords

          let searchArr = search.map(searchKey => {
            let temp = data.filter(rec => {
              if (rec.content) {
                return (
                  rec.title.includes(searchKey) ||
                  rec.content.toString().includes(searchKey) ||
                  rec._id.includes(searchKey)
                )
              }
            })
            return temp
          })
          let toSend = searchArr.map(data => {
            let content = data
              .filter(r => {
                // console.log(req.query.except)
                if (req.query.except) {
                  return (
                    !r.title.includes(req.query.except) &&
                    !r.content.includes(req.query.except)
                  )
                } else return r
              })
              .map(rec => {
                let str = rec.content.toString().replace(/(<([^>]+)>)/gi, '')
                let fStr = str.replace(/&nbsp;/gi, '')
                search.map(q => {
                  var re = new RegExp(q, 'g')
                  fStr = fStr.replace(re, function (str) {
                    return `<span style="background-color:yellow"><b>${str}</b></span>`
                  })
                  // let index = fStr.indexOf(`${q}`);
                  let indices = []
                  var highLight = new RegExp(
                    '<span style="background-color:yellow"><b>',
                    'g'
                  )
                  while ((result = highLight.exec(fStr))) {
                    indices.push(result.index)
                  }
                  // console.log(indices)
                  let start = 0
                  if (indices.length > 0) {
                    // console.log('aaa')
                    if (indices[0] < 20) {
                      start = indices[1]
                    } else start = indices[0]
                    fStr = fStr.substring(start - 20, fStr.length)
                  } else {
                    // console.log('bbb')
                    fStr = fStr.substring(0, 50)
                  }
                  rec.title = rec.title.replace(re, function (str) {
                    return `<b>${str}</b>`
                  })
                })

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
                  'F2-TD': rec['F2-TD'],
                  Ismile: rec.Ismile,
                  countViews: rec.countViews,
                  FavoritesCount: rec.FavoritesCount
                }
              })
            return content
          })
          let content = []
          for (let i = 0; i < toSend.length; i++) {
            for (let h = 0; h < toSend[i].length; h++) {
              content.push(toSend[i][h])
            }
          }

          const uniqueElementsBy = (arr, fn) =>
            arr.reduce((acc, v) => {
              if (!acc.some(x => fn(v, x))) acc.push(v)
              return acc
            }, [])

          let x = uniqueElementsBy(content, (a, b) => a._id == b._id)
          res.send(x)
          // });
        })
      } else {
        res.send('No data in master')
      }
    }
  })
})

module.exports = router;
