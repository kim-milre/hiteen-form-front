import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { getFormBySlug, submitResponse } from "../api/forms"
import type { FormPublic, ResponseCreate } from "../types/form"

export default function FormFillPage() {
  const { slug } = useParams()
  const [form, setForm] = useState<FormPublic | null>(null)
  const [values, setValues] = useState<Record<string, any>>({})
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      if (!slug) return
      const f = await getFormBySlug(slug)
      setForm(f)
    })()
  }, [slug])

  const questions = useMemo(
    () => (form ? [...form.questions].sort((a, b) => a.order_index - b.order_index) : []),
    [form]
  )

  async function onSubmit() {
    if (!slug || !form) return
    setMsg(null)

    const payload: ResponseCreate = {
      answers: questions.map(q => {
        const v = values[q.id]
        if (q.type === "multi_choice") return { question_id: q.id, value_json: Array.isArray(v) ? v : [] }
        if (q.type === "linear_scale") return { question_id: q.id, numeric_value: v ? Number(v) : null }
        return { question_id: q.id, value_text: v ?? "" }
      }),
    }

    try {
      await submitResponse(slug, payload)
      setMsg("제출 완료")
      setValues({})
    } catch (e: any) {
      setMsg(e.message || "error")
    }
  }

  if (!form) {
    return (
      <div className="stage">
        <div className="panel">loading</div>
      </div>
    )
  }

  if (!form.is_open) {
    return (
      <div className="stage">
        <div className="panel">설문이 닫혀 있음</div>
      </div>
    )
  }

  return (
    <div className="stage">
      <div className="panel">
        <h2 style={{ marginTop: 0 }}>{form.title}</h2>
        {form.description && <p style={{ opacity: 0.85 }}>{form.description}</p>}

        <div className="stack">
          {questions.map(q => {
            const v = values[q.id]

            if (q.type === "single_choice" || q.type === "dropdown") {
              const opts: string[] = q.config_json?.options || []
              return (
                <div key={q.id} className="card">
                  <div style={{ marginBottom: 8 }}>{q.title}</div>
                  <select
                    className="select"
                    value={v ?? ""}
                    onChange={e => setValues(prev => ({ ...prev, [q.id]: e.target.value }))}
                  >
                    <option value="">선택</option>
                    {opts.map(o => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              )
            }

            if (q.type === "multi_choice") {
              const opts: string[] = q.config_json?.options || []
              const arr: string[] = Array.isArray(v) ? v : []
              return (
                <div key={q.id} className="card">
                  <div style={{ marginBottom: 8 }}>{q.title}</div>
                  <div className="stack" style={{ gap: 8 }}>
                    {opts.map(o => {
                      const checked = arr.includes(o)
                      return (
                        <label key={o} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={e => {
                              const next = e.target.checked ? [...arr, o] : arr.filter(x => x !== o)
                              setValues(prev => ({ ...prev, [q.id]: next }))
                            }}
                          />
                          {o}
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            }

            if (q.type === "linear_scale") {
              const min = q.config_json?.min ?? 1
              const max = q.config_json?.max ?? 5
              return (
                <div key={q.id} className="card">
                  <div style={{ marginBottom: 8 }}>{q.title}</div>
                  <input
                    className="input"
                    type="number"
                    min={min}
                    max={max}
                    value={v ?? ""}
                    onChange={e => setValues(prev => ({ ...prev, [q.id]: e.target.value }))}
                  />
                </div>
              )
            }

            if (q.type === "long_text") {
              return (
                <div key={q.id} className="card">
                  <div style={{ marginBottom: 8 }}>{q.title}</div>
                  <textarea
                    className="textarea"
                    value={v ?? ""}
                    onChange={e => setValues(prev => ({ ...prev, [q.id]: e.target.value }))}
                  />
                </div>
              )
            }

            if (q.type === "date") {
              return (
                <div key={q.id} className="card">
                  <div style={{ marginBottom: 8 }}>{q.title}</div>
                  <input
                    className="input"
                    type="date"
                    value={v ?? ""}
                    onChange={e => setValues(prev => ({ ...prev, [q.id]: e.target.value }))}
                  />
                </div>
              )
            }

            return (
              <div key={q.id} className="card">
                <div style={{ marginBottom: 8 }}>{q.title}</div>
                <input
                  className="input"
                  value={v ?? ""}
                  onChange={e => setValues(prev => ({ ...prev, [q.id]: e.target.value }))}
                />
              </div>
            )
          })}

          <button className="btn btnPrimary" onClick={onSubmit}>
            제출
          </button>

          {msg && <div>{msg}</div>}
        </div>
      </div>
    </div>
  )
}