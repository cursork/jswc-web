import { useState } from 'react';
import './ScrollBar.css';
import { useAppData } from '../../hooks';

const ScrollBar = ({ data }) => {
  const { Align, Range, Thumb, Type } = data?.Properties;
  const isHorizontal = Type === 'Scroll' && Align === 'Bottom';
  const [thumbPosition, setThumbPosition] = useState(Thumb);

  const { socket } = useAppData();

  const trackStyle = {
    width: isHorizontal ? `800px` : '10px', // Set the track width based on orientation
    height: isHorizontal ? '10px' : `500px`, // Set the track height based on orientation
    backgroundColor: '#ccc',
    position: 'relative',
    border: '1px solid white',
  };

  const thumbStyle = {
    width: '50px', // Set the thumb width
    height: '50px', // Set the thumb height
    backgroundColor: 'grey',
    position: 'absolute',
    left: isHorizontal ? `${thumbPosition}px` : 0,
    top: isHorizontal ? 0 : `${thumbPosition}px`,
    cursor: 'pointer',
  };

  const verticalPosition = {
    position: 'absolute',
    top: 0,
    right: 0,
  };

  const HorizontalPosition = {
    position: 'absolute',
    left: 0,
    bottom: 0,
  };

  const handleThumbDrag = (event) => {
    event.preventDefault();
    let startPosition = isHorizontal ? event.clientX : event.clientY;
    const maxRange = isHorizontal ? Range : Range;
    const handleMouseMove = (moveEvent) => {
      const currentPosition = isHorizontal ? moveEvent.clientX : moveEvent.clientY;
      const newPosition = thumbPosition + (currentPosition - startPosition);
      const newThumbPosition = Math.max(0, Math.min(maxRange, newPosition));

      if (!isHorizontal && newThumbPosition < 450) setThumbPosition(newThumbPosition);
      if (isHorizontal && newThumbPosition < 750) setThumbPosition(newThumbPosition);

      console.log(
        JSON.stringify({
          Event: {
            EventName: data?.Properties?.Event[0],
            ID: data?.ID,
            Info: [thumbPosition, newThumbPosition],
          },
        })
      );

      socket.send(
        JSON.stringify({
          Event: {
            EventName: data?.Properties?.Event[0],
            ID: data?.ID,
            Info: [thumbPosition, newThumbPosition],
          },
        })
      );

      // startPosition = currentPosition;
    };
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Scroll Bar

  
  return (
    <div style={isHorizontal ? HorizontalPosition : verticalPosition}>
      <div
        className={`scroll-bar ${isHorizontal ? 'horizontal' : 'vertical'}`}
        style={{ ...trackStyle }}
        onMouseDown={(e) => handleThumbDrag(e)}
      >
        {/* thumb */}
        <div className='thumb' style={{ ...thumbStyle }}></div>
      </div>
    </div>
  );
};

export default ScrollBar;
