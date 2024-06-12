import { FileSystemEntry, TreeItem } from '@/models/FileSystemEntryData'

/** react-accessible-treeview의 data 형태로 변환 */
export function getTreeItems(entries: FileSystemEntry[] | null) {
  if (entries === null) {
    return null
  }

  const result: TreeItem[] = [
    {
      name: 'RootDirectory',
      children: entries
        .filter(entry => entry.parentId === 1)
        .map(entry => entry.id),
      id: 1,
      parent: null,
    },
  ]
  const idToIndexMap = new Map()

  entries.forEach(entry => {
    const { id, name, parentId } = entry
    const newItem: TreeItem = { name, id, parent: parentId, children: [] }

    // 디렉토리의 children 배열 초기화
    newItem.children = []

    result.push(newItem)

    // Keep track of the index of each item in the result array
    idToIndexMap.set(id, result.length - 1)
  })

  result.forEach(item => {
    // If the item has a parent, add it to the parent's children array
    if (item.parent !== null) {
      const parentIndex = idToIndexMap.get(item.parent)
      if (parentIndex !== undefined) {
        result[parentIndex].children.push(item.id)
      }
    }
  })

  return result
}
