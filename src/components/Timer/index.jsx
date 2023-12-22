import { useEffect } from 'react';
import { useAppData } from '../../hooks';

const Timer = ({ data }) => {
  const { socket } = useAppData();

  const { Interval, FireOnce, Active, Event } = data?.Properties;

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timerEvent = JSON.stringify({
        Event: { EventName: 'Timer', ID: data?.ID, Info: [] },
      });
      socket.send(timerEvent);
    }, Interval && Interval[0]);
    return () => clearInterval(intervalId);
  }, []);

  return <></>;
};

export default Timer;
