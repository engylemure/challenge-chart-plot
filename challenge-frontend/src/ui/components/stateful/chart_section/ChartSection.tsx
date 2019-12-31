import { ChartData, Line } from 'react-chartjs-2'
// @ts-ignore
import * as chartjs from 'chart.js'
import React, { CSSProperties, useEffect, useState } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

interface ChartSectionProps {
  data: ChartData<chartjs.ChartData>[]
  style: CSSProperties
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

const ChartSection = (props: ChartSectionProps) => {
  const [value, setValue] = useState(0)
  const handleChange = (event: any, newValue: any) => {
    setValue(newValue)
  }
  useEffect(() => {
    setValue(0)
  }, [props.data])
  const options = React.useMemo(
    () => ({
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        xAxes: [
          {
            type: 'linear',
            display: true,
            labelString: 'Milliseconds',
            ticks: {
              fontSize: '10',
              fontColor: '#969da5',
            },
          },
        ],
        yAxes: [
          {
            display: true,
            type: 'linear',
            labelString: 'Response Time',
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    }),
    []
  )
  const legend = React.useMemo(
    () => ({
      display: true,
      position: 'right',
      fullWidth: true,
    }),
    []
  )
  return (
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="wrapped label tabs example"
      >
        {props.data.map((data, index) => {
          return <Tab value={index} label={`Chart ${index}`} key={index} />
        })}
      </Tabs>
      {props.data.map((data, index) => {
        return (
          <TabPanel value={value} index={index} key={index}>
            <div
              style={{
                height: '100%',
                width: '100%',
                alignItems: 'center',
                flex: 1,
                display: 'flex',
                // justifyContent: 'center'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  ...props.style,
                }}
              >
                <Line data={data} options={options} legend={legend} />
              </div>
            </div>
          </TabPanel>
        )
      })}
    </div>
  )
}

export default ChartSection
