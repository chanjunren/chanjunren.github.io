import React from "react";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Link from "@docusaurus/Link";
import { styled } from "@mui/material";

export const TemplatePageRoot = styled((props) => <Grid {...props} />)(
  ({ theme }) => ({
    padding: "50px",
    width: "100%",
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
      width: "600px",
    },
  })
);

export const AnimationWrapper = styled((props) => <Grid {...props} />)({});

export const HeaderItem = styled((props) => <Grid {...props} />)({
  display: "grid",
  alignItems: "center",
});

export const HeaderWrapper = styled((props) => <Grid {...props} />)({});

export const ProjectsLinkWrapper = styled((props) => <Grid {...props} />)({
  display: "table",
});
export const ProjectsLink = styled((props) => <Link {...props} />)({
  display: "table-cell",
  textAlign: "center",
  verticalAlign: "middle",
});

export const TitleWrapper = styled((props) => <Grid {...props} />)({
  display: "table",
  marginLeft: "5px",
});

export const ProjectTitle = styled("p")({
  display: "table-cell",
  textAlign: "center",
  verticalAlign: "middle",
  fontSize: "1.5rem",
  marginLeft: "5px",
});
export const ProjectCardWrapper = styled((props) => <Grid {...props} />)({
  display: "grid",
  justifyContent: "center",
  padding: "30px",
});

export const ProjectCard = styled("img")({
  borderRadius: "12px",
});

export const TextWrapper = styled((props) => <Grid {...props} />)({
  display: "table",
  padding: "5px",
});

export const Description = styled("p")({
  display: "table-cell",
  textAlign: "center",
  verticalAlign: "middle",
});

export const SpecWrapper = styled((props) => <Grid {...props} />)({});
export const ChipContainer = styled((props) => <Grid {...props} />)({
  display: 'grid',
  justifyContent: 'center'
});
export const CustomisedChip = ({ label, icon }) => {
  return (
    <Grid item>
      <Chip icon={icon} label={label} variant="outlined" color="primary" />
    </Grid>
  );
};

// export const UrlWrapper
