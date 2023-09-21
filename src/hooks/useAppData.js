import { AppDataContext } from '../context';
import { useContext } from 'react';

export const useAppData = () => {
  const { socketData, dataRef, socket, setLastEvent } = useContext(AppDataContext);

  const findDesiredData = (ID) => {
    const findData = socketData?.find((obj) => obj.ID == ID);
    return findData;
  };

  const getObjType = (ID) => {
    const findData = socketData?.find((obj) => obj.ID == ID);
    return findData?.Properties?.Type;
  };

  const BackFire = (event) => {
    setLastEvent(event);
  };

  return { socketData, findDesiredData, getObjType, dataRef, socket, BackFire };
};
