import { excludeKeys, isEmpty } from '../../utils';
import Dropdown from '../DropDown';
import './Menu.css';

const Menu = ({ data }) => {
  const updatedData = excludeKeys(data);

  const empty = isEmpty(updatedData);

  // Render the Caption if the Object didn't have any Keys

  if (empty) {
    return (
      <div
        style={{ fontSize: '12px', marginLeft: '10px', cursor: 'pointer' }}
        className='menu-item'
      >
        {data?.Properties?.Caption?.substring(1)}
      </div>
    );
  }

  // Render the DropDown if the Object have Menu Items
  return <Dropdown data={updatedData} title={data?.Properties?.Caption?.substring(1)} />;
};

export default Menu;
