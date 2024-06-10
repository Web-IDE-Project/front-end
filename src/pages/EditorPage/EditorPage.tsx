import { Box, Flex } from '@chakra-ui/react'
import NavBar from './NavBar'
import MenuBar from './MenuBar'
import Explorer from './Explorer'
import PermissionSettings from './PermissionSettings'

const EditorPage = () => {
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

        {/* SECTION 에디터 영역 */}
        <Box></Box>

        {/* SECTION 터미널 영역 */}
        <Box></Box>
      </Flex>
    </>
  )
}

export default EditorPage
