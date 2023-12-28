import { setStyle, createListViewObjects } from '../../utils';
import { useAppData } from '../../hooks';

const ListView = ({ data }) => {
  const PORT = localStorage.getItem('PORT');

  const { findDesiredData } = useAppData();

  const { View, Border, ColTitles, ImageIndex, ImageListObj, Items, ReportInfo } =
    data && data?.Properties;

  const styles = setStyle(data?.Properties);

  //   console.log({ View });

  //   console.log({ data });

  // Icon bigger Icon

  const ImageListView = ({
    orientation = 'row',
    Images = [],
    parentOrientation = 'row',
    height,
    width,
    imageHeight,
    imageWidth,
  }) => {
    return (
      <div
        className={`d-flex flex-${parentOrientation}`}
        style={{ ...styles, border: !Border ? null : '1px solid black' }}
      >
        {Items?.map((item, index) => {
          return (
            <div
              style={{ width, height }}
              className={`d-flex flex-${orientation} align-items-center`}
            >
              <img
                style={{ width: imageWidth, height: imageHeight }}
                src={`http://localhost:${PORT}${Images[index]}`}
              />
              <span style={{ fontSize: '12px' }}>{item}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (View && View == 'Icon') {
    const ImageData = findDesiredData(ImageListObj && ImageListObj[0]);
    const Images = ImageData?.Properties?.Files;
    const ImageSize = ImageData && ImageData?.Properties?.Size;
    return (
      <ImageListView
        orientation='column'
        height={`${ImageSize && ImageSize[0] + 15}px`}
        width={`${ImageSize && ImageSize[1] + 30}px`}
        Images={Images}
        imageHeight={`${ImageSize && ImageSize[0]}px`}
        imageWidth={`${ImageSize && ImageSize[1]}px`}
      />
    );
  }

  if (View && View == 'SmallIcon') {
    const ImageData = findDesiredData(ImageListObj && ImageListObj[1]);
    const Images = ImageData?.Properties?.Files;
    const ImageSize = ImageData?.Properties?.Size;
    return (
      <ImageListView
        imageHeight={`${ImageSize && ImageSize[0]}px`}
        imageWidth={`${ImageSize && ImageSize[1]}px`}
        orientation='row'
        height={`${ImageSize && ImageSize[0] + 15}px`}
        width={`${ImageSize && ImageSize[1] + 30}px`}
        Images={Images}
      />
    );
  }
  if (View && View == 'List') {
    const ImageData = findDesiredData(ImageListObj && ImageListObj[1]);
    const Images = ImageData?.Properties?.Files;
    const ImageSize = ImageData?.Properties?.Size;
    return (
      <ImageListView
        imageHeight={`${ImageSize && ImageSize[0]}px`}
        imageWidth={`${ImageSize && ImageSize[1]}px`}
        parentOrientation={'column'}
        orientation='row'
        height={`${ImageSize && ImageSize[0]}px`}
        width={`${ImageSize && ImageSize[1] + 30}px`}
        Images={Images}
      />
    );
  }
  if (View && View == 'Report') {
    const ImageData = findDesiredData(ImageListObj && ImageListObj[1]);
    const Images = ImageData?.Properties?.Files;

    const reportsData = createListViewObjects(Images, Items, ReportInfo);

    return (
      <div style={{ ...styles, border: !Border ? null : '1px solid black' }}>
        {/* Header of the component */}
        <div className='d-flex align-items-center'>
          {ColTitles?.map((title, index, array) => {
            return (
              <div
                style={{
                  borderRight: index !== array.length - 1 ? '1px solid #F0F0F0' : 'none',
                  flex: 1,
                  fontSize: '12px',
                  paddingLeft: '5px',
                }}
              >
                {title}
              </div>
            );
          })}
        </div>

        <div className='mt-1'>
          {/* Report */}
          {reportsData?.map((report) => {
            return (
              <div className='d-flex align-items-center'>
                <div style={{ flex: 1, paddingLeft: '5px' }}>
                  <div className='d-flex align-items-center'>
                    <img src={`http://localhost:${PORT}${report?.image}`} />
                    <span style={{ fontSize: '12px' }}>{report?.title}</span>
                  </div>
                </div>
                <div style={{ flex: 1, fontSize: '12px', paddingLeft: '5px' }}>
                  {report?.description}
                </div>
                <div style={{ flex: 1, fontSize: '12px', paddingLeft: '5px' }}>{report?.index}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default ListView;
