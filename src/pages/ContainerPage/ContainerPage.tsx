import { Flex } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const ContainerPage = () => {
  return (
    <Flex minH="100%">
      <Sidebar />
      <Outlet />
    </Flex>
  )
}

export default ContainerPage
