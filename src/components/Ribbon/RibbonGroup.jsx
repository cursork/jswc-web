import { excludeKeys } from '../../utils';
import { RibbonGroup } from 'react-bootstrap-ribbon';
import SelectComponent from '../SelectComponent';

const CustomRibbonGroup = ({ data }) => {
  const updatedData = excludeKeys(data);
  const { Size, Title } = data?.Properties;

  const size = Size || 1;

  return (
    <RibbonGroup title={Title} colClass={`col-${size}`}>
      {Object.keys(updatedData).map((key) => {
        return <SelectComponent data={updatedData[key]} />;
      })}
    </RibbonGroup>
  );
};

export default CustomRibbonGroup;
