<template>
  <v-container fluid pr-1 pl-1 mr-1 ml-1 mt-0 pt-0>
    <v-layout v-if="selectedItem" row wrap>
      <v-flex xs12>
        <v-card class="scroll" height="800">
          <v-toolbar>
            <v-toolbar-title>
              {{ selectedItem._id }}
              <!-- <v-btn
                @click="newWindow(selectedItem._id)"
                dark
                style="background-color: #1565c0"
              >
                open
                <v-icon right>mdi-pdf-box</v-icon>
              </v-btn> -->
            </v-toolbar-title>
            <v-spacer></v-spacer>
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
              @click="updateDoc('notTemporary')"
              dark
              style="background-color: #1565c0"
              class="ml-1"
            >
              Save
              <v-icon right>mdi-content-save</v-icon>
            </v-btn>
            <v-btn
              @click="updateDoc('temporary')"
              dark
              style="background-color: #1565c0"
              class="ml-1"
            >
              Temporary Save
              <v-icon right>mdi-content-save</v-icon>
            </v-btn>
            <v-btn
              @click="backToAll()"
              dark
              style="background-color: #1565c0"
              class="ml-1"
            >
              Cancel
              <v-icon>mdi-keyboard-return</v-icon>
            </v-btn>
          </v-toolbar>
          <!-- <v-layout v-if="selectedItem.data" pa-2 row wrap> -->
          <a-row type="flex" justify="start" v-if="!editMode" class="2 pa-2">
            <!-- <a-col :span="1"></a-col> -->
            &emsp;
            <a-col :span="3">
              <div style="width: 140px">
                <v-select
                  label="構法"
                  :items="methodList"
                  v-model="selectedItem.method"
                ></v-select>
              </div>
            </a-col>
            <a-col :span="3">
              <div style="width: 140px">
                <v-select
                  label="区分"
                  :items="criteriaList"
                  v-model="selectedItem.criteria"
                ></v-select>
              </div>
            </a-col>
            <a-col :span="4">
              <div style="width: 185px">
                <v-select
                  label="製品区分"
                  :items="productTypeList"
                  v-model="selectedItem.productType"
                ></v-select>
              </div>
            </a-col>
            <a-col :span="3">
              <div style="width: 140px">
                <v-text-field
                  label="更新日"
                  v-model="selectedItem.RulebookUpdatedDate"
                  v-mask="mask"
                ></v-text-field>
              </div>
            </a-col>
            <a-col :span="4">
              <v-text-field
                label="開始期間"
                v-model="
                  selectedItem.data[selectedItem.version - 1].BeginningPeriod
                "
              >
              </v-text-field>
            </a-col>
            <!-- @click="addOne()" -->
            <a-col :span="3" class="pt-2">
              <v-btn class="disabled" text>
                Total Page:
                <!-- <v-icon left>queue</v-icon> -->
                <span style="font-weight: bold; color: red">{{
                  countContent
                }}</span>
              </v-btn> </a-col
            >&emsp;
            <a-col :span="3">
              <v-checkbox v-model="editMode" label="Preview"></v-checkbox>
            </a-col>
          </a-row>
          <v-divider></v-divider>
          <a-row type="flex" justify="end" v-if="editMode" class="2 pa-2">
            <a-col :span="4">
              <v-checkbox v-model="editMode" label="Preview"></v-checkbox>
            </a-col>
          </a-row>
          <!-- <v-flex offset-xs8 v-if="!editMode" xs2>
            <v-btn @click="addOne()" >
              #content
              <v-icon left>queue</v-icon>
              <span style="font-weight: bold; color: red;">{{countContent}}</span>
            </v-btn>
          </v-flex>

          <v-flex offset-xs8 xs2 v-else></v-flex>-->

          <!-- <v-flex offset-xs8 v-if="!editMode" xs2>
              
            
          </v-flex>-->

          <!-- <v-flex xs2>
            <v-checkbox v-model="editMode" label="Preview"></v-checkbox>
          </v-flex>-->
          <!-- EditMode -->
          <template v-if="!editMode">
            <!-- row1****************************************************************** -->
            <v-row no-gutters dense v-if="!editMode">
              <!-- <a-col :span="6">
                <v-text-field
                  outlined
                  v-model="selectedItem.data[selectedItem.version -1].SeihinKubun"
                  label="製品区分"
                ></v-text-field>
              </a-col> -->
              <v-col cols="2">
                <v-text-field
                  dense
                  outlined
                  v-model="PersonInCharge"
                  label="担当者"
                ></v-text-field>
              </v-col>

              <v-col cols="3">
                <v-text-field
                  outlined
                  dense
                  v-model="selectedItem.data[selectedItem.version - 1].Tantou"
                  label="担当"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  outlined
                  dense
                  v-model="
                    selectedItem.data[selectedItem.version - 1].MailAddress
                  "
                  label="メール  アドレス"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  outlined
                  dense
                  v-model="
                    selectedItem.data[selectedItem.version - 1].TantouBusho
                  "
                  label="担当  部署"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  outlined
                  dense
                  v-model="
                    selectedItem.data[selectedItem.version - 1].TekiyouKubun
                  "
                  label="適用区分"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row
              type="flex"
              justify="start"
              v-if="!editMode"
              no-gutters
              class="ml-3"
              dense
            >
              &emsp;
              <v-col cols="2">
                <v-checkbox
                  v-model="selectedItem.data[selectedItem.version - 1].YumeNoIe"
                  label="夢の家"
                ></v-checkbox>
              </v-col>
              <v-col cols="2">
                <v-checkbox
                  v-model="selectedItem.data[selectedItem.version - 1].Ippan"
                  label="一般"
                ></v-checkbox>
              </v-col>

              <v-col cols="2">
                <v-checkbox
                  v-model="selectedItem.data[selectedItem.version - 1].G"
                  label="グランド セゾン"
                ></v-checkbox>
              </v-col>
              <v-col cols="2">
                <v-checkbox
                  v-model="selectedItem.data[selectedItem.version - 1].F"
                  label="セゾンF"
                ></v-checkbox>
              </v-col>
              <v-col cols="2">
                <v-checkbox
                  v-model="selectedItem.data[selectedItem.version - 1].A"
                  label="セゾンA"
                ></v-checkbox>
              </v-col>
              <v-col cols="2">
                <v-checkbox
                  v-model="selectedItem.data[selectedItem.version - 1].B"
                  label="ブリアール"
                ></v-checkbox>
              </v-col>
            </v-row>

            <v-row
              type="flex"
              justify="start"
              v-if="!editMode"
              class="ml-3"
              no-gutters
              dense
            >
              &emsp;
              <v-col cols="2">
                <v-checkbox
                  v-model="selectedItem.data[selectedItem.version - 1]['F2-TD']"
                  label="セゾンF2-TD"
                ></v-checkbox>
              </v-col>
              <v-col cols="2">
                <v-checkbox
                  v-model="selectedItem.data[selectedItem.version - 1].Ismile"
                  label="i-smile"
                ></v-checkbox>
              </v-col>
              <v-col cols="2">
                <v-checkbox
                  v-model="selectedItem.data[selectedItem.version - 1].Icube"
                  label="Icube"
                ></v-checkbox>
              </v-col>
              <v-col cols="2">
                <v-checkbox
                  v-model="selectedItem.data[selectedItem.version - 1].Ismart"
                  label="Ismart"
                ></v-checkbox>
              </v-col>

              <v-col cols="2">
                <v-checkbox
                  v-model="selectedItem.data[selectedItem.version - 1].Taishin"
                  label="耐震"
                ></v-checkbox>
              </v-col>
              <v-col cols="2">
                <v-checkbox
                  v-model="selectedItem.data[selectedItem.version - 1].Menshin"
                  label="免震"
                ></v-checkbox>
              </v-col>
            </v-row>

            <v-textarea
              auto-grow
              row-height="15"
              outlined
              v-model="selectedItem.data[selectedItem.version - 1].RuleKenmei"
              label="件名"
            ></v-textarea>
            <v-flex
              v-for="(item, index) in selectedItem.data[
                selectedItem.version - 1
              ].content"
              :key="index"
              xs12
            >
              <hr />
              <br />
              <!-- data: {{selectedItem.data[selectedItem.version - 1].content[index]}} -->
              <froala
                style="font-size: 30px; color: 'red'"
                :tag="'textarea'"
                :config="config"
                v-model="
                  selectedItem.data[selectedItem.version - 1].content[index]
                "
                :model.sync="
                  selectedItem.data[selectedItem.version - 1].content
                "
              ></froala>

              <!-- <froala :tag="'textarea'" :config="config" v-model="content"></froala> -->
              <v-layout>
                <v-btn color="success" @click="addOneAfter(index)">
                  <v-icon>mdi-plus-box</v-icon> Add Content After
                  {{ index + 1 }}
                </v-btn>
                <v-btn color="error" @click="deleteOneAfter(index)"
                  ><v-icon>mdi-delete</v-icon>Delete Content</v-btn
                >
                <v-spacer></v-spacer>
                <span style="font-size: 18px">Page No.{{ index + 1 }}</span>
              </v-layout>
            </v-flex>

            <v-flex v-if="countContent > 1" xs2 offset-xs10>
              <!-- @click="delOne()"  -->
              <v-btn text class="disabled">
                <v-icon color="red">mdi-counter</v-icon>

                content #{{ countContent }}
              </v-btn>
            </v-flex>
          </template>

          <template v-else>
            <a-row type="flex" justify="start">
              <a-col :span="4">
                <v-btn rounded text class="disabled">
                  構法&nbsp;-&nbsp;
                  <span v-if="selectedItem.method">
                    <span v-if="selectedItem.method == 'JIKU'"> 軸組 </span>
                    <span v-if="selectedItem.method == 'WAKU'"> 枠組 </span>
                    <span v-if="selectedItem.method == 'WAKU/JIKU'">
                      軸組 枠組
                    </span>
                  </span>
                  <span v-else>N/A</span>
                </v-btn>
              </a-col>
              <a-col :span="4">
                <v-btn rounded text class="disabled">
                  区分&nbsp;-&nbsp;
                  <span v-if="selectedItem.criteria">{{
                    selectedItem.criteria
                  }}</span>
                  <span v-else>N/A</span>
                </v-btn>
              </a-col>
              <a-col :span="4">
                <v-btn rounded text class="disabled">
                  製品区分&nbsp;-&nbsp;
                  <span v-if="selectedItem.productType">{{
                    selectedItem.productType
                  }}</span>
                  <span v-else>N/A</span>
                </v-btn>
              </a-col>
              <a-col :span="4">
                <v-btn rounded text class="disabled">
                  更新日&nbsp;-&nbsp;
                  <span v-if="selectedItem.RulebookUpdatedDate">{{
                    selectedItem.RulebookUpdatedDate
                  }}</span>
                  <span v-else>N/A</span>
                </v-btn>
              </a-col>
              <a-col :span="4">
                <v-btn rounded text class="disabled">
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
                </v-btn>
              </a-col>
            </a-row>
            <a-row type="flex" justify="start">
              <!-- <a-col :span="4">
                <v-btn rounded flat class="disabled">
                  製品区分&nbsp;-&nbsp;
                  <span
                    v-if="selectedItem.data[selectedItem.version -1].SeihinKubun"
                  >{{selectedItem.data[selectedItem.version -1].SeihinKubun}}</span>
                  <span v-else>N/A</span>
                </v-btn>
              </a-col> -->
              <a-col :span="4">
                <v-btn rounded text class="disabled">
                  担当&nbsp;-&nbsp;
                  <span
                    v-if="selectedItem.data[selectedItem.version - 1].Tantou"
                    >{{
                      selectedItem.data[selectedItem.version - 1].Tantou
                    }}</span
                  >
                  <span v-else>N/A</span>
                </v-btn>
              </a-col>
              <a-col :span="4">
                <v-btn rounded text class="disabled">
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
                </v-btn>
              </a-col>
              <a-col :span="4">
                <v-btn rounded text class="disabled">
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
                </v-btn>
              </a-col>
              <a-col :span="4">
                <v-btn rounded text class="disabled">
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
                </v-btn>
              </a-col>
            </a-row>

            <a-row type="flex" justify="start">
              <a-col :span="4">
                <v-btn rounded text class="disabled">
                  <v-icon
                    v-if="selectedItem.data[selectedItem.version - 1].YumeNoIe"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;夢の家
                </v-btn>
              </a-col>
              <a-col :span="4">
                <v-btn rounded text class="disabled">
                  <v-icon
                    v-if="selectedItem.data[selectedItem.version - 1].Ippan"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;一般
                </v-btn>
              </a-col>

              <a-col :span="4">
                <v-btn rounded text class="disabled">
                  <v-icon v-if="selectedItem.data[selectedItem.version - 1].G"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;グランド セゾン
                </v-btn>
              </a-col>
              <a-col :span="4">
                <v-btn rounded text class="disabled">
                  <v-icon v-if="selectedItem.data[selectedItem.version - 1].F"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;セゾンF
                </v-btn>
              </a-col>
              <a-col :span="4">
                <v-btn rounded text class="disabled">
                  <v-icon v-if="selectedItem.data[selectedItem.version - 1].A"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;セゾンA
                </v-btn>
              </a-col>
              <a-col :span="4">
                <v-btn rounded text class="disabled">
                  <v-icon v-if="selectedItem.data[selectedItem.version - 1].B"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;ブリアール
                </v-btn>
              </a-col>
              <a-col :span="4">
                <v-btn rounded text class="disabled">
                  <v-icon
                    v-if="selectedItem.data[selectedItem.version - 1]['F2-TD']"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;セゾンF2-TD
                </v-btn>
              </a-col>
              <a-col :span="4">
                <v-btn rounded text class="disabled">
                  <v-icon
                    v-if="selectedItem.data[selectedItem.version - 1].Ismile"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;i-smile
                </v-btn>
              </a-col>

              <a-col :span="4">
                <v-btn rounded text class="disabled">
                  <v-icon
                    v-if="selectedItem.data[selectedItem.version - 1].Icube"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;Icube
                </v-btn>
              </a-col>
              <a-col :span="4" class="disabled">
                <v-btn rounded text>
                  <v-icon
                    v-if="selectedItem.data[selectedItem.version - 1].Ismart"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;Ismart
                </v-btn>
              </a-col>

              <a-col :span="4">
                <v-btn rounded text class="disabled">
                  <v-icon
                    v-if="selectedItem.data[selectedItem.version - 1].Taishin"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;耐震
                </v-btn>
              </a-col>
              <a-col :span="4">
                <v-btn rounded text class="disabled">
                  <v-icon
                    v-if="selectedItem.data[selectedItem.version - 1].Menshin"
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon v-else>mdi-close</v-icon>&nbsp;免震
                </v-btn>
              </a-col>
            </a-row>

            <!-- row3****************************************************************** -->
            <a-row type="flex" justify="start">
              <a-col :span="1"></a-col>
              <a-col :span="23">
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
                <!-- <hr /> -->
              </a-col>
            </a-row>
            <v-layout row wrap>
              <v-flex
                xs12
                v-for="(item, index) in selectedItem.data[
                  selectedItem.version - 1
                ].content"
                :key="index"
              >
                <v-card flat>
                  <v-card-text
                    class="fr-view"
                    v-html="
                      selectedItem.data[selectedItem.version - 1].content[index]
                    "
                  ></v-card-text>
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
// import MSGothic from "https://fonts.googleapis.com/css?family=MS%20Gothic"

