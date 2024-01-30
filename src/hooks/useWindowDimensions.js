import { useState, useEffect } from 'react';
import useAppData from './useAppData';

const useWindowDimensions = () => {
  const { socket } = useAppData();
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let event = JSON.stringify({
      DeviceCapabilities: {
        ViewPort: [window.innerHeight, window.innerWidth],
        ScreenSize: [window.innerHeight, window.innerWidth],
        DPR: 1,
        PPI: 200,
      },
    });

    socket.send(event);

    const handleResize = () => {
      const newViewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      if (newViewport.width !== viewport.width || newViewport.height !== viewport.height) {
        setViewport(newViewport);
        let event = JSON.stringify({
          DeviceCapabilities: {
            ViewPort: [newViewport.height, newViewport.width],
            ScreenSize: [newViewport.height, newViewport.width],
            DPR: 1,
            PPI: 200,
          },
        });

        socket.send(event);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [viewport]);

  return viewport;
};

export default useWindowDimensions;
