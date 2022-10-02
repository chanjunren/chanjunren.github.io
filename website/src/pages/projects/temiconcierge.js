import React from 'react'
import TemplatePage from '../../components/projects/template';
import { completedProjects } from '../../data/project_data';

const TemiConcierge = () => {
  return (
    <TemplatePage {...completedProjects.get('/temiconcierge')}/>
  )
}

export default TemiConcierge;
