import ReactApexChart from 'react-apexcharts';

const BarGraph = ({ data }) => {
  const { Options, Posn, Series, Size, ChartType } = data?.Properties;

  // const options = {
  //   chart: {
  //     parentHeightOffset: 0,
  //     toolbar: { show: false },
  //   },
  //   plotOptions: {
  //     bar: {
  //       borderRadius: 6,
  //       borderRadiusApplication: 'end',
  //       distributed: true,
  //       columnWidth: '35%',
  //       startingShape: 'rounded',
  //       dataLabels: { position: 'top' },
  //     },
  //   },
  //   legend: { show: false },
  //   tooltip: { enabled: false },
  //   dataLabels: {
  //     offsetY: -15,
  //     // formatter: (val) => `${val}k`,
  //     style: {
  //       fontWeight: 600,
  //       fontSize: '1rem',
  //       colors: ['#4b465c'],
  //     },
  //   },
  //   grid: {
  //     show: false,
  //   },
  //   xaxis: {
  //     axisTicks: { show: false },
  //     axisBorder: {
  //       color: 'gray',
  //     },
  //     categories: Options?.xaxis.categories,
  //     labels: {
  //       style: {
  //         fontSize: '13px',
  //         colors: [1, 2].map(() => 'red'),
  //         fontWeight: 400,
  //         fontFamily: 'Poppins',
  //       },
  //     },
  //   },
  //   yaxis: {
  //     min: Options?.yMin,
  //     max: Options?.yMax,
  //     tickAmount: Options?.Intervals,
  //     labels: {
  //       offsetX: -15,
  //       style: {
  //         fontSize: '13px',
  //         fontWeight: 400,
  //         colors: ['#22292f80'],
  //         fontFamily: 'Poppins',
  //       },
  //     },
  //   },
  //   responsive: [
  //     {
  //       options: {
  //         plotOptions: {
  //           bar: { columnWidth: '60%' },
  //         },
  //         grid: {
  //           padding: { right: 20 },
  //         },
  //       },
  //     },
  //   ],
  // };

  return (
    <div style={{ position: 'absolute', top: Posn && Posn[0], left: Posn && Posn[1] }}>
      <ReactApexChart
        options={{ ...Options }}
        width={Size && Size[1]}
        height={Size && Size[0]}
        type={ChartType}
        series={Series}
      />
    </div>
  );
};

export default BarGraph;
