import { useAppData } from '../../hooks';
import { rgbColor } from '../../utils';

const TabButton = ({ data, handleTabClick, activeTab, bgColor, fontColor, activebgColor }) => {
  const { socket } = useAppData();
  const { Caption, Event } = data?.Properties;

  const emitEvent = Event && Event[0];
  const handleMouseDown = (e) => {
    const shiftState = (e.shiftKey ? 1 : 0) + (e.ctrlKey ? 2 : 0); // Shift + Ctrl state
    const x = e.clientX;
    const y = e.clientY;
    const button = e.button;

    const mousedownEvent = JSON.stringify({
      Event: {
        EventName: "MouseDown",
        ID: data?.ID,
        Info: [x, y, button, shiftState],
      },
    });

    const exists = Event && Event.some((item) => item[0] === "MouseDown");
    if (!exists) return;
    console.log(mousedownEvent);
    socket.send(mousedownEvent);
  };

  const handleMouseUp = (e) => {
    const shiftState = (e.shiftKey ? 1 : 0) + (e.ctrlKey ? 2 : 0);
    const x = e.clientX;
    const y = e.clientY;
    const button = e.button;

    const mouseUpEvent = JSON.stringify({
      Event: {
        EventName: "MouseUp",
        ID: data?.ID,
        Info: [x, y, button, shiftState],
      },
    });

    const exists = Event && Event.some((item) => item[0] === "MouseUp");
    if (!exists) return;
    console.log(mouseUpEvent);
    socket.send(mouseUpEvent);
  };
  
  return (
    <div
      id={data.ID}
      onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      style={{
        border: '1px solid #DFDFDF',
        fontSize: '12px',
        // fontSize: '11px',
        paddingTop: '2px',
        paddingBottom: '2px',
        paddingLeft: '4px',
        paddingRight: '4px',
        cursor: 'pointer',
        borderRadius: '2px',
        background:
          activeTab == data?.ID
            ? rgbColor(!activebgColor ? [255, 255, 255] : activebgColor)
            : rgbColor(bgColor),
        height: '20px',
        borderBottom: activeTab == data?.ID ? '0px' : '1px solid  #DFDFDF',
        color: !fontColor ? 'black' : rgbColor(fontColor),
        fontWeight: 600,
      }}
      onClick={() => {
        console.log(
          JSON.stringify({
            Event: {
              EventName: emitEvent && emitEvent[0],
              ID: data?.ID,
              Info: [data?.ID],
            },
          })
        );

        localStorage.setItem(
          'lastEvent',
          JSON.stringify({
            Event: {
              EventName: emitEvent && emitEvent[0],
              ID: data?.ID,
              Info: [data?.ID],
            },
          })
        );

        socket.send(
          JSON.stringify({
            Event: {
              EventName: emitEvent && emitEvent[0],
              ID: data?.ID,
              Info: [data?.ID],
            },
          })
        );

        handleTabClick(data.ID);
      }}
    >
      {Caption}
      {/* <button
      
      >
        {Caption}
      </button> */}
    </div>
  );
};
export default TabButton;
