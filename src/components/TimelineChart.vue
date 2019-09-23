<script lang="ts">
import { Vue, Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import { Line, mixins as chartjsMixins } from 'vue-chartjs'
import { ChartOptions, ChartData, Chart } from 'chart.js'

Chart.defaults.global.defaultFontFamily = "Roboto"

@Component({})
export default class TimelineChart extends Mixins(Line) {
  @Prop()
  private height!: number

  async mounted() {
    const data: {x: string, y: number}[] = await fetch('/data.json').then(res => res.json());

    this.renderChart({
      datasets: [
        {
          label: 'Points',
          data: data.map(({x, y}) => ({x : new Date(x), y: y*2*Math.random()})),
          borderColor: this.$vuetify.theme.dark ? this.$vuetify.theme.themes.dark.secondary as string : this.$vuetify.theme.themes.light.secondary as string,
        },
        {
          label: 'Tokens',
          data: data.map(({x, y}) => ({x : new Date(x), y}))
        },
      ]
    } as ChartData, {... this.options})
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
        borderColor: this.$vuetify.theme.dark ? this.$vuetify.theme.themes.dark.primary as string : this.$vuetify.theme.themes.light.primary as string,
        borderWidth: 4,
        borderJoinStyle: 'round',
      },
    },
    scales: {
      xAxes: [{
        type: "time",
        ticks: {
          reverse: true
        },
        time: {
          minUnit: 'day',
          displayFormats: {
            day: 'll'
          }
        },
        display: true
      }],
      yAxes: [{
        display: true,
        ticks: { beginAtZero: true }
      }]
    },
    legend: {
      display: false
    }
  }
}

</script>