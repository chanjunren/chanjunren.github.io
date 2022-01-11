import React from "react";
import Layout from "@theme/Layout";
import * as animationData from "../../assets/project-page/project-animation.json";

import styles from "./index.module.css";
import Grid from "@mui/material/Grid";
import Lottie from "react-lottie";

export default function ProjectsPage() {

  const lottieOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <Layout>
      <Grid className={styles.projectsContainer} container>
        <Grid class={styles.animationContainer} item xs={12}>
          <Lottie
            options={lottieOptions}
            height={250}
            width={250}
          />
        </Grid>
        <Grid item xs={12}>
          <h3>Ongoing</h3>
        </Grid>
        <Grid item container xs={12}>
          {/* Ongoing Projects */}
        </Grid>
        <Grid item xs={12}>
          <h3>Completed</h3>
        </Grid>
        <Grid item container xs={12}>
          {/* Completed Projects */}
        </Grid>
      </Grid>
    </Layout>
  );
}
