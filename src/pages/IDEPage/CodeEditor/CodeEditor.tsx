import { Box } from '@chakra-ui/react'
import { EditorState, Transaction } from '@codemirror/state'
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

  const [code, setCode] = useState("consle.log('hello!');")

  useEffect(() => {
    // NOTE - Yorkie
    const initializeYorkieEditor = async () => {
      // 1. 클라이언트 생성 및 활성화
      const client = new yorkie.Client(import.meta.env.VITE_YORKIE_API_ADDR, {
        apiKey: import.meta.env.VITE_YORKIE_API_KEY,
      })

      await client.activate()

      // 2. 클라이언트와 연결된 문서 생성
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

      doc.update(root => {
        if (!root.content) {
          root.content = new yorkie.Text()
        }
      }, 'create content if not exists')

      // 3. 문서의 변경 이벤트 구독
      // Remote-change 이벤트: 원격 doc의 content 값을 codemirror에 저장
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

      doc.subscribe('$.content', event => {
        if (event.type === 'remote-change') {
          const { operations } = event.value
          handleOperations(operations)
        }
      })

      await client.sync()

      // 4. codemirror에 바인딩하는 함수(원격지로 local의 변경 사항을 broadcast)
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

      // CodeMirror 인스턴스 생성
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
    }

    initializeYorkieEditor()

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
