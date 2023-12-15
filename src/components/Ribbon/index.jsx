import { Ribbon } from 'react-bootstrap-ribbon';
import { excludeKeys } from '../../utils';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-ribbon/dist/react-bootstrap-ribbon.css';
import './RibbonStyles.css';

import SelectComponent from '../SelectComponent';

const CustomRibbon = ({ data }) => {
  const updatedData = excludeKeys(data);

  const { Visible } = data?.Properties;

  return (
    <div className='row' style={{ height: '8rem',width:'1150px' }}>
      {Object.keys(updatedData).map((key) => {
        return <SelectComponent data={updatedData[key]} />;
      })}
    </div>
  );
};

export default CustomRibbon;
