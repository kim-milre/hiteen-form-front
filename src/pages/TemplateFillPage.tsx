import { useEffect, useMemo, useRef, useState } from "react"

type FieldKey = "studentId" | "name" | "major" | "number"
type HotspotKey = FieldKey | "interest" | "paymentStatus"

type Hotspot = {
  key: HotspotKey
  label: string
  x: number
  y: number
  w: number
  h: number
}

type Values = {
  studentId: string
  name: string
  major: string
  number: string
  interest: string[]
  paymentStatus: "" | "예" | "아니오"
}

const W = 1179
const H = 2556
const R = W / H

// 템플릿(메인 화면)만 키우는 스케일
const FONT_SCALE = 1
function clampScaled(minPx: number, midVh: number, maxPx: number) {
  return `clamp(${minPx * FONT_SCALE}px, ${midVh * FONT_SCALE}vh, ${maxPx * FONT_SCALE}px)`
}

// 모달(상세 선택 화면)은 "이전 폰트 크기" 유지용
function clampPrev(minPx: number, midVh: number, maxPx: number) {
  return `clamp(${minPx}px, ${midVh}vh, ${maxPx}px)`
}

export default function TemplateFillPage() {
  const [values, setValues] = useState<Values>({
    studentId: "",
    name: "",
    major: "",
    number: "",
    interest: [],
    paymentStatus: "",
  })

  const inputRefs = useRef<Record<FieldKey, HTMLInputElement | null>>({
    studentId: null,
    name: null,
    major: null,
    number: null,
  })

  const [interestOpen, setInterestOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)

  const INTEREST_OPTIONS = useMemo(
    () => ["바이브 코딩", "퍼스널 브랜딩", "프로그래밍", "친목", "스터디"],
    []
  )

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const hotspots: Hotspot[] = [
    { key: "name", label: "이름", x: 32, y: 38, w: 12, h: 2 },
    { key: "studentId", label: "학번", x: 32, y: 40.5, w: 18, h: 2 },
    { key: "number", label: "전화번호", x: 30, y: 43, w: 26, h: 2 },

    { key: "interest", label: "관심분야", x: 12, y: 72, w: 16, h: 2 },
    { key: "major", label: "전공", x: 42, y: 73, w: 16, h: 2 },
    { key: "paymentStatus", label: "납부상태", x: 69, y: 72.5, w: 16, h: 2 },
  ]

  function setField(key: FieldKey, v: string) {
    setValues(prev => ({ ...prev, [key]: v }))
  }

  const interestSpot = hotspots.find(h => h.key === "interest")
  const paymentSpot = hotspots.find(h => h.key === "paymentStatus")

  return (
    
    <div
    
        style={{
        position: "fixed",
        inset: 0,
        height: "100dvh", // ✅ iOS Safari 대응
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fff",
        overflow: "hidden",
        }}
    >
        <div
        style={{
            position: "relative",
            width: "100vw", // ✅ 100vh → 100dvh
            height: `calc(100vw / ${R})`, // ✅ 100vh → 100dvh
            background: "#fff",
        }}
        >
        <img
          src="/template.jpg"
          alt="template"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />

        {/* 일반 input들: 메인 화면 스케일 적용 */}
        {hotspots
            .filter(h => h.key !== "interest" && h.key !== "paymentStatus")
            .map(h => {
                const key = h.key as FieldKey
                const isNumeric = key === "studentId" || key === "number"
                const isPhone = key === "number"

                return (
                <div key={h.key}>
                    {/* input 그대로 유지 */}
                    <input
                    ref={el => {
                        inputRefs.current[key] = el
                    }}
                    value={values[key]}
                    onChange={e => setField(key, e.target.value)}
                    placeholder={h.label}
                    inputMode={isNumeric ? "numeric" : undefined}
                    style={{
                        position: "absolute",
                        left: `${h.x}%`,
                        top: `${h.y}%`,
                        width: `${h.w}%`,
                        height: `${h.h}%`,
                        zIndex: 10,
                        border: "none",
                        background: "transparent",
                        color: "#000",
                        fontSize: clampScaled(12, 1.8, 18),
                        padding: "0 8px",
                        outline: "none",
                    }}
                    />

                    {/* 전화번호일 때만 input 아래에 설명 추가 */}
                    {isPhone && (
                    <div
                        style={{
                        position: "absolute",
                        left: `${h.x+3}%`,
                        top: `${h.y + h.h}%`,  // 입력창 아래로 이동
                        width: `${h.w}%`,
                        fontSize: clampScaled(7, 1.2, 12),
                        color: "rgba(0,0,0,0.5)",
                        pointerEvents: "none",
                        }}
                    >
                        (ex.010-1234-1234)
                    </div>
                    )}
                </div>
                )
            })}

        <div
            style={{
                position: "absolute",
                top: "16.5%",    
                left: "50%",     
                transform: "translate(-50%, -50%)",
                whiteSpace: "nowrap",
                width: "max-content",
                display: "inline-block",
                fontSize: clampScaled(20, 1.5, 30),
                fontWeight: 800,
                color: "#fff",
                WebkitTextStroke: "1px #000000",
                textShadow: "0 0 4px rgba(0,0,0,0.5)",
                pointerEvents: "none"
            }}
            >
            "Amicom" 동아리 신청서
            </div>

        <div
            style={{
                position: "absolute",
                top: "40%",    
                left: "82%",     
                transform: "translate(-50%, -50%)",
                fontSize: clampScaled(10, 1.5, 16),
                fontWeight: 50,
                color: "#000",
                pointerEvents: "none"
            }}
            >
            회비 납부 계좌:
            토스뱅크 1002-4057-0414 (김민성)
            </div>

        <div
            style={{
                position: "absolute",
                top: "60%",    
                left: "45%",
                fontSize: clampScaled(10, 1.5, 18),
                fontWeight: 50,
                color: "#000",
                pointerEvents: "none"
            }}
            >
            아미콤이 궁금해요 !<br />
            <br />
            아미콤은 ~<br />
            회비 : 15,000원<br />
            개강 총회 : 2026년 3월 11일 수요일 저녁 6시<br />
            자세한 사항은 노션 참조<br />
            https://www.notion.so/amicom/Amicom-9c3a1b405d0b4c8e8cbbacfa7a1e7c0
            </div>

        {/* 관심분야 표시 텍스트: 메인 화면 스케일 적용 */}
        {interestSpot && (
          <>
            <button
              type="button"
              onClick={() => setInterestOpen(true)}
              style={{
                position: "absolute",
                left: `${interestSpot.x}%`,
                top: `${interestSpot.y}%`,
                width: `${interestSpot.w}%`,
                height: `${interestSpot.h}%`,
                zIndex: 12,
                background: "transparent",
                border: "2px solid rgba(255,0,0,0)",
                padding: 0,
                cursor: "pointer",
              }}
              aria-label="관심분야 선택"
            />

            <div
              style={{
                position: "absolute",
                left: `${interestSpot.x}%`,
                top: `${interestSpot.y}%`,
                width: `${interestSpot.w}%`,
                height: `${interestSpot.h}%`,
                zIndex: 11,
                pointerEvents: "none",
                color: values.interest.length > 0 ? "#000" : "rgba(0,0,0,0.6)",
                fontSize: clampScaled(10, 1.5, 16),
                padding: "0 8px",
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {values.interest.length ? values.interest.join(", ") : "관심분야 선택"}
            </div>
          </>
        )}

        {/* 납부상태 표시 텍스트: 메인 화면 스케일 적용 */}
        {paymentSpot && (
          <>
            <button
              type="button"
              onClick={() => setPaymentOpen(true)}
              style={{
                position: "absolute",
                left: `${paymentSpot.x}%`,
                top: `${paymentSpot.y}%`,
                width: `${paymentSpot.w}%`,
                height: `${paymentSpot.h}%`,
                zIndex: 12,
                background: "transparent",
                border: "2px solid rgba(255,0,0,0)",
                padding: 0,
                cursor: "pointer",
              }}
              aria-label="납부상태 선택"
            />

            <div
              style={{
                position: "absolute",
                left: `${paymentSpot.x}%`,
                top: `${paymentSpot.y}%`,
                width: `${paymentSpot.w}%`,
                height: `${paymentSpot.h}%`,
                zIndex: 11,
                pointerEvents: "none",
                color: values.paymentStatus !== "" ? "#000" : "rgba(0,0,0,0.45)",
                fontSize: clampScaled(10, 1.5, 16),
                padding: "0 8px",
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {values.paymentStatus ? values.paymentStatus : "납부상태 선택"}
            </div>
          </>
        )}

        {/* 관심분야 모달: 상세 선택(체크박스/옵션/제목/버튼)은 "이전 폰트 크기" 유지 */}
        {interestOpen && (
          <div
            onClick={() => setInterestOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              display: "grid",
              placeItems: "center",
              zIndex: 9999,
              background: "rgba(0,0,0,0.45)",
              padding: 16,
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                aspectRatio: String(675 / 960),
                width: "min(420px, 92vw)",
                height: "auto",
                borderRadius: 18,
                overflow: "hidden",
                position: "relative",
                backgroundImage: 'url("/modal-bg.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "20%",
                  right: "20%",
                  top: "20%",
                  bottom: "1%",
                  display: "grid",
                  gridTemplateRows: "auto 1fr auto",
                  gap: 12,
                  color: "#000",
                }}
              >
                <div style={{ fontSize: clampPrev(20, 2.2, 40), fontWeight: 700, marginBottom: 20 }}>
                  관심분야 선택
                </div>

                <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
                  {INTEREST_OPTIONS.map(opt => {
                    const checked = values.interest.includes(opt)
                    return (
                      <label
                        key={opt}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={e => {
                            setValues(prev => {
                              const next = e.target.checked
                                ? [...prev.interest, opt]
                                : prev.interest.filter(x => x !== opt)
                              return { ...prev, interest: next }
                            })
                          }}
                          style={{
                            width: 18, // 이전값 유지
                            height: 18, // 이전값 유지
                            accentColor: "#ffa4cb",
                          }}
                        />
                        <span style={{ fontSize: 25 }}>{opt}</span> {/* 이전값 유지 */}
                      </label>
                    )
                  })}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, transform: "translateY(-90px)" }}>
                  <button
                    type="button"
                    onClick={() => setValues(prev => ({ ...prev, interest: [] }))}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(0,0,0,0.15)",
                      background: "rgba(255,255,255,0.75)",
                      cursor: "pointer",
                      fontSize: clampPrev(12, 1.8, 18),
                    }}
                  >
                    초기화
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterestOpen(false)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(0,0,0,0.15)",
                      background: "rgba(255,255,255,0.9)",
                      cursor: "pointer",
                      fontSize: clampPrev(12, 1.8, 18),
                    }}
                  >
                    완료
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 납부상태 모달: 상세 선택(체크박스/옵션/제목/버튼)은 "이전 폰트 크기" 유지 */}
        {paymentOpen && (
          <div
            onClick={() => setPaymentOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              display: "grid",
              placeItems: "center",
              zIndex: 10000,
              background: "rgba(0,0,0,0.45)",
              padding: 16,
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                aspectRatio: String(1000 / 675),
                width: "min(420px, 92vw)",
                borderRadius: 18,
                overflow: "hidden",
                position: "relative",
                backgroundImage: 'url("/payment-bg.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "25%",
                  right: "10%",
                  top: "25%",
                  bottom: "60%",
                  display: "grid",
                  gridTemplateRows: "auto 1fr auto",
                  gap: 20,
                  color: "#000",
                }}
              >
                <div style={{ fontSize: clampPrev(18, 2.5, 26), fontWeight: 700 }}>
                  납부상태 선택
                </div>

                <div style={{ display: "grid", gap: 14 }}>
                  {(["예", "아니오"] as const).map(opt => {
                    const selected = values.paymentStatus === opt
                    return (
                      <label
                        key={opt}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => setValues(prev => ({ ...prev, paymentStatus: opt }))}
                          style={{
                            width: 22, // 이전값 유지
                            height: 22, // 이전값 유지
                            accentColor: "#ff6fae",
                          }}
                        />
                        <span style={{ fontSize: clampPrev(16, 2.2, 22) }}>{opt}</span> {/* 이전값 유지 */}
                      </label>
                    )
                  })}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, transform: "translate(-10px, -20px)" }}>
                  <button
                    onClick={() => setValues(prev => ({ ...prev, paymentStatus: "" }))}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(0,0,0,0.15)",
                      background: "rgba(255,255,255,0.85)",
                      cursor: "pointer",
                      fontSize: clampPrev(12, 1.8, 18),
                    }}
                  >
                    초기화
                  </button>

                  <button
                    onClick={() => setPaymentOpen(false)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(0,0,0,0.15)",
                      background: "rgba(255,255,255,0.95)",
                      cursor: "pointer",
                      fontSize: clampPrev(12, 1.8, 18),
                    }}
                  >
                    완료
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 제출 버튼 */}
        <div
        style={{
            position: "absolute",
            bottom: "3%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
        }}
        >
        <button
            onClick={async () => {
                const isValid =
                    values.name.trim() !== "" &&
                    values.studentId.trim() !== "" &&
                    values.number.trim() !== "" &&
                    values.interest.length > 0 &&
                    values.paymentStatus !== ""

                if (!isValid) {
                    alert("모든 항목을 입력해주세요.")
                    return
                }

                try {
                    const res = await fetch("https://hiteen-form-production.up.railway.app/api/template/submit", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(values),
                    })

                    if (!res.ok) {
                        throw new Error("제출 실패")
                    }

                    alert("제출되었습니다!")

                    // 입력값 초기화
                    setValues({
                        studentId: "",
                        name: "",
                        major: "",
                        number: "",
                        interest: [],
                        paymentStatus: "",
                    })

                } catch (err) {
                    console.error(err)
                    alert("서버 오류가 발생했습니다.")
                }
            }}
            style={{
            padding: "14px 40px",
            borderRadius: 30,
            border: "none",
            background: "#ff6fae",
            color: "#fff",
            fontSize: clampScaled(14, 2, 20),
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            }}
        >
            제출하기
        </button>
        </div>
    </div>
  )
}