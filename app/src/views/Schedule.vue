<template>
  <v-container pa-1 ma-1 fluid>
    <v-toolbar dense flat class="mt-1">
      <v-toolbar-title>Schedules</v-toolbar-title>
      <v-row no-gutters dense>
        <v-col cols="3">
          <v-select
            label="Year"
            class="mt-3 ml-3"
            dense
            outlined
            v-model="year"
            :items="optYear"
            @change="loadAllSchedule(year)"
          ></v-select>
        </v-col>
        <v-col
          v-if="
            userInfo.EmployeeNumber == '0392' ||
              userInfo.employee_code == '11726'
          "
        >
          <v-btn color="primary" class="mt-3 ml-3" @click="newYearDialog = true"
            ><v-icon>mdi-calendar-plus</v-icon>New</v-btn
          >
        </v-col>
      </v-row>
    </v-toolbar>
    <v-data-table :headers="headers" :items="yearData">
      <template
        v-if="
          userInfo.EmployeeNumber == '0392' || userInfo.employee_code == '11726'
        "
        v-slot:item.actions="{ item }"
      >
        <v-icon
          color="primary"
          class="mr-2"
          @click="editSchedule(item)"
          :disabled="!item.enabled"
        >
          mdi-calendar-edit
        </v-icon>
      </template>
    </v-data-table>

    <!-- YEAR DIALOG -->
    <v-dialog v-model="newYearDialog" width="300px" persistent>
      <v-card flat>
        <v-toolbar flat dense color="#1565c0" dark>
          <v-toolbar-title> New Year </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="newYearDialog = false"> mdi-close </v-icon>
        </v-toolbar>

        <v-layout class="pa-1 mt-2">
          <v-text-field
            outlined
            dense
            class="ml-1 mr-1"
            label="Please input year"
            v-model="scheduleYear"
            v-mask="mask"
          >
          </v-text-field>
          <v-spacer></v-spacer>
          <v-btn
            class="mt-2"
            small
            dark
            style="background-color: #1565c0"
            @click="saveYear()"
          >
            SAVE
            <v-icon> mdi-update </v-icon>
          </v-btn>
        </v-layout>
      </v-card>
    </v-dialog>
    <!-- UPDATE SCHEDULE DIALOG -->
    <v-dialog v-model="scheduleDialog" width="480px" persistent>
      <v-toolbar flat dense color="#1565c0" dark>
        <v-toolbar-title>
          <v-icon>mdi-calendar</v-icon> Schedule
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon @click="saveSchedule()"> mdi-close </v-icon>
      </v-toolbar>
      <v-card>
        <v-layout class="pa-4">
          <v-row dense>
            <v-col cols="9">
              <span>Before the Meeting:</span>
              <a-date-picker
                valueFormat="YYYY-MM-DD"
                class="ml-2"
                placeholder="Before the Meeting"
                v-model="updateSchedule.before"
              />
            </v-col>
            <v-col cols="9">
              <span> Meeting:</span>
              <a-date-picker
                valueFormat="YYYY-MM-DD"
                style="margin-left: 74px"
                placeholder="Meeting"
                v-model="updateSchedule.meeting"
              />
            </v-col>

            <v-col cols="9">
              <span>After the Meeting:</span>
              <a-date-picker
                valueFormat="YYYY-MM-DD"
                class="ml-4"
                placeholder="After the Meeting"
                v-model="updateSchedule.after"
              />
            </v-col>
          </v-row>
        </v-layout>
      </v-card>
    </v-dialog>

    <!-- Send Email Dialog -->
    <v-dialog v-model="sendNotifDialog">
      <v-toolbar flat dense color="#1565c0" dark>
        <v-toolbar-title>
          <v-icon>mdi-email-variant</v-icon> Send Notification
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon @click="sendNotifDialog = false"> mdi-close </v-icon>
      </v-toolbar>
    </v-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
