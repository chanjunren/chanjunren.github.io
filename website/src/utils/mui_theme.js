import React from 'react';
import { createTheme } from "@mui/material";
import Fade from "@mui/material/Fade";
export const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#ff5858",
    },
  },
  transitions: {
    duration: "3000000",
    delay: 5000,
  },
});

export const TransitionWrapper = (props) => (
  <Fade in={true}>
    <div>
      {props.children}
    </div>
  </Fade>
);
