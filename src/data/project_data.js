import React from "react";

import LumitestCardImg from "../assets/project_page/card_images/completed/lumitest.png";
import TemiPatrolCardImg from "../assets/project_page/card_images/completed/temipatrol.jpg";
import TemiConciergeCardImg from "../assets/project_page/card_images/completed/temiconcierge.jpg";
import SpaCardImg from "../assets/project_page/card_images/completed/spa.jpg";
import StudyBuddyCardImg from "../assets/project_page/card_images/completed/studybuddypro.png";
import GrindCardImg from "../assets/project_page/card_images/completed/grind_orbital.jpg";
import FallDetectionCardImg from "../assets/project_page/card_images/completed/fall_detection.png";

import MahjongShifuCardImg from "../assets/project_page/card_images/ongoing/mahjong_shifu.jpg";
import RsAppCardImg from "../assets/project_page/card_images/ongoing/rs_app_manager.png";
import SchoolCardImg from "../assets/project_page/card_images/ongoing/school.jpg";

import { WEB_APP, MOBILE_APP, DESKTOP_APP } from "../utils/project_types";

export const ongoingProjects = new Map([
  [
    "/rsappmanager",
    {
      title: "RsAppManager",
      cardImg: RsAppCardImg,
      type: WEB_APP,
      summary: "Company website / MERN Application for managing subscriptions",
      stack: "MongoDB, ExpressJS, ReactJS, NodeJS",
      other: "AWS S3, Heroku, Material-UI",
      url: "https://rs-app-manager.herokuapp.com/",
      repo: "https://github.com/chanjunren/rs-app-manager",
      description: (
        <>
          <div>
            My first freelance project! I built this application after taking a
            Udemy course on MERN, and after many iterations it is what it is
            now.
          </div>
          <br />
          <h4>Features</h4>
          <ul>
            <li>CRUD Operations for Applications / Temi Units / Users</li>
            <li>Double up as a company website</li>
            <li>Company portal to access dashboards to manage data</li>
          </ul>
        </>
      ),
      images: null,
    },
  ],
  [
    "/school",
    {
      title: "School",
      cardImg: SchoolCardImg,
      type: WEB_APP,
      summary: "Last semester at NUS",
      stack: "CS2102, CS4222, SN2285",
      other: null,
      url: null,
      repo: null,
      description: <p>Last sem best sem! Also job hunting time</p>,
      images: null,
    },
  ],
  // [
  //   "/mahjongshifu",
  //   {
  //     title: "MahjongShifu",
  //     cardImg: MahjongShifuCardImg,
  //     type: WEB_APP,
  //     summary: "App To Learn React Native",
  //     stack: "MongoDB, ExpressJS, ReactJS, NodeJS",
  //     other: "AWS S3, Heroku",
  //     url: "https://rs-app-manager.herokuapp.com/",
  //     repo: "https://github.com/chanjunren/rs-app-manager",
  //     description: "FUCK this shit",
  //     images: null,
  //   },
  // ],
]);

