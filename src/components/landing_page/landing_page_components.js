import React from "react";
import { styled } from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export const LandingPageRoot = styled((props) => <Grid {...props} />)(
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

export const MeWrapper = styled((props) => <Grid {...props} />)(
  ({ theme }) => ({})
);

export const DetailsWrapper = styled((props) => <Grid {...props} />)(
  ({ theme }) => ({
    display: "grid",
    alignItems: "center",
  })
);

export const NameWrapper = styled((props) => <Grid {...props} />)({});

export const Name = styled("h1")({
  fontSize: "1.875rem",
  fontWeight: "700",
  margin: "auto",
});

export const OccupationWrapper = styled((props) => <Grid {...props} />)({});

export const Occupation = styled("p")({
  fontSize: "1.5rem",
  margin: "auto",
});

export const AboutMeWrapper = styled((props) => <Grid {...props} />)({
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  borderRadius: "0.5rem",
  padding: "20px",
  marginTop: "50px",
});

export const AboutMe = styled("p")({});

export const MyHandsomeFaceWrapper = styled((props) => <Grid {...props} />)({});

export const MyHandsomeFace = styled("img")({
  width: "100px",
  height: "100px",
  borderColor: "rgba(255, 255, 255, 0.80)",
  borderRadius: "100px",
  borderWidth: "2px",
  borderStyle: "solid",
});

export const SlideIntoMyDmsWrapper = styled((props) => <Grid {...props} />)(
  ({ theme }) => ({
    width: "100%",
    marginTop: "50px",
  })
);

export const MediaIconWrapper = styled((props) => <Grid {...props} />)({
  width: "100%",
  display: "grid",
  alignItems: "center",
  justifyContent: "center",
});

export const LandingPageButtons = (props) => (
  <div className="docItemContainer">
    <nav className="pagination-nav docusaurus-mt-lg">
      <div className="pagination-nav__item">
        <Link className="pagination-nav__link" to={useBaseUrl("/about")}>
          <div className="pagination-nav__sublabel">Read my</div>
          <div className="pagination-nav__label">Introduction</div>
        </Link>
      </div>
      <div className="pagination-nav__item">
        <Link className="pagination-nav__link" to={useBaseUrl("/projects")}>
          <div className="pagination-nav__sublabel">Take a look at</div>
          <div className="pagination-nav__label">My Projects</div>
        </Link>
      </div>
    </nav>
  </div>
);
export const ButtonsContainer = styled('div')({
  width: '100%'
});
