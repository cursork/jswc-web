import { setStyle } from '../utils';
import { useState } from 'react';

const List = ({ data }) => {
  const styles = setStyle(data?.Properties);
  const { Items, SelItems } = data?.Properties;
  const [selectedItem, _] = useState(1);
  const [items, setItems] = useState(SelItems);

  const selectedStyles = {
    background: '#1264FF',
    color: 'white',
    cursor: 'pointer',
  };

  const handleClick = (index) => {
    const length = SelItems.length;
    let updatedArray = Array(length).fill(0);

    updatedArray[index] = 1;

    localStorage.setItem(
      data?.ID,
      JSON.stringify({
        Event: {
          ID: data?.ID,
          SelItems: updatedArray,
        },
      })
    );

    setItems(updatedArray);
  };

  return (
    <div style={{ ...styles, border: '1px solid black' }}>
      {Items &&
        Items.map((item, index) =>
          selectedItem == items[index] ? (
            <div style={{ ...selectedStyles, fontSize: '12px' }}>{item}</div>
          ) : (
            <div onClick={() => handleClick(index)} style={{ cursor: 'pointer', fontSize: '12px' }}>
              {item}
            </div>
          )
        )}
    </div>
  );
};

export default List;
