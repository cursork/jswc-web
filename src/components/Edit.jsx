import { setStyle, extractStringUntilSecondPeriod, generateAsteriskString } from '../utils';
import { useState, useRef, useEffect } from 'react';
import { useAppData } from '../hooks';

const Edit = ({ data, value, event = '', row = '', column = '' }) => {
  let styles = { ...setStyle(data?.Properties) };
  const { socket } = useAppData();

  let inputType = 'text';

  const { FieldType } = data?.Properties;

  const hasTextProperty = data?.Properties.hasOwnProperty('Text');
  const hasValueProperty = data?.Properties.hasOwnProperty('Value');
  const isPassword = data?.Properties.hasOwnProperty('Password');
  const inputRef = useRef(null);
  let editValue = null;
  if (hasTextProperty) {
    editValue = data?.Properties.Text;
  }

  if (hasValueProperty) {
    editValue = data?.Properties.Value;
  }

  if (!hasTextProperty) {
    styles = { ...styles, border: 'none' };
  }

  if (FieldType == 'Numeric') {
    inputType = 'number';
  }

  if (FieldType == 'Date') {
    inputType = 'date';
  }

  const [inputValue, setInputValue] = useState(
    event == 'CellChanged'
      ? value
      : isPassword
      ? generateAsteriskString(data?.Properties?.Text?.length)
      : editValue
  );

  if (hasTextProperty) {
    styles = {
      ...styles,
      borderTop: 0,
      borderLeft: 0,
      borderRight: 0,
      borderBottom: '1px solid black',
    };
  }
  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  useEffect(() => {
    if (isPassword) return setInputValue(generateAsteriskString(data?.Properties?.Text?.length));
    setInputValue(editValue);
  }, [editValue]);

  return (
    <input
      id={data.ID}
      ref={inputRef}
      value={inputValue}
      onClick={handleInputClick}
      type={inputType}
      onChange={(e) => {
        setInputValue(e.target.value);

        console.log(
          event == 'CellChanged'
            ? JSON.stringify({
                Event: {
                  EventName: event,
                  ID: extractStringUntilSecondPeriod(data?.ID),
                  Row: parseInt(row),
                  Col: parseInt(column),
                  Value:
                    data?.Properties?.FieldType == 'Numeric'
                      ? parseInt(e.target.value)
                      : e.target.value,
                },
              })
            : JSON.stringify({
                Event: {
                  EventName: data?.Properties?.Event[0],
                  ID: data?.ID,
                  Info:
                    data?.Properties?.FieldType == 'Numeric'
                      ? parseInt(e.target.value)
                      : e.target.value,
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
                  Value:
                    data?.Properties?.FieldType == 'Numeric'
                      ? parseInt(e.target.value)
                      : e.target.value,
                },
              })
            : JSON.stringify({
                Event: {
                  EventName: data?.Properties?.Event[0],
                  ID: data?.ID,
                  Info:
                    data?.Properties?.FieldType == 'Numeric'
                      ? parseInt(e.target.value)
                      : e.target.value,
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
                  Value:
                    data?.Properties?.FieldType == 'Numeric'
                      ? parseInt(e.target.value)
                      : e.target.value,
                },
              })
            : JSON.stringify({
                Event: {
                  EventName: data?.Properties?.Event[0],
                  ID: data?.ID,
                  Info:
                    data?.Properties?.FieldType == 'Numeric'
                      ? parseInt(e.target.value)
                      : e.target.value,
                },
              })
        );
      }}
      style={{ ...styles, borderRadius: '2px', fontSize: '12px' }}
    />
  );
};

export default Edit;
