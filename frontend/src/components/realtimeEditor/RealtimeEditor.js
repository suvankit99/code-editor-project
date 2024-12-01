import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView} from '@codemirror/view';
import { basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript';
import { collab, receiveUpdates, sendableUpdates } from '@codemirror/collab';
import { basicDark } from 'cm6-theme-basic-dark'
import { bracketMatching,  foldGutter } from '@codemirror/language'
import { autocompletion } from '@codemirror/autocomplete'; // Autocompletion


const RealtimeEditor = () => {
  const editorRef = useRef(null);
  const editorViewRef = useRef(null);

  useEffect(() => {

    // Initialize the editor state
    const state = EditorState.create({
      extensions: [
        basicSetup,
        javascript(),
        collab({ version: 0 }),
        basicDark , 
        bracketMatching(),
        foldGutter(),
        autocompletion(),
      ],
    });

    // Create the editor view
    const view = new EditorView({
      state,
      parent: editorRef.current,
    });
    editorViewRef.current = view;


    // Cleanup on unmount
    return () => {
      view.destroy();
    };
  }, []);

  return <div id='realtime-editor' ref={editorRef} style={{ height: 'calc(100vh - 20px)' , backgroundColor:"#1e1e1e" , margin:0}}></div>;
};

export default RealtimeEditor;
