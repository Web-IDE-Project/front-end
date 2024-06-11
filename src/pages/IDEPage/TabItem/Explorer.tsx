import { Flex, IconButton, Spacer, Text } from '@chakra-ui/react'
import {
  UncontrolledTreeEnvironment,
  Tree,
  StaticTreeDataProvider,
} from 'react-complex-tree'
import 'react-complex-tree/lib/style-modern.css'
import { FiFolderPlus } from 'react-icons/fi'
import { FiFilePlus } from 'react-icons/fi'

const Explorer = () => {
  const items = {
    root: {
      index: 'root',
      isFolder: true,
      children: ['child1', 'child2'],
      data: 'Root item',
    },
    child1: {
      index: 'child1',
      children: [],
      data: 'Child item 1',
    },
    child2: {
      index: 'child2',
      isFolder: true,
      children: ['child3'],
      data: 'Child item 2',
    },
    child3: {
      index: 'child3',
      children: [],
      data: 'Child item 3',
    },
  }

  const dataProvider = new StaticTreeDataProvider(items, (item, newName) => ({
    ...item,
    data: newName,
  }))

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
      <UncontrolledTreeEnvironment
        dataProvider={dataProvider}
        getItemTitle={item => item.data}
        viewState={{}}
        canDragAndDrop={false}
        canDropOnFolder={false}
        canReorderItems={true}
      >
        <Tree treeId="tree-2" rootItem="root" treeLabel="Tree Example" />
      </UncontrolledTreeEnvironment>
    </>
  )
}

export default Explorer
