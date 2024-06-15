export type GalleryCardProps = {
  selected: boolean;
  cardImgClass?: string;
  mini: boolean;
};

export type GalleryProject = {
  id: string;
  // What is shown in the spotlight when gallery card is selected
  display: React.FC;
  cardUrl: string;
  dob: string;
  tags?: string[];
  cardImgClass?: string;
};
