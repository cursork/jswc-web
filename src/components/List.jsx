import { setStyle } from '../utils';
import { useState } from 'react';

const List = ({ data }) => {
  const styles = setStyle(data?.Properties);
  const [selectedItem, _] = useState(1);

  const selectedStyles = {
    background: '#1264FF',
    color: 'white',
    cursor: 'pointer',
  };

  const { Items, SelItems } = data?.Properties;

  return (
    <div style={{ ...styles, border: '1px solid black' }}>
      {Items &&
        Items.map((item, index) =>
          selectedItem == SelItems[index] ? (
            <div style={{ ...selectedStyles, fontSize: '12px' }}>{item}</div>
          ) : (
            <div style={{ cursor: 'pointer', fontSize: '12px' }}>{item}</div>
          )
        )}
    </div>
  );
};

export default List;
