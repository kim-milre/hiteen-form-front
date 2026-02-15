export default function AdminPage() {
  const formId = "FORM_ID"
  const token = "ADMIN_TOKEN"

  return (
    <div style={{ padding: 40 }}>
      <h2>관리자 페이지</h2>

      <a
        href={`http://localhost:8000/api/admin/forms/${formId}/export?token=${token}`}
      >
        📥 엑셀 다운로드
      </a>
    </div>
  )
}