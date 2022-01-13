import React from "react";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material";

export const ProjectsRoot = styled((props) => <Grid {...props} />)(
  ({ theme }) => ({
    minHeight: "100vh",
    padding: "50px",
    width: "100%",
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
      width: "600px",
    },
  })
);

export const AnimationWrapper = styled((props) => <Grid {...props} />)({});

export const HeaderWrapper = styled((props) => <Grid {...props} />)({});

export const ProjectHeader = styled("h3")({
  // margin: 'auto',
});

export const ProjectsWrapper = styled((props) => <Grid {...props} />)({
  marginBottom: "50px",
});

export const ProjectCardWrapper = styled((props) => <Grid {...props} />)({});
