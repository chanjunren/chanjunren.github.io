import React from "react";

export type ProjectInfo = {
  card: React.FC;
};

export type GalleryCardProps = {
  selected: boolean;
  cardImgClass?: string;
  mini: boolean;
  label: string;
};

export type GalleryProject = {
  id: string;
  mainDisplay?: React.FC; // What is shown in the spotlight when gallery card is selected
  cardUrl: string;
  title: string;
  dob: string;
  badges?: BadgeType[];
  cardImgClass?: string;
  description: React.FC;
};

export type BadgeType =
  | "THREE_JS"
  | "DOCUSAURUS"
  // | "REACT"
  | "BLENDER"
  // | "GLSL"
  | "MY_LOVE";
