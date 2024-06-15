import { PlusSquareIcon } from "@chakra-ui/icons";
import { Button, Divider, Flex, FormControl, FormLabel, Image, Input, Text, Box } from "@chakra-ui/react";
import { useState } from "react";

const Setting = () => {
    const [changePassword, setChangePassword] = useState(false);
    const [formValues, setFormValues] = useState({
        nickname: 'nickname',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e: any) => {
        const { id, value } = e.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [id]: value
        }));
    };

    return (
        <Flex flexDir='column' p={16} h='full'>
            <Flex flexDir='column' align='center' position='relative'>
                <Box
                    position='relative'
                    onClick={() => alert('프로필 이미지 변경')}
                    cursor='pointer'
                    _hover={{
                        '& img': {
                            filter: 'brightness(0.7)',
                            transition: 'filter 0.3s',
                        },
                        '& svg': {
                            filter: 'brightness(0.7)',
                            transition: 'filter 0.3s',
                        }
                    }}
                >
                    <Image
                        src="https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/cnoC/image/Lc-6Nyq5qvRh6Aadda7a1mxqsO8"
                        alt="profile image"
                        boxSize='200px'
                        objectFit='cover'
                        borderRadius='full'
                        mb={4}
                    />
                    <PlusSquareIcon
                        boxSize={10}
                        color='gray.400'
                        position='absolute'
                        bottom={4}
                        right={4}
                    />
                </Box>
                <Button colorScheme="red" variant='outline' onClick={() => alert('프로필 이미지 삭제')}>이미지 삭제</Button>
            </Flex>

            <Divider marginY={8} />

            <Flex my={4}>
                <Text fontWeight='500' mr={4}>아이디</Text>
                <Text>username</Text>
            </Flex>
            <FormControl my={4}>
                <Flex align='center'>
                    <FormLabel htmlFor="nickname" mb="0" mr={4}>닉네임</FormLabel>
                    <Input
                        id="nickname"
                        type="text"
                        value={formValues.nickname}
                        onChange={handleInputChange}
                        focusBorderColor="green.400"
                        flex={1}
                    />
                </Flex>
            </FormControl>

            <Flex justifyContent='space-between' align='center' my={4}>
                <Text fontWeight='500'>비밀번호</Text>
                {!changePassword &&
                    <Button colorScheme="green" variant='outline' onClick={() => setChangePassword(true)}>비밀번호 변경</Button>
                }
                {changePassword &&
                    <Button colorScheme="red" variant='outline' onClick={() => setChangePassword(false)}>취소</Button>
                }
            </Flex>

            {changePassword &&
                <FormControl my={4}>
                    <Flex align='center' mb={2}>
                        <FormLabel htmlFor="password">새 비밀번호</FormLabel>
                        <Input
                            id="password"
                            type="password"
                            value={formValues.password}
                            onChange={handleInputChange}
                            focusBorderColor="green.400"
                            flex={1}
                        />
                    </Flex>

                    <Flex align='center'>
                        <FormLabel htmlFor="confirmPassword">새 비밀번호 확인</FormLabel>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={formValues.confirmPassword}
                            onChange={handleInputChange}
                            focusBorderColor="green.400"
                            flex={1}
                        />
                    </Flex>
                </FormControl>
            }

            <Flex flexGrow={1} />

            <Button colorScheme="green">유저 정보 변경하기</Button>
        </Flex>
    )
}

export default Setting;
