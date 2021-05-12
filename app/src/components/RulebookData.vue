<template>
  <v-container fluid>
    <v-card flat class="ma-2 pa-2" outlined>
      <v-row dense no-gutters>
        <v-col lg="3" md="4" sm="6" cols="12">
          <v-text-field
            v-model="searchText"
            @keyup.enter="
              selectedCondition != 'MULTI' ? onSearch() : onMultipleSearch()
            "
            append-icon="mdi-restart"
            @click:append="resetData()"
            small
            class="mt-2"
            style="width:95%"
            label="Search"
            clearable
            rounded
            outlined
            dense
            hide-details
          >
          </v-text-field>
        </v-col>
        <v-col lg="3" md="4" sm="6" cols="12">
          <v-text-field
            v-model="exceptText"
            class="mt-2"
            style="width:95%"
            label="Except"
            clearable
            rounded
            outlined
            dense
            hide-details
          >
          </v-text-field>
        </v-col>
        <v-col lg="2" md="4" sm="4" cols="12">
          <v-select
            v-model="selectedCondition"
            class="mt-2"
            style="width:95%"
            label="Condition"
            :items="['OR', 'AND', 'MULTI']"
            outlined
            rounded
            dense
            hide-details
          >
          </v-select>
        </v-col>
        <v-col lg="1" md="2" sm="4" cols="6">
          <v-btn
            text
            outlined
            class="mt-2"
            style="width:95%"
            @click="
              selectedCondition != 'MULTI' ? onSearch() : onMultipleSearch()
            "
          >
            <v-icon>
              mdi-magnify
            </v-icon>
            Search
          </v-btn>
        </v-col>
        <v-spacer v-if="$vuetify.breakpoint.name == 'lg'"></v-spacer>
        <v-col lg="3" md="6" sm="4" cols="6" :style="computedFilter">
          <v-btn
            text
            outlined
            class="mt-2"
            :style="
              $vuetify.breakpoint.name == 'sm' ||
              $vuetify.breakpoint.name == 'xs'
                ? 'width:100%;font-size: 1vw'
                : 'width:auto;'
            "
            @click="hideFilter = !hideFilter"
          >
            <v-icon>
              mdi-filter-menu-outline
            </v-icon>
            <span>{{ hideFilter ? "Hide Filter" : "Show Filter" }}</span>
          </v-btn>
        </v-col>
      </v-row>

      <v-card flat v-if="hideFilter">
        <v-row dense no-gutters>
          <v-col lg="3" md="4" sm="12" cols="12">
            <v-row dense no-gutters :style="computedRowWidth">
              <v-select
                class="mt-2"
                dense
                outlined
                hide-details
                :prepend-icon="computedSortProductTypeIcon"
                @click:prepend="sortByProduct()"
                style="width:100%"
                label="製品区分"
                :items="productTypeList"
                v-model="selectedproductType"
              >
              </v-select>
            </v-row>
          </v-col>
          <v-col lg="3" md="4" sm="12" cols="12">
            <v-row dense no-gutters :style="computedRowWidth">
              <v-select
                class="mt-2"
                dense
                outlined
                hide-details
                :prepend-icon="computedSortMethodIcon"
                @click:prepend="sortByMethod()"
                style="width:100%"
                label="構法"
                :items="methodList"
                v-model="selectedMethod"
              >
              </v-select>
            </v-row>
          </v-col>
          <v-col lg="3" md="4" sm="12" cols="12">
            <v-row dense no-gutters :style="computedRowWidth">
              <v-select
                class="mt-2"
                dense
                outlined
                hide-details
                :prepend-icon="computedSortCriteriaIcon"
                @click:prepend="sortByCriteria()"
                style="width:100%"
                label="区分"
                :items="criteriaList"
                v-model="selectedCriteria"
              >
              </v-select>
            </v-row>
          </v-col>
          <v-col lg="3" md="4" sm="12" cols="12">
            <v-row dense no-gutters :style="computedRowWidth">
              <!-- <v-col lg="1" md="1" sm="1" cols="1" class="pt-3">
                <v-icon @click="sortByFavorite()">{{
                  computedSortFavoriteIcon
                }}</v-icon>
              </v-col>
              <v-col lg="11" md="11" sm="11" cols="11">
                <v-btn
                  @click="favoriteColor = !favoriteColor"
                  class=" mt-2"
                  dense
                  outlined
                  hide-details
                  style="width:100%; border:solid 1px; color:gray; "
                  text
                >
                  <v-icon :color="favoriteColor ? 'yellow' : 'black'"
                    >mdi-star</v-icon
                  >
                  お気に入り
                </v-btn>
              </v-col> -->

              <div style="width:100%; white-space: nowrap">
                <v-icon @click="sortByFavorite()">{{
                  computedSortFavoriteIcon
                }}</v-icon>

                <v-btn
                  @click="favoriteColor = !favoriteColor"
                  class="ml-2 mt-2"
                  dense
                  outlined
                  hide-details
                  :style="computedButtonWidth"
                  text
                >
                  <v-icon :color="favoriteColor ? 'yellow' : 'black'"
                    >mdi-star</v-icon
                  >
                  お気に入り
                </v-btn>
              </div>
            </v-row>
          </v-col>
          <v-col lg="3" md="4" sm="12" cols="12">
            <v-select
              class="mt-2"
              dense
              outlined
              multiple
              hide-details
              :style="computedRowWidth"
              label="建物タイプ"
              :items="buildingTypeList"
              v-model="selectedBuildingType"
            >
            </v-select>
          </v-col>
          <v-col lg="3" md="4" sm="12" cols="12">
            <v-select
              class="mt-2"
              dense
              outlined
              multiple
              hide-details
              :style="computedRowWidth"
              label="建物仕様"
              :items="buildingSpecificationList"
              v-model="selectedBuildingSpecification"
            >
            </v-select>
          </v-col>
          <v-col lg="3" md="12" sm="12" cols="12">
            <v-row dense no-gutters :style="computedRowWidthSortDate">
              <v-btn
                class="mt-2"
                style="border-color:gray; width:100%"
                text
                outlined
                @click="sortByDate()"
              >
                更新日
                <v-icon>
                  {{ computedSortButtonIcon }}
                </v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-card>

    <span>Total: {{ computedAllData.length }}</span>

    <v-progress-linear
      v-if="!loading"
      :active="!loading"
      color="#1565c0"
      indeterminate
      rounded
      height="6"
    ></v-progress-linear>
    <v-card
      v-else
      flat
      dense
      style="overflow-y: scroll"
      class="pa-1"
      :height="
        hideFilter
          ? $vuetify.breakpoint.height - 375
          : $vuetify.breakpoint.height - 280
      "
    >
      <v-card v-for="(item, i) in pageData" :key="i" flat>
        <v-divider></v-divider>

        <v-row dense style="cursor:pointer">
          <v-col lg="6" md="12" sm="12" cols="12">
            <div id="id-title" class="ma-2;">
              <v-icon color="#f55666" style="cursor:context-menu">
                mdi-file-document
              </v-icon>
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
                <span v-if="favoriteUsers.includes(item._id)"
                  >Remove Favorite</span
                >
                <span v-else>Add Favorite</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on" @click="viewRuleContent(item)">
                    {{ item._id }} - {{ item.title }}
                  </span>
                </template>
                <span>{{item.title}}</span>
              </v-tooltip>
            </div>
            <span
              v-if="item.content"
              class="title"
              v-html="`${item.content}`"
              style="color: #555555; margin-left: 30px; font-size: 12px"
            >
            </span>
          </v-col>
          <v-col v-if="item.method" lg="1" md="2" sm="6" cols="4">
            <v-chip small dark color="#424874" class="mt-2">
              <span id="id-center">
                <span v-if="item.method">
                  <span v-if="item.method == 'JIKU'">
                    軸組
                  </span>
                  <span v-if="item.method == 'WAKU'">
                    枠組
                  </span>
                  <span v-if="item.method == 'WAKU/JIKU'">
                    軸組 枠組
                  </span>
                </span>
              </span>
            </v-chip>
          </v-col>
          <v-col v-if="item.criteria" lg="1" md="2" sm="6" cols="4">
            <v-chip small dark color="#e36387" class="mt-2">
              <span id="id-center"> {{ item.criteria }}</span>
            </v-chip>
          </v-col>
          <v-col v-if="item.productType" lg="1" md="2" sm="6" cols="4">
            <v-chip small dark color="#5c969e" class="mt-2">
              <span id="id-center"> {{ item.productType }}</span>
            </v-chip>
          </v-col>
          <v-col v-if="!item.category" lg="1" md="2" sm="6" cols="4">
            <v-chip small dark color="#3d7ea6" class="mt-2">
              <span id="id-center">
                {{ item.RulebookUpdatedDate }}
              </span>
            </v-chip>
          </v-col>

          <v-col lg="1" md="2" sm="6" cols="4">
            <v-chip small dark color="#4382BB" class="mt-2">
              <span id="id-center">
                {{ item.countViews }}
                <v-icon small>mdi-eye</v-icon>
              </span>
            </v-chip>
          </v-col>
          <v-col lg="1" md="2" sm="6" cols="4">
            <v-chip small dark color="#26474E" class="mt-2">
              <span id="id-center">
                {{ item.countFavorites }}
                <v-icon small>mdi-star</v-icon>
              </span>
            </v-chip>
          </v-col>
          <!-- <v-col v-if="item.category" lg="1" md="2" sm="4" cols="12"> </v-col>
          <v-col v-if="item.category" lg="1" md="2" sm="4" cols="12"> </v-col>
          <v-col v-if="item.category" lg="1" md="2" sm="4" cols="12">
            <v-chip small dark color="#5c969e" class="mt-2">
              <span id="id-center">
                {{ item.category }}
              </span>
            </v-chip>
          </v-col>
          <v-col v-if="item.category" lg="1" md="2" sm="4" cols="12">
            <v-chip small dark color="#3d7ea6" class="mt-2">
              <span id="id-center">
                {{ item.memoUpdatedDate }}
              </span>
            </v-chip>
          </v-col> -->
        </v-row>
      </v-card>
    </v-card>
    <v-pagination
      v-if="loading"
      v-model="pageNumber"
      :length="pageLength"
      :total-visible="5"
      dark
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
    ></v-pagination>
  </v-container>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import moji from "moji";

