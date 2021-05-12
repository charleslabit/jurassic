<template>
  <v-container fluid pa-1 ma-0>
    <a-tabs :default-active-key="tabModel" @change="callback">
      <a-tab-pane key="1" tab="Before the Meeting" v-model="tabModel">
        <div>
          <a-tabs
            :default-active-key="tabModelBeforeTheMeeting"
            @change="callbackBeforeTheMeeting"
          >
            <a-tab-pane
              key="1"
              :tab="`Koushin${year.substring(2, 4)}-01`"
              v-model="tabModelBeforeTheMeeting"
            >
            </a-tab-pane>
            <a-tab-pane
              key="2"
              :tab="`Koushin${year.substring(2, 4)}-02`"
              v-model="tabModelBeforeTheMeeting"
            >
            </a-tab-pane>
            <a-tab-pane
              key="3"
              :tab="`Koushin${year.substring(2, 4)}-03`"
              v-model="tabModelBeforeTheMeeting"
            >
            </a-tab-pane>
            <a-tab-pane
              key="4"
              :tab="`Koushin${year.substring(2, 4)}-04`"
              v-model="tabModelBeforeTheMeeting"
            >
            </a-tab-pane>
            <a-tab-pane
              key="5"
              :tab="`Koushin${year.substring(2, 4)}-05`"
              v-model="tabModelBeforeTheMeeting"
            >
            </a-tab-pane>
          </a-tabs>
          <v-layout>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  dense
                  outlined
                  label="Search"
                  class="pl-3"
                  v-model="toSearchBeforeTheMeeting"
                  append-icon="mdi-magnify"
                  @keypress="intPageNo = 1"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-combobox
                  dense
                  outlined
                  class="pr-4"
                  :items="personInChargeList"
                  v-model="selectedBeforeTheMeeting"
                  label="Person in Charge"
                >
                </v-combobox>
              </v-col>
              <v-col cols="2">
                <v-select
                  dense
                  outlined
                  class="pr-4"
                  :items="statusList"
                  v-model="selectedStatusList"
                  label="Status"
                >
                </v-select>
              </v-col>

              <!-- NEW  -->
              <v-col cols="1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      dark
                      style="background-color: #1565c0"
                      v-on="on"
                      @click="registerNew()"
                    >
                      <v-icon>mdi-text-box-plus</v-icon>
                      New
                    </v-btn>
                  </template>
                  <span>Register New Document</span>
                </v-tooltip>
              </v-col>

              <v-col cols="1" v-if="userInfo.employee_code == '35339'">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      dark
                      style="background-color: #1565c0"
                      v-on="on"
                      @click="registerExisting()"
                    >
                      <v-icon>mdi-text-box-plus</v-icon>
                      For February Update
                    </v-btn>
                  </template>
                  <span>For February Update</span>
                </v-tooltip>
              </v-col>

              <v-spacer></v-spacer>

              <div class="mt-2 mr-4">
                <v-icon color="#1565c0" medium>mdi-file-pdf-outline</v-icon>
                {{ beforeTheMeetingfilteredItem.length }}
              </div>
            </v-row>
          </v-layout>

          <v-list
            style="overflow-y: scroll"
            :height="$vuetify.breakpoint.height - 300"
          >
            <v-layout align-center justify-center v-if="loading" pt-3>
              <a-spin tip="Loading..."> </a-spin>
            </v-layout>

            <template v-for="(item, i) in beforeTheMeetingData" v-else>
              <v-list-item :key="item._id" @click="editDocument(item._id)">
                <v-list-item-action>
                  <v-icon color="#1565c0">mdi-file-document</v-icon>
                </v-list-item-action>

                <v-list-item-title
                  v-text="`${item._id} ${title_spacer} ${item.title}  `"
                  class="font-weight-medium"
                ></v-list-item-title>
                <!-- Edit Document -->
                <!-- <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                    fab
                    x-small
                     dense
                      dark
                      style="background-color: #1565c0"
                      v-on="on"
                      class="mr-1"
                      @click="editDocument(item._id)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Edit Document</span>
                </v-tooltip> -->

                <!-- Generate PDF -->
                <!-- <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                    fab
                    x-small
                     dense
                      dark
                      color="error"
                      v-on="on"
                      class="mr-1"
                      @click="generatePDF(item)"
                    >
                      <v-icon>mdi-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Generate PDF</span>
                </v-tooltip> -->
                <!-- for checking icon -->
                <span
                  v-if="
                    item.forCheckingBeforeTheMeeting == true &&
                      !item.alreadyInAfter
                  "
                >
                  <v-icon color="green"> mdi-alarm</v-icon>
                </span>
                <!-- approved icon -->
                <span
                  v-if="
                    item.forCheckingBeforeTheMeeting == 'APPROVED' &&
                      !item.alreadyInAfter
                  "
                >
                  <v-icon color="green"> mdi-transfer-right</v-icon>
                </span>
                <!-- already transfer icon -->
                <span v-if="item.alreadyInAfter">
                  <v-icon color="green"> mdi-check-decagram-outline </v-icon>
                </span>
              </v-list-item>

              <v-divider
                v-if="i < beforeTheMeetingData.length - 1"
                :key="i"
              ></v-divider>
            </template>
          </v-list>
        </div>
        <v-pagination
          v-model="intPageNo"
          :length="pageCountOfBeforeMeeting"
          :total-visible="5"
          dark
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
        ></v-pagination>
      </a-tab-pane>

      <!-- 
     XX    XX    XXXXXX   XX    XX     
     XX   XX     XX        XX  XX
     XXXXXX      XXXXX       XX
     XX   XX     XX          XX
     XX     XX   XXXXXX      XX -->

      <a-tab-pane key="2" tab="After the Meeting" v-model="tabModel">
        <div>
          <a-tabs
            :default-active-key="tabModelAfterTheMeeting"
            @change="callbackAfterTheMeeting"
          >
            <a-tab-pane
              key="1"
              :tab="`Koushin${year.substring(2, 4)}-01`"
              v-model="tabModelAfterTheMeeting"
            >
            </a-tab-pane>
            <a-tab-pane
              key="2"
              :tab="`Koushin${year.substring(2, 4)}-02`"
              v-model="tabModelAfterTheMeeting"
            >
            </a-tab-pane>
            <a-tab-pane
              key="3"
              :tab="`Koushin${year.substring(2, 4)}-03`"
              v-model="tabModelAfterTheMeeting"
            >
            </a-tab-pane>
            <a-tab-pane
              key="4"
              :tab="`Koushin${year.substring(2, 4)}-04`"
              v-model="tabModelAfterTheMeeting"
            >
            </a-tab-pane>
            <a-tab-pane
              key="5"
              :tab="`Koushin${year.substring(2, 4)}-05`"
              v-model="tabModelAfterTheMeeting"
            >
            </a-tab-pane>
          </a-tabs>

          <v-layout>
            <v-row>
              <v-col cols="3">
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
              <v-col cols="3">
                <v-combobox
                  dense
                  outlined
                  class="pr-4"
                  :items="personInChargeList"
                  v-model="selectedBeforeTheMeeting"
                  label="Person in Charge"
                >
                </v-combobox>
              </v-col>
              <v-col cols="2">
                <v-select
                  dense
                  outlined
                  class="pr-4"
                  :items="statusList"
                  v-model="selectedStatusList"
                  label="Status"
                >
                </v-select>
              </v-col>

              <v-spacer></v-spacer>
              <span class="mt-2 mr-4"
                ><v-icon color="#1565c0">mdi-file-pdf-outline</v-icon>
                {{ afterTheMeetingfilteredItem.length }}
              </span>
            </v-row>
            &emsp;
          </v-layout>

          <v-list
            style="overflow-y: scroll"
            :height="$vuetify.breakpoint.height - 300"
          >
            <v-layout align-center justify-center v-if="loading" pt-3>
              <a-spin tip="Loading..."> </a-spin>
            </v-layout>

            <template else v-for="(item, i) in afterTheMeetingData" v-else>
              <v-list-item @click="editDocument(item._id)" :key="item._id">
                <v-list-item-action>
                  <v-icon color="#1565c0">mdi-file-document</v-icon>
                </v-list-item-action>

                <v-list-item-title
                  v-text="`${item._id}${title_spacer}${item.title}`"
                  class="font-weight-medium"
                ></v-list-item-title>

                <!-- for checking icon -->
                <span
                  v-if="
                    item.forCheckingAfterTheMeeting == true &&
                      !item.alreadyInToUpdate
                  "
                >
                  <v-icon color="green"> mdi-alarm</v-icon>
                </span>
                <!-- approved icon -->
                <span
                  v-if="
                    item.forCheckingAfterTheMeeting == 'APPROVED' &&
                      !item.alreadyInToUpdate
                  "
                >
                  <v-icon color="green"> mdi-transfer-right</v-icon>
                </span>
                <!-- already transfer icon -->
                <span v-if="item.alreadyInToUpdate">
                  <v-icon color="green"> mdi-check-decagram-outline </v-icon>
                </span>
              </v-list-item>
              <v-divider
                v-if="i < afterTheMeetingData.length - 1"
                :key="i"
              ></v-divider>
            </template>
          </v-list>
        </div>
        <v-pagination
          v-model="intPageNo"
          :length="pageCountOfAfterMeeting"
          :total-visible="5"
          dark
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
        ></v-pagination>
      </a-tab-pane>

      <!-- 
     XX    XX    XXXXXX   XX    XX     
     XX   XX     XX        XX  XX
     XXXXXX      XXXXX       XX
     XX   XX     XX          XX
     XX     XX   XXXXXX      XX -->

      <a-tab-pane key="3" tab="To Update" v-model="tabModel">
        <div>
          <a-tabs
            :default-active-key="tabModeltoUpdate"
            @change="callbacktoUpdate"
          >
            <a-tab-pane
              key="1"
              :tab="`Koushin${year.substring(2, 4)}-01`"
              v-model="tabModeltoUpdate"
            >
            </a-tab-pane>
            <a-tab-pane
              key="2"
              :tab="`Koushin${year.substring(2, 4)}-02`"
              v-model="tabModeltoUpdate"
            >
            </a-tab-pane>
            <a-tab-pane
              key="3"
              :tab="`Koushin${year.substring(2, 4)}-03`"
              v-model="tabModeltoUpdate"
            >
            </a-tab-pane>
            <a-tab-pane
              key="4"
              :tab="`Koushin${year.substring(2, 4)}-04`"
              v-model="tabModeltoUpdate"
            >
            </a-tab-pane>
            <a-tab-pane
              key="5"
              :tab="`Koushin${year.substring(2, 4)}-05`"
              v-model="tabModeltoUpdate"
            >
            </a-tab-pane>
          </a-tabs>

          <v-layout>
            <v-row>
              <v-col cols="3">
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
              <v-col cols="3">
                <v-combobox
                  dense
                  outlined
                  class="pr-4"
                  :items="personInChargeList"
                  v-model="selectedBeforeTheMeeting"
                  label="Person in Charge"
                >
                </v-combobox>
              </v-col>
              <!-- <v-col cols="2">
                <v-select
                  dense
                  outlined
                  class="pr-4"
                  :items="statusList"
                  v-model="selectedStatusList"
                  label="Status"
                >
                </v-select>
              </v-col> -->

              <v-spacer></v-spacer>
              <span class="mt-2 mr-4"
                ><v-icon color="#1565c0">mdi-file-pdf-outline</v-icon>
                {{ toUpdatefilteredItem.length }}
              </span>
            </v-row>

            &emsp;
          </v-layout>
          <v-list
            style="overflow-y: scroll"
            :height="$vuetify.breakpoint.height - 300"
          >
            <v-layout align-center justify-center v-if="loading" pt-3>
              <a-spin tip="Loading..."> </a-spin>
            </v-layout>

            <template else v-for="(item, i) in toUpdateData" v-else>
              <v-list-item @click="editDocument(item._id)" :key="item._id">
                <v-list-item-action>
                  <v-icon color="#1565c0">mdi-file-document</v-icon>
                </v-list-item-action>

                <v-list-item-title
                  v-text="`${item._id}${title_spacer}${item.title}`"
                  class="font-weight-medium"
                ></v-list-item-title>

                <span v-if="item.alreadyInFinal">
                  <v-icon color="green"> mdi-check-decagram-outline</v-icon>
                </span>
              </v-list-item>
              <v-divider
                v-if="i < toUpdateData.length - 1"
                :key="i"
              ></v-divider>
            </template>
          </v-list>
          <v-pagination
            v-model="intPageNo"
            :length="pageCountOftoUpdate"
            :total-visible="5"
            dark
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          ></v-pagination>
        </div>
      </a-tab-pane>

      <a-select
        v-model="year"
        style="width: 100%"
        slot="tabBarExtraContent"
        @change="getBeforeTheMeetingList() & getAfterTheMeetingList()"
      >
        <a-select-option v-for="item in optYear" :key="item" v-value="item">{{
          item
        }}</a-select-option>
      </a-select>
    </a-tabs>

    <!-- DIALOG @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ DIALOG @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ -->

    <!-- 
