import LumitestCardImg from '../assets/project_page/card_images/completed/lumitest.png';
import TemiPatrolCardImg from '../assets/project_page/card_images/completed/temipatrol.jpg';
import TemiConciergeCardImg from '../assets/project_page/card_images/completed/temiconcierge.jpg';
import SpaCardImg from '../assets/project_page/card_images/completed/spa.jpg';
import StudyBuddyCardImg from '../assets/project_page/card_images/completed/studybuddypro.png';
import GrindCardImg from '../assets/project_page/card_images/completed/grind_orbital.jpg';
import FallDetectionCardImg from '../assets/project_page/card_images/completed/fall_detection.png';

import MahjongShifuCardImg from '../assets/project_page/card_images/ongoing/mahjong_shifu.jpg';
import RsAppCardImg from '../assets/project_page/card_images/ongoing/rs_app_manager.png';

import { WEB_APP, MOBILE_APP, DESKTOP_APP } from '../utils/project_types';

export const ongoingProjects = new Map([
  ["/rsappmanager", {
    title: "RsAppManager",
		cardImg: RsAppCardImg,
    type: WEB_APP,
    description: "Company website / MERN Application for managing subscriptions",
    stack: 'MongoDB, ExpressJS, ReactJS, NodeJS',
    other: 'AWS S3, Heroku',
    url: "https://rs-app-manager.herokuapp.com/",
    repo: "https://github.com/chanjunren/rs-app-manager",
    life_story: "FUCK this shit",
    images: null
  }],
	["/mahjongshifu", {
    title: "MahjongShifu",
		cardImg: MahjongShifuCardImg,
    type: WEB_APP,
    description: "Company website / MERN Application for managing subscriptions",
    stack: 'MongoDB, ExpressJS, ReactJS, NodeJS',
    other: 'AWS S3, Heroku',
    url: "https://rs-app-manager.herokuapp.com/",
    repo: "https://github.com/chanjunren/rs-app-manager",
    life_story: "FUCK this shit",
    images: null
  }],
]);

export const completedProjects = new Map ([
  ["/falldetection", {
    title: "Fall Detection",
		cardImg: FallDetectionCardImg,
    type: MOBILE_APP,
    description: "Company website / MERN Application for managing subscriptions",
    stack: 'MongoDB, ExpressJS, ReactJS, NodeJS',
    other: 'AWS S3, Heroku',
    url: "https://rs-app-manager.herokuapp.com/",
    repo: "https://github.com/chanjunren/rs-app-manager",
    life_story: "FUCK this shit",
    images: null
  }],
  ["/temipatrol", {
    title: "TemiPatrol",
		cardImg: TemiPatrolCardImg,
    type: MOBILE_APP,
    description: "Patrols areas while carrying out (no) mask detection / human clustering",
  stack: 'Java',
    other: 'AWS ECS, Android Studio, Figma',
    url: "https://github.com/temideveloper/Rs-App-Guides/tree/master/TemiPatrol",
    repo: null,
    life_story: "FUCK this shit",
    images: null
  }],
  ["/temiconcierge", {
    title: "TemiConcierge",
		cardImg: TemiConciergeCardImg,
    type: MOBILE_APP,
    description: "Concierge Application for NUS OHS",
    stack: 'Java, Android Studio',
    other: 'Figma',
    url: "https://github.com/temideveloper/Rs-App-Guides/tree/master/TemiNusOhsConcierge",
    repo: null,
    life_story: "FUCK this shit",
    images: null
  }],
  ["/staticprogramanalyzer", {
    title: "Static Program Analyzer",
		cardImg: SpaCardImg,
    type: DESKTOP_APP,
    description: "Interactive tool that automatically answers queries about programs",
    stack: 'C++',
    other: null,
    url: null,
    repo: "https://github.com/chanjunren/Static-Program-Analyzer",
    life_story: "I was the testing IC dog for this",
    images: null
  }],
  ["/lumitest", {
    title: "LumiTest",
		cardImg: LumitestCardImg,
    type: DESKTOP_APP,
    description: "Exam Proctoring Application",
    stack: 'ElectronJS, Python',
    other: null,
    url: null,
    repo: "https://github.com/chanjunren/rs-app-manager",
    life_story: "FUCK this shit",
    images: null
  }],
  ["/studybuddypro", {
    title: "StudyBuddyPro",
		cardImg: StudyBuddyCardImg,
    type: DESKTOP_APP,
    description: "Revision Aid Tool",
    stack: 'MongoDB, ExpressJS, ReactJS, NodeJS',
    other: 'AWS S3, Heroku',
    url: "https://rs-app-manager.herokuapp.com/",
    repo: "https://github.com/chanjunren/rs-app-manager",
    life_story: "FUCK this shit",
    images: null
  }],
  ["/grind", {
    title: "Grind",
		cardImg: GrindCardImg,
    type: MOBILE_APP,
    description: "Gamified Expense Tracker",
    stack: 'Java',
    other: 'Android Studio, Firebase',
    url: null,
    repo: "https://github.com/chanjunren/Grind-Orbital",
    life_story: "FUCK this shit",
    images: null
  }],
]);
