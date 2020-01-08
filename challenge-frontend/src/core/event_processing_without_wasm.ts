import { randomColor, capitalize } from "./util";
import { ChartData } from "react-chartjs-2";
// @ts-ignore
import * as chartjs from 'chart.js'

export interface EventBase {
  type: string,
  timestamp: number
}

export interface StartEvent extends EventBase {
  select?: string[],
  group?: string[]
}

export interface StopEvent extends EventBase {

}

export interface SpanEvent extends EventBase {
  end: number,
  begin: number
}

export interface DataEvent extends EventBase, Object {
  data?: any
}

export class Point {
  value: number;
  timestamp: number;

  constructor(value: number, timestamp: number) {
    this.value = value
    this.timestamp = timestamp
  }

  static fromEvent(event: DataEvent, selection: string, group: Groupable[]): Point | undefined {
    if (event && event.type === 'data') {
      const point = new Point(0, event.timestamp)
      let isInGroup = true;
      group.forEach((g) => {
        let data = (event as any)[g.key]
        isInGroup = isInGroup && data === g.value
      })
      if (isInGroup) {
        point.value = (event as any)[selection]
        return point
      }
    }
    return;
  }
}

export interface Groupable {
  key: string,
  value: any
}

export class DataSet {
  points: Point[];
  selection: string;
  group: Groupable[];
  constructor(selection: string, group?: Groupable[], points?: Point[]) {
    this.selection = selection
    this.points = points || []
    this.group = group || []
  }
}

export class EventsData {
  start?: StartEvent;
  stop?: StopEvent;
  span?: SpanEvent;
  data_events: DataEvent[];
  group_map: any;

  constructor() {
    this.data_events = []
    this.group_map = {}
  }

  addDataEvent(eventData: any) {
    const { type, timestamp, ...data } = eventData
    this.data_events.push({ type, timestamp, data })
    if (this.start && this.start.group) {
      for (let groupIdx in this.start.group) {
        let groupKey = this.start.group[groupIdx]
        let value = eventData[groupKey]
        if (value) {
          this._insertInGroupMap(groupKey, value)
        }
      }
    }
  }

  _insertInGroupMap(key: string, value: any) {
    if (this.group_map[key]) {
      this.group_map[key][value] = true
    } else {
      this.group_map[key] = {
        [value]: true
      }
    }
  }
}
export class EventsMapped {
  startEvent?: StartEvent;
  stopEvent?: StopEvent;
  spanEvent?: SpanEvent;
  dataEvents: EventBase[];
  select?: string[];
  groupMap: any;

  constructor() {
    this.dataEvents = []
    this.groupMap = {}
  }

  addDataEvent(eventData: any) {
    this.dataEvents.push(eventData)
    if (this.startEvent && this.startEvent.group) {
      for (let groupIdx in this.startEvent.group) {
        let groupKey = this.startEvent.group[groupIdx]
        let value = eventData[groupKey]
        if (value) {
          this._insertInGroupMap(groupKey, value)
        }
      }
    }
  }

  _insertInGroupMap(key: string, value: any) {
    if (this.groupMap[key]) {
      this.groupMap[key][value] = true
    } else {
      this.groupMap[key] = {
        [value]: true
      }
    }
  }

  getDatasets(): DataSet[] {
    if (this.select && this.select.length > 0) {
      if (this.startEvent) {
        let dataSets: DataSet[] = []
        if (this.startEvent.group && this.startEvent.group.length > 0) {
          let groupValues = Object.keys(this.groupMap).map((key) => {
            return Object.keys(this.groupMap[key]).map((groupValue) => ({
              key,
              value: groupValue
            }))
          })
          let groups : Groupable[][] = cartesianProduct(groupValues)
          this.select.forEach(
            (s) => {
              let dataSetsGroup = groups.map((group) => {
                return new DataSet(s, group)
              })
              dataSets.push(...dataSetsGroup)
            }
          )
        } else {
          this.select.forEach(
            (s) => {
              dataSets.push(new DataSet(s))
            }
          )
        }
        let vecPoints = this._getPointsFromDataSets(dataSets)
        vecPoints.forEach((vecPoint, vIdx) => {
          dataSets[vIdx].points = vecPoint
        })
        return dataSets
      }
    }
    return []
  }

  _getPointsFromDataSets(datasets: DataSet[]): Point[][] {
    let points: Point[][] = []
    datasets.forEach((_, i) => points[i] = [])
    const hasSpan = !!this.spanEvent
    const hasStop = !!this.stopEvent
    const stopTimestamp = this.stopEvent ? this.stopEvent.timestamp : 0 
    const spanEndTimestamp = this.spanEvent ? this.spanEvent.end : 0
    const spanBeginTimestamp = this.spanEvent ? this.spanEvent.begin : 0
    for (let eKey in this.dataEvents) {
      let event = this.dataEvents[eKey]
      datasets.forEach((dataSet, dIdx) => {
        let point = Point.fromEvent(event, dataSet.selection, dataSet.group)
        if (point && ((hasStop && stopTimestamp >= point.timestamp) || !hasStop) && ((hasSpan && point.timestamp >= spanBeginTimestamp && point.timestamp && spanEndTimestamp) || !hasSpan) ) {
          points[dIdx].push(point)
        }
      })
    }
    return points
  }
}


