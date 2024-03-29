import {$getRoot, $getSelection} from 'lexical';
import {useEffect} from 'react';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { MuiContentEditable } from "./styles.js";
import {Box} from "@mui/material";
// @ts-ignore
import Toolbar from "../toolbar/Toolbar.tsx";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import lexicalEditorConfig from './editorConfig'

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
const MyCustomAutoFocusPlugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        // Focus the editor when the effect fires!
        editor.focus();
    }, [editor]);

    return null;
}

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState) {
    editorState.read(() => {
        // Read the contents of the EditorState here.
        const root = $getRoot();
        const selection = $getSelection();
    });
}

const Editor = () => {

    return (
        <LexicalComposer initialConfig={lexicalEditorConfig}>
            <Toolbar />
            <Box sx={{position: "relative", background: "#fafafa", mt: 1, borderRadius: "5px"}}>
                <RichTextPlugin
                    contentEditable={<MuiContentEditable />}
                    placeholder={<Box sx={{position: "absolute", top: 15, left: 10, userSelect: "none",
                        display: "inline-block",
                        pointerEvents: "none"}}>Enter some text...</Box>}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <OnChangePlugin onChange={onChange} />
                <HistoryPlugin />
                <MyCustomAutoFocusPlugin />
            </Box>
        </LexicalComposer>
    );
};

export default Editor;