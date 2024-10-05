const Minimal = ({ data }) => {
  console.log('MINIMAL', data);
  return <div id={data.ID}><b>This</b> <i>is</i> a test...</div>
};

export default Minimal;
