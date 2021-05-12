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
              color="#1565c0"
              class="mr-1"
              @click="checkRemarks()"
            >
              <v-icon>mdi-magnify</v-icon>View Remarks
            </v-btn>
          </template>
          <span>View Remarks</span>
        </v-tooltip>

        <v-spacer></v-spacer>
        <!-- <v-text-field v-model="Remarks" label="Remarks" class="pt-3 pr-3"></v-text-field> -->

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              dark
              rounded
              v-on="on"
              color="#1565c0"
              @click="saveContent()"
              class="mr-1"
            >
              <v-icon>mdi-content-save-move</v-icon>SAVE
            </v-btn>
          </template>
          <span>SAVE</span>
        </v-tooltip>
      </v-toolbar>

      <v-flex pl-1>
        <v-card flat style="overflow-y: scroll" :height="screenSize - 70">
          <v-layout pt-4 row wrap>
            <template>
              <v-flex xs12 sm12 md12>
                <v-flex xs12>
                  <a-row
                    type="flex"
                    justify="start"
                    style="border-bottom: 1px solid black"
                  >
                    <a-col span="4">
                      メール アドレス:&nbsp;&nbsp;
                      <span
                        style="font-size: 12px;"
                        v-if="
                          viewedRule.data[viewedRule.version - 1].MailAddress
                        "
                      >
                        {{
                          viewedRule.data[viewedRule.version - 1].MailAddress
                        }}
                      </span>

                      <span v-else> N/A </span>
                    </a-col>

                    <a-col span="4">
                      <span>
                        <span
                          v-if="
                            viewedRule.data[viewedRule.data.length - 1]
                              .BeginningPeriod
                          "
                        >
                          開始時期:&nbsp;&nbsp;{{
                            viewedRule.data[viewedRule.data.length - 1]
                              .BeginningPeriod
                          }}
                        </span>
                        <span v-else> 開始時期:&nbsp;&nbsp;N/A</span>
                      </span>
                    </a-col>
                    <a-col span="4">
                      <span>
                        <span v-if="viewedRule.RulebookUpdatedDate">
                          ルールブック更新日:&nbsp;&nbsp;
                          {{ viewedRule.RulebookUpdatedDate }}
                        </span>

                        <span v-else>
                          ルールブック更新日:&nbsp;&nbsp; N/A
                        </span>
                      </span>
                    </a-col>
                    <a-col> </a-col>
                  </a-row>
                </v-flex>

                <v-flex xs12 class="pl-3 pt-2">
                  <a-row
                    type="flex"
                    justify="start"
                    style="border-bottom: 1px solid black"
                  >
                    <a-col :span="4">
                      <span>
                        <span v-if="viewedRule.productType">
                          製品区分&nbsp;-&nbsp;
                          {{ viewedRule.productType }}
                        </span>
                        <span v-else> 製品区分&nbsp;-&nbsp; N/A </span>
                      </span>
                    </a-col>
                    <a-col :span="4">
                      <span>
                        区分&nbsp;-&nbsp;
                        <span v-if="viewedRule.criteria">
                          {{ viewedRule.criteria }}
                        </span>
                        <span v-else>N/A</span>
                      </span>
                    </a-col>
                    <a-col :span="4">
                      <span>
                        担当&nbsp;-&nbsp;
                        <span
                          v-if="viewedRule.data[viewedRule.version - 1].Tantou"
                        >
                          {{ viewedRule.data[viewedRule.version - 1].Tantou }}
                        </span>
                        <span v-else>N/A</span>
                      </span>
                    </a-col>
                    <a-col :span="4">
                      <span>
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
                      </span>
                    </a-col>
                    <a-col :span="4">
                      <span>
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
                      </span>
                    </a-col>
                  </a-row>
                </v-flex>

                <v-flex xs12 class="pl-3 pt-2">
                  <a-row type="flex" justify="start">
                    <v-flex xs2>
                      <span>
                        <v-icon
                          v-if="
                            viewedRule.data[viewedRule.version - 1].YumeNoIe
                          "
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;夢の家
                      </span>
                    </v-flex>
                    <v-flex xs2>
                      <span>
                        <v-icon
                          v-if="viewedRule.data[viewedRule.version - 1].Ippan"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;一般
                      </span>
                    </v-flex>

                    <v-flex xs2>
                      <span>
                        <v-icon v-if="viewedRule.data[viewedRule.version - 1].G"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;グランド セゾン
                      </span>
                    </v-flex>
                    <v-flex xs2>
                      <span>
                        <v-icon v-if="viewedRule.data[viewedRule.version - 1].F"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;セゾンF
                      </span>
                    </v-flex>

                    <v-flex xs2>
                      <span>
                        <v-icon v-if="viewedRule.data[viewedRule.version - 1].A"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;セゾンA
                      </span>
                    </v-flex>
                    <v-flex xs2>
                      <span>
                        <v-icon v-if="viewedRule.data[viewedRule.version - 1].B"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;ブリアール
                      </span>
                    </v-flex>
                  </a-row>
                </v-flex>

                <v-flex xs12 class="pl-3 pt-2">
                  <a-row type="flex" justify="start">
                    <v-flex xs2>
                      <span>
                        <v-icon
                          v-if="
                            viewedRule.data[viewedRule.version - 1]['F2-TD']
                          "
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;セゾンF2-TD
                      </span>
                    </v-flex>

                    <v-flex xs2>
                      <span>
                        <v-icon
                          v-if="viewedRule.data[viewedRule.version - 1].Icube"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;i-cube
                      </span>
                    </v-flex>

                    <v-flex xs2>
                      <span>
                        <v-icon
                          v-if="viewedRule.data[viewedRule.version - 1].Ismart"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;i-smart
                      </span>
                    </v-flex>

                    <v-flex xs2>
                      <span>
                        <v-icon
                          v-if="viewedRule.data[viewedRule.version - 1].Ismile"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;i-smile
                      </span>
                    </v-flex>

                    <v-flex xs2>
                      <span>
                        <v-icon
                          v-if="viewedRule.data[viewedRule.version - 1].Taishin"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;耐震
                      </span>
                    </v-flex>
                    <v-flex xs2>
                      <span>
                        <v-icon
                          v-if="viewedRule.data[viewedRule.version - 1].Menshin"
                          >mdi-check-circle-outline</v-icon
                        >
                        <v-icon v-else>mdi-close-circle-outline</v-icon
                        >&nbsp;免震
                      </span>
                    </v-flex>
                  </a-row>
                </v-flex>
              </v-flex>

              <v-layout
                pl-4
                pt-4
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
              </v-layout>
              <br />
              <v-flex
                xs12
                v-for="(item, index) in viewedRule.data[viewedRule.version - 1]
                  .content"
                :key="index"
              >
                <v-card flat>
                  <div class="fr-view" v-html="item"></div>
                </v-card>
                <v-spacer></v-spacer>
              </v-flex>

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

    <v-dialog v-model="remarksDialog" fullscreen>
      <v-card
        :height="this.$vuetify.breakpoint.height - 100"
        style="overflow: scroll;"
      >
        <v-toolbar dense flat color="#1565c0" dark>
          <v-toolbar-title>Document No. {{ viewedRule._id }}</v-toolbar-title>
          <v-spacer />
          <v-icon @click="remarksDialog = false">mdi-close</v-icon>
        </v-toolbar>

        <template v-for="(item, i) in RemarksListComputed">
          <v-card :key="i" class="pb-10 ma-2" flat>
            <v-layout>
              <h1>
                Remark No.
                {{ item.SeqNo }}
              </h1>
              <v-spacer></v-spacer>
              <v-icon @click="deleteRecord(item.DocumentNo, item.SeqNo)">mdi-close</v-icon>
            </v-layout>
            <span v-html="item.Content"></span>
            <v-textarea
              auto-grow
              v-model="item.Remarks"
              label="Remarks"
            ></v-textarea>

            <v-btn
              @click="saveRemarks(item.DocumentNo, item.SeqNo, item.Remarks)"
              dark
              color="#1565c0"
              class="mb-3"
            >
              <v-icon> mdi-content-save</v-icon>Save</v-btn
            >

            <v-divider
              :color="`#${Math.floor(Math.random() * 16777215).toString(16)}`"
            ></v-divider>
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
      remarksDialog: false,
      remarksList: [],
      Remarks: "",
    };
  },
  created() {
    // this.loadRemarks();
    this.loadData();
  },

  computed: {
    screenSize() {
      return this.$vuetify.breakpoint.height;
    },
    RemarksListComputed() {
      return this.remarksList.filter((rec) => {
        if (this.selectedCheckerList != "ALL") {
          return rec.CheckerName == this.selectedCheckerList;
        }
        if (this.selectedDepartmentList != "ALL") {
          return rec.DepartmentName == this.selectedDepartmentList;
        } else {
          return rec;
        }
      });
    },
  },

  methods: {
    loadData() {
      let url = `${this.api}get/initial/${this.$route.params.id}`;

      axios.get(url).then((res) => {
        this.loading = false;
        this.viewedRule = res.data;
      });
    },

    loadRemarks() {
      this.remarksList=[]
      let url = `${this.api}get/content_remarks?DocumentNo=${this.$route.params.id}`;
      axios.get(url).then((res) => {
        this.remarksList = res.data;
      });
    },

    checkRemarks() {
      this.remarksDialog = true;
      this.loadRemarks();
    },

    saveContent() {
      let range = window.getSelection().getRangeAt(0),
        content = range.extractContents(),
        span = document.createElement("span");
      span.appendChild(content);
      let selectedContent = span.innerHTML;

      range.insertNode(span);
      window.location.reload();
      if (selectedContent) {
        let url = `${this.api}add/content_remarks`;
        let toInsert = {};

        toInsert.DocumentNo = this.viewedRule._id;
        toInsert.Content = selectedContent;
        toInsert.UpdatedBy = this.userInfo.employee_code;
        axios.post(url, toInsert).then(() => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Saved!",
            showConfirmButton: false,
            timer: 1000,
          });
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Invalid",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    },

    saveRemarks(DocumentNo, SeqNo, Remarks) {
      let url = `${this.api}add/content_remarks/remarks?DocumentNo=${DocumentNo}&SeqNo=${SeqNo}&Remarks=${Remarks}`;
      axios.post(url).then( () =>{
        this.loadRemarks()
        Swal.fire({
              position: "center",
              icon: "success",
              title: "Success!",
              showConfirmButton: false,
              timer: 800,
            });
      })
    },

    deleteRecord(DocumentNo,SeqNo) {
      let url = `${this.api}delete/content_remarks?DocumentNo=${DocumentNo}&SeqNo=${SeqNo}`;

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `YES!`,
      }).then((result) => {
        if (result.value) {
          axios.post(url).then(() => {
            this.loadRemarks();
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Deleted!",
              showConfirmButton: false,
              timer: 800,
            });
          });
        }
      });
    },

    CloseTab() {
      window.close()
    },
  },
};
</script>

<style scoped>
::selection {
  color: whitesmoke;
  background: black;
}
</style>
