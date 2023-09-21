import { setStyle, extractStringUntilSecondPeriod } from '../utils';
import { useState } from 'react';
import { useAppData } from '../hooks';

const Edit = ({ data, value, event = '', row = '', column = '' }) => {
  let styles = setStyle(data?.Properties);
  const { socket, BackFire } = useAppData();
  const hasTextProperty = data?.Properties.hasOwnProperty('Text');
  const [inputValue, setInputValue] = useState(hasTextProperty ? data.Properties.Text : value);

  if (!hasTextProperty) {
    styles = { ...styles, border: 'none' };
  }

  return (
    <input
      value={inputValue}
      type={data?.Properties?.FieldType == 'Numeric' ? 'number' : 'text'}
      onChange={(e) => {
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

        localStorage.setItem(
          'lastEvent',
          event === 'CellChanged'
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
      }}
      style={{ ...styles }}
    />
  );
};

export default Edit;
