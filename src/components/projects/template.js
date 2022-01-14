import React from "react";
import {
  AnimationWrapper,
  ChipContainer,
  CustomisedChip,
  Description,
  HeaderItem,
  HeaderWrapper,
  ProjectCard,
  ProjectCardWrapper,
  ProjectsLink,
  ProjectsLinkWrapper,
  ProjectTitle,
  SpecWrapper,
  TechStackWrapper,
  TemplatePageRoot,
  TextWrapper,
  TitleWrapper,
} from "./template_components";
import Layout from "@theme/Layout";
import * as animationData from "../../assets/banner_animation.json";
import Lottie from "react-lottie";

import { ThemeProvider } from "@mui/material";
import { theme } from "../../utils/mui_theme";

import WebIcon from "@mui/icons-material/Web";
import ComputerIcon from "@mui/icons-material/Computer";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CodeIcon from "@mui/icons-material/Code";
import GitHubIcon from "@mui/icons-material/GitHub";
import RoomServiceIcon from '@mui/icons-material/RoomService';
import LinkIcon from "@mui/icons-material/Link";
import { DESKTOP_APP, WEB_APP } from "../../utils/project_types";
import { Grid } from "@mui/material";

const TemplatePage = ({
  title,
  cardImg,
  type,
  description,
  life_story, // Responsibilities and additional details
  images,
  url,
  stack,
  other,
  repo
}) => {
  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Layout>
      <TemplatePageRoot container>
        <AnimationWrapper item xs={12}>
          <Lottie options={lottieOptions} height={250} width={250} />
        </AnimationWrapper>
        <HeaderWrapper container item xs={12}>
          <ProjectsLinkWrapper item xs={2}>
            <ProjectsLink to="../">Projects</ProjectsLink>
          </ProjectsLinkWrapper>
          <HeaderItem item>
            <ArrowRightIcon />
          </HeaderItem>
          <HeaderItem item>
            {type === WEB_APP ? (
              <WebIcon sx={{ width: "40px", height: "40px" }} />
            ) : type === DESKTOP_APP ? (
              <ComputerIcon sx={{ width: "40px", height: "40px" }} />
            ) : (
              <PhoneIphoneIcon sx={{ width: "40px", height: "40px" }} />
            )}
          </HeaderItem>
          <TitleWrapper item>
            <ProjectTitle>{title}</ProjectTitle>
          </TitleWrapper>
        </HeaderWrapper>
        <ProjectCardWrapper item xs={12}>
          <ProjectCard src={cardImg} />
        </ProjectCardWrapper>
        <TextWrapper item xs={12}>
          <Description>{description}</Description>
        </TextWrapper>
        <ThemeProvider theme={theme}>
          {/* Tech Stack Wrapper */}
          <SpecWrapper container item xs={12}>
            <ChipContainer item xs={4}>
              <CustomisedChip label="Stack" icon={<CodeIcon />} />
            </ChipContainer>
            <TextWrapper item xs={8}>
              <Description>{stack}</Description>
            </TextWrapper>
          </SpecWrapper>
          {/* Other Wrapper */}
          <SpecWrapper container item xs={12}>
            <ChipContainer item xs={4}>
              <CustomisedChip label="Other services" icon={<RoomServiceIcon />} />
            </ChipContainer>
            <TextWrapper item xs={8}>
              <Description>{other}</Description>
            </TextWrapper>
          </SpecWrapper>
          <SpecWrapper container item xs={12}>
            <ChipContainer item xs={4}>
              <CustomisedChip label="URL" icon={<LinkIcon />} />
            </ChipContainer>
            <TextWrapper item xs={8}>
              <ProjectsLink to={url}>{url}</ProjectsLink>
            </TextWrapper>
          </SpecWrapper>
          <SpecWrapper container item xs={12}>
            <ChipContainer item xs={4}>
              <CustomisedChip label="Repository" icon={<GitHubIcon />} />
            </ChipContainer>
            <TextWrapper item xs={8}>
            <ProjectsLink to={repo}>{repo}</ProjectsLink>
            </TextWrapper>
          </SpecWrapper>
        </ThemeProvider>
        {/* Additional Info */}
        <TextWrapper item xs={12}>
<Description>{life_story}</Description>
        </TextWrapper>
        {/* Images */}
      </TemplatePageRoot>
    </Layout>
  );
};

export default TemplatePage;
