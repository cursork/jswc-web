import { excludeKeys } from '../../utils';
import { RibbonGroup } from 'react-bootstrap-ribbon';
import SelectComponent from '../SelectComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-ribbon/dist/react-bootstrap-ribbon.css';

const CustomRibbonGroup = ({ data }) => {
  const updatedData = excludeKeys(data);
  const { Size, Title } = data?.Properties;

  const size = Size || 1;

  return (
    <div className={`col-${size}`}>
      <div
        style={{ border: '1px solid rgb(204, 204, 204)', position: 'relative', height: '100%' }}
        className='row'
      >
        {Object.keys(updatedData).map((key) => {
          return <SelectComponent data={updatedData[key]} />;
        })}

        <div
          style={{
            backgroundColor: 'rgb(204, 204, 204)',
            position: 'absolute',
            bottom: 0,
            width: '100%',
          }}
        >
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bolder' }} className='text-center'>
            {Title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomRibbonGroup;
