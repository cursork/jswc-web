import {
  setStyle,
  extractStringUntilSecondPeriod,
  generateAsteriskString,
  calculateDateAfterDays,
  calculateDaysFromDate,
  replaceDanishToNumber,
  rgbColor,
} from '../utils';
import { useState, useRef, useEffect } from 'react';
import { useAppData } from '../hooks';

const Edit = ({ data, value, event = '', row = '', column = '', location = '' }) => {
  const currentLocale = navigator.language || navigator.userLanguage;

  let styles = { ...setStyle(data?.Properties) };
  const { socket } = useAppData();
  const [inputType, setInputType] = useState('text');
  const [inputValue, setInputValue] = useState('');
  const [emitValue, setEmitValue] = useState('');
  const [initialValue, setInitialValue] = useState('');

  const { FieldType, MaxLength, FCol, Decimal, Visible, Event } = data?.Properties;

  const hasTextProperty = data?.Properties.hasOwnProperty('Text');
  const hasValueProperty = data?.Properties.hasOwnProperty('Value');
  const isPassword = data?.Properties.hasOwnProperty('Password');
  const inputRef = useRef(null);

  const decideInputValue = () => {
    if (location == 'inGrid') {
      if (FieldType == 'Date') {
        setEmitValue(value);
        setInitialValue(value);
        return setInputValue(calculateDateAfterDays(value));
      }

      if (FieldType == 'LongNumeric') {
        setEmitValue(value);
        setInitialValue(value);
        return setInputValue(value.toLocaleString(currentLocale));
      }
      setEmitValue(value);
      setInitialValue(value);
      return setInputValue(value);
    }
    if (hasTextProperty) {
      if (isPassword) {
        setInitialValue(generateAsteriskString(data?.Properties?.Text?.length));
        setEmitValue(data?.Properties?.Text);
        return setInputValue(generateAsteriskString(data?.Properties?.Text?.length));
      } else {
        setEmitValue(data?.Properties?.Text);
        setInitialValue(data?.Properties?.Text);
        return setInputValue(data?.Properties?.Text);
      }
    }
    if (hasValueProperty) {
      if (isPassword) {
        setInitialValue(generateAsteriskString(data?.Properties?.Value?.length));
        setEmitValue(data?.Properties?.Value);
        return setInputValue(generateAsteriskString(data?.Properties?.Value?.length));
      } else {
        setInitialValue(data?.Properties?.Value);
        setEmitValue(data?.Properties?.Value);
        return setInputValue(data?.Properties?.Value);
      }
    }
  };

  // check that the Edit is in the Grid or not

  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  const decideInputType = () => {
    if (FieldType == 'Numeric') {
      setInputType('number');
    } else if (FieldType == 'Date') {
      setInputType('date');
    }
  };

  useEffect(() => {
    decideInputType();
  }, []);

  useEffect(() => {
    decideInputValue();
  }, [data]);

  // Checks for the Styling of the Edit Field

  if (location == 'inGrid') {
    styles = { ...styles, border: 'none', color: FCol ? rgbColor(FCol) : 'black' };
  } else {
    styles = {
      ...styles,
      borderTop: 0,
      borderLeft: 0,
      borderRight: 0,
      borderBottom: '1px solid black',
      color: FCol ? rgbColor(FCol) : 'black',
    };
  }

  const handleCellMove = () => {
    if (location !== 'inGrid') return;
    const parent = inputRef.current.parentElement;
    const grandParent = parent.parentElement;
    const superParent = grandParent.parentElement;
    const nextSibling = superParent.nextSibling;
    const element = nextSibling?.querySelectorAll('input');
    element &&
      element.forEach((inputElement) => {
        if (inputElement.id === data?.ID) {
          inputElement.select();
        }
      });
  };

  const handleKeyPress = (e) => {
    if (e.key == 'Enter') handleCellMove();
    const exists = Event && Event.some((item) => item[0] === 'KeyPress');
    if (!exists) return;

    const isAltPressed = e.altKey ? 4 : 0;
    const isCtrlPressed = e.ctrlKey ? 2 : 0;
    const isShiftPressed = e.shiftKey ? 1 : 0;
    const charCode = e.key.charCodeAt(0);
    let shiftState = isAltPressed + isCtrlPressed + isShiftPressed;

    console.log(
      JSON.stringify({
        Event: {
          EventName: 'KeyPress',
          ID: data?.ID,
          Info: [e.key, charCode, e.keyCode, shiftState],
        },
      })
    );

    socket.send(
      JSON.stringify({
        Event: {
          EventName: 'KeyPress',
          ID: data?.ID,
          Info: [e.key, charCode, e.keyCode, shiftState],
        },
      })
    );
  };

  const triggerChangeEvent = () => {
    const event = JSON.stringify({
      Event: {
        EventName: 'Change',
        ID: data?.ID,
        Info: emitValue,
      },
    });
    localStorage.setItem(data?.ID, event);
    const exists = Event && Event.some((item) => item[0] === 'Change');
    if (!exists) return;
    console.log(event);
    socket.send(event);
  };

  const triggerCellChangedEvent = () => {
    const cellChangedEvent = JSON.stringify({
      Event: {
        EventName: 'CellChanged',
        ID: extractStringUntilSecondPeriod(data?.ID),
        Row: parseInt(row),
        Col: parseInt(column),
        Value: emitValue,
      },
    });

    localStorage.setItem(extractStringUntilSecondPeriod(data?.ID), cellChangedEvent);
    const exists = event && event.some((item) => item[0] === 'CellChanged');
    if (!exists) return;
    console.log(cellChangedEvent);
    socket.send(cellChangedEvent);
  };

  const handleEditEvents = () => {
    // check that the Edit is inside the Grid
    if (location == 'inGrid') {
      if (value != emitValue) {
        triggerChangeEvent();
        triggerCellChangedEvent();
      }
    } else {
      if (initialValue != emitValue) triggerChangeEvent();
    }
  };

  if (inputType == 'date') {
    return <div>Date Edit</div>;
  }

  return (
    <input
      id={data.ID}
      ref={inputRef}
      value={inputValue}
      onClick={handleInputClick}
      type={inputType}
      onChange={(e) => {
        let value = e.target.value;
        if (FieldType == 'Numeric') {
          if (!Decimal) {
            value = parseInt(e.target.value);
            setInputValue(e.target.value);
            setEmitValue(value);
          }

          let number = parseInt(e.target.value);
          value = number.toFixed(Decimal);
          setEmitValue(parseInt(value));
          setInputValue(value);
        }
        if (FieldType == 'Date') {
          value = calculateDaysFromDate(e.target.value) + 1;
          setInputValue(e.target.value);
          setEmitValue(value);
        }
        if (FieldType == 'LongNumeric') {
          value = replaceDanishToNumber(e.target.value);

          setInputValue(e.target.value.toLocaleString(currentLocale));
          setEmitValue(value);
        }

        if (!FieldType) {
          setEmitValue(e.target.value);
          setInputValue(e.target.value);
        }
      }}
      onBlur={() => {
        if (FieldType == 'LongNumeric') {
          setInputValue(emitValue.toLocaleString(currentLocale));
        }
        handleEditEvents();
      }}
      onKeyDown={(e) => handleKeyPress(e)}
      style={{
        ...styles,
        borderRadius: '2px',
        fontSize: '12px',
        zIndex: 1,
        display: Visible == 0 ? 'none' : 'block',
        paddingLeft: '5px',
      }}
      maxLength={MaxLength}
    />
  );
};

export default Edit;
