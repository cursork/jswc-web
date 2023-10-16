import { useAppData } from '../../hooks';

const TabButton = ({ data, handleTabClick, activeTab }) => {
  const { socket } = useAppData();
  const { Caption, Event } = data?.Properties;

  return (
    <div
      style={{
        border: '1px solid #DFDFDF',
        fontSize: '12px',
        paddingTop: '2px',
        paddingBottom: '2px',
        paddingLeft: '4px',
        paddingRight: '4px',
        cursor: 'pointer',
        borderRadius: '2px',
        background: activeTab == data?.ID ? '#FAFAFA' : '#F0F0F0',
        height: activeTab == data?.ID ? '22px' : '20px',
        borderBottom: activeTab == data?.ID ? '0px' : '1px solid  #DFDFDF',
      }}
      onClick={() => {
        console.log(
          JSON.stringify({
            Event: {
              EventName: Event[0],
              ID: data?.ID,
              Info: Caption,
            },
          })
        );

        localStorage.setItem(
          'lastEvent',
          JSON.stringify({
            Event: {
              EventName: Event[0],
              ID: data?.ID,
              Info: Caption,
            },
          })
        );

        socket.send(
          JSON.stringify({
            Event: {
              EventName: Event[0],
              ID: data?.ID,
              Info: Caption,
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
