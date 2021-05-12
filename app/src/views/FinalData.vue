<template>
  <v-container pa-1 ma-1 mt-2 fluid>
    <v-row no-gutters dense>
      <v-col cols="10">
        <v-text-field
          dense
          label="Search document"
          placeholder="Search Document"
          outlined
          v-model="search"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-layout align-center justify-center v-if="loadingDocs">
      <a-spin tip="Loading..."> </a-spin>
    </v-layout>
    <span v-if="!loadingDocs" style="font-weight: bold; font-size: 16px"
      >Total: {{ filterDocumentItems.length }}</span
    >
    <a-empty v-if="filterDocumentItems.length == 0 && !loadingDocs" />
    <v-card
      flat
      class="mr-3 ml-2"
      v-if="filterDocumentItems.length > 0 && !loadingDocs"
    >
      <v-list
        two-line
        :height="getscreenHeight - 210"
        style="overflow-y: scroll"
      >
        <v-list-item-group v-model="selected" active-class="blue--text">
          <template v-for="(item, index) in documentPageData">
            <v-list-item :key="item._id">
              <template>
                <v-icon color="#1565c0" class="mr-2"> mdi-file-document</v-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    <span
                      style="font-size: 18px"
                      v-html="`${item._id} - ${item.title}`"
                    ></span>
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-layout row wrap>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          v-bind="attrs"
                          v-on="on"
                          class="mx-2"
                          fab
                          dark
                          small
                          color="primary"
                          @click="viewContent(item._id)"
                        >
                          <v-icon dark>
                            mdi-eye-outline
                          </v-icon>
                        </v-btn>
                      </template>
                      <span> View Content</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                      <template
                        v-slot:activator="{ on, attrs }"
                      >
                        <v-btn
                          v-bind="attrs"
                          v-on="on"
                          class="mx-2"
                          fab
                          dark
                          small
                          color="primary"
                          @click="viewAssignIncharge(item._id)"
                        >
                          <v-icon dark>
                            mdi-clipboard-account-outline
                          </v-icon>
                        </v-btn>
                      </template>
                      <span> Assign Incharge</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          v-bind="attrs"
                          v-on="on"
                          class="mx-2"
                          fab
                          dark
                          small
                          color="primary"
                          @click="editDocument(item._id)"
                        >
                          <v-icon dark>
                            mdi-file-document-edit
                          </v-icon>
                        </v-btn>
                      </template>
                      <span> Revise document</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          v-bind="attrs"
                          v-on="on"
                          class="mx-2"
                          fab
                          dark
                          small
                          color="error"
                          @click="
                            obsoleteDialog = true;
                            CHANGE_ITEM(item._id);
                          "
                        >
                          <v-icon dark> mdi-delete-empty </v-icon>
                        </v-btn>
                      </template>
                      <span>Mark as obsolete</span>
                    </v-tooltip>
                  </v-layout>
                </v-list-item-action>
              </template>
            </v-list-item>

            <v-divider
              v-if="index < filterDocumentItems.length - 1"
              :key="index"
            ></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
    <div class="pt-0" align="center">
      <a-pagination
        :pageSize="documentRowNo"
        v-model="documentPageNo"
        :total="filterDocumentItems.length"
        show-less-items
        v-if="filterDocumentItems.length > 0 && !loadingDocs"
      ></a-pagination>
    </div>

    <!-- ============REVISE DIALOG===================== -->
    <v-dialog v-model="reviseDialog" max-width="600" persistent>
      <v-card>
        <v-toolbar dense flat color="#1565c0" dark>
          <v-toolbar-title
            >Revise Document No. {{ selectedRule }}</v-toolbar-title
          >
          <v-spacer />
          <v-icon @click="reviseDialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-row no-gutters dense class="mt-3 pa-2">
          <v-col cols="12">
            <v-textarea
              v-model="reviseReason"
              label="Reason(更新内容)"
              outlined
              dense
            ></v-textarea>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="personInCharge"
              outlined
              dense
              label="Person Incharge(担当者)"
            ></v-text-field>
          </v-col>
          <v-select
            outlined
            dense
            label="Select Schedule Date"
            :items="listofScheduleDate"
            v-model="selectedScheduleDate"
          >
          </v-select>
        </v-row>
        <v-layout class="ma-1 pa-1" dense>
          <v-spacer></v-spacer>
          <v-btn color="#1565c0" dark @click="reviseDocument(selectedRule)"
            ><v-icon>mdi-content-save-move</v-icon> Save</v-btn
          >
        </v-layout>
      </v-card>
    </v-dialog>

    <v-dialog v-model="obsoleteDialog" max-width="600" persistent>
      <v-card>
        <v-toolbar dense flat color="#1565c0" dark>
          <v-toolbar-title
            >Obsolete Document No. {{ selectedRule }}</v-toolbar-title
          >
          <v-spacer />
          <v-icon @click="obsoleteDialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-textarea
          class="ma-2"
          v-model="obsoleteReason"
          label="Reason"
          outlined
          dense
        ></v-textarea>

        <v-layout class="ma-1 pa-1" dense>
          <v-spacer></v-spacer>
          <v-btn color="#1565c0" dark @click="obsoleteDocument(selectedRule)"
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
      documentPageNo: 1,
      documentRowNo: 30,
      loadingDocs: true,
      registerDialog: false,
      reviseDialog: false,
      reviseReason: "",
      personInCharge: "",
      search: "",
      selected: [2],
      documentItems: [],
      obsoleteDialog: false,
      obsoleteReason: "",

      listofScheduleDate: [],
      selectedScheduleDate: "",
    };
  },
  created() {
    this.loadAllDocsFinal();
    this.loadListOfScheduleDate();
  },
  methods: {
    viewContent(val) {
      window.open(`document/${val}`, `_blank`);
    },
    viewAssignIncharge(val) {
      window.open(`incharge_assign/${val}`, `_blank`);
    },

    loadListOfScheduleDate() {
      const d = new Date();
      const year = d.getFullYear();

      let url = `${this.api}schedule/get/date/${year}`;
      axios.get(url).then((res) => {
        this.listofScheduleDate = res.data;
      });
    },

    reviseDocument(id) {
      if (!this.reviseReason) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please Add a reason !!",
        });
      } else if (!this.personInCharge) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please Add Person In Charge !!",
        });
      } else if (!this.selectedScheduleDate) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please Select Date !!",
        });
      } else {
        let updatedby = "";
        if (this.userInfo.full_name) {
          updatedby = this.userInfo.full_name;
        } else {
          updatedby = this.userInfo.LastName;
        }
        let reviseURL = `${this.api}process/add/revision_reason/${this.reviseReason}/${id}/${this.personInCharge}?date=${this.selectedScheduleDate}&updatedby=${updatedby}`;
        axios.post(reviseURL).then(() => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Moved to Before the Meeting",
            showConfirmButton: false,
            timer: 1500,
          });
          this.$router.push("/documents");
        });

        this.reviseDialog = false;
      }
    },

    loadAllDocsFinal() {
      this.loadingDocs = true;
      let url = `${this.api}process/get/final_documents?status=approved`;
      axios.get(url).then((res) => {
        this.documentItems = res.data;
        this.loadingDocs = false;
      });
    },
    editDocument(val) {
      this.CHANGE_ITEM(val);
      this.reviseDialog = true;
    },
    obsoleteDocument(val) {
      if (this.obsoleteReason) {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: `Yes, Obsolete ${val}!`,
        }).then((result) => {
          if (result.value) {
            let url = "";
            url = `${this.api}process/update/obsolete?ID=${val}&reason=${this.obsoleteReason}`;
            axios.post(url).then(() => {});

            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            this.loadAllDocsFinal();
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid!",
        });
      }
    },
  },

  computed: {
    documentPageCount() {
      let l = this.filterDocumentItems.length,
        s = this.documentRowNo;
      return Math.ceil(l / s);
    },
    documentPageData() {
      const start = (this.documentPageNo - 1) * this.documentRowNo,
        end = start + this.documentRowNo;
      return this.filterDocumentItems.slice(start, end);
    },
    getscreenHeight() {
      return this.$vuetify.breakpoint.height;
    },
    filterDocumentItems() {
      return this.documentItems.filter((data) => {
        let search = new RegExp(this.search.toUpperCase(), "g");
        return JSON.stringify(Object.values(data))
          .toUpperCase()
          .match(search);
      });
    },
  },
};
</script>
