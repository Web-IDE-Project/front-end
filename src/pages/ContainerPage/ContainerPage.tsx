import { Box, Flex } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const ContainerPage = () => {
  return (
    <Flex minH="100%">
      <Sidebar />
      <Box flexGrow={1} bg="gray.50">
        <Outlet />
      </Box>
    </Flex>
  )
}

export default ContainerPage
