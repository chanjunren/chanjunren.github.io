import React from "react";

export type ProjectInfo = {
  card: React.FC;
};

export type GalleryCard = {
  selected: boolean;
  cardImgClass?: string;
  card: string | React.FC<GalleryCustomCard>;
  mini: boolean;
  label: string;
  onClick: () => void;
};

export type GalleryProjectInfo = {
  id: string;
  mainDisplay?: React.FC; // What is shown in the spotlight when gallery card is selected
  card: string | React.FC<GalleryCustomCard>;
  title: string;
  dob: string;
  badges?: BadgeType[];
  cardImgClass?: string;
  description: React.FC;
};

export type GalleryCustomCard = {
  onClick: () => void;
};

export type BadgeType =
  | "THREE_JS"
  | "DOCUSAURUS"
  | "REACT"
  | "BLENDER"
  // | "GLSL"
  | "MY_LOVE";
