<template>
  <v-container fluid pa-0>

    <v-layout align-center justify-center v-if="loadingCondition" pt-3>
      <a-spin tip="Loading..."> </a-spin>
    </v-layout>

    <v-flex v-else pl-1>
      <v-card flat v-if="showDataCondition">
        <v-layout row wrap style="background-color: #f0f0f0" pt-1>
          <v-flex xs12 sm6 md4>
            <a-row type="flex" justify="start">
              <a-col :span="24">
                <a-input
                  v-if="selectedCondition != 'MULTI'"
                  addonBefore="Search:"
                  @keyup.enter="
                    selectedCondition != 'MULTI'
                      ? onSearch()
                      : onMultipleSearch()
                  "
                  style="width: 100%"
                  v-model="searchText"
                  placeholder="Search document"
                  append-icon="search"
                  outlined
                >
                  <a-icon
                    slot="suffix"
                    @click="clearSearch()"
                    type="close-circle"
                    style="color: rgba(0, 0, 0, 0.45)"
                  />
                </a-input>

                <a-auto-complete
                  v-else
                  @search="onSearchAuto"
                  @select="onSelect"
                  @change="onChange"
                  :data-source="filterMaster"
                  style="width: 100%"
                  v-model="searchText"
                  @keyup.enter="
                    selectedCondition != 'MULTI'
                      ? onSearch()
                      : onMultipleSearch()
                  "
                >
                  <a-input
                    addon-before="Search"
                    @keyup.enter="
                      selectedCondition != 'MULTI'
                        ? onSearch()
                        : onMultipleSearch()
                    "
                    placeholder="Search document"
                    @select="onSelect"
                    @change="onChange"
                    v-model="searchText"
                    append-icon="search"
                  >
                    <a-icon
                      slot="suffix"
                      @click="clearSearch()"
                      type="close-circle"
                      style="color: rgba(0, 0, 0, 0.45)"
                    />
                  </a-input>
                </a-auto-complete>
              </a-col>
            </a-row>
          </v-flex>

          <v-flex xs12 sm6 md3>
            <a-row type="flex" justify="start">
              <a-col :span="12">
                <a-select
                  v-model="selectedCondition"
                  style="width: 100%"
                >
                  <a-select-option
                    v-for="item in condition"
                    :key="item"
                    v-value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-col>

              <a-col :span="12">
                <a-button
                 
                  style="width: 100%"
                  dark
                  type="primary"
                  icon="search"
                  @click="
                    selectedCondition != 'MULTI'
                      ? onSearch()
                      : onMultipleSearch()
                  "
                  :disabled="!searchText"
                >
                  Search
                </a-button>
              </a-col>
            </a-row>
          </v-flex>

          <v-flex xs12 sm12 md5 pr-1>
            <a-row type="flex" justify="start">
              <a-col :span="24" style="text-align: right">
                <span
                  v-if="searchText && !isMultiple"
                >
                  About {{ filteredGoogleRules.length }} results for keywords
                  "{{ searchText }}"
                </span>
                <span
                  v-else-if="searchText && isMultiple"
                >
                  About {{ filteredGoogleRules.length }} results for multiple
                  keywords
                </span>

                <span
                  v-else
                  flat
                >
                  Total: {{ filteredGoogleRules.length }}
                </span>
              </a-col>
            </a-row>
          </v-flex>
        </v-layout>

        <div
          class="mt-0 pt-0 pb-2"
          style="background-color: #f5f5f5"
        >
          <v-layout row wrap class="pt-1">
            <v-flex xs12 sm6 md3>
              <a-row type="flex" justify="start">
                <a-col :span="4" class="pl-1 pt-1">
                  <span class="mt-2" style="font-weight: bold; font-size: 12px"
                    >製品区分:</span
                  >
                </a-col>
                <a-col :span="1">
                  <a-row>
                    <a-col>
                      <a-icon
                       
                        @click="
                          sortByProductTypeASC = true;
                          sortByProductTypeDES = false;
                        "
                        type="caret-up"
                      />
                    </a-col>
                    <a-col>
                      <a-icon
                        
                        @click="
                          sortByProductTypeDES = true;
                          sortByProductTypeASC = false;
                        "
                        type="caret-down"
                      />
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :span="19">
                  <a-select
                    class="mt-1"
                    v-model="selectedproductType"
                    style="width: 100%"
                  >
                    <a-select-option
                      v-for="item in productTypeList"
                      :key="item"
                      v-value="item"
                      >{{ item }}</a-select-option
                    >
                  </a-select>
                </a-col>
              </a-row>
            </v-flex>

            <v-flex xs12 sm6 md3>
              <a-row type="flex" justify="start" style="height: 35px">
                <a-col :span="4" class="pl-1 pt-1">
                  <span class="mt-2" style="font-weight: bold; font-size: 14px"
                    >構法:</span
                  >&nbsp;&nbsp;
                </a-col>
                <a-col :span="1">
                  <a-row>
                    <a-col>
                      <a-icon
                        @click="
                          sortByMethodASC = true;
                          sortByMethodDES = false;
                        "
                        type="caret-up"
                      />
                    </a-col>
                    <a-col>
                      <a-icon
                        type="caret-down"
                        @click="
                          sortByMethodASC = false;
                          sortByMethodDES = true;
                        "
                      />
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :span="19">
                  <a-select
                    class="mt-1"
                    v-model="selectedMethod"
                    style="width: 100%"
                  >
                    <a-select-option
                      v-for="item in methodList"
                      :key="item.value"
                      v-value="item.value"
                      >{{ item.text }}</a-select-option
                    > </a-select
                  >&nbsp; &emsp;
                </a-col>
              </a-row>
            </v-flex>

            <v-flex xs12 sm6 md3>
              <a-row type="flex" justify="start">
                <a-col :span="4" class="pl-1 pt-1">
                  <span class="mt-2" style="font-weight: bold; font-size: 14px"
                    >区分:</span
                  >
                </a-col>
                <a-col :span="1">
                  <a-row>
                    <a-col>
                      <a-icon
                        type="caret-up"
                        @click="
                          sortByCriteriaASC = true;
                          sortByCriteriaDES = false;
                        "
                      />
                    </a-col>
                    <a-col>
                      <a-icon
                        type="caret-down"
                        @click="
                          sortByCriteriaASC = false;
                          sortByCriteriaDES = true;
                        "
                      />
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :span="19">
                  <a-select
                    class="mt-1"
                    v-model="selectedCriteria"
                    style="width: 100%"
                  >
                    <a-select-option
                      v-for="item in criteriaList"
                      :key="item"
                      v-value="item"
                      >{{ item }}</a-select-option
                    >
                  </a-select>
                </a-col>
              </a-row>
            </v-flex>

            <v-flex xs12 sm6 md3 pr-1 pt-1 pl-1>
              <a-row type="flex" justify="start">
                <a-col :span="23">
                  <a-button style="width: 98%" @click="changeFavoriteColor()">
                    <span style="font-size: 12px"> お気に入り </span>
                    <v-icon
                      small
                      :color="favoriteColor == 1 ? `yellow` : `none`"
                    >
                      mdi-star
                    </v-icon>
                  </a-button>
                </a-col>

                <a-col :span="1">
                  <a-row>
                    <a-col>
                      <a-icon
                        @click="
                          sortByFavoritesASC = true;
                          sortByFavoritesDES = false;
                        "
                        type="caret-up"
                      />
                    </a-col>
                    <a-col>
                      <a-icon
                        @click="
                          sortByFavoritesDES = true;
                          sortByFavoritesASC = false;
                        "
                        type="caret-down"
                      />
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </v-flex>

            <v-flex xs12 sm6 md3>
              <a-row type="flex" justify="start">
                <a-col :span="5" class="pl-1 pt-1">
                  <span
                    class="pl-0 ml-0"
                    style="font-weight: bold; font-size: 12px"
                    >建物タイプ:</span
                  >
                </a-col>
                <a-col :span="19">
                  <a-select
                    class="mt-1"
                    mode="multiple"
                    v-model="selectedBuildingType"
                    style="width: 100%"
                  >
                    <a-select-option
                      v-for="item in buildingTypeList"
                      :key="item.value"
                      v-value="item.value"
                      >{{ item.text }}</a-select-option
                    >
                  </a-select>
                </a-col>
              </a-row>
            </v-flex>

            <v-flex xs12 sm6 md3>
              <a-row type="flex" justify="start">
                <a-col :span="4" class="pl-1 pt-1">
                  <span class="pt-2" style="font-weight: bold; font-size: 14px"
                    >更新日:</span
                  >
                </a-col>
                <a-col :span="1">
                  <a-row>
                    <a-col>
                      <a-icon
                        type="caret-up"
                        @click="
                          sortByDateASC = true;
                          sortByDateDES = false;
                        "
                      />
                    </a-col>
                    <a-col>
                      <a-icon
                        type="caret-down"
                        @click="
                          sortByDateASC = false;
                          sortByDateDES = true;
                        "
                      />
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :span="19">
                  <a-range-picker
                    class="mt-1"
                    @change="onChangeDate"
                    style="width: 100%"
                  />
                </a-col>
              </a-row>
            </v-flex>

            <v-flex xs12 sm6 md3 pr-1>
              <a-row type="flex" justify="start">
                <a-col :span="5" class="pl-1 pt-1">
                  <span class="mt-2" style="font-weight: bold; font-size: 14px"
                    >建物仕様:</span
                  >&nbsp;
                </a-col>
                <a-col :span="19">
                  <a-select
                    mode="multiple"
                    v-model="selectedBuildingSpecification"
                    style="width: 100%"
                  >
                    <a-select-option
                      class="mt-1"
                      v-for="item in buildingSpecificationList"
                      :key="item.value"
                      v-value="item.value"
                      >{{ item.text }}</a-select-option
                    > </a-select
                  >&nbsp;
                </a-col>
              </a-row>
            </v-flex>
          </v-layout>
        </div>

        <div
          class="text-xs-center"
          v-if="loadingCondition"
          style="background-color: #fafafa"
        >
          <br />
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
        <v-card
          flat
          v-else
          style="overflow-y: scroll"
          :height="screenSize - 300"
        >
          <template v-for="(item, i) in paginationData">
            <v-list-item
              @click="
                viewRuleContent(item);
                selectDoc = item._id;
                searchLists.push(item._id);
              "
              :key="i"
              :class="listColorSearch(item._id)"
            >
              <v-icon color="#f55666">mdi-file-document</v-icon>&emsp;

              <v-list-item-content>
                <v-list-item-title class="font-weight-medium">
                  <a-row type="flex" justify="start">
                    <a-col
                      :span="14"
                      style="
                            display: inline-block;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                          "
                    >
                      <span
                        v-if="i == 0"
                        style="font-size: 20px"
                      >
                        {{ item._id }}
                      </span>
                      <span v-if="i != 0" style="font-size: 20px">
                        {{ item._id }}
                      </span>
                      {{ title_spacer }}

                      <span
                        style="font-size: 20px"
                        v-html="`${item.title.substring(0, 40)}${title_spacer}`"
                        v-if="i == 0"
                      ></span>
                      <span
                        style="font-size: 20px"
                        v-if="i != 0"
                        v-html="`${item.title.substring(0, 40)}${title_spacer}`"
                      ></span>
                    </a-col>

                    <span
                      v-if="i == 0"
                      id="label"
                      style="
                            background-color: #424874;
                            width: 120px;
                            text-align: center;
                            font-size: 11px;
                          "
                      class="mr-1"
                      >{{ item.productType }}</span
                    >
                    <span
                      v-if="i != 0"
                      id="label"
                      style="
                            background-color: #424874;
                            width: 120px;
                            text-align: center;
                            font-size: 11px;
                          "
                      class="mr-1"
                      >{{ item.productType }}</span
                    >

                    <span
                      v-if="i == 0"
                      id="label"
                      style="
                            background-color: #e36387;
                            width: 75px;
                            font-size: 11px;
                            text-align: center;
                          "
                      class="mr-1"
                      >{{ item.criteria }}</span
                    >
                    <span
                      v-if="i != 0"
                      id="label"
                      style="
                            background-color: #e36387;
                            width: 75px;
                            font-size: 11px;
                            text-align: center;
                          "
                      class="mr-1"
                      >{{ item.criteria }}</span
                    >

                    <span
                      id="label"
                      style="
                            background-color: #5c969e;
                            width: 70px;
                            font-size: 11px;
                            text-align: center;
                          "
                      class="mr-1"
                      v-if="item.method == 'JIKU' && i == 0"
                      >{{ methodList[1].text }}</span
                    >
                    <span
                      id="label"
                      style="
                            background-color: #5c969e;
                            width: 70px;
                            font-size: 11px;
                            text-align: center;
                          "
                      class="mr-1"
                      v-if="item.method == 'JIKU' && i != 0"
                      >{{ methodList[1].text }}</span
                    >

                    <span
                      id="label"
                      style="
                            background-color: #5c969e;
                            width: 70px;
                            font-size: 11px;
                            text-align: center;
                          "
                      class="mr-1"
                      v-else-if="item.method == 'WAKU' && i == 0"
                      >{{ methodList[2].text }}</span
                    >

                    <span
                      id="label"
                      style="
                            background-color: #5c969e;
                            width: 70px;
                            font-size: 11px;
                            text-align: center;
                          "
                      class="mr-1"
                      v-else-if="item.method == 'WAKU' && i != 0"
                      >{{ methodList[2].text }}</span
                    >

                    <span
                      id="label"
                      style="
                            background-color: #5c969e;
                            width: 70px;
                            font-size: 11px;
                            text-align: center;
                          "
                      class="mr-1"
                      v-else-if="item.method == 'WAKU/JIKU' && i == 0"
                      >軸組 枠組</span
                    >

                    <span
                      id="label"
                      style="
                            background-color: #5c969e;
                            width: 70px;
                            font-size: 11px;
                            text-align: center;
                          "
                      class="mr-1"
                      v-else-if="item.method == 'WAKU/JIKU' && i != 0"
                      >軸組 枠組</span
                    >

                    <span
                      id="label"
                      style="
                            background-color: #3d7ea6;
                            width: 120px;
                            font-size: 11px;
                            text-align: center;
                          "
                      class="mr-1"
                      v-if="i == 0"
                      >更新日: {{ item.RulebookUpdatedDate }}</span
                    >
                    <span
                      v-if="i != 0"
                      id="label"
                      style="
                            background-color: #3d7ea6;
                            width: 120px;
                            font-size: 11px;
                            text-align: center;
                          "
                      class="mr-1"
                      >更新日: {{ item.RulebookUpdatedDate }}</span
                    >

                    <v-flex xs12 sm5 md1>
                      <a-row type="flex" justify="start">
                        <a-col :span="15">
                          <v-icon small>mdi-eye</v-icon>

                          <span
                            style="font-size: 12px"
                            v-if="item.countViews && i == 0"
                          >
                            {{ item.countViews }}
                          </span>

                          <span
                            v-if="item.countViews && i != 0"
                            style="font-size: 12px"
                            >{{ item.countViews }}
                          </span>

                          <span v-if="!item.countViews" style="font-size: 12px"
                            >0</span
                          >
                        </a-col>
                        <a-col :span="9">
                          <span
                            v-if="item.countFavorites && i == 0"
                            style="font-size: 12px"
                          >
                            <v-icon
                              color="yellow"
                              small
                              >mdi-star</v-icon
                            >{{ item.countFavorites }}
                          </span>
                          <span
                            v-if="item.countFavorites && i != 0"
                            style="font-size: 12px"
                          >
                            <v-icon color="yellow" small>mdi-star</v-icon
                            >{{ item.countFavorites }}
                          </span>
                          <span
                            v-if="!item.countFavorites"
                            style="font-size: 12px"
                          >
                            <v-icon color="yellow" small>mdi-star</v-icon>
                            0</span
                          >
                        </a-col>
                      </a-row>
                    </v-flex>
                  </a-row>
                </v-list-item-title>

                <v-list-item-sub-title
                  v-if="searchRulebookIconAlignment"
                  v-html="`${title_spacer}${item.content}`"
                ></v-list-item-sub-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-card>
      </v-card>
    </v-flex>

    <v-pagination
      v-model="intPageNo"
      :length="searchDocPageCount"
      :total-visible="5"
      dark
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
      v-if="!loadingCondition"
    ></v-pagination>
  </v-container>
