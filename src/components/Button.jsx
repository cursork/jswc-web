import { setStyle, extractStringUntilSecondPeriod } from '../utils';
import { useAppData } from '../hooks';

const Button = ({ data, inputValue, event = '', row = '', column = '' }) => {
  const styles = setStyle(data?.Properties);
  const { socket } = useAppData();

  const hasCaption = data.Properties.hasOwnProperty('Caption');

  const isCheckBox = data?.Properties?.Style && data?.Properties?.Style == 'Check';

  if (isCheckBox) {
    return (
      <div style={{ ...styles, marginLeft: '10px', marginTop: '5px' }}>
        <input
          type='checkbox'
          defaultChecked={inputValue}
          onChange={(e) => {
            console.log(
              JSON.stringify({
                Event: {
                  EventName: event,
                  ID: extractStringUntilSecondPeriod(data?.ID),
                  Row: parseInt(row) + 1,
                  Col: parseInt(column) + 1,
                  Value: e.target.checked ? 1 : 0,
                },
              })
            );

            localStorage.setItem(
              'lastEvent',
              JSON.stringify({
                Event: {
                  EventName: event,
                  ID: extractStringUntilSecondPeriod(data?.ID),
                  Row: parseInt(row) + 1,
                  Col: parseInt(column) + 1,
                  Value: e.target.checked ? 1 : 0,
                },
              })
            );

            socket.send(
              JSON.stringify({
                Event: {
                  EventName: event,
                  ID: extractStringUntilSecondPeriod(data?.ID),
                  Row: parseInt(row) + 1,
                  Col: parseInt(column) + 1,
                  Value: e.target.checked ? 1 : 0,
                },
              })
            );
          }}
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        console.log(
          JSON.stringify({
            Event: {
              EventName: data?.Properties?.Event[0],
              ID: data?.ID,
            },
          })
        );

        localStorage.setItem(
          'lastEvent',
          JSON.stringify({
            Event: {
              EventName: data?.Properties?.Event[0],
              ID: data?.ID,
            },
          })
        );

        socket.send(
          JSON.stringify({
            Event: {
              EventName: data?.Properties?.Event[0],
              ID: data?.ID,
            },
          })
        );
      }}
      style={{ ...styles, border: '1px solid black', textAlign: 'center', background: 'white' }}
    >
      {hasCaption ? data?.Properties?.Caption : null}
    </div>
  );
};

export default Button;
