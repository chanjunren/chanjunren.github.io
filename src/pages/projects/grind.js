import React from 'react'
import TemplatePage from '../../components/projects/template';
import { completedProjects } from '../../data/project_data';

const Grind = () => {
  return (
    <TemplatePage {...completedProjects.get('/grind')}/>
  )
}

export default Grind;
