import * as AppIcons from './RibbonIcons';
import { Row, Col } from 'reactstrap';
import { useAppData } from '../../hooks';

const CustomRibbonButtonGroup = ({ data }) => {
  const { socket } = useAppData();

  const dataSplit = (title) => {
    return title.substring(0, 5) + '..';
  };
  const { Captions, Icons, Event } = data?.Properties;

  const colSize = Captions?.length == 4 ? 6 : 12;

  const handleSelectEvent = (info) => {
    const selectEvent = JSON.stringify({
      Event: {
        EventName: 'Select',
        ID: data?.ID,
        Info: [info],
      },
    });
    const exists = Event && Event.some((item) => item[0] === 'Select');
    if (!exists) return;
    console.log(selectEvent);
    socket.send(selectEvent);
  };

  const handleButtonEvent = (info) => {
    handleSelectEvent(info);
  };

  return (
    <Row>
      {Captions.map((title, i) => {
        let IconComponent = AppIcons[Icons[i]];
        return (
          <Col
            md={colSize}
            className='d-flex align-items-center justify-content-center'
            style={{ cursor: 'pointer' }}
            onClick={() => handleButtonEvent(i + 1)}
          >
            <IconComponent size={25} />
            <div style={{ fontSize: '12px', textAlign: 'center' }}>{title?.slice(0, 10)}</div>
          </Col>
        );
      })}
    </Row>
  );
};

export default CustomRibbonButtonGroup;
