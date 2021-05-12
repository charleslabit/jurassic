<template>
  <v-container pa-0 fluid>
    <v-layout align-center justify-center v-if="!JWWLoading">
      <a-spin class="mt-2" tip="Loading..." />
    </v-layout>

    <v-container pa-0 fluid v-else>
      <v-card class="ma-2 pa-2" flat style="background-color:#f6f5f5;">
        <v-row dense>
          <v-col cols="12" sm="6" md="4">
            <a-input
              addon-before="Search"
              style="width: 100%"
              v-model="toSearchJWW"
              placeholder="Search file"
              append-icon="search"
              outlined
            ></a-input>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-layout row wrap>
              <span style="font-weight: bold" class="mt-1 mr-1">品種:</span>
              <a-select v-model="Variety" :style="WidthFile" id="v-step-f2">
                <a-select-option
                  v-for="item in OptVariety"
                  :key="item"
                  v-value="item"
                  >{{ item }}</a-select-option
                >
              </a-select>
            </v-layout>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <span style="font-weight: bold" class="mt-1 mr-1"
              >Specifications:</span
            >
            <a-select
              id="v-step-f3"
              mode="multiple"
              v-model="Specifications"
              :style="WidthFile2"
            >
              <a-select-option
                v-for="item in OptSpecs"
                :key="item.value"
                v-value="item.value"
                >{{ item.text }}</a-select-option
              >
            </a-select>
          </v-col>
          <v-col>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="isRND()"
                  @click="
                    addFilesDialog = true;
                    toSendJWWFile = {};
                    JWWTitle = 'Register New File';
                  "
                  v-on="on"
                  color="#1565c0"
                  dark
                >
                  NEW RECORD
                </v-btn>
              </template>
              <span>Register New File</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-card>
      <v-layout>
        <!-- <v-spacer/> -->
        <span style="color:#0f3057; font-weight: bold; margin-right:4px">
          Total: {{ filteredJWW.length }}
        </span>
      </v-layout>

      <v-data-table
        :headers="columns"
        :items="filteredJWW"
        fixed-header
        dense
        :height="screenHeight - 420"
        :items-per-page="20"
      >
        <template v-slot:item.Edit="{ item }">
          <v-icon style="font-size: 18px;" @click="editJWWFile(item)"
            >mdi-file-outline</v-icon
          >
        </template>

        <template v-slot:item.JWWFile="{ item }">
          <span
            @click="FileSrc(item.JWWFile)"
            style="cursor: pointer; color: #3ba9ed"
            >データリンク</span
          >
        </template>
        <template v-slot:item.DXFFile="{ item }">
          <span
            @click="FileSrc(item.DXFFile)"
            style="cursor: pointer; color: #3ba9ed"
            >データリンク</span
          >
        </template>
        <template v-slot:item.Ippan="{ item }">
          <v-icon v-if="item.Ippan" style="font-size: 18px;"
            >mdi-circle-outline</v-icon
          >
        </template>
        <template v-slot:item.YumeNoIe="{ item }">
          <v-icon v-if="item.YumeNoIe" style="font-size: 18px;"
            >mdi-circle-outline</v-icon
          >
        </template>
        <template v-slot:item.G="{ item }">
          <v-icon v-if="item.G" style="font-size: 18px;"
            >mdi-circle-outline</v-icon
          >
        </template>
        <template v-slot:item.F="{ item }">
          <v-icon v-if="item.F" style="font-size: 18px;"
            >mdi-circle-outline</v-icon
          >
        </template>
        <template v-slot:item.A="{ item }">
          <v-icon v-if="item.A" style="font-size: 18px;"
            >mdi-circle-outline</v-icon
          >
        </template>
        <template v-slot:item.B="{ item }">
          <v-icon v-if="item.B" style="font-size: 18px;"
            >mdi-circle-outline</v-icon
          >
        </template>
        <template v-slot:item.iCube="{ item }">
          <v-icon v-if="item.iCube" style="font-size: 18px;"
            >mdi-circle-outline</v-icon
          >
        </template>
        <template v-slot:item.iSmart="{ item }">
          <v-icon v-if="item.iSmart" style="font-size: 18px;"
            >mdi-circle-outline</v-icon
          >
        </template>
      </v-data-table>
    </v-container>

    <v-dialog v-model="addFilesDialog" max-width="800" persistent>
      <v-card>
        <v-toolbar dense flat>
          <v-toolbar-title>{{ JWWTitle }}</v-toolbar-title>
          <v-spacer />

          <v-icon @click="addFilesDialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-layout row wrap pt-2>
          <v-flex xs3 sm2 class="pa-1">
            <a-checkbox v-model="toSendJWWFile.Ippan">一般工法</a-checkbox>
          </v-flex>
          <v-flex xs2 sm2 class="pa-1">
            <a-checkbox v-model="toSendJWWFile.YumeNoIe">夢の家</a-checkbox>
          </v-flex>
          <v-flex xs2 sm1 class="pa-1">
            <a-checkbox v-model="toSendJWWFile.G">G</a-checkbox>
          </v-flex>
          <v-flex xs2 sm1 class="pa-1">
            <a-checkbox v-model="toSendJWWFile.F">F</a-checkbox>
          </v-flex>
          <v-flex xs2 sm1 class="pa-1">
            <a-checkbox v-model="toSendJWWFile.A">A</a-checkbox>
          </v-flex>
          <v-flex xs2 sm1 class="pa-1">
            <a-checkbox v-model="toSendJWWFile.B">B</a-checkbox>
          </v-flex>
          <v-flex xs2 sm2 class="pa-1">
            <a-checkbox v-model="toSendJWWFile.iCube">i-cube</a-checkbox>
          </v-flex>
          <v-flex xs2 sm2 class="pa-1">
            <a-checkbox v-model="toSendJWWFile.iSmart">i-smart</a-checkbox>
          </v-flex>
          <v-flex xs12 sm6 class="pa-1">
            <a-input
              placeholder="ID"
              v-model="toSendJWWFile._id"
              :disabled="!toSendJWWFile._rev ? false : true"
            />
          </v-flex>
          <v-flex xs12 sm6 class="pa-1">
            <a-select
              v-model="toSendJWWFile.variety"
              style="width: 100%"
              placeholder="Variety"
            >
              <a-select-option
                v-for="item in OptVariety"
                :key="item"
                v-value="item"
                >{{ item }}</a-select-option
              >
            </a-select>
          </v-flex>
          <v-flex xs12 sm6 class="pa-1">
            <a-input placeholder="Hinban" v-model="toSendJWWFile.hinban" />
          </v-flex>
          <v-flex xs12 sm6 class="pa-1">
            <a-input placeholder="Buzai" v-model="toSendJWWFile.buzai" />
          </v-flex>
          <v-flex xs12 sm6 class="pa-1">
            <a-input
              placeholder="JWW File Path"
              v-model="toSendJWWFile.JWWFile"
            />
          </v-flex>
          <v-flex xs12 sm6 class="pa-1">
            <a-input
              placeholder="DXF File Path"
              v-model="toSendJWWFile.DXFFile"
            />
          </v-flex>
        </v-layout>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="SaveJWWFile()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
