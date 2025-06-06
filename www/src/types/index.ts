import React from "react";

export type ProjectInfo = {
  card: React.FC;
};

export type GalleryCard = {
  onClick: () => void;
  info: GalleryProjectInfo;
};

export type GalleryProjectInfo = {
  id: string;
  banner?: React.FC; // What is shown in the spotlight when gallery card is selected
  card: string | React.FC<GalleryCustomCard>;
  containerCss?: string;
  title: string;
  displayTitle?: boolean;
  displayNav?: boolean;
  subtitle: string;
  description: React.FC;
  repository?: string;
  extraButtons?: React.FC<PropsWithClassName>;
  metadata?: React.FC;
};

export type PropsWithClassName = {
  className?: string;
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
