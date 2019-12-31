import React, {useCallback, useEffect, useState} from 'react';
import {ThemeProvider} from '@material-ui/styles';
import {createMuiTheme} from '@material-ui/core';
import {grey, blue} from '@material-ui/core/colors';
import DragHandleRounded from '@material-ui/icons/DragHandleRounded'
import './App.css';
import BottomAppBar from '../../components/stateless/bottom_app_bar/BottomAppBar';
import HeaderAppBar from '../../components/stateless/header_app_bar/HeaderAppBar';
import DataEditor from '../../components/stateful/data_editor/DataEditor';
// @ts-ignore
import {Chart} from 'react-charts'
// @ts-ignore
import {ResizableBox} from 'react-resizable'
import {useWindowSize} from "../../../core/hooks";
import 'react-resizable/css/styles.css';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: grey[300]
        },
        secondary: {
            main: blue[500]
        }
    }
});

function App() {
    const [text, setText] = useState("");
    const [wasm, setWASM] = useState();
    const [dataSets, setDataSets] = useState([]);
    const [, height] = useWindowSize();
    const [initialEditorHeight, setInitialEditorHeight] = useState(0)
    const [editorHeight, setEditorHeight] = useState(0)
    const handleEditorChange = (ev: any, value: string | undefined) => {
        if (value) {
            setText(value)
        }
    };
    const onGenerateChartButtonPress = useCallback(async () => {
        if (text && wasm) {
            const events = wasm.Events.from_text(text)
            let events_data = events.get_events_data_by_idx(0)
            if (events_data) {
                let dataSet_vec = await events_data.dataset_vec()
                if (dataSet_vec) {
                    setDataSets(dataSet_vec.map((dataset: any) => {
                        return {
                            label: `${dataset.selection} ${dataset.group}`,
                            data: dataset.points.map((point: any) => [point.timestamp - dataset.points[0].timestamp, point.value])
                        }
                    }))
                }
            }
        }
    }, [text, wasm]);
    useEffect(
        () => {
            if (initialEditorHeight === 0) {
                setInitialEditorHeight((height /2))
                setEditorHeight((height/2) - 64)
            }
        },
        [height, initialEditorHeight]
    );
    useEffect(() => {
        (async () => {
            setWASM(await import("event_processing/event_processing"))
        })()
    }, []);

    const onResize = (event: any, {element, size, handle}: any) => {
        setEditorHeight(size.height);
    };

    const series = React.useMemo(
        () => ({
            showPoints: false
        }),
        []
    );

    const axes = React.useMemo(
        () => [
            {primary: true, type: 'linear', position: 'bottom'},
            {type: 'linear', position: 'left'}
        ],
        []
    );

    const data = React.useMemo(() => {
        return dataSets
    }, [dataSets]);
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <HeaderAppBar title="Jordao's Challenge"/>
                <div style={{height: height - 128}}>
                    <ResizableBox
                        height={initialEditorHeight - 64}
                        width={Infinity}
                        axis="y"
                        minConstraints={[0, (height - 128)*0.25]}
                        maxConstraints={[Infinity, (height - 128)*0.75]}
                        onResize={onResize}
                        resizeHandles={['s']}
                        handle={(resizeHandle: string) => {
                            return <div className={`draggable-icon`}>
                                <DragHandleRounded  color={"primary"}/>
                            </div>
                        }}
                    >
                        <DataEditor height={editorHeight} handleEditorChange={handleEditorChange}/>
                    </ResizableBox>
                    <div style={{height: height - editorHeight - 128}}>
                        <div style={{
                            height: "100%",
                            width: "100%",
                            alignItems: 'center',
                            flex: 1,
                            display: "flex",
                            // justifyContent: 'center'
                        }}>
                            <div style={{
                                height: "75%",
                                width: "75%",
                                marginLeft: 15
                            }}>
                                <Chart data={data} series={series} axes={axes} tooltip/>
                            </div>
                        </div>
                    </div>
                </div>
                <BottomAppBar onGenerateChartButtonPress={onGenerateChartButtonPress}/>
            </ThemeProvider>
        </div>
    );
}

export default App;
