import { setStyle } from '../../utils';

import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';

const Treeview = ({ data }) => {
  const { Depth, Items } = data?.Properties;
  const styles = setStyle(data?.Properties);
  const treeData = [];
  let parentIndex = -1;
  for (let i = 0; i < Depth.length; i++) {
    const depthValue = Depth[i];
    const title = Items[i];

    if (depthValue === 0) {
      parentIndex++;
      treeData.push({
        id: parentIndex + 1,
        title,
        children: [],
      });
    } else if (depthValue === 1) {
      treeData[parentIndex].children.push({
        id: parentIndex * 10 + treeData[parentIndex].children.length + 1,
        title,
      });
    }
  }

  return (
    <div
      style={{
        ...styles,
        border: '1px solid black',
        background: 'white',
        paddingLeft: '2px',
        paddingTop: '2px',
      }}
    >
      <Tree
        treeData={treeData}
        showIcon={false}
        showLine={true}
        style={{ fontSize: '12px', lineHeight: '15px', margin: 0, padding: 0 }}
        height={styles.height}
      />
    </div>
  );
};

export default Treeview;
