import { useEffect, useRef, useCallback, useState } from 'react';

import {
  excludeKeys,
  setStyle,
  getImageStyles,
  rgbColor,
  extractStringUntilSecondPeriod,
} from '../../utils';
import SelectComponent from '../SelectComponent';
import { useAppData, useResizeObserver } from '../../hooks';

const SubForm = ({ data }) => {
  const parent = JSON.parse(localStorage.getItem(extractStringUntilSecondPeriod(data?.ID)));

  const PORT = localStorage.getItem('PORT');
  const { findDesiredData } = useAppData();
  const { Size, Posn, Picture, Visible, BCol } = data?.Properties;

  const observedDiv = useRef(null);
  const [oldValue, setOldValue] = useState(Size);
  const [height, setHeight] = useState(Size && Size[0]);
  const [width, setWidth] = useState(Size && Size[1]);
  const [top, setTop] = useState(Posn && Posn[0]);
  const [left, setLeft] = useState(Posn && Posn[1]);

  // const dimensions = useResizeObserver(
  //   document.getElementById(extractStringUntilSecondPeriod(data?.ID))
  // );

  const [oldFormValues, setoldFormValues] = useState(parent && parent?.Size);

  // useEffect(() => {
  //   if (!oldValue) return;
  //   if (!oldFormValues) return;
  //   const calculateWidth =
  //     oldValue && oldValue[1] && oldFormValues && oldFormValues[1]
  //       ? (oldValue[1] / oldFormValues[1]) * dimensions.width
  //       : 0;

  //   const calculateHeight =
  //     oldValue && oldValue[0] && oldFormValues && oldFormValues[0]
  //       ? (oldValue[0] / oldFormValues[0]) * dimensions.height
  //       : 0;

  //   const calculateLeft =
  //     left && oldFormValues && oldFormValues[1] ? (left / oldFormValues[1]) * dimensions.width : 0;

  //   const calculateTop =
  //     top && oldFormValues && oldFormValues[0] ? (top / oldFormValues[0]) * dimensions.height : 0;

  //   setWidth(calculateWidth);
  //   setLeft(calculateLeft);
  //   setHeight(calculateHeight);
  //   setTop(calculateTop);
  // }, [dimensions, data]);

  const styles = setStyle(data?.Properties);
  const updatedData = excludeKeys(data);

  const ImageData = findDesiredData(Picture && Picture[0]);

  const imageStyles = getImageStyles(Picture && Picture[1], PORT, ImageData);

  let updatedStyles = { ...styles, ...imageStyles };

  useEffect(() => {
    localStorage.setItem(
      data.ID,
      JSON.stringify({
        Size: !Size ? [oldFormValues[0], oldFormValues[1]] : Size,
        Posn: !Posn ? [parent?.Posn[0], parent?.Posn[1]] : Posn,
      })
    );
  }, [data]);

  return (
    <div
      id={data.ID}
      style={{
        ...updatedStyles,
        height: height,
        width: width,
        top: top,
        left: left,
        position: 'absolute',
        display: Visible == 0 ? 'none' : 'block',
        background: BCol && rgbColor(BCol),
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
