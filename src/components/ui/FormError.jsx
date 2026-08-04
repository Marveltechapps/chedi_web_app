/** Inline form-level error banner for failed submissions / validation. */
export default function FormError({ message, style }) {
  if (!message) return null
  return (
    <div
      role="alert"
      style={{
        marginBottom: 16,
        padding: '12px 14px',
        background: '#fdf1ed',
        border: '1px solid #e6cfc7',
        borderRadius: 6,
        fontSize: 13,
        color: '#b0361f',
        lineHeight: 1.45,
        ...style,
      }}
    >
      {message}
    </div>
  )
}
