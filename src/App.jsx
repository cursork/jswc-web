import { useEffect, useRef, useState } from 'react';
import { AppDataContext } from './context';
import { SelectComponent } from './components';
import { getObjectById, checkSupportedProperties, findFormParentID } from './utils';
import './App.css';

const App = () => {
  const [socketData, setSocketData] = useState([]);
  const [socket, setSocket] = useState(null);
  const [layout, setLayout] = useState('Initialise');

  function useForceRerender() {
    const [_state, setState] = useState(true);
    const reRender = () => {
      setState((prev) => !prev);
    };
    return { reRender };
  }

  const { reRender } = useForceRerender();

  const dataRef = useRef({});

  const handleData = (data, mode) => {
    const splitID = data.ID.split('.');
    let currentLevel = dataRef.current;

    for (let i = 0; i < splitID.length - 1; i++) {
      const key = splitID[i];

      if (!currentLevel[key]) {
        currentLevel[key] = {};
      }

      currentLevel = currentLevel[key];
    }

    // Check if the key already exists at the final level
    const finalKey = splitID[splitID.length - 1];
    if (currentLevel.hasOwnProperty(finalKey)) {
      if (mode === 'WC') {
        if (data.Properties && data.Properties.Type === 'Form') {
          localStorage.clear();
        }
        // Overwrite the existing object with new properties
        currentLevel[finalKey] = {
          ID: data.ID,
          ...data,
        };
      } else if (mode === 'WS') {
        // Merge the existing object with new properties
        currentLevel[finalKey] = {
          ID: data.ID,
          ...currentLevel[finalKey],
          Properties: {
            ...(currentLevel[finalKey].Properties || {}),
            ...(data.Properties || {}),
          },
        };
      }
    } else {
      // Create a new object at the final level
      currentLevel[finalKey] = {
        ID: data.ID,
        ...data,
      };
    }

    reRender();
  };

  const deleteObjectsById = (data, idsToDelete) => {
    function deleteById(obj, id) {
      for (const key in obj) {
        if (obj[key].ID === id) {
          delete obj[key];
          return true;
        }
        if (typeof obj[key] === 'object') {
          if (deleteById(obj[key], id)) {
            return true;
          }
        }
      }
      return false;
    }
    idsToDelete.forEach((id) => {
      deleteById(data, id);
    });

    dataRef.current = data;
    socketData.filter((item) => idsToDelete.some((id) => item.ID.startsWith(id)));
    reRender();
  };

  const fetchData = (port) => {
    const runningPort = port == '5173' ? '22322' : port;

    localStorage.setItem('PORT', runningPort);

    const webSocket = new WebSocket(`ws://localhost:${runningPort}/`);
    setSocket(webSocket);
    webSocket.onopen = () => {
      webSocket.send(layout);
      // webSocket.send('Initialise');4
    };
    webSocket.onmessage = (event) => {
      // Window Creation WC
      const keys = Object.keys(JSON.parse(event.data));
      if (keys[0] == 'WC') {
        // console.log('event from server WC', JSON.parse(event.data).WC);
        setSocketData((prevData) => [...prevData, JSON.parse(event.data).WC]);
        handleData(JSON.parse(event.data).WC, 'WC');
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
            return handleData(
              {
                ID: serverEvent.ID,
                Properties: {
                  Text: value,
                },
              },
              'WS'
            );
          } else if (data?.Properties.hasOwnProperty('Value')) {
            setSocketData((prevData) => [...prevData, JSON.parse(event.data).WS]);
            return handleData(
              {
                ID: serverEvent.ID,
                Properties: {
                  Value: value,
                },
              },
              'WS'
            );
          }
        }

        if (data?.Properties?.Type == 'Combo') {
          if (serverEvent?.Properties.hasOwnProperty('SelItems')) {
            setSocketData((prevData) => [...prevData, JSON.parse(event.data).WS]);
            value = serverEvent?.Properties.SelItems;
            const indextoFind = value.indexOf(1);
            let Text = data?.Properties?.Items[indextoFind];
            return handleData(
              {
                ID: serverEvent.ID,
                Properties: {
                  ...data?.Properties,
                  SelItems: value,
                  Text,
                },
              },
              'WS'
            );
          }
        }

        setSocketData((prevData) => [...prevData, JSON.parse(event.data).WS]);
        handleData(JSON.parse(event.data).WS, 'WS');
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
                  ...(result && result.NotSupported && result.NotSupported.length > 0
                    ? { NotSupported: result.NotSupported }
                    : null),
                },
              })
            );
            return webSocket.send(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: { Values: Values },
                  WGID: serverEvent.WGID,
                  ...(result && result.NotSupported && result.NotSupported.length > 0
                    ? { NotSupported: result.NotSupported }
                    : null),
                },
              })
            );
          }

          const { Event } = JSON.parse(localStorage.getItem(serverEvent.ID));
          const { Row, Col, Value } = Event;

          Values[Row - 1][Col - 1] = Value;
          console.log(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: { Values: Values },
                WGID: serverEvent.WGID,
                ...(result && result.NotSupported && result.NotSupported.length > 0
                  ? { NotSupported: result.NotSupported }
                  : null),
              },
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
              WG: {
                ID: serverEvent.ID,
                Properties: { Values: Values },
                WGID: serverEvent.WGID,
                ...(result && result.NotSupported && result.NotSupported.length > 0
                  ? { NotSupported: result.NotSupported }
                  : null),
              },
            })
          );
        }

        if (Type == 'Edit') {
          const { Text, Value } = Properties;
          const supportedProperties = ['Text', 'Value'];

          const result = checkSupportedProperties(supportedProperties, serverEvent?.Properties);

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
                  ...(result && result.NotSupported && result.NotSupported.length > 0
                    ? { NotSupported: result.NotSupported }
                    : null),
                },
              })
            );
            return webSocket.send(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: serverPropertiesObj,
                  WGID: serverEvent.WGID,
                  ...(result && result.NotSupported && result.NotSupported.length > 0
                    ? { NotSupported: result.NotSupported }
                    : null),
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
              WG: {
                ID: serverEvent.ID,
                Properties: serverPropertiesObj,
                WGID: serverEvent.WGID,
                ...(result && result.NotSupported && result.NotSupported.length > 0
                  ? { NotSupported: result.NotSupported }
                  : null),
              },
            })
          );
          webSocket.send(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: serverPropertiesObj,
                WGID: serverEvent.WGID,
                ...(result && result.NotSupported && result.NotSupported.length > 0
                  ? { NotSupported: result.NotSupported }
                  : null),
              },
            })
          );
        }

        if (Type == 'Combo') {
          const { SelItems, Items } = Properties;
          const supportedProperties = ['Text', 'SelItems'];

          const result = checkSupportedProperties(supportedProperties, serverEvent?.Properties);

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
                  ...(result && result.NotSupported && result.NotSupported.length > 0
                    ? { NotSupported: result.NotSupported }
                    : null),
                },
              })
            );
            return webSocket.send(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: serverPropertiesObj,
                  WGID: serverEvent.WGID,
                  ...(result && result.NotSupported && result.NotSupported.length > 0
                    ? { NotSupported: result.NotSupported }
                    : null),
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
                ...(result && result.NotSupported && result.NotSupported.length > 0
                  ? { NotSupported: result.NotSupported }
                  : null),
              },
            })
          );
          return webSocket.send(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: serverPropertiesObj,
                WGID: serverEvent.WGID,
                ...(result && result.NotSupported && result.NotSupported.length > 0
                  ? { NotSupported: result.NotSupported }
                  : null),
              },
            })
          );
        }

        if (Type == 'List') {
          const { SelItems } = Properties;

          const supportedProperties = ['SelItems'];

          const result = checkSupportedProperties(supportedProperties, serverEvent?.Properties);

          if (!localStorage.getItem(serverEvent.ID)) {
            console.log(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: {
                    SelItems,
                  },
                  ...(result && result.NotSupported && result.NotSupported.length > 0
                    ? { NotSupported: result.NotSupported }
                    : null),

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
                  ...(result && result.NotSupported && result.NotSupported.length > 0
                    ? { NotSupported: result.NotSupported }
                    : null),

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
                ...(result && result.NotSupported && result.NotSupported.length > 0
                  ? { NotSupported: result.NotSupported }
                  : null),

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
                ...(result && result.NotSupported && result.NotSupported.length > 0
                  ? { NotSupported: result.NotSupported }
                  : null),

                WGID: serverEvent.WGID,
              },
            })
          );
        }

        if (Type == 'Scroll') {
          const { Thumb } = Properties;
          const supportedProperties = ['Thumb'];

          const result = checkSupportedProperties(supportedProperties, serverEvent?.Properties);

          if (!localStorage.getItem(serverEvent.ID)) {
            console.log(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: {
                    Thumb,
                  },
                  WGID: serverEvent.WGID,
                  ...(result && result.NotSupported && result.NotSupported.length > 0
                    ? { NotSupported: result.NotSupported }
                    : null),
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
                  ...(result && result.NotSupported && result.NotSupported.length > 0
                    ? { NotSupported: result.NotSupported }
                    : null),
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
                ...(result && result.NotSupported && result.NotSupported.length > 0
                  ? { NotSupported: result.NotSupported }
                  : null),
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
                ...(result && result.NotSupported && result.NotSupported.length > 0
                  ? { NotSupported: result.NotSupported }
                  : null),
              },
            })
          );
        }

        if (Type == 'Splitter') {
          const { Posn } = Properties;
          const supportedProperties = ['Posn', 'Size'];

          const result = checkSupportedProperties(supportedProperties, serverEvent?.Properties);

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
                  ...(result && result.NotSupported && result.NotSupported.length > 0
                    ? { NotSupported: result.NotSupported }
                    : null),
                },
              })
            );
            return webSocket.send(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: serverPropertiesObj,
                  WGID: serverEvent.WGID,
                  ...(result && result.NotSupported && result.NotSupported.length > 0
                    ? { NotSupported: result.NotSupported }
                    : null),
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
                ...(result && result.NotSupported && result.NotSupported.length > 0
                  ? { NotSupported: result.NotSupported }
                  : null),
              },
            })
          );
          return webSocket.send(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: serverPropertiesObj,
                WGID: serverEvent.WGID,
                ...(result && result.NotSupported && result.NotSupported.length > 0
                  ? { NotSupported: result.NotSupported }
                  : null),
              },
            })
          );
        }

        if (Type == 'SubForm') {
          const supportedProperties = ['Posn', 'Size'];

          const result = checkSupportedProperties(supportedProperties, serverEvent?.Properties);

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
                  ...(result && result.NotSupported && result.NotSupported.length > 0
                    ? { NotSupported: result.NotSupported }
                    : null),
                },
              })
            );
            return webSocket.send(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: serverPropertiesObj,
                  WGID: serverEvent.WGID,
                  ...(result && result.NotSupported && result.NotSupported.length > 0
                    ? { NotSupported: result.NotSupported }
                    : null),
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
                ...(result && result.NotSupported && result.NotSupported.length > 0
                  ? { NotSupported: result.NotSupported }
                  : null),
              },
            })
          );
          return webSocket.send(
            JSON.stringify({
              WG: {
                ID: serverEvent.ID,
                Properties: serverPropertiesObj,
                WGID: serverEvent.WGID,
                ...(result && result.NotSupported && result.NotSupported.length > 0
                  ? { NotSupported: result.NotSupported }
                  : null),
              },
            })
          );
        }

        if (Type == 'Button') {
          const { State } = Properties;
          const supportedProperties = ['State'];

          const result = checkSupportedProperties(supportedProperties, serverEvent?.Properties);

          if (!localStorage.getItem(serverEvent.ID)) {
            console.log(
              JSON.stringify({
                WG: {
                  ID: serverEvent.ID,
                  Properties: {
                    State: State ? State : 0,
                  },
                  WGID: serverEvent.WGID,
                  ...(result && result.NotSupported && result.NotSupported.length > 0
                    ? { NotSupported: result.NotSupported }
                    : null),
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
                  ...(result && result.NotSupported && result.NotSupported.length > 0
                    ? { NotSupported: result.NotSupported }
                    : null),
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
                ...(result && result.NotSupported && result.NotSupported.length > 0
                  ? { NotSupported: result.NotSupported }
                  : null),
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
                ...(result && result.NotSupported && result.NotSupported.length > 0
                  ? { NotSupported: result.NotSupported }
                  : null),
              },
            })
          );
        }
      } else if (keys[0] == 'NQ') {
        const nqEvent = JSON.parse(event.data).NQ;
        const element = document.getElementById(nqEvent.ID);
        element.focus();
      } else if (keys[0] == 'EX') {
        const serverEvent = JSON.parse(event.data).EX;
        console.log({ socketData });
        deleteObjectsById(dataRef.current, serverEvent?.ID);
      }
    };
  };

  useEffect(() => {
    dataRef.current = {};
    setSocketData([]);
    localStorage.clear();

    const currentPort = window.location.port;
    console.log({ currentPort });

    fetchData(currentPort);
  }, [layout]);

  console.log('App', dataRef.current);

  const formParentID = findFormParentID(dataRef.current);

  return (
    <AppDataContext.Provider value={{ socketData, dataRef, socket, handleData }}>
      {dataRef && formParentID && <SelectComponent data={dataRef.current[formParentID]} />}
    </AppDataContext.Provider>
  );
};

export default App;
