export interface CarDetails{
  id:number;
  brand:string;
  model:string;
  price:number;
  starting_price:number;
  milleage:number,
  image:string;
  model_image:string;
  pdfUrl:string;
  features:Feature[];
  interior_images:Image[];
  exterior_images:Image[];
}

interface Image{
  path:string;
  category:string;
}
interface Feature{
  title:string;
  description:string;
  image:string;
}
