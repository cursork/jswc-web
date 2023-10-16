import { excludeKeys } from '../utils';
import SelectComponent from './SelectComponent';
import TextArea from './TextArea';

const SubForm = ({ data }) => {
  const updatedData = excludeKeys(data);

  return (
    <div style={{ position: 'relative', border: '1px solid #FAFAFA' }}>
      {Object.keys(updatedData).map((key) => {
        return <TextArea data={updatedData[key]} />;
      })}
    </div>
  );
};

export default SubForm;
