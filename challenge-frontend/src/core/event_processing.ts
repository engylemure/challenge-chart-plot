import { Events } from 'event_processing/event_processing'
import { generateLabelFromDataSetInfo, randomColor } from './util'
// @ts-ignore
import * as chartjs from 'chart.js'
import { ChartData } from 'react-chartjs-2'

export interface Point {
  timestamp: number
  value: number
}

export interface DataSet {
  group: string[]
  selection: string
  points: Point[]
}

export function measureTime(fun: any, name: string = "fun") {
  const t0 = performance.now();
  const result = fun();
  const t1 = performance.now();
  console.log(`Call to ${name} took ` + (t1 - t0) + ` milliseconds.`);
  return [result, t0, t1, t1 - t0]
}
export function processEvents(
  events: Events | undefined
): ChartData<chartjs.ChartData>[] {
  if (events) {
    const eventsData: DataSet[][] = events.process_events_data()
    return eventsData.map((dataSets) => {
      const processedDataSets = dataSets.map(dataset => {
        let color = randomColor()
        let colorA1 = `rgba(${color.red}, ${color.green}, ${color.blue}, 1)`
        let colorA0_4 = `rgba(${color.red}, ${color.green}, ${color.blue}, 0.4)`
        return {
          label: generateLabelFromDataSetInfo(
              dataset.group,
              dataset.selection
          ),
          fill: false,
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          backgroundColor: colorA0_4,
          borderColor: colorA1,
          pointBorderColor: colorA1,
          pointHoverBackgroundColor: colorA1,
          data: dataset.points.map(point => ({
            x: point.timestamp - dataset.points[0].timestamp,
            y: point.value,
          })),
        }
      })
      return ({ datasets: processedDataSets })
    })
  }
  return []
}
