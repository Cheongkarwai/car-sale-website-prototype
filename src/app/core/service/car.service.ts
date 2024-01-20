import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, map} from "rxjs";
import {CarCard} from "../model/car-card.interface";
import {Page} from "../model/page.interface";
import {CarDetails} from "../model/car-details.interface";
import {CarBrochure} from "../model/car-brochure.interface";
import {Color} from "../model/color.interface";
import {Condition} from "../model/condition.interface";
import {CarModel} from "../model/car-model.interface";
import {CarForm} from "../model/car-form.interface";
import {UsedCarForm} from "../model/used-car-form.interface";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private url = `${environment.api_url}/cars`

  private carCards$ = new BehaviorSubject<CarCard[]>([]);
  private carBrochures$ = new BehaviorSubject<CarBrochure[]>([]);
  private carDetails$ = new BehaviorSubject<CarDetails | null>(null);
  private carColors$ = new BehaviorSubject<Color[]>([]);
  private cars$ = new BehaviorSubject<Page<CarDetails> | null>(null);
  private conditions$ = new BehaviorSubject<Condition[]>([]);
  private carModels$ = new BehaviorSubject<CarModel[]>([])

  constructor(private httpClient: HttpClient) {
  }

  findAllCarCards(params?: HttpParams, headers?: HttpHeaders) {
    this.httpClient.get<Page<CarDetails>>(this.url, {params: params, headers: headers})
      .pipe(map(e => {
        e.content.map(e => {
          return {
            id: e.id,
            brand: e.brand,
            model: e.model,
            price: e.price,
            image: e.image
          } as CarCard
        })
        return e;
      })).subscribe(res => this.carCards$.next(res.content));
  }

  findAllCars(params?: HttpParams, headers?: HttpHeaders) {
    this.httpClient.get<Page<CarDetails>>(this.url, {params: params, headers: headers})
      .subscribe(res => this.cars$.next(res));
  }

  getCars$() {
    return this.cars$.asObservable();
  }

  getCarCards$() {
    return this.carCards$.asObservable();
  }

  findCarById(id: number, params?: HttpParams, headers?: HttpHeaders) {
    this.httpClient.get<CarDetails>(`${this.url}/${id}`)
      .subscribe(res => {
        this.carDetails$.next(res);
      });
  }

  findCarDetailsById(id: number, params?: HttpParams, headers?: HttpHeaders) {
    this.httpClient.get<CarDetails>(`${this.url}/${id}/details`)
      .subscribe(res => {
        this.carDetails$.next(res);
      });
  }

  getCarDetails$() {
    return this.carDetails$.asObservable();
  }

  findAllCarBrochures(params?: HttpParams, headers?: HttpHeaders) {
    this.httpClient.get<Page<CarDetails>>(this.url, {params: params, headers: headers})
      .pipe(map(page => {
        return page.content.map(car => {
          return {
            id: car.id,
            brand: car.brand,
            model: car.model,
          } as CarBrochure;
        })
      }))
      .subscribe(res => this.carBrochures$.next(res));
  }


  findAllCarsColorByModelName(modelName: string, params?: HttpParams, headers?: HttpHeaders) {
    this.httpClient.get<Color[]>(`${this.url}/${modelName}/colors`, {params: params, headers: headers})
      .subscribe(colors => this.carColors$.next(colors));
  }

  getCarColors() {
    return this.carColors$.asObservable();
  }

  getCarBrochures$() {
    return this.carBrochures$.asObservable();
  }


  findAllConditions() {
    this.httpClient.get<Condition[]>(`${this.url}/conditions`)
      .pipe(map(conditions => conditions.map(condition => {
        if (condition.title === 'NEW') {
          condition.selected = true;
        }
        return condition;
      })))
      .subscribe(conditions => this.conditions$.next(conditions));
  }

  getConditions$() {
    return this.conditions$.asObservable();
  }

  findAllCarsModel(condition?: string) {

    let params = new HttpParams();
    if (condition) {
      params = params.set('condition', condition);
    }

    this.httpClient.get<CarModel[]>(`${this.url}/model`, {params: params})
      .subscribe(models => this.carModels$.next(models))
  }

  getCarModels$() {
    return this.carModels$.asObservable();
  }

  deleteById(id: number) {
    return this.httpClient.delete(`${this.url}/${id}`);
  }

  saveUsedCar(carForm:UsedCarForm){
    const formData = new FormData();
    const {
      brand, price, model, milleage, condition,
    } = carForm;
    const carBody = {
      brand: brand,
      model: model,
      starting_price: price,
      condition: condition,
      milleage:milleage
    }
    formData.append("car", new Blob([JSON.stringify(carBody)], {type: 'application/json'}));
    formData.append("car_model_image", carForm.car_model_image);

    return this.httpClient.post(`${this.url}/used`, formData);
  }

  save(carForm: CarForm) {
    const formData = new FormData();
    const {
      brand, price, model, features, condition, milleage,
    } = carForm;
    const carBody = {
      brand: brand,
      model: model,
      starting_price: price,
      condition: condition,
      milleage: milleage,
      features: features.map(feature => {
        return {
          title: feature.title,
          description: feature.description
        };
      })
    };

    formData.append("car", new Blob([JSON.stringify(carBody)], {type: 'application/json'}));
    formData.append("car_model_image", carForm.car_model_image);

   if(condition === 'NEW'){
        // @ts-ignore
        formData.append("brochure_pdf", carForm.brochure_pdf);

        for (let image of carForm.exterior_images) {
          formData.append("exterior_images", image);
        }
        for (let image of carForm.interior_images) {
          formData.append("interior_images", image);
        }
        const featureImage = features.map(feature => feature.image);

        for (let image of featureImage) {
          formData.append("feature_images", image);
        }

    }
    return this.httpClient.post(`${this.url}`, formData);
  }

  edit(id:number,carForm: CarForm) {
    const formData = new FormData();
    const {
      brand, price, model, features, condition, milleage,
    } = carForm;
    const carBody = {
      brand: brand,
      model: model,
      starting_price: price,
      condition: condition,
      milleage: milleage,
      features: features.map(feature => {
        return {
          title: feature.title,
          description: feature.description
        };
      })
    };
    // @ts-ignore
    formData.append("car", new Blob([JSON.stringify(carBody)], {type: 'application/json'}));
    formData.append("car_model_image", carForm.car_model_image);

   if(condition === 'NEW'){
     formData.append("car_model_image", carForm.car_model_image);
     formData.append("brochure_pdf", carForm.brochure_pdf);

     for (let image of carForm.exterior_images) {
       formData.append("exterior_images", image);
     }
     for (let image of carForm.interior_images) {
       formData.append("interior_images", image);
     }
     const featureImage = features.map(feature => feature.image);

     for (let image of featureImage) {
       formData.append("feature_images", image);
     }
   }
    return this.httpClient.put(`${this.url}/${id}`, formData);
  }
}
