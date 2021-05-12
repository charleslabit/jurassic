import { mapState, mapMutations } from "vuex";

const myPlugin = {
  install(Vue) {
    Vue.mixin({
      data: () => ({
        api: process.env.VUE_APP_URL,
        api2: process.env.VUE_APP_URL2,
        imageURL: process.env.VUE_APP_URL3,
        linkURL: process.env.VUE_APP_URL4,
        awsURL: process.env.VUE_APP_URL5,
        fileLister: process.env.VUE_APP_URL6,
        screenHeight: window.screen.availHeight,
        screenWidth: window.screen.availWidth,
      }),
      created() {},

      computed: {
        ...mapState([
          "userInfo",
          "selectedRule",
          "tabCondition",
          "expiryDate",
          "isFavCnt",
          // "globalSearchWord",
          // "globalCondition",
          // "isSearchAll",
          // "globalExceptWord",
          "updatedBy"
        ]),

        isLeader() {
          let leader = [
            "Japanese Advisor",
            "Department In-Charge",
            "Department Head Trainee",
            "Department Head",
          ];
          if (leader.includes(this.userInfo.designation)) {
            return true;
          } else {
            return false;
          }
        },
      },
      methods: {
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
        alert(val) {
          alert(val);
        },
        ...mapMutations([
          "ADD_INFO",
          "CHANGE_ITEM",
          "TAB_CND",
          "setExpiryDate",
          "SET_FAVORITE",
          // "UPDATE_SEARCH_ALL",
          // "CHANGE_CONDITION",
          // "CHANGE_SEARCH_WORD",
          // "CHANGE_EXCEPT_WORD",
          "UPDATED_BY"
        ]),
        deleteInfo: function() {
          this.ADD_INFO("a");
          this.UPDATED_BY("")
          this.$router.push("/login");
        },
        selectRule: function(val) {
          this.CHANGE_ITEM(val);
          this.$router.push("/edit_document");
        },

        backHome() {
          this.$router.push("/");
          // this.CHANGE_CONDITION("");
          // this.CHANGE_EXCEPT_WORD("");
          // this.CHANGE_SEARCH_WORD("");
          // this.UPDATE_SEARCH_ALL(false);
          location.reload();
        },
        backToAll() {
          this.$router.push("/documents");
        },
        // isRND() {
        //   if (
        //     this.userInfo.department == "RESEARCH AND DEVELOPMENT" ||
        //     this.userInfo.workStation == "HRD R&D" ||
        //     this.userInfo.workStation == "SCAD R&D" ||
        //     this.userInfo.workStation == "3RD FACTORY OFFICE" ||
        //     this.userInfo.EmployeeNumber == "0417"
        //   ) {
        //     return true;
        //   } else return false;
        // },
        isRND() {
          if (
            this.userInfo.workStation ||
            this.userInfo.department == "R&D" ||
            this.userInfo.department == "RESEARCH AND DEVELOPMENT" ||
            this.userInfo.EmployeeNumber == "0417" ||
            this.userInfo.employee_code == '35339' ||
            this.userInfo.password == 'ichijo'
          ) {
            return true;
          } else return false;
        },
        isRNDJA() {
          if (
            this.userInfo.workStation == "HRD R&D" ||
            this.userInfo.workStation == "SCAD R&D" ||
            this.userInfo.workStation == "3RD FACTORY OFFICE"
          ) {
            return true;
          } else return false;
        },
      },

      filters: {},
    });
  },
};

export default myPlugin;
