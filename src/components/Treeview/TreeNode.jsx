// TreeNode.js
import React, { useState } from 'react';

const TreeNode = ({ label, children, isChild = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingTop: '1px',
      }}
    >
      <div style={{ fontSize: '12px', display: 'flex' }}>
        <div
          onClick={(event) => {
            event.preventDefault();
            handleToggle();
          }}
          style={{
            cursor: 'pointer',
            background: '#F0F0F0',
            width: '15px',
            textAlign: 'center',
            color: 'blue',
          }}
        >
          {isExpanded || isChild ? '-' : '+'}
        </div>
        {label}
      </div>
      {isExpanded && children && children.length > 0 && (
        <div style={{ marginLeft: '20px' }}>
          {children.map((child) => (
            <TreeNode key={child.id} label={`${child.label}`} children={[]} isChild={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
