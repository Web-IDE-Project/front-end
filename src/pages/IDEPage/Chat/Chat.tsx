import { Search2Icon } from "@chakra-ui/icons";
import { Box, Center, Flex, Input, InputGroup, InputLeftElement, Text, Image, IconButton } from "@chakra-ui/react"
import React from "react";
import send from '../../../assets/images/send.png';

interface Message {
    messageType: 'ENTER' | 'TALK' | 'EXIT';
    roomName: string;
    sender: string;
    message: string;
}

const data: Message[] = [
    {
        "messageType": "ENTER",
        "roomName": "roomName",
        "sender": "sender",
        "message": "[알림] 코딩 고수님이 입장하셨습니다."
    },
    {
        "messageType": "TALK",
        "roomName": "roomName",
        "sender": "코딩 고수",
        "message": "마이크 허용해주시면 직접 설명해드릴게요!"
    },
    {
        "messageType": "TALK",
        "roomName": "roomName",
        "sender": "me",
        "message": "감사합니다!!"
    },
    {
        "messageType": "TALK",
        "roomName": "roomName",
        "sender": "me",
        "message": "허용해드렸으니 확인 부탁드려요~"
    },
    {
        "messageType": "EXIT",
        "roomName": "roomName",
        "sender": "sender",
        "message": "[알림] 코딩 고수님이 퇴장하셨습니다."
    },
]

interface BubbleProps {
    messageType: 'ENTER' | 'TALK' | 'EXIT';
    sender: string;
    message: string;
}

const Bubble: React.FC<BubbleProps> = ({ messageType, sender, message }) => {
    if (messageType === 'ENTER' || messageType === 'EXIT') {
        return (
            <Center my={3}>
                <Text fontSize='small'>{message}</Text>
            </Center>
        )
    }
    if (sender === 'me') {
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
                <Text fontSize='small' fontWeight='500' >{sender}</Text>
                <Box bg='gray.200' p={2} fontSize='small' boxSize='fit-content' borderRadius={6} maxW='70%' >
                    <Text>{message}</Text>
                </Box>
            </Box>
        </Flex>
    )
}

const Chat: React.FC = () => {
    return (
        <Flex h='full' w={400} border='1px solid #eee' flexDir='column' p={4} bg='gray.50' >
            <Text fontSize='small' mb={2}>채팅(4)</Text>
            <InputGroup bg='white' >
                <InputLeftElement pointerEvents='none'>
                    <Search2Icon color='gray.300' />
                </InputLeftElement>
                <Input type='text' placeholder='검색' />
            </InputGroup>
            <Flex flex='1' flexDir='column' gap={1} py={4} >
                {data.map((msg, index) => <Bubble key={index} messageType={msg.messageType} sender={msg.sender} message={msg.message} />)}
            </Flex>
            <Flex gap='8px' >
                <Input type='text' placeholder="채팅을 입력하세요" bg='white' />
                <IconButton
                    colorScheme="green"
                    aria-label="send button"
                    icon={<Image src={send} h='50%' />}
                />
            </Flex>
        </Flex>
    )
}

export default Chat;