import { mask } from "vue-the-mask";
import Swal from "sweetalert2";
import moment from "moment";
export default {
  directives: { mask },
  data() {
    return {
      mask: "####",
      scheduleYear: "",
      newYearDialog: false,
      scheduleDialog: false,
      sendNotifDialog: false,
      year: "",
      yearData: [],
      optYear: [],
      headers: [
        { text: "Koushin", value: "label", divider: true },
        {
          text: "Before the Meeting Schedule Date",
          value: "before",
          divider: true,
        },
        { text: "Meeting Schedule Date", value: "meeting", divider: true },
        {
          text: "After the Meeting Schedule Date",
          value: "after",
          divider: true,
        },
        { text: "", value: "actions", divider: true },
      ],
      updateSchedule: {},
    };
  },
  created() {
    this.loadAllYear();
  },
  methods: {
    saveSchedule() {
      this.scheduleDialog = false;
      let url = `${this.api}schedule/update/${this.year}`;
      axios.post(url, this.updateSchedule).then(() => {
        Swal.fire({
          icon: "success",
          title: "Save",
          showConfirmButton: false,
          timer: 850,
        });
        this.loadAllSchedule(this.year);
      });
    },

    editSchedule(data) {
      this.scheduleDialog = true;
      this.updateSchedule = Object.assign({}, data);
    },
    loadAllSchedule(year) {
      this.yearData = [];
      let url = `${this.api}schedule/get/${year}`;
      axios.get(url).then((res) => {
        if (
          Object.keys(res.data).length === 0 &&
          res.data.constructor === Object
        ) {
          for (let i = 0; i < 5; i++) {
            let toInsert = {};
            switch (i) {
              case 0:
                toInsert.quarter = "First";
                toInsert.label = `Koushin${year.substring(2, 4)}-01`;
                toInsert.enabled = true;
                break;
              case 1:
                toInsert.quarter = "Second";
                toInsert.label = `Koushin${year.substring(2, 4)}-02`;
                break;
              case 2:
                toInsert.quarter = "Third";
                toInsert.label = `Koushin${year.substring(2, 4)}-03`;
                break;
              case 3:
                toInsert.quarter = "Fourth";
                toInsert.label = `Koushin${year.substring(2, 4)}-04`;
                break;
              case 4:
                toInsert.quarter = "Fifth";
                toInsert.label = `Koushin${year.substring(2, 4)}-05`;
            }
            toInsert.before = "";
            toInsert.meeting = "";
            toInsert.after = "";

            this.yearData.push(toInsert);
          }
        } else {
          for (let i = 0; i < 5; i++) {
            let toInsert = {};
            switch (i) {
              case 0:
                toInsert.quarter = "First";
                toInsert.label = `Koushin${year.substring(2, 4)}-01`;
                break;
              case 1:
                toInsert.quarter = "Second";
                toInsert.label = `Koushin${year.substring(2, 4)}-02`;
                break;
              case 2:
                toInsert.quarter = "Third";
                toInsert.label = `Koushin${year.substring(2, 4)}-03`;
                break;
              case 3:
                toInsert.quarter = "Fourth";
                toInsert.label = `Koushin${year.substring(2, 4)}-04`;
                break;
              case 4:
                toInsert.quarter = "Fifth";
                toInsert.label = `Koushin${year.substring(2, 4)}-05`;
            }
            if (res.data[toInsert.quarter]) {
              res.data[toInsert.quarter].map((r, i) => {
                if (i == 0) {
                  toInsert.before = r;
                } else if (i == 1) {
                  toInsert.meeting = r;
                } else if (i == 2) {
                  toInsert.after = r;
                }
              });
            } else {
              toInsert.before = "";
              toInsert.meeting = "";
              toInsert.after = "";
            }

            this.yearData.push(toInsert);
          }
        }
        for (let x = 0; x < this.yearData.length; x++) {
          if (
            this.yearData[x].before &&
            this.yearData[x].meeting &&
            this.yearData[x].after
          ) {
            this.yearData[x + 1].enabled = true;
            this.yearData[x].enabled = true;
          } else if (
            this.yearData[x].before ||
            this.yearData[x].meeting ||
            this.yearData[x].after
          ) {
            this.yearData[x].enabled = true;
          }
        }
      });
    },
    loadAllYear() {
      let year = moment().format("YYYY");
      let url = `${this.api}schedule/get/year`;
      axios.get(url).then((res) => {
        this.optYear = res.data;
        if (this.optYear.includes(year)) {
          this.year = year;
          this.loadAllSchedule(this.year);
        }
      });
    },
    saveYear() {
      let url = `${this.api}schedule/add/year/${this.scheduleYear}`;
      if (this.scheduleYear && this.scheduleYear.length == 4) {
        axios.get(url).then((res) => {
          if (res.data == "OK") {
            Swal.fire({
              icon: "success",
              title: "Successfully Added!",
              showConfirmButton: false,
              timer: 850,
            });
            this.loadAllYear();
            this.newYearDialog = false;
          } else {
            Swal.fire({
              icon: "error",
              title: "Year already exists!",
              showConfirmButton: false,
              timer: 850,
            });
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Please input valid year",
          showConfirmButton: false,
          timer: 850,
        });
      }
    },
  },
};
</script>
