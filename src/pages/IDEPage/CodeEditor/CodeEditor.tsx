import { Box } from '@chakra-ui/react'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { useEffect, useRef, useState } from 'react'
import { javascript } from '@codemirror/lang-javascript'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { python } from '@codemirror/lang-python'
import { githubLight } from '@uiw/codemirror-theme-github'
import './code-editor.css'
import { LanguageSupport } from '@codemirror/language'
import { showMinimap } from '@replit/codemirror-minimap'

const EXTENSIONS: { [key: string]: LanguageSupport } = {
  python: python(),
  javascript: javascript(),
  cpp: cpp(),
  java: java(),
}

const CodeEditor = ({ language }: { language: string }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const codemirrorViewRef = useRef<EditorView>()

  const [code, setCode] = useState("consle.log('hello!');")

  useEffect(() => {
    // minimap 설정을 위한 코드
    const create = (v: EditorView) => {
      const dom = document.createElement('div')
      return { dom }
    }

    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        EXTENSIONS[language],
        githubLight,
        // minimap scrollbar
        showMinimap.compute(['doc'], _ => {
          return {
            create,
            /* optional */
            displayText: 'characters',
            showOverlay: 'always',
          }
        }),
      ],
    })

    codemirrorViewRef.current = new EditorView({
      state,
      parent: editorRef.current ? editorRef.current : undefined,
    })

    // Cleanup function to destroy the editor when the component unmounts
    return () => {
      if (codemirrorViewRef.current) {
        codemirrorViewRef.current.destroy()
      }
    }
  }, [code])

  return <Box ref={editorRef} minH="calc(100vh - 285px)" width="100%"></Box>
}

export default CodeEditor
