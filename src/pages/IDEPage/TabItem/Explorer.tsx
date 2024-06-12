import { Flex, IconButton, Spacer, Text } from '@chakra-ui/react'
import { FiFolderPlus } from 'react-icons/fi'
import { FiFilePlus } from 'react-icons/fi'
import { FileSystemEntry } from '@/models/FileSystemEntryData'
import { getTreeItems } from '@/utils/treeview'
import { IoLogoJavascript } from 'react-icons/io5'
import { FaJava } from 'react-icons/fa'
import { PiFileCpp } from 'react-icons/pi'
import { DiPython } from 'react-icons/di'
import { IoCodeSlashOutline } from 'react-icons/io5'
import { FaRegFolder, FaRegFolderOpen } from 'react-icons/fa'
import TreeView, { ITreeViewOnNodeSelectProps } from 'react-accessible-treeview'
import './treeview.css'
import { useAppDispatch } from '@/hooks'
import {
  setCurrentFileContent,
  setCurrentFileId,
  setSelectedEntry,
} from '@/store/ideSlice'
// import { getFile } from '@/services/entry'

const Explorer = ({
  containerId,
  entries,
}: {
  containerId: string | undefined
  entries: FileSystemEntry[] | null
}) => {
  const dispatch = useAppDispatch()

  const items = getTreeItems(entries)

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
      if (containerId) {
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
      } else {
        console.log('containerId가 없습니다.')
      }
    }
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
        />
        <IconButton
          aria-label="add files"
          size="xs"
          bgColor="transparent"
          icon={<FiFilePlus />}
          fontSize="16px"
        />
      </Flex>
      <div>
        <div className="directory">
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
              level,
            }) => (
              <div
                {...getNodeProps()}
                style={{ paddingLeft: 20 * (level - 1) }}
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
        </div>
      </div>
    </>
  )
}

export default Explorer
