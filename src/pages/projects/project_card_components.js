import React from 'react';
import Grid from "@mui/material/Grid";
import { styled } from "@mui/system";

export const ProjectCardRoot = styled((props) => <Grid {...props}/>)({
  height: '100%',
})

export const ProjectCardImage = styled('img')({
  borderRadius: '12px',
  width: '100%'
})

export const ProjectCardContentWrapper = styled('div')({
  display: 'grid',
  justifyContent: 'center',
  width: '100%',
});

export const ProjectCardHeader = styled('h4')({
  textAlign: 'center'
});

export const ProjectCardDesc = styled('p')({
  textAlign: 'center'
});
