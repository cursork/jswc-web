import { Ribbon } from 'react-bootstrap-ribbon';
import { excludeKeys } from '../../utils';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-ribbon/dist/react-bootstrap-ribbon.css';
import './RibbonStyles.css';

import SelectComponent from '../SelectComponent';

const CustomRibbon = ({ data }) => {
  const updatedData = excludeKeys(data);

  const { Visible, Size } = data?.Properties;
  const parentSize = JSON.parse(localStorage.getItem('formDimension'));

  return (
    <div
      id={data?.ID}
      className='row'
      style={{
        height: !Size ? '8rem' : Size[0],
        width: !Size ? parentSize && parentSize[1] : Size && Size[1],
        display: Visible == 0 ? 'none' : 'flex',
      }}
    >
      {Object.keys(updatedData).map((key) => {
        return <SelectComponent data={updatedData[key]} />;
      })}
    </div>
  );
};

export default CustomRibbon;
