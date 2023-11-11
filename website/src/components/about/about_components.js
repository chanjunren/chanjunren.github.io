import React from "react";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material";

export const AboutRoot = styled((props) => <Grid {...props} />)(
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

export const ItemContainer = styled((props) => <Grid {...props} />)({});

export const SectionBreak = (props) => {
  return (
    <><br/><br/></>
  );
};
export const Header = styled("h1")(({ color }) => ({
  textDecoration: "underline",
  textDecorationColor: color,
  textDecorationThickness: "0.4rem",
  textUnderlineOffset: "5px",
}));

export const SubHeader = styled("h2")(({ color }) => ({
  // textDecoration: 'underline',
  textDecorationColor: { color },
  textDecorationThickness: "0.4rem",
  textUnderlineOffset: "5px",
  marginTop: "20px",
}));

export const ItemHeader = ({ title, duration }) => {
  return (
    <>
      <b sx={{ fontWeight: "bold" }}>{title}</b>
      <br />
      <i>{duration}</i>
      <br />
    </>
  );
};

export const ItemContent = ({ children }) => {
  return (
    <div>
      {children}
      <SectionBreak/>
    </div>
  );
};

export const AboutURL = styled('a')({
  fontWeight: 'bold'
});

export const EducationItemList = styled('ul')({
  display: 'block',
  listStyleType: 'disc',
  marginBlockStart: '1em',
  marginBlockEnd: '1em',
  marginInlineStart: '0px',
  marginInlineEnd: '0px',
  paddingInlineStart: '40px'
});

export const EducationItem = styled('li')({});

export const CategoryHeader = ({children}) => {
  return <b sx={{ fontWeight: "bold" }}>{children}</b>
}
