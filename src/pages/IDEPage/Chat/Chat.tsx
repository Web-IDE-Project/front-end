import { Search2Icon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Image,
} from '@chakra-ui/react'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { Client, IMessage } from '@stomp/stompjs'
import send from '../../../assets/images/send.png'
import { useAppSelector } from '@/hooks'
import { selectNickname } from '@/store/userSlice'

const BASE_URI: string = 'ws://localhost:8080'
const workspaceId: number = 1 // props로 값 받을 예정
const username: string = useAppSelector(selectNickname)

interface Message {
  messageType: 'TALK' | 'ENTER' | 'EXIT'
  message: string
  senderName: string
}
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
      <Image
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmHtyKWEyMh3c5_FfZez-wqWCpj8ptLUbvOe1pAq4_ZdEvWtpyXHBbU4tqPI6UHawF7_Y&usqp=CAU"
        boxSize="40px"
        borderRadius="full"
        alt="user profile image"
        mr={2}
        mt={1}
      />
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

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)
  const clientRef = useRef<Client | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([])
  const messageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const client = new Client({
      brokerURL: `${BASE_URI}/api/ws`,
      beforeConnect: () => console.log('Attempting to connect...'),
      onConnect: () => handleWebSocketConnect(client),
      onDisconnect: () => handleWebSocketDisconnect(client),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: str => console.debug(str),
      onWebSocketClose: () => {
        console.error('WebSocket connection closed');
        setIsConnected(false)
      },
      onStompError: frame => {
        console.error('Broker reported error: ' + frame.headers['message'])
        console.error('Additional details: ' + frame.body)
      },
      onWebSocketError: event => {
        console.error('WebSocket error', event)
      },
    })

    client.activate()
    clientRef.current = client

    return () => {
      console.log('Component unmounting, deactivating WebSocket connection...');
      if (clientRef.current) {
        clientRef.current.deactivate()
      }
    }
  }, [])

  const handleWebSocketConnect = (client: Client) => {
    console.log('Connected to WebSocket')
    setIsConnected(true)

    client.subscribe(`/api/sub/chat/${workspaceId}`, (message: IMessage) => {
      const newMessage = JSON.parse(message.body) as Message
      setMessages(prevMessages => [...prevMessages, newMessage])
    })

    client.subscribe(`/api/sub/chat/${workspaceId}/count`, (message: IMessage) => {
      setSubscriberCount(parseInt(message.body, 10));
    });
    
    client.publish({
      destination: `/api/pub/chat/${workspaceId}`,
      body: JSON.stringify({
        messageType: 'ENTER',
        message: '',
      }),
    })

    client.publish({
      destination: `/api/pub/chat/${workspaceId}/count`,
      body: '',
    });
  }

  const handleWebSocketDisconnect = (client: Client) => {
    console.log('Disconnected from WebSocket')

    client.publish({
      destination: `/api/pub/chat/${workspaceId}`,
      body: JSON.stringify({
        messageType: 'EXIT',
        message: '',
      }),
    })
    
    setIsConnected(false)
    client.deactivate()
  }

  // 메시지 검색 기능
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setHighlightedIndices([])
      return
    }

    const indices = messages
      .map((message, index) => {
        if (
          message.messageType === 'TALK' &&
          message.message.includes(searchQuery)
        ) {
          return index
        }
        return -1
      })
      .filter(index => index !== -1)

    setHighlightedIndices(indices)

    if (indices.length > 0) {
      messageRefs.current[indices[indices.length - 1]]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [searchQuery, messages])

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputMessage.trim() || !isConnected || !clientRef.current) {
      return
    }

    clientRef.current?.publish({
      destination: `/api/pub/chat/${workspaceId}`,
      body: JSON.stringify({
        messageType: 'TALK',
        message: inputMessage,
      }),
    })

    setInputMessage('')
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <Flex
      h="full"
      w={350}
      border="1px solid #eee"
      flexDir="column"
      p={4}
      bg="gray.50"
    >
      <Text fontSize="small" mb={2} color="gray.700">
        채팅({subscriberCount})
      </Text>
      <InputGroup bg="white" mb={2}>
        <InputLeftElement pointerEvents="none">
          <Search2Icon color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="검색"
          value={searchQuery}
          onChange={handleSearchChange}
          focusBorderColor='green.400'
        />
      </InputGroup>
      <Flex
        flex="1"
        flexDir="column"
        gap={1}
        py={4}
        overflowY="scroll"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'none',
            borderRadius: '24px',
          },
        }}
      >
        {messages.length === 0 ? (
          <Text fontSize="small" color="gray.500">
            채팅을 시작해보세요
          </Text>
        ) : (
          messages.map((msg, index) => (
            <Flex
              ref={el => (messageRefs.current[index] = el)}
              key={index}
              flexDir="column"
            >
              <Bubble
                messageType={msg.messageType}
                message={msg.message}
                senderName={msg.senderName}
                isHighlighted={highlightedIndices.includes(index)}
              />
            </Flex>
          ))
        )}
      </Flex>
      <form onSubmit={sendMessage}>
        <Flex gap={2}>
          <Input
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            type="text"
            placeholder="채팅을 입력하세요"
            bg="white"
            focusBorderColor='green.400'
          />
          <Button colorScheme="green" type="submit">
            <Image src={send} h="50%" />
          </Button>
        </Flex>
      </form>
    </Flex>
  )
}

export default Chat
