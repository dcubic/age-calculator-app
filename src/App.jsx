import styles from "./App.module.css";
import { useState } from "react";
import IconArrow from "./assets/images/icon-arrow.svg?react";

const thirtyDayMonths = new Set([4, 6, 9, 11]);
const postSubmissionState = {
  day: "submitted",
  month: "submitted",
  year: "submitted",
};
const februaryRegularLength = 28;
const februaryLeapYearLength = 29;
const yearStringMinLength = 4;
const monthDayStringLength = 2;

function App() {
  const [enteredValues, setEnteredValues] = useState({
    day: "",
    month: "",
    year: "",
  });

  const [modificationState, setModificationState] = useState({
    day: "clear",
    month: "clear",
    year: "clear",
  });

  function isInteger(inputString) {
    const regex = /^\d+$/;
    return regex.test(inputString);
  }

  function isEnteredDateValid() {
    const day = +enteredValues.day;
    const month = +enteredValues.month;
    const year = +enteredValues.year;

    const februaryDayCount =
      year % 4 === 0 ? februaryLeapYearLength : februaryRegularLength;
    if (thirtyDayMonths.has(month)) {
      return day <= 30;
    } else if (month == 2) {
      return day <= februaryDayCount;
    } else {
      return true; // initial validation already has this covered
    }
  }

  function isDateInFuture() {
    const formattedYearString = enteredValues.year.padStart(yearStringMinLength, '0');
    const formattedMonthString = enteredValues.month.padStart(monthDayStringLength, '0');
    const formattedDayString = enteredValues.day.padStart(monthDayStringLength, '0');

    const enteredDateString = `${formattedYearString}-${formattedMonthString}-${formattedDayString}`;
    const enteredDate = new Date(enteredDateString);
    const currentDate = new Date();

    return currentDate.getTime() < enteredDate.getTime();
  }

  function isInputValid(identifier) {
    switch(identifier) {
      case 'day': return isInteger(enteredValues.day) && 1 <= +enteredValues.day && +enteredValues.day <= 31;
      case 'month': return isInteger(enteredValues.month) && 1 <= +enteredValues.month && +enteredValues.month <= 12;
      case 'year': return isInteger(enteredValues.year) && +enteredValues.year >= 0;
      default: return false;
    }
  }
  const isDayValid =
    isInteger(enteredValues.day) &&
    1 <= +enteredValues.day &&
    +enteredValues.day <= 31;
  const isMonthValid =
    isInteger(enteredValues.month) &&
    1 <= +enteredValues.month &&
    +enteredValues.month <= 12;
  const isYearValid = isInteger(enteredValues.year) && +enteredValues.year >= 0;

  const areInputsValid = () => {
    return isDayValid && isMonthValid && isYearValid
  }

  function submittedEmptyValue(identifier) {
    return modificationState[identifier] === 'submitted' && enteredValues[identifier] === ''
  }

  function shouldDisplayInputError(identifier) {
    return modificationState[identifier] !== 'clear' && !isInputValid(identifier);
  }

  const shouldDisplayError = (identifier) => {
    if (areInputsValid()) {
      return !isEnteredDateValid() || isDateInFuture();
    } else {
      return submittedEmptyValue(identifier) || shouldDisplayInputError(identifier);
    }
  }

  const dayErrorMessage = () => {
    if (submittedEmptyValue('day')) {
      return <p>This field is required</p>;
    } else if (shouldDisplayInputError('day')) {
      return <p>Must be a valid day</p>;
    } else if (areInputsValid() && !isEnteredDateValid()) {
      return <p>Must be a valid date</p>;
    } else {
      return <></>;
    }
  };

  const monthErrorState = () => {
    if (submittedEmptyValue('month')) {
      return <p>This field is required</p>;
    } else if (modificationState.month !== "clear" && !isMonthValid) {
      return <p>Must be a valid month</p>;
    } else {
      return <></>;
    }
  };

  const yearErrorState = () => {
    if (modificationState.year === 'submitted' && enteredValues.year === '') {
      return <p>This field is required</p>;
    } else if (modificationState.year !== "clear" && !isYearValid) {
      return <p>Must be a valid year</p>;
    } else if (areInputsValid() &&
      isEnteredDateValid() &&
      isDateInFuture()
    ) {
      return <p>Must be in the past</p>;
    } else {
      return <></>
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    setModificationState(postSubmissionState);
  }

  function handleInputChange(identifier, newValue) {
    setEnteredValues((previousValues) => ({
      ...previousValues,
      [identifier]: newValue,
    }));
  }

  function handleInputFocus(identifier) {
    setModificationState((previousState) => ({
      ...previousState,
      [identifier]: "clear",
    }));
  }

  function handleInputBlur(identifier) {
    setModificationState((previousState) => ({
      ...previousState,
      [identifier]: "blurred",
    }));
  }

  return (
    <div>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.inputsContainer}>
          <div className={styles.inputContainer}>
            <label htmlFor="day-input">Day</label>
            <input
              id="day-input"
              placeholder="DD"
              onFocus={() => handleInputFocus("day")}
              onBlur={() => handleInputBlur("day")}
              onChange={(event) => handleInputChange("day", event.target.value)}
              value={enteredValues.day}
            ></input>
            {dayErrorMessage()}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="month-input">Month</label>
            <input
              id="month-input"
              placeholder="MM"
              onBlur={() => handleInputBlur("month")}
              onFocus={() => handleInputFocus("month")}
              onChange={(event) =>
                handleInputChange("month", event.target.value)
              }
              value={enteredValues.month}
            ></input>
            {monthErrorState()}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="year-input">Year</label>
            <input
              id="year-input"
              placeholder="YYYY"
              onBlur={() => handleInputBlur("year")}
              onFocus={() => handleInputFocus("year")}
              onChange={(event) => handleInputChange('year', event.target.value)}
              value={enteredValues.year}
            ></input>
            {yearErrorState()}
          </div>
        </div>
        <div className={styles.dividerButtonContainer}>
          <hr className={styles.lineBreak}></hr>
          <button className={styles.submitButton}>
            <IconArrow></IconArrow>
          </button>
        </div>
      </form>
      <div className={styles.outputsContainer}>
        <div>
          <div className={styles.outputValue}>TODO: years output</div>
          <div className={styles.units}>years</div>
        </div>
        <div>
          <div className={styles.outputValue}>TODO</div>
          <div className={styles.units}>months</div>
        </div>
        <div>
          <div className={styles.outputValue}>TODO</div>
          <div className={styles.units}>days</div>
        </div>
      </div>
    </div>
  );
}

export default App;
