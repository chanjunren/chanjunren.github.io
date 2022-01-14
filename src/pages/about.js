import React from "react";
import Layout from "@theme/Layout";
import * as animationData from "../assets/banner_animation.json";
import Lottie from "react-lottie";
import {
  AboutRoot,
  AnimationWrapper,
  CategoryHeader,
  EducationItem,
  EducationItemList,
  Header,
  ItemContainer,
  ItemHeader,
  SectionBreak,
  SubHeader,
} from "../components/about/about_components";
import { educationData, experienceData } from "../data/about_data";

const lottieOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function AboutPage() {
  return (
    <Layout>
      <AboutRoot>
        <AnimationWrapper item xs={12}>
          <Lottie options={lottieOptions} height={250} width={250} />
        </AnimationWrapper>
        <Header color="#e25aae">Experience</Header>
        {experienceData.map((experience) => {
          return (
            <ItemContainer item xs={12}>
              <SubHeader>{experience.header}</SubHeader>
              {experience.items.map((item) => {
                return (
                  <>
                    <ItemHeader title={item.title} duration={item.duration} />
                    {item.description}
                  </>
                );
              })}
            </ItemContainer>
          );
        })}
        <SectionBreak />
        <Header color="#76b5c5">Education</Header>
        {educationData.map((education) => {
          return (
            <ItemContainer item xs={12}>
              <SubHeader>{education.school}</SubHeader>
              <ItemHeader
                title={education.certification}
                duration={education.duration}
              />
              <br/>
              {education.categories.map((category) => {
                return (
                  <ItemContainer item xs={12}>
                    <CategoryHeader>{category.subheader}</CategoryHeader>
                    <EducationItemList>
                      {category.items.map((item) => {
                        return <EducationItem>{item}</EducationItem>;
                      })}
                    </EducationItemList>
                  </ItemContainer>
                );
              })}
              <SectionBreak />
            </ItemContainer>
          );
        })}
      </AboutRoot>
    </Layout>
  );
}
