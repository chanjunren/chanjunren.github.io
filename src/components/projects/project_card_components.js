import React from "react";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material";

export const ProjectCardRoot = styled((props) => <Grid {...props} />)(
  ({theme}) => ({
    height: "100%",
    width: "90%",
    [theme.breakpoints.up("md")]: {
      width: "238.95px",
    },
  })
);

export const ProjectCardImage = styled("img")(({ theme }) => ({
  borderRadius: "12px",
  width: "100%",
  height: 'auto',
  [(theme.breakpoints.up("sm"))]: {
    height: "278.83px",
  },
  [theme.breakpoints.up("md")]: {
    height: "132.75px",
  },
}));

export const ProjectCardContentWrapper = styled("div")((props) => ({
  display: "grid",
  justifyContent: "center",
  width: "100%",
  margin: '10px auto 20px',
}));

export const ProjectCardHeader = styled("h4")({
  textAlign: "center",
  margin: 'auto'
});

export const ProjectCardDesc = styled("p")({
  textAlign: "center",
});
