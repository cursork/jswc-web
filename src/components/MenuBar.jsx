import { excludeKeys } from '../utils';
import SelectComponent from './SelectComponent';

const MenuBar = ({ data }) => {
  const updatedData = excludeKeys(data);
  const { Visible } = data?.Properties;

  return (
    <div style={{ display: 'flex', display: Visible == 0 ? 'none' : 'block' }}>
      {Object.keys(updatedData).map((key) => {
        return <SelectComponent data={updatedData[key]} />;
      })}
    </div>
  );
};

export default MenuBar;
