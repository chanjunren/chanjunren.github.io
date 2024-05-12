export type GalleryProject = {
  id: string;
  // What is shown in the spotlight when gallery card is selected
  display?: React.FC;
  card: React.FC;
  dob: string;
  tags?: string[];
};
