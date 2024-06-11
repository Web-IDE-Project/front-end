import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
} from '@chakra-ui/react'
import NavBar from './Navbar/NavBar'
import Explorer from './TabItem/Explorer'
// import PermissionSettings from './PermissionSettings'
import { ChevronRightIcon } from '@chakra-ui/icons'
import CodeEditor from './CodeEditor/CodeEditor'
import Terminal from './Terminal/Terminal'
import Tab from './Tab/Tab'

const IDEPage = () => {
  return (
    <>
      {/* SECTION 상단바 - 로고, 저장/실행 버튼 */}
      <NavBar />

      {/* SECTION 하단 영역 */}
      <Flex minH="calc(100vh - 48px)">
        {/* SECTION 파일 탐색기, 터미널, 권한 관리 탭 */}
        <Tab />

        {/* SECTION 파일 탐색기/권한 관리 영역*/}
        <Box minW="180px" p={2} borderRight="1px" borderColor="gray.200">
          <Explorer />
          {/* <PermissionSettings /> */}
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
          <Flex grow={1}>
            <CodeEditor language="javascript" />
          </Flex>

          {/* SECTION 터미널 영역 */}
          <Box h={200} overflow="hidden">
            <Terminal />
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default IDEPage
