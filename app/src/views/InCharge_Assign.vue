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
              @click="getInCharge()"
              class="mr-1"
            >
              <v-icon>mdi-magnify</v-icon>In-Charge
            </v-btn>
          </template>
          <span>View In Charge</span>
        </v-tooltip>

        <v-spacer></v-spacer>

        <!-- <div style="width: 250px" class="pt-5 pl-5">
          <v-select
            label="Checker"
            :items="selectionChecker"
            v-model="selectedChecker"
          ></v-select>
        </div> -->

        <div :style="DepartmentListWidthComputed" class="pt-5 pl-5">
          <v-autocomplete
            label="Department"
            :items="selectionDepartment"
            v-model="selectedDepartment"
            dense
            clearable
            multiple
            deletable-chips
            small-chips
            hide-details
          ></v-autocomplete>
        </div>
        {{ title_spacer }}

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              dark
              rounded
              v-on="on"
              color="#1565c0"
              @click="saveRecord()"
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
              <v-flex
                xs12
                v-for="(item, index) in viewedRule.data[viewedRule.version - 1]
                  .content"
                :key="index"
              >
                <v-card flat class="pa-9">
                  <!-- {{item}} -->
                  <div class="fr-view" v-html="item"></div>
                </v-card>
                <v-spacer></v-spacer>
              </v-flex>

              <v-row no-gutters dense class="pr-5">
                <v-spacer></v-spacer>
                <a-col>
                  <v-btn rounded text class="disabled">
                    <span
                      v-if="viewedRule.data[viewedRule.version - 1].UpdatedDate"
                    >
                      システム更新日:&nbsp;&nbsp;
                      {{ viewedRule.data[viewedRule.version - 1].UpdatedDate }}
                    </span>
                    <span v-else> システム更新日:&nbsp;&nbsp; N/A </span>
                  </v-btn>
                </a-col>
              </v-row>
            </template>
          </v-layout>
          <!-- </div> -->
        </v-card>
      </v-flex>
    </template>

    <v-dialog v-model="inChargeDialog" fullscreen>
      <v-card
        :height="this.$vuetify.breakpoint.height - 100"
        style="overflow: scroll;"
      >
        <v-toolbar dense flat color="#1565c0" dark>
          <v-toolbar-title>Document No. {{ viewedRule._id }}</v-toolbar-title>
          <v-spacer />
          <v-icon
            @click="
              inChargeDialog = false;
              reloadPage();
            "
            >mdi-close</v-icon
          >
        </v-toolbar>
        <v-layout>
          <v-select
            class="ma-3"
            :items="selectionDepartmentDialog"
            v-model="selectedDepartmentDialog"
            label="Search Department"
            dense
            hide-details
            outlined
          ></v-select>
        </v-layout>

        <template v-for="(item, i) in InChargeListComputed">
          <v-card :key="i" class="pb-10 ma-2" flat>
            <v-layout>
              <span style="font-size:26px">
                {{ item.DepartmentName }}
              </span>
              <v-spacer></v-spacer>
              <v-icon @click="editRecord(item)" color="#1565c0" class="mr-4"
                >mdi-file</v-icon
              >
              <v-icon @click="deleteRecord(item)" color="#1565c0" class="mr-4"
                >mdi-close</v-icon
              >
            </v-layout>
            <span v-html="item.Content"></span>
            <v-divider
              :color="`#${Math.floor(Math.random() * 16777215).toString(16)}`"
            ></v-divider>
          </v-card>
        </template>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDepartmentDialog" width="400">
      <v-toolbar dense flat color="#1565c0" dark>
        <v-toolbar-title>Document No. {{ viewedRule._id }}</v-toolbar-title>
        <v-spacer />
        <v-icon @click="editDepartmentDialog = false">mdi-close</v-icon>
      </v-toolbar>

      <v-row dense no-gutters>
        <v-col>
          <v-btn
            dark
            color="#1565c0"
            style="width:100%;"
            @click="addEditDepartment()"
          >
            ADD DEPARTMENT
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            dark
            color="#1565c0"
            style="width:100%"
            @click="saveEditDepartment()"
          >
            SAVE
            <v-icon>
              mdi-file-document
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-card
        style="overflow: scroll;"
        :height="this.$vuetify.breakpoint.height - 250"
      >
        <template v-for="(item, index) in editDepartmentSelect">
          <v-card :key="index" flat dense no-gutters class="ma-3">
            <v-row>
              <v-col lg="10">
                <v-select
                  :items="computedDepartmentSelection"
                  v-model="editDepartmentSelect[index]"
                  hide-details
                  dense
                >
                  <template v-slot:item="{ item }">
                    <span>{{ item.text }}</span>
                  </template>
                </v-select>
              </v-col>
              <v-col>
                <v-icon
                  class="pt-3"
                  color="error"
                  @click="editDepartmentSelect.splice(index, 1)"
                  >mdi-delete</v-icon
                >
              </v-col>
            </v-row>
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

      hideProperties: false,

      selectedDepartment: "",
      selectionDepartment: [],
      selectedDepartmentDialog: "All",
      selectionDepartmentDialog: ["All"],

      inChargeDialog: false,
      inChargeList: [],

      editDepartmentItems: {},
      editDepartmentSelect: [],
      editDepartmentDialog: false,
    };
  },
  created() {
    let url = "";
    if (this.$route.params.id.length == 13) {
      this.$route.params.id = this.$route.params.id.substring(0, 9);
    }
    if (this.$route.query.search && !this.$route.query.multi) {
      this.loading = true;
      url = `${this.api}document/get/final_keywords/or/and/${this.$route.params.id}?search=${this.$route.query.search}`;
    } else if (this.$route.query.search && this.$route.query.multi) {
      this.loading = true;
      url = `${this.api}document/get/final_keywords/multiple/${this.$route.params.id}?search=${this.$route.query.search}`;
    } else {
      this.loading = true;
      url = `${this.api}document/get/final_incharge/${this.$route.params.id}`;
      //  url = `${this.api}get/initial/${this.$route.params.id}`;
    }
    console.log(url);
    axios.get(url).then((res) => {
      // this.getChecker();
      this.getDepartment();
      this.loading = false;
      this.viewedRule = res.data;
    });
  },

  watch: {},

  computed: {
    computedDepartmentSelection() {
      return this.selectionDepartment.map((rec) => {
        return {
          text: rec,
          value: rec,
          disabled: this.editDepartmentSelect.includes(rec),
        };
      });
    },

    screenSize() {
      return this.$vuetify.breakpoint.height;
    },
    DepartmentListWidthComputed() {
      if (this.selectedDepartment.length > 2) {
        return "width:500px";
      } else if (this.selectedDepartment.length > 3) {
        return "width:750px";
      } else if (this.selectedDepartment.length > 5) {
        return "width:1000px";
      } else {
        return "width:300px";
      }
    },

    InChargeListComputed() {
      return this.inChargeList.filter((rec) => {
        if (this.selectedDepartmentDialog != "All") {
          return rec.DepartmentName == this.selectedDepartmentDialog;
        } else {
          return rec;
        }
      });
    },
  },

  methods: {
    saveRecord() {
      let range = window.getSelection().getRangeAt(0),
        content = range.extractContents(),
        span = document.createElement("SPAN");

      span.appendChild(content);

      let selectedContent = span.innerHTML;
      range.insertNode(span);

      if (
        this.selectedDepartment &&
        this.selectionDepartment != "All" &&
        selectedContent
      ) {
        let url = `${this.api}add/content_incharge`;
        let toInsert = {};

        toInsert.DocumentNo = this.viewedRule._id;
        toInsert.DepartmentName = this.selectedDepartment;
        toInsert.Content = selectedContent;
        toInsert.UpdatedBy = this.userInfo.employee_code;
        axios
          .post(url, toInsert)
          .then(() => {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Saved!",
              showConfirmButton: false,
              timer: 1000,
            });
            toInsert = {};
          })
          .then(() => {
            this.viewedRule = [];
            let url = `${this.api}document/get/final_incharge/${this.$route.params.id}`;
            axios.get(url).then((res) => {
              this.viewedRule = res.data;
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

    getDepartment() {
      // let url = `${this.api}get/departments`;
      // axios.get(url).then((res) => {
      //   this.selectionDepartment = res.data;
      // });
      axios.defaults.headers.common["master-api"] =
        "db588403f0a1d3b897442a28724166b4";

      let url = "http://adminsql1/api/company/department/hrd";
      axios.get(url).then((res) => {
        let departmentList = res.data
          .filter((rec) => {
            return (
              rec.DepartmentCategory == "PLAN PRODUCTION" && !rec.DeletedDate
            );
          })
          .map((rec) => {
            return rec.DepartmentName;
          });
        this.selectionDepartment = departmentList;
      });
    },

    getInCharge() {
      this.inChargeDialog = true;

      let url = `${this.api}get/content_incharge?DocumentNo=${this.viewedRule._id}`;
      axios.get(url).then((res) => {
        this.inChargeList = res.data;

        res.data.map((rec) => {
          return this.selectionDepartmentDialog.push(rec.DepartmentName);
        });
      });
    },

    deleteRecord(val) {
      let url = `${this.api}delete/content_incharge?DocumentNo=${val.DocumentNo}&SeqNo=${val.SeqNo}`;

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
             this.inChargeList = [];
            let url = `${this.api}get/content_incharge?DocumentNo=${this.viewedRule._id}`;
            axios.get(url).then((res) => {
               this.inChargeList = res.data;
            });
            // this.getInCharge();
            // window.location.reload();
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

    editRecord(val) {
      const department_list = val.DepartmentName.split(",");
      this.editDepartmentSelect = department_list;
      this.editDepartmentDialog = true;

      this.editDepartmentItems = {
        DocumentNo: val.DocumentNo,
        SeqNo: val.SeqNo,
        DepartmentName: this.editDepartmentSelect,
        UpdatedBy: this.userInfo.employee_code,
      };
    },

    saveEditDepartment() {
      if (!this.editDepartmentSelect[this.editDepartmentSelect.length - 1]) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Please select department !",
          showConfirmButton: false,
          timer: 800,
        });
        return;
      }

      let url = `${this.api}save_edit_department`;
      axios.post(url, this.editDepartmentItems).then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Success !",
          showConfirmButton: false,
          timer: 800,
        });
        this.editDepartmentDialog = false;
        this.getInCharge();
      });
    },

    addEditDepartment() {
      if (this.editDepartmentSelect[this.editDepartmentSelect.length - 1]) {
        this.editDepartmentSelect.push("");
      }
    },

    CloseTab() {
      window.close();
    },

    reloadPage() {
      window.location.reload();
    },

    SeeMore() {
      if (this.hideProperties) {
        this.hideProperties = false;
      } else {
        this.hideProperties = true;
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

<style>
.tooltip {
  position: relative;
  display: inline-block;
  /* border-bottom: 1px dotted black; */
  background-color: #9ff6fc;
  cursor: context-menu;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #1565c0;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  position: absolute;
  z-index: 1;

  width: 120px;
  bottom: 100%;
  left: 50%;
  margin-left: -60px;
  font-size: 14px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
