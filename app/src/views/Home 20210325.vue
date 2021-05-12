<template>
  <v-container pa-0 fluid>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="Rulebook Documents">
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
            <a-checkbox :checked="isSearchAll" @change="onChangeCheck">
              Search All
            </a-checkbox>
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
                              @click="
                                isFavorite = !isFavorite;
                                changeFavoriteColor();
                              "
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
                  <v-icon class="ml-1 mt-2" @click="openFilter()"
                    >mdi-filter-menu-outline</v-icon
                  >
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
                  🔽 製品区分:
                </span>
                <span
                  class="mt-2  button"
                  style="font-weight: bold; font-size: 14px"
                  v-else
                  @click="
                    sortByProductTypeDES = true;
                    sortByProductTypeASC = false;
                  "
                  >🔼 製品区分:</span
                >
                <a-select
                  class="mt-2"
                  v-model="selectedproductType"
                  :style="Width"
                >
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
                  🔽 構法:</span
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
                  🔼 構法:</span
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
                  🔽 区分:</span
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
                  🔼 区分:</span
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
                  <v-icon color="white"> mdi-calendar-star </v-icon> 🔽
                </span>
                <span
                  class="button mt-1"
                  v-else
                  @click="
                    sortByFavoriteDES = true;
                    sortByFavoriteASC = false;
                  "
                >
                  <v-icon color="white"> mdi-calendar-star </v-icon> 🔼
                </span>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-on="on"
                      class="mt-2"
                      id="favStyle"
                      @click="
                        isFavorite = !isFavorite;
                        changeFavoriteColor();
                      "
                      type="primary"
                      :style="Width"
                    >
                      <v-icon
                        small
                        :style="isFavorite ? 'color:#ffa62b' : 'color:#214252'"
                        class="mr-1"
                        >{{ isFav }}</v-icon
                      >
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
                <span
                  class="mt-2 border"
                  style="font-weight: bold; font-size: 14px"
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
                <span
                  class="mt-2 border"
                  style="font-weight: bold; font-size: 14px"
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
                  <v-icon color="#f55666" class="ml-2"
                    >mdi-file-document</v-icon
                  >
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
      </a-tab-pane>
      <!-- <a-tab-pane key="2" tab="Shiyou Manual Documents">
      </a-tab-pane> -->
      <a-tab-pane key="2" tab="JWW/DXF Files">
        <v-card class="ma-2 pa-2" flat style="background-color:#f6f5f5;">
          <v-row dense>
            <v-col cols="12" sm="6" md="4">
              <a-input
                addon-before="Search"
                style="width: 100%"
                v-model="toSearchJWW"
                placeholder="Search file"
                append-icon="search"
                outlined
              ></a-input>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-layout row wrap>
                <span style="font-weight: bold" class="mt-1 mr-1">品種:</span>
                <a-select v-model="Variety" :style="WidthFile" id="v-step-f2">
                  <a-select-option
                    v-for="item in OptVariety"
                    :key="item"
                    v-value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </v-layout>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <span style="font-weight: bold" class="mt-1 mr-1"
                >Specifications:</span
              >
              <a-select
                id="v-step-f3"
                mode="multiple"
                v-model="Specifications"
                :style="WidthFile2"
              >
                <a-select-option
                  v-for="item in OptSpecs"
                  :key="item.value"
                  v-value="item.value"
                  >{{ item.text }}</a-select-option
                >
              </a-select>
            </v-col>
            <v-col>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="
                      addFilesDialog = true;
                      toSendJWWFile = {};
                      JWWTitle = 'Register New File';
                    "
                    v-on="on"
                    color="#1565c0"
                    dark
                  >
                    NEW RECORD
                  </v-btn>
                </template>
                <span>Register New File</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card>
        <v-layout>
          <!-- <v-spacer/> -->
          <span style="color:#0f3057; font-weight: bold; margin-right:4px">
            Total: {{ filteredJWW.length }}
          </span>
        </v-layout>

        <v-data-table
          :headers="columns"
          :items="filteredJWW"
          fixed-header
          dense
          :height="screenHeight - 420"
          :items-per-page="20"
        >
          <template v-slot:item.Edit="{ item }">
            <v-icon style="font-size: 18px;" @click="editJWWFile(item)"
              >mdi-file-outline</v-icon
            >
          </template>

          <template v-slot:item.JWWFile="{ item }">
            <span
              @click="FileSrc(item.JWWFile)"
              style="cursor: pointer; color: #3ba9ed"
              >データリンク</span
            >
          </template>
          <template v-slot:item.DXFFile="{ item }">
            <span
              @click="FileSrc(item.DXFFile)"
              style="cursor: pointer; color: #3ba9ed"
              >データリンク</span
            >
          </template>
          <template v-slot:item.Ippan="{ item }">
            <v-icon v-if="item.Ippan" style="font-size: 18px;"
              >mdi-circle-outline</v-icon
            >
          </template>
          <template v-slot:item.YumeNoIe="{ item }">
            <v-icon v-if="item.YumeNoIe" style="font-size: 18px;"
              >mdi-circle-outline</v-icon
            >
          </template>
          <template v-slot:item.G="{ item }">
            <v-icon v-if="item.G" style="font-size: 18px;"
              >mdi-circle-outline</v-icon
            >
          </template>
          <template v-slot:item.F="{ item }">
            <v-icon v-if="item.F" style="font-size: 18px;"
              >mdi-circle-outline</v-icon
            >
          </template>
          <template v-slot:item.A="{ item }">
            <v-icon v-if="item.A" style="font-size: 18px;"
              >mdi-circle-outline</v-icon
            >
          </template>
          <template v-slot:item.B="{ item }">
            <v-icon v-if="item.B" style="font-size: 18px;"
              >mdi-circle-outline</v-icon
            >
          </template>
          <template v-slot:item.iCube="{ item }">
            <v-icon v-if="item.iCube" style="font-size: 18px;"
              >mdi-circle-outline</v-icon
            >
          </template>
          <template v-slot:item.iSmart="{ item }">
            <v-icon v-if="item.iSmart" style="font-size: 18px;"
              >mdi-circle-outline</v-icon
            >
          </template>

          
        </v-data-table>

        <v-dialog v-model="addFilesDialog" max-width="800" persistent>
          <v-card>
            <v-toolbar dense flat>
              <v-toolbar-title>{{ JWWTitle }}</v-toolbar-title>
              <v-spacer />

              <v-icon @click="addFilesDialog = false">mdi-close</v-icon>
            </v-toolbar>
            <v-layout row wrap pt-2>
              <v-flex xs3 sm2 class="pa-1">
                <a-checkbox v-model="toSendJWWFile.Ippan">一般工法</a-checkbox>
              </v-flex>
              <v-flex xs2 sm2 class="pa-1">
                <a-checkbox v-model="toSendJWWFile.YumeNoIe">夢の家</a-checkbox>
              </v-flex>
              <v-flex xs2 sm1 class="pa-1">
                <a-checkbox v-model="toSendJWWFile.G">G</a-checkbox>
              </v-flex>
              <v-flex xs2 sm1 class="pa-1">
                <a-checkbox v-model="toSendJWWFile.F">F</a-checkbox>
              </v-flex>
              <v-flex xs2 sm1 class="pa-1">
                <a-checkbox v-model="toSendJWWFile.A">A</a-checkbox>
              </v-flex>
              <v-flex xs2 sm1 class="pa-1">
                <a-checkbox v-model="toSendJWWFile.B">B</a-checkbox>
              </v-flex>
              <v-flex xs2 sm2 class="pa-1">
                <a-checkbox v-model="toSendJWWFile.iCube">i-cube</a-checkbox>
              </v-flex>
              <v-flex xs2 sm2 class="pa-1">
                <a-checkbox v-model="toSendJWWFile.iSmart">i-smart</a-checkbox>
              </v-flex>
              <v-flex xs12 sm6 class="pa-1">
                <a-input
                  placeholder="ID"
                  v-model="toSendJWWFile._id"
                  :disabled="!toSendJWWFile._rev ? false : true"
                />
              </v-flex>
              <v-flex xs12 sm6 class="pa-1">
                <a-select
                  v-model="toSendJWWFile.variety"
                  style="width: 100%"
                  placeholder="Variety"
                >
                  <a-select-option
                    v-for="item in OptVariety"
                    :key="item"
                    v-value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </v-flex>
              <v-flex xs12 sm6 class="pa-1">
                <a-input placeholder="Hinban" v-model="toSendJWWFile.hinban" />
              </v-flex>
              <v-flex xs12 sm6 class="pa-1">
                <a-input placeholder="Buzai" v-model="toSendJWWFile.buzai" />
              </v-flex>
              <v-flex xs12 sm6 class="pa-1">
                <a-input
                  placeholder="JWW File Path"
                  v-model="toSendJWWFile.JWWFile"
                />
              </v-flex>
              <v-flex xs12 sm6 class="pa-1">
                <a-input
                  placeholder="DXF File Path"
                  v-model="toSendJWWFile.DXFFile"
                />
              </v-flex>
            </v-layout>

            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="SaveJWWFile()">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Japan Memo">
        <JapanMemo> </JapanMemo>
      </a-tab-pane>
    </a-tabs>
  </v-container>
