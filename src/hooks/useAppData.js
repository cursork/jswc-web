import { AppDataContext } from '../context';
import { useContext } from 'react';

const useAppData = () => {
  const { socketData, dataRef, socket, handleData, focusedElement, reRender, setChangeEvents, proceed, setProceed, proceedEventArray, setProceedEventArray, selectedKey, setSelectedKey, selectedCell, setSelectedCell, thumb, setThumb } = 
  useContext(AppDataContext);

  const findDesiredData = (ID) => {
    const findData = socketData?.find((obj) => obj.ID == ID);
    return findData;
  };

  const getObjType = (ID) => {
    const findData = socketData?.find((obj) => obj.ID == ID);
    return findData?.Properties?.Type;
  };

  return {
    socketData,
    findDesiredData,
    getObjType,
    dataRef,
    socket,
    handleData,
    focusedElement,
    reRender,
    proceed,
    setProceed,
    proceedEventArray,
    setProceedEventArray,
    selectedCell,
    setSelectedCell,
    selectedKey, 
    setSelectedKey,
    thumb
  };
};
export default useAppData;
