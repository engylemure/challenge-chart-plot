import React, {useCallback, useEffect, useState} from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import { grey, blue } from '@material-ui/core/colors';
import './App.css';
import BottomAppBar from '../../components/stateless/bottom_app_bar/BottomAppBar';
import HeaderAppBar from '../../components/stateless/header_app_bar/HeaderAppBar';
import DataEditor from '../../components/stateful/data_editor/DataEditor';

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
  const handleEditorChange = (ev: any, value: string | undefined) => {
    if(value) {
      setText(value)
    }
  };
  const onGenerateChartButtonPress = useCallback(async () => {
    if(text && wasm) {
      const events = wasm.Events.from_text(text)
      console.log(events.render())
    }
  }, [text, wasm])

  useEffect(() => {
    (async () => {
      setWASM(await import("event_processing/event_processing"))
    })()
  }, [])

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <HeaderAppBar title="Jordao's Challenge"/>
        <DataEditor handleEditorChange={handleEditorChange}/>
        <BottomAppBar onGenerateChartButtonPress={onGenerateChartButtonPress}/>
      </ThemeProvider>
    </div>
  );
}

export default App;
