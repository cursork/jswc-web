import { useState } from 'react';
import './Dropdown.css';
import { useAppData } from '../../hooks';

const Dropdown = ({ title, data }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { socket } = useAppData();

  const handleDropdownToggle = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };



  return (
    <div
      className='menu-item'
      onMouseEnter={handleDropdownToggle}
      onMouseLeave={handleDropdownToggle}
    >
      {title}
      {isDropdownVisible && (
        <div className='dropdown'>
          {Object.keys(data).map((key) => {
            return (
              <div
                id={data[key]?.ID}
                className='dropdown-item'
                onClick={() => {
                  console.log(
                    JSON.stringify({
                      Event: {
                        EventName: data[key]?.Properties?.Event[0],
                        ID: data[key]?.ID,
                      },
                    })
                  );

                  socket.send(
                    JSON.stringify({
                      Event: {
                        EventName: data[key]?.Properties?.Event[0],
                        ID: data[key]?.ID,
                      },
                    })
                  );
                }}
              >
                {data[key]?.Properties?.Caption?.substring(1)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
