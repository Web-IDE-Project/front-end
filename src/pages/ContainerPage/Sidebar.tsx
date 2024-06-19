import { ArrowLeftIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Divider,
  Flex,
  IconButton,
  Image,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'
import Logo from '@/assets/images/logo.png'

const Sidebar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const categories = [
    { name: '내 컨테이너', path: '/container/my' },
    { name: '강의 컨테이너', path: '/container/lecture' },
    { name: '질문 컨테이너', path: '/container/question' },
  ]

  const onSidebarOpenButton = () => {
    toggleSidebar()
  }

  return (
    <Flex direction="column" p={4} h="full" position="fixed" width="250px">
      <Flex align="center">
        <Image width="80px" src={Logo} alt="3Ever" objectFit="contain" />
        <Spacer />
        <IconButton
          aria-label="Hide sidebar"
          icon={<ArrowLeftIcon />}
          bg="transparent"
          onClick={onSidebarOpenButton}
        />
      </Flex>
      <Flex align="center" py={8} pl={2} gap={2}>
        <Avatar name="Avatar" src="https://bit.ly/dan-abramov" />
        <Text fontSize="md" as="b">
          코딩 고수
        </Text>
      </Flex>
      <Divider orientation="horizontal" mb={3} />
      {categories.map((category, index) => {
        return (
          <NavLink key={index} to={category.path}>
            {({ isActive }) => (
              <Box
                w="full"
                h={55}
                as="button"
                bg={isActive ? 'gray.100' : ''}
                _hover={{ bg: 'gray.100' }}
                mt={2}
                borderRadius="xl"
                transition="background-color 0.3s"
              >
                <Flex p={4}>
                  <Text fontSize="md" mr={2}>
                    {category.name}
                  </Text>
                  <Text color="green.900">3</Text>
                </Flex>
              </Box>
            )}
          </NavLink>
        )
      })}
      <Spacer />
      <Divider orientation="horizontal" mb={3} />
      <Flex direction="column">
        <Box
          w="full"
          h={55}
          as="button"
          _hover={{ bg: 'gray.100' }}
          mt={2}
          borderRadius="xl"
          transition="background-color 0.3s"
        >
          <Flex p={4}>
            <Text fontSize="md">설정</Text>
          </Flex>
        </Box>
        <Box
          w="full"
          h={55}
          as="button"
          _hover={{ bg: 'gray.100' }}
          mt={2}
          borderRadius="xl"
          transition="background-color 0.3s"
        >
          <Flex p={4}>
            <Text fontSize="md">로그아웃</Text>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  )
}

export default Sidebar