export default {
  data() {
    return {
      title_spacer: '　',
      memoData: [],
      rulebookData: [],
      allData: [],
      pageNumber: 1,
      pageRow: 30,
      hideFilter: false,
      searchLists: [],
      searchText: "",
      exceptText: "",
      selectedCondition: "OR",

      sortByProductTypeASC: false,
      sortByMethodASC: false,
      sortByCriteriaASC: false,
      sortByDateASC: false,
      sortByFavoriteASC: false,

      enableSortByProductType: false,
      enableSortByMethod: false,
      enableSortByCriteria: false,
      enableSortByFavorite: false,

      productTypeList: [
        "ALL",
        "外部付帯",
        "サッシ",
        "システムバス",
        "その他",
        "出窓",
        "バルコニー",
        "和室造作/建具/出窓",
        "階段",
        "建具",
        "構造",
        "収納",
        "住設",
        "設備",
        "太陽光",
        "夢の家",
        "免震",
        "洋室造作",
        "洋室造作/和室造作",
        "和室造作",
        "洋室造作/和室造作/建具",
      ],
      selectedproductType: "ALL",

      methodList: [
        { text: "ALL", value: "ALL" },
        { text: "軸組", value: "JIKU" },
        { text: "枠組", value: "WAKU" },
      ],
      selectedMethod: "ALL",

      criteriaList: ["ALL", "ルール", "製品仕様", "基本図面", "パターン"],
      selectedCriteria: "ALL",

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
      selectedBuildingType: ["ALL"],

      buildingSpecificationList: [
        { text: "ALL", value: "ALL" },
        { text: "耐震", value: "Taishin" },
        { text: "免震", value: "Menshin" },
      ],
      selectedBuildingSpecification: ["ALL"],
      favoriteUsers: [],
      favoriteColor: false,

      loading: false,
    };
  },
  created() {
    this.loadAllRulebook();
  },
  computed: {
    computedSortButtonIcon() {
      if (this.sortByDateASC) {
        return "mdi-arrow-up-circle-outline";
      } else {
        return "mdi-arrow-down-circle-outline";
      }
    },
    computedSortProductTypeIcon() {
      if (this.sortByProductTypeASC) {
        return "mdi-arrow-up-circle-outline";
      } else {
        return "mdi-arrow-down-circle-outline";
      }
    },
    computedSortMethodIcon() {
      if (this.sortByMethodASC) {
        return "mdi-arrow-up-circle-outline";
      } else {
        return "mdi-arrow-down-circle-outline";
      }
    },
    computedSortCriteriaIcon() {
      if (this.sortByCriteriaASC) {
        return "mdi-arrow-up-circle-outline";
      } else {
        return "mdi-arrow-down-circle-outline";
      }
    },
    computedSortFavoriteIcon() {
      if (this.sortByFavoriteASC) {
        return "mdi-arrow-up-circle-outline";
      } else {
        return "mdi-arrow-down-circle-outline";
      }
    },

    computedFilter() {
      if (
        this.$vuetify.breakpoint.name == "xl" ||
        this.$vuetify.breakpoint.name == "lg"
      ) {
        return "text-align:right;";
      } else {
        return "text-align:left";
      }
    },
    computedSelectWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xl":
          return "width:100%";
        case "lg":
          return "width:100%";
        case "md":
          return "width:100%";
        case "sm":
          return "width:100%";
        default:
          return "width:100%";
      }
    },

    computedRowWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xl":
          return "width:90% ";
        case "lg":
          return "width:90%";
        case "md":
          return "width:90%";
        case "sm":
          return "width:100%";
        default:
          return "width:100%";
      }
    },

    computedRowWidthSortDate() {
      switch (this.$vuetify.breakpoint.name) {
        case "xl":
          return "width:90% ";
        case "lg":
          return "width:90%";
        case "md":
          return "width:100%";
        case "sm":
          return "width:100%";
        default:
          return "width:100%";
      }
    },

    computedButtonWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xl":
          return "border-color:gray; width:90%";
        case "lg":
          return "border-color:gray; width:90%";
        case "md":
          return "border-color:gray; width:90%";
        case "sm":
          if (
            this.$vuetify.breakpoint.width < 833 &&
            this.$vuetify.breakpoint.width > 599
          ) {
            return "border-color:gray; width:95%";
          } else {
            return "border-color:gray; width:96%";
          }
        case "xs":
          if (
            this.$vuetify.breakpoint.width < 600 &&
            this.$vuetify.breakpoint.width > 450
          ) {
            return "border-color:gray; width:93%";
          } else if (
            this.$vuetify.breakpoint.width < 600 &&
            this.$vuetify.breakpoint.width > 450
          ) {
            return "border-color:gray; width:90%";
          } else {
            return "border-color:gray; width:86%";
          }
        default:
          return "border-color:gray; width:90%";
      }
    },

    computedAllData() {
      return this.allData
        .filter((rec) => {
          if (this.selectedproductType != "ALL") {
            return rec.productType == this.selectedproductType;
          } else {
            return rec;
          }
        })
        .filter((rec) => {
          if (this.selectedMethod != "ALL") {
            return rec.method == this.selectedMethod;
          } else {
            return rec;
          }
        })
        .filter((rec) => {
          if (this.selectedCriteria != "ALL") {
            return rec.criteria == this.selectedCriteria;
          } else {
            return rec;
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
          if (this.favoriteColor) {
            return this.favoriteUsers.some((el) => r._id.includes(el));
          } else {
            return r;
          }
        })
        .sort((a, b) => {
          const newA = new Date(a.RulebookUpdatedDate);
          const newB = new Date(b.RulebookUpdatedDate);
          if (this.sortByDateASC) {
            return newA - newB;
          } else {
            return newB - newA;
          }
        })

        .sort((a, b) => {
          if (this.enableSortByProductType) {
            if (this.sortByProductTypeASC) {
              return a.productType > b.productType ? 1 : -1;
            } else if (!this.sortByProductTypeASC) {
              return a.productType < b.productType ? 1 : -1;
            }
          } else {
            return 0;
          }
        })

        .sort((a, b) => {
          if (this.enableSortByMethod) {
            if (this.sortByMethodASC) {
              return a.method > b.method ? 1 : -1;
            } else {
              return a.method < b.method ? 1 : -1;
            }
          } else {
            return 0;
          }
        })

        .sort((a, b) => {
          if (this.enableSortByCriteria) {
            if (this.sortByCriteriaASC) {
              return a.criteria > b.criteria ? 1 : -1;
            } else {
              return a.criteria < b.criteria ? 1 : -1;
            }
          } else {
            return 0;
          }
        })
        .sort((a, b) => {
          if (this.enableSortByFavorite) {
            if (this.sortByFavoriteASC) {
              return a.countFavorites > b.countFavorites ? 1 : -1;
            } else {
              return a.countFavorites < b.countFavorites ? 1 : -1;
            }
          } else {
            return 0;
          }
        });
    },

    pageLength() {
      let l = this.computedAllData.length,
        s = this.pageRow;
      return Math.ceil(l / s);
    },
    pageData() {
      const start = (this.pageNumber - 1) * this.pageRow,
        end = start + this.pageRow;
      return this.computedAllData.slice(start, end);
    },
  },
  watch: {
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
    loadAllMemo() {
      this.memoData = [];
      let url = `${this.awsURL}load_japan_memo`;
      axios.defaults.headers.common["x-api-key"] =
        "H8Pt5n6cbFk95UiXQjwZ9cwu6mcZqfF2rTw3HeS3";
      axios
        .get(url)
        .then((res) => {
          this.memoData = res.data.map((rec) => {
            return {
              id: rec.docNo,
              title: rec.title,
              memoUpdatedDate: rec.memoUpdatedDate,
              category: rec.category,
              attachment: rec.attachment,
            };
          });

          // console.log("MEMO DATA", this.memoData);
        })
        .then(() => {
          this.allData = [...this.memoData, ...this.rulebookData];
          // console.log("ALL DATA", this.allData);
        });
    },
    loadAllRulebook() {
      this.loading = false;
      this.allData = [];

      let url = `${this.api}process/get/rulebook_finaldata`;
      axios
        .get(url)
        .then((res) => {
          this.rulebookData = res.data.toSend.map((rec) => {
            // rec.title.replace(/<\/?[^>]+(>|$)/g, "");
            // if (!rec.countViews) {
            //   rec.countViews = 0;
            // }
            return rec;
          });
        })
        .then(() => {
          let employeeID = "";
          if (this.userInfo.EmployeeNumber) {
            employeeID = this.userInfo.EmployeeNumber;
          }
          if (this.userInfo.employee_code) {
            employeeID = this.userInfo.employee_code;
          }
          axios
            .get(
              `${this.api}document/get/checkfavorites?employeeID=${employeeID}`
            )
            .then((res) => {
              if (res.data.length >= 1) {
                this.favoriteUsers = res.data[0].docs;
              }
            });
        })
        .then(() => {
          this.allData = this.rulebookData;
          this.loading = true;
        });
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
      axios.post(url).then((res) => {
        // console.log(res.data);
        if (res.data == "Added") {
          Swal.fire({
            icon: "success",
            title: "Added to favorites",
            showConfirmButton: false,
            timer: 750,
          });
          this.loadAllRulebook();
        } else {
          Swal.fire({
            icon: "error",
            title: "Removed from favorites",
            showConfirmButton: false,
            timer: 750,
          });
          this.loadAllRulebook();
        }
      });
    },

    sortByProduct() {
      this.sortByProductTypeASC = !this.sortByProductTypeASC;
      this.enableSortByProductType = true;
      this.enableSortByMethod = false;
      this.enableSortByCriteria = false;
    },
    sortByMethod() {
      this.sortByMethodASC = !this.sortByMethodASC;
      this.enableSortByMethod = true;
      this.enableSortByProductType = false;
      this.enableSortByCriteria = false;
    },
    sortByCriteria() {
      this.sortByCriteriaASC = !this.sortByCriteriaASC;
      this.enableSortByCriteria = true;
      this.enableSortByProductType = false;
      this.enableSortByMethod = false;
    },
    sortByDate() {
      this.sortByDateASC = !this.sortByDateASC;
      this.enableSortByCriteria = false;
      this.enableSortByProductType = false;
      this.enableSortByMethod = false;
    },

    sortByFavorite() {
      this.sortByFavoriteASC = !this.sortByFavoriteASC;
      this.enableSortByFavorite = true;
      this.enableSortByCriteria = false;
      this.enableSortByProductType = false;
      this.enableSortByMethod = false;
    },

    //ADD Color of recently Open
    listColorSearch(id) {
      if (this.searchLists.includes(id)) {
        return "viewed";
      }
    },

    // Reset

    resetData() {
      this.searchText = "";
      this.loadAllRulebook();
    },

    // Open Document

    viewRuleContent(val) {
      // console.log(val);
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
      // let index = this.allData.indexOf(val);

      // if (this.allData[index].countViews) {
      //   this.$set(
      //     this.allData[index],
      //     "countViews",
      //     this.allData[index].countViews + 1
      //   );
      // } else {
      //   this.$set(this.googleRules[index], "countViews", 1);
      // }
      axios
        .post(url)
        .then(() => {})
        .catch((err) => console.log(err));
    },

    onSearch() {
      let search = this.convert2FullKatakana(this.searchText);
      this.searchLists = [];
      if (this.searchText != "") {
        this.loading = false;
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
          // console.log("aaaaa", url);
        } else {
          url = `${this.api}search/get/content/and?search=${search}&except=${this.exceptText}`;
        }
        // console.log(url)
        axios.get(url).then((res) => {
          this.allData = res.data.map((rec) => {
            if (!rec.RulebookUpdatedDate) {
              rec.RulebookUpdatedDate = "";
            }
            if (!rec.countViews) {
              rec.countViews = 0;
            }
            return rec;
          });
          this.allData.sort((a, b) => (a.countViews < b.countViews ? 1 : -1));

          this.loading = true;
        });
      } else {
        this.allData = [];
      }
    },

    onMultipleSearch() {
      this.loading = false;
      let search = this.convert2FullKatakana(this.searchText);
      this.searchLists = [];
      if (this.searchText != "") {
        // this.loadingCondition = true;
      }

      if (this.searchText) {
        let url = "";
        url = `${this.api}search/get/content/multiple?search=${search}&except=${this.exceptText}`;
        // console.log(url)
        axios.get(url).then((res) => {
          if (typeof res.data != "string") {
            this.allData = res.data.map((rec) => {
              if (!rec.RulebookUpdatedDate) {
                rec.RulebookUpdatedDate = "";
              }
              return rec;
            });
            this.allData.sort((a, b) => (a.countViews < b.countViews ? 1 : -1));
            this.loading = true;
          } else {
            // this.loadingCondition = true;
            this.loading = true;
            this.selectedCondition = "OR";
            this.onSearch();
          }
        });
      } else {
        this.allData = [];
      }
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
  },
};
</script>

<style scoped>
#id-title {
  font-size: 20px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#id-center {
  width: 100%;
  display: table;
  table-layout: fixed;
  text-align: center;
}

.viewed {
  background-color: white;
  color: purple;
}

.title {
  display: inline-block;
  width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px !important;
}

.test_cursor input {
  cursor: pointer;
}
</style>
