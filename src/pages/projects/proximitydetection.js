import React from 'react'
import TemplatePage from '../../components/projects/template';
import { completedProjects } from '../../data/project_data';

const ProximityDetection = () => {
  console.log("Hello");
  return (
    <TemplatePage {...completedProjects.get('/proximitydetection')}/>
  )
}

export default ProximityDetection;
