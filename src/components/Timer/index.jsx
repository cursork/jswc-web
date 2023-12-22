import { useEffect, useState } from 'react';
import { useAppData } from '../../hooks';

const Timer = ({ data }) => {
  const { socket } = useAppData();

  const { Interval, FireOnce, Active, Event } = data?.Properties;

  const [fireOnce, setFireOnce] = useState(data?.Properties.FireOnce);

  useEffect(() => {
    let intervalId;
    const timerEvent = JSON.stringify({
      Event: { EventName: 'Timer', ID: data?.ID, Info: [] },
    });

    // check Active is 1
    if (Active == 1) {
      if (fireOnce == 1) {
        intervalId = setInterval(() => {
          socket.send(timerEvent);
          setFireOnce(2);
        }, Interval && Interval);
        return () => {
          clearInterval(intervalId);
        };
      } else if (fireOnce == 2) {
        clearInterval(intervalId);
      } else if (fireOnce == 0) {
        intervalId = setInterval(() => {
          socket.send(timerEvent);
        }, Interval && Interval);
      }
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [data]);

  return <></>;
};

export default Timer;
