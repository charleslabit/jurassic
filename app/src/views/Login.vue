<template>
  <v-container fluid fill-height>
    <v-row class="justify-center align-center mb-16">
      <v-card class="elevation-8" height="420" width="400">
        <br />
        <v-divider color="black"></v-divider>

        <v-img class="ml-10" src="/logo.png" />
        <v-divider color="black"></v-divider>
        <br />

        <v-card-text>
          <v-form>
            <v-text-field
              tabindex="1"
              autofocus
              prepend-icon="mdi-account"
              name="login"
              label="Employee Code"
              type="text"
              v-model="username"
              color="blue-grey darken-1"
            ></v-text-field>

            <v-text-field
              tabindex="2"
              @keyup.enter="go()"
              id="password"
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              name="password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              color="blue-grey darken-1"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            tabindex="3"
            rounded
            color="#455A64"
            @click.prevent="go()"
            dark
            block
          >
            <v-icon>mdi-login</v-icon>Login
          </v-btn>
        </v-card-actions>
        <!-- <v-layout>s -->
        <!-- <v-spacer></v-spacer>
          <span @click="goHelp()" style="cursor: pointer" class="pr-1">
            <v-icon color="#455A64"> mdi-book-open-page-variant </v-icon>&nbsp;
            <u> User's Manual</u>
          </span> -->
        <!-- </v-layout> -->
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";
import md5 from "md5-hex";
import Swal from "sweetalert2";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      reqInfo: null,
      notJapanUser: false,
      notLocalJapanUser: false,
      notIchijoUser: false,
      loading: false,

      showPassword: false,

      headOfficeUsers: [
        {
          id: "07909",
          nameEng: "Mitsuhiro Sano",
          nameJap: "佐野光浩",
          email: "e-mail:mi-sano@ichijo.co.jp",
          password: "ichijo",
        },
        {
          id: "10266",
          nameEng: "Yuko Okada",
          nameJap: "岡田優子",
          email: "e-mail:yuko-okada@ichijo.co.jp",
          password: "ichijo",
        },
      ],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    pass() {
      return md5(this.password);
    },
  },
  mounted() {},
  methods: {
    goHelp() {
      window.open(
        "http://10.168.64.31:5010/uploads/image/froala/test/Rulebook User Manual.pdf"
      );
    },
    go() {
      if (!this.username) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please Enter User !!",
        });
        return;
      }

      let url = "";
      this.loading = true;
      this.reqInfo = [];

      //HEAD OFFICE
      const hoEmails = this.headOfficeUsers.map((rec) => {
        return rec.email;
      });

      const indexOfUser = hoEmails.indexOf(this.username);
      if (indexOfUser > -1) {
        this.reqInfo = this.headOfficeUsers[indexOfUser];
        if (this.password == this.reqInfo.password) {
          this.ADD_INFO(this.reqInfo);
          this.$router.push("/");
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Incorrect password !!",
          });
        }
        return;
      }
      //HEad OFFICE end

      if (this.username == "ICHIJO") {
        this.username = "99999";
      }
      url = `${this.api}user/get/${this.username}`;
      axios.get(url).then((res) => {
        if (res.data.length > 0) {
          this.reqInfo = res.data;
          if (this.pass == this.reqInfo[0].password) {
            this.ADD_INFO(this.reqInfo[0]);
            const updatedBy = this.userInfo.full_name
              ? this.userInfo.full_name
              : this.userInfo.LastName;
            this.UPDATED_BY(updatedBy);

            this.loading = false;
            this.$router.push("/");
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Wrong Password !!",
            });
            this.loading = false;
          }
        } else {
          axios.defaults.headers.common["x-api-key"] =
            "JUe7mHXOhR6ziaSDHXUDJ310nTfdsH8s1ph44z2q";
          url = `https://1ze9v428i9.execute-api.us-east-2.amazonaws.com/prod/getUsers/${this.username}`;
          axios.get(url).then((res) => {
            if (res.data.EmployeeNumber) {
              this.reqInfo = res.data;
              if (this.pass == md5(this.reqInfo.EmployeeNumber)) {
                this.ADD_INFO(this.reqInfo);
                const updatedBy = this.userInfo.full_name
                  ? this.userInfo.full_name
                  : this.userInfo.LastName;
                this.UPDATED_BY(updatedBy);
                this.loading = false;
                this.$router.push("/");
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Wrong Password !!",
                });
                this.loading = false;
              }
            } else{
              Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Invalid  account !!",
                });
            }
          });
        }
      });
    },

    deleteInfo: function() {
      this.ADD_INFO("");
    },
    ...mapMutations(["ADD_INFO"]),
  },
};
</script>
<style scoped>
.responsive {
  width: 100%;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
