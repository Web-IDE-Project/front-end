import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
} from '@chakra-ui/react'
import NavBar from './NavBar'
import MenuBar from './MenuBar'
import Explorer from './Explorer'
import PermissionSettings from './PermissionSettings'
import { useState } from 'react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/python/python'
import 'codemirror/mode/clike/clike'
import TerminalComponent from './TerminalComponent'

const EditorPage = () => {
  const [value, setValue] = useState('console.log(hello);')

  return (
    <>
      {/* SECTION 상단바 - 로고, 저장/실행 버튼 */}
      <NavBar />

      {/* SECTION 하단 영역 */}
      <Flex minH="calc(100vh - 48px)">
        {/* SECTION 파일 탐색기, 터미널, 권한 관리 탭 */}
        <MenuBar />

        {/* SECTION 파일 탐색기/권한 관리 영역*/}
        <Box minW="180px" p={2} borderRight="1px" borderColor="gray.200">
          {/* <Explorer /> */}
          <PermissionSettings />
        </Box>

        {/* SECTION 에디터/터미널 영역 */}
        <Flex direction="column" w="100%">
          {/* SECTION 에디터 영역 */}
          <Box p={2} fontSize="sm">
            <Breadcrumb
              spacing="8px"
              separator={<ChevronRightIcon color="gray.500" />}
            >
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#">About</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#">Contact</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>

          <Box flexGrow={1}>
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

          {/* SECTION 터미널 영역 */}
          <Box h={200} overflow="hidden">
            <TerminalComponent />
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default EditorPage
