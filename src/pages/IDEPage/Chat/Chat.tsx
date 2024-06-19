import { Search2Icon } from '@chakra-ui/icons'
import {
  Button,
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
import Bubble from './Bubble'

const BASE_URI: string = 'ws://localhost:8080'
const workspaceId: number = 1 // props로 값 받을 예정

interface Message {
  messageType: 'TALK' | 'ENTER' | 'EXIT'
  message: string
  senderName: string
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
  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null);

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
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Flex
      h="full"
      w={350}
      border="1px solid #eee"
      flexDir="column"
      p={4}
      bg="gray.50"
    >
      <Text fontSize="small" mb={2} color="gray.700">채팅({subscriberCount})</Text>
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
        ref={chatContainerRef}
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
          <Text fontSize="small" color="gray.500">채팅을 시작해보세요</Text>
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
            ref={inputRef}
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
