import { Box, Center, Flex, Text, Avatar } from '@chakra-ui/react'
import { useAppSelector } from '@/hooks'
import { selectNickname, selectProfileUrl } from '@/store/userSlice'

interface BubbleProps {
  messageType: 'TALK' | 'ENTER' | 'EXIT'
  message: string
  senderName: string
  isHighlighted: boolean
}

const Bubble: React.FC<BubbleProps> = ({
  messageType,
  message,
  senderName,
  isHighlighted,
}) => {
  const username: string = useAppSelector(selectNickname)
  const profileUrl: string = useAppSelector(selectProfileUrl) || ''

  if (messageType === 'ENTER' || messageType === 'EXIT') {
    return (
      <Center my={3}>
        <Text fontSize="small">{message}</Text>
      </Center>
    )
  }
  if (senderName === username) {
    return (
      <Box
        bg={isHighlighted ? 'yellow.200' : 'green.100'}
        p={2}
        fontSize="small"
        w="fit-content"
        borderRadius={6}
        alignSelf="end"
        maxW="70%"
      >
        <Text>{message}</Text>
      </Box>
    )
  }
  return (
    <Flex>
      <Avatar src={profileUrl} boxSize="40px" mr={2} mt={1} />
      <Box>
        <Text fontSize="small" fontWeight="500">
          {senderName}
        </Text>
        <Box
          bg={isHighlighted ? 'yellow.200' : 'gray.200'}
          p={2}
          fontSize="small"
          w="fit-content"
          borderRadius={6}
          maxW="70%"
        >
          <Text>{message}</Text>
        </Box>
      </Box>
    </Flex>
  )
}

export default Bubble
