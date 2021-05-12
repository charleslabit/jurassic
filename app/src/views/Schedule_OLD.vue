<template>
  <v-container pa-0 fluid>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="Before the Meeting Schedule">
        <v-layout class="ma-2">
          <div style="width: 10%">
            <v-select
              dense
              outlined
              :items="scheduleSelectList"
              v-model="scheduleDateModel"
              label="Year"
              @change="getRec()"
            >
            </v-select>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            dark
            style="background-color: #1565c0"
            @click="newScheduleDialog = true"
          >
            New Schedule
            <v-icon> mdi-clock-outline </v-icon>
          </v-btn>
        </v-layout>

        <v-data-table
          :headers="headers"
          :items="scheduleData"
          :items-per-page="5"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:item.action="item">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="green"
                  icon
                  small
                  dark
                  @click="editDate(item)"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-calendar-edit</v-icon>
                </v-btn>
              </template>
              <span>Update Date</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="green"
                  icon
                  small
                  dark
                  @click="
                    getUsers(item.item.scheduleDate);
                    emailSendOpenDialog(item);
                  "
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-email-send-outline</v-icon>
                </v-btn>
              </template>
              <span>Send Email</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </a-tab-pane>
    </a-tabs>

    <!-- DIALOG -->
    <v-dialog v-model="newScheduleDialog" width="300px" persistent>
      <v-card flat>
        <v-toolbar flat dense color="#1565c0" dark>
          <v-toolbar-title> New Schedule </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="newScheduleDialog = false"> mdi-close </v-icon>
        </v-toolbar>

        <v-layout class="pa-1">
          <v-text-field
            outlined
            dense
            class="ml-1 mr-1"
            label="Please input year"
            v-model="scheduleDate"
            v-mask="mask"
          >
          </v-text-field>
          <!-- <v-toolbar dense flat> -->
          <v-spacer></v-spacer>
          <v-btn
            class="mt-2"
            small
            dark
            style="background-color: #1565c0"
            @click="saveRec('ADD')"
          >
            SAVE
            <v-icon> mdi-update </v-icon>
          </v-btn>
          <!-- </v-toolbar> -->
        </v-layout>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editScheduleDataDialog" width="300px" persistent>
      <v-card class="pa-1" flat>
        <v-toolbar flat dense>
          <v-toolbar-title> Edit Schedule </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="editScheduleDataDialog = false"> mdi-close </v-icon>
        </v-toolbar>

        <v-layout>
          <a-date-picker
            @change="onChange"
            v-model="editScheduleData.scheduleDate"
            valueFormat="YYYY-MM-DD"
          >
          </a-date-picker>
          <v-spacer></v-spacer>
          <v-btn
            class="mr-3"
            small
            dark
            style="background-color: #1565c0"
            @click="saveRec('UPDATE')"
          >
            SAVE
            <v-icon> mdi-update </v-icon>
          </v-btn>
        </v-layout>
      </v-card>
    </v-dialog>

    <v-dialog v-model="emailSendingDialog" width="350px">
      <v-card>
        <v-toolbar dense>
          <v-toolbar-title> Email Sending </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="emailSendingDialog = false"> mdi-close </v-icon>
        </v-toolbar>

        <v-text-field
          class="pa-2"
          fixed
          label="Search"
          v-model="searchUserList"
        >
        </v-text-field>
        <v-card
          :height="$vuetify.breakpoint.height - 450"
          style="overflow-y: scroll"
        >
          <table style="width: 100%" :search="searchUserList">
            <tr v-for="(item, i) in filteredUserList" :key="i">
              <td class="pl-3">{{ item.employee_code }}</td>
              <td>{{ item.full_name }}</td>
              <td>
                <v-checkbox :disabled="item.isDisable" v-model="item.isSelect">
                </v-checkbox>
              </td>
            </tr>
          </table>
          
        </v-card>
        <v-footer>
          <v-btn
            @click="sendNotif"
            dark
            style="width: 100%; background-color: #1565c0"
            >SEND</v-btn
          >
        </v-footer>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { mask } from "vue-the-mask";

