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
                  <template v-slot:item="{ item }">
                    {{ item.text }}
                    <v-icon :color="item.color" class="pl-2">{{
                      item.icon
                    }}</v-icon>
                  </template>
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

                <span v-if="item.alreadyInAfter">
                  <v-icon color="#1565c0"> mdi-check-decagram-outline </v-icon>
                </span>
                <span v-else>
                  <v-icon color="red"> mdi-check-decagram-outline </v-icon>
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
                  <template v-slot:item="{ item }">
                    {{ item.text }}
                    <v-icon :color="item.color" class="pl-2">{{
                      item.icon
                    }}</v-icon>
                  </template>
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

                <span v-if="item.alreadyInToUpdate">
                  <v-icon color="#1565c0"> mdi-check-decagram-outline </v-icon>
                </span>
                <span v-else>
                  <v-icon color="red"> mdi-check-decagram-outline </v-icon>
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
                  hide-details
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
                  hide-details
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
                  hide-details
                >
                  <template v-slot:item="{ item }">
                    {{ item.text }}
                    <v-icon :color="item.color" class="pl-2">{{
                      item.icon
                    }}</v-icon>
                  </template>
                </v-select>
              </v-col>

              <v-spacer></v-spacer>
              <span class="mt-2 mr-4"
                ><v-icon color="#1565c0">mdi-file-pdf-outline</v-icon>
                {{ toUpdatefilteredItem.length }}
              </span>
            </v-row>
          </v-layout>
          <v-row dense no-gutters class="pl-3">
            <v-checkbox
              class="mx-1"
              dense
              hide-details
              :label="allSelected ? 'Uncheck All' : 'Check All'"
              v-model="allSelected"
              @click="selectAll()"
            ></v-checkbox>
            <v-btn
              small
              class="mx-4 my-3"
              color="#1565c0"
              dark
              @click="sendAll()"
              >Transfer
              <v-icon>
                mdi-send-circle-outline
              </v-icon>
            </v-btn>
          </v-row>
          <v-divider></v-divider>
          <v-list
            style="overflow-y: scroll"
            :height="$vuetify.breakpoint.height - 330"
          >
            <v-layout align-center justify-center v-if="loading" pt-3>
              <a-spin tip="Loading..."> </a-spin>
            </v-layout>

            <template else v-for="(item, i) in toUpdateData" v-else>
              <v-list-item :key="item._id">
                <v-checkbox
                  :disabled="item.alreadyInFinal"
                  @click="allSelected = false"
                  dense
                  hide-details
                  v-model="selected"
                  :value="item._id"
                  class="pb-4"
                ></v-checkbox>
                <v-icon color="#1565c0" @click="editDocument(item._id)"
                  >mdi-file-document</v-icon
                >

                <v-list-item-title
                  v-text="`${item._id}${title_spacer}${item.title}`"
                  class="font-weight-medium"
                ></v-list-item-title>

                <span v-if="item.alreadyInFinal">
                  <v-icon color="#1565c0"> mdi-check-decagram-outline</v-icon>
                </span>
                <span v-else>
                  <v-icon color="red"> mdi-check-decagram-outline</v-icon>
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
              @change="checkExistingDocs()"
            ></v-text-field>
          </v-col>
          <v-col cols="5">
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
              v-model="computedDocumentID"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-layout class="ma-1 pa-1" dense>
          <v-spacer></v-spacer>
          <v-btn
            color="#1565c0"
            dark
            @click="saveNewDocument(computedDocumentID)"
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

      dateToday: "",

      registerExistingDialog: false,
      // statusList: ["All", "Unfinished", "Finished"],
      statusList: [
        { text: "All", icon: "" },
        {
          text: "Unfinished",
          icon: "mdi-check-decagram-outline",
          color: "red",
        },
        { text: "Finished", icon: "mdi-check-decagram-outline", color: "blue" },
      ],
      selectedStatusList: "All",

      personInChargeList: [],

      listofScheduleDate: [],

      selected: [],
      allSelected: false,
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
  },
  watch: {
    year() {
      this.loadListOfScheduleDate();
    },
  },
  methods: {
    loadListOfScheduleDate() {
      let url = `${this.api}schedule/get/date/${this.year}`;
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
      let url = `${this.api}schedule/get/latest_date/${this.year}`;
      console.log(url);
      axios.get(url).then((res) => {
        this.newDocument = { _id: "", personInCharge: "" };
        this.dateToday = res.data;
        console.log(res.data);
        this.registerDialog = true;
      });
    },
    registerExisting() {
      this.newDocument = { _id: "", personInCharge: "" };
      this.registerExistingDialog = true;
    },
    checkExistingDocs() {
      let getDocumentNoURL = `${this.api}process/check/exist_documentno?selectedDate=${this.dateToday}&year=${this.year}`;
      // console.log(getDocumentNoURL)
      axios.get(getDocumentNoURL).then((res) => {
        if (res.data != "Schedule does not exist") {
          let url = `${this.api}process/generate/initial_documentno?person=${this.newDocument.personInCharge}&date=${res.data}`;
          // console.log(url);
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
      let url = `${this.api}schedule/get/year`;
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

      let url = `${this.api}process/get/japanese_incharge`;
      axios.get(url).then((res) => {
        this.selectionBeforeTheMeeting = res.data;
        // this.selectionBeforeTheMeeting.unshift("All");
      });
    },

    getAfterTheMeetingList() {
      let url = `${this.api}process/get/rulebook_documents?year=${this.year}&kind=After`;
      axios.get(url).then((res) => {
        this.listAfterTheMeeting = res.data;
        this.loading = false;
      });
    },

    getBeforeTheMeetingList() {
      this.listBeforeTheMeeting = [];

      let url = `${this.api}process/get/rulebook_documents?year=${this.year}&kind=Before`;

      axios.get(url).then((res) => {
        this.listBeforeTheMeeting = res.data;
      });
    },

    getToUpdateList() {
      this.listToUpdate = [];
      let url = `${this.api}process/get/rulebook_documents?year=${this.year}&kind=ToUpdate`;

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

      let scheduleDate = "";
      let urlDate = `${this.api}process/get/new_documentno?year=${this.year}&dateToday=${this.dateToday}&beforeORtoUpdate=before`;
      console.log(urlDate);
      axios.get(urlDate).then((res) => {
        scheduleDate = res.data;
        if (kind == "Before") {
          if (this.newDocument.personInCharge && scheduleDate) {
            let url = `${this.api}process/create/new_document/${id}?person=${this.newDocument.personInCharge}&date=${scheduleDate}&updatedby=${this.updatedby}`;
            axios.post(url).then(() => {
              this.registerDialog = false;
              this.CHANGE_ITEM(id);
              this.$router.push(`/edit_document?kind=${kind}&documentno=${id}`);
            });
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

    selectAll() {
      if (this.allSelected) {
        this.selected = [];

        const xToUpdateData = this.toUpdateData.filter((rec) => {
          return !rec.alreadyInFinal;
        });

        for (const value in xToUpdateData) {
          this.selected.push(xToUpdateData[value]._id);
        }
      } else {
        this.selected = [];
      }
    },

    sendAll() {
      let updatedDate = moment().format("YYYY-MM-DD hh:mm:ss");
      let url = `${this.api}process/confirm_bulk_document`;

      let toUpdate = {};
      if (this.userInfo.employee_code) {
        toUpdate.approver = {
          name: this.userInfo.full_name,
          updatedDate: updatedDate,
        };
      } else {
        toUpdate.approver = {
          name: this.userInfo.LastName,
          updatedDate: updatedDate,
        };
      }
      toUpdate.documentID = this.selected;
      Swal.fire({
        title: "Are you sure?",
        text: "It will move to the Final Document!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, Confirm !`,
      }).then((result) => {
        if (result.value) {
          axios.post(url, toUpdate).then(() => {
            window.location.reload();

            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Successfully moved to the Final Document.",
              showConfirmButton: false,
              timer: 1500,
            });
          });
        }
      });
    },
  },
  computed: {
    computedDocumentID() {
      return this.newDocument._id;
    },
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
                return (
                  rec.personInCharge.includes(
                    this.selectedBeforeTheMeeting.value
                  ) ||
                  rec.personInCharge.toLowerCase() ==
                    this.selectedBeforeTheMeeting.text.toLowerCase()
                );
              } else {
                return rec;
              }
            }
          })
          .filter((rec) => {
            if (this.selectedStatusList == "Unfinished") {
              return !rec.alreadyInAfter;
            } else if (this.selectedStatusList == "Finished") {
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
                return (
                  rec.personInCharge.includes(
                    this.selectedBeforeTheMeeting.value
                  ) ||
                  rec.personInCharge.toLowerCase() ==
                    this.selectedBeforeTheMeeting.text.toLowerCase()
                );
              } else {
                return rec;
              }
            }
          })
          .filter((rec) => {
            if (this.selectedStatusList == "Unfinished") {
              return !rec.alreadyInToUpdate;
            } else if (this.selectedStatusList == "Finished") {
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
                return (
                  rec.personInCharge.includes(
                    this.selectedBeforeTheMeeting.value
                  ) ||
                  rec.personInCharge.toLowerCase() ==
                    this.selectedBeforeTheMeeting.text.toLowerCase()
                );
              } else {
                return rec;
              }
            }
          })
          .filter((rec) => {
            if (this.selectedStatusList == "Unfinished") {
              return !rec.alreadyInFinal;
            } else if (this.selectedStatusList == "Finished") {
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
