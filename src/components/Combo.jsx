import { setStyle, extractStringUntilSecondPeriod } from '../utils';

import { useAppData } from '../hooks';

const Combo = ({ data, value, event = '', row = '', column = '' }) => {
  const { socket } = useAppData();
  const styles = setStyle(data?.Properties);
  const { Items } = data?.Properties;

  return (
    <div style={{ ...styles }}>
      <select
        className='custom-select'
        defaultValue={value ? value : data?.Properties?.Text}
        style={{ width: '100%', border: 0 }}
        onChange={(e) => {
          const index = Items.indexOf(e.target.value);

          console.log(
            event == 'CellChanged'
              ? JSON.stringify({
                  Event: {
                    EventName: event,
                    ID: extractStringUntilSecondPeriod(data?.ID),
                    Row: parseInt(row) + 1,
                    Col: parseInt(column) + 1,
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

          localStorage.setItem(
            'lastEvent',
            event == 'CellChanged'
              ? JSON.stringify({
                  Event: {
                    EventName: event,
                    ID: extractStringUntilSecondPeriod(data?.ID),
                    Row: parseInt(row) + 1,
                    Col: parseInt(column) + 1,
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

          socket.send(
            event == 'CellChanged'
              ? JSON.stringify({
                  Event: {
                    EventName: event,
                    ID: extractStringUntilSecondPeriod(data?.ID),
                    Row: parseInt(row) + 1,
                    Col: parseInt(column) + 1,
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
