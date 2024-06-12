import { Search2Icon } from "@chakra-ui/icons";
import { Box, Button, Center, Flex, Input, InputGroup, InputLeftElement, Text, Image } from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from 'react'
import { StompConfig, Client } from '@stomp/stompjs';
import send from '../../../assets/images/send.png';

const BASE_URI: string = 'ws://localhost:8080';
const TOKEN: string = 'accessToken';
const workspaceId: number = 1;
const username: string = 'user';

interface Message {
	messageType: 'TALK' | 'ENTER' | 'EXIT';
	message: string;
	senderName: string;
}
interface PubMessage {
	messageType: 'TALK' | 'ENTER' | 'EXIT';
	message: string;
}

// 테스트 데이터
// const data: Message[] = [
// 	{
// 		"messageType": "ENTER",
// 		"senderName": "sender",
// 		"message": "[알림] 코딩 고수님이 입장하셨습니다."
// 	},
// 	{
// 		"messageType": "TALK",
// 		"senderName": "코딩 고수",
// 		"message": "마이크 허용해주시면 직접 설명해드릴게요!"
// 	},
// 	{
// 		"messageType": "TALK",
// 		"senderName": "me",
// 		"message": "감사합니다!!"
// 	},
// 	{
// 		"messageType": "TALK",
// 		"senderName": "me",
// 		"message": "허용해드렸으니 확인 부탁드려요~"
// 	},
// 	{
// 		"messageType": "EXIT",
// 		"senderName": "sender",
// 		"message": "[알림] 코딩 고수님이 퇴장하셨습니다."
// 	},
// 	{
// 		"messageType": "ENTER",
// 		"senderName": "sender",
// 		"message": "[알림] 코딩 고수님이 입장하셨습니다."
// 	},
// 	{
// 		"messageType": "TALK",
// 		"senderName": "코딩 고수",
// 		"message": "마이크 허용해주시면 직접 설명해드릴게요!"
// 	},
// 	{
// 		"messageType": "TALK",
// 		"senderName": "me",
// 		"message": "감사합니다!!"
// 	},
// 	{
// 		"messageType": "TALK",
// 		"senderName": "me",
// 		"message": "허용해드렸으니 확인 부탁드려요~"
// 	},
// 	{
// 		"messageType": "EXIT",
// 		"senderName": "sender",
// 		"message": "[알림] 코딩 고수님이 퇴장하셨습니다."
// 	},
// 	{
// 		"messageType": "ENTER",
// 		"senderName": "sender",
// 		"message": "[알림] 코딩 고수님이 입장하셨습니다."
// 	},
// 	{
// 		"messageType": "TALK",
// 		"senderName": "코딩 고수",
// 		"message": "마이크 허용해주시면 직접 설명해드릴게요!"
// 	},
// 	{
// 		"messageType": "TALK",
// 		"senderName": "me",
// 		"message": "감사합니다!!"
// 	},
// 	{
// 		"messageType": "TALK",
// 		"senderName": "me",
// 		"message": "허용해드렸으니 확인 부탁드려요~"
// 	},
// 	{
// 		"messageType": "EXIT",
// 		"senderName": "sender",
// 		"message": "[알림] 코딩 고수님이 퇴장하셨습니다."
// 	},
// 	{
// 		"messageType": "ENTER",
// 		"senderName": "sender",
// 		"message": "[알림] 코딩 고수님이 입장하셨습니다."
// 	},
// 	{
// 		"messageType": "TALK",
// 		"senderName": "코딩 고수",
// 		"message": "마이크 허용해주시면 직접 설명해드릴게요!"
// 	},
// 	{
// 		"messageType": "TALK",
// 		"senderName": "me",
// 		"message": "감사합니다!!"
// 	},
// 	{
// 		"messageType": "TALK",
// 		"senderName": "me",
// 		"message": "허용해드렸으니 확인 부탁드려요~"
// 	},
// 	{
// 		"messageType": "EXIT",
// 		"senderName": "sender",
// 		"message": "[알림] 코딩 고수님이 퇴장하셨습니다."
// 	},
// ]

