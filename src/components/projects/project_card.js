import React from 'react';
import { ProjectCardContentWrapper, ProjectCardDesc, ProjectCardHeader, ProjectCardImage, ProjectCardRoot } from './project_card_components';

export default function ProjectCard(props) {
  const {title, description, cardImg} = props;
  return (
    <ProjectCardRoot>
      <ProjectCardImage src={cardImg}/>
      <ProjectCardContentWrapper>
        <ProjectCardHeader>{title}</ProjectCardHeader>
        <ProjectCardDesc>{description}</ProjectCardDesc>
      </ProjectCardContentWrapper>
    </ProjectCardRoot>
  );
}