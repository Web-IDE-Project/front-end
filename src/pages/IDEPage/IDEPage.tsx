import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
} from '@chakra-ui/react'
import NavBar from './Navbar/NavBar'
import { ChevronRightIcon } from '@chakra-ui/icons'
import CodeEditor from './CodeEditor/CodeEditor'
import Terminal from './Terminal/Terminal'
import Tab from './Tab/Tab.tsx'
import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { startContainer } from '@/services/container'
import Loading from './Loading'
import Explorer from './TabItem/Explorer'
import { useAppDispatch, useAppSelector } from '@/hooks'
import {
  selectShowChatting,
  selectShowExplorer,
  selectShowTerminal,
  setCurrentFile,
  setSelectedNode,
  setTree,
} from '@/store/ideSlice'
import { flattenTree } from 'react-accessible-treeview'
import { Tree, nodeMetadata } from '@/models/entry.ts'
import Chat from './Chat/Chat.tsx'
import { selectId } from '@/store/userSlice.ts'
import useYorkieFileTree from '@/hooks/useYorkieFileTree.ts'

const CATEGORY: { [key: string]: string } = {
  '내 컨테이너': 'MY',
  '강의 컨테이너': 'LECTURE',
  '질문 컨테이너': 'QUESTION',
}

const IDEPage = () => {
  const { containerId } = useParams()
  const dispatch = useAppDispatch()

  const showTerminal = useAppSelector(selectShowTerminal)
  const showExplorer = useAppSelector(selectShowExplorer)
  const showChatting = useAppSelector(selectShowChatting)
  const userId = useAppSelector(selectId)

  const location = useLocation()
  const locationState = { ...location.state }
  const category = CATEGORY[locationState.category]
  const isOwner = locationState.ownerId === userId
  const title = locationState.title
  const status = locationState.status

  const { isLoading: isExplorerLoading } = useYorkieFileTree(containerId!)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // NOTE - 상태 추적 변수: 로딩 중 컴포넌트가 언마운트되면 요청을 중단한다.
    let isCancelled = false

    const startContainerRequest = async () => {
      setIsLoading(true) // 로딩 시작

      try {
        const response = await startContainer(Number(containerId))

        if (!isCancelled && response.success) {
          const tree = flattenTree<nodeMetadata>(response.data!)
          dispatch(setTree(tree as Tree))

          if (tree.length > 1) {
            dispatch(setCurrentFile(tree[1]))
            dispatch(setSelectedNode(tree[1]))
          }
        } else {
          console.log('Error fetching file system entries', response.error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    setIsLoading(false)

    startContainerRequest()

    return () => {
      isCancelled = true
    }
  }, [containerId])

  if (isLoading || isExplorerLoading) {
    // 로딩 중일 때 보여줄 UI
    return <Loading />
  }

  return (
    <>
      {/* SECTION 상단바 - 로고, 저장/실행 버튼 */}
      <NavBar
        containerId={containerId}
        status={status}
        category={category}
        isOwner={isOwner}
      />

      {/* SECTION 하단 영역 */}
      <Flex minH="calc(100vh - 48px)">
        {/* SECTION 파일 탐색기, 터미널, 권한 관리 탭 */}
        <Tab
          containerId={containerId}
          category={category}
          isOwner={isOwner}
          status={status}
        />

        {/* SECTION 파일 탐색기/권한 관리 영역 */}
        <Box
          minW="180px"
          p={2}
          borderRight="1px"
          borderColor="gray.200"
          display={showExplorer ? 'block' : 'none'}
        >
          <Box display={showExplorer ? 'block' : 'none'}>
            <Explorer
              containerId={containerId}
              category={category}
              isOwner={isOwner}
              title={title}
              status={status}
            />
          </Box>
        </Box>

        {/* SECTION 에디터/터미널 영역 */}
        <Flex direction="column" w="100%">
          {/* SECTION 에디터 영역 */}
          {/* TODO - 경로 보여주기 */}
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
            <CodeEditor
              containerId={containerId}
              category={category}
              isOwner={isOwner}
              status={status}
            />
          </Flex>

          {/* SECTION 터미널 영역 */}
          <Box h={showTerminal ? 200 : 0}>
            <Terminal containerId={containerId} />
          </Box>
        </Flex>

        {/* SECTION 채팅창 영역 */}
        {category !== 'MY' && (
          <Box display={showChatting ? 'block' : 'none'}>
            <Chat workspaceId={containerId} />
          </Box>
        )}
      </Flex>
    </>
  )
}

export default IDEPage
