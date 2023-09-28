import { setStyle } from '../utils';
import { useState } from 'react';

const List = ({ data }) => {
  const styles = setStyle(data?.Properties);
  const [selectedItem, setSelectedItem] = useState(null);

  const selectedStyles = {
    background: 'blue',
    color: 'white',
    cursor: 'pointer',
  };

  const { Items } = data?.Properties;

  return (
    <div style={{ ...styles, border: '1px solid black' }}>
      {Items &&
        Items.map((item) =>
          selectedItem == item ? (
            <div style={{ ...selectedStyles, fontSize: '12px' }}>{item}</div>
          ) : (
            <div
              style={{ cursor: 'pointer', fontSize: '12px' }}
              onClick={() => setSelectedItem(item)}
            >
              {item}
            </div>
          )
        )}
    </div>
  );
};

export default List;
