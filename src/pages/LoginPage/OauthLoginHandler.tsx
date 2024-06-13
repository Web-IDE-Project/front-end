import { Flex, Text } from "@chakra-ui/react"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OauthLoginHandler: React.FC = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    
    useEffect(() => {
        if (params.get('message') === 'success') {
            alert('로그인 성공');
            navigate('/container/my');
        } else if (params.get('message') === 'fail') {
            alert('로그인에 실패했습니다.');
            navigate('/login');
        } else {
            alert('요청이 잘못되었습니다.');
            navigate('/login');
        }
    }, [params, navigate]);

    return (
        <Flex align='center' justify='center' h='full'>
            <Text>로그인 중...</Text>
        </Flex>
    )
}

export default OauthLoginHandler;