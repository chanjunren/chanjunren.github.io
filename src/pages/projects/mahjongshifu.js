import React from 'react'
import TemplatePage from '../../components/projects/template';
import { ongoingProjects } from '../../data/project_data';

const MahjongShifu = () => {
  return (
    <TemplatePage {...ongoingProjects.get('/mahjongshifu')}/>
  )
}

export default MahjongShifu;
