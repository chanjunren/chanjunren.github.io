import React, { ReactElement } from "react";

export type ProjectInfo = {
  card: React.FC;
};

export type GalleryCardProps = {
  selected: boolean;
  cardImgClass?: string;
  card: string | ReactElement;
  mini: boolean;
  label: string;
  onClick: () => void;
};

export type GalleryProject = {
  id: string;
  mainDisplay?: React.FC; // What is shown in the spotlight when gallery card is selected
  card: string | ReactElement;
  title: string;
  dob: string;
  badges?: BadgeType[];
  cardImgClass?: string;
  description: React.FC;
};

export type BadgeType =
  | "THREE_JS"
  | "DOCUSAURUS"
  | "REACT"
  | "BLENDER"
  // | "GLSL"
  | "MY_LOVE";
