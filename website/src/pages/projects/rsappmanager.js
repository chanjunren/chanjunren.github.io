import React from 'react'
import TemplatePage from '../../components/projects/template';
import { completedProjects } from '../../data/project_data';

const RsAppManager = () => {
  return (
    <TemplatePage {...completedProjects.get('/rsappmanager')}/>
  )
}

export default RsAppManager;
