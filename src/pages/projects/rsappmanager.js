import React from 'react'
import TemplatePage from '../../components/projects/template';
import { ongoingProjects } from '../../data/project_data';

const RsAppManager = () => {
  return (
    <TemplatePage {...ongoingProjects.get('/rsappmanager')}/>
  )
}

export default RsAppManager;
