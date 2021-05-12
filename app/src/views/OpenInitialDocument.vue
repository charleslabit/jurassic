<template>
  <v-container fluid class="pa-0 ma-0">
    <v-layout align-center justify-center v-if="loading" class="mt-2">
      <!-- <v-flex xs4 offset-xs4> -->
      <a-spin tip="Loading..."> </a-spin>
      <!-- </v-flex> -->
    </v-layout>
    <template v-else>
      <v-toolbar flat>
        <v-toolbar-title>{{ viewedRule._id }}</v-toolbar-title>
        {{ title_spacer }}

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              dark
              rounded
              v-on="on"
              color="#1565c0"
              @click="CloseTab()"
              class="mr-1"
            >
              <v-icon>mdi-arrow-left</v-icon>Back
            </v-btn>
          </template>
          <span>Back</span>
        </v-tooltip>
  

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              dark
              rounded
              v-on="on"
              @click="print()"
              color="#1565c0"
              class="ml-1 mr-1"
            >
              Print
              <v-icon>mdi-printer</v-icon>
            </v-btn>
          </template>
          <span>Print preview</span>
        </v-tooltip>

        <v-spacer></v-spacer>
        <v-btn
          color="success"
          text
          style="pointer-events: none"
          v-if="!this.userInfo.workStation && viewedRule.countFavorites"
        >
          {{ viewedRule.countFavorites }}
          <v-icon color="yellow"> mdi-star </v-icon>
        </v-btn>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              dark
              large
              color="#1565c0"
              v-on="on"
              @click="
                historyDialog = true;
                sortHistory();
              "
              >mdi-database-outline</v-icon
            >
          </template>
          <span>View History</span>
        </v-tooltip>
      </v-toolbar>
      <!-- </div> -->
      <!-- RULEBOOKDOCUMENT LIST-->
      <v-flex pl-1>
        <v-card flat style="overflow-y: scroll" :height="screenSize - 70">
          <v-layout pt-4 row wrap>
            <template>
              <!-- <v-icon @click="SeeMore()">mdi-book</v-icon> -->

              <v-flex xs12 sm12 md12 v-if="hideProperties">
                <v-flex xs12>
                  <a-row
                    type="flex"
                    justify="start"
                    style="border-bottom: 1px solid black"
                  >
                    <a-col @click="Copy()">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            v-on="on"
                            class="disabled"
                            rounded
                            text
                            slot="activator"
                            style="width: 40%"
                          >
                            <span> メール アドレス: </span>
                          </v-btn>
                        </template>

                        <span>Copy mail address to clipboard</span>
                      </v-tooltip>

                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <span
                            v-on="on"
                            v-clipboard="
                              () =>
                                viewedRule.data[viewedRule.version - 1]
                                  .MailAddress
                            "
                            style="font-size: 12px; cursor: pointer"
                            v-if="
                              viewedRule.data[viewedRule.version - 1]
                                .MailAddress
                            "
                          >
                            {{
                              viewedRule.data[viewedRule.version - 1]
                                .MailAddress
                            }}
                          </span>

                          <span v-else> N/A </span>
                        </template>

                        <span>Copy mail address to clipboard</span>
                      </v-tooltip>
                    </a-col>

                    <a-col>
                      <v-btn rounded text class="disabled">
                        開始時期:&nbsp;&nbsp;
                        <span
                          v-if="
                            viewedRule.data[viewedRule.data.length - 1]
                              .BeginningPeriod
                          "
                        >
                          {{
                            viewedRule.data[viewedRule.data.length - 1]
                              .BeginningPeriod
                          }}
                        </span>
                        <span v-else>N/A</span>
                      </v-btn>
                    </a-col>
                    <a-col>
                      <v-btn rounded text class="disabled">
                        <span v-if="viewedRule.RulebookUpdatedDate">
                          ルールブック更新日:&nbsp;&nbsp;
                          {{ viewedRule.RulebookUpdatedDate }}
                        </span>

                        <span v-else>
                          ルールブック更新日:&nbsp;&nbsp; N/A
                        </span>
                      </v-btn>
                    </a-col>
                    <a-col> </a-col>
                  </a-row>
                </v-flex>

                <v-flex xs12>
                  <a-row
                    type="flex"
                    justify="start"
                    style="border-bottom: 1px solid black"
                  >
                    <a-col :span="4">
                      <v-btn rounded text class="disabled">
                        <span v-if="viewedRule.productType">
                          製品区分&nbsp;-&nbsp;
                          {{ viewedRule.productType }}
                        </span>
                        <span v-else> 製品区分&nbsp;-&nbsp; N/A </span>
                      </v-btn>
                    </a-col>
                    <a-col :span="4">
                      <v-btn rounded text class="disabled">
                        区分&nbsp;-&nbsp;
                        <span v-if="viewedRule.criteria">
                          {{ viewedRule.criteria }}
                        </span>
                        <span v-else>N/A</span>
                      </v-btn>
                    </a-col>
                    <a-col :span="4">
                      <v-btn rounded text class="disabled">
                        担当&nbsp;-&nbsp;
                        <span
                          v-if="viewedRule.data[viewedRule.version - 1].Tantou"
                        >
                          {{ viewedRule.data[viewedRule.version - 1].Tantou }}
                        </span>
                        <span v-else>N/A</span>
                      </v-btn>
                    </a-col>
                    <a-col :span="4">
                      <v-btn rounded text class="disabled">
                        担当 部署:&nbsp;&nbsp;
                        <span
                          v-if="
                            viewedRule.data[viewedRule.version - 1].TantouBusho
                          "
                          >{{
                            viewedRule.data[viewedRule.version - 1].TantouBusho
                          }}</span
                        >
                        <span v-else>N/A</span>
                      </v-btn>
                    </a-col>
                    <a-col :span="4">
                      <v-btn rounded text class="disabled">
                        適用区分&nbsp;-&nbsp;
                        <span
                          v-if="
                            viewedRule.data[viewedRule.version - 1].TekiyouKubun
                          "
                          >{{
                            viewedRule.data[viewedRule.version - 1].TekiyouKubun
                          }}</span
                        >
                        <span v-else>N/A</span>
                      </v-btn>
                    </a-col>
                  </a-row>
                </v-flex>

                <v-flex xs12>
                  <a-row type="flex" justify="start">
                    <v-flex xs2>
                      <v-btn rounded text class="disabled">
                        <v-icon
                          v-if="
                            viewedRule.data[viewedRule.version - 1].YumeNoIe
                          "
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;夢の家
                      </v-btn>
                    </v-flex>
                    <v-flex xs2>
                      <v-btn rounded text class="disabled">
                        <v-icon
                          v-if="viewedRule.data[viewedRule.version - 1].Ippan"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;一般
                      </v-btn>
                    </v-flex>

                    <v-flex xs2>
                      <v-btn rounded text class="disabled">
                        <v-icon v-if="viewedRule.data[viewedRule.version - 1].G"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;グランド セゾン
                      </v-btn>
                    </v-flex>
                    <v-flex xs2>
                      <v-btn rounded text class="disabled">
                        <v-icon v-if="viewedRule.data[viewedRule.version - 1].F"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;セゾンF
                      </v-btn>
                    </v-flex>

                    <v-flex xs2>
                      <v-btn rounded text class="disabled">
                        <v-icon v-if="viewedRule.data[viewedRule.version - 1].A"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;セゾンA
                      </v-btn>
                    </v-flex>
                    <v-flex xs2>
                      <v-btn rounded text class="disabled">
                        <v-icon v-if="viewedRule.data[viewedRule.version - 1].B"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;ブリアール
                      </v-btn>
                    </v-flex>
                  </a-row>
                </v-flex>

                <v-flex xs12>
                  <a-row type="flex" justify="start">
                    <v-flex xs2>
                      <v-btn rounded text class="disabled">
                        <v-icon
                          v-if="
                            viewedRule.data[viewedRule.version - 1]['F2-TD']
                          "
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;セゾンF2-TD
                      </v-btn>
                    </v-flex>

                    <v-flex xs2>
                      <v-btn rounded text class="disabled">
                        <v-icon
                          v-if="viewedRule.data[viewedRule.version - 1].Icube"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;Icube
                      </v-btn>
                    </v-flex>

                    <v-flex xs2>
                      <v-btn rounded text class="disabled">
                        <v-icon
                          v-if="viewedRule.data[viewedRule.version - 1].Ismart"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;Ismart
                      </v-btn>
                    </v-flex>

                    <v-flex xs2>
                      <v-btn rounded text class="disabled">
                        <v-icon
                          v-if="viewedRule.data[viewedRule.version - 1].Ismile"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;Ismile
                      </v-btn>
                    </v-flex>

                    <v-flex xs2>
                      <v-btn rounded text class="disabled">
                        <v-icon
                          v-if="viewedRule.data[viewedRule.version - 1].Taishin"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;耐震
                      </v-btn>
                    </v-flex>
                    <v-flex xs2>
                      <v-btn rounded text class="disabled">
                        <v-icon
                          v-if="viewedRule.data[viewedRule.version - 1].Menshin"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;免震
                      </v-btn>
                    </v-flex>
                  </a-row>
                </v-flex>
              </v-flex>

              <!-- row3****************************************************************** -->
              <!-- <v-flex xs12> -->
              <v-layout
                pt-4
                pl-4
                style="
                  border-bottom: 1px solid black;
                  border-top: 1px solid black;
                "
              >
                <p style="font-size: 20px; padding-top: 0">件名: &nbsp;</p>
                <p>
                  <span
                    style="font-size: 20px; padding-top: 0; font-weight: bold"
                    v-html="viewedRule.data[viewedRule.version - 1].RuleKenmei"
                  ></span>
                </p>
                <v-spacer></v-spacer>
                <v-tooltip bottom v-if="!hideProperties">
                  <template v-slot:activator="{ on }">
                    <v-btn color="#1565c0" v-on="on" text @click="SeeMore()">
                      <span>View more details</span>

                      <v-icon> mdi-arrow-down-circle </v-icon>
                    </v-btn>
                  </template>
                  <span>View more details</span>
                </v-tooltip>

                <v-tooltip bottom v-else>
                  <template v-slot:activator="{ on }">
                    <v-btn color="#1565c0" v-on="on" text @click="SeeMore()">
                      <span>Hide</span>

                      <v-icon> mdi-arrow-up-circle </v-icon>
                    </v-btn>
                  </template>
                  <span>Hide details</span>
                </v-tooltip>
              </v-layout>
              <br />
              <!-- <hr /> -->
              <!-- </v-flex> -->
              <v-container id="myPrintData" fluid>
                <v-flex
                  xs12
                  v-for="(item, index) in viewedRule.data[
                    viewedRule.version - 1
                  ].content"
                  :key="index"
                >
                  <v-card flat class="pa-9">
                    <!-- {{item}} -->

                    <div class="fr-view" v-html="item"></div>
                  </v-card>
                  <v-spacer></v-spacer>
                </v-flex>
              </v-container>

              <v-flex>
                <a-row type="flex" justify="end">
                  <a-col>
                    <v-btn rounded text class="disabled">
                      <span
                        v-if="
                          viewedRule.data[viewedRule.version - 1].UpdatedDate
                        "
                      >
                        システム更新日:&nbsp;&nbsp;
                        {{
                          viewedRule.data[viewedRule.version - 1].UpdatedDate
                        }}
                      </span>
                      <span v-else> システム更新日:&nbsp;&nbsp; N/A </span>
                    </v-btn>
                  </a-col>
                </a-row>
              </v-flex>
            </template>
          </v-layout>
          <!-- </div> -->
        </v-card>
      </v-flex>
    </template>

    <v-dialog v-model="historyDialog" max-width="1000px" scrollable>
      <v-card>
        <v-toolbar dense flat>
          <span style="font-size: 24px">History Logs </span>
          <v-spacer></v-spacer>
          <v-icon @click="historyDialog = false">mdi-close</v-icon>
        </v-toolbar>

        <a-row type="flex" justify="start">
          <a-col :span="5" style="text-align: center"> Updated Date </a-col>
          <a-col :span="15" style="text-align: center"> Remarks </a-col>
          <a-col :span="4" style="text-align: center"> Person-in-Charge </a-col>
        </a-row>
        <template v-for="(item, index) in historyDetails">
          <v-card
            style="cursor: pointer"
            @click="
              viewHistory(index);
              historyDialog = false;
            "
            :key="index"
            flat
          >
            <v-layout
              id="hover"
              @click="searchList = index"
              :class="listColorSearch(index)"
            >
              <v-flex xs12 s6 md3 class="pl-3">
                {{ index + 1 }}. &nbsp;
                {{ item.UpdatedDate }}
              </v-flex>
              <v-flex xs12 s6 md7>
                <div style="word-wrap: break-word">
                  {{ item.ApprovalRemarks }}
                </div>
              </v-flex>
              <v-flex xs12 s6 md2 style="text-align: center">
                {{ item.personInCharge }}
              </v-flex>
            </v-layout>
          </v-card>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  title() {
    return `@Rulebook ${this.$route.params.id.substring(0, 9)}`;
  },
  name: "newPage",
  props: ["search"],
  data() {
    return {
      // loading: false,
      title_spacer: "　",
      LINKSSSS: "",
      pdfNo: "",
      viewedRule: {
        approver: "",
        criteria: "",
        data: [
          {
            SeihinKubun: "",
            KanriBangou: "",
            RuleKenmei: "",
            Kubun: "",
            YumeNoIe: true,
            Ippan: true,
            Icube: false,
            Ismart: false,
            Taishin: true,
            Menshin: true,
            Tantou: "",
            MailAddress: "",
            TantouBusho: "",
            TekiyouKubun: "",
            UpdatedDate: "",
          },
        ],
        documentType: "RULEBOOK",
        isApproved: true,
        method: "JIKU",
        productType: "外部付帯",
        updated: true,
        version: 1,
        _id: "",
        _rev: "0",
      },
      loading: false,
      favoriteColor: 0,
      favoriteUsers: [],
      rndConditionDialog: false,
      rndConditionRemarks: "",
      historyDialog: false,
      historyDetails: "",
      historyCount: 0,
      searchList: "",
      hideProperties: false,
    };
  },
   created() {
    this.initialLoad();
  },
  computed: {
    screenSize() {
      return this.$vuetify.breakpoint.height;
    },
  },

  methods: {
     initialLoad() {
      let url = `${this.api}document/get/initial/${this.$route.params.id}`;
       console.log(url)

       axios.get(url).then((res) => {
        this.viewedRule = res.data;
      })
      .then(() => {
        this.print();
        

      });
    },

    CloseTab() {
      window.close();
    },

    SeeMore() {
      // axios.get(`${this.api}openmail`)
      if (this.hideProperties) {
        this.hideProperties = false;
      } else {
        this.hideProperties = true;
      }
    },

    openPDF() {
      let filePath = "file://rndfsv01.hrd-s.com/section2/manual/rulebook/";
      // let url = "file://rndfsv01.hrd-s.com/section2/manual/rulebook/koushin21-01/AFTER THE MEETING/arai/191011-14.pdf"
      // window.open(url)
      // function loadFile(filePath) {
      var result = null;
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", filePath, false);
      xmlhttp.send();
      if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
      }
      return result;
      // }
    },

    print() {
 

      var printContents = document.getElementById("myPrintData").innerHTML;
      var originalContents = document.body.innerHTML;
      document.title = this.$route.params.id;

      document.body.innerHTML =
        this.$route.params.id +
        this.title_spacer +
        this.viewedRule.data[this.viewedRule.version - 1].RuleKenmei +
        printContents;

      window.print();
      window.close()
      // window.location.reload();
      document.body.innerHTML = originalContents;
    },

    sortHistory() {
      let viewedRuleDataHolder = this.viewedRule.data;
      if (this.historyCount == 0) {
        this.historyDetails = viewedRuleDataHolder.reverse();
        this.historyCount = this.historyCount + 1;
      }
    },
    viewHistory(val) {
      this.viewedRule.version = val + 1;
      // this.historyDialog = false
    },

    listColorSearch(id) {
      if (this.searchList == id) {
        return "viewed";
      }
    },

    Copy() {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Copy mail address to clipboard",
        showConfirmButton: false,
        timer: 800,
      });
    },
  },
};
</script>

<style scoped>
#hover:hover {
  background-color: #daf5b3;
}

.viewed {
  background-color: #daf5b3;
}

@media print {
  body {
    position: static;
  }
  /* table { 
    max-height: 100%;
    overflow: hidden;
    page-break-after: always;
  } */

  /* html, body {
    height:100%; 
    margin: 0 !important; 
    padding: 0 !important;
    overflow: hidden;
  } */

  div.v-toolbar * {
    display: none !important;
  }
  div.v-toolbar__content * {
    display: none !important;
  }
  nav.v-toolbar.elevation-0.theme--light {
    display: none !important;
  }

  div.ant-tabs-nav-scroll * {
    display: none !important;
  }
  div.v-card.v-card--flat.v-sheet.theme--light {
    margin: 0mm;
    padding: 0mm;
    overflow-y: visible !important;
    position: relative;
  }

  /* size: A4 portrait */
  /* size:297mm 210mm;   */
}
</style>
