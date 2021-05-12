<template>
  <v-container fluid pa-1 ma-0>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane
        key="1"
        tab="Before the Meeting (Approval)"
        v-model="tabModel"
      >
        <div v-if="!rulecontent">
          <v-layout>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  dense
                  outlined
                  class="pl-3"
                  v-model="toSearchBeforeTheMeeting"
                  append-icon="mdi-magnify"
                  @keypress="intPageNo = 1"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-select
                  dense
                  outlined
                  class="pr-4"
                  :items="selectionBeforeTheMeeting"
                  v-model="selectedBeforeTheMeeting"
                  label="Person in Charge"
                >
                </v-select>
              </v-col>
              <v-col cols="3">
                <a-date-picker
                  v-model="RulebookUpdatedDate"
                  valueFormat="YYYY-MM-DD"
                  size="large"
                >
                </a-date-picker>
              </v-col>
              <v-spacer></v-spacer>
              <span class="mt-2 mr-4"
                ><v-icon color="#1565c0">mdi-file-pdf-outline</v-icon>
                {{ beforeTheMeetingfilteredItem.length }}
              </span>
            </v-row>
          </v-layout>
          <v-list
            style="overflow-y: scroll"
            :height="$vuetify.breakpoint.height - 250"
          >
            <v-layout align-center justify-center v-if="loading" pt-3>
              <a-spin tip="Loading..."> </a-spin>
            </v-layout>

            <template else v-for="(item, i) in beforeTheMeetingData">
              <v-list-item @click="viewRule(item._id)" :key="item._id">
                <v-list-item-action>
                  <v-icon color="#1565c0">mdi-file-document</v-icon>
                </v-list-item-action>

                <v-list-item-title
                  v-text="`${item._id}`"
                  class="font-weight-medium"
                ></v-list-item-title>
              </v-list-item>
              <v-divider
                v-if="i < beforeTheMeetingData.length - 1"
                :key="i"
              ></v-divider>
            </template>
          </v-list>
        </div>

        <v-flex pl-1 v-if="rulecontent">
          <v-card flat>
            <v-toolbar flat>
              <v-toolbar-title class="pr-2">
                {{ viewedRule._id }}
              </v-toolbar-title>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn rounded color="#1565c0" v-bind="attrs" v-on="on">
                    <a
                      style="color: #ffffff"
                      target="_blank"
                      :href="
                        `http://hrdapps48.hrd-s.com:3001/ftp/rule_book/${viewedRule._id}.pdf`
                      "
                    >
                      Open
                      <v-icon>mdi-pdf-box</v-icon>
                    </a>
                  </v-btn>
                </template>
                <span>Open PDF from server</span>
              </v-tooltip>
              <v-spacer></v-spacer>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    rounded
                    dark
                    v-bind="attrs"
                    v-on="on"
                    color="#1565c0"
                    @click="rulecontent = false"
                    >Back</v-btn
                  >
                </template>
                <span>Return to List</span>
              </v-tooltip>
              <template
                v-if="
                  userInfo.designation === 'Japanese Advisor' ||
                    userInfo.employee_code === '00136' ||
                    userInfo.employee_code == '35339' ||
                    userInfo.EmployeeNumber == '0417'
                "
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      style="color: #1565c0"
                      large
                      v-bind="attrs"
                      v-on="on"
                      @click="approvedDialog = true"
                      >mdi-check-decagram</v-icon
                    >
                  </template>

                  <span>Confirmation</span>
                </v-tooltip>
              </template>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    style="color: #1565c0"
                    large
                    v-bind="attrs"
                    v-on="on"
                    @click="
                      historyDialog = true;
                      sortHistory();
                    "
                    >mdi-database-outline</v-icon
                  >
                </template>
                <span>View History</span>
              </v-tooltip>
            </v-toolbar>
            <v-layout row wrap>
              <template class="ma-0 pa-0">
                <v-flex xs12>
                  <a-row type="flex" justify="start">
                    <a-col>
                      <v-btn rounded text class="disabled">
                        メール アドレス:&nbsp;&nbsp;
                        <span
                          v-if="
                            viewedRule.data[viewedRule.version - 1].MailAddress
                          "
                        >
                          {{
                            viewedRule.data[viewedRule.version - 1].MailAddress
                          }}
                        </span>
                        <span v-else>N/A</span>
                      </v-btn>
                    </a-col>
                    <a-col>
                      <v-btn rounded text class="disabled">
                        開始時期:&nbsp;&nbsp;
                        <span
                          v-if="
                            viewedRule.data[viewedRule.data.length - 1]
                              .BeginningPeriod
                          "
                        >
                          {{
                            viewedRule.data[viewedRule.data.length - 1]
                              .BeginningPeriod
                          }}
                        </span>
                        <span v-else>N/A</span>
                      </v-btn>
                    </a-col>
                  </a-row>
                  <a-row type="flex" justify="start">
                    <a-col>
                      <v-btn rounded text class="disabled">
                        システム更新日:&nbsp;&nbsp;
                        <span
                          v-if="
                            viewedRule.data[viewedRule.data.length - 1]
                              .UpdatedDate
                          "
                        >
                          {{
                            viewedRule.data[viewedRule.data.length - 1]
                              .UpdatedDate
                          }}
                        </span>
                        <span v-else>N/A</span>
                      </v-btn>
                    </a-col>
                    <a-col>
                      <v-btn rounded text class="disabled">
                        ルールブック更新日:&nbsp;&nbsp;
                        <span v-if="viewedRule.RulebookUpdatedDate">
                          {{ viewedRule.RulebookUpdatedDate }}
                        </span>
                        <span v-else>N/A</span>
                      </v-btn>
                    </a-col>
                  </a-row>
                </v-flex>
                <v-flex xs3>
                  <v-btn rounded text class="disabled">
                    製品区分&nbsp;-&nbsp;
                    <span v-if="viewedRule.productType">
                      {{ viewedRule.productType }}
                    </span>
                    <span v-else>N/A</span>
                  </v-btn>
                </v-flex>
                <v-flex xs3>
                  <v-btn rounded text class="disabled">
                    担当&nbsp;-&nbsp;
                    <span v-if="viewedRule.data[viewedRule.version - 1].Tantou">
                      {{ viewedRule.data[viewedRule.version - 1].Tantou }}
                    </span>
                    <span v-else>N/A</span>
                  </v-btn>
                </v-flex>

                <v-flex xs3>
                  <v-btn rounded text class="disabled">
                    担当 部署:&nbsp;&nbsp;
                    <span
                      v-if="viewedRule.data[viewedRule.version - 1].TantouBusho"
                    >
                      {{ viewedRule.data[viewedRule.version - 1].TantouBusho }}
                    </span>
                    <span v-else>N/A</span>
                  </v-btn>
                </v-flex>
                <v-flex xs3>
                  <v-btn rounded text class="disabled">
                    適用区分&nbsp;-&nbsp;
                    <span
                      v-if="
                        viewedRule.data[viewedRule.version - 1].TekiyouKubun
                      "
                    >
                      {{ viewedRule.data[viewedRule.version - 1].TekiyouKubun }}
                    </span>
                    <span v-else>N/A</span>
                  </v-btn>
                </v-flex>

                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon
                      v-if="viewedRule.data[viewedRule.version - 1].YumeNoIe"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;夢の家
                  </v-btn>
                </v-flex>
                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon v-if="viewedRule.data[viewedRule.version - 1].Ippan"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;一般
                  </v-btn>
                </v-flex>

                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon v-if="viewedRule.data[viewedRule.version - 1].G"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon
                    >&nbsp;グランド セゾン
                  </v-btn>
                </v-flex>
                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon v-if="viewedRule.data[viewedRule.version - 1].F"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon
                    >&nbsp;セゾンF
                  </v-btn>
                </v-flex>

                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon v-if="viewedRule.data[viewedRule.version - 1].A"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon
                    >&nbsp;セゾンA
                  </v-btn>
                </v-flex>
                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon v-if="viewedRule.data[viewedRule.version - 1].B"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon
                    >&nbsp;ブリアール
                  </v-btn>
                </v-flex>
                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon
                      v-if="viewedRule.data[viewedRule.version - 1]['F2-TD']"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon
                    >&nbsp;セゾンF2-TD
                  </v-btn>
                </v-flex>

                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon v-if="viewedRule.data[viewedRule.version - 1].Icube"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;Icube
                  </v-btn>
                </v-flex>

                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon
                      v-if="viewedRule.data[viewedRule.version - 1].Ismart"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;Ismart
                  </v-btn>
                </v-flex>

                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon
                      v-if="viewedRule.data[viewedRule.version - 1].Ismile"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;Ismile
                  </v-btn>
                </v-flex>

                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon
                      v-if="viewedRule.data[viewedRule.version - 1].Taishin"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;耐震
                  </v-btn>
                </v-flex>
                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon
                      v-if="viewedRule.data[viewedRule.version - 1].Menshin"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;免震
                  </v-btn>
                </v-flex>

                <v-flex xs12>
                  <v-layout pl-4>
                    <p style="font-size: 18px">件名: &nbsp;</p>
                    <p>
                      <span
                        style="font-size: 18px; padding-top: 0"
                        v-html="
                          viewedRule.data[viewedRule.version - 1].RuleKenmei
                        "
                      ></span>
                    </p>
                  </v-layout>
                  <br />
                  <hr />
                </v-flex>
                <v-flex
                  v-for="(item, index) in viewedRule.data[
                    viewedRule.version - 1
                  ].content"
                  :key="index"
                >
                  <v-card flat>
                    <v-card-text class="fr-view" v-html="item"></v-card-text>
                  </v-card>
                </v-flex>
              </template>
            </v-layout>
          </v-card>
        </v-flex>
        <v-pagination
          v-model="intPageNo"
          :length="pageCountOfBeforeMeeting"
          :total-visible="5"
          dark
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
        ></v-pagination>
      </a-tab-pane>

      <a-tab-pane
        key="2"
        tab="Before the Meeting (Approved)"
        v-model="tabModel"
      >
        <v-layout align-center justify-center v-if="loading" pt-3>
          <a-spin tip="Loading..."> </a-spin>
        </v-layout>

        <div v-if="!rulecontent">
          <v-row>
            <v-text-field
              dense
              outlined
              class="pl-3"
              v-model="toSearchBeforeTheMeeting"
              append-icon="mdi-magnify"
              @keypress="intPageNo = 1"
            ></v-text-field>
            <v-select
              dense
              outlined
              class="pr-4"
              :items="selectionBeforeTheMeeting"
              v-model="selectedBeforeTheMeeting"
              label="Person in Charge"
            >
            </v-select>
            <v-spacer></v-spacer>
            <span class="mt-2 mr-4"
              ><v-icon color="#1565c0">mdi-file-pdf-outline</v-icon>
              {{ beforeTheMeetingfilteredItem.length }}
            </span>
          </v-row>
          <v-list
            style="overflow-y: scroll"
            :height="$vuetify.breakpoint.height - 250"
          >
            <template else v-for="(item, i) in beforeTheMeetingData">
              <v-list-item @click="viewRule(item._id)" :key="item._id">
                <v-list-item-action>
                  <v-icon color="#1565c0">mdi-file-document</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title
                    v-text="`${item._id}`"
                    class="font-weight-medium"
                  >
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="tabModel == 2">
                    CHECKED BY:
                    {{ item.approver[0].name }} -
                    {{ item.approver[0].updatedDate }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <span v-if="item.isFinishedBeforeTheMeeting && tabModel == 2">
                  APPROVED BY:
                  {{ item.approver[item.approver.length - 1].name }} -
                  {{ item.approver[item.approver.length - 1].updatedDate }}

                  <v-list-item-icon>
                    <v-icon color="blue">
                      mdi-check-bold
                    </v-icon>
                  </v-list-item-icon>
                </span>
              </v-list-item>
              <v-divider
                v-if="i < beforeTheMeetingData.length - 1"
                :key="i"
              ></v-divider>
            </template>
          </v-list>
        </div>

        <v-flex pl-1 v-if="rulecontent">
          <v-card flat>
            <v-toolbar flat>
              <v-toolbar-title class="pr-2">
                {{ viewedRule._id }}
              </v-toolbar-title>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn rounded color="#1565c0" v-bind="attrs" v-on="on">
                    <a
                      style="color: #ffffff"
                      target="_blank"
                      :href="
                        `http://hrdapps48.hrd-s.com:3001/ftp/rule_book/${viewedRule._id}.pdf`
                      "
                    >
                      Open
                      <v-icon>mdi-pdf-box</v-icon>
                    </a>
                  </v-btn>
                </template>
                <span>Open PDF from server</span>
              </v-tooltip>
              <v-spacer></v-spacer>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    rounded
                    dark
                    v-bind="attrs"
                    v-on="on"
                    color="#1565c0"
                    @click="rulecontent = false"
                    >Back</v-btn
                  >
                </template>
                <span>Return to List</span>
              </v-tooltip>
              <template
                v-if="
                  !viewedRule.isFinishedBeforeTheMeeting &&
                    (userInfo.designation === 'Japanese Advisor' ||
                      userInfo.employee_code === '00136' ||
                      userInfo.employee_code == '35339' ||
                      userInfo.EmployeeNumber == '0417')
                "
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      style="color: #1565c0"
                      large
                      v-bind="attrs"
                      v-on="on"
                      @click="approvedDialog = true"
                      >mdi-check-decagram</v-icon
                    >
                  </template>

                  <span>Confirmation</span>
                </v-tooltip>
              </template>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    style="color: #1565c0"
                    large
                    v-bind="attrs"
                    v-on="on"
                    @click="
                      historyDialog = true;
                      sortHistory();
                    "
                    >mdi-database-outline</v-icon
                  >
                </template>
                <span>View History</span>
              </v-tooltip>
            </v-toolbar>
            <v-layout row wrap>
              <template class="ma-0 pa-0">
                <v-flex xs12>
                  <a-row type="flex" justify="start">
                    <a-col>
                      <v-btn rounded text class="disabled">
                        メール アドレス:&nbsp;&nbsp;
                        <span
                          v-if="
                            viewedRule.data[viewedRule.version - 1].MailAddress
                          "
                        >
                          {{
                            viewedRule.data[viewedRule.version - 1].MailAddress
                          }}
                        </span>
                        <span v-else>N/A</span>
                      </v-btn>
                    </a-col>
                    <a-col>
                      <v-btn rounded text class="disabled">
                        開始時期:&nbsp;&nbsp;
                        <span
                          v-if="
                            viewedRule.data[viewedRule.data.length - 1]
                              .BeginningPeriod
                          "
                        >
                          {{
                            viewedRule.data[viewedRule.data.length - 1]
                              .BeginningPeriod
                          }}
                        </span>
                        <span v-else>N/A</span>
                      </v-btn>
                    </a-col>
                  </a-row>
                  <a-row type="flex" justify="start">
                    <a-col>
                      <v-btn rounded text class="disabled">
                        システム更新日:&nbsp;&nbsp;
                        <span
                          v-if="
                            viewedRule.data[viewedRule.data.length - 1]
                              .UpdatedDate
                          "
                        >
                          {{
                            viewedRule.data[viewedRule.data.length - 1]
                              .UpdatedDate
                          }}
                        </span>
                        <span v-else>N/A</span>
                      </v-btn>
                    </a-col>
                    <a-col>
                      <v-btn rounded text class="disabled">
                        ルールブック更新日:&nbsp;&nbsp;
                        <span v-if="viewedRule.RulebookUpdatedDate">
                          {{ viewedRule.RulebookUpdatedDate }}
                        </span>
                        <span v-else>N/A</span>
                      </v-btn>
                    </a-col>
                  </a-row>
                </v-flex>
                <v-flex xs3>
                  <v-btn rounded text class="disabled">
                    製品区分&nbsp;-&nbsp;
                    <span v-if="viewedRule.productType">
                      {{ viewedRule.productType }}
                    </span>
                    <span v-else>N/A</span>
                  </v-btn>
                </v-flex>
                <v-flex xs3>
                  <v-btn rounded text class="disabled">
                    担当&nbsp;-&nbsp;
                    <span v-if="viewedRule.data[viewedRule.version - 1].Tantou">
                      {{ viewedRule.data[viewedRule.version - 1].Tantou }}
                    </span>
                    <span v-else>N/A</span>
                  </v-btn>
                </v-flex>

                <v-flex xs3>
                  <v-btn rounded text class="disabled">
                    担当 部署:&nbsp;&nbsp;
                    <span
                      v-if="viewedRule.data[viewedRule.version - 1].TantouBusho"
                    >
                      {{ viewedRule.data[viewedRule.version - 1].TantouBusho }}
                    </span>
                    <span v-else>N/A</span>
                  </v-btn>
                </v-flex>
                <v-flex xs3>
                  <v-btn rounded text class="disabled">
                    適用区分&nbsp;-&nbsp;
                    <span
                      v-if="
                        viewedRule.data[viewedRule.version - 1].TekiyouKubun
                      "
                    >
                      {{ viewedRule.data[viewedRule.version - 1].TekiyouKubun }}
                    </span>
                    <span v-else>N/A</span>
                  </v-btn>
                </v-flex>

                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon
                      v-if="viewedRule.data[viewedRule.version - 1].YumeNoIe"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;夢の家
                  </v-btn>
                </v-flex>
                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon v-if="viewedRule.data[viewedRule.version - 1].Ippan"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;一般
                  </v-btn>
                </v-flex>

                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon v-if="viewedRule.data[viewedRule.version - 1].G"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon
                    >&nbsp;グランド セゾン
                  </v-btn>
                </v-flex>
                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon v-if="viewedRule.data[viewedRule.version - 1].F"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon
                    >&nbsp;セゾンF
                  </v-btn>
                </v-flex>

                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon v-if="viewedRule.data[viewedRule.version - 1].A"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon
                    >&nbsp;セゾンA
                  </v-btn>
                </v-flex>
                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon v-if="viewedRule.data[viewedRule.version - 1].B"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon
                    >&nbsp;ブリアール
                  </v-btn>
                </v-flex>
                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon
                      v-if="viewedRule.data[viewedRule.version - 1]['F2-TD']"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon
                    >&nbsp;セゾンF2-TD
                  </v-btn>
                </v-flex>

                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon v-if="viewedRule.data[viewedRule.version - 1].Icube"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;Icube
                  </v-btn>
                </v-flex>

                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon
                      v-if="viewedRule.data[viewedRule.version - 1].Ismart"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;Ismart
                  </v-btn>
                </v-flex>

                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon
                      v-if="viewedRule.data[viewedRule.version - 1].Ismile"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;Ismile
                  </v-btn>
                </v-flex>

                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon
                      v-if="viewedRule.data[viewedRule.version - 1].Taishin"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;耐震
                  </v-btn>
                </v-flex>
                <v-flex xs2>
                  <v-btn rounded text class="disabled">
                    <v-icon
                      v-if="viewedRule.data[viewedRule.version - 1].Menshin"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;免震
                  </v-btn>
                </v-flex>

                <v-flex xs12>
                  <v-layout pl-4>
                    <p style="font-size: 18px">件名: &nbsp;</p>
                    <p>
                      <span
                        style="font-size: 18px; padding-top: 0"
                        v-html="
                          viewedRule.data[viewedRule.version - 1].RuleKenmei
                        "
                      ></span>
                    </p>
                  </v-layout>
                  <br />
                  <hr />
                </v-flex>
                <v-flex
                  v-for="(item, index) in viewedRule.data[
                    viewedRule.version - 1
                  ].content"
                  :key="index"
                >
                  <v-card flat>
                    <v-card-text class="fr-view" v-html="item"></v-card-text>
                  </v-card>
                </v-flex>
              </template>
            </v-layout>
          </v-card>
        </v-flex>
        <v-pagination
          v-model="intPageNo"
          :length="pageCountOfBeforeMeeting"
          :total-visible="5"
          dark
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
        ></v-pagination>
      </a-tab-pane>
      <a-tab-pane key="3" tab="After the Meeting (Approval)" v-model="tabModel">
        <v-layout align-center justify-center v-if="loading" pt-3>
          <a-spin tip="Loading..."> </a-spin>
        </v-layout>

        <v-layout v-else class="mt-1">
          <v-flex
            pl-1
            v-if="
              (userInfo.employee_code == 'japanese' ||
                userInfo.employee_code == '00136' ||
                userInfo.employee_code == '35339' ||
                userInfo.EmployeeNumber == '0417' ||
                userInfo.department == 'RESEARCH AND DEVELOPMENT') &&
                !rulecontent
            "
          >
            <v-card>
              <v-row>
                <v-col cols="3">
                  <v-text-field
                    dense
                    outlined
                    class="mr-2 ml-2"
                    :label="
                      docStatus == 'for approval' ? 'For Approval' : docStatus
                    "
                    v-model="toSearch"
                    append-icon="mdi-magnify"
                    @keypress="intPageNo = 1"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-select
                    dense
                    outlined
                    class="pr-4"
                    :items="selectionBeforeTheMeeting"
                    v-model="selectedBeforeTheMeeting"
                    label="Person in Charge"
                    append-outer-icon="mdi-refresh"
                    @click:append-outer="selectedBeforeTheMeeting = 'All'"
                  >
                  </v-select>
                </v-col>
                <!-- <v-col cols="1">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        @click="selectedBeforeTheMeeting = ''"
                        class="pt-2"
                        style="background-color: white"
                        text
                      >
                        <v-icon>
                          mdi-refresh
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>
                      Reset
                    </span>
                  </v-tooltip>
                </v-col> -->
                <v-spacer></v-spacer>
                <span class="mt-2 mr-4"
                  ><v-icon color="#1565c0">mdi-file-pdf-outline</v-icon>
                  {{ afterTheMeetingfilteredItem.length }}
                </span>
              </v-row>
              &emsp;
              <v-list
                style="overflow-y: scroll"
                :height="$vuetify.breakpoint.height - 250"
              >
                <template else v-for="(item, i) in afterTheMeetingData">
                  <v-list-item @click="viewRule(item._id)" :key="item._id">
                    <v-list-item-action>
                      <v-icon color="#1565c0">mdi-file-document</v-icon>
                    </v-list-item-action>

                    <v-list-item-title
                      v-text="`${item._id}${title_spacer}${item.title}`"
                      class="font-weight-medium"
                    ></v-list-item-title>
                  </v-list-item>
                  <v-divider
                    v-if="i < afterTheMeetingData.length - 1"
                    :key="i"
                  ></v-divider>
                </template>
              </v-list>
            </v-card>
            <v-pagination
              v-model="intPageNo"
              :length="pageCountOfAfterMeeting"
              :total-visible="5"
              dark
              prev-icon="mdi-menu-left"
              next-icon="mdi-menu-right"
            ></v-pagination>
          </v-flex>

          <!-- Rulebook Document ViewRuleContent -->

          <v-flex pl-1 v-if="rulecontent">
            <v-card flat>
              <v-toolbar flat>
                <v-toolbar-title class="pr-2">
                  {{ viewedRule._id }}
                </v-toolbar-title>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn rounded color="#1565c0" v-bind="attrs" v-on="on">
                      <a
                        style="color: #ffffff"
                        target="_blank"
                        :href="
                          `http://hrdapps48.hrd-s.com:3001/ftp/rule_book/${viewedRule._id}.pdf`
                        "
                      >
                        Open
                        <v-icon>mdi-pdf-box</v-icon>
                      </a>
                    </v-btn>
                  </template>
                  <span>Open PDF from server</span>
                </v-tooltip>
                <v-spacer></v-spacer>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      rounded
                      dark
                      v-bind="attrs"
                      v-on="on"
                      color="#1565c0"
                      @click="rulecontent = false"
                      >Back</v-btn
                    >
                  </template>
                  <span>Return to List</span>
                </v-tooltip>
                <template
                  v-if="
                    this.userInfo.designation === 'Japanese Advisor' ||
                      this.userInfo.employee_code === '00136' ||
                      userInfo.employee_code == '35339' ||
                      userInfo.EmployeeNumber == '0417'
                  "
                >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        style="color: #1565c0"
                        large
                        v-bind="attrs"
                        v-on="on"
                        @click="approvedDialog = true"
                        >mdi-check-decagram</v-icon
                      >
                    </template>

                    <span>Confirmation</span>
                  </v-tooltip>
                </template>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      style="color: #1565c0"
                      large
                      v-bind="attrs"
                      v-on="on"
                      @click="
                        historyDialog = true;
                        sortHistory();
                      "
                      >mdi-database-outline</v-icon
                    >
                  </template>
                  <span>View History</span>
                </v-tooltip>
              </v-toolbar>
              <v-layout row wrap>
                <template class="ma-0 pa-0">
                  <v-flex xs12>
                    <a-row type="flex" justify="start">
                      <a-col>
                        <v-btn rounded text class="disabled">
                          メール アドレス:&nbsp;&nbsp;
                          <span
                            v-if="
                              viewedRule.data[viewedRule.version - 1]
                                .MailAddress
                            "
                          >
                            {{
                              viewedRule.data[viewedRule.version - 1]
                                .MailAddress
                            }}
                          </span>
                          <span v-else>N/A</span>
                        </v-btn>
                      </a-col>
                      <a-col>
                        <v-btn rounded text class="disabled">
                          開始時期:&nbsp;&nbsp;
                          <span
                            v-if="
                              viewedRule.data[viewedRule.data.length - 1]
                                .BeginningPeriod
                            "
                          >
                            {{
                              viewedRule.data[viewedRule.data.length - 1]
                                .BeginningPeriod
                            }}
                          </span>
                          <span v-else>N/A</span>
                        </v-btn>
                      </a-col>
                    </a-row>
                    <a-row type="flex" justify="start">
                      <a-col>
                        <v-btn rounded text class="disabled">
                          システム更新日:&nbsp;&nbsp;
                          <span
                            v-if="
                              viewedRule.data[viewedRule.data.length - 1]
                                .UpdatedDate
                            "
                          >
                            {{
                              viewedRule.data[viewedRule.data.length - 1]
                                .UpdatedDate
                            }}
                          </span>
                          <span v-else>N/A</span>
                        </v-btn>
                      </a-col>
                      <a-col>
                        <v-btn rounded text class="disabled">
                          ルールブック更新日:&nbsp;&nbsp;
                          <span v-if="viewedRule.RulebookUpdatedDate">
                            {{ viewedRule.RulebookUpdatedDate }}
                          </span>
                          <span v-else>N/A</span>
                        </v-btn>
                      </a-col>
                    </a-row>
                  </v-flex>
                  <v-flex xs3>
                    <v-btn rounded text class="disabled">
                      製品区分&nbsp;-&nbsp;
                      <span v-if="viewedRule.productType">
                        {{ viewedRule.productType }}
                      </span>
                      <span v-else>N/A</span>
                    </v-btn>
                  </v-flex>
                  <v-flex xs3>
                    <v-btn rounded text class="disabled">
                      担当&nbsp;-&nbsp;
                      <span
                        v-if="viewedRule.data[viewedRule.version - 1].Tantou"
                      >
                        {{ viewedRule.data[viewedRule.version - 1].Tantou }}
                      </span>
                      <span v-else>N/A</span>
                    </v-btn>
                  </v-flex>

                  <v-flex xs3>
                    <v-btn rounded text class="disabled">
                      担当 部署:&nbsp;&nbsp;
                      <span
                        v-if="
                          viewedRule.data[viewedRule.version - 1].TantouBusho
                        "
                      >
                        {{
                          viewedRule.data[viewedRule.version - 1].TantouBusho
                        }}
                      </span>
                      <span v-else>N/A</span>
                    </v-btn>
                  </v-flex>
                  <v-flex xs3>
                    <v-btn rounded text class="disabled">
                      適用区分&nbsp;-&nbsp;
                      <span
                        v-if="
                          viewedRule.data[viewedRule.version - 1].TekiyouKubun
                        "
                      >
                        {{
                          viewedRule.data[viewedRule.version - 1].TekiyouKubun
                        }}
                      </span>
                      <span v-else>N/A</span>
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].YumeNoIe"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;夢の家
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Ippan"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;一般
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon v-if="viewedRule.data[viewedRule.version - 1].G"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;グランド セゾン
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon v-if="viewedRule.data[viewedRule.version - 1].F"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;セゾンF
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon v-if="viewedRule.data[viewedRule.version - 1].A"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;セゾンA
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon v-if="viewedRule.data[viewedRule.version - 1].B"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;ブリアール
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1]['F2-TD']"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;セゾンF2-TD
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Icube"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;Icube
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Ismart"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;Ismart
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Ismile"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;Ismile
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Taishin"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;耐震
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Menshin"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;免震
                    </v-btn>
                  </v-flex>

                  <v-flex xs12>
                    <v-layout pl-4>
                      <p style="font-size: 18px">件名: &nbsp;</p>
                      <p>
                        <span
                          style="font-size: 18px; padding-top: 0"
                          v-html="
                            viewedRule.data[viewedRule.version - 1].RuleKenmei
                          "
                        ></span>
                      </p>
                    </v-layout>
                    <br />
                    <hr />
                  </v-flex>
                  <v-flex
                    v-for="(item, index) in viewedRule.data[
                      viewedRule.version - 1
                    ].content"
                    :key="index"
                  >
                    <v-card flat>
                      <v-card-text class="fr-view" v-html="item"></v-card-text>
                    </v-card>
                  </v-flex>
                </template>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </a-tab-pane>
      <a-tab-pane key="4" tab="After the Meeting (Approved)" v-model="tabModel">
        <v-layout align-center justify-center v-if="loading" pt-3>
          <a-spin tip="Loading..."> </a-spin>
        </v-layout>

        <v-layout v-else class="mt-1">
          <v-flex
            pl-1
            v-if="
              (userInfo.employee_code == 'japanese' ||
                userInfo.employee_code == '00136' ||
                userInfo.employee_code == '35339' ||
                userInfo.EmployeeNumber == '0417' ||
                userInfo.department == 'RESEARCH AND DEVELOPMENT') &&
                !rulecontent
            "
          >
            <v-card>
              <v-row dense no-gutters>
                <v-col cols="3">
                  <v-text-field
                    dense
                    outlined
                    class="mr-2 ml-2"
                    :label="
                      docStatus == 'for approval' ? 'For Approval' : docStatus
                    "
                    v-model="toSearch"
                    append-icon="mdi-magnify"
                    @keypress="intPageNo = 1"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-select
                    dense
                    outlined
                    class="pr-4"
                    :items="selectionBeforeTheMeeting"
                    v-model="selectedBeforeTheMeeting"
                    label="Person in Charge"
                    append-outer-icon="mdi-refresh"
                    @click:append-outer="selectedBeforeTheMeeting = 'All'"
                  >
                  </v-select>
                </v-col>

                <v-spacer></v-spacer>
                <span class="mt-2 mr-4"
                  ><v-icon color="#1565c0">mdi-file-pdf-outline</v-icon>
                  {{ afterTheMeetingfilteredItem.length }}
                </span>
              </v-row>

              &emsp;

              <v-list
                style="overflow-y: scroll"
                :height="$vuetify.breakpoint.height - 250"
              >
                <v-flex xs4 offset-xs4 v-if="loading">
                  <div class="text-xs-center">
                    <v-progress-circular
                      :size="50"
                      color="primary"
                      indeterminate
                    ></v-progress-circular>
                  </div>
                </v-flex>
                <template else v-for="(item, i) in afterTheMeetingData">
                  <v-list-item @click="viewRule(item._id)" :key="item._id">
                    <v-list-item-action>
                      <v-icon color="#1565c0">mdi-file-document</v-icon>
                    </v-list-item-action>

                    <v-list-item-title
                      v-text="`${item._id}${title_spacer}${item.title}`"
                      class="font-weight-medium"
                    ></v-list-item-title>
                  </v-list-item>
                  <v-divider
                    v-if="i < afterTheMeetingData.length - 1"
                    :key="i"
                  ></v-divider>
                </template>
              </v-list>
            </v-card>
            <v-pagination
              v-model="intPageNo"
              :length="pageCountOfAfterMeeting"
              :total-visible="5"
              dark
              prev-icon="mdi-menu-left"
              next-icon="mdi-menu-right"
            ></v-pagination>
          </v-flex>

          <!-- Rulebook Document ViewRuleContent -->

          <v-flex pl-1 v-if="rulecontent">
            <v-card flat>
              <v-toolbar flat>
                <v-toolbar-title class="pr-2">
                  {{ viewedRule._id }}
                </v-toolbar-title>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn rounded color="#1565c0" v-bind="attrs" v-on="on">
                      <a
                        style="color: #ffffff"
                        target="_blank"
                        :href="
                          `http://hrdapps48.hrd-s.com:3001/ftp/rule_book/${viewedRule._id}.pdf`
                        "
                      >
                        Open
                        <v-icon>mdi-pdf-box</v-icon>
                      </a>
                    </v-btn>
                  </template>
                  <span>Open PDF from server</span>
                </v-tooltip>
                <v-spacer></v-spacer>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      rounded
                      dark
                      v-bind="attrs"
                      v-on="on"
                      color="#1565c0"
                      @click="rulecontent = false"
                      >Back</v-btn
                    >
                  </template>
                  <span>Return to List</span>
                </v-tooltip>
                <template
                  v-if="
                    (userInfo.designation === 'Japanese Advisor' ||
                      userInfo.employee_code === '00136' ||
                      userInfo.employee_code == '35339' ||
                      userInfo.EmployeeNumber == '0417') &&
                      tabModel != '4'
                  "
                >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        style="color: #1565c0"
                        large
                        v-bind="attrs"
                        v-on="on"
                        @click="approvedDialog = true"
                        >mdi-check-decagram</v-icon
                      >
                    </template>

                    <span>Confirmation</span>
                  </v-tooltip>
                </template>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      style="color: #1565c0"
                      large
                      v-bind="attrs"
                      v-on="on"
                      @click="
                        historyDialog = true;
                        sortHistory();
                      "
                      >mdi-database-outline</v-icon
                    >
                  </template>
                  <span>View History</span>
                </v-tooltip>
              </v-toolbar>
              <v-layout row wrap>
                <template class="ma-0 pa-0">
                  <v-flex xs12>
                    <a-row type="flex" justify="start">
                      <a-col>
                        <v-btn rounded text class="disabled">
                          メール アドレス:&nbsp;&nbsp;
                          <span
                            v-if="
                              viewedRule.data[viewedRule.version - 1]
                                .MailAddress
                            "
                          >
                            {{
                              viewedRule.data[viewedRule.version - 1]
                                .MailAddress
                            }}
                          </span>
                          <span v-else>N/A</span>
                        </v-btn>
                      </a-col>
                      <a-col>
                        <v-btn rounded text class="disabled">
                          開始時期:&nbsp;&nbsp;
                          <span
                            v-if="
                              viewedRule.data[viewedRule.data.length - 1]
                                .BeginningPeriod
                            "
                          >
                            {{
                              viewedRule.data[viewedRule.data.length - 1]
                                .BeginningPeriod
                            }}
                          </span>
                          <span v-else>N/A</span>
                        </v-btn>
                      </a-col>
                    </a-row>
                    <a-row type="flex" justify="start">
                      <a-col>
                        <v-btn rounded text class="disabled">
                          システム更新日:&nbsp;&nbsp;
                          <span
                            v-if="
                              viewedRule.data[viewedRule.data.length - 1]
                                .UpdatedDate
                            "
                          >
                            {{
                              viewedRule.data[viewedRule.data.length - 1]
                                .UpdatedDate
                            }}
                          </span>
                          <span v-else>N/A</span>
                        </v-btn>
                      </a-col>
                      <a-col>
                        <v-btn rounded text class="disabled">
                          ルールブック更新日:&nbsp;&nbsp;
                          <span v-if="viewedRule.RulebookUpdatedDate">
                            {{ viewedRule.RulebookUpdatedDate }}
                          </span>
                          <span v-else>N/A</span>
                        </v-btn>
                      </a-col>
                    </a-row>
                  </v-flex>
                  <v-flex xs3>
                    <v-btn rounded text class="disabled">
                      製品区分&nbsp;-&nbsp;
                      <span v-if="viewedRule.productType">
                        {{ viewedRule.productType }}
                      </span>
                      <span v-else>N/A</span>
                    </v-btn>
                  </v-flex>
                  <v-flex xs3>
                    <v-btn rounded text class="disabled">
                      担当&nbsp;-&nbsp;
                      <span
                        v-if="viewedRule.data[viewedRule.version - 1].Tantou"
                      >
                        {{ viewedRule.data[viewedRule.version - 1].Tantou }}
                      </span>
                      <span v-else>N/A</span>
                    </v-btn>
                  </v-flex>

                  <v-flex xs3>
                    <v-btn rounded text class="disabled">
                      担当 部署:&nbsp;&nbsp;
                      <span
                        v-if="
                          viewedRule.data[viewedRule.version - 1].TantouBusho
                        "
                      >
                        {{
                          viewedRule.data[viewedRule.version - 1].TantouBusho
                        }}
                      </span>
                      <span v-else>N/A</span>
                    </v-btn>
                  </v-flex>
                  <v-flex xs3>
                    <v-btn rounded text class="disabled">
                      適用区分&nbsp;-&nbsp;
                      <span
                        v-if="
                          viewedRule.data[viewedRule.version - 1].TekiyouKubun
                        "
                      >
                        {{
                          viewedRule.data[viewedRule.version - 1].TekiyouKubun
                        }}
                      </span>
                      <span v-else>N/A</span>
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].YumeNoIe"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;夢の家
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Ippan"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;一般
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon v-if="viewedRule.data[viewedRule.version - 1].G"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;グランド セゾン
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon v-if="viewedRule.data[viewedRule.version - 1].F"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;セゾンF
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon v-if="viewedRule.data[viewedRule.version - 1].A"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;セゾンA
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon v-if="viewedRule.data[viewedRule.version - 1].B"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;ブリアール
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1]['F2-TD']"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;セゾンF2-TD
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Icube"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;Icube
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Ismart"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;Ismart
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Ismile"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;Ismile
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Taishin"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;耐震
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Menshin"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;免震
                    </v-btn>
                  </v-flex>

                  <v-flex xs12>
                    <v-layout pl-4>
                      <p style="font-size: 18px">件名: &nbsp;</p>
                      <p>
                        <span
                          style="font-size: 18px; padding-top: 0"
                          v-html="
                            viewedRule.data[viewedRule.version - 1].RuleKenmei
                          "
                        ></span>
                      </p>
                    </v-layout>
                    <br />
                    <hr />
                  </v-flex>
                  <v-flex
                    v-for="(item, index) in viewedRule.data[
                      viewedRule.version - 1
                    ].content"
                    :key="index"
                  >
                    <v-card flat>
                      <v-card-text class="fr-view" v-html="item"></v-card-text>
                    </v-card>
                  </v-flex>
                </template>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </a-tab-pane>
      <a-tab-pane key="5" tab="Obsolete" v-model="tabModel">
        <v-layout align-center justify-center v-if="loading" pt-3>
          <a-spin tip="Loading..."> </a-spin>
        </v-layout>

        <v-layout v-else class="mt-1">
          <v-flex
            pl-1
            v-if="
              (userInfo.employee_code == 'japanese' ||
                userInfo.employee_code == '00136' ||
                userInfo.employee_code == '35339' ||
                userInfo.EmployeeNumber == '0417' ||
                userInfo.department == 'RESEARCH AND DEVELOPMENT') &&
                !rulecontent
            "
          >
            <v-card>
              <v-row dense no-gutters>
                <v-col cols="7">
                  <v-text-field
                    dense
                    outlined
                    class="mr-2 ml-2"
                    :label="
                      docStatus == 'for approval' ? 'For Approval' : docStatus
                    "
                    v-model="toSearch"
                    append-icon="mdi-magnify"
                    @keypress="intPageNo = 1"
                  ></v-text-field>
                </v-col>

                <v-spacer></v-spacer>
                <span class="mt-2 mr-4"
                  ><v-icon color="#1565c0">mdi-file-pdf-outline</v-icon>
                  {{ afterTheMeetingfilteredItem.length }}
                </span>
              </v-row>

              &emsp;

              <v-list
                style="overflow-y: scroll"
                :height="$vuetify.breakpoint.height - 250"
              >
                <template else v-for="(item, i) in afterTheMeetingData">
                  <v-list-item @click="viewRule(item._id)" :key="item._id">
                    <v-list-item-action>
                      <v-icon color="#1565c0">mdi-file-document</v-icon>
                    </v-list-item-action>

                    <v-list-item-title
                      v-text="`${item._id}${title_spacer}${item.title}`"
                      class="font-weight-medium"
                    ></v-list-item-title>
                  </v-list-item>
                  <v-divider
                    v-if="i < afterTheMeetingData.length - 1"
                    :key="i"
                  ></v-divider>
                </template>
              </v-list>
            </v-card>
            <v-pagination
              v-model="intPageNo"
              :length="pageCountOfAfterMeeting"
              :total-visible="5"
              dark
              prev-icon="mdi-menu-left"
              next-icon="mdi-menu-right"
            ></v-pagination>
          </v-flex>

          <!-- Rulebook Document ViewRuleContent -->

          <v-flex pl-1 v-if="rulecontent">
            <v-card flat>
              <v-toolbar flat>
                <v-toolbar-title class="pr-2">
                  {{ viewedRule._id }}
                </v-toolbar-title>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn rounded color="#1565c0" v-bind="attrs" v-on="on">
                      <a
                        style="color: #ffffff"
                        target="_blank"
                        :href="
                          `http://hrdapps48.hrd-s.com:3001/ftp/rule_book/${viewedRule._id}.pdf`
                        "
                      >
                        Open
                        <v-icon>mdi-pdf-box</v-icon>
                      </a>
                    </v-btn>
                  </template>
                  <span>Open PDF from server</span>
                </v-tooltip>
                <v-spacer></v-spacer>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      rounded
                      dark
                      v-bind="attrs"
                      v-on="on"
                      color="#1565c0"
                      @click="rulecontent = false"
                      >Back</v-btn
                    >
                  </template>
                  <span>Return to List</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      style="color: #1565c0"
                      large
                      v-bind="attrs"
                      v-on="on"
                      @click="
                        historyDialog = true;
                        sortHistory();
                      "
                      >mdi-database-outline</v-icon
                    >
                  </template>
                  <span>View History</span>
                </v-tooltip>
              </v-toolbar>
              <v-layout row wrap>
                <template class="ma-0 pa-0">
                  <v-flex xs12>
                    <a-row type="flex" justify="start">
                      <a-col>
                        <v-btn rounded text class="disabled">
                          メール アドレス:&nbsp;&nbsp;
                          <span
                            v-if="
                              viewedRule.data[viewedRule.version - 1]
                                .MailAddress
                            "
                          >
                            {{
                              viewedRule.data[viewedRule.version - 1]
                                .MailAddress
                            }}
                          </span>
                          <span v-else>N/A</span>
                        </v-btn>
                      </a-col>
                      <a-col>
                        <v-btn rounded text class="disabled">
                          開始時期:&nbsp;&nbsp;
                          <span
                            v-if="
                              viewedRule.data[viewedRule.data.length - 1]
                                .BeginningPeriod
                            "
                          >
                            {{
                              viewedRule.data[viewedRule.data.length - 1]
                                .BeginningPeriod
                            }}
                          </span>
                          <span v-else>N/A</span>
                        </v-btn>
                      </a-col>
                    </a-row>
                    <a-row type="flex" justify="start">
                      <a-col>
                        <v-btn rounded text class="disabled">
                          システム更新日:&nbsp;&nbsp;
                          <span
                            v-if="
                              viewedRule.data[viewedRule.data.length - 1]
                                .UpdatedDate
                            "
                          >
                            {{
                              viewedRule.data[viewedRule.data.length - 1]
                                .UpdatedDate
                            }}
                          </span>
                          <span v-else>N/A</span>
                        </v-btn>
                      </a-col>
                      <a-col>
                        <v-btn rounded text class="disabled">
                          ルールブック更新日:&nbsp;&nbsp;
                          <span v-if="viewedRule.RulebookUpdatedDate">
                            {{ viewedRule.RulebookUpdatedDate }}
                          </span>
                          <span v-else>N/A</span>
                        </v-btn>
                      </a-col>
                    </a-row>
                  </v-flex>
                  <v-flex xs3>
                    <v-btn rounded text class="disabled">
                      製品区分&nbsp;-&nbsp;
                      <span v-if="viewedRule.productType">
                        {{ viewedRule.productType }}
                      </span>
                      <span v-else>N/A</span>
                    </v-btn>
                  </v-flex>
                  <v-flex xs3>
                    <v-btn rounded text class="disabled">
                      担当&nbsp;-&nbsp;
                      <span
                        v-if="viewedRule.data[viewedRule.version - 1].Tantou"
                      >
                        {{ viewedRule.data[viewedRule.version - 1].Tantou }}
                      </span>
                      <span v-else>N/A</span>
                    </v-btn>
                  </v-flex>

                  <v-flex xs3>
                    <v-btn rounded text class="disabled">
                      担当 部署:&nbsp;&nbsp;
                      <span
                        v-if="
                          viewedRule.data[viewedRule.version - 1].TantouBusho
                        "
                      >
                        {{
                          viewedRule.data[viewedRule.version - 1].TantouBusho
                        }}
                      </span>
                      <span v-else>N/A</span>
                    </v-btn>
                  </v-flex>
                  <v-flex xs3>
                    <v-btn rounded text class="disabled">
                      適用区分&nbsp;-&nbsp;
                      <span
                        v-if="
                          viewedRule.data[viewedRule.version - 1].TekiyouKubun
                        "
                      >
                        {{
                          viewedRule.data[viewedRule.version - 1].TekiyouKubun
                        }}
                      </span>
                      <span v-else>N/A</span>
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].YumeNoIe"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;夢の家
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Ippan"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;一般
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon v-if="viewedRule.data[viewedRule.version - 1].G"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;グランド セゾン
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon v-if="viewedRule.data[viewedRule.version - 1].F"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;セゾンF
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon v-if="viewedRule.data[viewedRule.version - 1].A"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;セゾンA
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon v-if="viewedRule.data[viewedRule.version - 1].B"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;ブリアール
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1]['F2-TD']"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;セゾンF2-TD
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Icube"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;Icube
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Ismart"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;Ismart
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Ismile"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon
                      >&nbsp;Ismile
                    </v-btn>
                  </v-flex>

                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Taishin"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;耐震
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn rounded text class="disabled">
                      <v-icon
                        v-if="viewedRule.data[viewedRule.version - 1].Menshin"
                        >mdi-check-circle-outline</v-icon
                      >
                      <v-icon v-else>mdi-close-circle-outline</v-icon>&nbsp;免震
                    </v-btn>
                  </v-flex>

                  <v-flex xs12>
                    <v-layout pl-4>
                      <p style="font-size: 18px">件名: &nbsp;</p>
                      <p>
                        <span
                          style="font-size: 18px; padding-top: 0"
                          v-html="
                            viewedRule.data[viewedRule.version - 1].RuleKenmei
                          "
                        ></span>
                      </p>
                    </v-layout>
                    <br />
                    <hr />
                  </v-flex>
                  <v-flex
                    v-for="(item, index) in viewedRule.data[
                      viewedRule.version - 1
                    ].content"
                    :key="index"
                  >
                    <v-card flat>
                      <v-card-text class="fr-view" v-html="item"></v-card-text>
                    </v-card>
                  </v-flex>
                </template>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </a-tab-pane>
    </a-tabs>

    <!-- dialog*********************************************************************************** -->
    <v-dialog v-model="historyDialog" width="500">
      <v-card>
        <v-list>
          <template v-for="(item, index) in historyDetails">
            <v-list-item
              id="hover"
              :class="listColorSearch(index)"
              @click="
                viewHistory(item.index);
                searchList = index;
                historyDialog = false;
              "
              :key="index"
            >
              <v-list-item-content>
                {{ index + 1 }} . {{ item.UpdatedDate }}&emsp;{{
                  item.ApprovalRemarks
                }}
                <span v-if="item.personInCharge"
                  >{{ title_spacer }}{{ item.personInCharge }}</span
                >
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-dialog>

    <v-dialog width="500" v-model="approvedDialog" persistent>
      <v-card class="pa-3">
        <v-toolbar dense flat color="#FAFAFA">
          <v-toolbar-title>Confirmation</v-toolbar-title>
          <v-spacer />
          <v-icon
            @click="
              approvedDialog = false;
              approvalRemarks = '';
            "
            >mdi-close</v-icon
          >
        </v-toolbar>
        <v-layout pa-2 row wrap>
          <v-radio-group v-model="optConfirmationModel" row>
            <v-radio label="Approved" value="Approved"></v-radio>
            <v-radio label="Disapproved" value="Disapproved"></v-radio>
          </v-radio-group>
          <v-flex xs12>
            <v-text-field
              v-if="optConfirmationModel == 'Approved' && tabModel == 2"
              v-model="newFinalDocumentNo"
              label="New Document ID"
              disabled
              outlined
              dense
            ></v-text-field>

            <v-text-field
              v-if="optConfirmationModel == 'Disapproved'"
              v-model="approvalRemarks"
              label="Remarks"
              outlined
              dense
            >
            </v-text-field>
          </v-flex>

          <v-layout dense>
            <v-spacer></v-spacer>
            <v-btn
              color="#1565c0"
              style="color: white"
              @click="initialApprovedAndDisapproved()"
              >OK</v-btn
            >
          </v-layout>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { mask } from "vue-the-mask";
