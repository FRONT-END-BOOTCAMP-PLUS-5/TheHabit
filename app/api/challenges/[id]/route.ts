// GET /api/challenges/[id] - 특정 챌린지 상세 조회
// PUT /api/challenges/[id] - 챌린지 수정
// DELETE /api/challenges/[id] - 챌린지 삭제

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // TODO: 특정 챌린지 상세 조회 구현
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // TODO: 챌린지 수정 구현
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // TODO: 챌린지 삭제 구현
} 