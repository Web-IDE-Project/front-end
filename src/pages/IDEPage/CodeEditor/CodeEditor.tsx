import { Box } from '@chakra-ui/react'
import { EditorState, Transaction } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { useCallback, useEffect, useRef, useState } from 'react'
import { javascript } from '@codemirror/lang-javascript'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { python } from '@codemirror/lang-python'
import { githubLight } from '@uiw/codemirror-theme-github'
import './code-editor.css'
import { LanguageSupport } from '@codemirror/language'
import { showMinimap } from '@replit/codemirror-minimap'
import yorkie, { type Text, TextOperationInfo, EditOpInfo } from 'yorkie-js-sdk'

type YorkieDoc = {
  content: Text
}

const EXTENSIONS: { [key: string]: LanguageSupport } = {
  python: python(),
  javascript: javascript(),
  cpp: cpp(),
  java: java(),
}

const CodeEditor = ({ language }: { language: string }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const codemirrorViewRef = useRef<EditorView>()

  const initializeYorkieEditor = useCallback(async () => {
    // 1. 클라이언트 생성 및 활성화
    const client = new yorkie.Client(import.meta.env.VITE_YORKIE_API_ADDR, {
      apiKey: import.meta.env.VITE_YORKIE_API_KEY,
    })

    await client.activate()

    // 2. 클라이언트와 연결된 문서 생성
    // TODO - 문서 키를 file ID로 수정
    const doc = new yorkie.Document<YorkieDoc>(
      `codemirror6-${new Date()
        .toISOString()
        .substring(0, 10)
        .replace(/-/g, '')}`,
      {
        enableDevtools: true,
      }
    )

    await client.attach(doc)

    // 3. 해당 키의 문서에 content가 없으면 새로운 Text 생성
    doc.update(root => {
      if (!root.content) {
        root.content = new yorkie.Text()

        // TODO - 기존에 저장된 코드 삽입
      }
    }, 'create content if not exists')

    // 4. 문서의 변경 이벤트 구독
    // 문서 객체에서 'remote-change' 이벤트가 발생할 때마다 호출된다.
    doc.subscribe('$.content', event => {
      if (event.type === 'remote-change') {
        const { operations } = event.value
        handleOperations(operations)
      }
    })

    // 문서 내용을 CodeMirror 에디터에 동기화
    const syncText = () => {
      const text = doc.getRoot().content
      codemirrorViewRef.current?.dispatch({
        changes: {
          from: 0,
          to: codemirrorViewRef.current.state.doc.length,
          insert: text.toString(),
        },
        annotations: [Transaction.remote.of(true)],
      })
    }

    await client.sync()

    // 5. local의 변경 사항을 remote에 broadcast하기 위한 함수
    const updateListener = EditorView.updateListener.of(viewUpdate => {
      if (viewUpdate.docChanged) {
        for (const tr of viewUpdate.transactions) {
          const events = ['select', 'input', 'delete', 'move', 'undo', 'redo']
          if (!events.map(event => tr.isUserEvent(event)).some(Boolean)) {
            continue
          }
          if (tr.annotation(Transaction.remote)) {
            continue
          }
          let adj = 0
          tr.changes.iterChanges((fromA, toA, _, __, inserted) => {
            const insertText = inserted.toJSON().join('\n')
            doc.update(root => {
              root.content.edit(fromA + adj, toA + adj, insertText)
            }, `update content byA ${client.getID()}`)
            adj += insertText.length - (toA - fromA)
          })
        }
      }
    })

    // 6. CodeMirror 인스턴스 생성

    // minimap 설정을 위한 코드
    const create = (_: EditorView) => {
      const dom = document.createElement('div')
      return { dom }
    }

    const state = EditorState.create({
      doc: doc.getRoot().content.toString(),
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
        updateListener,
      ],
    })

    codemirrorViewRef.current = new EditorView({
      state,
      parent: editorRef.current ? editorRef.current : undefined,
    })

    // 5. Remote-change를 local에 적용시키는 핸들러 이벤트
    const handleOperations = (operations: Array<TextOperationInfo>) => {
      for (const op of operations) {
        if (op.type === 'edit') {
          handleEditOp(op)
        }
      }
    }

    const handleEditOp = (op: EditOpInfo) => {
      const changes = [
        {
          from: Math.max(0, op.from),
          to: Math.max(0, op.to),
          insert: op.value!.content,
        },
      ]

      codemirrorViewRef.current?.dispatch({
        changes,
        annotations: [Transaction.remote.of(true)],
      })
    }

    syncText()
  }, [])

  useEffect(() => {
    initializeYorkieEditor()

    // Cleanup function to destroy the editor when the component unmounts
    return () => {
      if (codemirrorViewRef.current) {
        codemirrorViewRef.current.destroy()
      }
    }
  }, [])

  return <Box ref={editorRef} minH="calc(100vh - 285px)" width="100%"></Box>
}

export default CodeEditor
