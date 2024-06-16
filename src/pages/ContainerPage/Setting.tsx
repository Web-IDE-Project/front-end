import { PlusSquareIcon } from "@chakra-ui/icons";
import { Button, Divider, Flex, FormControl, FormLabel, Image, Input, Text, Box } from "@chakra-ui/react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormValues {
    nickname: string;
    password: string;
    confirmPassword: string;
};

const ERROR_MESSAGES = {
    REQUIRED: '이 필드는 필수입니다.',
    NICKNAME_INVALID: '닉네임은 한글, 알파벳 대소문자, 숫자만 허용됩니다.',
    NICKNAME_LENGTH: '아이디는 최소 2자에서 최대 20자까지 가능합니다.',
    PASSWORD_INVALID: '비밀번호는 알파벳, 숫자, 특수 문자를 포함해야 합니다.',
    PASSWORD_LENGTH: '비밀번호는 최소 8자에서 최대 20자까지 가능합니다.',
    PASSWORD_MATCH: '비밀번호가 일치하지 않습니다.',
}

const Setting = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            nickname: 'nickname',
            password: '',
            confirmPassword: ''
        }
    });
    const [changePassword, setChangePassword] = useState(false);

    const onSubmit: SubmitHandler<FormValues> = data => {
        console.log(data);
        alert('유저 정보가 변경되었습니다.');
    };

    return (
        <Flex flexDir='column' p={16} h='full' as="form" onSubmit={handleSubmit(onSubmit)}>
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
                        {...register("nickname", {
                            required: ERROR_MESSAGES.REQUIRED,
                            pattern: {
                                value: /^[가-힣a-zA-Z0-9]{2,20}$/,
                                message: ERROR_MESSAGES.NICKNAME_INVALID,
                            },
                            minLength: {
                                value: 2,
                                message: ERROR_MESSAGES.NICKNAME_LENGTH,
                            },
                            maxLength: {
                                value: 20,
                                message: ERROR_MESSAGES.NICKNAME_LENGTH,
                            },
                        })}
                        focusBorderColor="green.400"
                        flex={1}
                    />
                </Flex>
                {errors.nickname && <Text color="tomato">{errors.nickname.message}</Text>}
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
                    <Box mb={2}>
                        <FormLabel htmlFor="password">새 비밀번호</FormLabel>
                        <Input
                            id="password"
                            type="password"
                            {...register("password", {
                                required: ERROR_MESSAGES.REQUIRED,
                                pattern: {
                                    value:
                                        /^(?=.*[a-zA-Z])(?=.*[~!@#$%^&*()_+])(?=.*[0-9]).{8,15}$/,
                                    message: ERROR_MESSAGES.PASSWORD_INVALID,
                                },
                                minLength: {
                                    value: 8,
                                    message: ERROR_MESSAGES.PASSWORD_LENGTH,
                                },
                                maxLength: {
                                    value: 20,
                                    message: ERROR_MESSAGES.PASSWORD_LENGTH,
                                },
                            })}
                            focusBorderColor="green.400"
                            flex={1}
                        />
                        {errors.password && <Text color="tomato">{errors.password.message}</Text>}
                    </Box>

                    <Box>
                        <FormLabel htmlFor="confirmPassword">새 비밀번호 확인</FormLabel>
                        <Input
                            id="confirmPassword"
                            type="password"
                            {...register("confirmPassword", {
                                required: ERROR_MESSAGES.REQUIRED,
                                validate: value =>
                                    value === watch('password') || ERROR_MESSAGES.PASSWORD_MATCH,
                            })}
                            focusBorderColor="green.400"
                            flex={1}
                        />
                        {errors.confirmPassword && <Text color="tomato">{errors.confirmPassword.message}</Text>}
                    </Box>
                </FormControl>
            }

            <Flex flexGrow={1} />

            <Button colorScheme="green" type="submit">유저 정보 변경하기</Button>
        </Flex>
    );
}

export default Setting;
