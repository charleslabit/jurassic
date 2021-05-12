import Vue from "vue";
import App from "./App.vue";
import router from "./router.js";
import store from "./store.js";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import "ant-design-vue/dist/antd.css";
import { DatePicker } from "ant-design-vue";
import myPlugin from "./plugins/myMixins";
import Antd from "ant-design-vue";
// //Import Froala Editor 
// import 'froala-editor/js/plugins.pkgd.min.js';
// //Import third party plugins
// import 'froala-editor/js/third_party/embedly.min';
// import 'froala-editor/js/third_party/font_awesome.min';
// import 'froala-editor/js/third_party/spell_checker.min';
// import 'froala-editor/js/third_party/image_tui.min';
// // Import Froala Editor css files.
// import 'froala-editor/js/plugins/code_view.min.js'
// import 'froala-editor/css/plugins/code_view.min.css'
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import "froala-editor/js/plugins/font_family.min.js";


import $ from "jquery";
window.$ = $;



// import "froala-editor/js/plugins/table.min.js";

// Import and use Vue Froala lib.
import VueFroala from 'vue-froala-wysiwyg'
require("froala-editor/js/froala_editor.pkgd.min.js");
// require('froala-editor/js/third_party/image_aviary.min.js')
require("froala-editor/js/plugins/draggable.min.js");
require("froala-editor/js/plugins/image.min.js");
require("froala-editor/js/plugins/font_family.min.js");
require("froala-editor/js/plugins/url.min.js");
require("froala-editor/js/plugins/link.min.js");

// require("froala-editor/js/third_party/image_tui.min.js")

// Require Froala Editor css files.
require("froala-editor/css/froala_editor.pkgd.min.css");
require("font-awesome/css/font-awesome.css");
require("froala-editor/css/froala_style.min.css");
require("froala-editor/css/plugins/draggable.min.css");
require("froala-editor/css/plugins/image.min.css");
require("froala-editor/css/themes/red.min.css");
require("froala-editor/css/themes/dark.min.css");
Vue.use(VueFroala)





Vue.use(Antd);
Vue.use(myPlugin);
Vue.use(DatePicker);

import VueTheMask from "vue-the-mask";
Vue.use(VueTheMask);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");


