import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/services/API';

// 쿠키 설정 함수
const setCookie = (name: string, value: string, days: number): void => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
};

// 쿠키 가져오는 함수
const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

const LoginHandler: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        API('/api/auth/transmit')
            .then(response => {
                const authHeader = response.headers['authorization'];
                const accessToken = authHeader ? authHeader.split(' ')[1] : null;
                const refreshToken = getCookie('Refresh-Token');

                if (accessToken && refreshToken) {
                    setCookie('accessToken', accessToken, 1); // 유효 기간 1일
                    setCookie('refreshToken', refreshToken, 10); // 유효 기간 10일
                    console.log('토큰 저장 완료:', accessToken, refreshToken);
                    navigate('/container/my')
                } else {
                    console.error('토큰을 받지 못했습니다.');
                }
            })
            .catch(error => {
                console.error('토큰 요청 실패:', error);
            });
    }, []);

    return (
        <div>
            로그인 중입니다...
        </div>
    );
};

export default LoginHandler;
