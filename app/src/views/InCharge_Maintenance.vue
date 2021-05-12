<template>
  <v-container fluid pl-0 pr-0 pb-0>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="Checker" v-model="tabModel">
        <v-data-table
          :headers="checkerHeaders"
          :items="listChecker"
          :search="search"
          dense
        >
          <template v-slot:top>
            <v-toolbar elevation="0">
              <v-text-field
                v-model="search"
                label="Search"
                append-icon="mdi-magnify"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    class="mx-2"
                    dark
                    color="#1565c0"
                    @click="openAssignInChargeDialog('NEW')"
                  >
                    ADD
                    <v-icon dark> mdi-plus-circle-outline </v-icon>
                  </v-btn>
                </template>
                <span>ADD </span>
              </v-tooltip>
            </v-toolbar>
          </template>

          <template v-slot:item.DeletedDate="{ item }">
            <v-icon v-if="!item.DeletedDate" color="green">mdi-check</v-icon>
            <v-icon v-else color="red">mdi-close</v-icon>
          </template>

          <template v-slot:item.action="{ item }">
            <v-btn
              @click="openAssignInChargeDialog(item, 1)"
              icon
              small
              color="blue"
            >
              <v-icon>mdi-content-save-edit</v-icon>
            </v-btn>
            <v-btn
              color="red"
              icon
              small
              dark
              @click="saveRecord('DELETE', item.CheckerCode)"
              v-if="!item.DeletedDate"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              color="green"
              icon
              small
              dark
              @click="saveRecord('RESTORE', item.CheckerCode)"
              v-else
            >
              <v-icon>mdi-recycle</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Department" v-model="tabModel">
        <v-data-table
          :headers="departmentHeaders"
          :items="listDepartment"
          :search="search"
          dense
        >
          <template v-slot:top>
            <v-toolbar elevation="0">
              <v-text-field
                v-model="search"
                label="Search"
                append-icon="mdi-magnify"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    class="mx-2"
                    dark
                    color="#1565c0"
                    @click="openAssignInChargeDialog('NEW')"
                  >
                    ADD

                    <v-icon dark> mdi-plus-circle-outline </v-icon>
                  </v-btn>
                </template>
                <span>ADD </span>
              </v-tooltip>
            </v-toolbar>
          </template>

          <template v-slot:item.DeletedDate="{ item }">
            <v-icon v-if="!item.DeletedDate" color="green">mdi-check</v-icon>
            <v-icon v-else color="red">mdi-close</v-icon>
          </template>

          <template v-slot:item.action="{ item }">
            <v-btn
              @click="openAssignInChargeDialog(item, 1)"
              icon
              small
              color="blue"
            >
              <v-icon>mdi-content-save-edit</v-icon>
            </v-btn>
            <v-btn
              color="red"
              icon
              small
              dark
              @click="saveRecord('DELETE', item.DepartmentCode)"
              v-if="!item.DeletedDate"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              color="green"
              icon
              small
              dark
              @click="saveRecord('RESTORE', item.DepartmentCode)"
              v-else
            >
              <v-icon>mdi-recycle</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </a-tab-pane>

      <!-- <a-tab-pane key="3" tab="Person in Charge" v-model="tabModel">
        <v-data-table
          :headers="personInChargeHeaders"
          :items="listPersonInCharge"
          :search="search"
          dense
        >
          <template v-slot:top>
            <v-toolbar elevation="0">
              <v-text-field
                v-model="search"
                label="Search"
                append-icon="mdi-magnify"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    class="mx-2"
                    dark
                    color="#1565c0"
                    @click="openPersonInChargeDialog('NEW')"
                  >
                    ADD

                    <v-icon dark> mdi-plus-circle-outline </v-icon>
                  </v-btn>
                </template>
                <span>ADD </span>
              </v-tooltip>
            </v-toolbar>
          </template>

          <template v-slot:item.DeletedDate="{ item }">
            <v-icon v-if="!item.DeletedDate" color="green">mdi-check</v-icon>
            <v-icon v-else color="red">mdi-close</v-icon>
          </template>

          <template v-slot:item.action="{ item }">
            <v-btn
              @click="openPersonInChargeDialog(item, 1)"
              icon
              small
              color="blue"
            >
              <v-icon>mdi-content-save-edit</v-icon>
            </v-btn>
            <v-btn
              color="red"
              icon
              small
              dark
              @click="savePersonInCharge('DELETE', item.EmployeeCode)"
              v-if="!item.DeletedDate"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              color="green"
              icon
              small
              dark
              @click="savePersonInCharge('RESTORE', item.EmployeeCode)"
              v-else
            >
              <v-icon>mdi-recycle</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </a-tab-pane> -->
    </a-tabs>
    <v-dialog v-model="editAssignInChargeDialog" max-width="600" persistent>
      <v-card>
        <v-toolbar dense flat color="#1565c0" dark>
          <v-toolbar-title>
            {{ isEditAssignInCharge == true ? "Update" : "Add" }}
            {{ tabModel == "1" ? "Checker" : "Department" }}
          </v-toolbar-title>
          <v-spacer />
          <v-icon @click="editAssignInChargeDialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-row no-gutters dense class="mt-3 pa-2">
          <v-col cols="12">
            <v-text-field
              v-if="tabModel == '1'"
              v-model="editList.CheckerName"
              label="Checker"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-if="tabModel == '2'"
              v-model="editList.DepartmentName"
              label="Department"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-layout class="ma-1 pa-1" dense>
          <v-spacer></v-spacer>
          <v-btn color="#1565c0" dark @click="saveRecord('SAVE', '')"
            ><v-icon>mdi-content-save-move</v-icon> Save</v-btn
          >
        </v-layout>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editPersonInChargeDialog" max-width="600" persistent>
      <v-card>
        <v-toolbar dense flat color="#1565c0" dark>
          <v-toolbar-title>
            {{ isEditPersonInCharge == true ? "Update" : "Add" }}
            Person in Charge
          </v-toolbar-title>
          <v-spacer />
          <v-icon @click="editPersonInChargeDialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-row no-gutters dense class="mt-3 pa-2">
          <v-col cols="12">
            <v-text-field
              :disabled="isEditPersonInCharge ? true : false"
              v-model="editList.EmployeeCode"
              label="ID"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="editList.EmployeeNameJap"
              label="Name (Japanese)"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="editList.EmployeeNameEng"
              label="Name (English)"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="editList.EmailAddress"
              label="Email Address"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-layout class="ma-1 pa-1" dense>
          <v-spacer></v-spacer>
          <v-btn color="#1565c0" dark @click="savePersonInCharge('SAVE', '')"
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

