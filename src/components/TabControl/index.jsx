import { setStyle, excludeKeys } from '../../utils';
import SubForm from '../SubForm';
import TabButton from '../TabButton';
import { useState } from 'react';

const TabControl = ({ data }) => {
  const [activeTab, setActiveTab] = useState('F1.TC.T4');

  const updatedData = excludeKeys(data);

  let styles = setStyle(data?.Properties);

  const updatedStyles = {
    ...styles,
  };

  const handleTabClick = (ID) => {
    setActiveTab(ID);
  };

  return (
    <div style={updatedStyles}>
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
