<template>
  <v-container pa-0 fluid>
    <v-layout align-center justify-center v-if="loadingCondition">
      <a-spin class="mt-2" tip="Loading..." />
    </v-layout>
    <v-card class="ma-2 pa-2" flat style="background-color: #f6f5f5" v-else>
      <v-row dense>
        <v-col cols="12" sm="6" md="4">
          <a-input
            addon-before="Search"
            @keyup.enter="
              selectedCondition != 'MULTI' ? onSearch() : onMultipleSearch()
            "
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
        </v-col>
        <v-spacer v-if="!isFilterOn" />
        <!-- <a-checkbox :checked="isSearchAll" @change="onChangeCheck">
          Search All
        </a-checkbox> -->
        <a-button
          v-if="!isFilterOn"
          icon="filter"
          @click="hideFilter = !hideFilter"
          >{{ hideFilter ? "View Filter" : "Hide Filter" }}
        </a-button>
        <v-col v-if="isFilterOn">
          <template>
            <a-popover
              title="Filter Options"
              :placement="placePop"
              v-model="isvisibleFilter"
              trigger="click"
            >
              <template slot="content">
                <v-card style="width: 500px" flat>
                  <v-layout row wrap>
                    &emsp;
                    <span style="font-weight: bold; font-size: 14px"
                      >製品区分:</span
                    >
                    <a-select
                      class="mt-2"
                      v-model="selectedproductType"
                      style="width: 72%; margin-left: 10px"
                    >
                      <a-select-option
                        v-for="item in productTypeList"
                        :key="item"
                        v-value="item"
                        >{{ item }}</a-select-option
                      >
                    </a-select>
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
                          data-v-step="5"
                          @click="
                            sortByProductTypeDES = true;
                            sortByProductTypeASC = false;
                          "
                          type="caret-down"
                        />
                      </a-col>
                    </a-row>
                  </v-layout>
                  <v-layout row wrap>
                    <span
                      class="mt-2"
                      style="font-weight: bold; font-size: 14px"
                      >構法: {{ title_spacer }}</span
                    >
                    <a-select
                      class="mt-1"
                      v-model="selectedMethod"
                      style="width: 72%; margin-left: 20px"
                    >
                      <a-select-option
                        v-for="item in methodList"
                        :key="item.value"
                        v-value="item.value"
                        >{{ item.text }}</a-select-option
                      >
                    </a-select>
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
                  </v-layout>
                  <v-layout row wrap>
                    <span
                      class="mt-2"
                      style="font-weight: bold; font-size: 14px"
                      >区分:</span
                    >
                    <a-select
                      class="mt-1"
                      v-model="selectedCriteria"
                      style="width: 72%; margin-left: 40px"
                    >
                      <a-select-option
                        v-for="item in criteriaList"
                        :key="item"
                        v-value="item"
                        >{{ item }}</a-select-option
                      >
                    </a-select>

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
                  </v-layout>
                  <v-layout row wrap>
                    <span
                      class="pt-2"
                      style="font-weight: bold; font-size: 14px"
                      >更新日:</span
                    >

                    <a-range-picker
                      class="mt-1"
                      @change="onChangeDate"
                      style="width: 72%; margin-left: 25px"
                    />
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
                  </v-layout>
                  <v-layout row wrap>
                    <span
                      class="pt-2"
                      style="font-weight: bold; font-size: 14px"
                      >建物タイプ:</span
                    >&nbsp;
                    <a-select
                      class="mt-1"
                      mode="multiple"
                      v-model="selectedBuildingType"
                      style="width: 72%"
                    >
                      <a-select-option
                        v-for="item in buildingTypeList"
                        :key="item.value"
                        v-value="item.value"
                        >{{ item.text }}</a-select-option
                      >
                    </a-select>
                  </v-layout>
                  <v-layout row wrap>
                    <span
                      class="pt-2"
                      style="font-weight: bold; font-size: 14px"
                      >建物仕様:</span
                    >
                    <a-select
                      mode="multiple"
                      v-model="selectedBuildingSpecification"
                      style="
                            width: 72%;
                            margin-top: 10px;
                            margin-left: 15px;
                          "
                      class="mt-2"
                    >
                      <a-select-option
                        v-for="item in buildingSpecificationList"
                        :key="item.value"
                        v-value="item.value"
                        >{{ item.text }}</a-select-option
                      >
                    </a-select>
                  </v-layout>
                  <v-layout row wrap>
                    <v-icon color="black"> mdi-calendar-star </v-icon>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          v-on="on"
                          class="mt-1"
                          id="favStyle"
                          @click="changeFavoriteColor()"
                          type="primary"
                          style="
                                width: 72%;
                                margin-left: 40px;
                                margin-top: 10px;
                              "
                        >
                          <v-icon
                            small
                            :style="
                              isFavorite ? 'color:#ffa62b' : 'color:#214252'
                            "
                            class="mr-1"
                            >{{ isFav }}</v-icon
                          >
                          お気に入り
                        </v-btn>
                        <a-row>
                          <a-col>
                            <a-icon
                              type="caret-up"
                              @click="
                                sortByFavoriteASC = true;
                                sortByFavoriteDES = false;
                              "
                            />
                          </a-col>
                          <a-col>
                            <a-icon
                              type="caret-down"
                              @click="
                                sortByFavoriteASC = false;
                                sortByFavoriteDES = true;
                              "
                            />
                          </a-col>
                        </a-row>
                      </template>
                      <span>Filter Favorites</span>
                    </v-tooltip>
                  </v-layout>
                </v-card>
              </template>
              <v-icon class="ml-1 mt-2">mdi-filter-menu-outline</v-icon>
            </a-popover>
          </template>
        </v-col>
      </v-row>
      <a-row
        :xs="24"
        :sm="12"
        :md="10"
        :gutter="[0, 3]"
        v-if="!isFilterOn && !hideFilter"
      >
        <a-col :xs="24" :sm="14" :md="7">
          <v-layout row wrap>
            &emsp;
            <span
              class="mt-2  button"
              style="font-weight: bold; font-size: 14px"
              v-if="!sortByProductTypeASC"
              @click="
                sortByProductTypeASC = true;
                sortByProductTypeDES = false;
              "
            >
              🡇 製品区分:
            </span>
            <span
              class="mt-2  button"
              style="font-weight: bold; font-size: 14px"
              v-else
              @click="
                sortByProductTypeDES = true;
                sortByProductTypeASC = false;
              "
              >🡅 製品区分:</span
            >
            <a-select class="mt-2" v-model="selectedproductType" :style="Width">
              <a-select-option
                v-for="item in productTypeList"
                :key="item"
                v-value="item"
                >{{ item }}</a-select-option
              >
            </a-select>
          </v-layout>
        </a-col>
        <a-col :xs="24" :sm="7" :md="7">
          <v-layout row wrap>
            <span
              class="mt-2 button"
              style="font-weight: bold; font-size: 14px"
              v-if="sortByMethodASC == false"
              @click="
                sortByMethodASC = true;
                sortByMethodDES = false;
              "
            >
              🡇 構法:</span
            >
            <span
              class="mt-2 button"
              style="font-weight: bold; font-size: 14px"
              v-else
              @click="
                sortByMethodDES = true;
                sortByMethodASC = false;
              "
            >
              🡅 構法:</span
            >
            <a-select class="mt-2" v-model="selectedMethod" :style="Width">
              <a-select-option
                v-for="item in methodList"
                :key="item.value"
                v-value="item.value"
                >{{ item.text }}</a-select-option
              >
            </a-select>
          </v-layout>
        </a-col>
        <a-col :xs="24" :sm="15" :md="5">
          <v-layout row wrap>
            <span
              class="mt-2 button"
              style="font-weight: bold; font-size: 14px"
              v-if="sortByCriteriaASC == false"
              @click="
                sortByCriteriaASC = true;
                sortByCriteriaDES = false;
              "
            >
              🡇 区分:</span
            >
            <span
              class="mt-2 button"
              style="font-weight: bold; font-size: 14px"
              v-else
              @click="
                sortByCriteriaDES = true;
                sortByCriteriaASC = false;
              "
            >
              🡅 区分:</span
            >
            <a-select
              class="mt-2"
              v-model="selectedCriteria"
              :style="StyleWidth"
            >
              <a-select-option
                v-for="item in criteriaList"
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
              <!-- <v-icon color="white"> mdi-calendar-star </v-icon>  -->
              🡇
              <v-icon
                small
                :style="isFavorite ? 'color:#ffa62b' : 'color:#214252'"
                class="mr-1"
                >{{ isFav }}</v-icon
              >
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
              🡅
              <v-icon
                small
                :style="isFavorite ? 'color:#ffa62b' : 'color:#214252'"
                class="mr-1"
                >{{ isFav }}</v-icon
              >
            </span>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  class="mt-2"
                  id="favStyle"
                  @click="changeFavoriteColor()"
                  type="primary"
                  :style="Width"
                >
                  <!-- <v-icon
                    small
                    :style="isFavorite ? 'color:#ffa62b' : 'color:#214252'"
                    class="mr-1"
                    >{{ isFav }}</v-icon
                  > -->
                  お気に入り
                </v-btn>
              </template>
              <span>Filter Favorites</span>
            </v-tooltip>
          </v-layout>
        </a-col>
      </a-row>

      <a-row
        :xs="24"
        :sm="12"
        :md="10"
        :gutter="[0, 3]"
        v-if="!isFilterOn && !hideFilter"
      >
        <a-col :xs="24" :sm="14" :md="7">
          <v-layout row wrap>
            <span class="mt-2 border" style="font-weight: bold; font-size: 14px"
              >建物タイプ :</span
            >
            <a-select
              class="mt-2"
              mode="multiple"
              v-model="selectedBuildingType"
              :style="HTypeWidth"
            >
              <a-select-option
                v-for="item in buildingTypeList"
                :key="item.value"
                v-value="item.value"
                >{{ item.text }}</a-select-option
              >
            </a-select>
          </v-layout>
        </a-col>
        <a-col :xs="24" :sm="15" :md="7">
          <v-layout row wrap>
            <span class="mt-2 border" style="font-weight: bold; font-size: 14px"
              >建物仕様:</span
            >
            <a-select
              mode="multiple"
              v-model="selectedBuildingSpecification"
              :style="CustomWidth"
              class="mt-2"
            >
              <a-select-option
                v-for="item in buildingSpecificationList"
                :key="item.value"
                v-value="item.value"
                >{{ item.text }}</a-select-option
              >
            </a-select>
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
              🡇 更新日:</span
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
              🡅 更新日:</span
            >
            &emsp;
          </v-layout>
        </a-col>
      </a-row>
    </v-card>
    <v-layout class="ma-1" v-if="!loadingCondition">
      <!-- <v-spacer/> -->
      <span
        style="color: #0f3057; font-weight: bold"
        v-if="searchRulebookIconAlignment && !isMultiple"
      >
        About {{ filteredGoogleRules.length }} results for keywords "{{
          searchText
        }}"
      </span>
      <span
        style="color: #0f3057; font-weight: bold"
        v-else-if="searchRulebookIconAlignment && isMultiple"
      >
        About {{ filteredGoogleRules.length }} results for multiple keywords
      </span>
      <span style="color: #0f3057; font-weight: bold" v-else flat
        >Total: {{ filteredGoogleRules.length }}</span
      >
      <v-spacer />
    </v-layout>
    <v-card
      flat
      v-if="!loadingCondition"
      style="overflow-y: scroll"
      :height="hideFilter ? screenSize - 270 : screenSize - 340"
      class="ma-1 pa-1"
    >
      <v-card
        elevation="0"
        v-for="(item, i) in filteredPaginationData"
        :key="i"
        @click="
          viewRuleContent(item);
          selectDoc = item._id;
          searchLists.push(item._id);
        "
      >
        <v-divider />

        <v-row dense>
          <v-col cols="12" md="7">
            <v-layout>
              <v-icon color="#f55666" class="ml-2">mdi-file-document</v-icon>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    dark
                    rounded
                    v-on="on"
                    @click="addFavorites(item._id)"
                    small
                    :color="
                      favoriteUsers.includes(item._id) ? `yellow` : `black`
                    "
                  >
                    mdi-star
                  </v-icon>
                </template>
                <span>Mark as favorite</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span
                    v-on="on"
                    :class="listColorSearch(item._id)"
                    id="title_ellipsis"
                    class="mx-2"
                    style="font-size: 20px; font-weight: bold"
                    v-html="`${item._id} - ${item.title}${title_spacer}`"
                  />
                </template>
                <span> {{ item.title }}</span>
              </v-tooltip>
              <span
                class="title"
                v-if="searchRulebookIconAlignment && isFilterOn"
                v-html="`${item.content}`"
                style="color: #555555; margin-left: 30px; font-size: 12px"
              >
              </span>
            </v-layout>
          </v-col>
          <v-col class="pt-1" cols="12" md="5">
            <v-row dense>
              <v-col cols="3"
                ><a-tag
                  style="width: 100%; color: white; text-align: center"
                  color="#424874"
                  >{{ item.productType }}</a-tag
                ></v-col
              >
              <v-col cols="2"
                ><a-tag
                  style="width: 100%; color: white; text-align: center"
                  color="#e36387"
                  >{{ item.criteria }}</a-tag
                ></v-col
              >
              <v-col cols="2">
                <a-tag
                  style="width: 100%; color: white; text-align: center"
                  small
                  color="#5c969e"
                >
                  <span v-if="item.method == 'JIKU'"
                    >{{ methodList[1].text }}
                  </span>
                  <span class="mr-1" v-else-if="item.method == 'WAKU'"
                    >{{ methodList[2].text }}
                  </span>
                  <span v-else>軸組 枠組 </span>
                </a-tag>
              </v-col>
              <v-col cols="3"
                ><a-tag
                  color="#3d7ea6"
                  style="width: 100%; color: white; text-align: center"
                  small
                >
                  <span class="hidden-md-and-down">更新日:</span>
                  {{ item.RulebookUpdatedDate }}</a-tag
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
                <span style="font-size: 12px"
                  >{{ item.countFavorites }}
                </span></v-col
              >
            </v-row>
          </v-col>
          <v-col v-if="!isFilterOn">
            <span
              class="title"
              v-if="searchRulebookIconAlignment"
              v-html="`${item.content}`"
              style="color: #555555; margin-left: 30px; font-size: 12px"
            >
            </span>
          </v-col>
        </v-row>
      </v-card>
    </v-card>
    <v-pagination
      v-model="pageNumber"
      :length="paginationLength"
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
      hideFilter: true,
      filterMaster: [],
      dataSource: [],
      isvisibleFilter: false,
      isFavorite: false,
      sortByFavoriteASC: false,
      sortByFavoriteDES: false,
      sortByProductTypeASC: false,
      sortByProductTypeDES: false,
      sortByMethodASC: false,
      sortByMethodDES: false,
      sortByCriteriaASC: false,
      sortByCriteriaDES: false,
      sortByDateASC: false,
      sortByDateDES: false,
      isMultiple: false,
      title_spacer: "　",
      selectedCondition: "",
      pageNumber: 1,
      intRowNoSearchDocument: 30,
      condition: ["OR", "AND", "MULTI"],
      googleRules: [],
      searchGoogle: true,
      searchText: "",
      exceptText: "",
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
        "洋室造作/和室造作/建具",
      ],
      loadingCondition: false,

      buildingTypeList: [
        { text: "ALL", value: "ALL" },
        { text: "夢の家", value: "YumeNoIe" },
        { text: "一般", value: "Ippan" },
        { text: "グランセゾン", value: "G" },
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
      dateFrom: "",
      dateTo: "",
      mask: "####-##-##",
      searchRulebookIconAlignment: false,
      favoriteColor: 0,
      favoriteUsers: [],
    };
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
    onChangeCheck(e) {
      this.UPDATE_SEARCH_ALL(e.target.checked);
      if (e.target.checked == false) {
        this.CHANGE_SEARCH_WORD("");
        this.CHANGE_CONDITION("");
        this.CHANGE_EXCEPT_WORD("");
      }
    },
    callback() {
      this.searchGoogle = true;
      this.rulecontent = false;
      this.selectDoc = "";
    },
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
        window.open(`document/${val._id}?search=${this.searchText}`, "_blank");
      } else if (this.searchText && this.selectedCondition == "MULTI") {
        window.open(
          `document/${val._id}?search=${this.searchText}&multi=true`,
          "_blank"
        );
      } else {
        window.open(`document/${val._id}`, "_blank");
      }
      let url = `${this.api}process/add/view_count/${val._id}`;
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
          url = `${this.api}search/get/content?search=${search}&except=${this.exceptText}`;
        } else {
          url = `${this.api}search/get/content/and?search=${search}&except=${this.exceptText}`;
        }
        // console.log(url)
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
          if (this.isSearchAll) {
            this.CHANGE_SEARCH_WORD(this.searchText);
            this.CHANGE_CONDITION(this.selectedCondition);
            this.CHANGE_EXCEPT_WORD(this.exceptText);
          } else {
            this.CHANGE_SEARCH_WORD("");
            this.CHANGE_CONDITION("");
            this.CHANGE_EXCEPT_WORD("");
          }
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
        url = `${this.api}search/get/content/multiple?search=${search}&except=${this.exceptText}`;
        // console.log(url)
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
      let employeeID = "";
      if (this.userInfo.EmployeeNumber) {
        employeeID = this.userInfo.EmployeeNumber;
      }
      if (this.userInfo.employee_code) {
        employeeID = this.userInfo.employee_code;
      }
      let url = `${this.api}process/get/rulebook_finaldata`;
      axios
        .get(url)
        .then((res) => {
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
        })
        .then(() => {
          axios
            .get(
              `${this.api}document/get/checkfavorites?employeeID=${employeeID}`
            )
            .then((res) => {
              this.favoriteUsers = res.data[0].docs;
            });
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
        .get(`${this.api}document/get/checkfavorites?employeeID=${employeeID}`)
        .then((res) => {
          this.favoriteUsers = res.data;
          if (this.favoriteUsers.length == 0) {
            Swal.fire({
              icon: "error",
              title: "No record found.",
            });
          } else {
            this.isFavorite = !this.isFavorite;
            if (this.favoriteColor == 0) {
              this.favoriteColor = 1;
            } else {
              this.favoriteColor = 0;
            }
          }
        });
    },

    addFavorites(documentNo) {
      let employeeID = "";
      if (this.userInfo.EmployeeNumber) {
        employeeID = this.userInfo.EmployeeNumber;
      }
      if (this.userInfo.employee_code) {
        employeeID = this.userInfo.employee_code;
      }
      let url = `${this.api}document/add/final/favorite?documentNo=${documentNo}&employeeID=${employeeID}`;
      axios.post(url);

      if (this.favoriteColor == 0) {
        Swal.fire({
          icon: "success",
          title: "Added to favorites",
          showConfirmButton: false,
          timer: 750,
        });
        this.favoriteColor = 1;
        this.viewedRule.countFavorites = this.viewedRule.countFavorites + 1;
      } else {
        Swal.fire({
          icon: "error",
          title: "Removed from favorites",
          showConfirmButton: false,
          timer: 750,
        });
        this.favoriteColor = 0;
        this.viewedRule.countFavorites = this.viewedRule.countFavorites - 1;
      }
    },
  },
  computed: {
    HTypeWidth() {
      if (
        this.$vuetify.breakpoint.name == "md" ||
        this.$vuetify.breakpoint.name == "lg" ||
        this.$vuetify.breakpoint.name == "xl"
      ) {
        return "width:55%";
      } else return "width:98%";
    },
    screenSize() {
      return this.$vuetify.breakpoint.height;
    },
    placePop() {
      if (this.$vuetify.breakpoint.name == "sm") {
        return "bottomRight";
      } else if (this.$vuetify.breakpoint.name == "xs") {
        return "bottomLeft";
      } else return "bottom";
    },
    isFilterOn() {
      if (
        this.$vuetify.breakpoint.name == "xs" ||
        this.$vuetify.breakpoint.name == "sm"
      ) {
        return true;
      } else return false;
    },

    StyleWidth() {
      if (
        this.$vuetify.breakpoint.name == "md" ||
        this.$vuetify.breakpoint.name == "lg" ||
        this.$vuetify.breakpoint.name == "xl"
      ) {
        return "width:64%;";
      } else return "width:98%";
    },
    CustomWidth() {
      if (
        this.$vuetify.breakpoint.name == "md" ||
        this.$vuetify.breakpoint.name == "lg" ||
        this.$vuetify.breakpoint.name == "xl"
      ) {
        return "width:53%";
      } else return "width:98%";
    },
    Width() {
      if (
        this.$vuetify.breakpoint.name == "md" ||
        this.$vuetify.breakpoint.name == "lg" ||
        this.$vuetify.breakpoint.name == "xl"
      ) {
        return "width:55%";
      } else return "width:98%";
    },
    isFav() {
      if (this.isFavorite) {
        return "mdi-star";
      } else {
        return "mdi-star-outline";
      }
    },

    filteredGoogleRules() {
      let data = [];
      if (this.googleRules.length > 0) {
        //   return this.filteredRuleSpecs;
        // } else if (!this.searchText) {
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
        data.sort(function(a, b) {
          if (a.RulebookUpdatedDate > b.RulebookUpdatedDate) return -1;
          if (a.RulebookUpdatedDate < b.RulebookUpdatedDate) return 1;
          return 0;
        });
      }
      if (this.sortByFavoriteASC) {
        data.sort((a, b) => (a.countFavorites > b.countFavorites ? 1 : -1));
      }
      if (this.sortByFavoriteDES) {
        data.sort((a, b) => (a.countFavorites < b.countFavorites ? 1 : -1));
      }
      return data;
    },

    //Search Rulebook Document Data with pagination
    paginationLength() {
      let l = this.filteredGoogleRules.length,
        s = this.intRowNoSearchDocument;
      return Math.ceil(l / s);
    },
    filteredPaginationData() {
      const start = (this.pageNumber - 1) * this.intRowNoSearchDocument,
        end = start + this.intRowNoSearchDocument;
      return this.filteredGoogleRules.slice(start, end);
    },
  },
};
</script>

<style scoped>
.button {
  border: none;
  cursor: pointer;
  color: black;
  padding: 6px 4px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
.viewed {
  background-color: white;
  color: purple;
}
div {
  margin: 0 0 0 0;
}

.title {
  display: inline-block;
  width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px !important;
}
#title_ellipsis {
  display: inline-block;
  width: 93%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#favStyle {
  color: #214252 !important;
  background-color: #fafafa !important;
  height: 30px !important;
  border-radius: 0mm !important;
}
</style>