export const completedProjects = new Map([
  [
    "/falldetection",
    {
      title: "Fall Detection",
      cardImg: FallDetectionCardImg,
      type: MOBILE_APP,
      summary: "IoT System to detect falls",
      stack: "MongoDB, ExpressJS, ReactJS, NodeJS",
      other: "AWS S3, Heroku",
      url: "https://rs-app-manager.herokuapp.com/",
      repo: "https://github.com/chanjunren/rs-app-manager",
      description: (
        <>
          <div>
            CS3237 Project - It consists of a Gateway device (phone), a wrist
            and a waist sensor tag, as well as a backend server that runs a
            neural network to process the data that is transmitted by the
            gateway from the sensortags.
          </div>
          <br />
          <div>
            If the server detects a fall - a message is transmitted to the
            gateway application and a distress message is sent out
          </div>
          <br />
          <div>
            I was responsible for the development of the Gateway application,
            where I utilised MQTT to communicate with the server and implemented
            BLE capabilities to connect and subscribe to the notifcations of the
            sensor tags.
          </div>
        </>
      ),
      images: null,
    },
  ],
  [
    "/temipatrol",
    {
      title: "TemiPatrol",
      cardImg: TemiPatrolCardImg,
      type: MOBILE_APP,
      summary:
        "Patrols areas while carrying out (no) mask detection / human clustering",
      stack: "Java",
      other: "AWS ECS, Android Studio, Figma",
      url: "https://github.com/temideveloper/Rs-App-Guides/tree/master/TemiPatrol",
      repo: null,
      description: (
        <>
          <div>
            Android Application built for temi using the Model - View - View
            Model Architecture
          </div>
          <br />
          <div>
            The mask / human clustering detection capabilities were provided by
            IMDA in the form of 2 docker repositories I then liaised with
            external parties to learn how to deploy Docker applications and host
            them using AWS EC2
          </div>
          <br />
          <div>
            Please refer to the product URL to learn more about the features of
            this application!
          </div>
        </>
      ),
      images: null,
    },
  ],
  [
    "/temiconcierge",
    {
      title: "TemiConcierge",
      cardImg: TemiConciergeCardImg,
      type: MOBILE_APP,
      summary: "Concierge Application for NUS OHS",
      stack: "Java, Android Studio",
      other: "Figma",
      url: "https://github.com/temideveloper/Rs-App-Guides/tree/master/TemiNusOhsConcierge",
      repo: null,
      description: (
        <>
          <div>
            Android Application built for temi using the Model - View - View
            Model Architecture
          </div>
          <br />
          <div>
            Please refer to the product URL to learn more about the features of
            this application!
          </div>
        </>
      ),
      images: null,
    },
  ],
  [
    "/staticprogramanalyzer",
    {
      title: "Static Program Analyzer",
      cardImg: SpaCardImg,
      type: DESKTOP_APP,
      summary:
        "Interactive tool that automatically answers queries about programs",
      stack: "C++",
      other: null,
      url: null,
      repo: "https://github.com/chanjunren/Static-Program-Analyzer",

      description: (
        <>
          <div>
            Project for CS3203 - a Software Engineering module. It is a C++
            program that parses and answers queries about programmes written in
            SIMPLE a simplified programming language.
          </div>
          <br />
          <div>
            I was responsible for implementing the top-down recursive descent
            logic to parse and validate source code. I was also the testing IC
            and oversaw testing and quality assurance of the project.
          </div>
        </>
      ),
      images: null,
    },
  ],
  [
    "/lumitest",
    {
      title: "LumiTest",
      cardImg: LumitestCardImg,
      type: DESKTOP_APP,
      summary: "Exam Proctoring Application",
      stack: "ElectronJS, Python",
      other: null,
      url: null,
      repo: "https://github.com/whneo97/ay2021-cs3103-group-9/",
      description: (
        <>
          <div>
            CS3103 Project (Computer Networks Practice) - an application that
            blocks internet access and records the screens and webcam feed
            during the duration of a test
          </div>
          <br/>
          <div>
            We used Python to perform the blocking of the internet and recording
            of videos, and ElectronJS to build the desktop application for
            taking a test.
          </div>
          <br />
          <h4>Responsibilities</h4>
          <ul>
            <li>Overall UI of ElectronJS application</li>
            <li>
              Implementation of the blocking and unblocking of internet ports
            </li>
            <li>Parsing of CSV files</li>
            <li>Integrating python functionality with the ElectronJS</li>
          </ul>
        </>
      ),
      images: null,
    },
  ],
  // [
  //   "/studybuddypro",
  //   {
  //     title: "StudyBuddy",
  //     cardImg: StudyBuddyCardImg,
  //     type: DESKTOP_APP,
  //     summary: "Revision Aid Tool",
  //     stack: "Java, Scenebuilder",
  //     other: "JUnit5, TravisCI",
  //     url: "https://github.com/",
  //     repo: "https://github.com/",
  //     description: (
  //       <>
  //         <div>
  //           Project for CS2103T - an introductory Software Engineering module
  //         </div>
  //         <br />
  //         <div>
  //           I was responsible UI/UX design, as well as implementing the logic of
  //           ‘Flashcard’ and ‘TimeTrial’ feature
  //         </div>
  //         <br />
  //         <div>
  //           Please refer to the product URL to learn more about the features of
  //           this application!
  //         </div>
  //       </>
  //     ),
  //     images: null,
  //   },
  // ],
  [
    "/grind",
    {
      title: "Grind",
      cardImg: GrindCardImg,
      type: MOBILE_APP,
      summary: "Gamified Expense Tracker",
      stack: "Java",
      other: "Android Studio, Firebase",
      url: null,
      repo: "https://github.com/chanjunren/Grind-Orbital",
      description: (
        <>
          <div>
            Project done for NUS Orbital - Received 'Apollo' level of
            achievement
          </div>
        </>
      ),
      images: null,
    },
  ],
]);