import moment from "moment";

export default {
  directives: {
    mask,
  },
  components: {},
  data() {
    return {
      title_spacer: "　",
      intPageNo: 1,
      intRowNoRulebookDocument: 30,
      rulecontent: false,
      updatedRules: [],
      viewedRule: {
        approver: [],
        criteria: "",
        data: [
          {
            SeihinKubun: "",
            KanriBangou: "",
            RuleKenmei: "",
            Kubun: "",
            YumeNoIe: true,
            Ippan: true,
            Icube: false,
            Ismart: false,
            Taishin: true,
            Menshin: true,
            Tantou: "",
            MailAddress: "",
            TantouBusho: "",
            TekiyouKubun: "",
            UpdatedDate: "",
          },
        ],
        documentType: "RULEBOOK",
        isApproved: true,
        method: "JIKU",
        productType: "外部付帯",
        updated: true,
        version: 1,
        _id: "",
        _rev: "0",
      },
      toSearch: "",
      approvalRemarks: "",
      approvedDialog: false,
      historyDialog: false,
      docStatus: "approved",
      loading: true,
      historyDetails: "",
      mask: "######-##",
      historyCount: 0,
      optConfirmationModel: "Approved",
      newFinalDocumentNo: "",
      selectionBeforeTheMeeting: ["a", "b", "c"],
      selectedBeforeTheMeeting: "All",
      listBeforeTheMeeting: [],
      toSearchBeforeTheMeeting: "",
      tabModel: 1,
      searchList: "",
      RulebookUpdatedDate: "",
    };
  },
  mounted() {},
  created() {
    // console.log(this.$route.query)
    if (this.$route.query.personInCharge) {
      this.selectedBeforeTheMeeting = this.$route.query.personInCharge;
      this.RulebookUpdatedDate = this.$route.query.RulebookUpdatedDate;
    }
    // console.log('a',this.selectedBeforeTheMeeting)
    // console.log('b',this.RulebookUpdatedDate)

    if (this.tabModel == "1" || this.tabModel == "2") {
      this.getBeforeTheMeetingList();
    }

    if (
      this.userInfo.employee_code == "japanese" ||
      this.userInfo.employee_code == "35339" ||
      this.userInfo.EmployeeNumber == "0417" ||
      this.userInfo.department == "RESEARCH AND DEVELOPMENT"
    ) {
      if (this.tabModel == "3" || this.tabModel == "4") {
        this.loadFinalDocuments();
      } else {
        this.getBeforeTheMeeting();
      }
    }
  },
  watch: {
    tabModel() {
      if (
        this.tabModel == "3" ||
        this.tabModel == "4" ||
        this.tabModel == "5"
      ) {
        this.loadFinalDocuments();
      } else {
        this.getBeforeTheMeetingList();
      }
      this.selectedBeforeTheMeeting = "All";
      this.getBeforeTheMeeting();
    },
    approvedDialog() {
      this.checkExistNewDocument();
    },

    // selectedBeforeTheMeeting() {
    //   this.getBeforeTheMeetingList();
    // },
    // RulebookUpdatedDate() {
    //   this.getBeforeTheMeetingList();
    // },
  },
  methods: {
    callback(key) {
      this.tabModel = key;
      this.rulecontent = false;
    },
    listColorSearch(id) {
      if (this.searchList == id) {
        return "viewed";
      }
    },
    checkExistNewDocument() {
      let today = moment().format("YYMMDD");
      let url = `${this.api}checkexist/document?currentDate=${today}`;
      axios.get(url).then((res) => {
        this.newFinalDocumentNo = res.data;
      });
    },

    loadAllDocsInitial() {
      this.updatedRules = [];
      this.loading = true;
      let url = `${this.api}get/all_initial/documents?status=${this.docStatus}`;
      axios.get(url).then((res) => {
        this.updatedRules = res.data;
        this.loading = false;
      });
    },

    loadFinalDocuments() {
      if (this.tabModel == "3") {
        this.docStatus = "for approval";
      } else if (this.tabModel == "4") {
        this.docStatus = "approved";
      } else {
        this.docStatus = "obsolete";
      }

      this.updatedRules = [];
      this.loading = true;

      if (this.docStatus != "obsolete") {
        let url = `${this.api}get/updated_rules/${this.docStatus}`;
        axios.get(url).then((res) => {
          this.updatedRules = res.data;

          this.updatedRules = this.updatedRules.map((a) => {
            if (!a.personInCharge) {
              a.personInCharge = "All";
            }
            if (a.title) {
              a.title = a.title.replace(/<br>/gi, "\n");
            }
            return a;
          })
          this.loading = false;
        });
      } else {
        let url = `${this.api}get/all/obsolete`;
        axios.get(url).then((res) => {
          this.updatedRules = res.data;

          this.updatedRules = this.updatedRules.map((a) => {
            a.title = a.title.replace(/<br>/gi, "\n");
            return a;
          });
          this.loading = false;
        });
      }
    },

    getBeforeTheMeeting() {
      this.selectionBeforeTheMeeting = [];
      let beforeORafter = "";
      let meeting = null;

      if (this.tabModel == "1" || this.tabModel == "2") {
        beforeORafter = "before";
      } else {
        beforeORafter = "after";
      }

      if (this.tabModel == "1" || this.tabModel == "3") {
        meeting = "approval";
      } else if (this.tabModel == "2" || this.tabModel == "4") {
        meeting = "approved";
      }

      let url = `${this.api}get/personincharge?beforeORafter=${beforeORafter}&meeting=${meeting}`;
      axios.get(url).then((res) => {
        this.selectionBeforeTheMeeting = res.data;
        this.selectionBeforeTheMeeting.unshift("All");
        // this.loading = false;
      });
    },

    getBeforeTheMeetingList() {
      this.listBeforeTheMeeting = [];
      let url = `${this.api}get/personincharge/list?person=${this.selectedBeforeTheMeeting}`;
      // if (this.selectedBeforeTheMeeting) {
      axios.get(url).then((res) => {
        this.listBeforeTheMeeting = res.data;

        this.loading = false;
      });
      // }
    },

    viewRule(val) {
      this.historyCount = 0;
      let url = "";
      if (val.length == 9) {
        url = `${this.api}get/final/${val}`;
      } else {
        url = `${this.api}get/initial/${val}`;
      }
      axios.get(url).then((res) => {
        this.viewedRule = res.data;
        if (!this.viewedRule.approver) {
          this.viewedRule.approver = [];
        }
        if (!this.viewedRule.isFinishedBeforeTheMeeting) {
          this.viewedRule.isFinishedBeforeTheMeeting = false;
        }
      });
      this.rulecontent = true;
    },

    viewHistory(val) {
      this.viewedRule.version = val + 1;
    },

    initialApprovedAndDisapproved() {
      if (this.optConfirmationModel == "Approved") {
        this.approvedDocs();
      } else {
        this.disapprovedDocs();
      }
    },

    disapprovedDocs() {
      let beforeORafter = "";
      let updatedDate = moment().format("YYYY-MM-DD hh:mm:ss");
      if (this.viewedRule._id.length == 9) {
        beforeORafter = "after";
      } else {
        beforeORafter = "before";
      }
      let url = `${this.api}update/disapproved_document?beforeORafter=${beforeORafter}`;
      if (this.approvalRemarks) {
        let toUpdate = {};
        if (this.userInfo.employee_code) {
          toUpdate.approver = {
            name: this.userInfo.full_name,
            updatedDate: updatedDate,
          };
        } else {
          toUpdate.approver = {
            name: this.userInfo.LastName,
            updatedDate: updatedDate,
          };
        }
        toUpdate._id = this.viewedRule._id;
        toUpdate.approvalRemarks = this.approvalRemarks;

        axios.post(url, toUpdate).then((res) => {
          this.viewedRule._rev = res.data.rev;
          Swal.fire({
            icon: "error",
            title: "Disapproved.",
          });
          this.loadFinalDocuments();
          this.getBeforeTheMeetingList();
          this.approvedDialog = false;
          this.rulecontent = false;
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Please add remarks.",
        });
      }
    },
    approvedDocs() {
      let url = "";
      let beforeORafter = "";
      let updatedDate = moment().format("YYYY-MM-DD hh:mm:ss");
      if (this.tabModel == 1 || this.tabModel == 2) {
        beforeORafter = "before";
      } else {
        beforeORafter = "after";
      }

      url = `${this.api}update/approved_document?isApproved=${this.viewedRule.isApproved}&newFinalDocumentNo=${this.newFinalDocumentNo}&beforeORafter=${beforeORafter}`;

      // this.viewedRule.approver = this.userInfo.full_name;

      let toUpdate = {};
      if (this.userInfo.employee_code) {
        toUpdate.approver = {
          name: this.userInfo.full_name,
          updatedDate: updatedDate,
        };
      } else {
        toUpdate.approver = {
          name: this.userInfo.LastName,
          updatedDate: updatedDate,
        };
      }
      toUpdate.isApproved = true;
      toUpdate._id = this.viewedRule._id;
      // }

      axios.post(url, toUpdate).then((res) => {
        this.viewedRule._rev = res.data.rev;

        let approvedTitle = "";
        let approvedTimer = 0;
        if (this.tabModel == 1) {
          approvedTitle =
            "Successfully moved to Before the Meeting ( Approved )";
          approvedTimer = 1500;
        } else if (this.tabModel == 2) {
          approvedTitle = `Successfully moved to After the Meeting. New Rulebook no. ${this.newFinalDocumentNo}`;
          approvedTimer = 2000;
        } else if (this.tabModel == 3) {
          approvedTitle = `Successfully moved to After the Meeting ( Approved )`;
          approvedTimer = 1500;
        } else {
          approvedTitle = "Success";
          approvedTimer = 1500;
        }

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: approvedTitle,
          showConfirmButton: false,
          timer: approvedTimer,
        });
        this.loadFinalDocuments();
        this.getBeforeTheMeetingList();
        this.approvedDialog = false;
        this.rulecontent = false;
      });
    },

    getRdoc(val) {
      this.docStatus = val;
    },

    sortHistory() {
      // let viewedRuleDataHolder = this.viewedRule.data.reverse()
      this.viewedRule.data = this.viewedRule.data.map((rec, index) => {
        rec.index = index;
        return rec;
      });
      let viewedRuleDataHolder = Object.assign(
        [],
        this.viewedRule.data
      ).reverse();
      if (this.historyCount == 0) {
        this.historyDetails = viewedRuleDataHolder;
        this.historyCount = this.historyCount + 1;
      }
    },
  },
  computed: {
    afterTheMeetingfilteredItem() {
   

      if (this.updatedRules.length > 0) {
        return this.updatedRules
          .filter((data) => {
            return data._id.toLowerCase().includes(this.toSearch.toLowerCase());
          })
          .filter((rec) => {
            if (this.selectedBeforeTheMeeting != "All") {
              return rec.personInCharge.includes(this.selectedBeforeTheMeeting);
            } else {
              return rec;
            }
          });
      } else {
        return [];
      }
    },

    beforeTheMeetingfilteredItem() {
      if (this.listBeforeTheMeeting.length > 0) {
        return this.listBeforeTheMeeting
          .filter((data) => {
            return (
              data._id
                .toLowerCase()
                .includes(this.toSearchBeforeTheMeeting.toLowerCase()) &&
              data.isApproved == (this.tabModel == 1 ? false : true)
            );
          })
          .filter((rec) => {
            if (this.selectedBeforeTheMeeting != "All") {
              return rec._id.includes(this.selectedBeforeTheMeeting);
            } else {
              return rec;
            }
          })
          .filter((rec) => {
            if (this.RulebookUpdatedDate && this.tabModel == "1") {
              return rec.RulebookUpdatedDate == this.RulebookUpdatedDate;
            } else {
              return rec;
            }
          });
      }

      // if (this.RulebookUpdatedDate) {
      //   return this.listBeforeTheMeeting.filter((rec) => {
      //     return rec.RulebookUpdatedDate == "20202020";
      //   });
      // }
      else {
        return [];
      }
    },

    //Rulebook Document Data with pagination
    pageCountOfAfterMeeting() {
      let l = this.afterTheMeetingfilteredItem.length,
        s = this.intRowNoRulebookDocument;
      return Math.ceil(l / s);
    },
    pageCountOfBeforeMeeting() {
      let l = this.beforeTheMeetingfilteredItem.length,
        s = this.intRowNoRulebookDocument;
      return Math.ceil(l / s);
    },
    afterTheMeetingData() {
      const start = (this.intPageNo - 1) * this.intRowNoRulebookDocument,
        end = start + this.intRowNoRulebookDocument;
      return this.afterTheMeetingfilteredItem.slice(start, end);
    },
    beforeTheMeetingData() {
      const start = (this.intPageNo - 1) * this.intRowNoRulebookDocument,
        end = start + this.intRowNoRulebookDocument;
      return this.beforeTheMeetingfilteredItem.slice(start, end);
    },
  },
};
</script>

<style scoped>
.disabled {
  pointer-events: none;
}
#hover:hover {
  background-color: #b7f8f5;
}

.viewed {
  background-color: #b7f8f5;
}
</style>
