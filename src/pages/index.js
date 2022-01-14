import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import IconButton from "@mui/material/IconButton";
import GitHub from "@mui/icons-material/GitHub";
import LinkedIn from "@mui/icons-material/LinkedIn";
import Email from "@mui/icons-material/Email";
import HandsomeFace from "../assets/landing_page/my_handsome_face.jpg";
import {
  AboutMe,
  AboutMeWrapper,
  AnimationWrapper,
  LandingPageButtons,
  ButtonsContainer,
  DetailsWrapper,
  LandingPageRoot,
  MediaIconWrapper,
  MeWrapper,
  MyHandsomeFace,
  MyHandsomeFaceWrapper,
  Name,
  NameWrapper,
  Occupation,
  OccupationWrapper,
  SlideIntoMyDmsWrapper,
} from "../components/landing_page/landing_page_components";
import Lottie from "react-lottie";

import * as animationData from "../assets/banner_animation.json";
import { ThemeProvider } from "@mui/material";
import { theme, TransitionWrapper } from "../utils/mui_theme";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Website about Jun Ren by Jun Ren"
    >
      <LandingPageRoot container>
        <AnimationWrapper item xs={12}>
          <Lottie options={lottieOptions} height={250} width={250} />
        </AnimationWrapper>
        <TransitionWrapper>
          <MeWrapper container item xs={12}>
            <MyHandsomeFaceWrapper item xs={12} md={4}>
              <MyHandsomeFace src={HandsomeFace} />
            </MyHandsomeFaceWrapper>
            <DetailsWrapper container item xs={12} md={8}>
              <NameWrapper item xs={12}>
                <Name>Jun Ren</Name>
              </NameWrapper>
              <OccupationWrapper item xs={12}>
                <Occupation>
                  Student | Part Time Freelancer Developer
                </Occupation>
              </OccupationWrapper>
            </DetailsWrapper>
          </MeWrapper>
          <AboutMeWrapper item xs={12}>
            <AboutMe>
              I'm a Final Year student at NUS School of Computing. I am an
              aspiring Full Stack Developer constantly looking for fun projects
              to build, I'm currently looking for full time opportunities
            </AboutMe>
          </AboutMeWrapper>
          <ButtonsContainer>
            <LandingPageButtons />
          </ButtonsContainer>
          <SlideIntoMyDmsWrapper container item xs={12}>
            <ThemeProvider theme={theme}>
              <MediaIconWrapper item xs={4}>
                <IconButton
                  href="https://github.com/chanjunren"
                  target="_blank"
                  color="primary"
                >
                  <GitHub sx={{ width: "40px", height: "40px" }} />
                </IconButton>
              </MediaIconWrapper>
              <MediaIconWrapper item xs={4}>
                <IconButton
                  href="https://www.linkedin.com/in/jun-ren-chan-90240a175/"
                  target="_blank"
                  color="primary"
                >
                  <LinkedIn sx={{ width: "40px", height: "40px" }} />
                </IconButton>
              </MediaIconWrapper>
              <MediaIconWrapper item xs={4}>
                <IconButton
                  href="mailto:chanjunren@gmail.com"
                  target="_blank"
                  color="primary"
                >
                  <Email sx={{ width: "40px", height: "40px" }} />
                </IconButton>
              </MediaIconWrapper>
            </ThemeProvider>
          </SlideIntoMyDmsWrapper>
        </TransitionWrapper>
      </LandingPageRoot>
    </Layout>
  );
}
