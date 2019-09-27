<script lang="ts">
import { Vue, Component, Prop, Watch, Mixins } from "vue-property-decorator";
import { HorizontalBar, mixins as chartjsMixins } from "vue-chartjs";
import { ChartOptions, ChartData, Chart } from "chart.js";

Chart.defaults.global.defaultFontFamily = "Roboto";

@Component({})
export default class BarChart extends Mixins(HorizontalBar) {
  @Prop(Array)
  private readonly data!: number[];
  @Prop(Array)
  private readonly labels!: string[];
  @Prop(String)
  private readonly title!: string;

  async mounted() {
    this.updateRender();
  }

  updateRender() {
    this.renderChart(
      {
        datasets: [
          {
            label: this.title,
            data: this.data,
            backgroundColor: this.$vuetify.theme.dark
              ? (this.$vuetify.theme.themes.dark.primary as string)
              : (this.$vuetify.theme.themes.light.primary as string)
          }
        ],
        labels: this.labels
      } as ChartData,
      { ...this.options }
    );
  }

  options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 12
      }
    },
    elements: {},
    scales: {
      xAxes: [
        {
          display: true,
          ticks: {
            beginAtZero: true,
            callback: (value: number) => value.toLocaleString()
          }
        }
      ],
      yAxes: [
        {
          display: true
        }
      ]
    },
    legend: {
      display: false
    }
  };
}
</script>