export function processTextToWasm(text: string): any[] {
  const lines = text.split(/\r\n|\n/)
  const linesCount = lines.length
  const eventsMappedVec: EventsData[] = []
  let eventsMapped = new EventsData()
  let hasStarted = false
  lines.forEach((line, lineIdx) => {
    const eventData = processLineEvent(line)
    if(eventData) {
      switch (eventData.type) {
        case 'start':
          if (hasStarted) {
            eventsMappedVec.push(eventsMapped)
            eventsMapped = new EventsData()
            eventsMapped.start = eventData
          } else {
            eventsMapped.start = eventData
            hasStarted = true
          }
          break;
        case 'span':
          eventsMapped.span = eventData
          break;
        case 'data':
          if (hasStarted) {
            eventsMapped.addDataEvent(eventData)
          }
          break;
        case 'stop':
          eventsMapped.stop = eventData
          eventsMappedVec.push(eventsMapped)
          eventsMapped = new EventsData()
          hasStarted = false;
          break;
        default:
          break;
      }
    }
    if (lineIdx === linesCount) {
      if (eventsMapped.start) {
        eventsMappedVec.push(eventsMapped)
      }
      eventsMapped =  new EventsData()
    }
  })
  return eventsMappedVec
}

export function processText(text: string): EventsMapped[] {
  const lines = text.split(/\r\n|\n/)
  const linesCount = lines.length
  const eventsMappedVec: EventsMapped[] = []
  let eventsMapped = new EventsMapped()
  let hasStarted = false
  lines.forEach((line, lineIdx) => {
    const eventData = processLineEvent(line)
    if(eventData) {
      switch (eventData.type) {
        case 'start':
          if (hasStarted) {
            eventsMappedVec.push(eventsMapped)
            eventsMapped = new EventsMapped()
            eventsMapped.select = eventData.select
            eventsMapped.startEvent = eventData
          } else {
            eventsMapped.select = eventData.select
            eventsMapped.startEvent = eventData
            hasStarted = true
          }
          break;
        case 'span':
          eventsMapped.spanEvent = eventData
          break;
        case 'data':
          if (hasStarted) {
            eventsMapped.addDataEvent(eventData)
          }
          break;
        case 'stop':
          eventsMapped.stopEvent = eventData
          eventsMappedVec.push(eventsMapped)
          eventsMapped = new EventsMapped()
          hasStarted = false;
          break;
        default:
          break;
      }
    }
    if (lineIdx === linesCount) {
      if (eventsMapped.startEvent) {
        eventsMappedVec.push(eventsMapped)
      }
      eventsMapped = new EventsMapped()
    }
  })
  return eventsMappedVec
}

export function processEventsMapped(eventsMapped: EventsMapped[]): ChartData<chartjs.ChartData>[] {
  return eventsMapped.map((eventMapped) => {
    const dataSets = eventMapped.getDatasets()
    return {
      datasets: dataSets.map(dataset => {
        let color = randomColor()
        let colorA1 = `rgba(${color.red}, ${color.green}, ${color.blue}, 1)`
        let colorA0_4 = `rgba(${color.red}, ${color.green}, ${color.blue}, 0.4)`
        return {
          label: `${dataset.group.reduce((acc, val) => `${acc} ${capitalize(val.key)}:${capitalize(val.value)}`, ``)}${capitalize(dataset.selection)}`,
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
    }
  })

}

export function processLineEvent(line: string): any {
  try {
    return JSON.parse(convertToStrictJSON(line))
  } catch (e) {
    return null
  }
}

export function cartesianProduct(input: any[][] ): any[][] {
  const [first, ...rest] = input
  let init = first.map((n) => {
    return [n]
  })
  return rest.reduce((vec, list) => partialCartesian(vec, list), init)
}

function partialCartesian(a: any[][], b: any[]): any[][] {
  return a.flatMap((xs) => {
    return b.map((y) => {
      let vec = [...xs]
      vec.push(y)
      return vec
    })
  })
}


export function convertToStrictJSON(jsonString: string): string {
  return jsonString
    // wrap keys without quote with valid double quote
    .replace(/([\w]+)\s*:/g, function(_, $1){return '"'+$1+'":'})
    // replacing single quote wrapped ones to double quote 
    .replace(/'([^']+)'/g, function(_, $1){return '"'+$1+'"'})
}

