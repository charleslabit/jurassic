<template>
  <v-container fluid pr-1 pl-1 mr-1 ml-1 mt-0 pt-0>
    <v-layout align-center justify-center v-if="loading" pt-3>
      <a-spin tip="Loading..."> </a-spin>
    </v-layout>
    <v-layout v-if="selectedItem && !loading" row wrap>
      <v-flex xs12>
        <v-card class="scroll" height="800">
          <v-toolbar>
            <v-toolbar-title>
              {{ selectedItem._id }}
            </v-toolbar-title>

            <v-alert type="error" dense class="ml-2 mt-2" v-if="hideError">
              {{ errorMessage }}
            </v-alert>

            <v-tooltip
              bottom
              v-if="
                selectedItem.updated &&
                  !selectedItem.alreadyInAfter &&
                  !selectedItem.alreadyInToUpdate &&
                  $route.query.kind != 'ToUpdate'
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  class="mx-2"
                  dark
                  color="#1565c0"
                  @click="copyDocuments(selectedItem._id)"
                >
                  Copy

                  <v-icon dark> mdi-check-circle-outline </v-icon>
                </v-btn>
              </template>
              <span v-if="$route.query.kind == 'Before'"
                >Copy to After the Meeting</span
              >
              <span v-if="$route.query.kind == 'After'"
                >Copy to Update Meeting</span
              >
            </v-tooltip>

            <v-tooltip
              bottom
              v-if="
                $route.query.kind == 'ToUpdate' &&
                  !selectedItem.alreadyInFinal &&
                  (userInfo.employee_code == '11726' ||
                    userInfo.EmployeeNumber == '0392')
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  class="mx-2"
                  dark
                  color="#1565c0"
                  @click="confirmDocument(selectedItem._id)"
                >
                  Confirmation

                  <v-icon dark> mdi-alpha-c-circle-outline </v-icon>
                </v-btn>
              </template>
              <span>Confirmation </span>
            </v-tooltip>

            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  dark
                  v-on="on"
                  @click="openFile()"
                  color="#1565c0"
                  class="ml-1 mr-1"
                >
                  Open
                  <v-icon>mdi-book-open-page-variant-outline</v-icon>
                </v-btn>
              </template>
              <span>Open PDF</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  dark
                  v-on="on"
                  @click="printFile()"
                  color="#1565c0"
                  class="ml-1 mr-1"
                >
                  Print
                  <v-icon>mdi-printer-check</v-icon>
                </v-btn>
              </template>
              <span>Print to PDF</span>
            </v-tooltip>

            <v-btn
              @click="
                selectedItem.approvalRemarks
                  ? alert(selectedItem.approvalRemarks)
                  : alert('Initial document')
              "
              dark
              style="background-color: #1565c0"
              class="ml-1"
            >
              Remarks
              <v-icon right>mdi-information-outline</v-icon>
            </v-btn>

            <v-btn
              @click="updateDocument()"
              dark
              style="background-color: #1565c0"
              class="ml-1"
            >
              Save
              <v-icon right>mdi-content-save</v-icon>
            </v-btn>

            <v-btn
              @click="backToAll()"
              dark
              style="background-color: #1565c0"
              class="ml-1"
            >
              Back
              <v-icon>mdi-keyboard-return</v-icon>
            </v-btn>
          </v-toolbar>

          <v-row
            no-gutters
            dense
            v-if="!editMode"
            class="ml-3 mt-3 mb-2 pl-3 pt-3 pb-2"
          >
            <v-col lg="1" md="2" sm="12" cols="12">
              <v-select
                style="width:95%"
                label="構法"
                :items="methodList"
                v-model="selectedItem.method"
                hide-details
                dense
                outlined
              ></v-select>
            </v-col>
            <v-col lg="2" md="2" sm="12" cols="12">
              <v-select
                style="width:95%"
                label="区分"
                :items="classificationList"
                v-model="selectedItem.criteria"
                hide-details
                dense
                outlined
              ></v-select>
            </v-col>
            <v-col lg="2" md="3" sm="12" cols="12">
              <v-combobox
                style="width:95%"
                label="製品区分"
                :items="productTypeList"
                v-model="selectedItem.productType"
                hide-details
                dense
                outlined
              ></v-combobox>
            </v-col>
            <v-col lg="1" md="2" sm="12" cols="12">
              <v-text-field
                style="width:95%; text-align:center"
                label="更新日"
                v-model="selectedItem.RulebookUpdatedDate"
                v-mask="mask"
                dense
                outlined
                hide-details
              ></v-text-field>
            </v-col>
            <v-col lg="2" md="3" sm="12" cols="12">
              <v-text-field
                style="width:95%"
                label="開始期間"
                v-model="
                  selectedItem.data[selectedItem.version - 1].BeginningPeriod
                "
                dense
                outlined
                hide-details
              >
              </v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col lg="1" md="2" sm="12" cols="12">
              <v-btn class="disabled pt-6" text>
                Total Page:
                <span style="font-weight: bold; color: red">{{
                  countContent
                }}</span>
              </v-btn>
            </v-col>
            <v-col lg="1" md="1">
              <v-checkbox
                v-model="editMode"
                label="Preview"
                dense
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>

          <v-row no-gutters dense class="ml-3 pl-3" v-if="editMode">
            <v-spacer> </v-spacer>
            <v-col lg="1" md="1"
              ><v-checkbox v-model="editMode" label="Preview"></v-checkbox
            ></v-col>
          </v-row>

          <template v-if="!editMode">
            <v-row no-gutters dense class="ml-3 pl-3">
              <v-col lg="2" md="2" sm="12" cols="12">
                <v-text-field
                  style="width:95%"
                  dense
                  outlined
                  hide-details
                  v-model="
                    selectedItem.data[this.selectedItem.version - 1]
                      .personInCharge
                  "
                  label="担当者"
                ></v-text-field>
              </v-col>

              <v-col lg="2" md="2" sm="12" cols="12">
                <v-select
                  :items="personinchargeList"
                  style="width:95%"
                  outlined
                  dense
                  hide-details
                  v-model="selectedItem.data[selectedItem.version - 1].Tantou"
                  label="担当"
                ></v-select>
              </v-col>
              <v-col lg="3" md="3" sm="12" cols="12">
                <v-select
                  :items="emailAddressList"
                  style="width:95%"
                  outlined
                  dense
                  hide-details
                  v-model="
                    selectedItem.data[selectedItem.version - 1].MailAddress
                  "
                  label="メール  アドレス"
                ></v-select>
              </v-col>
              <v-col lg="2" md="2" sm="12" cols="12">
                <v-select
                  :items="departmentinchargeList"
                  style="width:95%"
                  outlined
                  dense
                  hide-details
                  v-model="
                    selectedItem.data[selectedItem.version - 1].TantouBusho
                  "
                  label="担当部署"
                ></v-select>
              </v-col>
              <v-col lg="3" md="3" sm="12" cols="12">
                <v-text-field
                  style="width:95%"
                  outlined
                  dense
                  hide-details
                  v-model="
                    selectedItem.data[selectedItem.version - 1].TekiyouKubun
                  "
                  label="適用区分"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row v-if="!editMode" no-gutters class="ml-3 pl-3" dense>
              <v-col lg="2" md="2" sm="4" cols="6">
                <v-checkbox
                  dense
                  hide-details
                  v-model="selectedItem.data[selectedItem.version - 1].YumeNoIe"
                  label="夢の家"
                ></v-checkbox>
              </v-col>
              <v-col lg="2" md="2" sm="4" cols="6">
                <v-checkbox
                  dense
                  hide-details
                  v-model="selectedItem.data[selectedItem.version - 1].Ippan"
                  label="一般"
                ></v-checkbox>
              </v-col>

              <v-col lg="2" md="2" sm="4" cols="6">
                <v-checkbox
                  dense
                  hide-details
                  v-model="selectedItem.data[selectedItem.version - 1].G"
                  label="グランド セゾン"
                ></v-checkbox>
              </v-col>
              <v-col lg="2" md="2" sm="4" cols="6">
                <v-checkbox
                  dense
                  hide-details
                  v-model="selectedItem.data[selectedItem.version - 1].F"
                  label="セゾンF"
                ></v-checkbox>
              </v-col>
              <v-col lg="2" md="2" sm="4" cols="6">
                <v-checkbox
                  dense
                  hide-details
                  v-model="selectedItem.data[selectedItem.version - 1].A"
                  label="セゾンA"
                ></v-checkbox>
              </v-col>
              <v-col lg="2" md="2" sm="4" cols="6">
                <v-checkbox
                  dense
                  hide-details
                  v-model="selectedItem.data[selectedItem.version - 1].B"
                  label="ブリアール"
                ></v-checkbox>
              </v-col>
            </v-row>

            <v-row v-if="!editMode" class="ml-3 pl-3" no-gutters dense>
              <v-col lg="2" md="2" sm="4" cols="6">
                <v-checkbox
                  dense
                  hide-details
                  v-model="selectedItem.data[selectedItem.version - 1]['F2-TD']"
                  label="セゾンF2-TD"
                ></v-checkbox>
              </v-col>
              <v-col lg="2" md="2" sm="4" cols="6">
                <v-checkbox
                  dense
                  hide-details
                  v-model="selectedItem.data[selectedItem.version - 1].Ismile"
                  label="i-smile"
                ></v-checkbox>
              </v-col>
              <v-col lg="2" md="2" sm="4" cols="6">
                <v-checkbox
                  dense
                  hide-details
                  v-model="selectedItem.data[selectedItem.version - 1].Icube"
                  label="i-cube"
                ></v-checkbox>
              </v-col>
              <v-col lg="2" md="2" sm="4" cols="6">
                <v-checkbox
                  dense
                  hide-details
                  v-model="selectedItem.data[selectedItem.version - 1].Ismart"
                  label="i-smart"
                ></v-checkbox>
              </v-col>

              <v-col lg="2" md="2" sm="4" cols="6">
                <v-checkbox
                  dense
                  hide-details
                  v-model="selectedItem.data[selectedItem.version - 1].Taishin"
                  label="耐震"
                ></v-checkbox>
              </v-col>
              <v-col lg="2" md="2" sm="4" cols="6">
                <v-checkbox
                  dense
                  hide-details
                  v-model="selectedItem.data[selectedItem.version - 1].Menshin"
                  label="免震"
                ></v-checkbox>
              </v-col>
            </v-row>

            <v-text-field
              class="ml-3 pl-3 mt-1 pt-1"
              outlined
              style="font-size:18px; width:95%"
              v-model="selectedItem.data[selectedItem.version - 1].RuleKenmei"
              label="件名"
            ></v-text-field>
            <div v-if="!hideEditor">
              <v-flex
                v-for="(item, index) in selectedItem.data[
                  selectedItem.version - 1
                ].content"
                :key="index"
                xs12
              >
                <!-- <hr /> -->
                <br />
                <froala
                  :tag="'textarea'"
                  :config="config"
                  v-model="
                    selectedItem.data[selectedItem.version - 1].content[index]
                  "
                  :model.sync="
                    selectedItem.data[selectedItem.version - 1].content
                  "
                >
                </froala>

                <v-layout>
                  <v-btn color="success" @click="addOneAfter(index)">
                    <v-icon>mdi-plus-box</v-icon> Add Content After
                    {{ index + 1 }}
                  </v-btn>
                  <v-btn color="error" @click="deleteOneAfter(index)"
                    ><v-icon>mdi-delete</v-icon>Delete Content</v-btn
                  >
                  <v-btn color="blue" style="color:white" @click="scrollTop()"
                    ><v-icon>mdi-arrow-up-thick</v-icon>Go to top</v-btn
                  >
                  <v-spacer></v-spacer>
                  <span style="font-size: 18px" class="pr-5"
                    >Page No.{{ index + 1 }}</span
                  >
                </v-layout>
              </v-flex>
            </div>
            <v-flex v-if="countContent > 1" xs2 offset-xs10>
              <!-- @click="delOne()"  -->
              <v-btn text class="disabled">
                <v-icon color="red">mdi-counter</v-icon>

                content #{{ countContent }}
              </v-btn>
            </v-flex>
          </template>

          <!-- 
 ******
 *    * 
 *    *
 ******
 *
 *
 * -->

          <!-- PREVIEW -->
          <template v-else>
            <v-divider></v-divider>
            <br />
            <v-row no-gutters dense>
              <v-col lg="2" md="2" sm="4" cols="6">
                <span class="pa-3">
                  構法&nbsp;-&nbsp;
                  <span v-if="selectedItem.method">
                    <span v-if="selectedItem.method == 'JIKU'"> 軸組 </span>
                    <span v-if="selectedItem.method == 'WAKU'"> 枠組 </span>
                    <span v-if="selectedItem.method == 'WAKU/JIKU'">
                      軸組 枠組
                    </span>
                  </span>
                  <span v-else>N/A</span>
                </span>
              </v-col>
              <v-col lg="2" md="2" sm="4" cols="6">
                <span class="pa-3">
                  区分&nbsp;-&nbsp;
                  <span v-if="selectedItem.criteria">{{
                    selectedItem.criteria
                  }}</span>
                  <span v-else>N/A</span>
                </span>
              </v-col>
              <v-col lg="2" md="2" sm="4" cols="6">
                <span class="pa-3">
                  製品区分&nbsp;-&nbsp;
                  <span v-if="selectedItem.productType">{{
                    selectedItem.productType
                  }}</span>
                  <span v-else>N/A</span>
                </span>
              </v-col>
              <v-col lg="2" md="2" sm="4" cols="6">
                <span class="pa-3">
                  更新日&nbsp;-&nbsp;
                  <span v-if="selectedItem.RulebookUpdatedDate">{{
                    selectedItem.RulebookUpdatedDate
                  }}</span>
                  <span v-else>N/A</span>
                </span>
              </v-col>
              <v-col lg="2" md="3" sm="4" cols="6">
                <span class="pa-3">
                  開始期間&nbsp;-&nbsp;
                  <span
                    v-if="
                      selectedItem.data[selectedItem.version - 1]
                        .BeginningPeriod
                    "
                    >{{
                      selectedItem.data[selectedItem.version - 1]
                        .BeginningPeriod
                    }}</span
                  >
                  <span v-else>N/A</span>
                </span>
              </v-col>
            </v-row>

            <v-row no-gutters dense>
              <v-col lg="2" md="2" sm="4" cols="6">
                <span class="pa-3">
                  担当&nbsp;-&nbsp;
                  <span
                    v-if="selectedItem.data[selectedItem.version - 1].Tantou"
                    >{{
                      selectedItem.data[selectedItem.version - 1].Tantou
                    }}</span
                  >
                  <span v-else>N/A</span>
                </span>
              </v-col>
              <v-col lg="2" md="2" sm="4" cols="6">
                <span class="pa-3">
                  メール アドレス:&nbsp;&nbsp;
                  <span
                    v-if="
                      selectedItem.data[selectedItem.version - 1].MailAddress
                    "
                    >{{
                      selectedItem.data[selectedItem.version - 1].MailAddress
                    }}</span
                  >
                  <span v-else>N/A</span>
                </span>
              </v-col>
              <v-col lg="2" md="2" sm="4" cols="6">
                <span class="pa-3">
                  担当 部署:&nbsp;&nbsp;
                  <span
                    v-if="
                      selectedItem.data[selectedItem.version - 1].TantouBusho
                    "
                    >{{
                      selectedItem.data[selectedItem.version - 1].TantouBusho
                    }}</span
                  >
                  <span v-else>N/A</span>
                </span>
              </v-col>
              <v-col lg="2" md="2" sm="4" cols="6">
                <span class="pa-3">
                  適用区分&nbsp;-&nbsp;
                  <span
                    v-if="
                      selectedItem.data[selectedItem.version - 1].TekiyouKubun
                    "
                    >{{
                      selectedItem.data[selectedItem.version - 1].TekiyouKubun
                    }}</span
                  >
                  <span v-else>N/A</span>
                </span>
              </v-col>
            </v-row>

            <v-row no-gutters dense>
              <v-col lg="2" md="2" sm="3" cols="4">
                <span class="pa-3">
                  <v-icon
                    v-if="selectedItem.data[selectedItem.version - 1].YumeNoIe"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;夢の家
                </span>
              </v-col>
              <v-col lg="2" md="2" sm="3" cols="4">
                <span class="pa-3">
                  <v-icon
                    v-if="selectedItem.data[selectedItem.version - 1].Ippan"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;一般
                </span>
              </v-col>

              <v-col lg="2" md="2" sm="3" cols="4">
                <span class="pa-3">
                  <v-icon v-if="selectedItem.data[selectedItem.version - 1].G"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;グランド セゾン
                </span>
              </v-col>
              <v-col lg="2" md="2" sm="3" cols="4">
                <span class="pa-3">
                  <v-icon v-if="selectedItem.data[selectedItem.version - 1].F"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;セゾンF
                </span>
              </v-col>
              <v-col lg="2" md="2" sm="3" cols="4">
                <span class="pa-3">
                  <v-icon v-if="selectedItem.data[selectedItem.version - 1].A"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;セゾンA
                </span>
              </v-col>
              <v-col lg="2" md="2" sm="3" cols="4">
                <span class="pa-3">
                  <v-icon v-if="selectedItem.data[selectedItem.version - 1].B"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;ブリアール
                </span>
              </v-col>
              <v-col lg="2" md="2" sm="3" cols="4">
                <span class="pa-3">
                  <v-icon
                    v-if="selectedItem.data[selectedItem.version - 1]['F2-TD']"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;セゾンF2-TD
                </span>
              </v-col>
              <v-col lg="2" md="2" sm="3" cols="4">
                <span class="pa-3">
                  <v-icon
                    v-if="selectedItem.data[selectedItem.version - 1].Ismile"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;i-smile
                </span>
              </v-col>

              <v-col lg="2" md="2" sm="3" cols="4">
                <span class="pa-3">
                  <v-icon
                    v-if="selectedItem.data[selectedItem.version - 1].Icube"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;i-cube
                </span>
              </v-col>
              <v-col lg="2" md="2" sm="3" cols="4">
                <span class="pa-3">
                  <v-icon
                    v-if="selectedItem.data[selectedItem.version - 1].Ismart"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;i-smart
                </span>
              </v-col>

              <v-col lg="2" md="2" sm="3" cols="4">
                <span class="pa-3">
                  <v-icon
                    v-if="selectedItem.data[selectedItem.version - 1].Taishin"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;耐震
                </span>
              </v-col>
              <v-col lg="2" md="2" sm="3" cols="4">
                <span class="pa-3">
                  <v-icon
                    v-if="selectedItem.data[selectedItem.version - 1].Menshin"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;免震
                </span>
              </v-col>
            </v-row>

            <!-- row3****************************************************************** -->
            <v-row no-gutters dense class="ma-2 pa-2">
              <v-col>
                <h3>件名:</h3>
                <span
                  v-if="selectedItem.data[selectedItem.version - 1].RuleKenmei"
                >
                  <h3
                    v-html="
                      selectedItem.data[selectedItem.version - 1].RuleKenmei
                    "
                  ></h3>
                  &nbsp;
                </span>
                <span v-else>N/A</span>
                <br />

                <v-divider></v-divider>
              </v-col>
            </v-row>

            <v-layout row wrap>
              <v-flex
                xs12
                v-for="(item, index) in selectedItem.data[
                  selectedItem.version - 1
                ].content"
                :key="index"
              >
                <v-card flat class="pr-8 pl-8">
                  <div class="fr-view">
                    <span
                      v-html="
                        selectedItem.data[selectedItem.version - 1].content[
                          index
                        ]
                      "
                    >
                    </span>
                  </div>
                </v-card>
              </v-flex>
            </v-layout>
          </template>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import { mask } from "vue-the-mask";
