import styles from "./App.module.css";
import { useState } from "react";
import IconArrow from "./assets/images/icon-arrow.svg?react";

function App() {
  const [enteredValues, setEnteredValues] = useState({
    day: '',
    month: '',
    year: '',
  });

  const [hasEditted, setHasEditted] = useState({
    day: false,
    month: false,
    year: false
  });

  const isDayInvalid = hasEditted.day && (1 > +enteredValues.day || +enteredValues.day > 31);
  const isMonthInvalid = hasEditted.month && (+enteredValues.month < 1 || 12 < +enteredValues.month);

  function onSubmit(event) {
    event.preventDefault();
    console.log("Button clicked!");
    console.log("values: " + JSON.stringify(enteredValues));
    console.log("editted: " + JSON.stringify(hasEditted));
  }

  function handleInputChange(identifier, newValue) {
    setEnteredValues((previousValues) => ({
      ...previousValues,
      [identifier]: newValue,
    }));
  }

  function handleInputBlur(identifier) {
    setHasEditted(previousState => ({
      ...previousState,
      [identifier] : true
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
              onBlur={() => handleInputBlur('day')}
              onChange={(event) => handleInputChange('day', event.target.value)}
              value={enteredValues.day}
            ></input>
            {isDayInvalid ? <p>Must be a valid day</p>: <></>}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="month-input">Month</label>
            <input
              id="month-input"
              placeholder="MM"
              onBlur={() => handleInputBlur('month')}
              onChange={(event) => handleInputChange('month', event.target.value)}
              value={enteredValues.month}
            ></input>
            {isMonthInvalid ? <p>Must be a valid month</p> : <></>}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="year-input">Year</label>
            <input id="year-input" placeholder="YYYY" type="number"></input>
            <div>Error State Here!</div>
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
