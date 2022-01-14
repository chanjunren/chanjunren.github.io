import React from "react";
import {
  AnimationWrapper,
  ChipContainer,
  CustomisedChip,
  CustomToolTip,
  Description,
  HeaderItem,
  HeaderWrapper,
  LifeStory,
  LifeStoryWrapper,
  ProjectCard,
  ProjectCardWrapper,
  ProjectsLink,
  ProjectsLinkWrapper,
  ProjectTitle,
  SpecWrapper,
  Summary,
  SummaryWrapper,
  TemplatePageRoot,
  TextWrapper,
  TitleWrapper,
} from "./template_components";
import Layout from "@theme/Layout";
import * as animationData from "../../assets/banner_animation.json";
import Lottie from "react-lottie";

import { ThemeProvider } from "@mui/material";
import { theme } from "../../utils/mui_theme";

import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CodeIcon from "@mui/icons-material/Code";
import GitHubIcon from "@mui/icons-material/GitHub";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import LinkIcon from "@mui/icons-material/Link";
import { Grid } from "@mui/material";

const TemplatePage = ({
  title,
  cardImg,
  type,
  summary,
  description, // Responsibilities and additional details
  images,
  url,
  stack,
  other,
  repo,
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
      <ThemeProvider theme={theme}>
        <TemplatePageRoot container>
          <AnimationWrapper item xs={12}>
            <Lottie options={lottieOptions} height={250} width={250} />
          </AnimationWrapper>
          <HeaderWrapper container item xs={12}>
            <ProjectsLinkWrapper item xs={2}>
              <ProjectsLink to="/projects">Projects</ProjectsLink>
            </ProjectsLinkWrapper>
            <HeaderItem item>
              <ArrowRightIcon />
            </HeaderItem>
            <HeaderItem item>
              <CustomToolTip type={type} />
            </HeaderItem>
            <TitleWrapper item>
              <ProjectTitle>{title}</ProjectTitle>
            </TitleWrapper>
          </HeaderWrapper>
          <ProjectCardWrapper item xs={12}>
            <ProjectCard src={cardImg} />
          </ProjectCardWrapper>
          <SummaryWrapper item xs={12}>
            <Summary>{summary}</Summary>
          </SummaryWrapper>
          {/* Tech Stack Wrapper */}
          <SpecWrapper container item xs={12}>
            <ChipContainer item xs={12} sm={4}>
              <CustomisedChip label="Stack" icon={<CodeIcon />} />
            </ChipContainer>
            <TextWrapper item xs={12} sm={8}>
              <Description>{stack}</Description>
            </TextWrapper>
          </SpecWrapper>
          {/* Other Wrapper */}
          {other && (
            <SpecWrapper container item xs={12}>
              <ChipContainer item xs={12} sm={4}>
                <CustomisedChip
                  label="Other services"
                  icon={<RoomServiceIcon />}
                />
              </ChipContainer>
              <TextWrapper item xs={12} sm={8}>
                <Description>{other}</Description>
              </TextWrapper>
            </SpecWrapper>
          )}
          {url && (
            <SpecWrapper container item xs={12}>
              <ChipContainer item xs={12} sm={4}>
                <CustomisedChip label="URL" icon={<LinkIcon />} />
              </ChipContainer>
              <TextWrapper item xs={12} sm={8}>
                <ProjectsLink to={url}>{url}</ProjectsLink>
              </TextWrapper>
            </SpecWrapper>
          )}
          {repo ? (
            <SpecWrapper container item xs={12}>
              <ChipContainer item xs={12} sm={4}>
                <CustomisedChip label="Repository" icon={<GitHubIcon />} />
              </ChipContainer>
              <TextWrapper item xs={12} sm={8}>
                <ProjectsLink to={repo}>{repo}</ProjectsLink>
              </TextWrapper>
            </SpecWrapper>
          ) : (
            <SpecWrapper container item xs={12}>
              <ChipContainer item xs={12} sm={4}>
                <CustomisedChip label="Repository" icon={<GitHubIcon />} />
              </ChipContainer>
              <TextWrapper item xs={12} sm={8}>
                <Description>This repo is private :(</Description>
              </TextWrapper>
            </SpecWrapper>
          )}
          {/* Additional Info */}
          <LifeStoryWrapper item xs={12}>
            <LifeStory>{description}</LifeStory>
          </LifeStoryWrapper>
          {/* Images */}
        </TemplatePageRoot>
      </ThemeProvider>
    </Layout>
  );
};

export default TemplatePage;
