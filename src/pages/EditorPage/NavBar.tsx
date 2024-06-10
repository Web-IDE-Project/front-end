import { Button, Flex, IconButton, Image, Spacer } from '@chakra-ui/react'
import Logo from '@/assets/images/logo.png'
import { ChatIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { IoIosSave } from 'react-icons/io'
import { IoIosPlay } from 'react-icons/io'
import { FiMic } from 'react-icons/fi'
import { FiMicOff } from 'react-icons/fi'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'

const NavBar = () => {
  const navigate = useNavigate()

  return (
    <Flex grow={1} p={2} align="center" gap={2}>
      {/* <IconButton
          aria-label="Back"
          icon={<ArrowBackIcon />}
          size="sm"
          mr={2}
          bgColor="transparent"
          onClick={() => navigate('/container')}
        /> */}
      <Image width="80px" src={Logo} alt="3Ever" objectFit="contain" />
      <Spacer />
      <Button
        size="sm"
        colorScheme="green"
        variant="outline"
        leftIcon={<IoIosSave />}
      >
        저장
      </Button>
      <Button
        size="sm"
        colorScheme="green"
        variant="solid"
        leftIcon={<IoIosPlay />}
      >
        실행
      </Button>
      <Spacer />
      {/* TODO - 상태에 따라 아이콘 visibility 여부 설정 */}
      <IconButton
        size="sm"
        aria-label="mic"
        icon={<FiMic />}
        bgColor="transparent"
        fontSize={'20px'}
      />
      {/* <IconButton
        size="sm"
        aria-label="mic"
        icon={<FiMicOff />}
        bgColor="transparent"
        fontSize={'20px'}
      /> */}
      <IconButton
        size="sm"
        aria-label="chat"
        icon={<IoChatbubbleEllipsesOutline />}
        bgColor="transparent"
        fontSize={'20px'}
      />
    </Flex>
  )
}

export default NavBar
