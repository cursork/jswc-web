import { setStyle } from '../../utils';
import TreeNode from './TreeNode';

const TreeView = ({ data }) => {
  const renderTreeNodes = (nodes) => {
    return nodes.map((node) => (
      <TreeNode key={node.id} label={node.label} children={node.children || []} />
    ));
  };

  return <>{renderTreeNodes(data)}</>;
};

const Treeview = ({ data }) => {
  const styles = setStyle(data?.Properties);

  const { Depth, Items } = data?.Properties;
  const treeData = [];

  let parentIndex = -1;
  for (let i = 0; i < Depth.length; i++) {
    const depthValue = Depth[i];
    const label = Items[i];

    if (depthValue === 0) {
      parentIndex++;
      treeData.push({
        id: parentIndex + 1,
        label,
        children: [],
      });
    } else if (depthValue === 1) {
      treeData[parentIndex].children.push({
        id: parentIndex * 10 + treeData[parentIndex].children.length + 1,
        label,
      });
    }
  }

  return (
    <div style={{ ...styles, border: '1px solid black', background: 'white' }}>
      <TreeView data={treeData} />
    </div>
  );
};

export default Treeview;
