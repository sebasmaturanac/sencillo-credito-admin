import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  List,
  ListSubheader,
  ListItem,
  Typography,
  ListItemText,
  Divider,
  Tooltip,
  Stack,
} from "@mui/material";

const CardDetail = ({ title, list, children }) => (
  <Card>
    <CardContent
      style={{
        paddingTop: 0,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
      }}
    >
      <List
        sx={{ bgcolor: "background.paper" }}
        component="nav"
        subheader={<ListSubheader>{title}</ListSubheader>}
        dense
      >
        {list.map((item) => (
          <React.Fragment key={item.label}>
            <ListItem
              secondaryAction={
                <Tooltip title={item.value || ""}>
                  <Stack direction="row" alignItems="center">
                    {item.icon}
                    <Typography
                      variant="subtitle2"
                      maxWidth={320}
                      noWrap
                      sx={{
                        fontStyle: !item.value ? "italic" : "normal",
                        paddingRight: 1,
                      }}
                    >
                      {item.value || item.alternativeText}
                    </Typography>
                  </Stack>
                </Tooltip>
              }
            >
              <ListItemText primary={item.label} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </CardContent>
    {children}
  </Card>
);

CardDetail.defaultProps = {
  children: null,
};

CardDetail.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      string: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
};

export default CardDetail;
