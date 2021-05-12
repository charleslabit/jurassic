<template>
  <div>
    <bar-chart
      v-if="isLoadBar"
      :data="chartData"
      :options="chartOptions"
    ></bar-chart>
  </div>
</template>

<script>
import axios from "axios";
import BarChart from "../BarChart.js";
export default {
  name: "App",
  components: {
    BarChart,
  },
  data() {
    return {
      isLoadBar: false,
      counter: [],
      chartOptions: {
        hoverBorderWidth: 20,
      },
      chartData: {
        hoverBackgroundColor: "red",
        hoverBorderWidth: 10,
        labels: [],
        maintainAspectRatio: false,
        datasets: [
          {
            label: "",
            backgroundColor: ["#41B883", "#E46651", "#00D8FF", "Yellow", "Red"],
            data: [],
          },
        ],
      },
    };
  },
  methods: {
    getCount() {
      let url = `${this.api}counter`;
      axios.get(url).then((res) => {
        this.counter = res.data;
        let TotalRecord =
          this.counter.approved +
          this.counter.disApproved +
          this.counter.temporary +
          this.counter.forApproval +
          this.counter.obsolete;


        this.chartData.datasets[0].label = `Total: ${TotalRecord}`;
        this.chartData.datasets[0].data = [
          this.counter.approved,
          this.counter.disApproved,
          this.counter.temporary,
          this.counter.forApproval,
          this.counter.obsolete,
        ];

        this.chartData.labels = [
          `Approved:${this.counter.approved}`,
          `Disapproved:${this.counter.disApproved}`,
          `Temporary:${this.counter.temporary}`,
          `For Approval: ${this.counter.forApproval}`,
          `Obsolete: ${this.counter.obsolete}`,
        ];
        this.isLoadBar = true;
      });
    },
  },
  created() {
  },
  mounted() {
    this.getCount();
  },
};
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
