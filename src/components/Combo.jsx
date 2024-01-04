import { setStyle, extractStringUntilSecondPeriod } from '../utils';

import { useAppData } from '../hooks';
import { useState } from 'react';
import { useEffect } from 'react';

const Combo = ({ data, value, event = '', row = '', column = '', location = '', values = [] }) => {
  const { socket, handleData, findDesiredData } = useAppData();
  const styles = setStyle(data?.Properties);
  const { Items, SelItems, Event, Visible } = data?.Properties;

  const [comboInput, setComboInput] = useState('+');

  useEffect(() => {
    const index = SelItems?.findIndex((element) => element == 1);
    setComboInput(Items[index]);
  }, [SelItems]);

  const handleCellChangeEvent = (value) => {
    const gridEvent = findDesiredData(extractStringUntilSecondPeriod(data?.ID));
    values[parseInt(row) - 1][parseInt(column) - 1] = value;
    handleData(
      {
        ID: extractStringUntilSecondPeriod(data?.ID),
        Properties: {
          ...gridEvent.Properties,
          Values: values,
          CurCell:[row,column]
        },
      },
      'WS'
    );

    const triggerEvent = JSON.stringify({
      Event: {
        EventName: 'CellChanged',
        ID: extractStringUntilSecondPeriod(data?.ID),
        Row: parseInt(row),
        Col: parseInt(column),
        Value: value,
      },
    });


     const updatedGridValues = JSON.stringify({
       Event: {
         EventName: 'CellChanged',
         Values: values,
         CurCell: [row, column],
       },
     });

    localStorage.setItem(extractStringUntilSecondPeriod(data?.ID), updatedGridValues);
    const exists = event && event.some((item) => item[0] === 'CellChanged');
    if (!exists) return;

    console.log(triggerEvent);
    socket.send(triggerEvent);
  };

  const handleSelectEvent = (value) => {
    const triggerEvent = JSON.stringify({
      Event: {
        EventName: 'Select',
        ID: data?.ID,
        Info: parseInt(value + 1),
      },
    });
    localStorage.setItem(data?.ID, triggerEvent);
    const exists = Event && Event.some((item) => item[0] === 'Select');
    if (!exists) return;
    console.log(triggerEvent);
    socket.send(triggerEvent);
  };

  const handleSelItemsEvent = (value) => {
    const index = Items.indexOf(value);

    if (location == 'inGrid') {
      handleSelectEvent(index);
      handleCellChangeEvent(value);
    } else {
      handleSelectEvent(index);
    }
  };

  return (
    <div style={{ ...styles, borderColor: '#ccc', display: Visible == 0 ? 'none' : 'block' }}>
      <select
        id={data?.ID}
        value={value ? value : comboInput}
        style={{
          width: '100%',
          border: 0,
          fontSize: '12px',
          height: location === 'inGrid' ? null : '100%',
          zIndex: 1,
        }}
        onChange={(e) => {
          setComboInput(e.target.value);
          handleSelItemsEvent(e.target.value);
        }}
      >
        {Items && Items.map((item, i) => <option value={item}>{item}</option>)}
      </select>
    </div>
  );
};

export default Combo;

//  console.log(
//    event == 'CellChanged'
//      ? JSON.stringify({
//          Event: {
//            EventName: event,
//            ID: extractStringUntilSecondPeriod(data?.ID),
//            Row: parseInt(row),
//            Col: parseInt(column),
//            Value: e.target.value,
//          },
//        })
//      : JSON.stringify({
//          Event: {
//            EventName: data?.Properties?.Event[0],
//            ID: data?.ID,
//            Info: parseInt(index + 1),
//          },
//        })
//  );

//  if (event == 'CellChanged') {
//    localStorage.setItem(
//      extractStringUntilSecondPeriod(data?.ID),
//      JSON.stringify({
//        Event: {
//          EventName: event,
//          ID: extractStringUntilSecondPeriod(data?.ID),
//          Row: parseInt(row),
//          Col: parseInt(column),
//          Value: e.target.value,
//        },
//      })
//    );
//  } else {
//    localStorage.setItem(
//      data?.ID,
//      JSON.stringify({
//        Event: {
//          EventName: emitEvent && emitEvent[0],
//          ID: data?.ID,
//          Info: parseInt(index + 1),
//        },
//      })
//    );
//  }

//  socket.send(
//    event == 'CellChanged'
//      ? JSON.stringify({
//          Event: {
//            EventName: event,
//            ID: extractStringUntilSecondPeriod(data?.ID),
//            Row: parseInt(row),
//            Col: parseInt(column),
//            Value: e.target.value,
//          },
//        })
//      : JSON.stringify({
//          Event: {
//            EventName: emitEvent && emitEvent[0],
//            ID: data?.ID,
//            Info: parseInt(index + 1),
//          },
//        })
//  );
