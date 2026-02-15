import { useState } from "react"
import { createForm } from "../api/forms"
import type { FormCreate, QuestionType } from "../types/form"
import { useNavigate } from "react-router-dom"

type QuestionDraft = {
  id: string
  type: QuestionType
  title: string
  required: boolean
  optionsText: string
}

export default function BuilderPage() {
  const nav = useNavigate()

  const [title, setTitle] = useState("새 설문")
  const [description, setDescription] = useState("")

  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      id: crypto.randomUUID(),
      type: "single_choice",
      title: "질문 1",
      required: true,
      optionsText: "예\n아니오",
    },
  ])

  function addQuestion() {
    setQuestions(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "short_text",
        title: `질문 ${prev.length + 1}`,
        required: false,
        optionsText: "",
      },
    ])
  }

  function removeQuestion(id: string) {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  function updateQuestion(id: string, patch: Partial<QuestionDraft>) {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, ...patch } : q))
    )
  }

  async function onCreate() {
    const payload: FormCreate = {
      title,
      description,
      questions: questions.map((q, index) => ({
        order_index: index,
        type: q.type,
        title: q.title,
        required: q.required,
        config_json:
          q.type === "single_choice" ||
          q.type === "multi_choice" ||
          q.type === "dropdown"
            ? {
                options: q.optionsText
                  .split("\n")
                  .map(s => s.trim())
                  .filter(Boolean),
              }
            : q.type === "linear_scale"
            ? { min: 1, max: 5 }
            : undefined,
      })),
    }

    const form = await createForm(payload)

    nav(
      `/f/${form.public_slug}/admin?token=${encodeURIComponent(
        form.admin_token
      )}&formId=${encodeURIComponent(form.id)}`
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "system-ui" }}>
      <h2>설문 만들기</h2>

      <div style={{ display: "grid", gap: 16 }}>
        <label>
          제목
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          설명
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <hr />

        {questions.map((q, idx) => (
          <div
            key={q.id}
            style={{
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <strong>질문 {idx + 1}</strong>
            </div>

            <input
              value={q.title}
              onChange={e =>
                updateQuestion(q.id, { title: e.target.value })
              }
              style={{ width: "100%", padding: 8, marginBottom: 8 }}
            />

            <select
              value={q.type}
              onChange={e =>
                updateQuestion(q.id, { type: e.target.value as QuestionType })
              }
              style={{ width: "100%", padding: 8, marginBottom: 8 }}
            >
              <option value="short_text">단답</option>
              <option value="long_text">장문</option>
              <option value="single_choice">객관식 단일</option>
              <option value="multi_choice">객관식 복수</option>
              <option value="dropdown">드롭다운</option>
              <option value="linear_scale">선형척도</option>
              <option value="date">날짜</option>
            </select>

            {(q.type === "single_choice" ||
              q.type === "multi_choice" ||
              q.type === "dropdown") && (
              <textarea
                placeholder="선택지 줄바꿈으로 입력"
                value={q.optionsText}
                onChange={e =>
                  updateQuestion(q.id, { optionsText: e.target.value })
                }
                style={{ width: "100%", padding: 8, height: 100 }}
              />
            )}

            <label style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input
                type="checkbox"
                checked={q.required}
                onChange={e =>
                  updateQuestion(q.id, { required: e.target.checked })
                }
              />
              필수
            </label>

            <button
              onClick={() => removeQuestion(q.id)}
              style={{ marginTop: 8 }}
            >
              삭제
            </button>
          </div>
        ))}

        <button onClick={addQuestion}>질문 추가</button>

        <hr />

        <button onClick={onCreate} style={{ padding: 10 }}>
          설문 생성
        </button>
      </div>
    </div>
  )
}