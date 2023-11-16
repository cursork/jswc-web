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

const Edit = ({ data, value, event = '', row = '', column = '' }) => {
  let styles = { ...setStyle(data?.Properties) };
  const { socket } = useAppData();
  const [inputType, setInputType] = useState('text');
  const [inputValue, setInputValue] = useState('');
  const [emitValue, setEmitValue] = useState('');

  const { FieldType, MaxLength, FCol, Decimal } = data?.Properties;

  const hasTextProperty = data?.Properties.hasOwnProperty('Text');
  const hasValueProperty = data?.Properties.hasOwnProperty('Value');
  const isPassword = data?.Properties.hasOwnProperty('Password');

  const inputRef = useRef(null);
  let editValue = null;

  // const [inputValue, setInputValue] = useState(
  //   event == 'CellChanged'
  //     ? value
  //     : isPassword
  //     ? generateAsteriskString(data?.Properties?.Text?.length)
  //     : editValue
  // );

  const decideInputValue = () => {
    if (event == 'CellChanged') {
      if (FieldType == 'Date') {
        return setInputValue(calculateDateAfterDays(value));
      }

      if (FieldType == 'LongNumeric') {
        return setInputValue(value.toLocaleString('da-DK'));
      }
      return setInputValue(value);
    }
    if (hasTextProperty) {
      if (isPassword) {
        return setInputValue(generateAsteriskString(data?.Properties?.Text?.length));
      } else {
        return setInputValue(data?.Properties?.Text);
      }
    }
    if (hasValueProperty) {
      if (isPassword) {
        return setInputValue(generateAsteriskString(data?.Properties?.Value?.length));
      } else {
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

  if (event == 'CellChanged') {
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

  const handleKeyDown = (event) => {
    // Check if Alt, Ctrl, or Shift keys are pressed
  };

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
          setEmitValue(value);
          setInputValue(value);
        }
        if (FieldType == 'Date') {
          value = calculateDaysFromDate(e.target.value) + 1;
          setInputValue(e.target.value);
          setEmitValue(value);
        }
        if (FieldType == 'LongNumeric') {
          value = replaceDanishToNumber(e.target.value);
          console.log('longNumeric', e.target.value);
          setInputValue(e.target.value);
          setEmitValue(value);
        }

        if (!FieldType) {
          setEmitValue(e.target.value);
          setInputValue(e.target.value);
        }

        // console.log(
        //   JSON.stringify({
        //     Event: {
        //       EventName: 'KeyPress',
        //       ID: data?.ID,
        //       Info: [e.target.value.toString(), e.charCode, e.keyCode, e.shiftKey],
        //     },
        //   })
        // );

        // localStorage.setItem(
        //   event === 'CellChanged' ? extractStringUntilSecondPeriod(data?.ID) : data?.ID,
        //   event === 'CellChanged'
        //     ? JSON.stringify({
        //         Event: {
        //           EventName: event,
        //           ID: extractStringUntilSecondPeriod(data?.ID),
        //           Row: parseInt(row),
        //           Col: parseInt(column),
        //           Value: value,
        //         },
        //       })
        //     : JSON.stringify({
        //         Event: {
        //           EventName: data?.Properties?.Event[0],
        //           ID: data?.ID,
        //           Info: value,
        //         },
        //       })
        // );

        // socket.send(
        //   event == 'CellChanged'
        //     ? JSON.stringify({
        //         Event: {
        //           EventName: event,
        //           ID: extractStringUntilSecondPeriod(data?.ID),
        //           Row: parseInt(row),
        //           Col: parseInt(column),
        //           Value: value,
        //         },
        //       })
        //     : JSON.stringify({
        //         Event: {
        //           EventName: data?.Properties?.Event[1],
        //           ID: data?.ID,
        //           Info: value,
        //         },
        //       })
        // );
      }}
      onBlur={() => {
        console.log(
          event == 'CellChanged'
            ? JSON.stringify({
                Event: {
                  EventName: event,
                  ID: extractStringUntilSecondPeriod(data?.ID),
                  Row: parseInt(row),
                  Col: parseInt(column),
                  Value: emitValue,
                },
              })
            : JSON.stringify({
                Event: {
                  EventName: 'Change',
                  ID: data?.ID,
                  Info: emitValue,
                },
              })
        );
        localStorage.setItem(
          event === 'CellChanged' ? extractStringUntilSecondPeriod(data?.ID) : data?.ID,
          event === 'CellChanged'
            ? JSON.stringify({
                Event: {
                  EventName: event,
                  ID: extractStringUntilSecondPeriod(data?.ID),
                  Row: parseInt(row),
                  Col: parseInt(column),
                  Value: emitValue,
                },
              })
            : JSON.stringify({
                Event: {
                  EventName: 'Change',
                  ID: data?.ID,
                  Info: emitValue,
                },
              })
        );

        socket.send(
          event == 'CellChanged'
            ? JSON.stringify({
                Event: {
                  EventName: event,
                  ID: extractStringUntilSecondPeriod(data?.ID),
                  Row: parseInt(row),
                  Col: parseInt(column),
                  Value: emitValue,
                },
              })
            : JSON.stringify({
                Event: {
                  EventName: 'Change',
                  ID: data?.ID,
                  Info: emitValue,
                },
              })
        );
      }}
      onKeyDown={(e) => {
        setTimeout(() => {
          const isAltPressed = e.altKey ? 4 : 0;
          const isCtrlPressed = e.ctrlKey ? 2 : 0;
          const isShiftPressed = e.shiftKey ? 1 : 0;
          const charCode = e.key.charCodeAt(0);

          const value = e.target.value;
          let shiftState = isAltPressed + isCtrlPressed + isShiftPressed;
          console.log(
            JSON.stringify({
              Event: {
                EventName: 'KeyPress',
                ID: data?.ID,
                Info: [value.toString(), charCode, e.keyCode, shiftState],
              },
            })
          );

          socket.send(
            JSON.stringify({
              Event: {
                EventName: 'KeyPress',
                ID: data?.ID,
                Info: [value.toString(), charCode, e.keyCode, shiftState],
              },
            })
          );
        }, 0);
      }}
      style={{ ...styles, borderRadius: '2px', fontSize: '12px' }}
      maxLength={MaxLength}
    />
  );
};

export default Edit;
