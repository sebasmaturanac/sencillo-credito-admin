import PropTypes from "prop-types";
import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader, Box } from "@mui/material";
import BaseOptionChart from "components/charts/BaseOptionChart";
import { fCurrency, fShortenNumber } from "utils/formatNumber";
import { fLongMonth, fMonthNameYear } from "utils/formatTime";

export default function EstadisticaMontoTotalRangoFecha({ data }) {
  const CHART_DATA = [
    {
      name: "Monto total",
      type: "area",
      data: data.map((element) => element.total),
    },
  ];

  const chartOptions = merge(BaseOptionChart(), {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: { width: 2 },
    plotOptions: { bar: { columnWidth: "11%", borderRadius: 4 } },
    fill: { type: "gradient" },
    labels: data.map((element) => element.fecha),
    xaxis: {
      labels: {
        formatter: (x) => {
          if (typeof x !== "undefined") {
            return fMonthNameYear(x);
          }
          return x;
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${fShortenNumber(value)}`,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y, { dataPointIndex }) => {
          if (typeof y !== "undefined") {
            return `${fLongMonth(data[dataPointIndex].fecha).toUpperCase()}: ${fCurrency(y)} ARS`;
          }
          return y;
        },
      },
    },
  });

  return (
    <Card>
      <CardHeader title="Monto total de pedidos aprobados $(ARS)" subheader="últimos 12 meses" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}

EstadisticaMontoTotalRangoFecha.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      fecha: PropTypes.instanceOf(Date),
      total: PropTypes.number,
    }),
  ).isRequired,
};
