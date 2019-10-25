import React from 'react';
import { ControlledEditor } from "@monaco-editor/react";
import './DataEditor.css';

interface DataEditorProps {
  height?: string | number | undefined
}
const DataEditor = ({ height = "50vh" }: DataEditorProps) => {
  const handleEditorChange = (ev: any, value: string | undefined) => {
    return value;
  }

  return (
    <ControlledEditor
      theme="dark"
      height={height}
      onChange={handleEditorChange}
      language="javascript"
    />
  );
}

export default DataEditor