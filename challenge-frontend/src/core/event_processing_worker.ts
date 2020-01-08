function processWorker() {
    // eslint-disable-next-line
    function _randomU16Value(): number {
        return Math.round(Math.random() * 255)
    }

    function randomColor(): any {
        return {
            green: _randomU16Value(),
            red: _randomU16Value(),
            blue: _randomU16Value(),
        }
    }

    function generateLabelFromDataSetInfo(
        group: any[],
        selection: string
    ): string {
        let groupInfo = group.map(([keyName, value]) => {
            return `${capitalize(keyName)}: ${capitalize(getValueFromGroup(value))}`
        }).join(", ")
        return `${groupInfo ? groupInfo + ', ': ''}${selection
            .split('_')
            .reduce(
                (acc: string, value: string) =>
                    acc ? `${acc} ${capitalize(value)}` : capitalize(value),
                ''
            )}`
    }

    function capitalize(s: string): string {
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    function getValueFromGroup(groupValue: any): string {
        if (groupValue.String) {
            return groupValue.String
        } else if (groupValue.Number) {
            return groupValue.Number
        } else if (groupValue.Bool) {
            return groupValue.Bool
        } else if (groupValue.Null) {
            return "Null"
        } else {
            return ""
        }
    }

    const processEventsData = (eventDatasets: any) => {
        if (eventDatasets) {
            return eventDatasets.map((dataSets: any) => {
                const processedDataSets = dataSets.map((dataset: any)=> {
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
                        data: dataset.points.map((point: any) => ({
                            x: new Date(point.timestamp),
                            y: point.value,
                        })),
                    }
                })
                return ({ datasets: processedDataSets })
            })
        }
        return []
    }

    // eslint-disable-next-line
    self.addEventListener("message", event => {
        if (!event) return;
        const eventDatasets = event.data
        const result = processEventsData(eventDatasets)
        // @ts-ignore
        postMessage(result);
    })
}

export default processWorker