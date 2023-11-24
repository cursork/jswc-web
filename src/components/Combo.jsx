import { setStyle, extractStringUntilSecondPeriod } from '../utils';

import { useAppData } from '../hooks';
import { useState } from 'react';
import { useEffect } from 'react';

const Combo = ({ data, value, event = '', row = '', column = '' }) => {
  const { socket } = useAppData();
  const styles = setStyle(data?.Properties);
  const { Items, SelItems } = data?.Properties;

  const [comboInput, setComboInput] = useState('+');

  useEffect(() => {
    const index = SelItems?.findIndex((element) => element == 1);
    setComboInput(Items[index]);
  }, [SelItems]);

  return (
    <div style={{ ...styles, borderColor: '#ccc' }}>
      <select
        id={data?.ID}
        value={value ? value : comboInput}
        style={{
          width: '100%',
          border: 0,
          fontSize: '12px',
          height: event === 'CellChanged' ? null : '100%',
          zIndex: 1,
        }}
        onChange={(e) => {
          const index = Items.indexOf(e.target.value);

          setComboInput(e.target.value);
          console.log(
            event == 'CellChanged'
              ? JSON.stringify({
                  Event: {
                    EventName: event,
                    ID: extractStringUntilSecondPeriod(data?.ID),
                    Row: parseInt(row),
                    Col: parseInt(column),
                    Value: e.target.value,
                  },
                })
              : JSON.stringify({
                  Event: {
                    EventName: data?.Properties?.Event[0],
                    ID: data?.ID,
                    Info: parseInt(index + 1),
                  },
                })
          );

          if (event == 'CellChanged') {
            localStorage.setItem(
              extractStringUntilSecondPeriod(data?.ID),
              JSON.stringify({
                Event: {
                  EventName: event,
                  ID: extractStringUntilSecondPeriod(data?.ID),
                  Row: parseInt(row),
                  Col: parseInt(column),
                  Value: e.target.value,
                },
              })
            );
          } else {
            localStorage.setItem(
              data?.ID,
              JSON.stringify({
                Event: {
                  EventName: data?.Properties?.Event[0],
                  ID: data?.ID,
                  Info: parseInt(index + 1),
                },
              })
            );
          }

          socket.send(
            event == 'CellChanged'
              ? JSON.stringify({
                  Event: {
                    EventName: event,
                    ID: extractStringUntilSecondPeriod(data?.ID),
                    Row: parseInt(row),
                    Col: parseInt(column),
                    Value: e.target.value,
                  },
                })
              : JSON.stringify({
                  Event: {
                    EventName: data?.Properties?.Event[0],
                    ID: data?.ID,
                    Info: parseInt(index + 1),
                  },
                })
          );
        }}
      >
        {Items && Items.map((item, i) => <option value={item}>{item}</option>)}
      </select>
    </div>
  );
};

export default Combo;