import Swal from "sweetalert2";
import moment from "moment";
import $ from "jquery";
// import FroalaEditor from "froala-editor";

export default {
  directives: {
    mask,
  },

  data() {
    return {
      content: "test Content",

      config: {
        events: {
          "froalaEditor.image.uploaded": function(e, editor, response) {
            var linkURL = editor.opts.imageUploadParams.link1;
            var results = JSON.parse(response);
            var imageTemp = linkURL + results.link.substr(16);

            editor.image.insert(
              imageTemp,
              false,
              null,
              editor.image.get(),
              response
            );
            return false;
          },
        },
        // tableStyles: {
        //   class2: "Black Border",
        // },
        // lineBreakerHorizontalOffset: 20,
        // lineBreakerOffset: 20,
        //  lineBreakerTags: ['table', 'hr', 'form'],
        fontSize: [
          "8",
          "9",
          "10",
          "11",
          "12",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "30",
          "36",
          "48",
          "60",
          "72",
          "96",
        ],
        linkList: [
          {
            text: "PDF",
            href: "http://10.11.1.59/document/",
            target: "_blank",
          },
          {
            text: "EXCEL",
            href: "http://hrdapps48:3001/ftp/rule_book/",
            target: "_blank",
          },
        ],
        // multiLine:false,
        // lineBreakerTags:["<br>"],
        autofocus: true,
        charCounterCount: true,
        documentReady: true,
        height: "600",
        // codeMirror: true,
        codeMirror: window.CodeMirror,
        toolbarButtons: [
          "verticalLeftRight",
          // "verticalRightLeft",
          "fullscreen",
          "html",
          "undo",
          "redo",
          "|",
          "bold",
          "italic",
          "underline",
          "color",
          "|",
          "align",
          "formatOL",
          "formatUL",
          "outdent",
          "indent",
          "|",
          "orderList",
          "unorderList",
          "|",
          "paragraphFormat",
          "|",
          "fontFamily",
          "|",
          "fontSize",
          "|",
          "insertImage",
          "quote",
          "insertTable",
          "insertLink",
          "print",
        ],

        pluginsEnabled: null,
        fontFamily: {
          "Roboto,sans-serif": "Roboto",
          "Oswald,sans-serif": "Oswald",
          "Montserrat,sans-serif": "Montserrat",
          "'Open Sans Condensed',sans-serif": "Open Sans Condensed",
          "MS PGothic": "MS PGothic",
        },
        fontFamilySelection: true,
        enter: $.FroalaEditor.ENTER_BR,
        imageUploadMethod: "POST",
        videoUploadMethod: "POST",
        imageAllowedTypes: ["jpeg", "jpg", "png", "gif", "dwg", "jww", "svg"],
        imageDefaultAlign: "left",
        imageDefaultDisplay: "inline",

        imageroundPercent: true,
        imageSizeButtons: ["imageBack"],
        imageInsertButtons: ["imageBack", "|", "imageUpload"],
        // theme: 'dark',
        zIndex: 2501,

        tableStyles: {
          class1: "Alternate Row Color",
          class2: "Dashed Border",
          noborder: "No Border",
          blackborder: "Black Border",
        },

        tableCellStyles: { tableCellStyles1: "Highlight text to red" },
        // tableStyles: ["Class 1", "Class 2", "No Border"],
      },
      paramID: "test",
      model: "Edit Your Content Here!",
      editMode: false,
      selectedItem: {
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
      methodList: [
        { text: "軸組", value: "JIKU" },
        { text: "枠組", value: "WAKU" },
        { text: "軸組 枠組", value: "WAKU/JIKU" },
      ],
      // criteriaList: ["ルール", "製品仕様", "基本図面", "パターン一覧"],
      // selectedproductType: "",
      // productTypeList: [
      //   `外部付帯`,
      //   `サッシ`,
      //   `システムバス`,
      //   `その他`,
      //   `出窓`,
      //   `バルコニー`,
      //   `和室造作/建具/出窓`,
      //   `階段`,
      //   `建具`,
      //   `構造`,
      //   `収納`,
      //   `住設`,
      //   `設備`,
      //   `太陽光`,
      //   `夢の家`,
      //   `免震`,
      //   `洋室造作`,
      //   `洋室造作/和室造作`,
      //   `和室造作`,
      //   "洋室造作/和室造作/建具",
      // ],
      mask: "####-##-##",
      hideEditor: false,
      hideError: false,
      errorMessage: "Please input ",

      loading: false,

      emailAddressList: [],
      productTypeList: [],
      classificationList: [],
      personinchargeList: [],
      departmentinchargeList: [],
    };
  },
  created() {
    this.getFroalaConfig();
    this.getEmailAddress();
    this.getClassification();
    this.getDepartmentInCharge();
    this.getPersonInCharge();
    this.getProductCategory();
  },

  mounted() {
    this.selectThis();
  },

  methods: {
    getEmailAddress() {
      const url = `${this.api}get/emailaddress`;
      axios.get(url).then((res) => {
        let newData = res.data
          .filter((rec) => {
            return !rec.DeletedDate;
          })
          .map((rec) => {
            return rec.EmailAddress;
          });
        this.emailAddressList = newData;
      });
    },

    getClassification() {
      const url = `${this.api}get/classification`;
      axios.get(url).then((res) => {
        let newData = res.data
          .filter((rec) => {
            return !rec.DeletedDate;
          })
          .map((rec) => {
            return rec.Classification;
          });
        this.classificationList = newData;
      });
    },
    getDepartmentInCharge() {
      const url = `${this.api}get/departmentincharge`;
      axios.get(url).then((res) => {
        let newData = res.data
          .filter((rec) => {
            return !rec.DeletedDate;
          })
          .map((rec) => {
            return rec.DepartmentInCharge;
          });
        this.departmentinchargeList = newData;
      });
    },
    getPersonInCharge() {
      const url = `${this.api}get/personincharge`;
      axios.get(url).then((res) => {
        let newData = res.data
          .filter((rec) => {
            return !rec.DeletedDate;
          })
          .map((rec) => {
            return rec.PersonInCharge;
          });
        this.personinchargeList = newData;
      });
    },
    getProductCategory() {
      const url = `${this.api}get/productcategory`;
      axios.get(url).then((res) => {
        let newData = res.data
          .filter((rec) => {
            return !rec.DeletedDate;
          })
          .map((rec) => {
            return rec.ProductCategory;
          });
        this.productTypeList = newData;
      });
    },

    getFroalaConfig() {
      this.config.imageUploadParams = {
        link1: "http://hrdapps48:5010",
        link2: "http://hrdapps48:5011",
      };
      this.config.imageUploadURL =
        "http://10.168.64.31:5011" + "/upload_image/" + this.paramID;

      $.FroalaEditor.DefineIcon("verticalLeftRight", {
        NAME: "star",
        SVG_KEY: "star",
      });
      $.FroalaEditor.RegisterCommand("verticalLeftRight", {
        title: "Vertical L-R",
        focus: false,
        undo: true,
        refreshAfterCallback: false,
        callback: () => {
          var range = window.getSelection().getRangeAt(0),
            content = range.extractContents(),
            span = document.createElement("span");
          span.appendChild(content);
          let selectedContent = span.innerHTML;
          if (selectedContent) {
            span.className = "rotateVerticalLeftRight";
            span.appendChild(range.extractContents());

            range.insertNode(span);
          } else {
            this.hideEditor = true;
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Invalid",
              showConfirmButton: false,
              timer: 1000,
            });
          }
          setTimeout(() => {
            this.hideEditor = false;
          }, 1000);
        },
      });
    },

    printFile() {
      let rulebookCategory = "";
      if (this.$route.query.kind == "Before") {
        rulebookCategory = "BEFORE THE MEETING";
      } else if (this.$route.query.kind == "After") {
        rulebookCategory = "AFTER THE MEETING";
      } else {
        rulebookCategory = "UPDATE";
      }

      window.open(
        `initial_document/${this.selectedItem._id}?ja=${this.PersonInCharge}&category=${rulebookCategory}&koushin=${this.$route.query.koushin}`,
        `_blank`
      );
    },

    copyFileServer() {
      const koushin = this.$route.query.koushin;
      const kind = this.$route.query.kind;
      let rulebookCategory = "";
      if (kind == "Before") {
        rulebookCategory = "BEFORE THE MEETING";
      } else if (kind == "After") {
        rulebookCategory = "AFTER THE MEETING";
      } else {
        rulebookCategory = "UPDATE";
      }

      let newrulebookCategory = "";
      if (kind == "Before") {
        newrulebookCategory = "AFTER THE MEETING";
      } else {
        newrulebookCategory = "UPDATE";
      }
      axios.defaults.headers.common["x-api-key"] =
        "JUe7mHXOhR6ziaSDHXUDJ310nTfdsH8s1ph44z2q";
      let url = `https://1ze9v428i9.execute-api.us-east-2.amazonaws.com/prod/getUsers/`;
      let Japanese = {};

      axios.get(url).then((res) => {
        Japanese = res.data
          .map((rec) => {
            return {
              LastName: rec.LastName,
              workStation: rec.workStation,
              Comp_Name: rec.Comp_Name,
              LastNameEng: rec.LastNameEng,
            };
          })
          .filter((rec) => {
            return (
              rec.Comp_Name == "HRD" && rec.LastName == this.PersonInCharge
            );
          })
          .map((rec) => {
            return rec.LastNameEng;
          })
          .toString()
          .toLowerCase();

        let oldpath = `\\\\rndfsv01.hrd-s.com\\section2\\manual\\rulebook\\${koushin}\\${rulebookCategory}\\${Japanese}\\${this.selectedItem._id}.pdf`;
        let newpath = `\\\\rndfsv01.hrd-s.com\\section2\\manual\\rulebook\\${koushin}\\${newrulebookCategory}\\${Japanese}\\${this.selectedItem._id}.pdf`;
        const toInsertPath = {
          oldpath,
          newpath,
        };
        const urlFileCopy = `${this.api}api/FileCopyToServer/`;
        axios.post(urlFileCopy, toInsertPath).then(() => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Save!",
            showConfirmButton: false,
            timer: 1500,
          });
        });
      });
    },

    openFile() {
      axios.defaults.headers.common["x-api-key"] =
        "JUe7mHXOhR6ziaSDHXUDJ310nTfdsH8s1ph44z2q";
      let url = `https://1ze9v428i9.execute-api.us-east-2.amazonaws.com/prod/getUsers/`;
      let body = {};
      let rulebookCategory = "";
      if (this.$route.query.kind == "Before") {
        rulebookCategory = "BEFORE THE MEETING";
      } else if (this.$route.query.kind == "After") {
        rulebookCategory = "AFTER THE MEETING";
      } else {
        rulebookCategory = "UPDATE";
      }

      axios.get(url).then((res) => {
        body = res.data
          .map((rec) => {
            return {
              LastName: rec.LastName,
              workStation: rec.workStation,
              Comp_Name: rec.Comp_Name,
              LastNameEng: rec.LastNameEng,
            };
          })
          .filter((rec) => {
            return (
              rec.Comp_Name == "HRD" && rec.LastName == this.PersonInCharge
            );
          })
          .map((rec) => {
            return rec.LastNameEng;
          })
          .toString()
          .toLowerCase();
        let filePath = `${this.fileLister}ftp/RULEBOOK/${this.$route.query.koushin}/${rulebookCategory}/${body}/${this.selectedItem._id}.pdf`;
        window.open(filePath);
      });
    },

    scrollTop() {
      window.scrollTo(0, 0);
    },
    selectThis() {
      this.loading = true;
      let val = this.$route.query.documentno;

      let url = "";
      let kind = this.$route.query.kind;
      url = `${this.api}process/get/edit_document/${val}/${kind}`;
      axios.get(url).then((res) => {
        if (!res.data.data[res.data.version - 1].content) {
          res.data.data[res.data.version - 1].content = [""];
        }
        this.selectedItem = res.data;
        this.selectedItem.data[
          this.selectedItem.version - 1
        ].RuleKenmei = this.selectedItem.data[
          this.selectedItem.version - 1
        ].RuleKenmei.replace(/<br>/gi, "\n");

        this.selectedItem.data[
          this.selectedItem.version - 1
        ].Tantou = this.selectedItem.data[
          this.selectedItem.version - 1
        ].personInCharge;

        if (
          this.selectedItem.data[this.selectedItem.version - 1].Tantou == "大浦"
        ) {
          this.selectedItem.data[this.selectedItem.version - 1].MailAddress =
            "i-taisuigai@hrd-s.com";
          this.selectedItem.data[this.selectedItem.version - 1].TantouBusho =
            "HRD開発";
          this.selectedItem.data[this.selectedItem.version - 1].TekiyouKubun =
            "A";
        }

        if (!this.selectedItem.RulebookUpdatedDate) {
          this.selectedItem.RulebookUpdatedDate = "2021-02-06";
        }

        // if (this.selectedItem._id.substring(0, 1) == "5") {
        //   this.selectedItem.method = "WAKU";
        // } else if (this.selectedItem._id.substring(0, 1) == "2") {
        //   this.selectedItem.method = "JIKU";
        // }
        this.loading = false;
      });
    },

    updateDocument() {
      let updatedby = "";
      if (this.userInfo.full_name) {
        updatedby = this.userInfo.full_name;
      } else {
        updatedby = this.userInfo.LastName;
      }

      let url = `${this.api}process/update_document/${this.selectedItem._id}/${this.$route.query.kind}?updatedby=${updatedby}`;

      this.errorMessage = "Please Input ";
      if (
        !this.selectedItem.method ||
        !this.selectedItem.criteria ||
        !this.selectedItem.productType ||
        !this.selectedItem.RulebookUpdatedDate ||
        !this.selectedItem.data[this.selectedItem.version - 1].BeginningPeriod
      ) {
        if (!this.selectedItem.method) {
          this.hideError = true;
          this.errorMessage = this.errorMessage + "Method, ";
        }
        if (!this.selectedItem.criteria) {
          this.hideError = true;
          this.errorMessage = this.errorMessage + "Criteria, ";
        }
        if (!this.selectedItem.productType) {
          this.hideError = true;
          this.errorMessage = this.errorMessage + "Product Type, ";
        }
        if (!this.selectedItem.RulebookUpdatedDate) {
          this.hideError = true;
          this.errorMessage = this.errorMessage + "Rulebook Updated Date, ";
        }
        if (
          !this.selectedItem.data[this.selectedItem.version - 1].BeginningPeriod
        ) {
          this.hideError = true;
          this.errorMessage = this.errorMessage + "Beginning Period";
        }
      } else {
        axios.post(url, this.selectedItem).then(() => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Saved",
            showConfirmButton: false,
            timer: 1500,
          });

          this.backToAll();
        });
      }
      if (this.errorMessage.substring(this.errorMessage.length - 1) == " ") {
        this.errorMessage = this.errorMessage.substring(
          0,
          this.errorMessage.length - 2
        );
      }
    },
    copyDocuments(val) {
      this.hideEditor = true;
      Swal.fire({
        title: "Are you sure?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, Confirm ${val}!`,
      }).then((result) => {
        if (result.value) {
          let url = "";
          let transferCondition = "";
          let updatedDate = moment().format("YYYY-MM-DD hh:mm:ss");

          if (this.$route.query.kind == "Before") {
            transferCondition = "Before";
          } else if (this.$route.query.kind == "After") {
            transferCondition = "After";
          } else {
            transferCondition = "ToUpdate";
          }
          if (this.$route.query.kind == "After") {
            // let year = this.selectedItem.scheduleDate[0].substring(0, 4);
            // let dateToday = this.selectedItem.scheduleDate[0];

            let urlDate = `${this.api}process/get/final_documentno?&newDocumentNo=${this.selectedItem._id}&method=${this.selectedItem.method}`;
            console.log(urlDate)
            axios.get(urlDate).then((res) => {
              let newFinalDocumentNo = res.data;

              url = `${this.api}process/transfer_document?transferCondition=${transferCondition}&newFinalDocumentNo=${newFinalDocumentNo}`;

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
              toUpdate._id = val;
              axios.post(url, toUpdate).then(() => {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Success",
                  showConfirmButton: false,
                  timer: 2000,
                });
                this.copyFileServer();
                this.backToAll();
              });
            });
          } else {
            url = `${this.api}process/transfer_document?transferCondition=${transferCondition}`;

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
            toUpdate._id = val;
            axios.post(url, toUpdate).then(() => {
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Success",
                showConfirmButton: false,
                timer: 2000,
              });
              this.copyFileServer();
              this.backToAll();
            });
          }
        }
        this.hideEditor = false;
      });
    },

    confirmDocument(val) {
      this.hideEditor = true;

      let url = "";
      let updatedDate = moment().format("YYYY-MM-DD hh:mm:ss");

      url = `${this.api}process/confirm_document`;

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
      toUpdate._id = val;

      Swal.fire({
        title: "Are you sure?",
        text: "It will move to the Final Document!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, Confirm ${val}!`,
      }).then((result) => {
        if (result.value) {
          axios.post(url, toUpdate).then(() => {
            // this.viewedRule._rev = res.data.rev;

            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Successfully moved to the Final Document.",
              showConfirmButton: false,
              timer: 1500,
            });
          });
          this.backToAll();
        } else {
          this.hideEditor = false;
        }
      });
    },

    deleteOneAfter(i) {
      var r = confirm(`Delete content ${i + 1}?`);
      if (r == true) {
        this.selectedItem.data[this.selectedItem.version - 1].content.splice(
          i,
          1
        );
      }
    },
  },
  watch: {
    hideError() {
      setTimeout(() => {
        this.hideError = false;
      }, 2000);
    },
    editMode() {
      if (!this.editMode) {
        this.selectedItem.data[
          this.selectedItem.version - 1
        ].RuleKenmei = this.selectedItem.data[
          this.selectedItem.version - 1
        ].RuleKenmei.replace(/<br>/gi, "\n");
      } else {
        this.selectedItem.data[
          this.selectedItem.version - 1
        ].RuleKenmei = this.selectedItem.data[
          this.selectedItem.version - 1
        ].RuleKenmei.replace(/\n/gi, "<br>");
      }
    },
  },
  computed: {
    countContent() {
      if (this.selectedItem.data[this.selectedItem.version - 1].content) {
        return this.selectedItem.data[this.selectedItem.version - 1].content
          .length;
      } else return 0;
    },
  },
};
</script>

<style scoped>
.disabled {
  pointer-events: none;
}
/* .class2 table tbody tr td {
  border-color: black !important;
} */

.class1 tbody tr:nth-child(2n) {
  /* background: #f9f9f9; */
  background: #d3d6db;
}

.class2 thead tr th,
.class2 tbody tr td {
  border-style: dashed;
}
.noborder tbody td {
  border: none;
}
/* .blackborder thead tr th, */
.blackborder tbody td {
  border-color: black;
}

.disabled {
  pointer-events: none;
}

.tableCellStyles1 {
  color: red;
}

.fr-second-toolbar {
  background: transparent !important;
  color: transparent !important;
  height: 0px !important;
  width: 0 !important;
  overflow: hidden !important;
}

.highlight {
  background-color: yellow;
}

.rotateVerticalLeftRight {
  writing-mode: vertical-lr;
}

.rotateVerticalRightLeft {
  writing-mode: vertical-rl;
}

.fr-counter {
  visibility: hidden;
}

img {
  image-rendering: auto;
  image-rendering: crisp-edges;
  image-rendering: pixelated;
  -webkit-transform: scale(0.999);
  transform: scale(0.999);
  image-rendering: -webkit-optimize-contrast;
}
</style>
