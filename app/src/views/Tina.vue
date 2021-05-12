<template>
  <v-container pa-1 ma-1 fluid>
    <v-row no-gutters dense>
      <v-col cols="8">
        <v-text-field
          outlined
          dense
          label="Search"
          v-model="search"
        ></v-text-field>
      </v-col>
      <v-col cols="4">
          <v-select outlined dense v-model="status" :items="optionStatus" @change="loadAllDocsFinal()"> 
          </v-select>
      </v-col>
    </v-row>
      <v-layout align-center justify-center v-if="loadingDocs">
      <a-spin tip="Loading..."> </a-spin>
    </v-layout>
     <v-list v-else two-line :height="$vuetify.breakpoint.height - 210" style="overflow-y: scroll">
          <template v-for="(item, index) in documentPageData">
            <v-list-item :key="item._id">
              <template>
                <v-icon color="#1565c0" class="mr-2"> mdi-file-document</v-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    <span
                      style="font-size: 18px"
                      v-html="`${item._id} - ${item.title} `"
                    ></span>
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                    <v-btn
                          class="mx-2"
                          fab
                          dark
                          small
                          color="primary"
                          @click="editDocument(item._id)"
                        >
                          <v-icon dark>
                            mdi-file-document-edit
                          </v-icon>
                        </v-btn>
                </v-list-item-action>
              </template>
            </v-list-item>

            <v-divider
              v-if="index < filterDocumentItems.length - 1"
              :key="index"
            ></v-divider>
          </template>
      </v-list>
      <div class="pt-0" align="center">
      <a-pagination
        :pageSize="documentRowNo"
        v-model="documentPageNo"
        :total="filterDocumentItems.length"
        show-less-items
        v-if="filterDocumentItems.length > 0 && !loadingDocs"
      ></a-pagination>
    </div>
  </v-container>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      documentItems: [],
      loadingDocs: false,
      search: "",
      status: "disapproved",
      optionStatus: ['approved','for approval','disapproved','temporary'],
      documentPageNo: 1,
      documentRowNo: 30 
    };
  },
  created() {
      this.loadAllDocsFinal()
  },
  methods: {
       loadAllDocsFinal() {
      this.loadingDocs = true;
      let url = `${this.api}process/get/final_documents?status=${this.status}`;
      axios.get(url).then((res) => {
        this.documentItems = res.data;
        console.log(this.documentItems)
        this.loadingDocs = false;
      });
    },
    editDocument(id){
        console.log(id)
        this.CHANGE_ITEM(id),
        this.$router.push('/editor?kind=After')
    }
  },
  computed:{
    //     screenHeight() {
    //   return this.$vuetify.breakpoint.height;
    // },
      documentPageCount() {
      let l = this.filterDocumentItems.length,
        s = this.documentRowNo;
      return Math.ceil(l / s);
    },
      documentPageData() {
      const start = (this.documentPageNo - 1) * this.documentRowNo,
        end = start + this.documentRowNo;
      return this.filterDocumentItems.slice(start, end);
    },
    filterDocumentItems() {
      return this.documentItems.filter((data) => {
        let search = new RegExp(this.search.toUpperCase(), "g");
        return JSON.stringify(Object.values(data))
          .toUpperCase()
          .match(search);
      });
    }
  }
};
</script>