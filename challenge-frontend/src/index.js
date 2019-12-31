import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './ui/screens/app/App';
import * as serviceWorker from './serviceWorker';
import { monaco } from '@monaco-editor/react';
monaco
  .init()
  .then(monaco => {
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
  })
  .catch(error =>
    console.error('An error occurred during initialization of Monaco: ', error)
  );

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
