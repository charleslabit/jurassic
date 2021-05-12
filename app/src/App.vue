<template>
  <v-app id="inspire">
    <v-app-bar
      app
      clipped-left
      v-if="
        $router.currentRoute.name != 'Login' &&
          $router.currentRoute.name != 'Document' &&
          $router.currentRoute.name != 'Assign-In-Charge' &&
          $router.currentRoute.name != 'Edit Document' &&
          $router.currentRoute.name != 'Editor' &&
          $router.currentRoute.name != 'Remarks' &&
          $router.currentRoute.name != 'Initial Document'
      "
    >
      <v-toolbar-title>
        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" class="hidden-lg-and-up">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in DrawerItems"
              :key="i"
              :to="item.route"
            >
              <v-list-item-icon>
                <v-icon>
                  {{ item.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <span v-if="$vuetify.breakpoint.width >= '361'">
          <span style="color: #1565c0">Document</span>
          <span>
            Search System
          </span>
        </span>
        <span v-else>
          <v-icon color="#1565c0">
            mdi-book-search-outline
          </v-icon>
        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-tooltip bottom v-if="$router.currentRoute.name != 'User Manual'">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon @click="openUserManual()">
            <v-icon color="#1565c0">mdi-book-information-variant</v-icon>
          </v-btn>
        </template>
        <span>Manual</span>
      </v-tooltip>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-icon color="#1565c0" v-bind="attrs" v-on="on">mdi-account</v-icon>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon color="#1565c0">mdi-account</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-if="userInfo.full_name">
                  {{ userInfo.full_name }}
                </v-list-item-title>
                <v-list-item-title v-if="userInfo.LastName">
                  {{ userInfo.LastName }}
                </v-list-item-title>
                 <v-list-item-title v-if="userInfo.nameJap">
                  {{ userInfo.nameJap }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text @click="menu = false">
              Cancel
            </v-btn>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  color="#1565c0"
                  text
                  @click="deleteInfo()"
                >
                  Logout
                </v-btn>
              </template>
              <span>Logout</span>
            </v-tooltip>
          </v-card-actions>

          <v-divider></v-divider>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      v-if="
        $router.currentRoute.name != 'Login' &&
          $router.currentRoute.name != 'Document' &&
          $router.currentRoute.name != 'Assign-In-Charge' &&
          $router.currentRoute.name != 'Edit Document' &&
          $router.currentRoute.name != 'Editor' &&
          $router.currentRoute.name != 'Remarks' &&
          $router.currentRoute.name != 'Initial Document'
      "
      clipped
      expand-on-hover
      app
    >
      <v-list dense>
        <v-list-item-group v-model="selected" active-class="light-blue--text">
          <v-list-item
            link
            v-for="(item, i) in DrawerItems"
            :key="i"
            :to="item.route"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    title_spacer: "　",
    selected: 0,
    loading: false,
    RNDitems: [
      { title: "Home", icon: "mdi-home", route: "/" },
      { title: "Schedule", icon: "mdi-clock-outline", route: "/schedule" },
      {
        title: "Rulebook Documents",
        icon: "mdi-file-clock-outline",
        route: "/documents",
      },
      { title: "Final Data", icon: "mdi-file-document", route: "/final_data" },
      {
        title: "Obsolete Documents",
        icon: "mdi-recycle-variant",
        route: "/obsolete",
      },
      {
        title: "Master Maintenance",
        icon: "mdi-cogs",
        route: "/maintenance",
      },
    ],
    tinaItems: [
      { title: "Home", icon: "mdi-home", route: "/" },
      { title: "Schedule", icon: "mdi-clock-outline", route: "/schedule" },
      {
        title: "Rulebook Documents",
        icon: "mdi-file-clock-outline",
        route: "/documents",
      },
      { title: "Final Data", icon: "mdi-file-document", route: "/final_data" },
      {
        title: "Obsolete Documents",
        icon: "mdi-recycle-variant",
        route: "/obsolete",
      },
      {
        title: "Ms. Tina",
        icon: "mdi-file-document-edit-outline",
        route: "/tina",
      },
    ],
    charlesItems: [
      { title: "Home", icon: "mdi-home", route: "/" },
      { title: "Schedule", icon: "mdi-clock-outline", route: "/schedule" },
      {
        title: "Rulebook Documents",
        icon: "mdi-file-clock-outline",
        route: "/documents",
      },
      { title: "Final Data", icon: "mdi-file-document", route: "/final_data" },
      {
        title: "Obsolete Documents",
        icon: "mdi-recycle-variant",
        route: "/obsolete",
      },
      {
        title: "Master Maintenance",
        icon: "mdi-cogs",
        route: "/maintenance",
      },
      // {
      //   title: "Master Maintenance",
      //   icon: "mdi-cog",
      //   route: "/incharge_setting",
      // },
    ],
    useritems: [
      { title: "Home", icon: "mdi-home", route: "/" },
      {
        title: "Department In-Charge",
        icon: "mdi-lead-pencil",
        route: "/department_incharge",
      },
    ],
  }),
  created() {
    setTimeout(() => {
      this.getSelectedRoute();
    }, 850);
  },
  methods: {
    openUserManual() {
      window.open(`usermanual`, `_blank`);
    },
    getSelectedRoute() {
      if (this.$router.currentRoute.name == "Home") {
        this.selected = 0;
      } else if (this.$router.currentRoute.name == "Schedule") {
        this.selected = 1;
      } else if (this.$router.currentRoute.name == "Documents") {
        this.selected = 2;
      } else if (this.$router.currentRoute.name == "Update Document") {
        this.selected = 3;
      } else if (this.$router.currentRoute.name == "Obsolete Documents") {
        this.selected = 4;
      } else if (
        this.$router.currentRoute.name == "Assign In-Charge Maintenance"
      ) {
        this.selected = 5;
      } else if (this.$router.currentRoute.name == "Tina") {
        this.selected = 6;
      }
    },
  },
  computed: {
    DrawerItems() {
      if (this.isRND()) {
        return this.RNDitems;
      } else if (this.userInfo.employee_code == "35339") {
        return this.charlesItems;
      } else if (this.userInfo.employee_code == "14574") {
        return this.tinaItems;
      } else {
        return this.useritems;
      }
    },
  },

  mounted() {},
};
</script>

<style>
div.ant-tabs-bar {
  margin: 0 !important;
  padding: 0;
}

a[href="https://www.froala.com/wysiwyg-editor?k=u"] {
  font-size: 0px !important;
  padding: 0px !important;
  height: 0px !important;
}

.fr-view {
  font-family: "MS PGothic", Osaka, Arial, sans-serif;
  font-size: 18px;
}
.disabled {
  pointer-events: none;
}
</style>
