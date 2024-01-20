export interface CarForm{
  brand:string;
  price:number;
  model:string;
  condition:string;
  milleage:number;
  features:Feature[],
  car_model_image:File,
  exterior_images:File[],
  interior_images:File[],
  brochure_pdf:File;
}

export interface Feature{
  description:string;
  title:string;
  image:File;
}
