import { RibbonGroupItem } from 'react-bootstrap-ribbon';
import { excludeKeys } from '../../utils';
import SelectComponent from '../SelectComponent';

const CustomRibbonItem = ({ data }) => {
  const updatedData = excludeKeys(data);

  const { Size } = data?.Properties;
  const size = Size || 12;

  return (
    <RibbonGroupItem colClass={`col-${size}`}>
      {Object.keys(updatedData).map((key) => {
        return <SelectComponent data={updatedData[key]} />;
      })}
    </RibbonGroupItem>
  );
};

export default CustomRibbonItem;
