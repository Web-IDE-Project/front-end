import { Link } from 'react-router-dom';
import { Button, Flex, FormControl, Image, Input, Text, Box, Divider, AbsoluteCenter } from '@chakra-ui/react';
import logo from '../../assets/images/logo.png';

const LoginPage: React.FC = () => {
  return (
    <>
      <Flex w='full' h='100vh' bg='gray.50' align='center' justify='center'>
        <Flex flexDir='column' bg='white' p={6} borderRadius={10} align='center' maxW='500px' w='full' >
          <Image src={logo} boxSize='150px' objectFit='contain' mb={5} />
          <FormControl>
            <Input type="text" placeholder='아이디' mb={3} focusBorderColor='green.400' />
            <Input type="password" placeholder='비밀번호' mb={4} focusBorderColor='green.400' />
            <Button type="submit" w='full' bg='green.400' color='white' _hover={{ bg: 'green.500' }} variant='solid' mb={4}>로그인</Button>
          </FormControl>
          <Flex justify='space-between' w='full' >
            <Link to="/signup">
              <Text fontSize='small'>회원가입 하러가기</Text>
            </Link>
            <Link to=''>
              <Text fontSize='small'>아이디 비밀번호 찾기</Text>
            </Link>
          </Flex>
          <Box pos='relative' py={12} width='100%'>
            <Divider />
            <AbsoluteCenter bg='white' w='fit-content' p={4}>
              <Text color='gray.400' textAlign='center' fontSize='small'>또는</Text>
            </AbsoluteCenter>
          </Box>
          <Flex flexDir='column' w='full' gap={3} >
            <Link to='/oauth2/authorization/kakao' >
              <Button bg='yellow.300' _hover={{ bg: 'yellow.400' }} w='full'>카카오계정으로 로그인</Button>
            </Link>
            <Link to='/oauth2/authorization/naver'>
              <Button bg='green.400' color='white' _hover={{ bg: 'green.500' }} w='full'>네이버로 로그인</Button>
            </Link>
            <Link to='/oauth2/authorization/google'>
              <Button colorScheme='gray' w='full'>구글로 로그인</Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default LoginPage;