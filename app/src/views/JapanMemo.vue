<template>
  <v-container pa-1 ma-1 fluid>
    <v-layout align-center justify-center v-if="loadingJapanMemo">
      <a-spin class="mt-2" tip="Loading..." />
    </v-layout>
    <v-card class="ma-2 pa-2" flat style="background-color: #f6f5f5" v-else>
      <v-row dense>
        <v-col cols="12" sm="8" md="6">
          <a-input
            addon-before="Search"
            v-model="searchText"
            placeholder="Search memo"
            append-icon="search"
            outlined
          >
            <a-icon
              slot="suffix"
              type="close-circle"
              style="color: rgba(0, 0, 0, 0.45)"
            />
          </a-input>
        </v-col>
        <v-col cols="4" :sm="2" :md="1">
          <a-button class="mx-1" dark type="primary" icon="file-add">
            New
          </a-button>
        </v-col>
      </v-row>
    </v-card>
    <v-card
      flat
      style="overflow-y: scroll"
      :height="screenSize - 270"
      class="ma-1 pa-1"
    >
      <v-card
        elevation="0"
        v-for="(item, i) in paginatedMemo"
        :key="i"
      >
        <v-divider />

        <v-row dense>
          <v-col cols="12" md="8">
            <v-layout>
              <v-icon color="#f55666" class="ml-2">mdi-file-document</v-icon>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span
                    v-on="on"
                    id="title_ellipsis"
                    class="mx-2"
                    style="font-size: 20px; font-weight: bold"
                    v-html="`${item.id} - ${item.title}`"
                  />
                </template>
                <span> {{ item.title }}</span>
              </v-tooltip>
              <!-- <span
                class="title"
                v-if="searchRulebookIconAlignment && isFilterOn"
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
                <span style="font-size: 12px"
                  >{{ item.countFavorites }}
                </span></v-col
              >
            </v-row>
          </v-col>
          <!-- <v-col v-if="!isFilterOn">
            <span
              class="title"
              v-if="searchRulebookIconAlignment"
              v-html="`${item.content}`"
              style="color: #555555; margin-left: 30px; font-size: 12px"
            >
            </span>
          </v-col> -->
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
      v-if="!loadingJapanMemo"
    ></v-pagination>
  </v-container>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      searchText: "",
      pageNumber: 1,
      intRowNoMemo: 30,
      loadingJapanMemo:true,
      memoData: []
    };
  },
  created(){
      this.loadAllMemo()
  },
  methods: {
      loadAllMemo(){
          let url = 'http://10.169.140.132:5000/load_AllMemo'
          axios.get(url).then(res=>{
            this.memoData = res.data
            this.loadingJapanMemo = false
          })
      }
  },
  computed: {
      screenSize(){
          return  this.$vuetify.breakpoint.height;
      },
    filteredMemo(){
        return this.memoData
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
<style  scoped>
#title_ellipsis {
  display: inline-block;
  width: 93%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>