import { setStyle, extractStringUntilSecondPeriod, generateAsteriskString } from '../utils';
import { useState, useRef } from 'react';
import { useAppData } from '../hooks';

const Edit = ({ data, value, event = '', row = '', column = '' }) => {
  let styles = { ...setStyle(data?.Properties) };
  const { socket } = useAppData();
  const hasTextProperty = data?.Properties.hasOwnProperty('Text');
  const isPassword = data?.Properties.hasOwnProperty('Password');
  const inputRef = useRef(null);

  const [inputValue, setInputValue] = useState(
    hasTextProperty
      ? isPassword
        ? generateAsteriskString(data?.Properties?.Text?.length)
        : data.Properties.Text
      : value
  );

  if (!hasTextProperty) {
    styles = { ...styles, border: 'none' };
  }

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

  return (
    <input
      ref={inputRef}
      value={inputValue}
      onClick={handleInputClick}
      type={data?.Properties?.FieldType == 'Numeric' ? 'number' : 'text'}
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
          'lastEvent',
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
