import { GPTRequestDto } from "@/backend/gpt/applications/dtos/GPTRequestDto";
import { axiosInstance } from "@/libs/axios/axiosInstance";

export const requestGPT = async (
  requestInput: GPTRequestDto
): Promise<GPTRequestDto> => {
  const response = await axiosInstance.post("/api/gpt", {
    gptResponseContent: requestInput.gptResponseContent,
  });

  return response.data.response;
};
