import { excludeKeys, setStyle } from '../../utils';
import Rectangle from '../Rectangle';
import Button from '../Button';
import Treeview from '../Treeview';
import Edit from '../Edit';
import TextArea from '../TextArea';
import Text from '../Text';

const ShapeSubForm = ({ data }) => {
  const { Posn, Size, Visible } = data?.Properties;
  const styles = setStyle(data?.Properties);
  const updatedData = excludeKeys(data);

  return (
    <div
      style={{
        display: Visible == 0 ? 'none' : 'block',
        ...styles,
        background: '#F0F0F0',
        border: '1px solid black',
        zIndex: 1,
      }}
    >
      {Object.keys(updatedData).map((key) => {
        if (updatedData[key].Properties.Type == 'Rect') {
          return <Rectangle parentSize={Size} posn={Posn} data={updatedData[key]} />;
        } else if (updatedData[key].Properties.Type == 'Button') {
          return <Button data={updatedData[key]} />;
        } else if (updatedData[key].Properties.Type == 'TreeView') {
          return <Treeview data={updatedData[key]} />;
        } else if (updatedData[key].Properties.Type == 'Edit') {
          return <Edit data={updatedData[key]} />;
        } else if (
          updatedData[key].Properties.Type == 'Edit' &&
          updatedData[key].Properties.Style == 'Multi'
        ) {
          return <TextArea data={updatedData[key]} />;
        } else if (updatedData[key].Properties.Type == 'Text') {
          return <Text data={updatedData[key]} />;
        }
      })}
    </div>
  );
};

export default ShapeSubForm;
