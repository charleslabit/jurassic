<template>
  <v-container pa-0 ma-0 fluid>
    <v-layout align-center justify-center v-if="loadingJapanMemo">
      <a-spin class="mt-2" tip="Loading..." />
    </v-layout>
    <v-card class="ma-2 pa-2" flat style="background-color: #f6f5f5" v-else>
      <v-row dense>
        <v-col cols="12" sm="8" md="4">
          <a-input
            addon-before="Search"
            v-model="searchText"
            placeholder="Search memo"
            append-icon="search"
            outlined
            @compositionstart="StartCompose()"
            @compositionend="EndCompose()"
            @keyup.enter="
              selectedCondition != 'MULTI' ? onSearch() : onMultipleSearch()
            "
          >
            <a-icon
              slot="suffix"
              type="close-circle"
              style="color: rgba(0, 0, 0, 0.45)"
              @click="searchText ? clearSearch() : ''"
            />
          </a-input>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <a-input
            addon-before="Except"
            v-model="exceptText"
            placeholder="Except Word"
          >
            <a-icon
              slot="suffix"
              @click="clearSearch()"
              type="close-circle"
              style="color: rgba(0, 0, 0, 0.45)"
            />
          </a-input>
        </v-col>
        <v-col cols="4" :sm="2" :md="1">
          <a-select v-model="selectedCondition" style="width: 100%">
            <a-select-option
              v-for="item in condition"
              :key="item"
              v-value="item"
              >{{ item }}</a-select-option
            >
          </a-select>
        </v-col>

        <v-col cols="4" :sm="2" :md="2">
          <a-button
            :style="Width"
            class="mx-1"
            dark
            type="primary"
            icon="search"
            @click="
              selectedCondition != 'MULTI' ? onSearch() : onMultipleSearch()
            "
            :disabled="!searchText"
          >
            Search
          </a-button>
          <a-button @click="japanmemoDialog = true" v-if="isRND()">
            ADD
          </a-button>
        </v-col>
        <!-- <a-checkbox :checked="isSearchAll" @change="onChangeCheck">
              Search All
            </a-checkbox> -->
        <v-spacer v-if="!isFilterOn" />
        <a-button
          v-if="!isFilterOn"
          icon="filter"
          @click="hideFilter = !hideFilter"
        >
          {{ hideFilter ? "View Filter" : "Hide Filter" }}
        </a-button>
      </v-row>
      <!-- //FILTER -->
      <a-row
        class="ml-4"
        :xs="24"
        :sm="12"
        :md="10"
        :gutter="[0, 3]"
        v-if="!isFilterOn && !hideFilter"
      >
        <a-col :xs="24" :sm="14" :md="5">
          <v-layout row wrap>
            &emsp;
            <span
              class="mt-2 button"
              style="font-weight: bold; font-size: 14px"
              v-if="!sortByCategoryASC"
              @click="
                sortByCategoryASC = true;
                sortByCategoryDES = false;
              "
            >
              🔽 種類:
            </span>
            <span
              class="mt-2 button"
              style="font-weight: bold; font-size: 14px"
              v-else
              @click="
                sortByCategoryDES = true;
                sortByCategoryASC = false;
              "
              >🔼 種類:</span
            >
            <a-select class="mt-2" v-model="selectedCategory" :style="Width">
              <a-select-option
                v-for="item in categoryList"
                :key="item"
                v-value="item"
                >{{ item }}</a-select-option
              >
            </a-select>
          </v-layout>
        </a-col>
        <a-col :xs="24" :sm="7" :md="5">
          <v-layout row wrap>
            <span
              class="button mt-1"
              v-if="sortByFavoriteASC == false"
              @click="
                sortByFavoriteASC = true;
                sortByFavoriteDES = false;
              "
            >
              <!-- <v-icon color="white"> mdi-calendar-star </v-icon> -->
              🔽
            </span>
            <span
              class="button mt-1"
              v-else
              @click="
                sortByFavoriteDES = true;
                sortByFavoriteASC = false;
              "
            >
              <!-- <v-icon color="white"> mdi-calendar-star </v-icon>  -->
              🔼
            </span>
            <v-icon
              small
              :style="isFavorite ? 'color:#ffa62b' : 'color:#214252'"
              class="mr-1"
              >{{ isFav }}</v-icon
            >
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  class="mt-2"
                  id="favStyle"
                  @click="
                    isFavorite = !isFavorite;
                    filterFavorites();
                  "
                  type="primary"
                  :style="Width"
                >
                  お気に入り
                </v-btn>
              </template>
              <span>Filter Favorites</span>
            </v-tooltip>
          </v-layout>
        </a-col>
        <a-col :xs="24" :sm="7" :md="5">
          <v-layout row wrap>
            <span
              class="mt-2 button"
              style="font-weight: bold; font-size: 14px"
              v-if="!sortByDateASC"
              @click="
                sortByDateASC = true;
                sortByDateDES = false;
              "
            >
              🔽 更新日:</span
            >
            <span
              class="mt-2 button"
              style="font-weight: bold; font-size: 14px"
              v-else
              @click="
                sortByDateASC = false;
                sortByDateDES = true;
              "
            >
              🔼 更新日:</span
            >
            &emsp;
          </v-layout>
        </a-col>
      </a-row>
    </v-card>
    <v-layout class="ma-1" v-if="!loadingJapanMemo">
      <!-- <v-spacer/> -->
      <span
        style="color: #0f3057; font-weight: bold"
        v-if="!isMultiple && searchMemoIconAlignment"
      >
        About {{ filteredMemo.length }} results for keywords "{{ searchText }}"
      </span>
      <span
        style="color: #0f3057; font-weight: bold"
        v-else-if="isMultiple && searchMemoIconAlignment"
      >
        About {{ filteredMemo.length }} results for multiple keywords
      </span>

      <span style="color: #0f3057; font-weight: bold" flat v-else
        >Total: {{ filteredMemo.length }}</span
      >
      <v-spacer />
    </v-layout>
    <v-card
      flat
      style="overflow-y: scroll"
      :height="hideFilter ? screenSize - 260 : screenSize - 300"
      class="ma-1 pa-1"
      v-if="!loadingJapanMemo"
    >
      <v-card elevation="0" v-for="(item, i) in paginatedMemo" :key="i">
        <v-divider />

        <v-row dense>
          <v-col cols="12" md="8">
            <v-layout>
              <v-icon color="#f55666" class="ml-2">mdi-file-document</v-icon>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    :color="isFavColor(item)"
                    class="ml-2"
                    @click="favoriteFunction(item)"
                    >{{ isFavIcon(item) }}</v-icon
                  >
                </template>
                <span>
                  {{
                    isFavIcon(item) != "mdi-star"
                      ? "Add to Favorite"
                      : "Delete from Favorite"
                  }}
                </span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span
                    v-on="on"
                    id="title_ellipsis"
                    @click="
                      openMemo(item);
                      searchLists.push(item.id, item.category);
                    "
                    :class="listColorSearch(item.id, item.category)"
                    class="mx-2;"
                    style="font-size: 20px; font-weight: bold;  cursor:pointer"
                    v-html="`${item.docNo} - ${item.title}${title_spacer}`"
                  />
                </template>
                <span> {{ item.title }}</span>
              </v-tooltip>
              <!-- <span
                class="title"
                v-if="searchMemoIconAlignment"
                v-html="`${item.content}`"
                style="color: #555555; margin-left: 30px; font-size: 12px"
              >
              </span> -->
            </v-layout>
          </v-col>
          <v-col class="pt-1" cols="12" md="4">
            <v-row dense>
              <v-col cols="5"
                ><a-tag
                  style="width: 100%; color: white; text-align: center"
                  color="#424874"
                  >{{ item.category }}</a-tag
                ></v-col
              >

              <v-col cols="4"
                ><a-tag
                  color="#3d7ea6"
                  style="width: 100%; color: white; text-align: center"
                  small
                >
                  <span class="hidden-md-and-down">更新日:</span>
                  {{ item.memoUpdatedDate }}</a-tag
                ></v-col
              >

              <v-col cols="1">
                <v-icon color="#6ebaa7" style="font-size: xx-small"
                  >mdi-eye</v-icon
                ><span
                  v-if="item.countViews"
                  style="font-size: font-size:xx-small"
                  >{{ item.countViews }}
                </span>
                <span v-else style="font-size: 12px"> 0 </span>
              </v-col>
              <v-col cols="1"
                ><v-icon small color="#ffa62b">mdi-star</v-icon>
                <span style="font-size: 12px" v-if="item.FavoritesCount"
                  >{{ item.FavoritesCount }}
                </span>
                <span v-else style="font-size: 12px"> 0 </span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="8">
            <v-layout>
              <span
                class="title"
                v-if="searchMemoIconAlignment"
                v-html="`${item.textContent}`"
                style="color: #555555; margin-left: 30px; font-size: 12px"
              >
                <!--  -->
                <!-- {{item.content}} -->
              </span>
            </v-layout>
          </v-col>
        </v-row>
      </v-card>
      <a-empty v-if="!loadingJapanMemo && paginatedMemo.length == 0" />
    </v-card>

    <v-pagination
      v-model="pageNumber"
      :length="paginationLength"
      :total-visible="5"
      dark
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
      v-if="!loadingJapanMemo"
    ></v-pagination>

    <v-dialog v-model="japanmemoDialog" max-width="500" persistent>
      <v-card>
        <v-toolbar dense flat color="#1565c0" dark>
          <v-toolbar-title>Register New Memo</v-toolbar-title>
          <v-spacer />
          <v-icon @click="japanmemoDialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-row no-gutters dense class="mt-3 pa-2">
          <v-col cols="6">
            <v-text-field
              label="ID"
              outlined
              dense
              v-model="toInsert.docNo"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <!-- <v-text-field
              label="Category"
              outlined
              dense
              v-model="toInsert.category"
            ></v-text-field> -->
            <v-select
              :items="computedCategoryList"
              v-model="toInsert.category"
              label="Category"
              outlined
              dense
            >
            </v-select>
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="Title"
              outlined
              dense
              v-model="toInsert.title"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-file-input
              label="Attachment"
              v-model="filesToUpload"
              multiple
              @change="onChangeUpload()"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-layout class="ma-1 pa-1" dense>
          <v-spacer></v-spacer>
          <v-btn color="#1565c0" dark @click="saveJapanMemo()"
            ><v-icon>mdi-content-save-move</v-icon> Save</v-btn
          >
        </v-layout>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
