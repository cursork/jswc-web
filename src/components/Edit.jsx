import { setStyle, extractStringUntilSecondPeriod } from '../utils';
import { useState } from 'react';
import { useAppData } from '../hooks';

const Edit = ({ data, value, event = '', row = '', column = '' }) => {
  let styles = setStyle(data?.Properties);
  const { socket } = useAppData();
  const hasTextProperty = data?.Properties.hasOwnProperty('Text');
  const [inputValue, setInputValue] = useState(hasTextProperty ? data.Properties.Text : value);

  if (!hasTextProperty) {
    styles = { ...styles, border: 'none' };
  }

  const handleEvent = (e) => {
    if (e.target.value == '') return alert('Value must be valid');
    socket.send(
      event == 'CellChanged'
        ? JSON.stringify({
            Event: {
              EventName: event,
              ID: extractStringUntilSecondPeriod(data?.ID),
              Row: parseInt(row) + 1,
              Col: parseInt(column) + 1,
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
              Info: parseInt(e.target.value),
            },
          })
    );
  };

  return (
    <input
      value={inputValue}
      type={data?.Properties?.FieldType == 'Numeric' ? 'number' : 'text'}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={(e) => {
        setInputValue(e.target.value);

        console.log(
          event == 'CellChanged'
            ? JSON.stringify({
                Event: {
                  EventName: event,
                  ID: extractStringUntilSecondPeriod(data?.ID),
                  Row: parseInt(row) + 1,
                  Col: parseInt(column) + 1,
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
                  Info: parseInt(e.target.value),
                },
              })
        );

        handleEvent(e);
      }}
      style={{ ...styles }}
    />
  );
};

export default Edit;
