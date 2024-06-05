import BarGraph from "./BarGraph";

const Chart = ({ data }) => {
  const { Options } = data?.Properties;
  if (Options?.type == 'bar') return <BarGraph data={data} />;
};

export default Chart;
