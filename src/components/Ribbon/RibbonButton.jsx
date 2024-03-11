import * as Icons from './RibbonIcons';
import { RibbonButton } from 'react-bootstrap-ribbon';
import { Row, Col } from 'reactstrap';
import { useAppData } from '../../hooks';
import { MdOutlineQuestionMark } from 'react-icons/md';

const CustomRibbonButton = ({ data }) => {
  const { socket } = useAppData();

  const { Icon, Caption, Event } = data?.Properties;

  const handleSelectEvent = () => {
    const selectEvent = JSON.stringify({
      Event: {
        EventName: 'Select',
        ID: data?.ID,
      },
    });
    const exists = Event && Event.some((item) => item[0] === 'Select');
    if (!exists) return;
    console.log(selectEvent);
    socket.send(selectEvent);
  };

  const handleButtonEvent = () => {
    handleSelectEvent();
  };

  const IconComponent = Icons[Icon] ? Icons[Icon] : MdOutlineQuestionMark;
  return (
    <Row>
      <Col md={12}>
        <div
          className='d-flex align-items-center flex-column justify-content-center'
          onClick={handleButtonEvent}
          style={{ cursor: 'pointer' }}
        >
          <IconComponent size={35} />
          <div className='text-center' style={{ fontSize: '12px' }}>
            {Caption}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default CustomRibbonButton;
