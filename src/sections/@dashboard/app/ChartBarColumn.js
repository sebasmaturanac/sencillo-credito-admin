import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader, Box, colors } from "@mui/material";
import { ESTADOS } from "types/estado";

const reduceByObjectKey = (data, key) => [...new Set(data.map((x) => key(x)))];
export default function ChartBarColumn({ data }) {
  const differentsUsers = reduceByObjectKey(data, (prop) => prop.name);
  const aprobadoSerie = differentsUsers.map(
    (user) =>
      data.filter((element) => element.name === user && element.estado === ESTADOS.APROBADO)[0]
        ?.total || 0,
  );
  const rechazadoSerie = differentsUsers.map(
    (user) =>
      data.filter((element) => element.name === user && element.estado === ESTADOS.RECHAZADO)[0]
        ?.total || 0,
  );
  const chartOptions = {
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
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
      },
    },
    xaxis: {
      type: "string",
      categories: differentsUsers,
    },
    legend: {
      position: "right",
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
  };
  return (
    <Card>
      <CardHeader
        title="Total de pedidos aprobados y rechazados"
        subheader="correspondientes a usted y sus vendedores"
      />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          type="bar"
          height={380}
          options={chartOptions}
          series={[
            {
              name: "APROBADO",
              data: aprobadoSerie,
              color: colors.green[400],
            },
            {
              name: "RECHAZADO",
              data: rechazadoSerie,
              color: colors.red[500],
            },
          ]}
        />
      </Box>
    </Card>
  );
}

ChartBarColumn.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      total: PropTypes.number,
      estado: PropTypes.string,
    }),
  ).isRequired,
};
