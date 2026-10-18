export function StarDisplay({ value = 0, count }) {
  return (
    <span className="stars" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= Math.round(value) ? "star filled" : "star"}>★</span>
      ))}
      {count !== undefined && <span className="star-count"> ({count})</span>}
    </span>
  );
}

export function StarInput({ value, onChange }) {
  return (
    <span className="stars input">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          className={n <= value ? "star filled" : "star"}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </span>
  );
}