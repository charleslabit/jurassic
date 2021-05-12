<template>
  <v-container fluid pa-1 ma-0>
    <v-select v-model="year" style="width: 100%" :items="optYear"> </v-select>

    <v-tabs v-model="tab" background-color="#1565c0" dark>
      <v-tab v-for="(item, i) in tabItems" :key="i">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span v-on="on"
              ><v-icon>{{ item.icon }}</v-icon
              >{{ item.nameJap }}</span
            >
          </template>
          <span>{{ item.name }}</span>
        </v-tooltip>
      </v-tab>
    </v-tabs>
    <span v-if="tab == 0">
      <BEFORETHEMEETING></BEFORETHEMEETING>
    </span>
    <span v-if="tab == 1">
      <AFTERTHEMEETING></AFTERTHEMEETING>
    </span>
    <span v-if="tab == 2">
      <TOUPDATE></TOUPDATE>
    </span>
   
  </v-container>
</template>

<script>
import axios from "axios";
import moment from "moment";
import BEFORETHEMEETING from "../components/RulebookDocuments/BeforeTheMeeting";
import AFTERTHEMEETING from "../components/RulebookDocuments/AfterTheMeeting";
import TOUPDATE from "../components/RulebookDocuments/ToUpdate";

export default {
  components: {
    BEFORETHEMEETING,
    AFTERTHEMEETING,
    TOUPDATE
  },
  data() {
    return {
      year: "",
      yearData: [],
      optYear: [],
      tab: 0,
      tabItems: [
        {
          name: "Email Address",
          nameJap: "メールアドレス",
          icon: "mdi-email-outline",
        },
        {
          name: "Classification",
          nameJap: "区分",
          icon: "mdi-format-list-text",
        },
        {
          name: "Department In-Charge",
          nameJap: "担当部署",
          icon: "mdi-office-building-outline",
        },
        {
          name: "Person In-Charge",
          nameJap: "担当者",
          icon: "mdi-account-circle",
        },
        {
          name: "Product Category",
          nameJap: "製品区分",
          icon: "mdi-shape-outline",
        },
      ],
    };
  },
  mounted() {},
  created() {
    this.loadAllYear();
  },
  watch: {},
  methods: {
    loadAllYear() {
      let year = moment().format("YYYY");
      let url = `${this.api}schedule/get/year`;
      axios.get(url).then((res) => {
        this.optYear = res.data;
        if (this.optYear.includes(year)) {
          this.year = year;
        }
      });
    },
  },
  computed: {},
};
</script>

<style></style>
