import { excludeKeys } from '../../utils';
import Rectangle from '../Rectangle';
import SelectComponent from '../SelectComponent';

const ShapeSubForm = ({ data }) => {
  const { Posn, Size } = data?.Properties;

  const updatedData = excludeKeys(data);
  return (
    <div style={{ background: 'white' }}>
      {Object.keys(updatedData).map((key) => {
        if (updatedData[key].Properties.Type == 'Rect') {
          return <Rectangle parentSize={Size} posn={Posn} data={updatedData[key]} />;
        }
      })}
    </div>
  );
};

export default ShapeSubForm;