// import "froala-editor/js/plugins/code_view.min.js"
// import "froala-editor/css/plugins/code_view.min.css"
// import "froala-editor/css/froala_editor.pkgd.min.css";
// import "froala-editor/css/froala_style.min.css";
// import "froala-editor/js/plugins.pkgd.min.js";
// import "froala-editor/js/third_party/image_tui.min.js";
// import "froala-editor/css/third_party/image_tui.min.css";

// import "froala-editor/js/plugins/table.min.js";
// import "froala-editor/js/plugins/font_family.min.js";
// import VueFroala from 'vue-froala-wysiwyg';
// import $ from "jquery";

export default {
  directives: {
    mask,
  },

  data() {
    return {
      content: "test Content",
      config: {
        events: {
          "image.uploaded": function(e) {
            console.log("hereeeeeee");
            console.log(this);
            console.log(e);
            console.log(this.opts.imageUploadParams.link1);
            var linkURL = this.opts.imageUploadParams.link1;
            // console.log('linkURL', JSON.parse(e))
            var results = JSON.parse(e);
            var imageTemp = linkURL + results.link.substr(2);
            // console.log('imageTemp', imageTemp)
            console.log(imageTemp);
            // console.log('aaaaaaaaaaa')
            // this.image.insert(
            //   imageTemp,
            //   false,
            //   null,
            //   this.image.get(),
            //   e
            // );
          },
          "image.beforeUpload": function(err, editor) {
            console.log("beforeeeeeeee");
            console.log(editor);
          },
          initialized: function() {
            console.log("initialized");
          },
        },
        // autofocus: true,
        language: "ja",
        attribution: false,
        // imageUploadMethod: "POST",

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
            href: "http://10.168.64.159:6660/newPage/",
            target: "_blank",
          },
          {
            text: "EXCEL",
            href: "http://hrdapps48:3001/ftp/rule_book/",
            target: "_blank",
          },
        ],

        // autofocus: true,
        charCounterCount: true,
        // documentReady: true,
        height: "600",

        toolbarButtons: [
          "fullscreen",
          "html",
          "undo",
          "redo",
          "|",
          "bold",
          "italic",
          "underline",
          "textColor",
          "backgroundColor",
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
        ],
        pluginsEnabled: [
          "link",
          "align",
          "codeBeautifier",
          "codeView",
          "colors",
          "draggable",
          "embedly",
          "emoticons",
          "entities",
          "fontAwesome",
          "fontFamily",
          "fontSize",
          "fullscreen",
          "help",
          "image",
          "imageTUI",
          "inlineStyle",
          "inlineClass",
          "lineBreaker",
          "lineHeight",
          "lists",
          "paragraphFormat",
          "paragraphStyle",
          "print",
          "quickInsert",
          "quote",
          "save",
          "specialCharacters",
          "spellChecker",
          "table",
          "url",
          "video",
          "wordPaste",
        ],

        // imageUploadParams: {
        //   link1: "http://10.168.64.31:5010",
        //   link2: "http://10.168.64.31:5011",
        // },

        imageUploadMethod: "POST",
        videoUploadMethod: "POST",
        imageDefaultAlign: "left",
        imageDefaultDisplay: "inline",

        imageEditButtons: [
          "imageRemove",
          "imageAlign",
          "imageCaption",
          "-",
          "imageDisplay",
          "imageStyle",
          "imageSize",
        ],

        imageRoundPercent: true,
        imageSizeButtons: ["imageBack"],
        imageInsertButtons: ["imageBack", "|", "imageUpload"],
        zIndex: 2501,
        tableEditButtons: [
          "tableHeader",
          "tableRemove",
          "|",
          "tableRows",
          "tableColumns",
          "tableStyle",
          "-",
          "tableCells",
          "tableCellBackground",
          "tableCellVerticalAlign",
          "tableCellHorizontalAlign",
          "tableCellStyle",
        ],
        tableStyles: {
          class1: "Alternate Row Color",
          class2: "Dashed Border",
          noborder: "No Border",
          blackborder: "Black Border",
        },

        tableCellStyles: {
          tableCellStyles1: "Highlight text to red",
        },
        fontFamily: {
          "Roboto,sans-serif": "Roboto",
          "Oswald,sans-serif": "Oswald",
          "Montserrat,sans-serif": "Montserrat",
          "'Open Sans Condensed',sans-serif": "Open Sans Condensed",
          "MS Gothic": "ＭＳ ゴシック",
        },
        fontFamilySelection: true,
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
      criteriaList: ["ルール", "製品仕様", "基本図面", "パターン一覧"],
      selectedproductType: "",
      productTypeList: [
        `外部付帯`,
        `サッシ`,
        `システムバス`,
        `その他`,
        `出窓`,
        `バルコニー`,
        `和室造作/建具/出窓`,
        `階段`,
        `建具`,
        `構造`,
        `収納`,
        `住設`,
        `設備`,
        `太陽光`,
        `夢の家`,
        `免震`,
        `洋室造作`,
        `洋室造作/和室造作`,
        `和室造作`,
      ],
      mask: "####-##-##",
    };
  },
  created() {
    this.selectThis(this.selectedRule);
    // console.log(this.linkURL);
    // console.log(this.api);
    this.config.imageUploadParams = { link1: this.linkURL, link2: this.api };
    this.config.imageUploadURL = this.api + "upload_images";
  },
  methods: {
    selectThis(val) {
      let url = "";
      if (val.length > 9) {
        url = `${this.api}getInitial/${val}`;
      } else {
        url = `${this.api}get/${val}`;
      }

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

        // console.log(this.selectedItem)
      });
    },

    // updateDocTemporary() {
    //   let url = "";
    //   if (this.$route.query.kind == "Initial") {
    //     url = `${this.api}post/update_doc_temporary/initial/${this.selectedItem._id}`;
    //   } else
    //     url = `${this.api}post/update_doc_temporary/final/${this.selectedItem._id}`;
    //   axios.post(url, this.selectedItem).then(() => {
    //     this.backToAll();
    //   });
    // },
    updateDoc(isApproved) {
      let isApprovedValue = "";
      let title = "";
      if (isApproved == "temporary") {
        isApprovedValue = "temporary";
        title = "Temporarily Saved";
      } else {
        isApprovedValue = "false";
        title = "Successfully Saved";
      }
      let url = `${this.api}post/update_documents/${this.selectedItem._id}/${isApprovedValue}/${this.$route.query.kind}`;

      if (isApproved == "temporary") {
        axios.post(url, this.selectedItem).then(() => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: title,
            showConfirmButton: false,
            timer: 1500,
          });

          this.backToAll();
        });
      } else {
        if (!this.selectedItem.method) {
          Swal.fire({
            icon: "error",
            title: "Please select Method",
            showConfirmButton: false,
            timer: 750,
          });
        } else if (!this.selectedItem.criteria) {
          Swal.fire({
            icon: "error",
            title: "Please select Criteria",
            showConfirmButton: false,
            timer: 750,
          });
        } else if (!this.selectedItem.productType) {
          Swal.fire({
            icon: "error",
            title: "Please select Product Type",
            showConfirmButton: false,
            timer: 750,
          });
        } else if (!this.selectedItem.RulebookUpdatedDate) {
          Swal.fire({
            icon: "error",
            title: "Please select Rulebook Updated Date",
            showConfirmButton: false,
            timer: 750,
          });
        } else if (
          !this.selectedItem.data[this.selectedItem.version - 1].BeginningPeriod
        ) {
          Swal.fire({
            icon: "error",
            title: "Please select Beginning Period",
            showConfirmButton: false,
            timer: 750,
          });
        } else {
          axios.post(url, this.selectedItem).then(() => {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: title,
              showConfirmButton: false,
              timer: 1500,
            });

            this.backToAll();
          });
        }

        // console.log(url);
      }
    },
    addOneAfter(i) {
      // console.log(i)
      this.selectedItem.data[this.selectedItem.version - 1].content.splice(
        i + 1,
        0,
        ""
      );
      // this.selectedItem.data[this.selectedItem.version - 1].content.push("");
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
    PersonInCharge() {
      if (this.$route.query.kind == "Initial") {
        return this.selectedItem.personInCharge;
      } else {
        return this.selectedItem.data[this.selectedItem.version - 1]
          .personInCharge;
      }
    },
    countContent() {
      if (this.selectedItem.data[this.selectedItem.version - 1].content) {
        return this.selectedItem.data[this.selectedItem.version - 1].content
          .length;
      } else return 0;
    },
  },
};
</script>

<style>
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

div.fr-wrapper > div > a {
  /* display: none !important; */
  /* position: fixed; */
  /* z-index: -99999 !important; */
  background: transparent !important;
  color: transparent !important;
  height: 0px !important;
  width: 0 !important;
  overflow: hidden !important;
}

.fr-second-toolbar {
  background: transparent !important;
  color: transparent !important;
  height: 0px !important;
  width: 0 !important;
  overflow: hidden !important;
}

/* div.dark-theme .fr-view table td,
.dark-theme .fr-view table th {
  border: none;
} */

a[href="https://www.froala.com/wysiwyg-editor?k=u"] {
  display: none !important;
  position: absolute;
  top: -99999999px;
  font-size: 0px !important;
  padding: 0px !important;
  height: 0px !important;
  background: transparent !important;
  font-size: 0px !important;
  padding: 0px !important;
  height: 0px !important;
}
</style>
