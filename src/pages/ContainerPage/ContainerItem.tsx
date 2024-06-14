import { Container } from '@/models/container'
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
  Spacer,
  Text,
} from '@chakra-ui/react'
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

  return (
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
  )
}

export default ContainerItem