const columns = [
  {
    text: "Edit",
    value: "Edit",
    align: "center",
    divider: true,
    width: "5%",
    class: "blue darken-4 white--text",
    sortable: false,
    // dataIndex: "iSmart",
    // scopedSlots: { customRender: "iSmart" },
  },
  {
    // dataIndex: "variety",
    value: "variety",
    text: "品種",
    divider: true,
    width: "25%",
    class: "blue darken-4 white--text",
    sortable: false,
  },
  {
    text: "品番",
    // dataIndex: "hinban",
    value: "hinban",
    divider: true,
    width: "5%",
    class: "blue darken-4 white--text",
    sortable: false,
  },
  {
    text: "部材説明",
    // dataIndex: "buzai",
    value: "buzai",
    divider: true,
    width: "18%",
    class: "blue darken-4 white--text",
    sortable: false,
  },
  {
    text: "JWW",
    value: "JWWFile",
    divider: true,
    width: "13%",
    class: "blue darken-4 white--text",
    sortable: false,
    // dataIndex: "JWWFile",
    // scopedSlots: { customRender: "JWWFile" },
  },
  {
    text: "DXF",
    value: "DXFFile",
    divider: true,
    width: "13%",
    class: "blue darken-4 white--text",
    sortable: false,
    // dataIndex: "DXFFile",
    // scopedSlots: { customRender: "DXFFile" },
  },
  // {
  //   text: "一般工法",
  //   value: "Ippan",
  //   divider: true,
  //   width: "10%",
  //   align: "center",
  //   class: "blue darken-4 white--text",
  //   sortable: false,

  // },
  // {
  //   text: "夢の家",
  //   value: "YumeNoIe",
  //   divider: true,
  //   width: "10%",
  //   class: "blue darken-4 white--text",
  //   sortable: false,
  //   align: "center",

  // },
  {
    text: "G",
    value: "G",
    divider: true,
    width: "7%",
    class: "blue darken-4 white--text",
    sortable: false,
    align: "center",
    // dataIndex: "G",
    // scopedSlots: { customRender: "G" },
  },
  {
    text: "F",
    value: "F",
    divider: true,
    width: "5%",
    class: "blue darken-4 white--text",
    align: "center",
    sortable: false,
    // dataIndex: "F",
    // scopedSlots: { customRender: "F" },
  },
  {
    text: "A",
    value: "A",
    divider: true,
    width: "5%",
    align: "center",
    class: "blue darken-4 white--text",
    sortable: false,
    // dataIndex: "A",
    // scopedSlots: { customRender: "A" },
  },
  {
    text: "B",
    value: "B",
    divider: true,
    width: "5%",
    align: "center",
    class: "blue darken-4 white--text",
    sortable: false,
    // dataIndex: "B",
    // scopedSlots: { customRender: "B" },
  },
  {
    text: "i-cube",
    value: "iCube",
    align: "center",
    divider: true,
    width: "5%",
    class: "blue darken-4 white--text",
    sortable: false,
    // dataIndex: "iCube",
    // scopedSlots: { customRender: "iCube" },
  },
  {
    text: "i-smart",
    value: "iSmart",
    align: "center",
    divider: true,
    width: "5%",
    class: "blue darken-4 white--text",
    sortable: false,
    // dataIndex: "iSmart",
    // scopedSlots: { customRender: "iSmart" },
  },
];

