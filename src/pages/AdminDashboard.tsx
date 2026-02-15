import { useEffect, useState } from "react"
import { useSearchParams, useParams, Link } from "react-router-dom"
import { getFormBySlug, getStats, exportXlsxUrl } from "../api/forms"
import type { FormPublic } from "../types/form"

export default function AdminDashboard() {
  const { slug } = useParams()
  const [sp] = useSearchParams()
  const token = sp.get("token") || ""
  const formId = sp.get("formId") || ""
  const [form, setForm] = useState<FormPublic | null>(null)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    ;(async () => {
      if (!slug) return
      const f = await getFormBySlug(slug)
      setForm(f)
    })()
  }, [slug])

  useEffect(() => {
    ;(async () => {
      if (!formId || !token) return
      const s = await getStats(formId, token)
      setStats(s)
    })()
  }, [formId, token])

  if (!slug) return <div style={{ padding: 24 }}>slug missing</div>

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "system-ui" }}>
      <h2>관리자 대시보드</h2>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link to={`/f/${slug}`}>응답 링크로 이동</Link>
        {formId && token && (
          <a href={exportXlsxUrl(formId, token)}>엑셀 다운로드</a>
        )}
      </div>

      {!form && <div style={{ marginTop: 16 }}>loading form</div>}
      {form && (
        <div style={{ marginTop: 16 }}>
          <div>설문 제목: {form.title}</div>
          <div>열림 상태: {String(form.is_open)}</div>
        </div>
      )}

      {!stats && <div style={{ marginTop: 16 }}>loading stats</div>}
      {stats && (
        <div style={{ marginTop: 16, display: "grid", gap: 16 }}>
          <div>총 응답 수: {stats.responses_total}</div>
          {stats.questions.map((q: any) => (
            <div key={q.question_id} style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
              <div>{q.title}</div>
              <div>타입: {q.type}</div>
              <div>응답 수: {q.total_answers}</div>
              {q.choice_counts && (
                <div style={{ marginTop: 8 }}>
                  {q.choice_counts.map((c: any) => (
                    <div key={c.option}>{c.option}: {c.count}</div>
                  ))}
                </div>
              )}
              {q.scale_avg != null && (
                <div style={{ marginTop: 8 }}>
                  평균: {q.scale_avg} 최소: {q.scale_min} 최대: {q.scale_max}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}