<template>
  <v-container pa-0 fluid>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="All Documents">
        <AllDocuments></AllDocuments>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Rulebook">
        <RulebookData></RulebookData>
      </a-tab-pane>

      <a-tab-pane key="3" tab="Japan Memo">
        <JapanMemo> </JapanMemo>
      </a-tab-pane>
      <a-tab-pane key="4" tab="JWW/DXF">
        <JWWDXF></JWWDXF>
      </a-tab-pane>
    </a-tabs>
  </v-container>
</template>

<script>
import AllDocuments from "../components/AllDocuments.vue";
import JapanMemo from "../components/JapanMemo.vue";
import JWWDXF from "../components/JWWDXF.vue";
import RulebookData from "../components/RulebookData.vue";

export default {
  directives: {},
  components: {
    JapanMemo,
    JWWDXF,
    RulebookData,
    AllDocuments,
  },
  data() {
    return {};
  },

  created() {},
  watch: {},
  methods: {},
  computed: {},
};
</script>