import axios from "axios";
import Swal from "sweetalert2";
import AWS from "aws-sdk";
import tunnel from "tunnel";
import config from "../config";
import FileSaver from "file-saver";
import * as binconv from "binconv";

export default {
  data() {
    return {
      jwwData: [],
      buildingSpecificationList: [
        { text: "ALL", value: "ALL" },
        { text: "耐震", value: "Taishin" },
        { text: "免震", value: "Menshin" },
      ],
      selectedBuildingType: ["ALL"],
      selectedBuildingSpecification: ["ALL"],
      columns,
      toSearchJWW: "",
      Specifications: ["All"],
      OptVariety: [
        "All",
        "エコカラット割り付け図(｢i-cube 240+｣)",
        "エコカラット割り付け図(｢i-cube 260+｣)",
        "エコカラット割り付け図(｢i-smart 240+｣)",
        "エコカラット割り付け図(｢i-smart 260+｣)",
        "エコカラット割り付け図(｢夢の家 240｣)",
        "エコカラット割り付け図(｢夢の家 265｣)",
        "オリジナルテレビボード",
        "玄関上がり框",
        "勾配天井",
        "自在棚",
        "システムクローゼット(ユニット) ケーシング枠",
        "システムパントリー(ユニット)ケーシング枠",
        "白木調造作造作材",
        "スリットウォール",
        "スリットスライダー建具 (洋室)",
        "スリットスライダー建具 (和室)",
        "スリットルーバー",
        "ソリッドウッドパネル",
        "ソロモンマホガニー造作材",
        "タレ壁３方枠（白木調造作）",
        "タレ壁３方枠（白松造作）",
        "タレ壁３方枠（木調造作）",
        "タレ壁３方枠（木調造作/白木調造作）",
        "トータルシステムクローゼット(ウォークインタイプ)",
        "トータルシステムクローゼット(ユニット)",
        "トータルシステムクローゼット(ユニット) ケーシング枠",
        "ブックシェルフ(ユニット))ケーシング枠",
        "フリーカウンター",
        "丸棒手摺金物",
        "ユニット出窓",
        "リモコンニッチ",
        "ロフト",
        "和室建具平面図（白木調造作）",
        "和室建具平面図（白松造作）",
        "和室建具平面図（檜造作）",
        "階段関係",
        "階段関係　（240+）",
        "階段関係　（260+）",
        "掘座卓",
        "高性能樹脂サッシ(Sマホガ二ー造作)",
        "高性能樹脂サッシ(キッチン樹脂枠)",
        "高性能樹脂サッシ(白木調造作)",
        "高性能樹脂サッシ(白松造作)",
        "高性能樹脂サッシ(白松造作・内障子枠)",
        "高性能樹脂サッシ(檜造作)",
        "高性能樹脂サッシ(木調造作)",
        "高性能樹脂サッシ（木調造作/白木調造作）",
        "室内明かりとり",
        "住設",
        "造作材",
        "白松造作造作材",
        "木調造作材",
        "洋室建具平面図（Sマホガニー造作）",
        "洋室建具平面図（木調造作）",
        "洋室建具平面図（木調造作/白木調造作）",
        "檜造作造作材",
      ],
      Variety: "All",
      OptSpecs: [
        { text: "All", value: "All" },
        { text: "一般工法", value: "Ippan" },
        { text: "夢の家", value: "YumeNoIe" },
        { text: "G", value: "G" },
        { text: "F", value: "F" },
        { text: "A", value: "A" },
        { text: "B", value: "B" },
        { text: "i-cube", value: "iCube" },
        { text: "i-smart", value: "iSmart" },
      ],
      addDialog: false,
      addFilesDialog: false,
      toSendJWWFile: {},
      JWWTitle: "",
      JWWLoading: false,
    };
  },

  created() {
    this.JWWLoading = false;
    this.loadJWWFile();
  },
  watch: {
    selectedBuildingType() {
      if (
        this.selectedBuildingType.includes("ALL") &&
        this.selectedBuildingType.length == 2
      ) {
        this.selectedBuildingType.splice(0, 1);
      }
      if (this.selectedBuildingType.length == 0) {
        this.selectedBuildingType = ["ALL"];
      }
      if (
        this.selectedBuildingType.includes("ALL") &&
        this.selectedBuildingType.length != 1
      ) {
        this.selectedBuildingType = ["ALL"];
      }
    },

    selectedBuildingSpecification() {
      if (
        this.selectedBuildingSpecification.includes("ALL") &&
        this.selectedBuildingSpecification.length == 2
      ) {
        this.selectedBuildingSpecification.splice(0, 1);
      }
      if (this.selectedBuildingSpecification.length == 0) {
        this.selectedBuildingSpecification = ["ALL"];
      }
      if (
        this.selectedBuildingSpecification.includes("ALL") &&
        this.selectedBuildingSpecification.length != 1
      ) {
        this.selectedBuildingSpecification = ["ALL"];
      }
    },
  },
  methods: {
    loadJWWFile() {
      // axios.defaults.headers.common["x-api-key"] =
      //   "H8Pt5n6cbFk95UiXQjwZ9cwu6mcZqfF2rTw3HeS3";
      let url = `${this.api}jwwdxf/get?docType=JWW`;
      axios.get(url).then((res) => {
        res.data = res.data.map((rec, index) => {
          rec.key = index;
          return rec;
        });

        this.jwwData = res.data;
        this.jwwData.sort((a, b) => (a._id > b._id ? 1 : -1));
        this.JWWLoading = true;

        // console.log(this.jwwData);
      });
    },

    editJWWFile(data) {
      this.JWWTitle = "Edit File Details";
      this.addFilesDialog = true;
      this.toSendJWWFile = Object.assign({}, data);
      console.log(this.toSendJWWFile);
    },

    SaveJWWFile() {
      this.toSendJWWFile.documentType = "JWW";
      let title = "";
      if (!this.toSendJWWFile._rev) {
        title = "Successfully Saved";
      } else {
        title = "Successfully Updated";
      }
      let url = `${this.api}jwwdxf/add`;
      axios.post(url, this.toSendJWWFile).then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: title,
          showConfirmButton: false,
          timer: 1500,
        });
        this.addFilesDialog = false;
        this.loadJWWFile();
      });
    },

    FileSrc(filename) {
      // console.log(filename);
      // console.log(filename.substring(filename.length, filename.length - 3));
      var tunnelingAgent = tunnel.httpsOverHttp({
        proxy: {
          // Proxy settings
          host: "hrdproxy.hrd-s.com",
          port: 81,
          proxyAuth: "administrator:system",
        },
      });
      // console.log(tunnelingAgent, "proxy");

      AWS.config.update({
        httpOptions: { agent: tunnelingAgent },
        region: "us-east-2",
        credentials: config,
      });
      var s3 = new AWS.S3({
        // AccessKeyID: "AKIA2FWIWPI5YVES3XEU",
        AccessKeyID: "AKIA2FWIWPI5THZHNWHQ",
        // SecretAccessKey: "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",
        SecretAccessKey: "Dq8KzBreAzA1BOTvKfWCOqjMfxKlPDFJc9JV6T8k",
        Region: "us-east-2",
        params: {
          bucket: "rulebook.files",
        },
      });

      var options = {
        Bucket: "rulebook.files",
        Key: `JWW_Files/${filename}`,
      };
      // console.log(s3, "s3");

      s3.getObject(options, function(err, data) {
        if (err) console.log(err, err.stack);
        // an error occurred
        else {
          // console.log(data);
          var blob = new Blob([binconv.uint8ArrayToBlob(data.Body)], {
            type: `${data.ContentType};charset=utf-8`,
          });

          FileSaver.saveAs(blob, `${filename}`);
        } // successful response
      });
    },
  },
  computed: {
    WidthFile() {
      if (this.$vuetify.breakpoint.name == "xs") {
        return "width:87%; margin-left:26px";
      } else return "width:88%";
    },
    WidthFile2() {
      if (this.$vuetify.breakpoint.name == "xs") {
        return "width:80%; ";
      } else return "width: 70%";
    },

    filteredSpecs() {
      if (this.jwwData.length > 0) {
        let notAll = this.Specifications == "All";
        return this.jwwData
          .filter((r) => {
            if (this.Variety == "All") {
              return r;
            } else {
              return r.variety == this.Variety;
            }
          })
          .filter((s) => {
            if (this.Specifications == "All") {
              return s;
            } else {
              return [];
            }
          })
          .filter((r) => {
            if (this.Specifications == "Ippan" && !notAll) {
              return r.Ippan;
            } else {
              return [];
            }
          })
          .filter((r) => {
            if (this.Specifications == "YumeNoIe" && !notAll) {
              return r["YumeNoIe"];
            } else {
              return [];
            }
          })
          .filter((r) => {
            if (this.Specifications == "G" && !notAll) {
              return r["G"];
            } else {
              return [];
            }
          })
          .filter((r) => {
            if (this.Specifications == "F" && !notAll) {
              return r["F"];
            } else {
              return [];
            }
          })
          .filter((r) => {
            if (this.Specifications == "A" && !notAll) {
              return r["A"];
            } else {
              return [];
            }
          })
          .filter((r) => {
            if (this.Specifications == "B" && !notAll) {
              return r["B"];
            } else {
              return [];
            }
          })
          .filter((r) => {
            if (this.Specifications == "iCube" && !notAll) {
              return r["iCube"];
            } else {
              return [];
            }
          })
          .filter((r) => {
            if (this.Specifications == "iSmart" && !notAll) {
              return r["iSmart"];
            } else {
              return [];
            }
          });
      } else {
        return [];
      }
    },
    filteredJWW() {
      if (this.filteredSpecs.length > 0) {
        return this.filteredSpecs.filter((data) => {
          let search = new RegExp(this.toSearchJWW.toUpperCase(), "g");
          return JSON.stringify(Object.values(data))
            .toUpperCase()
            .match(search);
        });
      } else {
        return [];
      }
    },
  },
};
</script>
<style scoped>
div {
  margin: 0 0 0 0;
}
thead.ant-table-thead > tr > th {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  text-align: left;
  color: #fafafa;
  background-color: gray;
  border-bottom: 1px solid #e8e8e8;
  -webkit-transition: background 0.3s ease;
  transition: background 0.3s ease;
}
</style>
