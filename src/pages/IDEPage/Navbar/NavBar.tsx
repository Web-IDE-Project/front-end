import {
  Button,
  Flex,
  IconButton,
  Image,
  Spacer,
  useToast,
} from '@chakra-ui/react'
import Logo from '@/assets/images/logo.png'
import { IoIosSave } from 'react-icons/io'
import { IoIosPlay } from 'react-icons/io'
import { FiMic } from 'react-icons/fi'
// import { FiMicOff } from 'react-icons/fi'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { useAppSelector } from '@/hooks'
import { selectCurrentFileContent, selectCurrentFileId } from '@/store/ideSlice'
import { saveFile } from '@/services/entry'

const NavBar = ({ containerId }: { containerId: string | undefined }) => {
  const toast = useToast()

  const currentFileId = useAppSelector(selectCurrentFileId)
  const currentFileContent = useAppSelector(selectCurrentFileContent)

  const saveButtonClick = async () => {
    const response = await saveFile(
      containerId!,
      currentFileId,
      currentFileContent
    )

    if (response.success) {
      toast({
        title: '파일이 저장되었습니다.',
        position: 'top',
        isClosable: true,
        colorScheme: 'green',
        status: 'success',
        duration: 3000,
      })
    } else {
      toast({
        title: '파일 저장에 에러가 발생했습니다.',
        position: 'top-right',
        status: 'error',
        isClosable: true,
        duration: 3000,
      })
    }
  }

  return (
    <Flex
      grow={1}
      p={2}
      align="center"
      gap={2}
      borderBottom="1px"
      borderColor="gray.200"
    >
      <Image width="80px" src={Logo} alt="3Ever" objectFit="contain" />
      <Spacer />
      <Button
        size="sm"
        colorScheme="green"
        variant="outline"
        leftIcon={<IoIosSave />}
        onClick={saveButtonClick}
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
