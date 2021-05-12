<template>
  <v-container fluid pa-1 ma-0>
    <v-layout align-center justify-center v-if="loading" pt-3>
      <a-spin tip="Loading..."> </a-spin>
    </v-layout>

    <v-layout v-else class="mt-1">
      <v-flex
        pl-1
        v-if="
            !rulecontent
        "
      >
        <v-card>
          <v-row dense no-gutters>
            <v-col cols="7">
              <v-text-field
                dense
                outlined
                class="mr-2 ml-2"
                label="Search"
                v-model="toSearch"
                append-icon="mdi-magnify"
                @keypress="intPageNo = 1"
              ></v-text-field>
            </v-col>

            <v-spacer></v-spacer>
            <span class="mt-2 mr-4"
              ><v-icon color="#1565c0">mdi-file-pdf-outline</v-icon>
              {{ afterTheMeetingfilteredItem.length }}
            </span>
          </v-row>

          &emsp;

          <v-list
            style="overflow-y: scroll"
            :height="$vuetify.breakpoint.height - 200"
          >
            <template else v-for="(item, i) in afterTheMeetingData">
              <v-list-item @click="viewRule(item._id)" :key="item._id">
                <v-list-item-action>
                  <v-icon color="#1565c0">mdi-file-document</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title
                    v-text="`${item._id}${title_spacer}${item.title}`"
                    class="font-weight-medium"
                  >
                  </v-list-item-title>
                  <v-list-item-subtitle>{{
                    item.obsoleteReason
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider
                v-if="i < afterTheMeetingData.length - 1"
                :key="i"
              ></v-divider>
            </template>
          </v-list>
        </v-card>
        <v-pagination
          v-model="intPageNo"
          :length="pageCountOfAfterMeeting"
          :total-visible="5"
          dark
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
        ></v-pagination>
      </v-flex>

      <!-- Rulebook Document ViewRuleContent -->

      <v-flex pl-1 v-if="rulecontent">
        <v-card flat>
          <v-toolbar flat>
            <v-toolbar-title class="pr-2">
              {{ viewedRule._id }}
            </v-toolbar-title>
            <!-- <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn rounded color="#1565c0" v-bind="attrs" v-on="on">
                  <a
                    style="color: #ffffff"
                    target="_blank"
                    :href="
                      `http://hrdapps48.hrd-s.com:3001/ftp/rule_book/${viewedRule._id}.pdf`
                    "
                  >
                    Open
                    <v-icon>mdi-pdf-box</v-icon>
                  </a>
                </v-btn>
              </template>
              <span>Open PDF from server</span>
            </v-tooltip> -->
            <v-spacer></v-spacer>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  rounded
                  dark
                  v-bind="attrs"
                  v-on="on"
                  color="#1565c0"
                  @click="rulecontent = false"
                  >Back</v-btn
                >
              </template>
              <span>Return to List</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  style="color: #1565c0"
                  large
                  v-bind="attrs"
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
          <v-layout row wrap>
            <template class="ma-0 pa-0">
              <v-flex xs12>
                <a-row type="flex" justify="start">
                  <a-col>
                    <v-btn rounded text class="disabled">
                      メール アドレス:&nbsp;&nbsp;
                      <span
                        v-if="
                          viewedRule.data[viewedRule.version - 1].MailAddress
                        "
                      >
                        {{
                          viewedRule.data[viewedRule.version - 1].MailAddress
                        }}
                      </span>
                      <span v-else>N/A</span>
                    </v-btn>
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
                </a-row>
                <a-row type="flex" justify="start">
                  <a-col>
                    <v-btn rounded text class="disabled">
                      システム更新日:&nbsp;&nbsp;
                      <span
                        v-if="
                          viewedRule.data[viewedRule.data.length - 1]
                            .UpdatedDate
                        "
                      >
                        {{
                          viewedRule.data[viewedRule.data.length - 1]
                            .UpdatedDate
                        }}
                      </span>
                      <span v-else>N/A</span>
                    </v-btn>
                  </a-col>
                  <a-col>
                    <v-btn rounded text class="disabled">
                      ルールブック更新日:&nbsp;&nbsp;
                      <span v-if="viewedRule.RulebookUpdatedDate">
                        {{ viewedRule.RulebookUpdatedDate }}
                      </span>
                      <span v-else>N/A</span>
                    </v-btn>
                  </a-col>
                </a-row>
              </v-flex>
              <v-flex xs3>
                <v-btn rounded text class="disabled">
                  製品区分&nbsp;-&nbsp;
                  <span v-if="viewedRule.productType">
                    {{ viewedRule.productType }}
                  </span>
                  <span v-else>N/A</span>
                </v-btn>
              </v-flex>
              <v-flex xs3>
                <v-btn rounded text class="disabled">
                  担当&nbsp;-&nbsp;
                  <span v-if="viewedRule.data[viewedRule.version - 1].Tantou">
                    {{ viewedRule.data[viewedRule.version - 1].Tantou }}
                  </span>
                  <span v-else>N/A</span>
                </v-btn>
              </v-flex>

              <v-flex xs3>
                <v-btn rounded text class="disabled">
                  担当 部署:&nbsp;&nbsp;
                  <span
                    v-if="viewedRule.data[viewedRule.version - 1].TantouBusho"
                  >
                    {{ viewedRule.data[viewedRule.version - 1].TantouBusho }}
                  </span>
                  <span v-else>N/A</span>
                </v-btn>
              </v-flex>
              <v-flex xs3>
                <v-btn rounded text class="disabled">
                  適用区分&nbsp;-&nbsp;
                  <span
                    v-if="viewedRule.data[viewedRule.version - 1].TekiyouKubun"
                  >
                    {{ viewedRule.data[viewedRule.version - 1].TekiyouKubun }}
                  </span>
                  <span v-else>N/A</span>
                </v-btn>
              </v-flex>

              <v-flex xs2>
                <v-btn rounded text class="disabled">
                  <v-icon
                    v-if="viewedRule.data[viewedRule.version - 1].YumeNoIe"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;夢の家
                </v-btn>
              </v-flex>
              <v-flex xs2>
                <v-btn rounded text class="disabled">
                  <v-icon v-if="viewedRule.data[viewedRule.version - 1].Ippan"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;一般
                </v-btn>
              </v-flex>

              <v-flex xs2>
                <v-btn rounded text class="disabled">
                  <v-icon v-if="viewedRule.data[viewedRule.version - 1].G"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;グランド
                  セゾン
                </v-btn>
              </v-flex>
              <v-flex xs2>
                <v-btn rounded text class="disabled">
                  <v-icon v-if="viewedRule.data[viewedRule.version - 1].F"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;セゾンF
                </v-btn>
              </v-flex>

              <v-flex xs2>
                <v-btn rounded text class="disabled">
                  <v-icon v-if="viewedRule.data[viewedRule.version - 1].A"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;セゾンA
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
              <v-flex xs2>
                <v-btn rounded text class="disabled">
                  <v-icon
                    v-if="viewedRule.data[viewedRule.version - 1]['F2-TD']"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close-circle-outline</v-icon
                  >&nbsp;セゾンF2-TD
                </v-btn>
              </v-flex>

              <v-flex xs2>
                <v-btn rounded text class="disabled">
                  <v-icon v-if="viewedRule.data[viewedRule.version - 1].Icube"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;Icube
                </v-btn>
              </v-flex>

              <v-flex xs2>
                <v-btn rounded text class="disabled">
                  <v-icon v-if="viewedRule.data[viewedRule.version - 1].Ismart"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;Ismart
                </v-btn>
              </v-flex>

              <v-flex xs2>
                <v-btn rounded text class="disabled">
                  <v-icon v-if="viewedRule.data[viewedRule.version - 1].Ismile"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;Ismile
                </v-btn>
              </v-flex>

              <v-flex xs2>
                <v-btn rounded text class="disabled">
                  <v-icon v-if="viewedRule.data[viewedRule.version - 1].Taishin"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;耐震
                </v-btn>
              </v-flex>
              <v-flex xs2>
                <v-btn rounded text class="disabled">
                  <v-icon v-if="viewedRule.data[viewedRule.version - 1].Menshin"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;免震
                </v-btn>
              </v-flex>

              <v-flex xs12>
                <v-layout pl-4>
                  <p style="font-size: 18px">件名: &nbsp;</p>
                  <p>
                    <span
                      style="font-size: 18px; padding-top: 0"
                      v-html="
                        viewedRule.data[viewedRule.version - 1].RuleKenmei
                      "
                    ></span>
                  </p>
                </v-layout>
                <br />
                <hr />
              </v-flex>
              <v-flex
                v-for="(item, index) in viewedRule.data[viewedRule.version - 1]
                  .content"
                :key="index"
              >
                <v-card flat>
                  <v-card-text class="fr-view" v-html="item"></v-card-text>
                </v-card>
              </v-flex>
            </template>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- dialog*********************************************************************************** -->
    <v-dialog v-model="historyDialog" width="500">
      <v-card>
        <v-list>
          <template v-for="(item, index) in historyDetails">
            <v-list-item
              id="hover"
              :class="listColorSearch(index)"
              @click="
                viewHistory(item.index);
                searchList = index;
                historyDialog = false;
              "
              :key="index"
            >
              <v-list-item-content>
                {{ index + 1 }} . {{ item.UpdatedDate }}&emsp;{{
                  item.ApprovalRemarks
                }}
                <span v-if="item.personInCharge"
                  >{{ title_spacer }}{{ item.personInCharge }}</span
                >
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      title_spacer: "　",
      intPageNo: 1,
      intRowNoRulebookDocument: 30,
      rulecontent: false,
      updatedRules: [],
      viewedRule: {
        approver: [],
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
      toSearch: "",
      historyDialog: false,
      loading: true,
      historyDetails: "",
      historyCount: 0,
      searchList: "",
    };
  },
  mounted() {},
  created() {
    this.loadDocuments();
  },
  watch: {},
  methods: {
    listColorSearch(id) {
      if (this.searchList == id) {
        return "viewed";
      }
    },

    loadDocuments() {
      this.updatedRules = [];
      this.loading = true;

      let url = `${this.api}process/get/obsoletes`;
      axios.get(url).then((res) => {
        this.updatedRules = res.data;

        this.updatedRules = this.updatedRules.map((a) => {
          a.title = a.title.replace(/<br>/gi, "\n");
          if (!a.obsoleteReason) {
            a.obsoleteReason = "";
          }
          return a;
        });

        this.loading = false;
      });
    },

    viewRule(val) {
      this.historyCount = 0;
      let url = "";
      if (val.length == 9) {
        url = `${this.api}get/final/${val}`;
      } else {
        url = `${this.api}get/initial/${val}`;
      }
      axios.get(url).then((res) => {
        this.viewedRule = res.data;
        if (!this.viewedRule.approver) {
          this.viewedRule.approver = [];
        }
        if (!this.viewedRule.isFinishedBeforeTheMeeting) {
          this.viewedRule.isFinishedBeforeTheMeeting = false;
        }
      });
      this.rulecontent = true;
    },

    viewHistory(val) {
      this.viewedRule.version = val + 1;
    },

    sortHistory() {
      // let viewedRuleDataHolder = this.viewedRule.data.reverse()
      this.viewedRule.data = this.viewedRule.data.map((rec, index) => {
        rec.index = index;
        return rec;
      });
      let viewedRuleDataHolder = Object.assign(
        [],
        this.viewedRule.data
      ).reverse();
      if (this.historyCount == 0) {
        this.historyDetails = viewedRuleDataHolder;
        this.historyCount = this.historyCount + 1;
      }
    },
  },
  computed: {
    afterTheMeetingfilteredItem() {
      if (this.updatedRules.length > 0) {
        return this.updatedRules.filter((data) => {
          // console.log(data)
          return data._id.toLowerCase().includes(this.toSearch.toLowerCase());
        });
      } else {
        return [];
      }
    },

    //Rulebook Document Data with pagination
    pageCountOfAfterMeeting() {
      let l = this.afterTheMeetingfilteredItem.length,
        s = this.intRowNoRulebookDocument;
      return Math.ceil(l / s);
    },

    afterTheMeetingData() {
      const start = (this.intPageNo - 1) * this.intRowNoRulebookDocument,
        end = start + this.intRowNoRulebookDocument;
      return this.afterTheMeetingfilteredItem.slice(start, end);
    },
  },
};
</script>

<style scoped>
.disabled {
  pointer-events: none;
}
#hover:hover {
  background-color: #b7f8f5;
}

.viewed {
  background-color: #b7f8f5;
}
</style>