import moji from "moji";
import S3 from "aws-s3";
import AWS from "aws-sdk";
import tunnel from "tunnel";
import config from "../config";
import * as binconv from "binconv";
import Swal from "sweetalert2";
import moment from "moment";
import shortid from "shortid";
// import FileSaver from "file-saver";
// import converter from "base64-arraybuffer";
export default {
  data() {
    return {
      searchLists: [],
      title_spacer: "　",
      isMultiple: false,
      searchMemoIconAlignment: false,
      sortByCategoryDES: false,
      sortByCategoryASC: false,
      isFilterOn: false,
      hideFilter: true,
      searchText: "",
      exceptText: "",
      selectedCondition: "AND",
      condition: ["AND", "OR", "MULTI"],
      pageNumber: 1,
      intRowNoMemo: 30,
      loadingJapanMemo: true,
      memoData: [],
      selectedCategory: "ALL",
      categoryList: ["ALL", "連絡票", "設計課通達", "設計課・工事課通達"],
      sortByDateASC: false,
      sortByDateDES: false,
      sortByFavoriteASC: false,
      sortByFavoriteDES: false,
      isFavorite: false,
      composing: false,
      favoriteList: [],
      japanmemoDialog: false,
      toInsert: {},
      filesToUpload: [],
      fileName: "",
    };
  },
  created() {
    if (this.globalSearchWord && this.globalCondition) {
      if (this.isSearchAll) {
        this.searchText = this.globalSearchWord;
        this.selectedCondition = this.globalCondition;
        this.exceptText = this.globalExceptWord;

        if (this.selectedCondition != "MULTI") {
          this.onSearch();
        } else {
          this.onMultipleSearch();
        }
      }
    } else {
      this.loadAllMemo();
    }
    this.getUserFavorites();
  },
  methods: {
    //  onChangeCheck(e) {
    //   console.log(e.target.checked);
    //   this.UPDATE_SEARCH_ALL(e.target.checked);
    // if (e.target.checked == false) {
    //   this.CHANGE_SEARCH_WORD("");
    //   this.CHANGE_CONDITION("");
    //   this.CHANGE_EXCEPT_WORD("");
    // }
    // },
    onChangeUpload() {
      // console.log(this.filesToUpload)

      if (this.filesToUpload.length != 0) {
        for (let i = 0; i < this.filesToUpload.length; i++) {
          this.fileName = this.filesToUpload[i].name;
          this.toInsert.attachment = this.filesToUpload[i].name;
        }
      } else {
        alert("NO Attachment");
      }
    },

    saveJapanMemo() {
      axios.defaults.headers.common["x-api-key"] =
        "H8Pt5n6cbFk95UiXQjwZ9cwu6mcZqfF2rTw3HeS3";
      if (!this.toInsert.docNo) {
        Swal.fire({
          icon: "error",
          title: "Please input ID!",
          showConfirmButton: false,
          timer: 750,
        });
      } else if (!this.toInsert.category) {
        Swal.fire({
          icon: "error",
          title: "Please select Category!",
          showConfirmButton: false,
          timer: 750,
        });
      } else if (!this.toInsert.title) {
        Swal.fire({
          icon: "error",
          title: "Please input Title!",
          showConfirmButton: false,
          timer: 750,
        });
      } else if (!this.toInsert.attachment) {
        Swal.fire({
          icon: "error",
          title: "Please select Attachment!",
          showConfirmButton: false,
          timer: 750,
        });
      } else {
        Swal.fire({
          title: "Are you sure?",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: `Yes, Confirm ${this.toInsert.docNo}!`,
        }).then((result) => {
          if (result.value) {
            let url = `${this.awsURL}japan_memo`;

            this.toInsert.memoUpdatedDate = moment().format(
              "YYYY-MM-DD hh:mm:ss"
            );
            this.toInsert.textContent = "";

            this.toInsert.id = shortid.generate().substring(0, 5);
            this.uploadAttachment();

            axios
              .post(url, this.toInsert)
              .then(() => {
                Swal.fire({
                  icon: "success",
                  title: "Success!",
                  showConfirmButton: false,
                  timer: 750,
                });
                this.toInsert = {};
                this.japanmemoDialog = false;
                this.loadAllMemo();
              })
              .catch((err) => {
                console.log("error", err);
              });
          }
        });
      }
    },
    uploadAttachment() {
      //// UPLOAD FUNCTION FOR DOCUMENT AND HANDOUT FILES ////
      this.S3Client.uploadFile(
        this.filesToUpload[0],
        this.fileName.split(".")[0]
      ).finally(() => {
        console.log("uploaded");
      });
    },
    favoriteFunction(data) {
      let favorite = true;
      if (this.isFavIcon(data) == "mdi-star") {
        favorite = false;
      }

      axios.defaults.headers.common["x-api-key"] =
        "H8Pt5n6cbFk95UiXQjwZ9cwu6mcZqfF2rTw3HeS3";
      let toInsert = {
        id: data.id,
        docNo: data.docNo,
        category: data.category,
        userId: this.userInfo.id,
        isFavorite: favorite,
      };
      // console.log(toInsert)
      let url = `${this.awsURL}addFavorite/memo`;
      let url2 = `${this.awsURL}addFavoriteCount/memo`;
      axios.post(url2, toInsert).then(() => {
        axios.post(url, toInsert).then((res) => {
          // console.log(res.data)
          if (res.data == "Add Favorite") {
            Swal.fire({
              icon: "success",
              title: `${data.docNo} added to Favorites`,
              showConfirmButton: false,
              timer: 1200,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: `${data.docNo} deleted to Favorites`,
              showConfirmButton: false,
              timer: 1200,
            });
          }
          if (this.searchText != "") {
            this.onSearch();
            this.getUserFavorites();
          } else {
            this.loadAllMemo();
            this.getUserFavorites();
          }
        });
      });
    },
    listColorSearch(id, category) {
      if (
        this.searchLists.includes(id) &&
        this.searchLists.includes(category)
      ) {
        return "viewed";
      }
    },
    openMemo(data) {
      console.log("DATA", data);
      // alert(data.attachment);
      // let url = `${this.awsURL}addCount/memo/${data.id}?category=${data.category}`;
      let url = `${this.awsURL}addCount/memo/${data.id}?docNo=${data.docNo}`;

      axios.defaults.headers.common["x-api-key"] =
        "H8Pt5n6cbFk95UiXQjwZ9cwu6mcZqfF2rTw3HeS3";
      axios.post(url).then(() => {
        // console.log(res.data)ONGOING
        if (this.searchText !== "") {
          this.onSearch(data);
          this.getUserFavorites();
        } else {
          this.loadAllMemo();
          this.getUserFavorites();
        }
      });

      var tunnelingAgent = tunnel.httpsOverHttp({
        proxy: {
          // Proxy settings
          host: "hrdproxy.hrd-s.com",
          port: 81,
          proxyAuth: "administrator:system",
        },
      });

      AWS.config.update({
        httpOptions: { agent: tunnelingAgent },
        region: "us-east-2",
        credentials: config,
      });
      var s3 = new AWS.S3({
        AccessKeyID: "AKIA2FWIWPI5YVES3XEU",
        SecretAccessKey: "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",
        Region: "us-east-2",
        params: {
          bucket: "rulebook.files",
        },
      });

      var options = {
        Bucket: "rulebook.files",
        Key: `Memo/${data.attachment}`,
      };
      s3.getObject(options, function(err, data) {
        if (err) {
          console.log(err, err.stack);
        }
        // an error occurred
        else {
          // console.log(data, "s3Data");

          var blob = new Blob([binconv.uint8ArrayToBlob(data.Body)], {
            type: `${data.ContentType};charset=utf-8`,
          });
          let url = URL.createObjectURL(blob);
          // console.log(url)
          window.open(url, "_blank");
        }
        // });
      });
    },
    isFavColor(data) {
      let isFavMemo = false;
      this.favoriteList.map((r) => {
        if (r.id == data.id && r.category == data.category) {
          isFavMemo = true;
        }
      });
      if (isFavMemo) {
        return "yellow";
      } else return "black";
    },
    StartCompose() {
      this.composing = true;
    },
    EndCompose() {
      this.composing = false;
    },
    onSearch() {
      if (!this.composing) {
        this.searchMemoIconAlignment = true;
        this.isMultiple = false;
        let addLog = this.searchText;
        axios.defaults.headers.common["x-api-key"] =
          "H8Pt5n6cbFk95UiXQjwZ9cwu6mcZqfF2rTw3HeS3";
        let search = this.convert2FullKatakana(this.searchText);

        if (this.searchText != "") {
          this.loadingJapanMemo = true;
        }
        if (this.searchText) {
          let url = "";
          if (this.selectedCondition == "OR") {
            let ishiragana = moji(search)
              .filter("HG")
              .toString();
            let iskatakana = moji(search)
              .filter("KK")
              .toString();
            let hiragana = "";
            let katakana = "";
            if (ishiragana) {
              hiragana = moji(this.searchText)
                .convert("HG", "KK")
                .toString();
              search = `${search}${this.title_spacer}${hiragana}`;
            } else if (iskatakana) {
              search = this.convert2FullKatakana(this.searchText);
              katakana = moji(search)
                .convert("KK", "HG")
                .toString();
              search = this.convert2FullKatakana(search);
              katakana = this.convert2FullHiragana(katakana);
              search = `${search}${this.title_spacer}${katakana}`;
            } else {
              search = this.convert2FullKatakana(this.searchText);
            }
            //-----SMALL AND BIG ALPHA NUMERIC CHARACTERS CND
            let numSmall = moji(search)
              .filter("HE")
              .toString();
            let numBig = moji(search)
              .filter("ZE")
              .toString();

            if (search.match(/[0-9]/g) || search.match(/[０-９]/g)) {
              if (numSmall) {
                numSmall = moji(search)
                  .convert("HE", "ZE")
                  .toString();
                search = `${search}${this.title_spacer}${numSmall}`;
              } else if (numBig) {
                numBig = search = `${search}${this.title_spacer}${moji(search)
                  .convert("ZE", "HE")
                  .toString()}`;
              }
            }
            //-----HALF AND FULL WIDTH  CHARACTERS

            let fullKatakana = moji(search)
              .filter("ZK")
              .toString();
            let halfKatakana = moji(search)
              .filter("HK")
              .toString();
            if (fullKatakana) {
              fullKatakana = moji(search)
                .convert("ZK", "HK")
                .toString();
              search = `${search}${this.title_spacer}${fullKatakana}`;
            } else if (halfKatakana) {
              halfKatakana = moji(search)
                .convert("HK", "ZK")
                .toString();
              search = `${search}${this.title_spacer}${halfKatakana}`;
            }

            url = `${this.awsURL}search_memo/or?search=${search}&except=${this.exceptText}`;
          } else {
            if (search.match(/[０-９]/g)) {
              search = `${moji(search)
                .convert("ZE", "HE")
                .toString()}`;
              // console.log(search)
            }
            url = `${this.awsURL}search_memo/and?search=${search}&except=${this.exceptText}`;
          }
          // console.log(this.selectedCondition, url);
          console.log(addLog);
          axios.defaults.headers.common["x-api-key"] =
            "H8Pt5n6cbFk95UiXQjwZ9cwu6mcZqfF2rTw3HeS3";
          axios.get(url).then((res) => {
            this.memoData = res.data;
            console.log("MEMO DATA 2", this.memoData);

            this.searchDialog = false;
            this.memoData.sort(function(a, b) {
              return ("" + a.countViews).localeCompare(b.countViews);
            });
            this.loadingJapanMemo = false;
          });
        } else {
          this.memoData = [];
        }
      }
    },
    onMultipleSearch() {
      if (!this.composing) {
        this.searchMemoIconAlignment = true;
        this.isMultiple = true;
        let search = this.convert2FullKatakana(this.searchText);
        // this.searchLists = [];
        if (this.searchText != "") {
          this.loadingJapanMemo = true;
        }
        if (this.searchText) {
          axios.defaults.headers.common["x-api-key"] =
            "H8Pt5n6cbFk95UiXQjwZ9cwu6mcZqfF2rTw3HeS3";
          let url = "";
          url = `${this.awsURL}search_memo/multi?search=${search}&except=${this.exceptText}`;
          axios.get(url).then((res) => {
            if (typeof res.data != "string") {
              this.memoData = res.data;

              this.memoData.sort(function(a, b) {
                return ("" + a.countViews).localeCompare(b.countViews);
              });
              this.loadingJapanMemo = false;
            } else {
              this.loadingJapanMemo = true;
              this.selectedCondition = "OR";
              this.onSearch();
              this.isMultiple = false;
            }
            // if (this.isSearchAll) {
            //   this.CHANGE_SEARCH_WORD(this.searchText);
            //   this.CHANGE_CONDITION(this.selectedCondition);
            //   this.CHANGE_EXCEPT_WORD(this.exceptText);
            // } else {
            //   this.CHANGE_SEARCH_WORD("");
            //   this.CHANGE_CONDITION("");
            //   this.CHANGE_EXCEPT_WORD("");
            // }
          });
        } else {
          this.memoData = [];
        }
      }
    },
    clearSearch() {
      this.isMultiple = false;
      this.searchMemoIconAlignment = false;
      this.isFavorite = false;
      this.loadingJanMeo = true;
      this.sortByCategoryASC = false;
      this.sortByCategoryDES = false;
      this.sortByDateASC = false;
      this.sortByDateDES = false;
      this.sortByFavoriteASC = false;
      this.sortByFavoriteDES = false;
      this.loadAllMemo();
      this.getUserFavorites();
      this.searchText = "";
      this.exceptText = "";
    },
    getUserFavorites() {
      axios.defaults.headers.common["x-api-key"] =
        "H8Pt5n6cbFk95UiXQjwZ9cwu6mcZqfF2rTw3HeS3";
      this.loadingJapanMemo = true;
      let toGet = {
        userId: this.userInfo.id,
      };
      let url = `${this.awsURL}getFavorites/memo`;
      axios.post(url, toGet).then((res) => {
        // console.log(res.data);
        this.favoriteList = res.data;
      });
    },
    async filterFavorites() {
      await this.getUserFavorites();
      axios.defaults.headers.common["x-api-key"] =
        "H8Pt5n6cbFk95UiXQjwZ9cwu6mcZqfF2rTw3HeS3";
      this.memoData = [];
      if (this.isFavorite) {
        if (this.favoriteList.length > 0) {
          for (let i = 0; i < this.favoriteList.length; i++) {
            // console.log('------------------fsesrs------------------');
            // console.log(this.favoriteList[i]);
            // console.log('------------------------------------');
            let url2 = `${this.awsURL}getDetailsFavorite/memo?id=${this.favoriteList[i].id}&docNo=${this.favoriteList[i].docNo}`;
            // console.log(url2)
            await axios.get(url2).then((res) => {
              this.memoData.push(res.data);
              this.loadingJapanMemo = false;
            });
          }
        } else {
          this.loadingJapanMemo = false;
        }
      } else {
        this.clearSearch();
      }
    },
    loadAllMemo() {
      this.loadingJapanMemo = true;

      let url = `${this.awsURL}load_japan_memo`;
      axios.defaults.headers.common["x-api-key"] =
        "H8Pt5n6cbFk95UiXQjwZ9cwu6mcZqfF2rTw3HeS3";
      axios.get(url).then((res) => {
        this.memoData = res.data;
        // this.memoData.sort(function (a, b) {
        //   return ("" + a.countViews).localeCompare(b.countViews);
        // }).sort((a,b) => {
        //   return b.countViews - a.countViews
        // })
        console.log("MEMO DATA 1", this.memoData);
        this.memoData.sort((a, b) => {
          return moment(b.memoUpdatedDate) - moment(a.memoUpdatedDate);
        });

        this.loadingJapanMemo = false;
      });
    },
    isFavIcon(data) {
      let isFavMemo = false;
      this.favoriteList.map((r) => {
        if (r.id == data.id && r.category == data.category) {
          isFavMemo = true;
        }
      });
      if (isFavMemo) {
        return "mdi-star";
      } else {
        return "mdi-star-outline";
      }
    },
  },
  computed: {
    config() {
      return {
        bucketName: "rulebook.files",
        dirName: "Memo", //Optional --> directory or folder on s3 where the file will be saved.
        region: "us-east-2",
        accessKeyId: "AKIA2FWIWPI5THZHNWHQ",
        secretAccessKey: "Dq8KzBreAzA1BOTvKfWCOqjMfxKlPDFJc9JV6T8k",
        s3Url: "https://s3.us-east-2.amazonaws.com/rulebook.files", //Optional --> url of your s3 bucket.
      };
    },
    S3Client() {
      return new S3(this.config);
    },
    url() {
      return `${this.baseURL}/${this.directory}/${this.fileName}`;
    },
    // baseURL() {
    //   return "https://s3.us-east-2.amazonaws.com/rulebook.files";
    // },
    // directory() {
    //   return "Memo";
    // },
    computedCategoryList() {
      const [, ...category] = this.categoryList;
      return category;
    },
    isFav() {
      if (this.isFavorite) {
        return "mdi-star";
      } else {
        return "mdi-star-outline";
      }
    },
    Width() {
      if (
        this.$vuetify.breakpoint.name == "md" ||
        this.$vuetify.breakpoint.name == "lg" ||
        this.$vuetify.breakpoint.name == "xl"
      ) {
        return "width:60%";
      } else return "width:98%";
    },
    screenSize() {
      return this.$vuetify.breakpoint.height;
    },
    filteredMemo() {
      // console.log('SEARCH TEXT',this.searchText)
      // let data = this.memoData;

      let data = [];
      if (this.selectedCategory == "ALL") {
        data = this.memoData;
      } else {
        data = this.memoData.filter((r) => {
          return r.category == this.selectedCategory;
        });
      }

      if (this.sortByCategoryASC) {
        data.sort((a, b) => (a.category > b.category ? 1 : -1));
      }
      if (this.sortByCategoryDES) {
        data.sort((a, b) => (a.category < b.category ? 1 : -1));
      }
      if (this.sortByDateASC) {
        data.sort((a, b) => {
          let key1 = a.memoUpdatedDate;
          let key2 = b.memoUpdatedDate;
          if (key1 < key2) {
            return -1;
          } else if (key1 == key2) {
            return 0;
          } else {
            return 1;
          }
        });
      }
      if (this.sortByDateDES) {
        data.sort(function(a, b) {
          if (a.memoUpdatedDate > b.memoUpdatedDate) return -1;
          if (a.memoUpdatedDate < b.memoUpdatedDate) return 1;
          return 0;
        });
      }
      return data;
    },
    paginationLength() {
      let l = this.filteredMemo.length,
        s = this.intRowNoMemo;
      return Math.ceil(l / s);
    },
    paginatedMemo() {
      const start = (this.pageNumber - 1) * this.intRowNoMemo,
        end = start + this.intRowNoMemo;
      return this.filteredMemo.slice(start, end);
    },
  },
};
</script>
<style scoped>
#title_ellipsis {
  display: inline-block;
  width: 93%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.button {
  /* background-color: #01579b; */
  border: none;
  cursor: pointer;
  /* color: white; */
  color: black;
  padding: 6px 4px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
.title {
  display: inline-block;
  width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px !important;
}
.viewed {
  background-color: white;
  color: purple;
}
</style>
