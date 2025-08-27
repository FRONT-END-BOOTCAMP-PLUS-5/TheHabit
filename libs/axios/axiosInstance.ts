import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // Content-Type 헤더 제거 - 각 요청에서 필요에 따라 설정
  withCredentials: true,
});
