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
import AudioCapture from './AudioCapture'

const BASE_URI: string = 'ws://localhost:8080'

interface Message {
  messageType: 'TALK' | 'ENTER' | 'EXIT'
  message: string
  senderName: string
}

interface Participant {
  id: string
  name: string
}

const Chat = ({ workspaceId }: { workspaceId: string | undefined }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)
  // const [isMuted, setIsMuted] = useState(false); // 로컬 마이크의 음소거 상태

  const clientRef = useRef<Client | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([])
  const messageRefs = useRef<(HTMLDivElement | null)[]>([])
  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteStreams = useRef<{ [key: string]: MediaStream }>({})
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({})

  const [participants, setParticipants] = useState<Participant[]>([])

  useEffect(() => {
    setParticipants([
      { id: '1', name: 'Participant 1' },
      { id: '2', name: 'Participant 2' },
    ])
  }, [])

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
        console.error('WebSocket connection closed')
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
      console.log('Component unmounting, deactivating WebSocket connection...')
      if (client) {
        client.deactivate()
      }
    }
  }, [])

  const handleWebSocketConnect = (client: Client) => {
    console.log('Connected to WebSocket')
    setIsConnected(true)

    client.subscribe(`/api/sub/chat/${workspaceId}`, (message: IMessage) => {
      const newMessage = JSON.parse(message.body) as Message
      setMessages(prevMessages => [...prevMessages, newMessage])

      // JSON.stringify 시 타입 에러 발생
      const newParticipant = {
        id: '3',
        name: 'Participant 3',
      }

      setParticipants(prevParticipants => [...prevParticipants, newParticipant])
    })

    client.subscribe(
      `/api/sub/chat/${workspaceId}/count`,
      (message: IMessage) => {
        setSubscriberCount(parseInt(message.body, 10))
      }
    )

    client.subscribe(
      `/api/sub/webrtc/${workspaceId}/offer`,
      (message: IMessage) => {
        handleReceiveOffer(JSON.parse(message.body))
      }
    )

    client.subscribe(
      `/api/sub/webrtc/${workspaceId}/answer`,
      (message: IMessage) => {
        handleReceiveAnswer(JSON.parse(message.body))
      }
    )

    client.subscribe(
      `/api/sub/webrtc/${workspaceId}/ice-candidate`,
      (message: IMessage) => {
        handleReceiveIceCandidate(JSON.parse(message.body))
      }
    )

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
    })

    // 로컬 오디오 스트림을 시작하고, 다른 사용자들에게 음성 통화 요청
    startLocalStream().then(() => {
      // 다른 사용자에게 통화 시작 알림
      callAllUsers()
    })
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

  // 로컬 오디오 스트림 가져오기
  const startLocalStream = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      }) // 사용자에게 오디오 접근 권한을 요청
      localStreamRef.current = localStream
    } catch (error: any) {
      console.error('Error accessing local media:', error)
      alert(`Error accessing local media: ${error.message}`)
    }
  }

  // 로컬 오디오 스트림 정지
  const stopLocalStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
      localStreamRef.current = null
    }
  }

  // 피어 연결 설정 및 ICE candidate 이벤트 핸들링 (특정 사용자와의 피어 연결을 설정)
  const setupPeerConnection = (peerId: string) => {
    // RTCPeerConnection 객체를 생성 및 ICE 서버 설정
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })

    peerConnections.current[peerId] = peerConnection

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        sendMessage(
          `/api/pub/webrtc/${workspaceId}/ice-candidate`,
          JSON.stringify({ peerId, candidate: event.candidate })
        )
      }
    }

    peerConnection.ontrack = event => {
      if (!remoteStreams.current[peerId]) {
        remoteStreams.current[peerId] = new MediaStream()
        const remoteAudio = document.createElement('audio')
        remoteAudio.id = `remoteAudio-${peerId}`
        remoteAudio.autoplay = true
        document.body.appendChild(remoteAudio)
        remoteAudio.srcObject = remoteStreams.current[peerId]
      }
      remoteStreams.current[peerId].addTrack(event.track)
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current!)
      })
    }

    return peerConnection
  }

  // Offer 수신 처리
  const handleReceiveOffer = async (data: {
    peerId: string
    sdp: RTCSessionDescriptionInit
  }) => {
    const { peerId, sdp } = data
    const peerConnection = setupPeerConnection(peerId) // 피어 연결 설정
    await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp)) // SDP 설정
    const answer = await peerConnection.createAnswer() // answer 생성 및 상대방에게 전송
    await peerConnection.setLocalDescription(answer)
    sendMessage(
      `/api/pub/webrtc/${workspaceId}/answer`,
      JSON.stringify({ peerId, sdp: answer })
    )
  }

  // Answer 수신 처리
  const handleReceiveAnswer = async (data: {
    peerId: string
    sdp: RTCSessionDescriptionInit
  }) => {
    const { peerId, sdp } = data
    const peerConnection = peerConnections.current[peerId]
    await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp)) // Remote SDP 설정
  }

  // ICE candidate 수신 처리
  const handleReceiveIceCandidate = async (data: {
    peerId: string
    candidate: RTCIceCandidateInit
  }) => {
    const { peerId, candidate } = data
    const peerConnection = peerConnections.current[peerId]
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate)) // ICE candidate 추가
  }

  // 메시지 전송
  const sendMessage = (destination: string, body: string) => {
    if (clientRef.current && isConnected) {
      clientRef.current.publish({ destination, body })
    }
  }

  // 모든 사용자에게 통화 요청 보내기
  const callAllUsers = async () => {
    //  애플리케이션 상태 또는 백엔드 엔드포인트에서 연결된 피어 ID 목록을 검색
    const peerIds = Object.keys(peerConnections.current)
    for (const peerId of peerIds) {
      callUser(peerId)
    }
  }

  // 특정 사용자에게 통화 요청 보내기
  const callUser = async (peerId: string) => {
    // 해당 사용자의 PeerConnection을 설정하고, Offer를 전송하여 통화 요청
    const peerConnection = setupPeerConnection(peerId)
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    sendMessage(
      `/api/pub/webrtc/${workspaceId}/offer`,
      JSON.stringify({ peerId, sdp: offer })
    )
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

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
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
      inputRef.current.focus()
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
      h="100vh"
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
          focusBorderColor="green.400"
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
      <form onSubmit={handleSendMessage}>
        <Flex gap={2}>
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            type="text"
            placeholder="채팅을 입력하세요"
            bg="white"
            focusBorderColor="green.400"
          />
          <Button colorScheme="green" type="submit">
            <Image src={send} h="50%" />
          </Button>
        </Flex>
      </form>

      {participants.map(participant => (
        <div key={participant.id}>
          <h3>{participant.name}</h3>
          <AudioCapture key={participant.id} />{' '}
          {/* 각 참가자에 대해 AudioCapture 컴포넌트를 렌더링 */}
        </div>
      ))}
    </Flex>
  )
}

export default Chat
