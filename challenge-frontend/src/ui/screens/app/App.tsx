import * as React from 'react';
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
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <HeaderAppBar title="Jordao's Challenge"/>
        <DataEditor/>
        <BottomAppBar/>
      </ThemeProvider>
    </div>
  );
}

export default App;
