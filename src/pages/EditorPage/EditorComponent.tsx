import { UnControlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import '@/assets/styles/codemirror-override.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/python/python'
import 'codemirror/mode/clike/clike'
import { Box } from '@chakra-ui/react'
import { useState } from 'react'

const EditorComponent = () => {
  const [value, setValue] = useState("console.log('hello');")

  return (
    <Box flexGrow={1} overflow="scroll">
      <CodeMirror
        value={value}
        options={{
          mode: 'javascript', // 언어 모드 설정(text/x-java(java), python, javascript, text/x-csrc(c), text/x-c++src(c++))
          theme: 'base16-light', // 편집기 테마 설정
          lineNumbers: true,
        }}
        onChange={(editor, data, value) => {
          setValue(value)
        }}
        autoCursor
        autoScroll
      />
    </Box>
  )
}

export default EditorComponent
