import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { FiFolderPlus } from 'react-icons/fi'
import { FiFilePlus } from 'react-icons/fi'
import { FileSystemEntry, TreeItem } from '@/models/FileSystemEntryData'
import { getTreeItems } from '@/utils/treeview'
import { IoLogoJavascript } from 'react-icons/io5'
import { FaJava } from 'react-icons/fa'
import { PiFileCpp } from 'react-icons/pi'
import { DiPython } from 'react-icons/di'
import { IoCodeSlashOutline } from 'react-icons/io5'
import { FaRegFolder, FaRegFolderOpen } from 'react-icons/fa'
import TreeView, { ITreeViewOnNodeSelectProps } from 'react-accessible-treeview'
import './treeview.css'
import { useAppDispatch, useAppSelector } from '@/hooks'
import {
  selectEntry,
  setCurrentFileContent,
  setCurrentFileId,
  setSelectedEntry,
} from '@/store/ideSlice'
import { useRef, useState } from 'react'
import { createDirectory, createFile } from '@/services/entry'
// import { getFile } from '@/services/entry'

const Explorer = ({
  containerId,
  entries,
}: {
  containerId: string | undefined
  entries: FileSystemEntry[] | null
}) => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const dispatch = useAppDispatch()
  const selectedEntry = useAppSelector(selectEntry)

  const selectedTreeNodeRef = useRef<HTMLDivElement>(null)

  const [items, setItems] = useState<TreeItem[] | null>(getTreeItems(entries))
  const [newEntryName, setNewEntryName] = useState('')
  const [newEntryType, setNewEntryType] = useState('')

  const FolderIcon = ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? (
      <FaRegFolderOpen color="e8a87c" className="icon" />
    ) : (
      <FaRegFolder color="e8a87c" className="icon" />
    )

  const FileIcon = ({ filename }: { filename: string }) => {
    const extension = filename.slice(filename.lastIndexOf('.') + 1)
    switch (extension) {
      case 'js':
        return <IoLogoJavascript color="#ECC94B" className="icon" />
      case 'java':
        return <FaJava color="orange" className="icon" />
      case 'py':
        return <DiPython color="green" className="icon" />
      case 'cpp':
        return <PiFileCpp color="blue" className="icon" />
      default:
        return <IoCodeSlashOutline color="gray" className="icon" />
    }
  }

  const onNodeSelect = async ({
    element,
    isBranch,
  }: ITreeViewOnNodeSelectProps) => {
    if (isBranch) {
      dispatch(
        setSelectedEntry({ type: 'directory', id: element.id as number })
      )
    } else {
      dispatch(setSelectedEntry({ type: 'file', id: element.id as number }))
      dispatch(setCurrentFileId(element.id as number))

      // 선택된 파일 가져와서 currentFileContent에 저장

      // const response = await getFile(containerId, element.id)

      // if (response.success && response.data) {
      //   dispatch(setCurrentFileContent(response.data.content))
      // }  else {
      //   console.log('Error fetching file', response.error)
      // }

      // NOTE - 테스트용 코드 내용
      dispatch(
        setCurrentFileContent(
          `지금 열린 파일은 ${containerId}번 컨테이너에 있는 ${element.id}번 파일입니다. `
        )
      )
    }
  }

  // 탐색기 중 파일 외부를 클릭하면 루트 디렉토리를 클릭한 것과 같다.
  const onRootDirectoryClick = () => {
    // 이전에 select 상태였던 노드를 deselect한 것처럼 보여주기
    selectedTreeNodeRef.current?.classList.remove('tree-node--selected')

    dispatch(setSelectedEntry({ type: 'directory', id: 1 }))
  }

  const addDirectoryButtonClick = () => {
    if (selectedEntry.type === 'file') {
      toast({
        title: '파일에 디렉토리를 생성할 수 없습니다.',
        position: 'top-right',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } else {
      setNewEntryType('directory')
      onOpen()
    }
  }

  const createNewDirectory = async () => {
    const response = await createDirectory(
      containerId!,
      selectedEntry.id,
      newEntryName
    )

    if (response.success) {
      const newEntries = [...entries!, response.data]
      setItems(getTreeItems(newEntries as FileSystemEntry[]))
      toast({
        title: '디렉토리가 생성되었습니다.',
        position: 'top-right',
        colorScheme: 'green',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: '디렉토리 생성 실패',
        description: response.error,
        position: 'top-right',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const addFileButtonClick = () => {
    setNewEntryType('file')
    onOpen()
  }

  const createNewFile = async () => {
    let parentDirectoryId

    if (selectedEntry.id === 1) {
      parentDirectoryId = 1
    }

    if (selectedEntry.type === 'file') {
      parentDirectoryId = entries?.find(
        entry => entry.id === selectedEntry.id
      )?.parentId
    } else {
      parentDirectoryId = selectedEntry.id
    }

    if (!parentDirectoryId) {
      console.log('No parent directory')
    }

    const response = await createFile(
      containerId!,
      parentDirectoryId!,
      newEntryName
    )

    if (response.success) {
      const newEntries = [...entries!, response.data]
      setItems(getTreeItems(newEntries as FileSystemEntry[]))
      toast({
        title: '파일이 생성되었습니다.',
        position: 'top-right',
        colorScheme: 'green',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: '파일 생성 실패',
        description: response.error,
        position: 'top-right',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const modalClose = () => {
    onClose()
    setNewEntryName('')
  }

  return (
    <>
      <Flex align="center">
        <Text fontSize="sm">탐색기</Text>
        <Spacer />
        <IconButton
          aria-label="add folder"
          size="xs"
          bgColor="transparent"
          icon={<FiFolderPlus />}
          fontSize="16px"
          onClick={addDirectoryButtonClick}
        />
        <IconButton
          aria-label="add files"
          size="xs"
          bgColor="transparent"
          icon={<FiFilePlus />}
          fontSize="16px"
          onClick={addFileButtonClick}
        />
      </Flex>
      <Flex className="directory" direction="column" minH="calc(100vh - 120px)">
        <TreeView
          data={items!}
          aria-label="directory tree"
          onNodeSelect={onNodeSelect}
          defaultExpandedIds={[2]}
          defaultSelectedIds={[3]}
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            getNodeProps,
            isSelected,
            level,
          }) => (
            <div
              {...getNodeProps()}
              style={{ paddingLeft: 20 * (level - 1) }}
              ref={isSelected ? selectedTreeNodeRef : null}
            >
              {isBranch ? (
                <FolderIcon isOpen={isExpanded} />
              ) : (
                <FileIcon filename={element.name} />
              )}

              {element.name}
            </div>
          )}
        />
        <Box flexGrow={1} onClick={onRootDirectoryClick} />
      </Flex>

      {/* 디렉토리/파일 생성 모달 */}
      <Modal isOpen={isOpen} onClose={modalClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg" fontWeight="bold">
            {newEntryType === 'file' ? '파일 생성하기' : '디렉토리 생성하기'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold" mb={1}>
              이름
            </Text>
            <Input
              placeholder={`생성할 ${newEntryType === 'file' ? '파일' : '디렉토리'}의 이름을 입력해주세요.`}
              size="sm"
              borderRadius="md"
              mb={4}
              value={newEntryName}
              onChange={e => setNewEntryName(e.target.value)}
              isInvalid={newEntryName === ''}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={modalClose} size="sm">
              취소
            </Button>
            <Button
              variant="solid"
              colorScheme="green"
              size="sm"
              onClick={
                newEntryType === 'file' ? createNewFile : createNewDirectory
              }
            >
              생성
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Explorer
