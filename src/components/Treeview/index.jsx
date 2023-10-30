import {
  setStyle,
  getStringafterPeriod,
  getObjectById,
  calculateSumFromString,
  findParentIndex,
} from '../../utils';
import { useAppData } from '../../hooks';
import { useState } from 'react';

import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';
import './TreeView.css';

const Treeview = ({ data }) => {
  const { Depth, Items, ImageListObj, ImageIndex } = data?.Properties;

  const [nodeData, setNodeData] = useState([]);

  const { dataRef, socket } = useAppData();

  const styles = setStyle(data?.Properties);
  const treeData = [];
  let parentIndex = -1;

  const ID = getStringafterPeriod(ImageListObj);

  const ImageList = JSON.parse(getObjectById(dataRef.current, ID));

  const eventEmit = (treeState) => {
    if (treeState.length > nodeData.length) {
      const missingPart = treeState.filter((item) => !nodeData.includes(item));
      const Info = findParentIndex(Depth, 1 + calculateSumFromString(missingPart));

      // Print the Event
      console.log(
        JSON.stringify({
          Event: {
            EventName: ['Expanding'],
            ID: data?.ID,
            Info: Info + 1,
          },
        })
      );

      //sending the Event

      socket.send(
        JSON.stringify({
          Event: {
            EventName: ['Expanding'],
            ID: data?.ID,
            Info: Info + 1,
          },
        })
      );
    } else if (treeState.length < nodeData.length) {
      const missingPart = nodeData.filter((item) => !treeState.includes(item));

      const Info = findParentIndex(Depth, 1 + calculateSumFromString(missingPart));

      // Print the event
      console.log(
        JSON.stringify({
          Event: {
            EventName: ['Retracting'],
            ID: data?.ID,
            Info: Info + 1,
          },
        })
      );

      // sending the event

      socket.send(
        JSON.stringify({
          Event: {
            EventName: ['Retracting'],
            ID: data?.ID,
            Info: Info + 1,
          },
        })
      );
    } else {
      console.log('Equal');
    }
    setNodeData(treeState);
  };

  const createNode = (title, index) => {
    if (!index) return <span>{title}</span>;

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={`http://localhost:22322/${ImageList?.Properties?.Files[index - 1]}`} />
        <div>{title}</div>
      </div>
    );
  };

  for (let i = 0; i < Depth.length; i++) {
    const depthValue = Depth[i];

    const title = createNode(Items[i], ImageIndex && ImageIndex[i]);

    if (depthValue === 0) {
      parentIndex++;
      treeData.push({
        id: parentIndex + 1,
        title: title,
        children: [],
      });
    } else if (depthValue === 1) {
      treeData[parentIndex].children.push({
        id: parentIndex * 10 + treeData[parentIndex].children.length + 1,
        title,
        isLeaf: true,
      });
    }
  }

  // console.log({ treeData });

  return (
    <div
      style={{
        ...styles,
        border: '1px solid black',
        background: 'white',
        paddingLeft: '2px',
        paddingTop: '3px',
      }}
    >
      <Tree
        onExpand={(d) => eventEmit(d)}
        expandAction='click'
        treeData={treeData}
        showIcon={false}
        showLine={true}
        style={{ fontSize: '12px', lineHeight: '15px', margin: 0, padding: 0 }}
      />
    </div>
  );
};

export default Treeview;
