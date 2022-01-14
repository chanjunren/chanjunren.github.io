import React from 'react'
import TemplatePage from '../../components/projects/template';
import { completedProjects } from '../../data/project_data';

const Spa = () => {
  return (
    <TemplatePage {...completedProjects.get('/spa')}/>
  )
}

export default Spa;
