import React from 'react'
import TemplatePage from '../../components/projects/template';
import { completedProjects } from '../../data/project_data';

const TemiPatrol = () => {
  return (
    <TemplatePage {...completedProjects.get('/temipatrol')}/>
  )
}

export default TemiPatrol;
