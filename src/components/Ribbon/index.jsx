import { Ribbon } from 'react-bootstrap-ribbon';
import { excludeKeys } from '../../utils';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-ribbon/dist/react-bootstrap-ribbon.css';
import './RibbonStyles.css';

import SelectComponent from '../SelectComponent';

const CustomRibbon = ({ data }) => {
  const updatedData = excludeKeys(data);

  return (
    <Ribbon>
      {Object.keys(updatedData).map((key) => {
        return <SelectComponent data={updatedData[key]} />;
      })}
    </Ribbon>
  );
};

export default CustomRibbon;
