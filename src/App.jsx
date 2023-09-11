import { useEffect, useRef, useState } from 'react'
import './App.css'
import { SelectComponent } from './components'
import { AppDataContext } from './context'
import { checkPeriod } from './utils'

const App = () => {
  const [socketData, setSocketData] = useState([])
  const [socket, setSocket] = useState(null)
  const dataRef = useRef({})

  const handleDate = (data) => {
    const periodCount = checkPeriod(data.ID)

    const splitID = data.ID.split('.')

    if (periodCount == 0) {
      if (!dataRef.current[splitID[0]]) {
        dataRef.current[splitID[0]] = { ...data }
      }
    } else if (periodCount == 1) {
      // If we found same Id key so we came in this check
      if (dataRef.current[splitID[0]].hasOwnProperty(splitID[1])) {
        return (dataRef.current[splitID[0]][splitID[1]] = {
          ...dataRef.current[splitID[0]][splitID[1]],
          Properties: {
            ...dataRef.current[splitID[0]][splitID[1]].Properties,
            ...data.Properties,
          },
        })
      }
      dataRef.current[splitID[0]][splitID[1]] = data
    } else if (periodCount == 2) {
      dataRef.current[splitID[0]][splitID[1]][splitID[2]] = data
    } else if (periodCount == 3) {
      // adding a check if the key already exists or not
      if (
        dataRef.current[splitID[0]][splitID[1]][splitID[2]].hasOwnProperty(
          splitID[3]
        )
      ) {
        return (dataRef.current[splitID[0]][splitID[1]][splitID[2]][
          splitID[3]
        ] = {
          ...dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]],
          Properties: {
            ...dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]]
              .Properties,
            ...data.Properties,
          },
        })
      }
      dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]] = data
    } else if (periodCount == 4) {
      if (
        dataRef.current[splitID[0]][splitID[1]][splitID[2]][
          splitID[3]
        ].hasOwnProperty(splitID[4])
      ) {
        return (dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]][
          splitID[4]
        ] = {
          ...dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]][
            splitID[4]
          ],
          Properties: {
            ...dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]][
              splitID[4]
            ].Properties,
            ...data.Properties,
          },
        })
      }

      dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]][
        splitID[4]
      ] = data
    } else if (periodCount == 5) {
      dataRef.current[splitID[0]][splitID[1]][splitID[2]][splitID[3]][
        splitID[4]
      ][splitID[5]] = data
    }
  }

  const fetchData = () => {
    const webSocket = new WebSocket('ws://localhost:22322/')
    setSocket(webSocket)
    webSocket.onopen = () => {
      // webSocket.send('Initialise(DemoSplitters)');
      webSocket.send('Initialise')
    }
    webSocket.onmessage = (event) => {
      // Window Creation WC

      if (event.data.includes('WC')) {
        setSocketData((prevData) => [...prevData, JSON.parse(event.data).WC])
        handleDate(JSON.parse(event.data).WC)
      } else if (event.data.includes('WS')) {
        setSocketData((prevData) => [...prevData, JSON.parse(event.data).WS])
        handleDate(JSON.parse(event.data).WS)
      } else if (event.data.includes('WG')) {
        setSocketData((prevData) => [...prevData, JSON.parse(event.data).WG])
        handleDate(JSON.parse(event.data).WS)
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <AppDataContext.Provider value={{ socketData, dataRef, socket }}>
      <SelectComponent data={dataRef.current['F1']} />
    </AppDataContext.Provider>
  )
}

export default App