</template>

<script>
const columns = [
  {
    text: "Edit",
    value: "Edit",
    align: "center",
    divider: true,
    width: "5%",
    class: "blue darken-4 white--text",
    sortable: false,
    // dataIndex: "iSmart",
    // scopedSlots: { customRender: "iSmart" },
  },
  {
    // dataIndex: "variety",
    value: "variety",
    text: "品種",
    divider: true,
    width: "25%",
    class: "blue darken-4 white--text",
    sortable: false,
  },
  {
    text: "品番",
    // dataIndex: "hinban",
    value: "hinban",
    divider: true,
    width: "5%",
    class: "blue darken-4 white--text",
    sortable: false,
  },
  {
    text: "部材説明",
    // dataIndex: "buzai",
    value: "buzai",
    divider: true,
    width: "18%",
    class: "blue darken-4 white--text",
    sortable: false,
  },
  {
    text: "JWW",
    value: "JWWFile",
    divider: true,
    width: "13%",
    class: "blue darken-4 white--text",
    sortable: false,
    // dataIndex: "JWWFile",
    // scopedSlots: { customRender: "JWWFile" },
  },
  {
    text: "DXF",
    value: "DXFFile",
    divider: true,
    width: "13%",
    class: "blue darken-4 white--text",
    sortable: false,
    // dataIndex: "DXFFile",
    // scopedSlots: { customRender: "DXFFile" },
  },
  {
    text: "一般工法",
    value: "Ippan",
    divider: true,
    width: "10%",
    align: "center",
    class: "blue darken-4 white--text",
    sortable: false,
    // dataIndex: "Ippan",
    // scopedSlots: { customRender: "Ippan" },
  },
  {
    text: "夢の家",
    value: "YumeNoIe",
    divider: true,
    width: "10%",
    class: "blue darken-4 white--text",
    sortable: false,
    align: "center",
    // dataIndex: "YumeNoIe",
    // scopedSlots: { customRender: "YumeNoIe" },
  },
  {
    text: "G",
    value: "G",
    divider: true,
    width: "7%",
    class: "blue darken-4 white--text",
    sortable: false,
    align: "center",
    // dataIndex: "G",
    // scopedSlots: { customRender: "G" },
  },
  {
    text: "F",
    value: "F",
    divider: true,
    width: "5%",
    class: "blue darken-4 white--text",
    align: "center",
    sortable: false,
    // dataIndex: "F",
    // scopedSlots: { customRender: "F" },
  },
  {
    text: "A",
    value: "A",
    divider: true,
    width: "5%",
    align: "center",
    class: "blue darken-4 white--text",
    sortable: false,
    // dataIndex: "A",
    // scopedSlots: { customRender: "A" },
  },
  {
    text: "B",
    value: "B",
    divider: true,
    width: "5%",
    align: "center",
    class: "blue darken-4 white--text",
    sortable: false,
    // dataIndex: "B",
    // scopedSlots: { customRender: "B" },
  },
  {
    text: "i-cube",
    value: "iCube",
    align: "center",
    divider: true,
    width: "5%",
    class: "blue darken-4 white--text",
    sortable: false,
    // dataIndex: "iCube",
    // scopedSlots: { customRender: "iCube" },
  },
  {
    text: "i-smart",
    value: "iSmart",
    align: "center",
    divider: true,
    width: "5%",
    class: "blue darken-4 white--text",
    sortable: false,
    // dataIndex: "iSmart",
    // scopedSlots: { customRender: "iSmart" },
  },
];