XXXXXX    XX      XX      XX          XXXXX        XXXXXXXX
XX   XX   XX   XXX  XXX   XX        XX     XX      XX      
XX   XX   XX  XXXXXXXXXX  XX        XX     XX      XX   XXXX        
XX   XX   XX  XX      XX  XX        XX     XX      XX     XX    
XXXXXX    XX  XX      XX  XXXXXXX    XXXXXXX       XXXXXXXXX   -->

    <v-dialog v-model="registerDialog" max-width="500" persistent>
      <v-card>
        <v-toolbar dense flat color="#1565c0" dark>
          <v-toolbar-title>Register New Document</v-toolbar-title>
          <v-spacer />
          <v-icon @click="registerDialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-row no-gutters dense class="mt-3 pa-2">
          <v-col cols="7">
            <!-- @keyup="toUpperCase()" -->

            <v-text-field
              label="Person-In-charge"
              outlined
              dense
              v-model="newDocument.personInCharge"
              @blur="checkExistingDocs()"
            ></v-text-field>
          </v-col>
          <v-col cols="5">
            <!-- <a-date-picker
              v-model="dateToday"
              valueFormat="YYYY-MM-DD"
              size="large"
            >
            </a-date-picker> -->
            <v-select
              outlined
              dense
              label="Select Schedule Date"
              :items="listofScheduleDate"
              v-model="dateToday"
            >
            </v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field
              disabled
              label="Document No."
              outlined
              dense
              v-model="newDocument._id"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-layout class="ma-1 pa-1" dense>
          <v-spacer></v-spacer>
          <v-btn color="#1565c0" dark @click="saveNewDocument(newDocument._id)"
            ><v-icon>mdi-content-save-move</v-icon> Save</v-btn
          >
        </v-layout>
      </v-card>
    </v-dialog>

    <v-dialog v-model="registerExistingDialog" max-width="500" persistent>
      <v-card>
        <v-toolbar dense flat color="#1565c0" dark>
          <v-toolbar-title>Register Existing Document</v-toolbar-title>
          <v-spacer />
          <v-icon @click="registerExistingDialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-row no-gutters dense class="mt-3 pa-2">
          <v-col cols="12">
            <v-text-field
              label="Document No."
              outlined
              dense
              v-model="newDocument._id"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <!-- @keyup="toUpperCase()" -->

            <v-text-field
              label="Person-In-charge"
              outlined
              dense
              v-model="newDocument.personInCharge"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-layout class="ma-1 pa-1" dense>
          <v-spacer></v-spacer>
          <v-btn
            color="#1565c0"
            dark
            @click="saveExistingDocument(newDocument._id)"
            ><v-icon>mdi-content-save-move</v-icon> Save</v-btn
          >
        </v-layout>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";

