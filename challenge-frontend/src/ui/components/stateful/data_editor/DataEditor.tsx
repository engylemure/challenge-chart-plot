import React from 'react';
import {ControlledEditor, ControlledEditorOnChange } from "@monaco-editor/react";
import './DataEditor.css';

interface DataEditorProps {
  height?: string | number | undefined,
  handleEditorChange?: ControlledEditorOnChange | undefined
}

const DataEditor = ({ height = "50vh", handleEditorChange }: DataEditorProps) => {
  return (
    <ControlledEditor
      theme="dark"
      height={height}
      onChange={handleEditorChange}
      language="typescript"
    />
  );
}

export default DataEditor