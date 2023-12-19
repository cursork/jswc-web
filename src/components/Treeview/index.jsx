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
  const PORT = localStorage.getItem('PORT');
  const { Depth, Items, ImageListObj, ImageIndex, Visible, Event } = data?.Properties;

  const [nodeData, setNodeData] = useState([]);

  const { dataRef, socket } = useAppData();

  const styles = setStyle(data?.Properties);
  const treeData = [];
  let parentIndex = -1;

  let childIndex = 0;

  console.log({ ImageListObj });

  const ID = getStringafterPeriod(ImageListObj);

  const ImageList = JSON.parse(getObjectById(dataRef.current, ID));

  console.log({ ImageList });

  const eventEmit = (treeState) => {
    if (treeState.length > nodeData.length) {
      const missingPart = treeState.filter((item) => !nodeData.includes(item));
      const Info = findParentIndex(Depth, 1 + calculateSumFromString(missingPart));

      // Only Emit the Event when the event is Present

      const expandEvent = JSON.stringify({
        Event: {
          EventName: 'Expanding',
          ID: data?.ID,
          Info: Info + 1,
        },
      });

      const exists = Event && Event.some((item) => item[0] === 'Expanding');
      if (!exists) return;

      console.log(expandEvent);
      socket.send(expandEvent);
    } else if (treeState.length < nodeData.length) {
      const missingPart = nodeData.filter((item) => !treeState.includes(item));

      const Info = findParentIndex(Depth, 1 + calculateSumFromString(missingPart));

      // Check that if it has Event or not

      const retractEvent = JSON.stringify({
        Event: {
          EventName: 'Retracting',
          ID: data?.ID,
          Info: Info + 1,
        },
      });

      const exists = Event && Event.some((item) => item[0] === 'Retracting');
      if (!exists) return;

      console.log(retractEvent);
      socket.send(retractEvent);
    } else {
      console.log('Equal');
    }
    setNodeData(treeState);
  };

  const createNode = (title, index) => {
    if (!index) return <span onKeyDown={(e) => console.log({ e })}>{title}</span>;

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={`http://localhost:${PORT}/${ImageList?.Properties?.Files[index - 1]}`} />
        <div>{title}</div>
      </div>
    );
  };

  for (let i = 0; i < Depth.length; i++) {
    const depthValue = Depth[i];

    const title = createNode(Items[i], ImageIndex && ImageIndex[i]);

    if (depthValue === 0) {
      parentIndex++;
      childIndex++;
      treeData.push({
        id: childIndex,
        title: title,
        children: [],
      });
    } else if (depthValue === 1) {
      childIndex++;
      treeData[parentIndex].children.push({
        id: childIndex,
        title,
        isLeaf: true,
      });
    }
  }

  const handleItemDownEvent = (index, shiftState) => {
    // Info
    //[0] index of the node
    //[1] Mouse Buttons left 1 right 2 center 4
    //[2] shift state
    //[3] Position: 2 over icon, 4 over label, 8 over line, 16 over symbol, 32 to right of label

    const event = JSON.stringify({
      Event: {
        EventName: 'ItemDown',
        ID: data?.ID,
        Info: [index, 1, shiftState, 4],
      },
    });

    localStorage.setItem(data?.ID, event);
    const exists = Event && Event.some((item) => item[0] === 'ItemDown');
    if (!exists) return;
    console.log(event);
    socket.send(event);
  };

  const handleSelect = (_, info) => {
    const { selectedNodes, nativeEvent } = info;

    const isAltPressed = nativeEvent.altKey ? 4 : 0;
    const isCtrlPressed = nativeEvent.ctrlKey ? 2 : 0;
    const isShiftPressed = nativeEvent.shiftKey ? 1 : 0;
    const mouseButton = nativeEvent.button;
    let shiftState = isAltPressed + isCtrlPressed + isShiftPressed;
    if (selectedNodes.length == 0) return;

    handleItemDownEvent(selectedNodes[0]?.id, shiftState);
  };

  return (
    <div
      style={{
        ...styles,
        border: '1px solid black',
        background: 'white',
        paddingLeft: '2px',
        paddingTop: '3px',
        display: Visible == 0 ? 'none' : 'block',
      }}
    >
      <Tree
        onSelect={handleSelect}
        onKeyDown={(e) => console.log('keydown', { e })}
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
