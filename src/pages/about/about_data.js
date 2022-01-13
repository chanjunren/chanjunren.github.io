import React from "react";
import { AboutURL, SectionBreak } from "./about_components";

export const experienceData = [
  {
    header: "Robosolutions",
    items: [
      {
        title: "Freelance Software Engineer",
        duration: "June 2021 to Present",
        description: (
          <div>
            Took a MERN course and developed{" "}
            <AboutURL href="/#">rs-app-manager</AboutURL>
            <SectionBreak />
          </div>
        ),
      },
      {
        title: "Software Engineer Intern",
        duration: "Jan 2021 to Jun 2021",
        description: (
          <div>
            Built <AboutURL href="/#">TemiPatrol</AboutURL> and{" "}
            <AboutURL href="/#">TemiNUSOhsConcierge</AboutURL>
            <SectionBreak />
          </div>
        ),
      },
    ],
  },
];

export const educationData = [
  {
    school: "National University of Singapore, School of Computing",
    certification: "Bachelor single for life",
    duration: "August 2018 to Present",
    categories: [
      {
        subheader: "Academics",
        items: [(
          <div>
            Took a MERN course and developed{" "}
            <AboutURL href="/#">rs-app-manager</AboutURL>
          </div>
        ),<div> hello </div>]
      },
      {
        subheader: "Certifications",
        items: [
          <div>
            Took a MERN course and developed{" "}
            <AboutURL href="/#">rs-app-manager</AboutURL>
          </div>,
          <div>Hello</div> 
        ],
      },
      {
        subheader: "Activities",
        items: [
          <div>
            Took a MERN course and developed{" "}
            <AboutURL href="/#">rs-app-manager</AboutURL>
          </div>,
          <div>Hello</div>
        ],
      },
    ],
  },
  {
    school: "Catholic Junior College",
    certification: "A Levels",
    duration: "I fucking forgot and I lazy to math",
    categories: [
      {
        subheader: "Academics",
        items: [(
          <div>
            Took a MERN course and developed{" "}
            <AboutURL href="/#">rs-app-manager</AboutURL>
          </div>
        ),<div>hello</div>]
      },
      {
        subheader: "Certifications",
        items: [(
          <div>
            Took a MERN course and developed{" "}
            <AboutURL href="/#">rs-app-manager</AboutURL>
          </div>
        ), <div>hello</div>]
      },
      {
        subheader: "Activities",
        items: [(
          <div>
            Took a MERN course and developed{" "}
            <AboutURL href="/#">rs-app-manager</AboutURL>
          </div>
        ), <div> hello </div>]
      },
    ],
  },
];
