import { useEffect, useState } from 'react';
import { useAppData } from '../../hooks';

const Timer = ({ data }) => {
  const { socket } = useAppData();

  const { Interval, FireOnce, Active, Event } = data?.Properties;

  console.log({ Active });

  const [fire, setFire] = useState(!FireOnce ? 0 : FireOnce);
  useEffect(() => {
    if (Active === 1 && fire !== 2) {
      // Fire the timer event
      const timerEvent = JSON.stringify({
        Event: { EventName: 'Timer', ID: data?.ID, Info: [] },
      });
      socket.send(timerEvent);
      // If FireOnce is set to 1, update it to 2 to prevent further firing
      if (FireOnce === 1) {
        setFire(2);
        // You might need to update the FireOnce value in your state or data source
        // to ensure the change is reflected in subsequent renders.
      }
    }

    // Clear the interval if Active becomes 0 or if FireOnce is 2
    const intervalId =
      Active === 1 && fire !== 2
        ? setInterval(() => {
            const timerEvent = JSON.stringify({
              Event: { EventName: 'Timer', ID: data?.ID, Info: [] },
            });
            socket.send(timerEvent);
          }, Interval && Interval[0])
        : null;

    return () => {
      // Clear the interval when the component unmounts or when conditions are no longer met
      clearInterval(intervalId);
    };
  }, [Active, FireOnce, Interval]);

  return <></>;
};

export default Timer;

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const timerEvent = JSON.stringify({
//         Event: { EventName: 'Timer', ID: data?.ID, Info: [] },
//       });
//       socket.send(timerEvent);
//     }, Interval && Interval[0]);
//     return () => clearInterval(intervalId);
//   }, []);
