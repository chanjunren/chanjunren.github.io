import React from "react";
import Layout from "@theme/Layout";
import * as animationData from "../assets/banner_animation.json";
import Lottie from "react-lottie";
import { completedProjects, ongoingProjects } from "../data/project_data";
import ProjectCard from "../components/projects/project_card";
import {
  AnimationWrapper,
  HeaderWrapper,
  ProjectHeader,
  ProjectsRoot,
  ProjectsWrapper,
  ProjectCardWrapper,
} from "../components/projects/project_components";
import { TransitionWrapper } from "../utils/mui_theme";

export default function ProjectsPage() {
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
      <ProjectsRoot>
        <AnimationWrapper item xs={12}>
          <Lottie options={lottieOptions} height={250} width={250} />
        </AnimationWrapper>
        <TransitionWrapper>
          <HeaderWrapper item xs={12}>
            <ProjectHeader>Ongoing</ProjectHeader>
          </HeaderWrapper>
          <ProjectsWrapper container item xs={12}>
            {Array.from(ongoingProjects, ([key, project]) => {
              return (
                <ProjectCardWrapper container item xs={12} md={6} spacing={1} key={key}>
                  <ProjectCard {...project} key={key} path={key} />
                </ProjectCardWrapper>
              );
            })}
          </ProjectsWrapper>
          <ProjectHeader>Past Works</ProjectHeader>
          <ProjectsWrapper container item xs={12} spacing={1}>
            {Array.from(completedProjects, ([key, project]) => {
              return (
                <ProjectCardWrapper container item xs={12} md={6} spacing={1} key={key}>
                  <ProjectCard {...project} key={key} path={key} />
                </ProjectCardWrapper>
              );
            })}
          </ProjectsWrapper>
        </TransitionWrapper>
      </ProjectsRoot>
    </Layout>
  );
}
