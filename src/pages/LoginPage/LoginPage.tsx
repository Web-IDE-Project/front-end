import { Link, useNavigate } from 'react-router-dom';
import { Button, Flex, FormControl, Image, Input, Text, Box, Divider, AbsoluteCenter } from '@chakra-ui/react';
import logo from '../../assets/images/logo.png';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const onClickSocialButton = (path: string) => {
    navigate('/api/oauth2/authorization/' + path);
  }

  return (
    <>
      <Flex w='100%' h='100vh' bg='gray.50' align='center' justify='center'>
        <Flex flexDir='column' bg='white' p='24px' borderRadius='16px' align='center' maxW='500px' w='100%' >
          <Image src={logo} boxSize='150px' objectFit='contain' mb='20px' />
          <FormControl>
            <Input type="text" placeholder='아이디' mb='12px' focusBorderColor='green.400' />
            <Input type="password" placeholder='비밀번호' mb='16px' focusBorderColor='green.400' />
            <Button type="submit" w='100%' bg='green.400' color='white' _hover={{ bg: 'green.500' }} variant='solid' mb='16px'>로그인</Button>
          </FormControl>
          <Flex justify='space-between' w='100%' >
            <Link to="/signup">
              <Text fontSize='small'>회원가입 하러가기</Text>
            </Link>
            <Link to=''>
              <Text fontSize='small'>아이디 비밀번호 찾기</Text>
            </Link>
          </Flex>
          <Box pos='relative' py='12' width='100%'>
            <Divider />
            <AbsoluteCenter bg='white' w='50px'>
              <Text color='gray.400' textAlign='center' fontSize='small'>또는</Text>
            </AbsoluteCenter>
          </Box>
          <Flex flexDir='column' w='100%' gap='10px' >
            <Button onClick={() => onClickSocialButton('kakao')} bg='yellow.300' _hover={{ bg: 'yellow.400' }}>카카오계정으로 로그인</Button>
            <Button onClick={() => onClickSocialButton('naver')} bg='green.400' color='white' _hover={{ bg: 'green.500' }}>네이버로 로그인</Button>
            <Button onClick={() => onClickSocialButton('google')} colorScheme='gray'>구글로 로그인</Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default LoginPage;