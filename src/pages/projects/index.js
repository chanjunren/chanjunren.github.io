import React from "react";
import Layout from "@theme/Layout";
import * as animationData from "../../assets/lottie_animation.json";

import Lottie from "react-lottie";
import { completedProjects, ongoingProjects } from "./project_data";

import ProjectCard from "./project_card";
import {
  AnimationWrapper,
  HeaderWrapper,
  ProjectHeader,
  ProjectsRoot,
  ProjectsWrapper,
  ProjectCardWrapper
} from "./project_components";
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
        <HeaderWrapper item xs={12}>
          <ProjectHeader>Ongoing</ProjectHeader>
        </HeaderWrapper>
        <ProjectsWrapper container xs={12} >
          {ongoingProjects.map((project) => {
            return (
              <ProjectCardWrapper item xs={12} md={6} spacing={1}>
                <ProjectCard {...project} />
              </ProjectCardWrapper>
            );
          })}
        </ProjectsWrapper>
        <ProjectHeader>Past Works</ProjectHeader>
        <ProjectsWrapper container xs={12} spacing={1}>
          {completedProjects.map((project) => {
            return (
              <ProjectCardWrapper item xs={12} md={6}>
                <ProjectCard {...project} />
              </ProjectCardWrapper>
            );
          })}
        </ProjectsWrapper>
      </ProjectsRoot>
    </Layout>
  );
}
