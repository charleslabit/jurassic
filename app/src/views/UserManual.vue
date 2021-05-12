<template>
  <v-container fluid>
    <v-expansion-panels popout class="pt-4" >
      <v-expansion-panel v-for="item in usermanual" :key="item.title">
        <v-expansion-panel-header>
          <span style="font-size:24px; font-weight:bold">{{ item.title }}</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <span style="font-size:20px" v-html="item.content"></span>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import manual from "../../public/UserManual/Manual.js";

export default {
  components: {},
  data() {
    return {
      usermanual: [
        { title: "Schedule Date Manual", content: manual.ScheduleDateManual },
        { title: "Rulebook Editor Manual", content: manual.EditorManual },

        { title: "How to Register?", content: manual.HowToRegister },
        { title: "How to Revise?", content: manual.HowToRevise },
        { title: "How to Obsolete?", content: manual.HowToObsolete },
        { title: "How to Add Remarks?", content: manual.HowToAddRemarks },
        {
          title: "How to Open the Remarks of PDF?",
          content: manual.HowToOpenPDF,
        },
      ],
    };
  },
  methods: {},
  created() {},
};
</script>

<style></style>
