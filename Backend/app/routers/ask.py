from fastapi import APIRouter
from pydantic import BaseModel
from app.services.qa import answer_question

router = APIRouter(prefix="/api")

class QuestionRequest(BaseModel):
    question: str

@router.post("/ask")
async def ask(request: QuestionRequest):
    answer = answer_question(request.question)
    return {
        "question": request.question,
        "answer": answer,
        "status": "success"
    }