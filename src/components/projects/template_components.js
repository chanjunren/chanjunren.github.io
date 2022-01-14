import React from "react";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material";

import Link from "@docusaurus/Link";
import WebIcon from "@mui/icons-material/Web";
import ComputerIcon from "@mui/icons-material/Computer";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import AndroidIcon from "@mui/icons-material/Android";
import {
  DESKTOP_APP,
  WEB_APP,
  MOBILE_APP,
  ANDROID_APP,
} from "../../utils/project_types";

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

export const CustomToolTip = ({ type }) => {
  console.log(type)
  switch (type) {
    case DESKTOP_APP:
      return (
        <Tooltip color="primary" title={type}>
          <IconButton>
            <ComputerIcon sx={{ width: "28px", height: "28px" }} />
          </IconButton>
        </Tooltip>
      );
    case WEB_APP:
      return (
        <Tooltip color="primary" title={type}>
          <IconButton>
            <WebIcon sx={{ width: "28px", height: "28px" }} />
          </IconButton>
        </Tooltip>
      );
    case MOBILE_APP:
      return (
        <Tooltip color="primary" title={type}>
          <IconButton>
            <PhoneIphoneIcon sx={{ width: "28px", height: "28px" }} />
          </IconButton>
        </Tooltip>
      );
    case ANDROID_APP:
      return (
        <Tooltip color="primary" title={type}>
          <IconButton>
            <AndroidIcon sx={{ width: "28px", height: "28px" }} />
          </IconButton>
        </Tooltip>
      );
  }
};

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

export const SummaryWrapper = styled((props) => <Grid {...props} />)({
  display: "grid",
  alignItems: 'center',
  justifyContent: 'center',
  padding: "20px",
  margin: "2rem",
  borderRadius: "0.5rem",
  background: "rgba(255, 255, 255, 0.08)",
});

export const Summary = styled("p")({
  margin: 'auto'
});

export const LifeStoryWrapper = styled((props) => <Grid {...props} />)({
  display: "table",
  padding: "20px",
  margin: "20px",
});

export const LifeStory = styled("p")({
  display: "table-cell",
  textAlign: "center",
  verticalAlign: "middle",
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

export const SpecWrapper = styled((props) => <Grid {...props} />)({
  padding:'5px'
});
export const ChipContainer = styled((props) => <Grid {...props} />)({
  display: "grid",
  justifyContent: "center",
  alignItems: "center",
});
export const CustomisedChip = ({ label, icon }) => {
  return (
    <Grid item>
      <Chip icon={icon} label={label} variant="outlined" color="primary" />
    </Grid>
  );
};

// export const UrlWrapper