export default {
  data() {
    return {
      tabModel: 1,
      search: "",
      editIndex: -1,
      formTitle: "",
      editAssignInChargeDialog: false,
      editPersonInChargeDialog: false,
      checkerHeaders: [
        { text: "Checker Name", value: "CheckerName" },
        { text: "Status", value: "DeletedDate" },
        { text: "Action", value: "action" },
      ],
      departmentHeaders: [
        { text: "Department Name", value: "DepartmentName" },
        { text: "Status", value: "DeletedDate" },
        { text: "Action", value: "action" },
      ],
      personInChargeHeaders: [
        { text: "Employee Code", value: "EmployeeCode" },
        { text: "Name (Japanese)", value: "EmployeeNameJap" },
        { text: "Name (English)", value: "EmployeeNameEng" },
        { text: "Email Address", value: "EmailAddress" },
        { text: "Status", value: "DeletedDate" },
        { text: "Action", value: "action" },
      ],
      listChecker: [],
      listDepartment: [],
      listPersonInCharge: [],
      editList: [],
      isEditAssignInCharge: false,
      isEditPersonInCharge: false,
    };
  },

  created() {
    this.initialize();

  },

  mounted() {},

  methods: {
    initialize() {
      this.getChecker();
      this.getDepartment();
      this.getPersonInCharge();
    },
  
    callback(key) {
      this.tabModel = key;
    },

    getChecker() {
      let url = `${this.api}get/content_incharge/checker`;
      axios.get(url).then((res) => {
        if (res.data.length > 0) {
          this.listChecker = res.data;
        }
      });
    },

    getDepartment() {
      let url = `${this.api}get/content_incharge/department`;
      axios.get(url).then((res) => {
        if (res.data.length > 0) {
          this.listDepartment = res.data;
        }
      });
    },

    getPersonInCharge() {
      let url = `${this.api}get/maintenance/personincharge`;
      axios.get(url).then((res) => {
        if (res.data.length > 0) {
          this.listPersonInCharge = res.data;
        }
      });
    },

    openAssignInChargeDialog(val) {
      if (val == "NEW") {
        if (this.tabModel == "1") {
          this.editList.CheckerName = "";
        } else {
          this.editList.DepartmentName = "";
        }
        this.isEditAssignInCharge = false;
      } else {
        this.editList = Object.assign({}, val);
        this.isEditAssignInCharge = true;
      }

      this.editAssignInChargeDialog = true;
    },

    openPersonInChargeDialog(val) {
      if (val == "NEW") {
        this.editList.EmployeeNameJap = "";
        this.editList.EmployeeNameEng = "";
        this.editList.EmployeeCode = "";
        this.editList.EmailAddress = "";
        this.isEditPersonInCharge = false;
      } else {
        this.editList = Object.assign({}, val);
        this.isEditPersonInCharge = true;
      }

      this.editPersonInChargeDialog = true;
    },

    savePersonInCharge(saveCondition, value) {
      let xIsInsert = 0;
      let xEmployeeCode = "";
      let xEmployeeNameJap = "";
      let xEmployeeNameEng = "";
      let xEmailAddress = "";
      let xUpdatedBy = this.userInfo.employee_code;

      xEmployeeCode = this.editList.EmployeeCode;
      //value = restore and delete
      if (value) {
        xEmployeeCode = value;
      }

      if (this.editList.EmailAddress) {
        xEmailAddress = this.editList.EmailAddress;
      }

      if (!this.isEditPersonInCharge && saveCondition == "SAVE") {
        xIsInsert = 1;
      } else {
        xIsInsert = 0;
      }

      if (saveCondition == "SAVE") {
        xEmployeeNameJap = this.editList.EmployeeNameJap;
        xEmployeeNameEng = this.editList.EmployeeNameEng;
      }

      let xUpdateCondition = 0;
      if (saveCondition == "DELETE") {
        xUpdateCondition = 1;
      } else if (saveCondition == "RESTORE") {
        xUpdateCondition = 2;
      } else {
        xUpdateCondition = 3;
      }

      let toInsert = {};
      toInsert.IsInsert = xIsInsert;
      toInsert.UpdateCondition = xUpdateCondition;
      toInsert.EmployeeCode = xEmployeeCode;
      toInsert.EmployeeNameJap = xEmployeeNameJap;
      toInsert.EmployeeNameEng = xEmployeeNameEng;
      toInsert.EmailAddress = xEmailAddress;
      toInsert.UpdatedBy = xUpdatedBy;

      let url = `${this.api}add/maintenance/personincharge`;
      axios.post(url, toInsert).then((res) => {
        if (res.data[0][0].IsExist) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Employee code already exist",
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          this.getPersonInCharge();
        }
      });

      this.editPersonInChargeDialog = false;
    },

    saveRecord(saveCondition, value) {
      let xIsInsert = 0;
      let xCheckerCode = 0;
      let xCheckerName = "";
      let xDepartmentCode = 0;
      let xDepartmentName = "";
      if (
        !this.isEditAssignInCharge &&
        saveCondition != "DELETE" &&
        saveCondition != "RESTORE"
      ) {
        xIsInsert = 1;
      } else {
        xIsInsert = 0;
      }

      if (saveCondition == "SAVE") {
        if (this.tabModel == "1") {
          xCheckerName = this.editList.CheckerName;
          if (this.isEditAssignInCharge) {
            xCheckerCode = this.editList.CheckerCode;
          }
        } else {
          xDepartmentName = this.editList.DepartmentName;

          if (this.isEditAssignInCharge) {
            xDepartmentCode = this.editList.DepartmentCode;
          }
        }
      }

      if (saveCondition == "DELETE" || saveCondition == "RESTORE") {
        if (this.tabModel == "1") {
          xCheckerCode = value;
        } else {
          xDepartmentCode = value;
        }
      }

      let xUpdateCondition = 0;
      if (saveCondition == "DELETE") {
        xUpdateCondition = 1;
      } else if (saveCondition == "RESTORE") {
        xUpdateCondition = 2;
      } else {
        xUpdateCondition = 3;
      }

      let xUpdatedBy = this.userInfo.employee_code;
      let xCheckerOrDepartment = "";
      if (this.tabModel == "1") {
        xCheckerOrDepartment = "CHECKER";
      } else {
        xCheckerOrDepartment = "DEPARTMENT";
      }

      let toInsert = {};
      toInsert.CheckerOrDepartment = xCheckerOrDepartment;
      toInsert.IsInsert = xIsInsert;
      toInsert.UpdateCondition = xUpdateCondition;
      toInsert.CheckerCode = xCheckerCode;
      toInsert.CheckerName = xCheckerName;
      toInsert.DepartmentCode = xDepartmentCode;
      toInsert.DepartmentName = xDepartmentName;
      toInsert.UpdatedBy = xUpdatedBy;

      let url = `${this.api}update/content_incharge_setting`;
      axios.post(url, toInsert).then(() => {
        this.initialize();
        // alert("success");
      });

      this.editAssignInChargeDialog = false;
    },
  },
};
</script>
