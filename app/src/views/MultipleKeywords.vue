<template>
  <v-container pa-0 ma-0 fluid>
    <v-layout align-center justify-center v-if="loadingSynonym">
      <a-spin class="mt-2" tip="Loading..." />
    </v-layout>

    <v-card class="ml-1 mr-1 pa-1" flat v-else>
      <a-row>
        <a-col :span="24">
          <a-row :gutter="[0, 3]">
            <a-col :span="24">
              <v-toolbar dense style="background-color: #f6f5f5" flat>
                <v-layout>
                  <v-icon class="mr-1" style="color: #0f3057">
                    mdi-file-document
                  </v-icon>
                  <span style="font-size: 20px; font-weigth: bold"
                    >Multiple Keywords
                  </span>

                  <v-spacer />
                </v-layout>
              </v-toolbar>
            </a-col>
            <a-col :span="24">
              <a-input
                v-model="search"
                addon-before="Search"
                class="mt-1 mb-1"
                style="width:25%"
              ></a-input>

              <a-table
                :columns="header"
                :data-source="synonymPaginatedData"
                bordered
                :scroll="{ x: 1500, y: screenSize - 270 }"
                :pagination="false"
              >
                <span slot="sGroup" slot-scope="sGroup">
                  <a-tag v-for="tag in sGroup" :key="tag" color="blue">
                    {{ tag }}
                  </a-tag>
                </span>
              </a-table>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </v-card>
    <a-row>
      <a-col :span="24">
        <v-pagination
          v-model="synonymPageNo"
          :length="synonymPageCount"
          :total-visible="5"
          dark
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
          v-if="!loadingSynonym"
        ></v-pagination> </a-col
    ></a-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      synonymPageNo: 1,
      rowSynonymCount: 30,
      loadingSynonym: true,
      search: "",
      header: [],
      synonymData: [],
    };
  },
  created() {
    this.loadMultiData();
  },
  computed: {
    synonymPageCount() {
      let l = this.filteredKeywords.length,
        s = this.rowSynonymCount;
      return Math.ceil(l / s);
    },
    synonymPaginatedData() {
      const start = (this.synonymPageNo - 1) * this.rowSynonymCount,
        end = start + this.rowSynonymCount;
      return this.filteredKeywords.slice(start, end);
    },
    filteredKeywords() {
      if (this.search) {
        return this.synonymData.filter((data) => {
          let search = new RegExp(this.search.toUpperCase(), "g");
          return JSON.stringify(Object.values(data))
            .toUpperCase()
            .match(search);
        });
      } else return this.synonymData;
    },

    screenSize() {
      return this.$vuetify.breakpoint.height;
    },
  },
  methods: {
    loadMultiData() {
      this.loadingSynonym = true;
      axios.defaults.headers.common["x-api-key"] =
        "H8Pt5n6cbFk95UiXQjwZ9cwu6mcZqfF2rTw3HeS3";
      let url = `${this.awsURL}get/multidata`;
      axios.get(url).then((res) => {
        let groupName = Object.keys(res.data.data);
        let finalData = groupName.map((rec, index) => {
          let data = {};
          data.key = index;
          data.groupName = rec;
          data.keyword = [];
          res.data.data[rec].map((r) => {
            if (typeof r == "string") {
              data.keyword.push(r);
            } else {
              data.sGroup = r.sGroup;
            }
          });

          return data;
        });
        // console.log(finalData);
        this.synonymData = finalData;
        this.header = [
          {
            title: "Group Name",
            dataIndex: "groupName",
            key: "groupName",
            width: 180,
            fixed: "left",
          },
          {
            title: "Sub Group",
            dataIndex: "sGroup",
            key: "sGroup",
            width: 250,
            fixed: "left",
            scopedSlots: { customRender: "sGroup" },
          },
        ];
        var longest = 0;
        var longestKeyword = [];
        finalData.forEach(function(key) {
          if (key.keyword) {
            if (key.keyword.length > longest) {
              longestKeyword = [key];
              longest = key.keyword.length;
            } else if (key.keyword.length == longest) {
              longestKeyword.push(key);
            }
          }
        });
        // console.log("length");
        for (let i = 0; i < longestKeyword[0].keyword.length; i++) {
          // let toPush = {}
          let toPush = {
            title: `Keyword ${i + 1}`,
            dataIndex: `keyword[${i}]`,
            key: `keyword[${i}]`,
          };

          this.header.push(toPush);
        }
        let action = {
          title: "",
          dataIndex: "action",
          key: "action",
          fixed: "right",
          scopedSlots: { customRender: "action" },
          width: 60,
        };
        this.header.push(action);
        // console.log(this.header);
        this.loadingSynonym = false;
      });
    },
  },
};
</script>

<style scoped>
</style>