import axios from "axios";
import Swal from "sweetalert2";
import { mask } from "vue-the-mask";
import moji from "moji";
import JapanMemo from "../components/JapanMemo.vue";
import JWWDXF from "../components/JWWDXF.vue"

import AWS from "aws-sdk";
import tunnel from "tunnel";
import config from "../config";
import FileSaver from "file-saver";
import * as binconv from "binconv";

export default {
  directives: {
    mask,
  },
  components: {
    JapanMemo,
    JWWDXF
  },
  data() {
    return {
      hideFilter: true,
      filterMaster: [],
      dataSource: [],
      isvisibleFilter: false,
      isFavorite: false,
      sortByFavoriteASC: false,
      sortByFavoriteDESC: false,
      sortByProductTypeASC: false,
      sortByProductTypeDES: false,
      sortByMethodASC: false,
      sortByMethodDES: false,
      sortByCriteriaASC: false,
      sortByCriteriaDES: false,
      sortByDateASC: false,
      sortByDateDES: false,
      printPreview: false,
      isMultiple: false,
      title_spacer: "　",
      selectedCondition: "",
      pageNumber: 1,
      intRowNoSearchDocument: 30,
      condition: ["OR", "AND", "MULTI"],
      googleRules: [],
      searchGoogle: true,
      toSearch: "",
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
      jwwData: [],

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

      // JWW DATA
      columns,
      toSearchJWW: "",
      Specifications: ["All"],
      OptVariety: [
        "All",
        "エコカラット割り付け図(｢i-cube 240+｣)",
        "エコカラット割り付け図(｢i-cube 260+｣)",
        "エコカラット割り付け図(｢i-smart 240+｣)",
        "エコカラット割り付け図(｢i-smart 260+｣)",
        "エコカラット割り付け図(｢夢の家 240｣)",
        "エコカラット割り付け図(｢夢の家 265｣)",
        "オリジナルテレビボード",
        "玄関上がり框",
        "勾配天井",
        "自在棚",
        "システムクローゼット(ユニット) ケーシング枠",
        "システムパントリー(ユニット)ケーシング枠",
        "白木調造作造作材",
        "スリットウォール",
        "スリットスライダー建具 (洋室)",
        "スリットスライダー建具 (和室)",
        "スリットルーバー",
        "ソリッドウッドパネル",
        "ソロモンマホガニー造作材",
        "タレ壁３方枠（白木調造作）",
        "タレ壁３方枠（白松造作）",
        "タレ壁３方枠（木調造作）",
        "タレ壁３方枠（木調造作/白木調造作）",
        "トータルシステムクローゼット(ウォークインタイプ)",
        "トータルシステムクローゼット(ユニット)",
        "トータルシステムクローゼット(ユニット) ケーシング枠",
        "ブックシェルフ(ユニット))ケーシング枠",
        "フリーカウンター",
        "丸棒手摺金物",
        "ユニット出窓",
        "リモコンニッチ",
        "ロフト",
        "和室建具平面図（白木調造作）",
        "和室建具平面図（白松造作）",
        "和室建具平面図（檜造作）",
        "階段関係",
        "階段関係　（240+）",
        "階段関係　（260+）",
        "掘座卓",
        "高性能樹脂サッシ(Sマホガ二ー造作)",
        "高性能樹脂サッシ(キッチン樹脂枠)",
        "高性能樹脂サッシ(白木調造作)",
        "高性能樹脂サッシ(白松造作)",
        "高性能樹脂サッシ(白松造作・内障子枠)",
        "高性能樹脂サッシ(檜造作)",
        "高性能樹脂サッシ(木調造作)",
        "高性能樹脂サッシ（木調造作/白木調造作）",
        "室内明かりとり",
        "住設",
        "造作材",
        "白松造作造作材",
        "木調造作材",
        "洋室建具平面図（Sマホガニー造作）",
        "洋室建具平面図（木調造作）",
        "洋室建具平面図（木調造作/白木調造作）",
        "檜造作造作材",
      ],
      Variety: "All",
      OptSpecs: [
        { text: "All", value: "All" },
        { text: "一般工法", value: "Ippan" },
        { text: "夢の家", value: "YumeNoIe" },
        { text: "G", value: "G" },
        { text: "F", value: "F" },
        { text: "A", value: "A" },
        { text: "B", value: "B" },
        { text: "i-cube", value: "iCube" },
        { text: "i-smart", value: "iSmart" },
      ],
      addDialog: false,
      addFilesDialog: false,
      toSendJWWFile: {},
      JWWTitle: "",
    };
  },

  created() {
    this.loadingCondition = true;
    this.selectedCondition = "OR";
    this.selectedCriteria = "ALL";
    this.selectedMethod = "ALL";
    this.selectedproductType = "ALL";
    this.loadAllDocs();
    this.loadJWWFile();
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
        window.open(`document/${val._id}?search=${this.searchText}`, "_blank");
      } else if (this.searchText && this.selectedCondition == "MULTI") {
        window.open(
          `document/${val._id}?search=${this.searchText}&multi=true`,
          "_blank"
        );
      } else {
        window.open(`document/${val._id}`, "_blank");
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
          url = `${this.api}get/title_rules?search=${search}&except=${this.exceptText}`;
        } else {
          url = `${this.api}get/title_rules/and?search=${search}&except=${this.exceptText}`;
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
        url = `${this.api}get/multiple_rules?search=${search}&except=${this.exceptText}`;
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
          console.log(this.favoriteUsers);
          if (this.favoriteUsers.length == 0) {
            Swal.fire({
              icon: "error",
              title: "No record found.",
            });
          } else {
            if (this.favoriteColor == 0) {
              this.favoriteColor = 1;
            } else {
              this.favoriteColor = 0;
            }
          }
        });
    },

    // JWW Functions
    loadJWWFile() {
      // axios.defaults.headers.common["x-api-key"] =
      //   "H8Pt5n6cbFk95UiXQjwZ9cwu6mcZqfF2rTw3HeS3";
      let url = `${this.api}getAllFiles?docType=JWW`;
      axios.get(url).then((res) => {
        res.data = res.data.map((rec, index) => {
          rec.key = index;
          return rec;
        });

        this.jwwData = res.data;
        this.jwwData.sort((a, b) => (a._id > b._id ? 1 : -1));
        // console.log(this.jwwData);
      });
    },

    editJWWFile(data) {
      this.JWWTitle = "Edit File Details";
      this.addFilesDialog = true;
      this.toSendJWWFile = Object.assign({}, data);
      console.log(this.toSendJWWFile);
    },

    SaveJWWFile() {
      this.toSendJWWFile.documentType = "JWW";
      let title = "";
      if (!this.toSendJWWFile._rev) {
        title = "Successfully Saved";
      } else {
        title = "Successfully Updated";
      }
      let url = `${this.api}add/docs`;
      axios.post(url, this.toSendJWWFile).then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: title,
          showConfirmButton: false,
          timer: 1500,
        });
        this.addFilesDialog = false;
        this.loadJWWFile();
      });
    },

    FileSrc(filename) {
      // console.log(filename);
      // console.log(filename.substring(filename.length, filename.length - 3));
      var tunnelingAgent = tunnel.httpsOverHttp({
        proxy: {
          // Proxy settings
          host: "hrdproxy.hrd-s.com",
          port: 81,
          proxyAuth: "administrator:system",
        },
      });
      // console.log(tunnelingAgent, "proxy");

      AWS.config.update({
        httpOptions: { agent: tunnelingAgent },
        region: "us-east-2",
        credentials: config,
      });
      var s3 = new AWS.S3({
        // AccessKeyID: "AKIA2FWIWPI5YVES3XEU",
        AccessKeyID: "AKIA2FWIWPI5THZHNWHQ",
        // SecretAccessKey: "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",
        SecretAccessKey: "Dq8KzBreAzA1BOTvKfWCOqjMfxKlPDFJc9JV6T8k",
        Region: "us-east-2",
        params: {
          bucket: "rulebook.files",
        },
      });

      var options = {
        Bucket: "rulebook.files",
        Key: `JWW_Files/${filename}`,
      };
      // console.log(s3, "s3");

      s3.getObject(options, function (err, data) {
        if (err) console.log(err, err.stack);
        // an error occurred
        else {
          // console.log(data);
          var blob = new Blob([binconv.uint8ArrayToBlob(data.Body)], {
            type: `${data.ContentType};charset=utf-8`,
          });

          FileSaver.saveAs(blob, `${filename}`);
        } // successful response
      });
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
    WidthFile() {
      if (this.$vuetify.breakpoint.name == "xs") {
        return "width:87%; margin-left:26px";
      } else return "width:88%";
    },
    WidthFile2() {
      if (this.$vuetify.breakpoint.name == "xs") {
        return "width:80%; ";
      } else return "width: 70%";
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

    filteredSpecs() {
      if (this.jwwData.length > 0) {
        let notAll = this.Specifications == "All";
        return this.jwwData
          .filter((r) => {
            if (this.Variety == "All") {
              return r;
            } else {
              return r.variety == this.Variety;
            }
          })
          .filter((s) => {
            if (this.Specifications == "All") {
              return s;
            } else {
              return [];
            }
          })
          .filter((r) => {
            if (this.Specifications == "Ippan" && !notAll) {
              return r.Ippan;
            } else {
              return [];
            }
          })
          .filter((r) => {
            if (this.Specifications == "YumeNoIe" && !notAll) {
              return r["YumeNoIe"];
            } else {
              return [];
            }
          })
          .filter((r) => {
            if (this.Specifications == "G" && !notAll) {
              return r["G"];
            } else {
              return [];
            }
          })
          .filter((r) => {
            if (this.Specifications == "F" && !notAll) {
              return r["F"];
            } else {
              return [];
            }
          })
          .filter((r) => {
            if (this.Specifications == "A" && !notAll) {
              return r["A"];
            } else {
              return [];
            }
          })
          .filter((r) => {
            if (this.Specifications == "B" && !notAll) {
              return r["B"];
            } else {
              return [];
            }
          })
          .filter((r) => {
            if (this.Specifications == "iCube" && !notAll) {
              return r["iCube"];
            } else {
              return [];
            }
          })
          .filter((r) => {
            if (this.Specifications == "iSmart" && !notAll) {
              return r["iSmart"];
            } else {
              return [];
            }
          });
      } else {
        return [];
      }
    },
    filteredJWW() {
      if (this.filteredSpecs.length > 0) {
        return this.filteredSpecs.filter((data) => {
          let search = new RegExp(this.toSearchJWW.toUpperCase(), "g");
          return JSON.stringify(Object.values(data))
            .toUpperCase()
            .match(search);
        });
      } else {
        return [];
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
  background-color: #01579b;
  border: none;
  cursor: pointer;
  color: white;
  padding: 6px 4px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
#title_ellipsis {
  display: inline-block;
  width: 93%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.title {
  display: inline-block;
  width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px !important;
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
thead.ant-table-thead > tr > th {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  text-align: left;
  color: #fafafa;
  background-color: gray;
  border-bottom: 1px solid #e8e8e8;
  -webkit-transition: background 0.3s ease;
  transition: background 0.3s ease;
}

.border {
  background-color: #01579b;
  border: none;
  color: white;
  padding: 6px 4px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
.disabled {
  pointer-events: none;
}

#mycard {
  /* min-height: calc(100vh - 100px);
  max-height: calc(100vh - 100px); */
  overflow-y: auto;
  overflow-x: auto;
}

#favStyle {
  color: #214252 !important;
  background-color: #fafafa !important;
  height: 30px !important;
  border-radius: 0mm !important;
}

@media only print {
  body {
    overflow: auto;
    height: auto;
  }
  /* #app {
    display: none !important;
  } */
  div.v-toolbar * {
    display: none !important;
  }
  div.v-toolbar__content * {
    display: none !important;
  }
  nav.v-toolbar.elevation-0.theme--light {
    display: none !important;
  }

  div.ant-tabs-nav-scroll * {
    display: none !important;
  }
  div.v-card.v-card--flat.v-sheet.theme--light {
    margin: 0mm;
    padding: 0mm;
  }
}
</style>
