export type GalleryCardProps = {
  selected: boolean;
};

export type GalleryProject = {
  id: string;
  // What is shown in the spotlight when gallery card is selected
  display?: React.FC;
  card: React.FC<GalleryCardProps>;
  dob: string;
  tags?: string[];
};
