<template>
  <v-container fluid pa-1 ma-0>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="Before the Meeting" v-model="tabModel">
        <div>
          <a-tabs :default-active-key="tabModelBeforeTheMeeting" @change="callbackBeforeTheMeeting">
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
                <v-select
                  dense
                  outlined
                  class="pr-4"
                  :items="selectionBeforeTheMeeting"
                  v-model="selectedBeforeTheMeeting"
                  label="Person in Charge"
                >
                </v-select>
              </v-col>
              <!-- <v-col cols="1">
                <a-date-picker
                  v-model="RulebookUpdatedDate"
                  valueFormat="YYYY-MM-DD"
                  size="large"
                >
                </a-date-picker>
              </v-col> -->
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
                  <v-icon color="green"> mdi-marker-check </v-icon>
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
          <a-tabs default-active-key="1" @change="callbackAfterTheMeeting">
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
                <v-select
                  dense
                  outlined
                  class="pr-4"
                  :items="selectionBeforeTheMeeting"
                  v-model="selectedBeforeTheMeeting"
                  label="Person in Charge"
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
                <span v-if="item.alreadyInToUpdate">
                  <v-icon color="green"> mdi-marker-check </v-icon>
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
          <a-tabs default-active-key="1" @change="callbackAfterTheMeeting">
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
                <v-select
                  dense
                  outlined
                  class="pr-4"
                  :items="selectionBeforeTheMeeting"
                  v-model="selectedBeforeTheMeeting"
                  label="Person in Charge"
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
              </v-list-item>
              <v-divider
                v-if="i < afterTheMeetingData.length - 1"
                :key="i"
              ></v-divider>
            </template>
          </v-list>
          <v-pagination
            v-model="intPageNo"
            :length="pageCountOfAfterMeeting"
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
            <v-text-field
              @keyup="toUpperCase()"
              label="Person-In-charge"
              outlined
              dense
              v-model="newDocument.personInCharge"
              @blur="checkExistingDocs()"
            ></v-text-field>
          </v-col>
          <v-col cols="5">
            <!-- <v-text-field
              label="Date(Temporary)"
              outlined
              dense
              v-model="dateToday"
            ></v-text-field> -->
            <a-date-picker
              v-model="dateToday"
              valueFormat="YYYY-MM-DD"
              size="large"
            >
            </a-date-picker>
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
      selectedBeforeTheMeeting: "All",
      listBeforeTheMeeting: [],
      toSearchBeforeTheMeeting: "",
      tabModel: 1,
      tabModelBeforeTheMeeting: "1",
      tabModelAfterTheMeeting: "1",
      RulebookUpdatedDate: "",
      updatedRules: [],

      registerDialog: false,
      newDocument: { personInCharge: "", _id: "" },

      year: "",
      yearData: [],
      optYear: [],

      dateToday: moment().format("YYYY-MM-DD"),
    };
  },
  mounted() {},
  created() {
    if (this.$route.query.personInCharge) {
      this.selectedBeforeTheMeeting = this.$route.query.personInCharge;

      let koushin = this.$route.query.koushin;
      if (koushin == "First") {
        this.tabModelBeforeTheMeeting = "1";
      } else if (koushin == "Second") {
        this.tabModelBeforeTheMeeting = "2";
      } else if (koushin == "Third") {
        this.tabModelBeforeTheMeeting = "3";
      } else if (koushin == "Fourth") {
        this.tabModelBeforeTheMeeting = "4";
      } else {
        this.tabModelBeforeTheMeeting = "5";
      }
    }
    this.loadAllYear();
    setTimeout(() => {
      this.getBeforeTheMeetingList();
      this.getAfterTheMeetingList();
      this.getPersonInCharge();
    }, 1000);
  },
  watch: {
    tabModel() {
      this.selectedBeforeTheMeeting = "All";
      this.getPersonInCharge();
    },
    approvedDialog() {
      this.checkExistNewDocument();
    },
  },
  methods: {
    editDocument(val) {
      let kind = "";

      if (this.tabModel == "1") {
        kind = "Before";
      } else if(this.tabModel == "2"){
        kind = "After";
      } else {
        kind = "ToUpdate"
      }
      this.CHANGE_ITEM(val);
      this.$router.push(`/edit_document?kind=${kind}`);
    },
    toUpperCase() {
      this.newDocument.personInCharge = this.newDocument.personInCharge.toUpperCase();
    },
    registerNew() {
      this.registerDialog = true;
      this.newDocument = { _id: "", personInCharge: "" };
    },
    checkExistingDocs() {
      let date = moment().format("YYYYMMDD");
      // console.log('Date:',date)
      let url = `${this.api}checkExistsDocs?person=${this.newDocument.personInCharge}&date=${date}`;
      console.log(url)
      axios.get(url).then((res) => {
        // console.log(res.data);
        this.newDocument._id = res.data;
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

    loadAllYear() {
      let year = moment().format("YYYY");
      let url = `${this.api}get/year/schedules`;
      axios.get(url).then((res) => {
        this.optYear = res.data;
        if (this.optYear.includes(year)) {
          this.year = year;
        }
      });
    },

    getPersonInCharge() {
      this.selectionBeforeTheMeeting = [];
      let beforeORafter = "";
      let afterORtoUpdate = "";
      if (this.tabModel == "1") {
        beforeORafter = "before";
      } else {
        beforeORafter = "after";
      }

      if (this.tabModel == "2") {
        afterORtoUpdate = "after";
      } else if (this.tabModel == "3") {
        afterORtoUpdate = "toUpdate";
      }

      let url = `${this.api}get/personincharge?beforeORafter=${beforeORafter}&afterORtoUpdate=${afterORtoUpdate}`;
      axios.get(url).then((res) => {
        this.selectionBeforeTheMeeting = res.data;
        this.selectionBeforeTheMeeting.unshift("All");
      });
    },

    getAfterTheMeetingList() {
      let url = `${this.api}get/before_and_after_the_meeting?year=${this.year}&kind=After`;
      axios.get(url).then((res) => {
        this.updatedRules = res.data;
        this.loading = false;
      });
    },

    getBeforeTheMeetingList() {
      this.listBeforeTheMeeting = [];

      let url = `${this.api}get/before_and_after_the_meeting?year=${this.year}&kind=Before`;

      axios.get(url).then((res) => {
        this.listBeforeTheMeeting = res.data;
        // this.loading = false;
      });
    },


    getToUpdateList() {
      this.listBeforeTheMeeting = [];
      let url = `${this.api}get/before_and_after_the_meeting?year=${this.year}&kind=ToUpdate`;

      axios.get(url).then((res) => {
        this.listBeforeTheMeeting = res.data;
        // this.loading = false;
      });
    },

    saveNewDocument(id) {
      let kind = "";
      if (this.tabModel == "1") {
        kind = "Before";
      } else {
        kind = "After";
      }
      let sampleDate = "";
      let urlDate = `${this.api}get/new_register_quarter?year=${this.year}&dateToday=${this.dateToday}&beforeORtoUpdate=before`;
      axios.get(urlDate).then((res) => {
        sampleDate = res.data;
        if (kind == "Before") {
          let url = `${this.api}create/new_document/${id}?person=${this.newDocument.personInCharge}&date=${sampleDate}`;
          axios.post(url);
          this.registerDialog = false;
          this.CHANGE_ITEM(id);
          this.$router.push("/edit_document?kind=Before");
        } else {
          if (!this.reviseReason) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Please give me a reason !!",
            });

            return false;
          } else {
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
            this.selectRule(id);
          }
        }
      });
    },
  },
  computed: {
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

      if (this.updatedRules[quarter]) {
        return this.updatedRules[quarter]
          .filter((data) => {
            return (
              data.isApproved == (this.tabModel == 2 ? "temporary" : false) &&
              data._id.toLowerCase().includes(this.toSearch.toLowerCase())
            );
          })
          .filter((rec) => {
            if (rec.personInCharge) {
              if (this.selectedBeforeTheMeeting != "All") {
                return rec._id.includes(this.selectedBeforeTheMeeting);
              } else {
                return rec;
              }
            }
          });
      } else {
        return [];
      }
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
            return data._id
              .toLowerCase()
              .includes(this.toSearchBeforeTheMeeting.toLowerCase());
          })
          .filter((rec) => {
            if (rec.personInCharge) {
              if (this.selectedBeforeTheMeeting != "All") {
                return rec.personInCharge.includes(
                  this.selectedBeforeTheMeeting
                );
              } else {
                return rec;
              }
            }
          });
        // .filter((rec) => {
        //   if (this.RulebookUpdatedDate && this.tabModel == "1") {
        //     return rec.RulebookUpdatedDate == this.RulebookUpdatedDate;
        //   } else {
        //     return rec;
        //   }
        // });
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
    pageCountOfBeforeMeeting() {
      let l = this.beforeTheMeetingfilteredItem.length,
        s = this.intRowNoRulebookDocument;
      return Math.ceil(l / s);
    },
    afterTheMeetingData() {
      const start = (this.intPageNo - 1) * this.intRowNoRulebookDocument,
        end = start + this.intRowNoRulebookDocument;
      return this.afterTheMeetingfilteredItem.slice(start, end);
    },
    beforeTheMeetingData() {
      const start = (this.intPageNo - 1) * this.intRowNoRulebookDocument,
        end = start + this.intRowNoRulebookDocument;
      return this.beforeTheMeetingfilteredItem.slice(start, end);
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
