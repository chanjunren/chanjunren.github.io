import LumitestCardImg from '../assets/project_page/card_images/completed/lumitest.png';
import TemiPatrolCardImg from '../assets/project_page/card_images/completed/temipatrol.jpg';
import TemiConciergeCardImg from '../assets/project_page/card_images/completed/temiconcierge.jpg';
import SpaCardImg from '../assets/project_page/card_images/completed/spa.jpg';
import StudyBuddyCardImg from '../assets/project_page/card_images/completed/studybuddypro.png';
import GrindCardImg from '../assets/project_page/card_images/completed/grind_orbital.jpg';
import FallDetectionCardImg from '../assets/project_page/card_images/completed/fall_detection.png';

import MahjongShifuCardImg from '../assets/project_page/card_images/ongoing/mahjong_shifu.jpg';
import RsAppCardImg from '../assets/project_page/card_images/ongoing/rs_app_manager.png';

export const ongoingProjects = [
  {
    title: "RsAppManager",
		cardImg: RsAppCardImg,
    type: "",
    description: "Company website cum MERN Application for managing subscriptions",
    path: "",
    stack: ['MongoDB', 'ExpressJS', 'ReactJS', 'NodeJS'],
    other: ['AWS S3', 'Heroku'],
    images: [],
    productUrl: ""
  },
	{
    title: "MahjongShifu",
		cardImg: MahjongShifuCardImg,
    type: "",
    description: "Project for learning React-Native",
    path: "",
  },
];

export const completedProjects = [
  {
    title: "Fall Detection",
		cardImg: FallDetectionCardImg,
    type: "",
    description: "IoT system that detects falls",
    path: "",
  },
	{
    title: "TemiPatrol",
		cardImg: TemiPatrolCardImg,
    type: "",
    description: "Patrols areas while carrying out (no) mask detection / human clustering",
    path: "",
  },
	{
    title: "TemiConcierge",
		cardImg: TemiConciergeCardImg,
    type: "",
    description: "Concierge Application for NUS OHS",
    path: "",
  },
	{
    title: "Static Program Analyzer",
		cardImg: SpaCardImg,
    type: "",
    description: "Interactive tool that automatically answers queries about programs",
    path: "",
  },
	{
    title: "LumiTest",
		cardImg: LumitestCardImg,
    type: "",
    description: "Exam Proctoring Application",
    path: "",
  },
	{
    title: "StudyBuddyPro",
		cardImg: StudyBuddyCardImg,
    type: "",
    description: "Revision Aid Tool",
    path: "",
  },
	{
    title: "Grind",
		cardImg: GrindCardImg,
    type: "",
    description: "Gamified Expense Tracker",
    path: "",
  },
];
