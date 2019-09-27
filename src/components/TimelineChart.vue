<script lang="ts">
import { Vue, Component, Prop, Watch, Mixins } from "vue-property-decorator";
import { Line, mixins as chartjsMixins } from "vue-chartjs";
import { ChartOptions, ChartData, Chart, ChartDataSets } from "chart.js";

Chart.defaults.global.defaultFontFamily = "Roboto";

@Component({})
export default class TimelineChart extends Mixins(Line) {
  @Prop(Number)
  private height!: number;
  @Prop()
  private datasets!: ChartDataSets[];

  async mounted() {}

  @Watch("datasets")
  onDatasetsChange() {
    this.renderChart(
      {
        datasets: this.datasets
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
    elements: {
      point: {
        radius: 3
      },
      line: {
        tension: 0,
        borderColor: this.$vuetify.theme.dark
          ? (this.$vuetify.theme.themes.dark.primary as string)
          : (this.$vuetify.theme.themes.light.primary as string),
        borderWidth: 4,
        borderJoinStyle: "round"
      }
    },
    scales: {
      xAxes: [
        {
          type: "time",
          ticks: {
            reverse: true
          },
          time: {
            minUnit: "day",
            displayFormats: {
              day: "ll"
            }
          },
          display: true
        }
      ],
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero: true,
            callback: (value: number) => value.toLocaleString()
          }
        }
      ]
    },
    legend: {
      display: false
    }
  };
}
</script>
