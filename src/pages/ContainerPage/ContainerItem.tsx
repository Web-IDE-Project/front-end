import { Container } from '@/models/ContainerData'
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

interface Props extends Container {
  category: string
}

const ContainerItem = ({ title, language, description, category }: Props) => {
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
      <Flex align="center" px={5} pt={3}>
        <Spacer />
        <Text fontSize="sm" pr={1}>
          nickname
        </Text>
        <Avatar name="Avatar" size="sm" src="https://bit.ly/dan-abramov" />
      </Flex>
      {/* Card Body */}
      <CardFooter pt={3}>
        <Button w="100%" size="sm" variant="outline">
          실행
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ContainerItem
