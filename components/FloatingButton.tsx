interface Props {
  onClick: () => void
  isExpanded: boolean
}

export const FloatingButton = ({ onClick, isExpanded }: Props) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        backgroundColor: "#1a73e8",
        color: "white",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 9999,
        transition: "transform 0.2s ease-in-out",
        transform: isExpanded ? "rotate(180deg)" : "none"
      }}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7 14l5-5 5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
