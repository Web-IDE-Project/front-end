import { Box, Flex } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'

export const ContainerPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  return (
    <Flex minH="100%">
      <Box
        w={isSidebarOpen ? '250px' : '0'}
        transition="width 0.3s"
        overflow="hidden"
      >
        <Sidebar />
      </Box>
      <Box
        flexGrow={1}
        bg="gray.50"
        ml={isSidebarOpen ? '250px' : '0'}
        transition="margin-left 0.3s"
      >
        <IconButton
          icon={isSidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={toggleSidebar}
          position="absolute"
          top="1rem"
          left="1rem"
          zIndex="1"
        />
        <Outlet />
      </Box>
    </Flex>
  )
}
