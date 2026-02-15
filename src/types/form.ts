export type QuestionType =
  | "short_text"
  | "long_text"
  | "single_choice"
  | "multi_choice"
  | "dropdown"
  | "linear_scale"
  | "date"

export type Question = {
  id: string
  order_index: number
  type: QuestionType
  title: string
  required: boolean
  config_json?: any
}

export type FormPublic = {
  id: string
  title: string
  description?: string | null
  public_slug: string
  is_open: boolean
  questions: Question[]
}

export type FormAdmin = FormPublic & {
  admin_token: string
}

export type FormCreate = {
  title: string
  description?: string | null
  questions: Array<{
    order_index: number
    type: QuestionType
    title: string
    required: boolean
    config_json?: any
  }>
}

export type ResponseCreate = {
  answers: Array<{
    question_id: string
    value_text?: string | null
    value_json?: any
    numeric_value?: number | null
  }>
}