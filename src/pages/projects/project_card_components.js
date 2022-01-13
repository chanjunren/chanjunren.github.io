import React from "react";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material";

export const ProjectCardRoot = styled((props) => <Grid {...props} />)(
  ({theme}) => ({
    height: "100%",
    width: "501.91px",
    margin: 'auto',
    [theme.breakpoints.up("md")]: {
      width: "238.95px",
    },
  })
);

export const ProjectCardImage = styled("img")(({ theme }) => ({
  borderRadius: "12px",
  width: "100%",
  height: "278.83px",
  [theme.breakpoints.up("md")]: {
    height: "132.75px",
  },
}));

export const ProjectCardContentWrapper = styled("div")((props) => ({
  display: "grid",
  justifyContent: "center",
  width: "100%",
}));

export const ProjectCardHeader = styled("h4")({
  textAlign: "center",
});

export const ProjectCardDesc = styled("p")({
  textAlign: "center",
});
