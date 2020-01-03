import React, { useCallback, useEffect, useState } from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core'
import { grey, blue } from '@material-ui/core/colors'
import DragHandleRounded from '@material-ui/icons/DragHandleRounded'
import BottomAppBar from '../../components/stateless/bottom_app_bar/BottomAppBar'
import HeaderAppBar from '../../components/stateless/header_app_bar/HeaderAppBar'
import DataEditor from '../../components/stateful/data_editor/DataEditor'
import { Resizable } from "re-resizable";
import { useWindowSize } from '../../../core/hooks'
import './App.css'
import { processEvents, measureTime } from '../../../core/event_processing'
import { processText, processEventsMapped } from '../../../core/event_processing_without_wasm'
import ChartSection from '../../components/stateful/chart_section/ChartSection'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[300],
    },
    secondary: {
      main: blue[500],
    },
  },
})

function HandleElement(props: any) {
  return (<div className={`draggable-icon`}>
    <DragHandleRounded color={'primary'} />
  </div>)
}

function App() {
  const [text, setText] = useState('')
  const [wasm, setWASM] = useState()
  const [data, setData] = useState([{ datasets: [] }])
  const [editorHeight, setEditorHeight] = useState(0)
  const [width, height] = useWindowSize()
  const [initialEditorHeight, setInitialEditorHeight] = useState(0)

  const handleEditorChange = (ev: any, value: string | undefined) => {
    if (value) {
      setText(value)
    }
  }

  const onGenerateChartButtonPress = useCallback(async () => {
    if (text && wasm) {
      const [withoutWasmResult,,, withoutElapsedTime] = measureTime(() => processEventsMapped(processText(text)), 'without wasm')
      // const [withWasmResult,,, withElapsedTime] = measureTime(() => {
      //   return processEvents(wasm.EventsData.process_text(text))
      // }, 'with wasm')
      // setData(withWasmResult)
      setData(withoutWasmResult)
      // setData(withoutElapsedTime < withElapsedTime ? withoutWasmResult : withWasmResult)
    }
  }, [text, wasm])
  useEffect(() => {
    if (initialEditorHeight === 0) {
      setInitialEditorHeight(height / 2)
      setEditorHeight(height / 2 - 64)
    }
  }, [height, initialEditorHeight])
  useEffect(() => {
    ;(async () => {
      setWASM(await import('event_processing/event_processing'))
    })()
  }, [])

  const onResize = (event: any, direction: any, ref: any, delta: any) => {
    // setEditorHeight((oldEditorHeight) => oldEditorHeight+delta.height)
    const newHeight = parseInt(ref.style.height.replace("px", ""))
    if (newHeight) {
      setEditorHeight(newHeight)
    }
  };

  const graphHeight = height - editorHeight - 128
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <HeaderAppBar title="Jordao's Challenge" />
        <div style={{ height: height - 128 }}>
          <Resizable
              enable={{ top:false, right:false, bottom:true, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
              defaultSize={{
                height: initialEditorHeight - 64,
                width: Infinity
              }}
              minWidth={0}
              maxWidth={width}
              minHeight={(height - 128) * 0.25}
              maxHeight={(height - 128) * 0.75}
              onResize={onResize}
              // onResizeStop={onResize}
              handleComponent={{
                bottom: <HandleElement/>
              }}
          >
            <DataEditor
                height={editorHeight}
                handleEditorChange={handleEditorChange}
            />
          </Resizable>
          {/*<ResizableBox*/}
          {/*  height={initialEditorHeight - 64}*/}
          {/*  width={Infinity}*/}
          {/*  axis="y"*/}
          {/*  minConstraints={[0, (height - 128) * 0.25]}*/}
          {/*  maxConstraints={[Infinity, (height - 128) * 0.75]}*/}
          {/*  onResize={onResize}*/}
          {/*  resizeHandles={['s']}*/}
          {/*  handle={handleDragBar}*/}
          {/*>*/}
          {/*  <DataEditor*/}
          {/*    height={editorHeight}*/}
          {/*    handleEditorChange={handleEditorChange}*/}
          {/*  />*/}
          {/*</ResizableBox>*/}
          <div style={{ height: graphHeight, width }}>
            <ChartSection
              data={data}
              style={{
                height: `${graphHeight * 0.9 - 64}px`,
                width: `${width}px`,
              }}
            />
          </div>
        </div>
        <BottomAppBar onGenerateChartButtonPress={onGenerateChartButtonPress} />
      </ThemeProvider>
    </div>
  )
}

export default App
