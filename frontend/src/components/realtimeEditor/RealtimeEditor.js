import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { collab } from '@codemirror/collab';
import { basicDark } from 'cm6-theme-basic-dark';
import { bracketMatching, foldGutter } from '@codemirror/language';
import { autocompletion } from '@codemirror/autocomplete';
import ACTIONS from '../../actions';

const RealtimeEditor = ({ socketRef, roomId , syncCodeOnJoin }) => {
  const editorRef = useRef(null);
  const editorViewRef = useRef(null);
  const suppressEmit = useRef(false);

  useEffect(() => {
    // Initialize the editor state
    const state = EditorState.create({
      doc: '',
      extensions: [
        basicSetup,
        javascript(),
        collab({ version: 0 }),
        basicDark,
        bracketMatching(),
        foldGutter(),
        autocompletion(),
        EditorView.updateListener.of((update) => {
          // Emit local changes
          if (update.docChanged && !suppressEmit.current) {
            const newContent = update.state.doc.toString();
            console.log('Document updated locally:', newContent);
            syncCodeOnJoin(newContent) ; 
            if (socketRef.current) {
              socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                roomId,
                content: newContent,
              });
            }
          }
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });
    editorViewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [socketRef, roomId]);

  useEffect(() => {
    if (socketRef.current) {
      // Listen for CODE_CHANGE events
      const handleCodeChange = ({ content }) => {
        console.log('Received remote update:', content);
        syncCodeOnJoin(content) ; 
        if (editorViewRef.current) {
          const currentDoc = editorViewRef.current.state.doc.toString();
          if (content && currentDoc !== content) {
            suppressEmit.current = true; // Prevent emitting during remote updates
            const transaction = editorViewRef.current.state.update({
              changes: { from: 0, to: currentDoc.length, insert: content },
            });
            editorViewRef.current.dispatch(transaction);
            suppressEmit.current = false;
          }
        }
      };

      socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      };
    }
  }, [socketRef.current]);

  return (
    <div
      id="realtime-editor"
      ref={editorRef}
      style={{ height: 'calc(100vh - 20px)', backgroundColor: '#1e1e1e', margin: 0 }}
    ></div>
  );
};

export default RealtimeEditor;
