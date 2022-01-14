import React from 'react'
import TemplatePage from '../../components/projects/template';
import { completedProjects } from '../../data/project_data';

const StudyBuddyPro = () => {
  return (
    <TemplatePage {...completedProjects.get('/studybuddypro')}/>
  )
}

export default StudyBuddyPro;
