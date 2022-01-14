import React from 'react'
import TemplatePage from '../../components/projects/template';
import { completedProjects } from '../../data/project_data';

const FallDetection = () => {
  return (
    <TemplatePage {...completedProjects.get('/falldetection')}/>
  )
}

export default FallDetection;
