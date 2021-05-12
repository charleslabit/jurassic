<template>
  <v-container fluid pa-1 ma-0>

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

            &emsp;
          </v-layout>
          <v-list
            style="overflow-y: scroll"
            :height="$vuetify.breakpoint.height - 300"
          >
            <v-checkbox
              dense
              hide-details
              label="Select All"
              v-model="allSelected"
              @click="selectAll()"
            ></v-checkbox>

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

  </v-container>
</template>

<script>
import axios from "axios";
// import Swal from "sweetalert2";
// import moment from "moment";

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
      tabModel: 1,
      tabModeltoUpdate: "1",
      RulebookUpdatedDate: "",
      listAfterTheMeeting: [],
      listToUpdate: [],

 

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
    
  

    callbacktoUpdate(key) {
      this.tabModeltoUpdate = key;
    },


    getPersonInCharge() {
      this.selectionBeforeTheMeeting = [];

      let url = `${this.api}process/get/japanese_incharge`;
      axios.get(url).then((res) => {
        this.selectionBeforeTheMeeting = res.data;
        // this.selectionBeforeTheMeeting.unshift("All");
      });
    },

  


    getToUpdateList() {
      this.listToUpdate = [];
      let url = `${this.api}process/get/rulebook_documents?year=${this.year}&kind=ToUpdate`;

      axios.get(url).then((res) => {
        this.listToUpdate = res.data;
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
  },
  computed: {
  
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

  
    pageCountOftoUpdate() {
      let l = this.toUpdatefilteredItem.length,
        s = this.intRowNoRulebookDocument;
      return Math.ceil(l / s);
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
