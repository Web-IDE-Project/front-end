import { Button, Flex, FormControl, Image, Input, FormLabel } from '@chakra-ui/react';
import logo from '../../assets/images/logo.png';

const SignUp: React.FC = () => {
  return (
    <>
      <Flex w='100%' h='100vh' bg='gray.50' align='center' justify='center'>
        <Flex flexDir='column' bg='white' p='24px' borderRadius='16px' align='center' maxW='500px' w='100%' >
          <Image src={logo} boxSize='150px' objectFit='contain' mb='20px' />
          <FormControl>
            <FormLabel>아이디</FormLabel>
            <Input type="text" placeholder='아이디' mb='32px' focusBorderColor='green.400' />
            <FormLabel>닉네임</FormLabel>
            <Input type="text" placeholder='닉네임' mb='32px' focusBorderColor='green.400' />
            <FormLabel>비밀번호</FormLabel>
            <Input type="password" placeholder='비밀번호' mb='12px' focusBorderColor='green.400' />
            <Input type="password" placeholder='비밀번호 확인' mb='48px' focusBorderColor='green.400' />
            <Button type="submit" w='100%' bg='green.400' color='white' _hover={{ bg: 'green.500' }} variant='solid' mb='16px'>로그인</Button>
          </FormControl>
        </Flex>
      </Flex>
    </>
  )
}

export default SignUp;