//! 챌린지 생성 데이터 매핑용입니다.
//! 임시로 사용되는 매퍼입니다. 
//! 로그인 기능 구현되면 삭제 예정입니다.
//! from 승민 2025-08-06

import { AddChallengeRequestDto } from "../../applications/dtos/AddChallengeDto";
import { ChallengeDataMapper } from "./ChallengeDataMapper";

export class AddChallengeDataMapper {
  static toEntity(data: AddChallengeRequestDto) {
    return ChallengeDataMapper.fromAddRequestDto({
      ...data,
      categoryId: Number(data.categoryId) // 문자열을 숫자로 변환
    });
  }
} 
