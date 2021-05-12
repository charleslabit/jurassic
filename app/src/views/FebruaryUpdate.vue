<template>
  <v-container class="ma-2 pa-2" fluid>
    <v-toolbar dense flat>
      <v-row dense no-gutters>
        <v-col cols="8">
          <v-text-field dense outlined label="Search" class="mr-1"></v-text-field>
        </v-col>
        <v-col cols=4>
            <v-btn dense color="primary" class="mt-1">New <v-icon>mdi-text-box-plus</v-icon></v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
  </v-container>
</template>
<script>
export default {};
</script>