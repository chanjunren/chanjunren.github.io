import React from "react";
import { Link } from "react-router-dom";
import {
  ProjectCardContentWrapper,
  ProjectCardDesc,
  ProjectCardHeader,
  ProjectCardImage,
  ProjectCardRoot,
} from "./project_card_components";

export default function ProjectCard(props) {
  const { title, description, cardImg, path } = props;
  console.log(path);
  return (
    <ProjectCardRoot>
      <Link to={`/projects${path}`}>
        <ProjectCardImage src={cardImg} />
      </Link>
      <ProjectCardContentWrapper>
        <ProjectCardHeader>{title}</ProjectCardHeader>
        <ProjectCardDesc>{description}</ProjectCardDesc>
      </ProjectCardContentWrapper>
    </ProjectCardRoot>
  );
}
