import React from "react";
import { AboutURL, SectionBreak } from "../components/about/about_components";

export const experienceData = [
  {
    header: "Robosolutions",
    items: [
      {
        title: "Freelance Software Engineer",
        duration: "June 2021 to Present",
        description: (
          <div>
            Developed <AboutURL href="/projects/rsappmanager">rs-app-manager</AboutURL>
            {" - "}a company website cum MERN application that is used to manage
            the subscriptions of the applications developed by Robosolutions
            <SectionBreak />
          </div>
        ),
      },
      {
        title: "Software Engineer Intern",
        duration: "Jan 2021 to Jun 2021",
        description: (
          <div>
            Discussed requirements with clients and built customised
            applications that integrated with{" "}
            <AboutURL href="https://www.robotemi.com" target="_blank">
              temi
            </AboutURL>{" "}
            - a service robot.
            <br />
            <br />
            During my time here, I built{" "}
            <AboutURL href="/projects/temipatrol">TemiPatrol</AboutURL> which was later put on
            trial deployment at IMDA and{" "}
            <AboutURL href="/projects/temiconcierge">TemiNUSOhsConcierge</AboutURL> which was later
            deployed at NUS OHS as a concierge.
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
    certification: "Bachelor of Computing in Computer Science",
    duration: "August 2018 to Present",
    categories: [
      // {
      //   subheader: "Academics",
      //   items: [
      //     <div>
      //       Took a MERN course and developed{" "}
      //       <AboutURL href="/#">rs-app-manager</AboutURL>
      //     </div>,
      //     <div> hello </div>,
      //   ],
      // },
      {
        subheader: "External Courses",
        items: [
          <div>
            React, NodeJS, Express & MongoDB - The MERN Fullstack Guide (Udemy)
          </div>,
          <div>
            Introduction to Containers, Kubernetes, and OpenShift (Edx)
          </div>,
          <div>
            Shell Programming - A necessity for all Programmers (IIT Bombay)
          </div>,
        ],
      },
      {
        subheader: "Activities",
        items: [
          <div>
            President of NUS Skating Club
          </div>,
          <div>Received Half-Colors award for contrubitions to CCA</div>,
          <div>Singapore Polytechnic Freestyle Competition 2020 Participant</div>
        ],
      },
    ],
  },
  // {
  //   school: "Catholic Junior College",
  //   certification: "GCE 'A' Levels (86.25/90)",
  //   duration: "I fucking forgot and I lazy to math",
  //   categories: [
  //     {
  //       subheader: "Academics",
  //       items: [
  //         <div>
  //           Library Club
  //         </div>,
  //       ],
  //     },
  //     {
  //       subheader: "Activities",
  //       items: [
  //         <div>
  //           Vice President of Mathematics Society
  //         </div>,
  //       ],
  //     },
  //   ],
  // },
];
