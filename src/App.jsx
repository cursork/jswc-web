import { useEffect, useRef, useState } from 'react';
import { AppDataContext } from './context';
import { SelectComponent } from './components';
import { checkPeriod, getObjectById } from './utils';
import { Edit } from './objects';
import './App.css';

const App = () => {
  const [socketData, setSocketData] = useState([]);
  const [socket, setSocket] = useState(null);
  const [layout, setLayout] = useState('Initialise');

  const dataRef = useRef({});

  const handleData = (data) => {
    const periodCount = checkPeriod(data.ID);

    const splitID = data.ID.split('.');

    if (periodCount == 0) {
      if (!dataRef.current[splitID[0]]) {
        dataRef.current[splitID[0]] = { ...data };
      }
    } else if (periodCount == 1) {
      // If we found same Id key so we came in this check
      if (dataRef.current[splitID[0]].hasOwnProperty(splitID[1])) {
        return (dataRef.current[splitID[0]][splitID[1]] = {
          ...dataRef.current[splitID[0]][splitID[1]],
          Properties: { ...dataRef.current[splitID[0]][splitID[1]].Properties, ...data.Properties },
        });
      }
      dataRef.current[splitID[0]][splitID[1]] = data;
    } else if (periodCount == 2) {
      dataRef.current[splitID[0]][splitID[1]][splitID[2]] = data;
    } else if (periodCount == 3) {
      // adding a check if the key already exists or not
      if (dataRef.current[splitID[0]][splitID[1]][splitID[2]].hasOwnProperty(splitID[3])) {
        return (dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]] = {
          ...dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]],
          Properties: {
            ...dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]].Properties,
            ...data.Properties,
          },
        });
      }
      dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]] = data;
    } else if (periodCount == 4) {
      if (
        dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]].hasOwnProperty(splitID[4])
      ) {
        return (dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]][splitID[4]] = {
          ...dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]][splitID[4]],
          Properties: {
            ...dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]][splitID[4]]
              .Properties,
            ...data.Properties,
          },
        });
      }

      dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]][splitID[4]] = data;
    } else if (periodCount == 5) {
      dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]][splitID[4]][splitID[5]] =
        data;
    }
  };

  const fetchData = () => {
    const webSocket = new WebSocket('ws://localhost:22322/');
    setSocket(webSocket);
    webSocket.onopen = () => {
      webSocket.send(layout);
      // webSocket.send('Initialise');
    };
    webSocket.onmessage = (event) => {
      // Window Creation WC

      if (event.data.includes('WC')) {
        // console.log('event from server WC', JSON.parse(event.data).WC);

        setSocketData((prevData) => [...prevData, JSON.parse(event.data).WC]);
        handleData(JSON.parse(event.data).WC);
      } else if (event.data.includes('WS')) {
        // console.log('event from server WS', JSON.parse(event.data).WS);
        setSocketData((prevData) => [...prevData, JSON.parse(event.data).WS]);
        handleData(JSON.parse(event.data).WS);
      } else if (event.data.includes('WG')) {
        // console.log('event from server WG', JSON.parse(event.data).WG);

        const serverEvent = JSON.parse(event.data).WG;

        // check if the event Emit from the client side
        if (localStorage.getItem('lastEvent')) {
          const data = getObjectById(dataRef.current, serverEvent.ID);
          const { Event } = JSON.parse(localStorage.getItem('lastEvent'));
          const { Info, Value, ID, EventName, Row, Col } = Event;

          if (EventName == 'CellChanged') {
            const data = getObjectById(dataRef.current, ID);
            const {
              Properties: { Values },
            } = JSON.parse(data);
            Values[Row - 1][Col - 1] = Value;

            console.log(
              JSON.stringify({
                WG: { ID: ID, Properties: { Values: Values }, WGID: serverEvent.WGID },
              })
            );

            webSocket.send(
              JSON.stringify({
                WG: { ID: ID, Properties: { Values: Values }, WGID: serverEvent.WGID },
              })
            );
          } else if (EventName == 'Change') {
            console.log(
              JSON.stringify({
                WG: {
                  ID: ID,
                  Properties: { Value: Info },
                  WGID: serverEvent.WGID,
                },
              })
            );

            webSocket.send(
              JSON.stringify({
                WG: {
                  ID: ID,
                  Properties: { Value: Info },
                  WGID: serverEvent.WGID,
                },
              })
            );
          } else if (
            EventName == 'Select' &&
            ID == 'F1.CalcBtn' &&
            serverEvent.ID == 'F1.Function'
          ) {
            const data = getObjectById(dataRef.current, serverEvent.ID);
            const {
              Properties: { SelItems },
            } = JSON.parse(data);
            console.log(
              JSON.stringify({
                WG: { ID: serverEvent.ID, Properties: { SelItems }, WGID: serverEvent.WGID },
              })
            );
            webSocket.send(
              JSON.stringify({
                WG: { ID: serverEvent.ID, Properties: { SelItems }, WGID: serverEvent.WGID },
              })
            );
          } else if (ID == 'F1.CalcBtn' && serverEvent.ID == 'F1.TableSize') {
            const { Properties } = JSON.parse(data);

            console.log(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: { Value: Properties?.Text },
                  WGID: serverEvent.WGID,
                },
              })
            );
            webSocket.send(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: { Value: parseInt(Properties?.Text) },
                  WGID: serverEvent.WGID,
                },
              })
            );
          } else if (EventName == 'Select' && ID !== 'F1.CalcBtn') {
            const { Info } = Event;
            const data = getObjectById(dataRef.current, ID);
            const {
              Properties: { SelItems },
            } = JSON.parse(data);

            SelItems.fill(0);
            let indexToChange = Info - 1;
            SelItems[indexToChange] = 1;

            console.log(
              JSON.stringify({ WG: { ID: ID, Properties: { SelItems }, WGID: serverEvent.WGID } })
            );

            webSocket.send(
              JSON.stringify({ WG: { ID: ID, Properties: { SelItems }, WGID: serverEvent.WGID } })
            );
          } else if (
            serverEvent.ID == 'F1.LEFTRIGHT' ||
            serverEvent.ID == 'F1.UPDOWN' ||
            EventName == 'Scroll'
          ) {
            console.log(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: {
                    THUMB: serverEvent?.ID.includes('LEFTRIGHT')
                      ? JSON.parse(localStorage.getItem('horizontalScroll')).newValue
                      : JSON.parse(localStorage.getItem('verticalScroll')).newValue,
                  },
                  WGID: serverEvent.WGID,
                },
              })
            );
            webSocket.send(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: {
                    THUMB: serverEvent?.ID.includes('LEFTRIGHT')
                      ? JSON.parse(localStorage.getItem('horizontalScroll')).newValue
                      : JSON.parse(localStorage.getItem('verticalScroll')).newValue,
                  },
                  WGID: serverEvent.WGID,
                },
              })
            );
          }

          setSocketData((prevData) => [...prevData, JSON.parse(event.data).WG]);
          handleData(JSON.parse(event.data).WG);
        }

        // Server emit from the server
        else {
          console.log({ serverEvent });

          const data = getObjectById(dataRef.current, serverEvent.ID);
          const jsondata = JSON.parse(data);

          console.log({ jsondata });

          const obj = serverEvent.Properties.map((key) => {
            let emitValue = null;
            let Type = jsondata.Properties.Type;

            switch (Type) {
              case 'Edit':
                emitValue = parseInt(jsondata?.Properties?.Text, 10);
                break;
            }

            console.log({ emitValue });

            return {
              [key]: jsondata.Properties.hasOwnProperty(key) ? jsondata.Properties[key] : emitValue,
            };
          });

          let serverObj = {};

          obj.forEach((obj, index) => {
            serverObj = { ...serverObj, ...obj };
          });

          console.log(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: serverObj,
                WGID: serverEvent.WGID,
              },
            })
          );
          webSocket.send(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: serverObj,
                WGID: serverEvent.WGID,
              },
            })
          );
        }
      } else if (event.data.includes('NQ')) {
        const nqEvent = JSON.parse(event.data).NQ;
        const element = document.getElementById(nqEvent.ID);
        element.focus();
      }
    };
  };

  useEffect(() => {
    dataRef.current = {};
    localStorage.clear();
    fetchData();
  }, [layout]);

  // console.log({ lastEvent });

  console.log('data', dataRef.current);

  return (
    <AppDataContext.Provider value={{ socketData, dataRef, socket }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
        <select value={layout} onChange={(e) => setLayout(e.target.value)}>
          <option value='Initialise'>Initialise</option>
          <option value='Initialise(DemoSplitters)'>Splitters</option>
          <option value='Initialise(DemoScroll)'>Scroll</option>
          <option value='Initialise(DemoTabs)'>Tabs</option>
          <option value='Initialise(DemoRibbon)'>Ribbon</option>
          <option value='Initialise(DemoTreeView'>Tree View</option>
          <option value='Initialise(DemoLines)'>Lines</option>
        </select>
      </div>

      <SelectComponent data={dataRef.current['F1']} />
    </AppDataContext.Provider>
  );
};

export default App;