export default {
  directives: { mask },
  data() {
    return {
      api: "http://10.169.130.155:5002",
      mask: "####",
      headers: [],
      userList: [],
      searchUserList: "",
      scheduleData: [],
      scheduleSelectList: [],
      newScheduleDialog: false,
      scheduleDate: "",
      scheduleDateModel: "2020",
      editScheduleData: [],
      editScheduleDataDialog: false,
      scheduleIndex: -1,
      emailSendingDialog: false,
    };
  },

  created() {
    this.getRec();
  },
  computed: {
    filteredUserList() {
      return this.userList.filter((data) => {
        return (
          data.employee_code
            .toLowerCase()
            .includes(this.searchUserList.toLowerCase()) ||
          data.full_name
            .toLowerCase()
            .includes(this.searchUserList.toLowerCase())
        );
      });
    },
  },
  watch: {},
  methods: {
    callback() {},
    onChange(date, dateString) {
      console.log(date, dateString);
    },

    emailSendOpenDialog(index) {
      this.scheduleIndex = this.scheduleData.indexOf(index.item);
      this.emailSendingDialog = true;
    },
    saveRec(saveCondition) {
      if (saveCondition == "ADD") {
        let url = `${this.api}/add/schedule`;
        let toInsert = { scheduleDate: this.scheduleDate };

        if (!this.scheduleDate) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Please input date!",
            showConfirmButton: false,
            timer: 750,
          });
        } else {
          axios.post(url, toInsert).then((res) => {
            if (res.data == "Schedule Exist") {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Year already exist!!",
                showConfirmButton: false,
                timer: 750,
              });
            } else {
              // this.scheduleData = res.data;
              this.getRec();
              this.newScheduleDialog = false;
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Save Successfully!",
                showConfirmButton: false,
                timer: 750,
              });
            }
          });
        }
      } else {
        let url = `${this.api}/update/schedule?year=${this.scheduleDateModel}`;
        this.scheduleData[
          this.scheduleIndex
        ].scheduleDate = this.editScheduleData.scheduleDate;
        let toInsert = this.scheduleData.map((rec) => {
          return rec.scheduleDate;
        });

        let toInsert2 = { data: toInsert };
        axios.post(url, toInsert2).then(() => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Save Successfully!",
            showConfirmButton: false,
            timer: 750,
          });
          this.editScheduleDataDialog = false;
        });
      }
    },

    sendNotif() {
      let toInsert = this.userList.filter((rec) => {
        return rec.isSelect == true && rec.isDisable == false;
      });
      // console.log(this.scheduleData[this.scheduleIndex]);

      // console.log(toInsert);
      let url = `${this.api}/add/notification?scheduleDate=${
        this.scheduleData[this.scheduleIndex].scheduleDate
      }`;
      axios.post(url, toInsert).then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Send!",
          showConfirmButton: false,
          timer: 750,
        });
        this.emailSendingDialog = false;
      });
    },

    getRec() {
      let url = `${this.api}/get/schedule`;
      this.headers = [
        { text: "Quarter", value: "quarter" },
        { text: "Scheduled Date", value: "scheduleDate" },
        { text: "", value: "action" },
      ];

      axios.get(url).then((res) => {
        this.scheduleSelectList = Object.getOwnPropertyNames(
          res.data.scheduleDate
        );
        this.scheduleData = res.data.scheduleDate[this.scheduleDateModel].map(
          (rec, index) => {
            let toReturn = {};
            toReturn.scheduleDate = rec;

            if (index == 0) {
              toReturn.quarter = "First";
            } else if (index == 1) {
              toReturn.quarter = "Second";
            } else if (index == 2) {
              toReturn.quarter = "Third";
            } else {
              toReturn.quarter = "Fourth";
            }

            return toReturn;
          }
        );
        // console.log(this.scheduleData)
        // }
      });
    },

    editDate(index) {
      this.scheduleIndex = this.scheduleData.indexOf(index.item);
      this.editScheduleData = Object.assign(
        {},
        this.scheduleData[this.scheduleIndex]
      );
      this.editScheduleDataDialog = true;
    },

    getUsers(date) {
      console.log(date);
      // let url = `${this.api}/masterlist/selectUser?scheduledDate=${date}`;
      // axios.get(url).then((res) => {
      //   this.userList = res.data;
      // });
      this.userList = [
        { employee_code: "0416", full_name: "青木" },
        { employee_code: "0178", full_name: "今濱" },
        { employee_code: "0437", full_name: "大浦" },
        { employee_code: "0026", full_name: "越智" },
        { employee_code: "0159", full_name: "落合" },
        { employee_code: "0130", full_name: "柿原" },
        { employee_code: "0429", full_name: "香畠" },
      ];
    },
  },
};
</script>

<style></style>
