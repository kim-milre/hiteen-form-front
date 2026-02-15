export default function AdminPage() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const token = "l9u63zLHV6DMWDIZ-iMWhG_yoz4fo6C9S4KdOhfYlGQ"

  return (
    <div style={{ padding: 40 }}>
      <h2>관리자 페이지</h2>

      <div style={{ display: "flex", gap: 12 }}>
        <a
          href={`${BASE_URL}/api/admin/template/export?token=${token}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          엑셀 다운로드
        </a>

        <a
          href={`${BASE_URL}/api/admin/template/stats?token=${token}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          통계 JSON 보기
        </a>
      </div>
    </div>
  )
}