import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: 'a',
    selectedRule: '',
    tabCondition: 'Search',
    // globalSearchWord: "",
    // globalCondition: "",
    // globalExceptWord: "",
    // isSearchAll: false,
    updatedBy: null
  },
  plugins: [
    createPersistedState()
  ],
  mutations: {
    // UPDATE_SEARCH_ALL: (state, data) => {
    //   // alert(data)
    //   state.isSearchAll = data;
    // },
    // CHANGE_CONDITION: (state, data) => {
    //   state.globalCondition = data;
    // },
    // CHANGE_SEARCH_WORD: (state, data) => {
    //   state.globalSearchWord = data;
    // },
    // CHANGE_EXCEPT_WORD: (state, data) => {
    //   state.globalExceptWord = data;
    // },
    ADD_INFO: (state, data) => {
      state.userInfo = data
    },
    CHANGE_ITEM: (state, data) => {
      state.selectedRule = data
    },
     TAB_CND: (state, data) => {
      state.tabCondition = data
    },
    UPDATED_BY: (state, data) => {
      state.updatedBy = data
    }

  },
  actions: {

  }
})
