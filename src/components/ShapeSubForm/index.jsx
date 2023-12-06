import { useEffect } from 'react';
import { excludeKeys } from '../../utils';
import Rectangle from '../Rectangle';

const ShapeSubForm = ({ data }) => {
  const { Posn, Size, Visible } = data?.Properties;

  const updatedData = excludeKeys(data);
  return (
    <div style={{ background: 'white', display: Visible == 0 ? 'none' : 'block' }}>
      {Object.keys(updatedData).map((key) => {
        if (updatedData[key].Properties.Type == 'Rect') {
          return <Rectangle parentSize={Size} posn={Posn} data={updatedData[key]} />;
        }
      })}
    </div>
  );
};

export default ShapeSubForm;
