import React from "react";
import { styled } from "@mui/system";
import Grid from "@mui/material/Grid";

export const ProjectsRoot = styled((props) => <Grid {...props} />)({
  minHeight: "100vh",
  padding: "50px",
  width: "50%",
  margin: "auto",
  // [theme.breakpoints.up('xs')]: {
  //   width: '50%',
  // }
});

export const AnimationWrapper = styled((props) => <Grid {...props} />)({});

export const HeaderWrapper = styled((props) => <Grid {...props} />)({});

export const ProjectHeader = styled("h3")({});

export const ProjectsWrapper = styled((props) => <Grid {...props} />)({
  marginBottom: '50px',
});

export const ProjectCardWrapper = styled((props) => <Grid {...props} />)({});
