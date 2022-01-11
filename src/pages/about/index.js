import React from "react";
import Layout from "@theme/Layout";

import styles from "./index.module.css";
import { Grid, Typography } from "@mui/material";

export default function AboutPage() {
  return (
    <Layout>
      <Grid container>
        <Grid item>
          <Typography> Header Test</Typography>
        </Grid>
        <Grid item>
          <Typography>Item Test</Typography>
        </Grid>
        <Grid item>
          <div> Hello </div>
        </Grid>
      </Grid>
    </Layout>
  );
}
