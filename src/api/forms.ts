import { api, API_BASE } from "./client"
import type { FormAdmin, FormCreate, FormPublic, ResponseCreate } from "../types/form"

export function createForm(payload: FormCreate) {
  return api<FormAdmin>("/api/forms", { method: "POST", body: JSON.stringify(payload) })
}

export function getFormBySlug(slug: string) {
  return api<FormPublic>(`/api/forms/by-slug/${slug}`)
}

export function submitResponse(slug: string, payload: ResponseCreate) {
  return api<{ id: string; submitted_at: string }>(`/api/forms/by-slug/${slug}/responses`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getStats(formId: string, token: string) {
  return api<any>(`/api/admin/forms/${formId}/stats?token=${encodeURIComponent(token)}`)
}

export function exportXlsxUrl(formId: string, token: string) {
  return `${API_BASE}/api/admin/forms/${formId}/export.xlsx?token=${encodeURIComponent(token)}`
}