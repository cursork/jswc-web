import { useState } from 'react';
import './Dropdown.css';
import { useAppData } from '../../hooks';

const Dropdown = ({ title, data }) => {
  const { socket } = useAppData();
  return (
    <div style={{ fontSize: '12px', marginLeft: '10px', cursor: 'pointer' }} className='menu-item'>
      {title}

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
    </div>
  );
};

export default Dropdown;