// const uniqueElementsBy = (arr, fn) =>
//   arr.reduce((acc, v) => {
//     if (!acc.some((x) => fn(v, x))) acc.push(v);
//     return acc;
//   }, []);

export default {
  components: {},
  data() {
    return {
      title_spacer: "　",
      intPageNo: 1,
      intRowNoRulebookDocument: 30,
      toSearch: "",
      loading: true,
      selectionBeforeTheMeeting: ["Please", "Wait", "Thankyou"],
      selectedBeforeTheMeeting: { text: "All", value: "All" },
      listBeforeTheMeeting: [],
      toSearchBeforeTheMeeting: "",
      tabModel: 1,
      tabModelBeforeTheMeeting: "1",
      tabModelAfterTheMeeting: "1",
      tabModeltoUpdate: "1",
      RulebookUpdatedDate: "",
      listAfterTheMeeting: [],
      listToUpdate: [],

      registerDialog: false,
      newDocument: { personInCharge: "", _id: "" },

      year: "",
      yearData: [],
      optYear: [],

      dateToday: moment().format("YYYY-MM-DD"),

      registerExistingDialog: false,
      statusList: ["All", "No copy", "Already have copy"],
      selectedStatusList: "All",

      personInChargeList: [],

      listofScheduleDate: [],
    };
  },
  mounted() {},
  created() {
    this.getPersonInCharge();
    this.getJapaneseList();
    if (this.$route.query.personincharge) {
      this.selectedBeforeTheMeeting = {
        text: this.$route.query.personinchargeENG,
        value: this.$route.query.personincharge,
      };

      // this.selectionBeforeTheMeeting.text = this.$route.query.personinchargeENG;
      // this.selectedBeforeTheMeeting.value = this.$route.query.personincharge;

      this.selectedStatusList = this.$route.query.status;

      if (this.$route.query.category == "before") {
        this.tabModel = "1";
        this.tabModelBeforeTheMeeting = "1";
      } else {
        this.tabModel = "2";
        this.tabModelAfterTheMeeting = "1";
      }
    }

    this.loadAllYear();
    // this.getBeforeTheMeetingList();
    // this.getAfterTheMeetingList();
    // this.getToUpdateList();
    // this.loadListOfScheduleDate();
    // setTimeout(() => {

    // }, 2500);
  },
  watch: {},
  methods: {
    loadListOfScheduleDate() {
      let url = `${this.api}get/all_scheduledate?year=${this.year}`;
      axios.get(url).then((res) => {
        this.listofScheduleDate = res.data;
      });
    },

    getJapaneseList() {
      axios.defaults.headers.common["x-api-key"] =
        "JUe7mHXOhR6ziaSDHXUDJ310nTfdsH8s1ph44z2q";
      let url = `https://1ze9v428i9.execute-api.us-east-2.amazonaws.com/prod/getUsers/`;
      let body = [];

      axios.get(url).then((res) => {
        body = res.data
          .map((rec) => {
            return {
              EmployeeNumber: rec.EmployeeNumber,
              FirstName: rec.FirstName,
              LastName: rec.LastName,
              workStation: rec.workStation,
              Comp_Name: rec.Comp_Name,
              LastNameEng: rec.LastNameEng,
            };
          })
          .filter((rec) => {
            return rec.Comp_Name == "HRD";
          })
          .map((rec) => {
            return { text: rec.LastNameEng, value: rec.LastName };
          });

        body.map((rec) => {
          this.selectionBeforeTheMeeting.map((rec2) => {
            if (rec2 == rec.value) {
              this.personInChargeList.push(rec);
            }
          });
        });
        this.personInChargeList.unshift({ text: "All", value: "All" });
      });
    },
    editDocument(val) {
      let kind = "";

      if (this.tabModel == "1") {
        kind = "Before";
      } else if (this.tabModel == "2") {
        kind = "After";
      } else {
        kind = "ToUpdate";
      }
      this.CHANGE_ITEM(val);
      let rulebookKoushin = "";
      if (this.tabModel == 1) {
        rulebookKoushin = `Koushin${this.year.substring(2, 4)}-0${
          this.tabModelBeforeTheMeeting
        }`;
      } else if (this.tabModel == 2) {
        rulebookKoushin = `Koushin${this.year.substring(2, 4)}-0${
          this.tabModelAfterTheMeeting
        }`;
      } else {
        rulebookKoushin = `Koushin${this.year.substring(2, 4)}-0${
          this.tabModeltoUpdate
        }`;
      }

      this.$router.push(
        `/edit_document?kind=${kind}&koushin=${rulebookKoushin}&documentno=${val}`
      );
    },
    toUpperCase() {
      this.newDocument.personInCharge = this.newDocument.personInCharge.toUpperCase();
    },
    registerNew() {
      let url = `${this.api}get/latest_scheduledate?year=${this.year}`;
      axios.get(url).then((res) => {
        this.newDocument = { _id: "", personInCharge: "" };
        this.dateToday = res.data;
        this.registerDialog = true;
      });
    },
    registerExisting() {
      this.newDocument = { _id: "", personInCharge: "" };
      this.registerExistingDialog = true;
    },
    checkExistingDocs() {
      // let date = moment().format("YYYYMMDD");
      let getDocumentNoURL = `${this.api}get/generated_documentno?selectedDate=${this.dateToday}&year=2021`;
      axios.get(getDocumentNoURL).then((res) => {
        if (res.data != "Schedule does not exist") {
          let url = `${this.api}checkExistsDocs?person=${this.newDocument.personInCharge}&date=${res.data}`;
          axios.get(url).then((res) => {
            this.newDocument._id = res.data;
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.data,
          });
        }
      });
    },
    callback(key) {
      this.tabModel = key;
    },
    callbackBeforeTheMeeting(key) {
      this.tabModelBeforeTheMeeting = key;
    },
    callbackAfterTheMeeting(key) {
      this.tabModelAfterTheMeeting = key;
    },
    callbacktoUpdate(key) {
      this.tabModeltoUpdate = key;
    },

    loadAllYear() {
      let year = moment().format("YYYY");
      let url = `${this.api}get/year/schedules`;
      axios
        .get(url)
        .then((res) => {
          this.optYear = res.data;
          if (this.optYear.includes(year)) {
            this.year = year;
          }
        })
        .then(() => {
          this.getBeforeTheMeetingList();
          this.getAfterTheMeetingList();
          this.getToUpdateList();
          this.loadListOfScheduleDate();
        });
    },

    getPersonInCharge() {
      this.selectionBeforeTheMeeting = [];

      let url = `${this.api}get/personincharge`;
      axios.get(url).then((res) => {
        this.selectionBeforeTheMeeting = res.data;
        // this.selectionBeforeTheMeeting.unshift("All");
      });
    },

    getAfterTheMeetingList() {
      let url = `${this.api}get/before_and_after_the_meeting?year=${this.year}&kind=After`;
      axios.get(url).then((res) => {
        this.listAfterTheMeeting = res.data;
        this.loading = false;
      });
    },

    getBeforeTheMeetingList() {
      this.listBeforeTheMeeting = [];

      let url = `${this.api}get/before_and_after_the_meeting?year=${this.year}&kind=Before`;

      axios.get(url).then((res) => {
        this.listBeforeTheMeeting = res.data;
      });
    },

    getToUpdateList() {
      this.listToUpdate = [];
      let url = `${this.api}get/before_and_after_the_meeting?year=${this.year}&kind=ToUpdate`;

      axios.get(url).then((res) => {
        this.listToUpdate = res.data;
      });
    },

    saveNewDocument(id) {
      let kind = "";
      if (this.tabModel == "1") {
        kind = "Before";
      } else {
        kind = "After";
      }

      let updatedby = "";
      if (this.userInfo.full_name) {
        updatedby = this.userInfo.full_name;
      } else {
        updatedby = this.userInfo.LastName;
      }

      let sampleDate = "";
      let urlDate = `${this.api}get/new_register_quarter?year=${this.year}&dateToday=${this.dateToday}&beforeORtoUpdate=before`;
      axios.get(urlDate).then((res) => {
        sampleDate = res.data;
        if (kind == "Before") {
          if (this.newDocument.personInCharge && sampleDate) {
            let url = `${this.api}create/new_document/${id}?person=${this.newDocument.personInCharge}&date=${sampleDate}&updatedby=${updatedby}`;
            axios.post(url);
            this.registerDialog = false;
            this.CHANGE_ITEM(id);
            this.$router.push(`/edit_document?kind=Before&documentno=${id}`);
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Invalid !!",
            });
          }
        } else {
          if (!this.reviseReason) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Please give me a reason !!",
            });

            return false;
          }
          //Revise
          else {
            axios
              .post(
                `${this.api}add/revision_reason/${this.reviseReason}/${id}/${this.personInCharge}`
              )
              .then(() => {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Successfully Moved to Temporary",
                  showConfirmButton: false,
                  timer: 1500,
                });
              });

            this.reviseDialog = false;
          }
        }
      });
    },

    saveExistingDocument(id) {
      if (id && this.newDocument.personInCharge) {
        let url = `${this.api}create/new_existing_document/${id}?person=${this.newDocument.personInCharge}&updatedby=${this.userInfo.full_name}`;
        axios.post(url).then((res) => {
          let icon = "";
          if (res.data == "Success!") {
            icon = "success";
            this.registerExistingDialog = false;
            this.CHANGE_ITEM(id);
            this.$router.push(`/edit_document?kind=Before&documentno=${id}`);
          } else {
            icon = "error";
          }
          Swal.fire({
            position: "top-end",
            icon: icon,
            title: res.data,
            showConfirmButton: false,
            timer: 1500,
          });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid !!",
        });
      }
    },
  },
  computed: {
    beforeTheMeetingfilteredItem() {
      let quarter = "";
      if (this.tabModelBeforeTheMeeting == "1") {
        quarter = "FirstQuarter";
      } else if (this.tabModelBeforeTheMeeting == "2") {
        quarter = "SecondQuarter";
      } else if (this.tabModelBeforeTheMeeting == "3") {
        quarter = "ThirdQuarter";
      } else if (this.tabModelBeforeTheMeeting == "4") {
        quarter = "FourthQuarter";
      } else if (this.tabModelBeforeTheMeeting == "5") {
        quarter = "FifthQuarter";
      }

      if (this.listBeforeTheMeeting[quarter]) {
        return this.listBeforeTheMeeting[quarter]
          .filter((data) => {
            // remove html code
            data.title = data.title.replace(/<[^>]*>/gi, "");
            return data._id
              .toLowerCase()
              .includes(this.toSearchBeforeTheMeeting.toLowerCase());
          })
          .filter((rec) => {
            if (rec.personInCharge) {
              if (this.selectedBeforeTheMeeting.value != "All") {
                return rec.personInCharge.includes(
                  this.selectedBeforeTheMeeting.value
                );
              } else {
                return rec;
              }
            }
          })
          .filter((rec) => {
            if (this.selectedStatusList == "No copy") {
              return !rec.alreadyInAfter;
            } else if (this.selectedStatusList == "Already have copy") {
              return rec.alreadyInAfter;
            } else {
              return rec;
            }
          });
      } else {
        return [];
      }
    },

    afterTheMeetingfilteredItem() {
      let quarter = "";
      if (this.tabModelAfterTheMeeting == "1") {
        quarter = "FirstQuarter";
      } else if (this.tabModelAfterTheMeeting == "2") {
        quarter = "SecondQuarter";
      } else if (this.tabModelAfterTheMeeting == "3") {
        quarter = "ThirdQuarter";
      } else if (this.tabModelAfterTheMeeting == "4") {
        quarter = "FourthQuarter";
      } else if (this.tabModelAfterTheMeeting == "5") {
        quarter = "FifthQuarter";
      }

      if (this.listAfterTheMeeting[quarter]) {
        return this.listAfterTheMeeting[quarter]
          .filter((data) => {
            data.title = data.title.replace(/<[^>]*>/gi, "");
            return data._id.toLowerCase().includes(this.toSearch.toLowerCase());
          })
          .filter((rec) => {
            if (rec.personInCharge) {
              if (this.selectedBeforeTheMeeting.value != "All") {
                return rec.personInCharge.includes(
                  this.selectedBeforeTheMeeting.value
                );
              } else {
                return rec;
              }
            }
          })
          .filter((rec) => {
            if (this.selectedStatusList == "No copy") {
              return !rec.alreadyInToUpdate;
            } else if (this.selectedStatusList == "Already have copy") {
              return rec.alreadyInToUpdate;
            } else {
              return rec;
            }
          });
      } else {
        return [];
      }
    },

    toUpdatefilteredItem() {
      let quarter = "";
      if (this.tabModeltoUpdate == "1") {
        quarter = "FirstQuarter";
      } else if (this.tabModeltoUpdate == "2") {
        quarter = "SecondQuarter";
      } else if (this.tabModeltoUpdate == "3") {
        quarter = "ThirdQuarter";
      } else if (this.tabModeltoUpdate == "4") {
        quarter = "FourthQuarter";
      } else if (this.tabModeltoUpdate == "5") {
        quarter = "FifthQuarter";
      }

      if (this.listToUpdate[quarter]) {
        return this.listToUpdate[quarter]
          .filter((data) => {
            data.title = data.title.replace(/<[^>]*>/gi, "");
            return data._id.toLowerCase().includes(this.toSearch.toLowerCase());
          })
          .filter((rec) => {
            if (rec.personInCharge) {
              if (this.selectedBeforeTheMeeting.value != "All") {
                return rec.personInCharge.includes(
                  this.selectedBeforeTheMeeting.value
                );
              } else {
                return rec;
              }
            }
          })
          .filter((rec) => {
            if (this.selectedStatusList == "No copy") {
              return !rec.alreadyInFinal;
            } else if (this.selectedStatusList == "Already have copy") {
              return rec.alreadyInFinal;
            } else {
              return rec;
            }
          });
      } else {
        return [];
      }
    },

    //Rulebook Document Data with pagination
    pageCountOfBeforeMeeting() {
      let l = this.beforeTheMeetingfilteredItem.length,
        s = this.intRowNoRulebookDocument;
      return Math.ceil(l / s);
    },
    pageCountOfAfterMeeting() {
      let l = this.afterTheMeetingfilteredItem.length,
        s = this.intRowNoRulebookDocument;
      return Math.ceil(l / s);
    },
    pageCountOftoUpdate() {
      let l = this.toUpdatefilteredItem.length,
        s = this.intRowNoRulebookDocument;
      return Math.ceil(l / s);
    },

    beforeTheMeetingData() {
      const start = (this.intPageNo - 1) * this.intRowNoRulebookDocument,
        end = start + this.intRowNoRulebookDocument;
      return this.beforeTheMeetingfilteredItem.slice(start, end);
    },
    afterTheMeetingData() {
      const start = (this.intPageNo - 1) * this.intRowNoRulebookDocument,
        end = start + this.intRowNoRulebookDocument;
      return this.afterTheMeetingfilteredItem.slice(start, end);
    },
    toUpdateData() {
      const start = (this.intPageNo - 1) * this.intRowNoRulebookDocument,
        end = start + this.intRowNoRulebookDocument;
      return this.toUpdatefilteredItem.slice(start, end);
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