</template>

<script>


import axios from "axios";
import Swal from "sweetalert2";
import { mask } from "vue-the-mask";
import moji from "moji";

export default {
  directives: {
    mask,
  },
  components: {},
  data() {
    return {
      sortByProductTypeASC: false,
      sortByProductTypeDES: false,
      sortByMethodASC: false,
      sortByMethodDES: false,
      sortByCriteriaASC: false,
      sortByCriteriaDES: false,
      sortByDateASC: false,
      sortByDateDES: false,
      sortByFavoritesASC: false,
      sortByFavoritesDES: false,
      isMultiple: false,
      title_spacer: "　",
      selectedCondition: "",
      intPageNo: 1,
      intRowNoSearchDocument: 30,
      condition: ["OR", "AND", "MULTI"],
      googleRules: [],
      showDataCondition: true,
      approvalRemarks: "",
      searchText: "",
      selectDoc: "",
      searchLists: [],
      criteriaList: ["ALL", "ルール", "製品仕様", "基本図面", "パターン"],
      
      selectedCriteria: "",
      methodList: [
        { text: "ALL", value: "ALL" },
        { text: "軸組", value: "JIKU" },
        { text: "枠組", value: "WAKU" },
      ],
      selectedMethod: "",
      selectedproductType: "",
      productTypeList: [
        `ALL`,
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
      loadingCondition: false,
      listData: [],
      
      
      buildingTypeList: [
        { text: "ALL", value: "ALL" },
        { text: "夢の家", value: "YumeNoIe" },
        { text: "一般", value: "Ippan" },
        { text: "グランド セゾン", value: "G" },
        { text: "セゾンF", value: "F" },
        { text: "セゾンA", value: "A" },
        { text: "ブリアール", value: "B" },
        { text: "セゾンF2-TD", value: "F2-TD" },
        { text: "i-cube", value: "Icube" },
        { text: "i-smart", value: "Ismart" },
        { text: "i-smile", value: "Ismile" },
      ],
      buildingSpecificationList: [
        { text: "ALL", value: "ALL" },
        { text: "耐震", value: "Taishin" },
        { text: "免震", value: "Menshin" },
      ],
      selectedBuildingType: ["ALL"],
      selectedBuildingSpecification: ["ALL"],
      historyDetails: "",
      // dateFrom: new Date().toISOString().substr(0, 10),
      // dateTo: new Date().toISOString().substr(0, 10),
      dateFrom: "",
      dateTo: "",
      dateFromMenu: false,
      dateToMenu: false,
      mask: "####-##-##",
      synonymsData: [],
      searchRulebookIconAlignment: false,
      historyCount: 0,
      total_rows: 0,
      favoriteColor: 0,
      favoriteUsers: [],
      filterMaster: [],
      dataSource: [],
    };
  },
  mounted() {
  },
  created() {
    this.loadingCondition = true;
    
    this.selectedCondition = "OR";
    this.selectedCriteria = "ALL";
    this.selectedMethod = "ALL";
    this.selectedproductType = "ALL";
    this.loadAllDocs();
   
  },
  watch: {
    filteredGoogleRules() {
      this.intPageNo = 1;
    },

    dateTo() {
      if (this.dateTo < this.dateFrom) {
        this.dateTo = "";
      }
    },
   
    selectedBuildingType() {
      if (
        this.selectedBuildingType.includes("ALL") &&
        this.selectedBuildingType.length == 2
      ) {
        this.selectedBuildingType.splice(0, 1);
      }
      if (this.selectedBuildingType.length == 0) {
        this.selectedBuildingType = ["ALL"];
      }
      if (
        this.selectedBuildingType.includes("ALL") &&
        this.selectedBuildingType.length != 1
      ) {
        this.selectedBuildingType = ["ALL"];
      }
    },

    selectedBuildingSpecification() {
      if (
        this.selectedBuildingSpecification.includes("ALL") &&
        this.selectedBuildingSpecification.length == 2
      ) {
        this.selectedBuildingSpecification.splice(0, 1);
      }
      if (this.selectedBuildingSpecification.length == 0) {
        this.selectedBuildingSpecification = ["ALL"];
      }
      if (
        this.selectedBuildingSpecification.includes("ALL") &&
        this.selectedBuildingSpecification.length != 1
      ) {
        this.selectedBuildingSpecification = ["ALL"];
      }
    },

    
  },
  methods: {
    clearSearch() {
      this.searchRulebookIconAlignment = false;
      this.loadingCondition = true;
      this.isMultiple = false;
      (this.sortByProductTypeASC = false),
        (this.sortByProductTypeDES = false),
        (this.sortByMethodASC = false),
        (this.sortByMethodDES = false),
        (this.sortByCriteriaASC = false),
        (this.sortByCriteriaDES = false),
        (this.sortByDateASC = false),
        (this.sortByDateDES = false),
        (this.sortByFavoritesASC = false),
        (this.sortByFavoritesDES = false);
      this.loadAllDocs();
      this.searchText = "";
    },

    convert2FullKatakana(str) {
      var kanaMap = {
        ｶﾞ: "ガ",
        ｷﾞ: "ギ",
        ｸﾞ: "グ",
        ｹﾞ: "ゲ",
        ｺﾞ: "ゴ",
        ｻﾞ: "ザ",
        ｼﾞ: "ジ",
        ｽﾞ: "ズ",
        ｾﾞ: "ゼ",
        ｿﾞ: "ゾ",
        ﾀﾞ: "ダ",
        ﾁﾞ: "ヂ",
        ﾂﾞ: "ヅ",
        ﾃﾞ: "デ",
        ﾄﾞ: "ド",
        ﾊﾞ: "バ",
        ﾋﾞ: "ビ",
        ﾌﾞ: "ブ",
        ﾍﾞ: "ベ",
        ﾎﾞ: "ボ",
        ﾊﾟ: "パ",
        ﾋﾟ: "ピ",
        ﾌﾟ: "プ",
        ﾍﾟ: "ペ",
        ﾎﾟ: "ポ",
        ｳﾞ: "ヴ",
        ﾜﾞ: "ヷ",
        ｦﾞ: "ヺ",
        ｱ: "ア",
        ｲ: "イ",
        ｳ: "ウ",
        ｴ: "エ",
        ｵ: "オ",
        ｶ: "カ",
        ｷ: "キ",
        ｸ: "ク",
        ｹ: "ケ",
        ｺ: "コ",
        ｻ: "サ",
        ｼ: "シ",
        ｽ: "ス",
        ｾ: "セ",
        ｿ: "ソ",
        ﾀ: "タ",
        ﾁ: "チ",
        ﾂ: "ツ",
        ﾃ: "テ",
        ﾄ: "ト",
        ﾅ: "ナ",
        ﾆ: "ニ",
        ﾇ: "ヌ",
        ﾈ: "ネ",
        ﾉ: "ノ",
        ﾊ: "ハ",
        ﾋ: "ヒ",
        ﾌ: "フ",
        ﾍ: "ヘ",
        ﾎ: "ホ",
        ﾏ: "マ",
        ﾐ: "ミ",
        ﾑ: "ム",
        ﾒ: "メ",
        ﾓ: "モ",
        ﾔ: "ヤ",
        ﾕ: "ユ",
        ﾖ: "ヨ",
        ﾗ: "ラ",
        ﾘ: "リ",
        ﾙ: "ル",
        ﾚ: "レ",
        ﾛ: "ロ",
        ﾜ: "ワ",
        ｦ: "ヲ",
        ﾝ: "ン",
        ｧ: "ァ",
        ｨ: "ィ",
        ｩ: "ゥ",
        ｪ: "ェ",
        ｫ: "ォ",
        ｯ: "ッ",
        ｬ: "ャ",
        ｭ: "ュ",
        ｮ: "ョ",
        "｡": "。",
        "､": "、",
        ｰ: "ー",
        "｢": "「",
        "｣": "」",
        "･": "・",
      };

      var reg = new RegExp("(" + Object.keys(kanaMap).join("|") + ")", "g");
      return str
        .replace(reg, function(match) {
          return kanaMap[match];
        })
        .replace(/ﾞ/g, "゛")
        .replace(/ﾟ/g, "゜");
    },
    convert2FullHiragana(str) {
      var kanaMap = {
        ぁ: "あ",
        ぃ: "い",
        ぅ: "う",
        ぇ: "え",
        ぉ: "お",
        ゃ: "や",
        ゅ: "ゆ",
        ょ: "よ",
      };

      var reg = new RegExp("(" + Object.keys(kanaMap).join("|") + ")", "g");
      return str.replace(reg, function(match) {
        return kanaMap[match];
      });
    },
    loadFile() {
      let url = `${this.api}getAllFiles`;
      axios.get(url).then((res) => {
        res.data = res.data.map((rec, index) => {
          rec.key = index;
          rec.filename = rec.DXFFile;
          rec.JWWFile = encodeURI(
            `http://hrdapps48.hrd-s.com:3001/ftp/rule_book/${rec.JWWFile}`
          );
          rec.DXFFile = encodeURI(
            `http://hrdapps48.hrd-s.com:3001/ftp/rule_book/${rec.DXFFile}`
          );

          return rec;
        });

        this.listData = res.data;
      });
    },

    listColor(id) {
      if (id == this.selectDoc) {
        return "bgYellow";
      } else return "bgWhite";
    },

    listColorSearch(id) {
      if (this.searchLists.includes(id)) {
        return "viewed";
      }
    },

    viewRuleContent(val) {
      if (
        this.searchText.match(/^[0-9]/g) == null &&
        this.selectedCondition != "MULTI" &&
        this.searchText
      ) {
        window.open(
          `${this.linkURL}/newPage/${val._id}?search=${this.searchText}`,
          "_blank"
        );
      } else if (this.searchText && this.selectedCondition == "MULTI") {
        window.open(
          `${this.linkURL}/newPage/${val._id}?search=${this.searchText}&multi=true`,
          "_blank"
        );
      } else {
        window.open(`${this.linkURL}/newPage/${val._id}`, "_blank");
      }
      let url = `${this.api}addCount/${val._id}`;
      let index = this.googleRules.indexOf(val);

      if (this.googleRules[index].countViews) {
        this.$set(
          this.googleRules[index],
          "countViews",
          this.googleRules[index].countViews + 1
        );
      } else {
        this.$set(this.googleRules[index], "countViews", 1);
      }
      axios
        .post(url)
        .then(() => {})
        .catch((err) => console.log(err));
    },

    onSearch() {
      this.searchRulebookIconAlignment = true;
      this.isMultiple = false;

      let search = this.convert2FullKatakana(this.searchText);
      this.searchLists = [];
      if (this.searchText != "") {
        this.loadingCondition = true;
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
          url = `${this.api}get/title_rules?search=${search}&criteria=${
            this.selectedCriteria
          }&method=${this.selectedMethod}&productType=${
            this.selectedproductType
          }&specs=${this.selectedBuildingType.toString()}`;
        } else {
          url = `${this.api}get/title_rules/and?search=${search}&criteria=${
            this.selectedCriteria
          }&method=${this.selectedMethod}&productType=${
            this.selectedproductType
          }&specs=${this.selectedBuildingType.toString()}`;
        }
        axios.get(url).then((res) => {
          this.googleRules = res.data.map((rec) => {
            if (!rec.RulebookUpdatedDate) {
              rec.RulebookUpdatedDate = "";
            }
            if (!rec.countViews) {
              rec.countViews = 0;
            }
            return rec;
          });
          this.googleRules.sort((a, b) =>
            a.countViews < b.countViews ? 1 : -1
          );

          this.loadingCondition = false;
        });
      } else {
        this.googleRules = [];
      }
      this.showDataCondition = true;
    },

    onMultipleSearch() {
      this.searchRulebookIconAlignment = true;
      this.isMultiple = true;

      let search = this.convert2FullKatakana(this.searchText);
      this.searchLists = [];
      if (this.searchText != "") {
        this.loadingCondition = true;
      }

      if (this.searchText) {
        let url = "";
        url = `${this.api}get/multiple_rules?search=${search}&criteria=${
          this.selectedCriteria
        }&method=${this.selectedMethod}&productType=${
          this.selectedproductType
        }&specs=${this.selectedBuildingType.toString()}`;
        axios.get(url).then((res) => {
          if (typeof res.data != "string") {
            this.googleRules = res.data.map((rec) => {
              if (!rec.RulebookUpdatedDate) {
                rec.RulebookUpdatedDate = "";
              }
              return rec;
            });
            this.googleRules.sort((a, b) =>
              a.countViews < b.countViews ? 1 : -1
            );
          } else {
            this.loadingCondition = true;
            this.selectedCondition = "OR";
            this.onSearch();

            this.isMultiple = false;
          }
          this.loadingCondition = false;
        });
      } else {
        this.googleRules = [];
      }
      this.showDataCondition = true;
    },

    loadAllDocs() {
      this.isMultiple = false;
      let url = `${this.api}getAllDocs`;
      axios.get(url).then((res) => {
        this.googleRules = res.data.toSend.map((r) => {
          let i = 0;
          r.key = i++;
          if (!r.RulebookUpdatedDate) {
            r.RulebookUpdatedDate = "";
          }
          if (!r.countViews) {
            r.countViews = 0;
          }

          if (!r.countFavorites) {
            r.countFavorites = 0;
          }
          return r;
        });
        this.total_rows = res.data.total_rows;

        this.loadingCondition = false;
      });
    },
   

    onChangeDate(date, datestring) {
      this.dateFrom = datestring[0];
      this.dateTo = datestring[1];
    },

    changeFavoriteColor() {
      let employeeID = "";
      if (this.userInfo.EmployeeNumber) {
        employeeID = this.userInfo.EmployeeNumber;
      }
      if (this.userInfo.employee_code) {
        employeeID = this.userInfo.employee_code;
      }
      axios
        .get(`${this.api}checkFavorites?employeeID=${employeeID}`)
        .then((res) => {
          this.favoriteUsers = res.data;
          if (this.favoriteUsers[0].docs != "") {
            if (this.favoriteColor == 0) {
              this.favoriteColor = 1;
            } else {
              this.favoriteColor = 0;
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "No record found.",
            });
          }
        });
    },

    getMasterMultiple() {
      let url = `${this.api}get/SynonymChars`;
      axios.defaults.headers.common["x-api-key"] =
        "H8Pt5n6cbFk95UiXQjwZ9cwu6mcZqfF2rTw3HeS3";
      axios.get(url).then((res) => {
        var merged = [].concat.apply([], res.data.data);
        this.dataSource = merged;
      });
    },

    onSearchAuto(searchText) {
      this.getMasterMultiple();
      if (searchText) {
        this.filterMaster = this.dataSource.filter((rec) => {
          let word = new RegExp(`${searchText}`, "g");
          if (rec != null) {
            return rec.match(word) != null;
          }
        });
      }
    },
    onSelect() {},
    onChange() {
      this.getMasterMultiple();
    },
  },
  computed: {
    screenSize() {
      return this.$vuetify.breakpoint.height;
    },
   
  
  
  

    filteredGoogleRules() {
      let data = [];

      if (this.googleRules.length > 0) {
        data = this.googleRules
          .filter((r) => {
            if (this.selectedproductType != "ALL") {
              return r.productType == this.selectedproductType;
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (this.selectedMethod != "ALL") {
              return r.method == this.selectedMethod || r.method == "WAKU/JIKU";
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (this.selectedCriteria != "ALL") {
              return r.criteria == this.selectedCriteria;
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (
              this.selectedBuildingType.includes("Ippan") &&
              !this.selectedBuildingType.includes("ALL")
            ) {
              return r.Ippan == true;
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (
              this.selectedBuildingType.includes("YumeNoIe") &&
              !this.selectedBuildingType.includes("ALL")
            ) {
              return r.YumeNoIe == true;
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (
              this.selectedBuildingType.includes("Icube") &&
              !this.selectedBuildingType.includes("ALL")
            ) {
              return r.Icube == true;
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (
              this.selectedBuildingType.includes("Ismart") &&
              !this.selectedBuildingType.includes("ALL")
            ) {
              return r.Ismart == true;
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (
              this.selectedBuildingType.includes("Ismile") &&
              !this.selectedBuildingType.includes("ALL")
            ) {
              return r.Ismart == true;
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (
              this.selectedBuildingSpecification.includes("Taishin") &&
              !this.selectedBuildingSpecification.includes("ALL")
            ) {
              return r.Taishin == true;
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (
              this.selectedBuildingSpecification.includes("Menshin") &&
              !this.selectedBuildingSpecification.includes("ALL")
            ) {
              return r.Menshin == true;
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (this.dateFrom) {
              return r.RulebookUpdatedDate >= `${this.dateFrom}`;
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (this.dateTo) {
              return r.RulebookUpdatedDate <= `${this.dateTo}`;
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (
              this.selectedBuildingType.includes("G") &&
              !this.selectedBuildingType.includes("ALL")
            ) {
              return r.G == true;
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (
              this.selectedBuildingType.includes("F") &&
              !this.selectedBuildingType.includes("ALL")
            ) {
              return r.F == true;
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (
              this.selectedBuildingType.includes("A") &&
              !this.selectedBuildingType.includes("ALL")
            ) {
              return r.A == true;
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (
              this.selectedBuildingType.includes("B") &&
              !this.selectedBuildingType.includes("ALL")
            ) {
              return r.B == true;
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (
              this.selectedBuildingType.includes("F2-TD") &&
              !this.selectedBuildingType.includes("ALL")
            ) {
              return r["F2-TD"] == true;
            } else {
              return r;
            }
          })
          .filter((r) => {
            if (this.favoriteColor == 1) {
              return this.favoriteUsers[0].docs.some((el) =>
                r._id.includes(el)
              );
            } else {
              return r;
            }
          });
      } else {
        data = [];
      }
      if (this.sortByProductTypeASC) {
        data.sort((a, b) => (a.productType > b.productType ? 1 : -1));
      }
      if (this.sortByProductTypeDES) {
        data.sort((a, b) => (a.productType < b.productType ? 1 : -1));
      }
      if (this.sortByMethodASC) {
        data.sort((a, b) => (a.method > b.method ? 1 : -1));
      }
      if (this.sortByMethodDES) {
        data.sort((a, b) => (a.method < b.method ? 1 : -1));
      }
      if (this.sortByCriteriaASC) {
        data.sort((a, b) => (a.criteria > b.criteria ? 1 : -1));
      }
      if (this.sortByCriteriaDES) {
        data.sort((a, b) => (a.criteria < b.criteria ? 1 : -1));
      }
      if (this.sortByFavoritesASC) {
        data.sort((a, b) => (a.countFavorites > b.countFavorites ? 1 : -1));
      }
      if (this.sortByFavoritesDES) {
        data.sort((a, b) => (a.countFavorites < b.countFavorites ? 1 : -1));
      }
      if (this.sortByDateASC) {
        data.sort((a, b) => {
          let key1 = a.RulebookUpdatedDate;
          let key2 = b.RulebookUpdatedDate;
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
        data.sort((a, b) => {
          let key1 = a.RulebookUpdatedDate;
          let key2 = b.RulebookUpdatedDate;
          if (key1 > key2) {
            return -1;
          } else if (key1 == key2) {
            return 0;
          } else {
            return 1;
          }
        });
      }

      return data;
    },

    //Rulebook Document Data with pagination

    //Search Rulebook Document Data with pagination
    searchDocPageCount() {
      let l = this.filteredGoogleRules.length,
        s = this.intRowNoSearchDocument;
      return Math.ceil(l / s);
    },
    paginationData() {
      const start = (this.intPageNo - 1) * this.intRowNoSearchDocument,
        end = start + this.intRowNoSearchDocument;
      return this.filteredGoogleRules.slice(start, end);
    },
  },
};
</script>

<style scoped>
.v-btn {
  border-radius: 28px !important;
}
.bgYellow {
  background-color: #a8e5f5;
}
.bgWhite {
  background-color: white;
}
.viewed {
  background-color: white;
  color: purple;
}
div {
  margin: 0 0 0 0;
}

.disabled {
  pointer-events: none;
}

#mycard {
  min-height: calc(100vh - 100px);
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  overflow-x: auto;
}

#label {
  border-radius: 5px;
  font-size: 15px;
  padding: 0 0.5rem;
  color: honeydew;
}
</style>
