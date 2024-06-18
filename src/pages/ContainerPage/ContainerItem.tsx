import Modal from '@/components/Modal'
import { Container } from '@/models/container'
import { editContainerInfo } from '@/services/container'
import { DeleteIcon, SettingsIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Input,
  Select,
  Spacer,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props extends Container {
  category: string
}

const ContainerItem = ({
  id,
  title,
  language,
  description,
  nickname,
  profileUrl,
  category,
}: Props) => {
  const navigate = useNavigate()

  const [newTitle, setNewTitle] = useState(title)
  const [newDesc, setNewDesc] = useState(description)
  const [sharingOption, setSharingOption] = useState('MY')

  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleEditContainerInfo = async () => {
    const response = await editContainerInfo(
      id.toString(),
      newTitle,
      newDesc,
      sharingOption
    )

    if (response.success) {
      toast({
        title: '컨테이너 정보가 수정되었습니다.',
        position: 'top-right',
        isClosable: true,
        colorScheme: 'green',
        status: 'success',
        duration: 3000,
      })
    } else {
      toast({
        title: '컨테이너 정보가 수정에 오류가 발생했습니다.',
        position: 'top-right',
        isClosable: true,
        status: 'error',
        duration: 3000,
      })
    }

    modalClose()
  }

  const modalClose = () => {
    setNewTitle(title)
    setNewDesc(description)
    setSharingOption('MY')
    onClose()
  }

  return (
    <>
      <Card minH={280}>
        <CardHeader>
          <Flex align="center">
            <Heading size="md">{title}</Heading>
            <Spacer />
            {category === '내 컨테이너' && (
              <>
                <IconButton
                  aria-label="Settings"
                  bg="transparent"
                  size="sm"
                  icon={<SettingsIcon />}
                  onClick={onOpen}
                />
                <IconButton
                  aria-label="Delete Container"
                  bg="transparent"
                  size="sm"
                  icon={<DeleteIcon />}
                />
              </>
            )}
          </Flex>
          <Badge colorScheme="green" size="sm" mt={2}>
            {language}
          </Badge>
        </CardHeader>
        {/* Card Body */}
        <Text px={5}>{description}</Text>
        <Spacer />
        <Flex
          align="center"
          px={5}
          pt={3}
          display={nickname && profileUrl ? 'flex' : 'none'}
        >
          <Spacer />
          <Text fontSize="sm" pr={1}>
            {nickname}
          </Text>
          <Avatar name="Avatar" size="sm" src={profileUrl} />
        </Flex>
        {/* Card Body */}
        <CardFooter pt={3}>
          <Button
            w="100%"
            size="sm"
            variant="outline"
            onClick={() => navigate(`/container/${id}/workspace`)}
          >
            {/* TODO - 현재 로그인한 사용자가 생성하지 않은 컨테이너는 '참여' 버튼으로 보여주기(강의/질문 컨테이너) */}
            실행
          </Button>
        </CardFooter>
      </Card>
      <Modal
        isOpen={isOpen}
        onClose={modalClose}
        title="컨테이너 정보 수정"
        cancelMessage="취소"
        confirmMessage="수정"
        confirmCallback={handleEditContainerInfo}
      >
        <Text fontWeight="bold" mb={1}>
          이름
        </Text>
        <Input
          placeholder="컨테이너 이름을 입력해주세요."
          size="sm"
          borderRadius="md"
          mb={4}
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          isInvalid={newTitle === ''}
        />
        <Flex align="center">
          <Text mb={1}>
            <b>설명</b>(선택)
          </Text>
          <Spacer />
          <Text fontSize="sm" color="gray">
            {description.length < 60 ? description.length : 60}
            /60 자
          </Text>
        </Flex>
        <Textarea
          value={newDesc}
          onChange={e => setNewDesc(e.target.value)}
          placeholder="컨테이너 설명을 입력해주세요."
          size="sm"
          borderRadius="md"
          mb={4}
          resize="none"
          maxLength={60}
          isInvalid={newDesc === ''}
        />
        <Text mb={1}>공유 설정</Text>
        <Select
          size="sm"
          borderRadius="md"
          value={sharingOption}
          onChange={e => setSharingOption(e.target.value)}
          defaultValue={'MY'}
        >
          <option value="MY">
            비공개(나의 컨테이너에서만 확인 가능합니다.)
          </option>
          <option value="QUESTION">질문 컨테이너에 공개</option>
          <option value="LECTURE">강의 컨테이너에 공개</option>
        </Select>
      </Modal>
    </>
  )
}

export default ContainerItem
