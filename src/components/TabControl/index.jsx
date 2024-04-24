import { setStyle, excludeKeys } from '../../utils';
import SubForm from '../DynamicSubForm';
import TabButton from '../TabButton';
import { useEffect, useState } from 'react';

const TabControl = ({ data }) => {
  const [activeTab, setActiveTab] = useState('');

  const { Visible } = data?.Properties;

  const updatedData = excludeKeys(data);

  let styles = setStyle(data?.Properties);

  const updatedStyles = {
    ...styles,
    display: Visible == 0 ? 'none' : 'block',
  };

  const handleTabClick = (ID) => {
    setActiveTab(ID);
  };

  const getLastId = (data) => {
    const updatedData = excludeKeys(data);
  
    let array = Object.keys(updatedData)
      .map((key) => {
        if (updatedData[key]?.Properties.Type == 'TabButton') {
          return updatedData[key].ID;
        } else {
          return undefined;
        }
      })
      .filter((id) => id !== undefined);
    console.log({ array });
    // setActiveTab(array.pop());
  };

  useEffect(() => {
    getLastId(data);
  }, [data]);

  console.log({ activeTab });
  return (
    <div id={data?.ID} style={updatedStyles}>
      {/* Render the Buttons */}
      <div style={{ display: 'flex', alignItems: 'end', marginLeft: '3px' }}>
        {Object.keys(updatedData).map((key) => {
          return updatedData[key]?.Properties.Type == 'TabButton' ? (
            <TabButton
              activeTab={activeTab}
              data={updatedData[key]}
              handleTabClick={handleTabClick}
            />
          ) : null;
        })}
      </div>

      {/* Render the SubForm */}

      {Object.keys(updatedData).map((key) => {
        return updatedData[key]?.Properties?.Type == 'SubForm' &&
          activeTab == updatedData[key]?.Properties?.TabObj ? (
          <SubForm data={updatedData[key]} />
        ) : null;
      })}
    </div>
  );
};

export default TabControl;
