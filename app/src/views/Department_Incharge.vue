<template>
  <v-container fluid>
    <div style=" text-align:center" v-if="loading">
      <v-progress-circular
        :size="70"
        :width="7"
        color="#1565c0"
        indeterminate
      ></v-progress-circular>
    </div>

    <v-card flat dense v-else>
      <v-row no-gutters dense>
        <v-col cols="12">
          <v-text-field
            style="width:20%"
            dense
            label="Search Document"
            outlined
            hide-details
            v-model="search"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
      <br />
      <span style="font-weight: bold; font-size: 16px"
        >Total: {{ computedData.length }}</span
      >
      <v-card flat class="mr-3 ml-2">
        <v-list
          two-line
          :height="$vuetify.breakpoint.height - 220"
          style="overflow-y: scroll"
        >
          <template v-for="(item, index) in computedPageData">
            <v-list-item :key="item._id" @click="viewAssignIncharge(item._id)">
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
              </template>
            </v-list-item>

            <v-divider
              v-if="index < computedData.length - 1"
              :key="index"
            ></v-divider>
          </template>
        </v-list>
      </v-card>
    </v-card>
    <v-pagination
      v-if="!loading"
      v-model="pageNo"
      :length="computedPageCount"
      :total-visible="5"
      dark
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
    ></v-pagination>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      pageNo: 1,
      rowNo: 30,
      loading: true,
      search: "",
      finalData: [],
    };
  },
  created() {
    this.loadAllDocsFinal();
  },
  methods: {
    viewAssignIncharge(val) {
      window.open(`incharge_assign/${val}`, `_blank`);
    },

    loadAllDocsFinal() {
      this.loading = true;
      let url = `${this.api}process/get/final_documents?status=approved`;
      axios.get(url).then((res) => {
        this.finalData = res.data;
        this.loading = false;
      });
    },
  },

  computed: {
    computedPageCount() {
      let l = this.computedData.length,
        s = this.rowNo;
      return Math.ceil(l / s);
    },
    computedPageData() {
      const start = (this.pageNo - 1) * this.rowNo,
        end = start + this.rowNo;
      return this.computedData.slice(start, end);
    },

    computedData() {
      return this.finalData.filter((data) => {
        let search = new RegExp(this.search.toUpperCase(), "g");
        return JSON.stringify(Object.values(data))
          .toUpperCase()
          .match(search);
      });
    },
  },
};
</script>
