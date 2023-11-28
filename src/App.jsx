import { useEffect, useRef, useState } from 'react';
import { AppDataContext } from './context';
import { SelectComponent } from './components';
import { checkPeriod, getObjectById, checkSupportedProperties } from './utils';
import './App.css';

const App = () => {
  const [socketData, setSocketData] = useState([]);
  const [socket, setSocket] = useState(null);
  const [layout, setLayout] = useState('Initialise');

  const dataRef = useRef({});

  const handleData = (data) => {
    const periodCount = checkPeriod(data.ID);
    const splitID = data.ID.split('.');

    // If there's a key without a period, reset dataRef and build the structure again
    if (periodCount === 0) {
      dataRef.current = {};
    }

    let currentLevel = dataRef.current;

    for (let i = 0; i < periodCount; i++) {
      const key = splitID[i];

      if (!currentLevel[key]) {
        currentLevel[key] = {};
      }

      currentLevel = currentLevel[key];
    }

    // Check if the key already exists at the final level
    const finalKey = splitID[periodCount];
    if (currentLevel.hasOwnProperty(finalKey)) {
      // Update the existing object with new properties
      currentLevel[finalKey] = {
        ...currentLevel[finalKey],
        Properties: {
          ...currentLevel[finalKey].Properties,
          ...data.Properties,
        },
      };
    } else {
      // Create a new object at the final level
      currentLevel[finalKey] = {
        ...data,
      };
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

      const keys = Object.keys(JSON.parse(event.data));

      if (keys[0] == 'WC') {
        // console.log('event from server WC', JSON.parse(event.data).WC);

        setSocketData((prevData) => [...prevData, JSON.parse(event.data).WC]);
        handleData(JSON.parse(event.data).WC);
      } else if (keys[0] == 'WS') {
        const serverEvent = JSON.parse(event.data).WS;

        let value = null;
        // @Todo Check that the Edit is Already Present or not if it is Present just change the value we are getting from the server
        const data = JSON.parse(getObjectById(dataRef.current, serverEvent.ID));

        if (data?.Properties?.Type == 'Edit') {
          if (serverEvent?.Properties.hasOwnProperty('Text')) {
            value = serverEvent?.Properties.Text;
          } else if (serverEvent?.Properties.hasOwnProperty('Value')) {
            value = serverEvent?.Properties.Value;
          }
          // Check that the Already Present Data have Text Key or Value Key
          if (data?.Properties.hasOwnProperty('Text')) {
            setSocketData((prevData) => [...prevData, JSON.parse(event.data).WS]);
            return handleData({
              ID: serverEvent.ID,
              Properties: {
                Text: value,
              },
            });
          } else if (data?.Properties.hasOwnProperty('Value')) {
            setSocketData((prevData) => [...prevData, JSON.parse(event.data).WS]);
            return handleData({
              ID: serverEvent.ID,
              Properties: {
                Value: value,
              },
            });
          }
        }

        if (data?.Properties?.Type == 'Combo') {
          if (serverEvent?.Properties.hasOwnProperty('SelItems')) {
            setSocketData((prevData) => [...prevData, JSON.parse(event.data).WS]);
            value = serverEvent?.Properties.SelItems;
            const indextoFind = value.indexOf(1);
            let Text = data?.Properties?.Items[indextoFind];
            return handleData({
              ID: serverEvent.ID,
              Properties: {
                ...data?.Properties,
                SelItems: value,
                Text,
              },
            });
          }
        }

        setSocketData((prevData) => [...prevData, JSON.parse(event.data).WS]);
        handleData(JSON.parse(event.data).WS);
      } else if (keys[0] == 'WG') {
        const serverEvent = JSON.parse(event.data).WG;

        const refData = JSON.parse(getObjectById(dataRef.current, serverEvent?.ID));
        const Type = refData?.Properties?.Type;

        // Get Data from the Ref

        const { Properties } = refData;

        if (Type == 'Grid') {
          const { Values } = Properties;

          const supportedProperties = ['Values'];

          const result = checkSupportedProperties(supportedProperties, serverEvent?.Properties);

          if (!localStorage.getItem(serverEvent.ID)) {
            console.log(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: { Values: Values },
                  WGID: serverEvent.WGID,
                },
              })
            );
            return webSocket.send(
              JSON.stringify({
                WG: { ID: serverEvent.ID, Properties: { Values: Values }, WGID: serverEvent.WGID },
              })
            );
          }

          const { Event } = JSON.parse(localStorage.getItem(serverEvent.ID));
          const { Row, Col, Value } = Event;

          Values[Row - 1][Col - 1] = Value;
          console.log(
            JSON.stringify({
              WG: { ID: serverEvent.ID, Properties: { Values: Values }, WGID: serverEvent.WGID },
            })
          );

          // Modify the data store in the ref to get the updated value

          setSocketData((prevData) => [
            ...prevData,
            {
              ID: serverEvent.ID,
              Properties: {
                ...Properties,
                Values,
              },
            },
          ]);

          handleData({
            ID: serverEvent.ID,
            Properties: {
              ...Properties,
              Values,
            },
          });

          webSocket.send(
            JSON.stringify({
              WG: { ID: serverEvent.ID, Properties: { Values: Values }, WGID: serverEvent.WGID },
            })
          );
        }

        if (Type == 'Edit') {
          const { Text, Value } = Properties;

          if (!localStorage.getItem(serverEvent.ID)) {
            const editValue = Text ? Text : Value;

            const isNumber = refData?.Properties?.hasOwnProperty('FieldType');

            const serverPropertiesObj = {};
            serverEvent.Properties.map((key) => {
              return (serverPropertiesObj[key] =
                key == 'Text' ? editValue.toString() : isNumber ? parseInt(editValue) : editValue);
            });

            console.log(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: serverPropertiesObj,
                  WGID: serverEvent.WGID,
                },
              })
            );
            return webSocket.send(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: serverPropertiesObj,
                  WGID: serverEvent.WGID,
                },
              })
            );
          }

          const { Event } = JSON.parse(localStorage.getItem(serverEvent?.ID));
          const { Info } = Event;
          const serverPropertiesObj = {};
          serverEvent.Properties.map((key) => {
            return (serverPropertiesObj[key] = key == 'Value' ? Info : Info.toString());
          });

          console.log(
            JSON.stringify({
              WG: { ID: serverEvent.ID, Properties: serverPropertiesObj, WGID: serverEvent.WGID },
            })
          );
          webSocket.send(
            JSON.stringify({
              WG: { ID: serverEvent.ID, Properties: serverPropertiesObj, WGID: serverEvent.WGID },
            })
          );
        }

        if (Type == 'Combo') {
          const { SelItems, Items } = Properties;

          if (!localStorage.getItem(serverEvent.ID)) {
            const serverPropertiesObj = {};
            serverEvent.Properties.map((key) => {
              return (serverPropertiesObj[key] = Properties[key]);
            });
            console.log(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: serverPropertiesObj,
                  WGID: serverEvent.WGID,
                },
              })
            );
            return webSocket.send(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: serverPropertiesObj,
                  WGID: serverEvent.WGID,
                },
              })
            );
          }
          const { Event } = JSON.parse(localStorage.getItem(serverEvent?.ID));
          const { Info } = Event;

          SelItems.fill(0);
          let indexToChange = Info - 1;
          SelItems[indexToChange] = 1;

          const serverPropertiesObj = {};

          serverEvent.Properties.map((key) => {
            return (serverPropertiesObj[key] = key == 'SelItems' ? SelItems : Items[indexToChange]);
          });

          console.log(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: serverPropertiesObj,
                WGID: serverEvent.WGID,
              },
            })
          );
          return webSocket.send(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: serverPropertiesObj,
                WGID: serverEvent.WGID,
              },
            })
          );
        }

        if (Type == 'List') {
          const { SelItems } = Properties;
          if (!localStorage.getItem(serverEvent.ID)) {
            console.log(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: {
                    SelItems,
                  },
                  WGID: serverEvent.WGID,
                },
              })
            );
            return webSocket.send(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: {
                    SelItems,
                  },
                  WGID: serverEvent.WGID,
                },
              })
            );
          }

          const { Event } = JSON.parse(localStorage.getItem(serverEvent?.ID));
          console.log(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: {
                  SelItems: Event['SelItems'],
                },
                WGID: serverEvent.WGID,
              },
            })
          );
          return webSocket.send(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: {
                  SelItems: Event['SelItems'],
                },
                WGID: serverEvent.WGID,
              },
            })
          );
        }

        if (Type == 'Scroll') {
          const { Thumb } = Properties;

          if (!localStorage.getItem(serverEvent.ID)) {
            console.log(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: {
                    Thumb,
                  },
                  WGID: serverEvent.WGID,
                },
              })
            );
            return webSocket.send(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: {
                    Thumb,
                  },
                  WGID: serverEvent.WGID,
                },
              })
            );
          }

          const { Event } = JSON.parse(localStorage.getItem(serverEvent?.ID));
          const { Info } = Event;

          console.log(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: {
                  Thumb: Info[1],
                },
                WGID: serverEvent.WGID,
              },
            })
          );
          return webSocket.send(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: {
                  Thumb: Info[1],
                },
                WGID: serverEvent.WGID,
              },
            })
          );
        }

        if (Type == 'Splitter') {
          const { Posn } = Properties;

          if (!localStorage.getItem(serverEvent.ID)) {
            const serverPropertiesObj = {};
            serverEvent.Properties.map((key) => {
              return (serverPropertiesObj[key] = Properties[key]);
            });

            console.log(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: serverPropertiesObj,
                  WGID: serverEvent.WGID,
                },
              })
            );
            return webSocket.send(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: serverPropertiesObj,
                  WGID: serverEvent.WGID,
                },
              })
            );
          }

          const { Event } = JSON.parse(localStorage.getItem(serverEvent.ID));
          const { Info, Size } = Event;

          const serverPropertiesObj = {};
          serverEvent.Properties.map((key) => {
            return (serverPropertiesObj[key] = key == 'Posn' ? Info : Size);
          });

          console.log(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: serverPropertiesObj,
                WGID: serverEvent.WGID,
              },
            })
          );
          return webSocket.send(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: serverPropertiesObj,
                WGID: serverEvent.WGID,
              },
            })
          );
        }

        if (Type == 'SubForm') {
          if (!localStorage.getItem(serverEvent.ID)) {
            const serverPropertiesObj = {};
            serverEvent.Properties.map((key) => {
              return (serverPropertiesObj[key] = Properties[key]);
            });

            console.log(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: serverPropertiesObj,
                  WGID: serverEvent.WGID,
                },
              })
            );
            return webSocket.send(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: serverPropertiesObj,
                  WGID: serverEvent.WGID,
                },
              })
            );
          }
          const serverPropertiesObj = {};
          const SubForm = JSON.parse(localStorage.getItem(serverEvent.ID));
          serverEvent.Properties.map((key) => {
            return (serverPropertiesObj[key] = SubForm[key]);
          });
          console.log(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: serverPropertiesObj,
                WGID: serverEvent.WGID,
              },
            })
          );
          return webSocket.send(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: serverPropertiesObj,
                WGID: serverEvent.WGID,
              },
            })
          );
        }

        if (Type == 'Button') {
          const { State } = Properties;

          if (!localStorage.getItem(serverEvent.ID)) {
            console.log(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: {
                    State: State ? State : 0,
                  },
                  WGID: serverEvent.WGID,
                },
              })
            );
            return webSocket.send(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: {
                    State: State ? State : 0,
                  },
                  WGID: serverEvent.WGID,
                },
              })
            );
          }

          const { Event } = JSON.parse(localStorage.getItem(serverEvent.ID));
          const { Value } = Event;

          console.log(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: {
                  State: Value,
                },
                WGID: serverEvent.WGID,
              },
            })
          );
          return webSocket.send(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: {
                  State: Value,
                },
                WGID: serverEvent.WGID,
              },
            })
          );
        }
      } else if (keys[0] == 'NQ') {
        const nqEvent = JSON.parse(event.data).NQ;
        const element = document.getElementById(nqEvent.ID);
        element.focus();
      }
    };
  };

  useEffect(() => {
    dataRef.current = {};
    setSocketData([]);
    localStorage.clear();
    fetchData();
  }, [layout]);

  // console.log('AppData', dataRef.current);

  return (
    <AppDataContext.Provider value={{ socketData, dataRef, socket }}>
      <SelectComponent data={dataRef.current['F1']} />
    </AppDataContext.Provider>
  );
};

export default App;
