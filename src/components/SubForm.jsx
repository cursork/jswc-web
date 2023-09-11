import { excludeKeys, setStyle } from '../utils';
import SelectComponent from './SelectComponent';

const SubForm = ({ data }) => {
  const updatedData = excludeKeys(data);

  return (
    <div>
      {Object.keys(updatedData).map((key) => (
        <SelectComponent data={updatedData[key]} />
      ))}
    </div>
  );
};

export default SubForm;