interface BubbleProps {
	messageType: 'TALK' | 'ENTER' | 'EXIT';
	message: string;
	senderName: string;
}

const Bubble: React.FC<BubbleProps> = ({ messageType, message, senderName }) => {
	if (messageType === 'ENTER' || messageType === 'EXIT') {
		return (
			<Center my={3}>
				<Text fontSize='small'>{message}</Text>
			</Center>
		)
	}
	if (senderName === 'me') {
		return (
			<Box bg='green.100' p={2} fontSize='small' boxSize='fit-content' borderRadius={6} alignSelf='end' maxW='70%' >
				<Text>{message}</Text>
			</Box>
		)
	}
	return (
		<Flex>
			<Image src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmHtyKWEyMh3c5_FfZez-wqWCpj8ptLUbvOe1pAq4_ZdEvWtpyXHBbU4tqPI6UHawF7_Y&usqp=CAU' boxSize='40px' borderRadius='full' alt="user profile image" mr={2} mt={1} />
			<Box >
				<Text fontSize='small' fontWeight='500' >{senderName}</Text>
				<Box bg='gray.200' p={2} fontSize='small' boxSize='fit-content' borderRadius={6} maxW='70%' >
					<Text>{message}</Text>
				</Box>
			</Box>
		</Flex>
	)
}

const Chat: React.FC = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState('');
	const clientRef = useRef<Client | null>(null);

	useEffect(() => {
		const client = new Client({
			brokerURL: `${BASE_URI}/api/ws`,
			connectHeaders: {
				Authorization: TOKEN,
			},
			debug: (str) => {
				console.log(str);
			},
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
			onConnect: () => {
				client.subscribe(`/api/sub/${workspaceId}`, (message) => {
					const newMessage = JSON.parse(message.body);
					setMessages((prevMessages) => [...prevMessages, newMessage]);
				});
				client.publish({
					destination: `/api/pub/${workspaceId}`,
					body: JSON.stringify({
						messageType: 'ENTER',
						message: `${username} 님이 입장했습니다.`,
					}),
					headers: { Authorization: TOKEN },
				});
			},
			onDisconnect: () => {
				client.publish({
					destination: `/api/pub/${workspaceId}`,
					body: JSON.stringify({
						messageType: 'EXIT',
						message: `${username} 님이 퇴장했습니다.`,
					}),
					headers: { Authorization: TOKEN },
				});
			},
		} as StompConfig);

		client.activate();
		clientRef.current = client;

		return () => {
			client.deactivate();
		};
	}, [])

	const sendMessage = () => {
		if (!inputMessage) {
			return;
		}

		const message: PubMessage = {
			messageType: 'TALK',
			message: inputMessage,
		};

		const stringifiedMessage = JSON.stringify(message);

		clientRef.current?.publish({
			destination: `/api/pub/${workspaceId}`,
			body: stringifiedMessage,
			headers: { Authorization: TOKEN },
		});

		setInputMessage('');
	};

	return (
		<Flex h='full' w={400} border='1px solid #eee' flexDir='column' p={4} bg='gray.50' >
			<Text fontSize='small' mb={2} color='gray.700' >채팅(참여인원)</Text>
			<InputGroup bg='white' >
				<InputLeftElement pointerEvents='none'>
					<Search2Icon color='gray.300' />
				</InputLeftElement>
				<Input type='text' placeholder='검색' />
			</InputGroup>
			<Flex
				flex='1'
				flexDir='column'
				gap={1}
				py={4}
				overflow='scroll'
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
					<Text fontSize='small' color='gray.500'>채팅을 시작해보세요</Text>
				) : (
					messages.map((msg, index) => (
						<Bubble
							key={index}
							messageType={msg.messageType}
							message={msg.message}
							senderName={msg.senderName}
						/>
					))
				)}
			</Flex>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					sendMessage();
				}}
			>
				<Flex gap='8px' >
					<Input
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						type='text'
						placeholder="채팅을 입력하세요"
						bg='white'
					/>
					<Button colorScheme="green" type="submit" >
						<Image src={send} h='50%' />
					</Button>
				</Flex>
			</form>
		</Flex>
	)
}

export default Chat;