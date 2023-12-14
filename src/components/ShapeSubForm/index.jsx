import { excludeKeys, setStyle } from '../../utils';
import Rectangle from '../Rectangle';
import Button from '../Button';
import Treeview from '../Treeview';

const ShapeSubForm = ({ data, name }) => {
  const { Posn, Size, Visible } = data?.Properties;
  const styles = setStyle(data?.Properties);
  const updatedData = excludeKeys(data);

  return (
    <div style={{ display: Visible == 0 ? 'none' : 'block', ...styles }}>
      {Object.keys(updatedData).map((key) => {
        if (updatedData[key].Properties.Type == 'Rect') {
          return <Rectangle parentSize={Size} posn={Posn} data={updatedData[key]} />;
        } else if (updatedData[key].Properties.Type == 'Button') {
          return <Button data={updatedData[key]} />;
        } else if (updatedData[key].Properties.Type == 'TreeView') {
          return <Treeview data={updatedData[key]} />;
        }
      })}
    </div>
  );
};

export default ShapeSubForm;
