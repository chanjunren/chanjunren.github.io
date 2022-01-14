import React from 'react'
import TemplatePage from '../../components/projects/template';
import { ongoingProjects } from '../../data/project_data';

const School = () => {
  return (
    <TemplatePage {...ongoingProjects.get('/school')}/>
  )
}

export default School;
