<style scoped>
  .scroll-target {
    max-width: unset;
    width: fit-content;
  }

  .scroll-wrapper {
    overflow: auto;
  }

  canvas.axis {
    position: absolute;
    background-color: #fff;
  }
</style>

<template>
  <v-card class="scroll-wrapper" :id="`scroll-target-${id}`">
    <div class="scroll-target" v-scroll:[`#scroll-target-${id}`]="onScroll">
      <canvas :style="{left: scrollLeft + 'px'}" class="axis" width="0" height="0" ref="axis"></canvas>
      <timeline-chart :width="width" :height="height" :plugins="plugins" ref="chart" @rendered="renderAxis"></timeline-chart>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Mixins, Ref } from 'vue-property-decorator'
import { Line, mixins as chartjsMixins } from 'vue-chartjs'
import { PluginServiceRegistrationOptions, ChartOptions, ChartData, Chart } from 'chart.js'

import TimelineChart from "../components/TimelineChart.vue";

@Component({
  components: {
    TimelineChart
  }
})
export default class ScrollableChart extends Vue {
  @Ref('chart')
  chart!: TimelineChart
  @Ref('axis')
  axis!: HTMLCanvasElement

  @Prop(Number)
  height!: number
  @Prop(Number)
  width!: number

  scrollLeft: number = 0
  id: string = Math.random().toString(16).replace('.', '-')

  plugins: PluginServiceRegistrationOptions[] = [
    {
      afterRender: () => {
        this.renderAxis()
      }
    }
  ]

  onScroll(e) {
    this.scrollLeft = e.target.scrollLeft
  }

  get axisStyle() {
    return {left: this.scrollLeft}
  }

  async renderAxis() {
    const chart: Chart = this.chart.$data._chart

    if(chart.ctx === null) return

    const sourceCanvas = chart.ctx.canvas;
    const targetCtx: CanvasRenderingContext2D = this.axis.getContext("2d") as CanvasRenderingContext2D
    const width = (chart.chartArea.left - 3)
    const height = (chart.chartArea.bottom + 5)
    const scale = window.devicePixelRatio

    targetCtx.canvas.width = width * scale
    targetCtx.canvas.style.width = width + 'px'
    targetCtx.canvas.height = this.height * scale
    targetCtx.canvas.style.height = this.height + 'px'

    targetCtx.scale(scale, scale)
    targetCtx.drawImage(sourceCanvas,  0, 0, width*scale, height*scale, 0, 0, width, height)
  }
}

</script>