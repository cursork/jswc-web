import { useEffect, useRef, useCallback, useState } from 'react';

import {
  excludeKeys,
  setStyle,
  getImageStyles,
  rgbColor,
  extractStringUntilSecondPeriod,
} from '../../utils';
import SelectComponent from '../SelectComponent';
import { useAppData } from '../../hooks';

const SubForm = ({ data }) => {
  const PORT = localStorage.getItem('PORT');
  const { findDesiredData } = useAppData();
  const { Size, Posn, Picture, Visible, BCol, FlexDirection, JustifyContent, Display } =
    data?.Properties;

  const observedDiv = useRef(null);

  const styles = setStyle(data?.Properties);
  const updatedData = excludeKeys(data);

  const ImageData = findDesiredData(Picture && Picture[0]);

  const imageStyles = getImageStyles(Picture && Picture[1], PORT, ImageData);

  let updatedStyles = { ...styles, ...imageStyles };

  useEffect(() => {
    localStorage.setItem(
      data.ID,
      JSON.stringify({
        Size: Size && Size,
        Posn: Posn && Posn,
      })
    );
  }, [data]);

  return (
    <div
      id={data.ID}
      style={{
        ...updatedStyles,
        height: Size && Size[0],
        width: Size && Size[1],
        top: Posn && Posn[0],
        left: Posn && Posn[1],
        position: 'absolute',
        display:
          Visible == 0 ? 'none' : data?.Properties.hasOwnProperty('Display') ? Display : 'block',
        background: BCol && rgbColor(BCol),
        ...(data?.Properties.hasOwnProperty('FlexDirection')
          ? { flexDirection: FlexDirection }
          : {}),
        ...(data?.Properties.hasOwnProperty('JustifyContent')
          ? { justifyContent: JustifyContent }
          : {}),
      }}
      ref={observedDiv}
    >
      {Object.keys(updatedData).map((key) => {
        return <SelectComponent data={updatedData[key]} />;
      })}
    </div>
  );
};

export default SubForm;
