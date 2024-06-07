import styles from './Input.module.css';

function getPlaceholder(identifier) {
  if (identifier === "day") {
    return "DD";
  } else if (identifier === "month") {
    return "MM";
  } else if (identifier === "year") {
    return "YYYY";
  } else {
    return "INVALID";
  }
}

function Input({
  identifier,
  handleFocus,
  handleBlur,
  handleChange,
  value,
  getErrorMessage,
  shouldDisplayError,
}) {
  const id = `${identifier}-input`
  return (
    <div className={styles.inputContainer}>
      <label htmlFor={id}>{identifier}</label>
      <input
        id={id}
        placeholder={getPlaceholder(identifier)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
      ></input>
      {getErrorMessage()}
    </div>
  );
}

export default Input;
