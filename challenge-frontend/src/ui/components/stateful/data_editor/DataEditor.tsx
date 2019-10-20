import React, { useState } from 'react';
import {Editor, EditorState, EditorBlock, ContentState} from 'draft-js';
import './DataEditor.css';

const Line = (props: any) => {
  const { block, contentState } = props
  const lineNumber = (contentState as ContentState)
    .getBlockMap()
    .toList()
    .findIndex((item: any) => (item.key === block.key)) + 1;
  return (
    <div  className="line" data-line-number={lineNumber}>
      <div className="line-text">
      <EditorBlock {...props} />
      </div>
    </div>
  );
}

const blockRendererFunction = () => ({
  component: Line,
})

const DataEditor = (props: any) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  return (
    <Editor 
      editorState={editorState}
      onChange={setEditorState}
      blockRendererFn={blockRendererFunction}
      textAlignment={undefined}
      textDirectionality='LTR'
    />
  );
}

export default DataEditor