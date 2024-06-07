import styles from "./App.module.css";
import { useState } from "react";
import DatesYMD from "diff-ymd-package";
import IconArrow from "./assets/images/icon-arrow.svg?react";

import Input from "./assets/components/Input.jsx";

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
const invalidTimeDifferenceState = {
  days: "--",
  months: "--",
  years: "--",
};
const onBlurTimeoutDuration = 100;
const identifiers = ["day", "month", "year"];

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

  const [timeDifference, setTimeDifference] = useState(
    invalidTimeDifferenceState
  );

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

  function getComparisonDates() {
    const formattedYearString = enteredValues.year.padStart(
      yearStringMinLength,
      "0"
    );
    const formattedMonthString = enteredValues.month.padStart(
      monthDayStringLength,
      "0"
    );
    const formattedDayString = enteredValues.day.padStart(
      monthDayStringLength,
      "0"
    );

    const enteredDateString = `${formattedYearString}-${formattedMonthString}-${formattedDayString}`;
    const enteredDate = new Date(enteredDateString);
    const currentDate = new Date();

    return { enteredDate, currentDate };
  }

  function isDateInFuture() {
    const { enteredDate, currentDate } = getComparisonDates();
    return currentDate.getTime() < enteredDate.getTime();
  }

  function isInputValid(identifier) {
    switch (identifier) {
      case "day":
        return (
          isInteger(enteredValues.day) &&
          1 <= +enteredValues.day &&
          +enteredValues.day <= 31
        );
      case "month":
        return (
          isInteger(enteredValues.month) &&
          1 <= +enteredValues.month &&
          +enteredValues.month <= 12
        );
      case "year":
        return isInteger(enteredValues.year) && +enteredValues.year >= 0;
      default:
        return false;
    }
  }

  const areInputsValid = () => {
    return identifiers.every((identifier) => isInputValid(identifier));
  };

  function submittedEmptyValue(identifier) {
    return (
      modificationState[identifier] === "submitted" &&
      enteredValues[identifier] === ""
    );
  }

  function shouldDisplayInputError(identifier) {
    return (
      modificationState[identifier] !== "clear" && !isInputValid(identifier)
    );
  }

  function shouldDisplayError(identifier) {
    if (areInputsValid()) {
      return !isEnteredDateValid() || isDateInFuture();
    } else {
      return (
        submittedEmptyValue(identifier) || shouldDisplayInputError(identifier)
      );
    }
  }

  function errorMessage(identifier) {
    if (identifier === "day") {
      if (submittedEmptyValue(identifier)) {
        return <p>This field is required</p>;
      } else if (shouldDisplayInputError(identifier)) {
        return <p>Must be a valid day</p>;
      } else if (areInputsValid() && !isEnteredDateValid()) {
        return <p>Must be a valid date</p>;
      } else {
        return <></>;
      }
    } else if (identifier === "month") {
      if (submittedEmptyValue(identifier)) {
        return <p>This field is required</p>;
      } else if (shouldDisplayInputError(identifier)) {
        return <p>Must be a valid month</p>;
      } else {
        return <></>;
      }
    } else if (identifier === "year") {
      if (submittedEmptyValue(identifier)) {
        return <p>This field is required</p>;
      } else if (shouldDisplayInputError(identifier)) {
        return <p>Must be a valid year</p>;
      } else if (areInputsValid() && isEnteredDateValid() && isDateInFuture()) {
        return <p>Must be in the past</p>;
      } else {
        return <></>;
      }
    } else {
      return <></>;
    }
  }

  function computeTimeDifference() {
    const { currentDate, enteredDate } = getComparisonDates();
    const formatter = DatesYMD.diffDates(enteredDate, currentDate);
    const differenceArray = formatter.diffArray();

    return {
      years: differenceArray[0],
      months: differenceArray[1],
      days: differenceArray[2],
    };
  }

  function onSubmit(event) {
    event.preventDefault();
    setModificationState(postSubmissionState);
    if (areInputsValid() && isEnteredDateValid() && !isDateInFuture()) {
      setTimeDifference(computeTimeDifference());
    } else {
      setTimeDifference(invalidTimeDifferenceState);
    }
  }

  function handleInputChange(identifier, newValue) {
    const formattedNewValue = isInteger(newValue)
      ? (+newValue).toString()
      : newValue;
    setEnteredValues((previousValues) => ({
      ...previousValues,
      [identifier]: formattedNewValue,
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

  // TODO consider refactoring each of these <div inputContainer> elements into a separate component
  return (
    <div>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.inputsContainer}>
          {identifiers.map((identifier) => (
            <Input
              identifier={identifier}
              handleFocus={() => handleInputFocus("day")}
              handleBlur={() => {
                setTimeout(() => {
                  handleInputBlur("day");
                }, onBlurTimeoutDuration);
              }}
              handleChange={(event) =>
                handleInputChange("day", event.target.value)
              }
              value={enteredValues[identifier]}
              getErrorMessage={() => errorMessage(identifier)}
              shouldDisplayError={() => shouldDisplayError(identifier)}
            />
          ))}
          {/* <div className={styles.inputContainer}>
            <label htmlFor="day-input">Day</label>
            <input
              id="day-input"
              placeholder="DD"
              onFocus={() => handleInputFocus("day")}
              onBlur={() => {
                setTimeout(() => {
                  handleInputBlur("day");
                }, onBlurTimeoutDuration);
              }}
              onChange={(event) => handleInputChange("day", event.target.value)}
              value={enteredValues.day}
            ></input>
            {errorMessage('day')}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="month-input">Month</label>
            <input
              id="month-input"
              placeholder="MM"
              onBlur={() => {
                setTimeout(() => {
                  handleInputBlur("month");
                }, onBlurTimeoutDuration);
              }}
              onFocus={() => handleInputFocus("month")}
              onChange={(event) =>
                handleInputChange("month", event.target.value)
              }
              value={enteredValues.month}
            ></input>
            {errorMessage('month')}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="year-input">Year</label>
            <input
              id="year-input"
              placeholder="YYYY"
              onBlur={() => {
                setTimeout(() => {
                  handleInputBlur("year");
                }, onBlurTimeoutDuration);
              }}
              onFocus={() => handleInputFocus("year")}
              onChange={(event) =>
                handleInputChange("year", event.target.value)
              }
              value={enteredValues.year}
            ></input>
            {errorMessage('year')}
          </div> */}
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
          <div className={styles.outputValue}>{timeDifference.years}</div>
          <div className={styles.units}>years</div>
        </div>
        <div>
          <div className={styles.outputValue}>{timeDifference.months}</div>
          <div className={styles.units}>months</div>
        </div>
        <div>
          <div className={styles.outputValue}>{timeDifference.days}</div>
          <div className={styles.units}>days</div>
        </div>
      </div>
    </div>
  );
}

export default App;
