import React from 'react'
import TemplatePage from '../../components/projects/template';
import { completedProjects } from '../../data/project_data';

const Lumitest = () => {
  return (
    <TemplatePage {...completedProjects.get('/lumitest')}/>
  )
}

export default Lumitest;
